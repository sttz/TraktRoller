// ==UserScript==
// @name          TraktRoller
// @namespace     http://github.com/sttz/TraktRoller
// @description   Trakt scrobbler for Crunchyroll and Funimation
// @author        sttz
// @license       MIT
// @copyright     2018, Adrian Stutz (https://sttz.ch/)
// @homepageURL   http://github.com/sttz/TraktRoller
// @supportURL    http://github.com/sttz/TraktRoller/issues
// @updateURL     https://openuserjs.org/meta/sttz/TraktRoller.meta.js
// @version       1.1.0
// @include       https://www.crunchyroll.com/*
// @include       https://www.funimation.com/*
// @connect       api.trakt.tv
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @grant         unsafeWindow
// @run-at        document_start
// ==/UserScript==

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/ste-core/dist/management.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Allows the user to interact with the event.
 *
 * @class EventManagement
 * @implements {IEventManagement}
 */

var EventManagement =
/** @class */
function () {
  function EventManagement(unsub) {
    this.unsub = unsub;
    this.propagationStopped = false;
  }

  EventManagement.prototype.stopPropagation = function () {
    this.propagationStopped = true;
  };

  return EventManagement;
}();

exports.EventManagement = EventManagement;
},{}],"../node_modules/ste-core/dist/subscription.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Stores a handler. Manages execution meta data.
 * @class Subscription
 * @template TEventHandler
 */

var Subscription =
/** @class */
function () {
  /**
   * Creates an instance of Subscription.
   *
   * @param {TEventHandler} handler The handler for the subscription.
   * @param {boolean} isOnce Indicates if the handler should only be executed once.
   */
  function Subscription(handler, isOnce) {
    this.handler = handler;
    this.isOnce = isOnce;
    /**
     * Indicates if the subscription has been executed before.
     */

    this.isExecuted = false;
  }
  /**
   * Executes the handler.
   *
   * @param {boolean} executeAsync True if the even should be executed async.
   * @param {*} scope The scope the scope of the event.
   * @param {IArguments} args The arguments for the event.
   */


  Subscription.prototype.execute = function (executeAsync, scope, args) {
    if (!this.isOnce || !this.isExecuted) {
      this.isExecuted = true;
      var fn = this.handler;

      if (executeAsync) {
        setTimeout(function () {
          fn.apply(scope, args);
        }, 1);
      } else {
        fn.apply(scope, args);
      }
    }
  };

  return Subscription;
}();

exports.Subscription = Subscription;
},{}],"../node_modules/ste-core/dist/dispatching.js":[function(require,module,exports) {
"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var management_1 = require("./management");

var subscription_1 = require("./subscription");
/**
 * Base class for implementation of the dispatcher. It facilitates the subscribe
 * and unsubscribe methods based on generic handlers. The TEventType specifies
 * the type of event that should be exposed. Use the asEvent to expose the
 * dispatcher as event.
 */


var DispatcherBase =
/** @class */
function () {
  function DispatcherBase() {
    this._wrap = new DispatcherWrapper(this);
    this._subscriptions = new Array();
  }

  Object.defineProperty(DispatcherBase.prototype, "count", {
    /**
     * Returns the number of subscriptions.
     *
     * @readonly
     *
     * @memberOf DispatcherBase
     */
    get: function () {
      return this._subscriptions.length;
    },
    enumerable: true,
    configurable: true
  });
  /**
   * Subscribe to the event dispatcher.
   * @param fn The event handler that is called when the event is dispatched.
   * @returns A function that unsubscribes the event handler from the event.
   */

  DispatcherBase.prototype.subscribe = function (fn) {
    var _this = this;

    if (fn) {
      this._subscriptions.push(new subscription_1.Subscription(fn, false));
    }

    return function () {
      _this.unsubscribe(fn);
    };
  };
  /**
   * Subscribe to the event dispatcher.
   * @param fn The event handler that is called when the event is dispatched.
   * @returns A function that unsubscribes the event handler from the event.
   */


  DispatcherBase.prototype.sub = function (fn) {
    return this.subscribe(fn);
  };
  /**
   * Subscribe once to the event with the specified name.
   * @param fn The event handler that is called when the event is dispatched.
   * @returns A function that unsubscribes the event handler from the event.
   */


  DispatcherBase.prototype.one = function (fn) {
    var _this = this;

    if (fn) {
      this._subscriptions.push(new subscription_1.Subscription(fn, true));
    }

    return function () {
      _this.unsubscribe(fn);
    };
  };
  /**
   * Checks it the event has a subscription for the specified handler.
   * @param fn The event handler.
   */


  DispatcherBase.prototype.has = function (fn) {
    if (!fn) return false;
    return this._subscriptions.some(function (sub) {
      return sub.handler == fn;
    });
  };
  /**
   * Unsubscribes the handler from the dispatcher.
   * @param fn The event handler.
   */


  DispatcherBase.prototype.unsubscribe = function (fn) {
    if (!fn) return;

    for (var i = 0; i < this._subscriptions.length; i++) {
      if (this._subscriptions[i].handler == fn) {
        this._subscriptions.splice(i, 1);

        break;
      }
    }
  };
  /**
   * Unsubscribes the handler from the dispatcher.
   * @param fn The event handler.
   */


  DispatcherBase.prototype.unsub = function (fn) {
    this.unsubscribe(fn);
  };
  /**
   * Generic dispatch will dispatch the handlers with the given arguments.
   *
   * @protected
   * @param {boolean} executeAsync True if the even should be executed async.
   * @param {*} The scope the scope of the event. The scope becomes the "this" for handler.
   * @param {IArguments} args The arguments for the event.
   */


  DispatcherBase.prototype._dispatch = function (executeAsync, scope, args) {
    var _this = this;

    var _loop_1 = function (sub) {
      var ev = new management_1.EventManagement(function () {
        return _this.unsub(sub.handler);
      });
      var nargs = Array.prototype.slice.call(args);
      nargs.push(ev);
      sub.execute(executeAsync, scope, nargs); //cleanup subs that are no longer needed

      this_1.cleanup(sub);

      if (!executeAsync && ev.propagationStopped) {
        return "break";
      }
    };

    var this_1 = this; //execute on a copy because of bug #9

    for (var _i = 0, _a = __spreadArrays(this._subscriptions); _i < _a.length; _i++) {
      var sub = _a[_i];

      var state_1 = _loop_1(sub);

      if (state_1 === "break") break;
    }
  };
  /**
   * Cleans up subs that ran and should run only once.
   */


  DispatcherBase.prototype.cleanup = function (sub) {
    if (sub.isOnce && sub.isExecuted) {
      var i = this._subscriptions.indexOf(sub);

      if (i > -1) {
        this._subscriptions.splice(i, 1);
      }
    }
  };
  /**
   * Creates an event from the dispatcher. Will return the dispatcher
   * in a wrapper. This will prevent exposure of any dispatcher methods.
   */


  DispatcherBase.prototype.asEvent = function () {
    return this._wrap;
  };
  /**
   * Clears all the subscriptions.
   */


  DispatcherBase.prototype.clear = function () {
    this._subscriptions.splice(0, this._subscriptions.length);
  };

  return DispatcherBase;
}();

exports.DispatcherBase = DispatcherBase;
/**
 * Base class for event lists classes. Implements the get and remove.
 */

var EventListBase =
/** @class */
function () {
  function EventListBase() {
    this._events = {};
  }
  /**
   * Gets the dispatcher associated with the name.
   * @param name The name of the event.
   */


  EventListBase.prototype.get = function (name) {
    var event = this._events[name];

    if (event) {
      return event;
    }

    event = this.createDispatcher();
    this._events[name] = event;
    return event;
  };
  /**
   * Removes the dispatcher associated with the name.
   * @param name The name of the event.
   */


  EventListBase.prototype.remove = function (name) {
    delete this._events[name];
  };

  return EventListBase;
}();

exports.EventListBase = EventListBase;
/**
 * Hides the implementation of the event dispatcher. Will expose methods that
 * are relevent to the event.
 */

var DispatcherWrapper =
/** @class */
function () {
  /**
   * Creates a new EventDispatcherWrapper instance.
   * @param dispatcher The dispatcher.
   */
  function DispatcherWrapper(dispatcher) {
    this._subscribe = function (fn) {
      return dispatcher.subscribe(fn);
    };

    this._unsubscribe = function (fn) {
      return dispatcher.unsubscribe(fn);
    };

    this._one = function (fn) {
      return dispatcher.one(fn);
    };

    this._has = function (fn) {
      return dispatcher.has(fn);
    };

    this._clear = function () {
      return dispatcher.clear();
    };

    this._count = function () {
      return dispatcher.count;
    };
  }

  Object.defineProperty(DispatcherWrapper.prototype, "count", {
    /**
     * Returns the number of subscriptions.
     *
     * @readonly
     * @type {number}
     * @memberOf DispatcherWrapper
     */
    get: function () {
      return this._count();
    },
    enumerable: true,
    configurable: true
  });
  /**
   * Subscribe to the event dispatcher.
   * @param fn The event handler that is called when the event is dispatched.
   * @returns A function that unsubscribes the event handler from the event.
   */

  DispatcherWrapper.prototype.subscribe = function (fn) {
    return this._subscribe(fn);
  };
  /**
   * Subscribe to the event dispatcher.
   * @param fn The event handler that is called when the event is dispatched.
   * @returns A function that unsubscribes the event handler from the event.
   */


  DispatcherWrapper.prototype.sub = function (fn) {
    return this.subscribe(fn);
  };
  /**
   * Unsubscribe from the event dispatcher.
   * @param fn The event handler that is called when the event is dispatched.
   */


  DispatcherWrapper.prototype.unsubscribe = function (fn) {
    this._unsubscribe(fn);
  };
  /**
   * Unsubscribe from the event dispatcher.
   * @param fn The event handler that is called when the event is dispatched.
   */


  DispatcherWrapper.prototype.unsub = function (fn) {
    this.unsubscribe(fn);
  };
  /**
   * Subscribe once to the event with the specified name.
   * @param fn The event handler that is called when the event is dispatched.
   */


  DispatcherWrapper.prototype.one = function (fn) {
    return this._one(fn);
  };
  /**
   * Checks it the event has a subscription for the specified handler.
   * @param fn The event handler.
   */


  DispatcherWrapper.prototype.has = function (fn) {
    return this._has(fn);
  };
  /**
   * Clears all the subscriptions.
   */


  DispatcherWrapper.prototype.clear = function () {
    this._clear();
  };

  return DispatcherWrapper;
}();

exports.DispatcherWrapper = DispatcherWrapper;
},{"./management":"../node_modules/ste-core/dist/management.js","./subscription":"../node_modules/ste-core/dist/subscription.js"}],"../node_modules/ste-core/dist/index.js":[function(require,module,exports) {
"use strict";
/*!
 * Strongly Typed Events for TypeScript - Core
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var dispatching_1 = require("./dispatching");

exports.DispatcherBase = dispatching_1.DispatcherBase;
exports.DispatcherWrapper = dispatching_1.DispatcherWrapper;
exports.EventListBase = dispatching_1.EventListBase;

var subscription_1 = require("./subscription");

exports.Subscription = subscription_1.Subscription;
},{"./dispatching":"../node_modules/ste-core/dist/dispatching.js","./subscription":"../node_modules/ste-core/dist/subscription.js"}],"../node_modules/ste-events/dist/events.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ste_core_1 = require("ste-core");
/**
 * Dispatcher implementation for events. Can be used to subscribe, unsubscribe
 * or dispatch events. Use the ToEvent() method to expose the event.
 */


var EventDispatcher =
/** @class */
function (_super) {
  __extends(EventDispatcher, _super);
  /**
   * Creates a new EventDispatcher instance.
   */


  function EventDispatcher() {
    return _super.call(this) || this;
  }
  /**
   * Dispatches the event.
   * @param sender The sender.
   * @param args The arguments object.
   */


  EventDispatcher.prototype.dispatch = function (sender, args) {
    this._dispatch(false, this, arguments);
  };
  /**
   * Dispatches the events thread.
   * @param sender The sender.
   * @param args The arguments object.
   */


  EventDispatcher.prototype.dispatchAsync = function (sender, args) {
    this._dispatch(true, this, arguments);
  };
  /**
   * Creates an event from the dispatcher. Will return the dispatcher
   * in a wrapper. This will prevent exposure of any dispatcher methods.
   */


  EventDispatcher.prototype.asEvent = function () {
    return _super.prototype.asEvent.call(this);
  };

  return EventDispatcher;
}(ste_core_1.DispatcherBase);

exports.EventDispatcher = EventDispatcher;
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */

var NonUniformEventList =
/** @class */
function () {
  function NonUniformEventList() {
    this._events = {};
  }
  /**
   * Gets the dispatcher associated with the name.
   * @param name The name of the event.
   */


  NonUniformEventList.prototype.get = function (name) {
    if (this._events[name]) {
      // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
      return this._events[name];
    }

    var event = this.createDispatcher();
    this._events[name] = event;
    return event;
  };
  /**
   * Removes the dispatcher associated with the name.
   * @param name The name of the event.
   */


  NonUniformEventList.prototype.remove = function (name) {
    delete this._events[name];
  };
  /**
   * Creates a new dispatcher instance.
   */


  NonUniformEventList.prototype.createDispatcher = function () {
    return new EventDispatcher();
  };

  return NonUniformEventList;
}();

exports.NonUniformEventList = NonUniformEventList;
/**
 * Storage class for multiple events that are accessible by name.
 * Events dispatchers are automatically created.
 */

var EventList =
/** @class */
function (_super) {
  __extends(EventList, _super);
  /**
   * Creates a new EventList instance.
   */


  function EventList() {
    return _super.call(this) || this;
  }
  /**
   * Creates a new dispatcher instance.
   */


  EventList.prototype.createDispatcher = function () {
    return new EventDispatcher();
  };

  return EventList;
}(ste_core_1.EventListBase);

exports.EventList = EventList;
/**
 * Extends objects with event handling capabilities.
 */

var EventHandlingBase =
/** @class */
function () {
  function EventHandlingBase() {
    this._events = new EventList();
  }

  Object.defineProperty(EventHandlingBase.prototype, "events", {
    /**
     * Gets the list with all the event dispatchers.
     */
    get: function () {
      return this._events;
    },
    enumerable: true,
    configurable: true
  });
  /**
   * Subscribes to the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */

  EventHandlingBase.prototype.subscribe = function (name, fn) {
    this._events.get(name).subscribe(fn);
  };
  /**
   * Subscribes to the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  EventHandlingBase.prototype.sub = function (name, fn) {
    this.subscribe(name, fn);
  };
  /**
   * Unsubscribes from the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  EventHandlingBase.prototype.unsubscribe = function (name, fn) {
    this._events.get(name).unsubscribe(fn);
  };
  /**
   * Unsubscribes from the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  EventHandlingBase.prototype.unsub = function (name, fn) {
    this.unsubscribe(name, fn);
  };
  /**
   * Subscribes to once the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  EventHandlingBase.prototype.one = function (name, fn) {
    this._events.get(name).one(fn);
  };
  /**
   * Subscribes to once the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  EventHandlingBase.prototype.has = function (name, fn) {
    return this._events.get(name).has(fn);
  };

  return EventHandlingBase;
}();

exports.EventHandlingBase = EventHandlingBase;
},{"ste-core":"../node_modules/ste-core/dist/index.js"}],"../node_modules/ste-events/dist/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var events_1 = require("./events");

exports.EventDispatcher = events_1.EventDispatcher;
exports.EventHandlingBase = events_1.EventHandlingBase;
exports.EventList = events_1.EventList;
exports.NonUniformEventList = events_1.NonUniformEventList;
},{"./events":"../node_modules/ste-events/dist/events.js"}],"../node_modules/ste-simple-events/dist/simple-events.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ste_core_1 = require("ste-core");
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a simple event
 */


var SimpleEventDispatcher =
/** @class */
function (_super) {
  __extends(SimpleEventDispatcher, _super);
  /**
   * Creates a new SimpleEventDispatcher instance.
   */


  function SimpleEventDispatcher() {
    return _super.call(this) || this;
  }
  /**
   * Dispatches the event.
   * @param args The arguments object.
   */


  SimpleEventDispatcher.prototype.dispatch = function (args) {
    this._dispatch(false, this, arguments);
  };
  /**
   * Dispatches the events thread.
   * @param args The arguments object.
   */


  SimpleEventDispatcher.prototype.dispatchAsync = function (args) {
    this._dispatch(true, this, arguments);
  };
  /**
   * Creates an event from the dispatcher. Will return the dispatcher
   * in a wrapper. This will prevent exposure of any dispatcher methods.
   */


  SimpleEventDispatcher.prototype.asEvent = function () {
    return _super.prototype.asEvent.call(this);
  };

  return SimpleEventDispatcher;
}(ste_core_1.DispatcherBase);

exports.SimpleEventDispatcher = SimpleEventDispatcher;
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */

var NonUniformSimpleEventList =
/** @class */
function () {
  function NonUniformSimpleEventList() {
    this._events = {};
  }
  /**
   * Gets the dispatcher associated with the name.
   * @param name The name of the event.
   */


  NonUniformSimpleEventList.prototype.get = function (name) {
    if (this._events[name]) {
      // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
      return this._events[name];
    }

    var event = this.createDispatcher();
    this._events[name] = event;
    return event;
  };
  /**
   * Removes the dispatcher associated with the name.
   * @param name The name of the event.
   */


  NonUniformSimpleEventList.prototype.remove = function (name) {
    delete this._events[name];
  };
  /**
   * Creates a new dispatcher instance.
   */


  NonUniformSimpleEventList.prototype.createDispatcher = function () {
    return new SimpleEventDispatcher();
  };

  return NonUniformSimpleEventList;
}();

exports.NonUniformSimpleEventList = NonUniformSimpleEventList;
/**
 * Storage class for multiple simple events that are accessible by name.
 * Events dispatchers are automatically created.
 */

var SimpleEventList =
/** @class */
function (_super) {
  __extends(SimpleEventList, _super);
  /**
   * Creates a new SimpleEventList instance.
   */


  function SimpleEventList() {
    return _super.call(this) || this;
  }
  /**
   * Creates a new dispatcher instance.
   */


  SimpleEventList.prototype.createDispatcher = function () {
    return new SimpleEventDispatcher();
  };

  return SimpleEventList;
}(ste_core_1.EventListBase);

exports.SimpleEventList = SimpleEventList;
/**
 * Extends objects with simple event handling capabilities.
 */

var SimpleEventHandlingBase =
/** @class */
function () {
  function SimpleEventHandlingBase() {
    this._events = new SimpleEventList();
  }

  Object.defineProperty(SimpleEventHandlingBase.prototype, "events", {
    get: function () {
      return this._events;
    },
    enumerable: true,
    configurable: true
  });
  /**
   * Subscribes to the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */

  SimpleEventHandlingBase.prototype.subscribe = function (name, fn) {
    this._events.get(name).subscribe(fn);
  };
  /**
   * Subscribes to the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  SimpleEventHandlingBase.prototype.sub = function (name, fn) {
    this.subscribe(name, fn);
  };
  /**
   * Subscribes once to the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  SimpleEventHandlingBase.prototype.one = function (name, fn) {
    this._events.get(name).one(fn);
  };
  /**
   * Checks it the event has a subscription for the specified handler.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  SimpleEventHandlingBase.prototype.has = function (name, fn) {
    return this._events.get(name).has(fn);
  };
  /**
   * Unsubscribes from the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  SimpleEventHandlingBase.prototype.unsubscribe = function (name, fn) {
    this._events.get(name).unsubscribe(fn);
  };
  /**
   * Unsubscribes from the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  SimpleEventHandlingBase.prototype.unsub = function (name, fn) {
    this.unsubscribe(name, fn);
  };

  return SimpleEventHandlingBase;
}();

exports.SimpleEventHandlingBase = SimpleEventHandlingBase;
},{"ste-core":"../node_modules/ste-core/dist/index.js"}],"../node_modules/ste-simple-events/dist/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var simple_events_1 = require("./simple-events");

exports.SimpleEventDispatcher = simple_events_1.SimpleEventDispatcher;
exports.SimpleEventHandlingBase = simple_events_1.SimpleEventHandlingBase;
exports.SimpleEventList = simple_events_1.SimpleEventList;
exports.NonUniformSimpleEventList = simple_events_1.NonUniformSimpleEventList;
},{"./simple-events":"../node_modules/ste-simple-events/dist/simple-events.js"}],"../node_modules/ste-signals/dist/signals.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ste_core_1 = require("ste-core");
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a signal event.
 */


var SignalDispatcher =
/** @class */
function (_super) {
  __extends(SignalDispatcher, _super);
  /**
   * Creates a new SignalDispatcher instance.
   */


  function SignalDispatcher() {
    return _super.call(this) || this;
  }
  /**
   * Dispatches the signal.
   */


  SignalDispatcher.prototype.dispatch = function () {
    this._dispatch(false, this, arguments);
  };
  /**
   * Dispatches the signal threaded.
   */


  SignalDispatcher.prototype.dispatchAsync = function () {
    this._dispatch(true, this, arguments);
  };
  /**
   * Creates an event from the dispatcher. Will return the dispatcher
   * in a wrapper. This will prevent exposure of any dispatcher methods.
   */


  SignalDispatcher.prototype.asEvent = function () {
    return _super.prototype.asEvent.call(this);
  };

  return SignalDispatcher;
}(ste_core_1.DispatcherBase);

exports.SignalDispatcher = SignalDispatcher;
/**
 * Storage class for multiple signal events that are accessible by name.
 * Events dispatchers are automatically created.
 */

var SignalList =
/** @class */
function (_super) {
  __extends(SignalList, _super);
  /**
   * Creates a new SignalList instance.
   */


  function SignalList() {
    return _super.call(this) || this;
  }
  /**
   * Creates a new dispatcher instance.
   */


  SignalList.prototype.createDispatcher = function () {
    return new SignalDispatcher();
  };

  return SignalList;
}(ste_core_1.EventListBase);

exports.SignalList = SignalList;
/**
 * Extends objects with signal event handling capabilities.
 */

var SignalHandlingBase =
/** @class */
function () {
  function SignalHandlingBase() {
    this._events = new SignalList();
  }

  Object.defineProperty(SignalHandlingBase.prototype, "events", {
    get: function () {
      return this._events;
    },
    enumerable: true,
    configurable: true
  });
  /**
   * Subscribes once to the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */

  SignalHandlingBase.prototype.one = function (name, fn) {
    this._events.get(name).one(fn);
  };
  /**
   * Checks it the event has a subscription for the specified handler.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  SignalHandlingBase.prototype.has = function (name, fn) {
    return this._events.get(name).has(fn);
  };
  /**
   * Subscribes to the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  SignalHandlingBase.prototype.subscribe = function (name, fn) {
    this._events.get(name).subscribe(fn);
  };
  /**
   * Subscribes to the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  SignalHandlingBase.prototype.sub = function (name, fn) {
    this.subscribe(name, fn);
  };
  /**
   * Unsubscribes from the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  SignalHandlingBase.prototype.unsubscribe = function (name, fn) {
    this._events.get(name).unsubscribe(fn);
  };
  /**
   * Unsubscribes from the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  SignalHandlingBase.prototype.unsub = function (name, fn) {
    this.unsubscribe(name, fn);
  };

  return SignalHandlingBase;
}();

exports.SignalHandlingBase = SignalHandlingBase;
},{"ste-core":"../node_modules/ste-core/dist/index.js"}],"../node_modules/ste-signals/dist/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var signals_1 = require("./signals");

exports.SignalDispatcher = signals_1.SignalDispatcher;
exports.SignalHandlingBase = signals_1.SignalHandlingBase;
exports.SignalList = signals_1.SignalList;
},{"./signals":"../node_modules/ste-signals/dist/signals.js"}],"../node_modules/strongly-typed-events/dist/index.js":[function(require,module,exports) {
"use strict";
/*!
 * Strongly Typed Events for TypeScript
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ste_core_1 = require("ste-core");

exports.DispatcherBase = ste_core_1.DispatcherBase;
exports.DispatcherWrapper = ste_core_1.DispatcherWrapper;
exports.EventListBase = ste_core_1.EventListBase;
exports.Subscription = ste_core_1.Subscription;

var ste_events_1 = require("ste-events");

exports.EventDispatcher = ste_events_1.EventDispatcher;
exports.EventHandlingBase = ste_events_1.EventHandlingBase;
exports.EventList = ste_events_1.EventList;
exports.NonUniformEventList = ste_events_1.NonUniformEventList;

var ste_simple_events_1 = require("ste-simple-events");

exports.SimpleEventDispatcher = ste_simple_events_1.SimpleEventDispatcher;
exports.SimpleEventHandlingBase = ste_simple_events_1.SimpleEventHandlingBase;
exports.SimpleEventList = ste_simple_events_1.SimpleEventList;
exports.NonUniformSimpleEventList = ste_simple_events_1.NonUniformSimpleEventList;

var ste_signals_1 = require("ste-signals");

exports.SignalDispatcher = ste_signals_1.SignalDispatcher;
exports.SignalHandlingBase = ste_signals_1.SignalHandlingBase;
exports.SignalList = ste_signals_1.SignalList;
},{"ste-core":"../node_modules/ste-core/dist/index.js","ste-events":"../node_modules/ste-events/dist/index.js","ste-simple-events":"../node_modules/ste-simple-events/dist/index.js","ste-signals":"../node_modules/ste-signals/dist/index.js"}],"TraktApi.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const strongly_typed_events_1 = require("strongly-typed-events");

const TraktTokensKey = 'trakt_tokens';

class TraktApiError extends Error {
  constructor(error) {
    super(error.error);
    this.status = error.status;
  }

}

exports.TraktApiError = TraktApiError;
const TraktErrorCodes = {
  200: {
    "status": 200,
    "error": "Success"
  },
  201: {
    "status": 201,
    "error": "Success - new resource created (POST)"
  },
  204: {
    "status": 204,
    "error": "Success - no content to return (DELETE)"
  },
  400: {
    "status": 400,
    "error": "Bad Request - request couldn't be parsed"
  },
  401: {
    "status": 401,
    "error": "Unauthorized - OAuth must be provided"
  },
  403: {
    "status": 403,
    "error": "Forbidden - invalid API key or unapproved app"
  },
  404: {
    "status": 404,
    "error": "Not Found - method exists, but no record found"
  },
  405: {
    "status": 405,
    "error": "Method Not Found - method doesn't exist"
  },
  409: {
    "status": 409,
    "error": "Conflict - resource already created"
  },
  412: {
    "status": 412,
    "error": "Precondition Failed - use application/json content type"
  },
  422: {
    "status": 422,
    "error": "Unprocessible Entity - validation errors"
  },
  429: {
    "status": 429,
    "error": "Rate Limit Exceeded"
  },
  500: {
    "status": 500,
    "error": "Server Error - please open a support issue"
  },
  503: {
    "status": 503,
    "error": "Service Unavailable - server overloaded (try again in 30s)"
  },
  504: {
    "status": 504,
    "error": "Service Unavailable - server overloaded (try again in 30s)"
  },
  520: {
    "status": 520,
    "error": "Service Unavailable - Cloudflare error"
  },
  521: {
    "status": 521,
    "error": "Service Unavailable - Cloudflare error"
  },
  522: {
    "status": 522,
    "error": "Service Unavailable - Cloudflare error"
  }
};

class LocalStorageAdapter {
  getValue(name) {
    return Promise.resolve(window.localStorage.getItem(name));
  }

  setValue(name, value) {
    if (!value) {
      window.localStorage.removeItem(name);
    } else {
      window.localStorage.setItem(name, value);
    }

    return Promise.resolve();
  }

}

exports.LocalStorageAdapter = LocalStorageAdapter;

class GreaseMonkeyStorageAdapter {
  getValue(name) {
    return Promise.resolve(GM_getValue(name));
  }

  setValue(name, value) {
    if (!value) {
      GM_deleteValue(name);
    } else {
      GM_setValue(name, value);
    }

    return Promise.resolve();
  }

}

exports.GreaseMonkeyStorageAdapter = GreaseMonkeyStorageAdapter;

class TraktApi {
  constructor(options) {
    this.onAuthenticationChanged = new strongly_typed_events_1.SimpleEventDispatcher();
    this._tokens = {};
    this._client_id = options.client_id;
    this._client_secret = options.client_secret;
    this._redirect_uri = options.redirect_url;
    this._endpoint = options.api_url || 'https://api.trakt.tv';
    this._storage = options.storage || new LocalStorageAdapter();
  }

  static isError(obj, code) {
    const err = obj;
    return err.status !== undefined && err.error !== undefined && (code === undefined || err.status === code);
  } // ------ Authentication ------


  loadTokens() {
    return __awaiter(this, void 0, void 0, function* () {
      const data = yield this._storage.getValue(TraktTokensKey);

      if (data) {
        this._tokens = JSON.parse(data);
      } else {
        this._tokens = {};
      }

      if (this._tokens.expires && this._tokens.expires < Date.now()) {
        this._tokens = yield this._refresh_token();
        yield this._storage.setValue(TraktTokensKey, JSON.stringify(this._tokens));
      }

      this.onAuthenticationChanged.dispatch(this.isAuthenticated());
    });
  }

  isAuthenticated() {
    return this._tokens.access_token !== undefined;
  }

  authenticate() {
    return __awaiter(this, void 0, void 0, function* () {
      const state = this._generate_state();

      const url = this._get_url(state); // Save authentication state data


      this._tokens.authentication_state = state;
      yield this._storage.setValue(TraktTokensKey, JSON.stringify(this._tokens));
      window.location.href = url;
    });
  }

  checkAuthenticationResult(url) {
    return __awaiter(this, void 0, void 0, function* () {
      const params = new URL(url).searchParams;
      const code = params.get('code');
      const state = params.get('state');
      if (!code || !state) return;

      if (!(yield this._exchange_code(code, state))) {
        console.error('Exchanging oauth code failed!');
        return;
      }

      console.log('Trakt authentication successful!');
      yield this._storage.setValue(TraktTokensKey, JSON.stringify(this._tokens));
      window.history.replaceState(null, "", window.location.pathname);
      this.onAuthenticationChanged.dispatch(true);
    });
  }

  disconnect() {
    this._storage.setValue(TraktTokensKey, null);

    this.onAuthenticationChanged.dispatch(false);

    this._revoke_token();
  } // ------ API ------


  _getError(response) {
    var error = TraktErrorCodes[response.status];
    if (error) return error;
    return {
      status: response.status,
      error: `Unknown error (${response.statusText})`
    };
  }

  _request(method, url, body) {
    return __awaiter(this, void 0, void 0, function* () {
      let contentType = null;

      if (body) {
        if (body.contentType) {
          contentType = body.contentType;
          body = body.body;
        }

        if (typeof body !== 'string') {
          body = JSON.stringify(body);
        }
      }

      let headers = new Headers();
      headers.append('trakt-api-version', '2');
      headers.append('trakt-api-key', this._client_id);
      headers.append('Content-Type', contentType || 'application/json');

      if (this._tokens && this._tokens.access_token) {
        headers.append('Authorization', `Bearer ${this._tokens.access_token}`);
      }

      try {
        let response = yield fetch(this._endpoint + url, {
          method: method,
          mode: "cors",
          headers: headers,
          body: body
        });

        if (!response.ok) {
          return this._getError(response);
        }

        if (response.status === 204) {
          return null; // 204: No Content
        }

        return response.json();
      } catch (err) {
        return {
          status: 0,
          error: `An error occurred sending the request: ${err}`
        };
      }
    });
  }

  _exchange(body) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield this._request('POST', '/oauth/token', body);
        return {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires: (data.created_at + data.expires_in) * 1000
        };
      } catch (err) {
        console.error(err);
        return {};
      }
    });
  }

  _generate_state() {
    let data = new Uint32Array(4);
    crypto.getRandomValues(data);
    let state = '';

    for (let i = 0; i < data.length; i++) {
      state += data[i].toString(16);
    }

    return state;
  }

  _get_url(state) {
    // Replace 'api' from the api_url to get the top level trakt domain
    const base_url = this._endpoint.replace(/api\W/, '');

    return `${base_url}/oauth/authorize?response_type=code&client_id=${this._client_id}&redirect_uri=${this._redirect_uri}&state=${state}`;
  }

  _exchange_code(code, state) {
    return __awaiter(this, void 0, void 0, function* () {
      if (state !== this._tokens.authentication_state) {
        console.error('Invalid CSRF (State)');
        return false;
      }

      this._tokens = yield this._exchange({
        code: code,
        client_id: this._client_id,
        client_secret: this._client_secret,
        redirect_uri: this._redirect_uri,
        grant_type: 'authorization_code'
      });
      return this.isAuthenticated();
    });
  }

  _refresh_token() {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this._tokens.refresh_token) return {};
      return yield this._exchange({
        refresh_token: this._tokens.refresh_token,
        client_id: this._client_id,
        client_secret: this._client_secret,
        redirect_uri: this._redirect_uri,
        grant_type: 'refresh_token'
      });
    });
  }

  _revoke_token() {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this._tokens.access_token) return;
      return this._request('POST', '/oauth/revoke', {
        token: this._tokens.access_token,
        client_id: this._client_id,
        client_secret: this._client_secret
      });
    });
  }

  search(type, query) {
    return __awaiter(this, void 0, void 0, function* () {
      return this._request('GET', `/search/${type}?query=${encodeURIComponent(query)}`);
    });
  }

  seasons(showId, extended) {
    return __awaiter(this, void 0, void 0, function* () {
      let query = extended ? '?extended=' + extended.join(",") : '';
      return this._request('GET', `/shows/${showId}/seasons${query}`);
    });
  }

  season(showId, season, extended) {
    return __awaiter(this, void 0, void 0, function* () {
      return this._request('GET', `/shows/${showId}/seasons/${season}?extended=${extended ? 'full' : ''}`);
    });
  }

  scrobble(type, data) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this._tokens.access_token) {
        throw new Error('Access token required.');
      }

      return this._request('POST', `/scrobble/${type}`, data);
    });
  }

  history(type, id) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this._tokens.access_token) {
        throw new Error('Access token required.');
      }

      let url = '/sync/history';
      if (type) url += '/' + type;
      if (type && id) url += '/' + id;
      return this._request('GET', url);
    });
  }

  historyRemove(id) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this._tokens.access_token) {
        throw new Error('Access token required.');
      }

      return this._request('POST', `/sync/history/remove`, {
        ids: [id]
      });
    });
  }

}

exports.default = TraktApi;
},{"strongly-typed-events":"../node_modules/strongly-typed-events/dist/index.js"}],"TraktScrobble.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const TraktApi_1 = __importDefault(require("./TraktApi"));

const ste_simple_events_1 = require("ste-simple-events");

var PlaybackState;

(function (PlaybackState) {
  PlaybackState[PlaybackState["Paused"] = 0] = "Paused";
  PlaybackState[PlaybackState["Playing"] = 1] = "Playing";
  PlaybackState[PlaybackState["Ended"] = 2] = "Ended";
})(PlaybackState = exports.PlaybackState || (exports.PlaybackState = {}));

var TraktScrobbleState;

(function (TraktScrobbleState) {
  TraktScrobbleState["Undefined"] = "undefined";
  TraktScrobbleState["Idle"] = "idle";
  TraktScrobbleState["Started"] = "started";
  TraktScrobbleState["Paused"] = "paused";
  TraktScrobbleState["Scrobbled"] = "scrobbled";
  TraktScrobbleState["Error"] = "error";
})(TraktScrobbleState = exports.TraktScrobbleState || (exports.TraktScrobbleState = {}));

class TraktScrobble {
  constructor(client) {
    /** Scrobble once this percentage has been reached */
    this.scrobbleAbovePecentage = 80;
    /** Minimum time of the video that has to have been played before scrobbling (percent of duration) */

    this.scrobbleMimimumPlaybackPercentage = 0.1;
    this.onStateChanged = new ste_simple_events_1.SimpleEventDispatcher();
    this.onScrobbled = new ste_simple_events_1.SimpleEventDispatcher();
    this._state = TraktScrobbleState.Undefined;
    this._pendingState = TraktScrobbleState.Undefined;
    this._playbackState = PlaybackState.Paused;
    this._playbackProgress = 0;
    this._enabled = false;
    this._lastPlaybackTime = 0;
    this._playbackTime = 0;
    this._client = client;
  }
  /** Extract item type from scrobble data */


  static typeFromData(data) {
    if (!data) return null;
    if (data.movie) return 'movie';
    if (data.show && data.episode) return 'episode';
    return null;
  }
  /** Extract trakt id from scrobble data, returns 0 if id is not set */


  static traktIdFromData(data) {
    if (!data) return 0;
    let movieId = data.movie && data.movie.ids && data.movie.ids.trakt || null;
    if (movieId) return movieId;
    let episodeId = data.episode && data.episode.ids && data.episode.ids.trakt || null;
    if (episodeId) return episodeId;
    return 0;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(value) {
    if (this._enabled === value) return;
    this._enabled = value;

    if (this._enabled) {
      this._applyState(PlaybackState.Paused);
    } else {
      this._applyState(this._playbackState);
    }
  }

  scrobble(data) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._state === TraktScrobbleState.Started) {
        this._applyState(PlaybackState.Paused);
      }

      this._data = data;
      this.setState(TraktScrobbleState.Idle);

      if (this._playbackState === PlaybackState.Playing) {
        this._updateScrobble('start');
      } else if (this._playbackState === PlaybackState.Ended) {
        this._updateScrobble('stop');
      }
    });
  }

  setPlaybackTime(time, duration) {
    let delta = time - this._lastPlaybackTime;

    if (delta < 0.5) {
      this._playbackTime += delta;
    }

    let progress = time / duration * 100;
    let minimumTime = duration * this.scrobbleMimimumPlaybackPercentage;

    if (this._state === TraktScrobbleState.Started && progress > this.scrobbleAbovePecentage && this._playbackTime > minimumTime) {
      this.setPlaybackState(PlaybackState.Ended, progress);
    }

    this._lastPlaybackTime = time;
  }

  setPlaybackState(state, progress) {
    this._playbackState = state;
    this._playbackProgress = progress;

    if (!this.enabled) {
      this._applyState(state);
    }
  }

  scrobbleNow() {
    this._playbackState = PlaybackState.Ended;
    this._playbackProgress = 100;

    this._applyState(this._playbackState);
  }

  _applyState(state) {
    return __awaiter(this, void 0, void 0, function* () {
      if (state === PlaybackState.Playing) {
        if (this._pendingState === TraktScrobbleState.Idle || this._pendingState === TraktScrobbleState.Paused) {
          yield this._updateScrobble('start');
        }
      } else if (state === PlaybackState.Paused) {
        if (this._pendingState === TraktScrobbleState.Started) {
          yield this._updateScrobble('pause');
        }
      } else if (state === PlaybackState.Ended) {
        if (this._pendingState === TraktScrobbleState.Idle || this._pendingState === TraktScrobbleState.Started || this._pendingState === TraktScrobbleState.Paused) {
          yield this._updateScrobble('stop');
        }
      }
    });
  }

  get error() {
    return this._error;
  }

  scrobbleUrl() {
    if (!this._data) return '';
    let url = 'https://trakt.tv/';

    if (this._data.movie !== undefined) {
      return url + `movies/${this._data.movie.ids.slug}`;
    } else if (this._data.show !== undefined && this._data.episode !== undefined) {
      const show = this._data.show;
      const episode = this._data.episode;
      return url + `shows/${show.ids.slug}/seasons/${episode.season}/episodes/${episode.number}`;
    }

    return '';
  }

  get state() {
    return this._state;
  }

  setState(value) {
    if (this._state == value) return;
    this._state = value;
    this._pendingState = value;
    this.onStateChanged.dispatch(value);
  }

  get data() {
    return this._data;
  }

  _updateScrobble(type) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this._data) {
        throw new Error('TraktRoller: Scrobble data not set');
      }

      switch (type) {
        case 'start':
          this._pendingState = TraktScrobbleState.Started;
          break;

        case 'pause':
          this._pendingState = TraktScrobbleState.Paused;
          break;

        case 'stop':
          this._pendingState = TraktScrobbleState.Scrobbled;
          break;
      }

      this._data.progress = this._playbackProgress;
      let scrobbleResponse = yield this._client.scrobble(type, this._data);

      if (TraktApi_1.default.isError(scrobbleResponse)) {
        console.error(`trakt scrobbler: ${scrobbleResponse.error}`);
        this._error = scrobbleResponse.error;
        this.setState(TraktScrobbleState.Error);
        return false;
      }

      switch (this._state) {
        case TraktScrobbleState.Idle:
        case TraktScrobbleState.Started:
        case TraktScrobbleState.Paused:
          switch (scrobbleResponse.action) {
            case 'start':
              this.setState(TraktScrobbleState.Started);
              break;

            case 'pause':
              this.setState(TraktScrobbleState.Paused);
              break;

            case 'scrobble':
              this.setState(TraktScrobbleState.Scrobbled);
              this.onScrobbled.dispatch(scrobbleResponse);
              break;
          }

          break;
      }

      return true;
    });
  }

}

