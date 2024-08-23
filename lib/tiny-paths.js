var n="undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{};"function"==typeof n.setTimeout&&setTimeout,"function"==typeof n.clearTimeout&&clearTimeout;function e(n,e){this.fun=n,this.array=e}e.prototype.run=function(){this.fun.apply(null,this.array)};var t=n.performance||{};t.now||t.mozNow||t.msNow||t.oNow||t.webkitNow;new Date;var o="browser";const i=s(!1),r=s(!0);i.win32=r,r.posix=i;var l="win32"===o?r:i;function s(n){const e={};e.posix=e,e.win32=e;const t=e.sep=n?"\\":"/";return n?(e.isAbsolute=function(n){return 0!==n.length&&("\\"===n[0]||"/"===n[0]||2===n.length&&":"===n[1]||n.length>2&&":"===n[1]&&("\\"===n[2]||"/"===n[2]))},e.root=function(n){return 0===n.length?"":"\\"===n[0]||"/"===n[0]?n[0]:2===n.length&&":"===n[1]?n:n.length>2&&":"===n[1]&&("\\"===n[2]||"/"===n[2])?n.slice(0,3):""}):(e.isAbsolute=function(n){return n.length>0&&"/"===n[0]},e.root=function(n){return e.isAbsolute(n)?"/":""}),e.basename=function(n){let e=n.length-1;for(;e>0&&n[e]===t;)e--;return e<=0?"":n.slice(n.lastIndexOf(t,e)+1,e+1)},e.dirname=function(n){let e=n.length-1;for(;e>0&&n[e]===t;)e--;if(e<=0)return"";const o=n.lastIndexOf(t,e);return-1===o?"":n.slice(0,o)},e.extname=function(n){const e=n.lastIndexOf(".");return-1===e?"":n.slice(e)},e.resolve=function(n,t){return void 0===t?e.normalize(n):e.isAbsolute(t)?e.normalize(t):e.join(n,t)},e.join=function(n,...o){for(const e of o)n+=t+e;return e.normalize(n)},e.normalize=function(o){if(!0===n){let n=-1;for(;-1!==(n=o.indexOf("/",n+1));)o=o.slice(0,n)+t+o.slice(n+1)}const i=e.root(o),r=""!==i;let l=i.length,s="";for(;l<o.length;){let n=o.indexOf(t,l);-1===n&&(n=o.length);const e=o.slice(l,n);if(l=n+1,""!==e&&"."!==e)if(".."!==e)s+=s?t+e:e;else{const n=s.lastIndexOf(t);-1===n||".."===s.slice(n+1)?r?s="":s+=s?t+"..":"..":s=s.slice(0,n)}}return i&&(s=i+s),s||"."},e}l.posix=l;

    const {
        dirname,
        isAbsolute,
        root,
        basename,
        extname,
        resolve,
        join,
        normalize
    } = l;
    export {
        dirname,
        isAbsolute,
        root,
        basename,
        extname,
        resolve,
        join,
        normalize,
        l as posix,
        l as default,
        l as win32
    };
