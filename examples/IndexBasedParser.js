// bu şimdiye kadar ki en hızlısı, needs more test though
parseTemplate: function (parsingArgs) {
  if (!parsingArgs.component.renderFn) {
    var { template, data, style, state, parent, props, component, dom, methods, lifecycle, name } = parsingArgs;

    template = template.replace(/[\r\n]+/g, '');
    if (template.includes('${')) {
      template = template.replace(/\$\{/g, 'minyeli{');
    }

    const bucketParts = [];
    let pos = 0;
    const len = template.length;

    // Regex'ler
    const tagMatchRegex = /(<(?:if\s+cond="([^"]+)"|elsif\s+cond="([^"]+)"|each[^>]*|else|\/(?:each|if|elsif|else))>)/g;
    const varRegex = /\{([^{}]+)\}/g;
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
        logic = "};";
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
        const iter = "s" + Math.random().toString(8).slice(2);
        logic = `for (let ${iter} in ${groups.of}) {
          if (!Object.prototype.hasOwnProperty.call(${groups.of}, ${iter})) continue;
          const ${groups.as} = ${groups.of}[${iter}];
          ${groups.key ? `let ${groups.key} = ${iter};` : ""}
          ${groups.index ? `let ${groups.index} = ${iter};` : ""}`;
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
      return {
        of: eachTag.match(/of="([^"]+)"/)?.[1],
        as: eachTag.match(/as="([^"]+)"/)?.[1],
        key: eachTag.match(/key="([^"]+)"/)?.[1],
        index: eachTag.match(/index="([^"]+)"/)?.[1]
      };
    }

    const bucket = bucketParts.join("").replace(/minyeli/g, '$');

    component.renderFn = new Function(
      "scope",
      `var { template, data, style, state, parent, props, component, dom, methods, lifecycle, name } = scope;
       let ht = "";
       ${bucket}
       return ht;`
    );
  }

  return parsingArgs.component.renderFn(parsingArgs);
},