exports.default = TraktScrobble;
},{"./TraktApi":"TraktApi.ts","ste-simple-events":"../node_modules/ste-simple-events/dist/index.js"}],"../node_modules/preact/dist/preact.module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = H;
exports.hydrate = I;
exports.h = exports.createElement = h;
exports.Fragment = d;
exports.createRef = y;
exports.Component = m;
exports.cloneElement = L;
exports.createContext = M;
exports.toChildArray = x;
exports._unmount = D;
exports.options = exports.isValidElement = void 0;
var n,
    l,
    u,
    i,
    t,
    r,
    o,
    f,
    e = {},
    c = [],
    s = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
exports.isValidElement = l;
exports.options = n;

function a(n, l) {
  for (var u in l) n[u] = l[u];

  return n;
}

function v(n) {
  var l = n.parentNode;
  l && l.removeChild(n);
}

function h(n, l, u) {
  var i,
      t = arguments,
      r = {};

  for (i in l) "key" !== i && "ref" !== i && (r[i] = l[i]);

  if (arguments.length > 3) for (u = [u], i = 3; i < arguments.length; i++) u.push(t[i]);
  if (null != u && (r.children = u), "function" == typeof n && null != n.defaultProps) for (i in n.defaultProps) void 0 === r[i] && (r[i] = n.defaultProps[i]);
  return p(n, r, l && l.key, l && l.ref, null);
}

function p(l, u, i, t, r) {
  var o = {
    type: l,
    props: u,
    key: i,
    ref: t,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    constructor: void 0,
    __v: r
  };
  return null == r && (o.__v = o), n.vnode && n.vnode(o), o;
}

function y() {
  return {};
}

function d(n) {
  return n.children;
}

function m(n, l) {
  this.props = n, this.context = l;
}

function w(n, l) {
  if (null == l) return n.__ ? w(n.__, n.__.__k.indexOf(n) + 1) : null;

  for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;

  return "function" == typeof n.type ? w(n) : null;
}

function k(n) {
  var l, u;

  if (null != (n = n.__) && null != n.__c) {
    for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) {
      n.__e = n.__c.base = u.__e;
      break;
    }

    return k(n);
  }
}

function g(l) {
  (!l.__d && (l.__d = !0) && u.push(l) && !i++ || r !== n.debounceRendering) && ((r = n.debounceRendering) || t)(_);
}

function _() {
  for (var n; i = u.length;) n = u.sort(function (n, l) {
    return n.__v.__b - l.__v.__b;
  }), u = [], n.some(function (n) {
    var l, u, i, t, r, o, f;
    n.__d && (o = (r = (l = n).__v).__e, (f = l.__P) && (u = [], (i = a({}, r)).__v = i, t = A(f, r, i, l.__n, void 0 !== f.ownerSVGElement, null, u, null == o ? w(r) : o), T(u, r), t != o && k(r)));
  });
}

function b(n, l, u, i, t, r, o, f, s) {
  var a,
      h,
      p,
      y,
      d,
      m,
      k,
      g = u && u.__k || c,
      _ = g.length;
  if (f == e && (f = null != r ? r[0] : _ ? w(u, 0) : null), a = 0, l.__k = x(l.__k, function (u) {
    if (null != u) {
      if (u.__ = l, u.__b = l.__b + 1, null === (p = g[a]) || p && u.key == p.key && u.type === p.type) g[a] = void 0;else for (h = 0; h < _; h++) {
        if ((p = g[h]) && u.key == p.key && u.type === p.type) {
          g[h] = void 0;
          break;
        }

        p = null;
      }

      if (y = A(n, u, p = p || e, i, t, r, o, f, s), (h = u.ref) && p.ref != h && (k || (k = []), p.ref && k.push(p.ref, null, u), k.push(h, u.__c || y, u)), null != y) {
        var c;
        if (null == m && (m = y), void 0 !== u.__d) c = u.__d, u.__d = void 0;else if (r == p || y != f || null == y.parentNode) {
          n: if (null == f || f.parentNode !== n) n.appendChild(y), c = null;else {
            for (d = f, h = 0; (d = d.nextSibling) && h < _; h += 2) if (d == y) break n;

            n.insertBefore(y, f), c = f;
          }

          "option" == l.type && (n.value = "");
        }
        f = void 0 !== c ? c : y.nextSibling, "function" == typeof l.type && (l.__d = f);
      } else f && p.__e == f && f.parentNode != n && (f = w(p));
    }

    return a++, u;
  }), l.__e = m, null != r && "function" != typeof l.type) for (a = r.length; a--;) null != r[a] && v(r[a]);

  for (a = _; a--;) null != g[a] && D(g[a], g[a]);

  if (k) for (a = 0; a < k.length; a++) j(k[a], k[++a], k[++a]);
}

function x(n, l, u) {
  if (null == u && (u = []), null == n || "boolean" == typeof n) l && u.push(l(null));else if (Array.isArray(n)) for (var i = 0; i < n.length; i++) x(n[i], l, u);else u.push(l ? l("string" == typeof n || "number" == typeof n ? p(null, n, null, null, n) : null != n.__e || null != n.__c ? p(n.type, n.props, n.key, null, n.__v) : n) : n);
  return u;
}

function P(n, l, u, i, t) {
  var r;

  for (r in u) "children" === r || "key" === r || r in l || N(n, r, null, u[r], i);

  for (r in l) t && "function" != typeof l[r] || "children" === r || "key" === r || "value" === r || "checked" === r || u[r] === l[r] || N(n, r, l[r], u[r], i);
}

function C(n, l, u) {
  "-" === l[0] ? n.setProperty(l, u) : n[l] = "number" == typeof u && !1 === s.test(l) ? u + "px" : null == u ? "" : u;
}

function N(n, l, u, i, t) {
  var r, o, f, e, c;
  if (t ? "className" === l && (l = "class") : "class" === l && (l = "className"), "style" === l) {
    if (r = n.style, "string" == typeof u) r.cssText = u;else {
      if ("string" == typeof i && (r.cssText = "", i = null), i) for (e in i) u && e in u || C(r, e, "");
      if (u) for (c in u) i && u[c] === i[c] || C(r, c, u[c]);
    }
  } else "o" === l[0] && "n" === l[1] ? (o = l !== (l = l.replace(/Capture$/, "")), f = l.toLowerCase(), l = (f in n ? f : l).slice(2), u ? (i || n.addEventListener(l, z, o), (n.l || (n.l = {}))[l] = u) : n.removeEventListener(l, z, o)) : "list" !== l && "tagName" !== l && "form" !== l && "type" !== l && "size" !== l && !t && l in n ? n[l] = null == u ? "" : u : "function" != typeof u && "dangerouslySetInnerHTML" !== l && (l !== (l = l.replace(/^xlink:?/, "")) ? null == u || !1 === u ? n.removeAttributeNS("http://www.w3.org/1999/xlink", l.toLowerCase()) : n.setAttributeNS("http://www.w3.org/1999/xlink", l.toLowerCase(), u) : null == u || !1 === u && !/^ar/.test(l) ? n.removeAttribute(l) : n.setAttribute(l, u));
}

