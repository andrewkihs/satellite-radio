/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"_from":"axios","_id":"axios@0.21.1","_inBundle":false,"_integrity":"sha512-dKQiRHxGD9PPRIUNIWvZhPTPpl1rf/OxTYKsqKUDjBwYylTvV7SjSHJb9ratfyzM6wCdLCOYLzs73qpg5c4iGA==","_location":"/axios","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"axios","name":"axios","escapedName":"axios","rawSpec":"","saveSpec":null,"fetchSpec":"latest"},"_requiredBy":["#USER","/"],"_resolved":"https://registry.npmjs.org/axios/-/axios-0.21.1.tgz","_shasum":"22563481962f4d6bde9a76d516ef0e5d3c09b2b8","_spec":"axios","_where":"/Users/ak/Documents/cs/js_project/satellite-radio","author":{"name":"Matt Zabriskie"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"bugs":{"url":"https://github.com/axios/axios/issues"},"bundleDependencies":false,"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}],"dependencies":{"follow-redirects":"^1.10.0"},"deprecated":false,"description":"Promise based HTTP client for the browser and node.js","devDependencies":{"bundlesize":"^0.17.0","coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.0.2","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^20.1.0","grunt-karma":"^2.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^1.0.18","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^1.3.0","karma-chrome-launcher":"^2.2.0","karma-coverage":"^1.1.1","karma-firefox-launcher":"^1.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-opera-launcher":"^1.0.0","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^1.2.0","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.7","karma-webpack":"^1.7.0","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^5.2.0","sinon":"^4.5.0","typescript":"^2.8.1","url-search-params":"^0.10.0","webpack":"^1.13.1","webpack-dev-server":"^1.14.1"},"homepage":"https://github.com/axios/axios","jsdelivr":"dist/axios.min.js","keywords":["xhr","http","ajax","promise","node"],"license":"MIT","main":"index.js","name":"axios","repository":{"type":"git","url":"git+https://github.com/axios/axios.git"},"scripts":{"build":"NODE_ENV=production grunt build","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","examples":"node ./examples/server.js","fix":"eslint --fix lib/**/*.js","postversion":"git push && git push --tags","preversion":"npm test","start":"node ./sandbox/server.js","test":"grunt test && bundlesize","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"},"typings":"./index.d.ts","unpkg":"dist/axios.min.js","version":"0.21.1"}');

/***/ }),

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/http.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/adapters/http.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");

var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");

var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");

var http = __webpack_require__(/*! http */ "http");

var https = __webpack_require__(/*! https */ "https");

var httpFollow = __webpack_require__(/*! follow-redirects */ "./node_modules/follow-redirects/index.js").http;

var httpsFollow = __webpack_require__(/*! follow-redirects */ "./node_modules/follow-redirects/index.js").https;

var url = __webpack_require__(/*! url */ "url");

var zlib = __webpack_require__(/*! zlib */ "zlib");

var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");

var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

var enhanceError = __webpack_require__(/*! ../core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var isHttps = /https:?/;
/**
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} proxy
 * @param {string} location
 */

function setProxy(options, proxy, location) {
  options.hostname = proxy.host;
  options.host = proxy.host;
  options.port = proxy.port;
  options.path = location; // Basic proxy authorization

  if (proxy.auth) {
    var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
    options.headers['Proxy-Authorization'] = 'Basic ' + base64;
  } // If a proxy is used, any redirects must also pass through the proxy


  options.beforeRedirect = function beforeRedirect(redirection) {
    redirection.headers.host = redirection.host;
    setProxy(redirection, proxy, redirection.href);
  };
}
/*eslint consistent-return:0*/


module.exports = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    var resolve = function resolve(value) {
      resolvePromise(value);
    };

    var reject = function reject(value) {
      rejectPromise(value);
    };

    var data = config.data;
    var headers = config.headers; // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/axios/axios/issues/69

    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {// Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(createError('Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream', config));
      } // Add Content-Length header if data exists


      headers['Content-Length'] = data.length;
    } // HTTP basic authentication


    var auth = undefined;

    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    } // Parse url


    var fullPath = buildFullPath(config.baseURL, config.url);
    var parsed = url.parse(fullPath);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttpsRequest = isHttps.test(protocol);
    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
    var options = {
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      agents: {
        http: config.httpAgent,
        https: config.httpsAgent
      },
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;

    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];

      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
        var shouldProxy = true;

        if (noProxyEnv) {
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });
          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }

            if (proxyElement === '*') {
              return true;
            }

            if (proxyElement[0] === '.' && parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
              return true;
            }

            return parsed.hostname === proxyElement;
          });
        }

        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port,
            protocol: parsedProxyUrl.protocol
          };

          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    if (proxy) {
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      setProxy(options, proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
    }

    var transport;
    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);

    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsProxy ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }

      transport = isHttpsProxy ? httpsFollow : httpFollow;
    }

    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    } // Create the request


    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return; // uncompress the response body transparently if required

      var stream = res; // return the last request in case of redirects

      var lastRequest = res.req || req; // if no content, is HEAD request or decompress disabled we should not decompress

      if (res.statusCode !== 204 && lastRequest.method !== 'HEAD' && config.decompress !== false) {
        switch (res.headers['content-encoding']) {
          /*eslint default-case:0*/
          case 'gzip':
          case 'compress':
          case 'deflate':
            // add the unzipper to the body stream processing pipeline
            stream = stream.pipe(zlib.createUnzip()); // remove the content-encoding in order to not confuse downstream operations

            delete res.headers['content-encoding'];
            break;
        }
      }

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk); // make sure the content length is not over the maxContentLength if specified

          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded', config, null, lastRequest));
          }
        });
        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });
        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);

          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString(config.responseEncoding);

            if (!config.responseEncoding || config.responseEncoding === 'utf8') {
              responseData = utils.stripBOM(responseData);
            }
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    }); // Handle errors

    req.on('error', function handleRequestError(err) {
      if (req.aborted && err.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;
      reject(enhanceError(err, config, null, req));
    }); // Handle request timeout

    if (config.timeout) {
      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devoring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(config.timeout, function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
      });
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (req.aborted) return;
        req.abort();
        reject(cancel);
      });
    } // Send the request


    if (utils.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");

var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");

var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");

var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");

var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");

var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest(); // HTTP basic authentication

    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true); // Set the request timeout in MS

    request.timeout = config.timeout; // Listen for ready state

    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      } // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request


      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      } // Prepare the response


      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };
      settle(resolve, reject, response); // Clean up request

      request = null;
    }; // Handle browser request cancellation (as opposed to a manual cancellation)


    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request)); // Clean up request

      request = null;
    }; // Handle low level network errors


    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request)); // Clean up request

      request = null;
    }; // Handle timeout


    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';

      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }

      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED', request)); // Clean up request

      request = null;
    }; // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.


    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    } // Add headers to the request


    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    } // Add withCredentials to request if needed


    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    } // Add responseType to request if needed


    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    } // Handle progress if needed


    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    } // Not all browsers support upload events


    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel); // Clean up request

        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    } // Send the request


    request.send(requestData);
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");

var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");

var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */


function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context); // Copy axios.prototype to instance

  utils.extend(instance, Axios.prototype, context); // Copy context to instance

  utils.extend(instance, context);
  return instance;
} // Create the default instance to be exported


var axios = createInstance(defaults); // Expose Axios class to allow class inheritance

axios.Axios = Axios; // Factory for creating new instances

axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
}; // Expose Cancel & CancelToken


axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js"); // Expose all/spread

axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js"); // Expose isAxiosError

axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");
module.exports = axios; // Allow use of default import syntax in TypeScript

module.exports.default = axios;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */

function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;
module.exports = Cancel;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */


function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });
  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}
/**
 * Throws a `Cancel` if cancellation has been requested.
 */


CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};
/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */


CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");

var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");

var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");

var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */


function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */


Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config); // Set config.method

  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  } // Hook up interceptors middleware


  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
}; // Provide aliases for supported request methods


utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});
module.exports = Axios;

/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}
/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */


InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};
/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */


InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */


InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");

var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");
/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */


module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }

  return requestedURL;
};

/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");
/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */


module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");

var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
/**
 * Throws a `Cancel` if cancellation has been requested.
 */


function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}
/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */


module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config); // Ensure headers exist

  config.headers = config.headers || {}; // Transform request data

  config.data = transformData(config.data, config.headers, config.transformRequest); // Flatten headers

  config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
  utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
    delete config.headers[method];
  });
  var adapter = config.adapter || defaults.adapter;
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config); // Transform response data

    response.data = transformData(response.data, response.headers, config.transformResponse);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config); // Transform response data

      if (reason && reason.response) {
        reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
      }
    }

    return Promise.reject(reason);
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */

module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;

  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };

  return error;
};

/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");
/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */


module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};
  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = ['baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer', 'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName', 'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress', 'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent', 'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }

    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });
  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);
  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });
  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });
  var axiosKeys = valueFromConfig2Keys.concat(mergeDeepPropertiesKeys).concat(defaultToConfig2Keys).concat(directMergeKeys);
  var otherKeys = Object.keys(config1).concat(Object.keys(config2)).filter(function filterAxiosKeys(key) {
    return axiosKeys.indexOf(key) === -1;
  });
  utils.forEach(otherKeys, mergeDeepProperties);
  return config;
};

/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");
/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */


module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;

  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response));
  }
};

/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */


module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });
  return data;
};

/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");

var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;

  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/http.js");
  }

  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),
  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
      return data;
    }

    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }

    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }

    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }

    return data;
  }],
  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        /* Ignore */
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  maxBodyLength: -1,
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};
defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});
module.exports = defaults;

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    return fn.apply(thisArg, args);
  };
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}
/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */


module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];
    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }

        parts.push(encode(key) + '=' + encode(v));
      });
    });
    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */

module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = utils.isStandardBrowserEnv() ? // Standard browser envs support document.cookie
function standardBrowserEnv() {
  return {
    write: function write(name, value, expires, path, domain, secure) {
      var cookie = [];
      cookie.push(name + '=' + encodeURIComponent(value));

      if (utils.isNumber(expires)) {
        cookie.push('expires=' + new Date(expires).toGMTString());
      }

      if (utils.isString(path)) {
        cookie.push('path=' + path);
      }

      if (utils.isString(domain)) {
        cookie.push('domain=' + domain);
      }

      if (secure === true) {
        cookie.push('secure');
      }

      document.cookie = cookie.join('; ');
    },
    read: function read(name) {
      var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove: function remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  };
}() : // Non standard browser env (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return {
    write: function write() {},
    read: function read() {
      return null;
    },
    remove: function remove() {}
  };
}();

/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */

module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */

module.exports = function isAxiosError(payload) {
  return typeof payload === 'object' && payload.isAxiosError === true;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = utils.isStandardBrowserEnv() ? // Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
function standardBrowserEnv() {
  var msie = /(msie|trident)/i.test(navigator.userAgent);
  var urlParsingNode = document.createElement('a');
  var originURL;
  /**
  * Parse a URL to discover it's components
  *
  * @param {String} url The URL to be parsed
  * @returns {Object}
  */

  function resolveURL(url) {
    var href = url;

    if (msie) {
      // IE needs attribute set twice to normalize properties
      urlParsingNode.setAttribute('href', href);
      href = urlParsingNode.href;
    }

    urlParsingNode.setAttribute('href', href); // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils

    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
    };
  }

  originURL = resolveURL(window.location.href);
  /**
  * Determine if a URL shares the same origin as the current location
  *
  * @param {String} requestURL The URL to test
  * @returns {boolean} True if URL shares the same origin, otherwise false
  */

  return function isURLSameOrigin(requestURL) {
    var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
  };
}() : // Non standard browser envs (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return function isURLSameOrigin() {
    return true;
  };
}();

/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js"); // Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers


var ignoreDuplicateOf = ['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent'];
/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */

module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) {
    return parsed;
  }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }

      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });
  return parsed;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */

module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
/*global toString:true*/
// utils is a library of generic helper functions non-specific to axios


var toString = Object.prototype.toString;
/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */

function isArray(val) {
  return toString.call(val) === '[object Array]';
}
/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */


function isUndefined(val) {
  return typeof val === 'undefined';
}
/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */


function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}
/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */


function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}
/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */


function isFormData(val) {
  return typeof FormData !== 'undefined' && val instanceof FormData;
}
/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */


function isArrayBufferView(val) {
  var result;

  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && val.buffer instanceof ArrayBuffer;
  }

  return result;
}
/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */


function isString(val) {
  return typeof val === 'string';
}
/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */


function isNumber(val) {
  return typeof val === 'number';
}
/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */


function isObject(val) {
  return val !== null && typeof val === 'object';
}
/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */


function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}
/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */


function isDate(val) {
  return toString.call(val) === '[object Date]';
}
/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */


function isFile(val) {
  return toString.call(val) === '[object File]';
}
/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */


function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}
/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */


function isFunction(val) {
  return toString.call(val) === '[object Function]';
}
/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */


function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}
/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */


function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}
/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */


function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}
/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */


function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' || navigator.product === 'NativeScript' || navigator.product === 'NS')) {
    return false;
  }

  return typeof window !== 'undefined' && typeof document !== 'undefined';
}
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */


function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  } // Force an array if not already something iterable


  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */


function merge()
/* obj1, obj2, obj3, ... */
{
  var result = {};

  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }

  return result;
}
/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */


function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */


function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }

  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

/***/ }),

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/debug/src/browser.js ***!
  \*******************************************/
/***/ ((module, exports, __webpack_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

exports.destroy = (() => {
  let warned = false;
  return () => {
    if (!warned) {
      warned = true;
      console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
    }
  };
})();
/**
 * Colors.
 */


exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  const c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  let index = 0;
  let lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, match => {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */


exports.log = console.debug || console.log || (() => {});
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  let r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  } // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = __webpack_require__(/*! ./common */ "./node_modules/debug/src/common.js")(exports);
const {
  formatters
} = module.exports;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};

/***/ }),

/***/ "./node_modules/debug/src/common.js":
/*!******************************************!*\
  !*** ./node_modules/debug/src/common.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = __webpack_require__(/*! ms */ "./node_modules/ms/index.js");
  createDebug.destroy = destroy;
  Object.keys(env).forEach(key => {
    createDebug[key] = env[key];
  });
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    let hash = 0;

    for (let i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */

  function createDebug(namespace) {
    let prevTime;
    let enableOverride = null;

    function debug(...args) {
      // Disabled?
      if (!debug.enabled) {
        return;
      }

      const self = debug; // Set `diff` timestamp

      const curr = Number(new Date());
      const ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      let index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return '%';
        }

        index++;
        const formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          const val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      const logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.useColors = createDebug.useColors();
    debug.color = createDebug.selectColor(namespace);
    debug.extend = extend;
    debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

    Object.defineProperty(debug, 'enabled', {
      enumerable: true,
      configurable: false,
      get: () => enableOverride === null ? createDebug.enabled(namespace) : enableOverride,
      set: v => {
        enableOverride = v;
      }
    }); // Env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    return debug;
  }

  function extend(namespace, delimiter) {
    const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
    newDebug.log = this.log;
    return newDebug;
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */


  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.names = [];
    createDebug.skips = [];
    let i;
    const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    const len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }
  }
  /**
  * Disable debug output.
  *
  * @return {String} namespaces
  * @api public
  */


  function disable() {
    const namespaces = [...createDebug.names.map(toNamespace), ...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)].join(',');
    createDebug.enable('');
    return namespaces;
  }
  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */


  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    let i;
    let len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }
  /**
  * Convert regexp to namespace
  *
  * @param {RegExp} regxep
  * @return {String} namespace
  * @api private
  */


  function toNamespace(regexp) {
    return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
  }
  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */


  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }
  /**
  * XXX DO NOT USE. This is a temporary stub function.
  * XXX It WILL be removed in the next major release.
  */


  function destroy() {
    console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

module.exports = setup;

/***/ }),

/***/ "./node_modules/debug/src/index.js":
/*!*****************************************!*\
  !*** ./node_modules/debug/src/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */
if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
  module.exports = __webpack_require__(/*! ./browser.js */ "./node_modules/debug/src/browser.js");
} else {
  module.exports = __webpack_require__(/*! ./node.js */ "./node_modules/debug/src/node.js");
}

/***/ }),

/***/ "./node_modules/debug/src/node.js":
/*!****************************************!*\
  !*** ./node_modules/debug/src/node.js ***!
  \****************************************/
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */
const tty = __webpack_require__(/*! tty */ "tty");

const util = __webpack_require__(/*! util */ "util");
/**
 * This is the Node.js implementation of `debug()`.
 */


exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(() => {}, 'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
  // Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
  // eslint-disable-next-line import/no-extraneous-dependencies
  const supportsColor = __webpack_require__(/*! supports-color */ "./node_modules/supports-color/index.js");

  if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
    exports.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221];
  }
} catch (error) {// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}
/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */


exports.inspectOpts = Object.keys(process.env).filter(key => {
  return /^debug_/i.test(key);
}).reduce((obj, key) => {
  // Camel-case
  const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
    return k.toUpperCase();
  }); // Coerce string value into JS value

  let val = process.env[key];

  if (/^(yes|on|true|enabled)$/i.test(val)) {
    val = true;
  } else if (/^(no|off|false|disabled)$/i.test(val)) {
    val = false;
  } else if (val === 'null') {
    val = null;
  } else {
    val = Number(val);
  }

  obj[prop] = val;
  return obj;
}, {});
/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
}
/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  const {
    namespace: name,
    useColors
  } = this;

  if (useColors) {
    const c = this.color;
    const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
    const prefix = `  ${colorCode};1m${name} \u001B[0m`;
    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  }

  return new Date().toISOString() + ' ';
}
/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */


function log(...args) {
  return process.stderr.write(util.format(...args) + '\n');
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  if (namespaces) {
    process.env.DEBUG = namespaces;
  } else {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  return process.env.DEBUG;
}
/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */


function init(debug) {
  debug.inspectOpts = {};
  const keys = Object.keys(exports.inspectOpts);

  for (let i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

module.exports = __webpack_require__(/*! ./common */ "./node_modules/debug/src/common.js")(exports);
const {
  formatters
} = module.exports;
/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts).split('\n').map(str => str.trim()).join(' ');
};
/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */


formatters.O = function (v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/***/ }),

/***/ "./node_modules/follow-redirects/debug.js":
/*!************************************************!*\
  !*** ./node_modules/follow-redirects/debug.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var debug;

module.exports = function () {
  if (!debug) {
    try {
      /* eslint global-require: off */
      debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/index.js")("follow-redirects");
    } catch (error) {
      debug = function () {
        /* */
      };
    }
  }

  debug.apply(null, arguments);
};

/***/ }),

/***/ "./node_modules/follow-redirects/index.js":
/*!************************************************!*\
  !*** ./node_modules/follow-redirects/index.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var url = __webpack_require__(/*! url */ "url");

var URL = url.URL;

var http = __webpack_require__(/*! http */ "http");

var https = __webpack_require__(/*! https */ "https");

var Writable = __webpack_require__(/*! stream */ "stream").Writable;

var assert = __webpack_require__(/*! assert */ "assert");

var debug = __webpack_require__(/*! ./debug */ "./node_modules/follow-redirects/debug.js"); // Create handlers that pass events from native requests


var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
var eventHandlers = Object.create(null);
events.forEach(function (event) {
  eventHandlers[event] = function (arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
}); // Error types with codes

var RedirectionError = createErrorType("ERR_FR_REDIRECTION_FAILURE", "");
var TooManyRedirectsError = createErrorType("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded");
var MaxBodyLengthExceededError = createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit");
var WriteAfterEndError = createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end"); // An HTTP(S) request that can be redirected

function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);

  this._sanitizeOptions(options);

  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = []; // Attach a callback if passed

  if (responseCallback) {
    this.on("response", responseCallback);
  } // React to responses of native requests


  var self = this;

  this._onNativeResponse = function (response) {
    self._processResponse(response);
  }; // Perform the first request


  this._performRequest();
}

RedirectableRequest.prototype = Object.create(Writable.prototype);

RedirectableRequest.prototype.abort = function () {
  abortRequest(this._currentRequest);
  this.emit("abort");
}; // Writes buffered data to the current native request


RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Writing is not allowed if end has been called
  if (this._ending) {
    throw new WriteAfterEndError();
  } // Validate input and shift parameters if necessary


  if (!(typeof data === "string" || typeof data === "object" && "length" in data)) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }

  if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  } // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066


  if (data.length === 0) {
    if (callback) {
      callback();
    }

    return;
  } // Only write when we don't exceed the maximum body length


  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;

    this._requestBodyBuffers.push({
      data: data,
      encoding: encoding
    });

    this._currentRequest.write(data, encoding, callback);
  } // Error when we exceed the maximum body length
  else {
      this.emit("error", new MaxBodyLengthExceededError());
      this.abort();
    }
}; // Ends the current native request


RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (typeof data === "function") {
    callback = data;
    data = encoding = null;
  } else if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  } // Write data if needed and end


  if (!data) {
    this._ended = this._ending = true;

    this._currentRequest.end(null, null, callback);
  } else {
    var self = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function () {
      self._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
}; // Sets a header value on the current native request


RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;

  this._currentRequest.setHeader(name, value);
}; // Clears a header value on the current native request


RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];

  this._currentRequest.removeHeader(name);
}; // Global timeout for all underlying requests


RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
  var self = this;

  if (callback) {
    this.on("timeout", callback);
  }

  function destroyOnTimeout(socket) {
    socket.setTimeout(msecs);
    socket.removeListener("timeout", socket.destroy);
    socket.addListener("timeout", socket.destroy);
  } // Sets up a timer to trigger a timeout event


  function startTimer(socket) {
    if (self._timeout) {
      clearTimeout(self._timeout);
    }

    self._timeout = setTimeout(function () {
      self.emit("timeout");
      clearTimer();
    }, msecs);
    destroyOnTimeout(socket);
  } // Prevent a timeout from triggering


  function clearTimer() {
    clearTimeout(this._timeout);

    if (callback) {
      self.removeListener("timeout", callback);
    }

    if (!this.socket) {
      self._currentRequest.removeListener("socket", startTimer);
    }
  } // Start the timer when the socket is opened


  if (this.socket) {
    startTimer(this.socket);
  } else {
    this._currentRequest.once("socket", startTimer);
  }

  this.on("socket", destroyOnTimeout);
  this.once("response", clearTimer);
  this.once("error", clearTimer);
  return this;
}; // Proxy all other public ClientRequest methods


["flushHeaders", "getHeader", "setNoDelay", "setSocketKeepAlive"].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
}); // Proxy all public ClientRequest properties

["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () {
      return this._currentRequest[property];
    }
  });
});

RedirectableRequest.prototype._sanitizeOptions = function (options) {
  // Ensure headers are always present
  if (!options.headers) {
    options.headers = {};
  } // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.


  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }

    delete options.host;
  } // Complete the URL object when necessary


  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");

    if (searchPos < 0) {
      options.pathname = options.path;
    } else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
}; // Executes the next native request (initial or redirect)


RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];

  if (!nativeProtocol) {
    this.emit("error", new TypeError("Unsupported protocol " + protocol));
    return;
  } // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)


  if (this._options.agents) {
    var scheme = protocol.substr(0, protocol.length - 1);
    this._options.agent = this._options.agents[scheme];
  } // Create the native request


  var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
  this._currentUrl = url.format(this._options); // Set up event handlers

  request._redirectable = this;

  for (var e = 0; e < events.length; e++) {
    request.on(events[e], eventHandlers[events[e]]);
  } // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)


  if (this._isRedirect) {
    // Write the request entity and end.
    var i = 0;
    var self = this;
    var buffers = this._requestBodyBuffers;

    (function writeNext(error) {
      // Only write if this request has not been redirected yet

      /* istanbul ignore else */
      if (request === self._currentRequest) {
        // Report any write errors

        /* istanbul ignore if */
        if (error) {
          self.emit("error", error);
        } // Write the next buffer if there are still left
        else if (i < buffers.length) {
            var buffer = buffers[i++];
            /* istanbul ignore else */

            if (!request.finished) {
              request.write(buffer.data, buffer.encoding, writeNext);
            }
          } // End the request if `end` has been called on us
          else if (self._ended) {
              request.end();
            }
      }
    })();
  }
}; // Processes a response from the current native request


RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  var statusCode = response.statusCode;

  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: statusCode
    });
  } // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.


  var location = response.headers.location;

  if (location && this._options.followRedirects !== false && statusCode >= 300 && statusCode < 400) {
    // Abort the current request
    abortRequest(this._currentRequest); // Discard the remainder of the response to avoid waiting for data

    response.destroy(); // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).

    if (++this._redirectCount > this._options.maxRedirects) {
      this.emit("error", new TooManyRedirectsError());
      return;
    } // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe, […]
    // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
    // the request method from POST to GET for the subsequent request.


    if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
    // the server is redirecting the user agent to a different resource […]
    // A user agent can perform a retrieval request targeting that URI
    // (a GET or HEAD request if using HTTP) […]
    statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
      this._options.method = "GET"; // Drop a possible entity and headers related to it

      this._requestBodyBuffers = [];
      removeMatchingHeaders(/^content-/i, this._options.headers);
    } // Drop the Host header, as the redirect might lead to a different host


    var previousHostName = removeMatchingHeaders(/^host$/i, this._options.headers) || url.parse(this._currentUrl).hostname; // Create the redirected request

    var redirectUrl = url.resolve(this._currentUrl, location);
    debug("redirecting to", redirectUrl);
    this._isRedirect = true;
    var redirectUrlParts = url.parse(redirectUrl);
    Object.assign(this._options, redirectUrlParts); // Drop the Authorization header if redirecting to another host

    if (redirectUrlParts.hostname !== previousHostName) {
      removeMatchingHeaders(/^authorization$/i, this._options.headers);
    } // Evaluate the beforeRedirect callback


    if (typeof this._options.beforeRedirect === "function") {
      var responseDetails = {
        headers: response.headers
      };

      try {
        this._options.beforeRedirect.call(null, this._options, responseDetails);
      } catch (err) {
        this.emit("error", err);
        return;
      }

      this._sanitizeOptions(this._options);
    } // Perform the redirected request


    try {
      this._performRequest();
    } catch (cause) {
      var error = new RedirectionError("Redirected request failed: " + cause.message);
      error.cause = cause;
      this.emit("error", error);
    }
  } else {
    // The response is not a redirect; return it as-is
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response); // Clean up

    this._requestBodyBuffers = [];
  }
}; // Wraps the key/value object of protocols with redirect functionality


function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024
  }; // Wrap each protocol

  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol); // Executes a request, following redirects

    function request(input, options, callback) {
      // Parse parameters
      if (typeof input === "string") {
        var urlStr = input;

        try {
          input = urlToOptions(new URL(urlStr));
        } catch (err) {
          /* istanbul ignore next */
          input = url.parse(urlStr);
        }
      } else if (URL && input instanceof URL) {
        input = urlToOptions(input);
      } else {
        callback = options;
        options = input;
        input = {
          protocol: protocol
        };
      }

      if (typeof options === "function") {
        callback = options;
        options = null;
      } // Set defaults


      options = Object.assign({
        maxRedirects: exports.maxRedirects,
        maxBodyLength: exports.maxBodyLength
      }, input, options);
      options.nativeProtocols = nativeProtocols;
      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    } // Executes a GET request, following redirects


    function get(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    } // Expose the properties on the wrapped protocol


    Object.defineProperties(wrappedProtocol, {
      request: {
        value: request,
        configurable: true,
        enumerable: true,
        writable: true
      },
      get: {
        value: get,
        configurable: true,
        enumerable: true,
        writable: true
      }
    });
  });
  return exports;
}
/* istanbul ignore next */


function noop() {
  /* empty */
} // from https://github.com/nodejs/node/blob/master/lib/internal/url.js


function urlToOptions(urlObject) {
  var options = {
    protocol: urlObject.protocol,
    hostname: urlObject.hostname.startsWith("[") ?
    /* istanbul ignore next */
    urlObject.hostname.slice(1, -1) : urlObject.hostname,
    hash: urlObject.hash,
    search: urlObject.search,
    pathname: urlObject.pathname,
    path: urlObject.pathname + urlObject.search,
    href: urlObject.href
  };

  if (urlObject.port !== "") {
    options.port = Number(urlObject.port);
  }

  return options;
}

function removeMatchingHeaders(regex, headers) {
  var lastValue;

  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }

  return lastValue;
}

function createErrorType(code, defaultMessage) {
  function CustomError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.message = message || defaultMessage;
  }

  CustomError.prototype = new Error();
  CustomError.prototype.constructor = CustomError;
  CustomError.prototype.name = "Error [" + code + "]";
  CustomError.prototype.code = code;
  return CustomError;
}

function abortRequest(request) {
  for (var e = 0; e < events.length; e++) {
    request.removeListener(events[e], eventHandlers[events[e]]);
  }

  request.on("error", noop);
  request.abort();
} // Exports


module.exports = wrap({
  http: http,
  https: https
});
module.exports.wrap = wrap;

/***/ }),

/***/ "./node_modules/has-flag/index.js":
/*!****************************************!*\
  !*** ./node_modules/has-flag/index.js ***!
  \****************************************/
/***/ ((module) => {

"use strict";


module.exports = (flag, argv) => {
  argv = argv || process.argv;
  const prefix = flag.startsWith('-') ? '' : flag.length === 1 ? '-' : '--';
  const pos = argv.indexOf(prefix + flag);
  const terminatorPos = argv.indexOf('--');
  return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};

/***/ }),

/***/ "./node_modules/ms/index.js":
/*!**********************************!*\
  !*** ./node_modules/ms/index.js ***!
  \**********************************/
/***/ ((module) => {

/**
 * Helpers.
 */
var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val;

  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }

  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};
/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */


function parse(str) {
  str = String(str);

  if (str.length > 100) {
    return;
  }

  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);

  if (!match) {
    return;
  }

  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();

  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;

    case 'weeks':
    case 'week':
    case 'w':
      return n * w;

    case 'days':
    case 'day':
    case 'd':
      return n * d;

    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;

    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;

    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;

    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;

    default:
      return undefined;
  }
}
/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */


function fmtShort(ms) {
  var msAbs = Math.abs(ms);

  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }

  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }

  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }

  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }

  return ms + 'ms';
}
/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */


function fmtLong(ms) {
  var msAbs = Math.abs(ms);

  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }

  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }

  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }

  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }

  return ms + ' ms';
}
/**
 * Pluralization helper.
 */


function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

/***/ }),

/***/ "./node_modules/satellite.js/dist/satellite.es.js":
/*!********************************************************!*\
  !*** ./node_modules/satellite.js/dist/satellite.es.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "constants": () => (/* binding */ constants),
/* harmony export */   "degreesLat": () => (/* binding */ degreesLat),
/* harmony export */   "degreesLong": () => (/* binding */ degreesLong),
/* harmony export */   "degreesToRadians": () => (/* binding */ degreesToRadians),
/* harmony export */   "dopplerFactor": () => (/* binding */ dopplerFactor),
/* harmony export */   "ecfToEci": () => (/* binding */ ecfToEci),
/* harmony export */   "ecfToLookAngles": () => (/* binding */ ecfToLookAngles),
/* harmony export */   "eciToEcf": () => (/* binding */ eciToEcf),
/* harmony export */   "eciToGeodetic": () => (/* binding */ eciToGeodetic),
/* harmony export */   "geodeticToEcf": () => (/* binding */ geodeticToEcf),
/* harmony export */   "gstime": () => (/* binding */ gstime),
/* harmony export */   "invjday": () => (/* binding */ invjday),
/* harmony export */   "jday": () => (/* binding */ jday),
/* harmony export */   "propagate": () => (/* binding */ propagate),
/* harmony export */   "radiansLat": () => (/* binding */ radiansLat),
/* harmony export */   "radiansLong": () => (/* binding */ radiansLong),
/* harmony export */   "radiansToDegrees": () => (/* binding */ radiansToDegrees),
/* harmony export */   "sgp4": () => (/* binding */ sgp4),
/* harmony export */   "twoline2satrec": () => (/* binding */ twoline2satrec)
/* harmony export */ });
/*!
 * satellite-js v4.1.3
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */
var pi = Math.PI;
var twoPi = pi * 2;
var deg2rad = pi / 180.0;
var rad2deg = 180 / pi;
var minutesPerDay = 1440.0;
var mu = 398600.5; // in km3 / s2

var earthRadius = 6378.137; // in km

var xke = 60.0 / Math.sqrt(earthRadius * earthRadius * earthRadius / mu);
var vkmpersec = earthRadius * xke / 60.0;
var tumin = 1.0 / xke;
var j2 = 0.00108262998905;
var j3 = -0.00000253215306;
var j4 = -0.00000161098761;
var j3oj2 = j3 / j2;
var x2o3 = 2.0 / 3.0;
var constants = /*#__PURE__*/Object.freeze({
  __proto__: null,
  pi: pi,
  twoPi: twoPi,
  deg2rad: deg2rad,
  rad2deg: rad2deg,
  minutesPerDay: minutesPerDay,
  mu: mu,
  earthRadius: earthRadius,
  xke: xke,
  vkmpersec: vkmpersec,
  tumin: tumin,
  j2: j2,
  j3: j3,
  j4: j4,
  j3oj2: j3oj2,
  x2o3: x2o3
});
/* -----------------------------------------------------------------------------
 *
 *                           procedure days2mdhms
 *
 *  this procedure converts the day of the year, days, to the equivalent month
 *    day, hour, minute and second.
 *
 *  algorithm     : set up array for the number of days per month
 *                  find leap year - use 1900 because 2000 is a leap year
 *                  loop through a temp value while the value is < the days
 *                  perform int conversions to the correct day and month
 *                  convert remainder into h m s using type conversions
 *
 *  author        : david vallado                  719-573-2600    1 mar 2001
 *
 *  inputs          description                    range / units
 *    year        - year                           1900 .. 2100
 *    days        - julian day of the year         0.0  .. 366.0
 *
 *  outputs       :
 *    mon         - month                          1 .. 12
 *    day         - day                            1 .. 28,29,30,31
 *    hr          - hour                           0 .. 23
 *    min         - minute                         0 .. 59
 *    sec         - second                         0.0 .. 59.999
 *
 *  locals        :
 *    dayofyr     - day of year
 *    temp        - temporary extended values
 *    inttemp     - temporary int value
 *    i           - index
 *    lmonth[12]  - int array containing the number of days per month
 *
 *  coupling      :
 *    none.
 * --------------------------------------------------------------------------- */

function days2mdhms(year, days) {
  var lmonth = [31, year % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var dayofyr = Math.floor(days); //  ----------------- find month and day of month ----------------

  var i = 1;
  var inttemp = 0;

  while (dayofyr > inttemp + lmonth[i - 1] && i < 12) {
    inttemp += lmonth[i - 1];
    i += 1;
  }

  var mon = i;
  var day = dayofyr - inttemp; //  ----------------- find hours minutes and seconds -------------

  var temp = (days - dayofyr) * 24.0;
  var hr = Math.floor(temp);
  temp = (temp - hr) * 60.0;
  var minute = Math.floor(temp);
  var sec = (temp - minute) * 60.0;
  return {
    mon: mon,
    day: day,
    hr: hr,
    minute: minute,
    sec: sec
  };
}
/* -----------------------------------------------------------------------------
 *
 *                           procedure jday
 *
 *  this procedure finds the julian date given the year, month, day, and time.
 *    the julian date is defined by each elapsed day since noon, jan 1, 4713 bc.
 *
 *  algorithm     : calculate the answer in one step for efficiency
 *
 *  author        : david vallado                  719-573-2600    1 mar 2001
 *
 *  inputs          description                    range / units
 *    year        - year                           1900 .. 2100
 *    mon         - month                          1 .. 12
 *    day         - day                            1 .. 28,29,30,31
 *    hr          - universal time hour            0 .. 23
 *    min         - universal time min             0 .. 59
 *    sec         - universal time sec             0.0 .. 59.999
 *
 *  outputs       :
 *    jd          - julian date                    days from 4713 bc
 *
 *  locals        :
 *    none.
 *
 *  coupling      :
 *    none.
 *
 *  references    :
 *    vallado       2007, 189, alg 14, ex 3-14
 *
 * --------------------------------------------------------------------------- */


function jdayInternal(year, mon, day, hr, minute, sec) {
  var msec = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  return 367.0 * year - Math.floor(7 * (year + Math.floor((mon + 9) / 12.0)) * 0.25) + Math.floor(275 * mon / 9.0) + day + 1721013.5 + ((msec / 60000 + sec / 60.0 + minute) / 60.0 + hr) / 24.0 // ut in days
  // # - 0.5*sgn(100.0*year + mon - 190002.5) + 0.5;
  ;
}

function jday(year, mon, day, hr, minute, sec, msec) {
  if (year instanceof Date) {
    var date = year;
    return jdayInternal(date.getUTCFullYear(), date.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
    date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
  }

  return jdayInternal(year, mon, day, hr, minute, sec, msec);
}
/* -----------------------------------------------------------------------------
 *
 *                           procedure invjday
 *
 *  this procedure finds the year, month, day, hour, minute and second
 *  given the julian date. tu can be ut1, tdt, tdb, etc.
 *
 *  algorithm     : set up starting values
 *                  find leap year - use 1900 because 2000 is a leap year
 *                  find the elapsed days through the year in a loop
 *                  call routine to find each individual value
 *
 *  author        : david vallado                  719-573-2600    1 mar 2001
 *
 *  inputs          description                    range / units
 *    jd          - julian date                    days from 4713 bc
 *
 *  outputs       :
 *    year        - year                           1900 .. 2100
 *    mon         - month                          1 .. 12
 *    day         - day                            1 .. 28,29,30,31
 *    hr          - hour                           0 .. 23
 *    min         - minute                         0 .. 59
 *    sec         - second                         0.0 .. 59.999
 *
 *  locals        :
 *    days        - day of year plus fractional
 *                  portion of a day               days
 *    tu          - julian centuries from 0 h
 *                  jan 0, 1900
 *    temp        - temporary double values
 *    leapyrs     - number of leap years from 1900
 *
 *  coupling      :
 *    days2mdhms  - finds month, day, hour, minute and second given days and year
 *
 *  references    :
 *    vallado       2007, 208, alg 22, ex 3-13
 * --------------------------------------------------------------------------- */


function invjday(jd, asArray) {
  // --------------- find year and days of the year -
  var temp = jd - 2415019.5;
  var tu = temp / 365.25;
  var year = 1900 + Math.floor(tu);
  var leapyrs = Math.floor((year - 1901) * 0.25); // optional nudge by 8.64x10-7 sec to get even outputs

  var days = temp - ((year - 1900) * 365.0 + leapyrs) + 0.00000000001; // ------------ check for case of beginning of a year -----------

  if (days < 1.0) {
    year -= 1;
    leapyrs = Math.floor((year - 1901) * 0.25);
    days = temp - ((year - 1900) * 365.0 + leapyrs);
  } // ----------------- find remaing data  -------------------------


  var mdhms = days2mdhms(year, days);
  var mon = mdhms.mon,
      day = mdhms.day,
      hr = mdhms.hr,
      minute = mdhms.minute;
  var sec = mdhms.sec - 0.00000086400;

  if (asArray) {
    return [year, mon, day, hr, minute, Math.floor(sec)];
  }

  return new Date(Date.UTC(year, mon - 1, day, hr, minute, Math.floor(sec)));
}
/* -----------------------------------------------------------------------------
 *
 *                           procedure dpper
 *
 *  this procedure provides deep space long period periodic contributions
 *    to the mean elements.  by design, these periodics are zero at epoch.
 *    this used to be dscom which included initialization, but it's really a
 *    recurring function.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    e3          -
 *    ee2         -
 *    peo         -
 *    pgho        -
 *    pho         -
 *    pinco       -
 *    plo         -
 *    se2 , se3 , sgh2, sgh3, sgh4, sh2, sh3, si2, si3, sl2, sl3, sl4 -
 *    t           -
 *    xh2, xh3, xi2, xi3, xl2, xl3, xl4 -
 *    zmol        -
 *    zmos        -
 *    ep          - eccentricity                           0.0 - 1.0
 *    inclo       - inclination - needed for lyddane modification
 *    nodep       - right ascension of ascending node
 *    argpp       - argument of perigee
 *    mp          - mean anomaly
 *
 *  outputs       :
 *    ep          - eccentricity                           0.0 - 1.0
 *    inclp       - inclination
 *    nodep        - right ascension of ascending node
 *    argpp       - argument of perigee
 *    mp          - mean anomaly
 *
 *  locals        :
 *    alfdp       -
 *    betdp       -
 *    cosip  , sinip  , cosop  , sinop  ,
 *    dalf        -
 *    dbet        -
 *    dls         -
 *    f2, f3      -
 *    pe          -
 *    pgh         -
 *    ph          -
 *    pinc        -
 *    pl          -
 *    sel   , ses   , sghl  , sghs  , shl   , shs   , sil   , sinzf , sis   ,
 *    sll   , sls
 *    xls         -
 *    xnoh        -
 *    zf          -
 *    zm          -
 *
 *  coupling      :
 *    none.
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report #3 1980
 *    hoots, norad spacetrack report #6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/


function dpper(satrec, options) {
  var e3 = satrec.e3,
      ee2 = satrec.ee2,
      peo = satrec.peo,
      pgho = satrec.pgho,
      pho = satrec.pho,
      pinco = satrec.pinco,
      plo = satrec.plo,
      se2 = satrec.se2,
      se3 = satrec.se3,
      sgh2 = satrec.sgh2,
      sgh3 = satrec.sgh3,
      sgh4 = satrec.sgh4,
      sh2 = satrec.sh2,
      sh3 = satrec.sh3,
      si2 = satrec.si2,
      si3 = satrec.si3,
      sl2 = satrec.sl2,
      sl3 = satrec.sl3,
      sl4 = satrec.sl4,
      t = satrec.t,
      xgh2 = satrec.xgh2,
      xgh3 = satrec.xgh3,
      xgh4 = satrec.xgh4,
      xh2 = satrec.xh2,
      xh3 = satrec.xh3,
      xi2 = satrec.xi2,
      xi3 = satrec.xi3,
      xl2 = satrec.xl2,
      xl3 = satrec.xl3,
      xl4 = satrec.xl4,
      zmol = satrec.zmol,
      zmos = satrec.zmos;
  var init = options.init,
      opsmode = options.opsmode;
  var ep = options.ep,
      inclp = options.inclp,
      nodep = options.nodep,
      argpp = options.argpp,
      mp = options.mp; // Copy satellite attributes into local variables for convenience
  // and symmetry in writing formulae.

  var alfdp;
  var betdp;
  var cosip;
  var sinip;
  var cosop;
  var sinop;
  var dalf;
  var dbet;
  var dls;
  var f2;
  var f3;
  var pe;
  var pgh;
  var ph;
  var pinc;
  var pl;
  var sinzf;
  var xls;
  var xnoh;
  var zf;
  var zm; //  ---------------------- constants -----------------------------

  var zns = 1.19459e-5;
  var zes = 0.01675;
  var znl = 1.5835218e-4;
  var zel = 0.05490; //  --------------- calculate time varying periodics -----------

  zm = zmos + zns * t; // be sure that the initial call has time set to zero

  if (init === 'y') {
    zm = zmos;
  }

  zf = zm + 2.0 * zes * Math.sin(zm);
  sinzf = Math.sin(zf);
  f2 = 0.5 * sinzf * sinzf - 0.25;
  f3 = -0.5 * sinzf * Math.cos(zf);
  var ses = se2 * f2 + se3 * f3;
  var sis = si2 * f2 + si3 * f3;
  var sls = sl2 * f2 + sl3 * f3 + sl4 * sinzf;
  var sghs = sgh2 * f2 + sgh3 * f3 + sgh4 * sinzf;
  var shs = sh2 * f2 + sh3 * f3;
  zm = zmol + znl * t;

  if (init === 'y') {
    zm = zmol;
  }

  zf = zm + 2.0 * zel * Math.sin(zm);
  sinzf = Math.sin(zf);
  f2 = 0.5 * sinzf * sinzf - 0.25;
  f3 = -0.5 * sinzf * Math.cos(zf);
  var sel = ee2 * f2 + e3 * f3;
  var sil = xi2 * f2 + xi3 * f3;
  var sll = xl2 * f2 + xl3 * f3 + xl4 * sinzf;
  var sghl = xgh2 * f2 + xgh3 * f3 + xgh4 * sinzf;
  var shll = xh2 * f2 + xh3 * f3;
  pe = ses + sel;
  pinc = sis + sil;
  pl = sls + sll;
  pgh = sghs + sghl;
  ph = shs + shll;

  if (init === 'n') {
    pe -= peo;
    pinc -= pinco;
    pl -= plo;
    pgh -= pgho;
    ph -= pho;
    inclp += pinc;
    ep += pe;
    sinip = Math.sin(inclp);
    cosip = Math.cos(inclp);
    /* ----------------- apply periodics directly ------------ */
    // sgp4fix for lyddane choice
    // strn3 used original inclination - this is technically feasible
    // gsfc used perturbed inclination - also technically feasible
    // probably best to readjust the 0.2 limit value and limit discontinuity
    // 0.2 rad = 11.45916 deg
    // use next line for original strn3 approach and original inclination
    // if (inclo >= 0.2)
    // use next line for gsfc version and perturbed inclination

    if (inclp >= 0.2) {
      ph /= sinip;
      pgh -= cosip * ph;
      argpp += pgh;
      nodep += ph;
      mp += pl;
    } else {
      //  ---- apply periodics with lyddane modification ----
      sinop = Math.sin(nodep);
      cosop = Math.cos(nodep);
      alfdp = sinip * sinop;
      betdp = sinip * cosop;
      dalf = ph * cosop + pinc * cosip * sinop;
      dbet = -ph * sinop + pinc * cosip * cosop;
      alfdp += dalf;
      betdp += dbet;
      nodep %= twoPi; //  sgp4fix for afspc written intrinsic functions
      //  nodep used without a trigonometric function ahead

      if (nodep < 0.0 && opsmode === 'a') {
        nodep += twoPi;
      }

      xls = mp + argpp + cosip * nodep;
      dls = pl + pgh - pinc * nodep * sinip;
      xls += dls;
      xnoh = nodep;
      nodep = Math.atan2(alfdp, betdp); //  sgp4fix for afspc written intrinsic functions
      //  nodep used without a trigonometric function ahead

      if (nodep < 0.0 && opsmode === 'a') {
        nodep += twoPi;
      }

      if (Math.abs(xnoh - nodep) > pi) {
        if (nodep < xnoh) {
          nodep += twoPi;
        } else {
          nodep -= twoPi;
        }
      }

      mp += pl;
      argpp = xls - mp - cosip * nodep;
    }
  }

  return {
    ep: ep,
    inclp: inclp,
    nodep: nodep,
    argpp: argpp,
    mp: mp
  };
}
/*-----------------------------------------------------------------------------
 *
 *                           procedure dscom
 *
 *  this procedure provides deep space common items used by both the secular
 *    and periodics subroutines.  input is provided as shown. this routine
 *    used to be called dpper, but the functions inside weren't well organized.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    epoch       -
 *    ep          - eccentricity
 *    argpp       - argument of perigee
 *    tc          -
 *    inclp       - inclination
 *    nodep       - right ascension of ascending node
 *    np          - mean motion
 *
 *  outputs       :
 *    sinim  , cosim  , sinomm , cosomm , snodm  , cnodm
 *    day         -
 *    e3          -
 *    ee2         -
 *    em          - eccentricity
 *    emsq        - eccentricity squared
 *    gam         -
 *    peo         -
 *    pgho        -
 *    pho         -
 *    pinco       -
 *    plo         -
 *    rtemsq      -
 *    se2, se3         -
 *    sgh2, sgh3, sgh4        -
 *    sh2, sh3, si2, si3, sl2, sl3, sl4         -
 *    s1, s2, s3, s4, s5, s6, s7          -
 *    ss1, ss2, ss3, ss4, ss5, ss6, ss7, sz1, sz2, sz3         -
 *    sz11, sz12, sz13, sz21, sz22, sz23, sz31, sz32, sz33        -
 *    xgh2, xgh3, xgh4, xh2, xh3, xi2, xi3, xl2, xl3, xl4         -
 *    nm          - mean motion
 *    z1, z2, z3, z11, z12, z13, z21, z22, z23, z31, z32, z33         -
 *    zmol        -
 *    zmos        -
 *
 *  locals        :
 *    a1, a2, a3, a4, a5, a6, a7, a8, a9, a10         -
 *    betasq      -
 *    cc          -
 *    ctem, stem        -
 *    x1, x2, x3, x4, x5, x6, x7, x8          -
 *    xnodce      -
 *    xnoi        -
 *    zcosg  , zsing  , zcosgl , zsingl , zcosh  , zsinh  , zcoshl , zsinhl ,
 *    zcosi  , zsini  , zcosil , zsinil ,
 *    zx          -
 *    zy          -
 *
 *  coupling      :
 *    none.
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report #3 1980
 *    hoots, norad spacetrack report #6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/


function dscom(options) {
  var epoch = options.epoch,
      ep = options.ep,
      argpp = options.argpp,
      tc = options.tc,
      inclp = options.inclp,
      nodep = options.nodep,
      np = options.np;
  var a1;
  var a2;
  var a3;
  var a4;
  var a5;
  var a6;
  var a7;
  var a8;
  var a9;
  var a10;
  var cc;
  var x1;
  var x2;
  var x3;
  var x4;
  var x5;
  var x6;
  var x7;
  var x8;
  var zcosg;
  var zsing;
  var zcosh;
  var zsinh;
  var zcosi;
  var zsini;
  var ss1;
  var ss2;
  var ss3;
  var ss4;
  var ss5;
  var ss6;
  var ss7;
  var sz1;
  var sz2;
  var sz3;
  var sz11;
  var sz12;
  var sz13;
  var sz21;
  var sz22;
  var sz23;
  var sz31;
  var sz32;
  var sz33;
  var s1;
  var s2;
  var s3;
  var s4;
  var s5;
  var s6;
  var s7;
  var z1;
  var z2;
  var z3;
  var z11;
  var z12;
  var z13;
  var z21;
  var z22;
  var z23;
  var z31;
  var z32;
  var z33; // -------------------------- constants -------------------------

  var zes = 0.01675;
  var zel = 0.05490;
  var c1ss = 2.9864797e-6;
  var c1l = 4.7968065e-7;
  var zsinis = 0.39785416;
  var zcosis = 0.91744867;
  var zcosgs = 0.1945905;
  var zsings = -0.98088458; //  --------------------- local variables ------------------------

  var nm = np;
  var em = ep;
  var snodm = Math.sin(nodep);
  var cnodm = Math.cos(nodep);
  var sinomm = Math.sin(argpp);
  var cosomm = Math.cos(argpp);
  var sinim = Math.sin(inclp);
  var cosim = Math.cos(inclp);
  var emsq = em * em;
  var betasq = 1.0 - emsq;
  var rtemsq = Math.sqrt(betasq); //  ----------------- initialize lunar solar terms ---------------

  var peo = 0.0;
  var pinco = 0.0;
  var plo = 0.0;
  var pgho = 0.0;
  var pho = 0.0;
  var day = epoch + 18261.5 + tc / 1440.0;
  var xnodce = (4.5236020 - 9.2422029e-4 * day) % twoPi;
  var stem = Math.sin(xnodce);
  var ctem = Math.cos(xnodce);
  var zcosil = 0.91375164 - 0.03568096 * ctem;
  var zsinil = Math.sqrt(1.0 - zcosil * zcosil);
  var zsinhl = 0.089683511 * stem / zsinil;
  var zcoshl = Math.sqrt(1.0 - zsinhl * zsinhl);
  var gam = 5.8351514 + 0.0019443680 * day;
  var zx = 0.39785416 * stem / zsinil;
  var zy = zcoshl * ctem + 0.91744867 * zsinhl * stem;
  zx = Math.atan2(zx, zy);
  zx += gam - xnodce;
  var zcosgl = Math.cos(zx);
  var zsingl = Math.sin(zx); //  ------------------------- do solar terms ---------------------

  zcosg = zcosgs;
  zsing = zsings;
  zcosi = zcosis;
  zsini = zsinis;
  zcosh = cnodm;
  zsinh = snodm;
  cc = c1ss;
  var xnoi = 1.0 / nm;
  var lsflg = 0;

  while (lsflg < 2) {
    lsflg += 1;
    a1 = zcosg * zcosh + zsing * zcosi * zsinh;
    a3 = -zsing * zcosh + zcosg * zcosi * zsinh;
    a7 = -zcosg * zsinh + zsing * zcosi * zcosh;
    a8 = zsing * zsini;
    a9 = zsing * zsinh + zcosg * zcosi * zcosh;
    a10 = zcosg * zsini;
    a2 = cosim * a7 + sinim * a8;
    a4 = cosim * a9 + sinim * a10;
    a5 = -sinim * a7 + cosim * a8;
    a6 = -sinim * a9 + cosim * a10;
    x1 = a1 * cosomm + a2 * sinomm;
    x2 = a3 * cosomm + a4 * sinomm;
    x3 = -a1 * sinomm + a2 * cosomm;
    x4 = -a3 * sinomm + a4 * cosomm;
    x5 = a5 * sinomm;
    x6 = a6 * sinomm;
    x7 = a5 * cosomm;
    x8 = a6 * cosomm;
    z31 = 12.0 * x1 * x1 - 3.0 * x3 * x3;
    z32 = 24.0 * x1 * x2 - 6.0 * x3 * x4;
    z33 = 12.0 * x2 * x2 - 3.0 * x4 * x4;
    z1 = 3.0 * (a1 * a1 + a2 * a2) + z31 * emsq;
    z2 = 6.0 * (a1 * a3 + a2 * a4) + z32 * emsq;
    z3 = 3.0 * (a3 * a3 + a4 * a4) + z33 * emsq;
    z11 = -6.0 * a1 * a5 + emsq * (-24.0 * x1 * x7 - 6.0 * x3 * x5);
    z12 = -6.0 * (a1 * a6 + a3 * a5) + emsq * (-24.0 * (x2 * x7 + x1 * x8) + -6.0 * (x3 * x6 + x4 * x5));
    z13 = -6.0 * a3 * a6 + emsq * (-24.0 * x2 * x8 - 6.0 * x4 * x6);
    z21 = 6.0 * a2 * a5 + emsq * (24.0 * x1 * x5 - 6.0 * x3 * x7);
    z22 = 6.0 * (a4 * a5 + a2 * a6) + emsq * (24.0 * (x2 * x5 + x1 * x6) - 6.0 * (x4 * x7 + x3 * x8));
    z23 = 6.0 * a4 * a6 + emsq * (24.0 * x2 * x6 - 6.0 * x4 * x8);
    z1 = z1 + z1 + betasq * z31;
    z2 = z2 + z2 + betasq * z32;
    z3 = z3 + z3 + betasq * z33;
    s3 = cc * xnoi;
    s2 = -0.5 * s3 / rtemsq;
    s4 = s3 * rtemsq;
    s1 = -15.0 * em * s4;
    s5 = x1 * x3 + x2 * x4;
    s6 = x2 * x3 + x1 * x4;
    s7 = x2 * x4 - x1 * x3; //  ----------------------- do lunar terms -------------------

    if (lsflg === 1) {
      ss1 = s1;
      ss2 = s2;
      ss3 = s3;
      ss4 = s4;
      ss5 = s5;
      ss6 = s6;
      ss7 = s7;
      sz1 = z1;
      sz2 = z2;
      sz3 = z3;
      sz11 = z11;
      sz12 = z12;
      sz13 = z13;
      sz21 = z21;
      sz22 = z22;
      sz23 = z23;
      sz31 = z31;
      sz32 = z32;
      sz33 = z33;
      zcosg = zcosgl;
      zsing = zsingl;
      zcosi = zcosil;
      zsini = zsinil;
      zcosh = zcoshl * cnodm + zsinhl * snodm;
      zsinh = snodm * zcoshl - cnodm * zsinhl;
      cc = c1l;
    }
  }

  var zmol = (4.7199672 + (0.22997150 * day - gam)) % twoPi;
  var zmos = (6.2565837 + 0.017201977 * day) % twoPi; //  ------------------------ do solar terms ----------------------

  var se2 = 2.0 * ss1 * ss6;
  var se3 = 2.0 * ss1 * ss7;
  var si2 = 2.0 * ss2 * sz12;
  var si3 = 2.0 * ss2 * (sz13 - sz11);
  var sl2 = -2.0 * ss3 * sz2;
  var sl3 = -2.0 * ss3 * (sz3 - sz1);
  var sl4 = -2.0 * ss3 * (-21.0 - 9.0 * emsq) * zes;
  var sgh2 = 2.0 * ss4 * sz32;
  var sgh3 = 2.0 * ss4 * (sz33 - sz31);
  var sgh4 = -18.0 * ss4 * zes;
  var sh2 = -2.0 * ss2 * sz22;
  var sh3 = -2.0 * ss2 * (sz23 - sz21); //  ------------------------ do lunar terms ----------------------

  var ee2 = 2.0 * s1 * s6;
  var e3 = 2.0 * s1 * s7;
  var xi2 = 2.0 * s2 * z12;
  var xi3 = 2.0 * s2 * (z13 - z11);
  var xl2 = -2.0 * s3 * z2;
  var xl3 = -2.0 * s3 * (z3 - z1);
  var xl4 = -2.0 * s3 * (-21.0 - 9.0 * emsq) * zel;
  var xgh2 = 2.0 * s4 * z32;
  var xgh3 = 2.0 * s4 * (z33 - z31);
  var xgh4 = -18.0 * s4 * zel;
  var xh2 = -2.0 * s2 * z22;
  var xh3 = -2.0 * s2 * (z23 - z21);
  return {
    snodm: snodm,
    cnodm: cnodm,
    sinim: sinim,
    cosim: cosim,
    sinomm: sinomm,
    cosomm: cosomm,
    day: day,
    e3: e3,
    ee2: ee2,
    em: em,
    emsq: emsq,
    gam: gam,
    peo: peo,
    pgho: pgho,
    pho: pho,
    pinco: pinco,
    plo: plo,
    rtemsq: rtemsq,
    se2: se2,
    se3: se3,
    sgh2: sgh2,
    sgh3: sgh3,
    sgh4: sgh4,
    sh2: sh2,
    sh3: sh3,
    si2: si2,
    si3: si3,
    sl2: sl2,
    sl3: sl3,
    sl4: sl4,
    s1: s1,
    s2: s2,
    s3: s3,
    s4: s4,
    s5: s5,
    s6: s6,
    s7: s7,
    ss1: ss1,
    ss2: ss2,
    ss3: ss3,
    ss4: ss4,
    ss5: ss5,
    ss6: ss6,
    ss7: ss7,
    sz1: sz1,
    sz2: sz2,
    sz3: sz3,
    sz11: sz11,
    sz12: sz12,
    sz13: sz13,
    sz21: sz21,
    sz22: sz22,
    sz23: sz23,
    sz31: sz31,
    sz32: sz32,
    sz33: sz33,
    xgh2: xgh2,
    xgh3: xgh3,
    xgh4: xgh4,
    xh2: xh2,
    xh3: xh3,
    xi2: xi2,
    xi3: xi3,
    xl2: xl2,
    xl3: xl3,
    xl4: xl4,
    nm: nm,
    z1: z1,
    z2: z2,
    z3: z3,
    z11: z11,
    z12: z12,
    z13: z13,
    z21: z21,
    z22: z22,
    z23: z23,
    z31: z31,
    z32: z32,
    z33: z33,
    zmol: zmol,
    zmos: zmos
  };
}
/*-----------------------------------------------------------------------------
 *
 *                           procedure dsinit
 *
 *  this procedure provides deep space contributions to mean motion dot due
 *    to geopotential resonance with half day and one day orbits.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    cosim, sinim-
 *    emsq        - eccentricity squared
 *    argpo       - argument of perigee
 *    s1, s2, s3, s4, s5      -
 *    ss1, ss2, ss3, ss4, ss5 -
 *    sz1, sz3, sz11, sz13, sz21, sz23, sz31, sz33 -
 *    t           - time
 *    tc          -
 *    gsto        - greenwich sidereal time                   rad
 *    mo          - mean anomaly
 *    mdot        - mean anomaly dot (rate)
 *    no          - mean motion
 *    nodeo       - right ascension of ascending node
 *    nodedot     - right ascension of ascending node dot (rate)
 *    xpidot      -
 *    z1, z3, z11, z13, z21, z23, z31, z33 -
 *    eccm        - eccentricity
 *    argpm       - argument of perigee
 *    inclm       - inclination
 *    mm          - mean anomaly
 *    xn          - mean motion
 *    nodem       - right ascension of ascending node
 *
 *  outputs       :
 *    em          - eccentricity
 *    argpm       - argument of perigee
 *    inclm       - inclination
 *    mm          - mean anomaly
 *    nm          - mean motion
 *    nodem       - right ascension of ascending node
 *    irez        - flag for resonance           0-none, 1-one day, 2-half day
 *    atime       -
 *    d2201, d2211, d3210, d3222, d4410, d4422, d5220, d5232, d5421, d5433    -
 *    dedt        -
 *    didt        -
 *    dmdt        -
 *    dndt        -
 *    dnodt       -
 *    domdt       -
 *    del1, del2, del3        -
 *    ses  , sghl , sghs , sgs  , shl  , shs  , sis  , sls
 *    theta       -
 *    xfact       -
 *    xlamo       -
 *    xli         -
 *    xni
 *
 *  locals        :
 *    ainv2       -
 *    aonv        -
 *    cosisq      -
 *    eoc         -
 *    f220, f221, f311, f321, f322, f330, f441, f442, f522, f523, f542, f543  -
 *    g200, g201, g211, g300, g310, g322, g410, g422, g520, g521, g532, g533  -
 *    sini2       -
 *    temp        -
 *    temp1       -
 *    theta       -
 *    xno2        -
 *
 *  coupling      :
 *    getgravconst
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report #3 1980
 *    hoots, norad spacetrack report #6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/


function dsinit(options) {
  var cosim = options.cosim,
      argpo = options.argpo,
      s1 = options.s1,
      s2 = options.s2,
      s3 = options.s3,
      s4 = options.s4,
      s5 = options.s5,
      sinim = options.sinim,
      ss1 = options.ss1,
      ss2 = options.ss2,
      ss3 = options.ss3,
      ss4 = options.ss4,
      ss5 = options.ss5,
      sz1 = options.sz1,
      sz3 = options.sz3,
      sz11 = options.sz11,
      sz13 = options.sz13,
      sz21 = options.sz21,
      sz23 = options.sz23,
      sz31 = options.sz31,
      sz33 = options.sz33,
      t = options.t,
      tc = options.tc,
      gsto = options.gsto,
      mo = options.mo,
      mdot = options.mdot,
      no = options.no,
      nodeo = options.nodeo,
      nodedot = options.nodedot,
      xpidot = options.xpidot,
      z1 = options.z1,
      z3 = options.z3,
      z11 = options.z11,
      z13 = options.z13,
      z21 = options.z21,
      z23 = options.z23,
      z31 = options.z31,
      z33 = options.z33,
      ecco = options.ecco,
      eccsq = options.eccsq;
  var emsq = options.emsq,
      em = options.em,
      argpm = options.argpm,
      inclm = options.inclm,
      mm = options.mm,
      nm = options.nm,
      nodem = options.nodem,
      irez = options.irez,
      atime = options.atime,
      d2201 = options.d2201,
      d2211 = options.d2211,
      d3210 = options.d3210,
      d3222 = options.d3222,
      d4410 = options.d4410,
      d4422 = options.d4422,
      d5220 = options.d5220,
      d5232 = options.d5232,
      d5421 = options.d5421,
      d5433 = options.d5433,
      dedt = options.dedt,
      didt = options.didt,
      dmdt = options.dmdt,
      dnodt = options.dnodt,
      domdt = options.domdt,
      del1 = options.del1,
      del2 = options.del2,
      del3 = options.del3,
      xfact = options.xfact,
      xlamo = options.xlamo,
      xli = options.xli,
      xni = options.xni;
  var f220;
  var f221;
  var f311;
  var f321;
  var f322;
  var f330;
  var f441;
  var f442;
  var f522;
  var f523;
  var f542;
  var f543;
  var g200;
  var g201;
  var g211;
  var g300;
  var g310;
  var g322;
  var g410;
  var g422;
  var g520;
  var g521;
  var g532;
  var g533;
  var sini2;
  var temp;
  var temp1;
  var xno2;
  var ainv2;
  var aonv;
  var cosisq;
  var eoc;
  var q22 = 1.7891679e-6;
  var q31 = 2.1460748e-6;
  var q33 = 2.2123015e-7;
  var root22 = 1.7891679e-6;
  var root44 = 7.3636953e-9;
  var root54 = 2.1765803e-9;
  var rptim = 4.37526908801129966e-3; // equates to 7.29211514668855e-5 rad/sec

  var root32 = 3.7393792e-7;
  var root52 = 1.1428639e-7;
  var znl = 1.5835218e-4;
  var zns = 1.19459e-5; // -------------------- deep space initialization ------------

  irez = 0;

  if (nm < 0.0052359877 && nm > 0.0034906585) {
    irez = 1;
  }

  if (nm >= 8.26e-3 && nm <= 9.24e-3 && em >= 0.5) {
    irez = 2;
  } // ------------------------ do solar terms -------------------


  var ses = ss1 * zns * ss5;
  var sis = ss2 * zns * (sz11 + sz13);
  var sls = -zns * ss3 * (sz1 + sz3 - 14.0 - 6.0 * emsq);
  var sghs = ss4 * zns * (sz31 + sz33 - 6.0);
  var shs = -zns * ss2 * (sz21 + sz23); // sgp4fix for 180 deg incl

  if (inclm < 5.2359877e-2 || inclm > pi - 5.2359877e-2) {
    shs = 0.0;
  }

  if (sinim !== 0.0) {
    shs /= sinim;
  }

  var sgs = sghs - cosim * shs; // ------------------------- do lunar terms ------------------

  dedt = ses + s1 * znl * s5;
  didt = sis + s2 * znl * (z11 + z13);
  dmdt = sls - znl * s3 * (z1 + z3 - 14.0 - 6.0 * emsq);
  var sghl = s4 * znl * (z31 + z33 - 6.0);
  var shll = -znl * s2 * (z21 + z23); // sgp4fix for 180 deg incl

  if (inclm < 5.2359877e-2 || inclm > pi - 5.2359877e-2) {
    shll = 0.0;
  }

  domdt = sgs + sghl;
  dnodt = shs;

  if (sinim !== 0.0) {
    domdt -= cosim / sinim * shll;
    dnodt += shll / sinim;
  } // ----------- calculate deep space resonance effects --------


  var dndt = 0.0;
  var theta = (gsto + tc * rptim) % twoPi;
  em += dedt * t;
  inclm += didt * t;
  argpm += domdt * t;
  nodem += dnodt * t;
  mm += dmdt * t; // sgp4fix for negative inclinations
  // the following if statement should be commented out
  // if (inclm < 0.0)
  // {
  //   inclm  = -inclm;
  //   argpm  = argpm - pi;
  //   nodem = nodem + pi;
  // }
  // -------------- initialize the resonance terms -------------

  if (irez !== 0) {
    aonv = Math.pow(nm / xke, x2o3); // ---------- geopotential resonance for 12 hour orbits ------

    if (irez === 2) {
      cosisq = cosim * cosim;
      var emo = em;
      em = ecco;
      var emsqo = emsq;
      emsq = eccsq;
      eoc = em * emsq;
      g201 = -0.306 - (em - 0.64) * 0.440;

      if (em <= 0.65) {
        g211 = 3.616 - 13.2470 * em + 16.2900 * emsq;
        g310 = -19.302 + 117.3900 * em - 228.4190 * emsq + 156.5910 * eoc;
        g322 = -18.9068 + 109.7927 * em - 214.6334 * emsq + 146.5816 * eoc;
        g410 = -41.122 + 242.6940 * em - 471.0940 * emsq + 313.9530 * eoc;
        g422 = -146.407 + 841.8800 * em - 1629.014 * emsq + 1083.4350 * eoc;
        g520 = -532.114 + 3017.977 * em - 5740.032 * emsq + 3708.2760 * eoc;
      } else {
        g211 = -72.099 + 331.819 * em - 508.738 * emsq + 266.724 * eoc;
        g310 = -346.844 + 1582.851 * em - 2415.925 * emsq + 1246.113 * eoc;
        g322 = -342.585 + 1554.908 * em - 2366.899 * emsq + 1215.972 * eoc;
        g410 = -1052.797 + 4758.686 * em - 7193.992 * emsq + 3651.957 * eoc;
        g422 = -3581.690 + 16178.110 * em - 24462.770 * emsq + 12422.520 * eoc;

        if (em > 0.715) {
          g520 = -5149.66 + 29936.92 * em - 54087.36 * emsq + 31324.56 * eoc;
        } else {
          g520 = 1464.74 - 4664.75 * em + 3763.64 * emsq;
        }
      }

      if (em < 0.7) {
        g533 = -919.22770 + 4988.6100 * em - 9064.7700 * emsq + 5542.21 * eoc;
        g521 = -822.71072 + 4568.6173 * em - 8491.4146 * emsq + 5337.524 * eoc;
        g532 = -853.66600 + 4690.2500 * em - 8624.7700 * emsq + 5341.4 * eoc;
      } else {
        g533 = -37995.780 + 161616.52 * em - 229838.20 * emsq + 109377.94 * eoc;
        g521 = -51752.104 + 218913.95 * em - 309468.16 * emsq + 146349.42 * eoc;
        g532 = -40023.880 + 170470.89 * em - 242699.48 * emsq + 115605.82 * eoc;
      }

      sini2 = sinim * sinim;
      f220 = 0.75 * (1.0 + 2.0 * cosim + cosisq);
      f221 = 1.5 * sini2;
      f321 = 1.875 * sinim * (1.0 - 2.0 * cosim - 3.0 * cosisq);
      f322 = -1.875 * sinim * (1.0 + 2.0 * cosim - 3.0 * cosisq);
      f441 = 35.0 * sini2 * f220;
      f442 = 39.3750 * sini2 * sini2;
      f522 = 9.84375 * sinim * (sini2 * (1.0 - 2.0 * cosim - 5.0 * cosisq) + 0.33333333 * (-2.0 + 4.0 * cosim + 6.0 * cosisq));
      f523 = sinim * (4.92187512 * sini2 * (-2.0 - 4.0 * cosim + 10.0 * cosisq) + 6.56250012 * (1.0 + 2.0 * cosim - 3.0 * cosisq));
      f542 = 29.53125 * sinim * (2.0 - 8.0 * cosim + cosisq * (-12.0 + 8.0 * cosim + 10.0 * cosisq));
      f543 = 29.53125 * sinim * (-2.0 - 8.0 * cosim + cosisq * (12.0 + 8.0 * cosim - 10.0 * cosisq));
      xno2 = nm * nm;
      ainv2 = aonv * aonv;
      temp1 = 3.0 * xno2 * ainv2;
      temp = temp1 * root22;
      d2201 = temp * f220 * g201;
      d2211 = temp * f221 * g211;
      temp1 *= aonv;
      temp = temp1 * root32;
      d3210 = temp * f321 * g310;
      d3222 = temp * f322 * g322;
      temp1 *= aonv;
      temp = 2.0 * temp1 * root44;
      d4410 = temp * f441 * g410;
      d4422 = temp * f442 * g422;
      temp1 *= aonv;
      temp = temp1 * root52;
      d5220 = temp * f522 * g520;
      d5232 = temp * f523 * g532;
      temp = 2.0 * temp1 * root54;
      d5421 = temp * f542 * g521;
      d5433 = temp * f543 * g533;
      xlamo = (mo + nodeo + nodeo - (theta + theta)) % twoPi;
      xfact = mdot + dmdt + 2.0 * (nodedot + dnodt - rptim) - no;
      em = emo;
      emsq = emsqo;
    } //  ---------------- synchronous resonance terms --------------


    if (irez === 1) {
      g200 = 1.0 + emsq * (-2.5 + 0.8125 * emsq);
      g310 = 1.0 + 2.0 * emsq;
      g300 = 1.0 + emsq * (-6.0 + 6.60937 * emsq);
      f220 = 0.75 * (1.0 + cosim) * (1.0 + cosim);
      f311 = 0.9375 * sinim * sinim * (1.0 + 3.0 * cosim) - 0.75 * (1.0 + cosim);
      f330 = 1.0 + cosim;
      f330 *= 1.875 * f330 * f330;
      del1 = 3.0 * nm * nm * aonv * aonv;
      del2 = 2.0 * del1 * f220 * g200 * q22;
      del3 = 3.0 * del1 * f330 * g300 * q33 * aonv;
      del1 = del1 * f311 * g310 * q31 * aonv;
      xlamo = (mo + nodeo + argpo - theta) % twoPi;
      xfact = mdot + xpidot + dmdt + domdt + dnodt - (no + rptim);
    } //  ------------ for sgp4, initialize the integrator ----------


    xli = xlamo;
    xni = no;
    atime = 0.0;
    nm = no + dndt;
  }

  return {
    em: em,
    argpm: argpm,
    inclm: inclm,
    mm: mm,
    nm: nm,
    nodem: nodem,
    irez: irez,
    atime: atime,
    d2201: d2201,
    d2211: d2211,
    d3210: d3210,
    d3222: d3222,
    d4410: d4410,
    d4422: d4422,
    d5220: d5220,
    d5232: d5232,
    d5421: d5421,
    d5433: d5433,
    dedt: dedt,
    didt: didt,
    dmdt: dmdt,
    dndt: dndt,
    dnodt: dnodt,
    domdt: domdt,
    del1: del1,
    del2: del2,
    del3: del3,
    xfact: xfact,
    xlamo: xlamo,
    xli: xli,
    xni: xni
  };
}
/* -----------------------------------------------------------------------------
 *
 *                           function gstime
 *
 *  this function finds the greenwich sidereal time.
 *
 *  author        : david vallado                  719-573-2600    1 mar 2001
 *
 *  inputs          description                    range / units
 *    jdut1       - julian date in ut1             days from 4713 bc
 *
 *  outputs       :
 *    gstime      - greenwich sidereal time        0 to 2pi rad
 *
 *  locals        :
 *    temp        - temporary variable for doubles   rad
 *    tut1        - julian centuries from the
 *                  jan 1, 2000 12 h epoch (ut1)
 *
 *  coupling      :
 *    none
 *
 *  references    :
 *    vallado       2004, 191, eq 3-45
 * --------------------------------------------------------------------------- */


function gstimeInternal(jdut1) {
  var tut1 = (jdut1 - 2451545.0) / 36525.0;
  var temp = -6.2e-6 * tut1 * tut1 * tut1 + 0.093104 * tut1 * tut1 + (876600.0 * 3600 + 8640184.812866) * tut1 + 67310.54841; // # sec

  temp = temp * deg2rad / 240.0 % twoPi; // 360/86400 = 1/240, to deg, to rad
  //  ------------------------ check quadrants ---------------------

  if (temp < 0.0) {
    temp += twoPi;
  }

  return temp;
}

function gstime() {
  if ((arguments.length <= 0 ? undefined : arguments[0]) instanceof Date || arguments.length > 1) {
    return gstimeInternal(jday.apply(void 0, arguments));
  }

  return gstimeInternal.apply(void 0, arguments);
}
/*-----------------------------------------------------------------------------
 *
 *                           procedure initl
 *
 *  this procedure initializes the sgp4 propagator. all the initialization is
 *    consolidated here instead of having multiple loops inside other routines.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    ecco        - eccentricity                           0.0 - 1.0
 *    epoch       - epoch time in days from jan 0, 1950. 0 hr
 *    inclo       - inclination of satellite
 *    no          - mean motion of satellite
 *    satn        - satellite number
 *
 *  outputs       :
 *    ainv        - 1.0 / a
 *    ao          - semi major axis
 *    con41       -
 *    con42       - 1.0 - 5.0 cos(i)
 *    cosio       - cosine of inclination
 *    cosio2      - cosio squared
 *    eccsq       - eccentricity squared
 *    method      - flag for deep space                    'd', 'n'
 *    omeosq      - 1.0 - ecco * ecco
 *    posq        - semi-parameter squared
 *    rp          - radius of perigee
 *    rteosq      - square root of (1.0 - ecco*ecco)
 *    sinio       - sine of inclination
 *    gsto        - gst at time of observation               rad
 *    no          - mean motion of satellite
 *
 *  locals        :
 *    ak          -
 *    d1          -
 *    del         -
 *    adel        -
 *    po          -
 *
 *  coupling      :
 *    getgravconst
 *    gstime      - find greenwich sidereal time from the julian date
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report #3 1980
 *    hoots, norad spacetrack report #6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/


function initl(options) {
  var ecco = options.ecco,
      epoch = options.epoch,
      inclo = options.inclo,
      opsmode = options.opsmode;
  var no = options.no; // sgp4fix use old way of finding gst
  // ----------------------- earth constants ---------------------
  // sgp4fix identify constants and allow alternate values
  // ------------- calculate auxillary epoch quantities ----------

  var eccsq = ecco * ecco;
  var omeosq = 1.0 - eccsq;
  var rteosq = Math.sqrt(omeosq);
  var cosio = Math.cos(inclo);
  var cosio2 = cosio * cosio; // ------------------ un-kozai the mean motion -----------------

  var ak = Math.pow(xke / no, x2o3);
  var d1 = 0.75 * j2 * (3.0 * cosio2 - 1.0) / (rteosq * omeosq);
  var delPrime = d1 / (ak * ak);
  var adel = ak * (1.0 - delPrime * delPrime - delPrime * (1.0 / 3.0 + 134.0 * delPrime * delPrime / 81.0));
  delPrime = d1 / (adel * adel);
  no /= 1.0 + delPrime;
  var ao = Math.pow(xke / no, x2o3);
  var sinio = Math.sin(inclo);
  var po = ao * omeosq;
  var con42 = 1.0 - 5.0 * cosio2;
  var con41 = -con42 - cosio2 - cosio2;
  var ainv = 1.0 / ao;
  var posq = po * po;
  var rp = ao * (1.0 - ecco);
  var method = 'n'; //  sgp4fix modern approach to finding sidereal time

  var gsto;

  if (opsmode === 'a') {
    //  sgp4fix use old way of finding gst
    //  count integer number of days from 0 jan 1970
    var ts70 = epoch - 7305.0;
    var ds70 = Math.floor(ts70 + 1.0e-8);
    var tfrac = ts70 - ds70; //  find greenwich location at epoch

    var c1 = 1.72027916940703639e-2;
    var thgr70 = 1.7321343856509374;
    var fk5r = 5.07551419432269442e-15;
    var c1p2p = c1 + twoPi;
    gsto = (thgr70 + c1 * ds70 + c1p2p * tfrac + ts70 * ts70 * fk5r) % twoPi;

    if (gsto < 0.0) {
      gsto += twoPi;
    }
  } else {
    gsto = gstime(epoch + 2433281.5);
  }

  return {
    no: no,
    method: method,
    ainv: ainv,
    ao: ao,
    con41: con41,
    con42: con42,
    cosio: cosio,
    cosio2: cosio2,
    eccsq: eccsq,
    omeosq: omeosq,
    posq: posq,
    rp: rp,
    rteosq: rteosq,
    sinio: sinio,
    gsto: gsto
  };
}
/*-----------------------------------------------------------------------------
 *
 *                           procedure dspace
 *
 *  this procedure provides deep space contributions to mean elements for
 *    perturbing third body.  these effects have been averaged over one
 *    revolution of the sun and moon.  for earth resonance effects, the
 *    effects have been averaged over no revolutions of the satellite.
 *    (mean motion)
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    d2201, d2211, d3210, d3222, d4410, d4422, d5220, d5232, d5421, d5433 -
 *    dedt        -
 *    del1, del2, del3  -
 *    didt        -
 *    dmdt        -
 *    dnodt       -
 *    domdt       -
 *    irez        - flag for resonance           0-none, 1-one day, 2-half day
 *    argpo       - argument of perigee
 *    argpdot     - argument of perigee dot (rate)
 *    t           - time
 *    tc          -
 *    gsto        - gst
 *    xfact       -
 *    xlamo       -
 *    no          - mean motion
 *    atime       -
 *    em          - eccentricity
 *    ft          -
 *    argpm       - argument of perigee
 *    inclm       - inclination
 *    xli         -
 *    mm          - mean anomaly
 *    xni         - mean motion
 *    nodem       - right ascension of ascending node
 *
 *  outputs       :
 *    atime       -
 *    em          - eccentricity
 *    argpm       - argument of perigee
 *    inclm       - inclination
 *    xli         -
 *    mm          - mean anomaly
 *    xni         -
 *    nodem       - right ascension of ascending node
 *    dndt        -
 *    nm          - mean motion
 *
 *  locals        :
 *    delt        -
 *    ft          -
 *    theta       -
 *    x2li        -
 *    x2omi       -
 *    xl          -
 *    xldot       -
 *    xnddt       -
 *    xndt        -
 *    xomi        -
 *
 *  coupling      :
 *    none        -
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report #3 1980
 *    hoots, norad spacetrack report #6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/


function dspace(options) {
  var irez = options.irez,
      d2201 = options.d2201,
      d2211 = options.d2211,
      d3210 = options.d3210,
      d3222 = options.d3222,
      d4410 = options.d4410,
      d4422 = options.d4422,
      d5220 = options.d5220,
      d5232 = options.d5232,
      d5421 = options.d5421,
      d5433 = options.d5433,
      dedt = options.dedt,
      del1 = options.del1,
      del2 = options.del2,
      del3 = options.del3,
      didt = options.didt,
      dmdt = options.dmdt,
      dnodt = options.dnodt,
      domdt = options.domdt,
      argpo = options.argpo,
      argpdot = options.argpdot,
      t = options.t,
      tc = options.tc,
      gsto = options.gsto,
      xfact = options.xfact,
      xlamo = options.xlamo,
      no = options.no;
  var atime = options.atime,
      em = options.em,
      argpm = options.argpm,
      inclm = options.inclm,
      xli = options.xli,
      mm = options.mm,
      xni = options.xni,
      nodem = options.nodem,
      nm = options.nm;
  var fasx2 = 0.13130908;
  var fasx4 = 2.8843198;
  var fasx6 = 0.37448087;
  var g22 = 5.7686396;
  var g32 = 0.95240898;
  var g44 = 1.8014998;
  var g52 = 1.0508330;
  var g54 = 4.4108898;
  var rptim = 4.37526908801129966e-3; // equates to 7.29211514668855e-5 rad/sec

  var stepp = 720.0;
  var stepn = -720.0;
  var step2 = 259200.0;
  var delt;
  var x2li;
  var x2omi;
  var xl;
  var xldot;
  var xnddt;
  var xndt;
  var xomi;
  var dndt = 0.0;
  var ft = 0.0; //  ----------- calculate deep space resonance effects -----------

  var theta = (gsto + tc * rptim) % twoPi;
  em += dedt * t;
  inclm += didt * t;
  argpm += domdt * t;
  nodem += dnodt * t;
  mm += dmdt * t; // sgp4fix for negative inclinations
  // the following if statement should be commented out
  // if (inclm < 0.0)
  // {
  //   inclm = -inclm;
  //   argpm = argpm - pi;
  //   nodem = nodem + pi;
  // }

  /* - update resonances : numerical (euler-maclaurin) integration - */

  /* ------------------------- epoch restart ----------------------  */
  //   sgp4fix for propagator problems
  //   the following integration works for negative time steps and periods
  //   the specific changes are unknown because the original code was so convoluted
  // sgp4fix take out atime = 0.0 and fix for faster operation

  if (irez !== 0) {
    //  sgp4fix streamline check
    if (atime === 0.0 || t * atime <= 0.0 || Math.abs(t) < Math.abs(atime)) {
      atime = 0.0;
      xni = no;
      xli = xlamo;
    } // sgp4fix move check outside loop


    if (t > 0.0) {
      delt = stepp;
    } else {
      delt = stepn;
    }

    var iretn = 381; // added for do loop

    while (iretn === 381) {
      //  ------------------- dot terms calculated -------------
      //  ----------- near - synchronous resonance terms -------
      if (irez !== 2) {
        xndt = del1 * Math.sin(xli - fasx2) + del2 * Math.sin(2.0 * (xli - fasx4)) + del3 * Math.sin(3.0 * (xli - fasx6));
        xldot = xni + xfact;
        xnddt = del1 * Math.cos(xli - fasx2) + 2.0 * del2 * Math.cos(2.0 * (xli - fasx4)) + 3.0 * del3 * Math.cos(3.0 * (xli - fasx6));
        xnddt *= xldot;
      } else {
        // --------- near - half-day resonance terms --------
        xomi = argpo + argpdot * atime;
        x2omi = xomi + xomi;
        x2li = xli + xli;
        xndt = d2201 * Math.sin(x2omi + xli - g22) + d2211 * Math.sin(xli - g22) + d3210 * Math.sin(xomi + xli - g32) + d3222 * Math.sin(-xomi + xli - g32) + d4410 * Math.sin(x2omi + x2li - g44) + d4422 * Math.sin(x2li - g44) + d5220 * Math.sin(xomi + xli - g52) + d5232 * Math.sin(-xomi + xli - g52) + d5421 * Math.sin(xomi + x2li - g54) + d5433 * Math.sin(-xomi + x2li - g54);
        xldot = xni + xfact;
        xnddt = d2201 * Math.cos(x2omi + xli - g22) + d2211 * Math.cos(xli - g22) + d3210 * Math.cos(xomi + xli - g32) + d3222 * Math.cos(-xomi + xli - g32) + d5220 * Math.cos(xomi + xli - g52) + d5232 * Math.cos(-xomi + xli - g52) + 2.0 * d4410 * Math.cos(x2omi + x2li - g44) + d4422 * Math.cos(x2li - g44) + d5421 * Math.cos(xomi + x2li - g54) + d5433 * Math.cos(-xomi + x2li - g54);
        xnddt *= xldot;
      } //  ----------------------- integrator -------------------
      //  sgp4fix move end checks to end of routine


      if (Math.abs(t - atime) >= stepp) {
        iretn = 381;
      } else {
        ft = t - atime;
        iretn = 0;
      }

      if (iretn === 381) {
        xli += xldot * delt + xndt * step2;
        xni += xndt * delt + xnddt * step2;
        atime += delt;
      }
    }

    nm = xni + xndt * ft + xnddt * ft * ft * 0.5;
    xl = xli + xldot * ft + xndt * ft * ft * 0.5;

    if (irez !== 1) {
      mm = xl - 2.0 * nodem + 2.0 * theta;
      dndt = nm - no;
    } else {
      mm = xl - nodem - argpm + theta;
      dndt = nm - no;
    }

    nm = no + dndt;
  }

  return {
    atime: atime,
    em: em,
    argpm: argpm,
    inclm: inclm,
    xli: xli,
    mm: mm,
    xni: xni,
    nodem: nodem,
    dndt: dndt,
    nm: nm
  };
}
/*----------------------------------------------------------------------------
 *
 *                             procedure sgp4
 *
 *  this procedure is the sgp4 prediction model from space command. this is an
 *    updated and combined version of sgp4 and sdp4, which were originally
 *    published separately in spacetrack report //3. this version follows the
 *    methodology from the aiaa paper (2006) describing the history and
 *    development of the code.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    satrec  - initialised structure from sgp4init() call.
 *    tsince  - time since epoch (minutes)
 *
 *  outputs       :
 *    r           - position vector                     km
 *    v           - velocity                            km/sec
 *  return code - non-zero on error.
 *                   1 - mean elements, ecc >= 1.0 or ecc < -0.001 or a < 0.95 er
 *                   2 - mean motion less than 0.0
 *                   3 - pert elements, ecc < 0.0  or  ecc > 1.0
 *                   4 - semi-latus rectum < 0.0
 *                   5 - epoch elements are sub-orbital
 *                   6 - satellite has decayed
 *
 *  locals        :
 *    am          -
 *    axnl, aynl        -
 *    betal       -
 *    cosim   , sinim   , cosomm  , sinomm  , cnod    , snod    , cos2u   ,
 *    sin2u   , coseo1  , sineo1  , cosi    , sini    , cosip   , sinip   ,
 *    cosisq  , cossu   , sinsu   , cosu    , sinu
 *    delm        -
 *    delomg      -
 *    dndt        -
 *    eccm        -
 *    emsq        -
 *    ecose       -
 *    el2         -
 *    eo1         -
 *    eccp        -
 *    esine       -
 *    argpm       -
 *    argpp       -
 *    omgadf      -
 *    pl          -
 *    r           -
 *    rtemsq      -
 *    rdotl       -
 *    rl          -
 *    rvdot       -
 *    rvdotl      -
 *    su          -
 *    t2  , t3   , t4    , tc
 *    tem5, temp , temp1 , temp2  , tempa  , tempe  , templ
 *    u   , ux   , uy    , uz     , vx     , vy     , vz
 *    inclm       - inclination
 *    mm          - mean anomaly
 *    nm          - mean motion
 *    nodem       - right asc of ascending node
 *    xinc        -
 *    xincp       -
 *    xl          -
 *    xlm         -
 *    mp          -
 *    xmdf        -
 *    xmx         -
 *    xmy         -
 *    nodedf      -
 *    xnode       -
 *    nodep       -
 *    np          -
 *
 *  coupling      :
 *    getgravconst-
 *    dpper
 *    dspace
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report //3 1980
 *    hoots, norad spacetrack report //6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/


function sgp4(satrec, tsince) {
  /* eslint-disable no-param-reassign */
  var coseo1;
  var sineo1;
  var cosip;
  var sinip;
  var cosisq;
  var delm;
  var delomg;
  var eo1;
  var argpm;
  var argpp;
  var su;
  var t3;
  var t4;
  var tc;
  var tem5;
  var temp;
  var tempa;
  var tempe;
  var templ;
  var inclm;
  var mm;
  var nm;
  var nodem;
  var xincp;
  var xlm;
  var mp;
  var nodep;
  /* ------------------ set mathematical constants --------------- */
  // sgp4fix divisor for divide by zero check on inclination
  // the old check used 1.0 + cos(pi-1.0e-9), but then compared it to
  // 1.5 e-12, so the threshold was changed to 1.5e-12 for consistency

  var temp4 = 1.5e-12; // --------------------- clear sgp4 error flag -----------------

  satrec.t = tsince;
  satrec.error = 0; //  ------- update for secular gravity and atmospheric drag -----

  var xmdf = satrec.mo + satrec.mdot * satrec.t;
  var argpdf = satrec.argpo + satrec.argpdot * satrec.t;
  var nodedf = satrec.nodeo + satrec.nodedot * satrec.t;
  argpm = argpdf;
  mm = xmdf;
  var t2 = satrec.t * satrec.t;
  nodem = nodedf + satrec.nodecf * t2;
  tempa = 1.0 - satrec.cc1 * satrec.t;
  tempe = satrec.bstar * satrec.cc4 * satrec.t;
  templ = satrec.t2cof * t2;

  if (satrec.isimp !== 1) {
    delomg = satrec.omgcof * satrec.t; //  sgp4fix use mutliply for speed instead of pow

    var delmtemp = 1.0 + satrec.eta * Math.cos(xmdf);
    delm = satrec.xmcof * (delmtemp * delmtemp * delmtemp - satrec.delmo);
    temp = delomg + delm;
    mm = xmdf + temp;
    argpm = argpdf - temp;
    t3 = t2 * satrec.t;
    t4 = t3 * satrec.t;
    tempa = tempa - satrec.d2 * t2 - satrec.d3 * t3 - satrec.d4 * t4;
    tempe += satrec.bstar * satrec.cc5 * (Math.sin(mm) - satrec.sinmao);
    templ = templ + satrec.t3cof * t3 + t4 * (satrec.t4cof + satrec.t * satrec.t5cof);
  }

  nm = satrec.no;
  var em = satrec.ecco;
  inclm = satrec.inclo;

  if (satrec.method === 'd') {
    tc = satrec.t;
    var dspaceOptions = {
      irez: satrec.irez,
      d2201: satrec.d2201,
      d2211: satrec.d2211,
      d3210: satrec.d3210,
      d3222: satrec.d3222,
      d4410: satrec.d4410,
      d4422: satrec.d4422,
      d5220: satrec.d5220,
      d5232: satrec.d5232,
      d5421: satrec.d5421,
      d5433: satrec.d5433,
      dedt: satrec.dedt,
      del1: satrec.del1,
      del2: satrec.del2,
      del3: satrec.del3,
      didt: satrec.didt,
      dmdt: satrec.dmdt,
      dnodt: satrec.dnodt,
      domdt: satrec.domdt,
      argpo: satrec.argpo,
      argpdot: satrec.argpdot,
      t: satrec.t,
      tc: tc,
      gsto: satrec.gsto,
      xfact: satrec.xfact,
      xlamo: satrec.xlamo,
      no: satrec.no,
      atime: satrec.atime,
      em: em,
      argpm: argpm,
      inclm: inclm,
      xli: satrec.xli,
      mm: mm,
      xni: satrec.xni,
      nodem: nodem,
      nm: nm
    };
    var dspaceResult = dspace(dspaceOptions);
    em = dspaceResult.em;
    argpm = dspaceResult.argpm;
    inclm = dspaceResult.inclm;
    mm = dspaceResult.mm;
    nodem = dspaceResult.nodem;
    nm = dspaceResult.nm;
  }

  if (nm <= 0.0) {
    // printf("// error nm %f\n", nm);
    satrec.error = 2; // sgp4fix add return

    return [false, false];
  }

  var am = Math.pow(xke / nm, x2o3) * tempa * tempa;
  nm = xke / Math.pow(am, 1.5);
  em -= tempe; // fix tolerance for error recognition
  // sgp4fix am is fixed from the previous nm check

  if (em >= 1.0 || em < -0.001) {
    // || (am < 0.95)
    // printf("// error em %f\n", em);
    satrec.error = 1; // sgp4fix to return if there is an error in eccentricity

    return [false, false];
  } //  sgp4fix fix tolerance to avoid a divide by zero


  if (em < 1.0e-6) {
    em = 1.0e-6;
  }

  mm += satrec.no * templ;
  xlm = mm + argpm + nodem;
  nodem %= twoPi;
  argpm %= twoPi;
  xlm %= twoPi;
  mm = (xlm - argpm - nodem) % twoPi; // ----------------- compute extra mean quantities -------------

  var sinim = Math.sin(inclm);
  var cosim = Math.cos(inclm); // -------------------- add lunar-solar periodics --------------

  var ep = em;
  xincp = inclm;
  argpp = argpm;
  nodep = nodem;
  mp = mm;
  sinip = sinim;
  cosip = cosim;

  if (satrec.method === 'd') {
    var dpperParameters = {
      inclo: satrec.inclo,
      init: 'n',
      ep: ep,
      inclp: xincp,
      nodep: nodep,
      argpp: argpp,
      mp: mp,
      opsmode: satrec.operationmode
    };
    var dpperResult = dpper(satrec, dpperParameters);
    ep = dpperResult.ep;
    nodep = dpperResult.nodep;
    argpp = dpperResult.argpp;
    mp = dpperResult.mp;
    xincp = dpperResult.inclp;

    if (xincp < 0.0) {
      xincp = -xincp;
      nodep += pi;
      argpp -= pi;
    }

    if (ep < 0.0 || ep > 1.0) {
      //  printf("// error ep %f\n", ep);
      satrec.error = 3; //  sgp4fix add return

      return [false, false];
    }
  } //  -------------------- long period periodics ------------------


  if (satrec.method === 'd') {
    sinip = Math.sin(xincp);
    cosip = Math.cos(xincp);
    satrec.aycof = -0.5 * j3oj2 * sinip; //  sgp4fix for divide by zero for xincp = 180 deg

    if (Math.abs(cosip + 1.0) > 1.5e-12) {
      satrec.xlcof = -0.25 * j3oj2 * sinip * (3.0 + 5.0 * cosip) / (1.0 + cosip);
    } else {
      satrec.xlcof = -0.25 * j3oj2 * sinip * (3.0 + 5.0 * cosip) / temp4;
    }
  }

  var axnl = ep * Math.cos(argpp);
  temp = 1.0 / (am * (1.0 - ep * ep));
  var aynl = ep * Math.sin(argpp) + temp * satrec.aycof;
  var xl = mp + argpp + nodep + temp * satrec.xlcof * axnl; // --------------------- solve kepler's equation ---------------

  var u = (xl - nodep) % twoPi;
  eo1 = u;
  tem5 = 9999.9;
  var ktr = 1; //    sgp4fix for kepler iteration
  //    the following iteration needs better limits on corrections

  while (Math.abs(tem5) >= 1.0e-12 && ktr <= 10) {
    sineo1 = Math.sin(eo1);
    coseo1 = Math.cos(eo1);
    tem5 = 1.0 - coseo1 * axnl - sineo1 * aynl;
    tem5 = (u - aynl * coseo1 + axnl * sineo1 - eo1) / tem5;

    if (Math.abs(tem5) >= 0.95) {
      if (tem5 > 0.0) {
        tem5 = 0.95;
      } else {
        tem5 = -0.95;
      }
    }

    eo1 += tem5;
    ktr += 1;
  } //  ------------- short period preliminary quantities -----------


  var ecose = axnl * coseo1 + aynl * sineo1;
  var esine = axnl * sineo1 - aynl * coseo1;
  var el2 = axnl * axnl + aynl * aynl;
  var pl = am * (1.0 - el2);

  if (pl < 0.0) {
    //  printf("// error pl %f\n", pl);
    satrec.error = 4; //  sgp4fix add return

    return [false, false];
  }

  var rl = am * (1.0 - ecose);
  var rdotl = Math.sqrt(am) * esine / rl;
  var rvdotl = Math.sqrt(pl) / rl;
  var betal = Math.sqrt(1.0 - el2);
  temp = esine / (1.0 + betal);
  var sinu = am / rl * (sineo1 - aynl - axnl * temp);
  var cosu = am / rl * (coseo1 - axnl + aynl * temp);
  su = Math.atan2(sinu, cosu);
  var sin2u = (cosu + cosu) * sinu;
  var cos2u = 1.0 - 2.0 * sinu * sinu;
  temp = 1.0 / pl;
  var temp1 = 0.5 * j2 * temp;
  var temp2 = temp1 * temp; // -------------- update for short period periodics ------------

  if (satrec.method === 'd') {
    cosisq = cosip * cosip;
    satrec.con41 = 3.0 * cosisq - 1.0;
    satrec.x1mth2 = 1.0 - cosisq;
    satrec.x7thm1 = 7.0 * cosisq - 1.0;
  }

  var mrt = rl * (1.0 - 1.5 * temp2 * betal * satrec.con41) + 0.5 * temp1 * satrec.x1mth2 * cos2u; // sgp4fix for decaying satellites

  if (mrt < 1.0) {
    // printf("// decay condition %11.6f \n",mrt);
    satrec.error = 6;
    return {
      position: false,
      velocity: false
    };
  }

  su -= 0.25 * temp2 * satrec.x7thm1 * sin2u;
  var xnode = nodep + 1.5 * temp2 * cosip * sin2u;
  var xinc = xincp + 1.5 * temp2 * cosip * sinip * cos2u;
  var mvt = rdotl - nm * temp1 * satrec.x1mth2 * sin2u / xke;
  var rvdot = rvdotl + nm * temp1 * (satrec.x1mth2 * cos2u + 1.5 * satrec.con41) / xke; // --------------------- orientation vectors -------------------

  var sinsu = Math.sin(su);
  var cossu = Math.cos(su);
  var snod = Math.sin(xnode);
  var cnod = Math.cos(xnode);
  var sini = Math.sin(xinc);
  var cosi = Math.cos(xinc);
  var xmx = -snod * cosi;
  var xmy = cnod * cosi;
  var ux = xmx * sinsu + cnod * cossu;
  var uy = xmy * sinsu + snod * cossu;
  var uz = sini * sinsu;
  var vx = xmx * cossu - cnod * sinsu;
  var vy = xmy * cossu - snod * sinsu;
  var vz = sini * cossu; // --------- position and velocity (in km and km/sec) ----------

  var r = {
    x: mrt * ux * earthRadius,
    y: mrt * uy * earthRadius,
    z: mrt * uz * earthRadius
  };
  var v = {
    x: (mvt * ux + rvdot * vx) * vkmpersec,
    y: (mvt * uy + rvdot * vy) * vkmpersec,
    z: (mvt * uz + rvdot * vz) * vkmpersec
  };
  return {
    position: r,
    velocity: v
  };
  /* eslint-enable no-param-reassign */
}
/*-----------------------------------------------------------------------------
 *
 *                             procedure sgp4init
 *
 *  this procedure initializes variables for sgp4.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    opsmode     - mode of operation afspc or improved 'a', 'i'
 *    satn        - satellite number
 *    bstar       - sgp4 type drag coefficient              kg/m2er
 *    ecco        - eccentricity
 *    epoch       - epoch time in days from jan 0, 1950. 0 hr
 *    argpo       - argument of perigee (output if ds)
 *    inclo       - inclination
 *    mo          - mean anomaly (output if ds)
 *    no          - mean motion
 *    nodeo       - right ascension of ascending node
 *
 *  outputs       :
 *    rec      - common values for subsequent calls
 *    return code - non-zero on error.
 *                   1 - mean elements, ecc >= 1.0 or ecc < -0.001 or a < 0.95 er
 *                   2 - mean motion less than 0.0
 *                   3 - pert elements, ecc < 0.0  or  ecc > 1.0
 *                   4 - semi-latus rectum < 0.0
 *                   5 - epoch elements are sub-orbital
 *                   6 - satellite has decayed
 *
 *  locals        :
 *    cnodm  , snodm  , cosim  , sinim  , cosomm , sinomm
 *    cc1sq  , cc2    , cc3
 *    coef   , coef1
 *    cosio4      -
 *    day         -
 *    dndt        -
 *    em          - eccentricity
 *    emsq        - eccentricity squared
 *    eeta        -
 *    etasq       -
 *    gam         -
 *    argpm       - argument of perigee
 *    nodem       -
 *    inclm       - inclination
 *    mm          - mean anomaly
 *    nm          - mean motion
 *    perige      - perigee
 *    pinvsq      -
 *    psisq       -
 *    qzms24      -
 *    rtemsq      -
 *    s1, s2, s3, s4, s5, s6, s7          -
 *    sfour       -
 *    ss1, ss2, ss3, ss4, ss5, ss6, ss7         -
 *    sz1, sz2, sz3
 *    sz11, sz12, sz13, sz21, sz22, sz23, sz31, sz32, sz33        -
 *    tc          -
 *    temp        -
 *    temp1, temp2, temp3       -
 *    tsi         -
 *    xpidot      -
 *    xhdot1      -
 *    z1, z2, z3          -
 *    z11, z12, z13, z21, z22, z23, z31, z32, z33         -
 *
 *  coupling      :
 *    getgravconst-
 *    initl       -
 *    dscom       -
 *    dpper       -
 *    dsinit      -
 *    sgp4        -
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report #3 1980
 *    hoots, norad spacetrack report #6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/


function sgp4init(satrec, options) {
  /* eslint-disable no-param-reassign */
  var opsmode = options.opsmode,
      satn = options.satn,
      epoch = options.epoch,
      xbstar = options.xbstar,
      xecco = options.xecco,
      xargpo = options.xargpo,
      xinclo = options.xinclo,
      xmo = options.xmo,
      xno = options.xno,
      xnodeo = options.xnodeo;
  var cosim;
  var sinim;
  var cc1sq;
  var cc2;
  var cc3;
  var coef;
  var coef1;
  var cosio4;
  var em;
  var emsq;
  var eeta;
  var etasq;
  var argpm;
  var nodem;
  var inclm;
  var mm;
  var nm;
  var perige;
  var pinvsq;
  var psisq;
  var qzms24;
  var s1;
  var s2;
  var s3;
  var s4;
  var s5;
  var sfour;
  var ss1;
  var ss2;
  var ss3;
  var ss4;
  var ss5;
  var sz1;
  var sz3;
  var sz11;
  var sz13;
  var sz21;
  var sz23;
  var sz31;
  var sz33;
  var tc;
  var temp;
  var temp1;
  var temp2;
  var temp3;
  var tsi;
  var xpidot;
  var xhdot1;
  var z1;
  var z3;
  var z11;
  var z13;
  var z21;
  var z23;
  var z31;
  var z33;
  /* ------------------------ initialization --------------------- */
  // sgp4fix divisor for divide by zero check on inclination
  // the old check used 1.0 + Math.cos(pi-1.0e-9), but then compared it to
  // 1.5 e-12, so the threshold was changed to 1.5e-12 for consistency

  var temp4 = 1.5e-12; // ----------- set all near earth variables to zero ------------

  satrec.isimp = 0;
  satrec.method = 'n';
  satrec.aycof = 0.0;
  satrec.con41 = 0.0;
  satrec.cc1 = 0.0;
  satrec.cc4 = 0.0;
  satrec.cc5 = 0.0;
  satrec.d2 = 0.0;
  satrec.d3 = 0.0;
  satrec.d4 = 0.0;
  satrec.delmo = 0.0;
  satrec.eta = 0.0;
  satrec.argpdot = 0.0;
  satrec.omgcof = 0.0;
  satrec.sinmao = 0.0;
  satrec.t = 0.0;
  satrec.t2cof = 0.0;
  satrec.t3cof = 0.0;
  satrec.t4cof = 0.0;
  satrec.t5cof = 0.0;
  satrec.x1mth2 = 0.0;
  satrec.x7thm1 = 0.0;
  satrec.mdot = 0.0;
  satrec.nodedot = 0.0;
  satrec.xlcof = 0.0;
  satrec.xmcof = 0.0;
  satrec.nodecf = 0.0; // ----------- set all deep space variables to zero ------------

  satrec.irez = 0;
  satrec.d2201 = 0.0;
  satrec.d2211 = 0.0;
  satrec.d3210 = 0.0;
  satrec.d3222 = 0.0;
  satrec.d4410 = 0.0;
  satrec.d4422 = 0.0;
  satrec.d5220 = 0.0;
  satrec.d5232 = 0.0;
  satrec.d5421 = 0.0;
  satrec.d5433 = 0.0;
  satrec.dedt = 0.0;
  satrec.del1 = 0.0;
  satrec.del2 = 0.0;
  satrec.del3 = 0.0;
  satrec.didt = 0.0;
  satrec.dmdt = 0.0;
  satrec.dnodt = 0.0;
  satrec.domdt = 0.0;
  satrec.e3 = 0.0;
  satrec.ee2 = 0.0;
  satrec.peo = 0.0;
  satrec.pgho = 0.0;
  satrec.pho = 0.0;
  satrec.pinco = 0.0;
  satrec.plo = 0.0;
  satrec.se2 = 0.0;
  satrec.se3 = 0.0;
  satrec.sgh2 = 0.0;
  satrec.sgh3 = 0.0;
  satrec.sgh4 = 0.0;
  satrec.sh2 = 0.0;
  satrec.sh3 = 0.0;
  satrec.si2 = 0.0;
  satrec.si3 = 0.0;
  satrec.sl2 = 0.0;
  satrec.sl3 = 0.0;
  satrec.sl4 = 0.0;
  satrec.gsto = 0.0;
  satrec.xfact = 0.0;
  satrec.xgh2 = 0.0;
  satrec.xgh3 = 0.0;
  satrec.xgh4 = 0.0;
  satrec.xh2 = 0.0;
  satrec.xh3 = 0.0;
  satrec.xi2 = 0.0;
  satrec.xi3 = 0.0;
  satrec.xl2 = 0.0;
  satrec.xl3 = 0.0;
  satrec.xl4 = 0.0;
  satrec.xlamo = 0.0;
  satrec.zmol = 0.0;
  satrec.zmos = 0.0;
  satrec.atime = 0.0;
  satrec.xli = 0.0;
  satrec.xni = 0.0; // sgp4fix - note the following variables are also passed directly via satrec.
  // it is possible to streamline the sgp4init call by deleting the "x"
  // variables, but the user would need to set the satrec.* values first. we
  // include the additional assignments in case twoline2rv is not used.

  satrec.bstar = xbstar;
  satrec.ecco = xecco;
  satrec.argpo = xargpo;
  satrec.inclo = xinclo;
  satrec.mo = xmo;
  satrec.no = xno;
  satrec.nodeo = xnodeo; //  sgp4fix add opsmode

  satrec.operationmode = opsmode; // ------------------------ earth constants -----------------------
  // sgp4fix identify constants and allow alternate values

  var ss = 78.0 / earthRadius + 1.0; // sgp4fix use multiply for speed instead of pow

  var qzms2ttemp = (120.0 - 78.0) / earthRadius;
  var qzms2t = qzms2ttemp * qzms2ttemp * qzms2ttemp * qzms2ttemp;
  satrec.init = 'y';
  satrec.t = 0.0;
  var initlOptions = {
    satn: satn,
    ecco: satrec.ecco,
    epoch: epoch,
    inclo: satrec.inclo,
    no: satrec.no,
    method: satrec.method,
    opsmode: satrec.operationmode
  };
  var initlResult = initl(initlOptions);
  var ao = initlResult.ao,
      con42 = initlResult.con42,
      cosio = initlResult.cosio,
      cosio2 = initlResult.cosio2,
      eccsq = initlResult.eccsq,
      omeosq = initlResult.omeosq,
      posq = initlResult.posq,
      rp = initlResult.rp,
      rteosq = initlResult.rteosq,
      sinio = initlResult.sinio;
  satrec.no = initlResult.no;
  satrec.con41 = initlResult.con41;
  satrec.gsto = initlResult.gsto;
  satrec.error = 0; // sgp4fix remove this check as it is unnecessary
  // the mrt check in sgp4 handles decaying satellite cases even if the starting
  // condition is below the surface of te earth
  // if (rp < 1.0)
  // {
  //   printf("// *** satn%d epoch elts sub-orbital ***\n", satn);
  //   satrec.error = 5;
  // }

  if (omeosq >= 0.0 || satrec.no >= 0.0) {
    satrec.isimp = 0;

    if (rp < 220.0 / earthRadius + 1.0) {
      satrec.isimp = 1;
    }

    sfour = ss;
    qzms24 = qzms2t;
    perige = (rp - 1.0) * earthRadius; // - for perigees below 156 km, s and qoms2t are altered -

    if (perige < 156.0) {
      sfour = perige - 78.0;

      if (perige < 98.0) {
        sfour = 20.0;
      } // sgp4fix use multiply for speed instead of pow


      var qzms24temp = (120.0 - sfour) / earthRadius;
      qzms24 = qzms24temp * qzms24temp * qzms24temp * qzms24temp;
      sfour = sfour / earthRadius + 1.0;
    }

    pinvsq = 1.0 / posq;
    tsi = 1.0 / (ao - sfour);
    satrec.eta = ao * satrec.ecco * tsi;
    etasq = satrec.eta * satrec.eta;
    eeta = satrec.ecco * satrec.eta;
    psisq = Math.abs(1.0 - etasq);
    coef = qzms24 * Math.pow(tsi, 4.0);
    coef1 = coef / Math.pow(psisq, 3.5);
    cc2 = coef1 * satrec.no * (ao * (1.0 + 1.5 * etasq + eeta * (4.0 + etasq)) + 0.375 * j2 * tsi / psisq * satrec.con41 * (8.0 + 3.0 * etasq * (8.0 + etasq)));
    satrec.cc1 = satrec.bstar * cc2;
    cc3 = 0.0;

    if (satrec.ecco > 1.0e-4) {
      cc3 = -2.0 * coef * tsi * j3oj2 * satrec.no * sinio / satrec.ecco;
    }

    satrec.x1mth2 = 1.0 - cosio2;
    satrec.cc4 = 2.0 * satrec.no * coef1 * ao * omeosq * (satrec.eta * (2.0 + 0.5 * etasq) + satrec.ecco * (0.5 + 2.0 * etasq) - j2 * tsi / (ao * psisq) * (-3.0 * satrec.con41 * (1.0 - 2.0 * eeta + etasq * (1.5 - 0.5 * eeta)) + 0.75 * satrec.x1mth2 * (2.0 * etasq - eeta * (1.0 + etasq)) * Math.cos(2.0 * satrec.argpo)));
    satrec.cc5 = 2.0 * coef1 * ao * omeosq * (1.0 + 2.75 * (etasq + eeta) + eeta * etasq);
    cosio4 = cosio2 * cosio2;
    temp1 = 1.5 * j2 * pinvsq * satrec.no;
    temp2 = 0.5 * temp1 * j2 * pinvsq;
    temp3 = -0.46875 * j4 * pinvsq * pinvsq * satrec.no;
    satrec.mdot = satrec.no + 0.5 * temp1 * rteosq * satrec.con41 + 0.0625 * temp2 * rteosq * (13.0 - 78.0 * cosio2 + 137.0 * cosio4);
    satrec.argpdot = -0.5 * temp1 * con42 + 0.0625 * temp2 * (7.0 - 114.0 * cosio2 + 395.0 * cosio4) + temp3 * (3.0 - 36.0 * cosio2 + 49.0 * cosio4);
    xhdot1 = -temp1 * cosio;
    satrec.nodedot = xhdot1 + (0.5 * temp2 * (4.0 - 19.0 * cosio2) + 2.0 * temp3 * (3.0 - 7.0 * cosio2)) * cosio;
    xpidot = satrec.argpdot + satrec.nodedot;
    satrec.omgcof = satrec.bstar * cc3 * Math.cos(satrec.argpo);
    satrec.xmcof = 0.0;

    if (satrec.ecco > 1.0e-4) {
      satrec.xmcof = -x2o3 * coef * satrec.bstar / eeta;
    }

    satrec.nodecf = 3.5 * omeosq * xhdot1 * satrec.cc1;
    satrec.t2cof = 1.5 * satrec.cc1; // sgp4fix for divide by zero with xinco = 180 deg

    if (Math.abs(cosio + 1.0) > 1.5e-12) {
      satrec.xlcof = -0.25 * j3oj2 * sinio * (3.0 + 5.0 * cosio) / (1.0 + cosio);
    } else {
      satrec.xlcof = -0.25 * j3oj2 * sinio * (3.0 + 5.0 * cosio) / temp4;
    }

    satrec.aycof = -0.5 * j3oj2 * sinio; // sgp4fix use multiply for speed instead of pow

    var delmotemp = 1.0 + satrec.eta * Math.cos(satrec.mo);
    satrec.delmo = delmotemp * delmotemp * delmotemp;
    satrec.sinmao = Math.sin(satrec.mo);
    satrec.x7thm1 = 7.0 * cosio2 - 1.0; // --------------- deep space initialization -------------

    if (2 * pi / satrec.no >= 225.0) {
      satrec.method = 'd';
      satrec.isimp = 1;
      tc = 0.0;
      inclm = satrec.inclo;
      var dscomOptions = {
        epoch: epoch,
        ep: satrec.ecco,
        argpp: satrec.argpo,
        tc: tc,
        inclp: satrec.inclo,
        nodep: satrec.nodeo,
        np: satrec.no,
        e3: satrec.e3,
        ee2: satrec.ee2,
        peo: satrec.peo,
        pgho: satrec.pgho,
        pho: satrec.pho,
        pinco: satrec.pinco,
        plo: satrec.plo,
        se2: satrec.se2,
        se3: satrec.se3,
        sgh2: satrec.sgh2,
        sgh3: satrec.sgh3,
        sgh4: satrec.sgh4,
        sh2: satrec.sh2,
        sh3: satrec.sh3,
        si2: satrec.si2,
        si3: satrec.si3,
        sl2: satrec.sl2,
        sl3: satrec.sl3,
        sl4: satrec.sl4,
        xgh2: satrec.xgh2,
        xgh3: satrec.xgh3,
        xgh4: satrec.xgh4,
        xh2: satrec.xh2,
        xh3: satrec.xh3,
        xi2: satrec.xi2,
        xi3: satrec.xi3,
        xl2: satrec.xl2,
        xl3: satrec.xl3,
        xl4: satrec.xl4,
        zmol: satrec.zmol,
        zmos: satrec.zmos
      };
      var dscomResult = dscom(dscomOptions);
      satrec.e3 = dscomResult.e3;
      satrec.ee2 = dscomResult.ee2;
      satrec.peo = dscomResult.peo;
      satrec.pgho = dscomResult.pgho;
      satrec.pho = dscomResult.pho;
      satrec.pinco = dscomResult.pinco;
      satrec.plo = dscomResult.plo;
      satrec.se2 = dscomResult.se2;
      satrec.se3 = dscomResult.se3;
      satrec.sgh2 = dscomResult.sgh2;
      satrec.sgh3 = dscomResult.sgh3;
      satrec.sgh4 = dscomResult.sgh4;
      satrec.sh2 = dscomResult.sh2;
      satrec.sh3 = dscomResult.sh3;
      satrec.si2 = dscomResult.si2;
      satrec.si3 = dscomResult.si3;
      satrec.sl2 = dscomResult.sl2;
      satrec.sl3 = dscomResult.sl3;
      satrec.sl4 = dscomResult.sl4;
      sinim = dscomResult.sinim;
      cosim = dscomResult.cosim;
      em = dscomResult.em;
      emsq = dscomResult.emsq;
      s1 = dscomResult.s1;
      s2 = dscomResult.s2;
      s3 = dscomResult.s3;
      s4 = dscomResult.s4;
      s5 = dscomResult.s5;
      ss1 = dscomResult.ss1;
      ss2 = dscomResult.ss2;
      ss3 = dscomResult.ss3;
      ss4 = dscomResult.ss4;
      ss5 = dscomResult.ss5;
      sz1 = dscomResult.sz1;
      sz3 = dscomResult.sz3;
      sz11 = dscomResult.sz11;
      sz13 = dscomResult.sz13;
      sz21 = dscomResult.sz21;
      sz23 = dscomResult.sz23;
      sz31 = dscomResult.sz31;
      sz33 = dscomResult.sz33;
      satrec.xgh2 = dscomResult.xgh2;
      satrec.xgh3 = dscomResult.xgh3;
      satrec.xgh4 = dscomResult.xgh4;
      satrec.xh2 = dscomResult.xh2;
      satrec.xh3 = dscomResult.xh3;
      satrec.xi2 = dscomResult.xi2;
      satrec.xi3 = dscomResult.xi3;
      satrec.xl2 = dscomResult.xl2;
      satrec.xl3 = dscomResult.xl3;
      satrec.xl4 = dscomResult.xl4;
      satrec.zmol = dscomResult.zmol;
      satrec.zmos = dscomResult.zmos;
      nm = dscomResult.nm;
      z1 = dscomResult.z1;
      z3 = dscomResult.z3;
      z11 = dscomResult.z11;
      z13 = dscomResult.z13;
      z21 = dscomResult.z21;
      z23 = dscomResult.z23;
      z31 = dscomResult.z31;
      z33 = dscomResult.z33;
      var dpperOptions = {
        inclo: inclm,
        init: satrec.init,
        ep: satrec.ecco,
        inclp: satrec.inclo,
        nodep: satrec.nodeo,
        argpp: satrec.argpo,
        mp: satrec.mo,
        opsmode: satrec.operationmode
      };
      var dpperResult = dpper(satrec, dpperOptions);
      satrec.ecco = dpperResult.ep;
      satrec.inclo = dpperResult.inclp;
      satrec.nodeo = dpperResult.nodep;
      satrec.argpo = dpperResult.argpp;
      satrec.mo = dpperResult.mp;
      argpm = 0.0;
      nodem = 0.0;
      mm = 0.0;
      var dsinitOptions = {
        cosim: cosim,
        emsq: emsq,
        argpo: satrec.argpo,
        s1: s1,
        s2: s2,
        s3: s3,
        s4: s4,
        s5: s5,
        sinim: sinim,
        ss1: ss1,
        ss2: ss2,
        ss3: ss3,
        ss4: ss4,
        ss5: ss5,
        sz1: sz1,
        sz3: sz3,
        sz11: sz11,
        sz13: sz13,
        sz21: sz21,
        sz23: sz23,
        sz31: sz31,
        sz33: sz33,
        t: satrec.t,
        tc: tc,
        gsto: satrec.gsto,
        mo: satrec.mo,
        mdot: satrec.mdot,
        no: satrec.no,
        nodeo: satrec.nodeo,
        nodedot: satrec.nodedot,
        xpidot: xpidot,
        z1: z1,
        z3: z3,
        z11: z11,
        z13: z13,
        z21: z21,
        z23: z23,
        z31: z31,
        z33: z33,
        ecco: satrec.ecco,
        eccsq: eccsq,
        em: em,
        argpm: argpm,
        inclm: inclm,
        mm: mm,
        nm: nm,
        nodem: nodem,
        irez: satrec.irez,
        atime: satrec.atime,
        d2201: satrec.d2201,
        d2211: satrec.d2211,
        d3210: satrec.d3210,
        d3222: satrec.d3222,
        d4410: satrec.d4410,
        d4422: satrec.d4422,
        d5220: satrec.d5220,
        d5232: satrec.d5232,
        d5421: satrec.d5421,
        d5433: satrec.d5433,
        dedt: satrec.dedt,
        didt: satrec.didt,
        dmdt: satrec.dmdt,
        dnodt: satrec.dnodt,
        domdt: satrec.domdt,
        del1: satrec.del1,
        del2: satrec.del2,
        del3: satrec.del3,
        xfact: satrec.xfact,
        xlamo: satrec.xlamo,
        xli: satrec.xli,
        xni: satrec.xni
      };
      var dsinitResult = dsinit(dsinitOptions);
      satrec.irez = dsinitResult.irez;
      satrec.atime = dsinitResult.atime;
      satrec.d2201 = dsinitResult.d2201;
      satrec.d2211 = dsinitResult.d2211;
      satrec.d3210 = dsinitResult.d3210;
      satrec.d3222 = dsinitResult.d3222;
      satrec.d4410 = dsinitResult.d4410;
      satrec.d4422 = dsinitResult.d4422;
      satrec.d5220 = dsinitResult.d5220;
      satrec.d5232 = dsinitResult.d5232;
      satrec.d5421 = dsinitResult.d5421;
      satrec.d5433 = dsinitResult.d5433;
      satrec.dedt = dsinitResult.dedt;
      satrec.didt = dsinitResult.didt;
      satrec.dmdt = dsinitResult.dmdt;
      satrec.dnodt = dsinitResult.dnodt;
      satrec.domdt = dsinitResult.domdt;
      satrec.del1 = dsinitResult.del1;
      satrec.del2 = dsinitResult.del2;
      satrec.del3 = dsinitResult.del3;
      satrec.xfact = dsinitResult.xfact;
      satrec.xlamo = dsinitResult.xlamo;
      satrec.xli = dsinitResult.xli;
      satrec.xni = dsinitResult.xni;
    } // ----------- set variables if not deep space -----------


    if (satrec.isimp !== 1) {
      cc1sq = satrec.cc1 * satrec.cc1;
      satrec.d2 = 4.0 * ao * tsi * cc1sq;
      temp = satrec.d2 * tsi * satrec.cc1 / 3.0;
      satrec.d3 = (17.0 * ao + sfour) * temp;
      satrec.d4 = 0.5 * temp * ao * tsi * (221.0 * ao + 31.0 * sfour) * satrec.cc1;
      satrec.t3cof = satrec.d2 + 2.0 * cc1sq;
      satrec.t4cof = 0.25 * (3.0 * satrec.d3 + satrec.cc1 * (12.0 * satrec.d2 + 10.0 * cc1sq));
      satrec.t5cof = 0.2 * (3.0 * satrec.d4 + 12.0 * satrec.cc1 * satrec.d3 + 6.0 * satrec.d2 * satrec.d2 + 15.0 * cc1sq * (2.0 * satrec.d2 + cc1sq));
    }
    /* finally propogate to zero epoch to initialize all others. */
    // sgp4fix take out check to let satellites process until they are actually below earth surface
    // if(satrec.error == 0)

  }

  sgp4(satrec, 0);
  satrec.init = 'n';
  /* eslint-enable no-param-reassign */
}
/* -----------------------------------------------------------------------------
 *
 *                           function twoline2rv
 *
 *  this function converts the two line element set character string data to
 *    variables and initializes the sgp4 variables. several intermediate varaibles
 *    and quantities are determined. note that the result is a structure so multiple
 *    satellites can be processed simultaneously without having to reinitialize. the
 *    verification mode is an important option that permits quick checks of any
 *    changes to the underlying technical theory. this option works using a
 *    modified tle file in which the start, stop, and delta time values are
 *    included at the end of the second line of data. this only works with the
 *    verification mode. the catalog mode simply propagates from -1440 to 1440 min
 *    from epoch and is useful when performing entire catalog runs.
 *
 *  author        : david vallado                  719-573-2600    1 mar 2001
 *
 *  inputs        :
 *    longstr1    - first line of the tle
 *    longstr2    - second line of the tle
 *    typerun     - type of run                    verification 'v', catalog 'c',
 *                                                 manual 'm'
 *    typeinput   - type of manual input           mfe 'm', epoch 'e', dayofyr 'd'
 *    opsmode     - mode of operation afspc or improved 'a', 'i'
 *    whichconst  - which set of constants to use  72, 84
 *
 *  outputs       :
 *    satrec      - structure containing all the sgp4 satellite information
 *
 *  coupling      :
 *    getgravconst-
 *    days2mdhms  - conversion of days to month, day, hour, minute, second
 *    jday        - convert day month year hour minute second into julian date
 *    sgp4init    - initialize the sgp4 variables
 *
 *  references    :
 *    norad spacetrack report #3
 *    vallado, crawford, hujsak, kelso  2006
 --------------------------------------------------------------------------- */

/**
 * Return a Satellite imported from two lines of TLE data.
 *
 * Provide the two TLE lines as strings `longstr1` and `longstr2`,
 * and select which standard set of gravitational constants you want
 * by providing `gravity_constants`:
 *
 * `sgp4.propagation.wgs72` - Standard WGS 72 model
 * `sgp4.propagation.wgs84` - More recent WGS 84 model
 * `sgp4.propagation.wgs72old` - Legacy support for old SGP4 behavior
 *
 * Normally, computations are made using letious recent improvements
 * to the algorithm.  If you want to turn some of these off and go
 * back into "afspc" mode, then set `afspc_mode` to `True`.
 */


function twoline2satrec(longstr1, longstr2) {
  var opsmode = 'i';
  var xpdotp = 1440.0 / (2.0 * pi); // 229.1831180523293;

  var year = 0;
  var satrec = {};
  satrec.error = 0;
  satrec.satnum = longstr1.substring(2, 7);
  satrec.epochyr = parseInt(longstr1.substring(18, 20), 10);
  satrec.epochdays = parseFloat(longstr1.substring(20, 32));
  satrec.ndot = parseFloat(longstr1.substring(33, 43));
  satrec.nddot = parseFloat(".".concat(parseInt(longstr1.substring(44, 50), 10), "E").concat(longstr1.substring(50, 52)));
  satrec.bstar = parseFloat("".concat(longstr1.substring(53, 54), ".").concat(parseInt(longstr1.substring(54, 59), 10), "E").concat(longstr1.substring(59, 61))); // satrec.satnum = longstr2.substring(2, 7);

  satrec.inclo = parseFloat(longstr2.substring(8, 16));
  satrec.nodeo = parseFloat(longstr2.substring(17, 25));
  satrec.ecco = parseFloat(".".concat(longstr2.substring(26, 33)));
  satrec.argpo = parseFloat(longstr2.substring(34, 42));
  satrec.mo = parseFloat(longstr2.substring(43, 51));
  satrec.no = parseFloat(longstr2.substring(52, 63)); // ---- find no, ndot, nddot ----

  satrec.no /= xpdotp; //   rad/min
  // satrec.nddot= satrec.nddot * Math.pow(10.0, nexp);
  // satrec.bstar= satrec.bstar * Math.pow(10.0, ibexp);
  // ---- convert to sgp4 units ----

  satrec.a = Math.pow(satrec.no * tumin, -2.0 / 3.0);
  satrec.ndot /= xpdotp * 1440.0; // ? * minperday

  satrec.nddot /= xpdotp * 1440.0 * 1440; // ---- find standard orbital elements ----

  satrec.inclo *= deg2rad;
  satrec.nodeo *= deg2rad;
  satrec.argpo *= deg2rad;
  satrec.mo *= deg2rad;
  satrec.alta = satrec.a * (1.0 + satrec.ecco) - 1.0;
  satrec.altp = satrec.a * (1.0 - satrec.ecco) - 1.0; // ----------------------------------------------------------------
  // find sgp4epoch time of element set
  // remember that sgp4 uses units of days from 0 jan 1950 (sgp4epoch)
  // and minutes from the epoch (time)
  // ----------------------------------------------------------------
  // ---------------- temp fix for years from 1957-2056 -------------------
  // --------- correct fix will occur when year is 4-digit in tle ---------

  if (satrec.epochyr < 57) {
    year = satrec.epochyr + 2000;
  } else {
    year = satrec.epochyr + 1900;
  }

  var mdhmsResult = days2mdhms(year, satrec.epochdays);
  var mon = mdhmsResult.mon,
      day = mdhmsResult.day,
      hr = mdhmsResult.hr,
      minute = mdhmsResult.minute,
      sec = mdhmsResult.sec;
  satrec.jdsatepoch = jday(year, mon, day, hr, minute, sec); //  ---------------- initialize the orbit at sgp4epoch -------------------

  sgp4init(satrec, {
    opsmode: opsmode,
    satn: satrec.satnum,
    epoch: satrec.jdsatepoch - 2433281.5,
    xbstar: satrec.bstar,
    xecco: satrec.ecco,
    xargpo: satrec.argpo,
    xinclo: satrec.inclo,
    xmo: satrec.mo,
    xno: satrec.no,
    xnodeo: satrec.nodeo
  });
  return satrec;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function propagate() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  } // Return a position and velocity vector for a given date and time.


  var satrec = args[0];
  var date = Array.prototype.slice.call(args, 1);
  var j = jday.apply(void 0, _toConsumableArray(date));
  var m = (j - satrec.jdsatepoch) * minutesPerDay;
  return sgp4(satrec, m);
}

function dopplerFactor(location, position, velocity) {
  var mfactor = 7.292115E-5;
  var c = 299792.458; // Speed of light in km/s

  var range = {
    x: position.x - location.x,
    y: position.y - location.y,
    z: position.z - location.z
  };
  range.w = Math.sqrt(Math.pow(range.x, 2) + Math.pow(range.y, 2) + Math.pow(range.z, 2));
  var rangeVel = {
    x: velocity.x + mfactor * location.y,
    y: velocity.y - mfactor * location.x,
    z: velocity.z
  };

  function sign(value) {
    return value >= 0 ? 1 : -1;
  }

  var rangeRate = (range.x * rangeVel.x + range.y * rangeVel.y + range.z * rangeVel.z) / range.w;
  return 1 + rangeRate / c * sign(rangeRate);
}

function radiansToDegrees(radians) {
  return radians * rad2deg;
}

function degreesToRadians(degrees) {
  return degrees * deg2rad;
}

function degreesLat(radians) {
  if (radians < -pi / 2 || radians > pi / 2) {
    throw new RangeError('Latitude radians must be in range [-pi/2; pi/2].');
  }

  return radiansToDegrees(radians);
}

function degreesLong(radians) {
  if (radians < -pi || radians > pi) {
    throw new RangeError('Longitude radians must be in range [-pi; pi].');
  }

  return radiansToDegrees(radians);
}

function radiansLat(degrees) {
  if (degrees < -90 || degrees > 90) {
    throw new RangeError('Latitude degrees must be in range [-90; 90].');
  }

  return degreesToRadians(degrees);
}

function radiansLong(degrees) {
  if (degrees < -180 || degrees > 180) {
    throw new RangeError('Longitude degrees must be in range [-180; 180].');
  }

  return degreesToRadians(degrees);
}

function geodeticToEcf(geodetic) {
  var longitude = geodetic.longitude,
      latitude = geodetic.latitude,
      height = geodetic.height;
  var a = 6378.137;
  var b = 6356.7523142;
  var f = (a - b) / a;
  var e2 = 2 * f - f * f;
  var normal = a / Math.sqrt(1 - e2 * (Math.sin(latitude) * Math.sin(latitude)));
  var x = (normal + height) * Math.cos(latitude) * Math.cos(longitude);
  var y = (normal + height) * Math.cos(latitude) * Math.sin(longitude);
  var z = (normal * (1 - e2) + height) * Math.sin(latitude);
  return {
    x: x,
    y: y,
    z: z
  };
}

function eciToGeodetic(eci, gmst) {
  // http://www.celestrak.com/columns/v02n03/
  var a = 6378.137;
  var b = 6356.7523142;
  var R = Math.sqrt(eci.x * eci.x + eci.y * eci.y);
  var f = (a - b) / a;
  var e2 = 2 * f - f * f;
  var longitude = Math.atan2(eci.y, eci.x) - gmst;

  while (longitude < -pi) {
    longitude += twoPi;
  }

  while (longitude > pi) {
    longitude -= twoPi;
  }

  var kmax = 20;
  var k = 0;
  var latitude = Math.atan2(eci.z, Math.sqrt(eci.x * eci.x + eci.y * eci.y));
  var C;

  while (k < kmax) {
    C = 1 / Math.sqrt(1 - e2 * (Math.sin(latitude) * Math.sin(latitude)));
    latitude = Math.atan2(eci.z + a * C * e2 * Math.sin(latitude), R);
    k += 1;
  }

  var height = R / Math.cos(latitude) - a * C;
  return {
    longitude: longitude,
    latitude: latitude,
    height: height
  };
}

function ecfToEci(ecf, gmst) {
  // ccar.colorado.edu/ASEN5070/handouts/coordsys.doc
  //
  // [X]     [C -S  0][X]
  // [Y]  =  [S  C  0][Y]
  // [Z]eci  [0  0  1][Z]ecf
  //
  var X = ecf.x * Math.cos(gmst) - ecf.y * Math.sin(gmst);
  var Y = ecf.x * Math.sin(gmst) + ecf.y * Math.cos(gmst);
  var Z = ecf.z;
  return {
    x: X,
    y: Y,
    z: Z
  };
}

function eciToEcf(eci, gmst) {
  // ccar.colorado.edu/ASEN5070/handouts/coordsys.doc
  //
  // [X]     [C -S  0][X]
  // [Y]  =  [S  C  0][Y]
  // [Z]eci  [0  0  1][Z]ecf
  //
  //
  // Inverse:
  // [X]     [C  S  0][X]
  // [Y]  =  [-S C  0][Y]
  // [Z]ecf  [0  0  1][Z]eci
  var x = eci.x * Math.cos(gmst) + eci.y * Math.sin(gmst);
  var y = eci.x * -Math.sin(gmst) + eci.y * Math.cos(gmst);
  var z = eci.z;
  return {
    x: x,
    y: y,
    z: z
  };
}

function topocentric(observerGeodetic, satelliteEcf) {
  // http://www.celestrak.com/columns/v02n02/
  // TS Kelso's method, except I'm using ECF frame
  // and he uses ECI.
  var longitude = observerGeodetic.longitude,
      latitude = observerGeodetic.latitude;
  var observerEcf = geodeticToEcf(observerGeodetic);
  var rx = satelliteEcf.x - observerEcf.x;
  var ry = satelliteEcf.y - observerEcf.y;
  var rz = satelliteEcf.z - observerEcf.z;
  var topS = Math.sin(latitude) * Math.cos(longitude) * rx + Math.sin(latitude) * Math.sin(longitude) * ry - Math.cos(latitude) * rz;
  var topE = -Math.sin(longitude) * rx + Math.cos(longitude) * ry;
  var topZ = Math.cos(latitude) * Math.cos(longitude) * rx + Math.cos(latitude) * Math.sin(longitude) * ry + Math.sin(latitude) * rz;
  return {
    topS: topS,
    topE: topE,
    topZ: topZ
  };
}
/**
 * @param {Object} tc
 * @param {Number} tc.topS Positive horizontal vector S due south.
 * @param {Number} tc.topE Positive horizontal vector E due east.
 * @param {Number} tc.topZ Vector Z normal to the surface of the earth (up).
 * @returns {Object}
 */


function topocentricToLookAngles(tc) {
  var topS = tc.topS,
      topE = tc.topE,
      topZ = tc.topZ;
  var rangeSat = Math.sqrt(topS * topS + topE * topE + topZ * topZ);
  var El = Math.asin(topZ / rangeSat);
  var Az = Math.atan2(-topE, topS) + pi;
  return {
    azimuth: Az,
    elevation: El,
    rangeSat: rangeSat // Range in km

  };
}

function ecfToLookAngles(observerGeodetic, satelliteEcf) {
  var topocentricCoords = topocentric(observerGeodetic, satelliteEcf);
  return topocentricToLookAngles(topocentricCoords);
}



/***/ }),

/***/ "./node_modules/supports-color/index.js":
/*!**********************************************!*\
  !*** ./node_modules/supports-color/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const os = __webpack_require__(/*! os */ "os");

const hasFlag = __webpack_require__(/*! has-flag */ "./node_modules/has-flag/index.js");

const env = process.env;
let forceColor;

if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false')) {
  forceColor = false;
} else if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true') || hasFlag('color=always')) {
  forceColor = true;
}

if ('FORCE_COLOR' in env) {
  forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
  if (level === 0) {
    return false;
  }

  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}

function supportsColor(stream) {
  if (forceColor === false) {
    return 0;
  }

  if (hasFlag('color=16m') || hasFlag('color=full') || hasFlag('color=truecolor')) {
    return 3;
  }

  if (hasFlag('color=256')) {
    return 2;
  }

  if (stream && !stream.isTTY && forceColor !== true) {
    return 0;
  }

  const min = forceColor ? 1 : 0;

  if (process.platform === 'win32') {
    // Node.js 7.5.0 is the first version of Node.js to include a patch to
    // libuv that enables 256 color output on Windows. Anything earlier and it
    // won't work. However, here we target Node.js 8 at minimum as it is an LTS
    // release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
    // release that supports 256 colors. Windows 10 build 14931 is the first release
    // that supports 16m/TrueColor.
    const osRelease = os.release().split('.');

    if (Number(process.versions.node.split('.')[0]) >= 8 && Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }

    return 1;
  }

  if ('CI' in env) {
    if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
      return 1;
    }

    return min;
  }

  if ('TEAMCITY_VERSION' in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }

  if (env.COLORTERM === 'truecolor') {
    return 3;
  }

  if ('TERM_PROGRAM' in env) {
    const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

    switch (env.TERM_PROGRAM) {
      case 'iTerm.app':
        return version >= 3 ? 3 : 2;

      case 'Apple_Terminal':
        return 2;
      // No default
    }
  }

  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }

  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }

  if ('COLORTERM' in env) {
    return 1;
  }

  if (env.TERM === 'dumb') {
    return min;
  }

  return min;
}

function getSupportLevel(stream) {
  const level = supportsColor(stream);
  return translateLevel(level);
}

module.exports = {
  supportsColor: getSupportLevel,
  stdout: getSupportLevel(process.stdout),
  stderr: getSupportLevel(process.stderr)
};

/***/ }),

/***/ "./public/src/scripts/api_util.js":
/*!****************************************!*\
  !*** ./public/src/scripts/api_util.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");

var isbn = "0201558025";
var receiveData = axios.get("/satellites/tle").then(function (response) {
  var split = response.data.split("\r\n");
  var newData = [];

  for (var i = 0; i < split.length - 2; i += 3) {
    var two = split[i + 1].concat(" ", "\n", " ", split[i + 2]);
    newData.push(two);
  }

  return newData;
}).catch(function (error) {
  debugger;
  console.log(error);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (receiveData);

/***/ }),

/***/ "./public/src/scripts/button_util.js":
/*!*******************************************!*\
  !*** ./public/src/scripts/button_util.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "handleButton": () => (/* binding */ handleButton),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var handlePlay = function handlePlay(audioContext) {
  var audioCtx = audioContext;
  var button = document.getElementById("play_pause");
  button.addEventListener("click", function () {
    console.log("clicked");

    if (audioCtx.state === "suspended") {
      debugger;
      audioCtx.resume();
      var oscillator = audioCtx.createOscillator();
      oscillator.type = "square";
      oscillator.frequency.value = 440; // value in hertz

      oscillator.start(0); // oscillator.connect(audioCtx.destination);
      // debugger;
    } else {
      audioCtx.suspend();
    }
  }, false);
};

var handleButton = function handleButton() {
  document.getElementById("abt-btn").addEventListener("click", function () {
    document.getElementById("overlay").classList.add("is-visible");
    document.getElementByIdI("abt-modal").classList.add("is-visible");
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handlePlay);

/***/ }),

/***/ "./public/src/scripts/game.js":
/*!************************************!*\
  !*** ./public/src/scripts/game.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _satellite_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./satellite.js */ "./public/src/scripts/satellite.js");
/* harmony import */ var _star_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./star.js */ "./public/src/scripts/star.js");
/* harmony import */ var satellite_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! satellite.js */ "./node_modules/satellite.js/dist/satellite.es.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





var Game = /*#__PURE__*/function () {
  function Game(xDim, yDim, tle, audioCtx) {
    _classCallCheck(this, Game);

    this.xDim = xDim;
    this.yDim = yDim;
    this.satellites = [];
    this.stars = [];
    this.tle = tle;
    this.audioCtx = audioCtx;
    this.addSatellites(tle);
    this.addStars();
  }

  _createClass(Game, [{
    key: "randomPos",
    value: function randomPos() {
      return [Math.floor(Math.random() * this.xDim), Math.floor(Math.random() * this.yDim)];
    }
  }, {
    key: "addStars",
    value: function addStars() {
      for (var i = 0; i < 1700; i++) {
        var currentStar = new _star_js__WEBPACK_IMPORTED_MODULE_1__.default(this.randomPos(), this);
        this.stars.push(currentStar);
      }
    }
  }, {
    key: "addSatellites",
    value: function addSatellites(tle) {
      var satrec = satellite.twoline2satrec(this.tle.split("\n")[0].trim(), this.tle.split("\n")[1].trim()); // debugger;
      // for (let i = 0; i < 100; i++) {
      //   // debugger;
      //   console.log(satellitesObj[i]);

      var currentSatellite = new _satellite_js__WEBPACK_IMPORTED_MODULE_0__.default(satrec, this);
      this.satellites.push(currentSatellite); // }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {// ctx.clearRect(0, 0, this.xDim, this.yDim);
      // ctx.fillStyle = "black";
      // ctx.fillRect(0, 0, this.xDim, this.yDim);
      // this.stars.forEach((star) => star.draw(ctx));
      // this.satellites.forEach((satellite) => satellite.draw(ctx));
    }
  }, {
    key: "move",
    value: function move(ctx) {// this.satellites.forEach((satellite) => satellite.move(ctx));
    }
  }]);

  return Game;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);

/***/ }),

/***/ "./public/src/scripts/game_view.js":
/*!*****************************************!*\
  !*** ./public/src/scripts/game_view.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./public/src/scripts/game.js");
/* harmony import */ var _math_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./math_util */ "./public/src/scripts/math_util.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


 // import { scene, camera, renderer } from "./three/three_map";

var GameView = /*#__PURE__*/function () {
  function GameView(tleArr, audioCtx) {
    var _this = this;

    _classCallCheck(this, GameView);

    _defineProperty(this, "satelliteVector", function (satrec, date) {
      var xyz = _this.satrecToXYZ(satrec, date);

      var lambda = xyz[0];
      var phi = xyz[1];
      var cosPhi = Math.cos(phi);
      var r = (xyz[2] + 6371) / 6371 * 228;
      return new THREE.Vector3(r * cosPhi * Math.cos(lambda), r * cosPhi * Math.sin(lambda), r * Math.sin(phi));
    });

    _defineProperty(this, "satrecToXYZ", function (satrec, date) {
      var positionAndVelocity = satellite.propagate(satrec, date);
      var gmst = satellite.gstime(date);
      var positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
      return [positionGd.longitude, positionGd.latitude, positionGd.height];
    });

    this.tleArr = tleArr;
    this.audioCtx = audioCtx;
    this.satRecs = [];
    this.satOscillators = [];
    this.addSatellites();
    this.t = 0;
    this.activeClock = this.clock().rate(100).date(new Date().getTime());
  }

  _createClass(GameView, [{
    key: "clock",
    value: function clock() {
      var rate = 60; // 1ms elapsed : 60sec simulated

      var date = new Date().getTime();
      var elapsed = 0;

      function clock() {}

      clock.date = function (timeInMs) {
        if (!arguments.length) return date + elapsed * rate;
        date = timeInMs;
        return clock;
      };

      clock.elapsed = function (ms) {
        if (!arguments.length) return date - new Date().getTime(); // calculates elapsed

        elapsed = ms; // debugger;

        return clock;
      };

      clock.rate = function (secondsPerMsElapsed) {
        if (!arguments.length) return rate;
        rate = secondsPerMsElapsed;
        return clock;
      };

      return clock;
    }
  }, {
    key: "addSatellites",
    value: function addSatellites() {
      for (var i = 0; i < this.tleArr.length; i++) {
        var satrec = satellite.twoline2satrec(this.tleArr[i].split("\n")[0].trim(), this.tleArr[i].split("\n")[1].trim());
        this.satRecs.push(satrec);
        this.createSatelliteOsc(satrec);
      }
    }
  }, {
    key: "createSatelliteOsc",
    value: function createSatelliteOsc(satrec) {
      var oscillatorNode = this.audioCtx.createOscillator();
      oscillatorNode.type = "sine"; // console.log(satrec);
      // debugger;
      // const newFreq = (satrec.epochdays * satrec.d3) % 2050;

      var newFreq = 100;
      oscillatorNode.frequency.value = newFreq; // console.log(newFreq);

      var gainNode = this.audioCtx.createGain();
      gainNode.gain.value = 0.01; // 10 %

      gainNode.connect(this.audioCtx.destination);
      oscillatorNode.connect(gainNode);
      oscillatorNode.start(0);
      this.satOscillators.push(oscillatorNode);
    }
  }, {
    key: "updateSatelliteOsc",
    value: function updateSatelliteOsc(vertices, i) {
      var currentOsc = this.satOscillators[i]; // const cutFreq = Math.abs(vertices.x);
      // debugger;
      // currentOsc.frequency.value = 400;
      // Math.abs(vertices.x * vertices.y * vertices.z);
      // const newFreq = map_range(satrec.size, 0, this.game.yDim, 0, 20000);
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      var date = new Date();
      var canvasEle = document.getElementById("canvas"); // debugger;
      // console.log(canvasEle);

      var renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasEle
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x00fff0, 0); // sets background to clear color

      var geometry = new THREE.SphereGeometry(200, 32, 32);
      var wireframe = new THREE.WireframeGeometry(geometry);
      var line = new THREE.LineSegments(wireframe);
      line.material.depthTest = false;
      line.material.transparent = true;
      scene.add(line);
      var satGeometry = new THREE.Geometry();
      var satelliteVectorFunc = this.satelliteVector;
      satGeometry.vertices = this.satRecs.map(function (satrec) {
        return satelliteVectorFunc(satrec, date);
      });
      var satellites = new THREE.Points(satGeometry, new THREE.PointsMaterial({
        color: "green",
        size: 4
      }));
      scene.add(satellites);
      debugger;
      camera.position.z = 700;
      camera.position.x = 0;
      camera.position.y = 0;
      var satRecs = this.satRecs;
      var newActiveClock = this.activeClock; // const updateOscillators = this.updateSatelliteOsc;

      var animate = function animate(t) {
        var date = new Date(newActiveClock.elapsed(t).date());
        requestAnimationFrame(animate);
        line.rotation.y += 0.001;

        for (var i = 0; i < satRecs.length; i++) {
          satellites.geometry.vertices[i] = satelliteVectorFunc(satRecs[i], date);

          _this2.updateSatelliteOsc(satellites.geometry.vertices[i], i);
        }

        satellites.geometry.verticesNeedUpdate = true;
        renderer.render(scene, camera);
      };

      animate(this.t);
    }
  }]);

  return GameView;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameView);

/***/ }),

/***/ "./public/src/scripts/math_util.js":
/*!*****************************************!*\
  !*** ./public/src/scripts/math_util.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var map_range = function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

var radiansToDegrees = function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
};

var degreesToRadians = function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (map_range);

/***/ }),

/***/ "./public/src/scripts/satellite.js":
/*!*****************************************!*\
  !*** ./public/src/scripts/satellite.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _math_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math_util */ "./public/src/scripts/math_util.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var SatelliteOsc = /*#__PURE__*/function () {
  function SatelliteOsc(satRec, game) {
    _classCallCheck(this, SatelliteOsc);

    this.date = new Date();
    this.positionAndVelocity = satellite.propagate(satRec, this.date);
    this.gmst = satellite.gstime(this.date);
    this.position = satellite.eciToGeodetic(this.positionAndVelocity.position, this.gmst);
    this.game = game;
    this.audioCtx = game.audioCtx;
  }

  _createClass(SatelliteOsc, [{
    key: "startOsc",
    value: function startOsc() {
      this.oscillator.type = "sine";
      debugger;
      var newFreq = (0,_math_util__WEBPACK_IMPORTED_MODULE_0__.default)(this.pos[1], 0, this.game.yDim, 0, 20000);
      console.log(newFreq);
      this.oscillator.frequency.value = newFreq; // debugger;

      var gainNode = this.audioCtx.createGain();
      gainNode.gain.value = 0.001; // 10 %

      gainNode.connect(this.audioCtx.destination);
      this.oscillator.connect(gainNode);
      this.oscillator.start(0);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {}
  }, {
    key: "move",
    value: function move() {// this.pos[0] += this.vel[0];
      // this.pos[1] += this.vel[1];
      // debugger;
      // if (this.isOutOfBounds(this.pos)) {
      //   this.pos = [
      //     this.wrap(this.pos[0], this.game.xDim),
      //     this.wrap(this.pos[1], this.game.yDim),
      //   ];
      // }
    }
  }, {
    key: "isOutOfBounds",
    value: function isOutOfBounds(pos) {
      // debugger;
      return pos[0] < 0 || pos[1] < 0 || pos[0] > this.game.xDim || pos[1] > this.game.yDim;
    }
  }, {
    key: "wrap",
    value: function wrap(coord, max) {
      if (coord < 0) {
        return max - coord % max;
      } else if (coord > max) {
        return coord % max;
      } else {
        return coord;
      }
    }
  }]);

  return SatelliteOsc;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SatelliteOsc);

/***/ }),

/***/ "./public/src/scripts/star.js":
/*!************************************!*\
  !*** ./public/src/scripts/star.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Star = /*#__PURE__*/function () {
  function Star(pos, game) {
    _classCallCheck(this, Star);

    this.pos = pos;
    this.game = game;
    this.xVal = Math.floor(Math.random() * 1) + 1;
    this.yVal = Math.floor(Math.random() * 1) + 1;
  }

  _createClass(Star, [{
    key: "draw",
    value: function draw(ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(this.pos[0], this.pos[1], this.xVal, this.yVal);
    }
  }]);

  return Star;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Star);

/***/ }),

/***/ "./public/src/styles/index.scss":
/*!**************************************!*\
  !*** ./public/src/styles/index.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");;

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*****************************!*\
  !*** ./public/src/index.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/index.scss */ "./public/src/styles/index.scss");
/* harmony import */ var _scripts_game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scripts/game */ "./public/src/scripts/game.js");
/* harmony import */ var _scripts_game_view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scripts/game_view */ "./public/src/scripts/game_view.js");
/* harmony import */ var _scripts_api_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scripts/api_util */ "./public/src/scripts/api_util.js");
/* harmony import */ var _scripts_button_util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scripts/button_util */ "./public/src/scripts/button_util.js");




 // import readTLE from "./scripts/tle/tle_parse";

window.addEventListener("DOMContentLoaded", function (event) {
  var canvas = document.getElementById("canvas");
  var audioCtx = new AudioContext();
  (0,_scripts_button_util__WEBPACK_IMPORTED_MODULE_4__.default)(audioCtx); // readTLE;

  _scripts_api_util__WEBPACK_IMPORTED_MODULE_3__.default.then(function (response) {
    var ISS_TLE = "1 27651U 03004A   21153.50481762  .00000064  00000+0  20724-4 0  9991\n    2 27651  39.9940 177.6513 0023168 320.1011  39.8075 14.89306556996390";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var g = new _scripts_game__WEBPACK_IMPORTED_MODULE_1__.default(canvas.width, canvas.height, ISS_TLE, audioCtx);
    var gameview = new _scripts_game_view__WEBPACK_IMPORTED_MODULE_2__.default(response, audioCtx);
    gameview.start();
  }); // });
  // new Game(canvas.width, canvas.height).start(canvas);
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy9odHRwLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMveGhyLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYXhpb3MuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvcy5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvSW50ZXJjZXB0b3JNYW5hZ2VyLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9idWlsZEZ1bGxQYXRoLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZGlzcGF0Y2hSZXF1ZXN0LmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9lbmhhbmNlRXJyb3IuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL21lcmdlQ29uZmlnLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9zZXR0bGUuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYmluZC5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0F4aW9zRXJyb3IuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcHJlYWQuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9jb21tb24uanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2ZvbGxvdy1yZWRpcmVjdHMvZGVidWcuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2ZvbGxvdy1yZWRpcmVjdHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2hhcy1mbGFnL2luZGV4LmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9tcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvc2F0ZWxsaXRlLmpzL2Rpc3Qvc2F0ZWxsaXRlLmVzLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9zdXBwb3J0cy1jb2xvci9pbmRleC5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9wdWJsaWMvc3JjL3NjcmlwdHMvYXBpX3V0aWwuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vcHVibGljL3NyYy9zY3JpcHRzL2J1dHRvbl91dGlsLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL3B1YmxpYy9zcmMvc2NyaXB0cy9nYW1lLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL3B1YmxpYy9zcmMvc2NyaXB0cy9nYW1lX3ZpZXcuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vcHVibGljL3NyYy9zY3JpcHRzL21hdGhfdXRpbC5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9wdWJsaWMvc3JjL3NjcmlwdHMvc2F0ZWxsaXRlLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL3B1YmxpYy9zcmMvc2NyaXB0cy9zdGFyLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL3B1YmxpYy9zcmMvc3R5bGVzL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvL2V4dGVybmFsIFwiYXNzZXJ0XCIiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvL2V4dGVybmFsIFwiaHR0cFwiIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby9leHRlcm5hbCBcImh0dHBzXCIiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvL2V4dGVybmFsIFwib3NcIiIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vZXh0ZXJuYWwgXCJzdHJlYW1cIiIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vZXh0ZXJuYWwgXCJ0dHlcIiIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vZXh0ZXJuYWwgXCJ1cmxcIiIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vZXh0ZXJuYWwgXCJ1dGlsXCIiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvL2V4dGVybmFsIFwiemxpYlwiIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL3B1YmxpYy9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiYXhpb3MiLCJyZXF1aXJlIiwiaXNibiIsInJlY2VpdmVEYXRhIiwiZ2V0IiwidGhlbiIsInJlc3BvbnNlIiwic3BsaXQiLCJkYXRhIiwibmV3RGF0YSIsImkiLCJsZW5ndGgiLCJ0d28iLCJjb25jYXQiLCJwdXNoIiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJoYW5kbGVQbGF5IiwiYXVkaW9Db250ZXh0IiwiYXVkaW9DdHgiLCJidXR0b24iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0YXRlIiwicmVzdW1lIiwib3NjaWxsYXRvciIsImNyZWF0ZU9zY2lsbGF0b3IiLCJ0eXBlIiwiZnJlcXVlbmN5IiwidmFsdWUiLCJzdGFydCIsInN1c3BlbmQiLCJoYW5kbGVCdXR0b24iLCJjbGFzc0xpc3QiLCJhZGQiLCJnZXRFbGVtZW50QnlJZEkiLCJHYW1lIiwieERpbSIsInlEaW0iLCJ0bGUiLCJzYXRlbGxpdGVzIiwic3RhcnMiLCJhZGRTYXRlbGxpdGVzIiwiYWRkU3RhcnMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjdXJyZW50U3RhciIsIlN0YXIiLCJyYW5kb21Qb3MiLCJzYXRyZWMiLCJzYXRlbGxpdGUiLCJ0d29saW5lMnNhdHJlYyIsInRyaW0iLCJjdXJyZW50U2F0ZWxsaXRlIiwiU2F0ZWxsaXRlIiwiY3R4IiwiR2FtZVZpZXciLCJ0bGVBcnIiLCJkYXRlIiwieHl6Iiwic2F0cmVjVG9YWVoiLCJsYW1iZGEiLCJwaGkiLCJjb3NQaGkiLCJjb3MiLCJyIiwiVEhSRUUiLCJWZWN0b3IzIiwic2luIiwicG9zaXRpb25BbmRWZWxvY2l0eSIsInByb3BhZ2F0ZSIsImdtc3QiLCJnc3RpbWUiLCJwb3NpdGlvbkdkIiwiZWNpVG9HZW9kZXRpYyIsInBvc2l0aW9uIiwibG9uZ2l0dWRlIiwibGF0aXR1ZGUiLCJoZWlnaHQiLCJzYXRSZWNzIiwic2F0T3NjaWxsYXRvcnMiLCJ0IiwiYWN0aXZlQ2xvY2siLCJjbG9jayIsInJhdGUiLCJEYXRlIiwiZ2V0VGltZSIsImVsYXBzZWQiLCJ0aW1lSW5NcyIsImFyZ3VtZW50cyIsIm1zIiwic2Vjb25kc1Blck1zRWxhcHNlZCIsImNyZWF0ZVNhdGVsbGl0ZU9zYyIsIm9zY2lsbGF0b3JOb2RlIiwibmV3RnJlcSIsImdhaW5Ob2RlIiwiY3JlYXRlR2FpbiIsImdhaW4iLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJ2ZXJ0aWNlcyIsImN1cnJlbnRPc2MiLCJzY2VuZSIsIlNjZW5lIiwiY2FtZXJhIiwiUGVyc3BlY3RpdmVDYW1lcmEiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJjYW52YXNFbGUiLCJyZW5kZXJlciIsIldlYkdMUmVuZGVyZXIiLCJhbnRpYWxpYXMiLCJjYW52YXMiLCJzZXRTaXplIiwic2V0Q2xlYXJDb2xvciIsImdlb21ldHJ5IiwiU3BoZXJlR2VvbWV0cnkiLCJ3aXJlZnJhbWUiLCJXaXJlZnJhbWVHZW9tZXRyeSIsImxpbmUiLCJMaW5lU2VnbWVudHMiLCJtYXRlcmlhbCIsImRlcHRoVGVzdCIsInRyYW5zcGFyZW50Iiwic2F0R2VvbWV0cnkiLCJHZW9tZXRyeSIsInNhdGVsbGl0ZVZlY3RvckZ1bmMiLCJzYXRlbGxpdGVWZWN0b3IiLCJtYXAiLCJQb2ludHMiLCJQb2ludHNNYXRlcmlhbCIsImNvbG9yIiwic2l6ZSIsInoiLCJ4IiwieSIsIm5ld0FjdGl2ZUNsb2NrIiwiYW5pbWF0ZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInJvdGF0aW9uIiwidXBkYXRlU2F0ZWxsaXRlT3NjIiwidmVydGljZXNOZWVkVXBkYXRlIiwicmVuZGVyIiwibWFwX3JhbmdlIiwibG93MSIsImhpZ2gxIiwibG93MiIsImhpZ2gyIiwicmFkaWFuc1RvRGVncmVlcyIsInJhZGlhbnMiLCJQSSIsImRlZ3JlZXNUb1JhZGlhbnMiLCJkZWdyZWVzIiwiU2F0ZWxsaXRlT3NjIiwic2F0UmVjIiwiZ2FtZSIsInBvcyIsImNvb3JkIiwibWF4IiwieFZhbCIsInlWYWwiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsImV2ZW50IiwiQXVkaW9Db250ZXh0IiwiSVNTX1RMRSIsIndpZHRoIiwiZyIsImdhbWV2aWV3Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRGQUF1QyxDOzs7Ozs7Ozs7OztBQ0ExQjs7QUFFYixZQUFZLG1CQUFPLENBQUMscURBQVk7O0FBRWhDLGFBQWEsbUJBQU8sQ0FBQyxpRUFBa0I7O0FBRXZDLG9CQUFvQixtQkFBTyxDQUFDLDZFQUF1Qjs7QUFFbkQsZUFBZSxtQkFBTyxDQUFDLDJFQUF1Qjs7QUFFOUMsV0FBVyxtQkFBTyxDQUFDLGtCQUFNOztBQUV6QixZQUFZLG1CQUFPLENBQUMsb0JBQU87O0FBRTNCLGlCQUFpQiw0RkFBZ0M7O0FBRWpELGtCQUFrQiw2RkFBaUM7O0FBRW5ELFVBQVUsbUJBQU8sQ0FBQyxnQkFBSzs7QUFFdkIsV0FBVyxtQkFBTyxDQUFDLGtCQUFNOztBQUV6QixVQUFVLG1CQUFPLENBQUMsK0RBQXNCOztBQUV4QyxrQkFBa0IsbUJBQU8sQ0FBQyx5RUFBcUI7O0FBRS9DLG1CQUFtQixtQkFBTyxDQUFDLDJFQUFzQjs7QUFFakQ7QUFDQTtBQUNBO0FBQ0EsV0FBVyx1QkFBdUI7QUFDbEMsV0FBVyxpQkFBaUI7QUFDNUIsV0FBVyxPQUFPO0FBQ2xCOztBQUVBO0FBQ0E7QUFDQTtB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QVE7QUFDckI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWSxRQUFRO0FBQ3BCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFH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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsRUFBRTs7O0FBR0Y7QUFDQTs7QUFFQTtBQUNBLEVBQUU7OztBQUdGO0FBQ0E7O0FBRUE7QUFDQSxFQUFFOzs7QUFHRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7OztBQUdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFQUFFOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7O0FBR0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBLCtDQUErQzs7QUFFL0M7O0FBRUEsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBLEdBQUc7QUFDSDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztB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Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjs7QUFFbEIsMkJBQTJCOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlDQUFpQzs7QUFFakM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhCQUE4Qjs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQ7O0FBRWpELHNFQUFzRTs7QUFFdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7O0FBRXBCLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOztBQUVWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQzs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscURBQXFEOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDOztBQUV2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCOztBQUV2Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDOztBQUV2QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLCtCQUErQjs7QUFFL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7OztBQUdMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLDZIQUE2SDs7QUFFN0gsd0NBQXdDO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qjs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7QUFFbkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qjs7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7QUFFZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBLG9CQUFvQjs7QUFFcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOzs7QUFHQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCOztBQUV0QjtBQUNBLG1CQUFtQjs7QUFFbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQ0FBc0M7O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDOztBQUVyQztBQUNBLDhCQUE4Qjs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUI7O0FBRXZCO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7O0FBRXhDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDs7QUFFM0Q7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrR0FBa0c7O0FBRWxHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1RkFBdUY7O0FBRXZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCOztBQUV4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qjs7QUFFeEIsaUNBQWlDO0FBQ2pDOztBQUVBLG9DQUFvQzs7QUFFcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQ0FBc0M7O0FBRXRDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUEsd0NBQXdDOztBQUV4QztBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7OztBQUdMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLG1DQUFtQzs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlLQUFpSzs7QUFFaks7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDs7QUFFckQsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlDQUFpQzs7QUFFakMseUNBQXlDOztBQUV6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTREOztBQUU1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHdDQUF3QyxTQUFTOztBQUVqRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFFQUFxRSxhQUFhO0FBQ2xGO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtRUFBbUU7QUFDbkU7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0VBQWtFO0FBQ2xFOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlFQUFpRTtBQUNqRTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtRUFBbUU7QUFDbkU7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDRCxDQWxCRCxFIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbnZhciBzZXR0bGUgPSByZXF1aXJlKCcuLy4uL2NvcmUvc2V0dGxlJyk7XG5cbnZhciBidWlsZEZ1bGxQYXRoID0gcmVxdWlyZSgnLi4vY29yZS9idWlsZEZ1bGxQYXRoJyk7XG5cbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xuXG52YXIgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcblxudmFyIGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKTtcblxudmFyIGh0dHBGb2xsb3cgPSByZXF1aXJlKCdmb2xsb3ctcmVkaXJlY3RzJykuaHR0cDtcblxudmFyIGh0dHBzRm9sbG93ID0gcmVxdWlyZSgnZm9sbG93LXJlZGlyZWN0cycpLmh0dHBzO1xuXG52YXIgdXJsID0gcmVxdWlyZSgndXJsJyk7XG5cbnZhciB6bGliID0gcmVxdWlyZSgnemxpYicpO1xuXG52YXIgcGtnID0gcmVxdWlyZSgnLi8uLi8uLi9wYWNrYWdlLmpzb24nKTtcblxudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9jcmVhdGVFcnJvcicpO1xuXG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9lbmhhbmNlRXJyb3InKTtcblxudmFyIGlzSHR0cHMgPSAvaHR0cHM6Py87XG4vKipcbiAqXG4gKiBAcGFyYW0ge2h0dHAuQ2xpZW50UmVxdWVzdEFyZ3N9IG9wdGlvbnNcbiAqIEBwYXJhbSB7QXhpb3NQcm94eUNvbmZpZ30gcHJveHlcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICovXG5cbmZ1bmN0aW9uIHNldFByb3h5KG9wdGlvbnMsIHByb3h5LCBsb2NhdGlvbikge1xuICBvcHRpb25zLmhvc3RuYW1lID0gcHJveHkuaG9zdDtcbiAgb3B0aW9ucy5ob3N0ID0gcHJveHkuaG9zdDtcbiAgb3B0aW9ucy5wb3J0ID0gcHJveHkucG9ydDtcbiAgb3B0aW9ucy5wYXRoID0gbG9jYXRpb247IC8vIEJhc2ljIHByb3h5IGF1dGhvcml6YXRpb25cblxuICBpZiAocHJveHkuYXV0aCkge1xuICAgIHZhciBiYXNlNjQgPSBCdWZmZXIuZnJvbShwcm94eS5hdXRoLnVzZXJuYW1lICsgJzonICsgcHJveHkuYXV0aC5wYXNzd29yZCwgJ3V0ZjgnKS50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgb3B0aW9ucy5oZWFkZXJzWydQcm94eS1BdXRob3JpemF0aW9uJ10gPSAnQmFzaWMgJyArIGJhc2U2NDtcbiAgfSAvLyBJZiBhIHByb3h5IGlzIHVzZWQsIGFueSByZWRpcmVjdHMgbXVzdCBhbHNvIHBhc3MgdGhyb3VnaCB0aGUgcHJveHlcblxuXG4gIG9wdGlvbnMuYmVmb3JlUmVkaXJlY3QgPSBmdW5jdGlvbiBiZWZvcmVSZWRpcmVjdChyZWRpcmVjdGlvbikge1xuICAgIHJlZGlyZWN0aW9uLmhlYWRlcnMuaG9zdCA9IHJlZGlyZWN0aW9uLmhvc3Q7XG4gICAgc2V0UHJveHkocmVkaXJlY3Rpb24sIHByb3h5LCByZWRpcmVjdGlvbi5ocmVmKTtcbiAgfTtcbn1cbi8qZXNsaW50IGNvbnNpc3RlbnQtcmV0dXJuOjAqL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaHR0cEFkYXB0ZXIoY29uZmlnKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaEh0dHBSZXF1ZXN0KHJlc29sdmVQcm9taXNlLCByZWplY3RQcm9taXNlKSB7XG4gICAgdmFyIHJlc29sdmUgPSBmdW5jdGlvbiByZXNvbHZlKHZhbHVlKSB7XG4gICAgICByZXNvbHZlUHJvbWlzZSh2YWx1ZSk7XG4gICAgfTtcblxuICAgIHZhciByZWplY3QgPSBmdW5jdGlvbiByZWplY3QodmFsdWUpIHtcbiAgICAgIHJlamVjdFByb21pc2UodmFsdWUpO1xuICAgIH07XG5cbiAgICB2YXIgZGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgIHZhciBoZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7IC8vIFNldCBVc2VyLUFnZW50IChyZXF1aXJlZCBieSBzb21lIHNlcnZlcnMpXG4gICAgLy8gT25seSBzZXQgaGVhZGVyIGlmIGl0IGhhc24ndCBiZWVuIHNldCBpbiBjb25maWdcbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2F4aW9zL2F4aW9zL2lzc3Vlcy82OVxuXG4gICAgaWYgKCFoZWFkZXJzWydVc2VyLUFnZW50J10gJiYgIWhlYWRlcnNbJ3VzZXItYWdlbnQnXSkge1xuICAgICAgaGVhZGVyc1snVXNlci1BZ2VudCddID0gJ2F4aW9zLycgKyBwa2cudmVyc2lvbjtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSAmJiAhdXRpbHMuaXNTdHJlYW0oZGF0YSkpIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIHsvLyBOb3RoaW5nIHRvIGRvLi4uXG4gICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkpIHtcbiAgICAgICAgZGF0YSA9IEJ1ZmZlci5mcm9tKG5ldyBVaW50OEFycmF5KGRhdGEpKTtcbiAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNTdHJpbmcoZGF0YSkpIHtcbiAgICAgICAgZGF0YSA9IEJ1ZmZlci5mcm9tKGRhdGEsICd1dGYtOCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChjcmVhdGVFcnJvcignRGF0YSBhZnRlciB0cmFuc2Zvcm1hdGlvbiBtdXN0IGJlIGEgc3RyaW5nLCBhbiBBcnJheUJ1ZmZlciwgYSBCdWZmZXIsIG9yIGEgU3RyZWFtJywgY29uZmlnKSk7XG4gICAgICB9IC8vIEFkZCBDb250ZW50LUxlbmd0aCBoZWFkZXIgaWYgZGF0YSBleGlzdHNcblxuXG4gICAgICBoZWFkZXJzWydDb250ZW50LUxlbmd0aCddID0gZGF0YS5sZW5ndGg7XG4gICAgfSAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG5cblxuICAgIHZhciBhdXRoID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkIHx8ICcnO1xuICAgICAgYXV0aCA9IHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQ7XG4gICAgfSAvLyBQYXJzZSB1cmxcblxuXG4gICAgdmFyIGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gICAgdmFyIHBhcnNlZCA9IHVybC5wYXJzZShmdWxsUGF0aCk7XG4gICAgdmFyIHByb3RvY29sID0gcGFyc2VkLnByb3RvY29sIHx8ICdodHRwOic7XG5cbiAgICBpZiAoIWF1dGggJiYgcGFyc2VkLmF1dGgpIHtcbiAgICAgIHZhciB1cmxBdXRoID0gcGFyc2VkLmF1dGguc3BsaXQoJzonKTtcbiAgICAgIHZhciB1cmxVc2VybmFtZSA9IHVybEF1dGhbMF0gfHwgJyc7XG4gICAgICB2YXIgdXJsUGFzc3dvcmQgPSB1cmxBdXRoWzFdIHx8ICcnO1xuICAgICAgYXV0aCA9IHVybFVzZXJuYW1lICsgJzonICsgdXJsUGFzc3dvcmQ7XG4gICAgfVxuXG4gICAgaWYgKGF1dGgpIHtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzLkF1dGhvcml6YXRpb247XG4gICAgfVxuXG4gICAgdmFyIGlzSHR0cHNSZXF1ZXN0ID0gaXNIdHRwcy50ZXN0KHByb3RvY29sKTtcbiAgICB2YXIgYWdlbnQgPSBpc0h0dHBzUmVxdWVzdCA/IGNvbmZpZy5odHRwc0FnZW50IDogY29uZmlnLmh0dHBBZ2VudDtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIHBhdGg6IGJ1aWxkVVJMKHBhcnNlZC5wYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcikucmVwbGFjZSgvXlxcPy8sICcnKSxcbiAgICAgIG1ldGhvZDogY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLFxuICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgIGFnZW50OiBhZ2VudCxcbiAgICAgIGFnZW50czoge1xuICAgICAgICBodHRwOiBjb25maWcuaHR0cEFnZW50LFxuICAgICAgICBodHRwczogY29uZmlnLmh0dHBzQWdlbnRcbiAgICAgIH0sXG4gICAgICBhdXRoOiBhdXRoXG4gICAgfTtcblxuICAgIGlmIChjb25maWcuc29ja2V0UGF0aCkge1xuICAgICAgb3B0aW9ucy5zb2NrZXRQYXRoID0gY29uZmlnLnNvY2tldFBhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMuaG9zdG5hbWUgPSBwYXJzZWQuaG9zdG5hbWU7XG4gICAgICBvcHRpb25zLnBvcnQgPSBwYXJzZWQucG9ydDtcbiAgICB9XG5cbiAgICB2YXIgcHJveHkgPSBjb25maWcucHJveHk7XG5cbiAgICBpZiAoIXByb3h5ICYmIHByb3h5ICE9PSBmYWxzZSkge1xuICAgICAgdmFyIHByb3h5RW52ID0gcHJvdG9jb2wuc2xpY2UoMCwgLTEpICsgJ19wcm94eSc7XG4gICAgICB2YXIgcHJveHlVcmwgPSBwcm9jZXNzLmVudltwcm94eUVudl0gfHwgcHJvY2Vzcy5lbnZbcHJveHlFbnYudG9VcHBlckNhc2UoKV07XG5cbiAgICAgIGlmIChwcm94eVVybCkge1xuICAgICAgICB2YXIgcGFyc2VkUHJveHlVcmwgPSB1cmwucGFyc2UocHJveHlVcmwpO1xuICAgICAgICB2YXIgbm9Qcm94eUVudiA9IHByb2Nlc3MuZW52Lm5vX3Byb3h5IHx8IHByb2Nlc3MuZW52Lk5PX1BST1hZO1xuICAgICAgICB2YXIgc2hvdWxkUHJveHkgPSB0cnVlO1xuXG4gICAgICAgIGlmIChub1Byb3h5RW52KSB7XG4gICAgICAgICAgdmFyIG5vUHJveHkgPSBub1Byb3h5RW52LnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uIHRyaW0ocykge1xuICAgICAgICAgICAgcmV0dXJuIHMudHJpbSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNob3VsZFByb3h5ID0gIW5vUHJveHkuc29tZShmdW5jdGlvbiBwcm94eU1hdGNoKHByb3h5RWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKCFwcm94eUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocHJveHlFbGVtZW50ID09PSAnKicpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwcm94eUVsZW1lbnRbMF0gPT09ICcuJyAmJiBwYXJzZWQuaG9zdG5hbWUuc3Vic3RyKHBhcnNlZC5ob3N0bmFtZS5sZW5ndGggLSBwcm94eUVsZW1lbnQubGVuZ3RoKSA9PT0gcHJveHlFbGVtZW50KSB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VkLmhvc3RuYW1lID09PSBwcm94eUVsZW1lbnQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2hvdWxkUHJveHkpIHtcbiAgICAgICAgICBwcm94eSA9IHtcbiAgICAgICAgICAgIGhvc3Q6IHBhcnNlZFByb3h5VXJsLmhvc3RuYW1lLFxuICAgICAgICAgICAgcG9ydDogcGFyc2VkUHJveHlVcmwucG9ydCxcbiAgICAgICAgICAgIHByb3RvY29sOiBwYXJzZWRQcm94eVVybC5wcm90b2NvbFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAocGFyc2VkUHJveHlVcmwuYXV0aCkge1xuICAgICAgICAgICAgdmFyIHByb3h5VXJsQXV0aCA9IHBhcnNlZFByb3h5VXJsLmF1dGguc3BsaXQoJzonKTtcbiAgICAgICAgICAgIHByb3h5LmF1dGggPSB7XG4gICAgICAgICAgICAgIHVzZXJuYW1lOiBwcm94eVVybEF1dGhbMF0sXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiBwcm94eVVybEF1dGhbMV1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb3h5KSB7XG4gICAgICBvcHRpb25zLmhlYWRlcnMuaG9zdCA9IHBhcnNlZC5ob3N0bmFtZSArIChwYXJzZWQucG9ydCA/ICc6JyArIHBhcnNlZC5wb3J0IDogJycpO1xuICAgICAgc2V0UHJveHkob3B0aW9ucywgcHJveHksIHByb3RvY29sICsgJy8vJyArIHBhcnNlZC5ob3N0bmFtZSArIChwYXJzZWQucG9ydCA/ICc6JyArIHBhcnNlZC5wb3J0IDogJycpICsgb3B0aW9ucy5wYXRoKTtcbiAgICB9XG5cbiAgICB2YXIgdHJhbnNwb3J0O1xuICAgIHZhciBpc0h0dHBzUHJveHkgPSBpc0h0dHBzUmVxdWVzdCAmJiAocHJveHkgPyBpc0h0dHBzLnRlc3QocHJveHkucHJvdG9jb2wpIDogdHJ1ZSk7XG5cbiAgICBpZiAoY29uZmlnLnRyYW5zcG9ydCkge1xuICAgICAgdHJhbnNwb3J0ID0gY29uZmlnLnRyYW5zcG9ydDtcbiAgICB9IGVsc2UgaWYgKGNvbmZpZy5tYXhSZWRpcmVjdHMgPT09IDApIHtcbiAgICAgIHRyYW5zcG9ydCA9IGlzSHR0cHNQcm94eSA/IGh0dHBzIDogaHR0cDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNvbmZpZy5tYXhSZWRpcmVjdHMpIHtcbiAgICAgICAgb3B0aW9ucy5tYXhSZWRpcmVjdHMgPSBjb25maWcubWF4UmVkaXJlY3RzO1xuICAgICAgfVxuXG4gICAgICB0cmFuc3BvcnQgPSBpc0h0dHBzUHJveHkgPyBodHRwc0ZvbGxvdyA6IGh0dHBGb2xsb3c7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5tYXhCb2R5TGVuZ3RoID4gLTEpIHtcbiAgICAgIG9wdGlvbnMubWF4Qm9keUxlbmd0aCA9IGNvbmZpZy5tYXhCb2R5TGVuZ3RoO1xuICAgIH0gLy8gQ3JlYXRlIHRoZSByZXF1ZXN0XG5cblxuICAgIHZhciByZXEgPSB0cmFuc3BvcnQucmVxdWVzdChvcHRpb25zLCBmdW5jdGlvbiBoYW5kbGVSZXNwb25zZShyZXMpIHtcbiAgICAgIGlmIChyZXEuYWJvcnRlZCkgcmV0dXJuOyAvLyB1bmNvbXByZXNzIHRoZSByZXNwb25zZSBib2R5IHRyYW5zcGFyZW50bHkgaWYgcmVxdWlyZWRcblxuICAgICAgdmFyIHN0cmVhbSA9IHJlczsgLy8gcmV0dXJuIHRoZSBsYXN0IHJlcXVlc3QgaW4gY2FzZSBvZiByZWRpcmVjdHNcblxuICAgICAgdmFyIGxhc3RSZXF1ZXN0ID0gcmVzLnJlcSB8fCByZXE7IC8vIGlmIG5vIGNvbnRlbnQsIGlzIEhFQUQgcmVxdWVzdCBvciBkZWNvbXByZXNzIGRpc2FibGVkIHdlIHNob3VsZCBub3QgZGVjb21wcmVzc1xuXG4gICAgICBpZiAocmVzLnN0YXR1c0NvZGUgIT09IDIwNCAmJiBsYXN0UmVxdWVzdC5tZXRob2QgIT09ICdIRUFEJyAmJiBjb25maWcuZGVjb21wcmVzcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgc3dpdGNoIChyZXMuaGVhZGVyc1snY29udGVudC1lbmNvZGluZyddKSB7XG4gICAgICAgICAgLyplc2xpbnQgZGVmYXVsdC1jYXNlOjAqL1xuICAgICAgICAgIGNhc2UgJ2d6aXAnOlxuICAgICAgICAgIGNhc2UgJ2NvbXByZXNzJzpcbiAgICAgICAgICBjYXNlICdkZWZsYXRlJzpcbiAgICAgICAgICAgIC8vIGFkZCB0aGUgdW56aXBwZXIgdG8gdGhlIGJvZHkgc3RyZWFtIHByb2Nlc3NpbmcgcGlwZWxpbmVcbiAgICAgICAgICAgIHN0cmVhbSA9IHN0cmVhbS5waXBlKHpsaWIuY3JlYXRlVW56aXAoKSk7IC8vIHJlbW92ZSB0aGUgY29udGVudC1lbmNvZGluZyBpbiBvcmRlciB0byBub3QgY29uZnVzZSBkb3duc3RyZWFtIG9wZXJhdGlvbnNcblxuICAgICAgICAgICAgZGVsZXRlIHJlcy5oZWFkZXJzWydjb250ZW50LWVuY29kaW5nJ107XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgIHN0YXR1czogcmVzLnN0YXR1c0NvZGUsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcy5zdGF0dXNNZXNzYWdlLFxuICAgICAgICBoZWFkZXJzOiByZXMuaGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHJlcXVlc3Q6IGxhc3RSZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ3N0cmVhbScpIHtcbiAgICAgICAgcmVzcG9uc2UuZGF0YSA9IHN0cmVhbTtcbiAgICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3BvbnNlQnVmZmVyID0gW107XG4gICAgICAgIHN0cmVhbS5vbignZGF0YScsIGZ1bmN0aW9uIGhhbmRsZVN0cmVhbURhdGEoY2h1bmspIHtcbiAgICAgICAgICByZXNwb25zZUJ1ZmZlci5wdXNoKGNodW5rKTsgLy8gbWFrZSBzdXJlIHRoZSBjb250ZW50IGxlbmd0aCBpcyBub3Qgb3ZlciB0aGUgbWF4Q29udGVudExlbmd0aCBpZiBzcGVjaWZpZWRcblxuICAgICAgICAgIGlmIChjb25maWcubWF4Q29udGVudExlbmd0aCA+IC0xICYmIEJ1ZmZlci5jb25jYXQocmVzcG9uc2VCdWZmZXIpLmxlbmd0aCA+IGNvbmZpZy5tYXhDb250ZW50TGVuZ3RoKSB7XG4gICAgICAgICAgICBzdHJlYW0uZGVzdHJveSgpO1xuICAgICAgICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdtYXhDb250ZW50TGVuZ3RoIHNpemUgb2YgJyArIGNvbmZpZy5tYXhDb250ZW50TGVuZ3RoICsgJyBleGNlZWRlZCcsIGNvbmZpZywgbnVsbCwgbGFzdFJlcXVlc3QpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzdHJlYW0ub24oJ2Vycm9yJywgZnVuY3Rpb24gaGFuZGxlU3RyZWFtRXJyb3IoZXJyKSB7XG4gICAgICAgICAgaWYgKHJlcS5hYm9ydGVkKSByZXR1cm47XG4gICAgICAgICAgcmVqZWN0KGVuaGFuY2VFcnJvcihlcnIsIGNvbmZpZywgbnVsbCwgbGFzdFJlcXVlc3QpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHN0cmVhbS5vbignZW5kJywgZnVuY3Rpb24gaGFuZGxlU3RyZWFtRW5kKCkge1xuICAgICAgICAgIHZhciByZXNwb25zZURhdGEgPSBCdWZmZXIuY29uY2F0KHJlc3BvbnNlQnVmZmVyKTtcblxuICAgICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnYXJyYXlidWZmZXInKSB7XG4gICAgICAgICAgICByZXNwb25zZURhdGEgPSByZXNwb25zZURhdGEudG9TdHJpbmcoY29uZmlnLnJlc3BvbnNlRW5jb2RpbmcpO1xuXG4gICAgICAgICAgICBpZiAoIWNvbmZpZy5yZXNwb25zZUVuY29kaW5nIHx8IGNvbmZpZy5yZXNwb25zZUVuY29kaW5nID09PSAndXRmOCcpIHtcbiAgICAgICAgICAgICAgcmVzcG9uc2VEYXRhID0gdXRpbHMuc3RyaXBCT00ocmVzcG9uc2VEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNwb25zZS5kYXRhID0gcmVzcG9uc2VEYXRhO1xuICAgICAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7IC8vIEhhbmRsZSBlcnJvcnNcblxuICAgIHJlcS5vbignZXJyb3InLCBmdW5jdGlvbiBoYW5kbGVSZXF1ZXN0RXJyb3IoZXJyKSB7XG4gICAgICBpZiAocmVxLmFib3J0ZWQgJiYgZXJyLmNvZGUgIT09ICdFUlJfRlJfVE9PX01BTllfUkVESVJFQ1RTJykgcmV0dXJuO1xuICAgICAgcmVqZWN0KGVuaGFuY2VFcnJvcihlcnIsIGNvbmZpZywgbnVsbCwgcmVxKSk7XG4gICAgfSk7IC8vIEhhbmRsZSByZXF1ZXN0IHRpbWVvdXRcblxuICAgIGlmIChjb25maWcudGltZW91dCkge1xuICAgICAgLy8gU29tZXRpbWUsIHRoZSByZXNwb25zZSB3aWxsIGJlIHZlcnkgc2xvdywgYW5kIGRvZXMgbm90IHJlc3BvbmQsIHRoZSBjb25uZWN0IGV2ZW50IHdpbGwgYmUgYmxvY2sgYnkgZXZlbnQgbG9vcCBzeXN0ZW0uXG4gICAgICAvLyBBbmQgdGltZXIgY2FsbGJhY2sgd2lsbCBiZSBmaXJlZCwgYW5kIGFib3J0KCkgd2lsbCBiZSBpbnZva2VkIGJlZm9yZSBjb25uZWN0aW9uLCB0aGVuIGdldCBcInNvY2tldCBoYW5nIHVwXCIgYW5kIGNvZGUgRUNPTk5SRVNFVC5cbiAgICAgIC8vIEF0IHRoaXMgdGltZSwgaWYgd2UgaGF2ZSBhIGxhcmdlIG51bWJlciBvZiByZXF1ZXN0LCBub2RlanMgd2lsbCBoYW5nIHVwIHNvbWUgc29ja2V0IG9uIGJhY2tncm91bmQuIGFuZCB0aGUgbnVtYmVyIHdpbGwgdXAgYW5kIHVwLlxuICAgICAgLy8gQW5kIHRoZW4gdGhlc2Ugc29ja2V0IHdoaWNoIGJlIGhhbmcgdXAgd2lsbCBkZXZvcmluZyBDUFUgbGl0dGxlIGJ5IGxpdHRsZS5cbiAgICAgIC8vIENsaWVudFJlcXVlc3Quc2V0VGltZW91dCB3aWxsIGJlIGZpcmVkIG9uIHRoZSBzcGVjaWZ5IG1pbGxpc2Vjb25kcywgYW5kIGNhbiBtYWtlIHN1cmUgdGhhdCBhYm9ydCgpIHdpbGwgYmUgZmlyZWQgYWZ0ZXIgY29ubmVjdC5cbiAgICAgIHJlcS5zZXRUaW1lb3V0KGNvbmZpZy50aW1lb3V0LCBmdW5jdGlvbiBoYW5kbGVSZXF1ZXN0VGltZW91dCgpIHtcbiAgICAgICAgcmVxLmFib3J0KCk7XG4gICAgICAgIHJlamVjdChjcmVhdGVFcnJvcigndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLCByZXEpKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgIC8vIEhhbmRsZSBjYW5jZWxsYXRpb25cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gb25DYW5jZWxlZChjYW5jZWwpIHtcbiAgICAgICAgaWYgKHJlcS5hYm9ydGVkKSByZXR1cm47XG4gICAgICAgIHJlcS5hYm9ydCgpO1xuICAgICAgICByZWplY3QoY2FuY2VsKTtcbiAgICAgIH0pO1xuICAgIH0gLy8gU2VuZCB0aGUgcmVxdWVzdFxuXG5cbiAgICBpZiAodXRpbHMuaXNTdHJlYW0oZGF0YSkpIHtcbiAgICAgIGRhdGEub24oJ2Vycm9yJywgZnVuY3Rpb24gaGFuZGxlU3RyZWFtRXJyb3IoZXJyKSB7XG4gICAgICAgIHJlamVjdChlbmhhbmNlRXJyb3IoZXJyLCBjb25maWcsIG51bGwsIHJlcSkpO1xuICAgICAgfSkucGlwZShyZXEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXEuZW5kKGRhdGEpO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG52YXIgc2V0dGxlID0gcmVxdWlyZSgnLi8uLi9jb3JlL3NldHRsZScpO1xuXG52YXIgY29va2llcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb29raWVzJyk7XG5cbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xuXG52YXIgYnVpbGRGdWxsUGF0aCA9IHJlcXVpcmUoJy4uL2NvcmUvYnVpbGRGdWxsUGF0aCcpO1xuXG52YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL3BhcnNlSGVhZGVycycpO1xuXG52YXIgaXNVUkxTYW1lT3JpZ2luID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbicpO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7IC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCA/IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChjb25maWcuYXV0aC5wYXNzd29yZCkpIDogJyc7XG4gICAgICByZXF1ZXN0SGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBidG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpO1xuICAgIH1cblxuICAgIHZhciBmdWxsUGF0aCA9IGJ1aWxkRnVsbFBhdGgoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICAgIHJlcXVlc3Qub3Blbihjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpOyAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7IC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGVcblxuICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCB8fCByZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSAvLyBUaGUgcmVxdWVzdCBlcnJvcmVkIG91dCBhbmQgd2UgZGlkbid0IGdldCBhIHJlc3BvbnNlLCB0aGlzIHdpbGwgYmVcbiAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgLy8gd2lsbCByZXR1cm4gc3RhdHVzIGFzIDAgZXZlbiB0aG91Z2ggaXQncyBhIHN1Y2Nlc3NmdWwgcmVxdWVzdFxuXG5cbiAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9IC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG5cblxuICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFjb25maWcucmVzcG9uc2VUeXBlIHx8IGNvbmZpZy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/IHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RcbiAgICAgIH07XG4gICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7IC8vIENsZWFuIHVwIHJlcXVlc3RcblxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTsgLy8gSGFuZGxlIGJyb3dzZXIgcmVxdWVzdCBjYW5jZWxsYXRpb24gKGFzIG9wcG9zZWQgdG8gYSBtYW51YWwgY2FuY2VsbGF0aW9uKVxuXG5cbiAgICByZXF1ZXN0Lm9uYWJvcnQgPSBmdW5jdGlvbiBoYW5kbGVBYm9ydCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignUmVxdWVzdCBhYm9ydGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJywgcmVxdWVzdCkpOyAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07IC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcblxuXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG4gICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcbiAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnLCBudWxsLCByZXF1ZXN0KSk7IC8vIENsZWFuIHVwIHJlcXVlc3RcblxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTsgLy8gSGFuZGxlIHRpbWVvdXRcblxuXG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgdmFyIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSAndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnO1xuXG4gICAgICBpZiAoY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSA9IGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlO1xuICAgICAgfVxuXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IodGltZW91dEVycm9yTWVzc2FnZSwgY29uZmlnLCAnRUNPTk5BQk9SVEVEJywgcmVxdWVzdCkpOyAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07IC8vIEFkZCB4c3JmIGhlYWRlclxuICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG5cblxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oZnVsbFBhdGgpKSAmJiBjb25maWcueHNyZkNvb2tpZU5hbWUgPyBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH0gLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcblxuXG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuXG5cbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9ICEhY29uZmlnLndpdGhDcmVkZW50aWFscztcbiAgICB9IC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcblxuXG4gICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gRXhwZWN0ZWQgRE9NRXhjZXB0aW9uIHRocm93biBieSBicm93c2VycyBub3QgY29tcGF0aWJsZSBYTUxIdHRwUmVxdWVzdCBMZXZlbCAyLlxuICAgICAgICAvLyBCdXQsIHRoaXMgY2FuIGJlIHN1cHByZXNzZWQgZm9yICdqc29uJyB0eXBlIGFzIGl0IGNhbiBiZSBwYXJzZWQgYnkgZGVmYXVsdCAndHJhbnNmb3JtUmVzcG9uc2UnIGZ1bmN0aW9uLlxuICAgICAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuXG5cbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcbiAgICB9IC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG5cblxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgIC8vIEhhbmRsZSBjYW5jZWxsYXRpb25cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gb25DYW5jZWxlZChjYW5jZWwpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZWplY3QoY2FuY2VsKTsgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXG4gICAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFyZXF1ZXN0RGF0YSkge1xuICAgICAgcmVxdWVzdERhdGEgPSBudWxsO1xuICAgIH0gLy8gU2VuZCB0aGUgcmVxdWVzdFxuXG5cbiAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEpO1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcblxudmFyIEF4aW9zID0gcmVxdWlyZSgnLi9jb3JlL0F4aW9zJyk7XG5cbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vY29yZS9tZXJnZUNvbmZpZycpO1xuXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpOyAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTsgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG5cbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcbiAgcmV0dXJuIGluc3RhbmNlO1xufSAvLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcblxuXG52YXIgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7IC8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuXG5heGlvcy5BeGlvcyA9IEF4aW9zOyAvLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG5cbmF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICByZXR1cm4gY3JlYXRlSW5zdGFuY2UobWVyZ2VDb25maWcoYXhpb3MuZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG59OyAvLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cblxuXG5heGlvcy5DYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWwnKTtcbmF4aW9zLkNhbmNlbFRva2VuID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsVG9rZW4nKTtcbmF4aW9zLmlzQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvaXNDYW5jZWwnKTsgLy8gRXhwb3NlIGFsbC9zcHJlYWRcblxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuXG5heGlvcy5zcHJlYWQgPSByZXF1aXJlKCcuL2hlbHBlcnMvc3ByZWFkJyk7IC8vIEV4cG9zZSBpc0F4aW9zRXJyb3JcblxuYXhpb3MuaXNBeGlvc0Vycm9yID0gcmVxdWlyZSgnLi9oZWxwZXJzL2lzQXhpb3NFcnJvcicpO1xubW9kdWxlLmV4cG9ydHMgPSBheGlvczsgLy8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5cbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvczsiLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5cbmZ1bmN0aW9uIENhbmNlbChtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59XG5cbkNhbmNlbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuICdDYW5jZWwnICsgKHRoaXMubWVzc2FnZSA/ICc6ICcgKyB0aGlzLm1lc3NhZ2UgOiAnJyk7XG59O1xuXG5DYW5jZWwucHJvdG90eXBlLl9fQ0FOQ0VMX18gPSB0cnVlO1xubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi9DYW5jZWwnKTtcbi8qKlxuICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV4ZWN1dG9yIFRoZSBleGVjdXRvciBmdW5jdGlvbi5cbiAqL1xuXG5cbmZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZVByb21pc2U7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcbiAgdmFyIHRva2VuID0gdGhpcztcbiAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcbiAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsKG1lc3NhZ2UpO1xuICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gIH0pO1xufVxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5cblxuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgfVxufTtcbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuXG5cbkNhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcbiAgdmFyIGNhbmNlbDtcbiAgdmFyIHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcbiAgICBjYW5jZWwgPSBjO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICB0b2tlbjogdG9rZW4sXG4gICAgY2FuY2VsOiBjYW5jZWxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQ2FuY2VsKHZhbHVlKSB7XG4gIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcblxudmFyIEludGVyY2VwdG9yTWFuYWdlciA9IHJlcXVpcmUoJy4vSW50ZXJjZXB0b3JNYW5hZ2VyJyk7XG5cbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xuXG52YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlKCcuL21lcmdlQ29uZmlnJyk7XG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5cblxuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcgc3BlY2lmaWMgZm9yIHRoaXMgcmVxdWVzdCAobWVyZ2VkIHdpdGggdGhpcy5kZWZhdWx0cylcbiAqL1xuXG5cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuICAgIGNvbmZpZy51cmwgPSBhcmd1bWVudHNbMF07XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICB9XG5cbiAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTsgLy8gU2V0IGNvbmZpZy5tZXRob2RcblxuICBpZiAoY29uZmlnLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSBpZiAodGhpcy5kZWZhdWx0cy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gdGhpcy5kZWZhdWx0cy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcubWV0aG9kID0gJ2dldCc7XG4gIH0gLy8gSG9vayB1cCBpbnRlcmNlcHRvcnMgbWlkZGxld2FyZVxuXG5cbiAgdmFyIGNoYWluID0gW2Rpc3BhdGNoUmVxdWVzdCwgdW5kZWZpbmVkXTtcbiAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbkF4aW9zLnByb3RvdHlwZS5nZXRVcmkgPSBmdW5jdGlvbiBnZXRVcmkoY29uZmlnKSB7XG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIHJldHVybiBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcikucmVwbGFjZSgvXlxcPy8sICcnKTtcbn07IC8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xuXG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAnb3B0aW9ucyddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uICh1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogKGNvbmZpZyB8fCB7fSkuZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbiAodXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcbm1vZHVsZS5leHBvcnRzID0gQXhpb3M7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgdGhpcy5oYW5kbGVycyA9IFtdO1xufVxuLyoqXG4gKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gKi9cblxuXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkKSB7XG4gIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG4gICAgcmVqZWN0ZWQ6IHJlamVjdGVkXG4gIH0pO1xuICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xufTtcbi8qKlxuICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICovXG5cblxuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG4gIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgfVxufTtcbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAqL1xuXG5cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgIGZuKGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0Fic29sdXRlVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9pc0Fic29sdXRlVVJMJyk7XG5cbnZhciBjb21iaW5lVVJMcyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvY29tYmluZVVSTHMnKTtcbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBiYXNlVVJMIHdpdGggdGhlIHJlcXVlc3RlZFVSTCxcbiAqIG9ubHkgd2hlbiB0aGUgcmVxdWVzdGVkVVJMIGlzIG5vdCBhbHJlYWR5IGFuIGFic29sdXRlIFVSTC5cbiAqIElmIHRoZSByZXF1ZXN0VVJMIGlzIGFic29sdXRlLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHJlcXVlc3RlZFVSTCB1bnRvdWNoZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdGVkVVJMIEFic29sdXRlIG9yIHJlbGF0aXZlIFVSTCB0byBjb21iaW5lXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgZnVsbCBwYXRoXG4gKi9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkRnVsbFBhdGgoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKSB7XG4gIGlmIChiYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKHJlcXVlc3RlZFVSTCkpIHtcbiAgICByZXR1cm4gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKTtcbiAgfVxuXG4gIHJldHVybiByZXF1ZXN0ZWRVUkw7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVuaGFuY2VFcnJvciA9IHJlcXVpcmUoJy4vZW5oYW5jZUVycm9yJyk7XG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIHJldHVybiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxudmFyIHRyYW5zZm9ybURhdGEgPSByZXF1aXJlKCcuL3RyYW5zZm9ybURhdGEnKTtcblxudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG5cbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cblxuXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxufVxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcbiAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpOyAvLyBFbnN1cmUgaGVhZGVycyBleGlzdFxuXG4gIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307IC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcblxuICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEoY29uZmlnLmRhdGEsIGNvbmZpZy5oZWFkZXJzLCBjb25maWcudHJhbnNmb3JtUmVxdWVzdCk7IC8vIEZsYXR0ZW4gaGVhZGVyc1xuXG4gIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoY29uZmlnLmhlYWRlcnMuY29tbW9uIHx8IHt9LCBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSwgY29uZmlnLmhlYWRlcnMpO1xuICB1dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLCBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcbiAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgfSk7XG4gIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcbiAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7IC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG5cbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShyZXNwb25zZS5kYXRhLCByZXNwb25zZS5oZWFkZXJzLCBjb25maWcudHJhbnNmb3JtUmVzcG9uc2UpO1xuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpOyAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEocmVhc29uLnJlc3BvbnNlLmRhdGEsIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLCBjb25maWcudHJhbnNmb3JtUmVzcG9uc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcblxuICBpZiAoY29kZSkge1xuICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuICB9XG5cbiAgZXJyb3IucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gIGVycm9yLmlzQXhpb3NFcnJvciA9IHRydWU7XG5cbiAgZXJyb3IudG9KU09OID0gZnVuY3Rpb24gdG9KU09OKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBTdGFuZGFyZFxuICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgLy8gTWljcm9zb2Z0XG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIG51bWJlcjogdGhpcy5udW1iZXIsXG4gICAgICAvLyBNb3ppbGxhXG4gICAgICBmaWxlTmFtZTogdGhpcy5maWxlTmFtZSxcbiAgICAgIGxpbmVOdW1iZXI6IHRoaXMubGluZU51bWJlcixcbiAgICAgIGNvbHVtbk51bWJlcjogdGhpcy5jb2x1bW5OdW1iZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIC8vIEF4aW9zXG4gICAgICBjb25maWc6IHRoaXMuY29uZmlnLFxuICAgICAgY29kZTogdGhpcy5jb2RlXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gZXJyb3I7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbi8qKlxuICogQ29uZmlnLXNwZWNpZmljIG1lcmdlLWZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYSBuZXcgY29uZmlnLW9iamVjdFxuICogYnkgbWVyZ2luZyB0d28gY29uZmlndXJhdGlvbiBvYmplY3RzIHRvZ2V0aGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcxXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMlxuICogQHJldHVybnMge09iamVjdH0gTmV3IG9iamVjdCByZXN1bHRpbmcgZnJvbSBtZXJnaW5nIGNvbmZpZzIgdG8gY29uZmlnMVxuICovXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZUNvbmZpZyhjb25maWcxLCBjb25maWcyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBjb25maWcyID0gY29uZmlnMiB8fCB7fTtcbiAgdmFyIGNvbmZpZyA9IHt9O1xuICB2YXIgdmFsdWVGcm9tQ29uZmlnMktleXMgPSBbJ3VybCcsICdtZXRob2QnLCAnZGF0YSddO1xuICB2YXIgbWVyZ2VEZWVwUHJvcGVydGllc0tleXMgPSBbJ2hlYWRlcnMnLCAnYXV0aCcsICdwcm94eScsICdwYXJhbXMnXTtcbiAgdmFyIGRlZmF1bHRUb0NvbmZpZzJLZXlzID0gWydiYXNlVVJMJywgJ3RyYW5zZm9ybVJlcXVlc3QnLCAndHJhbnNmb3JtUmVzcG9uc2UnLCAncGFyYW1zU2VyaWFsaXplcicsICd0aW1lb3V0JywgJ3RpbWVvdXRNZXNzYWdlJywgJ3dpdGhDcmVkZW50aWFscycsICdhZGFwdGVyJywgJ3Jlc3BvbnNlVHlwZScsICd4c3JmQ29va2llTmFtZScsICd4c3JmSGVhZGVyTmFtZScsICdvblVwbG9hZFByb2dyZXNzJywgJ29uRG93bmxvYWRQcm9ncmVzcycsICdkZWNvbXByZXNzJywgJ21heENvbnRlbnRMZW5ndGgnLCAnbWF4Qm9keUxlbmd0aCcsICdtYXhSZWRpcmVjdHMnLCAndHJhbnNwb3J0JywgJ2h0dHBBZ2VudCcsICdodHRwc0FnZW50JywgJ2NhbmNlbFRva2VuJywgJ3NvY2tldFBhdGgnLCAncmVzcG9uc2VFbmNvZGluZyddO1xuICB2YXIgZGlyZWN0TWVyZ2VLZXlzID0gWyd2YWxpZGF0ZVN0YXR1cyddO1xuXG4gIGZ1bmN0aW9uIGdldE1lcmdlZFZhbHVlKHRhcmdldCwgc291cmNlKSB7XG4gICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QodGFyZ2V0KSAmJiB1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZURlZXBQcm9wZXJ0aWVzKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICB1dGlscy5mb3JFYWNoKHZhbHVlRnJvbUNvbmZpZzJLZXlzLCBmdW5jdGlvbiB2YWx1ZUZyb21Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG4gIHV0aWxzLmZvckVhY2gobWVyZ2VEZWVwUHJvcGVydGllc0tleXMsIG1lcmdlRGVlcFByb3BlcnRpZXMpO1xuICB1dGlscy5mb3JFYWNoKGRlZmF1bHRUb0NvbmZpZzJLZXlzLCBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG4gIHV0aWxzLmZvckVhY2goZGlyZWN0TWVyZ2VLZXlzLCBmdW5jdGlvbiBtZXJnZShwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gY29uZmlnMikge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmIChwcm9wIGluIGNvbmZpZzEpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9KTtcbiAgdmFyIGF4aW9zS2V5cyA9IHZhbHVlRnJvbUNvbmZpZzJLZXlzLmNvbmNhdChtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cykuY29uY2F0KGRlZmF1bHRUb0NvbmZpZzJLZXlzKS5jb25jYXQoZGlyZWN0TWVyZ2VLZXlzKTtcbiAgdmFyIG90aGVyS2V5cyA9IE9iamVjdC5rZXlzKGNvbmZpZzEpLmNvbmNhdChPYmplY3Qua2V5cyhjb25maWcyKSkuZmlsdGVyKGZ1bmN0aW9uIGZpbHRlckF4aW9zS2V5cyhrZXkpIHtcbiAgICByZXR1cm4gYXhpb3NLZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTE7XG4gIH0pO1xuICB1dGlscy5mb3JFYWNoKG90aGVyS2V5cywgbWVyZ2VEZWVwUHJvcGVydGllcyk7XG4gIHJldHVybiBjb25maWc7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi9jcmVhdGVFcnJvcicpO1xuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuXG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLmNvbmZpZywgbnVsbCwgcmVzcG9uc2UucmVxdWVzdCwgcmVzcG9uc2UpKTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4oZGF0YSwgaGVhZGVycyk7XG4gIH0pO1xuICByZXR1cm4gZGF0YTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gcmVxdWlyZSgnLi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUnKTtcblxudmFyIERFRkFVTFRfQ09OVEVOVF9UWVBFID0ge1xuICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbn07XG5cbmZ1bmN0aW9uIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCB2YWx1ZSkge1xuICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnMpICYmIHV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddKSkge1xuICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSB7XG4gIHZhciBhZGFwdGVyO1xuXG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cblxuICByZXR1cm4gYWRhcHRlcjtcbn1cblxudmFyIGRlZmF1bHRzID0ge1xuICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQWNjZXB0Jyk7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fCB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8IHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8IHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8IHV0aWxzLmlzRmlsZShkYXRhKSB8fCB1dGlscy5pc0Jsb2IoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cblxuICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLyogSWdub3JlICovXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG4gIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG4gIG1heEJvZHlMZW5ndGg6IC0xLFxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9XG59O1xuZGVmYXVsdHMuaGVhZGVycyA9IHtcbiAgY29tbW9uOiB7XG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gIH1cbn07XG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG59KTtcbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkucmVwbGFjZSgvJTNBL2dpLCAnOicpLnJlcGxhY2UoLyUyNC9nLCAnJCcpLnJlcGxhY2UoLyUyQy9naSwgJywnKS5yZXBsYWNlKC8lMjAvZywgJysnKS5yZXBsYWNlKC8lNUIvZ2ksICdbJykucmVwbGFjZSgvJTVEL2dpLCAnXScpO1xufVxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgaWYgKCFwYXJhbXMpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG5cbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG4gICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IFt2YWxdO1xuICAgICAgfVxuXG4gICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KSB7XG4gICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcbiAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYpKSB7XG4gICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuICB9XG5cbiAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICB2YXIgaGFzaG1hcmtJbmRleCA9IHVybC5pbmRleE9mKCcjJyk7XG5cbiAgICBpZiAoaGFzaG1hcmtJbmRleCAhPT0gLTEpIHtcbiAgICAgIHVybCA9IHVybC5zbGljZSgwLCBoYXNobWFya0luZGV4KTtcbiAgICB9XG5cbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTsiLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuICByZXR1cm4gcmVsYXRpdmVVUkwgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJykgOiBiYXNlVVJMO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID8gLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG5mdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIHJldHVybiB7XG4gICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuICAgICAgY29va2llLnB1c2gobmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuXG4gICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgfSxcbiAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICByZXR1cm4gbWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbDtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgfVxuICB9O1xufSgpIDogLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICByZXR1cm4ge1xuICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgfTtcbn0oKTsiLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufTsiLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3NcbiAqXG4gKiBAcGFyYW0geyp9IHBheWxvYWQgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvcywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0F4aW9zRXJyb3IocGF5bG9hZCkge1xuICByZXR1cm4gdHlwZW9mIHBheWxvYWQgPT09ICdvYmplY3QnICYmIHBheWxvYWQuaXNBeGlvc0Vycm9yID09PSB0cnVlO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID8gLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIGhhdmUgZnVsbCBzdXBwb3J0IG9mIHRoZSBBUElzIG5lZWRlZCB0byB0ZXN0XG4vLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbmZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICB2YXIgdXJsUGFyc2luZ05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gIHZhciBvcmlnaW5VUkw7XG4gIC8qKlxuICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICovXG5cbiAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICB2YXIgaHJlZiA9IHVybDtcblxuICAgIGlmIChtc2llKSB7XG4gICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcbiAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgIH1cblxuICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpOyAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG5cbiAgICByZXR1cm4ge1xuICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG4gICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcbiAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcbiAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICBwYXRobmFtZTogdXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycgPyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6ICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgfTtcbiAgfVxuXG4gIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAvKipcbiAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG4gICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuICAqL1xuXG4gIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgIHZhciBwYXJzZWQgPSB1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgIHJldHVybiBwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJiBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3Q7XG4gIH07XG59KCkgOiAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xufSgpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTsgLy8gSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcbi8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcblxuXG52YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbJ2FnZScsICdhdXRob3JpemF0aW9uJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ2NvbnRlbnQtdHlwZScsICdldGFnJywgJ2V4cGlyZXMnLCAnZnJvbScsICdob3N0JywgJ2lmLW1vZGlmaWVkLXNpbmNlJywgJ2lmLXVubW9kaWZpZWQtc2luY2UnLCAnbGFzdC1tb2RpZmllZCcsICdsb2NhdGlvbicsICdtYXgtZm9yd2FyZHMnLCAncHJveHktYXV0aG9yaXphdGlvbicsICdyZWZlcmVyJywgJ3JldHJ5LWFmdGVyJywgJ3VzZXItYWdlbnQnXTtcbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICB2YXIgcGFyc2VkID0ge307XG4gIHZhciBrZXk7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuXG4gIGlmICghaGVhZGVycykge1xuICAgIHJldHVybiBwYXJzZWQ7XG4gIH1cblxuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuICAgIGkgPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBrZXkgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKDAsIGkpKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoaSArIDEpKTtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgIGlmIChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZi5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBwYXJzZWQ7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbi8qZ2xvYmFsIHRvU3RyaW5nOnRydWUqL1xuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5mdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNCdWZmZXIodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbCkgJiYgdmFsLmNvbnN0cnVjdG9yICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwuY29uc3RydWN0b3IpICYmIHR5cGVvZiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyKHZhbCk7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEZvcm1EYXRhLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzRm9ybURhdGEodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIEZvcm1EYXRhO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gIHZhciByZXN1bHQ7XG5cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgQXJyYXlCdWZmZXIuaXNWaWV3KSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gdmFsICYmIHZhbC5idWZmZXIgJiYgdmFsLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcic7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsKSB7XG4gIGlmICh0b1N0cmluZy5jYWxsKHZhbCkgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWwpO1xuICByZXR1cm4gcHJvdG90eXBlID09PSBudWxsIHx8IHByb3RvdHlwZSA9PT0gT2JqZWN0LnByb3RvdHlwZTtcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBEYXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzRGF0ZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNGaWxlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGaWxlXSc7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQmxvYlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2VcbiAqL1xuXG5cbmZ1bmN0aW9uIHRyaW0oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJykucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG59XG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuICpcbiAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG4gKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG4gKlxuICogd2ViIHdvcmtlcnM6XG4gKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcbiAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG4gKlxuICogcmVhY3QtbmF0aXZlOlxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcbiAqIG5hdGl2ZXNjcmlwdFxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdOYXRpdmVTY3JpcHQnIG9yICdOUydcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgKG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnIHx8IG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTmF0aXZlU2NyaXB0JyB8fCBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ05TJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJztcbn1cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqL1xuXG5cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfSAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcblxuXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIG9iaiA9IFtvYmpdO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2ldLCBpLCBvYmopO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgb2JqZWN0IGtleXNcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICBmbi5jYWxsKG51bGwsIG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5cblxuZnVuY3Rpb24gbWVyZ2UoKVxuLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovXG57XG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdFtrZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsLnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG4gKi9cblxuXG5mdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGE7XG59XG4vKipcbiAqIFJlbW92ZSBieXRlIG9yZGVyIG1hcmtlci4gVGhpcyBjYXRjaGVzIEVGIEJCIEJGICh0aGUgVVRGLTggQk9NKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IHdpdGggQk9NXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGNvbnRlbnQgdmFsdWUgd2l0aG91dCBCT01cbiAqL1xuXG5cbmZ1bmN0aW9uIHN0cmlwQk9NKGNvbnRlbnQpIHtcbiAgaWYgKGNvbnRlbnQuY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMSk7XG4gIH1cblxuICByZXR1cm4gY29udGVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzQXJyYXk6IGlzQXJyYXksXG4gIGlzQXJyYXlCdWZmZXI6IGlzQXJyYXlCdWZmZXIsXG4gIGlzQnVmZmVyOiBpc0J1ZmZlcixcbiAgaXNGb3JtRGF0YTogaXNGb3JtRGF0YSxcbiAgaXNBcnJheUJ1ZmZlclZpZXc6IGlzQXJyYXlCdWZmZXJWaWV3LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzTnVtYmVyOiBpc051bWJlcixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1BsYWluT2JqZWN0OiBpc1BsYWluT2JqZWN0LFxuICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG4gIGlzRGF0ZTogaXNEYXRlLFxuICBpc0ZpbGU6IGlzRmlsZSxcbiAgaXNCbG9iOiBpc0Jsb2IsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtOiBpc1N0cmVhbSxcbiAgaXNVUkxTZWFyY2hQYXJhbXM6IGlzVVJMU2VhcmNoUGFyYW1zLFxuICBpc1N0YW5kYXJkQnJvd3NlckVudjogaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIGZvckVhY2g6IGZvckVhY2gsXG4gIG1lcmdlOiBtZXJnZSxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIHRyaW06IHRyaW0sXG4gIHN0cmlwQk9NOiBzdHJpcEJPTVxufTsiLCIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSB3ZWIgYnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKi9cbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuZXhwb3J0cy5zdG9yYWdlID0gbG9jYWxzdG9yYWdlKCk7XG5cbmV4cG9ydHMuZGVzdHJveSA9ICgoKSA9PiB7XG4gIGxldCB3YXJuZWQgPSBmYWxzZTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUud2FybignSW5zdGFuY2UgbWV0aG9kIGBkZWJ1Zy5kZXN0cm95KClgIGlzIGRlcHJlY2F0ZWQgYW5kIG5vIGxvbmdlciBkb2VzIGFueXRoaW5nLiBJdCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgdmVyc2lvbiBvZiBgZGVidWdgLicpO1xuICAgIH1cbiAgfTtcbn0pKCk7XG4vKipcbiAqIENvbG9ycy5cbiAqL1xuXG5cbmV4cG9ydHMuY29sb3JzID0gWycjMDAwMENDJywgJyMwMDAwRkYnLCAnIzAwMzNDQycsICcjMDAzM0ZGJywgJyMwMDY2Q0MnLCAnIzAwNjZGRicsICcjMDA5OUNDJywgJyMwMDk5RkYnLCAnIzAwQ0MwMCcsICcjMDBDQzMzJywgJyMwMENDNjYnLCAnIzAwQ0M5OScsICcjMDBDQ0NDJywgJyMwMENDRkYnLCAnIzMzMDBDQycsICcjMzMwMEZGJywgJyMzMzMzQ0MnLCAnIzMzMzNGRicsICcjMzM2NkNDJywgJyMzMzY2RkYnLCAnIzMzOTlDQycsICcjMzM5OUZGJywgJyMzM0NDMDAnLCAnIzMzQ0MzMycsICcjMzNDQzY2JywgJyMzM0NDOTknLCAnIzMzQ0NDQycsICcjMzNDQ0ZGJywgJyM2NjAwQ0MnLCAnIzY2MDBGRicsICcjNjYzM0NDJywgJyM2NjMzRkYnLCAnIzY2Q0MwMCcsICcjNjZDQzMzJywgJyM5OTAwQ0MnLCAnIzk5MDBGRicsICcjOTkzM0NDJywgJyM5OTMzRkYnLCAnIzk5Q0MwMCcsICcjOTlDQzMzJywgJyNDQzAwMDAnLCAnI0NDMDAzMycsICcjQ0MwMDY2JywgJyNDQzAwOTknLCAnI0NDMDBDQycsICcjQ0MwMEZGJywgJyNDQzMzMDAnLCAnI0NDMzMzMycsICcjQ0MzMzY2JywgJyNDQzMzOTknLCAnI0NDMzNDQycsICcjQ0MzM0ZGJywgJyNDQzY2MDAnLCAnI0NDNjYzMycsICcjQ0M5OTAwJywgJyNDQzk5MzMnLCAnI0NDQ0MwMCcsICcjQ0NDQzMzJywgJyNGRjAwMDAnLCAnI0ZGMDAzMycsICcjRkYwMDY2JywgJyNGRjAwOTknLCAnI0ZGMDBDQycsICcjRkYwMEZGJywgJyNGRjMzMDAnLCAnI0ZGMzMzMycsICcjRkYzMzY2JywgJyNGRjMzOTknLCAnI0ZGMzNDQycsICcjRkYzM0ZGJywgJyNGRjY2MDAnLCAnI0ZGNjYzMycsICcjRkY5OTAwJywgJyNGRjk5MzMnLCAnI0ZGQ0MwMCcsICcjRkZDQzMzJ107XG4vKipcbiAqIEN1cnJlbnRseSBvbmx5IFdlYktpdC1iYXNlZCBXZWIgSW5zcGVjdG9ycywgRmlyZWZveCA+PSB2MzEsXG4gKiBhbmQgdGhlIEZpcmVidWcgZXh0ZW5zaW9uIChhbnkgRmlyZWZveCB2ZXJzaW9uKSBhcmUga25vd25cbiAqIHRvIHN1cHBvcnQgXCIlY1wiIENTUyBjdXN0b21pemF0aW9ucy5cbiAqXG4gKiBUT0RPOiBhZGQgYSBgbG9jYWxTdG9yYWdlYCB2YXJpYWJsZSB0byBleHBsaWNpdGx5IGVuYWJsZS9kaXNhYmxlIGNvbG9yc1xuICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxuXG5mdW5jdGlvbiB1c2VDb2xvcnMoKSB7XG4gIC8vIE5COiBJbiBhbiBFbGVjdHJvbiBwcmVsb2FkIHNjcmlwdCwgZG9jdW1lbnQgd2lsbCBiZSBkZWZpbmVkIGJ1dCBub3QgZnVsbHlcbiAgLy8gaW5pdGlhbGl6ZWQuIFNpbmNlIHdlIGtub3cgd2UncmUgaW4gQ2hyb21lLCB3ZSdsbCBqdXN0IGRldGVjdCB0aGlzIGNhc2VcbiAgLy8gZXhwbGljaXRseVxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnByb2Nlc3MgJiYgKHdpbmRvdy5wcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicgfHwgd2luZG93LnByb2Nlc3MuX19ud2pzKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IC8vIEludGVybmV0IEV4cGxvcmVyIGFuZCBFZGdlIGRvIG5vdCBzdXBwb3J0IGNvbG9ycy5cblxuXG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvKGVkZ2V8dHJpZGVudClcXC8oXFxkKykvKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSAvLyBJcyB3ZWJraXQ/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2NDU5NjA2LzM3Njc3M1xuICAvLyBkb2N1bWVudCBpcyB1bmRlZmluZWQgaW4gcmVhY3QtbmF0aXZlOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QtbmF0aXZlL3B1bGwvMTYzMlxuXG5cbiAgcmV0dXJuIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuV2Via2l0QXBwZWFyYW5jZSB8fCAvLyBJcyBmaXJlYnVnPyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTgxMjAvMzc2NzczXG4gIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5jb25zb2xlICYmICh3aW5kb3cuY29uc29sZS5maXJlYnVnIHx8IHdpbmRvdy5jb25zb2xlLmV4Y2VwdGlvbiAmJiB3aW5kb3cuY29uc29sZS50YWJsZSkgfHwgLy8gSXMgZmlyZWZveCA+PSB2MzE/XG4gIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvVG9vbHMvV2ViX0NvbnNvbGUjU3R5bGluZ19tZXNzYWdlc1xuICB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvZmlyZWZveFxcLyhcXGQrKS8pICYmIHBhcnNlSW50KFJlZ0V4cC4kMSwgMTApID49IDMxIHx8IC8vIERvdWJsZSBjaGVjayB3ZWJraXQgaW4gdXNlckFnZW50IGp1c3QgaW4gY2FzZSB3ZSBhcmUgaW4gYSB3b3JrZXJcbiAgdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2FwcGxld2Via2l0XFwvKFxcZCspLyk7XG59XG4vKipcbiAqIENvbG9yaXplIGxvZyBhcmd1bWVudHMgaWYgZW5hYmxlZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblxuZnVuY3Rpb24gZm9ybWF0QXJncyhhcmdzKSB7XG4gIGFyZ3NbMF0gPSAodGhpcy51c2VDb2xvcnMgPyAnJWMnIDogJycpICsgdGhpcy5uYW1lc3BhY2UgKyAodGhpcy51c2VDb2xvcnMgPyAnICVjJyA6ICcgJykgKyBhcmdzWzBdICsgKHRoaXMudXNlQ29sb3JzID8gJyVjICcgOiAnICcpICsgJysnICsgbW9kdWxlLmV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKTtcblxuICBpZiAoIXRoaXMudXNlQ29sb3JzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgYyA9ICdjb2xvcjogJyArIHRoaXMuY29sb3I7XG4gIGFyZ3Muc3BsaWNlKDEsIDAsIGMsICdjb2xvcjogaW5oZXJpdCcpOyAvLyBUaGUgZmluYWwgXCIlY1wiIGlzIHNvbWV3aGF0IHRyaWNreSwgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvdGhlclxuICAvLyBhcmd1bWVudHMgcGFzc2VkIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhlICVjLCBzbyB3ZSBuZWVkIHRvXG4gIC8vIGZpZ3VyZSBvdXQgdGhlIGNvcnJlY3QgaW5kZXggdG8gaW5zZXJ0IHRoZSBDU1MgaW50b1xuXG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCBsYXN0QyA9IDA7XG4gIGFyZ3NbMF0ucmVwbGFjZSgvJVthLXpBLVolXS9nLCBtYXRjaCA9PiB7XG4gICAgaWYgKG1hdGNoID09PSAnJSUnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaW5kZXgrKztcblxuICAgIGlmIChtYXRjaCA9PT0gJyVjJykge1xuICAgICAgLy8gV2Ugb25seSBhcmUgaW50ZXJlc3RlZCBpbiB0aGUgKmxhc3QqICVjXG4gICAgICAvLyAodGhlIHVzZXIgbWF5IGhhdmUgcHJvdmlkZWQgdGhlaXIgb3duKVxuICAgICAgbGFzdEMgPSBpbmRleDtcbiAgICB9XG4gIH0pO1xuICBhcmdzLnNwbGljZShsYXN0QywgMCwgYyk7XG59XG4vKipcbiAqIEludm9rZXMgYGNvbnNvbGUuZGVidWcoKWAgd2hlbiBhdmFpbGFibGUuXG4gKiBOby1vcCB3aGVuIGBjb25zb2xlLmRlYnVnYCBpcyBub3QgYSBcImZ1bmN0aW9uXCIuXG4gKiBJZiBgY29uc29sZS5kZWJ1Z2AgaXMgbm90IGF2YWlsYWJsZSwgZmFsbHMgYmFja1xuICogdG8gYGNvbnNvbGUubG9nYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblxuZXhwb3J0cy5sb2cgPSBjb25zb2xlLmRlYnVnIHx8IGNvbnNvbGUubG9nIHx8ICgoKSA9PiB7fSk7XG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuICB0cnkge1xuICAgIGlmIChuYW1lc3BhY2VzKSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2Uuc2V0SXRlbSgnZGVidWcnLCBuYW1lc3BhY2VzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5zdG9yYWdlLnJlbW92ZUl0ZW0oJ2RlYnVnJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikgey8vIFN3YWxsb3dcbiAgICAvLyBYWFggKEBRaXgtKSBzaG91bGQgd2UgYmUgbG9nZ2luZyB0aGVzZT9cbiAgfVxufVxuLyoqXG4gKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybnMgdGhlIHByZXZpb3VzbHkgcGVyc2lzdGVkIGRlYnVnIG1vZGVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIGxvYWQoKSB7XG4gIGxldCByO1xuXG4gIHRyeSB7XG4gICAgciA9IGV4cG9ydHMuc3RvcmFnZS5nZXRJdGVtKCdkZWJ1ZycpO1xuICB9IGNhdGNoIChlcnJvcikgey8vIFN3YWxsb3dcbiAgICAvLyBYWFggKEBRaXgtKSBzaG91bGQgd2UgYmUgbG9nZ2luZyB0aGVzZT9cbiAgfSAvLyBJZiBkZWJ1ZyBpc24ndCBzZXQgaW4gTFMsIGFuZCB3ZSdyZSBpbiBFbGVjdHJvbiwgdHJ5IHRvIGxvYWQgJERFQlVHXG5cblxuICBpZiAoIXIgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICdlbnYnIGluIHByb2Nlc3MpIHtcbiAgICByID0gcHJvY2Vzcy5lbnYuREVCVUc7XG4gIH1cblxuICByZXR1cm4gcjtcbn1cbi8qKlxuICogTG9jYWxzdG9yYWdlIGF0dGVtcHRzIHRvIHJldHVybiB0aGUgbG9jYWxzdG9yYWdlLlxuICpcbiAqIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugc2FmYXJpIHRocm93c1xuICogd2hlbiBhIHVzZXIgZGlzYWJsZXMgY29va2llcy9sb2NhbHN0b3JhZ2VcbiAqIGFuZCB5b3UgYXR0ZW1wdCB0byBhY2Nlc3MgaXQuXG4gKlxuICogQHJldHVybiB7TG9jYWxTdG9yYWdlfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBsb2NhbHN0b3JhZ2UoKSB7XG4gIHRyeSB7XG4gICAgLy8gVFZNTEtpdCAoQXBwbGUgVFYgSlMgUnVudGltZSkgZG9lcyBub3QgaGF2ZSBhIHdpbmRvdyBvYmplY3QsIGp1c3QgbG9jYWxTdG9yYWdlIGluIHRoZSBnbG9iYWwgY29udGV4dFxuICAgIC8vIFRoZSBCcm93c2VyIGFsc28gaGFzIGxvY2FsU3RvcmFnZSBpbiB0aGUgZ2xvYmFsIGNvbnRleHQuXG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsvLyBTd2FsbG93XG4gICAgLy8gWFhYIChAUWl4LSkgc2hvdWxkIHdlIGJlIGxvZ2dpbmcgdGhlc2U/XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvbW1vbicpKGV4cG9ydHMpO1xuY29uc3Qge1xuICBmb3JtYXR0ZXJzXG59ID0gbW9kdWxlLmV4cG9ydHM7XG4vKipcbiAqIE1hcCAlaiB0byBgSlNPTi5zdHJpbmdpZnkoKWAsIHNpbmNlIG5vIFdlYiBJbnNwZWN0b3JzIGRvIHRoYXQgYnkgZGVmYXVsdC5cbiAqL1xuXG5mb3JtYXR0ZXJzLmogPSBmdW5jdGlvbiAodikge1xuICB0cnkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gJ1tVbmV4cGVjdGVkSlNPTlBhcnNlRXJyb3JdOiAnICsgZXJyb3IubWVzc2FnZTtcbiAgfVxufTsiLCIvKipcbiAqIFRoaXMgaXMgdGhlIGNvbW1vbiBsb2dpYyBmb3IgYm90aCB0aGUgTm9kZS5qcyBhbmQgd2ViIGJyb3dzZXJcbiAqIGltcGxlbWVudGF0aW9ucyBvZiBgZGVidWcoKWAuXG4gKi9cbmZ1bmN0aW9uIHNldHVwKGVudikge1xuICBjcmVhdGVEZWJ1Zy5kZWJ1ZyA9IGNyZWF0ZURlYnVnO1xuICBjcmVhdGVEZWJ1Zy5kZWZhdWx0ID0gY3JlYXRlRGVidWc7XG4gIGNyZWF0ZURlYnVnLmNvZXJjZSA9IGNvZXJjZTtcbiAgY3JlYXRlRGVidWcuZGlzYWJsZSA9IGRpc2FibGU7XG4gIGNyZWF0ZURlYnVnLmVuYWJsZSA9IGVuYWJsZTtcbiAgY3JlYXRlRGVidWcuZW5hYmxlZCA9IGVuYWJsZWQ7XG4gIGNyZWF0ZURlYnVnLmh1bWFuaXplID0gcmVxdWlyZSgnbXMnKTtcbiAgY3JlYXRlRGVidWcuZGVzdHJveSA9IGRlc3Ryb3k7XG4gIE9iamVjdC5rZXlzKGVudikuZm9yRWFjaChrZXkgPT4ge1xuICAgIGNyZWF0ZURlYnVnW2tleV0gPSBlbnZba2V5XTtcbiAgfSk7XG4gIC8qKlxuICAqIFRoZSBjdXJyZW50bHkgYWN0aXZlIGRlYnVnIG1vZGUgbmFtZXMsIGFuZCBuYW1lcyB0byBza2lwLlxuICAqL1xuXG4gIGNyZWF0ZURlYnVnLm5hbWVzID0gW107XG4gIGNyZWF0ZURlYnVnLnNraXBzID0gW107XG4gIC8qKlxuICAqIE1hcCBvZiBzcGVjaWFsIFwiJW5cIiBoYW5kbGluZyBmdW5jdGlvbnMsIGZvciB0aGUgZGVidWcgXCJmb3JtYXRcIiBhcmd1bWVudC5cbiAgKlxuICAqIFZhbGlkIGtleSBuYW1lcyBhcmUgYSBzaW5nbGUsIGxvd2VyIG9yIHVwcGVyLWNhc2UgbGV0dGVyLCBpLmUuIFwiblwiIGFuZCBcIk5cIi5cbiAgKi9cblxuICBjcmVhdGVEZWJ1Zy5mb3JtYXR0ZXJzID0ge307XG4gIC8qKlxuICAqIFNlbGVjdHMgYSBjb2xvciBmb3IgYSBkZWJ1ZyBuYW1lc3BhY2VcbiAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlIFRoZSBuYW1lc3BhY2Ugc3RyaW5nIGZvciB0aGUgZm9yIHRoZSBkZWJ1ZyBpbnN0YW5jZSB0byBiZSBjb2xvcmVkXG4gICogQHJldHVybiB7TnVtYmVyfFN0cmluZ30gQW4gQU5TSSBjb2xvciBjb2RlIGZvciB0aGUgZ2l2ZW4gbmFtZXNwYWNlXG4gICogQGFwaSBwcml2YXRlXG4gICovXG5cbiAgZnVuY3Rpb24gc2VsZWN0Q29sb3IobmFtZXNwYWNlKSB7XG4gICAgbGV0IGhhc2ggPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lc3BhY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIGhhc2ggPSAoaGFzaCA8PCA1KSAtIGhhc2ggKyBuYW1lc3BhY2UuY2hhckNvZGVBdChpKTtcbiAgICAgIGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZURlYnVnLmNvbG9yc1tNYXRoLmFicyhoYXNoKSAlIGNyZWF0ZURlYnVnLmNvbG9ycy5sZW5ndGhdO1xuICB9XG5cbiAgY3JlYXRlRGVidWcuc2VsZWN0Q29sb3IgPSBzZWxlY3RDb2xvcjtcbiAgLyoqXG4gICogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVzcGFjZWAuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlXG4gICogQHJldHVybiB7RnVuY3Rpb259XG4gICogQGFwaSBwdWJsaWNcbiAgKi9cblxuICBmdW5jdGlvbiBjcmVhdGVEZWJ1ZyhuYW1lc3BhY2UpIHtcbiAgICBsZXQgcHJldlRpbWU7XG4gICAgbGV0IGVuYWJsZU92ZXJyaWRlID0gbnVsbDtcblxuICAgIGZ1bmN0aW9uIGRlYnVnKC4uLmFyZ3MpIHtcbiAgICAgIC8vIERpc2FibGVkP1xuICAgICAgaWYgKCFkZWJ1Zy5lbmFibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2VsZiA9IGRlYnVnOyAvLyBTZXQgYGRpZmZgIHRpbWVzdGFtcFxuXG4gICAgICBjb25zdCBjdXJyID0gTnVtYmVyKG5ldyBEYXRlKCkpO1xuICAgICAgY29uc3QgbXMgPSBjdXJyIC0gKHByZXZUaW1lIHx8IGN1cnIpO1xuICAgICAgc2VsZi5kaWZmID0gbXM7XG4gICAgICBzZWxmLnByZXYgPSBwcmV2VGltZTtcbiAgICAgIHNlbGYuY3VyciA9IGN1cnI7XG4gICAgICBwcmV2VGltZSA9IGN1cnI7XG4gICAgICBhcmdzWzBdID0gY3JlYXRlRGVidWcuY29lcmNlKGFyZ3NbMF0pO1xuXG4gICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIEFueXRoaW5nIGVsc2UgbGV0J3MgaW5zcGVjdCB3aXRoICVPXG4gICAgICAgIGFyZ3MudW5zaGlmdCgnJU8nKTtcbiAgICAgIH0gLy8gQXBwbHkgYW55IGBmb3JtYXR0ZXJzYCB0cmFuc2Zvcm1hdGlvbnNcblxuXG4gICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgYXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZSgvJShbYS16QS1aJV0pL2csIChtYXRjaCwgZm9ybWF0KSA9PiB7XG4gICAgICAgIC8vIElmIHdlIGVuY291bnRlciBhbiBlc2NhcGVkICUgdGhlbiBkb24ndCBpbmNyZWFzZSB0aGUgYXJyYXkgaW5kZXhcbiAgICAgICAgaWYgKG1hdGNoID09PSAnJSUnKSB7XG4gICAgICAgICAgcmV0dXJuICclJztcbiAgICAgICAgfVxuXG4gICAgICAgIGluZGV4Kys7XG4gICAgICAgIGNvbnN0IGZvcm1hdHRlciA9IGNyZWF0ZURlYnVnLmZvcm1hdHRlcnNbZm9ybWF0XTtcblxuICAgICAgICBpZiAodHlwZW9mIGZvcm1hdHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNvbnN0IHZhbCA9IGFyZ3NbaW5kZXhdO1xuICAgICAgICAgIG1hdGNoID0gZm9ybWF0dGVyLmNhbGwoc2VsZiwgdmFsKTsgLy8gTm93IHdlIG5lZWQgdG8gcmVtb3ZlIGBhcmdzW2luZGV4XWAgc2luY2UgaXQncyBpbmxpbmVkIGluIHRoZSBgZm9ybWF0YFxuXG4gICAgICAgICAgYXJncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIGluZGV4LS07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICB9KTsgLy8gQXBwbHkgZW52LXNwZWNpZmljIGZvcm1hdHRpbmcgKGNvbG9ycywgZXRjLilcblxuICAgICAgY3JlYXRlRGVidWcuZm9ybWF0QXJncy5jYWxsKHNlbGYsIGFyZ3MpO1xuICAgICAgY29uc3QgbG9nRm4gPSBzZWxmLmxvZyB8fCBjcmVhdGVEZWJ1Zy5sb2c7XG4gICAgICBsb2dGbi5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9XG5cbiAgICBkZWJ1Zy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG4gICAgZGVidWcudXNlQ29sb3JzID0gY3JlYXRlRGVidWcudXNlQ29sb3JzKCk7XG4gICAgZGVidWcuY29sb3IgPSBjcmVhdGVEZWJ1Zy5zZWxlY3RDb2xvcihuYW1lc3BhY2UpO1xuICAgIGRlYnVnLmV4dGVuZCA9IGV4dGVuZDtcbiAgICBkZWJ1Zy5kZXN0cm95ID0gY3JlYXRlRGVidWcuZGVzdHJveTsgLy8gWFhYIFRlbXBvcmFyeS4gV2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVidWcsICdlbmFibGVkJywge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBnZXQ6ICgpID0+IGVuYWJsZU92ZXJyaWRlID09PSBudWxsID8gY3JlYXRlRGVidWcuZW5hYmxlZChuYW1lc3BhY2UpIDogZW5hYmxlT3ZlcnJpZGUsXG4gICAgICBzZXQ6IHYgPT4ge1xuICAgICAgICBlbmFibGVPdmVycmlkZSA9IHY7XG4gICAgICB9XG4gICAgfSk7IC8vIEVudi1zcGVjaWZpYyBpbml0aWFsaXphdGlvbiBsb2dpYyBmb3IgZGVidWcgaW5zdGFuY2VzXG5cbiAgICBpZiAodHlwZW9mIGNyZWF0ZURlYnVnLmluaXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNyZWF0ZURlYnVnLmluaXQoZGVidWcpO1xuICAgIH1cblxuICAgIHJldHVybiBkZWJ1ZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGV4dGVuZChuYW1lc3BhY2UsIGRlbGltaXRlcikge1xuICAgIGNvbnN0IG5ld0RlYnVnID0gY3JlYXRlRGVidWcodGhpcy5uYW1lc3BhY2UgKyAodHlwZW9mIGRlbGltaXRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnOicgOiBkZWxpbWl0ZXIpICsgbmFtZXNwYWNlKTtcbiAgICBuZXdEZWJ1Zy5sb2cgPSB0aGlzLmxvZztcbiAgICByZXR1cm4gbmV3RGVidWc7XG4gIH1cbiAgLyoqXG4gICogRW5hYmxlcyBhIGRlYnVnIG1vZGUgYnkgbmFtZXNwYWNlcy4gVGhpcyBjYW4gaW5jbHVkZSBtb2Rlc1xuICAqIHNlcGFyYXRlZCBieSBhIGNvbG9uIGFuZCB3aWxkY2FyZHMuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICAqIEBhcGkgcHVibGljXG4gICovXG5cblxuICBmdW5jdGlvbiBlbmFibGUobmFtZXNwYWNlcykge1xuICAgIGNyZWF0ZURlYnVnLnNhdmUobmFtZXNwYWNlcyk7XG4gICAgY3JlYXRlRGVidWcubmFtZXMgPSBbXTtcbiAgICBjcmVhdGVEZWJ1Zy5za2lwcyA9IFtdO1xuICAgIGxldCBpO1xuICAgIGNvbnN0IHNwbGl0ID0gKHR5cGVvZiBuYW1lc3BhY2VzID09PSAnc3RyaW5nJyA/IG5hbWVzcGFjZXMgOiAnJykuc3BsaXQoL1tcXHMsXSsvKTtcbiAgICBjb25zdCBsZW4gPSBzcGxpdC5sZW5ndGg7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmICghc3BsaXRbaV0pIHtcbiAgICAgICAgLy8gaWdub3JlIGVtcHR5IHN0cmluZ3NcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIG5hbWVzcGFjZXMgPSBzcGxpdFtpXS5yZXBsYWNlKC9cXCovZywgJy4qPycpO1xuXG4gICAgICBpZiAobmFtZXNwYWNlc1swXSA9PT0gJy0nKSB7XG4gICAgICAgIGNyZWF0ZURlYnVnLnNraXBzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzLnN1YnN0cigxKSArICckJykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3JlYXRlRGVidWcubmFtZXMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWVzcGFjZXMgKyAnJCcpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXG4gICogRGlzYWJsZSBkZWJ1ZyBvdXRwdXQuXG4gICpcbiAgKiBAcmV0dXJuIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAgKiBAYXBpIHB1YmxpY1xuICAqL1xuXG5cbiAgZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VzID0gWy4uLmNyZWF0ZURlYnVnLm5hbWVzLm1hcCh0b05hbWVzcGFjZSksIC4uLmNyZWF0ZURlYnVnLnNraXBzLm1hcCh0b05hbWVzcGFjZSkubWFwKG5hbWVzcGFjZSA9PiAnLScgKyBuYW1lc3BhY2UpXS5qb2luKCcsJyk7XG4gICAgY3JlYXRlRGVidWcuZW5hYmxlKCcnKTtcbiAgICByZXR1cm4gbmFtZXNwYWNlcztcbiAgfVxuICAvKipcbiAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIG1vZGUgbmFtZSBpcyBlbmFibGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICogQGFwaSBwdWJsaWNcbiAgKi9cblxuXG4gIGZ1bmN0aW9uIGVuYWJsZWQobmFtZSkge1xuICAgIGlmIChuYW1lW25hbWUubGVuZ3RoIC0gMV0gPT09ICcqJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGV0IGk7XG4gICAgbGV0IGxlbjtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNyZWF0ZURlYnVnLnNraXBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoY3JlYXRlRGVidWcuc2tpcHNbaV0udGVzdChuYW1lKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChpID0gMCwgbGVuID0gY3JlYXRlRGVidWcubmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmIChjcmVhdGVEZWJ1Zy5uYW1lc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvKipcbiAgKiBDb252ZXJ0IHJlZ2V4cCB0byBuYW1lc3BhY2VcbiAgKlxuICAqIEBwYXJhbSB7UmVnRXhwfSByZWd4ZXBcbiAgKiBAcmV0dXJuIHtTdHJpbmd9IG5hbWVzcGFjZVxuICAqIEBhcGkgcHJpdmF0ZVxuICAqL1xuXG5cbiAgZnVuY3Rpb24gdG9OYW1lc3BhY2UocmVnZXhwKSB7XG4gICAgcmV0dXJuIHJlZ2V4cC50b1N0cmluZygpLnN1YnN0cmluZygyLCByZWdleHAudG9TdHJpbmcoKS5sZW5ndGggLSAyKS5yZXBsYWNlKC9cXC5cXCpcXD8kLywgJyonKTtcbiAgfVxuICAvKipcbiAgKiBDb2VyY2UgYHZhbGAuXG4gICpcbiAgKiBAcGFyYW0ge01peGVkfSB2YWxcbiAgKiBAcmV0dXJuIHtNaXhlZH1cbiAgKiBAYXBpIHByaXZhdGVcbiAgKi9cblxuXG4gIGZ1bmN0aW9uIGNvZXJjZSh2YWwpIHtcbiAgICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIHJldHVybiB2YWwuc3RhY2sgfHwgdmFsLm1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuICAvKipcbiAgKiBYWFggRE8gTk9UIFVTRS4gVGhpcyBpcyBhIHRlbXBvcmFyeSBzdHViIGZ1bmN0aW9uLlxuICAqIFhYWCBJdCBXSUxMIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgcmVsZWFzZS5cbiAgKi9cblxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgY29uc29sZS53YXJuKCdJbnN0YW5jZSBtZXRob2QgYGRlYnVnLmRlc3Ryb3koKWAgaXMgZGVwcmVjYXRlZCBhbmQgbm8gbG9uZ2VyIGRvZXMgYW55dGhpbmcuIEl0IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uIG9mIGBkZWJ1Z2AuJyk7XG4gIH1cblxuICBjcmVhdGVEZWJ1Zy5lbmFibGUoY3JlYXRlRGVidWcubG9hZCgpKTtcbiAgcmV0dXJuIGNyZWF0ZURlYnVnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHVwOyIsIi8qKlxuICogRGV0ZWN0IEVsZWN0cm9uIHJlbmRlcmVyIC8gbndqcyBwcm9jZXNzLCB3aGljaCBpcyBub2RlLCBidXQgd2Ugc2hvdWxkXG4gKiB0cmVhdCBhcyBhIGJyb3dzZXIuXG4gKi9cbmlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ3VuZGVmaW5lZCcgfHwgcHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInIHx8IHByb2Nlc3MuYnJvd3NlciA9PT0gdHJ1ZSB8fCBwcm9jZXNzLl9fbndqcykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vYnJvd3Nlci5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL25vZGUuanMnKTtcbn0iLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cbmNvbnN0IHR0eSA9IHJlcXVpcmUoJ3R0eScpO1xuXG5jb25zdCB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuLyoqXG4gKiBUaGlzIGlzIHRoZSBOb2RlLmpzIGltcGxlbWVudGF0aW9uIG9mIGBkZWJ1ZygpYC5cbiAqL1xuXG5cbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuZXhwb3J0cy5kZXN0cm95ID0gdXRpbC5kZXByZWNhdGUoKCkgPT4ge30sICdJbnN0YW5jZSBtZXRob2QgYGRlYnVnLmRlc3Ryb3koKWAgaXMgZGVwcmVjYXRlZCBhbmQgbm8gbG9uZ2VyIGRvZXMgYW55dGhpbmcuIEl0IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uIG9mIGBkZWJ1Z2AuJyk7XG4vKipcbiAqIENvbG9ycy5cbiAqL1xuXG5leHBvcnRzLmNvbG9ycyA9IFs2LCAyLCAzLCA0LCA1LCAxXTtcblxudHJ5IHtcbiAgLy8gT3B0aW9uYWwgZGVwZW5kZW5jeSAoYXMgaW4sIGRvZXNuJ3QgbmVlZCB0byBiZSBpbnN0YWxsZWQsIE5PVCBsaWtlIG9wdGlvbmFsRGVwZW5kZW5jaWVzIGluIHBhY2thZ2UuanNvbilcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuICBjb25zdCBzdXBwb3J0c0NvbG9yID0gcmVxdWlyZSgnc3VwcG9ydHMtY29sb3InKTtcblxuICBpZiAoc3VwcG9ydHNDb2xvciAmJiAoc3VwcG9ydHNDb2xvci5zdGRlcnIgfHwgc3VwcG9ydHNDb2xvcikubGV2ZWwgPj0gMikge1xuICAgIGV4cG9ydHMuY29sb3JzID0gWzIwLCAyMSwgMjYsIDI3LCAzMiwgMzMsIDM4LCAzOSwgNDAsIDQxLCA0MiwgNDMsIDQ0LCA0NSwgNTYsIDU3LCA2MiwgNjMsIDY4LCA2OSwgNzQsIDc1LCA3NiwgNzcsIDc4LCA3OSwgODAsIDgxLCA5MiwgOTMsIDk4LCA5OSwgMTEyLCAxMTMsIDEyOCwgMTI5LCAxMzQsIDEzNSwgMTQ4LCAxNDksIDE2MCwgMTYxLCAxNjIsIDE2MywgMTY0LCAxNjUsIDE2NiwgMTY3LCAxNjgsIDE2OSwgMTcwLCAxNzEsIDE3MiwgMTczLCAxNzgsIDE3OSwgMTg0LCAxODUsIDE5NiwgMTk3LCAxOTgsIDE5OSwgMjAwLCAyMDEsIDIwMiwgMjAzLCAyMDQsIDIwNSwgMjA2LCAyMDcsIDIwOCwgMjA5LCAyMTQsIDIxNSwgMjIwLCAyMjFdO1xuICB9XG59IGNhdGNoIChlcnJvcikgey8vIFN3YWxsb3cgLSB3ZSBvbmx5IGNhcmUgaWYgYHN1cHBvcnRzLWNvbG9yYCBpcyBhdmFpbGFibGU7IGl0IGRvZXNuJ3QgaGF2ZSB0byBiZS5cbn1cbi8qKlxuICogQnVpbGQgdXAgdGhlIGRlZmF1bHQgYGluc3BlY3RPcHRzYCBvYmplY3QgZnJvbSB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICpcbiAqICAgJCBERUJVR19DT0xPUlM9bm8gREVCVUdfREVQVEg9MTAgREVCVUdfU0hPV19ISURERU49ZW5hYmxlZCBub2RlIHNjcmlwdC5qc1xuICovXG5cblxuZXhwb3J0cy5pbnNwZWN0T3B0cyA9IE9iamVjdC5rZXlzKHByb2Nlc3MuZW52KS5maWx0ZXIoa2V5ID0+IHtcbiAgcmV0dXJuIC9eZGVidWdfL2kudGVzdChrZXkpO1xufSkucmVkdWNlKChvYmosIGtleSkgPT4ge1xuICAvLyBDYW1lbC1jYXNlXG4gIGNvbnN0IHByb3AgPSBrZXkuc3Vic3RyaW5nKDYpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXyhbYS16XSkvZywgKF8sIGspID0+IHtcbiAgICByZXR1cm4gay50b1VwcGVyQ2FzZSgpO1xuICB9KTsgLy8gQ29lcmNlIHN0cmluZyB2YWx1ZSBpbnRvIEpTIHZhbHVlXG5cbiAgbGV0IHZhbCA9IHByb2Nlc3MuZW52W2tleV07XG5cbiAgaWYgKC9eKHllc3xvbnx0cnVlfGVuYWJsZWQpJC9pLnRlc3QodmFsKSkge1xuICAgIHZhbCA9IHRydWU7XG4gIH0gZWxzZSBpZiAoL14obm98b2ZmfGZhbHNlfGRpc2FibGVkKSQvaS50ZXN0KHZhbCkpIHtcbiAgICB2YWwgPSBmYWxzZTtcbiAgfSBlbHNlIGlmICh2YWwgPT09ICdudWxsJykge1xuICAgIHZhbCA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gTnVtYmVyKHZhbCk7XG4gIH1cblxuICBvYmpbcHJvcF0gPSB2YWw7XG4gIHJldHVybiBvYmo7XG59LCB7fSk7XG4vKipcbiAqIElzIHN0ZG91dCBhIFRUWT8gQ29sb3JlZCBvdXRwdXQgaXMgZW5hYmxlZCB3aGVuIGB0cnVlYC5cbiAqL1xuXG5mdW5jdGlvbiB1c2VDb2xvcnMoKSB7XG4gIHJldHVybiAnY29sb3JzJyBpbiBleHBvcnRzLmluc3BlY3RPcHRzID8gQm9vbGVhbihleHBvcnRzLmluc3BlY3RPcHRzLmNvbG9ycykgOiB0dHkuaXNhdHR5KHByb2Nlc3Muc3RkZXJyLmZkKTtcbn1cbi8qKlxuICogQWRkcyBBTlNJIGNvbG9yIGVzY2FwZSBjb2RlcyBpZiBlbmFibGVkLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcbiAgY29uc3Qge1xuICAgIG5hbWVzcGFjZTogbmFtZSxcbiAgICB1c2VDb2xvcnNcbiAgfSA9IHRoaXM7XG5cbiAgaWYgKHVzZUNvbG9ycykge1xuICAgIGNvbnN0IGMgPSB0aGlzLmNvbG9yO1xuICAgIGNvbnN0IGNvbG9yQ29kZSA9ICdcXHUwMDFCWzMnICsgKGMgPCA4ID8gYyA6ICc4OzU7JyArIGMpO1xuICAgIGNvbnN0IHByZWZpeCA9IGAgICR7Y29sb3JDb2RlfTsxbSR7bmFtZX0gXFx1MDAxQlswbWA7XG4gICAgYXJnc1swXSA9IHByZWZpeCArIGFyZ3NbMF0uc3BsaXQoJ1xcbicpLmpvaW4oJ1xcbicgKyBwcmVmaXgpO1xuICAgIGFyZ3MucHVzaChjb2xvckNvZGUgKyAnbSsnICsgbW9kdWxlLmV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKSArICdcXHUwMDFCWzBtJyk7XG4gIH0gZWxzZSB7XG4gICAgYXJnc1swXSA9IGdldERhdGUoKSArIG5hbWUgKyAnICcgKyBhcmdzWzBdO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERhdGUoKSB7XG4gIGlmIChleHBvcnRzLmluc3BlY3RPcHRzLmhpZGVEYXRlKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSArICcgJztcbn1cbi8qKlxuICogSW52b2tlcyBgdXRpbC5mb3JtYXQoKWAgd2l0aCB0aGUgc3BlY2lmaWVkIGFyZ3VtZW50cyBhbmQgd3JpdGVzIHRvIHN0ZGVyci5cbiAqL1xuXG5cbmZ1bmN0aW9uIGxvZyguLi5hcmdzKSB7XG4gIHJldHVybiBwcm9jZXNzLnN0ZGVyci53cml0ZSh1dGlsLmZvcm1hdCguLi5hcmdzKSArICdcXG4nKTtcbn1cbi8qKlxuICogU2F2ZSBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblxuZnVuY3Rpb24gc2F2ZShuYW1lc3BhY2VzKSB7XG4gIGlmIChuYW1lc3BhY2VzKSB7XG4gICAgcHJvY2Vzcy5lbnYuREVCVUcgPSBuYW1lc3BhY2VzO1xuICB9IGVsc2Uge1xuICAgIC8vIElmIHlvdSBzZXQgYSBwcm9jZXNzLmVudiBmaWVsZCB0byBudWxsIG9yIHVuZGVmaW5lZCwgaXQgZ2V0cyBjYXN0IHRvIHRoZVxuICAgIC8vIHN0cmluZyAnbnVsbCcgb3IgJ3VuZGVmaW5lZCcuIEp1c3QgZGVsZXRlIGluc3RlYWQuXG4gICAgZGVsZXRlIHByb2Nlc3MuZW52LkRFQlVHO1xuICB9XG59XG4vKipcbiAqIExvYWQgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblxuZnVuY3Rpb24gbG9hZCgpIHtcbiAgcmV0dXJuIHByb2Nlc3MuZW52LkRFQlVHO1xufVxuLyoqXG4gKiBJbml0IGxvZ2ljIGZvciBgZGVidWdgIGluc3RhbmNlcy5cbiAqXG4gKiBDcmVhdGUgYSBuZXcgYGluc3BlY3RPcHRzYCBvYmplY3QgaW4gY2FzZSBgdXNlQ29sb3JzYCBpcyBzZXRcbiAqIGRpZmZlcmVudGx5IGZvciBhIHBhcnRpY3VsYXIgYGRlYnVnYCBpbnN0YW5jZS5cbiAqL1xuXG5cbmZ1bmN0aW9uIGluaXQoZGVidWcpIHtcbiAgZGVidWcuaW5zcGVjdE9wdHMgPSB7fTtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGV4cG9ydHMuaW5zcGVjdE9wdHMpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGRlYnVnLmluc3BlY3RPcHRzW2tleXNbaV1dID0gZXhwb3J0cy5pbnNwZWN0T3B0c1trZXlzW2ldXTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY29tbW9uJykoZXhwb3J0cyk7XG5jb25zdCB7XG4gIGZvcm1hdHRlcnNcbn0gPSBtb2R1bGUuZXhwb3J0cztcbi8qKlxuICogTWFwICVvIHRvIGB1dGlsLmluc3BlY3QoKWAsIGFsbCBvbiBhIHNpbmdsZSBsaW5lLlxuICovXG5cbmZvcm1hdHRlcnMubyA9IGZ1bmN0aW9uICh2KSB7XG4gIHRoaXMuaW5zcGVjdE9wdHMuY29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG4gIHJldHVybiB1dGlsLmluc3BlY3QodiwgdGhpcy5pbnNwZWN0T3B0cykuc3BsaXQoJ1xcbicpLm1hcChzdHIgPT4gc3RyLnRyaW0oKSkuam9pbignICcpO1xufTtcbi8qKlxuICogTWFwICVPIHRvIGB1dGlsLmluc3BlY3QoKWAsIGFsbG93aW5nIG11bHRpcGxlIGxpbmVzIGlmIG5lZWRlZC5cbiAqL1xuXG5cbmZvcm1hdHRlcnMuTyA9IGZ1bmN0aW9uICh2KSB7XG4gIHRoaXMuaW5zcGVjdE9wdHMuY29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG4gIHJldHVybiB1dGlsLmluc3BlY3QodiwgdGhpcy5pbnNwZWN0T3B0cyk7XG59OyIsInZhciBkZWJ1ZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghZGVidWcpIHtcbiAgICB0cnkge1xuICAgICAgLyogZXNsaW50IGdsb2JhbC1yZXF1aXJlOiBvZmYgKi9cbiAgICAgIGRlYnVnID0gcmVxdWlyZShcImRlYnVnXCIpKFwiZm9sbG93LXJlZGlyZWN0c1wiKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZGVidWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8qICovXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGRlYnVnLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG59OyIsInZhciB1cmwgPSByZXF1aXJlKFwidXJsXCIpO1xuXG52YXIgVVJMID0gdXJsLlVSTDtcblxudmFyIGh0dHAgPSByZXF1aXJlKFwiaHR0cFwiKTtcblxudmFyIGh0dHBzID0gcmVxdWlyZShcImh0dHBzXCIpO1xuXG52YXIgV3JpdGFibGUgPSByZXF1aXJlKFwic3RyZWFtXCIpLldyaXRhYmxlO1xuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKTtcblxudmFyIGRlYnVnID0gcmVxdWlyZShcIi4vZGVidWdcIik7IC8vIENyZWF0ZSBoYW5kbGVycyB0aGF0IHBhc3MgZXZlbnRzIGZyb20gbmF0aXZlIHJlcXVlc3RzXG5cblxudmFyIGV2ZW50cyA9IFtcImFib3J0XCIsIFwiYWJvcnRlZFwiLCBcImNvbm5lY3RcIiwgXCJlcnJvclwiLCBcInNvY2tldFwiLCBcInRpbWVvdXRcIl07XG52YXIgZXZlbnRIYW5kbGVycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5ldmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgZXZlbnRIYW5kbGVyc1tldmVudF0gPSBmdW5jdGlvbiAoYXJnMSwgYXJnMiwgYXJnMykge1xuICAgIHRoaXMuX3JlZGlyZWN0YWJsZS5lbWl0KGV2ZW50LCBhcmcxLCBhcmcyLCBhcmczKTtcbiAgfTtcbn0pOyAvLyBFcnJvciB0eXBlcyB3aXRoIGNvZGVzXG5cbnZhciBSZWRpcmVjdGlvbkVycm9yID0gY3JlYXRlRXJyb3JUeXBlKFwiRVJSX0ZSX1JFRElSRUNUSU9OX0ZBSUxVUkVcIiwgXCJcIik7XG52YXIgVG9vTWFueVJlZGlyZWN0c0Vycm9yID0gY3JlYXRlRXJyb3JUeXBlKFwiRVJSX0ZSX1RPT19NQU5ZX1JFRElSRUNUU1wiLCBcIk1heGltdW0gbnVtYmVyIG9mIHJlZGlyZWN0cyBleGNlZWRlZFwiKTtcbnZhciBNYXhCb2R5TGVuZ3RoRXhjZWVkZWRFcnJvciA9IGNyZWF0ZUVycm9yVHlwZShcIkVSUl9GUl9NQVhfQk9EWV9MRU5HVEhfRVhDRUVERURcIiwgXCJSZXF1ZXN0IGJvZHkgbGFyZ2VyIHRoYW4gbWF4Qm9keUxlbmd0aCBsaW1pdFwiKTtcbnZhciBXcml0ZUFmdGVyRW5kRXJyb3IgPSBjcmVhdGVFcnJvclR5cGUoXCJFUlJfU1RSRUFNX1dSSVRFX0FGVEVSX0VORFwiLCBcIndyaXRlIGFmdGVyIGVuZFwiKTsgLy8gQW4gSFRUUChTKSByZXF1ZXN0IHRoYXQgY2FuIGJlIHJlZGlyZWN0ZWRcblxuZnVuY3Rpb24gUmVkaXJlY3RhYmxlUmVxdWVzdChvcHRpb25zLCByZXNwb25zZUNhbGxiYWNrKSB7XG4gIC8vIEluaXRpYWxpemUgdGhlIHJlcXVlc3RcbiAgV3JpdGFibGUuY2FsbCh0aGlzKTtcblxuICB0aGlzLl9zYW5pdGl6ZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIHRoaXMuX2VuZGVkID0gZmFsc2U7XG4gIHRoaXMuX2VuZGluZyA9IGZhbHNlO1xuICB0aGlzLl9yZWRpcmVjdENvdW50ID0gMDtcbiAgdGhpcy5fcmVkaXJlY3RzID0gW107XG4gIHRoaXMuX3JlcXVlc3RCb2R5TGVuZ3RoID0gMDtcbiAgdGhpcy5fcmVxdWVzdEJvZHlCdWZmZXJzID0gW107IC8vIEF0dGFjaCBhIGNhbGxiYWNrIGlmIHBhc3NlZFxuXG4gIGlmIChyZXNwb25zZUNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbihcInJlc3BvbnNlXCIsIHJlc3BvbnNlQ2FsbGJhY2spO1xuICB9IC8vIFJlYWN0IHRvIHJlc3BvbnNlcyBvZiBuYXRpdmUgcmVxdWVzdHNcblxuXG4gIHZhciBzZWxmID0gdGhpcztcblxuICB0aGlzLl9vbk5hdGl2ZVJlc3BvbnNlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgc2VsZi5fcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlKTtcbiAgfTsgLy8gUGVyZm9ybSB0aGUgZmlyc3QgcmVxdWVzdFxuXG5cbiAgdGhpcy5fcGVyZm9ybVJlcXVlc3QoKTtcbn1cblxuUmVkaXJlY3RhYmxlUmVxdWVzdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFdyaXRhYmxlLnByb3RvdHlwZSk7XG5cblJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICBhYm9ydFJlcXVlc3QodGhpcy5fY3VycmVudFJlcXVlc3QpO1xuICB0aGlzLmVtaXQoXCJhYm9ydFwiKTtcbn07IC8vIFdyaXRlcyBidWZmZXJlZCBkYXRhIHRvIHRoZSBjdXJyZW50IG5hdGl2ZSByZXF1ZXN0XG5cblxuUmVkaXJlY3RhYmxlUmVxdWVzdC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoZGF0YSwgZW5jb2RpbmcsIGNhbGxiYWNrKSB7XG4gIC8vIFdyaXRpbmcgaXMgbm90IGFsbG93ZWQgaWYgZW5kIGhhcyBiZWVuIGNhbGxlZFxuICBpZiAodGhpcy5fZW5kaW5nKSB7XG4gICAgdGhyb3cgbmV3IFdyaXRlQWZ0ZXJFbmRFcnJvcigpO1xuICB9IC8vIFZhbGlkYXRlIGlucHV0IGFuZCBzaGlmdCBwYXJhbWV0ZXJzIGlmIG5lY2Vzc2FyeVxuXG5cbiAgaWYgKCEodHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIgJiYgXCJsZW5ndGhcIiBpbiBkYXRhKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJkYXRhIHNob3VsZCBiZSBhIHN0cmluZywgQnVmZmVyIG9yIFVpbnQ4QXJyYXlcIik7XG4gIH1cblxuICBpZiAodHlwZW9mIGVuY29kaW5nID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjYWxsYmFjayA9IGVuY29kaW5nO1xuICAgIGVuY29kaW5nID0gbnVsbDtcbiAgfSAvLyBJZ25vcmUgZW1wdHkgYnVmZmVycywgc2luY2Ugd3JpdGluZyB0aGVtIGRvZXNuJ3QgaW52b2tlIHRoZSBjYWxsYmFja1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvaXNzdWVzLzIyMDY2XG5cblxuICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9IC8vIE9ubHkgd3JpdGUgd2hlbiB3ZSBkb24ndCBleGNlZWQgdGhlIG1heGltdW0gYm9keSBsZW5ndGhcblxuXG4gIGlmICh0aGlzLl9yZXF1ZXN0Qm9keUxlbmd0aCArIGRhdGEubGVuZ3RoIDw9IHRoaXMuX29wdGlvbnMubWF4Qm9keUxlbmd0aCkge1xuICAgIHRoaXMuX3JlcXVlc3RCb2R5TGVuZ3RoICs9IGRhdGEubGVuZ3RoO1xuXG4gICAgdGhpcy5fcmVxdWVzdEJvZHlCdWZmZXJzLnB1c2goe1xuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIGVuY29kaW5nOiBlbmNvZGluZ1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY3VycmVudFJlcXVlc3Qud3JpdGUoZGF0YSwgZW5jb2RpbmcsIGNhbGxiYWNrKTtcbiAgfSAvLyBFcnJvciB3aGVuIHdlIGV4Y2VlZCB0aGUgbWF4aW11bSBib2R5IGxlbmd0aFxuICBlbHNlIHtcbiAgICAgIHRoaXMuZW1pdChcImVycm9yXCIsIG5ldyBNYXhCb2R5TGVuZ3RoRXhjZWVkZWRFcnJvcigpKTtcbiAgICAgIHRoaXMuYWJvcnQoKTtcbiAgICB9XG59OyAvLyBFbmRzIHRoZSBjdXJyZW50IG5hdGl2ZSByZXF1ZXN0XG5cblxuUmVkaXJlY3RhYmxlUmVxdWVzdC5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24gKGRhdGEsIGVuY29kaW5nLCBjYWxsYmFjaykge1xuICAvLyBTaGlmdCBwYXJhbWV0ZXJzIGlmIG5lY2Vzc2FyeVxuICBpZiAodHlwZW9mIGRhdGEgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGNhbGxiYWNrID0gZGF0YTtcbiAgICBkYXRhID0gZW5jb2RpbmcgPSBudWxsO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY2FsbGJhY2sgPSBlbmNvZGluZztcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH0gLy8gV3JpdGUgZGF0YSBpZiBuZWVkZWQgYW5kIGVuZFxuXG5cbiAgaWYgKCFkYXRhKSB7XG4gICAgdGhpcy5fZW5kZWQgPSB0aGlzLl9lbmRpbmcgPSB0cnVlO1xuXG4gICAgdGhpcy5fY3VycmVudFJlcXVlc3QuZW5kKG51bGwsIG51bGwsIGNhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGN1cnJlbnRSZXF1ZXN0ID0gdGhpcy5fY3VycmVudFJlcXVlc3Q7XG4gICAgdGhpcy53cml0ZShkYXRhLCBlbmNvZGluZywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fZW5kZWQgPSB0cnVlO1xuICAgICAgY3VycmVudFJlcXVlc3QuZW5kKG51bGwsIG51bGwsIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgICB0aGlzLl9lbmRpbmcgPSB0cnVlO1xuICB9XG59OyAvLyBTZXRzIGEgaGVhZGVyIHZhbHVlIG9uIHRoZSBjdXJyZW50IG5hdGl2ZSByZXF1ZXN0XG5cblxuUmVkaXJlY3RhYmxlUmVxdWVzdC5wcm90b3R5cGUuc2V0SGVhZGVyID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gIHRoaXMuX29wdGlvbnMuaGVhZGVyc1tuYW1lXSA9IHZhbHVlO1xuXG4gIHRoaXMuX2N1cnJlbnRSZXF1ZXN0LnNldEhlYWRlcihuYW1lLCB2YWx1ZSk7XG59OyAvLyBDbGVhcnMgYSBoZWFkZXIgdmFsdWUgb24gdGhlIGN1cnJlbnQgbmF0aXZlIHJlcXVlc3RcblxuXG5SZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZS5yZW1vdmVIZWFkZXIgPSBmdW5jdGlvbiAobmFtZSkge1xuICBkZWxldGUgdGhpcy5fb3B0aW9ucy5oZWFkZXJzW25hbWVdO1xuXG4gIHRoaXMuX2N1cnJlbnRSZXF1ZXN0LnJlbW92ZUhlYWRlcihuYW1lKTtcbn07IC8vIEdsb2JhbCB0aW1lb3V0IGZvciBhbGwgdW5kZXJseWluZyByZXF1ZXN0c1xuXG5cblJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlLnNldFRpbWVvdXQgPSBmdW5jdGlvbiAobXNlY3MsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKFwidGltZW91dFwiLCBjYWxsYmFjayk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95T25UaW1lb3V0KHNvY2tldCkge1xuICAgIHNvY2tldC5zZXRUaW1lb3V0KG1zZWNzKTtcbiAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoXCJ0aW1lb3V0XCIsIHNvY2tldC5kZXN0cm95KTtcbiAgICBzb2NrZXQuYWRkTGlzdGVuZXIoXCJ0aW1lb3V0XCIsIHNvY2tldC5kZXN0cm95KTtcbiAgfSAvLyBTZXRzIHVwIGEgdGltZXIgdG8gdHJpZ2dlciBhIHRpbWVvdXQgZXZlbnRcblxuXG4gIGZ1bmN0aW9uIHN0YXJ0VGltZXIoc29ja2V0KSB7XG4gICAgaWYgKHNlbGYuX3RpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dChzZWxmLl90aW1lb3V0KTtcbiAgICB9XG5cbiAgICBzZWxmLl90aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLmVtaXQoXCJ0aW1lb3V0XCIpO1xuICAgICAgY2xlYXJUaW1lcigpO1xuICAgIH0sIG1zZWNzKTtcbiAgICBkZXN0cm95T25UaW1lb3V0KHNvY2tldCk7XG4gIH0gLy8gUHJldmVudCBhIHRpbWVvdXQgZnJvbSB0cmlnZ2VyaW5nXG5cblxuICBmdW5jdGlvbiBjbGVhclRpbWVyKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lb3V0KTtcblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgc2VsZi5yZW1vdmVMaXN0ZW5lcihcInRpbWVvdXRcIiwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zb2NrZXQpIHtcbiAgICAgIHNlbGYuX2N1cnJlbnRSZXF1ZXN0LnJlbW92ZUxpc3RlbmVyKFwic29ja2V0XCIsIHN0YXJ0VGltZXIpO1xuICAgIH1cbiAgfSAvLyBTdGFydCB0aGUgdGltZXIgd2hlbiB0aGUgc29ja2V0IGlzIG9wZW5lZFxuXG5cbiAgaWYgKHRoaXMuc29ja2V0KSB7XG4gICAgc3RhcnRUaW1lcih0aGlzLnNvY2tldCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fY3VycmVudFJlcXVlc3Qub25jZShcInNvY2tldFwiLCBzdGFydFRpbWVyKTtcbiAgfVxuXG4gIHRoaXMub24oXCJzb2NrZXRcIiwgZGVzdHJveU9uVGltZW91dCk7XG4gIHRoaXMub25jZShcInJlc3BvbnNlXCIsIGNsZWFyVGltZXIpO1xuICB0aGlzLm9uY2UoXCJlcnJvclwiLCBjbGVhclRpbWVyKTtcbiAgcmV0dXJuIHRoaXM7XG59OyAvLyBQcm94eSBhbGwgb3RoZXIgcHVibGljIENsaWVudFJlcXVlc3QgbWV0aG9kc1xuXG5cbltcImZsdXNoSGVhZGVyc1wiLCBcImdldEhlYWRlclwiLCBcInNldE5vRGVsYXlcIiwgXCJzZXRTb2NrZXRLZWVwQWxpdmVcIl0uZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gIFJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50UmVxdWVzdFttZXRob2RdKGEsIGIpO1xuICB9O1xufSk7IC8vIFByb3h5IGFsbCBwdWJsaWMgQ2xpZW50UmVxdWVzdCBwcm9wZXJ0aWVzXG5cbltcImFib3J0ZWRcIiwgXCJjb25uZWN0aW9uXCIsIFwic29ja2V0XCJdLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZSwgcHJvcGVydHksIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50UmVxdWVzdFtwcm9wZXJ0eV07XG4gICAgfVxuICB9KTtcbn0pO1xuXG5SZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZS5fc2FuaXRpemVPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgLy8gRW5zdXJlIGhlYWRlcnMgYXJlIGFsd2F5cyBwcmVzZW50XG4gIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgb3B0aW9ucy5oZWFkZXJzID0ge307XG4gIH0gLy8gU2luY2UgaHR0cC5yZXF1ZXN0IHRyZWF0cyBob3N0IGFzIGFuIGFsaWFzIG9mIGhvc3RuYW1lLFxuICAvLyBidXQgdGhlIHVybCBtb2R1bGUgaW50ZXJwcmV0cyBob3N0IGFzIGhvc3RuYW1lIHBsdXMgcG9ydCxcbiAgLy8gZWxpbWluYXRlIHRoZSBob3N0IHByb3BlcnR5IHRvIGF2b2lkIGNvbmZ1c2lvbi5cblxuXG4gIGlmIChvcHRpb25zLmhvc3QpIHtcbiAgICAvLyBVc2UgaG9zdG5hbWUgaWYgc2V0LCBiZWNhdXNlIGl0IGhhcyBwcmVjZWRlbmNlXG4gICAgaWYgKCFvcHRpb25zLmhvc3RuYW1lKSB7XG4gICAgICBvcHRpb25zLmhvc3RuYW1lID0gb3B0aW9ucy5ob3N0O1xuICAgIH1cblxuICAgIGRlbGV0ZSBvcHRpb25zLmhvc3Q7XG4gIH0gLy8gQ29tcGxldGUgdGhlIFVSTCBvYmplY3Qgd2hlbiBuZWNlc3NhcnlcblxuXG4gIGlmICghb3B0aW9ucy5wYXRobmFtZSAmJiBvcHRpb25zLnBhdGgpIHtcbiAgICB2YXIgc2VhcmNoUG9zID0gb3B0aW9ucy5wYXRoLmluZGV4T2YoXCI/XCIpO1xuXG4gICAgaWYgKHNlYXJjaFBvcyA8IDApIHtcbiAgICAgIG9wdGlvbnMucGF0aG5hbWUgPSBvcHRpb25zLnBhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMucGF0aG5hbWUgPSBvcHRpb25zLnBhdGguc3Vic3RyaW5nKDAsIHNlYXJjaFBvcyk7XG4gICAgICBvcHRpb25zLnNlYXJjaCA9IG9wdGlvbnMucGF0aC5zdWJzdHJpbmcoc2VhcmNoUG9zKTtcbiAgICB9XG4gIH1cbn07IC8vIEV4ZWN1dGVzIHRoZSBuZXh0IG5hdGl2ZSByZXF1ZXN0IChpbml0aWFsIG9yIHJlZGlyZWN0KVxuXG5cblJlZGlyZWN0YWJsZVJlcXVlc3QucHJvdG90eXBlLl9wZXJmb3JtUmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gTG9hZCB0aGUgbmF0aXZlIHByb3RvY29sXG4gIHZhciBwcm90b2NvbCA9IHRoaXMuX29wdGlvbnMucHJvdG9jb2w7XG4gIHZhciBuYXRpdmVQcm90b2NvbCA9IHRoaXMuX29wdGlvbnMubmF0aXZlUHJvdG9jb2xzW3Byb3RvY29sXTtcblxuICBpZiAoIW5hdGl2ZVByb3RvY29sKSB7XG4gICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgbmV3IFR5cGVFcnJvcihcIlVuc3VwcG9ydGVkIHByb3RvY29sIFwiICsgcHJvdG9jb2wpKTtcbiAgICByZXR1cm47XG4gIH0gLy8gSWYgc3BlY2lmaWVkLCB1c2UgdGhlIGFnZW50IGNvcnJlc3BvbmRpbmcgdG8gdGhlIHByb3RvY29sXG4gIC8vIChIVFRQIGFuZCBIVFRQUyB1c2UgZGlmZmVyZW50IHR5cGVzIG9mIGFnZW50cylcblxuXG4gIGlmICh0aGlzLl9vcHRpb25zLmFnZW50cykge1xuICAgIHZhciBzY2hlbWUgPSBwcm90b2NvbC5zdWJzdHIoMCwgcHJvdG9jb2wubGVuZ3RoIC0gMSk7XG4gICAgdGhpcy5fb3B0aW9ucy5hZ2VudCA9IHRoaXMuX29wdGlvbnMuYWdlbnRzW3NjaGVtZV07XG4gIH0gLy8gQ3JlYXRlIHRoZSBuYXRpdmUgcmVxdWVzdFxuXG5cbiAgdmFyIHJlcXVlc3QgPSB0aGlzLl9jdXJyZW50UmVxdWVzdCA9IG5hdGl2ZVByb3RvY29sLnJlcXVlc3QodGhpcy5fb3B0aW9ucywgdGhpcy5fb25OYXRpdmVSZXNwb25zZSk7XG4gIHRoaXMuX2N1cnJlbnRVcmwgPSB1cmwuZm9ybWF0KHRoaXMuX29wdGlvbnMpOyAvLyBTZXQgdXAgZXZlbnQgaGFuZGxlcnNcblxuICByZXF1ZXN0Ll9yZWRpcmVjdGFibGUgPSB0aGlzO1xuXG4gIGZvciAodmFyIGUgPSAwOyBlIDwgZXZlbnRzLmxlbmd0aDsgZSsrKSB7XG4gICAgcmVxdWVzdC5vbihldmVudHNbZV0sIGV2ZW50SGFuZGxlcnNbZXZlbnRzW2VdXSk7XG4gIH0gLy8gRW5kIGEgcmVkaXJlY3RlZCByZXF1ZXN0XG4gIC8vIChUaGUgZmlyc3QgcmVxdWVzdCBtdXN0IGJlIGVuZGVkIGV4cGxpY2l0bHkgd2l0aCBSZWRpcmVjdGFibGVSZXF1ZXN0I2VuZClcblxuXG4gIGlmICh0aGlzLl9pc1JlZGlyZWN0KSB7XG4gICAgLy8gV3JpdGUgdGhlIHJlcXVlc3QgZW50aXR5IGFuZCBlbmQuXG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgYnVmZmVycyA9IHRoaXMuX3JlcXVlc3RCb2R5QnVmZmVycztcblxuICAgIChmdW5jdGlvbiB3cml0ZU5leHQoZXJyb3IpIHtcbiAgICAgIC8vIE9ubHkgd3JpdGUgaWYgdGhpcyByZXF1ZXN0IGhhcyBub3QgYmVlbiByZWRpcmVjdGVkIHlldFxuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHJlcXVlc3QgPT09IHNlbGYuX2N1cnJlbnRSZXF1ZXN0KSB7XG4gICAgICAgIC8vIFJlcG9ydCBhbnkgd3JpdGUgZXJyb3JzXG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHNlbGYuZW1pdChcImVycm9yXCIsIGVycm9yKTtcbiAgICAgICAgfSAvLyBXcml0ZSB0aGUgbmV4dCBidWZmZXIgaWYgdGhlcmUgYXJlIHN0aWxsIGxlZnRcbiAgICAgICAgZWxzZSBpZiAoaSA8IGJ1ZmZlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgYnVmZmVyID0gYnVmZmVyc1tpKytdO1xuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblxuICAgICAgICAgICAgaWYgKCFyZXF1ZXN0LmZpbmlzaGVkKSB7XG4gICAgICAgICAgICAgIHJlcXVlc3Qud3JpdGUoYnVmZmVyLmRhdGEsIGJ1ZmZlci5lbmNvZGluZywgd3JpdGVOZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IC8vIEVuZCB0aGUgcmVxdWVzdCBpZiBgZW5kYCBoYXMgYmVlbiBjYWxsZWQgb24gdXNcbiAgICAgICAgICBlbHNlIGlmIChzZWxmLl9lbmRlZCkge1xuICAgICAgICAgICAgICByZXF1ZXN0LmVuZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgfVxuICAgIH0pKCk7XG4gIH1cbn07IC8vIFByb2Nlc3NlcyBhIHJlc3BvbnNlIGZyb20gdGhlIGN1cnJlbnQgbmF0aXZlIHJlcXVlc3RcblxuXG5SZWRpcmVjdGFibGVSZXF1ZXN0LnByb3RvdHlwZS5fcHJvY2Vzc1Jlc3BvbnNlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gIC8vIFN0b3JlIHRoZSByZWRpcmVjdGVkIHJlc3BvbnNlXG4gIHZhciBzdGF0dXNDb2RlID0gcmVzcG9uc2Uuc3RhdHVzQ29kZTtcblxuICBpZiAodGhpcy5fb3B0aW9ucy50cmFja1JlZGlyZWN0cykge1xuICAgIHRoaXMuX3JlZGlyZWN0cy5wdXNoKHtcbiAgICAgIHVybDogdGhpcy5fY3VycmVudFVybCxcbiAgICAgIGhlYWRlcnM6IHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBzdGF0dXNDb2RlOiBzdGF0dXNDb2RlXG4gICAgfSk7XG4gIH0gLy8gUkZDNzIzMcKnNi40OiBUaGUgM3h4IChSZWRpcmVjdGlvbikgY2xhc3Mgb2Ygc3RhdHVzIGNvZGUgaW5kaWNhdGVzXG4gIC8vIHRoYXQgZnVydGhlciBhY3Rpb24gbmVlZHMgdG8gYmUgdGFrZW4gYnkgdGhlIHVzZXIgYWdlbnQgaW4gb3JkZXIgdG9cbiAgLy8gZnVsZmlsbCB0aGUgcmVxdWVzdC4gSWYgYSBMb2NhdGlvbiBoZWFkZXIgZmllbGQgaXMgcHJvdmlkZWQsXG4gIC8vIHRoZSB1c2VyIGFnZW50IE1BWSBhdXRvbWF0aWNhbGx5IHJlZGlyZWN0IGl0cyByZXF1ZXN0IHRvIHRoZSBVUklcbiAgLy8gcmVmZXJlbmNlZCBieSB0aGUgTG9jYXRpb24gZmllbGQgdmFsdWUsXG4gIC8vIGV2ZW4gaWYgdGhlIHNwZWNpZmljIHN0YXR1cyBjb2RlIGlzIG5vdCB1bmRlcnN0b29kLlxuXG5cbiAgdmFyIGxvY2F0aW9uID0gcmVzcG9uc2UuaGVhZGVycy5sb2NhdGlvbjtcblxuICBpZiAobG9jYXRpb24gJiYgdGhpcy5fb3B0aW9ucy5mb2xsb3dSZWRpcmVjdHMgIT09IGZhbHNlICYmIHN0YXR1c0NvZGUgPj0gMzAwICYmIHN0YXR1c0NvZGUgPCA0MDApIHtcbiAgICAvLyBBYm9ydCB0aGUgY3VycmVudCByZXF1ZXN0XG4gICAgYWJvcnRSZXF1ZXN0KHRoaXMuX2N1cnJlbnRSZXF1ZXN0KTsgLy8gRGlzY2FyZCB0aGUgcmVtYWluZGVyIG9mIHRoZSByZXNwb25zZSB0byBhdm9pZCB3YWl0aW5nIGZvciBkYXRhXG5cbiAgICByZXNwb25zZS5kZXN0cm95KCk7IC8vIFJGQzcyMzHCpzYuNDogQSBjbGllbnQgU0hPVUxEIGRldGVjdCBhbmQgaW50ZXJ2ZW5lXG4gICAgLy8gaW4gY3ljbGljYWwgcmVkaXJlY3Rpb25zIChpLmUuLCBcImluZmluaXRlXCIgcmVkaXJlY3Rpb24gbG9vcHMpLlxuXG4gICAgaWYgKCsrdGhpcy5fcmVkaXJlY3RDb3VudCA+IHRoaXMuX29wdGlvbnMubWF4UmVkaXJlY3RzKSB7XG4gICAgICB0aGlzLmVtaXQoXCJlcnJvclwiLCBuZXcgVG9vTWFueVJlZGlyZWN0c0Vycm9yKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gUkZDNzIzMcKnNi40OiBBdXRvbWF0aWMgcmVkaXJlY3Rpb24gbmVlZHMgdG8gZG9uZSB3aXRoXG4gICAgLy8gY2FyZSBmb3IgbWV0aG9kcyBub3Qga25vd24gdG8gYmUgc2FmZSwgW+KApl1cbiAgICAvLyBSRkM3MjMxwqc2LjQuMuKAkzM6IEZvciBoaXN0b3JpY2FsIHJlYXNvbnMsIGEgdXNlciBhZ2VudCBNQVkgY2hhbmdlXG4gICAgLy8gdGhlIHJlcXVlc3QgbWV0aG9kIGZyb20gUE9TVCB0byBHRVQgZm9yIHRoZSBzdWJzZXF1ZW50IHJlcXVlc3QuXG5cblxuICAgIGlmICgoc3RhdHVzQ29kZSA9PT0gMzAxIHx8IHN0YXR1c0NvZGUgPT09IDMwMikgJiYgdGhpcy5fb3B0aW9ucy5tZXRob2QgPT09IFwiUE9TVFwiIHx8IC8vIFJGQzcyMzHCpzYuNC40OiBUaGUgMzAzIChTZWUgT3RoZXIpIHN0YXR1cyBjb2RlIGluZGljYXRlcyB0aGF0XG4gICAgLy8gdGhlIHNlcnZlciBpcyByZWRpcmVjdGluZyB0aGUgdXNlciBhZ2VudCB0byBhIGRpZmZlcmVudCByZXNvdXJjZSBb4oCmXVxuICAgIC8vIEEgdXNlciBhZ2VudCBjYW4gcGVyZm9ybSBhIHJldHJpZXZhbCByZXF1ZXN0IHRhcmdldGluZyB0aGF0IFVSSVxuICAgIC8vIChhIEdFVCBvciBIRUFEIHJlcXVlc3QgaWYgdXNpbmcgSFRUUCkgW+KApl1cbiAgICBzdGF0dXNDb2RlID09PSAzMDMgJiYgIS9eKD86R0VUfEhFQUQpJC8udGVzdCh0aGlzLl9vcHRpb25zLm1ldGhvZCkpIHtcbiAgICAgIHRoaXMuX29wdGlvbnMubWV0aG9kID0gXCJHRVRcIjsgLy8gRHJvcCBhIHBvc3NpYmxlIGVudGl0eSBhbmQgaGVhZGVycyByZWxhdGVkIHRvIGl0XG5cbiAgICAgIHRoaXMuX3JlcXVlc3RCb2R5QnVmZmVycyA9IFtdO1xuICAgICAgcmVtb3ZlTWF0Y2hpbmdIZWFkZXJzKC9eY29udGVudC0vaSwgdGhpcy5fb3B0aW9ucy5oZWFkZXJzKTtcbiAgICB9IC8vIERyb3AgdGhlIEhvc3QgaGVhZGVyLCBhcyB0aGUgcmVkaXJlY3QgbWlnaHQgbGVhZCB0byBhIGRpZmZlcmVudCBob3N0XG5cblxuICAgIHZhciBwcmV2aW91c0hvc3ROYW1lID0gcmVtb3ZlTWF0Y2hpbmdIZWFkZXJzKC9eaG9zdCQvaSwgdGhpcy5fb3B0aW9ucy5oZWFkZXJzKSB8fCB1cmwucGFyc2UodGhpcy5fY3VycmVudFVybCkuaG9zdG5hbWU7IC8vIENyZWF0ZSB0aGUgcmVkaXJlY3RlZCByZXF1ZXN0XG5cbiAgICB2YXIgcmVkaXJlY3RVcmwgPSB1cmwucmVzb2x2ZSh0aGlzLl9jdXJyZW50VXJsLCBsb2NhdGlvbik7XG4gICAgZGVidWcoXCJyZWRpcmVjdGluZyB0b1wiLCByZWRpcmVjdFVybCk7XG4gICAgdGhpcy5faXNSZWRpcmVjdCA9IHRydWU7XG4gICAgdmFyIHJlZGlyZWN0VXJsUGFydHMgPSB1cmwucGFyc2UocmVkaXJlY3RVcmwpO1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5fb3B0aW9ucywgcmVkaXJlY3RVcmxQYXJ0cyk7IC8vIERyb3AgdGhlIEF1dGhvcml6YXRpb24gaGVhZGVyIGlmIHJlZGlyZWN0aW5nIHRvIGFub3RoZXIgaG9zdFxuXG4gICAgaWYgKHJlZGlyZWN0VXJsUGFydHMuaG9zdG5hbWUgIT09IHByZXZpb3VzSG9zdE5hbWUpIHtcbiAgICAgIHJlbW92ZU1hdGNoaW5nSGVhZGVycygvXmF1dGhvcml6YXRpb24kL2ksIHRoaXMuX29wdGlvbnMuaGVhZGVycyk7XG4gICAgfSAvLyBFdmFsdWF0ZSB0aGUgYmVmb3JlUmVkaXJlY3QgY2FsbGJhY2tcblxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLl9vcHRpb25zLmJlZm9yZVJlZGlyZWN0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHZhciByZXNwb25zZURldGFpbHMgPSB7XG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlLmhlYWRlcnNcbiAgICAgIH07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnMuYmVmb3JlUmVkaXJlY3QuY2FsbChudWxsLCB0aGlzLl9vcHRpb25zLCByZXNwb25zZURldGFpbHMpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRoaXMuZW1pdChcImVycm9yXCIsIGVycik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2FuaXRpemVPcHRpb25zKHRoaXMuX29wdGlvbnMpO1xuICAgIH0gLy8gUGVyZm9ybSB0aGUgcmVkaXJlY3RlZCByZXF1ZXN0XG5cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLl9wZXJmb3JtUmVxdWVzdCgpO1xuICAgIH0gY2F0Y2ggKGNhdXNlKSB7XG4gICAgICB2YXIgZXJyb3IgPSBuZXcgUmVkaXJlY3Rpb25FcnJvcihcIlJlZGlyZWN0ZWQgcmVxdWVzdCBmYWlsZWQ6IFwiICsgY2F1c2UubWVzc2FnZSk7XG4gICAgICBlcnJvci5jYXVzZSA9IGNhdXNlO1xuICAgICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgZXJyb3IpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBUaGUgcmVzcG9uc2UgaXMgbm90IGEgcmVkaXJlY3Q7IHJldHVybiBpdCBhcy1pc1xuICAgIHJlc3BvbnNlLnJlc3BvbnNlVXJsID0gdGhpcy5fY3VycmVudFVybDtcbiAgICByZXNwb25zZS5yZWRpcmVjdHMgPSB0aGlzLl9yZWRpcmVjdHM7XG4gICAgdGhpcy5lbWl0KFwicmVzcG9uc2VcIiwgcmVzcG9uc2UpOyAvLyBDbGVhbiB1cFxuXG4gICAgdGhpcy5fcmVxdWVzdEJvZHlCdWZmZXJzID0gW107XG4gIH1cbn07IC8vIFdyYXBzIHRoZSBrZXkvdmFsdWUgb2JqZWN0IG9mIHByb3RvY29scyB3aXRoIHJlZGlyZWN0IGZ1bmN0aW9uYWxpdHlcblxuXG5mdW5jdGlvbiB3cmFwKHByb3RvY29scykge1xuICAvLyBEZWZhdWx0IHNldHRpbmdzXG4gIHZhciBleHBvcnRzID0ge1xuICAgIG1heFJlZGlyZWN0czogMjEsXG4gICAgbWF4Qm9keUxlbmd0aDogMTAgKiAxMDI0ICogMTAyNFxuICB9OyAvLyBXcmFwIGVhY2ggcHJvdG9jb2xcblxuICB2YXIgbmF0aXZlUHJvdG9jb2xzID0ge307XG4gIE9iamVjdC5rZXlzKHByb3RvY29scykuZm9yRWFjaChmdW5jdGlvbiAoc2NoZW1lKSB7XG4gICAgdmFyIHByb3RvY29sID0gc2NoZW1lICsgXCI6XCI7XG4gICAgdmFyIG5hdGl2ZVByb3RvY29sID0gbmF0aXZlUHJvdG9jb2xzW3Byb3RvY29sXSA9IHByb3RvY29sc1tzY2hlbWVdO1xuICAgIHZhciB3cmFwcGVkUHJvdG9jb2wgPSBleHBvcnRzW3NjaGVtZV0gPSBPYmplY3QuY3JlYXRlKG5hdGl2ZVByb3RvY29sKTsgLy8gRXhlY3V0ZXMgYSByZXF1ZXN0LCBmb2xsb3dpbmcgcmVkaXJlY3RzXG5cbiAgICBmdW5jdGlvbiByZXF1ZXN0KGlucHV0LCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgICAgLy8gUGFyc2UgcGFyYW1ldGVyc1xuICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB2YXIgdXJsU3RyID0gaW5wdXQ7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpbnB1dCA9IHVybFRvT3B0aW9ucyhuZXcgVVJMKHVybFN0cikpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgIGlucHV0ID0gdXJsLnBhcnNlKHVybFN0cik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoVVJMICYmIGlucHV0IGluc3RhbmNlb2YgVVJMKSB7XG4gICAgICAgIGlucHV0ID0gdXJsVG9PcHRpb25zKGlucHV0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICAgICAgb3B0aW9ucyA9IGlucHV0O1xuICAgICAgICBpbnB1dCA9IHtcbiAgICAgICAgICBwcm90b2NvbDogcHJvdG9jb2xcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgICAgICBvcHRpb25zID0gbnVsbDtcbiAgICAgIH0gLy8gU2V0IGRlZmF1bHRzXG5cblxuICAgICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgICBtYXhSZWRpcmVjdHM6IGV4cG9ydHMubWF4UmVkaXJlY3RzLFxuICAgICAgICBtYXhCb2R5TGVuZ3RoOiBleHBvcnRzLm1heEJvZHlMZW5ndGhcbiAgICAgIH0sIGlucHV0LCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMubmF0aXZlUHJvdG9jb2xzID0gbmF0aXZlUHJvdG9jb2xzO1xuICAgICAgYXNzZXJ0LmVxdWFsKG9wdGlvbnMucHJvdG9jb2wsIHByb3RvY29sLCBcInByb3RvY29sIG1pc21hdGNoXCIpO1xuICAgICAgZGVidWcoXCJvcHRpb25zXCIsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIG5ldyBSZWRpcmVjdGFibGVSZXF1ZXN0KG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICB9IC8vIEV4ZWN1dGVzIGEgR0VUIHJlcXVlc3QsIGZvbGxvd2luZyByZWRpcmVjdHNcblxuXG4gICAgZnVuY3Rpb24gZ2V0KGlucHV0LCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgICAgdmFyIHdyYXBwZWRSZXF1ZXN0ID0gd3JhcHBlZFByb3RvY29sLnJlcXVlc3QoaW5wdXQsIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICAgIHdyYXBwZWRSZXF1ZXN0LmVuZCgpO1xuICAgICAgcmV0dXJuIHdyYXBwZWRSZXF1ZXN0O1xuICAgIH0gLy8gRXhwb3NlIHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSB3cmFwcGVkIHByb3RvY29sXG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHdyYXBwZWRQcm90b2NvbCwge1xuICAgICAgcmVxdWVzdDoge1xuICAgICAgICB2YWx1ZTogcmVxdWVzdCxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGdldDoge1xuICAgICAgICB2YWx1ZTogZ2V0LFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gZXhwb3J0cztcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cblxuZnVuY3Rpb24gbm9vcCgpIHtcbiAgLyogZW1wdHkgKi9cbn0gLy8gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvYmxvYi9tYXN0ZXIvbGliL2ludGVybmFsL3VybC5qc1xuXG5cbmZ1bmN0aW9uIHVybFRvT3B0aW9ucyh1cmxPYmplY3QpIHtcbiAgdmFyIG9wdGlvbnMgPSB7XG4gICAgcHJvdG9jb2w6IHVybE9iamVjdC5wcm90b2NvbCxcbiAgICBob3N0bmFtZTogdXJsT2JqZWN0Lmhvc3RuYW1lLnN0YXJ0c1dpdGgoXCJbXCIpID9cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIHVybE9iamVjdC5ob3N0bmFtZS5zbGljZSgxLCAtMSkgOiB1cmxPYmplY3QuaG9zdG5hbWUsXG4gICAgaGFzaDogdXJsT2JqZWN0Lmhhc2gsXG4gICAgc2VhcmNoOiB1cmxPYmplY3Quc2VhcmNoLFxuICAgIHBhdGhuYW1lOiB1cmxPYmplY3QucGF0aG5hbWUsXG4gICAgcGF0aDogdXJsT2JqZWN0LnBhdGhuYW1lICsgdXJsT2JqZWN0LnNlYXJjaCxcbiAgICBocmVmOiB1cmxPYmplY3QuaHJlZlxuICB9O1xuXG4gIGlmICh1cmxPYmplY3QucG9ydCAhPT0gXCJcIikge1xuICAgIG9wdGlvbnMucG9ydCA9IE51bWJlcih1cmxPYmplY3QucG9ydCk7XG4gIH1cblxuICByZXR1cm4gb3B0aW9ucztcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTWF0Y2hpbmdIZWFkZXJzKHJlZ2V4LCBoZWFkZXJzKSB7XG4gIHZhciBsYXN0VmFsdWU7XG5cbiAgZm9yICh2YXIgaGVhZGVyIGluIGhlYWRlcnMpIHtcbiAgICBpZiAocmVnZXgudGVzdChoZWFkZXIpKSB7XG4gICAgICBsYXN0VmFsdWUgPSBoZWFkZXJzW2hlYWRlcl07XG4gICAgICBkZWxldGUgaGVhZGVyc1toZWFkZXJdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsYXN0VmFsdWU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVycm9yVHlwZShjb2RlLCBkZWZhdWx0TWVzc2FnZSkge1xuICBmdW5jdGlvbiBDdXN0b21FcnJvcihtZXNzYWdlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSB8fCBkZWZhdWx0TWVzc2FnZTtcbiAgfVxuXG4gIEN1c3RvbUVycm9yLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuICBDdXN0b21FcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDdXN0b21FcnJvcjtcbiAgQ3VzdG9tRXJyb3IucHJvdG90eXBlLm5hbWUgPSBcIkVycm9yIFtcIiArIGNvZGUgKyBcIl1cIjtcbiAgQ3VzdG9tRXJyb3IucHJvdG90eXBlLmNvZGUgPSBjb2RlO1xuICByZXR1cm4gQ3VzdG9tRXJyb3I7XG59XG5cbmZ1bmN0aW9uIGFib3J0UmVxdWVzdChyZXF1ZXN0KSB7XG4gIGZvciAodmFyIGUgPSAwOyBlIDwgZXZlbnRzLmxlbmd0aDsgZSsrKSB7XG4gICAgcmVxdWVzdC5yZW1vdmVMaXN0ZW5lcihldmVudHNbZV0sIGV2ZW50SGFuZGxlcnNbZXZlbnRzW2VdXSk7XG4gIH1cblxuICByZXF1ZXN0Lm9uKFwiZXJyb3JcIiwgbm9vcCk7XG4gIHJlcXVlc3QuYWJvcnQoKTtcbn0gLy8gRXhwb3J0c1xuXG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcCh7XG4gIGh0dHA6IGh0dHAsXG4gIGh0dHBzOiBodHRwc1xufSk7XG5tb2R1bGUuZXhwb3J0cy53cmFwID0gd3JhcDsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZsYWcsIGFyZ3YpID0+IHtcbiAgYXJndiA9IGFyZ3YgfHwgcHJvY2Vzcy5hcmd2O1xuICBjb25zdCBwcmVmaXggPSBmbGFnLnN0YXJ0c1dpdGgoJy0nKSA/ICcnIDogZmxhZy5sZW5ndGggPT09IDEgPyAnLScgOiAnLS0nO1xuICBjb25zdCBwb3MgPSBhcmd2LmluZGV4T2YocHJlZml4ICsgZmxhZyk7XG4gIGNvbnN0IHRlcm1pbmF0b3JQb3MgPSBhcmd2LmluZGV4T2YoJy0tJyk7XG4gIHJldHVybiBwb3MgIT09IC0xICYmICh0ZXJtaW5hdG9yUG9zID09PSAtMSA/IHRydWUgOiBwb3MgPCB0ZXJtaW5hdG9yUG9zKTtcbn07IiwiLyoqXG4gKiBIZWxwZXJzLlxuICovXG52YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgdyA9IGQgKiA3O1xudmFyIHkgPSBkICogMzY1LjI1O1xuLyoqXG4gKiBQYXJzZSBvciBmb3JtYXQgdGhlIGdpdmVuIGB2YWxgLlxuICpcbiAqIE9wdGlvbnM6XG4gKlxuICogIC0gYGxvbmdgIHZlcmJvc2UgZm9ybWF0dGluZyBbZmFsc2VdXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSB2YWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEB0aHJvd3Mge0Vycm9yfSB0aHJvdyBhbiBlcnJvciBpZiB2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIG51bWJlclxuICogQHJldHVybiB7U3RyaW5nfE51bWJlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodmFsLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWw7XG5cbiAgaWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHZhbC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHBhcnNlKHZhbCk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodmFsKSkge1xuICAgIHJldHVybiBvcHRpb25zLmxvbmcgPyBmbXRMb25nKHZhbCkgOiBmbXRTaG9ydCh2YWwpO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKCd2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIHZhbGlkIG51bWJlci4gdmFsPScgKyBKU09OLnN0cmluZ2lmeSh2YWwpKTtcbn07XG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBgc3RyYCBhbmQgcmV0dXJuIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIHBhcnNlKHN0cikge1xuICBzdHIgPSBTdHJpbmcoc3RyKTtcblxuICBpZiAoc3RyLmxlbmd0aCA+IDEwMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBtYXRjaCA9IC9eKC0/KD86XFxkKyk/XFwuP1xcZCspICoobWlsbGlzZWNvbmRzP3xtc2Vjcz98bXN8c2Vjb25kcz98c2Vjcz98c3xtaW51dGVzP3xtaW5zP3xtfGhvdXJzP3xocnM/fGh8ZGF5cz98ZHx3ZWVrcz98d3x5ZWFycz98eXJzP3x5KT8kL2kuZXhlYyhzdHIpO1xuXG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICB2YXIgdHlwZSA9IChtYXRjaFsyXSB8fCAnbXMnKS50b0xvd2VyQ2FzZSgpO1xuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3llYXJzJzpcbiAgICBjYXNlICd5ZWFyJzpcbiAgICBjYXNlICd5cnMnOlxuICAgIGNhc2UgJ3lyJzpcbiAgICBjYXNlICd5JzpcbiAgICAgIHJldHVybiBuICogeTtcblxuICAgIGNhc2UgJ3dlZWtzJzpcbiAgICBjYXNlICd3ZWVrJzpcbiAgICBjYXNlICd3JzpcbiAgICAgIHJldHVybiBuICogdztcblxuICAgIGNhc2UgJ2RheXMnOlxuICAgIGNhc2UgJ2RheSc6XG4gICAgY2FzZSAnZCc6XG4gICAgICByZXR1cm4gbiAqIGQ7XG5cbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnaG91cic6XG4gICAgY2FzZSAnaHJzJzpcbiAgICBjYXNlICdocic6XG4gICAgY2FzZSAnaCc6XG4gICAgICByZXR1cm4gbiAqIGg7XG5cbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdtaW51dGUnOlxuICAgIGNhc2UgJ21pbnMnOlxuICAgIGNhc2UgJ21pbic6XG4gICAgY2FzZSAnbSc6XG4gICAgICByZXR1cm4gbiAqIG07XG5cbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdzZWNvbmQnOlxuICAgIGNhc2UgJ3NlY3MnOlxuICAgIGNhc2UgJ3NlYyc6XG4gICAgY2FzZSAncyc6XG4gICAgICByZXR1cm4gbiAqIHM7XG5cbiAgICBjYXNlICdtaWxsaXNlY29uZHMnOlxuICAgIGNhc2UgJ21pbGxpc2Vjb25kJzpcbiAgICBjYXNlICdtc2Vjcyc6XG4gICAgY2FzZSAnbXNlYyc6XG4gICAgY2FzZSAnbXMnOlxuICAgICAgcmV0dXJuIG47XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuLyoqXG4gKiBTaG9ydCBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIGZtdFNob3J0KG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcblxuICBpZiAobXNBYnMgPj0gZCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gZCkgKyAnZCc7XG4gIH1cblxuICBpZiAobXNBYnMgPj0gaCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gaCkgKyAnaCc7XG4gIH1cblxuICBpZiAobXNBYnMgPj0gbSkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSc7XG4gIH1cblxuICBpZiAobXNBYnMgPj0gcykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gcykgKyAncyc7XG4gIH1cblxuICByZXR1cm4gbXMgKyAnbXMnO1xufVxuLyoqXG4gKiBMb25nIGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblxuZnVuY3Rpb24gZm10TG9uZyhtcykge1xuICB2YXIgbXNBYnMgPSBNYXRoLmFicyhtcyk7XG5cbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgZCwgJ2RheScpO1xuICB9XG5cbiAgaWYgKG1zQWJzID49IGgpIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgaCwgJ2hvdXInKTtcbiAgfVxuXG4gIGlmIChtc0FicyA+PSBtKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIG0sICdtaW51dGUnKTtcbiAgfVxuXG4gIGlmIChtc0FicyA+PSBzKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIHMsICdzZWNvbmQnKTtcbiAgfVxuXG4gIHJldHVybiBtcyArICcgbXMnO1xufVxuLyoqXG4gKiBQbHVyYWxpemF0aW9uIGhlbHBlci5cbiAqL1xuXG5cbmZ1bmN0aW9uIHBsdXJhbChtcywgbXNBYnMsIG4sIG5hbWUpIHtcbiAgdmFyIGlzUGx1cmFsID0gbXNBYnMgPj0gbiAqIDEuNTtcbiAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBuKSArICcgJyArIG5hbWUgKyAoaXNQbHVyYWwgPyAncycgOiAnJyk7XG59IiwiLyohXG4gKiBzYXRlbGxpdGUtanMgdjQuMS4zXG4gKiAoYykgMjAxMyBTaGFzaHdhdCBLYW5kYWRhaSBhbmQgVUNTQ1xuICogaHR0cHM6Ly9naXRodWIuY29tL3NoYXNod2F0YWsvc2F0ZWxsaXRlLWpzXG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xudmFyIHBpID0gTWF0aC5QSTtcbnZhciB0d29QaSA9IHBpICogMjtcbnZhciBkZWcycmFkID0gcGkgLyAxODAuMDtcbnZhciByYWQyZGVnID0gMTgwIC8gcGk7XG52YXIgbWludXRlc1BlckRheSA9IDE0NDAuMDtcbnZhciBtdSA9IDM5ODYwMC41OyAvLyBpbiBrbTMgLyBzMlxuXG52YXIgZWFydGhSYWRpdXMgPSA2Mzc4LjEzNzsgLy8gaW4ga21cblxudmFyIHhrZSA9IDYwLjAgLyBNYXRoLnNxcnQoZWFydGhSYWRpdXMgKiBlYXJ0aFJhZGl1cyAqIGVhcnRoUmFkaXVzIC8gbXUpO1xudmFyIHZrbXBlcnNlYyA9IGVhcnRoUmFkaXVzICogeGtlIC8gNjAuMDtcbnZhciB0dW1pbiA9IDEuMCAvIHhrZTtcbnZhciBqMiA9IDAuMDAxMDgyNjI5OTg5MDU7XG52YXIgajMgPSAtMC4wMDAwMDI1MzIxNTMwNjtcbnZhciBqNCA9IC0wLjAwMDAwMTYxMDk4NzYxO1xudmFyIGozb2oyID0gajMgLyBqMjtcbnZhciB4Mm8zID0gMi4wIC8gMy4wO1xudmFyIGNvbnN0YW50cyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgX19wcm90b19fOiBudWxsLFxuICBwaTogcGksXG4gIHR3b1BpOiB0d29QaSxcbiAgZGVnMnJhZDogZGVnMnJhZCxcbiAgcmFkMmRlZzogcmFkMmRlZyxcbiAgbWludXRlc1BlckRheTogbWludXRlc1BlckRheSxcbiAgbXU6IG11LFxuICBlYXJ0aFJhZGl1czogZWFydGhSYWRpdXMsXG4gIHhrZTogeGtlLFxuICB2a21wZXJzZWM6IHZrbXBlcnNlYyxcbiAgdHVtaW46IHR1bWluLFxuICBqMjogajIsXG4gIGozOiBqMyxcbiAgajQ6IGo0LFxuICBqM29qMjogajNvajIsXG4gIHgybzM6IHgybzNcbn0pO1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZHVyZSBkYXlzMm1kaG1zXG4gKlxuICogIHRoaXMgcHJvY2VkdXJlIGNvbnZlcnRzIHRoZSBkYXkgb2YgdGhlIHllYXIsIGRheXMsIHRvIHRoZSBlcXVpdmFsZW50IG1vbnRoXG4gKiAgICBkYXksIGhvdXIsIG1pbnV0ZSBhbmQgc2Vjb25kLlxuICpcbiAqICBhbGdvcml0aG0gICAgIDogc2V0IHVwIGFycmF5IGZvciB0aGUgbnVtYmVyIG9mIGRheXMgcGVyIG1vbnRoXG4gKiAgICAgICAgICAgICAgICAgIGZpbmQgbGVhcCB5ZWFyIC0gdXNlIDE5MDAgYmVjYXVzZSAyMDAwIGlzIGEgbGVhcCB5ZWFyXG4gKiAgICAgICAgICAgICAgICAgIGxvb3AgdGhyb3VnaCBhIHRlbXAgdmFsdWUgd2hpbGUgdGhlIHZhbHVlIGlzIDwgdGhlIGRheXNcbiAqICAgICAgICAgICAgICAgICAgcGVyZm9ybSBpbnQgY29udmVyc2lvbnMgdG8gdGhlIGNvcnJlY3QgZGF5IGFuZCBtb250aFxuICogICAgICAgICAgICAgICAgICBjb252ZXJ0IHJlbWFpbmRlciBpbnRvIGggbSBzIHVzaW5nIHR5cGUgY29udmVyc2lvbnNcbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAgMSBtYXIgMjAwMVxuICpcbiAqICBpbnB1dHMgICAgICAgICAgZGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgIHJhbmdlIC8gdW5pdHNcbiAqICAgIHllYXIgICAgICAgIC0geWVhciAgICAgICAgICAgICAgICAgICAgICAgICAgIDE5MDAgLi4gMjEwMFxuICogICAgZGF5cyAgICAgICAgLSBqdWxpYW4gZGF5IG9mIHRoZSB5ZWFyICAgICAgICAgMC4wICAuLiAzNjYuMFxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIG1vbiAgICAgICAgIC0gbW9udGggICAgICAgICAgICAgICAgICAgICAgICAgIDEgLi4gMTJcbiAqICAgIGRheSAgICAgICAgIC0gZGF5ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEgLi4gMjgsMjksMzAsMzFcbiAqICAgIGhyICAgICAgICAgIC0gaG91ciAgICAgICAgICAgICAgICAgICAgICAgICAgIDAgLi4gMjNcbiAqICAgIG1pbiAgICAgICAgIC0gbWludXRlICAgICAgICAgICAgICAgICAgICAgICAgIDAgLi4gNTlcbiAqICAgIHNlYyAgICAgICAgIC0gc2Vjb25kICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCAuLiA1OS45OTlcbiAqXG4gKiAgbG9jYWxzICAgICAgICA6XG4gKiAgICBkYXlvZnlyICAgICAtIGRheSBvZiB5ZWFyXG4gKiAgICB0ZW1wICAgICAgICAtIHRlbXBvcmFyeSBleHRlbmRlZCB2YWx1ZXNcbiAqICAgIGludHRlbXAgICAgIC0gdGVtcG9yYXJ5IGludCB2YWx1ZVxuICogICAgaSAgICAgICAgICAgLSBpbmRleFxuICogICAgbG1vbnRoWzEyXSAgLSBpbnQgYXJyYXkgY29udGFpbmluZyB0aGUgbnVtYmVyIG9mIGRheXMgcGVyIG1vbnRoXG4gKlxuICogIGNvdXBsaW5nICAgICAgOlxuICogICAgbm9uZS5cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5mdW5jdGlvbiBkYXlzMm1kaG1zKHllYXIsIGRheXMpIHtcbiAgdmFyIGxtb250aCA9IFszMSwgeWVhciAlIDQgPT09IDAgPyAyOSA6IDI4LCAzMSwgMzAsIDMxLCAzMCwgMzEsIDMxLCAzMCwgMzEsIDMwLCAzMV07XG4gIHZhciBkYXlvZnlyID0gTWF0aC5mbG9vcihkYXlzKTsgLy8gIC0tLS0tLS0tLS0tLS0tLS0tIGZpbmQgbW9udGggYW5kIGRheSBvZiBtb250aCAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgaW50dGVtcCA9IDA7XG5cbiAgd2hpbGUgKGRheW9meXIgPiBpbnR0ZW1wICsgbG1vbnRoW2kgLSAxXSAmJiBpIDwgMTIpIHtcbiAgICBpbnR0ZW1wICs9IGxtb250aFtpIC0gMV07XG4gICAgaSArPSAxO1xuICB9XG5cbiAgdmFyIG1vbiA9IGk7XG4gIHZhciBkYXkgPSBkYXlvZnlyIC0gaW50dGVtcDsgLy8gIC0tLS0tLS0tLS0tLS0tLS0tIGZpbmQgaG91cnMgbWludXRlcyBhbmQgc2Vjb25kcyAtLS0tLS0tLS0tLS0tXG5cbiAgdmFyIHRlbXAgPSAoZGF5cyAtIGRheW9meXIpICogMjQuMDtcbiAgdmFyIGhyID0gTWF0aC5mbG9vcih0ZW1wKTtcbiAgdGVtcCA9ICh0ZW1wIC0gaHIpICogNjAuMDtcbiAgdmFyIG1pbnV0ZSA9IE1hdGguZmxvb3IodGVtcCk7XG4gIHZhciBzZWMgPSAodGVtcCAtIG1pbnV0ZSkgKiA2MC4wO1xuICByZXR1cm4ge1xuICAgIG1vbjogbW9uLFxuICAgIGRheTogZGF5LFxuICAgIGhyOiBocixcbiAgICBtaW51dGU6IG1pbnV0ZSxcbiAgICBzZWM6IHNlY1xuICB9O1xufVxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZHVyZSBqZGF5XG4gKlxuICogIHRoaXMgcHJvY2VkdXJlIGZpbmRzIHRoZSBqdWxpYW4gZGF0ZSBnaXZlbiB0aGUgeWVhciwgbW9udGgsIGRheSwgYW5kIHRpbWUuXG4gKiAgICB0aGUganVsaWFuIGRhdGUgaXMgZGVmaW5lZCBieSBlYWNoIGVsYXBzZWQgZGF5IHNpbmNlIG5vb24sIGphbiAxLCA0NzEzIGJjLlxuICpcbiAqICBhbGdvcml0aG0gICAgIDogY2FsY3VsYXRlIHRoZSBhbnN3ZXIgaW4gb25lIHN0ZXAgZm9yIGVmZmljaWVuY3lcbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAgMSBtYXIgMjAwMVxuICpcbiAqICBpbnB1dHMgICAgICAgICAgZGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgIHJhbmdlIC8gdW5pdHNcbiAqICAgIHllYXIgICAgICAgIC0geWVhciAgICAgICAgICAgICAgICAgICAgICAgICAgIDE5MDAgLi4gMjEwMFxuICogICAgbW9uICAgICAgICAgLSBtb250aCAgICAgICAgICAgICAgICAgICAgICAgICAgMSAuLiAxMlxuICogICAgZGF5ICAgICAgICAgLSBkYXkgICAgICAgICAgICAgICAgICAgICAgICAgICAgMSAuLiAyOCwyOSwzMCwzMVxuICogICAgaHIgICAgICAgICAgLSB1bml2ZXJzYWwgdGltZSBob3VyICAgICAgICAgICAgMCAuLiAyM1xuICogICAgbWluICAgICAgICAgLSB1bml2ZXJzYWwgdGltZSBtaW4gICAgICAgICAgICAgMCAuLiA1OVxuICogICAgc2VjICAgICAgICAgLSB1bml2ZXJzYWwgdGltZSBzZWMgICAgICAgICAgICAgMC4wIC4uIDU5Ljk5OVxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIGpkICAgICAgICAgIC0ganVsaWFuIGRhdGUgICAgICAgICAgICAgICAgICAgIGRheXMgZnJvbSA0NzEzIGJjXG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgbm9uZS5cbiAqXG4gKiAgY291cGxpbmcgICAgICA6XG4gKiAgICBub25lLlxuICpcbiAqICByZWZlcmVuY2VzICAgIDpcbiAqICAgIHZhbGxhZG8gICAgICAgMjAwNywgMTg5LCBhbGcgMTQsIGV4IDMtMTRcbiAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXG5mdW5jdGlvbiBqZGF5SW50ZXJuYWwoeWVhciwgbW9uLCBkYXksIGhyLCBtaW51dGUsIHNlYykge1xuICB2YXIgbXNlYyA9IGFyZ3VtZW50cy5sZW5ndGggPiA2ICYmIGFyZ3VtZW50c1s2XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzZdIDogMDtcbiAgcmV0dXJuIDM2Ny4wICogeWVhciAtIE1hdGguZmxvb3IoNyAqICh5ZWFyICsgTWF0aC5mbG9vcigobW9uICsgOSkgLyAxMi4wKSkgKiAwLjI1KSArIE1hdGguZmxvb3IoMjc1ICogbW9uIC8gOS4wKSArIGRheSArIDE3MjEwMTMuNSArICgobXNlYyAvIDYwMDAwICsgc2VjIC8gNjAuMCArIG1pbnV0ZSkgLyA2MC4wICsgaHIpIC8gMjQuMCAvLyB1dCBpbiBkYXlzXG4gIC8vICMgLSAwLjUqc2duKDEwMC4wKnllYXIgKyBtb24gLSAxOTAwMDIuNSkgKyAwLjU7XG4gIDtcbn1cblxuZnVuY3Rpb24gamRheSh5ZWFyLCBtb24sIGRheSwgaHIsIG1pbnV0ZSwgc2VjLCBtc2VjKSB7XG4gIGlmICh5ZWFyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhciBkYXRlID0geWVhcjtcbiAgICByZXR1cm4gamRheUludGVybmFsKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSwgZGF0ZS5nZXRVVENNb250aCgpICsgMSwgLy8gTm90ZSwgdGhpcyBmdW5jdGlvbiByZXF1aXJlcyBtb250aHMgaW4gcmFuZ2UgMS0xMi5cbiAgICBkYXRlLmdldFVUQ0RhdGUoKSwgZGF0ZS5nZXRVVENIb3VycygpLCBkYXRlLmdldFVUQ01pbnV0ZXMoKSwgZGF0ZS5nZXRVVENTZWNvbmRzKCksIGRhdGUuZ2V0VVRDTWlsbGlzZWNvbmRzKCkpO1xuICB9XG5cbiAgcmV0dXJuIGpkYXlJbnRlcm5hbCh5ZWFyLCBtb24sIGRheSwgaHIsIG1pbnV0ZSwgc2VjLCBtc2VjKTtcbn1cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWR1cmUgaW52amRheVxuICpcbiAqICB0aGlzIHByb2NlZHVyZSBmaW5kcyB0aGUgeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlIGFuZCBzZWNvbmRcbiAqICBnaXZlbiB0aGUganVsaWFuIGRhdGUuIHR1IGNhbiBiZSB1dDEsIHRkdCwgdGRiLCBldGMuXG4gKlxuICogIGFsZ29yaXRobSAgICAgOiBzZXQgdXAgc3RhcnRpbmcgdmFsdWVzXG4gKiAgICAgICAgICAgICAgICAgIGZpbmQgbGVhcCB5ZWFyIC0gdXNlIDE5MDAgYmVjYXVzZSAyMDAwIGlzIGEgbGVhcCB5ZWFyXG4gKiAgICAgICAgICAgICAgICAgIGZpbmQgdGhlIGVsYXBzZWQgZGF5cyB0aHJvdWdoIHRoZSB5ZWFyIGluIGEgbG9vcFxuICogICAgICAgICAgICAgICAgICBjYWxsIHJvdXRpbmUgdG8gZmluZCBlYWNoIGluZGl2aWR1YWwgdmFsdWVcbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAgMSBtYXIgMjAwMVxuICpcbiAqICBpbnB1dHMgICAgICAgICAgZGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgIHJhbmdlIC8gdW5pdHNcbiAqICAgIGpkICAgICAgICAgIC0ganVsaWFuIGRhdGUgICAgICAgICAgICAgICAgICAgIGRheXMgZnJvbSA0NzEzIGJjXG4gKlxuICogIG91dHB1dHMgICAgICAgOlxuICogICAgeWVhciAgICAgICAgLSB5ZWFyICAgICAgICAgICAgICAgICAgICAgICAgICAgMTkwMCAuLiAyMTAwXG4gKiAgICBtb24gICAgICAgICAtIG1vbnRoICAgICAgICAgICAgICAgICAgICAgICAgICAxIC4uIDEyXG4gKiAgICBkYXkgICAgICAgICAtIGRheSAgICAgICAgICAgICAgICAgICAgICAgICAgICAxIC4uIDI4LDI5LDMwLDMxXG4gKiAgICBociAgICAgICAgICAtIGhvdXIgICAgICAgICAgICAgICAgICAgICAgICAgICAwIC4uIDIzXG4gKiAgICBtaW4gICAgICAgICAtIG1pbnV0ZSAgICAgICAgICAgICAgICAgICAgICAgICAwIC4uIDU5XG4gKiAgICBzZWMgICAgICAgICAtIHNlY29uZCAgICAgICAgICAgICAgICAgICAgICAgICAwLjAgLi4gNTkuOTk5XG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgZGF5cyAgICAgICAgLSBkYXkgb2YgeWVhciBwbHVzIGZyYWN0aW9uYWxcbiAqICAgICAgICAgICAgICAgICAgcG9ydGlvbiBvZiBhIGRheSAgICAgICAgICAgICAgIGRheXNcbiAqICAgIHR1ICAgICAgICAgIC0ganVsaWFuIGNlbnR1cmllcyBmcm9tIDAgaFxuICogICAgICAgICAgICAgICAgICBqYW4gMCwgMTkwMFxuICogICAgdGVtcCAgICAgICAgLSB0ZW1wb3JhcnkgZG91YmxlIHZhbHVlc1xuICogICAgbGVhcHlycyAgICAgLSBudW1iZXIgb2YgbGVhcCB5ZWFycyBmcm9tIDE5MDBcbiAqXG4gKiAgY291cGxpbmcgICAgICA6XG4gKiAgICBkYXlzMm1kaG1zICAtIGZpbmRzIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSBhbmQgc2Vjb25kIGdpdmVuIGRheXMgYW5kIHllYXJcbiAqXG4gKiAgcmVmZXJlbmNlcyAgICA6XG4gKiAgICB2YWxsYWRvICAgICAgIDIwMDcsIDIwOCwgYWxnIDIyLCBleCAzLTEzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXG5mdW5jdGlvbiBpbnZqZGF5KGpkLCBhc0FycmF5KSB7XG4gIC8vIC0tLS0tLS0tLS0tLS0tLSBmaW5kIHllYXIgYW5kIGRheXMgb2YgdGhlIHllYXIgLVxuICB2YXIgdGVtcCA9IGpkIC0gMjQxNTAxOS41O1xuICB2YXIgdHUgPSB0ZW1wIC8gMzY1LjI1O1xuICB2YXIgeWVhciA9IDE5MDAgKyBNYXRoLmZsb29yKHR1KTtcbiAgdmFyIGxlYXB5cnMgPSBNYXRoLmZsb29yKCh5ZWFyIC0gMTkwMSkgKiAwLjI1KTsgLy8gb3B0aW9uYWwgbnVkZ2UgYnkgOC42NHgxMC03IHNlYyB0byBnZXQgZXZlbiBvdXRwdXRzXG5cbiAgdmFyIGRheXMgPSB0ZW1wIC0gKCh5ZWFyIC0gMTkwMCkgKiAzNjUuMCArIGxlYXB5cnMpICsgMC4wMDAwMDAwMDAwMTsgLy8gLS0tLS0tLS0tLS0tIGNoZWNrIGZvciBjYXNlIG9mIGJlZ2lubmluZyBvZiBhIHllYXIgLS0tLS0tLS0tLS1cblxuICBpZiAoZGF5cyA8IDEuMCkge1xuICAgIHllYXIgLT0gMTtcbiAgICBsZWFweXJzID0gTWF0aC5mbG9vcigoeWVhciAtIDE5MDEpICogMC4yNSk7XG4gICAgZGF5cyA9IHRlbXAgLSAoKHllYXIgLSAxOTAwKSAqIDM2NS4wICsgbGVhcHlycyk7XG4gIH0gLy8gLS0tLS0tLS0tLS0tLS0tLS0gZmluZCByZW1haW5nIGRhdGEgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gIHZhciBtZGhtcyA9IGRheXMybWRobXMoeWVhciwgZGF5cyk7XG4gIHZhciBtb24gPSBtZGhtcy5tb24sXG4gICAgICBkYXkgPSBtZGhtcy5kYXksXG4gICAgICBociA9IG1kaG1zLmhyLFxuICAgICAgbWludXRlID0gbWRobXMubWludXRlO1xuICB2YXIgc2VjID0gbWRobXMuc2VjIC0gMC4wMDAwMDA4NjQwMDtcblxuICBpZiAoYXNBcnJheSkge1xuICAgIHJldHVybiBbeWVhciwgbW9uLCBkYXksIGhyLCBtaW51dGUsIE1hdGguZmxvb3Ioc2VjKV07XG4gIH1cblxuICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9uIC0gMSwgZGF5LCBociwgbWludXRlLCBNYXRoLmZsb29yKHNlYykpKTtcbn1cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWR1cmUgZHBwZXJcbiAqXG4gKiAgdGhpcyBwcm9jZWR1cmUgcHJvdmlkZXMgZGVlcCBzcGFjZSBsb25nIHBlcmlvZCBwZXJpb2RpYyBjb250cmlidXRpb25zXG4gKiAgICB0byB0aGUgbWVhbiBlbGVtZW50cy4gIGJ5IGRlc2lnbiwgdGhlc2UgcGVyaW9kaWNzIGFyZSB6ZXJvIGF0IGVwb2NoLlxuICogICAgdGhpcyB1c2VkIHRvIGJlIGRzY29tIHdoaWNoIGluY2x1ZGVkIGluaXRpYWxpemF0aW9uLCBidXQgaXQncyByZWFsbHkgYVxuICogICAgcmVjdXJyaW5nIGZ1bmN0aW9uLlxuICpcbiAqICBhdXRob3IgICAgICAgIDogZGF2aWQgdmFsbGFkbyAgICAgICAgICAgICAgICAgIDcxOS01NzMtMjYwMCAgIDI4IGp1biAyMDA1XG4gKlxuICogIGlucHV0cyAgICAgICAgOlxuICogICAgZTMgICAgICAgICAgLVxuICogICAgZWUyICAgICAgICAgLVxuICogICAgcGVvICAgICAgICAgLVxuICogICAgcGdobyAgICAgICAgLVxuICogICAgcGhvICAgICAgICAgLVxuICogICAgcGluY28gICAgICAgLVxuICogICAgcGxvICAgICAgICAgLVxuICogICAgc2UyICwgc2UzICwgc2doMiwgc2doMywgc2doNCwgc2gyLCBzaDMsIHNpMiwgc2kzLCBzbDIsIHNsMywgc2w0IC1cbiAqICAgIHQgICAgICAgICAgIC1cbiAqICAgIHhoMiwgeGgzLCB4aTIsIHhpMywgeGwyLCB4bDMsIHhsNCAtXG4gKiAgICB6bW9sICAgICAgICAtXG4gKiAgICB6bW9zICAgICAgICAtXG4gKiAgICBlcCAgICAgICAgICAtIGVjY2VudHJpY2l0eSAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCAtIDEuMFxuICogICAgaW5jbG8gICAgICAgLSBpbmNsaW5hdGlvbiAtIG5lZWRlZCBmb3IgbHlkZGFuZSBtb2RpZmljYXRpb25cbiAqICAgIG5vZGVwICAgICAgIC0gcmlnaHQgYXNjZW5zaW9uIG9mIGFzY2VuZGluZyBub2RlXG4gKiAgICBhcmdwcCAgICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWVcbiAqICAgIG1wICAgICAgICAgIC0gbWVhbiBhbm9tYWx5XG4gKlxuICogIG91dHB1dHMgICAgICAgOlxuICogICAgZXAgICAgICAgICAgLSBlY2NlbnRyaWNpdHkgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAgLSAxLjBcbiAqICAgIGluY2xwICAgICAgIC0gaW5jbGluYXRpb25cbiAqICAgIG5vZGVwICAgICAgICAtIHJpZ2h0IGFzY2Vuc2lvbiBvZiBhc2NlbmRpbmcgbm9kZVxuICogICAgYXJncHAgICAgICAgLSBhcmd1bWVudCBvZiBwZXJpZ2VlXG4gKiAgICBtcCAgICAgICAgICAtIG1lYW4gYW5vbWFseVxuICpcbiAqICBsb2NhbHMgICAgICAgIDpcbiAqICAgIGFsZmRwICAgICAgIC1cbiAqICAgIGJldGRwICAgICAgIC1cbiAqICAgIGNvc2lwICAsIHNpbmlwICAsIGNvc29wICAsIHNpbm9wICAsXG4gKiAgICBkYWxmICAgICAgICAtXG4gKiAgICBkYmV0ICAgICAgICAtXG4gKiAgICBkbHMgICAgICAgICAtXG4gKiAgICBmMiwgZjMgICAgICAtXG4gKiAgICBwZSAgICAgICAgICAtXG4gKiAgICBwZ2ggICAgICAgICAtXG4gKiAgICBwaCAgICAgICAgICAtXG4gKiAgICBwaW5jICAgICAgICAtXG4gKiAgICBwbCAgICAgICAgICAtXG4gKiAgICBzZWwgICAsIHNlcyAgICwgc2dobCAgLCBzZ2hzICAsIHNobCAgICwgc2hzICAgLCBzaWwgICAsIHNpbnpmICwgc2lzICAgLFxuICogICAgc2xsICAgLCBzbHNcbiAqICAgIHhscyAgICAgICAgIC1cbiAqICAgIHhub2ggICAgICAgIC1cbiAqICAgIHpmICAgICAgICAgIC1cbiAqICAgIHptICAgICAgICAgIC1cbiAqXG4gKiAgY291cGxpbmcgICAgICA6XG4gKiAgICBub25lLlxuICpcbiAqICByZWZlcmVuY2VzICAgIDpcbiAqICAgIGhvb3RzLCByb2VocmljaCwgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzMgMTk4MFxuICogICAgaG9vdHMsIG5vcmFkIHNwYWNldHJhY2sgcmVwb3J0ICM2IDE5ODZcbiAqICAgIGhvb3RzLCBzY2h1bWFjaGVyIGFuZCBnbG92ZXIgMjAwNFxuICogICAgdmFsbGFkbywgY3Jhd2ZvcmQsIGh1anNhaywga2Vsc28gIDIwMDZcbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG5mdW5jdGlvbiBkcHBlcihzYXRyZWMsIG9wdGlvbnMpIHtcbiAgdmFyIGUzID0gc2F0cmVjLmUzLFxuICAgICAgZWUyID0gc2F0cmVjLmVlMixcbiAgICAgIHBlbyA9IHNhdHJlYy5wZW8sXG4gICAgICBwZ2hvID0gc2F0cmVjLnBnaG8sXG4gICAgICBwaG8gPSBzYXRyZWMucGhvLFxuICAgICAgcGluY28gPSBzYXRyZWMucGluY28sXG4gICAgICBwbG8gPSBzYXRyZWMucGxvLFxuICAgICAgc2UyID0gc2F0cmVjLnNlMixcbiAgICAgIHNlMyA9IHNhdHJlYy5zZTMsXG4gICAgICBzZ2gyID0gc2F0cmVjLnNnaDIsXG4gICAgICBzZ2gzID0gc2F0cmVjLnNnaDMsXG4gICAgICBzZ2g0ID0gc2F0cmVjLnNnaDQsXG4gICAgICBzaDIgPSBzYXRyZWMuc2gyLFxuICAgICAgc2gzID0gc2F0cmVjLnNoMyxcbiAgICAgIHNpMiA9IHNhdHJlYy5zaTIsXG4gICAgICBzaTMgPSBzYXRyZWMuc2kzLFxuICAgICAgc2wyID0gc2F0cmVjLnNsMixcbiAgICAgIHNsMyA9IHNhdHJlYy5zbDMsXG4gICAgICBzbDQgPSBzYXRyZWMuc2w0LFxuICAgICAgdCA9IHNhdHJlYy50LFxuICAgICAgeGdoMiA9IHNhdHJlYy54Z2gyLFxuICAgICAgeGdoMyA9IHNhdHJlYy54Z2gzLFxuICAgICAgeGdoNCA9IHNhdHJlYy54Z2g0LFxuICAgICAgeGgyID0gc2F0cmVjLnhoMixcbiAgICAgIHhoMyA9IHNhdHJlYy54aDMsXG4gICAgICB4aTIgPSBzYXRyZWMueGkyLFxuICAgICAgeGkzID0gc2F0cmVjLnhpMyxcbiAgICAgIHhsMiA9IHNhdHJlYy54bDIsXG4gICAgICB4bDMgPSBzYXRyZWMueGwzLFxuICAgICAgeGw0ID0gc2F0cmVjLnhsNCxcbiAgICAgIHptb2wgPSBzYXRyZWMuem1vbCxcbiAgICAgIHptb3MgPSBzYXRyZWMuem1vcztcbiAgdmFyIGluaXQgPSBvcHRpb25zLmluaXQsXG4gICAgICBvcHNtb2RlID0gb3B0aW9ucy5vcHNtb2RlO1xuICB2YXIgZXAgPSBvcHRpb25zLmVwLFxuICAgICAgaW5jbHAgPSBvcHRpb25zLmluY2xwLFxuICAgICAgbm9kZXAgPSBvcHRpb25zLm5vZGVwLFxuICAgICAgYXJncHAgPSBvcHRpb25zLmFyZ3BwLFxuICAgICAgbXAgPSBvcHRpb25zLm1wOyAvLyBDb3B5IHNhdGVsbGl0ZSBhdHRyaWJ1dGVzIGludG8gbG9jYWwgdmFyaWFibGVzIGZvciBjb252ZW5pZW5jZVxuICAvLyBhbmQgc3ltbWV0cnkgaW4gd3JpdGluZyBmb3JtdWxhZS5cblxuICB2YXIgYWxmZHA7XG4gIHZhciBiZXRkcDtcbiAgdmFyIGNvc2lwO1xuICB2YXIgc2luaXA7XG4gIHZhciBjb3NvcDtcbiAgdmFyIHNpbm9wO1xuICB2YXIgZGFsZjtcbiAgdmFyIGRiZXQ7XG4gIHZhciBkbHM7XG4gIHZhciBmMjtcbiAgdmFyIGYzO1xuICB2YXIgcGU7XG4gIHZhciBwZ2g7XG4gIHZhciBwaDtcbiAgdmFyIHBpbmM7XG4gIHZhciBwbDtcbiAgdmFyIHNpbnpmO1xuICB2YXIgeGxzO1xuICB2YXIgeG5vaDtcbiAgdmFyIHpmO1xuICB2YXIgem07IC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGNvbnN0YW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciB6bnMgPSAxLjE5NDU5ZS01O1xuICB2YXIgemVzID0gMC4wMTY3NTtcbiAgdmFyIHpubCA9IDEuNTgzNTIxOGUtNDtcbiAgdmFyIHplbCA9IDAuMDU0OTA7IC8vICAtLS0tLS0tLS0tLS0tLS0gY2FsY3VsYXRlIHRpbWUgdmFyeWluZyBwZXJpb2RpY3MgLS0tLS0tLS0tLS1cblxuICB6bSA9IHptb3MgKyB6bnMgKiB0OyAvLyBiZSBzdXJlIHRoYXQgdGhlIGluaXRpYWwgY2FsbCBoYXMgdGltZSBzZXQgdG8gemVyb1xuXG4gIGlmIChpbml0ID09PSAneScpIHtcbiAgICB6bSA9IHptb3M7XG4gIH1cblxuICB6ZiA9IHptICsgMi4wICogemVzICogTWF0aC5zaW4oem0pO1xuICBzaW56ZiA9IE1hdGguc2luKHpmKTtcbiAgZjIgPSAwLjUgKiBzaW56ZiAqIHNpbnpmIC0gMC4yNTtcbiAgZjMgPSAtMC41ICogc2luemYgKiBNYXRoLmNvcyh6Zik7XG4gIHZhciBzZXMgPSBzZTIgKiBmMiArIHNlMyAqIGYzO1xuICB2YXIgc2lzID0gc2kyICogZjIgKyBzaTMgKiBmMztcbiAgdmFyIHNscyA9IHNsMiAqIGYyICsgc2wzICogZjMgKyBzbDQgKiBzaW56ZjtcbiAgdmFyIHNnaHMgPSBzZ2gyICogZjIgKyBzZ2gzICogZjMgKyBzZ2g0ICogc2luemY7XG4gIHZhciBzaHMgPSBzaDIgKiBmMiArIHNoMyAqIGYzO1xuICB6bSA9IHptb2wgKyB6bmwgKiB0O1xuXG4gIGlmIChpbml0ID09PSAneScpIHtcbiAgICB6bSA9IHptb2w7XG4gIH1cblxuICB6ZiA9IHptICsgMi4wICogemVsICogTWF0aC5zaW4oem0pO1xuICBzaW56ZiA9IE1hdGguc2luKHpmKTtcbiAgZjIgPSAwLjUgKiBzaW56ZiAqIHNpbnpmIC0gMC4yNTtcbiAgZjMgPSAtMC41ICogc2luemYgKiBNYXRoLmNvcyh6Zik7XG4gIHZhciBzZWwgPSBlZTIgKiBmMiArIGUzICogZjM7XG4gIHZhciBzaWwgPSB4aTIgKiBmMiArIHhpMyAqIGYzO1xuICB2YXIgc2xsID0geGwyICogZjIgKyB4bDMgKiBmMyArIHhsNCAqIHNpbnpmO1xuICB2YXIgc2dobCA9IHhnaDIgKiBmMiArIHhnaDMgKiBmMyArIHhnaDQgKiBzaW56ZjtcbiAgdmFyIHNobGwgPSB4aDIgKiBmMiArIHhoMyAqIGYzO1xuICBwZSA9IHNlcyArIHNlbDtcbiAgcGluYyA9IHNpcyArIHNpbDtcbiAgcGwgPSBzbHMgKyBzbGw7XG4gIHBnaCA9IHNnaHMgKyBzZ2hsO1xuICBwaCA9IHNocyArIHNobGw7XG5cbiAgaWYgKGluaXQgPT09ICduJykge1xuICAgIHBlIC09IHBlbztcbiAgICBwaW5jIC09IHBpbmNvO1xuICAgIHBsIC09IHBsbztcbiAgICBwZ2ggLT0gcGdobztcbiAgICBwaCAtPSBwaG87XG4gICAgaW5jbHAgKz0gcGluYztcbiAgICBlcCArPSBwZTtcbiAgICBzaW5pcCA9IE1hdGguc2luKGluY2xwKTtcbiAgICBjb3NpcCA9IE1hdGguY29zKGluY2xwKTtcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLSBhcHBseSBwZXJpb2RpY3MgZGlyZWN0bHkgLS0tLS0tLS0tLS0tICovXG4gICAgLy8gc2dwNGZpeCBmb3IgbHlkZGFuZSBjaG9pY2VcbiAgICAvLyBzdHJuMyB1c2VkIG9yaWdpbmFsIGluY2xpbmF0aW9uIC0gdGhpcyBpcyB0ZWNobmljYWxseSBmZWFzaWJsZVxuICAgIC8vIGdzZmMgdXNlZCBwZXJ0dXJiZWQgaW5jbGluYXRpb24gLSBhbHNvIHRlY2huaWNhbGx5IGZlYXNpYmxlXG4gICAgLy8gcHJvYmFibHkgYmVzdCB0byByZWFkanVzdCB0aGUgMC4yIGxpbWl0IHZhbHVlIGFuZCBsaW1pdCBkaXNjb250aW51aXR5XG4gICAgLy8gMC4yIHJhZCA9IDExLjQ1OTE2IGRlZ1xuICAgIC8vIHVzZSBuZXh0IGxpbmUgZm9yIG9yaWdpbmFsIHN0cm4zIGFwcHJvYWNoIGFuZCBvcmlnaW5hbCBpbmNsaW5hdGlvblxuICAgIC8vIGlmIChpbmNsbyA+PSAwLjIpXG4gICAgLy8gdXNlIG5leHQgbGluZSBmb3IgZ3NmYyB2ZXJzaW9uIGFuZCBwZXJ0dXJiZWQgaW5jbGluYXRpb25cblxuICAgIGlmIChpbmNscCA+PSAwLjIpIHtcbiAgICAgIHBoIC89IHNpbmlwO1xuICAgICAgcGdoIC09IGNvc2lwICogcGg7XG4gICAgICBhcmdwcCArPSBwZ2g7XG4gICAgICBub2RlcCArPSBwaDtcbiAgICAgIG1wICs9IHBsO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyAgLS0tLSBhcHBseSBwZXJpb2RpY3Mgd2l0aCBseWRkYW5lIG1vZGlmaWNhdGlvbiAtLS0tXG4gICAgICBzaW5vcCA9IE1hdGguc2luKG5vZGVwKTtcbiAgICAgIGNvc29wID0gTWF0aC5jb3Mobm9kZXApO1xuICAgICAgYWxmZHAgPSBzaW5pcCAqIHNpbm9wO1xuICAgICAgYmV0ZHAgPSBzaW5pcCAqIGNvc29wO1xuICAgICAgZGFsZiA9IHBoICogY29zb3AgKyBwaW5jICogY29zaXAgKiBzaW5vcDtcbiAgICAgIGRiZXQgPSAtcGggKiBzaW5vcCArIHBpbmMgKiBjb3NpcCAqIGNvc29wO1xuICAgICAgYWxmZHAgKz0gZGFsZjtcbiAgICAgIGJldGRwICs9IGRiZXQ7XG4gICAgICBub2RlcCAlPSB0d29QaTsgLy8gIHNncDRmaXggZm9yIGFmc3BjIHdyaXR0ZW4gaW50cmluc2ljIGZ1bmN0aW9uc1xuICAgICAgLy8gIG5vZGVwIHVzZWQgd2l0aG91dCBhIHRyaWdvbm9tZXRyaWMgZnVuY3Rpb24gYWhlYWRcblxuICAgICAgaWYgKG5vZGVwIDwgMC4wICYmIG9wc21vZGUgPT09ICdhJykge1xuICAgICAgICBub2RlcCArPSB0d29QaTtcbiAgICAgIH1cblxuICAgICAgeGxzID0gbXAgKyBhcmdwcCArIGNvc2lwICogbm9kZXA7XG4gICAgICBkbHMgPSBwbCArIHBnaCAtIHBpbmMgKiBub2RlcCAqIHNpbmlwO1xuICAgICAgeGxzICs9IGRscztcbiAgICAgIHhub2ggPSBub2RlcDtcbiAgICAgIG5vZGVwID0gTWF0aC5hdGFuMihhbGZkcCwgYmV0ZHApOyAvLyAgc2dwNGZpeCBmb3IgYWZzcGMgd3JpdHRlbiBpbnRyaW5zaWMgZnVuY3Rpb25zXG4gICAgICAvLyAgbm9kZXAgdXNlZCB3aXRob3V0IGEgdHJpZ29ub21ldHJpYyBmdW5jdGlvbiBhaGVhZFxuXG4gICAgICBpZiAobm9kZXAgPCAwLjAgJiYgb3BzbW9kZSA9PT0gJ2EnKSB7XG4gICAgICAgIG5vZGVwICs9IHR3b1BpO1xuICAgICAgfVxuXG4gICAgICBpZiAoTWF0aC5hYnMoeG5vaCAtIG5vZGVwKSA+IHBpKSB7XG4gICAgICAgIGlmIChub2RlcCA8IHhub2gpIHtcbiAgICAgICAgICBub2RlcCArPSB0d29QaTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2RlcCAtPSB0d29QaTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBtcCArPSBwbDtcbiAgICAgIGFyZ3BwID0geGxzIC0gbXAgLSBjb3NpcCAqIG5vZGVwO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZXA6IGVwLFxuICAgIGluY2xwOiBpbmNscCxcbiAgICBub2RlcDogbm9kZXAsXG4gICAgYXJncHA6IGFyZ3BwLFxuICAgIG1wOiBtcFxuICB9O1xufVxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VkdXJlIGRzY29tXG4gKlxuICogIHRoaXMgcHJvY2VkdXJlIHByb3ZpZGVzIGRlZXAgc3BhY2UgY29tbW9uIGl0ZW1zIHVzZWQgYnkgYm90aCB0aGUgc2VjdWxhclxuICogICAgYW5kIHBlcmlvZGljcyBzdWJyb3V0aW5lcy4gIGlucHV0IGlzIHByb3ZpZGVkIGFzIHNob3duLiB0aGlzIHJvdXRpbmVcbiAqICAgIHVzZWQgdG8gYmUgY2FsbGVkIGRwcGVyLCBidXQgdGhlIGZ1bmN0aW9ucyBpbnNpZGUgd2VyZW4ndCB3ZWxsIG9yZ2FuaXplZC5cbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAyOCBqdW4gMjAwNVxuICpcbiAqICBpbnB1dHMgICAgICAgIDpcbiAqICAgIGVwb2NoICAgICAgIC1cbiAqICAgIGVwICAgICAgICAgIC0gZWNjZW50cmljaXR5XG4gKiAgICBhcmdwcCAgICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWVcbiAqICAgIHRjICAgICAgICAgIC1cbiAqICAgIGluY2xwICAgICAgIC0gaW5jbGluYXRpb25cbiAqICAgIG5vZGVwICAgICAgIC0gcmlnaHQgYXNjZW5zaW9uIG9mIGFzY2VuZGluZyBub2RlXG4gKiAgICBucCAgICAgICAgICAtIG1lYW4gbW90aW9uXG4gKlxuICogIG91dHB1dHMgICAgICAgOlxuICogICAgc2luaW0gICwgY29zaW0gICwgc2lub21tICwgY29zb21tICwgc25vZG0gICwgY25vZG1cbiAqICAgIGRheSAgICAgICAgIC1cbiAqICAgIGUzICAgICAgICAgIC1cbiAqICAgIGVlMiAgICAgICAgIC1cbiAqICAgIGVtICAgICAgICAgIC0gZWNjZW50cmljaXR5XG4gKiAgICBlbXNxICAgICAgICAtIGVjY2VudHJpY2l0eSBzcXVhcmVkXG4gKiAgICBnYW0gICAgICAgICAtXG4gKiAgICBwZW8gICAgICAgICAtXG4gKiAgICBwZ2hvICAgICAgICAtXG4gKiAgICBwaG8gICAgICAgICAtXG4gKiAgICBwaW5jbyAgICAgICAtXG4gKiAgICBwbG8gICAgICAgICAtXG4gKiAgICBydGVtc3EgICAgICAtXG4gKiAgICBzZTIsIHNlMyAgICAgICAgIC1cbiAqICAgIHNnaDIsIHNnaDMsIHNnaDQgICAgICAgIC1cbiAqICAgIHNoMiwgc2gzLCBzaTIsIHNpMywgc2wyLCBzbDMsIHNsNCAgICAgICAgIC1cbiAqICAgIHMxLCBzMiwgczMsIHM0LCBzNSwgczYsIHM3ICAgICAgICAgIC1cbiAqICAgIHNzMSwgc3MyLCBzczMsIHNzNCwgc3M1LCBzczYsIHNzNywgc3oxLCBzejIsIHN6MyAgICAgICAgIC1cbiAqICAgIHN6MTEsIHN6MTIsIHN6MTMsIHN6MjEsIHN6MjIsIHN6MjMsIHN6MzEsIHN6MzIsIHN6MzMgICAgICAgIC1cbiAqICAgIHhnaDIsIHhnaDMsIHhnaDQsIHhoMiwgeGgzLCB4aTIsIHhpMywgeGwyLCB4bDMsIHhsNCAgICAgICAgIC1cbiAqICAgIG5tICAgICAgICAgIC0gbWVhbiBtb3Rpb25cbiAqICAgIHoxLCB6MiwgejMsIHoxMSwgejEyLCB6MTMsIHoyMSwgejIyLCB6MjMsIHozMSwgejMyLCB6MzMgICAgICAgICAtXG4gKiAgICB6bW9sICAgICAgICAtXG4gKiAgICB6bW9zICAgICAgICAtXG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSwgYTEwICAgICAgICAgLVxuICogICAgYmV0YXNxICAgICAgLVxuICogICAgY2MgICAgICAgICAgLVxuICogICAgY3RlbSwgc3RlbSAgICAgICAgLVxuICogICAgeDEsIHgyLCB4MywgeDQsIHg1LCB4NiwgeDcsIHg4ICAgICAgICAgIC1cbiAqICAgIHhub2RjZSAgICAgIC1cbiAqICAgIHhub2kgICAgICAgIC1cbiAqICAgIHpjb3NnICAsIHpzaW5nICAsIHpjb3NnbCAsIHpzaW5nbCAsIHpjb3NoICAsIHpzaW5oICAsIHpjb3NobCAsIHpzaW5obCAsXG4gKiAgICB6Y29zaSAgLCB6c2luaSAgLCB6Y29zaWwgLCB6c2luaWwgLFxuICogICAgenggICAgICAgICAgLVxuICogICAgenkgICAgICAgICAgLVxuICpcbiAqICBjb3VwbGluZyAgICAgIDpcbiAqICAgIG5vbmUuXG4gKlxuICogIHJlZmVyZW5jZXMgICAgOlxuICogICAgaG9vdHMsIHJvZWhyaWNoLCBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAjMyAxOTgwXG4gKiAgICBob290cywgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzYgMTk4NlxuICogICAgaG9vdHMsIHNjaHVtYWNoZXIgYW5kIGdsb3ZlciAyMDA0XG4gKiAgICB2YWxsYWRvLCBjcmF3Zm9yZCwgaHVqc2FrLCBrZWxzbyAgMjAwNlxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbmZ1bmN0aW9uIGRzY29tKG9wdGlvbnMpIHtcbiAgdmFyIGVwb2NoID0gb3B0aW9ucy5lcG9jaCxcbiAgICAgIGVwID0gb3B0aW9ucy5lcCxcbiAgICAgIGFyZ3BwID0gb3B0aW9ucy5hcmdwcCxcbiAgICAgIHRjID0gb3B0aW9ucy50YyxcbiAgICAgIGluY2xwID0gb3B0aW9ucy5pbmNscCxcbiAgICAgIG5vZGVwID0gb3B0aW9ucy5ub2RlcCxcbiAgICAgIG5wID0gb3B0aW9ucy5ucDtcbiAgdmFyIGExO1xuICB2YXIgYTI7XG4gIHZhciBhMztcbiAgdmFyIGE0O1xuICB2YXIgYTU7XG4gIHZhciBhNjtcbiAgdmFyIGE3O1xuICB2YXIgYTg7XG4gIHZhciBhOTtcbiAgdmFyIGExMDtcbiAgdmFyIGNjO1xuICB2YXIgeDE7XG4gIHZhciB4MjtcbiAgdmFyIHgzO1xuICB2YXIgeDQ7XG4gIHZhciB4NTtcbiAgdmFyIHg2O1xuICB2YXIgeDc7XG4gIHZhciB4ODtcbiAgdmFyIHpjb3NnO1xuICB2YXIgenNpbmc7XG4gIHZhciB6Y29zaDtcbiAgdmFyIHpzaW5oO1xuICB2YXIgemNvc2k7XG4gIHZhciB6c2luaTtcbiAgdmFyIHNzMTtcbiAgdmFyIHNzMjtcbiAgdmFyIHNzMztcbiAgdmFyIHNzNDtcbiAgdmFyIHNzNTtcbiAgdmFyIHNzNjtcbiAgdmFyIHNzNztcbiAgdmFyIHN6MTtcbiAgdmFyIHN6MjtcbiAgdmFyIHN6MztcbiAgdmFyIHN6MTE7XG4gIHZhciBzejEyO1xuICB2YXIgc3oxMztcbiAgdmFyIHN6MjE7XG4gIHZhciBzejIyO1xuICB2YXIgc3oyMztcbiAgdmFyIHN6MzE7XG4gIHZhciBzejMyO1xuICB2YXIgc3ozMztcbiAgdmFyIHMxO1xuICB2YXIgczI7XG4gIHZhciBzMztcbiAgdmFyIHM0O1xuICB2YXIgczU7XG4gIHZhciBzNjtcbiAgdmFyIHM3O1xuICB2YXIgejE7XG4gIHZhciB6MjtcbiAgdmFyIHozO1xuICB2YXIgejExO1xuICB2YXIgejEyO1xuICB2YXIgejEzO1xuICB2YXIgejIxO1xuICB2YXIgejIyO1xuICB2YXIgejIzO1xuICB2YXIgejMxO1xuICB2YXIgejMyO1xuICB2YXIgejMzOyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBjb25zdGFudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciB6ZXMgPSAwLjAxNjc1O1xuICB2YXIgemVsID0gMC4wNTQ5MDtcbiAgdmFyIGMxc3MgPSAyLjk4NjQ3OTdlLTY7XG4gIHZhciBjMWwgPSA0Ljc5NjgwNjVlLTc7XG4gIHZhciB6c2luaXMgPSAwLjM5Nzg1NDE2O1xuICB2YXIgemNvc2lzID0gMC45MTc0NDg2NztcbiAgdmFyIHpjb3NncyA9IDAuMTk0NTkwNTtcbiAgdmFyIHpzaW5ncyA9IC0wLjk4MDg4NDU4OyAvLyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGxvY2FsIHZhcmlhYmxlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgbm0gPSBucDtcbiAgdmFyIGVtID0gZXA7XG4gIHZhciBzbm9kbSA9IE1hdGguc2luKG5vZGVwKTtcbiAgdmFyIGNub2RtID0gTWF0aC5jb3Mobm9kZXApO1xuICB2YXIgc2lub21tID0gTWF0aC5zaW4oYXJncHApO1xuICB2YXIgY29zb21tID0gTWF0aC5jb3MoYXJncHApO1xuICB2YXIgc2luaW0gPSBNYXRoLnNpbihpbmNscCk7XG4gIHZhciBjb3NpbSA9IE1hdGguY29zKGluY2xwKTtcbiAgdmFyIGVtc3EgPSBlbSAqIGVtO1xuICB2YXIgYmV0YXNxID0gMS4wIC0gZW1zcTtcbiAgdmFyIHJ0ZW1zcSA9IE1hdGguc3FydChiZXRhc3EpOyAvLyAgLS0tLS0tLS0tLS0tLS0tLS0gaW5pdGlhbGl6ZSBsdW5hciBzb2xhciB0ZXJtcyAtLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgcGVvID0gMC4wO1xuICB2YXIgcGluY28gPSAwLjA7XG4gIHZhciBwbG8gPSAwLjA7XG4gIHZhciBwZ2hvID0gMC4wO1xuICB2YXIgcGhvID0gMC4wO1xuICB2YXIgZGF5ID0gZXBvY2ggKyAxODI2MS41ICsgdGMgLyAxNDQwLjA7XG4gIHZhciB4bm9kY2UgPSAoNC41MjM2MDIwIC0gOS4yNDIyMDI5ZS00ICogZGF5KSAlIHR3b1BpO1xuICB2YXIgc3RlbSA9IE1hdGguc2luKHhub2RjZSk7XG4gIHZhciBjdGVtID0gTWF0aC5jb3MoeG5vZGNlKTtcbiAgdmFyIHpjb3NpbCA9IDAuOTEzNzUxNjQgLSAwLjAzNTY4MDk2ICogY3RlbTtcbiAgdmFyIHpzaW5pbCA9IE1hdGguc3FydCgxLjAgLSB6Y29zaWwgKiB6Y29zaWwpO1xuICB2YXIgenNpbmhsID0gMC4wODk2ODM1MTEgKiBzdGVtIC8genNpbmlsO1xuICB2YXIgemNvc2hsID0gTWF0aC5zcXJ0KDEuMCAtIHpzaW5obCAqIHpzaW5obCk7XG4gIHZhciBnYW0gPSA1LjgzNTE1MTQgKyAwLjAwMTk0NDM2ODAgKiBkYXk7XG4gIHZhciB6eCA9IDAuMzk3ODU0MTYgKiBzdGVtIC8genNpbmlsO1xuICB2YXIgenkgPSB6Y29zaGwgKiBjdGVtICsgMC45MTc0NDg2NyAqIHpzaW5obCAqIHN0ZW07XG4gIHp4ID0gTWF0aC5hdGFuMih6eCwgenkpO1xuICB6eCArPSBnYW0gLSB4bm9kY2U7XG4gIHZhciB6Y29zZ2wgPSBNYXRoLmNvcyh6eCk7XG4gIHZhciB6c2luZ2wgPSBNYXRoLnNpbih6eCk7IC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRvIHNvbGFyIHRlcm1zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHpjb3NnID0gemNvc2dzO1xuICB6c2luZyA9IHpzaW5ncztcbiAgemNvc2kgPSB6Y29zaXM7XG4gIHpzaW5pID0genNpbmlzO1xuICB6Y29zaCA9IGNub2RtO1xuICB6c2luaCA9IHNub2RtO1xuICBjYyA9IGMxc3M7XG4gIHZhciB4bm9pID0gMS4wIC8gbm07XG4gIHZhciBsc2ZsZyA9IDA7XG5cbiAgd2hpbGUgKGxzZmxnIDwgMikge1xuICAgIGxzZmxnICs9IDE7XG4gICAgYTEgPSB6Y29zZyAqIHpjb3NoICsgenNpbmcgKiB6Y29zaSAqIHpzaW5oO1xuICAgIGEzID0gLXpzaW5nICogemNvc2ggKyB6Y29zZyAqIHpjb3NpICogenNpbmg7XG4gICAgYTcgPSAtemNvc2cgKiB6c2luaCArIHpzaW5nICogemNvc2kgKiB6Y29zaDtcbiAgICBhOCA9IHpzaW5nICogenNpbmk7XG4gICAgYTkgPSB6c2luZyAqIHpzaW5oICsgemNvc2cgKiB6Y29zaSAqIHpjb3NoO1xuICAgIGExMCA9IHpjb3NnICogenNpbmk7XG4gICAgYTIgPSBjb3NpbSAqIGE3ICsgc2luaW0gKiBhODtcbiAgICBhNCA9IGNvc2ltICogYTkgKyBzaW5pbSAqIGExMDtcbiAgICBhNSA9IC1zaW5pbSAqIGE3ICsgY29zaW0gKiBhODtcbiAgICBhNiA9IC1zaW5pbSAqIGE5ICsgY29zaW0gKiBhMTA7XG4gICAgeDEgPSBhMSAqIGNvc29tbSArIGEyICogc2lub21tO1xuICAgIHgyID0gYTMgKiBjb3NvbW0gKyBhNCAqIHNpbm9tbTtcbiAgICB4MyA9IC1hMSAqIHNpbm9tbSArIGEyICogY29zb21tO1xuICAgIHg0ID0gLWEzICogc2lub21tICsgYTQgKiBjb3NvbW07XG4gICAgeDUgPSBhNSAqIHNpbm9tbTtcbiAgICB4NiA9IGE2ICogc2lub21tO1xuICAgIHg3ID0gYTUgKiBjb3NvbW07XG4gICAgeDggPSBhNiAqIGNvc29tbTtcbiAgICB6MzEgPSAxMi4wICogeDEgKiB4MSAtIDMuMCAqIHgzICogeDM7XG4gICAgejMyID0gMjQuMCAqIHgxICogeDIgLSA2LjAgKiB4MyAqIHg0O1xuICAgIHozMyA9IDEyLjAgKiB4MiAqIHgyIC0gMy4wICogeDQgKiB4NDtcbiAgICB6MSA9IDMuMCAqIChhMSAqIGExICsgYTIgKiBhMikgKyB6MzEgKiBlbXNxO1xuICAgIHoyID0gNi4wICogKGExICogYTMgKyBhMiAqIGE0KSArIHozMiAqIGVtc3E7XG4gICAgejMgPSAzLjAgKiAoYTMgKiBhMyArIGE0ICogYTQpICsgejMzICogZW1zcTtcbiAgICB6MTEgPSAtNi4wICogYTEgKiBhNSArIGVtc3EgKiAoLTI0LjAgKiB4MSAqIHg3IC0gNi4wICogeDMgKiB4NSk7XG4gICAgejEyID0gLTYuMCAqIChhMSAqIGE2ICsgYTMgKiBhNSkgKyBlbXNxICogKC0yNC4wICogKHgyICogeDcgKyB4MSAqIHg4KSArIC02LjAgKiAoeDMgKiB4NiArIHg0ICogeDUpKTtcbiAgICB6MTMgPSAtNi4wICogYTMgKiBhNiArIGVtc3EgKiAoLTI0LjAgKiB4MiAqIHg4IC0gNi4wICogeDQgKiB4Nik7XG4gICAgejIxID0gNi4wICogYTIgKiBhNSArIGVtc3EgKiAoMjQuMCAqIHgxICogeDUgLSA2LjAgKiB4MyAqIHg3KTtcbiAgICB6MjIgPSA2LjAgKiAoYTQgKiBhNSArIGEyICogYTYpICsgZW1zcSAqICgyNC4wICogKHgyICogeDUgKyB4MSAqIHg2KSAtIDYuMCAqICh4NCAqIHg3ICsgeDMgKiB4OCkpO1xuICAgIHoyMyA9IDYuMCAqIGE0ICogYTYgKyBlbXNxICogKDI0LjAgKiB4MiAqIHg2IC0gNi4wICogeDQgKiB4OCk7XG4gICAgejEgPSB6MSArIHoxICsgYmV0YXNxICogejMxO1xuICAgIHoyID0gejIgKyB6MiArIGJldGFzcSAqIHozMjtcbiAgICB6MyA9IHozICsgejMgKyBiZXRhc3EgKiB6MzM7XG4gICAgczMgPSBjYyAqIHhub2k7XG4gICAgczIgPSAtMC41ICogczMgLyBydGVtc3E7XG4gICAgczQgPSBzMyAqIHJ0ZW1zcTtcbiAgICBzMSA9IC0xNS4wICogZW0gKiBzNDtcbiAgICBzNSA9IHgxICogeDMgKyB4MiAqIHg0O1xuICAgIHM2ID0geDIgKiB4MyArIHgxICogeDQ7XG4gICAgczcgPSB4MiAqIHg0IC0geDEgKiB4MzsgLy8gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRvIGx1bmFyIHRlcm1zIC0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGlmIChsc2ZsZyA9PT0gMSkge1xuICAgICAgc3MxID0gczE7XG4gICAgICBzczIgPSBzMjtcbiAgICAgIHNzMyA9IHMzO1xuICAgICAgc3M0ID0gczQ7XG4gICAgICBzczUgPSBzNTtcbiAgICAgIHNzNiA9IHM2O1xuICAgICAgc3M3ID0gczc7XG4gICAgICBzejEgPSB6MTtcbiAgICAgIHN6MiA9IHoyO1xuICAgICAgc3ozID0gejM7XG4gICAgICBzejExID0gejExO1xuICAgICAgc3oxMiA9IHoxMjtcbiAgICAgIHN6MTMgPSB6MTM7XG4gICAgICBzejIxID0gejIxO1xuICAgICAgc3oyMiA9IHoyMjtcbiAgICAgIHN6MjMgPSB6MjM7XG4gICAgICBzejMxID0gejMxO1xuICAgICAgc3ozMiA9IHozMjtcbiAgICAgIHN6MzMgPSB6MzM7XG4gICAgICB6Y29zZyA9IHpjb3NnbDtcbiAgICAgIHpzaW5nID0genNpbmdsO1xuICAgICAgemNvc2kgPSB6Y29zaWw7XG4gICAgICB6c2luaSA9IHpzaW5pbDtcbiAgICAgIHpjb3NoID0gemNvc2hsICogY25vZG0gKyB6c2luaGwgKiBzbm9kbTtcbiAgICAgIHpzaW5oID0gc25vZG0gKiB6Y29zaGwgLSBjbm9kbSAqIHpzaW5obDtcbiAgICAgIGNjID0gYzFsO1xuICAgIH1cbiAgfVxuXG4gIHZhciB6bW9sID0gKDQuNzE5OTY3MiArICgwLjIyOTk3MTUwICogZGF5IC0gZ2FtKSkgJSB0d29QaTtcbiAgdmFyIHptb3MgPSAoNi4yNTY1ODM3ICsgMC4wMTcyMDE5NzcgKiBkYXkpICUgdHdvUGk7IC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZG8gc29sYXIgdGVybXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBzZTIgPSAyLjAgKiBzczEgKiBzczY7XG4gIHZhciBzZTMgPSAyLjAgKiBzczEgKiBzczc7XG4gIHZhciBzaTIgPSAyLjAgKiBzczIgKiBzejEyO1xuICB2YXIgc2kzID0gMi4wICogc3MyICogKHN6MTMgLSBzejExKTtcbiAgdmFyIHNsMiA9IC0yLjAgKiBzczMgKiBzejI7XG4gIHZhciBzbDMgPSAtMi4wICogc3MzICogKHN6MyAtIHN6MSk7XG4gIHZhciBzbDQgPSAtMi4wICogc3MzICogKC0yMS4wIC0gOS4wICogZW1zcSkgKiB6ZXM7XG4gIHZhciBzZ2gyID0gMi4wICogc3M0ICogc3ozMjtcbiAgdmFyIHNnaDMgPSAyLjAgKiBzczQgKiAoc3ozMyAtIHN6MzEpO1xuICB2YXIgc2doNCA9IC0xOC4wICogc3M0ICogemVzO1xuICB2YXIgc2gyID0gLTIuMCAqIHNzMiAqIHN6MjI7XG4gIHZhciBzaDMgPSAtMi4wICogc3MyICogKHN6MjMgLSBzejIxKTsgLy8gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkbyBsdW5hciB0ZXJtcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIGVlMiA9IDIuMCAqIHMxICogczY7XG4gIHZhciBlMyA9IDIuMCAqIHMxICogczc7XG4gIHZhciB4aTIgPSAyLjAgKiBzMiAqIHoxMjtcbiAgdmFyIHhpMyA9IDIuMCAqIHMyICogKHoxMyAtIHoxMSk7XG4gIHZhciB4bDIgPSAtMi4wICogczMgKiB6MjtcbiAgdmFyIHhsMyA9IC0yLjAgKiBzMyAqICh6MyAtIHoxKTtcbiAgdmFyIHhsNCA9IC0yLjAgKiBzMyAqICgtMjEuMCAtIDkuMCAqIGVtc3EpICogemVsO1xuICB2YXIgeGdoMiA9IDIuMCAqIHM0ICogejMyO1xuICB2YXIgeGdoMyA9IDIuMCAqIHM0ICogKHozMyAtIHozMSk7XG4gIHZhciB4Z2g0ID0gLTE4LjAgKiBzNCAqIHplbDtcbiAgdmFyIHhoMiA9IC0yLjAgKiBzMiAqIHoyMjtcbiAgdmFyIHhoMyA9IC0yLjAgKiBzMiAqICh6MjMgLSB6MjEpO1xuICByZXR1cm4ge1xuICAgIHNub2RtOiBzbm9kbSxcbiAgICBjbm9kbTogY25vZG0sXG4gICAgc2luaW06IHNpbmltLFxuICAgIGNvc2ltOiBjb3NpbSxcbiAgICBzaW5vbW06IHNpbm9tbSxcbiAgICBjb3NvbW06IGNvc29tbSxcbiAgICBkYXk6IGRheSxcbiAgICBlMzogZTMsXG4gICAgZWUyOiBlZTIsXG4gICAgZW06IGVtLFxuICAgIGVtc3E6IGVtc3EsXG4gICAgZ2FtOiBnYW0sXG4gICAgcGVvOiBwZW8sXG4gICAgcGdobzogcGdobyxcbiAgICBwaG86IHBobyxcbiAgICBwaW5jbzogcGluY28sXG4gICAgcGxvOiBwbG8sXG4gICAgcnRlbXNxOiBydGVtc3EsXG4gICAgc2UyOiBzZTIsXG4gICAgc2UzOiBzZTMsXG4gICAgc2doMjogc2doMixcbiAgICBzZ2gzOiBzZ2gzLFxuICAgIHNnaDQ6IHNnaDQsXG4gICAgc2gyOiBzaDIsXG4gICAgc2gzOiBzaDMsXG4gICAgc2kyOiBzaTIsXG4gICAgc2kzOiBzaTMsXG4gICAgc2wyOiBzbDIsXG4gICAgc2wzOiBzbDMsXG4gICAgc2w0OiBzbDQsXG4gICAgczE6IHMxLFxuICAgIHMyOiBzMixcbiAgICBzMzogczMsXG4gICAgczQ6IHM0LFxuICAgIHM1OiBzNSxcbiAgICBzNjogczYsXG4gICAgczc6IHM3LFxuICAgIHNzMTogc3MxLFxuICAgIHNzMjogc3MyLFxuICAgIHNzMzogc3MzLFxuICAgIHNzNDogc3M0LFxuICAgIHNzNTogc3M1LFxuICAgIHNzNjogc3M2LFxuICAgIHNzNzogc3M3LFxuICAgIHN6MTogc3oxLFxuICAgIHN6Mjogc3oyLFxuICAgIHN6Mzogc3ozLFxuICAgIHN6MTE6IHN6MTEsXG4gICAgc3oxMjogc3oxMixcbiAgICBzejEzOiBzejEzLFxuICAgIHN6MjE6IHN6MjEsXG4gICAgc3oyMjogc3oyMixcbiAgICBzejIzOiBzejIzLFxuICAgIHN6MzE6IHN6MzEsXG4gICAgc3ozMjogc3ozMixcbiAgICBzejMzOiBzejMzLFxuICAgIHhnaDI6IHhnaDIsXG4gICAgeGdoMzogeGdoMyxcbiAgICB4Z2g0OiB4Z2g0LFxuICAgIHhoMjogeGgyLFxuICAgIHhoMzogeGgzLFxuICAgIHhpMjogeGkyLFxuICAgIHhpMzogeGkzLFxuICAgIHhsMjogeGwyLFxuICAgIHhsMzogeGwzLFxuICAgIHhsNDogeGw0LFxuICAgIG5tOiBubSxcbiAgICB6MTogejEsXG4gICAgejI6IHoyLFxuICAgIHozOiB6MyxcbiAgICB6MTE6IHoxMSxcbiAgICB6MTI6IHoxMixcbiAgICB6MTM6IHoxMyxcbiAgICB6MjE6IHoyMSxcbiAgICB6MjI6IHoyMixcbiAgICB6MjM6IHoyMyxcbiAgICB6MzE6IHozMSxcbiAgICB6MzI6IHozMixcbiAgICB6MzM6IHozMyxcbiAgICB6bW9sOiB6bW9sLFxuICAgIHptb3M6IHptb3NcbiAgfTtcbn1cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZHVyZSBkc2luaXRcbiAqXG4gKiAgdGhpcyBwcm9jZWR1cmUgcHJvdmlkZXMgZGVlcCBzcGFjZSBjb250cmlidXRpb25zIHRvIG1lYW4gbW90aW9uIGRvdCBkdWVcbiAqICAgIHRvIGdlb3BvdGVudGlhbCByZXNvbmFuY2Ugd2l0aCBoYWxmIGRheSBhbmQgb25lIGRheSBvcmJpdHMuXG4gKlxuICogIGF1dGhvciAgICAgICAgOiBkYXZpZCB2YWxsYWRvICAgICAgICAgICAgICAgICAgNzE5LTU3My0yNjAwICAgMjgganVuIDIwMDVcbiAqXG4gKiAgaW5wdXRzICAgICAgICA6XG4gKiAgICBjb3NpbSwgc2luaW0tXG4gKiAgICBlbXNxICAgICAgICAtIGVjY2VudHJpY2l0eSBzcXVhcmVkXG4gKiAgICBhcmdwbyAgICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWVcbiAqICAgIHMxLCBzMiwgczMsIHM0LCBzNSAgICAgIC1cbiAqICAgIHNzMSwgc3MyLCBzczMsIHNzNCwgc3M1IC1cbiAqICAgIHN6MSwgc3ozLCBzejExLCBzejEzLCBzejIxLCBzejIzLCBzejMxLCBzejMzIC1cbiAqICAgIHQgICAgICAgICAgIC0gdGltZVxuICogICAgdGMgICAgICAgICAgLVxuICogICAgZ3N0byAgICAgICAgLSBncmVlbndpY2ggc2lkZXJlYWwgdGltZSAgICAgICAgICAgICAgICAgICByYWRcbiAqICAgIG1vICAgICAgICAgIC0gbWVhbiBhbm9tYWx5XG4gKiAgICBtZG90ICAgICAgICAtIG1lYW4gYW5vbWFseSBkb3QgKHJhdGUpXG4gKiAgICBubyAgICAgICAgICAtIG1lYW4gbW90aW9uXG4gKiAgICBub2RlbyAgICAgICAtIHJpZ2h0IGFzY2Vuc2lvbiBvZiBhc2NlbmRpbmcgbm9kZVxuICogICAgbm9kZWRvdCAgICAgLSByaWdodCBhc2NlbnNpb24gb2YgYXNjZW5kaW5nIG5vZGUgZG90IChyYXRlKVxuICogICAgeHBpZG90ICAgICAgLVxuICogICAgejEsIHozLCB6MTEsIHoxMywgejIxLCB6MjMsIHozMSwgejMzIC1cbiAqICAgIGVjY20gICAgICAgIC0gZWNjZW50cmljaXR5XG4gKiAgICBhcmdwbSAgICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWVcbiAqICAgIGluY2xtICAgICAgIC0gaW5jbGluYXRpb25cbiAqICAgIG1tICAgICAgICAgIC0gbWVhbiBhbm9tYWx5XG4gKiAgICB4biAgICAgICAgICAtIG1lYW4gbW90aW9uXG4gKiAgICBub2RlbSAgICAgICAtIHJpZ2h0IGFzY2Vuc2lvbiBvZiBhc2NlbmRpbmcgbm9kZVxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIGVtICAgICAgICAgIC0gZWNjZW50cmljaXR5XG4gKiAgICBhcmdwbSAgICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWVcbiAqICAgIGluY2xtICAgICAgIC0gaW5jbGluYXRpb25cbiAqICAgIG1tICAgICAgICAgIC0gbWVhbiBhbm9tYWx5XG4gKiAgICBubSAgICAgICAgICAtIG1lYW4gbW90aW9uXG4gKiAgICBub2RlbSAgICAgICAtIHJpZ2h0IGFzY2Vuc2lvbiBvZiBhc2NlbmRpbmcgbm9kZVxuICogICAgaXJleiAgICAgICAgLSBmbGFnIGZvciByZXNvbmFuY2UgICAgICAgICAgIDAtbm9uZSwgMS1vbmUgZGF5LCAyLWhhbGYgZGF5XG4gKiAgICBhdGltZSAgICAgICAtXG4gKiAgICBkMjIwMSwgZDIyMTEsIGQzMjEwLCBkMzIyMiwgZDQ0MTAsIGQ0NDIyLCBkNTIyMCwgZDUyMzIsIGQ1NDIxLCBkNTQzMyAgICAtXG4gKiAgICBkZWR0ICAgICAgICAtXG4gKiAgICBkaWR0ICAgICAgICAtXG4gKiAgICBkbWR0ICAgICAgICAtXG4gKiAgICBkbmR0ICAgICAgICAtXG4gKiAgICBkbm9kdCAgICAgICAtXG4gKiAgICBkb21kdCAgICAgICAtXG4gKiAgICBkZWwxLCBkZWwyLCBkZWwzICAgICAgICAtXG4gKiAgICBzZXMgICwgc2dobCAsIHNnaHMgLCBzZ3MgICwgc2hsICAsIHNocyAgLCBzaXMgICwgc2xzXG4gKiAgICB0aGV0YSAgICAgICAtXG4gKiAgICB4ZmFjdCAgICAgICAtXG4gKiAgICB4bGFtbyAgICAgICAtXG4gKiAgICB4bGkgICAgICAgICAtXG4gKiAgICB4bmlcbiAqXG4gKiAgbG9jYWxzICAgICAgICA6XG4gKiAgICBhaW52MiAgICAgICAtXG4gKiAgICBhb252ICAgICAgICAtXG4gKiAgICBjb3Npc3EgICAgICAtXG4gKiAgICBlb2MgICAgICAgICAtXG4gKiAgICBmMjIwLCBmMjIxLCBmMzExLCBmMzIxLCBmMzIyLCBmMzMwLCBmNDQxLCBmNDQyLCBmNTIyLCBmNTIzLCBmNTQyLCBmNTQzICAtXG4gKiAgICBnMjAwLCBnMjAxLCBnMjExLCBnMzAwLCBnMzEwLCBnMzIyLCBnNDEwLCBnNDIyLCBnNTIwLCBnNTIxLCBnNTMyLCBnNTMzICAtXG4gKiAgICBzaW5pMiAgICAgICAtXG4gKiAgICB0ZW1wICAgICAgICAtXG4gKiAgICB0ZW1wMSAgICAgICAtXG4gKiAgICB0aGV0YSAgICAgICAtXG4gKiAgICB4bm8yICAgICAgICAtXG4gKlxuICogIGNvdXBsaW5nICAgICAgOlxuICogICAgZ2V0Z3JhdmNvbnN0XG4gKlxuICogIHJlZmVyZW5jZXMgICAgOlxuICogICAgaG9vdHMsIHJvZWhyaWNoLCBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAjMyAxOTgwXG4gKiAgICBob290cywgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzYgMTk4NlxuICogICAgaG9vdHMsIHNjaHVtYWNoZXIgYW5kIGdsb3ZlciAyMDA0XG4gKiAgICB2YWxsYWRvLCBjcmF3Zm9yZCwgaHVqc2FrLCBrZWxzbyAgMjAwNlxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbmZ1bmN0aW9uIGRzaW5pdChvcHRpb25zKSB7XG4gIHZhciBjb3NpbSA9IG9wdGlvbnMuY29zaW0sXG4gICAgICBhcmdwbyA9IG9wdGlvbnMuYXJncG8sXG4gICAgICBzMSA9IG9wdGlvbnMuczEsXG4gICAgICBzMiA9IG9wdGlvbnMuczIsXG4gICAgICBzMyA9IG9wdGlvbnMuczMsXG4gICAgICBzNCA9IG9wdGlvbnMuczQsXG4gICAgICBzNSA9IG9wdGlvbnMuczUsXG4gICAgICBzaW5pbSA9IG9wdGlvbnMuc2luaW0sXG4gICAgICBzczEgPSBvcHRpb25zLnNzMSxcbiAgICAgIHNzMiA9IG9wdGlvbnMuc3MyLFxuICAgICAgc3MzID0gb3B0aW9ucy5zczMsXG4gICAgICBzczQgPSBvcHRpb25zLnNzNCxcbiAgICAgIHNzNSA9IG9wdGlvbnMuc3M1LFxuICAgICAgc3oxID0gb3B0aW9ucy5zejEsXG4gICAgICBzejMgPSBvcHRpb25zLnN6MyxcbiAgICAgIHN6MTEgPSBvcHRpb25zLnN6MTEsXG4gICAgICBzejEzID0gb3B0aW9ucy5zejEzLFxuICAgICAgc3oyMSA9IG9wdGlvbnMuc3oyMSxcbiAgICAgIHN6MjMgPSBvcHRpb25zLnN6MjMsXG4gICAgICBzejMxID0gb3B0aW9ucy5zejMxLFxuICAgICAgc3ozMyA9IG9wdGlvbnMuc3ozMyxcbiAgICAgIHQgPSBvcHRpb25zLnQsXG4gICAgICB0YyA9IG9wdGlvbnMudGMsXG4gICAgICBnc3RvID0gb3B0aW9ucy5nc3RvLFxuICAgICAgbW8gPSBvcHRpb25zLm1vLFxuICAgICAgbWRvdCA9IG9wdGlvbnMubWRvdCxcbiAgICAgIG5vID0gb3B0aW9ucy5ubyxcbiAgICAgIG5vZGVvID0gb3B0aW9ucy5ub2RlbyxcbiAgICAgIG5vZGVkb3QgPSBvcHRpb25zLm5vZGVkb3QsXG4gICAgICB4cGlkb3QgPSBvcHRpb25zLnhwaWRvdCxcbiAgICAgIHoxID0gb3B0aW9ucy56MSxcbiAgICAgIHozID0gb3B0aW9ucy56MyxcbiAgICAgIHoxMSA9IG9wdGlvbnMuejExLFxuICAgICAgejEzID0gb3B0aW9ucy56MTMsXG4gICAgICB6MjEgPSBvcHRpb25zLnoyMSxcbiAgICAgIHoyMyA9IG9wdGlvbnMuejIzLFxuICAgICAgejMxID0gb3B0aW9ucy56MzEsXG4gICAgICB6MzMgPSBvcHRpb25zLnozMyxcbiAgICAgIGVjY28gPSBvcHRpb25zLmVjY28sXG4gICAgICBlY2NzcSA9IG9wdGlvbnMuZWNjc3E7XG4gIHZhciBlbXNxID0gb3B0aW9ucy5lbXNxLFxuICAgICAgZW0gPSBvcHRpb25zLmVtLFxuICAgICAgYXJncG0gPSBvcHRpb25zLmFyZ3BtLFxuICAgICAgaW5jbG0gPSBvcHRpb25zLmluY2xtLFxuICAgICAgbW0gPSBvcHRpb25zLm1tLFxuICAgICAgbm0gPSBvcHRpb25zLm5tLFxuICAgICAgbm9kZW0gPSBvcHRpb25zLm5vZGVtLFxuICAgICAgaXJleiA9IG9wdGlvbnMuaXJleixcbiAgICAgIGF0aW1lID0gb3B0aW9ucy5hdGltZSxcbiAgICAgIGQyMjAxID0gb3B0aW9ucy5kMjIwMSxcbiAgICAgIGQyMjExID0gb3B0aW9ucy5kMjIxMSxcbiAgICAgIGQzMjEwID0gb3B0aW9ucy5kMzIxMCxcbiAgICAgIGQzMjIyID0gb3B0aW9ucy5kMzIyMixcbiAgICAgIGQ0NDEwID0gb3B0aW9ucy5kNDQxMCxcbiAgICAgIGQ0NDIyID0gb3B0aW9ucy5kNDQyMixcbiAgICAgIGQ1MjIwID0gb3B0aW9ucy5kNTIyMCxcbiAgICAgIGQ1MjMyID0gb3B0aW9ucy5kNTIzMixcbiAgICAgIGQ1NDIxID0gb3B0aW9ucy5kNTQyMSxcbiAgICAgIGQ1NDMzID0gb3B0aW9ucy5kNTQzMyxcbiAgICAgIGRlZHQgPSBvcHRpb25zLmRlZHQsXG4gICAgICBkaWR0ID0gb3B0aW9ucy5kaWR0LFxuICAgICAgZG1kdCA9IG9wdGlvbnMuZG1kdCxcbiAgICAgIGRub2R0ID0gb3B0aW9ucy5kbm9kdCxcbiAgICAgIGRvbWR0ID0gb3B0aW9ucy5kb21kdCxcbiAgICAgIGRlbDEgPSBvcHRpb25zLmRlbDEsXG4gICAgICBkZWwyID0gb3B0aW9ucy5kZWwyLFxuICAgICAgZGVsMyA9IG9wdGlvbnMuZGVsMyxcbiAgICAgIHhmYWN0ID0gb3B0aW9ucy54ZmFjdCxcbiAgICAgIHhsYW1vID0gb3B0aW9ucy54bGFtbyxcbiAgICAgIHhsaSA9IG9wdGlvbnMueGxpLFxuICAgICAgeG5pID0gb3B0aW9ucy54bmk7XG4gIHZhciBmMjIwO1xuICB2YXIgZjIyMTtcbiAgdmFyIGYzMTE7XG4gIHZhciBmMzIxO1xuICB2YXIgZjMyMjtcbiAgdmFyIGYzMzA7XG4gIHZhciBmNDQxO1xuICB2YXIgZjQ0MjtcbiAgdmFyIGY1MjI7XG4gIHZhciBmNTIzO1xuICB2YXIgZjU0MjtcbiAgdmFyIGY1NDM7XG4gIHZhciBnMjAwO1xuICB2YXIgZzIwMTtcbiAgdmFyIGcyMTE7XG4gIHZhciBnMzAwO1xuICB2YXIgZzMxMDtcbiAgdmFyIGczMjI7XG4gIHZhciBnNDEwO1xuICB2YXIgZzQyMjtcbiAgdmFyIGc1MjA7XG4gIHZhciBnNTIxO1xuICB2YXIgZzUzMjtcbiAgdmFyIGc1MzM7XG4gIHZhciBzaW5pMjtcbiAgdmFyIHRlbXA7XG4gIHZhciB0ZW1wMTtcbiAgdmFyIHhubzI7XG4gIHZhciBhaW52MjtcbiAgdmFyIGFvbnY7XG4gIHZhciBjb3Npc3E7XG4gIHZhciBlb2M7XG4gIHZhciBxMjIgPSAxLjc4OTE2NzllLTY7XG4gIHZhciBxMzEgPSAyLjE0NjA3NDhlLTY7XG4gIHZhciBxMzMgPSAyLjIxMjMwMTVlLTc7XG4gIHZhciByb290MjIgPSAxLjc4OTE2NzllLTY7XG4gIHZhciByb290NDQgPSA3LjM2MzY5NTNlLTk7XG4gIHZhciByb290NTQgPSAyLjE3NjU4MDNlLTk7XG4gIHZhciBycHRpbSA9IDQuMzc1MjY5MDg4MDExMjk5NjZlLTM7IC8vIGVxdWF0ZXMgdG8gNy4yOTIxMTUxNDY2ODg1NWUtNSByYWQvc2VjXG5cbiAgdmFyIHJvb3QzMiA9IDMuNzM5Mzc5MmUtNztcbiAgdmFyIHJvb3Q1MiA9IDEuMTQyODYzOWUtNztcbiAgdmFyIHpubCA9IDEuNTgzNTIxOGUtNDtcbiAgdmFyIHpucyA9IDEuMTk0NTllLTU7IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tIGRlZXAgc3BhY2UgaW5pdGlhbGl6YXRpb24gLS0tLS0tLS0tLS0tXG5cbiAgaXJleiA9IDA7XG5cbiAgaWYgKG5tIDwgMC4wMDUyMzU5ODc3ICYmIG5tID4gMC4wMDM0OTA2NTg1KSB7XG4gICAgaXJleiA9IDE7XG4gIH1cblxuICBpZiAobm0gPj0gOC4yNmUtMyAmJiBubSA8PSA5LjI0ZS0zICYmIGVtID49IDAuNSkge1xuICAgIGlyZXogPSAyO1xuICB9IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkbyBzb2xhciB0ZXJtcyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICB2YXIgc2VzID0gc3MxICogem5zICogc3M1O1xuICB2YXIgc2lzID0gc3MyICogem5zICogKHN6MTEgKyBzejEzKTtcbiAgdmFyIHNscyA9IC16bnMgKiBzczMgKiAoc3oxICsgc3ozIC0gMTQuMCAtIDYuMCAqIGVtc3EpO1xuICB2YXIgc2docyA9IHNzNCAqIHpucyAqIChzejMxICsgc3ozMyAtIDYuMCk7XG4gIHZhciBzaHMgPSAtem5zICogc3MyICogKHN6MjEgKyBzejIzKTsgLy8gc2dwNGZpeCBmb3IgMTgwIGRlZyBpbmNsXG5cbiAgaWYgKGluY2xtIDwgNS4yMzU5ODc3ZS0yIHx8IGluY2xtID4gcGkgLSA1LjIzNTk4NzdlLTIpIHtcbiAgICBzaHMgPSAwLjA7XG4gIH1cblxuICBpZiAoc2luaW0gIT09IDAuMCkge1xuICAgIHNocyAvPSBzaW5pbTtcbiAgfVxuXG4gIHZhciBzZ3MgPSBzZ2hzIC0gY29zaW0gKiBzaHM7IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZG8gbHVuYXIgdGVybXMgLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZGVkdCA9IHNlcyArIHMxICogem5sICogczU7XG4gIGRpZHQgPSBzaXMgKyBzMiAqIHpubCAqICh6MTEgKyB6MTMpO1xuICBkbWR0ID0gc2xzIC0gem5sICogczMgKiAoejEgKyB6MyAtIDE0LjAgLSA2LjAgKiBlbXNxKTtcbiAgdmFyIHNnaGwgPSBzNCAqIHpubCAqICh6MzEgKyB6MzMgLSA2LjApO1xuICB2YXIgc2hsbCA9IC16bmwgKiBzMiAqICh6MjEgKyB6MjMpOyAvLyBzZ3A0Zml4IGZvciAxODAgZGVnIGluY2xcblxuICBpZiAoaW5jbG0gPCA1LjIzNTk4NzdlLTIgfHwgaW5jbG0gPiBwaSAtIDUuMjM1OTg3N2UtMikge1xuICAgIHNobGwgPSAwLjA7XG4gIH1cblxuICBkb21kdCA9IHNncyArIHNnaGw7XG4gIGRub2R0ID0gc2hzO1xuXG4gIGlmIChzaW5pbSAhPT0gMC4wKSB7XG4gICAgZG9tZHQgLT0gY29zaW0gLyBzaW5pbSAqIHNobGw7XG4gICAgZG5vZHQgKz0gc2hsbCAvIHNpbmltO1xuICB9IC8vIC0tLS0tLS0tLS0tIGNhbGN1bGF0ZSBkZWVwIHNwYWNlIHJlc29uYW5jZSBlZmZlY3RzIC0tLS0tLS0tXG5cblxuICB2YXIgZG5kdCA9IDAuMDtcbiAgdmFyIHRoZXRhID0gKGdzdG8gKyB0YyAqIHJwdGltKSAlIHR3b1BpO1xuICBlbSArPSBkZWR0ICogdDtcbiAgaW5jbG0gKz0gZGlkdCAqIHQ7XG4gIGFyZ3BtICs9IGRvbWR0ICogdDtcbiAgbm9kZW0gKz0gZG5vZHQgKiB0O1xuICBtbSArPSBkbWR0ICogdDsgLy8gc2dwNGZpeCBmb3IgbmVnYXRpdmUgaW5jbGluYXRpb25zXG4gIC8vIHRoZSBmb2xsb3dpbmcgaWYgc3RhdGVtZW50IHNob3VsZCBiZSBjb21tZW50ZWQgb3V0XG4gIC8vIGlmIChpbmNsbSA8IDAuMClcbiAgLy8ge1xuICAvLyAgIGluY2xtICA9IC1pbmNsbTtcbiAgLy8gICBhcmdwbSAgPSBhcmdwbSAtIHBpO1xuICAvLyAgIG5vZGVtID0gbm9kZW0gKyBwaTtcbiAgLy8gfVxuICAvLyAtLS0tLS0tLS0tLS0tLSBpbml0aWFsaXplIHRoZSByZXNvbmFuY2UgdGVybXMgLS0tLS0tLS0tLS0tLVxuXG4gIGlmIChpcmV6ICE9PSAwKSB7XG4gICAgYW9udiA9IE1hdGgucG93KG5tIC8geGtlLCB4Mm8zKTsgLy8gLS0tLS0tLS0tLSBnZW9wb3RlbnRpYWwgcmVzb25hbmNlIGZvciAxMiBob3VyIG9yYml0cyAtLS0tLS1cblxuICAgIGlmIChpcmV6ID09PSAyKSB7XG4gICAgICBjb3Npc3EgPSBjb3NpbSAqIGNvc2ltO1xuICAgICAgdmFyIGVtbyA9IGVtO1xuICAgICAgZW0gPSBlY2NvO1xuICAgICAgdmFyIGVtc3FvID0gZW1zcTtcbiAgICAgIGVtc3EgPSBlY2NzcTtcbiAgICAgIGVvYyA9IGVtICogZW1zcTtcbiAgICAgIGcyMDEgPSAtMC4zMDYgLSAoZW0gLSAwLjY0KSAqIDAuNDQwO1xuXG4gICAgICBpZiAoZW0gPD0gMC42NSkge1xuICAgICAgICBnMjExID0gMy42MTYgLSAxMy4yNDcwICogZW0gKyAxNi4yOTAwICogZW1zcTtcbiAgICAgICAgZzMxMCA9IC0xOS4zMDIgKyAxMTcuMzkwMCAqIGVtIC0gMjI4LjQxOTAgKiBlbXNxICsgMTU2LjU5MTAgKiBlb2M7XG4gICAgICAgIGczMjIgPSAtMTguOTA2OCArIDEwOS43OTI3ICogZW0gLSAyMTQuNjMzNCAqIGVtc3EgKyAxNDYuNTgxNiAqIGVvYztcbiAgICAgICAgZzQxMCA9IC00MS4xMjIgKyAyNDIuNjk0MCAqIGVtIC0gNDcxLjA5NDAgKiBlbXNxICsgMzEzLjk1MzAgKiBlb2M7XG4gICAgICAgIGc0MjIgPSAtMTQ2LjQwNyArIDg0MS44ODAwICogZW0gLSAxNjI5LjAxNCAqIGVtc3EgKyAxMDgzLjQzNTAgKiBlb2M7XG4gICAgICAgIGc1MjAgPSAtNTMyLjExNCArIDMwMTcuOTc3ICogZW0gLSA1NzQwLjAzMiAqIGVtc3EgKyAzNzA4LjI3NjAgKiBlb2M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnMjExID0gLTcyLjA5OSArIDMzMS44MTkgKiBlbSAtIDUwOC43MzggKiBlbXNxICsgMjY2LjcyNCAqIGVvYztcbiAgICAgICAgZzMxMCA9IC0zNDYuODQ0ICsgMTU4Mi44NTEgKiBlbSAtIDI0MTUuOTI1ICogZW1zcSArIDEyNDYuMTEzICogZW9jO1xuICAgICAgICBnMzIyID0gLTM0Mi41ODUgKyAxNTU0LjkwOCAqIGVtIC0gMjM2Ni44OTkgKiBlbXNxICsgMTIxNS45NzIgKiBlb2M7XG4gICAgICAgIGc0MTAgPSAtMTA1Mi43OTcgKyA0NzU4LjY4NiAqIGVtIC0gNzE5My45OTIgKiBlbXNxICsgMzY1MS45NTcgKiBlb2M7XG4gICAgICAgIGc0MjIgPSAtMzU4MS42OTAgKyAxNjE3OC4xMTAgKiBlbSAtIDI0NDYyLjc3MCAqIGVtc3EgKyAxMjQyMi41MjAgKiBlb2M7XG5cbiAgICAgICAgaWYgKGVtID4gMC43MTUpIHtcbiAgICAgICAgICBnNTIwID0gLTUxNDkuNjYgKyAyOTkzNi45MiAqIGVtIC0gNTQwODcuMzYgKiBlbXNxICsgMzEzMjQuNTYgKiBlb2M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZzUyMCA9IDE0NjQuNzQgLSA0NjY0Ljc1ICogZW0gKyAzNzYzLjY0ICogZW1zcTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZW0gPCAwLjcpIHtcbiAgICAgICAgZzUzMyA9IC05MTkuMjI3NzAgKyA0OTg4LjYxMDAgKiBlbSAtIDkwNjQuNzcwMCAqIGVtc3EgKyA1NTQyLjIxICogZW9jO1xuICAgICAgICBnNTIxID0gLTgyMi43MTA3MiArIDQ1NjguNjE3MyAqIGVtIC0gODQ5MS40MTQ2ICogZW1zcSArIDUzMzcuNTI0ICogZW9jO1xuICAgICAgICBnNTMyID0gLTg1My42NjYwMCArIDQ2OTAuMjUwMCAqIGVtIC0gODYyNC43NzAwICogZW1zcSArIDUzNDEuNCAqIGVvYztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGc1MzMgPSAtMzc5OTUuNzgwICsgMTYxNjE2LjUyICogZW0gLSAyMjk4MzguMjAgKiBlbXNxICsgMTA5Mzc3Ljk0ICogZW9jO1xuICAgICAgICBnNTIxID0gLTUxNzUyLjEwNCArIDIxODkxMy45NSAqIGVtIC0gMzA5NDY4LjE2ICogZW1zcSArIDE0NjM0OS40MiAqIGVvYztcbiAgICAgICAgZzUzMiA9IC00MDAyMy44ODAgKyAxNzA0NzAuODkgKiBlbSAtIDI0MjY5OS40OCAqIGVtc3EgKyAxMTU2MDUuODIgKiBlb2M7XG4gICAgICB9XG5cbiAgICAgIHNpbmkyID0gc2luaW0gKiBzaW5pbTtcbiAgICAgIGYyMjAgPSAwLjc1ICogKDEuMCArIDIuMCAqIGNvc2ltICsgY29zaXNxKTtcbiAgICAgIGYyMjEgPSAxLjUgKiBzaW5pMjtcbiAgICAgIGYzMjEgPSAxLjg3NSAqIHNpbmltICogKDEuMCAtIDIuMCAqIGNvc2ltIC0gMy4wICogY29zaXNxKTtcbiAgICAgIGYzMjIgPSAtMS44NzUgKiBzaW5pbSAqICgxLjAgKyAyLjAgKiBjb3NpbSAtIDMuMCAqIGNvc2lzcSk7XG4gICAgICBmNDQxID0gMzUuMCAqIHNpbmkyICogZjIyMDtcbiAgICAgIGY0NDIgPSAzOS4zNzUwICogc2luaTIgKiBzaW5pMjtcbiAgICAgIGY1MjIgPSA5Ljg0Mzc1ICogc2luaW0gKiAoc2luaTIgKiAoMS4wIC0gMi4wICogY29zaW0gLSA1LjAgKiBjb3Npc3EpICsgMC4zMzMzMzMzMyAqICgtMi4wICsgNC4wICogY29zaW0gKyA2LjAgKiBjb3Npc3EpKTtcbiAgICAgIGY1MjMgPSBzaW5pbSAqICg0LjkyMTg3NTEyICogc2luaTIgKiAoLTIuMCAtIDQuMCAqIGNvc2ltICsgMTAuMCAqIGNvc2lzcSkgKyA2LjU2MjUwMDEyICogKDEuMCArIDIuMCAqIGNvc2ltIC0gMy4wICogY29zaXNxKSk7XG4gICAgICBmNTQyID0gMjkuNTMxMjUgKiBzaW5pbSAqICgyLjAgLSA4LjAgKiBjb3NpbSArIGNvc2lzcSAqICgtMTIuMCArIDguMCAqIGNvc2ltICsgMTAuMCAqIGNvc2lzcSkpO1xuICAgICAgZjU0MyA9IDI5LjUzMTI1ICogc2luaW0gKiAoLTIuMCAtIDguMCAqIGNvc2ltICsgY29zaXNxICogKDEyLjAgKyA4LjAgKiBjb3NpbSAtIDEwLjAgKiBjb3Npc3EpKTtcbiAgICAgIHhubzIgPSBubSAqIG5tO1xuICAgICAgYWludjIgPSBhb252ICogYW9udjtcbiAgICAgIHRlbXAxID0gMy4wICogeG5vMiAqIGFpbnYyO1xuICAgICAgdGVtcCA9IHRlbXAxICogcm9vdDIyO1xuICAgICAgZDIyMDEgPSB0ZW1wICogZjIyMCAqIGcyMDE7XG4gICAgICBkMjIxMSA9IHRlbXAgKiBmMjIxICogZzIxMTtcbiAgICAgIHRlbXAxICo9IGFvbnY7XG4gICAgICB0ZW1wID0gdGVtcDEgKiByb290MzI7XG4gICAgICBkMzIxMCA9IHRlbXAgKiBmMzIxICogZzMxMDtcbiAgICAgIGQzMjIyID0gdGVtcCAqIGYzMjIgKiBnMzIyO1xuICAgICAgdGVtcDEgKj0gYW9udjtcbiAgICAgIHRlbXAgPSAyLjAgKiB0ZW1wMSAqIHJvb3Q0NDtcbiAgICAgIGQ0NDEwID0gdGVtcCAqIGY0NDEgKiBnNDEwO1xuICAgICAgZDQ0MjIgPSB0ZW1wICogZjQ0MiAqIGc0MjI7XG4gICAgICB0ZW1wMSAqPSBhb252O1xuICAgICAgdGVtcCA9IHRlbXAxICogcm9vdDUyO1xuICAgICAgZDUyMjAgPSB0ZW1wICogZjUyMiAqIGc1MjA7XG4gICAgICBkNTIzMiA9IHRlbXAgKiBmNTIzICogZzUzMjtcbiAgICAgIHRlbXAgPSAyLjAgKiB0ZW1wMSAqIHJvb3Q1NDtcbiAgICAgIGQ1NDIxID0gdGVtcCAqIGY1NDIgKiBnNTIxO1xuICAgICAgZDU0MzMgPSB0ZW1wICogZjU0MyAqIGc1MzM7XG4gICAgICB4bGFtbyA9IChtbyArIG5vZGVvICsgbm9kZW8gLSAodGhldGEgKyB0aGV0YSkpICUgdHdvUGk7XG4gICAgICB4ZmFjdCA9IG1kb3QgKyBkbWR0ICsgMi4wICogKG5vZGVkb3QgKyBkbm9kdCAtIHJwdGltKSAtIG5vO1xuICAgICAgZW0gPSBlbW87XG4gICAgICBlbXNxID0gZW1zcW87XG4gICAgfSAvLyAgLS0tLS0tLS0tLS0tLS0tLSBzeW5jaHJvbm91cyByZXNvbmFuY2UgdGVybXMgLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgaWYgKGlyZXogPT09IDEpIHtcbiAgICAgIGcyMDAgPSAxLjAgKyBlbXNxICogKC0yLjUgKyAwLjgxMjUgKiBlbXNxKTtcbiAgICAgIGczMTAgPSAxLjAgKyAyLjAgKiBlbXNxO1xuICAgICAgZzMwMCA9IDEuMCArIGVtc3EgKiAoLTYuMCArIDYuNjA5MzcgKiBlbXNxKTtcbiAgICAgIGYyMjAgPSAwLjc1ICogKDEuMCArIGNvc2ltKSAqICgxLjAgKyBjb3NpbSk7XG4gICAgICBmMzExID0gMC45Mzc1ICogc2luaW0gKiBzaW5pbSAqICgxLjAgKyAzLjAgKiBjb3NpbSkgLSAwLjc1ICogKDEuMCArIGNvc2ltKTtcbiAgICAgIGYzMzAgPSAxLjAgKyBjb3NpbTtcbiAgICAgIGYzMzAgKj0gMS44NzUgKiBmMzMwICogZjMzMDtcbiAgICAgIGRlbDEgPSAzLjAgKiBubSAqIG5tICogYW9udiAqIGFvbnY7XG4gICAgICBkZWwyID0gMi4wICogZGVsMSAqIGYyMjAgKiBnMjAwICogcTIyO1xuICAgICAgZGVsMyA9IDMuMCAqIGRlbDEgKiBmMzMwICogZzMwMCAqIHEzMyAqIGFvbnY7XG4gICAgICBkZWwxID0gZGVsMSAqIGYzMTEgKiBnMzEwICogcTMxICogYW9udjtcbiAgICAgIHhsYW1vID0gKG1vICsgbm9kZW8gKyBhcmdwbyAtIHRoZXRhKSAlIHR3b1BpO1xuICAgICAgeGZhY3QgPSBtZG90ICsgeHBpZG90ICsgZG1kdCArIGRvbWR0ICsgZG5vZHQgLSAobm8gKyBycHRpbSk7XG4gICAgfSAvLyAgLS0tLS0tLS0tLS0tIGZvciBzZ3A0LCBpbml0aWFsaXplIHRoZSBpbnRlZ3JhdG9yIC0tLS0tLS0tLS1cblxuXG4gICAgeGxpID0geGxhbW87XG4gICAgeG5pID0gbm87XG4gICAgYXRpbWUgPSAwLjA7XG4gICAgbm0gPSBubyArIGRuZHQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVtOiBlbSxcbiAgICBhcmdwbTogYXJncG0sXG4gICAgaW5jbG06IGluY2xtLFxuICAgIG1tOiBtbSxcbiAgICBubTogbm0sXG4gICAgbm9kZW06IG5vZGVtLFxuICAgIGlyZXo6IGlyZXosXG4gICAgYXRpbWU6IGF0aW1lLFxuICAgIGQyMjAxOiBkMjIwMSxcbiAgICBkMjIxMTogZDIyMTEsXG4gICAgZDMyMTA6IGQzMjEwLFxuICAgIGQzMjIyOiBkMzIyMixcbiAgICBkNDQxMDogZDQ0MTAsXG4gICAgZDQ0MjI6IGQ0NDIyLFxuICAgIGQ1MjIwOiBkNTIyMCxcbiAgICBkNTIzMjogZDUyMzIsXG4gICAgZDU0MjE6IGQ1NDIxLFxuICAgIGQ1NDMzOiBkNTQzMyxcbiAgICBkZWR0OiBkZWR0LFxuICAgIGRpZHQ6IGRpZHQsXG4gICAgZG1kdDogZG1kdCxcbiAgICBkbmR0OiBkbmR0LFxuICAgIGRub2R0OiBkbm9kdCxcbiAgICBkb21kdDogZG9tZHQsXG4gICAgZGVsMTogZGVsMSxcbiAgICBkZWwyOiBkZWwyLFxuICAgIGRlbDM6IGRlbDMsXG4gICAgeGZhY3Q6IHhmYWN0LFxuICAgIHhsYW1vOiB4bGFtbyxcbiAgICB4bGk6IHhsaSxcbiAgICB4bmk6IHhuaVxuICB9O1xufVxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdzdGltZVxuICpcbiAqICB0aGlzIGZ1bmN0aW9uIGZpbmRzIHRoZSBncmVlbndpY2ggc2lkZXJlYWwgdGltZS5cbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAgMSBtYXIgMjAwMVxuICpcbiAqICBpbnB1dHMgICAgICAgICAgZGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgIHJhbmdlIC8gdW5pdHNcbiAqICAgIGpkdXQxICAgICAgIC0ganVsaWFuIGRhdGUgaW4gdXQxICAgICAgICAgICAgIGRheXMgZnJvbSA0NzEzIGJjXG4gKlxuICogIG91dHB1dHMgICAgICAgOlxuICogICAgZ3N0aW1lICAgICAgLSBncmVlbndpY2ggc2lkZXJlYWwgdGltZSAgICAgICAgMCB0byAycGkgcmFkXG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgdGVtcCAgICAgICAgLSB0ZW1wb3JhcnkgdmFyaWFibGUgZm9yIGRvdWJsZXMgICByYWRcbiAqICAgIHR1dDEgICAgICAgIC0ganVsaWFuIGNlbnR1cmllcyBmcm9tIHRoZVxuICogICAgICAgICAgICAgICAgICBqYW4gMSwgMjAwMCAxMiBoIGVwb2NoICh1dDEpXG4gKlxuICogIGNvdXBsaW5nICAgICAgOlxuICogICAgbm9uZVxuICpcbiAqICByZWZlcmVuY2VzICAgIDpcbiAqICAgIHZhbGxhZG8gICAgICAgMjAwNCwgMTkxLCBlcSAzLTQ1XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXG5mdW5jdGlvbiBnc3RpbWVJbnRlcm5hbChqZHV0MSkge1xuICB2YXIgdHV0MSA9IChqZHV0MSAtIDI0NTE1NDUuMCkgLyAzNjUyNS4wO1xuICB2YXIgdGVtcCA9IC02LjJlLTYgKiB0dXQxICogdHV0MSAqIHR1dDEgKyAwLjA5MzEwNCAqIHR1dDEgKiB0dXQxICsgKDg3NjYwMC4wICogMzYwMCArIDg2NDAxODQuODEyODY2KSAqIHR1dDEgKyA2NzMxMC41NDg0MTsgLy8gIyBzZWNcblxuICB0ZW1wID0gdGVtcCAqIGRlZzJyYWQgLyAyNDAuMCAlIHR3b1BpOyAvLyAzNjAvODY0MDAgPSAxLzI0MCwgdG8gZGVnLCB0byByYWRcbiAgLy8gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBjaGVjayBxdWFkcmFudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgaWYgKHRlbXAgPCAwLjApIHtcbiAgICB0ZW1wICs9IHR3b1BpO1xuICB9XG5cbiAgcmV0dXJuIHRlbXA7XG59XG5cbmZ1bmN0aW9uIGdzdGltZSgpIHtcbiAgaWYgKChhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pIGluc3RhbmNlb2YgRGF0ZSB8fCBhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiBnc3RpbWVJbnRlcm5hbChqZGF5LmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKSk7XG4gIH1cblxuICByZXR1cm4gZ3N0aW1lSW50ZXJuYWwuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xufVxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VkdXJlIGluaXRsXG4gKlxuICogIHRoaXMgcHJvY2VkdXJlIGluaXRpYWxpemVzIHRoZSBzZ3A0IHByb3BhZ2F0b3IuIGFsbCB0aGUgaW5pdGlhbGl6YXRpb24gaXNcbiAqICAgIGNvbnNvbGlkYXRlZCBoZXJlIGluc3RlYWQgb2YgaGF2aW5nIG11bHRpcGxlIGxvb3BzIGluc2lkZSBvdGhlciByb3V0aW5lcy5cbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAyOCBqdW4gMjAwNVxuICpcbiAqICBpbnB1dHMgICAgICAgIDpcbiAqICAgIGVjY28gICAgICAgIC0gZWNjZW50cmljaXR5ICAgICAgICAgICAgICAgICAgICAgICAgICAgMC4wIC0gMS4wXG4gKiAgICBlcG9jaCAgICAgICAtIGVwb2NoIHRpbWUgaW4gZGF5cyBmcm9tIGphbiAwLCAxOTUwLiAwIGhyXG4gKiAgICBpbmNsbyAgICAgICAtIGluY2xpbmF0aW9uIG9mIHNhdGVsbGl0ZVxuICogICAgbm8gICAgICAgICAgLSBtZWFuIG1vdGlvbiBvZiBzYXRlbGxpdGVcbiAqICAgIHNhdG4gICAgICAgIC0gc2F0ZWxsaXRlIG51bWJlclxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIGFpbnYgICAgICAgIC0gMS4wIC8gYVxuICogICAgYW8gICAgICAgICAgLSBzZW1pIG1ham9yIGF4aXNcbiAqICAgIGNvbjQxICAgICAgIC1cbiAqICAgIGNvbjQyICAgICAgIC0gMS4wIC0gNS4wIGNvcyhpKVxuICogICAgY29zaW8gICAgICAgLSBjb3NpbmUgb2YgaW5jbGluYXRpb25cbiAqICAgIGNvc2lvMiAgICAgIC0gY29zaW8gc3F1YXJlZFxuICogICAgZWNjc3EgICAgICAgLSBlY2NlbnRyaWNpdHkgc3F1YXJlZFxuICogICAgbWV0aG9kICAgICAgLSBmbGFnIGZvciBkZWVwIHNwYWNlICAgICAgICAgICAgICAgICAgICAnZCcsICduJ1xuICogICAgb21lb3NxICAgICAgLSAxLjAgLSBlY2NvICogZWNjb1xuICogICAgcG9zcSAgICAgICAgLSBzZW1pLXBhcmFtZXRlciBzcXVhcmVkXG4gKiAgICBycCAgICAgICAgICAtIHJhZGl1cyBvZiBwZXJpZ2VlXG4gKiAgICBydGVvc3EgICAgICAtIHNxdWFyZSByb290IG9mICgxLjAgLSBlY2NvKmVjY28pXG4gKiAgICBzaW5pbyAgICAgICAtIHNpbmUgb2YgaW5jbGluYXRpb25cbiAqICAgIGdzdG8gICAgICAgIC0gZ3N0IGF0IHRpbWUgb2Ygb2JzZXJ2YXRpb24gICAgICAgICAgICAgICByYWRcbiAqICAgIG5vICAgICAgICAgIC0gbWVhbiBtb3Rpb24gb2Ygc2F0ZWxsaXRlXG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgYWsgICAgICAgICAgLVxuICogICAgZDEgICAgICAgICAgLVxuICogICAgZGVsICAgICAgICAgLVxuICogICAgYWRlbCAgICAgICAgLVxuICogICAgcG8gICAgICAgICAgLVxuICpcbiAqICBjb3VwbGluZyAgICAgIDpcbiAqICAgIGdldGdyYXZjb25zdFxuICogICAgZ3N0aW1lICAgICAgLSBmaW5kIGdyZWVud2ljaCBzaWRlcmVhbCB0aW1lIGZyb20gdGhlIGp1bGlhbiBkYXRlXG4gKlxuICogIHJlZmVyZW5jZXMgICAgOlxuICogICAgaG9vdHMsIHJvZWhyaWNoLCBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAjMyAxOTgwXG4gKiAgICBob290cywgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzYgMTk4NlxuICogICAgaG9vdHMsIHNjaHVtYWNoZXIgYW5kIGdsb3ZlciAyMDA0XG4gKiAgICB2YWxsYWRvLCBjcmF3Zm9yZCwgaHVqc2FrLCBrZWxzbyAgMjAwNlxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbmZ1bmN0aW9uIGluaXRsKG9wdGlvbnMpIHtcbiAgdmFyIGVjY28gPSBvcHRpb25zLmVjY28sXG4gICAgICBlcG9jaCA9IG9wdGlvbnMuZXBvY2gsXG4gICAgICBpbmNsbyA9IG9wdGlvbnMuaW5jbG8sXG4gICAgICBvcHNtb2RlID0gb3B0aW9ucy5vcHNtb2RlO1xuICB2YXIgbm8gPSBvcHRpb25zLm5vOyAvLyBzZ3A0Zml4IHVzZSBvbGQgd2F5IG9mIGZpbmRpbmcgZ3N0XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGVhcnRoIGNvbnN0YW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gc2dwNGZpeCBpZGVudGlmeSBjb25zdGFudHMgYW5kIGFsbG93IGFsdGVybmF0ZSB2YWx1ZXNcbiAgLy8gLS0tLS0tLS0tLS0tLSBjYWxjdWxhdGUgYXV4aWxsYXJ5IGVwb2NoIHF1YW50aXRpZXMgLS0tLS0tLS0tLVxuXG4gIHZhciBlY2NzcSA9IGVjY28gKiBlY2NvO1xuICB2YXIgb21lb3NxID0gMS4wIC0gZWNjc3E7XG4gIHZhciBydGVvc3EgPSBNYXRoLnNxcnQob21lb3NxKTtcbiAgdmFyIGNvc2lvID0gTWF0aC5jb3MoaW5jbG8pO1xuICB2YXIgY29zaW8yID0gY29zaW8gKiBjb3NpbzsgLy8gLS0tLS0tLS0tLS0tLS0tLS0tIHVuLWtvemFpIHRoZSBtZWFuIG1vdGlvbiAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBhayA9IE1hdGgucG93KHhrZSAvIG5vLCB4Mm8zKTtcbiAgdmFyIGQxID0gMC43NSAqIGoyICogKDMuMCAqIGNvc2lvMiAtIDEuMCkgLyAocnRlb3NxICogb21lb3NxKTtcbiAgdmFyIGRlbFByaW1lID0gZDEgLyAoYWsgKiBhayk7XG4gIHZhciBhZGVsID0gYWsgKiAoMS4wIC0gZGVsUHJpbWUgKiBkZWxQcmltZSAtIGRlbFByaW1lICogKDEuMCAvIDMuMCArIDEzNC4wICogZGVsUHJpbWUgKiBkZWxQcmltZSAvIDgxLjApKTtcbiAgZGVsUHJpbWUgPSBkMSAvIChhZGVsICogYWRlbCk7XG4gIG5vIC89IDEuMCArIGRlbFByaW1lO1xuICB2YXIgYW8gPSBNYXRoLnBvdyh4a2UgLyBubywgeDJvMyk7XG4gIHZhciBzaW5pbyA9IE1hdGguc2luKGluY2xvKTtcbiAgdmFyIHBvID0gYW8gKiBvbWVvc3E7XG4gIHZhciBjb240MiA9IDEuMCAtIDUuMCAqIGNvc2lvMjtcbiAgdmFyIGNvbjQxID0gLWNvbjQyIC0gY29zaW8yIC0gY29zaW8yO1xuICB2YXIgYWludiA9IDEuMCAvIGFvO1xuICB2YXIgcG9zcSA9IHBvICogcG87XG4gIHZhciBycCA9IGFvICogKDEuMCAtIGVjY28pO1xuICB2YXIgbWV0aG9kID0gJ24nOyAvLyAgc2dwNGZpeCBtb2Rlcm4gYXBwcm9hY2ggdG8gZmluZGluZyBzaWRlcmVhbCB0aW1lXG5cbiAgdmFyIGdzdG87XG5cbiAgaWYgKG9wc21vZGUgPT09ICdhJykge1xuICAgIC8vICBzZ3A0Zml4IHVzZSBvbGQgd2F5IG9mIGZpbmRpbmcgZ3N0XG4gICAgLy8gIGNvdW50IGludGVnZXIgbnVtYmVyIG9mIGRheXMgZnJvbSAwIGphbiAxOTcwXG4gICAgdmFyIHRzNzAgPSBlcG9jaCAtIDczMDUuMDtcbiAgICB2YXIgZHM3MCA9IE1hdGguZmxvb3IodHM3MCArIDEuMGUtOCk7XG4gICAgdmFyIHRmcmFjID0gdHM3MCAtIGRzNzA7IC8vICBmaW5kIGdyZWVud2ljaCBsb2NhdGlvbiBhdCBlcG9jaFxuXG4gICAgdmFyIGMxID0gMS43MjAyNzkxNjk0MDcwMzYzOWUtMjtcbiAgICB2YXIgdGhncjcwID0gMS43MzIxMzQzODU2NTA5Mzc0O1xuICAgIHZhciBmazVyID0gNS4wNzU1MTQxOTQzMjI2OTQ0MmUtMTU7XG4gICAgdmFyIGMxcDJwID0gYzEgKyB0d29QaTtcbiAgICBnc3RvID0gKHRoZ3I3MCArIGMxICogZHM3MCArIGMxcDJwICogdGZyYWMgKyB0czcwICogdHM3MCAqIGZrNXIpICUgdHdvUGk7XG5cbiAgICBpZiAoZ3N0byA8IDAuMCkge1xuICAgICAgZ3N0byArPSB0d29QaTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZ3N0byA9IGdzdGltZShlcG9jaCArIDI0MzMyODEuNSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5vOiBubyxcbiAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICBhaW52OiBhaW52LFxuICAgIGFvOiBhbyxcbiAgICBjb240MTogY29uNDEsXG4gICAgY29uNDI6IGNvbjQyLFxuICAgIGNvc2lvOiBjb3NpbyxcbiAgICBjb3NpbzI6IGNvc2lvMixcbiAgICBlY2NzcTogZWNjc3EsXG4gICAgb21lb3NxOiBvbWVvc3EsXG4gICAgcG9zcTogcG9zcSxcbiAgICBycDogcnAsXG4gICAgcnRlb3NxOiBydGVvc3EsXG4gICAgc2luaW86IHNpbmlvLFxuICAgIGdzdG86IGdzdG9cbiAgfTtcbn1cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZHVyZSBkc3BhY2VcbiAqXG4gKiAgdGhpcyBwcm9jZWR1cmUgcHJvdmlkZXMgZGVlcCBzcGFjZSBjb250cmlidXRpb25zIHRvIG1lYW4gZWxlbWVudHMgZm9yXG4gKiAgICBwZXJ0dXJiaW5nIHRoaXJkIGJvZHkuICB0aGVzZSBlZmZlY3RzIGhhdmUgYmVlbiBhdmVyYWdlZCBvdmVyIG9uZVxuICogICAgcmV2b2x1dGlvbiBvZiB0aGUgc3VuIGFuZCBtb29uLiAgZm9yIGVhcnRoIHJlc29uYW5jZSBlZmZlY3RzLCB0aGVcbiAqICAgIGVmZmVjdHMgaGF2ZSBiZWVuIGF2ZXJhZ2VkIG92ZXIgbm8gcmV2b2x1dGlvbnMgb2YgdGhlIHNhdGVsbGl0ZS5cbiAqICAgIChtZWFuIG1vdGlvbilcbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAyOCBqdW4gMjAwNVxuICpcbiAqICBpbnB1dHMgICAgICAgIDpcbiAqICAgIGQyMjAxLCBkMjIxMSwgZDMyMTAsIGQzMjIyLCBkNDQxMCwgZDQ0MjIsIGQ1MjIwLCBkNTIzMiwgZDU0MjEsIGQ1NDMzIC1cbiAqICAgIGRlZHQgICAgICAgIC1cbiAqICAgIGRlbDEsIGRlbDIsIGRlbDMgIC1cbiAqICAgIGRpZHQgICAgICAgIC1cbiAqICAgIGRtZHQgICAgICAgIC1cbiAqICAgIGRub2R0ICAgICAgIC1cbiAqICAgIGRvbWR0ICAgICAgIC1cbiAqICAgIGlyZXogICAgICAgIC0gZmxhZyBmb3IgcmVzb25hbmNlICAgICAgICAgICAwLW5vbmUsIDEtb25lIGRheSwgMi1oYWxmIGRheVxuICogICAgYXJncG8gICAgICAgLSBhcmd1bWVudCBvZiBwZXJpZ2VlXG4gKiAgICBhcmdwZG90ICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWUgZG90IChyYXRlKVxuICogICAgdCAgICAgICAgICAgLSB0aW1lXG4gKiAgICB0YyAgICAgICAgICAtXG4gKiAgICBnc3RvICAgICAgICAtIGdzdFxuICogICAgeGZhY3QgICAgICAgLVxuICogICAgeGxhbW8gICAgICAgLVxuICogICAgbm8gICAgICAgICAgLSBtZWFuIG1vdGlvblxuICogICAgYXRpbWUgICAgICAgLVxuICogICAgZW0gICAgICAgICAgLSBlY2NlbnRyaWNpdHlcbiAqICAgIGZ0ICAgICAgICAgIC1cbiAqICAgIGFyZ3BtICAgICAgIC0gYXJndW1lbnQgb2YgcGVyaWdlZVxuICogICAgaW5jbG0gICAgICAgLSBpbmNsaW5hdGlvblxuICogICAgeGxpICAgICAgICAgLVxuICogICAgbW0gICAgICAgICAgLSBtZWFuIGFub21hbHlcbiAqICAgIHhuaSAgICAgICAgIC0gbWVhbiBtb3Rpb25cbiAqICAgIG5vZGVtICAgICAgIC0gcmlnaHQgYXNjZW5zaW9uIG9mIGFzY2VuZGluZyBub2RlXG4gKlxuICogIG91dHB1dHMgICAgICAgOlxuICogICAgYXRpbWUgICAgICAgLVxuICogICAgZW0gICAgICAgICAgLSBlY2NlbnRyaWNpdHlcbiAqICAgIGFyZ3BtICAgICAgIC0gYXJndW1lbnQgb2YgcGVyaWdlZVxuICogICAgaW5jbG0gICAgICAgLSBpbmNsaW5hdGlvblxuICogICAgeGxpICAgICAgICAgLVxuICogICAgbW0gICAgICAgICAgLSBtZWFuIGFub21hbHlcbiAqICAgIHhuaSAgICAgICAgIC1cbiAqICAgIG5vZGVtICAgICAgIC0gcmlnaHQgYXNjZW5zaW9uIG9mIGFzY2VuZGluZyBub2RlXG4gKiAgICBkbmR0ICAgICAgICAtXG4gKiAgICBubSAgICAgICAgICAtIG1lYW4gbW90aW9uXG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgZGVsdCAgICAgICAgLVxuICogICAgZnQgICAgICAgICAgLVxuICogICAgdGhldGEgICAgICAgLVxuICogICAgeDJsaSAgICAgICAgLVxuICogICAgeDJvbWkgICAgICAgLVxuICogICAgeGwgICAgICAgICAgLVxuICogICAgeGxkb3QgICAgICAgLVxuICogICAgeG5kZHQgICAgICAgLVxuICogICAgeG5kdCAgICAgICAgLVxuICogICAgeG9taSAgICAgICAgLVxuICpcbiAqICBjb3VwbGluZyAgICAgIDpcbiAqICAgIG5vbmUgICAgICAgIC1cbiAqXG4gKiAgcmVmZXJlbmNlcyAgICA6XG4gKiAgICBob290cywgcm9laHJpY2gsIG5vcmFkIHNwYWNldHJhY2sgcmVwb3J0ICMzIDE5ODBcbiAqICAgIGhvb3RzLCBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAjNiAxOTg2XG4gKiAgICBob290cywgc2NodW1hY2hlciBhbmQgZ2xvdmVyIDIwMDRcbiAqICAgIHZhbGxhZG8sIGNyYXdmb3JkLCBodWpzYWssIGtlbHNvICAyMDA2XG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuZnVuY3Rpb24gZHNwYWNlKG9wdGlvbnMpIHtcbiAgdmFyIGlyZXogPSBvcHRpb25zLmlyZXosXG4gICAgICBkMjIwMSA9IG9wdGlvbnMuZDIyMDEsXG4gICAgICBkMjIxMSA9IG9wdGlvbnMuZDIyMTEsXG4gICAgICBkMzIxMCA9IG9wdGlvbnMuZDMyMTAsXG4gICAgICBkMzIyMiA9IG9wdGlvbnMuZDMyMjIsXG4gICAgICBkNDQxMCA9IG9wdGlvbnMuZDQ0MTAsXG4gICAgICBkNDQyMiA9IG9wdGlvbnMuZDQ0MjIsXG4gICAgICBkNTIyMCA9IG9wdGlvbnMuZDUyMjAsXG4gICAgICBkNTIzMiA9IG9wdGlvbnMuZDUyMzIsXG4gICAgICBkNTQyMSA9IG9wdGlvbnMuZDU0MjEsXG4gICAgICBkNTQzMyA9IG9wdGlvbnMuZDU0MzMsXG4gICAgICBkZWR0ID0gb3B0aW9ucy5kZWR0LFxuICAgICAgZGVsMSA9IG9wdGlvbnMuZGVsMSxcbiAgICAgIGRlbDIgPSBvcHRpb25zLmRlbDIsXG4gICAgICBkZWwzID0gb3B0aW9ucy5kZWwzLFxuICAgICAgZGlkdCA9IG9wdGlvbnMuZGlkdCxcbiAgICAgIGRtZHQgPSBvcHRpb25zLmRtZHQsXG4gICAgICBkbm9kdCA9IG9wdGlvbnMuZG5vZHQsXG4gICAgICBkb21kdCA9IG9wdGlvbnMuZG9tZHQsXG4gICAgICBhcmdwbyA9IG9wdGlvbnMuYXJncG8sXG4gICAgICBhcmdwZG90ID0gb3B0aW9ucy5hcmdwZG90LFxuICAgICAgdCA9IG9wdGlvbnMudCxcbiAgICAgIHRjID0gb3B0aW9ucy50YyxcbiAgICAgIGdzdG8gPSBvcHRpb25zLmdzdG8sXG4gICAgICB4ZmFjdCA9IG9wdGlvbnMueGZhY3QsXG4gICAgICB4bGFtbyA9IG9wdGlvbnMueGxhbW8sXG4gICAgICBubyA9IG9wdGlvbnMubm87XG4gIHZhciBhdGltZSA9IG9wdGlvbnMuYXRpbWUsXG4gICAgICBlbSA9IG9wdGlvbnMuZW0sXG4gICAgICBhcmdwbSA9IG9wdGlvbnMuYXJncG0sXG4gICAgICBpbmNsbSA9IG9wdGlvbnMuaW5jbG0sXG4gICAgICB4bGkgPSBvcHRpb25zLnhsaSxcbiAgICAgIG1tID0gb3B0aW9ucy5tbSxcbiAgICAgIHhuaSA9IG9wdGlvbnMueG5pLFxuICAgICAgbm9kZW0gPSBvcHRpb25zLm5vZGVtLFxuICAgICAgbm0gPSBvcHRpb25zLm5tO1xuICB2YXIgZmFzeDIgPSAwLjEzMTMwOTA4O1xuICB2YXIgZmFzeDQgPSAyLjg4NDMxOTg7XG4gIHZhciBmYXN4NiA9IDAuMzc0NDgwODc7XG4gIHZhciBnMjIgPSA1Ljc2ODYzOTY7XG4gIHZhciBnMzIgPSAwLjk1MjQwODk4O1xuICB2YXIgZzQ0ID0gMS44MDE0OTk4O1xuICB2YXIgZzUyID0gMS4wNTA4MzMwO1xuICB2YXIgZzU0ID0gNC40MTA4ODk4O1xuICB2YXIgcnB0aW0gPSA0LjM3NTI2OTA4ODAxMTI5OTY2ZS0zOyAvLyBlcXVhdGVzIHRvIDcuMjkyMTE1MTQ2Njg4NTVlLTUgcmFkL3NlY1xuXG4gIHZhciBzdGVwcCA9IDcyMC4wO1xuICB2YXIgc3RlcG4gPSAtNzIwLjA7XG4gIHZhciBzdGVwMiA9IDI1OTIwMC4wO1xuICB2YXIgZGVsdDtcbiAgdmFyIHgybGk7XG4gIHZhciB4Mm9taTtcbiAgdmFyIHhsO1xuICB2YXIgeGxkb3Q7XG4gIHZhciB4bmRkdDtcbiAgdmFyIHhuZHQ7XG4gIHZhciB4b21pO1xuICB2YXIgZG5kdCA9IDAuMDtcbiAgdmFyIGZ0ID0gMC4wOyAvLyAgLS0tLS0tLS0tLS0gY2FsY3VsYXRlIGRlZXAgc3BhY2UgcmVzb25hbmNlIGVmZmVjdHMgLS0tLS0tLS0tLS1cblxuICB2YXIgdGhldGEgPSAoZ3N0byArIHRjICogcnB0aW0pICUgdHdvUGk7XG4gIGVtICs9IGRlZHQgKiB0O1xuICBpbmNsbSArPSBkaWR0ICogdDtcbiAgYXJncG0gKz0gZG9tZHQgKiB0O1xuICBub2RlbSArPSBkbm9kdCAqIHQ7XG4gIG1tICs9IGRtZHQgKiB0OyAvLyBzZ3A0Zml4IGZvciBuZWdhdGl2ZSBpbmNsaW5hdGlvbnNcbiAgLy8gdGhlIGZvbGxvd2luZyBpZiBzdGF0ZW1lbnQgc2hvdWxkIGJlIGNvbW1lbnRlZCBvdXRcbiAgLy8gaWYgKGluY2xtIDwgMC4wKVxuICAvLyB7XG4gIC8vICAgaW5jbG0gPSAtaW5jbG07XG4gIC8vICAgYXJncG0gPSBhcmdwbSAtIHBpO1xuICAvLyAgIG5vZGVtID0gbm9kZW0gKyBwaTtcbiAgLy8gfVxuXG4gIC8qIC0gdXBkYXRlIHJlc29uYW5jZXMgOiBudW1lcmljYWwgKGV1bGVyLW1hY2xhdXJpbikgaW50ZWdyYXRpb24gLSAqL1xuXG4gIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZXBvY2ggcmVzdGFydCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tICAqL1xuICAvLyAgIHNncDRmaXggZm9yIHByb3BhZ2F0b3IgcHJvYmxlbXNcbiAgLy8gICB0aGUgZm9sbG93aW5nIGludGVncmF0aW9uIHdvcmtzIGZvciBuZWdhdGl2ZSB0aW1lIHN0ZXBzIGFuZCBwZXJpb2RzXG4gIC8vICAgdGhlIHNwZWNpZmljIGNoYW5nZXMgYXJlIHVua25vd24gYmVjYXVzZSB0aGUgb3JpZ2luYWwgY29kZSB3YXMgc28gY29udm9sdXRlZFxuICAvLyBzZ3A0Zml4IHRha2Ugb3V0IGF0aW1lID0gMC4wIGFuZCBmaXggZm9yIGZhc3RlciBvcGVyYXRpb25cblxuICBpZiAoaXJleiAhPT0gMCkge1xuICAgIC8vICBzZ3A0Zml4IHN0cmVhbWxpbmUgY2hlY2tcbiAgICBpZiAoYXRpbWUgPT09IDAuMCB8fCB0ICogYXRpbWUgPD0gMC4wIHx8IE1hdGguYWJzKHQpIDwgTWF0aC5hYnMoYXRpbWUpKSB7XG4gICAgICBhdGltZSA9IDAuMDtcbiAgICAgIHhuaSA9IG5vO1xuICAgICAgeGxpID0geGxhbW87XG4gICAgfSAvLyBzZ3A0Zml4IG1vdmUgY2hlY2sgb3V0c2lkZSBsb29wXG5cblxuICAgIGlmICh0ID4gMC4wKSB7XG4gICAgICBkZWx0ID0gc3RlcHA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbHQgPSBzdGVwbjtcbiAgICB9XG5cbiAgICB2YXIgaXJldG4gPSAzODE7IC8vIGFkZGVkIGZvciBkbyBsb29wXG5cbiAgICB3aGlsZSAoaXJldG4gPT09IDM4MSkge1xuICAgICAgLy8gIC0tLS0tLS0tLS0tLS0tLS0tLS0gZG90IHRlcm1zIGNhbGN1bGF0ZWQgLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gIC0tLS0tLS0tLS0tIG5lYXIgLSBzeW5jaHJvbm91cyByZXNvbmFuY2UgdGVybXMgLS0tLS0tLVxuICAgICAgaWYgKGlyZXogIT09IDIpIHtcbiAgICAgICAgeG5kdCA9IGRlbDEgKiBNYXRoLnNpbih4bGkgLSBmYXN4MikgKyBkZWwyICogTWF0aC5zaW4oMi4wICogKHhsaSAtIGZhc3g0KSkgKyBkZWwzICogTWF0aC5zaW4oMy4wICogKHhsaSAtIGZhc3g2KSk7XG4gICAgICAgIHhsZG90ID0geG5pICsgeGZhY3Q7XG4gICAgICAgIHhuZGR0ID0gZGVsMSAqIE1hdGguY29zKHhsaSAtIGZhc3gyKSArIDIuMCAqIGRlbDIgKiBNYXRoLmNvcygyLjAgKiAoeGxpIC0gZmFzeDQpKSArIDMuMCAqIGRlbDMgKiBNYXRoLmNvcygzLjAgKiAoeGxpIC0gZmFzeDYpKTtcbiAgICAgICAgeG5kZHQgKj0geGxkb3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAtLS0tLS0tLS0gbmVhciAtIGhhbGYtZGF5IHJlc29uYW5jZSB0ZXJtcyAtLS0tLS0tLVxuICAgICAgICB4b21pID0gYXJncG8gKyBhcmdwZG90ICogYXRpbWU7XG4gICAgICAgIHgyb21pID0geG9taSArIHhvbWk7XG4gICAgICAgIHgybGkgPSB4bGkgKyB4bGk7XG4gICAgICAgIHhuZHQgPSBkMjIwMSAqIE1hdGguc2luKHgyb21pICsgeGxpIC0gZzIyKSArIGQyMjExICogTWF0aC5zaW4oeGxpIC0gZzIyKSArIGQzMjEwICogTWF0aC5zaW4oeG9taSArIHhsaSAtIGczMikgKyBkMzIyMiAqIE1hdGguc2luKC14b21pICsgeGxpIC0gZzMyKSArIGQ0NDEwICogTWF0aC5zaW4oeDJvbWkgKyB4MmxpIC0gZzQ0KSArIGQ0NDIyICogTWF0aC5zaW4oeDJsaSAtIGc0NCkgKyBkNTIyMCAqIE1hdGguc2luKHhvbWkgKyB4bGkgLSBnNTIpICsgZDUyMzIgKiBNYXRoLnNpbigteG9taSArIHhsaSAtIGc1MikgKyBkNTQyMSAqIE1hdGguc2luKHhvbWkgKyB4MmxpIC0gZzU0KSArIGQ1NDMzICogTWF0aC5zaW4oLXhvbWkgKyB4MmxpIC0gZzU0KTtcbiAgICAgICAgeGxkb3QgPSB4bmkgKyB4ZmFjdDtcbiAgICAgICAgeG5kZHQgPSBkMjIwMSAqIE1hdGguY29zKHgyb21pICsgeGxpIC0gZzIyKSArIGQyMjExICogTWF0aC5jb3MoeGxpIC0gZzIyKSArIGQzMjEwICogTWF0aC5jb3MoeG9taSArIHhsaSAtIGczMikgKyBkMzIyMiAqIE1hdGguY29zKC14b21pICsgeGxpIC0gZzMyKSArIGQ1MjIwICogTWF0aC5jb3MoeG9taSArIHhsaSAtIGc1MikgKyBkNTIzMiAqIE1hdGguY29zKC14b21pICsgeGxpIC0gZzUyKSArIDIuMCAqIGQ0NDEwICogTWF0aC5jb3MoeDJvbWkgKyB4MmxpIC0gZzQ0KSArIGQ0NDIyICogTWF0aC5jb3MoeDJsaSAtIGc0NCkgKyBkNTQyMSAqIE1hdGguY29zKHhvbWkgKyB4MmxpIC0gZzU0KSArIGQ1NDMzICogTWF0aC5jb3MoLXhvbWkgKyB4MmxpIC0gZzU0KTtcbiAgICAgICAgeG5kZHQgKj0geGxkb3Q7XG4gICAgICB9IC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBpbnRlZ3JhdG9yIC0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vICBzZ3A0Zml4IG1vdmUgZW5kIGNoZWNrcyB0byBlbmQgb2Ygcm91dGluZVxuXG5cbiAgICAgIGlmIChNYXRoLmFicyh0IC0gYXRpbWUpID49IHN0ZXBwKSB7XG4gICAgICAgIGlyZXRuID0gMzgxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnQgPSB0IC0gYXRpbWU7XG4gICAgICAgIGlyZXRuID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKGlyZXRuID09PSAzODEpIHtcbiAgICAgICAgeGxpICs9IHhsZG90ICogZGVsdCArIHhuZHQgKiBzdGVwMjtcbiAgICAgICAgeG5pICs9IHhuZHQgKiBkZWx0ICsgeG5kZHQgKiBzdGVwMjtcbiAgICAgICAgYXRpbWUgKz0gZGVsdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBubSA9IHhuaSArIHhuZHQgKiBmdCArIHhuZGR0ICogZnQgKiBmdCAqIDAuNTtcbiAgICB4bCA9IHhsaSArIHhsZG90ICogZnQgKyB4bmR0ICogZnQgKiBmdCAqIDAuNTtcblxuICAgIGlmIChpcmV6ICE9PSAxKSB7XG4gICAgICBtbSA9IHhsIC0gMi4wICogbm9kZW0gKyAyLjAgKiB0aGV0YTtcbiAgICAgIGRuZHQgPSBubSAtIG5vO1xuICAgIH0gZWxzZSB7XG4gICAgICBtbSA9IHhsIC0gbm9kZW0gLSBhcmdwbSArIHRoZXRhO1xuICAgICAgZG5kdCA9IG5tIC0gbm87XG4gICAgfVxuXG4gICAgbm0gPSBubyArIGRuZHQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGF0aW1lOiBhdGltZSxcbiAgICBlbTogZW0sXG4gICAgYXJncG06IGFyZ3BtLFxuICAgIGluY2xtOiBpbmNsbSxcbiAgICB4bGk6IHhsaSxcbiAgICBtbTogbW0sXG4gICAgeG5pOiB4bmksXG4gICAgbm9kZW06IG5vZGVtLFxuICAgIGRuZHQ6IGRuZHQsXG4gICAgbm06IG5tXG4gIH07XG59XG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VkdXJlIHNncDRcbiAqXG4gKiAgdGhpcyBwcm9jZWR1cmUgaXMgdGhlIHNncDQgcHJlZGljdGlvbiBtb2RlbCBmcm9tIHNwYWNlIGNvbW1hbmQuIHRoaXMgaXMgYW5cbiAqICAgIHVwZGF0ZWQgYW5kIGNvbWJpbmVkIHZlcnNpb24gb2Ygc2dwNCBhbmQgc2RwNCwgd2hpY2ggd2VyZSBvcmlnaW5hbGx5XG4gKiAgICBwdWJsaXNoZWQgc2VwYXJhdGVseSBpbiBzcGFjZXRyYWNrIHJlcG9ydCAvLzMuIHRoaXMgdmVyc2lvbiBmb2xsb3dzIHRoZVxuICogICAgbWV0aG9kb2xvZ3kgZnJvbSB0aGUgYWlhYSBwYXBlciAoMjAwNikgZGVzY3JpYmluZyB0aGUgaGlzdG9yeSBhbmRcbiAqICAgIGRldmVsb3BtZW50IG9mIHRoZSBjb2RlLlxuICpcbiAqICBhdXRob3IgICAgICAgIDogZGF2aWQgdmFsbGFkbyAgICAgICAgICAgICAgICAgIDcxOS01NzMtMjYwMCAgIDI4IGp1biAyMDA1XG4gKlxuICogIGlucHV0cyAgICAgICAgOlxuICogICAgc2F0cmVjICAtIGluaXRpYWxpc2VkIHN0cnVjdHVyZSBmcm9tIHNncDRpbml0KCkgY2FsbC5cbiAqICAgIHRzaW5jZSAgLSB0aW1lIHNpbmNlIGVwb2NoIChtaW51dGVzKVxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIHIgICAgICAgICAgIC0gcG9zaXRpb24gdmVjdG9yICAgICAgICAgICAgICAgICAgICAga21cbiAqICAgIHYgICAgICAgICAgIC0gdmVsb2NpdHkgICAgICAgICAgICAgICAgICAgICAgICAgICAga20vc2VjXG4gKiAgcmV0dXJuIGNvZGUgLSBub24temVybyBvbiBlcnJvci5cbiAqICAgICAgICAgICAgICAgICAgIDEgLSBtZWFuIGVsZW1lbnRzLCBlY2MgPj0gMS4wIG9yIGVjYyA8IC0wLjAwMSBvciBhIDwgMC45NSBlclxuICogICAgICAgICAgICAgICAgICAgMiAtIG1lYW4gbW90aW9uIGxlc3MgdGhhbiAwLjBcbiAqICAgICAgICAgICAgICAgICAgIDMgLSBwZXJ0IGVsZW1lbnRzLCBlY2MgPCAwLjAgIG9yICBlY2MgPiAxLjBcbiAqICAgICAgICAgICAgICAgICAgIDQgLSBzZW1pLWxhdHVzIHJlY3R1bSA8IDAuMFxuICogICAgICAgICAgICAgICAgICAgNSAtIGVwb2NoIGVsZW1lbnRzIGFyZSBzdWItb3JiaXRhbFxuICogICAgICAgICAgICAgICAgICAgNiAtIHNhdGVsbGl0ZSBoYXMgZGVjYXllZFxuICpcbiAqICBsb2NhbHMgICAgICAgIDpcbiAqICAgIGFtICAgICAgICAgIC1cbiAqICAgIGF4bmwsIGF5bmwgICAgICAgIC1cbiAqICAgIGJldGFsICAgICAgIC1cbiAqICAgIGNvc2ltICAgLCBzaW5pbSAgICwgY29zb21tICAsIHNpbm9tbSAgLCBjbm9kICAgICwgc25vZCAgICAsIGNvczJ1ICAgLFxuICogICAgc2luMnUgICAsIGNvc2VvMSAgLCBzaW5lbzEgICwgY29zaSAgICAsIHNpbmkgICAgLCBjb3NpcCAgICwgc2luaXAgICAsXG4gKiAgICBjb3Npc3EgICwgY29zc3UgICAsIHNpbnN1ICAgLCBjb3N1ICAgICwgc2ludVxuICogICAgZGVsbSAgICAgICAgLVxuICogICAgZGVsb21nICAgICAgLVxuICogICAgZG5kdCAgICAgICAgLVxuICogICAgZWNjbSAgICAgICAgLVxuICogICAgZW1zcSAgICAgICAgLVxuICogICAgZWNvc2UgICAgICAgLVxuICogICAgZWwyICAgICAgICAgLVxuICogICAgZW8xICAgICAgICAgLVxuICogICAgZWNjcCAgICAgICAgLVxuICogICAgZXNpbmUgICAgICAgLVxuICogICAgYXJncG0gICAgICAgLVxuICogICAgYXJncHAgICAgICAgLVxuICogICAgb21nYWRmICAgICAgLVxuICogICAgcGwgICAgICAgICAgLVxuICogICAgciAgICAgICAgICAgLVxuICogICAgcnRlbXNxICAgICAgLVxuICogICAgcmRvdGwgICAgICAgLVxuICogICAgcmwgICAgICAgICAgLVxuICogICAgcnZkb3QgICAgICAgLVxuICogICAgcnZkb3RsICAgICAgLVxuICogICAgc3UgICAgICAgICAgLVxuICogICAgdDIgICwgdDMgICAsIHQ0ICAgICwgdGNcbiAqICAgIHRlbTUsIHRlbXAgLCB0ZW1wMSAsIHRlbXAyICAsIHRlbXBhICAsIHRlbXBlICAsIHRlbXBsXG4gKiAgICB1ICAgLCB1eCAgICwgdXkgICAgLCB1eiAgICAgLCB2eCAgICAgLCB2eSAgICAgLCB2elxuICogICAgaW5jbG0gICAgICAgLSBpbmNsaW5hdGlvblxuICogICAgbW0gICAgICAgICAgLSBtZWFuIGFub21hbHlcbiAqICAgIG5tICAgICAgICAgIC0gbWVhbiBtb3Rpb25cbiAqICAgIG5vZGVtICAgICAgIC0gcmlnaHQgYXNjIG9mIGFzY2VuZGluZyBub2RlXG4gKiAgICB4aW5jICAgICAgICAtXG4gKiAgICB4aW5jcCAgICAgICAtXG4gKiAgICB4bCAgICAgICAgICAtXG4gKiAgICB4bG0gICAgICAgICAtXG4gKiAgICBtcCAgICAgICAgICAtXG4gKiAgICB4bWRmICAgICAgICAtXG4gKiAgICB4bXggICAgICAgICAtXG4gKiAgICB4bXkgICAgICAgICAtXG4gKiAgICBub2RlZGYgICAgICAtXG4gKiAgICB4bm9kZSAgICAgICAtXG4gKiAgICBub2RlcCAgICAgICAtXG4gKiAgICBucCAgICAgICAgICAtXG4gKlxuICogIGNvdXBsaW5nICAgICAgOlxuICogICAgZ2V0Z3JhdmNvbnN0LVxuICogICAgZHBwZXJcbiAqICAgIGRzcGFjZVxuICpcbiAqICByZWZlcmVuY2VzICAgIDpcbiAqICAgIGhvb3RzLCByb2VocmljaCwgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgLy8zIDE5ODBcbiAqICAgIGhvb3RzLCBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAvLzYgMTk4NlxuICogICAgaG9vdHMsIHNjaHVtYWNoZXIgYW5kIGdsb3ZlciAyMDA0XG4gKiAgICB2YWxsYWRvLCBjcmF3Zm9yZCwgaHVqc2FrLCBrZWxzbyAgMjAwNlxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbmZ1bmN0aW9uIHNncDQoc2F0cmVjLCB0c2luY2UpIHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbiAgdmFyIGNvc2VvMTtcbiAgdmFyIHNpbmVvMTtcbiAgdmFyIGNvc2lwO1xuICB2YXIgc2luaXA7XG4gIHZhciBjb3Npc3E7XG4gIHZhciBkZWxtO1xuICB2YXIgZGVsb21nO1xuICB2YXIgZW8xO1xuICB2YXIgYXJncG07XG4gIHZhciBhcmdwcDtcbiAgdmFyIHN1O1xuICB2YXIgdDM7XG4gIHZhciB0NDtcbiAgdmFyIHRjO1xuICB2YXIgdGVtNTtcbiAgdmFyIHRlbXA7XG4gIHZhciB0ZW1wYTtcbiAgdmFyIHRlbXBlO1xuICB2YXIgdGVtcGw7XG4gIHZhciBpbmNsbTtcbiAgdmFyIG1tO1xuICB2YXIgbm07XG4gIHZhciBub2RlbTtcbiAgdmFyIHhpbmNwO1xuICB2YXIgeGxtO1xuICB2YXIgbXA7XG4gIHZhciBub2RlcDtcbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tIHNldCBtYXRoZW1hdGljYWwgY29uc3RhbnRzIC0tLS0tLS0tLS0tLS0tLSAqL1xuICAvLyBzZ3A0Zml4IGRpdmlzb3IgZm9yIGRpdmlkZSBieSB6ZXJvIGNoZWNrIG9uIGluY2xpbmF0aW9uXG4gIC8vIHRoZSBvbGQgY2hlY2sgdXNlZCAxLjAgKyBjb3MocGktMS4wZS05KSwgYnV0IHRoZW4gY29tcGFyZWQgaXQgdG9cbiAgLy8gMS41IGUtMTIsIHNvIHRoZSB0aHJlc2hvbGQgd2FzIGNoYW5nZWQgdG8gMS41ZS0xMiBmb3IgY29uc2lzdGVuY3lcblxuICB2YXIgdGVtcDQgPSAxLjVlLTEyOyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gY2xlYXIgc2dwNCBlcnJvciBmbGFnIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2F0cmVjLnQgPSB0c2luY2U7XG4gIHNhdHJlYy5lcnJvciA9IDA7IC8vICAtLS0tLS0tIHVwZGF0ZSBmb3Igc2VjdWxhciBncmF2aXR5IGFuZCBhdG1vc3BoZXJpYyBkcmFnIC0tLS0tXG5cbiAgdmFyIHhtZGYgPSBzYXRyZWMubW8gKyBzYXRyZWMubWRvdCAqIHNhdHJlYy50O1xuICB2YXIgYXJncGRmID0gc2F0cmVjLmFyZ3BvICsgc2F0cmVjLmFyZ3Bkb3QgKiBzYXRyZWMudDtcbiAgdmFyIG5vZGVkZiA9IHNhdHJlYy5ub2RlbyArIHNhdHJlYy5ub2RlZG90ICogc2F0cmVjLnQ7XG4gIGFyZ3BtID0gYXJncGRmO1xuICBtbSA9IHhtZGY7XG4gIHZhciB0MiA9IHNhdHJlYy50ICogc2F0cmVjLnQ7XG4gIG5vZGVtID0gbm9kZWRmICsgc2F0cmVjLm5vZGVjZiAqIHQyO1xuICB0ZW1wYSA9IDEuMCAtIHNhdHJlYy5jYzEgKiBzYXRyZWMudDtcbiAgdGVtcGUgPSBzYXRyZWMuYnN0YXIgKiBzYXRyZWMuY2M0ICogc2F0cmVjLnQ7XG4gIHRlbXBsID0gc2F0cmVjLnQyY29mICogdDI7XG5cbiAgaWYgKHNhdHJlYy5pc2ltcCAhPT0gMSkge1xuICAgIGRlbG9tZyA9IHNhdHJlYy5vbWdjb2YgKiBzYXRyZWMudDsgLy8gIHNncDRmaXggdXNlIG11dGxpcGx5IGZvciBzcGVlZCBpbnN0ZWFkIG9mIHBvd1xuXG4gICAgdmFyIGRlbG10ZW1wID0gMS4wICsgc2F0cmVjLmV0YSAqIE1hdGguY29zKHhtZGYpO1xuICAgIGRlbG0gPSBzYXRyZWMueG1jb2YgKiAoZGVsbXRlbXAgKiBkZWxtdGVtcCAqIGRlbG10ZW1wIC0gc2F0cmVjLmRlbG1vKTtcbiAgICB0ZW1wID0gZGVsb21nICsgZGVsbTtcbiAgICBtbSA9IHhtZGYgKyB0ZW1wO1xuICAgIGFyZ3BtID0gYXJncGRmIC0gdGVtcDtcbiAgICB0MyA9IHQyICogc2F0cmVjLnQ7XG4gICAgdDQgPSB0MyAqIHNhdHJlYy50O1xuICAgIHRlbXBhID0gdGVtcGEgLSBzYXRyZWMuZDIgKiB0MiAtIHNhdHJlYy5kMyAqIHQzIC0gc2F0cmVjLmQ0ICogdDQ7XG4gICAgdGVtcGUgKz0gc2F0cmVjLmJzdGFyICogc2F0cmVjLmNjNSAqIChNYXRoLnNpbihtbSkgLSBzYXRyZWMuc2lubWFvKTtcbiAgICB0ZW1wbCA9IHRlbXBsICsgc2F0cmVjLnQzY29mICogdDMgKyB0NCAqIChzYXRyZWMudDRjb2YgKyBzYXRyZWMudCAqIHNhdHJlYy50NWNvZik7XG4gIH1cblxuICBubSA9IHNhdHJlYy5ubztcbiAgdmFyIGVtID0gc2F0cmVjLmVjY287XG4gIGluY2xtID0gc2F0cmVjLmluY2xvO1xuXG4gIGlmIChzYXRyZWMubWV0aG9kID09PSAnZCcpIHtcbiAgICB0YyA9IHNhdHJlYy50O1xuICAgIHZhciBkc3BhY2VPcHRpb25zID0ge1xuICAgICAgaXJlejogc2F0cmVjLmlyZXosXG4gICAgICBkMjIwMTogc2F0cmVjLmQyMjAxLFxuICAgICAgZDIyMTE6IHNhdHJlYy5kMjIxMSxcbiAgICAgIGQzMjEwOiBzYXRyZWMuZDMyMTAsXG4gICAgICBkMzIyMjogc2F0cmVjLmQzMjIyLFxuICAgICAgZDQ0MTA6IHNhdHJlYy5kNDQxMCxcbiAgICAgIGQ0NDIyOiBzYXRyZWMuZDQ0MjIsXG4gICAgICBkNTIyMDogc2F0cmVjLmQ1MjIwLFxuICAgICAgZDUyMzI6IHNhdHJlYy5kNTIzMixcbiAgICAgIGQ1NDIxOiBzYXRyZWMuZDU0MjEsXG4gICAgICBkNTQzMzogc2F0cmVjLmQ1NDMzLFxuICAgICAgZGVkdDogc2F0cmVjLmRlZHQsXG4gICAgICBkZWwxOiBzYXRyZWMuZGVsMSxcbiAgICAgIGRlbDI6IHNhdHJlYy5kZWwyLFxuICAgICAgZGVsMzogc2F0cmVjLmRlbDMsXG4gICAgICBkaWR0OiBzYXRyZWMuZGlkdCxcbiAgICAgIGRtZHQ6IHNhdHJlYy5kbWR0LFxuICAgICAgZG5vZHQ6IHNhdHJlYy5kbm9kdCxcbiAgICAgIGRvbWR0OiBzYXRyZWMuZG9tZHQsXG4gICAgICBhcmdwbzogc2F0cmVjLmFyZ3BvLFxuICAgICAgYXJncGRvdDogc2F0cmVjLmFyZ3Bkb3QsXG4gICAgICB0OiBzYXRyZWMudCxcbiAgICAgIHRjOiB0YyxcbiAgICAgIGdzdG86IHNhdHJlYy5nc3RvLFxuICAgICAgeGZhY3Q6IHNhdHJlYy54ZmFjdCxcbiAgICAgIHhsYW1vOiBzYXRyZWMueGxhbW8sXG4gICAgICBubzogc2F0cmVjLm5vLFxuICAgICAgYXRpbWU6IHNhdHJlYy5hdGltZSxcbiAgICAgIGVtOiBlbSxcbiAgICAgIGFyZ3BtOiBhcmdwbSxcbiAgICAgIGluY2xtOiBpbmNsbSxcbiAgICAgIHhsaTogc2F0cmVjLnhsaSxcbiAgICAgIG1tOiBtbSxcbiAgICAgIHhuaTogc2F0cmVjLnhuaSxcbiAgICAgIG5vZGVtOiBub2RlbSxcbiAgICAgIG5tOiBubVxuICAgIH07XG4gICAgdmFyIGRzcGFjZVJlc3VsdCA9IGRzcGFjZShkc3BhY2VPcHRpb25zKTtcbiAgICBlbSA9IGRzcGFjZVJlc3VsdC5lbTtcbiAgICBhcmdwbSA9IGRzcGFjZVJlc3VsdC5hcmdwbTtcbiAgICBpbmNsbSA9IGRzcGFjZVJlc3VsdC5pbmNsbTtcbiAgICBtbSA9IGRzcGFjZVJlc3VsdC5tbTtcbiAgICBub2RlbSA9IGRzcGFjZVJlc3VsdC5ub2RlbTtcbiAgICBubSA9IGRzcGFjZVJlc3VsdC5ubTtcbiAgfVxuXG4gIGlmIChubSA8PSAwLjApIHtcbiAgICAvLyBwcmludGYoXCIvLyBlcnJvciBubSAlZlxcblwiLCBubSk7XG4gICAgc2F0cmVjLmVycm9yID0gMjsgLy8gc2dwNGZpeCBhZGQgcmV0dXJuXG5cbiAgICByZXR1cm4gW2ZhbHNlLCBmYWxzZV07XG4gIH1cblxuICB2YXIgYW0gPSBNYXRoLnBvdyh4a2UgLyBubSwgeDJvMykgKiB0ZW1wYSAqIHRlbXBhO1xuICBubSA9IHhrZSAvIE1hdGgucG93KGFtLCAxLjUpO1xuICBlbSAtPSB0ZW1wZTsgLy8gZml4IHRvbGVyYW5jZSBmb3IgZXJyb3IgcmVjb2duaXRpb25cbiAgLy8gc2dwNGZpeCBhbSBpcyBmaXhlZCBmcm9tIHRoZSBwcmV2aW91cyBubSBjaGVja1xuXG4gIGlmIChlbSA+PSAxLjAgfHwgZW0gPCAtMC4wMDEpIHtcbiAgICAvLyB8fCAoYW0gPCAwLjk1KVxuICAgIC8vIHByaW50ZihcIi8vIGVycm9yIGVtICVmXFxuXCIsIGVtKTtcbiAgICBzYXRyZWMuZXJyb3IgPSAxOyAvLyBzZ3A0Zml4IHRvIHJldHVybiBpZiB0aGVyZSBpcyBhbiBlcnJvciBpbiBlY2NlbnRyaWNpdHlcblxuICAgIHJldHVybiBbZmFsc2UsIGZhbHNlXTtcbiAgfSAvLyAgc2dwNGZpeCBmaXggdG9sZXJhbmNlIHRvIGF2b2lkIGEgZGl2aWRlIGJ5IHplcm9cblxuXG4gIGlmIChlbSA8IDEuMGUtNikge1xuICAgIGVtID0gMS4wZS02O1xuICB9XG5cbiAgbW0gKz0gc2F0cmVjLm5vICogdGVtcGw7XG4gIHhsbSA9IG1tICsgYXJncG0gKyBub2RlbTtcbiAgbm9kZW0gJT0gdHdvUGk7XG4gIGFyZ3BtICU9IHR3b1BpO1xuICB4bG0gJT0gdHdvUGk7XG4gIG1tID0gKHhsbSAtIGFyZ3BtIC0gbm9kZW0pICUgdHdvUGk7IC8vIC0tLS0tLS0tLS0tLS0tLS0tIGNvbXB1dGUgZXh0cmEgbWVhbiBxdWFudGl0aWVzIC0tLS0tLS0tLS0tLS1cblxuICB2YXIgc2luaW0gPSBNYXRoLnNpbihpbmNsbSk7XG4gIHZhciBjb3NpbSA9IE1hdGguY29zKGluY2xtKTsgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0gYWRkIGx1bmFyLXNvbGFyIHBlcmlvZGljcyAtLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBlcCA9IGVtO1xuICB4aW5jcCA9IGluY2xtO1xuICBhcmdwcCA9IGFyZ3BtO1xuICBub2RlcCA9IG5vZGVtO1xuICBtcCA9IG1tO1xuICBzaW5pcCA9IHNpbmltO1xuICBjb3NpcCA9IGNvc2ltO1xuXG4gIGlmIChzYXRyZWMubWV0aG9kID09PSAnZCcpIHtcbiAgICB2YXIgZHBwZXJQYXJhbWV0ZXJzID0ge1xuICAgICAgaW5jbG86IHNhdHJlYy5pbmNsbyxcbiAgICAgIGluaXQ6ICduJyxcbiAgICAgIGVwOiBlcCxcbiAgICAgIGluY2xwOiB4aW5jcCxcbiAgICAgIG5vZGVwOiBub2RlcCxcbiAgICAgIGFyZ3BwOiBhcmdwcCxcbiAgICAgIG1wOiBtcCxcbiAgICAgIG9wc21vZGU6IHNhdHJlYy5vcGVyYXRpb25tb2RlXG4gICAgfTtcbiAgICB2YXIgZHBwZXJSZXN1bHQgPSBkcHBlcihzYXRyZWMsIGRwcGVyUGFyYW1ldGVycyk7XG4gICAgZXAgPSBkcHBlclJlc3VsdC5lcDtcbiAgICBub2RlcCA9IGRwcGVyUmVzdWx0Lm5vZGVwO1xuICAgIGFyZ3BwID0gZHBwZXJSZXN1bHQuYXJncHA7XG4gICAgbXAgPSBkcHBlclJlc3VsdC5tcDtcbiAgICB4aW5jcCA9IGRwcGVyUmVzdWx0LmluY2xwO1xuXG4gICAgaWYgKHhpbmNwIDwgMC4wKSB7XG4gICAgICB4aW5jcCA9IC14aW5jcDtcbiAgICAgIG5vZGVwICs9IHBpO1xuICAgICAgYXJncHAgLT0gcGk7XG4gICAgfVxuXG4gICAgaWYgKGVwIDwgMC4wIHx8IGVwID4gMS4wKSB7XG4gICAgICAvLyAgcHJpbnRmKFwiLy8gZXJyb3IgZXAgJWZcXG5cIiwgZXApO1xuICAgICAgc2F0cmVjLmVycm9yID0gMzsgLy8gIHNncDRmaXggYWRkIHJldHVyblxuXG4gICAgICByZXR1cm4gW2ZhbHNlLCBmYWxzZV07XG4gICAgfVxuICB9IC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLSBsb25nIHBlcmlvZCBwZXJpb2RpY3MgLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICBpZiAoc2F0cmVjLm1ldGhvZCA9PT0gJ2QnKSB7XG4gICAgc2luaXAgPSBNYXRoLnNpbih4aW5jcCk7XG4gICAgY29zaXAgPSBNYXRoLmNvcyh4aW5jcCk7XG4gICAgc2F0cmVjLmF5Y29mID0gLTAuNSAqIGozb2oyICogc2luaXA7IC8vICBzZ3A0Zml4IGZvciBkaXZpZGUgYnkgemVybyBmb3IgeGluY3AgPSAxODAgZGVnXG5cbiAgICBpZiAoTWF0aC5hYnMoY29zaXAgKyAxLjApID4gMS41ZS0xMikge1xuICAgICAgc2F0cmVjLnhsY29mID0gLTAuMjUgKiBqM29qMiAqIHNpbmlwICogKDMuMCArIDUuMCAqIGNvc2lwKSAvICgxLjAgKyBjb3NpcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNhdHJlYy54bGNvZiA9IC0wLjI1ICogajNvajIgKiBzaW5pcCAqICgzLjAgKyA1LjAgKiBjb3NpcCkgLyB0ZW1wNDtcbiAgICB9XG4gIH1cblxuICB2YXIgYXhubCA9IGVwICogTWF0aC5jb3MoYXJncHApO1xuICB0ZW1wID0gMS4wIC8gKGFtICogKDEuMCAtIGVwICogZXApKTtcbiAgdmFyIGF5bmwgPSBlcCAqIE1hdGguc2luKGFyZ3BwKSArIHRlbXAgKiBzYXRyZWMuYXljb2Y7XG4gIHZhciB4bCA9IG1wICsgYXJncHAgKyBub2RlcCArIHRlbXAgKiBzYXRyZWMueGxjb2YgKiBheG5sOyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gc29sdmUga2VwbGVyJ3MgZXF1YXRpb24gLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIHUgPSAoeGwgLSBub2RlcCkgJSB0d29QaTtcbiAgZW8xID0gdTtcbiAgdGVtNSA9IDk5OTkuOTtcbiAgdmFyIGt0ciA9IDE7IC8vICAgIHNncDRmaXggZm9yIGtlcGxlciBpdGVyYXRpb25cbiAgLy8gICAgdGhlIGZvbGxvd2luZyBpdGVyYXRpb24gbmVlZHMgYmV0dGVyIGxpbWl0cyBvbiBjb3JyZWN0aW9uc1xuXG4gIHdoaWxlIChNYXRoLmFicyh0ZW01KSA+PSAxLjBlLTEyICYmIGt0ciA8PSAxMCkge1xuICAgIHNpbmVvMSA9IE1hdGguc2luKGVvMSk7XG4gICAgY29zZW8xID0gTWF0aC5jb3MoZW8xKTtcbiAgICB0ZW01ID0gMS4wIC0gY29zZW8xICogYXhubCAtIHNpbmVvMSAqIGF5bmw7XG4gICAgdGVtNSA9ICh1IC0gYXlubCAqIGNvc2VvMSArIGF4bmwgKiBzaW5lbzEgLSBlbzEpIC8gdGVtNTtcblxuICAgIGlmIChNYXRoLmFicyh0ZW01KSA+PSAwLjk1KSB7XG4gICAgICBpZiAodGVtNSA+IDAuMCkge1xuICAgICAgICB0ZW01ID0gMC45NTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRlbTUgPSAtMC45NTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbzEgKz0gdGVtNTtcbiAgICBrdHIgKz0gMTtcbiAgfSAvLyAgLS0tLS0tLS0tLS0tLSBzaG9ydCBwZXJpb2QgcHJlbGltaW5hcnkgcXVhbnRpdGllcyAtLS0tLS0tLS0tLVxuXG5cbiAgdmFyIGVjb3NlID0gYXhubCAqIGNvc2VvMSArIGF5bmwgKiBzaW5lbzE7XG4gIHZhciBlc2luZSA9IGF4bmwgKiBzaW5lbzEgLSBheW5sICogY29zZW8xO1xuICB2YXIgZWwyID0gYXhubCAqIGF4bmwgKyBheW5sICogYXlubDtcbiAgdmFyIHBsID0gYW0gKiAoMS4wIC0gZWwyKTtcblxuICBpZiAocGwgPCAwLjApIHtcbiAgICAvLyAgcHJpbnRmKFwiLy8gZXJyb3IgcGwgJWZcXG5cIiwgcGwpO1xuICAgIHNhdHJlYy5lcnJvciA9IDQ7IC8vICBzZ3A0Zml4IGFkZCByZXR1cm5cblxuICAgIHJldHVybiBbZmFsc2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBybCA9IGFtICogKDEuMCAtIGVjb3NlKTtcbiAgdmFyIHJkb3RsID0gTWF0aC5zcXJ0KGFtKSAqIGVzaW5lIC8gcmw7XG4gIHZhciBydmRvdGwgPSBNYXRoLnNxcnQocGwpIC8gcmw7XG4gIHZhciBiZXRhbCA9IE1hdGguc3FydCgxLjAgLSBlbDIpO1xuICB0ZW1wID0gZXNpbmUgLyAoMS4wICsgYmV0YWwpO1xuICB2YXIgc2ludSA9IGFtIC8gcmwgKiAoc2luZW8xIC0gYXlubCAtIGF4bmwgKiB0ZW1wKTtcbiAgdmFyIGNvc3UgPSBhbSAvIHJsICogKGNvc2VvMSAtIGF4bmwgKyBheW5sICogdGVtcCk7XG4gIHN1ID0gTWF0aC5hdGFuMihzaW51LCBjb3N1KTtcbiAgdmFyIHNpbjJ1ID0gKGNvc3UgKyBjb3N1KSAqIHNpbnU7XG4gIHZhciBjb3MydSA9IDEuMCAtIDIuMCAqIHNpbnUgKiBzaW51O1xuICB0ZW1wID0gMS4wIC8gcGw7XG4gIHZhciB0ZW1wMSA9IDAuNSAqIGoyICogdGVtcDtcbiAgdmFyIHRlbXAyID0gdGVtcDEgKiB0ZW1wOyAvLyAtLS0tLS0tLS0tLS0tLSB1cGRhdGUgZm9yIHNob3J0IHBlcmlvZCBwZXJpb2RpY3MgLS0tLS0tLS0tLS0tXG5cbiAgaWYgKHNhdHJlYy5tZXRob2QgPT09ICdkJykge1xuICAgIGNvc2lzcSA9IGNvc2lwICogY29zaXA7XG4gICAgc2F0cmVjLmNvbjQxID0gMy4wICogY29zaXNxIC0gMS4wO1xuICAgIHNhdHJlYy54MW10aDIgPSAxLjAgLSBjb3Npc3E7XG4gICAgc2F0cmVjLng3dGhtMSA9IDcuMCAqIGNvc2lzcSAtIDEuMDtcbiAgfVxuXG4gIHZhciBtcnQgPSBybCAqICgxLjAgLSAxLjUgKiB0ZW1wMiAqIGJldGFsICogc2F0cmVjLmNvbjQxKSArIDAuNSAqIHRlbXAxICogc2F0cmVjLngxbXRoMiAqIGNvczJ1OyAvLyBzZ3A0Zml4IGZvciBkZWNheWluZyBzYXRlbGxpdGVzXG5cbiAgaWYgKG1ydCA8IDEuMCkge1xuICAgIC8vIHByaW50ZihcIi8vIGRlY2F5IGNvbmRpdGlvbiAlMTEuNmYgXFxuXCIsbXJ0KTtcbiAgICBzYXRyZWMuZXJyb3IgPSA2O1xuICAgIHJldHVybiB7XG4gICAgICBwb3NpdGlvbjogZmFsc2UsXG4gICAgICB2ZWxvY2l0eTogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgc3UgLT0gMC4yNSAqIHRlbXAyICogc2F0cmVjLng3dGhtMSAqIHNpbjJ1O1xuICB2YXIgeG5vZGUgPSBub2RlcCArIDEuNSAqIHRlbXAyICogY29zaXAgKiBzaW4ydTtcbiAgdmFyIHhpbmMgPSB4aW5jcCArIDEuNSAqIHRlbXAyICogY29zaXAgKiBzaW5pcCAqIGNvczJ1O1xuICB2YXIgbXZ0ID0gcmRvdGwgLSBubSAqIHRlbXAxICogc2F0cmVjLngxbXRoMiAqIHNpbjJ1IC8geGtlO1xuICB2YXIgcnZkb3QgPSBydmRvdGwgKyBubSAqIHRlbXAxICogKHNhdHJlYy54MW10aDIgKiBjb3MydSArIDEuNSAqIHNhdHJlYy5jb240MSkgLyB4a2U7IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLSBvcmllbnRhdGlvbiB2ZWN0b3JzIC0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgc2luc3UgPSBNYXRoLnNpbihzdSk7XG4gIHZhciBjb3NzdSA9IE1hdGguY29zKHN1KTtcbiAgdmFyIHNub2QgPSBNYXRoLnNpbih4bm9kZSk7XG4gIHZhciBjbm9kID0gTWF0aC5jb3MoeG5vZGUpO1xuICB2YXIgc2luaSA9IE1hdGguc2luKHhpbmMpO1xuICB2YXIgY29zaSA9IE1hdGguY29zKHhpbmMpO1xuICB2YXIgeG14ID0gLXNub2QgKiBjb3NpO1xuICB2YXIgeG15ID0gY25vZCAqIGNvc2k7XG4gIHZhciB1eCA9IHhteCAqIHNpbnN1ICsgY25vZCAqIGNvc3N1O1xuICB2YXIgdXkgPSB4bXkgKiBzaW5zdSArIHNub2QgKiBjb3NzdTtcbiAgdmFyIHV6ID0gc2luaSAqIHNpbnN1O1xuICB2YXIgdnggPSB4bXggKiBjb3NzdSAtIGNub2QgKiBzaW5zdTtcbiAgdmFyIHZ5ID0geG15ICogY29zc3UgLSBzbm9kICogc2luc3U7XG4gIHZhciB2eiA9IHNpbmkgKiBjb3NzdTsgLy8gLS0tLS0tLS0tIHBvc2l0aW9uIGFuZCB2ZWxvY2l0eSAoaW4ga20gYW5kIGttL3NlYykgLS0tLS0tLS0tLVxuXG4gIHZhciByID0ge1xuICAgIHg6IG1ydCAqIHV4ICogZWFydGhSYWRpdXMsXG4gICAgeTogbXJ0ICogdXkgKiBlYXJ0aFJhZGl1cyxcbiAgICB6OiBtcnQgKiB1eiAqIGVhcnRoUmFkaXVzXG4gIH07XG4gIHZhciB2ID0ge1xuICAgIHg6IChtdnQgKiB1eCArIHJ2ZG90ICogdngpICogdmttcGVyc2VjLFxuICAgIHk6IChtdnQgKiB1eSArIHJ2ZG90ICogdnkpICogdmttcGVyc2VjLFxuICAgIHo6IChtdnQgKiB1eiArIHJ2ZG90ICogdnopICogdmttcGVyc2VjXG4gIH07XG4gIHJldHVybiB7XG4gICAgcG9zaXRpb246IHIsXG4gICAgdmVsb2NpdHk6IHZcbiAgfTtcbiAgLyogZXNsaW50LWVuYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xufVxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWR1cmUgc2dwNGluaXRcbiAqXG4gKiAgdGhpcyBwcm9jZWR1cmUgaW5pdGlhbGl6ZXMgdmFyaWFibGVzIGZvciBzZ3A0LlxuICpcbiAqICBhdXRob3IgICAgICAgIDogZGF2aWQgdmFsbGFkbyAgICAgICAgICAgICAgICAgIDcxOS01NzMtMjYwMCAgIDI4IGp1biAyMDA1XG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAyOCBqdW4gMjAwNVxuICpcbiAqICBpbnB1dHMgICAgICAgIDpcbiAqICAgIG9wc21vZGUgICAgIC0gbW9kZSBvZiBvcGVyYXRpb24gYWZzcGMgb3IgaW1wcm92ZWQgJ2EnLCAnaSdcbiAqICAgIHNhdG4gICAgICAgIC0gc2F0ZWxsaXRlIG51bWJlclxuICogICAgYnN0YXIgICAgICAgLSBzZ3A0IHR5cGUgZHJhZyBjb2VmZmljaWVudCAgICAgICAgICAgICAga2cvbTJlclxuICogICAgZWNjbyAgICAgICAgLSBlY2NlbnRyaWNpdHlcbiAqICAgIGVwb2NoICAgICAgIC0gZXBvY2ggdGltZSBpbiBkYXlzIGZyb20gamFuIDAsIDE5NTAuIDAgaHJcbiAqICAgIGFyZ3BvICAgICAgIC0gYXJndW1lbnQgb2YgcGVyaWdlZSAob3V0cHV0IGlmIGRzKVxuICogICAgaW5jbG8gICAgICAgLSBpbmNsaW5hdGlvblxuICogICAgbW8gICAgICAgICAgLSBtZWFuIGFub21hbHkgKG91dHB1dCBpZiBkcylcbiAqICAgIG5vICAgICAgICAgIC0gbWVhbiBtb3Rpb25cbiAqICAgIG5vZGVvICAgICAgIC0gcmlnaHQgYXNjZW5zaW9uIG9mIGFzY2VuZGluZyBub2RlXG4gKlxuICogIG91dHB1dHMgICAgICAgOlxuICogICAgcmVjICAgICAgLSBjb21tb24gdmFsdWVzIGZvciBzdWJzZXF1ZW50IGNhbGxzXG4gKiAgICByZXR1cm4gY29kZSAtIG5vbi16ZXJvIG9uIGVycm9yLlxuICogICAgICAgICAgICAgICAgICAgMSAtIG1lYW4gZWxlbWVudHMsIGVjYyA+PSAxLjAgb3IgZWNjIDwgLTAuMDAxIG9yIGEgPCAwLjk1IGVyXG4gKiAgICAgICAgICAgICAgICAgICAyIC0gbWVhbiBtb3Rpb24gbGVzcyB0aGFuIDAuMFxuICogICAgICAgICAgICAgICAgICAgMyAtIHBlcnQgZWxlbWVudHMsIGVjYyA8IDAuMCAgb3IgIGVjYyA+IDEuMFxuICogICAgICAgICAgICAgICAgICAgNCAtIHNlbWktbGF0dXMgcmVjdHVtIDwgMC4wXG4gKiAgICAgICAgICAgICAgICAgICA1IC0gZXBvY2ggZWxlbWVudHMgYXJlIHN1Yi1vcmJpdGFsXG4gKiAgICAgICAgICAgICAgICAgICA2IC0gc2F0ZWxsaXRlIGhhcyBkZWNheWVkXG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgY25vZG0gICwgc25vZG0gICwgY29zaW0gICwgc2luaW0gICwgY29zb21tICwgc2lub21tXG4gKiAgICBjYzFzcSAgLCBjYzIgICAgLCBjYzNcbiAqICAgIGNvZWYgICAsIGNvZWYxXG4gKiAgICBjb3NpbzQgICAgICAtXG4gKiAgICBkYXkgICAgICAgICAtXG4gKiAgICBkbmR0ICAgICAgICAtXG4gKiAgICBlbSAgICAgICAgICAtIGVjY2VudHJpY2l0eVxuICogICAgZW1zcSAgICAgICAgLSBlY2NlbnRyaWNpdHkgc3F1YXJlZFxuICogICAgZWV0YSAgICAgICAgLVxuICogICAgZXRhc3EgICAgICAgLVxuICogICAgZ2FtICAgICAgICAgLVxuICogICAgYXJncG0gICAgICAgLSBhcmd1bWVudCBvZiBwZXJpZ2VlXG4gKiAgICBub2RlbSAgICAgICAtXG4gKiAgICBpbmNsbSAgICAgICAtIGluY2xpbmF0aW9uXG4gKiAgICBtbSAgICAgICAgICAtIG1lYW4gYW5vbWFseVxuICogICAgbm0gICAgICAgICAgLSBtZWFuIG1vdGlvblxuICogICAgcGVyaWdlICAgICAgLSBwZXJpZ2VlXG4gKiAgICBwaW52c3EgICAgICAtXG4gKiAgICBwc2lzcSAgICAgICAtXG4gKiAgICBxem1zMjQgICAgICAtXG4gKiAgICBydGVtc3EgICAgICAtXG4gKiAgICBzMSwgczIsIHMzLCBzNCwgczUsIHM2LCBzNyAgICAgICAgICAtXG4gKiAgICBzZm91ciAgICAgICAtXG4gKiAgICBzczEsIHNzMiwgc3MzLCBzczQsIHNzNSwgc3M2LCBzczcgICAgICAgICAtXG4gKiAgICBzejEsIHN6Miwgc3ozXG4gKiAgICBzejExLCBzejEyLCBzejEzLCBzejIxLCBzejIyLCBzejIzLCBzejMxLCBzejMyLCBzejMzICAgICAgICAtXG4gKiAgICB0YyAgICAgICAgICAtXG4gKiAgICB0ZW1wICAgICAgICAtXG4gKiAgICB0ZW1wMSwgdGVtcDIsIHRlbXAzICAgICAgIC1cbiAqICAgIHRzaSAgICAgICAgIC1cbiAqICAgIHhwaWRvdCAgICAgIC1cbiAqICAgIHhoZG90MSAgICAgIC1cbiAqICAgIHoxLCB6MiwgejMgICAgICAgICAgLVxuICogICAgejExLCB6MTIsIHoxMywgejIxLCB6MjIsIHoyMywgejMxLCB6MzIsIHozMyAgICAgICAgIC1cbiAqXG4gKiAgY291cGxpbmcgICAgICA6XG4gKiAgICBnZXRncmF2Y29uc3QtXG4gKiAgICBpbml0bCAgICAgICAtXG4gKiAgICBkc2NvbSAgICAgICAtXG4gKiAgICBkcHBlciAgICAgICAtXG4gKiAgICBkc2luaXQgICAgICAtXG4gKiAgICBzZ3A0ICAgICAgICAtXG4gKlxuICogIHJlZmVyZW5jZXMgICAgOlxuICogICAgaG9vdHMsIHJvZWhyaWNoLCBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAjMyAxOTgwXG4gKiAgICBob290cywgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzYgMTk4NlxuICogICAgaG9vdHMsIHNjaHVtYWNoZXIgYW5kIGdsb3ZlciAyMDA0XG4gKiAgICB2YWxsYWRvLCBjcmF3Zm9yZCwgaHVqc2FrLCBrZWxzbyAgMjAwNlxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbmZ1bmN0aW9uIHNncDRpbml0KHNhdHJlYywgb3B0aW9ucykge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuICB2YXIgb3BzbW9kZSA9IG9wdGlvbnMub3BzbW9kZSxcbiAgICAgIHNhdG4gPSBvcHRpb25zLnNhdG4sXG4gICAgICBlcG9jaCA9IG9wdGlvbnMuZXBvY2gsXG4gICAgICB4YnN0YXIgPSBvcHRpb25zLnhic3RhcixcbiAgICAgIHhlY2NvID0gb3B0aW9ucy54ZWNjbyxcbiAgICAgIHhhcmdwbyA9IG9wdGlvbnMueGFyZ3BvLFxuICAgICAgeGluY2xvID0gb3B0aW9ucy54aW5jbG8sXG4gICAgICB4bW8gPSBvcHRpb25zLnhtbyxcbiAgICAgIHhubyA9IG9wdGlvbnMueG5vLFxuICAgICAgeG5vZGVvID0gb3B0aW9ucy54bm9kZW87XG4gIHZhciBjb3NpbTtcbiAgdmFyIHNpbmltO1xuICB2YXIgY2Mxc3E7XG4gIHZhciBjYzI7XG4gIHZhciBjYzM7XG4gIHZhciBjb2VmO1xuICB2YXIgY29lZjE7XG4gIHZhciBjb3NpbzQ7XG4gIHZhciBlbTtcbiAgdmFyIGVtc3E7XG4gIHZhciBlZXRhO1xuICB2YXIgZXRhc3E7XG4gIHZhciBhcmdwbTtcbiAgdmFyIG5vZGVtO1xuICB2YXIgaW5jbG07XG4gIHZhciBtbTtcbiAgdmFyIG5tO1xuICB2YXIgcGVyaWdlO1xuICB2YXIgcGludnNxO1xuICB2YXIgcHNpc3E7XG4gIHZhciBxem1zMjQ7XG4gIHZhciBzMTtcbiAgdmFyIHMyO1xuICB2YXIgczM7XG4gIHZhciBzNDtcbiAgdmFyIHM1O1xuICB2YXIgc2ZvdXI7XG4gIHZhciBzczE7XG4gIHZhciBzczI7XG4gIHZhciBzczM7XG4gIHZhciBzczQ7XG4gIHZhciBzczU7XG4gIHZhciBzejE7XG4gIHZhciBzejM7XG4gIHZhciBzejExO1xuICB2YXIgc3oxMztcbiAgdmFyIHN6MjE7XG4gIHZhciBzejIzO1xuICB2YXIgc3ozMTtcbiAgdmFyIHN6MzM7XG4gIHZhciB0YztcbiAgdmFyIHRlbXA7XG4gIHZhciB0ZW1wMTtcbiAgdmFyIHRlbXAyO1xuICB2YXIgdGVtcDM7XG4gIHZhciB0c2k7XG4gIHZhciB4cGlkb3Q7XG4gIHZhciB4aGRvdDE7XG4gIHZhciB6MTtcbiAgdmFyIHozO1xuICB2YXIgejExO1xuICB2YXIgejEzO1xuICB2YXIgejIxO1xuICB2YXIgejIzO1xuICB2YXIgejMxO1xuICB2YXIgejMzO1xuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gaW5pdGlhbGl6YXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gIC8vIHNncDRmaXggZGl2aXNvciBmb3IgZGl2aWRlIGJ5IHplcm8gY2hlY2sgb24gaW5jbGluYXRpb25cbiAgLy8gdGhlIG9sZCBjaGVjayB1c2VkIDEuMCArIE1hdGguY29zKHBpLTEuMGUtOSksIGJ1dCB0aGVuIGNvbXBhcmVkIGl0IHRvXG4gIC8vIDEuNSBlLTEyLCBzbyB0aGUgdGhyZXNob2xkIHdhcyBjaGFuZ2VkIHRvIDEuNWUtMTIgZm9yIGNvbnNpc3RlbmN5XG5cbiAgdmFyIHRlbXA0ID0gMS41ZS0xMjsgLy8gLS0tLS0tLS0tLS0gc2V0IGFsbCBuZWFyIGVhcnRoIHZhcmlhYmxlcyB0byB6ZXJvIC0tLS0tLS0tLS0tLVxuXG4gIHNhdHJlYy5pc2ltcCA9IDA7XG4gIHNhdHJlYy5tZXRob2QgPSAnbic7XG4gIHNhdHJlYy5heWNvZiA9IDAuMDtcbiAgc2F0cmVjLmNvbjQxID0gMC4wO1xuICBzYXRyZWMuY2MxID0gMC4wO1xuICBzYXRyZWMuY2M0ID0gMC4wO1xuICBzYXRyZWMuY2M1ID0gMC4wO1xuICBzYXRyZWMuZDIgPSAwLjA7XG4gIHNhdHJlYy5kMyA9IDAuMDtcbiAgc2F0cmVjLmQ0ID0gMC4wO1xuICBzYXRyZWMuZGVsbW8gPSAwLjA7XG4gIHNhdHJlYy5ldGEgPSAwLjA7XG4gIHNhdHJlYy5hcmdwZG90ID0gMC4wO1xuICBzYXRyZWMub21nY29mID0gMC4wO1xuICBzYXRyZWMuc2lubWFvID0gMC4wO1xuICBzYXRyZWMudCA9IDAuMDtcbiAgc2F0cmVjLnQyY29mID0gMC4wO1xuICBzYXRyZWMudDNjb2YgPSAwLjA7XG4gIHNhdHJlYy50NGNvZiA9IDAuMDtcbiAgc2F0cmVjLnQ1Y29mID0gMC4wO1xuICBzYXRyZWMueDFtdGgyID0gMC4wO1xuICBzYXRyZWMueDd0aG0xID0gMC4wO1xuICBzYXRyZWMubWRvdCA9IDAuMDtcbiAgc2F0cmVjLm5vZGVkb3QgPSAwLjA7XG4gIHNhdHJlYy54bGNvZiA9IDAuMDtcbiAgc2F0cmVjLnhtY29mID0gMC4wO1xuICBzYXRyZWMubm9kZWNmID0gMC4wOyAvLyAtLS0tLS0tLS0tLSBzZXQgYWxsIGRlZXAgc3BhY2UgdmFyaWFibGVzIHRvIHplcm8gLS0tLS0tLS0tLS0tXG5cbiAgc2F0cmVjLmlyZXogPSAwO1xuICBzYXRyZWMuZDIyMDEgPSAwLjA7XG4gIHNhdHJlYy5kMjIxMSA9IDAuMDtcbiAgc2F0cmVjLmQzMjEwID0gMC4wO1xuICBzYXRyZWMuZDMyMjIgPSAwLjA7XG4gIHNhdHJlYy5kNDQxMCA9IDAuMDtcbiAgc2F0cmVjLmQ0NDIyID0gMC4wO1xuICBzYXRyZWMuZDUyMjAgPSAwLjA7XG4gIHNhdHJlYy5kNTIzMiA9IDAuMDtcbiAgc2F0cmVjLmQ1NDIxID0gMC4wO1xuICBzYXRyZWMuZDU0MzMgPSAwLjA7XG4gIHNhdHJlYy5kZWR0ID0gMC4wO1xuICBzYXRyZWMuZGVsMSA9IDAuMDtcbiAgc2F0cmVjLmRlbDIgPSAwLjA7XG4gIHNhdHJlYy5kZWwzID0gMC4wO1xuICBzYXRyZWMuZGlkdCA9IDAuMDtcbiAgc2F0cmVjLmRtZHQgPSAwLjA7XG4gIHNhdHJlYy5kbm9kdCA9IDAuMDtcbiAgc2F0cmVjLmRvbWR0ID0gMC4wO1xuICBzYXRyZWMuZTMgPSAwLjA7XG4gIHNhdHJlYy5lZTIgPSAwLjA7XG4gIHNhdHJlYy5wZW8gPSAwLjA7XG4gIHNhdHJlYy5wZ2hvID0gMC4wO1xuICBzYXRyZWMucGhvID0gMC4wO1xuICBzYXRyZWMucGluY28gPSAwLjA7XG4gIHNhdHJlYy5wbG8gPSAwLjA7XG4gIHNhdHJlYy5zZTIgPSAwLjA7XG4gIHNhdHJlYy5zZTMgPSAwLjA7XG4gIHNhdHJlYy5zZ2gyID0gMC4wO1xuICBzYXRyZWMuc2doMyA9IDAuMDtcbiAgc2F0cmVjLnNnaDQgPSAwLjA7XG4gIHNhdHJlYy5zaDIgPSAwLjA7XG4gIHNhdHJlYy5zaDMgPSAwLjA7XG4gIHNhdHJlYy5zaTIgPSAwLjA7XG4gIHNhdHJlYy5zaTMgPSAwLjA7XG4gIHNhdHJlYy5zbDIgPSAwLjA7XG4gIHNhdHJlYy5zbDMgPSAwLjA7XG4gIHNhdHJlYy5zbDQgPSAwLjA7XG4gIHNhdHJlYy5nc3RvID0gMC4wO1xuICBzYXRyZWMueGZhY3QgPSAwLjA7XG4gIHNhdHJlYy54Z2gyID0gMC4wO1xuICBzYXRyZWMueGdoMyA9IDAuMDtcbiAgc2F0cmVjLnhnaDQgPSAwLjA7XG4gIHNhdHJlYy54aDIgPSAwLjA7XG4gIHNhdHJlYy54aDMgPSAwLjA7XG4gIHNhdHJlYy54aTIgPSAwLjA7XG4gIHNhdHJlYy54aTMgPSAwLjA7XG4gIHNhdHJlYy54bDIgPSAwLjA7XG4gIHNhdHJlYy54bDMgPSAwLjA7XG4gIHNhdHJlYy54bDQgPSAwLjA7XG4gIHNhdHJlYy54bGFtbyA9IDAuMDtcbiAgc2F0cmVjLnptb2wgPSAwLjA7XG4gIHNhdHJlYy56bW9zID0gMC4wO1xuICBzYXRyZWMuYXRpbWUgPSAwLjA7XG4gIHNhdHJlYy54bGkgPSAwLjA7XG4gIHNhdHJlYy54bmkgPSAwLjA7IC8vIHNncDRmaXggLSBub3RlIHRoZSBmb2xsb3dpbmcgdmFyaWFibGVzIGFyZSBhbHNvIHBhc3NlZCBkaXJlY3RseSB2aWEgc2F0cmVjLlxuICAvLyBpdCBpcyBwb3NzaWJsZSB0byBzdHJlYW1saW5lIHRoZSBzZ3A0aW5pdCBjYWxsIGJ5IGRlbGV0aW5nIHRoZSBcInhcIlxuICAvLyB2YXJpYWJsZXMsIGJ1dCB0aGUgdXNlciB3b3VsZCBuZWVkIHRvIHNldCB0aGUgc2F0cmVjLiogdmFsdWVzIGZpcnN0LiB3ZVxuICAvLyBpbmNsdWRlIHRoZSBhZGRpdGlvbmFsIGFzc2lnbm1lbnRzIGluIGNhc2UgdHdvbGluZTJydiBpcyBub3QgdXNlZC5cblxuICBzYXRyZWMuYnN0YXIgPSB4YnN0YXI7XG4gIHNhdHJlYy5lY2NvID0geGVjY287XG4gIHNhdHJlYy5hcmdwbyA9IHhhcmdwbztcbiAgc2F0cmVjLmluY2xvID0geGluY2xvO1xuICBzYXRyZWMubW8gPSB4bW87XG4gIHNhdHJlYy5ubyA9IHhubztcbiAgc2F0cmVjLm5vZGVvID0geG5vZGVvOyAvLyAgc2dwNGZpeCBhZGQgb3BzbW9kZVxuXG4gIHNhdHJlYy5vcGVyYXRpb25tb2RlID0gb3BzbW9kZTsgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGVhcnRoIGNvbnN0YW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBzZ3A0Zml4IGlkZW50aWZ5IGNvbnN0YW50cyBhbmQgYWxsb3cgYWx0ZXJuYXRlIHZhbHVlc1xuXG4gIHZhciBzcyA9IDc4LjAgLyBlYXJ0aFJhZGl1cyArIDEuMDsgLy8gc2dwNGZpeCB1c2UgbXVsdGlwbHkgZm9yIHNwZWVkIGluc3RlYWQgb2YgcG93XG5cbiAgdmFyIHF6bXMydHRlbXAgPSAoMTIwLjAgLSA3OC4wKSAvIGVhcnRoUmFkaXVzO1xuICB2YXIgcXptczJ0ID0gcXptczJ0dGVtcCAqIHF6bXMydHRlbXAgKiBxem1zMnR0ZW1wICogcXptczJ0dGVtcDtcbiAgc2F0cmVjLmluaXQgPSAneSc7XG4gIHNhdHJlYy50ID0gMC4wO1xuICB2YXIgaW5pdGxPcHRpb25zID0ge1xuICAgIHNhdG46IHNhdG4sXG4gICAgZWNjbzogc2F0cmVjLmVjY28sXG4gICAgZXBvY2g6IGVwb2NoLFxuICAgIGluY2xvOiBzYXRyZWMuaW5jbG8sXG4gICAgbm86IHNhdHJlYy5ubyxcbiAgICBtZXRob2Q6IHNhdHJlYy5tZXRob2QsXG4gICAgb3BzbW9kZTogc2F0cmVjLm9wZXJhdGlvbm1vZGVcbiAgfTtcbiAgdmFyIGluaXRsUmVzdWx0ID0gaW5pdGwoaW5pdGxPcHRpb25zKTtcbiAgdmFyIGFvID0gaW5pdGxSZXN1bHQuYW8sXG4gICAgICBjb240MiA9IGluaXRsUmVzdWx0LmNvbjQyLFxuICAgICAgY29zaW8gPSBpbml0bFJlc3VsdC5jb3NpbyxcbiAgICAgIGNvc2lvMiA9IGluaXRsUmVzdWx0LmNvc2lvMixcbiAgICAgIGVjY3NxID0gaW5pdGxSZXN1bHQuZWNjc3EsXG4gICAgICBvbWVvc3EgPSBpbml0bFJlc3VsdC5vbWVvc3EsXG4gICAgICBwb3NxID0gaW5pdGxSZXN1bHQucG9zcSxcbiAgICAgIHJwID0gaW5pdGxSZXN1bHQucnAsXG4gICAgICBydGVvc3EgPSBpbml0bFJlc3VsdC5ydGVvc3EsXG4gICAgICBzaW5pbyA9IGluaXRsUmVzdWx0LnNpbmlvO1xuICBzYXRyZWMubm8gPSBpbml0bFJlc3VsdC5ubztcbiAgc2F0cmVjLmNvbjQxID0gaW5pdGxSZXN1bHQuY29uNDE7XG4gIHNhdHJlYy5nc3RvID0gaW5pdGxSZXN1bHQuZ3N0bztcbiAgc2F0cmVjLmVycm9yID0gMDsgLy8gc2dwNGZpeCByZW1vdmUgdGhpcyBjaGVjayBhcyBpdCBpcyB1bm5lY2Vzc2FyeVxuICAvLyB0aGUgbXJ0IGNoZWNrIGluIHNncDQgaGFuZGxlcyBkZWNheWluZyBzYXRlbGxpdGUgY2FzZXMgZXZlbiBpZiB0aGUgc3RhcnRpbmdcbiAgLy8gY29uZGl0aW9uIGlzIGJlbG93IHRoZSBzdXJmYWNlIG9mIHRlIGVhcnRoXG4gIC8vIGlmIChycCA8IDEuMClcbiAgLy8ge1xuICAvLyAgIHByaW50ZihcIi8vICoqKiBzYXRuJWQgZXBvY2ggZWx0cyBzdWItb3JiaXRhbCAqKipcXG5cIiwgc2F0bik7XG4gIC8vICAgc2F0cmVjLmVycm9yID0gNTtcbiAgLy8gfVxuXG4gIGlmIChvbWVvc3EgPj0gMC4wIHx8IHNhdHJlYy5ubyA+PSAwLjApIHtcbiAgICBzYXRyZWMuaXNpbXAgPSAwO1xuXG4gICAgaWYgKHJwIDwgMjIwLjAgLyBlYXJ0aFJhZGl1cyArIDEuMCkge1xuICAgICAgc2F0cmVjLmlzaW1wID0gMTtcbiAgICB9XG5cbiAgICBzZm91ciA9IHNzO1xuICAgIHF6bXMyNCA9IHF6bXMydDtcbiAgICBwZXJpZ2UgPSAocnAgLSAxLjApICogZWFydGhSYWRpdXM7IC8vIC0gZm9yIHBlcmlnZWVzIGJlbG93IDE1NiBrbSwgcyBhbmQgcW9tczJ0IGFyZSBhbHRlcmVkIC1cblxuICAgIGlmIChwZXJpZ2UgPCAxNTYuMCkge1xuICAgICAgc2ZvdXIgPSBwZXJpZ2UgLSA3OC4wO1xuXG4gICAgICBpZiAocGVyaWdlIDwgOTguMCkge1xuICAgICAgICBzZm91ciA9IDIwLjA7XG4gICAgICB9IC8vIHNncDRmaXggdXNlIG11bHRpcGx5IGZvciBzcGVlZCBpbnN0ZWFkIG9mIHBvd1xuXG5cbiAgICAgIHZhciBxem1zMjR0ZW1wID0gKDEyMC4wIC0gc2ZvdXIpIC8gZWFydGhSYWRpdXM7XG4gICAgICBxem1zMjQgPSBxem1zMjR0ZW1wICogcXptczI0dGVtcCAqIHF6bXMyNHRlbXAgKiBxem1zMjR0ZW1wO1xuICAgICAgc2ZvdXIgPSBzZm91ciAvIGVhcnRoUmFkaXVzICsgMS4wO1xuICAgIH1cblxuICAgIHBpbnZzcSA9IDEuMCAvIHBvc3E7XG4gICAgdHNpID0gMS4wIC8gKGFvIC0gc2ZvdXIpO1xuICAgIHNhdHJlYy5ldGEgPSBhbyAqIHNhdHJlYy5lY2NvICogdHNpO1xuICAgIGV0YXNxID0gc2F0cmVjLmV0YSAqIHNhdHJlYy5ldGE7XG4gICAgZWV0YSA9IHNhdHJlYy5lY2NvICogc2F0cmVjLmV0YTtcbiAgICBwc2lzcSA9IE1hdGguYWJzKDEuMCAtIGV0YXNxKTtcbiAgICBjb2VmID0gcXptczI0ICogTWF0aC5wb3codHNpLCA0LjApO1xuICAgIGNvZWYxID0gY29lZiAvIE1hdGgucG93KHBzaXNxLCAzLjUpO1xuICAgIGNjMiA9IGNvZWYxICogc2F0cmVjLm5vICogKGFvICogKDEuMCArIDEuNSAqIGV0YXNxICsgZWV0YSAqICg0LjAgKyBldGFzcSkpICsgMC4zNzUgKiBqMiAqIHRzaSAvIHBzaXNxICogc2F0cmVjLmNvbjQxICogKDguMCArIDMuMCAqIGV0YXNxICogKDguMCArIGV0YXNxKSkpO1xuICAgIHNhdHJlYy5jYzEgPSBzYXRyZWMuYnN0YXIgKiBjYzI7XG4gICAgY2MzID0gMC4wO1xuXG4gICAgaWYgKHNhdHJlYy5lY2NvID4gMS4wZS00KSB7XG4gICAgICBjYzMgPSAtMi4wICogY29lZiAqIHRzaSAqIGozb2oyICogc2F0cmVjLm5vICogc2luaW8gLyBzYXRyZWMuZWNjbztcbiAgICB9XG5cbiAgICBzYXRyZWMueDFtdGgyID0gMS4wIC0gY29zaW8yO1xuICAgIHNhdHJlYy5jYzQgPSAyLjAgKiBzYXRyZWMubm8gKiBjb2VmMSAqIGFvICogb21lb3NxICogKHNhdHJlYy5ldGEgKiAoMi4wICsgMC41ICogZXRhc3EpICsgc2F0cmVjLmVjY28gKiAoMC41ICsgMi4wICogZXRhc3EpIC0gajIgKiB0c2kgLyAoYW8gKiBwc2lzcSkgKiAoLTMuMCAqIHNhdHJlYy5jb240MSAqICgxLjAgLSAyLjAgKiBlZXRhICsgZXRhc3EgKiAoMS41IC0gMC41ICogZWV0YSkpICsgMC43NSAqIHNhdHJlYy54MW10aDIgKiAoMi4wICogZXRhc3EgLSBlZXRhICogKDEuMCArIGV0YXNxKSkgKiBNYXRoLmNvcygyLjAgKiBzYXRyZWMuYXJncG8pKSk7XG4gICAgc2F0cmVjLmNjNSA9IDIuMCAqIGNvZWYxICogYW8gKiBvbWVvc3EgKiAoMS4wICsgMi43NSAqIChldGFzcSArIGVldGEpICsgZWV0YSAqIGV0YXNxKTtcbiAgICBjb3NpbzQgPSBjb3NpbzIgKiBjb3NpbzI7XG4gICAgdGVtcDEgPSAxLjUgKiBqMiAqIHBpbnZzcSAqIHNhdHJlYy5ubztcbiAgICB0ZW1wMiA9IDAuNSAqIHRlbXAxICogajIgKiBwaW52c3E7XG4gICAgdGVtcDMgPSAtMC40Njg3NSAqIGo0ICogcGludnNxICogcGludnNxICogc2F0cmVjLm5vO1xuICAgIHNhdHJlYy5tZG90ID0gc2F0cmVjLm5vICsgMC41ICogdGVtcDEgKiBydGVvc3EgKiBzYXRyZWMuY29uNDEgKyAwLjA2MjUgKiB0ZW1wMiAqIHJ0ZW9zcSAqICgxMy4wIC0gNzguMCAqIGNvc2lvMiArIDEzNy4wICogY29zaW80KTtcbiAgICBzYXRyZWMuYXJncGRvdCA9IC0wLjUgKiB0ZW1wMSAqIGNvbjQyICsgMC4wNjI1ICogdGVtcDIgKiAoNy4wIC0gMTE0LjAgKiBjb3NpbzIgKyAzOTUuMCAqIGNvc2lvNCkgKyB0ZW1wMyAqICgzLjAgLSAzNi4wICogY29zaW8yICsgNDkuMCAqIGNvc2lvNCk7XG4gICAgeGhkb3QxID0gLXRlbXAxICogY29zaW87XG4gICAgc2F0cmVjLm5vZGVkb3QgPSB4aGRvdDEgKyAoMC41ICogdGVtcDIgKiAoNC4wIC0gMTkuMCAqIGNvc2lvMikgKyAyLjAgKiB0ZW1wMyAqICgzLjAgLSA3LjAgKiBjb3NpbzIpKSAqIGNvc2lvO1xuICAgIHhwaWRvdCA9IHNhdHJlYy5hcmdwZG90ICsgc2F0cmVjLm5vZGVkb3Q7XG4gICAgc2F0cmVjLm9tZ2NvZiA9IHNhdHJlYy5ic3RhciAqIGNjMyAqIE1hdGguY29zKHNhdHJlYy5hcmdwbyk7XG4gICAgc2F0cmVjLnhtY29mID0gMC4wO1xuXG4gICAgaWYgKHNhdHJlYy5lY2NvID4gMS4wZS00KSB7XG4gICAgICBzYXRyZWMueG1jb2YgPSAteDJvMyAqIGNvZWYgKiBzYXRyZWMuYnN0YXIgLyBlZXRhO1xuICAgIH1cblxuICAgIHNhdHJlYy5ub2RlY2YgPSAzLjUgKiBvbWVvc3EgKiB4aGRvdDEgKiBzYXRyZWMuY2MxO1xuICAgIHNhdHJlYy50MmNvZiA9IDEuNSAqIHNhdHJlYy5jYzE7IC8vIHNncDRmaXggZm9yIGRpdmlkZSBieSB6ZXJvIHdpdGggeGluY28gPSAxODAgZGVnXG5cbiAgICBpZiAoTWF0aC5hYnMoY29zaW8gKyAxLjApID4gMS41ZS0xMikge1xuICAgICAgc2F0cmVjLnhsY29mID0gLTAuMjUgKiBqM29qMiAqIHNpbmlvICogKDMuMCArIDUuMCAqIGNvc2lvKSAvICgxLjAgKyBjb3Npbyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNhdHJlYy54bGNvZiA9IC0wLjI1ICogajNvajIgKiBzaW5pbyAqICgzLjAgKyA1LjAgKiBjb3NpbykgLyB0ZW1wNDtcbiAgICB9XG5cbiAgICBzYXRyZWMuYXljb2YgPSAtMC41ICogajNvajIgKiBzaW5pbzsgLy8gc2dwNGZpeCB1c2UgbXVsdGlwbHkgZm9yIHNwZWVkIGluc3RlYWQgb2YgcG93XG5cbiAgICB2YXIgZGVsbW90ZW1wID0gMS4wICsgc2F0cmVjLmV0YSAqIE1hdGguY29zKHNhdHJlYy5tbyk7XG4gICAgc2F0cmVjLmRlbG1vID0gZGVsbW90ZW1wICogZGVsbW90ZW1wICogZGVsbW90ZW1wO1xuICAgIHNhdHJlYy5zaW5tYW8gPSBNYXRoLnNpbihzYXRyZWMubW8pO1xuICAgIHNhdHJlYy54N3RobTEgPSA3LjAgKiBjb3NpbzIgLSAxLjA7IC8vIC0tLS0tLS0tLS0tLS0tLSBkZWVwIHNwYWNlIGluaXRpYWxpemF0aW9uIC0tLS0tLS0tLS0tLS1cblxuICAgIGlmICgyICogcGkgLyBzYXRyZWMubm8gPj0gMjI1LjApIHtcbiAgICAgIHNhdHJlYy5tZXRob2QgPSAnZCc7XG4gICAgICBzYXRyZWMuaXNpbXAgPSAxO1xuICAgICAgdGMgPSAwLjA7XG4gICAgICBpbmNsbSA9IHNhdHJlYy5pbmNsbztcbiAgICAgIHZhciBkc2NvbU9wdGlvbnMgPSB7XG4gICAgICAgIGVwb2NoOiBlcG9jaCxcbiAgICAgICAgZXA6IHNhdHJlYy5lY2NvLFxuICAgICAgICBhcmdwcDogc2F0cmVjLmFyZ3BvLFxuICAgICAgICB0YzogdGMsXG4gICAgICAgIGluY2xwOiBzYXRyZWMuaW5jbG8sXG4gICAgICAgIG5vZGVwOiBzYXRyZWMubm9kZW8sXG4gICAgICAgIG5wOiBzYXRyZWMubm8sXG4gICAgICAgIGUzOiBzYXRyZWMuZTMsXG4gICAgICAgIGVlMjogc2F0cmVjLmVlMixcbiAgICAgICAgcGVvOiBzYXRyZWMucGVvLFxuICAgICAgICBwZ2hvOiBzYXRyZWMucGdobyxcbiAgICAgICAgcGhvOiBzYXRyZWMucGhvLFxuICAgICAgICBwaW5jbzogc2F0cmVjLnBpbmNvLFxuICAgICAgICBwbG86IHNhdHJlYy5wbG8sXG4gICAgICAgIHNlMjogc2F0cmVjLnNlMixcbiAgICAgICAgc2UzOiBzYXRyZWMuc2UzLFxuICAgICAgICBzZ2gyOiBzYXRyZWMuc2doMixcbiAgICAgICAgc2doMzogc2F0cmVjLnNnaDMsXG4gICAgICAgIHNnaDQ6IHNhdHJlYy5zZ2g0LFxuICAgICAgICBzaDI6IHNhdHJlYy5zaDIsXG4gICAgICAgIHNoMzogc2F0cmVjLnNoMyxcbiAgICAgICAgc2kyOiBzYXRyZWMuc2kyLFxuICAgICAgICBzaTM6IHNhdHJlYy5zaTMsXG4gICAgICAgIHNsMjogc2F0cmVjLnNsMixcbiAgICAgICAgc2wzOiBzYXRyZWMuc2wzLFxuICAgICAgICBzbDQ6IHNhdHJlYy5zbDQsXG4gICAgICAgIHhnaDI6IHNhdHJlYy54Z2gyLFxuICAgICAgICB4Z2gzOiBzYXRyZWMueGdoMyxcbiAgICAgICAgeGdoNDogc2F0cmVjLnhnaDQsXG4gICAgICAgIHhoMjogc2F0cmVjLnhoMixcbiAgICAgICAgeGgzOiBzYXRyZWMueGgzLFxuICAgICAgICB4aTI6IHNhdHJlYy54aTIsXG4gICAgICAgIHhpMzogc2F0cmVjLnhpMyxcbiAgICAgICAgeGwyOiBzYXRyZWMueGwyLFxuICAgICAgICB4bDM6IHNhdHJlYy54bDMsXG4gICAgICAgIHhsNDogc2F0cmVjLnhsNCxcbiAgICAgICAgem1vbDogc2F0cmVjLnptb2wsXG4gICAgICAgIHptb3M6IHNhdHJlYy56bW9zXG4gICAgICB9O1xuICAgICAgdmFyIGRzY29tUmVzdWx0ID0gZHNjb20oZHNjb21PcHRpb25zKTtcbiAgICAgIHNhdHJlYy5lMyA9IGRzY29tUmVzdWx0LmUzO1xuICAgICAgc2F0cmVjLmVlMiA9IGRzY29tUmVzdWx0LmVlMjtcbiAgICAgIHNhdHJlYy5wZW8gPSBkc2NvbVJlc3VsdC5wZW87XG4gICAgICBzYXRyZWMucGdobyA9IGRzY29tUmVzdWx0LnBnaG87XG4gICAgICBzYXRyZWMucGhvID0gZHNjb21SZXN1bHQucGhvO1xuICAgICAgc2F0cmVjLnBpbmNvID0gZHNjb21SZXN1bHQucGluY287XG4gICAgICBzYXRyZWMucGxvID0gZHNjb21SZXN1bHQucGxvO1xuICAgICAgc2F0cmVjLnNlMiA9IGRzY29tUmVzdWx0LnNlMjtcbiAgICAgIHNhdHJlYy5zZTMgPSBkc2NvbVJlc3VsdC5zZTM7XG4gICAgICBzYXRyZWMuc2doMiA9IGRzY29tUmVzdWx0LnNnaDI7XG4gICAgICBzYXRyZWMuc2doMyA9IGRzY29tUmVzdWx0LnNnaDM7XG4gICAgICBzYXRyZWMuc2doNCA9IGRzY29tUmVzdWx0LnNnaDQ7XG4gICAgICBzYXRyZWMuc2gyID0gZHNjb21SZXN1bHQuc2gyO1xuICAgICAgc2F0cmVjLnNoMyA9IGRzY29tUmVzdWx0LnNoMztcbiAgICAgIHNhdHJlYy5zaTIgPSBkc2NvbVJlc3VsdC5zaTI7XG4gICAgICBzYXRyZWMuc2kzID0gZHNjb21SZXN1bHQuc2kzO1xuICAgICAgc2F0cmVjLnNsMiA9IGRzY29tUmVzdWx0LnNsMjtcbiAgICAgIHNhdHJlYy5zbDMgPSBkc2NvbVJlc3VsdC5zbDM7XG4gICAgICBzYXRyZWMuc2w0ID0gZHNjb21SZXN1bHQuc2w0O1xuICAgICAgc2luaW0gPSBkc2NvbVJlc3VsdC5zaW5pbTtcbiAgICAgIGNvc2ltID0gZHNjb21SZXN1bHQuY29zaW07XG4gICAgICBlbSA9IGRzY29tUmVzdWx0LmVtO1xuICAgICAgZW1zcSA9IGRzY29tUmVzdWx0LmVtc3E7XG4gICAgICBzMSA9IGRzY29tUmVzdWx0LnMxO1xuICAgICAgczIgPSBkc2NvbVJlc3VsdC5zMjtcbiAgICAgIHMzID0gZHNjb21SZXN1bHQuczM7XG4gICAgICBzNCA9IGRzY29tUmVzdWx0LnM0O1xuICAgICAgczUgPSBkc2NvbVJlc3VsdC5zNTtcbiAgICAgIHNzMSA9IGRzY29tUmVzdWx0LnNzMTtcbiAgICAgIHNzMiA9IGRzY29tUmVzdWx0LnNzMjtcbiAgICAgIHNzMyA9IGRzY29tUmVzdWx0LnNzMztcbiAgICAgIHNzNCA9IGRzY29tUmVzdWx0LnNzNDtcbiAgICAgIHNzNSA9IGRzY29tUmVzdWx0LnNzNTtcbiAgICAgIHN6MSA9IGRzY29tUmVzdWx0LnN6MTtcbiAgICAgIHN6MyA9IGRzY29tUmVzdWx0LnN6MztcbiAgICAgIHN6MTEgPSBkc2NvbVJlc3VsdC5zejExO1xuICAgICAgc3oxMyA9IGRzY29tUmVzdWx0LnN6MTM7XG4gICAgICBzejIxID0gZHNjb21SZXN1bHQuc3oyMTtcbiAgICAgIHN6MjMgPSBkc2NvbVJlc3VsdC5zejIzO1xuICAgICAgc3ozMSA9IGRzY29tUmVzdWx0LnN6MzE7XG4gICAgICBzejMzID0gZHNjb21SZXN1bHQuc3ozMztcbiAgICAgIHNhdHJlYy54Z2gyID0gZHNjb21SZXN1bHQueGdoMjtcbiAgICAgIHNhdHJlYy54Z2gzID0gZHNjb21SZXN1bHQueGdoMztcbiAgICAgIHNhdHJlYy54Z2g0ID0gZHNjb21SZXN1bHQueGdoNDtcbiAgICAgIHNhdHJlYy54aDIgPSBkc2NvbVJlc3VsdC54aDI7XG4gICAgICBzYXRyZWMueGgzID0gZHNjb21SZXN1bHQueGgzO1xuICAgICAgc2F0cmVjLnhpMiA9IGRzY29tUmVzdWx0LnhpMjtcbiAgICAgIHNhdHJlYy54aTMgPSBkc2NvbVJlc3VsdC54aTM7XG4gICAgICBzYXRyZWMueGwyID0gZHNjb21SZXN1bHQueGwyO1xuICAgICAgc2F0cmVjLnhsMyA9IGRzY29tUmVzdWx0LnhsMztcbiAgICAgIHNhdHJlYy54bDQgPSBkc2NvbVJlc3VsdC54bDQ7XG4gICAgICBzYXRyZWMuem1vbCA9IGRzY29tUmVzdWx0Lnptb2w7XG4gICAgICBzYXRyZWMuem1vcyA9IGRzY29tUmVzdWx0Lnptb3M7XG4gICAgICBubSA9IGRzY29tUmVzdWx0Lm5tO1xuICAgICAgejEgPSBkc2NvbVJlc3VsdC56MTtcbiAgICAgIHozID0gZHNjb21SZXN1bHQuejM7XG4gICAgICB6MTEgPSBkc2NvbVJlc3VsdC56MTE7XG4gICAgICB6MTMgPSBkc2NvbVJlc3VsdC56MTM7XG4gICAgICB6MjEgPSBkc2NvbVJlc3VsdC56MjE7XG4gICAgICB6MjMgPSBkc2NvbVJlc3VsdC56MjM7XG4gICAgICB6MzEgPSBkc2NvbVJlc3VsdC56MzE7XG4gICAgICB6MzMgPSBkc2NvbVJlc3VsdC56MzM7XG4gICAgICB2YXIgZHBwZXJPcHRpb25zID0ge1xuICAgICAgICBpbmNsbzogaW5jbG0sXG4gICAgICAgIGluaXQ6IHNhdHJlYy5pbml0LFxuICAgICAgICBlcDogc2F0cmVjLmVjY28sXG4gICAgICAgIGluY2xwOiBzYXRyZWMuaW5jbG8sXG4gICAgICAgIG5vZGVwOiBzYXRyZWMubm9kZW8sXG4gICAgICAgIGFyZ3BwOiBzYXRyZWMuYXJncG8sXG4gICAgICAgIG1wOiBzYXRyZWMubW8sXG4gICAgICAgIG9wc21vZGU6IHNhdHJlYy5vcGVyYXRpb25tb2RlXG4gICAgICB9O1xuICAgICAgdmFyIGRwcGVyUmVzdWx0ID0gZHBwZXIoc2F0cmVjLCBkcHBlck9wdGlvbnMpO1xuICAgICAgc2F0cmVjLmVjY28gPSBkcHBlclJlc3VsdC5lcDtcbiAgICAgIHNhdHJlYy5pbmNsbyA9IGRwcGVyUmVzdWx0LmluY2xwO1xuICAgICAgc2F0cmVjLm5vZGVvID0gZHBwZXJSZXN1bHQubm9kZXA7XG4gICAgICBzYXRyZWMuYXJncG8gPSBkcHBlclJlc3VsdC5hcmdwcDtcbiAgICAgIHNhdHJlYy5tbyA9IGRwcGVyUmVzdWx0Lm1wO1xuICAgICAgYXJncG0gPSAwLjA7XG4gICAgICBub2RlbSA9IDAuMDtcbiAgICAgIG1tID0gMC4wO1xuICAgICAgdmFyIGRzaW5pdE9wdGlvbnMgPSB7XG4gICAgICAgIGNvc2ltOiBjb3NpbSxcbiAgICAgICAgZW1zcTogZW1zcSxcbiAgICAgICAgYXJncG86IHNhdHJlYy5hcmdwbyxcbiAgICAgICAgczE6IHMxLFxuICAgICAgICBzMjogczIsXG4gICAgICAgIHMzOiBzMyxcbiAgICAgICAgczQ6IHM0LFxuICAgICAgICBzNTogczUsXG4gICAgICAgIHNpbmltOiBzaW5pbSxcbiAgICAgICAgc3MxOiBzczEsXG4gICAgICAgIHNzMjogc3MyLFxuICAgICAgICBzczM6IHNzMyxcbiAgICAgICAgc3M0OiBzczQsXG4gICAgICAgIHNzNTogc3M1LFxuICAgICAgICBzejE6IHN6MSxcbiAgICAgICAgc3ozOiBzejMsXG4gICAgICAgIHN6MTE6IHN6MTEsXG4gICAgICAgIHN6MTM6IHN6MTMsXG4gICAgICAgIHN6MjE6IHN6MjEsXG4gICAgICAgIHN6MjM6IHN6MjMsXG4gICAgICAgIHN6MzE6IHN6MzEsXG4gICAgICAgIHN6MzM6IHN6MzMsXG4gICAgICAgIHQ6IHNhdHJlYy50LFxuICAgICAgICB0YzogdGMsXG4gICAgICAgIGdzdG86IHNhdHJlYy5nc3RvLFxuICAgICAgICBtbzogc2F0cmVjLm1vLFxuICAgICAgICBtZG90OiBzYXRyZWMubWRvdCxcbiAgICAgICAgbm86IHNhdHJlYy5ubyxcbiAgICAgICAgbm9kZW86IHNhdHJlYy5ub2RlbyxcbiAgICAgICAgbm9kZWRvdDogc2F0cmVjLm5vZGVkb3QsXG4gICAgICAgIHhwaWRvdDogeHBpZG90LFxuICAgICAgICB6MTogejEsXG4gICAgICAgIHozOiB6MyxcbiAgICAgICAgejExOiB6MTEsXG4gICAgICAgIHoxMzogejEzLFxuICAgICAgICB6MjE6IHoyMSxcbiAgICAgICAgejIzOiB6MjMsXG4gICAgICAgIHozMTogejMxLFxuICAgICAgICB6MzM6IHozMyxcbiAgICAgICAgZWNjbzogc2F0cmVjLmVjY28sXG4gICAgICAgIGVjY3NxOiBlY2NzcSxcbiAgICAgICAgZW06IGVtLFxuICAgICAgICBhcmdwbTogYXJncG0sXG4gICAgICAgIGluY2xtOiBpbmNsbSxcbiAgICAgICAgbW06IG1tLFxuICAgICAgICBubTogbm0sXG4gICAgICAgIG5vZGVtOiBub2RlbSxcbiAgICAgICAgaXJlejogc2F0cmVjLmlyZXosXG4gICAgICAgIGF0aW1lOiBzYXRyZWMuYXRpbWUsXG4gICAgICAgIGQyMjAxOiBzYXRyZWMuZDIyMDEsXG4gICAgICAgIGQyMjExOiBzYXRyZWMuZDIyMTEsXG4gICAgICAgIGQzMjEwOiBzYXRyZWMuZDMyMTAsXG4gICAgICAgIGQzMjIyOiBzYXRyZWMuZDMyMjIsXG4gICAgICAgIGQ0NDEwOiBzYXRyZWMuZDQ0MTAsXG4gICAgICAgIGQ0NDIyOiBzYXRyZWMuZDQ0MjIsXG4gICAgICAgIGQ1MjIwOiBzYXRyZWMuZDUyMjAsXG4gICAgICAgIGQ1MjMyOiBzYXRyZWMuZDUyMzIsXG4gICAgICAgIGQ1NDIxOiBzYXRyZWMuZDU0MjEsXG4gICAgICAgIGQ1NDMzOiBzYXRyZWMuZDU0MzMsXG4gICAgICAgIGRlZHQ6IHNhdHJlYy5kZWR0LFxuICAgICAgICBkaWR0OiBzYXRyZWMuZGlkdCxcbiAgICAgICAgZG1kdDogc2F0cmVjLmRtZHQsXG4gICAgICAgIGRub2R0OiBzYXRyZWMuZG5vZHQsXG4gICAgICAgIGRvbWR0OiBzYXRyZWMuZG9tZHQsXG4gICAgICAgIGRlbDE6IHNhdHJlYy5kZWwxLFxuICAgICAgICBkZWwyOiBzYXRyZWMuZGVsMixcbiAgICAgICAgZGVsMzogc2F0cmVjLmRlbDMsXG4gICAgICAgIHhmYWN0OiBzYXRyZWMueGZhY3QsXG4gICAgICAgIHhsYW1vOiBzYXRyZWMueGxhbW8sXG4gICAgICAgIHhsaTogc2F0cmVjLnhsaSxcbiAgICAgICAgeG5pOiBzYXRyZWMueG5pXG4gICAgICB9O1xuICAgICAgdmFyIGRzaW5pdFJlc3VsdCA9IGRzaW5pdChkc2luaXRPcHRpb25zKTtcbiAgICAgIHNhdHJlYy5pcmV6ID0gZHNpbml0UmVzdWx0LmlyZXo7XG4gICAgICBzYXRyZWMuYXRpbWUgPSBkc2luaXRSZXN1bHQuYXRpbWU7XG4gICAgICBzYXRyZWMuZDIyMDEgPSBkc2luaXRSZXN1bHQuZDIyMDE7XG4gICAgICBzYXRyZWMuZDIyMTEgPSBkc2luaXRSZXN1bHQuZDIyMTE7XG4gICAgICBzYXRyZWMuZDMyMTAgPSBkc2luaXRSZXN1bHQuZDMyMTA7XG4gICAgICBzYXRyZWMuZDMyMjIgPSBkc2luaXRSZXN1bHQuZDMyMjI7XG4gICAgICBzYXRyZWMuZDQ0MTAgPSBkc2luaXRSZXN1bHQuZDQ0MTA7XG4gICAgICBzYXRyZWMuZDQ0MjIgPSBkc2luaXRSZXN1bHQuZDQ0MjI7XG4gICAgICBzYXRyZWMuZDUyMjAgPSBkc2luaXRSZXN1bHQuZDUyMjA7XG4gICAgICBzYXRyZWMuZDUyMzIgPSBkc2luaXRSZXN1bHQuZDUyMzI7XG4gICAgICBzYXRyZWMuZDU0MjEgPSBkc2luaXRSZXN1bHQuZDU0MjE7XG4gICAgICBzYXRyZWMuZDU0MzMgPSBkc2luaXRSZXN1bHQuZDU0MzM7XG4gICAgICBzYXRyZWMuZGVkdCA9IGRzaW5pdFJlc3VsdC5kZWR0O1xuICAgICAgc2F0cmVjLmRpZHQgPSBkc2luaXRSZXN1bHQuZGlkdDtcbiAgICAgIHNhdHJlYy5kbWR0ID0gZHNpbml0UmVzdWx0LmRtZHQ7XG4gICAgICBzYXRyZWMuZG5vZHQgPSBkc2luaXRSZXN1bHQuZG5vZHQ7XG4gICAgICBzYXRyZWMuZG9tZHQgPSBkc2luaXRSZXN1bHQuZG9tZHQ7XG4gICAgICBzYXRyZWMuZGVsMSA9IGRzaW5pdFJlc3VsdC5kZWwxO1xuICAgICAgc2F0cmVjLmRlbDIgPSBkc2luaXRSZXN1bHQuZGVsMjtcbiAgICAgIHNhdHJlYy5kZWwzID0gZHNpbml0UmVzdWx0LmRlbDM7XG4gICAgICBzYXRyZWMueGZhY3QgPSBkc2luaXRSZXN1bHQueGZhY3Q7XG4gICAgICBzYXRyZWMueGxhbW8gPSBkc2luaXRSZXN1bHQueGxhbW87XG4gICAgICBzYXRyZWMueGxpID0gZHNpbml0UmVzdWx0LnhsaTtcbiAgICAgIHNhdHJlYy54bmkgPSBkc2luaXRSZXN1bHQueG5pO1xuICAgIH0gLy8gLS0tLS0tLS0tLS0gc2V0IHZhcmlhYmxlcyBpZiBub3QgZGVlcCBzcGFjZSAtLS0tLS0tLS0tLVxuXG5cbiAgICBpZiAoc2F0cmVjLmlzaW1wICE9PSAxKSB7XG4gICAgICBjYzFzcSA9IHNhdHJlYy5jYzEgKiBzYXRyZWMuY2MxO1xuICAgICAgc2F0cmVjLmQyID0gNC4wICogYW8gKiB0c2kgKiBjYzFzcTtcbiAgICAgIHRlbXAgPSBzYXRyZWMuZDIgKiB0c2kgKiBzYXRyZWMuY2MxIC8gMy4wO1xuICAgICAgc2F0cmVjLmQzID0gKDE3LjAgKiBhbyArIHNmb3VyKSAqIHRlbXA7XG4gICAgICBzYXRyZWMuZDQgPSAwLjUgKiB0ZW1wICogYW8gKiB0c2kgKiAoMjIxLjAgKiBhbyArIDMxLjAgKiBzZm91cikgKiBzYXRyZWMuY2MxO1xuICAgICAgc2F0cmVjLnQzY29mID0gc2F0cmVjLmQyICsgMi4wICogY2Mxc3E7XG4gICAgICBzYXRyZWMudDRjb2YgPSAwLjI1ICogKDMuMCAqIHNhdHJlYy5kMyArIHNhdHJlYy5jYzEgKiAoMTIuMCAqIHNhdHJlYy5kMiArIDEwLjAgKiBjYzFzcSkpO1xuICAgICAgc2F0cmVjLnQ1Y29mID0gMC4yICogKDMuMCAqIHNhdHJlYy5kNCArIDEyLjAgKiBzYXRyZWMuY2MxICogc2F0cmVjLmQzICsgNi4wICogc2F0cmVjLmQyICogc2F0cmVjLmQyICsgMTUuMCAqIGNjMXNxICogKDIuMCAqIHNhdHJlYy5kMiArIGNjMXNxKSk7XG4gICAgfVxuICAgIC8qIGZpbmFsbHkgcHJvcG9nYXRlIHRvIHplcm8gZXBvY2ggdG8gaW5pdGlhbGl6ZSBhbGwgb3RoZXJzLiAqL1xuICAgIC8vIHNncDRmaXggdGFrZSBvdXQgY2hlY2sgdG8gbGV0IHNhdGVsbGl0ZXMgcHJvY2VzcyB1bnRpbCB0aGV5IGFyZSBhY3R1YWxseSBiZWxvdyBlYXJ0aCBzdXJmYWNlXG4gICAgLy8gaWYoc2F0cmVjLmVycm9yID09IDApXG5cbiAgfVxuXG4gIHNncDQoc2F0cmVjLCAwKTtcbiAgc2F0cmVjLmluaXQgPSAnbic7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbn1cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiB0d29saW5lMnJ2XG4gKlxuICogIHRoaXMgZnVuY3Rpb24gY29udmVydHMgdGhlIHR3byBsaW5lIGVsZW1lbnQgc2V0IGNoYXJhY3RlciBzdHJpbmcgZGF0YSB0b1xuICogICAgdmFyaWFibGVzIGFuZCBpbml0aWFsaXplcyB0aGUgc2dwNCB2YXJpYWJsZXMuIHNldmVyYWwgaW50ZXJtZWRpYXRlIHZhcmFpYmxlc1xuICogICAgYW5kIHF1YW50aXRpZXMgYXJlIGRldGVybWluZWQuIG5vdGUgdGhhdCB0aGUgcmVzdWx0IGlzIGEgc3RydWN0dXJlIHNvIG11bHRpcGxlXG4gKiAgICBzYXRlbGxpdGVzIGNhbiBiZSBwcm9jZXNzZWQgc2ltdWx0YW5lb3VzbHkgd2l0aG91dCBoYXZpbmcgdG8gcmVpbml0aWFsaXplLiB0aGVcbiAqICAgIHZlcmlmaWNhdGlvbiBtb2RlIGlzIGFuIGltcG9ydGFudCBvcHRpb24gdGhhdCBwZXJtaXRzIHF1aWNrIGNoZWNrcyBvZiBhbnlcbiAqICAgIGNoYW5nZXMgdG8gdGhlIHVuZGVybHlpbmcgdGVjaG5pY2FsIHRoZW9yeS4gdGhpcyBvcHRpb24gd29ya3MgdXNpbmcgYVxuICogICAgbW9kaWZpZWQgdGxlIGZpbGUgaW4gd2hpY2ggdGhlIHN0YXJ0LCBzdG9wLCBhbmQgZGVsdGEgdGltZSB2YWx1ZXMgYXJlXG4gKiAgICBpbmNsdWRlZCBhdCB0aGUgZW5kIG9mIHRoZSBzZWNvbmQgbGluZSBvZiBkYXRhLiB0aGlzIG9ubHkgd29ya3Mgd2l0aCB0aGVcbiAqICAgIHZlcmlmaWNhdGlvbiBtb2RlLiB0aGUgY2F0YWxvZyBtb2RlIHNpbXBseSBwcm9wYWdhdGVzIGZyb20gLTE0NDAgdG8gMTQ0MCBtaW5cbiAqICAgIGZyb20gZXBvY2ggYW5kIGlzIHVzZWZ1bCB3aGVuIHBlcmZvcm1pbmcgZW50aXJlIGNhdGFsb2cgcnVucy5cbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAgMSBtYXIgMjAwMVxuICpcbiAqICBpbnB1dHMgICAgICAgIDpcbiAqICAgIGxvbmdzdHIxICAgIC0gZmlyc3QgbGluZSBvZiB0aGUgdGxlXG4gKiAgICBsb25nc3RyMiAgICAtIHNlY29uZCBsaW5lIG9mIHRoZSB0bGVcbiAqICAgIHR5cGVydW4gICAgIC0gdHlwZSBvZiBydW4gICAgICAgICAgICAgICAgICAgIHZlcmlmaWNhdGlvbiAndicsIGNhdGFsb2cgJ2MnLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFudWFsICdtJ1xuICogICAgdHlwZWlucHV0ICAgLSB0eXBlIG9mIG1hbnVhbCBpbnB1dCAgICAgICAgICAgbWZlICdtJywgZXBvY2ggJ2UnLCBkYXlvZnlyICdkJ1xuICogICAgb3BzbW9kZSAgICAgLSBtb2RlIG9mIG9wZXJhdGlvbiBhZnNwYyBvciBpbXByb3ZlZCAnYScsICdpJ1xuICogICAgd2hpY2hjb25zdCAgLSB3aGljaCBzZXQgb2YgY29uc3RhbnRzIHRvIHVzZSAgNzIsIDg0XG4gKlxuICogIG91dHB1dHMgICAgICAgOlxuICogICAgc2F0cmVjICAgICAgLSBzdHJ1Y3R1cmUgY29udGFpbmluZyBhbGwgdGhlIHNncDQgc2F0ZWxsaXRlIGluZm9ybWF0aW9uXG4gKlxuICogIGNvdXBsaW5nICAgICAgOlxuICogICAgZ2V0Z3JhdmNvbnN0LVxuICogICAgZGF5czJtZGhtcyAgLSBjb252ZXJzaW9uIG9mIGRheXMgdG8gbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmRcbiAqICAgIGpkYXkgICAgICAgIC0gY29udmVydCBkYXkgbW9udGggeWVhciBob3VyIG1pbnV0ZSBzZWNvbmQgaW50byBqdWxpYW4gZGF0ZVxuICogICAgc2dwNGluaXQgICAgLSBpbml0aWFsaXplIHRoZSBzZ3A0IHZhcmlhYmxlc1xuICpcbiAqICByZWZlcmVuY2VzICAgIDpcbiAqICAgIG5vcmFkIHNwYWNldHJhY2sgcmVwb3J0ICMzXG4gKiAgICB2YWxsYWRvLCBjcmF3Zm9yZCwgaHVqc2FrLCBrZWxzbyAgMjAwNlxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKipcbiAqIFJldHVybiBhIFNhdGVsbGl0ZSBpbXBvcnRlZCBmcm9tIHR3byBsaW5lcyBvZiBUTEUgZGF0YS5cbiAqXG4gKiBQcm92aWRlIHRoZSB0d28gVExFIGxpbmVzIGFzIHN0cmluZ3MgYGxvbmdzdHIxYCBhbmQgYGxvbmdzdHIyYCxcbiAqIGFuZCBzZWxlY3Qgd2hpY2ggc3RhbmRhcmQgc2V0IG9mIGdyYXZpdGF0aW9uYWwgY29uc3RhbnRzIHlvdSB3YW50XG4gKiBieSBwcm92aWRpbmcgYGdyYXZpdHlfY29uc3RhbnRzYDpcbiAqXG4gKiBgc2dwNC5wcm9wYWdhdGlvbi53Z3M3MmAgLSBTdGFuZGFyZCBXR1MgNzIgbW9kZWxcbiAqIGBzZ3A0LnByb3BhZ2F0aW9uLndnczg0YCAtIE1vcmUgcmVjZW50IFdHUyA4NCBtb2RlbFxuICogYHNncDQucHJvcGFnYXRpb24ud2dzNzJvbGRgIC0gTGVnYWN5IHN1cHBvcnQgZm9yIG9sZCBTR1A0IGJlaGF2aW9yXG4gKlxuICogTm9ybWFsbHksIGNvbXB1dGF0aW9ucyBhcmUgbWFkZSB1c2luZyBsZXRpb3VzIHJlY2VudCBpbXByb3ZlbWVudHNcbiAqIHRvIHRoZSBhbGdvcml0aG0uICBJZiB5b3Ugd2FudCB0byB0dXJuIHNvbWUgb2YgdGhlc2Ugb2ZmIGFuZCBnb1xuICogYmFjayBpbnRvIFwiYWZzcGNcIiBtb2RlLCB0aGVuIHNldCBgYWZzcGNfbW9kZWAgdG8gYFRydWVgLlxuICovXG5cblxuZnVuY3Rpb24gdHdvbGluZTJzYXRyZWMobG9uZ3N0cjEsIGxvbmdzdHIyKSB7XG4gIHZhciBvcHNtb2RlID0gJ2knO1xuICB2YXIgeHBkb3RwID0gMTQ0MC4wIC8gKDIuMCAqIHBpKTsgLy8gMjI5LjE4MzExODA1MjMyOTM7XG5cbiAgdmFyIHllYXIgPSAwO1xuICB2YXIgc2F0cmVjID0ge307XG4gIHNhdHJlYy5lcnJvciA9IDA7XG4gIHNhdHJlYy5zYXRudW0gPSBsb25nc3RyMS5zdWJzdHJpbmcoMiwgNyk7XG4gIHNhdHJlYy5lcG9jaHlyID0gcGFyc2VJbnQobG9uZ3N0cjEuc3Vic3RyaW5nKDE4LCAyMCksIDEwKTtcbiAgc2F0cmVjLmVwb2NoZGF5cyA9IHBhcnNlRmxvYXQobG9uZ3N0cjEuc3Vic3RyaW5nKDIwLCAzMikpO1xuICBzYXRyZWMubmRvdCA9IHBhcnNlRmxvYXQobG9uZ3N0cjEuc3Vic3RyaW5nKDMzLCA0MykpO1xuICBzYXRyZWMubmRkb3QgPSBwYXJzZUZsb2F0KFwiLlwiLmNvbmNhdChwYXJzZUludChsb25nc3RyMS5zdWJzdHJpbmcoNDQsIDUwKSwgMTApLCBcIkVcIikuY29uY2F0KGxvbmdzdHIxLnN1YnN0cmluZyg1MCwgNTIpKSk7XG4gIHNhdHJlYy5ic3RhciA9IHBhcnNlRmxvYXQoXCJcIi5jb25jYXQobG9uZ3N0cjEuc3Vic3RyaW5nKDUzLCA1NCksIFwiLlwiKS5jb25jYXQocGFyc2VJbnQobG9uZ3N0cjEuc3Vic3RyaW5nKDU0LCA1OSksIDEwKSwgXCJFXCIpLmNvbmNhdChsb25nc3RyMS5zdWJzdHJpbmcoNTksIDYxKSkpOyAvLyBzYXRyZWMuc2F0bnVtID0gbG9uZ3N0cjIuc3Vic3RyaW5nKDIsIDcpO1xuXG4gIHNhdHJlYy5pbmNsbyA9IHBhcnNlRmxvYXQobG9uZ3N0cjIuc3Vic3RyaW5nKDgsIDE2KSk7XG4gIHNhdHJlYy5ub2RlbyA9IHBhcnNlRmxvYXQobG9uZ3N0cjIuc3Vic3RyaW5nKDE3LCAyNSkpO1xuICBzYXRyZWMuZWNjbyA9IHBhcnNlRmxvYXQoXCIuXCIuY29uY2F0KGxvbmdzdHIyLnN1YnN0cmluZygyNiwgMzMpKSk7XG4gIHNhdHJlYy5hcmdwbyA9IHBhcnNlRmxvYXQobG9uZ3N0cjIuc3Vic3RyaW5nKDM0LCA0MikpO1xuICBzYXRyZWMubW8gPSBwYXJzZUZsb2F0KGxvbmdzdHIyLnN1YnN0cmluZyg0MywgNTEpKTtcbiAgc2F0cmVjLm5vID0gcGFyc2VGbG9hdChsb25nc3RyMi5zdWJzdHJpbmcoNTIsIDYzKSk7IC8vIC0tLS0gZmluZCBubywgbmRvdCwgbmRkb3QgLS0tLVxuXG4gIHNhdHJlYy5ubyAvPSB4cGRvdHA7IC8vICAgcmFkL21pblxuICAvLyBzYXRyZWMubmRkb3Q9IHNhdHJlYy5uZGRvdCAqIE1hdGgucG93KDEwLjAsIG5leHApO1xuICAvLyBzYXRyZWMuYnN0YXI9IHNhdHJlYy5ic3RhciAqIE1hdGgucG93KDEwLjAsIGliZXhwKTtcbiAgLy8gLS0tLSBjb252ZXJ0IHRvIHNncDQgdW5pdHMgLS0tLVxuXG4gIHNhdHJlYy5hID0gTWF0aC5wb3coc2F0cmVjLm5vICogdHVtaW4sIC0yLjAgLyAzLjApO1xuICBzYXRyZWMubmRvdCAvPSB4cGRvdHAgKiAxNDQwLjA7IC8vID8gKiBtaW5wZXJkYXlcblxuICBzYXRyZWMubmRkb3QgLz0geHBkb3RwICogMTQ0MC4wICogMTQ0MDsgLy8gLS0tLSBmaW5kIHN0YW5kYXJkIG9yYml0YWwgZWxlbWVudHMgLS0tLVxuXG4gIHNhdHJlYy5pbmNsbyAqPSBkZWcycmFkO1xuICBzYXRyZWMubm9kZW8gKj0gZGVnMnJhZDtcbiAgc2F0cmVjLmFyZ3BvICo9IGRlZzJyYWQ7XG4gIHNhdHJlYy5tbyAqPSBkZWcycmFkO1xuICBzYXRyZWMuYWx0YSA9IHNhdHJlYy5hICogKDEuMCArIHNhdHJlYy5lY2NvKSAtIDEuMDtcbiAgc2F0cmVjLmFsdHAgPSBzYXRyZWMuYSAqICgxLjAgLSBzYXRyZWMuZWNjbykgLSAxLjA7IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gZmluZCBzZ3A0ZXBvY2ggdGltZSBvZiBlbGVtZW50IHNldFxuICAvLyByZW1lbWJlciB0aGF0IHNncDQgdXNlcyB1bml0cyBvZiBkYXlzIGZyb20gMCBqYW4gMTk1MCAoc2dwNGVwb2NoKVxuICAvLyBhbmQgbWludXRlcyBmcm9tIHRoZSBlcG9jaCAodGltZSlcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tIHRlbXAgZml4IGZvciB5ZWFycyBmcm9tIDE5NTctMjA1NiAtLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIC0tLS0tLS0tLSBjb3JyZWN0IGZpeCB3aWxsIG9jY3VyIHdoZW4geWVhciBpcyA0LWRpZ2l0IGluIHRsZSAtLS0tLS0tLS1cblxuICBpZiAoc2F0cmVjLmVwb2NoeXIgPCA1Nykge1xuICAgIHllYXIgPSBzYXRyZWMuZXBvY2h5ciArIDIwMDA7XG4gIH0gZWxzZSB7XG4gICAgeWVhciA9IHNhdHJlYy5lcG9jaHlyICsgMTkwMDtcbiAgfVxuXG4gIHZhciBtZGhtc1Jlc3VsdCA9IGRheXMybWRobXMoeWVhciwgc2F0cmVjLmVwb2NoZGF5cyk7XG4gIHZhciBtb24gPSBtZGhtc1Jlc3VsdC5tb24sXG4gICAgICBkYXkgPSBtZGhtc1Jlc3VsdC5kYXksXG4gICAgICBociA9IG1kaG1zUmVzdWx0LmhyLFxuICAgICAgbWludXRlID0gbWRobXNSZXN1bHQubWludXRlLFxuICAgICAgc2VjID0gbWRobXNSZXN1bHQuc2VjO1xuICBzYXRyZWMuamRzYXRlcG9jaCA9IGpkYXkoeWVhciwgbW9uLCBkYXksIGhyLCBtaW51dGUsIHNlYyk7IC8vICAtLS0tLS0tLS0tLS0tLS0tIGluaXRpYWxpemUgdGhlIG9yYml0IGF0IHNncDRlcG9jaCAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2dwNGluaXQoc2F0cmVjLCB7XG4gICAgb3BzbW9kZTogb3BzbW9kZSxcbiAgICBzYXRuOiBzYXRyZWMuc2F0bnVtLFxuICAgIGVwb2NoOiBzYXRyZWMuamRzYXRlcG9jaCAtIDI0MzMyODEuNSxcbiAgICB4YnN0YXI6IHNhdHJlYy5ic3RhcixcbiAgICB4ZWNjbzogc2F0cmVjLmVjY28sXG4gICAgeGFyZ3BvOiBzYXRyZWMuYXJncG8sXG4gICAgeGluY2xvOiBzYXRyZWMuaW5jbG8sXG4gICAgeG1vOiBzYXRyZWMubW8sXG4gICAgeG5vOiBzYXRyZWMubm8sXG4gICAgeG5vZGVvOiBzYXRyZWMubm9kZW9cbiAgfSk7XG4gIHJldHVybiBzYXRyZWM7XG59XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHtcbiAgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTtcbn1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkoYXJyKTtcbn1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoaXRlcikpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpO1xufVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7XG4gIGlmICghbykgcmV0dXJuO1xuICBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG59XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICByZXR1cm4gYXJyMjtcbn1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn1cblxuZnVuY3Rpb24gcHJvcGFnYXRlKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9IC8vIFJldHVybiBhIHBvc2l0aW9uIGFuZCB2ZWxvY2l0eSB2ZWN0b3IgZm9yIGEgZ2l2ZW4gZGF0ZSBhbmQgdGltZS5cblxuXG4gIHZhciBzYXRyZWMgPSBhcmdzWzBdO1xuICB2YXIgZGF0ZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDEpO1xuICB2YXIgaiA9IGpkYXkuYXBwbHkodm9pZCAwLCBfdG9Db25zdW1hYmxlQXJyYXkoZGF0ZSkpO1xuICB2YXIgbSA9IChqIC0gc2F0cmVjLmpkc2F0ZXBvY2gpICogbWludXRlc1BlckRheTtcbiAgcmV0dXJuIHNncDQoc2F0cmVjLCBtKTtcbn1cblxuZnVuY3Rpb24gZG9wcGxlckZhY3Rvcihsb2NhdGlvbiwgcG9zaXRpb24sIHZlbG9jaXR5KSB7XG4gIHZhciBtZmFjdG9yID0gNy4yOTIxMTVFLTU7XG4gIHZhciBjID0gMjk5NzkyLjQ1ODsgLy8gU3BlZWQgb2YgbGlnaHQgaW4ga20vc1xuXG4gIHZhciByYW5nZSA9IHtcbiAgICB4OiBwb3NpdGlvbi54IC0gbG9jYXRpb24ueCxcbiAgICB5OiBwb3NpdGlvbi55IC0gbG9jYXRpb24ueSxcbiAgICB6OiBwb3NpdGlvbi56IC0gbG9jYXRpb24uelxuICB9O1xuICByYW5nZS53ID0gTWF0aC5zcXJ0KE1hdGgucG93KHJhbmdlLngsIDIpICsgTWF0aC5wb3cocmFuZ2UueSwgMikgKyBNYXRoLnBvdyhyYW5nZS56LCAyKSk7XG4gIHZhciByYW5nZVZlbCA9IHtcbiAgICB4OiB2ZWxvY2l0eS54ICsgbWZhY3RvciAqIGxvY2F0aW9uLnksXG4gICAgeTogdmVsb2NpdHkueSAtIG1mYWN0b3IgKiBsb2NhdGlvbi54LFxuICAgIHo6IHZlbG9jaXR5LnpcbiAgfTtcblxuICBmdW5jdGlvbiBzaWduKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID49IDAgPyAxIDogLTE7XG4gIH1cblxuICB2YXIgcmFuZ2VSYXRlID0gKHJhbmdlLnggKiByYW5nZVZlbC54ICsgcmFuZ2UueSAqIHJhbmdlVmVsLnkgKyByYW5nZS56ICogcmFuZ2VWZWwueikgLyByYW5nZS53O1xuICByZXR1cm4gMSArIHJhbmdlUmF0ZSAvIGMgKiBzaWduKHJhbmdlUmF0ZSk7XG59XG5cbmZ1bmN0aW9uIHJhZGlhbnNUb0RlZ3JlZXMocmFkaWFucykge1xuICByZXR1cm4gcmFkaWFucyAqIHJhZDJkZWc7XG59XG5cbmZ1bmN0aW9uIGRlZ3JlZXNUb1JhZGlhbnMoZGVncmVlcykge1xuICByZXR1cm4gZGVncmVlcyAqIGRlZzJyYWQ7XG59XG5cbmZ1bmN0aW9uIGRlZ3JlZXNMYXQocmFkaWFucykge1xuICBpZiAocmFkaWFucyA8IC1waSAvIDIgfHwgcmFkaWFucyA+IHBpIC8gMikge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdMYXRpdHVkZSByYWRpYW5zIG11c3QgYmUgaW4gcmFuZ2UgWy1waS8yOyBwaS8yXS4nKTtcbiAgfVxuXG4gIHJldHVybiByYWRpYW5zVG9EZWdyZWVzKHJhZGlhbnMpO1xufVxuXG5mdW5jdGlvbiBkZWdyZWVzTG9uZyhyYWRpYW5zKSB7XG4gIGlmIChyYWRpYW5zIDwgLXBpIHx8IHJhZGlhbnMgPiBwaSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdMb25naXR1ZGUgcmFkaWFucyBtdXN0IGJlIGluIHJhbmdlIFstcGk7IHBpXS4nKTtcbiAgfVxuXG4gIHJldHVybiByYWRpYW5zVG9EZWdyZWVzKHJhZGlhbnMpO1xufVxuXG5mdW5jdGlvbiByYWRpYW5zTGF0KGRlZ3JlZXMpIHtcbiAgaWYgKGRlZ3JlZXMgPCAtOTAgfHwgZGVncmVlcyA+IDkwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0xhdGl0dWRlIGRlZ3JlZXMgbXVzdCBiZSBpbiByYW5nZSBbLTkwOyA5MF0uJyk7XG4gIH1cblxuICByZXR1cm4gZGVncmVlc1RvUmFkaWFucyhkZWdyZWVzKTtcbn1cblxuZnVuY3Rpb24gcmFkaWFuc0xvbmcoZGVncmVlcykge1xuICBpZiAoZGVncmVlcyA8IC0xODAgfHwgZGVncmVlcyA+IDE4MCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdMb25naXR1ZGUgZGVncmVlcyBtdXN0IGJlIGluIHJhbmdlIFstMTgwOyAxODBdLicpO1xuICB9XG5cbiAgcmV0dXJuIGRlZ3JlZXNUb1JhZGlhbnMoZGVncmVlcyk7XG59XG5cbmZ1bmN0aW9uIGdlb2RldGljVG9FY2YoZ2VvZGV0aWMpIHtcbiAgdmFyIGxvbmdpdHVkZSA9IGdlb2RldGljLmxvbmdpdHVkZSxcbiAgICAgIGxhdGl0dWRlID0gZ2VvZGV0aWMubGF0aXR1ZGUsXG4gICAgICBoZWlnaHQgPSBnZW9kZXRpYy5oZWlnaHQ7XG4gIHZhciBhID0gNjM3OC4xMzc7XG4gIHZhciBiID0gNjM1Ni43NTIzMTQyO1xuICB2YXIgZiA9IChhIC0gYikgLyBhO1xuICB2YXIgZTIgPSAyICogZiAtIGYgKiBmO1xuICB2YXIgbm9ybWFsID0gYSAvIE1hdGguc3FydCgxIC0gZTIgKiAoTWF0aC5zaW4obGF0aXR1ZGUpICogTWF0aC5zaW4obGF0aXR1ZGUpKSk7XG4gIHZhciB4ID0gKG5vcm1hbCArIGhlaWdodCkgKiBNYXRoLmNvcyhsYXRpdHVkZSkgKiBNYXRoLmNvcyhsb25naXR1ZGUpO1xuICB2YXIgeSA9IChub3JtYWwgKyBoZWlnaHQpICogTWF0aC5jb3MobGF0aXR1ZGUpICogTWF0aC5zaW4obG9uZ2l0dWRlKTtcbiAgdmFyIHogPSAobm9ybWFsICogKDEgLSBlMikgKyBoZWlnaHQpICogTWF0aC5zaW4obGF0aXR1ZGUpO1xuICByZXR1cm4ge1xuICAgIHg6IHgsXG4gICAgeTogeSxcbiAgICB6OiB6XG4gIH07XG59XG5cbmZ1bmN0aW9uIGVjaVRvR2VvZGV0aWMoZWNpLCBnbXN0KSB7XG4gIC8vIGh0dHA6Ly93d3cuY2VsZXN0cmFrLmNvbS9jb2x1bW5zL3YwMm4wMy9cbiAgdmFyIGEgPSA2Mzc4LjEzNztcbiAgdmFyIGIgPSA2MzU2Ljc1MjMxNDI7XG4gIHZhciBSID0gTWF0aC5zcXJ0KGVjaS54ICogZWNpLnggKyBlY2kueSAqIGVjaS55KTtcbiAgdmFyIGYgPSAoYSAtIGIpIC8gYTtcbiAgdmFyIGUyID0gMiAqIGYgLSBmICogZjtcbiAgdmFyIGxvbmdpdHVkZSA9IE1hdGguYXRhbjIoZWNpLnksIGVjaS54KSAtIGdtc3Q7XG5cbiAgd2hpbGUgKGxvbmdpdHVkZSA8IC1waSkge1xuICAgIGxvbmdpdHVkZSArPSB0d29QaTtcbiAgfVxuXG4gIHdoaWxlIChsb25naXR1ZGUgPiBwaSkge1xuICAgIGxvbmdpdHVkZSAtPSB0d29QaTtcbiAgfVxuXG4gIHZhciBrbWF4ID0gMjA7XG4gIHZhciBrID0gMDtcbiAgdmFyIGxhdGl0dWRlID0gTWF0aC5hdGFuMihlY2kueiwgTWF0aC5zcXJ0KGVjaS54ICogZWNpLnggKyBlY2kueSAqIGVjaS55KSk7XG4gIHZhciBDO1xuXG4gIHdoaWxlIChrIDwga21heCkge1xuICAgIEMgPSAxIC8gTWF0aC5zcXJ0KDEgLSBlMiAqIChNYXRoLnNpbihsYXRpdHVkZSkgKiBNYXRoLnNpbihsYXRpdHVkZSkpKTtcbiAgICBsYXRpdHVkZSA9IE1hdGguYXRhbjIoZWNpLnogKyBhICogQyAqIGUyICogTWF0aC5zaW4obGF0aXR1ZGUpLCBSKTtcbiAgICBrICs9IDE7XG4gIH1cblxuICB2YXIgaGVpZ2h0ID0gUiAvIE1hdGguY29zKGxhdGl0dWRlKSAtIGEgKiBDO1xuICByZXR1cm4ge1xuICAgIGxvbmdpdHVkZTogbG9uZ2l0dWRlLFxuICAgIGxhdGl0dWRlOiBsYXRpdHVkZSxcbiAgICBoZWlnaHQ6IGhlaWdodFxuICB9O1xufVxuXG5mdW5jdGlvbiBlY2ZUb0VjaShlY2YsIGdtc3QpIHtcbiAgLy8gY2Nhci5jb2xvcmFkby5lZHUvQVNFTjUwNzAvaGFuZG91dHMvY29vcmRzeXMuZG9jXG4gIC8vXG4gIC8vIFtYXSAgICAgW0MgLVMgIDBdW1hdXG4gIC8vIFtZXSAgPSAgW1MgIEMgIDBdW1ldXG4gIC8vIFtaXWVjaSAgWzAgIDAgIDFdW1pdZWNmXG4gIC8vXG4gIHZhciBYID0gZWNmLnggKiBNYXRoLmNvcyhnbXN0KSAtIGVjZi55ICogTWF0aC5zaW4oZ21zdCk7XG4gIHZhciBZID0gZWNmLnggKiBNYXRoLnNpbihnbXN0KSArIGVjZi55ICogTWF0aC5jb3MoZ21zdCk7XG4gIHZhciBaID0gZWNmLno7XG4gIHJldHVybiB7XG4gICAgeDogWCxcbiAgICB5OiBZLFxuICAgIHo6IFpcbiAgfTtcbn1cblxuZnVuY3Rpb24gZWNpVG9FY2YoZWNpLCBnbXN0KSB7XG4gIC8vIGNjYXIuY29sb3JhZG8uZWR1L0FTRU41MDcwL2hhbmRvdXRzL2Nvb3Jkc3lzLmRvY1xuICAvL1xuICAvLyBbWF0gICAgIFtDIC1TICAwXVtYXVxuICAvLyBbWV0gID0gIFtTICBDICAwXVtZXVxuICAvLyBbWl1lY2kgIFswICAwICAxXVtaXWVjZlxuICAvL1xuICAvL1xuICAvLyBJbnZlcnNlOlxuICAvLyBbWF0gICAgIFtDICBTICAwXVtYXVxuICAvLyBbWV0gID0gIFstUyBDICAwXVtZXVxuICAvLyBbWl1lY2YgIFswICAwICAxXVtaXWVjaVxuICB2YXIgeCA9IGVjaS54ICogTWF0aC5jb3MoZ21zdCkgKyBlY2kueSAqIE1hdGguc2luKGdtc3QpO1xuICB2YXIgeSA9IGVjaS54ICogLU1hdGguc2luKGdtc3QpICsgZWNpLnkgKiBNYXRoLmNvcyhnbXN0KTtcbiAgdmFyIHogPSBlY2kuejtcbiAgcmV0dXJuIHtcbiAgICB4OiB4LFxuICAgIHk6IHksXG4gICAgejogelxuICB9O1xufVxuXG5mdW5jdGlvbiB0b3BvY2VudHJpYyhvYnNlcnZlckdlb2RldGljLCBzYXRlbGxpdGVFY2YpIHtcbiAgLy8gaHR0cDovL3d3dy5jZWxlc3RyYWsuY29tL2NvbHVtbnMvdjAybjAyL1xuICAvLyBUUyBLZWxzbydzIG1ldGhvZCwgZXhjZXB0IEknbSB1c2luZyBFQ0YgZnJhbWVcbiAgLy8gYW5kIGhlIHVzZXMgRUNJLlxuICB2YXIgbG9uZ2l0dWRlID0gb2JzZXJ2ZXJHZW9kZXRpYy5sb25naXR1ZGUsXG4gICAgICBsYXRpdHVkZSA9IG9ic2VydmVyR2VvZGV0aWMubGF0aXR1ZGU7XG4gIHZhciBvYnNlcnZlckVjZiA9IGdlb2RldGljVG9FY2Yob2JzZXJ2ZXJHZW9kZXRpYyk7XG4gIHZhciByeCA9IHNhdGVsbGl0ZUVjZi54IC0gb2JzZXJ2ZXJFY2YueDtcbiAgdmFyIHJ5ID0gc2F0ZWxsaXRlRWNmLnkgLSBvYnNlcnZlckVjZi55O1xuICB2YXIgcnogPSBzYXRlbGxpdGVFY2YueiAtIG9ic2VydmVyRWNmLno7XG4gIHZhciB0b3BTID0gTWF0aC5zaW4obGF0aXR1ZGUpICogTWF0aC5jb3MobG9uZ2l0dWRlKSAqIHJ4ICsgTWF0aC5zaW4obGF0aXR1ZGUpICogTWF0aC5zaW4obG9uZ2l0dWRlKSAqIHJ5IC0gTWF0aC5jb3MobGF0aXR1ZGUpICogcno7XG4gIHZhciB0b3BFID0gLU1hdGguc2luKGxvbmdpdHVkZSkgKiByeCArIE1hdGguY29zKGxvbmdpdHVkZSkgKiByeTtcbiAgdmFyIHRvcFogPSBNYXRoLmNvcyhsYXRpdHVkZSkgKiBNYXRoLmNvcyhsb25naXR1ZGUpICogcnggKyBNYXRoLmNvcyhsYXRpdHVkZSkgKiBNYXRoLnNpbihsb25naXR1ZGUpICogcnkgKyBNYXRoLnNpbihsYXRpdHVkZSkgKiByejtcbiAgcmV0dXJuIHtcbiAgICB0b3BTOiB0b3BTLFxuICAgIHRvcEU6IHRvcEUsXG4gICAgdG9wWjogdG9wWlxuICB9O1xufVxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gdGNcbiAqIEBwYXJhbSB7TnVtYmVyfSB0Yy50b3BTIFBvc2l0aXZlIGhvcml6b250YWwgdmVjdG9yIFMgZHVlIHNvdXRoLlxuICogQHBhcmFtIHtOdW1iZXJ9IHRjLnRvcEUgUG9zaXRpdmUgaG9yaXpvbnRhbCB2ZWN0b3IgRSBkdWUgZWFzdC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB0Yy50b3BaIFZlY3RvciBaIG5vcm1hbCB0byB0aGUgc3VyZmFjZSBvZiB0aGUgZWFydGggKHVwKS5cbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cblxuXG5mdW5jdGlvbiB0b3BvY2VudHJpY1RvTG9va0FuZ2xlcyh0Yykge1xuICB2YXIgdG9wUyA9IHRjLnRvcFMsXG4gICAgICB0b3BFID0gdGMudG9wRSxcbiAgICAgIHRvcFogPSB0Yy50b3BaO1xuICB2YXIgcmFuZ2VTYXQgPSBNYXRoLnNxcnQodG9wUyAqIHRvcFMgKyB0b3BFICogdG9wRSArIHRvcFogKiB0b3BaKTtcbiAgdmFyIEVsID0gTWF0aC5hc2luKHRvcFogLyByYW5nZVNhdCk7XG4gIHZhciBBeiA9IE1hdGguYXRhbjIoLXRvcEUsIHRvcFMpICsgcGk7XG4gIHJldHVybiB7XG4gICAgYXppbXV0aDogQXosXG4gICAgZWxldmF0aW9uOiBFbCxcbiAgICByYW5nZVNhdDogcmFuZ2VTYXQgLy8gUmFuZ2UgaW4ga21cblxuICB9O1xufVxuXG5mdW5jdGlvbiBlY2ZUb0xvb2tBbmdsZXMob2JzZXJ2ZXJHZW9kZXRpYywgc2F0ZWxsaXRlRWNmKSB7XG4gIHZhciB0b3BvY2VudHJpY0Nvb3JkcyA9IHRvcG9jZW50cmljKG9ic2VydmVyR2VvZGV0aWMsIHNhdGVsbGl0ZUVjZik7XG4gIHJldHVybiB0b3BvY2VudHJpY1RvTG9va0FuZ2xlcyh0b3BvY2VudHJpY0Nvb3Jkcyk7XG59XG5cbmV4cG9ydCB7IGNvbnN0YW50cywgZGVncmVlc0xhdCwgZGVncmVlc0xvbmcsIGRlZ3JlZXNUb1JhZGlhbnMsIGRvcHBsZXJGYWN0b3IsIGVjZlRvRWNpLCBlY2ZUb0xvb2tBbmdsZXMsIGVjaVRvRWNmLCBlY2lUb0dlb2RldGljLCBnZW9kZXRpY1RvRWNmLCBnc3RpbWUsIGludmpkYXksIGpkYXksIHByb3BhZ2F0ZSwgcmFkaWFuc0xhdCwgcmFkaWFuc0xvbmcsIHJhZGlhbnNUb0RlZ3JlZXMsIHNncDQsIHR3b2xpbmUyc2F0cmVjIH07IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBvcyA9IHJlcXVpcmUoJ29zJyk7XG5cbmNvbnN0IGhhc0ZsYWcgPSByZXF1aXJlKCdoYXMtZmxhZycpO1xuXG5jb25zdCBlbnYgPSBwcm9jZXNzLmVudjtcbmxldCBmb3JjZUNvbG9yO1xuXG5pZiAoaGFzRmxhZygnbm8tY29sb3InKSB8fCBoYXNGbGFnKCduby1jb2xvcnMnKSB8fCBoYXNGbGFnKCdjb2xvcj1mYWxzZScpKSB7XG4gIGZvcmNlQ29sb3IgPSBmYWxzZTtcbn0gZWxzZSBpZiAoaGFzRmxhZygnY29sb3InKSB8fCBoYXNGbGFnKCdjb2xvcnMnKSB8fCBoYXNGbGFnKCdjb2xvcj10cnVlJykgfHwgaGFzRmxhZygnY29sb3I9YWx3YXlzJykpIHtcbiAgZm9yY2VDb2xvciA9IHRydWU7XG59XG5cbmlmICgnRk9SQ0VfQ09MT1InIGluIGVudikge1xuICBmb3JjZUNvbG9yID0gZW52LkZPUkNFX0NPTE9SLmxlbmd0aCA9PT0gMCB8fCBwYXJzZUludChlbnYuRk9SQ0VfQ09MT1IsIDEwKSAhPT0gMDtcbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlTGV2ZWwobGV2ZWwpIHtcbiAgaWYgKGxldmVsID09PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsZXZlbCxcbiAgICBoYXNCYXNpYzogdHJ1ZSxcbiAgICBoYXMyNTY6IGxldmVsID49IDIsXG4gICAgaGFzMTZtOiBsZXZlbCA+PSAzXG4gIH07XG59XG5cbmZ1bmN0aW9uIHN1cHBvcnRzQ29sb3Ioc3RyZWFtKSB7XG4gIGlmIChmb3JjZUNvbG9yID09PSBmYWxzZSkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKGhhc0ZsYWcoJ2NvbG9yPTE2bScpIHx8IGhhc0ZsYWcoJ2NvbG9yPWZ1bGwnKSB8fCBoYXNGbGFnKCdjb2xvcj10cnVlY29sb3InKSkge1xuICAgIHJldHVybiAzO1xuICB9XG5cbiAgaWYgKGhhc0ZsYWcoJ2NvbG9yPTI1NicpKSB7XG4gICAgcmV0dXJuIDI7XG4gIH1cblxuICBpZiAoc3RyZWFtICYmICFzdHJlYW0uaXNUVFkgJiYgZm9yY2VDb2xvciAhPT0gdHJ1ZSkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgY29uc3QgbWluID0gZm9yY2VDb2xvciA/IDEgOiAwO1xuXG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgLy8gTm9kZS5qcyA3LjUuMCBpcyB0aGUgZmlyc3QgdmVyc2lvbiBvZiBOb2RlLmpzIHRvIGluY2x1ZGUgYSBwYXRjaCB0b1xuICAgIC8vIGxpYnV2IHRoYXQgZW5hYmxlcyAyNTYgY29sb3Igb3V0cHV0IG9uIFdpbmRvd3MuIEFueXRoaW5nIGVhcmxpZXIgYW5kIGl0XG4gICAgLy8gd29uJ3Qgd29yay4gSG93ZXZlciwgaGVyZSB3ZSB0YXJnZXQgTm9kZS5qcyA4IGF0IG1pbmltdW0gYXMgaXQgaXMgYW4gTFRTXG4gICAgLy8gcmVsZWFzZSwgYW5kIE5vZGUuanMgNyBpcyBub3QuIFdpbmRvd3MgMTAgYnVpbGQgMTA1ODYgaXMgdGhlIGZpcnN0IFdpbmRvd3NcbiAgICAvLyByZWxlYXNlIHRoYXQgc3VwcG9ydHMgMjU2IGNvbG9ycy4gV2luZG93cyAxMCBidWlsZCAxNDkzMSBpcyB0aGUgZmlyc3QgcmVsZWFzZVxuICAgIC8vIHRoYXQgc3VwcG9ydHMgMTZtL1RydWVDb2xvci5cbiAgICBjb25zdCBvc1JlbGVhc2UgPSBvcy5yZWxlYXNlKCkuc3BsaXQoJy4nKTtcblxuICAgIGlmIChOdW1iZXIocHJvY2Vzcy52ZXJzaW9ucy5ub2RlLnNwbGl0KCcuJylbMF0pID49IDggJiYgTnVtYmVyKG9zUmVsZWFzZVswXSkgPj0gMTAgJiYgTnVtYmVyKG9zUmVsZWFzZVsyXSkgPj0gMTA1ODYpIHtcbiAgICAgIHJldHVybiBOdW1iZXIob3NSZWxlYXNlWzJdKSA+PSAxNDkzMSA/IDMgOiAyO1xuICAgIH1cblxuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKCdDSScgaW4gZW52KSB7XG4gICAgaWYgKFsnVFJBVklTJywgJ0NJUkNMRUNJJywgJ0FQUFZFWU9SJywgJ0dJVExBQl9DSSddLnNvbWUoc2lnbiA9PiBzaWduIGluIGVudikgfHwgZW52LkNJX05BTUUgPT09ICdjb2Rlc2hpcCcpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIHJldHVybiBtaW47XG4gIH1cblxuICBpZiAoJ1RFQU1DSVRZX1ZFUlNJT04nIGluIGVudikge1xuICAgIHJldHVybiAvXig5XFwuKDAqWzEtOV1cXGQqKVxcLnxcXGR7Mix9XFwuKS8udGVzdChlbnYuVEVBTUNJVFlfVkVSU0lPTikgPyAxIDogMDtcbiAgfVxuXG4gIGlmIChlbnYuQ09MT1JURVJNID09PSAndHJ1ZWNvbG9yJykge1xuICAgIHJldHVybiAzO1xuICB9XG5cbiAgaWYgKCdURVJNX1BST0dSQU0nIGluIGVudikge1xuICAgIGNvbnN0IHZlcnNpb24gPSBwYXJzZUludCgoZW52LlRFUk1fUFJPR1JBTV9WRVJTSU9OIHx8ICcnKS5zcGxpdCgnLicpWzBdLCAxMCk7XG5cbiAgICBzd2l0Y2ggKGVudi5URVJNX1BST0dSQU0pIHtcbiAgICAgIGNhc2UgJ2lUZXJtLmFwcCc6XG4gICAgICAgIHJldHVybiB2ZXJzaW9uID49IDMgPyAzIDogMjtcblxuICAgICAgY2FzZSAnQXBwbGVfVGVybWluYWwnOlxuICAgICAgICByZXR1cm4gMjtcbiAgICAgIC8vIE5vIGRlZmF1bHRcbiAgICB9XG4gIH1cblxuICBpZiAoLy0yNTYoY29sb3IpPyQvaS50ZXN0KGVudi5URVJNKSkge1xuICAgIHJldHVybiAyO1xuICB9XG5cbiAgaWYgKC9ec2NyZWVufF54dGVybXxednQxMDB8XnZ0MjIwfF5yeHZ0fGNvbG9yfGFuc2l8Y3lnd2lufGxpbnV4L2kudGVzdChlbnYuVEVSTSkpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGlmICgnQ09MT1JURVJNJyBpbiBlbnYpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGlmIChlbnYuVEVSTSA9PT0gJ2R1bWInKSB7XG4gICAgcmV0dXJuIG1pbjtcbiAgfVxuXG4gIHJldHVybiBtaW47XG59XG5cbmZ1bmN0aW9uIGdldFN1cHBvcnRMZXZlbChzdHJlYW0pIHtcbiAgY29uc3QgbGV2ZWwgPSBzdXBwb3J0c0NvbG9yKHN0cmVhbSk7XG4gIHJldHVybiB0cmFuc2xhdGVMZXZlbChsZXZlbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzdXBwb3J0c0NvbG9yOiBnZXRTdXBwb3J0TGV2ZWwsXG4gIHN0ZG91dDogZ2V0U3VwcG9ydExldmVsKHByb2Nlc3Muc3Rkb3V0KSxcbiAgc3RkZXJyOiBnZXRTdXBwb3J0TGV2ZWwocHJvY2Vzcy5zdGRlcnIpXG59OyIsImNvbnN0IGF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xuXG5sZXQgaXNibiA9IFwiMDIwMTU1ODAyNVwiO1xuXG5jb25zdCByZWNlaXZlRGF0YSA9IGF4aW9zXG4gIC5nZXQoYC9zYXRlbGxpdGVzL3RsZWApXG4gIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgIGNvbnN0IHNwbGl0ID0gcmVzcG9uc2UuZGF0YS5zcGxpdChcIlxcclxcblwiKTtcbiAgICBsZXQgbmV3RGF0YSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXQubGVuZ3RoIC0gMjsgaSArPSAzKSB7XG4gICAgICBjb25zdCB0d28gPSBzcGxpdFtpICsgMV0uY29uY2F0KFwiIFwiLCBcIlxcblwiLCBcIiBcIiwgc3BsaXRbaSArIDJdKTtcbiAgICAgIG5ld0RhdGEucHVzaCh0d28pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3RGF0YTtcbiAgfSlcbiAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgIGRlYnVnZ2VyO1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfSk7XG5cbmV4cG9ydCBkZWZhdWx0IHJlY2VpdmVEYXRhO1xuIiwiY29uc3QgaGFuZGxlUGxheSA9IChhdWRpb0NvbnRleHQpID0+IHtcbiAgY29uc3QgYXVkaW9DdHggPSBhdWRpb0NvbnRleHQ7XG4gIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheV9wYXVzZVwiKTtcbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgXCJjbGlja1wiLFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiY2xpY2tlZFwiKTtcbiAgICAgIGlmIChhdWRpb0N0eC5zdGF0ZSA9PT0gXCJzdXNwZW5kZWRcIikge1xuICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgYXVkaW9DdHgucmVzdW1lKCk7XG4gICAgICAgIHZhciBvc2NpbGxhdG9yID0gYXVkaW9DdHguY3JlYXRlT3NjaWxsYXRvcigpO1xuXG4gICAgICAgIG9zY2lsbGF0b3IudHlwZSA9IFwic3F1YXJlXCI7XG4gICAgICAgIG9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gNDQwOyAvLyB2YWx1ZSBpbiBoZXJ0elxuICAgICAgICBvc2NpbGxhdG9yLnN0YXJ0KDApO1xuICAgICAgICAvLyBvc2NpbGxhdG9yLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuICAgICAgICAvLyBkZWJ1Z2dlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF1ZGlvQ3R4LnN1c3BlbmQoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGZhbHNlXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgaGFuZGxlQnV0dG9uID0gKCkgPT4ge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFidC1idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXlcIikuY2xhc3NMaXN0LmFkZChcImlzLXZpc2libGVcIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWRJKFwiYWJ0LW1vZGFsXCIpLmNsYXNzTGlzdC5hZGQoXCJpcy12aXNpYmxlXCIpO1xuICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGhhbmRsZVBsYXk7XG4iLCJpbXBvcnQgU2F0ZWxsaXRlIGZyb20gXCIuL3NhdGVsbGl0ZS5qc1wiO1xuaW1wb3J0IFN0YXIgZnJvbSBcIi4vc3Rhci5qc1wiO1xuaW1wb3J0IHsgc2dwNCB9IGZyb20gXCJzYXRlbGxpdGUuanNcIjtcbmNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3Rvcih4RGltLCB5RGltLCB0bGUsIGF1ZGlvQ3R4KSB7XG4gICAgdGhpcy54RGltID0geERpbTtcbiAgICB0aGlzLnlEaW0gPSB5RGltO1xuICAgIHRoaXMuc2F0ZWxsaXRlcyA9IFtdO1xuICAgIHRoaXMuc3RhcnMgPSBbXTtcbiAgICB0aGlzLnRsZSA9IHRsZTtcbiAgICB0aGlzLmF1ZGlvQ3R4ID0gYXVkaW9DdHg7XG4gICAgdGhpcy5hZGRTYXRlbGxpdGVzKHRsZSk7XG4gICAgdGhpcy5hZGRTdGFycygpO1xuICB9XG5cbiAgcmFuZG9tUG9zKCkge1xuICAgIHJldHVybiBbXG4gICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnhEaW0pLFxuICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy55RGltKSxcbiAgICBdO1xuICB9XG4gIGFkZFN0YXJzKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTcwMDsgaSsrKSB7XG4gICAgICBsZXQgY3VycmVudFN0YXIgPSBuZXcgU3Rhcih0aGlzLnJhbmRvbVBvcygpLCB0aGlzKTtcbiAgICAgIHRoaXMuc3RhcnMucHVzaChjdXJyZW50U3Rhcik7XG4gICAgfVxuICB9XG4gIGFkZFNhdGVsbGl0ZXModGxlKSB7XG4gICAgY29uc3Qgc2F0cmVjID0gc2F0ZWxsaXRlLnR3b2xpbmUyc2F0cmVjKFxuICAgICAgdGhpcy50bGUuc3BsaXQoXCJcXG5cIilbMF0udHJpbSgpLFxuICAgICAgdGhpcy50bGUuc3BsaXQoXCJcXG5cIilbMV0udHJpbSgpXG4gICAgKTtcbiAgICAvLyBkZWJ1Z2dlcjtcblxuICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcbiAgICAvLyAgIC8vIGRlYnVnZ2VyO1xuICAgIC8vICAgY29uc29sZS5sb2coc2F0ZWxsaXRlc09ialtpXSk7XG4gICAgbGV0IGN1cnJlbnRTYXRlbGxpdGUgPSBuZXcgU2F0ZWxsaXRlKHNhdHJlYywgdGhpcyk7XG4gICAgdGhpcy5zYXRlbGxpdGVzLnB1c2goY3VycmVudFNhdGVsbGl0ZSk7XG4gICAgLy8gfVxuICB9XG5cbiAgZHJhdyhjdHgpIHtcbiAgICAvLyBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMueERpbSwgdGhpcy55RGltKTtcbiAgICAvLyBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xuICAgIC8vIGN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLnhEaW0sIHRoaXMueURpbSk7XG4gICAgLy8gdGhpcy5zdGFycy5mb3JFYWNoKChzdGFyKSA9PiBzdGFyLmRyYXcoY3R4KSk7XG4gICAgLy8gdGhpcy5zYXRlbGxpdGVzLmZvckVhY2goKHNhdGVsbGl0ZSkgPT4gc2F0ZWxsaXRlLmRyYXcoY3R4KSk7XG4gIH1cblxuICBtb3ZlKGN0eCkge1xuICAgIC8vIHRoaXMuc2F0ZWxsaXRlcy5mb3JFYWNoKChzYXRlbGxpdGUpID0+IHNhdGVsbGl0ZS5tb3ZlKGN0eCkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJpbXBvcnQgR2FtZSBmcm9tIFwiLi9nYW1lXCI7XG5pbXBvcnQgbWFwX3JhbmdlIGZyb20gXCIuL21hdGhfdXRpbFwiO1xuLy8gaW1wb3J0IHsgc2NlbmUsIGNhbWVyYSwgcmVuZGVyZXIgfSBmcm9tIFwiLi90aHJlZS90aHJlZV9tYXBcIjtcbmNsYXNzIEdhbWVWaWV3IHtcbiAgY29uc3RydWN0b3IodGxlQXJyLCBhdWRpb0N0eCkge1xuICAgIHRoaXMudGxlQXJyID0gdGxlQXJyO1xuICAgIHRoaXMuYXVkaW9DdHggPSBhdWRpb0N0eDtcbiAgICB0aGlzLnNhdFJlY3MgPSBbXTtcbiAgICB0aGlzLnNhdE9zY2lsbGF0b3JzID0gW107XG4gICAgdGhpcy5hZGRTYXRlbGxpdGVzKCk7XG4gICAgdGhpcy50ID0gMDtcbiAgICB0aGlzLmFjdGl2ZUNsb2NrID0gdGhpcy5jbG9jaygpLnJhdGUoMTAwKS5kYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgfVxuXG4gIGNsb2NrKCkge1xuICAgIHZhciByYXRlID0gNjA7IC8vIDFtcyBlbGFwc2VkIDogNjBzZWMgc2ltdWxhdGVkXG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB2YXIgZWxhcHNlZCA9IDA7XG5cbiAgICBmdW5jdGlvbiBjbG9jaygpIHt9XG5cbiAgICBjbG9jay5kYXRlID0gZnVuY3Rpb24gKHRpbWVJbk1zKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBkYXRlICsgZWxhcHNlZCAqIHJhdGU7XG4gICAgICBkYXRlID0gdGltZUluTXM7XG4gICAgICByZXR1cm4gY2xvY2s7XG4gICAgfTtcblxuICAgIGNsb2NrLmVsYXBzZWQgPSBmdW5jdGlvbiAobXMpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRhdGUgLSBuZXcgRGF0ZSgpLmdldFRpbWUoKTsgLy8gY2FsY3VsYXRlcyBlbGFwc2VkXG4gICAgICBlbGFwc2VkID0gbXM7XG4gICAgICAvLyBkZWJ1Z2dlcjtcbiAgICAgIHJldHVybiBjbG9jaztcbiAgICB9O1xuXG4gICAgY2xvY2sucmF0ZSA9IGZ1bmN0aW9uIChzZWNvbmRzUGVyTXNFbGFwc2VkKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiByYXRlO1xuICAgICAgcmF0ZSA9IHNlY29uZHNQZXJNc0VsYXBzZWQ7XG4gICAgICByZXR1cm4gY2xvY2s7XG4gICAgfTtcblxuICAgIHJldHVybiBjbG9jaztcbiAgfVxuICBhZGRTYXRlbGxpdGVzKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50bGVBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBzYXRyZWMgPSBzYXRlbGxpdGUudHdvbGluZTJzYXRyZWMoXG4gICAgICAgIHRoaXMudGxlQXJyW2ldLnNwbGl0KFwiXFxuXCIpWzBdLnRyaW0oKSxcbiAgICAgICAgdGhpcy50bGVBcnJbaV0uc3BsaXQoXCJcXG5cIilbMV0udHJpbSgpXG4gICAgICApO1xuICAgICAgdGhpcy5zYXRSZWNzLnB1c2goc2F0cmVjKTtcbiAgICAgIHRoaXMuY3JlYXRlU2F0ZWxsaXRlT3NjKHNhdHJlYyk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlU2F0ZWxsaXRlT3NjKHNhdHJlYykge1xuICAgIGNvbnN0IG9zY2lsbGF0b3JOb2RlID0gdGhpcy5hdWRpb0N0eC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgb3NjaWxsYXRvck5vZGUudHlwZSA9IFwic2luZVwiO1xuICAgIC8vIGNvbnNvbGUubG9nKHNhdHJlYyk7XG4gICAgLy8gZGVidWdnZXI7XG4gICAgLy8gY29uc3QgbmV3RnJlcSA9IChzYXRyZWMuZXBvY2hkYXlzICogc2F0cmVjLmQzKSAlIDIwNTA7XG4gICAgY29uc3QgbmV3RnJlcSA9IDEwMDtcbiAgICBvc2NpbGxhdG9yTm9kZS5mcmVxdWVuY3kudmFsdWUgPSBuZXdGcmVxO1xuICAgIC8vIGNvbnNvbGUubG9nKG5ld0ZyZXEpO1xuICAgIGNvbnN0IGdhaW5Ob2RlID0gdGhpcy5hdWRpb0N0eC5jcmVhdGVHYWluKCk7XG4gICAgZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IDAuMDE7IC8vIDEwICVcbiAgICBnYWluTm9kZS5jb25uZWN0KHRoaXMuYXVkaW9DdHguZGVzdGluYXRpb24pO1xuICAgIG9zY2lsbGF0b3JOb2RlLmNvbm5lY3QoZ2Fpbk5vZGUpO1xuICAgIG9zY2lsbGF0b3JOb2RlLnN0YXJ0KDApO1xuICAgIHRoaXMuc2F0T3NjaWxsYXRvcnMucHVzaChvc2NpbGxhdG9yTm9kZSk7XG4gIH1cblxuICB1cGRhdGVTYXRlbGxpdGVPc2ModmVydGljZXMsIGkpIHtcbiAgICBjb25zdCBjdXJyZW50T3NjID0gdGhpcy5zYXRPc2NpbGxhdG9yc1tpXTtcbiAgICAvLyBjb25zdCBjdXRGcmVxID0gTWF0aC5hYnModmVydGljZXMueCk7XG5cbiAgICAvLyBkZWJ1Z2dlcjtcbiAgICAvLyBjdXJyZW50T3NjLmZyZXF1ZW5jeS52YWx1ZSA9IDQwMDtcbiAgICAvLyBNYXRoLmFicyh2ZXJ0aWNlcy54ICogdmVydGljZXMueSAqIHZlcnRpY2VzLnopO1xuICAgIC8vIGNvbnN0IG5ld0ZyZXEgPSBtYXBfcmFuZ2Uoc2F0cmVjLnNpemUsIDAsIHRoaXMuZ2FtZS55RGltLCAwLCAyMDAwMCk7XG4gIH1cblxuICBzYXRlbGxpdGVWZWN0b3IgPSAoc2F0cmVjLCBkYXRlKSA9PiB7XG4gICAgY29uc3QgeHl6ID0gdGhpcy5zYXRyZWNUb1hZWihzYXRyZWMsIGRhdGUpO1xuICAgIGNvbnN0IGxhbWJkYSA9IHh5elswXTtcbiAgICBjb25zdCBwaGkgPSB4eXpbMV07XG4gICAgY29uc3QgY29zUGhpID0gTWF0aC5jb3MocGhpKTtcbiAgICBjb25zdCByID0gKCh4eXpbMl0gKyA2MzcxKSAvIDYzNzEpICogMjI4O1xuICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMyhcbiAgICAgIHIgKiBjb3NQaGkgKiBNYXRoLmNvcyhsYW1iZGEpLFxuICAgICAgciAqIGNvc1BoaSAqIE1hdGguc2luKGxhbWJkYSksXG4gICAgICByICogTWF0aC5zaW4ocGhpKVxuICAgICk7XG4gIH07XG4gIHNhdHJlY1RvWFlaID0gKHNhdHJlYywgZGF0ZSkgPT4ge1xuICAgIGNvbnN0IHBvc2l0aW9uQW5kVmVsb2NpdHkgPSBzYXRlbGxpdGUucHJvcGFnYXRlKHNhdHJlYywgZGF0ZSk7XG4gICAgY29uc3QgZ21zdCA9IHNhdGVsbGl0ZS5nc3RpbWUoZGF0ZSk7XG4gICAgY29uc3QgcG9zaXRpb25HZCA9IHNhdGVsbGl0ZS5lY2lUb0dlb2RldGljKFxuICAgICAgcG9zaXRpb25BbmRWZWxvY2l0eS5wb3NpdGlvbixcbiAgICAgIGdtc3RcbiAgICApO1xuICAgIHJldHVybiBbcG9zaXRpb25HZC5sb25naXR1ZGUsIHBvc2l0aW9uR2QubGF0aXR1ZGUsIHBvc2l0aW9uR2QuaGVpZ2h0XTtcbiAgfTtcblxuICBzdGFydCgpIHtcbiAgICBjb25zdCBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShcbiAgICAgIDc1LFxuICAgICAgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAwLjEsXG4gICAgICAxMDAwXG4gICAgKTtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBjYW52YXNFbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKTtcbiAgICAvLyBkZWJ1Z2dlcjtcbiAgICAvLyBjb25zb2xlLmxvZyhjYW52YXNFbGUpO1xuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xuICAgICAgYW50aWFsaWFzOiB0cnVlLFxuICAgICAgY2FudmFzOiBjYW52YXNFbGUsXG4gICAgfSk7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MDBmZmYwLCAwKTsgLy8gc2V0cyBiYWNrZ3JvdW5kIHRvIGNsZWFyIGNvbG9yXG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgyMDAsIDMyLCAzMik7XG4gICAgY29uc3Qgd2lyZWZyYW1lID0gbmV3IFRIUkVFLldpcmVmcmFtZUdlb21ldHJ5KGdlb21ldHJ5KTtcblxuICAgIGNvbnN0IGxpbmUgPSBuZXcgVEhSRUUuTGluZVNlZ21lbnRzKHdpcmVmcmFtZSk7XG4gICAgbGluZS5tYXRlcmlhbC5kZXB0aFRlc3QgPSBmYWxzZTtcbiAgICBsaW5lLm1hdGVyaWFsLnRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICBzY2VuZS5hZGQobGluZSk7XG4gICAgY29uc3Qgc2F0R2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcbiAgICBjb25zdCBzYXRlbGxpdGVWZWN0b3JGdW5jID0gdGhpcy5zYXRlbGxpdGVWZWN0b3I7XG4gICAgc2F0R2VvbWV0cnkudmVydGljZXMgPSB0aGlzLnNhdFJlY3MubWFwKChzYXRyZWMpID0+IHtcbiAgICAgIHJldHVybiBzYXRlbGxpdGVWZWN0b3JGdW5jKHNhdHJlYywgZGF0ZSk7XG4gICAgfSk7XG4gICAgY29uc3Qgc2F0ZWxsaXRlcyA9IG5ldyBUSFJFRS5Qb2ludHMoXG4gICAgICBzYXRHZW9tZXRyeSxcbiAgICAgIG5ldyBUSFJFRS5Qb2ludHNNYXRlcmlhbCh7IGNvbG9yOiBcImdyZWVuXCIsIHNpemU6IDQgfSlcbiAgICApO1xuICAgIHNjZW5lLmFkZChzYXRlbGxpdGVzKTtcbiAgICBkZWJ1Z2dlcjtcbiAgICBjYW1lcmEucG9zaXRpb24ueiA9IDcwMDtcbiAgICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuICAgIGNvbnN0IHNhdFJlY3MgPSB0aGlzLnNhdFJlY3M7XG4gICAgY29uc3QgbmV3QWN0aXZlQ2xvY2sgPSB0aGlzLmFjdGl2ZUNsb2NrO1xuICAgIC8vIGNvbnN0IHVwZGF0ZU9zY2lsbGF0b3JzID0gdGhpcy51cGRhdGVTYXRlbGxpdGVPc2M7XG4gICAgY29uc3QgYW5pbWF0ZSA9ICh0KSA9PiB7XG4gICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUobmV3QWN0aXZlQ2xvY2suZWxhcHNlZCh0KS5kYXRlKCkpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgICAgbGluZS5yb3RhdGlvbi55ICs9IDAuMDAxO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzYXRSZWNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHNhdGVsbGl0ZXMuZ2VvbWV0cnkudmVydGljZXNbaV0gPSBzYXRlbGxpdGVWZWN0b3JGdW5jKHNhdFJlY3NbaV0sIGRhdGUpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNhdGVsbGl0ZU9zYyhzYXRlbGxpdGVzLmdlb21ldHJ5LnZlcnRpY2VzW2ldLCBpKTtcbiAgICAgIH1cbiAgICAgIHNhdGVsbGl0ZXMuZ2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZTtcbiAgICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgICB9O1xuXG4gICAgYW5pbWF0ZSh0aGlzLnQpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVWaWV3O1xuIiwiY29uc3QgbWFwX3JhbmdlID0gKHZhbHVlLCBsb3cxLCBoaWdoMSwgbG93MiwgaGlnaDIpID0+IHtcbiAgcmV0dXJuIGxvdzIgKyAoKGhpZ2gyIC0gbG93MikgKiAodmFsdWUgLSBsb3cxKSkgLyAoaGlnaDEgLSBsb3cxKTtcbn07XG5cbmNvbnN0IHJhZGlhbnNUb0RlZ3JlZXMgPSAocmFkaWFucykgPT4ge1xuICByZXR1cm4gKHJhZGlhbnMgKiAxODApIC8gTWF0aC5QSTtcbn07XG5cbmNvbnN0IGRlZ3JlZXNUb1JhZGlhbnMgPSAoZGVncmVlcykgPT4ge1xuICByZXR1cm4gZGVncmVlcyAqIChNYXRoLlBJIC8gMTgwKTtcbn07XG5leHBvcnQgZGVmYXVsdCBtYXBfcmFuZ2U7XG4iLCJpbXBvcnQgbWFwX3JhbmdlIGZyb20gXCIuL21hdGhfdXRpbFwiO1xuY2xhc3MgU2F0ZWxsaXRlT3NjIHtcbiAgY29uc3RydWN0b3Ioc2F0UmVjLCBnYW1lKSB7XG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUoKTtcbiAgICB0aGlzLnBvc2l0aW9uQW5kVmVsb2NpdHkgPSBzYXRlbGxpdGUucHJvcGFnYXRlKHNhdFJlYywgdGhpcy5kYXRlKTtcbiAgICB0aGlzLmdtc3QgPSBzYXRlbGxpdGUuZ3N0aW1lKHRoaXMuZGF0ZSk7XG5cbiAgICB0aGlzLnBvc2l0aW9uID0gc2F0ZWxsaXRlLmVjaVRvR2VvZGV0aWMoXG4gICAgICB0aGlzLnBvc2l0aW9uQW5kVmVsb2NpdHkucG9zaXRpb24sXG4gICAgICB0aGlzLmdtc3RcbiAgICApO1xuXG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICB0aGlzLmF1ZGlvQ3R4ID0gZ2FtZS5hdWRpb0N0eDtcbiAgfVxuXG4gIHN0YXJ0T3NjKCkge1xuICAgIHRoaXMub3NjaWxsYXRvci50eXBlID0gXCJzaW5lXCI7XG4gICAgZGVidWdnZXI7XG4gICAgY29uc3QgbmV3RnJlcSA9IG1hcF9yYW5nZSh0aGlzLnBvc1sxXSwgMCwgdGhpcy5nYW1lLnlEaW0sIDAsIDIwMDAwKTtcbiAgICBjb25zb2xlLmxvZyhuZXdGcmVxKTtcbiAgICB0aGlzLm9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gbmV3RnJlcTtcbiAgICAvLyBkZWJ1Z2dlcjtcbiAgICBjb25zdCBnYWluTm9kZSA9IHRoaXMuYXVkaW9DdHguY3JlYXRlR2FpbigpO1xuICAgIGdhaW5Ob2RlLmdhaW4udmFsdWUgPSAwLjAwMTsgLy8gMTAgJVxuICAgIGdhaW5Ob2RlLmNvbm5lY3QodGhpcy5hdWRpb0N0eC5kZXN0aW5hdGlvbik7XG5cbiAgICB0aGlzLm9zY2lsbGF0b3IuY29ubmVjdChnYWluTm9kZSk7XG4gICAgdGhpcy5vc2NpbGxhdG9yLnN0YXJ0KDApO1xuICB9XG5cbiAgZHJhdyhjdHgpIHt9XG5cbiAgbW92ZSgpIHtcbiAgICAvLyB0aGlzLnBvc1swXSArPSB0aGlzLnZlbFswXTtcbiAgICAvLyB0aGlzLnBvc1sxXSArPSB0aGlzLnZlbFsxXTtcbiAgICAvLyBkZWJ1Z2dlcjtcbiAgICAvLyBpZiAodGhpcy5pc091dE9mQm91bmRzKHRoaXMucG9zKSkge1xuICAgIC8vICAgdGhpcy5wb3MgPSBbXG4gICAgLy8gICAgIHRoaXMud3JhcCh0aGlzLnBvc1swXSwgdGhpcy5nYW1lLnhEaW0pLFxuICAgIC8vICAgICB0aGlzLndyYXAodGhpcy5wb3NbMV0sIHRoaXMuZ2FtZS55RGltKSxcbiAgICAvLyAgIF07XG4gICAgLy8gfVxuICB9XG4gIGlzT3V0T2ZCb3VuZHMocG9zKSB7XG4gICAgLy8gZGVidWdnZXI7XG4gICAgcmV0dXJuIChcbiAgICAgIHBvc1swXSA8IDAgfHxcbiAgICAgIHBvc1sxXSA8IDAgfHxcbiAgICAgIHBvc1swXSA+IHRoaXMuZ2FtZS54RGltIHx8XG4gICAgICBwb3NbMV0gPiB0aGlzLmdhbWUueURpbVxuICAgICk7XG4gIH1cblxuICB3cmFwKGNvb3JkLCBtYXgpIHtcbiAgICBpZiAoY29vcmQgPCAwKSB7XG4gICAgICByZXR1cm4gbWF4IC0gKGNvb3JkICUgbWF4KTtcbiAgICB9IGVsc2UgaWYgKGNvb3JkID4gbWF4KSB7XG4gICAgICByZXR1cm4gY29vcmQgJSBtYXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb29yZDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2F0ZWxsaXRlT3NjO1xuIiwiY2xhc3MgU3RhciB7XG4gIGNvbnN0cnVjdG9yKHBvcywgZ2FtZSkge1xuICAgIHRoaXMucG9zID0gcG9zO1xuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgdGhpcy54VmFsID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMSkgKyAxO1xuICAgIHRoaXMueVZhbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEpICsgMTtcbiAgfVxuXG4gIGRyYXcoY3R4KSB7XG4gICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICBjdHguZmlsbFJlY3QodGhpcy5wb3NbMF0sIHRoaXMucG9zWzFdLCB0aGlzLnhWYWwsIHRoaXMueVZhbCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3RhcjtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFzc2VydFwiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cHNcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm9zXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdHJlYW1cIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR0eVwiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXJsXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dGlsXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ6bGliXCIpOzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vc3R5bGVzL2luZGV4LnNjc3NcIjtcbmltcG9ydCBHYW1lIGZyb20gXCIuL3NjcmlwdHMvZ2FtZVwiO1xuaW1wb3J0IEdhbWVWaWV3IGZyb20gXCIuL3NjcmlwdHMvZ2FtZV92aWV3XCI7XG5pbXBvcnQgcmVjZWl2ZURhdGEgZnJvbSBcIi4vc2NyaXB0cy9hcGlfdXRpbFwiO1xuaW1wb3J0IGhhbmRsZVBsYXkgZnJvbSBcIi4vc2NyaXB0cy9idXR0b25fdXRpbFwiO1xuLy8gaW1wb3J0IHJlYWRUTEUgZnJvbSBcIi4vc2NyaXB0cy90bGUvdGxlX3BhcnNlXCI7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKGV2ZW50KSA9PiB7XG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xuXG4gIGNvbnN0IGF1ZGlvQ3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICBoYW5kbGVQbGF5KGF1ZGlvQ3R4KTtcbiAgLy8gcmVhZFRMRTtcbiAgcmVjZWl2ZURhdGEudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICBjb25zdCBJU1NfVExFID0gYDEgMjc2NTFVIDAzMDA0QSAgIDIxMTUzLjUwNDgxNzYyICAuMDAwMDAwNjQgIDAwMDAwKzAgIDIwNzI0LTQgMCAgOTk5MVxuICAgIDIgMjc2NTEgIDM5Ljk5NDAgMTc3LjY1MTMgMDAyMzE2OCAzMjAuMTAxMSAgMzkuODA3NSAxNC44OTMwNjU1Njk5NjM5MGA7XG4gICAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjb25zdCBnID0gbmV3IEdhbWUoY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LCBJU1NfVExFLCBhdWRpb0N0eCk7XG4gICAgY29uc3QgZ2FtZXZpZXcgPSBuZXcgR2FtZVZpZXcocmVzcG9uc2UsIGF1ZGlvQ3R4KTtcbiAgICBnYW1ldmlldy5zdGFydCgpO1xuICB9KTtcbiAgLy8gfSk7XG5cbiAgLy8gbmV3IEdhbWUoY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KS5zdGFydChjYW52YXMpO1xufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9