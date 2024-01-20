/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/awilix@10.0.1/lib/awilix.browser.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},e(t,n)};function t(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}var n=function(){return n=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},n.apply(this,arguments)};function r(e,t){var n,r,o,i,c={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(a){return function(u){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,a[0]&&(c=0)),c;)try{if(n=1,r&&(o=2&a[0]?r.return:a[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,a[1])).done)return o;switch(r=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return c.label++,{value:a[1],done:!1};case 5:c.label++,r=a[1],a=[0];continue;case 7:a=c.ops.pop(),c.trys.pop();continue;default:if(!(o=c.trys,(o=o.length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){c=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){c.label=a[1];break}if(6===a[0]&&c.label<o[1]){c.label=o[1],o=a;break}if(o&&c.label<o[2]){c.label=o[2],c.ops.push(a);break}o[2]&&c.ops.pop(),c.trys.pop();continue}a=t.call(e,c)}catch(e){a=[6,e],r=0}finally{n=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,u])}}}function o(e,t,n){if(n||2===arguments.length)for(var r,o=0,i=t.length;o<i;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))}"function"==typeof SuppressedError&&SuppressedError;var i=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}return t(n,e),n}(function(e){function n(t){var n=e.call(this,t)||this;return Object.defineProperty(n,"message",{enumerable:!1,value:t}),Object.defineProperty(n,"name",{enumerable:!1,value:n.constructor.name}),"captureStackTrace"in Error?Error.captureStackTrace(n,n.constructor):Object.defineProperty(n,"stack",{enumerable:!1,value:Error(t).stack,writable:!0,configurable:!0}),n}return t(n,e),n}(Error)),c=function(e){function n(t,n,r,o){return e.call(this,"".concat(t,": expected ").concat(n," to be ").concat(r,", but got ").concat(o,"."))||this}return t(n,e),n.assert=function(e,t,r,o,i){if(!e)throw new n(t,r,o,i);return e},n}(i),a=function(e){function n(t,n,r){var o=t.toString(),i=n.map((function(e){return e.name.toString()}));i.push(o);var c=i.join(" -> "),a="Could not resolve '".concat(o,"'.");return r&&(a+=" ".concat(r)),a+="\n\n",a+="Resolution path: ".concat(c),e.call(this,a)||this}return t(n,e),n}(i),u=function(e){function n(t,n){var r=t.toString(),o="Could not register '".concat(r,"'.");return n&&(o+=" ".concat(n)),e.call(this,o)||this}return t(n,e),n}(i),s={PROXY:"PROXY",CLASSIC:"CLASSIC"},l={SINGLETON:"SINGLETON",TRANSIENT:"TRANSIENT",SCOPED:"SCOPED"};function f(e){var t=e.length,n=0,r="EOF",o="",i=0,c=0,a=0;return{next:function(e){void 0===e&&(e=0);return i=e,u(),v()},done:function(){return"EOF"===r}};function u(){for(o="",r="EOF";;){if(n>=t)return r="EOF";var u=e.charAt(n);if(p(u))n++;else switch(u){case"(":return n++,c++,r=u;case")":return n++,a++,r=u;case"*":case",":return n++,r=u;case"=":return n++,0==(1&i)&&l((function(e){var t=c===a+1;return!(","!==e||!t)||("("===e?(c++,!1):!(")"!==e||(a++,!t)))})),r=u;case"/":n++;var f=e.charAt(n);"/"===f&&(l((function(e){return"\n"===e}),!0),n++),"*"===f&&(l((function(t){var r=e.charAt(n+1);return"*"===t&&"/"===r}),!0),n++);continue;default:if(d(u))return s(),r;n++}}}function s(){for(var t,i=e.charAt(n),c=++n;t=e.charAt(n),y.test(t);)n++;return o=""+i+e.substring(c,n),"ident"!==(r="function"===o||"class"===o?o:"ident")&&(o=""),o}function l(t,r){for(void 0===r&&(r=!1);n<e.length;){var o=e.charAt(n);if(t(o))return;if(!r){if(p(o)){n++;continue}if(h(o)){f();continue}}n++}}function f(){var t=e.charAt(n);for(n++;n<e.length;){var r=e.charAt(n),o=e.charAt(n-1);if(r===t&&"\\"!==o)return void n++;if("`"===t)if("$"===e.charAt(n+1))"{"===e.charAt(n+2)&&(n+=2,l((function(e){return"}"===e})));n++}}function v(){return o?{value:o,type:r}:{type:r}}}function p(e){switch(e){case"\r":case"\n":case" ":return!0}return!1}function h(e){switch(e){case"'":case'"':case"`":return!0}return!1}var v=/^[_$a-zA-Z\xA0-\uFFFF]$/,y=/^[._$a-zA-Z0-9\xA0-\uFFFF]$/;function d(e){return v.test(e)}function b(e){if("function"!=typeof e)return!1;var t=f(e.toString()),n=t.next();if("class"===n.type)return!0;var r=t.next();return!("function"!==n.type||!r.value||r.value[0]!==r.value[0].toUpperCase())}function g(e){return"function"==typeof e}var w=Symbol("Awilix Resolver Config");function S(e){return{resolve:function(){return e},isLeakSafe:!0}}function m(e,t){if(!g(e))throw new c("asFunction","fn","function",e);t=j({lifetime:l.TRANSIENT},t,e[w]);var r=C(e);return N(E(n({resolve:r},t)))}function O(e,t){if(!g(e))throw new c("asClass","Type","class",e);t=j({lifetime:l.TRANSIENT},t,e[w]);var r=C((function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return Reflect.construct(e,t)}),e);return N(E(n(n({},t),{resolve:r})))}function A(e){return{resolve:function(t){return t.resolve(e)},isLeakSafe:!0}}function E(e){function t(e){return E(n(n({},this),{lifetime:e}))}function r(e){return E(n(n({},this),{injectionMode:e}))}return P(e,{setLifetime:t,inject:function(e){return E(n(n({},this),{injector:e}))},transient:T(t,l.TRANSIENT),scoped:T(t,l.SCOPED),singleton:T(t,l.SINGLETON),setInjectionMode:r,proxy:T(r,s.PROXY),classic:T(r,s.CLASSIC)})}function N(e){return P(e,{disposer:function(e){return N(n(n({},this),{dispose:e}))}})}function T(e,t){return function(){return e.call(this,t)}}function j(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return Object.assign.apply(Object,o([{},e],t,!1))}function P(e,t){return n(n({},e),t)}function k(e,t){var n,i=t(e),c=(n=o(o([],Reflect.ownKeys(e.cradle),!0),Reflect.ownKeys(i),!0),Array.from(new Set(n)));return new Proxy({},{get:function(t,n){return n===Symbol.iterator?function(){var t,n,o,c,a,u,s,l;return r(this,(function(r){switch(r.label){case 0:for(o in t=e.cradle,n=[],t)n.push(o);c=0,r.label=1;case 1:return c<n.length?(o=n[c])in t?[4,o]:[3,3]:[3,4];case 2:r.sent(),r.label=3;case 3:return c++,[3,1];case 4:for(s in u=[],a=i)u.push(s);l=0,r.label=5;case 5:return l<u.length?(s=u[l])in a?[4,s]:[3,7]:[3,8];case 6:r.sent(),r.label=7;case 7:return l++,[3,5];case 8:return[2]}}))}:n in i?i[n]:e.resolve(n)},ownKeys:function(){return c},getOwnPropertyDescriptor:function(e,t){if(c.indexOf(t)>-1)return{enumerable:!0,configurable:!0}}})}function C(e,t){t||(t=e);var n=x(t);return function(t){if((this.injectionMode||t.options.injectionMode||s.PROXY)!==s.CLASSIC){var r=this.injector?k(t,this.injector):t.cradle;return e(r)}if(n.length>0){var o=this.injector?function(e,t){return function(n,r){return n in t?t[n]:e.resolve(n,r)}}(t,this.injector(t)):t.resolve,i=n.map((function(e){return o(e.name,{allowUnregistered:e.optional})}));return e.apply(void 0,i)}return e()}}function x(e){var t=function(e){var t=f(e),n=t.next,r=t.done,o=[],i=null;for(p();!r();)switch(i.type){case"class":if(s(),!l())return null;p();break;case"function":"ident"!==(c=p()).type&&"*"!==c.type||p();break;case"(":u();break;case")":return o;case"ident":var c,a={name:i.value,optional:!1};if("async"===i.value&&(c=p())&&"="!==c.type)break;return o.push(a),o;default:throw h()}return o;function u(){for(var e={name:"",optional:!1};!r();)switch(p(),i.type){case"ident":e.name=i.value;break;case"=":e.optional=!0;break;case",":o.push(e),e={name:"",optional:!1};break;case")":return void(e.name&&o.push(e));default:throw h()}}function s(){for(;!l()&&!r();)p(1)}function l(){return"ident"===i.type&&"constructor"===i.value}function p(e){return void 0===e&&(e=0),i=n(e)}function h(){return new SyntaxError("Parsing parameter list, did not expect ".concat(i.type," token").concat(i.value?" (".concat(i.value,")"):""))}}(e.toString());if(!t){var n=Object.getPrototypeOf(e);return"function"==typeof n&&n!==Function.prototype?x(n):[]}return t}var R=Symbol("familyTree"),I=Symbol("rollUpRegistrations"),L="AwilixContainerCradle";function F(e){return void 0===e&&(e={}),_(e)}function _(e,t,i){var f;e=n({injectionMode:s.PROXY,strict:!1},e);var p=null!=i?i:[],h={},v=new Proxy({},{get:function(e,t){return T(t)},set:function(e,t){throw new Error('Attempted setting property "'.concat(t,'" on container cradle - this is not allowed.'))},ownKeys:function(){return Array.from(v)},getOwnPropertyDescriptor:function(e,t){var n=S();if(Object.getOwnPropertyDescriptor(n,t))return{enumerable:!0,configurable:!0}}}),y=((f={options:e,cradle:v,inspect:function(){return"[AwilixContainer (".concat(t?"scoped, ":"","registrations: ").concat(Object.keys(y.registrations).length,")]")},cache:new Map,loadModules:function(){throw new Error("loadModules is not supported in the browser.")},createScope:function(){return _(e,y,p)},register:function(n,r){for(var i=function(e,t){var n,r=e;return"string"==typeof r||"symbol"==typeof r?((n={})[e]=t,n):r}(n,r),c=o(o([],Object.keys(i),!0),Object.getOwnPropertySymbols(i),!0),a=0,s=c;a<s.length;a++){var f=s[a],p=i[f];if(e.strict&&p.lifetime===l.SINGLETON&&t)throw new u(f,"Cannot register a singleton on a scoped container.");h[f]=p}return y},build:function(e,t){if(e&&e.resolve)return e.resolve(y);var n="build",r="targetOrResolver";return c.assert(e,n,r,"a registration, function or class",e),c.assert("function"==typeof e,n,r,"a function or class",e),(b(e)?O(e,t):m(e,t)).resolve(y)},resolve:T,hasRegistration:function(e){return!!N(e)},dispose:function(){var e=Array.from(y.cache.entries());return y.cache.clear(),Promise.all(e.map((function(e){var t=e[1],n=t.resolver,r=t.value,o=n;return o.dispose?Promise.resolve().then((function(){return o.dispose(r)})):Promise.resolve()}))).then((function(){}))},getRegistration:N})[I]=S,Object.defineProperty(f,"registrations",{get:function(){return S()},enumerable:!1,configurable:!0}),f),d=t?[y].concat(t[R]):[y];y[R]=d;var g,w=(g=d)[g.length-1];return y;function S(){return n(n({},t&&t[I]()),h)}function A(){var e,t,n,o,i;return r(this,(function(r){switch(r.label){case 0:for(o in e=S(),n=[],t=e)n.push(o);i=0,r.label=1;case 1:return i<n.length?(o=n[i])in t?[4,o]:[3,3]:[3,4];case 2:r.sent(),r.label=3;case 3:return i++,[3,1];case 4:return[2]}}))}function E(){return Object.prototype.toString.call(v)}function N(e){var n=h[e];return n||(t?t.getRegistration(e):null)}function T(t,n){n=n||{};try{var r=N(t);if(p.some((function(e){return e.name===t})))throw new a(t,p,"Cyclic dependencies detected.");if("toJSON"===t)return E;if("constructor"===t)return F;if(!r){switch(t){case"inspect":case"toString":return E;case Symbol.toStringTag:return L;case"then":return;case Symbol.iterator:return A}if(n.allowUnregistered)return;throw new a(t,p)}var o=r.lifetime||l.TRANSIENT;if(e.strict&&!r.isLeakSafe){var i=p.findIndex((function(e){var t,n,r=e.lifetime;return n=o,(t=r)===l.SINGLETON&&n!==l.SINGLETON||t===l.SCOPED&&n===l.TRANSIENT}));if(i>-1)throw new a(t,p,"Dependency '".concat(t.toString(),"' has a shorter lifetime than its ancestor: '").concat(p[i].name.toString(),"'"))}p.push({name:t,lifetime:o});var c=void 0,u=void 0;switch(o){case l.TRANSIENT:u=r.resolve(y);break;case l.SINGLETON:(c=w.cache.get(t))?u=c.value:(u=r.resolve(e.strict?w:y),w.cache.set(t,{resolver:r,value:u}));break;case l.SCOPED:if(void 0!==(c=y.cache.get(t))){u=c.value;break}u=r.resolve(y),y.cache.set(t,{resolver:r,value:u});break;default:throw new a(t,p,'Unknown lifetime "'.concat(r.lifetime,'"'))}return p.pop(),u}catch(e){throw p.length=0,e}}}export{i as AwilixError,u as AwilixRegistrationError,a as AwilixResolutionError,c as AwilixTypeError,s as InjectionMode,l as Lifetime,w as RESOLVER,A as aliasTo,O as asClass,m as asFunction,S as asValue,F as createContainer};export default null;
//# sourceMappingURL=/sm/a220a4132bbfa34c0db33f7460b057f5cb447498f3ff62b522c3e222f82370bf.map