function z(l) {
  this.l[l.type](n.event ? n.event(l) : l);
}

function A(l, u, i, t, r, o, f, e, c) {
  var s,
      v,
      h,
      p,
      y,
      w,
      k,
      g,
      _,
      x,
      P = u.type;

  if (void 0 !== u.constructor) return null;
  (s = n.__b) && s(u);

  try {
    n: if ("function" == typeof P) {
      if (g = u.props, _ = (s = P.contextType) && t[s.__c], x = s ? _ ? _.props.value : s.__ : t, i.__c ? k = (v = u.__c = i.__c).__ = v.__E : ("prototype" in P && P.prototype.render ? u.__c = v = new P(g, x) : (u.__c = v = new m(g, x), v.constructor = P, v.render = E), _ && _.sub(v), v.props = g, v.state || (v.state = {}), v.context = x, v.__n = t, h = v.__d = !0, v.__h = []), null == v.__s && (v.__s = v.state), null != P.getDerivedStateFromProps && (v.__s == v.state && (v.__s = a({}, v.__s)), a(v.__s, P.getDerivedStateFromProps(g, v.__s))), p = v.props, y = v.state, h) null == P.getDerivedStateFromProps && null != v.componentWillMount && v.componentWillMount(), null != v.componentDidMount && v.__h.push(v.componentDidMount);else {
        if (null == P.getDerivedStateFromProps && g !== p && null != v.componentWillReceiveProps && v.componentWillReceiveProps(g, x), !v.__e && null != v.shouldComponentUpdate && !1 === v.shouldComponentUpdate(g, v.__s, x) || u.__v === i.__v && !v.__) {
          for (v.props = g, v.state = v.__s, u.__v !== i.__v && (v.__d = !1), v.__v = u, u.__e = i.__e, u.__k = i.__k, v.__h.length && f.push(v), s = 0; s < u.__k.length; s++) u.__k[s] && (u.__k[s].__ = u);

          break n;
        }

        null != v.componentWillUpdate && v.componentWillUpdate(g, v.__s, x), null != v.componentDidUpdate && v.__h.push(function () {
          v.componentDidUpdate(p, y, w);
        });
      }
      v.context = x, v.props = g, v.state = v.__s, (s = n.__r) && s(u), v.__d = !1, v.__v = u, v.__P = l, s = v.render(v.props, v.state, v.context), u.__k = null != s && s.type == d && null == s.key ? s.props.children : Array.isArray(s) ? s : [s], null != v.getChildContext && (t = a(a({}, t), v.getChildContext())), h || null == v.getSnapshotBeforeUpdate || (w = v.getSnapshotBeforeUpdate(p, y)), b(l, u, i, t, r, o, f, e, c), v.base = u.__e, v.__h.length && f.push(v), k && (v.__E = v.__ = null), v.__e = !1;
    } else null == o && u.__v === i.__v ? (u.__k = i.__k, u.__e = i.__e) : u.__e = $(i.__e, u, i, t, r, o, f, c);

    (s = n.diffed) && s(u);
  } catch (l) {
    u.__v = null, n.__e(l, u, i);
  }

  return u.__e;
}

function T(l, u) {
  n.__c && n.__c(u, l), l.some(function (u) {
    try {
      l = u.__h, u.__h = [], l.some(function (n) {
        n.call(u);
      });
    } catch (l) {
      n.__e(l, u.__v);
    }
  });
}

function $(n, l, u, i, t, r, o, f) {
  var s,
      a,
      v,
      h,
      p,
      y = u.props,
      d = l.props;
  if (t = "svg" === l.type || t, null != r) for (s = 0; s < r.length; s++) if (null != (a = r[s]) && ((null === l.type ? 3 === a.nodeType : a.localName === l.type) || n == a)) {
    n = a, r[s] = null;
    break;
  }

  if (null == n) {
    if (null === l.type) return document.createTextNode(d);
    n = t ? document.createElementNS("http://www.w3.org/2000/svg", l.type) : document.createElement(l.type, d.is && {
      is: d.is
    }), r = null, f = !1;
  }

  if (null === l.type) y !== d && n.data != d && (n.data = d);else {
    if (null != r && (r = c.slice.call(n.childNodes)), v = (y = u.props || e).dangerouslySetInnerHTML, h = d.dangerouslySetInnerHTML, !f) {
      if (y === e) for (y = {}, p = 0; p < n.attributes.length; p++) y[n.attributes[p].name] = n.attributes[p].value;
      (h || v) && (h && v && h.__html == v.__html || (n.innerHTML = h && h.__html || ""));
    }

    P(n, d, y, t, f), h ? l.__k = [] : (l.__k = l.props.children, b(n, l, u, i, "foreignObject" !== l.type && t, r, o, e, f)), f || ("value" in d && void 0 !== (s = d.value) && s !== n.value && N(n, "value", s, y.value, !1), "checked" in d && void 0 !== (s = d.checked) && s !== n.checked && N(n, "checked", s, y.checked, !1));
  }
  return n;
}

function j(l, u, i) {
  try {
    "function" == typeof l ? l(u) : l.current = u;
  } catch (l) {
    n.__e(l, i);
  }
}

function D(l, u, i) {
  var t, r, o;

  if (n.unmount && n.unmount(l), (t = l.ref) && (t.current && t.current !== l.__e || j(t, null, u)), i || "function" == typeof l.type || (i = null != (r = l.__e)), l.__e = l.__d = void 0, null != (t = l.__c)) {
    if (t.componentWillUnmount) try {
      t.componentWillUnmount();
    } catch (l) {
      n.__e(l, u);
    }
    t.base = t.__P = null;
  }

  if (t = l.__k) for (o = 0; o < t.length; o++) t[o] && D(t[o], u, i);
  null != r && v(r);
}

function E(n, l, u) {
  return this.constructor(n, u);
}

function H(l, u, i) {
  var t, r, f;
  n.__ && n.__(l, u), r = (t = i === o) ? null : i && i.__k || u.__k, l = h(d, null, [l]), f = [], A(u, (t ? u : i || u).__k = l, r || e, e, void 0 !== u.ownerSVGElement, i && !t ? [i] : r ? null : c.slice.call(u.childNodes), f, i || e, t), T(f, l);
}

function I(n, l) {
  H(n, l, o);
}

function L(n, l) {
  var u, i;

  for (i in l = a(a({}, n.props), l), arguments.length > 2 && (l.children = c.slice.call(arguments, 2)), u = {}, l) "key" !== i && "ref" !== i && (u[i] = l[i]);

  return p(n.type, u, l.key || n.key, l.ref || n.ref, null);
}

function M(n) {
  var l = {},
      u = {
    __c: "__cC" + f++,
    __: n,
    Consumer: function (n, l) {
      return n.children(l);
    },
    Provider: function (n) {
      var i,
          t = this;
      return this.getChildContext || (i = [], this.getChildContext = function () {
        return l[u.__c] = t, l;
      }, this.shouldComponentUpdate = function (n) {
        t.props.value !== n.value && i.some(function (l) {
          l.context = n.value, g(l);
        });
      }, this.sub = function (n) {
        i.push(n);
        var l = n.componentWillUnmount;

        n.componentWillUnmount = function () {
          i.splice(i.indexOf(n), 1), l && l.call(n);
        };
      }), n.children;
    }
  };
  return u.Consumer.contextType = u, u.Provider.__ = u, u;
}

exports.options = n = {
  __e: function (n, l) {
    for (var u, i; l = l.__;) if ((u = l.__c) && !u.__) try {
      if (u.constructor && null != u.constructor.getDerivedStateFromError && (i = !0, u.setState(u.constructor.getDerivedStateFromError(n))), null != u.componentDidCatch && (i = !0, u.componentDidCatch(n)), i) return g(u.__E = u);
    } catch (l) {
      n = l;
    }

    throw n;
  }
}, exports.isValidElement = l = function (n) {
  return null != n && void 0 === n.constructor;
}, m.prototype.setState = function (n, l) {
  var u;
  u = this.__s !== this.state ? this.__s : this.__s = a({}, this.state), "function" == typeof n && (n = n(u, this.props)), n && a(u, n), null != n && this.__v && (l && this.__h.push(l), g(this));
}, m.prototype.forceUpdate = function (n) {
  this.__v && (this.__e = !0, n && this.__h.push(n), g(this));
}, m.prototype.render = d, u = [], i = 0, t = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, o = e, f = 0;
},{}],"../node_modules/preact/hooks/dist/hooks.module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useState = m;
exports.useReducer = p;
exports.useEffect = l;
exports.useLayoutEffect = y;
exports.useRef = d;
exports.useImperativeHandle = s;
exports.useMemo = h;
exports.useCallback = T;
exports.useContext = w;
exports.useDebugValue = A;
exports.useErrorBoundary = F;

var _preact = require("preact");

var t,
    u,
    r,
    i = 0,
    o = [],
    c = _preact.options.__r,
    f = _preact.options.diffed,
    e = _preact.options.__c,
    a = _preact.options.unmount;

function v(t, r) {
  _preact.options.__h && _preact.options.__h(u, t, i || r), i = 0;
  var o = u.__H || (u.__H = {
    __: [],
    __h: []
  });
  return t >= o.__.length && o.__.push({}), o.__[t];
}

function m(n) {
  return i = 1, p(E, n);
}

function p(n, r, i) {
  var o = v(t++, 2);
  return o.__c || (o.__c = u, o.__ = [i ? i(r) : E(void 0, r), function (t) {
    var u = n(o.__[0], t);
    o.__[0] !== u && (o.__[0] = u, o.__c.setState({}));
  }]), o.__;
}

function l(r, i) {
  var o = v(t++, 3);
  !_preact.options.__s && x(o.__H, i) && (o.__ = r, o.__H = i, u.__H.__h.push(o));
}

function y(r, i) {
  var o = v(t++, 4);
  !_preact.options.__s && x(o.__H, i) && (o.__ = r, o.__H = i, u.__h.push(o));
}

function d(n) {
  return i = 5, h(function () {
    return {
      current: n
    };
  }, []);
}

function s(n, t, u) {
  i = 6, y(function () {
    "function" == typeof n ? n(t()) : n && (n.current = t());
  }, null == u ? u : u.concat(n));
}

function h(n, u) {
  var r = v(t++, 7);
  return x(r.__H, u) ? (r.__H = u, r.__h = n, r.__ = n()) : r.__;
}

function T(n, t) {
  return i = 8, h(function () {
    return n;
  }, t);
}

function w(n) {
  var r = u.context[n.__c],
      i = v(t++, 9);
  return i.__c = n, r ? (null == i.__ && (i.__ = !0, r.sub(u)), r.props.value) : n.__;
}

function A(t, u) {
  _preact.options.useDebugValue && _preact.options.useDebugValue(u ? u(t) : t);
}

function F(n) {
  var r = v(t++, 10),
      i = m();
  return r.__ = n, u.componentDidCatch || (u.componentDidCatch = function (n) {
    r.__ && r.__(n), i[1](n);
  }), [i[0], function () {
    i[1](void 0);
  }];
}

function _() {
  o.some(function (t) {
    if (t.__P) try {
      t.__H.__h.forEach(g), t.__H.__h.forEach(q), t.__H.__h = [];
    } catch (u) {
      return t.__H.__h = [], _preact.options.__e(u, t.__v), !0;
    }
  }), o = [];
}

function g(n) {
  n.t && n.t();
}

function q(n) {
  var t = n.__();

  "function" == typeof t && (n.t = t);
}

function x(n, t) {
  return !n || t.some(function (t, u) {
    return t !== n[u];
  });
}

function E(n, t) {
  return "function" == typeof t ? t(n) : t;
}

_preact.options.__r = function (n) {
  c && c(n), t = 0, (u = n.__c).__H && (u.__H.__h.forEach(g), u.__H.__h.forEach(q), u.__H.__h = []);
}, _preact.options.diffed = function (t) {
  f && f(t);
  var u = t.__c;

  if (u) {
    var i = u.__H;
    i && i.__h.length && (1 !== o.push(u) && r === _preact.options.requestAnimationFrame || ((r = _preact.options.requestAnimationFrame) || function (n) {
      var t,
          u = function () {
        clearTimeout(r), cancelAnimationFrame(t), setTimeout(n);
      },
          r = setTimeout(u, 100);

      "undefined" != typeof window && (t = requestAnimationFrame(u));
    })(_));
  }
}, _preact.options.__c = function (t, u) {
  u.some(function (t) {
    try {
      t.__h.forEach(g), t.__h = t.__h.filter(function (n) {
        return !n.__ || q(n);
      });
    } catch (r) {
      u.some(function (n) {
        n.__h && (n.__h = []);
      }), u = [], _preact.options.__e(r, t.__v);
    }
  }), e && e(t, u);
}, _preact.options.unmount = function (t) {
  a && a(t);
  var u = t.__c;

  if (u) {
    var r = u.__H;
    if (r) try {
      r.__.forEach(function (n) {
        return n.t && n.t();
      });
    } catch (t) {
      _preact.options.__e(t, u.__v);
    }
  }
};
},{"preact":"../node_modules/preact/dist/preact.module.js"}],"../node_modules/preact/compat/dist/compat.module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  version: true,
  Children: true,
  render: true,
  hydrate: true,
  unmountComponentAtNode: true,
  createPortal: true,
  createFactory: true,
  cloneElement: true,
  isValidElement: true,
  findDOMNode: true,
  PureComponent: true,
  memo: true,
  forwardRef: true,
  unstable_batchedUpdates: true,
  Suspense: true,
  SuspenseList: true,
  lazy: true,
  createElement: true,
  createContext: true,
  createRef: true,
  Fragment: true,
  Component: true
};
exports.render = T;
exports.hydrate = V;
exports.unmountComponentAtNode = Q;
exports.createPortal = z;
exports.createFactory = G;
exports.cloneElement = K;
exports.isValidElement = J;
exports.findDOMNode = X;
exports.memo = _;
exports.forwardRef = S;
exports.Suspense = U;
exports.SuspenseList = O;
exports.lazy = L;
Object.defineProperty(exports, "createElement", {
  enumerable: true,
  get: function () {
    return _preact.createElement;
  }
});
Object.defineProperty(exports, "createContext", {
  enumerable: true,
  get: function () {
    return _preact.createContext;
  }
});
Object.defineProperty(exports, "createRef", {
  enumerable: true,
  get: function () {
    return _preact.createRef;
  }
});
Object.defineProperty(exports, "Fragment", {
  enumerable: true,
  get: function () {
    return _preact.Fragment;
  }
});
Object.defineProperty(exports, "Component", {
  enumerable: true,
  get: function () {
    return _preact.Component;
  }
});
exports.unstable_batchedUpdates = exports.PureComponent = exports.Children = exports.version = exports.default = void 0;

var _hooks = require("preact/hooks");

Object.keys(_hooks).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _hooks[key];
    }
  });
});

var _preact = require("preact");

function E(n, t) {
  for (var e in t) n[e] = t[e];

  return n;
}

function w(n, t) {
  for (var e in n) if ("__source" !== e && !(e in t)) return !0;

  for (var r in t) if ("__source" !== r && n[r] !== t[r]) return !0;

  return !1;
}

var C = function (n) {
  var t, e;

  function r(t) {
    var e;
    return (e = n.call(this, t) || this).isPureReactComponent = !0, e;
  }

  return e = n, (t = r).prototype = Object.create(e.prototype), t.prototype.constructor = t, t.__proto__ = e, r.prototype.shouldComponentUpdate = function (n, t) {
    return w(this.props, n) || w(this.state, t);
  }, r;
}(_preact.Component);

exports.PureComponent = C;

function _(n, t) {
  function e(n) {
    var e = this.props.ref,
        r = e == n.ref;
    return !r && e && (e.call ? e(null) : e.current = null), t ? !t(this.props, n) || !r : w(this.props, n);
  }

  function r(t) {
    return this.shouldComponentUpdate = e, (0, _preact.createElement)(n, E({}, t));
  }

  return r.prototype.isReactComponent = !0, r.displayName = "Memo(" + (n.displayName || n.name) + ")", r.t = !0, r;
}

var A = _preact.options.__b;

function S(n) {
  function t(t) {
    var e = E({}, t);
    return delete e.ref, n(e, t.ref);
  }

  return t.prototype.isReactComponent = t.t = !0, t.displayName = "ForwardRef(" + (n.displayName || n.name) + ")", t;
}

_preact.options.__b = function (n) {
  n.type && n.type.t && n.ref && (n.props.ref = n.ref, n.ref = null), A && A(n);
};

var k = function (n, t) {
  return n ? (0, _preact.toChildArray)(n).reduce(function (n, e, r) {
    return n.concat(t(e, r));
  }, []) : null;
},
    R = {
  map: k,
  forEach: k,
  count: function (n) {
    return n ? (0, _preact.toChildArray)(n).length : 0;
  },
  only: function (n) {
    if (1 !== (n = (0, _preact.toChildArray)(n)).length) throw new Error("Children.only() expects only one child.");
    return n[0];
  },
  toArray: _preact.toChildArray
},
    F = _preact.options.__e;

exports.Children = R;

function N(n) {
  return n && ((n = E({}, n)).__c = null, n.__k = n.__k && n.__k.map(N)), n;
}

function U() {
  this.__u = 0, this.o = null, this.__b = null;
}

function M(n) {
  var t = n.__.__c;
  return t && t.u && t.u(n);
}

function L(n) {
  var t, e, r;

  function o(o) {
    if (t || (t = n()).then(function (n) {
      e = n.default || n;
    }, function (n) {
      r = n;
    }), r) throw r;
    if (!e) throw t;
    return (0, _preact.createElement)(e, o);
  }

  return o.displayName = "Lazy", o.t = !0, o;
}

function O() {
  this.i = null, this.l = null;
}

_preact.options.__e = function (n, t, e) {
  if (n.then) for (var r, o = t; o = o.__;) if ((r = o.__c) && r.__c) return r.__c(n, t.__c);
  F(n, t, e);
}, (U.prototype = new _preact.Component()).__c = function (n, t) {
  var e = this;
  null == e.o && (e.o = []), e.o.push(t);

  var r = M(e.__v),
      o = !1,
      u = function () {
    o || (o = !0, r ? r(i) : i());
  };

  t.__c = t.componentWillUnmount, t.componentWillUnmount = function () {
    u(), t.__c && t.__c();
  };

  var i = function () {
    var n;
    if (! --e.__u) for (e.__v.__k[0] = e.state.u, e.setState({
      u: e.__b = null
    }); n = e.o.pop();) n.forceUpdate();
  };

  e.__u++ || e.setState({
    u: e.__b = e.__v.__k[0]
  }), n.then(u, u);
}, U.prototype.render = function (n, t) {
  return this.__b && (this.__v.__k[0] = N(this.__b), this.__b = null), [(0, _preact.createElement)(_preact.Component, null, t.u ? null : n.children), t.u && n.fallback];
};

var P = function (n, t, e) {
  if (++e[1] === e[0] && n.l.delete(t), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.l.size)) for (e = n.i; e;) {
    for (; e.length > 3;) e.pop()();

    if (e[1] < e[0]) break;
    n.i = e = e[2];
  }
};

(O.prototype = new _preact.Component()).u = function (n) {
  var t = this,
      e = M(t.__v),
      r = t.l.get(n);
  return r[0]++, function (o) {
    var u = function () {
      t.props.revealOrder ? (r.push(o), P(t, n, r)) : o();
    };

    e ? e(u) : u();
  };
}, O.prototype.render = function (n) {
  this.i = null, this.l = new Map();
  var t = (0, _preact.toChildArray)(n.children);
  n.revealOrder && "b" === n.revealOrder[0] && t.reverse();

  for (var e = t.length; e--;) this.l.set(t[e], this.i = [1, 0, this.i]);

  return n.children;
}, O.prototype.componentDidUpdate = O.prototype.componentDidMount = function () {
  var n = this;
  n.l.forEach(function (t, e) {
    P(n, e, t);
  });
};

var W = function () {
  function n() {}

  var t = n.prototype;
  return t.getChildContext = function () {
    return this.props.context;
  }, t.render = function (n) {
    return n.children;
  }, n;
}();

function j(n) {
  var t = this,
      e = n.container,
      r = (0, _preact.createElement)(W, {
    context: t.context
  }, n.vnode);
  return t.s && t.s !== e && (t.v.parentNode && t.s.removeChild(t.v), (0, _preact._unmount)(t.h), t.p = !1), n.vnode ? t.p ? (e.__k = t.__k, (0, _preact.render)(r, e), t.__k = e.__k) : (t.v = document.createTextNode(""), (0, _preact.hydrate)("", e), e.appendChild(t.v), t.p = !0, t.s = e, (0, _preact.render)(r, e, t.v), t.__k = t.v.__k) : t.p && (t.v.parentNode && t.s.removeChild(t.v), (0, _preact._unmount)(t.h)), t.h = r, t.componentWillUnmount = function () {
    t.v.parentNode && t.s.removeChild(t.v), (0, _preact._unmount)(t.h);
  }, null;
}

function z(n, t) {
  return (0, _preact.createElement)(j, {
    vnode: n,
    container: t
  });
}

var D = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
_preact.Component.prototype.isReactComponent = {};
var H = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;

function T(n, t, e) {
  if (null == t.__k) for (; t.firstChild;) t.removeChild(t.firstChild);
  return (0, _preact.render)(n, t), "function" == typeof e && e(), n ? n.__c : null;
}

function V(n, t, e) {
  return (0, _preact.hydrate)(n, t), "function" == typeof e && e(), n ? n.__c : null;
}

var Z = _preact.options.event;

function I(n, t) {
  n["UNSAFE_" + t] && !n[t] && Object.defineProperty(n, t, {
    configurable: !1,
    get: function () {
      return this["UNSAFE_" + t];
    },
    set: function (n) {
      this["UNSAFE_" + t] = n;
    }
  });
}

_preact.options.event = function (n) {
  Z && (n = Z(n)), n.persist = function () {};
  var t = !1,
      e = !1,
      r = n.stopPropagation;

  n.stopPropagation = function () {
    r.call(n), t = !0;
  };

  var o = n.preventDefault;
  return n.preventDefault = function () {
    o.call(n), e = !0;
  }, n.isPropagationStopped = function () {
    return t;
  }, n.isDefaultPrevented = function () {
    return e;
  }, n.nativeEvent = n;
};

var $ = {
  configurable: !0,
  get: function () {
    return this.class;
  }
},
    q = _preact.options.vnode;

_preact.options.vnode = function (n) {
  n.$$typeof = H;
  var t = n.type,
      e = n.props;

  if (t) {
    if (e.class != e.className && ($.enumerable = "className" in e, null != e.className && (e.class = e.className), Object.defineProperty(e, "className", $)), "function" != typeof t) {
      var r, o, u;

      for (u in e.defaultValue && void 0 !== e.value && (e.value || 0 === e.value || (e.value = e.defaultValue), delete e.defaultValue), Array.isArray(e.value) && e.multiple && "select" === t && ((0, _preact.toChildArray)(e.children).forEach(function (n) {
        -1 != e.value.indexOf(n.props.value) && (n.props.selected = !0);
      }), delete e.value), e) if (r = D.test(u)) break;

      if (r) for (u in o = n.props = {}, e) o[D.test(u) ? u.replace(/[A-Z0-9]/, "-$&").toLowerCase() : u] = e[u];
    }

    !function (t) {
      var e = n.type,
          r = n.props;

      if (r && "string" == typeof e) {
        var o = {};

        for (var u in r) /^on(Ani|Tra|Tou)/.test(u) && (r[u.toLowerCase()] = r[u], delete r[u]), o[u.toLowerCase()] = u;

        if (o.ondoubleclick && (r.ondblclick = r[o.ondoubleclick], delete r[o.ondoubleclick]), o.onbeforeinput && (r.onbeforeinput = r[o.onbeforeinput], delete r[o.onbeforeinput]), o.onchange && ("textarea" === e || "input" === e.toLowerCase() && !/^fil|che|ra/i.test(r.type))) {
          var i = o.oninput || "oninput";
          r[i] || (r[i] = r[o.onchange], delete r[o.onchange]);
        }
      }
    }(), "function" == typeof t && !t.m && t.prototype && (I(t.prototype, "componentWillMount"), I(t.prototype, "componentWillReceiveProps"), I(t.prototype, "componentWillUpdate"), t.m = !0);
  }

  q && q(n);
};

