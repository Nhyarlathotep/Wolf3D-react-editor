!function(e){function n(n){for(var r,u,a=n[0],c=n[1],s=n[2],f=0,_=[];f<a.length;f++)u=a[f],Object.prototype.hasOwnProperty.call(o,u)&&o[u]&&_.push(o[u][0]),o[u]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);for(p&&p(n);_.length;)_.shift()();return i.push.apply(i,s||[]),t()}function t(){for(var e,n=0;n<i.length;n++){for(var t=i[n],r=!0,u=1;u<t.length;u++){var a=t[u];0!==o[a]&&(r=!1)}r&&(i.splice(n--,1),e=c(c.s=t[0]))}return e}var r={},o={1:0},i=[];var u={};var a={344:function(){return{"./wasm_wolf3D_bg.js":{__wbindgen_object_drop_ref:function(e){return r[343].exports.v(e)},__wbindgen_json_serialize:function(e,n){return r[343].exports.t(e,n)},__wbg_instanceof_Window_a633dbe0900c728a:function(e){return r[343].exports.j(e)},__wbg_document_07444f1bbea314bb:function(e){return r[343].exports.c(e)},__wbg_getElementById_633c94a971ae0eb9:function(e,n,t){return r[343].exports.e(e,n,t)},__wbg_instanceof_CanvasRenderingContext2d_06ca182218e69b94:function(e){return r[343].exports.h(e)},__wbg_putImageData_4db1713696ea6d17:function(e,n,t,o){return r[343].exports.m(e,n,t,o)},__wbg_instanceof_HtmlCanvasElement_c6a06fc9a851a478:function(e){return r[343].exports.i(e)},__wbg_setwidth_70cc14014c04df22:function(e,n){return r[343].exports.p(e,n)},__wbg_setheight_e962cc78d8658712:function(e,n){return r[343].exports.o(e,n)},__wbg_getContext_2151b76e11a6eb39:function(e,n,t){return r[343].exports.d(e,n,t)},__wbg_newwithu8clampedarrayandsh_9097fada6defc731:function(e,n,t,o){return r[343].exports.l(e,n,t,o)},__wbg_call_804d3ad7e8acd4d5:function(e,n){return r[343].exports.b(e,n)},__wbindgen_object_clone_ref:function(e){return r[343].exports.u(e)},__wbg_newnoargs_ebdc90c3d1e4e55d:function(e,n){return r[343].exports.k(e,n)},__wbg_globalThis_48a5e9494e623f26:function(){return r[343].exports.f()},__wbg_self_25067cb019cade42:function(){return r[343].exports.n()},__wbg_window_9e80200b35aa30f8:function(){return r[343].exports.q()},__wbg_global_7583a634265a91fc:function(){return r[343].exports.g()},__wbindgen_is_undefined:function(e){return r[343].exports.s(e)},__wbindgen_debug_string:function(e,n){return r[343].exports.r(e,n)},__wbindgen_throw:function(e,n){return r[343].exports.w(e,n)}}}}};function c(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,c),t.l=!0,t.exports}c.e=function(e){var n=[],t=o[e];if(0!==t)if(t)n.push(t[2]);else{var r=new Promise((function(n,r){t=o[e]=[n,r]}));n.push(t[2]=r);var i,s=document.createElement("script");s.charset="utf-8",s.timeout=120,c.nc&&s.setAttribute("nonce",c.nc),s.src=function(e){return c.p+"static/js/"+({}[e]||e)+"."+{3:"ea72f01e"}[e]+".chunk.js"}(e);var f=new Error;i=function(n){s.onerror=s.onload=null,clearTimeout(_);var t=o[e];if(0!==t){if(t){var r=n&&("load"===n.type?"missing":n.type),i=n&&n.target&&n.target.src;f.message="Loading chunk "+e+" failed.\n("+r+": "+i+")",f.name="ChunkLoadError",f.type=r,f.request=i,t[1](f)}o[e]=void 0}};var _=setTimeout((function(){i({type:"timeout",target:s})}),12e4);s.onerror=s.onload=i,document.head.appendChild(s)}return({3:[344]}[e]||[]).forEach((function(e){var t=u[e];if(t)n.push(t);else{var r,o=a[e](),i=fetch(c.p+""+{344:"4018d8a06e558ba92edb"}[e]+".module.wasm");if(o instanceof Promise&&"function"===typeof WebAssembly.compileStreaming)r=Promise.all([WebAssembly.compileStreaming(i),o]).then((function(e){return WebAssembly.instantiate(e[0],e[1])}));else if("function"===typeof WebAssembly.instantiateStreaming)r=WebAssembly.instantiateStreaming(i,o);else{r=i.then((function(e){return e.arrayBuffer()})).then((function(e){return WebAssembly.instantiate(e,o)}))}n.push(u[e]=r.then((function(n){return c.w[e]=(n.instance||n).exports})))}})),Promise.all(n)},c.m=e,c.c=r,c.d=function(e,n,t){c.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,n){if(1&n&&(e=c(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(c.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)c.d(t,r,function(n){return e[n]}.bind(null,r));return t},c.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return c.d(n,"a",n),n},c.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},c.p="/Wolf3D-react-editor/",c.oe=function(e){throw console.error(e),e},c.w={};var s=this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[],f=s.push.bind(s);s.push=n,s=s.slice();for(var _=0;_<s.length;_++)n(s[_]);var p=f;t()}([]);
//# sourceMappingURL=runtime-main.c37d4d44.js.map