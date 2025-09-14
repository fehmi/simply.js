simply = {
	components: {},
	parseTemplate: function (parsingArgs) {

		var { template, data, style, state, parent, methods, props, component, dom, methods, lifecycle } = parsingArgs;

		let simplyTemplate = /\<template([^<>]*)simply([^<>]*)>$/;

		// condititionals
		let ifStart = /\<if(\s)cond=\"(.*)\"(\>$)/;
		let elsifStart = /\<elsif(\s)cond=\"(.*)\"(\>$)/;

		let ifEnd = /\<\/if\>$/;
		let elsifEnd = /\<\/elsif\>$/;
		let elseStart = /\<else\>$/;
		let elseEnd = /\<\/else\>$/;
		let eachEnd = /\<\/each\>$/;
		let customElStart = /\<([a-z][a-z0-9]*-[a-z0-9\-]*)(\s[^<>]*)?\>$/;
		var customElEnd;

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
		var customEl = 0;
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
			// custom element açıldı, dokanma içine. onun kendi lifecycle'ı var
			else if (!customEl && (m = customElStart.exec(recentBucket)) !== null) {
				if (customElements.get(m[1])) {
					customEl = m[1];
				}
			}
			// else if (bucket.endsWith("<template simply>")) {
			// bucket += "<!--";
			// processedLetters += "<!--";
			// simplyTemplateCount += 1;
			// }
			// else if (bucket.substr(-"<template>".length) === "<template>") {
			// 	templateCount += 1;
			// }
			else if (bucket.endsWith("</script>")) {
				scriptCount -= 1;
			}
			else if (bucket.endsWith("</style>")) {
				styleCount -= 1;
			}
			// açılışı yakalanan custom element kapandı, render'a devam
			else if (customEl && bucket.endsWith(`</${customEl}>`)) {
				// console.log("Closed:", customEl);
				customEl = 0;
			}
			// inline template skip
			// we will look when construct
			// else if (bucket.endsWith("</template>")) {
			// simplyTemplateCount -= 1;
			// bucket = bucket.replace(/<\/template>$/, "--></template>");
			// processedLetters = processedLetters.replace(/<\/template>$/, "--></template>");
			// }
			/* / 1ms */

			if (styleCount == 0 && scriptCount == 0 && !customEl) {
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
		// simply.cache.set(cacheKey, ht);

		//console.timeEnd();
		return ht;
	},
	/*
	parseStyle: function (parsingArgs) {
		var { template, style, data, state, parent, methods, props, component, dom, methods, lifecycle } = parsingArgs;
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
	*/
	extractVarName(expr) {
		// Örneğin expr = "data.width ? data.width + 'px' : '100%'"
		// İlk bulunan variable path'ini alıyoruz (data.width gibi)
		let match = expr.match(/([a-zA-Z_$][\w.$]*)/);
		if (match) {
			return match[1].replace(/\./g, "-"); // data.width → data-width
		}
		// fallback
		return expr.replace(/\W+/g, "-");
	},
	parseStyle: function (parsingArgs) {
		let { style, data, state, parent, methods, props, component, dom, lifecycle } = parsingArgs;

		style = typeof style === "string" ? style : "";
		let insideSupports = false;
		let supportsBlocks = [];
		let currentType = null;
		let currentCondition = null;
		let currentBlock = "";
		let blockLevel = 0;
		let cleanStyle = "";
		let i = 0;

		// 1. @supports bloklarını ayıkla
		while (i < style.length) {
			if (!insideSupports && style.slice(i, i + 10).startsWith("@supports")) {
				let match = style.slice(i).match(/^@supports\s*\((if|elsif|else)\s*:\s*("?)(.*?)\2?\)\s*\{/);
				if (match) {
					currentType = match[1];
					currentCondition = match[3];
					insideSupports = true;
					blockLevel = 1;
					currentBlock = "";
					i += match[0].length;
					continue;
				}
			}

			if (insideSupports) {
				let char = style[i];
				if (char === "{") blockLevel++;
				if (char === "}") blockLevel--;
				if (blockLevel === 0) {
					supportsBlocks.push({
						type: currentType,
						condition: currentCondition,
						block: currentBlock.trim()
					});
					insideSupports = false;
					currentBlock = "";
					currentType = null;
					currentCondition = null;
					i++;
					continue;
				} else {
					currentBlock += char;
				}
			} else {
				cleanStyle += style[i];
			}
			i++;
		}

		// 2. Birden fazla doğru bloğu uygula
		let appliedBlocks = [];

		for (const block of supportsBlocks) {
			if (block.type === "if" || block.type === "elsif") {
				try {
					if (eval(block.condition)) {
						appliedBlocks.push(block.block);
					}
				} catch (e) {
					//console.warn("Condition error:", block.condition);
				}
			} else if (block.type === "else" && appliedBlocks.length === 0) {
				appliedBlocks.push(block.block);
			}
		}

		if (appliedBlocks.length > 0) {
			cleanStyle += "\n" + appliedBlocks.join("\n");
		}

		// 3. { ... } değişkenlerini global olarak değiştir
		const variable = /(["'])\{([^{}\n]*)\}\1/g;

		cleanStyle = cleanStyle.replace(variable, (_, quote, expr) => {
			try {
				let value = eval(expr);
				return typeof value === "number" ? value.toString() : value;
			} catch {
				return "";
			}
		});

		return { style: cleanStyle.trim() };
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
		simply.gets = simply.gets || [];

		function loadAndRegister(p) {
			simply.loadComponent(p, name, function (component) {
				simply.getSettings(component, function (settings) {
					simply.registerComponent(settings);
				});
			});
		}

		if (Array.isArray(path)) {
			for (let i = 0; i < path.length; i++) {
				simply.gets.push(path[i]);
				loadAndRegister(path[i]);
			}
		} else {
			simply.gets.push(path);
			loadAndRegister(path);
		}
	},
	jsdoc: function (str) {
		return str.replace(/(\n[ \t]*\/\/\/[^\n]*)+/g, function ($) {
			var replacement = '\n/**' + $.replace(/^[ \t]*\/\/\//mg, '').replace(/(\n$|$)/, '*/$1');
			return replacement;
		});
	},
	loadComponent: function (path, name, callback, triedWithCorsProxy = false) {
		if (typeof name === "undefined" || !name) {
			// If proxy URL, get real path after proxy prefix
			const realPath = path.includes("cors.woebegone.workers.dev/?")
				? path.split("cors.woebegone.workers.dev/?")[1]
				: path;

			// Keep full path for fetching (including query params)
			path = realPath;

			// Extract name from path without query and hash
			const queryIndex = realPath.indexOf('?');
			const basePath = queryIndex === -1 ? realPath : realPath.slice(0, queryIndex);
			const cleanPath = basePath.split('#')[0];
			const filename = cleanPath.split('/').pop();
			name = filename.split('.').slice(0, -1).join('.');
		}
		else {
			if (name.indexOf(".") > -1) {
				var ext = name.split(".").pop();
				name = name.replace("." + ext, "");
			}
			else {
				var ext = "html";
			}
		}

		const isBlob = path.startsWith("blob:");
		const fetchUrl = isBlob
			? path
			: path + (path.includes("?") ? "&" : "?") + "_v=" + Date.now();

		fetch(fetchUrl)
			.then(response => {
				if (!response.ok) throw new Error("Network response was not ok");
				return response.text();
			})
			.then(text => {
				if (!text) throw new Error("Empty response (possible CORS block)");
				const parsed = simply.splitComponent(text);

				simply.components[name] = parsed;
				callback({
					name,
					template: parsed.template,
					styles: parsed.styles,
					script: parsed.script,
					docStr: text
				});
			})
			.catch(error => {
				console.warn("Fetch error:", error.message, "(possible CORS block) Trying with proxy one time.");
				if (!triedWithCorsProxy && !path.startsWith("https://cors.woebegone.workers.dev/")) {
					const proxyUrl = "https://cors.woebegone.workers.dev/?" + path;
					simply.loadComponent(proxyUrl, name, callback, true);
				} else {
					console.error("Could not load component even with proxy:", path);
				}
			});
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
	objToPropString: function (obj) {
		return JSON.stringify(obj).replace(/'/g, "&apos;");
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


					// before construct event
					if (typeof this.sfcClass.lifecycle !== "undefined") {
						if (typeof this.sfcClass.lifecycle.beforeConstruct !== "undefined") {
							this.sfcClass.lifecycle.beforeConstruct();
						}
					}
					var shadow = false;

					if (this.getAttribute("shadow") !== null && this.getAttribute("shadow") !== "false") {
						shadow = true;
					}

					var uid = "id" + Math.random().toString(16).slice(2)
					var component = this;

					if (shadow) {
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
					component.elementId = simply.getElementUniqueId(dom);

					var data = this.sfcClass.data ? this.sfcClass.data : {};
					var props = this.sfcClass.props ? this.sfcClass.props : {};


					var methods = this.sfcClass.methods;
					var lifecycle = this.sfcClass.lifecycle;
					var state;
					var cb = {}

					this.component = component;
					this.dom = dom;

					const framerComponentObserver = new MutationObserver(mutations => {
						for (const mutation of mutations) {
							for (const node of mutation.addedNodes) {
								if (node.nodeType === Node.ELEMENT_NODE) {
									if (node.tagName === "FRAMER-COMPONENT" && !node.hasAttribute("uid")) {
										const framerComponentUid = "id" + Math.random().toString(16).slice(2);
										const path = node.getAttribute("path");
										const rendered = node.hasAttribute("rendered");
										node.setAttribute("uid", framerComponentUid);
										node.setAttribute("style", "height: auto; width: auto");
										node.setAttribute("rendered", true);

										console.warn("framer-component added inside <" + name + ">", node);

										// 🔁 Framer'a mesaj gönder
										window.parent.postMessage({
											method: "component-request",
											path,
											name,
											framerComponentUid,
											uid
										}, "*");

										// ✅ Sadece bu `dom` içinde click'leri dinle
										node.addEventListener("click", e => {
											console.log("click", e)
											if (node.contains(e.target)) {
												triggerOnTapFromDOM(e.target);
											}
										}, { passive: true });
									}
								}
							}
						}
					});

					// DOM veya shadow DOM'u izle
					framerComponentObserver.observe(dom, {
						childList: true,
						subtree: true
					});

					// bu yakaladığı ilk component' tıklayıp bırakıyor
					// framer gibi tap'ın parent'larını da tetiklemek istersen
					// çalışan kod şurada: https://chatgpt.com/s/t_68710b873f9481919232870b0c7eeb32
					function triggerOnTapFromDOM(domElement) {
						console.log("tap")
						var current = domElement;

						while (current && current.tagName !== "FRAMER-COMPONENT") {
							// __reactFiber$... anahtarını bul
							var fiberKey = null;
							try {
								var keys = Object.keys(current);
								for (var i = 0; i < keys.length; i++) {
									if (keys[i].indexOf("__reactFiber$") === 0) {
										fiberKey = keys[i];
										break;
									}
								}
							} catch (e) { }

							var fiber = fiberKey ? current[fiberKey] : null;

							try {
								var onTap = fiber.return.child.pendingProps.onTap;
								if (typeof onTap === "function") {
									console.log("✅ Triggering onTap on:", current);
									onTap();
									setTimeout(() => {
										try {
											dom.lifecycle.framerComponentClicked(current)
										} catch (e) { }
									}, 0);
									return;
								}
							} catch (e) { }

							try {
								var onTap = fiber.return.child.child.stateNode.props.onTap;
								if (typeof onTap === "function") {
									console.log("✅ Triggering onTap on:", current);
									onTap();
									setTimeout(() => {
										try {
											dom.lifecycle.framerComponentClicked(current)
										} catch (e) { }
									}, 0);
									return;
								}
							} catch (e) { }

							current = current.parentElement;
						}

						console.warn("No onTap handler found up to <framer-component>");
					}

					dom.addEventListener("click", function (e) {
						const target = e.target;
						const link = target.closest("a");

						// Link varsa ve ya "framer-component" içinde ya da "framer-route" attribute'u varsa
						if (
							link &&
							(link.closest("framer-component") || link.hasAttribute("route-framer"))
						) {
							console.log("Send this link to framer for route:", link.getAttribute("href"));
							e.preventDefault();
							e.stopPropagation();
							window.parent.postMessage({
								method: 'link-click',
								link: link.getAttribute("href"),
								uid,
								name
							}, '*')
						}
					});

					this.lifecycle = lifecycle;


					this.propsToObserve = props;

					this.dataToObserve = data;
					this.data;

					// cache var ise data'yı restore edelim
					if (this.hasAttribute("cache") && this.getAttribute("cache") !== "false") {
						this.cache = {}
						var cache = this.cache;
						try {
							var cachedData = simply.cache[simply.lastPath][component.elementId].data;
						}
						catch (e) { }

						if (cachedData) {
							this.cache.data = simply.cache[simply.lastPath][component.elementId].data;

							console.log("cache hit for data!");
							for (const key in cachedData) {
								if (Object.hasOwnProperty.call(cachedData, key)) {
									component.dataToObserve[key] = cachedData[key];
								}
							}
						}
					}


					this.methods = methods;
					this.parent = parent;
					this.uid = uid;
					this.shadow = shadow;
					this.cb = cb;

					var self = this;

					// console.log(name, open);

					var geval = eval;
					for (var key in sfcClass) {
						if (!key.match("data|state|methods|lifecycle|props|dom|component|parent")) {
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

					if (this.hasAttribute("cache") && this.getAttribute("cache") !== "false") {
						try {
							var cachedProps = simply.cache[simply.lastPath][component.elementId].props;
						}
						catch (e) { }

						if (cachedProps) {
							this.cache.props = simply.cache[simply.lastPath][component.elementId].props;
							console.log("cache hit for props!");
							for (const key in cachedProps) {
								if (Object.hasOwnProperty.call(cachedProps, key)) {
									component.propsToObserve[key] = cachedProps[key];
								}
							}
						}
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

					this.react = function (property, newValue, previousValue, prop = false, st_ate = false) {
						//console.log("react to ", property, previousValue, newValue);

						if (self.data) {
							if (typeof self.lifecycle !== "undefined") {
								if (prop) {
									if (typeof self.lifecycle.whenPropChange !== "undefined") {
										if (self.lifecycle.whenPropChange(property, newValue, previousValue) === false) {
											return false;
										};
									}
								}
								else if (st_ate) {
									//console.log(self.lifecycle.whenDataChange(name, value, old, parents));
									if (self.lifecycle && self.lifecycle.whenStateChange) {
										if (self.lifecycle.whenStateChange(property, newValue, previousValue) === false) {
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
							// console.log("renderellas", self);
							self.render();
						}

					}

					if (this.dataToObserve) {
						this.data = ObservableSlim.create(this.dataToObserve, .1, function (changes) {
							// console.log(changes, component, self.cb);
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

						if (template.indexOf("props") > -1 || script.indexOf("props") > -1) {
							this.cb.props = {}
							this.cb.props[this.uid] = function (property, newValue, previousValue) { self.react(property, newValue, previousValue, true) };
						}
					}

					// buna artık gerek yok çünkü mesah ile değil 
					// direk .props ile yolluyorum
					self.framerPropsListener = function (event) {
						event.preventDefault();
						event.stopPropagation();

						if (event.data.method === "set-props") {
							console.log("props from parent", event.data.props);
							Object.assign(props, event.data.props)


							if (lifecycle && lifecycle.framerPropsUpdated) {
								lifecycle.framerPropsUpdated();
							}
							component.render();

						}
					}

					component.runInFramer = function (codeToRun) {
						window.parent.postMessage({
							method: 'run-in-framer',
							name,
							uid: uid,
							code: "return " + codeToRun.toString()
						}, '*')
					}

					window.addEventListener("message", self.framerPropsListener);
					window.parent.postMessage({ method: "simply-ready", uid: uid, name }, "*");

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
							this.cb.state[this.uid] = function (property, newValue, previousValue) { self.react(property, newValue, previousValue, false, true) };
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
								p.cb.state[this.uid] = function (property, newValue, previousValue) { self.react(property, newValue, previousValue, false, true) };
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


					if (this.parent) {
						if (this.parent.data) {
							if (this.parent.cb) {
								if (this.parent.cb.data) {

									this.parent.cb.data[this.uid] = function (prop, value) { self.react(prop, value) };
									this.parent.setData = this.parent.data;
								}
							}

						}

						if (this.parent.props) {
							if (this.parent.cb && this.parent.cb.props) {
								this.parent.cb.props[this.uid] = function (prop, value) { self.react(prop, value) };
								this.parent.setProps = this.parent.props;
							}
						}

					}




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
						if (this.shadow) {
							var match = "simply.findShadowRootOrCustomElement(this)";
						}
						else {
							var match = "simply.findShadowRootOrCustomElement(this)";
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


					var tmpl = template;

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
						lifecycle: this.lifecycle
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
							lifecycle: this.lifecycle
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

						// took slot content


						if (this.innerHTML && this.innerHTML.trim() !== "") {
							console.log(this.innerHTML);
							this.slotContent = this.innerHTML;

							// parent var context odur
							// yok ise context kendisidir
							const p = this.parent ?? this;
							const parsedSlot = simply.parseTemplate({
								template: this.slotContent,
								...p
							});


							this.dom.innerHTML = parsedTemplate;
							this.dom.querySelector("simply-slot").innerHTML = parsedSlot;
						}
						else {
							this.dom.innerHTML = parsedTemplate;
						}


						try {
							if (!this.shadow) {
								//console.log("not open", this);
								this.sheet = this.dom.getRootNode().querySelector("style[simply-vars]").sheet;
							}
							else {
								//console.log("open", this);
								this.sheet = this.querySelector("style[simply-vars]").sheet;
							}

							//console.log(this.dom.getRootNode().styleSheets[1].cssRules[0].style.setProperty"--main-bg-color: yellow;";["--data-topAreaHeight"] = "3px");
							if (this.shadow) {

								var vars = ":root {";
							}
							else {
								var vars = ":host {";
							}
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
						this.renderingDone = true;
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
						if (this.shadow) {
							var newDomAsString = "<" + name + " shadow>" + newDom + "</" + name + ">";

							morphIt(this.dom, newDomAsString);
						}
						else {
							var newDomAsString = "<" + name + ">" + newDom + "</" + name + ">";
							morphIt(this.dom, newDomAsString);
						}

						if (this.slotContent) {
							// parent var context odur
							// yok ise context kendisidir
							const p = this.parent ?? this;
							const parsedSlot = simply.parseTemplate({
								template: this.slotContent,
								...p
							});

							morphIt(this.dom.querySelector("simply-slot"), "<simply-slot>" + parsedSlot + "</simply-slot>");
						}

						// console.log(newDomAsString);


						function morphIt(dom, newDomAsString) {
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
									else if (toEl.tagName === 'FRAMER-COMPONENT') {
										// DINAMIK BAKMAK LAZIM EL ROUTER MI DIYE
										return false;
									}
									if (fromEl.tagName == "DIALOG") {
										console.log(fromEl.getAttribute("open"), toEl.getAttribute("open"));
										if (fromEl.hasAttribute("open")) {
											toEl.setAttribute("open", true);
										}
										return true;
										// console.log("dont again");
									}
									if (fromEl.hasAttribute("router-active") == true) {
										toEl.setAttribute("router-active", true);
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
										console.log("same mi node", toEl, fromEl.value, toEl.value)
										return false;
									}
									if (fromEl.isEqualNode(toEl)) {
										// textarea'dan textarea'ya dönüştürürken
										// eşit mi diye bakarken value'yu hesaba katmıyor diye eklendi
										if (toEl.tagName == "TEXTAREA" && fromEl.value !== toEl.value) {
											return true
										}
										return false
									}
									if (fromEl.tagName == "CHILD-COMPONENT") {
										// console.log("dont again");
									}
									if (fromEl.tagName == "SIMPLY-SLOT") {
										return false;
										// console.log("dont again");
									}
									else if (fromEl.tagName == "STYLE" && fromEl.hasAttribute("global")) {
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
									else if (toEl.tagName === 'FRAMER-COMPONENT') {
										// DINAMIK BAKMAK LAZIM EL ROUTER MI DIYE
										return false;
									}
									else if (toEl.tagName === 'ROUTER') {
										// DINAMIK BAKMAK LAZIM EL ROUTER MI DIYE
										return false;
									}
									else if (toEl.tagName === 'ROUTE') {
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
								lifecycle: this.lifecycle
							});
						}

						if (parsedGlobalStyle) {
							for (var key in parsedGlobalStyle.vars) {
								if (!parsedGlobalStyle.vars.hasOwnProperty(key)) continue;
								this.sheet.cssRules[0].style.setProperty(key, parsedGlobalStyle.vars[key]);
							}
						}
						// test

						if (typeof this.lifecycle !== "undefined") {
							if (typeof this.lifecycle.afterRerender !== "undefined") {
								this.lifecycle.afterRerender();
							}
						}
					}

					// cache data and props after every render
					if ('cache' in this.props) {
						// component tag has cache attribute
						// only do if cache enabled

						try {

							let tagName = this.component.tagName.toLowerCase();
							let tagNameOfRoute = simply.page.getRouteByPath(simply.lastPath).value.settings.component;

							if (tagName == tagNameOfRoute) {
								simply.cache = simply.cache ? simply.cache : {}
								simply.cache[simply.lastPath] = simply.cache[simply.lastPath] ? simply.cache[simply.lastPath] : {}
								simply.cache[simply.lastPath][this.elementId] = {
									data: this.data,
									props: this.props
								}

								this.cache = {
									data: this.data,
									props: this.props
								}

								// console.log("cached!", this.elementId, this.tagName, simply.cache);
							}
						}
						catch (e) { }


					}

					if (typeof this.lifecycle !== "undefined") {
						if (typeof this.lifecycle.afterRender !== "undefined") {
							this.lifecycle.afterRender();
						}
					}

				}
				disconnectedCallback() {

					window.removeEventListener("message", this.framerPropsListener);

					console.log("this thist his")
					// console.log("disconnector", this.uid);
					if (this.cb.state) {
						this.cb.state[this.uid] = null;
						// bu biraz yavaşlatıyor diye commentledim
						// Reflect.deleteProperty(this.cb.state, this.uid); // true
					}
					if (this.cb.data) {
						this.cb.data[this.uid] = null;
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
	getCompRoot: function (element) {
		const rootNode = element.getRootNode();
		return rootNode instanceof ShadowRoot ? rootNode.host : element;
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
				/*
							Remove observer
										params: proxy object and observer function
				*/
				observerRemove: function (proxy, observer) {
					var i = observables.length;
					while (i--) {
						if (observables[i].parentProxy === proxy) {
							var b = observables[i].observers.length;
							while (b--) {
								// console.log(observables[i].observers[b], observer);
								if (observables[i].observers[b] === observer) {
									observables[i].observers.splice(b, 1);
									break;
								}
							}
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
	getFirstCustomElementParent(el) {
		while (el) {
			const parent = el.parentElement || (el.getRootNode && el.getRootNode().host);
			if (!parent) break;

			if (parent.tagName && parent.tagName.includes('-')) {
				return parent;
			}

			el = parent;
		}
		return null;
	},
	page: function () {
		'use strict';

		var isarray = Array.isArray || function (arr) {
			return Object.prototype.toString.call(arr) == '[object Array]';
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
		 * The main path matching regexp utility.
		 *
		 * @type {RegExp}
		 */
		var PATH_REGEXP = new RegExp([
			// Match escaped characters that would otherwise appear in future matches.
			// This allows the user to escape special characters that won't transform.
			'(\\\\.)',
			// Match Express-style parameters and un-named parameters with a prefix
			// and optional suffixes. Matches appear as:
			//
			// "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
			// "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
			// "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
			'([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
		].join('|'), 'g');

		/**
		 * Parse a string for the raw tokens.
		 *
		 * @param  {String} str
		 * @return {Array}
		 */
		function parse(str) {
			var tokens = [];
			var key = 0;
			var index = 0;
			var path = '';
			var res;

			while ((res = PATH_REGEXP.exec(str)) != null) {
				var m = res[0];
				var escaped = res[1];
				var offset = res.index;
				path += str.slice(index, offset);
				index = offset + m.length;

				// Ignore already escaped sequences.
				if (escaped) {
					path += escaped[1];
					continue
				}

				// Push the current path onto the tokens.
				if (path) {
					tokens.push(path);
					path = '';
				}

				var prefix = res[2];
				var name = res[3];
				var capture = res[4];
				var group = res[5];
				var suffix = res[6];
				var asterisk = res[7];

				var repeat = suffix === '+' || suffix === '*';
				var optional = suffix === '?' || suffix === '*';
				var delimiter = prefix || '/';
				var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

				tokens.push({
					name: name || key++,
					prefix: prefix || '',
					delimiter: delimiter,
					optional: optional,
					repeat: repeat,
					pattern: escapeGroup(pattern)
				});
			}

			// Match any characters still remaining.
			if (index < str.length) {
				path += str.substr(index);
			}

			// If the path exists, push it onto the end.
			if (path) {
				tokens.push(path);
			}

			return tokens
		}

		/**
		 * Compile a string to a template function for the path.
		 *
		 * @param  {String}   str
		 * @return {Function}
		 */
		function compile(str) {
			return tokensToFunction(parse(str))
		}

		/**
		 * Expose a method for transforming tokens into the path function.
		 */
		function tokensToFunction(tokens) {
			// Compile all the tokens into regexps.
			var matches = new Array(tokens.length);

			// Compile all the patterns before compilation.
			for (var i = 0; i < tokens.length; i++) {
				if (typeof tokens[i] === 'object') {
					matches[i] = new RegExp('^' + tokens[i].pattern + '$');
				}
			}

			return function (obj) {
				var path = '';
				var data = obj || {};

				for (var i = 0; i < tokens.length; i++) {
					var token = tokens[i];

					if (typeof token === 'string') {
						path += token;

						continue
					}

					var value = data[token.name];
					var segment;

					if (value == null) {
						if (token.optional) {
							continue
						} else {
							throw new TypeError('Expected "' + token.name + '" to be defined')
						}
					}

					if (isarray(value)) {
						if (!token.repeat) {
							throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
						}

						if (value.length === 0) {
							if (token.optional) {
								continue
							} else {
								throw new TypeError('Expected "' + token.name + '" to not be empty')
							}
						}

						for (var j = 0; j < value.length; j++) {
							segment = encodeURIComponent(value[j]);

							if (!matches[i].test(segment)) {
								throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
							}

							path += (j === 0 ? token.prefix : token.delimiter) + segment;
						}

						continue
					}

					segment = encodeURIComponent(value);

					if (!matches[i].test(segment)) {
						throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
					}

					path += token.prefix + segment;
				}

				return path
			}
		}

		/**
		 * Escape a regular expression string.
		 *
		 * @param  {String} str
		 * @return {String}
		 */
		function escapeString(str) {
			return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
		}

		/**
		 * Escape the capturing group by escaping special characters and meaning.
		 *
		 * @param  {String} group
		 * @return {String}
		 */
		function escapeGroup(group) {
			return group.replace(/([=!:$\/()])/g, '\\$1')
		}

		/**
		 * Attach the keys as a property of the regexp.
		 *
		 * @param  {RegExp} re
		 * @param  {Array}  keys
		 * @return {RegExp}
		 */
		function attachKeys(re, keys) {
			re.keys = keys;
			return re
		}

		/**
		 * Get the flags for a regexp from the options.
		 *
		 * @param  {Object} options
		 * @return {String}
		 */
		function flags(options) {
			return options.sensitive ? '' : 'i'
		}

		/**
		 * Pull out keys from a regexp.
		 *
		 * @param  {RegExp} path
		 * @param  {Array}  keys
		 * @return {RegExp}
		 */
		function regexpToRegexp(path, keys) {
			// Use a negative lookahead to match only capturing groups.
			var groups = path.source.match(/\((?!\?)/g);

			if (groups) {
				for (var i = 0; i < groups.length; i++) {
					keys.push({
						name: i,
						prefix: null,
						delimiter: null,
						optional: false,
						repeat: false,
						pattern: null
					});
				}
			}

			return attachKeys(path, keys)
		}

		/**
		 * Transform an array into a regexp.
		 *
		 * @param  {Array}  path
		 * @param  {Array}  keys
		 * @param  {Object} options
		 * @return {RegExp}
		 */
		function arrayToRegexp(path, keys, options) {
			var parts = [];

			for (var i = 0; i < path.length; i++) {
				parts.push(pathToRegexp(path[i], keys, options).source);
			}

			var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

			return attachKeys(regexp, keys)
		}

		/**
		 * Create a path regexp from string input.
		 *
		 * @param  {String} path
		 * @param  {Array}  keys
		 * @param  {Object} options
		 * @return {RegExp}
		 */
		function stringToRegexp(path, keys, options) {
			var tokens = parse(path);
			var re = tokensToRegExp(tokens, options);

			// Attach keys back to the regexp.
			for (var i = 0; i < tokens.length; i++) {
				if (typeof tokens[i] !== 'string') {
					keys.push(tokens[i]);
				}
			}

			return attachKeys(re, keys)
		}

		/**
		 * Expose a function for taking tokens and returning a RegExp.
		 *
		 * @param  {Array}  tokens
		 * @param  {Array}  keys
		 * @param  {Object} options
		 * @return {RegExp}
		 */
		function tokensToRegExp(tokens, options) {
			options = options || {};

			var strict = options.strict;
			var end = options.end !== false;
			var route = '';
			var lastToken = tokens[tokens.length - 1];
			var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

			// Iterate over the tokens and create our regexp string.
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];

				if (typeof token === 'string') {
					route += escapeString(token);
				} else {
					var prefix = escapeString(token.prefix);
					var capture = token.pattern;

					if (token.repeat) {
						capture += '(?:' + prefix + capture + ')*';
					}

					if (token.optional) {
						if (prefix) {
							capture = '(?:' + prefix + '(' + capture + '))?';
						} else {
							capture = '(' + capture + ')?';
						}
					} else {
						capture = prefix + '(' + capture + ')';
					}

					route += capture;
				}
			}

			// In non-strict mode we allow a slash at the end of match. If the path to
			// match already ends with a slash, we remove it for consistency. The slash
			// is valid at the end of a path match, not in the middle. This is important
			// in non-ending mode, where "/test/" shouldn't match "/test//route".
			if (!strict) {
				route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
			}

			if (end) {
				route += '$';
			} else {
				// In non-ending mode, we need the capturing groups to match as much as
				// possible by using a positive lookahead to the end or next path segment.
				route += strict && endsWithSlash ? '' : '(?=\\/|$)';
			}

			return new RegExp('^' + route, flags(options))
		}

		/**
		 * Normalize the given path string, returning a regular expression.
		 *
		 * An empty array can be passed in for the keys, which will hold the
		 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
		 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
		 *
		 * @param  {(String|RegExp|Array)} path
		 * @param  {Array}                 [keys]
		 * @param  {Object}                [options]
		 * @return {RegExp}
		 */
		function pathToRegexp(path, keys, options) {
			keys = keys || [];

			if (!isarray(keys)) {
				options = keys;
				keys = [];
			} else if (!options) {
				options = {};
			}

			if (path instanceof RegExp) {
				return regexpToRegexp(path, keys, options)
			}

			if (isarray(path)) {
				return arrayToRegexp(path, keys, options)
			}

			return stringToRegexp(path, keys, options)
		}

		pathToRegexp_1.parse = parse_1;
		pathToRegexp_1.compile = compile_1;
		pathToRegexp_1.tokensToFunction = tokensToFunction_1;
		pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

		/**
			 * Module dependencies.
			 */



		/**
		 * Short-cuts for global-object checks
		 */

		var hasDocument = ('undefined' !== typeof document);
		var hasWindow = ('undefined' !== typeof window);
		var hasHistory = ('undefined' !== typeof history);
		var hasProcess = typeof process !== 'undefined';

		/**
		 * Detect click event
		 */
		var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

		/**
		 * To work properly with the URL
		 * history.location generated polyfill in https://github.com/devote/HTML5-History-API
		 */

		var isLocation = hasWindow && !!(window.history.location || window.location);

		/**
		 * The page instance
		 * @api private
		 */
		function Page() {
			// public things
			this.callbacks = [];
			this.exits = [];
			this.current = '';
			this.len = 0;

			// private things
			this._decodeURLComponents = true;
			this._base = '';
			this._strict = false;
			this._running = false;
			this._hashbang = false;

			// bound functions
			this.clickHandler = this.clickHandler.bind(this);
			this._onpopstate = this._onpopstate.bind(this);
		}

		/**
		 * Configure the instance of page. This can be called multiple times.
		 *
		 * @param {Object} options
		 * @api public
		 */

		Page.prototype.configure = function (options) {
			var opts = options || {};

			this._window = opts.window || (hasWindow && window);
			this._decodeURLComponents = opts.decodeURLComponents !== false;
			this._popstate = opts.popstate !== false && hasWindow;
			this._click = opts.click !== false && hasDocument;
			this._hashbang = !!opts.hashbang;

			var _window = this._window;
			if (this._popstate) {
				_window.addEventListener('popstate', this._onpopstate, false);
			} else if (hasWindow) {
				_window.removeEventListener('popstate', this._onpopstate, false);
			}

			if (this._click) {
				_window.document.addEventListener(clickEvent, this.clickHandler, false);
			} else if (hasDocument) {
				_window.document.removeEventListener(clickEvent, this.clickHandler, false);
			}

			if (this._hashbang && hasWindow && !hasHistory) {
				_window.addEventListener('hashchange', this._onpopstate, false);
			} else if (hasWindow) {
				_window.removeEventListener('hashchange', this._onpopstate, false);
			}
		};

		/**
		 * Get or set basepath to `path`.
		 *
		 * @param {string} path
		 * @api public
		 */

		Page.prototype.base = function (path) {
			if (0 === arguments.length) return this._base;
			this._base = path;
		};

		/**
		 * Gets the `base`, which depends on whether we are using History or
		 * hashbang routing.
	
		* @api private
		*/
		Page.prototype._getBase = function () {
			var base = this._base;
			if (!!base) return base;
			var loc = hasWindow && this._window && this._window.location;

			if (hasWindow && this._hashbang && loc && loc.protocol === 'file:') {
				base = loc.pathname;
			}

			return base;
		};

		/**
		 * Get or set strict path matching to `enable`
		 *
		 * @param {boolean} enable
		 * @api public
		 */

		Page.prototype.strict = function (enable) {
			if (0 === arguments.length) return this._strict;
			this._strict = enable;
		};


		/**
		 * Bind with the given `options`.
		 *
		 * Options:
		 *
		 *    - `click` bind to click events [true]
		 *    - `popstate` bind to popstate [true]
		 *    - `dispatch` perform initial dispatch [true]
		 *
		 * @param {Object} options
		 * @api public
		 */

		Page.prototype.start = function (options) {
			var opts = options || {};
			this.configure(opts);

			if (false === opts.dispatch) return;
			this._running = true;
			var url;
			if (isLocation) {
				var window = this._window;
				var loc = window.location;

				if (this._hashbang && ~loc.hash.indexOf('#!')) {
					url = loc.hash.substr(2) + loc.search;
				} else if (this._hashbang) {
					url = loc.search + loc.hash;
				} else {
					url = loc.pathname + loc.search + loc.hash;
				}
			}

			this.replace(url, null, true, opts.dispatch);
		};

		/**
		 * Unbind click and popstate event handlers.
		 *
		 * @api public
		 */

		Page.prototype.stop = function () {
			if (!this._running) return;
			this.current = '';
			this.len = 0;
			this._running = false;

			var window = this._window;
			this._click && window.document.removeEventListener(clickEvent, this.clickHandler, false);
			hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
			hasWindow && window.removeEventListener('hashchange', this._onpopstate, false);
		};

		/**
		 * Show `path` with optional `state` object.
		 *
		 * @param {string} path
		 * @param {Object=} state
		 * @param {boolean=} dispatch
		 * @param {boolean=} push
		 * @return {!Context}
		 * @api public
		 */

		Page.prototype.show = function (path, state, dispatch, push) {

			if (simply.preserveParams && simply.preserveParams.length > 0) {
				const urlParams = new URLSearchParams(window.location.search);
				const filteredParams = new URLSearchParams();

				for (const [key, value] of urlParams.entries()) {
					if (simply.preserveParams.includes(key)) {
						filteredParams.append(key, value);
					}
				}

				const filteredQuery = filteredParams.toString();

				if (typeof path === 'string' && !path.includes('?') && filteredQuery) {
					path += '?' + filteredQuery;
				}
			}


			var ctx = new Context(path, state, this), prev = this.prevContext; // maybe i should do the same for this one
			// prevContent was always same so i added by swallow copying to ctx.page.simplyPrevContext
			this.simplyPrevContext = { ...prev }

			this.prevContext = ctx;
			this.current = ctx.path;
			if (false !== dispatch) this.dispatch(ctx, prev);
			if (false !== ctx.handled && false !== push) ctx.pushState();
			return ctx;
		};

		/**
		 * Goes back in the history
		 * Back should always let the current route push state and then go back.
		 *
		 * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
		 * @param {Object=} state
		 * @api public
		 */

		Page.prototype.back = function (path, state) {
			var page = this;
			if (this.len > 0) {
				var window = this._window;
				// this may need more testing to see if all browsers
				// wait for the next tick to go back in history
				hasHistory && window.history.back();
				this.len--;
			} else if (path) {
				setTimeout(function () {
					page.show(path, state);
				});
			} else {
				setTimeout(function () {
					page.show(page._getBase(), state);
				});
			}
		};

		/**
		 * Register route to redirect from one path to other
		 * or just redirect to another route
		 *
		 * @param {string} from - if param 'to' is undefined redirects to 'from'
		 * @param {string=} to
		 * @api public
		 */
		Page.prototype.redirect = function (from, to) {
			var inst = this;

			// Define route from a path to another
			if ('string' === typeof from && 'string' === typeof to) {
				page.call(this, from, function (e) {
					setTimeout(function () {
						inst.replace(/** @type {!string} */(to));
					}, 0);
				});
			}

			// Wait for the push state and replace it with another
			if ('string' === typeof from && 'undefined' === typeof to) {
				setTimeout(function () {
					inst.replace(from);
				}, 0);
			}
		};

		/**
		 * Replace `path` with optional `state` object.
		 *
		 * @param {string} path
		 * @param {Object=} state
		 * @param {boolean=} init
		 * @param {boolean=} dispatch
		 * @return {!Context}
		 * @api public
		 */


		Page.prototype.replace = function (path, state, init, dispatch) {
			var ctx = new Context(path, state, this),
				prev = this.prevContext;
			this.prevContext = ctx;
			this.current = ctx.path;
			ctx.init = init;
			ctx.save(); // save before dispatching, which may redirect
			if (false !== dispatch) this.dispatch(ctx, prev);
			return ctx;
		};


		Page.prototype.dispatch = async function (ctx, prev) {
			var i = 0, j = 0, page = this;


			function nextExit() {
				var fn = page.exits[j++];
				if (!fn) return nextEnter();
				let theRoute = simply.page.getRouteByPath(page.current);
				fn(prev, nextExit);
			}


			function nextEnter() {
				var fn = page.callbacks[i++];

				if (ctx.path !== page.current) {
					ctx.handled = false;
					return;
				}
				if (!fn) return unhandled.call(page, ctx);
				fn(ctx, nextEnter);
			}
			nextEnter();
		};

		/**
		 * Register an exit route on `path` with
		 * callback `fn()`, which will be called
		 * on the previous context when a new
		 * page is visited.
		 */
		Page.prototype.exit = function (path, fn) {
			if (typeof path === 'function') {
				return this.exit('*', path);
			}

			var route = new Route(path, null, this);
			let theRoutePath = simply.page.getRouteByPath(path).value.path;

			simply.routes[theRoutePath].exits = simply.routes[theRoutePath].exits ? simply.routes[theRoutePath].exits : [];
			simply.page.deleteExitCallbacksByPath(theRoutePath);

			for (var i = 1; i < arguments.length; ++i) {
				const wrappedFn = route.middleware(arguments[i]);
				this.exits.push(wrappedFn);
				wrappedFn.pureFunc = arguments[i];
				simply.routes[theRoutePath].exits.push(wrappedFn);
			}
			console.log(theRoutePath, "'in exitleri silindi yenisi eklendi");
		};

		/**
		 * Handle "click" events.
		 */

		/* jshint +W054 */
		Page.prototype.clickHandler = function (e) {
			if (1 !== this._which(e)) return;

			if (e.metaKey || e.ctrlKey || e.shiftKey) return;
			if (e.defaultPrevented) return;

			// ensure link
			// use shadow dom when available if not, fall back to composedPath()
			// for browsers that only have shady
			var el = e.target;
			var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

			if (eventPath) {
				for (var i = 0; i < eventPath.length; i++) {
					if (!eventPath[i].nodeName) continue;
					if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
					if (!eventPath[i].href) continue;

					el = eventPath[i];
					break;
				}
			}

			// continue ensure link
			// el.nodeName for svg links are 'a' instead of 'A'
			while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
			if (!el || 'A' !== el.nodeName.toUpperCase()) return;

			// check if link is inside an svg
			// in this case, both href and target are always inside an object
			var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

			// Ignore if tag has
			// 1. "download" attribute
			// 2. rel="external" attribute
			if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

			// ensure non-hash for the same path
			var link = el.getAttribute('href');
			if (!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return;

			// Check for mailto: in the href
			if (link && link.indexOf('mailto:') > -1) return;

			// check target
			// svg target is an object and its desired value is in .baseVal property
			if (svg ? el.target.baseVal : el.target) return;

			// x-origin
			// note: svg links that are not relative don't call click events (and skip page.js)
			// consequently, all svg links tested inside page.js are relative and in the same origin
			if (!svg && !this.sameOrigin(el.href)) return;

			// rebuild path
			// There aren't .pathname and .search properties in svg links, so we use href
			// Also, svg href is an object and its desired value is in .baseVal property
			var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

			path = path[0] !== '/' ? '/' + path : path;

			// strip leading "/[drive letter]:" on NW.js on Windows
			if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
				path = path.replace(/^\/[a-zA-Z]:\//, '/');
			}

			// same page
			var orig = path;
			var pageBase = this._getBase();

			if (path.indexOf(pageBase) === 0) {
				path = path.substr(pageBase.length);
			}

			// console.log({orig, pageBase, path});
			// console.log("last path: ", simply.lastPath, "href: ", el.href, "link:", link)

			if (this.current == path) {
				let route = simply.page.getRouteByPath(path).value;
				if (!route.settings.same_page_refresh) {
					console.log("same page baba, no refresh sana", this, e);
					e.preventDefault();
					return;
				}

			}

			if (this._hashbang) path = path.replace('#!', '');

			if (pageBase && orig === path && (!isLocation || this._window.location.protocol !== 'file:')) {
				return;
			}

			e.preventDefault();
			this.show(orig);
		};

		/**
		 * Handle "populate" events.
		 * @api private
		 */

		Page.prototype._onpopstate = (function () {
			var loaded = false;
			if (!hasWindow) {
				return function () { };
			}
			if (hasDocument && document.readyState === 'complete') {
				loaded = true;
			} else {
				window.addEventListener('load', function () {
					setTimeout(function () {
						loaded = true;
					}, 0);
				});
			}
			return function onpopstate(e) {
				if (!loaded) return;
				var page = this;
				if (e.state) {
					var path = e.state.path;
					e.state.popstate = true;
					page.replace(path, e.state);
				} else if (isLocation) {
					var loc = page._window.location;
					page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
				}
			};
		})();

		/**
		 * Event button.
		 */
		Page.prototype._which = function (e) {
			e = e || (hasWindow && this._window.event);
			return null == e.which ? e.button : e.which;
		};

		/**
		 * Convert to a URL object
		 * @api private
		 */
		Page.prototype._toURL = function (href) {
			var window = this._window;
			if (typeof URL === 'function' && isLocation) {
				return new URL(href, window.location.toString());
			} else if (hasDocument) {
				var anc = window.document.createElement('a');
				anc.href = href;
				return anc;
			}
		};

		/**
		 * Check if `href` is the same origin.
		 * @param {string} href
		 * @api public
		 */
		Page.prototype.sameOrigin = function (href) {
			if (!href || !isLocation) return false;

			var url = this._toURL(href);
			var window = this._window;

			var loc = window.location;

			/*
				When the port is the default http port 80 for http, or 443 for
				https, internet explorer 11 returns an empty string for loc.port,
				so we need to compare loc.port with an empty string if url.port
				is the default port 80 or 443.
				Also the comparition with `port` is changed from `===` to `==` because
				`port` can be a string sometimes. This only applies to ie11.
			*/
			return loc.protocol === url.protocol &&
				loc.hostname === url.hostname &&
				(loc.port === url.port || loc.port === '' && (url.port == 80 || url.port == 443)); // jshint ignore:line
		};

		/**
		 * @api private
		 */
		Page.prototype._samePath = function (url) {
			if (!isLocation) return false;
			var window = this._window;
			var loc = window.location;
			return url.pathname === loc.pathname &&
				url.search === loc.search;
		};

		/**
		 * Remove URL encoding from the given `str`.
		 * Accommodates whitespace in both x-www-form-urlencoded
		 * and regular percent-encoded form.
		 *
		 * @param {string} val - URL component to decode
		 * @api private
		 */
		Page.prototype._decodeURLEncodedURIComponent = function (val) {
			if (typeof val !== 'string') { return val; }
			return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
		};

		/**
		 * Create a new `page` instance and function
		 */
		function createPage() {
			var pageInstance = new Page();

			function pageFn(/* args */) {
				return page.apply(pageInstance, arguments);
			}

			// Copy all of the things over. In 2.0 maybe we use setPrototypeOf
			pageFn.callbacks = pageInstance.callbacks;
			pageFn.exits = pageInstance.exits;
			pageFn.base = pageInstance.base.bind(pageInstance);
			pageFn.strict = pageInstance.strict.bind(pageInstance);
			pageFn.start = pageInstance.start.bind(pageInstance);
			pageFn.stop = pageInstance.stop.bind(pageInstance);
			pageFn.show = pageInstance.show.bind(pageInstance);
			pageFn.back = pageInstance.back.bind(pageInstance);
			pageFn.redirect = pageInstance.redirect.bind(pageInstance);
			pageFn.replace = pageInstance.replace.bind(pageInstance);
			pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
			pageFn.exit = pageInstance.exit.bind(pageInstance);
			pageFn.configure = pageInstance.configure.bind(pageInstance);
			pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
			pageFn.clickHandler = pageInstance.clickHandler.bind(pageInstance);
			pageFn.create = createPage;

			// simply additions
			pageFn.getRoutes = function () {
				return simply.routes;
			}

			pageFn.getCurrentRoute = function () {
				var current = this.current;

				for (const [key, value] of Object.entries(simply.routes)) {
					if (current.match(value.regexp) && key !== "(.*)") {
						return value;
						break;
					}
				}
				return false;
			}

			pageFn.getRouteByPath = function (path) {
				var found = false
				for (const [key, value] of Object.entries(simply.routes)) {
					if (path.match(value.regexp) && key !== "(.*)") {
						found = { key, value };
					}
				}
				// to return "/" child
				if (found) {
					return found
				}

				// bulunamadı ise .*'ı döndür (varsa)
				if (simply.routes["(.*)"]) {
					return {
						key: "(.*)",
						value: simply.routes["(.*)"]
					}
				}

				// o da yoksa false
				return false;
			}

			pageFn.getParentRouteByPath = function (path) {
				var found = false
				for (const [key, value] of Object.entries(simply.routes)) {
					if (path.match(value.regexp) && key !== "(.*)") {
						return { key, value };
						break;
					}
				}

				// bulunamadı ise .*'ı döndür (varsa)
				if (simply.routes["(.*)"]) {
					return {
						key: "(.*)",
						value: simply.routes["(.*)"]
					}
				}

				// o da yoksa false
				return false;
			}

			pageFn.deleteRouteByPath = function (path) {
				console.log("hee", this, page.callbacks);
				let route = pageFn.getRouteByPath(path);
				var rebelCallbacks = route.value.page.callbacks

				for (const [key, v] of Object.entries(route.value.callbacks)) {
					console.log(v);
					const fn = v.originalFn;

					// Remove from global callbacks
					simply.page.callbacks = simply.page.callbacks.filter(cb => cb.originalFn !== fn);

					// Remove from the route page's callbacks (the rebelCallbacks array)
					route.value.page.callbacks = route.value.page.callbacks.filter(cb => cb.originalFn !== fn);
				}
				// Delete the whole route if needed
				simply.routes[route.key].callbacks = [];
			}

			pageFn.deleteExitCallbacksByPath = function (path) {
				let route = pageFn.getRouteByPath(path);
				// console.log(path, route, route.value.page.exits);

				for (const [key, v] of Object.entries(route.value.page.exits)) {
					const fn = v.originalFn;

					// Remove from global callbacks
					simply.page.exits = simply.page.exits.filter(cb => cb.originalFn !== fn);

					// Remove from the route page's callbacks (the rebelCallbacks array)
					route.value.page.exits = route.value.page.exits.filter(cb => cb.originalFn !== fn);
				}
				// Delete the whole route if needed
				simply.routes[route.key].exits = [];
			}

			Object.defineProperty(pageFn, 'len', {
				get: function () {
					return pageInstance.len;
				},
				set: function (val) {
					pageInstance.len = val;
				}
			});

			Object.defineProperty(pageFn, 'current', {
				get: function () {
					return pageInstance.current;
				},
				set: function (val) {
					pageInstance.current = val;
				}
			});

			// In 2.0 these can be named exports
			pageFn.Context = Context;
			pageFn.Route = Route;

			return pageFn;
		}

		/**
		 * Register `path` with callback `fn()`,
		 * or route `path`, or redirection,
		 * or `page.start()`.
		 *
		 *   page(fn);
		 *   page('*', fn);
		 *   page('/user/:id', load, user);
		 *   page('/user/' + user.id, { some: 'thing' });
		 *   page('/user/' + user.id);
		 *   page('/from', '/to')
		 *   page();
		 *
		 * @param {string|!Function|!Object} path
		 * @param {Function=} fn
		 * @api public
		 */

		function page(path, fn) {
			// <callback>
			if ('function' === typeof path) {
				return page.call(this, '*', path);
			}

			async function waitForRenderedAndReturnRoute(el) {
				if (!el) throw new Error("Element not found");

				// Wait for el.rendered to become true (or truthy)
				await new Promise(resolve => {
					let _rendered = el.rendered;

					Object.defineProperty(el, 'rendered', {
						configurable: true,
						enumerable: true,
						get() {
							return _rendered;
						},
						set(value) {
							_rendered = value;
							console.log('rendered changed to:', value);
							if (value) resolve(value);
						},
					});

					if (_rendered) resolve(_rendered);
				});

				// Then wait for 'route' element inside el or el.shadowRoot
				return new Promise(resolve => {
					function check() {
						// normal children
						let routeEl = el.querySelector('route');
						if (routeEl) return routeEl;

						// shadowRoot children
						if (el.shadowRoot) {
							routeEl = el.shadowRoot.querySelector('route');
							if (routeEl) return routeEl;
						}
						return null;
					}

					let found = check();
					if (found) return resolve(found);

					const observer = new MutationObserver(() => {
						const found = check();
						if (found) {
							observer.disconnect();
							resolve(found);
						}
					});

					observer.observe(el, { childList: true, subtree: true });
				});
			}

			async function waitForRendered(component) {
				return new Promise(resolve => {
					if (component.rendered === true) {
						//console.log("Already rendered:", component); 
						return resolve();
					}

					let _rendered = component.rendered;

					Object.defineProperty(component, 'rendered', {
						get() {
							return _rendered;
						},
						set(value) {
							_rendered = value;
							if (value === true) {
								// console.log("Now rendered:", component);
								resolve();
							}
						},
						configurable: true
					});
				});
			}

			if (typeof fn === 'object' && fn !== null && !Array.isArray(fn)) {
				var settings = { ...fn }
				var children = fn.children ? fn.children : undefined;

				// her path'in ilk fonksiyonu
				fn = async function (ctx, next) {
					simply.ctx = ctx;
					// bunu global'e attım çünkü komponent içinden okumak zorundayım
					var route;
					var parent;
					if (settings.child_of) {
						var targetRoute = simply.page.getRouteByPath(settings.path);
						console.log(targetRoute);
						var tree = targetRoute.value.tree;
						var parentRootEl;
						var lastParentComponent;
						var targetParentRoute;

						for (let i = 0; i < tree.length; i++) {
							const path = tree[i];
							const node = simply.routes[path];

							if (i > 0) {
								const parentPath = tree[i - 1];
								parentRootEl = await waitForRenderedAndReturnRoute(parentRootEl.querySelector(lastParentComponent));
								//console.log({parentRootEl, path, parentPath, node});
								//console.log("next target", parentRootEl.querySelector(lastParentComponent));
								//console.log(parentRootEl, path, parentPath);
							}
							else {
								parentRootEl = document.querySelector("route");
							}

							lastParentComponent = node.settings.component;
							targetParentRoute = simply.page.getParentRouteByPath(path).value;
							// console.log({parentRootEl}, targetParentRoute.settings.component);

							let directChild = Array.from(parentRootEl.children).find(
								el => el.matches(targetParentRoute.settings.component)
							);

							// son çocuk/target-route değilse/parent'sa ve router > component şeklinde render edilmemişse
							if (i !== tree.length - 1 && !directChild) {
								let attrs = [];
								if (targetParentRoute.settings.shadow_root == true) attrs.push('shadow');
								if (targetParentRoute.settings.cache) attrs.push('cache');


								window.scrollPositions = window.scrollPositions ? window.scrollPositions : {}
								simply.saveScrollPositions(parentRootEl, tree[i]);


								parentRootEl.innerHTML = `<${targetParentRoute.settings.component} ${attrs.join(' ')}></${targetParentRoute.settings.component}>`;
								if (directChild) {
									// zaten render edilmiş
									// innerHTML ile basmadan düz render()
									console.log("düz render for ", directChild);
									var component = directChild
									directChild.render();
								}
								else {
									directChild = parentRootEl.querySelector(targetParentRoute.settings.component);
								}
								await waitForRenderedAndReturnRoute(directChild);
								directChild.router_settings = settings;
								directChild.ctx = ctx;

								if (directChild.lifecycle && directChild.lifecycle.routerEnter) {
									directChild.lifecycle.routerEnter(ctx);
								}
							}
							//console.log("hedeley", directChild, parentRootEl.parentElement);
							/*
							parentRootEl.parentElement.querySelectorAll("a").forEach(function(a) {
								// console.log(a, path, ctx.path);
								let href = a.getAttribute("href");
								if (href && !href.startsWith('/')) {
									href = '/' + href;
								}							
								let rt = simply.page.getRouteByPath(href)
								if (path == rt.key || href == ctx.path) {
									a.setAttribute("router-active", true);
								}
								else {
									a.removeAttribute("router-active");
								}
							})				
							*/
						}
					}
					// çocuklu route'un son halkası yani target
					if (parentRootEl) {
						route = parentRootEl;
						settings = simply.page.getRouteByPath(path).value.settings
					}
					// or single route
					else {
						route = settings.root ? settings.root : document.querySelector("route");
					}

					let directChild = Array.from(route.children).find(
						el => el.matches(settings.component)
					);

					if (directChild) {
						// zaten render edilmiş
						// innerHTML ile basmadan düz render()
						//console.log("düz render for ", directChild);
						var component = directChild
						directChild.render();

					}
					else {
						console.warn("INNERHTML")
						let attrs = [];
						if (settings.shadow_root == true) attrs.push('shadow');
						if (settings.cache) attrs.push('cache');


						// burada scroll kaydedilebilir
						if (simply.lastPath) {
							window.scrollPositions = window.scrollPositions ? window.scrollPositions : {}
							simply.saveScrollPositions(route, simply.lastPath);
						}
						console.log("heee", settings);
						route.innerHTML = `<${settings.component} ${attrs.join(' ')}></${settings.component}>`;

						var component = route.querySelector(settings.component);
						ctx.component = component;
						component.router_settings = settings;
						component.ctx = ctx;
					}

					if (settings.title) {
						document.title = settings.title
					}

					var comp = directChild || component
					await waitForRendered(comp)
					if (comp.lifecycle && comp.lifecycle.routerEnter) {
						comp.lifecycle.routerEnter(ctx);
					}

					try {
						comp.querySelector("route").innerHTML = ""
					}
					catch (e) { }

					comp.selectLinks = function () {
						if (simply.ctx) {
							let aTags = [];
							let current = comp;

							// tüm linkleri topla
							while (current) {
								if (typeof current.querySelectorAll === "function") {
									aTags.push(...current.querySelectorAll("a"));
								}
								current = current.parent || (current.getRootNode && current.getRootNode().host) || document;
								if (current === document) {
									aTags.push(...document.querySelectorAll("a"));
									break;
								}
							}

							//console.log(simply.ctx.path.split("?")[0], aTags, this.parent, simply.ctx);

							let currentPath = simply.ctx.path.split("?")[0];
							aTags.forEach(function (a) {
								let href = a.getAttribute("href");
								if (href && !href.startsWith('/')) {
									href = '/' + href;
								}

								if (href && href == decodeURIComponent(currentPath)) {
									a.setAttribute("router-active", true);
								}
								else {
									a.removeAttribute("router-active");
								}
								// tree içinde current olandan öncesi için
								// parent linkleri de active edelim
								var targetRoute = simply.page.getRouteByPath(simply.ctx.path.split("?")[0]);
								if (href && targetRoute.value.tree) {
									let tree = targetRoute.value.tree;
									// console.log(tree);
									if (tree.includes(simply.ctx.routePath)) {
										const index = tree.indexOf(simply.ctx.routePath);
										const parentPaths = index !== -1 ? tree.slice(0, index) : [];
										let routePathOfLink = simply.page.getRouteByPath(href);
										// console.log("oooo tree", parentPaths, currentPath, href, routePathOfLink.key, simply.ctx);
										if (parentPaths.includes(routePathOfLink.key)) {
											a.setAttribute("router-active", true);
										}
										// ! çünkü bazen parent link, child'ın içinde de kullanılıyor
										// o durumda aktif etmeye demeye çalıştım burada
										else if (parentPaths.includes(href) && !comp.parent.contains(a)) {
											// console.log(component, a);
											a.setAttribute("router-active", true);
										}
									}
								}
							})
						}
					}
					setTimeout(() => {
						comp.selectLinks();
					}, 0);
					// app içindeki tüm linkler için
					// router-active ekle/sil


					simply.lastPath = ctx.path;
				}

				arguments[1] = fn;
			}


			// route <path> to <callback ...>
			if ('function' === typeof fn) {
				var route = new Route(/** @type {string} */(path), null, this);
				simply.routes = simply.routes ? simply.routes : {}
				simply.routes[route.path] = route;
				simply.routes[route.path].callbacks = simply.routes[route.path].callback ? simply.routes[route.path].callback : [];
				simply.routes[route.path].settings = settings;
				simply.routes[route.path].page = this;

				function registerChildRoutes(children, parentPath = '') {
					if (!children) return;

					for (const child of children) {
						const fullPath = parentPath + child.path;

						// Register current child with full path
						simply.router([{
							...child,
							path: fullPath
						}], parentPath);

						// Recursively handle its children
						if (child.children) {
							registerChildRoutes(child.children, fullPath);
						}
					}
				}

				registerChildRoutes(children, path)

				for (var i = 1; i < arguments.length; ++i) {
					const wrappedFn = route.middleware(arguments[i]);
					this.callbacks.push(wrappedFn);
					simply.routes[route.path].callbacks.push(wrappedFn);

					// Build the tree using `settings.child_of`
					const tree = [];
					let currentPath = route.path;

					while (currentPath && simply.routes[currentPath]) {
						tree.unshift(currentPath); // prepend to maintain order from root to current
						var parent = simply.routes[currentPath] &&
							simply.routes[currentPath].settings &&
							simply.routes[currentPath].settings.child_of;
						currentPath = parent || null;
					}
					if (tree.length > 1) {
						simply.routes[route.path].tree = tree;
					}
				}

				// show <path> with [state]
			} else if ('string' === typeof path) {
				console.log("show or redirect");
				this['string' === typeof fn ? 'redirect' : 'show'](path, fn);
				// start [options]
			} else {
				this.start(path);
			}
			return this;
		}

		/**
		 * Unhandled `ctx`. When it's not the initial
		 * popstate then redirect. If you wish to handle
		 * 404s on your own use `page('*', callback)`.
		 *
		 * @param {Context} ctx
		 * @api private
		 */
		function unhandled(ctx) {
			if (ctx.handled) return;
			var current;
			var page = this;
			var window = page._window;

			if (page._hashbang) {
				current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
			} else {
				current = isLocation && window.location.pathname + window.location.search;
			}

			if (current === ctx.canonicalPath) return;
			page.stop();
			ctx.handled = false;
			isLocation && (window.location.href = ctx.canonicalPath);
		}

		/**
		 * Escapes RegExp characters in the given string.
		 *
		 * @param {string} s
		 * @api private
		 */
		function escapeRegExp(s) {
			return s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
		}

		/**
		 * Initialize a new "request" `Context`
		 * with the given `path` and optional initial `state`.
		 *
		 * @constructor
		 * @param {string} path
		 * @param {Object=} state
		 * @api public
		 */

		function Context(path, state, pageInstance) {
			var _page = this.page = pageInstance || page;
			var window = _page._window;
			var hashbang = _page._hashbang;

			var pageBase = _page._getBase();
			if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
			var i = path.indexOf('?');

			this.canonicalPath = path;
			var re = new RegExp('^' + escapeRegExp(pageBase));
			this.path = path.replace(re, '') || '/';
			if (hashbang) this.path = this.path.replace('#!', '') || '/';

			this.title = (hasDocument && window.document.title);
			this.state = state || {};
			this.state.path = path;
			this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
			this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
			this.params = {};

			// fragment
			this.hash = '';
			if (!hashbang) {
				if (!~this.path.indexOf('#')) return;
				var parts = this.path.split('#');
				this.path = this.pathname = parts[0];
				this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
				this.querystring = this.querystring.split('#')[0];
			}
		}

		/**
		 * Push state.
		 *
		 * @api private
		 */

		Context.prototype.pushState = function () {
			var page = this.page;
			var window = page._window;
			var hashbang = page._hashbang;

			page.len++;
			if (hasHistory) {
				window.history.pushState(this.state, this.title,
					hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
			}
		};

		/**
		 * Save the context state.
		 *
		 * @api public
		 */

		Context.prototype.save = function () {
			var page = this.page;
			if (hasHistory) {
				page._window.history.replaceState(this.state, this.title,
					page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
			}
		};

		/**
		 * Initialize `Route` with the given HTTP `path`,
		 * and an array of `callbacks` and `options`.
		 *
		 * Options:
		 *
		 *   - `sensitive`    enable case-sensitive routes
		 *   - `strict`       enable strict matching for trailing slashes
		 *
		 * @constructor
		 * @param {string} path
		 * @param {Object=} options
		 * @api private
		 */

		function Route(path, options, page) {
			var _page = this.page = page || globalPage;
			var opts = options || {};
			opts.strict = opts.strict || _page._strict;
			this.path = (path === '*') ? '(.*)' : path;
			this.method = 'GET';
			this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
		}

		/**
		 * Return route middleware with
		 * the given callback `fn()`.
		 *
		 * @param {Function} fn
		 * @return {Function}
		 * @api public
		 */
		/*
		Route.prototype.middleware = function(fn) {
			var self = this;
			return function(ctx, next) {
				if (self.match(ctx.path, ctx.params, ctx.routePath)) {
					ctx.routePath = self.path;
					return fn(ctx, next);
				}
				next();
			};
		};
		*/
		Route.prototype.middleware = function (fn) {
			var self = this;
			function wrapper(ctx, next) {
				if (self.match(ctx.path, ctx.params, ctx.routePath)) {
					ctx.routePath = self.path;
					return fn(ctx, next);
				}
				next();
			}
			wrapper.originalFn = fn;  // keep reference to original fn
			return wrapper;
		};

		/**
		 * Check if this route matches `path`, if so
		 * populate `params`.
		 *
		 * @param {string} path
		 * @param {Object} params
		 * @return {boolean}
		 * @api private
		 */

		Route.prototype.findRouteWithPath = function (path) {
			qsIndex = path.indexOf('?'),
				pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
				m = this.regexp.exec(decodeURIComponent(pathname));
			if (!m) return false;
			return m;
		}

		Route.prototype.match = function (path, params) {
			var keys = this.keys,
				qsIndex = path.indexOf('?'),
				pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
				m = this.regexp.exec(decodeURIComponent(pathname));
			if (!m) return false;

			delete params[0];

			for (var i = 1, len = m.length; i < len; ++i) {
				var key = keys[i - 1];
				var val = this.page._decodeURLEncodedURIComponent(m[i]);

				if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
					params[key.name] = val;
				}
			}

			return true;
		};


		/**
		 * Module exports.
		 */

		var globalPage = createPage();
		var page_js = globalPage;
		var default_1 = globalPage;

		page_js.default = default_1;

		return page_js;
	},
	router: function (routes, child_of) {
		// simply.page() load edilmemişse
		if (!simply.page.Context) {
			simply.initRouter();
		}

		simply.page('*', parse)

		function parse(ctx, next) {
			setTimeout(() => {
				ctx.query = simply.qs.parse(location.search.slice(1));
			}, 0);
			next();
		}

		routes.forEach(function (route) {
			simply.page(
				route.path,
				{
					...route,
					child_of
				},
				...(route.callbacks || [])
			);
		});
	},
	getElementUniqueId: function (el) {
		const parts = [];

		while (el) {
			if (el instanceof ShadowRoot) {
				parts.push('shadowroot');
				el = el.host;
				continue;
			}

			const tag = el.tagName.toLowerCase();
			const parent = el.parentNode || el.getRootNode().host;

			if (!parent) break;

			const siblings = Array.from(parent.children);
			const index = siblings.indexOf(el);

			parts.push(`${tag}[${index}]`);
			el = parent instanceof Element ? parent : parent instanceof ShadowRoot ? parent : null;
		}

		return parts.reverse().join(' > ');
	},
	saveScrollPositions: function (root, path) {
		const scrollPositions = {};
		const route = root.querySelector('route');

		function isInsideRoute(el) {
			return route && (route === el || route.contains(el));
		}

		function traverse(el) {
			if (!(el instanceof Element)) return;

			// <route> ve altındakileri atla
			if (isInsideRoute(el)) return;

			// Scroll pozisyonunu kaydet
			if (el.scrollLeft !== 0 || el.scrollTop !== 0) {
				const id = simply.getElementUniqueId(el);
				scrollPositions[id] = {
					x: el.scrollLeft,
					y: el.scrollTop,
				};
			}

			// Shadow DOM varsa içine de gir
			if (el.shadowRoot) {
				for (const child of el.shadowRoot.children) {
					traverse(child);
				}
			}

			// Normal çocuklara da bak
			for (const child of el.children) {
				traverse(child);
			}
		}

		traverse(root);
		window.scrollPositions[path] = scrollPositions;
	},
	qs: (function () {
		var toString = Object.prototype.toString;
		var isint = /^[0-9]+$/;

		function promote(parent, key) {
			if (parent[key].length == 0) return parent[key] = {};
			var t = {};
			for (var i in parent[key]) t[i] = parent[key][i];
			parent[key] = t;
			return t;
		}

		function parse(parts, parent, key, val) {
			var part = parts.shift();
			if (!part) {
				if (Array.isArray(parent[key])) {
					parent[key].push(val);
				} else if (typeof parent[key] === 'object') {
					parent[key] = val;
				} else if (typeof parent[key] === 'undefined') {
					parent[key] = val;
				} else {
					parent[key] = [parent[key], val];
				}
			} else {
				var obj = parent[key] = parent[key] || [];
				if (part === ']') {
					if (Array.isArray(obj)) {
						if (val !== '') obj.push(val);
					} else if (typeof obj === 'object') {
						obj[Object.keys(obj).length] = val;
					} else {
						obj = parent[key] = [parent[key], val];
					}
				} else if (part.indexOf(']') !== -1) {
					part = part.substr(0, part.length - 1);
					if (!isint.test(part) && Array.isArray(obj)) obj = promote(parent, key);
					parse(parts, obj, part, val);
				} else {
					if (!isint.test(part) && Array.isArray(obj)) obj = promote(parent, key);
					parse(parts, obj, part, val);
				}
			}
		}

		function merge(parent, key, val) {
			if (~key.indexOf(']')) {
				var parts = key.split('[');
				parse(parts, parent, 'base', val);
			} else {
				if (!isint.test(key) && Array.isArray(parent.base)) {
					var t = {};
					for (var k in parent.base) t[k] = parent.base[k];
					parent.base = t;
				}
				set(parent.base, key, val);
			}
			return parent;
		}

		function parseObject(obj) {
			var ret = { base: {} };
			Object.keys(obj).forEach(function (name) {
				merge(ret, name, obj[name]);
			});
			return ret.base;
		}

		function parseString(str) {
			return String(str)
				.split('&')
				.reduce(function (ret, pair) {
					try {
						pair = decodeURIComponent(pair.replace(/\+/g, ' '));
					} catch (e) { /* ignore */ }

					var eql = pair.indexOf('=');
					var brace = lastBraceInKey(pair);
					var key = pair.substr(0, brace || eql);
					var val = pair.substr(brace || eql);
					val = val.substr(val.indexOf('=') + 1);

					if (key === '') key = pair, val = '';
					return merge(ret, key, val);
				}, { base: {} }).base;
		}

		function stringify(obj, prefix) {
			if (Array.isArray(obj)) {
				return stringifyArray(obj, prefix);
			} else if (toString.call(obj) === '[object Object]') {
				return stringifyObject(obj, prefix);
			} else if (typeof obj === 'string') {
				return stringifyString(obj, prefix);
			} else {
				return prefix + '=' + obj;
			}
		}

		function stringifyString(str, prefix) {
			if (!prefix) throw new TypeError('stringify expects an object');
			return prefix + '=' + encodeURIComponent(str);
		}

		function stringifyArray(arr, prefix) {
			var ret = [];
			if (!prefix) throw new TypeError('stringify expects an object');
			for (var i = 0; i < arr.length; i++) {
				ret.push(stringify(arr[i], prefix + '[' + i + ']'));
			}
			return ret.join('&');
		}

		function stringifyObject(obj, prefix) {
			var ret = [], keys = Object.keys(obj), key;
			for (var i = 0, len = keys.length; i < len; ++i) {
				key = keys[i];
				ret.push(stringify(obj[key], prefix
					? prefix + '[' + encodeURIComponent(key) + ']'
					: encodeURIComponent(key)));
			}
			return ret.join('&');
		}

		function set(obj, key, val) {
			var v = obj[key];
			if (v === undefined) {
				obj[key] = val;
			} else if (Array.isArray(v)) {
				v.push(val);
			} else {
				obj[key] = [v, val];
			}
		}

		function lastBraceInKey(str) {
			var len = str.length, brace, c;
			for (var i = 0; i < len; ++i) {
				c = str[i];
				if (c === ']') brace = false;
				if (c === '[') brace = true;
				if (c === '=' && !brace) return i;
			}
		}

		// Public API
		return {
			parse: function (str) {
				if (str == null || str === '') return {};
				return typeof str === 'object'
					? parseObject(str)
					: parseString(str);
			},
			stringify: stringify
		};
	})(),
	initRouter: function (a, b) {
		// window.page = simply.page(); // i'll delete this after seeing all examples (search/replace page with simply.page in examples)
		simply.page = simply.page();

		simply.page.configure({ window: window })
		var base = document.querySelector("base[href]");
		if (base) {
			// delete last slach
			var base_href = base.getAttribute("href").replace(/\/$/, "");
			simply.page.base(base_href);
		}
		if (a && b) {
			simply.page.redirect(a, b);
		}
	},
	init: function () {
		//console.clear();
		this.morphdom();
		this.observableSlim();

		// simply.page() load edilmemişse
		simply.page.redirect = function (a, b) {
			simply.initRouter(a, b);
		}

		window.get = this.get;
	}
}
simply.init();