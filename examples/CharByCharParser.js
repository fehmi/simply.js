// bu legacy parser'ın optimizasyonlu versiyonu, needs more test though
parseTemplate: function (parsingArgs) {
  if (!parsingArgs.component.renderFn) {
    var { template, data, style, state, parent, props, component, dom, methods, lifecycle, name } = parsingArgs;

    // conditionals
    let ifStart = /\<if(\s)cond=\"(.*)\"(\>$)/;
    let elsifStart = /\<elsif(\s)cond=\"(.*)\"(\>$)/;
    let customElStart = /<([a-z]{1,10}-[a-z]{1,10})>$/;
    let tagMatchRegex = /(<(?:if\s+cond="([^"]+)"|elsif\s+cond="([^"]+)"|each[^>]*|else|\/(?:each|if|elsif|else))>)$/;
    let inTagVar = /:="([^"]+)"$/;
    let ifCount = 0;
    let eachCount = 0;
    let m;
    const MAX_LENGTH = 150;
    var recentBucket = "";
    var bucketParts = [];
    var segmentStart = 0;
    var flag = false;
    var curlyCount = 0;
    var varBucket = "";
    var scriptCount = 0;
    var styleCount = 0;
    var customEl = 0;
    var ignoreFlag = false;
    var logic = "";
    var lastM, lasti;

    template = template.replace(/[\r\n]+/g, '');

    if (template.includes('${')) {
      template = template.replace(/\$\{/g, 'minyeli{');
    }

    for (var i = 0; i < template.length; i++) {
      let ch = template[i];
      recentBucket += ch;

      if (recentBucket.length > MAX_LENGTH * 2) {
        recentBucket = recentBucket.substring(MAX_LENGTH);
      }

      // tag exceptions
      if (ch == ">") {
        if (recentBucket.endsWith("<script>")) {
          scriptCount += 1;
        }
        else if (recentBucket.endsWith("<style>")) {
          styleCount += 1;
        }
        // custom element açıldı, dokanma içine. onun kendi lifecycle'ı var
        //else if (!customEl && (m = customElStart.exec(recentBucket)) !== null) {
        //	if (customElements.get(m[1])) {
        //		customEl = m[1];
        //	}
        //}
        else if (recentBucket.endsWith("</script>")) {
          scriptCount -= 1;
        }
        else if (recentBucket.endsWith("</style>")) {
          styleCount -= 1;
        }
        // açılışı yakalanan custom element kapandı, render'a devam
        //else if (customEl && recentBucket.endsWith(`</${customEl}>`)) {
        // console.log("Closed:", customEl);
        //	customEl = 0;
        //}
      }

      if (styleCount == 0 && scriptCount == 0 && !customEl) {
        if (template[i - 1] !== "\\" && ch == "{") {
          curlyCount += 1;
        }

        if (curlyCount > 0 && ignoreFlag === false) {
          varBucket += ch;
        }

        if (template[i - 1] !== "\\" && ch == "}") {
          curlyCount -= 1;
          if (curlyCount == 0 && ignoreFlag === true) {
            ignoreFlag = false;
          }
        }

        // variable
        if (curlyCount == 0 && varBucket !== "") {
          varBucket = varBucket.trim();
          let variable = varBucket.substring(1, varBucket.length - 1);

          function isObjectString(str) {
            return /^\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))+\}))*\}$/.exec(str);
          }

          if (isObjectString(variable)) {
            variable = "\"" + varBucket + "\"";
          }

          logic = "ht+=" + variable + ";";
          flag = true;
        }
        else if (ch == '"' && recentBucket.includes(':="') && (m = inTagVar.exec(recentBucket)) !== null) {
          logic = "ht+=" + m[1] + ";";
          flag = true;
        }
        else {
          m = null;
        }

        // if else elsif each gibi custom tag'lar
        if (ch == ">") {
          // Tek regex ile tüm tag'ları yakala
          const tagMatch = recentBucket.match(tagMatchRegex);

          if (tagMatch) {
            const fullTag = tagMatch[1];

            if (fullTag === '</each>') {
              m = [fullTag]; eachCount--; logic = "};"; flag = true;
            }
            else if (fullTag === '<else>') {
              m = [fullTag]; logic = "else {"; flag = true;
            }
            else if (fullTag === '</if>') {
              m = [fullTag]; ifCount--; logic = "}"; flag = true;
            }
            else if (fullTag === '</elsif>' || fullTag === '</else>') {
              m = [fullTag]; logic = "}"; flag = true;
            }
            else if (tagMatch[2]) { // <if cond="...">
              m = tagMatch;
              logic = "if (" + unescape(tagMatch[2]) + ") {";
              ifCount++; flag = true;
            }
            else if (tagMatch[3]) { // <elsif cond="...">
              m = tagMatch;
              logic = "else if (" + unescape(tagMatch[3]) + ") {";
              flag = true;
            }
            else if (fullTag.startsWith('<each')) {
              m = [fullTag];
              m.groups = parseEachFast(fullTag);
              eachCount++;
              const iter = "s" + Math.random().toString(8).slice(2);
              const keyDecl = m.groups.key ? `let ${m.groups.key} = ${iter};` : "";
              const indexDecl = m.groups.index ? `let ${m.groups.index} = ${iter};` : "";
              logic = `for (let ${iter} in ${m.groups.of}) {
        if (!Object.prototype.hasOwnProperty.call(${m.groups.of}, ${iter})) continue;
        const ${m.groups.as} = ${m.groups.of}[${iter}];
        ${keyDecl}${indexDecl}`;
              flag = true;
              lastM = m.groups.of;
              lasti = iter;
            }
          }
        }
      }

      // yakalanan logic var ise
      if (flag === true) {
        let logicLine;
        if (m) {
          logicLine = m[0];
        } else {
          logicLine = varBucket;
          varBucket = "";
        }

        // Template'den doğrudan statik text'i al
        let staticEnd = i + 1 - logicLine.length;
        let staticText = template.substring(segmentStart, staticEnd);

        if (staticText.trim() !== "") {
          bucketParts.push("ht+=`" + staticText.replace(/\n/g, "") + "`;");
        }
        bucketParts.push(logic);

        segmentStart = i + 1;
        recentBucket = "";
        flag = false;
        m = null;
      }
    }

    function parseEachFast(tag) {
      let of, as, key, index;

      let i = 5;
      while (i < tag.length) {
        if (tag.startsWith('of="', i)) {
          const e = tag.indexOf('"', i + 4);
          of = tag.slice(i + 4, e);
          i = e;
        }
        else if (tag.startsWith('as="', i)) {
          const e = tag.indexOf('"', i + 4);
          as = tag.slice(i + 4, e);
          i = e;
        }
        else if (tag.startsWith('key="', i)) {
          const e = tag.indexOf('"', i + 5);
          key = tag.slice(i + 5, e);
          i = e;
        }
        else if (tag.startsWith('index="', i)) {
          const e = tag.indexOf('"', i + 7);
          index = tag.slice(i + 7, e);
          i = e;
        }
        i++;
      }

      return { of, as, key, index };
    }

    function parseEachTag(eachTag) {
      let ofMatch = eachTag.match(/of="([^"]+)"/);
      let asMatch = eachTag.match(/as="([^"]+)"/);
      let keyMatch = eachTag.match(/key="([^"]+)"/);
      let indexMatch = eachTag.match(/index="([^"]+)"/);

      let of = ofMatch ? ofMatch[1] : undefined;
      let as = asMatch ? asMatch[1] : undefined;

      let result = { of, as };
      if (keyMatch) result.key = keyMatch[1];
      if (indexMatch) result.index = indexMatch[1];

      return result;
    }

    // Kalan statik text
    if (segmentStart < template.length) {
      let remaining = template.substring(segmentStart).trimEnd();
      if (remaining) {
        bucketParts.push("ht+=`" + remaining + "`;");
      }
    }

    var bucket = bucketParts.join("").replace(/minyeli/g, '$');

    component.renderFn = new Function(
      "scope",
      `
        var { template, data, style, state, parent, props, component, dom, methods, lifecycle, name } = scope;
        let ht = "";
        ${bucket}
        return ht; 
      `
    );
  }

  return parsingArgs.component.renderFn(parsingArgs);
},