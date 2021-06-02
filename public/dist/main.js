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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

 // import { scene, camera, renderer } from "./three/three_map";

var GameView = /*#__PURE__*/function () {
  function GameView(tle) {
    var _this = this;

    _classCallCheck(this, GameView);

    _defineProperty(this, "satelliteVector", function (satrec, date) {
      debugger;

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

    this.tle = tle;
    this.satRecs = [];
    this.addSatelites();
    this.date = new Date().getTime();
  }

  _createClass(GameView, [{
    key: "addSatelites",
    value: function addSatelites() {
      var satrec = satellite.twoline2satrec(this.tle.split("\n")[0].trim(), this.tle.split("\n")[1].trim()); // let currentSatellite = new Satellite(satrec, this);

      this.satRecs.push(satrec);
      debugger;
    }
  }, {
    key: "start",
    value: function start() {
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      var date = new Date();
      var canvasEle = document.getElementById("canvas"); // debugger;

      console.log(canvasEle);
      var renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasEle
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x00fff0, 0); // sets background to clear color
      // document.body.appendChild(renderer.domElement);
      // const geometry = new THREE.BoxGeometry();
      // const material = new THREE.MeshBasicMaterial({ color: 0xff00f0 });
      // const cube = new THREE.Mesh(geometry, material);
      // scene.add(cube);

      var geometry = new THREE.SphereGeometry(100, 32, 32);
      var wireframe = new THREE.WireframeGeometry(geometry);
      var line = new THREE.LineSegments(wireframe);
      line.material.depthTest = false; // line.material.line.material.opacity = 0.25;

      line.material.transparent = true;
      scene.add(line);
      var satGeometry = new THREE.Geometry(); // const date = new Date(activeClock.date());
      // console.log(this.satRecs);

      var satelliteVectorFunc = this.satelliteVector;
      satGeometry.vertices = this.satRecs.map(function (satrec) {
        return satelliteVectorFunc(satrec, date);
      });
      var satellites = new THREE.Points(satGeometry, new THREE.PointsMaterial({
        color: "pink",
        size: 100
      }));
      scene.add(satellites); // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      // const sphere = new THREE.Mesh(geometry, material);
      // scene.add(sphere);

      var satRecs = this.satRecs;
      camera.position.z = 1000;
      camera.position.x = -200;
      camera.position.y = 500;

      var animate = function animate() {
        // game.draw(ctx);
        var date = new Date();
        requestAnimationFrame(animate); // cube.rotation.x += 0.01;

        line.rotation.y += 0.001; // debugger;

        debugger;

        for (var i = 0; i < satRecs.length; i++) {
          debugger;
          satellites.geometry.vertices[i] = satelliteVectorFunc(satRecs[i], date);
        }

        renderer.render(scene, camera);
      };

      animate(); //     outer.game.xDim = window.innerWidth;
      //     outer.game.yDim = window.innerHeight;
      //   }, 1000);
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
  // gameview.start();
  var canvas = document.getElementById("canvas"); // const ctx = canvas.getContext("2d");

  var audioCtx = new AudioContext();
  (0,_scripts_button_util__WEBPACK_IMPORTED_MODULE_4__.default)(audioCtx); // receiveData.then((response) => {

  var ISS_TLE = "1 25544U 98067A   21122.75616700  .00027980  00000-0  51432-3 0  9994\n     2 25544  51.6442 207.4449 0002769 310.1189 193.6568 15.48993527281553";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var g = new _scripts_game__WEBPACK_IMPORTED_MODULE_1__.default(canvas.width, canvas.height, ISS_TLE, audioCtx);
  var gameview = new _scripts_game_view__WEBPACK_IMPORTED_MODULE_2__.default(ISS_TLE);
  gameview.start(); // });
  // new Game(canvas.width, canvas.height).start(canvas);
});
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL25vZGVfbW9kdWxlcy9zYXRlbGxpdGUuanMvZGlzdC9zYXRlbGxpdGUuZXMuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vcHVibGljL3NyYy9zY3JpcHRzL2FwaV91dGlsLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL3B1YmxpYy9zcmMvc2NyaXB0cy9idXR0b25fdXRpbC5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9wdWJsaWMvc3JjL3NjcmlwdHMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9wdWJsaWMvc3JjL3NjcmlwdHMvZ2FtZV92aWV3LmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL3B1YmxpYy9zcmMvc2NyaXB0cy9tYXRoX3V0aWwuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vcHVibGljL3NyYy9zY3JpcHRzL3NhdGVsbGl0ZS5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9wdWJsaWMvc3JjL3NjcmlwdHMvc3Rhci5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9wdWJsaWMvc3JjL3N0eWxlcy9pbmRleC5zY3NzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL3B1YmxpYy9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiYXhpb3MiLCJyZXF1aXJlIiwiaXNibiIsInJlY2VpdmVEYXRhIiwiZ2V0IiwidGhlbiIsInJlc3BvbnNlIiwiY29uc29sZSIsImxvZyIsImNhdGNoIiwiZXJyb3IiLCJoYW5kbGVQbGF5IiwiYXVkaW9Db250ZXh0IiwiYXVkaW9DdHgiLCJidXR0b24iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0YXRlIiwicmVzdW1lIiwib3NjaWxsYXRvciIsImNyZWF0ZU9zY2lsbGF0b3IiLCJ0eXBlIiwiZnJlcXVlbmN5IiwidmFsdWUiLCJzdGFydCIsInN1c3BlbmQiLCJHYW1lIiwieERpbSIsInlEaW0iLCJ0bGUiLCJzYXRlbGxpdGVzIiwic3RhcnMiLCJhZGRTYXRlbGxpdGVzIiwiYWRkU3RhcnMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJpIiwiY3VycmVudFN0YXIiLCJTdGFyIiwicmFuZG9tUG9zIiwicHVzaCIsInNhdHJlYyIsInNhdGVsbGl0ZSIsInR3b2xpbmUyc2F0cmVjIiwic3BsaXQiLCJ0cmltIiwiY3VycmVudFNhdGVsbGl0ZSIsIlNhdGVsbGl0ZSIsImN0eCIsIkdhbWVWaWV3IiwiZGF0ZSIsInh5eiIsInNhdHJlY1RvWFlaIiwibGFtYmRhIiwicGhpIiwiY29zUGhpIiwiY29zIiwiciIsIlRIUkVFIiwiVmVjdG9yMyIsInNpbiIsInBvc2l0aW9uQW5kVmVsb2NpdHkiLCJwcm9wYWdhdGUiLCJnbXN0IiwiZ3N0aW1lIiwicG9zaXRpb25HZCIsImVjaVRvR2VvZGV0aWMiLCJwb3NpdGlvbiIsImxvbmdpdHVkZSIsImxhdGl0dWRlIiwiaGVpZ2h0Iiwic2F0UmVjcyIsImFkZFNhdGVsaXRlcyIsIkRhdGUiLCJnZXRUaW1lIiwic2NlbmUiLCJTY2VuZSIsImNhbWVyYSIsIlBlcnNwZWN0aXZlQ2FtZXJhIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImlubmVySGVpZ2h0IiwiY2FudmFzRWxlIiwicmVuZGVyZXIiLCJXZWJHTFJlbmRlcmVyIiwiYW50aWFsaWFzIiwiY2FudmFzIiwic2V0U2l6ZSIsInNldENsZWFyQ29sb3IiLCJnZW9tZXRyeSIsIlNwaGVyZUdlb21ldHJ5Iiwid2lyZWZyYW1lIiwiV2lyZWZyYW1lR2VvbWV0cnkiLCJsaW5lIiwiTGluZVNlZ21lbnRzIiwibWF0ZXJpYWwiLCJkZXB0aFRlc3QiLCJ0cmFuc3BhcmVudCIsImFkZCIsInNhdEdlb21ldHJ5IiwiR2VvbWV0cnkiLCJzYXRlbGxpdGVWZWN0b3JGdW5jIiwic2F0ZWxsaXRlVmVjdG9yIiwidmVydGljZXMiLCJtYXAiLCJQb2ludHMiLCJQb2ludHNNYXRlcmlhbCIsImNvbG9yIiwic2l6ZSIsInoiLCJ4IiwieSIsImFuaW1hdGUiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyb3RhdGlvbiIsImxlbmd0aCIsInJlbmRlciIsIm1hcF9yYW5nZSIsImxvdzEiLCJoaWdoMSIsImxvdzIiLCJoaWdoMiIsInJhZGlhbnNUb0RlZ3JlZXMiLCJyYWRpYW5zIiwiUEkiLCJkZWdyZWVzVG9SYWRpYW5zIiwiZGVncmVlcyIsInNhdFJlYyIsImdhbWUiLCJuZXdGcmVxIiwicG9zIiwiZ2Fpbk5vZGUiLCJjcmVhdGVHYWluIiwiZ2FpbiIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsImNvb3JkIiwibWF4IiwieFZhbCIsInlWYWwiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsImV2ZW50IiwiQXVkaW9Db250ZXh0IiwiSVNTX1RMRSIsIndpZHRoIiwiZyIsImdhbWV2aWV3Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw0RkFBdUMsQzs7Ozs7Ozs7Ozs7QUNBMUI7O0FBRWIsWUFBWSxtQkFBTyxDQUFDLHFEQUFZOztBQUVoQyxh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QUFPO0FBQ2xCLFlBQVksUUFBUTtBQUNwQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsT0FBTztBQUNwQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxhQUFhO0FBQ3hCLFdBQVcsU0FBUztBQUNwQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUNBQW1DLE9BQU87QUFDMUM7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsU0FBUyxHQUFHLFNBQVM7QUFDNUMsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYSxPQUFPO0FBQ3BCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsNEJBQTRCO0FBQzVCLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUEsdUNBQXVDLE9BQU87QUFDOUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsWUFBWSxPQUFPO0FBQ25COzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWSxPQUFPO0FBQ25COzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjs7QUFFbEIsMkJBQTJCOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlDQUFpQzs7QUFFakM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhCQUE4Qjs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQ7O0FBRWpELHNFQUFzRTs7QUFFdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7O0FBRXBCLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOztBQUVWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQzs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscURBQXFEOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDOztBQUV2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCOztBQUV2Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDOztBQUV2QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLCtCQUErQjs7QUFFL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7OztBQUdMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLDZIQUE2SDs7QUFFN0gsd0NBQXdDO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qjs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7QUFFbkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qjs7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7QUFFZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBLG9CQUFvQjs7QUFFcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOzs7QUFHQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCOztBQUV0QjtBQUNBLG1CQUFtQjs7QUFFbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQ0FBc0M7O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDOztBQUVyQztBQUNBLDhCQUE4Qjs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUI7O0FBRXZCO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7O0FBRXhDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDs7QUFFM0Q7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrR0FBa0c7O0FBRWxHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1RkFBdUY7O0FBRXZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCOztBQUV4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qjs7QUFFeEIsaUNBQWlDO0FBQ2pDOztBQUVBLG9DQUFvQzs7QUFFcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQ0FBc0M7O0FBRXRDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87OztBQUdQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUEsd0NBQXdDOztBQUV4QztBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7OztBQUdMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLG1DQUFtQzs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlLQUFpSzs7QUFFaks7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDs7QUFFckQsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlDQUFpQzs7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ZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvYXhpb3MnKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcblxudmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xuXG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcblxudmFyIGJ1aWxkRnVsbFBhdGggPSByZXF1aXJlKCcuLi9jb3JlL2J1aWxkRnVsbFBhdGgnKTtcblxudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcblxudmFyIGlzVVJMU2FtZU9yaWdpbiA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc1VSTFNhbWVPcmlnaW4nKTtcblxudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9jcmVhdGVFcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhockFkYXB0ZXIoY29uZmlnKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG4gICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShyZXF1ZXN0RGF0YSkpIHtcbiAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1snQ29udGVudC1UeXBlJ107IC8vIExldCB0aGUgYnJvd3NlciBzZXQgaXRcbiAgICB9XG5cbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpOyAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG5cbiAgICBpZiAoY29uZmlnLmF1dGgpIHtcbiAgICAgIHZhciB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuICAgICAgdmFyIHBhc3N3b3JkID0gY29uZmlnLmF1dGgucGFzc3dvcmQgPyB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoY29uZmlnLmF1dGgucGFzc3dvcmQpKSA6ICcnO1xuICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcbiAgICB9XG5cbiAgICB2YXIgZnVsbFBhdGggPSBidWlsZEZ1bGxQYXRoKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcbiAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChmdWxsUGF0aCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTsgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcblxuICAgIHJlcXVlc3QudGltZW91dCA9IGNvbmZpZy50aW1lb3V0OyAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG5cbiAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uIGhhbmRsZUxvYWQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QgfHwgcmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgLy8gV2l0aCBvbmUgZXhjZXB0aW9uOiByZXF1ZXN0IHRoYXQgdXNpbmcgZmlsZTogcHJvdG9jb2wsIG1vc3QgYnJvd3NlcnNcbiAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcblxuXG4gICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuXG5cbiAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcbiAgICAgIHZhciByZXNwb25zZURhdGEgPSAhY29uZmlnLnJlc3BvbnNlVHlwZSB8fCBjb25maWcucmVzcG9uc2VUeXBlID09PSAndGV4dCcgPyByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHJlc3BvbnNlRGF0YSxcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG4gICAgICB9O1xuICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpOyAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07IC8vIEhhbmRsZSBicm93c2VyIHJlcXVlc3QgY2FuY2VsbGF0aW9uIChhcyBvcHBvc2VkIHRvIGEgbWFudWFsIGNhbmNlbGxhdGlvbilcblxuXG4gICAgcmVxdWVzdC5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsIHJlcXVlc3QpKTsgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9OyAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG5cblxuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpOyAvLyBDbGVhbiB1cCByZXF1ZXN0XG5cbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07IC8vIEhhbmRsZSB0aW1lb3V0XG5cblxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIHZhciB0aW1lb3V0RXJyb3JNZXNzYWdlID0gJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJztcblxuICAgICAgaWYgKGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlKSB7XG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cblxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKHRpbWVvdXRFcnJvck1lc3NhZ2UsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsIHJlcXVlc3QpKTsgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuXG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9OyAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuXG5cbiAgICBpZiAodXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuICAgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgICB2YXIgeHNyZlZhbHVlID0gKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMgfHwgaXNVUkxTYW1lT3JpZ2luKGZ1bGxQYXRoKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID8gY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICh4c3JmVmFsdWUpIHtcbiAgICAgICAgcmVxdWVzdEhlYWRlcnNbY29uZmlnLnhzcmZIZWFkZXJOYW1lXSA9IHhzcmZWYWx1ZTtcbiAgICAgIH1cbiAgICB9IC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG5cblxuICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xuICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycywgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3REYXRhID09PSAndW5kZWZpbmVkJyAmJiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZScpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgQ29udGVudC1UeXBlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBoZWFkZXIgdG8gdGhlIHJlcXVlc3RcbiAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcblxuXG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcud2l0aENyZWRlbnRpYWxzKSkge1xuICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSAhIWNvbmZpZy53aXRoQ3JlZGVudGlhbHM7XG4gICAgfSAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG5cblxuICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIEV4cGVjdGVkIERPTUV4Y2VwdGlvbiB0aHJvd24gYnkgYnJvd3NlcnMgbm90IGNvbXBhdGlibGUgWE1MSHR0cFJlcXVlc3QgTGV2ZWwgMi5cbiAgICAgICAgLy8gQnV0LCB0aGlzIGNhbiBiZSBzdXBwcmVzc2VkIGZvciAnanNvbicgdHlwZSBhcyBpdCBjYW4gYmUgcGFyc2VkIGJ5IGRlZmF1bHQgJ3RyYW5zZm9ybVJlc3BvbnNlJyBmdW5jdGlvbi5cbiAgICAgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcblxuXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25Eb3dubG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyk7XG4gICAgfSAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuXG5cbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nICYmIHJlcXVlc3QudXBsb2FkKSB7XG4gICAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICBjb25maWcuY2FuY2VsVG9rZW4ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIG9uQ2FuY2VsZWQoY2FuY2VsKSB7XG4gICAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgcmVqZWN0KGNhbmNlbCk7IC8vIENsZWFuIHVwIHJlcXVlc3RcblxuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghcmVxdWVzdERhdGEpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9IC8vIFNlbmQgdGhlIHJlcXVlc3RcblxuXG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG5cbnZhciBBeGlvcyA9IHJlcXVpcmUoJy4vY29yZS9BeGlvcycpO1xuXG52YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlKCcuL2NvcmUvbWVyZ2VDb25maWcnKTtcblxudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpO1xuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cblxuXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTsgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2VcblxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7IC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG4gIHJldHVybiBpbnN0YW5jZTtcbn0gLy8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG5cblxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpOyAvLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcblxuYXhpb3MuQXhpb3MgPSBBeGlvczsgLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuXG5heGlvcy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKG1lcmdlQ29uZmlnKGF4aW9zLmRlZmF1bHRzLCBpbnN0YW5jZUNvbmZpZykpO1xufTsgLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5cblxuYXhpb3MuQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsJyk7XG5heGlvcy5DYW5jZWxUb2tlbiA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbFRva2VuJyk7XG5heGlvcy5pc0NhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL2lzQ2FuY2VsJyk7IC8vIEV4cG9zZSBhbGwvc3ByZWFkXG5cbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcblxuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpOyAvLyBFeHBvc2UgaXNBeGlvc0Vycm9yXG5cbmF4aW9zLmlzQXhpb3NFcnJvciA9IHJlcXVpcmUoJy4vaGVscGVycy9pc0F4aW9zRXJyb3InKTtcbm1vZHVsZS5leHBvcnRzID0gYXhpb3M7IC8vIEFsbG93IHVzZSBvZiBkZWZhdWx0IGltcG9ydCBzeW50YXggaW4gVHlwZVNjcmlwdFxuXG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7IiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuXG5mdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5DYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xufTtcblxuQ2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4vQ2FuY2VsJyk7XG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKi9cblxuXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG4gIHZhciB0b2tlbiA9IHRoaXM7XG4gIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG4gICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcbiAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICB9KTtcbn1cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuXG5cbkNhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgdGhyb3cgdGhpcy5yZWFzb247XG4gIH1cbn07XG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gKi9cblxuXG5DYW5jZWxUb2tlbi5zb3VyY2UgPSBmdW5jdGlvbiBzb3VyY2UoKSB7XG4gIHZhciBjYW5jZWw7XG4gIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG4gICAgY2FuY2VsID0gYztcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgdG9rZW46IHRva2VuLFxuICAgIGNhbmNlbDogY2FuY2VsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG5cbnZhciBJbnRlcmNlcHRvck1hbmFnZXIgPSByZXF1aXJlKCcuL0ludGVyY2VwdG9yTWFuYWdlcicpO1xuXG52YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gcmVxdWlyZSgnLi9kaXNwYXRjaFJlcXVlc3QnKTtcblxudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9tZXJnZUNvbmZpZycpO1xuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuXG5cbmZ1bmN0aW9uIEF4aW9zKGluc3RhbmNlQ29uZmlnKSB7XG4gIHRoaXMuZGVmYXVsdHMgPSBpbnN0YW5jZUNvbmZpZztcbiAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG4gICAgcmVxdWVzdDogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpLFxuICAgIHJlc3BvbnNlOiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKClcbiAgfTtcbn1cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cblxuXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcbiAgICBjb25maWcudXJsID0gYXJndW1lbnRzWzBdO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgfVxuXG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7IC8vIFNldCBjb25maWcubWV0aG9kXG5cbiAgaWYgKGNvbmZpZy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2UgaWYgKHRoaXMuZGVmYXVsdHMubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IHRoaXMuZGVmYXVsdHMubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnLm1ldGhvZCA9ICdnZXQnO1xuICB9IC8vIEhvb2sgdXAgaW50ZXJjZXB0b3JzIG1pZGRsZXdhcmVcblxuXG4gIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG4gIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGNoYWluLnNoaWZ0KCksIGNoYWluLnNoaWZ0KCkpO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2U7XG59O1xuXG5BeGlvcy5wcm90b3R5cGUuZ2V0VXJpID0gZnVuY3Rpb24gZ2V0VXJpKGNvbmZpZykge1xuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuICByZXR1cm4gYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLnJlcGxhY2UoL15cXD8vLCAnJyk7XG59OyAvLyBQcm92aWRlIGFsaWFzZXMgZm9yIHN1cHBvcnRlZCByZXF1ZXN0IG1ldGhvZHNcblxuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbiAodXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IChjb25maWcgfHwge30pLmRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24gKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG4gIHRoaXMuaGFuZGxlcnMgPSBbXTtcbn1cbi8qKlxuICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICovXG5cblxuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCkge1xuICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuICAgIHJlamVjdGVkOiByZWplY3RlZFxuICB9KTtcbiAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbn07XG4vKipcbiAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcbiAqL1xuXG5cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gIH1cbn07XG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gKlxuICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gKi9cblxuXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG4gIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICBmbihoKTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBYnNvbHV0ZVVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xuXG52YXIgY29tYmluZVVSTHMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2NvbWJpbmVVUkxzJyk7XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgYmFzZVVSTCB3aXRoIHRoZSByZXF1ZXN0ZWRVUkwsXG4gKiBvbmx5IHdoZW4gdGhlIHJlcXVlc3RlZFVSTCBpcyBub3QgYWxyZWFkeSBhbiBhYnNvbHV0ZSBVUkwuXG4gKiBJZiB0aGUgcmVxdWVzdFVSTCBpcyBhYnNvbHV0ZSwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSByZXF1ZXN0ZWRVUkwgdW50b3VjaGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RlZFVSTCBBYnNvbHV0ZSBvciByZWxhdGl2ZSBVUkwgdG8gY29tYmluZVxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIGZ1bGwgcGF0aFxuICovXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZEZ1bGxQYXRoKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCkge1xuICBpZiAoYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChyZXF1ZXN0ZWRVUkwpKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gIH1cblxuICByZXR1cm4gcmVxdWVzdGVkVVJMO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuLyoqXG4gKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgcmVxdWVzdCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIGVycm9yIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG4gKi9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICByZXR1cm4gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbnZhciB0cmFuc2Zvcm1EYXRhID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1EYXRhJyk7XG5cbnZhciBpc0NhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9pc0NhbmNlbCcpO1xuXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5cblxuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cbn1cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTsgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcblxuICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9OyAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG5cbiAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKGNvbmZpZy5kYXRhLCBjb25maWcuaGVhZGVycywgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3QpOyAvLyBGbGF0dGVuIGhlYWRlcnNcblxuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSwgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sIGNvbmZpZy5oZWFkZXJzKTtcbiAgdXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSwgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG4gIH0pO1xuICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpOyAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEocmVzcG9uc2UuZGF0YSwgcmVzcG9uc2UuaGVhZGVycywgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlKTtcbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTsgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcblxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKHJlYXNvbi5yZXNwb25zZS5kYXRhLCByZWFzb24ucmVzcG9uc2UuaGVhZGVycywgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogVXBkYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBjb25maWcsIGVycm9yIGNvZGUsIGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBlcnJvci5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBlcnJvci5jb25maWcgPSBjb25maWc7XG5cbiAgaWYgKGNvZGUpIHtcbiAgICBlcnJvci5jb2RlID0gY29kZTtcbiAgfVxuXG4gIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICBlcnJvci5pc0F4aW9zRXJyb3IgPSB0cnVlO1xuXG4gIGVycm9yLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIC8vIE1pY3Jvc29mdFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgLy8gTW96aWxsYVxuICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAvLyBBeGlvc1xuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGNvZGU6IHRoaXMuY29kZVxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIGVycm9yO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG4vKipcbiAqIENvbmZpZy1zcGVjaWZpYyBtZXJnZS1mdW5jdGlvbiB3aGljaCBjcmVhdGVzIGEgbmV3IGNvbmZpZy1vYmplY3RcbiAqIGJ5IG1lcmdpbmcgdHdvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB0b2dldGhlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzJcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWVyZ2VDb25maWcoY29uZmlnMSwgY29uZmlnMikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgY29uZmlnMiA9IGNvbmZpZzIgfHwge307XG4gIHZhciBjb25maWcgPSB7fTtcbiAgdmFyIHZhbHVlRnJvbUNvbmZpZzJLZXlzID0gWyd1cmwnLCAnbWV0aG9kJywgJ2RhdGEnXTtcbiAgdmFyIG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzID0gWydoZWFkZXJzJywgJ2F1dGgnLCAncHJveHknLCAncGFyYW1zJ107XG4gIHZhciBkZWZhdWx0VG9Db25maWcyS2V5cyA9IFsnYmFzZVVSTCcsICd0cmFuc2Zvcm1SZXF1ZXN0JywgJ3RyYW5zZm9ybVJlc3BvbnNlJywgJ3BhcmFtc1NlcmlhbGl6ZXInLCAndGltZW91dCcsICd0aW1lb3V0TWVzc2FnZScsICd3aXRoQ3JlZGVudGlhbHMnLCAnYWRhcHRlcicsICdyZXNwb25zZVR5cGUnLCAneHNyZkNvb2tpZU5hbWUnLCAneHNyZkhlYWRlck5hbWUnLCAnb25VcGxvYWRQcm9ncmVzcycsICdvbkRvd25sb2FkUHJvZ3Jlc3MnLCAnZGVjb21wcmVzcycsICdtYXhDb250ZW50TGVuZ3RoJywgJ21heEJvZHlMZW5ndGgnLCAnbWF4UmVkaXJlY3RzJywgJ3RyYW5zcG9ydCcsICdodHRwQWdlbnQnLCAnaHR0cHNBZ2VudCcsICdjYW5jZWxUb2tlbicsICdzb2NrZXRQYXRoJywgJ3Jlc3BvbnNlRW5jb2RpbmcnXTtcbiAgdmFyIGRpcmVjdE1lcmdlS2V5cyA9IFsndmFsaWRhdGVTdGF0dXMnXTtcblxuICBmdW5jdGlvbiBnZXRNZXJnZWRWYWx1ZSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHRhcmdldCkgJiYgdXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2UodGFyZ2V0LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2Uoe30sIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBzb3VyY2Uuc2xpY2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgZnVuY3Rpb24gbWVyZ2VEZWVwUHJvcGVydGllcyhwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMVtwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgdXRpbHMuZm9yRWFjaCh2YWx1ZUZyb21Db25maWcyS2V5cywgZnVuY3Rpb24gdmFsdWVGcm9tQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuICB1dGlscy5mb3JFYWNoKG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzLCBtZXJnZURlZXBQcm9wZXJ0aWVzKTtcbiAgdXRpbHMuZm9yRWFjaChkZWZhdWx0VG9Db25maWcyS2V5cywgZnVuY3Rpb24gZGVmYXVsdFRvQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuICB1dGlscy5mb3JFYWNoKGRpcmVjdE1lcmdlS2V5cywgZnVuY3Rpb24gbWVyZ2UocHJvcCkge1xuICAgIGlmIChwcm9wIGluIGNvbmZpZzIpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG4gIHZhciBheGlvc0tleXMgPSB2YWx1ZUZyb21Db25maWcyS2V5cy5jb25jYXQobWVyZ2VEZWVwUHJvcGVydGllc0tleXMpLmNvbmNhdChkZWZhdWx0VG9Db25maWcyS2V5cykuY29uY2F0KGRpcmVjdE1lcmdlS2V5cyk7XG4gIHZhciBvdGhlcktleXMgPSBPYmplY3Qua2V5cyhjb25maWcxKS5jb25jYXQoT2JqZWN0LmtleXMoY29uZmlnMikpLmZpbHRlcihmdW5jdGlvbiBmaWx0ZXJBeGlvc0tleXMoa2V5KSB7XG4gICAgcmV0dXJuIGF4aW9zS2V5cy5pbmRleE9mKGtleSkgPT09IC0xO1xuICB9KTtcbiAgdXRpbHMuZm9yRWFjaChvdGhlcktleXMsIG1lcmdlRGVlcFByb3BlcnRpZXMpO1xuICByZXR1cm4gY29uZmlnO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4vY3JlYXRlRXJyb3InKTtcbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG4gIHZhciB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcblxuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChjcmVhdGVFcnJvcignUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAnICsgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5jb25maWcsIG51bGwsIHJlc3BvbnNlLnJlcXVlc3QsIHJlc3BvbnNlKSk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcbiAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG4gKi9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuKGRhdGEsIGhlYWRlcnMpO1xuICB9KTtcbiAgcmV0dXJuIGRhdGE7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IHJlcXVpcmUoJy4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG5cbnZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG5mdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcbiAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICB2YXIgYWRhcHRlcjtcblxuICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBicm93c2VycyB1c2UgWEhSIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy94aHInKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpIHtcbiAgICAvLyBGb3Igbm9kZSB1c2UgSFRUUCBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMvaHR0cCcpO1xuICB9XG5cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0FjY2VwdCcpO1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScpO1xuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHwgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fCB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fCB1dGlscy5pc1N0cmVhbShkYXRhKSB8fCB1dGlscy5pc0ZpbGUoZGF0YSkgfHwgdXRpbHMuaXNCbG9iKGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG5cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8qIElnbm9yZSAqL1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG4gICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG4gICAqL1xuICB0aW1lb3V0OiAwLFxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuICBtYXhCb2R5TGVuZ3RoOiAtMSxcbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfVxufTtcbmRlZmF1bHRzLmhlYWRlcnMgPSB7XG4gIGNvbW1vbjoge1xuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICB9XG59O1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xufSk7XG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLnJlcGxhY2UoLyUzQS9naSwgJzonKS5yZXBsYWNlKC8lMjQvZywgJyQnKS5yZXBsYWNlKC8lMkMvZ2ksICcsJykucmVwbGFjZSgvJTIwL2csICcrJykucmVwbGFjZSgvJTVCL2dpLCAnWycpLnJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHZhciBzZXJpYWxpemVkUGFyYW1zO1xuXG4gIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcbiAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJ0cyA9IFtdO1xuICAgIHV0aWxzLmZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiBzZXJpYWxpemUodmFsLCBrZXkpIHtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGtleSA9IGtleSArICdbXSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSBbdmFsXTtcbiAgICAgIH1cblxuICAgICAgdXRpbHMuZm9yRWFjaCh2YWwsIGZ1bmN0aW9uIHBhcnNlVmFsdWUodikge1xuICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHYpKSB7XG4gICAgICAgICAgdiA9IHYudG9JU09TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdCh2KSkge1xuICAgICAgICAgIHYgPSBKU09OLnN0cmluZ2lmeSh2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUodikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcnRzLmpvaW4oJyYnKTtcbiAgfVxuXG4gIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgdmFyIGhhc2htYXJrSW5kZXggPSB1cmwuaW5kZXhPZignIycpO1xuXG4gICAgaWYgKGhhc2htYXJrSW5kZXggIT09IC0xKSB7XG4gICAgICB1cmwgPSB1cmwuc2xpY2UoMCwgaGFzaG1hcmtJbmRleCk7XG4gICAgfVxuXG4gICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyBzZXJpYWxpemVkUGFyYW1zO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpIDogYmFzZVVSTDtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/IC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICByZXR1cm4ge1xuICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgIHZhciBjb29raWUgPSBbXTtcbiAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG4gICAgICAgIGNvb2tpZS5wdXNoKCdleHBpcmVzPScgKyBuZXcgRGF0ZShleHBpcmVzKS50b0dNVFN0cmluZygpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcbiAgICAgICAgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuICAgICAgICBjb29raWUucHVzaCgnc2VjdXJlJyk7XG4gICAgICB9XG5cbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuICAgIH0sXG4gICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG4gICAgICB2YXIgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuICAgICAgcmV0dXJuIG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGw7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG4gICAgICB0aGlzLndyaXRlKG5hbWUsICcnLCBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICAgIH1cbiAgfTtcbn0oKSA6IC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbmZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgcmV0dXJuIHtcbiAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcbiAgICByZWFkOiBmdW5jdGlvbiByZWFkKCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gIH07XG59KCk7IiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcbiAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcbiAgLy8gYnkgYW55IGNvbWJpbmF0aW9uIG9mIGxldHRlcnMsIGRpZ2l0cywgcGx1cywgcGVyaW9kLCBvciBoeXBoZW4uXG4gIHJldHVybiAvXihbYS16XVthLXpcXGRcXCtcXC1cXC5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zXG4gKlxuICogQHBhcmFtIHsqfSBwYXlsb2FkIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3MsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBeGlvc0Vycm9yKHBheWxvYWQpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXlsb2FkID09PSAnb2JqZWN0JyAmJiBwYXlsb2FkLmlzQXhpb3NFcnJvciA9PT0gdHJ1ZTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/IC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG5mdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIHZhciBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICB2YXIgb3JpZ2luVVJMO1xuICAvKipcbiAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAqL1xuXG4gIGZ1bmN0aW9uIHJlc29sdmVVUkwodXJsKSB7XG4gICAgdmFyIGhyZWYgPSB1cmw7XG5cbiAgICBpZiAobXNpZSkge1xuICAgICAgLy8gSUUgbmVlZHMgYXR0cmlidXRlIHNldCB0d2ljZSB0byBub3JtYWxpemUgcHJvcGVydGllc1xuICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcbiAgICB9XG5cbiAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTsgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG4gICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgcGF0aG5hbWU6IHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nID8gdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOiAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuICAgIH07XG4gIH1cblxuICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgLyoqXG4gICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgKi9cblxuICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKHJlcXVlc3RVUkwpIHtcbiAgICB2YXIgcGFyc2VkID0gdXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICByZXR1cm4gcGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiYgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0O1xuICB9O1xufSgpIDogLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbmZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbn0oKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCBub3JtYWxpemVkTmFtZSkge1xuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICBoZWFkZXJzW25vcm1hbGl6ZWROYW1lXSA9IHZhbHVlO1xuICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7IC8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG5cblxudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gWydhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJywgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLCAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J107XG4vKipcbiAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3RcbiAqXG4gKiBgYGBcbiAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG4gKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cbiAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcbiAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBIZWFkZXJzIHBhcnNlZCBpbnRvIGFuIG9iamVjdFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHtcbiAgICByZXR1cm4gcGFyc2VkO1xuICB9XG5cbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoa2V5ID09PSAnc2V0LWNvb2tpZScpIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSAocGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSA6IFtdKS5jb25jYXQoW3ZhbF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSBwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldICsgJywgJyArIHZhbCA6IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcGFyc2VkO1xufTsiLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG4gKlxuICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cbiAqXG4gKiAgYGBganNcbiAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG4gKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG4gKiAgZi5hcHBseShudWxsLCBhcmdzKTtcbiAqICBgYGBcbiAqXG4gKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cbiAqXG4gKiAgYGBganNcbiAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG4gKiAgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG4vKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzQnVmZmVyKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwpICYmIHZhbC5jb25zdHJ1Y3RvciAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsLmNvbnN0cnVjdG9yKSAmJiB0eXBlb2YgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcih2YWwpO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YTtcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICB2YXIgcmVzdWx0O1xuXG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIEFycmF5QnVmZmVyLmlzVmlldykge1xuICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IHZhbCAmJiB2YWwuYnVmZmVyICYmIHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcjtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc051bWJlcih2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbCkge1xuICBpZiAodG9TdHJpbmcuY2FsbCh2YWwpICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsKTtcbiAgcmV0dXJuIHByb3RvdHlwZSA9PT0gbnVsbCB8fCBwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGU7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRGF0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cblxuXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzRmlsZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRmlsZV0nO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNCbG9iKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBCbG9iXSc7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNTdHJlYW0odmFsKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5cblxuZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXModmFsKSB7XG4gIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG59XG4vKipcbiAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG4gKi9cblxuXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xufVxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKiBuYXRpdmVzY3JpcHRcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnTmF0aXZlU2NyaXB0JyBvciAnTlMnXG4gKi9cblxuXG5mdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIChuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJyB8fCBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ05hdGl2ZVNjcmlwdCcgfHwgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOUycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCc7XG59XG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cblxuXG5mdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcbiAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH0gLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG5cblxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuLyoqXG4gKiBBY2NlcHRzIHZhcmFyZ3MgZXhwZWN0aW5nIGVhY2ggYXJndW1lbnQgdG8gYmUgYW4gb2JqZWN0LCB0aGVuXG4gKiBpbW11dGFibHkgbWVyZ2VzIHRoZSBwcm9wZXJ0aWVzIG9mIGVhY2ggb2JqZWN0IGFuZCByZXR1cm5zIHJlc3VsdC5cbiAqXG4gKiBXaGVuIG11bHRpcGxlIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBrZXkgdGhlIGxhdGVyIG9iamVjdCBpblxuICogdGhlIGFyZ3VtZW50cyBsaXN0IHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciByZXN1bHQgPSBtZXJnZSh7Zm9vOiAxMjN9LCB7Zm9vOiA0NTZ9KTtcbiAqIGNvbnNvbGUubG9nKHJlc3VsdC5mb28pOyAvLyBvdXRwdXRzIDQ1NlxuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuXG5cbmZ1bmN0aW9uIG1lcmdlKClcbi8qIG9iajEsIG9iajIsIG9iajMsIC4uLiAqL1xue1xuICB2YXIgcmVzdWx0ID0ge307XG5cbiAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAoaXNQbGFpbk9iamVjdChyZXN1bHRba2V5XSkgJiYgaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHt9LCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbC5zbGljZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5cblxuZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcbiAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhO1xufVxuLyoqXG4gKiBSZW1vdmUgYnl0ZSBvcmRlciBtYXJrZXIuIFRoaXMgY2F0Y2hlcyBFRiBCQiBCRiAodGhlIFVURi04IEJPTSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCB3aXRoIEJPTVxuICogQHJldHVybiB7c3RyaW5nfSBjb250ZW50IHZhbHVlIHdpdGhvdXQgQk9NXG4gKi9cblxuXG5mdW5jdGlvbiBzdHJpcEJPTShjb250ZW50KSB7XG4gIGlmIChjb250ZW50LmNoYXJDb2RlQXQoMCkgPT09IDB4RkVGRikge1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnNsaWNlKDEpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNQbGFpbk9iamVjdDogaXNQbGFpbk9iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltLFxuICBzdHJpcEJPTTogc3RyaXBCT01cbn07IiwiLyohXG4gKiBzYXRlbGxpdGUtanMgdjQuMS4zXG4gKiAoYykgMjAxMyBTaGFzaHdhdCBLYW5kYWRhaSBhbmQgVUNTQ1xuICogaHR0cHM6Ly9naXRodWIuY29tL3NoYXNod2F0YWsvc2F0ZWxsaXRlLWpzXG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xudmFyIHBpID0gTWF0aC5QSTtcbnZhciB0d29QaSA9IHBpICogMjtcbnZhciBkZWcycmFkID0gcGkgLyAxODAuMDtcbnZhciByYWQyZGVnID0gMTgwIC8gcGk7XG52YXIgbWludXRlc1BlckRheSA9IDE0NDAuMDtcbnZhciBtdSA9IDM5ODYwMC41OyAvLyBpbiBrbTMgLyBzMlxuXG52YXIgZWFydGhSYWRpdXMgPSA2Mzc4LjEzNzsgLy8gaW4ga21cblxudmFyIHhrZSA9IDYwLjAgLyBNYXRoLnNxcnQoZWFydGhSYWRpdXMgKiBlYXJ0aFJhZGl1cyAqIGVhcnRoUmFkaXVzIC8gbXUpO1xudmFyIHZrbXBlcnNlYyA9IGVhcnRoUmFkaXVzICogeGtlIC8gNjAuMDtcbnZhciB0dW1pbiA9IDEuMCAvIHhrZTtcbnZhciBqMiA9IDAuMDAxMDgyNjI5OTg5MDU7XG52YXIgajMgPSAtMC4wMDAwMDI1MzIxNTMwNjtcbnZhciBqNCA9IC0wLjAwMDAwMTYxMDk4NzYxO1xudmFyIGozb2oyID0gajMgLyBqMjtcbnZhciB4Mm8zID0gMi4wIC8gMy4wO1xudmFyIGNvbnN0YW50cyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgX19wcm90b19fOiBudWxsLFxuICBwaTogcGksXG4gIHR3b1BpOiB0d29QaSxcbiAgZGVnMnJhZDogZGVnMnJhZCxcbiAgcmFkMmRlZzogcmFkMmRlZyxcbiAgbWludXRlc1BlckRheTogbWludXRlc1BlckRheSxcbiAgbXU6IG11LFxuICBlYXJ0aFJhZGl1czogZWFydGhSYWRpdXMsXG4gIHhrZTogeGtlLFxuICB2a21wZXJzZWM6IHZrbXBlcnNlYyxcbiAgdHVtaW46IHR1bWluLFxuICBqMjogajIsXG4gIGozOiBqMyxcbiAgajQ6IGo0LFxuICBqM29qMjogajNvajIsXG4gIHgybzM6IHgybzNcbn0pO1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZHVyZSBkYXlzMm1kaG1zXG4gKlxuICogIHRoaXMgcHJvY2VkdXJlIGNvbnZlcnRzIHRoZSBkYXkgb2YgdGhlIHllYXIsIGRheXMsIHRvIHRoZSBlcXVpdmFsZW50IG1vbnRoXG4gKiAgICBkYXksIGhvdXIsIG1pbnV0ZSBhbmQgc2Vjb25kLlxuICpcbiAqICBhbGdvcml0aG0gICAgIDogc2V0IHVwIGFycmF5IGZvciB0aGUgbnVtYmVyIG9mIGRheXMgcGVyIG1vbnRoXG4gKiAgICAgICAgICAgICAgICAgIGZpbmQgbGVhcCB5ZWFyIC0gdXNlIDE5MDAgYmVjYXVzZSAyMDAwIGlzIGEgbGVhcCB5ZWFyXG4gKiAgICAgICAgICAgICAgICAgIGxvb3AgdGhyb3VnaCBhIHRlbXAgdmFsdWUgd2hpbGUgdGhlIHZhbHVlIGlzIDwgdGhlIGRheXNcbiAqICAgICAgICAgICAgICAgICAgcGVyZm9ybSBpbnQgY29udmVyc2lvbnMgdG8gdGhlIGNvcnJlY3QgZGF5IGFuZCBtb250aFxuICogICAgICAgICAgICAgICAgICBjb252ZXJ0IHJlbWFpbmRlciBpbnRvIGggbSBzIHVzaW5nIHR5cGUgY29udmVyc2lvbnNcbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAgMSBtYXIgMjAwMVxuICpcbiAqICBpbnB1dHMgICAgICAgICAgZGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgIHJhbmdlIC8gdW5pdHNcbiAqICAgIHllYXIgICAgICAgIC0geWVhciAgICAgICAgICAgICAgICAgICAgICAgICAgIDE5MDAgLi4gMjEwMFxuICogICAgZGF5cyAgICAgICAgLSBqdWxpYW4gZGF5IG9mIHRoZSB5ZWFyICAgICAgICAgMC4wICAuLiAzNjYuMFxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIG1vbiAgICAgICAgIC0gbW9udGggICAgICAgICAgICAgICAgICAgICAgICAgIDEgLi4gMTJcbiAqICAgIGRheSAgICAgICAgIC0gZGF5ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEgLi4gMjgsMjksMzAsMzFcbiAqICAgIGhyICAgICAgICAgIC0gaG91ciAgICAgICAgICAgICAgICAgICAgICAgICAgIDAgLi4gMjNcbiAqICAgIG1pbiAgICAgICAgIC0gbWludXRlICAgICAgICAgICAgICAgICAgICAgICAgIDAgLi4gNTlcbiAqICAgIHNlYyAgICAgICAgIC0gc2Vjb25kICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCAuLiA1OS45OTlcbiAqXG4gKiAgbG9jYWxzICAgICAgICA6XG4gKiAgICBkYXlvZnlyICAgICAtIGRheSBvZiB5ZWFyXG4gKiAgICB0ZW1wICAgICAgICAtIHRlbXBvcmFyeSBleHRlbmRlZCB2YWx1ZXNcbiAqICAgIGludHRlbXAgICAgIC0gdGVtcG9yYXJ5IGludCB2YWx1ZVxuICogICAgaSAgICAgICAgICAgLSBpbmRleFxuICogICAgbG1vbnRoWzEyXSAgLSBpbnQgYXJyYXkgY29udGFpbmluZyB0aGUgbnVtYmVyIG9mIGRheXMgcGVyIG1vbnRoXG4gKlxuICogIGNvdXBsaW5nICAgICAgOlxuICogICAgbm9uZS5cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5mdW5jdGlvbiBkYXlzMm1kaG1zKHllYXIsIGRheXMpIHtcbiAgdmFyIGxtb250aCA9IFszMSwgeWVhciAlIDQgPT09IDAgPyAyOSA6IDI4LCAzMSwgMzAsIDMxLCAzMCwgMzEsIDMxLCAzMCwgMzEsIDMwLCAzMV07XG4gIHZhciBkYXlvZnlyID0gTWF0aC5mbG9vcihkYXlzKTsgLy8gIC0tLS0tLS0tLS0tLS0tLS0tIGZpbmQgbW9udGggYW5kIGRheSBvZiBtb250aCAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgaW50dGVtcCA9IDA7XG5cbiAgd2hpbGUgKGRheW9meXIgPiBpbnR0ZW1wICsgbG1vbnRoW2kgLSAxXSAmJiBpIDwgMTIpIHtcbiAgICBpbnR0ZW1wICs9IGxtb250aFtpIC0gMV07XG4gICAgaSArPSAxO1xuICB9XG5cbiAgdmFyIG1vbiA9IGk7XG4gIHZhciBkYXkgPSBkYXlvZnlyIC0gaW50dGVtcDsgLy8gIC0tLS0tLS0tLS0tLS0tLS0tIGZpbmQgaG91cnMgbWludXRlcyBhbmQgc2Vjb25kcyAtLS0tLS0tLS0tLS0tXG5cbiAgdmFyIHRlbXAgPSAoZGF5cyAtIGRheW9meXIpICogMjQuMDtcbiAgdmFyIGhyID0gTWF0aC5mbG9vcih0ZW1wKTtcbiAgdGVtcCA9ICh0ZW1wIC0gaHIpICogNjAuMDtcbiAgdmFyIG1pbnV0ZSA9IE1hdGguZmxvb3IodGVtcCk7XG4gIHZhciBzZWMgPSAodGVtcCAtIG1pbnV0ZSkgKiA2MC4wO1xuICByZXR1cm4ge1xuICAgIG1vbjogbW9uLFxuICAgIGRheTogZGF5LFxuICAgIGhyOiBocixcbiAgICBtaW51dGU6IG1pbnV0ZSxcbiAgICBzZWM6IHNlY1xuICB9O1xufVxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZHVyZSBqZGF5XG4gKlxuICogIHRoaXMgcHJvY2VkdXJlIGZpbmRzIHRoZSBqdWxpYW4gZGF0ZSBnaXZlbiB0aGUgeWVhciwgbW9udGgsIGRheSwgYW5kIHRpbWUuXG4gKiAgICB0aGUganVsaWFuIGRhdGUgaXMgZGVmaW5lZCBieSBlYWNoIGVsYXBzZWQgZGF5IHNpbmNlIG5vb24sIGphbiAxLCA0NzEzIGJjLlxuICpcbiAqICBhbGdvcml0aG0gICAgIDogY2FsY3VsYXRlIHRoZSBhbnN3ZXIgaW4gb25lIHN0ZXAgZm9yIGVmZmljaWVuY3lcbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAgMSBtYXIgMjAwMVxuICpcbiAqICBpbnB1dHMgICAgICAgICAgZGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgIHJhbmdlIC8gdW5pdHNcbiAqICAgIHllYXIgICAgICAgIC0geWVhciAgICAgICAgICAgICAgICAgICAgICAgICAgIDE5MDAgLi4gMjEwMFxuICogICAgbW9uICAgICAgICAgLSBtb250aCAgICAgICAgICAgICAgICAgICAgICAgICAgMSAuLiAxMlxuICogICAgZGF5ICAgICAgICAgLSBkYXkgICAgICAgICAgICAgICAgICAgICAgICAgICAgMSAuLiAyOCwyOSwzMCwzMVxuICogICAgaHIgICAgICAgICAgLSB1bml2ZXJzYWwgdGltZSBob3VyICAgICAgICAgICAgMCAuLiAyM1xuICogICAgbWluICAgICAgICAgLSB1bml2ZXJzYWwgdGltZSBtaW4gICAgICAgICAgICAgMCAuLiA1OVxuICogICAgc2VjICAgICAgICAgLSB1bml2ZXJzYWwgdGltZSBzZWMgICAgICAgICAgICAgMC4wIC4uIDU5Ljk5OVxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIGpkICAgICAgICAgIC0ganVsaWFuIGRhdGUgICAgICAgICAgICAgICAgICAgIGRheXMgZnJvbSA0NzEzIGJjXG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgbm9uZS5cbiAqXG4gKiAgY291cGxpbmcgICAgICA6XG4gKiAgICBub25lLlxuICpcbiAqICByZWZlcmVuY2VzICAgIDpcbiAqICAgIHZhbGxhZG8gICAgICAgMjAwNywgMTg5LCBhbGcgMTQsIGV4IDMtMTRcbiAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXG5mdW5jdGlvbiBqZGF5SW50ZXJuYWwoeWVhciwgbW9uLCBkYXksIGhyLCBtaW51dGUsIHNlYykge1xuICB2YXIgbXNlYyA9IGFyZ3VtZW50cy5sZW5ndGggPiA2ICYmIGFyZ3VtZW50c1s2XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzZdIDogMDtcbiAgcmV0dXJuIDM2Ny4wICogeWVhciAtIE1hdGguZmxvb3IoNyAqICh5ZWFyICsgTWF0aC5mbG9vcigobW9uICsgOSkgLyAxMi4wKSkgKiAwLjI1KSArIE1hdGguZmxvb3IoMjc1ICogbW9uIC8gOS4wKSArIGRheSArIDE3MjEwMTMuNSArICgobXNlYyAvIDYwMDAwICsgc2VjIC8gNjAuMCArIG1pbnV0ZSkgLyA2MC4wICsgaHIpIC8gMjQuMCAvLyB1dCBpbiBkYXlzXG4gIC8vICMgLSAwLjUqc2duKDEwMC4wKnllYXIgKyBtb24gLSAxOTAwMDIuNSkgKyAwLjU7XG4gIDtcbn1cblxuZnVuY3Rpb24gamRheSh5ZWFyLCBtb24sIGRheSwgaHIsIG1pbnV0ZSwgc2VjLCBtc2VjKSB7XG4gIGlmICh5ZWFyIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHZhciBkYXRlID0geWVhcjtcbiAgICByZXR1cm4gamRheUludGVybmFsKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSwgZGF0ZS5nZXRVVENNb250aCgpICsgMSwgLy8gTm90ZSwgdGhpcyBmdW5jdGlvbiByZXF1aXJlcyBtb250aHMgaW4gcmFuZ2UgMS0xMi5cbiAgICBkYXRlLmdldFVUQ0RhdGUoKSwgZGF0ZS5nZXRVVENIb3VycygpLCBkYXRlLmdldFVUQ01pbnV0ZXMoKSwgZGF0ZS5nZXRVVENTZWNvbmRzKCksIGRhdGUuZ2V0VVRDTWlsbGlzZWNvbmRzKCkpO1xuICB9XG5cbiAgcmV0dXJuIGpkYXlJbnRlcm5hbCh5ZWFyLCBtb24sIGRheSwgaHIsIG1pbnV0ZSwgc2VjLCBtc2VjKTtcbn1cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWR1cmUgaW52amRheVxuICpcbiAqICB0aGlzIHByb2NlZHVyZSBmaW5kcyB0aGUgeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlIGFuZCBzZWNvbmRcbiAqICBnaXZlbiB0aGUganVsaWFuIGRhdGUuIHR1IGNhbiBiZSB1dDEsIHRkdCwgdGRiLCBldGMuXG4gKlxuICogIGFsZ29yaXRobSAgICAgOiBzZXQgdXAgc3RhcnRpbmcgdmFsdWVzXG4gKiAgICAgICAgICAgICAgICAgIGZpbmQgbGVhcCB5ZWFyIC0gdXNlIDE5MDAgYmVjYXVzZSAyMDAwIGlzIGEgbGVhcCB5ZWFyXG4gKiAgICAgICAgICAgICAgICAgIGZpbmQgdGhlIGVsYXBzZWQgZGF5cyB0aHJvdWdoIHRoZSB5ZWFyIGluIGEgbG9vcFxuICogICAgICAgICAgICAgICAgICBjYWxsIHJvdXRpbmUgdG8gZmluZCBlYWNoIGluZGl2aWR1YWwgdmFsdWVcbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAgMSBtYXIgMjAwMVxuICpcbiAqICBpbnB1dHMgICAgICAgICAgZGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgIHJhbmdlIC8gdW5pdHNcbiAqICAgIGpkICAgICAgICAgIC0ganVsaWFuIGRhdGUgICAgICAgICAgICAgICAgICAgIGRheXMgZnJvbSA0NzEzIGJjXG4gKlxuICogIG91dHB1dHMgICAgICAgOlxuICogICAgeWVhciAgICAgICAgLSB5ZWFyICAgICAgICAgICAgICAgICAgICAgICAgICAgMTkwMCAuLiAyMTAwXG4gKiAgICBtb24gICAgICAgICAtIG1vbnRoICAgICAgICAgICAgICAgICAgICAgICAgICAxIC4uIDEyXG4gKiAgICBkYXkgICAgICAgICAtIGRheSAgICAgICAgICAgICAgICAgICAgICAgICAgICAxIC4uIDI4LDI5LDMwLDMxXG4gKiAgICBociAgICAgICAgICAtIGhvdXIgICAgICAgICAgICAgICAgICAgICAgICAgICAwIC4uIDIzXG4gKiAgICBtaW4gICAgICAgICAtIG1pbnV0ZSAgICAgICAgICAgICAgICAgICAgICAgICAwIC4uIDU5XG4gKiAgICBzZWMgICAgICAgICAtIHNlY29uZCAgICAgICAgICAgICAgICAgICAgICAgICAwLjAgLi4gNTkuOTk5XG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgZGF5cyAgICAgICAgLSBkYXkgb2YgeWVhciBwbHVzIGZyYWN0aW9uYWxcbiAqICAgICAgICAgICAgICAgICAgcG9ydGlvbiBvZiBhIGRheSAgICAgICAgICAgICAgIGRheXNcbiAqICAgIHR1ICAgICAgICAgIC0ganVsaWFuIGNlbnR1cmllcyBmcm9tIDAgaFxuICogICAgICAgICAgICAgICAgICBqYW4gMCwgMTkwMFxuICogICAgdGVtcCAgICAgICAgLSB0ZW1wb3JhcnkgZG91YmxlIHZhbHVlc1xuICogICAgbGVhcHlycyAgICAgLSBudW1iZXIgb2YgbGVhcCB5ZWFycyBmcm9tIDE5MDBcbiAqXG4gKiAgY291cGxpbmcgICAgICA6XG4gKiAgICBkYXlzMm1kaG1zICAtIGZpbmRzIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSBhbmQgc2Vjb25kIGdpdmVuIGRheXMgYW5kIHllYXJcbiAqXG4gKiAgcmVmZXJlbmNlcyAgICA6XG4gKiAgICB2YWxsYWRvICAgICAgIDIwMDcsIDIwOCwgYWxnIDIyLCBleCAzLTEzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXG5mdW5jdGlvbiBpbnZqZGF5KGpkLCBhc0FycmF5KSB7XG4gIC8vIC0tLS0tLS0tLS0tLS0tLSBmaW5kIHllYXIgYW5kIGRheXMgb2YgdGhlIHllYXIgLVxuICB2YXIgdGVtcCA9IGpkIC0gMjQxNTAxOS41O1xuICB2YXIgdHUgPSB0ZW1wIC8gMzY1LjI1O1xuICB2YXIgeWVhciA9IDE5MDAgKyBNYXRoLmZsb29yKHR1KTtcbiAgdmFyIGxlYXB5cnMgPSBNYXRoLmZsb29yKCh5ZWFyIC0gMTkwMSkgKiAwLjI1KTsgLy8gb3B0aW9uYWwgbnVkZ2UgYnkgOC42NHgxMC03IHNlYyB0byBnZXQgZXZlbiBvdXRwdXRzXG5cbiAgdmFyIGRheXMgPSB0ZW1wIC0gKCh5ZWFyIC0gMTkwMCkgKiAzNjUuMCArIGxlYXB5cnMpICsgMC4wMDAwMDAwMDAwMTsgLy8gLS0tLS0tLS0tLS0tIGNoZWNrIGZvciBjYXNlIG9mIGJlZ2lubmluZyBvZiBhIHllYXIgLS0tLS0tLS0tLS1cblxuICBpZiAoZGF5cyA8IDEuMCkge1xuICAgIHllYXIgLT0gMTtcbiAgICBsZWFweXJzID0gTWF0aC5mbG9vcigoeWVhciAtIDE5MDEpICogMC4yNSk7XG4gICAgZGF5cyA9IHRlbXAgLSAoKHllYXIgLSAxOTAwKSAqIDM2NS4wICsgbGVhcHlycyk7XG4gIH0gLy8gLS0tLS0tLS0tLS0tLS0tLS0gZmluZCByZW1haW5nIGRhdGEgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gIHZhciBtZGhtcyA9IGRheXMybWRobXMoeWVhciwgZGF5cyk7XG4gIHZhciBtb24gPSBtZGhtcy5tb24sXG4gICAgICBkYXkgPSBtZGhtcy5kYXksXG4gICAgICBociA9IG1kaG1zLmhyLFxuICAgICAgbWludXRlID0gbWRobXMubWludXRlO1xuICB2YXIgc2VjID0gbWRobXMuc2VjIC0gMC4wMDAwMDA4NjQwMDtcblxuICBpZiAoYXNBcnJheSkge1xuICAgIHJldHVybiBbeWVhciwgbW9uLCBkYXksIGhyLCBtaW51dGUsIE1hdGguZmxvb3Ioc2VjKV07XG4gIH1cblxuICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9uIC0gMSwgZGF5LCBociwgbWludXRlLCBNYXRoLmZsb29yKHNlYykpKTtcbn1cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWR1cmUgZHBwZXJcbiAqXG4gKiAgdGhpcyBwcm9jZWR1cmUgcHJvdmlkZXMgZGVlcCBzcGFjZSBsb25nIHBlcmlvZCBwZXJpb2RpYyBjb250cmlidXRpb25zXG4gKiAgICB0byB0aGUgbWVhbiBlbGVtZW50cy4gIGJ5IGRlc2lnbiwgdGhlc2UgcGVyaW9kaWNzIGFyZSB6ZXJvIGF0IGVwb2NoLlxuICogICAgdGhpcyB1c2VkIHRvIGJlIGRzY29tIHdoaWNoIGluY2x1ZGVkIGluaXRpYWxpemF0aW9uLCBidXQgaXQncyByZWFsbHkgYVxuICogICAgcmVjdXJyaW5nIGZ1bmN0aW9uLlxuICpcbiAqICBhdXRob3IgICAgICAgIDogZGF2aWQgdmFsbGFkbyAgICAgICAgICAgICAgICAgIDcxOS01NzMtMjYwMCAgIDI4IGp1biAyMDA1XG4gKlxuICogIGlucHV0cyAgICAgICAgOlxuICogICAgZTMgICAgICAgICAgLVxuICogICAgZWUyICAgICAgICAgLVxuICogICAgcGVvICAgICAgICAgLVxuICogICAgcGdobyAgICAgICAgLVxuICogICAgcGhvICAgICAgICAgLVxuICogICAgcGluY28gICAgICAgLVxuICogICAgcGxvICAgICAgICAgLVxuICogICAgc2UyICwgc2UzICwgc2doMiwgc2doMywgc2doNCwgc2gyLCBzaDMsIHNpMiwgc2kzLCBzbDIsIHNsMywgc2w0IC1cbiAqICAgIHQgICAgICAgICAgIC1cbiAqICAgIHhoMiwgeGgzLCB4aTIsIHhpMywgeGwyLCB4bDMsIHhsNCAtXG4gKiAgICB6bW9sICAgICAgICAtXG4gKiAgICB6bW9zICAgICAgICAtXG4gKiAgICBlcCAgICAgICAgICAtIGVjY2VudHJpY2l0eSAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMCAtIDEuMFxuICogICAgaW5jbG8gICAgICAgLSBpbmNsaW5hdGlvbiAtIG5lZWRlZCBmb3IgbHlkZGFuZSBtb2RpZmljYXRpb25cbiAqICAgIG5vZGVwICAgICAgIC0gcmlnaHQgYXNjZW5zaW9uIG9mIGFzY2VuZGluZyBub2RlXG4gKiAgICBhcmdwcCAgICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWVcbiAqICAgIG1wICAgICAgICAgIC0gbWVhbiBhbm9tYWx5XG4gKlxuICogIG91dHB1dHMgICAgICAgOlxuICogICAgZXAgICAgICAgICAgLSBlY2NlbnRyaWNpdHkgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAgLSAxLjBcbiAqICAgIGluY2xwICAgICAgIC0gaW5jbGluYXRpb25cbiAqICAgIG5vZGVwICAgICAgICAtIHJpZ2h0IGFzY2Vuc2lvbiBvZiBhc2NlbmRpbmcgbm9kZVxuICogICAgYXJncHAgICAgICAgLSBhcmd1bWVudCBvZiBwZXJpZ2VlXG4gKiAgICBtcCAgICAgICAgICAtIG1lYW4gYW5vbWFseVxuICpcbiAqICBsb2NhbHMgICAgICAgIDpcbiAqICAgIGFsZmRwICAgICAgIC1cbiAqICAgIGJldGRwICAgICAgIC1cbiAqICAgIGNvc2lwICAsIHNpbmlwICAsIGNvc29wICAsIHNpbm9wICAsXG4gKiAgICBkYWxmICAgICAgICAtXG4gKiAgICBkYmV0ICAgICAgICAtXG4gKiAgICBkbHMgICAgICAgICAtXG4gKiAgICBmMiwgZjMgICAgICAtXG4gKiAgICBwZSAgICAgICAgICAtXG4gKiAgICBwZ2ggICAgICAgICAtXG4gKiAgICBwaCAgICAgICAgICAtXG4gKiAgICBwaW5jICAgICAgICAtXG4gKiAgICBwbCAgICAgICAgICAtXG4gKiAgICBzZWwgICAsIHNlcyAgICwgc2dobCAgLCBzZ2hzICAsIHNobCAgICwgc2hzICAgLCBzaWwgICAsIHNpbnpmICwgc2lzICAgLFxuICogICAgc2xsICAgLCBzbHNcbiAqICAgIHhscyAgICAgICAgIC1cbiAqICAgIHhub2ggICAgICAgIC1cbiAqICAgIHpmICAgICAgICAgIC1cbiAqICAgIHptICAgICAgICAgIC1cbiAqXG4gKiAgY291cGxpbmcgICAgICA6XG4gKiAgICBub25lLlxuICpcbiAqICByZWZlcmVuY2VzICAgIDpcbiAqICAgIGhvb3RzLCByb2VocmljaCwgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzMgMTk4MFxuICogICAgaG9vdHMsIG5vcmFkIHNwYWNldHJhY2sgcmVwb3J0ICM2IDE5ODZcbiAqICAgIGhvb3RzLCBzY2h1bWFjaGVyIGFuZCBnbG92ZXIgMjAwNFxuICogICAgdmFsbGFkbywgY3Jhd2ZvcmQsIGh1anNhaywga2Vsc28gIDIwMDZcbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG5mdW5jdGlvbiBkcHBlcihzYXRyZWMsIG9wdGlvbnMpIHtcbiAgdmFyIGUzID0gc2F0cmVjLmUzLFxuICAgICAgZWUyID0gc2F0cmVjLmVlMixcbiAgICAgIHBlbyA9IHNhdHJlYy5wZW8sXG4gICAgICBwZ2hvID0gc2F0cmVjLnBnaG8sXG4gICAgICBwaG8gPSBzYXRyZWMucGhvLFxuICAgICAgcGluY28gPSBzYXRyZWMucGluY28sXG4gICAgICBwbG8gPSBzYXRyZWMucGxvLFxuICAgICAgc2UyID0gc2F0cmVjLnNlMixcbiAgICAgIHNlMyA9IHNhdHJlYy5zZTMsXG4gICAgICBzZ2gyID0gc2F0cmVjLnNnaDIsXG4gICAgICBzZ2gzID0gc2F0cmVjLnNnaDMsXG4gICAgICBzZ2g0ID0gc2F0cmVjLnNnaDQsXG4gICAgICBzaDIgPSBzYXRyZWMuc2gyLFxuICAgICAgc2gzID0gc2F0cmVjLnNoMyxcbiAgICAgIHNpMiA9IHNhdHJlYy5zaTIsXG4gICAgICBzaTMgPSBzYXRyZWMuc2kzLFxuICAgICAgc2wyID0gc2F0cmVjLnNsMixcbiAgICAgIHNsMyA9IHNhdHJlYy5zbDMsXG4gICAgICBzbDQgPSBzYXRyZWMuc2w0LFxuICAgICAgdCA9IHNhdHJlYy50LFxuICAgICAgeGdoMiA9IHNhdHJlYy54Z2gyLFxuICAgICAgeGdoMyA9IHNhdHJlYy54Z2gzLFxuICAgICAgeGdoNCA9IHNhdHJlYy54Z2g0LFxuICAgICAgeGgyID0gc2F0cmVjLnhoMixcbiAgICAgIHhoMyA9IHNhdHJlYy54aDMsXG4gICAgICB4aTIgPSBzYXRyZWMueGkyLFxuICAgICAgeGkzID0gc2F0cmVjLnhpMyxcbiAgICAgIHhsMiA9IHNhdHJlYy54bDIsXG4gICAgICB4bDMgPSBzYXRyZWMueGwzLFxuICAgICAgeGw0ID0gc2F0cmVjLnhsNCxcbiAgICAgIHptb2wgPSBzYXRyZWMuem1vbCxcbiAgICAgIHptb3MgPSBzYXRyZWMuem1vcztcbiAgdmFyIGluaXQgPSBvcHRpb25zLmluaXQsXG4gICAgICBvcHNtb2RlID0gb3B0aW9ucy5vcHNtb2RlO1xuICB2YXIgZXAgPSBvcHRpb25zLmVwLFxuICAgICAgaW5jbHAgPSBvcHRpb25zLmluY2xwLFxuICAgICAgbm9kZXAgPSBvcHRpb25zLm5vZGVwLFxuICAgICAgYXJncHAgPSBvcHRpb25zLmFyZ3BwLFxuICAgICAgbXAgPSBvcHRpb25zLm1wOyAvLyBDb3B5IHNhdGVsbGl0ZSBhdHRyaWJ1dGVzIGludG8gbG9jYWwgdmFyaWFibGVzIGZvciBjb252ZW5pZW5jZVxuICAvLyBhbmQgc3ltbWV0cnkgaW4gd3JpdGluZyBmb3JtdWxhZS5cblxuICB2YXIgYWxmZHA7XG4gIHZhciBiZXRkcDtcbiAgdmFyIGNvc2lwO1xuICB2YXIgc2luaXA7XG4gIHZhciBjb3NvcDtcbiAgdmFyIHNpbm9wO1xuICB2YXIgZGFsZjtcbiAgdmFyIGRiZXQ7XG4gIHZhciBkbHM7XG4gIHZhciBmMjtcbiAgdmFyIGYzO1xuICB2YXIgcGU7XG4gIHZhciBwZ2g7XG4gIHZhciBwaDtcbiAgdmFyIHBpbmM7XG4gIHZhciBwbDtcbiAgdmFyIHNpbnpmO1xuICB2YXIgeGxzO1xuICB2YXIgeG5vaDtcbiAgdmFyIHpmO1xuICB2YXIgem07IC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGNvbnN0YW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciB6bnMgPSAxLjE5NDU5ZS01O1xuICB2YXIgemVzID0gMC4wMTY3NTtcbiAgdmFyIHpubCA9IDEuNTgzNTIxOGUtNDtcbiAgdmFyIHplbCA9IDAuMDU0OTA7IC8vICAtLS0tLS0tLS0tLS0tLS0gY2FsY3VsYXRlIHRpbWUgdmFyeWluZyBwZXJpb2RpY3MgLS0tLS0tLS0tLS1cblxuICB6bSA9IHptb3MgKyB6bnMgKiB0OyAvLyBiZSBzdXJlIHRoYXQgdGhlIGluaXRpYWwgY2FsbCBoYXMgdGltZSBzZXQgdG8gemVyb1xuXG4gIGlmIChpbml0ID09PSAneScpIHtcbiAgICB6bSA9IHptb3M7XG4gIH1cblxuICB6ZiA9IHptICsgMi4wICogemVzICogTWF0aC5zaW4oem0pO1xuICBzaW56ZiA9IE1hdGguc2luKHpmKTtcbiAgZjIgPSAwLjUgKiBzaW56ZiAqIHNpbnpmIC0gMC4yNTtcbiAgZjMgPSAtMC41ICogc2luemYgKiBNYXRoLmNvcyh6Zik7XG4gIHZhciBzZXMgPSBzZTIgKiBmMiArIHNlMyAqIGYzO1xuICB2YXIgc2lzID0gc2kyICogZjIgKyBzaTMgKiBmMztcbiAgdmFyIHNscyA9IHNsMiAqIGYyICsgc2wzICogZjMgKyBzbDQgKiBzaW56ZjtcbiAgdmFyIHNnaHMgPSBzZ2gyICogZjIgKyBzZ2gzICogZjMgKyBzZ2g0ICogc2luemY7XG4gIHZhciBzaHMgPSBzaDIgKiBmMiArIHNoMyAqIGYzO1xuICB6bSA9IHptb2wgKyB6bmwgKiB0O1xuXG4gIGlmIChpbml0ID09PSAneScpIHtcbiAgICB6bSA9IHptb2w7XG4gIH1cblxuICB6ZiA9IHptICsgMi4wICogemVsICogTWF0aC5zaW4oem0pO1xuICBzaW56ZiA9IE1hdGguc2luKHpmKTtcbiAgZjIgPSAwLjUgKiBzaW56ZiAqIHNpbnpmIC0gMC4yNTtcbiAgZjMgPSAtMC41ICogc2luemYgKiBNYXRoLmNvcyh6Zik7XG4gIHZhciBzZWwgPSBlZTIgKiBmMiArIGUzICogZjM7XG4gIHZhciBzaWwgPSB4aTIgKiBmMiArIHhpMyAqIGYzO1xuICB2YXIgc2xsID0geGwyICogZjIgKyB4bDMgKiBmMyArIHhsNCAqIHNpbnpmO1xuICB2YXIgc2dobCA9IHhnaDIgKiBmMiArIHhnaDMgKiBmMyArIHhnaDQgKiBzaW56ZjtcbiAgdmFyIHNobGwgPSB4aDIgKiBmMiArIHhoMyAqIGYzO1xuICBwZSA9IHNlcyArIHNlbDtcbiAgcGluYyA9IHNpcyArIHNpbDtcbiAgcGwgPSBzbHMgKyBzbGw7XG4gIHBnaCA9IHNnaHMgKyBzZ2hsO1xuICBwaCA9IHNocyArIHNobGw7XG5cbiAgaWYgKGluaXQgPT09ICduJykge1xuICAgIHBlIC09IHBlbztcbiAgICBwaW5jIC09IHBpbmNvO1xuICAgIHBsIC09IHBsbztcbiAgICBwZ2ggLT0gcGdobztcbiAgICBwaCAtPSBwaG87XG4gICAgaW5jbHAgKz0gcGluYztcbiAgICBlcCArPSBwZTtcbiAgICBzaW5pcCA9IE1hdGguc2luKGluY2xwKTtcbiAgICBjb3NpcCA9IE1hdGguY29zKGluY2xwKTtcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLSBhcHBseSBwZXJpb2RpY3MgZGlyZWN0bHkgLS0tLS0tLS0tLS0tICovXG4gICAgLy8gc2dwNGZpeCBmb3IgbHlkZGFuZSBjaG9pY2VcbiAgICAvLyBzdHJuMyB1c2VkIG9yaWdpbmFsIGluY2xpbmF0aW9uIC0gdGhpcyBpcyB0ZWNobmljYWxseSBmZWFzaWJsZVxuICAgIC8vIGdzZmMgdXNlZCBwZXJ0dXJiZWQgaW5jbGluYXRpb24gLSBhbHNvIHRlY2huaWNhbGx5IGZlYXNpYmxlXG4gICAgLy8gcHJvYmFibHkgYmVzdCB0byByZWFkanVzdCB0aGUgMC4yIGxpbWl0IHZhbHVlIGFuZCBsaW1pdCBkaXNjb250aW51aXR5XG4gICAgLy8gMC4yIHJhZCA9IDExLjQ1OTE2IGRlZ1xuICAgIC8vIHVzZSBuZXh0IGxpbmUgZm9yIG9yaWdpbmFsIHN0cm4zIGFwcHJvYWNoIGFuZCBvcmlnaW5hbCBpbmNsaW5hdGlvblxuICAgIC8vIGlmIChpbmNsbyA+PSAwLjIpXG4gICAgLy8gdXNlIG5leHQgbGluZSBmb3IgZ3NmYyB2ZXJzaW9uIGFuZCBwZXJ0dXJiZWQgaW5jbGluYXRpb25cblxuICAgIGlmIChpbmNscCA+PSAwLjIpIHtcbiAgICAgIHBoIC89IHNpbmlwO1xuICAgICAgcGdoIC09IGNvc2lwICogcGg7XG4gICAgICBhcmdwcCArPSBwZ2g7XG4gICAgICBub2RlcCArPSBwaDtcbiAgICAgIG1wICs9IHBsO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyAgLS0tLSBhcHBseSBwZXJpb2RpY3Mgd2l0aCBseWRkYW5lIG1vZGlmaWNhdGlvbiAtLS0tXG4gICAgICBzaW5vcCA9IE1hdGguc2luKG5vZGVwKTtcbiAgICAgIGNvc29wID0gTWF0aC5jb3Mobm9kZXApO1xuICAgICAgYWxmZHAgPSBzaW5pcCAqIHNpbm9wO1xuICAgICAgYmV0ZHAgPSBzaW5pcCAqIGNvc29wO1xuICAgICAgZGFsZiA9IHBoICogY29zb3AgKyBwaW5jICogY29zaXAgKiBzaW5vcDtcbiAgICAgIGRiZXQgPSAtcGggKiBzaW5vcCArIHBpbmMgKiBjb3NpcCAqIGNvc29wO1xuICAgICAgYWxmZHAgKz0gZGFsZjtcbiAgICAgIGJldGRwICs9IGRiZXQ7XG4gICAgICBub2RlcCAlPSB0d29QaTsgLy8gIHNncDRmaXggZm9yIGFmc3BjIHdyaXR0ZW4gaW50cmluc2ljIGZ1bmN0aW9uc1xuICAgICAgLy8gIG5vZGVwIHVzZWQgd2l0aG91dCBhIHRyaWdvbm9tZXRyaWMgZnVuY3Rpb24gYWhlYWRcblxuICAgICAgaWYgKG5vZGVwIDwgMC4wICYmIG9wc21vZGUgPT09ICdhJykge1xuICAgICAgICBub2RlcCArPSB0d29QaTtcbiAgICAgIH1cblxuICAgICAgeGxzID0gbXAgKyBhcmdwcCArIGNvc2lwICogbm9kZXA7XG4gICAgICBkbHMgPSBwbCArIHBnaCAtIHBpbmMgKiBub2RlcCAqIHNpbmlwO1xuICAgICAgeGxzICs9IGRscztcbiAgICAgIHhub2ggPSBub2RlcDtcbiAgICAgIG5vZGVwID0gTWF0aC5hdGFuMihhbGZkcCwgYmV0ZHApOyAvLyAgc2dwNGZpeCBmb3IgYWZzcGMgd3JpdHRlbiBpbnRyaW5zaWMgZnVuY3Rpb25zXG4gICAgICAvLyAgbm9kZXAgdXNlZCB3aXRob3V0IGEgdHJpZ29ub21ldHJpYyBmdW5jdGlvbiBhaGVhZFxuXG4gICAgICBpZiAobm9kZXAgPCAwLjAgJiYgb3BzbW9kZSA9PT0gJ2EnKSB7XG4gICAgICAgIG5vZGVwICs9IHR3b1BpO1xuICAgICAgfVxuXG4gICAgICBpZiAoTWF0aC5hYnMoeG5vaCAtIG5vZGVwKSA+IHBpKSB7XG4gICAgICAgIGlmIChub2RlcCA8IHhub2gpIHtcbiAgICAgICAgICBub2RlcCArPSB0d29QaTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2RlcCAtPSB0d29QaTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBtcCArPSBwbDtcbiAgICAgIGFyZ3BwID0geGxzIC0gbXAgLSBjb3NpcCAqIG5vZGVwO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZXA6IGVwLFxuICAgIGluY2xwOiBpbmNscCxcbiAgICBub2RlcDogbm9kZXAsXG4gICAgYXJncHA6IGFyZ3BwLFxuICAgIG1wOiBtcFxuICB9O1xufVxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VkdXJlIGRzY29tXG4gKlxuICogIHRoaXMgcHJvY2VkdXJlIHByb3ZpZGVzIGRlZXAgc3BhY2UgY29tbW9uIGl0ZW1zIHVzZWQgYnkgYm90aCB0aGUgc2VjdWxhclxuICogICAgYW5kIHBlcmlvZGljcyBzdWJyb3V0aW5lcy4gIGlucHV0IGlzIHByb3ZpZGVkIGFzIHNob3duLiB0aGlzIHJvdXRpbmVcbiAqICAgIHVzZWQgdG8gYmUgY2FsbGVkIGRwcGVyLCBidXQgdGhlIGZ1bmN0aW9ucyBpbnNpZGUgd2VyZW4ndCB3ZWxsIG9yZ2FuaXplZC5cbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAyOCBqdW4gMjAwNVxuICpcbiAqICBpbnB1dHMgICAgICAgIDpcbiAqICAgIGVwb2NoICAgICAgIC1cbiAqICAgIGVwICAgICAgICAgIC0gZWNjZW50cmljaXR5XG4gKiAgICBhcmdwcCAgICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWVcbiAqICAgIHRjICAgICAgICAgIC1cbiAqICAgIGluY2xwICAgICAgIC0gaW5jbGluYXRpb25cbiAqICAgIG5vZGVwICAgICAgIC0gcmlnaHQgYXNjZW5zaW9uIG9mIGFzY2VuZGluZyBub2RlXG4gKiAgICBucCAgICAgICAgICAtIG1lYW4gbW90aW9uXG4gKlxuICogIG91dHB1dHMgICAgICAgOlxuICogICAgc2luaW0gICwgY29zaW0gICwgc2lub21tICwgY29zb21tICwgc25vZG0gICwgY25vZG1cbiAqICAgIGRheSAgICAgICAgIC1cbiAqICAgIGUzICAgICAgICAgIC1cbiAqICAgIGVlMiAgICAgICAgIC1cbiAqICAgIGVtICAgICAgICAgIC0gZWNjZW50cmljaXR5XG4gKiAgICBlbXNxICAgICAgICAtIGVjY2VudHJpY2l0eSBzcXVhcmVkXG4gKiAgICBnYW0gICAgICAgICAtXG4gKiAgICBwZW8gICAgICAgICAtXG4gKiAgICBwZ2hvICAgICAgICAtXG4gKiAgICBwaG8gICAgICAgICAtXG4gKiAgICBwaW5jbyAgICAgICAtXG4gKiAgICBwbG8gICAgICAgICAtXG4gKiAgICBydGVtc3EgICAgICAtXG4gKiAgICBzZTIsIHNlMyAgICAgICAgIC1cbiAqICAgIHNnaDIsIHNnaDMsIHNnaDQgICAgICAgIC1cbiAqICAgIHNoMiwgc2gzLCBzaTIsIHNpMywgc2wyLCBzbDMsIHNsNCAgICAgICAgIC1cbiAqICAgIHMxLCBzMiwgczMsIHM0LCBzNSwgczYsIHM3ICAgICAgICAgIC1cbiAqICAgIHNzMSwgc3MyLCBzczMsIHNzNCwgc3M1LCBzczYsIHNzNywgc3oxLCBzejIsIHN6MyAgICAgICAgIC1cbiAqICAgIHN6MTEsIHN6MTIsIHN6MTMsIHN6MjEsIHN6MjIsIHN6MjMsIHN6MzEsIHN6MzIsIHN6MzMgICAgICAgIC1cbiAqICAgIHhnaDIsIHhnaDMsIHhnaDQsIHhoMiwgeGgzLCB4aTIsIHhpMywgeGwyLCB4bDMsIHhsNCAgICAgICAgIC1cbiAqICAgIG5tICAgICAgICAgIC0gbWVhbiBtb3Rpb25cbiAqICAgIHoxLCB6MiwgejMsIHoxMSwgejEyLCB6MTMsIHoyMSwgejIyLCB6MjMsIHozMSwgejMyLCB6MzMgICAgICAgICAtXG4gKiAgICB6bW9sICAgICAgICAtXG4gKiAgICB6bW9zICAgICAgICAtXG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSwgYTEwICAgICAgICAgLVxuICogICAgYmV0YXNxICAgICAgLVxuICogICAgY2MgICAgICAgICAgLVxuICogICAgY3RlbSwgc3RlbSAgICAgICAgLVxuICogICAgeDEsIHgyLCB4MywgeDQsIHg1LCB4NiwgeDcsIHg4ICAgICAgICAgIC1cbiAqICAgIHhub2RjZSAgICAgIC1cbiAqICAgIHhub2kgICAgICAgIC1cbiAqICAgIHpjb3NnICAsIHpzaW5nICAsIHpjb3NnbCAsIHpzaW5nbCAsIHpjb3NoICAsIHpzaW5oICAsIHpjb3NobCAsIHpzaW5obCAsXG4gKiAgICB6Y29zaSAgLCB6c2luaSAgLCB6Y29zaWwgLCB6c2luaWwgLFxuICogICAgenggICAgICAgICAgLVxuICogICAgenkgICAgICAgICAgLVxuICpcbiAqICBjb3VwbGluZyAgICAgIDpcbiAqICAgIG5vbmUuXG4gKlxuICogIHJlZmVyZW5jZXMgICAgOlxuICogICAgaG9vdHMsIHJvZWhyaWNoLCBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAjMyAxOTgwXG4gKiAgICBob290cywgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzYgMTk4NlxuICogICAgaG9vdHMsIHNjaHVtYWNoZXIgYW5kIGdsb3ZlciAyMDA0XG4gKiAgICB2YWxsYWRvLCBjcmF3Zm9yZCwgaHVqc2FrLCBrZWxzbyAgMjAwNlxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbmZ1bmN0aW9uIGRzY29tKG9wdGlvbnMpIHtcbiAgdmFyIGVwb2NoID0gb3B0aW9ucy5lcG9jaCxcbiAgICAgIGVwID0gb3B0aW9ucy5lcCxcbiAgICAgIGFyZ3BwID0gb3B0aW9ucy5hcmdwcCxcbiAgICAgIHRjID0gb3B0aW9ucy50YyxcbiAgICAgIGluY2xwID0gb3B0aW9ucy5pbmNscCxcbiAgICAgIG5vZGVwID0gb3B0aW9ucy5ub2RlcCxcbiAgICAgIG5wID0gb3B0aW9ucy5ucDtcbiAgdmFyIGExO1xuICB2YXIgYTI7XG4gIHZhciBhMztcbiAgdmFyIGE0O1xuICB2YXIgYTU7XG4gIHZhciBhNjtcbiAgdmFyIGE3O1xuICB2YXIgYTg7XG4gIHZhciBhOTtcbiAgdmFyIGExMDtcbiAgdmFyIGNjO1xuICB2YXIgeDE7XG4gIHZhciB4MjtcbiAgdmFyIHgzO1xuICB2YXIgeDQ7XG4gIHZhciB4NTtcbiAgdmFyIHg2O1xuICB2YXIgeDc7XG4gIHZhciB4ODtcbiAgdmFyIHpjb3NnO1xuICB2YXIgenNpbmc7XG4gIHZhciB6Y29zaDtcbiAgdmFyIHpzaW5oO1xuICB2YXIgemNvc2k7XG4gIHZhciB6c2luaTtcbiAgdmFyIHNzMTtcbiAgdmFyIHNzMjtcbiAgdmFyIHNzMztcbiAgdmFyIHNzNDtcbiAgdmFyIHNzNTtcbiAgdmFyIHNzNjtcbiAgdmFyIHNzNztcbiAgdmFyIHN6MTtcbiAgdmFyIHN6MjtcbiAgdmFyIHN6MztcbiAgdmFyIHN6MTE7XG4gIHZhciBzejEyO1xuICB2YXIgc3oxMztcbiAgdmFyIHN6MjE7XG4gIHZhciBzejIyO1xuICB2YXIgc3oyMztcbiAgdmFyIHN6MzE7XG4gIHZhciBzejMyO1xuICB2YXIgc3ozMztcbiAgdmFyIHMxO1xuICB2YXIgczI7XG4gIHZhciBzMztcbiAgdmFyIHM0O1xuICB2YXIgczU7XG4gIHZhciBzNjtcbiAgdmFyIHM3O1xuICB2YXIgejE7XG4gIHZhciB6MjtcbiAgdmFyIHozO1xuICB2YXIgejExO1xuICB2YXIgejEyO1xuICB2YXIgejEzO1xuICB2YXIgejIxO1xuICB2YXIgejIyO1xuICB2YXIgejIzO1xuICB2YXIgejMxO1xuICB2YXIgejMyO1xuICB2YXIgejMzOyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBjb25zdGFudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciB6ZXMgPSAwLjAxNjc1O1xuICB2YXIgemVsID0gMC4wNTQ5MDtcbiAgdmFyIGMxc3MgPSAyLjk4NjQ3OTdlLTY7XG4gIHZhciBjMWwgPSA0Ljc5NjgwNjVlLTc7XG4gIHZhciB6c2luaXMgPSAwLjM5Nzg1NDE2O1xuICB2YXIgemNvc2lzID0gMC45MTc0NDg2NztcbiAgdmFyIHpjb3NncyA9IDAuMTk0NTkwNTtcbiAgdmFyIHpzaW5ncyA9IC0wLjk4MDg4NDU4OyAvLyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGxvY2FsIHZhcmlhYmxlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgbm0gPSBucDtcbiAgdmFyIGVtID0gZXA7XG4gIHZhciBzbm9kbSA9IE1hdGguc2luKG5vZGVwKTtcbiAgdmFyIGNub2RtID0gTWF0aC5jb3Mobm9kZXApO1xuICB2YXIgc2lub21tID0gTWF0aC5zaW4oYXJncHApO1xuICB2YXIgY29zb21tID0gTWF0aC5jb3MoYXJncHApO1xuICB2YXIgc2luaW0gPSBNYXRoLnNpbihpbmNscCk7XG4gIHZhciBjb3NpbSA9IE1hdGguY29zKGluY2xwKTtcbiAgdmFyIGVtc3EgPSBlbSAqIGVtO1xuICB2YXIgYmV0YXNxID0gMS4wIC0gZW1zcTtcbiAgdmFyIHJ0ZW1zcSA9IE1hdGguc3FydChiZXRhc3EpOyAvLyAgLS0tLS0tLS0tLS0tLS0tLS0gaW5pdGlhbGl6ZSBsdW5hciBzb2xhciB0ZXJtcyAtLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgcGVvID0gMC4wO1xuICB2YXIgcGluY28gPSAwLjA7XG4gIHZhciBwbG8gPSAwLjA7XG4gIHZhciBwZ2hvID0gMC4wO1xuICB2YXIgcGhvID0gMC4wO1xuICB2YXIgZGF5ID0gZXBvY2ggKyAxODI2MS41ICsgdGMgLyAxNDQwLjA7XG4gIHZhciB4bm9kY2UgPSAoNC41MjM2MDIwIC0gOS4yNDIyMDI5ZS00ICogZGF5KSAlIHR3b1BpO1xuICB2YXIgc3RlbSA9IE1hdGguc2luKHhub2RjZSk7XG4gIHZhciBjdGVtID0gTWF0aC5jb3MoeG5vZGNlKTtcbiAgdmFyIHpjb3NpbCA9IDAuOTEzNzUxNjQgLSAwLjAzNTY4MDk2ICogY3RlbTtcbiAgdmFyIHpzaW5pbCA9IE1hdGguc3FydCgxLjAgLSB6Y29zaWwgKiB6Y29zaWwpO1xuICB2YXIgenNpbmhsID0gMC4wODk2ODM1MTEgKiBzdGVtIC8genNpbmlsO1xuICB2YXIgemNvc2hsID0gTWF0aC5zcXJ0KDEuMCAtIHpzaW5obCAqIHpzaW5obCk7XG4gIHZhciBnYW0gPSA1LjgzNTE1MTQgKyAwLjAwMTk0NDM2ODAgKiBkYXk7XG4gIHZhciB6eCA9IDAuMzk3ODU0MTYgKiBzdGVtIC8genNpbmlsO1xuICB2YXIgenkgPSB6Y29zaGwgKiBjdGVtICsgMC45MTc0NDg2NyAqIHpzaW5obCAqIHN0ZW07XG4gIHp4ID0gTWF0aC5hdGFuMih6eCwgenkpO1xuICB6eCArPSBnYW0gLSB4bm9kY2U7XG4gIHZhciB6Y29zZ2wgPSBNYXRoLmNvcyh6eCk7XG4gIHZhciB6c2luZ2wgPSBNYXRoLnNpbih6eCk7IC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRvIHNvbGFyIHRlcm1zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHpjb3NnID0gemNvc2dzO1xuICB6c2luZyA9IHpzaW5ncztcbiAgemNvc2kgPSB6Y29zaXM7XG4gIHpzaW5pID0genNpbmlzO1xuICB6Y29zaCA9IGNub2RtO1xuICB6c2luaCA9IHNub2RtO1xuICBjYyA9IGMxc3M7XG4gIHZhciB4bm9pID0gMS4wIC8gbm07XG4gIHZhciBsc2ZsZyA9IDA7XG5cbiAgd2hpbGUgKGxzZmxnIDwgMikge1xuICAgIGxzZmxnICs9IDE7XG4gICAgYTEgPSB6Y29zZyAqIHpjb3NoICsgenNpbmcgKiB6Y29zaSAqIHpzaW5oO1xuICAgIGEzID0gLXpzaW5nICogemNvc2ggKyB6Y29zZyAqIHpjb3NpICogenNpbmg7XG4gICAgYTcgPSAtemNvc2cgKiB6c2luaCArIHpzaW5nICogemNvc2kgKiB6Y29zaDtcbiAgICBhOCA9IHpzaW5nICogenNpbmk7XG4gICAgYTkgPSB6c2luZyAqIHpzaW5oICsgemNvc2cgKiB6Y29zaSAqIHpjb3NoO1xuICAgIGExMCA9IHpjb3NnICogenNpbmk7XG4gICAgYTIgPSBjb3NpbSAqIGE3ICsgc2luaW0gKiBhODtcbiAgICBhNCA9IGNvc2ltICogYTkgKyBzaW5pbSAqIGExMDtcbiAgICBhNSA9IC1zaW5pbSAqIGE3ICsgY29zaW0gKiBhODtcbiAgICBhNiA9IC1zaW5pbSAqIGE5ICsgY29zaW0gKiBhMTA7XG4gICAgeDEgPSBhMSAqIGNvc29tbSArIGEyICogc2lub21tO1xuICAgIHgyID0gYTMgKiBjb3NvbW0gKyBhNCAqIHNpbm9tbTtcbiAgICB4MyA9IC1hMSAqIHNpbm9tbSArIGEyICogY29zb21tO1xuICAgIHg0ID0gLWEzICogc2lub21tICsgYTQgKiBjb3NvbW07XG4gICAgeDUgPSBhNSAqIHNpbm9tbTtcbiAgICB4NiA9IGE2ICogc2lub21tO1xuICAgIHg3ID0gYTUgKiBjb3NvbW07XG4gICAgeDggPSBhNiAqIGNvc29tbTtcbiAgICB6MzEgPSAxMi4wICogeDEgKiB4MSAtIDMuMCAqIHgzICogeDM7XG4gICAgejMyID0gMjQuMCAqIHgxICogeDIgLSA2LjAgKiB4MyAqIHg0O1xuICAgIHozMyA9IDEyLjAgKiB4MiAqIHgyIC0gMy4wICogeDQgKiB4NDtcbiAgICB6MSA9IDMuMCAqIChhMSAqIGExICsgYTIgKiBhMikgKyB6MzEgKiBlbXNxO1xuICAgIHoyID0gNi4wICogKGExICogYTMgKyBhMiAqIGE0KSArIHozMiAqIGVtc3E7XG4gICAgejMgPSAzLjAgKiAoYTMgKiBhMyArIGE0ICogYTQpICsgejMzICogZW1zcTtcbiAgICB6MTEgPSAtNi4wICogYTEgKiBhNSArIGVtc3EgKiAoLTI0LjAgKiB4MSAqIHg3IC0gNi4wICogeDMgKiB4NSk7XG4gICAgejEyID0gLTYuMCAqIChhMSAqIGE2ICsgYTMgKiBhNSkgKyBlbXNxICogKC0yNC4wICogKHgyICogeDcgKyB4MSAqIHg4KSArIC02LjAgKiAoeDMgKiB4NiArIHg0ICogeDUpKTtcbiAgICB6MTMgPSAtNi4wICogYTMgKiBhNiArIGVtc3EgKiAoLTI0LjAgKiB4MiAqIHg4IC0gNi4wICogeDQgKiB4Nik7XG4gICAgejIxID0gNi4wICogYTIgKiBhNSArIGVtc3EgKiAoMjQuMCAqIHgxICogeDUgLSA2LjAgKiB4MyAqIHg3KTtcbiAgICB6MjIgPSA2LjAgKiAoYTQgKiBhNSArIGEyICogYTYpICsgZW1zcSAqICgyNC4wICogKHgyICogeDUgKyB4MSAqIHg2KSAtIDYuMCAqICh4NCAqIHg3ICsgeDMgKiB4OCkpO1xuICAgIHoyMyA9IDYuMCAqIGE0ICogYTYgKyBlbXNxICogKDI0LjAgKiB4MiAqIHg2IC0gNi4wICogeDQgKiB4OCk7XG4gICAgejEgPSB6MSArIHoxICsgYmV0YXNxICogejMxO1xuICAgIHoyID0gejIgKyB6MiArIGJldGFzcSAqIHozMjtcbiAgICB6MyA9IHozICsgejMgKyBiZXRhc3EgKiB6MzM7XG4gICAgczMgPSBjYyAqIHhub2k7XG4gICAgczIgPSAtMC41ICogczMgLyBydGVtc3E7XG4gICAgczQgPSBzMyAqIHJ0ZW1zcTtcbiAgICBzMSA9IC0xNS4wICogZW0gKiBzNDtcbiAgICBzNSA9IHgxICogeDMgKyB4MiAqIHg0O1xuICAgIHM2ID0geDIgKiB4MyArIHgxICogeDQ7XG4gICAgczcgPSB4MiAqIHg0IC0geDEgKiB4MzsgLy8gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRvIGx1bmFyIHRlcm1zIC0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGlmIChsc2ZsZyA9PT0gMSkge1xuICAgICAgc3MxID0gczE7XG4gICAgICBzczIgPSBzMjtcbiAgICAgIHNzMyA9IHMzO1xuICAgICAgc3M0ID0gczQ7XG4gICAgICBzczUgPSBzNTtcbiAgICAgIHNzNiA9IHM2O1xuICAgICAgc3M3ID0gczc7XG4gICAgICBzejEgPSB6MTtcbiAgICAgIHN6MiA9IHoyO1xuICAgICAgc3ozID0gejM7XG4gICAgICBzejExID0gejExO1xuICAgICAgc3oxMiA9IHoxMjtcbiAgICAgIHN6MTMgPSB6MTM7XG4gICAgICBzejIxID0gejIxO1xuICAgICAgc3oyMiA9IHoyMjtcbiAgICAgIHN6MjMgPSB6MjM7XG4gICAgICBzejMxID0gejMxO1xuICAgICAgc3ozMiA9IHozMjtcbiAgICAgIHN6MzMgPSB6MzM7XG4gICAgICB6Y29zZyA9IHpjb3NnbDtcbiAgICAgIHpzaW5nID0genNpbmdsO1xuICAgICAgemNvc2kgPSB6Y29zaWw7XG4gICAgICB6c2luaSA9IHpzaW5pbDtcbiAgICAgIHpjb3NoID0gemNvc2hsICogY25vZG0gKyB6c2luaGwgKiBzbm9kbTtcbiAgICAgIHpzaW5oID0gc25vZG0gKiB6Y29zaGwgLSBjbm9kbSAqIHpzaW5obDtcbiAgICAgIGNjID0gYzFsO1xuICAgIH1cbiAgfVxuXG4gIHZhciB6bW9sID0gKDQuNzE5OTY3MiArICgwLjIyOTk3MTUwICogZGF5IC0gZ2FtKSkgJSB0d29QaTtcbiAgdmFyIHptb3MgPSAoNi4yNTY1ODM3ICsgMC4wMTcyMDE5NzcgKiBkYXkpICUgdHdvUGk7IC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZG8gc29sYXIgdGVybXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBzZTIgPSAyLjAgKiBzczEgKiBzczY7XG4gIHZhciBzZTMgPSAyLjAgKiBzczEgKiBzczc7XG4gIHZhciBzaTIgPSAyLjAgKiBzczIgKiBzejEyO1xuICB2YXIgc2kzID0gMi4wICogc3MyICogKHN6MTMgLSBzejExKTtcbiAgdmFyIHNsMiA9IC0yLjAgKiBzczMgKiBzejI7XG4gIHZhciBzbDMgPSAtMi4wICogc3MzICogKHN6MyAtIHN6MSk7XG4gIHZhciBzbDQgPSAtMi4wICogc3MzICogKC0yMS4wIC0gOS4wICogZW1zcSkgKiB6ZXM7XG4gIHZhciBzZ2gyID0gMi4wICogc3M0ICogc3ozMjtcbiAgdmFyIHNnaDMgPSAyLjAgKiBzczQgKiAoc3ozMyAtIHN6MzEpO1xuICB2YXIgc2doNCA9IC0xOC4wICogc3M0ICogemVzO1xuICB2YXIgc2gyID0gLTIuMCAqIHNzMiAqIHN6MjI7XG4gIHZhciBzaDMgPSAtMi4wICogc3MyICogKHN6MjMgLSBzejIxKTsgLy8gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkbyBsdW5hciB0ZXJtcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIGVlMiA9IDIuMCAqIHMxICogczY7XG4gIHZhciBlMyA9IDIuMCAqIHMxICogczc7XG4gIHZhciB4aTIgPSAyLjAgKiBzMiAqIHoxMjtcbiAgdmFyIHhpMyA9IDIuMCAqIHMyICogKHoxMyAtIHoxMSk7XG4gIHZhciB4bDIgPSAtMi4wICogczMgKiB6MjtcbiAgdmFyIHhsMyA9IC0yLjAgKiBzMyAqICh6MyAtIHoxKTtcbiAgdmFyIHhsNCA9IC0yLjAgKiBzMyAqICgtMjEuMCAtIDkuMCAqIGVtc3EpICogemVsO1xuICB2YXIgeGdoMiA9IDIuMCAqIHM0ICogejMyO1xuICB2YXIgeGdoMyA9IDIuMCAqIHM0ICogKHozMyAtIHozMSk7XG4gIHZhciB4Z2g0ID0gLTE4LjAgKiBzNCAqIHplbDtcbiAgdmFyIHhoMiA9IC0yLjAgKiBzMiAqIHoyMjtcbiAgdmFyIHhoMyA9IC0yLjAgKiBzMiAqICh6MjMgLSB6MjEpO1xuICByZXR1cm4ge1xuICAgIHNub2RtOiBzbm9kbSxcbiAgICBjbm9kbTogY25vZG0sXG4gICAgc2luaW06IHNpbmltLFxuICAgIGNvc2ltOiBjb3NpbSxcbiAgICBzaW5vbW06IHNpbm9tbSxcbiAgICBjb3NvbW06IGNvc29tbSxcbiAgICBkYXk6IGRheSxcbiAgICBlMzogZTMsXG4gICAgZWUyOiBlZTIsXG4gICAgZW06IGVtLFxuICAgIGVtc3E6IGVtc3EsXG4gICAgZ2FtOiBnYW0sXG4gICAgcGVvOiBwZW8sXG4gICAgcGdobzogcGdobyxcbiAgICBwaG86IHBobyxcbiAgICBwaW5jbzogcGluY28sXG4gICAgcGxvOiBwbG8sXG4gICAgcnRlbXNxOiBydGVtc3EsXG4gICAgc2UyOiBzZTIsXG4gICAgc2UzOiBzZTMsXG4gICAgc2doMjogc2doMixcbiAgICBzZ2gzOiBzZ2gzLFxuICAgIHNnaDQ6IHNnaDQsXG4gICAgc2gyOiBzaDIsXG4gICAgc2gzOiBzaDMsXG4gICAgc2kyOiBzaTIsXG4gICAgc2kzOiBzaTMsXG4gICAgc2wyOiBzbDIsXG4gICAgc2wzOiBzbDMsXG4gICAgc2w0OiBzbDQsXG4gICAgczE6IHMxLFxuICAgIHMyOiBzMixcbiAgICBzMzogczMsXG4gICAgczQ6IHM0LFxuICAgIHM1OiBzNSxcbiAgICBzNjogczYsXG4gICAgczc6IHM3LFxuICAgIHNzMTogc3MxLFxuICAgIHNzMjogc3MyLFxuICAgIHNzMzogc3MzLFxuICAgIHNzNDogc3M0LFxuICAgIHNzNTogc3M1LFxuICAgIHNzNjogc3M2LFxuICAgIHNzNzogc3M3LFxuICAgIHN6MTogc3oxLFxuICAgIHN6Mjogc3oyLFxuICAgIHN6Mzogc3ozLFxuICAgIHN6MTE6IHN6MTEsXG4gICAgc3oxMjogc3oxMixcbiAgICBzejEzOiBzejEzLFxuICAgIHN6MjE6IHN6MjEsXG4gICAgc3oyMjogc3oyMixcbiAgICBzejIzOiBzejIzLFxuICAgIHN6MzE6IHN6MzEsXG4gICAgc3ozMjogc3ozMixcbiAgICBzejMzOiBzejMzLFxuICAgIHhnaDI6IHhnaDIsXG4gICAgeGdoMzogeGdoMyxcbiAgICB4Z2g0OiB4Z2g0LFxuICAgIHhoMjogeGgyLFxuICAgIHhoMzogeGgzLFxuICAgIHhpMjogeGkyLFxuICAgIHhpMzogeGkzLFxuICAgIHhsMjogeGwyLFxuICAgIHhsMzogeGwzLFxuICAgIHhsNDogeGw0LFxuICAgIG5tOiBubSxcbiAgICB6MTogejEsXG4gICAgejI6IHoyLFxuICAgIHozOiB6MyxcbiAgICB6MTE6IHoxMSxcbiAgICB6MTI6IHoxMixcbiAgICB6MTM6IHoxMyxcbiAgICB6MjE6IHoyMSxcbiAgICB6MjI6IHoyMixcbiAgICB6MjM6IHoyMyxcbiAgICB6MzE6IHozMSxcbiAgICB6MzI6IHozMixcbiAgICB6MzM6IHozMyxcbiAgICB6bW9sOiB6bW9sLFxuICAgIHptb3M6IHptb3NcbiAgfTtcbn1cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZHVyZSBkc2luaXRcbiAqXG4gKiAgdGhpcyBwcm9jZWR1cmUgcHJvdmlkZXMgZGVlcCBzcGFjZSBjb250cmlidXRpb25zIHRvIG1lYW4gbW90aW9uIGRvdCBkdWVcbiAqICAgIHRvIGdlb3BvdGVudGlhbCByZXNvbmFuY2Ugd2l0aCBoYWxmIGRheSBhbmQgb25lIGRheSBvcmJpdHMuXG4gKlxuICogIGF1dGhvciAgICAgICAgOiBkYXZpZCB2YWxsYWRvICAgICAgICAgICAgICAgICAgNzE5LTU3My0yNjAwICAgMjgganVuIDIwMDVcbiAqXG4gKiAgaW5wdXRzICAgICAgICA6XG4gKiAgICBjb3NpbSwgc2luaW0tXG4gKiAgICBlbXNxICAgICAgICAtIGVjY2VudHJpY2l0eSBzcXVhcmVkXG4gKiAgICBhcmdwbyAgICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWVcbiAqICAgIHMxLCBzMiwgczMsIHM0LCBzNSAgICAgIC1cbiAqICAgIHNzMSwgc3MyLCBzczMsIHNzNCwgc3M1IC1cbiAqICAgIHN6MSwgc3ozLCBzejExLCBzejEzLCBzejIxLCBzejIzLCBzejMxLCBzejMzIC1cbiAqICAgIHQgICAgICAgICAgIC0gdGltZVxuICogICAgdGMgICAgICAgICAgLVxuICogICAgZ3N0byAgICAgICAgLSBncmVlbndpY2ggc2lkZXJlYWwgdGltZSAgICAgICAgICAgICAgICAgICByYWRcbiAqICAgIG1vICAgICAgICAgIC0gbWVhbiBhbm9tYWx5XG4gKiAgICBtZG90ICAgICAgICAtIG1lYW4gYW5vbWFseSBkb3QgKHJhdGUpXG4gKiAgICBubyAgICAgICAgICAtIG1lYW4gbW90aW9uXG4gKiAgICBub2RlbyAgICAgICAtIHJpZ2h0IGFzY2Vuc2lvbiBvZiBhc2NlbmRpbmcgbm9kZVxuICogICAgbm9kZWRvdCAgICAgLSByaWdodCBhc2NlbnNpb24gb2YgYXNjZW5kaW5nIG5vZGUgZG90IChyYXRlKVxuICogICAgeHBpZG90ICAgICAgLVxuICogICAgejEsIHozLCB6MTEsIHoxMywgejIxLCB6MjMsIHozMSwgejMzIC1cbiAqICAgIGVjY20gICAgICAgIC0gZWNjZW50cmljaXR5XG4gKiAgICBhcmdwbSAgICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWVcbiAqICAgIGluY2xtICAgICAgIC0gaW5jbGluYXRpb25cbiAqICAgIG1tICAgICAgICAgIC0gbWVhbiBhbm9tYWx5XG4gKiAgICB4biAgICAgICAgICAtIG1lYW4gbW90aW9uXG4gKiAgICBub2RlbSAgICAgICAtIHJpZ2h0IGFzY2Vuc2lvbiBvZiBhc2NlbmRpbmcgbm9kZVxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIGVtICAgICAgICAgIC0gZWNjZW50cmljaXR5XG4gKiAgICBhcmdwbSAgICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWVcbiAqICAgIGluY2xtICAgICAgIC0gaW5jbGluYXRpb25cbiAqICAgIG1tICAgICAgICAgIC0gbWVhbiBhbm9tYWx5XG4gKiAgICBubSAgICAgICAgICAtIG1lYW4gbW90aW9uXG4gKiAgICBub2RlbSAgICAgICAtIHJpZ2h0IGFzY2Vuc2lvbiBvZiBhc2NlbmRpbmcgbm9kZVxuICogICAgaXJleiAgICAgICAgLSBmbGFnIGZvciByZXNvbmFuY2UgICAgICAgICAgIDAtbm9uZSwgMS1vbmUgZGF5LCAyLWhhbGYgZGF5XG4gKiAgICBhdGltZSAgICAgICAtXG4gKiAgICBkMjIwMSwgZDIyMTEsIGQzMjEwLCBkMzIyMiwgZDQ0MTAsIGQ0NDIyLCBkNTIyMCwgZDUyMzIsIGQ1NDIxLCBkNTQzMyAgICAtXG4gKiAgICBkZWR0ICAgICAgICAtXG4gKiAgICBkaWR0ICAgICAgICAtXG4gKiAgICBkbWR0ICAgICAgICAtXG4gKiAgICBkbmR0ICAgICAgICAtXG4gKiAgICBkbm9kdCAgICAgICAtXG4gKiAgICBkb21kdCAgICAgICAtXG4gKiAgICBkZWwxLCBkZWwyLCBkZWwzICAgICAgICAtXG4gKiAgICBzZXMgICwgc2dobCAsIHNnaHMgLCBzZ3MgICwgc2hsICAsIHNocyAgLCBzaXMgICwgc2xzXG4gKiAgICB0aGV0YSAgICAgICAtXG4gKiAgICB4ZmFjdCAgICAgICAtXG4gKiAgICB4bGFtbyAgICAgICAtXG4gKiAgICB4bGkgICAgICAgICAtXG4gKiAgICB4bmlcbiAqXG4gKiAgbG9jYWxzICAgICAgICA6XG4gKiAgICBhaW52MiAgICAgICAtXG4gKiAgICBhb252ICAgICAgICAtXG4gKiAgICBjb3Npc3EgICAgICAtXG4gKiAgICBlb2MgICAgICAgICAtXG4gKiAgICBmMjIwLCBmMjIxLCBmMzExLCBmMzIxLCBmMzIyLCBmMzMwLCBmNDQxLCBmNDQyLCBmNTIyLCBmNTIzLCBmNTQyLCBmNTQzICAtXG4gKiAgICBnMjAwLCBnMjAxLCBnMjExLCBnMzAwLCBnMzEwLCBnMzIyLCBnNDEwLCBnNDIyLCBnNTIwLCBnNTIxLCBnNTMyLCBnNTMzICAtXG4gKiAgICBzaW5pMiAgICAgICAtXG4gKiAgICB0ZW1wICAgICAgICAtXG4gKiAgICB0ZW1wMSAgICAgICAtXG4gKiAgICB0aGV0YSAgICAgICAtXG4gKiAgICB4bm8yICAgICAgICAtXG4gKlxuICogIGNvdXBsaW5nICAgICAgOlxuICogICAgZ2V0Z3JhdmNvbnN0XG4gKlxuICogIHJlZmVyZW5jZXMgICAgOlxuICogICAgaG9vdHMsIHJvZWhyaWNoLCBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAjMyAxOTgwXG4gKiAgICBob290cywgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzYgMTk4NlxuICogICAgaG9vdHMsIHNjaHVtYWNoZXIgYW5kIGdsb3ZlciAyMDA0XG4gKiAgICB2YWxsYWRvLCBjcmF3Zm9yZCwgaHVqc2FrLCBrZWxzbyAgMjAwNlxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbmZ1bmN0aW9uIGRzaW5pdChvcHRpb25zKSB7XG4gIHZhciBjb3NpbSA9IG9wdGlvbnMuY29zaW0sXG4gICAgICBhcmdwbyA9IG9wdGlvbnMuYXJncG8sXG4gICAgICBzMSA9IG9wdGlvbnMuczEsXG4gICAgICBzMiA9IG9wdGlvbnMuczIsXG4gICAgICBzMyA9IG9wdGlvbnMuczMsXG4gICAgICBzNCA9IG9wdGlvbnMuczQsXG4gICAgICBzNSA9IG9wdGlvbnMuczUsXG4gICAgICBzaW5pbSA9IG9wdGlvbnMuc2luaW0sXG4gICAgICBzczEgPSBvcHRpb25zLnNzMSxcbiAgICAgIHNzMiA9IG9wdGlvbnMuc3MyLFxuICAgICAgc3MzID0gb3B0aW9ucy5zczMsXG4gICAgICBzczQgPSBvcHRpb25zLnNzNCxcbiAgICAgIHNzNSA9IG9wdGlvbnMuc3M1LFxuICAgICAgc3oxID0gb3B0aW9ucy5zejEsXG4gICAgICBzejMgPSBvcHRpb25zLnN6MyxcbiAgICAgIHN6MTEgPSBvcHRpb25zLnN6MTEsXG4gICAgICBzejEzID0gb3B0aW9ucy5zejEzLFxuICAgICAgc3oyMSA9IG9wdGlvbnMuc3oyMSxcbiAgICAgIHN6MjMgPSBvcHRpb25zLnN6MjMsXG4gICAgICBzejMxID0gb3B0aW9ucy5zejMxLFxuICAgICAgc3ozMyA9IG9wdGlvbnMuc3ozMyxcbiAgICAgIHQgPSBvcHRpb25zLnQsXG4gICAgICB0YyA9IG9wdGlvbnMudGMsXG4gICAgICBnc3RvID0gb3B0aW9ucy5nc3RvLFxuICAgICAgbW8gPSBvcHRpb25zLm1vLFxuICAgICAgbWRvdCA9IG9wdGlvbnMubWRvdCxcbiAgICAgIG5vID0gb3B0aW9ucy5ubyxcbiAgICAgIG5vZGVvID0gb3B0aW9ucy5ub2RlbyxcbiAgICAgIG5vZGVkb3QgPSBvcHRpb25zLm5vZGVkb3QsXG4gICAgICB4cGlkb3QgPSBvcHRpb25zLnhwaWRvdCxcbiAgICAgIHoxID0gb3B0aW9ucy56MSxcbiAgICAgIHozID0gb3B0aW9ucy56MyxcbiAgICAgIHoxMSA9IG9wdGlvbnMuejExLFxuICAgICAgejEzID0gb3B0aW9ucy56MTMsXG4gICAgICB6MjEgPSBvcHRpb25zLnoyMSxcbiAgICAgIHoyMyA9IG9wdGlvbnMuejIzLFxuICAgICAgejMxID0gb3B0aW9ucy56MzEsXG4gICAgICB6MzMgPSBvcHRpb25zLnozMyxcbiAgICAgIGVjY28gPSBvcHRpb25zLmVjY28sXG4gICAgICBlY2NzcSA9IG9wdGlvbnMuZWNjc3E7XG4gIHZhciBlbXNxID0gb3B0aW9ucy5lbXNxLFxuICAgICAgZW0gPSBvcHRpb25zLmVtLFxuICAgICAgYXJncG0gPSBvcHRpb25zLmFyZ3BtLFxuICAgICAgaW5jbG0gPSBvcHRpb25zLmluY2xtLFxuICAgICAgbW0gPSBvcHRpb25zLm1tLFxuICAgICAgbm0gPSBvcHRpb25zLm5tLFxuICAgICAgbm9kZW0gPSBvcHRpb25zLm5vZGVtLFxuICAgICAgaXJleiA9IG9wdGlvbnMuaXJleixcbiAgICAgIGF0aW1lID0gb3B0aW9ucy5hdGltZSxcbiAgICAgIGQyMjAxID0gb3B0aW9ucy5kMjIwMSxcbiAgICAgIGQyMjExID0gb3B0aW9ucy5kMjIxMSxcbiAgICAgIGQzMjEwID0gb3B0aW9ucy5kMzIxMCxcbiAgICAgIGQzMjIyID0gb3B0aW9ucy5kMzIyMixcbiAgICAgIGQ0NDEwID0gb3B0aW9ucy5kNDQxMCxcbiAgICAgIGQ0NDIyID0gb3B0aW9ucy5kNDQyMixcbiAgICAgIGQ1MjIwID0gb3B0aW9ucy5kNTIyMCxcbiAgICAgIGQ1MjMyID0gb3B0aW9ucy5kNTIzMixcbiAgICAgIGQ1NDIxID0gb3B0aW9ucy5kNTQyMSxcbiAgICAgIGQ1NDMzID0gb3B0aW9ucy5kNTQzMyxcbiAgICAgIGRlZHQgPSBvcHRpb25zLmRlZHQsXG4gICAgICBkaWR0ID0gb3B0aW9ucy5kaWR0LFxuICAgICAgZG1kdCA9IG9wdGlvbnMuZG1kdCxcbiAgICAgIGRub2R0ID0gb3B0aW9ucy5kbm9kdCxcbiAgICAgIGRvbWR0ID0gb3B0aW9ucy5kb21kdCxcbiAgICAgIGRlbDEgPSBvcHRpb25zLmRlbDEsXG4gICAgICBkZWwyID0gb3B0aW9ucy5kZWwyLFxuICAgICAgZGVsMyA9IG9wdGlvbnMuZGVsMyxcbiAgICAgIHhmYWN0ID0gb3B0aW9ucy54ZmFjdCxcbiAgICAgIHhsYW1vID0gb3B0aW9ucy54bGFtbyxcbiAgICAgIHhsaSA9IG9wdGlvbnMueGxpLFxuICAgICAgeG5pID0gb3B0aW9ucy54bmk7XG4gIHZhciBmMjIwO1xuICB2YXIgZjIyMTtcbiAgdmFyIGYzMTE7XG4gIHZhciBmMzIxO1xuICB2YXIgZjMyMjtcbiAgdmFyIGYzMzA7XG4gIHZhciBmNDQxO1xuICB2YXIgZjQ0MjtcbiAgdmFyIGY1MjI7XG4gIHZhciBmNTIzO1xuICB2YXIgZjU0MjtcbiAgdmFyIGY1NDM7XG4gIHZhciBnMjAwO1xuICB2YXIgZzIwMTtcbiAgdmFyIGcyMTE7XG4gIHZhciBnMzAwO1xuICB2YXIgZzMxMDtcbiAgdmFyIGczMjI7XG4gIHZhciBnNDEwO1xuICB2YXIgZzQyMjtcbiAgdmFyIGc1MjA7XG4gIHZhciBnNTIxO1xuICB2YXIgZzUzMjtcbiAgdmFyIGc1MzM7XG4gIHZhciBzaW5pMjtcbiAgdmFyIHRlbXA7XG4gIHZhciB0ZW1wMTtcbiAgdmFyIHhubzI7XG4gIHZhciBhaW52MjtcbiAgdmFyIGFvbnY7XG4gIHZhciBjb3Npc3E7XG4gIHZhciBlb2M7XG4gIHZhciBxMjIgPSAxLjc4OTE2NzllLTY7XG4gIHZhciBxMzEgPSAyLjE0NjA3NDhlLTY7XG4gIHZhciBxMzMgPSAyLjIxMjMwMTVlLTc7XG4gIHZhciByb290MjIgPSAxLjc4OTE2NzllLTY7XG4gIHZhciByb290NDQgPSA3LjM2MzY5NTNlLTk7XG4gIHZhciByb290NTQgPSAyLjE3NjU4MDNlLTk7XG4gIHZhciBycHRpbSA9IDQuMzc1MjY5MDg4MDExMjk5NjZlLTM7IC8vIGVxdWF0ZXMgdG8gNy4yOTIxMTUxNDY2ODg1NWUtNSByYWQvc2VjXG5cbiAgdmFyIHJvb3QzMiA9IDMuNzM5Mzc5MmUtNztcbiAgdmFyIHJvb3Q1MiA9IDEuMTQyODYzOWUtNztcbiAgdmFyIHpubCA9IDEuNTgzNTIxOGUtNDtcbiAgdmFyIHpucyA9IDEuMTk0NTllLTU7IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tIGRlZXAgc3BhY2UgaW5pdGlhbGl6YXRpb24gLS0tLS0tLS0tLS0tXG5cbiAgaXJleiA9IDA7XG5cbiAgaWYgKG5tIDwgMC4wMDUyMzU5ODc3ICYmIG5tID4gMC4wMDM0OTA2NTg1KSB7XG4gICAgaXJleiA9IDE7XG4gIH1cblxuICBpZiAobm0gPj0gOC4yNmUtMyAmJiBubSA8PSA5LjI0ZS0zICYmIGVtID49IDAuNSkge1xuICAgIGlyZXogPSAyO1xuICB9IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkbyBzb2xhciB0ZXJtcyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICB2YXIgc2VzID0gc3MxICogem5zICogc3M1O1xuICB2YXIgc2lzID0gc3MyICogem5zICogKHN6MTEgKyBzejEzKTtcbiAgdmFyIHNscyA9IC16bnMgKiBzczMgKiAoc3oxICsgc3ozIC0gMTQuMCAtIDYuMCAqIGVtc3EpO1xuICB2YXIgc2docyA9IHNzNCAqIHpucyAqIChzejMxICsgc3ozMyAtIDYuMCk7XG4gIHZhciBzaHMgPSAtem5zICogc3MyICogKHN6MjEgKyBzejIzKTsgLy8gc2dwNGZpeCBmb3IgMTgwIGRlZyBpbmNsXG5cbiAgaWYgKGluY2xtIDwgNS4yMzU5ODc3ZS0yIHx8IGluY2xtID4gcGkgLSA1LjIzNTk4NzdlLTIpIHtcbiAgICBzaHMgPSAwLjA7XG4gIH1cblxuICBpZiAoc2luaW0gIT09IDAuMCkge1xuICAgIHNocyAvPSBzaW5pbTtcbiAgfVxuXG4gIHZhciBzZ3MgPSBzZ2hzIC0gY29zaW0gKiBzaHM7IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZG8gbHVuYXIgdGVybXMgLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZGVkdCA9IHNlcyArIHMxICogem5sICogczU7XG4gIGRpZHQgPSBzaXMgKyBzMiAqIHpubCAqICh6MTEgKyB6MTMpO1xuICBkbWR0ID0gc2xzIC0gem5sICogczMgKiAoejEgKyB6MyAtIDE0LjAgLSA2LjAgKiBlbXNxKTtcbiAgdmFyIHNnaGwgPSBzNCAqIHpubCAqICh6MzEgKyB6MzMgLSA2LjApO1xuICB2YXIgc2hsbCA9IC16bmwgKiBzMiAqICh6MjEgKyB6MjMpOyAvLyBzZ3A0Zml4IGZvciAxODAgZGVnIGluY2xcblxuICBpZiAoaW5jbG0gPCA1LjIzNTk4NzdlLTIgfHwgaW5jbG0gPiBwaSAtIDUuMjM1OTg3N2UtMikge1xuICAgIHNobGwgPSAwLjA7XG4gIH1cblxuICBkb21kdCA9IHNncyArIHNnaGw7XG4gIGRub2R0ID0gc2hzO1xuXG4gIGlmIChzaW5pbSAhPT0gMC4wKSB7XG4gICAgZG9tZHQgLT0gY29zaW0gLyBzaW5pbSAqIHNobGw7XG4gICAgZG5vZHQgKz0gc2hsbCAvIHNpbmltO1xuICB9IC8vIC0tLS0tLS0tLS0tIGNhbGN1bGF0ZSBkZWVwIHNwYWNlIHJlc29uYW5jZSBlZmZlY3RzIC0tLS0tLS0tXG5cblxuICB2YXIgZG5kdCA9IDAuMDtcbiAgdmFyIHRoZXRhID0gKGdzdG8gKyB0YyAqIHJwdGltKSAlIHR3b1BpO1xuICBlbSArPSBkZWR0ICogdDtcbiAgaW5jbG0gKz0gZGlkdCAqIHQ7XG4gIGFyZ3BtICs9IGRvbWR0ICogdDtcbiAgbm9kZW0gKz0gZG5vZHQgKiB0O1xuICBtbSArPSBkbWR0ICogdDsgLy8gc2dwNGZpeCBmb3IgbmVnYXRpdmUgaW5jbGluYXRpb25zXG4gIC8vIHRoZSBmb2xsb3dpbmcgaWYgc3RhdGVtZW50IHNob3VsZCBiZSBjb21tZW50ZWQgb3V0XG4gIC8vIGlmIChpbmNsbSA8IDAuMClcbiAgLy8ge1xuICAvLyAgIGluY2xtICA9IC1pbmNsbTtcbiAgLy8gICBhcmdwbSAgPSBhcmdwbSAtIHBpO1xuICAvLyAgIG5vZGVtID0gbm9kZW0gKyBwaTtcbiAgLy8gfVxuICAvLyAtLS0tLS0tLS0tLS0tLSBpbml0aWFsaXplIHRoZSByZXNvbmFuY2UgdGVybXMgLS0tLS0tLS0tLS0tLVxuXG4gIGlmIChpcmV6ICE9PSAwKSB7XG4gICAgYW9udiA9IE1hdGgucG93KG5tIC8geGtlLCB4Mm8zKTsgLy8gLS0tLS0tLS0tLSBnZW9wb3RlbnRpYWwgcmVzb25hbmNlIGZvciAxMiBob3VyIG9yYml0cyAtLS0tLS1cblxuICAgIGlmIChpcmV6ID09PSAyKSB7XG4gICAgICBjb3Npc3EgPSBjb3NpbSAqIGNvc2ltO1xuICAgICAgdmFyIGVtbyA9IGVtO1xuICAgICAgZW0gPSBlY2NvO1xuICAgICAgdmFyIGVtc3FvID0gZW1zcTtcbiAgICAgIGVtc3EgPSBlY2NzcTtcbiAgICAgIGVvYyA9IGVtICogZW1zcTtcbiAgICAgIGcyMDEgPSAtMC4zMDYgLSAoZW0gLSAwLjY0KSAqIDAuNDQwO1xuXG4gICAgICBpZiAoZW0gPD0gMC42NSkge1xuICAgICAgICBnMjExID0gMy42MTYgLSAxMy4yNDcwICogZW0gKyAxNi4yOTAwICogZW1zcTtcbiAgICAgICAgZzMxMCA9IC0xOS4zMDIgKyAxMTcuMzkwMCAqIGVtIC0gMjI4LjQxOTAgKiBlbXNxICsgMTU2LjU5MTAgKiBlb2M7XG4gICAgICAgIGczMjIgPSAtMTguOTA2OCArIDEwOS43OTI3ICogZW0gLSAyMTQuNjMzNCAqIGVtc3EgKyAxNDYuNTgxNiAqIGVvYztcbiAgICAgICAgZzQxMCA9IC00MS4xMjIgKyAyNDIuNjk0MCAqIGVtIC0gNDcxLjA5NDAgKiBlbXNxICsgMzEzLjk1MzAgKiBlb2M7XG4gICAgICAgIGc0MjIgPSAtMTQ2LjQwNyArIDg0MS44ODAwICogZW0gLSAxNjI5LjAxNCAqIGVtc3EgKyAxMDgzLjQzNTAgKiBlb2M7XG4gICAgICAgIGc1MjAgPSAtNTMyLjExNCArIDMwMTcuOTc3ICogZW0gLSA1NzQwLjAzMiAqIGVtc3EgKyAzNzA4LjI3NjAgKiBlb2M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnMjExID0gLTcyLjA5OSArIDMzMS44MTkgKiBlbSAtIDUwOC43MzggKiBlbXNxICsgMjY2LjcyNCAqIGVvYztcbiAgICAgICAgZzMxMCA9IC0zNDYuODQ0ICsgMTU4Mi44NTEgKiBlbSAtIDI0MTUuOTI1ICogZW1zcSArIDEyNDYuMTEzICogZW9jO1xuICAgICAgICBnMzIyID0gLTM0Mi41ODUgKyAxNTU0LjkwOCAqIGVtIC0gMjM2Ni44OTkgKiBlbXNxICsgMTIxNS45NzIgKiBlb2M7XG4gICAgICAgIGc0MTAgPSAtMTA1Mi43OTcgKyA0NzU4LjY4NiAqIGVtIC0gNzE5My45OTIgKiBlbXNxICsgMzY1MS45NTcgKiBlb2M7XG4gICAgICAgIGc0MjIgPSAtMzU4MS42OTAgKyAxNjE3OC4xMTAgKiBlbSAtIDI0NDYyLjc3MCAqIGVtc3EgKyAxMjQyMi41MjAgKiBlb2M7XG5cbiAgICAgICAgaWYgKGVtID4gMC43MTUpIHtcbiAgICAgICAgICBnNTIwID0gLTUxNDkuNjYgKyAyOTkzNi45MiAqIGVtIC0gNTQwODcuMzYgKiBlbXNxICsgMzEzMjQuNTYgKiBlb2M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZzUyMCA9IDE0NjQuNzQgLSA0NjY0Ljc1ICogZW0gKyAzNzYzLjY0ICogZW1zcTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZW0gPCAwLjcpIHtcbiAgICAgICAgZzUzMyA9IC05MTkuMjI3NzAgKyA0OTg4LjYxMDAgKiBlbSAtIDkwNjQuNzcwMCAqIGVtc3EgKyA1NTQyLjIxICogZW9jO1xuICAgICAgICBnNTIxID0gLTgyMi43MTA3MiArIDQ1NjguNjE3MyAqIGVtIC0gODQ5MS40MTQ2ICogZW1zcSArIDUzMzcuNTI0ICogZW9jO1xuICAgICAgICBnNTMyID0gLTg1My42NjYwMCArIDQ2OTAuMjUwMCAqIGVtIC0gODYyNC43NzAwICogZW1zcSArIDUzNDEuNCAqIGVvYztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGc1MzMgPSAtMzc5OTUuNzgwICsgMTYxNjE2LjUyICogZW0gLSAyMjk4MzguMjAgKiBlbXNxICsgMTA5Mzc3Ljk0ICogZW9jO1xuICAgICAgICBnNTIxID0gLTUxNzUyLjEwNCArIDIxODkxMy45NSAqIGVtIC0gMzA5NDY4LjE2ICogZW1zcSArIDE0NjM0OS40MiAqIGVvYztcbiAgICAgICAgZzUzMiA9IC00MDAyMy44ODAgKyAxNzA0NzAuODkgKiBlbSAtIDI0MjY5OS40OCAqIGVtc3EgKyAxMTU2MDUuODIgKiBlb2M7XG4gICAgICB9XG5cbiAgICAgIHNpbmkyID0gc2luaW0gKiBzaW5pbTtcbiAgICAgIGYyMjAgPSAwLjc1ICogKDEuMCArIDIuMCAqIGNvc2ltICsgY29zaXNxKTtcbiAgICAgIGYyMjEgPSAxLjUgKiBzaW5pMjtcbiAgICAgIGYzMjEgPSAxLjg3NSAqIHNpbmltICogKDEuMCAtIDIuMCAqIGNvc2ltIC0gMy4wICogY29zaXNxKTtcbiAgICAgIGYzMjIgPSAtMS44NzUgKiBzaW5pbSAqICgxLjAgKyAyLjAgKiBjb3NpbSAtIDMuMCAqIGNvc2lzcSk7XG4gICAgICBmNDQxID0gMzUuMCAqIHNpbmkyICogZjIyMDtcbiAgICAgIGY0NDIgPSAzOS4zNzUwICogc2luaTIgKiBzaW5pMjtcbiAgICAgIGY1MjIgPSA5Ljg0Mzc1ICogc2luaW0gKiAoc2luaTIgKiAoMS4wIC0gMi4wICogY29zaW0gLSA1LjAgKiBjb3Npc3EpICsgMC4zMzMzMzMzMyAqICgtMi4wICsgNC4wICogY29zaW0gKyA2LjAgKiBjb3Npc3EpKTtcbiAgICAgIGY1MjMgPSBzaW5pbSAqICg0LjkyMTg3NTEyICogc2luaTIgKiAoLTIuMCAtIDQuMCAqIGNvc2ltICsgMTAuMCAqIGNvc2lzcSkgKyA2LjU2MjUwMDEyICogKDEuMCArIDIuMCAqIGNvc2ltIC0gMy4wICogY29zaXNxKSk7XG4gICAgICBmNTQyID0gMjkuNTMxMjUgKiBzaW5pbSAqICgyLjAgLSA4LjAgKiBjb3NpbSArIGNvc2lzcSAqICgtMTIuMCArIDguMCAqIGNvc2ltICsgMTAuMCAqIGNvc2lzcSkpO1xuICAgICAgZjU0MyA9IDI5LjUzMTI1ICogc2luaW0gKiAoLTIuMCAtIDguMCAqIGNvc2ltICsgY29zaXNxICogKDEyLjAgKyA4LjAgKiBjb3NpbSAtIDEwLjAgKiBjb3Npc3EpKTtcbiAgICAgIHhubzIgPSBubSAqIG5tO1xuICAgICAgYWludjIgPSBhb252ICogYW9udjtcbiAgICAgIHRlbXAxID0gMy4wICogeG5vMiAqIGFpbnYyO1xuICAgICAgdGVtcCA9IHRlbXAxICogcm9vdDIyO1xuICAgICAgZDIyMDEgPSB0ZW1wICogZjIyMCAqIGcyMDE7XG4gICAgICBkMjIxMSA9IHRlbXAgKiBmMjIxICogZzIxMTtcbiAgICAgIHRlbXAxICo9IGFvbnY7XG4gICAgICB0ZW1wID0gdGVtcDEgKiByb290MzI7XG4gICAgICBkMzIxMCA9IHRlbXAgKiBmMzIxICogZzMxMDtcbiAgICAgIGQzMjIyID0gdGVtcCAqIGYzMjIgKiBnMzIyO1xuICAgICAgdGVtcDEgKj0gYW9udjtcbiAgICAgIHRlbXAgPSAyLjAgKiB0ZW1wMSAqIHJvb3Q0NDtcbiAgICAgIGQ0NDEwID0gdGVtcCAqIGY0NDEgKiBnNDEwO1xuICAgICAgZDQ0MjIgPSB0ZW1wICogZjQ0MiAqIGc0MjI7XG4gICAgICB0ZW1wMSAqPSBhb252O1xuICAgICAgdGVtcCA9IHRlbXAxICogcm9vdDUyO1xuICAgICAgZDUyMjAgPSB0ZW1wICogZjUyMiAqIGc1MjA7XG4gICAgICBkNTIzMiA9IHRlbXAgKiBmNTIzICogZzUzMjtcbiAgICAgIHRlbXAgPSAyLjAgKiB0ZW1wMSAqIHJvb3Q1NDtcbiAgICAgIGQ1NDIxID0gdGVtcCAqIGY1NDIgKiBnNTIxO1xuICAgICAgZDU0MzMgPSB0ZW1wICogZjU0MyAqIGc1MzM7XG4gICAgICB4bGFtbyA9IChtbyArIG5vZGVvICsgbm9kZW8gLSAodGhldGEgKyB0aGV0YSkpICUgdHdvUGk7XG4gICAgICB4ZmFjdCA9IG1kb3QgKyBkbWR0ICsgMi4wICogKG5vZGVkb3QgKyBkbm9kdCAtIHJwdGltKSAtIG5vO1xuICAgICAgZW0gPSBlbW87XG4gICAgICBlbXNxID0gZW1zcW87XG4gICAgfSAvLyAgLS0tLS0tLS0tLS0tLS0tLSBzeW5jaHJvbm91cyByZXNvbmFuY2UgdGVybXMgLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgaWYgKGlyZXogPT09IDEpIHtcbiAgICAgIGcyMDAgPSAxLjAgKyBlbXNxICogKC0yLjUgKyAwLjgxMjUgKiBlbXNxKTtcbiAgICAgIGczMTAgPSAxLjAgKyAyLjAgKiBlbXNxO1xuICAgICAgZzMwMCA9IDEuMCArIGVtc3EgKiAoLTYuMCArIDYuNjA5MzcgKiBlbXNxKTtcbiAgICAgIGYyMjAgPSAwLjc1ICogKDEuMCArIGNvc2ltKSAqICgxLjAgKyBjb3NpbSk7XG4gICAgICBmMzExID0gMC45Mzc1ICogc2luaW0gKiBzaW5pbSAqICgxLjAgKyAzLjAgKiBjb3NpbSkgLSAwLjc1ICogKDEuMCArIGNvc2ltKTtcbiAgICAgIGYzMzAgPSAxLjAgKyBjb3NpbTtcbiAgICAgIGYzMzAgKj0gMS44NzUgKiBmMzMwICogZjMzMDtcbiAgICAgIGRlbDEgPSAzLjAgKiBubSAqIG5tICogYW9udiAqIGFvbnY7XG4gICAgICBkZWwyID0gMi4wICogZGVsMSAqIGYyMjAgKiBnMjAwICogcTIyO1xuICAgICAgZGVsMyA9IDMuMCAqIGRlbDEgKiBmMzMwICogZzMwMCAqIHEzMyAqIGFvbnY7XG4gICAgICBkZWwxID0gZGVsMSAqIGYzMTEgKiBnMzEwICogcTMxICogYW9udjtcbiAgICAgIHhsYW1vID0gKG1vICsgbm9kZW8gKyBhcmdwbyAtIHRoZXRhKSAlIHR3b1BpO1xuICAgICAgeGZhY3QgPSBtZG90ICsgeHBpZG90ICsgZG1kdCArIGRvbWR0ICsgZG5vZHQgLSAobm8gKyBycHRpbSk7XG4gICAgfSAvLyAgLS0tLS0tLS0tLS0tIGZvciBzZ3A0LCBpbml0aWFsaXplIHRoZSBpbnRlZ3JhdG9yIC0tLS0tLS0tLS1cblxuXG4gICAgeGxpID0geGxhbW87XG4gICAgeG5pID0gbm87XG4gICAgYXRpbWUgPSAwLjA7XG4gICAgbm0gPSBubyArIGRuZHQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVtOiBlbSxcbiAgICBhcmdwbTogYXJncG0sXG4gICAgaW5jbG06IGluY2xtLFxuICAgIG1tOiBtbSxcbiAgICBubTogbm0sXG4gICAgbm9kZW06IG5vZGVtLFxuICAgIGlyZXo6IGlyZXosXG4gICAgYXRpbWU6IGF0aW1lLFxuICAgIGQyMjAxOiBkMjIwMSxcbiAgICBkMjIxMTogZDIyMTEsXG4gICAgZDMyMTA6IGQzMjEwLFxuICAgIGQzMjIyOiBkMzIyMixcbiAgICBkNDQxMDogZDQ0MTAsXG4gICAgZDQ0MjI6IGQ0NDIyLFxuICAgIGQ1MjIwOiBkNTIyMCxcbiAgICBkNTIzMjogZDUyMzIsXG4gICAgZDU0MjE6IGQ1NDIxLFxuICAgIGQ1NDMzOiBkNTQzMyxcbiAgICBkZWR0OiBkZWR0LFxuICAgIGRpZHQ6IGRpZHQsXG4gICAgZG1kdDogZG1kdCxcbiAgICBkbmR0OiBkbmR0LFxuICAgIGRub2R0OiBkbm9kdCxcbiAgICBkb21kdDogZG9tZHQsXG4gICAgZGVsMTogZGVsMSxcbiAgICBkZWwyOiBkZWwyLFxuICAgIGRlbDM6IGRlbDMsXG4gICAgeGZhY3Q6IHhmYWN0LFxuICAgIHhsYW1vOiB4bGFtbyxcbiAgICB4bGk6IHhsaSxcbiAgICB4bmk6IHhuaVxuICB9O1xufVxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdzdGltZVxuICpcbiAqICB0aGlzIGZ1bmN0aW9uIGZpbmRzIHRoZSBncmVlbndpY2ggc2lkZXJlYWwgdGltZS5cbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAgMSBtYXIgMjAwMVxuICpcbiAqICBpbnB1dHMgICAgICAgICAgZGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgIHJhbmdlIC8gdW5pdHNcbiAqICAgIGpkdXQxICAgICAgIC0ganVsaWFuIGRhdGUgaW4gdXQxICAgICAgICAgICAgIGRheXMgZnJvbSA0NzEzIGJjXG4gKlxuICogIG91dHB1dHMgICAgICAgOlxuICogICAgZ3N0aW1lICAgICAgLSBncmVlbndpY2ggc2lkZXJlYWwgdGltZSAgICAgICAgMCB0byAycGkgcmFkXG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgdGVtcCAgICAgICAgLSB0ZW1wb3JhcnkgdmFyaWFibGUgZm9yIGRvdWJsZXMgICByYWRcbiAqICAgIHR1dDEgICAgICAgIC0ganVsaWFuIGNlbnR1cmllcyBmcm9tIHRoZVxuICogICAgICAgICAgICAgICAgICBqYW4gMSwgMjAwMCAxMiBoIGVwb2NoICh1dDEpXG4gKlxuICogIGNvdXBsaW5nICAgICAgOlxuICogICAgbm9uZVxuICpcbiAqICByZWZlcmVuY2VzICAgIDpcbiAqICAgIHZhbGxhZG8gICAgICAgMjAwNCwgMTkxLCBlcSAzLTQ1XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXG5mdW5jdGlvbiBnc3RpbWVJbnRlcm5hbChqZHV0MSkge1xuICB2YXIgdHV0MSA9IChqZHV0MSAtIDI0NTE1NDUuMCkgLyAzNjUyNS4wO1xuICB2YXIgdGVtcCA9IC02LjJlLTYgKiB0dXQxICogdHV0MSAqIHR1dDEgKyAwLjA5MzEwNCAqIHR1dDEgKiB0dXQxICsgKDg3NjYwMC4wICogMzYwMCArIDg2NDAxODQuODEyODY2KSAqIHR1dDEgKyA2NzMxMC41NDg0MTsgLy8gIyBzZWNcblxuICB0ZW1wID0gdGVtcCAqIGRlZzJyYWQgLyAyNDAuMCAlIHR3b1BpOyAvLyAzNjAvODY0MDAgPSAxLzI0MCwgdG8gZGVnLCB0byByYWRcbiAgLy8gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBjaGVjayBxdWFkcmFudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgaWYgKHRlbXAgPCAwLjApIHtcbiAgICB0ZW1wICs9IHR3b1BpO1xuICB9XG5cbiAgcmV0dXJuIHRlbXA7XG59XG5cbmZ1bmN0aW9uIGdzdGltZSgpIHtcbiAgaWYgKChhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF0pIGluc3RhbmNlb2YgRGF0ZSB8fCBhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiBnc3RpbWVJbnRlcm5hbChqZGF5LmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKSk7XG4gIH1cblxuICByZXR1cm4gZ3N0aW1lSW50ZXJuYWwuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xufVxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VkdXJlIGluaXRsXG4gKlxuICogIHRoaXMgcHJvY2VkdXJlIGluaXRpYWxpemVzIHRoZSBzZ3A0IHByb3BhZ2F0b3IuIGFsbCB0aGUgaW5pdGlhbGl6YXRpb24gaXNcbiAqICAgIGNvbnNvbGlkYXRlZCBoZXJlIGluc3RlYWQgb2YgaGF2aW5nIG11bHRpcGxlIGxvb3BzIGluc2lkZSBvdGhlciByb3V0aW5lcy5cbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAyOCBqdW4gMjAwNVxuICpcbiAqICBpbnB1dHMgICAgICAgIDpcbiAqICAgIGVjY28gICAgICAgIC0gZWNjZW50cmljaXR5ICAgICAgICAgICAgICAgICAgICAgICAgICAgMC4wIC0gMS4wXG4gKiAgICBlcG9jaCAgICAgICAtIGVwb2NoIHRpbWUgaW4gZGF5cyBmcm9tIGphbiAwLCAxOTUwLiAwIGhyXG4gKiAgICBpbmNsbyAgICAgICAtIGluY2xpbmF0aW9uIG9mIHNhdGVsbGl0ZVxuICogICAgbm8gICAgICAgICAgLSBtZWFuIG1vdGlvbiBvZiBzYXRlbGxpdGVcbiAqICAgIHNhdG4gICAgICAgIC0gc2F0ZWxsaXRlIG51bWJlclxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIGFpbnYgICAgICAgIC0gMS4wIC8gYVxuICogICAgYW8gICAgICAgICAgLSBzZW1pIG1ham9yIGF4aXNcbiAqICAgIGNvbjQxICAgICAgIC1cbiAqICAgIGNvbjQyICAgICAgIC0gMS4wIC0gNS4wIGNvcyhpKVxuICogICAgY29zaW8gICAgICAgLSBjb3NpbmUgb2YgaW5jbGluYXRpb25cbiAqICAgIGNvc2lvMiAgICAgIC0gY29zaW8gc3F1YXJlZFxuICogICAgZWNjc3EgICAgICAgLSBlY2NlbnRyaWNpdHkgc3F1YXJlZFxuICogICAgbWV0aG9kICAgICAgLSBmbGFnIGZvciBkZWVwIHNwYWNlICAgICAgICAgICAgICAgICAgICAnZCcsICduJ1xuICogICAgb21lb3NxICAgICAgLSAxLjAgLSBlY2NvICogZWNjb1xuICogICAgcG9zcSAgICAgICAgLSBzZW1pLXBhcmFtZXRlciBzcXVhcmVkXG4gKiAgICBycCAgICAgICAgICAtIHJhZGl1cyBvZiBwZXJpZ2VlXG4gKiAgICBydGVvc3EgICAgICAtIHNxdWFyZSByb290IG9mICgxLjAgLSBlY2NvKmVjY28pXG4gKiAgICBzaW5pbyAgICAgICAtIHNpbmUgb2YgaW5jbGluYXRpb25cbiAqICAgIGdzdG8gICAgICAgIC0gZ3N0IGF0IHRpbWUgb2Ygb2JzZXJ2YXRpb24gICAgICAgICAgICAgICByYWRcbiAqICAgIG5vICAgICAgICAgIC0gbWVhbiBtb3Rpb24gb2Ygc2F0ZWxsaXRlXG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgYWsgICAgICAgICAgLVxuICogICAgZDEgICAgICAgICAgLVxuICogICAgZGVsICAgICAgICAgLVxuICogICAgYWRlbCAgICAgICAgLVxuICogICAgcG8gICAgICAgICAgLVxuICpcbiAqICBjb3VwbGluZyAgICAgIDpcbiAqICAgIGdldGdyYXZjb25zdFxuICogICAgZ3N0aW1lICAgICAgLSBmaW5kIGdyZWVud2ljaCBzaWRlcmVhbCB0aW1lIGZyb20gdGhlIGp1bGlhbiBkYXRlXG4gKlxuICogIHJlZmVyZW5jZXMgICAgOlxuICogICAgaG9vdHMsIHJvZWhyaWNoLCBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAjMyAxOTgwXG4gKiAgICBob290cywgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzYgMTk4NlxuICogICAgaG9vdHMsIHNjaHVtYWNoZXIgYW5kIGdsb3ZlciAyMDA0XG4gKiAgICB2YWxsYWRvLCBjcmF3Zm9yZCwgaHVqc2FrLCBrZWxzbyAgMjAwNlxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbmZ1bmN0aW9uIGluaXRsKG9wdGlvbnMpIHtcbiAgdmFyIGVjY28gPSBvcHRpb25zLmVjY28sXG4gICAgICBlcG9jaCA9IG9wdGlvbnMuZXBvY2gsXG4gICAgICBpbmNsbyA9IG9wdGlvbnMuaW5jbG8sXG4gICAgICBvcHNtb2RlID0gb3B0aW9ucy5vcHNtb2RlO1xuICB2YXIgbm8gPSBvcHRpb25zLm5vOyAvLyBzZ3A0Zml4IHVzZSBvbGQgd2F5IG9mIGZpbmRpbmcgZ3N0XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGVhcnRoIGNvbnN0YW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gc2dwNGZpeCBpZGVudGlmeSBjb25zdGFudHMgYW5kIGFsbG93IGFsdGVybmF0ZSB2YWx1ZXNcbiAgLy8gLS0tLS0tLS0tLS0tLSBjYWxjdWxhdGUgYXV4aWxsYXJ5IGVwb2NoIHF1YW50aXRpZXMgLS0tLS0tLS0tLVxuXG4gIHZhciBlY2NzcSA9IGVjY28gKiBlY2NvO1xuICB2YXIgb21lb3NxID0gMS4wIC0gZWNjc3E7XG4gIHZhciBydGVvc3EgPSBNYXRoLnNxcnQob21lb3NxKTtcbiAgdmFyIGNvc2lvID0gTWF0aC5jb3MoaW5jbG8pO1xuICB2YXIgY29zaW8yID0gY29zaW8gKiBjb3NpbzsgLy8gLS0tLS0tLS0tLS0tLS0tLS0tIHVuLWtvemFpIHRoZSBtZWFuIG1vdGlvbiAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBhayA9IE1hdGgucG93KHhrZSAvIG5vLCB4Mm8zKTtcbiAgdmFyIGQxID0gMC43NSAqIGoyICogKDMuMCAqIGNvc2lvMiAtIDEuMCkgLyAocnRlb3NxICogb21lb3NxKTtcbiAgdmFyIGRlbFByaW1lID0gZDEgLyAoYWsgKiBhayk7XG4gIHZhciBhZGVsID0gYWsgKiAoMS4wIC0gZGVsUHJpbWUgKiBkZWxQcmltZSAtIGRlbFByaW1lICogKDEuMCAvIDMuMCArIDEzNC4wICogZGVsUHJpbWUgKiBkZWxQcmltZSAvIDgxLjApKTtcbiAgZGVsUHJpbWUgPSBkMSAvIChhZGVsICogYWRlbCk7XG4gIG5vIC89IDEuMCArIGRlbFByaW1lO1xuICB2YXIgYW8gPSBNYXRoLnBvdyh4a2UgLyBubywgeDJvMyk7XG4gIHZhciBzaW5pbyA9IE1hdGguc2luKGluY2xvKTtcbiAgdmFyIHBvID0gYW8gKiBvbWVvc3E7XG4gIHZhciBjb240MiA9IDEuMCAtIDUuMCAqIGNvc2lvMjtcbiAgdmFyIGNvbjQxID0gLWNvbjQyIC0gY29zaW8yIC0gY29zaW8yO1xuICB2YXIgYWludiA9IDEuMCAvIGFvO1xuICB2YXIgcG9zcSA9IHBvICogcG87XG4gIHZhciBycCA9IGFvICogKDEuMCAtIGVjY28pO1xuICB2YXIgbWV0aG9kID0gJ24nOyAvLyAgc2dwNGZpeCBtb2Rlcm4gYXBwcm9hY2ggdG8gZmluZGluZyBzaWRlcmVhbCB0aW1lXG5cbiAgdmFyIGdzdG87XG5cbiAgaWYgKG9wc21vZGUgPT09ICdhJykge1xuICAgIC8vICBzZ3A0Zml4IHVzZSBvbGQgd2F5IG9mIGZpbmRpbmcgZ3N0XG4gICAgLy8gIGNvdW50IGludGVnZXIgbnVtYmVyIG9mIGRheXMgZnJvbSAwIGphbiAxOTcwXG4gICAgdmFyIHRzNzAgPSBlcG9jaCAtIDczMDUuMDtcbiAgICB2YXIgZHM3MCA9IE1hdGguZmxvb3IodHM3MCArIDEuMGUtOCk7XG4gICAgdmFyIHRmcmFjID0gdHM3MCAtIGRzNzA7IC8vICBmaW5kIGdyZWVud2ljaCBsb2NhdGlvbiBhdCBlcG9jaFxuXG4gICAgdmFyIGMxID0gMS43MjAyNzkxNjk0MDcwMzYzOWUtMjtcbiAgICB2YXIgdGhncjcwID0gMS43MzIxMzQzODU2NTA5Mzc0O1xuICAgIHZhciBmazVyID0gNS4wNzU1MTQxOTQzMjI2OTQ0MmUtMTU7XG4gICAgdmFyIGMxcDJwID0gYzEgKyB0d29QaTtcbiAgICBnc3RvID0gKHRoZ3I3MCArIGMxICogZHM3MCArIGMxcDJwICogdGZyYWMgKyB0czcwICogdHM3MCAqIGZrNXIpICUgdHdvUGk7XG5cbiAgICBpZiAoZ3N0byA8IDAuMCkge1xuICAgICAgZ3N0byArPSB0d29QaTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZ3N0byA9IGdzdGltZShlcG9jaCArIDI0MzMyODEuNSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5vOiBubyxcbiAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICBhaW52OiBhaW52LFxuICAgIGFvOiBhbyxcbiAgICBjb240MTogY29uNDEsXG4gICAgY29uNDI6IGNvbjQyLFxuICAgIGNvc2lvOiBjb3NpbyxcbiAgICBjb3NpbzI6IGNvc2lvMixcbiAgICBlY2NzcTogZWNjc3EsXG4gICAgb21lb3NxOiBvbWVvc3EsXG4gICAgcG9zcTogcG9zcSxcbiAgICBycDogcnAsXG4gICAgcnRlb3NxOiBydGVvc3EsXG4gICAgc2luaW86IHNpbmlvLFxuICAgIGdzdG86IGdzdG9cbiAgfTtcbn1cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZHVyZSBkc3BhY2VcbiAqXG4gKiAgdGhpcyBwcm9jZWR1cmUgcHJvdmlkZXMgZGVlcCBzcGFjZSBjb250cmlidXRpb25zIHRvIG1lYW4gZWxlbWVudHMgZm9yXG4gKiAgICBwZXJ0dXJiaW5nIHRoaXJkIGJvZHkuICB0aGVzZSBlZmZlY3RzIGhhdmUgYmVlbiBhdmVyYWdlZCBvdmVyIG9uZVxuICogICAgcmV2b2x1dGlvbiBvZiB0aGUgc3VuIGFuZCBtb29uLiAgZm9yIGVhcnRoIHJlc29uYW5jZSBlZmZlY3RzLCB0aGVcbiAqICAgIGVmZmVjdHMgaGF2ZSBiZWVuIGF2ZXJhZ2VkIG92ZXIgbm8gcmV2b2x1dGlvbnMgb2YgdGhlIHNhdGVsbGl0ZS5cbiAqICAgIChtZWFuIG1vdGlvbilcbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAyOCBqdW4gMjAwNVxuICpcbiAqICBpbnB1dHMgICAgICAgIDpcbiAqICAgIGQyMjAxLCBkMjIxMSwgZDMyMTAsIGQzMjIyLCBkNDQxMCwgZDQ0MjIsIGQ1MjIwLCBkNTIzMiwgZDU0MjEsIGQ1NDMzIC1cbiAqICAgIGRlZHQgICAgICAgIC1cbiAqICAgIGRlbDEsIGRlbDIsIGRlbDMgIC1cbiAqICAgIGRpZHQgICAgICAgIC1cbiAqICAgIGRtZHQgICAgICAgIC1cbiAqICAgIGRub2R0ICAgICAgIC1cbiAqICAgIGRvbWR0ICAgICAgIC1cbiAqICAgIGlyZXogICAgICAgIC0gZmxhZyBmb3IgcmVzb25hbmNlICAgICAgICAgICAwLW5vbmUsIDEtb25lIGRheSwgMi1oYWxmIGRheVxuICogICAgYXJncG8gICAgICAgLSBhcmd1bWVudCBvZiBwZXJpZ2VlXG4gKiAgICBhcmdwZG90ICAgICAtIGFyZ3VtZW50IG9mIHBlcmlnZWUgZG90IChyYXRlKVxuICogICAgdCAgICAgICAgICAgLSB0aW1lXG4gKiAgICB0YyAgICAgICAgICAtXG4gKiAgICBnc3RvICAgICAgICAtIGdzdFxuICogICAgeGZhY3QgICAgICAgLVxuICogICAgeGxhbW8gICAgICAgLVxuICogICAgbm8gICAgICAgICAgLSBtZWFuIG1vdGlvblxuICogICAgYXRpbWUgICAgICAgLVxuICogICAgZW0gICAgICAgICAgLSBlY2NlbnRyaWNpdHlcbiAqICAgIGZ0ICAgICAgICAgIC1cbiAqICAgIGFyZ3BtICAgICAgIC0gYXJndW1lbnQgb2YgcGVyaWdlZVxuICogICAgaW5jbG0gICAgICAgLSBpbmNsaW5hdGlvblxuICogICAgeGxpICAgICAgICAgLVxuICogICAgbW0gICAgICAgICAgLSBtZWFuIGFub21hbHlcbiAqICAgIHhuaSAgICAgICAgIC0gbWVhbiBtb3Rpb25cbiAqICAgIG5vZGVtICAgICAgIC0gcmlnaHQgYXNjZW5zaW9uIG9mIGFzY2VuZGluZyBub2RlXG4gKlxuICogIG91dHB1dHMgICAgICAgOlxuICogICAgYXRpbWUgICAgICAgLVxuICogICAgZW0gICAgICAgICAgLSBlY2NlbnRyaWNpdHlcbiAqICAgIGFyZ3BtICAgICAgIC0gYXJndW1lbnQgb2YgcGVyaWdlZVxuICogICAgaW5jbG0gICAgICAgLSBpbmNsaW5hdGlvblxuICogICAgeGxpICAgICAgICAgLVxuICogICAgbW0gICAgICAgICAgLSBtZWFuIGFub21hbHlcbiAqICAgIHhuaSAgICAgICAgIC1cbiAqICAgIG5vZGVtICAgICAgIC0gcmlnaHQgYXNjZW5zaW9uIG9mIGFzY2VuZGluZyBub2RlXG4gKiAgICBkbmR0ICAgICAgICAtXG4gKiAgICBubSAgICAgICAgICAtIG1lYW4gbW90aW9uXG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgZGVsdCAgICAgICAgLVxuICogICAgZnQgICAgICAgICAgLVxuICogICAgdGhldGEgICAgICAgLVxuICogICAgeDJsaSAgICAgICAgLVxuICogICAgeDJvbWkgICAgICAgLVxuICogICAgeGwgICAgICAgICAgLVxuICogICAgeGxkb3QgICAgICAgLVxuICogICAgeG5kZHQgICAgICAgLVxuICogICAgeG5kdCAgICAgICAgLVxuICogICAgeG9taSAgICAgICAgLVxuICpcbiAqICBjb3VwbGluZyAgICAgIDpcbiAqICAgIG5vbmUgICAgICAgIC1cbiAqXG4gKiAgcmVmZXJlbmNlcyAgICA6XG4gKiAgICBob290cywgcm9laHJpY2gsIG5vcmFkIHNwYWNldHJhY2sgcmVwb3J0ICMzIDE5ODBcbiAqICAgIGhvb3RzLCBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAjNiAxOTg2XG4gKiAgICBob290cywgc2NodW1hY2hlciBhbmQgZ2xvdmVyIDIwMDRcbiAqICAgIHZhbGxhZG8sIGNyYXdmb3JkLCBodWpzYWssIGtlbHNvICAyMDA2XG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuZnVuY3Rpb24gZHNwYWNlKG9wdGlvbnMpIHtcbiAgdmFyIGlyZXogPSBvcHRpb25zLmlyZXosXG4gICAgICBkMjIwMSA9IG9wdGlvbnMuZDIyMDEsXG4gICAgICBkMjIxMSA9IG9wdGlvbnMuZDIyMTEsXG4gICAgICBkMzIxMCA9IG9wdGlvbnMuZDMyMTAsXG4gICAgICBkMzIyMiA9IG9wdGlvbnMuZDMyMjIsXG4gICAgICBkNDQxMCA9IG9wdGlvbnMuZDQ0MTAsXG4gICAgICBkNDQyMiA9IG9wdGlvbnMuZDQ0MjIsXG4gICAgICBkNTIyMCA9IG9wdGlvbnMuZDUyMjAsXG4gICAgICBkNTIzMiA9IG9wdGlvbnMuZDUyMzIsXG4gICAgICBkNTQyMSA9IG9wdGlvbnMuZDU0MjEsXG4gICAgICBkNTQzMyA9IG9wdGlvbnMuZDU0MzMsXG4gICAgICBkZWR0ID0gb3B0aW9ucy5kZWR0LFxuICAgICAgZGVsMSA9IG9wdGlvbnMuZGVsMSxcbiAgICAgIGRlbDIgPSBvcHRpb25zLmRlbDIsXG4gICAgICBkZWwzID0gb3B0aW9ucy5kZWwzLFxuICAgICAgZGlkdCA9IG9wdGlvbnMuZGlkdCxcbiAgICAgIGRtZHQgPSBvcHRpb25zLmRtZHQsXG4gICAgICBkbm9kdCA9IG9wdGlvbnMuZG5vZHQsXG4gICAgICBkb21kdCA9IG9wdGlvbnMuZG9tZHQsXG4gICAgICBhcmdwbyA9IG9wdGlvbnMuYXJncG8sXG4gICAgICBhcmdwZG90ID0gb3B0aW9ucy5hcmdwZG90LFxuICAgICAgdCA9IG9wdGlvbnMudCxcbiAgICAgIHRjID0gb3B0aW9ucy50YyxcbiAgICAgIGdzdG8gPSBvcHRpb25zLmdzdG8sXG4gICAgICB4ZmFjdCA9IG9wdGlvbnMueGZhY3QsXG4gICAgICB4bGFtbyA9IG9wdGlvbnMueGxhbW8sXG4gICAgICBubyA9IG9wdGlvbnMubm87XG4gIHZhciBhdGltZSA9IG9wdGlvbnMuYXRpbWUsXG4gICAgICBlbSA9IG9wdGlvbnMuZW0sXG4gICAgICBhcmdwbSA9IG9wdGlvbnMuYXJncG0sXG4gICAgICBpbmNsbSA9IG9wdGlvbnMuaW5jbG0sXG4gICAgICB4bGkgPSBvcHRpb25zLnhsaSxcbiAgICAgIG1tID0gb3B0aW9ucy5tbSxcbiAgICAgIHhuaSA9IG9wdGlvbnMueG5pLFxuICAgICAgbm9kZW0gPSBvcHRpb25zLm5vZGVtLFxuICAgICAgbm0gPSBvcHRpb25zLm5tO1xuICB2YXIgZmFzeDIgPSAwLjEzMTMwOTA4O1xuICB2YXIgZmFzeDQgPSAyLjg4NDMxOTg7XG4gIHZhciBmYXN4NiA9IDAuMzc0NDgwODc7XG4gIHZhciBnMjIgPSA1Ljc2ODYzOTY7XG4gIHZhciBnMzIgPSAwLjk1MjQwODk4O1xuICB2YXIgZzQ0ID0gMS44MDE0OTk4O1xuICB2YXIgZzUyID0gMS4wNTA4MzMwO1xuICB2YXIgZzU0ID0gNC40MTA4ODk4O1xuICB2YXIgcnB0aW0gPSA0LjM3NTI2OTA4ODAxMTI5OTY2ZS0zOyAvLyBlcXVhdGVzIHRvIDcuMjkyMTE1MTQ2Njg4NTVlLTUgcmFkL3NlY1xuXG4gIHZhciBzdGVwcCA9IDcyMC4wO1xuICB2YXIgc3RlcG4gPSAtNzIwLjA7XG4gIHZhciBzdGVwMiA9IDI1OTIwMC4wO1xuICB2YXIgZGVsdDtcbiAgdmFyIHgybGk7XG4gIHZhciB4Mm9taTtcbiAgdmFyIHhsO1xuICB2YXIgeGxkb3Q7XG4gIHZhciB4bmRkdDtcbiAgdmFyIHhuZHQ7XG4gIHZhciB4b21pO1xuICB2YXIgZG5kdCA9IDAuMDtcbiAgdmFyIGZ0ID0gMC4wOyAvLyAgLS0tLS0tLS0tLS0gY2FsY3VsYXRlIGRlZXAgc3BhY2UgcmVzb25hbmNlIGVmZmVjdHMgLS0tLS0tLS0tLS1cblxuICB2YXIgdGhldGEgPSAoZ3N0byArIHRjICogcnB0aW0pICUgdHdvUGk7XG4gIGVtICs9IGRlZHQgKiB0O1xuICBpbmNsbSArPSBkaWR0ICogdDtcbiAgYXJncG0gKz0gZG9tZHQgKiB0O1xuICBub2RlbSArPSBkbm9kdCAqIHQ7XG4gIG1tICs9IGRtZHQgKiB0OyAvLyBzZ3A0Zml4IGZvciBuZWdhdGl2ZSBpbmNsaW5hdGlvbnNcbiAgLy8gdGhlIGZvbGxvd2luZyBpZiBzdGF0ZW1lbnQgc2hvdWxkIGJlIGNvbW1lbnRlZCBvdXRcbiAgLy8gaWYgKGluY2xtIDwgMC4wKVxuICAvLyB7XG4gIC8vICAgaW5jbG0gPSAtaW5jbG07XG4gIC8vICAgYXJncG0gPSBhcmdwbSAtIHBpO1xuICAvLyAgIG5vZGVtID0gbm9kZW0gKyBwaTtcbiAgLy8gfVxuXG4gIC8qIC0gdXBkYXRlIHJlc29uYW5jZXMgOiBudW1lcmljYWwgKGV1bGVyLW1hY2xhdXJpbikgaW50ZWdyYXRpb24gLSAqL1xuXG4gIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZXBvY2ggcmVzdGFydCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tICAqL1xuICAvLyAgIHNncDRmaXggZm9yIHByb3BhZ2F0b3IgcHJvYmxlbXNcbiAgLy8gICB0aGUgZm9sbG93aW5nIGludGVncmF0aW9uIHdvcmtzIGZvciBuZWdhdGl2ZSB0aW1lIHN0ZXBzIGFuZCBwZXJpb2RzXG4gIC8vICAgdGhlIHNwZWNpZmljIGNoYW5nZXMgYXJlIHVua25vd24gYmVjYXVzZSB0aGUgb3JpZ2luYWwgY29kZSB3YXMgc28gY29udm9sdXRlZFxuICAvLyBzZ3A0Zml4IHRha2Ugb3V0IGF0aW1lID0gMC4wIGFuZCBmaXggZm9yIGZhc3RlciBvcGVyYXRpb25cblxuICBpZiAoaXJleiAhPT0gMCkge1xuICAgIC8vICBzZ3A0Zml4IHN0cmVhbWxpbmUgY2hlY2tcbiAgICBpZiAoYXRpbWUgPT09IDAuMCB8fCB0ICogYXRpbWUgPD0gMC4wIHx8IE1hdGguYWJzKHQpIDwgTWF0aC5hYnMoYXRpbWUpKSB7XG4gICAgICBhdGltZSA9IDAuMDtcbiAgICAgIHhuaSA9IG5vO1xuICAgICAgeGxpID0geGxhbW87XG4gICAgfSAvLyBzZ3A0Zml4IG1vdmUgY2hlY2sgb3V0c2lkZSBsb29wXG5cblxuICAgIGlmICh0ID4gMC4wKSB7XG4gICAgICBkZWx0ID0gc3RlcHA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbHQgPSBzdGVwbjtcbiAgICB9XG5cbiAgICB2YXIgaXJldG4gPSAzODE7IC8vIGFkZGVkIGZvciBkbyBsb29wXG5cbiAgICB3aGlsZSAoaXJldG4gPT09IDM4MSkge1xuICAgICAgLy8gIC0tLS0tLS0tLS0tLS0tLS0tLS0gZG90IHRlcm1zIGNhbGN1bGF0ZWQgLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gIC0tLS0tLS0tLS0tIG5lYXIgLSBzeW5jaHJvbm91cyByZXNvbmFuY2UgdGVybXMgLS0tLS0tLVxuICAgICAgaWYgKGlyZXogIT09IDIpIHtcbiAgICAgICAgeG5kdCA9IGRlbDEgKiBNYXRoLnNpbih4bGkgLSBmYXN4MikgKyBkZWwyICogTWF0aC5zaW4oMi4wICogKHhsaSAtIGZhc3g0KSkgKyBkZWwzICogTWF0aC5zaW4oMy4wICogKHhsaSAtIGZhc3g2KSk7XG4gICAgICAgIHhsZG90ID0geG5pICsgeGZhY3Q7XG4gICAgICAgIHhuZGR0ID0gZGVsMSAqIE1hdGguY29zKHhsaSAtIGZhc3gyKSArIDIuMCAqIGRlbDIgKiBNYXRoLmNvcygyLjAgKiAoeGxpIC0gZmFzeDQpKSArIDMuMCAqIGRlbDMgKiBNYXRoLmNvcygzLjAgKiAoeGxpIC0gZmFzeDYpKTtcbiAgICAgICAgeG5kZHQgKj0geGxkb3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAtLS0tLS0tLS0gbmVhciAtIGhhbGYtZGF5IHJlc29uYW5jZSB0ZXJtcyAtLS0tLS0tLVxuICAgICAgICB4b21pID0gYXJncG8gKyBhcmdwZG90ICogYXRpbWU7XG4gICAgICAgIHgyb21pID0geG9taSArIHhvbWk7XG4gICAgICAgIHgybGkgPSB4bGkgKyB4bGk7XG4gICAgICAgIHhuZHQgPSBkMjIwMSAqIE1hdGguc2luKHgyb21pICsgeGxpIC0gZzIyKSArIGQyMjExICogTWF0aC5zaW4oeGxpIC0gZzIyKSArIGQzMjEwICogTWF0aC5zaW4oeG9taSArIHhsaSAtIGczMikgKyBkMzIyMiAqIE1hdGguc2luKC14b21pICsgeGxpIC0gZzMyKSArIGQ0NDEwICogTWF0aC5zaW4oeDJvbWkgKyB4MmxpIC0gZzQ0KSArIGQ0NDIyICogTWF0aC5zaW4oeDJsaSAtIGc0NCkgKyBkNTIyMCAqIE1hdGguc2luKHhvbWkgKyB4bGkgLSBnNTIpICsgZDUyMzIgKiBNYXRoLnNpbigteG9taSArIHhsaSAtIGc1MikgKyBkNTQyMSAqIE1hdGguc2luKHhvbWkgKyB4MmxpIC0gZzU0KSArIGQ1NDMzICogTWF0aC5zaW4oLXhvbWkgKyB4MmxpIC0gZzU0KTtcbiAgICAgICAgeGxkb3QgPSB4bmkgKyB4ZmFjdDtcbiAgICAgICAgeG5kZHQgPSBkMjIwMSAqIE1hdGguY29zKHgyb21pICsgeGxpIC0gZzIyKSArIGQyMjExICogTWF0aC5jb3MoeGxpIC0gZzIyKSArIGQzMjEwICogTWF0aC5jb3MoeG9taSArIHhsaSAtIGczMikgKyBkMzIyMiAqIE1hdGguY29zKC14b21pICsgeGxpIC0gZzMyKSArIGQ1MjIwICogTWF0aC5jb3MoeG9taSArIHhsaSAtIGc1MikgKyBkNTIzMiAqIE1hdGguY29zKC14b21pICsgeGxpIC0gZzUyKSArIDIuMCAqIGQ0NDEwICogTWF0aC5jb3MoeDJvbWkgKyB4MmxpIC0gZzQ0KSArIGQ0NDIyICogTWF0aC5jb3MoeDJsaSAtIGc0NCkgKyBkNTQyMSAqIE1hdGguY29zKHhvbWkgKyB4MmxpIC0gZzU0KSArIGQ1NDMzICogTWF0aC5jb3MoLXhvbWkgKyB4MmxpIC0gZzU0KTtcbiAgICAgICAgeG5kZHQgKj0geGxkb3Q7XG4gICAgICB9IC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBpbnRlZ3JhdG9yIC0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vICBzZ3A0Zml4IG1vdmUgZW5kIGNoZWNrcyB0byBlbmQgb2Ygcm91dGluZVxuXG5cbiAgICAgIGlmIChNYXRoLmFicyh0IC0gYXRpbWUpID49IHN0ZXBwKSB7XG4gICAgICAgIGlyZXRuID0gMzgxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnQgPSB0IC0gYXRpbWU7XG4gICAgICAgIGlyZXRuID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKGlyZXRuID09PSAzODEpIHtcbiAgICAgICAgeGxpICs9IHhsZG90ICogZGVsdCArIHhuZHQgKiBzdGVwMjtcbiAgICAgICAgeG5pICs9IHhuZHQgKiBkZWx0ICsgeG5kZHQgKiBzdGVwMjtcbiAgICAgICAgYXRpbWUgKz0gZGVsdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBubSA9IHhuaSArIHhuZHQgKiBmdCArIHhuZGR0ICogZnQgKiBmdCAqIDAuNTtcbiAgICB4bCA9IHhsaSArIHhsZG90ICogZnQgKyB4bmR0ICogZnQgKiBmdCAqIDAuNTtcblxuICAgIGlmIChpcmV6ICE9PSAxKSB7XG4gICAgICBtbSA9IHhsIC0gMi4wICogbm9kZW0gKyAyLjAgKiB0aGV0YTtcbiAgICAgIGRuZHQgPSBubSAtIG5vO1xuICAgIH0gZWxzZSB7XG4gICAgICBtbSA9IHhsIC0gbm9kZW0gLSBhcmdwbSArIHRoZXRhO1xuICAgICAgZG5kdCA9IG5tIC0gbm87XG4gICAgfVxuXG4gICAgbm0gPSBubyArIGRuZHQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGF0aW1lOiBhdGltZSxcbiAgICBlbTogZW0sXG4gICAgYXJncG06IGFyZ3BtLFxuICAgIGluY2xtOiBpbmNsbSxcbiAgICB4bGk6IHhsaSxcbiAgICBtbTogbW0sXG4gICAgeG5pOiB4bmksXG4gICAgbm9kZW06IG5vZGVtLFxuICAgIGRuZHQ6IGRuZHQsXG4gICAgbm06IG5tXG4gIH07XG59XG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VkdXJlIHNncDRcbiAqXG4gKiAgdGhpcyBwcm9jZWR1cmUgaXMgdGhlIHNncDQgcHJlZGljdGlvbiBtb2RlbCBmcm9tIHNwYWNlIGNvbW1hbmQuIHRoaXMgaXMgYW5cbiAqICAgIHVwZGF0ZWQgYW5kIGNvbWJpbmVkIHZlcnNpb24gb2Ygc2dwNCBhbmQgc2RwNCwgd2hpY2ggd2VyZSBvcmlnaW5hbGx5XG4gKiAgICBwdWJsaXNoZWQgc2VwYXJhdGVseSBpbiBzcGFjZXRyYWNrIHJlcG9ydCAvLzMuIHRoaXMgdmVyc2lvbiBmb2xsb3dzIHRoZVxuICogICAgbWV0aG9kb2xvZ3kgZnJvbSB0aGUgYWlhYSBwYXBlciAoMjAwNikgZGVzY3JpYmluZyB0aGUgaGlzdG9yeSBhbmRcbiAqICAgIGRldmVsb3BtZW50IG9mIHRoZSBjb2RlLlxuICpcbiAqICBhdXRob3IgICAgICAgIDogZGF2aWQgdmFsbGFkbyAgICAgICAgICAgICAgICAgIDcxOS01NzMtMjYwMCAgIDI4IGp1biAyMDA1XG4gKlxuICogIGlucHV0cyAgICAgICAgOlxuICogICAgc2F0cmVjICAtIGluaXRpYWxpc2VkIHN0cnVjdHVyZSBmcm9tIHNncDRpbml0KCkgY2FsbC5cbiAqICAgIHRzaW5jZSAgLSB0aW1lIHNpbmNlIGVwb2NoIChtaW51dGVzKVxuICpcbiAqICBvdXRwdXRzICAgICAgIDpcbiAqICAgIHIgICAgICAgICAgIC0gcG9zaXRpb24gdmVjdG9yICAgICAgICAgICAgICAgICAgICAga21cbiAqICAgIHYgICAgICAgICAgIC0gdmVsb2NpdHkgICAgICAgICAgICAgICAgICAgICAgICAgICAga20vc2VjXG4gKiAgcmV0dXJuIGNvZGUgLSBub24temVybyBvbiBlcnJvci5cbiAqICAgICAgICAgICAgICAgICAgIDEgLSBtZWFuIGVsZW1lbnRzLCBlY2MgPj0gMS4wIG9yIGVjYyA8IC0wLjAwMSBvciBhIDwgMC45NSBlclxuICogICAgICAgICAgICAgICAgICAgMiAtIG1lYW4gbW90aW9uIGxlc3MgdGhhbiAwLjBcbiAqICAgICAgICAgICAgICAgICAgIDMgLSBwZXJ0IGVsZW1lbnRzLCBlY2MgPCAwLjAgIG9yICBlY2MgPiAxLjBcbiAqICAgICAgICAgICAgICAgICAgIDQgLSBzZW1pLWxhdHVzIHJlY3R1bSA8IDAuMFxuICogICAgICAgICAgICAgICAgICAgNSAtIGVwb2NoIGVsZW1lbnRzIGFyZSBzdWItb3JiaXRhbFxuICogICAgICAgICAgICAgICAgICAgNiAtIHNhdGVsbGl0ZSBoYXMgZGVjYXllZFxuICpcbiAqICBsb2NhbHMgICAgICAgIDpcbiAqICAgIGFtICAgICAgICAgIC1cbiAqICAgIGF4bmwsIGF5bmwgICAgICAgIC1cbiAqICAgIGJldGFsICAgICAgIC1cbiAqICAgIGNvc2ltICAgLCBzaW5pbSAgICwgY29zb21tICAsIHNpbm9tbSAgLCBjbm9kICAgICwgc25vZCAgICAsIGNvczJ1ICAgLFxuICogICAgc2luMnUgICAsIGNvc2VvMSAgLCBzaW5lbzEgICwgY29zaSAgICAsIHNpbmkgICAgLCBjb3NpcCAgICwgc2luaXAgICAsXG4gKiAgICBjb3Npc3EgICwgY29zc3UgICAsIHNpbnN1ICAgLCBjb3N1ICAgICwgc2ludVxuICogICAgZGVsbSAgICAgICAgLVxuICogICAgZGVsb21nICAgICAgLVxuICogICAgZG5kdCAgICAgICAgLVxuICogICAgZWNjbSAgICAgICAgLVxuICogICAgZW1zcSAgICAgICAgLVxuICogICAgZWNvc2UgICAgICAgLVxuICogICAgZWwyICAgICAgICAgLVxuICogICAgZW8xICAgICAgICAgLVxuICogICAgZWNjcCAgICAgICAgLVxuICogICAgZXNpbmUgICAgICAgLVxuICogICAgYXJncG0gICAgICAgLVxuICogICAgYXJncHAgICAgICAgLVxuICogICAgb21nYWRmICAgICAgLVxuICogICAgcGwgICAgICAgICAgLVxuICogICAgciAgICAgICAgICAgLVxuICogICAgcnRlbXNxICAgICAgLVxuICogICAgcmRvdGwgICAgICAgLVxuICogICAgcmwgICAgICAgICAgLVxuICogICAgcnZkb3QgICAgICAgLVxuICogICAgcnZkb3RsICAgICAgLVxuICogICAgc3UgICAgICAgICAgLVxuICogICAgdDIgICwgdDMgICAsIHQ0ICAgICwgdGNcbiAqICAgIHRlbTUsIHRlbXAgLCB0ZW1wMSAsIHRlbXAyICAsIHRlbXBhICAsIHRlbXBlICAsIHRlbXBsXG4gKiAgICB1ICAgLCB1eCAgICwgdXkgICAgLCB1eiAgICAgLCB2eCAgICAgLCB2eSAgICAgLCB2elxuICogICAgaW5jbG0gICAgICAgLSBpbmNsaW5hdGlvblxuICogICAgbW0gICAgICAgICAgLSBtZWFuIGFub21hbHlcbiAqICAgIG5tICAgICAgICAgIC0gbWVhbiBtb3Rpb25cbiAqICAgIG5vZGVtICAgICAgIC0gcmlnaHQgYXNjIG9mIGFzY2VuZGluZyBub2RlXG4gKiAgICB4aW5jICAgICAgICAtXG4gKiAgICB4aW5jcCAgICAgICAtXG4gKiAgICB4bCAgICAgICAgICAtXG4gKiAgICB4bG0gICAgICAgICAtXG4gKiAgICBtcCAgICAgICAgICAtXG4gKiAgICB4bWRmICAgICAgICAtXG4gKiAgICB4bXggICAgICAgICAtXG4gKiAgICB4bXkgICAgICAgICAtXG4gKiAgICBub2RlZGYgICAgICAtXG4gKiAgICB4bm9kZSAgICAgICAtXG4gKiAgICBub2RlcCAgICAgICAtXG4gKiAgICBucCAgICAgICAgICAtXG4gKlxuICogIGNvdXBsaW5nICAgICAgOlxuICogICAgZ2V0Z3JhdmNvbnN0LVxuICogICAgZHBwZXJcbiAqICAgIGRzcGFjZVxuICpcbiAqICByZWZlcmVuY2VzICAgIDpcbiAqICAgIGhvb3RzLCByb2VocmljaCwgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgLy8zIDE5ODBcbiAqICAgIGhvb3RzLCBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAvLzYgMTk4NlxuICogICAgaG9vdHMsIHNjaHVtYWNoZXIgYW5kIGdsb3ZlciAyMDA0XG4gKiAgICB2YWxsYWRvLCBjcmF3Zm9yZCwgaHVqc2FrLCBrZWxzbyAgMjAwNlxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbmZ1bmN0aW9uIHNncDQoc2F0cmVjLCB0c2luY2UpIHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbiAgdmFyIGNvc2VvMTtcbiAgdmFyIHNpbmVvMTtcbiAgdmFyIGNvc2lwO1xuICB2YXIgc2luaXA7XG4gIHZhciBjb3Npc3E7XG4gIHZhciBkZWxtO1xuICB2YXIgZGVsb21nO1xuICB2YXIgZW8xO1xuICB2YXIgYXJncG07XG4gIHZhciBhcmdwcDtcbiAgdmFyIHN1O1xuICB2YXIgdDM7XG4gIHZhciB0NDtcbiAgdmFyIHRjO1xuICB2YXIgdGVtNTtcbiAgdmFyIHRlbXA7XG4gIHZhciB0ZW1wYTtcbiAgdmFyIHRlbXBlO1xuICB2YXIgdGVtcGw7XG4gIHZhciBpbmNsbTtcbiAgdmFyIG1tO1xuICB2YXIgbm07XG4gIHZhciBub2RlbTtcbiAgdmFyIHhpbmNwO1xuICB2YXIgeGxtO1xuICB2YXIgbXA7XG4gIHZhciBub2RlcDtcbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tIHNldCBtYXRoZW1hdGljYWwgY29uc3RhbnRzIC0tLS0tLS0tLS0tLS0tLSAqL1xuICAvLyBzZ3A0Zml4IGRpdmlzb3IgZm9yIGRpdmlkZSBieSB6ZXJvIGNoZWNrIG9uIGluY2xpbmF0aW9uXG4gIC8vIHRoZSBvbGQgY2hlY2sgdXNlZCAxLjAgKyBjb3MocGktMS4wZS05KSwgYnV0IHRoZW4gY29tcGFyZWQgaXQgdG9cbiAgLy8gMS41IGUtMTIsIHNvIHRoZSB0aHJlc2hvbGQgd2FzIGNoYW5nZWQgdG8gMS41ZS0xMiBmb3IgY29uc2lzdGVuY3lcblxuICB2YXIgdGVtcDQgPSAxLjVlLTEyOyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gY2xlYXIgc2dwNCBlcnJvciBmbGFnIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2F0cmVjLnQgPSB0c2luY2U7XG4gIHNhdHJlYy5lcnJvciA9IDA7IC8vICAtLS0tLS0tIHVwZGF0ZSBmb3Igc2VjdWxhciBncmF2aXR5IGFuZCBhdG1vc3BoZXJpYyBkcmFnIC0tLS0tXG5cbiAgdmFyIHhtZGYgPSBzYXRyZWMubW8gKyBzYXRyZWMubWRvdCAqIHNhdHJlYy50O1xuICB2YXIgYXJncGRmID0gc2F0cmVjLmFyZ3BvICsgc2F0cmVjLmFyZ3Bkb3QgKiBzYXRyZWMudDtcbiAgdmFyIG5vZGVkZiA9IHNhdHJlYy5ub2RlbyArIHNhdHJlYy5ub2RlZG90ICogc2F0cmVjLnQ7XG4gIGFyZ3BtID0gYXJncGRmO1xuICBtbSA9IHhtZGY7XG4gIHZhciB0MiA9IHNhdHJlYy50ICogc2F0cmVjLnQ7XG4gIG5vZGVtID0gbm9kZWRmICsgc2F0cmVjLm5vZGVjZiAqIHQyO1xuICB0ZW1wYSA9IDEuMCAtIHNhdHJlYy5jYzEgKiBzYXRyZWMudDtcbiAgdGVtcGUgPSBzYXRyZWMuYnN0YXIgKiBzYXRyZWMuY2M0ICogc2F0cmVjLnQ7XG4gIHRlbXBsID0gc2F0cmVjLnQyY29mICogdDI7XG5cbiAgaWYgKHNhdHJlYy5pc2ltcCAhPT0gMSkge1xuICAgIGRlbG9tZyA9IHNhdHJlYy5vbWdjb2YgKiBzYXRyZWMudDsgLy8gIHNncDRmaXggdXNlIG11dGxpcGx5IGZvciBzcGVlZCBpbnN0ZWFkIG9mIHBvd1xuXG4gICAgdmFyIGRlbG10ZW1wID0gMS4wICsgc2F0cmVjLmV0YSAqIE1hdGguY29zKHhtZGYpO1xuICAgIGRlbG0gPSBzYXRyZWMueG1jb2YgKiAoZGVsbXRlbXAgKiBkZWxtdGVtcCAqIGRlbG10ZW1wIC0gc2F0cmVjLmRlbG1vKTtcbiAgICB0ZW1wID0gZGVsb21nICsgZGVsbTtcbiAgICBtbSA9IHhtZGYgKyB0ZW1wO1xuICAgIGFyZ3BtID0gYXJncGRmIC0gdGVtcDtcbiAgICB0MyA9IHQyICogc2F0cmVjLnQ7XG4gICAgdDQgPSB0MyAqIHNhdHJlYy50O1xuICAgIHRlbXBhID0gdGVtcGEgLSBzYXRyZWMuZDIgKiB0MiAtIHNhdHJlYy5kMyAqIHQzIC0gc2F0cmVjLmQ0ICogdDQ7XG4gICAgdGVtcGUgKz0gc2F0cmVjLmJzdGFyICogc2F0cmVjLmNjNSAqIChNYXRoLnNpbihtbSkgLSBzYXRyZWMuc2lubWFvKTtcbiAgICB0ZW1wbCA9IHRlbXBsICsgc2F0cmVjLnQzY29mICogdDMgKyB0NCAqIChzYXRyZWMudDRjb2YgKyBzYXRyZWMudCAqIHNhdHJlYy50NWNvZik7XG4gIH1cblxuICBubSA9IHNhdHJlYy5ubztcbiAgdmFyIGVtID0gc2F0cmVjLmVjY287XG4gIGluY2xtID0gc2F0cmVjLmluY2xvO1xuXG4gIGlmIChzYXRyZWMubWV0aG9kID09PSAnZCcpIHtcbiAgICB0YyA9IHNhdHJlYy50O1xuICAgIHZhciBkc3BhY2VPcHRpb25zID0ge1xuICAgICAgaXJlejogc2F0cmVjLmlyZXosXG4gICAgICBkMjIwMTogc2F0cmVjLmQyMjAxLFxuICAgICAgZDIyMTE6IHNhdHJlYy5kMjIxMSxcbiAgICAgIGQzMjEwOiBzYXRyZWMuZDMyMTAsXG4gICAgICBkMzIyMjogc2F0cmVjLmQzMjIyLFxuICAgICAgZDQ0MTA6IHNhdHJlYy5kNDQxMCxcbiAgICAgIGQ0NDIyOiBzYXRyZWMuZDQ0MjIsXG4gICAgICBkNTIyMDogc2F0cmVjLmQ1MjIwLFxuICAgICAgZDUyMzI6IHNhdHJlYy5kNTIzMixcbiAgICAgIGQ1NDIxOiBzYXRyZWMuZDU0MjEsXG4gICAgICBkNTQzMzogc2F0cmVjLmQ1NDMzLFxuICAgICAgZGVkdDogc2F0cmVjLmRlZHQsXG4gICAgICBkZWwxOiBzYXRyZWMuZGVsMSxcbiAgICAgIGRlbDI6IHNhdHJlYy5kZWwyLFxuICAgICAgZGVsMzogc2F0cmVjLmRlbDMsXG4gICAgICBkaWR0OiBzYXRyZWMuZGlkdCxcbiAgICAgIGRtZHQ6IHNhdHJlYy5kbWR0LFxuICAgICAgZG5vZHQ6IHNhdHJlYy5kbm9kdCxcbiAgICAgIGRvbWR0OiBzYXRyZWMuZG9tZHQsXG4gICAgICBhcmdwbzogc2F0cmVjLmFyZ3BvLFxuICAgICAgYXJncGRvdDogc2F0cmVjLmFyZ3Bkb3QsXG4gICAgICB0OiBzYXRyZWMudCxcbiAgICAgIHRjOiB0YyxcbiAgICAgIGdzdG86IHNhdHJlYy5nc3RvLFxuICAgICAgeGZhY3Q6IHNhdHJlYy54ZmFjdCxcbiAgICAgIHhsYW1vOiBzYXRyZWMueGxhbW8sXG4gICAgICBubzogc2F0cmVjLm5vLFxuICAgICAgYXRpbWU6IHNhdHJlYy5hdGltZSxcbiAgICAgIGVtOiBlbSxcbiAgICAgIGFyZ3BtOiBhcmdwbSxcbiAgICAgIGluY2xtOiBpbmNsbSxcbiAgICAgIHhsaTogc2F0cmVjLnhsaSxcbiAgICAgIG1tOiBtbSxcbiAgICAgIHhuaTogc2F0cmVjLnhuaSxcbiAgICAgIG5vZGVtOiBub2RlbSxcbiAgICAgIG5tOiBubVxuICAgIH07XG4gICAgdmFyIGRzcGFjZVJlc3VsdCA9IGRzcGFjZShkc3BhY2VPcHRpb25zKTtcbiAgICBlbSA9IGRzcGFjZVJlc3VsdC5lbTtcbiAgICBhcmdwbSA9IGRzcGFjZVJlc3VsdC5hcmdwbTtcbiAgICBpbmNsbSA9IGRzcGFjZVJlc3VsdC5pbmNsbTtcbiAgICBtbSA9IGRzcGFjZVJlc3VsdC5tbTtcbiAgICBub2RlbSA9IGRzcGFjZVJlc3VsdC5ub2RlbTtcbiAgICBubSA9IGRzcGFjZVJlc3VsdC5ubTtcbiAgfVxuXG4gIGlmIChubSA8PSAwLjApIHtcbiAgICAvLyBwcmludGYoXCIvLyBlcnJvciBubSAlZlxcblwiLCBubSk7XG4gICAgc2F0cmVjLmVycm9yID0gMjsgLy8gc2dwNGZpeCBhZGQgcmV0dXJuXG5cbiAgICByZXR1cm4gW2ZhbHNlLCBmYWxzZV07XG4gIH1cblxuICB2YXIgYW0gPSBNYXRoLnBvdyh4a2UgLyBubSwgeDJvMykgKiB0ZW1wYSAqIHRlbXBhO1xuICBubSA9IHhrZSAvIE1hdGgucG93KGFtLCAxLjUpO1xuICBlbSAtPSB0ZW1wZTsgLy8gZml4IHRvbGVyYW5jZSBmb3IgZXJyb3IgcmVjb2duaXRpb25cbiAgLy8gc2dwNGZpeCBhbSBpcyBmaXhlZCBmcm9tIHRoZSBwcmV2aW91cyBubSBjaGVja1xuXG4gIGlmIChlbSA+PSAxLjAgfHwgZW0gPCAtMC4wMDEpIHtcbiAgICAvLyB8fCAoYW0gPCAwLjk1KVxuICAgIC8vIHByaW50ZihcIi8vIGVycm9yIGVtICVmXFxuXCIsIGVtKTtcbiAgICBzYXRyZWMuZXJyb3IgPSAxOyAvLyBzZ3A0Zml4IHRvIHJldHVybiBpZiB0aGVyZSBpcyBhbiBlcnJvciBpbiBlY2NlbnRyaWNpdHlcblxuICAgIHJldHVybiBbZmFsc2UsIGZhbHNlXTtcbiAgfSAvLyAgc2dwNGZpeCBmaXggdG9sZXJhbmNlIHRvIGF2b2lkIGEgZGl2aWRlIGJ5IHplcm9cblxuXG4gIGlmIChlbSA8IDEuMGUtNikge1xuICAgIGVtID0gMS4wZS02O1xuICB9XG5cbiAgbW0gKz0gc2F0cmVjLm5vICogdGVtcGw7XG4gIHhsbSA9IG1tICsgYXJncG0gKyBub2RlbTtcbiAgbm9kZW0gJT0gdHdvUGk7XG4gIGFyZ3BtICU9IHR3b1BpO1xuICB4bG0gJT0gdHdvUGk7XG4gIG1tID0gKHhsbSAtIGFyZ3BtIC0gbm9kZW0pICUgdHdvUGk7IC8vIC0tLS0tLS0tLS0tLS0tLS0tIGNvbXB1dGUgZXh0cmEgbWVhbiBxdWFudGl0aWVzIC0tLS0tLS0tLS0tLS1cblxuICB2YXIgc2luaW0gPSBNYXRoLnNpbihpbmNsbSk7XG4gIHZhciBjb3NpbSA9IE1hdGguY29zKGluY2xtKTsgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0gYWRkIGx1bmFyLXNvbGFyIHBlcmlvZGljcyAtLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBlcCA9IGVtO1xuICB4aW5jcCA9IGluY2xtO1xuICBhcmdwcCA9IGFyZ3BtO1xuICBub2RlcCA9IG5vZGVtO1xuICBtcCA9IG1tO1xuICBzaW5pcCA9IHNpbmltO1xuICBjb3NpcCA9IGNvc2ltO1xuXG4gIGlmIChzYXRyZWMubWV0aG9kID09PSAnZCcpIHtcbiAgICB2YXIgZHBwZXJQYXJhbWV0ZXJzID0ge1xuICAgICAgaW5jbG86IHNhdHJlYy5pbmNsbyxcbiAgICAgIGluaXQ6ICduJyxcbiAgICAgIGVwOiBlcCxcbiAgICAgIGluY2xwOiB4aW5jcCxcbiAgICAgIG5vZGVwOiBub2RlcCxcbiAgICAgIGFyZ3BwOiBhcmdwcCxcbiAgICAgIG1wOiBtcCxcbiAgICAgIG9wc21vZGU6IHNhdHJlYy5vcGVyYXRpb25tb2RlXG4gICAgfTtcbiAgICB2YXIgZHBwZXJSZXN1bHQgPSBkcHBlcihzYXRyZWMsIGRwcGVyUGFyYW1ldGVycyk7XG4gICAgZXAgPSBkcHBlclJlc3VsdC5lcDtcbiAgICBub2RlcCA9IGRwcGVyUmVzdWx0Lm5vZGVwO1xuICAgIGFyZ3BwID0gZHBwZXJSZXN1bHQuYXJncHA7XG4gICAgbXAgPSBkcHBlclJlc3VsdC5tcDtcbiAgICB4aW5jcCA9IGRwcGVyUmVzdWx0LmluY2xwO1xuXG4gICAgaWYgKHhpbmNwIDwgMC4wKSB7XG4gICAgICB4aW5jcCA9IC14aW5jcDtcbiAgICAgIG5vZGVwICs9IHBpO1xuICAgICAgYXJncHAgLT0gcGk7XG4gICAgfVxuXG4gICAgaWYgKGVwIDwgMC4wIHx8IGVwID4gMS4wKSB7XG4gICAgICAvLyAgcHJpbnRmKFwiLy8gZXJyb3IgZXAgJWZcXG5cIiwgZXApO1xuICAgICAgc2F0cmVjLmVycm9yID0gMzsgLy8gIHNncDRmaXggYWRkIHJldHVyblxuXG4gICAgICByZXR1cm4gW2ZhbHNlLCBmYWxzZV07XG4gICAgfVxuICB9IC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLSBsb25nIHBlcmlvZCBwZXJpb2RpY3MgLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICBpZiAoc2F0cmVjLm1ldGhvZCA9PT0gJ2QnKSB7XG4gICAgc2luaXAgPSBNYXRoLnNpbih4aW5jcCk7XG4gICAgY29zaXAgPSBNYXRoLmNvcyh4aW5jcCk7XG4gICAgc2F0cmVjLmF5Y29mID0gLTAuNSAqIGozb2oyICogc2luaXA7IC8vICBzZ3A0Zml4IGZvciBkaXZpZGUgYnkgemVybyBmb3IgeGluY3AgPSAxODAgZGVnXG5cbiAgICBpZiAoTWF0aC5hYnMoY29zaXAgKyAxLjApID4gMS41ZS0xMikge1xuICAgICAgc2F0cmVjLnhsY29mID0gLTAuMjUgKiBqM29qMiAqIHNpbmlwICogKDMuMCArIDUuMCAqIGNvc2lwKSAvICgxLjAgKyBjb3NpcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNhdHJlYy54bGNvZiA9IC0wLjI1ICogajNvajIgKiBzaW5pcCAqICgzLjAgKyA1LjAgKiBjb3NpcCkgLyB0ZW1wNDtcbiAgICB9XG4gIH1cblxuICB2YXIgYXhubCA9IGVwICogTWF0aC5jb3MoYXJncHApO1xuICB0ZW1wID0gMS4wIC8gKGFtICogKDEuMCAtIGVwICogZXApKTtcbiAgdmFyIGF5bmwgPSBlcCAqIE1hdGguc2luKGFyZ3BwKSArIHRlbXAgKiBzYXRyZWMuYXljb2Y7XG4gIHZhciB4bCA9IG1wICsgYXJncHAgKyBub2RlcCArIHRlbXAgKiBzYXRyZWMueGxjb2YgKiBheG5sOyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gc29sdmUga2VwbGVyJ3MgZXF1YXRpb24gLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIHUgPSAoeGwgLSBub2RlcCkgJSB0d29QaTtcbiAgZW8xID0gdTtcbiAgdGVtNSA9IDk5OTkuOTtcbiAgdmFyIGt0ciA9IDE7IC8vICAgIHNncDRmaXggZm9yIGtlcGxlciBpdGVyYXRpb25cbiAgLy8gICAgdGhlIGZvbGxvd2luZyBpdGVyYXRpb24gbmVlZHMgYmV0dGVyIGxpbWl0cyBvbiBjb3JyZWN0aW9uc1xuXG4gIHdoaWxlIChNYXRoLmFicyh0ZW01KSA+PSAxLjBlLTEyICYmIGt0ciA8PSAxMCkge1xuICAgIHNpbmVvMSA9IE1hdGguc2luKGVvMSk7XG4gICAgY29zZW8xID0gTWF0aC5jb3MoZW8xKTtcbiAgICB0ZW01ID0gMS4wIC0gY29zZW8xICogYXhubCAtIHNpbmVvMSAqIGF5bmw7XG4gICAgdGVtNSA9ICh1IC0gYXlubCAqIGNvc2VvMSArIGF4bmwgKiBzaW5lbzEgLSBlbzEpIC8gdGVtNTtcblxuICAgIGlmIChNYXRoLmFicyh0ZW01KSA+PSAwLjk1KSB7XG4gICAgICBpZiAodGVtNSA+IDAuMCkge1xuICAgICAgICB0ZW01ID0gMC45NTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRlbTUgPSAtMC45NTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbzEgKz0gdGVtNTtcbiAgICBrdHIgKz0gMTtcbiAgfSAvLyAgLS0tLS0tLS0tLS0tLSBzaG9ydCBwZXJpb2QgcHJlbGltaW5hcnkgcXVhbnRpdGllcyAtLS0tLS0tLS0tLVxuXG5cbiAgdmFyIGVjb3NlID0gYXhubCAqIGNvc2VvMSArIGF5bmwgKiBzaW5lbzE7XG4gIHZhciBlc2luZSA9IGF4bmwgKiBzaW5lbzEgLSBheW5sICogY29zZW8xO1xuICB2YXIgZWwyID0gYXhubCAqIGF4bmwgKyBheW5sICogYXlubDtcbiAgdmFyIHBsID0gYW0gKiAoMS4wIC0gZWwyKTtcblxuICBpZiAocGwgPCAwLjApIHtcbiAgICAvLyAgcHJpbnRmKFwiLy8gZXJyb3IgcGwgJWZcXG5cIiwgcGwpO1xuICAgIHNhdHJlYy5lcnJvciA9IDQ7IC8vICBzZ3A0Zml4IGFkZCByZXR1cm5cblxuICAgIHJldHVybiBbZmFsc2UsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBybCA9IGFtICogKDEuMCAtIGVjb3NlKTtcbiAgdmFyIHJkb3RsID0gTWF0aC5zcXJ0KGFtKSAqIGVzaW5lIC8gcmw7XG4gIHZhciBydmRvdGwgPSBNYXRoLnNxcnQocGwpIC8gcmw7XG4gIHZhciBiZXRhbCA9IE1hdGguc3FydCgxLjAgLSBlbDIpO1xuICB0ZW1wID0gZXNpbmUgLyAoMS4wICsgYmV0YWwpO1xuICB2YXIgc2ludSA9IGFtIC8gcmwgKiAoc2luZW8xIC0gYXlubCAtIGF4bmwgKiB0ZW1wKTtcbiAgdmFyIGNvc3UgPSBhbSAvIHJsICogKGNvc2VvMSAtIGF4bmwgKyBheW5sICogdGVtcCk7XG4gIHN1ID0gTWF0aC5hdGFuMihzaW51LCBjb3N1KTtcbiAgdmFyIHNpbjJ1ID0gKGNvc3UgKyBjb3N1KSAqIHNpbnU7XG4gIHZhciBjb3MydSA9IDEuMCAtIDIuMCAqIHNpbnUgKiBzaW51O1xuICB0ZW1wID0gMS4wIC8gcGw7XG4gIHZhciB0ZW1wMSA9IDAuNSAqIGoyICogdGVtcDtcbiAgdmFyIHRlbXAyID0gdGVtcDEgKiB0ZW1wOyAvLyAtLS0tLS0tLS0tLS0tLSB1cGRhdGUgZm9yIHNob3J0IHBlcmlvZCBwZXJpb2RpY3MgLS0tLS0tLS0tLS0tXG5cbiAgaWYgKHNhdHJlYy5tZXRob2QgPT09ICdkJykge1xuICAgIGNvc2lzcSA9IGNvc2lwICogY29zaXA7XG4gICAgc2F0cmVjLmNvbjQxID0gMy4wICogY29zaXNxIC0gMS4wO1xuICAgIHNhdHJlYy54MW10aDIgPSAxLjAgLSBjb3Npc3E7XG4gICAgc2F0cmVjLng3dGhtMSA9IDcuMCAqIGNvc2lzcSAtIDEuMDtcbiAgfVxuXG4gIHZhciBtcnQgPSBybCAqICgxLjAgLSAxLjUgKiB0ZW1wMiAqIGJldGFsICogc2F0cmVjLmNvbjQxKSArIDAuNSAqIHRlbXAxICogc2F0cmVjLngxbXRoMiAqIGNvczJ1OyAvLyBzZ3A0Zml4IGZvciBkZWNheWluZyBzYXRlbGxpdGVzXG5cbiAgaWYgKG1ydCA8IDEuMCkge1xuICAgIC8vIHByaW50ZihcIi8vIGRlY2F5IGNvbmRpdGlvbiAlMTEuNmYgXFxuXCIsbXJ0KTtcbiAgICBzYXRyZWMuZXJyb3IgPSA2O1xuICAgIHJldHVybiB7XG4gICAgICBwb3NpdGlvbjogZmFsc2UsXG4gICAgICB2ZWxvY2l0eTogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgc3UgLT0gMC4yNSAqIHRlbXAyICogc2F0cmVjLng3dGhtMSAqIHNpbjJ1O1xuICB2YXIgeG5vZGUgPSBub2RlcCArIDEuNSAqIHRlbXAyICogY29zaXAgKiBzaW4ydTtcbiAgdmFyIHhpbmMgPSB4aW5jcCArIDEuNSAqIHRlbXAyICogY29zaXAgKiBzaW5pcCAqIGNvczJ1O1xuICB2YXIgbXZ0ID0gcmRvdGwgLSBubSAqIHRlbXAxICogc2F0cmVjLngxbXRoMiAqIHNpbjJ1IC8geGtlO1xuICB2YXIgcnZkb3QgPSBydmRvdGwgKyBubSAqIHRlbXAxICogKHNhdHJlYy54MW10aDIgKiBjb3MydSArIDEuNSAqIHNhdHJlYy5jb240MSkgLyB4a2U7IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLSBvcmllbnRhdGlvbiB2ZWN0b3JzIC0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgc2luc3UgPSBNYXRoLnNpbihzdSk7XG4gIHZhciBjb3NzdSA9IE1hdGguY29zKHN1KTtcbiAgdmFyIHNub2QgPSBNYXRoLnNpbih4bm9kZSk7XG4gIHZhciBjbm9kID0gTWF0aC5jb3MoeG5vZGUpO1xuICB2YXIgc2luaSA9IE1hdGguc2luKHhpbmMpO1xuICB2YXIgY29zaSA9IE1hdGguY29zKHhpbmMpO1xuICB2YXIgeG14ID0gLXNub2QgKiBjb3NpO1xuICB2YXIgeG15ID0gY25vZCAqIGNvc2k7XG4gIHZhciB1eCA9IHhteCAqIHNpbnN1ICsgY25vZCAqIGNvc3N1O1xuICB2YXIgdXkgPSB4bXkgKiBzaW5zdSArIHNub2QgKiBjb3NzdTtcbiAgdmFyIHV6ID0gc2luaSAqIHNpbnN1O1xuICB2YXIgdnggPSB4bXggKiBjb3NzdSAtIGNub2QgKiBzaW5zdTtcbiAgdmFyIHZ5ID0geG15ICogY29zc3UgLSBzbm9kICogc2luc3U7XG4gIHZhciB2eiA9IHNpbmkgKiBjb3NzdTsgLy8gLS0tLS0tLS0tIHBvc2l0aW9uIGFuZCB2ZWxvY2l0eSAoaW4ga20gYW5kIGttL3NlYykgLS0tLS0tLS0tLVxuXG4gIHZhciByID0ge1xuICAgIHg6IG1ydCAqIHV4ICogZWFydGhSYWRpdXMsXG4gICAgeTogbXJ0ICogdXkgKiBlYXJ0aFJhZGl1cyxcbiAgICB6OiBtcnQgKiB1eiAqIGVhcnRoUmFkaXVzXG4gIH07XG4gIHZhciB2ID0ge1xuICAgIHg6IChtdnQgKiB1eCArIHJ2ZG90ICogdngpICogdmttcGVyc2VjLFxuICAgIHk6IChtdnQgKiB1eSArIHJ2ZG90ICogdnkpICogdmttcGVyc2VjLFxuICAgIHo6IChtdnQgKiB1eiArIHJ2ZG90ICogdnopICogdmttcGVyc2VjXG4gIH07XG4gIHJldHVybiB7XG4gICAgcG9zaXRpb246IHIsXG4gICAgdmVsb2NpdHk6IHZcbiAgfTtcbiAgLyogZXNsaW50LWVuYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xufVxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWR1cmUgc2dwNGluaXRcbiAqXG4gKiAgdGhpcyBwcm9jZWR1cmUgaW5pdGlhbGl6ZXMgdmFyaWFibGVzIGZvciBzZ3A0LlxuICpcbiAqICBhdXRob3IgICAgICAgIDogZGF2aWQgdmFsbGFkbyAgICAgICAgICAgICAgICAgIDcxOS01NzMtMjYwMCAgIDI4IGp1biAyMDA1XG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAyOCBqdW4gMjAwNVxuICpcbiAqICBpbnB1dHMgICAgICAgIDpcbiAqICAgIG9wc21vZGUgICAgIC0gbW9kZSBvZiBvcGVyYXRpb24gYWZzcGMgb3IgaW1wcm92ZWQgJ2EnLCAnaSdcbiAqICAgIHNhdG4gICAgICAgIC0gc2F0ZWxsaXRlIG51bWJlclxuICogICAgYnN0YXIgICAgICAgLSBzZ3A0IHR5cGUgZHJhZyBjb2VmZmljaWVudCAgICAgICAgICAgICAga2cvbTJlclxuICogICAgZWNjbyAgICAgICAgLSBlY2NlbnRyaWNpdHlcbiAqICAgIGVwb2NoICAgICAgIC0gZXBvY2ggdGltZSBpbiBkYXlzIGZyb20gamFuIDAsIDE5NTAuIDAgaHJcbiAqICAgIGFyZ3BvICAgICAgIC0gYXJndW1lbnQgb2YgcGVyaWdlZSAob3V0cHV0IGlmIGRzKVxuICogICAgaW5jbG8gICAgICAgLSBpbmNsaW5hdGlvblxuICogICAgbW8gICAgICAgICAgLSBtZWFuIGFub21hbHkgKG91dHB1dCBpZiBkcylcbiAqICAgIG5vICAgICAgICAgIC0gbWVhbiBtb3Rpb25cbiAqICAgIG5vZGVvICAgICAgIC0gcmlnaHQgYXNjZW5zaW9uIG9mIGFzY2VuZGluZyBub2RlXG4gKlxuICogIG91dHB1dHMgICAgICAgOlxuICogICAgcmVjICAgICAgLSBjb21tb24gdmFsdWVzIGZvciBzdWJzZXF1ZW50IGNhbGxzXG4gKiAgICByZXR1cm4gY29kZSAtIG5vbi16ZXJvIG9uIGVycm9yLlxuICogICAgICAgICAgICAgICAgICAgMSAtIG1lYW4gZWxlbWVudHMsIGVjYyA+PSAxLjAgb3IgZWNjIDwgLTAuMDAxIG9yIGEgPCAwLjk1IGVyXG4gKiAgICAgICAgICAgICAgICAgICAyIC0gbWVhbiBtb3Rpb24gbGVzcyB0aGFuIDAuMFxuICogICAgICAgICAgICAgICAgICAgMyAtIHBlcnQgZWxlbWVudHMsIGVjYyA8IDAuMCAgb3IgIGVjYyA+IDEuMFxuICogICAgICAgICAgICAgICAgICAgNCAtIHNlbWktbGF0dXMgcmVjdHVtIDwgMC4wXG4gKiAgICAgICAgICAgICAgICAgICA1IC0gZXBvY2ggZWxlbWVudHMgYXJlIHN1Yi1vcmJpdGFsXG4gKiAgICAgICAgICAgICAgICAgICA2IC0gc2F0ZWxsaXRlIGhhcyBkZWNheWVkXG4gKlxuICogIGxvY2FscyAgICAgICAgOlxuICogICAgY25vZG0gICwgc25vZG0gICwgY29zaW0gICwgc2luaW0gICwgY29zb21tICwgc2lub21tXG4gKiAgICBjYzFzcSAgLCBjYzIgICAgLCBjYzNcbiAqICAgIGNvZWYgICAsIGNvZWYxXG4gKiAgICBjb3NpbzQgICAgICAtXG4gKiAgICBkYXkgICAgICAgICAtXG4gKiAgICBkbmR0ICAgICAgICAtXG4gKiAgICBlbSAgICAgICAgICAtIGVjY2VudHJpY2l0eVxuICogICAgZW1zcSAgICAgICAgLSBlY2NlbnRyaWNpdHkgc3F1YXJlZFxuICogICAgZWV0YSAgICAgICAgLVxuICogICAgZXRhc3EgICAgICAgLVxuICogICAgZ2FtICAgICAgICAgLVxuICogICAgYXJncG0gICAgICAgLSBhcmd1bWVudCBvZiBwZXJpZ2VlXG4gKiAgICBub2RlbSAgICAgICAtXG4gKiAgICBpbmNsbSAgICAgICAtIGluY2xpbmF0aW9uXG4gKiAgICBtbSAgICAgICAgICAtIG1lYW4gYW5vbWFseVxuICogICAgbm0gICAgICAgICAgLSBtZWFuIG1vdGlvblxuICogICAgcGVyaWdlICAgICAgLSBwZXJpZ2VlXG4gKiAgICBwaW52c3EgICAgICAtXG4gKiAgICBwc2lzcSAgICAgICAtXG4gKiAgICBxem1zMjQgICAgICAtXG4gKiAgICBydGVtc3EgICAgICAtXG4gKiAgICBzMSwgczIsIHMzLCBzNCwgczUsIHM2LCBzNyAgICAgICAgICAtXG4gKiAgICBzZm91ciAgICAgICAtXG4gKiAgICBzczEsIHNzMiwgc3MzLCBzczQsIHNzNSwgc3M2LCBzczcgICAgICAgICAtXG4gKiAgICBzejEsIHN6Miwgc3ozXG4gKiAgICBzejExLCBzejEyLCBzejEzLCBzejIxLCBzejIyLCBzejIzLCBzejMxLCBzejMyLCBzejMzICAgICAgICAtXG4gKiAgICB0YyAgICAgICAgICAtXG4gKiAgICB0ZW1wICAgICAgICAtXG4gKiAgICB0ZW1wMSwgdGVtcDIsIHRlbXAzICAgICAgIC1cbiAqICAgIHRzaSAgICAgICAgIC1cbiAqICAgIHhwaWRvdCAgICAgIC1cbiAqICAgIHhoZG90MSAgICAgIC1cbiAqICAgIHoxLCB6MiwgejMgICAgICAgICAgLVxuICogICAgejExLCB6MTIsIHoxMywgejIxLCB6MjIsIHoyMywgejMxLCB6MzIsIHozMyAgICAgICAgIC1cbiAqXG4gKiAgY291cGxpbmcgICAgICA6XG4gKiAgICBnZXRncmF2Y29uc3QtXG4gKiAgICBpbml0bCAgICAgICAtXG4gKiAgICBkc2NvbSAgICAgICAtXG4gKiAgICBkcHBlciAgICAgICAtXG4gKiAgICBkc2luaXQgICAgICAtXG4gKiAgICBzZ3A0ICAgICAgICAtXG4gKlxuICogIHJlZmVyZW5jZXMgICAgOlxuICogICAgaG9vdHMsIHJvZWhyaWNoLCBub3JhZCBzcGFjZXRyYWNrIHJlcG9ydCAjMyAxOTgwXG4gKiAgICBob290cywgbm9yYWQgc3BhY2V0cmFjayByZXBvcnQgIzYgMTk4NlxuICogICAgaG9vdHMsIHNjaHVtYWNoZXIgYW5kIGdsb3ZlciAyMDA0XG4gKiAgICB2YWxsYWRvLCBjcmF3Zm9yZCwgaHVqc2FrLCBrZWxzbyAgMjAwNlxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbmZ1bmN0aW9uIHNncDRpbml0KHNhdHJlYywgb3B0aW9ucykge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuICB2YXIgb3BzbW9kZSA9IG9wdGlvbnMub3BzbW9kZSxcbiAgICAgIHNhdG4gPSBvcHRpb25zLnNhdG4sXG4gICAgICBlcG9jaCA9IG9wdGlvbnMuZXBvY2gsXG4gICAgICB4YnN0YXIgPSBvcHRpb25zLnhic3RhcixcbiAgICAgIHhlY2NvID0gb3B0aW9ucy54ZWNjbyxcbiAgICAgIHhhcmdwbyA9IG9wdGlvbnMueGFyZ3BvLFxuICAgICAgeGluY2xvID0gb3B0aW9ucy54aW5jbG8sXG4gICAgICB4bW8gPSBvcHRpb25zLnhtbyxcbiAgICAgIHhubyA9IG9wdGlvbnMueG5vLFxuICAgICAgeG5vZGVvID0gb3B0aW9ucy54bm9kZW87XG4gIHZhciBjb3NpbTtcbiAgdmFyIHNpbmltO1xuICB2YXIgY2Mxc3E7XG4gIHZhciBjYzI7XG4gIHZhciBjYzM7XG4gIHZhciBjb2VmO1xuICB2YXIgY29lZjE7XG4gIHZhciBjb3NpbzQ7XG4gIHZhciBlbTtcbiAgdmFyIGVtc3E7XG4gIHZhciBlZXRhO1xuICB2YXIgZXRhc3E7XG4gIHZhciBhcmdwbTtcbiAgdmFyIG5vZGVtO1xuICB2YXIgaW5jbG07XG4gIHZhciBtbTtcbiAgdmFyIG5tO1xuICB2YXIgcGVyaWdlO1xuICB2YXIgcGludnNxO1xuICB2YXIgcHNpc3E7XG4gIHZhciBxem1zMjQ7XG4gIHZhciBzMTtcbiAgdmFyIHMyO1xuICB2YXIgczM7XG4gIHZhciBzNDtcbiAgdmFyIHM1O1xuICB2YXIgc2ZvdXI7XG4gIHZhciBzczE7XG4gIHZhciBzczI7XG4gIHZhciBzczM7XG4gIHZhciBzczQ7XG4gIHZhciBzczU7XG4gIHZhciBzejE7XG4gIHZhciBzejM7XG4gIHZhciBzejExO1xuICB2YXIgc3oxMztcbiAgdmFyIHN6MjE7XG4gIHZhciBzejIzO1xuICB2YXIgc3ozMTtcbiAgdmFyIHN6MzM7XG4gIHZhciB0YztcbiAgdmFyIHRlbXA7XG4gIHZhciB0ZW1wMTtcbiAgdmFyIHRlbXAyO1xuICB2YXIgdGVtcDM7XG4gIHZhciB0c2k7XG4gIHZhciB4cGlkb3Q7XG4gIHZhciB4aGRvdDE7XG4gIHZhciB6MTtcbiAgdmFyIHozO1xuICB2YXIgejExO1xuICB2YXIgejEzO1xuICB2YXIgejIxO1xuICB2YXIgejIzO1xuICB2YXIgejMxO1xuICB2YXIgejMzO1xuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gaW5pdGlhbGl6YXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gIC8vIHNncDRmaXggZGl2aXNvciBmb3IgZGl2aWRlIGJ5IHplcm8gY2hlY2sgb24gaW5jbGluYXRpb25cbiAgLy8gdGhlIG9sZCBjaGVjayB1c2VkIDEuMCArIE1hdGguY29zKHBpLTEuMGUtOSksIGJ1dCB0aGVuIGNvbXBhcmVkIGl0IHRvXG4gIC8vIDEuNSBlLTEyLCBzbyB0aGUgdGhyZXNob2xkIHdhcyBjaGFuZ2VkIHRvIDEuNWUtMTIgZm9yIGNvbnNpc3RlbmN5XG5cbiAgdmFyIHRlbXA0ID0gMS41ZS0xMjsgLy8gLS0tLS0tLS0tLS0gc2V0IGFsbCBuZWFyIGVhcnRoIHZhcmlhYmxlcyB0byB6ZXJvIC0tLS0tLS0tLS0tLVxuXG4gIHNhdHJlYy5pc2ltcCA9IDA7XG4gIHNhdHJlYy5tZXRob2QgPSAnbic7XG4gIHNhdHJlYy5heWNvZiA9IDAuMDtcbiAgc2F0cmVjLmNvbjQxID0gMC4wO1xuICBzYXRyZWMuY2MxID0gMC4wO1xuICBzYXRyZWMuY2M0ID0gMC4wO1xuICBzYXRyZWMuY2M1ID0gMC4wO1xuICBzYXRyZWMuZDIgPSAwLjA7XG4gIHNhdHJlYy5kMyA9IDAuMDtcbiAgc2F0cmVjLmQ0ID0gMC4wO1xuICBzYXRyZWMuZGVsbW8gPSAwLjA7XG4gIHNhdHJlYy5ldGEgPSAwLjA7XG4gIHNhdHJlYy5hcmdwZG90ID0gMC4wO1xuICBzYXRyZWMub21nY29mID0gMC4wO1xuICBzYXRyZWMuc2lubWFvID0gMC4wO1xuICBzYXRyZWMudCA9IDAuMDtcbiAgc2F0cmVjLnQyY29mID0gMC4wO1xuICBzYXRyZWMudDNjb2YgPSAwLjA7XG4gIHNhdHJlYy50NGNvZiA9IDAuMDtcbiAgc2F0cmVjLnQ1Y29mID0gMC4wO1xuICBzYXRyZWMueDFtdGgyID0gMC4wO1xuICBzYXRyZWMueDd0aG0xID0gMC4wO1xuICBzYXRyZWMubWRvdCA9IDAuMDtcbiAgc2F0cmVjLm5vZGVkb3QgPSAwLjA7XG4gIHNhdHJlYy54bGNvZiA9IDAuMDtcbiAgc2F0cmVjLnhtY29mID0gMC4wO1xuICBzYXRyZWMubm9kZWNmID0gMC4wOyAvLyAtLS0tLS0tLS0tLSBzZXQgYWxsIGRlZXAgc3BhY2UgdmFyaWFibGVzIHRvIHplcm8gLS0tLS0tLS0tLS0tXG5cbiAgc2F0cmVjLmlyZXogPSAwO1xuICBzYXRyZWMuZDIyMDEgPSAwLjA7XG4gIHNhdHJlYy5kMjIxMSA9IDAuMDtcbiAgc2F0cmVjLmQzMjEwID0gMC4wO1xuICBzYXRyZWMuZDMyMjIgPSAwLjA7XG4gIHNhdHJlYy5kNDQxMCA9IDAuMDtcbiAgc2F0cmVjLmQ0NDIyID0gMC4wO1xuICBzYXRyZWMuZDUyMjAgPSAwLjA7XG4gIHNhdHJlYy5kNTIzMiA9IDAuMDtcbiAgc2F0cmVjLmQ1NDIxID0gMC4wO1xuICBzYXRyZWMuZDU0MzMgPSAwLjA7XG4gIHNhdHJlYy5kZWR0ID0gMC4wO1xuICBzYXRyZWMuZGVsMSA9IDAuMDtcbiAgc2F0cmVjLmRlbDIgPSAwLjA7XG4gIHNhdHJlYy5kZWwzID0gMC4wO1xuICBzYXRyZWMuZGlkdCA9IDAuMDtcbiAgc2F0cmVjLmRtZHQgPSAwLjA7XG4gIHNhdHJlYy5kbm9kdCA9IDAuMDtcbiAgc2F0cmVjLmRvbWR0ID0gMC4wO1xuICBzYXRyZWMuZTMgPSAwLjA7XG4gIHNhdHJlYy5lZTIgPSAwLjA7XG4gIHNhdHJlYy5wZW8gPSAwLjA7XG4gIHNhdHJlYy5wZ2hvID0gMC4wO1xuICBzYXRyZWMucGhvID0gMC4wO1xuICBzYXRyZWMucGluY28gPSAwLjA7XG4gIHNhdHJlYy5wbG8gPSAwLjA7XG4gIHNhdHJlYy5zZTIgPSAwLjA7XG4gIHNhdHJlYy5zZTMgPSAwLjA7XG4gIHNhdHJlYy5zZ2gyID0gMC4wO1xuICBzYXRyZWMuc2doMyA9IDAuMDtcbiAgc2F0cmVjLnNnaDQgPSAwLjA7XG4gIHNhdHJlYy5zaDIgPSAwLjA7XG4gIHNhdHJlYy5zaDMgPSAwLjA7XG4gIHNhdHJlYy5zaTIgPSAwLjA7XG4gIHNhdHJlYy5zaTMgPSAwLjA7XG4gIHNhdHJlYy5zbDIgPSAwLjA7XG4gIHNhdHJlYy5zbDMgPSAwLjA7XG4gIHNhdHJlYy5zbDQgPSAwLjA7XG4gIHNhdHJlYy5nc3RvID0gMC4wO1xuICBzYXRyZWMueGZhY3QgPSAwLjA7XG4gIHNhdHJlYy54Z2gyID0gMC4wO1xuICBzYXRyZWMueGdoMyA9IDAuMDtcbiAgc2F0cmVjLnhnaDQgPSAwLjA7XG4gIHNhdHJlYy54aDIgPSAwLjA7XG4gIHNhdHJlYy54aDMgPSAwLjA7XG4gIHNhdHJlYy54aTIgPSAwLjA7XG4gIHNhdHJlYy54aTMgPSAwLjA7XG4gIHNhdHJlYy54bDIgPSAwLjA7XG4gIHNhdHJlYy54bDMgPSAwLjA7XG4gIHNhdHJlYy54bDQgPSAwLjA7XG4gIHNhdHJlYy54bGFtbyA9IDAuMDtcbiAgc2F0cmVjLnptb2wgPSAwLjA7XG4gIHNhdHJlYy56bW9zID0gMC4wO1xuICBzYXRyZWMuYXRpbWUgPSAwLjA7XG4gIHNhdHJlYy54bGkgPSAwLjA7XG4gIHNhdHJlYy54bmkgPSAwLjA7IC8vIHNncDRmaXggLSBub3RlIHRoZSBmb2xsb3dpbmcgdmFyaWFibGVzIGFyZSBhbHNvIHBhc3NlZCBkaXJlY3RseSB2aWEgc2F0cmVjLlxuICAvLyBpdCBpcyBwb3NzaWJsZSB0byBzdHJlYW1saW5lIHRoZSBzZ3A0aW5pdCBjYWxsIGJ5IGRlbGV0aW5nIHRoZSBcInhcIlxuICAvLyB2YXJpYWJsZXMsIGJ1dCB0aGUgdXNlciB3b3VsZCBuZWVkIHRvIHNldCB0aGUgc2F0cmVjLiogdmFsdWVzIGZpcnN0LiB3ZVxuICAvLyBpbmNsdWRlIHRoZSBhZGRpdGlvbmFsIGFzc2lnbm1lbnRzIGluIGNhc2UgdHdvbGluZTJydiBpcyBub3QgdXNlZC5cblxuICBzYXRyZWMuYnN0YXIgPSB4YnN0YXI7XG4gIHNhdHJlYy5lY2NvID0geGVjY287XG4gIHNhdHJlYy5hcmdwbyA9IHhhcmdwbztcbiAgc2F0cmVjLmluY2xvID0geGluY2xvO1xuICBzYXRyZWMubW8gPSB4bW87XG4gIHNhdHJlYy5ubyA9IHhubztcbiAgc2F0cmVjLm5vZGVvID0geG5vZGVvOyAvLyAgc2dwNGZpeCBhZGQgb3BzbW9kZVxuXG4gIHNhdHJlYy5vcGVyYXRpb25tb2RlID0gb3BzbW9kZTsgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGVhcnRoIGNvbnN0YW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBzZ3A0Zml4IGlkZW50aWZ5IGNvbnN0YW50cyBhbmQgYWxsb3cgYWx0ZXJuYXRlIHZhbHVlc1xuXG4gIHZhciBzcyA9IDc4LjAgLyBlYXJ0aFJhZGl1cyArIDEuMDsgLy8gc2dwNGZpeCB1c2UgbXVsdGlwbHkgZm9yIHNwZWVkIGluc3RlYWQgb2YgcG93XG5cbiAgdmFyIHF6bXMydHRlbXAgPSAoMTIwLjAgLSA3OC4wKSAvIGVhcnRoUmFkaXVzO1xuICB2YXIgcXptczJ0ID0gcXptczJ0dGVtcCAqIHF6bXMydHRlbXAgKiBxem1zMnR0ZW1wICogcXptczJ0dGVtcDtcbiAgc2F0cmVjLmluaXQgPSAneSc7XG4gIHNhdHJlYy50ID0gMC4wO1xuICB2YXIgaW5pdGxPcHRpb25zID0ge1xuICAgIHNhdG46IHNhdG4sXG4gICAgZWNjbzogc2F0cmVjLmVjY28sXG4gICAgZXBvY2g6IGVwb2NoLFxuICAgIGluY2xvOiBzYXRyZWMuaW5jbG8sXG4gICAgbm86IHNhdHJlYy5ubyxcbiAgICBtZXRob2Q6IHNhdHJlYy5tZXRob2QsXG4gICAgb3BzbW9kZTogc2F0cmVjLm9wZXJhdGlvbm1vZGVcbiAgfTtcbiAgdmFyIGluaXRsUmVzdWx0ID0gaW5pdGwoaW5pdGxPcHRpb25zKTtcbiAgdmFyIGFvID0gaW5pdGxSZXN1bHQuYW8sXG4gICAgICBjb240MiA9IGluaXRsUmVzdWx0LmNvbjQyLFxuICAgICAgY29zaW8gPSBpbml0bFJlc3VsdC5jb3NpbyxcbiAgICAgIGNvc2lvMiA9IGluaXRsUmVzdWx0LmNvc2lvMixcbiAgICAgIGVjY3NxID0gaW5pdGxSZXN1bHQuZWNjc3EsXG4gICAgICBvbWVvc3EgPSBpbml0bFJlc3VsdC5vbWVvc3EsXG4gICAgICBwb3NxID0gaW5pdGxSZXN1bHQucG9zcSxcbiAgICAgIHJwID0gaW5pdGxSZXN1bHQucnAsXG4gICAgICBydGVvc3EgPSBpbml0bFJlc3VsdC5ydGVvc3EsXG4gICAgICBzaW5pbyA9IGluaXRsUmVzdWx0LnNpbmlvO1xuICBzYXRyZWMubm8gPSBpbml0bFJlc3VsdC5ubztcbiAgc2F0cmVjLmNvbjQxID0gaW5pdGxSZXN1bHQuY29uNDE7XG4gIHNhdHJlYy5nc3RvID0gaW5pdGxSZXN1bHQuZ3N0bztcbiAgc2F0cmVjLmVycm9yID0gMDsgLy8gc2dwNGZpeCByZW1vdmUgdGhpcyBjaGVjayBhcyBpdCBpcyB1bm5lY2Vzc2FyeVxuICAvLyB0aGUgbXJ0IGNoZWNrIGluIHNncDQgaGFuZGxlcyBkZWNheWluZyBzYXRlbGxpdGUgY2FzZXMgZXZlbiBpZiB0aGUgc3RhcnRpbmdcbiAgLy8gY29uZGl0aW9uIGlzIGJlbG93IHRoZSBzdXJmYWNlIG9mIHRlIGVhcnRoXG4gIC8vIGlmIChycCA8IDEuMClcbiAgLy8ge1xuICAvLyAgIHByaW50ZihcIi8vICoqKiBzYXRuJWQgZXBvY2ggZWx0cyBzdWItb3JiaXRhbCAqKipcXG5cIiwgc2F0bik7XG4gIC8vICAgc2F0cmVjLmVycm9yID0gNTtcbiAgLy8gfVxuXG4gIGlmIChvbWVvc3EgPj0gMC4wIHx8IHNhdHJlYy5ubyA+PSAwLjApIHtcbiAgICBzYXRyZWMuaXNpbXAgPSAwO1xuXG4gICAgaWYgKHJwIDwgMjIwLjAgLyBlYXJ0aFJhZGl1cyArIDEuMCkge1xuICAgICAgc2F0cmVjLmlzaW1wID0gMTtcbiAgICB9XG5cbiAgICBzZm91ciA9IHNzO1xuICAgIHF6bXMyNCA9IHF6bXMydDtcbiAgICBwZXJpZ2UgPSAocnAgLSAxLjApICogZWFydGhSYWRpdXM7IC8vIC0gZm9yIHBlcmlnZWVzIGJlbG93IDE1NiBrbSwgcyBhbmQgcW9tczJ0IGFyZSBhbHRlcmVkIC1cblxuICAgIGlmIChwZXJpZ2UgPCAxNTYuMCkge1xuICAgICAgc2ZvdXIgPSBwZXJpZ2UgLSA3OC4wO1xuXG4gICAgICBpZiAocGVyaWdlIDwgOTguMCkge1xuICAgICAgICBzZm91ciA9IDIwLjA7XG4gICAgICB9IC8vIHNncDRmaXggdXNlIG11bHRpcGx5IGZvciBzcGVlZCBpbnN0ZWFkIG9mIHBvd1xuXG5cbiAgICAgIHZhciBxem1zMjR0ZW1wID0gKDEyMC4wIC0gc2ZvdXIpIC8gZWFydGhSYWRpdXM7XG4gICAgICBxem1zMjQgPSBxem1zMjR0ZW1wICogcXptczI0dGVtcCAqIHF6bXMyNHRlbXAgKiBxem1zMjR0ZW1wO1xuICAgICAgc2ZvdXIgPSBzZm91ciAvIGVhcnRoUmFkaXVzICsgMS4wO1xuICAgIH1cblxuICAgIHBpbnZzcSA9IDEuMCAvIHBvc3E7XG4gICAgdHNpID0gMS4wIC8gKGFvIC0gc2ZvdXIpO1xuICAgIHNhdHJlYy5ldGEgPSBhbyAqIHNhdHJlYy5lY2NvICogdHNpO1xuICAgIGV0YXNxID0gc2F0cmVjLmV0YSAqIHNhdHJlYy5ldGE7XG4gICAgZWV0YSA9IHNhdHJlYy5lY2NvICogc2F0cmVjLmV0YTtcbiAgICBwc2lzcSA9IE1hdGguYWJzKDEuMCAtIGV0YXNxKTtcbiAgICBjb2VmID0gcXptczI0ICogTWF0aC5wb3codHNpLCA0LjApO1xuICAgIGNvZWYxID0gY29lZiAvIE1hdGgucG93KHBzaXNxLCAzLjUpO1xuICAgIGNjMiA9IGNvZWYxICogc2F0cmVjLm5vICogKGFvICogKDEuMCArIDEuNSAqIGV0YXNxICsgZWV0YSAqICg0LjAgKyBldGFzcSkpICsgMC4zNzUgKiBqMiAqIHRzaSAvIHBzaXNxICogc2F0cmVjLmNvbjQxICogKDguMCArIDMuMCAqIGV0YXNxICogKDguMCArIGV0YXNxKSkpO1xuICAgIHNhdHJlYy5jYzEgPSBzYXRyZWMuYnN0YXIgKiBjYzI7XG4gICAgY2MzID0gMC4wO1xuXG4gICAgaWYgKHNhdHJlYy5lY2NvID4gMS4wZS00KSB7XG4gICAgICBjYzMgPSAtMi4wICogY29lZiAqIHRzaSAqIGozb2oyICogc2F0cmVjLm5vICogc2luaW8gLyBzYXRyZWMuZWNjbztcbiAgICB9XG5cbiAgICBzYXRyZWMueDFtdGgyID0gMS4wIC0gY29zaW8yO1xuICAgIHNhdHJlYy5jYzQgPSAyLjAgKiBzYXRyZWMubm8gKiBjb2VmMSAqIGFvICogb21lb3NxICogKHNhdHJlYy5ldGEgKiAoMi4wICsgMC41ICogZXRhc3EpICsgc2F0cmVjLmVjY28gKiAoMC41ICsgMi4wICogZXRhc3EpIC0gajIgKiB0c2kgLyAoYW8gKiBwc2lzcSkgKiAoLTMuMCAqIHNhdHJlYy5jb240MSAqICgxLjAgLSAyLjAgKiBlZXRhICsgZXRhc3EgKiAoMS41IC0gMC41ICogZWV0YSkpICsgMC43NSAqIHNhdHJlYy54MW10aDIgKiAoMi4wICogZXRhc3EgLSBlZXRhICogKDEuMCArIGV0YXNxKSkgKiBNYXRoLmNvcygyLjAgKiBzYXRyZWMuYXJncG8pKSk7XG4gICAgc2F0cmVjLmNjNSA9IDIuMCAqIGNvZWYxICogYW8gKiBvbWVvc3EgKiAoMS4wICsgMi43NSAqIChldGFzcSArIGVldGEpICsgZWV0YSAqIGV0YXNxKTtcbiAgICBjb3NpbzQgPSBjb3NpbzIgKiBjb3NpbzI7XG4gICAgdGVtcDEgPSAxLjUgKiBqMiAqIHBpbnZzcSAqIHNhdHJlYy5ubztcbiAgICB0ZW1wMiA9IDAuNSAqIHRlbXAxICogajIgKiBwaW52c3E7XG4gICAgdGVtcDMgPSAtMC40Njg3NSAqIGo0ICogcGludnNxICogcGludnNxICogc2F0cmVjLm5vO1xuICAgIHNhdHJlYy5tZG90ID0gc2F0cmVjLm5vICsgMC41ICogdGVtcDEgKiBydGVvc3EgKiBzYXRyZWMuY29uNDEgKyAwLjA2MjUgKiB0ZW1wMiAqIHJ0ZW9zcSAqICgxMy4wIC0gNzguMCAqIGNvc2lvMiArIDEzNy4wICogY29zaW80KTtcbiAgICBzYXRyZWMuYXJncGRvdCA9IC0wLjUgKiB0ZW1wMSAqIGNvbjQyICsgMC4wNjI1ICogdGVtcDIgKiAoNy4wIC0gMTE0LjAgKiBjb3NpbzIgKyAzOTUuMCAqIGNvc2lvNCkgKyB0ZW1wMyAqICgzLjAgLSAzNi4wICogY29zaW8yICsgNDkuMCAqIGNvc2lvNCk7XG4gICAgeGhkb3QxID0gLXRlbXAxICogY29zaW87XG4gICAgc2F0cmVjLm5vZGVkb3QgPSB4aGRvdDEgKyAoMC41ICogdGVtcDIgKiAoNC4wIC0gMTkuMCAqIGNvc2lvMikgKyAyLjAgKiB0ZW1wMyAqICgzLjAgLSA3LjAgKiBjb3NpbzIpKSAqIGNvc2lvO1xuICAgIHhwaWRvdCA9IHNhdHJlYy5hcmdwZG90ICsgc2F0cmVjLm5vZGVkb3Q7XG4gICAgc2F0cmVjLm9tZ2NvZiA9IHNhdHJlYy5ic3RhciAqIGNjMyAqIE1hdGguY29zKHNhdHJlYy5hcmdwbyk7XG4gICAgc2F0cmVjLnhtY29mID0gMC4wO1xuXG4gICAgaWYgKHNhdHJlYy5lY2NvID4gMS4wZS00KSB7XG4gICAgICBzYXRyZWMueG1jb2YgPSAteDJvMyAqIGNvZWYgKiBzYXRyZWMuYnN0YXIgLyBlZXRhO1xuICAgIH1cblxuICAgIHNhdHJlYy5ub2RlY2YgPSAzLjUgKiBvbWVvc3EgKiB4aGRvdDEgKiBzYXRyZWMuY2MxO1xuICAgIHNhdHJlYy50MmNvZiA9IDEuNSAqIHNhdHJlYy5jYzE7IC8vIHNncDRmaXggZm9yIGRpdmlkZSBieSB6ZXJvIHdpdGggeGluY28gPSAxODAgZGVnXG5cbiAgICBpZiAoTWF0aC5hYnMoY29zaW8gKyAxLjApID4gMS41ZS0xMikge1xuICAgICAgc2F0cmVjLnhsY29mID0gLTAuMjUgKiBqM29qMiAqIHNpbmlvICogKDMuMCArIDUuMCAqIGNvc2lvKSAvICgxLjAgKyBjb3Npbyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNhdHJlYy54bGNvZiA9IC0wLjI1ICogajNvajIgKiBzaW5pbyAqICgzLjAgKyA1LjAgKiBjb3NpbykgLyB0ZW1wNDtcbiAgICB9XG5cbiAgICBzYXRyZWMuYXljb2YgPSAtMC41ICogajNvajIgKiBzaW5pbzsgLy8gc2dwNGZpeCB1c2UgbXVsdGlwbHkgZm9yIHNwZWVkIGluc3RlYWQgb2YgcG93XG5cbiAgICB2YXIgZGVsbW90ZW1wID0gMS4wICsgc2F0cmVjLmV0YSAqIE1hdGguY29zKHNhdHJlYy5tbyk7XG4gICAgc2F0cmVjLmRlbG1vID0gZGVsbW90ZW1wICogZGVsbW90ZW1wICogZGVsbW90ZW1wO1xuICAgIHNhdHJlYy5zaW5tYW8gPSBNYXRoLnNpbihzYXRyZWMubW8pO1xuICAgIHNhdHJlYy54N3RobTEgPSA3LjAgKiBjb3NpbzIgLSAxLjA7IC8vIC0tLS0tLS0tLS0tLS0tLSBkZWVwIHNwYWNlIGluaXRpYWxpemF0aW9uIC0tLS0tLS0tLS0tLS1cblxuICAgIGlmICgyICogcGkgLyBzYXRyZWMubm8gPj0gMjI1LjApIHtcbiAgICAgIHNhdHJlYy5tZXRob2QgPSAnZCc7XG4gICAgICBzYXRyZWMuaXNpbXAgPSAxO1xuICAgICAgdGMgPSAwLjA7XG4gICAgICBpbmNsbSA9IHNhdHJlYy5pbmNsbztcbiAgICAgIHZhciBkc2NvbU9wdGlvbnMgPSB7XG4gICAgICAgIGVwb2NoOiBlcG9jaCxcbiAgICAgICAgZXA6IHNhdHJlYy5lY2NvLFxuICAgICAgICBhcmdwcDogc2F0cmVjLmFyZ3BvLFxuICAgICAgICB0YzogdGMsXG4gICAgICAgIGluY2xwOiBzYXRyZWMuaW5jbG8sXG4gICAgICAgIG5vZGVwOiBzYXRyZWMubm9kZW8sXG4gICAgICAgIG5wOiBzYXRyZWMubm8sXG4gICAgICAgIGUzOiBzYXRyZWMuZTMsXG4gICAgICAgIGVlMjogc2F0cmVjLmVlMixcbiAgICAgICAgcGVvOiBzYXRyZWMucGVvLFxuICAgICAgICBwZ2hvOiBzYXRyZWMucGdobyxcbiAgICAgICAgcGhvOiBzYXRyZWMucGhvLFxuICAgICAgICBwaW5jbzogc2F0cmVjLnBpbmNvLFxuICAgICAgICBwbG86IHNhdHJlYy5wbG8sXG4gICAgICAgIHNlMjogc2F0cmVjLnNlMixcbiAgICAgICAgc2UzOiBzYXRyZWMuc2UzLFxuICAgICAgICBzZ2gyOiBzYXRyZWMuc2doMixcbiAgICAgICAgc2doMzogc2F0cmVjLnNnaDMsXG4gICAgICAgIHNnaDQ6IHNhdHJlYy5zZ2g0LFxuICAgICAgICBzaDI6IHNhdHJlYy5zaDIsXG4gICAgICAgIHNoMzogc2F0cmVjLnNoMyxcbiAgICAgICAgc2kyOiBzYXRyZWMuc2kyLFxuICAgICAgICBzaTM6IHNhdHJlYy5zaTMsXG4gICAgICAgIHNsMjogc2F0cmVjLnNsMixcbiAgICAgICAgc2wzOiBzYXRyZWMuc2wzLFxuICAgICAgICBzbDQ6IHNhdHJlYy5zbDQsXG4gICAgICAgIHhnaDI6IHNhdHJlYy54Z2gyLFxuICAgICAgICB4Z2gzOiBzYXRyZWMueGdoMyxcbiAgICAgICAgeGdoNDogc2F0cmVjLnhnaDQsXG4gICAgICAgIHhoMjogc2F0cmVjLnhoMixcbiAgICAgICAgeGgzOiBzYXRyZWMueGgzLFxuICAgICAgICB4aTI6IHNhdHJlYy54aTIsXG4gICAgICAgIHhpMzogc2F0cmVjLnhpMyxcbiAgICAgICAgeGwyOiBzYXRyZWMueGwyLFxuICAgICAgICB4bDM6IHNhdHJlYy54bDMsXG4gICAgICAgIHhsNDogc2F0cmVjLnhsNCxcbiAgICAgICAgem1vbDogc2F0cmVjLnptb2wsXG4gICAgICAgIHptb3M6IHNhdHJlYy56bW9zXG4gICAgICB9O1xuICAgICAgdmFyIGRzY29tUmVzdWx0ID0gZHNjb20oZHNjb21PcHRpb25zKTtcbiAgICAgIHNhdHJlYy5lMyA9IGRzY29tUmVzdWx0LmUzO1xuICAgICAgc2F0cmVjLmVlMiA9IGRzY29tUmVzdWx0LmVlMjtcbiAgICAgIHNhdHJlYy5wZW8gPSBkc2NvbVJlc3VsdC5wZW87XG4gICAgICBzYXRyZWMucGdobyA9IGRzY29tUmVzdWx0LnBnaG87XG4gICAgICBzYXRyZWMucGhvID0gZHNjb21SZXN1bHQucGhvO1xuICAgICAgc2F0cmVjLnBpbmNvID0gZHNjb21SZXN1bHQucGluY287XG4gICAgICBzYXRyZWMucGxvID0gZHNjb21SZXN1bHQucGxvO1xuICAgICAgc2F0cmVjLnNlMiA9IGRzY29tUmVzdWx0LnNlMjtcbiAgICAgIHNhdHJlYy5zZTMgPSBkc2NvbVJlc3VsdC5zZTM7XG4gICAgICBzYXRyZWMuc2doMiA9IGRzY29tUmVzdWx0LnNnaDI7XG4gICAgICBzYXRyZWMuc2doMyA9IGRzY29tUmVzdWx0LnNnaDM7XG4gICAgICBzYXRyZWMuc2doNCA9IGRzY29tUmVzdWx0LnNnaDQ7XG4gICAgICBzYXRyZWMuc2gyID0gZHNjb21SZXN1bHQuc2gyO1xuICAgICAgc2F0cmVjLnNoMyA9IGRzY29tUmVzdWx0LnNoMztcbiAgICAgIHNhdHJlYy5zaTIgPSBkc2NvbVJlc3VsdC5zaTI7XG4gICAgICBzYXRyZWMuc2kzID0gZHNjb21SZXN1bHQuc2kzO1xuICAgICAgc2F0cmVjLnNsMiA9IGRzY29tUmVzdWx0LnNsMjtcbiAgICAgIHNhdHJlYy5zbDMgPSBkc2NvbVJlc3VsdC5zbDM7XG4gICAgICBzYXRyZWMuc2w0ID0gZHNjb21SZXN1bHQuc2w0O1xuICAgICAgc2luaW0gPSBkc2NvbVJlc3VsdC5zaW5pbTtcbiAgICAgIGNvc2ltID0gZHNjb21SZXN1bHQuY29zaW07XG4gICAgICBlbSA9IGRzY29tUmVzdWx0LmVtO1xuICAgICAgZW1zcSA9IGRzY29tUmVzdWx0LmVtc3E7XG4gICAgICBzMSA9IGRzY29tUmVzdWx0LnMxO1xuICAgICAgczIgPSBkc2NvbVJlc3VsdC5zMjtcbiAgICAgIHMzID0gZHNjb21SZXN1bHQuczM7XG4gICAgICBzNCA9IGRzY29tUmVzdWx0LnM0O1xuICAgICAgczUgPSBkc2NvbVJlc3VsdC5zNTtcbiAgICAgIHNzMSA9IGRzY29tUmVzdWx0LnNzMTtcbiAgICAgIHNzMiA9IGRzY29tUmVzdWx0LnNzMjtcbiAgICAgIHNzMyA9IGRzY29tUmVzdWx0LnNzMztcbiAgICAgIHNzNCA9IGRzY29tUmVzdWx0LnNzNDtcbiAgICAgIHNzNSA9IGRzY29tUmVzdWx0LnNzNTtcbiAgICAgIHN6MSA9IGRzY29tUmVzdWx0LnN6MTtcbiAgICAgIHN6MyA9IGRzY29tUmVzdWx0LnN6MztcbiAgICAgIHN6MTEgPSBkc2NvbVJlc3VsdC5zejExO1xuICAgICAgc3oxMyA9IGRzY29tUmVzdWx0LnN6MTM7XG4gICAgICBzejIxID0gZHNjb21SZXN1bHQuc3oyMTtcbiAgICAgIHN6MjMgPSBkc2NvbVJlc3VsdC5zejIzO1xuICAgICAgc3ozMSA9IGRzY29tUmVzdWx0LnN6MzE7XG4gICAgICBzejMzID0gZHNjb21SZXN1bHQuc3ozMztcbiAgICAgIHNhdHJlYy54Z2gyID0gZHNjb21SZXN1bHQueGdoMjtcbiAgICAgIHNhdHJlYy54Z2gzID0gZHNjb21SZXN1bHQueGdoMztcbiAgICAgIHNhdHJlYy54Z2g0ID0gZHNjb21SZXN1bHQueGdoNDtcbiAgICAgIHNhdHJlYy54aDIgPSBkc2NvbVJlc3VsdC54aDI7XG4gICAgICBzYXRyZWMueGgzID0gZHNjb21SZXN1bHQueGgzO1xuICAgICAgc2F0cmVjLnhpMiA9IGRzY29tUmVzdWx0LnhpMjtcbiAgICAgIHNhdHJlYy54aTMgPSBkc2NvbVJlc3VsdC54aTM7XG4gICAgICBzYXRyZWMueGwyID0gZHNjb21SZXN1bHQueGwyO1xuICAgICAgc2F0cmVjLnhsMyA9IGRzY29tUmVzdWx0LnhsMztcbiAgICAgIHNhdHJlYy54bDQgPSBkc2NvbVJlc3VsdC54bDQ7XG4gICAgICBzYXRyZWMuem1vbCA9IGRzY29tUmVzdWx0Lnptb2w7XG4gICAgICBzYXRyZWMuem1vcyA9IGRzY29tUmVzdWx0Lnptb3M7XG4gICAgICBubSA9IGRzY29tUmVzdWx0Lm5tO1xuICAgICAgejEgPSBkc2NvbVJlc3VsdC56MTtcbiAgICAgIHozID0gZHNjb21SZXN1bHQuejM7XG4gICAgICB6MTEgPSBkc2NvbVJlc3VsdC56MTE7XG4gICAgICB6MTMgPSBkc2NvbVJlc3VsdC56MTM7XG4gICAgICB6MjEgPSBkc2NvbVJlc3VsdC56MjE7XG4gICAgICB6MjMgPSBkc2NvbVJlc3VsdC56MjM7XG4gICAgICB6MzEgPSBkc2NvbVJlc3VsdC56MzE7XG4gICAgICB6MzMgPSBkc2NvbVJlc3VsdC56MzM7XG4gICAgICB2YXIgZHBwZXJPcHRpb25zID0ge1xuICAgICAgICBpbmNsbzogaW5jbG0sXG4gICAgICAgIGluaXQ6IHNhdHJlYy5pbml0LFxuICAgICAgICBlcDogc2F0cmVjLmVjY28sXG4gICAgICAgIGluY2xwOiBzYXRyZWMuaW5jbG8sXG4gICAgICAgIG5vZGVwOiBzYXRyZWMubm9kZW8sXG4gICAgICAgIGFyZ3BwOiBzYXRyZWMuYXJncG8sXG4gICAgICAgIG1wOiBzYXRyZWMubW8sXG4gICAgICAgIG9wc21vZGU6IHNhdHJlYy5vcGVyYXRpb25tb2RlXG4gICAgICB9O1xuICAgICAgdmFyIGRwcGVyUmVzdWx0ID0gZHBwZXIoc2F0cmVjLCBkcHBlck9wdGlvbnMpO1xuICAgICAgc2F0cmVjLmVjY28gPSBkcHBlclJlc3VsdC5lcDtcbiAgICAgIHNhdHJlYy5pbmNsbyA9IGRwcGVyUmVzdWx0LmluY2xwO1xuICAgICAgc2F0cmVjLm5vZGVvID0gZHBwZXJSZXN1bHQubm9kZXA7XG4gICAgICBzYXRyZWMuYXJncG8gPSBkcHBlclJlc3VsdC5hcmdwcDtcbiAgICAgIHNhdHJlYy5tbyA9IGRwcGVyUmVzdWx0Lm1wO1xuICAgICAgYXJncG0gPSAwLjA7XG4gICAgICBub2RlbSA9IDAuMDtcbiAgICAgIG1tID0gMC4wO1xuICAgICAgdmFyIGRzaW5pdE9wdGlvbnMgPSB7XG4gICAgICAgIGNvc2ltOiBjb3NpbSxcbiAgICAgICAgZW1zcTogZW1zcSxcbiAgICAgICAgYXJncG86IHNhdHJlYy5hcmdwbyxcbiAgICAgICAgczE6IHMxLFxuICAgICAgICBzMjogczIsXG4gICAgICAgIHMzOiBzMyxcbiAgICAgICAgczQ6IHM0LFxuICAgICAgICBzNTogczUsXG4gICAgICAgIHNpbmltOiBzaW5pbSxcbiAgICAgICAgc3MxOiBzczEsXG4gICAgICAgIHNzMjogc3MyLFxuICAgICAgICBzczM6IHNzMyxcbiAgICAgICAgc3M0OiBzczQsXG4gICAgICAgIHNzNTogc3M1LFxuICAgICAgICBzejE6IHN6MSxcbiAgICAgICAgc3ozOiBzejMsXG4gICAgICAgIHN6MTE6IHN6MTEsXG4gICAgICAgIHN6MTM6IHN6MTMsXG4gICAgICAgIHN6MjE6IHN6MjEsXG4gICAgICAgIHN6MjM6IHN6MjMsXG4gICAgICAgIHN6MzE6IHN6MzEsXG4gICAgICAgIHN6MzM6IHN6MzMsXG4gICAgICAgIHQ6IHNhdHJlYy50LFxuICAgICAgICB0YzogdGMsXG4gICAgICAgIGdzdG86IHNhdHJlYy5nc3RvLFxuICAgICAgICBtbzogc2F0cmVjLm1vLFxuICAgICAgICBtZG90OiBzYXRyZWMubWRvdCxcbiAgICAgICAgbm86IHNhdHJlYy5ubyxcbiAgICAgICAgbm9kZW86IHNhdHJlYy5ub2RlbyxcbiAgICAgICAgbm9kZWRvdDogc2F0cmVjLm5vZGVkb3QsXG4gICAgICAgIHhwaWRvdDogeHBpZG90LFxuICAgICAgICB6MTogejEsXG4gICAgICAgIHozOiB6MyxcbiAgICAgICAgejExOiB6MTEsXG4gICAgICAgIHoxMzogejEzLFxuICAgICAgICB6MjE6IHoyMSxcbiAgICAgICAgejIzOiB6MjMsXG4gICAgICAgIHozMTogejMxLFxuICAgICAgICB6MzM6IHozMyxcbiAgICAgICAgZWNjbzogc2F0cmVjLmVjY28sXG4gICAgICAgIGVjY3NxOiBlY2NzcSxcbiAgICAgICAgZW06IGVtLFxuICAgICAgICBhcmdwbTogYXJncG0sXG4gICAgICAgIGluY2xtOiBpbmNsbSxcbiAgICAgICAgbW06IG1tLFxuICAgICAgICBubTogbm0sXG4gICAgICAgIG5vZGVtOiBub2RlbSxcbiAgICAgICAgaXJlejogc2F0cmVjLmlyZXosXG4gICAgICAgIGF0aW1lOiBzYXRyZWMuYXRpbWUsXG4gICAgICAgIGQyMjAxOiBzYXRyZWMuZDIyMDEsXG4gICAgICAgIGQyMjExOiBzYXRyZWMuZDIyMTEsXG4gICAgICAgIGQzMjEwOiBzYXRyZWMuZDMyMTAsXG4gICAgICAgIGQzMjIyOiBzYXRyZWMuZDMyMjIsXG4gICAgICAgIGQ0NDEwOiBzYXRyZWMuZDQ0MTAsXG4gICAgICAgIGQ0NDIyOiBzYXRyZWMuZDQ0MjIsXG4gICAgICAgIGQ1MjIwOiBzYXRyZWMuZDUyMjAsXG4gICAgICAgIGQ1MjMyOiBzYXRyZWMuZDUyMzIsXG4gICAgICAgIGQ1NDIxOiBzYXRyZWMuZDU0MjEsXG4gICAgICAgIGQ1NDMzOiBzYXRyZWMuZDU0MzMsXG4gICAgICAgIGRlZHQ6IHNhdHJlYy5kZWR0LFxuICAgICAgICBkaWR0OiBzYXRyZWMuZGlkdCxcbiAgICAgICAgZG1kdDogc2F0cmVjLmRtZHQsXG4gICAgICAgIGRub2R0OiBzYXRyZWMuZG5vZHQsXG4gICAgICAgIGRvbWR0OiBzYXRyZWMuZG9tZHQsXG4gICAgICAgIGRlbDE6IHNhdHJlYy5kZWwxLFxuICAgICAgICBkZWwyOiBzYXRyZWMuZGVsMixcbiAgICAgICAgZGVsMzogc2F0cmVjLmRlbDMsXG4gICAgICAgIHhmYWN0OiBzYXRyZWMueGZhY3QsXG4gICAgICAgIHhsYW1vOiBzYXRyZWMueGxhbW8sXG4gICAgICAgIHhsaTogc2F0cmVjLnhsaSxcbiAgICAgICAgeG5pOiBzYXRyZWMueG5pXG4gICAgICB9O1xuICAgICAgdmFyIGRzaW5pdFJlc3VsdCA9IGRzaW5pdChkc2luaXRPcHRpb25zKTtcbiAgICAgIHNhdHJlYy5pcmV6ID0gZHNpbml0UmVzdWx0LmlyZXo7XG4gICAgICBzYXRyZWMuYXRpbWUgPSBkc2luaXRSZXN1bHQuYXRpbWU7XG4gICAgICBzYXRyZWMuZDIyMDEgPSBkc2luaXRSZXN1bHQuZDIyMDE7XG4gICAgICBzYXRyZWMuZDIyMTEgPSBkc2luaXRSZXN1bHQuZDIyMTE7XG4gICAgICBzYXRyZWMuZDMyMTAgPSBkc2luaXRSZXN1bHQuZDMyMTA7XG4gICAgICBzYXRyZWMuZDMyMjIgPSBkc2luaXRSZXN1bHQuZDMyMjI7XG4gICAgICBzYXRyZWMuZDQ0MTAgPSBkc2luaXRSZXN1bHQuZDQ0MTA7XG4gICAgICBzYXRyZWMuZDQ0MjIgPSBkc2luaXRSZXN1bHQuZDQ0MjI7XG4gICAgICBzYXRyZWMuZDUyMjAgPSBkc2luaXRSZXN1bHQuZDUyMjA7XG4gICAgICBzYXRyZWMuZDUyMzIgPSBkc2luaXRSZXN1bHQuZDUyMzI7XG4gICAgICBzYXRyZWMuZDU0MjEgPSBkc2luaXRSZXN1bHQuZDU0MjE7XG4gICAgICBzYXRyZWMuZDU0MzMgPSBkc2luaXRSZXN1bHQuZDU0MzM7XG4gICAgICBzYXRyZWMuZGVkdCA9IGRzaW5pdFJlc3VsdC5kZWR0O1xuICAgICAgc2F0cmVjLmRpZHQgPSBkc2luaXRSZXN1bHQuZGlkdDtcbiAgICAgIHNhdHJlYy5kbWR0ID0gZHNpbml0UmVzdWx0LmRtZHQ7XG4gICAgICBzYXRyZWMuZG5vZHQgPSBkc2luaXRSZXN1bHQuZG5vZHQ7XG4gICAgICBzYXRyZWMuZG9tZHQgPSBkc2luaXRSZXN1bHQuZG9tZHQ7XG4gICAgICBzYXRyZWMuZGVsMSA9IGRzaW5pdFJlc3VsdC5kZWwxO1xuICAgICAgc2F0cmVjLmRlbDIgPSBkc2luaXRSZXN1bHQuZGVsMjtcbiAgICAgIHNhdHJlYy5kZWwzID0gZHNpbml0UmVzdWx0LmRlbDM7XG4gICAgICBzYXRyZWMueGZhY3QgPSBkc2luaXRSZXN1bHQueGZhY3Q7XG4gICAgICBzYXRyZWMueGxhbW8gPSBkc2luaXRSZXN1bHQueGxhbW87XG4gICAgICBzYXRyZWMueGxpID0gZHNpbml0UmVzdWx0LnhsaTtcbiAgICAgIHNhdHJlYy54bmkgPSBkc2luaXRSZXN1bHQueG5pO1xuICAgIH0gLy8gLS0tLS0tLS0tLS0gc2V0IHZhcmlhYmxlcyBpZiBub3QgZGVlcCBzcGFjZSAtLS0tLS0tLS0tLVxuXG5cbiAgICBpZiAoc2F0cmVjLmlzaW1wICE9PSAxKSB7XG4gICAgICBjYzFzcSA9IHNhdHJlYy5jYzEgKiBzYXRyZWMuY2MxO1xuICAgICAgc2F0cmVjLmQyID0gNC4wICogYW8gKiB0c2kgKiBjYzFzcTtcbiAgICAgIHRlbXAgPSBzYXRyZWMuZDIgKiB0c2kgKiBzYXRyZWMuY2MxIC8gMy4wO1xuICAgICAgc2F0cmVjLmQzID0gKDE3LjAgKiBhbyArIHNmb3VyKSAqIHRlbXA7XG4gICAgICBzYXRyZWMuZDQgPSAwLjUgKiB0ZW1wICogYW8gKiB0c2kgKiAoMjIxLjAgKiBhbyArIDMxLjAgKiBzZm91cikgKiBzYXRyZWMuY2MxO1xuICAgICAgc2F0cmVjLnQzY29mID0gc2F0cmVjLmQyICsgMi4wICogY2Mxc3E7XG4gICAgICBzYXRyZWMudDRjb2YgPSAwLjI1ICogKDMuMCAqIHNhdHJlYy5kMyArIHNhdHJlYy5jYzEgKiAoMTIuMCAqIHNhdHJlYy5kMiArIDEwLjAgKiBjYzFzcSkpO1xuICAgICAgc2F0cmVjLnQ1Y29mID0gMC4yICogKDMuMCAqIHNhdHJlYy5kNCArIDEyLjAgKiBzYXRyZWMuY2MxICogc2F0cmVjLmQzICsgNi4wICogc2F0cmVjLmQyICogc2F0cmVjLmQyICsgMTUuMCAqIGNjMXNxICogKDIuMCAqIHNhdHJlYy5kMiArIGNjMXNxKSk7XG4gICAgfVxuICAgIC8qIGZpbmFsbHkgcHJvcG9nYXRlIHRvIHplcm8gZXBvY2ggdG8gaW5pdGlhbGl6ZSBhbGwgb3RoZXJzLiAqL1xuICAgIC8vIHNncDRmaXggdGFrZSBvdXQgY2hlY2sgdG8gbGV0IHNhdGVsbGl0ZXMgcHJvY2VzcyB1bnRpbCB0aGV5IGFyZSBhY3R1YWxseSBiZWxvdyBlYXJ0aCBzdXJmYWNlXG4gICAgLy8gaWYoc2F0cmVjLmVycm9yID09IDApXG5cbiAgfVxuXG4gIHNncDQoc2F0cmVjLCAwKTtcbiAgc2F0cmVjLmluaXQgPSAnbic7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbn1cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiB0d29saW5lMnJ2XG4gKlxuICogIHRoaXMgZnVuY3Rpb24gY29udmVydHMgdGhlIHR3byBsaW5lIGVsZW1lbnQgc2V0IGNoYXJhY3RlciBzdHJpbmcgZGF0YSB0b1xuICogICAgdmFyaWFibGVzIGFuZCBpbml0aWFsaXplcyB0aGUgc2dwNCB2YXJpYWJsZXMuIHNldmVyYWwgaW50ZXJtZWRpYXRlIHZhcmFpYmxlc1xuICogICAgYW5kIHF1YW50aXRpZXMgYXJlIGRldGVybWluZWQuIG5vdGUgdGhhdCB0aGUgcmVzdWx0IGlzIGEgc3RydWN0dXJlIHNvIG11bHRpcGxlXG4gKiAgICBzYXRlbGxpdGVzIGNhbiBiZSBwcm9jZXNzZWQgc2ltdWx0YW5lb3VzbHkgd2l0aG91dCBoYXZpbmcgdG8gcmVpbml0aWFsaXplLiB0aGVcbiAqICAgIHZlcmlmaWNhdGlvbiBtb2RlIGlzIGFuIGltcG9ydGFudCBvcHRpb24gdGhhdCBwZXJtaXRzIHF1aWNrIGNoZWNrcyBvZiBhbnlcbiAqICAgIGNoYW5nZXMgdG8gdGhlIHVuZGVybHlpbmcgdGVjaG5pY2FsIHRoZW9yeS4gdGhpcyBvcHRpb24gd29ya3MgdXNpbmcgYVxuICogICAgbW9kaWZpZWQgdGxlIGZpbGUgaW4gd2hpY2ggdGhlIHN0YXJ0LCBzdG9wLCBhbmQgZGVsdGEgdGltZSB2YWx1ZXMgYXJlXG4gKiAgICBpbmNsdWRlZCBhdCB0aGUgZW5kIG9mIHRoZSBzZWNvbmQgbGluZSBvZiBkYXRhLiB0aGlzIG9ubHkgd29ya3Mgd2l0aCB0aGVcbiAqICAgIHZlcmlmaWNhdGlvbiBtb2RlLiB0aGUgY2F0YWxvZyBtb2RlIHNpbXBseSBwcm9wYWdhdGVzIGZyb20gLTE0NDAgdG8gMTQ0MCBtaW5cbiAqICAgIGZyb20gZXBvY2ggYW5kIGlzIHVzZWZ1bCB3aGVuIHBlcmZvcm1pbmcgZW50aXJlIGNhdGFsb2cgcnVucy5cbiAqXG4gKiAgYXV0aG9yICAgICAgICA6IGRhdmlkIHZhbGxhZG8gICAgICAgICAgICAgICAgICA3MTktNTczLTI2MDAgICAgMSBtYXIgMjAwMVxuICpcbiAqICBpbnB1dHMgICAgICAgIDpcbiAqICAgIGxvbmdzdHIxICAgIC0gZmlyc3QgbGluZSBvZiB0aGUgdGxlXG4gKiAgICBsb25nc3RyMiAgICAtIHNlY29uZCBsaW5lIG9mIHRoZSB0bGVcbiAqICAgIHR5cGVydW4gICAgIC0gdHlwZSBvZiBydW4gICAgICAgICAgICAgICAgICAgIHZlcmlmaWNhdGlvbiAndicsIGNhdGFsb2cgJ2MnLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFudWFsICdtJ1xuICogICAgdHlwZWlucHV0ICAgLSB0eXBlIG9mIG1hbnVhbCBpbnB1dCAgICAgICAgICAgbWZlICdtJywgZXBvY2ggJ2UnLCBkYXlvZnlyICdkJ1xuICogICAgb3BzbW9kZSAgICAgLSBtb2RlIG9mIG9wZXJhdGlvbiBhZnNwYyBvciBpbXByb3ZlZCAnYScsICdpJ1xuICogICAgd2hpY2hjb25zdCAgLSB3aGljaCBzZXQgb2YgY29uc3RhbnRzIHRvIHVzZSAgNzIsIDg0XG4gKlxuICogIG91dHB1dHMgICAgICAgOlxuICogICAgc2F0cmVjICAgICAgLSBzdHJ1Y3R1cmUgY29udGFpbmluZyBhbGwgdGhlIHNncDQgc2F0ZWxsaXRlIGluZm9ybWF0aW9uXG4gKlxuICogIGNvdXBsaW5nICAgICAgOlxuICogICAgZ2V0Z3JhdmNvbnN0LVxuICogICAgZGF5czJtZGhtcyAgLSBjb252ZXJzaW9uIG9mIGRheXMgdG8gbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmRcbiAqICAgIGpkYXkgICAgICAgIC0gY29udmVydCBkYXkgbW9udGggeWVhciBob3VyIG1pbnV0ZSBzZWNvbmQgaW50byBqdWxpYW4gZGF0ZVxuICogICAgc2dwNGluaXQgICAgLSBpbml0aWFsaXplIHRoZSBzZ3A0IHZhcmlhYmxlc1xuICpcbiAqICByZWZlcmVuY2VzICAgIDpcbiAqICAgIG5vcmFkIHNwYWNldHJhY2sgcmVwb3J0ICMzXG4gKiAgICB2YWxsYWRvLCBjcmF3Zm9yZCwgaHVqc2FrLCBrZWxzbyAgMjAwNlxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKipcbiAqIFJldHVybiBhIFNhdGVsbGl0ZSBpbXBvcnRlZCBmcm9tIHR3byBsaW5lcyBvZiBUTEUgZGF0YS5cbiAqXG4gKiBQcm92aWRlIHRoZSB0d28gVExFIGxpbmVzIGFzIHN0cmluZ3MgYGxvbmdzdHIxYCBhbmQgYGxvbmdzdHIyYCxcbiAqIGFuZCBzZWxlY3Qgd2hpY2ggc3RhbmRhcmQgc2V0IG9mIGdyYXZpdGF0aW9uYWwgY29uc3RhbnRzIHlvdSB3YW50XG4gKiBieSBwcm92aWRpbmcgYGdyYXZpdHlfY29uc3RhbnRzYDpcbiAqXG4gKiBgc2dwNC5wcm9wYWdhdGlvbi53Z3M3MmAgLSBTdGFuZGFyZCBXR1MgNzIgbW9kZWxcbiAqIGBzZ3A0LnByb3BhZ2F0aW9uLndnczg0YCAtIE1vcmUgcmVjZW50IFdHUyA4NCBtb2RlbFxuICogYHNncDQucHJvcGFnYXRpb24ud2dzNzJvbGRgIC0gTGVnYWN5IHN1cHBvcnQgZm9yIG9sZCBTR1A0IGJlaGF2aW9yXG4gKlxuICogTm9ybWFsbHksIGNvbXB1dGF0aW9ucyBhcmUgbWFkZSB1c2luZyBsZXRpb3VzIHJlY2VudCBpbXByb3ZlbWVudHNcbiAqIHRvIHRoZSBhbGdvcml0aG0uICBJZiB5b3Ugd2FudCB0byB0dXJuIHNvbWUgb2YgdGhlc2Ugb2ZmIGFuZCBnb1xuICogYmFjayBpbnRvIFwiYWZzcGNcIiBtb2RlLCB0aGVuIHNldCBgYWZzcGNfbW9kZWAgdG8gYFRydWVgLlxuICovXG5cblxuZnVuY3Rpb24gdHdvbGluZTJzYXRyZWMobG9uZ3N0cjEsIGxvbmdzdHIyKSB7XG4gIHZhciBvcHNtb2RlID0gJ2knO1xuICB2YXIgeHBkb3RwID0gMTQ0MC4wIC8gKDIuMCAqIHBpKTsgLy8gMjI5LjE4MzExODA1MjMyOTM7XG5cbiAgdmFyIHllYXIgPSAwO1xuICB2YXIgc2F0cmVjID0ge307XG4gIHNhdHJlYy5lcnJvciA9IDA7XG4gIHNhdHJlYy5zYXRudW0gPSBsb25nc3RyMS5zdWJzdHJpbmcoMiwgNyk7XG4gIHNhdHJlYy5lcG9jaHlyID0gcGFyc2VJbnQobG9uZ3N0cjEuc3Vic3RyaW5nKDE4LCAyMCksIDEwKTtcbiAgc2F0cmVjLmVwb2NoZGF5cyA9IHBhcnNlRmxvYXQobG9uZ3N0cjEuc3Vic3RyaW5nKDIwLCAzMikpO1xuICBzYXRyZWMubmRvdCA9IHBhcnNlRmxvYXQobG9uZ3N0cjEuc3Vic3RyaW5nKDMzLCA0MykpO1xuICBzYXRyZWMubmRkb3QgPSBwYXJzZUZsb2F0KFwiLlwiLmNvbmNhdChwYXJzZUludChsb25nc3RyMS5zdWJzdHJpbmcoNDQsIDUwKSwgMTApLCBcIkVcIikuY29uY2F0KGxvbmdzdHIxLnN1YnN0cmluZyg1MCwgNTIpKSk7XG4gIHNhdHJlYy5ic3RhciA9IHBhcnNlRmxvYXQoXCJcIi5jb25jYXQobG9uZ3N0cjEuc3Vic3RyaW5nKDUzLCA1NCksIFwiLlwiKS5jb25jYXQocGFyc2VJbnQobG9uZ3N0cjEuc3Vic3RyaW5nKDU0LCA1OSksIDEwKSwgXCJFXCIpLmNvbmNhdChsb25nc3RyMS5zdWJzdHJpbmcoNTksIDYxKSkpOyAvLyBzYXRyZWMuc2F0bnVtID0gbG9uZ3N0cjIuc3Vic3RyaW5nKDIsIDcpO1xuXG4gIHNhdHJlYy5pbmNsbyA9IHBhcnNlRmxvYXQobG9uZ3N0cjIuc3Vic3RyaW5nKDgsIDE2KSk7XG4gIHNhdHJlYy5ub2RlbyA9IHBhcnNlRmxvYXQobG9uZ3N0cjIuc3Vic3RyaW5nKDE3LCAyNSkpO1xuICBzYXRyZWMuZWNjbyA9IHBhcnNlRmxvYXQoXCIuXCIuY29uY2F0KGxvbmdzdHIyLnN1YnN0cmluZygyNiwgMzMpKSk7XG4gIHNhdHJlYy5hcmdwbyA9IHBhcnNlRmxvYXQobG9uZ3N0cjIuc3Vic3RyaW5nKDM0LCA0MikpO1xuICBzYXRyZWMubW8gPSBwYXJzZUZsb2F0KGxvbmdzdHIyLnN1YnN0cmluZyg0MywgNTEpKTtcbiAgc2F0cmVjLm5vID0gcGFyc2VGbG9hdChsb25nc3RyMi5zdWJzdHJpbmcoNTIsIDYzKSk7IC8vIC0tLS0gZmluZCBubywgbmRvdCwgbmRkb3QgLS0tLVxuXG4gIHNhdHJlYy5ubyAvPSB4cGRvdHA7IC8vICAgcmFkL21pblxuICAvLyBzYXRyZWMubmRkb3Q9IHNhdHJlYy5uZGRvdCAqIE1hdGgucG93KDEwLjAsIG5leHApO1xuICAvLyBzYXRyZWMuYnN0YXI9IHNhdHJlYy5ic3RhciAqIE1hdGgucG93KDEwLjAsIGliZXhwKTtcbiAgLy8gLS0tLSBjb252ZXJ0IHRvIHNncDQgdW5pdHMgLS0tLVxuXG4gIHNhdHJlYy5hID0gTWF0aC5wb3coc2F0cmVjLm5vICogdHVtaW4sIC0yLjAgLyAzLjApO1xuICBzYXRyZWMubmRvdCAvPSB4cGRvdHAgKiAxNDQwLjA7IC8vID8gKiBtaW5wZXJkYXlcblxuICBzYXRyZWMubmRkb3QgLz0geHBkb3RwICogMTQ0MC4wICogMTQ0MDsgLy8gLS0tLSBmaW5kIHN0YW5kYXJkIG9yYml0YWwgZWxlbWVudHMgLS0tLVxuXG4gIHNhdHJlYy5pbmNsbyAqPSBkZWcycmFkO1xuICBzYXRyZWMubm9kZW8gKj0gZGVnMnJhZDtcbiAgc2F0cmVjLmFyZ3BvICo9IGRlZzJyYWQ7XG4gIHNhdHJlYy5tbyAqPSBkZWcycmFkO1xuICBzYXRyZWMuYWx0YSA9IHNhdHJlYy5hICogKDEuMCArIHNhdHJlYy5lY2NvKSAtIDEuMDtcbiAgc2F0cmVjLmFsdHAgPSBzYXRyZWMuYSAqICgxLjAgLSBzYXRyZWMuZWNjbykgLSAxLjA7IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gZmluZCBzZ3A0ZXBvY2ggdGltZSBvZiBlbGVtZW50IHNldFxuICAvLyByZW1lbWJlciB0aGF0IHNncDQgdXNlcyB1bml0cyBvZiBkYXlzIGZyb20gMCBqYW4gMTk1MCAoc2dwNGVwb2NoKVxuICAvLyBhbmQgbWludXRlcyBmcm9tIHRoZSBlcG9jaCAodGltZSlcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tIHRlbXAgZml4IGZvciB5ZWFycyBmcm9tIDE5NTctMjA1NiAtLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIC0tLS0tLS0tLSBjb3JyZWN0IGZpeCB3aWxsIG9jY3VyIHdoZW4geWVhciBpcyA0LWRpZ2l0IGluIHRsZSAtLS0tLS0tLS1cblxuICBpZiAoc2F0cmVjLmVwb2NoeXIgPCA1Nykge1xuICAgIHllYXIgPSBzYXRyZWMuZXBvY2h5ciArIDIwMDA7XG4gIH0gZWxzZSB7XG4gICAgeWVhciA9IHNhdHJlYy5lcG9jaHlyICsgMTkwMDtcbiAgfVxuXG4gIHZhciBtZGhtc1Jlc3VsdCA9IGRheXMybWRobXMoeWVhciwgc2F0cmVjLmVwb2NoZGF5cyk7XG4gIHZhciBtb24gPSBtZGhtc1Jlc3VsdC5tb24sXG4gICAgICBkYXkgPSBtZGhtc1Jlc3VsdC5kYXksXG4gICAgICBociA9IG1kaG1zUmVzdWx0LmhyLFxuICAgICAgbWludXRlID0gbWRobXNSZXN1bHQubWludXRlLFxuICAgICAgc2VjID0gbWRobXNSZXN1bHQuc2VjO1xuICBzYXRyZWMuamRzYXRlcG9jaCA9IGpkYXkoeWVhciwgbW9uLCBkYXksIGhyLCBtaW51dGUsIHNlYyk7IC8vICAtLS0tLS0tLS0tLS0tLS0tIGluaXRpYWxpemUgdGhlIG9yYml0IGF0IHNncDRlcG9jaCAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2dwNGluaXQoc2F0cmVjLCB7XG4gICAgb3BzbW9kZTogb3BzbW9kZSxcbiAgICBzYXRuOiBzYXRyZWMuc2F0bnVtLFxuICAgIGVwb2NoOiBzYXRyZWMuamRzYXRlcG9jaCAtIDI0MzMyODEuNSxcbiAgICB4YnN0YXI6IHNhdHJlYy5ic3RhcixcbiAgICB4ZWNjbzogc2F0cmVjLmVjY28sXG4gICAgeGFyZ3BvOiBzYXRyZWMuYXJncG8sXG4gICAgeGluY2xvOiBzYXRyZWMuaW5jbG8sXG4gICAgeG1vOiBzYXRyZWMubW8sXG4gICAgeG5vOiBzYXRyZWMubm8sXG4gICAgeG5vZGVvOiBzYXRyZWMubm9kZW9cbiAgfSk7XG4gIHJldHVybiBzYXRyZWM7XG59XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHtcbiAgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTtcbn1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkoYXJyKTtcbn1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoaXRlcikpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpO1xufVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7XG4gIGlmICghbykgcmV0dXJuO1xuICBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG59XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICByZXR1cm4gYXJyMjtcbn1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn1cblxuZnVuY3Rpb24gcHJvcGFnYXRlKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9IC8vIFJldHVybiBhIHBvc2l0aW9uIGFuZCB2ZWxvY2l0eSB2ZWN0b3IgZm9yIGEgZ2l2ZW4gZGF0ZSBhbmQgdGltZS5cblxuXG4gIHZhciBzYXRyZWMgPSBhcmdzWzBdO1xuICB2YXIgZGF0ZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDEpO1xuICB2YXIgaiA9IGpkYXkuYXBwbHkodm9pZCAwLCBfdG9Db25zdW1hYmxlQXJyYXkoZGF0ZSkpO1xuICB2YXIgbSA9IChqIC0gc2F0cmVjLmpkc2F0ZXBvY2gpICogbWludXRlc1BlckRheTtcbiAgcmV0dXJuIHNncDQoc2F0cmVjLCBtKTtcbn1cblxuZnVuY3Rpb24gZG9wcGxlckZhY3Rvcihsb2NhdGlvbiwgcG9zaXRpb24sIHZlbG9jaXR5KSB7XG4gIHZhciBtZmFjdG9yID0gNy4yOTIxMTVFLTU7XG4gIHZhciBjID0gMjk5NzkyLjQ1ODsgLy8gU3BlZWQgb2YgbGlnaHQgaW4ga20vc1xuXG4gIHZhciByYW5nZSA9IHtcbiAgICB4OiBwb3NpdGlvbi54IC0gbG9jYXRpb24ueCxcbiAgICB5OiBwb3NpdGlvbi55IC0gbG9jYXRpb24ueSxcbiAgICB6OiBwb3NpdGlvbi56IC0gbG9jYXRpb24uelxuICB9O1xuICByYW5nZS53ID0gTWF0aC5zcXJ0KE1hdGgucG93KHJhbmdlLngsIDIpICsgTWF0aC5wb3cocmFuZ2UueSwgMikgKyBNYXRoLnBvdyhyYW5nZS56LCAyKSk7XG4gIHZhciByYW5nZVZlbCA9IHtcbiAgICB4OiB2ZWxvY2l0eS54ICsgbWZhY3RvciAqIGxvY2F0aW9uLnksXG4gICAgeTogdmVsb2NpdHkueSAtIG1mYWN0b3IgKiBsb2NhdGlvbi54LFxuICAgIHo6IHZlbG9jaXR5LnpcbiAgfTtcblxuICBmdW5jdGlvbiBzaWduKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID49IDAgPyAxIDogLTE7XG4gIH1cblxuICB2YXIgcmFuZ2VSYXRlID0gKHJhbmdlLnggKiByYW5nZVZlbC54ICsgcmFuZ2UueSAqIHJhbmdlVmVsLnkgKyByYW5nZS56ICogcmFuZ2VWZWwueikgLyByYW5nZS53O1xuICByZXR1cm4gMSArIHJhbmdlUmF0ZSAvIGMgKiBzaWduKHJhbmdlUmF0ZSk7XG59XG5cbmZ1bmN0aW9uIHJhZGlhbnNUb0RlZ3JlZXMocmFkaWFucykge1xuICByZXR1cm4gcmFkaWFucyAqIHJhZDJkZWc7XG59XG5cbmZ1bmN0aW9uIGRlZ3JlZXNUb1JhZGlhbnMoZGVncmVlcykge1xuICByZXR1cm4gZGVncmVlcyAqIGRlZzJyYWQ7XG59XG5cbmZ1bmN0aW9uIGRlZ3JlZXNMYXQocmFkaWFucykge1xuICBpZiAocmFkaWFucyA8IC1waSAvIDIgfHwgcmFkaWFucyA+IHBpIC8gMikge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdMYXRpdHVkZSByYWRpYW5zIG11c3QgYmUgaW4gcmFuZ2UgWy1waS8yOyBwaS8yXS4nKTtcbiAgfVxuXG4gIHJldHVybiByYWRpYW5zVG9EZWdyZWVzKHJhZGlhbnMpO1xufVxuXG5mdW5jdGlvbiBkZWdyZWVzTG9uZyhyYWRpYW5zKSB7XG4gIGlmIChyYWRpYW5zIDwgLXBpIHx8IHJhZGlhbnMgPiBwaSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdMb25naXR1ZGUgcmFkaWFucyBtdXN0IGJlIGluIHJhbmdlIFstcGk7IHBpXS4nKTtcbiAgfVxuXG4gIHJldHVybiByYWRpYW5zVG9EZWdyZWVzKHJhZGlhbnMpO1xufVxuXG5mdW5jdGlvbiByYWRpYW5zTGF0KGRlZ3JlZXMpIHtcbiAgaWYgKGRlZ3JlZXMgPCAtOTAgfHwgZGVncmVlcyA+IDkwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0xhdGl0dWRlIGRlZ3JlZXMgbXVzdCBiZSBpbiByYW5nZSBbLTkwOyA5MF0uJyk7XG4gIH1cblxuICByZXR1cm4gZGVncmVlc1RvUmFkaWFucyhkZWdyZWVzKTtcbn1cblxuZnVuY3Rpb24gcmFkaWFuc0xvbmcoZGVncmVlcykge1xuICBpZiAoZGVncmVlcyA8IC0xODAgfHwgZGVncmVlcyA+IDE4MCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdMb25naXR1ZGUgZGVncmVlcyBtdXN0IGJlIGluIHJhbmdlIFstMTgwOyAxODBdLicpO1xuICB9XG5cbiAgcmV0dXJuIGRlZ3JlZXNUb1JhZGlhbnMoZGVncmVlcyk7XG59XG5cbmZ1bmN0aW9uIGdlb2RldGljVG9FY2YoZ2VvZGV0aWMpIHtcbiAgdmFyIGxvbmdpdHVkZSA9IGdlb2RldGljLmxvbmdpdHVkZSxcbiAgICAgIGxhdGl0dWRlID0gZ2VvZGV0aWMubGF0aXR1ZGUsXG4gICAgICBoZWlnaHQgPSBnZW9kZXRpYy5oZWlnaHQ7XG4gIHZhciBhID0gNjM3OC4xMzc7XG4gIHZhciBiID0gNjM1Ni43NTIzMTQyO1xuICB2YXIgZiA9IChhIC0gYikgLyBhO1xuICB2YXIgZTIgPSAyICogZiAtIGYgKiBmO1xuICB2YXIgbm9ybWFsID0gYSAvIE1hdGguc3FydCgxIC0gZTIgKiAoTWF0aC5zaW4obGF0aXR1ZGUpICogTWF0aC5zaW4obGF0aXR1ZGUpKSk7XG4gIHZhciB4ID0gKG5vcm1hbCArIGhlaWdodCkgKiBNYXRoLmNvcyhsYXRpdHVkZSkgKiBNYXRoLmNvcyhsb25naXR1ZGUpO1xuICB2YXIgeSA9IChub3JtYWwgKyBoZWlnaHQpICogTWF0aC5jb3MobGF0aXR1ZGUpICogTWF0aC5zaW4obG9uZ2l0dWRlKTtcbiAgdmFyIHogPSAobm9ybWFsICogKDEgLSBlMikgKyBoZWlnaHQpICogTWF0aC5zaW4obGF0aXR1ZGUpO1xuICByZXR1cm4ge1xuICAgIHg6IHgsXG4gICAgeTogeSxcbiAgICB6OiB6XG4gIH07XG59XG5cbmZ1bmN0aW9uIGVjaVRvR2VvZGV0aWMoZWNpLCBnbXN0KSB7XG4gIC8vIGh0dHA6Ly93d3cuY2VsZXN0cmFrLmNvbS9jb2x1bW5zL3YwMm4wMy9cbiAgdmFyIGEgPSA2Mzc4LjEzNztcbiAgdmFyIGIgPSA2MzU2Ljc1MjMxNDI7XG4gIHZhciBSID0gTWF0aC5zcXJ0KGVjaS54ICogZWNpLnggKyBlY2kueSAqIGVjaS55KTtcbiAgdmFyIGYgPSAoYSAtIGIpIC8gYTtcbiAgdmFyIGUyID0gMiAqIGYgLSBmICogZjtcbiAgdmFyIGxvbmdpdHVkZSA9IE1hdGguYXRhbjIoZWNpLnksIGVjaS54KSAtIGdtc3Q7XG5cbiAgd2hpbGUgKGxvbmdpdHVkZSA8IC1waSkge1xuICAgIGxvbmdpdHVkZSArPSB0d29QaTtcbiAgfVxuXG4gIHdoaWxlIChsb25naXR1ZGUgPiBwaSkge1xuICAgIGxvbmdpdHVkZSAtPSB0d29QaTtcbiAgfVxuXG4gIHZhciBrbWF4ID0gMjA7XG4gIHZhciBrID0gMDtcbiAgdmFyIGxhdGl0dWRlID0gTWF0aC5hdGFuMihlY2kueiwgTWF0aC5zcXJ0KGVjaS54ICogZWNpLnggKyBlY2kueSAqIGVjaS55KSk7XG4gIHZhciBDO1xuXG4gIHdoaWxlIChrIDwga21heCkge1xuICAgIEMgPSAxIC8gTWF0aC5zcXJ0KDEgLSBlMiAqIChNYXRoLnNpbihsYXRpdHVkZSkgKiBNYXRoLnNpbihsYXRpdHVkZSkpKTtcbiAgICBsYXRpdHVkZSA9IE1hdGguYXRhbjIoZWNpLnogKyBhICogQyAqIGUyICogTWF0aC5zaW4obGF0aXR1ZGUpLCBSKTtcbiAgICBrICs9IDE7XG4gIH1cblxuICB2YXIgaGVpZ2h0ID0gUiAvIE1hdGguY29zKGxhdGl0dWRlKSAtIGEgKiBDO1xuICByZXR1cm4ge1xuICAgIGxvbmdpdHVkZTogbG9uZ2l0dWRlLFxuICAgIGxhdGl0dWRlOiBsYXRpdHVkZSxcbiAgICBoZWlnaHQ6IGhlaWdodFxuICB9O1xufVxuXG5mdW5jdGlvbiBlY2ZUb0VjaShlY2YsIGdtc3QpIHtcbiAgLy8gY2Nhci5jb2xvcmFkby5lZHUvQVNFTjUwNzAvaGFuZG91dHMvY29vcmRzeXMuZG9jXG4gIC8vXG4gIC8vIFtYXSAgICAgW0MgLVMgIDBdW1hdXG4gIC8vIFtZXSAgPSAgW1MgIEMgIDBdW1ldXG4gIC8vIFtaXWVjaSAgWzAgIDAgIDFdW1pdZWNmXG4gIC8vXG4gIHZhciBYID0gZWNmLnggKiBNYXRoLmNvcyhnbXN0KSAtIGVjZi55ICogTWF0aC5zaW4oZ21zdCk7XG4gIHZhciBZID0gZWNmLnggKiBNYXRoLnNpbihnbXN0KSArIGVjZi55ICogTWF0aC5jb3MoZ21zdCk7XG4gIHZhciBaID0gZWNmLno7XG4gIHJldHVybiB7XG4gICAgeDogWCxcbiAgICB5OiBZLFxuICAgIHo6IFpcbiAgfTtcbn1cblxuZnVuY3Rpb24gZWNpVG9FY2YoZWNpLCBnbXN0KSB7XG4gIC8vIGNjYXIuY29sb3JhZG8uZWR1L0FTRU41MDcwL2hhbmRvdXRzL2Nvb3Jkc3lzLmRvY1xuICAvL1xuICAvLyBbWF0gICAgIFtDIC1TICAwXVtYXVxuICAvLyBbWV0gID0gIFtTICBDICAwXVtZXVxuICAvLyBbWl1lY2kgIFswICAwICAxXVtaXWVjZlxuICAvL1xuICAvL1xuICAvLyBJbnZlcnNlOlxuICAvLyBbWF0gICAgIFtDICBTICAwXVtYXVxuICAvLyBbWV0gID0gIFstUyBDICAwXVtZXVxuICAvLyBbWl1lY2YgIFswICAwICAxXVtaXWVjaVxuICB2YXIgeCA9IGVjaS54ICogTWF0aC5jb3MoZ21zdCkgKyBlY2kueSAqIE1hdGguc2luKGdtc3QpO1xuICB2YXIgeSA9IGVjaS54ICogLU1hdGguc2luKGdtc3QpICsgZWNpLnkgKiBNYXRoLmNvcyhnbXN0KTtcbiAgdmFyIHogPSBlY2kuejtcbiAgcmV0dXJuIHtcbiAgICB4OiB4LFxuICAgIHk6IHksXG4gICAgejogelxuICB9O1xufVxuXG5mdW5jdGlvbiB0b3BvY2VudHJpYyhvYnNlcnZlckdlb2RldGljLCBzYXRlbGxpdGVFY2YpIHtcbiAgLy8gaHR0cDovL3d3dy5jZWxlc3RyYWsuY29tL2NvbHVtbnMvdjAybjAyL1xuICAvLyBUUyBLZWxzbydzIG1ldGhvZCwgZXhjZXB0IEknbSB1c2luZyBFQ0YgZnJhbWVcbiAgLy8gYW5kIGhlIHVzZXMgRUNJLlxuICB2YXIgbG9uZ2l0dWRlID0gb2JzZXJ2ZXJHZW9kZXRpYy5sb25naXR1ZGUsXG4gICAgICBsYXRpdHVkZSA9IG9ic2VydmVyR2VvZGV0aWMubGF0aXR1ZGU7XG4gIHZhciBvYnNlcnZlckVjZiA9IGdlb2RldGljVG9FY2Yob2JzZXJ2ZXJHZW9kZXRpYyk7XG4gIHZhciByeCA9IHNhdGVsbGl0ZUVjZi54IC0gb2JzZXJ2ZXJFY2YueDtcbiAgdmFyIHJ5ID0gc2F0ZWxsaXRlRWNmLnkgLSBvYnNlcnZlckVjZi55O1xuICB2YXIgcnogPSBzYXRlbGxpdGVFY2YueiAtIG9ic2VydmVyRWNmLno7XG4gIHZhciB0b3BTID0gTWF0aC5zaW4obGF0aXR1ZGUpICogTWF0aC5jb3MobG9uZ2l0dWRlKSAqIHJ4ICsgTWF0aC5zaW4obGF0aXR1ZGUpICogTWF0aC5zaW4obG9uZ2l0dWRlKSAqIHJ5IC0gTWF0aC5jb3MobGF0aXR1ZGUpICogcno7XG4gIHZhciB0b3BFID0gLU1hdGguc2luKGxvbmdpdHVkZSkgKiByeCArIE1hdGguY29zKGxvbmdpdHVkZSkgKiByeTtcbiAgdmFyIHRvcFogPSBNYXRoLmNvcyhsYXRpdHVkZSkgKiBNYXRoLmNvcyhsb25naXR1ZGUpICogcnggKyBNYXRoLmNvcyhsYXRpdHVkZSkgKiBNYXRoLnNpbihsb25naXR1ZGUpICogcnkgKyBNYXRoLnNpbihsYXRpdHVkZSkgKiByejtcbiAgcmV0dXJuIHtcbiAgICB0b3BTOiB0b3BTLFxuICAgIHRvcEU6IHRvcEUsXG4gICAgdG9wWjogdG9wWlxuICB9O1xufVxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gdGNcbiAqIEBwYXJhbSB7TnVtYmVyfSB0Yy50b3BTIFBvc2l0aXZlIGhvcml6b250YWwgdmVjdG9yIFMgZHVlIHNvdXRoLlxuICogQHBhcmFtIHtOdW1iZXJ9IHRjLnRvcEUgUG9zaXRpdmUgaG9yaXpvbnRhbCB2ZWN0b3IgRSBkdWUgZWFzdC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB0Yy50b3BaIFZlY3RvciBaIG5vcm1hbCB0byB0aGUgc3VyZmFjZSBvZiB0aGUgZWFydGggKHVwKS5cbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cblxuXG5mdW5jdGlvbiB0b3BvY2VudHJpY1RvTG9va0FuZ2xlcyh0Yykge1xuICB2YXIgdG9wUyA9IHRjLnRvcFMsXG4gICAgICB0b3BFID0gdGMudG9wRSxcbiAgICAgIHRvcFogPSB0Yy50b3BaO1xuICB2YXIgcmFuZ2VTYXQgPSBNYXRoLnNxcnQodG9wUyAqIHRvcFMgKyB0b3BFICogdG9wRSArIHRvcFogKiB0b3BaKTtcbiAgdmFyIEVsID0gTWF0aC5hc2luKHRvcFogLyByYW5nZVNhdCk7XG4gIHZhciBBeiA9IE1hdGguYXRhbjIoLXRvcEUsIHRvcFMpICsgcGk7XG4gIHJldHVybiB7XG4gICAgYXppbXV0aDogQXosXG4gICAgZWxldmF0aW9uOiBFbCxcbiAgICByYW5nZVNhdDogcmFuZ2VTYXQgLy8gUmFuZ2UgaW4ga21cblxuICB9O1xufVxuXG5mdW5jdGlvbiBlY2ZUb0xvb2tBbmdsZXMob2JzZXJ2ZXJHZW9kZXRpYywgc2F0ZWxsaXRlRWNmKSB7XG4gIHZhciB0b3BvY2VudHJpY0Nvb3JkcyA9IHRvcG9jZW50cmljKG9ic2VydmVyR2VvZGV0aWMsIHNhdGVsbGl0ZUVjZik7XG4gIHJldHVybiB0b3BvY2VudHJpY1RvTG9va0FuZ2xlcyh0b3BvY2VudHJpY0Nvb3Jkcyk7XG59XG5cbmV4cG9ydCB7IGNvbnN0YW50cywgZGVncmVlc0xhdCwgZGVncmVlc0xvbmcsIGRlZ3JlZXNUb1JhZGlhbnMsIGRvcHBsZXJGYWN0b3IsIGVjZlRvRWNpLCBlY2ZUb0xvb2tBbmdsZXMsIGVjaVRvRWNmLCBlY2lUb0dlb2RldGljLCBnZW9kZXRpY1RvRWNmLCBnc3RpbWUsIGludmpkYXksIGpkYXksIHByb3BhZ2F0ZSwgcmFkaWFuc0xhdCwgcmFkaWFuc0xvbmcsIHJhZGlhbnNUb0RlZ3JlZXMsIHNncDQsIHR3b2xpbmUyc2F0cmVjIH07IiwiLy8gY29uc3QgaW5pdCA9IHtcbi8vICAgbWV0aG9kOiBcIkdFVFwiLFxuLy8gICBoZWFkZXJzOiBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiLFxuLy8gICBtb2RlOiBcImNvcnNcIixcbi8vICAgY2FjaGU6IFwiZGVmYXVsdFwiLFxuLy8gfTtcblxuY29uc3QgYXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG5cbmxldCBpc2JuID0gXCIwMjAxNTU4MDI1XCI7XG5cbmNvbnN0IHJlY2VpdmVEYXRhID0gYXhpb3NcbiAgLmdldChgL3NhdGVsbGl0ZXMvYWN0aXZlYClcbiAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSlcbiAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfSk7XG5cbmV4cG9ydCBkZWZhdWx0IHJlY2VpdmVEYXRhO1xuIiwiY29uc3QgaGFuZGxlUGxheSA9IChhdWRpb0NvbnRleHQpID0+IHtcbiAgLy8gZGVidWdnZXI7XG4gIGNvbnN0IGF1ZGlvQ3R4ID0gYXVkaW9Db250ZXh0O1xuICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlfcGF1c2VcIik7XG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgIFwiY2xpY2tcIixcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImNsaWNrZWRcIik7XG4gICAgICBpZiAoYXVkaW9DdHguc3RhdGUgPT09IFwic3VzcGVuZGVkXCIpIHtcbiAgICAgICAgYXVkaW9DdHgucmVzdW1lKCk7XG4gICAgICAgIHZhciBvc2NpbGxhdG9yID0gYXVkaW9DdHguY3JlYXRlT3NjaWxsYXRvcigpO1xuXG4gICAgICAgIG9zY2lsbGF0b3IudHlwZSA9IFwic3F1YXJlXCI7XG4gICAgICAgIG9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gNDQwOyAvLyB2YWx1ZSBpbiBoZXJ0elxuICAgICAgICBvc2NpbGxhdG9yLnN0YXJ0KDApO1xuICAgICAgICAvLyBvc2NpbGxhdG9yLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuICAgICAgICAvLyBkZWJ1Z2dlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF1ZGlvQ3R4LnN1c3BlbmQoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGZhbHNlXG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVQbGF5O1xuIiwiaW1wb3J0IFNhdGVsbGl0ZSBmcm9tIFwiLi9zYXRlbGxpdGUuanNcIjtcbmltcG9ydCBTdGFyIGZyb20gXCIuL3N0YXIuanNcIjtcbmltcG9ydCB7IHNncDQgfSBmcm9tIFwic2F0ZWxsaXRlLmpzXCI7XG5jbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IoeERpbSwgeURpbSwgdGxlLCBhdWRpb0N0eCkge1xuICAgIHRoaXMueERpbSA9IHhEaW07XG4gICAgdGhpcy55RGltID0geURpbTtcbiAgICB0aGlzLnNhdGVsbGl0ZXMgPSBbXTtcbiAgICB0aGlzLnN0YXJzID0gW107XG4gICAgdGhpcy50bGUgPSB0bGU7XG4gICAgdGhpcy5hdWRpb0N0eCA9IGF1ZGlvQ3R4O1xuICAgIHRoaXMuYWRkU2F0ZWxsaXRlcyh0bGUpO1xuICAgIHRoaXMuYWRkU3RhcnMoKTtcbiAgfVxuXG4gIHJhbmRvbVBvcygpIHtcbiAgICByZXR1cm4gW1xuICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy54RGltKSxcbiAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMueURpbSksXG4gICAgXTtcbiAgfVxuICBhZGRTdGFycygpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE3MDA7IGkrKykge1xuICAgICAgbGV0IGN1cnJlbnRTdGFyID0gbmV3IFN0YXIodGhpcy5yYW5kb21Qb3MoKSwgdGhpcyk7XG4gICAgICB0aGlzLnN0YXJzLnB1c2goY3VycmVudFN0YXIpO1xuICAgIH1cbiAgfVxuICBhZGRTYXRlbGxpdGVzKHRsZSkge1xuICAgIGNvbnN0IHNhdHJlYyA9IHNhdGVsbGl0ZS50d29saW5lMnNhdHJlYyhcbiAgICAgIHRoaXMudGxlLnNwbGl0KFwiXFxuXCIpWzBdLnRyaW0oKSxcbiAgICAgIHRoaXMudGxlLnNwbGl0KFwiXFxuXCIpWzFdLnRyaW0oKVxuICAgICk7XG4gICAgLy8gZGVidWdnZXI7XG5cbiAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgLy8gICAvLyBkZWJ1Z2dlcjtcbiAgICAvLyAgIGNvbnNvbGUubG9nKHNhdGVsbGl0ZXNPYmpbaV0pO1xuICAgIGxldCBjdXJyZW50U2F0ZWxsaXRlID0gbmV3IFNhdGVsbGl0ZShzYXRyZWMsIHRoaXMpO1xuICAgIHRoaXMuc2F0ZWxsaXRlcy5wdXNoKGN1cnJlbnRTYXRlbGxpdGUpO1xuICAgIC8vIH1cbiAgfVxuXG4gIGRyYXcoY3R4KSB7XG4gICAgLy8gY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnhEaW0sIHRoaXMueURpbSk7XG4gICAgLy8gY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAvLyBjdHguZmlsbFJlY3QoMCwgMCwgdGhpcy54RGltLCB0aGlzLnlEaW0pO1xuICAgIC8vIHRoaXMuc3RhcnMuZm9yRWFjaCgoc3RhcikgPT4gc3Rhci5kcmF3KGN0eCkpO1xuICAgIC8vIHRoaXMuc2F0ZWxsaXRlcy5mb3JFYWNoKChzYXRlbGxpdGUpID0+IHNhdGVsbGl0ZS5kcmF3KGN0eCkpO1xuICB9XG5cbiAgbW92ZShjdHgpIHtcbiAgICAvLyB0aGlzLnNhdGVsbGl0ZXMuZm9yRWFjaCgoc2F0ZWxsaXRlKSA9PiBzYXRlbGxpdGUubW92ZShjdHgpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vZ2FtZVwiO1xuLy8gaW1wb3J0IHsgc2NlbmUsIGNhbWVyYSwgcmVuZGVyZXIgfSBmcm9tIFwiLi90aHJlZS90aHJlZV9tYXBcIjtcbmNsYXNzIEdhbWVWaWV3IHtcbiAgY29uc3RydWN0b3IodGxlKSB7XG4gICAgdGhpcy50bGUgPSB0bGU7XG4gICAgdGhpcy5zYXRSZWNzID0gW107XG4gICAgdGhpcy5hZGRTYXRlbGl0ZXMoKTtcbiAgICB0aGlzLmRhdGUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxuXG4gIGFkZFNhdGVsaXRlcygpIHtcbiAgICBjb25zdCBzYXRyZWMgPSBzYXRlbGxpdGUudHdvbGluZTJzYXRyZWMoXG4gICAgICB0aGlzLnRsZS5zcGxpdChcIlxcblwiKVswXS50cmltKCksXG4gICAgICB0aGlzLnRsZS5zcGxpdChcIlxcblwiKVsxXS50cmltKClcbiAgICApO1xuXG4gICAgLy8gbGV0IGN1cnJlbnRTYXRlbGxpdGUgPSBuZXcgU2F0ZWxsaXRlKHNhdHJlYywgdGhpcyk7XG4gICAgdGhpcy5zYXRSZWNzLnB1c2goc2F0cmVjKTtcbiAgICBkZWJ1Z2dlcjtcbiAgfVxuXG4gIHNhdGVsbGl0ZVZlY3RvciA9IChzYXRyZWMsIGRhdGUpID0+IHtcbiAgICBkZWJ1Z2dlcjtcbiAgICBjb25zdCB4eXogPSB0aGlzLnNhdHJlY1RvWFlaKHNhdHJlYywgZGF0ZSk7XG4gICAgY29uc3QgbGFtYmRhID0geHl6WzBdO1xuICAgIGNvbnN0IHBoaSA9IHh5elsxXTtcbiAgICBjb25zdCBjb3NQaGkgPSBNYXRoLmNvcyhwaGkpO1xuICAgIGNvbnN0IHIgPSAoKHh5elsyXSArIDYzNzEpIC8gNjM3MSkgKiAyMjg7XG4gICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKFxuICAgICAgciAqIGNvc1BoaSAqIE1hdGguY29zKGxhbWJkYSksXG4gICAgICByICogY29zUGhpICogTWF0aC5zaW4obGFtYmRhKSxcbiAgICAgIHIgKiBNYXRoLnNpbihwaGkpXG4gICAgKTtcbiAgfTtcbiAgc2F0cmVjVG9YWVogPSAoc2F0cmVjLCBkYXRlKSA9PiB7XG4gICAgdmFyIHBvc2l0aW9uQW5kVmVsb2NpdHkgPSBzYXRlbGxpdGUucHJvcGFnYXRlKHNhdHJlYywgZGF0ZSk7XG4gICAgdmFyIGdtc3QgPSBzYXRlbGxpdGUuZ3N0aW1lKGRhdGUpO1xuICAgIHZhciBwb3NpdGlvbkdkID0gc2F0ZWxsaXRlLmVjaVRvR2VvZGV0aWMoXG4gICAgICBwb3NpdGlvbkFuZFZlbG9jaXR5LnBvc2l0aW9uLFxuICAgICAgZ21zdFxuICAgICk7XG4gICAgcmV0dXJuIFtwb3NpdGlvbkdkLmxvbmdpdHVkZSwgcG9zaXRpb25HZC5sYXRpdHVkZSwgcG9zaXRpb25HZC5oZWlnaHRdO1xuICB9O1xuXG4gIHN0YXJ0KCkge1xuICAgIGNvbnN0IHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgICAgNzUsXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgIDAuMSxcbiAgICAgIDEwMDBcbiAgICApO1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGNhbnZhc0VsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xuICAgIC8vIGRlYnVnZ2VyO1xuICAgIGNvbnNvbGUubG9nKGNhbnZhc0VsZSk7XG4gICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICBhbnRpYWxpYXM6IHRydWUsXG4gICAgICBjYW52YXM6IGNhbnZhc0VsZSxcbiAgICB9KTtcbiAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIHJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHgwMGZmZjAsIDApOyAvLyBzZXRzIGJhY2tncm91bmQgdG8gY2xlYXIgY29sb3JcbiAgICAvLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgLy8gY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoKTtcbiAgICAvLyBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweGZmMDBmMCB9KTtcbiAgICAvLyBjb25zdCBjdWJlID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAvLyBzY2VuZS5hZGQoY3ViZSk7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgxMDAsIDMyLCAzMik7XG4gICAgY29uc3Qgd2lyZWZyYW1lID0gbmV3IFRIUkVFLldpcmVmcmFtZUdlb21ldHJ5KGdlb21ldHJ5KTtcblxuICAgIGNvbnN0IGxpbmUgPSBuZXcgVEhSRUUuTGluZVNlZ21lbnRzKHdpcmVmcmFtZSk7XG4gICAgbGluZS5tYXRlcmlhbC5kZXB0aFRlc3QgPSBmYWxzZTtcbiAgICAvLyBsaW5lLm1hdGVyaWFsLmxpbmUubWF0ZXJpYWwub3BhY2l0eSA9IDAuMjU7XG4gICAgbGluZS5tYXRlcmlhbC50cmFuc3BhcmVudCA9IHRydWU7XG4gICAgc2NlbmUuYWRkKGxpbmUpO1xuICAgIGNvbnN0IHNhdEdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG4gICAgLy8gY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGFjdGl2ZUNsb2NrLmRhdGUoKSk7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5zYXRSZWNzKTtcbiAgICBjb25zdCBzYXRlbGxpdGVWZWN0b3JGdW5jID0gdGhpcy5zYXRlbGxpdGVWZWN0b3I7XG4gICAgc2F0R2VvbWV0cnkudmVydGljZXMgPSB0aGlzLnNhdFJlY3MubWFwKChzYXRyZWMpID0+IHtcbiAgICAgIHJldHVybiBzYXRlbGxpdGVWZWN0b3JGdW5jKHNhdHJlYywgZGF0ZSk7XG4gICAgfSk7XG4gICAgY29uc3Qgc2F0ZWxsaXRlcyA9IG5ldyBUSFJFRS5Qb2ludHMoXG4gICAgICBzYXRHZW9tZXRyeSxcbiAgICAgIG5ldyBUSFJFRS5Qb2ludHNNYXRlcmlhbCh7IGNvbG9yOiBcInBpbmtcIiwgc2l6ZTogMTAwIH0pXG4gICAgKTtcbiAgICBzY2VuZS5hZGQoc2F0ZWxsaXRlcyk7XG5cbiAgICAvLyBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweGZmZmYwMCB9KTtcbiAgICAvLyBjb25zdCBzcGhlcmUgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgIC8vIHNjZW5lLmFkZChzcGhlcmUpO1xuICAgIGNvbnN0IHNhdFJlY3MgPSB0aGlzLnNhdFJlY3M7XG5cbiAgICBjYW1lcmEucG9zaXRpb24ueiA9IDEwMDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnggPSAtMjAwO1xuICAgIGNhbWVyYS5wb3NpdGlvbi55ID0gNTAwO1xuXG4gICAgY29uc3QgYW5pbWF0ZSA9ICgpID0+IHtcbiAgICAgIC8vIGdhbWUuZHJhdyhjdHgpO1xuICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gICAgICAvLyBjdWJlLnJvdGF0aW9uLnggKz0gMC4wMTtcbiAgICAgIGxpbmUucm90YXRpb24ueSArPSAwLjAwMTtcbiAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgZGVidWdnZXI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNhdFJlY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICAgIHNhdGVsbGl0ZXMuZ2VvbWV0cnkudmVydGljZXNbaV0gPSBzYXRlbGxpdGVWZWN0b3JGdW5jKHNhdFJlY3NbaV0sIGRhdGUpO1xuICAgICAgfVxuICAgICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgIH07XG5cbiAgICBhbmltYXRlKCk7XG4gICAgLy8gICAgIG91dGVyLmdhbWUueERpbSA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIC8vICAgICBvdXRlci5nYW1lLnlEaW0gPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgLy8gICB9LCAxMDAwKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lVmlldztcbiIsImNvbnN0IG1hcF9yYW5nZSA9ICh2YWx1ZSwgbG93MSwgaGlnaDEsIGxvdzIsIGhpZ2gyKSA9PiB7XG4gIHJldHVybiBsb3cyICsgKChoaWdoMiAtIGxvdzIpICogKHZhbHVlIC0gbG93MSkpIC8gKGhpZ2gxIC0gbG93MSk7XG59O1xuXG5jb25zdCByYWRpYW5zVG9EZWdyZWVzID0gKHJhZGlhbnMpID0+IHtcbiAgcmV0dXJuIChyYWRpYW5zICogMTgwKSAvIE1hdGguUEk7XG59O1xuXG5jb25zdCBkZWdyZWVzVG9SYWRpYW5zID0gKGRlZ3JlZXMpID0+IHtcbiAgcmV0dXJuIGRlZ3JlZXMgKiAoTWF0aC5QSSAvIDE4MCk7XG59O1xuZXhwb3J0IGRlZmF1bHQgbWFwX3JhbmdlO1xuIiwiaW1wb3J0IG1hcF9yYW5nZSBmcm9tIFwiLi9tYXRoX3V0aWxcIjtcbmNsYXNzIFNhdGVsbGl0ZSB7XG4gIGNvbnN0cnVjdG9yKHNhdFJlYywgZ2FtZSkge1xuICAgIHRoaXMuZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdGhpcy5wb3NpdGlvbkFuZFZlbG9jaXR5ID0gc2F0ZWxsaXRlLnByb3BhZ2F0ZShzYXRSZWMsIHRoaXMuZGF0ZSk7XG4gICAgdGhpcy5nbXN0ID0gc2F0ZWxsaXRlLmdzdGltZSh0aGlzLmRhdGUpO1xuXG4gICAgdGhpcy5wb3NpdGlvbiA9IHNhdGVsbGl0ZS5lY2lUb0dlb2RldGljKFxuICAgICAgdGhpcy5wb3NpdGlvbkFuZFZlbG9jaXR5LnBvc2l0aW9uLFxuICAgICAgdGhpcy5nbXN0XG4gICAgKTtcblxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgdGhpcy5hdWRpb0N0eCA9IGdhbWUuYXVkaW9DdHg7XG5cbiAgICBjb25zb2xlLmxvZyh0aGlzLnBvc2l0aW9uLmxvbmdpdHVkZSk7IC8vIGluIHJhZGlhbnNcbiAgICBjb25zb2xlLmxvZyh0aGlzLnBvc2l0aW9uLmxhdGl0dWRlKTsgLy8gaW4gcmFkaWFuc1xuICAgIGNvbnNvbGUubG9nKHRoaXMucG9zaXRpb24uaGVpZ2h0KTsgLy8gaW4ga21cbiAgfVxuXG4gIHN0YXJ0T3NjKCkge1xuICAgIHRoaXMub3NjaWxsYXRvci50eXBlID0gXCJzaW5lXCI7XG4gICAgZGVidWdnZXI7XG4gICAgY29uc3QgbmV3RnJlcSA9IG1hcF9yYW5nZSh0aGlzLnBvc1sxXSwgMCwgdGhpcy5nYW1lLnlEaW0sIDAsIDIwMDAwKTtcbiAgICBjb25zb2xlLmxvZyhuZXdGcmVxKTtcbiAgICB0aGlzLm9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gbmV3RnJlcTtcbiAgICAvLyBkZWJ1Z2dlcjtcbiAgICBjb25zdCBnYWluTm9kZSA9IHRoaXMuYXVkaW9DdHguY3JlYXRlR2FpbigpO1xuICAgIGdhaW5Ob2RlLmdhaW4udmFsdWUgPSAwLjAwMTsgLy8gMTAgJVxuICAgIGdhaW5Ob2RlLmNvbm5lY3QodGhpcy5hdWRpb0N0eC5kZXN0aW5hdGlvbik7XG5cbiAgICAvLyBub3cgaW5zdGVhZCBvZiBjb25uZWN0aW5nIHRvIGFDdHguZGVzdGluYXRpb24sIGNvbm5lY3QgdG8gdGhlIGdhaW5Ob2RlXG4gICAgdGhpcy5vc2NpbGxhdG9yLmNvbm5lY3QoZ2Fpbk5vZGUpO1xuICAgIC8vIHRoaXMub3NjaWxsYXRvci5jb25uZWN0KHRoaXMuYXVkaW9DdHguZGVzdGluYXRpb24pO1xuICAgIHRoaXMub3NjaWxsYXRvci5zdGFydCgwKTtcbiAgfVxuXG4gIGRyYXcoY3R4KSB7XG4gICAgLy8gY3R4LmJlZ2luUGF0aCgpO1xuICAgIC8vIGN0eC5hcmModGhpcy5wb3NbMF0sIHRoaXMucG9zWzFdLCAyLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgLy8gY3R4LnN0cm9rZVN0eWxlID0gXCJibHVlXCI7XG4gICAgLy8gY3R4LmxpbmVXaWR0aCA9IDEwO1xuICAgIC8vIGN0eC5maWxsU3R5bGUgPSBcIiM0NkMwMTZcIjtcbiAgICAvLyBjdHguZmlsbCgpO1xuICAgIC8vIGNvbnN0IG5ld0ZyZXEgPSBtYXBfcmFuZ2UodGhpcy5wb3NbMV0sIDAsIHRoaXMuZ2FtZS55RGltLCAwLCAyMDAwMCk7XG4gICAgLy8gLy8gY29uc29sZS5sb2cobmV3RnJlcSk7XG4gICAgLy8gZGVidWdnZXI7XG4gICAgLy8gdGhpcy5vc2NpbGxhdG9yLmZyZXF1ZW5jeS52YWx1ZSA9IG5ld0ZyZXE7XG4gIH1cblxuICBtb3ZlKCkge1xuICAgIC8vIHRoaXMucG9zWzBdICs9IHRoaXMudmVsWzBdO1xuICAgIC8vIHRoaXMucG9zWzFdICs9IHRoaXMudmVsWzFdO1xuICAgIC8vIGRlYnVnZ2VyO1xuICAgIC8vIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHModGhpcy5wb3MpKSB7XG4gICAgLy8gICB0aGlzLnBvcyA9IFtcbiAgICAvLyAgICAgdGhpcy53cmFwKHRoaXMucG9zWzBdLCB0aGlzLmdhbWUueERpbSksXG4gICAgLy8gICAgIHRoaXMud3JhcCh0aGlzLnBvc1sxXSwgdGhpcy5nYW1lLnlEaW0pLFxuICAgIC8vICAgXTtcbiAgICAvLyB9XG4gIH1cbiAgaXNPdXRPZkJvdW5kcyhwb3MpIHtcbiAgICAvLyBkZWJ1Z2dlcjtcbiAgICByZXR1cm4gKFxuICAgICAgcG9zWzBdIDwgMCB8fFxuICAgICAgcG9zWzFdIDwgMCB8fFxuICAgICAgcG9zWzBdID4gdGhpcy5nYW1lLnhEaW0gfHxcbiAgICAgIHBvc1sxXSA+IHRoaXMuZ2FtZS55RGltXG4gICAgKTtcbiAgfVxuXG4gIHdyYXAoY29vcmQsIG1heCkge1xuICAgIGlmIChjb29yZCA8IDApIHtcbiAgICAgIHJldHVybiBtYXggLSAoY29vcmQgJSBtYXgpO1xuICAgIH0gZWxzZSBpZiAoY29vcmQgPiBtYXgpIHtcbiAgICAgIHJldHVybiBjb29yZCAlIG1heDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvb3JkO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTYXRlbGxpdGU7XG4iLCJjbGFzcyBTdGFyIHtcbiAgY29uc3RydWN0b3IocG9zLCBnYW1lKSB7XG4gICAgdGhpcy5wb3MgPSBwb3M7XG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICB0aGlzLnhWYWwgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxKSArIDE7XG4gICAgdGhpcy55VmFsID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMSkgKyAxO1xuICB9XG5cbiAgZHJhdyhjdHgpIHtcbiAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuICAgIGN0eC5maWxsUmVjdCh0aGlzLnBvc1swXSwgdGhpcy5wb3NbMV0sIHRoaXMueFZhbCwgdGhpcy55VmFsKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdGFyO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi9zdHlsZXMvaW5kZXguc2Nzc1wiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4vc2NyaXB0cy9nYW1lXCI7XG5pbXBvcnQgR2FtZVZpZXcgZnJvbSBcIi4vc2NyaXB0cy9nYW1lX3ZpZXdcIjtcbmltcG9ydCByZWNlaXZlRGF0YSBmcm9tIFwiLi9zY3JpcHRzL2FwaV91dGlsXCI7XG5pbXBvcnQgaGFuZGxlUGxheSBmcm9tIFwiLi9zY3JpcHRzL2J1dHRvbl91dGlsXCI7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKGV2ZW50KSA9PiB7XG4gIC8vIGdhbWV2aWV3LnN0YXJ0KCk7XG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xuICAvLyBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICBjb25zdCBhdWRpb0N0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgaGFuZGxlUGxheShhdWRpb0N0eCk7XG5cbiAgLy8gcmVjZWl2ZURhdGEudGhlbigocmVzcG9uc2UpID0+IHtcbiAgY29uc3QgSVNTX1RMRSA9IGAxIDI1NTQ0VSA5ODA2N0EgICAyMTEyMi43NTYxNjcwMCAgLjAwMDI3OTgwICAwMDAwMC0wICA1MTQzMi0zIDAgIDk5OTRcbiAgICAgMiAyNTU0NCAgNTEuNjQ0MiAyMDcuNDQ0OSAwMDAyNzY5IDMxMC4xMTg5IDE5My42NTY4IDE1LjQ4OTkzNTI3MjgxNTUzYDtcbiAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNvbnN0IGcgPSBuZXcgR2FtZShjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsIElTU19UTEUsIGF1ZGlvQ3R4KTtcbiAgY29uc3QgZ2FtZXZpZXcgPSBuZXcgR2FtZVZpZXcoSVNTX1RMRSk7XG4gIGdhbWV2aWV3LnN0YXJ0KCk7XG4gIC8vIH0pO1xuXG4gIC8vIG5ldyBHYW1lKGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCkuc3RhcnQoY2FudmFzKTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==