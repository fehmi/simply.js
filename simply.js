simply = {
	components: {},
	parseTemplate: function (parsingArgs) {

		var { template, data, style, state, parent, methods, props, component, dom, methods, lifecycle, watch } = parsingArgs;

		let simplyTemplate = /\<template([^<>]*)simply([^<>]*)>$/;

		// condititionals
		let ifStart = /\<if(\s)cond=\"(.*)\"(\>$)/;
		let elsifStart = /\<elsif(\s)cond=\"(.*)\"(\>$)/;

		let ifEnd = /\<\/if\>$/;
		let elsifEnd = /\<\/elsif\>$/;
		let elseStart = /\<else\>$/;
		let elseEnd = /\<\/else\>$/;
		let eachEnd = /\<\/each\>$/;

		const MAX_LENGTH = 150;

		// each https://regex101.com/r/yi5jzG/1
		// https://regex101.com/r/gvHgOc/1
		let eachStart = /\<each\s+of\=\"(?<of>[^"]*)\"\s+as\=\"(?<as>[^"]*)\"(\s+key\=\"(?<key>[^"]*)\")?(\s+index\=\"(?<index>[^"]*)\")?\>$/gm;


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

		if (template.includes('${')) {
			template = template.replace(/\$\{/g, 'minyeli{');
		}

		for (var i = 0; i < template.length; i++) {
			processedLetters += template[i];
			bucket += template[i];
			let recentBucket = bucket.slice(-MAX_LENGTH); // Get the last MAX_LENGTH characters
			let recentBucket2 = bucket.slice(-8); // Get the last MAX_LENGTH characters

			/* 1ms */
			if (bucket.endsWith("<script")) {
				scriptCount += 1;
			}
			else if (bucket.endsWith("<style")) {
				styleCount += 1;
			}
			else if (bucket.endsWith("<template simply>")) {
				//bucket += "<!--";
				//processedLetters += "<!--";
				simplyTemplateCount += 1;
			}
			// else if (bucket.substr(-"<template>".length) === "<template>") {
			// 	templateCount += 1;
			// }
			else if (bucket.endsWith("</script>")) {
				scriptCount -= 1;
			}
			else if (bucket.endsWith("</style>")) {
				styleCount -= 1;
			}
			// inline template skip
			// we will look when construct
			else if (bucket.endsWith("</template>")) {
				simplyTemplateCount -= 1;
				//bucket = bucket.replace(/<\/template>$/, "--></template>");
				//processedLetters = processedLetters.replace(/<\/template>$/, "--></template>");
			}
			/* / 1ms */

			if (simplyTemplateCount == 0 && styleCount == 0 && scriptCount == 0) {
				// attribute içindeki fonksyion ise skip
				if (bucket.endsWith('="function') || bucket.endsWith('="(function')) {
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
					/* 3ms */
					//try {
					//	if (typeof JSON.parse("{" + variable.replace(/[^\\]'/g, '"').replace(/\\'/g, "'") + "}") == "object") {
					//		variable = "\"" + varBucket.trim() + "\"";
					//	}
					//} catch (error) {
					//
					//}
					/* / 3ms */

					// 1ms Simple check for object-like patterns
					function isObjectString(str) {
						return /^\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))+\}))*\}$/.exec(str);
					}

					if (isObjectString(variable)) {
						variable = "\"" + varBucket.trim() + "\"";
					}

					logic = "ht+=" + variable + ";";
					flag = true;
				}
				else if ((m = inTagVar.exec(recentBucket)) !== null) {
					logic = "ht+=" + m.groups.l + ";";
					flag = true;
				}
				if (recentBucket.endsWith(">")) {
					if (recentBucket.includes('<if ') && (m = ifStart.exec(recentBucket)) !== null) {
						logic = unescape("if (" + m[2] + ") {");
						//logic = (ifCount == 0 ? 'let ht = "";' + logic : logic);
						ifCount += 1;
						flag = true;
					}
					else if (recentBucket.includes('<elsif ') && (m = elsifStart.exec(recentBucket)) !== null) {
						logic = unescape(m[2]); // bu niye 3 tü
						logic = "else if (" + logic + ") {";
						flag = true;
					}
					else if ((m = elseStart.exec(recentBucket2)) !== null) {
						logic = "else {";
						flag = true;

					}
					else if ((m = ifEnd.exec(recentBucket2)) !== null) {
						ifCount -= 1;
						logic = "}";
						flag = true;
					}
					else if ((m = elsifEnd.exec(recentBucket2)) !== null) {
						logic = "}";
						flag = true;
					}
					else if ((m = elseEnd.exec(recentBucket2)) !== null) {
						logic = "}";
						flag = true;
					}
					else if (recentBucket.includes("<each")) {
						m = recentBucket.match(/\<each[^\>]*\>$/)
						m.groups = parseEachTag(m[0]);



						// console.log(m);
						// if (eachCount > 0) {} //each içinde each
						eachCount += 1;
						try {
							subject = eval(m.groups.of);
						} catch (error) {
							//console.log(lastM + "." + m.groups.of);
							subject = m.groups.of;
						}

						var iiii = "s" + Math.random().toString(16).slice(2);
						//var iiii = "s" + Math.random().toString(2).slice(-7);

						if (Array.isArray(subject)) {
							key = m.groups.key ? "let " + m.groups.key + " = " + iiii + ";" : "";
							index = m.groups.index ? "let " + m.groups.index + " = " + iiii + ";" : "";

							logic = "for (" + iiii + " = 0; " + iiii + " < " + m.groups.of + ".length; " + iiii + "++) { \
								if (!"+ m.groups.of + "[" + iiii + "]) { continue; }\
														" + key + " \
														" + index + " \
														let " + m.groups.as + "=" + m.groups.of + "[" + iiii + "];";
						}
						else {
							key = m.groups.index ? "let " + m.groups.index + " = " : "";

							// obaa objelerini exclude et
							// '__o_' || ii == '__c_' || ii == '__p_'
							logic = "\
												for (var ii in "+ m.groups.of + ") { \
													if (typeof "+ m.groups.of + "[ii] == 'function') { continue; }\
													" + key + "Object.keys(" + m.groups.of + ").indexOf(ii); \
													let " + m.groups.key + "= ii; \
													let " + m.groups.as + "=" + m.groups.of + "[ii];";
						}
						flag = true;
						lastM = m.groups.of;
						lasti = iiii;

					}

					else if ((m = eachEnd.exec(recentBucket2)) !== null) {
						eachCount -= 1;
						logic = "};";
						flag = true;
					}
				}

			}
			function parseEachTag(eachTag) {
				let ofMatch = eachTag.match(/of="([^"]+)"/);
				let asMatch = eachTag.match(/as="([^"]+)"/);
				let keyMatch = eachTag.match(/key="([^"]+)"/);
				let indexMatch = eachTag.match(/index="([^"]+)"/);

				let of = ofMatch ? ofMatch[1] : undefined;
				let as = asMatch ? asMatch[1] : undefined;

				// Create the result object and conditionally add key and index if they exist
				let result = { of, as };
				if (keyMatch) result.key = keyMatch[1];
				if (indexMatch) result.index = indexMatch[1];

				return result;
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

				return "//" + compName + "\n\nnew " + clss.trim() + "//@ sourceURL=" + compName + ".html";
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
					this.dom = dom;
					this.lifecycle = lifecycle;

					this.propsToObserve = props;

					this.dataToObserve = data;
					this.data;

					this.methods = methods;
					this.watch = watch;
					this.parent = parent;
					this.uid = uid;
					this.open = open;
					this.cb = cb;

					var self = this;

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
							self.propsToObserve[attrib.name] = simply.parseProp(attrib.value).value;
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
									this.stateToObserve = current.state;
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
							this.stateToObserve = {};
						}
						var newStates = this.sfcClass.state;
						for (let key in newStates) {
							this.stateToObserve[key] = newStates[key];
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

					this.setState = function (newValue) {
						state = newValue;
					};
					this.setCbState = function (newValue) {
						cb.state = newValue;
					};

					this.setProps = function (newValue) {
						props = newValue;
					};
					this.setCbProps = function (newValue) {
						cb.props = newValue;
					};

					this.react = function (property, newValue, previousValue, prop = false) {
						// console.log("react to ", property, previousValue, newValue, templateName);

						if (self.data) {
							if (typeof self.lifecycle !== "undefined") {
								if (prop) {
									if (typeof self.lifecycle.whenPropChange !== "undefined") {
										if (self.lifecycle.whenPropChange(property, newValue, previousValue) === false) {
											return false;
										};
									}
								}
								else if (typeof self.lifecycle.whenDataChange !== "undefined") {
									//console.log(self.lifecycle.whenDataChange(name, value, old, parents));
									if (self.lifecycle.whenDataChange(property, newValue, previousValue) === false) {
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
								self.watch(property, newValue);
							}
							self.render();
						}

					}




					if (this.dataToObserve) {
						this.data = ObservableSlim.create(this.dataToObserve, .1, function (changes) {
							for (const [key, cb] of Object.entries(self.cb.data)) {
								if (cb) {
									// console.log(key, cb);
									// console.log(changes);
									cb(changes[0].property);
									changes.forEach(function (change, key) {
										// cb(change.property, change.newValue, change.previousValue);
									})
								}
							}
						});

						if (template.indexOf("data.") > -1 || script.indexOf("data.") > -1) {
							this.cb.data = {}
							this.cb.data[this.uid] = function (property, newValue, previousValue) { self.react(property, newValue, previousValue) };
							data = this.data;
							this.setCbData(this.cb.data);
						}
					}


					if (this.propsToObserve) {
						this.props = ObservableSlim.create(this.propsToObserve, false, function (changes) {
							if (self.cb.props) {
								for (const [key, cb] of Object.entries(self.cb.props)) {
									if (cb) {
										changes.forEach(function (change, key) {
											cb(change.property, change.newValue, change.previousValue);
										})
									}
								}
							}

						});

						if (template.indexOf("props.") > -1 || script.indexOf("props.") > -1) {
							this.cb.props = {}
							this.cb.props[this.uid] = function (property, newValue, previousValue) { self.react(property, newValue, previousValue) };
						}
					}

					if (this.stateToObserve) {
						if (!this.stateToObserve.__isProxy) {

							this.state = ObservableSlim.create(this.stateToObserve, false, function (changes) {
								// console.log(changes, templateName);
								if (self.cb.state) {
									for (const [key, cb] of Object.entries(self.cb.state)) {
										if (cb) {
											changes.forEach(function (change, key) {
												cb(change.property, change.newValue, change.previousValue);
											})
										}
										//console.log(`${key}: ${value}`);
									}
								}
							});
							this.cb.state = {}
							this.cb.state[this.uid] = function (property, newValue, previousValue) { self.react(property, newValue, previousValue) };
							//this.setCbState(this.cb.state);
							//console.log("bu bi kere çalışır");
							// this.state = new Proxy(this.state, handler);

						}
						else {
							this.state = this.stateToObserve; // bu daha hızlıdır muhtemelen
							// this.state = simply.findParentWithState(this).state;
							if (template.indexOf("state.") > -1 || script.indexOf("state.") > -1) {
								var p = findElementWithCB(this.parent);
								// console.log("ppp", p, this.parent, templateName);
								p.cb.state[this.uid] = function (property, newValue, previousValue) { self.react(property, newValue, previousValue) };
								// this.state = new Proxy(this.state, handler);
							}
						}
						// console.log(template.indexOf("state.") > -1, script.indexOf("state.") > -1, name);
					}

					function findElementWithCB(element) {
						let current = element;

						while (current) {
							if (current.cb) {
								if (current.cb.state) {
									return current;
								}
							}

							// Move up to the parent node, checking if we're in a shadow DOM
							if (current.parentNode) {
								current = current.parentNode;
							} else if (current.host) {
								current = current.host; // Move to the host of the shadow root
							} else {
								current = null;
							}
						}

						return null; // No element with `cb` found
					}


					// after construct event
					if (typeof this.lifecycle !== "undefined") {
						if (typeof this.lifecycle.afterConstruct !== "undefined") {
							this.lifecycle.afterConstruct();
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
								// console.log(mutation.attributeName, "attribute changed to", newVal, callback);
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
				onBeforeEnter(location, commands, router) {
					//console.log("on before",location, commands, router);
					//return commands.prevent();
				}
				connectedCallback() {
					this.observeAttrChange(this, function (name, newValue) {
						//console.log("hee");
						// value öncekiyle aynı değilse
						// console.log(name, newValue, self.props[name], newValue == simply.prepareAttr(self.props[name]));
						if (newValue !== simply.prepareAttr(self.props[name])) {
							try {
								newValue = simply.parseProp(newValue).value;
							} catch (e) {
								// getattribute parse edemezse
								newValue = newValue;
							}

							if (newValue) {
								self.props[name] = newValue;
							}
							else {
								delete self.props[name];
							}

							if (typeof self.lifecycle !== "undefined") {
								if (typeof self.lifecycle.whenPropChange !== "undefined") {
									//console.log("propchange");
									self.lifecycle.whenPropChange(name, self.props[name], newValue);
								}
							}


						}
					});

					var self = this;
					self.templateName = name;

					// parent değişkenleri değişince
					// velet de tepki versin diye

					/*
					if (this.parent) {
						console.log(this.parent);
						if (this.parent.data) {
							if (this.parent.cb) {
								if (this.parent.cb.data) {

									this.parent.cb.data[this.uid] = function (prop, value) { self.react(prop, value) };
									this.parent.setData = this.parent.data;
								}
							}

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
						this.rendered = true;
						var self = this;
						let parsedTemplate = simply.parseTemplate(parsingArgs);
						var parsedStyle = simply.parseStyle(parsingArgs);
						parsedTemplate = parsedTemplate + "<style uno></style><style global>" + (parsedGlobalStyle ? parsedGlobalStyle.style : "") + "</style>" + "<style simply>:host([hoak]) {display: none;} " + parsedStyle.style + "</style><style simply-vars></style>";



						if (typeof this.lifecycle !== "undefined") {
							if (typeof this.lifecycle.beforeRender !== "undefined") {
								if (typeof this.lifecycle.beforeRender(parsedTemplate) !== "undefined") {
									parsedTemplate = this.lifecycle.beforeRender(parsedTemplate);
								}
							}
						}
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
								this.lifecycle.afterFirstRender();
							}
						}

					}
					else {
						if (typeof this.lifecycle !== "undefined") {
							if (typeof this.lifecycle.beforeRerender !== "undefined") {
								this.lifecycle.beforeRerender();
							}
						}


						// var ddd = this.data;
						// parsingArgs.data = JSON.parse(JSON.stringify(ddd));
						const t0 = performance.now();
						/*
						try {
							console.log(parsingArgs.data.browser.length);
						}
						catch(e) {

						}
						*/
						let parsedTemplate = simply.parseTemplate(parsingArgs);
						const t1 = performance.now();
						// console.log(`parseTemplate took ${t1 - t0} milliseconds.`);
						/*
						if (parsedTemplate.indexOf('level="1"') == -1 && name == "browser-comp") {
							console.log("yakalarım hatayı");
							console.log(JSON.stringify(this.data.browser));
							console.log(parsedTemplate);
						}
						*/
						parsedTemplate = parsedTemplate.replace("<html>", "").replace("</html>", "");
						var parsedStyle = simply.parseStyle(parsingArgs);
						var newDom = parsedTemplate + "<style uno></style><style global>" + (parsedGlobalStyle ? parsedGlobalStyle.style : "") + "</style>" + "<style simply>:host([hoak]) {display: none;} " + parsedStyle.style + "</style><style simply-vars></style>";
						//console.log("morfingen");
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
							//console.log("morphing");

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
								this.lifecycle.afterRerender();
							}
						}
					}
					if (typeof this.lifecycle !== "undefined") {
						if (typeof this.lifecycle.afterRender !== "undefined") {
							this.lifecycle.afterRender();

						}
					}

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
								// this.parent.cb.data[this.uid] = null;
								// bu biraz yavaşlatıyor diye commentledim
								// Reflect.deleteProperty(this.parent.cb.data, this.uid); // true							
							}
							if (this.parent.cb.state) {
								this.parent.cb.state[this.uid] = null;
								// bu biraz yavaşlatıyor diye commentledim
								// Reflect.deleteProperty(this.parent.cb.state, this.uid); // true							
							}
							if (this.parent.cb.props) {
								// this.parent.cb.props[this.uid] = null;
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
	setWithoutRender: function (target, props) {
		Object.defineProperties(target, Object.keys(props).reduce((descriptors, key) => {
			descriptors[key] = {
				value: props[key],
				writable: true,
				enumerable: true,
				configurable: true
			};
			return descriptors;
		}, {}));
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
	wcRouter: function () {
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
					newRoute.prev = document.location.pathname;
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
				static async changeUrl(onpopstate = false) {
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
					await RouterElement.dispatch(newUrl, true, onpopstate);
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
				static async dispatch(url, skipHistory, onpopstate = false) {
					const basePath = RouterElement.baseUrlSansHost();
					const shortUrl = url.substr(basePath.length);
					RouterElement._route = {
						url: shortUrl,
						// simply.js edit, add if onpopstate or not info
						onpopstate: onpopstate
					};

					// simply.js edit, prevent two times firing at init
					RouterElement._activeRouters = RouterElement._activeRouters.filter((value, index, self) => {
						// Filter out duplicate routes based on URL or any other unique identifier
						return index === self.findIndex(r => r.route.baseUrl === value.route.baseUrl && r.route.lastMatch.url === value.route.lastMatch.url);
					});

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
					// simply.js edit
					// i need to update url before rendering component
					// because i need updated url in afterConstruct event
					// console.log(url, shortUrl);
					if (!skipHistory) {
						RouterElement.updateHistory(url); // i extract this line from the next if
					}
					if ((await RouterElement.performMatchOnRouters(shortUrl, RouterElement._routers)) && skipHistory !== true) {
						RouterElement.updateAnchorsStatus();
					}
				}

				/** Updates the location history with the new href */
				static updateHistory(href) {

					/*
					const urlState = RouterElement.getUrlState();
					let url = urlState;

					if (url.length === 2) {
						url = href;
					} else if (url === '/') {
						url = document.baseURI;
					} else {
						url = document.baseURI + url;
					}
					*/
					// simply.js edit: above commented, below added
					let url = href;

					// Need to use a full URL in case the containing page has a base URI.
					const fullNewUrl = new URL(url, `${window.location.protocol}//${window.location.host}`).href;
					//const oldRoute = RouterElement._route;
					//const now = window.performance.now();
					//const shouldReplace = oldRoute._lastChangedAt + RouterElement._dwellTime > now;
					//oldRoute._lastChangedAt = now;
					//if (shouldReplace) {
					//	window.history.replaceState(window.history.state, '', fullNewUrl);
					//} else {
					window.history.pushState(window.history.state, '', fullNewUrl);
					//}
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

						window.addEventListener('popstate', (event) => {
							RouterElement.changeUrl(true);
						}, false);

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
						const outletElement = this.getOutletElement();

						// simply.js
						// state, parent, and callback support for simply.js						

						// Function to set content properties and render
						async function setContentAndRender(content) {
							const findParentWithState = (element) => {
								let parent = element.parentElement;
								while (parent) {
									// If the parent is within a shadow DOM, get the host element
									const rootNode = parent.getRootNode ? parent.getRootNode().host : null;
									// Update the parent to the next element to check
									parent = rootNode || parent.parentElement;
									// If a parent with `state` is found, return it
									if (parent && parent.state) {
										return parent;
									}
								}
								return null; // Return null if no parent with `state` is found
							};

							const parent = findParentWithState(outletElement);
							if (parent) {
								content.parent = parent;
								content.stateToObserve = parent.state;
								outletElement.renderOutletContent(content);
							} else {
								outletElement.renderOutletContent(content);
								// no need to do anything
								// console.error("No parent with state found.");
							}
						}

						if (!match.useCache || match.url === url) {
							const content = await routeElement.getContent(match.data);
							outletElement.renderOutletContent(content);
							// setContentAndRender(content);
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
							if (i >= urlSegments.length); else if (this.hasAttribute('fullmatch')) {
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
						// simply için bunu false yaptım
						// match.useCache = false;
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
						// simply.js edit
						// sadece string olarak component'in tag'ini erken dönüyorum
						// böylelikle parent'taki state'i almak için taklaya gerek kalmıyor
						return "<" + tagName + "></" + tagName + ">";
						await NamedRouting.importCustomElement(importAttr, tagName);
						if (tagName) {
							// TODO support if tagName is a function that is called and will return the content
							// content = tagName(attributes);
							content = document.createElement(tagName);
							if (customElements.get(tagName) === undefined) {
								// simple, yüklenene kadar beklemeden hata veriyor ama çalışıyor
								// o yüzden commentledim
								//console.error(`Custom Element not found: ${tagName}. Are you missing an import or mis-spelled the tag name?`);
							}
						}
						const template = this.children[0];
						if (template && template instanceof HTMLTemplateElement) {
							return template.content.cloneNode(true);
						}
					}
					// nested route içindeki element cache'leniyordu
					// onu önlemek için buraya bir else ekledim.
					else {
						content = document.createElement(content.tagName);
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
			window.customElements.define('an-outlet', class extends OutletElement { });

		})();

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
				if (parent.tagName.includes('-') && customElements.get(parent.tagName.toLowerCase()) !== undefined && parent.tagName !== "A-OUTLET" && parent.tagName !== "A-ROUTER") {
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
	observableSlim: function () {
		/*
		 * 	Observable Slim
		 *	Version 0.1.6
		 * 	https://github.com/elliotnb/observable-slim
		 *
		 * 	Licensed under the MIT license:
		 * 	http://www.opensource.org/licenses/MIT
		 *
		 *	Observable Slim is a singleton that allows you to observe changes made to an object and any nested
		 *	children of that object. It is intended to assist with one-way data binding, that is, in MVC parlance,
		 *	reflecting changes in the model to the view. Observable Slim aspires to be as lightweight and easily
		 *	understood as possible. Minifies down to roughly 3000 characters.
		 */
		window.ObservableSlim = (function () {
			var paths = [];
			// An array that stores all of the observables created through the public create() method below.
			var observables = [];
			// An array of all the objects that we have assigned Proxies to
			var targets = [];

			// An array of arrays containing the Proxies created for each target object. targetsProxy is index-matched with
			// 'targets' -- together, the pair offer a Hash table where the key is not a string nor number, but the actual target object
			var targetsProxy = [];

			// this variable tracks duplicate proxies assigned to the same target.
			// the 'set' handler below will trigger the same change on all other Proxies tracking the same target.
			// however, in order to avoid an infinite loop of Proxies triggering and re-triggering one another, we use dupProxy
			// to track that a given Proxy was modified from the 'set' handler
			var dupProxy = null;

			var _getProperty = function (obj, path) {
				return path.split('.').reduce(function (prev, curr) {
					return prev ? prev[curr] : undefined
				}, obj || self)
			};

			/**
			 * Create a new ES6 `Proxy` whose changes we can observe through the `observe()` method.
			 * @param {object} target Plain object that we want to observe for changes.
			 * @param {boolean|number} domDelay If `true`, then the observed changes to `target` will be batched up on a 10ms delay (via `setTimeout()`).
			 * If `false`, then the `observer` function will be immediately invoked after each individual change made to `target`. It is helpful to set
			 * `domDelay` to `true` when your `observer` function makes DOM manipulations (fewer DOM redraws means better performance). If a number greater
			 * than zero, then it defines the DOM delay in milliseconds.
			 * @param {function(ObservableSlimChange[])} [observer] Function that will be invoked when a change is made to the proxy of `target`.
			 * When invoked, this function is passed a single argument: an array of `ObservableSlimChange` detailing each change that has been made.
			 * @param {object} originalObservable The original observable created by the user, exists for recursion purposes, allows one observable to observe
			 * change on any nested/child objects.
			 * @param {{target: object, property: string}[]} originalPath Array of objects, each object having the properties `target` and `property`:
			 * `target` is referring to the observed object itself and `property` referring to the name of that object in the nested structure.
			 * The path of the property in relation to the target on the original observable, exists for recursion purposes, allows one observable to observe
			 * change on any nested/child objects.
			 * @returns {ProxyConstructor} Proxy of the target object.
			 */
			var _create = function (target, domDelay, originalObservable, originalPath) {

				var observable = originalObservable || null;

				// record the nested path taken to access this object -- if there was no path then we provide the first empty entry
				var path = originalPath || [{ "target": target, "property": "" }];
				paths.push(path);

				// in order to accurately report the "previous value" of the "length" property on an Array
				// we must use a helper property because intercepting a length change is not always possible as of 8/13/2018 in
				// Chrome -- the new `length` value is already set by the time the `set` handler is invoked
				if (target instanceof Array) {
					if (!target.hasOwnProperty("__length"))
						Object.defineProperty(target, "__length", { enumerable: false, value: target.length, writable: true });
					else
						target.__length = target.length;
				}

				var changes = [];

				/**
				 * Returns a string of the nested path (in relation to the top-level observed object) of the property being modified or deleted.
				 * @param {object} target Plain object that we want to observe for changes.
				 * @param {string} property Property name.
				 * @param {boolean} [jsonPointer] Set to `true` if the string path should be formatted as a JSON pointer rather than with the dot notation
				 * (`false` as default).
				 * @returns {string} Nested path (e.g., `hello.testing.1.bar` or, if JSON pointer, `/hello/testing/1/bar`).
				 */
				var _getPath = function (target, property, jsonPointer) {

					var fullPath = "";
					var lastTarget = null;

					// loop over each item in the path and append it to full path
					for (var i = 0; i < path.length; i++) {

						// if the current object was a member of an array, it's possible that the array was at one point
						// mutated and would cause the position of the current object in that array to change. we perform an indexOf
						// lookup here to determine the current position of that object in the array before we add it to fullPath
						if (lastTarget instanceof Array && !isNaN(path[i].property)) {
							path[i].property = lastTarget.indexOf(path[i].target);
						}

						fullPath = fullPath + "." + path[i].property
						lastTarget = path[i].target;
					}

					// add the current property
					fullPath = fullPath + "." + property;

					// remove the beginning two dots -- ..foo.bar becomes foo.bar (the first item in the nested chain doesn't have a property name)
					fullPath = fullPath.substring(2);

					if (jsonPointer === true) fullPath = "/" + fullPath.replace(/\./g, "/");

					return fullPath;
				};

				var _notifyObservers = function (numChanges) {

					// if the observable is paused, then we don't want to execute any of the observer functions
					if (observable.paused === true) return;

					var domDelayIsNumber = typeof domDelay === 'number';

					// execute observer functions on a 10ms setTimeout, this prevents the observer functions from being executed
					// separately on every change -- this is necessary because the observer functions will often trigger UI updates
					if (domDelayIsNumber || domDelay === true) {
						setTimeout(function () {
							if (numChanges === changes.length) {

								// we create a copy of changes before passing it to the observer functions because even if the observer function
								// throws an error, we still need to ensure that changes is reset to an empty array so that old changes don't persist
								var changesCopy = changes.slice(0);
								changes = [];

								// invoke any functions that are observing changes
								for (var i = 0; i < observable.observers.length; i++) observable.observers[i](changesCopy);

							}
						}, (domDelayIsNumber && domDelay > 0) ? domDelay : 10);
					} else {

						// we create a copy of changes before passing it to the observer functions because even if the observer function
						// throws an error, we still need to ensure that changes is reset to an empty array so that old changes don't persist
						var changesCopy = changes.slice(0);
						changes = [];

						// invoke any functions that are observing changes
						for (var i = 0; i < observable.observers.length; i++) observable.observers[i](changesCopy);

					}
				};

				var handler = {
					get: function (target, property) {

						// implement a simple check for whether or not the object is a proxy, this helps the .create() method avoid
						// creating Proxies of Proxies.
						if (property === "__getTarget") {
							return target;
						} else if (property === "__isProxy") {
							return true;
							// from the perspective of a given observable on a parent object, return the parent object of the given nested object
						} else if (property === "__getParent") {
							return function (i) {
								if (typeof i === "undefined") var i = 1;
								var parentPath = _getPath(target, "__getParent").split(".");
								parentPath.splice(-(i + 1), (i + 1));
								return _getProperty(observable.parentProxy, parentPath.join("."));
							}
							// return the full path of the current object relative to the parent observable
						} else if (property === "__getPath") {
							// strip off the 12 characters for ".__getParent"
							var parentPath = _getPath(target, "__getParent");
							return parentPath.slice(0, -12);
						}

						// for performance improvements, we assign this to a variable so we do not have to lookup the property value again
						var targetProp = target[property];
						if (target instanceof Date && targetProp instanceof Function && targetProp !== null) {
							return targetProp.bind(target);
						}

						// if we are traversing into a new object, then we want to record path to that object and return a new observable.
						// recursively returning a new observable allows us a single Observable.observe() to monitor all changes on
						// the target object and any objects nested within.
						if (targetProp instanceof Object && targetProp !== null && target.hasOwnProperty(property)) {

							// if we've found a proxy nested on the object, then we want to retrieve the original object behind that proxy
							if (targetProp.__isProxy === true) targetProp = targetProp.__getTarget;

							// if the object accessed by the user (targetProp) already has a __targetPosition AND the object
							// stored at target[targetProp.__targetPosition] is not null, then that means we are already observing this object
							// we might be able to return a proxy that we've already created for the object
							if (targetProp.__targetPosition > -1 && targets[targetProp.__targetPosition] !== null) {

								// loop over the proxies that we've created for this object
								var ttp = targetsProxy[targetProp.__targetPosition];
								for (var i = 0, l = ttp.length; i < l; i++) {

									// if we find a proxy that was setup for this particular observable, then return that proxy
									if (observable === ttp[i].observable) {
										return ttp[i].proxy;
									}
								}
							}

							// if we're arrived here, then that means there is no proxy for the object the user just accessed, so we
							// have to create a new proxy for it

							// create a shallow copy of the path array -- if we didn't create a shallow copy then all nested objects would share the same path array and the path wouldn't be accurate
							var newPath = path.slice(0);
							newPath.push({ "target": targetProp, "property": property });
							return _create(targetProp, domDelay, observable, newPath);
						} else {
							return targetProp;
						}
					},
					deleteProperty: function (target, property) {

						// was this change an original change or was it a change that was re-triggered below
						var originalChange = true;
						if (dupProxy === proxy) {
							originalChange = false;
							dupProxy = null;
						}

						// in order to report what the previous value was, we must make a copy of it before it is deleted
						var previousValue = Object.assign({}, target);

						// record the deletion that just took place
						changes.push({
							"type": "delete"
							, "target": target
							, "property": property
							, "newValue": null
							, "previousValue": previousValue[property]
							, "currentPath": _getPath(target, property)
							, "jsonPointer": _getPath(target, property, true)
							, "proxy": proxy
						});

						if (originalChange === true) {

							// perform the delete that we've trapped if changes are not paused for this observable
							if (!observable.changesPaused) delete target[property];

							for (var a = 0, l = targets.length; a < l; a++) if (target === targets[a]) break;

							// loop over each proxy and see if the target for this change has any other proxies
							var currentTargetProxy = targetsProxy[a] || [];

							var b = currentTargetProxy.length;
							while (b--) {
								// if the same target has a different proxy
								if (currentTargetProxy[b].proxy !== proxy) {
									// !!IMPORTANT!! store the proxy as a duplicate proxy (dupProxy) -- this will adjust the behavior above appropriately (that is,
									// prevent a change on dupProxy from re-triggering the same change on other proxies)
									dupProxy = currentTargetProxy[b].proxy;

									// make the same delete on the different proxy for the same target object. it is important that we make this change *after* we invoke the same change
									// on any other proxies so that the previousValue can show up correct for the other proxies
									delete currentTargetProxy[b].proxy[property];
								}
							}

						}

						_notifyObservers(changes.length);

						return true;

					},
					set: function (target, property, value, receiver) {

						// if the value we're assigning is an object, then we want to ensure
						// that we're assigning the original object, not the proxy, in order to avoid mixing
						// the actual targets and proxies -- creates issues with path logging if we don't do this
						if (value && value.__isProxy) value = value.__getTarget;

						// was this change an original change or was it a change that was re-triggered below
						var originalChange = true;
						if (dupProxy === proxy) {
							originalChange = false;
							dupProxy = null;
						}

						// improve performance by saving direct references to the property
						var targetProp = target[property];

						// Only record this change if:
						// 	1. the new value differs from the old one
						//	2. OR if this proxy was not the original proxy to receive the change
						// 	3. OR the modified target is an array and the modified property is "length" and our helper property __length indicates that the array length has changed
						//
						// Regarding #3 above: mutations of arrays via .push or .splice actually modify the .length before the set handler is invoked
						// so in order to accurately report the correct previousValue for the .length, we have to use a helper property.
						if (targetProp !== value || originalChange === false || (property === "length" && target instanceof Array && target.__length !== value)) {

							var foundObservable = true;

							var typeOfTargetProp = (typeof targetProp);

							// determine if we're adding something new or modifying some that already existed
							var type = "update";
							if (typeOfTargetProp === "undefined") type = "add";

							// store the change that just occurred. it is important that we store the change before invoking the other proxies so that the previousValue is correct
							changes.push({
								"type": type
								, "target": target
								, "property": property
								, "newValue": value
								, "previousValue": receiver[property]
								, "currentPath": _getPath(target, property)
								, "jsonPointer": _getPath(target, property, true)
								, "proxy": proxy
							});

							// mutations of arrays via .push or .splice actually modify the .length before the set handler is invoked
							// so in order to accurately report the correct previousValue for the .length, we have to use a helper property.
							if (property === "length" && target instanceof Array && target.__length !== value) {
								changes[changes.length - 1].previousValue = target.__length;
								target.__length = value;
							}

							// !!IMPORTANT!! if this proxy was the first proxy to receive the change, then we need to go check and see
							// if there are other proxies for the same project. if there are, then we will modify those proxies as well so the other
							// observers can be modified of the change that has occurred.
							if (originalChange === true) {

								// because the value actually differs than the previous value
								// we need to store the new value on the original target object,
								// but only as long as changes have not been paused
								if (!observable.changesPaused) target[property] = value;


								foundObservable = false;

								var targetPosition = target.__targetPosition;
								var z = targetsProxy[targetPosition].length;

								// find the parent target for this observable -- if the target for that observable has not been removed
								// from the targets array, then that means the observable is still active and we should notify the observers of this change
								while (z--) {
									if (observable === targetsProxy[targetPosition][z].observable) {
										if (targets[targetsProxy[targetPosition][z].observable.parentTarget.__targetPosition] !== null) {
											foundObservable = true;
											break;
										}
									}
								}

								// if we didn't find an observable for this proxy, then that means .remove(proxy) was likely invoked
								// so we no longer need to notify any observer function about the changes, but we still need to update the
								// value of the underlying original objects see below: target[property] = value;
								if (foundObservable) {

									// loop over each proxy and see if the target for this change has any other proxies
									var currentTargetProxy = targetsProxy[targetPosition];
									for (var b = 0, l = currentTargetProxy.length; b < l; b++) {
										// if the same target has a different proxy
										if (currentTargetProxy[b].proxy !== proxy) {

											// !!IMPORTANT!! store the proxy as a duplicate proxy (dupProxy) -- this will adjust the behavior above appropriately (that is,
											// prevent a change on dupProxy from re-triggering the same change on other proxies)
											dupProxy = currentTargetProxy[b].proxy;

											// invoke the same change on the different proxy for the same target object. it is important that we make this change *after* we invoke the same change
											// on any other proxies so that the previousValue can show up correct for the other proxies
											currentTargetProxy[b].proxy[property] = value;

										}
									}

									// if the property being overwritten is an object, then that means this observable
									// will need to stop monitoring this object and any nested objects underneath the overwritten object else they'll become
									// orphaned and grow memory usage. we execute this on a setTimeout so that the clean-up process does not block
									// the UI rendering -- there's no need to execute the clean up immediately
									setTimeout(function () {

										if (typeOfTargetProp === "object" && targetProp !== null) {

											// check if the to-be-overwritten target property still exists on the target object
											// if it does still exist on the object, then we don't want to stop observing it. this resolves
											// an issue where array .sort() triggers objects to be overwritten, but instead of being overwritten
											// and discarded, they are shuffled to a new position in the array
											var keys = Object.keys(target);
											for (var i = 0, l = keys.length; i < l; i++) {
												if (target[keys[i]] === targetProp) return;
											}

											var stillExists = false;

											// now we perform the more expensive search recursively through the target object.
											// if we find the targetProp (that was just overwritten) still exists somewhere else
											// further down in the object, then we still need to observe the targetProp on this observable.
											(function iterate(target) {
												var keys = Object.keys(target);
												for (var i = 0, l = keys.length; i < l; i++) {

													var property = keys[i];
													var nestedTarget = target[property];

													if (nestedTarget instanceof Object && nestedTarget !== null) iterate(nestedTarget);
													if (nestedTarget === targetProp) {
														stillExists = true;
														return;
													}
												};
											})(target);

											// even though targetProp was overwritten, if it still exists somewhere else on the object,
											// then we don't want to remove the observable for that object (targetProp)
											if (stillExists === true) return;

											// loop over each property and recursively invoke the `iterate` function for any
											// objects nested on targetProp
											(function iterate(obj) {

												var keys = Object.keys(obj);
												for (var i = 0, l = keys.length; i < l; i++) {
													var objProp = obj[keys[i]];
													if (objProp instanceof Object && objProp !== null) iterate(objProp);
												}

												// if there are any existing target objects (objects that we're already observing)...
												var c = -1;
												for (var i = 0, l = targets.length; i < l; i++) {
													if (obj === targets[i]) {
														c = i;
														break;
													}
												}
												if (c > -1) {

													// ...then we want to determine if the observables for that object match our current observable
													var currentTargetProxy = targetsProxy[c];
													var d = currentTargetProxy.length;

													while (d--) {
														// if we do have an observable monitoring the object thats about to be overwritten
														// then we can remove that observable from the target object
														if (observable === currentTargetProxy[d].observable) {
															currentTargetProxy.splice(d, 1);
															break;
														}
													}

													// if there are no more observables assigned to the target object, then we can remove
													// the target object altogether. this is necessary to prevent growing memory consumption particularly with large data sets
													if (currentTargetProxy.length == 0) {
														// targetsProxy.splice(c,1);
														targets[c] = null;
													}
												}

											})(targetProp)
										}
									}, 10000);
								}

								// TO DO: the next block of code resolves test case #29, but it results in poor IE11 performance with very large objects.
								// UPDATE: need to re-evaluate IE11 performance due to major performance overhaul from 12/23/2018.
								//
								// if the value we've just set is an object, then we'll need to iterate over it in order to initialize the
								// observers/proxies on all nested children of the object
								/* if (value instanceof Object && value !== null) {
									(function iterate(proxy) {
										var target = proxy.__getTarget;
										var keys = Object.keys(target);
										for (var i = 0, l = keys.length; i < l; i++) {
											var property = keys[i];
											if (target[property] instanceof Object && target[property] !== null) iterate(proxy[property]);
										};
									})(proxy[property]);
								}; */

							};

							if (foundObservable) {
								// notify the observer functions that the target has been modified
								_notifyObservers(changes.length);
							}

						}
						return true;
					}
				}

				var __targetPosition = target.__targetPosition;
				if (!(__targetPosition > -1)) {
					Object.defineProperty(target, "__targetPosition", {
						value: targets.length
						, writable: false
						, enumerable: false
						, configurable: false
					});
				}

				// create the proxy that we'll use to observe any changes
				var proxy = new Proxy(target, handler);

				// we don't want to create a new observable if this function was invoked recursively
				if (observable === null) {
					observable = { "parentTarget": target, "domDelay": domDelay, "parentProxy": proxy, "observers": [], "paused": false, "path": path, "changesPaused": false };
					observables.push(observable);
				}

				// store the proxy we've created so it isn't re-created unnecessarily via get handler
				var proxyItem = { "target": target, "proxy": proxy, "observable": observable };

				// if we have already created a Proxy for this target object then we add it to the corresponding array
				// on targetsProxy (targets and targetsProxy work together as a Hash table indexed by the actual target object).
				if (__targetPosition > -1) {

					// the targets array is set to null for the position of this particular object, then we know that
					// the observable was removed some point in time for this object -- so we need to set the reference again
					if (targets[__targetPosition] === null) {
						targets[__targetPosition] = target;
					}

					targetsProxy[__targetPosition].push(proxyItem);

					// else this is a target object that we had not yet created a Proxy for, so we must add it to targets,
					// and push a new array on to targetsProxy containing the new Proxy
				} else {
					targets.push(target);
					targetsProxy.push([proxyItem]);
				}

				return proxy;
			};

			/**
			 * @typedef {object} ObservableSlimChange Observed change.
			 * @property {"add"|"update"|"delete"} type Change type.
			 * @property {string} property Property name.
			 * @property {string} currentPath Property path with the dot notation (e.g. `foo.0.bar`).
			 * @property {string} jsonPointer Property path with the JSON pointer syntax (e.g. `/foo/0/bar`). See https://datatracker.ietf.org/doc/html/rfc6901.
			 * @property {object} target Target object.
			 * @property {ProxyConstructor} proxy Proxy of the target object.
			 * @property {*} newValue New value of the property.
			 * @property {*} [previousValue] Previous value of the property
			 */

			return {
				/**
				 * Create a new ES6 `Proxy` whose changes we can observe through the `observe()` method.
				 * @param {object} target Plain object that we want to observe for changes.
				 * @param {boolean|number} domDelay If `true`, then the observed changes to `target` will be batched up on a 10ms delay (via `setTimeout()`).
				 * If `false`, then the `observer` function will be immediately invoked after each individual change made to `target`. It is helpful to set
				 * `domDelay` to `true` when your `observer` function makes DOM manipulations (fewer DOM redraws means better performance). If a number greater
				 * than zero, then it defines the DOM delay in milliseconds.
				 * @param {function(ObservableSlimChange[])} [observer] Function that will be invoked when a change is made to the proxy of `target`.
				 * When invoked, this function is passed a single argument: an array of `ObservableSlimChange` detailing each change that has been made.
				 * @returns {ProxyConstructor} Proxy of the target object.
				 */
				create: function (target, domDelay, observer) {

					// test if the target is a Proxy, if it is then we need to retrieve the original object behind the Proxy.
					// we do not allow creating proxies of proxies because -- given the recursive design of ObservableSlim -- it would lead to sharp increases in memory usage
					if (target.__isProxy === true) {
						var target = target.__getTarget;
						//if it is, then we should throw an error. we do not allow creating proxies of proxies
						// because -- given the recursive design of ObservableSlim -- it would lead to sharp increases in memory usage
						//throw new Error("ObservableSlim.create() cannot create a Proxy for a target object that is also a Proxy.");
					}

					// fire off the _create() method -- it will create a new observable and proxy and return the proxy
					var proxy = _create(target, domDelay);

					// assign the observer function
					if (typeof observer === "function") this.observe(proxy, observer);

					// recursively loop over all nested objects on the proxy we've just created
					// this will allow the top observable to observe any changes that occur on a nested object
					(function iterate(proxy) {
						var target = proxy.__getTarget;
						var keys = Object.keys(target);
						for (var i = 0, l = keys.length; i < l; i++) {
							var property = keys[i];
							if (target[property] instanceof Object && target[property] !== null) iterate(proxy[property]);
						}
					})(proxy);

					return proxy;

				},

				/**
				 * Add a new observer function to an existing proxy.
				 * @param {ProxyConstructor} proxy An ES6 `Proxy` created by the `create()` method.
				 * @param {function(ObservableSlimChange[])} observer Function that will be invoked when a change is made to the proxy of `target`.
				 * When invoked, this function is passed a single argument: an array of `ObservableSlimChange` detailing each change that has been made.
				 * @returns {void} Does not return any value.
				 */
				observe: function (proxy, observer) {
					// loop over all the observables created by the _create() function
					var i = observables.length;
					while (i--) {
						if (observables[i].parentProxy === proxy) {
							observables[i].observers.push(observer);
							break;
						}
					};
				},

				/**
				 * Prevent any observer functions from being invoked when a change occurs to a proxy.
				 * @param {ProxyConstructor} proxy An ES6 `Proxy` created by the `create()` method.
				 * @returns {void} Does not return any value.
				 */
				pause: function (proxy) {
					var i = observables.length;
					var foundMatch = false;
					while (i--) {
						if (observables[i].parentProxy === proxy) {
							observables[i].paused = true;
							foundMatch = true;
							break;
						}
					};

					if (foundMatch == false) throw new Error("ObseravableSlim could not pause observable -- matching proxy not found.");
				},

				/**
				 * Resume execution of any observer functions when a change is made to a proxy.
				 * @param {ProxyConstructor} proxy An ES6 `Proxy` created by the `create()` method.
				 * @returns {void} Does not return any value.
				 */
				resume: function (proxy) {
					var i = observables.length;
					var foundMatch = false;
					while (i--) {
						if (observables[i].parentProxy === proxy) {
							observables[i].paused = false;
							foundMatch = true;
							break;
						}
					};

					if (foundMatch == false) throw new Error("ObseravableSlim could not resume observable -- matching proxy not found.");
				},

				/**
				 * Prevent any changes (i.e., `set`, and `deleteProperty`) from being written to the target object.
				 * However, the observer functions will still be invoked to let you know what changes **WOULD** have been made.
				 * This can be useful if the changes need to be approved by an external source before the changes take effect.
				 * @param {ProxyConstructor} proxy An ES6 `Proxy` created by the `create()` method.
				 * @returns {void} Does not return any value.
				 */
				pauseChanges: function (proxy) {
					var i = observables.length;
					var foundMatch = false;
					while (i--) {
						if (observables[i].parentProxy === proxy) {
							observables[i].changesPaused = true;
							foundMatch = true;
							break;
						}
					};

					if (foundMatch == false) throw new Error("ObseravableSlim could not pause changes on observable -- matching proxy not found.");
				},

				/**
				 * Resume the changes that were taking place prior to the call to `pauseChanges()` method.
				 * @param {ProxyConstructor} proxy An ES6 `Proxy` created by the `create()` method.
				 * @returns {void} Does not return any value.
				 */
				resumeChanges: function (proxy) {
					var i = observables.length;
					var foundMatch = false;
					while (i--) {
						if (observables[i].parentProxy === proxy) {
							observables[i].changesPaused = false;
							foundMatch = true;
							break;
						}
					};

					if (foundMatch == false) throw new Error("ObseravableSlim could not resume changes on observable -- matching proxy not found.");
				},

				/**
				 * Remove the observable and proxy thereby preventing any further callback observers for changes occurring to the target object.
				 * @param {ProxyConstructor} proxy An ES6 `Proxy` created by the `create()` method.
				 * @returns {void} Does not return any value.
				 */
				remove: function (proxy) {

					var matchedObservable = null;
					var foundMatch = false;

					var c = observables.length;
					while (c--) {
						if (observables[c].parentProxy === proxy) {
							matchedObservable = observables[c];
							foundMatch = true;
							break;
						}
					};

					var a = targetsProxy.length;
					while (a--) {
						var b = targetsProxy[a].length;
						while (b--) {
							if (targetsProxy[a][b].observable === matchedObservable) {
								targetsProxy[a].splice(b, 1);

								// if there are no more proxies for this target object
								// then we null out the position for this object on the targets array
								// since we are essentially no longer observing this object.
								// we do not splice it off the targets array, because if we re-observe the same
								// object at a later time, the property __targetPosition cannot be redefined.
								if (targetsProxy[a].length === 0) {
									targets[a] = null;
								};
							}
						};
					};

					if (foundMatch === true) {
						observables.splice(c, 1);
					}
				}
			};
		})();

		// Export in a try catch to prevent this from erroring out on older browsers
		try { module.exports = ObservableSlim; } catch (err) { };
	},
	go: function (path) {
		window.dispatchEvent(
			new CustomEvent(
				'navigate', {
				detail: {
					href: path
				}
			}));
	},
	findParentWithState: function (element) {
		let parent = element.parentElement;
		while (parent) {
			// If the parent is within a shadow DOM, get the host element
			const rootNode = parent.getRootNode ? parent.getRootNode().host : null;
			// Update the parent to the next element to check
			parent = rootNode || parent.parentElement;
			// If a parent with `state` is found, return it
			if (parent && parent.state) {
				return parent;
			}
		}
		return null; // Return null if no parent with `state` is found
	},
	init: function () {
		// this.Router();
		this.wcRouter();
		this.morphdom();
		this.observableSlim();
		window.get = this.get;
		document.onreadystatechange = function () {
			if (document.readyState == "complete") {
				simply.setupInlineComps(document);
			}
		}

	}
}
simply.init();