simply = {
	components: {},
	parseTemplate: function (parsingArgs) {
		var { template, data, style, state, parent, methods, props, component, dom, methods, lifecycle, watch } = parsingArgs;
		/* old stagg
		let ifStatement = /\<if(\s)(.*)(\>$)/;
		let elseIfStatement = /\<else(\s)if(\s)(.*)(\/)?\>$/;
		let endIfStatement = /\<\/if\>$/;
		let elseStatement = /\<else\>$/;
		let eachStatement = /\<each(\s)(.*)\s+as\s+([a-zA-Z._]+)(\s+)?(,(\s+)?)?([a-zA-Z._]+)?(\s+)?(\()?(\s+)?([a-zA-Z._]+(\s+)?)?(\))?\>$/;
		let endEachStatement = /\<\/each\>$/;
		*/
		let simplyTemplate = /\<template([^<>]*)simply([^<>]*)>$/;

		// condititionals
		let ifStart = /\<if(\s+)cond=\"(.*)\"(\>$)/;
		let ifEnd = /\<\/if\>$/;
		let elsifStart = /\<elsif(\s+)cond=\"(.*)\"(\>$)/;
		let elsifEnd = /\<\/elsif\>$/;
		let elseStart = /\<else\>$/;
		let elseEnd = /\<\/else\>$/;

		// each https://regex101.com/r/yi5jzG/1
		// https://regex101.com/r/gvHgOc/1
		let eachStart = /\<each\s+of\=\"(?<of>[^"]*)\"\s+as\=\"(?<as>[^"]*)\"(\s+key\=\"(?<key>[^"]*)\")?(\s+index\=\"(?<index>[^"]*)\")?\>$/;
		let eachEnd = /\<\/each\>$/;

		// in tag var
		// https://regex101.com/r/vzY75x/1
		let inTagVar = /:="(?<l>[^"]*)"$/;

		// this will be deleted, what a mess :/
		// let variable = /{(\s+)?([a-zA-Z_\.\+\*\d\/\=\s\(\)]+)(\s+)?}$/;
		//let variable = /(\{)([^{}\n]*)\}$/;
		// https://regex101.com/r/AAGBIE/1

		let ifCount = 0;
		let eachCount = 0;
		let m;
		let bucket = "";
		var processedLetters = "";
		var capturedLogics = [];
		var staticLetters = "";
		var flag = false;
		var curlyCount = 0;
		var curlyFlag = false;
		var varBucket = "";

		var scriptCount = 0;
		var styleCount = 0;
		var templateCount = 0;
		var simplyTemplateCount = 0;
		var ignoreFlag = false;

		for (var i = 0; i < template.length; i++) {
			processedLetters += template[i];
			bucket += template[i];

			if (bucket.substr(-"<script".length) === "<script") {
				scriptCount += 1;
			}
			else if (bucket.substr(-"<style".length) === "<style") {
				styleCount += 1;
			}
			else if (simplyTemplate.test(bucket)) {
				//bucket += "<!--";
				//processedLetters += "<!--";
				simplyTemplateCount += 1;
			}
			// else if (bucket.substr(-"<template>".length) === "<template>") {
			// 	templateCount += 1;
			// }
			else if (bucket.substr(-"</script>".length) === "</script>") {
				scriptCount -= 1;
			}
			else if (bucket.substr(-"</style>".length) === "</style>") {
				styleCount -= 1;
			}
			// inline template skip
			// we will look when construct
			else if (bucket.substr(-"</template>".length) === "</template>") {
				simplyTemplateCount -= 1;
				//bucket = bucket.replace(/<\/template>$/, "--></template>");
				//processedLetters = processedLetters.replace(/<\/template>$/, "--></template>");
			}

			if (simplyTemplateCount == 0 && styleCount == 0 && scriptCount == 0) {
				/*
				if (bucket.substr(-"function".length) === "function") {
					ignoreFlag = true;
				}
				*/
				if (template[i - 1] !== "\\" && template[i] == "{") {
					curlyCount += 1;
				}
				if (curlyCount > 0 && ignoreFlag === false) {
					varBucket += template[i];
				}
				if (template[i - 1] !== "\\" && template[i] == "}") {
					curlyCount -= 1;
					if (curlyCount == 0 && ignoreFlag === true) {
						ignoreFlag = false;
					}
				}

				// variable
				if (curlyCount == 0 && varBucket !== "") {
					// burayı regexp'ten arındırdık
					// diğerlerine de uygulayacaz inş
					varBucket = varBucket.trim();
					// console.log(varBucket);
					let variable = varBucket.trim().substring(1, varBucket.length - 1);

					if (simply.parseProp("{" + variable + "}").type == "object") {
						variable = "\"" + varBucket.trim() + "\"";
					}

					logic = "ht+=" + variable + ";";
					flag = true;
				}
				else if ((m = inTagVar.exec(bucket)) !== null) {
					logic = "ht+=" +  m.groups.l + ";";
					flag = true;
				}				
				else if ((m = ifStart.exec(bucket)) !== null) {
					logic = unescape("if (" + m[2] + ") {");
					//logic = (ifCount == 0 ? 'let ht = "";' + logic : logic);
					ifCount += 1;
					flag = true;
				}
				else if ((m = elsifStart.exec(bucket)) !== null) {
					logic = unescape(m[2]); // bu niye 3 tü
					logic = "else if (" + logic + ") {";
					flag = true;
				}
				else if ((m = elseStart.exec(bucket)) !== null) {
					logic = "else {";
					flag = true;

				}
				else if ((m = ifEnd.exec(bucket)) !== null) {
					ifCount -= 1;
					logic = "}";
					flag = true;
				}
				else if ((m = elsifEnd.exec(bucket)) !== null) {
					logic = "}";
					flag = true;
				}
				else if ((m = elseEnd.exec(bucket)) !== null) {
					logic = "}";
					flag = true;
				}								
				else if ((m = eachStart.exec(bucket)) !== null) {
					// if (eachCount > 0) {} //each içinde each
					eachCount += 1;
					try {
						subject = eval(m.groups.of);
					} catch (error) {
						//console.log(lastM + "." + m.groups.of);
						subject = m.groups.of;
					}
				
					iiii = "s" + Math.random().toString(36).slice(-7);
					if (Array.isArray(subject)) {
						key = typeof m.groups.key !== "undefined" ? "let " + m.groups.key + " = " + iiii + ";" : "";
						let index = typeof m.groups.key !== "undefined" ? "let " + m.groups.index + " = " + iiii + ";" : "";
				
						logic = "for (" + iiii + " = 0; " + iiii + " < " + m.groups.of + ".length; " + iiii + "++) { \
													" + key + "; \
													" + index + "; \
													let " + m.groups.as + "=" + m.groups.of + "[" + iiii + "];";
					}
					else {
						key = typeof m.groups.index !== "undefined" ? "let " + m.groups.index + " = " : "";
				
						// obaa objelerini exclude et
						// '__o_' || ii == '__c_' || ii == '__p_'
						logic = "\
											for (var ii in "+ m.groups.of + ") { \
												if (ii == '__o_' || ii == '__c_' || ii == '__p_' || ii == '__r_' || typeof "+ m.groups.of + "[ii] == 'function') { continue; }\
												" + key + "Object.keys(" + m.groups.of + ").indexOf(ii); \
												let " + m.groups.key + "= ii; \
												let " + m.groups.as + "=" + m.groups.of + "[ii];";
					}
					flag = true;
					lastM = m.groups.of;
					lasti = iiii;
				}

				else if ((m = eachEnd.exec(bucket)) !== null) {
					eachCount -= 1;
					logic = "};";
					flag = true;
				}
			}

			if (flag === true) {
				try {
					capturedLogics.push(m[0]);
				} catch (error) {
					capturedLogics.push(varBucket);
					varBucket = "";
				}
				let logicLine = capturedLogics[capturedLogics.length - 1];
				staticText = processedLetters.replace(logicLine, "");

				let replaceThis = staticText + logicLine;
				var withThis = "ht+=`" + staticText.replace(/\n/g, "") + "`;" + logic;

				// if else arasına ht=""; girince hata fırlatıyordu
				if (staticText.trim() == "") {
					var withThis = logic;
				}
				else {
					var withThis = "ht+=`" + staticText.replace(/\n/g, "") + "`;" + logic;
				}
				bucket = bucket.replace(replaceThis, withThis);
				//console.log(replaceThis, withThis);
				flag = false;
				processedLetters = "";
			}
		}
		// for the last non-logical text
		if (processedLetters.trimEnd() !== "") {
			processedLettersRegex = processedLetters.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			//console.log(processedLettersRegex);
			//bucket = bucket.replace(new RegExp(processedLettersRegex + '$'), "ht+=`" + processedLetters.replace(/(?:\r\n|\r|\n)/g, '').trim() + "`;")
			bucket = bucket.replace(new RegExp(processedLettersRegex + '$'), "ht+=`" + processedLetters.trimEnd() + "`;")
		}

		var ht = "";
		// console.log(bucket);
		eval(bucket);
		//console.timeEnd();
		return ht;
	},
	parseStyle: function (parsingArgs) {
		var { template, style, data, state, parent, methods, props, component, dom, methods, lifecycle, watch } = parsingArgs;
		let variable = /(\"|\')(\{)([^{}\n]*)\}(\"|\')/;
		var vars = {};
		while ((m = variable.exec(style)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === variable.lastIndex) {
				variable.lastIndex++;
			}

			var variableName = "--" + m[3].replace(/\./g, "-");
			var variableValue = eval(m[3]);

			vars[variableName] = variableValue;

			style = style.split(m[0]).join("var(" + variableName + ")");
		}
		return { style, vars };
	},
	loadJS: function (src, cb, waitBeforeCb) {
		/*! loadJS: load a JS file asynchronously. [c]2014 @scottjehl, Filament Group, Inc. (Based on http://goo.gl/REQGQ by Paul Irish). Licensed MIT */
		if (document.querySelectorAll('[src="' + src + '"]').length > 0) {
			// console.log(src + "zaten load edilmiş, cb çalıştırılıyor...");
			if (!window[waitBeforeCb]) {
				var tryAmount = 10;
				var tryCount = 0;
				var a = setInterval(() => {
					if (!window[waitBeforeCb] && tryCount < tryAmount) {
						tryCount += 1;
					}
					else {
						cb();
						clearInterval(a);
					}
				}, 50);
			}
			else {
				cb();
			}
		}
		else {
			// console.log(src + " script ilk kez yükleniyor...");
			var tmp;
			var ref = window.document.getElementsByTagName("script")[0];
			var script = window.document.createElement("script");

			script.src = src;
			script.async = true;
			ref.parentNode.insertBefore(script, ref);

			if (cb && typeof (cb) === "function") {
				script.onload = cb;
			}
		}
		// zaten load ise, sadece run cb
		return script;
	},
	get: function (path, name) {
		// multi
		if (Array.isArray(path)) {
			for (let i = 0; i < path.length; i++) {
				addTwindAndContinue(path[i])
			}
		}
		// single
		else {
			addTwindAndContinue(path)
		}
		function addTwindAndContinue(p) {
			simply.loadComponent(p, name, function (component) {
				simply.getSettings(component, function (settings) {
					let r = /class(\s+)?\{(.*)(?<twind>twind(\s+)?\=(\s+)?\{)/gms;
					if (r.test(settings.script)) {
						if (!window.twind) {
							// console.log("yes, load twind for: ", settings);
							simply.loadJS("https://simply.js.org/style/twind.min.js", function () {
								// console.log("loaded twind for: ", settings);
								simply.registerComponent(settings);
							});
						}
					}
					else {
						// console.log("no twind for you: ", settings);
						simply.registerComponent(settings)
					}
				})
			});
		}
	},
	jsdoc: function (str) {
		return str.replace(/(\n[ \t]*\/\/\/[^\n]*)+/g, function ($) {
			var replacement = '\n/**' + $.replace(/^[ \t]*\/\/\//mg, '').replace(/(\n$|$)/, '*/$1');
			return replacement;
		});
	},
	loadComponent: function (path, name, callback) {
		if (typeof name == "undefined") {
			var ext = path.split(".").pop();
			var name = path.split('\\').pop().split('/').pop().split('.').slice(0, -1).join('.');
		}
		else {
			if (name.indexOf(".") > -1) {
				var ext = name.split(".").pop();
				var name = name.replace("." + ext, "");
			}
			else {
				var ext = "html";
			}
		}

		//request.responseType = 'document';

		if (ext == "js") {
			// console.log("galiba store/state");
		}
		else if (ext == "html") {
			if (typeof simply.components[name] == "undefined") {
				simply.components[name] = {};
				var request = new XMLHttpRequest();

				request.open('GET', path, true);

				request.onload = function () {
					if (this.status >= 200 && this.status < 400) {

						// var docStr = this.response;

						let docStr = this.response;
						let parsed = simply.splitComponent(this.response);
						simply.components[name] = parsed;

						callback({
							name,
							template: parsed.template,
							style: parsed.style,
							script: parsed.script,
							docStr
						});
						//console.log(simply.importCompleted[name]);
					} else {
						//console.log("Component import error: We reached our target server, but it returned an error");
						// console.error(path + " not found!");
					}
				};
				request.onerror = function () {
				};
				request.send();
			}
			else {
				// console.log(path + " daha önce yüklendi")
			}
		}
	},
	request: function (url, callback) {
		var request = new XMLHttpRequest();
		request.open('GET', url, false);
		request.onload = function () {
			if (this.status >= 200 && this.status < 400) {
				if (callback) {
					callback(this.response);
				}
			}
		};
		request.send();
	},
	splitComponent: function (string) {
		// console.log({ string });
		var txt = document.createElement("textarea");
		var parser = new DOMParser();
		var dom = parser.parseFromString(string, "text/html");
		var template;

		var style = "";
		if (dom.querySelector("style")) {
			style = dom.querySelector("style");
			txt.innerHTML = style.innerHTML;
			style = txt.value;
			dom.querySelector("style").remove();
		}

		var script = "";
		if (dom.querySelector("script")) {
			var script = dom.querySelector("script");
			txt.innerHTML = script.innerHTML;
			script = txt.value;
			dom.querySelector("script").remove();
		}

		let head = dom.querySelector("head").innerHTML;
		let body =  dom.querySelector("body").innerHTML;
		txt.innerHTML = head + body;
		template = txt.value;

		return {
			template,
			style,
			script
		}
	},
	processPropTemplate: function (string) {
		// clean up
		var propsFromTemplate = string;
		propsFromTemplate = propsFromTemplate.replace(/(?<!\\)'/g, '"').replace(/\\'/g, "'");
		propsFromTemplate = propsFromTemplate.replace(/(?:\r\n|\r|\n)/g, ' ');

		// convert to object
		propsFromTemplate = Function("return " + propsFromTemplate)()
		propsFromTemplate = simply.customStringify(propsFromTemplate)

		propsFromTemplate = JSON.parse(propsFromTemplate);
		return propsFromTemplate;
	},
	parseProp: function (contentString) {
		var type, value, parsed, content;
		content = contentString.replace(/(?<!\\)'/g, '"').replace(/\\'/g, "'");
		try {
			parsed = JSON.parse(content);
			// obj, number ya da boolean
			// burada belli oluyor zaten
			type = typeof parsed;
			value = parsed;
			if (Array.isArray(parsed)) {
				type = "array";
			}
		}
		catch (e) {
			let func = content;
			func = eval(func);
			if (typeof func == "function") {
				type = "function";
				value = eval("(" + func + ")");
			}
		}
		finally {
			if (type == undefined) {
				type = "string";
				value = contentString;
			}

			return {
				"type": type,
				"value": value
			}
		}
	},
	prepareAttr: function (value) {
		/*
			1) change attributes with devtools and check prop values
				str, num, boo, (obj, arr, func) -> quote check
			2) change props with = and check attributes
				str, num, boo, (obj, arr, func) -> quote check
			3) props template
		*/
		let type = typeof value;
		if (Array.isArray(value) || type == "object" || type == "number" || type == "boolean") {
			// çünkü attribute zaten "" arasına yazılıyor
			return customStringify(value).replace(/(?<!\\)'/g, '"').replace(/\\'/g, "'");
		}
		else if (type == "function") {
			return value.toString().replace(/(?<!\\)'/g, '"').replace(/\\'/g, "'");
		}
		else {
			return value;
		}
	},
	customStringify: function (v) {
		const cache = new Set();
		return JSON.stringify(v, function (key, value) {
			if (key !== "__c_" && key !== "__o_" && key !== "__p_" && key !== "__r_") {
				if (typeof value === 'object' && value !== null) {
					if (cache.has(value)) {
						// Circular reference found
						try {
							// If this value does not reference a parent it can be deduped
							return JSON.parse(JSON.stringify(value));
						}
						catch (err) {
							// discard key if value cannot be deduped
							return;
						}
					}
					// Store value in our set
					cache.add(value);
				}
				else if (typeof value == "function") {
					return value.toString().replace(/(?<!\\)'/g, '"').replace(/\\'/g, "'");
				}
				return value;
			}
		});
	},
	getSettings: function ({ name, template, style, script, docStr }, callback) {
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
			docStr
			//settings
		});
		//});
	},
	registerComponent: function ({ template, style, name, script, docStr }) {
		if (!customElements.get(name)) {
			class UnityComponent extends HTMLElement {
				constructor() {
					// Always call super first in constructor
					super();

					function runGetsReturnClass(scr) {
						var gets = "";
						// class ile üst tarafı (getler) ayıralım
						if (scr.indexOf("class {") > -1) {
							var scriptParts = scr.split("class {");
							gets = scriptParts[0];
							var clss = "class {" + scriptParts[1];
						}
						else {
							gets = clss;
						}

						var m;
						var importRegex = /^\s*get\((\s+)?(\[)?([\s\S]*?)?(\,)?(\s+)?\]?(\s+)?\)(\;)?/gm
						while ((m = importRegex.exec(gets)) !== null) {
							// This is necessary to avoid infinite loops with zero-width matches
							var component = this;
							eval(m[0]);
							// pass param with eval
							// window.eval.call(window, '(function (component) {' + m[0].replace(")", ", component )") + '})')(component);
						}
						return clss;
					}					

					if (this.querySelector("template[simply]")) {
						let t = this.querySelector("template[simply]");
						let tParts = simply.splitComponent(t.innerHTML);
						console.log(tParts);
						console.log(runGetsReturnClass(tParts.script));
						// let inlineTemplate = this.querySelector("template[simply]");
						// let scr = templateContent.querySelector("script");
						// console.log(scr);
						// templateContent = templateContent.replace(/\<template([^<>}]*)simply([^<>]*)>(\s+)?<!--/, "");
						// templateContent = templateContent.replace(/-->(\s+)?<\/template>/, "");
						// let inlineComponent = simply.splitComponent(templateContent)
						// console.log(name, inlineComponent);
					}

					if (script !== "") {
						var clss = runGetsReturnClass(script);
						// // to fix console line number
						// var lines = docStr.split('<script>')[0].split("\n");
						// var lineBreaks = "";
						// for (let index = 0; index < lines.length - 2; index++) {
						// 	lineBreaks += "\n"
						// }

						if (clss.trim().indexOf("class {") == 0) {
							// this.componentClass = eval("//" + name + lineBreaks + "//" + name + "\n\nnew " + clss.trim() + "//@ sourceURL=" + name + ".html");
							this.componentClass = eval("//" + name + "//" + name + "\n\nnew " + clss.trim() + "//@ sourceURL=" + name + ".html");

							if (this.querySelector("script[prop]")) {
								let propObjString = this.querySelector("script[prop]").innerHTML;
								let propObj = processPropTemplate(propObjString);
								for (var k in propObj) {
									component.setAttribute(k, simply.prepareAttr(propObj[k]));
								}
							}

							// data, state, props, methods, lifecycle, watch
							var lifecycle;
							this.lifecycle = this.componentClass.lifecycle;
							lifecycle = this.lifecycle;

							if (typeof this.lifecycle !== "undefined") {
								if (typeof this.lifecycle.beforeConstruct !== "undefined") {
									this.lifecycle.beforeConstruct();
								}
							}

							this.uid = '_' + Math.random().toString(36).substr(2, 9);
							var component = this;
							var comp = this;
							var state;
							var parent;
							var sheet;
							var methods;
							var twindSheet;
							var tw;
							var lifecycle;
							var methods;
							var watch;

							var data = this.componentClass.data ? this.componentClass.data : {};
							var props = this.componentClass.props ? this.componentClass.props : {};
							this.data = data;
							this.props = props;

							this.methods = this.componentClass.methods;
							methods = this.methods;

							this.watch = this.componentClass.watch;
							watch = this.watch;

							this.component = this;
							this.comp = this;

							// bu kısım global styles için
							// to be continues
							if (name == "s-style") {
								var dom = this.attachShadow({ mode: 'closed' });
							}
							else {
								var dom = this.attachShadow({ mode: 'open' });
							}

							if (window.twind) {
								if (this.componentClass.twind) {
									window.twindConfig = this.componentClass.twind;
								}

								// Create separate CSSStyleSheet
								twindSheet = window.cssom(new CSSStyleSheet());

								// Use sheet and config to create an twind instance. `tw` will
								// append the right CSS to our custom stylesheet.
								tw = window.twind(window.twindConfig, twindSheet);

								// link sheet target to shadow dom root
								// dom.adoptedStyleSheets = [twindSheet.target];

								this.twindSheet = twindSheet;
								this.tw = tw;
								// finally, observe using tw function
							}

							//this.dom.appendChild(style.cloneNode(true));
							dom.innerHTML = "";
							this.dom = dom;
							this.parent = this.getRootNode().host;
							parent = this.parent;
							// simply.components[this.uid] = this;

							// atribute'ları proplara yazalım
							for (var i = 0; i < this.attributes.length; i++) {
								var attrib = this.attributes[i];
								// props[attrib.name] = attrib.value;
								props[attrib.name] = simply.parseProp(attrib.value).value;
							}
							// console.log(props.id);
							// console.log("---------------------");
							// console.log("--comp name: ", name);
							// console.log("--this: ", this.dom.host);
							// console.log("--parent: ", this.parent);
							// console.log("--getrootnode:", this.getRootNode());
							// console.log("--ppp:", this.ppp);

							// anadan babadan gelen state varsa
							if (parent) {
								if (typeof parent.state !== "undefined") {
									this.state = parent.state;
									// console.log("parent'tan state'i al", this.state);
								}
							}

							// komponent içinde state tanımlı ise
							if (typeof this.componentClass.state !== "undefined") {
								if (!this.state) {
									this.state = {};
								}
								var newStates = this.componentClass.state;
								for (let key in newStates) {
									// console.log(newStates);
									this.state[key] = newStates[key];
								}
							}

							if (typeof this.lifecycle !== "undefined") {
								if (typeof this.lifecycle.afterConstruct !== "undefined") {
									this.lifecycle.afterConstruct();
								}
							}

							state = component.state;
							parent = component.parent;
							// we couldn't get state and parent
							// bcs they are wrapped with router
							// this is a fix for that
							Object.defineProperty(this, 'state', {
								get: function () { return state; },
								set: function (v) {
									state = v;
									// print('Value changed! New value: ' + v);
								}
							});
							Object.defineProperty(this, 'parent', {
								get: function () { return parent; },
								set: function (v) {
									parent = v;
									// print('Value changed! New value: ' + v);
								}
							});
						}
					}
				}
				// invoked each time the custom element is appended
				// into a document-connected element
				observeAttrChange(el, callback) {
					var observer = new MutationObserver(function (mutations) {
						mutations.forEach(function (mutation) {
							// console.log("attribute changed", mutation);
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
						// value öncekiyle aynı değilse
						// console.log(name, newValue, self.props[name], newValue == simply.prepareAttr(self.props[name]));
						if (newValue !== simply.prepareAttr(self.props[name])) {
							try {
								newValue = simply.parseProp(newValue).value;
							} catch (e) {
								// getattribute parse edemezse
								newValue = newValue;
							}

							self.props[name] = newValue;
							if (typeof self.lifecycle !== "undefined") {
								if (typeof self.lifecycle.whenPropChange !== "undefined") {
									self.lifecycle.whenPropChange(name, self.props[name], newValue);
								}
							}
						}
					});

					let self = this;
					this.render();

					function react(name, value, old, parents, prop = false) {
						// console.log("react TO", name);
						setTimeout(function () {
							if (typeof self.lifecycle !== "undefined") {
								if (typeof self.lifecycle.whenDataChange !== "undefined") {
									//console.log(self.lifecycle.whenDataChange(name, value, old, parents));
									if (self.lifecycle.whenDataChange(name, value, old, parents) === false) {
										return false;
									};
								}
							}

							//console.log("key:" + name + ", new value: " + value + ", old value: " + old + ", tree: " + parents);
							//console.log(name, value, old, parents);
							if (prop) {
								if (self.props) {
									self.setAttribute(prop, simply.prepareAttr(self.props[prop]));
								}
							}

							if (typeof self.watch !== "undefined") {
								self.watch(name, value, old, parents);
							}

							self.render();
						}, 0);
					}

					if (this.data) {
						simply.obaa(this.data, function (name, value, old, parents) {
							react(name, value, old, parents);
						});
					}
					if (this.props) {
						simply.obaa(this.props, function (name, value, old, parents) {
							react(name, value, old, parents, name);
						});
					}
					if (this.state) {
						simply.obaa(this.state, function (name, value, old, parents) {
							react(name, value, old, parents);
						});
					}
				}
				render() {
					let m;
					// tüm on.* atribute değerleri için
					let regex = /\s+on[a-z]+\=(\"|\')([^"\n]*)(\"|\')/gm;
					while ((m = regex.exec(template)) !== null) {
						// This is necessary to avoid infinite loops with zero-width matches
						if (m.index === regex.lastIndex) {
							regex.lastIndex++;
						}
						// console.log(m);
						if (m[2].indexOf("this.getRootNode().host") == -1) {
							var builtinVars = ["methods.", "lifecycle.", "data.", "props.", "state.", "component."];

							builtinVars.forEach(v => {
								//template = template.split(v).join("this.getRootNode().host." + v)
								let n = m[0].replaceAll(v, "this.getRootNode().host." + v);
								template = template.replaceAll(m[0], n);
							});


							//template = template.replace(m[2], "this.getRootNode().host.methods." + m[2]);
							//template = template.replace(new RegExp(escapeRegExp(m[2]), 'g'), "this.getRootNode().host.methods." + m[2]);
							//template = template.split(m[2]).join("this.getRootNode().host." + m[2])
						}
					}

					let parsingArgs = {
						template,
						data: this.data,
						style,
						state: this.state,
						parent: this.parent,
						methods: this.methods,
						props: this.props,
						component: this.component,
						dom: this.dom,
						methods: this.methods,
						lifecycle: this.lifecycle,
						watch: this.watch
					}

					// tam burası
					//
					// bu bölüm slot gibi girilen data ile improve edilecek
					//

					if (!this.rendered) {
						var self = this;
						var state = this.state;
						var props = this.props;
						var parent = this.parent;
						var component = this.component;
						var dom = this.dom;

						let parsedTemplate = simply.parseTemplate(parsingArgs);
						var parsedStyle = simply.parseStyle(parsingArgs);
						parsedTemplate = parsedTemplate + "<style tw></style>" + "<style simply>" + parsedStyle.style + "</style><style simply-vars></style>";

						if (typeof this.lifecycle !== "undefined") {
							if (typeof this.lifecycle.beforeFirstRender !== "undefined") {
								if (typeof this.lifecycle.beforeFirstRender(parsedTemplate) !== "undefined") {
									parsedTemplate = this.lifecycle.beforeFirstRender(parsedTemplate);
								}
							}
						}

						this.dom.innerHTML = parsedTemplate;

						if (this.tw) {
							// https://gourav.io/blog/tailwind-in-shadow-dom
							window.observe(this.tw, this.dom);
							handleTwStyle(this.twindSheet, this.tw, this.dom);
							var classObserver;
							function handleTwStyle(twindSheet, tw, dom) {
								try {
									classObserver.disconnect();
								} catch (error) {

								}
								var cssRules = twindSheet.target.cssRules;
								var twRules = "";
								for (var i = 0; i < cssRules.length; i++) {
									twRules += cssRules[i].cssText;
								}
								dom.querySelector("style[tw]").innerHTML = twRules;

								classObserver = new MutationObserver(function (mutations) {
									// console.log("thank you", self);
									handleTwStyle(self.twindSheet, self.tw, self.dom);
								});

								classObserver.observe(dom, {
									attributes: true,
									attributeFilter: ['class'],
									childList: true,
									subtree: true,
									attributeOldValue: true
								});
							}
						}

						try {
							this.sheet = this.dom.getRootNode().querySelector("style[simply-vars]").sheet;
							//console.log(this.dom.getRootNode().styleSheets[1].cssRules[0].style.setProperty"--main-bg-color: yellow;";["--data-topAreaHeight"] = "3px");
							var vars = ":host {";
							for (var key in parsedStyle.vars) {
								if (!parsedStyle.vars.hasOwnProperty(key)) continue;
								vars += key + ":" + parsedStyle.vars[key] + ";";
							}
							this.sheet.insertRule(vars + "}", 0);
						} catch (error) { }

						setTimeout(() => {
							if (typeof this.lifecycle !== "undefined") {
								if (typeof this.lifecycle.afterFirstRender !== "undefined") {
									this.lifecycle.afterFirstRender();

									setTimeout(() => { }, 0);

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
						let parsedTemplate = simply.parseTemplate(parsingArgs);
						var parsedStyle = simply.parseStyle(parsingArgs);

						newDom.innerHTML = parsedTemplate + "<style tw></style>" + "<style simply></style><style simply-vars></style>";
						// console.log(this.dom, newDom);
						//childrenOnly: true,
						simply.morphdom(this.dom, newDom, {
							onBeforeElUpdated: function (fromEl, toEl) {
								// console.log("onBeforeMorphEl");
							},
							onBeforeElChildrenUpdated: function (fromEl, toEl) {
								if (fromEl.tagName == "CHILD-COMPONENT") {
									// console.log("dont again");
								}
								else if (fromEl.tagName == "STYLE") {
									return false;
								}
								else if (toEl.hasAttribute("passive") === true) {
									return false;
								}
								else if (toEl.tagName === 'INPUT') {
									if (toEl.type == 'radio' || toEl.type == 'CHECKBOX') {
										return false;
									}
									else {
										toEl.value = fromEl.value;
									}
								}

								else if (toEl.tagName === 'ROUTER') {
									// DINAMIK BAKMAK LAZIM EL ROUTER MI DIYE
									return false;
								}
								else if (toEl.tagName == 'LABEL') {
									return false;
								}
								else if (toEl.tagName === 'OPTION') {
									toEl.selected = fromEl.selected;
								}
								//console.log(toEl.tagName);
							}
						});

						// console.log("----name:", name, this.sheet);
						// console.log("inner:", this.dom.innerHTML);
						// console.log("parsed:", parsedStyle.vars);
						// console.log("sheet:", this.dom.getRootNode().querySelector("style[simply-vars]"));
						// console.log("root", this.dom.getRootNode());
						for (var key in parsedStyle.vars) {
							if (!parsedStyle.vars.hasOwnProperty(key)) continue;
							//this.dom.getRootNode().host.style.setProperty(key, parsedStyle.vars[key])
							this.sheet.cssRules[0].style.setProperty(key, parsedStyle.vars[key]);
							//console.log(this.dom.getRootNode().querySelector("style[simply-vars]").sheet.cssRules[0]);
							//this.dom.getRootNode().querySelector("style[simply-vars]").sheet.insertRule(":host {" + key + ":" + parsedStyle.vars[key] + ";}", 0);
						}

						if (typeof this.lifecycle !== "undefined") {
							if (typeof this.lifecycle.afterRerender !== "undefined") {
								this.lifecycle.afterRerender();
							}
						}
					}

					this.rendered = true;
				}
				// Invoked each time the custom element is disconnected from the document's DOM.
				disconnectedCallback() {
					if (typeof this.lifecycle !== "undefined") {
						if (typeof this.lifecycle.disconnected !== "undefined") {
							this.lifecycle.disconnected();
						}
					}
				}
				// invoked when one of the custom element's attributes is added, removed, or changed.
				attributeChangedCallback(name, oldValue, newValue) {
					// console.log("attr changed callback");
					// if data.
					// console.log(name, oldValue, newValue);
				}
				adoptedCallback() { }
				_attachListeners() { }
			}
			// return customElements.define(name, UnityComponent);
			// twind eki için return'ü sildim. inş bi yer patlamaz
			customElements.define(name, UnityComponent);
			// console.log(script);
		}
	},
	obaa: function () {
		/*
		 * obaa 2.1.1
		 * By dntzhang
		 * Github: https://github.com/Tencent/omi/tree/master/packages/obaa
		 * MIT Licensed.
		 */


		// __r_: root
		// __c_: prop change callback
		// __p_: path

		(function () {
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

			simply.obaa = obaa;
		})();
	},
	Router: function () {
		(function () {
			'use strict';

			function _typeof(obj) {
				if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
					_typeof = function (obj) {
						return typeof obj;
					};
				} else {
					_typeof = function (obj) {
						return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
					};
				}

				return _typeof(obj);
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			function _defineProperties(target, props) {
				for (var i = 0; i < props.length; i++) {
					var descriptor = props[i];
					descriptor.enumerable = descriptor.enumerable || false;
					descriptor.configurable = true;
					if ("value" in descriptor) descriptor.writable = true;
					Object.defineProperty(target, descriptor.key, descriptor);
				}
			}

			function _createClass(Constructor, protoProps, staticProps) {
				if (protoProps) _defineProperties(Constructor.prototype, protoProps);
				if (staticProps) _defineProperties(Constructor, staticProps);
				return Constructor;
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== "function" && superClass !== null) {
					throw new TypeError("Super expression must either be null or a function");
				}

				subClass.prototype = Object.create(superClass && superClass.prototype, {
					constructor: {
						value: subClass,
						writable: true,
						configurable: true
					}
				});
				if (superClass) _setPrototypeOf(subClass, superClass);
			}

			function _getPrototypeOf(o) {
				_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
					return o.__proto__ || Object.getPrototypeOf(o);
				};
				return _getPrototypeOf(o);
			}

			function _setPrototypeOf(o, p) {
				_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
					o.__proto__ = p;
					return o;
				};

				return _setPrototypeOf(o, p);
			}

			function _assertThisInitialized(self) {
				if (self === void 0) {
					throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				}

				return self;
			}

			function _possibleConstructorReturn(self, call) {
				if (call && (typeof call === "object" || typeof call === "function")) {
					return call;
				}

				return _assertThisInitialized(self);
			}

			function _superPropBase(object, property) {
				while (!Object.prototype.hasOwnProperty.call(object, property)) {
					object = _getPrototypeOf(object);
					if (object === null) break;
				}

				return object;
			}

			function _get(target, property, receiver) {
				if (typeof Reflect !== "undefined" && Reflect.get) {
					_get = Reflect.get;
				} else {
					_get = function _get(target, property, receiver) {
						var base = _superPropBase(target, property);

						if (!base) return;
						var desc = Object.getOwnPropertyDescriptor(base, property);

						if (desc.get) {
							return desc.get.call(receiver);
						}

						return desc.value;
					};
				}

				return _get(target, property, receiver || target);
			}

			function _toConsumableArray(arr) {
				return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
			}

			function _arrayWithoutHoles(arr) {
				if (Array.isArray(arr)) {
					for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

					return arr2;
				}
			}

			function _iterableToArray(iter) {
				if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
			}

			function _nonIterableSpread() {
				throw new TypeError("Invalid attempt to spread non-iterable instance");
			}

			function toArray(objectOrArray) {
				objectOrArray = objectOrArray || [];
				return Array.isArray(objectOrArray) ? objectOrArray : [objectOrArray];
			}
			function log(msg) {
				return "[Router] ".concat(msg);
			}
			function logValue(value) {
				if (_typeof(value) !== 'object') {
					return String(value);
				}

				var stringType = Object.prototype.toString.call(value).match(/ (.*)\]$/)[1];

				if (stringType === 'Object' || stringType === 'Array') {
					return "".concat(stringType, " ").concat(JSON.stringify(value));
				} else {
					return stringType;
				}
			}
			var MODULE = 'module';
			var NOMODULE = 'nomodule';
			var bundleKeys = [MODULE, NOMODULE];

			function ensureBundle(src) {
				if (!src.match(/.+\.[m]?js$/)) {
					throw new Error(log("Unsupported type for bundle \"".concat(src, "\": .js or .mjs expected.")));
				}
			}

			function ensureRoute(route) {
				if (!route || !isString(route.path)) {
					throw new Error(log("Expected route config to be an object with a \"path\" string property, or an array of such objects"));
				}

				var bundle = route.bundle;
				var stringKeys = ['component', 'redirect', 'bundle'];

				if (!isFunction(route.action) && !Array.isArray(route.children) && !isFunction(route.children) && !isObject(bundle) && !stringKeys.some(function (key) {
					return isString(route[key]);
				})) {
					throw new Error(log("Expected route config \"".concat(route.path, "\" to include either \"").concat(stringKeys.join('", "'), "\" ") + "or \"action\" function but none found."));
				}

				if (bundle) {
					if (isString(bundle)) {
						ensureBundle(bundle);
					} else if (!bundleKeys.some(function (key) {
						return key in bundle;
					})) {
						throw new Error(log('Expected route bundle to include either "' + NOMODULE + '" or "' + MODULE + '" keys, or both'));
					} else {
						bundleKeys.forEach(function (key) {
							return key in bundle && ensureBundle(bundle[key]);
						});
					}
				}

				if (route.redirect) {
					['bundle', 'component'].forEach(function (overriddenProp) {
						if (overriddenProp in route) {
							console.warn(log("Route config \"".concat(route.path, "\" has both \"redirect\" and \"").concat(overriddenProp, "\" properties, ") + "and \"redirect\" will always override the latter. Did you mean to only use \"".concat(overriddenProp, "\"?")));
						}
					});
				}
			}
			function ensureRoutes(routes) {
				toArray(routes).forEach(function (route) {
					return ensureRoute(route);
				});
			}

			function loadScript(src, key) {
				var script = document.head.querySelector('script[src="' + src + '"][async]');

				if (!script) {
					script = document.createElement('script');
					script.setAttribute('src', src);

					if (key === MODULE) {
						script.setAttribute('type', MODULE);
					} else if (key === NOMODULE) {
						script.setAttribute(NOMODULE, '');
					}

					script.async = true;
				}

				return new Promise(function (resolve, reject) {
					script.onreadystatechange = script.onload = function (e) {
						script.__dynamicImportLoaded = true;
						resolve(e);
					};

					script.onerror = function (e) {
						if (script.parentNode) {
							script.parentNode.removeChild(script);
						}

						reject(e);
					};

					if (script.parentNode === null) {
						document.head.appendChild(script);
					} else if (script.__dynamicImportLoaded) {
						resolve();
					}
				});
			}

			function loadBundle(bundle) {
				if (isString(bundle)) {
					return loadScript(bundle);
				} else {
					return Promise.race(bundleKeys.filter(function (key) {
						return key in bundle;
					}).map(function (key) {
						return loadScript(bundle[key], key);
					}));
				}
			}
			function fireRouterEvent(type, detail) {
				return !window.dispatchEvent(new CustomEvent("router-".concat(type), {
					cancelable: type === 'go',
					detail: detail
				}));
			}
			function isObject(o) {
				// guard against null passing the typeof check
				return _typeof(o) === 'object' && !!o;
			}
			function isFunction(f) {
				return typeof f === 'function';
			}
			function isString(s) {
				return typeof s === 'string';
			}
			function getNotFoundError(context) {
				var error = new Error(log("Page not found (".concat(context.pathname, ")")));
				error.context = context;
				error.code = 404;
				return error;
			}
			var notFoundResult = new function NotFoundResult() {
				_classCallCheck(this, NotFoundResult);
			}();

			/* istanbul ignore next: coverage is calculated in Chrome, this code is for IE */

			function getAnchorOrigin(anchor) {
				// IE11: on HTTP and HTTPS the default port is not included into
				// window.location.origin, so won't include it here either.
				var port = anchor.port;
				var protocol = anchor.protocol;
				var defaultHttp = protocol === 'http:' && port === '80';
				var defaultHttps = protocol === 'https:' && port === '443';
				var host = defaultHttp || defaultHttps ? anchor.hostname // does not include the port number (e.g. www.example.org)
					: anchor.host; // does include the port number (e.g. www.example.org:80)

				return "".concat(protocol, "//").concat(host);
			} // The list of checks is not complete:
			//  - SVG support is missing
			//  - the 'rel' attribute is not considered


			function routerGlobalClickHandler(event) {
				// ignore the click if the default action is prevented
				if (event.defaultPrevented) {
					return;
				} // ignore the click if not with the primary mouse button


				if (event.button !== 0) {
					return;
				} // ignore the click if a modifier key is pressed


				if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
					return;
				} // find the <a> element that the click is at (or within)


				var anchor = event.target;
				var path = event.composedPath ? event.composedPath() : event.path || []; // FIXME(web-padawan): `Symbol.iterator` used by webcomponentsjs is broken for arrays
				// example to check: `for...of` loop here throws the "Not yet implemented" error

				for (var i = 0; i < path.length; i++) {
					var target = path[i];

					if (target.nodeName && target.nodeName.toLowerCase() === 'a') {
						anchor = target;
						break;
					}
				}

				while (anchor && anchor.nodeName.toLowerCase() !== 'a') {
					anchor = anchor.parentNode;
				} // ignore the click if not at an <a> element


				if (!anchor || anchor.nodeName.toLowerCase() !== 'a') {
					return;
				} // ignore the click if the <a> element has a non-default target


				if (anchor.target && anchor.target.toLowerCase() !== '_self') {
					return;
				} // ignore the click if the <a> element has the 'download' attribute


				if (anchor.hasAttribute('download')) {
					return;
				} // ignore the click if the target URL is a fragment on the current page


				if (anchor.pathname === window.location.pathname && anchor.hash !== '') {
					return;
				} // ignore the click if the target is external to the app
				// In IE11 HTMLAnchorElement does not have the `origin` property


				var origin = anchor.origin || getAnchorOrigin(anchor);

				if (origin !== window.location.origin) {
					return;
				} // if none of the above, convert the click into a navigation event


				var _anchor = anchor,
					pathname = _anchor.pathname,
					search = _anchor.search,
					hash = _anchor.hash;

				if (fireRouterEvent('go', {
					pathname: pathname,
					search: search,
					hash: hash
				})) {
					event.preventDefault();
				}
			}
			/**
			 * A navigation trigger for Router that translated clicks on `<a>` links
			 * into Router navigation events.
			 *
			 * Only regular clicks on in-app links are translated (primary mouse button, no
			 * modifier keys, the target href is within the app's URL space).
			 *
			 * @memberOf Router.Triggers
			 * @type {NavigationTrigger}
			 */


			var CLICK = {
				activate: function activate() {
					window.document.addEventListener('click', routerGlobalClickHandler);
				},
				inactivate: function inactivate() {
					window.document.removeEventListener('click', routerGlobalClickHandler);
				}
			};

			var isIE = /Trident/.test(navigator.userAgent);
			/* istanbul ignore next: coverage is calculated in Chrome, this code is for IE */

			if (isIE && !isFunction(window.PopStateEvent)) {
				window.PopStateEvent = function (inType, params) {
					params = params || {};
					var e = document.createEvent('Event');
					e.initEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable));
					e.state = params.state || null;
					return e;
				};

				window.PopStateEvent.prototype = window.Event.prototype;
			}

			function routerGlobalPopstateHandler(event) {
				if (event.state === 'router-ignore') {
					return;
				}

				var _window$location = window.location,
					pathname = _window$location.pathname,
					search = _window$location.search,
					hash = _window$location.hash;
				fireRouterEvent('go', {
					pathname: pathname,
					search: search,
					hash: hash
				});
			}
			/**
			 * A navigation trigger for Router that translates popstate events into
			 * Router navigation events.
			 *
			 * @memberOf Router.Triggers
			 * @type {NavigationTrigger}
			 */


			var POPSTATE = {
				activate: function activate() {
					window.addEventListener('popstate', routerGlobalPopstateHandler);
				},
				inactivate: function inactivate() {
					window.removeEventListener('popstate', routerGlobalPopstateHandler);
				}
			};

			/**
			 * Expose `pathToRegexp`.
			 */
			var pathToRegexp_1 = pathToRegexp;
			var parse_1 = parse;
			var compile_1 = compile;
			var tokensToFunction_1 = tokensToFunction;
			var tokensToRegExp_1 = tokensToRegExp;
			/**
			 * Default configs.
			 */

			var DEFAULT_DELIMITER = '/';
			var DEFAULT_DELIMITERS = './';
			/**
			 * The main path matching regexp utility.
			 *
			 * @type {RegExp}
			 */

			var PATH_REGEXP = new RegExp([// Match escaped characters that would otherwise appear in future matches.
				// This allows the user to escape special characters that won't transform.
				'(\\\\.)', // Match Express-style parameters and un-named parameters with a prefix
				// and optional suffixes. Matches appear as:
				//
				// ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
				// "(\\d+)"  => [undefined, undefined, "\d+", undefined]
				'(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'].join('|'), 'g');
			/**
			 * Parse a string for the raw tokens.
			 *
			 * @param  {string}  str
			 * @param  {Object=} options
			 * @return {!Array}
			 */

			function parse(str, options) {
				var tokens = [];
				var key = 0;
				var index = 0;
				var path = '';
				var defaultDelimiter = options && options.delimiter || DEFAULT_DELIMITER;
				var delimiters = options && options.delimiters || DEFAULT_DELIMITERS;
				var pathEscaped = false;
				var res;

				while ((res = PATH_REGEXP.exec(str)) !== null) {
					var m = res[0];
					var escaped = res[1];
					var offset = res.index;
					path += str.slice(index, offset);
					index = offset + m.length; // Ignore already escaped sequences.

					if (escaped) {
						path += escaped[1];
						pathEscaped = true;
						continue;
					}

					var prev = '';
					var next = str[index];
					var name = res[2];
					var capture = res[3];
					var group = res[4];
					var modifier = res[5];

					if (!pathEscaped && path.length) {
						var k = path.length - 1;

						if (delimiters.indexOf(path[k]) > -1) {
							prev = path[k];
							path = path.slice(0, k);
						}
					} // Push the current path onto the tokens.


					if (path) {
						tokens.push(path);
						path = '';
						pathEscaped = false;
					}

					var partial = prev !== '' && next !== undefined && next !== prev;
					var repeat = modifier === '+' || modifier === '*';
					var optional = modifier === '?' || modifier === '*';
					var delimiter = prev || defaultDelimiter;
					var pattern = capture || group;
					tokens.push({
						name: name || key++,
						prefix: prev,
						delimiter: delimiter,
						optional: optional,
						repeat: repeat,
						partial: partial,
						pattern: pattern ? escapeGroup(pattern) : '[^' + escapeString(delimiter) + ']+?'
					});
				} // Push any remaining characters.


				if (path || index < str.length) {
					tokens.push(path + str.substr(index));
				}

				return tokens;
			}
			/**
			 * Compile a string to a template function for the path.
			 *
			 * @param  {string}             str
			 * @param  {Object=}            options
			 * @return {!function(Object=, Object=)}
			 */


			function compile(str, options) {
				return tokensToFunction(parse(str, options));
			}
			/**
			 * Expose a method for transforming tokens into the path function.
			 */


			function tokensToFunction(tokens) {
				// Compile all the tokens into regexps.
				var matches = new Array(tokens.length); // Compile all the patterns before compilation.

				for (var i = 0; i < tokens.length; i++) {
					if (_typeof(tokens[i]) === 'object') {
						matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
					}
				}

				return function (data, options) {
					var path = '';
					var encode = options && options.encode || encodeURIComponent;

					for (var i = 0; i < tokens.length; i++) {
						var token = tokens[i];

						if (typeof token === 'string') {
							path += token;
							continue;
						}

						var value = data ? data[token.name] : undefined;
						var segment;

						if (Array.isArray(value)) {
							if (!token.repeat) {
								throw new TypeError('Expected "' + token.name + '" to not repeat, but got array');
							}

							if (value.length === 0) {
								if (token.optional) continue;
								throw new TypeError('Expected "' + token.name + '" to not be empty');
							}

							for (var j = 0; j < value.length; j++) {
								segment = encode(value[j], token);

								if (!matches[i].test(segment)) {
									throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '"');
								}

								path += (j === 0 ? token.prefix : token.delimiter) + segment;
							}

							continue;
						}

						if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
							segment = encode(String(value), token);

							if (!matches[i].test(segment)) {
								throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"');
							}

							path += token.prefix + segment;
							continue;
						}

						if (token.optional) {
							// Prepend partial segment prefixes.
							if (token.partial) path += token.prefix;
							continue;
						}

						throw new TypeError('Expected "' + token.name + '" to be ' + (token.repeat ? 'an array' : 'a string'));
					}

					return path;
				};
			}
			/**
			 * Escape a regular expression string.
			 *
			 * @param  {string} str
			 * @return {string}
			 */


			function escapeString(str) {
				return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
			}
			/**
			 * Escape the capturing group by escaping special characters and meaning.
			 *
			 * @param  {string} group
			 * @return {string}
			 */


			function escapeGroup(group) {
				return group.replace(/([=!:$/()])/g, '\\$1');
			}
			/**
			 * Get the flags for a regexp from the options.
			 *
			 * @param  {Object} options
			 * @return {string}
			 */


			function flags(options) {
				return options && options.sensitive ? '' : 'i';
			}
			/**
			 * Pull out keys from a regexp.
			 *
			 * @param  {!RegExp} path
			 * @param  {Array=}  keys
			 * @return {!RegExp}
			 */


			function regexpToRegexp(path, keys) {
				if (!keys) return path; // Use a negative lookahead to match only capturing groups.

				var groups = path.source.match(/\((?!\?)/g);

				if (groups) {
					for (var i = 0; i < groups.length; i++) {
						keys.push({
							name: i,
							prefix: null,
							delimiter: null,
							optional: false,
							repeat: false,
							partial: false,
							pattern: null
						});
					}
				}

				return path;
			}
			/**
			 * Transform an array into a regexp.
			 *
			 * @param  {!Array}  path
			 * @param  {Array=}  keys
			 * @param  {Object=} options
			 * @return {!RegExp}
			 */


			function arrayToRegexp(path, keys, options) {
				var parts = [];

				for (var i = 0; i < path.length; i++) {
					parts.push(pathToRegexp(path[i], keys, options).source);
				}

				return new RegExp('(?:' + parts.join('|') + ')', flags(options));
			}
			/**
			 * Create a path regexp from string input.
			 *
			 * @param  {string}  path
			 * @param  {Array=}  keys
			 * @param  {Object=} options
			 * @return {!RegExp}
			 */


			function stringToRegexp(path, keys, options) {
				return tokensToRegExp(parse(path, options), keys, options);
			}
			/**
			 * Expose a function for taking tokens and returning a RegExp.
			 *
			 * @param  {!Array}  tokens
			 * @param  {Array=}  keys
			 * @param  {Object=} options
			 * @return {!RegExp}
			 */


			function tokensToRegExp(tokens, keys, options) {
				options = options || {};
				var strict = options.strict;
				var start = options.start !== false;
				var end = options.end !== false;
				var delimiter = escapeString(options.delimiter || DEFAULT_DELIMITER);
				var delimiters = options.delimiters || DEFAULT_DELIMITERS;
				var endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|');
				var route = start ? '^' : '';
				var isEndDelimited = tokens.length === 0; // Iterate over the tokens and create our regexp string.

				for (var i = 0; i < tokens.length; i++) {
					var token = tokens[i];

					if (typeof token === 'string') {
						route += escapeString(token);
						isEndDelimited = i === tokens.length - 1 && delimiters.indexOf(token[token.length - 1]) > -1;
					} else {
						var capture = token.repeat ? '(?:' + token.pattern + ')(?:' + escapeString(token.delimiter) + '(?:' + token.pattern + '))*' : token.pattern;
						if (keys) keys.push(token);

						if (token.optional) {
							if (token.partial) {
								route += escapeString(token.prefix) + '(' + capture + ')?';
							} else {
								route += '(?:' + escapeString(token.prefix) + '(' + capture + '))?';
							}
						} else {
							route += escapeString(token.prefix) + '(' + capture + ')';
						}
					}
				}

				if (end) {
					if (!strict) route += '(?:' + delimiter + ')?';
					route += endsWith === '$' ? '$' : '(?=' + endsWith + ')';
				} else {
					if (!strict) route += '(?:' + delimiter + '(?=' + endsWith + '))?';
					if (!isEndDelimited) route += '(?=' + delimiter + '|' + endsWith + ')';
				}

				return new RegExp(route, flags(options));
			}
			/**
			 * Normalize the given path string, returning a regular expression.
			 *
			 * An empty array can be passed in for the keys, which will hold the
			 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
			 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
			 *
			 * @param  {(string|RegExp|Array)} path
			 * @param  {Array=}                keys
			 * @param  {Object=}               options
			 * @return {!RegExp}
			 */


			function pathToRegexp(path, keys, options) {
				if (path instanceof RegExp) {
					return regexpToRegexp(path, keys);
				}

				if (Array.isArray(path)) {
					return arrayToRegexp(
						/** @type {!Array} */
						path, keys, options);
				}

				return stringToRegexp(
					/** @type {string} */
					path, keys, options);
			}
			pathToRegexp_1.parse = parse_1;
			pathToRegexp_1.compile = compile_1;
			pathToRegexp_1.tokensToFunction = tokensToFunction_1;
			pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

			/**
			 * Universal Router (https://www.kriasoft.com/universal-router/)
			 *
			 * Copyright (c) 2015-present Kriasoft.
			 *
			 * This source code is licensed under the MIT license found in the
			 * LICENSE.txt file in the root directory of this source tree.
			 */
			var hasOwnProperty = Object.prototype.hasOwnProperty;
			var cache = new Map(); // see https://github.com/pillarjs/path-to-regexp/issues/148

			cache.set('|false', {
				keys: [],
				pattern: /(?:)/
			});

			function decodeParam(val) {
				try {
					return decodeURIComponent(val);
				} catch (err) {
					return val;
				}
			}

			function matchPath(routepath, path, exact, parentKeys, parentParams) {
				exact = !!exact;
				var cacheKey = "".concat(routepath, "|").concat(exact);
				var regexp = cache.get(cacheKey);

				if (!regexp) {
					var keys = [];
					regexp = {
						keys: keys,
						pattern: pathToRegexp_1(routepath, keys, {
							end: exact,
							strict: routepath === ''
						})
					};
					cache.set(cacheKey, regexp);
				}

				var m = regexp.pattern.exec(path);

				if (!m) {
					return null;
				}

				var params = Object.assign({}, parentParams);

				for (var i = 1; i < m.length; i++) {
					var key = regexp.keys[i - 1];
					var prop = key.name;
					var value = m[i];

					if (value !== undefined || !hasOwnProperty.call(params, prop)) {
						if (key.repeat) {
							params[prop] = value ? value.split(key.delimiter).map(decodeParam) : [];
						} else {
							params[prop] = value ? decodeParam(value) : value;
						}
					}
				}

				return {
					path: m[0],
					keys: (parentKeys || []).concat(regexp.keys),
					params: params
				};
			}

			/**
			 * Universal Router (https://www.kriasoft.com/universal-router/)
			 *
			 * Copyright (c) 2015-present Kriasoft.
			 *
			 * This source code is licensed under the MIT license found in the
			 * LICENSE.txt file in the root directory of this source tree.
			 */
			/**
			 * Traverses the routes tree and matches its nodes to the given pathname from
			 * the root down to the leaves. Each match consumes a part of the pathname and
			 * the matching process continues for as long as there is a matching child
			 * route for the remaining part of the pathname.
			 *
			 * The returned value is a lazily evaluated iterator.
			 *
			 * The leading "/" in a route path matters only for the root of the routes
			 * tree (or if all parent routes are ""). In all other cases a leading "/" in
			 * a child route path has no significance.
			 *
			 * The trailing "/" in a _route path_ matters only for the leaves of the
			 * routes tree. A leaf route with a trailing "/" matches only a pathname that
			 * also has a trailing "/".
			 *
			 * The trailing "/" in a route path does not affect matching of child routes
			 * in any way.
			 *
			 * The trailing "/" in a _pathname_ generally does not matter (except for
			 * the case of leaf nodes described above).
			 *
			 * The "" and "/" routes have special treatment:
			 *  1. as a single route
			 *     the "" and "/" routes match only the "" and "/" pathnames respectively
			 *  2. as a parent in the routes tree
			 *     the "" route matches any pathname without consuming any part of it
			 *     the "/" route matches any absolute pathname consuming its leading "/"
			 *  3. as a leaf in the routes tree
			 *     the "" and "/" routes match only if the entire pathname is consumed by
			 *         the parent routes chain. In this case "" and "/" are equivalent.
			 *  4. several directly nested "" or "/" routes
			 *     - directly nested "" or "/" routes are 'squashed' (i.e. nesting two
			 *       "/" routes does not require a double "/" in the pathname to match)
			 *     - if there are only "" in the parent routes chain, no part of the
			 *       pathname is consumed, and the leading "/" in the child routes' paths
			 *       remains significant
			 *
			 * Side effect:
			 *   - the routes tree { path: '' } matches only the '' pathname
			 *   - the routes tree { path: '', children: [ { path: '' } ] } matches any
			 *     pathname (for the tree root)
			 *
			 * Prefix matching can be enabled also by `children: true`.
			 */

			function matchRoute(route, pathname, ignoreLeadingSlash, parentKeys, parentParams) {
				var match;
				var childMatches;
				var childIndex = 0;
				var routepath = route.path || '';

				if (routepath.charAt(0) === '/') {
					if (ignoreLeadingSlash) {
						routepath = routepath.substr(1);
					}

					ignoreLeadingSlash = true;
				}

				return {
					next: function next(routeToSkip) {
						if (route === routeToSkip) {
							return {
								done: true
							};
						}

						var children = route.__children = route.__children || route.children;

						if (!match) {
							match = matchPath(routepath, pathname, !children, parentKeys, parentParams);

							if (match) {
								return {
									done: false,
									value: {
										route: route,
										keys: match.keys,
										params: match.params,
										path: match.path
									}
								};
							}
						}

						if (match && children) {
							while (childIndex < children.length) {
								if (!childMatches) {
									var childRoute = children[childIndex];
									childRoute.parent = route;
									var matchedLength = match.path.length;

									if (matchedLength > 0 && pathname.charAt(matchedLength) === '/') {
										matchedLength += 1;
									}

									childMatches = matchRoute(childRoute, pathname.substr(matchedLength), ignoreLeadingSlash, match.keys, match.params);
								}

								var childMatch = childMatches.next(routeToSkip);

								if (!childMatch.done) {
									return {
										done: false,
										value: childMatch.value
									};
								}

								childMatches = null;
								childIndex++;
							}
						}

						return {
							done: true
						};
					}
				};
			}

			/**
			 * Universal Router (https://www.kriasoft.com/universal-router/)
			 *
			 * Copyright (c) 2015-present Kriasoft.
			 *
			 * This source code is licensed under the MIT license found in the
			 * LICENSE.txt file in the root directory of this source tree.
			 */

			function resolveRoute(context) {
				if (isFunction(context.route.action)) {
					return context.route.action(context);
				}

				return undefined;
			}

			function isChildRoute(parentRoute, childRoute) {
				var route = childRoute;

				while (route) {
					route = route.parent;

					if (route === parentRoute) {
						return true;
					}
				}

				return false;
			}

			function generateErrorMessage(currentContext) {
				var errorMessage = "Path '".concat(currentContext.pathname, "' is not properly resolved due to an error.");
				var routePath = (currentContext.route || {}).path;

				if (routePath) {
					errorMessage += " Resolution had failed on route: '".concat(routePath, "'");
				}

				return errorMessage;
			}

			function addRouteToChain(context, match) {
				var route = match.route,
					path = match.path;

				function shouldDiscardOldChain(oldChain, route) {
					return !route.parent || !oldChain || !oldChain.length || oldChain[oldChain.length - 1].route !== route.parent;
				}

				if (route && !route.__synthetic) {
					var item = {
						path: path,
						route: route
					};

					if (shouldDiscardOldChain(context.chain, route)) {
						context.chain = [item];
					} else {
						context.chain.push(item);
					}
				}
			}
			/**
			 * @memberof Router
			 */


			var Resolver =
				/*#__PURE__*/
				function () {
					function Resolver(routes) {
						var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

						_classCallCheck(this, Resolver);

						if (Object(routes) !== routes) {
							throw new TypeError('Invalid routes');
						}

						this.baseUrl = options.baseUrl || '';
						this.errorHandler = options.errorHandler;
						this.resolveRoute = options.resolveRoute || resolveRoute;
						this.context = Object.assign({
							resolver: this
						}, options.context);
						this.root = Array.isArray(routes) ? {
							path: '',
							__children: routes,
							parent: null,
							__synthetic: true
						} : routes;
						this.root.parent = null;
					}
					/**
					 * Returns the current list of routes (as a shallow copy). Adding / removing
					 * routes to / from the returned array does not affect the routing config,
					 * but modifying the route objects does.
					 *
					 * @return {!Array<!Route>}
					 */


					_createClass(Resolver, [{
						key: "getRoutes",
						value: function getRoutes() {
							return _toConsumableArray(this.root.__children);
						}
						/**
						 * Sets the routing config (replacing the existing one).
						 *
						 * @param {!Array<!Route>|!Route} routes a single route or an array of those
						 *    (the array is shallow copied)
						 */

					}, {
						key: "setRoutes",
						value: function setRoutes(routes) {
							ensureRoutes(routes);

							var newRoutes = _toConsumableArray(toArray(routes));

							this.root.__children = newRoutes;
						}
						/**
						 * Appends one or several routes to the routing config and returns the
						 * effective routing config after the operation.
						 *
						 * @param {!Array<!Route>|!Route} routes a single route or an array of those
						 *    (the array is shallow copied)
						 * @return {!Array<!Route>}
						 * @protected
						 */

					}, {
						key: "addRoutes",
						value: function addRoutes(routes) {
							var _this$root$__children;

							ensureRoutes(routes);

							(_this$root$__children = this.root.__children).push.apply(_this$root$__children, _toConsumableArray(toArray(routes)));

							return this.getRoutes();
						}
						/**
						 * Removes all existing routes from the routing config.
						 */

					}, {
						key: "removeRoutes",
						value: function removeRoutes() {
							this.setRoutes([]);
						}
						/**
						 * Asynchronously resolves the given pathname, i.e. finds all routes matching
						 * the pathname and tries resolving them one after another in the order they
						 * are listed in the routes config until the first non-null result.
						 *
						 * Returns a promise that is fulfilled with the return value of an object that consists of the first
						 * route handler result that returns something other than `null` or `undefined` and context used to get this result.
						 *
						 * If no route handlers return a non-null result, or if no route matches the
						 * given pathname the returned promise is rejected with a 'page not found'
						 * `Error`.
						 *
						 * @param {!string|!{pathname: !string}} pathnameOrContext the pathname to
						 *    resolve or a context object with a `pathname` property and other
						 *    properties to pass to the route resolver functions.
						 * @return {!Promise<any>}
						 */

					}, {
						key: "resolve",
						value: function resolve(pathnameOrContext) {
							var _this = this;

							var context = Object.assign({}, this.context, isString(pathnameOrContext) ? {
								pathname: pathnameOrContext
							} : pathnameOrContext);
							var match = matchRoute(this.root, this.__normalizePathname(context.pathname), this.baseUrl);
							var resolve = this.resolveRoute;
							var matches = null;
							var nextMatches = null;
							var currentContext = context;

							function next(resume) {
								var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : matches.value.route;
								var prevResult = arguments.length > 2 ? arguments[2] : undefined;
								var routeToSkip = prevResult === null && matches.value.route;
								matches = nextMatches || match.next(routeToSkip);
								nextMatches = null;

								if (!resume) {
									if (matches.done || !isChildRoute(parent, matches.value.route)) {
										nextMatches = matches;
										return Promise.resolve(notFoundResult);
									}
								}

								if (matches.done) {
									return Promise.reject(getNotFoundError(context));
								}

								addRouteToChain(context, matches.value);
								currentContext = Object.assign({}, context, matches.value);
								return Promise.resolve(resolve(currentContext)).then(function (resolution) {
									if (resolution !== null && resolution !== undefined && resolution !== notFoundResult) {
										currentContext.result = resolution.result || resolution;
										return currentContext;
									}

									return next(resume, parent, resolution);
								});
							}

							context.next = next;
							return Promise.resolve().then(function () {
								return next(true, _this.root);
							}).catch(function (error) {
								var errorMessage = generateErrorMessage(currentContext);

								if (!error) {
									error = new Error(errorMessage);
								} else {
									console.warn(errorMessage);
								}

								error.context = error.context || currentContext; // DOMException has its own code which is read-only

								if (!(error instanceof DOMException)) {
									error.code = error.code || 500;
								}

								if (_this.errorHandler) {
									currentContext.result = _this.errorHandler(error);
									return currentContext;
								}

								throw error;
							});
						}
						/**
						 * URL constructor polyfill hook. Creates and returns an URL instance.
						 */

					}, {
						key: "__normalizePathname",

						/**
						 * If the baseUrl is set, matches the pathname with the router’s baseUrl,
						 * and returns the local pathname with the baseUrl stripped out.
						 *
						 * If the pathname does not match the baseUrl, returns undefined.
						 *
						 * If the `baseUrl` is not set, returns the unmodified pathname argument.
						 */
						value: function __normalizePathname(pathname) {
							if (!this.baseUrl) {
								// No base URL, no need to transform the pathname.
								return pathname;
							}

							var base = this.__effectiveBaseUrl;

							var normalizedUrl = this.constructor.__createUrl(pathname, base).href;

							if (normalizedUrl.slice(0, base.length) === base) {
								return normalizedUrl.slice(base.length);
							}
						}
					}, {
						key: "__effectiveBaseUrl",

						/**
						 * If the baseUrl property is set, transforms the baseUrl and returns the full
						 * actual `base` string for using in the `new URL(path, base);` and for
						 * prepernding the paths with. The returned base ends with a trailing slash.
						 *
						 * Otherwise, returns empty string.
						 */
						get: function get() {
							return this.baseUrl ? this.constructor.__createUrl(this.baseUrl, document.baseURI || document.URL).href.replace(/[^\/]*$/, '') : '';
						}
					}], [{
						key: "__createUrl",
						value: function __createUrl(url, base) {
							return new URL(url, base);
						}
					}]);

					return Resolver;
				}();

			Resolver.pathToRegexp = pathToRegexp_1;

			/**
			 * Universal Router (https://www.kriasoft.com/universal-router/)
			 *
			 * Copyright (c) 2015-present Kriasoft.
			 *
			 * This source code is licensed under the MIT license found in the
			 * LICENSE.txt file in the root directory of this source tree.
			 */
			var pathToRegexp$1 = Resolver.pathToRegexp;
			var cache$1 = new Map();

			function cacheRoutes(routesByName, route, routes) {
				var name = route.name || route.component;

				if (name) {
					if (routesByName.has(name)) {
						routesByName.get(name).push(route);
					} else {
						routesByName.set(name, [route]);
					}
				}

				if (Array.isArray(routes)) {
					for (var i = 0; i < routes.length; i++) {
						var childRoute = routes[i];
						childRoute.parent = route;
						cacheRoutes(routesByName, childRoute, childRoute.__children || childRoute.children);
					}
				}
			}

			function getRouteByName(routesByName, routeName) {
				var routes = routesByName.get(routeName);

				if (routes && routes.length > 1) {
					throw new Error("Duplicate route with name \"".concat(routeName, "\".") + " Try seting unique 'name' route properties.");
				}

				return routes && routes[0];
			}

			function getRoutePath(route) {
				var path = route.path;
				path = Array.isArray(path) ? path[0] : path;
				return path !== undefined ? path : '';
			}

			function generateUrls(router) {
				var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

				if (!(router instanceof Resolver)) {
					throw new TypeError('An instance of Resolver is expected');
				}

				var routesByName = new Map();
				return function (routeName, params) {
					var route = getRouteByName(routesByName, routeName);

					if (!route) {
						routesByName.clear(); // clear cache

						cacheRoutes(routesByName, router.root, router.root.__children);
						route = getRouteByName(routesByName, routeName);

						if (!route) {
							throw new Error("Route \"".concat(routeName, "\" not found"));
						}
					}

					var regexp = cache$1.get(route.fullPath);

					if (!regexp) {
						var fullPath = getRoutePath(route);
						var rt = route.parent;

						while (rt) {
							var path = getRoutePath(rt);

							if (path) {
								fullPath = path.replace(/\/$/, '') + '/' + fullPath.replace(/^\//, '');
							}

							rt = rt.parent;
						}

						var tokens = pathToRegexp$1.parse(fullPath);
						var toPath = pathToRegexp$1.tokensToFunction(tokens);
						var keys = Object.create(null);

						for (var i = 0; i < tokens.length; i++) {
							if (!isString(tokens[i])) {
								keys[tokens[i].name] = true;
							}
						}

						regexp = {
							toPath: toPath,
							keys: keys
						};
						cache$1.set(fullPath, regexp);
						route.fullPath = fullPath;
					}

					var url = regexp.toPath(params, options) || '/';

					if (options.stringifyQueryParams && params) {
						var queryParams = {};

						var _keys = Object.keys(params);

						for (var _i = 0; _i < _keys.length; _i++) {
							var key = _keys[_i];

							if (!regexp.keys[key]) {
								queryParams[key] = params[key];
							}
						}

						var query = options.stringifyQueryParams(queryParams);

						if (query) {
							url += query.charAt(0) === '?' ? query : "?".concat(query);
						}
					}

					return url;
				};
			}

			/**
			 * @typedef NavigationTrigger
			 * @type {object}
			 * @property {function()} activate
			 * @property {function()} inactivate
			 */

			/** @type {Array<NavigationTrigger>} */
			var triggers = [];
			function setNavigationTriggers(newTriggers) {
				triggers.forEach(function (trigger) {
					return trigger.inactivate();
				});
				newTriggers.forEach(function (trigger) {
					return trigger.activate();
				});
				triggers = newTriggers;
			}

			var willAnimate = function willAnimate(elem) {
				var name = getComputedStyle(elem).getPropertyValue('animation-name');
				return name && name !== 'none';
			};

			var waitForAnimation = function waitForAnimation(elem, cb) {
				var listener = function listener() {
					elem.removeEventListener('animationend', listener);
					cb();
				};

				elem.addEventListener('animationend', listener);
			};

			function animate(elem, className) {
				elem.classList.add(className);
				return new Promise(function (resolve) {
					if (willAnimate(elem)) {
						var rect = elem.getBoundingClientRect();
						var size = "height: ".concat(rect.bottom - rect.top, "px; width: ").concat(rect.right - rect.left, "px");
						elem.setAttribute('style', "position: absolute; ".concat(size));
						waitForAnimation(elem, function () {
							elem.classList.remove(className);
							elem.removeAttribute('style');
							resolve();
						});
					} else {
						elem.classList.remove(className);
						resolve();
					}
				});
			}

			var MAX_REDIRECT_COUNT = 256;

			function isResultNotEmpty(result) {
				return result !== null && result !== undefined;
			}

			function copyContextWithoutNext(context) {
				var copy = Object.assign({}, context);
				delete copy.next;
				return copy;
			}

			function createLocation(_ref, route) {
				var _ref$pathname = _ref.pathname,
					pathname = _ref$pathname === void 0 ? '' : _ref$pathname,
					_ref$chain = _ref.chain,
					chain = _ref$chain === void 0 ? [] : _ref$chain,
					_ref$params = _ref.params,
					params = _ref$params === void 0 ? {} : _ref$params,
					redirectFrom = _ref.redirectFrom,
					resolver = _ref.resolver;
				var routes = chain.map(function (item) {
					return item.route;
				});
				return {
					baseUrl: resolver && resolver.baseUrl || '',
					pathname: pathname,
					routes: routes,
					route: route || routes.length && routes[routes.length - 1] || null,
					params: params,
					redirectFrom: redirectFrom,
					getUrl: function getUrl() {
						var userParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
						return getPathnameForRouter(Router.pathToRegexp.compile(getMatchedPath(routes))(Object.assign({}, params, userParams)), resolver);
					}
				};
			}

			function createRedirect(context, pathname) {
				var params = Object.assign({}, context.params);
				return {
					redirect: {
						pathname: pathname,
						from: context.pathname,
						params: params
					}
				};
			}

			function renderElement(context, element) {
				element.location = createLocation(context);
				var index = context.chain.map(function (item) {
					return item.route;
				}).indexOf(context.route);
				context.chain[index].element = element;

				// simply.js state & parent fix
				let outlet = context.resolver.__outlet;
				if (outlet.getRootNode().host) {
					let parent = outlet.getRootNode().host;
					element.parent = parent;
					let state = parent.state;
					element.state = state;
				}
				return element;
			}

			function runCallbackIfPossible(callback, args, thisArg) {
				if (isFunction(callback)) {
					return callback.apply(thisArg, args);
				}
			}

			function amend(amendmentFunction, args, element) {
				return function (amendmentResult) {
					if (amendmentResult && (amendmentResult.cancel || amendmentResult.redirect)) {
						return amendmentResult;
					}

					if (element) {
						return runCallbackIfPossible(element[amendmentFunction], args, element);
					}
				};
			}

			function processNewChildren(newChildren, route) {
				if (!Array.isArray(newChildren) && !isObject(newChildren)) {
					throw new Error(log("Incorrect \"children\" value for the route ".concat(route.path, ": expected array or object, but got ").concat(newChildren)));
				}

				route.__children = [];
				var childRoutes = toArray(newChildren);

				for (var i = 0; i < childRoutes.length; i++) {
					ensureRoute(childRoutes[i]);

					route.__children.push(childRoutes[i]);
				}
			}

			function removeDomNodes(nodes) {
				if (nodes && nodes.length) {
					var parent = nodes[0].parentNode;

					for (var i = 0; i < nodes.length; i++) {
						parent.removeChild(nodes[i]);
					}
				}
			}

			function getPathnameForRouter(pathname, router) {
				var base = router.__effectiveBaseUrl;
				return base ? router.constructor.__createUrl(pathname.replace(/^\//, ''), base).pathname : pathname;
			}

			function getMatchedPath(chain) {
				return chain.map(function (item) {
					return item.path;
				}).reduce(function (a, b) {
					if (b.length) {
						return a.replace(/\/$/, '') + '/' + b.replace(/^\//, '');
					}

					return a;
				}, '');
			}
			/**
			 * A simple client-side router for single-page applications. It uses
			 * express-style middleware and has a first-class support for Web Components and
			 * lazy-loading. Works great in Polymer and non-Polymer apps.
			 *
			 * Use `new Router(outlet, options)` to create a new Router instance.
			 *
			 * * The `outlet` parameter is a reference to the DOM node to render
			 *   the content into.
			 *
			 * * The `options` parameter is an optional object with options. The following
			 *   keys are supported:
			 *   * `baseUrl` — the initial value for [
			 *     the `baseUrl` property
			 *   ](#/classes/Router#property-baseUrl)
			 *
			 * The Router instance is automatically subscribed to navigation events
			 * on `window`.
			 *
			 * See [Live Examples](#/classes/Router/demos/demo/index.html) for the detailed usage demo and code snippets.
			 *
			 * See also detailed API docs for the following methods, for the advanced usage:
			 *
			 * * [setOutlet](#/classes/Router#method-setOutlet) – should be used to configure the outlet.
			 * * [setTriggers](#/classes/Router#method-setTriggers) – should be used to configure the navigation events.
			 * * [setRoutes](#/classes/Router#method-setRoutes) – should be used to configure the routes.
			 *
			 * Only `setRoutes` has to be called manually, others are automatically invoked when creating a new instance.
			 *
			 * @extends Resolver
			 * @demo demo/index.html
			 * @summary JavaScript class that renders different DOM content depending on
			 *    a given path. It can re-render when triggered or automatically on
			 *    'popstate' and / or 'click' events.
			 */

			var routerGlobalOptionsVar;
			function globalHashChangeHandler(event) {
				let pathname;
				pathname = window.location.hash.replace("#", "");
				// console.log("HASHCHANGEEVENT: ");
				// console.log(event);
				// console.log("hay hash: " + pathname);
				// console.log("base: " + router.baseUrl.replace(document.location.origin, ""));
				// console.log("pathname: " + pathname);
				Router.go(router.baseUrl.replace(document.location.origin, "") + pathname);
			}
			const HASHCHANGE = {
				activate() {
					window.addEventListener('hashchange', globalHashChangeHandler, false);
				},

				inactivate() {
					window.removeEventListener('hashchange', globalHashChangeHandler, false);
				}
			};
			var Router =
				/*#__PURE__*/
				function (_Resolver) {
					_inherits(Router, _Resolver);

					/**
					 * Creates a new Router instance with a given outlet, and
					 * automatically subscribes it to navigation events on the `window`.
					 * Using a constructor argument or a setter for outlet is equivalent:
					 *
					 * ```
					 * const router = new Router();
					 * router.setOutlet(outlet);
					 * ```
					 * @param {?Node} outlet
					 * @param {?RouterOptions} options
					 */
					function Router(outlet, options) {
						routerGlobalOptionsVar = options;
						var _this;

						_classCallCheck(this, Router);

						var baseElement = document.head.querySelector('base');
						_this = _possibleConstructorReturn(this, _getPrototypeOf(Router).call(this, [], Object.assign({
							// Default options
							baseUrl: baseElement && baseElement.getAttribute('href')
						}, options)));

						_this.resolveRoute = function (context) {
							return _this.__resolveRoute(context);
						};

						// simply.js hash support for router
						if (routerGlobalOptionsVar.enableHash) {
							Router.NavigationTrigger = [HASHCHANGE];
						}

						var triggers = Router.NavigationTrigger;
						Router.setTriggers.apply(Router, Object.keys(triggers).map(function (key) {
							return triggers[key];
						}));
						/**
						 * The base URL for all routes in the router instance. By default,
						 * takes the `<base href>` attribute value if the base element exists
						 * in the `<head>`.
						 *
						 * @public
						 * @type {string}
						 */

						_this.baseUrl;
						/**
						 * A promise that is settled after the current render cycle completes. If
						 * there is no render cycle in progress the promise is immediately settled
						 * with the last render cycle result.
						 *
						 * @public
						 * @type {!Promise<!Router.Location>}
						 */

						_this.ready;
						_this.ready = Promise.resolve(outlet);
						/**
						 * Contains read-only information about the current router location:
						 * pathname, active routes, parameters. See the
						 * [Location type declaration](#/classes/Router.Location)
						 * for more details.
						 *
						 * @public
						 * @type {!Router.Location}
						 */

						_this.location;
						_this.location = createLocation({
							resolver: _assertThisInitialized(_this)
						});
						_this.__lastStartedRenderId = 0;
						_this.__navigationEventHandler = _this.__onNavigationEvent.bind(_assertThisInitialized(_this));

						_this.setOutlet(outlet);

						_this.subscribe();

						return _this;
					}

					_createClass(Router, [{
						key: "__resolveRoute",
						value: function __resolveRoute(context) {
							var route = context.route;
							var callbacks = Promise.resolve();

							if (isFunction(route.children)) {
								callbacks = callbacks.then(function () {
									return route.children(copyContextWithoutNext(context));
								}).then(function (children) {
									// The route.children() callback might have re-written the
									// route.children property instead of returning a value
									if (!isResultNotEmpty(children) && !isFunction(route.children)) {
										children = route.children;
									}

									processNewChildren(children, route);
								});
							}

							var commands = {
								redirect: function redirect(path) {
									return createRedirect(context, path);
								},
								component: function component(_component) {
									return document.createElement(_component);
								}
							};
							return callbacks.then(function () {
								return runCallbackIfPossible(route.action, [context, commands], route);
							}).then(function (result) {
								if (isResultNotEmpty(result)) {
									// Actions like `() => import('my-view.js')` are not expected to
									// end the resolution, despite the result is not empty. Checking
									// the result with a whitelist of values that end the resulution.
									if (result instanceof HTMLElement || result.redirect || result === notFoundResult) {
										return result;
									}
								}

								if (isString(route.redirect)) {
									return commands.redirect(route.redirect);
								}

								if (route.bundle) {
									return loadBundle(route.bundle).then(function () { }, function () {
										throw new Error(log("Bundle not found: ".concat(route.bundle, ". Check if the file name is correct")));
									});
								}
							}).then(function (result) {
								if (isResultNotEmpty(result)) {
									return result;
								}

								if (isString(route.component)) {
									return commands.component(route.component);
								}
							});
						}
						/**
						 * Sets the router outlet (the DOM node where the content for the current
						 * route is inserted). Any content pre-existing in the router outlet is
						 * removed at the end of each render pass.
						 *
						 * NOTE: this method is automatically invoked first time when creating a new Router instance.
						 *
						 * @param {?Node} outlet the DOM node where the content for the current route
						 *     is inserted.
						 */

					}, {
						key: "setOutlet",
						value: function setOutlet(outlet) {
							if (outlet) {
								this.__ensureOutlet(outlet);
							}

							this.__outlet = outlet;
						}
						/**
						 * Returns the current router outlet. The initial value is `undefined`.
						 *
						 * @return {?Node} the current router outlet (or `undefined`)
						 */

					}, {
						key: "getOutlet",
						value: function getOutlet() {
							return this.__outlet;
						}
						/**
						 * Sets the routing config (replacing the existing one) and triggers a
						 * navigation event so that the router outlet is refreshed according to the
						 * current `window.location` and the new routing config.
						 *
						 * Each route object may have the following properties, listed here in the processing order:
						 * * `path` – the route path (relative to the parent route if any) in the
						 * [express.js syntax](https://expressjs.com/en/guide/routing.html#route-paths").
						 *
						 * * `children` – an array of nested routes or a function that provides this
						 * array at the render time. The function can be synchronous or asynchronous:
						 * in the latter case the render is delayed until the returned promise is
						 * resolved. The `children` function is executed every time when this route is
						 * being rendered. This allows for dynamic route structures (e.g. backend-defined),
						 * but it might have a performance impact as well. In order to avoid calling
						 * the function on subsequent renders, you can override the `children` property
						 * of the route object and save the calculated array there
						 * (via `context.route.children = [ route1, route2, ...];`).
						 * Parent routes are fully resolved before resolving the children. Children
						 * 'path' values are relative to the parent ones.
						 *
						 * * `action` – the action that is executed before the route is resolved.
						 * The value for this property should be a function, accepting `context`
						 * and `commands` parameters described below. If present, this function is
						 * always invoked first, disregarding of the other properties' presence.
						 * The action can return a result directly or within a `Promise`, which
						 * resolves to the result. If the action result is an `HTMLElement` instance,
						 * a `commands.component(name)` result, a `commands.redirect(path)` result,
						 * or a `context.next()` result, the current route resolution is finished,
						 * and other route config properties are ignored.
						 * See also **Route Actions** section in [Live Examples](#/classes/Router/demos/demo/index.html).
						 *
						 * * `redirect` – other route's path to redirect to. Passes all route parameters to the redirect target.
						 * The target route should also be defined.
						 * See also **Redirects** section in [Live Examples](#/classes/Router/demos/demo/index.html).
						 *
						 * * `bundle` – string containing the path to `.js` or `.mjs` bundle to load before resolving the route,
						 * or the object with "module" and "nomodule" keys referring to different bundles.
						 * Each bundle is only loaded once. If "module" and "nomodule" are set, only one bundle is loaded,
						 * depending on whether the browser supports ES modules or not.
						 * The property is ignored when either an `action` returns the result or `redirect` property is present.
						 * Any error, e.g. 404 while loading bundle will cause route resolution to throw.
						 * See also **Code Splitting** section in [Live Examples](#/classes/Router/demos/demo/index.html).
						 *
						 * * `component` – the tag name of the Web Component to resolve the route to.
						 * The property is ignored when either an `action` returns the result or `redirect` property is present.
						 * If route contains the `component` property (or an action that return a component)
						 * and its child route also contains the `component` property, child route's component
						 * will be rendered as a light dom child of a parent component.
						 *
						 * * `name` – the string name of the route to use in the
						 * [`router.urlForName(name, params)`](#/classes/Router#method-urlForName)
						 * navigation helper method.
						 *
						 * For any route function (`action`, `children`) defined, the corresponding `route` object is available inside the callback
						 * through the `this` reference. If you need to access it, make sure you define the callback as a non-arrow function
						 * because arrow functions do not have their own `this` reference.
						 *
						 * `context` object that is passed to `action` function holds the following properties:
						 * * `context.pathname` – string with the pathname being resolved
						 *
						 * * `context.search` – search query string
						 *
						 * * `context.hash` – hash string
						 *
						 * * `context.params` – object with route parameters
						 *
						 * * `context.route` – object that holds the route that is currently being rendered.
						 *
						 * * `context.next()` – function for asynchronously getting the next route
						 * contents from the resolution chain (if any)
						 *
						 * `commands` object that is passed to `action` function has
						 * the following methods:
						 *
						 * * `commands.redirect(path)` – function that creates a redirect data
						 * for the path specified.
						 *
						 * * `commands.component(component)` – function that creates a new HTMLElement
						 * with current context
						 *
						 * @param {!Array<!Object>|!Object} routes a single route or an array of those
						 */

					}, {
						key: "setRoutes",
						value: function setRoutes(routes) {
							this.__urlForName = undefined;

							_get(_getPrototypeOf(Router.prototype), "setRoutes", this).call(this, routes);

							this.__onNavigationEvent();
						}
						/**
						 * Asynchronously resolves the given pathname and renders the resolved route
						 * component into the router outlet. If no router outlet is set at the time of
						 * calling this method, or at the time when the route resolution is completed,
						 * a `TypeError` is thrown.
						 *
						 * Returns a promise that is fulfilled with the router outlet DOM Node after
						 * the route component is created and inserted into the router outlet, or
						 * rejected if no route matches the given path.
						 *
						 * If another render pass is started before the previous one is completed, the
						 * result of the previous render pass is ignored.
						 *
						 * @param {!string|!{pathname: !string, search: ?string, hash: ?string}} pathnameOrContext
						 *    the pathname to render or a context object with a `pathname` property,
						 *    optional `search` and `hash` properties, and other properties
						 *    to pass to the resolver.
						 * @return {!Promise<!Node>}
						 */

					}, {
						key: "render",
						value: function render(pathnameOrContext, shouldUpdateHistory) {
							var _this2 = this;

							var renderId = ++this.__lastStartedRenderId;
							var pathname = pathnameOrContext.pathname || pathnameOrContext;
							var search = pathnameOrContext.search || '';
							var hash = pathnameOrContext.hash || ''; // Find the first route that resolves to a non-empty result

							this.ready = this.resolve({
								pathname: pathname,
								search: search,
								hash: hash
							}) // Process the result of this.resolve() and handle all special commands:
								// (redirect / prevent / component). If the result is a 'component',
								// then go deeper and build the entire chain of nested components matching
								// the pathname. Also call all 'on before' callbacks along the way.
								.then(function (context) {
									return _this2.__fullyResolveChain(context);
								}).then(function (context) {
									if (renderId === _this2.__lastStartedRenderId) {
										var previousContext = _this2.__previousContext; // Check if the render was prevented and make an early return in that case

										if (context === previousContext) {
											return _this2.location;
										}

										_this2.location = createLocation(context);
										fireRouterEvent('location-changed', {
											router: _this2,
											location: _this2.location
										});

										if (shouldUpdateHistory) {
											_this2.__updateBrowserHistory(context, context.redirectFrom);
										}

										_this2.__addAppearingContent(context, previousContext);

										var animationDone = _this2.__animateIfNeeded(context);
										_this2.__runOnAfterEnterCallbacks(context);

										_this2.__runOnAfterLeaveCallbacks(context, previousContext);

										return animationDone.then(function () {
											if (renderId === _this2.__lastStartedRenderId) {
												// If there is another render pass started after this one,
												// the 'disappearing content' would be removed when the other
												// render pass calls `this.__addAppearingContent()`
												_this2.__removeDisappearingContent();

												_this2.__previousContext = context;
												return _this2.location;
											}
										});
									}
								}).catch(function (error) {
									if (renderId === _this2.__lastStartedRenderId) {
										if (shouldUpdateHistory) {
											_this2.__updateBrowserHistory({
												pathname: pathname,
												search: search,
												hash: hash
											});
										}

										removeDomNodes(_this2.__outlet && _this2.__outlet.children);
										_this2.location = createLocation({
											pathname: pathname,
											resolver: _this2
										});
										fireRouterEvent('error', {
											router: _this2,
											error: error,
											pathname: pathname
										});
										throw error;
									}
								});
							return this.ready;
						} // `topOfTheChainContextBeforeRedirects` is a context coming from Resolver.resolve().
						// It would contain a 'redirect' route or the first 'component' route that
						// matched the pathname. There might be more child 'component' routes to be
						// resolved and added into the chain. This method would find and add them.
						// `contextBeforeRedirects` is the context containing such a child component
						// route. It's only necessary when this method is called recursively (otherwise
						// it's the same as the 'top of the chain' context).
						//
						// Apart from building the chain of child components, this method would also
						// handle 'redirect' routes, call 'onBefore' callbacks and handle 'prevent'
						// and 'redirect' callback results.

					}, {
						key: "__fullyResolveChain",
						value: function __fullyResolveChain(topOfTheChainContextBeforeRedirects) {
							var _this3 = this;

							var contextBeforeRedirects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : topOfTheChainContextBeforeRedirects;
							return this.__findComponentContextAfterAllRedirects(contextBeforeRedirects) // `contextAfterRedirects` is always a context with an `HTMLElement` result
								// In other cases the promise gets rejected and .then() is not called
								.then(function (contextAfterRedirects) {


									var redirectsHappened = contextAfterRedirects !== contextBeforeRedirects;
									var topOfTheChainContextAfterRedirects = redirectsHappened ? contextAfterRedirects : topOfTheChainContextBeforeRedirects;
									return contextAfterRedirects.next().then(function (nextChildContext) {
										if (nextChildContext === null || nextChildContext === notFoundResult) {
											var matchedPath = getPathnameForRouter(getMatchedPath(contextAfterRedirects.chain), contextAfterRedirects.resolver);

											if (matchedPath !== contextAfterRedirects.pathname) {
												//console.log(contextAfterRedirects);
												throw getNotFoundError(topOfTheChainContextAfterRedirects);
											}
										}

										return nextChildContext && nextChildContext !== notFoundResult ? _this3.__fullyResolveChain(topOfTheChainContextAfterRedirects, nextChildContext) : _this3.__amendWithOnBeforeCallbacks(contextAfterRedirects);
									});
								});
						}
					}, {
						key: "__findComponentContextAfterAllRedirects",
						value: function __findComponentContextAfterAllRedirects(context) {
							var _this4 = this;

							var result = context.result;

							if (result instanceof HTMLElement) {
								renderElement(context, result);
								return Promise.resolve(context);
							} else if (result.redirect) {
								return this.__redirect(result.redirect, context.__redirectCount).then(function (context) {
									return _this4.__findComponentContextAfterAllRedirects(context);
								});
							} else if (result instanceof Error) {
								return Promise.reject(result);
							} else {
								return Promise.reject(new Error(log("Invalid route resolution result for path \"".concat(context.pathname, "\". ") + "Expected redirect object or HTML element, but got: \"".concat(logValue(result), "\". ") + "Double check the action return value for the route.")));
							}
						}
					}, {
						key: "__amendWithOnBeforeCallbacks",
						value: function __amendWithOnBeforeCallbacks(contextWithFullChain) {
							var _this5 = this;


							return this.__runOnBeforeCallbacks(contextWithFullChain).then(function (amendedContext) {
								if (amendedContext === _this5.__previousContext || amendedContext === contextWithFullChain) {
									return amendedContext;
								}

								return _this5.__fullyResolveChain(amendedContext);
							});
						}
					}, {
						key: "__runOnBeforeCallbacks",
						value: function __runOnBeforeCallbacks(newContext) {
							var _this6 = this;

							var previousContext = this.__previousContext || {};
							var previousChain = previousContext.chain || [];
							var newChain = newContext.chain;
							var callbacks = Promise.resolve();

							if (_this6.hooks.before) {
								var beforeRoute = _this6.hooks.before(_this6, newContext, previousContext);
								if (beforeRoute === false) {
									return callbacks.then(function (amendmentResult) {
										return _this6.__previousContext;
									});
								}
							}

							var prevent = function prevent() {
								return {
									cancel: true
								};
							};

							var redirect = function redirect(pathname) {
								return createRedirect(newContext, pathname);
							};

							newContext.__divergedChainIndex = 0;

							if (previousChain.length) {
								for (var i = 0; i < Math.min(previousChain.length, newChain.length); i = ++newContext.__divergedChainIndex) {
									if (previousChain[i].route !== newChain[i].route || previousChain[i].path !== newChain[i].path || (previousChain[i].element && previousChain[i].element.localName) !== (newChain[i].element && newChain[i].element.localName)) {
										break;
									}
								}

								for (var _i = previousChain.length - 1; _i >= newContext.__divergedChainIndex; _i--) {
									var location = createLocation(newContext);
									callbacks = callbacks.then(amend('onBeforeLeave', [location, {
										prevent: prevent
									}, this], previousChain[_i].element)).then(function (result) {
										if (!(result || {}).redirect) {
											return result;
										}
									});
								}
							}

							for (var _i2 = newContext.__divergedChainIndex; _i2 < newChain.length; _i2++) {
								var _location = createLocation(newContext, newChain[_i2].route);

								callbacks = callbacks.then(amend('onBeforeEnter', [_location, {
									prevent: prevent,
									redirect: redirect
								}, this], newChain[_i2].element));
							}

							return callbacks.then(function (amendmentResult) {
								if (amendmentResult) {
									if (amendmentResult.cancel) {
										return _this6.__previousContext;
									}

									if (amendmentResult.redirect) {
										return _this6.__redirect(amendmentResult.redirect, newContext.__redirectCount);
									}
								}

								return newContext;
							});
						}
					}, {
						key: "__redirect",
						value: function __redirect(redirectData, counter) {
							if (counter > MAX_REDIRECT_COUNT) {
								throw new Error(log("Too many redirects when rendering ".concat(redirectData.from)));
							}

							return this.resolve({
								pathname: this.urlForPath(redirectData.pathname, redirectData.params),
								redirectFrom: redirectData.from,
								__redirectCount: (counter || 0) + 1
							});
						}
					}, {
						key: "__ensureOutlet",
						value: function __ensureOutlet() {
							var outlet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.__outlet;

							if (!(outlet instanceof Node)) {
								throw new TypeError(log("Expected router outlet to be a valid DOM Node (but got ".concat(outlet, ")")));
							}
						}
					}, {
						key: "__updateBrowserHistory",
						value: function __updateBrowserHistory(_ref2, replace) {
							// simply.js hash support extension
							if (typeof routerGlobalOptionsVar.enableHash !== "undefined") {
								var path = _ref2.pathname;
								path = path.replace(router.baseUrl.replace(document.location.origin, ""), "");

								// home ise skip et
								if (path == "" && window.location.hash == "") {
									//console.log("home?");
								}
								// hash değişmişse trigger hashchange func manually
								else if ("#" + path !== window.location.hash) {
									if (window.location.hash.length > 1) {
										window.dispatchEvent(new HashChangeEvent("hashchange"));
									}
									else {
										// path ile gelmişse hash'e dönüştür
										window.history.replaceState({}, "", _ref2.pathname.replace(path, "") + "#" + path);
									}
								}
								// pathname ile hash aynı
								else if ("#" + path == window.location.hash) {
								}
								else {
								}
							}
							else {
								var pathname = _ref2.pathname,
									_ref2$search = _ref2.search,
									search = _ref2$search === void 0 ? '' : _ref2$search,
									_ref2$hash = _ref2.hash,
									hash = _ref2$hash === void 0 ? '' : _ref2$hash;

								if (window.location.pathname !== pathname || window.location.search !== search || window.location.hash !== hash) {
									var changeState = replace ? 'replaceState' : 'pushState';

									if (window.frameElement) {
										if (typeof window.frameElement.hasAttribute("name") !== "undefined") {
											if (window.frameElement.getAttribute("name") == "result") {
												changeState = "replaceState";
											}
										}
									}

									window.history[changeState](null, document.title, pathname + search + hash);
									window.dispatchEvent(new PopStateEvent('popstate', {
										state: 'router-ignore'
									}));
								}
							}

						}
					}, {
						key: "__addAppearingContent",
						value: function __addAppearingContent(context, previousContext) {
							this.__ensureOutlet(); // If the previous 'entering' animation has not completed yet,
							// stop it and remove that content from the DOM before adding new one.


							this.__removeAppearingContent(); // Find the deepest common parent between the last and the new component
							// chains. Update references for the unchanged elements in the new chain


							var deepestCommonParent = this.__outlet;

							for (var i = 0; i < context.__divergedChainIndex; i++) {
								var unchangedElement = previousContext && previousContext.chain[i].element;

								if (unchangedElement) {
									if (unchangedElement.parentNode === deepestCommonParent) {
										context.chain[i].element = unchangedElement;
										deepestCommonParent = unchangedElement;
									} else {
										break;
									}
								}
							} // Keep two lists of DOM elements:
							//  - those that should be removed once the transition animation is over
							//  - and those that should remain


							this.__disappearingContent = Array.from(deepestCommonParent.children);
							this.__appearingContent = []; // Add new elements (starting after the deepest common parent) to the DOM.
							// That way only the components that are actually different between the two
							// locations are added to the DOM (and those that are common remain in the
							// DOM without first removing and then adding them again).

							var parentElement = deepestCommonParent;

							for (var _i3 = context.__divergedChainIndex; _i3 < context.chain.length; _i3++) {
								var elementToAdd = context.chain[_i3].element;

								if (elementToAdd) {
									parentElement.appendChild(elementToAdd);

									if (parentElement === deepestCommonParent) {
										this.__appearingContent.push(elementToAdd);
									}

									parentElement = elementToAdd;
								}
							}
						}
					}, {
						key: "__removeDisappearingContent",
						value: function __removeDisappearingContent() {
							if (this.__disappearingContent) {
								removeDomNodes(this.__disappearingContent);
							}

							this.__disappearingContent = null;
							this.__appearingContent = null;
						}
					}, {
						key: "__removeAppearingContent",
						value: function __removeAppearingContent() {
							if (this.__disappearingContent && this.__appearingContent) {
								removeDomNodes(this.__appearingContent);
								this.__disappearingContent = null;
								this.__appearingContent = null;
							}
						}
					}, {
						key: "__runOnAfterLeaveCallbacks",
						value: function __runOnAfterLeaveCallbacks(currentContext, targetContext) {
							if (!targetContext) {
								return;
							} // REVERSE iteration: from Z to A

							for (var i = targetContext.chain.length - 1; i >= currentContext.__divergedChainIndex; i--) {
								var currentComponent = targetContext.chain[i].element;

								if (!currentComponent) {
									continue;
								}

								try {
									var location = createLocation(currentContext);
									runCallbackIfPossible(currentComponent.onAfterLeave, [location, {}, targetContext.resolver], currentComponent);
								} finally {
									removeDomNodes(currentComponent.children);
								}
							}
						}
					}, {
						key: "__runOnAfterEnterCallbacks",
						value: function __runOnAfterEnterCallbacks(currentContext) {

							if (this.hooks.after) {
								var afterRoute = this.hooks.after(this);
							}

							// forward iteration: from A to Z
							for (var i = currentContext.__divergedChainIndex; i < currentContext.chain.length; i++) {
								var currentComponent = currentContext.chain[i].element || {};
								var location = createLocation(currentContext, currentContext.chain[i].route);
								runCallbackIfPossible(currentComponent.onAfterEnter, [location, {}, currentContext.resolver], currentComponent);
							}
						}
					}, {
						key: "__animateIfNeeded",
						value: function __animateIfNeeded(context) {
							var from = (this.__disappearingContent || [])[0];
							var to = (this.__appearingContent || [])[0];
							var promises = [];
							var chain = context.chain;
							var config;

							for (var i = chain.length; i > 0; i--) {
								if (chain[i - 1].route.animate) {
									config = chain[i - 1].route.animate;
									break;
								}
							}

							if (from && to && config) {
								var leave = isObject(config) && config.leave || 'leaving';
								var enter = isObject(config) && config.enter || 'entering';
								promises.push(animate(from, leave));
								promises.push(animate(to, enter));
							}

							return Promise.all(promises).then(function () {
								return context;
							});
						}
						/**
						 * Subscribes this instance to navigation events on the `window`.
						 *
						 * NOTE: beware of resource leaks. For as long as a router instance is
						 * subscribed to navigation events, it won't be garbage collected.
						 */

					}, {
						key: "subscribe",
						value: function subscribe() {
							window.addEventListener('router-go', this.__navigationEventHandler);
						}
						/**
						 * Removes the subscription to navigation events created in the `subscribe()`
						 * method.
						 */

					}, {
						key: "unsubscribe",
						value: function unsubscribe() {
							window.removeEventListener('router-go', this.__navigationEventHandler);
						}
					}, {
						key: "__onNavigationEvent",
						value: function __onNavigationEvent(event) {
							var pathname = event ? event.detail.pathname : window.location.pathname;

							if (isString(this.__normalizePathname(pathname))) {
								if (event && event.preventDefault) {
									event.preventDefault();
								}

								this.render(event ? event.detail : {
									pathname: pathname
								}, true);
							}
						}
						/**
						 * Configures what triggers Router navigation events:
						 *  - `POPSTATE`: popstate events on the current `window`
						 *  - `CLICK`: click events on `<a>` links leading to the current page
						 *
						 * This method is invoked with the pre-configured values when creating a new Router instance.
						 * By default, both `POPSTATE` and `CLICK` are enabled. This setup is expected to cover most of the use cases.
						 *
						 * See the `router-config.js` for the default navigation triggers config. Based on it, you can
						 * create the own one and only import the triggers you need, instead of pulling in all the code,
						 * e.g. if you want to handle `click` differently.
						 *
						 * See also **Navigation Triggers** section in [Live Examples](#/classes/Router/demos/demo/index.html).
						 *
						 * @param {...NavigationTrigger} triggers
						 */

					}, {
						key: "urlForName",

						/**
						 * Generates a URL for the route with the given name, optionally performing
						 * substitution of parameters.
						 *
						 * The route is searched in all the Router instances subscribed to
						 * navigation events.
						 *
						 * **Note:** For child route names, only array children are considered.
						 * It is not possible to generate URLs using a name for routes set with
						 * a children function.
						 *
						 * @function urlForName
						 * @param {!string} name the route name or the route’s `component` name.
						 * @param {?Object} params Optional object with route path parameters.
						 * Named parameters are passed by name (`params[name] = value`), unnamed
						 * parameters are passed by index (`params[index] = value`).
						 *
						 * @return {string}
						 */
						value: function urlForName(name, params) {
							if (!this.__urlForName) {
								this.__urlForName = generateUrls(this);
							}

							return getPathnameForRouter(this.__urlForName(name, params), this);
						}
						/**
						 * Generates a URL for the given route path, optionally performing
						 * substitution of parameters.
						 *
						 * @param {!string} path string route path declared in [express.js syntax](https://expressjs.com/en/guide/routing.html#route-paths").
						 * @param {?Object} params Optional object with route path parameters.
						 * Named parameters are passed by name (`params[name] = value`), unnamed
						 * parameters are passed by index (`params[index] = value`).
						 *
						 * @return {string}
						 */

					}, {
						key: "urlForPath",
						value: function urlForPath(path, params) {
							return getPathnameForRouter(Router.pathToRegexp.compile(path)(params), this);
						}
						/**
						 * Triggers navigation to a new path. Returns a boolean without waiting until
						 * the navigation is complete. Returns `true` if at least one `Router`
						 * has handled the navigation (was subscribed and had `baseUrl` matching
						 * the `pathname` argument), otherwise returns `false`.
						 *
						 * @param {!string} pathname a new in-app path
						 * @return {boolean}
						 */

					}], [{
						key: "setTriggers",
						value: function setTriggers() {
							for (var _len = arguments.length, triggers = new Array(_len), _key = 0; _key < _len; _key++) {
								triggers[_key] = arguments[_key];
							}

							setNavigationTriggers(triggers);
						}
					}, {
						key: "go",
						value: function go(pathname) {
							return fireRouterEvent('go', {
								pathname: pathname
							});
						}
					}]);

					return Router;
				}(Resolver);

			Router.NavigationTrigger = {
				POPSTATE: POPSTATE,
				CLICK: CLICK
			};

			var isUrlAvailable, urlDocument, urlBase, urlAnchor;

			Resolver.__ensureUrlAvailableOrPolyfilled = function () {
				if (isUrlAvailable === undefined) {
					try {
						var url = new URL('b', 'http://a');
						url.pathname = 'c';
						isUrlAvailable = url.href === 'http://a/c';
					} catch (e) {
						isUrlAvailable = false;
					}

					if (!isUrlAvailable) {
						// The URL constructor is not available in IE11. Polyfill it by creating
						// an HTMLAnchorElement in an in-memory HTML document.
						urlDocument = document.implementation.createHTMLDocument('url');
						urlBase = urlDocument.createElement('base');
						urlDocument.head.appendChild(urlBase);
						urlAnchor = urlDocument.createElement('a');

						if (!urlAnchor.origin) {
							// IE11: HTMLAnchorElement does not have the `origin` property
							Object.defineProperty(urlAnchor, 'origin', {
								get: function get() {
									// IE11: on HTTP and HTTPS the default port is not included into
									// window.location.origin, so won't include it here either.
									var protocol = urlAnchor.protocol;
									var port = urlAnchor.port;
									var defaultHttp = protocol === 'http:' && port === '80';
									var defaultHttps = protocol === 'https:' && port === '443';
									var host = defaultHttp || defaultHttps ? urlAnchor.hostname : urlAnchor.host;
									return "".concat(protocol, "//").concat(host);
								}
							}); // IE11: HTMLAnchorElement pathname does not start with a leading slash

							Object.defineProperty(urlAnchor, 'pathname', {
								get: function get() {
									return urlAnchor.href.slice(urlAnchor.origin.length);
								}
							});
						}
					}
				}
			};

			Resolver.__createUrl = function (path, base) {
				Resolver.__ensureUrlAvailableOrPolyfilled();

				if (isUrlAvailable) {
					return new URL(path, base);
				}

				urlBase.href = base;
				urlAnchor.href = path.replace(/ /g, '%20'); // IE11: only absolute href setting results in correct part properties
				// (`protocol`, `host`, `port`, and such), otherwise they are empty.

				urlAnchor.href = urlAnchor.href; // eslint-disable-line no-self-assign

				return urlAnchor;
			};

			simply.Resolver = Resolver;
			simply.Router = Router;
		})()

	},
	morphdom: function () {
		(function () {
			"use strict"; var DOCUMENT_FRAGMENT_NODE = 11; function morphAttrs(fromNode, toNode) { var toNodeAttrs = toNode.attributes; var attr; var attrName; var attrNamespaceURI; var attrValue; var fromValue; if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) { return } for (var i = toNodeAttrs.length - 1; i >= 0; i--) { attr = toNodeAttrs[i]; attrName = attr.name; attrNamespaceURI = attr.namespaceURI; attrValue = attr.value; if (attrNamespaceURI) { attrName = attr.localName || attrName; fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName); if (fromValue !== attrValue) { if (attr.prefix === "xmlns") { attrName = attr.name } fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue) } } else { fromValue = fromNode.getAttribute(attrName); if (fromValue !== attrValue) { fromNode.setAttribute(attrName, attrValue) } } } var fromNodeAttrs = fromNode.attributes; for (var d = fromNodeAttrs.length - 1; d >= 0; d--) { attr = fromNodeAttrs[d]; attrName = attr.name; attrNamespaceURI = attr.namespaceURI; if (attrNamespaceURI) { attrName = attr.localName || attrName; if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) { fromNode.removeAttributeNS(attrNamespaceURI, attrName) } } else { if (!toNode.hasAttribute(attrName)) { fromNode.removeAttribute(attrName) } } } } var range; var NS_XHTML = "http://www.w3.org/1999/xhtml"; var doc = typeof document === "undefined" ? undefined : document; var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template"); var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange(); function createFragmentFromTemplate(str) { var template = doc.createElement("template"); template.innerHTML = str; return template.content.childNodes[0] } function createFragmentFromRange(str) { if (!range) { range = doc.createRange(); range.selectNode(doc.body) } var fragment = range.createContextualFragment(str); return fragment.childNodes[0] } function createFragmentFromWrap(str) { var fragment = doc.createElement("body"); fragment.innerHTML = str; return fragment.childNodes[0] } function toElement(str) { str = str.trim(); if (HAS_TEMPLATE_SUPPORT) { return createFragmentFromTemplate(str) } else if (HAS_RANGE_SUPPORT) { return createFragmentFromRange(str) } return createFragmentFromWrap(str) } function compareNodeNames(fromEl, toEl) { var fromNodeName = fromEl.nodeName; var toNodeName = toEl.nodeName; var fromCodeStart, toCodeStart; if (fromNodeName === toNodeName) { return true } fromCodeStart = fromNodeName.charCodeAt(0); toCodeStart = toNodeName.charCodeAt(0); if (fromCodeStart <= 90 && toCodeStart >= 97) { return fromNodeName === toNodeName.toUpperCase() } else if (toCodeStart <= 90 && fromCodeStart >= 97) { return toNodeName === fromNodeName.toUpperCase() } else { return false } } function createElementNS(name, namespaceURI) { return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name) } function moveChildren(fromEl, toEl) { var curChild = fromEl.firstChild; while (curChild) { var nextChild = curChild.nextSibling; toEl.appendChild(curChild); curChild = nextChild } return toEl } function syncBooleanAttrProp(fromEl, toEl, name) { if (fromEl[name] !== toEl[name]) { fromEl[name] = toEl[name]; if (fromEl[name]) { fromEl.setAttribute(name, "") } else { fromEl.removeAttribute(name) } } } var specialElHandlers = { OPTION: function (fromEl, toEl) { var parentNode = fromEl.parentNode; if (parentNode) { var parentName = parentNode.nodeName.toUpperCase(); if (parentName === "OPTGROUP") { parentNode = parentNode.parentNode; parentName = parentNode && parentNode.nodeName.toUpperCase() } if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) { if (fromEl.hasAttribute("selected") && !toEl.selected) { fromEl.setAttribute("selected", "selected"); fromEl.removeAttribute("selected") } parentNode.selectedIndex = -1 } } syncBooleanAttrProp(fromEl, toEl, "selected") }, INPUT: function (fromEl, toEl) { syncBooleanAttrProp(fromEl, toEl, "checked"); syncBooleanAttrProp(fromEl, toEl, "disabled"); if (fromEl.value !== toEl.value) { fromEl.value = toEl.value } if (!toEl.hasAttribute("value")) { fromEl.removeAttribute("value") } }, TEXTAREA: function (fromEl, toEl) { var newValue = toEl.value; if (fromEl.value !== newValue) { fromEl.value = newValue } var firstChild = fromEl.firstChild; if (firstChild) { var oldValue = firstChild.nodeValue; if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) { return } firstChild.nodeValue = newValue } }, SELECT: function (fromEl, toEl) { if (!toEl.hasAttribute("multiple")) { var selectedIndex = -1; var i = 0; var curChild = fromEl.firstChild; var optgroup; var nodeName; while (curChild) { nodeName = curChild.nodeName && curChild.nodeName.toUpperCase(); if (nodeName === "OPTGROUP") { optgroup = curChild; curChild = optgroup.firstChild } else { if (nodeName === "OPTION") { if (curChild.hasAttribute("selected")) { selectedIndex = i; break } i++ } curChild = curChild.nextSibling; if (!curChild && optgroup) { curChild = optgroup.nextSibling; optgroup = null } } } fromEl.selectedIndex = selectedIndex } } }; var ELEMENT_NODE = 1; var DOCUMENT_FRAGMENT_NODE$1 = 11; var TEXT_NODE = 3; var COMMENT_NODE = 8; function noop() { } function defaultGetNodeKey(node) { if (node) { return node.getAttribute && node.getAttribute("id") || node.id } } function morphdomFactory(morphAttrs) { return function morphdom(fromNode, toNode, options) { if (!options) { options = {} } if (typeof toNode === "string") { if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") { var toNodeHtml = toNode; toNode = doc.createElement("html"); toNode.innerHTML = toNodeHtml } else { toNode = toElement(toNode) } } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) { toNode = toNode.firstElementChild } var getNodeKey = options.getNodeKey || defaultGetNodeKey; var onBeforeNodeAdded = options.onBeforeNodeAdded || noop; var onNodeAdded = options.onNodeAdded || noop; var onBeforeElUpdated = options.onBeforeElUpdated || noop; var onElUpdated = options.onElUpdated || noop; var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop; var onNodeDiscarded = options.onNodeDiscarded || noop; var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop; var childrenOnly = options.childrenOnly === true; var fromNodesLookup = Object.create(null); var keyedRemovalList = []; function addKeyedRemoval(key) { keyedRemovalList.push(key) } function walkDiscardedChildNodes(node, skipKeyedNodes) { if (node.nodeType === ELEMENT_NODE) { var curChild = node.firstChild; while (curChild) { var key = undefined; if (skipKeyedNodes && (key = getNodeKey(curChild))) { addKeyedRemoval(key) } else { onNodeDiscarded(curChild); if (curChild.firstChild) { walkDiscardedChildNodes(curChild, skipKeyedNodes) } } curChild = curChild.nextSibling } } } function removeNode(node, parentNode, skipKeyedNodes) { if (onBeforeNodeDiscarded(node) === false) { return } if (parentNode) { parentNode.removeChild(node) } onNodeDiscarded(node); walkDiscardedChildNodes(node, skipKeyedNodes) } function indexTree(node) { if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) { var curChild = node.firstChild; while (curChild) { var key = getNodeKey(curChild); if (key) { fromNodesLookup[key] = curChild } indexTree(curChild); curChild = curChild.nextSibling } } } indexTree(fromNode); function handleNodeAdded(el) { onNodeAdded(el); var curChild = el.firstChild; while (curChild) { var nextSibling = curChild.nextSibling; var key = getNodeKey(curChild); if (key) { var unmatchedFromEl = fromNodesLookup[key]; if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) { curChild.parentNode.replaceChild(unmatchedFromEl, curChild); morphEl(unmatchedFromEl, curChild) } else { handleNodeAdded(curChild) } } else { handleNodeAdded(curChild) } curChild = nextSibling } } function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) { while (curFromNodeChild) { var fromNextSibling = curFromNodeChild.nextSibling; if (curFromNodeKey = getNodeKey(curFromNodeChild)) { addKeyedRemoval(curFromNodeKey) } else { removeNode(curFromNodeChild, fromEl, true) } curFromNodeChild = fromNextSibling } } function morphEl(fromEl, toEl, childrenOnly) { var toElKey = getNodeKey(toEl); if (toElKey) { delete fromNodesLookup[toElKey] } if (!childrenOnly) { if (onBeforeElUpdated(fromEl, toEl) === false) { return } morphAttrs(fromEl, toEl); onElUpdated(fromEl); if (onBeforeElChildrenUpdated(fromEl, toEl) === false) { return } } if (fromEl.nodeName !== "TEXTAREA") { morphChildren(fromEl, toEl) } else { specialElHandlers.TEXTAREA(fromEl, toEl) } } function morphChildren(fromEl, toEl) { var curToNodeChild = toEl.firstChild; var curFromNodeChild = fromEl.firstChild; var curToNodeKey; var curFromNodeKey; var fromNextSibling; var toNextSibling; var matchingFromEl; outer: while (curToNodeChild) { toNextSibling = curToNodeChild.nextSibling; curToNodeKey = getNodeKey(curToNodeChild); while (curFromNodeChild) { fromNextSibling = curFromNodeChild.nextSibling; if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) { curToNodeChild = toNextSibling; curFromNodeChild = fromNextSibling; continue outer } curFromNodeKey = getNodeKey(curFromNodeChild); var curFromNodeType = curFromNodeChild.nodeType; var isCompatible = undefined; if (curFromNodeType === curToNodeChild.nodeType) { if (curFromNodeType === ELEMENT_NODE) { if (curToNodeKey) { if (curToNodeKey !== curFromNodeKey) { if (matchingFromEl = fromNodesLookup[curToNodeKey]) { if (fromNextSibling === matchingFromEl) { isCompatible = false } else { fromEl.insertBefore(matchingFromEl, curFromNodeChild); if (curFromNodeKey) { addKeyedRemoval(curFromNodeKey) } else { removeNode(curFromNodeChild, fromEl, true) } curFromNodeChild = matchingFromEl } } else { isCompatible = false } } } else if (curFromNodeKey) { isCompatible = false } isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild); if (isCompatible) { morphEl(curFromNodeChild, curToNodeChild) } } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) { isCompatible = true; if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) { curFromNodeChild.nodeValue = curToNodeChild.nodeValue } } } if (isCompatible) { curToNodeChild = toNextSibling; curFromNodeChild = fromNextSibling; continue outer } if (curFromNodeKey) { addKeyedRemoval(curFromNodeKey) } else { removeNode(curFromNodeChild, fromEl, true) } curFromNodeChild = fromNextSibling } if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) { fromEl.appendChild(matchingFromEl); morphEl(matchingFromEl, curToNodeChild) } else { var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild); if (onBeforeNodeAddedResult !== false) { if (onBeforeNodeAddedResult) { curToNodeChild = onBeforeNodeAddedResult } if (curToNodeChild.actualize) { curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc) } fromEl.appendChild(curToNodeChild); handleNodeAdded(curToNodeChild) } } curToNodeChild = toNextSibling; curFromNodeChild = fromNextSibling } cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey); var specialElHandler = specialElHandlers[fromEl.nodeName]; if (specialElHandler) { specialElHandler(fromEl, toEl) } } var morphedNode = fromNode; var morphedNodeType = morphedNode.nodeType; var toNodeType = toNode.nodeType; if (!childrenOnly) { if (morphedNodeType === ELEMENT_NODE) { if (toNodeType === ELEMENT_NODE) { if (!compareNodeNames(fromNode, toNode)) { onNodeDiscarded(fromNode); morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI)) } } else { morphedNode = toNode } } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { if (toNodeType === morphedNodeType) { if (morphedNode.nodeValue !== toNode.nodeValue) { morphedNode.nodeValue = toNode.nodeValue } return morphedNode } else { morphedNode = toNode } } } if (morphedNode === toNode) { onNodeDiscarded(fromNode) } else { if (toNode.isSameNode && toNode.isSameNode(morphedNode)) { return } morphEl(morphedNode, toNode, childrenOnly); if (keyedRemovalList) { for (var i = 0, len = keyedRemovalList.length; i < len; i++) { var elToRemove = fromNodesLookup[keyedRemovalList[i]]; if (elToRemove) { removeNode(elToRemove, elToRemove.parentNode, false) } } } } if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) { if (morphedNode.actualize) { morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc) } fromNode.parentNode.replaceChild(morphedNode, fromNode) } return morphedNode } } var morphdom = morphdomFactory(morphAttrs); simply.morphdom = morphdom;
		})();
	},
	init: function () {
		this.Router();
		this.obaa();
		this.morphdom();
		window.get = this.get;
	}
}

simply.init();