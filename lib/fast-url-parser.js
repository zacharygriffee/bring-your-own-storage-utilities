function t(t){return t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function e(t,e){return Object.prototype.hasOwnProperty.call(t,e)}var r=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)};function o(t){switch(typeof t){case"string":return t;case"boolean":return t?"true":"false";case"number":return isFinite(t)?t:"";default:return""}}function s(t,e,s,a){return e=e||"&",s=s||"=",null===t&&(t=void 0),"object"==typeof t?n(h(t),(function(h){var a=encodeURIComponent(o(h))+s;return r(t[h])?n(t[h],(function(t){return a+encodeURIComponent(o(t))})).join(e):a+encodeURIComponent(o(t[h]))})).join(e):a?encodeURIComponent(o(a))+s+encodeURIComponent(o(t)):""}function n(t,e){if(t.map)return t.map(e);for(var r=[],o=0;o<t.length;o++)r.push(e(t[o],o));return r}var h=Object.keys||function(t){var e=[];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.push(r);return e};function a(t,o,s,n){o=o||"&",s=s||"=";var h={};if("string"!=typeof t||0===t.length)return h;var a=/\+/g;t=t.split(o);var i=1e3;n&&"number"==typeof n.maxKeys&&(i=n.maxKeys);var p=t.length;i>0&&p>i&&(p=i);for(var c=0;c<p;++c){var u,f,l,_,d=t[c].replace(a,"%20"),v=d.indexOf(s);v>=0?(u=d.substr(0,v),f=d.substr(v+1)):(u=d,f=""),l=decodeURIComponent(u),_=decodeURIComponent(f),e(h,l)?r(h[l])?h[l].push(_):h[l]=[h[l],_]:h[l]=_}return h}var i={encode:s,stringify:s,decode:a,parse:a},p=t(Object.freeze({__proto__:null,stringify:s,parse:a,default:i,encode:s,decode:a})),c=2147483647,u=36,f=1,l=26,_=38,d=700,v=72,m=128,y="-",C=/^xn--/,g=/[^\x20-\x7E]/,A=/[\x2E\u3002\uFF0E\uFF61]/g,b={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},j=u-f,O=Math.floor,P=String.fromCharCode;function w(t){throw new RangeError(b[t])}function I(t,e){for(var r=t.length,o=[];r--;)o[r]=e(t[r]);return o}function E(t,e){var r=t.split("@"),o="";return r.length>1&&(o=r[0]+"@",t=r[1]),o+I((t=t.replace(A,".")).split("."),e).join(".")}function S(t){for(var e,r,o=[],s=0,n=t.length;s<n;)(e=t.charCodeAt(s++))>=55296&&e<=56319&&s<n?56320==(64512&(r=t.charCodeAt(s++)))?o.push(((1023&e)<<10)+(1023&r)+65536):(o.push(e),s--):o.push(e);return o}function x(t){return I(t,(function(t){var e="";return t>65535&&(e+=P((t-=65536)>>>10&1023|55296),t=56320|1023&t),e+=P(t)})).join("")}function U(t,e){return t+22+75*(t<26)-((0!=e)<<5)}function R(t,e,r){var o=0;for(t=r?O(t/d):t>>1,t+=O(t/e);t>j*l>>1;o+=u)t=O(t/j);return O(o+(j+1)*t/(t+_))}function q(t){var e,r,o,s,n,h,a,i,p,_,d,C=[],g=t.length,A=0,b=m,j=v;for((r=t.lastIndexOf(y))<0&&(r=0),o=0;o<r;++o)t.charCodeAt(o)>=128&&w("not-basic"),C.push(t.charCodeAt(o));for(s=r>0?r+1:0;s<g;){for(n=A,h=1,a=u;s>=g&&w("invalid-input"),((i=(d=t.charCodeAt(s++))-48<10?d-22:d-65<26?d-65:d-97<26?d-97:u)>=u||i>O((c-A)/h))&&w("overflow"),A+=i*h,!(i<(p=a<=j?f:a>=j+l?l:a-j));a+=u)h>O(c/(_=u-p))&&w("overflow"),h*=_;j=R(A-n,e=C.length+1,0==n),O(A/e)>c-b&&w("overflow"),b+=O(A/e),A%=e,C.splice(A++,0,b)}return x(C)}function k(t){var e,r,o,s,n,h,a,i,p,_,d,C,g,A,b,j=[];for(C=(t=S(t)).length,e=m,r=0,n=v,h=0;h<C;++h)(d=t[h])<128&&j.push(P(d));for(o=s=j.length,s&&j.push(y);o<C;){for(a=c,h=0;h<C;++h)(d=t[h])>=e&&d<a&&(a=d);for(a-e>O((c-r)/(g=o+1))&&w("overflow"),r+=(a-e)*g,e=a,h=0;h<C;++h)if((d=t[h])<e&&++r>c&&w("overflow"),d==e){for(i=r,p=u;!(i<(_=p<=n?f:p>=n+l?l:p-n));p+=u)b=i-_,A=u-_,j.push(P(U(_+b%A,0))),i=O(b/A);j.push(P(U(i,0))),n=R(r,g,o==s),r=0,++o}++r,++e}return j.join("")}function H(t){return E(t,(function(t){return C.test(t)?q(t.slice(4).toLowerCase()):t}))}function F(t){return E(t,(function(t){return g.test(t)?"xn--"+k(t):t}))}var M="1.4.1",Q={decode:S,encode:x},L={version:M,ucs2:Q,toASCII:F,toUnicode:H,encode:k,decode:q},T=t(Object.freeze({__proto__:null,decode:q,encode:k,toUnicode:H,toASCII:F,version:M,ucs2:Q,default:L}));function z(){this._protocol=null,this._href="",this._port=-1,this._query=null,this.auth=null,this.slashes=null,this.host=null,this.hostname=null,this.hash=null,this.search=null,this.pathname=null,this._prependSlash=!1}var K=p;z.queryString=K,z.prototype.parse=function(t,e,r,o){if("string"!=typeof t)throw new TypeError("Parameter 'url' must be a string, not "+typeof t);for(var s=0,n=t.length-1;t.charCodeAt(s)<=32;)s++;for(;t.charCodeAt(n)<=32;)n--;if(s=this._parseProtocol(t,s,n),"javascript"!==this._protocol){s=this._parseHost(t,s,n,r);var h=this._protocol;!this.hostname&&(this.slashes||h&&!et[h])&&(this.hostname=this.host="")}if(s<=n){var a=t.charCodeAt(s);47===a||92===a?this._parsePath(t,s,n,o):63===a?this._parseQuery(t,s,n,o):35===a?this._parseHash(t,s,n,o):"javascript"!==this._protocol?this._parsePath(t,s,n,o):this.pathname=t.slice(s,n+1)}if(!this.pathname&&this.hostname&&this._slashProtocols[this._protocol]&&(this.pathname="/"),e){var i=this.search;null==i&&(i=this.search=""),63===i.charCodeAt(0)&&(i=i.slice(1)),this.query=z.queryString.parse(i)}},z.prototype.resolve=function(t){return this.resolveObject(z.parse(t,!1,!0)).format()},z.prototype.format=function(){var t=this.auth||"";t&&(t=(t=encodeURIComponent(t)).replace(/%3A/i,":"),t+="@");var e=this.protocol||"",r=this.pathname||"",o=this.hash||"",s=this.search||"",n="",h=this.hostname||"",a=this.port||"",i=!1,p="",c=this.query;if(c&&"object"==typeof c&&(n=z.queryString.stringify(c)),s||(s=n?"?"+n:""),e&&58!==e.charCodeAt(e.length-1)&&(e+=":"),this.host)i=t+this.host;else if(h){h.indexOf(":")>-1&&(h="["+h+"]"),i=t+h+(a?":"+a:"")}var u=this.slashes||(!e||et[e])&&!1!==i;return e?p=e+(u?"//":""):u&&(p="//"),u&&r&&47!==r.charCodeAt(0)&&(r="/"+r),s&&63!==s.charCodeAt(0)&&(s="?"+s),o&&35!==o.charCodeAt(0)&&(o="#"+o),p+(!1===i?"":i)+(r=B(r))+(s=D(s))+o},z.prototype.resolveObject=function(t){"string"==typeof t&&(t=z.parse(t,!1,!0));var e=this._clone();if(e.hash=t.hash,!t.href)return e._href="",e;if(t.slashes&&!t._protocol)return t._copyPropsTo(e,!0),et[e._protocol]&&e.hostname&&!e.pathname&&(e.pathname="/"),e._href="",e;if(t._protocol&&t._protocol!==e._protocol){if(!et[t._protocol])return t._copyPropsTo(e,!1),e._href="",e;if(e._protocol=t._protocol,t.host||"javascript"===t._protocol)e.pathname=t.pathname;else{for(var r=(t.pathname||"").split("/");r.length&&!(t.host=r.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==r[0]&&r.unshift(""),r.length<2&&r.unshift(""),e.pathname=r.join("/")}return e.search=t.search,e.host=t.host||"",e.auth=t.auth,e.hostname=t.hostname||t.host,e._port=t._port,e.slashes=e.slashes||t.slashes,e._href="",e}var o=e.pathname&&47===e.pathname.charCodeAt(0),s=t.host||t.pathname&&47===t.pathname.charCodeAt(0),n=s||o||e.host&&t.pathname,h=n,a=e.pathname&&e.pathname.split("/")||[],i=(r=t.pathname&&t.pathname.split("/")||[],e._protocol&&!et[e._protocol]);if(i&&(e.hostname="",e._port=-1,e.host&&(""===a[0]?a[0]=e.host:a.unshift(e.host)),e.host="",t._protocol&&(t.hostname="",t._port=-1,t.host&&(""===r[0]?r[0]=t.host:r.unshift(t.host)),t.host=""),n=n&&(""===r[0]||""===a[0])),s)e.host=t.host?t.host:e.host,e.hostname=t.hostname?t.hostname:e.hostname,e.search=t.search,a=r;else if(r.length)a||(a=[]),a.pop(),a=a.concat(r),e.search=t.search;else if(t.search){if(i)e.hostname=e.host=a.shift(),(l=!!(e.host&&e.host.indexOf("@")>0)&&e.host.split("@"))&&(e.auth=l.shift(),e.host=e.hostname=l.shift());return e.search=t.search,e._href="",e}if(!a.length)return e.pathname=null,e._href="",e;for(var p=a.slice(-1)[0],c=(e.host||t.host)&&("."===p||".."===p)||""===p,u=0,f=a.length;f>=0;f--)"."===(p=a[f])?a.splice(f,1):".."===p?(a.splice(f,1),u++):u&&(a.splice(f,1),u--);if(!n&&!h)for(;u--;u)a.unshift("..");!n||""===a[0]||a[0]&&47===a[0].charCodeAt(0)||a.unshift(""),c&&"/"!==a.join("/").substr(-1)&&a.push("");var l,_=""===a[0]||a[0]&&47===a[0].charCodeAt(0);i&&(e.hostname=e.host=_?"":a.length?a.shift():"",(l=!!(e.host&&e.host.indexOf("@")>0)&&e.host.split("@"))&&(e.auth=l.shift(),e.host=e.hostname=l.shift()));return(n=n||e.host&&a.length)&&!_&&a.unshift(""),e.pathname=0===a.length?null:a.join("/"),e.auth=t.auth||e.auth,e.slashes=e.slashes||t.slashes,e._href="",e};var N=T;z.prototype._hostIdna=function(t){return N.toASCII(t)};var B=z.prototype._escapePathName=function(t){return G(t,35,63)?function(t){return t.replace(/[?#]/g,(function(t){return encodeURIComponent(t)}))}(t):t},D=z.prototype._escapeSearch=function(t){return G(t,35,-1)?function(t){return t.replace(/#/g,(function(t){return encodeURIComponent(t)}))}(t):t};function G(t,e,r){for(var o=0,s=t.length;o<s;++o){var n=t.charCodeAt(o);if(n===e||n===r)return!0}return!1}function J(t){var e=new Uint8Array(128);return t.forEach((function(t){if("number"==typeof t)e[t]=1;else for(var r=t[0],o=t[1],s=r;s<=o;++s)e[s]=1})),e}z.prototype._parseProtocol=function(t,e,r){for(var o=!1,s=this._protocolCharacters,n=e;n<=r;++n){var h=t.charCodeAt(n);if(58===h){var a=t.slice(e,n);return o&&(a=a.toLowerCase()),this._protocol=a,n+1}if(1!==s[h])return e;h<97&&(o=!0)}return e},z.prototype._parseAuth=function(t,e,r,o){var s=t.slice(e,r+1);o&&(s=decodeURIComponent(s)),this.auth=s},z.prototype._parsePort=function(t,e,r){for(var o=0,s=!1,n=!0,h=e;h<=r;++h){var a=t.charCodeAt(h);if(!(48<=a&&a<=57)){n=!1,92!==a&&47!==a||(n=!0);break}o=10*o+(a-48),s=!0}return 0===o&&!s||!n?(n||(this._port=-2),0):(this._port=o,h-e)},z.prototype._parseHost=function(t,e,r,o){var s=this._hostEndingCharacters,n=t.charCodeAt(e),h=t.charCodeAt(e+1);if(47!==n&&92!==n||47!==h&&92!==h){if(!this._protocol||et[this._protocol])return e}else{if(this.slashes=!0,0===e){if(r<2)return e;var a=function(t,e,r,o){for(var s=t.length,n=r;n<s;++n){var h=t.charCodeAt(n);if(h===e)return!0;if(1===o[h])return!1}return!1}(t,64,2,s);if(!a&&!o)return this.slashes=null,e}e+=2}for(var i=!1,p=!1,c=e,u=r,f=0,l=0,_=!1,d=-1,v=e;v<=r;++v){if(64===(y=t.charCodeAt(v)))d=v;else if(37===y)_=!0;else if(1===s[y])break}if(d>-1&&(this._parseAuth(t,e,d-1,_),e=c=d+1),91===t.charCodeAt(e)){for(v=e+1;v<=r;++v){if(93===(y=t.charCodeAt(v))){58===t.charCodeAt(v+1)&&(f=this._parsePort(t,v+2,r)+1);var m=t.slice(e+1,v).toLowerCase();return this.hostname=m,this.host=this._port>0?"["+m+"]:"+this._port:"["+m+"]",this.pathname="/",v+f+1}}return e}for(v=e;v<=r;++v){if(l>62)return this.hostname=this.host=t.slice(e,v),v;var y;if(58===(y=t.charCodeAt(v))){f=this._parsePort(t,v+1,r)+1,u=v-1;break}if(y<97){if(46===y)l=-1;else if(65<=y&&y<=90)i=!0;else if(!(45===y||95===y||43===y||48<=y&&y<=57)){0===s[y]&&0===this._noPrependSlashHostEnders[y]&&(this._prependSlash=!0),u=v-1;break}}else if(y>=123){if(y<=126){0===this._noPrependSlashHostEnders[y]&&(this._prependSlash=!0),u=v-1;break}p=!0}l++}if(u+1!==e&&u-c<=256){m=t.slice(c,u+1);i&&(m=m.toLowerCase()),p&&(m=this._hostIdna(m)),this.hostname=m,this.host=this._port>0?m+":"+this._port:m}return u+1+f},z.prototype._copyPropsTo=function(t,e){e||(t._protocol=this._protocol),t._href=this._href,t._port=this._port,t._prependSlash=this._prependSlash,t.auth=this.auth,t.slashes=this.slashes,t.host=this.host,t.hostname=this.hostname,t.hash=this.hash,t.search=this.search,t.pathname=this.pathname},z.prototype._clone=function(){var t=new z;return t._protocol=this._protocol,t._href=this._href,t._port=this._port,t._prependSlash=this._prependSlash,t.auth=this.auth,t.slashes=this.slashes,t.host=this.host,t.hostname=this.hostname,t.hash=this.hash,t.search=this.search,t.pathname=this.pathname,t},z.prototype._getComponentEscaped=function(t,e,r,o){for(var s=e,n=e,h="",a=o?this._afterQueryAutoEscapeMap:this._autoEscapeMap;n<=r;++n){var i=a[t.charCodeAt(n)];""!==i&&void 0!==i&&(s<n&&(h+=t.slice(s,n)),h+=i,s=n+1)}return s<n+1&&(h+=t.slice(s,n)),h},z.prototype._parsePath=function(t,e,r,o){for(var s,n=e,h=r,a=!1,i=this._autoEscapeCharacters,p=-2===this._port?"/:":"",c=e;c<=r;++c){var u=t.charCodeAt(c);if(35===u){this._parseHash(t,c,r,o),h=c-1;break}if(63===u){this._parseQuery(t,c,r,o),h=c-1;break}o||a||1!==i[u]||(a=!0)}n>h?this.pathname=""===p?"/":p:(s=a?this._getComponentEscaped(t,n,h,!1):t.slice(n,h+1),this.pathname=""===p?this._prependSlash?"/"+s:s:p+s)},z.prototype._parseQuery=function(t,e,r,o){for(var s,n=e,h=r,a=!1,i=this._autoEscapeCharacters,p=e;p<=r;++p){var c=t.charCodeAt(p);if(35===c){this._parseHash(t,p,r,o),h=p-1;break}o||a||1!==i[c]||(a=!0)}n>h?this.search="":(s=a?this._getComponentEscaped(t,n,h,!0):t.slice(n,h+1),this.search=s)},z.prototype._parseHash=function(t,e,r,o){this.hash=e>r?"":o?t.slice(e,r+1):this._getComponentEscaped(t,e,r,!0)},Object.defineProperty(z.prototype,"port",{get:function(){return this._port>=0?""+this._port:null},set:function(t){this._port=null==t?-1:parseInt(t,10)}}),Object.defineProperty(z.prototype,"query",{get:function(){var t=this._query;if(null!=t)return t;var e=this.search;return e&&(63===e.charCodeAt(0)&&(e=e.slice(1)),""!==e)?(this._query=e,e):e},set:function(t){this._query=t}}),Object.defineProperty(z.prototype,"path",{get:function(){var t=this.pathname||"",e=this.search||"";return t||e?t+e:null==t&&e?"/"+e:null},set:function(){}}),Object.defineProperty(z.prototype,"protocol",{get:function(){var t=this._protocol;return t?t+":":t},set:function(t){if("string"==typeof t){var e=t.length-1;58===t.charCodeAt(e)?this._protocol=t.slice(0,e):this._protocol=t}else null==t&&(this._protocol=null)}}),Object.defineProperty(z.prototype,"href",{get:function(){var t=this._href;return t||(t=this._href=this.format()),t},set:function(t){this._href=t}}),z.parse=function(t,e,r,o){if(t instanceof z)return t;var s=new z;return s.parse(t,!!e,!!r,!!o),s},z.format=function(t){return"string"==typeof t&&(t=z.parse(t)),t instanceof z?t.format():z.prototype.format.call(t)},z.resolve=function(t,e){return z.parse(t,!1,!0).resolve(e)},z.resolveObject=function(t,e){return t?z.parse(t,!1,!0).resolveObject(e):e};for(var V=["<",">",'"',"`"," ","\r","\n","\t","{","}","|","\\","^","`","'"],W=new Array(128),X=0,Y=W.length;X<Y;++X)W[X]="";for(X=0,Y=V.length;X<Y;++X){var Z=V[X],$=encodeURIComponent(Z);$===Z&&($=escape(Z)),W[Z.charCodeAt(0)]=$}var tt=W.slice();W[92]="/";var et=z.prototype._slashProtocols={http:!0,https:!0,gopher:!0,file:!0,ftp:!0,"http:":!0,"https:":!0,"gopher:":!0,"file:":!0,"ftp:":!0};z.prototype._protocolCharacters=J([[97,122],[65,90],46,43,45]),z.prototype._hostEndingCharacters=J([35,63,47,92]),z.prototype._autoEscapeCharacters=J(V.map((function(t){return t.charCodeAt(0)}))),z.prototype._noPrependSlashHostEnders=J(["<",">","'","`"," ","\r","\n","\t","{","}","|","^","`",'"',"%",";"].map((function(t){return t.charCodeAt(0)}))),z.prototype._autoEscapeMap=W,z.prototype._afterQueryAutoEscapeMap=tt;var rt=z;z.replace=function(){require.cache.url={exports:z}};var ot=rt.format,st=rt.parse,nt=rt.queryString,ht=rt.replace,at=rt.resolve,it=rt.resolveObject;export{rt as default,ot as format,st as parse,nt as queryString,ht as replace,at as resolve,it as resolveObject};