var B = "16.8.0";
exports.version = B;

function G(n) {
  return _preact.createElement.bind(null, n);
}

function J(n) {
  return !!n && n.$$typeof === H;
}

function K(n) {
  return J(n) ? _preact.cloneElement.apply(null, arguments) : n;
}

function Q(n) {
  return !!n.__k && ((0, _preact.render)(null, n), !0);
}

function X(n) {
  return n && (n.base || 1 === n.nodeType && n) || null;
}

var Y = function (n, t) {
  return n(t);
};

exports.unstable_batchedUpdates = Y;
var _default = {
  useState: _hooks.useState,
  useReducer: _hooks.useReducer,
  useEffect: _hooks.useEffect,
  useLayoutEffect: _hooks.useLayoutEffect,
  useRef: _hooks.useRef,
  useImperativeHandle: _hooks.useImperativeHandle,
  useMemo: _hooks.useMemo,
  useCallback: _hooks.useCallback,
  useContext: _hooks.useContext,
  useDebugValue: _hooks.useDebugValue,
  version: "16.8.0",
  Children: R,
  render: T,
  hydrate: T,
  unmountComponentAtNode: Q,
  createPortal: z,
  createElement: _preact.createElement,
  createContext: _preact.createContext,
  createFactory: G,
  cloneElement: K,
  createRef: _preact.createRef,
  Fragment: _preact.Fragment,
  isValidElement: J,
  findDOMNode: X,
  Component: _preact.Component,
  PureComponent: C,
  memo: _,
  forwardRef: S,
  unstable_batchedUpdates: Y,
  Suspense: U,
  SuspenseList: O,
  lazy: L
};
exports.default = _default;
},{"preact/hooks":"../node_modules/preact/hooks/dist/hooks.module.js","preact":"../node_modules/preact/dist/preact.module.js"}],"../node_modules/@babel/runtime/helpers/inheritsLoose.js":[function(require,module,exports) {
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

module.exports = _inheritsLoose;
},{}],"kwH3":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StyleSheet = void 0;

/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  return tag;
}

var StyleSheet = /*#__PURE__*/function () {
  function StyleSheet(options) {
    this.isSpeedy = options.speedy === undefined ? "production" === 'production' : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      var _tag = createStyleElement(this);

      var before;

      if (this.tags.length === 0) {
        before = this.before;
      } else {
        before = this.tags[this.tags.length - 1].nextSibling;
      }

      this.container.insertBefore(_tag, before);
      this.tags.push(_tag);
    }

    var tag = this.tags[this.tags.length - 1];

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is a really hot path
        // we check the second character first because having "i"
        // as the second character will happen less often than
        // having "@" as the first character
        var isImportRule = rule.charCodeAt(1) === 105 && rule.charCodeAt(0) === 64; // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools

        sheet.insertRule(rule, // we need to insert @import rules before anything else
        // otherwise there will be an error
        // technically this means that the @import rules will
        // _usually_(not always since there could be multiple style tags)
        // be the first ones in prod and generally later in dev
        // this shouldn't really matter in the real world though
        // @import is generally only used for font faces from google fonts and etc.
        // so while this could be technically correct then it would be slower and larger
        // for a tiny bit of correctness that won't matter in the real world
        isImportRule ? 0 : sheet.cssRules.length);
      } catch (e) {
        if ("production" !== 'production') {
          console.warn("There was a problem inserting the following rule: \"" + rule + "\"", e);
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;
  };

  return StyleSheet;
}();

exports.StyleSheet = StyleSheet;
},{}],"../node_modules/@emotion/stylis/dist/stylis.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function stylis_min(W) {
  function M(d, c, e, h, a) {
    for (var m = 0, b = 0, v = 0, n = 0, q, g, x = 0, K = 0, k, u = k = q = 0, l = 0, r = 0, I = 0, t = 0, B = e.length, J = B - 1, y, f = '', p = '', F = '', G = '', C; l < B;) {
      g = e.charCodeAt(l);
      l === J && 0 !== b + n + v + m && (0 !== b && (g = 47 === b ? 10 : 47), n = v = m = 0, B++, J++);

      if (0 === b + n + v + m) {
        if (l === J && (0 < r && (f = f.replace(N, '')), 0 < f.trim().length)) {
          switch (g) {
            case 32:
            case 9:
            case 59:
            case 13:
            case 10:
              break;

            default:
              f += e.charAt(l);
          }

          g = 59;
        }

        switch (g) {
          case 123:
            f = f.trim();
            q = f.charCodeAt(0);
            k = 1;

            for (t = ++l; l < B;) {
              switch (g = e.charCodeAt(l)) {
                case 123:
                  k++;
                  break;

                case 125:
                  k--;
                  break;

                case 47:
                  switch (g = e.charCodeAt(l + 1)) {
                    case 42:
                    case 47:
                      a: {
                        for (u = l + 1; u < J; ++u) {
                          switch (e.charCodeAt(u)) {
                            case 47:
                              if (42 === g && 42 === e.charCodeAt(u - 1) && l + 2 !== u) {
                                l = u + 1;
                                break a;
                              }

                              break;

                            case 10:
                              if (47 === g) {
                                l = u + 1;
                                break a;
                              }

                          }
                        }

                        l = u;
                      }

                  }

                  break;

                case 91:
                  g++;

                case 40:
                  g++;

                case 34:
                case 39:
                  for (; l++ < J && e.charCodeAt(l) !== g;) {}

              }

              if (0 === k) break;
              l++;
            }

            k = e.substring(t, l);
            0 === q && (q = (f = f.replace(ca, '').trim()).charCodeAt(0));

            switch (q) {
              case 64:
                0 < r && (f = f.replace(N, ''));
                g = f.charCodeAt(1);

                switch (g) {
                  case 100:
                  case 109:
                  case 115:
                  case 45:
                    r = c;
                    break;

                  default:
                    r = O;
                }

                k = M(c, r, k, g, a + 1);
                t = k.length;
                0 < A && (r = X(O, f, I), C = H(3, k, r, c, D, z, t, g, a, h), f = r.join(''), void 0 !== C && 0 === (t = (k = C.trim()).length) && (g = 0, k = ''));
                if (0 < t) switch (g) {
                  case 115:
                    f = f.replace(da, ea);

                  case 100:
                  case 109:
                  case 45:
                    k = f + '{' + k + '}';
                    break;

                  case 107:
                    f = f.replace(fa, '$1 $2');
                    k = f + '{' + k + '}';
                    k = 1 === w || 2 === w && L('@' + k, 3) ? '@-webkit-' + k + '@' + k : '@' + k;
                    break;

                  default:
                    k = f + k, 112 === h && (k = (p += k, ''));
                } else k = '';
                break;

              default:
                k = M(c, X(c, f, I), k, h, a + 1);
            }

            F += k;
            k = I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
            break;

          case 125:
          case 59:
            f = (0 < r ? f.replace(N, '') : f).trim();
            if (1 < (t = f.length)) switch (0 === u && (q = f.charCodeAt(0), 45 === q || 96 < q && 123 > q) && (t = (f = f.replace(' ', ':')).length), 0 < A && void 0 !== (C = H(1, f, c, d, D, z, p.length, h, a, h)) && 0 === (t = (f = C.trim()).length) && (f = '\x00\x00'), q = f.charCodeAt(0), g = f.charCodeAt(1), q) {
              case 0:
                break;

              case 64:
                if (105 === g || 99 === g) {
                  G += f + e.charAt(l);
                  break;
                }

              default:
                58 !== f.charCodeAt(t - 1) && (p += P(f, q, g, f.charCodeAt(2)));
            }
            I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
        }
      }

      switch (g) {
        case 13:
        case 10:
          47 === b ? b = 0 : 0 === 1 + q && 107 !== h && 0 < f.length && (r = 1, f += '\x00');
          0 < A * Y && H(0, f, c, d, D, z, p.length, h, a, h);
          z = 1;
          D++;
          break;

        case 59:
        case 125:
          if (0 === b + n + v + m) {
            z++;
            break;
          }

        default:
          z++;
          y = e.charAt(l);

          switch (g) {
            case 9:
            case 32:
              if (0 === n + m + b) switch (x) {
                case 44:
                case 58:
                case 9:
                case 32:
                  y = '';
                  break;

                default:
                  32 !== g && (y = ' ');
              }
              break;

            case 0:
              y = '\\0';
              break;

            case 12:
              y = '\\f';
              break;

            case 11:
              y = '\\v';
              break;

            case 38:
              0 === n + b + m && (r = I = 1, y = '\f' + y);
              break;

            case 108:
              if (0 === n + b + m + E && 0 < u) switch (l - u) {
                case 2:
                  112 === x && 58 === e.charCodeAt(l - 3) && (E = x);

                case 8:
                  111 === K && (E = K);
              }
              break;

            case 58:
              0 === n + b + m && (u = l);
              break;

            case 44:
              0 === b + v + n + m && (r = 1, y += '\r');
              break;

            case 34:
            case 39:
              0 === b && (n = n === g ? 0 : 0 === n ? g : n);
              break;

            case 91:
              0 === n + b + v && m++;
              break;

            case 93:
              0 === n + b + v && m--;
              break;

            case 41:
              0 === n + b + m && v--;
              break;

            case 40:
              if (0 === n + b + m) {
                if (0 === q) switch (2 * x + 3 * K) {
                  case 533:
                    break;

                  default:
                    q = 1;
                }
                v++;
              }

              break;

            case 64:
              0 === b + v + n + m + u + k && (k = 1);
              break;

            case 42:
            case 47:
              if (!(0 < n + m + v)) switch (b) {
                case 0:
                  switch (2 * g + 3 * e.charCodeAt(l + 1)) {
                    case 235:
                      b = 47;
                      break;

                    case 220:
                      t = l, b = 42;
                  }

                  break;

                case 42:
                  47 === g && 42 === x && t + 2 !== l && (33 === e.charCodeAt(t + 2) && (p += e.substring(t, l + 1)), y = '', b = 0);
              }
          }

          0 === b && (f += y);
      }

      K = x;
      x = g;
      l++;
    }

    t = p.length;

    if (0 < t) {
      r = c;
      if (0 < A && (C = H(2, p, r, d, D, z, t, h, a, h), void 0 !== C && 0 === (p = C).length)) return G + p + F;
      p = r.join(',') + '{' + p + '}';

      if (0 !== w * E) {
        2 !== w || L(p, 2) || (E = 0);

        switch (E) {
          case 111:
            p = p.replace(ha, ':-moz-$1') + p;
            break;

          case 112:
            p = p.replace(Q, '::-webkit-input-$1') + p.replace(Q, '::-moz-$1') + p.replace(Q, ':-ms-input-$1') + p;
        }

        E = 0;
      }
    }

    return G + p + F;
  }

  function X(d, c, e) {
    var h = c.trim().split(ia);
    c = h;
    var a = h.length,
        m = d.length;

    switch (m) {
      case 0:
      case 1:
        var b = 0;

        for (d = 0 === m ? '' : d[0] + ' '; b < a; ++b) {
          c[b] = Z(d, c[b], e).trim();
        }

        break;

      default:
        var v = b = 0;

        for (c = []; b < a; ++b) {
          for (var n = 0; n < m; ++n) {
            c[v++] = Z(d[n] + ' ', h[b], e).trim();
          }
        }

    }

    return c;
  }

  function Z(d, c, e) {
    var h = c.charCodeAt(0);
    33 > h && (h = (c = c.trim()).charCodeAt(0));

    switch (h) {
      case 38:
        return c.replace(F, '$1' + d.trim());

      case 58:
        return d.trim() + c.replace(F, '$1' + d.trim());

      default:
        if (0 < 1 * e && 0 < c.indexOf('\f')) return c.replace(F, (58 === d.charCodeAt(0) ? '' : '$1') + d.trim());
    }

    return d + c;
  }

  function P(d, c, e, h) {
    var a = d + ';',
        m = 2 * c + 3 * e + 4 * h;

    if (944 === m) {
      d = a.indexOf(':', 9) + 1;
      var b = a.substring(d, a.length - 1).trim();
      b = a.substring(0, d).trim() + b + ';';
      return 1 === w || 2 === w && L(b, 1) ? '-webkit-' + b + b : b;
    }

    if (0 === w || 2 === w && !L(a, 1)) return a;

    switch (m) {
      case 1015:
        return 97 === a.charCodeAt(10) ? '-webkit-' + a + a : a;

      case 951:
        return 116 === a.charCodeAt(3) ? '-webkit-' + a + a : a;

      case 963:
        return 110 === a.charCodeAt(5) ? '-webkit-' + a + a : a;

      case 1009:
        if (100 !== a.charCodeAt(4)) break;

      case 969:
      case 942:
        return '-webkit-' + a + a;

      case 978:
        return '-webkit-' + a + '-moz-' + a + a;

      case 1019:
      case 983:
        return '-webkit-' + a + '-moz-' + a + '-ms-' + a + a;

      case 883:
        if (45 === a.charCodeAt(8)) return '-webkit-' + a + a;
        if (0 < a.indexOf('image-set(', 11)) return a.replace(ja, '$1-webkit-$2') + a;
        break;

      case 932:
        if (45 === a.charCodeAt(4)) switch (a.charCodeAt(5)) {
          case 103:
            return '-webkit-box-' + a.replace('-grow', '') + '-webkit-' + a + '-ms-' + a.replace('grow', 'positive') + a;

          case 115:
            return '-webkit-' + a + '-ms-' + a.replace('shrink', 'negative') + a;

          case 98:
            return '-webkit-' + a + '-ms-' + a.replace('basis', 'preferred-size') + a;
        }
        return '-webkit-' + a + '-ms-' + a + a;

      case 964:
        return '-webkit-' + a + '-ms-flex-' + a + a;

      case 1023:
        if (99 !== a.charCodeAt(8)) break;
        b = a.substring(a.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify');
        return '-webkit-box-pack' + b + '-webkit-' + a + '-ms-flex-pack' + b + a;

      case 1005:
        return ka.test(a) ? a.replace(aa, ':-webkit-') + a.replace(aa, ':-moz-') + a : a;

      case 1e3:
        b = a.substring(13).trim();
        c = b.indexOf('-') + 1;

        switch (b.charCodeAt(0) + b.charCodeAt(c)) {
          case 226:
            b = a.replace(G, 'tb');
            break;

          case 232:
            b = a.replace(G, 'tb-rl');
            break;

          case 220:
            b = a.replace(G, 'lr');
            break;

          default:
            return a;
        }

        return '-webkit-' + a + '-ms-' + b + a;

      case 1017:
        if (-1 === a.indexOf('sticky', 9)) break;

      case 975:
        c = (a = d).length - 10;
        b = (33 === a.charCodeAt(c) ? a.substring(0, c) : a).substring(d.indexOf(':', 7) + 1).trim();

        switch (m = b.charCodeAt(0) + (b.charCodeAt(7) | 0)) {
          case 203:
            if (111 > b.charCodeAt(8)) break;

          case 115:
            a = a.replace(b, '-webkit-' + b) + ';' + a;
            break;

          case 207:
          case 102:
            a = a.replace(b, '-webkit-' + (102 < m ? 'inline-' : '') + 'box') + ';' + a.replace(b, '-webkit-' + b) + ';' + a.replace(b, '-ms-' + b + 'box') + ';' + a;
        }

        return a + ';';

      case 938:
        if (45 === a.charCodeAt(5)) switch (a.charCodeAt(6)) {
          case 105:
            return b = a.replace('-items', ''), '-webkit-' + a + '-webkit-box-' + b + '-ms-flex-' + b + a;

          case 115:
            return '-webkit-' + a + '-ms-flex-item-' + a.replace(ba, '') + a;

          default:
            return '-webkit-' + a + '-ms-flex-line-pack' + a.replace('align-content', '').replace(ba, '') + a;
        }
        break;

      case 973:
      case 989:
        if (45 !== a.charCodeAt(3) || 122 === a.charCodeAt(4)) break;

      case 931:
      case 953:
        if (!0 === la.test(d)) return 115 === (b = d.substring(d.indexOf(':') + 1)).charCodeAt(0) ? P(d.replace('stretch', 'fill-available'), c, e, h).replace(':fill-available', ':stretch') : a.replace(b, '-webkit-' + b) + a.replace(b, '-moz-' + b.replace('fill-', '')) + a;
        break;

      case 962:
        if (a = '-webkit-' + a + (102 === a.charCodeAt(5) ? '-ms-' + a : '') + a, 211 === e + h && 105 === a.charCodeAt(13) && 0 < a.indexOf('transform', 10)) return a.substring(0, a.indexOf(';', 27) + 1).replace(ma, '$1-webkit-$2') + a;
    }

    return a;
  }

  function L(d, c) {
    var e = d.indexOf(1 === c ? ':' : '{'),
        h = d.substring(0, 3 !== c ? e : 10);
    e = d.substring(e + 1, d.length - 1);
    return R(2 !== c ? h : h.replace(na, '$1'), e, c);
  }

  function ea(d, c) {
    var e = P(c, c.charCodeAt(0), c.charCodeAt(1), c.charCodeAt(2));
    return e !== c + ';' ? e.replace(oa, ' or ($1)').substring(4) : '(' + c + ')';
  }

  function H(d, c, e, h, a, m, b, v, n, q) {
    for (var g = 0, x = c, w; g < A; ++g) {
      switch (w = S[g].call(B, d, x, e, h, a, m, b, v, n, q)) {
        case void 0:
        case !1:
        case !0:
        case null:
          break;

        default:
          x = w;
      }
    }

    if (x !== c) return x;
  }

  function T(d) {
    switch (d) {
      case void 0:
      case null:
        A = S.length = 0;
        break;

      default:
        if ('function' === typeof d) S[A++] = d;else if ('object' === typeof d) for (var c = 0, e = d.length; c < e; ++c) {
          T(d[c]);
        } else Y = !!d | 0;
    }

    return T;
  }

  function U(d) {
    d = d.prefix;
    void 0 !== d && (R = null, d ? 'function' !== typeof d ? w = 1 : (w = 2, R = d) : w = 0);
    return U;
  }

  function B(d, c) {
    var e = d;
    33 > e.charCodeAt(0) && (e = e.trim());
    V = e;
    e = [V];

    if (0 < A) {
      var h = H(-1, c, e, e, D, z, 0, 0, 0, 0);
      void 0 !== h && 'string' === typeof h && (c = h);
    }

    var a = M(O, e, c, 0, 0);
    0 < A && (h = H(-2, a, e, e, D, z, a.length, 0, 0, 0), void 0 !== h && (a = h));
    V = '';
    E = 0;
    z = D = 1;
    return a;
  }

  var ca = /^\0+/g,
      N = /[\0\r\f]/g,
      aa = /: */g,
      ka = /zoo|gra/,
      ma = /([,: ])(transform)/g,
      ia = /,\r+?/g,
      F = /([\t\r\n ])*\f?&/g,
      fa = /@(k\w+)\s*(\S*)\s*/,
      Q = /::(place)/g,
      ha = /:(read-only)/g,
      G = /[svh]\w+-[tblr]{2}/,
      da = /\(\s*(.*)\s*\)/g,
      oa = /([\s\S]*?);/g,
      ba = /-self|flex-/g,
      na = /[^]*?(:[rp][el]a[\w-]+)[^]*/,
      la = /stretch|:\s*\w+\-(?:conte|avail)/,
      ja = /([^-])(image-set\()/,
      z = 1,
      D = 1,
      E = 0,
      w = 1,
      O = [],
      S = [],
      A = 0,
      R = null,
      Y = 0,
      V = '';
  B.use = T;
  B.set = U;
  void 0 !== W && U(W);
  return B;
}

var _default = stylis_min;
exports.default = _default;
},{}],"../node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var weakMemoize = function weakMemoize(func) {
  // $FlowFixMe flow doesn't include all non-primitive types as allowed for weakmaps
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // $FlowFixMe
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

var _default = weakMemoize;
exports.default = _default;
},{}],"dqFm":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sheet = require("@emotion/sheet");

var _stylis = _interopRequireDefault(require("@emotion/stylis"));

require("@emotion/weak-memoize");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/thysultan/stylis.js/tree/master/plugins/rule-sheet
// inlined to avoid umd wrapper and peerDep warnings/installing stylis
// since we use stylis after closure compiler
var delimiter = '/*|*/';
var needle = delimiter + '}';

function toSheet(block) {
  if (block) {
    Sheet.current.insert(block + '}');
  }
}

var Sheet = {
  current: null
};

var ruleSheet = function ruleSheet(context, content, selectors, parents, line, column, length, ns, depth, at) {
  switch (context) {
    // property
    case 1:
      {
        switch (content.charCodeAt(0)) {
          case 64:
            {
              // @import
              Sheet.current.insert(content + ';');
              return '';
            }
          // charcode for l

          case 108:
            {
              // charcode for b
              // this ignores label
              if (content.charCodeAt(2) === 98) {
                return '';
              }
            }
        }

        break;
      }
    // selector

    case 2:
      {
        if (ns === 0) return content + delimiter;
        break;
      }
    // at-rule

    case 3:
      {
        switch (ns) {
          // @font-face, @page
          case 102:
          case 112:
            {
              Sheet.current.insert(selectors[0] + content);
              return '';
            }

          default:
            {
              return content + (at === 0 ? delimiter : '');
            }
        }
      }

    case -2:
      {
        content.split(needle).forEach(toSheet);
      }
  }
};

var createCache = function createCache(options) {
  if (options === undefined) options = {};
  var key = options.key || 'css';
  var stylisOptions;

  if (options.prefix !== undefined) {
    stylisOptions = {
      prefix: options.prefix
    };
  }

  var stylis = new _stylis.default(stylisOptions);

  if ("production" !== 'production') {
    // $FlowFixMe
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var inserted = {}; // $FlowFixMe

  var container;
  {
    container = options.container || document.head;
    var nodes = document.querySelectorAll("style[data-emotion-" + key + "]");
    Array.prototype.forEach.call(nodes, function (node) {
      var attrib = node.getAttribute("data-emotion-" + key); // $FlowFixMe

      attrib.split(' ').forEach(function (id) {
        inserted[id] = true;
      });

      if (node.parentNode !== container) {
        container.appendChild(node);
      }
    });
  }

  var _insert;

  {
    stylis.use(options.stylisPlugins)(ruleSheet);

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      var name = serialized.name;
      Sheet.current = sheet;

      if ("production" !== 'production' && serialized.map !== undefined) {
        var map = serialized.map;
        Sheet.current = {
          insert: function insert(rule) {
            sheet.insert(rule + map);
          }
        };
      }

      stylis(selector, serialized.styles);

      if (shouldCache) {
        cache.inserted[name] = true;
      }
    };
  }

  if ("production" !== 'production') {
    // https://esbench.com/bench/5bf7371a4cd7e6009ef61d0a
    var commentStart = /\/\*/g;
    var commentEnd = /\*\//g;
    stylis.use(function (context, content) {
      switch (context) {
        case -1:
          {
            while (commentStart.test(content)) {
              commentEnd.lastIndex = commentStart.lastIndex;

              if (commentEnd.test(content)) {
                commentStart.lastIndex = commentEnd.lastIndex;
                continue;
              }

              throw new Error('Your styles have an unterminated comment ("/*" without corresponding "*/").');
            }

            commentStart.lastIndex = 0;
            break;
          }
      }
    });
    stylis.use(function (context, content, selectors) {
      switch (context) {
        case -1:
          {
            var flag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';
            var unsafePseudoClasses = content.match(/(:first|:nth|:nth-last)-child/g);

            if (unsafePseudoClasses && cache.compat !== true) {
              unsafePseudoClasses.forEach(function (unsafePseudoClass) {
                var ignoreRegExp = new RegExp(unsafePseudoClass + ".*\\/\\* " + flag + " \\*\\/");
                var ignore = ignoreRegExp.test(content);

                if (unsafePseudoClass && !ignore) {
                  console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
                }
              });
            }

            break;
          }
      }
    });
  }

  var cache = {
    key: key,
    sheet: new _sheet.StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  return cache;
};

var _default = createCache;
exports.default = _default;
},{"@emotion/sheet":"kwH3","@emotion/stylis":"../node_modules/@emotion/stylis/dist/stylis.browser.esm.js","@emotion/weak-memoize":"../node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js"}],"../node_modules/@emotion/utils/dist/utils.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRegisteredStyles = getRegisteredStyles;
exports.insertStyles = void 0;
var isBrowser = "object" !== 'undefined';

