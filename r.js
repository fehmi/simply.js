(function () {
  'use strict';

  // /@ts-check
  /**
   * @typedef {Object} Assignment
   * @property {string} name of item the assignment is targeting
   * @property {string} url fragment to be assigned to the item
   */
  /**
   * @typedef {Object} ParseNamedOutletAssignment
   * @property {string} elementTag
   * @property {Map} data
   * @property {Object} options
   * @property {string} options.import
   */

  /**
   * @typedef {Object} NamedMatch
   * @property {string} name of the route or outlet to assign to
   * @property {string} url - The assignment url that was matched and consumed
   * @property {string} urlEscaped - The url that was matched and consumed escaped of certain characters that will break the url on servers.
   * @property {boolean} cancelled - If a failed attempt at assignment was made
   * @property {ParseNamedOutletAssignment} namedOutlet - Any named outlet assignments found
   */
  /**
   * Registry for named routers and outlets.
   * Simplifies nested routing by being able to target specific routers and outlets in a link.
   * Can act as a message bus of sorts. Named items being the handlers and assignments as the messages.
   */
  class NamedRouting {
    /**
     * Adds a router or outlet to the registry
     * @param {import('./models').NamedRoutingHandler} item to add
     */
    static async addNamedItem(item) {
      const name = item.getName();
      if (name) {
        if (NamedRouting.registry[name]) {
          throw Error(`Error adding named item ${name}, item with that name already registered`);
        }
        NamedRouting.registry[name] = item;
        const assignment = NamedRouting.getAssignment(name);
        if (assignment && item.canLeave(assignment.url)) {
          await item.processNamedUrl(assignment.url);
        }
      }
    }

    /** Removes an item by name from the registry if it exists. */
    static removeNamedItem(name) {
      if (NamedRouting.registry[name]) {
        delete NamedRouting.registry[name];
      }
    }

    /** Gets an item by name from the registry */
    static getNamedItem(name) {
      return NamedRouting.registry[name];
    }

    /** Gets an assignment from the registry */
    static getAssignment(name) {
      return NamedRouting.assignments[name];
    }

    /**
     * Add an assignment to the registry. Will override an assignment if one already exists with the same name.
     * @param {string} name the name of the named item to target with the assignment
     * @param {string} url to assign to the named item
     * @returns {Promise<import('./routes-route').Match|boolean>} when assignment is completed. false is returned if the assignment was cancelled for some reason.
     */
    static async addAssignment(name, url) {
      const lastAssignment = NamedRouting.assignments[name];
      NamedRouting.assignments[name] = {
        name,
        url
      };
      const namedItem = NamedRouting.getNamedItem(name);
      if (namedItem) {
        if (namedItem.canLeave(url) === false) {
          NamedRouting.assignments[name] = lastAssignment;
          return false;
        }
        await namedItem.processNamedUrl(url);
      }
      return true;
    }

    /** Removes an assignment from the registry */
    static removeAssignment(name) {
      if (NamedRouting.assignments[name]) {
        delete NamedRouting.assignments[name];
        return true;
      }
      return false;
    }

    /** @returns {string} Serializes the current assignments into URL representation. */
    static generateNamedItemsUrl() {
      return Object.values(NamedRouting.assignments).reduce((url, assignment) => `${url.length ? '::' : ''}${NamedRouting.generateUrlFragment(assignment)}`, '');
    }

    /** Serializes an assignment for URL. */
    static generateUrlFragment(assignment) {
      // Polymer server does not like the period in the import statement
      return `(${assignment.name}:${assignment.url.replace(/\./g, '_dot_')})`;
    }

    /**
     * Parses a URL section and tries to get a named item from it.
     * @param {string} url containing the assignment and the named item
     * @param {boolean} [suppressAdding] of the assignment and only return the match in a dry run
     * @returns {Promise<NamedMatch|null>} null if not able to parse. If we are adding the named item then the promise is resolved when item is added and any routing has taken place.
     */
    static async parseNamedItem(url, suppressAdding) {
      let _url = url;
      if (_url[0] === '/') {
        _url = _url.substr(1);
      }
      if (_url[0] === '(') {
        _url = _url.substr(1, _url.length - 2);
      }
      const match = _url.match(/^\/?\(?([\w_-]+)\:(.*)\)?/);
      if (match) {
        // Polymer server does not like the period in the import statement
        const urlEscaped = match[2].replace(/_dot_/g, '.');
        let cancelled = false;
        if (suppressAdding !== true) {
          if ((await NamedRouting.addAssignment(match[1], urlEscaped)) === false) {
            cancelled = true;
          }
        }
        return {
          name: match[1],
          url: match[2],
          urlEscaped,
          cancelled,
          namedOutlet: NamedRouting.parseNamedOutletUrl(match[2])
        };
      }
      return null;
    }

    /**
     * Takes a url for a named outlet assignment and parses
     * @param {string} url
     * @returns {ParseNamedOutletAssignment|null} null is returned if the url could not be parsed into a named outlet assignment
     */
    static parseNamedOutletUrl(url) {
      const match = url.match(/^([/\w-]+)(\(.*?\))?(?:\:(.+))?/);
      if (match) {
        const data = new Map();
        if (match[3]) {
          const keyValues = match[3].split('&');
          for (let i = 0, iLen = keyValues.length; i < iLen; i++) {
            const keyValue = keyValues[i].split('=');
            data.set(decodeURIComponent(keyValue[0]), decodeURIComponent(keyValue[1]));
          }
        }
        const elementTag = match[1];
        let importPath = match[2] && match[2].substr(1, match[2].length - 2);
        const inferredElementTag = NamedRouting.inferCustomElementTagName(elementTag);
        if (inferredElementTag === null) {
          return null;
        }
        if (!importPath) {
          importPath = NamedRouting.inferCustomElementImportPath(elementTag, inferredElementTag);
        }
        const options = {
          import: importPath
        };
        return {
          elementTag: inferredElementTag,
          data,
          options
        };
      }
      return null;
    }

    /**
     * @param {string} importStyleTagName
     * @param {string} elementTag
     * @returns {string} the custom element import path inferred from the import style string
     */
    static inferCustomElementImportPath(importStyleTagName, elementTag) {
      if (customElements.get(elementTag) !== undefined) {
        // tag is loaded. no need for import.
        return undefined;
      }
      let inferredPath = importStyleTagName;
      const lastForwardSlash = inferredPath.lastIndexOf('/');
      if (lastForwardSlash === -1) {
        inferredPath = `/${inferredPath}`;
      }
      const dotIndex = inferredPath.indexOf('.');
      if (dotIndex === -1) {
        inferredPath += '.js';
      }
      return inferredPath;
    }

    /**
     * @param {string} elementTag
     * @returns {string} the custom element tag name inferred from import style string
     */
    static inferCustomElementTagName(elementTag) {
      let inferredTagName = elementTag;

      // get class name from path
      const lastForwardSlash = inferredTagName.lastIndexOf('/');
      if (lastForwardSlash > -1) {
        inferredTagName = inferredTagName.substring(lastForwardSlash + 1);
      }

      // get class name from file name
      const dotIndex = inferredTagName.indexOf('.');
      if (dotIndex > -1) {
        inferredTagName = inferredTagName.substring(0, dotIndex - 1);
      }

      // to kebab case
      inferredTagName = inferredTagName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      if (inferredTagName.indexOf('-') === -1) {
        inferredTagName = null;
      }
      return inferredTagName;
    }

    /**
     * Pre-fetches an import module so that it is available when the link is activated
     * @param {NamedMatch} namedAssignment item assignment
     * @returns {Promise} resolves when the import is completed
     */
    static async prefetchNamedOutletImports(namedAssignment) {
      if (namedAssignment.namedOutlet && namedAssignment.namedOutlet.options && namedAssignment.namedOutlet.options.import) {
        await NamedRouting.pageReady();
        await NamedRouting.importCustomElement(namedAssignment.namedOutlet.options.import, namedAssignment.namedOutlet.elementTag);
      }
    }

    /**
     * Imports a script for a customer element once the page has loaded
     * @param {string} importSrc
     * @param {string} tagName
     */
    static async prefetchImport(importSrc, tagName) {
      await NamedRouting.pageReady();
      await NamedRouting.importCustomElement(importSrc, tagName);
    }

    /**
     * Imports a script for a customer element
     * @param {string} importSrc
     * @param {string} tagName
     */
    static async importCustomElement(importSrc, tagName) {
      if (importSrc && customElements.get(tagName) === undefined) {
        // @ts-ignore
        await import( /* webpackIgnore: true */importSrc);
      }
    }

    /**
     *
     */
    static pageReady() {
      if (!NamedRouting.pageReadyPromise) {
        NamedRouting.pageReadyPromise = document.readyState === 'complete' ? Promise.resolve() : new Promise((resolve, reject) => {
          /** handle readystatechange callback */
          const callback = () => {
            if (document.readyState === 'complete') {
              document.removeEventListener('readystatechange', callback);
              resolve();
            }
          };
          document.addEventListener('readystatechange', callback);
        });
      }
      return NamedRouting.pageReadyPromise;
    }

    /**
     * Called just before leaving for another route.
     * Fires an event 'routeOnLeave' that can be cancelled by preventing default on the event.
     * @fires RouteElement#onRouteLeave
     * @param {*} newRoute - the new route being navigated to
     * @returns bool - if the currently active route can be left
     */
    static canLeave(newRoute) {
      /**
       * Event that can be cancelled to prevent this route from being navigated away from.
       * @event RouteElement#onRouteLeave
       * @type CustomEvent
       * @property {Object} details - The event details
       * @property {RouteElement} details.route - The RouteElement that performed the match.
       */
      const canLeaveEvent = new CustomEvent('onRouteLeave', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          route: newRoute
        }
      });
      // @ts-ignore
      // This method is designed to be bound to a Custom Element instance. It located in here for general visibility.
      this.dispatchEvent(canLeaveEvent);
      return !canLeaveEvent.defaultPrevented;
    }
  }
  NamedRouting.pageReadyPromise = undefined;
  NamedRouting.registry = {};
  /** @type {{[k: string]: Assignment}} */
  NamedRouting.assignments = {};

  /** RouterElement */
  class RouterElement extends HTMLElement {
    /**
     * Event handler for handling when child router is added.
     * This function is called in the scope of RouterElement for the top level collection of routers and instances of RouterElement for nested router collections.
     * Used to link up RouterElements with child RouterElements even through Shadow DOM.
     * @param {CustomEvent} event - routerAdded event
     */
    static handlerAddRouter(event) {
      RouterElement.addRouter.call(this, event.detail.router);
      event.stopPropagation();
      event.detail.parentRouter = this;
    }

    /** @param {CustomEvent} event Handles routerLinksAdded event and registers the RouterLink added */
    static handlerRouterLinksAdded(event) {
      if (event.detail.links) {
        event.detail.onRegistered = RouterElement.registerLinks(event.detail.links);
      }
    }

    /**
     * Handles the navigate event and initiates browser navigation
     * @param {CustomEvent} event the navigate event
     */
    static handlerNavigate(event) {
      if (event.detail.href) {
        event.detail.onNavigated = RouterElement.navigate(event.detail.href);
      }
    }

    /**
     * Used to link up RouterElements with child RouterElements even through Shadow DOM.
     * @param {RouterElement} router - routerElement to add. RouterElement after the first can be thought of as auxillary RouterElements
     */
    static addRouter(router) {
      this._routers.push(router);
    }

    /**
     * Removes a RouterElement from the routing process.
     * @param {RouterElement} routerElement to be removed
     */
    static removeRouter(routerElement) {
      const routerIndex = this._routers.indexOf(routerElement);
      if (routerIndex > -1) {
        this._routers.splice(routerIndex, 1);
      }
    }

    /**
     * Global handler for hash changes
     */
    static changeHash() {
      // TODO
      // let hash = RouterElement._getHash();
      // RouterElement.dispatch(_changeHash(hash));
    }

    /**
     * Global handler for url changes.
     * Should be called if the user changes the URL via the URL bar or navigating history
     * @return {Promise<boolean>} true if the new url was dispatched to the top level RouterElement
     */
    static async changeUrl() {
      const hash = RouterElement._getHash();
      const path = decodeURIComponent(window.location.pathname);
      const query = window.location.search.substring(1);
      const oldRoute = RouterElement._route;
      if (!RouterElement._initialized) {
        return false;
      }
      if (oldRoute.path === path && oldRoute.query === query && oldRoute.hash === hash) {
        // Nothing to do, the current URL is a representation of our properties.
        return false;
      }
      const newUrl = RouterElement._getUrl(window.location);
      await RouterElement.dispatch(newUrl, true);
      return true;
    }

    /**
     * Global handler for page clicks. Filters out and handles clicks from links.
     * @param {(MouseEvent|HTMLAnchorElement|string)} navigationSource - The source of the new url to navigate to. Can be a click event from clicking a link OR an anchor element OR a string that is the url to navigate to.
     */
    static async navigate(navigationSource) {
      let event = null;
      let anchor = null;
      if (navigationSource instanceof Event) {
        event = navigationSource;

        // If already handled and canceled
        if (event.defaultPrevented) {
          return;
        }
      } else if (typeof navigationSource !== 'string') {
        anchor = navigationSource;
      }
      const href = RouterElement._getSameOriginLinkHref(navigationSource);
      if (href === null) {
        return;
      }
      if (!href) {
        const target = event && event.target || anchor;
        if (target) {
          /**
           * Event that fires if a link is not handled due to it not being same origin or base url.
           * @event RouterElement#onRouteCancelled
           * @type CustomEvent
           * @property {Object} details - The event details
           * @property {RouteElement} details.url - The url that was trying to be matched.
           */
          target.dispatchEvent(new CustomEvent('onRouteNotHandled', {
            bubbles: true,
            composed: true,
            detail: {
              href
            }
          }));
        }
        return;
      }
      event && event.preventDefault();

      // If the navigation is to the current page we shouldn't add a history
      // entry or fire a change event.
      if (href === window.location.href) {
        return;
      }
      const url = new URL(href);
      const newUrl = RouterElement._getUrl(url);
      await RouterElement.dispatch(newUrl);
    }

    /**
     * Clears all current match information for all available routers.
     * This initializes ready for the next matching.
     */
    static prepareRoutersForDispatch(routers) {
      const _routers = routers || RouterElement._routers || [];
      _routers.forEach(router => {
        router.clearCurrentMatch();
        const childRouters = router._routers;
        this.prepareRoutersForDispatch(childRouters);
      });
    }

    /**
     * Common entry point that starts the routing process.
     * @param {string} url
     * @param {boolean} [skipHistory]
     * @fires RouterElement#onRouteCancelled
     */
    static async dispatch(url, skipHistory) {
      // console.info('dispatch: ' + url);
      const basePath = RouterElement.baseUrlSansHost();
      const shortUrl = url.substr(basePath.length);
      RouterElement._route = {
        url: shortUrl
      };

      // Check if all current routes wil let us navigate away
      if (RouterElement._activeRouters.length && RouterElement._activeRouters.every(r => r.route.canLeave(RouterElement._route)) === false) {
        /**
         * Event that fires if a RouteElement refuses to let us perform routing.
         * @event RouterElement#onRouteCancelled
         * @type CustomEvent
         * @property {Object} details - The event details
         * @property {RouteElement} details.url - The url that was trying to be matched.
         */
        RouterElement._activeRouters[0].router.dispatchEvent(new CustomEvent('onRouteCancelled', {
          bubbles: true,
          composed: true,
          detail: {
            shortUrl
          }
        }));
        return;
      }
      RouterElement._activeRouters = [];
      this.prepareRoutersForDispatch();
      if (RouterElement._routers.length === 0) {
        this._currentMatch = {
          remainder: shortUrl,
          data: null,
          redirect: null,
          url: '',
          useCache: false
        };
        this.hasMatch = false;
      }
      if ((await RouterElement.performMatchOnRouters(shortUrl, RouterElement._routers)) && skipHistory !== true) {
        RouterElement.updateHistory(url);
        RouterElement.updateAnchorsStatus();
      }
    }

    /** Updates the location history with the new href */
    static updateHistory(href) {
      const urlState = RouterElement.getUrlState();
      let url = urlState;
      if (url.length === 2) {
        url = href;
      } else if (url === '/') {
        url = document.baseURI;
      } else {
        url = document.baseURI + url;
      }

      // Need to use a full URL in case the containing page has a base URI.
      const fullNewUrl = new URL(url, `${window.location.protocol}//${window.location.host}`).href;
      const oldRoute = RouterElement._route;
      const now = window.performance.now();
      const shouldReplace = oldRoute._lastChangedAt + RouterElement._dwellTime > now;
      oldRoute._lastChangedAt = now;
      if (shouldReplace) {
        window.history.replaceState(window.history.state, '', fullNewUrl);
      } else {
        window.history.pushState(window.history.state, '', fullNewUrl);
      }
    }

    /**
     * Sets the active status of any registered links based on the current URL
     * @param {string} [url] url to match against for link status
     * @param {{a: HTMLAnchorElement, routerMatches: AssignmentMatches}[]} [links] optional list of links to update the status for
     * @returns {Promise} Named items require parsing and processing prior to being analyzed. Resolved when named items are finished parsed and processed.
     */
    static async updateAnchorsStatus(url, links) {
      const _links = (links || RouterElement._anchors).filter(l => l.a.isConnected === true);

      /**
       * @param {any} anchor
       * @returns {string} CSS class name to use for active links
       */
      const linkClass = anchor => anchor.getAttribute('activeclassname') || anchor.activeClassName || 'active';

      // Tidy up any unconnected anchors
      _links.forEach(link => link.a.classList.remove(linkClass(link.a)));
      const urlFragments = (url || RouterElement.getUrlState()).split('::');
      const namedMatches = await Promise.all(urlFragments.map(async urlFragment => ({
        urlFragment: urlFragment[0] === '/' ? urlFragment.substr(1) : urlFragment,
        namedMatch: await NamedRouting.parseNamedItem(urlFragment, true)
      })));
      namedMatches.forEach(({
        urlFragment,
        namedMatch
      }) => {
        _links.every(link => {
          if (link && link.a.classList.contains(linkClass(link.a)) === false) {
            if (link.routerMatches) {
              const {
                named,
                routes
              } = link.routerMatches;
              if (namedMatch) {
                const namedMatchResult = named.every(n => {
                  if (n.name === namedMatch.name) {
                    // TODO strip import out of both before compare
                    if (n.url === namedMatch.urlEscaped) {
                      // full match on named item
                      link.a.classList.add(linkClass(link.a));
                      return false;
                    }
                    // Check if it's a match upto data portion of url
                    if (namedMatch.urlEscaped.indexOf(n.url) === 0) {
                      // full match on named item
                      link.a.classList.add(linkClass(link.a));
                      return false;
                    }
                  }
                  return true;
                });
                if (namedMatchResult === false) {
                  return false;
                }
              }
              return routes.every(route => {
                const routeUrl = route[0] === '/' ? route.substr(1) : route;
                // full match on route OR partial match on route
                if (urlFragment === routeUrl || urlFragment.indexOf(routeUrl) === 0) {
                  link.a.classList.add(linkClass(link.a));
                  return false;
                }
                return true;
              });
            }
          }
          return true;
        });
      });

      /**
       * Event that fires when HTMLAnchorElement active statuses are being updated as part of a routing.
       * @event RouterElement#onRouteCancelled
       * @type CustomEvent
       * @property {Object} details - The event details
       * @property {RouteElement} details.url - The url that was trying to be matched.
       */
      window.dispatchEvent(new CustomEvent('onLinkActiveStatusUpdated', {
        bubbles: true,
        composed: true,
        detail: {
          links: _links
        }
      }));
      return null;
    }

    /**
     * Gets the current URL state based on currently active routers and outlets.
     * @param {RouterElement[]} [routers]
     * @returns {string} url state representation of the routers passed in
     */
    static getUrlState(routers) {
      let url = NamedRouting.generateNamedItemsUrl();
      const _routers = routers || RouterElement._routers;
      if (_routers) {
        for (let i = 0, iLen = _routers.length; i < iLen; i++) {
          const router = _routers[i];
          const nextFrag = router.generateUrlFragment();
          if (nextFrag) {
            if (url.length) {
              url += '::';
            }
            url += nextFrag;
            const childRouters = router._routers;
            if (childRouters && childRouters.length) {
              if (childRouters.length === 1) {
                url += `/${this.getUrlState(childRouters)}`;
              } else {
                url += `/(${this.getUrlState(childRouters)})`;
              }
            }
          }
        }
      }
      return url;
    }

    /**
     * Iterates over each child RouterElement and calls it to match it portion of the current URL.
     * @param {string} url - While URL. Will be parsed for individual router URLs.
     * @param {RouterElement[]} routers
     * @returns {Promise<boolean>} resolves when matching is complete. false if matching was cancelled.
     */
    static async performMatchOnRouters(url, routers) {
      // console.info('performMatchOnRouters: ' + url);
      // TODO query string data should be placed on RouterElement so it's accessible across all outlets. It's regarded as shared data across the routers.
      // TODO Maybe have a way to regiser for changes to query string so routes can react
      // TODO auxillary routers - start unit testing
      let _url = url;
      if (_url[0] === '(') {
        _url = _url.substr(1, _url.length - 2);
      }
      const routerUrls = RouterElement.splitUrlIntoRouters(_url);

      // Handle named routers
      const namedOutletMatches = await Promise.all(routerUrls.map(u => NamedRouting.parseNamedItem(u)));
      if (namedOutletMatches.some(match => match === null || match === void 0 ? void 0 : match.cancelled)) {
        return false;
      }

      // Handle non-named routers
      const urlsWithoutNamedOutlets = namedOutletMatches.filter(match => !match).map((_, i) => routerUrls[i]);
      const matchPromises = routers.map((router, i) => urlsWithoutNamedOutlets[i] ? router.performMatchOnRouter(urlsWithoutNamedOutlets[i] || '') : Promise.resolve(null));
      await Promise.all(matchPromises);
      RouterElement.updateAnchorsStatus();
      return true;
    }

    /** A URL can represent the state of multiplr routers on the page. This function will parse a url into sub urls for each router.
     * @param {string} url - The url to parse into multple router parts
     * @returns {Array<string>} Each entry in the array is the url for a router.
     */
    static splitUrlIntoRouters(url) {
      if (url === '/') {
        return ['/'];
      }
      const urls = [];
      let skip = 0;
      let i = 0;
      let lastI = i;
      for (const iLen = url.length; i < iLen; i += 1) {
        const char = url[i];
        if (char === '(') {
          skip += 1;
        } else if (char === ')') {
          skip -= 1;
        } else if (char === ':' && url[i + 1] === ':' && skip === 0) {
          urls.push(url.substring(lastI + (url[lastI] === ':' ? 1 : 0), i));
          i += 1;
          lastI = i;
        }
      }
      if (url[lastI] === '(' || url[lastI] === ')' || url[lastI] === ':') {
        lastI += 1;
      }
      if (i > lastI) {
        urls.push(url.substr(lastI));
      }
      for (let j = 0, jLen = urls.length; j < jLen; j++) {
        if (urls[j][0] === '/') {
          urls[j] = urls[j].substr(1);
        }
        if (urls[j][0] === '(' && urls[j][urls[j].length - 1] === ')') {
          urls[j] = urls[j].substr(1, urls[j].length - 2);
        }
      }
      return urls;
    }

    /**
     * Registers HTMLAnchorElements so that they become candidates route status styling.
     * @param {HTMLAnchorElement[]} links
     * @param {string} [activeClassName]
     */
    static async registerLinks(links, activeClassName) {
      // console.info('registerLinks');
      RouterElement.removeDisconnectedAnchors();
      const newAnchorPromises = [];

      // Add the new anchors
      for (let i = 0, iLen = links.length; i < iLen; i++) {
        const link = links[i];
        if (link.href) {
          newAnchorPromises.push(RouterElement.sanitizeLinkHref(link).then(matches => {
            if (matches) {
              if (activeClassName && !link.hasAttribute('activeclassname')) {
                link.setAttribute('activeclassname', activeClassName);
              }
              for (let j = 0, jLen = matches.named.length; j < jLen; j++) {
                NamedRouting.prefetchNamedOutletImports(matches.named[j]);
              }
              return {
                a: link,
                routerMatches: matches
              };
            }
            return null;
          }));
        }
      }
      const newAnchors = (await Promise.all(newAnchorPromises)).filter(a => a !== null);
      RouterElement._anchors = RouterElement._anchors.concat(newAnchors);
      RouterElement.updateAnchorsStatus(undefined, newAnchors);
    }

    /** */
    static removeDisconnectedAnchors() {
      const currentAnchors = RouterElement._anchors;
      const nextAnchors = [];

      // Tidy up any unconnected anchors
      for (let i = 0, iLen = currentAnchors.length; i < iLen; i++) {
        if (currentAnchors[i].a.isConnected === true) {
          nextAnchors[nextAnchors.length] = currentAnchors[i];
        }
      }

      // Do this after pushing history location state
      RouterElement._anchors = nextAnchors;
    }

    /**
     * @typedef {Object} AssignmentMatches
     * @property {string[]} routes - Assignments of type router
     * @property {import('./named-routing').NamedMatch[]} named - Assignments of type namedItems
     */
    /**
     *
     * @param {(MouseEvent|HTMLAnchorElement|string)} hrefSource - The source of the new url to handle. Can be a click event from clicking a link OR an anchor element OR a string that is the url to navigate to.
     * @returns {Promise<AssignmentMatches>} assignmentMatches
     *
     */
    static async sanitizeLinkHref(hrefSource) {
      const href = RouterElement._getSameOriginLinkHref(hrefSource);
      const url = new URL(href);
      // const hash = RouterElement._getHash();
      const path = decodeURIComponent(url.pathname);
      // const query = url.search.substring(1);
      const basePathLength = RouterElement.baseUrlSansHost().length;
      let urlStr = path.substr(basePathLength);
      if (urlStr[0] === '(') {
        urlStr = urlStr.substr(1, urlStr.length - 2);
      }
      const urls = RouterElement.splitUrlIntoRouters(urlStr);
      const matches = urls.map(_url => NamedRouting.parseNamedItem(_url, true));
      return (await Promise.all(matches)).reduce((result, match, index) => {
        if (match) {
          result.named.push(match);
        } else {
          result.routes.push(urls[index]);
        }
        return result;
      }, {
        named: [],
        routes: []
      });
    }

    /** Dispose */
    disconnectedCallback() {
      RouterElement.removeRouter.call(this._parentRouter, this);
      this.removeEventListener('onRouterAdded', this.handlerAddRouter, false);
      this.removeEventListener('onRouteAdded', this.handlerAddRoute, false);
      if (this.getName()) {
        NamedRouting.removeNamedItem(this.getName());
      }
    }

    /** Initialize */
    async connectedCallback() {
      if (!this.created) {
        this.created = true;

        // IE workaround for the lack of document.baseURI property
        let {
          baseURI
        } = document;
        if (baseURI === undefined) {
          const baseTags = document.getElementsByTagName('base');
          baseURI = baseTags.length ? baseTags[0].href : document.URL;
          // @ts-ignore
          document.baseURI = baseURI;
        }
        this._routers = [];
        RouterElement.initialize();
      }
      if (this.isConnected) {
        /**
         * Internal event used to plumb together the routers. Do not interfer with.
         * @event RouterElement#onRouterAdded
         * @type CustomEvent
         * @property {Object} details - The event details
         * @property {RouteElement} details.url - The url that was trying to be matched.
         */
        const routerAddedEvent = new CustomEvent('onRouterAdded', {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            router: this
          }
        });
        this.dispatchEvent(routerAddedEvent);
        this._parentRouter = routerAddedEvent.detail.parentRouter;
        this.addEventListener('onRouterAdded', this.handlerAddRouter = RouterElement.handlerAddRouter.bind(this), false);
        this.addEventListener('onRouteAdded', this.handlerAddRoute = this.handlerAddRoute.bind(this), false);
        await NamedRouting.addNamedItem(this);
      }
    }

    /** Initialize */
    constructor() {
      super();

      /** @type {import('./routes-route').Match} */
      this._currentMatch = null;
      this.canLeave = NamedRouting.canLeave.bind(this);
    }

    /** Global/top level initialization */
    static async initialize() {
      if (!RouterElement._initialized) {
        RouterElement._initialized = true;
        // RouterElement.whiteListRegEx = this.getAttribute('base-white-list') || '';

        window.addEventListener('popstate', RouterElement.changeUrl, false);
        window.addEventListener('click', RouterElement.navigate, false);

        // Listen for top level routers being added
        window.addEventListener('onRouterAdded', RouterElement.handlerAddRouter.bind(RouterElement), false);

        // Listen for link registration
        window.addEventListener('routerLinksAdded', RouterElement.handlerRouterLinksAdded.bind(RouterElement), false);

        // Listen for navigate requests
        window.addEventListener('navigate', RouterElement.handlerNavigate.bind(RouterElement), false);
        await RouterElement.changeUrl();
      }
    }

    /** @returns {string} the name of this router */
    getName() {
      if (this.routerName === undefined) {
        this.routerName = this.getAttribute('name');
      }
      return this.routerName;
    }

    /** @returns {import('./routes-route').Match}  */
    getCurrentMatch() {
      if (!this._currentMatch && this._parentRouter._currentMatch) {
        this._currentMatch = {
          data: null,
          redirect: null,
          url: '',
          useCache: false,
          remainder: this._parentRouter._currentMatch.remainder
        };
        // TODO get remainder from parent but ony take this routers url from it
        // e.g. split :: and take the firs put the rest back
        // TODO if we support adding a router name to the URL this is where we would check for it: (myRouter:users/main) --> target router named myRouter with url users/main
        const {
          remainder
        } = this._currentMatch;
        if (remainder && remainder[0] === '(') {
          const remainderArray = RouterElement.splitUrlIntoRouters(remainder.substring(1, remainder.length - 2));
          this._currentMatch.remainder = remainderArray.shift();
          // The next line is done in in the postProcessMatch
          // this._parentRouter._currentMatch.remainder = '(' + remainder.join('::') + ')';
        }
        this._currentMatch.url = this._currentMatch.remainder;
      }
      return this._currentMatch;
    }

    /** Clear the current router match */
    clearCurrentMatch() {
      this._currentMatch = null;
    }

    /**
     * Event handler for handling when child route is added.
     * Used to link up RouterElements with child RouteElements even through Shadow DOM.
     * @param {CustomEvent} event - routeAdded event
     */
    handlerAddRoute(event) {
      event.stopPropagation();
      event.detail.router = this;
      event.detail.onRouteAdded = this.addRoute(event.detail.route);
    }

    /**
     * Performs matching for nested routes as they connect.
     * @param {import('./routes-route').RouteElement} routeElement
     * @returns {Promise<void>}
     */
    async addRoute(routeElement) {
      // console.info('route added: ' + routeElement.getAttribute('path'));

      if (!this.hasMatch) {
        const currentMatch = this.getCurrentMatch();
        if (currentMatch) {
          if (currentMatch.remainder) {
            await this.performMatchOnRoute(currentMatch.remainder, routeElement);
          }
        }
      }
    }

    /**
     * Takes in a url that contains named router data and renders the router using the information
     * @param {string} url to process as a named item
     * @returns {Promise<void>}
     */
    async processNamedUrl(url) {
      await this.performMatchOnRouter(url);
    }

    /**
     * Performs route matching by iterating through routes looking for matches
     * @param {String} url
     * @returns {Promise<import('./routes-route.js').Match>}
     */
    async performMatchOnRouter(url) {
      // console.group('performMatchOnRouter: ' + url);
      this.hasMatch = false;
      this._currentMatch = {
        remainder: url,
        data: null,
        redirect: null,
        url: '',
        useCache: false
      };
      const routeElements = this.getRouteElements();
      const outletElement = this.getOutletElement();
      let match = null;
      let i = 0;
      const iLen = routeElements.length;
      for (; i < iLen; i++) {
        const routeElement = routeElements[i];
        // We need to run performMatchOnRoute one at a time, so await here
        // eslint-disable-next-line no-await-in-loop
        match = await this.performMatchOnRoute(url, routeElement);
        if (match != null) {
          // console.info('route matched -> ', routeElement.getAttribute('path'));
          i += 1;
          break;
        }
      }

      // clear cache of remaining routes
      for (; i < iLen; i++) {
        const routeElement = routeElements[i];
        routeElement.clearLastMatch();
      }
      if (match === null) {
        if (outletElement.renderOutletContent) {
          outletElement.renderOutletContent(`No matching route for url ${url} \r\nTo replace this message add a 404 catch all route\r\n &lt;a-route path='*'>&lt;template&gt;catach all - NotFound&lt;/template&gt;&lt;/a-route&gt;`);
          console && console.error && console.error(`404 - Route not found for url ${url}`);
        }
        return null;
      }
      // console.log('leaving performMatchOnRouter ' + url);
      // console.groupEnd();

      return match;
    }

    /**
     * Tries to invoke matching of a url to a {RouteElement}
     * @param {string} url to match
     * @param {import('./routes-route').RouteElement} routeElement to match against
     * @returns {Promise<import('./routes-route.js').Match>}
     */
    async performMatchOnRoute(url, routeElement) {
      // RouteElement not connected yet
      if (!routeElement.match) {
        return null;
      }
      const match = routeElement.match(url) || null;
      if (match != null) {
        this.postProcessMatch();
        if (match.redirect) {
          // TODO If the route being redirected to comes after then it might not have loaded yet
          return this.performMatchOnRouter(match.redirect);
        }
        const activeRouters = RouterElement._activeRouters;
        activeRouters.push({
          route: routeElement,
          router: this,
          match
        });
        this._currentMatch = match;
        if (!match.useCache) {
          const outletElement = this.getOutletElement();
          /**
           * @param {string | HTMLElement | DocumentFragment} content
           */
          const content = await routeElement.getContent(match.data);
          outletElement.renderOutletContent(content);
        }
        if (this._routers && match.remainder) {
          await RouterElement.performMatchOnRouters(match.remainder, this._routers);
        }
      }
      return match;
    }

    /**
     * Update router state after router matching process has completed
     * Updates the parents match url remainder
     */
    postProcessMatch() {
      this.hasMatch = true;
      if (this._parentRouter._currentMatch) {
        const parentMatch = this._parentRouter._currentMatch;
        // TODO get remainder from parent but ony take this routers url from it
        // e.g. split :: and take the first put the rest back
        // TODO if we support adding a router name to the URL this is where we would check for it: (myRouter:users/main) --> target router named myRouter with url users/main
        let {
          remainder
        } = parentMatch;
        if (remainder && remainder[0] === '(') {
          remainder = remainder.substring(1, remainder.length - 2);
        }
        remainder = RouterElement.splitUrlIntoRouters(remainder);
        remainder.shift();
        // this._currentMatch.remainder = remainder.shift();
        if (remainder.length > 1) {
          this._parentRouter._currentMatch.remainder = `(${remainder.join('::')})`;
        } else if (remainder.length === 1) {
          // eslint-disable-next-line prefer-destructuring
          this._parentRouter._currentMatch.remainder = remainder[0];
        } else {
          this._parentRouter._currentMatch.remainder = '';
        }
      }
    }

    /** @returns {string} Generates a url from this router (ignoring parent url segments) */
    generateUrlFragment() {
      const match = this._currentMatch;
      if (!match) {
        return '';
      }
      let urlFrag = match.url;
      if (match.remainder) {
        urlFrag += `/${match.remainder}`;
      }

      // TODO test if this is required. It might be duplicating routes.
      // if (this._routers && this._routers.length) {
      //   urlFrag += '/(';
      //   for (let i = 0, iLen = this._routers.length; i < iLen; i++) {
      //     if (i > 0) {
      //       urlFrag += '::';
      //     }
      //     urlFrag += this._routers[i].generateUrlFragment();
      //   }
      //   urlFrag += ')';
      // }

      return urlFrag;
    }

    /** @returns {import('./routes-outlet').OutletElement} */
    getOutletElement() {
      // @ts-ignore
      return this._getRouterElements('a-outlet,an-outlet')[0];
    }

    /** @returns {import('./routes-route').RouteElement[]} */
    getRouteElements() {
      // @ts-ignore
      return this._getRouterElements('a-route');
    }

    /**
     * Finds immediate child route elements
     * @param {string} tagNames CSV of immediate children with tag names to find
     * @returns {Array<Element>} of immediate children with matching tag names
     */
    _getRouterElements(tagNames) {
      const routeElements = [];
      const _tagNames = tagNames.toLowerCase().split(',');
      for (let i = 0, iLen = this.children.length; i < iLen; i++) {
        const elem = this.children[i];
        for (let j = 0, jLen = _tagNames.length; j < jLen; j++) {
          if (elem.tagName.toLowerCase() === _tagNames[j]) {
            routeElements.push(elem);
          }
        }
      }
      return routeElements;
    }

    /**
     * Returns the absolute URL of the link (if any) that this click event is clicking on, if we can and should override the resulting full page navigation. Returns null otherwise.
     * @param {(MouseEvent|HTMLAnchorElement|string)} hrefSource - The source of the new url to handle. Can be a click event from clicking a link OR an anchor element OR a string that is the url to navigate to.
     * @return {string?} Returns the absolute URL of the link (if any) that this click event is clicking on, if we can and should override the resulting full page navigation. Returns null if click should not be consumed.
     */
    static _getSameOriginLinkHref(hrefSource) {
      let href = null;
      /** @type HTMLAnchorElement */
      let anchor = null;
      if (hrefSource instanceof Event) {
        const event = hrefSource;
        // We only care about left-clicks.
        if (event.button !== 0) {
          return null;
        }

        // We don't want modified clicks, where the intent is to open the page
        // in a new tab.
        if (event.metaKey || event.ctrlKey) {
          return null;
        }
        const eventPath = event.composedPath();
        for (let i = 0; i < eventPath.length; i++) {
          const element = eventPath[i];
          if (element instanceof HTMLAnchorElement) {
            anchor = element;
            break;
          }
        }

        // If there's no link there's nothing to do.
        if (!anchor) {
          return null;
        }
      } else if (typeof hrefSource === 'string') {
        href = hrefSource;
        // Ensure href is a valid URL
        try {
          // we use new URL as a test for valid url
          // eslint-disable-next-line no-new
          new URL(href);
        } catch (e) {
          // eslint-disable-next-line prefer-destructuring
          href = new URL(href, new URL(document.baseURI).origin).href;
        }
      } else {
        anchor = hrefSource;
      }
      if (anchor) {
        // Target blank is a new tab, don't intercept.
        if (anchor.target === '_blank') {
          return '';
        }

        // If the link is for an existing parent frame, don't intercept.
        if ((anchor.target === '_top' || anchor.target === '_parent') && window.top !== window) {
          return '';
        }

        // If the link is a download, don't intercept.
        if (anchor.download) {
          return '';
        }

        // eslint-disable-next-line prefer-destructuring
        href = anchor.href;
      }

      // If link is different to base path, don't intercept.
      if (href.indexOf(document.baseURI) !== 0) {
        return '';
      }
      const hrefEscaped = href.replace(/::/g, '$_$_');

      // It only makes sense for us to intercept same-origin navigations.
      // pushState/replaceState don't work with cross-origin links.
      let url;
      if (document.baseURI != null) {
        url = new URL(hrefEscaped, document.baseURI);
      } else {
        url = new URL(hrefEscaped);
      }

      // IE Polyfill
      const origin = window.location.origin || `${window.location.protocol}//${window.location.host}`;
      let urlOrigin;
      if (url.origin && url.origin !== 'null') {
        urlOrigin = url.origin;
      } else {
        // IE always adds port number on HTTP and HTTPS on <a>.host but not on
        // window.location.host
        let urlHost = url.host;
        const urlPort = url.port;
        const urlProtocol = url.protocol;
        const isExtraneousHTTPS = urlProtocol === 'https:' && urlPort === '443';
        const isExtraneousHTTP = urlProtocol === 'http:' && urlPort === '80';
        if (isExtraneousHTTPS || isExtraneousHTTP) {
          urlHost = url.hostname;
        }
        urlOrigin = `${urlProtocol}//${urlHost}`;
      }
      if (urlOrigin !== origin) {
        return '';
      }
      let normalizedHref = url.pathname.replace(/\$_\$_/g, '::') + url.search.replace(/\$_\$_/g, '::') + url.hash.replace(/\$_\$_/g, '::');

      // pathname should start with '/', but may not if `new URL` is not supported
      if (normalizedHref[0] !== '/') {
        normalizedHref = `/${normalizedHref}`;
      }

      // If we've been configured not to handle this url... don't handle it!
      // let urlSpaceRegExp = RouterElement._makeRegExp(RouterElement.whiteListRegEx);
      // if (urlSpaceRegExp && !urlSpaceRegExp.test(normalizedHref)) {
      //   return '';
      // }

      // Need to use a full URL in case the containing page has a base URI.
      const fullNormalizedHref = new URL(normalizedHref, window.location.href).href;
      return fullNormalizedHref;
    }

    // static _makeRegExp(urlSpaceRegex) {
    //   return RegExp(urlSpaceRegex);
    // }

    // ---------- Action helpers ----------
    // Much of this code was taken from the Polymer project iron elements

    /** @returns {string} the hash portion of the browsers current url */
    static _getHash() {
      return decodeURIComponent(window.location.hash.substring(1));
    }

    /** @returns {string} the browsers current url without protocol of host */
    static baseUrlSansHost() {
      const host = `${window.location.protocol}//${window.location.host}`;
      return document.baseURI.substr(host.length + 1);
    }

    /**
     * @private
     * Converts URL like object to a url string
     * @param {Location|URL} [url] url location object to encode defaults to window.location
     * @returns {string} url passed in
     */
    static _getUrl(url) {
      const _url = url || window.location;
      const path = decodeURIComponent(_url.pathname);
      const query = _url.search.substring(1);
      const hash = RouterElement._getHash();
      const partiallyEncodedPath = encodeURI(path).replace(/\#/g, '%23').replace(/\?/g, '%3F');
      let partiallyEncodedQuery = '';
      if (query) {
        partiallyEncodedQuery = `?${query.replace(/\#/g, '%23')}`;
        if (RouterElement._encodeSpaceAsPlusInQuery) {
          partiallyEncodedQuery = partiallyEncodedQuery.replace(/\+/g, '%2B').replace(/ /g, '+').replace(/%20/g, '+');
        } else {
          // required for edge
          partiallyEncodedQuery = partiallyEncodedQuery.replace(/\+/g, '%2B').replace(/ /g, '%20');
        }
      }
      let partiallyEncodedHash = '';
      if (hash) {
        partiallyEncodedHash = `#${encodeURI(hash)}`;
      }
      return partiallyEncodedPath + partiallyEncodedQuery + partiallyEncodedHash;
    }
  }
  RouterElement._routers = [];
  RouterElement._route = {};
  RouterElement._initialized = false;
  RouterElement._activeRouters = [];
  RouterElement._dwellTime = 2000;
  /** @type {{a: HTMLAnchorElement, routerMatches: AssignmentMatches}[]} */
  RouterElement._anchors = [];
  RouterElement._encodeSpaceAsPlusInQuery = false;
  RouterElement.assignedOutlets = {};
  window.customElements.define('a-router', RouterElement);

  /** */
  class RouterLinkElement extends HTMLAnchorElement {
    /** @inheritdoc */
    connectedCallback() {
      RouterElement.initialize();
      this.register();
    }

    /** @inheritdoc */
    static get observedAttributes() {
      return ['href'];
    }

    /**
     * @inheritdoc
     * Listens for href attribute changing. If it does then it re-registers the link.
     */
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'href') {
        if (oldValue && newValue) {
          this.register();
        }
      }
    }

    /** @inheritdoc */
    constructor() {
      super();
    }

    /** Helper to dispatch events that will signal the registering of links. */
    register() {
      window.dispatchEvent(new CustomEvent('routerLinksAdded', {
        detail: {
          links: [this]
        }
      }));
    }
  }
  window.customElements.define('router-link', RouterLinkElement, {
    extends: 'a'
  });

  /** @typedef {Map<string, string>|HTMLOrSVGElement['dataset']} MatchData */
  /**
   * @typedef {Object} Match
   * @property {string} url - The url that was matched and consumed by this route. The match.url and the match.remainder will together equal the URL that the route originally matched against.
   * @property {string} remainder - If the route performed a partial match, the remainder of the URL that was not attached is stored in this property.
   * @property {Map<string, string>} data - Any data found and matched in the URL.
   * @property {?string} redirect - A URL to redirect to.
   * @property {boolean} useCache - Indicator as to wether the current HTML content can be reused.
   */

  /**  */
  class RouteElement extends HTMLElement {
    /** Initialize */
    connectedCallback() {
      if (!this.created) {
        this.created = true;
        this.style.display = 'none';
        const baseElement = document.head.querySelector('base');
        this.baseUrl = baseElement && baseElement.getAttribute('href');
      }
      if (this.isConnected) {
        const onRouteAdded = new CustomEvent('onRouteAdded', {
          bubbles: true,
          composed: true,
          detail: {
            route: this
          }
        });
        this.dispatchEvent(onRouteAdded);
        const lazyLoad = (this.getAttribute('lazyload') || '').toLowerCase() === 'true' || this.hasAttribute('lazy-load');
        if (lazyLoad === false) {
          const importAttr = this.getAttribute('import');
          const tagName = this.getAttribute('element');
          NamedRouting.prefetchImport(importAttr, tagName);
        }
      }
    }

    /** Initialize */
    constructor() {
      super();
      this.canLeave = NamedRouting.canLeave.bind(this);

      /** @type {string|DocumentFragment|Node} */
      this.content = null;
      this.data = null;
    }

    /**
     * @private
     * @param {string} url to break into segments
     * @returns {Array<string>} string broken into segments
     */
    _createPathSegments(url) {
      return url.replace(/(^\/+|\/+$)/g, '').split('/');
    }

    /**
     * Performs matching and partial matching. In order to successfully match, a RouteElement elements path attribute must match from the start of the URL. A full match would completely match the URL. A partial match would return from the start.
     * @fires RouteElement#onROuteMatch
     * @param {string} url - The url to perform matching against
     * @returns {Match} match - The resulting match. Null will be returned if no match was made.
     */
    match(url) {
      const urlSegments = this._createPathSegments(url);
      const path = this.getAttribute('path');
      if (!path) {
        console.info('route must contain a path');
        throw new Error('Route has no path defined. Add a path attribute to route');
      }
      const fullMatch = {
        url,
        remainder: '',
        data: new Map(),
        redirect: null,
        useCache: false
      };
      let match = fullMatch;
      if (path === '*') {
        match = fullMatch;
      } else if (path === url) {
        match = fullMatch;
      } else {
        const pathSegments = this._createPathSegments(path);
        // console.info(urlSegments, pathSegments);
        const data = match.data;
        const max = pathSegments.length;
        let i = 0;
        for (; i < max; i++) {
          if (pathSegments[i] && pathSegments[i].charAt(0) === ':') {
            // Handle bound values
            const paramName = pathSegments[i].replace(/(^\:|[+*?]+\S*$)/g, '');
            const flags = (pathSegments[i].match(/([+*?])\S*$/) || [])[1] || '';
            const oneOrMore = flags.includes('+');
            const anyNumber = flags.includes('*');
            const oneOrNone = flags.includes('?');
            const defaultValue = oneOrNone && (pathSegments[i].match(/[+*?]+(\S+)$/) || [])[1] || '';
            let value = urlSegments[i] || '';
            const required = !anyNumber && !oneOrNone;
            if (!value && defaultValue) {
              value = defaultValue;
            }
            if (!value && required) {
              match = null;
              break;
            }
            data.set(paramName, decodeURIComponent(value));
            if (oneOrMore || anyNumber) {
              data.set(paramName, urlSegments.slice(i).map(decodeURIComponent).join('/'));
              // increase i so that we know later that we have consumed all of the url segments when we're checking if we have a full match.
              i = urlSegments.length;
              break;
            }
          } else if (pathSegments[i] !== urlSegments[i]) {
            // Handle path segment
            match = null;
            break;
          }
        }

        // Check all required path segments were fulfilled
        if (match) {
          if (i >= urlSegments.length) ; else if (this.hasAttribute('fullmatch')) {
            // Partial match but needed full match
            match = null;
          } else if (i === max) {
            // Partial match
            match = match || fullMatch;
            match.data = data;
            match.url = urlSegments.slice(0, i).join('/');
            match.remainder = urlSegments.slice(i).join('/');
          } else {
            // No match
            match = null;
          }
        }
      }
      if (match !== null) {
        /**
         * Route Match event that fires after a route has performed successful matching. The event can be cancelled to prevent the match.
         * @event RouteElement#onRouteMatch
         * @type CustomEvent
         * @property {Object} details - The event details
         * @property {RouteElement} details.route - The RouteElement that performed the match.
         * @property {Match} details.match - The resulting match. Warning, modifications to the Match will take effect.
         * @property {string} details.path - The RouteElement path attribute value that was matched against.
         */
        const routeMatchedEvent = new CustomEvent('onRouteMatch', {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            route: this,
            match,
            path
          }
        });
        this.dispatchEvent(routeMatchedEvent);
        if (routeMatchedEvent.defaultPrevented) {
          match = null;
        }
        if (this.hasAttribute('redirect')) {
          match.redirect = this.getAttribute('redirect');
        }
      }
      if (match) {
        const useCache = this.lastMatch && this.lastMatch.url === match.url && !this.hasAttribute('disableCache');
        match.useCache = !!useCache;
      }
      this.lastMatch = match;
      return match;
    }

    /** Clear the last match which will reset cache state */
    clearLastMatch() {
      this.lastMatch = null;
    }

    /**
     * Generates content for this route.
     * @param {Map<string, string>} [attributes] - Object of properties that will be applied to the content. Only applies if the content was not generated form a Template.
     * @returns {Promise<string|DocumentFragment|Node>} - The resulting generated content.
     */
    async getContent(attributes) {
      let {
        content
      } = this;
      if (!content) {
        const importAttr = this.getAttribute('import');
        const tagName = this.getAttribute('element');
        await NamedRouting.importCustomElement(importAttr, tagName);
        if (tagName) {
          // TODO support if tagName is a function that is called and will return the content
          // content = tagName(attributes);
          content = document.createElement(tagName);
          if (customElements.get(tagName) === undefined) {
            console.error(`Custom Element not found: ${tagName}. Are you missing an import or mis-spelled the tag name?`);
          }
        }
        const template = this.children[0];
        if (template && template instanceof HTMLTemplateElement) {
          return template.content.cloneNode(true);
        }
      }
      if (this.data && content instanceof HTMLElement) {
        Object.entries(this.data).forEach(([name, value]) => {
          content[name] = value;
        });
      }
      RouteElement.setData(content, this.dataset);

      // Set attributes last so they override any static properties with the same name
      if (attributes) {
        RouteElement.setData(content, attributes);
      }
      this.content = content;
      return this.content;
    }

    /**
     * @param {string|DocumentFragment|Node} target element to set the data on
     * @param {MatchData} data to set on the element
     */
    static setData(target, data) {
      if (data && target instanceof Element) {
        /**
         * @param {string} key property name to set the value for
         * @param {unknown} value value to set
         */
        const setProperty = (key, value) => {
          if (key[0] === '.') {
            target[key.substring(1)] = value;
          } else {
            target.setAttribute(key, value.toString());
          }
        };
        if (data instanceof Map) {
          data.forEach((value, key) => setProperty(key, value));
        } else {
          Object.entries(data).forEach(([key, value]) => setProperty(key, value));
        }
      }
    }
  }
  window.customElements.define('a-route', RouteElement);

  /** */
  class OutletElement extends HTMLElement {
    /** Initialize */
    async connectedCallback() {
      if (this.isConnected) {
        if (!this.created) {
          this.created = true;
          // var p = document.createElement('p');
          // p.textContent = 'Please add your routes!';
          // this.appendChild(p);

          await NamedRouting.addNamedItem(this);
        }
        await RouterElement.initialize();
      }
    }

    /** Dispose */
    disconnectedCallback() {
      if (this.getName()) {
        NamedRouting.removeNamedItem(this.getName());
      }
    }

    /** Initialize */
    constructor() {
      super();
      this.canLeave = NamedRouting.canLeave.bind(this);
    }

    /** @returns {string} value of the attribute called name. Can not be changed was set. */
    getName() {
      if (this.outletName === undefined) {
        this.outletName = this.getAttribute('name');
      }
      return this.outletName;
    }

    /**
     * @private
     * @param {string} url to parse
     * @returns url broken into segments
     */
    _createPathSegments(url) {
      return url.replace(/(^\/+|\/+$)/g, '').split('/');
    }

    /**
     * Replaces the content of this outlet with the supplied new content
     * @fires OutletElement#onOutletUpdated
     * @param {string|DocumentFragment|Node} content - Content that will replace the current content of the outlet
     */
    renderOutletContent(content) {
      this.innerHTML = '';
      // console.info('outlet rendered: ' + this.outletName, content);

      if (typeof content === 'string') {
        this.innerHTML = content;
      } else {
        this.appendChild(content);
      }
      this.dispatchOutletUpdated();
    }

    /**
     * Takes in a url that contains named outlet data and renders the outlet using the information
     * @param {string} url to parse and create outlet content for
     * @returns {Promise<void>} that was added to the outlet as a result of processing the named url
     */
    async processNamedUrl(url) {
      const details = NamedRouting.parseNamedOutletUrl(url);
      const options = details.options || {
        import: null
      };
      let data = details.data || new Map();
      if (data instanceof Map === false) {
        data = new Map(Object.entries(data || {}));
      }

      // If same tag name then just set the data
      if (this.children && this.children[0] && this.children[0].tagName.toLowerCase() === details.elementTag) {
        RouteElement.setData(this.children[0], data);
        this.dispatchOutletUpdated();
        return;
      }
      await NamedRouting.importCustomElement(options.import, details.elementTag);
      const element = document.createElement(details.elementTag);
      RouteElement.setData(element, data);
      if (customElements.get(details.elementTag) === undefined) {
        console.error(`Custom Element not found: ${details.elementTag}. Are you missing an import or mis-spelled tag name?`);
      }
      this.renderOutletContent(element);
    }

    /** Dispatch the onOutletUpdate event */
    dispatchOutletUpdated() {
      /**
       * Outlet updated event that fires after an Outlet replaces it's content.
       * @event OutletElement#onOutletUpdated
       * @type CustomEvent
       * @property {any} - Currently no information is passed in the event.
       */
      this.dispatchEvent(new CustomEvent('onOutletUpdated', {
        bubbles: true,
        composed: true,
        detail: {}
      }));
    }
  }
  window.customElements.define('a-outlet', OutletElement);
  window.customElements.define('an-outlet', class extends OutletElement {});

})();
