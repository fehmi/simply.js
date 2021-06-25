/*
if (componentString.indexOf("style scoped") > -1) {

    var scopedStyles = Array.prototype.map.call(componentHtml.querySelector("style").sheet.cssRules,
        function css_text(x) { return "[simply-id=f" + id + "] " + x.cssText; }).join('\n');
    componentHtml.querySelector("style").innerHTML = scopedStyles;
}
*/

utils();

window.simply = {
  components: {},
  // simplate
  parseTemplate: function (template, data) {
    let ifStatement = /\<(\s+)?if(\s+)([a-zA-Z_\.]+(\s+)??.*)(\s+)?(\>)$/;
    let elseIfStatement = /\<(\s+)?else(\s+)if(\s+)(.*(\s+?.*))(\s+)?(\>)$/;
    let endIfStatement = /\<(\s+)?\/(\s+)?if(\s+)?\>$/;
    let elseStatement = /\<(\s+)?else(\s+)?\>$/;
    let eachStatement = /\<(\s+)?each(\s+)?(.*)\s+as\s+([a-zA-Z._]+)(\s+)?(,(\s+)?)?([a-zA-Z._]+)?(\s+)?(\()?(\s+)?([a-zA-Z._]+(\s+)?)?(\))?(\s+)?\>$/;
    let endEachStatement = /\<(\s+)?\/(\s+)?each(\s+)?\>/;
    let variable = /{(\s+)?([a-zA-Z_\.\+\*\d\/\=\s\(\)]+)(\s+)?}$/;

    let ifCount = 0;
    let eachCount = 0;
    let m;
    let bucket = "";
    var processedLetters = "";
    var capturedLogics = [];
    var staticLetters = "";

    for (var i = 0; i < template.length; i++) {
      processedLetters += template[i];
      bucket += template[i];
      if (
        (m = ifStatement.exec(bucket)) !== null ||
        (m = elseIfStatement.exec(bucket)) !== null ||
        (m = endIfStatement.exec(bucket)) !== null ||
        (m = elseStatement.exec(bucket)) !== null ||
        (m = eachStatement.exec(bucket)) !== null ||
        (m = endEachStatement.exec(bucket)) !== null ||
        (m = variable.exec(bucket)) !== null) {

        if ((logic = ifStatement.exec(bucket)) !== null) {
          logic = unescape("if (" + logic[3] + ") {");
          //logic = (ifCount == 0 ? 'let ht = "";' + logic : logic);
          ifCount += 1;
        }
        else if ((logic = elseIfStatement.exec(bucket)) !== null) {
          logic = unescape(logic[4]);
          logic = "}else if (" + logic + ") {";
        }
        else if ((logic = elseStatement.exec(bucket)) !== null) {
          logic = "}else {";

        }
        else if ((logic = endIfStatement.exec(bucket)) !== null) {
          ifCount -= 1;
          logic = "}";
        }
        else if ((logic = eachStatement.exec(bucket)) !== null) {
          eachCount += 1;
          let subject = eval(logic[3]);
          let i = "s" + Math.random().toString(36).slice(-7);

          if (Array.isArray(subject)) {
            let key = typeof logic[8] !== "undefined" ? "let " + logic[8] + " = " + i + ";" : "";
            let index = typeof logic[8] !== "undefined" ? "let " + logic[12] + " = " + i + ";" : "";

            logic = "for (" + i + " = 0; " + i + " < " + logic[3] + ".length; " + i + "++) { \
                        " + key + "; \
                        " + index + "; \
                        let " + logic[4] + "=" + logic[3] + "[" + i + "];";
          }
          else {
            let key = typeof logic[12] !== "undefined" ? "let " + logic[12] + " = " : "";
            
            logic = "\
                    for (var ii in "+ logic[3] + ") { \
                      if (ii == '__o_') { continue; }\
                      " + key + "Object.keys(" + logic[3] + ").indexOf(ii); \
                      let " + logic[8] + "= ii; \
                      let " + logic[4] + "=" + logic[3] + "[ii];";
          }
        }
        // 

        else if ((logic = endEachStatement.exec(bucket)) !== null) {
          eachCount -= 1;
          logic = "};";
        }
        else if ((logic = variable.exec(bucket)) !== null) {
          logic = "ht+=" + m[2] + ";";
        }

        capturedLogics.push(m[0]);
        let logicLine = capturedLogics[capturedLogics.length - 1];
        let staticText = processedLetters.replace(logicLine, "");
        let replaceThis = staticText + logicLine;
        var withThis = "ht+=`" + staticText.trim().replace(/\n/g, "") + "`;" + logic;
        bucket = bucket.replace(replaceThis, withThis);
        processedLetters = "";
      }
    }
    // for the last non-logical text
    if (processedLetters.trim() !== "") {
      processedLettersRegex = processedLetters.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      //bucket = bucket.replace(new RegExp(processedLettersRegex + '$'), "ht+=`" + processedLetters.replace(/(?:\r\n|\r|\n)/g, '').trim() + "`;")
      bucket = bucket.replace(new RegExp(processedLettersRegex + '$'), "ht+=`" + processedLetters.trim() + "`;")
    }
    // console.log(bucket);
    var ht = "";
    // console.log(bucket);
    eval(bucket + "//@ sourceURL=foo.js");
    return ht;
  },
  parseStyle: function (style, data) {
    let variable = /(\"|')(\s+)?{(\s+)?([a-zA-Z_\.\+\*\d\/\=\s\(\)]+)(\s+)?}(\s+)?(\"|')/gm;
    while ((m = variable.exec(style)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === variable.lastIndex) {
        variable.lastIndex++;
      }
      style = style.split(m[0]).join(eval(m[4]));
    }

    return style;
  }
}

/*
var app = new fjs({
    component: "home",
    target: "body",
    data: {
        name: "fehmi"
    }
});
*/
function utils() {
  query = document.querySelector.bind(document);
  queryAll = document.querySelectorAll.bind(document);
  fromId = document.getElementById.bind(document);
  fromClass = document.getElementsByClassName.bind(document);
  fromTag = document.getElementsByTagName.bind(document);

  get = function (name, path) {
    loadAndParseComponent(name, path, function (component) {
      getSettings(component, function (settings) {
        registerComponent(settings);
      })
    });
  }
  loadAndParseComponent = function (name, path, callback) {
    var request = new XMLHttpRequest();
    //request.responseType = 'document';
    request.open('GET', path, true);

    request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        var txt = document.createElement("textarea");
        var parser = new DOMParser();
        var dom = parser.parseFromString(this.response, "text/html");

        var template = "";
        if (this.response.indexOf("<template>") > -1) {
          var templateOpenTag = /<template(.*)>/g;
          var templateCloseTag = /<\/template>/g;
          var bucket = "";
          var processedLetters = "";
          var templateCount = 0;

          for (var i = 0; i < this.response.length; i++) {
            bucket += this.response[i];
            if ((logic = templateOpenTag.exec(bucket)) !== null) {
              templateCount += 1;
              bucket = "";
            }
            else if ((logic = templateCloseTag.exec(bucket)) !== null) {
              templateCount -= 1;
              bucket = "";
              if (templateCount == 0) { // done
                template = processedLetters.replace(new RegExp("<\/template>" + '$'), '');
                break;
              }
            }
            if (templateCount > 0) {
              processedLetters += this.response[i + 1];
            }
          }
        }

        var style = "";
        if (dom.querySelector("style")) {
          style = dom.querySelector("style");
          txt.innerHTML = style.innerHTML;
          style = txt.value;
        }

        var script = "";
        if (dom.querySelector("script")) {
          var script = dom.querySelector("script");
          txt.innerHTML = script.innerHTML;
          script = txt.value;
        }

        if (path.indexOf("blob") > -1) {

        }

        callback({
          name,
          template,
          style,
          script
        });
        //console.log(simply.importCompleted[name]);
      } else {
        console.log("Component import error: We reached our target server, but it returned an error");
      }
    };
    request.onerror = function () { };
    request.send();
  }
  getSettings = function ({ name, template, style, script }, callback) {
    //const jsFile = new Blob([script.textContent], { type: 'application/javascript' });
    //const jsURL = URL.createObjectURL(jsFile);
    function getListeners(settings) {
      return settings;
      /*
        return Object.entries(settings).reduce((listeners, [setting, value]) => {
            if (setting.startsWith('on')) {
                listeners[setting[2].toLowerCase() + setting.substr(3)] = value;
            }
            return listeners;
        }, {});
        */
    }

    //return import(jsURL).then((module) => {
    //    console.log(module);
    //    const listeners = getListeners(module.default);
    //const settings = getListeners(module.default);
    // console.log((module.default.onClick()));
    callback({
      name: name, //module.default.name,
      //      listeners,
      template,
      style,
      script,
      //settings
    });
    //});
  }
  registerComponent = function ({ template, style, name, listeners, script, settings }) {
    if (!customElements.get(name)) {
      class UnityComponent extends HTMLElement {
        constructor() {
          // Always call super first in constructor
          super();
  
          if (script !== "") {
            var m;
            var importRegex = /get\(.*\)\;/m;
  
            while ((m = importRegex.exec(script)) !== null) {
              m.forEach(function () {
                script = script.replace(m[0], "");
                eval(m[0]);
              });
            }
  
            var timelateLines = template.split("\n");
            var styleLines = style.split("\n");
            var lineBreaks = "\n";
            for (let index = 0; index < timelateLines.length + 1 + styleLines.length; index++) {
              lineBreaks += "\n"
            }
            
            if (script.trim().indexOf("class") == 0) {
              this.componentClass = eval("//" + name + lineBreaks + "//" + name + "\n\nnew " + script.trim() + "");
              this.lifecycle = this.componentClass.lifecycle;
              if (typeof this.lifecycle !== "undefined") {
                if (typeof this.lifecycle.beforeConstruct !== "undefined") {
                  this.lifecycle.beforeConstruct();
                }
              }    
              this.uid = '_' + Math.random().toString(36).substr(2, 9);
              var component = this;
    
              var data = this.componentClass.data;
              data.props = {};
              this.methods = this.componentClass.methods;
    
              this.watch = this.componentClass.watch;
              this.component = this;
    
              this.parent = this.getRootNode().host;
    
              // simply.components[this.uid] = this;
    
              for (var i = 0; i < this.attributes.length; i++) {
                var attrib = this.attributes[i];
                // array ya da obj ise stringify
                try {
                  data.props[attrib.name] = JSON.parse(attrib.value);
                } catch (e) {
                  data.props[attrib.name] = attrib.value;
                }
              }
              this.data = data;
    
              if (typeof this.lifecycle !== "undefined") {
                if (typeof this.lifecycle.afterConstruct !== "undefined") {
                  this.lifecycle.afterConstruct();
                }
              }                    
            }
          }
        }
        // invoked each time the custom element is appended
        // into a document-connected element
        observeAttrChange(el, callback) {
          var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              if (mutation.type === 'attributes') {
                var newVal = mutation.target.getAttribute(mutation.attributeName);
                callback(mutation.attributeName, newVal);
              }
            });
          });
          observer.observe(el, {
            attributes: true,
            childList: false,
            characterData: false,
            subtree: false,
            attributeOldValue: true,
            characterDataOldValue: false
          });
          return observer;
        }
        connectedCallback() {
          this.observeAttrChange(this, function (name, newValue) {
            try {
              newValue = JSON.parse(newValue);
            } catch (e) {
              newValue = newValue;
            }
            if (newValue !== self.data.props[name]) {
              self.data.props[name] = newValue;
              if (typeof self.lifecycle !== "undefined") {
                if (typeof self.lifecycle.whenPropChange !== "undefined") {
                  self.lifecycle.whenPropChange(name, self.data.props[name], newValue);
                }
              }
            }
          });
  
          let self = this;
          this.render();
  
          if (this.data) {
            
              obaa(this.data, function (name, value, old, parents) {
                if (typeof self.lifecycle !== "undefined") {
                  if (typeof self.lifecycle.whenDataChange !== "undefined") {
                    console.log(self.lifecycle.whenDataChange(name, value, old, parents));
                    if (self.lifecycle.whenDataChange(name, value, old, parents) == false) {
                      return false;
                    };
                  }
                }
                self.render();
                //console.log("key:" + name + ", new value: " + value + ", old value: " + old + ", tree: " + parents);
                if (self.props) {
                  if (parents == "#-props") {
                    self.setAttribute(name, JSON.stringify(self.data.props[name]));
                  }
                  else {
                    name = parents.split("-")[2];
                    self.setAttribute(name, JSON.stringify(self.data.props[name]));
                  }
                }
                if (typeof self.watch !== "undefined") {
                  self.watch(name, value, old, parents);
                }
              });
              //this._attachListeners();            

  
          }
  
        }
  
        render() {
          let m;
          let regex = /\s+on[a-z]+\=(\"|\')(.+)(\"|\')/gm;
          while ((m = regex.exec(template)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
              regex.lastIndex++;
            }
            if (m[2].indexOf("this.getRootNode().host.methods") == -1) {
              //template = template.replace(m[2], "this.getRootNode().host.methods." + m[2]);
              //template = template.replace(new RegExp(escapeRegExp(m[2]), 'g'), "this.getRootNode().host.methods." + m[2]);
              template = template.split(m[2]).join("this.getRootNode().host.methods." + m[2])
            }
          }
  
          if (!this.rendered) {
            let parsedTemplate = simply.parseTemplate(template, this.data);
            if (style !== "") {
              let parsedStyle = simply.parseStyle(style, this.data);
              parsedTemplate = parsedTemplate + "<style>" + parsedStyle + "</style>";
            }

            if (typeof this.lifecycle !== "undefined") {
              if (typeof this.lifecycle.beforeFirstRender !== "undefined") {
                if (typeof this.lifecycle.beforeFirstRender(parsedTemplate) !== "undefined")  {
                  parsedTemplate = this.lifecycle.beforeFirstRender(parsedTemplate);
                }
              }
            }
            this.dom = this.attachShadow({ mode: 'open' });
            //this.dom.appendChild(style.cloneNode(true));
            this.dom.innerHTML = parsedTemplate;
            
            setTimeout(() => {
              if (typeof this.lifecycle !== "undefined") {
                if (typeof this.lifecycle.afterFirstRender !== "undefined") {
                  this.lifecycle.afterFirstRender();
                }
              }              
            }, 0);

          }
          else {
            if (typeof this.lifecycle !== "undefined") {
              if (typeof this.lifecycle.beforeRerender !== "undefined") {
                this.lifecycle.beforeRerender();
              }
            }
            var newDom = document.createElement("div");
            let parsedTemplate = simply.parseTemplate(template, this.data);
            let parsedStyle = simply.parseStyle(style, this.data);
  
            newDom.innerHTML = parsedTemplate + "<style>" + parsedStyle + "</style>";
  
            //console.log(this.dom, newDom);
            morphdom(this.dom, newDom, {
              childrenOnly: true,
              onBeforeElChildrenUpdated: function (fromEl) {
                // console.log(fromEl.tagName);
                if (fromEl.tagName == "CHILD-COMPONENT") {
                  console.log("dont again");
                }
  
                //console.log(toEl);
              }
            });
            if (typeof this.lifecycle !== "undefined") {
              if (typeof this.lifecycle.afterRerender !== "undefined") {
                this.lifecycle.afterRerender();
              }
            }
          }
          this.rendered = true;
        }
        // Invoked each time the custom element is
        // disconnected from the document's DOM.
        disconnectedCallback() {
          if (typeof this.lifecycle !== "undefined") {
            if (typeof this.lifecycle.disconnected !== "undefined") {
              this.lifecycle.disconnected();
            }
          }
        }
        // invoked when one of the custom element's attributes
        // is added, removed, or changed.
        attributeChangedCallback(name, oldValue, newValue) {
          // if data.
  
        }
        adoptedCallback() { }
  
        _attachListeners() {
        }
      }
      return customElements.define(name, UnityComponent);
    }
  }
}

