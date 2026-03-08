simply = {
	itemKeyMap: new WeakMap(),
	itemKeyCounter: 0,
	getUniqueId(item) {
		if (typeof item !== 'object' || item === null) return null;
		if (!this.itemKeyMap.has(item)) {
			this.itemKeyMap.set(item, 'autoid-' + (++this.itemKeyCounter));
		}
		return this.itemKeyMap.get(item);
	},
	components: {},

	compile: function (args) {
		var { template, data, style, state, parent, props, component, dom, methods, lifecycle, name } = args;
		let t = template;

		const context = { ...args };
		if (!simply.components[name]?.templateRenderFn) {
			t = t.replace(/`/g, '\\`');
			t = t.replace(/\{\{([\s\S]*?)\}\}/g, '${$1}');

			const EXCLUDED_TAGS = new Set(['if', 'else', 'elsif', 'each', 'static', 'guard', 'slot', 'br', 'hr', 'img', 'input']);

			let localCounter = simply.components[name]._tagCounter || 0;

			// Animate ayarını baştan kontrol edelim
			const isAnimate = component?.settings?.animate;
			const uid = component.uid || 'uid';

			t = t.replace(/<(?!\/)([a-zA-Z0-9-]+)/g, (match, tagName) => {
				const lower = tagName.toLowerCase();
				if (EXCLUDED_TAGS.has(lower)) return match;

				// Eğer animate kapalıysa, etiketi olduğu gibi bırak (sid/sf ekleme)
				if (!isAnimate) return match;

				localCounter++;

				// Base ID'yi oluştur (Örn: "sUID-5")
				const baseSid = `s${uid}-${localCounter}`;

				// RUNTIME MANTIĞI:
				// uniqueItemKey içinde 'np' var mı?
				// VARSA (-1'den büyükse) -> undefined dön (Lit attribute'u siler).
				// YOKSA -> baseSid + uniqueItemKey birleştirip bas.
				return `<${tagName} sid="\${ uniqueItemKey.indexOf('np') > -1 ? undefined : '${baseSid}' + uniqueItemKey }"`;
			});

			simply.components[name]._tagCounter = localCounter;

			t = t.replace(/<static>/gi, '${guard([], () => html\`');
			t = t.replace(/<\/static>/gi, '`)}');

			// --- EACH DÖNGÜSÜ ---
			t = t.replace(/<each\s+([^>]+)>/g, (match, attributes) => {
				const ofAttr = attributes.match(/of="([^"]+)"/)?.[1];
				const asAttr = attributes.match(/as="([^"]+)"/)?.[1];
				const keyAttr = attributes.match(/key="([^"]+)"/)?.[1];
				const indexAttr = attributes.match(/index="([^"]+)"/)?.[1];

				if (!ofAttr || !asAttr) return match;

				const keyVar = keyAttr || '_key';
				const indexVar = indexAttr || '_index';

				// UniqueKey Hesaplama Mantığı (Runtime'da çalışacak kod stringi):
				// ID yoksa 'np' kullan.
				const uniqueKeyLogic = `(Array.isArray(${ofAttr}) ? (typeof ${asAttr} === 'object' && ${asAttr} && 'id' in ${asAttr} ? ${asAttr}.id : 'np') : ${keyVar})`;

				return '${ repeat(Object.entries(' + ofAttr + ' || {}), ([' + keyVar + ']) => ' + keyVar + ', ([' + keyVar + ', ' + asAttr + '], ' + indexVar + ') => { ' +
					'return ((pKey) => { ' +
					// uniqueItemKey burada hesaplanır: Örn: "-12" veya "-np"
					'const uniqueItemKey = pKey + "-" + ' + uniqueKeyLogic + ';' +
					'return html`';
			});

			t = t.replace(/<\/each>/g, '` })(uniqueItemKey); }) }');
			t = t.replace(/<if\s+cond="([^"]+)">/g, '${ $1 ? html`');
			t = t.replace(/<\/(?:if|elsif)>\s*<elsif\s+cond="([^"]+)">/g, '` : $1 ? html`');
			t = t.replace(/<\/(?:if|elsif)>\s*<else>/g, '` : html`');
			t = t.replace(/<\/else>/g, '` }'); // undefined veya nothing gerekmez, blok kapanıyor
			t = t.replace(/<\/(?:if|elsif)>/g, '` : nothing }');

			simply.components[name] = simply.components[name] || {};

			const fnBody = `
        var { template, data, style, state, parent, props, component, dom, methods, lifecycle, name } = scope;
        // Root seviyesinde uniqueItemKey boştur.
        let uniqueItemKey = ""; 
        return html\`${t}\`;
      `;

			simply.components[name].templateRenderFn = new Function("scope", fnBody);
		}

		return simply.components[name].templateRenderFn(context);
	},



	parseTemplate: function (parsingArgs) {
		var { template, data, style, state, parent, props, component, dom, methods, lifecycle, name } = parsingArgs;

		if (!simply.components[name].templateRenderFn) {

			var start = performance.now();
			template = simply.addUniqueKeys(template, component);
			var end = performance.now();
			// console.log("addKeys took " + (end - start) + " ms");

			template = template.replace(/[\r\n]+/g, '');
			if (template.includes('${')) {
				template = template.replace(/\$\{/g, 'minyeli{');
			}

			const bucketParts = [];
			const len = template.length;

			// Regex'ler
			const tagMatchRegex = /(<(?:if\s+cond="([^"]+)"|elsif\s+cond="([^"]+)"|each[^>]*|else|\/(?:each|if|elsif|else))>)/g;
			// const varRegex = /\{([^{}]+)\}/g;

			// https://claude.ai/chat/4fcf31d4-5be9-404e-a786-89f3b9e9172e
			//const varRegex = /(?<!\\\s*)\{([^{}]+)\}/g;

			// https://chatgpt.com/c/6981e017-5720-8384-98c6-d5982304bc06
			const varRegex = /\{\{\s*([^{}]+?)\s*\}\}/g;

			const inTagVarRegex = /:="([^"]+)"/g;

			// Script/style bölgelerini bul ve hariç tut
			const excludeRanges = [];
			let scriptMatch;
			const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
			while ((scriptMatch = scriptRegex.exec(template)) !== null) {
				excludeRanges.push([scriptMatch.index, scriptMatch.index + scriptMatch[0].length]);
			}
			const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
			while ((scriptMatch = styleRegex.exec(template)) !== null) {
				excludeRanges.push([scriptMatch.index, scriptMatch.index + scriptMatch[0].length]);
			}

			function isExcluded(index) {
				for (const [start, end] of excludeRanges) {
					if (index >= start && index < end) return true;
				}
				return false;
			}

			// Tüm logic noktalarını topla
			const logicPoints = [];

			// 1. Custom tag'ları bul
			let tagMatch;
			while ((tagMatch = tagMatchRegex.exec(template)) !== null) {
				if (isExcluded(tagMatch.index)) continue;

				const fullTag = tagMatch[1];
				let logic = "";

				if (fullTag === '</each>') {
					logic = "}};";
				} else if (fullTag === '<else>') {
					logic = "else {";
				} else if (fullTag === '</if>' || fullTag === '</elsif>' || fullTag === '</else>') {
					logic = "}";
				} else if (tagMatch[2]) { // <if cond="...">
					logic = "if (" + unescape(tagMatch[2]) + ") {";
				} else if (tagMatch[3]) { // <elsif cond="...">
					logic = "else if (" + unescape(tagMatch[3]) + ") {";
				} else if (fullTag.startsWith('<each')) {

					const groups = parseEachTag(fullTag);
					const iter = "s" + Math.random().toString(36).slice(2, 7);

					logic = `
    for (let ${iter} in ${groups.of}) {
        if (!Object.prototype.hasOwnProperty.call(${groups.of}, ${iter})) continue;
        const ${groups.as} = ${groups.of}[${iter}];

        // 1. Üst döngüden gelen zinciri al.
        // En dıştaki döngüdeysek 'undefined' olacağı için boş string kabul et.
        const parentChain = (typeof keyChain !== 'undefined') ? keyChain : "";

        // 2. YENİ SCOPE AÇIYORUZ
        {
            // 3. Mevcut zinciri oluştur: (Parent varsa sonuna tire koy) + (Mevcut Index)
            // Örnek: Parent "2-5", iter "3" ise sonuç: "2-5-3"
            // Örnek: Parent "", iter "2" ise sonuç: "2"
            let keyChain = (parentChain === "" ? "" : parentChain + "-") + ${iter};

            // Render fonksiyonun kullandığı değişkene ata
            let uniqueItemKey = keyChain;

            ${groups.key ? `let ${groups.key} = ${iter};` : ""}
            ${groups.index ? `let ${groups.index} = parseInt(${iter});` : ""}
            
            // DİKKAT: Burada süslü parantezi kapatmıyoruz! 
            // Kapanış </each> tag'inde yapılmalı.
    `;
				}

				if (logic) {
					logicPoints.push({
						start: tagMatch.index,
						end: tagMatch.index + fullTag.length,
						logic
					});
				}
			}

			// 2. Variable'ları bul {data.x}
			let varMatch;
			while ((varMatch = varRegex.exec(template)) !== null) {
				if (isExcluded(varMatch.index)) continue;

				// Zaten tag içinde mi kontrol et
				let isInsideTag = false;
				for (const lp of logicPoints) {
					if (varMatch.index >= lp.start && varMatch.index < lp.end) {
						isInsideTag = true;
						break;
					}
				}
				if (isInsideTag) continue;

				let variable = varMatch[1];

				// Object literal check
				if (/^\{.*\}$/.test(variable)) {
					variable = '"' + varMatch[0] + '"';
				}

				logicPoints.push({
					start: varMatch.index,
					end: varMatch.index + varMatch[0].length,
					logic: "ht+=" + variable + ";"
				});
			}

			// 3. In-tag variable'ları bul :="expr"
			let inTagMatch;
			while ((inTagMatch = inTagVarRegex.exec(template)) !== null) {
				if (isExcluded(inTagMatch.index)) continue;

				logicPoints.push({
					start: inTagMatch.index,
					end: inTagMatch.index + inTagMatch[0].length,
					logic: "ht+=" + inTagMatch[1] + ";"
				});
			}

			// Pozisyona göre sırala
			logicPoints.sort((a, b) => a.start - b.start);

			// Bucket oluştur
			let lastEnd = 0;
			for (const point of logicPoints) {
				// Statik text
				if (point.start > lastEnd) {
					const staticText = template.substring(lastEnd, point.start);
					if (staticText.trim()) {
						bucketParts.push("ht+=`" + staticText + "`;");
					}
				}
				bucketParts.push(point.logic);
				lastEnd = point.end;
			}

			// Kalan
			if (lastEnd < len) {
				const remaining = template.substring(lastEnd).trimEnd();
				if (remaining) {
					bucketParts.push("ht+=`" + remaining + "`;");
				}
			}

			function parseEachTag(eachTag) {
				function getAttr(regex) {
					var m = eachTag.match(regex);
					return m ? m[1] : undefined;
				}

				return {
					of: getAttr(/of="([^"]+)"/),
					as: getAttr(/as="([^"]+)"/),
					key: getAttr(/key="([^"]+)"/),
					index: getAttr(/index="([^"]+)"/)
				};
			}

			let bucket = bucketParts.join("").replace(/minyeli/g, '$');


			// handi değişken hangi parent içinde bulmak için
			// https://gemini.google.com/app/970ef2eca93f817e
			// ama ya varaible methods ile script'ten geliyorsa

			simply.components[name].templateRenderFn = new Function(
				"scope",
				`var { template, data, style, state, parent, props, component, dom, methods, lifecycle, name } = scope;
       let ht = "";
       ${bucket}
       return ht;`
			);
		}
		return simply.components[name].templateRenderFn(parsingArgs);
	},

	addUniqueKeys(template, component) {
		const excludedTags = new Set(['if', 'elsif', 'else', 'each']);  // Hızlı lookup için Set

		function addKeysInsideEach(template) {
			let insideEach = 0;
			let tagIndex = 0;
			const tagRe = /<\/?([a-zA-Z][\w:-]*)([^>]*)>/g;

			return template.replace(tagRe, (fullTag, tagName, attrs) => {
				const isClose = fullTag[1] === "/";
				const lowerName = tagName.toLowerCase();

				if (lowerName === "each") {
					insideEach += isClose ? -1 : 1;
					return fullTag;
				}

				if (insideEach > 0 && !isClose) {
					if (excludedTags.has(lowerName)) {
						return fullTag;
					}

					if (/\bkey\s*=/.test(attrs)) {
						return fullTag;
					}
					tagIndex++;
					return `<${tagName} key="${component.uid}-${lowerName}${tagIndex}{{uniqueItemKey}}"${attrs}>`;
				}

				return fullTag;
			});
		}

		template = addKeysInsideEach(template);

		// faster version without random
		let keyi = 0;
		template = template.replace(/<(?!\/)([a-zA-Z0-9-]+)([^>]*)>/g, (match, tagName, attributes) => {
			if (excludedTags.has(tagName.toLowerCase()) || attributes.includes('key=')) {
				return match;
			}
			return `<${tagName} key="${component.uid}-${tagName}-${keyi++}"${attributes}>`;
		});

		// Regex Mantığı:
		// <        -> Küçüktür işaretiyle başla
		// (?!\/)   -> (Negative Lookahead) Eğer hemen devamında '/' varsa (yani kapanışsa) bunu GÖRMEZDEN GEL.
		// ([a-zA-Z0-9-]+) -> Tag ismini yakala (Grup 1)
		// ([^>]*)  -> Kapanış parantezine kadar olan geri kalan her şeyi (attribute'ları) yakala (Grup 2)
		// >        -> Büyüktür işaretiyle bitir
		/*
		bucket = bucket.replace(/<(?!\/)([a-zA-Z0-9-]+)([^>]*)>/g, (match, tagName, attributes) => {
			const rnd = Math.random().toString(36).slice(2, 8);
			return `<${tagName} key="${tagName}-${rnd}"${attributes}>`;
		});
		*/
		// faster version without random
		/*
		let i = 0;
		bucket = bucket.replace(/<(?!\/)([a-zA-Z0-9-]+)([^>]*)>/g, (match, tagName, attributes) => {
			return `<${tagName} key="${tagName}-${i++}"${attributes}>`;  // Veya id için: id="${tagName}-${i++}"
		});
		*/

		return template;
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
	/*
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
	*/

	parseStyle: function (parsingArgs) {
		var { template, data, style, state, parent, props, component, dom, methods, lifecycle, name } = parsingArgs;

		// Eğer önbellekte render fonksiyonu yoksa oluştur
		if (!simply.components[name].styleRenderFn) {

			// --- 1. OPTİMİZE EDİLMİŞ DÖNÜŞTÜRÜCÜ ---
			function convertConditionals(cssString) {
				let s = cssString;

				// --- OPTİMİZASYON 1: AKILLI VAR() KONTROLÜ ---
				// Hedef: Sadece içinde JS mantığı olan var()'ları bulmak.
				// var(--red) gibi native olanları pas geçmek istiyoruz.

				let hasDynamicVar = false;
				let pos = s.indexOf('var(');

				while (pos !== -1) {
					// 'var(' 4 karakter uzunluğunda. Hemen sonrasına bakıyoruz (index 4 ve 5).
					// 45, ASCII tablosunda '-' (tire) işaretidir.
					// Eğer var('dan sonra gelen iki karakter '--' değilse, bu bir JS işlemidir!
					if (s.charCodeAt(pos + 4) !== 45 || s.charCodeAt(pos + 5) !== 45) {
						hasDynamicVar = true;
						break; // Bir tane bile bulsak yeter, Regex çalışmalı.
					}
					// Sonraki var('ı ara
					pos = s.indexOf('var(', pos + 1);
				}

				// Sadece "gerçek" bir JS variable bulduysak Regex çalıştır
				if (hasDynamicVar) {
					s = s.replace(/var\(([^()]*(?:\([^()]*(?:\([^()]*(?:\([^()]*\)[^()]*)*\)[^()]*)*\)[^()]*)*)\)/g, (match, content) => {
						// Regex yine de güvenlik için içeriği kontrol eder (boşluklu yazımlar vs için)
						if (content.trim().startsWith('--')) return match;
						return '` + (' + content + ') + `';
					});
				}

				// --- OPTİMİZASYON 2: COND KONTROLÜ ---
				// Sadece cond:[ varsa işlemleri yap
				if (s.includes('cond:[')) {
					s = s
						.replace(/&cond:\[elsif="(.+?)"\]\s*{/g, '`; else if ($1) { ht+=`')
						.replace(/&cond:\[else\]\s*{/g, '`; else { ht+=`')
						.replace(/&cond:\[if="(.+?)"\]\s*{/g, '`; if ($1) { ht+=`')
						.replace(/ht\+=\`\s*`;\s*(else)/g, '$1');
				}

				return s;
			}

			// --- 2. OPTİMİZE EDİLMİŞ İŞARETLEYİCİ ---
			const markConditions = (str) => {
				let stack = [];
				let nextIsTarget = false;

				// Regex sadece cond, { ve } arar. 
				return str.replace(/(cond:\[)|(\{)|(\})/g, (match, trigger, open, close) => {
					if (trigger) {
						nextIsTarget = true;
						return match;
					}
					if (open) {
						stack.push(nextIsTarget);
						nextIsTarget = false;
						return match;
					}
					if (close) {
						return stack.pop() ? '`;} ht+=`' : match;
					}
				});
			};

			// --- ANA AKIŞ (MAIN FLOW) ---
			var processedCSS = parsingArgs.style;

			// HIZ KAZANCI BURADA:
			// Eğer CSS içinde hiç "cond:[" yoksa, koca bir Lexer/Parser döngüsünü (markConditions)
			// tamamen atlıyoruz. O(N) -> O(0)
			if (processedCSS.includes('cond:[')) {
				processedCSS = markConditions(processedCSS);
			}

			// convertConditionals içinde de benzer check'ler var, oraya paslıyoruz.
			var fixiedConditions = convertConditionals(processedCSS);

			// --- RENDER FONKSİYONU OLUŞTURMA ---
			var renderFunc = "var ht = ``;";
			renderFunc += "ht += `" + fixiedConditions + "`;";

			simply.components[name].styleRenderFn = new Function(
				"scope",
				`var { template, data, style, state, parent, props, component, dom, methods, lifecycle, name } = scope;
         ${renderFunc}
         return ht;`
			);
		}

		return simply.components[name].styleRenderFn(parsingArgs);
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
		var start = performance.now();
		if (!name) {
			// proxy temizleme (split yok)
			const proxy = "cors.woebegone.workers.dev/?";
			let p = path;
			let i = p.indexOf(proxy);
			if (i !== -1) p = p.slice(i + proxy.length);

			path = p;

			// ? ve # kırp
			i = p.indexOf("?");
			if (i !== -1) p = p.slice(0, i);
			i = p.indexOf("#");
			if (i !== -1) p = p.slice(0, i);

			// son / sonrası
			i = p.lastIndexOf("/");
			if (i !== -1) p = p.slice(i + 1);

			// uzantıyı at
			i = p.lastIndexOf(".");
			if (i !== -1) p = p.slice(0, i);

			name = p;
		} else {
			// name'den extension at (split yok)
			let i = name.lastIndexOf(".");
			if (i !== -1) name = name.slice(0, i);
		}


		const isBlob = path.startsWith("blob:");
		// buna gerek kalmadı apache 200 304 yapıyor değişiklikte
		//const fetchUrl = isBlob
		//	? path
		//	: path + (path.includes("?") ? "&" : "?") + "_v=" + Date.now();

		const fetchUrl = path;

		fetch(fetchUrl, { cache: "no-cache" })
			.then(response => {
				// HTTP error ≠ CORS
				if (!response.ok) {
					console.error("HTTP error:", response.status);
					return null;
				}
				return response.text();
			})
			.then(text => {
				if (!text) return;

				let parsed;
				try {
					parsed = simply.splitComponent(text);
				} catch (e) {
					// PARSE HATASI → proxy yok
					console.error("splitComponent error:", e);
					return;
				}

				simply.components[name] = parsed;

				callback({
					name,
					template: parsed.template,
					style: parsed.style,
					script: parsed.script,
					docStr: text
				});
			})
			.catch(error => {
				// SADECE gerçek network / CORS hatası
				const isCorsOrNetworkError =
					error instanceof TypeError &&
					/failed fetch|network|cors/i.test(error.message);

				if (
					isCorsOrNetworkError &&
					!triedWithCorsProxy &&
					!path.startsWith("https://cors.woebegone.workers.dev/")
				) {
					const proxyUrl = "https://cors.woebegone.workers.dev/?" + path;
					simply.loadComponent(proxyUrl, name, callback, true);
				} else {
					console.error(error);
				}
			});
		var end = performance.now();
		// console.log("loadComponent for " + name + " took " + (end - start) + " milliseconds.");
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
		// https://gemini.google.com/app/9788bd4a4f5bfd35
		var start = performance.now();

		let template = "";
		let style = "";
		let script = "";

		// TEK VE GÜÇLÜ REGEX:
		// 1. Grup: Tag ismi (html, style veya script)
		// 2. Grup: İçerik
		// \1 referansı: Başta hangi tag açıldıysa (örn: style), sonda da o kapatılmalı (</style>)
		const regex = /<(html|style|script)[^>]*>([\s\S]*?)<\/\1>/gi;

		let match;

		// exec döngüsü string üzerinde "cursor" mantığıyla ilerler.
		// Stringi kopyalamaz, kesmez, sadece üzerinden geçer.
		while ((match = regex.exec(string)) !== null) {
			const tagName = match[1].toLowerCase();
			const content = match[2];

			if (tagName === 'html') {
				template = content;
			} else if (tagName === 'style') {
				style = content;
			} else if (tagName === 'script') {
				script = content;
			}
		}

		var end = performance.now();
		// console.log("splitComponent (Single Pass Regex) took " + (end - start) + " ms.");

		return {
			template,
			style,
			script
		};
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

	framerStaff: function (dom, name, uid, component, props, lifecycle) {
		// 6. framerComponentObserver
		const framerComponentObserver = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node.nodeType === Node.ELEMENT_NODE) {
						if (node.tagName === "FRAMER-COMPONENT" && !node.hasAttribute("uid")) {
							const framerComponentUid = "id" + Math.random().toString(16).slice(2);
							const path = node.getAttribute("path");
							node.setAttribute("uid", framerComponentUid);
							node.setAttribute("style", "height: auto; width: auto");
							node.setAttribute("rendered", true);

							window.parent.postMessage({
								method: "component-request",
								path,
								name,
								framerComponentUid,
								uid
							}, "*");

							node.addEventListener("click", e => {
								if (node.contains(e.target)) {
									triggerOnTapFromDOM(e.target);
								}
							}, { passive: true });
						}
					}
				}
			}
		});

		framerComponentObserver.observe(dom, {
			childList: true,
			subtree: true
		});

		function triggerOnTapFromDOM(domElement) {
			var current = domElement;

			while (current && current.tagName !== "FRAMER-COMPONENT") {
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
						onTap();
						setTimeout(() => {
							try {
								self.lifecycle.framerComponentClicked(current)
							} catch (e) { }
						}, 0);
						return;
					}
				} catch (e) { }

				try {
					var onTap = fiber.return.child.child.stateNode.props.onTap;
					if (typeof onTap === "function") {
						onTap();
						setTimeout(() => {
							try {
								self.lifecycle.framerComponentClicked(current)
							} catch (e) { }
						}, 0);
						return;
					}
				} catch (e) { }

				current = current.parentElement;
			}
		}

		dom.addEventListener("click", function (e) {
			const target = e.target;
			const link = target.closest("a");

			if (link && (link.closest("framer-component") || link.hasAttribute("route-framer"))) {
				e.preventDefault();
				e.stopPropagation();
				window.parent.postMessage({
					method: 'link-click',
					link: link.getAttribute("href"),
					uid,
					name
				}, '*');
			}
		});
		// 18. Framer props listener
		self.framerPropsListener = function (event) {
			event.preventDefault();
			event.stopPropagation();

			if (event.data.method === "set-props") {
				Object.assign(props, event.data.props);
				if (lifecycle && lifecycle.framerPropsUpdated) {
					lifecycle.framerPropsUpdated();
				}
				component.render();
			}
		};

		component.runInFramer = function (codeToRun) {
			window.parent.postMessage({
				method: 'run-in-framer',
				name,
				uid: uid,
				code: "return " + codeToRun.toString()
			}, '*');
		};

		window.addEventListener("message", self.framerPropsListener);
		window.parent.postMessage({ method: "simply-ready", uid: uid, name }, "*");
	},

	findElementWithCB(element) {
		let current = element;
		while (current) {
			if (current.cb && current.cb.state) {
				return current;
			}
			if (current.parentNode) {
				current = current.parentNode;
			} else if (current.host) {
				current = current.host;
			} else {
				current = null;
			}
		}
		return null;
	},
	classCache: {},
	getDomParentAndShadow(component) {
		var shadow = false;
		if (component.getAttribute("isolated") !== null && component.getAttribute("isolated") !== "false") {
			shadow = true;
		}

		var dom, parent;
		if (shadow) {
			dom = component.attachShadow({ mode: 'open' });
			parent = component.getRootNode().host;
			if (!parent) {
				parent = simply.findShadowRootOrCustomElement(component);
			}
		}
		else {
			dom = component;
			parent = simply.findShadowRootOrCustomElement(component);
		}
		return { dom, parent, shadow };
	},

	pathForTemplateSearch(currentPath, prefix) {
		prefix = prefix || "data";

		// bracket ve indexleri temizle
		// asd["test"] → asd
		// asd[0] → asd
		var clean = currentPath
			.replace(/\[.*?\]/g, "")
			.replace(/\?\./g, "."); // optional chaining safety

		var parts = clean.split(".");
		var out = prefix;

		for (var i = 0; i < parts.length; i++) {
			var p = parts[i];
			if (!p) continue;

			out += "." + p;
			break; // 👈 SADECE BİR NODE
		}

		return [out];
	},

	templateUsesAnyChange(template, changes, prefix) {
		if (template) {
			var normalized = template.replace(/\?\./g, ".");
			for (const { currentPath } of changes) {
				const paths = simply.pathForTemplateSearch(currentPath, prefix);
				for (const path of paths) {
					if (normalized.includes(path)) return true;
				}
			}
		}
		return false;
	},

	react: function (changes, from, component, template, style) {
		if (typeof component.lifecycle !== "undefined") {
			if (from === "props") {
				if (typeof component.lifecycle.whenPropChange !== "undefined") {
					if (component.lifecycle.whenPropChange(changes) === false) {
						return false;
					}
				}
			} else if (from === "state") {
				if (component.lifecycle && component.lifecycle.whenStateChange) {
					if (component.lifecycle.whenStateChange(changes) === false) {
						return false;
					}
				}
			} else if (typeof component.lifecycle.whenDataChange !== "undefined") {
				if (component.lifecycle.whenDataChange(changes) === false) {
					return false;
				}
			}
		}

		if (from === "state") {
			if (!simply.templateUsesAnyChange(template, changes, "state") && !simply.templateUsesAnyChange(style, changes, "state")) {
				return false;
			}
		}
		else if (from === "props") {
			if (!simply.templateUsesAnyChange(template, changes, "props") && !simply.templateUsesAnyChange(style, changes, "props")) {
				return false;
			}
		}
		else if (from === "data") {
			if (!simply.templateUsesAnyChange(template, changes, "data") && !simply.templateUsesAnyChange(style, changes, "data")) {
				return false;
			}
		}

		// console.log(changes);
		component.render(changes);
	},

	getParentState(parent) {
		// 12. Parent'tan state al
		if (parent) {
			let current = parent;
			while (current) {
				if (current.state) {
					return {
						state: current.state,
						cbState: parent.cb.state
					};
				}
				current = current.parent;
			}
		}
		return null;
	},
	setupObservableSlims(self) {
		var t = self.template;

		// DATA
		var data = ObservableSlim.create({}, .1, function (changes) {
			if (self.cb.data) {
				for (const [key, cbFn] of Object.entries(self.cb.data)) {
					if (cbFn) cbFn(changes);
				}
			}
		});

		if (t.includes("data.") || t.includes("data?.") || self.script.includes("data.") || self.script.includes("data?.")) {
			self.cb.data = {};
			self.cb.data[self.uid] = function (changes) { self.react(changes, "data", self, t, self.s) };
			self.setCbData(self.cb.data);
		}

		// PROPS

		for (var i = 0; i < self.attributes.length; i++) {
			var attrib = self.attributes[i];
			if (attrib.name !== "cb") {
				self.props[attrib.name] = simply.parseProp(attrib.value).value;
			}
		}

		var props = ObservableSlim.create(self.props, false, function (changes) {
			if (self.cb.props) {
				for (const [key, cbFn] of Object.entries(self.cb.props)) {
					if (cbFn) cbFn(changes);
				}
			}
		});

		if (t.includes("props.") || t.includes("props?.") || self.script.includes("props.") || self.script.includes("props?.")) {
			self.cb.props = {};
			self.cb.props[self.uid] = function (changes) { self.react(changes, "props", self, t, self.s) };
		}

		// STATE

		// 19. ObservableSlim - STATE
		if (!self.state.__isProxy) {
			var state = ObservableSlim.create({}, false, function (changes) {
				if (self.cb.state) {
					for (const [key, cbFn] of Object.entries(self.cb.state)) {
						if (cbFn) cbFn(changes);
					}
				}
			});
			self.cb.state = {};
			self.cb.state[self.uid] = function (changes) { self.react(changes, "state", self, t, self.s) };
			// ÖNEMLİ: state değişkenini güncelle
		}
		else {
			var state = self.state;
			if (t.includes("state.") || t.includes("state?.") || self.script.includes("state.") || self.script.includes("state?.", self.s.includes("state.") || self.s.includes("state?."))) {
				var p = simply.findElementWithCB(self.parent);
				if (p) {
					p.cb.state[self.uid] = function (changes) { self.react(changes, "state", self, t, self.s) };
				}
			}
		}

		return { data, props, state }
	},
	restoreCache(component) {
		// 7. cache restore - data
		if (component.hasAttribute("cache") && component.getAttribute("cache") !== "false") {
			component.cache = {};
			try {
				var cachedData = simply.cache[simply.lastPath][component.elementId].data;
				if (cachedData) {
					component.cache.data = cachedData;
					for (const key in cachedData) {
						if (Object.hasOwnProperty.call(cachedData, key)) {
							component.data[key] = cachedData[key];
						}
					}
				}
			} catch (e) { }
		}

		// 10. cache restore - props
		if (component.hasAttribute("cache") && component.getAttribute("cache") !== "false") {
			try {
				var cachedProps = simply.cache[simply.lastPath][component.elementId].props;
				if (cachedProps) {
					component.cache.props = cachedProps;
					for (const key in cachedProps) {
						if (Object.hasOwnProperty.call(cachedProps, key)) {
							component.props[key] = cachedProps[key];
						}
					}
				}
			} catch (e) { }
		}
	},

	replaceEventAttrs(template) {
		let m;
		// tüm on.* atribute değerleri için
		// let regex = /\s+on[a-z]+(\s+)?\=(\s+)?(\"|\')(?<match>[^"\n]*)(\"|\')/gm;

		// new line serbest bırakıldı 
		// let regex = /\s+on[a-z]+(\s+)?\=(\s+)?(\"|\')(?<match>[^"']*)(\"|\')/gm;

		// onclick="" içinde ilk tek tırnakta kesilme sorunu düzeltildi
		// https://chatgpt.com/c/69523d00-8a50-8327-95a2-e14875750a0c

		// bir üsttekindeki match eski tarayıcılarda çalışmıyor
		// https://claude.ai/chat/93a1ea38-c790-4209-a758-fdee9f92d9f3

		let regex = /\s+on[a-z]+(\s*)=(\s*)("((?:\\.|[^"])*)"|'((?:\\.|[^'])*)')/gm;

		while ((m = regex.exec(template)) !== null) {
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}

			// m[4] → çift tırnak içindeki değer
			// m[5] → tek tırnak içindeki değer
			let capturedMatch = m[4] || m[5];

			var match = "simply.findShadowRootOrCustomElement(this)";

			if (capturedMatch.indexOf(match) == -1) {
				var builtinVars = ["state.", "parent.", "methods.", "lifecycle.", "data.", "props.", "component.", "dom."];

				var newValue = m[0];
				builtinVars.forEach(v => {
					newValue = newValue.replaceAll(v, match + "." + v);
					newValue = newValue.replaceAll("." + match, "");
				});
				template = template.replaceAll(m[0], newValue);
			}
		}
		return template;
	},

	getClass(script, name) {
		script = script.trim();
		// Class'ı BİR KERE compile et ve cache'le
		if (script) {
			if (!simply.classCache[name]) {
				const className = "simply_" + name.replace(/-/g, "_");
				script = script.replace(
					/^class\s+(simply\s*)?\{/,
					"class " + className + " {"
				);
				simply.classCache[name] = new Function(
					'state', 'methods', 'lifecycle', 'component', 'dom', 'parent', 'simply', 'cb', 'data', 'props',
					script.trim() + "\nreturn simply_" + name.replace(/-/g, '_') + "; //@ sourceURL=" + name + ".html"
				);
			}
			return simply.classCache[name];
		}
	},

	registerComponent: function ({ template, style, name, script, docStr, noFile }) {
		if (!customElements.get(name)) {

			template = simply.replaceEventAttrs(template);
			var CachedClass = simply.getClass(script, name);

			class simplyComponent extends HTMLElement {
				constructor() {
					super();
					this.onParentDataChange = (changes) => this.handleParentReact(changes, "data");
					this.onParentPropsChange = (changes) => this.handleParentReact(changes, "props");
				}

				handleParentReact(changes, type) {
					this.react(changes, type, this, this.template);
				}
				observeAttrChange(el, callback) {
					// https://claude.ai/chat/d3aa22ed-1d5b-4f09-8f32-97010c4f1963
					var observer = new MutationObserver(function (mutations) {
						// Batch processing yapın - her mutation için ayrı ayrı çağırmayın
						const changes = new Map();

						mutations.forEach(function (mutation) {
							if (mutation.type === 'attributes') {
								var newVal = mutation.target.getAttribute(mutation.attributeName);
								changes.set(mutation.attributeName, newVal);
							}
						});

						// Tek seferde callback çağır
						changes.forEach((value, name) => {
							callback(name, value);
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
					// eski construct
					var start = performance.now();
					var { dom, parent, shadow } = simply.getDomParentAndShadow(this);

					var uid = Math.random().toString(36).slice(2, 8);
					var component = this;
					var methods = {};
					var lifecycle = {};
					var props = {};
					var cb = {};
					var sfcClass = {};
					var settings = {};

					const EXCLUDED_KEYS = new Set(['routerSettings', 'ctx']);

					for (const key in this) {
						if (!EXCLUDED_KEYS.has(key) && this.hasOwnProperty(key)) {
							Object.defineProperty(props, key, {
								enumerable: true,
								get: () => this[key],
							});
						}
					}

					Object.assign(this, {
						component,
						dom,
						parent,
						uid,
						shadow,
						template,
						s: style,
						script,
						props,
						cb: {},
						elementId: simply.getElementUniqueId(dom),
						react: simply.react,
						name
					});

					this.setData = function (newValue) { data = newValue; };
					this.setCbData = function (newValue) { cb.data = newValue; };
					this.setState = function (newValue) { state = newValue; };
					this.setCbState = function (newValue) { cb.state = newValue; };
					this.setProps = function (newValue) { props = newValue; };
					this.setCbProps = function (newValue) { cb.props = newValue; };

					const parentState = simply.getParentState(parent);
					this.state = parentState ? parentState.state : {};
					if (parentState) this.cb.state = parentState.cbState;

					var { data, props, state } = simply.setupObservableSlims(this);
					Object.assign(this, { data, props, state });

					ObservableSlim.pause(data);
					ObservableSlim.pause(props);
					ObservableSlim.pause(state);

					// 4. CachedClass varsa çalıştır
					if (CachedClass) {
						var sfcClassDef = CachedClass(state, methods, lifecycle, component, dom, parent, simply, cb, data, props);
						sfcClass = new sfcClassDef();

						// sfcClass'tan initial değerleri al
						Object.assign(data, sfcClass.data || {});
						Object.assign(props, sfcClass.props || {});
						Object.assign(methods, sfcClass.methods || {});
						Object.assign(lifecycle, sfcClass.lifecycle || {});
						Object.assign(settings, sfcClass.settings || {});
					}

					// 5. this'e ata
					Object.assign(this, { sfcClass, settings, lifecycle, methods });

					// Component içinde state tanımlıysa ekle
					if (sfcClass.state) {
						Object.assign(state, sfcClass.state);
					}
					simply.restoreCache(this);

					// 14. Getter/Setter'lar
					Object.defineProperty(this, 'state', {
						get: function () { return state; },
						set: function (v) { state = v; }
					});
					Object.defineProperty(this, 'parent', {
						get: function () { return parent; },
						set: function (v) {
							parent = v;
						}
					});


					// eski afterConstruct sonu
					// connectedcallback

					var end = performance.now();
					// console.log(`Component ${name} connected in ${end - start} ms`);

					var self = this;
					this._attrObserver = this.observeAttrChange(this, function (name, newValue) {
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

					function extractParentBindings(template) {
						var bindings = {};

						// Tüm parent...data/props pattern'lerini tek seferde bul
						const regex = /((?:parent\??\.))+(?=(data|props)\??[\.\[])/g;

						let match;
						while ((match = regex.exec(template)) !== null) {
							const parentPart = match[0];
							const bindType = match[2];

							// "parent." veya "parent?." sayısı = depth
							const depth = (parentPart.match(/parent\??\.?/g) || []).length;
							const index = depth - 1;

							if (!bindings[index]) bindings[index] = {};
							bindings[index][bindType] = true;
						}
						return bindings;
					}

					// parent değişkenleri değişince
					// velet de tepki versin diye

					// template’ten bağlanacak parent’ları çıkar
					var bindings;
					if (!simply.components[name].bindingsCache) {
						bindings = simply.components[name].bindingsCache = extractParentBindings(template);
					}
					else {
						bindings = simply.components[name].bindingsCache;
					}

					for (const [index, bind] of Object.entries(bindings)) {
						let current = this.parent;
						let i = 0;

						// Direkt gerekli parent'a git
						while (current && i < index) {
							current = current.parent;
							i++;
						}

						if (!current?.cb) continue;

						if (bind.data && current.cb.data) {
							current.cb.data[this.uid] = this.onParentDataChange;
						}
						if (bind.props && current.cb.props) {
							current.cb.props[this.uid] = this.onParentPropsChange;
						}
					}

					// 15. initial render

					setTimeout(() => {
						if (this.lifecycle?.afterConstruct) {
							this.lifecycle.afterConstruct();
						}
						this.render();
					}, 0);
				}
				render() {
					// console.log("render for ", name);

					var tmpl = template;

					let parsingArgs = {
						template: tmpl,
						style,
						data: this.data,
						state: this.state,
						parent: this.parent,
						methods: this.methods,
						props: this.props,
						component: this.component,
						dom: this.dom,
						methods: this.methods,
						lifecycle: this.lifecycle,
						name: this.name
					}

					var self = this;


					if (!this.rendered) {
						// console.log("initial render for ", name);
						this.rendered = true;
						// let parsedTemplate = simply.parseTemplate(parsingArgs);
						let compiledTemplate = simply.compile(parsingArgs);
						// console.log(compiledTemplate, "asd");

						// console.log(`Initial render for ${name} took ${t1 - t0} ms`);

						var t0 = performance.now();
						var parsedStyle = simply.parseStyle(parsingArgs);
						simply.components[name].lastParsedStyle = parsedStyle;
						var t1 = performance.now();
						// console.log(`Style parsing for ${name} took ${t1 - t0} ms`);

						var start = performance.now();
						this.sheet = new CSSStyleSheet();

						if (!this.shadow) {
							document.adoptedStyleSheets = [this.sheet, ...document.adoptedStyleSheets];

							const sheets = document.adoptedStyleSheets;
							if (!sheets.includes(this.sheet)) {
								sheets.push(this.sheet);
							}

							var end = performance.now();
							//console.log(`Adopting sheet to document for ${name} took ${end - start} ms`);
						}
						else {
							const sheets = this.dom.adoptedStyleSheets;
							if (!sheets.includes(this.sheet)) {
								sheets.push(this.sheet);
							}
							// console.log("shadow");
						}

						this.sheet.replaceSync(parsedStyle);

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

						var t0 = performance.now();

						render(
							compiledTemplate,
							this.dom
						);

						var t1 = performance.now();
						// console.log(`DOM insertion for ${name} took ${t1 - t0} ms`);

						//const t1 = performance.now();
						//console.log((t1 - t0) + " put milliseconds.", name);

						ObservableSlim.resume(self.data);
						ObservableSlim.resume(self.state);
						ObservableSlim.resume(self.props);

						if (document.location.href == "about:blank") {
							// Framer ortamında
							simply.framerStaff(this.dom, name, this.uid, this.component, this.props, this.lifecycle);
						}

						if (typeof this.lifecycle !== "undefined") {
							if (typeof this.lifecycle.afterFirstRender !== "undefined") {
								this.lifecycle.afterFirstRender();
							}
						}
						this.renderingDone = true;

						var comp = this.component;
						var p = this.props;

						// bu transition için
						// 2. Transition kontrolünü rAF'tan ÖNCE yap (Burası işin sırrı)
						// Bu işlem senkrondur ve CPU'yu yormaz.
						const transition = comp.routerSettings && 'transition' in comp.routerSettings
							? comp.routerSettings.transition
							: (simply.routerSettings && simply.routerSettings.transition);

						// 3. EĞER Transition varsa pahalı yola (rAF -> setTimeout) gir
						if (transition) {
							requestAnimationFrame(() => {
								ObservableSlim.pause(p);

								// hack: stop transition to initial values on first render
								this.dom.style.transition = "none";

								setTimeout(() => {
									comp.style.transition = ""; // extension of the hack

									var stagger = comp.routerSettings && 'stagger' in comp.routerSettings
										? comp.routerSettings.stagger
										: (simply.routerSettings && simply.routerSettings.stagger);

									if (stagger) {
										if (!self.parent) {
											// ilk seviye, no delay
											comp.setAttribute("enter", "");
										} else {
											comp.stagger = stagger + (self.parent.stagger || 0);

											// parent tamamlanmamışsa bekle
											if (typeof self.parent.completed === "undefined") {
												// console.log("stag this", comp);
												comp.staggerFn = setTimeout(() => {
													comp.setAttribute("enter", "");
													clearTimeout(comp.staggerFn);
												}, comp.stagger);
											} else {
												// console.log("no stag for this", comp);
												comp.setAttribute("enter", "");
											}
										}
									} else {
										// stagger = 0 ise direkt çalıştır
										comp.setAttribute("enter", "");
									}

									ObservableSlim.resume(p);
								}, 0);
							});
						}
						// 4. EĞER Transition YOKSA (Hızlı Yol - Fast Path)
						else {
							// rAF yok, setTimeout yok, bekleme yok.
							// Direkt bitti olarak işaretle.
							comp.completed = true;

							// ÖNEMLİ: Eğer CSS'te elemanın görünmesi [enter] attribute'una bağlıysa
							// buraya da eklemelisin. Animasyonsuz anında görünsün diye:
							// comp.setAttribute("enter", ""); 
						}

					}
					else {
						var start = performance.now();
						// console.log("rerender for ", name);
						if (typeof this.lifecycle !== "undefined") {
							if (typeof this.lifecycle.beforeRerender !== "undefined") {
								this.lifecycle.beforeRerender();
							}
						}

						// let parsedTemplate = simply.parseTemplate(parsingArgs);
						let compiledTemplate = simply.compile(parsingArgs);
						var end = performance.now();
						// console.log(`Render function for ${name} took ${end - start} ms`);

						//var start = performance.now();
						// 0ms now, congrats to me
						var parsedStyle = simply.parseStyle(parsingArgs);
						//var end = performance.now();
						//console.log(`Style re parsing for ${name} took ${end - start} ms`);

						if (simply.components[name].lastParsedStyle !== parsedStyle) {
							simply.components[name].lastParsedStyle = parsedStyle;
							//console.log("stil değişmiş", simply.components[name].lastParsedStyle, parsedStyle);
							let start = performance.now();

							// bu performance düşmanı
							self.sheet.replaceSync(parsedStyle);
							let end = performance.now();
							// console.log(`Style re applying for ${name} took ${end - start} ms`);
						}


						render(
							compiledTemplate,
							self.dom
						);


						if (typeof this.lifecycle !== "undefined") {
							if (typeof this.lifecycle.afterRerender !== "undefined") {
								this.lifecycle.afterRerender();
							}
						}
						var end = performance.now();
						// console.log(`Component ${name} rendered in ${end - start} ms`);
					}

					// cache data and props after every render
					if ('cache' in this.props) {
						// component tag has cache attribute
						// only do if cache enabled

						try {

							let tagName = this.component.tagName.toLowerCase();
							let tagNameOfRoute = simply.go.getRouteByPath(simply.lastPath).value.settings.component;

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

					// console.log("this thist his")
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

					if (this._attrObserver) {
						this._attrObserver.disconnect();
						this._attrObserver = null;
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
	findShadowRootOrCustomElement: function (element) {
		// console.log(element);
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
						// setTimeout(function () {
						if (numChanges === changes.length) {

							// we create a copy of changes before passing it to the observer functions because even if the observer function
							// throws an error, we still need to ensure that changes is reset to an empty array so that old changes don't persist
							var changesCopy = changes.slice(0);
							changes = [];

							// invoke any functions that are observing changes
							for (var i = 0; i < observable.observers.length; i++) observable.observers[i](changesCopy);

						}
						// }, (domDelayIsNumber && domDelay > 0) ? domDelay : 10);
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
	go: function () {
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
		 * The go instance
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
		 * Configure the instance of go. This can be called multiple times.
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
			// prevContent was always same so i added by swallow copying to ctx.go.simplyPrevContext
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
		 * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to go.base
		 * @param {Object=} state
		 * @api public
		 */

		Page.prototype.back = function (path, state) {
			var go = this;
			if (this.len > 0) {
				var window = this._window;
				// this may need more testing to see if all browsers
				// wait for the next tick to go back in history
				hasHistory && window.history.back();
				this.len--;
			} else if (path) {
				setTimeout(function () {
					go.show(path, state);
				});
			} else {
				setTimeout(function () {
					go.show(go._getBase(), state);
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

			if (simply.preserveParams && simply.preserveParams.length > 0) {
				const urlParams = new URLSearchParams(window.location.search);
				const filteredParams = new URLSearchParams();

				for (const [key, value] of urlParams.entries()) {
					if (simply.preserveParams.includes(key)) {
						filteredParams.append(key, value);
					}
				}

				const filteredQuery = filteredParams.toString();

				if (typeof to === 'string' && !to.includes('?') && filteredQuery) {
					to += '?' + filteredQuery;
				}
			}

			// Define route from a path to another
			if ('string' === typeof from && 'string' === typeof to) {
				go.call(this, from, function (e) {
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
			var i = 0, j = 0, go = this;


			function nextExit() {
				var fn = go.exits[j++];
				if (!fn) return nextEnter();
				let theRoute = simply.go.getRouteByPath(go.current);
				fn(prev, nextExit);
			}


			function nextEnter() {
				var fn = go.callbacks[i++];

				if (ctx.path !== go.current) {
					ctx.handled = false;
					return;
				}
				if (!fn) return unhandled.call(go, ctx);
				fn(ctx, nextEnter);
			}

			function getAllElementsOf(comp) {
				const result = [];

				function walk(el) {
					const tag = el.tagName.toLowerCase();

					if (tag === 'route' || tag === 'style') return;
					result.push(el);

					// light DOM çocukları
					el.childNodes.forEach(child => {
						if (child.nodeType === 1) walk(child);
					});

					// shadow DOM varsa
					if (el.shadowRoot) {
						el.shadowRoot.childNodes.forEach(child => {
							if (child.nodeType === 1) walk(child);
						});
					}
				}

				// comp her zaman dahil
				result.push(comp);

				// comp içindekileri kontrol et
				comp.childNodes.forEach(child => {
					if (child.nodeType === 1) walk(child);
				});
				if (comp.shadowRoot) {
					comp.shadowRoot.childNodes.forEach(child => {
						if (child.nodeType === 1) walk(child);
					});
				}

				return result;
			}

			function handleTransition(comp, type, updateContext, delay) {
				// render() tarafından oluştuluyor
				clearTimeout(comp.fallbackTimeout);
				// 🔥 önceki fallback'i iptal et
				clearTimeout(comp.staggerFn);

				const run = () => {
					// --- Interruption Handling ---
					if (comp.activeTransitionController) {
						comp.activeTransitionController.abort();
					}

					const controller = new AbortController();
					comp.activeTransitionController = controller;
					comp.completed = false;

					const onComplete = () => {
						if (controller.signal.aborted) {
							comp.completed = false;
							return;
						}
						comp.completed = true;
						delete comp.activeTransitionController;
						clearTimeout(comp.fallbackTimeout); // ✅ fallback'i temizle

						if (type === "exit") comp.remove();

						if (updateContext) {
							console.log("Router context updated!");
							nextEnter();
						}
					};

					if (type === "enter") comp.setAttribute("enter", "");
					else comp.removeAttribute("enter");

					if (controller.signal.aborted) {
						comp.completed = false;
						return;
					}

					const transitioningElements = [comp, ...getAllElementsOf(comp)].filter(el => {
						const style = getComputedStyle(el);
						const durations = style.transitionDuration.split(',').map(s => parseFloat(s));
						return durations.some(d => d > 0);
					});

					if (transitioningElements.length === 0) {
						onComplete();
						return;
					}

					let maxDuration = 0;
					for (const el of transitioningElements) {
						const style = getComputedStyle(el);
						const durations = style.transitionDuration.split(',').map(s => parseFloat(s) * 1000);
						const delays = style.transitionDelay.split(',').map(s => parseFloat(s) * 1000);
						const maxElDuration = Math.max(...durations.map((d, i) => d + (delays[i] || 0)));
						maxDuration = Math.max(maxDuration, maxElDuration);
					}

					let remaining = transitioningElements.length;
					const checkDone = () => {
						if (--remaining === 0) onComplete();
					};

					for (const el of transitioningElements) {
						const handler = (event) => {
							if (event.target === el) {
								el.removeEventListener("transitionend", handler);
								checkDone();
							}
						};
						el.addEventListener("transitionend", handler, { signal: controller.signal });
					}

					// ✅ fallback timeout (geçmiş fallback'leri iptal edecek)
					if (type == "exit") {
						comp.fallbackTimeout = setTimeout(() => {
							console.log("⚠️ Transition fallback triggered:", comp);
							onComplete();
						}, maxDuration + delay);
					}
				};

				if (delay > 0) {
					setTimeout(run, delay);
				} else {
					run();
				}
			}



			if (prev) {
				var to = simply.go.getRouteByPath(go.current);
				var toTree = to.value && to.value.tree && to.value.path ? [...to.value.tree] : [];
				var contextUpdateFlag = false;

				if (toTree.length == 0) toTree.push(to.value.path);
				toTree.reverse();

				const currentRoutes = Array.from(document.querySelectorAll('route'))
					.map(r => r.firstElementChild)
					.filter(Boolean).reverse();

				var enterThose = currentRoutes.filter(r =>
					toTree.includes(r.routerSettings.path)
				);

				const exitThose = currentRoutes.filter(r =>
					!toTree.includes(r.routerSettings.path)
				);

				/* bu her konuşda stagger ekliyordu
				belki bi optiyon olabilir stager: crazy diye :P
					enterThose.forEach((comp, index) => {
						const stagger = comp.routerSettings && 'stagger' in comp.routerSettings
							? comp.routerSettings.stagger
							: (simply.routerSettings && simply.routerSettings.stagger) || 0;
						handleTransition(comp, "enter", false, index * stagger);
					});
				*/
				// artık comp current route içinde ise (görünürde)
				// stargger olmadan başlat çünkü görünürse zaten bi kere stag etmiştir
				enterThose.forEach((comp, index) => {
					const inCurrent = currentRoutes.includes(comp);

					const transition = comp.routerSettings && 'transition' in comp.routerSettings
						? comp.routerSettings.transition
						: (simply.routerSettings && simply.routerSettings.transition);

					const stagger = inCurrent
						? 0 // zaten currentRoutes'ta varsa gecikme olmasın
						: (
							(comp.routerSettings && 'stagger' in comp.routerSettings
								? comp.routerSettings.stagger
								: (simply.routerSettings && simply.routerSettings.stagger)
							) || 0
						);

					if (transition) {
						handleTransition(comp, "enter", false, index * stagger);
					}

				});

				/* bu her konuşda stagger ekliyordu
				exitThose.forEach((comp, index) => {
					const stagger = comp.routerSettings && 'stagger' in comp.routerSettings
						? comp.routerSettings.stagger
						: (simply.routerSettings && simply.routerSettings.stagger) || 0;
		
					// if last one, update context
					contextUpdateFlag = index == exitThose.length - 1;
					handleTransition(comp, "exit", contextUpdateFlag, index * stagger);
				});
				*/

				// artık comp current route içinde ise (görünürde)
				// stargger olmadan başlat çünkü görünürse zaten bi kere stag etmiştir
				exitThose.forEach((comp, index) => {

					const transition = comp.routerSettings && 'transition' in comp.routerSettings
						? comp.routerSettings.transition
						: (simply.routerSettings && simply.routerSettings.transition);

					let stagger = comp.routerSettings && 'stagger' in comp.routerSettings ? comp.routerSettings.stagger : (simply.routerSettings && simply.routerSettings.stagger) || 0;
					if (!comp.completed) stagger = 0;
					// if last one, update context 
					if (transition) {
						contextUpdateFlag = index == exitThose.length - 1;
						handleTransition(comp, "exit", contextUpdateFlag, index * stagger);
					}
					else {
						contextUpdateFlag = false;
					}
				});

				// gidilen route'a ait component piyasada yoksa
				// düz render'ı ve context update'i çalıştırmak için
				// redirect edilmişse settings.component yok
				try {
					const targetComponent = to.value.settings.component;

					const hasComponent = enterThose.some(r =>
						r.routerSettings.component === targetComponent
					);
				}
				catch (e) {
					var hasComponent = false;
				}

				if (!hasComponent && !contextUpdateFlag) {
					// enterThose içinde component yoksa yapılacak şey
					// console.log("Component not found in enterThose");
					nextEnter();
				}
				// console.log({ enterThose, exitThose, toTree, currentRoutes, to });
			}
			else {
				nextEnter();
			}
		};

		/**
		 * Register an exit route on `path` with
		 * callback `fn()`, which will be called
		 * on the previous context when a new
		 * go is visited.
		 */
		Page.prototype.exit = function (path, fn) {
			if (typeof path === 'function') {
				return this.exit('*', path);
			}

			var route = new Route(path, null, this);
			let theRoutePath = simply.go.getRouteByPath(path).value.path;

			simply.routes[theRoutePath].exits = simply.routes[theRoutePath].exits ? simply.routes[theRoutePath].exits : [];
			simply.go.deleteExitCallbacksByPath(theRoutePath);

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
			// note: svg links that are not relative don't call click events (and skip go.js)
			// consequently, all svg links tested inside go.js are relative and in the same origin
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

			// same go
			var orig = path;
			var goBase = this._getBase();

			if (path.indexOf(goBase) === 0) {
				path = path.substr(goBase.length);
			}

			// console.log({orig, goBase, path});
			// console.log("last path: ", simply.lastPath, "href: ", el.href, "link:", link)

			if (this.current == path) {
				let route = simply.go.getRouteByPath(path).value;
				if (!route.settings.same_go_refresh) {
					// console.log("same go baba, no refresh sana", this, e);
					e.preventDefault();
					return;
				}

			}

			if (this._hashbang) path = path.replace('#!', '');

			if (goBase && orig === path && (!isLocation || this._window.location.protocol !== 'file:')) {
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
				var go = this;
				if (e.state) {
					var path = e.state.path;
					e.state.popstate = true;
					go.replace(path, e.state);
				} else if (isLocation) {
					var loc = go._window.location;
					go.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
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
		 * Create a new `go` instance and function
		 */
		function createPage() {
			var goInstance = new Page();

			function goFn(/* args */) {
				return go.apply(goInstance, arguments);
			}

			// Copy all of the things over. In 2.0 maybe we use setPrototypeOf
			goFn.callbacks = goInstance.callbacks;
			goFn.exits = goInstance.exits;
			goFn.base = goInstance.base.bind(goInstance);
			goFn.strict = goInstance.strict.bind(goInstance);
			goFn.start = goInstance.start.bind(goInstance);
			goFn.stop = goInstance.stop.bind(goInstance);
			goFn.show = goInstance.show.bind(goInstance);
			goFn.back = goInstance.back.bind(goInstance);
			goFn.redirect = goInstance.redirect.bind(goInstance);
			goFn.replace = goInstance.replace.bind(goInstance);
			goFn.dispatch = goInstance.dispatch.bind(goInstance);
			goFn.exit = goInstance.exit.bind(goInstance);
			goFn.configure = goInstance.configure.bind(goInstance);
			goFn.sameOrigin = goInstance.sameOrigin.bind(goInstance);
			goFn.clickHandler = goInstance.clickHandler.bind(goInstance);
			goFn.create = createPage;
			goFn.setup = function (a, b) {
				var initialSeup = false;
				if (Array.isArray(a) && b) {
					// dynamic setup called to create nested routes
					var routes = a;
					var child_of = b
				}
				else if (a && typeof a === "object" && !Array.isArray(a)) {
					// initial setup with settings
					var settings = a;
					simply.routerSettings = settings;
					var routes = b
					var initialSeup = true;
				}
				else {
					// initial setup without settings 
					var routes = a;
					var initialSeup = true;
				}

				if (simply.routerSettings && simply.routerSettings.redirects) {
					simply.routerSettings.redirects.forEach(function (redirect) {
						simply.go.redirect(redirect.from, redirect.to);
					});
				}

				if (initialSeup) {
					simply.go('*', parse)

					function parse(ctx, next) {
						setTimeout(() => {
							ctx.query = simply.qs.parse(location.search.slice(1));
						}, 0);
						next();
					}
				}

				routes.forEach(function (route) {
					simply.go(
						route.path,
						{
							...route,
							child_of
						},
						...(route.callbacks || [])
					);
				});

				if (initialSeup) {
					simply.go();
				}
			};
			goFn.preserveParams = function (params) {
				if (!simply.preserveParams) {
					simply.preserveParams = [];
				}
				simply.preserveParams.push(...params);
			}

			// simply additions
			goFn.getRoutes = function () {
				return simply.routes;
			}

			goFn.getCurrentRoute = function () {
				var current = this.current;

				for (const [key, value] of Object.entries(simply.routes)) {
					if (current.match(value.regexp) && key !== "(.*)") {
						return value;
						break;
					}
				}
				return false;
			}

			goFn.getRouteByPath = function (path) {
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

			goFn.getParentRouteByPath = function (path) {
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

			goFn.deleteRouteByPath = function (path) {
				//console.log("hee", this, go.callbacks);
				let route = goFn.getRouteByPath(path);
				var rebelCallbacks = route.value.go.callbacks

				for (const [key, v] of Object.entries(route.value.callbacks)) {
					// console.log(v);
					const fn = v.originalFn;

					// Remove from global callbacks
					simply.go.callbacks = simply.go.callbacks.filter(cb => cb.originalFn !== fn);

					// Remove from the route go's callbacks (the rebelCallbacks array)
					route.value.go.callbacks = route.value.go.callbacks.filter(cb => cb.originalFn !== fn);
				}
				// Delete the whole route if needed
				simply.routes[route.key].callbacks = [];
			}

			goFn.deleteExitCallbacksByPath = function (path) {
				let route = goFn.getRouteByPath(path);
				// console.log(path, route, route.value.go.exits);

				for (const [key, v] of Object.entries(route.value.go.exits)) {
					const fn = v.originalFn;

					// Remove from global callbacks
					simply.go.exits = simply.go.exits.filter(cb => cb.originalFn !== fn);

					// Remove from the route go's callbacks (the rebelCallbacks array)
					route.value.go.exits = route.value.go.exits.filter(cb => cb.originalFn !== fn);
				}
				// Delete the whole route if needed
				simply.routes[route.key].exits = [];
			}

			Object.defineProperty(goFn, 'len', {
				get: function () {
					return goInstance.len;
				},
				set: function (val) {
					goInstance.len = val;
				}
			});

			Object.defineProperty(goFn, 'current', {
				get: function () {
					return goInstance.current;
				},
				set: function (val) {
					goInstance.current = val;
				}
			});

			// In 2.0 these can be named exports
			goFn.Context = Context;
			goFn.Route = Route;

			return goFn;
		}

		/**
		 * Register `path` with callback `fn()`,
		 * or route `path`, or redirection,
		 * or `go.start()`.
		 *
		 *   go(fn);
		 *   go('*', fn);
		 *   go('/user/:id', load, user);
		 *   go('/user/' + user.id, { some: 'thing' });
		 *   go('/user/' + user.id);
		 *   go('/from', '/to')
		 *   go();
		 *
		 * @param {string|!Function|!Object} path
		 * @param {Function=} fn
		 * @api public
		 */

		function go(path, fn) {
			// <callback>
			if ('function' === typeof path) {
				return go.call(this, '*', path);
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
							// console.log('rendered changed to:', value);
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
						var targetRoute = simply.go.getRouteByPath(settings.path);
						// console.log(targetRoute);
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
							targetParentRoute = simply.go.getParentRouteByPath(path).value;
							// console.log({parentRootEl}, targetParentRoute.settings.component);

							let directChild = Array.from(parentRootEl.children).find(
								el => el.matches(targetParentRoute.settings.component)
							);

							// son çocuk/target-route değilse/parent'sa ve router > component şeklinde render edilmemişse
							if (i !== tree.length - 1 && !directChild) {
								let attrs = [];
								if (targetParentRoute.settings.isolated == true) attrs.push('shadow');
								if (targetParentRoute.settings.cache) attrs.push('cache');


								window.scrollPositions = window.scrollPositions ? window.scrollPositions : {}
								simply.saveScrollPositions(parentRootEl, tree[i]);


								parentRootEl.innerHTML = `<${targetParentRoute.settings.component} ${attrs.join(' ')}></${targetParentRoute.settings.component}>`;

								if (directChild) {
									// zaten render edilmiş
									// innerHTML ile basmadan düz render()
									// console.log("düz render for ", directChild);
									var component = directChild;

									directChild.render();
								}
								else {
									directChild = parentRootEl.querySelector(targetParentRoute.settings.component);
								}
								await waitForRenderedAndReturnRoute(directChild);
								directChild.routerSettings = node.settings;
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
								let rt = simply.go.getRouteByPath(href)
								if (path == rt.key || href == ctx.path) {
									a.setAttribute("go-active", true);
								}
								else {
									a.removeAttribute("go-active");
								}
							})				
							*/
						}
					}
					// çocuklu route'un son halkası yani target
					if (parentRootEl) {
						route = parentRootEl;
						settings = simply.go.getRouteByPath(path).value.settings
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
						var component = directChild;
						directChild.render();

					}
					else {
						// console.warn("INNERHTML")
						let attrs = [];
						if (settings.isolated == true) attrs.push('shadow');
						if (settings.cache) attrs.push('cache');


						// burada scroll kaydedilebilir
						if (simply.lastPath) {
							window.scrollPositions = window.scrollPositions ? window.scrollPositions : {}
							simply.saveScrollPositions(route, simply.lastPath);
						}
						// console.log("heee", settings);
						route.innerHTML = `<${settings.component} ${attrs.join(' ')}></${settings.component}>`;

						var component = route.querySelector(settings.component);
						ctx.component = component;
						component.routerSettings = settings;
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
								let href = "/" + a.href.replace(document.querySelector("base").href, "");
								// let href = a.getAttribute("href");
								if ((href && !href.startsWith('/')) || href == "") {
									href = '/' + href;
								}

								if (href && href == decodeURIComponent(currentPath)) {
									a.setAttribute("go-active", true);
								}
								else {
									a.removeAttribute("go-active");
								}
								// tree içinde current olandan öncesi için
								// parent linkleri de active edelim
								var targetRoute = simply.go.getRouteByPath(simply.ctx.path.split("?")[0]);
								if (href && targetRoute.value.tree) {
									let tree = targetRoute.value.tree;
									// console.log(tree);
									if (tree.includes(simply.ctx.routePath)) {
										const index = tree.indexOf(simply.ctx.routePath);
										const parentPaths = index !== -1 ? tree.slice(0, index) : [];
										let routePathOfLink = simply.go.getRouteByPath(href);
										// console.log("oooo tree", parentPaths, currentPath, href, routePathOfLink.key, simply.ctx);
										if (parentPaths.includes(routePathOfLink.key)) {
											a.setAttribute("go-active", true);
										}
										// ! çünkü bazen parent link, child'ın içinde de kullanılıyor
										// o durumda aktif etmeye demeye çalıştım burada
										else if (parentPaths.includes(href) && !comp.parent.contains(a)) {
											// console.log(component, a);
											a.setAttribute("go-active", true);
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
					// go-active ekle/sil


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
				simply.routes[route.path].go = this;

				function registerChildRoutes(children, parentPath = '') {
					if (!children) return;

					for (const child of children) {
						const fullPath = parentPath + child.path;

						// Register current child with full path
						simply.go.setup([{
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
				// console.log("show or redirect");
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
		 * 404s on your own use `go('*', callback)`.
		 *
		 * @param {Context} ctx
		 * @api private
		 */
		function unhandled(ctx) {
			if (ctx.handled) return;
			var current;
			var go = this;
			var window = go._window;

			if (go._hashbang) {
				current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
			} else {
				current = isLocation && window.location.pathname + window.location.search;
			}

			if (current === ctx.canonicalPath) return;
			go.stop();
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

		function Context(path, state, goInstance) {
			var _go = this.go = goInstance || go;
			var window = _go._window;
			var hashbang = _go._hashbang;

			var goBase = _go._getBase();
			if ('/' === path[0] && 0 !== path.indexOf(goBase)) path = goBase + (hashbang ? '#!' : '') + path;
			var i = path.indexOf('?');

			this.canonicalPath = path;
			var re = new RegExp('^' + escapeRegExp(goBase));
			this.path = path.replace(re, '') || '/';
			if (hashbang) this.path = this.path.replace('#!', '') || '/';

			this.title = (hasDocument && window.document.title);
			this.state = state || {};
			this.state.path = path;
			this.querystring = ~i ? _go._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
			this.pathname = _go._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
			this.params = {};

			// fragment
			this.hash = '';
			if (!hashbang) {
				if (!~this.path.indexOf('#')) return;
				var parts = this.path.split('#');
				this.path = this.pathname = parts[0];
				this.hash = _go._decodeURLEncodedURIComponent(parts[1]) || '';
				this.querystring = this.querystring.split('#')[0];
			}
		}

		/**
		 * Push state.
		 *
		 * @api private
		 */

		Context.prototype.pushState = function () {
			var go = this.go;
			var window = go._window;
			var hashbang = go._hashbang;

			go.len++;
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
			var go = this.go;
			if (hasHistory) {
				go._window.history.replaceState(this.state, this.title,
					go._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
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

		function Route(path, options, go) {
			var _go = this.go = go || globalPage;
			var opts = options || {};
			opts.strict = opts.strict || _go._strict;
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
				var val = this.go._decodeURLEncodedURIComponent(m[i]);

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
		var go_js = globalPage;
		var default_1 = globalPage;

		go_js.default = default_1;

		return go_js;
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
	initGo: function (a, b) {
		// window.go = simply.go(); // i'll delete this after seeing all examples (search/replace go with simply.go in examples)
		simply.go = simply.go();
		simply.go.configure({ window: window })

		var base = document.querySelector("base[href]");

		if (base) {
			// delete last slash
			var base_href = base.getAttribute("href").replace(/\/$/, "");
			simply.go.base(base_href);
		}
	},
	unsafeHTML: function (htmlString) {
		return document.createRange().createContextualFragment(htmlString);
	},
	lit: function () {
		window.LitCore = (() => {
			var __defProp = Object.defineProperty;
			var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
			var __getOwnPropNames = Object.getOwnPropertyNames;
			var __hasOwnProp = Object.prototype.hasOwnProperty;
			var __export = (target, all) => {
				for (var name in all)
					__defProp(target, name, { get: all[name], enumerable: true });
			};
			var __copyProps = (to, from, except, desc) => {
				if (from && typeof from === "object" || typeof from === "function") {
					for (let key of __getOwnPropNames(from))
						if (!__hasOwnProp.call(to, key) && key !== except)
							__defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
				}
				return to;
			};
			var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

			// src/lit-umd-entry.js
			var lit_umd_entry_exports = {};
			__export(lit_umd_entry_exports, {
				guard: () => i4,
				html: () => b,
				nothing: () => A,
				render: () => D,
				repeat: () => c2
			});

			// node_modules/lit-html/lit-html.js
			var t = globalThis;
			var i = (t4) => t4;
			var s = t.trustedTypes;
			var e = s ? s.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
			var h = "$lit$";
			var o = `lit$${Math.random().toFixed(9).slice(2)}$`;
			var n = "?" + o;
			var r = `<${n}>`;
			var l = document;
			var c = () => l.createComment("");
			var a = (t4) => null === t4 || "object" != typeof t4 && "function" != typeof t4;
			var u = Array.isArray;
			var d = (t4) => u(t4) || "function" == typeof t4?.[Symbol.iterator];
			var f = "[ 	\n\f\r]";
			var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
			var _ = /-->/g;
			var m = />/g;
			var p = RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ 	
		\f\r"'\`<>=]|("|')|))|$)`, "g");
			var g = /'/g;
			var $ = /"/g;
			var y = /^(?:script|style|textarea|title)$/i;
			var x = (t4) => (i5, ...s3) => ({ _$litType$: t4, strings: i5, values: s3 });
			var b = x(1);
			var w = x(2);
			var T = x(3);
			var E = /* @__PURE__ */ Symbol.for("lit-noChange");
			var A = /* @__PURE__ */ Symbol.for("lit-nothing");
			var C = /* @__PURE__ */ new WeakMap();
			var P = l.createTreeWalker(l, 129);
			function V(t4, i5) {
				if (!u(t4) || !t4.hasOwnProperty("raw")) throw Error("invalid template strings array");
				return void 0 !== e ? e.createHTML(i5) : i5;
			}
			var N = (t4, i5) => {
				const s3 = t4.length - 1, e4 = [];
				let n2, l2 = 2 === i5 ? "<svg>" : 3 === i5 ? "<math>" : "", c3 = v;
				for (let i6 = 0; i6 < s3; i6++) {
					const s4 = t4[i6];
					let a2, u4, d2 = -1, f2 = 0;
					for (; f2 < s4.length && (c3.lastIndex = f2, u4 = c3.exec(s4), null !== u4);) f2 = c3.lastIndex, c3 === v ? "!--" === u4[1] ? c3 = _ : void 0 !== u4[1] ? c3 = m : void 0 !== u4[2] ? (y.test(u4[2]) && (n2 = RegExp("</" + u4[2], "g")), c3 = p) : void 0 !== u4[3] && (c3 = p) : c3 === p ? ">" === u4[0] ? (c3 = n2 ?? v, d2 = -1) : void 0 === u4[1] ? d2 = -2 : (d2 = c3.lastIndex - u4[2].length, a2 = u4[1], c3 = void 0 === u4[3] ? p : '"' === u4[3] ? $ : g) : c3 === $ || c3 === g ? c3 = p : c3 === _ || c3 === m ? c3 = v : (c3 = p, n2 = void 0);
					const x2 = c3 === p && t4[i6 + 1].startsWith("/>") ? " " : "";
					l2 += c3 === v ? s4 + r : d2 >= 0 ? (e4.push(a2), s4.slice(0, d2) + h + s4.slice(d2) + o + x2) : s4 + o + (-2 === d2 ? i6 : x2);
				}
				return [V(t4, l2 + (t4[s3] || "<?>") + (2 === i5 ? "</svg>" : 3 === i5 ? "</math>" : "")), e4];
			};
			var S = class _S {
				constructor({ strings: t4, _$litType$: i5 }, e4) {
					let r2;
					this.parts = [];
					let l2 = 0, a2 = 0;
					const u4 = t4.length - 1, d2 = this.parts, [f2, v3] = N(t4, i5);
					if (this.el = _S.createElement(f2, e4), P.currentNode = this.el.content, 2 === i5 || 3 === i5) {
						const t5 = this.el.content.firstChild;
						t5.replaceWith(...t5.childNodes);
					}
					for (; null !== (r2 = P.nextNode()) && d2.length < u4;) {
						if (1 === r2.nodeType) {
							if (r2.hasAttributes()) for (const t5 of r2.getAttributeNames()) if (t5.endsWith(h)) {
								const i6 = v3[a2++], s3 = r2.getAttribute(t5).split(o), e5 = /([.?@])?(.*)/.exec(i6);
								d2.push({ type: 1, index: l2, name: e5[2], strings: s3, ctor: "." === e5[1] ? I : "?" === e5[1] ? L : "@" === e5[1] ? z : H }), r2.removeAttribute(t5);
							} else t5.startsWith(o) && (d2.push({ type: 6, index: l2 }), r2.removeAttribute(t5));
							if (y.test(r2.tagName)) {
								const t5 = r2.textContent.split(o), i6 = t5.length - 1;
								if (i6 > 0) {
									r2.textContent = s ? s.emptyScript : "";
									for (let s3 = 0; s3 < i6; s3++) r2.append(t5[s3], c()), P.nextNode(), d2.push({ type: 2, index: ++l2 });
									r2.append(t5[i6], c());
								}
							}
						} else if (8 === r2.nodeType) if (r2.data === n) d2.push({ type: 2, index: l2 });
						else {
							let t5 = -1;
							for (; -1 !== (t5 = r2.data.indexOf(o, t5 + 1));) d2.push({ type: 7, index: l2 }), t5 += o.length - 1;
						}
						l2++;
					}
				}
				static createElement(t4, i5) {
					const s3 = l.createElement("template");
					return s3.innerHTML = t4, s3;
				}
			};
			function M(t4, i5, s3 = t4, e4) {
				if (i5 === E) return i5;
				let h3 = void 0 !== e4 ? s3._$Co?.[e4] : s3._$Cl;
				const o2 = a(i5) ? void 0 : i5._$litDirective$;
				return h3?.constructor !== o2 && (h3?._$AO?.(false), void 0 === o2 ? h3 = void 0 : (h3 = new o2(t4), h3._$AT(t4, s3, e4)), void 0 !== e4 ? (s3._$Co ??= [])[e4] = h3 : s3._$Cl = h3), void 0 !== h3 && (i5 = M(t4, h3._$AS(t4, i5.values), h3, e4)), i5;
			}
			var R = class {
				constructor(t4, i5) {
					this._$AV = [], this._$AN = void 0, this._$AD = t4, this._$AM = i5;
				}
				get parentNode() {
					return this._$AM.parentNode;
				}
				get _$AU() {
					return this._$AM._$AU;
				}
				u(t4) {
					const { el: { content: i5 }, parts: s3 } = this._$AD, e4 = (t4?.creationScope ?? l).importNode(i5, true);
					P.currentNode = e4;
					let h3 = P.nextNode(), o2 = 0, n2 = 0, r2 = s3[0];
					for (; void 0 !== r2;) {
						if (o2 === r2.index) {
							let i6;
							2 === r2.type ? i6 = new k(h3, h3.nextSibling, this, t4) : 1 === r2.type ? i6 = new r2.ctor(h3, r2.name, r2.strings, this, t4) : 6 === r2.type && (i6 = new Z(h3, this, t4)), this._$AV.push(i6), r2 = s3[++n2];
						}
						o2 !== r2?.index && (h3 = P.nextNode(), o2++);
					}
					return P.currentNode = l, e4;
				}
				p(t4) {
					let i5 = 0;
					for (const s3 of this._$AV) void 0 !== s3 && (void 0 !== s3.strings ? (s3._$AI(t4, s3, i5), i5 += s3.strings.length - 2) : s3._$AI(t4[i5])), i5++;
				}
			};
			var k = class _k {
				get _$AU() {
					return this._$AM?._$AU ?? this._$Cv;
				}
				constructor(t4, i5, s3, e4) {
					this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t4, this._$AB = i5, this._$AM = s3, this.options = e4, this._$Cv = e4?.isConnected ?? true;
				}
				get parentNode() {
					let t4 = this._$AA.parentNode;
					const i5 = this._$AM;
					return void 0 !== i5 && 11 === t4?.nodeType && (t4 = i5.parentNode), t4;
				}
				get startNode() {
					return this._$AA;
				}
				get endNode() {
					return this._$AB;
				}
				_$AI(t4, i5 = this) {
					t4 = M(this, t4, i5), a(t4) ? t4 === A || null == t4 || "" === t4 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t4 !== this._$AH && t4 !== E && this._(t4) : void 0 !== t4._$litType$ ? this.$(t4) : void 0 !== t4.nodeType ? this.T(t4) : d(t4) ? this.k(t4) : this._(t4);
				}
				O(t4) {
					return this._$AA.parentNode.insertBefore(t4, this._$AB);
				}
				T(t4) {
					this._$AH !== t4 && (this._$AR(), this._$AH = this.O(t4));
				}
				_(t4) {
					this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t4 : this.T(l.createTextNode(t4)), this._$AH = t4;
				}
				$(t4) {
					const { values: i5, _$litType$: s3 } = t4, e4 = "number" == typeof s3 ? this._$AC(t4) : (void 0 === s3.el && (s3.el = S.createElement(V(s3.h, s3.h[0]), this.options)), s3);
					if (this._$AH?._$AD === e4) this._$AH.p(i5);
					else {
						const t5 = new R(e4, this), s4 = t5.u(this.options);
						t5.p(i5), this.T(s4), this._$AH = t5;
					}
				}
				_$AC(t4) {
					let i5 = C.get(t4.strings);
					return void 0 === i5 && C.set(t4.strings, i5 = new S(t4)), i5;
				}
				k(t4) {
					u(this._$AH) || (this._$AH = [], this._$AR());
					const i5 = this._$AH;
					let s3, e4 = 0;
					for (const h3 of t4) e4 === i5.length ? i5.push(s3 = new _k(this.O(c()), this.O(c()), this, this.options)) : s3 = i5[e4], s3._$AI(h3), e4++;
					e4 < i5.length && (this._$AR(s3 && s3._$AB.nextSibling, e4), i5.length = e4);
				}
				_$AR(t4 = this._$AA.nextSibling, s3) {
					for (this._$AP?.(false, true, s3); t4 !== this._$AB;) {
						const s4 = i(t4).nextSibling;
						i(t4).remove(), t4 = s4;
					}
				}
				setConnected(t4) {
					void 0 === this._$AM && (this._$Cv = t4, this._$AP?.(t4));
				}
			};
			var H = class {
				get tagName() {
					return this.element.tagName;
				}
				get _$AU() {
					return this._$AM._$AU;
				}
				constructor(t4, i5, s3, e4, h3) {
					this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t4, this.name = i5, this._$AM = e4, this.options = h3, s3.length > 2 || "" !== s3[0] || "" !== s3[1] ? (this._$AH = Array(s3.length - 1).fill(new String()), this.strings = s3) : this._$AH = A;
				}
				_$AI(t4, i5 = this, s3, e4) {
					const h3 = this.strings;
					let o2 = false;
					if (void 0 === h3) t4 = M(this, t4, i5, 0), o2 = !a(t4) || t4 !== this._$AH && t4 !== E, o2 && (this._$AH = t4);
					else {
						const e5 = t4;
						let n2, r2;
						for (t4 = h3[0], n2 = 0; n2 < h3.length - 1; n2++) r2 = M(this, e5[s3 + n2], i5, n2), r2 === E && (r2 = this._$AH[n2]), o2 ||= !a(r2) || r2 !== this._$AH[n2], r2 === A ? t4 = A : t4 !== A && (t4 += (r2 ?? "") + h3[n2 + 1]), this._$AH[n2] = r2;
					}
					o2 && !e4 && this.j(t4);
				}
				j(t4) {
					t4 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 ?? "");
				}
			};
			var I = class extends H {
				constructor() {
					super(...arguments), this.type = 3;
				}
				j(t4) {
					this.element[this.name] = t4 === A ? void 0 : t4;
				}
			};
			var L = class extends H {
				constructor() {
					super(...arguments), this.type = 4;
				}
				j(t4) {
					this.element.toggleAttribute(this.name, !!t4 && t4 !== A);
				}
			};
			var z = class extends H {
				constructor(t4, i5, s3, e4, h3) {
					super(t4, i5, s3, e4, h3), this.type = 5;
				}
				_$AI(t4, i5 = this) {
					if ((t4 = M(this, t4, i5, 0) ?? A) === E) return;
					const s3 = this._$AH, e4 = t4 === A && s3 !== A || t4.capture !== s3.capture || t4.once !== s3.once || t4.passive !== s3.passive, h3 = t4 !== A && (s3 === A || e4);
					e4 && this.element.removeEventListener(this.name, this, s3), h3 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
				}
				handleEvent(t4) {
					"function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t4) : this._$AH.handleEvent(t4);
				}
			};
			var Z = class {
				constructor(t4, i5, s3) {
					this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s3;
				}
				get _$AU() {
					return this._$AM._$AU;
				}
				_$AI(t4) {
					M(this, t4);
				}
			};
			var j = { M: h, P: o, A: n, C: 1, L: N, R, D: d, V: M, I: k, H, N: L, U: z, B: I, F: Z };
			var B = t.litHtmlPolyfillSupport;
			B?.(S, k), (t.litHtmlVersions ??= []).push("3.3.2");
			var D = (t4, i5, s3) => {
				const e4 = s3?.renderBefore ?? i5;
				let h3 = e4._$litPart$;
				if (void 0 === h3) {
					const t5 = s3?.renderBefore ?? null;
					e4._$litPart$ = h3 = new k(i5.insertBefore(c(), t5), t5, void 0, s3 ?? {});
				}
				return h3._$AI(t4), h3;
			};

			// node_modules/lit-html/directive.js
			var t2 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
			var e2 = (t4) => (...e4) => ({ _$litDirective$: t4, values: e4 });
			var i2 = class {
				constructor(t4) {
				}
				get _$AU() {
					return this._$AM._$AU;
				}
				_$AT(t4, e4, i5) {
					this._$Ct = t4, this._$AM = e4, this._$Ci = i5;
				}
				_$AS(t4, e4) {
					return this.update(t4, e4);
				}
				update(t4, e4) {
					return this.render(...e4);
				}
			};

			// node_modules/lit-html/directive-helpers.js
			var { I: t3 } = j;
			var i3 = (o2) => o2;
			var s2 = () => document.createComment("");
			var v2 = (o2, n2, e4) => {
				const l2 = o2._$AA.parentNode, d2 = void 0 === n2 ? o2._$AB : n2._$AA;
				if (void 0 === e4) {
					const i5 = l2.insertBefore(s2(), d2), n3 = l2.insertBefore(s2(), d2);
					e4 = new t3(i5, n3, o2, o2.options);
				} else {
					const t4 = e4._$AB.nextSibling, n3 = e4._$AM, c3 = n3 !== o2;
					if (c3) {
						let t5;
						e4._$AQ?.(o2), e4._$AM = o2, void 0 !== e4._$AP && (t5 = o2._$AU) !== n3._$AU && e4._$AP(t5);
					}
					if (t4 !== d2 || c3) {
						let o3 = e4._$AA;
						for (; o3 !== t4;) {
							const t5 = i3(o3).nextSibling;
							i3(l2).insertBefore(o3, d2), o3 = t5;
						}
					}
				}
				return e4;
			};
			var u2 = (o2, t4, i5 = o2) => (o2._$AI(t4, i5), o2);
			var m2 = {};
			var p2 = (o2, t4 = m2) => o2._$AH = t4;
			var M2 = (o2) => o2._$AH;
			var h2 = (o2) => {
				o2._$AR(), o2._$AA.remove();
			};

			// node_modules/lit-html/directives/repeat.js
			var u3 = (e4, s3, t4) => {
				const r2 = /* @__PURE__ */ new Map();
				for (let l2 = s3; l2 <= t4; l2++) r2.set(e4[l2], l2);
				return r2;
			};
			var c2 = e2(class extends i2 {
				constructor(e4) {
					if (super(e4), e4.type !== t2.CHILD) throw Error("repeat() can only be used in text expressions");
				}
				dt(e4, s3, t4) {
					let r2;
					void 0 === t4 ? t4 = s3 : void 0 !== s3 && (r2 = s3);
					const l2 = [], o2 = [];
					let i5 = 0;
					for (const s4 of e4) l2[i5] = r2 ? r2(s4, i5) : i5, o2[i5] = t4(s4, i5), i5++;
					return { values: o2, keys: l2 };
				}
				render(e4, s3, t4) {
					return this.dt(e4, s3, t4).values;
				}
				update(s3, [t4, r2, c3]) {
					const d2 = M2(s3), { values: p3, keys: a2 } = this.dt(t4, r2, c3);
					if (!Array.isArray(d2)) return this.ut = a2, p3;
					const h3 = this.ut ??= [], v3 = [];
					let m3, y2, x2 = 0, j2 = d2.length - 1, k2 = 0, w2 = p3.length - 1;
					for (; x2 <= j2 && k2 <= w2;) if (null === d2[x2]) x2++;
					else if (null === d2[j2]) j2--;
					else if (h3[x2] === a2[k2]) v3[k2] = u2(d2[x2], p3[k2]), x2++, k2++;
					else if (h3[j2] === a2[w2]) v3[w2] = u2(d2[j2], p3[w2]), j2--, w2--;
					else if (h3[x2] === a2[w2]) v3[w2] = u2(d2[x2], p3[w2]), v2(s3, v3[w2 + 1], d2[x2]), x2++, w2--;
					else if (h3[j2] === a2[k2]) v3[k2] = u2(d2[j2], p3[k2]), v2(s3, d2[x2], d2[j2]), j2--, k2++;
					else if (void 0 === m3 && (m3 = u3(a2, k2, w2), y2 = u3(h3, x2, j2)), m3.has(h3[x2])) if (m3.has(h3[j2])) {
						const e4 = y2.get(a2[k2]), t5 = void 0 !== e4 ? d2[e4] : null;
						if (null === t5) {
							const e5 = v2(s3, d2[x2]);
							u2(e5, p3[k2]), v3[k2] = e5;
						} else v3[k2] = u2(t5, p3[k2]), v2(s3, d2[x2], t5), d2[e4] = null;
						k2++;
					} else h2(d2[j2]), j2--;
					else h2(d2[x2]), x2++;
					for (; k2 <= w2;) {
						const e4 = v2(s3, v3[w2 + 1]);
						u2(e4, p3[k2]), v3[k2++] = e4;
					}
					for (; x2 <= j2;) {
						const e4 = d2[x2++];
						null !== e4 && h2(e4);
					}
					return this.ut = a2, p2(s3, v3), E;
				}
			});

			// node_modules/lit-html/directives/guard.js
			var e3 = {};
			var i4 = e2(class extends i2 {
				constructor() {
					super(...arguments), this.ot = e3;
				}
				render(r2, t4) {
					return t4();
				}
				update(t4, [s3, e4]) {
					if (Array.isArray(s3)) {
						if (Array.isArray(this.ot) && this.ot.length === s3.length && s3.every((r2, t5) => r2 === this.ot[t5])) return E;
					} else if (this.ot === s3) return E;
					return this.ot = Array.isArray(s3) ? Array.from(s3) : s3, this.render(s3, e4);
				}
			});
			return __toCommonJS(lit_umd_entry_exports);
		})();

		Object.assign(window, LitCore);
		/*! Bundled license information:

		lit-html/lit-html.js:
		lit-html/directive.js:
		lit-html/directives/repeat.js:
			(**
			* @license
			* Copyright 2017 Google LLC
			* SPDX-License-Identifier: BSD-3-Clause
			*)

		lit-html/directive-helpers.js:
			(**
			* @license
			* Copyright 2020 Google LLC
			* SPDX-License-Identifier: BSD-3-Clause
			*)

		lit-html/directives/guard.js:
			(**
			* @license
			* Copyright 2018 Google LLC
			* SPDX-License-Identifier: BSD-3-Clause
			*)
		*/

	},
	init: function () {
		//console.clear();
		this.lit();
		this.observableSlim();

		// simply.go() load edilmemişse 
		simply.initGo();

		window.get = this.get;
	}
}





simply.init();