function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className]);
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}

var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser === false && cache.compat !== undefined) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }

  if (cache.inserted[serialized.name] === undefined) {
    var current = serialized;

    do {
      var maybeStyles = cache.insert("." + className, current, cache.sheet, true);
      current = current.next;
    } while (current !== undefined);
  }
};

exports.insertStyles = insertStyles;
},{}],"../node_modules/@emotion/hash/dist/hash.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}

var _default = murmur2;
exports.default = _default;
},{}],"../node_modules/@emotion/unitless/dist/unitless.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};
var _default = unitlessKeys;
exports.default = _default;
},{}],"../node_modules/@emotion/memoize/dist/memoize.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function memoize(fn) {
  var cache = {};
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var _default = memoize;
exports.default = _default;
},{}],"WPNE":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeStyles = void 0;

var _hash = _interopRequireDefault(require("@emotion/hash"));

var _unitless = _interopRequireDefault(require("@emotion/unitless"));

var _memoize = _interopRequireDefault(require("@emotion/memoize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var UNDEFINED_AS_OBJECT_KEY_ERROR = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName = (0, _memoize.default)(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (_unitless.default[key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

if ("production" !== 'production') {
  var contentValuePattern = /(attr|calc|counters?|url)\(/;
  var contentValues = ['normal', 'none', 'counter', 'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;
  var msPattern = /^-ms-/;
  var hyphenPattern = /-(.)/g;
  var hyphenatedCache = {};

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        console.error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    var processed = oldProcessStyleValue(key, value);

    if (processed !== '' && !isCustomProperty(key) && key.indexOf('-') !== -1 && hyphenatedCache[key] === undefined) {
      hyphenatedCache[key] = true;
      console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, 'ms-').replace(hyphenPattern, function (str, _char) {
        return _char.toUpperCase();
      }) + "?");
    }

    return processed;
  };
}

var shouldWarnAboutInterpolatingClassNameFromCss = true;

function handleInterpolation(mergedProps, registered, interpolation, couldBeSelectorInterpolation) {
  if (interpolation == null) {
    return '';
  }

  if (interpolation.__emotion_styles !== undefined) {
    if ("production" !== 'production' && interpolation.toString() === 'NO_COMPONENT_SELECTOR') {
      throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
    }

    return interpolation;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        if (interpolation.anim === 1) {
          cursor = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor
          };
          return interpolation.name;
        }

        if (interpolation.styles !== undefined) {
          var next = interpolation.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = interpolation.styles + ";";

          if ("production" !== 'production' && interpolation.map !== undefined) {
            styles += interpolation.map;
          }

          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result, couldBeSelectorInterpolation);
        } else if ("production" !== 'production') {
          console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        break;
      }

    case 'string':
      if ("production" !== 'production') {
        var matched = [];
        var replaced = interpolation.replace(animationRegex, function (match, p1, p2) {
          var fakeVarName = "animation" + matched.length;
          matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, '') + "`");
          return "${" + fakeVarName + "}";
        });

        if (matched.length) {
          console.error('`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\n' + 'Instead of doing this:\n\n' + [].concat(matched, ["`" + replaced + "`"]).join('\n') + '\n\nYou should wrap it with `css` like this:\n\n' + ("css`" + replaced + "`"));
        }
      }

      break;
  } // finalize string values (regular strings and functions interpolated into css calls)


  if (registered == null) {
    return interpolation;
  }

  var cached = registered[interpolation];

  if ("production" !== 'production' && couldBeSelectorInterpolation && shouldWarnAboutInterpolatingClassNameFromCss && cached !== undefined) {
    console.error('Interpolating a className from css`` is not recommended and will cause problems with composition.\n' + 'Interpolating a className from css`` will be completely unsupported in a future major version of Emotion');
    shouldWarnAboutInterpolatingClassNameFromCss = false;
  }

  return cached !== undefined && !couldBeSelectorInterpolation ? cached : interpolation;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i], false);
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];

      if (typeof value !== 'object') {
        if (registered != null && registered[value] !== undefined) {
          string += _key + "{" + registered[value] + "}";
        } else if (isProcessableValue(value)) {
          string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
        }
      } else {
        if (_key === 'NO_COMPONENT_SELECTOR' && "production" !== 'production') {
          throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value, false);

          switch (_key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(_key) + ":" + interpolated + ";";
                break;
              }

            default:
              {
                if ("production" !== 'production' && _key === 'undefined') {
                  console.error(UNDEFINED_AS_OBJECT_KEY_ERROR);
                }

                string += _key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;\n{]+)\s*;/g;
var sourceMapPattern;

if ("production" !== 'production') {
  sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//;
} // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list


var cursor;

var serializeStyles = function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings, false);
  } else {
    if ("production" !== 'production' && strings[0] === undefined) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
    }

    styles += strings[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i], styles.charCodeAt(styles.length - 1) === 46);

    if (stringMode) {
      if ("production" !== 'production' && strings[i] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles += strings[i];
    }
  }

  var sourceMap;

  if ("production" !== 'production') {
    styles = styles.replace(sourceMapPattern, function (match) {
      sourceMap = match;
      return '';
    });
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + // $FlowFixMe we know it's not null
    match[1];
  }

  var name = (0, _hash.default)(styles) + identifierName;

  if ("production" !== 'production') {
    // $FlowFixMe SerializedStyles type doesn't have toString property (and we don't want to add it)
    return {
      name: name,
      styles: styles,
      map: sourceMap,
      next: cursor,
      toString: function toString() {
        return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
      }
    };
  }

  return {
    name: name,
    styles: styles,
    next: cursor
  };
};

exports.serializeStyles = serializeStyles;
},{"@emotion/hash":"../node_modules/@emotion/hash/dist/hash.browser.esm.js","@emotion/unitless":"../node_modules/@emotion/unitless/dist/unitless.browser.esm.js","@emotion/memoize":"../node_modules/@emotion/memoize/dist/memoize.browser.esm.js"}],"../node_modules/@emotion/css/dist/css.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _serialize = require("@emotion/serialize");

function css() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _serialize.serializeStyles)(args);
}

var _default = css;
exports.default = _default;
},{"@emotion/serialize":"WPNE"}],"haMh":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "css", {
  enumerable: true,
  get: function () {
    return _css.default;
  }
});
exports.withEmotionCache = exports.keyframes = exports.jsx = exports.ThemeContext = exports.Global = exports.ClassNames = exports.CacheProvider = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = require("react");

var _cache = _interopRequireDefault(require("@emotion/cache"));

var _utils = require("@emotion/utils");

var _serialize = require("@emotion/serialize");

var _sheet = require("@emotion/sheet");

var _css = _interopRequireDefault(require("@emotion/css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EmotionCacheContext = (0, _react.createContext)( // we're doing this to avoid preconstruct's dead code elimination in this one case
// because this module is primarily intended for the browser and node
// but it's also required in react native and similar environments sometimes
// and we could have a special build just for that
// but this is much easier and the native packages
// might use a different theme context in the future anyway
typeof HTMLElement !== 'undefined' ? (0, _cache.default)() : null);
var ThemeContext = (0, _react.createContext)({});
exports.ThemeContext = ThemeContext;
var CacheProvider = EmotionCacheContext.Provider;
exports.CacheProvider = CacheProvider;

var withEmotionCache = function withEmotionCache(func) {
  var render = function render(props, ref) {
    return (0, _react.createElement)(EmotionCacheContext.Consumer, null, function (cache) {
      return func(props, cache, ref);
    });
  }; // $FlowFixMe


  return (0, _react.forwardRef)(render);
}; // thus we only need to replace what is a valid character for JS, but not for CSS


exports.withEmotionCache = withEmotionCache;

var sanitizeIdentifier = function sanitizeIdentifier(identifier) {
  return identifier.replace(/\$/g, '-');
};

var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__';
var labelPropName = '__EMOTION_LABEL_PLEASE_DO_NOT_USE__';
var hasOwnProperty = Object.prototype.hasOwnProperty;

var render = function render(cache, props, theme, ref) {
  var cssProp = theme === null ? props.css : props.css(theme); // so that using `css` from `emotion` and passing the result to the css prop works
  // not passing the registered cache to serializeStyles because it would
  // make certain babel optimisations not possible

  if (typeof cssProp === 'string' && cache.registered[cssProp] !== undefined) {
    cssProp = cache.registered[cssProp];
  }

  var type = props[typePropName];
  var registeredStyles = [cssProp];
  var className = '';

  if (typeof props.className === 'string') {
    className = (0, _utils.getRegisteredStyles)(cache.registered, registeredStyles, props.className);
  } else if (props.className != null) {
    className = props.className + " ";
  }

  var serialized = (0, _serialize.serializeStyles)(registeredStyles);

  if ("production" !== 'production' && serialized.name.indexOf('-') === -1) {
    var labelFromStack = props[labelPropName];

    if (labelFromStack) {
      serialized = (0, _serialize.serializeStyles)([serialized, 'label:' + labelFromStack + ';']);
    }
  }

  var rules = (0, _utils.insertStyles)(cache, serialized, typeof type === 'string');
  className += cache.key + "-" + serialized.name;
  var newProps = {};

  for (var key in props) {
    if (hasOwnProperty.call(props, key) && key !== 'css' && key !== typePropName && ("production" === 'production' || key !== labelPropName)) {
      newProps[key] = props[key];
    }
  }

  newProps.ref = ref;
  newProps.className = className;
  var ele = (0, _react.createElement)(type, newProps);
  return ele;
};

var Emotion = /* #__PURE__ */withEmotionCache(function (props, cache, ref) {
  // use Context.read for the theme when it's stable
  if (typeof props.css === 'function') {
    return (0, _react.createElement)(ThemeContext.Consumer, null, function (theme) {
      return render(cache, props, theme, ref);
    });
  }

  return render(cache, props, null, ref);
});

if ("production" !== 'production') {
  Emotion.displayName = 'EmotionCssPropInternal';
} // $FlowFixMe


var jsx = function jsx(type, props) {
  var args = arguments;

  if (props == null || !hasOwnProperty.call(props, 'css')) {
    // $FlowFixMe
    return _react.createElement.apply(undefined, args);
  }

  if ("production" !== 'production' && typeof props.css === 'string' && // check if there is a css declaration
  props.css.indexOf(':') !== -1) {
    throw new Error("Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/css' like this: css`" + props.css + "`");
  }

  var argsLength = args.length;
  var createElementArgArray = new Array(argsLength);
  createElementArgArray[0] = Emotion;
  var newProps = {};

  for (var key in props) {
    if (hasOwnProperty.call(props, key)) {
      newProps[key] = props[key];
    }
  }

  newProps[typePropName] = type;

  if ("production" !== 'production') {
    var error = new Error();

    if (error.stack) {
      // chrome
      var match = error.stack.match(/at (?:Object\.|)jsx.*\n\s+at ([A-Z][A-Za-z$]+) /);

      if (!match) {
        // safari and firefox
        match = error.stack.match(/.*\n([A-Z][A-Za-z$]+)@/);
      }

      if (match) {
        newProps[labelPropName] = sanitizeIdentifier(match[1]);
      }
    }
  }

  createElementArgArray[1] = newProps;

  for (var i = 2; i < argsLength; i++) {
    createElementArgArray[i] = args[i];
  } // $FlowFixMe


  return _react.createElement.apply(null, createElementArgArray);
};

exports.jsx = jsx;
var warnedAboutCssPropForGlobal = false;
var Global = /* #__PURE__ */withEmotionCache(function (props, cache) {
  if ("production" !== 'production' && !warnedAboutCssPropForGlobal && ( // check for className as well since the user is
  // probably using the custom createElement which
  // means it will be turned into a className prop
  // $FlowFixMe I don't really want to add it to the type since it shouldn't be used
  props.className || props.css)) {
    console.error("It looks like you're using the css prop on Global, did you mean to use the styles prop instead?");
    warnedAboutCssPropForGlobal = true;
  }

  var styles = props.styles;

  if (typeof styles === 'function') {
    return (0, _react.createElement)(ThemeContext.Consumer, null, function (theme) {
      var serialized = (0, _serialize.serializeStyles)([styles(theme)]);
      return (0, _react.createElement)(InnerGlobal, {
        serialized: serialized,
        cache: cache
      });
    });
  }

  var serialized = (0, _serialize.serializeStyles)([styles]);
  return (0, _react.createElement)(InnerGlobal, {
    serialized: serialized,
    cache: cache
  });
}); // maintain place over rerenders.
// initial render from browser, insertBefore context.sheet.tags[0] or if a style hasn't been inserted there yet, appendChild
// initial client-side render from SSR, use place of hydrating tag

exports.Global = Global;

var InnerGlobal = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2.default)(InnerGlobal, _React$Component);

  function InnerGlobal(props, context, updater) {
    return _React$Component.call(this, props, context, updater) || this;
  }

  var _proto = InnerGlobal.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.sheet = new _sheet.StyleSheet({
      key: this.props.cache.key + "-global",
      nonce: this.props.cache.sheet.nonce,
      container: this.props.cache.sheet.container
    }); // $FlowFixMe

    var node = document.querySelector("style[data-emotion-" + this.props.cache.key + "=\"" + this.props.serialized.name + "\"]");

    if (node !== null) {
      this.sheet.tags.push(node);
    }

    if (this.props.cache.sheet.tags.length) {
      this.sheet.before = this.props.cache.sheet.tags[0];
    }

    this.insertStyles();
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.serialized.name !== this.props.serialized.name) {
      this.insertStyles();
    }
  };

  _proto.insertStyles = function insertStyles$1() {
    if (this.props.serialized.next !== undefined) {
      // insert keyframes
      (0, _utils.insertStyles)(this.props.cache, this.props.serialized.next, true);
    }

    if (this.sheet.tags.length) {
      // if this doesn't exist then it will be null so the style element will be appended
      var element = this.sheet.tags[this.sheet.tags.length - 1].nextElementSibling;
      this.sheet.before = element;
      this.sheet.flush();
    }

    this.props.cache.insert("", this.props.serialized, this.sheet, false);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.sheet.flush();
  };

  _proto.render = function render() {
    return null;
  };

  return InnerGlobal;
}(_react.Component);

var keyframes = function keyframes() {
  var insertable = _css.default.apply(void 0, arguments);

  var name = "animation-" + insertable.name; // $FlowFixMe

  return {
    name: name,
    styles: "@keyframes " + name + "{" + insertable.styles + "}",
    anim: 1,
    toString: function toString() {
      return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
    }
  };
};

exports.keyframes = keyframes;

var classnames = function classnames(args) {
  var len = args.length;
  var i = 0;
  var cls = '';

  for (; i < len; i++) {
    var arg = args[i];
    if (arg == null) continue;
    var toAdd = void 0;

    switch (typeof arg) {
      case 'boolean':
        break;

      case 'object':
        {
          if (Array.isArray(arg)) {
            toAdd = classnames(arg);
          } else {
            toAdd = '';

            for (var k in arg) {
              if (arg[k] && k) {
                toAdd && (toAdd += ' ');
                toAdd += k;
              }
            }
          }

          break;
        }

      default:
        {
          toAdd = arg;
        }
    }

    if (toAdd) {
      cls && (cls += ' ');
      cls += toAdd;
    }
  }

  return cls;
};

function merge(registered, css, className) {
  var registeredStyles = [];
  var rawClassName = (0, _utils.getRegisteredStyles)(registered, registeredStyles, className);

  if (registeredStyles.length < 2) {
    return className;
  }

  return rawClassName + css(registeredStyles);
}

var ClassNames = withEmotionCache(function (props, context) {
  return (0, _react.createElement)(ThemeContext.Consumer, null, function (theme) {
    var hasRendered = false;

    var css = function css() {
      if (hasRendered && "production" !== 'production') {
        throw new Error('css can only be used during render');
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var serialized = (0, _serialize.serializeStyles)(args, context.registered);
      {
        (0, _utils.insertStyles)(context, serialized, false);
      }
      return context.key + "-" + serialized.name;
    };

    var cx = function cx() {
      if (hasRendered && "production" !== 'production') {
        throw new Error('cx can only be used during render');
      }

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return merge(context.registered, css, classnames(args));
    };

    var content = {
      css: css,
      cx: cx,
      theme: theme
    };
    var ele = props.children(content);
    hasRendered = true;
    return ele;
  });
});
exports.ClassNames = ClassNames;
},{"@babel/runtime/helpers/inheritsLoose":"../node_modules/@babel/runtime/helpers/inheritsLoose.js","react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/cache":"dqFm","@emotion/utils":"../node_modules/@emotion/utils/dist/utils.browser.esm.js","@emotion/serialize":"WPNE","@emotion/sheet":"kwH3","@emotion/css":"../node_modules/@emotion/css/dist/css.browser.esm.js"}],"ui/TraktIcon.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const react_1 = require("react");

const core_1 = require("@emotion/core");

let className = core_1.css`
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOC4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMTQ0LjggMTQ0LjgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE0NC44IDE0NC44IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxjaXJjbGUgZmlsbD0iI0ZGRkZGRiIgY3g9IjcyLjQiIGN5PSI3Mi40IiByPSI3Mi40Ii8+DQoJPHBhdGggZmlsbD0iI0VEMjIyNCIgZD0iTTI5LjUsMTExLjhjMTAuNiwxMS42LDI1LjksMTguOCw0Mi45LDE4LjhjOC43LDAsMTYuOS0xLjksMjQuMy01LjNMNTYuMyw4NUwyOS41LDExMS44eiIvPg0KCTxwYXRoIGZpbGw9IiNFRDIyMjQiIGQ9Ik01Ni4xLDYwLjZMMjUuNSw5MS4xTDIxLjQsODdsMzIuMi0zMi4yaDBsMzcuNi0zNy42Yy01LjktMi0xMi4yLTMuMS0xOC44LTMuMWMtMzIuMiwwLTU4LjMsMjYuMS01OC4zLDU4LjMNCgkJYzAsMTMuMSw0LjMsMjUuMiwxMS43LDM1bDMwLjUtMzAuNWwyLjEsMmw0My43LDQzLjdjMC45LTAuNSwxLjctMSwyLjUtMS42TDU2LjMsNzIuN0wyNywxMDJsLTQuMS00LjFsMzMuNC0zMy40bDIuMSwybDUxLDUwLjkNCgkJYzAuOC0wLjYsMS41LTEuMywyLjItMS45bC01NS01NUw1Ni4xLDYwLjZ6Ii8+DQoJPHBhdGggZmlsbD0iI0VEMUMyNCIgZD0iTTExNS43LDExMS40YzkuMy0xMC4zLDE1LTI0LDE1LTM5YzAtMjMuNC0xMy44LTQzLjUtMzMuNi01Mi44TDYwLjQsNTYuMkwxMTUuNywxMTEuNHogTTc0LjUsNjYuOGwtNC4xLTQuMQ0KCQlsMjguOS0yOC45bDQuMSw0LjFMNzQuNSw2Ni44eiBNMTAxLjksMjcuMUw2OC42LDYwLjRsLTQuMS00LjFMOTcuOCwyM0wxMDEuOSwyNy4xeiIvPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGZpbGw9IiNFRDIyMjQiIGQ9Ik03Mi40LDE0NC44QzMyLjUsMTQ0LjgsMCwxMTIuMywwLDcyLjRDMCwzMi41LDMyLjUsMCw3Mi40LDBzNzIuNCwzMi41LDcyLjQsNzIuNA0KCQkJCUMxNDQuOCwxMTIuMywxMTIuMywxNDQuOCw3Mi40LDE0NC44eiBNNzIuNCw3LjNDMzYuNSw3LjMsNy4zLDM2LjUsNy4zLDcyLjRzMjkuMiw2NS4xLDY1LjEsNjUuMXM2NS4xLTI5LjIsNjUuMS02NS4xDQoJCQkJUzEwOC4zLDcuMyw3Mi40LDcuM3oiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K");
  background-repeat: no-repeat;
  background-origin: content-box;
`;

class TraktIcon extends react_1.Component {
  render() {
    return core_1.jsx("div", {
      css: [className, this.props.className]
    });
  }

}

exports.default = TraktIcon;
},{"react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/core":"haMh"}],"ui/ConnectButton.tsx":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const TraktIcon_1 = __importDefault(require("./TraktIcon"));

const react_1 = require("react");

const core_1 = require("@emotion/core");

let className = core_1.css`
  background-color: black;
  border: 1px solid #222;
  border-radius: 5px;
  padding: 2px 7px;
  color: white;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 11px;
  font-weight: normal;
  line-height: normal;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;
const iconStyles = core_1.css`
  height: 14px;
  width: 14px;
  margin-right: 5px;
