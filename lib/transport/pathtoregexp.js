function e(e,t){void 0===t&&(t={});for(var n=function(e){for(var t=[],n=0;n<e.length;){var r=e[n];if("*"!==r&&"+"!==r&&"?"!==r)if("\\"!==r)if("{"!==r)if("}"!==r)if(":"!==r)if("("!==r)t.push({type:"CHAR",index:n,value:e[n++]});else{var i=1,o="";if("?"===e[c=n+1])throw new TypeError('Pattern cannot start with "?" at '.concat(c));for(;c<e.length;)if("\\"!==e[c]){if(")"===e[c]){if(0==--i){c++;break}}else if("("===e[c]&&(i++,"?"!==e[c+1]))throw new TypeError("Capturing groups are not allowed at ".concat(c));o+=e[c++]}else o+=e[c++]+e[c++];if(i)throw new TypeError("Unbalanced pattern at ".concat(n));if(!o)throw new TypeError("Missing pattern at ".concat(n));t.push({type:"PATTERN",index:n,value:o}),n=c}else{for(var a="",c=n+1;c<e.length;){var f=e.charCodeAt(c);if(!(f>=48&&f<=57||f>=65&&f<=90||f>=97&&f<=122||95===f))break;a+=e[c++]}if(!a)throw new TypeError("Missing parameter name at ".concat(n));t.push({type:"NAME",index:n,value:a}),n=c}else t.push({type:"CLOSE",index:n,value:e[n++]});else t.push({type:"OPEN",index:n,value:e[n++]});else t.push({type:"ESCAPED_CHAR",index:n++,value:e[n++]});else t.push({type:"MODIFIER",index:n,value:e[n++]})}return t.push({type:"END",index:n,value:""}),t}(e),r=t.prefixes,i=void 0===r?"./":r,a="[^".concat(o(t.delimiter||"/#?"),"]+?"),c=[],f=0,u=0,p="",d=function(e){if(u<n.length&&n[u].type===e)return n[u++].value},s=function(e){var t=d(e);if(void 0!==t)return t;var r=n[u],i=r.type,o=r.index;throw new TypeError("Unexpected ".concat(i," at ").concat(o,", expected ").concat(e))},v=function(){for(var e,t="";e=d("CHAR")||d("ESCAPED_CHAR");)t+=e;return t};u<n.length;){var l=d("CHAR"),h=d("NAME"),x=d("PATTERN");if(h||x){var m=l||"";-1===i.indexOf(m)&&(p+=m,m=""),p&&(c.push(p),p=""),c.push({name:h||f++,prefix:m,suffix:"",pattern:x||a,modifier:d("MODIFIER")||""})}else{var E=l||d("ESCAPED_CHAR");if(E)p+=E;else if(p&&(c.push(p),p=""),d("OPEN")){m=v();var y=d("NAME")||"",g=d("PATTERN")||"",w=v();s("CLOSE"),c.push({name:y||(g?f++:""),pattern:y&&!g?a:g,prefix:m,suffix:w,modifier:d("MODIFIER")||""})}else s("END")}}return c}function t(t,r){return n(e(t,r),r)}function n(e,t){void 0===t&&(t={});var n=a(t),r=t.encode,i=void 0===r?function(e){return e}:r,o=t.validate,c=void 0===o||o,f=e.map((function(e){if("object"==typeof e)return new RegExp("^(?:".concat(e.pattern,")$"),n)}));return function(t){for(var n="",r=0;r<e.length;r++){var o=e[r];if("string"!=typeof o){var a=t?t[o.name]:void 0,u="?"===o.modifier||"*"===o.modifier,p="*"===o.modifier||"+"===o.modifier;if(Array.isArray(a)){if(!p)throw new TypeError('Expected "'.concat(o.name,'" to not repeat, but got an array'));if(0===a.length){if(u)continue;throw new TypeError('Expected "'.concat(o.name,'" to not be empty'))}for(var d=0;d<a.length;d++){var s=i(a[d],o);if(c&&!f[r].test(s))throw new TypeError('Expected all "'.concat(o.name,'" to match "').concat(o.pattern,'", but got "').concat(s,'"'));n+=o.prefix+s+o.suffix}}else if("string"!=typeof a&&"number"!=typeof a){if(!u){var v=p?"an array":"a string";throw new TypeError('Expected "'.concat(o.name,'" to be ').concat(v))}}else{s=i(String(a),o);if(c&&!f[r].test(s))throw new TypeError('Expected "'.concat(o.name,'" to match "').concat(o.pattern,'", but got "').concat(s,'"'));n+=o.prefix+s+o.suffix}}else n+=o}return n}}function r(e,t){var n=[];return i(f(e,n,t),n,t)}function i(e,t,n){void 0===n&&(n={});var r=n.decode,i=void 0===r?function(e){return e}:r;return function(n){var r=e.exec(n);if(!r)return!1;for(var o=r[0],a=r.index,c=Object.create(null),f=function(e){if(void 0===r[e])return"continue";var n=t[e-1];"*"===n.modifier||"+"===n.modifier?c[n.name]=r[e].split(n.prefix+n.suffix).map((function(e){return i(e,n)})):c[n.name]=i(r[e],n)},u=1;u<r.length;u++)f(u);return{path:o,index:a,params:c}}}function o(e){return e.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1")}function a(e){return e&&e.sensitive?"":"i"}function c(e,t,n){void 0===n&&(n={});for(var r=n.strict,i=void 0!==r&&r,c=n.start,f=void 0===c||c,u=n.end,p=void 0===u||u,d=n.encode,s=void 0===d?function(e){return e}:d,v=n.delimiter,l=void 0===v?"/#?":v,h=n.endsWith,x="[".concat(o(void 0===h?"":h),"]|$"),m="[".concat(o(l),"]"),E=f?"^":"",y=0,g=e;y<g.length;y++){var w=g[y];if("string"==typeof w)E+=o(s(w));else{var A=o(s(w.prefix)),T=o(s(w.suffix));if(w.pattern)if(t&&t.push(w),A||T)if("+"===w.modifier||"*"===w.modifier){var R="*"===w.modifier?"?":"";E+="(?:".concat(A,"((?:").concat(w.pattern,")(?:").concat(T).concat(A,"(?:").concat(w.pattern,"))*)").concat(T,")").concat(R)}else E+="(?:".concat(A,"(").concat(w.pattern,")").concat(T,")").concat(w.modifier);else"+"===w.modifier||"*"===w.modifier?E+="((?:".concat(w.pattern,")").concat(w.modifier,")"):E+="(".concat(w.pattern,")").concat(w.modifier);else E+="(?:".concat(A).concat(T,")").concat(w.modifier)}}if(p)i||(E+="".concat(m,"?")),E+=n.endsWith?"(?=".concat(x,")"):"$";else{var C=e[e.length-1],b="string"==typeof C?m.indexOf(C[C.length-1])>-1:void 0===C;i||(E+="(?:".concat(m,"(?=").concat(x,"))?")),b||(E+="(?=".concat(m,"|").concat(x,")"))}return new RegExp(E,a(n))}function f(t,n,r){return t instanceof RegExp?function(e,t){if(!t)return e;for(var n=/\((?:\?<(.*?)>)?(?!\?)/g,r=0,i=n.exec(e.source);i;)t.push({name:i[1]||r++,prefix:"",suffix:"",modifier:"",pattern:""}),i=n.exec(e.source);return e}(t,n):Array.isArray(t)?function(e,t,n){var r=e.map((function(e){return f(e,t,n).source}));return new RegExp("(?:".concat(r.join("|"),")"),a(n))}(t,n,r):function(t,n,r){return c(e(t,r),n,r)}(t,n,r)}export{t as compile,r as match,e as parse,f as pathToRegexp,i as regexpToFunction,n as tokensToFunction,c as tokensToRegexp};export default null;