/*
 * obaa 2.1.1
 * By dntzhang
 * Github: https://github.com/Tencent/omi/tree/master/packages/obaa
 * MIT Licensed.
 */


// __r_: root
// __c_: prop change callback
// __p_: path

; (function (win) {
  function obaa(target, arr, callback) {

    var eventPropArr = []
    if (isArray(target)) {
      if (target.length === 0) {
        target.__o_ = {
          __r_: target,
          __p_: '#'
        }
      }
      mock(target, target)
    }
    if (target && typeof target === 'object' && Object.keys(target).length === 0) {
      track(target)
      target.__o_.__r_ = target
    }
    for (var prop in target) {
      if (target.hasOwnProperty(prop)) {
        if (callback) {
          if (isArray(arr) && isInArray(arr, prop)) {
            eventPropArr.push(prop)
            watch(target, prop, null, target)
          } else if (isString(arr) && prop == arr) {
            eventPropArr.push(prop)
            watch(target, prop, null, target)
          }
        } else {
          eventPropArr.push(prop)
          watch(target, prop, null, target)
        }
      }
    }
    if (!target.__c_) {
      target.__c_ = []
    }
    var propChanged = callback ? callback : arr
    target.__c_.push({
      all: !callback,
      propChanged: propChanged,
      eventPropArr: eventPropArr
    })
  }

  var triggerStr = [
    'concat',
    'copyWithin',
    'fill',
    'pop',
    'push',
    'reverse',
    'shift',
    'sort',
    'splice',
    'unshift',
    'size'
  ].join(',')

  var methods = [
    'concat',
    'copyWithin',
    'entries',
    'every',
    'fill',
    'filter',
    'find',
    'findIndex',
    'forEach',
    'includes',
    'indexOf',
    'join',
    'keys',
    'lastIndexOf',
    'map',
    'pop',
    'push',
    'reduce',
    'reduceRight',
    'reverse',
    'shift',
    'slice',
    'some',
    'sort',
    'splice',
    'toLocaleString',
    'toString',
    'unshift',
    'values',
    'size'
  ]

  function mock(target, root) {
    methods.forEach(function (item) {
      target[item] = function () {
        var old = Array.prototype.slice.call(this, 0)
        var result = Array.prototype[item].apply(
          this,
          Array.prototype.slice.call(arguments)
        )
        if (new RegExp('\\b' + item + '\\b').test(triggerStr)) {
          for (var cprop in this) {
            if (
              this.hasOwnProperty(cprop) &&
              !isFunction(this[cprop])
            ) {
              watch(this, cprop, this.__o_.__p_, root)
            }
          }
          //todo
          onPropertyChanged(
            'Array-' + item,
            this,
            old,
            this,
            this.__o_.__p_,
            root
          )
        }
        return result
      }
      target[
        'pure' + item.substring(0, 1).toUpperCase() + item.substring(1)
      ] = function () {
        return Array.prototype[item].apply(
          this,
          Array.prototype.slice.call(arguments)
        )
      }
    })
  }

  function watch(target, prop, path, root) {
    if (prop === '__o_') return
    if (isFunction(target[prop])) return
    if (!target.__o_) target.__o_ = {
      __r_: root
    }
    if (path !== undefined && path !== null) {
      target.__o_.__p_ = path
    } else {
      target.__o_.__p_ = '#'
    }

    var currentValue = (target.__o_[prop] = target[prop])
    Object.defineProperty(target, prop, {
      get: function () {
        return this.__o_[prop]
      },
      set: function (value) {
        var old = this.__o_[prop]
        this.__o_[prop] = value
        onPropertyChanged(
          prop,
          value,
          old,
          this,
          target.__o_.__p_,
          root
        )
      },
      configurable: true,
      enumerable: true
    })
    if (typeof currentValue == 'object') {
      if (isArray(currentValue)) {
        mock(currentValue, root)
        if (currentValue.length === 0) {
          track(currentValue, prop, path)
        }
      }
      if (currentValue && Object.keys(currentValue).length === 0) {
        track(currentValue, prop, path)
      }
      for (var cprop in currentValue) {
        if (currentValue.hasOwnProperty(cprop)) {
          watch(
            currentValue,
            cprop,
            target.__o_.__p_ + '-' + prop,
            root
          )
        }
      }
    }
  }

  function track(obj, prop, path) {
    if (obj.__o_) {
      return
    }
    obj.__o_ = {}
    if (path !== undefined && path !== null) {
      obj.__o_.__p_ = path + '-' + prop
    } else {
      if (prop !== undefined && prop !== null) {
        obj.__o_.__p_ = '#' + '-' + prop
      } else {
        obj.__o_.__p_ = '#'
      }
    }
  }


  function onPropertyChanged(prop, value, oldValue, target, path, root) {
    if (value !== oldValue && (!(nan(value) && nan(oldValue))) && root.__c_) {
      var rootName = getRootName(prop, path)
      for (
        var i = 0, len = root.__c_.length;
        i < len;
        i++
      ) {
        var handler = root.__c_[i]
        if (
          handler.all ||
          isInArray(handler.eventPropArr, rootName) ||
          rootName.indexOf('Array-') === 0
        ) {
          if (value == "__deleted__") {
            delete target[prop];
            delete target.__o_[prop];
          }
          handler.propChanged.call(target, prop, value, oldValue, path)
        }
      }
    }

    if (prop.indexOf('Array-') !== 0 && typeof value === 'object') {
      watch(target, prop, target.__o_.__p_, root)
    }
  }

  function isFunction(obj) {
    return Object.prototype.toString.call(obj) == '[object Function]'
  }

  function nan(value) {
    return typeof value === "number" && isNaN(value)
  }

  function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  function isString(obj) {
    return typeof obj === 'string'
  }

  function isInArray(arr, item) {
    for (var i = arr.length; --i > -1;) {
      if (item === arr[i]) return true
    }
    return false
  }


  function getRootName(prop, path) {
    if (path === '#') {
      return prop
    }
    return path.split('-')[1]
  }

  obaa.add = function (obj, prop) {
    watch(obj, prop, obj.__o_.__p_, obj.__o_.__r_)
  }

  obaa.set = function (obj, prop, value) {
    if (obj[prop] === undefined) {
      watch(obj, prop, obj.__o_.__p_, obj.__o_.__r_)
    }
    obj[prop] = value
  }

  obaa.delete = function (obj, prop, value) {
    obj[prop] = "__deleted__";
    watch(obj, prop, obj.__o_, obj.__o_)
  }

  Array.prototype.size = function (length) {
    this.length = length
  }

  if (
    typeof module != 'undefined' &&
    module.exports) {
    module.exports = obaa
  } else if (typeof define === 'function' && define.amd) {
    define(obaa)
  } else {
    win.obaa = obaa
  }
})(Function('return this')());