`;

class ConnectButton extends react_1.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: this.props.api.isAuthenticated()
    };
    this._handleAuthenticationChanged = this._handleAuthenticationChanged.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }

  componentDidMount() {
    this.props.api.onAuthenticationChanged.sub(this._handleAuthenticationChanged);
  }

  componentWillUnmount() {
    this.props.api.onAuthenticationChanged.unsub(this._handleAuthenticationChanged);
  }

  _handleAuthenticationChanged() {
    this.setState({
      isConnected: this.props.api.isAuthenticated()
    });
  }

  _handleClick() {
    let api = this.props.api;

    if (api.isAuthenticated()) {
      api.disconnect();
    } else {
      api.authenticate();
    }
  }

  render() {
    return core_1.jsx("div", {
      css: className,
      onClick: this._handleClick
    }, core_1.jsx(TraktIcon_1.default, {
      className: iconStyles
    }), core_1.jsx("div", {
      css: "text"
    }, this.state.isConnected ? "Disconnect from Trakt" : "Connect with Trakt"));
  }

}

exports.default = ConnectButton;
},{"./TraktIcon":"ui/TraktIcon.tsx","react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/core":"haMh"}],"ui/ScrobbleInfo.tsx":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const TraktRoller_1 = require("../TraktRoller");

const react_1 = require("react");

const core_1 = require("@emotion/core");

const className = core_1.css`
& .info h2 {
  font-size: 17px;
  padding-bottom: 4px;
}
& .info a {
  text-decoration: none;
}
& .info p {
  margin: 0;
}
& .editbutton {
  position: absolute;
  top: 7px;
  right: 7px;
  background: none;
  border: none;
  color: white;
  font-size: 15px;
  cursor: pointer;
}
& .edit {
  display: flex;
  flex-wrap: wrap;
}
& .edit div {
  flex: 0 0 100%;
  margin: 0 5px;
}
& .edit input {
  padding: 5px;
  margin: 5px;
}
& .edit button {
  padding: 5px 10px;
  margin: 5px;
}
& .edit input {
  flex-grow: 1;
}
`;

class ScrobbleInfo extends react_1.Component {
  constructor(props) {
    super(props);
    this._focusUrlInput = false;
    this._onScrobbleStatusChanged = this._onScrobbleStatusChanged.bind(this);
    this.state = {
      scrobbleData: this.props.roller.scrobble.data,
      scrobbleState: this.props.roller.state,
      error: this.props.roller.error,
      isEditing: false,
      lookupUrl: ''
    };
  }

  componentDidMount() {
    this.props.roller.onStateChanged.sub(this._onScrobbleStatusChanged);
  }

  componentWillUnmount() {
    this.props.roller.onStateChanged.unsub(this._onScrobbleStatusChanged);
  }

  _onScrobbleStatusChanged(state) {
    this.setState({
      scrobbleData: this.props.roller.scrobble.data,
      scrobbleState: this.props.roller.state,
      error: this.props.roller.error
    });
  }

  _lookUpUrl() {
    return __awaiter(this, void 0, void 0, function* () {
      let lookupUrl = this.state.lookupUrl;
      this.setState({
        lookupUrl: "",
        isEditing: false
      });

      try {
        yield this.props.roller.lookupTraktUrl(lookupUrl);
      } catch (e) {
        this.setState({
          error: e.message
        });
      }
    });
  }

  render() {
    let data = this.state.scrobbleData;
    let info; // Editing

    if (this.state.isEditing) {
      info = core_1.jsx("div", {
        className: "edit"
      }, core_1.jsx("div", null, "Enter the Trakt URL of the correct movie, show or episode:"), core_1.jsx("input", {
        type: "text",
        value: this.state.lookupUrl,
        ref: ref => {
          if (this._focusUrlInput && ref) {
            ref.focus();
            this._focusUrlInput = false;
          }
        },
        onChange: e => this.setState({
          lookupUrl: e.currentTarget.value
        })
      }), core_1.jsx("button", {
        title: "Update",
        onClick: () => this._lookUpUrl()
      }, "Update")); // Still looking up
    } else if (this.state.scrobbleState == TraktRoller_1.TraktRollerState.Undefined || this.state.scrobbleState == TraktRoller_1.TraktRollerState.Lookup) {
      info = core_1.jsx("div", {
        className: "lookup"
      }, "Loading\u2026"); // Not found
    } else if (this.state.scrobbleState == TraktRoller_1.TraktRollerState.NotFound) {
      info = core_1.jsx("div", {
        className: "error"
      }, core_1.jsx("h2", null, "Failed to scrobble:"), core_1.jsx("p", null, "Could not find matching episode on Trakt")); // Error
    } else if (this.state.scrobbleState == TraktRoller_1.TraktRollerState.Error) {
      info = core_1.jsx("div", {
        className: "error"
      }, core_1.jsx("h2", null, "Failed to scrobble:"), core_1.jsx("p", null, this.state.error)); // Lookup succeeded
    } else if (data) {
      if (data.movie && data.movie.ids) {
        let movieUrl = `https://trakt.tv/movies/${data.movie.ids.slug}`;
        info = core_1.jsx("div", {
          className: "info"
        }, core_1.jsx("h2", null, core_1.jsx("a", {
          href: movieUrl,
          target: "_blank"
        }, data.movie.title, " (", data.movie.year, ")")));
      } else if (data.show && data.show.ids && data.episode && data.episode.ids) {
        let showUrl = `https://trakt.tv/shows/${data.show.ids.slug}`;
        let episodeUrl = `${showUrl}/seasons/${data.episode.season}/episodes/${data.episode.number}`;
        let episodeTitle = data.episode.title ? `: ${data.episode.title}` : null;
        info = core_1.jsx("div", {
          className: "info"
        }, core_1.jsx("h2", null, core_1.jsx("a", {
          href: showUrl,
          target: "_blank"
        }, data.show.title, " (", data.show.year, ")")), core_1.jsx("p", null, core_1.jsx("a", {
          href: episodeUrl,
          target: "_blank"
        }, "Season ", data.episode.season, " Episode ", data.episode.number, episodeTitle)));
      } else {
        info = core_1.jsx("div", {
          className: "error"
        }, core_1.jsx("h2", null, "Internal error:"), core_1.jsx("p", null, "Missing data"));
      }
    }

    return core_1.jsx("div", {
      css: className
    }, core_1.jsx("button", {
      className: "editbutton",
      title: this.state.isEditing ? "Cancel" : "Edit",
      onClick: () => {
        this.setState({
          isEditing: !this.state.isEditing
        });
        this._focusUrlInput = true;
      }
    }, this.state.isEditing ? "✕" : "✍︎"), info);
  }

}

exports.default = ScrobbleInfo;
},{"../TraktRoller":"n8p7","react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/core":"haMh"}],"ui/Button.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const react_1 = require("react");

const core_1 = require("@emotion/core");

const className = core_1.css`
  font-size: 12px;
  font-weight: bold;
  color: #eee;
  background-color: #333;
  border: none;
  border-radius: 3px;
  margin: 5px;
  cursor: pointer;
  padding: 5px 10px 5px 10px;
  flex-grow: 1;
  transition: all 0.2s ease;

  &:hover {
    background-color: #555;
  }
`;

class Button extends react_1.Component {
  render() {
    return core_1.jsx("button", {
      css: [className, this.props.className],
      className: this.props.disabled ? 'disabled' : '',
      onClick: this.props.onClick
    }, this.props.text);
  }

}

exports.default = Button;
},{"react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/core":"haMh"}],"ui/ScrobbleHistory.tsx":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const TraktScrobble_1 = __importDefault(require("../TraktScrobble"));

const Button_1 = __importDefault(require("./Button"));

const react_1 = require("react");

const core_1 = require("@emotion/core");

const className = core_1.css`
  & div {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #666;
    height: 24px;
    align-items: flex-end;
  }

  & button {
    flex-grow: 0;
    font-size: 9px;
    padding: 2px 10px;
    margin-right: 0;
    font-weight: normal;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
  }

  & button:hover {
    background-color: #eb3b14;
  }

  & div:hover button {
    opacity: 1;
    visibility: visible;
  }
`;
const ActionMap = {
  scrobble: "Scrobbled",
  checkin: "Checked in",
  watch: "Watched"
};

class ScrobbleHistory extends react_1.Component {
  constructor(props) {
    super(props);
    this._traktId = 0;
    this._formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
    this.state = {
      historyItems: null
    };
    this._handleHistoryChanged = this._handleHistoryChanged.bind(this);
  }

  componentDidMount() {
    let data = this.props.scrobbleData;
    this._traktId = TraktScrobble_1.default.traktIdFromData(data);

    if (this._traktId !== 0) {
      let type = TraktScrobble_1.default.typeFromData(data);
      this.props.history.sub(this._traktId, this._handleHistoryChanged);
      this.props.history.load(type === "movie" ? "movies" : "episodes", this._traktId);
    }
  }

  componentWillUnmount() {
    this.props.history.unsub(this._traktId, this._handleHistoryChanged);
  }

  _handleHistoryChanged(items) {
    this.setState({
      historyItems: items
    });
  }

  _handleRemove(e, item) {
    return __awaiter(this, void 0, void 0, function* () {
      let el = e.target;
      el.classList.add("disabled");
      el.innerText = "Removing...";
      yield this.props.history.remove(item.id);
      el.classList.remove("disabled");
      el.innerText = "Remove";
    });
  }

  render() {
    if (this.state.historyItems && this.state.historyItems.length > 0) {
      let rows = [];

      for (let item of this.state.historyItems) {
        rows.push(core_1.jsx("div", null, core_1.jsx("span", null, ActionMap[item.action], " at ", this._formatter.format(new Date(item.watched_at))), core_1.jsx(Button_1.default, {
          text: "Remove",
          onClick: e => this._handleRemove(e, item)
        })));
      }

      return core_1.jsx("div", {
        css: className
      }, core_1.jsx("h2", null, "Watch History"), rows);
    } else {
      return null;
    }
  }

}

exports.default = ScrobbleHistory;
},{"../TraktScrobble":"TraktScrobble.ts","./Button":"ui/Button.tsx","react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/core":"haMh"}],"ui/ScrobbleControl.tsx":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Button_1 = __importDefault(require("./Button"));

const react_1 = require("react");

const core_1 = require("@emotion/core");

const TraktScrobble_1 = require("../TraktScrobble");

const className = core_1.css`
  display: flex;
  margin: 5px -5px;
  justify-content: space-between;

  & > div, & > button {
    width: 33%;
  }

  & .state {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    color: #fff;
    background-color: #ed1c24;
    border: none;
    border-radius: 3px;
    margin: 5px;
    padding: 5px 10px 5px 10px;
    width: 20%;
    text-transform: capitalize;
  }
`;
const scrobbleNowStyles = core_1.css`
  color: #8e44ad;
  border: 1px solid #8e44ad;
  background: none;

  &:hover {
    background-color: #8e44ad;
    color: #fff;
  }
`;
const enableScrobbleStyles = core_1.css`
  color: #16a085;
  border: 1px solid #16a085;
  background: none;

  &:hover {
    background-color: #16a085;
    color: #fff;
  }
`;
const EnabledStates = [TraktScrobble_1.TraktScrobbleState.Idle, TraktScrobble_1.TraktScrobbleState.Started, TraktScrobble_1.TraktScrobbleState.Paused];

class ScrobbleControl extends react_1.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrobbleState: this.props.roller.state,
      scrobblingEnabled: this.props.roller.enabled
    };
    this._onScrobbleStateChanged = this._onScrobbleStateChanged.bind(this);
    this._onEnabledChanged = this._onEnabledChanged.bind(this);
    this._handleScrobbleNowClick = this._handleScrobbleNowClick.bind(this);
    this._handleEnableScrobbleClick = this._handleEnableScrobbleClick.bind(this);
  }

  componentDidMount() {
    this.props.roller.onStateChanged.sub(this._onScrobbleStateChanged);
    this.props.roller.onEnabledChanged.sub(this._onEnabledChanged);
  }

  componentWillUnmount() {
    this.props.roller.onStateChanged.unsub(this._onScrobbleStateChanged);
    this.props.roller.onEnabledChanged.unsub(this._onEnabledChanged);
  }

  _onScrobbleStateChanged(state) {
    this.setState({
      scrobbleState: state
    });
  }

  _onEnabledChanged(enabled) {
    this.setState({
      scrobblingEnabled: enabled
    });
  }

  _handleScrobbleNowClick() {
    this.props.roller.scrobble.scrobbleNow();
  }

  _handleEnableScrobbleClick() {
    this.props.roller.enabled = !this.props.roller.enabled;
  }

  render() {
    let state = this.props.roller.enabled ? "Disabled" : this.props.roller.state;
    let title = this.props.roller.error || "";
    let disabled = !(EnabledStates.indexOf(this.state.scrobbleState) >= 0);
    let label = this.props.roller.enabled ? "Enable Scrobbling" : "Disable Scrobbling";
    return core_1.jsx("div", {
      css: className
    }, core_1.jsx("div", {
      className: "state",
      title: title
    }, state), core_1.jsx(Button_1.default, {
      className: scrobbleNowStyles,
      text: "Scrobble Now",
      onClick: this._handleScrobbleNowClick,
      disabled: disabled
    }), core_1.jsx(Button_1.default, {
      className: enableScrobbleStyles,
      text: label,
      onClick: this._handleEnableScrobbleClick
    }));
  }

}

exports.default = ScrobbleControl;
},{"./Button":"ui/Button.tsx","react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/core":"haMh","../TraktScrobble":"TraktScrobble.ts"}],"ui/Popup.tsx":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const TraktScrobble_1 = __importDefault(require("../TraktScrobble"));

const ScrobbleInfo_1 = __importDefault(require("./ScrobbleInfo"));

const ScrobbleHistory_1 = __importDefault(require("./ScrobbleHistory"));

const ScrobbleControl_1 = __importDefault(require("./ScrobbleControl"));

const react_1 = require("react");

const core_1 = require("@emotion/core");

const className = core_1.css`
  color: #eee;
  z-index: 10000;

  & > div {
    padding: 15px;
  }

  & a, & p a {
    color: #eee;
    transition: color 0.2s ease;
  }

  & h2 {
    font-size: 13px;
    margin: 0;
  }

  & h2 a:hover, & p a:hover {
    color: #ed1c24;
    text-decoration: none;
  }

  button.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

class Popup extends react_1.Component {
  constructor(props) {
    super(props);
    this._onScrobbleStatusChanged = this._onScrobbleStatusChanged.bind(this);
    this.state = {
      scrobbleData: this.props.roller.scrobble.data
    };
  }

  componentDidMount() {
    this.props.roller.onStateChanged.sub(this._onScrobbleStatusChanged);
  }

  componentWillUnmount() {
    this.props.roller.onStateChanged.unsub(this._onScrobbleStatusChanged);
  }

  _onScrobbleStatusChanged(state) {
    this.setState({
      scrobbleData: this.props.roller.scrobble.data
    });
  }

  render() {
    let history = null;

    if (this.state.scrobbleData) {
      history = core_1.jsx(ScrobbleHistory_1.default, {
        scrobbleData: this.state.scrobbleData,
        history: this.props.roller.history,
        key: TraktScrobble_1.default.traktIdFromData(this.state.scrobbleData)
      });
    }

    return core_1.jsx("div", {
      css: className
    }, core_1.jsx(ScrobbleInfo_1.default, {
      roller: this.props.roller
    }), history, core_1.jsx(ScrobbleControl_1.default, {
      roller: this.props.roller
    }));
  }

}

exports.default = Popup;
},{"../TraktScrobble":"TraktScrobble.ts","./ScrobbleInfo":"ui/ScrobbleInfo.tsx","./ScrobbleHistory":"ui/ScrobbleHistory.tsx","./ScrobbleControl":"ui/ScrobbleControl.tsx","react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/core":"haMh"}],"ui/StatusButton.tsx":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const TraktIcon_1 = __importDefault(require("./TraktIcon"));

const Popup_1 = __importDefault(require("./Popup"));

const react_1 = require("react");

const core_1 = require("@emotion/core");

const popupClassName = core_1.css`
  background: #161616;
  border: 1px solid #fff;
  position: absolute;
  width: 450px;
  z-index: 10000;
  left: -209px;
  border-radius: 4px;
  transition: all 0.2s ease-in;
  transition-delay: 0.2s;
  visibility: hidden;
  opacity: 0;
  bottom: 55px;

  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: normal;
  line-height: normal;

  &:after, &:before {
    top: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  &:after {
    border-color: rgba(0, 0, 0, 0);
    border-top-color: #000000;
    border-width: 15px;
    margin-left: -15px;
  }
  &:before {
    border-color: rgba(255, 255, 255, 0);
    border-top-color: #fff;
    border-width: 17px;
    margin-left: -17px;
  }
  & .hover-blocker {
    position: absolute;
    bottom: -75px;
    left: 33%;
    width: 33%;
    height: 75px;
  }
`;
const className = core_1.css`
  position: relative;

  &:hover .popup {
    visibility: visible;
    opacity: 1;
    bottom: 44px;
  }
`;
const buttonClassName = core_1.css`
  width: 38px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  z-index: 101;

  &.state-disabled {
    filter: opacity(0.5);
  }
  &.state-scrobbled {
    filter: hue-rotate(150deg) brightness(1.3);
  }
  &.state-error, &.state-notfound {
    filter: grayscale(1) brightness(2);
  }
`;
const iconStyles = core_1.css`
  height: 100%;
`;

class StatusButton extends react_1.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrobbleState: this.props.roller.state,
      enabled: this.props.roller.enabled
    };
    this._onScrobbleStatusChanged = this._onScrobbleStatusChanged.bind(this);
    this._onEnabledChanged = this._onEnabledChanged.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }

  componentDidMount() {
    this.props.roller.onStateChanged.sub(this._onScrobbleStatusChanged);
    this.props.roller.onEnabledChanged.sub(this._onEnabledChanged);
  }

  componentWillUnmount() {
    this.props.roller.onStateChanged.unsub(this._onScrobbleStatusChanged);
    this.props.roller.onEnabledChanged.unsub(this._onEnabledChanged);
  }

  _onScrobbleStatusChanged(state) {
    this.setState({
      scrobbleState: state
    });
  }

  _onEnabledChanged(enabled) {
    this.setState({
      enabled: enabled
    });
  }

  _handleClick() {
    const url = this.props.roller.scrobble.scrobbleUrl();

    if (url != '') {
      window.open(this.props.roller.scrobble.scrobbleUrl(), '_blank');
    }
  }

  render() {
    let state = this.state.enabled ? "disabled" : this.state.scrobbleState;
    let stateClass = "state-" + state;
    let title = this.props.roller.error || this.state.scrobbleState;
    return core_1.jsx("div", {
      css: className
    }, core_1.jsx("button", {
      css: buttonClassName,
      className: stateClass,
      title: title,
      onClick: this._handleClick
    }, core_1.jsx(TraktIcon_1.default, {
      className: iconStyles
    })), core_1.jsx("div", {
      css: popupClassName,
      className: "popup"
    }, core_1.jsx(Popup_1.default, {
      roller: this.props.roller
    }), core_1.jsx("div", {
      className: "hover-blocker"
    })));
  }

}

exports.default = StatusButton;
},{"./TraktIcon":"ui/TraktIcon.tsx","./Popup":"ui/Popup.tsx","react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/core":"haMh"}],"TraktHistory.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const TraktApi_1 = __importDefault(require("./TraktApi"));
/** Load a manage Trakt watched history */


class TraktHistory {
  constructor(api) {
    this._histories = {};
    this._api = api;
  }
  /** Load history for a movie or episode */


  load(type, traktId, reload = false) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!reload && this._histories[traktId] && this._histories[traktId].items) {
        return this._histories[traktId].items;
      }

      let result = yield this._api.history(type, traktId);

      if (TraktApi_1.default.isError(result)) {
        console.error(`TraktRoller: Error loading scrobble history (${result.error})`);
        return [];
      }

      this._update(traktId, result);

      return result;
    });
  }
  /** Add a new item to the history */


  add(traktId, item) {
    let history = this._getOrCreateHistory(traktId);

    if (!history.items) history.items = [];
    history.items.push(item);
    history.items.sort((a, b) => new Date(b.watched_at).valueOf() - new Date(a.watched_at).valueOf());

    this._update(traktId, history.items);
  }
  /** Remove a watched entry by its id */


  remove(historyId) {
    return __awaiter(this, void 0, void 0, function* () {
      let result = yield this._api.historyRemove(historyId);

      if (TraktApi_1.default.isError(result)) {
        console.error(`TraktRoller: Error removing scrobble (${result.error})`);
        return;
      } else if (result.not_found.ids.indexOf(historyId) >= 0) {
        console.warn(`TraktRoller: Could not remove history id ${historyId}, not found on server`);
      }

      outer: for (let traktId of Object.keys(this._histories)) {
        let history = this._histories[traktId];
        if (!history.items) continue;

        for (let i = 0; i < history.items.length; i++) {
          if (history.items[i].id === historyId) {
            history.items.splice(i, 1);

            this._update(history.traktId, history.items);

            break outer;
          }
        }
      }
    });
  }
  /** Get notified when the history changes */


  sub(traktId, callback) {
    let history = this._getOrCreateHistory(traktId);

    history.subscribers.push(callback);
  }
  /** Remove a history subscriber */


  unsub(traktId, callback) {
    let history = this._histories[traktId];
    if (!history) return;
    let index = history.subscribers.indexOf(callback);
    if (index >= 0) history.subscribers.splice(index, 1);
  }

  _getOrCreateHistory(traktId) {
    let history = this._histories[traktId];

    if (!history) {
      history = this._histories[traktId] = {
        traktId: traktId,
        items: null,
        subscribers: []
      };
    }

    return history;
  }

  _update(traktId, items) {
    let history = this._getOrCreateHistory(traktId);

    history.items = items;

    for (let sub of history.subscribers) {
      sub(items);
    }
  }

}

exports.default = TraktHistory;
},{"./TraktApi":"TraktApi.ts"}],"TraktLookup.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const TraktApi_1 = __importStar(require("./TraktApi"));

class TraktLookupError extends Error {
  constructor(message, object) {
    super(message);
    this.associatedObject = object;
  }

}

exports.TraktLookupError = TraktLookupError;
/** Token allowing to cancel the async lookup operation */

class CancellationToken {
  constructor() {
    this._isCancelled = false;
  }

  cancel() {
    this._isCancelled = true;
  }

  get isCancelled() {
    return this._isCancelled;
  }

  static throwIfCancelled(token) {
    if (token && token.isCancelled) {
      throw new CancellationError();
    }
  }

}

exports.CancellationToken = CancellationToken;
/** Error thrown by async lookup method if it has been cancelled */

class CancellationError extends Error {
  constructor() {
    super("The operation has been cancelled.");
  }

}

exports.CancellationError = CancellationError;
/** Look up a show on trakt */

class TraktLookup {
  constructor(client) {
    this._client = client;
  }
  /** Start the lookup */


  start(scrobbleData, cancellation) {
    var _a, _b;

    return __awaiter(this, void 0, void 0, function* () {
      let data = Object.assign({}, scrobbleData);

      if (data.movie === undefined && (data.show === undefined || data.episode === undefined)) {
        throw new TraktLookupError('TraktRoller: either movie or show/episode needs to be set on scrobble data');
      }

      console.log('TraktRoller: looking up media on trakt...', Object.assign({}, data));
      let type = data.movie !== undefined ? 'movie' : 'show';
      let result = null; // Special episodes with fractional episode numbers, e.g. 14.5
      // (Often used for recap episodes)

      let isSpecialEp = data.episode && data.episode.number && data.episode.number % 1 !== 0;

      if (!isSpecialEp) {
        // Start with trakt's automatic matching
        console.log('TraktRoller: trying automatic matching...');
        result = yield this._scrobbleLookup(data);
        CancellationToken.throwIfCancelled(cancellation);
        if (result != null) return result; // Retry automatic matching with absolute episode number

        if (type === 'show' && data.episode && data.episode.number_abs === undefined && data.episode.number !== undefined) {
          let dataAbs = Object.assign({}, data);
          dataAbs.episode = Object.assign({}, dataAbs.episode, {
            number_abs: data.episode.number
          });
          delete dataAbs.episode.number;
          result = yield this._scrobbleLookup(dataAbs);
          CancellationToken.throwIfCancelled(cancellation);
          if (result != null) return result;
        }
      } // Search for item manually


      let title = data.movie !== undefined ? data.movie.title : data.show.title;

      if (!title) {
        throw new TraktLookupError('TraktRoller: No title set');
      }

      console.log('TraktRoller: trying to search manually...');
      let results = yield this._search(type, title);
      CancellationToken.throwIfCancelled(cancellation);

      if (results.length === 0) {
        console.warn(`TraktRoller: manual search for "${title}" returned no results`);
        return null;
      } // Use year to narrow results when available


      const year = type === 'movie' ? (_a = data.movie) === null || _a === void 0 ? void 0 : _a.year : (_b = data.show) === null || _b === void 0 ? void 0 : _b.year;

      if (year) {
        let yearMatches = results.filter(r => {
          var _a, _b;

          return ((_a = r.show) === null || _a === void 0 ? void 0 : _a.year) == year || ((_b = r.movie) === null || _b === void 0 ? void 0 : _b.year) == year;
        });

        if (yearMatches.length > 0) {
          results = yearMatches;
        }
      } // Try search results in order


      for (const found of results) {
        if (type === 'movie') {
          console.log(`TraktRoller: trying result ${found.movie.title}`, found);
          data.movie = found.movie;
        } else {
          console.log(`TraktRoller: trying result ${found.show.title}`, found);
          data.show = found.show;
        } // Look up episode for shows


        if (type === 'show') {
          let episodeResult = yield this._lookupEpisode(data.episode, found.show);
          CancellationToken.throwIfCancelled(cancellation);
          if (episodeResult == null) continue;
          data.episode = episodeResult;
        } // Retry start with new data


        console.log('TraktRoller: re-trying matching');
        result = yield this._scrobbleLookup(data);
        CancellationToken.throwIfCancelled(cancellation);
        if (result != null) return result;
      }

      return null;
    });
  }

  _scrobbleLookup(data) {
    return __awaiter(this, void 0, void 0, function* () {
      let scrobbleResponse = yield this._client.scrobble('pause', data);

      if (TraktApi_1.default.isError(scrobbleResponse, 404)) {
        return null;
      } else if (TraktApi_1.default.isError(scrobbleResponse)) {
        throw new TraktApi_1.TraktApiError(scrobbleResponse);
      }

      let result = Object.assign({}, data);
      if (scrobbleResponse.movie !== undefined) result.movie = scrobbleResponse.movie;
      if (scrobbleResponse.show !== undefined) result.show = scrobbleResponse.show;
      if (scrobbleResponse.episode !== undefined) result.episode = scrobbleResponse.episode;
      console.log('TraktRoller: scrobble lookup succeeded', scrobbleResponse);
      return result;
    });
  }

  _search(type, title) {
    return __awaiter(this, void 0, void 0, function* () {
      // Quote and escape title to avoid special search characters interfereing with the query
      // See https://github.com/trakt/api-help/issues/76
      title = `"${title.replace(/[\\"']/g, '\\$&')}"`;
      const searchResponse = yield this._client.search(type, title);

      if (TraktApi_1.default.isError(searchResponse)) {
        throw new TraktApi_1.TraktApiError(searchResponse);
      }

      const goodMatches = searchResponse.filter(r => r.score > 10);

      if (searchResponse.length > goodMatches.length) {
        if (goodMatches.length === 0) {
          console.log(`TraktRoller: search returned only garbage results.`);
        } else {
          console.log(`TraktRoller: some search results with low scores ignored`);
        }
      }

      return goodMatches;
    });
  }

  _lookupEpisode(episode, show) {
    return __awaiter(this, void 0, void 0, function* () {
      if (episode.number === undefined || episode.season === undefined) {
        throw new TraktLookupError('TraktRoller: data has show but episode is not set or incomplete', episode);
      }

      if (show.ids === undefined || show.ids.trakt === undefined) {
        throw new TraktLookupError('TraktRoller: show data is missing trakt id', show);
      }

      let episodeResult = null;
      const seasonsResponse = yield this._client.seasons(show.ids.trakt, ['episodes', 'full']);

      if (TraktApi_1.default.isError(seasonsResponse, 404)) {
        console.error('TraktRoller: manual lookup could not find seasons');
        return null;
      } else if (TraktApi_1.default.isError(seasonsResponse)) {
        throw new TraktApi_1.TraktApiError(seasonsResponse);
      } // First search in matching season


      const season = seasonsResponse.find(s => s.number === episode.season);

      if (!season) {
        console.warn(`TraktRoller: could not find season ${episode.season} in seasons response`, seasonsResponse);
      } else {
        episodeResult = this._matchEpisodeOrTitle(season, episode.number, episode.title);
      } // Look through all other seasons


      if (episodeResult == null) {
        for (let s of seasonsResponse) {
          if (s === season) continue;
          episodeResult = this._matchEpisodeOrTitle(s, episode.number, episode.title);
          if (episodeResult != null) break;
        }
      }

      return episodeResult;
    });
  }

  _matchEpisodeOrTitle(season, episode, title) {
    if (!season.episodes) {
      throw new TraktLookupError(`TraktRoller: Missing episodes array in season object`, season);
    }

    let numberMatch = season.episodes.filter(e => e.number === episode || e.number_abs === episode);

    if (numberMatch.length > 1) {
      console.error(`TraktRoller: got multiple episode #${episode} in season`, season);
      return null;
    } else if (numberMatch.length == 1) {
      console.log(`TraktRoller: found episode using episode number`, numberMatch[0]);
      return numberMatch[0];
    }

    if (title) {
      const filteredTitle = this._filterEpisodeTitle(title);

      let titleMatch = season.episodes.filter(e => e.title && this._filterEpisodeTitle(e.title) === filteredTitle);

      if (titleMatch.length > 1) {
        console.error(`TraktRoller: got multiple episodes titled "${title}" in show`, season);
        return null;
      } else if (titleMatch.length == 1) {
        console.log(`TraktRoller: found episode using episode title`, titleMatch[0]);
        return titleMatch[0];
      }
    }

    return null;
  }

  _filterEpisodeTitle(title) {
    if (!title) debugger;
    return title.replace(/[^\w\s]/gi, '').toLowerCase();
  }

}

