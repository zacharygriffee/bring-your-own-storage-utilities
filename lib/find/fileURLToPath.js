/*Copyright (c) 2014 Nathan Rajlich <nathan@tootallnate.net>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

    The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

function t(t) {
    return t && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t
}

function r(t, r) {
    for (var e = 0, n = t.length - 1; n >= 0; n--) {
        const s = t[n];
        "." === s ? t.splice(n, 1) : ".." === s ? (t.splice(n, 1), e++) : e && (t.splice(n, 1), e--)
    }
    if (r) for (; e--; e) t.unshift("..");
    return t
}

var e = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/, n = function (t) {
    return e.exec(t).slice(1)
};

function s() {
    for (var t = "", e = !1, n = arguments.length - 1; n >= -1 && !e; n--) {
        const s = n >= 0 ? arguments[n] : "/";
        if ("string" != typeof s) throw new TypeError("Arguments to path.resolve must be strings");
        s && (t = s + "/" + t, e = "/" === s.charAt(0))
    }
    return (e ? "/" : "") + (t = r(h(t.split("/"), (function (t) {
        return !!t
    })), !e).join("/")) || "."
}

function i(t) {
    const e = o(t), n = "/" === g(t, -1);
    return (t = r(h(t.split("/"), (function (t) {
        return !!t
    })), !e).join("/")) || e || (t = "."), t && n && (t += "/"), (e ? "/" : "") + t
}

function o(t) {
    return "/" === t.charAt(0)
}

function u() {
    return i(h(Array.prototype.slice.call(arguments, 0), (function (t, r) {
        if ("string" != typeof t) throw new TypeError("Arguments to path.join must be strings");
        return t
    })).join("/"))
}

function l(t, r) {
    function e(t) {
        for (var r = 0; r < t.length && "" === t[r]; r++) ;
        for (var e = t.length - 1; e >= 0 && "" === t[e]; e--) ;
        return r > e ? [] : t.slice(r, e - r + 1)
    }

    t = s(t).substr(1), r = s(r).substr(1);
    for (var n = e(t.split("/")), i = e(r.split("/")), o = Math.min(n.length, i.length), u = o, l = 0; l < o; l++) if (n[l] !== i[l]) {
        u = l;
        break
    }
    let a = [];
    for (l = u; l < n.length; l++) a.push("..");
    return (a = a.concat(i.slice(u))).join("/")
}

function a(t) {
    const r = n(t), e = r[0];
    let s = r[1];
    return e || s ? (s && (s = s.substr(0, s.length - 1)), e + s) : "."
}

function f(t, r) {
    let e = n(t)[2];
    return r && e.substr(-1 * r.length) === r && (e = e.substr(0, e.length - r.length)), e
}

function c(t) {
    return n(t)[3]
}

const p = {
    extname: c,
    basename: f,
    dirname: a,
    sep: "/",
    delimiter: ":",
    relative: l,
    join: u,
    isAbsolute: o,
    normalize: i,
    resolve: s
};

function h(t, r) {
    if (t.filter) return t.filter(r);
    for (var e = [], n = 0; n < t.length; n++) r(t[n], n, t) && e.push(t[n]);
    return e
}

var g = "b" === "ab".substr(-1) ? function (t, r, e) {
    return t.substr(r, e)
} : function (t, r, e) {
    return r < 0 && (r = t.length + r), t.substr(r, e)
};
const b = t(Object.freeze({
    __proto__: null,
    resolve: s,
    normalize: i,
    isAbsolute: o,
    join: u,
    relative: l,
    sep: "/",
    delimiter: ":",
    dirname: a,
    basename: f,
    extname: c,
    default: p
}));
const v = function (t) {
    if ("string" != typeof t || t.length <= 7 || "file://" !== t.substring(0, 7)) throw new TypeError("must pass in a file:// URI to convert to a file path");
    const r = decodeURI(t.substring(7)), e = r.indexOf("/");
    let n = r.substring(0, e), s = r.substring(e + 1);
    return "localhost" === n && (n = ""), n && (n = b.sep + b.sep + n), s = s.replace(/^(.+)\|/, "$1:"), "\\" === b.sep && (s = s.replace(/\//g, "\\")), /^.+:/.test(s) || (s = b.sep + s), n + s
};
export {v as fileURLToPath, v as default};