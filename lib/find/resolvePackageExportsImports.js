/*
 * MIT License
 *
 * Copyright (c) Hiroki Osame <hiroki.osame@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * see https://www.npmjs.com/package/resolve-pkg-maps
 */
const A=r=>r!==null&&typeof r=="object",a=(r,t)=>Object.assign(new Error(`[${r}]: ${t}`),{code:r}),_="ERR_INVALID_PACKAGE_CONFIG",E="ERR_INVALID_PACKAGE_TARGET",I="ERR_PACKAGE_PATH_NOT_EXPORTED",P="ERR_PACKAGE_IMPORT_NOT_DEFINED",R=/^\d+$/,O=/^(\.{1,2}|node_modules)$/i,w=/\/|\\/;var h=(r=>(r.Export="exports",r.Import="imports",r))(h||{});const f=(r,t,e,o,c)=>{if(t==null)return[];if(typeof t=="string"){const[n,...i]=t.split(w);if(n===".."||i.some(l=>O.test(l)))throw a(E,`Invalid "${r}" target "${t}" defined in the package config`);return[c?t.replace(/\*/g,c):t]}if(Array.isArray(t))return t.flatMap(n=>f(r,n,e,o,c));if(A(t)){for(const n of Object.keys(t)){if(R.test(n))throw a(_,"Cannot contain numeric property keys");if(n==="default"||o.includes(n))return f(r,t[n],e,o,c)}return[]}throw a(E,`Invalid "${r}" target "${t}"`)},s="*",m=(r,t)=>{const e=r.indexOf(s),o=t.indexOf(s);return e===o?t.length>r.length:o>e};function d(r,t){if(!t.includes(s)&&r.hasOwnProperty(t))return[t];let e,o;for(const c of Object.keys(r))if(c.includes(s)){const[n,i,l]=c.split(s);if(l===void 0&&t.startsWith(n)&&t.endsWith(i)){const g=t.slice(n.length,-i.length||void 0);g&&(!e||m(e,c))&&(e=c,o=g)}}return[e,o]}const p=r=>Object.keys(r).reduce((t,e)=>{const o=e===""||e[0]!==".";if(t===void 0||t===o)return o;throw a(_,'"exports" cannot contain some keys starting with "." and some not')},void 0),u=/^\w+:/,v=(r,t,e)=>{if(!r)throw new Error('"exports" is required');t=t===""?".":`./${t}`,(typeof r=="string"||Array.isArray(r)||A(r)&&p(r))&&(r={".":r});const[o,c]=d(r,t),n=f(h.Export,r[o],t,e,c);if(n.length===0)throw a(I,t==="."?'No "exports" main defined':`Package subpath '${t}' is not defined by "exports"`);for(const i of n)if(!i.startsWith("./")&&!u.test(i))throw a(E,`Invalid "exports" target "${i}" defined in the package config`);return n},T=(r,t,e)=>{if(!r)throw new Error('"imports" is required');const[o,c]=d(r,t),n=f(h.Import,r[o],t,e,c);if(n.length===0)throw a(P,`Package import specifier "${t}" is not defined in package`);return n};export{v as resolveExports,T as resolveImports};