exports.default = TraktLookup;
},{"./TraktApi":"TraktApi.ts"}],"../node_modules/player.js/dist/player-0.1.0.js":[function(require,module,exports) {
var define;
/*! Player.js - v0.1.0 - 2017-10-24
* http://github.com/embedly/player.js
* Copyright (c) 2017 Embedly; Licensed BSD */
(function(window, document){
var playerjs = {};

playerjs.DEBUG = false;
playerjs.VERSION = '0.0.11';
playerjs.CONTEXT = 'player.js';
playerjs.POST_MESSAGE = !!window.postMessage;

/*
* Utils.
*/
playerjs.origin = function(url){
  // Grab the origin of a URL
  if (url.substr(0, 2) === '//'){
    url = window.location.protocol + url;
  }

  return url.split('/').slice(0,3).join('/');
};

playerjs.addEvent = function(elem, type, eventHandle) {
  if (!elem) { return; }
  if ( elem.addEventListener ) {
    elem.addEventListener( type, eventHandle, false );
  } else if ( elem.attachEvent ) {
    elem.attachEvent( "on" + type, eventHandle );
  } else {
    elem["on"+type]=eventHandle;
  }
};

// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
playerjs.log = function(){
  playerjs.log.history = playerjs.log.history || [];   // store logs to an array for reference
  playerjs.log.history.push(arguments);
  if(window.console && playerjs.DEBUG){
    window.console.log( Array.prototype.slice.call(arguments) );
  }
};

// isFunctions
playerjs.isString = function (obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
};

playerjs.isObject = function(obj){
  return Object.prototype.toString.call(obj) === "[object Object]";
};

playerjs.isArray = function(obj){
  return Object.prototype.toString.call(obj) === "[object Array]";
};

playerjs.isNone = function(obj){
  return (obj === null || obj === undefined);
};

playerjs.has = function(obj, key){
  return Object.prototype.hasOwnProperty.call(obj, key);
};

// ie8 doesn't support indexOf in arrays, based on underscore.
playerjs.indexOf = function(array, item) {
  if (array == null){ return -1; }
  var i = 0, length = array.length;
  if (Array.prototype.IndexOf && array.indexOf === Array.prototype.IndexOf) {
    return array.indexOf(item);
  }
  for (; i < length; i++) {
    if (array[i] === item) { return i; }
  }
  return -1;
};

// Assert
playerjs.assert = function(test, msg) {
  if (!test) {
    throw msg || "Player.js Assert Failed";
  }
};
/*
* Keeper is just a method for keeping track of all the callbacks.
*/

playerjs.Keeper = function(){
  this.init();
};

playerjs.Keeper.prototype.init = function(){
  this.data = {};
};

playerjs.Keeper.prototype.getUUID = function(){
  // Create a random id. #http://stackoverflow.com/a/2117523/564191
  return 'listener-xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
};

playerjs.Keeper.prototype.has = function(event, id){
  if (!this.data.hasOwnProperty(event)){
    return false;
  }

  if (playerjs.isNone(id)){
    return true;
  }

  // Figure out if we have the event.
  var events = this.data[event];

  for (var i = 0; i < events.length; i++){
    if (events[i].id === id){
      return true;
    }
  }

  return false;
};

playerjs.Keeper.prototype.add = function(id, event, cb, ctx, one){
  var d = {
    id: id,
    event: event,
    cb: cb,
    ctx: ctx,
    one: one
  };

  if (this.has(event)){
    this.data[event].push(d);
  } else {
    this.data[event] = [d];
  }
};

playerjs.Keeper.prototype.execute = function(event, id, data, ctx){
  if (!this.has(event, id)){
    return false;
  }

  var keep = [],
    execute = [];

  for (var i=0; i< this.data[event].length; i++){
    var d = this.data[event][i];

    // There are omni events, in that they do not have an id. i.e "ready".
    // Or there is an ID and we only want to execute the right id'd method.
    if (playerjs.isNone(id) || (!playerjs.isNone(id) && d.id === id )){

      execute.push({
        cb: d.cb,
        ctx: d.ctx? d.ctx: ctx,
        data: data
      });

      // If we only wanted to execute this once.
      if (d.one === false){
        keep.push(d);
      }
    } else {
      keep.push(d);
    }
  }

  if (keep.length === 0){
    delete this.data[event];
  } else {
    this.data[event] = keep;
  }

  // We need to execute everything after we deal with the one stuff. otherwise
  // we have issues to order of operations.
  for (var n=0; n < execute.length; n++){
    var e = execute[n];
    e.cb.call(e.ctx, e.data);
  }
};

playerjs.Keeper.prototype.on = function(id, event, cb, ctx){
  this.add(id, event, cb, ctx, false);
};

playerjs.Keeper.prototype.one = function(id, event, cb, ctx){
  this.add(id, event, cb, ctx, true);
};

playerjs.Keeper.prototype.off = function(event, cb){
  // We should probably restructure so this is a bit less of a pain.
  var listeners = [];

  if (!this.data.hasOwnProperty(event)){
    return listeners;
  }

  var keep = [];

  // Loop through everything.
  for (var i=0; i< this.data[event].length; i++){
    var data = this.data[event][i];
    // If we only keep if there was a CB and the CB is there.
    if (!playerjs.isNone(cb) && data.cb !== cb) {
      keep.push(data);
    } else if (!playerjs.isNone(data.id)) {
      listeners.push(data.id);
    }
  }

  if (keep.length === 0){
    delete this.data[event];
  } else {
    this.data[event] = keep;
  }

  return listeners;
};

/*
* Player.js is a javascript library for interacting with iframes via
* postMessage that use an Open Player Spec
*
*/

playerjs.Player = function(elem, options){
  if (!(this instanceof playerjs.Player)) {
    return new playerjs.Player(elem, options);
  }
  this.init(elem, options);
};

playerjs.EVENTS = {
  READY: 'ready',
  PLAY: 'play',
  PAUSE: 'pause',
  ENDED: 'ended',
  TIMEUPDATE: 'timeupdate',
  PROGRESS: 'progress',
  ERROR: 'error'
};

playerjs.EVENTS.all = function(){
  var all = [];
  for (var key in playerjs.EVENTS) {
    if (playerjs.has(playerjs.EVENTS, key) && playerjs.isString(playerjs.EVENTS[key])) {
      all.push(playerjs.EVENTS[key]);
    }
  }
  return all;
};

playerjs.METHODS = {
  PLAY: 'play',
  PAUSE: 'pause',
  GETPAUSED: 'getPaused',
  MUTE: 'mute',
  UNMUTE: 'unmute',
  GETMUTED: 'getMuted',
  SETVOLUME: 'setVolume',
  GETVOLUME: 'getVolume',
  GETDURATION: 'getDuration',
  SETCURRENTTIME: 'setCurrentTime',
  GETCURRENTTIME:'getCurrentTime',
  SETLOOP: 'setLoop',
  GETLOOP: 'getLoop',
  REMOVEEVENTLISTENER: 'removeEventListener',
  ADDEVENTLISTENER: 'addEventListener'
};

playerjs.METHODS.all = function(){
  var all = [];
  for (var key in playerjs.METHODS) {
    if (playerjs.has(playerjs.METHODS, key) && playerjs.isString(playerjs.METHODS[key])) {
      all.push(playerjs.METHODS[key]);
    }
  }
  return all;
};

playerjs.READIED = [];

playerjs.Player.prototype.init = function(elem, options){

  var self = this;

  if (playerjs.isString(elem)){
    elem = document.getElementById(elem);
  }

  this.elem = elem;

  // make sure we have an iframe
  playerjs.assert(elem.nodeName === 'IFRAME',
    'playerjs.Player constructor requires an Iframe, got "'+elem.nodeName+'"');
  playerjs.assert(elem.src,
    'playerjs.Player constructor requires a Iframe with a \'src\' attribute.');

  // Figure out the origin of where we are sending messages.
  this.origin = playerjs.origin(elem.src);

  // Event handling.
  this.keeper = new playerjs.Keeper();

  // Queuing before ready.
  this.isReady = false;
  this.queue = [];

  // Assume that everything is supported, unless we know otherwise.
  this.events = playerjs.EVENTS.all();
  this.methods = playerjs.METHODS.all();

  if (playerjs.POST_MESSAGE){
    // Set up the reciever.
    playerjs.addEvent(window, 'message', function(e){
      self.receive(e);
    });
  } else {
    playerjs.log('Post Message is not Available.');
  }

  // See if we caught the src event first, otherwise assume we haven't loaded
  if (playerjs.indexOf(playerjs.READIED, elem.src) > -1){
    self.loaded = true;
  } else {
    // Try the onload event, just lets us give another test.
    this.elem.onload = function(){
      self.loaded = true;
    };
  }
};

playerjs.Player.prototype.send = function(data, callback, ctx){
  // Add the context and version to the data.
  data.context = playerjs.CONTEXT;
  data.version = playerjs.VERSION;

  // We are expecting a response.
  if (callback) {
    // Create a UUID
    var id = this.keeper.getUUID();

    // Set the listener.
    data.listener = id;

    // Only hang on to this listener once.
    this.keeper.one(id, data.method, callback, ctx);
  }

  if (!this.isReady && data.value !== 'ready'){
    playerjs.log('Player.queue', data);
    this.queue.push(data);
    return false;
  }

  playerjs.log('Player.send', data, this.origin);

  if (this.loaded === true){
    this.elem.contentWindow.postMessage(JSON.stringify(data), this.origin);
  }

  return true;
};

playerjs.Player.prototype.receive = function(e){
  playerjs.log('Player.receive', e);

  if (e.origin !== this.origin){
    return false;
  }

  var data;
  try {
    data = JSON.parse(e.data);
  } catch (err){
    // Not a valid response.
    return false;
  }

  // abort if this message wasn't a player.js message
  if (data.context !== playerjs.CONTEXT) {
    return false;
  }

  // We need to determine if we are ready.
  if (data.event === 'ready' && data.value && data.value.src === this.elem.src){
    this.ready(data);
  }

  if (this.keeper.has(data.event, data.listener)){
    this.keeper.execute(data.event, data.listener, data.value, this);
  }
};


playerjs.Player.prototype.ready = function(data){

  if (this.isReady === true){
    return false;
  }

  // If we got a list of supported methods, we should set them.
  if (data.value.events){
    this.events = data.value.events;
  }
  if (data.value.methods){
    this.methods = data.value.methods;
  }

  // set ready.
  this.isReady = true;
  this.loaded = true;

  // Clear the queue
  for (var i=0; i<this.queue.length; i++){
    var obj = this.queue[i];

    playerjs.log('Player.dequeue', obj);

    if (data.event === 'ready'){
      this.keeper.execute(obj.event, obj.listener, true, this);
    }
    this.send(obj);
  }
  this.queue = [];
};

playerjs.Player.prototype.on = function(event, callback, ctx){
  var id = this.keeper.getUUID();

  if (event === 'ready'){
    // We only want to call ready once.
    this.keeper.one(id, event, callback, ctx);
  } else {
    this.keeper.on(id, event, callback, ctx);
  }

  this.send({
    method: 'addEventListener',
    value: event,
    listener: id
  });

  return true;
};

playerjs.Player.prototype.off = function(event, callback){

  var listeners = this.keeper.off(event, callback);
  playerjs.log('Player.off', listeners);

  if (listeners.length > 0) {
    for (var i in listeners){
      this.send({
        method: 'removeEventListener',
        value: event,
        listener: listeners[i]
      });
      return true;
    }
  }

  return false;
};

// Based on what ready passed back, we can determine if the events/method are
// supported by the player.
playerjs.Player.prototype.supports = function(evtOrMethod, names){

  playerjs.assert(playerjs.indexOf(['method', 'event'], evtOrMethod) > -1,
    'evtOrMethod needs to be either "event" or "method" got ' + evtOrMethod);

  // Make everything an array.
  names = playerjs.isArray(names) ? names : [names];

  var all = evtOrMethod === 'event' ? this.events : this.methods;

  for (var i=0; i < names.length; i++){
    if (playerjs.indexOf(all, names[i]) === -1){
      return false;
    }
  }

  return true;
};

//create function to add to the Player prototype
function createPrototypeFunction(name) {

  return function() {

    var data = {
      method: name
    };

    var args = Array.prototype.slice.call(arguments);

    //for getters add the passed parameters to the arguments for the send call
    if (/^get/.test(name)) {
      playerjs.assert(args.length > 0, 'Get methods require a callback.');
      args.unshift(data);
    } else {
      //for setter add the first arg to the value field
      if (/^set/.test(name)) {
        playerjs.assert(args.length !== 0, 'Set methods require a value.');
        data.value = args[0];
      }
      args = [data];
    }

    this.send.apply(this, args);
  };
}

// Loop through the methods to add them to the prototype.
for (var i = 0, l = playerjs.METHODS.all().length; i < l; i++) {
  var methodName = playerjs.METHODS.all()[i];

  // We don't want to overwrite existing methods.
  if (!playerjs.Player.prototype.hasOwnProperty(methodName)){
    playerjs.Player.prototype[methodName] = createPrototypeFunction(methodName);
  }
}

// We need to catch all ready events in case the iframe is ready before the
// player is invoked.
playerjs.addEvent(window, 'message', function(e){
  var data;
  try {
    data = JSON.parse(e.data);
  } catch (err){
    return false;
  }

  // abort if this message wasn't a player.js message
  if (data.context !== playerjs.CONTEXT) {
    return false;
  }

  // We need to determine if we are ready.
  if (data.event === 'ready' && data.value && data.value.src){
    playerjs.READIED.push(data.value.src);
  }
});

/*
* Does all the wiring up for the backend.
*
* var receiver = new playerjs.Receiver();
* receiver.on('play', function(){ video.play() });
* receiver.on('getDuration', function(callback){ callback(video.duration) });
* receiver.emit('timeupdate', {});
*/

playerjs.Receiver = function(events, methods){
  this.init(events, methods);
};

playerjs.Receiver.prototype.init = function(events, methods){
  var self = this;

  // Deal with the ready crap.
  this.isReady = false;

  // Bind the window message.
  this.origin = playerjs.origin(document.referrer);

  //Create a holder for all the methods.
  this.methods = {};

  // holds all the information about what's supported
  this.supported = {
    events: events ? events : playerjs.EVENTS.all(),
    methods: methods ? methods : playerjs.METHODS.all()
  };

  // Deals with the adding and removing of event listeners.
  this.eventListeners = {};

  // We can't send any messages.
  this.reject = !(window.self !== window.top && playerjs.POST_MESSAGE);

  // We aren't in an iframe, don't listen.
  if (!this.reject){
    playerjs.addEvent(window, 'message', function(e){
      self.receive(e);
    });
  }
};

playerjs.Receiver.prototype.receive = function(e){
  // Only want to listen to events that came from our origin.
  if (e.origin !== this.origin){
    return false;
  }

  // Browsers that support postMessage also support JSON.
  var data = {};
  if (playerjs.isObject(e.data)){
    data = e.data;
  } else {
    try {
      data = window.JSON.parse(e.data);
    } catch (err){
      playerjs.log('JSON Parse Error', err);
    }
  }

  playerjs.log('Receiver.receive', e, data);

  // Nothing for us to do.
  if (!data.method){
    return false;
  }

  // make sure the context is correct.
  if (data.context !== playerjs.CONTEXT){
    return false;
  }

  // Make sure we have a valid method.
  if (playerjs.indexOf(playerjs.METHODS.all(), data.method) === -1){
    this.emit('error', {
      code: 2,
      msg: 'Invalid Method "'+data.method+'"'
    });
    return false;
  }

  // See if we added a listener
  var listener = !playerjs.isNone(data.listener) ? data.listener : null;

  // Add Event Listener.
  if (data.method === 'addEventListener') {
    if (this.eventListeners.hasOwnProperty(data.value)) {
      //If the listener is the same, i.e. null only add it once.
      if (playerjs.indexOf(this.eventListeners[data.value], listener) === -1){
        this.eventListeners[data.value].push(listener);
      }
    } else {
      this.eventListeners[data.value] = [listener];
    }

    if (data.value === 'ready' && this.isReady){
      this.ready();
    }
  }
  // Remove the event listener.
  else if (data.method === 'removeEventListener') {
    if (this.eventListeners.hasOwnProperty(data.value)) {
      var index = playerjs.indexOf(this.eventListeners[data.value], listener);

      // if we find the element, remove it.
      if (index > -1){
        this.eventListeners[data.value].splice(index, 1);
      }

      if (this.eventListeners[data.value].length === 0){
        delete this.eventListeners[data.value];
      }
    }
  }
  // Go get it.
  else {
    this.get(data.method, data.value, listener);
  }
};

playerjs.Receiver.prototype.get = function(method, value, listener){
  var self = this;

  // Now lets do it.
  if (!this.methods.hasOwnProperty(method)){
    this.emit('error', {
      code: 3,
      msg: 'Method Not Supported"'+method+'"'
    });
    return false;
  }

  var func = this.methods[method];

  if (method.substr(0,3) === 'get') {
    var callback = function(val){
      self.send(method, val, listener);
    };
    func.call(this, callback);
  } else {
    func.call(this, value);
  }
};

playerjs.Receiver.prototype.on = function(event, callback){
  this.methods[event] = callback;
};

playerjs.Receiver.prototype.send = function(event, value, listener){

  playerjs.log('Receiver.send', event, value, listener);

  if (this.reject){
    // We are not in a frame, or we don't support POST_MESSAGE
    playerjs.log('Receiver.send.reject', event, value, listener);
    return false;
  }

  var data = {
    context: playerjs.CONTEXT,
    version: playerjs.VERSION,
    event: event
  };

  if (!playerjs.isNone(value)){
    data.value = value;
  }

  if (!playerjs.isNone(listener)){
    data.listener = listener;
  }

  var msg = JSON.stringify(data);
  window.parent.postMessage(msg, this.origin === "" ? '*' : this.origin);
};

playerjs.Receiver.prototype.emit = function(event, value){

  if (!this.eventListeners.hasOwnProperty(event)){
    return false;
  }

  playerjs.log('Instance.emit', event, value, this.eventListeners[event]);

  for (var i=0; i < this.eventListeners[event].length; i++){
    var listener = this.eventListeners[event][i];
    this.send(event, value, listener);
  }

  return true;
};

playerjs.Receiver.prototype.ready = function(){
  playerjs.log('Receiver.ready');
  this.isReady = true;

  var data = {
    src: window.location.toString(),
    events: this.supported.events,
    methods: this.supported.methods
  };

  if (!this.emit('ready', data)){
    this.send('ready', data);
  }

};

playerjs.HTML5Adapter = function(video){
  if (!(this instanceof playerjs.HTML5Adapter)) {
    return new playerjs.HTML5Adapter(video);
  }
  this.init(video);
};

playerjs.HTML5Adapter.prototype.init = function(video){

  playerjs.assert(video, 'playerjs.HTML5Adapter requires a video element');

  // Set up the actual receiver
  var receiver = this.receiver = new playerjs.Receiver();

  /* EVENTS */
  video.addEventListener('playing', function(){
    receiver.emit('play');
  });

  video.addEventListener('pause', function(){
    receiver.emit('pause');
  });

  video.addEventListener('ended', function(){
    receiver.emit('ended');
  });

  video.addEventListener('timeupdate', function(){
    receiver.emit('timeupdate', {
      seconds: video.currentTime,
      duration: video.duration
    });
  });

  video.addEventListener('progress', function(){
    receiver.emit('buffered', {
      percent: video.buffered.length
    });
  });

  /* Methods */
  receiver.on('play', function(){
    video.play();
  });

  receiver.on('pause', function(){
    video.pause();
  });

  receiver.on('getPaused', function(callback){
    callback(video.paused);
  });

  receiver.on('getCurrentTime', function(callback){
    callback(video.currentTime);
  });

  receiver.on('setCurrentTime', function(value){
    video.currentTime = value;
  });

  receiver.on('getDuration', function(callback){
    callback(video.duration);
  });

  receiver.on('getVolume', function(callback){
    callback(video.volume * 100);
  });

  receiver.on('setVolume', function(value){
    video.volume = value/100;
  });

  receiver.on('mute', function(){
    video.muted = true;
  });

  receiver.on('unmute', function(){
    video.muted = false;
  });

  receiver.on('getMuted', function(callback){
    callback(video.muted);
  });

  receiver.on('getLoop', function(callback){
    callback(video.loop);
  });

  receiver.on('setLoop', function(value){
    video.loop = value;
  });
};

/* Call when the video has loaded */
playerjs.HTML5Adapter.prototype.ready = function(){
  this.receiver.ready();
};

//http://www.longtailvideo.com/support/jw-player/28851/javascript-api-reference
playerjs.JWPlayerAdapter = function(player){
  if (!(this instanceof playerjs.JWPlayerAdapter)) {
    return new playerjs.JWPlayerAdapter(player);
  }
  this.init(player);
};

playerjs.JWPlayerAdapter.prototype.init = function(player){

  playerjs.assert(player, 'playerjs.JWPlayerAdapter requires a player object');

  // Set up the actual receiver
  var receiver = this.receiver = new playerjs.Receiver();

  // JWPlayer doesn't have a seLoop, so we can do it ourself.
  this.looped = false;

  /* EVENTS */
  player.on('pause', function(){
    receiver.emit('pause');
  });

  player.on('play', function(){
    receiver.emit('play');
  });

  player.on('time', function(e){
    var seconds = e.position,
      duration = e.duration;

    if (!seconds || !duration){
      return false;
    }

    var value = {
      seconds: seconds,
      duration: duration
    };
    receiver.emit('timeupdate', value);
  });

  var self = this;
  player.on('complete', function(){
    // Fake the looping
    if (self.looped === true){
      // By default jwplayer seeks after play.
      player.seek(0);
    } else {
      // Else throw the ended event.
      receiver.emit('ended');
    }
  });

  player.on('error', function(){
    receiver.emit('error');
  });


  /* METHODS */
  receiver.on('play', function(){
    player.play(true);
  });

  receiver.on('pause', function(){
    player.pause(true);
  });

  receiver.on('getPaused', function(callback){
    callback(player.getState().toLowerCase() !== 'PLAYING'.toLowerCase());
  });

  receiver.on('getCurrentTime', function(callback){
    callback(player.getPosition());
  });

  receiver.on('setCurrentTime', function(value){
    player.seek(value);
  });

  receiver.on('getDuration', function(callback){
    callback(player.getDuration());
  });

  receiver.on('getVolume', function(callback){
    callback(player.getVolume());
  });

  receiver.on('setVolume', function(value){
    player.setVolume(value);
  });

  receiver.on('mute', function(){
    player.setMute(true);
  });

  receiver.on('unmute', function(){
    player.setMute(false);
  });

  receiver.on('getMuted', function(callback){
    callback(player.getMute() === true);
  });

  receiver.on('getLoop', function(callback){
    callback(this.looped);
  }, this);

  receiver.on('setLoop', function(value){
    this.looped = value;
  }, this);
};

/* Call when the video.js is ready */
playerjs.JWPlayerAdapter.prototype.ready = function(){
  this.receiver.ready();
};

playerjs.MockAdapter = function(){
  if (!(this instanceof playerjs.MockAdapter)) {
    return new playerjs.MockAdapter();
  }
  this.init();
};

playerjs.MockAdapter.prototype.init = function(){

  // Our mock video
  var video = {
    duration: 20,
    currentTime: 0,
    interval: null,
    timeupdate: function(){},
    volume: 100,
    mute: false,
    playing: false,
    loop : false,
    play: function(){
      video.interval = setInterval(function(){
        video.currentTime += 0.25;
        video.timeupdate({
          seconds: video.currentTime,
          duration: video.duration
        });
      }, 250);
      video.playing = true;
    },
    pause: function(){
      clearInterval(video.interval);
      video.playing = false;
    }
  };

  // Set up the actual receiver
  var receiver = this.receiver = new playerjs.Receiver();

  receiver.on('play', function(){
    var self = this;
    video.play();
    this.emit('play');
    video.timeupdate = function(data){
      self.emit('timeupdate', data);
    };
  });

  receiver.on('pause', function(){
    video.pause();
    this.emit('pause');
  });

  receiver.on('getPaused', function(callback){
    callback(!video.playing);
  });

  receiver.on('getCurrentTime', function(callback){
    callback(video.currentTime);
  });

  receiver.on('setCurrentTime', function(value){
    video.currentTime = value;
  });

  receiver.on('getDuration', function(callback){
    callback(video.duration);
  });

  receiver.on('getVolume', function(callback){
    callback(video.volume);
  });

  receiver.on('setVolume', function(value){
    video.volume = value;
  });

  receiver.on('mute', function(){
    video.mute = true;
  });

  receiver.on('unmute', function(){
    video.mute = false;
  });

  receiver.on('getMuted', function(callback){
    callback(video.mute);
  });

  receiver.on('getLoop', function(callback){
    callback(video.loop);
  });

  receiver.on('setLoop', function(value){
    video.loop = value;
  });
};

/* Call when the video has loaded */
playerjs.MockAdapter.prototype.ready = function(){
  this.receiver.ready();
};
playerjs.VideoJSAdapter = function(player){
  if (!(this instanceof playerjs.VideoJSAdapter)) {
    return new playerjs.VideoJSAdapter(player);
  }
  this.init(player);
};

playerjs.VideoJSAdapter.prototype.init = function(player){

  playerjs.assert(player, 'playerjs.VideoJSReceiver requires a player object');

  // Set up the actual receiver
  var receiver = this.receiver = new playerjs.Receiver();

  /* EVENTS */
  player.on("pause", function(){
    receiver.emit('pause');
  });

  player.on("play", function(){
    receiver.emit('play');
  });

  player.on("timeupdate", function(e){
    var seconds = player.currentTime(),
      duration = player.duration();

    if (!seconds || !duration){
      return false;
    }

    var value = {
      seconds: seconds,
      duration: duration
    };
    receiver.emit('timeupdate', value);
  });

  player.on("ended", function(){
    receiver.emit('ended');
  });

  player.on("error", function(){
    receiver.emit('error');
  });


  /* METHODS */
  receiver.on('play', function(){
    player.play();
  });

  receiver.on('pause', function(){
    player.pause();
  });

  receiver.on('getPaused', function(callback){
    callback(player.paused());
  });

  receiver.on('getCurrentTime', function(callback){
    callback(player.currentTime());
  });

  receiver.on('setCurrentTime', function(value){
    player.currentTime(value);
  });

  receiver.on('getDuration', function(callback){
    callback(player.duration());
  });

  receiver.on('getVolume', function(callback){
    callback(player.volume() * 100);
  });

  receiver.on('setVolume', function(value){
    player.volume(value/100);
  });

  receiver.on('mute', function(){
    player.volume(0);
  });

  receiver.on('unmute', function(){
    player.volume(1);
  });

  receiver.on('getMuted', function(callback){
    callback(player.volume() === 0);
  });

  receiver.on('getLoop', function(callback){
    callback(player.loop());
  });

  receiver.on('setLoop', function(value){
    player.loop(value);
  });
};

/* Call when the video.js is ready */
playerjs.VideoJSAdapter.prototype.ready = function(){
  this.receiver.ready();
};

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return playerjs
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = playerjs
  } else {
    window.playerjs = playerjs;
  }
})(window, document);

},{}],"n8p7":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const TraktApi_1 = __importStar(require("./TraktApi"));

