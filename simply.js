simply = {
	components: {},
	parseTemplate: function (parsingArgs) {

		var { template, data, style, state, parent, methods, props, component, dom, methods, lifecycle, watch } = parsingArgs;

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
		let eachStart = /\<each\s+of\=\"(?<of>[^"]*)\"\s+as\=\"(?<as>[^"]*)\"(\s+key\=\"(?<key>[^"]*)\")?(\s+index\=\"(?<index>[^"]*)\")?\>$/gm;
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

		template = template.replace(/\$\{/g, 'minyeli{');

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
				// attribute içindeki fonksyion ise skip
				if (bucket.substr(-'="function'.length) === '="function' ||
					bucket.substr(-'="(function'.length) === '="(function'
				) {
					ignoreFlag = true;
				}

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
					varBucket = varBucket.trim();
					// console.log(varBucket);
					let variable = varBucket.trim().substring(1, varBucket.length - 1);

					// if (simply.parseProp("{" + variable.toString() + "}").type == "object") {
					// 	variable = "\"" + varBucket.trim() + "\"";
					// }
					// no bubble for me today
					try {
						if (typeof JSON.parse("{" + variable.replace(/[^\\]'/g, '"').replace(/\\'/g, "'") + "}") == "object") {
							variable = "\"" + varBucket.trim() + "\"";
						}
					} catch (error) {

					}

					logic = "ht+=" + variable + ";";
					flag = true;
				}
				else if ((m = inTagVar.exec(bucket)) !== null) {
					logic = "ht+=" + m.groups.l + ";";
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
					// console.log(m);
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



				// staticText = processedLetters.replace(logicLine, "");
				// logicline'ın last occurance'ını siliyore
				// bir üstteki hata fırlatıyordu mesela iki tane {data.name} varsa
				staticText = processedLetters.substring(0, processedLetters.lastIndexOf(logicLine)) + "";

				let replaceThis = staticText + logicLine;
				var withThis = "ht+=`" + staticText.replace(/\n/g, "") + "`;" + logic;

				// if else arasına ht=""; girince hata fırlatıyordu
				if (staticText.trim() == "") {
					var withThis = logic;
				}
				else {
					var withThis = "ht+=`" + staticText.replace(/\n/g, "") + "`;" + logic;
				}
				/*
				console.log("name: " + component.name);
				console.log("replace this: " + replaceThis)
				console.log("with this: " + withThis);
				*/
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
		// console.log(capturedLogics); 
		bucket = bucket.replace(/minyeli/g, '$');
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
	getBetweenTag: function (obj) {
		let { string, tag, prop } = obj;

		let open;
		let anyOpen = new RegExp('\<' + tag + '([^<>]*)>$', "i");
		let close = new RegExp('<\/' + tag + '>$', "i");
		let captureFlag = false;
		let bucket, capture = "";
		let count = 0;

		if (prop) {
			open = new RegExp('\<' + tag + '([^<>]*)' + prop + '([^<>]*)>$', "i");
		}
		else {
			open = anyOpen;
		}

		for (var i = 0; i < string.length; i++) {
			bucket += string[i];

			if (open.test(bucket)) {
				captureFlag = true;
				count += 1;
			}
			else if (anyOpen.test(bucket)) {
				count += 1;
			}
			else if (captureFlag && close.test(bucket)) {
				count -= 1;
				capture += string[i];
				if (count == 0) {
					let simplyTemplate = /^\<template([^<>]*)simply([^<>]*)>/;
					capture = capture.trim();
					capture = capture.replace(simplyTemplate, "");
					capture = capture.replace(close, "");
					capture = capture.trim();
					return capture;
				}
			}
			else if (captureFlag) {
				capture += string[i];
			}
		}
	},
	getObject: function (string, name) {
		var open = /uno(\s+)?\=(\s+)?{$/;
		var bucket = "";
		var capture = "";
		var captureFlag = false;
		count = 0;
		for (var i = 0; i < string.length; i++) {
			bucket += string[i];

			if (open.test(bucket)) {
				captureFlag = true;
				count += 1;
			}
			else if (captureFlag && string[i] == "{") {
				count += 1;
			}
			else if (captureFlag && string[i] == "}") {
				count -= 1;
			}

			if (captureFlag) {
				capture += string[i];
				if (count == 0) {
					return capture;
				}
			}
		}
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
		simply.gets = simply.gets ? simply.gets : [];

		// multi
		if (Array.isArray(path)) {
			for (let i = 0; i < path.length; i++) {
				simply.gets.push(path[i]);
				addUnoAndContinue(path[i])
			}
		}
		// single
		else {
			simply.gets.push(path);
			addUnoAndContinue(path)
		}
		function addUnoAndContinue(p) {
			simply.loadComponent(p, name, function (component) {
				simply.getSettings(component, function (settings) {
					simply.registerComponent(settings);
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
							styles: parsed.styles,
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
	request: function (url, callback, async = false) {
		var request = new XMLHttpRequest();
		request.open('GET', url, async);
		request.onload = function () {
			if (this.status >= 200 && this.status < 400) {
				try {
					response = JSON.parse(this.responseText);
				}
				catch (err) {
					response = this.responseText;
				}
				if (callback) {
					callback(response);
				}
			}
		};
		request.send();
	},
	splitComponent: function (string) {
		var txt = document.createElement("textarea");
		var parser = new DOMParser();
		var dom = parser.parseFromString(string, "text/html");
		var template;
		var styles = {};
		if (dom.querySelector("style")) {
			dom.querySelectorAll("style").forEach(styleEl => {
				txt.innerHTML = styleEl.innerHTML;
				style = txt.value;
				string = string.replace(txt.value, "");
				if (styleEl.getAttribute("global") !== null) {
					styles["global"] = style;
				}
				else {
					styles["local"] = style;
				}
				styleEl.remove();
			});
		}

		var script = "";
		if (dom.querySelector("script")) {
			var script = dom.querySelector("script");
			txt.innerHTML = script.innerHTML;
			script = txt.value;
			dom.querySelector("script").remove();
			string = string.replace(txt.value, "");
		}
		template = string.replace("<style></style>", "").replace("<style global></style>", "").replace("<script></script>", "");

		return {
			template,
			styles,
			script
		}
	},
	processPropTemplate: function (string) {
		// clean up  
		var propsFromTemplate = string;
		propsFromTemplate = propsFromTemplate.replace(/[^\\]'/g, '"').replace(/\\'/g, "'");
		propsFromTemplate = propsFromTemplate.replace(/(?:\r\n|\r|\n)/g, ' ');

		// convert to object
		propsFromTemplate = Function("return " + propsFromTemplate)()
		propsFromTemplate = simply.customStringify(propsFromTemplate)

		propsFromTemplate = JSON.parse(propsFromTemplate);
		return propsFromTemplate;
	},
	parseProp: function (contentString) {
		var type, value, parsed, content;

		// atrribute'dan alıp parse edip obj çıkacak
		// escape edilmemiş single quote'ları double yapıyor
		// escape edilmiş single quote'ları kurtarıyor
		content = contentString.replace(/[^\\]'/g, '"');
		content = content.replace(/\\\'/g, "'");

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
			// console.log({e, contentString, content});
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
				"value": value,
				"str": content
			}
		}
	},
	prepareAttr: function (value) {

		let type = typeof value;
		if (Array.isArray(value) || type == "object" || type == "number" || type == "boolean") {
			// attribute'a yazacak, onun için hazırlık
			// önce bütün single quote'ları escape ediyor
			// escape edilmemiş tüm double quote'ları single ile replace ediyor
			return simply.customStringify(value).replace(/[^\\]'/g, "\\'").replace(/[^\\]"/g, "'").replace(/\"/g, "\'");
		}
		else if (type == "function") {
			return value.toString().replace(/[^\\]'/g, '"').replace(/\\'/g, "'");
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
					return value.toString().replace(/[^\\]'/g, '"').replace(/\\'/g, "'");
				}
				return value;
			}
		});
	},
	getSettings: function ({ name, template, styles, script, docStr }, callback) {
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
			styles,
			script,
			docStr
			//settings
		});
		//});
	},
	runGetsReturnClass: function (scr, compName) {
		var gets;
		var classRegex = /class(\s+simply)?(\s+)?{/;
		var classLine = classRegex.exec(scr);

		if (classLine) {
			var scriptParts = scr.split(classLine[0]);
			gets = scriptParts[0];
			var clss = classLine[0] + scriptParts[1];
			//console.log(clss);
		}
		else {
			gets = scr;
		}
		var m;
		var importRegex = /\s*get\((\s+)?(\[)?([\s\S]*?)?(\,)?(\s+)?\]?(\s+)?\)(\;)?/gm
		while ((m = importRegex.exec(gets)) !== null) {
			eval(m[0]);
		}
		try {
			if (clss.trim().indexOf(classLine[0]) == 0) {
				// fix for "class simply {" usage
				clss = clss = clss.replace(classRegex, "class {");
				// to fix console line number
				// var lines = docStr.split('<script>')[0].split("\n");
				// var lineBreaks = "";
				// for (let index = 0; index < lines.length - 2; index++) {
				// 	lineBreaks += "\n"
				// }			

				// uno options'ı alıp string halinde 
				// global bi değişkene yazıyoruz, çünkü
				// uno.min.js henüz piyasada yok
				// presets fonksyionları hata fırlatıyor
				if (/uno(\s+)?\=(\s+)?{/.test(clss)) {
					var uno = simply.getObject(clss, "uno");
					clss = clss.replace(uno, "{}");
					window.unoConfig = uno;
				}

				return "//" + compName + "//" + compName + "\n\nnew " + clss.trim() + "//@ sourceURL=" + compName + ".html";
			}
		} catch (error) {
			return false;
		}
	},
	registerComponent: function ({ template, styles, name, script, docStr, noFile }) {
		if (!customElements.get(name)) {
			class simplyComponent extends HTMLElement {
				constructor() {
					super();

					let sfcClass = eval(simply.runGetsReturnClass(script, name));
					this.sfcClass = sfcClass ? sfcClass : {};
					// eval("//" + name + lineBreaks + "//" + name + "\n\nnew " + sfcClass.trim() + "//@ sourceURL=" + name + ".html");

					// inline class varsa sfc class ile merge
					if (this.querySelector("template[simply]")) {
						// burada bi encoding sorunu oldu
						// textare trick'i işi çözemedi
						// multiple spaceleri { ile replace ettim
						let t = this.querySelector("template[simply]").innerHTML.replace(/\s{2,}/g, "\n\n");
						this.inlineComp = simply.splitComponent(t);
						let inlineClassAsText = simply.runGetsReturnClass(this.inlineComp.script, name);
						var inlineCompClass = eval(inlineClassAsText);

						// data|state|methods|lifecycle
						for (var key in inlineCompClass) {
							if (key.match("data|state|methods|lifecycle|props")) {
								for (var childKey in inlineCompClass[key]) {
									if (!this.sfcClass[key]) {
										this.sfcClass[key] = {};
									}
									let value = inlineCompClass[key][childKey];
									this.sfcClass[key][childKey] = value;
								}
							}
							// inline prop'ları attribute'lara yaz
							//else if (key == "props") {
							//	for (var propKey in inlineCompClass[key]) {
							//		if (!this.sfcClass[key]) {
							//			this.sfcClass[key] = {};
							//			let value = inlineCompClass[key][propKey];
							//			this.sfcClass[key][propKey] = value;										
							//		}									
							//let attrValue = simply.prepareAttr(inlineCompClass["props"][propKey]);
							//this.setAttribute(propKey, attrValue);
							//}
							//}
						}
					}

					// before construct event
					if (typeof this.sfcClass.lifecycle !== "undefined") {
						if (typeof this.sfcClass.lifecycle.beforeConstruct !== "undefined") {
							this.sfcClass.lifecycle.beforeConstruct();
						}
					}
					var open = false;
					if (this.getAttribute("open") !== null) {
						open = true;
					}

					var uid = "id" + Math.random().toString(16).slice(2)
					var component = this;

					if (!open) {
						var dom = this.attachShadow({ mode: 'open' });
						var parent = this.getRootNode().host;
						if (!parent) {
							parent = simply.findShadowRootOrCustomElement(this);
						}
					}
					else {
						var dom = this;
						var parent = simply.findShadowRootOrCustomElement(this);
					}

					var data = this.sfcClass.data ? this.sfcClass.data : {};
					var props = this.sfcClass.props ? this.sfcClass.props : {};
					var methods = this.sfcClass.methods;
					var watch = this.sfcClass.watch;
					var lifecycle = this.sfcClass.lifecycle;
					var state;
					var cb = {}

					this.component = component;
					this.props = props;
					this.dom = dom;
					this.lifecycle = lifecycle;
					this.data = data;
					this.methods = methods;
					this.watch = watch;
					this.parent = parent;
					this.uid = uid;
					this.open = open;
					this.cb = cb;

					// console.log(name, open);

					var geval = eval;
					for (var key in sfcClass) {
						if (!key.match("data|state|methods|lifecycle|props|dom|component|watch|parent")) {
							var val = sfcClass[key];
							if (typeof val == "object") {
								val = simply.customStringify(val);
							}
							else if (typeof val == "function") {
								val = val.toString();
							}
							else if (typeof val == "string") {
								val = "'" + val + "'";
							}
							geval("var " + key + "=" + val + ";");
						}
					}

					// atribute'ları proplara yazalım
					for (var i = 0; i < this.attributes.length; i++) {
						var attrib = this.attributes[i];
						// console.log("yaz balam ay balam", simply.parseProp(attrib.value));
						if (attrib.name !== "cb") {
							props[attrib.name] = simply.parseProp(attrib.value).value;
						}
					}

					// tailwind instance setup
					if (this.sfcClass.uno) {
						this.uno = this.sfcClass.uno;
					}

					if (styles.global) {
						this.globalStyle = styles.global;
					}

					// anadan babadan gelen state varsa
					if (parent) {
						if (template.indexOf("state.") > -1 || script.indexOf("state.") > -1) {
							let current = parent;
							while (current) {
									if (current.state) {
											this.state = current.state;
											this.cb.state = parent.cb.state;
											break;
									}
									current = current.parent;
							}
						}
						
						if (typeof parent.globalStyle !== "undefined") {
							this.globalStyle = parent.globalStyle;
						}
					}

					// komponent içinde state tanımlı ise
					if (typeof this.sfcClass.state !== "undefined") {
						if (!this.state) {
							this.state = {};
						}
						var newStates = this.sfcClass.state;
						for (let key in newStates) {
							this.state[key] = newStates[key];
						}
					}

					state = component.state;
					parent = component.parent;
					cb = component.cb;
					// we couldn't get state and parent
					// bcs they are wrapped with router
					// this is a fix for that
					Object.defineProperty(this, 'state', {
						get: function () { return state; },
						set: function (v) {
							state = v;
						}
					});
					Object.defineProperty(this, 'parent', {
						get: function () { return parent; },
						set: function (v) {
							parent = v;
							if (typeof parent.globalStyle !== "undefined") {
								component.globalStyle = parent.globalStyle;
							}
						}
					});

					this.setData = function (newValue) {
						data = newValue;
					};
					this.setCbData = function (newValue) {
						cb.data = newValue;
					};

					this.setProps = function (newValue) {
						props = newValue;
					};
					this.setCbProps = function (newValue) {
						cb.props = newValue;
					};

					this.setState = function (newValue) {
						state = newValue;
					};
					this.setCbState = function (newValue) {
						cb.state = newValue;
					};

					// after construct event
					if (typeof this.lifecycle !== "undefined") {
						if (typeof this.lifecycle.afterConstruct !== "undefined") {
							setTimeout(() => {
								this.lifecycle.afterConstruct();
							}, 0);
						}
					}
				}
				// invoked each time the custom element is appended
				// into a document-connected element
				observeAttrChange(el, callback) {
					var self = this;
					var observer = new MutationObserver(function (mutations) {
						mutations.forEach(function (mutation) {
							if (mutation.type === 'attributes') {
								var newVal = mutation.target.getAttribute(mutation.attributeName);
								//console.log(mutation.attributeName, "attribute changed to", newVal);
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

					var self = this;
					var hamdi = name;
					var bub = undefined;
					this.react = function (name, value, prop = false) {
						// console.log("react to ", name, value, hamdi);

						if (self.data) {
							if (typeof self.lifecycle !== "undefined") {
								if (typeof self.lifecycle.whenDataChange !== "undefined") {
									//console.log(self.lifecycle.whenDataChange(name, value, old, parents));
									if (self.lifecycle.whenDataChange(name, value) === false) {
										return false;
									};
								}
							}

							//console.log("key:" + name + ", new value: " + value + ", old value: " + old + ", tree: " + parents);
							//console.log(name, value, old, parents);
							// prop değişikliklerini attributes'a yazmak
							// parent render olurken morph işini bozuyor
							// o yüzden sadece one-way (attr -> prop) ile devam
							/*
							if (prop) {
								if (self.props) {
									console.log("name", name);
									if (self.props[name]) {
										//self.setAttribute(name, simply.prepareAttr(self.props[name]));
									}
								}
							}
							*/

							if (typeof self.watch !== "undefined") {
								self.watch(name, value);
							}
							self.render();
						}

					}

					var proxies = new WeakMap();

					if (this.data) {
						let handler = {
							get: function (obj, prop, r) {

								// If the property is an array or object
								if (isObjectWithoutTriggeringGetter(obj, prop)) {
									console.log(obj, prop);
									//console.log(proxies, obj[prop], r);
									if (proxies.has(obj[prop])) {
										//console.log("uyy proxy daaa", obj[prop]);
										return proxies.get(obj[prop]);
									}
									else {
										//console.log("obje proxy'e dönüştürüldü", obj, prop);
										let proxy = new Proxy(obj[prop], handler);
										//proxies.add(proxy);
										proxies.set(obj[prop], proxy);
										return proxy;
									}

								}
								else {
									//console.log("normal get", obj, prop);
									return obj[prop];
								}
							},
							set: function (target, prop, value, receiver) {
								/*
								if (window.ttt && !window.count) {
									window.count = 1;
									console.log(name);
								}	
								else if (window.ttt && window.count) {
									window.tt = performance.now();
									alert(`Call to doSomething took ${window.tt - window.ttt} milliseconds.`);							
								}
								*/

								if (target[prop] !== value) {
									Reflect.set(...arguments); // Pass through the operation
									let old = target[prop];
									//console.log(prop, "changed from ", target[prop], "to", value);								
									for (const [key, cb] of Object.entries(self.cb.data)) {
										if (cb) {
											cb(prop, value, old);
										}
										//console.log(`${key}: ${value}`);
									}
								}
								return true

								// return Reflect.set(...arguments); // Pass through the operation
							},
							deleteProperty: function (target, prop) {
								if (prop in target) {
									delete target[prop];
									//console.log(`property removed: ${prop}`);
									return true;
									// Expected output: "property removed: texture"
								}
								for (const [key, cb] of Object.entries(self.cb.data)) {
									if (cb) {
										cb(prop, null);
									}
									//console.log(`${key}: ${value}`);
								}
							}
						};

						if (template.indexOf("data.") > -1 || script.indexOf("data.") > -1) {
							this.cb.data = {}
							this.cb.data[this.uid] = function (prop, value) { self.react(prop, value) };
							this.data = new Proxy(this.data, handler);
							this.setData(this.data);
							this.setCbData(this.cb.data);
						}

					}

					function isObjectWithoutTriggeringGetter(obj, prop) {
						const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
						if (descriptor && 'value' in descriptor) {
							const value = descriptor.value;
							return value !== null && typeof value === 'object';
							//return value !== null && typeof value === 'object' && !Array.isArray(value);
						}
						return false;
					}

					if (this.props) {
						let handler = {
							get: function (obj, prop) {

								// props can contain only key: value not key: object
								// so no need to proxify child nodes

								/*
								if (isObjectWithoutTriggeringGetter(obj, prop) ) {
									console.log(proxies, obj[prop], r);
									if (proxies.has(obj[prop])) {
										// console.log("uyy proxy daaa", obj[prop]);
										return proxies.get(obj[prop]);
									}
									else {
										// console.log("obje proxy'e dönüştürüldü", obj, prop);
										let proxy = new Proxy(obj[prop], handler);
										//proxies.add(proxy);
										proxies.set(obj[prop], proxy);
										return proxy;
									}

								}
								else {
									//console.log("normal get", obj, prop);
									return obj[prop];
								}
								*/
								return obj[prop];
							},
							set: function (target, prop, value, receiver) {
								if (target[prop] !== value) {
									Reflect.set(...arguments);
									for (const [key, cb] of Object.entries(self.cb.props)) {
											if (cb) {

												cb(prop, value);
											}
										
										//console.log(`${key}: ${value}`);
									}
								}
								return true; // Pass through the operation
							},
							deleteProperty: function (target, prop) {
								if (prop in target) {
									delete target[prop];
									//console.log(`property removed: ${prop}`);
									// Expected output: "property removed: texture"
								}
								for (const [key, cb] of Object.entries(self.cb.props)) {
									cb(prop, null);
									//console.log(`${key}: ${value}`);
								}
							}
						};

						if (template.indexOf("props.") > -1 || script.indexOf("props.") > -1) {
							this.cb.props = {}
							this.cb.props[this.uid] = function (prop, value) { self.react(prop, value, true) };
							this.props = new Proxy(this.props, handler);
							this.setProps(this.props);
							this.setCbProps(this.cb.props);
						}

					}

					if (this.state) {
						if (!this.cb.state) {
							let handler = {
								get: function (obj, prop) {
								// If the property is an array or object
								// console.log(template, script, style);
								if (isObjectWithoutTriggeringGetter(obj, prop)) {
									//console.log(proxies, obj[prop], r);
									if (proxies.has(obj[prop])) {
										//console.log("uyy proxy daaa", obj[prop]);
										return proxies.get(obj[prop]);
									}
									else {
										//console.log("obje proxy'e dönüştürüldü", obj, prop);
										let proxy = new Proxy(obj[prop], handler);
										//proxies.add(proxy);
										proxies.set(obj[prop], proxy);
										return proxy;
									}

								}
								else {
									//console.log("normal get", obj, prop);
									return obj[prop];
								}
								},
								set: function (target, prop, value, receiver) {
									if (target[prop] !== value) {
										Reflect.set(...arguments);
										for (const [key, cb] of Object.entries(self.cb.state)) {
											if (cb) {
												cb(prop, value);
											}
											//console.log(`${key}: ${value}`);
										}
									}
									return true; // Pass through the operation

								},
								deleteProperty: function (target, prop) {
									if (prop in target) {
										delete target[prop];
										//console.log(`property removed: ${prop}`);
										// Expected output: "property removed: texture"
									}
									for (const [key, cb] of Object.entries(self.cb.state)) {
										if (cb) {
											cb(prop, null);
										}
									}
								}
							};
							// console.log(template.indexOf("state.") > -1, script.indexOf("state.") > -1, name);
							if (template.indexOf("state.") > -1 || script.indexOf("state.") > -1) {
								this.cb.state = {}
								this.cb.state[this.uid] = function (prop, value) { self.react(prop, value) };
								this.state = new Proxy(this.state, handler);
							}


						}
						else {
							if (template.indexOf("state.") > -1 || script.indexOf("state.") > -1) {
								// console.log(template.indexOf("state.") > -1, script.indexOf("state.") > -1, name);
								this.cb.state[this.uid] = function (prop, value) { self.react(prop, value) };
							}
						}
						this.setState(this.state);
						if (template.indexOf("state.") > -1 || script.indexOf("state.") > -1) {
							// console.log(template.indexOf("state.") > -1, script.indexOf("state.") > -1, name);
							this.setCbState(this.cb.state);
						}
					}

					// parent değişkenleri değişince
					// velet de tepki versin diye

					/*
					if (this.parent) {
						
						if (this.parent.data) {
							this.parent.cb.data[this.uid] = function (prop, value) { self.react(prop, value) };
							this.parent.setData = this.parent.data;
						}
						if (this.parent.props) {
							this.parent.cb.props[this.uid] = function (prop, value) { self.react(prop, value) };
							this.parent.setprops = this.parent.props;
						}	
					}
					*/

					this.render();
				}
				render() {
					let m;
					// tüm on.* atribute değerleri için
					let regex = /\s+on[a-z]+(\s+)?\=(\s+)?(\"|\')(?<match>[^"\n]*)(\"|\')/gm;
					while ((m = regex.exec(template)) !== null) {
						if (m.index === regex.lastIndex) {
							regex.lastIndex++;
						}
						if (this.open) {
							var match = "simply.findShadowRootOrCustomElement(this)";
						}
						else {
							var match = "this.getRootNode().host";
						}
						if (m.groups["match"].indexOf(match) == -1) {
							var builtinVars = ["state.", "parent.", "methods.", "lifecycle.", "data.", "props.", "component.", "dom."];

							var newValue = m[0];
							builtinVars.forEach(v => {
								newValue = newValue.replaceAll(v, match + "." + v);
								newValue = newValue.replaceAll("." + match, "");
							});
							template = template.replaceAll(m[0], newValue);
						}
					}
					// template & style modification from inline comp
					if (this.inlineComp) {
						let inlineTemp = this.querySelector("template[simply]");
						let htmlMethod = inlineTemp.getAttribute("html");
						let styleMethod = inlineTemp.getAttribute("style");

						if (htmlMethod == "replace" || noFile) {
							template = this.inlineComp.template;
						}
						else if (htmlMethod == "prepend") {
							var mergedTemp = template.replace("<html>", "<html>" + this.inlineComp.template);
						}
						else {
							template = template.trim();

							var mergedTemp = template.replace(/<\/html>$/s, this.inlineComp.template.trim() + "</html>");
						}

						if (styleMethod == "replace" || noFile) {
							styles.local = this.inlineComp.styles.local;
						}
						else if (styleMethod == "prepend") {
							styles.local = this.inlineComp.styles.local + styles.local;
						}
						else {
							styles.local += this.inlineComp.styles.local;
						}
					}

					var tmpl = mergedTemp ? mergedTemp : template;

					let parsingArgs = {
						template: tmpl,
						style: styles.local,
						data: this.data,
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

					if (this.globalStyle) {
						var parsedGlobalStyle = simply.parseStyle({
							template,
							style: this.globalStyle,
							data: this.data,
							state: this.state,
							parent: this.parent,
							methods: this.methods,
							props: this.props,
							component: this.component,
							dom: this.dom,
							methods: this.methods,
							lifecycle: this.lifecycle,
							watch: this.watch
						});
					}

					if (!this.rendered) {
						var self = this;
						let parsedTemplate = simply.parseTemplate(parsingArgs);
						var parsedStyle = simply.parseStyle(parsingArgs);
						parsedTemplate = parsedTemplate + "<style uno></style><style global>" + (parsedGlobalStyle ? parsedGlobalStyle.style : "") + "</style>" + "<style simply>:host([hoak]) {display: none;} " + parsedStyle.style + "</style><style simply-vars></style>";


						if (typeof this.lifecycle !== "undefined") {
							if (typeof this.lifecycle.beforeFirstRender !== "undefined") {
								if (typeof this.lifecycle.beforeFirstRender(parsedTemplate) !== "undefined") {
									parsedTemplate = this.lifecycle.beforeFirstRender(parsedTemplate);
								}
							}
						}
						this.dom.innerHTML = parsedTemplate;
						simply.setupInlineComps(this.dom, docStr, template);
						if (window.unoConfig) {
							//this.component.setAttribute("hoak", true);
							var classObserver;
							var handleUnoClasses = function (dom) {
								try {
									classObserver.disconnect();
								} catch (error) {
								}
								// bi kere kafi 
								if (!window.unoConfig.generate) {
									window.unoConfig = createGenerator(eval("window.unoConfig=" + window.unoConfig));
								}
								window.unoConfig.generate(dom.innerHTML).then(function (result) {
									var twReset = `a,hr{color:inherit}progress,sub,sup{vertical-align:baseline}blockquote,body,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,menu,ol,p,pre,ul{margin:0}dialog,fieldset,legend,menu,ol,ul{padding:0}*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:var(--un-default-border-color,#e5e7eb)}::after,::before{--un-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{line-height:inherit}hr{height:0;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}menu,ol,ul{list-style:none}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}`;
									self.dom.querySelector("style[uno]").innerHTML = twReset + result.css;

									classObserver = new MutationObserver(function (mutations) {
										handleUnoClasses(self.dom);
									});

									classObserver.observe(dom, {
										attributes: true,
										attributeFilter: ['class'],
										childList: true,
										subtree: true,
										attributeOldValue: true
									});
								});
							}
							handleUnoClasses(self.dom);
							//this.component.removeAttribute("hoak");
							// https://gourav.io/blog/tailwind-in-shadow-dom
							// window.observe(this.tw, this.dom);
						}

						try {
							if (!this.open) {
								//console.log("not open", this);
								this.sheet = this.dom.getRootNode().querySelector("style[simply-vars]").sheet;
							}
							else {
								//console.log("open", this);
								this.sheet = this.querySelector("style[simply-vars]").sheet;
							}

							//console.log(this.dom.getRootNode().styleSheets[1].cssRules[0].style.setProperty"--main-bg-color: yellow;";["--data-topAreaHeight"] = "3px");

							var vars = ":host {";
							if (parsedGlobalStyle) {
								for (var key in parsedGlobalStyle.vars) {
									if (!parsedGlobalStyle.vars.hasOwnProperty(key)) continue;
									vars += key + ":" + parsedGlobalStyle.vars[key] + ";";
								}
							}

							for (var key in parsedStyle.vars) {
								if (!parsedStyle.vars.hasOwnProperty(key)) continue;
								vars += key + ":" + parsedStyle.vars[key] + ";";
							}

							this.sheet.insertRule(vars + "}", 0);
						} catch (error) { }

						if (typeof this.lifecycle !== "undefined") {
							if (typeof this.lifecycle.afterFirstRender !== "undefined") {
								setTimeout(() => {
									this.lifecycle.afterFirstRender();
								}, 0);
							}
						}
					}
					else {
						if (typeof this.lifecycle !== "undefined") {
							if (typeof this.lifecycle.beforeRerender !== "undefined") {
								this.lifecycle.beforeRerender();
							}
						}

						let parsedTemplate = simply.parseTemplate(parsingArgs);
						parsedTemplate = parsedTemplate.replace("<html>", "").replace("</html>", "");
						var parsedStyle = simply.parseStyle(parsingArgs);
						var newDom = parsedTemplate + "<style uno></style><style global>" + (parsedGlobalStyle ? parsedGlobalStyle.style : "") + "</style>" + "<style simply>:host([hoak]) {display: none;} " + parsedStyle.style + "</style><style simply-vars></style>";

						if (this.open) {
							var newDomAsString = "<" + name + " open>" + newDom + "</" + name + ">";

							morphIt(this.dom);
						}
						else {
							var newDomAsString = "<" + name + ">" + newDom + "</" + name + ">";
							morphIt(this.dom);
						}

						// console.log(newDomAsString);


						function morphIt(dom) {
							// console.log("morphing");

							simply.morphdom(dom, newDomAsString, {

								childrenOnly: true,
								onBeforeElUpdated: function (fromEl, toEl) {
									// spec - https://dom.spec.whatwg.org/#concept-node-equals							
									if (fromEl.isSameNode(toEl)) {
										return false;
									}
									if (fromEl.isEqualNode(toEl)) {
										return false
									}
									return true
								},
								onBeforeNodeDiscarded: function (node) {
								},
								onBeforeElChildrenUpdated: function (fromEl, toEl) {
									// bu custom element'leri skip etmek için
									// shadowdom olanlara zaten dokunamıyor da
									// shadow'suz custom elementleri her seferinde render ediyor yoksa
									if (customElements.get(fromEl.tagName.toLowerCase())) {
										return false;
									}
									if (fromEl.isSameNode(toEl)) {
										return false;
									}
									if (fromEl.isEqualNode(toEl)) {
										return false
									}
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
										if (toEl.type == 'RADIO' || toEl.type == 'CHECKBOX') {
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
										if (fromEl.isEqualNode(toEl)) {
											return false;
										}
									}
									else if (toEl.tagName === 'OPTION') {
										toEl.selected = fromEl.selected;
									}
									//console.log(toEl.tagName);
								}
							});
						}

						if (this.globalStyle) {
							var parsedGlobalStyle = simply.parseStyle({
								template,
								style: this.globalStyle,
								data: this.data,
								state: this.state,
								parent: this.parent,
								methods: this.methods,
								props: this.props,
								component: this.component,
								dom: this.dom,
								methods: this.methods,
								lifecycle: this.lifecycle,
								watch: this.watch
							});
						}

						if (parsedGlobalStyle) {
							for (var key in parsedGlobalStyle.vars) {
								if (!parsedGlobalStyle.vars.hasOwnProperty(key)) continue;
								this.sheet.cssRules[0].style.setProperty(key, parsedGlobalStyle.vars[key]);
							}
						}
						// test
						for (var key in parsedStyle.vars) {
							if (!parsedStyle.vars.hasOwnProperty(key)) continue;
							this.sheet.cssRules[0].style.setProperty(key, parsedStyle.vars[key]);
						}

						if (typeof this.lifecycle !== "undefined") {
							if (typeof this.lifecycle.afterRerender !== "undefined") {
								setTimeout(() => {
									this.lifecycle.afterRerender();
								}, 0);
							}
						}
					}
					this.rendered = true;
				}
				disconnectedCallback() {
					// console.log("disconnector", this.uid);
					if (this.cb.state) {
						this.cb.state[this.uid] = null;
						// bu biraz yavaşlatıyor diye commentledim
						// Reflect.deleteProperty(this.cb.state, this.uid); // true
					}
					if (this.parent) {
						if (this.parent.cb) {
							if (this.parent.cb.data) {
								this.parent.cb.data[this.uid] = null;
								// bu biraz yavaşlatıyor diye commentledim
								// Reflect.deleteProperty(this.parent.cb.data, this.uid); // true							
							}
							if (this.parent.cb.state) {
								this.parent.cb.state[this.uid] = null;
								// bu biraz yavaşlatıyor diye commentledim
								// Reflect.deleteProperty(this.parent.cb.state, this.uid); // true							
							}
							if (this.parent.cb.props) {
								this.parent.cb.props[this.uid] = null;
								// bu biraz yavaşlatıyor diye commentledim
								// Reflect.deleteProperty(this.parent.cb.props, this.uid); // true							
							}
						}
					}


					if (typeof this.lifecycle !== "undefined") {
						if (typeof this.lifecycle.disconnected !== "undefined") {
							this.lifecycle.disconnected();
						}
					}
				}
			}
			customElements.define(name, simplyComponent);
		}
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
				else {
					let parent = outlet.parentNode; // aka reframer-app component
					element.parent = parent;
					let state = parent.state;
					element.state = state;
					let cb = parent.cb;
					element.cb = cb;
					//console.log(element);
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
						// there is a router and it's living in a REPL ;)
						if (window.frameElement) {
							if (window.frameElement.getAttribute("name") == "result") {
								window.parent.postMessage({
									action: "routerOn"
								}, event);
							}
						}

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

							// console.log(contextWithFullChain);
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

							if (_this6.hooks) {
								if (_this6.hooks.before) {
									var beforeRoute = _this6.hooks.before(_this6, newContext, previousContext);
									if (beforeRoute === false) {
										return callbacks.then(function (amendmentResult) {
											return _this6.__previousContext;
										});
									}
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
							// console.log("after");
							if (this.hooks) {
								if (this.hooks.after) {
									var afterRoute = this.hooks.after(this);
								}
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
			"use strict"; var DOCUMENT_FRAGMENT_NODE = 11;

			function morphAttrs(fromNode, toNode) {
				if (window.customElements.get(fromNode.tagName.toLowerCase())) {
					//return false;
				}


				var toNodeAttrs = toNode.attributes;
				var attr;
				var attrName;
				var attrNamespaceURI;
				var attrValue;
				var fromValue;

				// document-fragments dont have attributes so lets not do anything
				if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
					return;
				}

				// update attributes on original DOM element
				for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
					attr = toNodeAttrs[i];
					attrName = attr.name;
					attrNamespaceURI = attr.namespaceURI;
					attrValue = attr.value;

					if (attrNamespaceURI) {
						attrName = attr.localName || attrName;
						fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

						if (fromValue !== attrValue) {
							if (attr.prefix === 'xmlns') {
								attrName = attr.name; // It's not allowed to set an attribute with the XMLNS namespace without specifying the `xmlns` prefix
							}
							fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
						}
					} else {
						fromValue = fromNode.getAttribute(attrName);

						if (fromValue !== attrValue) {
							fromNode.setAttribute(attrName, attrValue);
						}
					}
				}

				// Remove any extra attributes found on the original DOM element that
				// weren't found on the target element.
				var fromNodeAttrs = fromNode.attributes;

				for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
					attr = fromNodeAttrs[d];
					attrName = attr.name;
					attrNamespaceURI = attr.namespaceURI;

					if (attrNamespaceURI) {
						attrName = attr.localName || attrName;

						if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
							fromNode.removeAttributeNS(attrNamespaceURI, attrName);
						}
					} else {
						if (!toNode.hasAttribute(attrName)) {
							fromNode.removeAttribute(attrName);
						}
					}
				}
			}

			var range; // Create a range object for efficently rendering strings to elements.
			var NS_XHTML = 'http://www.w3.org/1999/xhtml';

			var doc = typeof document === 'undefined' ? undefined : document;
			var HAS_TEMPLATE_SUPPORT = !!doc && 'content' in doc.createElement('template');
			var HAS_RANGE_SUPPORT = !!doc && doc.createRange && 'createContextualFragment' in doc.createRange();

			function createFragmentFromTemplate(str) {
				var template = doc.createElement('template');
				template.innerHTML = str;
				return template.content.childNodes[0];
			}

			function createFragmentFromRange(str) {
				if (!range) {
					range = doc.createRange();
					range.selectNode(doc.body);
				}

				var fragment = range.createContextualFragment(str);
				return fragment.childNodes[0];
			}

			function createFragmentFromWrap(str) {
				var fragment = doc.createElement('body');
				fragment.innerHTML = str;
				return fragment.childNodes[0];
			}

			/**
			 * This is about the same
			 * var html = new DOMParser().parseFromString(str, 'text/html');
			 * return html.body.firstChild;
			 *
			 * @method toElement
			 * @param {String} str
			 */
			function toElement(str) {
				str = str.trim();
				if (HAS_TEMPLATE_SUPPORT) {
					// avoid restrictions on content for things like `<tr><th>Hi</th></tr>` which
					// createContextualFragment doesn't support
					// <template> support not available in IE
					return createFragmentFromTemplate(str);
				} else if (HAS_RANGE_SUPPORT) {
					return createFragmentFromRange(str);
				}

				return createFragmentFromWrap(str);
			}

			/**
			 * Returns true if two node's names are the same.
			 *
			 * NOTE: We don't bother checking `namespaceURI` because you will never find two HTML elements with the same
			 *       nodeName and different namespace URIs.
			 *
			 * @param {Element} a
			 * @param {Element} b The target element
			 * @return {boolean}
			 */
			function compareNodeNames(fromEl, toEl) {
				var fromNodeName = fromEl.nodeName;
				var toNodeName = toEl.nodeName;
				var fromCodeStart, toCodeStart;

				if (fromNodeName === toNodeName) {
					return true;
				}

				fromCodeStart = fromNodeName.charCodeAt(0);
				toCodeStart = toNodeName.charCodeAt(0);

				// If the target element is a virtual DOM node or SVG node then we may
				// need to normalize the tag name before comparing. Normal HTML elements that are
				// in the "http://www.w3.org/1999/xhtml"
				// are converted to upper case
				if (fromCodeStart <= 90 && toCodeStart >= 97) { // from is upper and to is lower
					return fromNodeName === toNodeName.toUpperCase();
				} else if (toCodeStart <= 90 && fromCodeStart >= 97) { // to is upper and from is lower
					return toNodeName === fromNodeName.toUpperCase();
				} else {
					return false;
				}
			}

			/**
			 * Create an element, optionally with a known namespace URI.
			 *
			 * @param {string} name the element name, e.g. 'div' or 'svg'
			 * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
			 * its `xmlns` attribute or its inferred namespace.
			 *
			 * @return {Element}
			 */
			function createElementNS(name, namespaceURI) {
				return !namespaceURI || namespaceURI === NS_XHTML ?
					doc.createElement(name) :
					doc.createElementNS(namespaceURI, name);
			}

			/**
			 * Copies the children of one DOM element to another DOM element
			 */
			function moveChildren(fromEl, toEl) {
				var curChild = fromEl.firstChild;
				while (curChild) {
					var nextChild = curChild.nextSibling;
					toEl.appendChild(curChild);
					curChild = nextChild;
				}
				return toEl;
			}

			function syncBooleanAttrProp(fromEl, toEl, name) {
				if (fromEl[name] !== toEl[name]) {
					fromEl[name] = toEl[name];
					if (fromEl[name]) {
						fromEl.setAttribute(name, '');
					} else {
						fromEl.removeAttribute(name);
					}
				}
			}

			var specialElHandlers = {
				OPTION: function (fromEl, toEl) {
					var parentNode = fromEl.parentNode;
					if (parentNode) {
						var parentName = parentNode.nodeName.toUpperCase();
						if (parentName === 'OPTGROUP') {
							parentNode = parentNode.parentNode;
							parentName = parentNode && parentNode.nodeName.toUpperCase();
						}
						if (parentName === 'SELECT' && !parentNode.hasAttribute('multiple')) {
							if (fromEl.hasAttribute('selected') && !toEl.selected) {
								// Workaround for MS Edge bug where the 'selected' attribute can only be
								// removed if set to a non-empty value:
								// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12087679/
								fromEl.setAttribute('selected', 'selected');
								fromEl.removeAttribute('selected');
							}
							// We have to reset select element's selectedIndex to -1, otherwise setting
							// fromEl.selected using the syncBooleanAttrProp below has no effect.
							// The correct selectedIndex will be set in the SELECT special handler below.
							parentNode.selectedIndex = -1;
						}
					}
					syncBooleanAttrProp(fromEl, toEl, 'selected');
				},
				/**
				 * The "value" attribute is special for the <input> element since it sets
				 * the initial value. Changing the "value" attribute without changing the
				 * "value" property will have no effect since it is only used to the set the
				 * initial value.  Similar for the "checked" attribute, and "disabled".
				 */
				INPUT: function (fromEl, toEl) {
					syncBooleanAttrProp(fromEl, toEl, 'checked');
					syncBooleanAttrProp(fromEl, toEl, 'disabled');

					if (fromEl.value !== toEl.value) {
						fromEl.value = toEl.value;
					}

					if (!toEl.hasAttribute('value')) {
						fromEl.removeAttribute('value');
					}
				},

				TEXTAREA: function (fromEl, toEl) {
					var newValue = toEl.value;
					if (fromEl.value !== newValue) {
						fromEl.value = newValue;
					}

					var firstChild = fromEl.firstChild;
					if (firstChild) {
						// Needed for IE. Apparently IE sets the placeholder as the
						// node value and vise versa. This ignores an empty update.
						var oldValue = firstChild.nodeValue;

						if (oldValue == newValue || (!newValue && oldValue == fromEl.placeholder)) {
							return;
						}

						firstChild.nodeValue = newValue;
					}
				},
				SELECT: function (fromEl, toEl) {
					if (!toEl.hasAttribute('multiple')) {
						var selectedIndex = -1;
						var i = 0;
						// We have to loop through children of fromEl, not toEl since nodes can be moved
						// from toEl to fromEl directly when morphing.
						// At the time this special handler is invoked, all children have already been morphed
						// and appended to / removed from fromEl, so using fromEl here is safe and correct.
						var curChild = fromEl.firstChild;
						var optgroup;
						var nodeName;
						while (curChild) {
							nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
							if (nodeName === 'OPTGROUP') {
								optgroup = curChild;
								curChild = optgroup.firstChild;
							} else {
								if (nodeName === 'OPTION') {
									if (curChild.hasAttribute('selected')) {
										selectedIndex = i;
										break;
									}
									i++;
								}
								curChild = curChild.nextSibling;
								if (!curChild && optgroup) {
									curChild = optgroup.nextSibling;
									optgroup = null;
								}
							}
						}

						fromEl.selectedIndex = selectedIndex;
					}
				}
			};

			var ELEMENT_NODE = 1;
			var DOCUMENT_FRAGMENT_NODE$1 = 11;
			var TEXT_NODE = 3;
			var COMMENT_NODE = 8;

			function noop() { }

			function defaultGetNodeKey(node) {
				if (node) {
					return (node.getAttribute && node.getAttribute('id')) || node.id;
				}
			}

			function morphdomFactory(morphAttrs) {

				return function morphdom(fromNode, toNode, options) {
					if (!options) {
						options = {};
					}

					if (typeof toNode === 'string') {
						if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML' || fromNode.nodeName === 'BODY') {
							var toNodeHtml = toNode;
							toNode = doc.createElement('html');
							toNode.innerHTML = toNodeHtml;
						} else {
							toNode = toElement(toNode);
						}
					} else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
						toNode = toNode.firstElementChild;
					}

					var getNodeKey = options.getNodeKey || defaultGetNodeKey;
					var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
					var onNodeAdded = options.onNodeAdded || noop;
					var onBeforeElUpdated = options.onBeforeElUpdated || noop;
					var onElUpdated = options.onElUpdated || noop;
					var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
					var onNodeDiscarded = options.onNodeDiscarded || noop;
					var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
					var skipFromChildren = options.skipFromChildren || noop;
					var addChild = options.addChild || function (parent, child) { return parent.appendChild(child); };
					var childrenOnly = options.childrenOnly === true;

					// This object is used as a lookup to quickly find all keyed elements in the original DOM tree.
					var fromNodesLookup = Object.create(null);
					var keyedRemovalList = [];

					function addKeyedRemoval(key) {
						keyedRemovalList.push(key);
					}

					function walkDiscardedChildNodes(node, skipKeyedNodes) {
						if (node.nodeType === ELEMENT_NODE) {
							var curChild = node.firstChild;
							while (curChild) {

								var key = undefined;

								if (skipKeyedNodes && (key = getNodeKey(curChild))) {
									// If we are skipping keyed nodes then we add the key
									// to a list so that it can be handled at the very end.
									addKeyedRemoval(key);
								} else {
									// Only report the node as discarded if it is not keyed. We do this because
									// at the end we loop through all keyed elements that were unmatched
									// and then discard them in one final pass.
									onNodeDiscarded(curChild);
									if (curChild.firstChild) {
										walkDiscardedChildNodes(curChild, skipKeyedNodes);
									}
								}

								curChild = curChild.nextSibling;
							}
						}
					}

					/**
					* Removes a DOM node out of the original DOM
					*
					* @param  {Node} node The node to remove
					* @param  {Node} parentNode The nodes parent
					* @param  {Boolean} skipKeyedNodes If true then elements with keys will be skipped and not discarded.
					* @return {undefined}
					*/
					function removeNode(node, parentNode, skipKeyedNodes) {
						if (onBeforeNodeDiscarded(node) === false) {
							return;
						}

						if (parentNode) {
							parentNode.removeChild(node);
						}

						onNodeDiscarded(node);
						walkDiscardedChildNodes(node, skipKeyedNodes);
					}

					// // TreeWalker implementation is no faster, but keeping this around in case this changes in the future
					// function indexTree(root) {
					//     var treeWalker = document.createTreeWalker(
					//         root,
					//         NodeFilter.SHOW_ELEMENT);
					//
					//     var el;
					//     while((el = treeWalker.nextNode())) {
					//         var key = getNodeKey(el);
					//         if (key) {
					//             fromNodesLookup[key] = el;
					//         }
					//     }
					// }

					// // NodeIterator implementation is no faster, but keeping this around in case this changes in the future
					//
					// function indexTree(node) {
					//     var nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
					//     var el;
					//     while((el = nodeIterator.nextNode())) {
					//         var key = getNodeKey(el);
					//         if (key) {
					//             fromNodesLookup[key] = el;
					//         }
					//     }
					// }

					function indexTree(node) {
						if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
							var curChild = node.firstChild;
							while (curChild) {
								var key = getNodeKey(curChild);
								if (key) {
									fromNodesLookup[key] = curChild;
								}

								// Walk recursively
								indexTree(curChild);

								curChild = curChild.nextSibling;
							}
						}
					}

					indexTree(fromNode);

					function handleNodeAdded(el) {
						onNodeAdded(el);

						var curChild = el.firstChild;
						while (curChild) {
							var nextSibling = curChild.nextSibling;

							var key = getNodeKey(curChild);
							if (key) {
								var unmatchedFromEl = fromNodesLookup[key];
								// if we find a duplicate #id node in cache, replace `el` with cache value
								// and morph it to the child node.
								if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
									curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
									morphEl(unmatchedFromEl, curChild);
								} else {
									handleNodeAdded(curChild);
								}
							} else {
								// recursively call for curChild and it's children to see if we find something in
								// fromNodesLookup
								handleNodeAdded(curChild);
							}

							curChild = nextSibling;
						}
					}

					function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
						// We have processed all of the "to nodes". If curFromNodeChild is
						// non-null then we still have some from nodes left over that need
						// to be removed
						while (curFromNodeChild) {
							var fromNextSibling = curFromNodeChild.nextSibling;
							if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {
								// Since the node is keyed it might be matched up later so we defer
								// the actual removal to later
								addKeyedRemoval(curFromNodeKey);
							} else {
								// NOTE: we skip nested keyed nodes from being removed since there is
								//       still a chance they will be matched up later
								removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
							}
							curFromNodeChild = fromNextSibling;
						}
					}

					function morphEl(fromEl, toEl, childrenOnly) {
						var toElKey = getNodeKey(toEl);

						if (toElKey) {
							// If an element with an ID is being morphed then it will be in the final
							// DOM so clear it out of the saved elements collection
							delete fromNodesLookup[toElKey];
						}

						if (!childrenOnly) {
							// optional
							if (onBeforeElUpdated(fromEl, toEl) === false) {
								return;
							}

							// update attributes on original DOM element first
							morphAttrs(fromEl, toEl);
							// optional
							onElUpdated(fromEl);

							if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
								return;
							}
						}

						if (fromEl.nodeName !== 'TEXTAREA') {
							morphChildren(fromEl, toEl);
						} else {
							specialElHandlers.TEXTAREA(fromEl, toEl);
						}
					}

					function morphChildren(fromEl, toEl) {
						var skipFrom = skipFromChildren(fromEl, toEl);
						var curToNodeChild = toEl.firstChild;
						var curFromNodeChild = fromEl.firstChild;
						var curToNodeKey;
						var curFromNodeKey;

						var fromNextSibling;
						var toNextSibling;
						var matchingFromEl;

						// walk the children
						outer: while (curToNodeChild) {
							toNextSibling = curToNodeChild.nextSibling;
							curToNodeKey = getNodeKey(curToNodeChild);

							// walk the fromNode children all the way through
							while (!skipFrom && curFromNodeChild) {
								fromNextSibling = curFromNodeChild.nextSibling;

								if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
									curToNodeChild = toNextSibling;
									curFromNodeChild = fromNextSibling;
									continue outer;
								}

								curFromNodeKey = getNodeKey(curFromNodeChild);

								var curFromNodeType = curFromNodeChild.nodeType;

								// this means if the curFromNodeChild doesnt have a match with the curToNodeChild
								var isCompatible = undefined;

								if (curFromNodeType === curToNodeChild.nodeType) {
									if (curFromNodeType === ELEMENT_NODE) {
										// Both nodes being compared are Element nodes

										if (curToNodeKey) {
											// The target node has a key so we want to match it up with the correct element
											// in the original DOM tree
											if (curToNodeKey !== curFromNodeKey) {
												// The current element in the original DOM tree does not have a matching key so
												// let's check our lookup to see if there is a matching element in the original
												// DOM tree
												if ((matchingFromEl = fromNodesLookup[curToNodeKey])) {
													if (fromNextSibling === matchingFromEl) {
														// Special case for single element removals. To avoid removing the original
														// DOM node out of the tree (since that can break CSS transitions, etc.),
														// we will instead discard the current node and wait until the next
														// iteration to properly match up the keyed target element with its matching
														// element in the original tree
														isCompatible = false;
													} else {
														// We found a matching keyed element somewhere in the original DOM tree.
														// Let's move the original DOM node into the current position and morph
														// it.

														// NOTE: We use insertBefore instead of replaceChild because we want to go through
														// the `removeNode()` function for the node that is being discarded so that
														// all lifecycle hooks are correctly invoked
														fromEl.insertBefore(matchingFromEl, curFromNodeChild);

														// fromNextSibling = curFromNodeChild.nextSibling;

														if (curFromNodeKey) {
															// Since the node is keyed it might be matched up later so we defer
															// the actual removal to later
															addKeyedRemoval(curFromNodeKey);
														} else {
															// NOTE: we skip nested keyed nodes from being removed since there is
															//       still a chance they will be matched up later
															removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
														}

														curFromNodeChild = matchingFromEl;
														curFromNodeKey = getNodeKey(curFromNodeChild);
													}
												} else {
													// The nodes are not compatible since the "to" node has a key and there
													// is no matching keyed node in the source tree
													isCompatible = false;
												}
											}
										} else if (curFromNodeKey) {
											// The original has a key
											isCompatible = false;
										}

										isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
										if (isCompatible) {
											// We found compatible DOM elements so transform
											// the current "from" node to match the current
											// target DOM node.
											// MORPH
											morphEl(curFromNodeChild, curToNodeChild);
										}

									} else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
										// Both nodes being compared are Text or Comment nodes
										isCompatible = true;
										// Simply update nodeValue on the original node to
										// change the text value
										if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
											curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
										}

									}
								}

								if (isCompatible) {
									// Advance both the "to" child and the "from" child since we found a match
									// Nothing else to do as we already recursively called morphChildren above
									curToNodeChild = toNextSibling;
									curFromNodeChild = fromNextSibling;
									continue outer;
								}

								// No compatible match so remove the old node from the DOM and continue trying to find a
								// match in the original DOM. However, we only do this if the from node is not keyed
								// since it is possible that a keyed node might match up with a node somewhere else in the
								// target tree and we don't want to discard it just yet since it still might find a
								// home in the final DOM tree. After everything is done we will remove any keyed nodes
								// that didn't find a home
								if (curFromNodeKey) {
									// Since the node is keyed it might be matched up later so we defer
									// the actual removal to later
									addKeyedRemoval(curFromNodeKey);
								} else {
									// NOTE: we skip nested keyed nodes from being removed since there is
									//       still a chance they will be matched up later
									removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
								}

								curFromNodeChild = fromNextSibling;
							} // END: while(curFromNodeChild) {}

							// If we got this far then we did not find a candidate match for
							// our "to node" and we exhausted all of the children "from"
							// nodes. Therefore, we will just append the current "to" node
							// to the end
							if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
								// MORPH
								if (!skipFrom) { addChild(fromEl, matchingFromEl); }
								morphEl(matchingFromEl, curToNodeChild);
							} else {
								var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
								if (onBeforeNodeAddedResult !== false) {
									if (onBeforeNodeAddedResult) {
										curToNodeChild = onBeforeNodeAddedResult;
									}

									if (curToNodeChild.actualize) {
										curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
									}
									addChild(fromEl, curToNodeChild);
									handleNodeAdded(curToNodeChild);
								}
							}

							curToNodeChild = toNextSibling;
							curFromNodeChild = fromNextSibling;
						}

						cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);

						var specialElHandler = specialElHandlers[fromEl.nodeName];
						if (specialElHandler) {
							specialElHandler(fromEl, toEl);
						}
					} // END: morphChildren(...)

					var morphedNode = fromNode;
					var morphedNodeType = morphedNode.nodeType;
					var toNodeType = toNode.nodeType;

					if (!childrenOnly) {
						// Handle the case where we are given two DOM nodes that are not
						// compatible (e.g. <div> --> <span> or <div> --> TEXT)
						if (morphedNodeType === ELEMENT_NODE) {
							if (toNodeType === ELEMENT_NODE) {
								if (!compareNodeNames(fromNode, toNode)) {
									onNodeDiscarded(fromNode);
									morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
								}
							} else {
								// Going from an element node to a text node
								morphedNode = toNode;
							}
						} else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
							if (toNodeType === morphedNodeType) {
								if (morphedNode.nodeValue !== toNode.nodeValue) {
									morphedNode.nodeValue = toNode.nodeValue;
								}

								return morphedNode;
							} else {
								// Text node to something else
								morphedNode = toNode;
							}
						}
					}

					if (morphedNode === toNode) {
						// The "to node" was not compatible with the "from node" so we had to
						// toss out the "from node" and use the "to node"
						onNodeDiscarded(fromNode);
					} else {
						if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
							return;
						}

						morphEl(morphedNode, toNode, childrenOnly);

						// We now need to loop over any keyed nodes that might need to be
						// removed. We only do the removal if we know that the keyed node
						// never found a match. When a keyed node is matched up we remove
						// it out of fromNodesLookup and we use fromNodesLookup to determine
						// if a keyed node has been matched up or not
						if (keyedRemovalList) {
							for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
								var elToRemove = fromNodesLookup[keyedRemovalList[i]];
								if (elToRemove) {
									removeNode(elToRemove, elToRemove.parentNode, false);
								}
							}
						}
					}

					if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
						if (morphedNode.actualize) {
							morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
						}
						// If we had to swap out the from node with a new node because the old
						// node was not compatible with the target node then we need to
						// replace the old DOM node in the original DOM tree. This is only
						// possible if the original DOM node was part of a DOM tree which
						// we know is the case if it has a parent node.
						fromNode.parentNode.replaceChild(morphedNode, fromNode);
					}

					return morphedNode;
				};
			}

			var morphdom = morphdomFactory(morphAttrs);

			simply.morphdom = morphdom;
		})();
	},
	setupInlineComps: function (dom, docStr, tmpl) {
		simply.gets = simply.gets ? simply.gets : [];
		let simplyTemplates = dom.querySelectorAll("template[simply]");
		if (simplyTemplates) {
			simplyTemplates.forEach(element => {
				let string;
				let comp = element.parentElement;
				let tag = comp.tagName.toLowerCase();
				let regexstr = "get\(.*" + tag + ".*\)";
				let regex = new RegExp(regexstr, "i");
				var allGets = /^\s*get\(.*\)/gm
				let tempContent;

				// home/root/index.html/result home
				if (!docStr) {
					// for REPL
					if (window.name == "result") {
						tempContent = window.frameElement.contentWindow.dataContent;
						string = tempContent;
						// console.log({ tempContent });
						//var match = tempContent.match(regex);
					}
					// normal
					else {
						tempContent = dom.querySelector("body").innerHTML;
						//var match = tempContent.match(regex);
					}
				}
				// from inside a template
				else {
					//var match = docStr.match(regex);
					tempContent = docStr;
					string = docStr;
				}

				// push all gets to a global var to check below if block
				while ((m = allGets.exec(tempContent)) !== null) {
					simply.gets.push(m[0]);
				}
				let check = simply.gets.filter(e => e.includes(tag)); // true
				// console.log(simply.gets[1], check.length, tag);

				// is there a get for it in the array
				// or is it registered already
				if (check.length == 0 && !customElements.get(tag.toLowerCase())) {
					// console.log("get yok ya da register edilmemiş", tag);
					// for root (index.html etc)
					// get raw content because innerhtml broke some simply tags
					// for ex each or if in <select> tag
					if (!string) {
						var request = new XMLHttpRequest();
						console.log(window.document.location.href);
						request.open('GET', window.document.location.href, false);
						request.onload = function () {
							if (this.status >= 200 && this.status < 400) {
								string = this.responseText;
								//console.log({ string });
							}
						};
						request.send();
					}

					// parse it and register
					let inlineComp = simply.getBetweenTag({
						"string": string,
						"tag": tag
					});

					let parsed = simply.splitComponent(inlineComp);

					simply.registerComponent({
						name: tag, //module.default.name,
						template: parsed.template,
						styles: parsed.styles,
						script: parsed.script,
						docStr: string,
						noFile: true
					});
				}
				else {
					// console.log("get var ya da register edilmiş", comp.tagName);
				}
			});
		}
	},
	findShadowRootOrCustomElement: function (element) {
		let parent = element.parentNode;

		while (parent !== null) {
			// Check if the parent is a shadow root
			if (parent instanceof ShadowRoot) {
				// console.log("Found shadow root:", parent);
				return parent.host;
			}
			// Check if the parent is a custom element
			// console.log(parent.tagName, customElements.get(parent.tagName));
			if (parent.tagName) {
				if (parent.tagName.includes('-') && customElements.get(parent.tagName.toLowerCase()) !== undefined) {
					// console.log("Found custom element:", parent);
					return parent;
				}
			}
			else {
				//console.log("hi doc", parent);
				return undefined
			}

			// Move to the next parent
			parent = parent.parentNode;
		}

		// If no shadow root or custom element is found
		// console.log("No shadow root or custom element found.");
		return null;
	},
	init: function () {
		this.Router();
		this.morphdom();
		window.get = this.get;
		document.onreadystatechange = function () {
			if (document.readyState == "complete") {
				simply.setupInlineComps(document);
			}
		}

	}
}
simply.init();