(function (global, factory) { typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = global || self, global.morphdom = factory()) })(this, function () { "use strict"; var DOCUMENT_FRAGMENT_NODE = 11; function morphAttrs(fromNode, toNode) { var toNodeAttrs = toNode.attributes; var attr; var attrName; var attrNamespaceURI; var attrValue; var fromValue; if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) { return } for (var i = toNodeAttrs.length - 1; i >= 0; i--) { attr = toNodeAttrs[i]; attrName = attr.name; attrNamespaceURI = attr.namespaceURI; attrValue = attr.value; if (attrNamespaceURI) { attrName = attr.localName || attrName; fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName); if (fromValue !== attrValue) { if (attr.prefix === "xmlns") { attrName = attr.name } fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue) } } else { fromValue = fromNode.getAttribute(attrName); if (fromValue !== attrValue) { fromNode.setAttribute(attrName, attrValue) } } } var fromNodeAttrs = fromNode.attributes; for (var d = fromNodeAttrs.length - 1; d >= 0; d--) { attr = fromNodeAttrs[d]; attrName = attr.name; attrNamespaceURI = attr.namespaceURI; if (attrNamespaceURI) { attrName = attr.localName || attrName; if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) { fromNode.removeAttributeNS(attrNamespaceURI, attrName) } } else { if (!toNode.hasAttribute(attrName)) { fromNode.removeAttribute(attrName) } } } } var range; var NS_XHTML = "http://www.w3.org/1999/xhtml"; var doc = typeof document === "undefined" ? undefined : document; var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template"); var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange(); function createFragmentFromTemplate(str) { var template = doc.createElement("template"); template.innerHTML = str; return template.content.childNodes[0] } function createFragmentFromRange(str) { if (!range) { range = doc.createRange(); range.selectNode(doc.body) } var fragment = range.createContextualFragment(str); return fragment.childNodes[0] } function createFragmentFromWrap(str) { var fragment = doc.createElement("body"); fragment.innerHTML = str; return fragment.childNodes[0] } function toElement(str) { str = str.trim(); if (HAS_TEMPLATE_SUPPORT) { return createFragmentFromTemplate(str) } else if (HAS_RANGE_SUPPORT) { return createFragmentFromRange(str) } return createFragmentFromWrap(str) } function compareNodeNames(fromEl, toEl) { var fromNodeName = fromEl.nodeName; var toNodeName = toEl.nodeName; var fromCodeStart, toCodeStart; if (fromNodeName === toNodeName) { return true } fromCodeStart = fromNodeName.charCodeAt(0); toCodeStart = toNodeName.charCodeAt(0); if (fromCodeStart <= 90 && toCodeStart >= 97) { return fromNodeName === toNodeName.toUpperCase() } else if (toCodeStart <= 90 && fromCodeStart >= 97) { return toNodeName === fromNodeName.toUpperCase() } else { return false } } function createElementNS(name, namespaceURI) { return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name) } function moveChildren(fromEl, toEl) { var curChild = fromEl.firstChild; while (curChild) { var nextChild = curChild.nextSibling; toEl.appendChild(curChild); curChild = nextChild } return toEl } function syncBooleanAttrProp(fromEl, toEl, name) { if (fromEl[name] !== toEl[name]) { fromEl[name] = toEl[name]; if (fromEl[name]) { fromEl.setAttribute(name, "") } else { fromEl.removeAttribute(name) } } } var specialElHandlers = { OPTION: function (fromEl, toEl) { var parentNode = fromEl.parentNode; if (parentNode) { var parentName = parentNode.nodeName.toUpperCase(); if (parentName === "OPTGROUP") { parentNode = parentNode.parentNode; parentName = parentNode && parentNode.nodeName.toUpperCase() } if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) { if (fromEl.hasAttribute("selected") && !toEl.selected) { fromEl.setAttribute("selected", "selected"); fromEl.removeAttribute("selected") } parentNode.selectedIndex = -1 } } syncBooleanAttrProp(fromEl, toEl, "selected") }, INPUT: function (fromEl, toEl) { syncBooleanAttrProp(fromEl, toEl, "checked"); syncBooleanAttrProp(fromEl, toEl, "disabled"); if (fromEl.value !== toEl.value) { fromEl.value = toEl.value } if (!toEl.hasAttribute("value")) { fromEl.removeAttribute("value") } }, TEXTAREA: function (fromEl, toEl) { var newValue = toEl.value; if (fromEl.value !== newValue) { fromEl.value = newValue } var firstChild = fromEl.firstChild; if (firstChild) { var oldValue = firstChild.nodeValue; if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) { return } firstChild.nodeValue = newValue } }, SELECT: function (fromEl, toEl) { if (!toEl.hasAttribute("multiple")) { var selectedIndex = -1; var i = 0; var curChild = fromEl.firstChild; var optgroup; var nodeName; while (curChild) { nodeName = curChild.nodeName && curChild.nodeName.toUpperCase(); if (nodeName === "OPTGROUP") { optgroup = curChild; curChild = optgroup.firstChild } else { if (nodeName === "OPTION") { if (curChild.hasAttribute("selected")) { selectedIndex = i; break } i++ } curChild = curChild.nextSibling; if (!curChild && optgroup) { curChild = optgroup.nextSibling; optgroup = null } } } fromEl.selectedIndex = selectedIndex } } }; var ELEMENT_NODE = 1; var DOCUMENT_FRAGMENT_NODE$1 = 11; var TEXT_NODE = 3; var COMMENT_NODE = 8; function noop() { } function defaultGetNodeKey(node) { if (node) { return node.getAttribute && node.getAttribute("id") || node.id } } function morphdomFactory(morphAttrs) { return function morphdom(fromNode, toNode, options) { if (!options) { options = {} } if (typeof toNode === "string") { if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") { var toNodeHtml = toNode; toNode = doc.createElement("html"); toNode.innerHTML = toNodeHtml } else { toNode = toElement(toNode) } } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) { toNode = toNode.firstElementChild } var getNodeKey = options.getNodeKey || defaultGetNodeKey; var onBeforeNodeAdded = options.onBeforeNodeAdded || noop; var onNodeAdded = options.onNodeAdded || noop; var onBeforeElUpdated = options.onBeforeElUpdated || noop; var onElUpdated = options.onElUpdated || noop; var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop; var onNodeDiscarded = options.onNodeDiscarded || noop; var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop; var childrenOnly = options.childrenOnly === true; var fromNodesLookup = Object.create(null); var keyedRemovalList = []; function addKeyedRemoval(key) { keyedRemovalList.push(key) } function walkDiscardedChildNodes(node, skipKeyedNodes) { if (node.nodeType === ELEMENT_NODE) { var curChild = node.firstChild; while (curChild) { var key = undefined; if (skipKeyedNodes && (key = getNodeKey(curChild))) { addKeyedRemoval(key) } else { onNodeDiscarded(curChild); if (curChild.firstChild) { walkDiscardedChildNodes(curChild, skipKeyedNodes) } } curChild = curChild.nextSibling } } } function removeNode(node, parentNode, skipKeyedNodes) { if (onBeforeNodeDiscarded(node) === false) { return } if (parentNode) { parentNode.removeChild(node) } onNodeDiscarded(node); walkDiscardedChildNodes(node, skipKeyedNodes) } function indexTree(node) { if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) { var curChild = node.firstChild; while (curChild) { var key = getNodeKey(curChild); if (key) { fromNodesLookup[key] = curChild } indexTree(curChild); curChild = curChild.nextSibling } } } indexTree(fromNode); function handleNodeAdded(el) { onNodeAdded(el); var curChild = el.firstChild; while (curChild) { var nextSibling = curChild.nextSibling; var key = getNodeKey(curChild); if (key) { var unmatchedFromEl = fromNodesLookup[key]; if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) { curChild.parentNode.replaceChild(unmatchedFromEl, curChild); morphEl(unmatchedFromEl, curChild) } else { handleNodeAdded(curChild) } } else { handleNodeAdded(curChild) } curChild = nextSibling } } function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) { while (curFromNodeChild) { var fromNextSibling = curFromNodeChild.nextSibling; if (curFromNodeKey = getNodeKey(curFromNodeChild)) { addKeyedRemoval(curFromNodeKey) } else { removeNode(curFromNodeChild, fromEl, true) } curFromNodeChild = fromNextSibling } } function morphEl(fromEl, toEl, childrenOnly) { var toElKey = getNodeKey(toEl); if (toElKey) { delete fromNodesLookup[toElKey] } if (!childrenOnly) { if (onBeforeElUpdated(fromEl, toEl) === false) { return } morphAttrs(fromEl, toEl); onElUpdated(fromEl); if (onBeforeElChildrenUpdated(fromEl, toEl) === false) { return } } if (fromEl.nodeName !== "TEXTAREA") { morphChildren(fromEl, toEl) } else { specialElHandlers.TEXTAREA(fromEl, toEl) } } function morphChildren(fromEl, toEl) { var curToNodeChild = toEl.firstChild; var curFromNodeChild = fromEl.firstChild; var curToNodeKey; var curFromNodeKey; var fromNextSibling; var toNextSibling; var matchingFromEl; outer: while (curToNodeChild) { toNextSibling = curToNodeChild.nextSibling; curToNodeKey = getNodeKey(curToNodeChild); while (curFromNodeChild) { fromNextSibling = curFromNodeChild.nextSibling; if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) { curToNodeChild = toNextSibling; curFromNodeChild = fromNextSibling; continue outer } curFromNodeKey = getNodeKey(curFromNodeChild); var curFromNodeType = curFromNodeChild.nodeType; var isCompatible = undefined; if (curFromNodeType === curToNodeChild.nodeType) { if (curFromNodeType === ELEMENT_NODE) { if (curToNodeKey) { if (curToNodeKey !== curFromNodeKey) { if (matchingFromEl = fromNodesLookup[curToNodeKey]) { if (fromNextSibling === matchingFromEl) { isCompatible = false } else { fromEl.insertBefore(matchingFromEl, curFromNodeChild); if (curFromNodeKey) { addKeyedRemoval(curFromNodeKey) } else { removeNode(curFromNodeChild, fromEl, true) } curFromNodeChild = matchingFromEl } } else { isCompatible = false } } } else if (curFromNodeKey) { isCompatible = false } isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild); if (isCompatible) { morphEl(curFromNodeChild, curToNodeChild) } } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) { isCompatible = true; if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) { curFromNodeChild.nodeValue = curToNodeChild.nodeValue } } } if (isCompatible) { curToNodeChild = toNextSibling; curFromNodeChild = fromNextSibling; continue outer } if (curFromNodeKey) { addKeyedRemoval(curFromNodeKey) } else { removeNode(curFromNodeChild, fromEl, true) } curFromNodeChild = fromNextSibling } if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) { fromEl.appendChild(matchingFromEl); morphEl(matchingFromEl, curToNodeChild) } else { var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild); if (onBeforeNodeAddedResult !== false) { if (onBeforeNodeAddedResult) { curToNodeChild = onBeforeNodeAddedResult } if (curToNodeChild.actualize) { curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc) } fromEl.appendChild(curToNodeChild); handleNodeAdded(curToNodeChild) } } curToNodeChild = toNextSibling; curFromNodeChild = fromNextSibling } cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey); var specialElHandler = specialElHandlers[fromEl.nodeName]; if (specialElHandler) { specialElHandler(fromEl, toEl) } } var morphedNode = fromNode; var morphedNodeType = morphedNode.nodeType; var toNodeType = toNode.nodeType; if (!childrenOnly) { if (morphedNodeType === ELEMENT_NODE) { if (toNodeType === ELEMENT_NODE) { if (!compareNodeNames(fromNode, toNode)) { onNodeDiscarded(fromNode); morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI)) } } else { morphedNode = toNode } } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { if (toNodeType === morphedNodeType) { if (morphedNode.nodeValue !== toNode.nodeValue) { morphedNode.nodeValue = toNode.nodeValue } return morphedNode } else { morphedNode = toNode } } } if (morphedNode === toNode) { onNodeDiscarded(fromNode) } else { if (toNode.isSameNode && toNode.isSameNode(morphedNode)) { return } morphEl(morphedNode, toNode, childrenOnly); if (keyedRemovalList) { for (var i = 0, len = keyedRemovalList.length; i < len; i++) { var elToRemove = fromNodesLookup[keyedRemovalList[i]]; if (elToRemove) { removeNode(elToRemove, elToRemove.parentNode, false) } } } } if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) { if (morphedNode.actualize) { morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc) } fromNode.parentNode.replaceChild(morphedNode, fromNode) } return morphedNode } } var morphdom = morphdomFactory(morphAttrs); return morphdom });

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.Navigo = factory());
}(this, (function () {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function isPushStateAvailable() {
    return !!(typeof window !== 'undefined' && window.history && window.history.pushState);
  }

  function Navigo(r, useHash, hash) {
    this.root = null;
    this._routes = [];
    this._useHash = useHash;
    this._hash = typeof hash === 'undefined' ? '#' : hash;
    this._paused = false;
    this._destroyed = false;
    this._lastRouteResolved = null;
    this._notFoundHandler = null;
    this._defaultHandler = null;
    this._usePushState = !useHash && isPushStateAvailable();
    this._onLocationChange = this._onLocationChange.bind(this);
    this._genericHooks = null;
    this._historyAPIUpdateMethod = 'pushState';

    if (r) {
      this.root = useHash ? r.replace(/\/$/, '/' + this._hash) : r.replace(/\/$/, '');
    } else if (useHash) {
      this.root = this._cLoc().split(this._hash)[0].replace(/\/$/, '/' + this._hash);
    }

    this._listen();
    this.updatePageLinks();
  }

  function clean(s) {
    if (s instanceof RegExp) return s;
    return s.replace(/\/+$/, '').replace(/^\/+/, '^/');
  }

  function regExpResultToParams(match, names) {
    if (names.length === 0) return null;
    if (!match) return null;
    return match.slice(1, match.length).reduce(function (params, value, index) {
      if (params === null) params = {};
      params[names[index]] = decodeURIComponent(value);
      return params;
    }, null);
  }

  function replaceDynamicURLParts(route) {
    var paramNames = [],
      regexp;

    if (route instanceof RegExp) {
      regexp = route;
    } else {
      regexp = new RegExp(route.replace(Navigo.PARAMETER_REGEXP, function (full, dots, name) {
        paramNames.push(name);
        return Navigo.REPLACE_VARIABLE_REGEXP;
      }).replace(Navigo.WILDCARD_REGEXP, Navigo.REPLACE_WILDCARD) + Navigo.FOLLOWED_BY_SLASH_REGEXP, Navigo.MATCH_REGEXP_FLAGS);
    }
    return { regexp: regexp, paramNames: paramNames };
  }

  function getUrlDepth(url) {
    return url.replace(/\/$/, '').split('/').length;
  }

  function compareUrlDepth(urlA, urlB) {
    return getUrlDepth(urlB) - getUrlDepth(urlA);
  }

  function findMatchedRoutes(url) {
    var routes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    return routes.map(function (route) {
      var _replaceDynamicURLPar = replaceDynamicURLParts(clean(route.route)),
        regexp = _replaceDynamicURLPar.regexp,
        paramNames = _replaceDynamicURLPar.paramNames;

      var match = url.replace(/^\/+/, '/').match(regexp);
      var params = regExpResultToParams(match, paramNames);

      return match ? { match: match, route: route, params: params } : false;
    }).filter(function (m) {
      return m;
    });
  }

  function match(url, routes) {
    return findMatchedRoutes(url, routes)[0] || false;
  }

  function root(url, routes) {
    var matched = routes.map(function (route) {
      return route.route === '' || route.route === '*' ? url : url.split(new RegExp(route.route + '($|\/)'))[0];
    });
    var fallbackURL = clean(url);

    if (matched.length > 1) {
      return matched.reduce(function (result, url) {
        if (result.length > url.length) result = url;
        return result;
      }, matched[0]);
    } else if (matched.length === 1) {
      return matched[0];
    }
    return fallbackURL;
  }

  function isHashChangeAPIAvailable() {
    return typeof window !== 'undefined' && 'onhashchange' in window;
  }

  function extractGETParameters(url) {
    return url.split(/\?(.*)?$/).slice(1).join('');
  }

  function getOnlyURL(url, useHash, hash) {
    var onlyURL = url,
      split;
    var cleanGETParam = function cleanGETParam(str) {
      return str.split(/\?(.*)?$/)[0];
    };

    if (typeof hash === 'undefined') {
      // To preserve BC
      hash = '#';
    }

    if (isPushStateAvailable() && !useHash) {
      onlyURL = cleanGETParam(url).split(hash)[0];
    } else {
      split = url.split(hash);
      onlyURL = split.length > 1 ? cleanGETParam(split[1]) : cleanGETParam(split[0]);
    }

    return onlyURL;
  }

  function manageHooks(handler, hooks, params) {
    if (hooks && (typeof hooks === 'undefined' ? 'undefined' : _typeof(hooks)) === 'object') {
      if (hooks.before) {
        hooks.before(function () {
          var shouldRoute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

          if (!shouldRoute) return;
          handler();
          hooks.after && hooks.after(params);
        }, params);
        return;
      } else if (hooks.after) {
        handler();
        hooks.after && hooks.after(params);
        return;
      }
    }
    handler();
  }

  function isHashedRoot(url, useHash, hash) {
    if (isPushStateAvailable() && !useHash) {
      return false;
    }

    if (!url.match(hash)) {
      return false;
    }

    var split = url.split(hash);

    return split.length < 2 || split[1] === '';
  }

  Navigo.prototype = {
    helpers: {
      match: match,
      root: root,
      clean: clean,
      getOnlyURL: getOnlyURL
    },
    navigate: function navigate(path, absolute, force = false) {
      var to;

      path = path || '';
      if (this._usePushState) {
        to = (!absolute ? this._getRoot() + '/' : '') + path.replace(/^\/+/, '/');
        to = to.replace(/([^:])(\/{2,})/g, '$1/');
        if (to !== document.location.href) {
          history[this._historyAPIUpdateMethod]({}, '', to);
        }
        this.resolve(null, force);
      } else if (typeof window !== 'undefined') {
        path = path.replace(new RegExp('^' + this._hash), '');
        window.location.href = window.location.href.replace(/#$/, '').replace(new RegExp(this._hash + '.*$'), '') + this._hash + path;
      }
      return this;
    },
    on: function on() {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof args[0] === 'function') {
        this._defaultHandler = { handler: args[0], hooks: args[1] };
      } else if (args.length >= 2) {
        if (args[0] === '/') {
          var func = args[1];

          if (_typeof(args[1]) === 'object') {
            func = args[1].uses;
          }

          this._defaultHandler = { handler: func, hooks: args[2] };
        } else {
          this._add(args[0], args[1], args[2]);
        }
      } else if (_typeof(args[0]) === 'object') {
        var orderedRoutes = Object.keys(args[0]).sort(compareUrlDepth);

        orderedRoutes.forEach(function (route) {
          _this.on(route, args[0][route]);
        });
      }
      return this;
    },
    off: function off(handler) {
      if (this._defaultHandler !== null && handler === this._defaultHandler.handler) {
        this._defaultHandler = null;
      } else if (this._notFoundHandler !== null && handler === this._notFoundHandler.handler) {
        this._notFoundHandler = null;
      }
      this._routes = this._routes.reduce(function (result, r) {
        if (r.handler !== handler) result.push(r);
        return result;
      }, []);
      return this;
    },
    notFound: function notFound(handler, hooks) {
      this._notFoundHandler = { handler: handler, hooks: hooks };
      return this;
    },
    resolve: function resolve(current, force = false) {
      var _this2 = this;

      var handler, m;
      var url = (current || this._cLoc()).replace(this._getRoot(), '');

      if (this._useHash) {
        url = url.replace(new RegExp('^\/' + this._hash), '/');
      }

      var GETParameters = extractGETParameters(current || this._cLoc());
      var onlyURL = getOnlyURL(url, this._useHash, this._hash);

      if (this._paused) return false;

      if (this._lastRouteResolved && onlyURL === this._lastRouteResolved.url && GETParameters === this._lastRouteResolved.query) {
        if (this._lastRouteResolved.hooks && this._lastRouteResolved.hooks.already) {
          this._lastRouteResolved.hooks.already(this._lastRouteResolved.params);

        }
        if (force !== true) {
          return false;
        }

      }

      m = match(onlyURL, this._routes);

      if (m) {

        this._callLeave();
        this._lastRouteResolved = {
          url: onlyURL,
          query: GETParameters,
          hooks: m.route.hooks,
          params: m.params,
          name: m.route.name
        };
        handler = m.route.handler;
        manageHooks(function () {
          manageHooks(function () {
            m.route.route instanceof RegExp ? handler.apply(undefined, m.match.slice(1, m.match.length)) : handler(m.params, GETParameters);
          }, m.route.hooks, m.params, _this2._genericHooks);
        }, this._genericHooks, m.params);
        return m;
      } else if (this._defaultHandler && (onlyURL === '' || onlyURL === '/' || onlyURL === this._hash || isHashedRoot(onlyURL, this._useHash, this._hash))) {
        manageHooks(function () {
          manageHooks(function () {
            _this2._callLeave();
            _this2._lastRouteResolved = { url: onlyURL, query: GETParameters, hooks: _this2._defaultHandler.hooks };
            _this2._defaultHandler.handler(GETParameters);
          }, _this2._defaultHandler.hooks);
        }, this._genericHooks);
        return true;
      } else if (this._notFoundHandler) {
        manageHooks(function () {
          manageHooks(function () {
            _this2._callLeave();
            _this2._lastRouteResolved = { url: onlyURL, query: GETParameters, hooks: _this2._notFoundHandler.hooks };
            _this2._notFoundHandler.handler(GETParameters);
          }, _this2._notFoundHandler.hooks);
        }, this._genericHooks);
      }
      return false;
    },
    destroy: function destroy() {
      this._routes = [];
      this._destroyed = true;
      this._lastRouteResolved = null;
      this._genericHooks = null;
      clearTimeout(this._listeningInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', this._onLocationChange);
        window.removeEventListener('hashchange', this._onLocationChange);
      }
    },
    updatePageLinks: function updatePageLinks() {
      var self = this;

      if (typeof document === 'undefined') return;

      this._findLinks().forEach(function (link) {
        if (!link.hasListenerAttached) {
          link.addEventListener('click', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.target.tagName.toLowerCase() == 'a') {
              return false;
            }
            var location = self.getLinkPath(link);

            if (!self._destroyed) {
              e.preventDefault();
              self.navigate(location.replace(/\/+$/, '').replace(/^\/+/, '/'));
            }
          });
          link.hasListenerAttached = true;
        }
      });
    },
    generate: function generate(name) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var result = this._routes.reduce(function (result, route) {
        var key;

        if (route.name === name) {
          result = route.route;
          for (key in data) {
            result = result.toString().replace(':' + key, data[key]);
          }
        }
        return result;
      }, '');

      return this._useHash ? this._hash + result : result;
    },
    link: function link(path) {
      return this._getRoot() + path;
    },
    pause: function pause() {
      var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this._paused = status;
      if (status) {
        this._historyAPIUpdateMethod = 'replaceState';
      } else {
        this._historyAPIUpdateMethod = 'pushState';
      }
    },
    resume: function resume() {
      this.pause(false);
    },
    historyAPIUpdateMethod: function historyAPIUpdateMethod(value) {
      if (typeof value === 'undefined') return this._historyAPIUpdateMethod;
      this._historyAPIUpdateMethod = value;
      return value;
    },
    disableIfAPINotAvailable: function disableIfAPINotAvailable() {
      if (!isPushStateAvailable()) {
        this.destroy();
      }
    },
    lastRouteResolved: function lastRouteResolved() {
      return this._lastRouteResolved;
    },
    getLinkPath: function getLinkPath(link) {
      return link.getAttribute('href');
    },
    hooks: function hooks(_hooks) {
      this._genericHooks = _hooks;
    },

    _add: function _add(route) {
      var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var hooks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (typeof route === 'string') {
        route = encodeURI(route);
      }
      this._routes.push((typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object' ? {
        route: route,
        handler: handler.uses,
        name: handler.as,
        hooks: hooks || handler.hooks
      } : { route: route, handler: handler, hooks: hooks });

      return this._add;
    },
    _getRoot: function _getRoot() {
      if (this.root !== null) return this.root;
      this.root = root(this._cLoc().split('?')[0], this._routes);
      return this.root;
    },
    _listen: function _listen() {
      var _this3 = this;

      if (this._usePushState) {
        window.addEventListener('popstate', this._onLocationChange);
      } else if (isHashChangeAPIAvailable()) {
        window.addEventListener('hashchange', this._onLocationChange);
      } else {
        var cached = this._cLoc(),
          current = void 0,
          _check = void 0;

        _check = function check() {
          current = _this3._cLoc();
          if (cached !== current) {
            cached = current;
            _this3.resolve();
          }
          _this3._listeningInterval = setTimeout(_check, 200);
        };
        _check();
      }
    },
    _cLoc: function _cLoc() {
      if (typeof window !== 'undefined') {
        if (typeof window.__NAVIGO_WINDOW_LOCATION_MOCK__ !== 'undefined') {
          return window.__NAVIGO_WINDOW_LOCATION_MOCK__;
        }
        return clean(window.location.href);
      }
      return '';
    },
    _findLinks: function _findLinks() {
      return [].slice.call(document.querySelectorAll('[data-navigo]'));
    },
    _onLocationChange: function _onLocationChange() {
      this.resolve();
    },
    _callLeave: function _callLeave() {
      var lastRouteResolved = this._lastRouteResolved;

      if (lastRouteResolved && lastRouteResolved.hooks && lastRouteResolved.hooks.leave) {
        lastRouteResolved.hooks.leave(lastRouteResolved.params);
      }
    }
  };

  Navigo.PARAMETER_REGEXP = /([:*])(\w+)/g;
  Navigo.WILDCARD_REGEXP = /\*/g;
  Navigo.REPLACE_VARIABLE_REGEXP = '([^\/]+)';
  Navigo.REPLACE_WILDCARD = '(?:.*)';
  Navigo.FOLLOWED_BY_SLASH_REGEXP = '(?:\/$|$)';
  Navigo.MATCH_REGEXP_FLAGS = '';

  return Navigo;

})));