const TraktScrobble_1 = __importStar(require("./TraktScrobble"));

const ConnectButton_1 = __importDefault(require("./ui/ConnectButton"));

const StatusButton_1 = __importDefault(require("./ui/StatusButton"));

const TraktHistory_1 = __importDefault(require("./TraktHistory"));

const TraktLookup_1 = __importDefault(require("./TraktLookup"));

const react_1 = require("react");

const react_dom_1 = require("react-dom");

const core_1 = require("@emotion/core");

const cache_1 = __importDefault(require("@emotion/cache"));

const ste_simple_events_1 = require("ste-simple-events");

const playerjs = __importStar(require("player.js"));

exports.RollerContext = react_1.createContext(undefined);
var TraktRollerState;

(function (TraktRollerState) {
  TraktRollerState["Undefined"] = "undefined";
  TraktRollerState["Lookup"] = "lookup";
  TraktRollerState["NotFound"] = "notfound";
  TraktRollerState["Scrobbling"] = "scrobbling";
  TraktRollerState["Error"] = "error";
})(TraktRollerState = exports.TraktRollerState || (exports.TraktRollerState = {}));

;
const TraktUrlRegex = /^https:\/\/trakt\.tv\/(movies|shows)\/([\w-]+)(?:\/seasons\/(\d+)\/episodes\/(\d+))?$/;
const ScrobblingEnabledKey = 'TraktRoller.enabled';

class TraktRoller {
  constructor(options) {
    this.onStateChanged = new ste_simple_events_1.SimpleEventDispatcher();
    this.onEnabledChanged = new ste_simple_events_1.SimpleEventDispatcher();
    this._enabled = false;
    this._duration = 0;
    this._currentTime = 0;
    if (!options.website) throw new Error("'website' option cannot be undefined");
    console.log("TraktRoller");
    this._state = TraktRollerState.Undefined;
    this._website = options.website;
    this._storage = options.storage || new TraktApi_1.LocalStorageAdapter();

    this._loadPrefs();

    this._api = new TraktApi_1.default(options);

    this._api.onAuthenticationChanged.sub(this._onAuthenticationChange.bind(this));

    this._api.loadTokens();

    this._history = new TraktHistory_1.default(this._api);
    this._looker = new TraktLookup_1.default(this._api);
    this._scrobble = new TraktScrobble_1.default(this._api);
    this._scrobble.enabled = this.enabled;

    this._scrobble.onStateChanged.sub(this._onScrobbleStatusChanged.bind(this));

    this._scrobble.onScrobbled.sub(this._onScrobbled.bind(this));

    this._createFooterButton();

    this._waitForPlayer();
  }

  get scrobble() {
    return this._scrobble;
  }

  get history() {
    return this._history;
  }

  get state() {
    if (this._state != TraktRollerState.Scrobbling) {
      return this._state;
    } else {
      return this._scrobble.state;
    }
  }

  _setState(value) {
    if (this._state == value) return;
    this._state = value;
    this.onStateChanged.dispatch(this.state);
  }

  get error() {
    if (this._state != TraktRollerState.Scrobbling) {
      return this._error;
    } else {
      return this._scrobble.error;
    }
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(value) {
    if (this._enabled === value) return;
    this._enabled = value;

    this._storage.setValue(ScrobblingEnabledKey, value ? "true" : "false");

    this._scrobble.enabled = value;
    this.onEnabledChanged.dispatch(value);
  }

  lookupTraktUrl(url) {
    return __awaiter(this, void 0, void 0, function* () {
      let match = TraktUrlRegex.exec(url);

      if (!match) {
        this._error = "Unrecognized Trakt URL.";

        this._setState(TraktRollerState.Error);

        return;
      }

      let data = this._baseScrobbleData();

      if (match[1] == 'movies') {
        data.movie = {
          ids: {
            slug: match[2]
          }
        };
      } else {
        data.show = {
          ids: {
            slug: match[2]
          }
        };

        if (match[3] && match[4]) {
          data.episode = {
            season: parseInt(match[3]),
            number: parseInt(match[4])
          };
        } else {
          if (this._scrobble.data && this._scrobble.data.episode) {
            data.episode = this._scrobble.data.episode;
          } else {
            let pageData = this._getScrobbleData();

            data.episode = pageData === null || pageData === void 0 ? void 0 : pageData.episode;
          }
        }
      }

      yield this._lookup(data);
    });
  }

  _loadPrefs() {
    return __awaiter(this, void 0, void 0, function* () {
      this._enabled = (yield this._storage.getValue(ScrobblingEnabledKey)) === "true";
    });
  }

  _waitForPlayer() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        this._player = yield this._website.loadPlayer();

        this._player.on(playerjs.EVENTS.READY, () => this._playerReady());
      } catch (e) {
        console.log(`TraktRoller: No player found on page`);
      }
    });
  }

  _playerReady() {
    if (!this._api.isAuthenticated()) return;
    if (!this._player) return;

    let data = this._getScrobbleData();

    if (!data) return;

    this._player.on(playerjs.EVENTS.TIMEUPDATE, info => this._onTimeChanged(info));

    this._player.on(playerjs.EVENTS.PLAY, () => this._onPlaybackStateChange(TraktScrobble_1.PlaybackState.Playing));

    this._player.on(playerjs.EVENTS.PAUSE, () => this._onPlaybackStateChange(TraktScrobble_1.PlaybackState.Paused));

    this._player.on(playerjs.EVENTS.ENDED, () => this._onPlaybackStateChange(TraktScrobble_1.PlaybackState.Ended));

    this._player.on(playerjs.EVENTS.ERROR, () => this._onPlaybackStateChange(TraktScrobble_1.PlaybackState.Ended));

    this._createStatusButton();

    this._lookup(data);
  }

  _lookup(data) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        this._setState(TraktRollerState.Lookup);

        let result = yield this._looker.start(data);

        if (result == null) {
          this._setState(TraktRollerState.NotFound);
        } else {
          this._scrobble.scrobble(result);

          this._setState(TraktRollerState.Scrobbling);
        }
      } catch (error) {
        if (error.associatedObject) {
          console.error(error.message, error.associatedObject);
        } else {
          console.error(error.message);
        }

        this._error = error.message;

        this._setState(TraktRollerState.Error);
      }
    });
  }

  _onTimeChanged(info) {
    this._currentTime = info.seconds;
    this._duration = info.duration;

    this._scrobble.setPlaybackTime(info.seconds, info.duration);
  }

  _onPlaybackStateChange(state) {
    this._scrobble.setPlaybackState(state, this._getProgress());
  }

  _getProgress() {
    if (!this._duration) {
      console.warn(`TraktRoller: Duration is not set (${this._duration})`);
      return 0;
    } else if (this._duration === undefined) {
      console.warn("TraktRoller: Current time is not set");
      return 0;
    }

    return this._currentTime / this._duration * 100;
  }

  _baseScrobbleData() {
    let buildDate = new Date("2020-04-27T19:14:12.035Z");
    return {
      progress: this._getProgress(),
      app_version: "1.1.0",
      app_date: `${buildDate.getFullYear()}-${buildDate.getMonth() + 1}-${buildDate.getDate()}`
    };
  }

  _getScrobbleData() {
    const data = this._baseScrobbleData();

    const result = this._website.loadScrobbleData();

    if (!result) {
      console.error("TraktRoller: Could not extract scrobble data");
      return null;
    }

    return Object.assign(data, result);
  }

  _onAuthenticationChange(isAuthenticated) {
    if (!isAuthenticated) {
      this._api.checkAuthenticationResult(window.location.href);
    }
  }

  _onScrobbleStatusChanged(state) {
    if (this._state == TraktRollerState.Scrobbling) {
      this.onStateChanged.dispatch(this.state);
    }
  }

  _onScrobbled(result) {
    let ids = undefined;

    if (result.movie && result.movie.ids) {
      ids = result.movie.ids;
    } else if (result.episode && result.episode.ids) {
      ids = result.episode.ids;
    }

    if (!ids || !ids.trakt) {
      console.error(`TraktRoller: Srobble didn't return any trakt ids`, result);
      return;
    }

    this._history.add(ids.trakt, {
      id: result.id,
      watched_at: new Date().toISOString(),
      action: "scrobble",
      type: result.movie ? 'movie' : 'episode',
      movie: result.movie,
      show: result.show,
      episode: result.episode
    });
  }

  _createFooterButton() {
    let footer = this._website.getConnectButtonParent();

    if (!footer) {
      console.error("TraktRoller: Could not find footer to add trakt connect button");
      return;
    }

    const cache = cache_1.default({
      container: footer
    });
    react_dom_1.render(core_1.jsx(core_1.CacheProvider, {
      value: cache
    }, core_1.jsx(ConnectButton_1.default, {
      api: this._api
    })), footer);
  }

  _createStatusButton() {
    console.log(`TraktRoller: _createStatusButton`);

    let container = this._website.getStatusButtonParent();

    if (!container) {
      console.error("TraktRoller: Could not find share row to add trakt status button");
      return;
    }

    const cache = cache_1.default({
      container: container
    });
    react_dom_1.render(core_1.jsx(core_1.CacheProvider, {
      value: cache
    }, core_1.jsx(exports.RollerContext.Provider, {
      value: this
    }, core_1.jsx(StatusButton_1.default, {
      roller: this
    }))), container);
  }

}

exports.default = TraktRoller;
},{"./TraktApi":"TraktApi.ts","./TraktScrobble":"TraktScrobble.ts","./ui/ConnectButton":"ui/ConnectButton.tsx","./ui/StatusButton":"ui/StatusButton.tsx","./TraktHistory":"TraktHistory.ts","./TraktLookup":"TraktLookup.ts","react":"../node_modules/preact/compat/dist/compat.module.js","react-dom":"../node_modules/preact/compat/dist/compat.module.js","@emotion/core":"haMh","@emotion/cache":"dqFm","ste-simple-events":"../node_modules/ste-simple-events/dist/index.js","player.js":"../node_modules/player.js/dist/player-0.1.0.js"}],"websites/Crunchyroll.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const playerjs = __importStar(require("player.js"));

const EpisodeRegex = /Episode ([\d\.]+)/;
const SeasonRegex = /Season (\d+)/;
const MovieRegexes = [/Movie$/i, /Movie (Dub)$/i, /Movie (Sub)$/i, /Movie (Dubbed)$/i, /Movie (Subtitled)$/i, /^Movie - /i, /The Movie/i];

class Crunchyroll {
  loadPlayer() {
    return __awaiter(this, void 0, void 0, function* () {
      const player = document.getElementById('vilos-player');
      if (!player) throw new Error('Player not found');
      return new playerjs.Player(player);
    });
  }

  getConnectButtonParent() {
    const footer = document.querySelector('#social_media');
    if (!footer) return null;
    const container = document.createElement('div');
    container.className = "footer-column";
    footer.appendChild(container);
    const shadow = container.attachShadow({
      mode: 'closed'
    });
    const shadowContainer = document.createElement('div');
    shadow.appendChild(shadowContainer);
    return shadowContainer;
  }

  getStatusButtonParent() {
    const submenu = document.querySelector('.showmedia-submenu');
    if (!submenu) return null;
    const container = document.createElement('div');
    container.className = "right";
    submenu.appendChild(container);
    const shadow = container.attachShadow({
      mode: 'closed'
    });
    const shadowContainer = document.createElement('div');
    shadow.appendChild(shadowContainer);
    return shadowContainer;
  }

  loadScrobbleData() {
    const data = {};
    const titleElement = document.querySelector('#showmedia_about_episode_num');

    if (!titleElement || !titleElement.textContent || titleElement.textContent.length == 0) {
      console.error("TraktRoller: Could not find video title");
      return null;
    }

    let showTitle = titleElement.textContent.trim();
    let episodeTitle = undefined;
    const episodeTitleElement = document.querySelector('#showmedia_about_name');

    if (episodeTitleElement && episodeTitleElement.textContent) {
      episodeTitle = episodeTitleElement.textContent.trim();

      if (episodeTitle) {
        if (episodeTitle.startsWith("“")) {
          episodeTitle = episodeTitle.substring(1);
        }

        if (episodeTitle.endsWith("”")) {
          episodeTitle = episodeTitle.substring(0, episodeTitle.length - 1);
        }
      }
    }

    let seasonNumber = 1;
    let episodeNumber = 0;
    const episodeElement = document.querySelector('#showmedia_about_media h4:nth-child(2)');

    if (episodeElement && episodeElement.textContent && episodeElement.textContent.length > 0) {
      const seasonMatch = SeasonRegex.exec(episodeElement.textContent);

      if (seasonMatch) {
        seasonNumber = parseInt(seasonMatch[1]);
      }

      const episodeMatch = EpisodeRegex.exec(episodeElement.textContent);

      if (episodeMatch) {
        episodeNumber = parseFloat(episodeMatch[1]);
      }
    }

    if (episodeTitle && MovieRegexes.some(r => r.test(episodeTitle))) {
      data.movie = {
        title: showTitle
      };
    } else {
      data.show = {
        title: showTitle
      };
      data.episode = {
        season: seasonNumber,
        number: episodeNumber,
        title: episodeTitle
      };
    }

    return data;
  }

}

exports.default = Crunchyroll;
},{"player.js":"../node_modules/player.js/dist/player-0.1.0.js"}],"websites/Funimation.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const playerjs = __importStar(require("player.js"));

class Funimation {
  constructor() {
    this._decoder = document.createElement('textarea');
  }

  static createPlayerAdapter(videojs) {
    videojs('#brightcove-player', {}, function () {
      const adapter = new playerjs.VideoJSAdapter(this);
      adapter.ready();
    });
  }

  _unescape(input) {
    if (!input) return input;
    this._decoder.innerHTML = input;
    return this._decoder.value;
  }

  loadPlayer() {
    return __awaiter(this, void 0, void 0, function* () {
      const player = document.getElementById('player');
      if (!player) throw new Error('Player not found');
      return new playerjs.Player(player);
    });
  }

  getConnectButtonParent() {
    const footer = document.querySelector('footer > .container > .row > .col-md-10 > .row:nth-child(2) > .col-sm-4');
    if (!footer) return null;
    const container = document.createElement('div');
    container.style.float = "right";
    container.style.clear = "both";
    footer.appendChild(container);
    const shadow = container.attachShadow({
      mode: 'closed'
    });
    const shadowContainer = document.createElement('div');
    shadow.appendChild(shadowContainer);
    return shadowContainer;
  }

  getStatusButtonParent() {
    const submenu = document.querySelector('#video-details > .row > .col-md-10 > .row > .col-sm-6:nth-child(2)');
    if (!submenu) return null;
    const container = document.createElement('div');
    container.style.float = "right";
    container.style.margin = "12px 0";
    submenu.appendChild(container);
    const shadow = container.attachShadow({
      mode: 'closed'
    });
    const shadowContainer = document.createElement('div');
    shadow.appendChild(shadowContainer);
    return shadowContainer;
  }

  loadScrobbleData() {
    const data = {};
    var titleData = window['TITLE_DATA'];
    var kaneData = window['KANE_customdimensions'];

    if (!titleData || !kaneData) {
      return null;
    }

    let year = undefined;

    if (kaneData.dateAdded) {
      let parts = kaneData.dateAdded.split('/');

      if (parts.length == 3) {
        year = parseInt(parts[2]);
      }
    }

    if (kaneData.videoType == 'Movie') {
      if (!titleData.title) return null;
      data.movie = {
        title: kaneData.showName,
        year: year
      };
    } else if (kaneData.videoType == 'Episode') {
      if (!kaneData.showName || !titleData.seasonNum || !titleData.episodeNum) return null;
      data.show = {
        title: this._unescape(kaneData.showName),
        year: year
      };
      data.episode = {
        season: titleData.seasonNum,
        number: titleData.episodeNum,
        title: this._unescape(titleData.title)
      };
    } else {
      return null;
    }

    return data;
  }

}

exports.default = Funimation;
},{"player.js":"../node_modules/player.js/dist/player-0.1.0.js"}],"index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const TraktRoller_1 = __importDefault(require("./TraktRoller"));

const TraktApi_1 = require("./TraktApi");

const Crunchyroll_1 = __importDefault(require("./websites/Crunchyroll"));

const Funimation_1 = __importDefault(require("./websites/Funimation"));

const options = {
  client_id: "5ac1bf2ba188fc93f941eb0788ef5cb6e0e4bf96b882e914e6d0c17dacc8e7f2",
  client_secret: "3712241a1c467769e6c03336abb5fb9911f8665354d2aaffaa9f817e147a34ca",
  storage: new TraktApi_1.GreaseMonkeyStorageAdapter(),
  redirect_url: "",
  website: undefined
};
const origin = window.location.origin;

if (origin == "https://www.crunchyroll.com") {
  options.redirect_url = "https://www.crunchyroll.com";
  options.website = new Crunchyroll_1.default();
} else if (origin == "https://www.funimation.com") {
  if (window.videojs) {
    Funimation_1.default.createPlayerAdapter(window.videojs);
  } else {
    options.redirect_url = "https://www.funimation.com";
    options.website = new Funimation_1.default();
  }
}

if (options.website) {
  new TraktRoller_1.default(options);
}
},{"./TraktRoller":"n8p7","./TraktApi":"TraktApi.ts","./websites/Crunchyroll":"websites/Crunchyroll.ts","./websites/Funimation":"websites/Funimation.ts"}]},{},["index.ts"], null)
//# sourceMappingURL=/TraktRoller.user.js.map