/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
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
/***/ (function(module) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module) {

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
/***/ (function(module) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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
/***/ (function(module) {

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
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

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

/***/ "./node_modules/satellite.js/dist/satellite.es.js":
/*!********************************************************!*\
  !*** ./node_modules/satellite.js/dist/satellite.es.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "constants": function() { return /* binding */ constants; },
/* harmony export */   "degreesLat": function() { return /* binding */ degreesLat; },
/* harmony export */   "degreesLong": function() { return /* binding */ degreesLong; },
/* harmony export */   "degreesToRadians": function() { return /* binding */ degreesToRadians; },
/* harmony export */   "dopplerFactor": function() { return /* binding */ dopplerFactor; },
/* harmony export */   "ecfToEci": function() { return /* binding */ ecfToEci; },
/* harmony export */   "ecfToLookAngles": function() { return /* binding */ ecfToLookAngles; },
/* harmony export */   "eciToEcf": function() { return /* binding */ eciToEcf; },
/* harmony export */   "eciToGeodetic": function() { return /* binding */ eciToGeodetic; },
/* harmony export */   "geodeticToEcf": function() { return /* binding */ geodeticToEcf; },
/* harmony export */   "gstime": function() { return /* binding */ gstime; },
/* harmony export */   "invjday": function() { return /* binding */ invjday; },
/* harmony export */   "jday": function() { return /* binding */ jday; },
/* harmony export */   "propagate": function() { return /* binding */ propagate; },
/* harmony export */   "radiansLat": function() { return /* binding */ radiansLat; },
/* harmony export */   "radiansLong": function() { return /* binding */ radiansLong; },
/* harmony export */   "radiansToDegrees": function() { return /* binding */ radiansToDegrees; },
/* harmony export */   "sgp4": function() { return /* binding */ sgp4; },
/* harmony export */   "twoline2satrec": function() { return /* binding */ twoline2satrec; }
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

/***/ "./public/src/scripts/api_util.js":
/*!****************************************!*\
  !*** ./public/src/scripts/api_util.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// const init = {
//   method: "GET",
//   headers: "Access-Control-Allow-Origin",
//   mode: "cors",
//   cache: "default",
// };
var axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");

var isbn = "0201558025";
var receiveData = axios.get("/satellites/active").then(function (response) {
  console.log(response);
  return response;
}).catch(function (error) {
  console.log(error);
});
/* harmony default export */ __webpack_exports__["default"] = (receiveData);

/***/ }),

/***/ "./public/src/scripts/button_util.js":
/*!*******************************************!*\
  !*** ./public/src/scripts/button_util.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var handlePlay = function handlePlay(audioContext) {
  // debugger;
  var audioCtx = audioContext;
  var button = document.getElementById("play_pause");
  button.addEventListener("click", function () {
    console.log("clicked");

    if (audioCtx.state === "suspended") {
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

/* harmony default export */ __webpack_exports__["default"] = (handlePlay);

/***/ }),

/***/ "./public/src/scripts/game.js":
/*!************************************!*\
  !*** ./public/src/scripts/game.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
    value: function draw(ctx) {
      ctx.clearRect(0, 0, this.xDim, this.yDim);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, this.xDim, this.yDim);
      this.stars.forEach(function (star) {
        return star.draw(ctx);
      });
      this.satellites.forEach(function (satellite) {
        return satellite.draw(ctx);
      });
    }
  }, {
    key: "move",
    value: function move(ctx) {
      this.satellites.forEach(function (satellite) {
        return satellite.move(ctx);
      });
    }
  }]);

  return Game;
}();

/* harmony default export */ __webpack_exports__["default"] = (Game);

/***/ }),

/***/ "./public/src/scripts/game_view.js":
/*!*****************************************!*\
  !*** ./public/src/scripts/game_view.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./public/src/scripts/game.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var GameView = /*#__PURE__*/function () {
  function GameView(game, ctx) {
    _classCallCheck(this, GameView);

    this.game = game;
    this.ctx = ctx;
  }

  _createClass(GameView, [{
    key: "start",
    value: function start() {
      var outer = this;
      setInterval(function () {
        // debugger;
        outer.game.xDim = window.innerWidth;
        outer.game.yDim = window.innerHeight;
        outer.game.move(outer.ctx);
        outer.game.draw(outer.ctx);
      }, 1000);
    }
  }]);

  return GameView;
}();

/* harmony default export */ __webpack_exports__["default"] = (GameView);

/***/ }),

/***/ "./public/src/scripts/math_util.js":
/*!*****************************************!*\
  !*** ./public/src/scripts/math_util.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var map_range = function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

var radiansToDegrees = function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
};

var degreesToRadians = function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
};

/* harmony default export */ __webpack_exports__["default"] = (map_range);

/***/ }),

/***/ "./public/src/scripts/satellite.js":
/*!*****************************************!*\
  !*** ./public/src/scripts/satellite.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _math_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math_util */ "./public/src/scripts/math_util.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Satellite = /*#__PURE__*/function () {
  function Satellite(satRec, game) {
    _classCallCheck(this, Satellite);

    this.date = new Date();
    this.positionAndVelocity = satellite.propagate(satRec, this.date);
    this.gmst = satellite.gstime(this.date);
    this.position = satellite.eciToGeodetic(this.positionAndVelocity.position, this.gmst);
    this.game = game;
    this.audioCtx = game.audioCtx;
    console.log(this.position.longitude); // in radians

    console.log(this.position.latitude); // in radians

    console.log(this.position.height); // in km
  }

  _createClass(Satellite, [{
    key: "startOsc",
    value: function startOsc() {
      this.oscillator.type = "sine";
      debugger;
      var newFreq = (0,_math_util__WEBPACK_IMPORTED_MODULE_0__.default)(this.pos[1], 0, this.game.yDim, 0, 20000);
      console.log(newFreq);
      this.oscillator.frequency.value = newFreq; // debugger;

      var gainNode = this.audioCtx.createGain();
      gainNode.gain.value = 0.001; // 10 %

      gainNode.connect(this.audioCtx.destination); // now instead of connecting to aCtx.destination, connect to the gainNode

      this.oscillator.connect(gainNode); // this.oscillator.connect(this.audioCtx.destination);

      this.oscillator.start(0);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {// ctx.beginPath();
      // ctx.arc(this.pos[0], this.pos[1], 2, 0, 2 * Math.PI, true);
      // ctx.strokeStyle = "blue";
      // ctx.lineWidth = 10;
      // ctx.fillStyle = "#46C016";
      // ctx.fill();
      // const newFreq = map_range(this.pos[1], 0, this.game.yDim, 0, 20000);
      // // console.log(newFreq);
      // debugger;
      // this.oscillator.frequency.value = newFreq;
    }
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

  return Satellite;
}();

/* harmony default export */ __webpack_exports__["default"] = (Satellite);

/***/ }),

/***/ "./public/src/scripts/star.js":
/*!************************************!*\
  !*** ./public/src/scripts/star.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (Star);

/***/ }),

/***/ "./public/src/styles/index.scss":
/*!**************************************!*\
  !*** ./public/src/styles/index.scss ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
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





window.addEventListener("DOMContentLoaded", function (event) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var audioCtx = new AudioContext();
  (0,_scripts_button_util__WEBPACK_IMPORTED_MODULE_4__.default)(audioCtx); // receiveData.then((response) => {
  // debugger;

  var ISS_TLE = "1 25544U 98067A   21122.75616700  .00027980  00000-0  51432-3 0  9994\n     2 25544  51.6442 207.4449 0002769 310.1189 193.6568 15.48993527281553";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var g = new _scripts_game__WEBPACK_IMPORTED_MODULE_1__.default(canvas.width, canvas.height, ISS_TLE, audioCtx);
  var gameview = new _scripts_game_view__WEBPACK_IMPORTED_MODULE_2__.default(g, ctx);
  gameview.start(); // });
  // new Game(canvas.width, canvas.height).start(canvas);
});
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9zYXRlbGxpdGUuanMvZGlzdC9zYXRlbGxpdGUuZXMuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vcHVibGljL3NyYy9zY3JpcHRzL2FwaV91dGlsLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL3B1YmxpYy9zcmMvc2NyaXB0cy9idXR0b25fdXRpbC5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9wdWJsaWMvc3JjL3NjcmlwdHMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9wdWJsaWMvc3JjL3NjcmlwdHMvZ2FtZV92aWV3LmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL3B1YmxpYy9zcmMvc2NyaXB0cy9tYXRoX3V0aWwuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vcHVibGljL3NyYy9zY3JpcHRzL3NhdGVsbGl0ZS5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9wdWJsaWMvc3JjL3NjcmlwdHMvc3Rhci5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9wdWJsaWMvc3JjL3N0eWxlcy9pbmRleC5zY3NzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL3B1YmxpYy9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiYXhpb3MiLCJyZXF1aXJlIiwiaXNibiIsInJlY2VpdmVEYXRhIiwiZ2V0IiwidGhlbiIsInJlc3BvbnNlIiwiY29uc29sZSIsImxvZyIsImNhdGNoIiwiZXJyb3IiLCJoYW5kbGVQbGF5IiwiYXVkaW9Db250ZXh0IiwiYXVkaW9DdHgiLCJidXR0b24iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0YXRlIiwicmVzdW1lIiwib3NjaWxsYXRvciIsImNyZWF0ZU9zY2lsbGF0b3IiLCJ0eXBlIiwiZnJlcXVlbmN5IiwidmFsdWUiLCJzdGFydCIsInN1c3BlbmQiLCJHYW1lIiwieERpbSIsInlEaW0iLCJ0bGUiLCJzYXRlbGxpdGVzIiwic3RhcnMiLCJhZGRTYXRlbGxpdGVzIiwiYWRkU3RhcnMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJpIiwiY3VycmVudFN0YXIiLCJTdGFyIiwicmFuZG9tUG9zIiwicHVzaCIsInNhdHJlYyIsInNhdGVsbGl0ZSIsInR3b2xpbmUyc2F0cmVjIiwic3BsaXQiLCJ0cmltIiwiY3VycmVudFNhdGVsbGl0ZSIsIlNhdGVsbGl0ZSIsImN0eCIsImNsZWFyUmVjdCIsImZpbGxTdHlsZSIsImZpbGxSZWN0IiwiZm9yRWFjaCIsInN0YXIiLCJkcmF3IiwibW92ZSIsIkdhbWVWaWV3IiwiZ2FtZSIsIm91dGVyIiwic2V0SW50ZXJ2YWwiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJtYXBfcmFuZ2UiLCJsb3cxIiwiaGlnaDEiLCJsb3cyIiwiaGlnaDIiLCJyYWRpYW5zVG9EZWdyZWVzIiwicmFkaWFucyIsIlBJIiwiZGVncmVlc1RvUmFkaWFucyIsImRlZ3JlZXMiLCJzYXRSZWMiLCJkYXRlIiwiRGF0ZSIsInBvc2l0aW9uQW5kVmVsb2NpdHkiLCJwcm9wYWdhdGUiLCJnbXN0IiwiZ3N0aW1lIiwicG9zaXRpb24iLCJlY2lUb0dlb2RldGljIiwibG9uZ2l0dWRlIiwibGF0aXR1ZGUiLCJoZWlnaHQiLCJuZXdGcmVxIiwicG9zIiwiZ2Fpbk5vZGUiLCJjcmVhdGVHYWluIiwiZ2FpbiIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImNvb3JkIiwibWF4IiwieFZhbCIsInlWYWwiLCJldmVudCIsImNhbnZhcyIsImdldENvbnRleHQiLCJBdWRpb0NvbnRleHQiLCJJU1NfVExFIiwid2lkdGgiLCJnIiwiZ2FtZXZpZXciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDRGQUF1QyxDOzs7Ozs7Ozs7OztBQ0ExQjs7QUFFYixZQUFZLG1CQUFPLENBQUMscURBQVk7O0FBRWhDLGFBQWEsbUJBQU8sQ0FBQyxpRUFBa0I7O0FBRXZDLGNBQWMsbUJBQU8sQ0FBQyx5RUFBc0I7O0FBRTVDLGVBQWUsbUJBQU8sQ0FBQywyRUFBdUI7O0FBRTlDLG9CQUFvQixtQkFBTyxDQUFDLDZFQUF1Qjs7QUFFbkQsbUJBQW1CLG1CQUFPLENBQUMsbUZBQTJCOztBQUV0RCxzQkFBc0IsbUJBQU8sQ0FBQyx5RkFBOEI7O0FBRTVELGtCQUFrQixtQkFBTyxDQUFDLHlFQUFxQjs7QUFFL0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0Q0FBNEM7QUFDNUM7O0FBRUEsdUNBQXVDOztBQUV2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0hBQWdIOztBQUVoSCxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3Qzs7QUFFeEM7QUFDQSxNQUFNOzs7QUFHTjtBQUNBO0FBQ0E7QUFD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QUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLFFBQVE7QUFDckI7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWSxRQUFRO0FBQ3BCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxRQUFRO0FBQ3JCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxPQUFPO0FBQ3BCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGFBQWE7QUFDeEIsV0FBVyxTQUFTO0FBQ3BCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQ0FBbUMsT0FBTztBQUMxQztBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixTQUFTLEdBQUcsU0FBUztBQUM1QywyQkFBMkI7QUFDM0I7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhLE9BQU87QUFDcEI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCw0QkFBNEI7QUFDNUIsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQSx1Q0FBdUMsT0FBTztBQUM5QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQixZQUFZLE9BQU87QUFDbkI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZLE9BQU87QUFDbkI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCOztBQUVsQiwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUNBQWlDOztBQUVqQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOEJBQThCOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDs7QUFFakQsc0VBQXNFOztBQUV0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjs7QUFFcEIsc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7O0FBRVY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qjs7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxREFBcUQ7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDOztBQUVyQztBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7O0FBRXZCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7O0FBRXZDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsK0JBQStCOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQ0FBb0M7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsNkhBQTZIOztBQUU3SCx3Q0FBd0M7QUFDeEM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCOztBQUU3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1COztBQUVuQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDOztBQUVyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOztBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUEsb0JBQW9COztBQUVwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7OztBQUdBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7O0FBRXRCO0FBQ0EsbUJBQW1COztBQUVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNDQUFzQzs7QUFFdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7O0FBRXJDO0FBQ0EsOEJBQThCOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1Qjs7QUFFdkI7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBLHdDQUF3Qzs7QUFFeEM7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMkRBQTJEOztBQUUzRDtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtHQUFrRzs7QUFFbEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVGQUF1Rjs7QUFFdkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7O0FBRXhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCOztBQUV4QixpQ0FBaUM7QUFDakM7O0FBRUEsb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNDQUFzQzs7QUFFdEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQ0FBb0M7O0FBRXBDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSx3Q0FBd0M7O0FBRXhDO0FBQ0E7QUFDQTtBQUNBLHVDQUF1Qzs7QUFFdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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LENBQXdCLGtCQUF4QixFQUE0QyxVQUFDaUYsS0FBRCxFQUFXO0FBQ3JELE1BQU1DLE1BQU0sR0FBR3BGLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixRQUF4QixDQUFmO0FBQ0EsTUFBTWtDLEdBQUcsR0FBR2lELE1BQU0sQ0FBQ0MsVUFBUCxDQUFrQixJQUFsQixDQUFaO0FBQ0EsTUFBTXZGLFFBQVEsR0FBRyxJQUFJd0YsWUFBSixFQUFqQjtBQUNBMUYsK0RBQVUsQ0FBQ0UsUUFBRCxDQUFWLENBSnFELENBTXJEO0FBQ0E7O0FBQ0EsTUFBTXlGLE9BQU8sc0pBQWI7QUFFQUgsUUFBTSxDQUFDSSxLQUFQLEdBQWV6QyxNQUFNLENBQUNDLFVBQXRCO0FBQ0FvQyxRQUFNLENBQUNiLE1BQVAsR0FBZ0J4QixNQUFNLENBQUNFLFdBQXZCO0FBQ0EsTUFBTXdDLENBQUMsR0FBRyxJQUFJN0Usa0RBQUosQ0FBU3dFLE1BQU0sQ0FBQ0ksS0FBaEIsRUFBdUJKLE1BQU0sQ0FBQ2IsTUFBOUIsRUFBc0NnQixPQUF0QyxFQUErQ3pGLFFBQS9DLENBQVY7QUFDQSxNQUFNNEYsUUFBUSxHQUFHLElBQUkvQyx1REFBSixDQUFhOEMsQ0FBYixFQUFnQnRELEdBQWhCLENBQWpCO0FBQ0F1RCxVQUFRLENBQUNoRixLQUFULEdBZHFELENBZXJEO0FBRUE7QUFDRCxDQWxCRCxFIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbnZhciBzZXR0bGUgPSByZXF1aXJlKCcuLy4uL2NvcmUvc2V0dGxlJyk7XG5cbnZhciBjb29raWVzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2Nvb2tpZXMnKTtcblxudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG5cbnZhciBidWlsZEZ1bGxQYXRoID0gcmVxdWlyZSgnLi4vY29yZS9idWlsZEZ1bGxQYXRoJyk7XG5cbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzJyk7XG5cbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG5cbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4uL2NvcmUvY3JlYXRlRXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG4gICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgfVxuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTsgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuXG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkID8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpZy5hdXRoLnBhc3N3b3JkKSkgOiAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgdmFyIGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoZnVsbFBhdGgsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7IC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG5cbiAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDsgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZVxuXG4gICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgaWYgKCFyZXF1ZXN0IHx8IHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9IC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcbiAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG5cblxuICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2VcblxuXG4gICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG4gICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIWNvbmZpZy5yZXNwb25zZVR5cGUgfHwgY29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnID8gcmVxdWVzdC5yZXNwb25zZVRleHQgOiByZXF1ZXN0LnJlc3BvbnNlO1xuICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuICAgICAgfTtcbiAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKTsgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9OyAvLyBIYW5kbGUgYnJvd3NlciByZXF1ZXN0IGNhbmNlbGxhdGlvbiAoYXMgb3Bwb3NlZCB0byBhIG1hbnVhbCBjYW5jZWxsYXRpb24pXG5cblxuICAgIHJlcXVlc3Qub25hYm9ydCA9IGZ1bmN0aW9uIGhhbmRsZUFib3J0KCkge1xuICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdSZXF1ZXN0IGFib3J0ZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLCByZXF1ZXN0KSk7IC8vIENsZWFuIHVwIHJlcXVlc3RcblxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTsgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuXG5cbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBjb25maWcsIG51bGwsIHJlcXVlc3QpKTsgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9OyAvLyBIYW5kbGUgdGltZW91dFxuXG5cbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICB2YXIgdGltZW91dEVycm9yTWVzc2FnZSA9ICd0aW1lb3V0IG9mICcgKyBjb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCc7XG5cbiAgICAgIGlmIChjb25maWcudGltZW91dEVycm9yTWVzc2FnZSkge1xuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlID0gY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2U7XG4gICAgICB9XG5cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcih0aW1lb3V0RXJyb3JNZXNzYWdlLCBjb25maWcsICdFQ09OTkFCT1JURUQnLCByZXF1ZXN0KSk7IC8vIENsZWFuIHVwIHJlcXVlc3RcblxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTsgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cblxuXG4gICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihmdWxsUGF0aCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/IGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfSAvLyBBZGQgaGVhZGVycyB0byB0aGUgcmVxdWVzdFxuXG5cbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSAvLyBBZGQgd2l0aENyZWRlbnRpYWxzIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG5cblxuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnLndpdGhDcmVkZW50aWFscykpIHtcbiAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gISFjb25maWcud2l0aENyZWRlbnRpYWxzO1xuICAgIH0gLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuXG5cbiAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBFeHBlY3RlZCBET01FeGNlcHRpb24gdGhyb3duIGJ5IGJyb3dzZXJzIG5vdCBjb21wYXRpYmxlIFhNTEh0dHBSZXF1ZXN0IExldmVsIDIuXG4gICAgICAgIC8vIEJ1dCwgdGhpcyBjYW4gYmUgc3VwcHJlc3NlZCBmb3IgJ2pzb24nIHR5cGUgYXMgaXQgY2FuIGJlIHBhcnNlZCBieSBkZWZhdWx0ICd0cmFuc2Zvcm1SZXNwb25zZScgZnVuY3Rpb24uXG4gICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG5cblxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH0gLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcblxuXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIHJlamVjdChjYW5jZWwpOyAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cbiAgICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIXJlcXVlc3REYXRhKSB7XG4gICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG4gICAgfSAvLyBTZW5kIHRoZSByZXF1ZXN0XG5cblxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSk7XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xuXG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcblxudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9jb3JlL21lcmdlQ29uZmlnJyk7XG5cbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5cblxuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcbiAgdmFyIGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7IC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG5cbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQpOyAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcblxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQpO1xuICByZXR1cm4gaW5zdGFuY2U7XG59IC8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxuXG5cbnZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTsgLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5cbmF4aW9zLkF4aW9zID0gQXhpb3M7IC8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcblxuYXhpb3MuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGluc3RhbmNlQ29uZmlnKSB7XG4gIHJldHVybiBjcmVhdGVJbnN0YW5jZShtZXJnZUNvbmZpZyhheGlvcy5kZWZhdWx0cywgaW5zdGFuY2VDb25maWcpKTtcbn07IC8vIEV4cG9zZSBDYW5jZWwgJiBDYW5jZWxUb2tlblxuXG5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpOyAvLyBFeHBvc2UgYWxsL3NwcmVhZFxuXG5heGlvcy5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn07XG5cbmF4aW9zLnNwcmVhZCA9IHJlcXVpcmUoJy4vaGVscGVycy9zcHJlYWQnKTsgLy8gRXhwb3NlIGlzQXhpb3NFcnJvclxuXG5heGlvcy5pc0F4aW9zRXJyb3IgPSByZXF1aXJlKCcuL2hlbHBlcnMvaXNBeGlvc0Vycm9yJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zOyAvLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcblxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGF4aW9zOyIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQSBgQ2FuY2VsYCBpcyBhbiBvYmplY3QgdGhhdCBpcyB0aHJvd24gd2hlbiBhbiBvcGVyYXRpb24gaXMgY2FuY2VsZWQuXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG4gKi9cblxuZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuQ2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcbn07XG5cbkNhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbDsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDYW5jZWwgPSByZXF1aXJlKCcuL0NhbmNlbCcpO1xuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5cblxuZnVuY3Rpb24gQ2FuY2VsVG9rZW4oZXhlY3V0b3IpIHtcbiAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgfVxuXG4gIHZhciByZXNvbHZlUHJvbWlzZTtcbiAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuICB2YXIgdG9rZW4gPSB0aGlzO1xuICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG4gICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgfSk7XG59XG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cblxuXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIHRocm93IHRoaXMucmVhc29uO1xuICB9XG59O1xuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG4gKiBjYW5jZWxzIHRoZSBgQ2FuY2VsVG9rZW5gLlxuICovXG5cblxuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9idWlsZFVSTCcpO1xuXG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcblxudmFyIGRpc3BhdGNoUmVxdWVzdCA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hSZXF1ZXN0Jyk7XG5cbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vbWVyZ2VDb25maWcnKTtcbi8qKlxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlQ29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKi9cblxuXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5cblxuQXhpb3MucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0KGNvbmZpZykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25maWcgPSBhcmd1bWVudHNbMV0gfHwge307XG4gICAgY29uZmlnLnVybCA9IGFyZ3VtZW50c1swXTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gIH1cblxuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpOyAvLyBTZXQgY29uZmlnLm1ldGhvZFxuXG4gIGlmIChjb25maWcubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIGlmICh0aGlzLmRlZmF1bHRzLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSB0aGlzLmRlZmF1bHRzLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZy5tZXRob2QgPSAnZ2V0JztcbiAgfSAvLyBIb29rIHVwIGludGVyY2VwdG9ycyBtaWRkbGV3YXJlXG5cblxuICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuQXhpb3MucHJvdG90eXBlLmdldFVyaSA9IGZ1bmN0aW9uIGdldFVyaShjb25maWcpIHtcbiAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgcmV0dXJuIGJ1aWxkVVJMKGNvbmZpZy51cmwsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKS5yZXBsYWNlKC9eXFw/LywgJycpO1xufTsgLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG5cblxudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24gKHVybCwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiAoY29uZmlnIHx8IHt9KS5kYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uICh1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBBeGlvczsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuICB0aGlzLmhhbmRsZXJzID0gW107XG59XG4vKipcbiAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAqL1xuXG5cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcbiAgdGhpcy5oYW5kbGVycy5wdXNoKHtcbiAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcbiAgICByZWplY3RlZDogcmVqZWN0ZWRcbiAgfSk7XG4gIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG59O1xuLyoqXG4gKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gKi9cblxuXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICB9XG59O1xuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuICpcbiAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICovXG5cblxuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgZm4oaCk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwnKTtcblxudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi4vaGVscGVycy9jb21iaW5lVVJMcycpO1xuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIGJhc2VVUkwgd2l0aCB0aGUgcmVxdWVzdGVkVVJMLFxuICogb25seSB3aGVuIHRoZSByZXF1ZXN0ZWRVUkwgaXMgbm90IGFscmVhZHkgYW4gYWJzb2x1dGUgVVJMLlxuICogSWYgdGhlIHJlcXVlc3RVUkwgaXMgYWJzb2x1dGUsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcmVxdWVzdGVkVVJMIHVudG91Y2hlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0ZWRVUkwgQWJzb2x1dGUgb3IgcmVsYXRpdmUgVVJMIHRvIGNvbWJpbmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBmdWxsIHBhdGhcbiAqL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRGdWxsUGF0aChiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpIHtcbiAgaWYgKGJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwocmVxdWVzdGVkVVJMKSkge1xuICAgIHJldHVybiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpO1xuICB9XG5cbiAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi9lbmhhbmNlRXJyb3InKTtcbi8qKlxuICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xuXG52YXIgaXNDYW5jZWwgPSByZXF1aXJlKCcuLi9jYW5jZWwvaXNDYW5jZWwnKTtcblxudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi4vZGVmYXVsdHMnKTtcbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuXG5cbmZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICB9XG59XG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAqL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7IC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG5cbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTsgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YShjb25maWcuZGF0YSwgY29uZmlnLmhlYWRlcnMsIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0KTsgLy8gRmxhdHRlbiBoZWFkZXJzXG5cbiAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LCBjb25maWcuaGVhZGVycyk7XG4gIHV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuICB9KTtcbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTsgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcblxuICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKHJlc3BvbnNlLmRhdGEsIHJlc3BvbnNlLmhlYWRlcnMsIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZSk7XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7IC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG5cbiAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShyZWFzb24ucmVzcG9uc2UuZGF0YSwgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgZXJyb3IuY29uZmlnID0gY29uZmlnO1xuXG4gIGlmIChjb2RlKSB7XG4gICAgZXJyb3IuY29kZSA9IGNvZGU7XG4gIH1cblxuICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgZXJyb3IuaXNBeGlvc0Vycm9yID0gdHJ1ZTtcblxuICBlcnJvci50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIFN0YW5kYXJkXG4gICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAvLyBNaWNyb3NvZnRcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgbnVtYmVyOiB0aGlzLm51bWJlcixcbiAgICAgIC8vIE1vemlsbGFcbiAgICAgIGZpbGVOYW1lOiB0aGlzLmZpbGVOYW1lLFxuICAgICAgbGluZU51bWJlcjogdGhpcy5saW5lTnVtYmVyLFxuICAgICAgY29sdW1uTnVtYmVyOiB0aGlzLmNvbHVtbk51bWJlcixcbiAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgLy8gQXhpb3NcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBjb2RlOiB0aGlzLmNvZGVcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiBlcnJvcjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuLyoqXG4gKiBDb25maWctc3BlY2lmaWMgbWVyZ2UtZnVuY3Rpb24gd2hpY2ggY3JlYXRlcyBhIG5ldyBjb25maWctb2JqZWN0XG4gKiBieSBtZXJnaW5nIHR3byBjb25maWd1cmF0aW9uIG9iamVjdHMgdG9nZXRoZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzFcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBOZXcgb2JqZWN0IHJlc3VsdGluZyBmcm9tIG1lcmdpbmcgY29uZmlnMiB0byBjb25maWcxXG4gKi9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1lcmdlQ29uZmlnKGNvbmZpZzEsIGNvbmZpZzIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGNvbmZpZzIgPSBjb25maWcyIHx8IHt9O1xuICB2YXIgY29uZmlnID0ge307XG4gIHZhciB2YWx1ZUZyb21Db25maWcyS2V5cyA9IFsndXJsJywgJ21ldGhvZCcsICdkYXRhJ107XG4gIHZhciBtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cyA9IFsnaGVhZGVycycsICdhdXRoJywgJ3Byb3h5JywgJ3BhcmFtcyddO1xuICB2YXIgZGVmYXVsdFRvQ29uZmlnMktleXMgPSBbJ2Jhc2VVUkwnLCAndHJhbnNmb3JtUmVxdWVzdCcsICd0cmFuc2Zvcm1SZXNwb25zZScsICdwYXJhbXNTZXJpYWxpemVyJywgJ3RpbWVvdXQnLCAndGltZW91dE1lc3NhZ2UnLCAnd2l0aENyZWRlbnRpYWxzJywgJ2FkYXB0ZXInLCAncmVzcG9uc2VUeXBlJywgJ3hzcmZDb29raWVOYW1lJywgJ3hzcmZIZWFkZXJOYW1lJywgJ29uVXBsb2FkUHJvZ3Jlc3MnLCAnb25Eb3dubG9hZFByb2dyZXNzJywgJ2RlY29tcHJlc3MnLCAnbWF4Q29udGVudExlbmd0aCcsICdtYXhCb2R5TGVuZ3RoJywgJ21heFJlZGlyZWN0cycsICd0cmFuc3BvcnQnLCAnaHR0cEFnZW50JywgJ2h0dHBzQWdlbnQnLCAnY2FuY2VsVG9rZW4nLCAnc29ja2V0UGF0aCcsICdyZXNwb25zZUVuY29kaW5nJ107XG4gIHZhciBkaXJlY3RNZXJnZUtleXMgPSBbJ3ZhbGlkYXRlU3RhdHVzJ107XG5cbiAgZnVuY3Rpb24gZ2V0TWVyZ2VkVmFsdWUodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdCh0YXJnZXQpICYmIHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHRhcmdldCwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHt9LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNBcnJheShzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gc291cmNlLnNsaWNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfVxuXG4gIHV0aWxzLmZvckVhY2godmFsdWVGcm9tQ29uZmlnMktleXMsIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMltwcm9wXSk7XG4gICAgfVxuICB9KTtcbiAgdXRpbHMuZm9yRWFjaChtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cywgbWVyZ2VEZWVwUHJvcGVydGllcyk7XG4gIHV0aWxzLmZvckVhY2goZGVmYXVsdFRvQ29uZmlnMktleXMsIGZ1bmN0aW9uIGRlZmF1bHRUb0NvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMVtwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9KTtcbiAgdXRpbHMuZm9yRWFjaChkaXJlY3RNZXJnZUtleXMsIGZ1bmN0aW9uIG1lcmdlKHByb3ApIHtcbiAgICBpZiAocHJvcCBpbiBjb25maWcyKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKHByb3AgaW4gY29uZmlnMSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuICB2YXIgYXhpb3NLZXlzID0gdmFsdWVGcm9tQ29uZmlnMktleXMuY29uY2F0KG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzKS5jb25jYXQoZGVmYXVsdFRvQ29uZmlnMktleXMpLmNvbmNhdChkaXJlY3RNZXJnZUtleXMpO1xuICB2YXIgb3RoZXJLZXlzID0gT2JqZWN0LmtleXMoY29uZmlnMSkuY29uY2F0KE9iamVjdC5rZXlzKGNvbmZpZzIpKS5maWx0ZXIoZnVuY3Rpb24gZmlsdGVyQXhpb3NLZXlzKGtleSkge1xuICAgIHJldHVybiBheGlvc0tleXMuaW5kZXhPZihrZXkpID09PSAtMTtcbiAgfSk7XG4gIHV0aWxzLmZvckVhY2gob3RoZXJLZXlzLCBtZXJnZURlZXBQcm9wZXJ0aWVzKTtcbiAgcmV0dXJuIGNvbmZpZztcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUVycm9yJyk7XG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICovXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG5cbiAgaWYgKCFyZXNwb25zZS5zdGF0dXMgfHwgIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcbiAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgfSBlbHNlIHtcbiAgICByZWplY3QoY3JlYXRlRXJyb3IoJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cywgcmVzcG9uc2UuY29uZmlnLCBudWxsLCByZXNwb25zZS5yZXF1ZXN0LCByZXNwb25zZSkpO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG4gKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG4gIHJldHVybiBkYXRhO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSByZXF1aXJlKCcuL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZScpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG5cbiAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMveGhyJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKSB7XG4gICAgLy8gRm9yIG5vZGUgdXNlIEhUVFAgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL2h0dHAnKTtcbiAgfVxuXG4gIHJldHVybiBhZGFwdGVyO1xufVxuXG52YXIgZGVmYXVsdHMgPSB7XG4gIGFkYXB0ZXI6IGdldERlZmF1bHRBZGFwdGVyKCksXG4gIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdBY2NlcHQnKTtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8IHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHwgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHwgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHwgdXRpbHMuaXNGaWxlKGRhdGEpIHx8IHV0aWxzLmlzQmxvYihkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvKiBJZ25vcmUgKi9cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuICAgKi9cbiAgdGltZW91dDogMCxcbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcbiAgbWF4Qm9keUxlbmd0aDogLTEsXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH1cbn07XG5kZWZhdWx0cy5oZWFkZXJzID0ge1xuICBjb21tb246IHtcbiAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcbiAgfVxufTtcbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0czsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBlbmNvZGUodmFsKSB7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5yZXBsYWNlKC8lM0EvZ2ksICc6JykucmVwbGFjZSgvJTI0L2csICckJykucmVwbGFjZSgvJTJDL2dpLCAnLCcpLnJlcGxhY2UoLyUyMC9nLCAnKycpLnJlcGxhY2UoLyU1Qi9naSwgJ1snKS5yZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG4vKipcbiAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG4gKi9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcblxuICBpZiAocGFyYW1zU2VyaWFsaXplcikge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXNTZXJpYWxpemVyKHBhcmFtcyk7XG4gIH0gZWxzZSBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSkge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXMudG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcGFydHMgPSBbXTtcbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cblxuICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgJz0nICsgZW5jb2RlKHYpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHZhciBoYXNobWFya0luZGV4ID0gdXJsLmluZGV4T2YoJyMnKTtcblxuICAgIGlmIChoYXNobWFya0luZGV4ICE9PSAtMSkge1xuICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIGhhc2htYXJrSW5kZXgpO1xuICAgIH1cblxuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBzcGVjaWZpZWQgVVJMc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVVJMIFRoZSByZWxhdGl2ZSBVUkxcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBVUkxcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTCA/IGJhc2VVUkwucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKSA6IGJhc2VVUkw7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgPyAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbmZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgcmV0dXJuIHtcbiAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICB2YXIgY29va2llID0gW107XG4gICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cbiAgICAgIGlmICh1dGlscy5pc051bWJlcihleHBpcmVzKSkge1xuICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc1N0cmluZyhkb21haW4pKSB7XG4gICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWN1cmUgPT09IHRydWUpIHtcbiAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcbiAgICB9LFxuICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQobmFtZSkge1xuICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgIHJldHVybiBtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICB9XG4gIH07XG59KCkgOiAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG5mdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIHJldHVybiB7XG4gICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCkge30sXG4gICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICB9O1xufSgpOyIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvc1xuICpcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXhpb3NFcnJvcihwYXlsb2FkKSB7XG4gIHJldHVybiB0eXBlb2YgcGF5bG9hZCA9PT0gJ29iamVjdCcgJiYgcGF5bG9hZC5pc0F4aW9zRXJyb3IgPT09IHRydWU7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgPyAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3Rcbi8vIHdoZXRoZXIgdGhlIHJlcXVlc3QgVVJMIGlzIG9mIHRoZSBzYW1lIG9yaWdpbiBhcyBjdXJyZW50IGxvY2F0aW9uLlxuZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgdmFyIG9yaWdpblVSTDtcbiAgLyoqXG4gICogUGFyc2UgYSBVUkwgdG8gZGlzY292ZXIgaXQncyBjb21wb25lbnRzXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICogQHJldHVybnMge09iamVjdH1cbiAgKi9cblxuICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgIHZhciBocmVmID0gdXJsO1xuXG4gICAgaWYgKG1zaWUpIHtcbiAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG4gICAgfVxuXG4gICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7IC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcblxuICAgIHJldHVybiB7XG4gICAgICBocmVmOiB1cmxQYXJzaW5nTm9kZS5ocmVmLFxuICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICBzZWFyY2g6IHVybFBhcnNpbmdOb2RlLnNlYXJjaCA/IHVybFBhcnNpbmdOb2RlLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpIDogJycsXG4gICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgcG9ydDogdXJsUGFyc2luZ05vZGUucG9ydCxcbiAgICAgIHBhdGhuYW1lOiB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJyA/IHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDogJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICB9O1xuICB9XG5cbiAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gIC8qKlxuICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICovXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgdmFyIHBhcnNlZCA9IHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG4gICAgcmV0dXJuIHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdDtcbiAgfTtcbn0oKSA6IC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG5mdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG59KCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpOyAvLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xuXG5cbnZhciBpZ25vcmVEdXBsaWNhdGVPZiA9IFsnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLCAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJywgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCddO1xuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG4gIHZhciBwYXJzZWQgPSB7fTtcbiAgdmFyIGtleTtcbiAgdmFyIHZhbDtcbiAgdmFyIGk7XG5cbiAgaWYgKCFoZWFkZXJzKSB7XG4gICAgcmV0dXJuIHBhcnNlZDtcbiAgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHBhcnNlZDtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xuLypnbG9iYWwgdG9TdHJpbmc6dHJ1ZSovXG4vLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXksIG90aGVyd2lzZSBmYWxzZVxuICovXG5cbmZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc0J1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsKSAmJiB2YWwuY29uc3RydWN0b3IgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbC5jb25zdHJ1Y3RvcikgJiYgdHlwZW9mIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIodmFsKTtcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNGb3JtRGF0YSh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsIGluc3RhbmNlb2YgRm9ybURhdGE7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcbiAgdmFyIHJlc3VsdDtcblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiBBcnJheUJ1ZmZlci5pc1ZpZXcpIHtcbiAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSB2YWwgJiYgdmFsLmJ1ZmZlciAmJiB2YWwuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXI7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWwpIHtcbiAgaWYgKHRvU3RyaW5nLmNhbGwodmFsKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbCk7XG4gIHJldHVybiBwcm90b3R5cGUgPT09IG51bGwgfHwgcHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRmlsZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzQmxvYih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQmxvYl0nO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzVVJMU2VhcmNoUGFyYW1zKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIFVSTFNlYXJjaFBhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsIGluc3RhbmNlb2YgVVJMU2VhcmNoUGFyYW1zO1xufVxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5cblxuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICogbmF0aXZlc2NyaXB0XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ05hdGl2ZVNjcmlwdCcgb3IgJ05TJ1xuICovXG5cblxuZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiAobmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScgfHwgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOYXRpdmVTY3JpcHQnIHx8IG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTlMnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnO1xufVxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuICovXG5cblxuZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuKSB7XG4gIC8vIERvbid0IGJvdGhlciBpZiBubyB2YWx1ZSBwcm92aWRlZFxuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9IC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuXG5cbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgb2JqID0gW29ial07XG4gIH1cblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICogQHJldHVybnMge09iamVjdH0gUmVzdWx0IG9mIGFsbCBtZXJnZSBwcm9wZXJ0aWVzXG4gKi9cblxuXG5mdW5jdGlvbiBtZXJnZSgpXG4vKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi9cbntcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3QocmVzdWx0W2tleV0pICYmIGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZSh7fSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWwuc2xpY2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuXG5cbmZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG4gIGZvckVhY2goYiwgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFba2V5XSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYTtcbn1cbi8qKlxuICogUmVtb3ZlIGJ5dGUgb3JkZXIgbWFya2VyLiBUaGlzIGNhdGNoZXMgRUYgQkIgQkYgKHRoZSBVVEYtOCBCT00pXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnQgd2l0aCBCT01cbiAqIEByZXR1cm4ge3N0cmluZ30gY29udGVudCB2YWx1ZSB3aXRob3V0IEJPTVxuICovXG5cblxuZnVuY3Rpb24gc3RyaXBCT00oY29udGVudCkge1xuICBpZiAoY29udGVudC5jaGFyQ29kZUF0KDApID09PSAweEZFRkYpIHtcbiAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgxKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNBcnJheTogaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcbiAgaXNCdWZmZXI6IGlzQnVmZmVyLFxuICBpc0Zvcm1EYXRhOiBpc0Zvcm1EYXRhLFxuICBpc0FycmF5QnVmZmVyVmlldzogaXNBcnJheUJ1ZmZlclZpZXcsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzUGxhaW5PYmplY3Q6IGlzUGxhaW5PYmplY3QsXG4gIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlOiBpc0RhdGUsXG4gIGlzRmlsZTogaXNGaWxlLFxuICBpc0Jsb2I6IGlzQmxvYixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNTdHJlYW06IGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtczogaXNVUkxTZWFyY2hQYXJhbXMsXG4gIGlzU3RhbmRhcmRCcm93c2VyRW52OiBpc1N0YW5kYXJkQnJvd3NlckVudixcbiAgZm9yRWFjaDogZm9yRWFjaCxcbiAgbWVyZ2U6IG1lcmdlLFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgdHJpbTogdHJpbSxcbiAgc3RyaXBCT006IHN0cmlwQk9NXG59OyIsIi8qIVxuICogc2F0ZWxsaXRlLWpzIHY0LjEuM1xuICogKGMpIDIwMTMgU2hhc2h3YXQgS2FuZGFkYWkgYW5kIFVDU0NcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zaGFzaHdhdGFrL3NhdGVsbGl0ZS1qc1xuICogTGljZW5zZTogTUlUXG4gKi9cbnZhciBwaSA9IE1hdGguUEk7XG52YXIgdHdvUGkgPSBwaSAqIDI7XG52YXIgZGVnMnJhZCA9IHBpIC8gMTgwLjA7XG52YXIgcmFkMmRlZyA9IDE4MCAvIHBpO1xudmFyIG1pbnV0ZXNQZXJEYXkgPSAxNDQwLjA7XG52YXIgbXUgPSAzOTg2MDAuNTsgLy8gaW4ga20zIC8gczJcblxudmFyIGVhcnRoUmFkaXVzID0gNjM3OC4xMzc7IC8vIGluIGttXG5cbnZhciB4a2UgPSA2MC4wIC8gTWF0aC5zcXJ0KGVhcnRoUmFkaXVzICogZWFydGhSYWRpdXMgKiBlYXJ0aFJhZGl1cyAvIG11KTtcbnZhciB2a21wZXJzZWMgPSBlYXJ0aFJhZGl1cyAqIHhrZSAvIDYwLjA7XG52YXIgdHVtaW4gPSAxLjAgLyB4a2U7XG52YXIgajIgPSAwLjAwMTA4MjYyOTk4OTA1O1xudmFyIGozID0gLTAuMDAwMDAyNTMyMTUzMDY7XG52YXIgajQgPSAtMC4wMDAwMDE2MTA5ODc2MTtcbnZhciBqM29qMiA9IGozIC8gajI7XG52YXIgeDJvMyA9IDIuMCAvIDMuMDtcbnZhciBjb25zdGFudHMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gIF9fcHJvdG9fXzogbnVsbCxcbiAgcGk6IHBpLFxuICB0d29QaTogdHdvUGksXG4gIGRlZzJyYWQ6IGRlZzJyYWQsXG4gIHJhZDJkZWc6IHJhZDJkZWcsXG4gIG1pbnV0ZXNQZXJEYXk6IG1pbnV0ZXNQZXJEYXksXG4gIG11OiBtdSxcbiAgZWFydGhSYWRpdXM6IGVhcnRoUmFkaXVzLFxuICB4a2U6IHhrZSxcbiAgdmttcGVyc2VjOiB2a21wZXJzZWMsXG4gIHR1bWluOiB0dW1pbixcbiAgajI6IGoyLFxuICBqMzogajMsXG4gIGo0OiBqNCxcbiAgajNvajI6IGozb2oyLFxuICB4Mm8zOiB4Mm8zXG59KTtcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWR1cmUgZGF5czJtZGhtc1xuICpcbiAqICB0aGlzIHByb2NlZHVyZSBjb252ZXJ0cyB0aGUgZGF5IG9mIHRoZSB5ZWFyLCBkYXlzLCB0byB0aGUgZXF1aXZhbGVudCBtb250aFxuICogICAgZGF5LCBob3VyLCBtaW51dGUgYW5kIHNlY29uZC5cbiAqXG4gKiAgYWxnb3JpdGhtICAgICA6IHNldCB1cCBhcnJheSBmb3IgdGhlIG51bWJlciBvZiBkYXlzIHBlciBtb250aFxuICogICAgICAgICAgICAgICAgICBmaW5kIGxlYXAgeWVhciAtIHVzZSAxOTAwIGJlY2F1c2UgMjAwMCBpcyBhIGxlYXAgeWVhclxuICogICAgICAgICAgICAgICAgICBsb29wIHRocm91Z2ggYSB0ZW1wIHZhbHVlIHdoaWxlIHRoZSB2YWx1ZSBpcyA8IHRoZSBkYXlzXG4gKiAgICAgICAgICAgICAgICAgIHBlcmZvcm0gaW50IGNvbnZlcnNpb25zIHRvIHRoZSBjb3JyZWN0IGRheSBhbmQgbW9udGhcbiAqICAgICAgICAgICAgICAgICAgY29udmVydCByZW1haW5kZXIgaW50byBoIG0gcyB1c2luZyB0eXBlIGNvbnZlcnNpb25zXG4gKlxuICogIGF1dGhvciAgICAgICAgOiBkYXZpZCB2YWxsYWRvICAgICAgICAgICAgICAgICAgNzE5LTU3My0yNjAwICAgIDEgbWFyIDIwMDFcbiAqXG4gKiAgaW5wdXRzICAgICAgICAgIGRlc2NyaXB0aW9uICAgICAgICAgICAgICAgICAgICByYW5nZSAvIHVuaXRzXG4gKiAgICB5ZWFyICAgICAgICAtIHllYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAxOTAwIC4uIDIxMDBcbiAqICAgIGRheXMgICAgICAgIC0ganVsaWFuIGRheSBvZiB0aGUgeWVhciAgICAgICAgIDAuMCAgLi4gMzY2LjBcbiAqXG4gKiAgb3V0cHV0cyAgICAgICA6XG4gKiAgICBtb24gICAgICAgICAtIG1vbnRoICAgICAgICAgICAgICAgICAgICAgICAgICAxIC4uIDEyXG4gKiAgICBkYXkgICAgICAgICAtIGRheSAgICAgICAgICAgICAgICAgICAgICAgICAgICAxIC4uIDI4LDI5LDMwLDMxXG4gKiAgICBociAgICAgICAgICAtIGhvdXIgICAgICAgICAgICAgICAgICAgICAgICAgICAwIC4uIDIzXG4gKiAgICBtaW4gICAgICAgICAtIG1pbnV0ZSAgICAgICAgICAgICAgICAgICAgICAgICAwIC4uIDU5XG4gKiAgICBzZWMgICAgICAgICAtIHNlY29uZCAgICAgICAgICAgICAgICAgICAgICAgICAwLjAgLi4gNTkuOTk5XG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgZGF5b2Z5ciAgICAgLSBkYXkgb2YgeWVhclxuICogICAgdGVtcCAgICAgICAgLSB0ZW1wb3JhcnkgZXh0ZW5kZWQgdmFsdWVzXG4gKiAgICBpbnR0ZW1wICAgICAtIHRlbXBvcmFyeSBpbnQgdmFsdWVcbiAqICAgIGkgICAgICAgICAgIC0gaW5kZXhcbiAqICAgIGxtb250aFsxMl0gIC0gaW50IGFycmF5IGNvbnRhaW5pbmcgdGhlIG51bWJlciBvZiBkYXlzIHBlciBtb250aFxuICpcbiAqICBjb3VwbGluZyAgICAgIDpcbiAqICAgIG5vbmUuXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuZnVuY3Rpb24gZGF5czJtZGhtcyh5ZWFyLCBkYXlzKSB7XG4gIHZhciBsbW9udGggPSBbMzEsIHllYXIgJSA0ID09PSAwID8gMjkgOiAyOCwgMzEsIDMwLCAzMSwgMzAsIDMxLCAzMSwgMzAsIDMxLCAzMCwgMzFdO1xuICB2YXIgZGF5b2Z5ciA9IE1hdGguZmxvb3IoZGF5cyk7IC8vICAtLS0tLS0tLS0tLS0tLS0tLSBmaW5kIG1vbnRoIGFuZCBkYXkgb2YgbW9udGggLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGludHRlbXAgPSAwO1xuXG4gIHdoaWxlIChkYXlvZnlyID4gaW50dGVtcCArIGxtb250aFtpIC0gMV0gJiYgaSA8IDEyKSB7XG4gICAgaW50dGVtcCArPSBsbW9udGhbaSAtIDFdO1xuICAgIGkgKz0gMTtcbiAgfVxuXG4gIHZhciBtb24gPSBpO1xuICB2YXIgZGF5ID0gZGF5b2Z5ciAtIGludHRlbXA7IC8vICAtLS0tLS0tLS0tLS0tLS0tLSBmaW5kIGhvdXJzIG1pbnV0ZXMgYW5kIHNlY29uZHMgLS0tLS0tLS0tLS0tLVxuXG4gIHZhciB0ZW1wID0gKGRheXMgLSBkYXlvZnlyKSAqIDI0LjA7XG4gIHZhciBociA9IE1hdGguZmxvb3IodGVtcCk7XG4gIHRlbXAgPSAodGVtcCAtIGhyKSAqIDYwLjA7XG4gIHZhciBtaW51dGUgPSBNYXRoLmZsb29yKHRlbXApO1xuICB2YXIgc2VjID0gKHRlbXAgLSBtaW51dGUpICogNjAuMDtcbiAgcmV0dXJuIHtcbiAgICBtb246IG1vbixcbiAgICBkYXk6IGRheSxcbiAgICBocjogaHIsXG4gICAgbWludXRlOiBtaW51dGUsXG4gICAgc2VjOiBzZWNcbiAgfTtcbn1cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWR1cmUgamRheVxuICpcbiAqICB0aGlzIHByb2NlZHVyZSBmaW5kcyB0aGUganVsaWFuIGRhdGUgZ2l2ZW4gdGhlIHllYXIsIG1vbnRoLCBkYXksIGFuZCB0aW1lLlxuICogICAgdGhlIGp1bGlhbiBkYXRlIGlzIGRlZmluZWQgYnkgZWFjaCBlbGFwc2VkIGRheSBzaW5jZSBub29uLCBqYW4gMSwgNDcxMyBiYy5cbiAqXG4gKiAgYWxnb3JpdGhtICAgICA6IGNhbGN1bGF0ZSB0aGUgYW5zd2VyIGluIG9uZSBzdGVwIGZvciBlZmZpY2llbmN5XG4gKlxuICogIGF1dGhvciAgICAgICAgOiBkYXZpZCB2YWxsYWRvICAgICAgICAgICAgICAgICAgNzE5LTU3My0yNjAwICAgIDEgbWFyIDIwMDFcbiAqXG4gKiAgaW5wdXRzICAgICAgICAgIGRlc2NyaXB0aW9uICAgICAgICAgICAgICAgICAgICByYW5nZSAvIHVuaXRzXG4gKiAgICB5ZWFyICAgICAgICAtIHllYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAxOTAwIC4uIDIxMDBcbiAqICAgIG1vbiAgICAgICAgIC0gbW9udGggICAgICAgICAgICAgICAgICAgICAgICAgIDEgLi4gMTJcbiAqICAgIGRheSAgICAgICAgIC0gZGF5ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEgLi4gMjgsMjksMzAsMzFcbiAqICAgIGhyICAgICAgICAgIC0gdW5pdmVyc2FsIHRpbWUgaG91ciAgICAgICAgICAgIDAgLi4gMjNcbiAqICAgIG1pbiAgICAgICAgIC0gdW5pdmVyc2FsIHRpbWUgbWluICAgICAgICAgICAgIDAgLi4gNTlcbiAqICAgIHNlYyAgICAgICAgIC0gdW5pdmVyc2FsIHRpbWUgc2VjICAgICAgICAgICAgIDAuMCAuLiA1OS45OTlcbiAqXG4gKiAgb3V0cHV0cyAgICAgICA6XG4gKiAgICBqZCAgICAgICAgICAtIGp1bGlhbiBkYXRlICAgICAgICAgICAgICAgICAgICBkYXlzIGZyb20gNDcxMyBiY1xuICpcbiAqICBsb2NhbHMgICAgICAgIDpcbiAqICAgIG5vbmUuXG4gKlxuICogIGNvdXBsaW5nICAgICAgOlxuICogICAgbm9uZS5cbiAqXG4gKiAgcmVmZXJlbmNlcyAgICA6XG4gKiAgICB2YWxsYWRvICAgICAgIDIwMDcsIDE4OSwgYWxnIDE0LCBleCAzLTE0XG4gKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblxuZnVuY3Rpb24gamRheUludGVybmFsKHllYXIsIG1vbiwgZGF5LCBociwgbWludXRlLCBzZWMpIHtcbiAgdmFyIG1zZWMgPSBhcmd1bWVudHMubGVuZ3RoID4gNiAmJiBhcmd1bWVudHNbNl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s2XSA6IDA7XG4gIHJldHVybiAzNjcuMCAqIHllYXIgLSBNYXRoLmZsb29yKDcgKiAoeWVhciArIE1hdGguZmxvb3IoKG1vbiArIDkpIC8gMTIuMCkpICogMC4yNSkgKyBNYXRoLmZsb29yKDI3NSAqIG1vbiAvIDkuMCkgKyBkYXkgKyAxNzIxMDEzLjUgKyAoKG1zZWMgLyA2MDAwMCArIHNlYyAvIDYwLjAgKyBtaW51dGUpIC8gNjAuMCArIGhyKSAvIDI0LjAgLy8gdXQgaW4gZGF5c1xuICAvLyAjIC0gMC41KnNnbigxMDAuMCp5ZWFyICsgbW9uIC0gMTkwMDAyLjUpICsgMC41O1xuICA7XG59XG5cbmZ1bmN0aW9uIGpkYXkoeWVhciwgbW9uLCBkYXksIGhyLCBtaW51dGUsIHNlYywgbXNlYykge1xuICBpZiAoeWVhciBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICB2YXIgZGF0ZSA9IHllYXI7XG4gICAgcmV0dXJuIGpkYXlJbnRlcm5hbChkYXRlLmdldFVUQ0Z1bGxZZWFyKCksIGRhdGUuZ2V0VVRDTW9udGgoKSArIDEsIC8vIE5vdGUsIHRoaXMgZnVuY3Rpb24gcmVxdWlyZXMgbW9udGhzIGluIHJhbmdlIDEtMTIuXG4gICAgZGF0ZS5nZXRVVENEYXRlKCksIGRhdGUuZ2V0VVRDSG91cnMoKSwgZGF0ZS5nZXRVVENNaW51dGVzKCksIGRhdGUuZ2V0VVRDU2Vjb25kcygpLCBkYXRlLmdldFVUQ01pbGxpc2Vjb25kcygpKTtcbiAgfVxuXG4gIHJldHVybiBqZGF5SW50ZXJuYWwoeWVhciwgbW9uLCBkYXksIGhyLCBtaW51dGUsIHNlYywgbXNlYyk7XG59XG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VkdXJlIGludmpkYXlcbiAqXG4gKiAgdGhpcyBwcm9jZWR1cmUgZmluZHMgdGhlIHllYXIsIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSBhbmQgc2Vjb25kXG4gKiAgZ2l2ZW4gdGhlIGp1bGlhbiBkYXRlLiB0dSBjYW4gYmUgdXQxLCB0ZHQsIHRkYiwgZXRjLlxuICpcbiAqICBhbGdvcml0aG0gICAgIDogc2V0IHVwIHN0YXJ0aW5nIHZhbHVlc1xuICogICAgICAgICAgICAgICAgICBmaW5kIGxlYXAgeWVhciAtIHVzZSAxOTAwIGJlY2F1c2UgMjAwMCBpcyBhIGxlYXAgeWVhclxuICogICAgICAgICAgICAgICAgICBmaW5kIHRoZSBlbGFwc2VkIGRheXMgdGhyb3VnaCB0aGUgeWVhciBpbiBhIGxvb3BcbiAqICAgICAgICAgICAgICAgICAgY2FsbCByb3V0aW5lIHRvIGZpbmQgZWFjaCBpbmRpdmlkdWFsIHZhbHVlXG4gKlxuICogIGF1dGhvciAgICAgICAgOiBkYXZpZCB2YWxsYWRvICAgICAgICAgICAgICAgICAgNzE5LTU3My0yNjAwICAgIDEgbWFyIDIwMDFcbiAqXG4gKiAgaW5wdXRzICAgICAgICAgIGRlc2NyaXB0aW9uICAgICAgICAgICAgICAgICAgICByYW5nZSAvIHVuaXRzXG4gKiAgICBqZCAgICAgICAgICAtIGp1bGlhbiBkYXRlICAgICAgICAgICAgICAgICAgICBkYXlzIGZyb20gNDcxMyBiY1xuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIHllYXIgICAgICAgIC0geWVhciAgICAgICAgICAgICAgICAgICAgICAgICAgIDE5MDAgLi4gMjEwMFxuICogICAgbW9uICAgICAgICAgLSBtb250aCAgICAgICAgICAgICAgICAgICAgICAgICAgMSAuLiAxMlxuICogICAgZGF5ICAgICAgICAgLSBkYXkgICAgICAgICAgICAgICAgICAgICAgICAgICAgMSAuLiAyOCwyOSwzMCwzMVxuICogICAgaHIgICAgICAgICAgLSBob3VyICAgICAgICAgICAgICAgICAgICAgICAgICAgMCAuLiAyM1xuICogICAgbWluICAgICAgICAgLSBtaW51dGUgICAgICAgICAgICAgICAgICAgICAgICAgMCAuLiA1OVxuICogICAgc2VjICAgICAgICAgLSBzZWNvbmQgICAgICAgICAgICAgICAgICAgICAgICAgMC4wIC4uIDU5Ljk5OVxuICpcbiAqICBsb2NhbHMgICAgICAgIDpcbiAqICAgIGRheXMgICAgICAgIC0gZGF5IG9mIHllYXIgcGx1cyBmcmFjdGlvbmFsXG4gKiAgICAgICAgICAgICAgICAgIHBvcnRpb24gb2YgYSBkYXkgICAgICAgICAgICAgICBkYXlzXG4gKiAgICB0dSAgICAgICAgICAtIGp1bGlhbiBjZW50dXJpZXMgZnJvbSAwIGhcbiAqICAgICAgICAgICAgICAgICAgamFuIDAsIDE5MDBcbiAqICAgIHRlbXAgICAgICAgIC0gdGVtcG9yYXJ5IGRvdWJsZSB2YWx1ZXNcbiAqICAgIGxlYXB5cnMgICAgIC0gbnVtYmVyIG9mIGxlYXAgeWVhcnMgZnJvbSAxOTAwXG4gKlxuICogIGNvdXBsaW5nICAgICAgOlxuICogICAgZGF5czJtZGhtcyAgLSBmaW5kcyBtb250aCwgZGF5LCBob3VyLCBtaW51dGUgYW5kIHNlY29uZCBnaXZlbiBkYXlzIGFuZCB5ZWFyXG4gKlxuICogIHJlZmVyZW5jZXMgICAgOlxuICogICAgdmFsbGFkbyAgICAgICAyMDA3LCAyMDgsIGFsZyAyMiwgZXggMy0xM1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblxuZnVuY3Rpb24gaW52amRheShqZCwgYXNBcnJheSkge1xuICAvLyAtLS0tLS0tLS0tLS0tLS0gZmluZCB5ZWFyIGFuZCBkYXlzIG9mIHRoZSB5ZWFyIC1cbiAgdmFyIHRlbXAgPSBqZCAtIDI0MTUwMTkuNTtcbiAgdmFyIHR1ID0gdGVtcCAvIDM2NS4yNTtcbiAgdmFyIHllYXIgPSAxOTAwICsgTWF0aC5mbG9vcih0dSk7XG4gIHZhciBsZWFweXJzID0gTWF0aC5mbG9vcigoeWVhciAtIDE5MDEpICogMC4yNSk7IC8vIG9wdGlvbmFsIG51ZGdlIGJ5IDguNjR4MTAtNyBzZWMgdG8gZ2V0IGV2ZW4gb3V0cHV0c1xuXG4gIHZhciBkYXlzID0gdGVtcCAtICgoeWVhciAtIDE5MDApICogMzY1LjAgKyBsZWFweXJzKSArIDAuMDAwMDAwMDAwMDE7IC8vIC0tLS0tLS0tLS0tLSBjaGVjayBmb3IgY2FzZSBvZiBiZWdpbm5pbmcgb2YgYSB5ZWFyIC0tLS0tLS0tLS0tXG5cbiAgaWYgKGRheXMgPCAxLjApIHtcbiAgICB5ZWFyIC09IDE7XG4gICAgbGVhcHlycyA9IE1hdGguZmxvb3IoKHllYXIgLSAxOTAxKSAqIDAuMjUpO1xuICAgIGRheXMgPSB0ZW1wIC0gKCh5ZWFyIC0gMTkwMCkgKiAzNjUuMCArIGxlYXB5cnMpO1xuICB9IC8vIC0tLS0tLS0tLS0tLS0tLS0tIGZpbmQgcmVtYWluZyBkYXRhICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICB2YXIgbWRobXMgPSBkYXlzMm1kaG1zKHllYXIsIGRheXMpO1xuICB2YXIgbW9uID0gbWRobXMubW9uLFxuICAgICAgZGF5ID0gbWRobXMuZGF5LFxuICAgICAgaHIgPSBtZGhtcy5ocixcbiAgICAgIG1pbnV0ZSA9IG1kaG1zLm1pbnV0ZTtcbiAgdmFyIHNlYyA9IG1kaG1zLnNlYyAtIDAuMDAwMDAwODY0MDA7XG5cbiAgaWYgKGFzQXJyYXkpIHtcbiAgICByZXR1cm4gW3llYXIsIG1vbiwgZGF5LCBociwgbWludXRlLCBNYXRoLmZsb29yKHNlYyldO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKHllYXIsIG1vbiAtIDEsIGRheSwgaHIsIG1pbnV0ZSwgTWF0aC5mbG9vcihzZWMpKSk7XG59XG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VkdXJlIGRwcGVyXG4gKlxuICogIHRoaXMgcHJvY2VkdXJlIHByb3ZpZGVzIGRlZXAgc3BhY2UgbG9uZyBwZXJpb2QgcGVyaW9kaWMgY29udHJpYnV0aW9uc1xuICogICAgdG8gdGhlIG1lYW4gZWxlbWVudHMuICBieSBkZXNpZ24sIHRoZXNlIHBlcmlvZGljcyBhcmUgemVybyBhdCBlcG9jaC5cbiAqICAgIHRoaXMgdXNlZCB0byBiZSBkc2NvbSB3aGljaCBpbmNsdWRlZCBpbml0aWFsaXphdGlvbiwgYnV0IGl0J3MgcmVhbGx5IGFcbiAqICAgIHJlY3VycmluZyBmdW5jdGlvbi5cbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAyOCBqdW4gMjAwNVxuICpcbiAqICBpbnB1dHMgICAgICAgIDpcbiAqICAgIGUzICAgICAgICAgIC1cbiAqICAgIGVlMiAgICAgICAgIC1cbiAqICAgIHBlbyAgICAgICAgIC1cbiAqICAgIHBnaG8gICAgICAgIC1cbiAqICAgIHBobyAgICAgICAgIC1cbiAqICAgIHBpbmNvICAgICAgIC1cbiAqICAgIHBsbyAgICAgICAgIC1cbiAqICAgIHNlMiAsIHNlMyAsIHNnaDIsIHNnaDMsIHNnaDQsIHNoMiwgc2gzLCBzaTIsIHNpMywgc2wyLCBzbDMsIHNsNCAtXG4gKiAgICB0ICAgICAgICAgICAtXG4gKiAgICB4aDIsIHhoMywgeGkyLCB4aTMsIHhsMiwgeGwzLCB4bDQgLVxuICogICAgem1vbCAgICAgICAgLVxuICogICAgem1vcyAgICAgICAgLVxuICogICAgZXAgICAgICAgICAgLSBlY2NlbnRyaWNpdHkgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAgLSAxLjBcbiAqICAgIGluY2xvICAgICAgIC0gaW5jbGluYXRpb24gLSBuZWVkZWQgZm9yIGx5ZGRhbmUgbW9kaWZpY2F0aW9uXG4gKiAgICBub2RlcCAgICAgICAtIHJpZ2h0IGFzY2Vuc2lvbiBvZiBhc2NlbmRpbmcgbm9kZVxuICogICAgYXJncHAgICAgICAgLSBhcmd1bWVudCBvZiBwZXJpZ2VlXG4gKiAgICBtcCAgICAgICAgICAtIG1lYW4gYW5vbWFseVxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIGVwICAgICAgICAgIC0gZWNjZW50cmljaXR5ICAgICAgICAgICAgICAgICAgICAgICAgICAgMC4wIC0gMS4wXG4gKiAgICBpbmNscCAgICAgICAtIGluY2xpbmF0aW9uXG4gKiAgICBub2RlcCAgICAgICAgLSByaWdodCBhc2NlbnNpb24gb2YgYXNjZW5kaW5nIG5vZGVcbiAqICAgIGFyZ3BwICAgICAgIC0gYXJndW1lbnQgb2YgcGVyaWdlZVxuICogICAgbXAgICAgICAgICAgLSBtZWFuIGFub21hbHlcbiAqXG4gKiAgbG9jYWxzICAgICAgICA6XG4gKiAgICBhbGZkcCAgICAgICAtXG4gKiAgICBiZXRkcCAgICAgICAtXG4gKiAgICBjb3NpcCAgLCBzaW5pcCAgLCBjb3NvcCAgLCBzaW5vcCAgLFxuICogICAgZGFsZiAgICAgICAgLVxuICogICAgZGJldCAgICAgICAgLVxuICogICAgZGxzICAgICAgICAgLVxuICogICAgZjIsIGYzICAgICAgLVxuICogICAgcGUgICAgICAgICAgLVxuICogICAgcGdoICAgICAgICAgLVxuICogICAgcGggICAgICAgICAgLVxuICogICAgcGluYyAgICAgICAgLVxuICogICAgcGwgICAgICAgICAgLVxuICogICAgc2VsICAgLCBzZXMgICAsIHNnaGwgICwgc2docyAgLCBzaGwgICAsIHNocyAgICwgc2lsICAgLCBzaW56ZiAsIHNpcyAgICxcbiAqICAgIHNsbCAgICwgc2xzXG4gKiAgICB4bHMgICAgICAgICAtXG4gKiAgICB4bm9oICAgICAgICAtXG4gKiAgICB6ZiAgICAgICAgICAtXG4gKiAgICB6bSAgICAgICAgICAtXG4gKlxuICogIGNvdXBsaW5nICAgICAgOlxuICogICAgbm9uZS5cbiAqXG4gKiAgcmVmZXJlbmNlcyAgICA6XG4gKiAgICBob290cywgcm9laHJpY2gsIG5vcmFkIHNwYWNldHJhY2sgcmVwb3J0ICMzIDE5ODBcbiAqICAgIGhvb3RzLCBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAjNiAxOTg2XG4gKiAgICBob290cywgc2NodW1hY2hlciBhbmQgZ2xvdmVyIDIwMDRcbiAqICAgIHZhbGxhZG8sIGNyYXdmb3JkLCBodWpzYWssIGtlbHNvICAyMDA2XG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuZnVuY3Rpb24gZHBwZXIoc2F0cmVjLCBvcHRpb25zKSB7XG4gIHZhciBlMyA9IHNhdHJlYy5lMyxcbiAgICAgIGVlMiA9IHNhdHJlYy5lZTIsXG4gICAgICBwZW8gPSBzYXRyZWMucGVvLFxuICAgICAgcGdobyA9IHNhdHJlYy5wZ2hvLFxuICAgICAgcGhvID0gc2F0cmVjLnBobyxcbiAgICAgIHBpbmNvID0gc2F0cmVjLnBpbmNvLFxuICAgICAgcGxvID0gc2F0cmVjLnBsbyxcbiAgICAgIHNlMiA9IHNhdHJlYy5zZTIsXG4gICAgICBzZTMgPSBzYXRyZWMuc2UzLFxuICAgICAgc2doMiA9IHNhdHJlYy5zZ2gyLFxuICAgICAgc2doMyA9IHNhdHJlYy5zZ2gzLFxuICAgICAgc2doNCA9IHNhdHJlYy5zZ2g0LFxuICAgICAgc2gyID0gc2F0cmVjLnNoMixcbiAgICAgIHNoMyA9IHNhdHJlYy5zaDMsXG4gICAgICBzaTIgPSBzYXRyZWMuc2kyLFxuICAgICAgc2kzID0gc2F0cmVjLnNpMyxcbiAgICAgIHNsMiA9IHNhdHJlYy5zbDIsXG4gICAgICBzbDMgPSBzYXRyZWMuc2wzLFxuICAgICAgc2w0ID0gc2F0cmVjLnNsNCxcbiAgICAgIHQgPSBzYXRyZWMudCxcbiAgICAgIHhnaDIgPSBzYXRyZWMueGdoMixcbiAgICAgIHhnaDMgPSBzYXRyZWMueGdoMyxcbiAgICAgIHhnaDQgPSBzYXRyZWMueGdoNCxcbiAgICAgIHhoMiA9IHNhdHJlYy54aDIsXG4gICAgICB4aDMgPSBzYXRyZWMueGgzLFxuICAgICAgeGkyID0gc2F0cmVjLnhpMixcbiAgICAgIHhpMyA9IHNhdHJlYy54aTMsXG4gICAgICB4bDIgPSBzYXRyZWMueGwyLFxuICAgICAgeGwzID0gc2F0cmVjLnhsMyxcbiAgICAgIHhsNCA9IHNhdHJlYy54bDQsXG4gICAgICB6bW9sID0gc2F0cmVjLnptb2wsXG4gICAgICB6bW9zID0gc2F0cmVjLnptb3M7XG4gIHZhciBpbml0ID0gb3B0aW9ucy5pbml0LFxuICAgICAgb3BzbW9kZSA9IG9wdGlvbnMub3BzbW9kZTtcbiAgdmFyIGVwID0gb3B0aW9ucy5lcCxcbiAgICAgIGluY2xwID0gb3B0aW9ucy5pbmNscCxcbiAgICAgIG5vZGVwID0gb3B0aW9ucy5ub2RlcCxcbiAgICAgIGFyZ3BwID0gb3B0aW9ucy5hcmdwcCxcbiAgICAgIG1wID0gb3B0aW9ucy5tcDsgLy8gQ29weSBzYXRlbGxpdGUgYXR0cmlidXRlcyBpbnRvIGxvY2FsIHZhcmlhYmxlcyBmb3IgY29udmVuaWVuY2VcbiAgLy8gYW5kIHN5bW1ldHJ5IGluIHdyaXRpbmcgZm9ybXVsYWUuXG5cbiAgdmFyIGFsZmRwO1xuICB2YXIgYmV0ZHA7XG4gIHZhciBjb3NpcDtcbiAgdmFyIHNpbmlwO1xuICB2YXIgY29zb3A7XG4gIHZhciBzaW5vcDtcbiAgdmFyIGRhbGY7XG4gIHZhciBkYmV0O1xuICB2YXIgZGxzO1xuICB2YXIgZjI7XG4gIHZhciBmMztcbiAgdmFyIHBlO1xuICB2YXIgcGdoO1xuICB2YXIgcGg7XG4gIHZhciBwaW5jO1xuICB2YXIgcGw7XG4gIHZhciBzaW56ZjtcbiAgdmFyIHhscztcbiAgdmFyIHhub2g7XG4gIHZhciB6ZjtcbiAgdmFyIHptOyAvLyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBjb25zdGFudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgem5zID0gMS4xOTQ1OWUtNTtcbiAgdmFyIHplcyA9IDAuMDE2NzU7XG4gIHZhciB6bmwgPSAxLjU4MzUyMThlLTQ7XG4gIHZhciB6ZWwgPSAwLjA1NDkwOyAvLyAgLS0tLS0tLS0tLS0tLS0tIGNhbGN1bGF0ZSB0aW1lIHZhcnlpbmcgcGVyaW9kaWNzIC0tLS0tLS0tLS0tXG5cbiAgem0gPSB6bW9zICsgem5zICogdDsgLy8gYmUgc3VyZSB0aGF0IHRoZSBpbml0aWFsIGNhbGwgaGFzIHRpbWUgc2V0IHRvIHplcm9cblxuICBpZiAoaW5pdCA9PT0gJ3knKSB7XG4gICAgem0gPSB6bW9zO1xuICB9XG5cbiAgemYgPSB6bSArIDIuMCAqIHplcyAqIE1hdGguc2luKHptKTtcbiAgc2luemYgPSBNYXRoLnNpbih6Zik7XG4gIGYyID0gMC41ICogc2luemYgKiBzaW56ZiAtIDAuMjU7XG4gIGYzID0gLTAuNSAqIHNpbnpmICogTWF0aC5jb3MoemYpO1xuICB2YXIgc2VzID0gc2UyICogZjIgKyBzZTMgKiBmMztcbiAgdmFyIHNpcyA9IHNpMiAqIGYyICsgc2kzICogZjM7XG4gIHZhciBzbHMgPSBzbDIgKiBmMiArIHNsMyAqIGYzICsgc2w0ICogc2luemY7XG4gIHZhciBzZ2hzID0gc2doMiAqIGYyICsgc2doMyAqIGYzICsgc2doNCAqIHNpbnpmO1xuICB2YXIgc2hzID0gc2gyICogZjIgKyBzaDMgKiBmMztcbiAgem0gPSB6bW9sICsgem5sICogdDtcblxuICBpZiAoaW5pdCA9PT0gJ3knKSB7XG4gICAgem0gPSB6bW9sO1xuICB9XG5cbiAgemYgPSB6bSArIDIuMCAqIHplbCAqIE1hdGguc2luKHptKTtcbiAgc2luemYgPSBNYXRoLnNpbih6Zik7XG4gIGYyID0gMC41ICogc2luemYgKiBzaW56ZiAtIDAuMjU7XG4gIGYzID0gLTAuNSAqIHNpbnpmICogTWF0aC5jb3MoemYpO1xuICB2YXIgc2VsID0gZWUyICogZjIgKyBlMyAqIGYzO1xuICB2YXIgc2lsID0geGkyICogZjIgKyB4aTMgKiBmMztcbiAgdmFyIHNsbCA9IHhsMiAqIGYyICsgeGwzICogZjMgKyB4bDQgKiBzaW56ZjtcbiAgdmFyIHNnaGwgPSB4Z2gyICogZjIgKyB4Z2gzICogZjMgKyB4Z2g0ICogc2luemY7XG4gIHZhciBzaGxsID0geGgyICogZjIgKyB4aDMgKiBmMztcbiAgcGUgPSBzZXMgKyBzZWw7XG4gIHBpbmMgPSBzaXMgKyBzaWw7XG4gIHBsID0gc2xzICsgc2xsO1xuICBwZ2ggPSBzZ2hzICsgc2dobDtcbiAgcGggPSBzaHMgKyBzaGxsO1xuXG4gIGlmIChpbml0ID09PSAnbicpIHtcbiAgICBwZSAtPSBwZW87XG4gICAgcGluYyAtPSBwaW5jbztcbiAgICBwbCAtPSBwbG87XG4gICAgcGdoIC09IHBnaG87XG4gICAgcGggLT0gcGhvO1xuICAgIGluY2xwICs9IHBpbmM7XG4gICAgZXAgKz0gcGU7XG4gICAgc2luaXAgPSBNYXRoLnNpbihpbmNscCk7XG4gICAgY29zaXAgPSBNYXRoLmNvcyhpbmNscCk7XG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0gYXBwbHkgcGVyaW9kaWNzIGRpcmVjdGx5IC0tLS0tLS0tLS0tLSAqL1xuICAgIC8vIHNncDRmaXggZm9yIGx5ZGRhbmUgY2hvaWNlXG4gICAgLy8gc3RybjMgdXNlZCBvcmlnaW5hbCBpbmNsaW5hdGlvbiAtIHRoaXMgaXMgdGVjaG5pY2FsbHkgZmVhc2libGVcbiAgICAvLyBnc2ZjIHVzZWQgcGVydHVyYmVkIGluY2xpbmF0aW9uIC0gYWxzbyB0ZWNobmljYWxseSBmZWFzaWJsZVxuICAgIC8vIHByb2JhYmx5IGJlc3QgdG8gcmVhZGp1c3QgdGhlIDAuMiBsaW1pdCB2YWx1ZSBhbmQgbGltaXQgZGlzY29udGludWl0eVxuICAgIC8vIDAuMiByYWQgPSAxMS40NTkxNiBkZWdcbiAgICAvLyB1c2UgbmV4dCBsaW5lIGZvciBvcmlnaW5hbCBzdHJuMyBhcHByb2FjaCBhbmQgb3JpZ2luYWwgaW5jbGluYXRpb25cbiAgICAvLyBpZiAoaW5jbG8gPj0gMC4yKVxuICAgIC8vIHVzZSBuZXh0IGxpbmUgZm9yIGdzZmMgdmVyc2lvbiBhbmQgcGVydHVyYmVkIGluY2xpbmF0aW9uXG5cbiAgICBpZiAoaW5jbHAgPj0gMC4yKSB7XG4gICAgICBwaCAvPSBzaW5pcDtcbiAgICAgIHBnaCAtPSBjb3NpcCAqIHBoO1xuICAgICAgYXJncHAgKz0gcGdoO1xuICAgICAgbm9kZXAgKz0gcGg7XG4gICAgICBtcCArPSBwbDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gIC0tLS0gYXBwbHkgcGVyaW9kaWNzIHdpdGggbHlkZGFuZSBtb2RpZmljYXRpb24gLS0tLVxuICAgICAgc2lub3AgPSBNYXRoLnNpbihub2RlcCk7XG4gICAgICBjb3NvcCA9IE1hdGguY29zKG5vZGVwKTtcbiAgICAgIGFsZmRwID0gc2luaXAgKiBzaW5vcDtcbiAgICAgIGJldGRwID0gc2luaXAgKiBjb3NvcDtcbiAgICAgIGRhbGYgPSBwaCAqIGNvc29wICsgcGluYyAqIGNvc2lwICogc2lub3A7XG4gICAgICBkYmV0ID0gLXBoICogc2lub3AgKyBwaW5jICogY29zaXAgKiBjb3NvcDtcbiAgICAgIGFsZmRwICs9IGRhbGY7XG4gICAgICBiZXRkcCArPSBkYmV0O1xuICAgICAgbm9kZXAgJT0gdHdvUGk7IC8vICBzZ3A0Zml4IGZvciBhZnNwYyB3cml0dGVuIGludHJpbnNpYyBmdW5jdGlvbnNcbiAgICAgIC8vICBub2RlcCB1c2VkIHdpdGhvdXQgYSB0cmlnb25vbWV0cmljIGZ1bmN0aW9uIGFoZWFkXG5cbiAgICAgIGlmIChub2RlcCA8IDAuMCAmJiBvcHNtb2RlID09PSAnYScpIHtcbiAgICAgICAgbm9kZXAgKz0gdHdvUGk7XG4gICAgICB9XG5cbiAgICAgIHhscyA9IG1wICsgYXJncHAgKyBjb3NpcCAqIG5vZGVwO1xuICAgICAgZGxzID0gcGwgKyBwZ2ggLSBwaW5jICogbm9kZXAgKiBzaW5pcDtcbiAgICAgIHhscyArPSBkbHM7XG4gICAgICB4bm9oID0gbm9kZXA7XG4gICAgICBub2RlcCA9IE1hdGguYXRhbjIoYWxmZHAsIGJldGRwKTsgLy8gIHNncDRmaXggZm9yIGFmc3BjIHdyaXR0ZW4gaW50cmluc2ljIGZ1bmN0aW9uc1xuICAgICAgLy8gIG5vZGVwIHVzZWQgd2l0aG91dCBhIHRyaWdvbm9tZXRyaWMgZnVuY3Rpb24gYWhlYWRcblxuICAgICAgaWYgKG5vZGVwIDwgMC4wICYmIG9wc21vZGUgPT09ICdhJykge1xuICAgICAgICBub2RlcCArPSB0d29QaTtcbiAgICAgIH1cblxuICAgICAgaWYgKE1hdGguYWJzKHhub2ggLSBub2RlcCkgPiBwaSkge1xuICAgICAgICBpZiAobm9kZXAgPCB4bm9oKSB7XG4gICAgICAgICAgbm9kZXAgKz0gdHdvUGk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZXAgLT0gdHdvUGk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbXAgKz0gcGw7XG4gICAgICBhcmdwcCA9IHhscyAtIG1wIC0gY29zaXAgKiBub2RlcDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVwOiBlcCxcbiAgICBpbmNscDogaW5jbHAsXG4gICAgbm9kZXA6IG5vZGVwLFxuICAgIGFyZ3BwOiBhcmdwcCxcbiAgICBtcDogbXBcbiAgfTtcbn1cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZHVyZSBkc2NvbVxuICpcbiAqICB0aGlzIHByb2NlZHVyZSBwcm92aWRlcyBkZWVwIHNwYWNlIGNvbW1vbiBpdGVtcyB1c2VkIGJ5IGJvdGggdGhlIHNlY3VsYXJcbiAqICAgIGFuZCBwZXJpb2RpY3Mgc3Vicm91dGluZXMuICBpbnB1dCBpcyBwcm92aWRlZCBhcyBzaG93bi4gdGhpcyByb3V0aW5lXG4gKiAgICB1c2VkIHRvIGJlIGNhbGxlZCBkcHBlciwgYnV0IHRoZSBmdW5jdGlvbnMgaW5zaWRlIHdlcmVuJ3Qgd2VsbCBvcmdhbml6ZWQuXG4gKlxuICogIGF1dGhvciAgICAgICAgOiBkYXZpZCB2YWxsYWRvICAgICAgICAgICAgICAgICAgNzE5LTU3My0yNjAwICAgMjgganVuIDIwMDVcbiAqXG4gKiAgaW5wdXRzICAgICAgICA6XG4gKiAgICBlcG9jaCAgICAgICAtXG4gKiAgICBlcCAgICAgICAgICAtIGVjY2VudHJpY2l0eVxuICogICAgYXJncHAgICAgICAgLSBhcmd1bWVudCBvZiBwZXJpZ2VlXG4gKiAgICB0YyAgICAgICAgICAtXG4gKiAgICBpbmNscCAgICAgICAtIGluY2xpbmF0aW9uXG4gKiAgICBub2RlcCAgICAgICAtIHJpZ2h0IGFzY2Vuc2lvbiBvZiBhc2NlbmRpbmcgbm9kZVxuICogICAgbnAgICAgICAgICAgLSBtZWFuIG1vdGlvblxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIHNpbmltICAsIGNvc2ltICAsIHNpbm9tbSAsIGNvc29tbSAsIHNub2RtICAsIGNub2RtXG4gKiAgICBkYXkgICAgICAgICAtXG4gKiAgICBlMyAgICAgICAgICAtXG4gKiAgICBlZTIgICAgICAgICAtXG4gKiAgICBlbSAgICAgICAgICAtIGVjY2VudHJpY2l0eVxuICogICAgZW1zcSAgICAgICAgLSBlY2NlbnRyaWNpdHkgc3F1YXJlZFxuICogICAgZ2FtICAgICAgICAgLVxuICogICAgcGVvICAgICAgICAgLVxuICogICAgcGdobyAgICAgICAgLVxuICogICAgcGhvICAgICAgICAgLVxuICogICAgcGluY28gICAgICAgLVxuICogICAgcGxvICAgICAgICAgLVxuICogICAgcnRlbXNxICAgICAgLVxuICogICAgc2UyLCBzZTMgICAgICAgICAtXG4gKiAgICBzZ2gyLCBzZ2gzLCBzZ2g0ICAgICAgICAtXG4gKiAgICBzaDIsIHNoMywgc2kyLCBzaTMsIHNsMiwgc2wzLCBzbDQgICAgICAgICAtXG4gKiAgICBzMSwgczIsIHMzLCBzNCwgczUsIHM2LCBzNyAgICAgICAgICAtXG4gKiAgICBzczEsIHNzMiwgc3MzLCBzczQsIHNzNSwgc3M2LCBzczcsIHN6MSwgc3oyLCBzejMgICAgICAgICAtXG4gKiAgICBzejExLCBzejEyLCBzejEzLCBzejIxLCBzejIyLCBzejIzLCBzejMxLCBzejMyLCBzejMzICAgICAgICAtXG4gKiAgICB4Z2gyLCB4Z2gzLCB4Z2g0LCB4aDIsIHhoMywgeGkyLCB4aTMsIHhsMiwgeGwzLCB4bDQgICAgICAgICAtXG4gKiAgICBubSAgICAgICAgICAtIG1lYW4gbW90aW9uXG4gKiAgICB6MSwgejIsIHozLCB6MTEsIHoxMiwgejEzLCB6MjEsIHoyMiwgejIzLCB6MzEsIHozMiwgejMzICAgICAgICAgLVxuICogICAgem1vbCAgICAgICAgLVxuICogICAgem1vcyAgICAgICAgLVxuICpcbiAqICBsb2NhbHMgICAgICAgIDpcbiAqICAgIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3LCBhOCwgYTksIGExMCAgICAgICAgIC1cbiAqICAgIGJldGFzcSAgICAgIC1cbiAqICAgIGNjICAgICAgICAgIC1cbiAqICAgIGN0ZW0sIHN0ZW0gICAgICAgIC1cbiAqICAgIHgxLCB4MiwgeDMsIHg0LCB4NSwgeDYsIHg3LCB4OCAgICAgICAgICAtXG4gKiAgICB4bm9kY2UgICAgICAtXG4gKiAgICB4bm9pICAgICAgICAtXG4gKiAgICB6Y29zZyAgLCB6c2luZyAgLCB6Y29zZ2wgLCB6c2luZ2wgLCB6Y29zaCAgLCB6c2luaCAgLCB6Y29zaGwgLCB6c2luaGwgLFxuICogICAgemNvc2kgICwgenNpbmkgICwgemNvc2lsICwgenNpbmlsICxcbiAqICAgIHp4ICAgICAgICAgIC1cbiAqICAgIHp5ICAgICAgICAgIC1cbiAqXG4gKiAgY291cGxpbmcgICAgICA6XG4gKiAgICBub25lLlxuICpcbiAqICByZWZlcmVuY2VzICAgIDpcbiAqICAgIGhvb3RzLCByb2VocmljaCwgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzMgMTk4MFxuICogICAgaG9vdHMsIG5vcmFkIHNwYWNldHJhY2sgcmVwb3J0ICM2IDE5ODZcbiAqICAgIGhvb3RzLCBzY2h1bWFjaGVyIGFuZCBnbG92ZXIgMjAwNFxuICogICAgdmFsbGFkbywgY3Jhd2ZvcmQsIGh1anNhaywga2Vsc28gIDIwMDZcbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG5mdW5jdGlvbiBkc2NvbShvcHRpb25zKSB7XG4gIHZhciBlcG9jaCA9IG9wdGlvbnMuZXBvY2gsXG4gICAgICBlcCA9IG9wdGlvbnMuZXAsXG4gICAgICBhcmdwcCA9IG9wdGlvbnMuYXJncHAsXG4gICAgICB0YyA9IG9wdGlvbnMudGMsXG4gICAgICBpbmNscCA9IG9wdGlvbnMuaW5jbHAsXG4gICAgICBub2RlcCA9IG9wdGlvbnMubm9kZXAsXG4gICAgICBucCA9IG9wdGlvbnMubnA7XG4gIHZhciBhMTtcbiAgdmFyIGEyO1xuICB2YXIgYTM7XG4gIHZhciBhNDtcbiAgdmFyIGE1O1xuICB2YXIgYTY7XG4gIHZhciBhNztcbiAgdmFyIGE4O1xuICB2YXIgYTk7XG4gIHZhciBhMTA7XG4gIHZhciBjYztcbiAgdmFyIHgxO1xuICB2YXIgeDI7XG4gIHZhciB4MztcbiAgdmFyIHg0O1xuICB2YXIgeDU7XG4gIHZhciB4NjtcbiAgdmFyIHg3O1xuICB2YXIgeDg7XG4gIHZhciB6Y29zZztcbiAgdmFyIHpzaW5nO1xuICB2YXIgemNvc2g7XG4gIHZhciB6c2luaDtcbiAgdmFyIHpjb3NpO1xuICB2YXIgenNpbmk7XG4gIHZhciBzczE7XG4gIHZhciBzczI7XG4gIHZhciBzczM7XG4gIHZhciBzczQ7XG4gIHZhciBzczU7XG4gIHZhciBzczY7XG4gIHZhciBzczc7XG4gIHZhciBzejE7XG4gIHZhciBzejI7XG4gIHZhciBzejM7XG4gIHZhciBzejExO1xuICB2YXIgc3oxMjtcbiAgdmFyIHN6MTM7XG4gIHZhciBzejIxO1xuICB2YXIgc3oyMjtcbiAgdmFyIHN6MjM7XG4gIHZhciBzejMxO1xuICB2YXIgc3ozMjtcbiAgdmFyIHN6MzM7XG4gIHZhciBzMTtcbiAgdmFyIHMyO1xuICB2YXIgczM7XG4gIHZhciBzNDtcbiAgdmFyIHM1O1xuICB2YXIgczY7XG4gIHZhciBzNztcbiAgdmFyIHoxO1xuICB2YXIgejI7XG4gIHZhciB6MztcbiAgdmFyIHoxMTtcbiAgdmFyIHoxMjtcbiAgdmFyIHoxMztcbiAgdmFyIHoyMTtcbiAgdmFyIHoyMjtcbiAgdmFyIHoyMztcbiAgdmFyIHozMTtcbiAgdmFyIHozMjtcbiAgdmFyIHozMzsgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gY29uc3RhbnRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgemVzID0gMC4wMTY3NTtcbiAgdmFyIHplbCA9IDAuMDU0OTA7XG4gIHZhciBjMXNzID0gMi45ODY0Nzk3ZS02O1xuICB2YXIgYzFsID0gNC43OTY4MDY1ZS03O1xuICB2YXIgenNpbmlzID0gMC4zOTc4NTQxNjtcbiAgdmFyIHpjb3NpcyA9IDAuOTE3NDQ4Njc7XG4gIHZhciB6Y29zZ3MgPSAwLjE5NDU5MDU7XG4gIHZhciB6c2luZ3MgPSAtMC45ODA4ODQ1ODsgLy8gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLSBsb2NhbCB2YXJpYWJsZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIG5tID0gbnA7XG4gIHZhciBlbSA9IGVwO1xuICB2YXIgc25vZG0gPSBNYXRoLnNpbihub2RlcCk7XG4gIHZhciBjbm9kbSA9IE1hdGguY29zKG5vZGVwKTtcbiAgdmFyIHNpbm9tbSA9IE1hdGguc2luKGFyZ3BwKTtcbiAgdmFyIGNvc29tbSA9IE1hdGguY29zKGFyZ3BwKTtcbiAgdmFyIHNpbmltID0gTWF0aC5zaW4oaW5jbHApO1xuICB2YXIgY29zaW0gPSBNYXRoLmNvcyhpbmNscCk7XG4gIHZhciBlbXNxID0gZW0gKiBlbTtcbiAgdmFyIGJldGFzcSA9IDEuMCAtIGVtc3E7XG4gIHZhciBydGVtc3EgPSBNYXRoLnNxcnQoYmV0YXNxKTsgLy8gIC0tLS0tLS0tLS0tLS0tLS0tIGluaXRpYWxpemUgbHVuYXIgc29sYXIgdGVybXMgLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIHBlbyA9IDAuMDtcbiAgdmFyIHBpbmNvID0gMC4wO1xuICB2YXIgcGxvID0gMC4wO1xuICB2YXIgcGdobyA9IDAuMDtcbiAgdmFyIHBobyA9IDAuMDtcbiAgdmFyIGRheSA9IGVwb2NoICsgMTgyNjEuNSArIHRjIC8gMTQ0MC4wO1xuICB2YXIgeG5vZGNlID0gKDQuNTIzNjAyMCAtIDkuMjQyMjAyOWUtNCAqIGRheSkgJSB0d29QaTtcbiAgdmFyIHN0ZW0gPSBNYXRoLnNpbih4bm9kY2UpO1xuICB2YXIgY3RlbSA9IE1hdGguY29zKHhub2RjZSk7XG4gIHZhciB6Y29zaWwgPSAwLjkxMzc1MTY0IC0gMC4wMzU2ODA5NiAqIGN0ZW07XG4gIHZhciB6c2luaWwgPSBNYXRoLnNxcnQoMS4wIC0gemNvc2lsICogemNvc2lsKTtcbiAgdmFyIHpzaW5obCA9IDAuMDg5NjgzNTExICogc3RlbSAvIHpzaW5pbDtcbiAgdmFyIHpjb3NobCA9IE1hdGguc3FydCgxLjAgLSB6c2luaGwgKiB6c2luaGwpO1xuICB2YXIgZ2FtID0gNS44MzUxNTE0ICsgMC4wMDE5NDQzNjgwICogZGF5O1xuICB2YXIgenggPSAwLjM5Nzg1NDE2ICogc3RlbSAvIHpzaW5pbDtcbiAgdmFyIHp5ID0gemNvc2hsICogY3RlbSArIDAuOTE3NDQ4NjcgKiB6c2luaGwgKiBzdGVtO1xuICB6eCA9IE1hdGguYXRhbjIoengsIHp5KTtcbiAgenggKz0gZ2FtIC0geG5vZGNlO1xuICB2YXIgemNvc2dsID0gTWF0aC5jb3MoengpO1xuICB2YXIgenNpbmdsID0gTWF0aC5zaW4oengpOyAvLyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkbyBzb2xhciB0ZXJtcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB6Y29zZyA9IHpjb3NncztcbiAgenNpbmcgPSB6c2luZ3M7XG4gIHpjb3NpID0gemNvc2lzO1xuICB6c2luaSA9IHpzaW5pcztcbiAgemNvc2ggPSBjbm9kbTtcbiAgenNpbmggPSBzbm9kbTtcbiAgY2MgPSBjMXNzO1xuICB2YXIgeG5vaSA9IDEuMCAvIG5tO1xuICB2YXIgbHNmbGcgPSAwO1xuXG4gIHdoaWxlIChsc2ZsZyA8IDIpIHtcbiAgICBsc2ZsZyArPSAxO1xuICAgIGExID0gemNvc2cgKiB6Y29zaCArIHpzaW5nICogemNvc2kgKiB6c2luaDtcbiAgICBhMyA9IC16c2luZyAqIHpjb3NoICsgemNvc2cgKiB6Y29zaSAqIHpzaW5oO1xuICAgIGE3ID0gLXpjb3NnICogenNpbmggKyB6c2luZyAqIHpjb3NpICogemNvc2g7XG4gICAgYTggPSB6c2luZyAqIHpzaW5pO1xuICAgIGE5ID0genNpbmcgKiB6c2luaCArIHpjb3NnICogemNvc2kgKiB6Y29zaDtcbiAgICBhMTAgPSB6Y29zZyAqIHpzaW5pO1xuICAgIGEyID0gY29zaW0gKiBhNyArIHNpbmltICogYTg7XG4gICAgYTQgPSBjb3NpbSAqIGE5ICsgc2luaW0gKiBhMTA7XG4gICAgYTUgPSAtc2luaW0gKiBhNyArIGNvc2ltICogYTg7XG4gICAgYTYgPSAtc2luaW0gKiBhOSArIGNvc2ltICogYTEwO1xuICAgIHgxID0gYTEgKiBjb3NvbW0gKyBhMiAqIHNpbm9tbTtcbiAgICB4MiA9IGEzICogY29zb21tICsgYTQgKiBzaW5vbW07XG4gICAgeDMgPSAtYTEgKiBzaW5vbW0gKyBhMiAqIGNvc29tbTtcbiAgICB4NCA9IC1hMyAqIHNpbm9tbSArIGE0ICogY29zb21tO1xuICAgIHg1ID0gYTUgKiBzaW5vbW07XG4gICAgeDYgPSBhNiAqIHNpbm9tbTtcbiAgICB4NyA9IGE1ICogY29zb21tO1xuICAgIHg4ID0gYTYgKiBjb3NvbW07XG4gICAgejMxID0gMTIuMCAqIHgxICogeDEgLSAzLjAgKiB4MyAqIHgzO1xuICAgIHozMiA9IDI0LjAgKiB4MSAqIHgyIC0gNi4wICogeDMgKiB4NDtcbiAgICB6MzMgPSAxMi4wICogeDIgKiB4MiAtIDMuMCAqIHg0ICogeDQ7XG4gICAgejEgPSAzLjAgKiAoYTEgKiBhMSArIGEyICogYTIpICsgejMxICogZW1zcTtcbiAgICB6MiA9IDYuMCAqIChhMSAqIGEzICsgYTIgKiBhNCkgKyB6MzIgKiBlbXNxO1xuICAgIHozID0gMy4wICogKGEzICogYTMgKyBhNCAqIGE0KSArIHozMyAqIGVtc3E7XG4gICAgejExID0gLTYuMCAqIGExICogYTUgKyBlbXNxICogKC0yNC4wICogeDEgKiB4NyAtIDYuMCAqIHgzICogeDUpO1xuICAgIHoxMiA9IC02LjAgKiAoYTEgKiBhNiArIGEzICogYTUpICsgZW1zcSAqICgtMjQuMCAqICh4MiAqIHg3ICsgeDEgKiB4OCkgKyAtNi4wICogKHgzICogeDYgKyB4NCAqIHg1KSk7XG4gICAgejEzID0gLTYuMCAqIGEzICogYTYgKyBlbXNxICogKC0yNC4wICogeDIgKiB4OCAtIDYuMCAqIHg0ICogeDYpO1xuICAgIHoyMSA9IDYuMCAqIGEyICogYTUgKyBlbXNxICogKDI0LjAgKiB4MSAqIHg1IC0gNi4wICogeDMgKiB4Nyk7XG4gICAgejIyID0gNi4wICogKGE0ICogYTUgKyBhMiAqIGE2KSArIGVtc3EgKiAoMjQuMCAqICh4MiAqIHg1ICsgeDEgKiB4NikgLSA2LjAgKiAoeDQgKiB4NyArIHgzICogeDgpKTtcbiAgICB6MjMgPSA2LjAgKiBhNCAqIGE2ICsgZW1zcSAqICgyNC4wICogeDIgKiB4NiAtIDYuMCAqIHg0ICogeDgpO1xuICAgIHoxID0gejEgKyB6MSArIGJldGFzcSAqIHozMTtcbiAgICB6MiA9IHoyICsgejIgKyBiZXRhc3EgKiB6MzI7XG4gICAgejMgPSB6MyArIHozICsgYmV0YXNxICogejMzO1xuICAgIHMzID0gY2MgKiB4bm9pO1xuICAgIHMyID0gLTAuNSAqIHMzIC8gcnRlbXNxO1xuICAgIHM0ID0gczMgKiBydGVtc3E7XG4gICAgczEgPSAtMTUuMCAqIGVtICogczQ7XG4gICAgczUgPSB4MSAqIHgzICsgeDIgKiB4NDtcbiAgICBzNiA9IHgyICogeDMgKyB4MSAqIHg0O1xuICAgIHM3ID0geDIgKiB4NCAtIHgxICogeDM7IC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkbyBsdW5hciB0ZXJtcyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBpZiAobHNmbGcgPT09IDEpIHtcbiAgICAgIHNzMSA9IHMxO1xuICAgICAgc3MyID0gczI7XG4gICAgICBzczMgPSBzMztcbiAgICAgIHNzNCA9IHM0O1xuICAgICAgc3M1ID0gczU7XG4gICAgICBzczYgPSBzNjtcbiAgICAgIHNzNyA9IHM3O1xuICAgICAgc3oxID0gejE7XG4gICAgICBzejIgPSB6MjtcbiAgICAgIHN6MyA9IHozO1xuICAgICAgc3oxMSA9IHoxMTtcbiAgICAgIHN6MTIgPSB6MTI7XG4gICAgICBzejEzID0gejEzO1xuICAgICAgc3oyMSA9IHoyMTtcbiAgICAgIHN6MjIgPSB6MjI7XG4gICAgICBzejIzID0gejIzO1xuICAgICAgc3ozMSA9IHozMTtcbiAgICAgIHN6MzIgPSB6MzI7XG4gICAgICBzejMzID0gejMzO1xuICAgICAgemNvc2cgPSB6Y29zZ2w7XG4gICAgICB6c2luZyA9IHpzaW5nbDtcbiAgICAgIHpjb3NpID0gemNvc2lsO1xuICAgICAgenNpbmkgPSB6c2luaWw7XG4gICAgICB6Y29zaCA9IHpjb3NobCAqIGNub2RtICsgenNpbmhsICogc25vZG07XG4gICAgICB6c2luaCA9IHNub2RtICogemNvc2hsIC0gY25vZG0gKiB6c2luaGw7XG4gICAgICBjYyA9IGMxbDtcbiAgICB9XG4gIH1cblxuICB2YXIgem1vbCA9ICg0LjcxOTk2NzIgKyAoMC4yMjk5NzE1MCAqIGRheSAtIGdhbSkpICUgdHdvUGk7XG4gIHZhciB6bW9zID0gKDYuMjU2NTgzNyArIDAuMDE3MjAxOTc3ICogZGF5KSAlIHR3b1BpOyAvLyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRvIHNvbGFyIHRlcm1zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgc2UyID0gMi4wICogc3MxICogc3M2O1xuICB2YXIgc2UzID0gMi4wICogc3MxICogc3M3O1xuICB2YXIgc2kyID0gMi4wICogc3MyICogc3oxMjtcbiAgdmFyIHNpMyA9IDIuMCAqIHNzMiAqIChzejEzIC0gc3oxMSk7XG4gIHZhciBzbDIgPSAtMi4wICogc3MzICogc3oyO1xuICB2YXIgc2wzID0gLTIuMCAqIHNzMyAqIChzejMgLSBzejEpO1xuICB2YXIgc2w0ID0gLTIuMCAqIHNzMyAqICgtMjEuMCAtIDkuMCAqIGVtc3EpICogemVzO1xuICB2YXIgc2doMiA9IDIuMCAqIHNzNCAqIHN6MzI7XG4gIHZhciBzZ2gzID0gMi4wICogc3M0ICogKHN6MzMgLSBzejMxKTtcbiAgdmFyIHNnaDQgPSAtMTguMCAqIHNzNCAqIHplcztcbiAgdmFyIHNoMiA9IC0yLjAgKiBzczIgKiBzejIyO1xuICB2YXIgc2gzID0gLTIuMCAqIHNzMiAqIChzejIzIC0gc3oyMSk7IC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZG8gbHVuYXIgdGVybXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBlZTIgPSAyLjAgKiBzMSAqIHM2O1xuICB2YXIgZTMgPSAyLjAgKiBzMSAqIHM3O1xuICB2YXIgeGkyID0gMi4wICogczIgKiB6MTI7XG4gIHZhciB4aTMgPSAyLjAgKiBzMiAqICh6MTMgLSB6MTEpO1xuICB2YXIgeGwyID0gLTIuMCAqIHMzICogejI7XG4gIHZhciB4bDMgPSAtMi4wICogczMgKiAoejMgLSB6MSk7XG4gIHZhciB4bDQgPSAtMi4wICogczMgKiAoLTIxLjAgLSA5LjAgKiBlbXNxKSAqIHplbDtcbiAgdmFyIHhnaDIgPSAyLjAgKiBzNCAqIHozMjtcbiAgdmFyIHhnaDMgPSAyLjAgKiBzNCAqICh6MzMgLSB6MzEpO1xuICB2YXIgeGdoNCA9IC0xOC4wICogczQgKiB6ZWw7XG4gIHZhciB4aDIgPSAtMi4wICogczIgKiB6MjI7XG4gIHZhciB4aDMgPSAtMi4wICogczIgKiAoejIzIC0gejIxKTtcbiAgcmV0dXJuIHtcbiAgICBzbm9kbTogc25vZG0sXG4gICAgY25vZG06IGNub2RtLFxuICAgIHNpbmltOiBzaW5pbSxcbiAgICBjb3NpbTogY29zaW0sXG4gICAgc2lub21tOiBzaW5vbW0sXG4gICAgY29zb21tOiBjb3NvbW0sXG4gICAgZGF5OiBkYXksXG4gICAgZTM6IGUzLFxuICAgIGVlMjogZWUyLFxuICAgIGVtOiBlbSxcbiAgICBlbXNxOiBlbXNxLFxuICAgIGdhbTogZ2FtLFxuICAgIHBlbzogcGVvLFxuICAgIHBnaG86IHBnaG8sXG4gICAgcGhvOiBwaG8sXG4gICAgcGluY286IHBpbmNvLFxuICAgIHBsbzogcGxvLFxuICAgIHJ0ZW1zcTogcnRlbXNxLFxuICAgIHNlMjogc2UyLFxuICAgIHNlMzogc2UzLFxuICAgIHNnaDI6IHNnaDIsXG4gICAgc2doMzogc2doMyxcbiAgICBzZ2g0OiBzZ2g0LFxuICAgIHNoMjogc2gyLFxuICAgIHNoMzogc2gzLFxuICAgIHNpMjogc2kyLFxuICAgIHNpMzogc2kzLFxuICAgIHNsMjogc2wyLFxuICAgIHNsMzogc2wzLFxuICAgIHNsNDogc2w0LFxuICAgIHMxOiBzMSxcbiAgICBzMjogczIsXG4gICAgczM6IHMzLFxuICAgIHM0OiBzNCxcbiAgICBzNTogczUsXG4gICAgczY6IHM2LFxuICAgIHM3OiBzNyxcbiAgICBzczE6IHNzMSxcbiAgICBzczI6IHNzMixcbiAgICBzczM6IHNzMyxcbiAgICBzczQ6IHNzNCxcbiAgICBzczU6IHNzNSxcbiAgICBzczY6IHNzNixcbiAgICBzczc6IHNzNyxcbiAgICBzejE6IHN6MSxcbiAgICBzejI6IHN6MixcbiAgICBzejM6IHN6MyxcbiAgICBzejExOiBzejExLFxuICAgIHN6MTI6IHN6MTIsXG4gICAgc3oxMzogc3oxMyxcbiAgICBzejIxOiBzejIxLFxuICAgIHN6MjI6IHN6MjIsXG4gICAgc3oyMzogc3oyMyxcbiAgICBzejMxOiBzejMxLFxuICAgIHN6MzI6IHN6MzIsXG4gICAgc3ozMzogc3ozMyxcbiAgICB4Z2gyOiB4Z2gyLFxuICAgIHhnaDM6IHhnaDMsXG4gICAgeGdoNDogeGdoNCxcbiAgICB4aDI6IHhoMixcbiAgICB4aDM6IHhoMyxcbiAgICB4aTI6IHhpMixcbiAgICB4aTM6IHhpMyxcbiAgICB4bDI6IHhsMixcbiAgICB4bDM6IHhsMyxcbiAgICB4bDQ6IHhsNCxcbiAgICBubTogbm0sXG4gICAgejE6IHoxLFxuICAgIHoyOiB6MixcbiAgICB6MzogejMsXG4gICAgejExOiB6MTEsXG4gICAgejEyOiB6MTIsXG4gICAgejEzOiB6MTMsXG4gICAgejIxOiB6MjEsXG4gICAgejIyOiB6MjIsXG4gICAgejIzOiB6MjMsXG4gICAgejMxOiB6MzEsXG4gICAgejMyOiB6MzIsXG4gICAgejMzOiB6MzMsXG4gICAgem1vbDogem1vbCxcbiAgICB6bW9zOiB6bW9zXG4gIH07XG59XG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWR1cmUgZHNpbml0XG4gKlxuICogIHRoaXMgcHJvY2VkdXJlIHByb3ZpZGVzIGRlZXAgc3BhY2UgY29udHJpYnV0aW9ucyB0byBtZWFuIG1vdGlvbiBkb3QgZHVlXG4gKiAgICB0byBnZW9wb3RlbnRpYWwgcmVzb25hbmNlIHdpdGggaGFsZiBkYXkgYW5kIG9uZSBkYXkgb3JiaXRzLlxuICpcbiAqICBhdXRob3IgICAgICAgIDogZGF2aWQgdmFsbGFkbyAgICAgICAgICAgICAgICAgIDcxOS01NzMtMjYwMCAgIDI4IGp1biAyMDA1XG4gKlxuICogIGlucHV0cyAgICAgICAgOlxuICogICAgY29zaW0sIHNpbmltLVxuICogICAgZW1zcSAgICAgICAgLSBlY2NlbnRyaWNpdHkgc3F1YXJlZFxuICogICAgYXJncG8gICAgICAgLSBhcmd1bWVudCBvZiBwZXJpZ2VlXG4gKiAgICBzMSwgczIsIHMzLCBzNCwgczUgICAgICAtXG4gKiAgICBzczEsIHNzMiwgc3MzLCBzczQsIHNzNSAtXG4gKiAgICBzejEsIHN6Mywgc3oxMSwgc3oxMywgc3oyMSwgc3oyMywgc3ozMSwgc3ozMyAtXG4gKiAgICB0ICAgICAgICAgICAtIHRpbWVcbiAqICAgIHRjICAgICAgICAgIC1cbiAqICAgIGdzdG8gICAgICAgIC0gZ3JlZW53aWNoIHNpZGVyZWFsIHRpbWUgICAgICAgICAgICAgICAgICAgcmFkXG4gKiAgICBtbyAgICAgICAgICAtIG1lYW4gYW5vbWFseVxuICogICAgbWRvdCAgICAgICAgLSBtZWFuIGFub21hbHkgZG90IChyYXRlKVxuICogICAgbm8gICAgICAgICAgLSBtZWFuIG1vdGlvblxuICogICAgbm9kZW8gICAgICAgLSByaWdodCBhc2NlbnNpb24gb2YgYXNjZW5kaW5nIG5vZGVcbiAqICAgIG5vZGVkb3QgICAgIC0gcmlnaHQgYXNjZW5zaW9uIG9mIGFzY2VuZGluZyBub2RlIGRvdCAocmF0ZSlcbiAqICAgIHhwaWRvdCAgICAgIC1cbiAqICAgIHoxLCB6MywgejExLCB6MTMsIHoyMSwgejIzLCB6MzEsIHozMyAtXG4gKiAgICBlY2NtICAgICAgICAtIGVjY2VudHJpY2l0eVxuICogICAgYXJncG0gICAgICAgLSBhcmd1bWVudCBvZiBwZXJpZ2VlXG4gKiAgICBpbmNsbSAgICAgICAtIGluY2xpbmF0aW9uXG4gKiAgICBtbSAgICAgICAgICAtIG1lYW4gYW5vbWFseVxuICogICAgeG4gICAgICAgICAgLSBtZWFuIG1vdGlvblxuICogICAgbm9kZW0gICAgICAgLSByaWdodCBhc2NlbnNpb24gb2YgYXNjZW5kaW5nIG5vZGVcbiAqXG4gKiAgb3V0cHV0cyAgICAgICA6XG4gKiAgICBlbSAgICAgICAgICAtIGVjY2VudHJpY2l0eVxuICogICAgYXJncG0gICAgICAgLSBhcmd1bWVudCBvZiBwZXJpZ2VlXG4gKiAgICBpbmNsbSAgICAgICAtIGluY2xpbmF0aW9uXG4gKiAgICBtbSAgICAgICAgICAtIG1lYW4gYW5vbWFseVxuICogICAgbm0gICAgICAgICAgLSBtZWFuIG1vdGlvblxuICogICAgbm9kZW0gICAgICAgLSByaWdodCBhc2NlbnNpb24gb2YgYXNjZW5kaW5nIG5vZGVcbiAqICAgIGlyZXogICAgICAgIC0gZmxhZyBmb3IgcmVzb25hbmNlICAgICAgICAgICAwLW5vbmUsIDEtb25lIGRheSwgMi1oYWxmIGRheVxuICogICAgYXRpbWUgICAgICAgLVxuICogICAgZDIyMDEsIGQyMjExLCBkMzIxMCwgZDMyMjIsIGQ0NDEwLCBkNDQyMiwgZDUyMjAsIGQ1MjMyLCBkNTQyMSwgZDU0MzMgICAgLVxuICogICAgZGVkdCAgICAgICAgLVxuICogICAgZGlkdCAgICAgICAgLVxuICogICAgZG1kdCAgICAgICAgLVxuICogICAgZG5kdCAgICAgICAgLVxuICogICAgZG5vZHQgICAgICAgLVxuICogICAgZG9tZHQgICAgICAgLVxuICogICAgZGVsMSwgZGVsMiwgZGVsMyAgICAgICAgLVxuICogICAgc2VzICAsIHNnaGwgLCBzZ2hzICwgc2dzICAsIHNobCAgLCBzaHMgICwgc2lzICAsIHNsc1xuICogICAgdGhldGEgICAgICAgLVxuICogICAgeGZhY3QgICAgICAgLVxuICogICAgeGxhbW8gICAgICAgLVxuICogICAgeGxpICAgICAgICAgLVxuICogICAgeG5pXG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgYWludjIgICAgICAgLVxuICogICAgYW9udiAgICAgICAgLVxuICogICAgY29zaXNxICAgICAgLVxuICogICAgZW9jICAgICAgICAgLVxuICogICAgZjIyMCwgZjIyMSwgZjMxMSwgZjMyMSwgZjMyMiwgZjMzMCwgZjQ0MSwgZjQ0MiwgZjUyMiwgZjUyMywgZjU0MiwgZjU0MyAgLVxuICogICAgZzIwMCwgZzIwMSwgZzIxMSwgZzMwMCwgZzMxMCwgZzMyMiwgZzQxMCwgZzQyMiwgZzUyMCwgZzUyMSwgZzUzMiwgZzUzMyAgLVxuICogICAgc2luaTIgICAgICAgLVxuICogICAgdGVtcCAgICAgICAgLVxuICogICAgdGVtcDEgICAgICAgLVxuICogICAgdGhldGEgICAgICAgLVxuICogICAgeG5vMiAgICAgICAgLVxuICpcbiAqICBjb3VwbGluZyAgICAgIDpcbiAqICAgIGdldGdyYXZjb25zdFxuICpcbiAqICByZWZlcmVuY2VzICAgIDpcbiAqICAgIGhvb3RzLCByb2VocmljaCwgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzMgMTk4MFxuICogICAgaG9vdHMsIG5vcmFkIHNwYWNldHJhY2sgcmVwb3J0ICM2IDE5ODZcbiAqICAgIGhvb3RzLCBzY2h1bWFjaGVyIGFuZCBnbG92ZXIgMjAwNFxuICogICAgdmFsbGFkbywgY3Jhd2ZvcmQsIGh1anNhaywga2Vsc28gIDIwMDZcbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG5mdW5jdGlvbiBkc2luaXQob3B0aW9ucykge1xuICB2YXIgY29zaW0gPSBvcHRpb25zLmNvc2ltLFxuICAgICAgYXJncG8gPSBvcHRpb25zLmFyZ3BvLFxuICAgICAgczEgPSBvcHRpb25zLnMxLFxuICAgICAgczIgPSBvcHRpb25zLnMyLFxuICAgICAgczMgPSBvcHRpb25zLnMzLFxuICAgICAgczQgPSBvcHRpb25zLnM0LFxuICAgICAgczUgPSBvcHRpb25zLnM1LFxuICAgICAgc2luaW0gPSBvcHRpb25zLnNpbmltLFxuICAgICAgc3MxID0gb3B0aW9ucy5zczEsXG4gICAgICBzczIgPSBvcHRpb25zLnNzMixcbiAgICAgIHNzMyA9IG9wdGlvbnMuc3MzLFxuICAgICAgc3M0ID0gb3B0aW9ucy5zczQsXG4gICAgICBzczUgPSBvcHRpb25zLnNzNSxcbiAgICAgIHN6MSA9IG9wdGlvbnMuc3oxLFxuICAgICAgc3ozID0gb3B0aW9ucy5zejMsXG4gICAgICBzejExID0gb3B0aW9ucy5zejExLFxuICAgICAgc3oxMyA9IG9wdGlvbnMuc3oxMyxcbiAgICAgIHN6MjEgPSBvcHRpb25zLnN6MjEsXG4gICAgICBzejIzID0gb3B0aW9ucy5zejIzLFxuICAgICAgc3ozMSA9IG9wdGlvbnMuc3ozMSxcbiAgICAgIHN6MzMgPSBvcHRpb25zLnN6MzMsXG4gICAgICB0ID0gb3B0aW9ucy50LFxuICAgICAgdGMgPSBvcHRpb25zLnRjLFxuICAgICAgZ3N0byA9IG9wdGlvbnMuZ3N0byxcbiAgICAgIG1vID0gb3B0aW9ucy5tbyxcbiAgICAgIG1kb3QgPSBvcHRpb25zLm1kb3QsXG4gICAgICBubyA9IG9wdGlvbnMubm8sXG4gICAgICBub2RlbyA9IG9wdGlvbnMubm9kZW8sXG4gICAgICBub2RlZG90ID0gb3B0aW9ucy5ub2RlZG90LFxuICAgICAgeHBpZG90ID0gb3B0aW9ucy54cGlkb3QsXG4gICAgICB6MSA9IG9wdGlvbnMuejEsXG4gICAgICB6MyA9IG9wdGlvbnMuejMsXG4gICAgICB6MTEgPSBvcHRpb25zLnoxMSxcbiAgICAgIHoxMyA9IG9wdGlvbnMuejEzLFxuICAgICAgejIxID0gb3B0aW9ucy56MjEsXG4gICAgICB6MjMgPSBvcHRpb25zLnoyMyxcbiAgICAgIHozMSA9IG9wdGlvbnMuejMxLFxuICAgICAgejMzID0gb3B0aW9ucy56MzMsXG4gICAgICBlY2NvID0gb3B0aW9ucy5lY2NvLFxuICAgICAgZWNjc3EgPSBvcHRpb25zLmVjY3NxO1xuICB2YXIgZW1zcSA9IG9wdGlvbnMuZW1zcSxcbiAgICAgIGVtID0gb3B0aW9ucy5lbSxcbiAgICAgIGFyZ3BtID0gb3B0aW9ucy5hcmdwbSxcbiAgICAgIGluY2xtID0gb3B0aW9ucy5pbmNsbSxcbiAgICAgIG1tID0gb3B0aW9ucy5tbSxcbiAgICAgIG5tID0gb3B0aW9ucy5ubSxcbiAgICAgIG5vZGVtID0gb3B0aW9ucy5ub2RlbSxcbiAgICAgIGlyZXogPSBvcHRpb25zLmlyZXosXG4gICAgICBhdGltZSA9IG9wdGlvbnMuYXRpbWUsXG4gICAgICBkMjIwMSA9IG9wdGlvbnMuZDIyMDEsXG4gICAgICBkMjIxMSA9IG9wdGlvbnMuZDIyMTEsXG4gICAgICBkMzIxMCA9IG9wdGlvbnMuZDMyMTAsXG4gICAgICBkMzIyMiA9IG9wdGlvbnMuZDMyMjIsXG4gICAgICBkNDQxMCA9IG9wdGlvbnMuZDQ0MTAsXG4gICAgICBkNDQyMiA9IG9wdGlvbnMuZDQ0MjIsXG4gICAgICBkNTIyMCA9IG9wdGlvbnMuZDUyMjAsXG4gICAgICBkNTIzMiA9IG9wdGlvbnMuZDUyMzIsXG4gICAgICBkNTQyMSA9IG9wdGlvbnMuZDU0MjEsXG4gICAgICBkNTQzMyA9IG9wdGlvbnMuZDU0MzMsXG4gICAgICBkZWR0ID0gb3B0aW9ucy5kZWR0LFxuICAgICAgZGlkdCA9IG9wdGlvbnMuZGlkdCxcbiAgICAgIGRtZHQgPSBvcHRpb25zLmRtZHQsXG4gICAgICBkbm9kdCA9IG9wdGlvbnMuZG5vZHQsXG4gICAgICBkb21kdCA9IG9wdGlvbnMuZG9tZHQsXG4gICAgICBkZWwxID0gb3B0aW9ucy5kZWwxLFxuICAgICAgZGVsMiA9IG9wdGlvbnMuZGVsMixcbiAgICAgIGRlbDMgPSBvcHRpb25zLmRlbDMsXG4gICAgICB4ZmFjdCA9IG9wdGlvbnMueGZhY3QsXG4gICAgICB4bGFtbyA9IG9wdGlvbnMueGxhbW8sXG4gICAgICB4bGkgPSBvcHRpb25zLnhsaSxcbiAgICAgIHhuaSA9IG9wdGlvbnMueG5pO1xuICB2YXIgZjIyMDtcbiAgdmFyIGYyMjE7XG4gIHZhciBmMzExO1xuICB2YXIgZjMyMTtcbiAgdmFyIGYzMjI7XG4gIHZhciBmMzMwO1xuICB2YXIgZjQ0MTtcbiAgdmFyIGY0NDI7XG4gIHZhciBmNTIyO1xuICB2YXIgZjUyMztcbiAgdmFyIGY1NDI7XG4gIHZhciBmNTQzO1xuICB2YXIgZzIwMDtcbiAgdmFyIGcyMDE7XG4gIHZhciBnMjExO1xuICB2YXIgZzMwMDtcbiAgdmFyIGczMTA7XG4gIHZhciBnMzIyO1xuICB2YXIgZzQxMDtcbiAgdmFyIGc0MjI7XG4gIHZhciBnNTIwO1xuICB2YXIgZzUyMTtcbiAgdmFyIGc1MzI7XG4gIHZhciBnNTMzO1xuICB2YXIgc2luaTI7XG4gIHZhciB0ZW1wO1xuICB2YXIgdGVtcDE7XG4gIHZhciB4bm8yO1xuICB2YXIgYWludjI7XG4gIHZhciBhb252O1xuICB2YXIgY29zaXNxO1xuICB2YXIgZW9jO1xuICB2YXIgcTIyID0gMS43ODkxNjc5ZS02O1xuICB2YXIgcTMxID0gMi4xNDYwNzQ4ZS02O1xuICB2YXIgcTMzID0gMi4yMTIzMDE1ZS03O1xuICB2YXIgcm9vdDIyID0gMS43ODkxNjc5ZS02O1xuICB2YXIgcm9vdDQ0ID0gNy4zNjM2OTUzZS05O1xuICB2YXIgcm9vdDU0ID0gMi4xNzY1ODAzZS05O1xuICB2YXIgcnB0aW0gPSA0LjM3NTI2OTA4ODAxMTI5OTY2ZS0zOyAvLyBlcXVhdGVzIHRvIDcuMjkyMTE1MTQ2Njg4NTVlLTUgcmFkL3NlY1xuXG4gIHZhciByb290MzIgPSAzLjczOTM3OTJlLTc7XG4gIHZhciByb290NTIgPSAxLjE0Mjg2MzllLTc7XG4gIHZhciB6bmwgPSAxLjU4MzUyMThlLTQ7XG4gIHZhciB6bnMgPSAxLjE5NDU5ZS01OyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLSBkZWVwIHNwYWNlIGluaXRpYWxpemF0aW9uIC0tLS0tLS0tLS0tLVxuXG4gIGlyZXogPSAwO1xuXG4gIGlmIChubSA8IDAuMDA1MjM1OTg3NyAmJiBubSA+IDAuMDAzNDkwNjU4NSkge1xuICAgIGlyZXogPSAxO1xuICB9XG5cbiAgaWYgKG5tID49IDguMjZlLTMgJiYgbm0gPD0gOS4yNGUtMyAmJiBlbSA+PSAwLjUpIHtcbiAgICBpcmV6ID0gMjtcbiAgfSAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZG8gc29sYXIgdGVybXMgLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbiAgdmFyIHNlcyA9IHNzMSAqIHpucyAqIHNzNTtcbiAgdmFyIHNpcyA9IHNzMiAqIHpucyAqIChzejExICsgc3oxMyk7XG4gIHZhciBzbHMgPSAtem5zICogc3MzICogKHN6MSArIHN6MyAtIDE0LjAgLSA2LjAgKiBlbXNxKTtcbiAgdmFyIHNnaHMgPSBzczQgKiB6bnMgKiAoc3ozMSArIHN6MzMgLSA2LjApO1xuICB2YXIgc2hzID0gLXpucyAqIHNzMiAqIChzejIxICsgc3oyMyk7IC8vIHNncDRmaXggZm9yIDE4MCBkZWcgaW5jbFxuXG4gIGlmIChpbmNsbSA8IDUuMjM1OTg3N2UtMiB8fCBpbmNsbSA+IHBpIC0gNS4yMzU5ODc3ZS0yKSB7XG4gICAgc2hzID0gMC4wO1xuICB9XG5cbiAgaWYgKHNpbmltICE9PSAwLjApIHtcbiAgICBzaHMgLz0gc2luaW07XG4gIH1cblxuICB2YXIgc2dzID0gc2docyAtIGNvc2ltICogc2hzOyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRvIGx1bmFyIHRlcm1zIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGRlZHQgPSBzZXMgKyBzMSAqIHpubCAqIHM1O1xuICBkaWR0ID0gc2lzICsgczIgKiB6bmwgKiAoejExICsgejEzKTtcbiAgZG1kdCA9IHNscyAtIHpubCAqIHMzICogKHoxICsgejMgLSAxNC4wIC0gNi4wICogZW1zcSk7XG4gIHZhciBzZ2hsID0gczQgKiB6bmwgKiAoejMxICsgejMzIC0gNi4wKTtcbiAgdmFyIHNobGwgPSAtem5sICogczIgKiAoejIxICsgejIzKTsgLy8gc2dwNGZpeCBmb3IgMTgwIGRlZyBpbmNsXG5cbiAgaWYgKGluY2xtIDwgNS4yMzU5ODc3ZS0yIHx8IGluY2xtID4gcGkgLSA1LjIzNTk4NzdlLTIpIHtcbiAgICBzaGxsID0gMC4wO1xuICB9XG5cbiAgZG9tZHQgPSBzZ3MgKyBzZ2hsO1xuICBkbm9kdCA9IHNocztcblxuICBpZiAoc2luaW0gIT09IDAuMCkge1xuICAgIGRvbWR0IC09IGNvc2ltIC8gc2luaW0gKiBzaGxsO1xuICAgIGRub2R0ICs9IHNobGwgLyBzaW5pbTtcbiAgfSAvLyAtLS0tLS0tLS0tLSBjYWxjdWxhdGUgZGVlcCBzcGFjZSByZXNvbmFuY2UgZWZmZWN0cyAtLS0tLS0tLVxuXG5cbiAgdmFyIGRuZHQgPSAwLjA7XG4gIHZhciB0aGV0YSA9IChnc3RvICsgdGMgKiBycHRpbSkgJSB0d29QaTtcbiAgZW0gKz0gZGVkdCAqIHQ7XG4gIGluY2xtICs9IGRpZHQgKiB0O1xuICBhcmdwbSArPSBkb21kdCAqIHQ7XG4gIG5vZGVtICs9IGRub2R0ICogdDtcbiAgbW0gKz0gZG1kdCAqIHQ7IC8vIHNncDRmaXggZm9yIG5lZ2F0aXZlIGluY2xpbmF0aW9uc1xuICAvLyB0aGUgZm9sbG93aW5nIGlmIHN0YXRlbWVudCBzaG91bGQgYmUgY29tbWVudGVkIG91dFxuICAvLyBpZiAoaW5jbG0gPCAwLjApXG4gIC8vIHtcbiAgLy8gICBpbmNsbSAgPSAtaW5jbG07XG4gIC8vICAgYXJncG0gID0gYXJncG0gLSBwaTtcbiAgLy8gICBub2RlbSA9IG5vZGVtICsgcGk7XG4gIC8vIH1cbiAgLy8gLS0tLS0tLS0tLS0tLS0gaW5pdGlhbGl6ZSB0aGUgcmVzb25hbmNlIHRlcm1zIC0tLS0tLS0tLS0tLS1cblxuICBpZiAoaXJleiAhPT0gMCkge1xuICAgIGFvbnYgPSBNYXRoLnBvdyhubSAvIHhrZSwgeDJvMyk7IC8vIC0tLS0tLS0tLS0gZ2VvcG90ZW50aWFsIHJlc29uYW5jZSBmb3IgMTIgaG91ciBvcmJpdHMgLS0tLS0tXG5cbiAgICBpZiAoaXJleiA9PT0gMikge1xuICAgICAgY29zaXNxID0gY29zaW0gKiBjb3NpbTtcbiAgICAgIHZhciBlbW8gPSBlbTtcbiAgICAgIGVtID0gZWNjbztcbiAgICAgIHZhciBlbXNxbyA9IGVtc3E7XG4gICAgICBlbXNxID0gZWNjc3E7XG4gICAgICBlb2MgPSBlbSAqIGVtc3E7XG4gICAgICBnMjAxID0gLTAuMzA2IC0gKGVtIC0gMC42NCkgKiAwLjQ0MDtcblxuICAgICAgaWYgKGVtIDw9IDAuNjUpIHtcbiAgICAgICAgZzIxMSA9IDMuNjE2IC0gMTMuMjQ3MCAqIGVtICsgMTYuMjkwMCAqIGVtc3E7XG4gICAgICAgIGczMTAgPSAtMTkuMzAyICsgMTE3LjM5MDAgKiBlbSAtIDIyOC40MTkwICogZW1zcSArIDE1Ni41OTEwICogZW9jO1xuICAgICAgICBnMzIyID0gLTE4LjkwNjggKyAxMDkuNzkyNyAqIGVtIC0gMjE0LjYzMzQgKiBlbXNxICsgMTQ2LjU4MTYgKiBlb2M7XG4gICAgICAgIGc0MTAgPSAtNDEuMTIyICsgMjQyLjY5NDAgKiBlbSAtIDQ3MS4wOTQwICogZW1zcSArIDMxMy45NTMwICogZW9jO1xuICAgICAgICBnNDIyID0gLTE0Ni40MDcgKyA4NDEuODgwMCAqIGVtIC0gMTYyOS4wMTQgKiBlbXNxICsgMTA4My40MzUwICogZW9jO1xuICAgICAgICBnNTIwID0gLTUzMi4xMTQgKyAzMDE3Ljk3NyAqIGVtIC0gNTc0MC4wMzIgKiBlbXNxICsgMzcwOC4yNzYwICogZW9jO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZzIxMSA9IC03Mi4wOTkgKyAzMzEuODE5ICogZW0gLSA1MDguNzM4ICogZW1zcSArIDI2Ni43MjQgKiBlb2M7XG4gICAgICAgIGczMTAgPSAtMzQ2Ljg0NCArIDE1ODIuODUxICogZW0gLSAyNDE1LjkyNSAqIGVtc3EgKyAxMjQ2LjExMyAqIGVvYztcbiAgICAgICAgZzMyMiA9IC0zNDIuNTg1ICsgMTU1NC45MDggKiBlbSAtIDIzNjYuODk5ICogZW1zcSArIDEyMTUuOTcyICogZW9jO1xuICAgICAgICBnNDEwID0gLTEwNTIuNzk3ICsgNDc1OC42ODYgKiBlbSAtIDcxOTMuOTkyICogZW1zcSArIDM2NTEuOTU3ICogZW9jO1xuICAgICAgICBnNDIyID0gLTM1ODEuNjkwICsgMTYxNzguMTEwICogZW0gLSAyNDQ2Mi43NzAgKiBlbXNxICsgMTI0MjIuNTIwICogZW9jO1xuXG4gICAgICAgIGlmIChlbSA+IDAuNzE1KSB7XG4gICAgICAgICAgZzUyMCA9IC01MTQ5LjY2ICsgMjk5MzYuOTIgKiBlbSAtIDU0MDg3LjM2ICogZW1zcSArIDMxMzI0LjU2ICogZW9jO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGc1MjAgPSAxNDY0Ljc0IC0gNDY2NC43NSAqIGVtICsgMzc2My42NCAqIGVtc3E7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGVtIDwgMC43KSB7XG4gICAgICAgIGc1MzMgPSAtOTE5LjIyNzcwICsgNDk4OC42MTAwICogZW0gLSA5MDY0Ljc3MDAgKiBlbXNxICsgNTU0Mi4yMSAqIGVvYztcbiAgICAgICAgZzUyMSA9IC04MjIuNzEwNzIgKyA0NTY4LjYxNzMgKiBlbSAtIDg0OTEuNDE0NiAqIGVtc3EgKyA1MzM3LjUyNCAqIGVvYztcbiAgICAgICAgZzUzMiA9IC04NTMuNjY2MDAgKyA0NjkwLjI1MDAgKiBlbSAtIDg2MjQuNzcwMCAqIGVtc3EgKyA1MzQxLjQgKiBlb2M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnNTMzID0gLTM3OTk1Ljc4MCArIDE2MTYxNi41MiAqIGVtIC0gMjI5ODM4LjIwICogZW1zcSArIDEwOTM3Ny45NCAqIGVvYztcbiAgICAgICAgZzUyMSA9IC01MTc1Mi4xMDQgKyAyMTg5MTMuOTUgKiBlbSAtIDMwOTQ2OC4xNiAqIGVtc3EgKyAxNDYzNDkuNDIgKiBlb2M7XG4gICAgICAgIGc1MzIgPSAtNDAwMjMuODgwICsgMTcwNDcwLjg5ICogZW0gLSAyNDI2OTkuNDggKiBlbXNxICsgMTE1NjA1LjgyICogZW9jO1xuICAgICAgfVxuXG4gICAgICBzaW5pMiA9IHNpbmltICogc2luaW07XG4gICAgICBmMjIwID0gMC43NSAqICgxLjAgKyAyLjAgKiBjb3NpbSArIGNvc2lzcSk7XG4gICAgICBmMjIxID0gMS41ICogc2luaTI7XG4gICAgICBmMzIxID0gMS44NzUgKiBzaW5pbSAqICgxLjAgLSAyLjAgKiBjb3NpbSAtIDMuMCAqIGNvc2lzcSk7XG4gICAgICBmMzIyID0gLTEuODc1ICogc2luaW0gKiAoMS4wICsgMi4wICogY29zaW0gLSAzLjAgKiBjb3Npc3EpO1xuICAgICAgZjQ0MSA9IDM1LjAgKiBzaW5pMiAqIGYyMjA7XG4gICAgICBmNDQyID0gMzkuMzc1MCAqIHNpbmkyICogc2luaTI7XG4gICAgICBmNTIyID0gOS44NDM3NSAqIHNpbmltICogKHNpbmkyICogKDEuMCAtIDIuMCAqIGNvc2ltIC0gNS4wICogY29zaXNxKSArIDAuMzMzMzMzMzMgKiAoLTIuMCArIDQuMCAqIGNvc2ltICsgNi4wICogY29zaXNxKSk7XG4gICAgICBmNTIzID0gc2luaW0gKiAoNC45MjE4NzUxMiAqIHNpbmkyICogKC0yLjAgLSA0LjAgKiBjb3NpbSArIDEwLjAgKiBjb3Npc3EpICsgNi41NjI1MDAxMiAqICgxLjAgKyAyLjAgKiBjb3NpbSAtIDMuMCAqIGNvc2lzcSkpO1xuICAgICAgZjU0MiA9IDI5LjUzMTI1ICogc2luaW0gKiAoMi4wIC0gOC4wICogY29zaW0gKyBjb3Npc3EgKiAoLTEyLjAgKyA4LjAgKiBjb3NpbSArIDEwLjAgKiBjb3Npc3EpKTtcbiAgICAgIGY1NDMgPSAyOS41MzEyNSAqIHNpbmltICogKC0yLjAgLSA4LjAgKiBjb3NpbSArIGNvc2lzcSAqICgxMi4wICsgOC4wICogY29zaW0gLSAxMC4wICogY29zaXNxKSk7XG4gICAgICB4bm8yID0gbm0gKiBubTtcbiAgICAgIGFpbnYyID0gYW9udiAqIGFvbnY7XG4gICAgICB0ZW1wMSA9IDMuMCAqIHhubzIgKiBhaW52MjtcbiAgICAgIHRlbXAgPSB0ZW1wMSAqIHJvb3QyMjtcbiAgICAgIGQyMjAxID0gdGVtcCAqIGYyMjAgKiBnMjAxO1xuICAgICAgZDIyMTEgPSB0ZW1wICogZjIyMSAqIGcyMTE7XG4gICAgICB0ZW1wMSAqPSBhb252O1xuICAgICAgdGVtcCA9IHRlbXAxICogcm9vdDMyO1xuICAgICAgZDMyMTAgPSB0ZW1wICogZjMyMSAqIGczMTA7XG4gICAgICBkMzIyMiA9IHRlbXAgKiBmMzIyICogZzMyMjtcbiAgICAgIHRlbXAxICo9IGFvbnY7XG4gICAgICB0ZW1wID0gMi4wICogdGVtcDEgKiByb290NDQ7XG4gICAgICBkNDQxMCA9IHRlbXAgKiBmNDQxICogZzQxMDtcbiAgICAgIGQ0NDIyID0gdGVtcCAqIGY0NDIgKiBnNDIyO1xuICAgICAgdGVtcDEgKj0gYW9udjtcbiAgICAgIHRlbXAgPSB0ZW1wMSAqIHJvb3Q1MjtcbiAgICAgIGQ1MjIwID0gdGVtcCAqIGY1MjIgKiBnNTIwO1xuICAgICAgZDUyMzIgPSB0ZW1wICogZjUyMyAqIGc1MzI7XG4gICAgICB0ZW1wID0gMi4wICogdGVtcDEgKiByb290NTQ7XG4gICAgICBkNTQyMSA9IHRlbXAgKiBmNTQyICogZzUyMTtcbiAgICAgIGQ1NDMzID0gdGVtcCAqIGY1NDMgKiBnNTMzO1xuICAgICAgeGxhbW8gPSAobW8gKyBub2RlbyArIG5vZGVvIC0gKHRoZXRhICsgdGhldGEpKSAlIHR3b1BpO1xuICAgICAgeGZhY3QgPSBtZG90ICsgZG1kdCArIDIuMCAqIChub2RlZG90ICsgZG5vZHQgLSBycHRpbSkgLSBubztcbiAgICAgIGVtID0gZW1vO1xuICAgICAgZW1zcSA9IGVtc3FvO1xuICAgIH0gLy8gIC0tLS0tLS0tLS0tLS0tLS0gc3luY2hyb25vdXMgcmVzb25hbmNlIHRlcm1zIC0tLS0tLS0tLS0tLS0tXG5cblxuICAgIGlmIChpcmV6ID09PSAxKSB7XG4gICAgICBnMjAwID0gMS4wICsgZW1zcSAqICgtMi41ICsgMC44MTI1ICogZW1zcSk7XG4gICAgICBnMzEwID0gMS4wICsgMi4wICogZW1zcTtcbiAgICAgIGczMDAgPSAxLjAgKyBlbXNxICogKC02LjAgKyA2LjYwOTM3ICogZW1zcSk7XG4gICAgICBmMjIwID0gMC43NSAqICgxLjAgKyBjb3NpbSkgKiAoMS4wICsgY29zaW0pO1xuICAgICAgZjMxMSA9IDAuOTM3NSAqIHNpbmltICogc2luaW0gKiAoMS4wICsgMy4wICogY29zaW0pIC0gMC43NSAqICgxLjAgKyBjb3NpbSk7XG4gICAgICBmMzMwID0gMS4wICsgY29zaW07XG4gICAgICBmMzMwICo9IDEuODc1ICogZjMzMCAqIGYzMzA7XG4gICAgICBkZWwxID0gMy4wICogbm0gKiBubSAqIGFvbnYgKiBhb252O1xuICAgICAgZGVsMiA9IDIuMCAqIGRlbDEgKiBmMjIwICogZzIwMCAqIHEyMjtcbiAgICAgIGRlbDMgPSAzLjAgKiBkZWwxICogZjMzMCAqIGczMDAgKiBxMzMgKiBhb252O1xuICAgICAgZGVsMSA9IGRlbDEgKiBmMzExICogZzMxMCAqIHEzMSAqIGFvbnY7XG4gICAgICB4bGFtbyA9IChtbyArIG5vZGVvICsgYXJncG8gLSB0aGV0YSkgJSB0d29QaTtcbiAgICAgIHhmYWN0ID0gbWRvdCArIHhwaWRvdCArIGRtZHQgKyBkb21kdCArIGRub2R0IC0gKG5vICsgcnB0aW0pO1xuICAgIH0gLy8gIC0tLS0tLS0tLS0tLSBmb3Igc2dwNCwgaW5pdGlhbGl6ZSB0aGUgaW50ZWdyYXRvciAtLS0tLS0tLS0tXG5cblxuICAgIHhsaSA9IHhsYW1vO1xuICAgIHhuaSA9IG5vO1xuICAgIGF0aW1lID0gMC4wO1xuICAgIG5tID0gbm8gKyBkbmR0O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBlbTogZW0sXG4gICAgYXJncG06IGFyZ3BtLFxuICAgIGluY2xtOiBpbmNsbSxcbiAgICBtbTogbW0sXG4gICAgbm06IG5tLFxuICAgIG5vZGVtOiBub2RlbSxcbiAgICBpcmV6OiBpcmV6LFxuICAgIGF0aW1lOiBhdGltZSxcbiAgICBkMjIwMTogZDIyMDEsXG4gICAgZDIyMTE6IGQyMjExLFxuICAgIGQzMjEwOiBkMzIxMCxcbiAgICBkMzIyMjogZDMyMjIsXG4gICAgZDQ0MTA6IGQ0NDEwLFxuICAgIGQ0NDIyOiBkNDQyMixcbiAgICBkNTIyMDogZDUyMjAsXG4gICAgZDUyMzI6IGQ1MjMyLFxuICAgIGQ1NDIxOiBkNTQyMSxcbiAgICBkNTQzMzogZDU0MzMsXG4gICAgZGVkdDogZGVkdCxcbiAgICBkaWR0OiBkaWR0LFxuICAgIGRtZHQ6IGRtZHQsXG4gICAgZG5kdDogZG5kdCxcbiAgICBkbm9kdDogZG5vZHQsXG4gICAgZG9tZHQ6IGRvbWR0LFxuICAgIGRlbDE6IGRlbDEsXG4gICAgZGVsMjogZGVsMixcbiAgICBkZWwzOiBkZWwzLFxuICAgIHhmYWN0OiB4ZmFjdCxcbiAgICB4bGFtbzogeGxhbW8sXG4gICAgeGxpOiB4bGksXG4gICAgeG5pOiB4bmlcbiAgfTtcbn1cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBnc3RpbWVcbiAqXG4gKiAgdGhpcyBmdW5jdGlvbiBmaW5kcyB0aGUgZ3JlZW53aWNoIHNpZGVyZWFsIHRpbWUuXG4gKlxuICogIGF1dGhvciAgICAgICAgOiBkYXZpZCB2YWxsYWRvICAgICAgICAgICAgICAgICAgNzE5LTU3My0yNjAwICAgIDEgbWFyIDIwMDFcbiAqXG4gKiAgaW5wdXRzICAgICAgICAgIGRlc2NyaXB0aW9uICAgICAgICAgICAgICAgICAgICByYW5nZSAvIHVuaXRzXG4gKiAgICBqZHV0MSAgICAgICAtIGp1bGlhbiBkYXRlIGluIHV0MSAgICAgICAgICAgICBkYXlzIGZyb20gNDcxMyBiY1xuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIGdzdGltZSAgICAgIC0gZ3JlZW53aWNoIHNpZGVyZWFsIHRpbWUgICAgICAgIDAgdG8gMnBpIHJhZFxuICpcbiAqICBsb2NhbHMgICAgICAgIDpcbiAqICAgIHRlbXAgICAgICAgIC0gdGVtcG9yYXJ5IHZhcmlhYmxlIGZvciBkb3VibGVzICAgcmFkXG4gKiAgICB0dXQxICAgICAgICAtIGp1bGlhbiBjZW50dXJpZXMgZnJvbSB0aGVcbiAqICAgICAgICAgICAgICAgICAgamFuIDEsIDIwMDAgMTIgaCBlcG9jaCAodXQxKVxuICpcbiAqICBjb3VwbGluZyAgICAgIDpcbiAqICAgIG5vbmVcbiAqXG4gKiAgcmVmZXJlbmNlcyAgICA6XG4gKiAgICB2YWxsYWRvICAgICAgIDIwMDQsIDE5MSwgZXEgMy00NVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblxuZnVuY3Rpb24gZ3N0aW1lSW50ZXJuYWwoamR1dDEpIHtcbiAgdmFyIHR1dDEgPSAoamR1dDEgLSAyNDUxNTQ1LjApIC8gMzY1MjUuMDtcbiAgdmFyIHRlbXAgPSAtNi4yZS02ICogdHV0MSAqIHR1dDEgKiB0dXQxICsgMC4wOTMxMDQgKiB0dXQxICogdHV0MSArICg4NzY2MDAuMCAqIDM2MDAgKyA4NjQwMTg0LjgxMjg2NikgKiB0dXQxICsgNjczMTAuNTQ4NDE7IC8vICMgc2VjXG5cbiAgdGVtcCA9IHRlbXAgKiBkZWcycmFkIC8gMjQwLjAgJSB0d29QaTsgLy8gMzYwLzg2NDAwID0gMS8yNDAsIHRvIGRlZywgdG8gcmFkXG4gIC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gY2hlY2sgcXVhZHJhbnRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGlmICh0ZW1wIDwgMC4wKSB7XG4gICAgdGVtcCArPSB0d29QaTtcbiAgfVxuXG4gIHJldHVybiB0ZW1wO1xufVxuXG5mdW5jdGlvbiBnc3RpbWUoKSB7XG4gIGlmICgoYXJndW1lbnRzLmxlbmd0aCA8PSAwID8gdW5kZWZpbmVkIDogYXJndW1lbnRzWzBdKSBpbnN0YW5jZW9mIERhdGUgfHwgYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gZ3N0aW1lSW50ZXJuYWwoamRheS5hcHBseSh2b2lkIDAsIGFyZ3VtZW50cykpO1xuICB9XG5cbiAgcmV0dXJuIGdzdGltZUludGVybmFsLmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKTtcbn1cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZHVyZSBpbml0bFxuICpcbiAqICB0aGlzIHByb2NlZHVyZSBpbml0aWFsaXplcyB0aGUgc2dwNCBwcm9wYWdhdG9yLiBhbGwgdGhlIGluaXRpYWxpemF0aW9uIGlzXG4gKiAgICBjb25zb2xpZGF0ZWQgaGVyZSBpbnN0ZWFkIG9mIGhhdmluZyBtdWx0aXBsZSBsb29wcyBpbnNpZGUgb3RoZXIgcm91dGluZXMuXG4gKlxuICogIGF1dGhvciAgICAgICAgOiBkYXZpZCB2YWxsYWRvICAgICAgICAgICAgICAgICAgNzE5LTU3My0yNjAwICAgMjgganVuIDIwMDVcbiAqXG4gKiAgaW5wdXRzICAgICAgICA6XG4gKiAgICBlY2NvICAgICAgICAtIGVjY2VudHJpY2l0eSAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCAtIDEuMFxuICogICAgZXBvY2ggICAgICAgLSBlcG9jaCB0aW1lIGluIGRheXMgZnJvbSBqYW4gMCwgMTk1MC4gMCBoclxuICogICAgaW5jbG8gICAgICAgLSBpbmNsaW5hdGlvbiBvZiBzYXRlbGxpdGVcbiAqICAgIG5vICAgICAgICAgIC0gbWVhbiBtb3Rpb24gb2Ygc2F0ZWxsaXRlXG4gKiAgICBzYXRuICAgICAgICAtIHNhdGVsbGl0ZSBudW1iZXJcbiAqXG4gKiAgb3V0cHV0cyAgICAgICA6XG4gKiAgICBhaW52ICAgICAgICAtIDEuMCAvIGFcbiAqICAgIGFvICAgICAgICAgIC0gc2VtaSBtYWpvciBheGlzXG4gKiAgICBjb240MSAgICAgICAtXG4gKiAgICBjb240MiAgICAgICAtIDEuMCAtIDUuMCBjb3MoaSlcbiAqICAgIGNvc2lvICAgICAgIC0gY29zaW5lIG9mIGluY2xpbmF0aW9uXG4gKiAgICBjb3NpbzIgICAgICAtIGNvc2lvIHNxdWFyZWRcbiAqICAgIGVjY3NxICAgICAgIC0gZWNjZW50cmljaXR5IHNxdWFyZWRcbiAqICAgIG1ldGhvZCAgICAgIC0gZmxhZyBmb3IgZGVlcCBzcGFjZSAgICAgICAgICAgICAgICAgICAgJ2QnLCAnbidcbiAqICAgIG9tZW9zcSAgICAgIC0gMS4wIC0gZWNjbyAqIGVjY29cbiAqICAgIHBvc3EgICAgICAgIC0gc2VtaS1wYXJhbWV0ZXIgc3F1YXJlZFxuICogICAgcnAgICAgICAgICAgLSByYWRpdXMgb2YgcGVyaWdlZVxuICogICAgcnRlb3NxICAgICAgLSBzcXVhcmUgcm9vdCBvZiAoMS4wIC0gZWNjbyplY2NvKVxuICogICAgc2luaW8gICAgICAgLSBzaW5lIG9mIGluY2xpbmF0aW9uXG4gKiAgICBnc3RvICAgICAgICAtIGdzdCBhdCB0aW1lIG9mIG9ic2VydmF0aW9uICAgICAgICAgICAgICAgcmFkXG4gKiAgICBubyAgICAgICAgICAtIG1lYW4gbW90aW9uIG9mIHNhdGVsbGl0ZVxuICpcbiAqICBsb2NhbHMgICAgICAgIDpcbiAqICAgIGFrICAgICAgICAgIC1cbiAqICAgIGQxICAgICAgICAgIC1cbiAqICAgIGRlbCAgICAgICAgIC1cbiAqICAgIGFkZWwgICAgICAgIC1cbiAqICAgIHBvICAgICAgICAgIC1cbiAqXG4gKiAgY291cGxpbmcgICAgICA6XG4gKiAgICBnZXRncmF2Y29uc3RcbiAqICAgIGdzdGltZSAgICAgIC0gZmluZCBncmVlbndpY2ggc2lkZXJlYWwgdGltZSBmcm9tIHRoZSBqdWxpYW4gZGF0ZVxuICpcbiAqICByZWZlcmVuY2VzICAgIDpcbiAqICAgIGhvb3RzLCByb2VocmljaCwgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzMgMTk4MFxuICogICAgaG9vdHMsIG5vcmFkIHNwYWNldHJhY2sgcmVwb3J0ICM2IDE5ODZcbiAqICAgIGhvb3RzLCBzY2h1bWFjaGVyIGFuZCBnbG92ZXIgMjAwNFxuICogICAgdmFsbGFkbywgY3Jhd2ZvcmQsIGh1anNhaywga2Vsc28gIDIwMDZcbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG5mdW5jdGlvbiBpbml0bChvcHRpb25zKSB7XG4gIHZhciBlY2NvID0gb3B0aW9ucy5lY2NvLFxuICAgICAgZXBvY2ggPSBvcHRpb25zLmVwb2NoLFxuICAgICAgaW5jbG8gPSBvcHRpb25zLmluY2xvLFxuICAgICAgb3BzbW9kZSA9IG9wdGlvbnMub3BzbW9kZTtcbiAgdmFyIG5vID0gb3B0aW9ucy5ubzsgLy8gc2dwNGZpeCB1c2Ugb2xkIHdheSBvZiBmaW5kaW5nIGdzdFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBlYXJ0aCBjb25zdGFudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHNncDRmaXggaWRlbnRpZnkgY29uc3RhbnRzIGFuZCBhbGxvdyBhbHRlcm5hdGUgdmFsdWVzXG4gIC8vIC0tLS0tLS0tLS0tLS0gY2FsY3VsYXRlIGF1eGlsbGFyeSBlcG9jaCBxdWFudGl0aWVzIC0tLS0tLS0tLS1cblxuICB2YXIgZWNjc3EgPSBlY2NvICogZWNjbztcbiAgdmFyIG9tZW9zcSA9IDEuMCAtIGVjY3NxO1xuICB2YXIgcnRlb3NxID0gTWF0aC5zcXJ0KG9tZW9zcSk7XG4gIHZhciBjb3NpbyA9IE1hdGguY29zKGluY2xvKTtcbiAgdmFyIGNvc2lvMiA9IGNvc2lvICogY29zaW87IC8vIC0tLS0tLS0tLS0tLS0tLS0tLSB1bi1rb3phaSB0aGUgbWVhbiBtb3Rpb24gLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgYWsgPSBNYXRoLnBvdyh4a2UgLyBubywgeDJvMyk7XG4gIHZhciBkMSA9IDAuNzUgKiBqMiAqICgzLjAgKiBjb3NpbzIgLSAxLjApIC8gKHJ0ZW9zcSAqIG9tZW9zcSk7XG4gIHZhciBkZWxQcmltZSA9IGQxIC8gKGFrICogYWspO1xuICB2YXIgYWRlbCA9IGFrICogKDEuMCAtIGRlbFByaW1lICogZGVsUHJpbWUgLSBkZWxQcmltZSAqICgxLjAgLyAzLjAgKyAxMzQuMCAqIGRlbFByaW1lICogZGVsUHJpbWUgLyA4MS4wKSk7XG4gIGRlbFByaW1lID0gZDEgLyAoYWRlbCAqIGFkZWwpO1xuICBubyAvPSAxLjAgKyBkZWxQcmltZTtcbiAgdmFyIGFvID0gTWF0aC5wb3coeGtlIC8gbm8sIHgybzMpO1xuICB2YXIgc2luaW8gPSBNYXRoLnNpbihpbmNsbyk7XG4gIHZhciBwbyA9IGFvICogb21lb3NxO1xuICB2YXIgY29uNDIgPSAxLjAgLSA1LjAgKiBjb3NpbzI7XG4gIHZhciBjb240MSA9IC1jb240MiAtIGNvc2lvMiAtIGNvc2lvMjtcbiAgdmFyIGFpbnYgPSAxLjAgLyBhbztcbiAgdmFyIHBvc3EgPSBwbyAqIHBvO1xuICB2YXIgcnAgPSBhbyAqICgxLjAgLSBlY2NvKTtcbiAgdmFyIG1ldGhvZCA9ICduJzsgLy8gIHNncDRmaXggbW9kZXJuIGFwcHJvYWNoIHRvIGZpbmRpbmcgc2lkZXJlYWwgdGltZVxuXG4gIHZhciBnc3RvO1xuXG4gIGlmIChvcHNtb2RlID09PSAnYScpIHtcbiAgICAvLyAgc2dwNGZpeCB1c2Ugb2xkIHdheSBvZiBmaW5kaW5nIGdzdFxuICAgIC8vICBjb3VudCBpbnRlZ2VyIG51bWJlciBvZiBkYXlzIGZyb20gMCBqYW4gMTk3MFxuICAgIHZhciB0czcwID0gZXBvY2ggLSA3MzA1LjA7XG4gICAgdmFyIGRzNzAgPSBNYXRoLmZsb29yKHRzNzAgKyAxLjBlLTgpO1xuICAgIHZhciB0ZnJhYyA9IHRzNzAgLSBkczcwOyAvLyAgZmluZCBncmVlbndpY2ggbG9jYXRpb24gYXQgZXBvY2hcblxuICAgIHZhciBjMSA9IDEuNzIwMjc5MTY5NDA3MDM2MzllLTI7XG4gICAgdmFyIHRoZ3I3MCA9IDEuNzMyMTM0Mzg1NjUwOTM3NDtcbiAgICB2YXIgZms1ciA9IDUuMDc1NTE0MTk0MzIyNjk0NDJlLTE1O1xuICAgIHZhciBjMXAycCA9IGMxICsgdHdvUGk7XG4gICAgZ3N0byA9ICh0aGdyNzAgKyBjMSAqIGRzNzAgKyBjMXAycCAqIHRmcmFjICsgdHM3MCAqIHRzNzAgKiBmazVyKSAlIHR3b1BpO1xuXG4gICAgaWYgKGdzdG8gPCAwLjApIHtcbiAgICAgIGdzdG8gKz0gdHdvUGk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGdzdG8gPSBnc3RpbWUoZXBvY2ggKyAyNDMzMjgxLjUpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBubzogbm8sXG4gICAgbWV0aG9kOiBtZXRob2QsXG4gICAgYWludjogYWludixcbiAgICBhbzogYW8sXG4gICAgY29uNDE6IGNvbjQxLFxuICAgIGNvbjQyOiBjb240MixcbiAgICBjb3NpbzogY29zaW8sXG4gICAgY29zaW8yOiBjb3NpbzIsXG4gICAgZWNjc3E6IGVjY3NxLFxuICAgIG9tZW9zcTogb21lb3NxLFxuICAgIHBvc3E6IHBvc3EsXG4gICAgcnA6IHJwLFxuICAgIHJ0ZW9zcTogcnRlb3NxLFxuICAgIHNpbmlvOiBzaW5pbyxcbiAgICBnc3RvOiBnc3RvXG4gIH07XG59XG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWR1cmUgZHNwYWNlXG4gKlxuICogIHRoaXMgcHJvY2VkdXJlIHByb3ZpZGVzIGRlZXAgc3BhY2UgY29udHJpYnV0aW9ucyB0byBtZWFuIGVsZW1lbnRzIGZvclxuICogICAgcGVydHVyYmluZyB0aGlyZCBib2R5LiAgdGhlc2UgZWZmZWN0cyBoYXZlIGJlZW4gYXZlcmFnZWQgb3ZlciBvbmVcbiAqICAgIHJldm9sdXRpb24gb2YgdGhlIHN1biBhbmQgbW9vbi4gIGZvciBlYXJ0aCByZXNvbmFuY2UgZWZmZWN0cywgdGhlXG4gKiAgICBlZmZlY3RzIGhhdmUgYmVlbiBhdmVyYWdlZCBvdmVyIG5vIHJldm9sdXRpb25zIG9mIHRoZSBzYXRlbGxpdGUuXG4gKiAgICAobWVhbiBtb3Rpb24pXG4gKlxuICogIGF1dGhvciAgICAgICAgOiBkYXZpZCB2YWxsYWRvICAgICAgICAgICAgICAgICAgNzE5LTU3My0yNjAwICAgMjgganVuIDIwMDVcbiAqXG4gKiAgaW5wdXRzICAgICAgICA6XG4gKiAgICBkMjIwMSwgZDIyMTEsIGQzMjEwLCBkMzIyMiwgZDQ0MTAsIGQ0NDIyLCBkNTIyMCwgZDUyMzIsIGQ1NDIxLCBkNTQzMyAtXG4gKiAgICBkZWR0ICAgICAgICAtXG4gKiAgICBkZWwxLCBkZWwyLCBkZWwzICAtXG4gKiAgICBkaWR0ICAgICAgICAtXG4gKiAgICBkbWR0ICAgICAgICAtXG4gKiAgICBkbm9kdCAgICAgICAtXG4gKiAgICBkb21kdCAgICAgICAtXG4gKiAgICBpcmV6ICAgICAgICAtIGZsYWcgZm9yIHJlc29uYW5jZSAgICAgICAgICAgMC1ub25lLCAxLW9uZSBkYXksIDItaGFsZiBkYXlcbiAqICAgIGFyZ3BvICAgICAgIC0gYXJndW1lbnQgb2YgcGVyaWdlZVxuICogICAgYXJncGRvdCAgICAgLSBhcmd1bWVudCBvZiBwZXJpZ2VlIGRvdCAocmF0ZSlcbiAqICAgIHQgICAgICAgICAgIC0gdGltZVxuICogICAgdGMgICAgICAgICAgLVxuICogICAgZ3N0byAgICAgICAgLSBnc3RcbiAqICAgIHhmYWN0ICAgICAgIC1cbiAqICAgIHhsYW1vICAgICAgIC1cbiAqICAgIG5vICAgICAgICAgIC0gbWVhbiBtb3Rpb25cbiAqICAgIGF0aW1lICAgICAgIC1cbiAqICAgIGVtICAgICAgICAgIC0gZWNjZW50cmljaXR5XG4gKiAgICBmdCAgICAgICAgICAtXG4gKiAgICBhcmdwbSAgICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWVcbiAqICAgIGluY2xtICAgICAgIC0gaW5jbGluYXRpb25cbiAqICAgIHhsaSAgICAgICAgIC1cbiAqICAgIG1tICAgICAgICAgIC0gbWVhbiBhbm9tYWx5XG4gKiAgICB4bmkgICAgICAgICAtIG1lYW4gbW90aW9uXG4gKiAgICBub2RlbSAgICAgICAtIHJpZ2h0IGFzY2Vuc2lvbiBvZiBhc2NlbmRpbmcgbm9kZVxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIGF0aW1lICAgICAgIC1cbiAqICAgIGVtICAgICAgICAgIC0gZWNjZW50cmljaXR5XG4gKiAgICBhcmdwbSAgICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWVcbiAqICAgIGluY2xtICAgICAgIC0gaW5jbGluYXRpb25cbiAqICAgIHhsaSAgICAgICAgIC1cbiAqICAgIG1tICAgICAgICAgIC0gbWVhbiBhbm9tYWx5XG4gKiAgICB4bmkgICAgICAgICAtXG4gKiAgICBub2RlbSAgICAgICAtIHJpZ2h0IGFzY2Vuc2lvbiBvZiBhc2NlbmRpbmcgbm9kZVxuICogICAgZG5kdCAgICAgICAgLVxuICogICAgbm0gICAgICAgICAgLSBtZWFuIG1vdGlvblxuICpcbiAqICBsb2NhbHMgICAgICAgIDpcbiAqICAgIGRlbHQgICAgICAgIC1cbiAqICAgIGZ0ICAgICAgICAgIC1cbiAqICAgIHRoZXRhICAgICAgIC1cbiAqICAgIHgybGkgICAgICAgIC1cbiAqICAgIHgyb21pICAgICAgIC1cbiAqICAgIHhsICAgICAgICAgIC1cbiAqICAgIHhsZG90ICAgICAgIC1cbiAqICAgIHhuZGR0ICAgICAgIC1cbiAqICAgIHhuZHQgICAgICAgIC1cbiAqICAgIHhvbWkgICAgICAgIC1cbiAqXG4gKiAgY291cGxpbmcgICAgICA6XG4gKiAgICBub25lICAgICAgICAtXG4gKlxuICogIHJlZmVyZW5jZXMgICAgOlxuICogICAgaG9vdHMsIHJvZWhyaWNoLCBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAjMyAxOTgwXG4gKiAgICBob290cywgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzYgMTk4NlxuICogICAgaG9vdHMsIHNjaHVtYWNoZXIgYW5kIGdsb3ZlciAyMDA0XG4gKiAgICB2YWxsYWRvLCBjcmF3Zm9yZCwgaHVqc2FrLCBrZWxzbyAgMjAwNlxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbmZ1bmN0aW9uIGRzcGFjZShvcHRpb25zKSB7XG4gIHZhciBpcmV6ID0gb3B0aW9ucy5pcmV6LFxuICAgICAgZDIyMDEgPSBvcHRpb25zLmQyMjAxLFxuICAgICAgZDIyMTEgPSBvcHRpb25zLmQyMjExLFxuICAgICAgZDMyMTAgPSBvcHRpb25zLmQzMjEwLFxuICAgICAgZDMyMjIgPSBvcHRpb25zLmQzMjIyLFxuICAgICAgZDQ0MTAgPSBvcHRpb25zLmQ0NDEwLFxuICAgICAgZDQ0MjIgPSBvcHRpb25zLmQ0NDIyLFxuICAgICAgZDUyMjAgPSBvcHRpb25zLmQ1MjIwLFxuICAgICAgZDUyMzIgPSBvcHRpb25zLmQ1MjMyLFxuICAgICAgZDU0MjEgPSBvcHRpb25zLmQ1NDIxLFxuICAgICAgZDU0MzMgPSBvcHRpb25zLmQ1NDMzLFxuICAgICAgZGVkdCA9IG9wdGlvbnMuZGVkdCxcbiAgICAgIGRlbDEgPSBvcHRpb25zLmRlbDEsXG4gICAgICBkZWwyID0gb3B0aW9ucy5kZWwyLFxuICAgICAgZGVsMyA9IG9wdGlvbnMuZGVsMyxcbiAgICAgIGRpZHQgPSBvcHRpb25zLmRpZHQsXG4gICAgICBkbWR0ID0gb3B0aW9ucy5kbWR0LFxuICAgICAgZG5vZHQgPSBvcHRpb25zLmRub2R0LFxuICAgICAgZG9tZHQgPSBvcHRpb25zLmRvbWR0LFxuICAgICAgYXJncG8gPSBvcHRpb25zLmFyZ3BvLFxuICAgICAgYXJncGRvdCA9IG9wdGlvbnMuYXJncGRvdCxcbiAgICAgIHQgPSBvcHRpb25zLnQsXG4gICAgICB0YyA9IG9wdGlvbnMudGMsXG4gICAgICBnc3RvID0gb3B0aW9ucy5nc3RvLFxuICAgICAgeGZhY3QgPSBvcHRpb25zLnhmYWN0LFxuICAgICAgeGxhbW8gPSBvcHRpb25zLnhsYW1vLFxuICAgICAgbm8gPSBvcHRpb25zLm5vO1xuICB2YXIgYXRpbWUgPSBvcHRpb25zLmF0aW1lLFxuICAgICAgZW0gPSBvcHRpb25zLmVtLFxuICAgICAgYXJncG0gPSBvcHRpb25zLmFyZ3BtLFxuICAgICAgaW5jbG0gPSBvcHRpb25zLmluY2xtLFxuICAgICAgeGxpID0gb3B0aW9ucy54bGksXG4gICAgICBtbSA9IG9wdGlvbnMubW0sXG4gICAgICB4bmkgPSBvcHRpb25zLnhuaSxcbiAgICAgIG5vZGVtID0gb3B0aW9ucy5ub2RlbSxcbiAgICAgIG5tID0gb3B0aW9ucy5ubTtcbiAgdmFyIGZhc3gyID0gMC4xMzEzMDkwODtcbiAgdmFyIGZhc3g0ID0gMi44ODQzMTk4O1xuICB2YXIgZmFzeDYgPSAwLjM3NDQ4MDg3O1xuICB2YXIgZzIyID0gNS43Njg2Mzk2O1xuICB2YXIgZzMyID0gMC45NTI0MDg5ODtcbiAgdmFyIGc0NCA9IDEuODAxNDk5ODtcbiAgdmFyIGc1MiA9IDEuMDUwODMzMDtcbiAgdmFyIGc1NCA9IDQuNDEwODg5ODtcbiAgdmFyIHJwdGltID0gNC4zNzUyNjkwODgwMTEyOTk2NmUtMzsgLy8gZXF1YXRlcyB0byA3LjI5MjExNTE0NjY4ODU1ZS01IHJhZC9zZWNcblxuICB2YXIgc3RlcHAgPSA3MjAuMDtcbiAgdmFyIHN0ZXBuID0gLTcyMC4wO1xuICB2YXIgc3RlcDIgPSAyNTkyMDAuMDtcbiAgdmFyIGRlbHQ7XG4gIHZhciB4MmxpO1xuICB2YXIgeDJvbWk7XG4gIHZhciB4bDtcbiAgdmFyIHhsZG90O1xuICB2YXIgeG5kZHQ7XG4gIHZhciB4bmR0O1xuICB2YXIgeG9taTtcbiAgdmFyIGRuZHQgPSAwLjA7XG4gIHZhciBmdCA9IDAuMDsgLy8gIC0tLS0tLS0tLS0tIGNhbGN1bGF0ZSBkZWVwIHNwYWNlIHJlc29uYW5jZSBlZmZlY3RzIC0tLS0tLS0tLS0tXG5cbiAgdmFyIHRoZXRhID0gKGdzdG8gKyB0YyAqIHJwdGltKSAlIHR3b1BpO1xuICBlbSArPSBkZWR0ICogdDtcbiAgaW5jbG0gKz0gZGlkdCAqIHQ7XG4gIGFyZ3BtICs9IGRvbWR0ICogdDtcbiAgbm9kZW0gKz0gZG5vZHQgKiB0O1xuICBtbSArPSBkbWR0ICogdDsgLy8gc2dwNGZpeCBmb3IgbmVnYXRpdmUgaW5jbGluYXRpb25zXG4gIC8vIHRoZSBmb2xsb3dpbmcgaWYgc3RhdGVtZW50IHNob3VsZCBiZSBjb21tZW50ZWQgb3V0XG4gIC8vIGlmIChpbmNsbSA8IDAuMClcbiAgLy8ge1xuICAvLyAgIGluY2xtID0gLWluY2xtO1xuICAvLyAgIGFyZ3BtID0gYXJncG0gLSBwaTtcbiAgLy8gICBub2RlbSA9IG5vZGVtICsgcGk7XG4gIC8vIH1cblxuICAvKiAtIHVwZGF0ZSByZXNvbmFuY2VzIDogbnVtZXJpY2FsIChldWxlci1tYWNsYXVyaW4pIGludGVncmF0aW9uIC0gKi9cblxuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGVwb2NoIHJlc3RhcnQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgKi9cbiAgLy8gICBzZ3A0Zml4IGZvciBwcm9wYWdhdG9yIHByb2JsZW1zXG4gIC8vICAgdGhlIGZvbGxvd2luZyBpbnRlZ3JhdGlvbiB3b3JrcyBmb3IgbmVnYXRpdmUgdGltZSBzdGVwcyBhbmQgcGVyaW9kc1xuICAvLyAgIHRoZSBzcGVjaWZpYyBjaGFuZ2VzIGFyZSB1bmtub3duIGJlY2F1c2UgdGhlIG9yaWdpbmFsIGNvZGUgd2FzIHNvIGNvbnZvbHV0ZWRcbiAgLy8gc2dwNGZpeCB0YWtlIG91dCBhdGltZSA9IDAuMCBhbmQgZml4IGZvciBmYXN0ZXIgb3BlcmF0aW9uXG5cbiAgaWYgKGlyZXogIT09IDApIHtcbiAgICAvLyAgc2dwNGZpeCBzdHJlYW1saW5lIGNoZWNrXG4gICAgaWYgKGF0aW1lID09PSAwLjAgfHwgdCAqIGF0aW1lIDw9IDAuMCB8fCBNYXRoLmFicyh0KSA8IE1hdGguYWJzKGF0aW1lKSkge1xuICAgICAgYXRpbWUgPSAwLjA7XG4gICAgICB4bmkgPSBubztcbiAgICAgIHhsaSA9IHhsYW1vO1xuICAgIH0gLy8gc2dwNGZpeCBtb3ZlIGNoZWNrIG91dHNpZGUgbG9vcFxuXG5cbiAgICBpZiAodCA+IDAuMCkge1xuICAgICAgZGVsdCA9IHN0ZXBwO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWx0ID0gc3RlcG47XG4gICAgfVxuXG4gICAgdmFyIGlyZXRuID0gMzgxOyAvLyBhZGRlZCBmb3IgZG8gbG9vcFxuXG4gICAgd2hpbGUgKGlyZXRuID09PSAzODEpIHtcbiAgICAgIC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tIGRvdCB0ZXJtcyBjYWxjdWxhdGVkIC0tLS0tLS0tLS0tLS1cbiAgICAgIC8vICAtLS0tLS0tLS0tLSBuZWFyIC0gc3luY2hyb25vdXMgcmVzb25hbmNlIHRlcm1zIC0tLS0tLS1cbiAgICAgIGlmIChpcmV6ICE9PSAyKSB7XG4gICAgICAgIHhuZHQgPSBkZWwxICogTWF0aC5zaW4oeGxpIC0gZmFzeDIpICsgZGVsMiAqIE1hdGguc2luKDIuMCAqICh4bGkgLSBmYXN4NCkpICsgZGVsMyAqIE1hdGguc2luKDMuMCAqICh4bGkgLSBmYXN4NikpO1xuICAgICAgICB4bGRvdCA9IHhuaSArIHhmYWN0O1xuICAgICAgICB4bmRkdCA9IGRlbDEgKiBNYXRoLmNvcyh4bGkgLSBmYXN4MikgKyAyLjAgKiBkZWwyICogTWF0aC5jb3MoMi4wICogKHhsaSAtIGZhc3g0KSkgKyAzLjAgKiBkZWwzICogTWF0aC5jb3MoMy4wICogKHhsaSAtIGZhc3g2KSk7XG4gICAgICAgIHhuZGR0ICo9IHhsZG90O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gLS0tLS0tLS0tIG5lYXIgLSBoYWxmLWRheSByZXNvbmFuY2UgdGVybXMgLS0tLS0tLS1cbiAgICAgICAgeG9taSA9IGFyZ3BvICsgYXJncGRvdCAqIGF0aW1lO1xuICAgICAgICB4Mm9taSA9IHhvbWkgKyB4b21pO1xuICAgICAgICB4MmxpID0geGxpICsgeGxpO1xuICAgICAgICB4bmR0ID0gZDIyMDEgKiBNYXRoLnNpbih4Mm9taSArIHhsaSAtIGcyMikgKyBkMjIxMSAqIE1hdGguc2luKHhsaSAtIGcyMikgKyBkMzIxMCAqIE1hdGguc2luKHhvbWkgKyB4bGkgLSBnMzIpICsgZDMyMjIgKiBNYXRoLnNpbigteG9taSArIHhsaSAtIGczMikgKyBkNDQxMCAqIE1hdGguc2luKHgyb21pICsgeDJsaSAtIGc0NCkgKyBkNDQyMiAqIE1hdGguc2luKHgybGkgLSBnNDQpICsgZDUyMjAgKiBNYXRoLnNpbih4b21pICsgeGxpIC0gZzUyKSArIGQ1MjMyICogTWF0aC5zaW4oLXhvbWkgKyB4bGkgLSBnNTIpICsgZDU0MjEgKiBNYXRoLnNpbih4b21pICsgeDJsaSAtIGc1NCkgKyBkNTQzMyAqIE1hdGguc2luKC14b21pICsgeDJsaSAtIGc1NCk7XG4gICAgICAgIHhsZG90ID0geG5pICsgeGZhY3Q7XG4gICAgICAgIHhuZGR0ID0gZDIyMDEgKiBNYXRoLmNvcyh4Mm9taSArIHhsaSAtIGcyMikgKyBkMjIxMSAqIE1hdGguY29zKHhsaSAtIGcyMikgKyBkMzIxMCAqIE1hdGguY29zKHhvbWkgKyB4bGkgLSBnMzIpICsgZDMyMjIgKiBNYXRoLmNvcygteG9taSArIHhsaSAtIGczMikgKyBkNTIyMCAqIE1hdGguY29zKHhvbWkgKyB4bGkgLSBnNTIpICsgZDUyMzIgKiBNYXRoLmNvcygteG9taSArIHhsaSAtIGc1MikgKyAyLjAgKiBkNDQxMCAqIE1hdGguY29zKHgyb21pICsgeDJsaSAtIGc0NCkgKyBkNDQyMiAqIE1hdGguY29zKHgybGkgLSBnNDQpICsgZDU0MjEgKiBNYXRoLmNvcyh4b21pICsgeDJsaSAtIGc1NCkgKyBkNTQzMyAqIE1hdGguY29zKC14b21pICsgeDJsaSAtIGc1NCk7XG4gICAgICAgIHhuZGR0ICo9IHhsZG90O1xuICAgICAgfSAvLyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gaW50ZWdyYXRvciAtLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyAgc2dwNGZpeCBtb3ZlIGVuZCBjaGVja3MgdG8gZW5kIG9mIHJvdXRpbmVcblxuXG4gICAgICBpZiAoTWF0aC5hYnModCAtIGF0aW1lKSA+PSBzdGVwcCkge1xuICAgICAgICBpcmV0biA9IDM4MTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ0ID0gdCAtIGF0aW1lO1xuICAgICAgICBpcmV0biA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChpcmV0biA9PT0gMzgxKSB7XG4gICAgICAgIHhsaSArPSB4bGRvdCAqIGRlbHQgKyB4bmR0ICogc3RlcDI7XG4gICAgICAgIHhuaSArPSB4bmR0ICogZGVsdCArIHhuZGR0ICogc3RlcDI7XG4gICAgICAgIGF0aW1lICs9IGRlbHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbm0gPSB4bmkgKyB4bmR0ICogZnQgKyB4bmRkdCAqIGZ0ICogZnQgKiAwLjU7XG4gICAgeGwgPSB4bGkgKyB4bGRvdCAqIGZ0ICsgeG5kdCAqIGZ0ICogZnQgKiAwLjU7XG5cbiAgICBpZiAoaXJleiAhPT0gMSkge1xuICAgICAgbW0gPSB4bCAtIDIuMCAqIG5vZGVtICsgMi4wICogdGhldGE7XG4gICAgICBkbmR0ID0gbm0gLSBubztcbiAgICB9IGVsc2Uge1xuICAgICAgbW0gPSB4bCAtIG5vZGVtIC0gYXJncG0gKyB0aGV0YTtcbiAgICAgIGRuZHQgPSBubSAtIG5vO1xuICAgIH1cblxuICAgIG5tID0gbm8gKyBkbmR0O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBhdGltZTogYXRpbWUsXG4gICAgZW06IGVtLFxuICAgIGFyZ3BtOiBhcmdwbSxcbiAgICBpbmNsbTogaW5jbG0sXG4gICAgeGxpOiB4bGksXG4gICAgbW06IG1tLFxuICAgIHhuaTogeG5pLFxuICAgIG5vZGVtOiBub2RlbSxcbiAgICBkbmR0OiBkbmR0LFxuICAgIG5tOiBubVxuICB9O1xufVxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZHVyZSBzZ3A0XG4gKlxuICogIHRoaXMgcHJvY2VkdXJlIGlzIHRoZSBzZ3A0IHByZWRpY3Rpb24gbW9kZWwgZnJvbSBzcGFjZSBjb21tYW5kLiB0aGlzIGlzIGFuXG4gKiAgICB1cGRhdGVkIGFuZCBjb21iaW5lZCB2ZXJzaW9uIG9mIHNncDQgYW5kIHNkcDQsIHdoaWNoIHdlcmUgb3JpZ2luYWxseVxuICogICAgcHVibGlzaGVkIHNlcGFyYXRlbHkgaW4gc3BhY2V0cmFjayByZXBvcnQgLy8zLiB0aGlzIHZlcnNpb24gZm9sbG93cyB0aGVcbiAqICAgIG1ldGhvZG9sb2d5IGZyb20gdGhlIGFpYWEgcGFwZXIgKDIwMDYpIGRlc2NyaWJpbmcgdGhlIGhpc3RvcnkgYW5kXG4gKiAgICBkZXZlbG9wbWVudCBvZiB0aGUgY29kZS5cbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAyOCBqdW4gMjAwNVxuICpcbiAqICBpbnB1dHMgICAgICAgIDpcbiAqICAgIHNhdHJlYyAgLSBpbml0aWFsaXNlZCBzdHJ1Y3R1cmUgZnJvbSBzZ3A0aW5pdCgpIGNhbGwuXG4gKiAgICB0c2luY2UgIC0gdGltZSBzaW5jZSBlcG9jaCAobWludXRlcylcbiAqXG4gKiAgb3V0cHV0cyAgICAgICA6XG4gKiAgICByICAgICAgICAgICAtIHBvc2l0aW9uIHZlY3RvciAgICAgICAgICAgICAgICAgICAgIGttXG4gKiAgICB2ICAgICAgICAgICAtIHZlbG9jaXR5ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGttL3NlY1xuICogIHJldHVybiBjb2RlIC0gbm9uLXplcm8gb24gZXJyb3IuXG4gKiAgICAgICAgICAgICAgICAgICAxIC0gbWVhbiBlbGVtZW50cywgZWNjID49IDEuMCBvciBlY2MgPCAtMC4wMDEgb3IgYSA8IDAuOTUgZXJcbiAqICAgICAgICAgICAgICAgICAgIDIgLSBtZWFuIG1vdGlvbiBsZXNzIHRoYW4gMC4wXG4gKiAgICAgICAgICAgICAgICAgICAzIC0gcGVydCBlbGVtZW50cywgZWNjIDwgMC4wICBvciAgZWNjID4gMS4wXG4gKiAgICAgICAgICAgICAgICAgICA0IC0gc2VtaS1sYXR1cyByZWN0dW0gPCAwLjBcbiAqICAgICAgICAgICAgICAgICAgIDUgLSBlcG9jaCBlbGVtZW50cyBhcmUgc3ViLW9yYml0YWxcbiAqICAgICAgICAgICAgICAgICAgIDYgLSBzYXRlbGxpdGUgaGFzIGRlY2F5ZWRcbiAqXG4gKiAgbG9jYWxzICAgICAgICA6XG4gKiAgICBhbSAgICAgICAgICAtXG4gKiAgICBheG5sLCBheW5sICAgICAgICAtXG4gKiAgICBiZXRhbCAgICAgICAtXG4gKiAgICBjb3NpbSAgICwgc2luaW0gICAsIGNvc29tbSAgLCBzaW5vbW0gICwgY25vZCAgICAsIHNub2QgICAgLCBjb3MydSAgICxcbiAqICAgIHNpbjJ1ICAgLCBjb3NlbzEgICwgc2luZW8xICAsIGNvc2kgICAgLCBzaW5pICAgICwgY29zaXAgICAsIHNpbmlwICAgLFxuICogICAgY29zaXNxICAsIGNvc3N1ICAgLCBzaW5zdSAgICwgY29zdSAgICAsIHNpbnVcbiAqICAgIGRlbG0gICAgICAgIC1cbiAqICAgIGRlbG9tZyAgICAgIC1cbiAqICAgIGRuZHQgICAgICAgIC1cbiAqICAgIGVjY20gICAgICAgIC1cbiAqICAgIGVtc3EgICAgICAgIC1cbiAqICAgIGVjb3NlICAgICAgIC1cbiAqICAgIGVsMiAgICAgICAgIC1cbiAqICAgIGVvMSAgICAgICAgIC1cbiAqICAgIGVjY3AgICAgICAgIC1cbiAqICAgIGVzaW5lICAgICAgIC1cbiAqICAgIGFyZ3BtICAgICAgIC1cbiAqICAgIGFyZ3BwICAgICAgIC1cbiAqICAgIG9tZ2FkZiAgICAgIC1cbiAqICAgIHBsICAgICAgICAgIC1cbiAqICAgIHIgICAgICAgICAgIC1cbiAqICAgIHJ0ZW1zcSAgICAgIC1cbiAqICAgIHJkb3RsICAgICAgIC1cbiAqICAgIHJsICAgICAgICAgIC1cbiAqICAgIHJ2ZG90ICAgICAgIC1cbiAqICAgIHJ2ZG90bCAgICAgIC1cbiAqICAgIHN1ICAgICAgICAgIC1cbiAqICAgIHQyICAsIHQzICAgLCB0NCAgICAsIHRjXG4gKiAgICB0ZW01LCB0ZW1wICwgdGVtcDEgLCB0ZW1wMiAgLCB0ZW1wYSAgLCB0ZW1wZSAgLCB0ZW1wbFxuICogICAgdSAgICwgdXggICAsIHV5ICAgICwgdXogICAgICwgdnggICAgICwgdnkgICAgICwgdnpcbiAqICAgIGluY2xtICAgICAgIC0gaW5jbGluYXRpb25cbiAqICAgIG1tICAgICAgICAgIC0gbWVhbiBhbm9tYWx5XG4gKiAgICBubSAgICAgICAgICAtIG1lYW4gbW90aW9uXG4gKiAgICBub2RlbSAgICAgICAtIHJpZ2h0IGFzYyBvZiBhc2NlbmRpbmcgbm9kZVxuICogICAgeGluYyAgICAgICAgLVxuICogICAgeGluY3AgICAgICAgLVxuICogICAgeGwgICAgICAgICAgLVxuICogICAgeGxtICAgICAgICAgLVxuICogICAgbXAgICAgICAgICAgLVxuICogICAgeG1kZiAgICAgICAgLVxuICogICAgeG14ICAgICAgICAgLVxuICogICAgeG15ICAgICAgICAgLVxuICogICAgbm9kZWRmICAgICAgLVxuICogICAgeG5vZGUgICAgICAgLVxuICogICAgbm9kZXAgICAgICAgLVxuICogICAgbnAgICAgICAgICAgLVxuICpcbiAqICBjb3VwbGluZyAgICAgIDpcbiAqICAgIGdldGdyYXZjb25zdC1cbiAqICAgIGRwcGVyXG4gKiAgICBkc3BhY2VcbiAqXG4gKiAgcmVmZXJlbmNlcyAgICA6XG4gKiAgICBob290cywgcm9laHJpY2gsIG5vcmFkIHNwYWNldHJhY2sgcmVwb3J0IC8vMyAxOTgwXG4gKiAgICBob290cywgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgLy82IDE5ODZcbiAqICAgIGhvb3RzLCBzY2h1bWFjaGVyIGFuZCBnbG92ZXIgMjAwNFxuICogICAgdmFsbGFkbywgY3Jhd2ZvcmQsIGh1anNhaywga2Vsc28gIDIwMDZcbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG5mdW5jdGlvbiBzZ3A0KHNhdHJlYywgdHNpbmNlKSB7XG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG4gIHZhciBjb3NlbzE7XG4gIHZhciBzaW5lbzE7XG4gIHZhciBjb3NpcDtcbiAgdmFyIHNpbmlwO1xuICB2YXIgY29zaXNxO1xuICB2YXIgZGVsbTtcbiAgdmFyIGRlbG9tZztcbiAgdmFyIGVvMTtcbiAgdmFyIGFyZ3BtO1xuICB2YXIgYXJncHA7XG4gIHZhciBzdTtcbiAgdmFyIHQzO1xuICB2YXIgdDQ7XG4gIHZhciB0YztcbiAgdmFyIHRlbTU7XG4gIHZhciB0ZW1wO1xuICB2YXIgdGVtcGE7XG4gIHZhciB0ZW1wZTtcbiAgdmFyIHRlbXBsO1xuICB2YXIgaW5jbG07XG4gIHZhciBtbTtcbiAgdmFyIG5tO1xuICB2YXIgbm9kZW07XG4gIHZhciB4aW5jcDtcbiAgdmFyIHhsbTtcbiAgdmFyIG1wO1xuICB2YXIgbm9kZXA7XG4gIC8qIC0tLS0tLS0tLS0tLS0tLS0tLSBzZXQgbWF0aGVtYXRpY2FsIGNvbnN0YW50cyAtLS0tLS0tLS0tLS0tLS0gKi9cbiAgLy8gc2dwNGZpeCBkaXZpc29yIGZvciBkaXZpZGUgYnkgemVybyBjaGVjayBvbiBpbmNsaW5hdGlvblxuICAvLyB0aGUgb2xkIGNoZWNrIHVzZWQgMS4wICsgY29zKHBpLTEuMGUtOSksIGJ1dCB0aGVuIGNvbXBhcmVkIGl0IHRvXG4gIC8vIDEuNSBlLTEyLCBzbyB0aGUgdGhyZXNob2xkIHdhcyBjaGFuZ2VkIHRvIDEuNWUtMTIgZm9yIGNvbnNpc3RlbmN5XG5cbiAgdmFyIHRlbXA0ID0gMS41ZS0xMjsgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGNsZWFyIHNncDQgZXJyb3IgZmxhZyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNhdHJlYy50ID0gdHNpbmNlO1xuICBzYXRyZWMuZXJyb3IgPSAwOyAvLyAgLS0tLS0tLSB1cGRhdGUgZm9yIHNlY3VsYXIgZ3Jhdml0eSBhbmQgYXRtb3NwaGVyaWMgZHJhZyAtLS0tLVxuXG4gIHZhciB4bWRmID0gc2F0cmVjLm1vICsgc2F0cmVjLm1kb3QgKiBzYXRyZWMudDtcbiAgdmFyIGFyZ3BkZiA9IHNhdHJlYy5hcmdwbyArIHNhdHJlYy5hcmdwZG90ICogc2F0cmVjLnQ7XG4gIHZhciBub2RlZGYgPSBzYXRyZWMubm9kZW8gKyBzYXRyZWMubm9kZWRvdCAqIHNhdHJlYy50O1xuICBhcmdwbSA9IGFyZ3BkZjtcbiAgbW0gPSB4bWRmO1xuICB2YXIgdDIgPSBzYXRyZWMudCAqIHNhdHJlYy50O1xuICBub2RlbSA9IG5vZGVkZiArIHNhdHJlYy5ub2RlY2YgKiB0MjtcbiAgdGVtcGEgPSAxLjAgLSBzYXRyZWMuY2MxICogc2F0cmVjLnQ7XG4gIHRlbXBlID0gc2F0cmVjLmJzdGFyICogc2F0cmVjLmNjNCAqIHNhdHJlYy50O1xuICB0ZW1wbCA9IHNhdHJlYy50MmNvZiAqIHQyO1xuXG4gIGlmIChzYXRyZWMuaXNpbXAgIT09IDEpIHtcbiAgICBkZWxvbWcgPSBzYXRyZWMub21nY29mICogc2F0cmVjLnQ7IC8vICBzZ3A0Zml4IHVzZSBtdXRsaXBseSBmb3Igc3BlZWQgaW5zdGVhZCBvZiBwb3dcblxuICAgIHZhciBkZWxtdGVtcCA9IDEuMCArIHNhdHJlYy5ldGEgKiBNYXRoLmNvcyh4bWRmKTtcbiAgICBkZWxtID0gc2F0cmVjLnhtY29mICogKGRlbG10ZW1wICogZGVsbXRlbXAgKiBkZWxtdGVtcCAtIHNhdHJlYy5kZWxtbyk7XG4gICAgdGVtcCA9IGRlbG9tZyArIGRlbG07XG4gICAgbW0gPSB4bWRmICsgdGVtcDtcbiAgICBhcmdwbSA9IGFyZ3BkZiAtIHRlbXA7XG4gICAgdDMgPSB0MiAqIHNhdHJlYy50O1xuICAgIHQ0ID0gdDMgKiBzYXRyZWMudDtcbiAgICB0ZW1wYSA9IHRlbXBhIC0gc2F0cmVjLmQyICogdDIgLSBzYXRyZWMuZDMgKiB0MyAtIHNhdHJlYy5kNCAqIHQ0O1xuICAgIHRlbXBlICs9IHNhdHJlYy5ic3RhciAqIHNhdHJlYy5jYzUgKiAoTWF0aC5zaW4obW0pIC0gc2F0cmVjLnNpbm1hbyk7XG4gICAgdGVtcGwgPSB0ZW1wbCArIHNhdHJlYy50M2NvZiAqIHQzICsgdDQgKiAoc2F0cmVjLnQ0Y29mICsgc2F0cmVjLnQgKiBzYXRyZWMudDVjb2YpO1xuICB9XG5cbiAgbm0gPSBzYXRyZWMubm87XG4gIHZhciBlbSA9IHNhdHJlYy5lY2NvO1xuICBpbmNsbSA9IHNhdHJlYy5pbmNsbztcblxuICBpZiAoc2F0cmVjLm1ldGhvZCA9PT0gJ2QnKSB7XG4gICAgdGMgPSBzYXRyZWMudDtcbiAgICB2YXIgZHNwYWNlT3B0aW9ucyA9IHtcbiAgICAgIGlyZXo6IHNhdHJlYy5pcmV6LFxuICAgICAgZDIyMDE6IHNhdHJlYy5kMjIwMSxcbiAgICAgIGQyMjExOiBzYXRyZWMuZDIyMTEsXG4gICAgICBkMzIxMDogc2F0cmVjLmQzMjEwLFxuICAgICAgZDMyMjI6IHNhdHJlYy5kMzIyMixcbiAgICAgIGQ0NDEwOiBzYXRyZWMuZDQ0MTAsXG4gICAgICBkNDQyMjogc2F0cmVjLmQ0NDIyLFxuICAgICAgZDUyMjA6IHNhdHJlYy5kNTIyMCxcbiAgICAgIGQ1MjMyOiBzYXRyZWMuZDUyMzIsXG4gICAgICBkNTQyMTogc2F0cmVjLmQ1NDIxLFxuICAgICAgZDU0MzM6IHNhdHJlYy5kNTQzMyxcbiAgICAgIGRlZHQ6IHNhdHJlYy5kZWR0LFxuICAgICAgZGVsMTogc2F0cmVjLmRlbDEsXG4gICAgICBkZWwyOiBzYXRyZWMuZGVsMixcbiAgICAgIGRlbDM6IHNhdHJlYy5kZWwzLFxuICAgICAgZGlkdDogc2F0cmVjLmRpZHQsXG4gICAgICBkbWR0OiBzYXRyZWMuZG1kdCxcbiAgICAgIGRub2R0OiBzYXRyZWMuZG5vZHQsXG4gICAgICBkb21kdDogc2F0cmVjLmRvbWR0LFxuICAgICAgYXJncG86IHNhdHJlYy5hcmdwbyxcbiAgICAgIGFyZ3Bkb3Q6IHNhdHJlYy5hcmdwZG90LFxuICAgICAgdDogc2F0cmVjLnQsXG4gICAgICB0YzogdGMsXG4gICAgICBnc3RvOiBzYXRyZWMuZ3N0byxcbiAgICAgIHhmYWN0OiBzYXRyZWMueGZhY3QsXG4gICAgICB4bGFtbzogc2F0cmVjLnhsYW1vLFxuICAgICAgbm86IHNhdHJlYy5ubyxcbiAgICAgIGF0aW1lOiBzYXRyZWMuYXRpbWUsXG4gICAgICBlbTogZW0sXG4gICAgICBhcmdwbTogYXJncG0sXG4gICAgICBpbmNsbTogaW5jbG0sXG4gICAgICB4bGk6IHNhdHJlYy54bGksXG4gICAgICBtbTogbW0sXG4gICAgICB4bmk6IHNhdHJlYy54bmksXG4gICAgICBub2RlbTogbm9kZW0sXG4gICAgICBubTogbm1cbiAgICB9O1xuICAgIHZhciBkc3BhY2VSZXN1bHQgPSBkc3BhY2UoZHNwYWNlT3B0aW9ucyk7XG4gICAgZW0gPSBkc3BhY2VSZXN1bHQuZW07XG4gICAgYXJncG0gPSBkc3BhY2VSZXN1bHQuYXJncG07XG4gICAgaW5jbG0gPSBkc3BhY2VSZXN1bHQuaW5jbG07XG4gICAgbW0gPSBkc3BhY2VSZXN1bHQubW07XG4gICAgbm9kZW0gPSBkc3BhY2VSZXN1bHQubm9kZW07XG4gICAgbm0gPSBkc3BhY2VSZXN1bHQubm07XG4gIH1cblxuICBpZiAobm0gPD0gMC4wKSB7XG4gICAgLy8gcHJpbnRmKFwiLy8gZXJyb3Igbm0gJWZcXG5cIiwgbm0pO1xuICAgIHNhdHJlYy5lcnJvciA9IDI7IC8vIHNncDRmaXggYWRkIHJldHVyblxuXG4gICAgcmV0dXJuIFtmYWxzZSwgZmFsc2VdO1xuICB9XG5cbiAgdmFyIGFtID0gTWF0aC5wb3coeGtlIC8gbm0sIHgybzMpICogdGVtcGEgKiB0ZW1wYTtcbiAgbm0gPSB4a2UgLyBNYXRoLnBvdyhhbSwgMS41KTtcbiAgZW0gLT0gdGVtcGU7IC8vIGZpeCB0b2xlcmFuY2UgZm9yIGVycm9yIHJlY29nbml0aW9uXG4gIC8vIHNncDRmaXggYW0gaXMgZml4ZWQgZnJvbSB0aGUgcHJldmlvdXMgbm0gY2hlY2tcblxuICBpZiAoZW0gPj0gMS4wIHx8IGVtIDwgLTAuMDAxKSB7XG4gICAgLy8gfHwgKGFtIDwgMC45NSlcbiAgICAvLyBwcmludGYoXCIvLyBlcnJvciBlbSAlZlxcblwiLCBlbSk7XG4gICAgc2F0cmVjLmVycm9yID0gMTsgLy8gc2dwNGZpeCB0byByZXR1cm4gaWYgdGhlcmUgaXMgYW4gZXJyb3IgaW4gZWNjZW50cmljaXR5XG5cbiAgICByZXR1cm4gW2ZhbHNlLCBmYWxzZV07XG4gIH0gLy8gIHNncDRmaXggZml4IHRvbGVyYW5jZSB0byBhdm9pZCBhIGRpdmlkZSBieSB6ZXJvXG5cblxuICBpZiAoZW0gPCAxLjBlLTYpIHtcbiAgICBlbSA9IDEuMGUtNjtcbiAgfVxuXG4gIG1tICs9IHNhdHJlYy5ubyAqIHRlbXBsO1xuICB4bG0gPSBtbSArIGFyZ3BtICsgbm9kZW07XG4gIG5vZGVtICU9IHR3b1BpO1xuICBhcmdwbSAlPSB0d29QaTtcbiAgeGxtICU9IHR3b1BpO1xuICBtbSA9ICh4bG0gLSBhcmdwbSAtIG5vZGVtKSAlIHR3b1BpOyAvLyAtLS0tLS0tLS0tLS0tLS0tLSBjb21wdXRlIGV4dHJhIG1lYW4gcXVhbnRpdGllcyAtLS0tLS0tLS0tLS0tXG5cbiAgdmFyIHNpbmltID0gTWF0aC5zaW4oaW5jbG0pO1xuICB2YXIgY29zaW0gPSBNYXRoLmNvcyhpbmNsbSk7IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tIGFkZCBsdW5hci1zb2xhciBwZXJpb2RpY3MgLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgZXAgPSBlbTtcbiAgeGluY3AgPSBpbmNsbTtcbiAgYXJncHAgPSBhcmdwbTtcbiAgbm9kZXAgPSBub2RlbTtcbiAgbXAgPSBtbTtcbiAgc2luaXAgPSBzaW5pbTtcbiAgY29zaXAgPSBjb3NpbTtcblxuICBpZiAoc2F0cmVjLm1ldGhvZCA9PT0gJ2QnKSB7XG4gICAgdmFyIGRwcGVyUGFyYW1ldGVycyA9IHtcbiAgICAgIGluY2xvOiBzYXRyZWMuaW5jbG8sXG4gICAgICBpbml0OiAnbicsXG4gICAgICBlcDogZXAsXG4gICAgICBpbmNscDogeGluY3AsXG4gICAgICBub2RlcDogbm9kZXAsXG4gICAgICBhcmdwcDogYXJncHAsXG4gICAgICBtcDogbXAsXG4gICAgICBvcHNtb2RlOiBzYXRyZWMub3BlcmF0aW9ubW9kZVxuICAgIH07XG4gICAgdmFyIGRwcGVyUmVzdWx0ID0gZHBwZXIoc2F0cmVjLCBkcHBlclBhcmFtZXRlcnMpO1xuICAgIGVwID0gZHBwZXJSZXN1bHQuZXA7XG4gICAgbm9kZXAgPSBkcHBlclJlc3VsdC5ub2RlcDtcbiAgICBhcmdwcCA9IGRwcGVyUmVzdWx0LmFyZ3BwO1xuICAgIG1wID0gZHBwZXJSZXN1bHQubXA7XG4gICAgeGluY3AgPSBkcHBlclJlc3VsdC5pbmNscDtcblxuICAgIGlmICh4aW5jcCA8IDAuMCkge1xuICAgICAgeGluY3AgPSAteGluY3A7XG4gICAgICBub2RlcCArPSBwaTtcbiAgICAgIGFyZ3BwIC09IHBpO1xuICAgIH1cblxuICAgIGlmIChlcCA8IDAuMCB8fCBlcCA+IDEuMCkge1xuICAgICAgLy8gIHByaW50ZihcIi8vIGVycm9yIGVwICVmXFxuXCIsIGVwKTtcbiAgICAgIHNhdHJlYy5lcnJvciA9IDM7IC8vICBzZ3A0Zml4IGFkZCByZXR1cm5cblxuICAgICAgcmV0dXJuIFtmYWxzZSwgZmFsc2VdO1xuICAgIH1cbiAgfSAvLyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0gbG9uZyBwZXJpb2QgcGVyaW9kaWNzIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbiAgaWYgKHNhdHJlYy5tZXRob2QgPT09ICdkJykge1xuICAgIHNpbmlwID0gTWF0aC5zaW4oeGluY3ApO1xuICAgIGNvc2lwID0gTWF0aC5jb3MoeGluY3ApO1xuICAgIHNhdHJlYy5heWNvZiA9IC0wLjUgKiBqM29qMiAqIHNpbmlwOyAvLyAgc2dwNGZpeCBmb3IgZGl2aWRlIGJ5IHplcm8gZm9yIHhpbmNwID0gMTgwIGRlZ1xuXG4gICAgaWYgKE1hdGguYWJzKGNvc2lwICsgMS4wKSA+IDEuNWUtMTIpIHtcbiAgICAgIHNhdHJlYy54bGNvZiA9IC0wLjI1ICogajNvajIgKiBzaW5pcCAqICgzLjAgKyA1LjAgKiBjb3NpcCkgLyAoMS4wICsgY29zaXApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzYXRyZWMueGxjb2YgPSAtMC4yNSAqIGozb2oyICogc2luaXAgKiAoMy4wICsgNS4wICogY29zaXApIC8gdGVtcDQ7XG4gICAgfVxuICB9XG5cbiAgdmFyIGF4bmwgPSBlcCAqIE1hdGguY29zKGFyZ3BwKTtcbiAgdGVtcCA9IDEuMCAvIChhbSAqICgxLjAgLSBlcCAqIGVwKSk7XG4gIHZhciBheW5sID0gZXAgKiBNYXRoLnNpbihhcmdwcCkgKyB0ZW1wICogc2F0cmVjLmF5Y29mO1xuICB2YXIgeGwgPSBtcCArIGFyZ3BwICsgbm9kZXAgKyB0ZW1wICogc2F0cmVjLnhsY29mICogYXhubDsgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHNvbHZlIGtlcGxlcidzIGVxdWF0aW9uIC0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciB1ID0gKHhsIC0gbm9kZXApICUgdHdvUGk7XG4gIGVvMSA9IHU7XG4gIHRlbTUgPSA5OTk5Ljk7XG4gIHZhciBrdHIgPSAxOyAvLyAgICBzZ3A0Zml4IGZvciBrZXBsZXIgaXRlcmF0aW9uXG4gIC8vICAgIHRoZSBmb2xsb3dpbmcgaXRlcmF0aW9uIG5lZWRzIGJldHRlciBsaW1pdHMgb24gY29ycmVjdGlvbnNcblxuICB3aGlsZSAoTWF0aC5hYnModGVtNSkgPj0gMS4wZS0xMiAmJiBrdHIgPD0gMTApIHtcbiAgICBzaW5lbzEgPSBNYXRoLnNpbihlbzEpO1xuICAgIGNvc2VvMSA9IE1hdGguY29zKGVvMSk7XG4gICAgdGVtNSA9IDEuMCAtIGNvc2VvMSAqIGF4bmwgLSBzaW5lbzEgKiBheW5sO1xuICAgIHRlbTUgPSAodSAtIGF5bmwgKiBjb3NlbzEgKyBheG5sICogc2luZW8xIC0gZW8xKSAvIHRlbTU7XG5cbiAgICBpZiAoTWF0aC5hYnModGVtNSkgPj0gMC45NSkge1xuICAgICAgaWYgKHRlbTUgPiAwLjApIHtcbiAgICAgICAgdGVtNSA9IDAuOTU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZW01ID0gLTAuOTU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZW8xICs9IHRlbTU7XG4gICAga3RyICs9IDE7XG4gIH0gLy8gIC0tLS0tLS0tLS0tLS0gc2hvcnQgcGVyaW9kIHByZWxpbWluYXJ5IHF1YW50aXRpZXMgLS0tLS0tLS0tLS1cblxuXG4gIHZhciBlY29zZSA9IGF4bmwgKiBjb3NlbzEgKyBheW5sICogc2luZW8xO1xuICB2YXIgZXNpbmUgPSBheG5sICogc2luZW8xIC0gYXlubCAqIGNvc2VvMTtcbiAgdmFyIGVsMiA9IGF4bmwgKiBheG5sICsgYXlubCAqIGF5bmw7XG4gIHZhciBwbCA9IGFtICogKDEuMCAtIGVsMik7XG5cbiAgaWYgKHBsIDwgMC4wKSB7XG4gICAgLy8gIHByaW50ZihcIi8vIGVycm9yIHBsICVmXFxuXCIsIHBsKTtcbiAgICBzYXRyZWMuZXJyb3IgPSA0OyAvLyAgc2dwNGZpeCBhZGQgcmV0dXJuXG5cbiAgICByZXR1cm4gW2ZhbHNlLCBmYWxzZV07XG4gIH1cblxuICB2YXIgcmwgPSBhbSAqICgxLjAgLSBlY29zZSk7XG4gIHZhciByZG90bCA9IE1hdGguc3FydChhbSkgKiBlc2luZSAvIHJsO1xuICB2YXIgcnZkb3RsID0gTWF0aC5zcXJ0KHBsKSAvIHJsO1xuICB2YXIgYmV0YWwgPSBNYXRoLnNxcnQoMS4wIC0gZWwyKTtcbiAgdGVtcCA9IGVzaW5lIC8gKDEuMCArIGJldGFsKTtcbiAgdmFyIHNpbnUgPSBhbSAvIHJsICogKHNpbmVvMSAtIGF5bmwgLSBheG5sICogdGVtcCk7XG4gIHZhciBjb3N1ID0gYW0gLyBybCAqIChjb3NlbzEgLSBheG5sICsgYXlubCAqIHRlbXApO1xuICBzdSA9IE1hdGguYXRhbjIoc2ludSwgY29zdSk7XG4gIHZhciBzaW4ydSA9IChjb3N1ICsgY29zdSkgKiBzaW51O1xuICB2YXIgY29zMnUgPSAxLjAgLSAyLjAgKiBzaW51ICogc2ludTtcbiAgdGVtcCA9IDEuMCAvIHBsO1xuICB2YXIgdGVtcDEgPSAwLjUgKiBqMiAqIHRlbXA7XG4gIHZhciB0ZW1wMiA9IHRlbXAxICogdGVtcDsgLy8gLS0tLS0tLS0tLS0tLS0gdXBkYXRlIGZvciBzaG9ydCBwZXJpb2QgcGVyaW9kaWNzIC0tLS0tLS0tLS0tLVxuXG4gIGlmIChzYXRyZWMubWV0aG9kID09PSAnZCcpIHtcbiAgICBjb3Npc3EgPSBjb3NpcCAqIGNvc2lwO1xuICAgIHNhdHJlYy5jb240MSA9IDMuMCAqIGNvc2lzcSAtIDEuMDtcbiAgICBzYXRyZWMueDFtdGgyID0gMS4wIC0gY29zaXNxO1xuICAgIHNhdHJlYy54N3RobTEgPSA3LjAgKiBjb3Npc3EgLSAxLjA7XG4gIH1cblxuICB2YXIgbXJ0ID0gcmwgKiAoMS4wIC0gMS41ICogdGVtcDIgKiBiZXRhbCAqIHNhdHJlYy5jb240MSkgKyAwLjUgKiB0ZW1wMSAqIHNhdHJlYy54MW10aDIgKiBjb3MydTsgLy8gc2dwNGZpeCBmb3IgZGVjYXlpbmcgc2F0ZWxsaXRlc1xuXG4gIGlmIChtcnQgPCAxLjApIHtcbiAgICAvLyBwcmludGYoXCIvLyBkZWNheSBjb25kaXRpb24gJTExLjZmIFxcblwiLG1ydCk7XG4gICAgc2F0cmVjLmVycm9yID0gNjtcbiAgICByZXR1cm4ge1xuICAgICAgcG9zaXRpb246IGZhbHNlLFxuICAgICAgdmVsb2NpdHk6IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIHN1IC09IDAuMjUgKiB0ZW1wMiAqIHNhdHJlYy54N3RobTEgKiBzaW4ydTtcbiAgdmFyIHhub2RlID0gbm9kZXAgKyAxLjUgKiB0ZW1wMiAqIGNvc2lwICogc2luMnU7XG4gIHZhciB4aW5jID0geGluY3AgKyAxLjUgKiB0ZW1wMiAqIGNvc2lwICogc2luaXAgKiBjb3MydTtcbiAgdmFyIG12dCA9IHJkb3RsIC0gbm0gKiB0ZW1wMSAqIHNhdHJlYy54MW10aDIgKiBzaW4ydSAvIHhrZTtcbiAgdmFyIHJ2ZG90ID0gcnZkb3RsICsgbm0gKiB0ZW1wMSAqIChzYXRyZWMueDFtdGgyICogY29zMnUgKyAxLjUgKiBzYXRyZWMuY29uNDEpIC8geGtlOyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gb3JpZW50YXRpb24gdmVjdG9ycyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIHNpbnN1ID0gTWF0aC5zaW4oc3UpO1xuICB2YXIgY29zc3UgPSBNYXRoLmNvcyhzdSk7XG4gIHZhciBzbm9kID0gTWF0aC5zaW4oeG5vZGUpO1xuICB2YXIgY25vZCA9IE1hdGguY29zKHhub2RlKTtcbiAgdmFyIHNpbmkgPSBNYXRoLnNpbih4aW5jKTtcbiAgdmFyIGNvc2kgPSBNYXRoLmNvcyh4aW5jKTtcbiAgdmFyIHhteCA9IC1zbm9kICogY29zaTtcbiAgdmFyIHhteSA9IGNub2QgKiBjb3NpO1xuICB2YXIgdXggPSB4bXggKiBzaW5zdSArIGNub2QgKiBjb3NzdTtcbiAgdmFyIHV5ID0geG15ICogc2luc3UgKyBzbm9kICogY29zc3U7XG4gIHZhciB1eiA9IHNpbmkgKiBzaW5zdTtcbiAgdmFyIHZ4ID0geG14ICogY29zc3UgLSBjbm9kICogc2luc3U7XG4gIHZhciB2eSA9IHhteSAqIGNvc3N1IC0gc25vZCAqIHNpbnN1O1xuICB2YXIgdnogPSBzaW5pICogY29zc3U7IC8vIC0tLS0tLS0tLSBwb3NpdGlvbiBhbmQgdmVsb2NpdHkgKGluIGttIGFuZCBrbS9zZWMpIC0tLS0tLS0tLS1cblxuICB2YXIgciA9IHtcbiAgICB4OiBtcnQgKiB1eCAqIGVhcnRoUmFkaXVzLFxuICAgIHk6IG1ydCAqIHV5ICogZWFydGhSYWRpdXMsXG4gICAgejogbXJ0ICogdXogKiBlYXJ0aFJhZGl1c1xuICB9O1xuICB2YXIgdiA9IHtcbiAgICB4OiAobXZ0ICogdXggKyBydmRvdCAqIHZ4KSAqIHZrbXBlcnNlYyxcbiAgICB5OiAobXZ0ICogdXkgKyBydmRvdCAqIHZ5KSAqIHZrbXBlcnNlYyxcbiAgICB6OiAobXZ0ICogdXogKyBydmRvdCAqIHZ6KSAqIHZrbXBlcnNlY1xuICB9O1xuICByZXR1cm4ge1xuICAgIHBvc2l0aW9uOiByLFxuICAgIHZlbG9jaXR5OiB2XG4gIH07XG4gIC8qIGVzbGludC1lbmFibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbn1cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VkdXJlIHNncDRpbml0XG4gKlxuICogIHRoaXMgcHJvY2VkdXJlIGluaXRpYWxpemVzIHZhcmlhYmxlcyBmb3Igc2dwNC5cbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAyOCBqdW4gMjAwNVxuICogIGF1dGhvciAgICAgICAgOiBkYXZpZCB2YWxsYWRvICAgICAgICAgICAgICAgICAgNzE5LTU3My0yNjAwICAgMjgganVuIDIwMDVcbiAqXG4gKiAgaW5wdXRzICAgICAgICA6XG4gKiAgICBvcHNtb2RlICAgICAtIG1vZGUgb2Ygb3BlcmF0aW9uIGFmc3BjIG9yIGltcHJvdmVkICdhJywgJ2knXG4gKiAgICBzYXRuICAgICAgICAtIHNhdGVsbGl0ZSBudW1iZXJcbiAqICAgIGJzdGFyICAgICAgIC0gc2dwNCB0eXBlIGRyYWcgY29lZmZpY2llbnQgICAgICAgICAgICAgIGtnL20yZXJcbiAqICAgIGVjY28gICAgICAgIC0gZWNjZW50cmljaXR5XG4gKiAgICBlcG9jaCAgICAgICAtIGVwb2NoIHRpbWUgaW4gZGF5cyBmcm9tIGphbiAwLCAxOTUwLiAwIGhyXG4gKiAgICBhcmdwbyAgICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWUgKG91dHB1dCBpZiBkcylcbiAqICAgIGluY2xvICAgICAgIC0gaW5jbGluYXRpb25cbiAqICAgIG1vICAgICAgICAgIC0gbWVhbiBhbm9tYWx5IChvdXRwdXQgaWYgZHMpXG4gKiAgICBubyAgICAgICAgICAtIG1lYW4gbW90aW9uXG4gKiAgICBub2RlbyAgICAgICAtIHJpZ2h0IGFzY2Vuc2lvbiBvZiBhc2NlbmRpbmcgbm9kZVxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIHJlYyAgICAgIC0gY29tbW9uIHZhbHVlcyBmb3Igc3Vic2VxdWVudCBjYWxsc1xuICogICAgcmV0dXJuIGNvZGUgLSBub24temVybyBvbiBlcnJvci5cbiAqICAgICAgICAgICAgICAgICAgIDEgLSBtZWFuIGVsZW1lbnRzLCBlY2MgPj0gMS4wIG9yIGVjYyA8IC0wLjAwMSBvciBhIDwgMC45NSBlclxuICogICAgICAgICAgICAgICAgICAgMiAtIG1lYW4gbW90aW9uIGxlc3MgdGhhbiAwLjBcbiAqICAgICAgICAgICAgICAgICAgIDMgLSBwZXJ0IGVsZW1lbnRzLCBlY2MgPCAwLjAgIG9yICBlY2MgPiAxLjBcbiAqICAgICAgICAgICAgICAgICAgIDQgLSBzZW1pLWxhdHVzIHJlY3R1bSA8IDAuMFxuICogICAgICAgICAgICAgICAgICAgNSAtIGVwb2NoIGVsZW1lbnRzIGFyZSBzdWItb3JiaXRhbFxuICogICAgICAgICAgICAgICAgICAgNiAtIHNhdGVsbGl0ZSBoYXMgZGVjYXllZFxuICpcbiAqICBsb2NhbHMgICAgICAgIDpcbiAqICAgIGNub2RtICAsIHNub2RtICAsIGNvc2ltICAsIHNpbmltICAsIGNvc29tbSAsIHNpbm9tbVxuICogICAgY2Mxc3EgICwgY2MyICAgICwgY2MzXG4gKiAgICBjb2VmICAgLCBjb2VmMVxuICogICAgY29zaW80ICAgICAgLVxuICogICAgZGF5ICAgICAgICAgLVxuICogICAgZG5kdCAgICAgICAgLVxuICogICAgZW0gICAgICAgICAgLSBlY2NlbnRyaWNpdHlcbiAqICAgIGVtc3EgICAgICAgIC0gZWNjZW50cmljaXR5IHNxdWFyZWRcbiAqICAgIGVldGEgICAgICAgIC1cbiAqICAgIGV0YXNxICAgICAgIC1cbiAqICAgIGdhbSAgICAgICAgIC1cbiAqICAgIGFyZ3BtICAgICAgIC0gYXJndW1lbnQgb2YgcGVyaWdlZVxuICogICAgbm9kZW0gICAgICAgLVxuICogICAgaW5jbG0gICAgICAgLSBpbmNsaW5hdGlvblxuICogICAgbW0gICAgICAgICAgLSBtZWFuIGFub21hbHlcbiAqICAgIG5tICAgICAgICAgIC0gbWVhbiBtb3Rpb25cbiAqICAgIHBlcmlnZSAgICAgIC0gcGVyaWdlZVxuICogICAgcGludnNxICAgICAgLVxuICogICAgcHNpc3EgICAgICAgLVxuICogICAgcXptczI0ICAgICAgLVxuICogICAgcnRlbXNxICAgICAgLVxuICogICAgczEsIHMyLCBzMywgczQsIHM1LCBzNiwgczcgICAgICAgICAgLVxuICogICAgc2ZvdXIgICAgICAgLVxuICogICAgc3MxLCBzczIsIHNzMywgc3M0LCBzczUsIHNzNiwgc3M3ICAgICAgICAgLVxuICogICAgc3oxLCBzejIsIHN6M1xuICogICAgc3oxMSwgc3oxMiwgc3oxMywgc3oyMSwgc3oyMiwgc3oyMywgc3ozMSwgc3ozMiwgc3ozMyAgICAgICAgLVxuICogICAgdGMgICAgICAgICAgLVxuICogICAgdGVtcCAgICAgICAgLVxuICogICAgdGVtcDEsIHRlbXAyLCB0ZW1wMyAgICAgICAtXG4gKiAgICB0c2kgICAgICAgICAtXG4gKiAgICB4cGlkb3QgICAgICAtXG4gKiAgICB4aGRvdDEgICAgICAtXG4gKiAgICB6MSwgejIsIHozICAgICAgICAgIC1cbiAqICAgIHoxMSwgejEyLCB6MTMsIHoyMSwgejIyLCB6MjMsIHozMSwgejMyLCB6MzMgICAgICAgICAtXG4gKlxuICogIGNvdXBsaW5nICAgICAgOlxuICogICAgZ2V0Z3JhdmNvbnN0LVxuICogICAgaW5pdGwgICAgICAgLVxuICogICAgZHNjb20gICAgICAgLVxuICogICAgZHBwZXIgICAgICAgLVxuICogICAgZHNpbml0ICAgICAgLVxuICogICAgc2dwNCAgICAgICAgLVxuICpcbiAqICByZWZlcmVuY2VzICAgIDpcbiAqICAgIGhvb3RzLCByb2VocmljaCwgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzMgMTk4MFxuICogICAgaG9vdHMsIG5vcmFkIHNwYWNldHJhY2sgcmVwb3J0ICM2IDE5ODZcbiAqICAgIGhvb3RzLCBzY2h1bWFjaGVyIGFuZCBnbG92ZXIgMjAwNFxuICogICAgdmFsbGFkbywgY3Jhd2ZvcmQsIGh1anNhaywga2Vsc28gIDIwMDZcbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG5mdW5jdGlvbiBzZ3A0aW5pdChzYXRyZWMsIG9wdGlvbnMpIHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbiAgdmFyIG9wc21vZGUgPSBvcHRpb25zLm9wc21vZGUsXG4gICAgICBzYXRuID0gb3B0aW9ucy5zYXRuLFxuICAgICAgZXBvY2ggPSBvcHRpb25zLmVwb2NoLFxuICAgICAgeGJzdGFyID0gb3B0aW9ucy54YnN0YXIsXG4gICAgICB4ZWNjbyA9IG9wdGlvbnMueGVjY28sXG4gICAgICB4YXJncG8gPSBvcHRpb25zLnhhcmdwbyxcbiAgICAgIHhpbmNsbyA9IG9wdGlvbnMueGluY2xvLFxuICAgICAgeG1vID0gb3B0aW9ucy54bW8sXG4gICAgICB4bm8gPSBvcHRpb25zLnhubyxcbiAgICAgIHhub2RlbyA9IG9wdGlvbnMueG5vZGVvO1xuICB2YXIgY29zaW07XG4gIHZhciBzaW5pbTtcbiAgdmFyIGNjMXNxO1xuICB2YXIgY2MyO1xuICB2YXIgY2MzO1xuICB2YXIgY29lZjtcbiAgdmFyIGNvZWYxO1xuICB2YXIgY29zaW80O1xuICB2YXIgZW07XG4gIHZhciBlbXNxO1xuICB2YXIgZWV0YTtcbiAgdmFyIGV0YXNxO1xuICB2YXIgYXJncG07XG4gIHZhciBub2RlbTtcbiAgdmFyIGluY2xtO1xuICB2YXIgbW07XG4gIHZhciBubTtcbiAgdmFyIHBlcmlnZTtcbiAgdmFyIHBpbnZzcTtcbiAgdmFyIHBzaXNxO1xuICB2YXIgcXptczI0O1xuICB2YXIgczE7XG4gIHZhciBzMjtcbiAgdmFyIHMzO1xuICB2YXIgczQ7XG4gIHZhciBzNTtcbiAgdmFyIHNmb3VyO1xuICB2YXIgc3MxO1xuICB2YXIgc3MyO1xuICB2YXIgc3MzO1xuICB2YXIgc3M0O1xuICB2YXIgc3M1O1xuICB2YXIgc3oxO1xuICB2YXIgc3ozO1xuICB2YXIgc3oxMTtcbiAgdmFyIHN6MTM7XG4gIHZhciBzejIxO1xuICB2YXIgc3oyMztcbiAgdmFyIHN6MzE7XG4gIHZhciBzejMzO1xuICB2YXIgdGM7XG4gIHZhciB0ZW1wO1xuICB2YXIgdGVtcDE7XG4gIHZhciB0ZW1wMjtcbiAgdmFyIHRlbXAzO1xuICB2YXIgdHNpO1xuICB2YXIgeHBpZG90O1xuICB2YXIgeGhkb3QxO1xuICB2YXIgejE7XG4gIHZhciB6MztcbiAgdmFyIHoxMTtcbiAgdmFyIHoxMztcbiAgdmFyIHoyMTtcbiAgdmFyIHoyMztcbiAgdmFyIHozMTtcbiAgdmFyIHozMztcbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGluaXRpYWxpemF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAvLyBzZ3A0Zml4IGRpdmlzb3IgZm9yIGRpdmlkZSBieSB6ZXJvIGNoZWNrIG9uIGluY2xpbmF0aW9uXG4gIC8vIHRoZSBvbGQgY2hlY2sgdXNlZCAxLjAgKyBNYXRoLmNvcyhwaS0xLjBlLTkpLCBidXQgdGhlbiBjb21wYXJlZCBpdCB0b1xuICAvLyAxLjUgZS0xMiwgc28gdGhlIHRocmVzaG9sZCB3YXMgY2hhbmdlZCB0byAxLjVlLTEyIGZvciBjb25zaXN0ZW5jeVxuXG4gIHZhciB0ZW1wNCA9IDEuNWUtMTI7IC8vIC0tLS0tLS0tLS0tIHNldCBhbGwgbmVhciBlYXJ0aCB2YXJpYWJsZXMgdG8gemVybyAtLS0tLS0tLS0tLS1cblxuICBzYXRyZWMuaXNpbXAgPSAwO1xuICBzYXRyZWMubWV0aG9kID0gJ24nO1xuICBzYXRyZWMuYXljb2YgPSAwLjA7XG4gIHNhdHJlYy5jb240MSA9IDAuMDtcbiAgc2F0cmVjLmNjMSA9IDAuMDtcbiAgc2F0cmVjLmNjNCA9IDAuMDtcbiAgc2F0cmVjLmNjNSA9IDAuMDtcbiAgc2F0cmVjLmQyID0gMC4wO1xuICBzYXRyZWMuZDMgPSAwLjA7XG4gIHNhdHJlYy5kNCA9IDAuMDtcbiAgc2F0cmVjLmRlbG1vID0gMC4wO1xuICBzYXRyZWMuZXRhID0gMC4wO1xuICBzYXRyZWMuYXJncGRvdCA9IDAuMDtcbiAgc2F0cmVjLm9tZ2NvZiA9IDAuMDtcbiAgc2F0cmVjLnNpbm1hbyA9IDAuMDtcbiAgc2F0cmVjLnQgPSAwLjA7XG4gIHNhdHJlYy50MmNvZiA9IDAuMDtcbiAgc2F0cmVjLnQzY29mID0gMC4wO1xuICBzYXRyZWMudDRjb2YgPSAwLjA7XG4gIHNhdHJlYy50NWNvZiA9IDAuMDtcbiAgc2F0cmVjLngxbXRoMiA9IDAuMDtcbiAgc2F0cmVjLng3dGhtMSA9IDAuMDtcbiAgc2F0cmVjLm1kb3QgPSAwLjA7XG4gIHNhdHJlYy5ub2RlZG90ID0gMC4wO1xuICBzYXRyZWMueGxjb2YgPSAwLjA7XG4gIHNhdHJlYy54bWNvZiA9IDAuMDtcbiAgc2F0cmVjLm5vZGVjZiA9IDAuMDsgLy8gLS0tLS0tLS0tLS0gc2V0IGFsbCBkZWVwIHNwYWNlIHZhcmlhYmxlcyB0byB6ZXJvIC0tLS0tLS0tLS0tLVxuXG4gIHNhdHJlYy5pcmV6ID0gMDtcbiAgc2F0cmVjLmQyMjAxID0gMC4wO1xuICBzYXRyZWMuZDIyMTEgPSAwLjA7XG4gIHNhdHJlYy5kMzIxMCA9IDAuMDtcbiAgc2F0cmVjLmQzMjIyID0gMC4wO1xuICBzYXRyZWMuZDQ0MTAgPSAwLjA7XG4gIHNhdHJlYy5kNDQyMiA9IDAuMDtcbiAgc2F0cmVjLmQ1MjIwID0gMC4wO1xuICBzYXRyZWMuZDUyMzIgPSAwLjA7XG4gIHNhdHJlYy5kNTQyMSA9IDAuMDtcbiAgc2F0cmVjLmQ1NDMzID0gMC4wO1xuICBzYXRyZWMuZGVkdCA9IDAuMDtcbiAgc2F0cmVjLmRlbDEgPSAwLjA7XG4gIHNhdHJlYy5kZWwyID0gMC4wO1xuICBzYXRyZWMuZGVsMyA9IDAuMDtcbiAgc2F0cmVjLmRpZHQgPSAwLjA7XG4gIHNhdHJlYy5kbWR0ID0gMC4wO1xuICBzYXRyZWMuZG5vZHQgPSAwLjA7XG4gIHNhdHJlYy5kb21kdCA9IDAuMDtcbiAgc2F0cmVjLmUzID0gMC4wO1xuICBzYXRyZWMuZWUyID0gMC4wO1xuICBzYXRyZWMucGVvID0gMC4wO1xuICBzYXRyZWMucGdobyA9IDAuMDtcbiAgc2F0cmVjLnBobyA9IDAuMDtcbiAgc2F0cmVjLnBpbmNvID0gMC4wO1xuICBzYXRyZWMucGxvID0gMC4wO1xuICBzYXRyZWMuc2UyID0gMC4wO1xuICBzYXRyZWMuc2UzID0gMC4wO1xuICBzYXRyZWMuc2doMiA9IDAuMDtcbiAgc2F0cmVjLnNnaDMgPSAwLjA7XG4gIHNhdHJlYy5zZ2g0ID0gMC4wO1xuICBzYXRyZWMuc2gyID0gMC4wO1xuICBzYXRyZWMuc2gzID0gMC4wO1xuICBzYXRyZWMuc2kyID0gMC4wO1xuICBzYXRyZWMuc2kzID0gMC4wO1xuICBzYXRyZWMuc2wyID0gMC4wO1xuICBzYXRyZWMuc2wzID0gMC4wO1xuICBzYXRyZWMuc2w0ID0gMC4wO1xuICBzYXRyZWMuZ3N0byA9IDAuMDtcbiAgc2F0cmVjLnhmYWN0ID0gMC4wO1xuICBzYXRyZWMueGdoMiA9IDAuMDtcbiAgc2F0cmVjLnhnaDMgPSAwLjA7XG4gIHNhdHJlYy54Z2g0ID0gMC4wO1xuICBzYXRyZWMueGgyID0gMC4wO1xuICBzYXRyZWMueGgzID0gMC4wO1xuICBzYXRyZWMueGkyID0gMC4wO1xuICBzYXRyZWMueGkzID0gMC4wO1xuICBzYXRyZWMueGwyID0gMC4wO1xuICBzYXRyZWMueGwzID0gMC4wO1xuICBzYXRyZWMueGw0ID0gMC4wO1xuICBzYXRyZWMueGxhbW8gPSAwLjA7XG4gIHNhdHJlYy56bW9sID0gMC4wO1xuICBzYXRyZWMuem1vcyA9IDAuMDtcbiAgc2F0cmVjLmF0aW1lID0gMC4wO1xuICBzYXRyZWMueGxpID0gMC4wO1xuICBzYXRyZWMueG5pID0gMC4wOyAvLyBzZ3A0Zml4IC0gbm90ZSB0aGUgZm9sbG93aW5nIHZhcmlhYmxlcyBhcmUgYWxzbyBwYXNzZWQgZGlyZWN0bHkgdmlhIHNhdHJlYy5cbiAgLy8gaXQgaXMgcG9zc2libGUgdG8gc3RyZWFtbGluZSB0aGUgc2dwNGluaXQgY2FsbCBieSBkZWxldGluZyB0aGUgXCJ4XCJcbiAgLy8gdmFyaWFibGVzLCBidXQgdGhlIHVzZXIgd291bGQgbmVlZCB0byBzZXQgdGhlIHNhdHJlYy4qIHZhbHVlcyBmaXJzdC4gd2VcbiAgLy8gaW5jbHVkZSB0aGUgYWRkaXRpb25hbCBhc3NpZ25tZW50cyBpbiBjYXNlIHR3b2xpbmUycnYgaXMgbm90IHVzZWQuXG5cbiAgc2F0cmVjLmJzdGFyID0geGJzdGFyO1xuICBzYXRyZWMuZWNjbyA9IHhlY2NvO1xuICBzYXRyZWMuYXJncG8gPSB4YXJncG87XG4gIHNhdHJlYy5pbmNsbyA9IHhpbmNsbztcbiAgc2F0cmVjLm1vID0geG1vO1xuICBzYXRyZWMubm8gPSB4bm87XG4gIHNhdHJlYy5ub2RlbyA9IHhub2RlbzsgLy8gIHNncDRmaXggYWRkIG9wc21vZGVcblxuICBzYXRyZWMub3BlcmF0aW9ubW9kZSA9IG9wc21vZGU7IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBlYXJ0aCBjb25zdGFudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gc2dwNGZpeCBpZGVudGlmeSBjb25zdGFudHMgYW5kIGFsbG93IGFsdGVybmF0ZSB2YWx1ZXNcblxuICB2YXIgc3MgPSA3OC4wIC8gZWFydGhSYWRpdXMgKyAxLjA7IC8vIHNncDRmaXggdXNlIG11bHRpcGx5IGZvciBzcGVlZCBpbnN0ZWFkIG9mIHBvd1xuXG4gIHZhciBxem1zMnR0ZW1wID0gKDEyMC4wIC0gNzguMCkgLyBlYXJ0aFJhZGl1cztcbiAgdmFyIHF6bXMydCA9IHF6bXMydHRlbXAgKiBxem1zMnR0ZW1wICogcXptczJ0dGVtcCAqIHF6bXMydHRlbXA7XG4gIHNhdHJlYy5pbml0ID0gJ3knO1xuICBzYXRyZWMudCA9IDAuMDtcbiAgdmFyIGluaXRsT3B0aW9ucyA9IHtcbiAgICBzYXRuOiBzYXRuLFxuICAgIGVjY286IHNhdHJlYy5lY2NvLFxuICAgIGVwb2NoOiBlcG9jaCxcbiAgICBpbmNsbzogc2F0cmVjLmluY2xvLFxuICAgIG5vOiBzYXRyZWMubm8sXG4gICAgbWV0aG9kOiBzYXRyZWMubWV0aG9kLFxuICAgIG9wc21vZGU6IHNhdHJlYy5vcGVyYXRpb25tb2RlXG4gIH07XG4gIHZhciBpbml0bFJlc3VsdCA9IGluaXRsKGluaXRsT3B0aW9ucyk7XG4gIHZhciBhbyA9IGluaXRsUmVzdWx0LmFvLFxuICAgICAgY29uNDIgPSBpbml0bFJlc3VsdC5jb240MixcbiAgICAgIGNvc2lvID0gaW5pdGxSZXN1bHQuY29zaW8sXG4gICAgICBjb3NpbzIgPSBpbml0bFJlc3VsdC5jb3NpbzIsXG4gICAgICBlY2NzcSA9IGluaXRsUmVzdWx0LmVjY3NxLFxuICAgICAgb21lb3NxID0gaW5pdGxSZXN1bHQub21lb3NxLFxuICAgICAgcG9zcSA9IGluaXRsUmVzdWx0LnBvc3EsXG4gICAgICBycCA9IGluaXRsUmVzdWx0LnJwLFxuICAgICAgcnRlb3NxID0gaW5pdGxSZXN1bHQucnRlb3NxLFxuICAgICAgc2luaW8gPSBpbml0bFJlc3VsdC5zaW5pbztcbiAgc2F0cmVjLm5vID0gaW5pdGxSZXN1bHQubm87XG4gIHNhdHJlYy5jb240MSA9IGluaXRsUmVzdWx0LmNvbjQxO1xuICBzYXRyZWMuZ3N0byA9IGluaXRsUmVzdWx0LmdzdG87XG4gIHNhdHJlYy5lcnJvciA9IDA7IC8vIHNncDRmaXggcmVtb3ZlIHRoaXMgY2hlY2sgYXMgaXQgaXMgdW5uZWNlc3NhcnlcbiAgLy8gdGhlIG1ydCBjaGVjayBpbiBzZ3A0IGhhbmRsZXMgZGVjYXlpbmcgc2F0ZWxsaXRlIGNhc2VzIGV2ZW4gaWYgdGhlIHN0YXJ0aW5nXG4gIC8vIGNvbmRpdGlvbiBpcyBiZWxvdyB0aGUgc3VyZmFjZSBvZiB0ZSBlYXJ0aFxuICAvLyBpZiAocnAgPCAxLjApXG4gIC8vIHtcbiAgLy8gICBwcmludGYoXCIvLyAqKiogc2F0biVkIGVwb2NoIGVsdHMgc3ViLW9yYml0YWwgKioqXFxuXCIsIHNhdG4pO1xuICAvLyAgIHNhdHJlYy5lcnJvciA9IDU7XG4gIC8vIH1cblxuICBpZiAob21lb3NxID49IDAuMCB8fCBzYXRyZWMubm8gPj0gMC4wKSB7XG4gICAgc2F0cmVjLmlzaW1wID0gMDtcblxuICAgIGlmIChycCA8IDIyMC4wIC8gZWFydGhSYWRpdXMgKyAxLjApIHtcbiAgICAgIHNhdHJlYy5pc2ltcCA9IDE7XG4gICAgfVxuXG4gICAgc2ZvdXIgPSBzcztcbiAgICBxem1zMjQgPSBxem1zMnQ7XG4gICAgcGVyaWdlID0gKHJwIC0gMS4wKSAqIGVhcnRoUmFkaXVzOyAvLyAtIGZvciBwZXJpZ2VlcyBiZWxvdyAxNTYga20sIHMgYW5kIHFvbXMydCBhcmUgYWx0ZXJlZCAtXG5cbiAgICBpZiAocGVyaWdlIDwgMTU2LjApIHtcbiAgICAgIHNmb3VyID0gcGVyaWdlIC0gNzguMDtcblxuICAgICAgaWYgKHBlcmlnZSA8IDk4LjApIHtcbiAgICAgICAgc2ZvdXIgPSAyMC4wO1xuICAgICAgfSAvLyBzZ3A0Zml4IHVzZSBtdWx0aXBseSBmb3Igc3BlZWQgaW5zdGVhZCBvZiBwb3dcblxuXG4gICAgICB2YXIgcXptczI0dGVtcCA9ICgxMjAuMCAtIHNmb3VyKSAvIGVhcnRoUmFkaXVzO1xuICAgICAgcXptczI0ID0gcXptczI0dGVtcCAqIHF6bXMyNHRlbXAgKiBxem1zMjR0ZW1wICogcXptczI0dGVtcDtcbiAgICAgIHNmb3VyID0gc2ZvdXIgLyBlYXJ0aFJhZGl1cyArIDEuMDtcbiAgICB9XG5cbiAgICBwaW52c3EgPSAxLjAgLyBwb3NxO1xuICAgIHRzaSA9IDEuMCAvIChhbyAtIHNmb3VyKTtcbiAgICBzYXRyZWMuZXRhID0gYW8gKiBzYXRyZWMuZWNjbyAqIHRzaTtcbiAgICBldGFzcSA9IHNhdHJlYy5ldGEgKiBzYXRyZWMuZXRhO1xuICAgIGVldGEgPSBzYXRyZWMuZWNjbyAqIHNhdHJlYy5ldGE7XG4gICAgcHNpc3EgPSBNYXRoLmFicygxLjAgLSBldGFzcSk7XG4gICAgY29lZiA9IHF6bXMyNCAqIE1hdGgucG93KHRzaSwgNC4wKTtcbiAgICBjb2VmMSA9IGNvZWYgLyBNYXRoLnBvdyhwc2lzcSwgMy41KTtcbiAgICBjYzIgPSBjb2VmMSAqIHNhdHJlYy5ubyAqIChhbyAqICgxLjAgKyAxLjUgKiBldGFzcSArIGVldGEgKiAoNC4wICsgZXRhc3EpKSArIDAuMzc1ICogajIgKiB0c2kgLyBwc2lzcSAqIHNhdHJlYy5jb240MSAqICg4LjAgKyAzLjAgKiBldGFzcSAqICg4LjAgKyBldGFzcSkpKTtcbiAgICBzYXRyZWMuY2MxID0gc2F0cmVjLmJzdGFyICogY2MyO1xuICAgIGNjMyA9IDAuMDtcblxuICAgIGlmIChzYXRyZWMuZWNjbyA+IDEuMGUtNCkge1xuICAgICAgY2MzID0gLTIuMCAqIGNvZWYgKiB0c2kgKiBqM29qMiAqIHNhdHJlYy5ubyAqIHNpbmlvIC8gc2F0cmVjLmVjY287XG4gICAgfVxuXG4gICAgc2F0cmVjLngxbXRoMiA9IDEuMCAtIGNvc2lvMjtcbiAgICBzYXRyZWMuY2M0ID0gMi4wICogc2F0cmVjLm5vICogY29lZjEgKiBhbyAqIG9tZW9zcSAqIChzYXRyZWMuZXRhICogKDIuMCArIDAuNSAqIGV0YXNxKSArIHNhdHJlYy5lY2NvICogKDAuNSArIDIuMCAqIGV0YXNxKSAtIGoyICogdHNpIC8gKGFvICogcHNpc3EpICogKC0zLjAgKiBzYXRyZWMuY29uNDEgKiAoMS4wIC0gMi4wICogZWV0YSArIGV0YXNxICogKDEuNSAtIDAuNSAqIGVldGEpKSArIDAuNzUgKiBzYXRyZWMueDFtdGgyICogKDIuMCAqIGV0YXNxIC0gZWV0YSAqICgxLjAgKyBldGFzcSkpICogTWF0aC5jb3MoMi4wICogc2F0cmVjLmFyZ3BvKSkpO1xuICAgIHNhdHJlYy5jYzUgPSAyLjAgKiBjb2VmMSAqIGFvICogb21lb3NxICogKDEuMCArIDIuNzUgKiAoZXRhc3EgKyBlZXRhKSArIGVldGEgKiBldGFzcSk7XG4gICAgY29zaW80ID0gY29zaW8yICogY29zaW8yO1xuICAgIHRlbXAxID0gMS41ICogajIgKiBwaW52c3EgKiBzYXRyZWMubm87XG4gICAgdGVtcDIgPSAwLjUgKiB0ZW1wMSAqIGoyICogcGludnNxO1xuICAgIHRlbXAzID0gLTAuNDY4NzUgKiBqNCAqIHBpbnZzcSAqIHBpbnZzcSAqIHNhdHJlYy5ubztcbiAgICBzYXRyZWMubWRvdCA9IHNhdHJlYy5ubyArIDAuNSAqIHRlbXAxICogcnRlb3NxICogc2F0cmVjLmNvbjQxICsgMC4wNjI1ICogdGVtcDIgKiBydGVvc3EgKiAoMTMuMCAtIDc4LjAgKiBjb3NpbzIgKyAxMzcuMCAqIGNvc2lvNCk7XG4gICAgc2F0cmVjLmFyZ3Bkb3QgPSAtMC41ICogdGVtcDEgKiBjb240MiArIDAuMDYyNSAqIHRlbXAyICogKDcuMCAtIDExNC4wICogY29zaW8yICsgMzk1LjAgKiBjb3NpbzQpICsgdGVtcDMgKiAoMy4wIC0gMzYuMCAqIGNvc2lvMiArIDQ5LjAgKiBjb3NpbzQpO1xuICAgIHhoZG90MSA9IC10ZW1wMSAqIGNvc2lvO1xuICAgIHNhdHJlYy5ub2RlZG90ID0geGhkb3QxICsgKDAuNSAqIHRlbXAyICogKDQuMCAtIDE5LjAgKiBjb3NpbzIpICsgMi4wICogdGVtcDMgKiAoMy4wIC0gNy4wICogY29zaW8yKSkgKiBjb3NpbztcbiAgICB4cGlkb3QgPSBzYXRyZWMuYXJncGRvdCArIHNhdHJlYy5ub2RlZG90O1xuICAgIHNhdHJlYy5vbWdjb2YgPSBzYXRyZWMuYnN0YXIgKiBjYzMgKiBNYXRoLmNvcyhzYXRyZWMuYXJncG8pO1xuICAgIHNhdHJlYy54bWNvZiA9IDAuMDtcblxuICAgIGlmIChzYXRyZWMuZWNjbyA+IDEuMGUtNCkge1xuICAgICAgc2F0cmVjLnhtY29mID0gLXgybzMgKiBjb2VmICogc2F0cmVjLmJzdGFyIC8gZWV0YTtcbiAgICB9XG5cbiAgICBzYXRyZWMubm9kZWNmID0gMy41ICogb21lb3NxICogeGhkb3QxICogc2F0cmVjLmNjMTtcbiAgICBzYXRyZWMudDJjb2YgPSAxLjUgKiBzYXRyZWMuY2MxOyAvLyBzZ3A0Zml4IGZvciBkaXZpZGUgYnkgemVybyB3aXRoIHhpbmNvID0gMTgwIGRlZ1xuXG4gICAgaWYgKE1hdGguYWJzKGNvc2lvICsgMS4wKSA+IDEuNWUtMTIpIHtcbiAgICAgIHNhdHJlYy54bGNvZiA9IC0wLjI1ICogajNvajIgKiBzaW5pbyAqICgzLjAgKyA1LjAgKiBjb3NpbykgLyAoMS4wICsgY29zaW8pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzYXRyZWMueGxjb2YgPSAtMC4yNSAqIGozb2oyICogc2luaW8gKiAoMy4wICsgNS4wICogY29zaW8pIC8gdGVtcDQ7XG4gICAgfVxuXG4gICAgc2F0cmVjLmF5Y29mID0gLTAuNSAqIGozb2oyICogc2luaW87IC8vIHNncDRmaXggdXNlIG11bHRpcGx5IGZvciBzcGVlZCBpbnN0ZWFkIG9mIHBvd1xuXG4gICAgdmFyIGRlbG1vdGVtcCA9IDEuMCArIHNhdHJlYy5ldGEgKiBNYXRoLmNvcyhzYXRyZWMubW8pO1xuICAgIHNhdHJlYy5kZWxtbyA9IGRlbG1vdGVtcCAqIGRlbG1vdGVtcCAqIGRlbG1vdGVtcDtcbiAgICBzYXRyZWMuc2lubWFvID0gTWF0aC5zaW4oc2F0cmVjLm1vKTtcbiAgICBzYXRyZWMueDd0aG0xID0gNy4wICogY29zaW8yIC0gMS4wOyAvLyAtLS0tLS0tLS0tLS0tLS0gZGVlcCBzcGFjZSBpbml0aWFsaXphdGlvbiAtLS0tLS0tLS0tLS0tXG5cbiAgICBpZiAoMiAqIHBpIC8gc2F0cmVjLm5vID49IDIyNS4wKSB7XG4gICAgICBzYXRyZWMubWV0aG9kID0gJ2QnO1xuICAgICAgc2F0cmVjLmlzaW1wID0gMTtcbiAgICAgIHRjID0gMC4wO1xuICAgICAgaW5jbG0gPSBzYXRyZWMuaW5jbG87XG4gICAgICB2YXIgZHNjb21PcHRpb25zID0ge1xuICAgICAgICBlcG9jaDogZXBvY2gsXG4gICAgICAgIGVwOiBzYXRyZWMuZWNjbyxcbiAgICAgICAgYXJncHA6IHNhdHJlYy5hcmdwbyxcbiAgICAgICAgdGM6IHRjLFxuICAgICAgICBpbmNscDogc2F0cmVjLmluY2xvLFxuICAgICAgICBub2RlcDogc2F0cmVjLm5vZGVvLFxuICAgICAgICBucDogc2F0cmVjLm5vLFxuICAgICAgICBlMzogc2F0cmVjLmUzLFxuICAgICAgICBlZTI6IHNhdHJlYy5lZTIsXG4gICAgICAgIHBlbzogc2F0cmVjLnBlbyxcbiAgICAgICAgcGdobzogc2F0cmVjLnBnaG8sXG4gICAgICAgIHBobzogc2F0cmVjLnBobyxcbiAgICAgICAgcGluY286IHNhdHJlYy5waW5jbyxcbiAgICAgICAgcGxvOiBzYXRyZWMucGxvLFxuICAgICAgICBzZTI6IHNhdHJlYy5zZTIsXG4gICAgICAgIHNlMzogc2F0cmVjLnNlMyxcbiAgICAgICAgc2doMjogc2F0cmVjLnNnaDIsXG4gICAgICAgIHNnaDM6IHNhdHJlYy5zZ2gzLFxuICAgICAgICBzZ2g0OiBzYXRyZWMuc2doNCxcbiAgICAgICAgc2gyOiBzYXRyZWMuc2gyLFxuICAgICAgICBzaDM6IHNhdHJlYy5zaDMsXG4gICAgICAgIHNpMjogc2F0cmVjLnNpMixcbiAgICAgICAgc2kzOiBzYXRyZWMuc2kzLFxuICAgICAgICBzbDI6IHNhdHJlYy5zbDIsXG4gICAgICAgIHNsMzogc2F0cmVjLnNsMyxcbiAgICAgICAgc2w0OiBzYXRyZWMuc2w0LFxuICAgICAgICB4Z2gyOiBzYXRyZWMueGdoMixcbiAgICAgICAgeGdoMzogc2F0cmVjLnhnaDMsXG4gICAgICAgIHhnaDQ6IHNhdHJlYy54Z2g0LFxuICAgICAgICB4aDI6IHNhdHJlYy54aDIsXG4gICAgICAgIHhoMzogc2F0cmVjLnhoMyxcbiAgICAgICAgeGkyOiBzYXRyZWMueGkyLFxuICAgICAgICB4aTM6IHNhdHJlYy54aTMsXG4gICAgICAgIHhsMjogc2F0cmVjLnhsMixcbiAgICAgICAgeGwzOiBzYXRyZWMueGwzLFxuICAgICAgICB4bDQ6IHNhdHJlYy54bDQsXG4gICAgICAgIHptb2w6IHNhdHJlYy56bW9sLFxuICAgICAgICB6bW9zOiBzYXRyZWMuem1vc1xuICAgICAgfTtcbiAgICAgIHZhciBkc2NvbVJlc3VsdCA9IGRzY29tKGRzY29tT3B0aW9ucyk7XG4gICAgICBzYXRyZWMuZTMgPSBkc2NvbVJlc3VsdC5lMztcbiAgICAgIHNhdHJlYy5lZTIgPSBkc2NvbVJlc3VsdC5lZTI7XG4gICAgICBzYXRyZWMucGVvID0gZHNjb21SZXN1bHQucGVvO1xuICAgICAgc2F0cmVjLnBnaG8gPSBkc2NvbVJlc3VsdC5wZ2hvO1xuICAgICAgc2F0cmVjLnBobyA9IGRzY29tUmVzdWx0LnBobztcbiAgICAgIHNhdHJlYy5waW5jbyA9IGRzY29tUmVzdWx0LnBpbmNvO1xuICAgICAgc2F0cmVjLnBsbyA9IGRzY29tUmVzdWx0LnBsbztcbiAgICAgIHNhdHJlYy5zZTIgPSBkc2NvbVJlc3VsdC5zZTI7XG4gICAgICBzYXRyZWMuc2UzID0gZHNjb21SZXN1bHQuc2UzO1xuICAgICAgc2F0cmVjLnNnaDIgPSBkc2NvbVJlc3VsdC5zZ2gyO1xuICAgICAgc2F0cmVjLnNnaDMgPSBkc2NvbVJlc3VsdC5zZ2gzO1xuICAgICAgc2F0cmVjLnNnaDQgPSBkc2NvbVJlc3VsdC5zZ2g0O1xuICAgICAgc2F0cmVjLnNoMiA9IGRzY29tUmVzdWx0LnNoMjtcbiAgICAgIHNhdHJlYy5zaDMgPSBkc2NvbVJlc3VsdC5zaDM7XG4gICAgICBzYXRyZWMuc2kyID0gZHNjb21SZXN1bHQuc2kyO1xuICAgICAgc2F0cmVjLnNpMyA9IGRzY29tUmVzdWx0LnNpMztcbiAgICAgIHNhdHJlYy5zbDIgPSBkc2NvbVJlc3VsdC5zbDI7XG4gICAgICBzYXRyZWMuc2wzID0gZHNjb21SZXN1bHQuc2wzO1xuICAgICAgc2F0cmVjLnNsNCA9IGRzY29tUmVzdWx0LnNsNDtcbiAgICAgIHNpbmltID0gZHNjb21SZXN1bHQuc2luaW07XG4gICAgICBjb3NpbSA9IGRzY29tUmVzdWx0LmNvc2ltO1xuICAgICAgZW0gPSBkc2NvbVJlc3VsdC5lbTtcbiAgICAgIGVtc3EgPSBkc2NvbVJlc3VsdC5lbXNxO1xuICAgICAgczEgPSBkc2NvbVJlc3VsdC5zMTtcbiAgICAgIHMyID0gZHNjb21SZXN1bHQuczI7XG4gICAgICBzMyA9IGRzY29tUmVzdWx0LnMzO1xuICAgICAgczQgPSBkc2NvbVJlc3VsdC5zNDtcbiAgICAgIHM1ID0gZHNjb21SZXN1bHQuczU7XG4gICAgICBzczEgPSBkc2NvbVJlc3VsdC5zczE7XG4gICAgICBzczIgPSBkc2NvbVJlc3VsdC5zczI7XG4gICAgICBzczMgPSBkc2NvbVJlc3VsdC5zczM7XG4gICAgICBzczQgPSBkc2NvbVJlc3VsdC5zczQ7XG4gICAgICBzczUgPSBkc2NvbVJlc3VsdC5zczU7XG4gICAgICBzejEgPSBkc2NvbVJlc3VsdC5zejE7XG4gICAgICBzejMgPSBkc2NvbVJlc3VsdC5zejM7XG4gICAgICBzejExID0gZHNjb21SZXN1bHQuc3oxMTtcbiAgICAgIHN6MTMgPSBkc2NvbVJlc3VsdC5zejEzO1xuICAgICAgc3oyMSA9IGRzY29tUmVzdWx0LnN6MjE7XG4gICAgICBzejIzID0gZHNjb21SZXN1bHQuc3oyMztcbiAgICAgIHN6MzEgPSBkc2NvbVJlc3VsdC5zejMxO1xuICAgICAgc3ozMyA9IGRzY29tUmVzdWx0LnN6MzM7XG4gICAgICBzYXRyZWMueGdoMiA9IGRzY29tUmVzdWx0LnhnaDI7XG4gICAgICBzYXRyZWMueGdoMyA9IGRzY29tUmVzdWx0LnhnaDM7XG4gICAgICBzYXRyZWMueGdoNCA9IGRzY29tUmVzdWx0LnhnaDQ7XG4gICAgICBzYXRyZWMueGgyID0gZHNjb21SZXN1bHQueGgyO1xuICAgICAgc2F0cmVjLnhoMyA9IGRzY29tUmVzdWx0LnhoMztcbiAgICAgIHNhdHJlYy54aTIgPSBkc2NvbVJlc3VsdC54aTI7XG4gICAgICBzYXRyZWMueGkzID0gZHNjb21SZXN1bHQueGkzO1xuICAgICAgc2F0cmVjLnhsMiA9IGRzY29tUmVzdWx0LnhsMjtcbiAgICAgIHNhdHJlYy54bDMgPSBkc2NvbVJlc3VsdC54bDM7XG4gICAgICBzYXRyZWMueGw0ID0gZHNjb21SZXN1bHQueGw0O1xuICAgICAgc2F0cmVjLnptb2wgPSBkc2NvbVJlc3VsdC56bW9sO1xuICAgICAgc2F0cmVjLnptb3MgPSBkc2NvbVJlc3VsdC56bW9zO1xuICAgICAgbm0gPSBkc2NvbVJlc3VsdC5ubTtcbiAgICAgIHoxID0gZHNjb21SZXN1bHQuejE7XG4gICAgICB6MyA9IGRzY29tUmVzdWx0LnozO1xuICAgICAgejExID0gZHNjb21SZXN1bHQuejExO1xuICAgICAgejEzID0gZHNjb21SZXN1bHQuejEzO1xuICAgICAgejIxID0gZHNjb21SZXN1bHQuejIxO1xuICAgICAgejIzID0gZHNjb21SZXN1bHQuejIzO1xuICAgICAgejMxID0gZHNjb21SZXN1bHQuejMxO1xuICAgICAgejMzID0gZHNjb21SZXN1bHQuejMzO1xuICAgICAgdmFyIGRwcGVyT3B0aW9ucyA9IHtcbiAgICAgICAgaW5jbG86IGluY2xtLFxuICAgICAgICBpbml0OiBzYXRyZWMuaW5pdCxcbiAgICAgICAgZXA6IHNhdHJlYy5lY2NvLFxuICAgICAgICBpbmNscDogc2F0cmVjLmluY2xvLFxuICAgICAgICBub2RlcDogc2F0cmVjLm5vZGVvLFxuICAgICAgICBhcmdwcDogc2F0cmVjLmFyZ3BvLFxuICAgICAgICBtcDogc2F0cmVjLm1vLFxuICAgICAgICBvcHNtb2RlOiBzYXRyZWMub3BlcmF0aW9ubW9kZVxuICAgICAgfTtcbiAgICAgIHZhciBkcHBlclJlc3VsdCA9IGRwcGVyKHNhdHJlYywgZHBwZXJPcHRpb25zKTtcbiAgICAgIHNhdHJlYy5lY2NvID0gZHBwZXJSZXN1bHQuZXA7XG4gICAgICBzYXRyZWMuaW5jbG8gPSBkcHBlclJlc3VsdC5pbmNscDtcbiAgICAgIHNhdHJlYy5ub2RlbyA9IGRwcGVyUmVzdWx0Lm5vZGVwO1xuICAgICAgc2F0cmVjLmFyZ3BvID0gZHBwZXJSZXN1bHQuYXJncHA7XG4gICAgICBzYXRyZWMubW8gPSBkcHBlclJlc3VsdC5tcDtcbiAgICAgIGFyZ3BtID0gMC4wO1xuICAgICAgbm9kZW0gPSAwLjA7XG4gICAgICBtbSA9IDAuMDtcbiAgICAgIHZhciBkc2luaXRPcHRpb25zID0ge1xuICAgICAgICBjb3NpbTogY29zaW0sXG4gICAgICAgIGVtc3E6IGVtc3EsXG4gICAgICAgIGFyZ3BvOiBzYXRyZWMuYXJncG8sXG4gICAgICAgIHMxOiBzMSxcbiAgICAgICAgczI6IHMyLFxuICAgICAgICBzMzogczMsXG4gICAgICAgIHM0OiBzNCxcbiAgICAgICAgczU6IHM1LFxuICAgICAgICBzaW5pbTogc2luaW0sXG4gICAgICAgIHNzMTogc3MxLFxuICAgICAgICBzczI6IHNzMixcbiAgICAgICAgc3MzOiBzczMsXG4gICAgICAgIHNzNDogc3M0LFxuICAgICAgICBzczU6IHNzNSxcbiAgICAgICAgc3oxOiBzejEsXG4gICAgICAgIHN6Mzogc3ozLFxuICAgICAgICBzejExOiBzejExLFxuICAgICAgICBzejEzOiBzejEzLFxuICAgICAgICBzejIxOiBzejIxLFxuICAgICAgICBzejIzOiBzejIzLFxuICAgICAgICBzejMxOiBzejMxLFxuICAgICAgICBzejMzOiBzejMzLFxuICAgICAgICB0OiBzYXRyZWMudCxcbiAgICAgICAgdGM6IHRjLFxuICAgICAgICBnc3RvOiBzYXRyZWMuZ3N0byxcbiAgICAgICAgbW86IHNhdHJlYy5tbyxcbiAgICAgICAgbWRvdDogc2F0cmVjLm1kb3QsXG4gICAgICAgIG5vOiBzYXRyZWMubm8sXG4gICAgICAgIG5vZGVvOiBzYXRyZWMubm9kZW8sXG4gICAgICAgIG5vZGVkb3Q6IHNhdHJlYy5ub2RlZG90LFxuICAgICAgICB4cGlkb3Q6IHhwaWRvdCxcbiAgICAgICAgejE6IHoxLFxuICAgICAgICB6MzogejMsXG4gICAgICAgIHoxMTogejExLFxuICAgICAgICB6MTM6IHoxMyxcbiAgICAgICAgejIxOiB6MjEsXG4gICAgICAgIHoyMzogejIzLFxuICAgICAgICB6MzE6IHozMSxcbiAgICAgICAgejMzOiB6MzMsXG4gICAgICAgIGVjY286IHNhdHJlYy5lY2NvLFxuICAgICAgICBlY2NzcTogZWNjc3EsXG4gICAgICAgIGVtOiBlbSxcbiAgICAgICAgYXJncG06IGFyZ3BtLFxuICAgICAgICBpbmNsbTogaW5jbG0sXG4gICAgICAgIG1tOiBtbSxcbiAgICAgICAgbm06IG5tLFxuICAgICAgICBub2RlbTogbm9kZW0sXG4gICAgICAgIGlyZXo6IHNhdHJlYy5pcmV6LFxuICAgICAgICBhdGltZTogc2F0cmVjLmF0aW1lLFxuICAgICAgICBkMjIwMTogc2F0cmVjLmQyMjAxLFxuICAgICAgICBkMjIxMTogc2F0cmVjLmQyMjExLFxuICAgICAgICBkMzIxMDogc2F0cmVjLmQzMjEwLFxuICAgICAgICBkMzIyMjogc2F0cmVjLmQzMjIyLFxuICAgICAgICBkNDQxMDogc2F0cmVjLmQ0NDEwLFxuICAgICAgICBkNDQyMjogc2F0cmVjLmQ0NDIyLFxuICAgICAgICBkNTIyMDogc2F0cmVjLmQ1MjIwLFxuICAgICAgICBkNTIzMjogc2F0cmVjLmQ1MjMyLFxuICAgICAgICBkNTQyMTogc2F0cmVjLmQ1NDIxLFxuICAgICAgICBkNTQzMzogc2F0cmVjLmQ1NDMzLFxuICAgICAgICBkZWR0OiBzYXRyZWMuZGVkdCxcbiAgICAgICAgZGlkdDogc2F0cmVjLmRpZHQsXG4gICAgICAgIGRtZHQ6IHNhdHJlYy5kbWR0LFxuICAgICAgICBkbm9kdDogc2F0cmVjLmRub2R0LFxuICAgICAgICBkb21kdDogc2F0cmVjLmRvbWR0LFxuICAgICAgICBkZWwxOiBzYXRyZWMuZGVsMSxcbiAgICAgICAgZGVsMjogc2F0cmVjLmRlbDIsXG4gICAgICAgIGRlbDM6IHNhdHJlYy5kZWwzLFxuICAgICAgICB4ZmFjdDogc2F0cmVjLnhmYWN0LFxuICAgICAgICB4bGFtbzogc2F0cmVjLnhsYW1vLFxuICAgICAgICB4bGk6IHNhdHJlYy54bGksXG4gICAgICAgIHhuaTogc2F0cmVjLnhuaVxuICAgICAgfTtcbiAgICAgIHZhciBkc2luaXRSZXN1bHQgPSBkc2luaXQoZHNpbml0T3B0aW9ucyk7XG4gICAgICBzYXRyZWMuaXJleiA9IGRzaW5pdFJlc3VsdC5pcmV6O1xuICAgICAgc2F0cmVjLmF0aW1lID0gZHNpbml0UmVzdWx0LmF0aW1lO1xuICAgICAgc2F0cmVjLmQyMjAxID0gZHNpbml0UmVzdWx0LmQyMjAxO1xuICAgICAgc2F0cmVjLmQyMjExID0gZHNpbml0UmVzdWx0LmQyMjExO1xuICAgICAgc2F0cmVjLmQzMjEwID0gZHNpbml0UmVzdWx0LmQzMjEwO1xuICAgICAgc2F0cmVjLmQzMjIyID0gZHNpbml0UmVzdWx0LmQzMjIyO1xuICAgICAgc2F0cmVjLmQ0NDEwID0gZHNpbml0UmVzdWx0LmQ0NDEwO1xuICAgICAgc2F0cmVjLmQ0NDIyID0gZHNpbml0UmVzdWx0LmQ0NDIyO1xuICAgICAgc2F0cmVjLmQ1MjIwID0gZHNpbml0UmVzdWx0LmQ1MjIwO1xuICAgICAgc2F0cmVjLmQ1MjMyID0gZHNpbml0UmVzdWx0LmQ1MjMyO1xuICAgICAgc2F0cmVjLmQ1NDIxID0gZHNpbml0UmVzdWx0LmQ1NDIxO1xuICAgICAgc2F0cmVjLmQ1NDMzID0gZHNpbml0UmVzdWx0LmQ1NDMzO1xuICAgICAgc2F0cmVjLmRlZHQgPSBkc2luaXRSZXN1bHQuZGVkdDtcbiAgICAgIHNhdHJlYy5kaWR0ID0gZHNpbml0UmVzdWx0LmRpZHQ7XG4gICAgICBzYXRyZWMuZG1kdCA9IGRzaW5pdFJlc3VsdC5kbWR0O1xuICAgICAgc2F0cmVjLmRub2R0ID0gZHNpbml0UmVzdWx0LmRub2R0O1xuICAgICAgc2F0cmVjLmRvbWR0ID0gZHNpbml0UmVzdWx0LmRvbWR0O1xuICAgICAgc2F0cmVjLmRlbDEgPSBkc2luaXRSZXN1bHQuZGVsMTtcbiAgICAgIHNhdHJlYy5kZWwyID0gZHNpbml0UmVzdWx0LmRlbDI7XG4gICAgICBzYXRyZWMuZGVsMyA9IGRzaW5pdFJlc3VsdC5kZWwzO1xuICAgICAgc2F0cmVjLnhmYWN0ID0gZHNpbml0UmVzdWx0LnhmYWN0O1xuICAgICAgc2F0cmVjLnhsYW1vID0gZHNpbml0UmVzdWx0LnhsYW1vO1xuICAgICAgc2F0cmVjLnhsaSA9IGRzaW5pdFJlc3VsdC54bGk7XG4gICAgICBzYXRyZWMueG5pID0gZHNpbml0UmVzdWx0LnhuaTtcbiAgICB9IC8vIC0tLS0tLS0tLS0tIHNldCB2YXJpYWJsZXMgaWYgbm90IGRlZXAgc3BhY2UgLS0tLS0tLS0tLS1cblxuXG4gICAgaWYgKHNhdHJlYy5pc2ltcCAhPT0gMSkge1xuICAgICAgY2Mxc3EgPSBzYXRyZWMuY2MxICogc2F0cmVjLmNjMTtcbiAgICAgIHNhdHJlYy5kMiA9IDQuMCAqIGFvICogdHNpICogY2Mxc3E7XG4gICAgICB0ZW1wID0gc2F0cmVjLmQyICogdHNpICogc2F0cmVjLmNjMSAvIDMuMDtcbiAgICAgIHNhdHJlYy5kMyA9ICgxNy4wICogYW8gKyBzZm91cikgKiB0ZW1wO1xuICAgICAgc2F0cmVjLmQ0ID0gMC41ICogdGVtcCAqIGFvICogdHNpICogKDIyMS4wICogYW8gKyAzMS4wICogc2ZvdXIpICogc2F0cmVjLmNjMTtcbiAgICAgIHNhdHJlYy50M2NvZiA9IHNhdHJlYy5kMiArIDIuMCAqIGNjMXNxO1xuICAgICAgc2F0cmVjLnQ0Y29mID0gMC4yNSAqICgzLjAgKiBzYXRyZWMuZDMgKyBzYXRyZWMuY2MxICogKDEyLjAgKiBzYXRyZWMuZDIgKyAxMC4wICogY2Mxc3EpKTtcbiAgICAgIHNhdHJlYy50NWNvZiA9IDAuMiAqICgzLjAgKiBzYXRyZWMuZDQgKyAxMi4wICogc2F0cmVjLmNjMSAqIHNhdHJlYy5kMyArIDYuMCAqIHNhdHJlYy5kMiAqIHNhdHJlYy5kMiArIDE1LjAgKiBjYzFzcSAqICgyLjAgKiBzYXRyZWMuZDIgKyBjYzFzcSkpO1xuICAgIH1cbiAgICAvKiBmaW5hbGx5IHByb3BvZ2F0ZSB0byB6ZXJvIGVwb2NoIHRvIGluaXRpYWxpemUgYWxsIG90aGVycy4gKi9cbiAgICAvLyBzZ3A0Zml4IHRha2Ugb3V0IGNoZWNrIHRvIGxldCBzYXRlbGxpdGVzIHByb2Nlc3MgdW50aWwgdGhleSBhcmUgYWN0dWFsbHkgYmVsb3cgZWFydGggc3VyZmFjZVxuICAgIC8vIGlmKHNhdHJlYy5lcnJvciA9PSAwKVxuXG4gIH1cblxuICBzZ3A0KHNhdHJlYywgMCk7XG4gIHNhdHJlYy5pbml0ID0gJ24nO1xuICAvKiBlc2xpbnQtZW5hYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG59XG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gdHdvbGluZTJydlxuICpcbiAqICB0aGlzIGZ1bmN0aW9uIGNvbnZlcnRzIHRoZSB0d28gbGluZSBlbGVtZW50IHNldCBjaGFyYWN0ZXIgc3RyaW5nIGRhdGEgdG9cbiAqICAgIHZhcmlhYmxlcyBhbmQgaW5pdGlhbGl6ZXMgdGhlIHNncDQgdmFyaWFibGVzLiBzZXZlcmFsIGludGVybWVkaWF0ZSB2YXJhaWJsZXNcbiAqICAgIGFuZCBxdWFudGl0aWVzIGFyZSBkZXRlcm1pbmVkLiBub3RlIHRoYXQgdGhlIHJlc3VsdCBpcyBhIHN0cnVjdHVyZSBzbyBtdWx0aXBsZVxuICogICAgc2F0ZWxsaXRlcyBjYW4gYmUgcHJvY2Vzc2VkIHNpbXVsdGFuZW91c2x5IHdpdGhvdXQgaGF2aW5nIHRvIHJlaW5pdGlhbGl6ZS4gdGhlXG4gKiAgICB2ZXJpZmljYXRpb24gbW9kZSBpcyBhbiBpbXBvcnRhbnQgb3B0aW9uIHRoYXQgcGVybWl0cyBxdWljayBjaGVja3Mgb2YgYW55XG4gKiAgICBjaGFuZ2VzIHRvIHRoZSB1bmRlcmx5aW5nIHRlY2huaWNhbCB0aGVvcnkuIHRoaXMgb3B0aW9uIHdvcmtzIHVzaW5nIGFcbiAqICAgIG1vZGlmaWVkIHRsZSBmaWxlIGluIHdoaWNoIHRoZSBzdGFydCwgc3RvcCwgYW5kIGRlbHRhIHRpbWUgdmFsdWVzIGFyZVxuICogICAgaW5jbHVkZWQgYXQgdGhlIGVuZCBvZiB0aGUgc2Vjb25kIGxpbmUgb2YgZGF0YS4gdGhpcyBvbmx5IHdvcmtzIHdpdGggdGhlXG4gKiAgICB2ZXJpZmljYXRpb24gbW9kZS4gdGhlIGNhdGFsb2cgbW9kZSBzaW1wbHkgcHJvcGFnYXRlcyBmcm9tIC0xNDQwIHRvIDE0NDAgbWluXG4gKiAgICBmcm9tIGVwb2NoIGFuZCBpcyB1c2VmdWwgd2hlbiBwZXJmb3JtaW5nIGVudGlyZSBjYXRhbG9nIHJ1bnMuXG4gKlxuICogIGF1dGhvciAgICAgICAgOiBkYXZpZCB2YWxsYWRvICAgICAgICAgICAgICAgICAgNzE5LTU3My0yNjAwICAgIDEgbWFyIDIwMDFcbiAqXG4gKiAgaW5wdXRzICAgICAgICA6XG4gKiAgICBsb25nc3RyMSAgICAtIGZpcnN0IGxpbmUgb2YgdGhlIHRsZVxuICogICAgbG9uZ3N0cjIgICAgLSBzZWNvbmQgbGluZSBvZiB0aGUgdGxlXG4gKiAgICB0eXBlcnVuICAgICAtIHR5cGUgb2YgcnVuICAgICAgICAgICAgICAgICAgICB2ZXJpZmljYXRpb24gJ3YnLCBjYXRhbG9nICdjJyxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hbnVhbCAnbSdcbiAqICAgIHR5cGVpbnB1dCAgIC0gdHlwZSBvZiBtYW51YWwgaW5wdXQgICAgICAgICAgIG1mZSAnbScsIGVwb2NoICdlJywgZGF5b2Z5ciAnZCdcbiAqICAgIG9wc21vZGUgICAgIC0gbW9kZSBvZiBvcGVyYXRpb24gYWZzcGMgb3IgaW1wcm92ZWQgJ2EnLCAnaSdcbiAqICAgIHdoaWNoY29uc3QgIC0gd2hpY2ggc2V0IG9mIGNvbnN0YW50cyB0byB1c2UgIDcyLCA4NFxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIHNhdHJlYyAgICAgIC0gc3RydWN0dXJlIGNvbnRhaW5pbmcgYWxsIHRoZSBzZ3A0IHNhdGVsbGl0ZSBpbmZvcm1hdGlvblxuICpcbiAqICBjb3VwbGluZyAgICAgIDpcbiAqICAgIGdldGdyYXZjb25zdC1cbiAqICAgIGRheXMybWRobXMgIC0gY29udmVyc2lvbiBvZiBkYXlzIHRvIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kXG4gKiAgICBqZGF5ICAgICAgICAtIGNvbnZlcnQgZGF5IG1vbnRoIHllYXIgaG91ciBtaW51dGUgc2Vjb25kIGludG8ganVsaWFuIGRhdGVcbiAqICAgIHNncDRpbml0ICAgIC0gaW5pdGlhbGl6ZSB0aGUgc2dwNCB2YXJpYWJsZXNcbiAqXG4gKiAgcmVmZXJlbmNlcyAgICA6XG4gKiAgICBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAjM1xuICogICAgdmFsbGFkbywgY3Jhd2ZvcmQsIGh1anNhaywga2Vsc28gIDIwMDZcbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuLyoqXG4gKiBSZXR1cm4gYSBTYXRlbGxpdGUgaW1wb3J0ZWQgZnJvbSB0d28gbGluZXMgb2YgVExFIGRhdGEuXG4gKlxuICogUHJvdmlkZSB0aGUgdHdvIFRMRSBsaW5lcyBhcyBzdHJpbmdzIGBsb25nc3RyMWAgYW5kIGBsb25nc3RyMmAsXG4gKiBhbmQgc2VsZWN0IHdoaWNoIHN0YW5kYXJkIHNldCBvZiBncmF2aXRhdGlvbmFsIGNvbnN0YW50cyB5b3Ugd2FudFxuICogYnkgcHJvdmlkaW5nIGBncmF2aXR5X2NvbnN0YW50c2A6XG4gKlxuICogYHNncDQucHJvcGFnYXRpb24ud2dzNzJgIC0gU3RhbmRhcmQgV0dTIDcyIG1vZGVsXG4gKiBgc2dwNC5wcm9wYWdhdGlvbi53Z3M4NGAgLSBNb3JlIHJlY2VudCBXR1MgODQgbW9kZWxcbiAqIGBzZ3A0LnByb3BhZ2F0aW9uLndnczcyb2xkYCAtIExlZ2FjeSBzdXBwb3J0IGZvciBvbGQgU0dQNCBiZWhhdmlvclxuICpcbiAqIE5vcm1hbGx5LCBjb21wdXRhdGlvbnMgYXJlIG1hZGUgdXNpbmcgbGV0aW91cyByZWNlbnQgaW1wcm92ZW1lbnRzXG4gKiB0byB0aGUgYWxnb3JpdGhtLiAgSWYgeW91IHdhbnQgdG8gdHVybiBzb21lIG9mIHRoZXNlIG9mZiBhbmQgZ29cbiAqIGJhY2sgaW50byBcImFmc3BjXCIgbW9kZSwgdGhlbiBzZXQgYGFmc3BjX21vZGVgIHRvIGBUcnVlYC5cbiAqL1xuXG5cbmZ1bmN0aW9uIHR3b2xpbmUyc2F0cmVjKGxvbmdzdHIxLCBsb25nc3RyMikge1xuICB2YXIgb3BzbW9kZSA9ICdpJztcbiAgdmFyIHhwZG90cCA9IDE0NDAuMCAvICgyLjAgKiBwaSk7IC8vIDIyOS4xODMxMTgwNTIzMjkzO1xuXG4gIHZhciB5ZWFyID0gMDtcbiAgdmFyIHNhdHJlYyA9IHt9O1xuICBzYXRyZWMuZXJyb3IgPSAwO1xuICBzYXRyZWMuc2F0bnVtID0gbG9uZ3N0cjEuc3Vic3RyaW5nKDIsIDcpO1xuICBzYXRyZWMuZXBvY2h5ciA9IHBhcnNlSW50KGxvbmdzdHIxLnN1YnN0cmluZygxOCwgMjApLCAxMCk7XG4gIHNhdHJlYy5lcG9jaGRheXMgPSBwYXJzZUZsb2F0KGxvbmdzdHIxLnN1YnN0cmluZygyMCwgMzIpKTtcbiAgc2F0cmVjLm5kb3QgPSBwYXJzZUZsb2F0KGxvbmdzdHIxLnN1YnN0cmluZygzMywgNDMpKTtcbiAgc2F0cmVjLm5kZG90ID0gcGFyc2VGbG9hdChcIi5cIi5jb25jYXQocGFyc2VJbnQobG9uZ3N0cjEuc3Vic3RyaW5nKDQ0LCA1MCksIDEwKSwgXCJFXCIpLmNvbmNhdChsb25nc3RyMS5zdWJzdHJpbmcoNTAsIDUyKSkpO1xuICBzYXRyZWMuYnN0YXIgPSBwYXJzZUZsb2F0KFwiXCIuY29uY2F0KGxvbmdzdHIxLnN1YnN0cmluZyg1MywgNTQpLCBcIi5cIikuY29uY2F0KHBhcnNlSW50KGxvbmdzdHIxLnN1YnN0cmluZyg1NCwgNTkpLCAxMCksIFwiRVwiKS5jb25jYXQobG9uZ3N0cjEuc3Vic3RyaW5nKDU5LCA2MSkpKTsgLy8gc2F0cmVjLnNhdG51bSA9IGxvbmdzdHIyLnN1YnN0cmluZygyLCA3KTtcblxuICBzYXRyZWMuaW5jbG8gPSBwYXJzZUZsb2F0KGxvbmdzdHIyLnN1YnN0cmluZyg4LCAxNikpO1xuICBzYXRyZWMubm9kZW8gPSBwYXJzZUZsb2F0KGxvbmdzdHIyLnN1YnN0cmluZygxNywgMjUpKTtcbiAgc2F0cmVjLmVjY28gPSBwYXJzZUZsb2F0KFwiLlwiLmNvbmNhdChsb25nc3RyMi5zdWJzdHJpbmcoMjYsIDMzKSkpO1xuICBzYXRyZWMuYXJncG8gPSBwYXJzZUZsb2F0KGxvbmdzdHIyLnN1YnN0cmluZygzNCwgNDIpKTtcbiAgc2F0cmVjLm1vID0gcGFyc2VGbG9hdChsb25nc3RyMi5zdWJzdHJpbmcoNDMsIDUxKSk7XG4gIHNhdHJlYy5ubyA9IHBhcnNlRmxvYXQobG9uZ3N0cjIuc3Vic3RyaW5nKDUyLCA2MykpOyAvLyAtLS0tIGZpbmQgbm8sIG5kb3QsIG5kZG90IC0tLS1cblxuICBzYXRyZWMubm8gLz0geHBkb3RwOyAvLyAgIHJhZC9taW5cbiAgLy8gc2F0cmVjLm5kZG90PSBzYXRyZWMubmRkb3QgKiBNYXRoLnBvdygxMC4wLCBuZXhwKTtcbiAgLy8gc2F0cmVjLmJzdGFyPSBzYXRyZWMuYnN0YXIgKiBNYXRoLnBvdygxMC4wLCBpYmV4cCk7XG4gIC8vIC0tLS0gY29udmVydCB0byBzZ3A0IHVuaXRzIC0tLS1cblxuICBzYXRyZWMuYSA9IE1hdGgucG93KHNhdHJlYy5ubyAqIHR1bWluLCAtMi4wIC8gMy4wKTtcbiAgc2F0cmVjLm5kb3QgLz0geHBkb3RwICogMTQ0MC4wOyAvLyA/ICogbWlucGVyZGF5XG5cbiAgc2F0cmVjLm5kZG90IC89IHhwZG90cCAqIDE0NDAuMCAqIDE0NDA7IC8vIC0tLS0gZmluZCBzdGFuZGFyZCBvcmJpdGFsIGVsZW1lbnRzIC0tLS1cblxuICBzYXRyZWMuaW5jbG8gKj0gZGVnMnJhZDtcbiAgc2F0cmVjLm5vZGVvICo9IGRlZzJyYWQ7XG4gIHNhdHJlYy5hcmdwbyAqPSBkZWcycmFkO1xuICBzYXRyZWMubW8gKj0gZGVnMnJhZDtcbiAgc2F0cmVjLmFsdGEgPSBzYXRyZWMuYSAqICgxLjAgKyBzYXRyZWMuZWNjbykgLSAxLjA7XG4gIHNhdHJlYy5hbHRwID0gc2F0cmVjLmEgKiAoMS4wIC0gc2F0cmVjLmVjY28pIC0gMS4wOyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGZpbmQgc2dwNGVwb2NoIHRpbWUgb2YgZWxlbWVudCBzZXRcbiAgLy8gcmVtZW1iZXIgdGhhdCBzZ3A0IHVzZXMgdW5pdHMgb2YgZGF5cyBmcm9tIDAgamFuIDE5NTAgKHNncDRlcG9jaClcbiAgLy8gYW5kIG1pbnV0ZXMgZnJvbSB0aGUgZXBvY2ggKHRpbWUpXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLSB0ZW1wIGZpeCBmb3IgeWVhcnMgZnJvbSAxOTU3LTIwNTYgLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyAtLS0tLS0tLS0gY29ycmVjdCBmaXggd2lsbCBvY2N1ciB3aGVuIHllYXIgaXMgNC1kaWdpdCBpbiB0bGUgLS0tLS0tLS0tXG5cbiAgaWYgKHNhdHJlYy5lcG9jaHlyIDwgNTcpIHtcbiAgICB5ZWFyID0gc2F0cmVjLmVwb2NoeXIgKyAyMDAwO1xuICB9IGVsc2Uge1xuICAgIHllYXIgPSBzYXRyZWMuZXBvY2h5ciArIDE5MDA7XG4gIH1cblxuICB2YXIgbWRobXNSZXN1bHQgPSBkYXlzMm1kaG1zKHllYXIsIHNhdHJlYy5lcG9jaGRheXMpO1xuICB2YXIgbW9uID0gbWRobXNSZXN1bHQubW9uLFxuICAgICAgZGF5ID0gbWRobXNSZXN1bHQuZGF5LFxuICAgICAgaHIgPSBtZGhtc1Jlc3VsdC5ocixcbiAgICAgIG1pbnV0ZSA9IG1kaG1zUmVzdWx0Lm1pbnV0ZSxcbiAgICAgIHNlYyA9IG1kaG1zUmVzdWx0LnNlYztcbiAgc2F0cmVjLmpkc2F0ZXBvY2ggPSBqZGF5KHllYXIsIG1vbiwgZGF5LCBociwgbWludXRlLCBzZWMpOyAvLyAgLS0tLS0tLS0tLS0tLS0tLSBpbml0aWFsaXplIHRoZSBvcmJpdCBhdCBzZ3A0ZXBvY2ggLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNncDRpbml0KHNhdHJlYywge1xuICAgIG9wc21vZGU6IG9wc21vZGUsXG4gICAgc2F0bjogc2F0cmVjLnNhdG51bSxcbiAgICBlcG9jaDogc2F0cmVjLmpkc2F0ZXBvY2ggLSAyNDMzMjgxLjUsXG4gICAgeGJzdGFyOiBzYXRyZWMuYnN0YXIsXG4gICAgeGVjY286IHNhdHJlYy5lY2NvLFxuICAgIHhhcmdwbzogc2F0cmVjLmFyZ3BvLFxuICAgIHhpbmNsbzogc2F0cmVjLmluY2xvLFxuICAgIHhtbzogc2F0cmVjLm1vLFxuICAgIHhubzogc2F0cmVjLm5vLFxuICAgIHhub2Rlbzogc2F0cmVjLm5vZGVvXG4gIH0pO1xuICByZXR1cm4gc2F0cmVjO1xufVxuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7XG4gIHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7XG59XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KGFycik7XG59XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikge1xuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXIpKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTtcbn1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbiAgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpO1xuICBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lO1xuICBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTtcbiAgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xufVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikge1xuICBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIGFycjJbaV0gPSBhcnJbaV07XG5cbiAgcmV0dXJuIGFycjI7XG59XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59XG5cbmZ1bmN0aW9uIHByb3BhZ2F0ZSgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfSAvLyBSZXR1cm4gYSBwb3NpdGlvbiBhbmQgdmVsb2NpdHkgdmVjdG9yIGZvciBhIGdpdmVuIGRhdGUgYW5kIHRpbWUuXG5cblxuICB2YXIgc2F0cmVjID0gYXJnc1swXTtcbiAgdmFyIGRhdGUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLCAxKTtcbiAgdmFyIGogPSBqZGF5LmFwcGx5KHZvaWQgMCwgX3RvQ29uc3VtYWJsZUFycmF5KGRhdGUpKTtcbiAgdmFyIG0gPSAoaiAtIHNhdHJlYy5qZHNhdGVwb2NoKSAqIG1pbnV0ZXNQZXJEYXk7XG4gIHJldHVybiBzZ3A0KHNhdHJlYywgbSk7XG59XG5cbmZ1bmN0aW9uIGRvcHBsZXJGYWN0b3IobG9jYXRpb24sIHBvc2l0aW9uLCB2ZWxvY2l0eSkge1xuICB2YXIgbWZhY3RvciA9IDcuMjkyMTE1RS01O1xuICB2YXIgYyA9IDI5OTc5Mi40NTg7IC8vIFNwZWVkIG9mIGxpZ2h0IGluIGttL3NcblxuICB2YXIgcmFuZ2UgPSB7XG4gICAgeDogcG9zaXRpb24ueCAtIGxvY2F0aW9uLngsXG4gICAgeTogcG9zaXRpb24ueSAtIGxvY2F0aW9uLnksXG4gICAgejogcG9zaXRpb24ueiAtIGxvY2F0aW9uLnpcbiAgfTtcbiAgcmFuZ2UudyA9IE1hdGguc3FydChNYXRoLnBvdyhyYW5nZS54LCAyKSArIE1hdGgucG93KHJhbmdlLnksIDIpICsgTWF0aC5wb3cocmFuZ2UueiwgMikpO1xuICB2YXIgcmFuZ2VWZWwgPSB7XG4gICAgeDogdmVsb2NpdHkueCArIG1mYWN0b3IgKiBsb2NhdGlvbi55LFxuICAgIHk6IHZlbG9jaXR5LnkgLSBtZmFjdG9yICogbG9jYXRpb24ueCxcbiAgICB6OiB2ZWxvY2l0eS56XG4gIH07XG5cbiAgZnVuY3Rpb24gc2lnbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA+PSAwID8gMSA6IC0xO1xuICB9XG5cbiAgdmFyIHJhbmdlUmF0ZSA9IChyYW5nZS54ICogcmFuZ2VWZWwueCArIHJhbmdlLnkgKiByYW5nZVZlbC55ICsgcmFuZ2UueiAqIHJhbmdlVmVsLnopIC8gcmFuZ2UudztcbiAgcmV0dXJuIDEgKyByYW5nZVJhdGUgLyBjICogc2lnbihyYW5nZVJhdGUpO1xufVxuXG5mdW5jdGlvbiByYWRpYW5zVG9EZWdyZWVzKHJhZGlhbnMpIHtcbiAgcmV0dXJuIHJhZGlhbnMgKiByYWQyZGVnO1xufVxuXG5mdW5jdGlvbiBkZWdyZWVzVG9SYWRpYW5zKGRlZ3JlZXMpIHtcbiAgcmV0dXJuIGRlZ3JlZXMgKiBkZWcycmFkO1xufVxuXG5mdW5jdGlvbiBkZWdyZWVzTGF0KHJhZGlhbnMpIHtcbiAgaWYgKHJhZGlhbnMgPCAtcGkgLyAyIHx8IHJhZGlhbnMgPiBwaSAvIDIpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignTGF0aXR1ZGUgcmFkaWFucyBtdXN0IGJlIGluIHJhbmdlIFstcGkvMjsgcGkvMl0uJyk7XG4gIH1cblxuICByZXR1cm4gcmFkaWFuc1RvRGVncmVlcyhyYWRpYW5zKTtcbn1cblxuZnVuY3Rpb24gZGVncmVlc0xvbmcocmFkaWFucykge1xuICBpZiAocmFkaWFucyA8IC1waSB8fCByYWRpYW5zID4gcGkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignTG9uZ2l0dWRlIHJhZGlhbnMgbXVzdCBiZSBpbiByYW5nZSBbLXBpOyBwaV0uJyk7XG4gIH1cblxuICByZXR1cm4gcmFkaWFuc1RvRGVncmVlcyhyYWRpYW5zKTtcbn1cblxuZnVuY3Rpb24gcmFkaWFuc0xhdChkZWdyZWVzKSB7XG4gIGlmIChkZWdyZWVzIDwgLTkwIHx8IGRlZ3JlZXMgPiA5MCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdMYXRpdHVkZSBkZWdyZWVzIG11c3QgYmUgaW4gcmFuZ2UgWy05MDsgOTBdLicpO1xuICB9XG5cbiAgcmV0dXJuIGRlZ3JlZXNUb1JhZGlhbnMoZGVncmVlcyk7XG59XG5cbmZ1bmN0aW9uIHJhZGlhbnNMb25nKGRlZ3JlZXMpIHtcbiAgaWYgKGRlZ3JlZXMgPCAtMTgwIHx8IGRlZ3JlZXMgPiAxODApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignTG9uZ2l0dWRlIGRlZ3JlZXMgbXVzdCBiZSBpbiByYW5nZSBbLTE4MDsgMTgwXS4nKTtcbiAgfVxuXG4gIHJldHVybiBkZWdyZWVzVG9SYWRpYW5zKGRlZ3JlZXMpO1xufVxuXG5mdW5jdGlvbiBnZW9kZXRpY1RvRWNmKGdlb2RldGljKSB7XG4gIHZhciBsb25naXR1ZGUgPSBnZW9kZXRpYy5sb25naXR1ZGUsXG4gICAgICBsYXRpdHVkZSA9IGdlb2RldGljLmxhdGl0dWRlLFxuICAgICAgaGVpZ2h0ID0gZ2VvZGV0aWMuaGVpZ2h0O1xuICB2YXIgYSA9IDYzNzguMTM3O1xuICB2YXIgYiA9IDYzNTYuNzUyMzE0MjtcbiAgdmFyIGYgPSAoYSAtIGIpIC8gYTtcbiAgdmFyIGUyID0gMiAqIGYgLSBmICogZjtcbiAgdmFyIG5vcm1hbCA9IGEgLyBNYXRoLnNxcnQoMSAtIGUyICogKE1hdGguc2luKGxhdGl0dWRlKSAqIE1hdGguc2luKGxhdGl0dWRlKSkpO1xuICB2YXIgeCA9IChub3JtYWwgKyBoZWlnaHQpICogTWF0aC5jb3MobGF0aXR1ZGUpICogTWF0aC5jb3MobG9uZ2l0dWRlKTtcbiAgdmFyIHkgPSAobm9ybWFsICsgaGVpZ2h0KSAqIE1hdGguY29zKGxhdGl0dWRlKSAqIE1hdGguc2luKGxvbmdpdHVkZSk7XG4gIHZhciB6ID0gKG5vcm1hbCAqICgxIC0gZTIpICsgaGVpZ2h0KSAqIE1hdGguc2luKGxhdGl0dWRlKTtcbiAgcmV0dXJuIHtcbiAgICB4OiB4LFxuICAgIHk6IHksXG4gICAgejogelxuICB9O1xufVxuXG5mdW5jdGlvbiBlY2lUb0dlb2RldGljKGVjaSwgZ21zdCkge1xuICAvLyBodHRwOi8vd3d3LmNlbGVzdHJhay5jb20vY29sdW1ucy92MDJuMDMvXG4gIHZhciBhID0gNjM3OC4xMzc7XG4gIHZhciBiID0gNjM1Ni43NTIzMTQyO1xuICB2YXIgUiA9IE1hdGguc3FydChlY2kueCAqIGVjaS54ICsgZWNpLnkgKiBlY2kueSk7XG4gIHZhciBmID0gKGEgLSBiKSAvIGE7XG4gIHZhciBlMiA9IDIgKiBmIC0gZiAqIGY7XG4gIHZhciBsb25naXR1ZGUgPSBNYXRoLmF0YW4yKGVjaS55LCBlY2kueCkgLSBnbXN0O1xuXG4gIHdoaWxlIChsb25naXR1ZGUgPCAtcGkpIHtcbiAgICBsb25naXR1ZGUgKz0gdHdvUGk7XG4gIH1cblxuICB3aGlsZSAobG9uZ2l0dWRlID4gcGkpIHtcbiAgICBsb25naXR1ZGUgLT0gdHdvUGk7XG4gIH1cblxuICB2YXIga21heCA9IDIwO1xuICB2YXIgayA9IDA7XG4gIHZhciBsYXRpdHVkZSA9IE1hdGguYXRhbjIoZWNpLnosIE1hdGguc3FydChlY2kueCAqIGVjaS54ICsgZWNpLnkgKiBlY2kueSkpO1xuICB2YXIgQztcblxuICB3aGlsZSAoayA8IGttYXgpIHtcbiAgICBDID0gMSAvIE1hdGguc3FydCgxIC0gZTIgKiAoTWF0aC5zaW4obGF0aXR1ZGUpICogTWF0aC5zaW4obGF0aXR1ZGUpKSk7XG4gICAgbGF0aXR1ZGUgPSBNYXRoLmF0YW4yKGVjaS56ICsgYSAqIEMgKiBlMiAqIE1hdGguc2luKGxhdGl0dWRlKSwgUik7XG4gICAgayArPSAxO1xuICB9XG5cbiAgdmFyIGhlaWdodCA9IFIgLyBNYXRoLmNvcyhsYXRpdHVkZSkgLSBhICogQztcbiAgcmV0dXJuIHtcbiAgICBsb25naXR1ZGU6IGxvbmdpdHVkZSxcbiAgICBsYXRpdHVkZTogbGF0aXR1ZGUsXG4gICAgaGVpZ2h0OiBoZWlnaHRcbiAgfTtcbn1cblxuZnVuY3Rpb24gZWNmVG9FY2koZWNmLCBnbXN0KSB7XG4gIC8vIGNjYXIuY29sb3JhZG8uZWR1L0FTRU41MDcwL2hhbmRvdXRzL2Nvb3Jkc3lzLmRvY1xuICAvL1xuICAvLyBbWF0gICAgIFtDIC1TICAwXVtYXVxuICAvLyBbWV0gID0gIFtTICBDICAwXVtZXVxuICAvLyBbWl1lY2kgIFswICAwICAxXVtaXWVjZlxuICAvL1xuICB2YXIgWCA9IGVjZi54ICogTWF0aC5jb3MoZ21zdCkgLSBlY2YueSAqIE1hdGguc2luKGdtc3QpO1xuICB2YXIgWSA9IGVjZi54ICogTWF0aC5zaW4oZ21zdCkgKyBlY2YueSAqIE1hdGguY29zKGdtc3QpO1xuICB2YXIgWiA9IGVjZi56O1xuICByZXR1cm4ge1xuICAgIHg6IFgsXG4gICAgeTogWSxcbiAgICB6OiBaXG4gIH07XG59XG5cbmZ1bmN0aW9uIGVjaVRvRWNmKGVjaSwgZ21zdCkge1xuICAvLyBjY2FyLmNvbG9yYWRvLmVkdS9BU0VONTA3MC9oYW5kb3V0cy9jb29yZHN5cy5kb2NcbiAgLy9cbiAgLy8gW1hdICAgICBbQyAtUyAgMF1bWF1cbiAgLy8gW1ldICA9ICBbUyAgQyAgMF1bWV1cbiAgLy8gW1pdZWNpICBbMCAgMCAgMV1bWl1lY2ZcbiAgLy9cbiAgLy9cbiAgLy8gSW52ZXJzZTpcbiAgLy8gW1hdICAgICBbQyAgUyAgMF1bWF1cbiAgLy8gW1ldICA9ICBbLVMgQyAgMF1bWV1cbiAgLy8gW1pdZWNmICBbMCAgMCAgMV1bWl1lY2lcbiAgdmFyIHggPSBlY2kueCAqIE1hdGguY29zKGdtc3QpICsgZWNpLnkgKiBNYXRoLnNpbihnbXN0KTtcbiAgdmFyIHkgPSBlY2kueCAqIC1NYXRoLnNpbihnbXN0KSArIGVjaS55ICogTWF0aC5jb3MoZ21zdCk7XG4gIHZhciB6ID0gZWNpLno7XG4gIHJldHVybiB7XG4gICAgeDogeCxcbiAgICB5OiB5LFxuICAgIHo6IHpcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9wb2NlbnRyaWMob2JzZXJ2ZXJHZW9kZXRpYywgc2F0ZWxsaXRlRWNmKSB7XG4gIC8vIGh0dHA6Ly93d3cuY2VsZXN0cmFrLmNvbS9jb2x1bW5zL3YwMm4wMi9cbiAgLy8gVFMgS2Vsc28ncyBtZXRob2QsIGV4Y2VwdCBJJ20gdXNpbmcgRUNGIGZyYW1lXG4gIC8vIGFuZCBoZSB1c2VzIEVDSS5cbiAgdmFyIGxvbmdpdHVkZSA9IG9ic2VydmVyR2VvZGV0aWMubG9uZ2l0dWRlLFxuICAgICAgbGF0aXR1ZGUgPSBvYnNlcnZlckdlb2RldGljLmxhdGl0dWRlO1xuICB2YXIgb2JzZXJ2ZXJFY2YgPSBnZW9kZXRpY1RvRWNmKG9ic2VydmVyR2VvZGV0aWMpO1xuICB2YXIgcnggPSBzYXRlbGxpdGVFY2YueCAtIG9ic2VydmVyRWNmLng7XG4gIHZhciByeSA9IHNhdGVsbGl0ZUVjZi55IC0gb2JzZXJ2ZXJFY2YueTtcbiAgdmFyIHJ6ID0gc2F0ZWxsaXRlRWNmLnogLSBvYnNlcnZlckVjZi56O1xuICB2YXIgdG9wUyA9IE1hdGguc2luKGxhdGl0dWRlKSAqIE1hdGguY29zKGxvbmdpdHVkZSkgKiByeCArIE1hdGguc2luKGxhdGl0dWRlKSAqIE1hdGguc2luKGxvbmdpdHVkZSkgKiByeSAtIE1hdGguY29zKGxhdGl0dWRlKSAqIHJ6O1xuICB2YXIgdG9wRSA9IC1NYXRoLnNpbihsb25naXR1ZGUpICogcnggKyBNYXRoLmNvcyhsb25naXR1ZGUpICogcnk7XG4gIHZhciB0b3BaID0gTWF0aC5jb3MobGF0aXR1ZGUpICogTWF0aC5jb3MobG9uZ2l0dWRlKSAqIHJ4ICsgTWF0aC5jb3MobGF0aXR1ZGUpICogTWF0aC5zaW4obG9uZ2l0dWRlKSAqIHJ5ICsgTWF0aC5zaW4obGF0aXR1ZGUpICogcno7XG4gIHJldHVybiB7XG4gICAgdG9wUzogdG9wUyxcbiAgICB0b3BFOiB0b3BFLFxuICAgIHRvcFo6IHRvcFpcbiAgfTtcbn1cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHRjXG4gKiBAcGFyYW0ge051bWJlcn0gdGMudG9wUyBQb3NpdGl2ZSBob3Jpem9udGFsIHZlY3RvciBTIGR1ZSBzb3V0aC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB0Yy50b3BFIFBvc2l0aXZlIGhvcml6b250YWwgdmVjdG9yIEUgZHVlIGVhc3QuXG4gKiBAcGFyYW0ge051bWJlcn0gdGMudG9wWiBWZWN0b3IgWiBub3JtYWwgdG8gdGhlIHN1cmZhY2Ugb2YgdGhlIGVhcnRoICh1cCkuXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG5cblxuZnVuY3Rpb24gdG9wb2NlbnRyaWNUb0xvb2tBbmdsZXModGMpIHtcbiAgdmFyIHRvcFMgPSB0Yy50b3BTLFxuICAgICAgdG9wRSA9IHRjLnRvcEUsXG4gICAgICB0b3BaID0gdGMudG9wWjtcbiAgdmFyIHJhbmdlU2F0ID0gTWF0aC5zcXJ0KHRvcFMgKiB0b3BTICsgdG9wRSAqIHRvcEUgKyB0b3BaICogdG9wWik7XG4gIHZhciBFbCA9IE1hdGguYXNpbih0b3BaIC8gcmFuZ2VTYXQpO1xuICB2YXIgQXogPSBNYXRoLmF0YW4yKC10b3BFLCB0b3BTKSArIHBpO1xuICByZXR1cm4ge1xuICAgIGF6aW11dGg6IEF6LFxuICAgIGVsZXZhdGlvbjogRWwsXG4gICAgcmFuZ2VTYXQ6IHJhbmdlU2F0IC8vIFJhbmdlIGluIGttXG5cbiAgfTtcbn1cblxuZnVuY3Rpb24gZWNmVG9Mb29rQW5nbGVzKG9ic2VydmVyR2VvZGV0aWMsIHNhdGVsbGl0ZUVjZikge1xuICB2YXIgdG9wb2NlbnRyaWNDb29yZHMgPSB0b3BvY2VudHJpYyhvYnNlcnZlckdlb2RldGljLCBzYXRlbGxpdGVFY2YpO1xuICByZXR1cm4gdG9wb2NlbnRyaWNUb0xvb2tBbmdsZXModG9wb2NlbnRyaWNDb29yZHMpO1xufVxuXG5leHBvcnQgeyBjb25zdGFudHMsIGRlZ3JlZXNMYXQsIGRlZ3JlZXNMb25nLCBkZWdyZWVzVG9SYWRpYW5zLCBkb3BwbGVyRmFjdG9yLCBlY2ZUb0VjaSwgZWNmVG9Mb29rQW5nbGVzLCBlY2lUb0VjZiwgZWNpVG9HZW9kZXRpYywgZ2VvZGV0aWNUb0VjZiwgZ3N0aW1lLCBpbnZqZGF5LCBqZGF5LCBwcm9wYWdhdGUsIHJhZGlhbnNMYXQsIHJhZGlhbnNMb25nLCByYWRpYW5zVG9EZWdyZWVzLCBzZ3A0LCB0d29saW5lMnNhdHJlYyB9OyIsIi8vIGNvbnN0IGluaXQgPSB7XG4vLyAgIG1ldGhvZDogXCJHRVRcIixcbi8vICAgaGVhZGVyczogXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIixcbi8vICAgbW9kZTogXCJjb3JzXCIsXG4vLyAgIGNhY2hlOiBcImRlZmF1bHRcIixcbi8vIH07XG5cbmNvbnN0IGF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xuXG5sZXQgaXNibiA9IFwiMDIwMTU1ODAyNVwiO1xuXG5jb25zdCByZWNlaXZlRGF0YSA9IGF4aW9zXG4gIC5nZXQoYC9zYXRlbGxpdGVzL2FjdGl2ZWApXG4gIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0pXG4gIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH0pO1xuXG5leHBvcnQgZGVmYXVsdCByZWNlaXZlRGF0YTtcbiIsImNvbnN0IGhhbmRsZVBsYXkgPSAoYXVkaW9Db250ZXh0KSA9PiB7XG4gIC8vIGRlYnVnZ2VyO1xuICBjb25zdCBhdWRpb0N0eCA9IGF1ZGlvQ29udGV4dDtcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5X3BhdXNlXCIpO1xuICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICBcImNsaWNrXCIsXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coXCJjbGlja2VkXCIpO1xuICAgICAgaWYgKGF1ZGlvQ3R4LnN0YXRlID09PSBcInN1c3BlbmRlZFwiKSB7XG4gICAgICAgIGF1ZGlvQ3R4LnJlc3VtZSgpO1xuICAgICAgICB2YXIgb3NjaWxsYXRvciA9IGF1ZGlvQ3R4LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblxuICAgICAgICBvc2NpbGxhdG9yLnR5cGUgPSBcInNxdWFyZVwiO1xuICAgICAgICBvc2NpbGxhdG9yLmZyZXF1ZW5jeS52YWx1ZSA9IDQ0MDsgLy8gdmFsdWUgaW4gaGVydHpcbiAgICAgICAgb3NjaWxsYXRvci5zdGFydCgwKTtcbiAgICAgICAgLy8gb3NjaWxsYXRvci5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcbiAgICAgICAgLy8gZGVidWdnZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdWRpb0N0eC5zdXNwZW5kKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBmYWxzZVxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlUGxheTtcbiIsImltcG9ydCBTYXRlbGxpdGUgZnJvbSBcIi4vc2F0ZWxsaXRlLmpzXCI7XG5pbXBvcnQgU3RhciBmcm9tIFwiLi9zdGFyLmpzXCI7XG5pbXBvcnQgeyBzZ3A0IH0gZnJvbSBcInNhdGVsbGl0ZS5qc1wiO1xuY2xhc3MgR2FtZSB7XG4gIGNvbnN0cnVjdG9yKHhEaW0sIHlEaW0sIHRsZSwgYXVkaW9DdHgpIHtcbiAgICB0aGlzLnhEaW0gPSB4RGltO1xuICAgIHRoaXMueURpbSA9IHlEaW07XG4gICAgdGhpcy5zYXRlbGxpdGVzID0gW107XG4gICAgdGhpcy5zdGFycyA9IFtdO1xuICAgIHRoaXMudGxlID0gdGxlO1xuICAgIHRoaXMuYXVkaW9DdHggPSBhdWRpb0N0eDtcbiAgICB0aGlzLmFkZFNhdGVsbGl0ZXModGxlKTtcbiAgICB0aGlzLmFkZFN0YXJzKCk7XG4gIH1cblxuICByYW5kb21Qb3MoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMueERpbSksXG4gICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnlEaW0pLFxuICAgIF07XG4gIH1cbiAgYWRkU3RhcnMoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNzAwOyBpKyspIHtcbiAgICAgIGxldCBjdXJyZW50U3RhciA9IG5ldyBTdGFyKHRoaXMucmFuZG9tUG9zKCksIHRoaXMpO1xuICAgICAgdGhpcy5zdGFycy5wdXNoKGN1cnJlbnRTdGFyKTtcbiAgICB9XG4gIH1cbiAgYWRkU2F0ZWxsaXRlcyh0bGUpIHtcbiAgICBjb25zdCBzYXRyZWMgPSBzYXRlbGxpdGUudHdvbGluZTJzYXRyZWMoXG4gICAgICB0aGlzLnRsZS5zcGxpdChcIlxcblwiKVswXS50cmltKCksXG4gICAgICB0aGlzLnRsZS5zcGxpdChcIlxcblwiKVsxXS50cmltKClcbiAgICApO1xuICAgIC8vIGRlYnVnZ2VyO1xuXG4gICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgIC8vICAgLy8gZGVidWdnZXI7XG4gICAgLy8gICBjb25zb2xlLmxvZyhzYXRlbGxpdGVzT2JqW2ldKTtcbiAgICBsZXQgY3VycmVudFNhdGVsbGl0ZSA9IG5ldyBTYXRlbGxpdGUoc2F0cmVjLCB0aGlzKTtcbiAgICB0aGlzLnNhdGVsbGl0ZXMucHVzaChjdXJyZW50U2F0ZWxsaXRlKTtcbiAgICAvLyB9XG4gIH1cblxuICBkcmF3KGN0eCkge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy54RGltLCB0aGlzLnlEaW0pO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMueERpbSwgdGhpcy55RGltKTtcbiAgICB0aGlzLnN0YXJzLmZvckVhY2goKHN0YXIpID0+IHN0YXIuZHJhdyhjdHgpKTtcbiAgICB0aGlzLnNhdGVsbGl0ZXMuZm9yRWFjaCgoc2F0ZWxsaXRlKSA9PiBzYXRlbGxpdGUuZHJhdyhjdHgpKTtcbiAgfVxuXG4gIG1vdmUoY3R4KSB7XG4gICAgdGhpcy5zYXRlbGxpdGVzLmZvckVhY2goKHNhdGVsbGl0ZSkgPT4gc2F0ZWxsaXRlLm1vdmUoY3R4KSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcbiIsImltcG9ydCBHYW1lIGZyb20gXCIuL2dhbWVcIjtcblxuY2xhc3MgR2FtZVZpZXcge1xuICBjb25zdHJ1Y3RvcihnYW1lLCBjdHgpIHtcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgY29uc3Qgb3V0ZXIgPSB0aGlzO1xuICAgIHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgb3V0ZXIuZ2FtZS54RGltID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICBvdXRlci5nYW1lLnlEaW0gPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICBvdXRlci5nYW1lLm1vdmUob3V0ZXIuY3R4KTtcbiAgICAgIG91dGVyLmdhbWUuZHJhdyhvdXRlci5jdHgpO1xuICAgIH0sIDEwMDApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVWaWV3O1xuIiwiY29uc3QgbWFwX3JhbmdlID0gKHZhbHVlLCBsb3cxLCBoaWdoMSwgbG93MiwgaGlnaDIpID0+IHtcbiAgcmV0dXJuIGxvdzIgKyAoKGhpZ2gyIC0gbG93MikgKiAodmFsdWUgLSBsb3cxKSkgLyAoaGlnaDEgLSBsb3cxKTtcbn07XG5cbmNvbnN0IHJhZGlhbnNUb0RlZ3JlZXMgPSAocmFkaWFucykgPT4ge1xuICByZXR1cm4gKHJhZGlhbnMgKiAxODApIC8gTWF0aC5QSTtcbn07XG5cbmNvbnN0IGRlZ3JlZXNUb1JhZGlhbnMgPSAoZGVncmVlcykgPT4ge1xuICByZXR1cm4gZGVncmVlcyAqIChNYXRoLlBJIC8gMTgwKTtcbn07XG5leHBvcnQgZGVmYXVsdCBtYXBfcmFuZ2U7XG4iLCJpbXBvcnQgbWFwX3JhbmdlIGZyb20gXCIuL21hdGhfdXRpbFwiO1xuY2xhc3MgU2F0ZWxsaXRlIHtcbiAgY29uc3RydWN0b3Ioc2F0UmVjLCBnYW1lKSB7XG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUoKTtcbiAgICB0aGlzLnBvc2l0aW9uQW5kVmVsb2NpdHkgPSBzYXRlbGxpdGUucHJvcGFnYXRlKHNhdFJlYywgdGhpcy5kYXRlKTtcbiAgICB0aGlzLmdtc3QgPSBzYXRlbGxpdGUuZ3N0aW1lKHRoaXMuZGF0ZSk7XG5cbiAgICB0aGlzLnBvc2l0aW9uID0gc2F0ZWxsaXRlLmVjaVRvR2VvZGV0aWMoXG4gICAgICB0aGlzLnBvc2l0aW9uQW5kVmVsb2NpdHkucG9zaXRpb24sXG4gICAgICB0aGlzLmdtc3RcbiAgICApO1xuXG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICB0aGlzLmF1ZGlvQ3R4ID0gZ2FtZS5hdWRpb0N0eDtcblxuICAgIGNvbnNvbGUubG9nKHRoaXMucG9zaXRpb24ubG9uZ2l0dWRlKTsgLy8gaW4gcmFkaWFuc1xuICAgIGNvbnNvbGUubG9nKHRoaXMucG9zaXRpb24ubGF0aXR1ZGUpOyAvLyBpbiByYWRpYW5zXG4gICAgY29uc29sZS5sb2codGhpcy5wb3NpdGlvbi5oZWlnaHQpOyAvLyBpbiBrbVxuICB9XG5cbiAgc3RhcnRPc2MoKSB7XG4gICAgdGhpcy5vc2NpbGxhdG9yLnR5cGUgPSBcInNpbmVcIjtcbiAgICBkZWJ1Z2dlcjtcbiAgICBjb25zdCBuZXdGcmVxID0gbWFwX3JhbmdlKHRoaXMucG9zWzFdLCAwLCB0aGlzLmdhbWUueURpbSwgMCwgMjAwMDApO1xuICAgIGNvbnNvbGUubG9nKG5ld0ZyZXEpO1xuICAgIHRoaXMub3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSBuZXdGcmVxO1xuICAgIC8vIGRlYnVnZ2VyO1xuICAgIGNvbnN0IGdhaW5Ob2RlID0gdGhpcy5hdWRpb0N0eC5jcmVhdGVHYWluKCk7XG4gICAgZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IDAuMDAxOyAvLyAxMCAlXG4gICAgZ2Fpbk5vZGUuY29ubmVjdCh0aGlzLmF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcblxuICAgIC8vIG5vdyBpbnN0ZWFkIG9mIGNvbm5lY3RpbmcgdG8gYUN0eC5kZXN0aW5hdGlvbiwgY29ubmVjdCB0byB0aGUgZ2Fpbk5vZGVcbiAgICB0aGlzLm9zY2lsbGF0b3IuY29ubmVjdChnYWluTm9kZSk7XG4gICAgLy8gdGhpcy5vc2NpbGxhdG9yLmNvbm5lY3QodGhpcy5hdWRpb0N0eC5kZXN0aW5hdGlvbik7XG4gICAgdGhpcy5vc2NpbGxhdG9yLnN0YXJ0KDApO1xuICB9XG5cbiAgZHJhdyhjdHgpIHtcbiAgICAvLyBjdHguYmVnaW5QYXRoKCk7XG4gICAgLy8gY3R4LmFyYyh0aGlzLnBvc1swXSwgdGhpcy5wb3NbMV0sIDIsIDAsIDIgKiBNYXRoLlBJLCB0cnVlKTtcbiAgICAvLyBjdHguc3Ryb2tlU3R5bGUgPSBcImJsdWVcIjtcbiAgICAvLyBjdHgubGluZVdpZHRoID0gMTA7XG4gICAgLy8gY3R4LmZpbGxTdHlsZSA9IFwiIzQ2QzAxNlwiO1xuICAgIC8vIGN0eC5maWxsKCk7XG4gICAgLy8gY29uc3QgbmV3RnJlcSA9IG1hcF9yYW5nZSh0aGlzLnBvc1sxXSwgMCwgdGhpcy5nYW1lLnlEaW0sIDAsIDIwMDAwKTtcbiAgICAvLyAvLyBjb25zb2xlLmxvZyhuZXdGcmVxKTtcbiAgICAvLyBkZWJ1Z2dlcjtcbiAgICAvLyB0aGlzLm9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gbmV3RnJlcTtcbiAgfVxuXG4gIG1vdmUoKSB7XG4gICAgLy8gdGhpcy5wb3NbMF0gKz0gdGhpcy52ZWxbMF07XG4gICAgLy8gdGhpcy5wb3NbMV0gKz0gdGhpcy52ZWxbMV07XG4gICAgLy8gZGVidWdnZXI7XG4gICAgLy8gaWYgKHRoaXMuaXNPdXRPZkJvdW5kcyh0aGlzLnBvcykpIHtcbiAgICAvLyAgIHRoaXMucG9zID0gW1xuICAgIC8vICAgICB0aGlzLndyYXAodGhpcy5wb3NbMF0sIHRoaXMuZ2FtZS54RGltKSxcbiAgICAvLyAgICAgdGhpcy53cmFwKHRoaXMucG9zWzFdLCB0aGlzLmdhbWUueURpbSksXG4gICAgLy8gICBdO1xuICAgIC8vIH1cbiAgfVxuICBpc091dE9mQm91bmRzKHBvcykge1xuICAgIC8vIGRlYnVnZ2VyO1xuICAgIHJldHVybiAoXG4gICAgICBwb3NbMF0gPCAwIHx8XG4gICAgICBwb3NbMV0gPCAwIHx8XG4gICAgICBwb3NbMF0gPiB0aGlzLmdhbWUueERpbSB8fFxuICAgICAgcG9zWzFdID4gdGhpcy5nYW1lLnlEaW1cbiAgICApO1xuICB9XG5cbiAgd3JhcChjb29yZCwgbWF4KSB7XG4gICAgaWYgKGNvb3JkIDwgMCkge1xuICAgICAgcmV0dXJuIG1heCAtIChjb29yZCAlIG1heCk7XG4gICAgfSBlbHNlIGlmIChjb29yZCA+IG1heCkge1xuICAgICAgcmV0dXJuIGNvb3JkICUgbWF4O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY29vcmQ7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNhdGVsbGl0ZTtcbiIsImNsYXNzIFN0YXIge1xuICBjb25zdHJ1Y3Rvcihwb3MsIGdhbWUpIHtcbiAgICB0aGlzLnBvcyA9IHBvcztcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIHRoaXMueFZhbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEpICsgMTtcbiAgICB0aGlzLnlWYWwgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxKSArIDE7XG4gIH1cblxuICBkcmF3KGN0eCkge1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zWzBdLCB0aGlzLnBvc1sxXSwgdGhpcy54VmFsLCB0aGlzLnlWYWwpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXI7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL3N0eWxlcy9pbmRleC5zY3NzXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9zY3JpcHRzL2dhbWVcIjtcbmltcG9ydCBHYW1lVmlldyBmcm9tIFwiLi9zY3JpcHRzL2dhbWVfdmlld1wiO1xuaW1wb3J0IHJlY2VpdmVEYXRhIGZyb20gXCIuL3NjcmlwdHMvYXBpX3V0aWxcIjtcbmltcG9ydCBoYW5kbGVQbGF5IGZyb20gXCIuL3NjcmlwdHMvYnV0dG9uX3V0aWxcIjtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoZXZlbnQpID0+IHtcbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIik7XG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gIGNvbnN0IGF1ZGlvQ3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICBoYW5kbGVQbGF5KGF1ZGlvQ3R4KTtcblxuICAvLyByZWNlaXZlRGF0YS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAvLyBkZWJ1Z2dlcjtcbiAgY29uc3QgSVNTX1RMRSA9IGAxIDI1NTQ0VSA5ODA2N0EgICAyMTEyMi43NTYxNjcwMCAgLjAwMDI3OTgwICAwMDAwMC0wICA1MTQzMi0zIDAgIDk5OTRcbiAgICAgMiAyNTU0NCAgNTEuNjQ0MiAyMDcuNDQ0OSAwMDAyNzY5IDMxMC4xMTg5IDE5My42NTY4IDE1LjQ4OTkzNTI3MjgxNTUzYDtcbiAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNvbnN0IGcgPSBuZXcgR2FtZShjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsIElTU19UTEUsIGF1ZGlvQ3R4KTtcbiAgY29uc3QgZ2FtZXZpZXcgPSBuZXcgR2FtZVZpZXcoZywgY3R4KTtcbiAgZ2FtZXZpZXcuc3RhcnQoKTtcbiAgLy8gfSk7XG5cbiAgLy8gbmV3IEdhbWUoY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KS5zdGFydChjYW52YXMpO1xufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9