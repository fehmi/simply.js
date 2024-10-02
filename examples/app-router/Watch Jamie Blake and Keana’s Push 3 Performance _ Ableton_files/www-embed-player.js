(function(){'use strict';var p;function aa(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}}
var ba=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,b,c){if(a==Array.prototype||a==Object.prototype)return a;a[b]=c.value;return a};
function ca(a){a=["object"==typeof globalThis&&globalThis,a,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var b=0;b<a.length;++b){var c=a[b];if(c&&c.Math==Math)return c}throw Error("Cannot find global object");}
var da=ca(this);function u(a,b){if(b)a:{var c=da;a=a.split(".");for(var d=0;d<a.length-1;d++){var e=a[d];if(!(e in c))break a;c=c[e]}a=a[a.length-1];d=c[a];b=b(d);b!=d&&b!=null&&ba(c,a,{configurable:!0,writable:!0,value:b})}}
u("Symbol",function(a){function b(f){if(this instanceof b)throw new TypeError("Symbol is not a constructor");return new c(d+(f||"")+"_"+e++,f)}
function c(f,g){this.h=f;ba(this,"description",{configurable:!0,writable:!0,value:g})}
if(a)return a;c.prototype.toString=function(){return this.h};
var d="jscomp_symbol_"+(Math.random()*1E9>>>0)+"_",e=0;return b});
u("Symbol.iterator",function(a){if(a)return a;a=Symbol("Symbol.iterator");for(var b="Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "),c=0;c<b.length;c++){var d=da[b[c]];typeof d==="function"&&typeof d.prototype[a]!="function"&&ba(d.prototype,a,{configurable:!0,writable:!0,value:function(){return ea(aa(this))}})}return a});
function ea(a){a={next:a};a[Symbol.iterator]=function(){return this};
return a}
function ha(a){return ia(a,a)}
function ia(a,b){a.raw=b;Object.freeze&&(Object.freeze(a),Object.freeze(b));return a}
function v(a){var b=typeof Symbol!="undefined"&&Symbol.iterator&&a[Symbol.iterator];if(b)return b.call(a);if(typeof a.length=="number")return{next:aa(a)};throw Error(String(a)+" is not an iterable or ArrayLike");}
function ja(a){if(!(a instanceof Array)){a=v(a);for(var b,c=[];!(b=a.next()).done;)c.push(b.value);a=c}return a}
function ka(a,b){return Object.prototype.hasOwnProperty.call(a,b)}
var la=typeof Object.assign=="function"?Object.assign:function(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(d)for(var e in d)ka(d,e)&&(a[e]=d[e])}return a};
u("Object.assign",function(a){return a||la});
var ma=typeof Object.create=="function"?Object.create:function(a){function b(){}
b.prototype=a;return new b},na=function(){function a(){function c(){}
new c;Reflect.construct(c,[],function(){});
return new c instanceof c}
if(typeof Reflect!="undefined"&&Reflect.construct){if(a())return Reflect.construct;var b=Reflect.construct;return function(c,d,e){c=b(c,d);e&&Reflect.setPrototypeOf(c,e.prototype);return c}}return function(c,d,e){e===void 0&&(e=c);
e=ma(e.prototype||Object.prototype);return Function.prototype.apply.call(c,e,d)||e}}(),oa;
if(typeof Object.setPrototypeOf=="function")oa=Object.setPrototypeOf;else{var pa;a:{var qa={a:!0},ra={};try{ra.__proto__=qa;pa=ra.a;break a}catch(a){}pa=!1}oa=pa?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null}var sa=oa;
function x(a,b){a.prototype=ma(b.prototype);a.prototype.constructor=a;if(sa)sa(a,b);else for(var c in b)if(c!="prototype")if(Object.defineProperties){var d=Object.getOwnPropertyDescriptor(b,c);d&&Object.defineProperty(a,c,d)}else a[c]=b[c];a.Ca=b.prototype}
function va(){this.A=!1;this.u=null;this.i=void 0;this.h=1;this.D=this.o=0;this.I=this.j=null}
function wa(a){if(a.A)throw new TypeError("Generator is already running");a.A=!0}
va.prototype.G=function(a){this.i=a};
function xa(a,b){a.j={exception:b,gd:!0};a.h=a.o||a.D}
va.prototype.return=function(a){this.j={return:a};this.h=this.D};
va.prototype.yield=function(a,b){this.h=b;return{value:a}};
va.prototype.F=function(a){this.h=a};
function ya(a,b,c){a.o=b;c!=void 0&&(a.D=c)}
function za(a){a.o=0;var b=a.j.exception;a.j=null;return b}
function Aa(a){var b=a.I.splice(0)[0];(b=a.j=a.j||b)?b.gd?a.h=a.o||a.D:b.F!=void 0&&a.D<b.F?(a.h=b.F,a.j=null):a.h=a.D:a.h=0}
function Ba(a){this.h=new va;this.i=a}
function Ca(a,b){wa(a.h);var c=a.h.u;if(c)return Da(a,"return"in c?c["return"]:function(d){return{value:d,done:!0}},b,a.h.return);
a.h.return(b);return Ea(a)}
function Da(a,b,c,d){try{var e=b.call(a.h.u,c);if(!(e instanceof Object))throw new TypeError("Iterator result "+e+" is not an object");if(!e.done)return a.h.A=!1,e;var f=e.value}catch(g){return a.h.u=null,xa(a.h,g),Ea(a)}a.h.u=null;d.call(a.h,f);return Ea(a)}
function Ea(a){for(;a.h.h;)try{var b=a.i(a.h);if(b)return a.h.A=!1,{value:b.value,done:!1}}catch(c){a.h.i=void 0,xa(a.h,c)}a.h.A=!1;if(a.h.j){b=a.h.j;a.h.j=null;if(b.gd)throw b.exception;return{value:b.return,done:!0}}return{value:void 0,done:!0}}
function Fa(a){this.next=function(b){wa(a.h);a.h.u?b=Da(a,a.h.u.next,b,a.h.G):(a.h.G(b),b=Ea(a));return b};
this.throw=function(b){wa(a.h);a.h.u?b=Da(a,a.h.u["throw"],b,a.h.G):(xa(a.h,b),b=Ea(a));return b};
this.return=function(b){return Ca(a,b)};
this[Symbol.iterator]=function(){return this}}
function Ga(a){function b(d){return a.next(d)}
function c(d){return a.throw(d)}
return new Promise(function(d,e){function f(g){g.done?d(g.value):Promise.resolve(g.value).then(b,c).then(f,e)}
f(a.next())})}
function A(a){return Ga(new Fa(new Ba(a)))}
function B(){for(var a=Number(this),b=[],c=a;c<arguments.length;c++)b[c-a]=arguments[c];return b}
u("Reflect",function(a){return a?a:{}});
u("Reflect.construct",function(){return na});
u("Reflect.setPrototypeOf",function(a){return a?a:sa?function(b,c){try{return sa(b,c),!0}catch(d){return!1}}:null});
u("Promise",function(a){function b(g){this.h=0;this.j=void 0;this.i=[];this.A=!1;var h=this.o();try{g(h.resolve,h.reject)}catch(k){h.reject(k)}}
function c(){this.h=null}
function d(g){return g instanceof b?g:new b(function(h){h(g)})}
if(a)return a;c.prototype.i=function(g){if(this.h==null){this.h=[];var h=this;this.j(function(){h.D()})}this.h.push(g)};
var e=da.setTimeout;c.prototype.j=function(g){e(g,0)};
c.prototype.D=function(){for(;this.h&&this.h.length;){var g=this.h;this.h=[];for(var h=0;h<g.length;++h){var k=g[h];g[h]=null;try{k()}catch(l){this.o(l)}}}this.h=null};
c.prototype.o=function(g){this.j(function(){throw g;})};
b.prototype.o=function(){function g(l){return function(m){k||(k=!0,l.call(h,m))}}
var h=this,k=!1;return{resolve:g(this.X),reject:g(this.D)}};
b.prototype.X=function(g){if(g===this)this.D(new TypeError("A Promise cannot resolve to itself"));else if(g instanceof b)this.ia(g);else{a:switch(typeof g){case "object":var h=g!=null;break a;case "function":h=!0;break a;default:h=!1}h?this.W(g):this.u(g)}};
b.prototype.W=function(g){var h=void 0;try{h=g.then}catch(k){this.D(k);return}typeof h=="function"?this.pa(h,g):this.u(g)};
b.prototype.D=function(g){this.G(2,g)};
b.prototype.u=function(g){this.G(1,g)};
b.prototype.G=function(g,h){if(this.h!=0)throw Error("Cannot settle("+g+", "+h+"): Promise already settled in state"+this.h);this.h=g;this.j=h;this.h===2&&this.ga();this.I()};
b.prototype.ga=function(){var g=this;e(function(){if(g.T()){var h=da.console;typeof h!=="undefined"&&h.error(g.j)}},1)};
b.prototype.T=function(){if(this.A)return!1;var g=da.CustomEvent,h=da.Event,k=da.dispatchEvent;if(typeof k==="undefined")return!0;typeof g==="function"?g=new g("unhandledrejection",{cancelable:!0}):typeof h==="function"?g=new h("unhandledrejection",{cancelable:!0}):(g=da.document.createEvent("CustomEvent"),g.initCustomEvent("unhandledrejection",!1,!0,g));g.promise=this;g.reason=this.j;return k(g)};
b.prototype.I=function(){if(this.i!=null){for(var g=0;g<this.i.length;++g)f.i(this.i[g]);this.i=null}};
var f=new c;b.prototype.ia=function(g){var h=this.o();g.Xb(h.resolve,h.reject)};
b.prototype.pa=function(g,h){var k=this.o();try{g.call(h,k.resolve,k.reject)}catch(l){k.reject(l)}};
b.prototype.then=function(g,h){function k(r,t){return typeof r=="function"?function(w){try{l(r(w))}catch(y){m(y)}}:t}
var l,m,n=new b(function(r,t){l=r;m=t});
this.Xb(k(g,l),k(h,m));return n};
b.prototype.catch=function(g){return this.then(void 0,g)};
b.prototype.Xb=function(g,h){function k(){switch(l.h){case 1:g(l.j);break;case 2:h(l.j);break;default:throw Error("Unexpected state: "+l.h);}}
var l=this;this.i==null?f.i(k):this.i.push(k);this.A=!0};
b.resolve=d;b.reject=function(g){return new b(function(h,k){k(g)})};
b.race=function(g){return new b(function(h,k){for(var l=v(g),m=l.next();!m.done;m=l.next())d(m.value).Xb(h,k)})};
b.all=function(g){var h=v(g),k=h.next();return k.done?d([]):new b(function(l,m){function n(w){return function(y){r[w]=y;t--;t==0&&l(r)}}
var r=[],t=0;do r.push(void 0),t++,d(k.value).Xb(n(r.length-1),m),k=h.next();while(!k.done)})};
return b});
u("Object.setPrototypeOf",function(a){return a||sa});
u("Symbol.dispose",function(a){return a?a:Symbol("Symbol.dispose")});
u("WeakMap",function(a){function b(k){this.h=(h+=Math.random()+1).toString();if(k){k=v(k);for(var l;!(l=k.next()).done;)l=l.value,this.set(l[0],l[1])}}
function c(){}
function d(k){var l=typeof k;return l==="object"&&k!==null||l==="function"}
function e(k){if(!ka(k,g)){var l=new c;ba(k,g,{value:l})}}
function f(k){var l=Object[k];l&&(Object[k]=function(m){if(m instanceof c)return m;Object.isExtensible(m)&&e(m);return l(m)})}
if(function(){if(!a||!Object.seal)return!1;try{var k=Object.seal({}),l=Object.seal({}),m=new a([[k,2],[l,3]]);if(m.get(k)!=2||m.get(l)!=3)return!1;m.delete(k);m.set(l,4);return!m.has(k)&&m.get(l)==4}catch(n){return!1}}())return a;
var g="$jscomp_hidden_"+Math.random();f("freeze");f("preventExtensions");f("seal");var h=0;b.prototype.set=function(k,l){if(!d(k))throw Error("Invalid WeakMap key");e(k);if(!ka(k,g))throw Error("WeakMap key fail: "+k);k[g][this.h]=l;return this};
b.prototype.get=function(k){return d(k)&&ka(k,g)?k[g][this.h]:void 0};
b.prototype.has=function(k){return d(k)&&ka(k,g)&&ka(k[g],this.h)};
b.prototype.delete=function(k){return d(k)&&ka(k,g)&&ka(k[g],this.h)?delete k[g][this.h]:!1};
return b});
u("Map",function(a){function b(){var h={};return h.previous=h.next=h.head=h}
function c(h,k){var l=h[1];return ea(function(){if(l){for(;l.head!=h[1];)l=l.previous;for(;l.next!=l.head;)return l=l.next,{done:!1,value:k(l)};l=null}return{done:!0,value:void 0}})}
function d(h,k){var l=k&&typeof k;l=="object"||l=="function"?f.has(k)?l=f.get(k):(l=""+ ++g,f.set(k,l)):l="p_"+k;var m=h[0][l];if(m&&ka(h[0],l))for(h=0;h<m.length;h++){var n=m[h];if(k!==k&&n.key!==n.key||k===n.key)return{id:l,list:m,index:h,entry:n}}return{id:l,list:m,index:-1,entry:void 0}}
function e(h){this[0]={};this[1]=b();this.size=0;if(h){h=v(h);for(var k;!(k=h.next()).done;)k=k.value,this.set(k[0],k[1])}}
if(function(){if(!a||typeof a!="function"||!a.prototype.entries||typeof Object.seal!="function")return!1;try{var h=Object.seal({x:4}),k=new a(v([[h,"s"]]));if(k.get(h)!="s"||k.size!=1||k.get({x:4})||k.set({x:4},"t")!=k||k.size!=2)return!1;var l=k.entries(),m=l.next();if(m.done||m.value[0]!=h||m.value[1]!="s")return!1;m=l.next();return m.done||m.value[0].x!=4||m.value[1]!="t"||!l.next().done?!1:!0}catch(n){return!1}}())return a;
var f=new WeakMap;e.prototype.set=function(h,k){h=h===0?0:h;var l=d(this,h);l.list||(l.list=this[0][l.id]=[]);l.entry?l.entry.value=k:(l.entry={next:this[1],previous:this[1].previous,head:this[1],key:h,value:k},l.list.push(l.entry),this[1].previous.next=l.entry,this[1].previous=l.entry,this.size++);return this};
e.prototype.delete=function(h){h=d(this,h);return h.entry&&h.list?(h.list.splice(h.index,1),h.list.length||delete this[0][h.id],h.entry.previous.next=h.entry.next,h.entry.next.previous=h.entry.previous,h.entry.head=null,this.size--,!0):!1};
e.prototype.clear=function(){this[0]={};this[1]=this[1].previous=b();this.size=0};
e.prototype.has=function(h){return!!d(this,h).entry};
e.prototype.get=function(h){return(h=d(this,h).entry)&&h.value};
e.prototype.entries=function(){return c(this,function(h){return[h.key,h.value]})};
e.prototype.keys=function(){return c(this,function(h){return h.key})};
e.prototype.values=function(){return c(this,function(h){return h.value})};
e.prototype.forEach=function(h,k){for(var l=this.entries(),m;!(m=l.next()).done;)m=m.value,h.call(k,m[1],m[0],this)};
e.prototype[Symbol.iterator]=e.prototype.entries;var g=0;return e});
u("Set",function(a){function b(c){this.h=new Map;if(c){c=v(c);for(var d;!(d=c.next()).done;)this.add(d.value)}this.size=this.h.size}
if(function(){if(!a||typeof a!="function"||!a.prototype.entries||typeof Object.seal!="function")return!1;try{var c=Object.seal({x:4}),d=new a(v([c]));if(!d.has(c)||d.size!=1||d.add(c)!=d||d.size!=1||d.add({x:4})!=d||d.size!=2)return!1;var e=d.entries(),f=e.next();if(f.done||f.value[0]!=c||f.value[1]!=c)return!1;f=e.next();return f.done||f.value[0]==c||f.value[0].x!=4||f.value[1]!=f.value[0]?!1:e.next().done}catch(g){return!1}}())return a;
b.prototype.add=function(c){c=c===0?0:c;this.h.set(c,c);this.size=this.h.size;return this};
b.prototype.delete=function(c){c=this.h.delete(c);this.size=this.h.size;return c};
b.prototype.clear=function(){this.h.clear();this.size=0};
b.prototype.has=function(c){return this.h.has(c)};
b.prototype.entries=function(){return this.h.entries()};
b.prototype.values=function(){return this.h.values()};
b.prototype.keys=b.prototype.values;b.prototype[Symbol.iterator]=b.prototype.values;b.prototype.forEach=function(c,d){var e=this;this.h.forEach(function(f){return c.call(d,f,f,e)})};
return b});
function Ha(a,b){a instanceof String&&(a+="");var c=0,d=!1,e={next:function(){if(!d&&c<a.length){var f=c++;return{value:b(f,a[f]),done:!1}}d=!0;return{done:!0,value:void 0}}};
e[Symbol.iterator]=function(){return e};
return e}
u("Array.prototype.entries",function(a){return a?a:function(){return Ha(this,function(b,c){return[b,c]})}});
u("Array.prototype.keys",function(a){return a?a:function(){return Ha(this,function(b){return b})}});
function Ia(a,b,c){if(a==null)throw new TypeError("The 'this' value for String.prototype."+c+" must not be null or undefined");if(b instanceof RegExp)throw new TypeError("First argument to String.prototype."+c+" must not be a regular expression");return a+""}
u("String.prototype.startsWith",function(a){return a?a:function(b,c){var d=Ia(this,b,"startsWith");b+="";var e=d.length,f=b.length;c=Math.max(0,Math.min(c|0,d.length));for(var g=0;g<f&&c<e;)if(d[c++]!=b[g++])return!1;return g>=f}});
u("String.prototype.endsWith",function(a){return a?a:function(b,c){var d=Ia(this,b,"endsWith");b+="";c===void 0&&(c=d.length);c=Math.max(0,Math.min(c|0,d.length));for(var e=b.length;e>0&&c>0;)if(d[--c]!=b[--e])return!1;return e<=0}});
u("Number.isFinite",function(a){return a?a:function(b){return typeof b!=="number"?!1:!isNaN(b)&&b!==Infinity&&b!==-Infinity}});
u("Array.prototype.find",function(a){return a?a:function(b,c){a:{var d=this;d instanceof String&&(d=String(d));for(var e=d.length,f=0;f<e;f++){var g=d[f];if(b.call(c,g,f,d)){b=g;break a}}b=void 0}return b}});
u("Object.values",function(a){return a?a:function(b){var c=[],d;for(d in b)ka(b,d)&&c.push(b[d]);return c}});
u("Object.is",function(a){return a?a:function(b,c){return b===c?b!==0||1/b===1/c:b!==b&&c!==c}});
u("Array.prototype.includes",function(a){return a?a:function(b,c){var d=this;d instanceof String&&(d=String(d));var e=d.length;c=c||0;for(c<0&&(c=Math.max(c+e,0));c<e;c++){var f=d[c];if(f===b||Object.is(f,b))return!0}return!1}});
u("String.prototype.includes",function(a){return a?a:function(b,c){return Ia(this,b,"includes").indexOf(b,c||0)!==-1}});
u("Array.from",function(a){return a?a:function(b,c,d){c=c!=null?c:function(h){return h};
var e=[],f=typeof Symbol!="undefined"&&Symbol.iterator&&b[Symbol.iterator];if(typeof f=="function"){b=f.call(b);for(var g=0;!(f=b.next()).done;)e.push(c.call(d,f.value,g++))}else for(f=b.length,g=0;g<f;g++)e.push(c.call(d,b[g],g));return e}});
u("Object.entries",function(a){return a?a:function(b){var c=[],d;for(d in b)ka(b,d)&&c.push([d,b[d]]);return c}});
u("Number.MAX_SAFE_INTEGER",function(){return 9007199254740991});
u("Number.MIN_SAFE_INTEGER",function(){return-9007199254740991});
u("Number.isInteger",function(a){return a?a:function(b){return Number.isFinite(b)?b===Math.floor(b):!1}});
u("Number.isSafeInteger",function(a){return a?a:function(b){return Number.isInteger(b)&&Math.abs(b)<=Number.MAX_SAFE_INTEGER}});
u("globalThis",function(a){return a||da});
u("Math.trunc",function(a){return a?a:function(b){b=Number(b);if(isNaN(b)||b===Infinity||b===-Infinity||b===0)return b;var c=Math.floor(Math.abs(b));return b<0?-c:c}});
u("Number.isNaN",function(a){return a?a:function(b){return typeof b==="number"&&isNaN(b)}});
u("Array.prototype.values",function(a){return a?a:function(){return Ha(this,function(b,c){return c})}});
u("Math.clz32",function(a){return a?a:function(b){b=Number(b)>>>0;if(b===0)return 32;var c=0;(b&4294901760)===0&&(b<<=16,c+=16);(b&4278190080)===0&&(b<<=8,c+=8);(b&4026531840)===0&&(b<<=4,c+=4);(b&3221225472)===0&&(b<<=2,c+=2);(b&2147483648)===0&&c++;return c}});
u("Math.log10",function(a){return a?a:function(b){return Math.log(b)/Math.LN10}});
u("Promise.prototype.finally",function(a){return a?a:function(b){return this.then(function(c){return Promise.resolve(b()).then(function(){return c})},function(c){return Promise.resolve(b()).then(function(){throw c;
})})}});/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var Ja=Ja||{},C=this||self;function D(a,b,c){a=a.split(".");c=c||C;a[0]in c||typeof c.execScript=="undefined"||c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)a.length||b===void 0?c[d]&&c[d]!==Object.prototype[d]?c=c[d]:c=c[d]={}:c[d]=b}
function Na(a,b){var c=E("CLOSURE_FLAGS");a=c&&c[a];return a!=null?a:b}
function E(a,b){a=a.split(".");b=b||C;for(var c=0;c<a.length;c++)if(b=b[a[c]],b==null)return null;return b}
function Oa(a){var b=typeof a;return b!="object"?b:a?Array.isArray(a)?"array":b:"null"}
function Pa(a){var b=Oa(a);return b=="array"||b=="object"&&typeof a.length=="number"}
function Qa(a){var b=typeof a;return b=="object"&&a!=null||b=="function"}
function Ra(a){return Object.prototype.hasOwnProperty.call(a,Sa)&&a[Sa]||(a[Sa]=++Ta)}
var Sa="closure_uid_"+(Math.random()*1E9>>>0),Ta=0;function Ua(a,b,c){return a.call.apply(a.bind,arguments)}
function Va(a,b,c){if(!a)throw Error();if(arguments.length>2){var d=Array.prototype.slice.call(arguments,2);return function(){var e=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(e,d);return a.apply(b,e)}}return function(){return a.apply(b,arguments)}}
function Wa(a,b,c){Wa=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?Ua:Va;return Wa.apply(null,arguments)}
function Xa(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var d=c.slice();d.push.apply(d,arguments);return a.apply(this,d)}}
function Ya(){return Date.now()}
function Za(a,b){function c(){}
c.prototype=b.prototype;a.Ca=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.base=function(d,e,f){for(var g=Array(arguments.length-2),h=2;h<arguments.length;h++)g[h-2]=arguments[h];return b.prototype[e].apply(d,g)}}
function $a(a){return a}
;function ab(a,b){if(Error.captureStackTrace)Error.captureStackTrace(this,ab);else{var c=Error().stack;c&&(this.stack=c)}a&&(this.message=String(a));b!==void 0&&(this.cause=b)}
Za(ab,Error);ab.prototype.name="CustomError";function bb(a){a=a.url;var b=/[?&]dsh=1(&|$)/.test(a);this.j=!b&&/[?&]ae=1(&|$)/.test(a);this.o=!b&&/[?&]ae=2(&|$)/.test(a);if((this.h=/[?&]adurl=([^&]*)/.exec(a))&&this.h[1]){try{var c=decodeURIComponent(this.h[1])}catch(d){c=null}this.i=c}}
;var cb=String.prototype.trim?function(a){return a.trim()}:function(a){return/^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]};var db;function eb(){if(db===void 0){var a=null,b=C.trustedTypes;if(b&&b.createPolicy){try{a=b.createPolicy("goog#html",{createHTML:$a,createScript:$a,createScriptURL:$a})}catch(c){C.console&&C.console.error(c.message)}db=a}else db=a}return db}
;function fb(a,b){this.h=a===gb&&b||""}
fb.prototype.toString=function(){return this.h};
var gb={};new fb(gb,"");var hb={};function ib(a){this.h=a}
ib.prototype.toString=function(){return this.h+""};
function jb(a){if(a instanceof ib&&a.constructor===ib)return a.h;Oa(a);return"type_error:TrustedResourceUrl"}
function kb(a){var b=eb();a=b?b.createScriptURL(a):a;return new ib(a,hb)}
;/*

 Copyright Google LLC
 SPDX-License-Identifier: Apache-2.0
*/
var mb=ha([""]),nb=ia(["\x00"],["\\0"]),ob=ia(["\n"],["\\n"]),pb=ia(["\x00"],["\\u0000"]);function qb(a){return a.toString().indexOf("`")===-1}
qb(function(a){return a(mb)})||qb(function(a){return a(nb)})||qb(function(a){return a(ob)})||qb(function(a){return a(pb)});function rb(a){this.h=a}
rb.prototype.toString=function(){return this.h};
var sb=new rb("about:invalid#zClosurez");function tb(a){this.ne=a}
function ub(a){return new tb(function(b){return b.substr(0,a.length+1).toLowerCase()===a+":"})}
var vb=[ub("data"),ub("http"),ub("https"),ub("mailto"),ub("ftp"),new tb(function(a){return/^[^:]*([/?#]|$)/.test(a)})],wb=/^\s*(?!javascript:)(?:[\w+.-]+:|[^:/?#]*(?:[/?#]|$))/i;
function xb(a){if(a instanceof rb)if(a instanceof rb)a=a.h;else throw Error("");else a=wb.test(a)?a:void 0;return a}
;function yb(a,b){b=xb(b);b!==void 0&&(a.href=b)}
;function zb(){this.h=Ab[0].toLowerCase()}
zb.prototype.toString=function(){return this.h};function Bb(a){this.h=a}
Bb.prototype.toString=function(){return this.h+""};function Cb(a){var b="true".toString(),c=[new zb];if(c.length===0)throw Error("");if(c.map(function(d){if(d instanceof zb)d=d.h;else throw Error("");return d}).every(function(d){return"data-loaded".indexOf(d)!==0}))throw Error('Attribute "data-loaded" does not match any of the allowed prefixes.');
a.setAttribute("data-loaded",b)}
;function Db(a,b){throw Error(b===void 0?"unexpected value "+a+"!":b);}
;var Eb="alternate author bookmark canonical cite help icon license modulepreload next prefetch dns-prefetch prerender preconnect preload prev search subresource".split(" ");function Fb(a,b){if(b instanceof ib)a.href=jb(b).toString(),a.rel="stylesheet";else{if(Eb.indexOf("stylesheet")===-1)throw Error('TrustedResourceUrl href attribute required with rel="stylesheet"');b=xb(b);b!==void 0&&(a.href=b,a.rel="stylesheet")}}
;function Gb(a){var b,c;return(a=(c=(b=a.document).querySelector)==null?void 0:c.call(b,"script[nonce]"))?a.nonce||a.getAttribute("nonce")||"":""}
;function Hb(a){this.h=a}
Hb.prototype.toString=function(){return this.h+""};function Ib(a){var b=Gb(a.ownerDocument&&a.ownerDocument.defaultView||window);b&&a.setAttribute("nonce",b)}
function Jb(a,b){if(b instanceof Hb)b=b.h;else throw Error("");a.textContent=b;Ib(a)}
function Kb(a,b){a.src=jb(b);Ib(a)}
;var Lb=Array.prototype.indexOf?function(a,b){return Array.prototype.indexOf.call(a,b,void 0)}:function(a,b){if(typeof a==="string")return typeof b!=="string"||b.length!=1?-1:a.indexOf(b,0);
for(var c=0;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Mb=Array.prototype.forEach?function(a,b){Array.prototype.forEach.call(a,b,void 0)}:function(a,b){for(var c=a.length,d=typeof a==="string"?a.split(""):a,e=0;e<c;e++)e in d&&b.call(void 0,d[e],e,a)},Nb=Array.prototype.filter?function(a,b){return Array.prototype.filter.call(a,b,void 0)}:function(a,b){for(var c=a.length,d=[],e=0,f=typeof a==="string"?a.split(""):a,g=0;g<c;g++)if(g in f){var h=f[g];
b.call(void 0,h,g,a)&&(d[e++]=h)}return d},Ob=Array.prototype.map?function(a,b){return Array.prototype.map.call(a,b,void 0)}:function(a,b){for(var c=a.length,d=Array(c),e=typeof a==="string"?a.split(""):a,f=0;f<c;f++)f in e&&(d[f]=b.call(void 0,e[f],f,a));
return d},Pb=Array.prototype.reduce?function(a,b,c){return Array.prototype.reduce.call(a,b,c)}:function(a,b,c){var d=c;
Mb(a,function(e,f){d=b.call(void 0,d,e,f,a)});
return d};
function Qb(a,b){a:{for(var c=a.length,d=typeof a==="string"?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return b<0?null:typeof a==="string"?a.charAt(b):a[b]}
function Rb(a,b){b=Lb(a,b);var c;(c=b>=0)&&Array.prototype.splice.call(a,b,1);return c}
function Sb(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(Pa(d)){var e=a.length||0,f=d.length||0;a.length=e+f;for(var g=0;g<f;g++)a[e+g]=d[g]}else a.push(d)}}
;function Tb(a,b){a.__closure__error__context__984382||(a.__closure__error__context__984382={});a.__closure__error__context__984382.severity=b}
;function Ub(a){var b=E("window.location.href");a==null&&(a='Unknown Error of type "null/undefined"');if(typeof a==="string")return{message:a,name:"Unknown error",lineNumber:"Not available",fileName:b,stack:"Not available"};var c=!1;try{var d=a.lineNumber||a.line||"Not available"}catch(g){d="Not available",c=!0}try{var e=a.fileName||a.filename||a.sourceURL||C.$googDebugFname||b}catch(g){e="Not available",c=!0}b=Vb(a);if(!(!c&&a.lineNumber&&a.fileName&&a.stack&&a.message&&a.name)){c=a.message;if(c==
null){if(a.constructor&&a.constructor instanceof Function){if(a.constructor.name)c=a.constructor.name;else if(c=a.constructor,Wb[c])c=Wb[c];else{c=String(c);if(!Wb[c]){var f=/function\s+([^\(]+)/m.exec(c);Wb[c]=f?f[1]:"[Anonymous]"}c=Wb[c]}c='Unknown Error of type "'+c+'"'}else c="Unknown Error of unknown type";typeof a.toString==="function"&&Object.prototype.toString!==a.toString&&(c+=": "+a.toString())}return{message:c,name:a.name||"UnknownError",lineNumber:d,fileName:e,stack:b||"Not available"}}return{message:a.message,
name:a.name,lineNumber:a.lineNumber,fileName:a.fileName,stack:b}}
function Vb(a,b){b||(b={});b[Xb(a)]=!0;var c=a.stack||"";(a=a.cause)&&!b[Xb(a)]&&(c+="\nCaused by: ",a.stack&&a.stack.indexOf(a.toString())==0||(c+=typeof a==="string"?a:a.message+"\n"),c+=Vb(a,b));return c}
function Xb(a){var b="";typeof a.toString==="function"&&(b=""+a);return b+a.stack}
var Wb={};function Yb(a){for(var b=0,c=0;c<a.length;++c)b=31*b+a.charCodeAt(c)>>>0;return b}
;var Zb=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function $b(a){return a?decodeURI(a):a}
function ac(a,b){return b.match(Zb)[a]||null}
function bc(a){return $b(ac(3,a))}
function cc(a){var b=a.match(Zb);a=b[5];var c=b[6];b=b[7];var d="";a&&(d+=a);c&&(d+="?"+c);b&&(d+="#"+b);return d}
function dc(a){var b=a.indexOf("#");return b<0?a:a.slice(0,b)}
function ec(a,b,c){if(Array.isArray(b))for(var d=0;d<b.length;d++)ec(a,String(b[d]),c);else b!=null&&c.push(a+(b===""?"":"="+encodeURIComponent(String(b))))}
function fc(a){var b=[],c;for(c in a)ec(c,a[c],b);return b.join("&")}
function hc(a,b){b=fc(b);if(b){var c=a.indexOf("#");c<0&&(c=a.length);var d=a.indexOf("?");if(d<0||d>c){d=c;var e=""}else e=a.substring(d+1,c);a=[a.slice(0,d),e,a.slice(c)];c=a[1];a[1]=b?c?c+"&"+b:b:c;b=a[0]+(a[1]?"?"+a[1]:"")+a[2]}else b=a;return b}
function ic(a,b,c,d){for(var e=c.length;(b=a.indexOf(c,b))>=0&&b<d;){var f=a.charCodeAt(b-1);if(f==38||f==63)if(f=a.charCodeAt(b+e),!f||f==61||f==38||f==35)return b;b+=e+1}return-1}
var jc=/#|$/,kc=/[?&]($|#)/;function lc(a,b){for(var c=a.search(jc),d=0,e,f=[];(e=ic(a,d,b,c))>=0;)f.push(a.substring(d,e)),d=Math.min(a.indexOf("&",e)+1||c,c);f.push(a.slice(d));return f.join("").replace(kc,"$1")}
;function mc(a){var b=b===void 0?Number("29"):b;for(var c=[],d=0;d<nc(a,oc,1).length;d++){var e=nc(a,oc,1)[d];pc(e,2)<=b&&c.push(Number(pc(e,1)))}return c}
function qc(a){var b=b===void 0?Number("29"):b;for(var c=[],d=0;d<nc(a,oc,1).length;d++){var e=nc(a,oc,1)[d];pc(e,2)>b&&c.push(Number(pc(e,1)))}return c}
;function rc(a){return{fieldType:2,fieldName:a}}
function F(a){return{fieldType:3,fieldName:a}}
;function sc(a){this.h=a;a.Ra("/client_streamz/bg/fic",F("ke"))}
function tc(a){this.h=a;a.Ra("/client_streamz/bg/fiec",F("rk"),F("ke"),rc("ec"))}
function uc(a){this.h=a;a.Cb("/client_streamz/bg/fil",F("rk"),F("ke"))}
uc.prototype.record=function(a,b,c){this.h.record("/client_streamz/bg/fil",a,b,c)};
function vc(a){this.h=a;a.Ra("/client_streamz/bg/fcc",rc("ph"),F("ke"))}
function wc(a){this.h=a;a.Cb("/client_streamz/bg/fcd",rc("ph"),F("ke"))}
wc.prototype.record=function(a,b,c){this.h.record("/client_streamz/bg/fcd",a,b,c)};
function xc(a){this.h=a;a.Ra("/client_streamz/bg/fsc",F("rk"),F("ke"))}
function yc(a){this.h=a;a.Cb("/client_streamz/bg/fsl",F("rk"),F("ke"))}
yc.prototype.record=function(a,b,c){this.h.record("/client_streamz/bg/fsl",a,b,c)};
function zc(a){this.h=a;a.Cb("/client_streamz/bg/wrl",F("mn"),rc("ac"),rc("sc"),F("rk"),F("mk"))}
zc.prototype.record=function(a,b,c,d,e,f){this.h.record("/client_streamz/bg/wrl",a,b,c,d,e,f)};
function Ac(a){this.h=a;a.Cb("/client_streamz/bg/el",F("en"),F("bk"),F("rk"),F("mk"))}
Ac.prototype.record=function(a,b,c,d,e){this.h.record("/client_streamz/bg/el",a,b,c,d,e)};
function Bc(a){this.h=a;a.Ra("/client_streamz/bg/cec",rc("ec"),F("bk"),F("rk"),F("mk"))}
function Cc(a){a.Ra("/client_streamz/bg/po/csc",rc("cs"),F("rk"),F("mk"))}
function Dc(a){a.Ra("/client_streamz/bg/po/ctav",F("av"),F("rk"),F("mk"))}
function Ec(a){a.Ra("/client_streamz/bg/po/cwsc",F("su"),F("rk"),F("mk"))}
;function Fc(a){C.setTimeout(function(){throw a;},0)}
;var Gc=Na(610401301,!1),Hc=Na(645172343,!0);function Ic(){var a=C.navigator;return a&&(a=a.userAgent)?a:""}
var Jc,Kc=C.navigator;Jc=Kc?Kc.userAgentData||null:null;function Lc(a){return Gc?Jc?Jc.brands.some(function(b){return(b=b.brand)&&b.indexOf(a)!=-1}):!1:!1}
function H(a){return Ic().indexOf(a)!=-1}
;function Mc(){return Gc?!!Jc&&Jc.brands.length>0:!1}
function Nc(){return Mc()?!1:H("Opera")}
function Oc(){return H("Firefox")||H("FxiOS")}
function Pc(){return Mc()?Lc("Chromium"):(H("Chrome")||H("CriOS"))&&!(Mc()?0:H("Edge"))||H("Silk")}
;function Qc(){return Gc?!!Jc&&!!Jc.platform:!1}
function Rc(){return H("iPhone")&&!H("iPod")&&!H("iPad")}
;var Sc=Nc(),Tc=Mc()?!1:H("Trident")||H("MSIE"),Uc=H("Edge"),Vc=H("Gecko")&&!(Ic().toLowerCase().indexOf("webkit")!=-1&&!H("Edge"))&&!(H("Trident")||H("MSIE"))&&!H("Edge"),Wc=Ic().toLowerCase().indexOf("webkit")!=-1&&!H("Edge");Wc&&H("Mobile");Qc()||H("Macintosh");Qc()||H("Windows");(Qc()?Jc.platform==="Linux":H("Linux"))||Qc()||H("CrOS");var Xc=Qc()?Jc.platform==="Android":H("Android");Rc();H("iPad");H("iPod");Rc()||H("iPad")||H("iPod");Ic().toLowerCase().indexOf("kaios");Oc();var Yc=Rc()||H("iPod"),Zc=H("iPad");!H("Android")||Pc()||Oc()||Nc()||H("Silk");Pc();var $c=H("Safari")&&!(Pc()||(Mc()?0:H("Coast"))||Nc()||(Mc()?0:H("Edge"))||(Mc()?Lc("Microsoft Edge"):H("Edg/"))||(Mc()?Lc("Opera"):H("OPR"))||Oc()||H("Silk")||H("Android"))&&!(Rc()||H("iPad")||H("iPod"));var ad={},bd=null;function cd(a,b){Pa(a);b===void 0&&(b=0);dd();b=ad[b];for(var c=Array(Math.floor(a.length/3)),d=b[64]||"",e=0,f=0;e<a.length-2;e+=3){var g=a[e],h=a[e+1],k=a[e+2],l=b[g>>2];g=b[(g&3)<<4|h>>4];h=b[(h&15)<<2|k>>6];k=b[k&63];c[f++]=""+l+g+h+k}l=0;k=d;switch(a.length-e){case 2:l=a[e+1],k=b[(l&15)<<2]||d;case 1:a=a[e],c[f]=""+b[a>>2]+b[(a&3)<<4|l>>4]+k+d}return c.join("")}
function ed(a){var b=a.length,c=b*3/4;c%3?c=Math.floor(c):"=.".indexOf(a[b-1])!=-1&&(c="=.".indexOf(a[b-2])!=-1?c-2:c-1);var d=new Uint8Array(c),e=0;fd(a,function(f){d[e++]=f});
return e!==c?d.subarray(0,e):d}
function fd(a,b){function c(k){for(;d<a.length;){var l=a.charAt(d++),m=bd[l];if(m!=null)return m;if(!/^[\s\xa0]*$/.test(l))throw Error("Unknown base64 encoding at char: "+l);}return k}
dd();for(var d=0;;){var e=c(-1),f=c(0),g=c(64),h=c(64);if(h===64&&e===-1)break;b(e<<2|f>>4);g!=64&&(b(f<<4&240|g>>2),h!=64&&b(g<<6&192|h))}}
function dd(){if(!bd){bd={};for(var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),b=["+/=","+/","-_=","-_.","-_"],c=0;c<5;c++){var d=a.concat(b[c].split(""));ad[c]=d;for(var e=0;e<d.length;e++){var f=d[e];bd[f]===void 0&&(bd[f]=e)}}}}
;var gd=typeof Uint8Array!=="undefined",hd=!Tc&&typeof btoa==="function";function id(a){if(!hd)return cd(a);for(var b="",c=0,d=a.length-10240;c<d;)b+=String.fromCharCode.apply(null,a.subarray(c,c+=10240));b+=String.fromCharCode.apply(null,c?a.subarray(c):a);return btoa(b)}
var jd=/[-_.]/g,kd={"-":"+",_:"/",".":"="};function ld(a){return kd[a]||""}
function md(a){return gd&&a!=null&&a instanceof Uint8Array}
var nd={};var od;function pd(a){if(a!==nd)throw Error("illegal external caller");}
function qd(a,b){pd(b);this.h=a;if(a!=null&&a.length===0)throw Error("ByteString should be constructed with non-empty values");}
qd.prototype.sizeBytes=function(){pd(nd);var a=this.h;if(a!=null&&!md(a))if(typeof a==="string")if(hd){jd.test(a)&&(a=a.replace(jd,ld));a=atob(a);for(var b=new Uint8Array(a.length),c=0;c<a.length;c++)b[c]=a.charCodeAt(c);a=b}else a=ed(a);else Oa(a),a=null;return(a=a==null?a:this.h=a)?a.length:0};var rd;function sd(){var a=Error();Tb(a,"incident");Fc(a)}
function td(a){a=Error(a);Tb(a,"warning");return a}
;function ud(){return typeof BigInt==="function"}
;function vd(a){return Array.prototype.slice.call(a)}
;var wd=typeof Symbol==="function"&&typeof Symbol()==="symbol";function xd(a){return typeof Symbol==="function"&&typeof Symbol()==="symbol"?Symbol():a}
var yd=xd(),zd=xd("2ex"),Ad=xd("1oa");Math.max.apply(Math,ja(Object.values({Fg:1,Dg:2,Cg:4,Ig:8,Hg:16,Gg:32,xf:64,Kg:128,Bg:256,Ag:512,Eg:1024,Cf:2048,Jg:4096,Df:8192})));var Bd=wd?function(a,b){a[yd]|=b}:function(a,b){a.h!==void 0?a.h|=b:Object.defineProperties(a,{h:{value:b,
configurable:!0,writable:!0,enumerable:!1}})},Cd=wd?function(a){return a[yd]|0}:function(a){return a.h|0},Dd=wd?function(a){return a[yd]}:function(a){return a.h},Ed=wd?function(a,b){a[yd]=b}:function(a,b){a.h!==void 0?a.h=b:Object.defineProperties(a,{h:{value:b,
configurable:!0,writable:!0,enumerable:!1}})};
function Fd(a,b){Ed(b,(a|0)&-14591)}
function Gd(a,b){Ed(b,(a|34)&-14557)}
;var Hd={},Id={};function Jd(a){return!(!a||typeof a!=="object"||a.h!==Id)}
function Kd(a){return a!==null&&typeof a==="object"&&!Array.isArray(a)&&a.constructor===Object}
function Ld(a){return!Array.isArray(a)||a.length?!1:Cd(a)&1?!0:!1}
var Md,Nd=[];Ed(Nd,55);Md=Object.freeze(Nd);function Od(a){if(a&2)throw Error();}
var Pd=Object.freeze({});Object.freeze({});var Qd=Object.freeze({});function Rd(a){a.Vg=!0;return a}
;var Sd=Rd(function(a){return typeof a==="number"}),Td=Rd(function(a){return typeof a==="string"}),Ud=Rd(function(a){return typeof a==="boolean"});
function Vd(){var a=Wd;return Rd(function(b){for(var c in a)if(b===a[c]&&!/^[0-9]+$/.test(c))return!0;return!1})}
;var Xd=typeof C.BigInt==="function"&&typeof C.BigInt(0)==="bigint";function Yd(a){var b=a;if(Td(b)){if(!/^\s*(?:-?[1-9]\d*|0)?\s*$/.test(b))throw Error(String(b));}else if(Sd(b)&&!Number.isSafeInteger(b))throw Error(String(b));return Xd?BigInt(a):a=Ud(a)?a?"1":"0":Td(a)?a.trim()||"0":String(a)}
var de=Rd(function(a){return Xd?a>=Zd&&a<=$d:a[0]==="-"?ae(a,be):ae(a,ce)}),be=Number.MIN_SAFE_INTEGER.toString(),Zd=Xd?BigInt(Number.MIN_SAFE_INTEGER):void 0,ce=Number.MAX_SAFE_INTEGER.toString(),$d=Xd?BigInt(Number.MAX_SAFE_INTEGER):void 0;
function ae(a,b){if(a.length>b.length)return!1;if(a.length<b.length||a===b)return!0;for(var c=0;c<a.length;c++){var d=a[c],e=b[c];if(d>e)return!1;if(d<e)return!0}}
;var ee=0,fe=0;function ge(a){var b=a>>>0;ee=b;fe=(a-b)/4294967296>>>0}
function he(a){if(a<0){ge(0-a);var b=v(ie(ee,fe));a=b.next().value;b=b.next().value;ee=a>>>0;fe=b>>>0}else ge(a)}
function je(a,b){b>>>=0;a>>>=0;if(b<=2097151)var c=""+(4294967296*b+a);else ud()?c=""+(BigInt(b)<<BigInt(32)|BigInt(a)):(c=(a>>>24|b<<8)&16777215,b=b>>16&65535,a=(a&16777215)+c*6777216+b*6710656,c+=b*8147497,b*=2,a>=1E7&&(c+=a/1E7>>>0,a%=1E7),c>=1E7&&(b+=c/1E7>>>0,c%=1E7),c=b+ke(c)+ke(a));return c}
function ke(a){a=String(a);return"0000000".slice(a.length)+a}
function le(){var a=ee,b=fe;b&2147483648?ud()?a=""+(BigInt(b|0)<<BigInt(32)|BigInt(a>>>0)):(b=v(ie(a,b)),a=b.next().value,b=b.next().value,a="-"+je(a,b)):a=je(a,b);return a}
function ie(a,b){b=~b;a?a=~a+1:b+=1;return[a,b]}
;function me(a){return a.displayName||a.name||"unknown type name"}
function ne(a){if(a!=null&&typeof a!=="boolean")throw Error("Expected boolean but got "+Oa(a)+": "+a);return a}
var oe=/^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;function pe(a){var b=typeof a;switch(b){case "bigint":return!0;case "number":return Number.isFinite(a)}return b!=="string"?!1:oe.test(a)}
function qe(a){if(typeof a!=="number")throw td("int32");if(!Number.isFinite(a))throw td("int32");return a|0}
function re(a){return a==null?a:qe(a)}
function se(a){if(a==null)return a;if(typeof a==="string"){if(!a)return;a=+a}if(typeof a==="number")return Number.isFinite(a)?a|0:void 0}
function te(a){var b=0;b=b===void 0?0:b;if(!pe(a))throw td("int64");var c=typeof a;switch(b){case 4096:switch(c){case "string":return ue(a);case "bigint":return String(BigInt.asIntN(64,a));default:return ve(a)}case 8192:switch(c){case "string":return b=Math.trunc(Number(a)),Number.isSafeInteger(b)?a=Yd(b):(b=a.indexOf("."),b!==-1&&(a=a.substring(0,b)),a=ud()?Yd(BigInt.asIntN(64,BigInt(a))):Yd(we(a))),a;case "bigint":return Yd(BigInt.asIntN(64,a));default:return Yd(xe(a))}case 0:switch(c){case "string":return ue(a);
case "bigint":return Yd(BigInt.asIntN(64,a));default:return xe(a)}default:return Db(b,"Unknown format requested type for int64")}}
function ye(a){return a==null?a:te(a)}
function ze(a){return a[0]==="-"?a.length<20?!0:a.length===20&&Number(a.substring(0,7))>-922337:a.length<19?!0:a.length===19&&Number(a.substring(0,6))<922337}
function we(a){a.indexOf(".");if(ze(a))return a;if(a.length<16)he(Number(a));else if(ud())a=BigInt(a),ee=Number(a&BigInt(4294967295))>>>0,fe=Number(a>>BigInt(32)&BigInt(4294967295));else{var b=+(a[0]==="-");fe=ee=0;for(var c=a.length,d=0+b,e=(c-b)%6+b;e<=c;d=e,e+=6)d=Number(a.slice(d,e)),fe*=1E6,ee=ee*1E6+d,ee>=4294967296&&(fe+=Math.trunc(ee/4294967296),fe>>>=0,ee>>>=0);b&&(b=v(ie(ee,fe)),a=b.next().value,b=b.next().value,ee=a,fe=b)}return le()}
function xe(a){pe(a);a=Math.trunc(a);if(!Number.isSafeInteger(a)){he(a);var b=ee,c=fe;if(a=c&2147483648)b=~b+1>>>0,c=~c>>>0,b==0&&(c=c+1>>>0);b=c*4294967296+(b>>>0);a=a?-b:b}return a}
function ve(a){pe(a);a=Math.trunc(a);if(Number.isSafeInteger(a))a=String(a);else{var b=String(a);ze(b)?a=b:(he(a),a=le())}return a}
function ue(a){pe(a);var b=Math.trunc(Number(a));if(Number.isSafeInteger(b))return String(b);b=a.indexOf(".");b!==-1&&(a=a.substring(0,b));return we(a)}
function Ae(a){if(a==null)return a;if(typeof a==="bigint")return de(a)?a=Number(a):(a=BigInt.asIntN(64,a),a=de(a)?Number(a):String(a)),a;if(pe(a))return typeof a==="number"?xe(a):ue(a)}
function Be(a){if(typeof a!=="string")throw Error();return a}
function Ce(a){if(a!=null&&typeof a!=="string")throw Error();return a}
function De(a,b){if(!(a instanceof b))throw Error("Expected instanceof "+me(b)+" but got "+(a&&me(a.constructor)));}
function Ee(a,b,c){if(a!=null&&typeof a==="object"&&a.Dc===Hd)return a;if(Array.isArray(a)){var d=Cd(a),e=d;e===0&&(e|=c&32);e|=c&2;e!==d&&Ed(a,e);return new b(a)}}
;function Fe(a){var b=Ge(a);if(b)return b;if(Math.random()>.01)return a;if(He===void 0)if(typeof Proxy!=="function")He=null;else try{He=Proxy.toString().indexOf("[native code]")!==-1?Proxy:null}catch(c){He=null}b=He;if(!b)return a;b=new b(a,{set:function(c,d,e){Ie();c[d]=e;return!0}});
Je(a,b);return b}
function Ie(){sd()}
var Ke=void 0,Le=void 0;function Ge(a){var b;return(b=Ke)==null?void 0:b.get(a)}
function Me(a){var b;return((b=Le)==null?void 0:b.get(a))||a}
function Je(a,b){(Ke||(Ke=new WeakMap)).set(a,b);(Le||(Le=new WeakMap)).set(b,a)}
var He=void 0;var Ne;function Oe(a,b){Cd(b);Ne=b;a=new a(b);Ne=void 0;return a}
function J(a,b,c){a==null&&(a=Ne);Ne=void 0;if(a==null){var d=96;c?(a=[c],d|=512):a=[];b&&(d=d&-16760833|(b&1023)<<14)}else{if(!Array.isArray(a))throw Error("narr");d=Cd(a);if(d&2048)throw Error("farr");if(d&64)return a;d|=64;if(c&&(d|=512,c!==a[0]))throw Error("mid");a:{c=a;var e=c.length;if(e){var f=e-1;if(Kd(c[f])){d|=256;b=f-(+!!(d&512)-1);if(b>=1024)throw Error("pvtlmt");d=d&-16760833|(b&1023)<<14;break a}}if(b){b=Math.max(b,e-(+!!(d&512)-1));if(b>1024)throw Error("spvt");d=d&-16760833|(b&1023)<<
14}}}Ed(a,d);return a}
;function Pe(a,b){return Qe(b)}
function Qe(a){switch(typeof a){case "number":return isFinite(a)?a:String(a);case "bigint":return de(a)?Number(a):String(a);case "boolean":return a?1:0;case "object":if(a)if(Array.isArray(a)){if(Ld(a))return}else{if(md(a))return id(a);if(a instanceof qd){var b=a.h;return b==null?"":typeof b==="string"?b:a.h=id(b)}}}return a}
;function Re(a,b,c){a=vd(a);var d=a.length,e=b&256?a[d-1]:void 0;d+=e?-1:0;for(b=b&512?1:0;b<d;b++)a[b]=c(a[b]);if(e){b=a[b]={};for(var f in e)b[f]=c(e[f])}return a}
function Se(a,b,c,d,e){if(a!=null){if(Array.isArray(a))a=Ld(a)?void 0:e&&Cd(a)&2?a:Te(a,b,c,d!==void 0,e);else if(Kd(a)){var f={},g;for(g in a)f[g]=Se(a[g],b,c,d,e);a=f}else a=b(a,d);return a}}
function Te(a,b,c,d,e){var f=d||c?Cd(a):0;d=d?!!(f&32):void 0;a=vd(a);for(var g=0;g<a.length;g++)a[g]=Se(a[g],b,c,d,e);c&&c(f,a);return a}
function Ue(a){return a.Dc===Hd?a.toJSON():Qe(a)}
;function Ve(a,b,c){c=c===void 0?Gd:c;if(a!=null){if(gd&&a instanceof Uint8Array)return b?a:new Uint8Array(a);if(Array.isArray(a)){var d=Cd(a);if(d&2)return a;b&&(b=d===0||!!(d&32)&&!(d&64||!(d&16)));return b?(Ed(a,(d|34)&-12293),a):Te(a,Ve,d&4?Gd:c,!0,!0)}a.Dc===Hd&&(c=a.H,d=Dd(c),a=d&2?a:Oe(a.constructor,We(c,d,!0)));return a}}
function We(a,b,c){var d=c||b&2?Gd:Fd,e=!!(b&32);a=Re(a,b,function(f){return Ve(f,e,d)});
Bd(a,32|(c?2:0));return a}
function Xe(a){var b=a.H,c=Dd(b);return c&2?Oe(a.constructor,We(b,c,!1)):a}
;function Ye(a,b){a=a.H;return Ze(a,Dd(a),b)}
function $e(a,b,c,d){b=d+(+!!(b&512)-1);if(!(b<0||b>=a.length||b>=c))return a[b]}
function Ze(a,b,c,d){if(c===-1)return null;var e=b>>14&1023||536870912;if(c>=e){if(b&256)return a[a.length-1][c]}else{var f=a.length;if(d&&b&256&&(d=a[f-1][c],d!=null)){if($e(a,b,e,c)&&zd!=null){var g;a=(g=rd)!=null?g:rd={};g=a[zd]||0;g>=4||(a[zd]=g+1,sd())}return d}return $e(a,b,e,c)}}
function af(a,b,c){var d=a.H,e=Dd(d);Od(e);bf(d,e,b,c);return a}
function bf(a,b,c,d,e){Kd(d);var f=b>>14&1023||536870912;if(c>=f||e&&!Hc){var g=b;if(b&256)e=a[a.length-1];else{if(d==null)return g;e=a[f+(+!!(b&512)-1)]={};g|=256}e[c]=d;c<f&&(a[c+(+!!(b&512)-1)]=void 0);g!==b&&Ed(a,g);return g}a[c+(+!!(b&512)-1)]=d;b&256&&(a=a[a.length-1],c in a&&delete a[c]);return b}
function cf(a){return df(a,ef,11,!1)!==void 0}
function ff(a){return!!(2&a)&&!!(4&a)||!!(2048&a)}
function gf(a,b,c){var d=a.H,e=Dd(d);Od(e);if(b==null)return bf(d,e,3),a;b=Me(b);if(!Array.isArray(b))throw td();var f=Cd(b),g=f,h=!!(2&f)||Object.isFrozen(b),k=!h&&(void 0===Qd||!1);if(!(4&f))for(f=21,h&&(b=vd(b),g=0,f=hf(f,e),f=jf(f,e,!0)),h=0;h<b.length;h++)b[h]=c(b[h]);k&&(b=vd(b),g=0,f=hf(f,e),f=jf(f,e,!0));f!==g&&Ed(b,f);bf(d,e,3,b);return a}
function kf(a,b,c,d){a=a.H;var e=Dd(a);Od(e);if(d==null){var f=lf(a);if(mf(f,a,e,c)===b)f.set(c,0);else return}else{c.includes(b);f=lf(a);var g=mf(f,a,e,c);g!==b&&(g&&(e=bf(a,e,g)),f.set(c,b))}bf(a,e,b,d)}
function lf(a){if(wd){var b;return(b=a[Ad])!=null?b:a[Ad]=new Map}if(Ad in a)return a[Ad];b=new Map;Object.defineProperty(a,Ad,{value:b});return b}
function mf(a,b,c,d){var e=a.get(d);if(e!=null)return e;for(var f=e=0;f<d.length;f++){var g=d[f];Ze(b,c,g)!=null&&(e!==0&&(c=bf(b,c,e)),e=g)}a.set(d,e);return e}
function df(a,b,c,d){a=a.H;var e=Dd(a),f=Ze(a,e,c,d);b=Ee(f,b,e);b!==f&&b!=null&&bf(a,e,c,b,d);return b}
function nf(a,b,c,d){d=d===void 0?!1:d;b=df(a,b,c,d);if(b==null)return b;a=a.H;var e=Dd(a);if(!(e&2)){var f=Xe(b);f!==b&&(b=f,bf(a,e,c,b,d))}return b}
function nc(a,b,c){var d=void 0===Pd?2:5;var e=a.H,f=Dd(e);a=f;var g=!(2&f),h=!!(2&a);f=h?1:d;g&&(g=!h);d=Ze(e,a,c);d=Array.isArray(d)?d:Md;var k=Cd(d);h=!!(4&k);if(!h){var l=k;l===0&&(l=hf(l,a));k=d;l|=1;var m=a,n=!!(2&l);n&&(m|=2);for(var r=!n,t=!0,w=0,y=0;w<k.length;w++){var z=Ee(k[w],b,m);if(z instanceof b){if(!n){var G=!!(Cd(z.H)&2);r&&(r=!G);t&&(t=G)}k[y++]=z}}y<w&&(k.length=y);l|=4;l=t?l|16:l&-17;l=r?l|8:l&-9;Ed(k,l);n&&Object.freeze(k);k=l}if(g&&!(8&k||!d.length&&(f===1||f===4&&32&k))){ff(k)&&
(d=vd(d),k=hf(k,a),a=bf(e,a,c,d));b=d;g=k;for(k=0;k<b.length;k++)l=b[k],m=Xe(l),l!==m&&(b[k]=m);g|=8;g=b.length?g&-17:g|16;Ed(b,g);k=g}var I;f===1||f===4&&32&k?ff(k)||(c=k,a=!!(32&k),k|=!d.length||16&k&&(!h||a)?2:2048,k!==c&&Ed(d,k),Object.freeze(d)):(h=f!==5?!1:!!(32&k)||ff(k)||!!Ge(d),(f===2||h)&&ff(k)&&(d=vd(d),k=hf(k,a),k=jf(k,a,!1),Ed(d,k),a=bf(e,a,c,d)),ff(k)||(c=k,k=jf(k,a,!1),k!==c&&Ed(d,k)),h&&(I=Fe(d)));return I||d}
function of(a,b,c,d){d!=null?De(d,b):d=void 0;return af(a,c,d)}
function pf(a,b,c,d){var e=a.H,f=Dd(e);Od(f);if(d==null)return bf(e,f,c),a;d=Me(d);if(!Array.isArray(d))throw td();for(var g=Cd(d),h=g,k=!!(2&g)||!!(2048&g),l=k||Object.isFrozen(d),m=!l&&(void 0===Qd||!1),n=!0,r=!0,t=0;t<d.length;t++){var w=d[t];De(w,b);k||(w=!!(Cd(w.H)&2),n&&(n=!w),r&&(r=w))}k||(g|=5,g=n?g|8:g&-9,g=r?g|16:g&-17);if(m||l&&g!==h)d=vd(d),h=0,g=hf(g,f),g=jf(g,f,!0);g!==h&&Ed(d,g);bf(e,f,c,d);return a}
function hf(a,b){a=(2&b?a|2:a&-3)|32;return a&=-2049}
function jf(a,b,c){32&b&&c||(a&=-33);return a}
function qf(a){a=Ye(a,1);var b=b===void 0?!1:b;var c=typeof a;b=a==null?a:c==="bigint"?String(BigInt.asIntN(64,a)):pe(a)?c==="string"?ue(a):b?ve(a):xe(a):void 0;return b}
function rf(a,b){return a!=null?a:b}
function sf(a){var b=b===void 0?!1:b;a=Ye(a,4);return rf(a==null||typeof a==="boolean"?a:typeof a==="number"?!!a:void 0,b)}
function pc(a,b,c){c=c===void 0?0:c;return rf(se(Ye(a,b)),c)}
function tf(a,b){var c=c===void 0?"":c;a=Ye(a,b);return rf(a==null||typeof a==="string"?a:void 0,c)}
function uf(a){var b=0;b=b===void 0?0:b;a=Ye(a,1);a=a==null?a:Number.isFinite(a)?a|0:void 0;return rf(a,b)}
function vf(a,b,c){return af(a,b,Ce(c))}
function wf(a,b,c){if(c!=null){if(!Number.isFinite(c))throw td("enum");c|=0}return af(a,b,c)}
;function xf(a){return a}
function yf(a){return a}
function zf(a,b,c,d){return Af(a,b,c,d,Bf,Cf)}
function Df(a,b,c,d){return Af(a,b,c,d,Ef,Ff)}
function Af(a,b,c,d,e,f){if(!c.length&&!d)return 0;for(var g=0,h=0,k=0,l=0,m=0,n=c.length-1;n>=0;n--){var r=c[n];d&&n===c.length-1&&r===d||(l++,r!=null&&k++)}if(d)for(var t in d)n=+t,isNaN(n)||(m+=Gf(n),h++,n>g&&(g=n));l=e(l,k)+f(h,g,m);t=k;n=h;r=g;for(var w=m,y=c.length-1;y>=0;y--){var z=c[y];if(!(z==null||d&&y===c.length-1&&z===d)){z=y-b;var G=e(z,t)+f(n,r,w);G<l&&(a=1+z,l=G);n++;t--;w+=Gf(z);r=Math.max(r,z)}}b=e(0,0)+f(n,r,w);b<l&&(a=0,l=b);if(d){n=h;r=g;w=m;t=k;for(var I in d)d=+I,isNaN(d)||d>=
1024||(n--,t++,w-=I.length,g=e(d,t)+f(n,r,w),g<l&&(a=1+d,l=g))}return a}
function Ff(a,b,c){return c+a*3+(a>1?a-1:0)}
function Ef(a,b){return(a>1?a-1:0)+(a-b)*4}
function Cf(a,b){return a==0?0:9*Math.max(1<<32-Math.clz32(a+a/2-1),4)<=b?a==0?0:a<4?100+(a-1)*16:a<6?148+(a-4)*16:a<12?244+(a-6)*16:a<22?436+(a-12)*19:a<44?820+(a-22)*17:52+32*a:40+4*b}
function Bf(a){return 40+4*a}
function Gf(a){return a>=100?a>=1E4?Math.ceil(Math.log10(1+a)):a<1E3?3:4:a<10?1:2}
;var Hf,If;function K(a,b,c){this.H=J(a,b,c)}
p=K.prototype;p.toJSON=function(){return Jf(this)};
p.serialize=function(a){try{return If=!0,a&&(Hf=a===yf||a!==xf&&a!==zf&&a!==Df?yf:a),JSON.stringify(Jf(this),Pe)}finally{a&&(Hf=void 0),If=!1}};
function Kf(a,b){if(b==null||b=="")return new a;b=JSON.parse(b);if(!Array.isArray(b))throw Error("dnarr");Bd(b,32);return Oe(a,b)}
p.clone=function(){var a=this.H,b=Dd(a);return Oe(this.constructor,We(a,b,!1))};
p.Dc=Hd;p.toString=function(){try{return If=!0,Jf(this).toString()}finally{If=!1}};
function Jf(a){var b;If?b=a.H:b=Te(a.H,Ue,void 0,void 0,!1);var c=!If,d=Dd(c?a.H:b);if(a=b.length){var e=b[a-1],f=Kd(e);f?a--:e=void 0;var g=+!!(d&512)-1,h=a-g;d=!!Hf&&Hc&&!(d&512);var k,l=(k=Hf)!=null?k:yf;k=d?l(h,g,b,e):h;d=(h=d&&h!==k)?Array.prototype.slice.call(b,0,a):b;if(f||h){b:{var m=d;var n=e;f={};l=!1;if(h)for(var r=Math.max(0,k+g);r<m.length;r++){var t=m[r],w=r-g;t==null||Ld(t)||Jd(t)&&t.size===0||(m[r]=void 0,f[w]=t,l=!0)}if(n)for(var y in n)if(r=+y,isNaN(r))f[y]=n[y];else if(t=n[y],Array.isArray(t)&&
(Ld(t)||Jd(t)&&t.size===0)&&(t=null),t==null&&(l=!0),h&&r<k){l=!0;t=r+g;for(w=m.length;w<=t;w++)m.push(void 0);m[t]=n[r]}else t!=null&&(f[y]=t);if(l){for(var z in f){n=f;break b}n=null}}m=n==null?e!=null:n!==e}h&&(a=d.length);for(;a>0;a--){y=d[a-1];if(!(y==null||Ld(y)||Jd(y)&&y.size===0))break;var G=!0}if(d!==b||m||G){if(!h&&!c)d=Array.prototype.slice.call(d,0,a);else if(G||m||n)d.length=a;n&&d.push(n)}G=d}else G=b;return G}
;function Lf(a){return function(b){return Kf(a,b)}}
;function Mf(a){this.H=J(a)}
x(Mf,K);function Nf(a,b){return gf(a,b,qe)}
;function Of(a){this.H=J(a)}
x(Of,K);var Pf=[1,2,3];function Qf(a){this.H=J(a)}
x(Qf,K);var Rf=[1,2,3];function Sf(a){this.H=J(a)}
x(Sf,K);function Tf(a){this.H=J(a)}
x(Tf,K);function Uf(a){this.H=J(a)}
x(Uf,K);function Vf(a){if(!a)return"";if(/^about:(?:blank|srcdoc)$/.test(a))return window.origin||"";a.indexOf("blob:")===0&&(a=a.substring(5));a=a.split("#")[0].split("?")[0];a=a.toLowerCase();a.indexOf("//")==0&&(a=window.location.protocol+a);/^[\w\-]*:\/\//.test(a)||(a=window.location.href);var b=a.substring(a.indexOf("://")+3),c=b.indexOf("/");c!=-1&&(b=b.substring(0,c));c=a.substring(0,a.indexOf("://"));if(!c)throw Error("URI is missing protocol: "+a);if(c!=="http"&&c!=="https"&&c!=="chrome-extension"&&
c!=="moz-extension"&&c!=="file"&&c!=="android-app"&&c!=="chrome-search"&&c!=="chrome-untrusted"&&c!=="chrome"&&c!=="app"&&c!=="devtools")throw Error("Invalid URI scheme in origin: "+c);a="";var d=b.indexOf(":");if(d!=-1){var e=b.substring(d+1);b=b.substring(0,d);if(c==="http"&&e!=="80"||c==="https"&&e!=="443")a=":"+e}return c+"://"+b+a}
;function Wf(){function a(){e[0]=1732584193;e[1]=4023233417;e[2]=2562383102;e[3]=271733878;e[4]=3285377520;m=l=0}
function b(n){for(var r=g,t=0;t<64;t+=4)r[t/4]=n[t]<<24|n[t+1]<<16|n[t+2]<<8|n[t+3];for(t=16;t<80;t++)n=r[t-3]^r[t-8]^r[t-14]^r[t-16],r[t]=(n<<1|n>>>31)&4294967295;n=e[0];var w=e[1],y=e[2],z=e[3],G=e[4];for(t=0;t<80;t++){if(t<40)if(t<20){var I=z^w&(y^z);var N=1518500249}else I=w^y^z,N=1859775393;else t<60?(I=w&y|z&(w|y),N=2400959708):(I=w^y^z,N=3395469782);I=((n<<5|n>>>27)&4294967295)+I+G+N+r[t]&4294967295;G=z;z=y;y=(w<<30|w>>>2)&4294967295;w=n;n=I}e[0]=e[0]+n&4294967295;e[1]=e[1]+w&4294967295;e[2]=
e[2]+y&4294967295;e[3]=e[3]+z&4294967295;e[4]=e[4]+G&4294967295}
function c(n,r){if(typeof n==="string"){n=unescape(encodeURIComponent(n));for(var t=[],w=0,y=n.length;w<y;++w)t.push(n.charCodeAt(w));n=t}r||(r=n.length);t=0;if(l==0)for(;t+64<r;)b(n.slice(t,t+64)),t+=64,m+=64;for(;t<r;)if(f[l++]=n[t++],m++,l==64)for(l=0,b(f);t+64<r;)b(n.slice(t,t+64)),t+=64,m+=64}
function d(){var n=[],r=m*8;l<56?c(h,56-l):c(h,64-(l-56));for(var t=63;t>=56;t--)f[t]=r&255,r>>>=8;b(f);for(t=r=0;t<5;t++)for(var w=24;w>=0;w-=8)n[r++]=e[t]>>w&255;return n}
for(var e=[],f=[],g=[],h=[128],k=1;k<64;++k)h[k]=0;var l,m;a();return{reset:a,update:c,digest:d,Qd:function(){for(var n=d(),r="",t=0;t<n.length;t++)r+="0123456789ABCDEF".charAt(Math.floor(n[t]/16))+"0123456789ABCDEF".charAt(n[t]%16);return r}}}
;function Xf(a,b,c){var d=String(C.location.href);return d&&a&&b?[b,Yf(Vf(d),a,c||null)].join(" "):null}
function Yf(a,b,c){var d=[],e=[];if((Array.isArray(c)?2:1)==1)return e=[b,a],Mb(d,function(h){e.push(h)}),Zf(e.join(" "));
var f=[],g=[];Mb(c,function(h){g.push(h.key);f.push(h.value)});
c=Math.floor((new Date).getTime()/1E3);e=f.length==0?[c,b,a]:[f.join(":"),c,b,a];Mb(d,function(h){e.push(h)});
a=Zf(e.join(" "));a=[c,a];g.length==0||a.push(g.join(""));return a.join("_")}
function Zf(a){var b=Wf();b.update(a);return b.Qd().toLowerCase()}
;var $f={};function ag(a){this.h=a||{cookie:""}}
p=ag.prototype;p.isEnabled=function(){if(!C.navigator.cookieEnabled)return!1;if(this.h.cookie)return!0;this.set("TESTCOOKIESENABLED","1",{Lb:60});if(this.get("TESTCOOKIESENABLED")!=="1")return!1;this.remove("TESTCOOKIESENABLED");return!0};
p.set=function(a,b,c){var d=!1;if(typeof c==="object"){var e=c.Je;d=c.secure||!1;var f=c.domain||void 0;var g=c.path||void 0;var h=c.Lb}if(/[;=\s]/.test(a))throw Error('Invalid cookie name "'+a+'"');if(/[;\r\n]/.test(b))throw Error('Invalid cookie value "'+b+'"');h===void 0&&(h=-1);c=f?";domain="+f:"";g=g?";path="+g:"";d=d?";secure":"";h=h<0?"":h==0?";expires="+(new Date(1970,1,1)).toUTCString():";expires="+(new Date(Date.now()+h*1E3)).toUTCString();this.h.cookie=a+"="+b+c+g+h+d+(e!=null?";samesite="+
e:"")};
p.get=function(a,b){for(var c=a+"=",d=(this.h.cookie||"").split(";"),e=0,f;e<d.length;e++){f=cb(d[e]);if(f.lastIndexOf(c,0)==0)return f.slice(c.length);if(f==a)return""}return b};
p.remove=function(a,b,c){var d=this.get(a)!==void 0;this.set(a,"",{Lb:0,path:b,domain:c});return d};
p.clear=function(){for(var a=(this.h.cookie||"").split(";"),b=[],c=[],d,e,f=0;f<a.length;f++)e=cb(a[f]),d=e.indexOf("="),d==-1?(b.push(""),c.push(e)):(b.push(e.substring(0,d)),c.push(e.substring(d+1)));for(a=b.length-1;a>=0;a--)this.remove(b[a])};
var bg=new ag(typeof document=="undefined"?null:document);function cg(a){return!!$f.FPA_SAMESITE_PHASE2_MOD||!(a===void 0||!a)}
function dg(a){a=a===void 0?!1:a;var b=C.__SAPISID||C.__APISID||C.__3PSAPISID||C.__OVERRIDE_SID;cg(a)&&(b=b||C.__1PSAPISID);if(b)return!0;if(typeof document!=="undefined"){var c=new ag(document);b=c.get("SAPISID")||c.get("APISID")||c.get("__Secure-3PAPISID");cg(a)&&(b=b||c.get("__Secure-1PAPISID"))}return!!b}
function eg(a,b,c,d){(a=C[a])||typeof document==="undefined"||(a=(new ag(document)).get(b));return a?Xf(a,c,d):null}
function fg(a,b){b=b===void 0?!1:b;var c=Vf(String(C.location.href)),d=[];if(dg(b)){c=c.indexOf("https:")==0||c.indexOf("chrome-extension:")==0||c.indexOf("chrome-untrusted://new-tab-page")==0||c.indexOf("moz-extension:")==0;var e=c?C.__SAPISID:C.__APISID;e||typeof document==="undefined"||(e=new ag(document),e=e.get(c?"SAPISID":"APISID")||e.get("__Secure-3PAPISID"));(e=e?Xf(e,c?"SAPISIDHASH":"APISIDHASH",a):null)&&d.push(e);c&&cg(b)&&((b=eg("__1PSAPISID","__Secure-1PAPISID","SAPISID1PHASH",a))&&d.push(b),
(a=eg("__3PSAPISID","__Secure-3PAPISID","SAPISID3PHASH",a))&&d.push(a))}return d.length==0?null:d.join(" ")}
;function gg(a){a&&typeof a.dispose=="function"&&a.dispose()}
;function hg(a){for(var b=0,c=arguments.length;b<c;++b){var d=arguments[b];Pa(d)?hg.apply(null,d):gg(d)}}
;function L(){this.ea=this.ea;this.D=this.D}
L.prototype.ea=!1;L.prototype.dispose=function(){this.ea||(this.ea=!0,this.ba())};
L.prototype[Symbol.dispose]=function(){this.dispose()};
function ig(a,b){a.addOnDisposeCallback(Xa(gg,b))}
L.prototype.addOnDisposeCallback=function(a,b){this.ea?b!==void 0?a.call(b):a():(this.D||(this.D=[]),b&&(a=a.bind(b)),this.D.push(a))};
L.prototype.ba=function(){if(this.D)for(;this.D.length;)this.D.shift()()};function jg(a){this.H=J(a)}
x(jg,K);function kg(a,b){this.intervalMs=a;this.callback=b;this.enabled=!1;this.h=function(){return Ya()};
this.i=this.h()}
kg.prototype.setInterval=function(a){this.intervalMs=a;this.timer&&this.enabled?(this.stop(),this.start()):this.timer&&this.stop()};
kg.prototype.start=function(){var a=this;this.enabled=!0;this.timer||(this.timer=setTimeout(function(){a.tick()},this.intervalMs),this.i=this.h())};
kg.prototype.stop=function(){this.enabled=!1;this.timer&&(clearTimeout(this.timer),this.timer=void 0)};
kg.prototype.tick=function(){var a=this;if(this.enabled){var b=Math.max(this.h()-this.i,0);b<this.intervalMs*.8?this.timer=setTimeout(function(){a.tick()},this.intervalMs-b):(this.timer&&(clearTimeout(this.timer),this.timer=void 0),this.callback(),this.enabled&&(this.stop(),this.start()))}else this.timer=void 0};function lg(a){this.H=J(a)}
x(lg,K);function mg(a){this.H=J(a)}
x(mg,K);function ng(a,b){for(var c in a)b.call(void 0,a[c],c,a)}
function og(a){var b=pg,c;for(c in b)if(a.call(void 0,b[c],c,b))return c}
function qg(a){for(var b in a)return!1;return!0}
function rg(a,b){if(a!==null&&b in a)throw Error('The object already contains the key "'+b+'"');a[b]=!0}
function sg(a){return a!==null&&"privembed"in a?a.privembed:!1}
function tg(a,b){for(var c in a)if(!(c in b)||a[c]!==b[c])return!1;for(var d in b)if(!(d in a))return!1;return!0}
function ug(a){var b={},c;for(c in a)b[c]=a[c];return b}
function vg(a){if(!a||typeof a!=="object")return a;if(typeof a.clone==="function")return a.clone();if(typeof Map!=="undefined"&&a instanceof Map)return new Map(a);if(typeof Set!=="undefined"&&a instanceof Set)return new Set(a);if(a instanceof Date)return new Date(a.getTime());var b=Array.isArray(a)?[]:typeof ArrayBuffer!=="function"||typeof ArrayBuffer.isView!=="function"||!ArrayBuffer.isView(a)||a instanceof DataView?{}:new a.constructor(a.length),c;for(c in a)b[c]=vg(a[c]);return b}
var wg="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function xg(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<wg.length;f++)c=wg[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}}
;"ARTICLE SECTION NAV ASIDE H1 H2 H3 H4 H5 H6 HEADER FOOTER ADDRESS P HR PRE BLOCKQUOTE OL UL LH LI DL DT DD FIGURE FIGCAPTION MAIN DIV EM STRONG SMALL S CITE Q DFN ABBR RUBY RB RT RTC RP DATA TIME CODE VAR SAMP KBD SUB SUP I B U MARK BDI BDO SPAN BR WBR NOBR INS DEL PICTURE PARAM TRACK MAP TABLE CAPTION COLGROUP COL TBODY THEAD TFOOT TR TD TH SELECT DATALIST OPTGROUP OPTION OUTPUT PROGRESS METER FIELDSET LEGEND DETAILS SUMMARY MENU DIALOG SLOT CANVAS FONT CENTER ACRONYM BASEFONT BIG DIR HGROUP STRIKE TT".split(" ").concat(["BUTTON",
"INPUT"]);function yg(a,b){this.x=a!==void 0?a:0;this.y=b!==void 0?b:0}
p=yg.prototype;p.clone=function(){return new yg(this.x,this.y)};
p.equals=function(a){return a instanceof yg&&(this==a?!0:this&&a?this.x==a.x&&this.y==a.y:!1)};
p.ceil=function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);return this};
p.floor=function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);return this};
p.round=function(){this.x=Math.round(this.x);this.y=Math.round(this.y);return this};
p.scale=function(a,b){this.x*=a;this.y*=typeof b==="number"?b:a;return this};function zg(a,b){this.width=a;this.height=b}
p=zg.prototype;p.clone=function(){return new zg(this.width,this.height)};
p.aspectRatio=function(){return this.width/this.height};
p.ceil=function(){this.width=Math.ceil(this.width);this.height=Math.ceil(this.height);return this};
p.floor=function(){this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};
p.round=function(){this.width=Math.round(this.width);this.height=Math.round(this.height);return this};
p.scale=function(a,b){this.width*=a;this.height*=typeof b==="number"?b:a;return this};function Ag(a){var b=document;return typeof a==="string"?b.getElementById(a):a}
function Bg(a){var b=document;a=String(a);b.contentType==="application/xhtml+xml"&&(a=a.toLowerCase());return b.createElement(a)}
function Cg(a,b){for(var c=0;a;){if(b(a))return a;a=a.parentNode;c++}return null}
;var Dg=function(){if(!C.addEventListener||!Object.defineProperty)return!1;var a=!1,b=Object.defineProperty({},"passive",{get:function(){a=!0}});
try{var c=function(){};
C.addEventListener("test",c,b);C.removeEventListener("test",c,b)}catch(d){}return a}();function Eg(a){this.h=this.i=this.j=a}
Eg.prototype.reset=function(){this.h=this.i=this.j};
Eg.prototype.getValue=function(){return this.i};function Fg(a){this.H=J(a)}
x(Fg,K);Fg.prototype.cc=function(){return uf(this)};function Gg(a){this.H=J(a)}
x(Gg,K);function Hg(a){this.H=J(a)}
x(Hg,K);function Ig(a,b){pf(a,Gg,1,b)}
;function ef(a){this.H=J(a)}
x(ef,K);var Jg=["platform","platformVersion","architecture","model","uaFullVersion"],Kg=new Hg,Lg=null;function Mg(a,b){b=b===void 0?Jg:b;if(!Lg){var c;a=(c=a.navigator)==null?void 0:c.userAgentData;if(!a||typeof a.getHighEntropyValues!=="function"||a.brands&&typeof a.brands.map!=="function")return Promise.reject(Error("UACH unavailable"));c=(a.brands||[]).map(function(e){var f=new Gg;f=vf(f,1,e.brand);return vf(f,2,e.version)});
Ig(af(Kg,2,ne(a.mobile)),c);Lg=a.getHighEntropyValues(b)}var d=new Set(b);return Lg.then(function(e){var f=Kg.clone();d.has("platform")&&vf(f,3,e.platform);d.has("platformVersion")&&vf(f,4,e.platformVersion);d.has("architecture")&&vf(f,5,e.architecture);d.has("model")&&vf(f,6,e.model);d.has("uaFullVersion")&&vf(f,7,e.uaFullVersion);return f}).catch(function(){return Kg.clone()})}
;function Ng(a){this.H=J(a)}
x(Ng,K);function Og(a){this.H=J(a,4)}
x(Og,K);function Pg(a){this.H=J(a,35)}
x(Pg,K);function Qg(a){this.H=J(a,19)}
x(Qg,K);Qg.prototype.Ob=function(a){return wf(this,2,a)};function Rg(a){this.H=J(a,8)}
x(Rg,K);var Sg=Lf(Rg);function Tg(a){this.H=J(a)}
x(Tg,K);var Ug=new function(){this.ctor=Tg;this.isRepeated=0;this.h=nf;this.defaultValue=void 0};function Vg(a){L.call(this);var b=this;this.componentId="";this.j=[];this.X="";this.pageId=null;this.ga=this.T=-1;this.experimentIds=null;this.I=this.u=0;this.ia=1;this.timeoutMillis=0;this.logSource=a.logSource;this.Hb=a.Hb||function(){};
this.i=new Wg(a.logSource,a.cb);this.network=a.network;this.xb=a.xb||null;this.bufferSize=1E3;this.A=a.hf||null;this.sessionIndex=a.sessionIndex||null;this.Fb=a.Fb||!1;this.logger=null;this.withCredentials=!a.Wc;this.cb=a.cb||!1;this.G=typeof URLSearchParams!=="undefined"&&!!(new URL(Xg())).searchParams&&!!(new URL(Xg())).searchParams.set;var c=wf(new Ng,1,1);Yg(this.i,c);this.o=new Eg(1E4);a=ah(this,a.Qc);this.h=new kg(this.o.getValue(),a);this.W=new kg(6E5,a);this.Fb||this.W.start();this.cb||(document.addEventListener("visibilitychange",
function(){document.visibilityState==="hidden"&&b.vc()}),document.addEventListener("pagehide",this.vc.bind(this)))}
x(Vg,L);function ah(a,b){return a.G?b?function(){b().then(function(){a.flush()})}:function(){a.flush()}:function(){}}
p=Vg.prototype;p.ba=function(){this.vc();this.h.stop();this.W.stop();L.prototype.ba.call(this)};
p.log=function(a){if(this.G){a=a.clone();var b=this.ia++;a=af(a,21,ye(b));this.componentId&&vf(a,26,this.componentId);if(qf(a)==null){var c=Date.now();b=a;c=Number.isFinite(c)?c.toString():"0";af(b,1,ye(c))}Ae(Ye(a,15))==null&&af(a,15,ye((new Date).getTimezoneOffset()*60));this.experimentIds&&(b=a,c=this.experimentIds.clone(),of(b,jg,16,c));b=this.j.length-this.bufferSize+1;b>0&&(this.j.splice(0,b),this.u+=b);this.j.push(a);this.Fb||this.h.enabled||this.h.start()}};
p.flush=function(a,b){var c=this;if(this.j.length===0)a&&a();else{var d=Date.now();if(this.ga>d&&this.T<d)b&&b("throttled");else{this.network&&(typeof this.network.cc==="function"?bh(this.i,this.network.cc()):bh(this.i,0));var e=ch(this.i,this.j,this.u,this.I,this.xb);d={};var f=this.Hb();f&&(d.Authorization=f);this.A||(this.A=Xg());try{var g=(new URL(this.A)).toString()}catch(k){g=(new URL(this.A,window.location.origin)).toString()}g=new URL(g);this.sessionIndex&&(d["X-Goog-AuthUser"]=this.sessionIndex,
g.searchParams.set("authuser",this.sessionIndex));this.pageId&&(Object.defineProperty(d,"X-Goog-PageId",{value:this.pageId}),g.searchParams.set("pageId",this.pageId));if(f&&this.X===f)b&&b("stale-auth-token");else{this.j=[];this.h.enabled&&this.h.stop();this.u=0;var h=e.serialize();d={url:g.toString(),body:h,Ng:1,qd:d,requestType:"POST",withCredentials:this.withCredentials,timeoutMillis:this.timeoutMillis};g=function(k){c.o.reset();c.h.setInterval(c.o.getValue());if(k){var l=null;try{var m=JSON.stringify(JSON.parse(k.replace(")]}'\n",
"")));l=Sg(m)}catch(n){}l&&(k=Number,m="-1",m=m===void 0?"0":m,m=rf(qf(l),m),k=k(m),k>0&&(c.T=Date.now(),c.ga=c.T+k),l=Ug.ctor?Ug.h(l,Ug.ctor,175237375,!0):Ug.h(l,175237375,null,!0),l=l===null?void 0:l)&&(l=pc(l,1,-1),l!==-1&&(c.o=new Eg(l<1?1:l),c.h.setInterval(c.o.getValue())))}a&&a();c.I=0};
h=function(k,l){var m=nc(e,Pg,3);var n=Ae(Ye(e,14)),r=c.o;r.h=Math.min(3E5,r.h*2);r.i=Math.min(3E5,r.h+Math.round((Math.random()-.5)*.2*r.h));c.h.setInterval(c.o.getValue());k===401&&f&&(c.X=f);n&&(c.u+=n);l===void 0&&(l=c.isRetryable(k));l&&(c.j=m.concat(c.j),c.Fb||c.h.enabled||c.h.start());b&&b("net-send-failed",k);++c.I};
c.network&&c.network.send(d,g,h)}}}};
p.vc=function(){dh(this.i,!0);this.flush();dh(this.i,!1)};
p.isRetryable=function(a){return 500<=a&&a<600||a===401||a===0};
function Xg(){return"https://play.google.com/log?format=json&hasfast=true"}
function Wg(a,b){this.cb=b=b===void 0?!1:b;this.i=this.locale=null;this.h=new Qg;Number.isInteger(a)&&this.h.Ob(a);b||(this.locale=document.documentElement.getAttribute("lang"));Yg(this,new Ng)}
Wg.prototype.Ob=function(a){this.h.Ob(a);return this};
function Yg(a,b){of(a.h,Ng,1,b);uf(b)||wf(b,1,1);a.cb||(b=eh(a),tf(b,5)||vf(b,5,a.locale));a.i&&(b=eh(a),nf(b,Hg,9)||of(b,Hg,9,a.i))}
function bh(a,b){cf(fh(a))&&(a=gh(a),wf(a,1,b))}
function dh(a,b){cf(fh(a))&&(a=gh(a),af(a,2,ne(b)))}
function fh(a){return nf(a.h,Ng,1)}
function hh(a){var b=b===void 0?Jg:b;var c=a.cb?void 0:window;c?Mg(c,b).then(function(d){a.i=d;d=eh(a);of(d,Hg,9,a.i);return!0}).catch(function(){return!1}):Promise.resolve(!1)}
function eh(a){a=fh(a);var b=nf(a,ef,11);b||(b=new ef,of(a,ef,11,b));return b}
function gh(a){a=eh(a);var b=nf(a,Fg,10);b||(b=new Fg,af(b,2,ne(!1)),of(a,Fg,10,b));return b}
function ch(a,b,c,d,e){var f=0,g=0;c=c===void 0?0:c;f=f===void 0?0:f;g=g===void 0?0:g;d=d===void 0?0:d;if(cf(fh(a))){var h=gh(a);af(h,3,re(d))}cf(fh(a))&&(d=gh(a),af(d,4,re(f)));cf(fh(a))&&(f=gh(a),af(f,5,re(g)));a=a.h.clone();g=Date.now().toString();a=af(a,4,ye(g));b=b.slice();b=pf(a,Pg,3,b);e&&(a=new lg,e=af(a,13,re(e)),a=new mg,e=of(a,lg,2,e),a=new Og,e=of(a,mg,1,e),e=wf(e,2,9),of(b,Og,18,e));c&&af(b,14,ye(c));return b}
;function ih(){this.Hd=typeof AbortController!=="undefined"}
ih.prototype.send=function(a,b,c){var d=this,e,f,g,h,k,l,m,n,r,t;return A(function(w){switch(w.h){case 1:return f=(e=d.Hd?new AbortController:void 0)?setTimeout(function(){e.abort()},a.timeoutMillis):void 0,ya(w,2,3),g=Object.assign({},{method:a.requestType,
headers:Object.assign({},a.qd)},a.body&&{body:a.body},a.withCredentials&&{credentials:"include"},{signal:a.timeoutMillis&&e?e.signal:null}),w.yield(fetch(a.url,g),5);case 5:h=w.i;if(h.status!==200){(k=c)==null||k(h.status);w.F(3);break}if((l=b)==null){w.F(7);break}return w.yield(h.text(),8);case 8:l(w.i);case 7:case 3:w.I=[w.j];w.o=0;w.D=0;clearTimeout(f);Aa(w);break;case 2:m=za(w);switch((n=m)==null?void 0:n.name){case "AbortError":(r=c)==null||r(408);break;default:(t=c)==null||t(400)}w.F(3)}})};
ih.prototype.cc=function(){return 4};function jh(a,b){L.call(this);this.logSource=a;this.sessionIndex=b;this.j="https://play.google.com/log?format=json&hasfast=true";this.h=null;this.o=!1;this.network=null;this.componentId="";this.pageId=this.i=this.xb=null}
x(jh,L);jh.prototype.Wc=function(){this.u=!0;return this};
function kh(a){a.network||(a.network=new ih);var b=new Vg({logSource:a.logSource,Hb:a.Hb?a.Hb:fg,sessionIndex:a.sessionIndex,hf:a.j,cb:a.o,Fb:!1,Wc:a.u,Qc:a.Qc,network:a.network});ig(a,b);if(a.h){var c=a.h,d=eh(b.i);vf(d,7,c)}a.componentId&&(b.componentId=a.componentId);a.xb&&(b.xb=a.xb);a.pageId&&(b.pageId=a.pageId);a.i&&((d=a.i)?(b.experimentIds||(b.experimentIds=new jg),c=b.experimentIds,d=d.serialize(),vf(c,4,d)):b.experimentIds&&af(b.experimentIds,4));hh(b.i);a.network.Ob&&a.network.Ob(a.logSource);
a.network.Ue&&a.network.Ue(b);return b}
;function lh(a,b,c,d,e,f,g){a=a===void 0?-1:a;b=b===void 0?"":b;c=c===void 0?"":c;d=d===void 0?!1:d;e=e===void 0?"":e;L.call(this);this.logSource=a;this.componentId=b;f?b=f:(a=new jh(a,"0"),a.componentId=b,ig(this,a),c!==""&&(a.j=c),d&&(a.o=!0),e&&(a.h=e),g&&(a.network=g),b=kh(a));this.h=b}
x(lh,L);
lh.prototype.flush=function(a){var b=a||[];if(b.length){a=new Uf;for(var c=[],d=0;d<b.length;d++){var e=b[d],f=new Tf;f=vf(f,1,e.i);var g=mh(e);f=gf(f,g,Be);g=[];var h=[];for(var k=v(e.h.keys()),l=k.next();!l.done;l=k.next())h.push(l.value.split(","));for(k=0;k<h.length;k++){l=h[k];var m=e.o;for(var n=e.wc(l)||[],r=[],t=0;t<n.length;t++){var w=n[t],y=w&&w.h;w=new Qf;switch(m){case 3:y=Number(y);Number.isFinite(y)&&kf(w,1,Rf,ye(y));break;case 2:y=Number(y);if(y!=null&&typeof y!=="number")throw Error("Value of float/double field must be a number, found "+typeof y+
": "+y);kf(w,2,Rf,y)}r.push(w)}m=r;for(n=0;n<m.length;n++){r=m[n];t=new Sf;r=of(t,Qf,2,r);t=l;w=[];y=nh(e);for(var z=0;z<y.length;z++){var G=y[z],I=t[z],N=new Of;switch(G){case 3:kf(N,1,Pf,Ce(String(I)));break;case 2:G=Number(I);Number.isFinite(G)&&kf(N,2,Pf,re(G));break;case 1:kf(N,3,Pf,ne(I==="true"))}w.push(N)}pf(r,Of,1,w);g.push(r)}}pf(f,Sf,4,g);c.push(f);e.clear()}pf(a,Tf,1,c);b=this.h;b.G&&(a instanceof Pg?b.log(a):(c=new Pg,a=a.serialize(),a=vf(c,8,a),b.log(a)));this.h.flush()}};function oh(a){this.h=a}
;function ph(a,b,c){this.i=a;this.o=b;this.fields=c||[];this.h=new Map}
function nh(a){return a.fields.map(function(b){return b.fieldType})}
function mh(a){return a.fields.map(function(b){return b.fieldName})}
p=ph.prototype;p.Id=function(a){var b=B.apply(1,arguments),c=this.wc(b);c?c.push(new oh(a)):this.td(a,b)};
p.td=function(a){var b=this.Pc(B.apply(1,arguments));this.h.set(b,[new oh(a)])};
p.wc=function(){var a=this.Pc(B.apply(0,arguments));return this.h.has(a)?this.h.get(a):void 0};
p.Zd=function(){var a=this.wc(B.apply(0,arguments));return a&&a.length?a[0]:void 0};
p.clear=function(){this.h.clear()};
p.Pc=function(){var a=B.apply(0,arguments);return a?a.join(","):"key"};function qh(a,b){ph.call(this,a,3,b)}
x(qh,ph);qh.prototype.j=function(a){var b=B.apply(1,arguments),c=0,d=this.Zd(b);d&&(c=d.h);this.td(c+a,b)};function rh(a,b){ph.call(this,a,2,b)}
x(rh,ph);rh.prototype.record=function(a){this.Id(a,B.apply(1,arguments))};function sh(a,b){this.type=a;this.h=this.target=b;this.defaultPrevented=this.j=!1}
sh.prototype.stopPropagation=function(){this.j=!0};
sh.prototype.preventDefault=function(){this.defaultPrevented=!0};function th(a,b){sh.call(this,a?a.type:"");this.relatedTarget=this.h=this.target=null;this.button=this.screenY=this.screenX=this.clientY=this.clientX=0;this.key="";this.charCode=this.keyCode=0;this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.state=null;this.pointerId=0;this.pointerType="";this.i=null;a&&this.init(a,b)}
Za(th,sh);
th.prototype.init=function(a,b){var c=this.type=a.type,d=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement;this.h=b;b=a.relatedTarget;b||(c=="mouseover"?b=a.fromElement:c=="mouseout"&&(b=a.toElement));this.relatedTarget=b;d?(this.clientX=d.clientX!==void 0?d.clientX:d.pageX,this.clientY=d.clientY!==void 0?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==
void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0);this.button=a.button;this.keyCode=a.keyCode||0;this.key=a.key||"";this.charCode=a.charCode||(c=="keypress"?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.pointerId=a.pointerId||0;this.pointerType=a.pointerType;this.state=a.state;this.i=a;a.defaultPrevented&&th.Ca.preventDefault.call(this)};
th.prototype.stopPropagation=function(){th.Ca.stopPropagation.call(this);this.i.stopPropagation?this.i.stopPropagation():this.i.cancelBubble=!0};
th.prototype.preventDefault=function(){th.Ca.preventDefault.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var uh="closure_listenable_"+(Math.random()*1E6|0);var vh=0;function wh(a,b,c,d,e){this.listener=a;this.proxy=null;this.src=b;this.type=c;this.capture=!!d;this.dc=e;this.key=++vh;this.Nb=this.Wb=!1}
function xh(a){a.Nb=!0;a.listener=null;a.proxy=null;a.src=null;a.dc=null}
;function yh(a){this.src=a;this.listeners={};this.h=0}
yh.prototype.add=function(a,b,c,d,e){var f=a.toString();a=this.listeners[f];a||(a=this.listeners[f]=[],this.h++);var g=zh(a,b,d,e);g>-1?(b=a[g],c||(b.Wb=!1)):(b=new wh(b,this.src,f,!!d,e),b.Wb=c,a.push(b));return b};
yh.prototype.remove=function(a,b,c,d){a=a.toString();if(!(a in this.listeners))return!1;var e=this.listeners[a];b=zh(e,b,c,d);return b>-1?(xh(e[b]),Array.prototype.splice.call(e,b,1),e.length==0&&(delete this.listeners[a],this.h--),!0):!1};
function Ah(a,b){var c=b.type;c in a.listeners&&Rb(a.listeners[c],b)&&(xh(b),a.listeners[c].length==0&&(delete a.listeners[c],a.h--))}
function zh(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.Nb&&f.listener==b&&f.capture==!!c&&f.dc==d)return e}return-1}
;var Bh="closure_lm_"+(Math.random()*1E6|0),Ch={},Dh=0;function Eh(a,b,c,d,e){if(d&&d.once)Fh(a,b,c,d,e);else if(Array.isArray(b))for(var f=0;f<b.length;f++)Eh(a,b[f],c,d,e);else c=Gh(c),a&&a[uh]?a.listen(b,c,Qa(d)?!!d.capture:!!d,e):Hh(a,b,c,!1,d,e)}
function Hh(a,b,c,d,e,f){if(!b)throw Error("Invalid event type");var g=Qa(e)?!!e.capture:!!e,h=Ih(a);h||(a[Bh]=h=new yh(a));c=h.add(b,c,d,g,f);if(!c.proxy){d=Jh();c.proxy=d;d.src=a;d.listener=c;if(a.addEventListener)Dg||(e=g),e===void 0&&(e=!1),a.addEventListener(b.toString(),d,e);else if(a.attachEvent)a.attachEvent(Kh(b.toString()),d);else if(a.addListener&&a.removeListener)a.addListener(d);else throw Error("addEventListener and attachEvent are unavailable.");Dh++}}
function Jh(){function a(c){return b.call(a.src,a.listener,c)}
var b=Lh;return a}
function Fh(a,b,c,d,e){if(Array.isArray(b))for(var f=0;f<b.length;f++)Fh(a,b[f],c,d,e);else c=Gh(c),a&&a[uh]?a.h.add(String(b),c,!0,Qa(d)?!!d.capture:!!d,e):Hh(a,b,c,!0,d,e)}
function Mh(a,b,c,d,e){if(Array.isArray(b))for(var f=0;f<b.length;f++)Mh(a,b[f],c,d,e);else(d=Qa(d)?!!d.capture:!!d,c=Gh(c),a&&a[uh])?a.h.remove(String(b),c,d,e):a&&(a=Ih(a))&&(b=a.listeners[b.toString()],a=-1,b&&(a=zh(b,c,d,e)),(c=a>-1?b[a]:null)&&Nh(c))}
function Nh(a){if(typeof a!=="number"&&a&&!a.Nb){var b=a.src;if(b&&b[uh])Ah(b.h,a);else{var c=a.type,d=a.proxy;b.removeEventListener?b.removeEventListener(c,d,a.capture):b.detachEvent?b.detachEvent(Kh(c),d):b.addListener&&b.removeListener&&b.removeListener(d);Dh--;(c=Ih(b))?(Ah(c,a),c.h==0&&(c.src=null,b[Bh]=null)):xh(a)}}}
function Kh(a){return a in Ch?Ch[a]:Ch[a]="on"+a}
function Lh(a,b){if(a.Nb)a=!0;else{b=new th(b,this);var c=a.listener,d=a.dc||a.src;a.Wb&&Nh(a);a=c.call(d,b)}return a}
function Ih(a){a=a[Bh];return a instanceof yh?a:null}
var Oh="__closure_events_fn_"+(Math.random()*1E9>>>0);function Gh(a){if(typeof a==="function")return a;a[Oh]||(a[Oh]=function(b){return a.handleEvent(b)});
return a[Oh]}
;function Ph(){L.call(this);this.h=new yh(this);this.Ka=this;this.ga=null}
Za(Ph,L);Ph.prototype[uh]=!0;p=Ph.prototype;p.addEventListener=function(a,b,c,d){Eh(this,a,b,c,d)};
p.removeEventListener=function(a,b,c,d){Mh(this,a,b,c,d)};
function Qh(a,b){var c=a.ga;if(c){var d=[];for(var e=1;c;c=c.ga)d.push(c),++e}a=a.Ka;c=b.type||b;typeof b==="string"?b=new sh(b,a):b instanceof sh?b.target=b.target||a:(e=b,b=new sh(c,a),xg(b,e));e=!0;if(d)for(var f=d.length-1;!b.j&&f>=0;f--){var g=b.h=d[f];e=Rh(g,c,!0,b)&&e}b.j||(g=b.h=a,e=Rh(g,c,!0,b)&&e,b.j||(e=Rh(g,c,!1,b)&&e));if(d)for(f=0;!b.j&&f<d.length;f++)g=b.h=d[f],e=Rh(g,c,!1,b)&&e}
p.ba=function(){Ph.Ca.ba.call(this);this.removeAllListeners();this.ga=null};
p.listen=function(a,b,c,d){return this.h.add(String(a),b,!1,c,d)};
p.removeAllListeners=function(a){if(this.h){var b=this.h;a=a&&a.toString();var c=0,d;for(d in b.listeners)if(!a||d==a){for(var e=b.listeners[d],f=0;f<e.length;f++)++c,xh(e[f]);delete b.listeners[d];b.h--}b=c}else b=0;return b};
function Rh(a,b,c,d){b=a.h.listeners[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var g=b[f];if(g&&!g.Nb&&g.capture==c){var h=g.listener,k=g.dc||g.src;g.Wb&&Ah(a.h,g);e=h.call(k,d)!==!1&&e}}return e&&!d.defaultPrevented}
;function Sh(a,b){this.j=a;this.o=b;this.i=0;this.h=null}
Sh.prototype.get=function(){if(this.i>0){this.i--;var a=this.h;this.h=a.next;a.next=null}else a=this.j();return a};
function Th(a,b){a.o(b);a.i<100&&(a.i++,b.next=a.h,a.h=b)}
;function Uh(){}
function Vh(a){var b=!1,c;return function(){b||(c=a(),b=!0);return c}}
;var Wh;function Xh(){var a=C.MessageChannel;typeof a==="undefined"&&typeof window!=="undefined"&&window.postMessage&&window.addEventListener&&!H("Presto")&&(a=function(){var e=Bg("IFRAME");e.style.display="none";document.documentElement.appendChild(e);var f=e.contentWindow;e=f.document;e.open();e.close();var g="callImmediate"+Math.random(),h=f.location.protocol=="file:"?"*":f.location.protocol+"//"+f.location.host;e=Wa(function(k){if((h=="*"||k.origin==h)&&k.data==g)this.port1.onmessage()},this);
f.addEventListener("message",e,!1);this.port1={};this.port2={postMessage:function(){f.postMessage(g,h)}}});
if(typeof a!=="undefined"){var b=new a,c={},d=c;b.port1.onmessage=function(){if(c.next!==void 0){c=c.next;var e=c.Tc;c.Tc=null;e()}};
return function(e){d.next={Tc:e};d=d.next;b.port2.postMessage(0)}}return function(e){C.setTimeout(e,0)}}
;function Yh(){this.i=this.h=null}
Yh.prototype.add=function(a,b){var c=Zh.get();c.set(a,b);this.i?this.i.next=c:this.h=c;this.i=c};
Yh.prototype.remove=function(){var a=null;this.h&&(a=this.h,this.h=this.h.next,this.h||(this.i=null),a.next=null);return a};
var Zh=new Sh(function(){return new $h},function(a){return a.reset()});
function $h(){this.next=this.scope=this.h=null}
$h.prototype.set=function(a,b){this.h=a;this.scope=b;this.next=null};
$h.prototype.reset=function(){this.next=this.scope=this.h=null};var ai,bi=!1,ci=new Yh;function di(a,b){ai||ei();bi||(ai(),bi=!0);ci.add(a,b)}
function ei(){if(C.Promise&&C.Promise.resolve){var a=C.Promise.resolve(void 0);ai=function(){a.then(fi)}}else ai=function(){var b=fi;
typeof C.setImmediate!=="function"||C.Window&&C.Window.prototype&&C.Window.prototype.setImmediate==C.setImmediate?(Wh||(Wh=Xh()),Wh(b)):C.setImmediate(b)}}
function fi(){for(var a;a=ci.remove();){try{a.h.call(a.scope)}catch(b){Fc(b)}Th(Zh,a)}bi=!1}
;function gi(a){this.h=0;this.A=void 0;this.o=this.i=this.j=null;this.D=this.u=!1;if(a!=Uh)try{var b=this;a.call(void 0,function(c){hi(b,2,c)},function(c){hi(b,3,c)})}catch(c){hi(this,3,c)}}
function ii(){this.next=this.context=this.h=this.i=this.child=null;this.j=!1}
ii.prototype.reset=function(){this.context=this.h=this.i=this.child=null;this.j=!1};
var ji=new Sh(function(){return new ii},function(a){a.reset()});
function ki(a,b,c){var d=ji.get();d.i=a;d.h=b;d.context=c;return d}
function li(a){return new gi(function(b,c){c(a)})}
gi.prototype.then=function(a,b,c){return mi(this,typeof a==="function"?a:null,typeof b==="function"?b:null,c)};
gi.prototype.$goog_Thenable=!0;p=gi.prototype;p.oc=function(a,b){return mi(this,null,a,b)};
p.catch=gi.prototype.oc;p.cancel=function(a){if(this.h==0){var b=new ni(a);di(function(){oi(this,b)},this)}};
function oi(a,b){if(a.h==0)if(a.j){var c=a.j;if(c.i){for(var d=0,e=null,f=null,g=c.i;g&&(g.j||(d++,g.child==a&&(e=g),!(e&&d>1)));g=g.next)e||(f=g);e&&(c.h==0&&d==1?oi(c,b):(f?(d=f,d.next==c.o&&(c.o=d),d.next=d.next.next):pi(c),qi(c,e,3,b)))}a.j=null}else hi(a,3,b)}
function ri(a,b){a.i||a.h!=2&&a.h!=3||si(a);a.o?a.o.next=b:a.i=b;a.o=b}
function mi(a,b,c,d){var e=ki(null,null,null);e.child=new gi(function(f,g){e.i=b?function(h){try{var k=b.call(d,h);f(k)}catch(l){g(l)}}:f;
e.h=c?function(h){try{var k=c.call(d,h);k===void 0&&h instanceof ni?g(h):f(k)}catch(l){g(l)}}:g});
e.child.j=a;ri(a,e);return e.child}
p.ff=function(a){this.h=0;hi(this,2,a)};
p.gf=function(a){this.h=0;hi(this,3,a)};
function hi(a,b,c){if(a.h==0){a===c&&(b=3,c=new TypeError("Promise cannot resolve to itself"));a.h=1;a:{var d=c,e=a.ff,f=a.gf;if(d instanceof gi){ri(d,ki(e||Uh,f||null,a));var g=!0}else{if(d)try{var h=!!d.$goog_Thenable}catch(l){h=!1}else h=!1;if(h)d.then(e,f,a),g=!0;else{if(Qa(d))try{var k=d.then;if(typeof k==="function"){ti(d,k,e,f,a);g=!0;break a}}catch(l){f.call(a,l);g=!0;break a}g=!1}}}g||(a.A=c,a.h=b,a.j=null,si(a),b!=3||c instanceof ni||ui(a,c))}}
function ti(a,b,c,d,e){function f(k){h||(h=!0,d.call(e,k))}
function g(k){h||(h=!0,c.call(e,k))}
var h=!1;try{b.call(a,g,f)}catch(k){f(k)}}
function si(a){a.u||(a.u=!0,di(a.Ud,a))}
function pi(a){var b=null;a.i&&(b=a.i,a.i=b.next,b.next=null);a.i||(a.o=null);return b}
p.Ud=function(){for(var a;a=pi(this);)qi(this,a,this.h,this.A);this.u=!1};
function qi(a,b,c,d){if(c==3&&b.h&&!b.j)for(;a&&a.D;a=a.j)a.D=!1;if(b.child)b.child.j=null,vi(b,c,d);else try{b.j?b.i.call(b.context):vi(b,c,d)}catch(e){wi.call(null,e)}Th(ji,b)}
function vi(a,b,c){b==2?a.i.call(a.context,c):a.h&&a.h.call(a.context,c)}
function ui(a,b){a.D=!0;di(function(){a.D&&wi.call(null,b)})}
var wi=Fc;function ni(a){ab.call(this,a)}
Za(ni,ab);ni.prototype.name="cancel";function xi(a,b){Ph.call(this);this.j=a||1;this.i=b||C;this.o=Wa(this.cf,this);this.u=Ya()}
Za(xi,Ph);p=xi.prototype;p.enabled=!1;p.Fa=null;p.setInterval=function(a){this.j=a;this.Fa&&this.enabled?(this.stop(),this.start()):this.Fa&&this.stop()};
p.cf=function(){if(this.enabled){var a=Ya()-this.u;a>0&&a<this.j*.8?this.Fa=this.i.setTimeout(this.o,this.j-a):(this.Fa&&(this.i.clearTimeout(this.Fa),this.Fa=null),Qh(this,"tick"),this.enabled&&(this.stop(),this.start()))}};
p.start=function(){this.enabled=!0;this.Fa||(this.Fa=this.i.setTimeout(this.o,this.j),this.u=Ya())};
p.stop=function(){this.enabled=!1;this.Fa&&(this.i.clearTimeout(this.Fa),this.Fa=null)};
p.ba=function(){xi.Ca.ba.call(this);this.stop();delete this.i};
function yi(a,b,c){if(typeof a==="function")c&&(a=Wa(a,c));else if(a&&typeof a.handleEvent=="function")a=Wa(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(b)>2147483647?-1:C.setTimeout(a,b||0)}
;function zi(a){L.call(this);this.G=a;this.j=0;this.o=100;this.u=!1;this.i=new Map;this.A=new Set;this.flushInterval=3E4;this.h=new xi(this.flushInterval);this.h.listen("tick",this.Ab,!1,this);ig(this,this.h)}
x(zi,L);p=zi.prototype;p.sendIsolatedPayload=function(a){this.u=a;this.o=1};
function Ai(a){a.h.enabled||a.h.start();a.j++;a.j>=a.o&&a.Ab()}
p.Ab=function(){var a=this.i.values();a=[].concat(ja(a)).filter(function(b){return b.h.size});
a.length&&this.G.flush(a,this.u);Bi(a);this.j=0;this.h.enabled&&this.h.stop()};
p.Ra=function(a){var b=B.apply(1,arguments);this.i.has(a)||this.i.set(a,new qh(a,b))};
p.Cb=function(a){var b=B.apply(1,arguments);this.i.has(a)||this.i.set(a,new rh(a,b))};
function Ci(a,b){return a.A.has(b)?void 0:a.i.get(b)}
p.zb=function(a){this.Gd(a,1,B.apply(1,arguments))};
p.Gd=function(a,b){var c=B.apply(2,arguments),d=Ci(this,a);d&&d instanceof qh&&(d.j(b,c),Ai(this))};
p.record=function(a,b){var c=B.apply(2,arguments),d=Ci(this,a);d&&d instanceof rh&&(d.record(b,c),Ai(this))};
function Bi(a){for(var b=0;b<a.length;b++)a[b].clear()}
;function Di(){}
Di.prototype.serialize=function(a){var b=[];Ei(this,a,b);return b.join("")};
function Ei(a,b,c){if(b==null)c.push("null");else{if(typeof b=="object"){if(Array.isArray(b)){var d=b;b=d.length;c.push("[");for(var e="",f=0;f<b;f++)c.push(e),Ei(a,d[f],c),e=",";c.push("]");return}if(b instanceof String||b instanceof Number||b instanceof Boolean)b=b.valueOf();else{c.push("{");e="";for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(f=b[d],typeof f!="function"&&(c.push(e),Fi(d,c),c.push(":"),Ei(a,f,c),e=","));c.push("}");return}}switch(typeof b){case "string":Fi(b,c);break;case "number":c.push(isFinite(b)&&
!isNaN(b)?String(b):"null");break;case "boolean":c.push(String(b));break;case "function":c.push("null");break;default:throw Error("Unknown type: "+typeof b);}}}
var Gi={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\v":"\\u000b"},Hi=/\uffff/.test("\uffff")?/[\\"\x00-\x1f\x7f-\uffff]/g:/[\\"\x00-\x1f\x7f-\xff]/g;function Fi(a,b){b.push('"',a.replace(Hi,function(c){var d=Gi[c];d||(d="\\u"+(c.charCodeAt(0)|65536).toString(16).slice(1),Gi[c]=d);return d}),'"')}
;function Ii(){}
Ii.prototype.h=null;Ii.prototype.getOptions=function(){var a;(a=this.h)||(a=this.h={});return a};var Ji;function Ki(){}
Za(Ki,Ii);Ji=new Ki;function Li(a){Ph.call(this);this.headers=new Map;this.ya=a||null;this.i=!1;this.I=this.U=null;this.o=this.X="";this.j=this.W=this.u=this.T=!1;this.G=0;this.A=null;this.pa="";this.ia=!1}
Za(Li,Ph);var Mi=/^https?$/i,Ni=["POST","PUT"],Oi=[];function Pi(a,b,c,d,e,f,g){var h=new Li;Oi.push(h);b&&h.listen("complete",b);h.h.add("ready",h.Nd,!0,void 0,void 0);f&&(h.G=Math.max(0,f));g&&(h.ia=g);h.send(a,c,d,e)}
p=Li.prototype;p.Nd=function(){this.dispose();Rb(Oi,this)};
p.send=function(a,b,c,d){if(this.U)throw Error("[goog.net.XhrIo] Object is active with another request="+this.X+"; newUri="+a);b=b?b.toUpperCase():"GET";this.X=a;this.o="";this.T=!1;this.i=!0;this.U=new XMLHttpRequest;this.I=this.ya?this.ya.getOptions():Ji.getOptions();this.U.onreadystatechange=Wa(this.ld,this);try{this.getStatus(),this.W=!0,this.U.open(b,String(a),!0),this.W=!1}catch(g){this.getStatus();Qi(this,g);return}a=c||"";c=new Map(this.headers);if(d)if(Object.getPrototypeOf(d)===Object.prototype)for(var e in d)c.set(e,
d[e]);else if(typeof d.keys==="function"&&typeof d.get==="function"){e=v(d.keys());for(var f=e.next();!f.done;f=e.next())f=f.value,c.set(f,d.get(f))}else throw Error("Unknown input type for opt_headers: "+String(d));d=Array.from(c.keys()).find(function(g){return"content-type"==g.toLowerCase()});
e=C.FormData&&a instanceof C.FormData;!(Lb(Ni,b)>=0)||d||e||c.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");b=v(c);for(d=b.next();!d.done;d=b.next())c=v(d.value),d=c.next().value,c=c.next().value,this.U.setRequestHeader(d,c);this.pa&&(this.U.responseType=this.pa);"withCredentials"in this.U&&this.U.withCredentials!==this.ia&&(this.U.withCredentials=this.ia);try{Ri(this),this.G>0&&(this.getStatus(),this.A=yi(this.ef,this.G,this)),this.getStatus(),this.u=!0,this.U.send(a),this.u=
!1}catch(g){this.getStatus(),Qi(this,g)}};
p.ef=function(){typeof Ja!="undefined"&&this.U&&(this.o="Timed out after "+this.G+"ms, aborting",this.getStatus(),Qh(this,"timeout"),this.abort(8))};
function Qi(a,b){a.i=!1;a.U&&(a.j=!0,a.U.abort(),a.j=!1);a.o=b;Si(a);Ti(a)}
function Si(a){a.T||(a.T=!0,Qh(a,"complete"),Qh(a,"error"))}
p.abort=function(){this.U&&this.i&&(this.getStatus(),this.i=!1,this.j=!0,this.U.abort(),this.j=!1,Qh(this,"complete"),Qh(this,"abort"),Ti(this))};
p.ba=function(){this.U&&(this.i&&(this.i=!1,this.j=!0,this.U.abort(),this.j=!1),Ti(this,!0));Li.Ca.ba.call(this)};
p.ld=function(){this.ea||(this.W||this.u||this.j?Ui(this):this.xe())};
p.xe=function(){Ui(this)};
function Ui(a){if(a.i&&typeof Ja!="undefined")if(a.I[1]&&Vi(a)==4&&a.getStatus()==2)a.getStatus();else if(a.u&&Vi(a)==4)yi(a.ld,0,a);else if(Qh(a,"readystatechange"),a.isComplete()){a.getStatus();a.i=!1;try{if(Wi(a))Qh(a,"complete"),Qh(a,"success");else{try{var b=Vi(a)>2?a.U.statusText:""}catch(c){b=""}a.o=b+" ["+a.getStatus()+"]";Si(a)}}finally{Ti(a)}}}
function Ti(a,b){if(a.U){Ri(a);var c=a.U,d=a.I[0]?function(){}:null;
a.U=null;a.I=null;b||Qh(a,"ready");try{c.onreadystatechange=d}catch(e){}}}
function Ri(a){a.A&&(C.clearTimeout(a.A),a.A=null)}
p.isActive=function(){return!!this.U};
p.isComplete=function(){return Vi(this)==4};
function Wi(a){var b=a.getStatus();a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break a;default:c=!1}if(!c){if(b=b===0)a=ac(1,String(a.X)),!a&&C.self&&C.self.location&&(a=C.self.location.protocol.slice(0,-1)),b=!Mi.test(a?a.toLowerCase():"");c=b}return c}
function Vi(a){return a.U?a.U.readyState:0}
p.getStatus=function(){try{return Vi(this)>2?this.U.status:-1}catch(a){return-1}};
p.getLastError=function(){return typeof this.o==="string"?this.o:String(this.o)};function Xi(){}
Xi.prototype.send=function(a,b,c){b=b===void 0?function(){}:b;
c=c===void 0?function(){}:c;
Pi(a.url,function(d){d=d.target;if(Wi(d)){try{var e=d.U?d.U.responseText:""}catch(f){e=""}b(e)}else c(d.getStatus())},a.requestType,a.body,a.qd,a.timeoutMillis,a.withCredentials)};
Xi.prototype.cc=function(){return 1};var Yi={Aa:"_",pc:"",Ta:[],pe:0};function Zi(a,b,c){this.logger=a;this.event=b;if(c===void 0||c)this.h=$i()}
Zi.prototype.start=function(){this.h=$i()};
Zi.prototype.done=function(){this.h!=null&&this.logger.Kb(this.event,$i()-this.h)};
function aj(){L.apply(this,arguments)}
x(aj,L);function bj(a,b){var c=$i();b=b();a.Kb("n",$i()-c);return b}
function cj(){aj.apply(this,arguments)}
x(cj,aj);p=cj.prototype;p.hd=function(){};
p.Ac=function(){};
p.Kb=function(){};
p.Ha=function(){};
p.Ga=function(){};
p.yd=function(){};
function dj(a,b,c){c=c===void 0?[]:c;aj.call(this);this.T=b;this.i=c;this.u=new Map;this.j=new Map;this.Ta=[];this.A=void 0;this.I=!1;b=Object.assign({},Yi,a);this.Aa=b.Aa;this.pc=b.pc;this.G=b.pe;this.Ta=b.Ta;var d=new Mf,e;if((e=this.T)==null?0:sf(e)){var f;this.Ta=(f=b.Ta)==null?void 0:f.sort(function(g,h){return g-h});
this.i=c.sort(function(g,h){return g-h});
Nf(d,this.Ta.concat(this.i))}else Nf(d,a.Ta);ej(this,d);this.u.set("h",1);this.u.set("u",2);this.u.set("k",3);this.j.set(25,1);this.j.set(26,2);this.j.set(27,3);this.j.set(28,4)}
x(dj,aj);p=dj.prototype;p.yd=function(a){var b;(b=this.T)!=null&&sf(b)&&(a=a.sort(function(c,d){return c-d}),this.i!==a&&(this.i=a,a=Nf(new Mf,this.Ta.concat(this.i)),ej(this,a)))};
function ej(a,b){var c=new jh(1828,"0");c.h="29";c.network=new Xi;c.i=b;a.h&&(a.Ga(),a.h.dispose());a.o&&a.o.dispose();a.o=new lh(1828,"","",!1,"",kh(c));a.h=new zi(a.o);a.h.o=1E5;b=a.h;b.flushInterval=3E4;b.h.setInterval(3E4);a.ya=new uc(a.h);a.Ka=new xc(a.h);a.Ya=new yc(a.h);a.pa=new tc(a.h);a.W=new vc(a.h);a.X=new wc(a.h);a.errorCount=new Bc(a.h);a.ga=new Ac(a.h);new zc(a.h);new Cc(a.h);new Dc(a.h);new Ec(a.h);a.ia=new sc(a.h);ig(a,a.o);ig(a,a.h)}
p.hd=function(){var a;(a=this.ia)!=null&&a.h.zb("/client_streamz/bg/fic",this.Aa)};
p.Ac=function(){var a;(a=this.Ka)!=null&&a.h.zb("/client_streamz/bg/fsc","",this.Aa)};
p.Kb=function(a,b){if(a==="t"){var c;(c=this.ya)==null||c.record(b,"",this.Aa)}else if(a==="n"){var d;(d=this.Ya)==null||d.record(b,"",this.Aa)}else if(a==="h"||a==="u"||a==="k"){if(a=this.u.get(a)){var e;(e=this.W)!=null&&e.h.zb("/client_streamz/bg/fcc",a,this.Aa);var f;(f=this.X)==null||f.record(b,a,this.Aa)}}else{var g;(g=this.ga)==null||g.record(b,a,"",this.pc,this.Aa)}};
p.Ha=function(a){var b=this.j.get(a);if(b){var c;(c=this.pa)!=null&&c.h.zb("/client_streamz/bg/fiec","",this.Aa,b)}else{var d;(d=this.errorCount)!=null&&d.h.zb("/client_streamz/bg/cec",a,"",this.pc,this.Aa)}};
p.Ga=function(){var a=this;if(!this.G){var b;(b=this.h)==null||b.Ab()}else if(!this.I)if(b=$i(),this.A===void 0){this.A=b;var c;(c=this.h)==null||c.Ab()}else if(c=b-this.A,c>=this.G){this.A=b;var d;(d=this.h)==null||d.Ab()}else this.I=!0,setTimeout(function(){a.ea||(a.I=!1,a.Ga())},this.G-c)};
function $i(){var a,b,c;return(c=(a=globalThis.performance)==null?void 0:(b=a.now)==null?void 0:b.call(a))!=null?c:Date.now()}
;function oc(a){this.H=J(a)}
x(oc,K);function fj(a){this.H=J(a)}
x(fj,K);var gj=Lf(fj);function hj(a){this.H=J(a,0,"bfkj")}
x(hj,K);var ij=function(a){return Rd(function(b){return b instanceof a&&!(Cd(b.H)&2)})}(hj);function jj(){var a=this;this.promise=new Promise(function(b,c){a.resolve=b;a.reject=c})}
;function kj(a){function b(z,G,I,N){Promise.resolve().then(function(){n.done();d.V.Ga();m.resolve({Kd:z,Xe:G,dh:I,Qg:N})})}
function c(z,G,I,N){if(!d.V.ea){var S="k";G?S="h":I&&(S="u");S!=="k"?N!==0&&d.V.Kb(S,z):d.j<=0?(d.V.Kb(S,z),d.j=Math.floor(Math.random()*200)):d.j--}}
L.call(this);var d=this;this.j=Math.floor(Math.random()*200);this.i=[];if("challenge"in a&&ij(a.challenge)){var e=tf(a.challenge,4);var f=tf(a.challenge,5);tf(a.challenge,7).length?this.h=gj(tf(a.challenge,7)):this.h=nf(a.challenge,fj,6)}else e=a.program,f=a.be;var g=new L;this.addOnDisposeCallback(function(){var z,G,I;return A(function(N){if(N.h==1)return N.yield(d.o,2);if(N.h!=3)return z=N.i,G=z.Xe,N.yield(Promise.all(d.i),3);d.i=[];d.V.Ga();(I=G)==null||I();g.dispose();N.h=0})});
if(a.De!==!1)if(a.V){this.V=a.V;var h;((h=this.h)==null?0:sf(h))&&this.V.yd(mc(this.h))}else{h=[];var k;if((k=this.h)==null?0:sf(k))h=mc(this.h);var l;ig(g,this.V=new dj((l=a.ue)!=null?l:Yi,this.h,h))}else ig(g,this.V=new cj);var m=new jj;this.o=m.promise;var n=new Zi(this.V,"t",!0);this.V.hd();if(!C[f])throw this.V.Ha(25),this.V.Ga(),Error("EGOU");if(!C[f].a)throw this.V.Ha(26),this.V.Ga(),Error("ELIU");try{var r=C[f].a;f=[[],[]];var t;if((t=this.h)==null?0:sf(t)){var w=mc(this.h);for(t=0;t<w.length;t++)f[0].push(w[t]),
f[1].push(1);var y=qc(this.h);for(w=0;w<y.length;w++)f[0].push(y[w]),f[1].push(0)}this.u=v(r(e,b,!0,a.nh,c,f)).next().value;this.We=m.promise.then(function(){})}catch(z){throw this.V.Ha(28),this.V.Ga(),z;
}}
x(kj,L);kj.prototype.snapshot=function(a){var b=this;if(this.ea)throw Error("Already disposed");var c=new jj;this.i.push(c.promise);this.V.Ac();return this.o.then(function(d){var e=d.Kd;return new Promise(function(f){var g=new Zi(b.V,"n");e(function(h){g.done();b.V.Ga();f(h)},[a.Vc,
a.Ye,a.kf,a.Ze])})}).finally(function(){return void c.resolve()})};
kj.prototype.vd=function(a){var b=this;if(this.ea)throw Error("Already disposed");this.V.Ac();var c=bj(this.V,function(){return b.u([a.Vc,a.Ye,a.kf,a.Ze])});
this.V.Ga();return c};
kj.prototype.getLogger=function(){return this.V};var lj=window;function mj(a){var b=nj;if(b)for(var c in b)Object.prototype.hasOwnProperty.call(b,c)&&a(b[c],c,b)}
function oj(){var a=[];mj(function(b){a.push(b)});
return a}
var nj={lf:"allow-forms",mf:"allow-modals",nf:"allow-orientation-lock",pf:"allow-pointer-lock",qf:"allow-popups",rf:"allow-popups-to-escape-sandbox",sf:"allow-presentation",tf:"allow-same-origin",uf:"allow-scripts",vf:"allow-top-navigation",wf:"allow-top-navigation-by-user-activation"},pj=Vh(function(){return oj()});
function qj(){var a=rj(),b={};Mb(pj(),function(c){a.sandbox&&a.sandbox.supports&&a.sandbox.supports(c)&&(b[c]=!0)});
return b}
function rj(){var a=a===void 0?document:a;return a.createElement("iframe")}
;function sj(a){typeof a=="number"&&(a=Math.round(a)+"px");return a}
;var tj=(new Date).getTime();function uj(a){Ph.call(this);var b=this;this.A=this.j=0;this.Ea=a!=null?a:{qa:function(e,f){return setTimeout(e,f)},
ra:function(e){clearTimeout(e)}};
var c,d;this.i=(d=(c=window.navigator)==null?void 0:c.onLine)!=null?d:!0;this.o=function(){return A(function(e){return e.yield(vj(b),0)})};
window.addEventListener("offline",this.o);window.addEventListener("online",this.o);this.A||wj(this)}
x(uj,Ph);function xj(){var a=yj;uj.h||(uj.h=new uj(a));return uj.h}
uj.prototype.dispose=function(){window.removeEventListener("offline",this.o);window.removeEventListener("online",this.o);this.Ea.ra(this.A);delete uj.h};
uj.prototype.wa=function(){return this.i};
function wj(a){a.A=a.Ea.qa(function(){var b;return A(function(c){if(c.h==1)return a.i?((b=window.navigator)==null?0:b.onLine)?c.F(3):c.yield(vj(a),3):c.yield(vj(a),3);wj(a);c.h=0})},3E4)}
function vj(a,b){return a.u?a.u:a.u=new Promise(function(c){var d,e,f,g;return A(function(h){switch(h.h){case 1:return d=window.AbortController?new window.AbortController:void 0,f=(e=d)==null?void 0:e.signal,g=!1,ya(h,2,3),d&&(a.j=a.Ea.qa(function(){d.abort()},b||2E4)),h.yield(fetch("/generate_204",{method:"HEAD",
signal:f}),5);case 5:g=!0;case 3:h.I=[h.j];h.o=0;h.D=0;a.u=void 0;a.j&&(a.Ea.ra(a.j),a.j=0);g!==a.i&&(a.i=g,a.i?Qh(a,"networkstatus-online"):Qh(a,"networkstatus-offline"));c(g);Aa(h);break;case 2:za(h),g=!1,h.F(3)}})})}
;function zj(){this.data=[];this.h=-1}
zj.prototype.set=function(a,b){b=b===void 0?!0:b;0<=a&&a<52&&Number.isInteger(a)&&this.data[a]!==b&&(this.data[a]=b,this.h=-1)};
zj.prototype.get=function(a){return!!this.data[a]};
function Aj(a){a.h===-1&&(a.h=a.data.reduce(function(b,c,d){return b+(c?Math.pow(2,d):0)},0));
return a.h}
;function Bj(){this.blockSize=-1}
;function Cj(){this.blockSize=-1;this.blockSize=64;this.h=[];this.D=[];this.u=[];this.j=[];this.j[0]=128;for(var a=1;a<this.blockSize;++a)this.j[a]=0;this.o=this.i=0;this.reset()}
Za(Cj,Bj);Cj.prototype.reset=function(){this.h[0]=1732584193;this.h[1]=4023233417;this.h[2]=2562383102;this.h[3]=271733878;this.h[4]=3285377520;this.o=this.i=0};
function Dj(a,b,c){c||(c=0);var d=a.u;if(typeof b==="string")for(var e=0;e<16;e++)d[e]=b.charCodeAt(c)<<24|b.charCodeAt(c+1)<<16|b.charCodeAt(c+2)<<8|b.charCodeAt(c+3),c+=4;else for(e=0;e<16;e++)d[e]=b[c]<<24|b[c+1]<<16|b[c+2]<<8|b[c+3],c+=4;for(e=16;e<80;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}b=a.h[0];c=a.h[1];var g=a.h[2],h=a.h[3],k=a.h[4];for(e=0;e<80;e++){if(e<40)if(e<20){f=h^c&(g^h);var l=1518500249}else f=c^g^h,l=1859775393;else e<60?(f=c&g|h&(c|g),l=2400959708):
(f=c^g^h,l=3395469782);f=(b<<5|b>>>27)+f+k+l+d[e]&4294967295;k=h;h=g;g=(c<<30|c>>>2)&4294967295;c=b;b=f}a.h[0]=a.h[0]+b&4294967295;a.h[1]=a.h[1]+c&4294967295;a.h[2]=a.h[2]+g&4294967295;a.h[3]=a.h[3]+h&4294967295;a.h[4]=a.h[4]+k&4294967295}
Cj.prototype.update=function(a,b){if(a!=null){b===void 0&&(b=a.length);for(var c=b-this.blockSize,d=0,e=this.D,f=this.i;d<b;){if(f==0)for(;d<=c;)Dj(this,a,d),d+=this.blockSize;if(typeof a==="string")for(;d<b;){if(e[f]=a.charCodeAt(d),++f,++d,f==this.blockSize){Dj(this,e);f=0;break}}else for(;d<b;)if(e[f]=a[d],++f,++d,f==this.blockSize){Dj(this,e);f=0;break}}this.i=f;this.o+=b}};
Cj.prototype.digest=function(){var a=[],b=this.o*8;this.i<56?this.update(this.j,56-this.i):this.update(this.j,this.blockSize-(this.i-56));for(var c=this.blockSize-1;c>=56;c--)this.D[c]=b&255,b/=256;Dj(this,this.D);for(c=b=0;c<5;c++)for(var d=24;d>=0;d-=8)a[b]=this.h[c]>>d&255,++b;return a};function Ej(a){return typeof a.className=="string"?a.className:a.getAttribute&&a.getAttribute("class")||""}
function Fj(a,b){typeof a.className=="string"?a.className=b:a.setAttribute&&a.setAttribute("class",b)}
function Gj(a,b){a.classList?b=a.classList.contains(b):(a=a.classList?a.classList:Ej(a).match(/\S+/g)||[],b=Lb(a,b)>=0);return b}
function Hj(){var a=document.body;a.classList?a.classList.remove("inverted-hdpi"):Gj(a,"inverted-hdpi")&&Fj(a,Array.prototype.filter.call(a.classList?a.classList:Ej(a).match(/\S+/g)||[],function(b){return b!="inverted-hdpi"}).join(" "))}
;function Ij(){}
Ij.prototype.next=function(){return Jj};
var Jj={done:!0,value:void 0};Ij.prototype.lb=function(){return this};function Kj(a){if(a instanceof Lj||a instanceof Mj||a instanceof Nj)return a;if(typeof a.next=="function")return new Lj(function(){return a});
if(typeof a[Symbol.iterator]=="function")return new Lj(function(){return a[Symbol.iterator]()});
if(typeof a.lb=="function")return new Lj(function(){return a.lb()});
throw Error("Not an iterator or iterable.");}
function Lj(a){this.h=a}
Lj.prototype.lb=function(){return new Mj(this.h())};
Lj.prototype[Symbol.iterator]=function(){return new Nj(this.h())};
Lj.prototype.i=function(){return new Nj(this.h())};
function Mj(a){this.h=a}
x(Mj,Ij);Mj.prototype.next=function(){return this.h.next()};
Mj.prototype[Symbol.iterator]=function(){return new Nj(this.h)};
Mj.prototype.i=function(){return new Nj(this.h)};
function Nj(a){Lj.call(this,function(){return a});
this.j=a}
x(Nj,Lj);Nj.prototype.next=function(){return this.j.next()};function M(a){L.call(this);this.u=1;this.j=[];this.o=0;this.h=[];this.i={};this.A=!!a}
Za(M,L);p=M.prototype;p.subscribe=function(a,b,c){var d=this.i[a];d||(d=this.i[a]=[]);var e=this.u;this.h[e]=a;this.h[e+1]=b;this.h[e+2]=c;this.u=e+3;d.push(e);return e};
p.unsubscribe=function(a,b,c){if(a=this.i[a]){var d=this.h;if(a=a.find(function(e){return d[e+1]==b&&d[e+2]==c}))return this.Rb(a)}return!1};
p.Rb=function(a){var b=this.h[a];if(b){var c=this.i[b];this.o!=0?(this.j.push(a),this.h[a+1]=function(){}):(c&&Rb(c,a),delete this.h[a],delete this.h[a+1],delete this.h[a+2])}return!!b};
p.kb=function(a,b){var c=this.i[a];if(c){for(var d=Array(arguments.length-1),e=1,f=arguments.length;e<f;e++)d[e-1]=arguments[e];if(this.A)for(e=0;e<c.length;e++){var g=c[e];Oj(this.h[g+1],this.h[g+2],d)}else{this.o++;try{for(e=0,f=c.length;e<f&&!this.ea;e++)g=c[e],this.h[g+1].apply(this.h[g+2],d)}finally{if(this.o--,this.j.length>0&&this.o==0)for(;c=this.j.pop();)this.Rb(c)}}return e!=0}return!1};
function Oj(a,b,c){di(function(){a.apply(b,c)})}
p.clear=function(a){if(a){var b=this.i[a];b&&(b.forEach(this.Rb,this),delete this.i[a])}else this.h.length=0,this.i={}};
p.ba=function(){M.Ca.ba.call(this);this.clear();this.j.length=0};function Pj(a){this.h=a}
Pj.prototype.set=function(a,b){b===void 0?this.h.remove(a):this.h.set(a,(new Di).serialize(b))};
Pj.prototype.get=function(a){try{var b=this.h.get(a)}catch(c){return}if(b!==null)try{return JSON.parse(b)}catch(c){throw"Storage: Invalid value was encountered";}};
Pj.prototype.remove=function(a){this.h.remove(a)};function Qj(a){this.h=a}
Za(Qj,Pj);function Rj(a){this.data=a}
function Sj(a){return a===void 0||a instanceof Rj?a:new Rj(a)}
Qj.prototype.set=function(a,b){Qj.Ca.set.call(this,a,Sj(b))};
Qj.prototype.i=function(a){a=Qj.Ca.get.call(this,a);if(a===void 0||a instanceof Object)return a;throw"Storage: Invalid value was encountered";};
Qj.prototype.get=function(a){if(a=this.i(a)){if(a=a.data,a===void 0)throw"Storage: Invalid value was encountered";}else a=void 0;return a};function Tj(a){this.h=a}
Za(Tj,Qj);Tj.prototype.set=function(a,b,c){if(b=Sj(b)){if(c){if(c<Ya()){Tj.prototype.remove.call(this,a);return}b.expiration=c}b.creation=Ya()}Tj.Ca.set.call(this,a,b)};
Tj.prototype.i=function(a){var b=Tj.Ca.i.call(this,a);if(b){var c=b.creation,d=b.expiration;if(d&&d<Ya()||c&&c>Ya())Tj.prototype.remove.call(this,a);else return b}};function Uj(){}
;function Vj(){}
Za(Vj,Uj);Vj.prototype[Symbol.iterator]=function(){return Kj(this.lb(!0)).i()};
Vj.prototype.clear=function(){var a=Array.from(this);a=v(a);for(var b=a.next();!b.done;b=a.next())this.remove(b.value)};function Wj(a){this.h=a;this.i=null}
Za(Wj,Vj);p=Wj.prototype;p.isAvailable=function(){var a=this.h;if(a)try{a.setItem("__sak","1");a.removeItem("__sak");var b=!0}catch(c){b=c instanceof DOMException&&(c.name==="QuotaExceededError"||c.code===22||c.code===1014||c.name==="NS_ERROR_DOM_QUOTA_REACHED")&&a&&a.length!==0}else b=!1;return this.i=b};
p.set=function(a,b){Xj(this);try{this.h.setItem(a,b)}catch(c){if(this.h.length==0)throw"Storage mechanism: Storage disabled";throw"Storage mechanism: Quota exceeded";}};
p.get=function(a){Xj(this);a=this.h.getItem(a);if(typeof a!=="string"&&a!==null)throw"Storage mechanism: Invalid value was encountered";return a};
p.remove=function(a){Xj(this);this.h.removeItem(a)};
p.lb=function(a){Xj(this);var b=0,c=this.h,d=new Ij;d.next=function(){if(b>=c.length)return Jj;var e=c.key(b++);if(a)return{value:e,done:!1};e=c.getItem(e);if(typeof e!=="string")throw"Storage mechanism: Invalid value was encountered";return{value:e,done:!1}};
return d};
p.clear=function(){Xj(this);this.h.clear()};
p.key=function(a){Xj(this);return this.h.key(a)};
function Xj(a){if(a.h==null)throw Error("Storage mechanism: Storage unavailable");var b;((b=a.i)!=null?b:a.isAvailable())||Fc(Error("Storage mechanism: Storage unavailable"))}
;function Yj(){var a=null;try{a=C.localStorage||null}catch(b){}Wj.call(this,a)}
Za(Yj,Wj);function Zj(a,b){this.i=a;this.h=b+"::"}
Za(Zj,Vj);Zj.prototype.set=function(a,b){this.i.set(this.h+a,b)};
Zj.prototype.get=function(a){return this.i.get(this.h+a)};
Zj.prototype.remove=function(a){this.i.remove(this.h+a)};
Zj.prototype.lb=function(a){var b=this.i[Symbol.iterator](),c=this,d=new Ij;d.next=function(){var e=b.next();if(e.done)return e;for(e=e.value;e.slice(0,c.h.length)!=c.h;){e=b.next();if(e.done)return e;e=e.value}return{value:a?e.slice(c.h.length):c.i.get(e),done:!1}};
return d};/*

 (The MIT License)

 Copyright (C) 2014 by Vitaly Puzrin

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 -----------------------------------------------------------------------------
 Ported from zlib, which is under the following license
 https://github.com/madler/zlib/blob/master/zlib.h

 zlib.h -- interface of the 'zlib' general purpose compression library
   version 1.2.8, April 28th, 2013
   Copyright (C) 1995-2013 Jean-loup Gailly and Mark Adler
   This software is provided 'as-is', without any express or implied
   warranty.  In no event will the authors be held liable for any damages
   arising from the use of this software.
   Permission is granted to anyone to use this software for any purpose,
   including commercial applications, and to alter it and redistribute it
   freely, subject to the following restrictions:
   1. The origin of this software must not be misrepresented; you must not
      claim that you wrote the original software. If you use this software
      in a product, an acknowledgment in the product documentation would be
      appreciated but is not required.
   2. Altered source versions must be plainly marked as such, and must not be
      misrepresented as being the original software.
   3. This notice may not be removed or altered from any source distribution.
   Jean-loup Gailly        Mark Adler
   jloup@gzip.org          madler@alumni.caltech.edu
   The data format used by the zlib library is described by RFCs (Request for
   Comments) 1950 to 1952 in the files http://tools.ietf.org/html/rfc1950
   (zlib format), rfc1951 (deflate format) and rfc1952 (gzip format).
*/
var O={},ak=typeof Uint8Array!=="undefined"&&typeof Uint16Array!=="undefined"&&typeof Int32Array!=="undefined";O.assign=function(a){for(var b=Array.prototype.slice.call(arguments,1);b.length;){var c=b.shift();if(c){if(typeof c!=="object")throw new TypeError(c+"must be non-object");for(var d in c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d])}}return a};
O.Lc=function(a,b){if(a.length===b)return a;if(a.subarray)return a.subarray(0,b);a.length=b;return a};
var bk={mb:function(a,b,c,d,e){if(b.subarray&&a.subarray)a.set(b.subarray(c,c+d),e);else for(var f=0;f<d;f++)a[e+f]=b[c+f]},
Yc:function(a){var b,c;var d=c=0;for(b=a.length;d<b;d++)c+=a[d].length;var e=new Uint8Array(c);d=c=0;for(b=a.length;d<b;d++){var f=a[d];e.set(f,c);c+=f.length}return e}},ck={mb:function(a,b,c,d,e){for(var f=0;f<d;f++)a[e+f]=b[c+f]},
Yc:function(a){return[].concat.apply([],a)}};
O.Ve=function(){ak?(O.jb=Uint8Array,O.Ja=Uint16Array,O.Fd=Int32Array,O.assign(O,bk)):(O.jb=Array,O.Ja=Array,O.Fd=Array,O.assign(O,ck))};
O.Ve();var dk=!0;try{new Uint8Array(1)}catch(a){dk=!1}
function ek(a){var b,c,d=a.length,e=0;for(b=0;b<d;b++){var f=a.charCodeAt(b);if((f&64512)===55296&&b+1<d){var g=a.charCodeAt(b+1);(g&64512)===56320&&(f=65536+(f-55296<<10)+(g-56320),b++)}e+=f<128?1:f<2048?2:f<65536?3:4}var h=new O.jb(e);for(b=c=0;c<e;b++)f=a.charCodeAt(b),(f&64512)===55296&&b+1<d&&(g=a.charCodeAt(b+1),(g&64512)===56320&&(f=65536+(f-55296<<10)+(g-56320),b++)),f<128?h[c++]=f:(f<2048?h[c++]=192|f>>>6:(f<65536?h[c++]=224|f>>>12:(h[c++]=240|f>>>18,h[c++]=128|f>>>12&63),h[c++]=128|f>>>
6&63),h[c++]=128|f&63);return h}
;var fk={};fk=function(a,b,c,d){var e=a&65535|0;a=a>>>16&65535|0;for(var f;c!==0;){f=c>2E3?2E3:c;c-=f;do e=e+b[d++]|0,a=a+e|0;while(--f);e%=65521;a%=65521}return e|a<<16|0};for(var gk={},hk,ik=[],jk=0;jk<256;jk++){hk=jk;for(var kk=0;kk<8;kk++)hk=hk&1?3988292384^hk>>>1:hk>>>1;ik[jk]=hk}gk=function(a,b,c,d){c=d+c;for(a^=-1;d<c;d++)a=a>>>8^ik[(a^b[d])&255];return a^-1};var lk={};lk={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"};function mk(a){for(var b=a.length;--b>=0;)a[b]=0}
var nk=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],ok=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],pk=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],qk=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],rk=Array(576);mk(rk);var sk=Array(60);mk(sk);var tk=Array(512);mk(tk);var uk=Array(256);mk(uk);var vk=Array(29);mk(vk);var wk=Array(30);mk(wk);function xk(a,b,c,d,e){this.wd=a;this.Xd=b;this.Wd=c;this.Rd=d;this.te=e;this.cd=a&&a.length}
var yk,zk,Ak;function Bk(a,b){this.Xc=a;this.ub=0;this.Wa=b}
function Ck(a,b){a.aa[a.pending++]=b&255;a.aa[a.pending++]=b>>>8&255}
function Dk(a,b,c){a.ja>16-c?(a.oa|=b<<a.ja&65535,Ck(a,a.oa),a.oa=b>>16-a.ja,a.ja+=c-16):(a.oa|=b<<a.ja&65535,a.ja+=c)}
function Ek(a,b,c){Dk(a,c[b*2],c[b*2+1])}
function Fk(a,b){var c=0;do c|=a&1,a>>>=1,c<<=1;while(--b>0);return c>>>1}
function Gk(a,b,c){var d=Array(16),e=0,f;for(f=1;f<=15;f++)d[f]=e=e+c[f-1]<<1;for(c=0;c<=b;c++)e=a[c*2+1],e!==0&&(a[c*2]=Fk(d[e]++,e))}
function Hk(a){var b;for(b=0;b<286;b++)a.sa[b*2]=0;for(b=0;b<30;b++)a.ab[b*2]=0;for(b=0;b<19;b++)a.ka[b*2]=0;a.sa[512]=1;a.Qa=a.yb=0;a.za=a.matches=0}
function Ik(a){a.ja>8?Ck(a,a.oa):a.ja>0&&(a.aa[a.pending++]=a.oa);a.oa=0;a.ja=0}
function Jk(a,b,c){Ik(a);Ck(a,c);Ck(a,~c);O.mb(a.aa,a.window,b,c,a.pending);a.pending+=c}
function Kk(a,b,c,d){var e=b*2,f=c*2;return a[e]<a[f]||a[e]===a[f]&&d[b]<=d[c]}
function Lk(a,b,c){for(var d=a.da[c],e=c<<1;e<=a.Oa;){e<a.Oa&&Kk(b,a.da[e+1],a.da[e],a.depth)&&e++;if(Kk(b,d,a.da[e],a.depth))break;a.da[c]=a.da[e];c=e;e<<=1}a.da[c]=d}
function Mk(a,b,c){var d=0;if(a.za!==0){do{var e=a.aa[a.Eb+d*2]<<8|a.aa[a.Eb+d*2+1];var f=a.aa[a.zc+d];d++;if(e===0)Ek(a,f,b);else{var g=uk[f];Ek(a,g+256+1,b);var h=nk[g];h!==0&&(f-=vk[g],Dk(a,f,h));e--;g=e<256?tk[e]:tk[256+(e>>>7)];Ek(a,g,c);h=ok[g];h!==0&&(e-=wk[g],Dk(a,e,h))}}while(d<a.za)}Ek(a,256,b)}
function Nk(a,b){var c=b.Xc,d=b.Wa.wd,e=b.Wa.cd,f=b.Wa.Rd,g,h=-1;a.Oa=0;a.pb=573;for(g=0;g<f;g++)c[g*2]!==0?(a.da[++a.Oa]=h=g,a.depth[g]=0):c[g*2+1]=0;for(;a.Oa<2;){var k=a.da[++a.Oa]=h<2?++h:0;c[k*2]=1;a.depth[k]=0;a.Qa--;e&&(a.yb-=d[k*2+1])}b.ub=h;for(g=a.Oa>>1;g>=1;g--)Lk(a,c,g);k=f;do g=a.da[1],a.da[1]=a.da[a.Oa--],Lk(a,c,1),d=a.da[1],a.da[--a.pb]=g,a.da[--a.pb]=d,c[k*2]=c[g*2]+c[d*2],a.depth[k]=(a.depth[g]>=a.depth[d]?a.depth[g]:a.depth[d])+1,c[g*2+1]=c[d*2+1]=k,a.da[1]=k++,Lk(a,c,1);while(a.Oa>=
2);a.da[--a.pb]=a.da[1];g=b.Xc;k=b.ub;d=b.Wa.wd;e=b.Wa.cd;f=b.Wa.Xd;var l=b.Wa.Wd,m=b.Wa.te,n,r=0;for(n=0;n<=15;n++)a.La[n]=0;g[a.da[a.pb]*2+1]=0;for(b=a.pb+1;b<573;b++){var t=a.da[b];n=g[g[t*2+1]*2+1]+1;n>m&&(n=m,r++);g[t*2+1]=n;if(!(t>k)){a.La[n]++;var w=0;t>=l&&(w=f[t-l]);var y=g[t*2];a.Qa+=y*(n+w);e&&(a.yb+=y*(d[t*2+1]+w))}}if(r!==0){do{for(n=m-1;a.La[n]===0;)n--;a.La[n]--;a.La[n+1]+=2;a.La[m]--;r-=2}while(r>0);for(n=m;n!==0;n--)for(t=a.La[n];t!==0;)d=a.da[--b],d>k||(g[d*2+1]!==n&&(a.Qa+=(n-g[d*
2+1])*g[d*2],g[d*2+1]=n),t--)}Gk(c,h,a.La)}
function Ok(a,b,c){var d,e=-1,f=b[1],g=0,h=7,k=4;f===0&&(h=138,k=3);b[(c+1)*2+1]=65535;for(d=0;d<=c;d++){var l=f;f=b[(d+1)*2+1];++g<h&&l===f||(g<k?a.ka[l*2]+=g:l!==0?(l!==e&&a.ka[l*2]++,a.ka[32]++):g<=10?a.ka[34]++:a.ka[36]++,g=0,e=l,f===0?(h=138,k=3):l===f?(h=6,k=3):(h=7,k=4))}}
function Pk(a,b,c){var d,e=-1,f=b[1],g=0,h=7,k=4;f===0&&(h=138,k=3);for(d=0;d<=c;d++){var l=f;f=b[(d+1)*2+1];if(!(++g<h&&l===f)){if(g<k){do Ek(a,l,a.ka);while(--g!==0)}else l!==0?(l!==e&&(Ek(a,l,a.ka),g--),Ek(a,16,a.ka),Dk(a,g-3,2)):g<=10?(Ek(a,17,a.ka),Dk(a,g-3,3)):(Ek(a,18,a.ka),Dk(a,g-11,7));g=0;e=l;f===0?(h=138,k=3):l===f?(h=6,k=3):(h=7,k=4)}}}
function Qk(a){var b=4093624447,c;for(c=0;c<=31;c++,b>>>=1)if(b&1&&a.sa[c*2]!==0)return 0;if(a.sa[18]!==0||a.sa[20]!==0||a.sa[26]!==0)return 1;for(c=32;c<256;c++)if(a.sa[c*2]!==0)return 1;return 0}
var Rk=!1;function Sk(a,b,c){a.aa[a.Eb+a.za*2]=b>>>8&255;a.aa[a.Eb+a.za*2+1]=b&255;a.aa[a.zc+a.za]=c&255;a.za++;b===0?a.sa[c*2]++:(a.matches++,b--,a.sa[(uk[c]+256+1)*2]++,a.ab[(b<256?tk[b]:tk[256+(b>>>7)])*2]++);return a.za===a.Jb-1}
;function Tk(a,b){a.msg=lk[b];return b}
function Uk(a){for(var b=a.length;--b>=0;)a[b]=0}
function Vk(a){var b=a.state,c=b.pending;c>a.R&&(c=a.R);c!==0&&(O.mb(a.output,b.aa,b.Mb,c,a.vb),a.vb+=c,b.Mb+=c,a.Mc+=c,a.R-=c,b.pending-=c,b.pending===0&&(b.Mb=0))}
function Wk(a,b){var c=a.va>=0?a.va:-1,d=a.v-a.va,e=0;if(a.level>0){a.M.uc===2&&(a.M.uc=Qk(a));Nk(a,a.fc);Nk(a,a.Zb);Ok(a,a.sa,a.fc.ub);Ok(a,a.ab,a.Zb.ub);Nk(a,a.Rc);for(e=18;e>=3&&a.ka[qk[e]*2+1]===0;e--);a.Qa+=3*(e+1)+14;var f=a.Qa+3+7>>>3;var g=a.yb+3+7>>>3;g<=f&&(f=g)}else f=g=d+5;if(d+4<=f&&c!==-1)Dk(a,b?1:0,3),Jk(a,c,d);else if(a.strategy===4||g===f)Dk(a,2+(b?1:0),3),Mk(a,rk,sk);else{Dk(a,4+(b?1:0),3);c=a.fc.ub+1;d=a.Zb.ub+1;e+=1;Dk(a,c-257,5);Dk(a,d-1,5);Dk(a,e-4,4);for(f=0;f<e;f++)Dk(a,a.ka[qk[f]*
2+1],3);Pk(a,a.sa,c-1);Pk(a,a.ab,d-1);Mk(a,a.sa,a.ab)}Hk(a);b&&Ik(a);a.va=a.v;Vk(a.M)}
function P(a,b){a.aa[a.pending++]=b}
function Xk(a,b){a.aa[a.pending++]=b>>>8&255;a.aa[a.pending++]=b&255}
function Yk(a,b){var c=a.jd,d=a.v,e=a.xa,f=a.kd,g=a.v>a.ma-262?a.v-(a.ma-262):0,h=a.window,k=a.Xa,l=a.Ia,m=a.v+258,n=h[d+e-1],r=h[d+e];a.xa>=a.bd&&(c>>=2);f>a.B&&(f=a.B);do{var t=b;if(h[t+e]===r&&h[t+e-1]===n&&h[t]===h[d]&&h[++t]===h[d+1]){d+=2;for(t++;h[++d]===h[++t]&&h[++d]===h[++t]&&h[++d]===h[++t]&&h[++d]===h[++t]&&h[++d]===h[++t]&&h[++d]===h[++t]&&h[++d]===h[++t]&&h[++d]===h[++t]&&d<m;);t=258-(m-d);d=m-258;if(t>e){a.tb=b;e=t;if(t>=f)break;n=h[d+e-1];r=h[d+e]}}}while((b=l[b&k])>g&&--c!==0);return e<=
a.B?e:a.B}
function Zk(a){var b=a.ma,c;do{var d=a.Dd-a.B-a.v;if(a.v>=b+(b-262)){O.mb(a.window,a.window,b,b,0);a.tb-=b;a.v-=b;a.va-=b;var e=c=a.ec;do{var f=a.head[--e];a.head[e]=f>=b?f-b:0}while(--c);e=c=b;do f=a.Ia[--e],a.Ia[e]=f>=b?f-b:0;while(--c);d+=b}if(a.M.na===0)break;e=a.M;c=a.window;f=a.v+a.B;var g=e.na;g>d&&(g=d);g===0?c=0:(e.na-=g,O.mb(c,e.input,e.gb,g,f),e.state.wrap===1?e.K=fk(e.K,c,g,f):e.state.wrap===2&&(e.K=gk(e.K,c,g,f)),e.gb+=g,e.ib+=g,c=g);a.B+=c;if(a.B+a.ta>=3)for(d=a.v-a.ta,a.P=a.window[d],
a.P=(a.P<<a.Na^a.window[d+1])&a.Ma;a.ta&&!(a.P=(a.P<<a.Na^a.window[d+3-1])&a.Ma,a.Ia[d&a.Xa]=a.head[a.P],a.head[a.P]=d,d++,a.ta--,a.B+a.ta<3););}while(a.B<262&&a.M.na!==0)}
function $k(a,b){for(var c;;){if(a.B<262){Zk(a);if(a.B<262&&b===0)return 1;if(a.B===0)break}c=0;a.B>=3&&(a.P=(a.P<<a.Na^a.window[a.v+3-1])&a.Ma,c=a.Ia[a.v&a.Xa]=a.head[a.P],a.head[a.P]=a.v);c!==0&&a.v-c<=a.ma-262&&(a.S=Yk(a,c));if(a.S>=3)if(c=Sk(a,a.v-a.tb,a.S-3),a.B-=a.S,a.S<=a.Bc&&a.B>=3){a.S--;do a.v++,a.P=(a.P<<a.Na^a.window[a.v+3-1])&a.Ma,a.Ia[a.v&a.Xa]=a.head[a.P],a.head[a.P]=a.v;while(--a.S!==0);a.v++}else a.v+=a.S,a.S=0,a.P=a.window[a.v],a.P=(a.P<<a.Na^a.window[a.v+1])&a.Ma;else c=Sk(a,0,
a.window[a.v]),a.B--,a.v++;if(c&&(Wk(a,!1),a.M.R===0))return 1}a.ta=a.v<2?a.v:2;return b===4?(Wk(a,!0),a.M.R===0?3:4):a.za&&(Wk(a,!1),a.M.R===0)?1:2}
function al(a,b){for(var c,d;;){if(a.B<262){Zk(a);if(a.B<262&&b===0)return 1;if(a.B===0)break}c=0;a.B>=3&&(a.P=(a.P<<a.Na^a.window[a.v+3-1])&a.Ma,c=a.Ia[a.v&a.Xa]=a.head[a.P],a.head[a.P]=a.v);a.xa=a.S;a.nd=a.tb;a.S=2;c!==0&&a.xa<a.Bc&&a.v-c<=a.ma-262&&(a.S=Yk(a,c),a.S<=5&&(a.strategy===1||a.S===3&&a.v-a.tb>4096)&&(a.S=2));if(a.xa>=3&&a.S<=a.xa){d=a.v+a.B-3;c=Sk(a,a.v-1-a.nd,a.xa-3);a.B-=a.xa-1;a.xa-=2;do++a.v<=d&&(a.P=(a.P<<a.Na^a.window[a.v+3-1])&a.Ma,a.Ia[a.v&a.Xa]=a.head[a.P],a.head[a.P]=a.v);
while(--a.xa!==0);a.eb=0;a.S=2;a.v++;if(c&&(Wk(a,!1),a.M.R===0))return 1}else if(a.eb){if((c=Sk(a,0,a.window[a.v-1]))&&Wk(a,!1),a.v++,a.B--,a.M.R===0)return 1}else a.eb=1,a.v++,a.B--}a.eb&&(Sk(a,0,a.window[a.v-1]),a.eb=0);a.ta=a.v<2?a.v:2;return b===4?(Wk(a,!0),a.M.R===0?3:4):a.za&&(Wk(a,!1),a.M.R===0)?1:2}
function bl(a,b){for(var c,d,e,f=a.window;;){if(a.B<=258){Zk(a);if(a.B<=258&&b===0)return 1;if(a.B===0)break}a.S=0;if(a.B>=3&&a.v>0&&(d=a.v-1,c=f[d],c===f[++d]&&c===f[++d]&&c===f[++d])){for(e=a.v+258;c===f[++d]&&c===f[++d]&&c===f[++d]&&c===f[++d]&&c===f[++d]&&c===f[++d]&&c===f[++d]&&c===f[++d]&&d<e;);a.S=258-(e-d);a.S>a.B&&(a.S=a.B)}a.S>=3?(c=Sk(a,1,a.S-3),a.B-=a.S,a.v+=a.S,a.S=0):(c=Sk(a,0,a.window[a.v]),a.B--,a.v++);if(c&&(Wk(a,!1),a.M.R===0))return 1}a.ta=0;return b===4?(Wk(a,!0),a.M.R===0?3:4):
a.za&&(Wk(a,!1),a.M.R===0)?1:2}
function cl(a,b){for(var c;;){if(a.B===0&&(Zk(a),a.B===0)){if(b===0)return 1;break}a.S=0;c=Sk(a,0,a.window[a.v]);a.B--;a.v++;if(c&&(Wk(a,!1),a.M.R===0))return 1}a.ta=0;return b===4?(Wk(a,!0),a.M.R===0?3:4):a.za&&(Wk(a,!1),a.M.R===0)?1:2}
function dl(a,b,c,d,e){this.ce=a;this.se=b;this.we=c;this.re=d;this.Yd=e}
var el;el=[new dl(0,0,0,0,function(a,b){var c=65535;for(c>a.Ba-5&&(c=a.Ba-5);;){if(a.B<=1){Zk(a);if(a.B===0&&b===0)return 1;if(a.B===0)break}a.v+=a.B;a.B=0;var d=a.va+c;if(a.v===0||a.v>=d)if(a.B=a.v-d,a.v=d,Wk(a,!1),a.M.R===0)return 1;if(a.v-a.va>=a.ma-262&&(Wk(a,!1),a.M.R===0))return 1}a.ta=0;if(b===4)return Wk(a,!0),a.M.R===0?3:4;a.v>a.va&&Wk(a,!1);return 1}),
new dl(4,4,8,4,$k),new dl(4,5,16,8,$k),new dl(4,6,32,32,$k),new dl(4,4,16,16,al),new dl(8,16,32,32,al),new dl(8,16,128,128,al),new dl(8,32,128,256,al),new dl(32,128,258,1024,al),new dl(32,258,258,4096,al)];
function fl(){this.M=null;this.status=0;this.aa=null;this.wrap=this.pending=this.Mb=this.Ba=0;this.J=null;this.Da=0;this.method=8;this.rb=-1;this.Xa=this.Oc=this.ma=0;this.window=null;this.Dd=0;this.head=this.Ia=null;this.kd=this.bd=this.strategy=this.level=this.Bc=this.jd=this.xa=this.B=this.tb=this.v=this.eb=this.nd=this.S=this.va=this.Na=this.Ma=this.xc=this.ec=this.P=0;this.sa=new O.Ja(1146);this.ab=new O.Ja(122);this.ka=new O.Ja(78);Uk(this.sa);Uk(this.ab);Uk(this.ka);this.Rc=this.Zb=this.fc=
null;this.La=new O.Ja(16);this.da=new O.Ja(573);Uk(this.da);this.pb=this.Oa=0;this.depth=new O.Ja(573);Uk(this.depth);this.ja=this.oa=this.ta=this.matches=this.yb=this.Qa=this.Eb=this.za=this.Jb=this.zc=0}
function gl(a,b){if(!a||!a.state||b>5||b<0)return a?Tk(a,-2):-2;var c=a.state;if(!a.output||!a.input&&a.na!==0||c.status===666&&b!==4)return Tk(a,a.R===0?-5:-2);c.M=a;var d=c.rb;c.rb=b;if(c.status===42)if(c.wrap===2)a.K=0,P(c,31),P(c,139),P(c,8),c.J?(P(c,(c.J.text?1:0)+(c.J.Ua?2:0)+(c.J.extra?4:0)+(c.J.name?8:0)+(c.J.comment?16:0)),P(c,c.J.time&255),P(c,c.J.time>>8&255),P(c,c.J.time>>16&255),P(c,c.J.time>>24&255),P(c,c.level===9?2:c.strategy>=2||c.level<2?4:0),P(c,c.J.os&255),c.J.extra&&c.J.extra.length&&
(P(c,c.J.extra.length&255),P(c,c.J.extra.length>>8&255)),c.J.Ua&&(a.K=gk(a.K,c.aa,c.pending,0)),c.Da=0,c.status=69):(P(c,0),P(c,0),P(c,0),P(c,0),P(c,0),P(c,c.level===9?2:c.strategy>=2||c.level<2?4:0),P(c,3),c.status=113);else{var e=8+(c.Oc-8<<4)<<8;e|=(c.strategy>=2||c.level<2?0:c.level<6?1:c.level===6?2:3)<<6;c.v!==0&&(e|=32);c.status=113;Xk(c,e+(31-e%31));c.v!==0&&(Xk(c,a.K>>>16),Xk(c,a.K&65535));a.K=1}if(c.status===69)if(c.J.extra){for(e=c.pending;c.Da<(c.J.extra.length&65535)&&(c.pending!==c.Ba||
(c.J.Ua&&c.pending>e&&(a.K=gk(a.K,c.aa,c.pending-e,e)),Vk(a),e=c.pending,c.pending!==c.Ba));)P(c,c.J.extra[c.Da]&255),c.Da++;c.J.Ua&&c.pending>e&&(a.K=gk(a.K,c.aa,c.pending-e,e));c.Da===c.J.extra.length&&(c.Da=0,c.status=73)}else c.status=73;if(c.status===73)if(c.J.name){e=c.pending;do{if(c.pending===c.Ba&&(c.J.Ua&&c.pending>e&&(a.K=gk(a.K,c.aa,c.pending-e,e)),Vk(a),e=c.pending,c.pending===c.Ba)){var f=1;break}f=c.Da<c.J.name.length?c.J.name.charCodeAt(c.Da++)&255:0;P(c,f)}while(f!==0);c.J.Ua&&c.pending>
e&&(a.K=gk(a.K,c.aa,c.pending-e,e));f===0&&(c.Da=0,c.status=91)}else c.status=91;if(c.status===91)if(c.J.comment){e=c.pending;do{if(c.pending===c.Ba&&(c.J.Ua&&c.pending>e&&(a.K=gk(a.K,c.aa,c.pending-e,e)),Vk(a),e=c.pending,c.pending===c.Ba)){f=1;break}f=c.Da<c.J.comment.length?c.J.comment.charCodeAt(c.Da++)&255:0;P(c,f)}while(f!==0);c.J.Ua&&c.pending>e&&(a.K=gk(a.K,c.aa,c.pending-e,e));f===0&&(c.status=103)}else c.status=103;c.status===103&&(c.J.Ua?(c.pending+2>c.Ba&&Vk(a),c.pending+2<=c.Ba&&(P(c,
a.K&255),P(c,a.K>>8&255),a.K=0,c.status=113)):c.status=113);if(c.pending!==0){if(Vk(a),a.R===0)return c.rb=-1,0}else if(a.na===0&&(b<<1)-(b>4?9:0)<=(d<<1)-(d>4?9:0)&&b!==4)return Tk(a,-5);if(c.status===666&&a.na!==0)return Tk(a,-5);if(a.na!==0||c.B!==0||b!==0&&c.status!==666){d=c.strategy===2?cl(c,b):c.strategy===3?bl(c,b):el[c.level].Yd(c,b);if(d===3||d===4)c.status=666;if(d===1||d===3)return a.R===0&&(c.rb=-1),0;if(d===2&&(b===1?(Dk(c,2,3),Ek(c,256,rk),c.ja===16?(Ck(c,c.oa),c.oa=0,c.ja=0):c.ja>=
8&&(c.aa[c.pending++]=c.oa&255,c.oa>>=8,c.ja-=8)):b!==5&&(Dk(c,0,3),Jk(c,0,0),b===3&&(Uk(c.head),c.B===0&&(c.v=0,c.va=0,c.ta=0))),Vk(a),a.R===0))return c.rb=-1,0}if(b!==4)return 0;if(c.wrap<=0)return 1;c.wrap===2?(P(c,a.K&255),P(c,a.K>>8&255),P(c,a.K>>16&255),P(c,a.K>>24&255),P(c,a.ib&255),P(c,a.ib>>8&255),P(c,a.ib>>16&255),P(c,a.ib>>24&255)):(Xk(c,a.K>>>16),Xk(c,a.K&65535));Vk(a);c.wrap>0&&(c.wrap=-c.wrap);return c.pending!==0?0:1}
;var hl={};hl=function(){this.input=null;this.ib=this.na=this.gb=0;this.output=null;this.Mc=this.R=this.vb=0;this.msg="";this.state=null;this.uc=2;this.K=0};var il=Object.prototype.toString;
function jl(a){if(!(this instanceof jl))return new jl(a);a=this.options=O.assign({level:-1,method:8,chunkSize:16384,windowBits:15,memLevel:8,strategy:0,to:""},a||{});a.raw&&a.windowBits>0?a.windowBits=-a.windowBits:a.gzip&&a.windowBits>0&&a.windowBits<16&&(a.windowBits+=16);this.err=0;this.msg="";this.ended=!1;this.chunks=[];this.M=new hl;this.M.R=0;var b=this.M;var c=a.level,d=a.method,e=a.windowBits,f=a.memLevel,g=a.strategy;if(b){var h=1;c===-1&&(c=6);e<0?(h=0,e=-e):e>15&&(h=2,e-=16);if(f<1||f>
9||d!==8||e<8||e>15||c<0||c>9||g<0||g>4)b=Tk(b,-2);else{e===8&&(e=9);var k=new fl;b.state=k;k.M=b;k.wrap=h;k.J=null;k.Oc=e;k.ma=1<<k.Oc;k.Xa=k.ma-1;k.xc=f+7;k.ec=1<<k.xc;k.Ma=k.ec-1;k.Na=~~((k.xc+3-1)/3);k.window=new O.jb(k.ma*2);k.head=new O.Ja(k.ec);k.Ia=new O.Ja(k.ma);k.Jb=1<<f+6;k.Ba=k.Jb*4;k.aa=new O.jb(k.Ba);k.Eb=1*k.Jb;k.zc=3*k.Jb;k.level=c;k.strategy=g;k.method=d;if(b&&b.state){b.ib=b.Mc=0;b.uc=2;c=b.state;c.pending=0;c.Mb=0;c.wrap<0&&(c.wrap=-c.wrap);c.status=c.wrap?42:113;b.K=c.wrap===2?
0:1;c.rb=0;if(!Rk){d=Array(16);for(f=g=0;f<28;f++)for(vk[f]=g,e=0;e<1<<nk[f];e++)uk[g++]=f;uk[g-1]=f;for(f=g=0;f<16;f++)for(wk[f]=g,e=0;e<1<<ok[f];e++)tk[g++]=f;for(g>>=7;f<30;f++)for(wk[f]=g<<7,e=0;e<1<<ok[f]-7;e++)tk[256+g++]=f;for(e=0;e<=15;e++)d[e]=0;for(e=0;e<=143;)rk[e*2+1]=8,e++,d[8]++;for(;e<=255;)rk[e*2+1]=9,e++,d[9]++;for(;e<=279;)rk[e*2+1]=7,e++,d[7]++;for(;e<=287;)rk[e*2+1]=8,e++,d[8]++;Gk(rk,287,d);for(e=0;e<30;e++)sk[e*2+1]=5,sk[e*2]=Fk(e,5);yk=new xk(rk,nk,257,286,15);zk=new xk(sk,
ok,0,30,15);Ak=new xk([],pk,0,19,7);Rk=!0}c.fc=new Bk(c.sa,yk);c.Zb=new Bk(c.ab,zk);c.Rc=new Bk(c.ka,Ak);c.oa=0;c.ja=0;Hk(c);c=0}else c=Tk(b,-2);c===0&&(b=b.state,b.Dd=2*b.ma,Uk(b.head),b.Bc=el[b.level].se,b.bd=el[b.level].ce,b.kd=el[b.level].we,b.jd=el[b.level].re,b.v=0,b.va=0,b.B=0,b.ta=0,b.S=b.xa=2,b.eb=0,b.P=0);b=c}}else b=-2;if(b!==0)throw Error(lk[b]);a.header&&(b=this.M)&&b.state&&b.state.wrap===2&&(b.state.J=a.header);if(a.dictionary){var l;typeof a.dictionary==="string"?l=ek(a.dictionary):
il.call(a.dictionary)==="[object ArrayBuffer]"?l=new Uint8Array(a.dictionary):l=a.dictionary;a=this.M;f=l;g=f.length;if(a&&a.state)if(l=a.state,b=l.wrap,b===2||b===1&&l.status!==42||l.B)b=-2;else{b===1&&(a.K=fk(a.K,f,g,0));l.wrap=0;g>=l.ma&&(b===0&&(Uk(l.head),l.v=0,l.va=0,l.ta=0),c=new O.jb(l.ma),O.mb(c,f,g-l.ma,l.ma,0),f=c,g=l.ma);c=a.na;d=a.gb;e=a.input;a.na=g;a.gb=0;a.input=f;for(Zk(l);l.B>=3;){f=l.v;g=l.B-2;do l.P=(l.P<<l.Na^l.window[f+3-1])&l.Ma,l.Ia[f&l.Xa]=l.head[l.P],l.head[l.P]=f,f++;while(--g);
l.v=f;l.B=2;Zk(l)}l.v+=l.B;l.va=l.v;l.ta=l.B;l.B=0;l.S=l.xa=2;l.eb=0;a.gb=d;a.input=e;a.na=c;l.wrap=b;b=0}else b=-2;if(b!==0)throw Error(lk[b]);this.Lg=!0}}
jl.prototype.push=function(a,b){var c=this.M,d=this.options.chunkSize;if(this.ended)return!1;var e=b===~~b?b:b===!0?4:0;typeof a==="string"?c.input=ek(a):il.call(a)==="[object ArrayBuffer]"?c.input=new Uint8Array(a):c.input=a;c.gb=0;c.na=c.input.length;do{c.R===0&&(c.output=new O.jb(d),c.vb=0,c.R=d);a=gl(c,e);if(a!==1&&a!==0)return kl(this,a),this.ended=!0,!1;if(c.R===0||c.na===0&&(e===4||e===2))if(this.options.to==="string"){var f=O.Lc(c.output,c.vb);b=f;f=f.length;if(f<65537&&(b.subarray&&dk||!b.subarray))b=
String.fromCharCode.apply(null,O.Lc(b,f));else{for(var g="",h=0;h<f;h++)g+=String.fromCharCode(b[h]);b=g}this.chunks.push(b)}else b=O.Lc(c.output,c.vb),this.chunks.push(b)}while((c.na>0||c.R===0)&&a!==1);if(e===4)return(c=this.M)&&c.state?(d=c.state.status,d!==42&&d!==69&&d!==73&&d!==91&&d!==103&&d!==113&&d!==666?a=Tk(c,-2):(c.state=null,a=d===113?Tk(c,-3):0)):a=-2,kl(this,a),this.ended=!0,a===0;e===2&&(kl(this,0),c.R=0);return!0};
function kl(a,b){b===0&&(a.result=a.options.to==="string"?a.chunks.join(""):O.Yc(a.chunks));a.chunks=[];a.err=b;a.msg=a.M.msg}
function ll(a,b){b=b||{};b.gzip=!0;b=new jl(b);b.push(a,!0);if(b.err)throw b.msg||lk[b.err];return b.result}
;function ml(a){if(!a)return null;a=a.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue;var b;a?b=kb(a):b=null;return b}
;function nl(a){return kb(a===null?"null":a===void 0?"undefined":a)}
;function ol(a){this.name=a}
;var pl=new ol("rawColdConfigGroup");var ql=new ol("rawHotConfigGroup");function rl(a){this.H=J(a)}
x(rl,K);var sl=new ol("continuationCommand");var tl=new ol("webCommandMetadata");var ul=new ol("signalServiceEndpoint");var vl={Bf:"EMBEDDED_PLAYER_MODE_UNKNOWN",yf:"EMBEDDED_PLAYER_MODE_DEFAULT",Af:"EMBEDDED_PLAYER_MODE_PFP",zf:"EMBEDDED_PLAYER_MODE_PFL"};var wl=new ol("feedbackEndpoint");function xl(a){this.H=J(a)}
x(xl,K);xl.prototype.setTrackingParams=function(a){if(a!=null)if(typeof a==="string")a=a?new qd(a,nd):od||(od=new qd(null,nd));else if(a.constructor!==qd)if(md(a))a=a.length?new qd(new Uint8Array(a),nd):od||(od=new qd(null,nd));else throw Error();return af(this,1,a)};var Wd={qg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_UNKNOWN",Pf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_FOR_TESTING",fg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_RESUME_TO_HOME_TTL",jg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_START_TO_SHORTS_ANALYSIS_SLICE",Mf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_DEVICE_LAYER_SLICE",pg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_UNIFIED_LAYER_SLICE",rg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_VISITOR_LAYER_SLICE",ig:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_SHOW_SHEET_COMMAND_HANDLER_BLOCK",
tg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_WIZ_NEXT_MIGRATED_COMPONENT",sg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_WIZ_NEXT_CHANNEL_NAME_TOOLTIP",gg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_ROTATION_LOCK_SUPPORTED",lg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_THEATER_MODE_ENABLED",xg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_WOULD_SHOW_PIN_SUGGESTION",wg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_WOULD_SHOW_LONG_PRESS_EDU_TOAST",vg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_WOULD_SHOW_AMBIENT",mg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_TIME_WATCHED_PANEL",
hg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_SEARCH_FROM_SEARCH_BAR_OVERLAY",yg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_WOULD_SHOW_VOICE_SEARCH_EDU_TOAST",kg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_SUGGESTED_LANGUAGE_SELECTED",zg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_WOULD_TRIGGER_SHORTS_PIP",Uf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_IN_ZP_VOICE_CRASHY_SET",ag:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_REEL_FAST_SWIPE_SUPPRESSED",Zf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_REEL_FAST_SWIPE_ALLOWED",dg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_REEL_PULL_TO_REFRESH_ATTEMPT",
ug:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_WOULD_BLOCK_KABUKI",eg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_REEL_TALL_SCREEN",cg:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_REEL_NORMAL_SCREEN",Ff:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_ACCESSIBILITY_MODE_ENABLED",Ef:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_ACCESSIBILITY_MODE_DISABLED",Gf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_AUTOPLAY_ENABLED",Hf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_CAST_MATCH_OCCURRED",Nf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_EMC3DS_ELIGIBLE",Of:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_ENDSCREEN_TRIGGERED",
Yf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_POSTPLAY_TRIGGERED",Xf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_POSTPLAY_LACT_THRESHOLD_EXCEEDED",Qf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_IDENTITIES_STATE_MATCHED_ON_REMOTE_CONNECTION",Sf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_IDENTITIES_STATE_SWITCHABLE_ON_REMOTE_CONNECTION",Rf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_IDENTITIES_STATE_MISATTRIBUTED_ON_REMOTE_CONNECTION",Tf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_IDENTITIES_TV_IS_SIGNED_IN_ON_REMOTE_CONNECTION",ng:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_TV_START_TYPE_COLD_ON_REMOTE_CONNECTION",
og:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_TV_START_TYPE_NON_COLD_ON_REMOTE_CONNECTION",Wf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_ON_REMOTE_CONNECTION",Lf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_COBALT_PERSISTENT_SETTINGS_TEST_VALID",Jf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_COBALT_PERSISTENT_SETTINGS_TEST_INVALID",Kf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_COBALT_PERSISTENT_SETTINGS_TEST_UNDEFINED",If:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_COBALT_PERSISTENT_SETTINGS_TEST_DEFINED",Vf:"GENERIC_CLIENT_EXPERIMENT_EVENT_TYPE_LACT_THRESHOLD_EXCEEDED"};var yl=new ol("shareEndpoint"),zl=new ol("shareEntityEndpoint"),Al=new ol("shareEntityServiceEndpoint"),Bl=new ol("webPlayerShareEntityServiceEndpoint");var Cl=new ol("playlistEditEndpoint");var Dl=new ol("modifyChannelNotificationPreferenceEndpoint");var El=new ol("unsubscribeEndpoint");var Fl=new ol("subscribeEndpoint");function Gl(){var a=Hl;E("yt.ads.biscotti.getId_")||D("yt.ads.biscotti.getId_",a)}
function Il(a){D("yt.ads.biscotti.lastId_",a)}
;function Jl(a,b){b.length>1?a[b[0]]=b[1]:b.length===1&&Object.assign(a,b[0])}
;var Kl=C.window,Ll,Ml,Nl=(Kl==null?void 0:(Ll=Kl.yt)==null?void 0:Ll.config_)||(Kl==null?void 0:(Ml=Kl.ytcfg)==null?void 0:Ml.data_)||{};D("yt.config_",Nl);function Ol(){Jl(Nl,arguments)}
function R(a,b){return a in Nl?Nl[a]:b}
function Pl(a){var b=Nl.EXPERIMENT_FLAGS;return b?b[a]:void 0}
;var Ql=[];function Rl(a){Ql.forEach(function(b){return b(a)})}
function Sl(a){return a&&window.yterr?function(){try{return a.apply(this,arguments)}catch(b){Tl(b)}}:a}
function Tl(a){var b=E("yt.logging.errors.log");b?b(a,"ERROR",void 0,void 0,void 0,void 0,void 0):(b=R("ERRORS",[]),b.push([a,"ERROR",void 0,void 0,void 0,void 0,void 0]),Ol("ERRORS",b));Rl(a)}
function Ul(a,b,c,d,e){var f=E("yt.logging.errors.log");f?f(a,"WARNING",b,c,d,void 0,e):(f=R("ERRORS",[]),f.push([a,"WARNING",b,c,d,void 0,e]),Ol("ERRORS",f))}
;var Vl=/^[\w.]*$/,Wl={q:!0,search_query:!0};function Xl(a,b){b=a.split(b);for(var c={},d=0,e=b.length;d<e;d++){var f=b[d].split("=");if(f.length===1&&f[0]||f.length===2)try{var g=Yl(f[0]||""),h=Yl(f[1]||"");if(g in c){var k=c[g];Array.isArray(k)?Sb(k,h):c[g]=[k,h]}else c[g]=h}catch(r){var l=r,m=f[0],n=String(Xl);l.args=[{key:m,value:f[1],query:a,method:Zl===n?"unchanged":n}];Wl.hasOwnProperty(m)||Ul(l)}}return c}
var Zl=String(Xl);function $l(a){var b=[];ng(a,function(c,d){var e=encodeURIComponent(String(d));c=Array.isArray(c)?c:[c];Mb(c,function(f){f==""?b.push(e):b.push(e+"="+encodeURIComponent(String(f)))})});
return b.join("&")}
function am(a){a.charAt(0)==="?"&&(a=a.substring(1));return Xl(a,"&")}
function bm(a){return a.indexOf("?")!==-1?(a=(a||"").split("#")[0],a=a.split("?",2),am(a.length>1?a[1]:a[0])):{}}
function cm(a,b,c){var d=a.split("#",2);a=d[0];d=d.length>1?"#"+d[1]:"";var e=a.split("?",2);a=e[0];e=am(e[1]||"");for(var f in b)!c&&e!==null&&f in e||(e[f]=b[f]);return hc(a,e)+d}
function dm(a){if(!b)var b=window.location.href;var c=ac(1,a),d=bc(a);c&&d?(a=a.match(Zb),b=b.match(Zb),a=a[3]==b[3]&&a[1]==b[1]&&a[4]==b[4]):a=d?bc(b)===d&&(Number(ac(4,b))||null)===(Number(ac(4,a))||null):!0;return a}
function Yl(a){return a&&a.match(Vl)?a:decodeURIComponent(a.replace(/\+/g," "))}
;function em(a){var b=fm;a=a===void 0?E("yt.ads.biscotti.lastId_")||"":a;var c=Object,d=c.assign,e={};e.dt=tj;e.flash="0";a:{try{var f=b.h.top.location.href}catch(Ka){f=2;break a}f=f?f===b.i.location.href?0:1:2}e=(e.frm=f,e);try{e.u_tz=-(new Date).getTimezoneOffset();var g=g===void 0?lj:g;try{var h=g.history.length}catch(Ka){h=0}e.u_his=h;var k;e.u_h=(k=lj.screen)==null?void 0:k.height;var l;e.u_w=(l=lj.screen)==null?void 0:l.width;var m;e.u_ah=(m=lj.screen)==null?void 0:m.availHeight;var n;e.u_aw=
(n=lj.screen)==null?void 0:n.availWidth;var r;e.u_cd=(r=lj.screen)==null?void 0:r.colorDepth}catch(Ka){}h=b.h;try{var t=h.screenX;var w=h.screenY}catch(Ka){}try{var y=h.outerWidth;var z=h.outerHeight}catch(Ka){}try{var G=h.innerWidth;var I=h.innerHeight}catch(Ka){}try{var N=h.screenLeft;var S=h.screenTop}catch(Ka){}try{G=h.innerWidth,I=h.innerHeight}catch(Ka){}try{var ta=h.screen.availWidth;var lb=h.screen.availTop}catch(Ka){}t=[N,S,t,w,ta,lb,y,z,G,I];try{var T=(b.h.top||window).document,ua=T.compatMode==
"CSS1Compat"?T.documentElement:T.body;var La=(new zg(ua.clientWidth,ua.clientHeight)).round()}catch(Ka){La=new zg(-12245933,-12245933)}T=La;La={};var Ma=Ma===void 0?C:Ma;ua=new zj;"SVGElement"in Ma&&"createElementNS"in Ma.document&&ua.set(0);w=qj();w["allow-top-navigation-by-user-activation"]&&ua.set(1);w["allow-popups-to-escape-sandbox"]&&ua.set(2);Ma.crypto&&Ma.crypto.subtle&&ua.set(3);"TextDecoder"in Ma&&"TextEncoder"in Ma&&ua.set(4);Ma=Aj(ua);La.bc=Ma;La.bih=T.height;La.biw=T.width;La.brdim=t.join();
b=b.i;b=(La.vis=b.prerendering?3:{visible:1,hidden:2,prerender:3,preview:4,unloaded:5}[b.visibilityState||b.webkitVisibilityState||b.mozVisibilityState||""]||0,La.wgl=!!lj.WebGLRenderingContext,La);c=d.call(c,e,b);c.ca_type="image";a&&(c.bid=a);return c}
var fm=new function(){var a=window.document;this.h=window;this.i=a};
D("yt.ads_.signals_.getAdSignalsString",function(a){return $l(em(a))});Ya();navigator.userAgent.indexOf(" (CrKey ");var gm="XMLHttpRequest"in C?function(){return new XMLHttpRequest}:null;
function hm(){if(!gm)return null;var a=gm();return"open"in a?a:null}
function im(a){switch(a&&"status"in a?a.status:-1){case 200:case 201:case 202:case 203:case 204:case 205:case 206:case 304:return!0;default:return!1}}
;function jm(a,b){typeof a==="function"&&(a=Sl(a));return window.setTimeout(a,b)}
;var km="client_dev_domain client_dev_expflag client_dev_regex_map client_dev_root_url client_rollout_override expflag forcedCapability jsfeat jsmode mods".split(" ");[].concat(ja(km),["client_dev_set_cookie"]);function U(a){a=lm(a);return typeof a==="string"&&a==="false"?!1:!!a}
function mm(a,b){a=lm(a);return a===void 0&&b!==void 0?b:Number(a||0)}
function lm(a){return R("EXPERIMENT_FLAGS",{})[a]}
function nm(){for(var a=[],b=R("EXPERIMENTS_FORCED_FLAGS",{}),c=v(Object.keys(b)),d=c.next();!d.done;d=c.next())d=d.value,a.push({key:d,value:String(b[d])});c=R("EXPERIMENT_FLAGS",{});d=v(Object.keys(c));for(var e=d.next();!e.done;e=d.next())e=e.value,e.startsWith("force_")&&b[e]===void 0&&a.push({key:e,value:String(c[e])});return a}
;var om={Authorization:"AUTHORIZATION","X-Goog-EOM-Visitor-Id":"EOM_VISITOR_DATA","X-Goog-Visitor-Id":"SANDBOXED_VISITOR_ID","X-Youtube-Domain-Admin-State":"DOMAIN_ADMIN_STATE","X-Youtube-Chrome-Connected":"CHROME_CONNECTED_HEADER","X-YouTube-Client-Name":"INNERTUBE_CONTEXT_CLIENT_NAME","X-YouTube-Client-Version":"INNERTUBE_CONTEXT_CLIENT_VERSION","X-YouTube-Delegation-Context":"INNERTUBE_CONTEXT_SERIALIZED_DELEGATION_CONTEXT","X-YouTube-Device":"DEVICE","X-Youtube-Identity-Token":"ID_TOKEN","X-YouTube-Page-CL":"PAGE_CL",
"X-YouTube-Page-Label":"PAGE_BUILD_LABEL","X-YouTube-Variants-Checksum":"VARIANTS_CHECKSUM","X-Goog-AuthUser":"SESSION_INDEX","X-Goog-PageId":"DELEGATED_SESSION_ID"},pm="app debugcss debugjs expflag force_ad_params force_ad_encrypted force_viral_ad_response_params forced_experiments innertube_snapshots innertube_goldens internalcountrycode internalipoverride absolute_experiments conditional_experiments sbb sr_bns_address".split(" ").concat(ja(km)),qm=!1;
function rm(a,b,c,d,e,f,g,h){function k(){(l&&"readyState"in l?l.readyState:0)===4&&b&&Sl(b)(l)}
c=c===void 0?"GET":c;d=d===void 0?"":d;h=h===void 0?!1:h;var l=hm();if(!l)return null;"onloadend"in l?l.addEventListener("loadend",k,!1):l.onreadystatechange=k;U("debug_forward_web_query_parameters")&&(a=sm(a));l.open(c,a,!0);f&&(l.responseType=f);g&&(l.withCredentials=!0);c=c==="POST"&&(window.FormData===void 0||!(d instanceof FormData));if(e=tm(a,e))for(var m in e)l.setRequestHeader(m,e[m]),"content-type"===m.toLowerCase()&&(c=!1);c&&l.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
if(h&&"setAttributionReporting"in XMLHttpRequest.prototype){a={eventSourceEligible:!0,triggerEligible:!1};try{l.setAttributionReporting(a)}catch(n){Ul(n)}}l.send(d);return l}
function tm(a,b){b=b===void 0?{}:b;var c=dm(a),d=R("INNERTUBE_CLIENT_NAME"),e=U("web_ajax_ignore_global_headers_if_set"),f;for(f in om){var g=R(om[f]),h=f==="X-Goog-AuthUser"||f==="X-Goog-PageId";f!=="X-Goog-Visitor-Id"||g||(g=R("VISITOR_DATA"));var k;if(!(k=!g)){if(!(k=c||(bc(a)?!1:!0))){k=a;var l;if(l=U("add_auth_headers_to_remarketing_google_dot_com_ping")&&f==="Authorization"&&(d==="TVHTML5"||d==="TVHTML5_UNPLUGGED"||d==="TVHTML5_SIMPLY"))l=bc(k),l=l!==null?l.split(".").reverse():null,l=l===null?
!1:l[1]==="google"?!0:l[2]==="google"?l[0]==="au"&&l[1]==="com"?!0:l[0]==="uk"&&l[1]==="co"?!0:!1:!1;l&&(k=$b(ac(5,k))||"",k=k.split("/"),k="/"+(k.length>1?k[1]:""),l=k==="/pagead");k=l?!0:!1}k=!k}k||e&&b[f]!==void 0||d==="TVHTML5_UNPLUGGED"&&h||(b[f]=g)}"X-Goog-EOM-Visitor-Id"in b&&"X-Goog-Visitor-Id"in b&&delete b["X-Goog-Visitor-Id"];if(c||!bc(a))b["X-YouTube-Utc-Offset"]=String(-(new Date).getTimezoneOffset());if(c||!bc(a)){try{var m=(new Intl.DateTimeFormat).resolvedOptions().timeZone}catch(n){}m&&
(b["X-YouTube-Time-Zone"]=m)}document.location.hostname.endsWith("youtubeeducation.com")||!c&&bc(a)||(b["X-YouTube-Ad-Signals"]=$l(em()));return b}
function um(a,b){b.method="POST";b.postParams||(b.postParams={});return wm(a,b)}
function wm(a,b){var c=b.format||"JSON";a=xm(a,b);var d=ym(a,b),e=!1,f=zm(a,function(k){if(!e){e=!0;h&&window.clearTimeout(h);var l=im(k),m=null,n=400<=k.status&&k.status<500,r=500<=k.status&&k.status<600;if(l||n||r)m=Am(a,c,k,b.convertToSafeHtml);l&&(l=Bm(c,k,m));m=m||{};n=b.context||C;l?b.onSuccess&&b.onSuccess.call(n,k,m):b.onError&&b.onError.call(n,k,m);b.onFinish&&b.onFinish.call(n,k,m)}},b.method,d,b.headers,b.responseType,b.withCredentials);
d=b.timeout||0;if(b.onTimeout&&d>0){var g=b.onTimeout;var h=jm(function(){e||(e=!0,f.abort(),window.clearTimeout(h),g.call(b.context||C,f))},d)}return f}
function xm(a,b){b.includeDomain&&(a=document.location.protocol+"//"+document.location.hostname+(document.location.port?":"+document.location.port:"")+a);var c=R("XSRF_FIELD_NAME");if(b=b.urlParams)b[c]&&delete b[c],a=cm(a,b||{},!0);return a}
function ym(a,b){var c=R("XSRF_FIELD_NAME"),d=R("XSRF_TOKEN"),e=b.postBody||"",f=b.postParams,g=R("XSRF_FIELD_NAME"),h;b.headers&&(h=b.headers["Content-Type"]);b.excludeXsrf||bc(a)&&!b.withCredentials&&bc(a)!==document.location.hostname||b.method!=="POST"||h&&h!=="application/x-www-form-urlencoded"||b.postParams&&b.postParams[g]||(f||(f={}),f[c]=d);(U("ajax_parse_query_data_only_when_filled")&&f&&Object.keys(f).length>0||f)&&typeof e==="string"&&(e=am(e),xg(e,f),e=b.postBodyFormat&&b.postBodyFormat===
"JSON"?JSON.stringify(e):fc(e));f=e||f&&!qg(f);!qm&&f&&b.method!=="POST"&&(qm=!0,Tl(Error("AJAX request with postData should use POST")));return e}
function Am(a,b,c,d){var e=null;switch(b){case "JSON":try{var f=c.responseText}catch(g){throw d=Error("Error reading responseText"),d.params=a,Ul(d),g;}a=c.getResponseHeader("Content-Type")||"";f&&a.indexOf("json")>=0&&(f.substring(0,5)===")]}'\n"&&(f=f.substring(5)),e=JSON.parse(f));break;case "XML":if(a=(a=c.responseXML)?Cm(a):null)e={},Mb(a.getElementsByTagName("*"),function(g){e[g.tagName]=Dm(g)})}d&&Em(e);
return e}
function Em(a){if(Qa(a))for(var b in a){var c;(c=b==="html_content")||(c=b.length-5,c=c>=0&&b.indexOf("_html",c)==c);if(c){c=b;var d=a[b];var e=eb();d=new Bb(e?e.createHTML(d):d);a[c]=d}else Em(a[b])}}
function Bm(a,b,c){if(b&&b.status===204)return!0;switch(a){case "JSON":return!!c;case "XML":return Number(c&&c.return_code)===0;case "RAW":return!0;default:return!!c}}
function Cm(a){return a?(a=("responseXML"in a?a.responseXML:a).getElementsByTagName("root"))&&a.length>0?a[0]:null:null}
function Dm(a){var b="";Mb(a.childNodes,function(c){b+=c.nodeValue});
return b}
function sm(a){var b=window.location.search,c=bc(a);U("debug_handle_relative_url_for_query_forward_killswitch")||!c&&dm(a)&&(c=document.location.hostname);var d=$b(ac(5,a));d=(c=c&&(c.endsWith("youtube.com")||c.endsWith("youtube-nocookie.com")))&&d&&d.startsWith("/api/");if(!c||d)return a;var e=am(b),f={};Mb(pm,function(g){e[g]&&(f[g]=e[g])});
return cm(a,f||{},!1)}
var zm=rm;var Fm=[{Cc:function(a){return"Cannot read property '"+a.key+"'"},
hc:{Error:[{regexp:/(Permission denied) to access property "([^']+)"/,groups:["reason","key"]}],TypeError:[{regexp:/Cannot read property '([^']+)' of (null|undefined)/,groups:["key","value"]},{regexp:/\u65e0\u6cd5\u83b7\u53d6\u672a\u5b9a\u4e49\u6216 (null|undefined) \u5f15\u7528\u7684\u5c5e\u6027\u201c([^\u201d]+)\u201d/,groups:["value","key"]},{regexp:/\uc815\uc758\ub418\uc9c0 \uc54a\uc74c \ub610\ub294 (null|undefined) \ucc38\uc870\uc778 '([^']+)' \uc18d\uc131\uc744 \uac00\uc838\uc62c \uc218 \uc5c6\uc2b5\ub2c8\ub2e4./,
groups:["value","key"]},{regexp:/No se puede obtener la propiedad '([^']+)' de referencia nula o sin definir/,groups:["key"]},{regexp:/Unable to get property '([^']+)' of (undefined or null) reference/,groups:["key","value"]},{regexp:/(null) is not an object \(evaluating '(?:([^.]+)\.)?([^']+)'\)/,groups:["value","base","key"]}]}},{Cc:function(a){return"Cannot call '"+a.key+"'"},
hc:{TypeError:[{regexp:/(?:([^ ]+)?\.)?([^ ]+) is not a function/,groups:["base","key"]},{regexp:/([^ ]+) called on (null or undefined)/,groups:["key","value"]},{regexp:/Object (.*) has no method '([^ ]+)'/,groups:["base","key"]},{regexp:/Object doesn't support property or method '([^ ]+)'/,groups:["key"]},{regexp:/\u30aa\u30d6\u30b8\u30a7\u30af\u30c8\u306f '([^']+)' \u30d7\u30ed\u30d1\u30c6\u30a3\u307e\u305f\u306f\u30e1\u30bd\u30c3\u30c9\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u305b\u3093/,
groups:["key"]},{regexp:/\uac1c\uccb4\uac00 '([^']+)' \uc18d\uc131\uc774\ub098 \uba54\uc11c\ub4dc\ub97c \uc9c0\uc6d0\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4./,groups:["key"]}]}},{Cc:function(a){return a.key+" is not defined"},
hc:{ReferenceError:[{regexp:/(.*) is not defined/,groups:["key"]},{regexp:/Can't find variable: (.*)/,groups:["key"]}]}}];var Hm={Va:[],Sa:[{callback:Gm,weight:500}]};function Gm(a){if(a.name==="JavaException")return!0;a=a.stack;return a.includes("chrome://")||a.includes("chrome-extension://")||a.includes("moz-extension://")}
;function Im(){this.Sa=[];this.Va=[]}
var Jm;function Km(){if(!Jm){var a=Jm=new Im;a.Va.length=0;a.Sa.length=0;Hm.Va&&a.Va.push.apply(a.Va,Hm.Va);Hm.Sa&&a.Sa.push.apply(a.Sa,Hm.Sa)}return Jm}
;var Lm=new M;function Mm(a){function b(){return a.charCodeAt(d++)}
var c=a.length,d=0;do{var e=Nm(b);if(e===Infinity)break;var f=e>>3;switch(e&7){case 0:e=Nm(b);if(f===2)return e;break;case 1:if(f===2)return;d+=8;break;case 2:e=Nm(b);if(f===2)return a.substr(d,e);d+=e;break;case 5:if(f===2)return;d+=4;break;default:return}}while(d<c)}
function Nm(a){var b=a(),c=b&127;if(b<128)return c;b=a();c|=(b&127)<<7;if(b<128)return c;b=a();c|=(b&127)<<14;if(b<128)return c;b=a();return b<128?c|(b&127)<<21:Infinity}
;function Om(a,b,c,d){if(a)if(Array.isArray(a)){var e=d;for(d=0;d<a.length&&!(a[d]&&(e+=Pm(d,a[d],b,c),e>500));d++);d=e}else if(typeof a==="object")for(e in a){if(a[e]){var f=e;var g=a[e],h=b,k=c;f=typeof g!=="string"||f!=="clickTrackingParams"&&f!=="trackingParams"?0:(g=Mm(atob(g.replace(/-/g,"+").replace(/_/g,"/"))))?Pm(f+".ve",g,h,k):0;d+=f;d+=Pm(e,a[e],b,c);if(d>500)break}}else c[b]=Qm(a),d+=c[b].length;else c[b]=Qm(a),d+=c[b].length;return d}
function Pm(a,b,c,d){c+="."+a;a=Qm(b);d[c]=a;return c.length+a.length}
function Qm(a){try{return(typeof a==="string"?a:String(JSON.stringify(a))).substr(0,500)}catch(b){return"unable to serialize "+typeof a+" ("+b.message+")"}}
;function Rm(a){var b=this;this.i=void 0;this.h=!1;a.addEventListener("beforeinstallprompt",function(c){c.preventDefault();b.i=c});
a.addEventListener("appinstalled",function(){b.h=!0},{once:!0})}
function Sm(){if(!C.matchMedia)return"WEB_DISPLAY_MODE_UNKNOWN";try{return C.matchMedia("(display-mode: standalone)").matches?"WEB_DISPLAY_MODE_STANDALONE":C.matchMedia("(display-mode: minimal-ui)").matches?"WEB_DISPLAY_MODE_MINIMAL_UI":C.matchMedia("(display-mode: fullscreen)").matches?"WEB_DISPLAY_MODE_FULLSCREEN":C.matchMedia("(display-mode: browser)").matches?"WEB_DISPLAY_MODE_BROWSER":"WEB_DISPLAY_MODE_UNKNOWN"}catch(a){return"WEB_DISPLAY_MODE_UNKNOWN"}}
;function Tm(){this.af=!0}
function Um(){Tm.h||(Tm.h=new Tm);return Tm.h}
function Vm(a,b){a={};var c=[],d=U("enable_first_party_auth_v2")||(b==null?void 0:b.dd)&&U("enable_first_party_auth_v2_on_get_account_menu");"USER_SESSION_ID"in Nl&&d&&c.push({key:"u",value:R("USER_SESSION_ID")});if(c=fg(c))a.Authorization=c,c=b=b==null?void 0:b.sessionIndex,c===void 0&&(c=Number(R("SESSION_INDEX",0)),c=isNaN(c)?0:c),U("voice_search_auth_header_removal")||(a["X-Goog-AuthUser"]=c.toString()),"INNERTUBE_HOST_OVERRIDE"in Nl||(a["X-Origin"]=window.location.origin),b===void 0&&"DELEGATED_SESSION_ID"in
Nl&&(a["X-Goog-PageId"]=R("DELEGATED_SESSION_ID"));return a}
;var Wm={identityType:"UNAUTHENTICATED_IDENTITY_TYPE_UNKNOWN"};function Xm(a,b,c,d,e){bg.set(""+a,b,{Lb:c,path:"/",domain:d===void 0?"youtube.com":d,secure:e===void 0?!1:e})}
function Ym(a){return bg.get(""+a,void 0)}
function Zm(a,b,c){bg.remove(""+a,b===void 0?"/":b,c===void 0?"youtube.com":c)}
function $m(){if(U("embeds_web_enable_cookie_detection_fix")){if(!C.navigator.cookieEnabled)return!1}else if(!bg.isEnabled())return!1;if(bg.h.cookie)return!0;U("embeds_web_enable_cookie_detection_fix")?bg.set("TESTCOOKIESENABLED","1",{Lb:60,Je:"none",secure:!0}):bg.set("TESTCOOKIESENABLED","1",{Lb:60});if(bg.get("TESTCOOKIESENABLED")!=="1")return!1;bg.remove("TESTCOOKIESENABLED");return!0}
;var an=E("ytglobal.prefsUserPrefsPrefs_")||{};D("ytglobal.prefsUserPrefsPrefs_",an);function bn(){this.h=R("ALT_PREF_COOKIE_NAME","PREF");this.i=R("ALT_PREF_COOKIE_DOMAIN","youtube.com");var a=Ym(this.h);a&&this.parse(a)}
var cn;function dn(){cn||(cn=new bn);return cn}
p=bn.prototype;p.get=function(a,b){en(a);fn(a);a=an[a]!==void 0?an[a].toString():null;return a!=null?a:b?b:""};
p.set=function(a,b){en(a);fn(a);if(b==null)throw Error("ExpectedNotNull");an[a]=b.toString()};
function gn(a){return!!((hn("f"+(Math.floor(a/31)+1))||0)&1<<a%31)}
p.remove=function(a){en(a);fn(a);delete an[a]};
p.clear=function(){for(var a in an)delete an[a]};
function fn(a){if(/^f([1-9][0-9]*)$/.test(a))throw Error("ExpectedRegexMatch: "+a);}
function en(a){if(!/^\w+$/.test(a))throw Error("ExpectedRegexMismatch: "+a);}
function hn(a){a=an[a]!==void 0?an[a].toString():null;return a!=null&&/^[A-Fa-f0-9]+$/.test(a)?parseInt(a,16):null}
p.parse=function(a){a=decodeURIComponent(a).split("&");for(var b=0;b<a.length;b++){var c=a[b].split("="),d=c[0];(c=c[1])&&(an[d]=c.toString())}};var jn={bluetooth:"CONN_DISCO",cellular:"CONN_CELLULAR_UNKNOWN",ethernet:"CONN_WIFI",none:"CONN_NONE",wifi:"CONN_WIFI",wimax:"CONN_CELLULAR_4G",other:"CONN_UNKNOWN",unknown:"CONN_UNKNOWN","slow-2g":"CONN_CELLULAR_2G","2g":"CONN_CELLULAR_2G","3g":"CONN_CELLULAR_3G","4g":"CONN_CELLULAR_4G"},kn={"slow-2g":"EFFECTIVE_CONNECTION_TYPE_SLOW_2G","2g":"EFFECTIVE_CONNECTION_TYPE_2G","3g":"EFFECTIVE_CONNECTION_TYPE_3G","4g":"EFFECTIVE_CONNECTION_TYPE_4G"};
function ln(){var a=C.navigator;return a?a.connection:void 0}
function mn(){var a=ln();if(a){var b=jn[a.type||"unknown"]||"CONN_UNKNOWN";a=jn[a.effectiveType||"unknown"]||"CONN_UNKNOWN";b==="CONN_CELLULAR_UNKNOWN"&&a!=="CONN_UNKNOWN"&&(b=a);if(b!=="CONN_UNKNOWN")return b;if(a!=="CONN_UNKNOWN")return a}}
function nn(){var a=ln();if(a!=null&&a.effectiveType)return kn.hasOwnProperty(a.effectiveType)?kn[a.effectiveType]:"EFFECTIVE_CONNECTION_TYPE_UNKNOWN"}
;function V(a){var b=B.apply(1,arguments);var c=Error.call(this,a);this.message=c.message;"stack"in c&&(this.stack=c.stack);this.args=[].concat(ja(b))}
x(V,Error);function on(){try{return pn(),!0}catch(a){return!1}}
function pn(a){if(R("DATASYNC_ID")!==void 0)return R("DATASYNC_ID");throw new V("Datasync ID not set",a===void 0?"unknown":a);}
;function qn(){}
function rn(a,b){return yj.Za(a,0,b)}
qn.prototype.qa=function(a,b){return this.Za(a,1,b)};
qn.prototype.Bb=function(a){var b=E("yt.scheduler.instance.addImmediateJob");b?b(a):a()};var sn=mm("web_emulated_idle_callback_delay",300),tn=1E3/60-3,un=[8,5,4,3,2,1,0];
function vn(a){a=a===void 0?{}:a;L.call(this);this.i=[];this.j={};this.X=this.h=0;this.W=this.u=!1;this.I=[];this.T=this.ga=!1;for(var b=v(un),c=b.next();!c.done;c=b.next())this.i[c.value]=[];this.o=0;this.sc=a.timeout||1;this.G=tn;this.A=0;this.pa=this.ye.bind(this);this.qc=this.df.bind(this);this.Ka=this.Jd.bind(this);this.Ya=this.de.bind(this);this.Sb=this.Ce.bind(this);this.ya=!!window.requestIdleCallback&&!!window.cancelIdleCallback&&!U("disable_scheduler_requestIdleCallback");(this.ia=a.useRaf!==
!1&&!!window.requestAnimationFrame)&&document.addEventListener("visibilitychange",this.pa)}
x(vn,L);p=vn.prototype;p.Bb=function(a){var b=Ya();wn(this,a);a=Ya()-b;this.u||(this.G-=a)};
p.Za=function(a,b,c){++this.X;if(b===10)return this.Bb(a),this.X;var d=this.X;this.j[d]=a;this.u&&!c?this.I.push({id:d,priority:b}):(this.i[b].push(d),this.W||this.u||(this.h!==0&&xn(this)!==this.A&&this.stop(),this.start()));return d};
p.ra=function(a){delete this.j[a]};
function yn(a){a.I.length=0;for(var b=5;b>=0;b--)a.i[b].length=0;a.i[8].length=0;a.j={};a.stop()}
p.isHidden=function(){return!!document.hidden||!1};
function zn(a){return!a.isHidden()&&a.ia}
function xn(a){if(a.i[8].length){if(a.T)return 4;if(zn(a))return 3}for(var b=5;b>=a.o;b--)if(a.i[b].length>0)return b>0?zn(a)?3:2:1;return 0}
p.Ha=function(a){var b=E("yt.logging.errors.log");b&&b(a)};
function wn(a,b){try{b()}catch(c){a.Ha(c)}}
function An(a){for(var b=v(un),c=b.next();!c.done;c=b.next())if(a.i[c.value].length)return!0;return!1}
p.de=function(a){var b=void 0;a&&(b=a.timeRemaining());this.ga=!0;Bn(this,b);this.ga=!1};
p.df=function(){Bn(this)};
p.Jd=function(){Cn(this)};
p.Ce=function(a){this.T=!0;var b=xn(this);b===4&&b!==this.A&&(this.stop(),this.start());Bn(this,void 0,a);this.T=!1};
p.ye=function(){this.isHidden()||Cn(this);this.h&&(this.stop(),this.start())};
function Cn(a){a.stop();a.u=!0;for(var b=Ya(),c=a.i[8];c.length;){var d=c.shift(),e=a.j[d];delete a.j[d];e&&wn(a,e)}Dn(a);a.u=!1;An(a)&&a.start();b=Ya()-b;a.G-=b}
function Dn(a){for(var b=0,c=a.I.length;b<c;b++){var d=a.I[b];a.i[d.priority].push(d.id)}a.I.length=0}
function Bn(a,b,c){a.T&&a.A===4&&a.h||a.stop();a.u=!0;b=Ya()+(b||a.G);for(var d=a.i[5];d.length;){var e=d.shift(),f=a.j[e];delete a.j[e];if(f){e=a;try{f(c)}catch(l){e.Ha(l)}}}for(d=a.i[4];d.length;)c=d.shift(),f=a.j[c],delete a.j[c],f&&wn(a,f);d=a.ga?0:1;d=a.o>d?a.o:d;if(!(Ya()>=b)){do{a:{c=a;f=d;for(e=3;e>=f;e--)for(var g=c.i[e];g.length;){var h=g.shift(),k=c.j[h];delete c.j[h];if(k){c=k;break a}}c=null}c&&wn(a,c)}while(c&&Ya()<b)}a.u=!1;Dn(a);a.G=tn;An(a)&&a.start()}
p.start=function(){this.W=!1;if(this.h===0)switch(this.A=xn(this),this.A){case 1:var a=this.Ya;this.h=this.ya?window.requestIdleCallback(a,{timeout:3E3}):window.setTimeout(a,sn);break;case 2:this.h=window.setTimeout(this.qc,this.sc);break;case 3:this.h=window.requestAnimationFrame(this.Sb);break;case 4:this.h=window.setTimeout(this.Ka,0)}};
p.pause=function(){this.stop();this.W=!0};
p.stop=function(){if(this.h){switch(this.A){case 1:var a=this.h;this.ya?window.cancelIdleCallback(a):window.clearTimeout(a);break;case 2:case 4:window.clearTimeout(this.h);break;case 3:window.cancelAnimationFrame(this.h)}this.h=0}};
p.ba=function(){yn(this);this.stop();this.ia&&document.removeEventListener("visibilitychange",this.pa);L.prototype.ba.call(this)};var En=E("yt.scheduler.instance.timerIdMap_")||{},Fn=mm("kevlar_tuner_scheduler_soft_state_timer_ms",800),Gn=0,Hn=0;function In(){var a=E("ytglobal.schedulerInstanceInstance_");if(!a||a.ea)a=new vn(R("scheduler")||{}),D("ytglobal.schedulerInstanceInstance_",a);return a}
function Jn(){Kn();var a=E("ytglobal.schedulerInstanceInstance_");a&&(gg(a),D("ytglobal.schedulerInstanceInstance_",null))}
function Kn(){yn(In());for(var a in En)En.hasOwnProperty(a)&&delete En[Number(a)]}
function Ln(a,b,c){if(!c)return c=c===void 0,-In().Za(a,b,c);var d=window.setTimeout(function(){var e=In().Za(a,b);En[d]=e},c);
return d}
function Mn(a){In().Bb(a)}
function Nn(a){var b=In();if(a<0)b.ra(-a);else{var c=En[a];c?(b.ra(c),delete En[a]):window.clearTimeout(a)}}
function On(){Pn()}
function Pn(){window.clearTimeout(Gn);In().start()}
function Qn(){In().pause();window.clearTimeout(Gn);Gn=window.setTimeout(On,Fn)}
function Rn(){window.clearTimeout(Hn);Hn=window.setTimeout(function(){Sn(0)},Fn)}
function Sn(a){Rn();var b=In();b.o=a;b.start()}
function Tn(a){Rn();var b=In();b.o>a&&(b.o=a,b.start())}
function Un(){window.clearTimeout(Hn);var a=In();a.o=0;a.start()}
;function Vn(){qn.apply(this,arguments)}
x(Vn,qn);function Wn(){Vn.h||(Vn.h=new Vn);return Vn.h}
Vn.prototype.Za=function(a,b,c){c!==void 0&&Number.isNaN(Number(c))&&(c=void 0);var d=E("yt.scheduler.instance.addJob");return d?d(a,b,c):c===void 0?(a(),NaN):jm(a,c||0)};
Vn.prototype.ra=function(a){if(a===void 0||!Number.isNaN(Number(a))){var b=E("yt.scheduler.instance.cancelJob");b?b(a):window.clearTimeout(a)}};
Vn.prototype.start=function(){var a=E("yt.scheduler.instance.start");a&&a()};
Vn.prototype.pause=function(){var a=E("yt.scheduler.instance.pause");a&&a()};
var yj=Wn();
U("web_scheduler_auto_init")&&!E("yt.scheduler.initialized")&&(D("yt.scheduler.instance.dispose",Jn),D("yt.scheduler.instance.addJob",Ln),D("yt.scheduler.instance.addImmediateJob",Mn),D("yt.scheduler.instance.cancelJob",Nn),D("yt.scheduler.instance.cancelAllJobs",Kn),D("yt.scheduler.instance.start",Pn),D("yt.scheduler.instance.pause",Qn),D("yt.scheduler.instance.setPriorityThreshold",Sn),D("yt.scheduler.instance.enablePriorityThreshold",Tn),D("yt.scheduler.instance.clearPriorityThreshold",Un),D("yt.scheduler.initialized",
!0));function Xn(a){var b=new Yj;this.h=(a=b.isAvailable()?a?new Zj(b,a):b:null)?new Tj(a):null;this.i=document.domain||window.location.hostname}
Xn.prototype.set=function(a,b,c,d){c=c||31104E3;this.remove(a);if(this.h)try{this.h.set(a,b,Date.now()+c*1E3);return}catch(f){}var e="";if(d)try{e=escape((new Di).serialize(b))}catch(f){return}else e=escape(b);Xm(a,e,c,this.i)};
Xn.prototype.get=function(a,b){var c=void 0,d=!this.h;if(!d)try{c=this.h.get(a)}catch(e){d=!0}if(d&&(c=Ym(a))&&(c=unescape(c),b))try{c=JSON.parse(c)}catch(e){this.remove(a),c=void 0}return c};
Xn.prototype.remove=function(a){this.h&&this.h.remove(a);Zm(a,"/",this.i)};var Yn=function(){var a;return function(){a||(a=new Xn("ytidb"));return a}}();
function Zn(){var a;return(a=Yn())==null?void 0:a.get("LAST_RESULT_ENTRY_KEY",!0)}
;var $n=[],ao,bo=!1;function co(){var a={};for(ao=new eo(a.handleError===void 0?fo:a.handleError,a.logEvent===void 0?go:a.logEvent);$n.length>0;)switch(a=$n.shift(),a.type){case "ERROR":ao.Ha(a.payload);break;case "EVENT":ao.logEvent(a.eventType,a.payload)}}
function ho(a){bo||(ao?ao.Ha(a):($n.push({type:"ERROR",payload:a}),$n.length>10&&$n.shift()))}
function io(a,b){bo||(ao?ao.logEvent(a,b):($n.push({type:"EVENT",eventType:a,payload:b}),$n.length>10&&$n.shift()))}
;function jo(a){if(a.indexOf(":")>=0)throw Error("Database name cannot contain ':'");}
function ko(a){return a.substr(0,a.indexOf(":"))||a}
;var lo=Yc||Zc;function mo(a){var b=Ic();return b?b.toLowerCase().indexOf(a)>=0:!1}
;var no={},oo=(no.AUTH_INVALID="No user identifier specified.",no.EXPLICIT_ABORT="Transaction was explicitly aborted.",no.IDB_NOT_SUPPORTED="IndexedDB is not supported.",no.MISSING_INDEX="Index not created.",no.MISSING_OBJECT_STORES="Object stores not created.",no.DB_DELETED_BY_MISSING_OBJECT_STORES="Database is deleted because expected object stores were not created.",no.DB_REOPENED_BY_MISSING_OBJECT_STORES="Database is reopened because expected object stores were not created.",no.UNKNOWN_ABORT="Transaction was aborted for unknown reasons.",
no.QUOTA_EXCEEDED="The current transaction exceeded its quota limitations.",no.QUOTA_MAYBE_EXCEEDED="The current transaction may have failed because of exceeding quota limitations.",no.EXECUTE_TRANSACTION_ON_CLOSED_DB="Can't start a transaction on a closed database",no.INCOMPATIBLE_DB_VERSION="The binary is incompatible with the database version",no),po={},qo=(po.AUTH_INVALID="ERROR",po.EXECUTE_TRANSACTION_ON_CLOSED_DB="WARNING",po.EXPLICIT_ABORT="IGNORED",po.IDB_NOT_SUPPORTED="ERROR",po.MISSING_INDEX=
"WARNING",po.MISSING_OBJECT_STORES="ERROR",po.DB_DELETED_BY_MISSING_OBJECT_STORES="WARNING",po.DB_REOPENED_BY_MISSING_OBJECT_STORES="WARNING",po.QUOTA_EXCEEDED="WARNING",po.QUOTA_MAYBE_EXCEEDED="WARNING",po.UNKNOWN_ABORT="WARNING",po.INCOMPATIBLE_DB_VERSION="WARNING",po),ro={},so=(ro.AUTH_INVALID=!1,ro.EXECUTE_TRANSACTION_ON_CLOSED_DB=!1,ro.EXPLICIT_ABORT=!1,ro.IDB_NOT_SUPPORTED=!1,ro.MISSING_INDEX=!1,ro.MISSING_OBJECT_STORES=!1,ro.DB_DELETED_BY_MISSING_OBJECT_STORES=!1,ro.DB_REOPENED_BY_MISSING_OBJECT_STORES=
!1,ro.QUOTA_EXCEEDED=!1,ro.QUOTA_MAYBE_EXCEEDED=!0,ro.UNKNOWN_ABORT=!0,ro.INCOMPATIBLE_DB_VERSION=!1,ro);function to(a,b,c,d,e){b=b===void 0?{}:b;c=c===void 0?oo[a]:c;d=d===void 0?qo[a]:d;e=e===void 0?so[a]:e;V.call(this,c,Object.assign({},{name:"YtIdbKnownError",isSw:self.document===void 0,isIframe:self!==self.top,type:a},b));this.type=a;this.message=c;this.level=d;this.h=e;Object.setPrototypeOf(this,to.prototype)}
x(to,V);function uo(a,b){to.call(this,"MISSING_OBJECT_STORES",{expectedObjectStores:b,foundObjectStores:a},oo.MISSING_OBJECT_STORES);Object.setPrototypeOf(this,uo.prototype)}
x(uo,to);function vo(a,b){var c=Error.call(this);this.message=c.message;"stack"in c&&(this.stack=c.stack);this.index=a;this.objectStore=b;Object.setPrototypeOf(this,vo.prototype)}
x(vo,Error);var wo=["The database connection is closing","Can't start a transaction on a closed database","A mutation operation was attempted on a database that did not allow mutations"];
function xo(a,b,c,d){b=ko(b);var e=a instanceof Error?a:Error("Unexpected error: "+a);if(e instanceof to)return e;a={objectStoreNames:c,dbName:b,dbVersion:d};if(e.name==="QuotaExceededError")return new to("QUOTA_EXCEEDED",a);if($c&&e.name==="UnknownError")return new to("QUOTA_MAYBE_EXCEEDED",a);if(e instanceof vo)return new to("MISSING_INDEX",Object.assign({},a,{objectStore:e.objectStore,index:e.index}));if(e.name==="InvalidStateError"&&wo.some(function(f){return e.message.includes(f)}))return new to("EXECUTE_TRANSACTION_ON_CLOSED_DB",
a);
if(e.name==="AbortError")return new to("UNKNOWN_ABORT",a,e.message);e.args=[Object.assign({},a,{name:"IdbError",md:e.name})];e.level="WARNING";return e}
function yo(a,b,c){var d=Zn();return new to("IDB_NOT_SUPPORTED",{context:{caller:a,publicName:b,version:c,hasSucceededOnce:d==null?void 0:d.hasSucceededOnce}})}
;function zo(a){if(!a)throw Error();throw a;}
function Ao(a){return a}
function Bo(a){this.h=a}
function Co(a){function b(e){if(d.state.status==="PENDING"){d.state={status:"REJECTED",reason:e};e=v(d.i);for(var f=e.next();!f.done;f=e.next())f=f.value,f()}}
function c(e){if(d.state.status==="PENDING"){d.state={status:"FULFILLED",value:e};e=v(d.h);for(var f=e.next();!f.done;f=e.next())f=f.value,f()}}
var d=this;this.state={status:"PENDING"};this.h=[];this.i=[];a=a.h;try{a(c,b)}catch(e){b(e)}}
Co.all=function(a){return new Co(new Bo(function(b,c){var d=[],e=a.length;e===0&&b(d);for(var f={qb:0};f.qb<a.length;f={qb:f.qb},++f.qb)Co.resolve(a[f.qb]).then(function(g){return function(h){d[g.qb]=h;e--;e===0&&b(d)}}(f)).catch(function(g){c(g)})}))};
Co.resolve=function(a){return new Co(new Bo(function(b,c){a instanceof Co?a.then(b,c):b(a)}))};
Co.reject=function(a){return new Co(new Bo(function(b,c){c(a)}))};
Co.prototype.then=function(a,b){var c=this,d=a!=null?a:Ao,e=b!=null?b:zo;return new Co(new Bo(function(f,g){c.state.status==="PENDING"?(c.h.push(function(){Do(c,c,d,f,g)}),c.i.push(function(){Eo(c,c,e,f,g)})):c.state.status==="FULFILLED"?Do(c,c,d,f,g):c.state.status==="REJECTED"&&Eo(c,c,e,f,g)}))};
Co.prototype.catch=function(a){return this.then(void 0,a)};
function Do(a,b,c,d,e){try{if(a.state.status!=="FULFILLED")throw Error("calling handleResolve before the promise is fulfilled.");var f=c(a.state.value);f instanceof Co?Fo(a,b,f,d,e):d(f)}catch(g){e(g)}}
function Eo(a,b,c,d,e){try{if(a.state.status!=="REJECTED")throw Error("calling handleReject before the promise is rejected.");var f=c(a.state.reason);f instanceof Co?Fo(a,b,f,d,e):d(f)}catch(g){e(g)}}
function Fo(a,b,c,d,e){b===c?e(new TypeError("Circular promise chain detected.")):c.then(function(f){f instanceof Co?Fo(a,b,f,d,e):d(f)},function(f){e(f)})}
;function Go(a,b,c){function d(){c(a.error);f()}
function e(){b(a.result);f()}
function f(){try{a.removeEventListener("success",e),a.removeEventListener("error",d)}catch(g){}}
a.addEventListener("success",e);a.addEventListener("error",d)}
function Ho(a){return new Promise(function(b,c){Go(a,b,c)})}
function Io(a){return new Co(new Bo(function(b,c){Go(a,b,c)}))}
;function Jo(a,b){return new Co(new Bo(function(c,d){function e(){var f=a?b(a):null;f?f.then(function(g){a=g;e()},d):c()}
e()}))}
;var Ko=window,W=Ko.ytcsi&&Ko.ytcsi.now?Ko.ytcsi.now:Ko.performance&&Ko.performance.timing&&Ko.performance.now&&Ko.performance.timing.navigationStart?function(){return Ko.performance.timing.navigationStart+Ko.performance.now()}:function(){return(new Date).getTime()};function Lo(a,b){this.h=a;this.options=b;this.transactionCount=0;this.j=Math.round(W());this.i=!1}
p=Lo.prototype;p.add=function(a,b,c){return Mo(this,[a],{mode:"readwrite",la:!0},function(d){return d.objectStore(a).add(b,c)})};
p.clear=function(a){return Mo(this,[a],{mode:"readwrite",la:!0},function(b){return b.objectStore(a).clear()})};
p.close=function(){this.h.close();var a;((a=this.options)==null?0:a.closed)&&this.options.closed()};
p.count=function(a,b){return Mo(this,[a],{mode:"readonly",la:!0},function(c){return c.objectStore(a).count(b)})};
function No(a,b,c){a=a.h.createObjectStore(b,c);return new Oo(a)}
p.delete=function(a,b){return Mo(this,[a],{mode:"readwrite",la:!0},function(c){return c.objectStore(a).delete(b)})};
p.get=function(a,b){return Mo(this,[a],{mode:"readonly",la:!0},function(c){return c.objectStore(a).get(b)})};
function Po(a,b,c){return Mo(a,[b],{mode:"readwrite",la:!0},function(d){d=d.objectStore(b);return Io(d.h.put(c,void 0))})}
p.objectStoreNames=function(){return Array.from(this.h.objectStoreNames)};
function Mo(a,b,c,d){var e,f,g,h,k,l,m,n,r,t,w,y;return A(function(z){switch(z.h){case 1:var G={mode:"readonly",la:!1,tag:"IDB_TRANSACTION_TAG_UNKNOWN"};typeof c==="string"?G.mode=c:Object.assign(G,c);e=G;a.transactionCount++;f=e.la?3:1;g=0;case 2:if(h){z.F(4);break}g++;k=Math.round(W());ya(z,5);l=a.h.transaction(b,e.mode);G=z.yield;var I=new Qo(l);I=Ro(I,d);return G.call(z,I,7);case 7:return m=z.i,n=Math.round(W()),So(a,k,n,g,void 0,b.join(),e),z.return(m);case 5:r=za(z);t=Math.round(W());w=xo(r,
a.h.name,b.join(),a.h.version);if((y=w instanceof to&&!w.h)||g>=f)So(a,k,t,g,w,b.join(),e),h=w;z.F(2);break;case 4:return z.return(Promise.reject(h))}})}
function So(a,b,c,d,e,f,g){b=c-b;e?(e instanceof to&&(e.type==="QUOTA_EXCEEDED"||e.type==="QUOTA_MAYBE_EXCEEDED")&&io("QUOTA_EXCEEDED",{dbName:ko(a.h.name),objectStoreNames:f,transactionCount:a.transactionCount,transactionMode:g.mode}),e instanceof to&&e.type==="UNKNOWN_ABORT"&&(c-=a.j,c<0&&c>=Math.pow(2,31)&&(c=0),io("TRANSACTION_UNEXPECTEDLY_ABORTED",{objectStoreNames:f,transactionDuration:b,transactionCount:a.transactionCount,dbDuration:c}),a.i=!0),To(a,!1,d,f,b,g.tag),ho(e)):To(a,!0,d,f,b,g.tag)}
function To(a,b,c,d,e,f){io("TRANSACTION_ENDED",{objectStoreNames:d,connectionHasUnknownAbortedTransaction:a.i,duration:e,isSuccessful:b,tryCount:c,tag:f===void 0?"IDB_TRANSACTION_TAG_UNKNOWN":f})}
p.getName=function(){return this.h.name};
function Oo(a){this.h=a}
p=Oo.prototype;p.add=function(a,b){return Io(this.h.add(a,b))};
p.autoIncrement=function(){return this.h.autoIncrement};
p.clear=function(){return Io(this.h.clear()).then(function(){})};
function Uo(a,b,c){a.h.createIndex(b,c,{unique:!1})}
p.count=function(a){return Io(this.h.count(a))};
function Vo(a,b){return Wo(a,{query:b},function(c){return c.delete().then(function(){return Xo(c)})}).then(function(){})}
p.delete=function(a){return a instanceof IDBKeyRange?Vo(this,a):Io(this.h.delete(a))};
p.get=function(a){return Io(this.h.get(a))};
p.index=function(a){try{return new Yo(this.h.index(a))}catch(b){if(b instanceof Error&&b.name==="NotFoundError")throw new vo(a,this.h.name);throw b;}};
p.getName=function(){return this.h.name};
p.keyPath=function(){return this.h.keyPath};
function Wo(a,b,c){a=a.h.openCursor(b.query,b.direction);return Zo(a).then(function(d){return Jo(d,c)})}
function Qo(a){var b=this;this.h=a;this.i=new Map;this.aborted=!1;this.done=new Promise(function(c,d){b.h.addEventListener("complete",function(){c()});
b.h.addEventListener("error",function(e){e.currentTarget===e.target&&d(b.h.error)});
b.h.addEventListener("abort",function(){var e=b.h.error;if(e)d(e);else if(!b.aborted){e=to;for(var f=b.h.objectStoreNames,g=[],h=0;h<f.length;h++){var k=f.item(h);if(k===null)throw Error("Invariant: item in DOMStringList is null");g.push(k)}e=new e("UNKNOWN_ABORT",{objectStoreNames:g.join(),dbName:b.h.db.name,mode:b.h.mode});d(e)}})})}
function Ro(a,b){var c=new Promise(function(d,e){try{b(a).then(function(f){d(f)}).catch(e)}catch(f){e(f),a.abort()}});
return Promise.all([c,a.done]).then(function(d){return v(d).next().value})}
Qo.prototype.abort=function(){this.h.abort();this.aborted=!0;throw new to("EXPLICIT_ABORT");};
Qo.prototype.objectStore=function(a){a=this.h.objectStore(a);var b=this.i.get(a);b||(b=new Oo(a),this.i.set(a,b));return b};
function Yo(a){this.h=a}
p=Yo.prototype;p.count=function(a){return Io(this.h.count(a))};
p.delete=function(a){return $o(this,{query:a},function(b){return b.delete().then(function(){return Xo(b)})})};
p.get=function(a){return Io(this.h.get(a))};
p.keyPath=function(){return this.h.keyPath};
p.unique=function(){return this.h.unique};
function $o(a,b,c){a=a.h.openCursor(b.query===void 0?null:b.query,b.direction===void 0?"next":b.direction);return Zo(a).then(function(d){return Jo(d,c)})}
function ap(a,b){this.request=a;this.cursor=b}
function Zo(a){return Io(a).then(function(b){return b?new ap(a,b):null})}
function Xo(a){a.cursor.continue(void 0);return Zo(a.request)}
ap.prototype.delete=function(){return Io(this.cursor.delete()).then(function(){})};
ap.prototype.getValue=function(){return this.cursor.value};
ap.prototype.update=function(a){return Io(this.cursor.update(a))};function bp(a,b,c){return new Promise(function(d,e){function f(){r||(r=new Lo(g.result,{closed:n}));return r}
var g=b!==void 0?self.indexedDB.open(a,b):self.indexedDB.open(a);var h=c.Ld,k=c.blocking,l=c.bf,m=c.upgrade,n=c.closed,r;g.addEventListener("upgradeneeded",function(t){try{if(t.newVersion===null)throw Error("Invariant: newVersion on IDbVersionChangeEvent is null");if(g.transaction===null)throw Error("Invariant: transaction on IDbOpenDbRequest is null");t.dataLoss&&t.dataLoss!=="none"&&io("IDB_DATA_CORRUPTED",{reason:t.dataLossMessage||"unknown reason",dbName:ko(a)});var w=f(),y=new Qo(g.transaction);
m&&m(w,function(z){return t.oldVersion<z&&t.newVersion>=z},y);
y.done.catch(function(z){e(z)})}catch(z){e(z)}});
g.addEventListener("success",function(){var t=g.result;k&&t.addEventListener("versionchange",function(){k(f())});
t.addEventListener("close",function(){io("IDB_UNEXPECTEDLY_CLOSED",{dbName:ko(a),dbVersion:t.version});l&&l()});
d(f())});
g.addEventListener("error",function(){e(g.error)});
h&&g.addEventListener("blocked",function(){h()})})}
function cp(a,b,c){c=c===void 0?{}:c;return bp(a,b,c)}
function dp(a,b){b=b===void 0?{}:b;var c,d,e,f;return A(function(g){if(g.h==1)return ya(g,2),c=self.indexedDB.deleteDatabase(a),d=b,(e=d.Ld)&&c.addEventListener("blocked",function(){e()}),g.yield(Ho(c),4);
if(g.h!=2)g.h=0,g.o=0;else throw f=za(g),xo(f,a,"",-1);})}
;function ep(a,b){this.name=a;this.options=b;this.j=!0;this.D=this.o=0}
ep.prototype.i=function(a,b,c){c=c===void 0?{}:c;return cp(a,b,c)};
ep.prototype.delete=function(a){a=a===void 0?{}:a;return dp(this.name,a)};
function fp(a,b){return new to("INCOMPATIBLE_DB_VERSION",{dbName:a.name,oldVersion:a.options.version,newVersion:b})}
function gp(a,b){if(!b)throw yo("openWithToken",ko(a.name));return a.open()}
ep.prototype.open=function(){function a(){var f,g,h,k,l,m,n,r,t,w;return A(function(y){switch(y.h){case 1:return g=(f=Error().stack)!=null?f:"",ya(y,2),y.yield(c.i(c.name,c.options.version,e),4);case 4:for(var z=h=y.i,G=c.options,I=[],N=v(Object.keys(G.wb)),S=N.next();!S.done;S=N.next()){S=S.value;var ta=G.wb[S],lb=ta.Ee===void 0?Number.MAX_VALUE:ta.Ee;!(z.h.version>=ta.Db)||z.h.version>=lb||z.h.objectStoreNames.contains(S)||I.push(S)}k=I;if(k.length===0){y.F(5);break}l=Object.keys(c.options.wb);
m=h.objectStoreNames();if(c.D<mm("ytidb_reopen_db_retries",0))return c.D++,h.close(),ho(new to("DB_REOPENED_BY_MISSING_OBJECT_STORES",{dbName:c.name,expectedObjectStores:l,foundObjectStores:m})),y.return(a());if(!(c.o<mm("ytidb_remake_db_retries",1))){y.F(6);break}c.o++;return y.yield(c.delete(),7);case 7:return ho(new to("DB_DELETED_BY_MISSING_OBJECT_STORES",{dbName:c.name,expectedObjectStores:l,foundObjectStores:m})),y.return(a());case 6:throw new uo(m,l);case 5:return y.return(h);case 2:n=za(y);
if(n instanceof DOMException?n.name!=="VersionError":"DOMError"in self&&n instanceof DOMError?n.name!=="VersionError":!(n instanceof Object&&"message"in n)||n.message!=="An attempt was made to open a database using a lower version than the existing version."){y.F(8);break}return y.yield(c.i(c.name,void 0,Object.assign({},e,{upgrade:void 0})),9);case 9:r=y.i;t=r.h.version;if(c.options.version!==void 0&&t>c.options.version+1)throw r.close(),c.j=!1,fp(c,t);return y.return(r);case 8:throw b(),n instanceof
Error&&!U("ytidb_async_stack_killswitch")&&(n.stack=n.stack+"\n"+g.substring(g.indexOf("\n")+1)),xo(n,c.name,"",(w=c.options.version)!=null?w:-1);}})}
function b(){c.h===d&&(c.h=void 0)}
var c=this;if(!this.j)throw fp(this);if(this.h)return this.h;var d,e={blocking:function(f){f.close()},
closed:b,bf:b,upgrade:this.options.upgrade};return this.h=d=a()};var hp=new ep("YtIdbMeta",{wb:{databases:{Db:1}},upgrade:function(a,b){b(1)&&No(a,"databases",{keyPath:"actualName"})}});
function ip(a,b){var c;return A(function(d){if(d.h==1)return d.yield(gp(hp,b),2);c=d.i;return d.return(Mo(c,["databases"],{la:!0,mode:"readwrite"},function(e){var f=e.objectStore("databases");return f.get(a.actualName).then(function(g){if(g?a.actualName!==g.actualName||a.publicName!==g.publicName||a.userIdentifier!==g.userIdentifier:1)return Io(f.h.put(a,void 0)).then(function(){})})}))})}
function jp(a,b){var c;return A(function(d){if(d.h==1)return a?d.yield(gp(hp,b),2):d.return();c=d.i;return d.return(c.delete("databases",a))})}
function kp(a,b){var c,d;return A(function(e){return e.h==1?(c=[],e.yield(gp(hp,b),2)):e.h!=3?(d=e.i,e.yield(Mo(d,["databases"],{la:!0,mode:"readonly"},function(f){c.length=0;return Wo(f.objectStore("databases"),{},function(g){a(g.getValue())&&c.push(g.getValue());return Xo(g)})}),3)):e.return(c)})}
function lp(a){return kp(function(b){return b.publicName==="LogsDatabaseV2"&&b.userIdentifier!==void 0},a)}
function mp(a,b,c){return kp(function(d){return c?d.userIdentifier!==void 0&&!a.includes(d.userIdentifier)&&c.includes(d.publicName):d.userIdentifier!==void 0&&!a.includes(d.userIdentifier)},b)}
function np(a){var b,c;return A(function(d){if(d.h==1)return b=pn("YtIdbMeta hasAnyMeta other"),d.yield(kp(function(e){return e.userIdentifier!==void 0&&e.userIdentifier!==b},a),2);
c=d.i;return d.return(c.length>0)})}
;var op,pp=new function(){}(new function(){});
function qp(){var a,b,c,d;return A(function(e){switch(e.h){case 1:a=Zn();if((b=a)==null?0:b.hasSucceededOnce)return e.return(!0);var f;if(f=lo)f=/WebKit\/([0-9]+)/.exec(Ic()),f=!!(f&&parseInt(f[1],10)>=600);f&&(f=/WebKit\/([0-9]+)/.exec(Ic()),f=!(f&&parseInt(f[1],10)>=602));if(f||Uc)return e.return(!1);try{if(c=self,!(c.indexedDB&&c.IDBIndex&&c.IDBKeyRange&&c.IDBObjectStore))return e.return(!1)}catch(g){return e.return(!1)}if(!("IDBTransaction"in self&&"objectStoreNames"in IDBTransaction.prototype))return e.return(!1);
ya(e,2);d={actualName:"yt-idb-test-do-not-use",publicName:"yt-idb-test-do-not-use",userIdentifier:void 0};return e.yield(ip(d,pp),4);case 4:return e.yield(jp("yt-idb-test-do-not-use",pp),5);case 5:return e.return(!0);case 2:return za(e),e.return(!1)}})}
function rp(){if(op!==void 0)return op;bo=!0;return op=qp().then(function(a){bo=!1;var b;if((b=Yn())!=null&&b.h){var c;b={hasSucceededOnce:((c=Zn())==null?void 0:c.hasSucceededOnce)||a};var d;(d=Yn())==null||d.set("LAST_RESULT_ENTRY_KEY",b,2592E3,!0)}return a})}
function sp(){return E("ytglobal.idbToken_")||void 0}
function tp(){var a=sp();return a?Promise.resolve(a):rp().then(function(b){(b=b?pp:void 0)&&D("ytglobal.idbToken_",b);return b})}
;var up=0;function vp(a,b){up||(up=yj.qa(function(){var c,d,e,f,g;return A(function(h){switch(h.h){case 1:return h.yield(tp(),2);case 2:c=h.i;if(!c)return h.return();d=!0;ya(h,3);return h.yield(mp(a,c,b),5);case 5:e=h.i;if(!e.length){d=!1;h.F(6);break}f=e[0];return h.yield(dp(f.actualName),7);case 7:return h.yield(jp(f.actualName,c),6);case 6:h.h=4;h.o=0;break;case 3:g=za(h),ho(g),d=!1;case 4:yj.ra(up),up=0,d&&vp(a,b),h.h=0}})}))}
function wp(){var a;return A(function(b){return b.h==1?b.yield(tp(),2):(a=b.i)?b.return(np(a)):b.return(!1)})}
new jj;function xp(a){if(!on())throw a=new to("AUTH_INVALID",{dbName:a}),ho(a),a;var b=pn();return{actualName:a+":"+b,publicName:a,userIdentifier:b}}
function yp(a,b,c,d){var e,f,g,h,k,l;return A(function(m){switch(m.h){case 1:return f=(e=Error().stack)!=null?e:"",m.yield(tp(),2);case 2:g=m.i;if(!g)throw h=yo("openDbImpl",a,b),U("ytidb_async_stack_killswitch")||(h.stack=h.stack+"\n"+f.substring(f.indexOf("\n")+1)),ho(h),h;jo(a);k=c?{actualName:a,publicName:a,userIdentifier:void 0}:xp(a);ya(m,3);return m.yield(ip(k,g),5);case 5:return m.yield(cp(k.actualName,b,d),6);case 6:return m.return(m.i);case 3:return l=za(m),ya(m,7),m.yield(jp(k.actualName,
g),9);case 9:m.h=8;m.o=0;break;case 7:za(m);case 8:throw l;}})}
function zp(a,b,c){c=c===void 0?{}:c;return yp(a,b,!1,c)}
function Ap(a,b,c){c=c===void 0?{}:c;return yp(a,b,!0,c)}
function Bp(a,b){b=b===void 0?{}:b;var c,d;return A(function(e){if(e.h==1)return e.yield(tp(),2);if(e.h!=3){c=e.i;if(!c)return e.return();jo(a);d=xp(a);return e.yield(dp(d.actualName,b),3)}return e.yield(jp(d.actualName,c),0)})}
function Cp(a,b,c){a=a.map(function(d){return A(function(e){return e.h==1?e.yield(dp(d.actualName,b),2):e.yield(jp(d.actualName,c),0)})});
return Promise.all(a).then(function(){})}
function Dp(){var a=a===void 0?{}:a;var b,c;return A(function(d){if(d.h==1)return d.yield(tp(),2);if(d.h!=3){b=d.i;if(!b)return d.return();jo("LogsDatabaseV2");return d.yield(lp(b),3)}c=d.i;return d.yield(Cp(c,a,b),0)})}
function Ep(a,b){b=b===void 0?{}:b;var c;return A(function(d){if(d.h==1)return d.yield(tp(),2);if(d.h!=3){c=d.i;if(!c)return d.return();jo(a);return d.yield(dp(a,b),3)}return d.yield(jp(a,c),0)})}
;function Fp(a,b){ep.call(this,a,b);this.options=b;jo(a)}
x(Fp,ep);function Gp(a,b){var c;return function(){c||(c=new Fp(a,b));return c}}
Fp.prototype.i=function(a,b,c){c=c===void 0?{}:c;return(this.options.shared?Ap:zp)(a,b,Object.assign({},c))};
Fp.prototype.delete=function(a){a=a===void 0?{}:a;return(this.options.shared?Ep:Bp)(this.name,a)};
function Hp(a,b){return Gp(a,b)}
;var Ip={},Jp=Hp("ytGcfConfig",{wb:(Ip.coldConfigStore={Db:1},Ip.hotConfigStore={Db:1},Ip),shared:!1,upgrade:function(a,b){b(1)&&(Uo(No(a,"hotConfigStore",{keyPath:"key",autoIncrement:!0}),"hotTimestampIndex","timestamp"),Uo(No(a,"coldConfigStore",{keyPath:"key",autoIncrement:!0}),"coldTimestampIndex","timestamp"))},
version:1});function Kp(a){return gp(Jp(),a)}
function Lp(a,b,c){var d,e,f;return A(function(g){switch(g.h){case 1:return d={config:a,hashData:b,timestamp:W()},g.yield(Kp(c),2);case 2:return e=g.i,g.yield(e.clear("hotConfigStore"),3);case 3:return g.yield(Po(e,"hotConfigStore",d),4);case 4:return f=g.i,g.return(f)}})}
function Mp(a,b,c,d){var e,f,g;return A(function(h){switch(h.h){case 1:return e={config:a,hashData:b,configData:c,timestamp:W()},h.yield(Kp(d),2);case 2:return f=h.i,h.yield(f.clear("coldConfigStore"),3);case 3:return h.yield(Po(f,"coldConfigStore",e),4);case 4:return g=h.i,h.return(g)}})}
function Np(a){var b,c;return A(function(d){return d.h==1?d.yield(Kp(a),2):d.h!=3?(b=d.i,c=void 0,d.yield(Mo(b,["coldConfigStore"],{mode:"readwrite",la:!0},function(e){return $o(e.objectStore("coldConfigStore").index("coldTimestampIndex"),{direction:"prev"},function(f){c=f.getValue()})}),3)):d.return(c)})}
function Op(a){var b,c;return A(function(d){return d.h==1?d.yield(Kp(a),2):d.h!=3?(b=d.i,c=void 0,d.yield(Mo(b,["hotConfigStore"],{mode:"readwrite",la:!0},function(e){return $o(e.objectStore("hotConfigStore").index("hotTimestampIndex"),{direction:"prev"},function(f){c=f.getValue()})}),3)):d.return(c)})}
;function Pp(){L.call(this);this.i=[];this.h=[];var a=E("yt.gcf.config.hotUpdateCallbacks");a?(this.i=[].concat(ja(a)),this.h=a):(this.h=[],D("yt.gcf.config.hotUpdateCallbacks",this.h))}
x(Pp,L);Pp.prototype.ba=function(){for(var a=v(this.i),b=a.next();!b.done;b=a.next()){var c=this.h;b=c.indexOf(b.value);b>=0&&c.splice(b,1)}this.i.length=0;L.prototype.ba.call(this)};function Qp(){this.h=0;this.i=new Pp}
function Rp(){var a;return(a=E("yt.gcf.config.hotConfigGroup"))!=null?a:R("RAW_HOT_CONFIG_GROUP")}
function Sp(a,b,c){var d,e,f;return A(function(g){switch(g.h){case 1:if(!U("start_client_gcf")){g.F(0);break}c&&(a.j=c,D("yt.gcf.config.hotConfigGroup",a.j||null));a.o(b);d=sp();if(!d){g.F(3);break}if(c){g.F(4);break}return g.yield(Op(d),5);case 5:e=g.i,c=(f=e)==null?void 0:f.config;case 4:return g.yield(Lp(c,b,d),3);case 3:if(c)for(var h=c,k=v(a.i.h),l=k.next();!l.done;l=k.next())l=l.value,l(h);g.h=0}})}
function Tp(a,b,c){var d,e,f,g;return A(function(h){if(h.h==1){if(!U("start_client_gcf"))return h.F(0);a.coldHashData=b;D("yt.gcf.config.coldHashData",a.coldHashData||null);return(d=sp())?c?h.F(4):h.yield(Np(d),5):h.F(0)}h.h!=4&&(e=h.i,c=(f=e)==null?void 0:f.config);if(!c)return h.F(0);g=c.configData;return h.yield(Mp(c,b,g,d),0)})}
function Up(){if(!Qp.h){var a=new Qp;Qp.h=a}a=Qp.h;var b=W()-a.h;if(!(a.h!==0&&b<mm("send_config_hash_timer"))){b=E("yt.gcf.config.coldConfigData");var c=E("yt.gcf.config.hotHashData"),d=E("yt.gcf.config.coldHashData");b&&c&&d&&(a.h=W());return{coldConfigData:b,hotHashData:c,coldHashData:d}}}
Qp.prototype.o=function(a){this.hotHashData=a;D("yt.gcf.config.hotHashData",this.hotHashData||null)};function Vp(){return"INNERTUBE_API_KEY"in Nl&&"INNERTUBE_API_VERSION"in Nl}
function Wp(){return{innertubeApiKey:R("INNERTUBE_API_KEY"),innertubeApiVersion:R("INNERTUBE_API_VERSION"),ee:R("INNERTUBE_CONTEXT_CLIENT_CONFIG_INFO"),ed:R("INNERTUBE_CONTEXT_CLIENT_NAME","WEB"),Ug:R("INNERTUBE_CONTEXT_CLIENT_NAME",1),innertubeContextClientVersion:R("INNERTUBE_CONTEXT_CLIENT_VERSION"),he:R("INNERTUBE_CONTEXT_HL"),ge:R("INNERTUBE_CONTEXT_GL"),je:R("INNERTUBE_HOST_OVERRIDE")||"",le:!!R("INNERTUBE_USE_THIRD_PARTY_AUTH",!1),ke:!!R("INNERTUBE_OMIT_API_KEY_WHEN_AUTH_HEADER_IS_PRESENT",
!1),appInstallData:R("SERIALIZED_CLIENT_CONFIG_DATA")}}
function Xp(a){var b={client:{hl:a.he,gl:a.ge,clientName:a.ed,clientVersion:a.innertubeContextClientVersion,configInfo:a.ee}};navigator.userAgent&&(b.client.userAgent=String(navigator.userAgent));var c=C.devicePixelRatio;c&&c!=1&&(b.client.screenDensityFloat=String(c));c=R("EXPERIMENTS_TOKEN","");c!==""&&(b.client.experimentsToken=c);c=nm();c.length>0&&(b.request={internalExperimentFlags:c});c=a.ed;if((c==="WEB"||c==="MWEB"||c===1||c===2)&&b){var d;b.client.mainAppWebInfo=(d=b.client.mainAppWebInfo)!=
null?d:{};b.client.mainAppWebInfo.webDisplayMode=Sm()}(d=E("yt.embedded_player.embed_url"))&&b&&(b.thirdParty={embedUrl:d});var e;if(U("web_log_memory_total_kbytes")&&((e=C.navigator)==null?0:e.deviceMemory)){var f;e=(f=C.navigator)==null?void 0:f.deviceMemory;b&&(b.client.memoryTotalKbytes=""+e*1E6)}a.appInstallData&&b&&(b.client.configInfo=b.client.configInfo||{},b.client.configInfo.appInstallData=a.appInstallData);(a=mn())&&b&&(b.client.connectionType=a);U("web_log_effective_connection_type")&&
(a=nn())&&b&&(b.client.effectiveConnectionType=a);U("start_client_gcf")&&(e=Up())&&(a=e.coldConfigData,f=e.coldHashData,e=e.hotHashData,b&&(b.client.configInfo=b.client.configInfo||{},a&&(b.client.configInfo.coldConfigData=a),f&&(b.client.configInfo.coldHashData=f),e&&(b.client.configInfo.hotHashData=e)));R("DELEGATED_SESSION_ID")&&!U("pageid_as_header_web")&&(b.user={onBehalfOfUser:R("DELEGATED_SESSION_ID")});!U("fill_delegate_context_in_gel_killswitch")&&(a=R("INNERTUBE_CONTEXT_SERIALIZED_DELEGATION_CONTEXT"))&&
(b.user=Object.assign({},b.user,{serializedDelegationContext:a}));a=Object;f=a.assign;e=b.client;d={};c=v(Object.entries(am(R("DEVICE",""))));for(var g=c.next();!g.done;g=c.next()){var h=v(g.value);g=h.next().value;h=h.next().value;g==="cbrand"?d.deviceMake=h:g==="cmodel"?d.deviceModel=h:g==="cbr"?d.browserName=h:g==="cbrver"?d.browserVersion=h:g==="cos"?d.osName=h:g==="cosver"?d.osVersion=h:g==="cplatform"&&(d.platform=h)}b.client=f.call(a,e,d);return b}
function Yp(a,b,c){c=c===void 0?{}:c;var d={};R("EOM_VISITOR_DATA")?d={"X-Goog-EOM-Visitor-Id":R("EOM_VISITOR_DATA")}:d={"X-Goog-Visitor-Id":c.visitorData||R("VISITOR_DATA","")};if(b&&b.includes("www.youtube-nocookie.com"))return d;b=c.authorization||R("AUTHORIZATION");b||(a?b="Bearer "+E("gapi.auth.getToken")().Mg:(a=Vm(Um()),U("pageid_as_header_web")||delete a["X-Goog-PageId"],d=Object.assign({},d,a)));b&&(d.Authorization=b);return d}
;var Zp=typeof TextEncoder!=="undefined"?new TextEncoder:null,$p=Zp?function(a){return Zp.encode(a)}:function(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);
e<128?b[c++]=e:(e<2048?b[c++]=e>>6|192:((e&64512)==55296&&d+1<a.length&&(a.charCodeAt(d+1)&64512)==56320?(e=65536+((e&1023)<<10)+(a.charCodeAt(++d)&1023),b[c++]=e>>18|240,b[c++]=e>>12&63|128):b[c++]=e>>12|224,b[c++]=e>>6&63|128),b[c++]=e&63|128)}a=new Uint8Array(b.length);for(c=0;c<a.length;c++)a[c]=b[c];return a};function aq(a,b){this.version=a;this.args=b}
aq.prototype.serialize=function(){return{version:this.version,args:this.args}};function bq(a,b){this.topic=a;this.h=b}
bq.prototype.toString=function(){return this.topic};var cq=E("ytPubsub2Pubsub2Instance")||new M;M.prototype.subscribe=M.prototype.subscribe;M.prototype.unsubscribeByKey=M.prototype.Rb;M.prototype.publish=M.prototype.kb;M.prototype.clear=M.prototype.clear;D("ytPubsub2Pubsub2Instance",cq);var dq=E("ytPubsub2Pubsub2SubscribedKeys")||{};D("ytPubsub2Pubsub2SubscribedKeys",dq);var eq=E("ytPubsub2Pubsub2TopicToKeys")||{};D("ytPubsub2Pubsub2TopicToKeys",eq);var fq=E("ytPubsub2Pubsub2IsAsync")||{};D("ytPubsub2Pubsub2IsAsync",fq);
D("ytPubsub2Pubsub2SkipSubKey",null);function gq(a,b){var c=hq();c&&c.publish.call(c,a.toString(),a,b)}
function iq(a){var b=jq,c=hq();if(!c)return 0;var d=c.subscribe(b.toString(),function(e,f){var g=E("ytPubsub2Pubsub2SkipSubKey");g&&g==d||(g=function(){if(dq[d])try{if(f&&b instanceof bq&&b!=e)try{var h=b.h,k=f;if(!k.args||!k.version)throw Error("yt.pubsub2.Data.deserialize(): serializedData is incomplete.");try{if(!h.Bd){var l=new h;h.Bd=l.version}var m=h.Bd}catch(z){}if(!m||k.version!=m)throw Error("yt.pubsub2.Data.deserialize(): serializedData version is incompatible.");try{m=Reflect;var n=m.construct;
var r=k.args,t=r.length;if(t>0){var w=Array(t);for(k=0;k<t;k++)w[k]=r[k];var y=w}else y=[];f=n.call(m,h,y)}catch(z){throw z.message="yt.pubsub2.Data.deserialize(): "+z.message,z;}}catch(z){throw z.message="yt.pubsub2.pubsub2 cross-binary conversion error for "+b.toString()+": "+z.message,z;}a.call(window,f)}catch(z){Tl(z)}},fq[b.toString()]?E("yt.scheduler.instance")?yj.qa(g):jm(g,0):g())});
dq[d]=!0;eq[b.toString()]||(eq[b.toString()]=[]);eq[b.toString()].push(d);return d}
function kq(){var a=lq,b=iq(function(c){a.apply(void 0,arguments);mq(b)});
return b}
function mq(a){var b=hq();b&&(typeof a==="number"&&(a=[a]),Mb(a,function(c){b.unsubscribeByKey(c);delete dq[c]}))}
function hq(){return E("ytPubsub2Pubsub2Instance")}
;function nq(a,b,c){c=c===void 0?{sampleRate:.1}:c;Math.random()<Math.min(.02,c.sampleRate/100)&&gq("meta_logging_csi_event",{timerName:a,mh:b})}
;var oq=void 0,pq=void 0;function qq(){pq||(pq=ml(R("WORKER_SERIALIZATION_URL")));return pq||void 0}
function rq(){var a=qq();oq||a===void 0||(oq=new Worker(jb(a),void 0));return oq}
;var sq=mm("max_body_size_to_compress",5E5),tq=mm("min_body_size_to_compress",500),uq=!0,vq=0,wq=0,xq=mm("compression_performance_threshold_lr",250),yq=mm("slow_compressions_before_abandon_count",4),zq=!1,Aq=new Map,Bq=1,Cq=!0;function Dq(){if(typeof Worker==="function"&&qq()&&!zq){var a=function(c){c=c.data;if(c.op==="gzippedGelBatch"){var d=Aq.get(c.key);d&&(Eq(c.gzippedBatch,d.latencyPayload,d.url,d.options,d.sendFn),Aq.delete(c.key))}},b=rq();
b&&(b.addEventListener("message",a),b.onerror=function(){Aq.clear()},zq=!0)}}
function Fq(a,b,c,d,e){e=e===void 0?!1:e;var f={startTime:W(),ticks:{},infos:{}};if(uq)try{var g=Gq(b);if(g!=null&&(g>sq||g<tq))d(a,c);else{if(U("gzip_gel_with_worker")&&(U("initial_gzip_use_main_thread")&&!Cq||!U("initial_gzip_use_main_thread"))){zq||Dq();var h=rq();if(h&&!e){Aq.set(Bq,{latencyPayload:f,url:a,options:c,sendFn:d});h.postMessage({op:"gelBatchToGzip",serializedBatch:b,key:Bq});Bq++;return}}var k=ll($p(b));Eq(k,f,a,c,d)}}catch(l){Ul(l),d(a,c)}else d(a,c)}
function Eq(a,b,c,d,e){Cq=!1;var f=W();b.ticks.gelc=f;wq++;U("disable_compression_due_to_performance_degredation")&&f-b.startTime>=xq&&(vq++,U("abandon_compression_after_N_slow_zips")?wq===mm("compression_disable_point")&&vq>yq&&(uq=!1):uq=!1);Hq(b);d.headers||(d.headers={});d.headers["Content-Encoding"]="gzip";d.postBody=a;d.postParams=void 0;e(c,d)}
function Iq(a){var b=b===void 0?!1:b;var c=c===void 0?!1:c;var d=W(),e={startTime:d,ticks:{},infos:{}},f=b?E("yt.logging.gzipForFetch",!1):!0;if(uq&&f){if(!a.body)return a;try{var g=c?a.body:typeof a.body==="string"?a.body:JSON.stringify(a.body);f=g;if(!c&&typeof g==="string"){var h=Gq(g);if(h!=null&&(h>sq||h<tq))return a;c=b?{level:1}:void 0;f=ll($p(g),c);var k=W();e.ticks.gelc=k;if(b){wq++;if((U("disable_compression_due_to_performance_degredation")||U("disable_compression_due_to_performance_degradation_lr"))&&
k-d>=xq)if(vq++,U("abandon_compression_after_N_slow_zips")||U("abandon_compression_after_N_slow_zips_lr")){b=vq/wq;var l=yq/mm("compression_disable_point");wq>0&&wq%mm("compression_disable_point")===0&&b>=l&&(uq=!1)}else uq=!1;Hq(e)}}a.headers=Object.assign({},{"Content-Encoding":"gzip"},a.headers||{});a.body=f;return a}catch(m){return Ul(m),a}}else return a}
function Gq(a){try{return(new Blob(a.split(""))).size}catch(b){return Ul(b),null}}
function Hq(a){U("gel_compression_csi_killswitch")||!U("log_gel_compression_latency")&&!U("log_gel_compression_latency_lr")||nq("gel_compression",a,{sampleRate:.1})}
;function Jq(a){a=Object.assign({},a);delete a.Authorization;var b=fg();if(b){var c=new Cj;c.update(R("INNERTUBE_API_KEY"));c.update(b);a.hash=cd(c.digest(),3)}return a}
;var Kq;function Lq(){Kq||(Kq=new Xn("yt.innertube"));return Kq}
function Mq(a,b,c,d){if(d)return null;d=Lq().get("nextId",!0)||1;var e=Lq().get("requests",!0)||{};e[d]={method:a,request:b,authState:Jq(c),requestTime:Math.round(W())};Lq().set("nextId",d+1,86400,!0);Lq().set("requests",e,86400,!0);return d}
function Nq(a){var b=Lq().get("requests",!0)||{};delete b[a];Lq().set("requests",b,86400,!0)}
function Oq(a){var b=Lq().get("requests",!0);if(b){for(var c in b){var d=b[c];if(!(Math.round(W())-d.requestTime<6E4)){var e=d.authState,f=Jq(Yp(!1));tg(e,f)&&(e=d.request,"requestTimeMs"in e&&(e.requestTimeMs=Math.round(W())),Pq(a,d.method,e,{}));delete b[c]}}Lq().set("requests",b,86400,!0)}}
;function Qq(a){this.Vb=this.h=!1;this.potentialEsfErrorCounter=this.i=0;this.handleError=function(){};
this.ob=function(){};
this.now=Date.now;this.Gb=!1;var b;this.xd=(b=a.xd)!=null?b:100;var c;this.sd=(c=a.sd)!=null?c:1;var d;this.pd=(d=a.pd)!=null?d:2592E6;var e;this.od=(e=a.od)!=null?e:12E4;var f;this.rd=(f=a.rd)!=null?f:5E3;var g;this.Y=(g=a.Y)!=null?g:void 0;this.ac=!!a.ac;var h;this.Yb=(h=a.Yb)!=null?h:.1;var k;this.jc=(k=a.jc)!=null?k:10;a.handleError&&(this.handleError=a.handleError);a.ob&&(this.ob=a.ob);a.Gb&&(this.Gb=a.Gb);a.Vb&&(this.Vb=a.Vb);this.Z=a.Z;this.Ea=a.Ea;this.ha=a.ha;this.fa=a.fa;this.sendFn=a.sendFn;
this.Ic=a.Ic;this.Fc=a.Fc;Rq(this)&&(!this.Z||this.Z("networkless_logging"))&&Sq(this)}
function Sq(a){Rq(a)&&!a.Gb&&(a.h=!0,a.ac&&Math.random()<=a.Yb&&a.ha.Md(a.Y),Tq(a),a.fa.wa()&&a.Qb(),a.fa.listen(a.Ic,a.Qb.bind(a)),a.fa.listen(a.Fc,a.Sc.bind(a)))}
p=Qq.prototype;p.writeThenSend=function(a,b){var c=this;b=b===void 0?{}:b;if(Rq(this)&&this.h){var d={url:a,options:b,timestamp:this.now(),status:"NEW",sendCount:0};this.ha.set(d,this.Y).then(function(e){d.id=e;c.fa.wa()&&Uq(c,d)}).catch(function(e){Uq(c,d);
Vq(c,e)})}else this.sendFn(a,b)};
p.sendThenWrite=function(a,b,c){var d=this;b=b===void 0?{}:b;if(Rq(this)&&this.h){var e={url:a,options:b,timestamp:this.now(),status:"NEW",sendCount:0};this.Z&&this.Z("nwl_skip_retry")&&(e.skipRetry=c);if(this.fa.wa()||this.Z&&this.Z("nwl_aggressive_send_then_write")&&!e.skipRetry){if(!e.skipRetry){var f=b.onError?b.onError:function(){};
b.onError=function(g,h){return A(function(k){if(k.h==1)return k.yield(d.ha.set(e,d.Y).catch(function(l){Vq(d,l)}),2);
f(g,h);k.h=0})}}this.sendFn(a,b,e.skipRetry)}else this.ha.set(e,this.Y).catch(function(g){d.sendFn(a,b,e.skipRetry);
Vq(d,g)})}else this.sendFn(a,b,this.Z&&this.Z("nwl_skip_retry")&&c)};
p.sendAndWrite=function(a,b){var c=this;b=b===void 0?{}:b;if(Rq(this)&&this.h){var d={url:a,options:b,timestamp:this.now(),status:"NEW",sendCount:0},e=!1,f=b.onSuccess?b.onSuccess:function(){};
d.options.onSuccess=function(g,h){d.id!==void 0?c.ha.nb(d.id,c.Y):e=!0;c.fa.fb&&c.Z&&c.Z("vss_network_hint")&&c.fa.fb(!0);f(g,h)};
this.sendFn(d.url,d.options,void 0,!0);this.ha.set(d,this.Y).then(function(g){d.id=g;e&&c.ha.nb(d.id,c.Y)}).catch(function(g){Vq(c,g)})}else this.sendFn(a,b,void 0,!0)};
p.Qb=function(){var a=this;if(!Rq(this))throw Error("IndexedDB is not supported: throttleSend");this.i||(this.i=this.Ea.qa(function(){var b;return A(function(c){if(c.h==1)return c.yield(a.ha.Zc("NEW",a.Y),2);if(c.h!=3)return b=c.i,b?c.yield(Uq(a,b),3):(a.Sc(),c.return());a.i&&(a.i=0,a.Qb());c.h=0})},this.xd))};
p.Sc=function(){this.Ea.ra(this.i);this.i=0};
function Uq(a,b){var c;return A(function(d){switch(d.h){case 1:if(!Rq(a))throw Error("IndexedDB is not supported: immediateSend");if(b.id===void 0){d.F(2);break}return d.yield(a.ha.qe(b.id,a.Y),3);case 3:(c=d.i)||a.ob(Error("The request cannot be found in the database."));case 2:if(Wq(a,b,a.pd)){d.F(4);break}a.ob(Error("Networkless Logging: Stored logs request expired age limit"));if(b.id===void 0){d.F(5);break}return d.yield(a.ha.nb(b.id,a.Y),5);case 5:return d.return();case 4:b.skipRetry||(b=Xq(a,
b));if(!b){d.F(0);break}if(!b.skipRetry||b.id===void 0){d.F(8);break}return d.yield(a.ha.nb(b.id,a.Y),8);case 8:a.sendFn(b.url,b.options,!!b.skipRetry),d.h=0}})}
function Xq(a,b){if(!Rq(a))throw Error("IndexedDB is not supported: updateRequestHandlers");var c=b.options.onError?b.options.onError:function(){};
b.options.onError=function(e,f){var g,h,k,l;return A(function(m){switch(m.h){case 1:g=Yq(f);(h=Zq(f))&&a.Z&&a.Z("web_enable_error_204")&&a.handleError(Error("Request failed due to compression"),b.url,f);if(!(a.Z&&a.Z("nwl_consider_error_code")&&g||a.Z&&!a.Z("nwl_consider_error_code")&&a.potentialEsfErrorCounter<=a.jc)){m.F(2);break}if(!a.fa.nc){m.F(3);break}return m.yield(a.fa.nc(),3);case 3:if(a.fa.wa()){m.F(2);break}c(e,f);if(!a.Z||!a.Z("nwl_consider_error_code")||((k=b)==null?void 0:k.id)===void 0){m.F(6);
break}return m.yield(a.ha.Jc(b.id,a.Y,!1),6);case 6:return m.return();case 2:if(a.Z&&a.Z("nwl_consider_error_code")&&!g&&a.potentialEsfErrorCounter>a.jc)return m.return();a.potentialEsfErrorCounter++;if(((l=b)==null?void 0:l.id)===void 0){m.F(8);break}return b.sendCount<a.sd?m.yield(a.ha.Jc(b.id,a.Y,!0,h?!1:void 0),12):m.yield(a.ha.nb(b.id,a.Y),8);case 12:a.Ea.qa(function(){a.fa.wa()&&a.Qb()},a.rd);
case 8:c(e,f),m.h=0}})};
var d=b.options.onSuccess?b.options.onSuccess:function(){};
b.options.onSuccess=function(e,f){var g;return A(function(h){if(h.h==1)return((g=b)==null?void 0:g.id)===void 0?h.F(2):h.yield(a.ha.nb(b.id,a.Y),2);a.fa.fb&&a.Z&&a.Z("vss_network_hint")&&a.fa.fb(!0);d(e,f);h.h=0})};
return b}
function Wq(a,b,c){b=b.timestamp;return a.now()-b>=c?!1:!0}
function Tq(a){if(!Rq(a))throw Error("IndexedDB is not supported: retryQueuedRequests");a.ha.Zc("QUEUED",a.Y).then(function(b){b&&!Wq(a,b,a.od)?a.Ea.qa(function(){return A(function(c){if(c.h==1)return b.id===void 0?c.F(2):c.yield(a.ha.Jc(b.id,a.Y),2);Tq(a);c.h=0})}):a.fa.wa()&&a.Qb()})}
function Vq(a,b){a.Ed&&!a.fa.wa()?a.Ed(b):a.handleError(b)}
function Rq(a){return!!a.Y||a.Vb}
function Yq(a){var b;return(a=a==null?void 0:(b=a.error)==null?void 0:b.code)&&a>=400&&a<=599?!1:!0}
function Zq(a){var b;a=a==null?void 0:(b=a.error)==null?void 0:b.code;return!(a!==400&&a!==415)}
;var $q;
function ar(){if($q)return $q();var a={};$q=Hp("LogsDatabaseV2",{wb:(a.LogsRequestsStore={Db:2},a),shared:!1,upgrade:function(b,c,d){c(2)&&No(b,"LogsRequestsStore",{keyPath:"id",autoIncrement:!0});c(3);c(5)&&(d=d.objectStore("LogsRequestsStore"),d.h.indexNames.contains("newRequest")&&d.h.deleteIndex("newRequest"),Uo(d,"newRequestV2",["status","interface","timestamp"]));c(7)&&b.h.objectStoreNames.contains("sapisid")&&b.h.deleteObjectStore("sapisid");c(9)&&b.h.objectStoreNames.contains("SWHealthLog")&&b.h.deleteObjectStore("SWHealthLog")},
version:9});return $q()}
;function br(a){return gp(ar(),a)}
function cr(a,b){var c,d,e,f;return A(function(g){if(g.h==1)return c={startTime:W(),infos:{transactionType:"YT_IDB_TRANSACTION_TYPE_WRITE"},ticks:{}},g.yield(br(b),2);if(g.h!=3)return d=g.i,e=Object.assign({},a,{options:JSON.parse(JSON.stringify(a.options)),interface:R("INNERTUBE_CONTEXT_CLIENT_NAME",0)}),g.yield(Po(d,"LogsRequestsStore",e),3);f=g.i;c.ticks.tc=W();dr(c);return g.return(f)})}
function er(a,b){var c,d,e,f,g,h,k,l;return A(function(m){if(m.h==1)return c={startTime:W(),infos:{transactionType:"YT_IDB_TRANSACTION_TYPE_READ"},ticks:{}},m.yield(br(b),2);if(m.h!=3)return d=m.i,e=R("INNERTUBE_CONTEXT_CLIENT_NAME",0),f=[a,e,0],g=[a,e,W()],h=IDBKeyRange.bound(f,g),k="prev",U("use_fifo_for_networkless")&&(k="next"),l=void 0,m.yield(Mo(d,["LogsRequestsStore"],{mode:"readwrite",la:!0},function(n){return $o(n.objectStore("LogsRequestsStore").index("newRequestV2"),{query:h,direction:k},
function(r){r.getValue()&&(l=r.getValue(),a==="NEW"&&(l.status="QUEUED",r.update(l)))})}),3);
c.ticks.tc=W();dr(c);return m.return(l)})}
function fr(a,b){var c;return A(function(d){if(d.h==1)return d.yield(br(b),2);c=d.i;return d.return(Mo(c,["LogsRequestsStore"],{mode:"readwrite",la:!0},function(e){var f=e.objectStore("LogsRequestsStore");return f.get(a).then(function(g){if(g)return g.status="QUEUED",Io(f.h.put(g,void 0)).then(function(){return g})})}))})}
function gr(a,b,c,d){c=c===void 0?!0:c;var e;return A(function(f){if(f.h==1)return f.yield(br(b),2);e=f.i;return f.return(Mo(e,["LogsRequestsStore"],{mode:"readwrite",la:!0},function(g){var h=g.objectStore("LogsRequestsStore");return h.get(a).then(function(k){return k?(k.status="NEW",c&&(k.sendCount+=1),d!==void 0&&(k.options.compress=d),Io(h.h.put(k,void 0)).then(function(){return k})):Co.resolve(void 0)})}))})}
function hr(a,b){var c;return A(function(d){if(d.h==1)return d.yield(br(b),2);c=d.i;return d.return(c.delete("LogsRequestsStore",a))})}
function ir(a){var b,c;return A(function(d){if(d.h==1)return d.yield(br(a),2);b=d.i;c=W()-2592E6;return d.yield(Mo(b,["LogsRequestsStore"],{mode:"readwrite",la:!0},function(e){return Wo(e.objectStore("LogsRequestsStore"),{},function(f){if(f.getValue().timestamp<=c)return f.delete().then(function(){return Xo(f)})})}),0)})}
function jr(){A(function(a){return a.yield(Dp(),0)})}
function dr(a){U("nwl_csi_killswitch")||nq("networkless_performance",a,{sampleRate:1})}
;var kr={accountStateChangeSignedIn:23,accountStateChangeSignedOut:24,delayedEventMetricCaptured:11,latencyActionBaselined:6,latencyActionInfo:7,latencyActionTicked:5,offlineTransferStatusChanged:2,offlineImageDownload:335,playbackStartStateChanged:9,systemHealthCaptured:3,mangoOnboardingCompleted:10,mangoPushNotificationReceived:230,mangoUnforkDbMigrationError:121,mangoUnforkDbMigrationSummary:122,mangoUnforkDbMigrationPreunforkDbVersionNumber:133,mangoUnforkDbMigrationPhoneMetadata:134,mangoUnforkDbMigrationPhoneStorage:135,
mangoUnforkDbMigrationStep:142,mangoAsyncApiMigrationEvent:223,mangoDownloadVideoResult:224,mangoHomepageVideoCount:279,mangoHomeV3State:295,mangoImageClientCacheHitEvent:273,sdCardStatusChanged:98,framesDropped:12,thumbnailHovered:13,deviceRetentionInfoCaptured:14,thumbnailLoaded:15,backToAppEvent:318,streamingStatsCaptured:17,offlineVideoShared:19,appCrashed:20,youThere:21,offlineStateSnapshot:22,mdxSessionStarted:25,mdxSessionConnected:26,mdxSessionDisconnected:27,bedrockResourceConsumptionSnapshot:28,
nextGenWatchWatchSwiped:29,kidsAccountsSnapshot:30,zeroStepChannelCreated:31,tvhtml5SearchCompleted:32,offlineSharePairing:34,offlineShareUnlock:35,mdxRouteDistributionSnapshot:36,bedrockRepetitiveActionTimed:37,unpluggedDegradationInfo:229,uploadMp4HeaderMoved:38,uploadVideoTranscoded:39,uploadProcessorStarted:46,uploadProcessorEnded:47,uploadProcessorReady:94,uploadProcessorRequirementPending:95,uploadProcessorInterrupted:96,uploadFrontendEvent:241,assetPackDownloadStarted:41,assetPackDownloaded:42,
assetPackApplied:43,assetPackDeleted:44,appInstallAttributionEvent:459,playbackSessionStopped:45,adBlockerMessagingShown:48,distributionChannelCaptured:49,dataPlanCpidRequested:51,detailedNetworkTypeCaptured:52,sendStateUpdated:53,receiveStateUpdated:54,sendDebugStateUpdated:55,receiveDebugStateUpdated:56,kidsErrored:57,mdxMsnSessionStatsFinished:58,appSettingsCaptured:59,mdxWebSocketServerHttpError:60,mdxWebSocketServer:61,startupCrashesDetected:62,coldStartInfo:435,offlinePlaybackStarted:63,liveChatMessageSent:225,
liveChatUserPresent:434,liveChatBeingModerated:457,liveCreationCameraUpdated:64,liveCreationEncodingCaptured:65,liveCreationError:66,liveCreationHealthUpdated:67,liveCreationVideoEffectsCaptured:68,liveCreationStageOccured:75,liveCreationBroadcastScheduled:123,liveCreationArchiveReplacement:149,liveCreationCostreamingConnection:421,liveCreationStreamWebrtcStats:288,mdxSessionRecoveryStarted:69,mdxSessionRecoveryCompleted:70,mdxSessionRecoveryStopped:71,visualElementShown:72,visualElementHidden:73,
visualElementGestured:78,visualElementStateChanged:208,screenCreated:156,playbackAssociated:202,visualElementAttached:215,playbackContextEvent:214,cloudCastingPlaybackStarted:74,webPlayerApiCalled:76,tvhtml5AccountDialogOpened:79,foregroundHeartbeat:80,foregroundHeartbeatScreenAssociated:111,kidsOfflineSnapshot:81,mdxEncryptionSessionStatsFinished:82,playerRequestCompleted:83,liteSchedulerStatistics:84,mdxSignIn:85,spacecastMetadataLookupRequested:86,spacecastBatchLookupRequested:87,spacecastSummaryRequested:88,
spacecastPlayback:89,spacecastDiscovery:90,tvhtml5LaunchUrlComponentChanged:91,mdxBackgroundPlaybackRequestCompleted:92,mdxBrokenAdditionalDataDeviceDetected:93,tvhtml5LocalStorage:97,tvhtml5DeviceStorageStatus:147,autoCaptionsAvailable:99,playbackScrubbingEvent:339,flexyState:100,interfaceOrientationCaptured:101,mainAppBrowseFragmentCache:102,offlineCacheVerificationFailure:103,offlinePlaybackExceptionDigest:217,vrCopresenceStats:104,vrCopresenceSyncStats:130,vrCopresenceCommsStats:137,vrCopresencePartyStats:153,
vrCopresenceEmojiStats:213,vrCopresenceEvent:141,vrCopresenceFlowTransitEvent:160,vrCowatchPartyEvent:492,vrCowatchUserStartOrJoinEvent:504,vrPlaybackEvent:345,kidsAgeGateTracking:105,offlineDelayAllowedTracking:106,mainAppAutoOfflineState:107,videoAsThumbnailDownload:108,videoAsThumbnailPlayback:109,liteShowMore:110,renderingError:118,kidsProfilePinGateTracking:119,abrTrajectory:124,scrollEvent:125,streamzIncremented:126,kidsProfileSwitcherTracking:127,kidsProfileCreationTracking:129,buyFlowStarted:136,
mbsConnectionInitiated:138,mbsPlaybackInitiated:139,mbsLoadChildren:140,liteProfileFetcher:144,mdxRemoteTransaction:146,reelPlaybackError:148,reachabilityDetectionEvent:150,mobilePlaybackEvent:151,courtsidePlayerStateChanged:152,musicPersistentCacheChecked:154,musicPersistentCacheCleared:155,playbackInterrupted:157,playbackInterruptionResolved:158,fixFopFlow:159,anrDetection:161,backstagePostCreationFlowEnded:162,clientError:163,gamingAccountLinkStatusChanged:164,liteHousewarming:165,buyFlowEvent:167,
kidsParentalGateTracking:168,kidsSignedOutSettingsStatus:437,kidsSignedOutPauseHistoryFixStatus:438,tvhtml5WatchdogViolation:444,ypcUpgradeFlow:169,yongleStudy:170,ypcUpdateFlowStarted:171,ypcUpdateFlowCancelled:172,ypcUpdateFlowSucceeded:173,ypcUpdateFlowFailed:174,liteGrowthkitPromo:175,paymentFlowStarted:341,transactionFlowShowPaymentDialog:405,transactionFlowStarted:176,transactionFlowSecondaryDeviceStarted:222,transactionFlowSecondaryDeviceSignedOutStarted:383,transactionFlowCancelled:177,transactionFlowPaymentCallBackReceived:387,
transactionFlowPaymentSubmitted:460,transactionFlowPaymentSucceeded:329,transactionFlowSucceeded:178,transactionFlowFailed:179,transactionFlowPlayBillingConnectionStartEvent:428,transactionFlowSecondaryDeviceSuccess:458,transactionFlowErrorEvent:411,liteVideoQualityChanged:180,watchBreakEnablementSettingEvent:181,watchBreakFrequencySettingEvent:182,videoEffectsCameraPerformanceMetrics:183,adNotify:184,startupTelemetry:185,playbackOfflineFallbackUsed:186,outOfMemory:187,ypcPauseFlowStarted:188,ypcPauseFlowCancelled:189,
ypcPauseFlowSucceeded:190,ypcPauseFlowFailed:191,uploadFileSelected:192,ypcResumeFlowStarted:193,ypcResumeFlowCancelled:194,ypcResumeFlowSucceeded:195,ypcResumeFlowFailed:196,adsClientStateChange:197,ypcCancelFlowStarted:198,ypcCancelFlowCancelled:199,ypcCancelFlowSucceeded:200,ypcCancelFlowFailed:201,ypcCancelFlowGoToPaymentProcessor:402,ypcDeactivateFlowStarted:320,ypcRedeemFlowStarted:203,ypcRedeemFlowCancelled:204,ypcRedeemFlowSucceeded:205,ypcRedeemFlowFailed:206,ypcFamilyCreateFlowStarted:258,
ypcFamilyCreateFlowCancelled:259,ypcFamilyCreateFlowSucceeded:260,ypcFamilyCreateFlowFailed:261,ypcFamilyManageFlowStarted:262,ypcFamilyManageFlowCancelled:263,ypcFamilyManageFlowSucceeded:264,ypcFamilyManageFlowFailed:265,restoreContextEvent:207,embedsAdEvent:327,autoplayTriggered:209,clientDataErrorEvent:210,experimentalVssValidation:211,tvhtml5TriggeredEvent:212,tvhtml5FrameworksFieldTrialResult:216,tvhtml5FrameworksFieldTrialStart:220,musicOfflinePreferences:218,watchTimeSegment:219,appWidthLayoutError:221,
accountRegistryChange:226,userMentionAutoCompleteBoxEvent:227,downloadRecommendationEnablementSettingEvent:228,musicPlaybackContentModeChangeEvent:231,offlineDbOpenCompleted:232,kidsFlowEvent:233,kidsFlowCorpusSelectedEvent:234,videoEffectsEvent:235,unpluggedOpsEogAnalyticsEvent:236,playbackAudioRouteEvent:237,interactionLoggingDebugModeError:238,offlineYtbRefreshed:239,kidsFlowError:240,musicAutoplayOnLaunchAttempted:242,deviceContextActivityEvent:243,deviceContextEvent:244,templateResolutionException:245,
musicSideloadedPlaylistServiceCalled:246,embedsStorageAccessNotChecked:247,embedsHasStorageAccessResult:248,embedsItpPlayedOnReload:249,embedsRequestStorageAccessResult:250,embedsShouldRequestStorageAccessResult:251,embedsRequestStorageAccessState:256,embedsRequestStorageAccessFailedState:257,embedsItpWatchLaterResult:266,searchSuggestDecodingPayloadFailure:252,siriShortcutActivated:253,tvhtml5KeyboardPerformance:254,latencyActionSpan:255,elementsLog:267,ytbFileOpened:268,tfliteModelError:269,apiTest:270,
yongleUsbSetup:271,touStrikeInterstitialEvent:272,liteStreamToSave:274,appBundleClientEvent:275,ytbFileCreationFailed:276,adNotifyFailure:278,ytbTransferFailed:280,blockingRequestFailed:281,liteAccountSelector:282,liteAccountUiCallbacks:283,dummyPayload:284,browseResponseValidationEvent:285,entitiesError:286,musicIosBackgroundFetch:287,mdxNotificationEvent:289,layersValidationError:290,musicPwaInstalled:291,liteAccountCleanup:292,html5PlayerHealthEvent:293,watchRestoreAttempt:294,liteAccountSignIn:296,
notaireEvent:298,kidsVoiceSearchEvent:299,adNotifyFilled:300,delayedEventDropped:301,analyticsSearchEvent:302,systemDarkThemeOptOutEvent:303,flowEvent:304,networkConnectivityBaselineEvent:305,ytbFileImported:306,downloadStreamUrlExpired:307,directSignInEvent:308,lyricImpressionEvent:309,accessibilityStateEvent:310,tokenRefreshEvent:311,genericAttestationExecution:312,tvhtml5VideoSeek:313,unpluggedAutoPause:314,scrubbingEvent:315,bedtimeReminderEvent:317,tvhtml5UnexpectedRestart:319,tvhtml5StabilityTraceEvent:478,
tvhtml5OperationHealth:467,tvhtml5WatchKeyEvent:321,voiceLanguageChanged:322,tvhtml5LiveChatStatus:323,parentToolsCorpusSelectedEvent:324,offerAdsEnrollmentInitiated:325,networkQualityIntervalEvent:326,deviceStartupMetrics:328,heartbeatActionPlayerTransitioned:330,tvhtml5Lifecycle:331,heartbeatActionPlayerHalted:332,adaptiveInlineMutedSettingEvent:333,mainAppLibraryLoadingState:334,thirdPartyLogMonitoringEvent:336,appShellAssetLoadReport:337,tvhtml5AndroidAttestation:338,tvhtml5StartupSoundEvent:340,
iosBackgroundRefreshTask:342,iosBackgroundProcessingTask:343,sliEventBatch:344,postImpressionEvent:346,musicSideloadedPlaylistExport:347,idbUnexpectedlyClosed:348,voiceSearchEvent:349,mdxSessionCastEvent:350,idbQuotaExceeded:351,idbTransactionEnded:352,idbTransactionAborted:353,tvhtml5KeyboardLogging:354,idbIsSupportedCompleted:355,creatorStudioMobileEvent:356,idbDataCorrupted:357,parentToolsAppChosenEvent:358,webViewBottomSheetResized:359,activeStateControllerScrollPerformanceSummary:360,navigatorValidation:361,
mdxSessionHeartbeat:362,clientHintsPolyfillDiagnostics:363,clientHintsPolyfillEvent:364,proofOfOriginTokenError:365,kidsAddedAccountSummary:366,musicWearableDevice:367,ypcRefundFlowEvent:368,tvhtml5PlaybackMeasurementEvent:369,tvhtml5WatermarkMeasurementEvent:370,clientExpGcfPropagationEvent:371,mainAppReferrerIntent:372,leaderLockEnded:373,leaderLockAcquired:374,googleHatsEvent:375,persistentLensLaunchEvent:376,parentToolsChildWelcomeChosenEvent:378,browseThumbnailPreloadEvent:379,finalPayload:380,
mdxDialAdditionalDataUpdateEvent:381,webOrchestrationTaskLifecycleRecord:382,startupSignalEvent:384,accountError:385,gmsDeviceCheckEvent:386,accountSelectorEvent:388,accountUiCallbacks:389,mdxDialAdditionalDataProbeEvent:390,downloadsSearchIcingApiStats:391,downloadsSearchIndexUpdatedEvent:397,downloadsSearchIndexSnapshot:398,dataPushClientEvent:392,kidsCategorySelectedEvent:393,mdxDeviceManagementSnapshotEvent:394,prefetchRequested:395,prefetchableCommandExecuted:396,gelDebuggingEvent:399,webLinkTtsPlayEnd:400,
clipViewInvalid:401,persistentStorageStateChecked:403,cacheWipeoutEvent:404,playerEvent:410,sfvEffectPipelineStartedEvent:412,sfvEffectPipelinePausedEvent:429,sfvEffectPipelineEndedEvent:413,sfvEffectChosenEvent:414,sfvEffectLoadedEvent:415,sfvEffectUserInteractionEvent:465,sfvEffectFirstFrameProcessedLatencyEvent:416,sfvEffectAggregatedFramesProcessedLatencyEvent:417,sfvEffectAggregatedFramesDroppedEvent:418,sfvEffectPipelineErrorEvent:430,sfvEffectGraphFrozenEvent:419,sfvEffectGlThreadBlockedEvent:420,
mdeVideoChangedEvent:442,mdePlayerPerformanceMetrics:472,mdeExporterEvent:497,genericClientExperimentEvent:423,homePreloadTaskScheduled:424,homePreloadTaskExecuted:425,homePreloadCacheHit:426,polymerPropertyChangedInObserver:427,applicationStarted:431,networkCronetRttBatch:432,networkCronetRttSummary:433,repeatChapterLoopEvent:436,seekCancellationEvent:462,lockModeTimeoutEvent:483,externalVideoShareToYoutubeAttempt:501,parentCodeEvent:502,offlineTransferStarted:4,musicOfflineMixtapePreferencesChanged:16,
mangoDailyNewVideosNotificationAttempt:40,mangoDailyNewVideosNotificationError:77,dtwsPlaybackStarted:112,dtwsTileFetchStarted:113,dtwsTileFetchCompleted:114,dtwsTileFetchStatusChanged:145,dtwsKeyframeDecoderBufferSent:115,dtwsTileUnderflowedOnNonkeyframe:116,dtwsBackfillFetchStatusChanged:143,dtwsBackfillUnderflowed:117,dtwsAdaptiveLevelChanged:128,blockingVisitorIdTimeout:277,liteSocial:18,mobileJsInvocation:297,biscottiBasedDetection:439,coWatchStateChange:440,embedsVideoDataDidChange:441,shortsFirst:443,
cruiseControlEvent:445,qoeClientLoggingContext:446,atvRecommendationJobExecuted:447,tvhtml5UserFeedback:448,producerProjectCreated:449,producerProjectOpened:450,producerProjectDeleted:451,producerProjectElementAdded:453,producerProjectElementRemoved:454,tvhtml5ShowClockEvent:455,deviceCapabilityCheckMetrics:456,youtubeClearcutEvent:461,offlineBrowseFallbackEvent:463,getCtvTokenEvent:464,startupDroppedFramesSummary:466,screenshotEvent:468,miniAppPlayEvent:469,elementsDebugCounters:470,fontLoadEvent:471,
webKillswitchReceived:473,webKillswitchExecuted:474,cameraOpenEvent:475,manualSmoothnessMeasurement:476,tvhtml5AppQualityEvent:477,polymerPropertyAccessEvent:479,miniAppSdkUsage:480,cobaltTelemetryEvent:481,crossDevicePlayback:482,channelCreatedWithObakeImage:484,channelEditedWithObakeImage:485,offlineDeleteEvent:486,crossDeviceNotificationTransfer:487,androidIntentEvent:488,unpluggedAmbientInterludesCounterfactualEvent:489,keyPlaysPlayback:490,shortsCreationFallbackEvent:493,vssData:491,castMatch:494,
miniAppPerformanceMetrics:495,userFeedbackEvent:496,kidsGuestSessionMismatch:498,musicSideloadedPlaylistMigrationEvent:499,sleepTimerSessionFinishEvent:500,watchEpPromoConflict:503};var lr={},mr=Hp("ServiceWorkerLogsDatabase",{wb:(lr.SWHealthLog={Db:1},lr),shared:!0,upgrade:function(a,b){b(1)&&Uo(No(a,"SWHealthLog",{keyPath:"id",autoIncrement:!0}),"swHealthNewRequest",["interface","timestamp"])},
version:1});function nr(a){return gp(mr(),a)}
function or(a){var b,c;A(function(d){if(d.h==1)return d.yield(nr(a),2);b=d.i;c=W()-2592E6;return d.yield(Mo(b,["SWHealthLog"],{mode:"readwrite",la:!0},function(e){return Wo(e.objectStore("SWHealthLog"),{},function(f){if(f.getValue().timestamp<=c)return f.delete().then(function(){return Xo(f)})})}),0)})}
function pr(a){var b;return A(function(c){if(c.h==1)return c.yield(nr(a),2);b=c.i;return c.yield(b.clear("SWHealthLog"),0)})}
;var qr={},rr=0;function sr(a){var b=new Image,c=""+rr++;qr[c]=b;b.onload=b.onerror=function(){delete qr[c]};
b.src=a}
;var tr;function ur(){tr||(tr=new Xn("yt.offline"));return tr}
function vr(a){if(U("offline_error_handling")){var b=ur().get("errors",!0)||{};b[a.message]={name:a.name,stack:a.stack};a.level&&(b[a.message].level=a.level);ur().set("errors",b,2592E3,!0)}}
;function wr(){this.h=new Map;this.i=!1}
function xr(){if(!wr.h){var a=E("yt.networkRequestMonitor.instance")||new wr;D("yt.networkRequestMonitor.instance",a);wr.h=a}return wr.h}
wr.prototype.requestComplete=function(a,b){b&&(this.i=!0);a=this.removeParams(a);this.h.get(a)||this.h.set(a,b)};
wr.prototype.isEndpointCFR=function(a){a=this.removeParams(a);return(a=this.h.get(a))?!1:a===!1&&this.i?!0:null};
wr.prototype.removeParams=function(a){return a.split("?")[0]};
wr.prototype.removeParams=wr.prototype.removeParams;wr.prototype.isEndpointCFR=wr.prototype.isEndpointCFR;wr.prototype.requestComplete=wr.prototype.requestComplete;wr.getInstance=xr;function yr(){Ph.call(this);var a=this;this.j=!1;this.i=xj();this.i.listen("networkstatus-online",function(){if(a.j&&U("offline_error_handling")){var b=ur().get("errors",!0);if(b){for(var c in b)if(b[c]){var d=new V(c,"sent via offline_errors");d.name=b[c].name;d.stack=b[c].stack;d.level=b[c].level;Tl(d)}ur().set("errors",{},2592E3,!0)}}})}
x(yr,Ph);function zr(){if(!yr.h){var a=E("yt.networkStatusManager.instance")||new yr;D("yt.networkStatusManager.instance",a);yr.h=a}return yr.h}
p=yr.prototype;p.wa=function(){return this.i.wa()};
p.fb=function(a){this.i.i=a};
p.ae=function(){var a=window.navigator.onLine;return a===void 0?!0:a};
p.Sd=function(){this.j=!0};
p.listen=function(a,b){return this.i.listen(a,b)};
p.nc=function(a){a=vj(this.i,a);a.then(function(b){U("use_cfr_monitor")&&xr().requestComplete("generate_204",b)});
return a};
yr.prototype.sendNetworkCheckRequest=yr.prototype.nc;yr.prototype.listen=yr.prototype.listen;yr.prototype.enableErrorFlushing=yr.prototype.Sd;yr.prototype.getWindowStatus=yr.prototype.ae;yr.prototype.networkStatusHint=yr.prototype.fb;yr.prototype.isNetworkAvailable=yr.prototype.wa;yr.getInstance=zr;function Ar(a){a=a===void 0?{}:a;Ph.call(this);var b=this;this.i=this.u=0;this.j=zr();var c=E("yt.networkStatusManager.instance.listen").bind(this.j);c&&(a.rateLimit?(this.rateLimit=a.rateLimit,c("networkstatus-online",function(){Br(b,"publicytnetworkstatus-online")}),c("networkstatus-offline",function(){Br(b,"publicytnetworkstatus-offline")})):(c("networkstatus-online",function(){Qh(b,"publicytnetworkstatus-online")}),c("networkstatus-offline",function(){Qh(b,"publicytnetworkstatus-offline")})))}
x(Ar,Ph);Ar.prototype.wa=function(){var a=E("yt.networkStatusManager.instance.isNetworkAvailable");return a?a.bind(this.j)():!0};
Ar.prototype.fb=function(a){var b=E("yt.networkStatusManager.instance.networkStatusHint").bind(this.j);b&&b(a)};
Ar.prototype.nc=function(a){var b=this,c;return A(function(d){c=E("yt.networkStatusManager.instance.sendNetworkCheckRequest").bind(b.j);return U("skip_network_check_if_cfr")&&xr().isEndpointCFR("generate_204")?d.return(new Promise(function(e){var f;b.fb(((f=window.navigator)==null?void 0:f.onLine)||!0);e(b.wa())})):c?d.return(c(a)):d.return(!0)})};
function Br(a,b){a.rateLimit?a.i?(yj.ra(a.u),a.u=yj.qa(function(){a.o!==b&&(Qh(a,b),a.o=b,a.i=W())},a.rateLimit-(W()-a.i))):(Qh(a,b),a.o=b,a.i=W()):Qh(a,b)}
;var Cr;function Dr(){var a=Qq.call;Cr||(Cr=new Ar({Zg:!0,Sg:!0}));a.call(Qq,this,{ha:{Md:ir,nb:hr,Zc:er,qe:fr,Jc:gr,set:cr},fa:Cr,handleError:function(b,c,d){var e,f=d==null?void 0:(e=d.error)==null?void 0:e.code;if(f===400||f===415){var g;Ul(new V(b.message,c,d==null?void 0:(g=d.error)==null?void 0:g.code),void 0,void 0,void 0,!0)}else Tl(b)},
ob:Ul,sendFn:Er,now:W,Ed:vr,Ea:Wn(),Ic:"publicytnetworkstatus-online",Fc:"publicytnetworkstatus-offline",ac:!0,Yb:.1,jc:mm("potential_esf_error_limit",10),Z:U,Gb:!(on()&&Fr())});this.j=new jj;U("networkless_immediately_drop_all_requests")&&jr();Ep("LogsDatabaseV2")}
x(Dr,Qq);function Gr(){var a=E("yt.networklessRequestController.instance");a||(a=new Dr,D("yt.networklessRequestController.instance",a),U("networkless_logging")&&tp().then(function(b){a.Y=b;Sq(a);a.j.resolve();a.ac&&Math.random()<=a.Yb&&a.Y&&or(a.Y);U("networkless_immediately_drop_sw_health_store")&&Hr(a)}));
return a}
Dr.prototype.writeThenSend=function(a,b){b||(b={});b=Mr(a,b);on()||(this.h=!1);Qq.prototype.writeThenSend.call(this,a,b)};
Dr.prototype.sendThenWrite=function(a,b,c){b||(b={});b=Mr(a,b);on()||(this.h=!1);Qq.prototype.sendThenWrite.call(this,a,b,c)};
Dr.prototype.sendAndWrite=function(a,b){b||(b={});b=Mr(a,b);on()||(this.h=!1);Qq.prototype.sendAndWrite.call(this,a,b)};
Dr.prototype.awaitInitialization=function(){return this.j.promise};
function Hr(a){var b;A(function(c){if(!a.Y)throw b=yo("clearSWHealthLogsDb"),b;return c.return(pr(a.Y).catch(function(d){a.handleError(d)}))})}
function Er(a,b,c,d){d=d===void 0?!1:d;b=U("web_fp_via_jspb")?Object.assign({},b):b;U("use_cfr_monitor")&&Nr(a,b);if(U("use_request_time_ms_header"))b.headers&&dm(a)&&(b.headers["X-Goog-Request-Time"]=JSON.stringify(Math.round(W())));else{var e;if((e=b.postParams)==null?0:e.requestTimeMs)b.postParams.requestTimeMs=Math.round(W())}if(c&&Object.keys(b).length===0){var f=f===void 0?"":f;var g=g===void 0?!1:g;var h=h===void 0?!1:h;if(a)if(f)rm(a,void 0,"POST",f,void 0);else if(R("USE_NET_AJAX_FOR_PING_TRANSPORT",
!1)||h)rm(a,void 0,"GET","",void 0,void 0,g,h);else{b:{try{var k=new bb({url:a});if(k.j&&k.i||k.o){var l=$b(ac(5,a)),m;if(!(m=!l||!l.endsWith("/aclk"))){var n=a.search(jc),r=ic(a,0,"ri",n);if(r<0)var t=null;else{var w=a.indexOf("&",r);if(w<0||w>n)w=n;t=decodeURIComponent(a.slice(r+3,w!==-1?w:0).replace(/\+/g," "))}m=t!=="1"}var y=!m;break b}}catch(G){}y=!1}if(y){b:{try{if(window.navigator&&window.navigator.sendBeacon&&window.navigator.sendBeacon(a,"")){var z=!0;break b}}catch(G){}z=!1}c=z?!0:!1}else c=
!1;c||sr(a)}}else b.compress?b.postBody?(typeof b.postBody!=="string"&&(b.postBody=JSON.stringify(b.postBody)),Fq(a,b.postBody,b,wm,d)):Fq(a,JSON.stringify(b.postParams),b,um,d):wm(a,b)}
function Mr(a,b){U("use_event_time_ms_header")&&dm(a)&&(b.headers||(b.headers={}),b.headers["X-Goog-Event-Time"]=JSON.stringify(Math.round(W())));return b}
function Nr(a,b){var c=b.onError?b.onError:function(){};
b.onError=function(e,f){xr().requestComplete(a,!1);c(e,f)};
var d=b.onSuccess?b.onSuccess:function(){};
b.onSuccess=function(e,f){xr().requestComplete(a,!0);d(e,f)}}
function Fr(){return bc(document.location.toString())!=="www.youtube-nocookie.com"}
;var Or=!1,Pr=C.ytNetworklessLoggingInitializationOptions||{isNwlInitialized:Or};D("ytNetworklessLoggingInitializationOptions",Pr);function Qr(){var a;A(function(b){if(b.h==1)return b.yield(tp(),2);a=b.i;if(!a||!on()&&!U("nwl_init_require_datasync_id_killswitch")||!Fr())return b.F(0);Or=!0;Pr.isNwlInitialized=Or;return b.yield(Gr().awaitInitialization(),0)})}
;function Rr(a){var b=this;this.config_=null;a?this.config_=a:Vp()&&(this.config_=Wp());rn(function(){Oq(b)},5E3)}
Rr.prototype.isReady=function(){!this.config_&&Vp()&&(this.config_=Wp());return!!this.config_};
function Pq(a,b,c,d){function e(w){w=w===void 0?!1:w;var y;if(d.retry&&h!="www.youtube-nocookie.com"&&(w||U("skip_ls_gel_retry")||g.headers["Content-Type"]!=="application/json"||(y=Mq(b,c,l,k)),y)){var z=g.onSuccess,G=g.onFetchSuccess;g.onSuccess=function(S,ta){Nq(y);z(S,ta)};
c.onFetchSuccess=function(S,ta){Nq(y);G(S,ta)}}try{if(w&&d.retry&&!d.networklessOptions.bypassNetworkless)g.method="POST",d.networklessOptions.writeThenSend?Gr().writeThenSend(t,g):Gr().sendAndWrite(t,g);
else if(d.compress){var I=!d.networklessOptions.writeThenSend;if(g.postBody){var N=g.postBody;typeof N!=="string"&&(N=JSON.stringify(g.postBody));Fq(t,N,g,wm,I)}else Fq(t,JSON.stringify(g.postParams),g,um,I)}else U("web_all_payloads_via_jspb")?wm(t,g):um(t,g)}catch(S){if(S.name==="InvalidAccessError")y&&(Nq(y),y=0),Ul(Error("An extension is blocking network request."));else throw S;}y&&rn(function(){Oq(a)},5E3)}
!R("VISITOR_DATA")&&b!=="visitor_id"&&Math.random()<.01&&Ul(new V("Missing VISITOR_DATA when sending innertube request.",b,c,d));if(!a.isReady()){var f=new V("innertube xhrclient not ready",b,c,d);Tl(f);throw f;}var g={headers:d.headers||{},method:"POST",postParams:c,postBody:d.postBody,postBodyFormat:d.postBodyFormat||"JSON",onTimeout:function(){d.onTimeout()},
onFetchTimeout:d.onTimeout,onSuccess:function(w,y){if(d.onSuccess)d.onSuccess(y)},
onFetchSuccess:function(w){if(d.onSuccess)d.onSuccess(w)},
onError:function(w,y){if(d.onError)d.onError(y)},
onFetchError:function(w){if(d.onError)d.onError(w)},
timeout:d.timeout,withCredentials:!0,compress:d.compress};g.headers["Content-Type"]||(g.headers["Content-Type"]="application/json");var h="";(f=a.config_.je)&&(h=f);var k=a.config_.le||!1,l=Yp(k,h,d);Object.assign(g.headers,l);(f=g.headers.Authorization)&&!h&&k&&(g.headers["x-origin"]=window.location.origin);var m="/youtubei/"+a.config_.innertubeApiVersion+"/"+b,n={alt:"json"},r=a.config_.ke&&f;r=r&&f.startsWith("Bearer");r||(n.key=a.config_.innertubeApiKey);var t=cm(""+h+m,n||{},!0);(E("ytNetworklessLoggingInitializationOptions")?
Pr.isNwlInitialized:Or)?rp().then(function(w){e(w)}):e(!1)}
;var Sr=0,Tr=Wc?"webkit":Vc?"moz":Tc?"ms":Sc?"o":"";D("ytDomDomGetNextId",E("ytDomDomGetNextId")||function(){return++Sr});var Ur={stopImmediatePropagation:1,stopPropagation:1,preventMouseEvent:1,preventManipulation:1,preventDefault:1,layerX:1,layerY:1,screenX:1,screenY:1,scale:1,rotation:1,webkitMovementX:1,webkitMovementY:1};
function Vr(a){this.type="";this.state=this.source=this.data=this.currentTarget=this.relatedTarget=this.target=null;this.charCode=this.keyCode=0;this.metaKey=this.shiftKey=this.ctrlKey=this.altKey=!1;this.rotation=this.clientY=this.clientX=0;this.scale=1;this.changedTouches=this.touches=null;try{if(a=a||window.event){this.event=a;for(var b in a)b in Ur||(this[b]=a[b]);this.scale=a.scale;this.rotation=a.rotation;var c=a.target||a.srcElement;c&&c.nodeType==3&&(c=c.parentNode);this.target=c;var d=a.relatedTarget;
if(d)try{d=d.nodeName?d:null}catch(e){d=null}else this.type=="mouseover"?d=a.fromElement:this.type=="mouseout"&&(d=a.toElement);this.relatedTarget=d;this.clientX=a.clientX!=void 0?a.clientX:a.pageX;this.clientY=a.clientY!=void 0?a.clientY:a.pageY;this.keyCode=a.keyCode?a.keyCode:a.which;this.charCode=a.charCode||(this.type=="keypress"?this.keyCode:0);this.altKey=a.altKey;this.ctrlKey=a.ctrlKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.h=a.pageX;this.i=a.pageY}}catch(e){}}
function Wr(a){if(document.body&&document.documentElement){var b=document.body.scrollTop+document.documentElement.scrollTop;a.h=a.clientX+(document.body.scrollLeft+document.documentElement.scrollLeft);a.i=a.clientY+b}}
Vr.prototype.preventDefault=function(){this.event&&(this.event.returnValue=!1,this.event.preventDefault&&this.event.preventDefault())};
Vr.prototype.stopPropagation=function(){this.event&&(this.event.cancelBubble=!0,this.event.stopPropagation&&this.event.stopPropagation())};
Vr.prototype.stopImmediatePropagation=function(){this.event&&(this.event.cancelBubble=!0,this.event.stopImmediatePropagation&&this.event.stopImmediatePropagation())};var pg=C.ytEventsEventsListeners||{};D("ytEventsEventsListeners",pg);var Xr=C.ytEventsEventsCounter||{count:0};D("ytEventsEventsCounter",Xr);
function Yr(a,b,c,d){d=d===void 0?{}:d;a.addEventListener&&(b!="mouseenter"||"onmouseenter"in document?b!="mouseleave"||"onmouseenter"in document?b=="mousewheel"&&"MozBoxSizing"in document.documentElement.style&&(b="MozMousePixelScroll"):b="mouseout":b="mouseover");return og(function(e){var f=typeof e[4]==="boolean"&&e[4]==!!d,g=Qa(e[4])&&Qa(d)&&tg(e[4],d);return!!e.length&&e[0]==a&&e[1]==b&&e[2]==c&&(f||g)})}
function Zr(a,b,c,d){d=d===void 0?{}:d;if(!a||!a.addEventListener&&!a.attachEvent)return"";var e=Yr(a,b,c,d);if(e)return e;e=++Xr.count+"";var f=!(b!="mouseenter"&&b!="mouseleave"||!a.addEventListener||"onmouseenter"in document);var g=f?function(h){h=new Vr(h);if(!Cg(h.relatedTarget,function(k){return k==a}))return h.currentTarget=a,h.type=b,c.call(a,h)}:function(h){h=new Vr(h);
h.currentTarget=a;return c.call(a,h)};
g=Sl(g);a.addEventListener?(b=="mouseenter"&&f?b="mouseover":b=="mouseleave"&&f?b="mouseout":b=="mousewheel"&&"MozBoxSizing"in document.documentElement.style&&(b="MozMousePixelScroll"),$r()||typeof d==="boolean"?a.addEventListener(b,g,d):a.addEventListener(b,g,!!d.capture)):a.attachEvent("on"+b,g);pg[e]=[a,b,c,g,d];return e}
function as(a){a&&(typeof a=="string"&&(a=[a]),Mb(a,function(b){if(b in pg){var c=pg[b],d=c[0],e=c[1],f=c[3];c=c[4];d.removeEventListener?$r()||typeof c==="boolean"?d.removeEventListener(e,f,c):d.removeEventListener(e,f,!!c.capture):d.detachEvent&&d.detachEvent("on"+e,f);delete pg[b]}}))}
var $r=Vh(function(){var a=!1;try{var b=Object.defineProperty({},"capture",{get:function(){a=!0}});
window.addEventListener("test",null,b)}catch(c){}return a});function bs(a){this.G=a;this.h=null;this.o=0;this.A=null;this.u=0;this.i=[];for(a=0;a<4;a++)this.i.push(0);this.j=0;this.T=Zr(window,"mousemove",Wa(this.W,this));a=Wa(this.I,this);typeof a==="function"&&(a=Sl(a));this.X=window.setInterval(a,25)}
Za(bs,L);bs.prototype.W=function(a){a.h===void 0&&Wr(a);var b=a.h;a.i===void 0&&Wr(a);this.h=new yg(b,a.i)};
bs.prototype.I=function(){if(this.h){var a=W();if(this.o!=0){var b=this.A,c=this.h,d=b.x-c.x;b=b.y-c.y;d=Math.sqrt(d*d+b*b)/(a-this.o);this.i[this.j]=Math.abs((d-this.u)/this.u)>.5?1:0;for(c=b=0;c<4;c++)b+=this.i[c]||0;b>=3&&this.G();this.u=d}this.o=a;this.A=this.h;this.j=(this.j+1)%4}};
bs.prototype.ba=function(){window.clearInterval(this.X);as(this.T)};var cs={};
function ds(a){var b=a===void 0?{}:a;a=b.Ae===void 0?!1:b.Ae;b=b.Td===void 0?!0:b.Td;if(E("_lact",window)==null){var c=parseInt(R("LACT"),10);c=isFinite(c)?Date.now()-Math.max(c,0):-1;D("_lact",c,window);D("_fact",c,window);c==-1&&es();Zr(document,"keydown",es);Zr(document,"keyup",es);Zr(document,"mousedown",es);Zr(document,"mouseup",es);a?Zr(window,"touchmove",function(){gs("touchmove",200)},{passive:!0}):(Zr(window,"resize",function(){gs("resize",200)}),b&&Zr(window,"scroll",function(){gs("scroll",200)}));
new bs(function(){gs("mouse",100)});
Zr(document,"touchstart",es,{passive:!0});Zr(document,"touchend",es,{passive:!0})}}
function gs(a,b){cs[a]||(cs[a]=!0,yj.qa(function(){es();cs[a]=!1},b))}
function es(){E("_lact",window)==null&&ds();var a=Date.now();D("_lact",a,window);E("_fact",window)==-1&&D("_fact",a,window);(a=E("ytglobal.ytUtilActivityCallback_"))&&a()}
function hs(){var a=E("_lact",window);return a==null?-1:Math.max(Date.now()-a,0)}
;var is=C.ytPubsubPubsubInstance||new M,js=C.ytPubsubPubsubSubscribedKeys||{},ks=C.ytPubsubPubsubTopicToKeys||{},ls=C.ytPubsubPubsubIsSynchronous||{};function ms(a,b){var c=ns();if(c&&b){var d=c.subscribe(a,function(){function e(){js[d]&&b.apply&&typeof b.apply=="function"&&b.apply(window,f)}
var f=arguments;try{ls[a]?e():jm(e,0)}catch(g){Tl(g)}},void 0);
js[d]=!0;ks[a]||(ks[a]=[]);ks[a].push(d);return d}return 0}
function ps(a){var b=ns();b&&(typeof a==="number"?a=[a]:typeof a==="string"&&(a=[parseInt(a,10)]),Mb(a,function(c){b.unsubscribeByKey(c);delete js[c]}))}
function qs(a,b){var c=ns();c&&c.publish.apply(c,arguments)}
function rs(a){var b=ns();if(b)if(b.clear(a),a)ss(a);else for(var c in ks)ss(c)}
function ns(){return C.ytPubsubPubsubInstance}
function ss(a){ks[a]&&(a=ks[a],Mb(a,function(b){js[b]&&delete js[b]}),a.length=0)}
M.prototype.subscribe=M.prototype.subscribe;M.prototype.unsubscribeByKey=M.prototype.Rb;M.prototype.publish=M.prototype.kb;M.prototype.clear=M.prototype.clear;D("ytPubsubPubsubInstance",is);D("ytPubsubPubsubTopicToKeys",ks);D("ytPubsubPubsubIsSynchronous",ls);D("ytPubsubPubsubSubscribedKeys",js);var ts=Symbol("injectionDeps");function us(a){this.name=a}
us.prototype.toString=function(){return"InjectionToken("+this.name+")"};
function vs(a){this.key=a}
function ws(){this.i=new Map;this.j=new Map;this.h=new Map}
function xs(a,b){a.i.set(b.lc,b);var c=a.j.get(b.lc);if(c)try{c.ih(a.resolve(b.lc))}catch(d){c.gh(d)}}
ws.prototype.resolve=function(a){return a instanceof vs?ys(this,a.key,[],!0):ys(this,a,[])};
function ys(a,b,c,d){d=d===void 0?!1:d;if(c.indexOf(b)>-1)throw Error("Deps cycle for: "+b);if(a.h.has(b))return a.h.get(b);if(!a.i.has(b)){if(d)return;throw Error("No provider for: "+b);}d=a.i.get(b);c.push(b);if(d.Ad!==void 0)var e=d.Ad;else if(d.jf)e=d[ts]?zs(a,d[ts],c):[],e=d.jf.apply(d,ja(e));else if(d.zd){e=d.zd;var f=e[ts]?zs(a,e[ts],c):[];e=new (Function.prototype.bind.apply(e,[null].concat(ja(f))))}else throw Error("Could not resolve providers for: "+b);c.pop();d.lh||a.h.set(b,e);return e}
function zs(a,b,c){return b?b.map(function(d){return d instanceof vs?ys(a,d.key,c,!0):ys(a,d,c)}):[]}
;var As;function Bs(){As||(As=new ws);return As}
;var Cs=window;function Ds(){var a,b;return"h5vcc"in Cs&&((a=Cs.h5vcc.traceEvent)==null?0:a.traceBegin)&&((b=Cs.h5vcc.traceEvent)==null?0:b.traceEnd)?1:"performance"in Cs&&Cs.performance.mark&&Cs.performance.measure?2:0}
function Es(a){var b=Ds();switch(b){case 1:Cs.h5vcc.traceEvent.traceBegin("YTLR",a);break;case 2:Cs.performance.mark(a+"-start");break;case 0:break;default:Db(b,"unknown trace type")}}
function Fs(a){var b=Ds();switch(b){case 1:Cs.h5vcc.traceEvent.traceEnd("YTLR",a);break;case 2:b=a+"-start";var c=a+"-end";Cs.performance.mark(c);Cs.performance.measure(a,b,c);break;case 0:break;default:Db(b,"unknown trace type")}}
;var Gs=U("web_enable_lifecycle_monitoring")&&Ds()!==0,Hs=U("web_enable_lifecycle_monitoring");function Is(a){var b=this;var c=c===void 0?0:c;var d=d===void 0?Wn():d;this.j=c;this.scheduler=d;this.i=new jj;this.h=a;for(a={bb:0};a.bb<this.h.length;a={ic:void 0,bb:a.bb},a.bb++)a.ic=this.h[a.bb],c=function(e){return function(){e.ic.yc();b.h[e.bb].kc=!0;b.h.every(function(f){return f.kc===!0})&&b.i.resolve()}}(a),d=this.getPriority(a.ic),d=this.scheduler.Za(c,d),this.h[a.bb]=Object.assign({},a.ic,{yc:c,
jobId:d})}
function Js(a){var b=Array.from(a.h.keys()).sort(function(d,e){return a.getPriority(a.h[e])-a.getPriority(a.h[d])});
b=v(b);for(var c=b.next();!c.done;c=b.next())c=a.h[c.value],c.jobId===void 0||c.kc||(a.scheduler.ra(c.jobId),a.scheduler.Za(c.yc,10))}
Is.prototype.cancel=function(){for(var a=v(this.h),b=a.next();!b.done;b=a.next())b=b.value,b.jobId===void 0||b.kc||this.scheduler.ra(b.jobId),b.kc=!0;this.i.resolve()};
Is.prototype.getPriority=function(a){var b;return(b=a.priority)!=null?b:this.j};function Ks(a){this.state=a;this.plugins=[];this.o=void 0;this.A={};Gs&&Es(this.state)}
p=Ks.prototype;p.install=function(a){this.plugins.push(a);return this};
p.uninstall=function(){var a=this;B.apply(0,arguments).forEach(function(b){b=a.plugins.indexOf(b);b>-1&&a.plugins.splice(b,1)})};
p.transition=function(a,b){var c=this;Gs&&Fs(this.state);var d=this.transitions.find(function(f){return Array.isArray(f.from)?f.from.find(function(g){return g===c.state&&f.to===a}):f.from===c.state&&f.to===a});
if(d){this.j&&(Js(this.j),this.j=void 0);Ls(this,a,b);this.state=a;Gs&&Es(this.state);d=d.action.bind(this);var e=this.plugins.filter(function(f){return f[a]}).map(function(f){return f[a]});
d(Ms(this,e),b)}else throw Error("no transition specified from "+this.state+" to "+a);};
function Ms(a,b){var c=b.filter(function(e){return Ns(a,e)===10}),d=b.filter(function(e){return Ns(a,e)!==10});
return a.A.kh?function(){var e=B.apply(0,arguments);return A(function(f){if(f.h==1)return f.yield(a.He.apply(a,[c].concat(ja(e))),2);a.ud.apply(a,[d].concat(ja(e)));f.h=0})}:function(){var e=B.apply(0,arguments);
a.Ie.apply(a,[c].concat(ja(e)));a.ud.apply(a,[d].concat(ja(e)))}}
p.Ie=function(a){for(var b=B.apply(1,arguments),c=Wn(),d=v(a),e=d.next(),f={};!e.done;f={Ib:void 0},e=d.next())f.Ib=e.value,c.Bb(function(g){return function(){Os(g.Ib.name);g.Ib.callback.apply(g.Ib,ja(b));Ps(g.Ib.name)}}(f))};
p.He=function(a){var b=B.apply(1,arguments),c,d,e,f,g;return A(function(h){h.h==1&&(c=Wn(),d=v(a),e=d.next(),f={});if(h.h!=3){if(e.done)return h.F(0);f.sb=e.value;f.Tb=void 0;g=function(k){return function(){Os(k.sb.name);var l=k.sb.callback.apply(k.sb,ja(b));typeof(l==null?void 0:l.then)==="function"?k.Tb=l.then(function(){Ps(k.sb.name)}):Ps(k.sb.name)}}(f);
c.Bb(g);return f.Tb?h.yield(f.Tb,3):h.F(3)}f={sb:void 0,Tb:void 0};e=d.next();return h.F(2)})};
p.ud=function(a){var b=B.apply(1,arguments),c=this,d=a.map(function(e){return{yc:function(){Os(e.name);e.callback.apply(e,ja(b));Ps(e.name)},
priority:Ns(c,e)}});
d.length&&(this.j=new Is(d))};
function Ns(a,b){var c,d;return(d=(c=a.o)!=null?c:b.priority)!=null?d:0}
function Os(a){Gs&&a&&Es(a)}
function Ps(a){Gs&&a&&Fs(a)}
function Ls(a,b,c){Hs&&console.groupCollapsed&&console.groupEnd&&(console.groupCollapsed("["+a.constructor.name+"] '"+a.state+"' to '"+b+"'"),console.log("with message: ",c),console.groupEnd())}
da.Object.defineProperties(Ks.prototype,{currentState:{configurable:!0,enumerable:!0,get:function(){return this.state}}});function Qs(a){Ks.call(this,a===void 0?"none":a);this.h=null;this.o=10;this.transitions=[{from:"none",to:"application_navigating",action:this.i},{from:"application_navigating",to:"none",action:this.D},{from:"application_navigating",to:"application_navigating",action:function(){}},
{from:"none",to:"none",action:function(){}}]}
var Rs;x(Qs,Ks);Qs.prototype.i=function(a,b){var c=this;this.h=rn(function(){c.currentState==="application_navigating"&&c.transition("none")},5E3);
a(b==null?void 0:b.event)};
Qs.prototype.D=function(a,b){this.h&&(yj.ra(this.h),this.h=null);a(b==null?void 0:b.event)};
function Ss(){Rs||(Rs=new Qs);return Rs}
;var Ts=[];D("yt.logging.transport.getScrapedGelPayloads",function(){return Ts});function Us(){this.store={};this.h={}}
Us.prototype.storePayload=function(a,b){a=Vs(a);this.store[a]?this.store[a].push(b):(this.h={},this.store[a]=[b]);return a};
Us.prototype.smartExtractMatchingEntries=function(a){if(!a.keys.length)return[];for(var b=Ws(this,a.keys.splice(0,1)[0]),c=[],d=0;d<b.length;d++)this.store[b[d]]&&a.sizeLimit&&(this.store[b[d]].length<=a.sizeLimit?(c.push.apply(c,ja(this.store[b[d]])),delete this.store[b[d]]):c.push.apply(c,ja(this.store[b[d]].splice(0,a.sizeLimit))));(a==null?0:a.sizeLimit)&&c.length<(a==null?void 0:a.sizeLimit)&&(a.sizeLimit-=c.length,c.push.apply(c,ja(this.smartExtractMatchingEntries(a))));return c};
Us.prototype.extractMatchingEntries=function(a){a=Ws(this,a);for(var b=[],c=0;c<a.length;c++)this.store[a[c]]&&(b.push.apply(b,ja(this.store[a[c]])),delete this.store[a[c]]);return b};
Us.prototype.getSequenceCount=function(a){a=Ws(this,a);for(var b=0,c=0;c<a.length;c++){var d=void 0;b+=((d=this.store[a[c]])==null?void 0:d.length)||0}return b};
function Ws(a,b){var c=Vs(b);if(a.h[c])return a.h[c];var d=Object.keys(a.store)||[];if(d.length<=1&&Vs(b)===d[0])return d;for(var e=[],f=0;f<d.length;f++){var g=d[f].split("/");if(Xs(b.auth,g[0])){var h=b.isJspb;Xs(h===void 0?"undefined":h?"true":"false",g[1])&&Xs(b.cttAuthInfo,g[2])&&(h=b.tier,h=h===void 0?"undefined":JSON.stringify(h),Xs(h,g[3])&&e.push(d[f]))}}return a.h[c]=e}
function Xs(a,b){return a===void 0||a==="undefined"?!0:a===b}
Us.prototype.getSequenceCount=Us.prototype.getSequenceCount;Us.prototype.extractMatchingEntries=Us.prototype.extractMatchingEntries;Us.prototype.smartExtractMatchingEntries=Us.prototype.smartExtractMatchingEntries;Us.prototype.storePayload=Us.prototype.storePayload;function Vs(a){return[a.auth===void 0?"undefined":a.auth,a.isJspb===void 0?"undefined":a.isJspb,a.cttAuthInfo===void 0?"undefined":a.cttAuthInfo,a.tier===void 0?"undefined":a.tier].join("/")}
;function Ys(a,b){if(a)return a[b.name]}
;var Zs=mm("initial_gel_batch_timeout",2E3),$s=mm("gel_queue_timeout_max_ms",6E4),at=Math.pow(2,16)-1,bt=mm("gel_min_batch_size",5),ct=void 0;function dt(){this.o=this.h=this.i=0;this.j=!1}
var et=new dt,ft=new dt,gt=new dt,ht=new dt,jt,kt=!0,lt=C.ytLoggingTransportTokensToCttTargetIds_||{};D("ytLoggingTransportTokensToCttTargetIds_",lt);var mt={};function nt(){var a=E("yt.logging.ims");a||(a=new Us,D("yt.logging.ims",a));return a}
function ot(a,b){if(a.endpoint==="log_event"){pt();var c=qt(a),d=rt(a.payload)||"";a:{if(U("enable_web_tiered_gel")){var e=kr[d||""];var f,g,h,k=Bs().resolve(new vs(Qp))==null?void 0:(f=Rp())==null?void 0:(g=f.loggingHotConfig)==null?void 0:(h=g.eventLoggingConfig)==null?void 0:h.payloadPolicies;if(k)for(f=0;f<k.length;f++)if(k[f].payloadNumber===e){e=k[f];break a}}e=void 0}k=200;if(e){if(e.enabled===!1&&!U("web_payload_policy_disabled_killswitch"))return;k=st(e.tier);if(k===400){tt(a,b);return}}mt[c]=
!0;e={cttAuthInfo:c,isJspb:!1,tier:k};nt().storePayload(e,a.payload);ut(b,c,e,d==="gelDebuggingEvent")}}
function ut(a,b,c,d){function e(){vt({writeThenSend:!0},U("flush_only_full_queue")?b:void 0,f,c.tier)}
var f=!1;f=f===void 0?!1:f;d=d===void 0?!1:d;a&&(ct=new a);a=mm("tvhtml5_logging_max_batch_ads_fork")||mm("tvhtml5_logging_max_batch")||mm("web_logging_max_batch")||100;var g=W(),h=wt(f,c.tier),k=h.o;d&&(h.j=!0);d=0;c&&(d=nt().getSequenceCount(c));d>=1E3?e():d>=a?jt||(jt=xt(function(){e();jt=void 0},0)):g-k>=10&&(zt(f,c.tier),h.o=g)}
function tt(a,b){if(a.endpoint==="log_event"){pt();var c=qt(a),d=new Map;d.set(c,[a.payload]);var e=rt(a.payload)||"";b&&(ct=new b);return new gi(function(f,g){ct&&ct.isReady()?At(d,ct,f,g,{bypassNetworkless:!0},!0,e==="gelDebuggingEvent"):f()})}}
function qt(a){var b="";if(a.dangerousLogToVisitorSession)b="visitorOnlyApprovedKey";else if(a.cttAuthInfo){b=a.cttAuthInfo;var c={};b.videoId?c.videoId=b.videoId:b.playlistId&&(c.playlistId=b.playlistId);lt[a.cttAuthInfo.token]=c;b=a.cttAuthInfo.token}return b}
function vt(a,b,c,d){a=a===void 0?{}:a;c=c===void 0?!1:c;new gi(function(e,f){var g=wt(c,d),h=g.j;g.j=!1;Bt(g.i);Bt(g.h);g.h=0;ct&&ct.isReady()?d===void 0&&U("enable_web_tiered_gel")?Ct(e,f,a,b,c,300,h):Ct(e,f,a,b,c,d,h):(zt(c,d),e())})}
function Ct(a,b,c,d,e,f,g){var h=ct;c=c===void 0?{}:c;e=e===void 0?!1:e;f=f===void 0?200:f;g=g===void 0?!1:g;var k=new Map,l={isJspb:e,cttAuthInfo:d,tier:f};e={isJspb:e,cttAuthInfo:d};if(d!==void 0)f=U("enable_web_tiered_gel")?nt().smartExtractMatchingEntries({keys:[l,e],sizeLimit:1E3}):nt().extractMatchingEntries(e),k.set(d,f);else for(d=v(Object.keys(mt)),l=d.next();!l.done;l=d.next())l=l.value,e=U("enable_web_tiered_gel")?nt().smartExtractMatchingEntries({keys:[{isJspb:!1,cttAuthInfo:l,tier:f},
{isJspb:!1,cttAuthInfo:l}],sizeLimit:1E3}):nt().extractMatchingEntries({isJspb:!1,cttAuthInfo:l}),e.length>0&&k.set(l,e),(U("web_fp_via_jspb_and_json")&&c.writeThenSend||!U("web_fp_via_jspb_and_json"))&&delete mt[l];At(k,h,a,b,c,!1,g)}
function zt(a,b){function c(){vt({writeThenSend:!0},void 0,a,b)}
a=a===void 0?!1:a;b=b===void 0?200:b;var d=wt(a,b),e=d===ht||d===gt?5E3:$s;U("web_gel_timeout_cap")&&!d.h&&(e=xt(function(){c()},e),d.h=e);
Bt(d.i);e=R("LOGGING_BATCH_TIMEOUT",mm("web_gel_debounce_ms",1E4));U("shorten_initial_gel_batch_timeout")&&kt&&(e=Zs);e=xt(function(){mm("gel_min_batch_size")>0?nt().getSequenceCount({cttAuthInfo:void 0,isJspb:a,tier:b})>=bt&&c():c()},e);
d.i=e}
function At(a,b,c,d,e,f,g){e=e===void 0?{}:e;var h=Math.round(W()),k=a.size,l=(g===void 0?0:g)&&U("vss_through_gel_video_stats")?"video_stats":"log_event";a=v(a);var m=a.next();for(g={};!m.done;g={Ec:void 0,batchRequest:void 0,dangerousLogToVisitorSession:void 0,Hc:void 0,Gc:void 0},m=a.next()){var n=v(m.value);m=n.next().value;n=n.next().value;g.batchRequest=vg({context:Xp(b.config_||Wp())});if(!Pa(n)&&!U("throw_err_when_logevent_malformed_killswitch")){d();break}g.batchRequest.events=n;(n=lt[m])&&
Dt(g.batchRequest,m,n);delete lt[m];g.dangerousLogToVisitorSession=m==="visitorOnlyApprovedKey";Et(g.batchRequest,h,g.dangerousLogToVisitorSession);U("always_send_and_write")&&(e.writeThenSend=!1);g.Hc=function(r){U("start_client_gcf")&&yj.qa(function(){return A(function(t){return t.yield(Ft(r),0)})});
k--;k||c()};
g.Ec=0;g.Gc=function(r){return function(){r.Ec++;if(e.bypassNetworkless&&r.Ec===1)try{Pq(b,l,r.batchRequest,Gt({writeThenSend:!0},r.dangerousLogToVisitorSession,r.Hc,r.Gc,f)),kt=!1}catch(t){Tl(t),d()}k--;k||c()}}(g);
try{Pq(b,l,g.batchRequest,Gt(e,g.dangerousLogToVisitorSession,g.Hc,g.Gc,f)),kt=!1}catch(r){Tl(r),d()}}}
function Gt(a,b,c,d,e){a={retry:!0,onSuccess:c,onError:d,networklessOptions:a,dangerousLogToVisitorSession:b,Og:!!e,headers:{},postBodyFormat:"",postBody:"",compress:U("compress_gel")||U("compress_gel_lr")};Ht()&&(a.headers["X-Goog-Request-Time"]=JSON.stringify(Math.round(W())));return a}
function Et(a,b,c){Ht()||(a.requestTimeMs=String(b));U("unsplit_gel_payloads_in_logs")&&(a.unsplitGelPayloadsInLogs=!0);!c&&(b=R("EVENT_ID"))&&((c=R("BATCH_CLIENT_COUNTER")||0)||(c=Math.floor(Math.random()*at/2)),c++,c>at&&(c=1),Ol("BATCH_CLIENT_COUNTER",c),a.serializedClientEventId={serializedEventId:b,clientCounter:String(c)})}
function Dt(a,b,c){if(c.videoId)var d="VIDEO";else if(c.playlistId)d="PLAYLIST";else return;a.credentialTransferTokenTargetId=c;a.context=a.context||{};a.context.user=a.context.user||{};a.context.user.credentialTransferTokens=[{token:b,scope:d}]}
function pt(){var a;(a=E("yt.logging.transport.enableScrapingForTest"))||(a=lm("il_payload_scraping"),a=(a!==void 0?String(a):"")!=="enable_il_payload_scraping");a||(Ts=[],D("yt.logging.transport.enableScrapingForTest",!0),D("yt.logging.transport.scrapedPayloadsForTesting",Ts),D("yt.logging.transport.payloadToScrape","visualElementShown visualElementHidden visualElementAttached screenCreated visualElementGestured visualElementStateChanged".split(" ")),D("yt.logging.transport.getScrapedPayloadFromClientEventsFunction"),
D("yt.logging.transport.scrapeClientEvent",!0))}
function Ht(){return U("use_request_time_ms_header")||U("lr_use_request_time_ms_header")}
function xt(a,b){return U("transport_use_scheduler")===!1?jm(a,b):U("logging_avoid_blocking_during_navigation")||U("lr_logging_avoid_blocking_during_navigation")?rn(function(){if(Ss().currentState==="none")a();else{var c={};Ss().install((c.none={callback:a},c))}},b):rn(a,b)}
function Bt(a){U("transport_use_scheduler")?yj.ra(a):window.clearTimeout(a)}
function Ft(a){var b,c,d,e,f,g,h,k,l,m;return A(function(n){return n.h==1?(d=(b=a)==null?void 0:(c=b.responseContext)==null?void 0:c.globalConfigGroup,e=Ys(d,ql),g=(f=d)==null?void 0:f.hotHashData,h=Ys(d,pl),l=(k=d)==null?void 0:k.coldHashData,(m=Bs().resolve(new vs(Qp)))?g?e?n.yield(Sp(m,g,e),2):n.yield(Sp(m,g),2):n.F(2):n.return()):l?h?n.yield(Tp(m,l,h),0):n.yield(Tp(m,l),0):n.F(0)})}
function wt(a,b){b=b===void 0?200:b;return a?b===300?ht:ft:b===300?gt:et}
function rt(a){a=Object.keys(a);a=v(a);for(var b=a.next();!b.done;b=a.next())if(b=b.value,kr[b])return b}
function st(a){switch(a){case "DELAYED_EVENT_TIER_UNSPECIFIED":return 0;case "DELAYED_EVENT_TIER_DEFAULT":return 100;case "DELAYED_EVENT_TIER_DISPATCH_TO_EMPTY":return 200;case "DELAYED_EVENT_TIER_FAST":return 300;case "DELAYED_EVENT_TIER_IMMEDIATE":return 400;default:return 200}}
;var It=C.ytLoggingGelSequenceIdObj_||{};D("ytLoggingGelSequenceIdObj_",It);
function Jt(a,b,c,d){d=d===void 0?{}:d;var e={},f=Math.round(d.timestamp||W());e.eventTimeMs=f<Number.MAX_SAFE_INTEGER?f:0;e[a]=b;a=hs();e.context={lastActivityMs:String(d.timestamp||!isFinite(a)?-1:a)};d.sequenceGroup&&!U("web_gel_sequence_info_killswitch")&&(a=e.context,b=d.sequenceGroup,It[b]=b in It?It[b]+1:0,a.sequence={index:It[b],groupKey:b},d.endOfSequence&&delete It[d.sequenceGroup]);(d.sendIsolatedPayload?tt:ot)({endpoint:"log_event",payload:e,cttAuthInfo:d.cttAuthInfo,dangerousLogToVisitorSession:d.dangerousLogToVisitorSession},
c)}
;function go(a,b,c){c=c===void 0?{}:c;var d=Rr;R("ytLoggingEventsDefaultDisabled",!1)&&Rr===Rr&&(d=null);Jt(a,b,d,c)}
;function Kt(a){return a.slice(0,void 0).map(function(b){return b.name}).join(" > ")}
;var Lt=new Set,Mt=0,Nt=0,Ot=0,Pt=[],Qt=["PhantomJS","Googlebot","TO STOP THIS SECURITY SCAN go/scan"];function fo(a){Rt(a)}
function St(a){Rt(a,"WARNING")}
function Tt(a){a instanceof Error?Rt(a):(a=Qa(a)?JSON.stringify(a):String(a),a=new V(a),a.name="RejectedPromiseError",St(a))}
function Rt(a,b,c,d,e,f,g,h){f=f===void 0?{}:f;f.name=c||R("INNERTUBE_CONTEXT_CLIENT_NAME",1);f.version=d||R("INNERTUBE_CONTEXT_CLIENT_VERSION");c=f;b=b===void 0?"ERROR":b;g=g===void 0?!1:g;b=b===void 0?"ERROR":b;g=g===void 0?!1:g;if(a&&(a.hasOwnProperty("level")&&a.level&&(b=a.level),U("console_log_js_exceptions")&&(d=[],d.push("Name: "+a.name),d.push("Message: "+a.message),a.hasOwnProperty("params")&&d.push("Error Params: "+JSON.stringify(a.params)),a.hasOwnProperty("args")&&d.push("Error args: "+
JSON.stringify(a.args)),d.push("File name: "+a.fileName),d.push("Stacktrace: "+a.stack),d=d.join("\n"),window.console.log(d,a)),!(Mt>=5))){d=Pt;var k=Ub(a);e=k.message||"Unknown Error";f=k.name||"UnknownError";var l=k.stack||a.i||"Not available";if(l.startsWith(f+": "+e)){var m=l.split("\n");m.shift();l=m.join("\n")}m=k.lineNumber||"Not available";k=k.fileName||"Not available";var n=0;if(a.hasOwnProperty("args")&&a.args&&a.args.length)for(var r=0;r<a.args.length&&!(n=Om(a.args[r],"params."+r,c,n),
n>=500);r++);else if(a.hasOwnProperty("params")&&a.params){var t=a.params;if(typeof a.params==="object")for(r in t){if(t[r]){var w="params."+r,y=Qm(t[r]);c[w]=y;n+=w.length+y.length;if(n>500)break}}else c.params=Qm(t)}if(d.length)for(r=0;r<d.length&&!(n=Om(d[r],"params.context."+r,c,n),n>=500);r++);navigator.vendor&&!c.hasOwnProperty("vendor")&&(c["device.vendor"]=navigator.vendor);r={message:e,name:f,lineNumber:m,fileName:k,stack:l,params:c,sampleWeight:1};c=Number(a.columnNumber);isNaN(c)||(r.lineNumber=
r.lineNumber+":"+c);if(a.level==="IGNORED")a=0;else a:{a=Km();c=v(a.Va);for(d=c.next();!d.done;d=c.next())if(d=d.value,r.message&&r.message.match(d.ah)){a=d.weight;break a}a=v(a.Sa);for(c=a.next();!c.done;c=a.next())if(c=c.value,c.callback(r)){a=c.weight;break a}a=1}r.sampleWeight=a;a=v(Fm);for(c=a.next();!c.done;c=a.next())if(c=c.value,c.hc[r.name])for(e=v(c.hc[r.name]),d=e.next();!d.done;d=e.next())if(f=d.value,d=r.message.match(f.regexp)){r.params["params.error.original"]=d[0];e=f.groups;f={};
for(m=0;m<e.length;m++)f[e[m]]=d[m+1],r.params["params.error."+e[m]]=d[m+1];r.message=c.Cc(f);break}r.params||(r.params={});a=Km();r.params["params.errorServiceSignature"]="msg="+a.Va.length+"&cb="+a.Sa.length;r.params["params.serviceWorker"]="false";C.document&&C.document.querySelectorAll&&(r.params["params.fscripts"]=String(document.querySelectorAll("script:not([nonce])").length));(new fb(gb,"sample")).constructor!==fb&&(r.params["params.fconst"]="true");window.yterr&&typeof window.yterr==="function"&&
window.yterr(r);if(r.sampleWeight!==0&&!Lt.has(r.message)){if(g&&U("web_enable_error_204"))Ut(b===void 0?"ERROR":b,r);else{b=b===void 0?"ERROR":b;b==="ERROR"?(Lm.kb("handleError",r),U("record_app_crashed_web")&&Ot===0&&r.sampleWeight===1&&(Ot++,g={appCrashType:"APP_CRASH_TYPE_BREAKPAD"},U("report_client_error_with_app_crash_ks")||(g.systemHealth={crashData:{clientError:{logMessage:{message:r.message}}}}),go("appCrashed",g)),Nt++):b==="WARNING"&&Lm.kb("handleWarning",r);if(U("kevlar_gel_error_routing")){g=
b;h=h===void 0?{}:h;b:{a=v(Qt);for(c=a.next();!c.done;c=a.next())if(mo(c.value.toLowerCase())){a=!0;break b}a=!1}if(a)h=void 0;else{c={stackTrace:r.stack};r.fileName&&(c.filename=r.fileName);a=r.lineNumber&&r.lineNumber.split?r.lineNumber.split(":"):[];a.length!==0&&(a.length!==1||isNaN(Number(a[0]))?a.length!==2||isNaN(Number(a[0]))||isNaN(Number(a[1]))||(c.lineNumber=Number(a[0]),c.columnNumber=Number(a[1])):c.lineNumber=Number(a[0]));a={level:"ERROR_LEVEL_UNKNOWN",message:r.message,errorClassName:r.name,
sampleWeight:r.sampleWeight};g==="ERROR"?a.level="ERROR_LEVEL_ERROR":g==="WARNING"&&(a.level="ERROR_LEVEL_WARNNING");c={isObfuscated:!0,browserStackInfo:c};h.pageUrl=window.location.href;h.kvPairs=[];R("FEXP_EXPERIMENTS")&&(h.experimentIds=R("FEXP_EXPERIMENTS"));d=R("LATEST_ECATCHER_SERVICE_TRACKING_PARAMS");if(!Pl("web_disable_gel_stp_ecatcher_killswitch")&&d)for(e=v(Object.keys(d)),f=e.next();!f.done;f=e.next())f=f.value,h.kvPairs.push({key:f,value:String(d[f])});if(d=r.params)for(e=v(Object.keys(d)),
f=e.next();!f.done;f=e.next())f=f.value,h.kvPairs.push({key:"client."+f,value:String(d[f])});d=R("SERVER_NAME");e=R("SERVER_VERSION");d&&e&&(h.kvPairs.push({key:"server.name",value:d}),h.kvPairs.push({key:"server.version",value:e}));h={errorMetadata:h,stackTrace:c,logMessage:a}}h&&(go("clientError",h),(g==="ERROR"||U("errors_flush_gel_always_killswitch"))&&vt(void 0,void 0,!1))}U("suppress_error_204_logging")||Ut(b,r)}try{Lt.add(r.message)}catch(z){}Mt++}}}
function Ut(a,b){var c=b.params||{};a={urlParams:{a:"logerror",t:"jserror",type:b.name,msg:b.message.substr(0,250),line:b.lineNumber,level:a,"client.name":c.name},postParams:{url:R("PAGE_NAME",window.location.href),file:b.fileName},method:"POST"};c.version&&(a["client.version"]=c.version);if(a.postParams){b.stack&&(a.postParams.stack=b.stack);b=v(Object.keys(c));for(var d=b.next();!d.done;d=b.next())d=d.value,a.postParams["client."+d]=c[d];if(c=R("LATEST_ECATCHER_SERVICE_TRACKING_PARAMS"))for(b=v(Object.keys(c)),
d=b.next();!d.done;d=b.next())d=d.value,a.postParams[d]=c[d];c=R("SERVER_NAME");b=R("SERVER_VERSION");c&&b&&(a.postParams["server.name"]=c,a.postParams["server.version"]=b)}wm(R("ECATCHER_REPORT_HOST","")+"/error_204",a)}
function Vt(a){var b=B.apply(1,arguments);a.args||(a.args=[]);a.args.push.apply(a.args,ja(b))}
;function Wt(){this.register=new Map}
function Xt(a){a=v(a.register.values());for(var b=a.next();!b.done;b=a.next())b.value.fh("ABORTED")}
Wt.prototype.clear=function(){Xt(this);this.register.clear()};
var Yt=new Wt;var Zt=Date.now().toString();
function $t(){a:{if(window.crypto&&window.crypto.getRandomValues)try{var a=Array(16),b=new Uint8Array(16);window.crypto.getRandomValues(b);for(var c=0;c<a.length;c++)a[c]=b[c];var d=a;break a}catch(e){}d=Array(16);for(a=0;a<16;a++){b=Date.now();for(c=0;c<b%23;c++)d[a]=Math.random();d[a]=Math.floor(Math.random()*256)}if(Zt)for(a=1,b=0;b<Zt.length;b++)d[a%16]=d[a%16]^d[(a-1)%16]/4^Zt.charCodeAt(b),a++}a=[];for(b=0;b<d.length;b++)a.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(d[b]&63));
return a.join("")}
;var au,bu=C.ytLoggingDocDocumentNonce_;bu||(bu=$t(),D("ytLoggingDocDocumentNonce_",bu));au=bu;function cu(a){this.h=a}
p=cu.prototype;p.getAsJson=function(){var a={};this.h.trackingParams!==void 0?a.trackingParams=this.h.trackingParams:(a.veType=this.h.veType,this.h.veCounter!==void 0&&(a.veCounter=this.h.veCounter),this.h.elementIndex!==void 0&&(a.elementIndex=this.h.elementIndex));this.h.dataElement!==void 0&&(a.dataElement=this.h.dataElement.getAsJson());this.h.youtubeData!==void 0&&(a.youtubeData=this.h.youtubeData);this.h.isCounterfactual&&(a.isCounterfactual=!0);return a};
p.getAsJspb=function(){var a=new xl;this.h.trackingParams!==void 0?a.setTrackingParams(this.h.trackingParams):(this.h.veType!==void 0&&af(a,2,re(this.h.veType)),this.h.veCounter!==void 0&&af(a,6,re(this.h.veCounter)),this.h.elementIndex!==void 0&&af(a,3,re(this.h.elementIndex)),this.h.isCounterfactual&&af(a,5,ne(!0)));if(this.h.dataElement!==void 0){var b=this.h.dataElement.getAsJspb();of(a,xl,7,b)}this.h.youtubeData!==void 0&&of(a,rl,8,this.h.jspbYoutubeData);return a};
p.toString=function(){return JSON.stringify(this.getAsJson())};
p.isClientVe=function(){return!this.h.trackingParams&&!!this.h.veType};
p.getLoggingDirectives=function(){return this.h.loggingDirectives};function du(a){return R("client-screen-nonce-store",{})[a===void 0?0:a]}
function eu(a,b){b=b===void 0?0:b;var c=R("client-screen-nonce-store");c||(c={},Ol("client-screen-nonce-store",c));c[b]=a}
function fu(a){a=a===void 0?0:a;return a===0?"ROOT_VE_TYPE":"ROOT_VE_TYPE."+a}
function gu(a){return R(fu(a===void 0?0:a))}
D("yt_logging_screen.getRootVeType",gu);function hu(){var a=R("csn-to-ctt-auth-info");a||(a={},Ol("csn-to-ctt-auth-info",a));return a}
function iu(){return Object.values(R("client-screen-nonce-store",{})).filter(function(a){return a!==void 0})}
function ju(a){a=du(a===void 0?0:a);if(!a&&!R("USE_CSN_FALLBACK",!0))return null;a||(a="UNDEFINED_CSN");return a?a:null}
D("yt_logging_screen.getCurrentCsn",ju);function ku(a,b,c){var d=hu();(c=ju(c))&&delete d[c];b&&(d[a]=b)}
function lu(a){return hu()[a]}
D("yt_logging_screen.getCttAuthInfo",lu);D("yt_logging_screen.setCurrentScreen",function(a,b,c,d){c=c===void 0?0:c;if(a!==du(c)||b!==R(fu(c)))if(ku(a,d,c),eu(a,c),Ol(fu(c),b),b=function(){setTimeout(function(){a&&go("foregroundHeartbeatScreenAssociated",{clientDocumentNonce:au,clientScreenNonce:a})},0)},"requestAnimationFrame"in window)try{window.requestAnimationFrame(b)}catch(e){b()}else b()});function mu(){var a=ug(nu),b;return(new gi(function(c,d){a.onSuccess=function(e){im(e)?c(new ou(e)):d(new pu("Request failed, status="+(e&&"status"in e?e.status:-1),"net.badstatus",e))};
a.onError=function(e){d(new pu("Unknown request error","net.unknown",e))};
a.onTimeout=function(e){d(new pu("Request timed out","net.timeout",e))};
b=wm("//googleads.g.doubleclick.net/pagead/id",a)})).oc(function(c){if(c instanceof ni){var d;
(d=b)==null||d.abort()}return li(c)})}
function pu(a,b,c){ab.call(this,a+", errorCode="+b);this.errorCode=b;this.xhr=c;this.name="PromiseAjaxError"}
x(pu,ab);function ou(a){this.xhr=a}
;function qu(){this.h=0;this.i=null}
qu.prototype.then=function(a,b,c){return this.h===1&&a?(a=a.call(c,this.i))&&typeof a.then==="function"?a:ru(a):this.h===2&&b?(a=b.call(c,this.i))&&typeof a.then==="function"?a:su(a):this};
qu.prototype.getValue=function(){return this.i};
qu.prototype.isRejected=function(){return this.h==2};
qu.prototype.$goog_Thenable=!0;function su(a){var b=new qu;a=a===void 0?null:a;b.h=2;b.i=a===void 0?null:a;return b}
function ru(a){var b=new qu;a=a===void 0?null:a;b.h=1;b.i=a===void 0?null:a;return b}
;function tu(a,b){var c=c===void 0?{}:c;a={method:b===void 0?"POST":b,mode:dm(a)?"same-origin":"cors",credentials:dm(a)?"same-origin":"include"};b={};for(var d=v(Object.keys(c)),e=d.next();!e.done;e=d.next())e=e.value,c[e]&&(b[e]=c[e]);Object.keys(b).length>0&&(a.headers=b);return a}
;function uu(){return dg()||(Yc||Zc)&&mo("applewebkit")&&!mo("version")&&(!mo("safari")||mo("gsa/"))||Xc&&mo("version/")?!0:R("EOM_VISITOR_DATA")?!1:!0}
;function vu(a){a:{var b="EMBEDDED_PLAYER_MODE_UNKNOWN";window.location.hostname.includes("youtubeeducation.com")&&(b="EMBEDDED_PLAYER_MODE_PFL");var c=a.raw_embedded_player_response;if(!c&&(a=a.embedded_player_response))try{c=JSON.parse(a)}catch(e){break a}if(c)b:for(var d in vl)if(vl[d]==c.embeddedPlayerMode){b=vl[d];break b}}return b==="EMBEDDED_PLAYER_MODE_PFL"}
;function wu(a){ab.call(this,a.message||a.description||a.name);this.isMissing=a instanceof xu;this.isTimeout=a instanceof pu&&a.errorCode=="net.timeout";this.isCanceled=a instanceof ni}
x(wu,ab);wu.prototype.name="BiscottiError";function xu(){ab.call(this,"Biscotti ID is missing from server")}
x(xu,ab);xu.prototype.name="BiscottiMissingError";var nu={format:"RAW",method:"GET",timeout:5E3,withCredentials:!0},yu=null;function zu(){if(U("disable_biscotti_fetch_entirely_for_all_web_clients"))return Error("Biscotti id fetching has been disabled entirely.");if(!uu())return Error("User has not consented - not fetching biscotti id.");var a=R("PLAYER_VARS",{});if(sg(a)=="1")return Error("Biscotti ID is not available in private embed mode");if(vu(a))return Error("Biscotti id fetching has been disabled for pfl.")}
function Hl(){var a=zu();if(a!==void 0)return li(a);yu||(yu=mu().then(Au).oc(function(b){return Bu(2,b)}));
return yu}
function Au(a){a=a.xhr.responseText;if(a.lastIndexOf(")]}'",0)!=0)throw new xu;a=JSON.parse(a.substr(4));if((a.type||1)>1)throw new xu;a=a.id;Il(a);yu=ru(a);Cu(18E5,2);return a}
function Bu(a,b){b=new wu(b);Il("");yu=su(b);a>0&&Cu(12E4,a-1);throw b;}
function Cu(a,b){jm(function(){mu().then(Au,function(c){return Bu(b,c)}).oc(Uh)},a)}
function Du(){try{var a=E("yt.ads.biscotti.getId_");return a?a():Hl()}catch(b){return li(b)}}
;var Ab=ha(["data-"]);function Eu(a){a&&(a.dataset?a.dataset[Fu()]="true":Cb(a))}
function Gu(a){return a?a.dataset?a.dataset[Fu()]:a.getAttribute("data-loaded"):null}
var Hu={};function Fu(){return Hu.loaded||(Hu.loaded="loaded".replace(/\-([a-z])/g,function(a,b){return b.toUpperCase()}))}
;function Iu(a){a=a||{};var b={},c={};this.url=a.url||"";this.args=a.args||ug(b);this.assets=a.assets||{};this.attrs=a.attrs||ug(c);this.fallback=a.fallback||null;this.fallbackMessage=a.fallbackMessage||null;this.html5=!!a.html5;this.disable=a.disable||{};this.loaded=!!a.loaded;this.messages=a.messages||{}}
Iu.prototype.clone=function(){var a=new Iu,b;for(b in this)if(this.hasOwnProperty(b)){var c=this[b];Oa(c)=="object"?a[b]=ug(c):a[b]=c}return a};var Ju=["share/get_share_panel"],Ku=["share/get_web_player_share_panel"],Lu=["feedback"],Mu=["notification/modify_channel_preference"],Nu=["browse/edit_playlist"],Ou=["subscription/subscribe"],Pu=["subscription/unsubscribe"];var Qu=window.yt&&window.yt.msgs_||window.ytcfg&&window.ytcfg.msgs||{};D("yt.msgs_",Qu);function Ru(a){Jl(Qu,arguments)}
;function Su(a,b,c){Tu(a,b,c===void 0?null:c)}
function Uu(a){a=Vu(a);var b=document.getElementById(a);b&&(rs(a),b.parentNode.removeChild(b))}
function Wu(a,b){a&&b&&(a=""+Ra(b),(a=Xu[a])&&ps(a))}
function Tu(a,b,c){c=c===void 0?null:c;var d=Vu(a),e=document.getElementById(d),f=e&&Gu(e),g=e&&!f;f?b&&b():(b&&(f=ms(d,b),b=""+Ra(b),Xu[b]=f),g||(e=Yu(a,d,function(){Gu(e)||(Eu(e),qs(d),jm(function(){rs(d)},0))},c)))}
function Yu(a,b,c,d){d=d===void 0?null:d;var e=Bg("SCRIPT");e.id=b;e.onload=function(){c&&setTimeout(c,0)};
e.onreadystatechange=function(){switch(e.readyState){case "loaded":case "complete":e.onload()}};
d&&e.setAttribute("nonce",d);Kb(e,nl(a));a=document.getElementsByTagName("head")[0]||document.body;a.insertBefore(e,a.firstChild);return e}
function Vu(a){var b=document.createElement("a");yb(b,a);a=b.href.replace(/^[a-zA-Z]+:\/\//,"//");return"js-"+Yb(a)}
var Xu={};function Zu(a){var b=$u(a),c=document.getElementById(b),d=c&&Gu(c);d||c&&!d||(c=av(a,b,function(){if(!Gu(c)){Eu(c);qs(b);var e=Xa(rs,b);jm(e,0)}}))}
function av(a,b,c){var d=document.createElement("link");d.id=b;d.onload=function(){c&&setTimeout(c,0)};
a=nl(a);Fb(d,a);(document.getElementsByTagName("head")[0]||document.body).appendChild(d);return d}
function $u(a){var b=Bg("A");yb(b,new rb(a));a=b.href.replace(/^[a-zA-Z]+:\/\//,"//");return"css-"+Yb(a)}
;function bv(a){var b=B.apply(1,arguments);if(!cv(a)||b.some(function(d){return!cv(d)}))throw Error("Only objects may be merged.");
b=v(b);for(var c=b.next();!c.done;c=b.next())dv(a,c.value)}
function dv(a,b){for(var c in b)if(cv(b[c])){if(c in a&&!cv(a[c]))throw Error("Cannot merge an object into a non-object.");c in a||(a[c]={});dv(a[c],b[c])}else if(ev(b[c])){if(c in a&&!ev(a[c]))throw Error("Cannot merge an array into a non-array.");c in a||(a[c]=[]);fv(a[c],b[c])}else a[c]=b[c];return a}
function fv(a,b){b=v(b);for(var c=b.next();!c.done;c=b.next())c=c.value,cv(c)?a.push(dv({},c)):ev(c)?a.push(fv([],c)):a.push(c);return a}
function cv(a){return typeof a==="object"&&!Array.isArray(a)}
function ev(a){return typeof a==="object"&&Array.isArray(a)}
;var gv="absolute_experiments app conditional_experiments debugcss debugjs expflag forced_experiments pbj pbjreload sbb spf spfreload sr_bns_address sttick".split(" ");
function hv(a,b){var c=c===void 0?!0:c;var d=R("VALID_SESSION_TEMPDATA_DOMAINS",[]),e=bc(window.location.href);e&&d.push(e);e=bc(a);if(Lb(d,e)>=0||!e&&a.lastIndexOf("/",0)==0)if(d=document.createElement("a"),yb(d,a),a=d.href)if(a=cc(a),a=dc(a))if(c&&!b.csn&&(b.itct||b.ved)&&(b=Object.assign({csn:ju()},b)),f){var f=parseInt(f,10);isFinite(f)&&f>0&&iv(a,b,f)}else iv(a,b)}
function iv(a,b,c){a=jv(a);b=b?fc(b):"";c=c||5;uu()&&Xm(a,b,c)}
function jv(a){for(var b=v(gv),c=b.next();!c.done;c=b.next())a=lc(a,c.value);return"ST-"+Yb(a).toString(36)}
;function kv(a){aq.call(this,1,arguments);this.csn=a}
x(kv,aq);var jq=new bq("screen-created",kv),lv=[],mv=0,nv=new Map,ov=new Map,pv=new Map;
function qv(a,b,c,d,e){e=e===void 0?!1:e;for(var f=rv({cttAuthInfo:lu(b)||void 0},b),g=v(d),h=g.next();!h.done;h=g.next()){h=h.value;var k=h.getAsJson();(qg(k)||!k.trackingParams&&!k.veType)&&St(Error("Child VE logged with no data"));if(U("no_client_ve_attach_unless_shown")){var l=sv(h,b);if(k.veType&&!ov.has(l)&&!pv.has(l)&&!e){if(!U("il_attach_cache_limit")||nv.size<1E3){nv.set(l,[a,b,c,h]);return}U("il_attach_cache_limit")&&nv.size>1E3&&St(new V("IL Attach cache exceeded limit"))}h=sv(c,b);nv.has(h)?
tv(c,b):pv.set(h,!0)}}d=d.filter(function(m){m.csn!==b?(m.csn=b,m=!0):m=!1;return m});
c={csn:b,parentVe:c.getAsJson(),childVes:Ob(d,function(m){return m.getAsJson()})};
b==="UNDEFINED_CSN"?uv("visualElementAttached",f,c):a?Jt("visualElementAttached",c,a,f):go("visualElementAttached",c,f)}
function uv(a,b,c){lv.push({ze:a,payload:c,Wg:void 0,options:b});mv||(mv=kq())}
function lq(a){if(lv){for(var b=v(lv),c=b.next();!c.done;c=b.next())c=c.value,c.payload&&(c.payload.csn=a.csn,go(c.ze,c.payload,c.options));lv.length=0}mv=0}
function sv(a,b){return""+a.getAsJson().veType+a.getAsJson().veCounter+b}
function tv(a,b){a=sv(a,b);nv.has(a)&&(b=nv.get(a)||[],qv(b[0],b[1],b[2],[b[3]],!0),nv.delete(a))}
function rv(a,b){U("log_sequence_info_on_gel_web")&&(a.sequenceGroup=b);return a}
;function vv(){try{return!!self.localStorage}catch(a){return!1}}
;function wv(a){a=a.match(/(.*)::.*::.*/);if(a!==null)return a[1]}
function xv(a){if(vv()){var b=Object.keys(window.localStorage);b=v(b);for(var c=b.next();!c.done;c=b.next()){c=c.value;var d=wv(c);d===void 0||a.includes(d)||self.localStorage.removeItem(c)}}}
function yv(){if(!vv())return!1;var a=pn(),b=Object.keys(window.localStorage);b=v(b);for(var c=b.next();!c.done;c=b.next())if(c=wv(c.value),c!==void 0&&c!==a)return!0;return!1}
;function zv(){var a=!1;try{a=!!window.sessionStorage.getItem("session_logininfo")}catch(b){a=!0}return(R("INNERTUBE_CLIENT_NAME")==="WEB"||R("INNERTUBE_CLIENT_NAME")==="WEB_CREATOR")&&a}
function Av(a){if(R("LOGGED_IN",!0)&&zv()){var b=R("VALID_SESSION_TEMPDATA_DOMAINS",[]);var c=bc(window.location.href);c&&b.push(c);c=bc(a);Lb(b,c)>=0||!c&&a.lastIndexOf("/",0)==0?(b=cc(a),(b=dc(b))?(b=jv(b),b=(b=Ym(b)||null)?am(b):{}):b=null):b=null;b==null&&(b={});c=b;var d=void 0;zv()?(d||(d=R("LOGIN_INFO")),d?(c.session_logininfo=d,c=!0):c=!1):c=!1;c&&hv(a,b)}}
;function Bv(a,b,c){b=b===void 0?{}:b;c=c===void 0?!1:c;var d=R("EVENT_ID");d&&(b.ei||(b.ei=d));b&&hv(a,b);if(c)return!1;Av(a);var e=e===void 0?{}:e;var f=f===void 0?"":f;var g=g===void 0?window:g;a=hc(a,e);Av(a);f=a+f;var h=h===void 0?vb:h;a:if(h=h===void 0?vb:h,f instanceof rb)h=f;else{for(a=0;a<h.length;++a)if(b=h[a],b instanceof tb&&b.ne(f)){h=new rb(f);break a}h=void 0}g=g.location;h=xb(h||sb);h!==void 0&&(g.href=h);return!0}
;function Cv(a){if(sg(R("PLAYER_VARS",{}))!="1"){a&&Gl();try{Du().then(function(){},function(){}),jm(Cv,18E5)}catch(b){Tl(b)}}}
;var Dv=new Map([["dark","USER_INTERFACE_THEME_DARK"],["light","USER_INTERFACE_THEME_LIGHT"]]);function Ev(){var a=a===void 0?window.location.href:a;if(U("kevlar_disable_theme_param"))return null;$b(ac(5,a));try{var b=bm(a).theme;return Dv.get(b)||null}catch(c){}return null}
;function Fv(){this.h={};if(this.i=$m()){var a=Ym("CONSISTENCY");a&&Gv(this,{encryptedTokenJarContents:a})}}
Fv.prototype.handleResponse=function(a,b){if(!b)throw Error("request needs to be passed into ConsistencyService");var c,d;b=((c=b.Pa.context)==null?void 0:(d=c.request)==null?void 0:d.consistencyTokenJars)||[];var e;if(a=(e=a.responseContext)==null?void 0:e.consistencyTokenJar){e=v(b);for(c=e.next();!c.done;c=e.next())delete this.h[c.value.encryptedTokenJarContents];Gv(this,a)}};
function Gv(a,b){if(b.encryptedTokenJarContents&&(a.h[b.encryptedTokenJarContents]=b,typeof b.expirationSeconds==="string")){var c=Number(b.expirationSeconds);setTimeout(function(){delete a.h[b.encryptedTokenJarContents]},c*1E3);
a.i&&Xm("CONSISTENCY",b.encryptedTokenJarContents,c,void 0,!0)}}
;var Hv=window.location.hostname.split(".").slice(-2).join(".");function Iv(){this.j=-1;var a=R("LOCATION_PLAYABILITY_TOKEN");R("INNERTUBE_CLIENT_NAME")==="TVHTML5"&&(this.h=Jv(this))&&(a=this.h.get("yt-location-playability-token"));a&&(this.locationPlayabilityToken=a,this.i=void 0)}
var Kv;function Lv(){Kv=E("yt.clientLocationService.instance");Kv||(Kv=new Iv,D("yt.clientLocationService.instance",Kv));return Kv}
p=Iv.prototype;
p.setLocationOnInnerTubeContext=function(a){a.client||(a.client={});if(this.i)a.client.locationInfo||(a.client.locationInfo={}),a.client.locationInfo.latitudeE7=Math.floor(this.i.coords.latitude*1E7),a.client.locationInfo.longitudeE7=Math.floor(this.i.coords.longitude*1E7),a.client.locationInfo.horizontalAccuracyMeters=Math.round(this.i.coords.accuracy),a.client.locationInfo.forceLocationPlayabilityTokenRefresh=!0;else if(this.o||this.locationPlayabilityToken)a.client.locationPlayabilityToken=this.o||
this.locationPlayabilityToken};
p.handleResponse=function(a){var b;a=(b=a.responseContext)==null?void 0:b.locationPlayabilityToken;a!==void 0&&(this.locationPlayabilityToken=a,this.i=void 0,R("INNERTUBE_CLIENT_NAME")==="TVHTML5"?(this.h=Jv(this))&&this.h.set("yt-location-playability-token",a,15552E3):Xm("YT_CL",JSON.stringify({loctok:a}),15552E3,Hv,!0))};
function Jv(a){return a.h===void 0?new Xn("yt-client-location"):a.h}
p.clearLocationPlayabilityToken=function(a){a==="TVHTML5"?(this.h=Jv(this))&&this.h.remove("yt-location-playability-token"):Zm("YT_CL");this.o=void 0;this.j!==-1&&(clearTimeout(this.j),this.j=-1)};
p.getCurrentPositionFromGeolocation=function(){var a=this;if(!(navigator&&navigator.geolocation&&navigator.geolocation.getCurrentPosition))return Promise.reject(Error("Geolocation unsupported"));var b=!1,c=1E4;R("INNERTUBE_CLIENT_NAME")==="MWEB"&&(b=!0,c=15E3);return new Promise(function(d,e){navigator.geolocation.getCurrentPosition(function(f){a.i=f;d(f)},function(f){e(f)},{enableHighAccuracy:b,
maximumAge:0,timeout:c})})};
p.createUnpluggedLocationInfo=function(a){var b={};a=a.coords;if(a==null?0:a.latitude)b.latitudeE7=Math.floor(a.latitude*1E7);if(a==null?0:a.longitude)b.longitudeE7=Math.floor(a.longitude*1E7);if(a==null?0:a.accuracy)b.locationRadiusMeters=Math.round(a.accuracy);return b};
p.createLocationInfo=function(a){var b={};a=a.coords;if(a==null?0:a.latitude)b.latitudeE7=Math.floor(a.latitude*1E7);if(a==null?0:a.longitude)b.longitudeE7=Math.floor(a.longitude*1E7);return b};function Mv(a){var b={"Content-Type":"application/json"};R("EOM_VISITOR_DATA")?b["X-Goog-EOM-Visitor-Id"]=R("EOM_VISITOR_DATA"):R("VISITOR_DATA")&&(b["X-Goog-Visitor-Id"]=R("VISITOR_DATA"));b["X-Youtube-Bootstrap-Logged-In"]=R("LOGGED_IN",!1);R("DEBUG_SETTINGS_METADATA")&&(b["X-Debug-Settings-Metadata"]=R("DEBUG_SETTINGS_METADATA"));a!=="cors"&&((a=R("INNERTUBE_CONTEXT_CLIENT_NAME"))&&(b["X-Youtube-Client-Name"]=a),(a=R("INNERTUBE_CONTEXT_CLIENT_VERSION"))&&(b["X-Youtube-Client-Version"]=a),(a=R("CHROME_CONNECTED_HEADER"))&&
(b["X-Youtube-Chrome-Connected"]=a),(a=R("DOMAIN_ADMIN_STATE"))&&(b["X-Youtube-Domain-Admin-State"]=a));return b}
;function Nv(){this.h={}}
Nv.prototype.contains=function(a){return Object.prototype.hasOwnProperty.call(this.h,a)};
Nv.prototype.get=function(a){if(this.contains(a))return this.h[a]};
Nv.prototype.set=function(a,b){this.h[a]=b};
Nv.prototype.remove=function(a){delete this.h[a]};function Ov(){this.mappings=new Nv}
Ov.prototype.getModuleId=function(a){return a.serviceId.getModuleId()};
Ov.prototype.get=function(a){a:{var b=this.mappings.get(a.toString());switch(b.type){case "mapping":a=b.value;break a;case "factory":b=b.value();this.mappings.set(a.toString(),{type:"mapping",value:b});a=b;break a;default:a=Db(b)}}return a};
new Ov;function Pv(a){return function(){return new a}}
;var Qv={},Rv=(Qv.WEB_UNPLUGGED="^unplugged/",Qv.WEB_UNPLUGGED_ONBOARDING="^unplugged/",Qv.WEB_UNPLUGGED_OPS="^unplugged/",Qv.WEB_UNPLUGGED_PUBLIC="^unplugged/",Qv.WEB_CREATOR="^creator/",Qv.WEB_KIDS="^kids/",Qv.WEB_EXPERIMENTS="^experiments/",Qv.WEB_MUSIC="^music/",Qv.WEB_REMIX="^music/",Qv.WEB_MUSIC_EMBEDDED_PLAYER="^music/",Qv.WEB_MUSIC_EMBEDDED_PLAYER="^main_app/|^sfv/",Qv);
function Sv(a){var b=b===void 0?"UNKNOWN_INTERFACE":b;if(a.length===1)return a[0];var c=Rv[b];if(c){c=new RegExp(c);for(var d=v(a),e=d.next();!e.done;e=d.next())if(e=e.value,c.exec(e))return e}var f=[];Object.entries(Rv).forEach(function(g){var h=v(g);g=h.next().value;h=h.next().value;b!==g&&f.push(h)});
c=new RegExp(f.join("|"));a.sort(function(g,h){return g.length-h.length});
d=v(a);for(e=d.next();!e.done;e=d.next())if(e=e.value,!c.exec(e))return e;return a[0]}
;function Tv(){}
Tv.prototype.D=function(a,b,c){b=b===void 0?{}:b;c=c===void 0?Wm:c;var d=a.clickTrackingParams,e=this.o,f=!1;f=f===void 0?!1:f;e=e===void 0?!1:e;var g=R("INNERTUBE_CONTEXT");if(g){g=vg(g);U("web_no_tracking_params_in_shell_killswitch")||delete g.clickTracking;g.client||(g.client={});var h=g.client;h.clientName==="MWEB"&&h.clientFormFactor!=="AUTOMOTIVE_FORM_FACTOR"&&(h.clientFormFactor=R("IS_TABLET")?"LARGE_FORM_FACTOR":"SMALL_FORM_FACTOR");h.screenWidthPoints=window.innerWidth;h.screenHeightPoints=
window.innerHeight;h.screenPixelDensity=Math.round(window.devicePixelRatio||1);h.screenDensityFloat=window.devicePixelRatio||1;h.utcOffsetMinutes=-Math.floor((new Date).getTimezoneOffset());var k=k===void 0?!1:k;dn();var l="USER_INTERFACE_THEME_LIGHT";gn(165)?l="USER_INTERFACE_THEME_DARK":gn(174)?l="USER_INTERFACE_THEME_LIGHT":!U("kevlar_legacy_browsers")&&window.matchMedia&&window.matchMedia("(prefers-color-scheme)").matches&&window.matchMedia("(prefers-color-scheme: dark)").matches&&(l="USER_INTERFACE_THEME_DARK");
k=k?l:Ev()||l;h.userInterfaceTheme=k;if(!f){if(k=mn())h.connectionType=k;U("web_log_effective_connection_type")&&(k=nn())&&(g.client.effectiveConnectionType=k)}var m;if(U("web_log_memory_total_kbytes")&&((m=C.navigator)==null?0:m.deviceMemory)){var n;m=(n=C.navigator)==null?void 0:n.deviceMemory;g.client.memoryTotalKbytes=""+m*1E6}U("web_gcf_hashes_innertube")&&(k=Up())&&(n=k.coldConfigData,m=k.coldHashData,k=k.hotHashData,g.client.configInfo=g.client.configInfo||{},n&&(g.client.configInfo.coldConfigData=
n),m&&(g.client.configInfo.coldHashData=m),k&&(g.client.configInfo.hotHashData=k));n=bm(C.location.href);!U("web_populate_internal_geo_killswitch")&&n.internalcountrycode&&(h.internalGeo=n.internalcountrycode);h.clientName==="MWEB"||h.clientName==="WEB"?(h.mainAppWebInfo={graftUrl:C.location.href},U("kevlar_woffle")&&Rm.h&&(n=Rm.h,h.mainAppWebInfo.pwaInstallabilityStatus=!n.h&&n.i?"PWA_INSTALLABILITY_STATUS_CAN_BE_INSTALLED":"PWA_INSTALLABILITY_STATUS_UNKNOWN"),h.mainAppWebInfo.webDisplayMode=Sm(),
h.mainAppWebInfo.isWebNativeShareAvailable=navigator&&navigator.share!==void 0):h.clientName==="TVHTML5"&&(!U("web_lr_app_quality_killswitch")&&(n=R("LIVING_ROOM_APP_QUALITY"))&&(h.tvAppInfo=Object.assign(h.tvAppInfo||{},{appQuality:n})),n=R("LIVING_ROOM_CERTIFICATION_SCOPE"))&&(h.tvAppInfo=Object.assign(h.tvAppInfo||{},{certificationScope:n}));if(!U("web_populate_time_zone_itc_killswitch")){b:{if(typeof Intl!=="undefined")try{var r=(new Intl.DateTimeFormat).resolvedOptions().timeZone;break b}catch(ua){}r=
void 0}r&&(h.timeZone=r)}(r=R("EXPERIMENTS_TOKEN",""))?h.experimentsToken=r:delete h.experimentsToken;r=nm();Fv.h||(Fv.h=new Fv);h=Fv.h.h;n=[];m=0;for(var t in h)n[m++]=h[t];g.request=Object.assign({},g.request,{internalExperimentFlags:r,consistencyTokenJars:n});!U("web_prequest_context_killswitch")&&(t=R("INNERTUBE_CONTEXT_PREQUEST_CONTEXT"))&&(g.request.externalPrequestContext=t);r=dn();t=gn(58);r=r.get("gsml","");g.user=Object.assign({},g.user);t&&(g.user.enableSafetyMode=t);r&&(g.user.lockedSafetyMode=
!0);U("warm_op_csn_cleanup")?e&&(f=ju())&&(g.clientScreenNonce=f):!f&&(f=ju())&&(g.clientScreenNonce=f);d&&(g.clickTracking={clickTrackingParams:d});if(d=E("yt.mdx.remote.remoteClient_"))g.remoteClient=d;Lv().setLocationOnInnerTubeContext(g);try{var w=em(),y=w.bid;delete w.bid;g.adSignalsInfo={params:[],bid:y};var z=v(Object.entries(w));for(var G=z.next();!G.done;G=z.next()){var I=v(G.value),N=I.next().value,S=I.next().value;w=N;y=S;d=void 0;(d=g.adSignalsInfo.params)==null||d.push({key:w,value:""+
y})}var ta;if(((ta=g.client)==null?void 0:ta.clientName)==="TVHTML5"){var lb=R("INNERTUBE_CONTEXT");lb.adSignalsInfo&&(g.adSignalsInfo.advertisingId=lb.adSignalsInfo.advertisingId,g.adSignalsInfo.advertisingIdSignalType="DEVICE_ID_TYPE_CONNECTED_TV_IFA",g.adSignalsInfo.limitAdTracking=lb.adSignalsInfo.limitAdTracking)}}catch(ua){Rt(ua)}z=g}else Rt(Error("Error: No InnerTubeContext shell provided in ytconfig.")),z={};z={context:z};if(G=this.i(a)){this.h(z,G,b);var T;b="/youtubei/v1/"+Sv(this.j());
(G=(T=Ys(a.commandMetadata,tl))==null?void 0:T.apiUrl)&&(b=G);T=b;(b=R("INNERTUBE_HOST_OVERRIDE"))&&(T=String(b)+String(cc(T)));b={};U("web_api_key_killswitch")&&(b.key=R("INNERTUBE_API_KEY"));U("json_condensed_response")&&(b.prettyPrint="false");T=cm(T,b||{},!1);a=Object.assign({},{command:a},void 0);a={input:T,hb:tu(T),Pa:z,config:a};a.config.Ub?a.config.Ub.identity=c:a.config.Ub={identity:c};return a}Rt(new V("Error: Failed to create Request from Command.",a))};
da.Object.defineProperties(Tv.prototype,{o:{configurable:!0,enumerable:!0,get:function(){return!1}}});
function Uv(){}
x(Uv,Tv);function Vv(){}
x(Vv,Uv);Vv.prototype.D=function(){return{input:"/getDatasyncIdsEndpoint",hb:tu("/getDatasyncIdsEndpoint","GET"),Pa:{}}};
Vv.prototype.j=function(){return[]};
Vv.prototype.i=function(){};
Vv.prototype.h=function(){};var Wv={},Xv=(Wv.GET_DATASYNC_IDS=Pv(Vv),Wv);function Yv(a){var b;(b=E("ytcsi."+(a||"")+"data_"))||(b={tick:{},info:{}},D("ytcsi."+(a||"")+"data_",b));return b}
function Zv(){var a=Yv();a.info||(a.info={});return a.info}
function $v(a){a=Yv(a);a.metadata||(a.metadata={});return a.metadata}
function aw(a){a=Yv(a);a.tick||(a.tick={});return a.tick}
function bw(a){a=Yv(a);if(a.gel){var b=a.gel;b.gelInfos||(b.gelInfos={});b.gelTicks||(b.gelTicks={})}else a.gel={gelTicks:{},gelInfos:{}};return a.gel}
function cw(a){a=bw(a);a.gelInfos||(a.gelInfos={});return a.gelInfos}
function dw(a){var b=Yv(a).nonce;b||(b=$t(),Yv(a).nonce=b);return b}
;function ew(){var a=E("ytcsi.debug");a||(a=[],D("ytcsi.debug",a),D("ytcsi.reference",{}));return a}
function fw(a){a=a||"";var b=E("ytcsi.reference");b||(ew(),b=E("ytcsi.reference"));if(b[a])return b[a];var c=ew(),d={timerName:a,info:{},tick:{},span:{},jspbInfo:[]};c.push(d);return b[a]=d}
;var X={},gw=(X.auto_search="LATENCY_ACTION_AUTO_SEARCH",X.ad_to_ad="LATENCY_ACTION_AD_TO_AD",X.ad_to_video="LATENCY_ACTION_AD_TO_VIDEO",X["analytics.explore"]="LATENCY_ACTION_CREATOR_ANALYTICS_EXPLORE",X.app_startup="LATENCY_ACTION_APP_STARTUP",X["artist.analytics"]="LATENCY_ACTION_CREATOR_ARTIST_ANALYTICS",X["artist.events"]="LATENCY_ACTION_CREATOR_ARTIST_CONCERTS",X["artist.presskit"]="LATENCY_ACTION_CREATOR_ARTIST_PROFILE",X["asset.claimed_videos"]="LATENCY_ACTION_CREATOR_CMS_ASSET_CLAIMED_VIDEOS",
X["asset.composition"]="LATENCY_ACTION_CREATOR_CMS_ASSET_COMPOSITION",X["asset.composition_ownership"]="LATENCY_ACTION_CREATOR_CMS_ASSET_COMPOSITION_OWNERSHIP",X["asset.composition_policy"]="LATENCY_ACTION_CREATOR_CMS_ASSET_COMPOSITION_POLICY",X["asset.embeds"]="LATENCY_ACTION_CREATOR_CMS_ASSET_EMBEDS",X["asset.history"]="LATENCY_ACTION_CREATOR_CMS_ASSET_HISTORY",X["asset.issues"]="LATENCY_ACTION_CREATOR_CMS_ASSET_ISSUES",X["asset.licenses"]="LATENCY_ACTION_CREATOR_CMS_ASSET_LICENSES",X["asset.metadata"]=
"LATENCY_ACTION_CREATOR_CMS_ASSET_METADATA",X["asset.ownership"]="LATENCY_ACTION_CREATOR_CMS_ASSET_OWNERSHIP",X["asset.policy"]="LATENCY_ACTION_CREATOR_CMS_ASSET_POLICY",X["asset.references"]="LATENCY_ACTION_CREATOR_CMS_ASSET_REFERENCES",X["asset.shares"]="LATENCY_ACTION_CREATOR_CMS_ASSET_SHARES",X["asset.sound_recordings"]="LATENCY_ACTION_CREATOR_CMS_ASSET_SOUND_RECORDINGS",X["asset_group.assets"]="LATENCY_ACTION_CREATOR_CMS_ASSET_GROUP_ASSETS",X["asset_group.campaigns"]="LATENCY_ACTION_CREATOR_CMS_ASSET_GROUP_CAMPAIGNS",
X["asset_group.claimed_videos"]="LATENCY_ACTION_CREATOR_CMS_ASSET_GROUP_CLAIMED_VIDEOS",X["asset_group.metadata"]="LATENCY_ACTION_CREATOR_CMS_ASSET_GROUP_METADATA",X["song.analytics"]="LATENCY_ACTION_CREATOR_SONG_ANALYTICS",X.browse="LATENCY_ACTION_BROWSE",X.cast_splash="LATENCY_ACTION_CAST_SPLASH",X.channel_activity="LATENCY_ACTION_KIDS_CHANNEL_ACTIVITY",X.channels="LATENCY_ACTION_CHANNELS",X.creator_channel_dashboard="LATENCY_ACTION_CREATOR_CHANNEL_DASHBOARD",X["channel.analytics"]="LATENCY_ACTION_CREATOR_CHANNEL_ANALYTICS",
X["channel.comments"]="LATENCY_ACTION_CREATOR_CHANNEL_COMMENTS",X["channel.content"]="LATENCY_ACTION_CREATOR_POST_LIST",X["channel.content.promotions"]="LATENCY_ACTION_CREATOR_PROMOTION_LIST",X["channel.copyright"]="LATENCY_ACTION_CREATOR_CHANNEL_COPYRIGHT",X["channel.editing"]="LATENCY_ACTION_CREATOR_CHANNEL_EDITING",X["channel.monetization"]="LATENCY_ACTION_CREATOR_CHANNEL_MONETIZATION",X["channel.music"]="LATENCY_ACTION_CREATOR_CHANNEL_MUSIC",X["channel.music_storefront"]="LATENCY_ACTION_CREATOR_CHANNEL_MUSIC_STOREFRONT",
X["channel.playlists"]="LATENCY_ACTION_CREATOR_CHANNEL_PLAYLISTS",X["channel.translations"]="LATENCY_ACTION_CREATOR_CHANNEL_TRANSLATIONS",X["channel.videos"]="LATENCY_ACTION_CREATOR_CHANNEL_VIDEOS",X["channel.live_streaming"]="LATENCY_ACTION_CREATOR_LIVE_STREAMING",X.chips="LATENCY_ACTION_CHIPS",X.commerce_transaction="LATENCY_ACTION_COMMERCE_TRANSACTION",X["dialog.copyright_strikes"]="LATENCY_ACTION_CREATOR_DIALOG_COPYRIGHT_STRIKES",X["dialog.video_copyright"]="LATENCY_ACTION_CREATOR_DIALOG_VIDEO_COPYRIGHT",
X["dialog.uploads"]="LATENCY_ACTION_CREATOR_DIALOG_UPLOADS",X.direct_playback="LATENCY_ACTION_DIRECT_PLAYBACK",X.embed="LATENCY_ACTION_EMBED",X.entity_key_serialization_perf="LATENCY_ACTION_ENTITY_KEY_SERIALIZATION_PERF",X.entity_key_deserialization_perf="LATENCY_ACTION_ENTITY_KEY_DESERIALIZATION_PERF",X.explore="LATENCY_ACTION_EXPLORE",X.favorites="LATENCY_ACTION_FAVORITES",X.home="LATENCY_ACTION_HOME",X.inboarding="LATENCY_ACTION_INBOARDING",X.library="LATENCY_ACTION_LIBRARY",X.live="LATENCY_ACTION_LIVE",
X.live_pagination="LATENCY_ACTION_LIVE_PAGINATION",X.mini_app="LATENCY_ACTION_MINI_APP_PLAY",X.notification_settings="LATENCY_ACTION_KIDS_NOTIFICATION_SETTINGS",X.onboarding="LATENCY_ACTION_ONBOARDING",X.owner="LATENCY_ACTION_CREATOR_CMS_DASHBOARD",X["owner.allowlist"]="LATENCY_ACTION_CREATOR_CMS_ALLOWLIST",X["owner.analytics"]="LATENCY_ACTION_CREATOR_CMS_ANALYTICS",X["owner.art_tracks"]="LATENCY_ACTION_CREATOR_CMS_ART_TRACKS",X["owner.assets"]="LATENCY_ACTION_CREATOR_CMS_ASSETS",X["owner.asset_groups"]=
"LATENCY_ACTION_CREATOR_CMS_ASSET_GROUPS",X["owner.bulk"]="LATENCY_ACTION_CREATOR_CMS_BULK_HISTORY",X["owner.campaigns"]="LATENCY_ACTION_CREATOR_CMS_CAMPAIGNS",X["owner.channel_invites"]="LATENCY_ACTION_CREATOR_CMS_CHANNEL_INVITES",X["owner.channels"]="LATENCY_ACTION_CREATOR_CMS_CHANNELS",X["owner.claimed_videos"]="LATENCY_ACTION_CREATOR_CMS_CLAIMED_VIDEOS",X["owner.claims"]="LATENCY_ACTION_CREATOR_CMS_MANUAL_CLAIMING",X["owner.claims.manual"]="LATENCY_ACTION_CREATOR_CMS_MANUAL_CLAIMING",X["owner.delivery"]=
"LATENCY_ACTION_CREATOR_CMS_CONTENT_DELIVERY",X["owner.delivery_templates"]="LATENCY_ACTION_CREATOR_CMS_DELIVERY_TEMPLATES",X["owner.issues"]="LATENCY_ACTION_CREATOR_CMS_ISSUES",X["owner.licenses"]="LATENCY_ACTION_CREATOR_CMS_LICENSES",X["owner.pitch_music"]="LATENCY_ACTION_CREATOR_CMS_PITCH_MUSIC",X["owner.policies"]="LATENCY_ACTION_CREATOR_CMS_POLICIES",X["owner.releases"]="LATENCY_ACTION_CREATOR_CMS_RELEASES",X["owner.reports"]="LATENCY_ACTION_CREATOR_CMS_REPORTS",X["owner.videos"]="LATENCY_ACTION_CREATOR_CMS_VIDEOS",
X.parent_profile_settings="LATENCY_ACTION_KIDS_PARENT_PROFILE_SETTINGS",X.parent_tools_collection="LATENCY_ACTION_PARENT_TOOLS_COLLECTION",X.parent_tools_dashboard="LATENCY_ACTION_PARENT_TOOLS_DASHBOARD",X.player_att="LATENCY_ACTION_PLAYER_ATTESTATION",X["playlist.videos"]="LATENCY_ACTION_CREATOR_PLAYLIST_VIDEO_LIST",X["post.comments"]="LATENCY_ACTION_CREATOR_POST_COMMENTS",X["post.edit"]="LATENCY_ACTION_CREATOR_POST_EDIT",X.prebuffer="LATENCY_ACTION_PREBUFFER",X.prefetch="LATENCY_ACTION_PREFETCH",
X.profile_settings="LATENCY_ACTION_KIDS_PROFILE_SETTINGS",X.profile_switcher="LATENCY_ACTION_LOGIN",X.reel_watch="LATENCY_ACTION_REEL_WATCH",X.results="LATENCY_ACTION_RESULTS",X["promotion.edit"]="LATENCY_ACTION_CREATOR_PROMOTION_EDIT",X.red="LATENCY_ACTION_PREMIUM_PAGE_GET_BROWSE",X.premium="LATENCY_ACTION_PREMIUM_PAGE_GET_BROWSE",X.privacy_policy="LATENCY_ACTION_KIDS_PRIVACY_POLICY",X.search_overview_answer="LATENCY_ACTION_SEARCH_OVERVIEW_ANSWER",X.search_ui="LATENCY_ACTION_SEARCH_UI",X.search_suggest=
"LATENCY_ACTION_SUGGEST",X.search_zero_state="LATENCY_ACTION_SEARCH_ZERO_STATE",X.secret_code="LATENCY_ACTION_KIDS_SECRET_CODE",X.seek="LATENCY_ACTION_PLAYER_SEEK",X.settings="LATENCY_ACTION_SETTINGS",X.store="LATENCY_ACTION_STORE",X.supervision_dashboard="LATENCY_ACTION_KIDS_SUPERVISION_DASHBOARD",X.tenx="LATENCY_ACTION_TENX",X.video_to_ad="LATENCY_ACTION_VIDEO_TO_AD",X.watch="LATENCY_ACTION_WATCH",X.watch_it_again="LATENCY_ACTION_KIDS_WATCH_IT_AGAIN",X["watch,watch7"]="LATENCY_ACTION_WATCH",X["watch,watch7_html5"]=
"LATENCY_ACTION_WATCH",X["watch,watch7ad"]="LATENCY_ACTION_WATCH",X["watch,watch7ad_html5"]="LATENCY_ACTION_WATCH",X.wn_comments="LATENCY_ACTION_LOAD_COMMENTS",X.ww_rqs="LATENCY_ACTION_WHO_IS_WATCHING",X["video.analytics"]="LATENCY_ACTION_CREATOR_VIDEO_ANALYTICS",X["video.claims"]="LATENCY_ACTION_CREATOR_VIDEO_CLAIMS",X["video.comments"]="LATENCY_ACTION_CREATOR_VIDEO_COMMENTS",X["video.copyright"]="LATENCY_ACTION_CREATOR_VIDEO_COPYRIGHT",X["video.edit"]="LATENCY_ACTION_CREATOR_VIDEO_EDIT",X["video.editor"]=
"LATENCY_ACTION_CREATOR_VIDEO_VIDEO_EDITOR",X["video.editor_async"]="LATENCY_ACTION_CREATOR_VIDEO_VIDEO_EDITOR_ASYNC",X["video.live_settings"]="LATENCY_ACTION_CREATOR_VIDEO_LIVE_SETTINGS",X["video.live_streaming"]="LATENCY_ACTION_CREATOR_VIDEO_LIVE_STREAMING",X["video.monetization"]="LATENCY_ACTION_CREATOR_VIDEO_MONETIZATION",X["video.policy"]="LATENCY_ACTION_CREATOR_VIDEO_POLICY",X["video.rights_management"]="LATENCY_ACTION_CREATOR_VIDEO_RIGHTS_MANAGEMENT",X["video.translations"]="LATENCY_ACTION_CREATOR_VIDEO_TRANSLATIONS",
X.voice_assistant="LATENCY_ACTION_VOICE_ASSISTANT",X.cast_load_by_entity_to_watch="LATENCY_ACTION_CAST_LOAD_BY_ENTITY_TO_WATCH",X.networkless_performance="LATENCY_ACTION_NETWORKLESS_PERFORMANCE",X.gel_compression="LATENCY_ACTION_GEL_COMPRESSION",X.gel_jspb_serialize="LATENCY_ACTION_GEL_JSPB_SERIALIZE",X);function hw(a,b){aq.call(this,1,arguments);this.timer=b}
x(hw,aq);var iw=new bq("aft-recorded",hw);D("ytLoggingGelSequenceIdObj_",C.ytLoggingGelSequenceIdObj_||{});var jw=C.ytLoggingLatencyUsageStats_||{};D("ytLoggingLatencyUsageStats_",jw);function kw(){this.h=0}
function lw(){kw.h||(kw.h=new kw);return kw.h}
kw.prototype.tick=function(a,b,c,d){mw(this,"tick_"+a+"_"+b)||go("latencyActionTicked",{tickName:a,clientActionNonce:b},{timestamp:c,cttAuthInfo:d})};
kw.prototype.info=function(a,b,c){var d=Object.keys(a).join("");mw(this,"info_"+d+"_"+b)||(a=Object.assign({},a),a.clientActionNonce=b,go("latencyActionInfo",a,{cttAuthInfo:c}))};
kw.prototype.jspbInfo=function(){};
kw.prototype.span=function(a,b,c){var d=Object.keys(a).join("");mw(this,"span_"+d+"_"+b)||(a.clientActionNonce=b,go("latencyActionSpan",a,{cttAuthInfo:c}))};
function mw(a,b){jw[b]=jw[b]||{count:0};var c=jw[b];c.count++;c.time=W();a.h||(a.h=rn(function(){var d=W(),e;for(e in jw)jw[e]&&d-jw[e].time>6E4&&delete jw[e];a&&(a.h=0)},5E3));
return c.count>5?(c.count===6&&Math.random()*1E5<1&&(c=new V("CSI data exceeded logging limit with key",b.split("_")),b.indexOf("plev")>=0||St(c)),!0):!1}
;var nw=window;function ow(){this.timing={};this.clearResourceTimings=function(){};
this.webkitClearResourceTimings=function(){};
this.mozClearResourceTimings=function(){};
this.msClearResourceTimings=function(){};
this.oClearResourceTimings=function(){}}
function pw(){var a;if(U("csi_use_performance_navigation_timing")||U("csi_use_performance_navigation_timing_tvhtml5")){var b,c,d,e=Y==null?void 0:(a=Y.getEntriesByType)==null?void 0:(b=a.call(Y,"navigation"))==null?void 0:(c=b[0])==null?void 0:(d=c.toJSON)==null?void 0:d.call(c);e?(e.requestStart=qw(e.requestStart),e.responseEnd=qw(e.responseEnd),e.redirectStart=qw(e.redirectStart),e.redirectEnd=qw(e.redirectEnd),e.domainLookupEnd=qw(e.domainLookupEnd),e.connectStart=qw(e.connectStart),e.connectEnd=
qw(e.connectEnd),e.responseStart=qw(e.responseStart),e.secureConnectionStart=qw(e.secureConnectionStart),e.domainLookupStart=qw(e.domainLookupStart),e.isPerformanceNavigationTiming=!0,a=e):a=Y.timing}else a=U("csi_performance_timing_to_object")?JSON.parse(JSON.stringify(Y.timing)):Y.timing;return a}
function qw(a){return Math.round(rw()+a)}
function rw(){return(U("csi_use_time_origin")||U("csi_use_time_origin_tvhtml5"))&&Y.timeOrigin?Math.floor(Y.timeOrigin):Y.timing.navigationStart}
var Y=nw.performance||nw.mozPerformance||nw.msPerformance||nw.webkitPerformance||new ow;var sw=!1,tw=!1,uw={'script[name="scheduler/scheduler"]':"sj",'script[name="player/base"]':"pj",'link[rel="preload"][name="player/embed"]':"pej",'link[rel="stylesheet"][name="www-player"]':"pc",'link[rel="stylesheet"][name="player/www-player"]':"pc",'script[name="desktop_polymer/desktop_polymer"]':"dpj",'link[rel="import"][name="desktop_polymer"]':"dph",'script[name="mobile-c3"]':"mcj",'link[rel="stylesheet"][name="mobile-c3"]':"mcc",'script[name="player-plasma-ias-phone/base"]':"mcppj",'script[name="player-plasma-ias-tablet/base"]':"mcptj",
'link[rel="stylesheet"][name="mobile-polymer-player-ias"]':"mcpc",'link[rel="stylesheet"][name="mobile-polymer-player-svg-ias"]':"mcpsc",'script[name="mobile_blazer_core_mod"]':"mbcj",'link[rel="stylesheet"][name="mobile_blazer_css"]':"mbc",'script[name="mobile_blazer_logged_in_users_mod"]':"mbliuj",'script[name="mobile_blazer_logged_out_users_mod"]':"mblouj",'script[name="mobile_blazer_noncore_mod"]':"mbnj","#player_css":"mbpc",'script[name="mobile_blazer_desktopplayer_mod"]':"mbpj",'link[rel="stylesheet"][name="mobile_blazer_tablet_css"]':"mbtc",
'script[name="mobile_blazer_watch_mod"]':"mbwj"};Wa(Y.clearResourceTimings||Y.webkitClearResourceTimings||Y.mozClearResourceTimings||Y.msClearResourceTimings||Y.oClearResourceTimings||Uh,Y);function vw(a,b){if(!U("web_csi_action_sampling_enabled")||!Yv(b).actionDisabled){var c=fw(b||"");bv(c.info,a);a.loadType&&(c=a.loadType,$v(b).loadType=c);bv(cw(b),a);c=dw(b);b=Yv(b).cttAuthInfo;lw().info(a,c,b)}}
function ww(){var a,b,c,d;return((d=Bs().resolve(new vs(Qp))==null?void 0:(a=Rp())==null?void 0:(b=a.loggingHotConfig)==null?void 0:(c=b.csiConfig)==null?void 0:c.debugTicks)!=null?d:[]).map(function(e){return Object.values(e)[0]})}
function Z(a,b,c){if(!U("web_csi_action_sampling_enabled")||!Yv(c).actionDisabled){var d=dw(c),e;if(e=U("web_csi_debug_sample_enabled")&&d){(Bs().resolve(new vs(Qp))==null?0:Rp())&&!tw&&(tw=!0,Z("gcfl",W(),c));var f,g,h;e=(Bs().resolve(new vs(Qp))==null?void 0:(f=Rp())==null?void 0:(g=f.loggingHotConfig)==null?void 0:(h=g.csiConfig)==null?void 0:h.debugSampleWeight)||0;if(f=e!==0)b:{f=ww();if(f.length>0)for(g=0;g<f.length;g++)if(a===f[g]){f=!0;break b}f=!1}if(f){for(g=f=0;g<d.length;g++)f=f*31+d.charCodeAt(g),
g<d.length-1&&(f%=Math.pow(2,47));e=f%1E5%e!==0;Yv(c).debugTicksExcludedLogged||(f={},f.debugTicksExcluded=e,vw(f,c));Yv(c).debugTicksExcludedLogged=!0}else e=!1}if(!e){if(a[0]!=="_"&&(e=a,f=b,Y.mark))if(e.startsWith("mark_")||(e="mark_"+e),c&&(e+=" ("+c+")"),f===void 0||U("web_csi_disable_alt_time_performance_mark"))Y.mark(e);else{f=U("csi_use_performance_navigation_timing")||U("csi_use_performance_navigation_timing_tvhtml5")?f-Y.timeOrigin:f-(Y.timeOrigin||Y.timing.navigationStart);try{Y.mark(e,
{startTime:f})}catch(k){}}e=fw(c||"");e.tick[a]=b||W();if(e.callback&&e.callback[a])for(e=v(e.callback[a]),f=e.next();!f.done;f=e.next())f=f.value,f();e=bw(c);e.gelTicks&&(e.gelTicks[a]=!0);f=aw(c);e=b||W();U("log_repeated_ytcsi_ticks")?a in f||(f[a]=e):f[a]=e;f=Yv(c).cttAuthInfo;a==="_start"?(a=lw(),mw(a,"baseline_"+d)||go("latencyActionBaselined",{clientActionNonce:d},{timestamp:b,cttAuthInfo:f})):lw().tick(a,d,b,f);xw(c);return e}}}
function yw(){var a=document;if("visibilityState"in a)a=a.visibilityState;else{var b=Tr+"VisibilityState";a=b in a?a[b]:void 0}switch(a){case "hidden":return 0;case "visible":return 1;case "prerender":return 2;case "unloaded":return 3;default:return-1}}
function zw(){function a(f,g,h){g=g.match("_rid")?g.split("_rid")[0]:g;typeof h==="number"&&(h=JSON.stringify(h));f.requestIds?f.requestIds.push({endpoint:g,id:h}):f.requestIds=[{endpoint:g,id:h}]}
for(var b={},c=v(Object.entries(R("TIMING_INFO",{}))),d=c.next();!d.done;d=c.next()){var e=v(d.value);d=e.next().value;e=e.next().value;switch(d){case "GetBrowse_rid":a(b,d,e);break;case "GetGuide_rid":a(b,d,e);break;case "GetHome_rid":a(b,d,e);break;case "GetPlayer_rid":a(b,d,e);break;case "GetSearch_rid":a(b,d,e);break;case "GetSettings_rid":a(b,d,e);break;case "GetTrending_rid":a(b,d,e);break;case "GetWatchNext_rid":a(b,d,e);break;case "yt_red":b.isRedSubscriber=!!e;break;case "yt_ad":b.isMonetized=
!!e}}return b}
function Aw(a,b){a=document.querySelector(a);if(!a)return!1;var c="",d=a.nodeName;d==="SCRIPT"?(c=a.src,c||(c=a.getAttribute("data-timing-href"))&&(c=window.location.protocol+c)):d==="LINK"&&(c=a.href);Gb(window)&&a.setAttribute("nonce",Gb(window));return c?(a=Y.getEntriesByName(c))&&a[0]&&(a=a[0],c=rw(),Z("rsf_"+b,c+Math.round(a.fetchStart)),Z("rse_"+b,c+Math.round(a.responseEnd)),a.transferSize!==void 0&&a.transferSize===0)?!0:!1:!1}
function Bw(){var a=window.location.protocol,b=Y.getEntriesByType("resource");b=Nb(b,function(c){return c.name.indexOf(a+"//fonts.gstatic.com/s/")===0});
(b=Pb(b,function(c,d){return d.duration>c.duration?d:c},{duration:0}))&&b.startTime>0&&b.responseEnd>0&&(Z("wffs",qw(b.startTime)),Z("wffe",qw(b.responseEnd)))}
function Cw(a){var b=Dw("aft",a);if(b)return b;b=R((a||"")+"TIMING_AFT_KEYS",["ol"]);for(var c=b.length,d=0;d<c;d++){var e=Dw(b[d],a);if(e)return e}return NaN}
function Dw(a,b){if(a=aw(b)[a])return typeof a==="number"?a:a[a.length-1]}
function xw(a){var b=Dw("_start",a),c=Cw(a),d=U("enable_cow_info_csi")||!sw;b&&c&&d&&(gq(iw,new hw(Math.round(c-b),a)),sw=!0)}
function Ew(){if(Y.getEntriesByType){var a=Y.getEntriesByType("paint");if(a=Qb(a,function(c){return c.name==="first-paint"}))return qw(a.startTime)}var b;
U("csi_use_performance_navigation_timing")||U("csi_use_performance_navigation_timing_tvhtml5")?b=Y.getEntriesByType("first-paint")[0].startTime:b=Y.timing.bh;return b?Math.max(0,b):0}
;function Fw(a,b){Sl(function(){fw("").info.actionType=a;b&&Ol("TIMING_AFT_KEYS",b);Ol("TIMING_ACTION",a);var c=zw();Object.keys(c).length>0&&vw(c);c={isNavigation:!0,actionType:gw[R("TIMING_ACTION")]||"LATENCY_ACTION_UNKNOWN"};var d=R("PREVIOUS_ACTION");d&&(c.previousAction=gw[d]||"LATENCY_ACTION_UNKNOWN");if(d=R("CLIENT_PROTOCOL"))c.httpProtocol=d;if(d=R("CLIENT_TRANSPORT"))c.transportProtocol=d;(d=ju())&&d!=="UNDEFINED_CSN"&&(c.clientScreenNonce=d);d=yw();if(d===1||d===-1)c.isVisible=!0;$v();Zv();
c.loadType="cold";d=Zv();var e=pw(),f=rw(),g=R("CSI_START_TIMESTAMP_MILLIS",0);g>0&&!U("embeds_web_enable_csi_start_override_killswitch")&&(f=g);f&&(Z("srt",e.responseStart),d.prerender!==1&&Z("_start",f,void 0));d=Ew();d>0&&Z("fpt",d);d=pw();d.isPerformanceNavigationTiming&&vw({performanceNavigationTiming:!0},void 0);Z("nreqs",d.requestStart,void 0);Z("nress",d.responseStart,void 0);Z("nrese",d.responseEnd,void 0);d.redirectEnd-d.redirectStart>0&&(Z("nrs",d.redirectStart,void 0),Z("nre",d.redirectEnd,
void 0));d.domainLookupEnd-d.domainLookupStart>0&&(Z("ndnss",d.domainLookupStart,void 0),Z("ndnse",d.domainLookupEnd,void 0));d.connectEnd-d.connectStart>0&&(Z("ntcps",d.connectStart,void 0),Z("ntcpe",d.connectEnd,void 0));d.secureConnectionStart>=rw()&&d.connectEnd-d.secureConnectionStart>0&&(Z("nstcps",d.secureConnectionStart,void 0),Z("ntcpe",d.connectEnd,void 0));Y&&"getEntriesByType"in Y&&Bw();d=[];if(document.querySelector&&Y&&Y.getEntriesByName)for(var h in uw)uw.hasOwnProperty(h)&&(e=uw[h],
Aw(h,e)&&d.push(e));if(d.length>0)for(c.resourceInfo=[],h=v(d),d=h.next();!d.done;d=h.next())c.resourceInfo.push({resourceCache:d.value});vw(c);c=bw();c.preLoggedGelInfos||(c.preLoggedGelInfos=[]);h=c.preLoggedGelInfos;c=cw();d=void 0;for(e=0;e<h.length;e++)if(f=h[e],f.loadType){d=f.loadType;break}if($v().loadType==="cold"&&(c.loadType==="cold"||d==="cold")){d=aw();e=bw();e=e.gelTicks?e.gelTicks:e.gelTicks={};for(var k in d)if(!(k in e))if(typeof d[k]==="number")Z(k,Dw(k));else if(U("log_repeated_ytcsi_ticks"))for(f=
v(d[k]),g=f.next();!g.done;g=f.next())g=g.value,Z(k.slice(1),g);k={};d=!1;h=v(h);for(e=h.next();!e.done;e=h.next())d=e.value,bv(c,d),bv(k,d),d=!0;d&&vw(k)}D("ytglobal.timingready_",!0);k=R("TIMING_ACTION");E("ytglobal.timingready_")&&k&&Gw()&&Cw()&&xw()})()}
function Gw(){return Sl(function(){return Hw()})()}
function Iw(a,b,c){Sl(vw)(a,b,c===void 0?!1:c)}
function Jw(a,b,c){return Sl(Z)(a,b,c)}
function Hw(){return Sl(function(){return"_start"in aw()})()}
function Kw(){Sl(function(){var a=dw();requestAnimationFrame(function(){setTimeout(function(){a===dw()&&Jw("ol",void 0,void 0)},0)})})()}
var Lw=window;Lw.ytcsi&&(Lw.ytcsi.infoGel=Iw,Lw.ytcsi.tick=Jw);var Mw="tokens consistency mss client_location entities adblock_detection response_received_commands store PLAYER_PRELOAD shorts_prefetch".split(" "),Nw=["type.googleapis.com/youtube.api.pfiinnertube.YoutubeApiInnertube.BrowseResponse","type.googleapis.com/youtube.api.pfiinnertube.YoutubeApiInnertube.PlayerResponse"];function Ow(a,b,c,d){this.D=a;this.fa=b;this.o=c;this.j=d;this.i=void 0;this.h=new Map;a.Pb||(a.Pb={});a.Pb=Object.assign({},Xv,a.Pb)}
function Pw(a,b,c,d){if(Ow.h!==void 0){if(d=Ow.h,a=[a!==d.D,b!==d.fa,c!==d.o,!1,!1,!1,void 0!==d.i],a.some(function(e){return e}))throw new V("InnerTubeTransportService is already initialized",a);
}else Ow.h=new Ow(a,b,c,d)}
function Qw(a){var b={signalServiceEndpoint:{signal:"GET_DATASYNC_IDS"}};var c=c===void 0?Wm:c;var d=Rw(a,b);return d?new gi(function(e,f){var g,h,k,l,m;return A(function(n){switch(n.h){case 1:return n.yield(d,2);case 2:g=n.i;h=g.D(b,void 0,c);if(!h){f(new V("Error: Failed to build request for command.",b));n.F(0);break}Av(h.input);l=((k=h.hb)==null?void 0:k.mode)==="cors"?"cors":void 0;if(a.o.af){var r=h.config,t,w=r==null?void 0:(t=r.Ub)==null?void 0:t.sessionIndex,y;r=((y=Ys(r==null?void 0:r.command,
ul))==null?void 0:y.signal)==="GET_ACCOUNT_MENU"?!0:!1;w=Vm(0,{sessionIndex:w,dd:r});m=Object.assign({},Mv(l),w);n.F(4);break}return n.yield(Sw(h.config,l),5);case 5:m=n.i;case 4:e(Tw(a,h,m)),n.h=0}})}):li(new V("Error: No request builder found for command.",b))}
function Uw(a,b,c){var d;if(b&&!(b==null?0:(d=b.sequenceMetaData)==null?0:d.skipProcessing)&&a.j){d=v(Mw);for(var e=d.next();!e.done;e=d.next())e=e.value,a.j[e]&&a.j[e].handleResponse(b,c)}}
function Tw(a,b,c){var d=d===void 0?function(){}:d;
var e,f,g,h,k,l,m,n,r,t,w,y,z,G,I,N,S,ta,lb,T,ua,La,Ma,Ka,Zg,$g,Ir,Jr,Kr,Lr;return A(function(fa){switch(fa.h){case 1:fa.F(2);break;case 3:if((e=fa.i)&&!e.isExpired())return fa.return(Promise.resolve(e.h()));case 2:if(!((f=b)==null?0:(g=f.Pa)==null?0:g.context)){fa.F(4);break}h=b.Pa.context;fa.F(5);break;case 5:k=v([]),l=k.next();case 8:if(l.done){fa.F(4);break}m=l.value;return fa.yield(m.eh(h),9);case 9:l=k.next();fa.F(8);break;case 4:if((n=a.i)==null||!n.jh(b.input,b.Pa)){fa.F(12);break}return fa.yield(a.i.Yg(b.input,
b.Pa),13);case 13:return r=fa.i,U("kevlar_process_local_innertube_responses_killswitch")||Uw(a,r,b),fa.return(r);case 12:return(y=(w=b.config)==null?void 0:w.hh)&&a.h.has(y)?t=a.h.get(y):(z=JSON.stringify(b.Pa),N=(I=(G=b.hb)==null?void 0:G.headers)!=null?I:{},b.hb=Object.assign({},b.hb,{headers:Object.assign({},N,c)}),S=Object.assign({},b.hb),b.hb.method==="POST"&&(S=Object.assign({},S,{body:z})),((ta=b.config)==null?0:ta.Fe)&&Jw(b.config.Fe),lb=function(){return a.fa.fetch(b.input,S,b.config)},t=
lb(),y&&a.h.set(y,t)),fa.yield(t,14);
case 14:if((T=fa.i)&&"error"in T&&((ua=T)==null?0:(La=ua.error)==null?0:La.details))for(Ma=T.error.details,Ka=v(Ma),Zg=Ka.next();!Zg.done;Zg=Ka.next())$g=Zg.value,(Ir=$g["@type"])&&Nw.indexOf(Ir)>-1&&(delete $g["@type"],T=$g);y&&a.h.has(y)&&a.h.delete(y);((Jr=b.config)==null?0:Jr.Ge)&&Jw(b.config.Ge);if(T||(Kr=a.i)==null||!Kr.Pg(b.input,b.Pa)){fa.F(15);break}return fa.yield(a.i.Xg(b.input,b.Pa),16);case 16:T=fa.i;case 15:return Uw(a,T,b),((Lr=b.config)==null?0:Lr.Be)&&Jw(b.config.Be),d(),fa.return(T||
void 0)}})}
function Rw(a,b){a:{a=a.D;var c,d=(c=Ys(b,ul))==null?void 0:c.signal;if(d&&a.Pb&&(c=a.Pb[d])){var e=c();break a}var f;if((c=(f=Ys(b,sl))==null?void 0:f.request)&&a.Pd&&(f=a.Pd[c])){e=f();break a}for(e in b)if(a.Uc[e]&&(b=a.Uc[e])){e=b();break a}e=void 0}if(e!==void 0)return Promise.resolve(e)}
function Sw(a,b){var c,d,e,f,g,h,k;return A(function(l){if(l.h==1){e=(c=a)==null?void 0:(d=c.Ub)==null?void 0:d.sessionIndex;h=((g=Ys((f=a)==null?void 0:f.command,ul))==null?void 0:g.signal)==="GET_ACCOUNT_MENU"?!0:!1;var m=l.yield;var n=Vm(0,{sessionIndex:e,dd:h});if(!(n instanceof gi)){var r=new gi(Uh);hi(r,2,n);n=r}return m.call(l,n,2)}k=l.i;return l.return(Promise.resolve(Object.assign({},Mv(b),k)))})}
;var Vw=new us("INNERTUBE_TRANSPORT_TOKEN");function Ww(){}
x(Ww,Uv);Ww.prototype.j=function(){return Ou};
Ww.prototype.i=function(a){return Ys(a,Fl)||void 0};
Ww.prototype.h=function(a,b,c){c=c===void 0?{}:c;b.channelIds&&(a.channelIds=b.channelIds);b.siloName&&(a.siloName=b.siloName);b.params&&(a.params=b.params);c.botguardResponse&&(a.botguardResponse=c.botguardResponse);c.feature&&(a.clientFeature=c.feature)};
da.Object.defineProperties(Ww.prototype,{o:{configurable:!0,enumerable:!0,get:function(){return!0}}});function Xw(){}
x(Xw,Uv);Xw.prototype.j=function(){return Pu};
Xw.prototype.i=function(a){return Ys(a,El)||void 0};
Xw.prototype.h=function(a,b){b.channelIds&&(a.channelIds=b.channelIds);b.siloName&&(a.siloName=b.siloName);b.params&&(a.params=b.params)};
da.Object.defineProperties(Xw.prototype,{o:{configurable:!0,enumerable:!0,get:function(){return!0}}});var Yw=new us("SHARE_CLIENT_PARAMS_PROVIDER_TOKEN");function Zw(a){this.u=a}
x(Zw,Uv);Zw.prototype.j=function(){return Ju};
Zw.prototype.i=function(a){return Ys(a,zl)||Ys(a,Al)||Ys(a,yl)};
Zw.prototype.h=function(a,b){b.serializedShareEntity&&(a.serializedSharedEntity=b.serializedShareEntity);if(b.clientParamIdentifier){var c;if((c=this.u)==null?0:c.h(b.clientParamIdentifier))a.clientParams=this.u.i(b.clientParamIdentifier)}};
Zw[ts]=[Yw];function $w(){}
x($w,Uv);$w.prototype.j=function(){return Lu};
$w.prototype.i=function(a){return Ys(a,wl)||void 0};
$w.prototype.h=function(a,b,c){a.feedbackTokens=[];b.feedbackToken&&a.feedbackTokens.push(b.feedbackToken);if(b=b.cpn||c.cpn)a.feedbackContext={cpn:b};a.isFeedbackTokenUnencrypted=!!c.is_feedback_token_unencrypted;a.shouldMerge=!1;c.extra_feedback_tokens&&(a.shouldMerge=!0,a.feedbackTokens=a.feedbackTokens.concat(c.extra_feedback_tokens))};
da.Object.defineProperties($w.prototype,{o:{configurable:!0,enumerable:!0,get:function(){return!0}}});function ax(){}
x(ax,Uv);ax.prototype.j=function(){return Mu};
ax.prototype.i=function(a){return Ys(a,Dl)||void 0};
ax.prototype.h=function(a,b){b.params&&(a.params=b.params);b.secondaryParams&&(a.secondaryParams=b.secondaryParams)};function bx(){}
x(bx,Uv);bx.prototype.j=function(){return Nu};
bx.prototype.i=function(a){return Ys(a,Cl)||void 0};
bx.prototype.h=function(a,b){b.actions&&(a.actions=b.actions);b.params&&(a.params=b.params);b.playlistId&&(a.playlistId=b.playlistId)};function cx(){}
x(cx,Uv);cx.prototype.j=function(){return Ku};
cx.prototype.i=function(a){return Ys(a,Bl)};
cx.prototype.h=function(a,b,c){c=c===void 0?{}:c;b.serializedShareEntity&&(a.serializedSharedEntity=b.serializedShareEntity);c.includeListId&&(a.includeListId=!0)};function dx(a,b){var c=B.apply(2,arguments);a=a===void 0?0:a;V.call(this,b,c);this.errorType=a;Object.setPrototypeOf(this,this.constructor.prototype)}
x(dx,V);var ex=new us("NETWORK_SLI_TOKEN");function fx(a){this.h=a}
fx.prototype.fetch=function(a,b,c){var d=this,e;return A(function(f){e=gx(d,a,b);return f.return(fetch(e).then(function(g){return d.handleResponse(g,c)}).catch(function(g){St(g);
if((c==null?0:c.Vd)&&g instanceof dx&&g.errorType===1)return Promise.reject(g)}))})};
function gx(a,b,c){if(a.h){var d=$b(ac(5,lc(b,"key")))||"/UNKNOWN_PATH";a.h.start(d)}a=c;U("wug_networking_gzip_request")&&(a=Iq(c));return new window.Request(b,a)}
fx.prototype.handleResponse=function(a,b){var c=a.text().then(function(d){if((b==null?0:b.oe)&&a.ok)return Kf(b.oe,d);d=d.replace(")]}'","");if((b==null?0:b.Vd)&&d)try{var e=JSON.parse(d)}catch(g){throw new dx(1,"JSON parsing failed after fetch");}var f;return(f=e)!=null?f:JSON.parse(d)});
a.redirected||a.ok?this.h&&this.h.success():(this.h&&this.h.Tg(),c=c.then(function(d){St(new V("Error: API fetch failed",a.status,a.url,d));return Object.assign({},d,{errorMetadata:{status:a.status}})}));
return c};
fx[ts]=[new vs(ex)];var hx=new us("NETWORK_MANAGER_TOKEN");var ix;function jx(){var a,b,c;return A(function(d){if(d.h==1)return a=Bs().resolve(Vw),a?d.yield(Qw(a),2):(St(Error("InnertubeTransportService unavailable in fetchDatasyncIds")),d.return(void 0));if(b=d.i){if(b.errorMetadata)return St(Error("Datasync IDs fetch responded with "+b.errorMetadata.status+": "+b.error)),d.return(void 0);c=b.Rg;return d.return(c)}St(Error("Network request to get Datasync IDs failed."));return d.return(void 0)})}
;function kx(){var a;return(a=R("WEB_PLAYER_CONTEXT_CONFIGS"))==null?void 0:a.WEB_PLAYER_CONTEXT_CONFIG_ID_EMBEDDED_PLAYER}
;var lx=C.caches,mx;function nx(a){var b=a.indexOf(":");return b===-1?{md:a}:{md:a.substring(0,b),datasyncId:a.substring(b+1)}}
function ox(){return A(function(a){if(mx!==void 0)return a.return(mx);mx=new Promise(function(b){var c;return A(function(d){switch(d.h){case 1:return ya(d,2),d.yield(lx.open("test-only"),4);case 4:return d.yield(lx.delete("test-only"),5);case 5:d.h=3;d.o=0;break;case 2:if(c=za(d),c instanceof Error&&c.name==="SecurityError")return b(!1),d.return();case 3:b("caches"in window),d.h=0}})});
return a.return(mx)})}
function px(a){var b,c,d,e,f,g,h;A(function(k){if(k.h==1)return k.yield(ox(),2);if(k.h!=3){if(!k.i)return k.return(!1);b=[];return k.yield(lx.keys(),3)}c=k.i;d=v(c);for(e=d.next();!e.done;e=d.next())f=e.value,g=nx(f),h=g.datasyncId,!h||a.includes(h)||b.push(lx.delete(f));return k.return(Promise.all(b).then(function(l){return l.some(function(m){return m})}))})}
function qx(){var a,b,c,d,e,f,g;return A(function(h){if(h.h==1)return h.yield(ox(),2);if(h.h!=3){if(!h.i)return h.return(!1);a=pn("cache contains other");return h.yield(lx.keys(),3)}b=h.i;c=v(b);for(d=c.next();!d.done;d=c.next())if(e=d.value,f=nx(e),(g=f.datasyncId)&&g!==a)return h.return(!0);return h.return(!1)})}
;function rx(){try{return!!self.sessionStorage}catch(a){return!1}}
;function sx(a){a=a.match(/(.*)::.*::.*/);if(a!==null)return a[1]}
function tx(a){if(rx()){var b=Object.keys(window.sessionStorage);b=v(b);for(var c=b.next();!c.done;c=b.next()){c=c.value;var d=sx(c);d===void 0||a.includes(d)||self.sessionStorage.removeItem(c)}}}
function ux(){if(!rx())return!1;var a=pn(),b=Object.keys(window.sessionStorage);b=v(b);for(var c=b.next();!c.done;c=b.next())if(c=sx(c.value),c!==void 0&&c!==a)return!0;return!1}
;function vx(){jx().then(function(a){a&&(vp(a),px(a),xv(a),tx(a))})}
function wx(){var a=new Ar;yj.qa(function(){var b,c,d,e,f;return A(function(g){switch(g.h){case 1:if(U("ytidb_clear_optimizations_killswitch")){g.F(2);break}b=pn("clear");if(b.startsWith("V")&&b.endsWith("||")){var h=[b];vp(h);px(h);xv(h);tx(h);return g.return()}c=yv();d=ux();return g.yield(qx(),3);case 3:return e=g.i,g.yield(wp(),4);case 4:if(f=g.i,!(c||d||e||f))return g.return();case 2:a.wa()?vx():a.h.add("publicytnetworkstatus-online",vx,!0,void 0,void 0),g.h=0}})})}
;function xx(){this.state=1;this.h=null}
p=xx.prototype;p.initialize=function(a,b,c){if(a.program){var d,e=(d=a.interpreterUrl)!=null?d:null;if(a.interpreterSafeScript){var f=a.interpreterSafeScript;f?((f=f.privateDoNotAccessOrElseSafeScriptWrappedValue)?(d=eb(),f=new Hb(d?d.createScript(f):f)):f=null,d=f):d=null}else d=(f=a.interpreterScript)!=null?f:null;a.interpreterSafeUrl&&(e=ml(a.interpreterSafeUrl).toString());yx(this,d,e,a.program,b,c)}else St(Error("Cannot initialize botguard without program"))};
function yx(a,b,c,d,e,f){var g=g===void 0?"trayride":g;c?(a.state=2,Su(c,function(){window[g]?zx(a,d,g,e):(a.state=3,Uu(c),St(new V("Unable to load Botguard","from "+c)))},f)):b?(f=Bg("SCRIPT"),b instanceof Hb?Jb(f,b):f.textContent=b,f.nonce=Gb(window),document.head.appendChild(f),document.head.removeChild(f),window[g]?zx(a,d,g,e):(a.state=4,St(new V("Unable to load Botguard from JS")))):St(new V("Unable to load VM; no url or JS provided"))}
p.isLoading=function(){return this.state===2};
function zx(a,b,c,d){a.state=5;try{var e=new kj({program:b,be:c,De:U("att_web_record_metrics"),ue:{Aa:"aGIf"}});e.We.then(function(){a.state=6;d&&d(b)});
a.Kc(e)}catch(f){a.state=7,f instanceof Error&&St(f)}}
p.invoke=function(a){a=a===void 0?{}:a;return this.Nc()?this.Cd({Vc:a}):null};
p.dispose=function(){this.Kc(null);this.state=8};
p.Nc=function(){return!!this.h};
p.Cd=function(a){return this.h.vd(a)};
p.Kc=function(a){gg(this.h);this.h=a};var Ax=[],Bx=!1;function Cx(){if(!U("disable_biscotti_fetch_for_ad_blocker_detection")&&!U("disable_biscotti_fetch_entirely_for_all_web_clients")&&uu()){var a=R("PLAYER_VARS",{});if(sg(a)!="1"&&!vu(a)){var b=function(){Bx=!0;"google_ad_status"in window?Ol("DCLKSTAT",1):Ol("DCLKSTAT",2)};
try{Su("//static.doubleclick.net/instream/ad_status.js",b)}catch(c){}Ax.push(yj.qa(function(){if(!(Bx||"google_ad_status"in window)){try{Wu("//static.doubleclick.net/instream/ad_status.js",b)}catch(c){}Bx=!0;Ol("DCLKSTAT",3)}},5E3))}}}
function Dx(){var a=Number(R("DCLKSTAT",0));return isNaN(a)?0:a}
;function Ex(){var a=E("yt.abuse.playerAttLoader");return a&&["bgvma","bgvmb","bgvmc"].every(function(b){return b in a})?a:null}
;function Fx(){xx.apply(this,arguments)}
x(Fx,xx);Fx.prototype.Kc=function(a){var b;(b=Ex())==null||b.bgvma();a?(b={bgvma:a.dispose.bind(a),bgvmb:a.snapshot.bind(a),bgvmc:a.vd.bind(a)},D("yt.abuse.playerAttLoader",b),D("yt.abuse.playerAttLoaderRun",function(c){return a.snapshot(c)})):(D("yt.abuse.playerAttLoader",null),D("yt.abuse.playerAttLoaderRun",null))};
Fx.prototype.Nc=function(){return!!Ex()};
Fx.prototype.Cd=function(a){return Ex().bgvmc(a)};function Gx(a){Ks.call(this,a===void 0?"document_active":a);var b=this;this.o=10;this.h=new Map;this.transitions=[{from:"document_active",to:"document_disposed_preventable",action:this.G},{from:"document_active",to:"document_disposed",action:this.D},{from:"document_disposed_preventable",to:"document_disposed",action:this.D},{from:"document_disposed_preventable",to:"flush_logs",action:this.u},{from:"document_disposed_preventable",to:"document_active",action:this.i},{from:"document_disposed",to:"flush_logs",
action:this.u},{from:"document_disposed",to:"document_active",action:this.i},{from:"document_disposed",to:"document_disposed",action:function(){}},
{from:"flush_logs",to:"document_active",action:this.i}];window.addEventListener("pagehide",function(c){b.transition("document_disposed",{event:c})});
window.addEventListener("beforeunload",function(c){b.transition("document_disposed_preventable",{event:c})})}
x(Gx,Ks);Gx.prototype.G=function(a,b){if(!this.h.get("document_disposed_preventable")){a(b==null?void 0:b.event);var c,d;if((b==null?0:(c=b.event)==null?0:c.defaultPrevented)||(b==null?0:(d=b.event)==null?0:d.returnValue)){b.event.returnValue||(b.event.returnValue=!0);b.event.defaultPrevented||b.event.preventDefault();this.h=new Map;this.transition("document_active");return}}this.h.set("document_disposed_preventable",!0);this.h.get("document_disposed")?this.transition("flush_logs"):this.transition("document_disposed")};
Gx.prototype.D=function(a,b){this.h.get("document_disposed")?this.transition("document_active"):(a(b==null?void 0:b.event),this.h.set("document_disposed",!0),this.transition("flush_logs"))};
Gx.prototype.u=function(a,b){a(b==null?void 0:b.event);this.transition("document_active")};
Gx.prototype.i=function(){this.h=new Map};function Hx(a){Ks.call(this,a===void 0?"document_visibility_unknown":a);var b=this;this.transitions=[{from:"document_visibility_unknown",to:"document_visible",action:this.i},{from:"document_visibility_unknown",to:"document_hidden",action:this.h},{from:"document_visibility_unknown",to:"document_foregrounded",action:this.u},{from:"document_visibility_unknown",to:"document_backgrounded",action:this.D},{from:"document_visible",to:"document_hidden",action:this.h},{from:"document_visible",to:"document_foregrounded",
action:this.u},{from:"document_visible",to:"document_visible",action:this.i},{from:"document_foregrounded",to:"document_visible",action:this.i},{from:"document_foregrounded",to:"document_hidden",action:this.h},{from:"document_foregrounded",to:"document_foregrounded",action:this.u},{from:"document_hidden",to:"document_visible",action:this.i},{from:"document_hidden",to:"document_backgrounded",action:this.D},{from:"document_hidden",to:"document_hidden",action:this.h},{from:"document_backgrounded",to:"document_hidden",
action:this.h},{from:"document_backgrounded",to:"document_backgrounded",action:this.D},{from:"document_backgrounded",to:"document_visible",action:this.i}];document.addEventListener("visibilitychange",function(c){document.visibilityState==="visible"?b.transition("document_visible",{event:c}):b.transition("document_hidden",{event:c})});
U("visibility_lifecycles_dynamic_backgrounding")&&(window.addEventListener("blur",function(c){b.transition("document_backgrounded",{event:c})}),window.addEventListener("focus",function(c){b.transition("document_foregrounded",{event:c})}))}
x(Hx,Ks);Hx.prototype.i=function(a,b){a(b==null?void 0:b.event);U("visibility_lifecycles_dynamic_backgrounding")&&this.transition("document_foregrounded")};
Hx.prototype.h=function(a,b){a(b==null?void 0:b.event);U("visibility_lifecycles_dynamic_backgrounding")&&this.transition("document_backgrounded")};
Hx.prototype.D=function(a,b){a(b==null?void 0:b.event)};
Hx.prototype.u=function(a,b){a(b==null?void 0:b.event)};function Ix(){this.o=new Gx;this.D=new Hx}
Ix.prototype.install=function(){var a=B.apply(0,arguments),b=this;a.forEach(function(c){b.o.install(c)});
a.forEach(function(c){b.D.install(c)})};function Jx(){this.o=[];this.i=new Map;this.h=new Map;this.j=new Set}
Jx.prototype.clickCommand=function(a,b,c){var d=a.clickTrackingParams;c=c===void 0?0:c;if(d)if(c=ju(c===void 0?0:c)){a=this.client;d=new cu({trackingParams:d});var e=void 0;if(U("no_client_ve_attach_unless_shown")){var f=sv(d,c);ov.set(f,!0);tv(d,c)}e=e||"INTERACTION_LOGGING_GESTURE_TYPE_GENERIC_CLICK";f=rv({cttAuthInfo:lu(c)||void 0},c);d={csn:c,ve:d.getAsJson(),gestureType:e};b&&(d.clientData=b);c==="UNDEFINED_CSN"?uv("visualElementGestured",f,d):a?Jt("visualElementGestured",d,a,f):go("visualElementGestured",
d,f);b=!0}else b=!1;else b=!1;return b};
Jx.prototype.stateChanged=function(a,b,c){this.visualElementStateChanged(new cu({trackingParams:a}),b,c===void 0?0:c)};
Jx.prototype.visualElementStateChanged=function(a,b,c){c=c===void 0?0:c;if(c===0&&this.j.has(c))this.o.push([a,b]);else{var d=c;d=d===void 0?0:d;c=ju(d);a||(a=(a=gu(d===void 0?0:d))?new cu({veType:a,youtubeData:void 0,jspbYoutubeData:void 0}):null);var e=a;c&&e&&(a=this.client,d=rv({cttAuthInfo:lu(c)||void 0},c),b={csn:c,ve:e.getAsJson(),clientData:b},c==="UNDEFINED_CSN"?uv("visualElementStateChanged",d,b):a?Jt("visualElementStateChanged",b,a,d):go("visualElementStateChanged",b,d))}};
function Kx(a,b){if(b===void 0)for(var c=iu(),d=0;d<c.length;d++)c[d]!==void 0&&Kx(a,c[d]);else a.i.forEach(function(e,f){(f=a.h.get(f))&&qv(a.client,b,f,e)}),a.i.clear(),a.h.clear()}
;function Lx(){Ix.call(this);var a={};this.install((a.document_disposed={callback:this.h},a));U("combine_ve_grafts")&&(a={},this.install((a.document_disposed={callback:this.i},a)));a={};this.install((a.flush_logs={callback:this.j},a));U("web_log_cfg_cee_ks")||rn(Mx)}
x(Lx,Ix);Lx.prototype.j=function(){go("finalPayload",{csn:ju()})};
Lx.prototype.h=function(){Xt(Yt)};
Lx.prototype.i=function(){var a=Kx;Jx.h||(Jx.h=new Jx);a(Jx.h)};
function Mx(){var a=R("CLIENT_EXPERIMENT_EVENTS");if(a){var b=Vd();a=v(a);for(var c=a.next();!c.done;c=a.next())c=c.value,b(c)&&go("genericClientExperimentEvent",{eventType:c});delete Nl.CLIENT_EXPERIMENT_EVENTS}}
;function Nx(){}
function Ox(){var a=E("ytglobal.storage_");a||(a=new Nx,D("ytglobal.storage_",a));return a}
Nx.prototype.estimate=function(){var a,b,c;return A(function(d){a=navigator;return((b=a.storage)==null?0:b.estimate)?d.return(a.storage.estimate()):((c=a.webkitTemporaryStorage)==null?0:c.queryUsageAndQuota)?d.return(Px()):d.return()})};
function Px(){var a=navigator;return new Promise(function(b,c){var d;(d=a.webkitTemporaryStorage)!=null&&d.queryUsageAndQuota?a.webkitTemporaryStorage.queryUsageAndQuota(function(e,f){b({usage:e,quota:f})},function(e){c(e)}):c(Error("webkitTemporaryStorage is not supported."))})}
D("ytglobal.storageClass_",Nx);function eo(a,b){var c=this;this.handleError=a;this.h=b;this.i=!1;self.document===void 0||self.addEventListener("beforeunload",function(){c.i=!0});
this.j=Math.random()<=.2}
eo.prototype.Ha=function(a){this.handleError(a)};
eo.prototype.logEvent=function(a,b){switch(a){case "IDB_DATA_CORRUPTED":U("idb_data_corrupted_killswitch")||this.h("idbDataCorrupted",b);break;case "IDB_UNEXPECTEDLY_CLOSED":this.h("idbUnexpectedlyClosed",b);break;case "IS_SUPPORTED_COMPLETED":U("idb_is_supported_completed_killswitch")||this.h("idbIsSupportedCompleted",b);break;case "QUOTA_EXCEEDED":Qx(this,b);break;case "TRANSACTION_ENDED":this.j&&Math.random()<=.1&&this.h("idbTransactionEnded",b);break;case "TRANSACTION_UNEXPECTEDLY_ABORTED":a=
Object.assign({},b,{hasWindowUnloaded:this.i}),this.h("idbTransactionAborted",a)}};
function Qx(a,b){Ox().estimate().then(function(c){c=Object.assign({},b,{isSw:self.document===void 0,isIframe:self!==self.top,deviceStorageUsageMbytes:Rx(c==null?void 0:c.usage),deviceStorageQuotaMbytes:Rx(c==null?void 0:c.quota)});a.h("idbQuotaExceeded",c)})}
function Rx(a){return typeof a==="undefined"?"-1":String(Math.ceil(a/1048576))}
;var Sx={},Tx=(Sx["api.invalidparam"]=2,Sx.auth=150,Sx["drm.auth"]=150,Sx["heartbeat.net"]=150,Sx["heartbeat.servererror"]=150,Sx["heartbeat.stop"]=150,Sx["html5.unsupportedads"]=5,Sx["fmt.noneavailable"]=5,Sx["fmt.decode"]=5,Sx["fmt.unplayable"]=5,Sx["html5.missingapi"]=5,Sx["html5.unsupportedlive"]=5,Sx["drm.unavailable"]=5,Sx["mrm.blocked"]=151,Sx["embedder.identity.denied"]=152,Sx);var Ux=new Set("endSeconds startSeconds mediaContentUrl suggestedQuality videoId rct rctn".split(" "));function Vx(a){return(a.search("cue")===0||a.search("load")===0)&&a!=="loadModule"}
function Wx(a,b,c){if(typeof a==="string")return{videoId:a,startSeconds:b,suggestedQuality:c};b={};c=v(Ux);for(var d=c.next();!d.done;d=c.next())d=d.value,a[d]&&(b[d]=a[d]);return b}
function Xx(a,b,c,d){if(Qa(a)&&!Array.isArray(a)){b="playlist list listType index startSeconds suggestedQuality".split(" ");c={};for(d=0;d<b.length;d++){var e=b[d];a[e]&&(c[e]=a[e])}return c}b={index:b,startSeconds:c,suggestedQuality:d};typeof a==="string"&&a.length===16?b.list="PL"+a:b.playlist=a;return b}
;function Yx(a){L.call(this);var b=this;this.api=a;this.W=this.u=!1;this.A=[];this.I={};this.j=[];this.i=[];this.X=!1;this.sessionId=this.h=null;this.targetOrigin="*";this.T=U("web_player_split_event_bus_iframe");this.o=R("POST_MESSAGE_ORIGIN")||document.location.protocol+"//"+document.location.hostname;this.G=function(c){a:if(!(b.o!=="*"&&c.origin!==b.o||b.h&&c.source!==b.h||typeof c.data!=="string")){try{var d=JSON.parse(c.data)}catch(h){break a}if(d)switch(d.event){case "listening":var e=c.source;
c=c.origin;d=d.id;c!=="null"&&(b.o=b.targetOrigin=c);b.h=e;b.sessionId=d;if(b.u){b.W=!0;b.u=!1;b.sendMessage("initialDelivery",Zx(b));b.sendMessage("onReady");e=v(b.A);for(d=e.next();!d.done;d=e.next())$x(b,d.value);b.A=[]}break;case "command":if(e=d.func,d=d.args,e==="addEventListener"&&d)e=d[0],d=c.origin,e==="onReady"?b.api.logApiCall(e+" invocation",d):e==="onError"&&b.X&&(b.api.logApiCall(e+" invocation",d,b.errorCode),b.errorCode=void 0),b.api.logApiCall(e+" registration",d),b.I[e]||e==="onReady"||
(c=ay(b,e,d),b.i.push({eventType:e,listener:c,origin:d}),b.T?b.api.handleExternalCall("addEventListener",[e,c],d):b.api.addEventListener(e,c),b.I[e]=!0);else if(c=c.origin,b.api.isExternalMethodAvailable(e,c)){d=d||[];if(d.length>0&&Vx(e)){var f=d;if(Qa(f[0])&&!Array.isArray(f[0]))var g=f[0];else switch(g={},e){case "loadVideoById":case "cueVideoById":g=Wx(f[0],f[1]!==void 0?Number(f[1]):void 0,f[2]);break;case "loadVideoByUrl":case "cueVideoByUrl":g=f[0];typeof g==="string"&&(g={mediaContentUrl:g,
startSeconds:f[1]!==void 0?Number(f[1]):void 0,suggestedQuality:f[2]});c:{if((f=g.mediaContentUrl)&&(f=/\/([ve]|embed)\/([^#?]+)/.exec(f))&&f[2]){f=f[2];break c}f=null}g.videoId=f;g=Wx(g);break;case "loadPlaylist":case "cuePlaylist":g=Xx(f[0],f[1],f[2],f[3])}d.length=1;d[0]=g}b.api.handleExternalCall(e,d,c);Vx(e)&&by(b,Zx(b))}}}};
cy.addEventListener("message",this.G);if(a=R("WIDGET_ID"))this.sessionId=a;dy(this,"onReady",function(){b.u=!0;var c=b.api.getVideoData();if(!c.isPlayable){b.X=!0;c=c.errorCode;var d=d===void 0?5:d;b.errorCode=c?Tx[c]||d:d;b.sendMessage("onError",Number(b.errorCode))}});
dy(this,"onVideoProgress",this.Re.bind(this));dy(this,"onVolumeChange",this.Se.bind(this));dy(this,"onApiChange",this.Ke.bind(this));dy(this,"onPlaybackQualityChange",this.Oe.bind(this));dy(this,"onPlaybackRateChange",this.Pe.bind(this));dy(this,"onStateChange",this.Qe.bind(this));dy(this,"onWebglSettingsChanged",this.Te.bind(this));dy(this,"onCaptionsTrackListChanged",this.Le.bind(this));dy(this,"captionssettingschanged",this.Me.bind(this))}
x(Yx,L);function by(a,b){a.sendMessage("infoDelivery",b)}
p=Yx.prototype;p.sendMessage=function(a,b){a={event:a,info:b===void 0?null:b};this.W?$x(this,a):this.A.push(a)};
function ay(a,b,c){return function(d){b==="onError"?a.api.logApiCall(b+" invocation",c,d):a.api.logApiCall(b+" invocation",c);a.sendMessage(b,d)}}
function dy(a,b,c){a.j.push({eventType:b,listener:c});a.api.addEventListener(b,c)}
function Zx(a){if(!a.api)return null;var b=a.api.getApiInterface();Rb(b,"getVideoData");for(var c={apiInterface:b},d=0,e=b.length;d<e;d++){var f=b[d];if(f.search("get")===0||f.search("is")===0){var g=0;f.search("get")===0?g=3:f.search("is")===0&&(g=2);g=f.charAt(g).toLowerCase()+f.substr(g+1);try{var h=a.api[f]();c[g]=h}catch(k){}}}c.videoData=a.api.getVideoData();c.currentTimeLastUpdated_=Date.now()/1E3;return c}
p.Qe=function(a){a={playerState:a,currentTime:this.api.getCurrentTime(),duration:this.api.getDuration(),videoData:this.api.getVideoData(),videoStartBytes:0,videoBytesTotal:this.api.getVideoBytesTotal(),videoLoadedFraction:this.api.getVideoLoadedFraction(),playbackQuality:this.api.getPlaybackQuality(),availableQualityLevels:this.api.getAvailableQualityLevels(),currentTimeLastUpdated_:Date.now()/1E3,playbackRate:this.api.getPlaybackRate(),mediaReferenceTime:this.api.getMediaReferenceTime()};this.api.getVideoUrl&&
(a.videoUrl=this.api.getVideoUrl());this.api.getVideoContentRect&&(a.videoContentRect=this.api.getVideoContentRect());this.api.getProgressState&&(a.progressState=this.api.getProgressState());this.api.getPlaylist&&(a.playlist=this.api.getPlaylist());this.api.getPlaylistIndex&&(a.playlistIndex=this.api.getPlaylistIndex());this.api.getStoryboardFormat&&(a.storyboardFormat=this.api.getStoryboardFormat());by(this,a)};
p.Oe=function(a){a={playbackQuality:a};this.api.getAvailableQualityLevels&&(a.availableQualityLevels=this.api.getAvailableQualityLevels());this.api.getPreferredQuality&&(a.preferredQuality=this.api.getPreferredQuality());by(this,a)};
p.Pe=function(a){by(this,{playbackRate:a})};
p.Ke=function(){for(var a=this.api.getOptions(),b={namespaces:a},c=0,d=a.length;c<d;c++){var e=a[c],f=this.api.getOptions(e);a.join(", ");b[e]={options:f};for(var g=0,h=f.length;g<h;g++){var k=f[g],l=this.api.getOption(e,k);b[e][k]=l}}this.sendMessage("apiInfoDelivery",b)};
p.Se=function(){by(this,{muted:this.api.isMuted(),volume:this.api.getVolume()})};
p.Re=function(a){a={currentTime:a,videoBytesLoaded:this.api.getVideoBytesLoaded(),videoLoadedFraction:this.api.getVideoLoadedFraction(),currentTimeLastUpdated_:Date.now()/1E3,playbackRate:this.api.getPlaybackRate(),mediaReferenceTime:this.api.getMediaReferenceTime()};this.api.getProgressState&&(a.progressState=this.api.getProgressState());by(this,a)};
p.Te=function(){by(this,{sphericalProperties:this.api.getSphericalProperties()})};
p.Le=function(){if(this.api.getCaptionTracks){var a={captionTracks:this.api.getCaptionTracks()};by(this,a)}};
p.Me=function(){if(this.api.getSubtitlesUserSettings){var a={subtitlesUserSettings:this.api.getSubtitlesUserSettings()};by(this,a)}};
function $x(a,b){if(a.h){b.channel="widget";a.sessionId&&(b.id=a.sessionId);try{var c=JSON.stringify(b);a.h.postMessage(c,a.targetOrigin)}catch(d){St(d)}}}
p.ba=function(){L.prototype.ba.call(this);cy.removeEventListener("message",this.G);for(var a=0;a<this.j.length;a++){var b=this.j[a];this.api.removeEventListener(b.eventType,b.listener)}this.j=[];for(a=0;a<this.i.length;a++)b=this.i[a],this.T?this.api.handleExternalCall("removeEventListener",[b.eventType,b.listener],b.origin):this.api.removeEventListener(b.eventType,b.listener);this.i=[]};
var cy=window;function ey(a,b,c){L.call(this);var d=this;this.api=a;this.id=b;this.origin=c;this.h={};this.j=U("web_player_split_event_bus_iframe");this.i=function(e){a:if(e.origin===d.origin){var f=e.data;if(typeof f==="string"){try{f=JSON.parse(f)}catch(k){break a}if(f.command){var g=f.command;f=f.data;e=e.origin;if(!d.ea){var h=f||{};switch(g){case "addEventListener":typeof h.event==="string"&&d.addListener(h.event,e);break;case "removeEventListener":typeof h.event==="string"&&d.removeListener(h.event,e);break;
default:d.api.isReady()&&d.api.isExternalMethodAvailable(g,e||null)&&(f=fy(g,f||{}),f=d.api.handleExternalCall(g,f,e||null),(f=gy(g,f))&&hy(d,g,f))}}}}}};
iy.addEventListener("message",this.i);hy(this,"RECEIVING")}
x(ey,L);p=ey.prototype;p.addListener=function(a,b){if(!(a in this.h)){var c=this.Ne.bind(this,a);this.h[a]=c;this.addEventListener(a,c,b)}};
p.Ne=function(a,b){this.ea||hy(this,a,jy(a,b))};
p.removeListener=function(a,b){a in this.h&&(this.removeEventListener(a,this.h[a],b),delete this.h[a])};
p.addEventListener=function(a,b,c){this.j?a==="onReady"?this.api.addEventListener(a,b):this.api.handleExternalCall("addEventListener",[a,b],c||null):this.api.addEventListener(a,b)};
p.removeEventListener=function(a,b,c){this.j?a==="onReady"?this.api.removeEventListener(a,b):this.api.handleExternalCall("removeEventListener",[a,b],c||null):this.api.removeEventListener(a,b)};
function fy(a,b){switch(a){case "loadVideoById":return[Wx(b)];case "cueVideoById":return[Wx(b)];case "loadVideoByPlayerVars":return[b];case "cueVideoByPlayerVars":return[b];case "loadPlaylist":return[Xx(b)];case "cuePlaylist":return[Xx(b)];case "seekTo":return[b.seconds,b.allowSeekAhead];case "playVideoAt":return[b.index];case "setVolume":return[b.volume];case "setPlaybackQuality":return[b.suggestedQuality];case "setPlaybackRate":return[b.suggestedRate];case "setLoop":return[b.loopPlaylists];case "setShuffle":return[b.shufflePlaylist];
case "getOptions":return[b.module];case "getOption":return[b.module,b.option];case "setOption":return[b.module,b.option,b.value];case "handleGlobalKeyDown":return[b.keyCode,b.shiftKey,b.ctrlKey,b.altKey,b.metaKey,b.key,b.code]}return[]}
function gy(a,b){switch(a){case "isMuted":return{muted:b};case "getVolume":return{volume:b};case "getPlaybackRate":return{playbackRate:b};case "getAvailablePlaybackRates":return{availablePlaybackRates:b};case "getVideoLoadedFraction":return{videoLoadedFraction:b};case "getPlayerState":return{playerState:b};case "getCurrentTime":return{currentTime:b};case "getPlaybackQuality":return{playbackQuality:b};case "getAvailableQualityLevels":return{availableQualityLevels:b};case "getDuration":return{duration:b};
case "getVideoUrl":return{videoUrl:b};case "getVideoEmbedCode":return{videoEmbedCode:b};case "getPlaylist":return{playlist:b};case "getPlaylistIndex":return{playlistIndex:b};case "getOptions":return{options:b};case "getOption":return{option:b}}}
function jy(a,b){switch(a){case "onReady":return;case "onStateChange":return{playerState:b};case "onPlaybackQualityChange":return{playbackQuality:b};case "onPlaybackRateChange":return{playbackRate:b};case "onError":return{errorCode:b}}if(b!=null)return{value:b}}
function hy(a,b,c){a.ea||(b={id:a.id,command:b},c&&(b.data=c),ky.postMessage(JSON.stringify(b),a.origin))}
p.ba=function(){iy.removeEventListener("message",this.i);for(var a in this.h)this.h.hasOwnProperty(a)&&this.removeListener(a);L.prototype.ba.call(this)};
var iy=window,ky=window.parent;var ly=new Fx;function my(){return ly.Nc()}
function ny(a){a=a===void 0?{}:a;return ly.invoke(a)}
;function oy(a,b,c,d,e){L.call(this);var f=this;this.A=b;this.webPlayerContextConfig=d;this.qc=e;this.Ka=!1;this.api={};this.ia=this.u=null;this.T=new M;this.h={};this.X=this.pa=this.elementId=this.Ya=this.config=null;this.W=!1;this.j=this.G=null;this.ya={};this.sc=["onReady"];this.lastError=null;this.Sb=NaN;this.I={};this.ga=0;this.i=this.o=a;ig(this,this.T);py(this);c?this.ga=setTimeout(function(){f.loadNewVideoConfig(c)},0):d&&(qy(this),ry(this))}
x(oy,L);p=oy.prototype;p.getId=function(){return this.A};
p.loadNewVideoConfig=function(a){if(!this.ea){this.ga&&(clearTimeout(this.ga),this.ga=0);var b=a||{};b instanceof Iu||(b=new Iu(b));this.config=b;this.setConfig(a);ry(this);this.isReady()&&sy(this)}};
function qy(a){var b;a.webPlayerContextConfig?b=a.webPlayerContextConfig.rootElementId:b=a.config.attrs.id;a.elementId=b||a.elementId;a.elementId==="video-player"&&(a.elementId=a.A,a.webPlayerContextConfig?a.webPlayerContextConfig.rootElementId=a.A:a.config.attrs.id=a.A);var c;((c=a.i)==null?void 0:c.id)===a.elementId&&(a.elementId+="-player",a.webPlayerContextConfig?a.webPlayerContextConfig.rootElementId=a.elementId:a.config.attrs.id=a.elementId)}
p.setConfig=function(a){this.Ya=a;this.config=ty(a);qy(this);if(!this.pa){var b;this.pa=uy(this,((b=this.config.args)==null?void 0:b.jsapicallback)||"onYouTubePlayerReady")}this.config.args?this.config.args.jsapicallback=null:this.config.args={jsapicallback:null};var c;if((c=this.config)==null?0:c.attrs)a=this.config.attrs,(b=a.width)&&this.i&&(this.i.style.width=sj(Number(b)||b)),(a=a.height)&&this.i&&(this.i.style.height=sj(Number(a)||a))};
function sy(a){if(a.config&&a.config.loaded!==!0)if(a.config.loaded=!0,!a.config.args||a.config.args.autoplay!=="0"&&a.config.args.autoplay!==0&&a.config.args.autoplay!==!1){var b;a.api.loadVideoByPlayerVars((b=a.config.args)!=null?b:null)}else a.api.cueVideoByPlayerVars(a.config.args)}
function vy(a){var b=!0,c=wy(a);c&&a.config&&(b=c.dataset.version===xy(a));return b&&!!E("yt.player.Application.create")}
function ry(a){if(!a.ea&&!a.W){var b=vy(a);if(b&&(wy(a)?"html5":null)==="html5")a.X="html5",a.isReady()||yy(a);else if(zy(a),a.X="html5",b&&a.j&&a.o)a.o.appendChild(a.j),yy(a);else{a.config&&(a.config.loaded=!0);var c=!1;a.G=function(){c=!0;var d=Ay(a,"player_bootstrap_method")?E("yt.player.Application.createAlternate")||E("yt.player.Application.create"):E("yt.player.Application.create");var e=a.config?ty(a.config):void 0;d&&d(a.o,e,a.webPlayerContextConfig,a.qc);yy(a)};
a.W=!0;b?a.G():(Su(xy(a),a.G),(b=By(a))&&Zu(b||""),Cy(a)&&!c&&D("yt.player.Application.create",null))}}}
function wy(a){var b=Ag(a.elementId);!b&&a.i&&a.i.querySelector&&(b=a.i.querySelector("#"+a.elementId));return b}
function yy(a){if(!a.ea){var b=wy(a),c=!1;b&&b.getApiInterface&&b.getApiInterface()&&(c=!0);if(c){a.W=!1;if(!Ay(a,"html5_remove_not_servable_check_killswitch")){var d;if((b==null?0:b.isNotServable)&&a.config&&(b==null?0:b.isNotServable((d=a.config.args)==null?void 0:d.video_id)))return}Dy(a)}else a.Sb=setTimeout(function(){yy(a)},50)}}
function Dy(a){py(a);a.Ka=!0;var b=wy(a);if(b){a.u=Ey(a,b,"addEventListener");a.ia=Ey(a,b,"removeEventListener");var c=b.getApiInterface();c=c.concat(b.getInternalApiInterface());for(var d=a.api,e=0;e<c.length;e++){var f=c[e];d[f]||(d[f]=Ey(a,b,f))}}for(var g in a.h)a.h.hasOwnProperty(g)&&a.u&&a.u(g,a.h[g]);sy(a);a.pa&&a.pa(a.api);a.T.kb("onReady",a.api)}
function Ey(a,b,c){var d=b[c];return function(){var e=B.apply(0,arguments);try{return a.lastError=null,d.apply(b,e)}catch(f){if(c!=="sendAbandonmentPing")throw f.params=c,a.lastError=f,e=new V("PlayerProxy error in method call",{error:f,method:c,playerId:a.A}),e.level="WARNING",e;}}}
function py(a){a.Ka=!1;if(a.ia)for(var b in a.h)a.h.hasOwnProperty(b)&&a.ia(b,a.h[b]);for(var c in a.I)a.I.hasOwnProperty(c)&&clearTimeout(Number(c));a.I={};a.u=null;a.ia=null;b=a.api;for(var d in b)b.hasOwnProperty(d)&&(b[d]=null);b.addEventListener=function(e,f){a.addEventListener(e,f)};
b.removeEventListener=function(e,f){a.removeEventListener(e,f)};
b.destroy=function(){a.dispose()};
b.getLastError=function(){return a.getLastError()};
b.getPlayerType=function(){return a.getPlayerType()};
b.getCurrentVideoConfig=function(){return a.Ya};
b.loadNewVideoConfig=function(e){a.loadNewVideoConfig(e)};
b.isReady=function(){return a.isReady()}}
p.isReady=function(){return this.Ka};
p.addEventListener=function(a,b){var c=this,d=uy(this,b);d&&(Lb(this.sc,a)>=0||this.h[a]||(b=Fy(this,a),this.u&&this.u(a,b)),this.T.subscribe(a,d),a==="onReady"&&this.isReady()&&setTimeout(function(){d(c.api)},0))};
p.removeEventListener=function(a,b){this.ea||(b=uy(this,b))&&this.T.unsubscribe(a,b)};
function uy(a,b){var c=b;if(typeof b==="string"){if(a.ya[b])return a.ya[b];c=function(){var d=B.apply(0,arguments),e=E(b);if(e)try{e.apply(C,d)}catch(f){throw d=new V("PlayerProxy error when executing callback",{error:f}),d.level="ERROR",d;}};
a.ya[b]=c}return c?c:null}
function Fy(a,b){function c(d){var e=setTimeout(function(){if(!a.ea){try{a.T.kb(b,d!=null?d:void 0)}catch(h){var f=new V("PlayerProxy error when creating global callback",{error:h.message,event:b,playerId:a.A,data:d,originalStack:h.stack,componentStack:h.Od});f.level="WARNING";throw f;}f=a.I;var g=String(e);g in f&&delete f[g]}},0);
rg(a.I,String(e))}
return a.h[b]=c}
p.getPlayerType=function(){return this.X||(wy(this)?"html5":null)};
p.getLastError=function(){return this.lastError};
function zy(a){a.cancel();py(a);a.X=null;a.config&&(a.config.loaded=!1);var b=wy(a);b&&(vy(a)||!Cy(a)?a.j=b:(b&&b.destroy&&b.destroy(),a.j=null));if(a.o)for(a=a.o;b=a.firstChild;)a.removeChild(b)}
p.cancel=function(){this.G&&Wu(xy(this),this.G);clearTimeout(this.Sb);this.W=!1};
p.ba=function(){zy(this);if(this.j&&this.config&&this.j.destroy)try{this.j.destroy()}catch(b){var a=new V("PlayerProxy error during disposal",{error:b});a.level="ERROR";throw a;}this.ya=null;for(a in this.h)this.h.hasOwnProperty(a)&&delete this.h[a];this.Ya=this.config=this.api=null;delete this.o;delete this.i;L.prototype.ba.call(this)};
function Cy(a){var b,c;a=(b=a.config)==null?void 0:(c=b.args)==null?void 0:c.fflags;return!!a&&a.indexOf("player_destroy_old_version=true")!==-1}
function xy(a){return a.webPlayerContextConfig?a.webPlayerContextConfig.jsUrl:(a=a.config.assets)?a.js:""}
function By(a){return a.webPlayerContextConfig?a.webPlayerContextConfig.cssUrl:(a=a.config.assets)?a.css:""}
function Ay(a,b){if(a.webPlayerContextConfig)var c=a.webPlayerContextConfig.serializedExperimentFlags;else{var d;if((d=a.config)==null?0:d.args)c=a.config.args.fflags}return(c||"").split("&").includes(b+"=true")}
function ty(a){for(var b={},c=v(Object.keys(a)),d=c.next();!d.done;d=c.next()){d=d.value;var e=a[d];b[d]=typeof e==="object"?ug(e):e}return b}
;var Gy={},Hy="player_uid_"+(Math.random()*1E9>>>0);function Iy(a,b){var c="player",d=!1;d=d===void 0?!0:d;c=typeof c==="string"?Ag(c):c;var e=Hy+"_"+Ra(c),f=Gy[e];if(f&&d)return Jy(a,b)?f.api.loadVideoByPlayerVars(a.args||null):f.loadNewVideoConfig(a),f.api;f=new oy(c,e,a,b,void 0);Gy[e]=f;f.addOnDisposeCallback(function(){delete Gy[f.getId()]});
return f.api}
function Jy(a,b){return b&&b.serializedExperimentFlags?b.serializedExperimentFlags.includes("web_player_remove_playerproxy=true"):a&&a.args&&a.args.fflags?a.args.fflags.includes("web_player_remove_playerproxy=true"):!1}
;var Ky=null,Ly=null;
function My(){Kw();var a=dn(),b=gn(119),c=window.devicePixelRatio>1;if(document.body&&Gj(document.body,"exp-invert-logo"))if(c&&!Gj(document.body,"inverted-hdpi")){var d=document.body;if(d.classList)d.classList.add("inverted-hdpi");else if(!Gj(d,"inverted-hdpi")){var e=Ej(d);Fj(d,e+(e.length>0?" inverted-hdpi":"inverted-hdpi"))}}else!c&&Gj(document.body,"inverted-hdpi")&&Hj();if(b!=c){b="f"+(Math.floor(119/31)+1);d=hn(b)||0;d=c?d|67108864:d&-67108865;d===0?delete an[b]:(c=d.toString(16),an[b]=c.toString());
c=!0;U("web_secure_pref_cookie_killswitch")&&(c=!1);b=a.h;d=[];for(f in an)an.hasOwnProperty(f)&&d.push(f+"="+encodeURIComponent(String(an[f])));var f=d.join("&");Xm(b,f,63072E3,a.i,c)}}
function Ny(){Oy()}
function Py(){Jw("ep_init_pr");Oy()}
function Oy(){var a=Ky.getVideoData(1);a=a.title?a.title+" - YouTube":"YouTube";document.title!==a&&(document.title=a)}
function Qy(){Ky&&Ky.sendAbandonmentPing&&Ky.sendAbandonmentPing();R("PL_ATT")&&ly.dispose();for(var a=yj,b=0,c=Ax.length;b<c;b++)a.ra(Ax[b]);Ax.length=0;Uu("//static.doubleclick.net/instream/ad_status.js");Bx=!1;Ol("DCLKSTAT",0);hg(Ly);Ky&&(Ky.removeEventListener("onVideoDataChange",Ny),Ky.destroy())}
;D("yt.setConfig",Ol);D("yt.config.set",Ol);D("yt.setMsg",Ru);D("yt.msgs.set",Ru);D("yt.logging.errors.log",Rt);
D("writeEmbed",function(){var a=R("PLAYER_CONFIG");if(!a){var b=R("PLAYER_VARS");b&&(a={args:b})}Cv(!0);a.args.ps==="gvn"&&(document.body.style.backgroundColor="transparent");a.attrs||(a.attrs={width:"100%",height:"100%",id:"video-player"});var c=document.referrer;b=R("POST_MESSAGE_ORIGIN");window!==window.top&&c&&c!==document.URL&&(a.args.loaderUrl=c);Fw("embed",["ol"]);c=kx();if(!c.serializedForcedExperimentIds){var d=bm(window.location.href);d.forced_experiments&&(c.serializedForcedExperimentIds=
d.forced_experiments)}var e;((e=a.args)==null?0:e.autoplay)&&Fw("watch",["pbs","pbu","pbp"]);Ky=Iy(a,c);Ky.addEventListener("onVideoDataChange",Ny);Ky.addEventListener("onReady",Py);a=R("POST_MESSAGE_ID","player");R("ENABLE_JS_API")?Ly=new Yx(Ky):R("ENABLE_POST_API")&&typeof a==="string"&&typeof b==="string"&&(Ly=new ey(Ky,a,b));Cx();U("ytidb_create_logger_embed_killswitch")||co();a={};Lx.h||(Lx.h=new Lx);Lx.h.install((a.flush_logs={callback:function(){vt()}},a));
Qr();U("ytidb_clear_embedded_player")&&yj.qa(function(){var f,g;if(!ix){var h=Bs();xs(h,{lc:hx,zd:fx});var k={Uc:{feedbackEndpoint:Pv($w),modifyChannelNotificationPreferenceEndpoint:Pv(ax),playlistEditEndpoint:Pv(bx),shareEntityEndpoint:Pv(Zw),subscribeEndpoint:Pv(Ww),unsubscribeEndpoint:Pv(Xw),webPlayerShareEntityServiceEndpoint:Pv(cx)}},l=Lv(),m={};l&&(m.client_location=l);f===void 0&&(f=Um());g===void 0&&(g=h.resolve(hx));Pw(k,g,f,m);xs(h,{lc:Vw,Ad:Ow.h});ix=h.resolve(Vw)}wx()})});
D("yt.abuse.player.botguardInitialized",E("yt.abuse.player.botguardInitialized")||my);D("yt.abuse.player.invokeBotguard",E("yt.abuse.player.invokeBotguard")||ny);D("yt.abuse.dclkstatus.checkDclkStatus",E("yt.abuse.dclkstatus.checkDclkStatus")||Dx);D("yt.player.exports.navigate",E("yt.player.exports.navigate")||Bv);D("yt.util.activity.init",E("yt.util.activity.init")||ds);D("yt.util.activity.getTimeSinceActive",E("yt.util.activity.getTimeSinceActive")||hs);
D("yt.util.activity.setTimestamp",E("yt.util.activity.setTimestamp")||es);window.addEventListener("load",Sl(function(){My()}));
window.addEventListener("pageshow",Sl(function(a){a.persisted||My()}));
window.addEventListener("pagehide",Sl(function(a){U("embeds_web_enable_dispose_player_if_page_not_cached_killswitch")?Qy():a.persisted||Qy()}));
window.onerror=function(a,b,c,d,e){var f;b=b===void 0?"Unknown file":b;c=c===void 0?0:c;var g=!1,h=Pl("log_window_onerror_fraction");if(h&&Math.random()<h)g=!0;else{h=document.getElementsByTagName("script");for(var k=0,l=h.length;k<l;k++)if(h[k].src.indexOf("/debug-")>0){g=!0;break}}if(g){g=!1;e?g=!0:(typeof a==="string"?h=a:ErrorEvent&&a instanceof ErrorEvent?(g=!0,h=a.message,b=a.filename,c=a.lineno,d=a.colno):(h="Unknown error",b="Unknown file",c=0),e=new V(h),e.name="UnhandledWindowError",e.message=
h,e.fileName=b,e.lineNumber=c,isNaN(d)?delete e.columnNumber:e.columnNumber=d);if(!U("wiz_enable_component_stack_propagation_killswitch")){a=e;var m;if((m=f)==null||!m.componentStack)if(m=a.Od)f||(f={}),f.componentStack=Kt(m)}f&&Vt(e,f);g?Rt(e):St(e)}};
wi=Tt;window.addEventListener("unhandledrejection",function(a){Tt(a.reason)});
Mb(R("ERRORS")||[],function(a){Rt.apply(null,a)});
Ol("ERRORS",[]);}).call(this);
