!function(){var e={806:function(e,t,n){e.exports=n(642)},107:function(e,t,n){"use strict";var r=n(320),o=n(135),i=n(211),s=n(610),a=n(28),c=n(77),u=n(734),f=n(226);e.exports=function(e){return new Promise((function(t,n){var l=e.data,d=e.headers;r.isFormData(l)&&delete d["Content-Type"];var p=new XMLHttpRequest;if(e.auth){var h=e.auth.username||"",m=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";d.Authorization="Basic "+btoa(h+":"+m)}var v=a(e.baseURL,e.url);if(p.open(e.method.toUpperCase(),s(v,e.params,e.paramsSerializer),!0),p.timeout=e.timeout,p.onreadystatechange=function(){if(p&&4===p.readyState&&(0!==p.status||p.responseURL&&0===p.responseURL.indexOf("file:"))){var r="getAllResponseHeaders"in p?c(p.getAllResponseHeaders()):null,i={data:e.responseType&&"text"!==e.responseType?p.response:p.responseText,status:p.status,statusText:p.statusText,headers:r,config:e,request:p};o(t,n,i),p=null}},p.onabort=function(){p&&(n(f("Request aborted",e,"ECONNABORTED",p)),p=null)},p.onerror=function(){n(f("Network Error",e,null,p)),p=null},p.ontimeout=function(){var t="timeout of "+e.timeout+"ms exceeded";e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),n(f(t,e,"ECONNABORTED",p)),p=null},r.isStandardBrowserEnv()){var g=(e.withCredentials||u(v))&&e.xsrfCookieName?i.read(e.xsrfCookieName):void 0;g&&(d[e.xsrfHeaderName]=g)}if("setRequestHeader"in p&&r.forEach(d,(function(e,t){void 0===l&&"content-type"===t.toLowerCase()?delete d[t]:p.setRequestHeader(t,e)})),r.isUndefined(e.withCredentials)||(p.withCredentials=!!e.withCredentials),e.responseType)try{p.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&p.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&p.upload&&p.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then((function(e){p&&(p.abort(),n(e),p=null)})),l||(l=null),p.send(l)}))}},642:function(e,t,n){"use strict";var r=n(320),o=n(692),i=n(108),s=n(163);function a(e){var t=new i(e),n=o(i.prototype.request,t);return r.extend(n,i.prototype,t),r.extend(n,t),n}var c=a(n(285));c.Axios=i,c.create=function(e){return a(s(c.defaults,e))},c.Cancel=n(7),c.CancelToken=n(476),c.isCancel=n(448),c.all=function(e){return Promise.all(e)},c.spread=n(166),c.isAxiosError=n(99),e.exports=c,e.exports.default=c},7:function(e){"use strict";function t(e){this.message=e}t.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},t.prototype.__CANCEL__=!0,e.exports=t},476:function(e,t,n){"use strict";var r=n(7);function o(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise((function(e){t=e}));var n=this;e((function(e){n.reason||(n.reason=new r(e),t(n.reason))}))}o.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},o.source=function(){var e;return{token:new o((function(t){e=t})),cancel:e}},e.exports=o},448:function(e){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},108:function(e,t,n){"use strict";var r=n(320),o=n(610),i=n(60),s=n(756),a=n(163);function c(e){this.defaults=e,this.interceptors={request:new i,response:new i}}c.prototype.request=function(e){"string"==typeof e?(e=arguments[1]||{}).url=arguments[0]:e=e||{},(e=a(this.defaults,e)).method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var t=[s,void 0],n=Promise.resolve(e);for(this.interceptors.request.forEach((function(e){t.unshift(e.fulfilled,e.rejected)})),this.interceptors.response.forEach((function(e){t.push(e.fulfilled,e.rejected)}));t.length;)n=n.then(t.shift(),t.shift());return n},c.prototype.getUri=function(e){return e=a(this.defaults,e),o(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")},r.forEach(["delete","get","head","options"],(function(e){c.prototype[e]=function(t,n){return this.request(a(n||{},{method:e,url:t,data:(n||{}).data}))}})),r.forEach(["post","put","patch"],(function(e){c.prototype[e]=function(t,n,r){return this.request(a(r||{},{method:e,url:t,data:n}))}})),e.exports=c},60:function(e,t,n){"use strict";var r=n(320);function o(){this.handlers=[]}o.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},o.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},o.prototype.forEach=function(e){r.forEach(this.handlers,(function(t){null!==t&&e(t)}))},e.exports=o},28:function(e,t,n){"use strict";var r=n(900),o=n(787);e.exports=function(e,t){return e&&!r(t)?o(e,t):t}},226:function(e,t,n){"use strict";var r=n(669);e.exports=function(e,t,n,o,i){var s=new Error(e);return r(s,t,n,o,i)}},756:function(e,t,n){"use strict";var r=n(320),o=n(725),i=n(448),s=n(285);function a(e){e.cancelToken&&e.cancelToken.throwIfRequested()}e.exports=function(e){return a(e),e.headers=e.headers||{},e.data=o(e.data,e.headers,e.transformRequest),e.headers=r.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),r.forEach(["delete","get","head","post","put","patch","common"],(function(t){delete e.headers[t]})),(e.adapter||s.adapter)(e).then((function(t){return a(e),t.data=o(t.data,t.headers,e.transformResponse),t}),(function(t){return i(t)||(a(e),t&&t.response&&(t.response.data=o(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)}))}},669:function(e){"use strict";e.exports=function(e,t,n,r,o){return e.config=t,n&&(e.code=n),e.request=r,e.response=o,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e}},163:function(e,t,n){"use strict";var r=n(320);e.exports=function(e,t){t=t||{};var n={},o=["url","method","data"],i=["headers","auth","proxy","params"],s=["baseURL","transformRequest","transformResponse","paramsSerializer","timeout","timeoutMessage","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","decompress","maxContentLength","maxBodyLength","maxRedirects","transport","httpAgent","httpsAgent","cancelToken","socketPath","responseEncoding"],a=["validateStatus"];function c(e,t){return r.isPlainObject(e)&&r.isPlainObject(t)?r.merge(e,t):r.isPlainObject(t)?r.merge({},t):r.isArray(t)?t.slice():t}function u(o){r.isUndefined(t[o])?r.isUndefined(e[o])||(n[o]=c(void 0,e[o])):n[o]=c(e[o],t[o])}r.forEach(o,(function(e){r.isUndefined(t[e])||(n[e]=c(void 0,t[e]))})),r.forEach(i,u),r.forEach(s,(function(o){r.isUndefined(t[o])?r.isUndefined(e[o])||(n[o]=c(void 0,e[o])):n[o]=c(void 0,t[o])})),r.forEach(a,(function(r){r in t?n[r]=c(e[r],t[r]):r in e&&(n[r]=c(void 0,e[r]))}));var f=o.concat(i).concat(s).concat(a),l=Object.keys(e).concat(Object.keys(t)).filter((function(e){return-1===f.indexOf(e)}));return r.forEach(l,u),n}},135:function(e,t,n){"use strict";var r=n(226);e.exports=function(e,t,n){var o=n.config.validateStatus;n.status&&o&&!o(n.status)?t(r("Request failed with status code "+n.status,n.config,null,n.request,n)):e(n)}},725:function(e,t,n){"use strict";var r=n(320);e.exports=function(e,t,n){return r.forEach(n,(function(n){e=n(e,t)})),e}},285:function(e,t,n){"use strict";var r=n(320),o=n(554),i={"Content-Type":"application/x-www-form-urlencoded"};function s(e,t){!r.isUndefined(e)&&r.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var a,c={adapter:(("undefined"!=typeof XMLHttpRequest||"undefined"!=typeof process&&"[object process]"===Object.prototype.toString.call(process))&&(a=n(107)),a),transformRequest:[function(e,t){return o(t,"Accept"),o(t,"Content-Type"),r.isFormData(e)||r.isArrayBuffer(e)||r.isBuffer(e)||r.isStream(e)||r.isFile(e)||r.isBlob(e)?e:r.isArrayBufferView(e)?e.buffer:r.isURLSearchParams(e)?(s(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):r.isObject(e)?(s(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};r.forEach(["delete","get","head"],(function(e){c.headers[e]={}})),r.forEach(["post","put","patch"],(function(e){c.headers[e]=r.merge(i)})),e.exports=c},692:function(e){"use strict";e.exports=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}}},610:function(e,t,n){"use strict";var r=n(320);function o(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}e.exports=function(e,t,n){if(!t)return e;var i;if(n)i=n(t);else if(r.isURLSearchParams(t))i=t.toString();else{var s=[];r.forEach(t,(function(e,t){null!=e&&(r.isArray(e)?t+="[]":e=[e],r.forEach(e,(function(e){r.isDate(e)?e=e.toISOString():r.isObject(e)&&(e=JSON.stringify(e)),s.push(o(t)+"="+o(e))})))})),i=s.join("&")}if(i){var a=e.indexOf("#");-1!==a&&(e=e.slice(0,a)),e+=(-1===e.indexOf("?")?"?":"&")+i}return e}},787:function(e){"use strict";e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},211:function(e,t,n){"use strict";var r=n(320);e.exports=r.isStandardBrowserEnv()?{write:function(e,t,n,o,i,s){var a=[];a.push(e+"="+encodeURIComponent(t)),r.isNumber(n)&&a.push("expires="+new Date(n).toGMTString()),r.isString(o)&&a.push("path="+o),r.isString(i)&&a.push("domain="+i),!0===s&&a.push("secure"),document.cookie=a.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},900:function(e){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},99:function(e){"use strict";e.exports=function(e){return"object"==typeof e&&!0===e.isAxiosError}},734:function(e,t,n){"use strict";var r=n(320);e.exports=r.isStandardBrowserEnv()?function(){var e,t=/(msie|trident)/i.test(navigator.userAgent),n=document.createElement("a");function o(e){var r=e;return t&&(n.setAttribute("href",r),r=n.href),n.setAttribute("href",r),{href:n.href,protocol:n.protocol?n.protocol.replace(/:$/,""):"",host:n.host,search:n.search?n.search.replace(/^\?/,""):"",hash:n.hash?n.hash.replace(/^#/,""):"",hostname:n.hostname,port:n.port,pathname:"/"===n.pathname.charAt(0)?n.pathname:"/"+n.pathname}}return e=o(window.location.href),function(t){var n=r.isString(t)?o(t):t;return n.protocol===e.protocol&&n.host===e.host}}():function(){return!0}},554:function(e,t,n){"use strict";var r=n(320);e.exports=function(e,t){r.forEach(e,(function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])}))}},77:function(e,t,n){"use strict";var r=n(320),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var t,n,i,s={};return e?(r.forEach(e.split("\n"),(function(e){if(i=e.indexOf(":"),t=r.trim(e.substr(0,i)).toLowerCase(),n=r.trim(e.substr(i+1)),t){if(s[t]&&o.indexOf(t)>=0)return;s[t]="set-cookie"===t?(s[t]?s[t]:[]).concat([n]):s[t]?s[t]+", "+n:n}})),s):s}},166:function(e){"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}},320:function(e,t,n){"use strict";var r=n(692),o=Object.prototype.toString;function i(e){return"[object Array]"===o.call(e)}function s(e){return void 0===e}function a(e){return null!==e&&"object"==typeof e}function c(e){if("[object Object]"!==o.call(e))return!1;var t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}function u(e){return"[object Function]"===o.call(e)}function f(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),i(e))for(var n=0,r=e.length;n<r;n++)t.call(null,e[n],n,e);else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e)}e.exports={isArray:i,isArrayBuffer:function(e){return"[object ArrayBuffer]"===o.call(e)},isBuffer:function(e){return null!==e&&!s(e)&&null!==e.constructor&&!s(e.constructor)&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)},isFormData:function(e){return"undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:a,isPlainObject:c,isUndefined:s,isDate:function(e){return"[object Date]"===o.call(e)},isFile:function(e){return"[object File]"===o.call(e)},isBlob:function(e){return"[object Blob]"===o.call(e)},isFunction:u,isStream:function(e){return a(e)&&u(e.pipe)},isURLSearchParams:function(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&"undefined"!=typeof window&&"undefined"!=typeof document},forEach:f,merge:function e(){var t={};function n(n,r){c(t[r])&&c(n)?t[r]=e(t[r],n):c(n)?t[r]=e({},n):i(n)?t[r]=n.slice():t[r]=n}for(var r=0,o=arguments.length;r<o;r++)f(arguments[r],n);return t},extend:function(e,t,n){return f(t,(function(t,o){e[o]=n&&"function"==typeof t?r(t,n):t})),e},trim:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")},stripBOM:function(e){return 65279===e.charCodeAt(0)&&(e=e.slice(1)),e}}}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,n),i.exports}!function(){"use strict";function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function t(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var r=function(){function n(e,r){var o=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),t(this,"satelliteVector",(function(e,t){var n=o.satrecToXYZ(e,t),r=n[0],i=n[1],s=Math.cos(i),a=(n[2]+6371)/6371*228;return new THREE.Vector3(a*s*Math.cos(r),a*s*Math.sin(r),a*Math.sin(i))})),t(this,"satrecToXYZ",(function(e,t){var n=satellite.propagate(e,t),r=satellite.gstime(t),o=satellite.eciToGeodetic(n.position,r);return[o.longitude,o.latitude,o.height]})),this.tleArr=e,this.audioCtx=r,this.satRecs=[],this.satOscillators=[],this.addSatellites(),this.t=0,window.rate=1,this.activeClock=this.clock().rate(window.rate).date((new Date).getTime()),window.clock=this.activeClock}var r,o;return r=n,(o=[{key:"clock",value:function(){var e=60,t=(new Date).getTime(),n=0;function r(){}return r.date=function(o){return arguments.length?(t=o,r):t+n*e},r.elapsed=function(e){return arguments.length?(n=e,r):t-(new Date).getTime()},r.rate=function(t){return arguments.length?(e=t,r):e},r}},{key:"addSatellites",value:function(){for(var e=0;e<this.tleArr.length;e++){var t=satellite.twoline2satrec(this.tleArr[e].split("\n")[0].trim(),this.tleArr[e].split("\n")[1].trim());this.satRecs.push(t),e<256&&this.createSatelliteOsc(t)}}},{key:"createSatelliteOsc",value:function(e){var t=this.audioCtx.createOscillator();t.type="sine",t.frequency.value=100;var n=this.audioCtx.createGain();n.gain.value=.01,n.connect(this.audioCtx.destination),t.connect(n),t.start(0),this.satOscillators.push(t)}},{key:"updateSatelliteOsc",value:function(e,t){var n=Math.sqrt(Math.pow(e.x,2)+Math.pow(e.y,2)+Math.pow(e.z,2));this.satOscillators[t].frequency.value=n,this.satOscillators[t]}},{key:"start",value:function(){var e=this,t=new THREE.Scene,n=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3),r=new Date,o=document.getElementById("canvas"),i=new THREE.WebGLRenderer({antialias:!0,canvas:o});i.setSize(window.innerWidth,window.innerHeight),i.setClearColor(65520,0);var s=new THREE.SphereGeometry(200,32,32),a=new THREE.WireframeGeometry(s),c=new THREE.LineSegments(a);c.material.depthTest=!1,c.material.transparent=!0,t.add(c);var u=new THREE.Geometry,f=this.satelliteVector;u.vertices=this.satRecs.map((function(e){return f(e,r)}));var l=new THREE.Points(u,new THREE.PointsMaterial({color:"green",size:4}));t.add(l),n.position.z=700,n.position.x=0,n.position.y=0;var d=this.satRecs,p=this.activeClock;!function r(o){var s=new Date(p.elapsed(o).date());requestAnimationFrame(r),c.rotation.y+=1/86400*window.rate;for(var a=0;a<d.length;a++)l.geometry.vertices[a]=f(d[a],s),a<256&&e.updateSatelliteOsc(l.geometry.vertices[a],a);l.geometry.verticesNeedUpdate=!0,i.render(t,n)}(this.t)}}])&&e(r.prototype,o),n}(),o=n(806).get("/satellites/tle").then((function(e){for(var t=e.data.split("\r\n"),n=[],r=0;r<t.length-2;r+=3){var o=t[r+1].concat(" ","\n"," ",t[r+2]);n.push(o)}return n})).catch((function(e){console.log(e)}));window.addEventListener("DOMContentLoaded",(function(e){var t,n,i=document.getElementById("canvas"),s=new AudioContext;t=s,document.getElementById("abt-btn").addEventListener("click",(function(){console.log("button clicked"),document.getElementById("overlay").classList.add("is-visible"),document.getElementById("abt-modal").classList.add("is-visible")})),document.getElementById("close-btn").addEventListener("click",(function(){document.getElementById("overlay").classList.remove("is-visible"),document.getElementById("abt-modal").classList.remove("is-visible")})),document.getElementById("overlay").addEventListener("click",(function(){document.getElementById("overlay").classList.remove("is-visible"),document.getElementById("abt-modal").classList.remove("is-visible")})),function(e){var t=e;document.getElementById("play_pause").addEventListener("click",(function(){if(console.log("clicked"),"suspended"===t.state){t.resume();var e=t.createOscillator();e.type="square",e.frequency.value=440,e.start(0)}else t.suspend()}),!1)}(t),(n=document.getElementById("playback-slider")).addEventListener("change",(function(){var e=n.value;window.clock.rate(e),window.rate=e}),!1),o.then((function(e){i.width=window.innerWidth,i.height=window.innerHeight,new r(e,s).start()}))}))}()}();
//# sourceMappingURL=main.js.map