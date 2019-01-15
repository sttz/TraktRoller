// ==UserScript==
// @name          TraktRoller
// @namespace     http://github.com/sttz/TraktRoller
// @description   Trakt scrobbler for Crunchyroll
// @author        sttz
// @license       MIT
// @copyright     2018, Adrian Stutz (https://sttz.ch/)
// @homepageURL   http://github.com/sttz/TraktRoller
// @supportURL    http://github.com/sttz/TraktRoller/issues
// @updateURL     https://openuserjs.org/meta/sttz/TraktRoller.meta.js
// @version       1.0.2
// @include       https://www.crunchyroll.com/*
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

// eslint-disable-next-line no-global-assign
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
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
  return newRequire;
})({"ZHt3":[function(require,module,exports) {
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
},{}],"BhDi":[function(require,module,exports) {
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
},{}],"OuRK":[function(require,module,exports) {
"use strict";

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

    for (var _i = 0, _a = this._subscriptions.slice(); _i < _a.length; _i++) {
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
  }
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
},{"./management":"ZHt3","./subscription":"BhDi"}],"CAoX":[function(require,module,exports) {
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
},{"./dispatching":"OuRK","./subscription":"BhDi"}],"Xwg8":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
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
},{"ste-core":"CAoX"}],"MjR0":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var events_1 = require("./events");

exports.EventDispatcher = events_1.EventDispatcher;
exports.EventHandlingBase = events_1.EventHandlingBase;
exports.EventList = events_1.EventList;
},{"./events":"Xwg8"}],"y7s+":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
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
},{"ste-core":"CAoX"}],"/WWW":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var simple_events_1 = require("./simple-events");

exports.SimpleEventDispatcher = simple_events_1.SimpleEventDispatcher;
exports.SimpleEventHandlingBase = simple_events_1.SimpleEventHandlingBase;
exports.SimpleEventList = simple_events_1.SimpleEventList;
},{"./simple-events":"y7s+"}],"Bt9s":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
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
},{"ste-core":"CAoX"}],"0mVq":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var signals_1 = require("./signals");

exports.SignalDispatcher = signals_1.SignalDispatcher;
exports.SignalHandlingBase = signals_1.SignalHandlingBase;
exports.SignalList = signals_1.SignalList;
},{"./signals":"Bt9s"}],"/nYY":[function(require,module,exports) {
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

var ste_simple_events_1 = require("ste-simple-events");

exports.SimpleEventDispatcher = ste_simple_events_1.SimpleEventDispatcher;
exports.SimpleEventHandlingBase = ste_simple_events_1.SimpleEventHandlingBase;
exports.SimpleEventList = ste_simple_events_1.SimpleEventList;

var ste_signals_1 = require("ste-signals");

exports.SignalDispatcher = ste_signals_1.SignalDispatcher;
exports.SignalHandlingBase = ste_signals_1.SignalHandlingBase;
exports.SignalList = ste_signals_1.SignalList;
},{"ste-core":"CAoX","ste-events":"MjR0","ste-simple-events":"/WWW","ste-signals":"0mVq"}],"bK1h":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
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
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

exports.__esModule = true;

var strongly_typed_events_1 = require("strongly-typed-events");

var TraktTokensKey = 'trakt_tokens';
var TraktErrorCodes = {
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

var LocalStorageAdapter =
/** @class */
function () {
  function LocalStorageAdapter() {}

  LocalStorageAdapter.prototype.getValue = function (name) {
    return Promise.resolve(window.localStorage.getItem(name));
  };

  LocalStorageAdapter.prototype.setValue = function (name, value) {
    if (!value) {
      window.localStorage.removeItem(name);
    } else {
      window.localStorage.setItem(name, value);
    }

    return Promise.resolve();
  };

  return LocalStorageAdapter;
}();

exports.LocalStorageAdapter = LocalStorageAdapter;

var GreaseMonkeyStorageAdapter =
/** @class */
function () {
  function GreaseMonkeyStorageAdapter() {}

  GreaseMonkeyStorageAdapter.prototype.getValue = function (name) {
    return Promise.resolve(GM_getValue(name));
  };

  GreaseMonkeyStorageAdapter.prototype.setValue = function (name, value) {
    if (!value) {
      GM_deleteValue(name);
    } else {
      GM_setValue(name, value);
    }

    return Promise.resolve();
  };

  return GreaseMonkeyStorageAdapter;
}();

exports.GreaseMonkeyStorageAdapter = GreaseMonkeyStorageAdapter;

var TraktApi =
/** @class */
function () {
  function TraktApi(options) {
    this.onAuthenticationChanged = new strongly_typed_events_1.SimpleEventDispatcher();
    this._tokens = {};
    this._client_id = options.client_id;
    this._client_secret = options.client_secret;
    this._redirect_uri = 'https://www.crunchyroll.com';
    this._endpoint = options.api_url || 'https://api.trakt.tv';
    this._storage = options.storage || new LocalStorageAdapter();
  }

  TraktApi.isError = function (obj, code) {
    var err = obj;
    return err.status !== undefined && err.error !== undefined && (code === undefined || err.status === code);
  }; // ------ Authentication ------


  TraktApi.prototype.loadTokens = function () {
    return __awaiter(this, void 0, Promise, function () {
      var data, _a;

      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4
            /*yield*/
            , this._storage.getValue(TraktTokensKey)];

          case 1:
            data = _b.sent();

            if (data) {
              this._tokens = JSON.parse(data);
            } else {
              this._tokens = {};
            }

            if (!(this._tokens.expires && this._tokens.expires < Date.now())) return [3
            /*break*/
            , 4];
            _a = this;
            return [4
            /*yield*/
            , this._refresh_token()];

          case 2:
            _a._tokens = _b.sent();
            return [4
            /*yield*/
            , this._storage.setValue(TraktTokensKey, JSON.stringify(this._tokens))];

          case 3:
            _b.sent();

            _b.label = 4;

          case 4:
            this.onAuthenticationChanged.dispatch(this.isAuthenticated());
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  TraktApi.prototype.isAuthenticated = function () {
    return this._tokens.access_token !== undefined;
  };

  TraktApi.prototype.authenticate = function () {
    return __awaiter(this, void 0, Promise, function () {
      var state, url;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            state = this._generate_state();
            url = this._get_url(state); // Save authentication state data

            this._tokens.authentication_state = state;
            return [4
            /*yield*/
            , this._storage.setValue(TraktTokensKey, JSON.stringify(this._tokens))];

          case 1:
            _a.sent();

            window.location.href = url;
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  TraktApi.prototype.checkAuthenticationResult = function (url) {
    return __awaiter(this, void 0, Promise, function () {
      var params, code, state;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            params = new URL(url).searchParams;
            code = params.get('code');
            state = params.get('state');
            if (!code || !state) return [2
            /*return*/
            ];
            return [4
            /*yield*/
            , this._exchange_code(code, state)];

          case 1:
            if (!_a.sent()) {
              console.error('Exchanging oauth code failed!');
              return [2
              /*return*/
              ];
            }

            console.log('Trakt authentication successful!');
            return [4
            /*yield*/
            , this._storage.setValue(TraktTokensKey, JSON.stringify(this._tokens))];

          case 2:
            _a.sent();

            window.history.replaceState(null, undefined, window.location.pathname);
            this.onAuthenticationChanged.dispatch(true);
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  TraktApi.prototype.disconnect = function () {
    this._storage.setValue(TraktTokensKey, null);

    this.onAuthenticationChanged.dispatch(false);

    this._revoke_token();
  }; // ------ API ------


  TraktApi.prototype._getError = function (response) {
    var error = TraktErrorCodes[response.status];
    if (error) return error;
    return {
      status: response.status,
      error: "Unknown error (" + response.statusText + ")"
    };
  };

  TraktApi.prototype._request = function (method, url, body) {
    return __awaiter(this, void 0, Promise, function () {
      var contentType, headers, response, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            contentType = null;

            if (body) {
              if (body.contentType) {
                contentType = body.contentType;
                body = body.body;
              }

              if (typeof body !== 'string') {
                body = JSON.stringify(body);
              }
            }

            headers = new Headers();
            headers.append('trakt-api-version', '2');
            headers.append('trakt-api-key', this._client_id);
            headers.append('Content-Type', contentType || 'application/json');

            if (this._tokens && this._tokens.access_token) {
              headers.append('Authorization', "Bearer " + this._tokens.access_token);
            }

            _a.label = 1;

          case 1:
            _a.trys.push([1, 3,, 4]);

            return [4
            /*yield*/
            , fetch(this._endpoint + url, {
              method: method,
              mode: "cors",
              headers: headers,
              body: body
            })];

          case 2:
            response = _a.sent();

            if (!response.ok) {
              return [2
              /*return*/
              , this._getError(response)];
            }

            if (response.status === 204) {
              return [2
              /*return*/
              , null]; // 204: No Content
            }

            return [2
            /*return*/
            , response.json()];

          case 3:
            err_1 = _a.sent();
            return [2
            /*return*/
            , {
              status: 0,
              error: "An error occurred sending the request: " + err_1
            }];

          case 4:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  TraktApi.prototype._exchange = function (body) {
    return __awaiter(this, void 0, Promise, function () {
      var data, err_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2,, 3]);

            return [4
            /*yield*/
            , this._request('POST', '/oauth/token', body)];

          case 1:
            data = _a.sent();
            return [2
            /*return*/
            , {
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              expires: (data.created_at + data.expires_in) * 1000
            }];

          case 2:
            err_2 = _a.sent();
            console.error(err_2);
            return [2
            /*return*/
            , {}];

          case 3:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  TraktApi.prototype._generate_state = function () {
    var data = new Uint32Array(4);
    crypto.getRandomValues(data);
    var state = '';

    for (var i = 0; i < data.length; i++) {
      state += data[i].toString(16);
    }

    return state;
  };

  TraktApi.prototype._get_url = function (state) {
    // Replace 'api' from the api_url to get the top level trakt domain
    var base_url = this._endpoint.replace(/api\W/, '');

    return base_url + "/oauth/authorize?response_type=code&client_id=" + this._client_id + "&redirect_uri=" + this._redirect_uri + "&state=" + state;
  };

  TraktApi.prototype._exchange_code = function (code, state) {
    return __awaiter(this, void 0, Promise, function () {
      var _a;

      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (state !== this._tokens.authentication_state) {
              console.error('Invalid CSRF (State)');
              return [2
              /*return*/
              , false];
            }

            _a = this;
            return [4
            /*yield*/
            , this._exchange({
              code: code,
              client_id: this._client_id,
              client_secret: this._client_secret,
              redirect_uri: this._redirect_uri,
              grant_type: 'authorization_code'
            })];

          case 1:
            _a._tokens = _b.sent();
            return [2
            /*return*/
            , this.isAuthenticated()];
        }
      });
    });
  };

  TraktApi.prototype._refresh_token = function () {
    return __awaiter(this, void 0, Promise, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this._tokens.refresh_token) return [2
            /*return*/
            , {}];
            return [4
            /*yield*/
            , this._exchange({
              refresh_token: this._tokens.refresh_token,
              client_id: this._client_id,
              client_secret: this._client_secret,
              redirect_uri: this._redirect_uri,
              grant_type: 'refresh_token'
            })];

          case 1:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
  };

  TraktApi.prototype._revoke_token = function () {
    return __awaiter(this, void 0, Promise, function () {
      return __generator(this, function (_a) {
        if (!this._tokens.access_token) return [2
        /*return*/
        ];
        return [2
        /*return*/
        , this._request('POST', '/oauth/revoke', {
          token: this._tokens.access_token,
          client_id: this._client_id,
          client_secret: this._client_secret
        })];
      });
    });
  };

  TraktApi.prototype.search = function (type, query) {
    return __awaiter(this, void 0, Promise, function () {
      return __generator(this, function (_a) {
        return [2
        /*return*/
        , this._request('GET', "/search/" + type + "?query=" + encodeURIComponent(query))];
      });
    });
  };

  TraktApi.prototype.seasons = function (showId, episodes) {
    return __awaiter(this, void 0, Promise, function () {
      return __generator(this, function (_a) {
        return [2
        /*return*/
        , this._request('GET', "/shows/" + showId + "/seasons?extended=" + (episodes ? 'episodes' : ''))];
      });
    });
  };

  TraktApi.prototype.season = function (showId, season, extended) {
    return __awaiter(this, void 0, Promise, function () {
      return __generator(this, function (_a) {
        return [2
        /*return*/
        , this._request('GET', "/shows/" + showId + "/seasons/" + season + "?extended=" + (extended ? 'full' : ''))];
      });
    });
  };

  TraktApi.prototype.scrobble = function (type, data) {
    return __awaiter(this, void 0, Promise, function () {
      return __generator(this, function (_a) {
        if (!this._tokens.access_token) {
          throw new Error('Access token required.');
        }

        return [2
        /*return*/
        , this._request('POST', "/scrobble/" + type, data)];
      });
    });
  };

  TraktApi.prototype.history = function (type, id) {
    return __awaiter(this, void 0, Promise, function () {
      var url;
      return __generator(this, function (_a) {
        if (!this._tokens.access_token) {
          throw new Error('Access token required.');
        }

        url = '/sync/history';
        if (type) url += '/' + type;
        if (type && id) url += '/' + id;
        return [2
        /*return*/
        , this._request('GET', url)];
      });
    });
  };

  TraktApi.prototype.historyRemove = function (id) {
    return __awaiter(this, void 0, Promise, function () {
      return __generator(this, function (_a) {
        if (!this._tokens.access_token) {
          throw new Error('Access token required.');
        }

        return [2
        /*return*/
        , this._request('POST', "/sync/history/remove", {
          ids: [id]
        })];
      });
    });
  };

  return TraktApi;
}();

exports["default"] = TraktApi;
},{"strongly-typed-events":"/nYY"}],"SXC6":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
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
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

exports.__esModule = true;

var TraktApi_1 = __importDefault(require("./TraktApi"));

var ste_simple_events_1 = require("ste-simple-events");

var PlaybackState;

(function (PlaybackState) {
  PlaybackState[PlaybackState["Paused"] = 0] = "Paused";
  PlaybackState[PlaybackState["Playing"] = 1] = "Playing";
  PlaybackState[PlaybackState["Ended"] = 2] = "Ended";
})(PlaybackState = exports.PlaybackState || (exports.PlaybackState = {}));

var TraktScrobbleState;

(function (TraktScrobbleState) {
  TraktScrobbleState[TraktScrobbleState["Undefined"] = 0] = "Undefined";
  TraktScrobbleState[TraktScrobbleState["Lookup"] = 1] = "Lookup";
  TraktScrobbleState[TraktScrobbleState["Found"] = 2] = "Found";
  TraktScrobbleState[TraktScrobbleState["Started"] = 3] = "Started";
  TraktScrobbleState[TraktScrobbleState["Paused"] = 4] = "Paused";
  TraktScrobbleState[TraktScrobbleState["Scrobbled"] = 5] = "Scrobbled";
  TraktScrobbleState[TraktScrobbleState["NotFound"] = 6] = "NotFound";
  TraktScrobbleState[TraktScrobbleState["Error"] = 7] = "Error";
})(TraktScrobbleState = exports.TraktScrobbleState || (exports.TraktScrobbleState = {}));

var LookupResult;

(function (LookupResult) {
  LookupResult[LookupResult["NotFound"] = 0] = "NotFound";
  LookupResult[LookupResult["Found"] = 1] = "Found";
  LookupResult[LookupResult["Error"] = 2] = "Error";
})(LookupResult || (LookupResult = {}));

var TraktScrobble =
/** @class */
function () {
  function TraktScrobble(client, data) {
    /** Scrobble once this percentage has been reached */
    this.scrobbleAbovePecentage = 80;
    /** Minimum time of the video that has to have been played before scrobbling (percent of duration) */

    this.scrobbleMimimumPlaybackPercentage = 0.1;
    this.onStateChanged = new ste_simple_events_1.SimpleEventDispatcher();
    this.onScrobbled = new ste_simple_events_1.SimpleEventDispatcher();
    this._enabled = false;
    this._lastPlaybackTime = 0;
    this._playbackTime = 0;
    this._client = client;
    this._data = data;

    this._init();
  }
  /** Extract item type from scrobble data */


  TraktScrobble.typeFromData = function (data) {
    if (!data) return null;
    if (data.movie) return 'movie';
    if (data.show && data.episode) return 'episode';
    return null;
  };
  /** Extract trakt id from scrobble data, returns 0 if id is not set */


  TraktScrobble.traktIdFromData = function (data) {
    if (!data) return 0;
    var movieId = data.movie && data.movie.ids && data.movie.ids.trakt || null;
    if (movieId) return movieId;
    var episodeId = data.episode && data.episode.ids && data.episode.ids.trakt || null;
    if (episodeId) return episodeId;
    return 0;
  };

  Object.defineProperty(TraktScrobble.prototype, "api", {
    get: function () {
      return this._client;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(TraktScrobble.prototype, "enabled", {
    get: function () {
      return this._enabled;
    },
    set: function (value) {
      if (this._enabled === value) return;
      this._enabled = value;

      if (this._enabled) {
        this._applyState(PlaybackState.Paused);
      } else {
        this._applyState(this._playbackState);
      }
    },
    enumerable: true,
    configurable: true
  });

  TraktScrobble.prototype.setPlaybackTime = function (time, duration) {
    var delta = time - this._lastPlaybackTime;

    if (delta < 0.5) {
      this._playbackTime += delta;
    }

    var progress = time / duration * 100;
    var minimumTime = duration * this.scrobbleMimimumPlaybackPercentage;

    if (this._state === TraktScrobbleState.Started && progress > this.scrobbleAbovePecentage && this._playbackTime > minimumTime) {
      this.setPlaybackState(PlaybackState.Ended, progress);
    }

    this._lastPlaybackTime = time;
  };

  TraktScrobble.prototype.setPlaybackState = function (state, progress) {
    this._playbackState = state;
    this._data.progress = progress;

    if (!this.enabled) {
      this._applyState(state);
    }
  };

  TraktScrobble.prototype.scrobbleNow = function () {
    this._playbackState = PlaybackState.Ended;
    this._data.progress = 100;

    this._applyState(this._playbackState);
  };

  TraktScrobble.prototype._applyState = function (state) {
    if (state === PlaybackState.Playing) {
      if (this._pendingState === TraktScrobbleState.Found || this._pendingState === TraktScrobbleState.Paused) {
        this._updateScrobble('start');
      }
    } else if (state === PlaybackState.Paused) {
      if (this._pendingState === TraktScrobbleState.Started) {
        this._updateScrobble('pause');
      }
    } else if (state === PlaybackState.Ended) {
      if (this._pendingState === TraktScrobbleState.Found || this._pendingState === TraktScrobbleState.Started || this._pendingState === TraktScrobbleState.Paused) {
        this._updateScrobble('stop');
      }
    }
  };

  Object.defineProperty(TraktScrobble.prototype, "error", {
    get: function () {
      return this._error;
    },
    enumerable: true,
    configurable: true
  });

  TraktScrobble.prototype.scrobbleUrl = function () {
    var url = 'https://trakt.tv/';

    if (this._data.movie !== undefined) {
      return url + ("movies/" + this._data.movie.ids.slug);
    } else if (this._data.show !== undefined && this._data.episode !== undefined) {
      var show = this._data.show;
      var episode = this._data.episode;
      return url + ("shows/" + show.ids.slug + "/seasons/" + episode.season + "/episodes/" + episode.number);
    }

    return '';
  };

  Object.defineProperty(TraktScrobble.prototype, "state", {
    get: function () {
      return this._state;
    },
    enumerable: true,
    configurable: true
  });

  TraktScrobble.prototype.setState = function (value) {
    if (this._state == value) return;
    this._state = value;
    this._pendingState = value;
    this.onStateChanged.dispatch(value);
  };

  Object.defineProperty(TraktScrobble.prototype, "data", {
    get: function () {
      return this._data;
    },
    enumerable: true,
    configurable: true
  });

  TraktScrobble.prototype._handleError = function (response) {
    if (!TraktApi_1["default"].isError(response)) return false;
    console.error("trakt scrobbler: " + response.error);
    this._error = response.error;
    this.setState(TraktScrobbleState.Error);
    return true;
  };

  TraktScrobble.prototype._init = function () {
    return __awaiter(this, void 0, Promise, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.setState(TraktScrobbleState.Lookup);
            return [4
            /*yield*/
            , this._lookup()];

          case 1:
            result = _a.sent();

            if (result === LookupResult.NotFound) {
              this.setState(TraktScrobbleState.NotFound);
              return [2
              /*return*/
              ];
            } else if (result === LookupResult.Error) {
              this.setState(TraktScrobbleState.Error);
              return [2
              /*return*/
              ];
            }

            this.setState(TraktScrobbleState.Found);

            if (this._playbackState === PlaybackState.Playing) {
              this._updateScrobble('start');
            } else if (this._playbackState === PlaybackState.Ended) {
              this._updateScrobble('stop');
            }

            return [2
            /*return*/
            ];
        }
      });
    });
  };

  TraktScrobble.prototype._updateScrobble = function (type) {
    return __awaiter(this, void 0, Promise, function () {
      var scrobbleResponse;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
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

            return [4
            /*yield*/
            , this._client.scrobble(type, this._data)];

          case 1:
            scrobbleResponse = _a.sent();

            if (this._handleError(scrobbleResponse)) {
              return [2
              /*return*/
              , false];
            }

            switch (this._state) {
              case TraktScrobbleState.Found:
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

            return [2
            /*return*/
            , true];
        }
      });
    });
  };

  TraktScrobble.prototype._lookup = function () {
    return __awaiter(this, void 0, Promise, function () {
      var result, type, title, results, _i, results_1, found;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this._data.movie === undefined && this._data.show === undefined) {
              console.error('trakt scrobbler: either movie or show needs to be set on scrobble data');
              return [2
              /*return*/
              , LookupResult.Error];
            } // Start with trakt's automatic matching


            console.log('trakt scrobbler: trying automatic matching...');
            return [4
            /*yield*/
            , this._scrobbleLookup()];

          case 1:
            result = _a.sent();
            if (result !== LookupResult.NotFound) return [2
            /*return*/
            , result];
            type = this._data.movie !== undefined ? 'movie' : 'show';
            title = this._data.movie !== undefined ? this._data.movie.title : this._data.show.title;

            if (!title) {
              console.error('trakt scrobbler: No title set');
              return [2
              /*return*/
              , LookupResult.Error];
            }

            console.log('trakt scrobbler: trying to search manually...');
            return [4
            /*yield*/
            , this._search(type, title)];

          case 2:
            results = _a.sent();
            if (results === null) return [2
            /*return*/
            , LookupResult.Error];
            if (results.length === 0) return [2
            /*return*/
            , LookupResult.NotFound];
            _i = 0, results_1 = results;
            _a.label = 3;

          case 3:
            if (!(_i < results_1.length)) return [3
            /*break*/
            , 8];
            found = results_1[_i];

            if (type === 'movie') {
              console.log("trakt scrobbler: trying result " + found.movie.title, found);
              this._data.movie = found.movie;
            } else {
              console.log("trakt scrobbler: trying result " + found.show.title, found);
              this._data.show = found.show;
            }

            if (!(type === 'show')) return [3
            /*break*/
            , 5];
            return [4
            /*yield*/
            , this._lookupEpisode(found.show)];

          case 4:
            result = _a.sent();
            if (result === LookupResult.Error) return [2
            /*return*/
            , result];
            if (result === LookupResult.NotFound) return [3
            /*break*/
            , 7];
            _a.label = 5;

          case 5:
            // Retry start with new data
            console.log('trakt scrobbler: re-trying matching');
            return [4
            /*yield*/
            , this._scrobbleLookup()];

          case 6:
            result = _a.sent();
            if (result === LookupResult.Error) return [2
            /*return*/
            , result];
            if (result === LookupResult.Found) return [3
            /*break*/
            , 8];
            _a.label = 7;

          case 7:
            _i++;
            return [3
            /*break*/
            , 3];

          case 8:
            return [2
            /*return*/
            , result];
        }
      });
    });
  };

  TraktScrobble.prototype._scrobbleLookup = function () {
    return __awaiter(this, void 0, Promise, function () {
      var scrobbleResponse;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this._client.scrobble('pause', this._data)];

          case 1:
            scrobbleResponse = _a.sent();

            if (TraktApi_1["default"].isError(scrobbleResponse, 404)) {
              return [2
              /*return*/
              , LookupResult.NotFound];
            } else if (this._handleError(scrobbleResponse)) {
              return [2
              /*return*/
              , LookupResult.Error];
            }

            if (scrobbleResponse.movie !== undefined) this._data.movie = scrobbleResponse.movie;
            if (scrobbleResponse.show !== undefined) this._data.show = scrobbleResponse.show;
            if (scrobbleResponse.episode !== undefined) this._data.episode = scrobbleResponse.episode;
            console.log('trakt scrobbler: scrobble lookup succeeded', scrobbleResponse);
            return [2
            /*return*/
            , LookupResult.Found];
        }
      });
    });
  };

  TraktScrobble.prototype._search = function (type, title) {
    return __awaiter(this, void 0, Promise, function () {
      var searchResponse, goodMatches;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this._client.search(type, title)];

          case 1:
            searchResponse = _a.sent();

            if (this._handleError(searchResponse)) {
              return [2
              /*return*/
              , null];
            }

            goodMatches = searchResponse.filter(function (r) {
              return r.score > 10;
            });

            if (searchResponse.length > goodMatches.length) {
              if (goodMatches.length === 0) {
                console.log("trakt scrobbler: search returned only garbage results.");
              } else {
                console.log("trakt scrobbler: some search results with low scores ignored");
              }
            }

            return [2
            /*return*/
            , goodMatches];
        }
      });
    });
  };

  TraktScrobble.prototype._lookupEpisode = function (show) {
    return __awaiter(this, void 0, Promise, function () {
      var episodeResult;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this._data.episode === undefined || this._data.episode.number === undefined || this._data.episode.season === undefined) {
              console.error('trakt scrobbler: data has show but episode is not set or incomplete', this._data.episode);
              return [2
              /*return*/
              , LookupResult.Error];
            }

            if (show.ids === undefined || show.ids.trakt === undefined) {
              console.error('trakt scrobbler: show data is missing trakt id', this._data.show);
              return [2
              /*return*/
              , LookupResult.Error];
            }

            episodeResult = LookupResult.NotFound; // Lookup episode numbers

            console.log('trakt scrobbler: trying to look up episode number...');
            return [4
            /*yield*/
            , this._lookupEpisodeNumber(show.ids.trakt, this._data.episode.season, this._data.episode.number)];

          case 1:
            episodeResult = _a.sent();
            if (episodeResult === LookupResult.Error) return [2
            /*return*/
            , episodeResult];
            if (!(episodeResult === LookupResult.NotFound && this._data.episode.title !== undefined)) return [3
            /*break*/
            , 3];
            console.log('trakt scrobbler: trying to look up episode title...');
            return [4
            /*yield*/
            , this._lookupEpisodeTitle(show.ids.trakt, this._data.episode.title)];

          case 2:
            episodeResult = _a.sent();
            if (episodeResult === LookupResult.Error) return [2
            /*return*/
            , episodeResult];
            _a.label = 3;

          case 3:
            return [2
            /*return*/
            , episodeResult];
        }
      });
    });
  };

  TraktScrobble.prototype._lookupEpisodeNumber = function (showId, season, episode) {
    return __awaiter(this, void 0, Promise, function () {
      var seasonResponse, numberMatch;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this._client.season(showId, season, true)];

          case 1:
            seasonResponse = _a.sent();

            if (TraktApi_1["default"].isError(seasonResponse, 404)) {
              console.error('trakt scrobbler: manual lookup could not find season');
              return [2
              /*return*/
              , LookupResult.NotFound];
            } else if (this._handleError(seasonResponse)) {
              return [2
              /*return*/
              , LookupResult.Error];
            }

            numberMatch = seasonResponse.filter(function (e) {
              return e.number === episode || e.number_abs === episode;
            });

            if (numberMatch.length > 1) {
              console.error("trakt scrobbler: got multiple episode #" + episode + " in season", seasonResponse);
              return [2
              /*return*/
              , LookupResult.NotFound];
            } else if (numberMatch.length === 0) {
              console.error("trakt scrobbler: episode #" + episode + " not found in season", seasonResponse);
              return [2
              /*return*/
              , LookupResult.NotFound];
            }

            console.log("trakt scrobbler: found episode using episode number", numberMatch[0]);
            this._data.episode = numberMatch[0];
            return [2
            /*return*/
            , LookupResult.Found];
        }
      });
    });
  };

  TraktScrobble.prototype._filterEpisodeTitle = function (title) {
    if (!title) debugger;
    return title.replace(/[^\w\s]/gi, '').toLowerCase();
  };

  TraktScrobble.prototype._lookupEpisodeTitle = function (showId, title) {
    return __awaiter(this, void 0, Promise, function () {
      var seasonResponse, filteredTitle, numberMatch;

      var _this = this;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this._client.seasons(showId, true)];

          case 1:
            seasonResponse = _a.sent();

            if (TraktApi_1["default"].isError(seasonResponse, 404)) {
              console.error('trakt scrobbler: manual lookup could not find seasons');
              return [2
              /*return*/
              , LookupResult.NotFound];
            } else if (this._handleError(seasonResponse)) {
              return [2
              /*return*/
              , LookupResult.Error];
            }

            filteredTitle = this._filterEpisodeTitle(title);
            numberMatch = seasonResponse.reduce(function (acc, s) {
              return acc.concat(s.episodes);
            }, new Array()).filter(function (e) {
              return e.title && _this._filterEpisodeTitle(e.title) === filteredTitle;
            });

            if (numberMatch.length > 1) {
              console.error("trakt scrobbler: got multiple episodes titled \"" + title + "\" in show", seasonResponse);
              return [2
              /*return*/
              , LookupResult.NotFound];
            } else if (numberMatch.length === 0) {
              console.error("trakt scrobbler: episode titled \"" + title + "\" not found in show", seasonResponse);
              return [2
              /*return*/
              , LookupResult.NotFound];
            }

            console.log("trakt scrobbler: found episode using episode title", numberMatch[0]);
            this._data.episode = numberMatch[0];
            return [2
            /*return*/
            , LookupResult.Found];
        }
      });
    });
  };

  return TraktScrobble;
}();

exports["default"] = TraktScrobble;
},{"./TraktApi":"bK1h","ste-simple-events":"/WWW"}],"OmAK":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElement = exports.h = h;
exports.cloneElement = cloneElement;
exports.Component = Component;
exports.render = render;
exports.rerender = rerender;
exports.options = exports.default = void 0;

var VNode = function VNode() {};

var options = {};
exports.options = options;
var stack = [];
var EMPTY_CHILDREN = [];

function h(nodeName, attributes) {
  var children = EMPTY_CHILDREN,
      lastSimple,
      child,
      simple,
      i;

  for (i = arguments.length; i-- > 2;) {
    stack.push(arguments[i]);
  }

  if (attributes && attributes.children != null) {
    if (!stack.length) stack.push(attributes.children);
    delete attributes.children;
  }

  while (stack.length) {
    if ((child = stack.pop()) && child.pop !== undefined) {
      for (i = child.length; i--;) {
        stack.push(child[i]);
      }
    } else {
      if (typeof child === 'boolean') child = null;

      if (simple = typeof nodeName !== 'function') {
        if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
      }

      if (simple && lastSimple) {
        children[children.length - 1] += child;
      } else if (children === EMPTY_CHILDREN) {
        children = [child];
      } else {
        children.push(child);
      }

      lastSimple = simple;
    }
  }

  var p = new VNode();
  p.nodeName = nodeName;
  p.children = children;
  p.attributes = attributes == null ? undefined : attributes;
  p.key = attributes == null ? undefined : attributes.key;
  if (options.vnode !== undefined) options.vnode(p);
  return p;
}

function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }

  return obj;
}

var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

function cloneElement(vnode, props) {
  return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
}

var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
var items = [];

function enqueueRender(component) {
  if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
    (options.debounceRendering || defer)(rerender);
  }
}

function rerender() {
  var p,
      list = items;
  items = [];

  while (p = list.pop()) {
    if (p._dirty) renderComponent(p);
  }
}

function isSameNodeType(node, vnode, hydrating) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return node.splitText !== undefined;
  }

  if (typeof vnode.nodeName === 'string') {
    return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
  }

  return hydrating || node._componentConstructor === vnode.nodeName;
}

function isNamedNode(node, nodeName) {
  return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

function getNodeProps(vnode) {
  var props = extend({}, vnode.attributes);
  props.children = vnode.children;
  var defaultProps = vnode.nodeName.defaultProps;

  if (defaultProps !== undefined) {
    for (var i in defaultProps) {
      if (props[i] === undefined) {
        props[i] = defaultProps[i];
      }
    }
  }

  return props;
}

function createNode(nodeName, isSvg) {
  var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
  node.normalizedNodeName = nodeName;
  return node;
}

function removeNode(node) {
  var parentNode = node.parentNode;
  if (parentNode) parentNode.removeChild(node);
}

function setAccessor(node, name, old, value, isSvg) {
  if (name === 'className') name = 'class';

  if (name === 'key') {} else if (name === 'ref') {
    if (old) old(null);
    if (value) value(node);
  } else if (name === 'class' && !isSvg) {
    node.className = value || '';
  } else if (name === 'style') {
    if (!value || typeof value === 'string' || typeof old === 'string') {
      node.style.cssText = value || '';
    }

    if (value && typeof value === 'object') {
      if (typeof old !== 'string') {
        for (var i in old) {
          if (!(i in value)) node.style[i] = '';
        }
      }

      for (var i in value) {
        node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
      }
    }
  } else if (name === 'dangerouslySetInnerHTML') {
    if (value) node.innerHTML = value.__html || '';
  } else if (name[0] == 'o' && name[1] == 'n') {
    var useCapture = name !== (name = name.replace(/Capture$/, ''));
    name = name.toLowerCase().substring(2);

    if (value) {
      if (!old) node.addEventListener(name, eventProxy, useCapture);
    } else {
      node.removeEventListener(name, eventProxy, useCapture);
    }

    (node._listeners || (node._listeners = {}))[name] = value;
  } else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
    try {
      node[name] = value == null ? '' : value;
    } catch (e) {}

    if ((value == null || value === false) && name != 'spellcheck') node.removeAttribute(name);
  } else {
    var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));

    if (value == null || value === false) {
      if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
    } else if (typeof value !== 'function') {
      if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
    }
  }
}

function eventProxy(e) {
  return this._listeners[e.type](options.event && options.event(e) || e);
}

var mounts = [];
var diffLevel = 0;
var isSvgMode = false;
var hydrating = false;

function flushMounts() {
  var c;

  while (c = mounts.pop()) {
    if (options.afterMount) options.afterMount(c);
    if (c.componentDidMount) c.componentDidMount();
  }
}

function diff(dom, vnode, context, mountAll, parent, componentRoot) {
  if (!diffLevel++) {
    isSvgMode = parent != null && parent.ownerSVGElement !== undefined;
    hydrating = dom != null && !('__preactattr_' in dom);
  }

  var ret = idiff(dom, vnode, context, mountAll, componentRoot);
  if (parent && ret.parentNode !== parent) parent.appendChild(ret);

  if (! --diffLevel) {
    hydrating = false;
    if (!componentRoot) flushMounts();
  }

  return ret;
}

function idiff(dom, vnode, context, mountAll, componentRoot) {
  var out = dom,
      prevSvgMode = isSvgMode;
  if (vnode == null || typeof vnode === 'boolean') vnode = '';

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
      if (dom.nodeValue != vnode) {
        dom.nodeValue = vnode;
      }
    } else {
      out = document.createTextNode(vnode);

      if (dom) {
        if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
        recollectNodeTree(dom, true);
      }
    }

    out['__preactattr_'] = true;
    return out;
  }

  var vnodeName = vnode.nodeName;

  if (typeof vnodeName === 'function') {
    return buildComponentFromVNode(dom, vnode, context, mountAll);
  }

  isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;
  vnodeName = String(vnodeName);

  if (!dom || !isNamedNode(dom, vnodeName)) {
    out = createNode(vnodeName, isSvgMode);

    if (dom) {
      while (dom.firstChild) {
        out.appendChild(dom.firstChild);
      }

      if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
      recollectNodeTree(dom, true);
    }
  }

  var fc = out.firstChild,
      props = out['__preactattr_'],
      vchildren = vnode.children;

  if (props == null) {
    props = out['__preactattr_'] = {};

    for (var a = out.attributes, i = a.length; i--;) {
      props[a[i].name] = a[i].value;
    }
  }

  if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
    if (fc.nodeValue != vchildren[0]) {
      fc.nodeValue = vchildren[0];
    }
  } else if (vchildren && vchildren.length || fc != null) {
    innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
  }

  diffAttributes(out, vnode.attributes, props);
  isSvgMode = prevSvgMode;
  return out;
}

function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
  var originalChildren = dom.childNodes,
      children = [],
      keyed = {},
      keyedLen = 0,
      min = 0,
      len = originalChildren.length,
      childrenLen = 0,
      vlen = vchildren ? vchildren.length : 0,
      j,
      c,
      f,
      vchild,
      child;

  if (len !== 0) {
    for (var i = 0; i < len; i++) {
      var _child = originalChildren[i],
          props = _child['__preactattr_'],
          key = vlen && props ? _child._component ? _child._component.__key : props.key : null;

      if (key != null) {
        keyedLen++;
        keyed[key] = _child;
      } else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
        children[childrenLen++] = _child;
      }
    }
  }

  if (vlen !== 0) {
    for (var i = 0; i < vlen; i++) {
      vchild = vchildren[i];
      child = null;
      var key = vchild.key;

      if (key != null) {
        if (keyedLen && keyed[key] !== undefined) {
          child = keyed[key];
          keyed[key] = undefined;
          keyedLen--;
        }
      } else if (min < childrenLen) {
        for (j = min; j < childrenLen; j++) {
          if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
            child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      }

      child = idiff(child, vchild, context, mountAll);
      f = originalChildren[i];

      if (child && child !== dom && child !== f) {
        if (f == null) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          removeNode(f);
        } else {
          dom.insertBefore(child, f);
        }
      }
    }
  }

  if (keyedLen) {
    for (var i in keyed) {
      if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
    }
  }

  while (min <= childrenLen) {
    if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
  }
}

function recollectNodeTree(node, unmountOnly) {
  var component = node._component;

  if (component) {
    unmountComponent(component);
  } else {
    if (node['__preactattr_'] != null && node['__preactattr_'].ref) node['__preactattr_'].ref(null);

    if (unmountOnly === false || node['__preactattr_'] == null) {
      removeNode(node);
    }

    removeChildren(node);
  }
}

function removeChildren(node) {
  node = node.lastChild;

  while (node) {
    var next = node.previousSibling;
    recollectNodeTree(node, true);
    node = next;
  }
}

function diffAttributes(dom, attrs, old) {
  var name;

  for (name in old) {
    if (!(attrs && attrs[name] != null) && old[name] != null) {
      setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
    }
  }

  for (name in attrs) {
    if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
      setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    }
  }
}

var recyclerComponents = [];

function createComponent(Ctor, props, context) {
  var inst,
      i = recyclerComponents.length;

  if (Ctor.prototype && Ctor.prototype.render) {
    inst = new Ctor(props, context);
    Component.call(inst, props, context);
  } else {
    inst = new Component(props, context);
    inst.constructor = Ctor;
    inst.render = doRender;
  }

  while (i--) {
    if (recyclerComponents[i].constructor === Ctor) {
      inst.nextBase = recyclerComponents[i].nextBase;
      recyclerComponents.splice(i, 1);
      return inst;
    }
  }

  return inst;
}

function doRender(props, state, context) {
  return this.constructor(props, context);
}

function setComponentProps(component, props, renderMode, context, mountAll) {
  if (component._disable) return;
  component._disable = true;
  component.__ref = props.ref;
  component.__key = props.key;
  delete props.ref;
  delete props.key;

  if (typeof component.constructor.getDerivedStateFromProps === 'undefined') {
    if (!component.base || mountAll) {
      if (component.componentWillMount) component.componentWillMount();
    } else if (component.componentWillReceiveProps) {
      component.componentWillReceiveProps(props, context);
    }
  }

  if (context && context !== component.context) {
    if (!component.prevContext) component.prevContext = component.context;
    component.context = context;
  }

  if (!component.prevProps) component.prevProps = component.props;
  component.props = props;
  component._disable = false;

  if (renderMode !== 0) {
    if (renderMode === 1 || options.syncComponentUpdates !== false || !component.base) {
      renderComponent(component, 1, mountAll);
    } else {
      enqueueRender(component);
    }
  }

  if (component.__ref) component.__ref(component);
}

function renderComponent(component, renderMode, mountAll, isChild) {
  if (component._disable) return;
  var props = component.props,
      state = component.state,
      context = component.context,
      previousProps = component.prevProps || props,
      previousState = component.prevState || state,
      previousContext = component.prevContext || context,
      isUpdate = component.base,
      nextBase = component.nextBase,
      initialBase = isUpdate || nextBase,
      initialChildComponent = component._component,
      skip = false,
      snapshot = previousContext,
      rendered,
      inst,
      cbase;

  if (component.constructor.getDerivedStateFromProps) {
    state = extend(extend({}, state), component.constructor.getDerivedStateFromProps(props, state));
    component.state = state;
  }

  if (isUpdate) {
    component.props = previousProps;
    component.state = previousState;
    component.context = previousContext;

    if (renderMode !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
      skip = true;
    } else if (component.componentWillUpdate) {
      component.componentWillUpdate(props, state, context);
    }

    component.props = props;
    component.state = state;
    component.context = context;
  }

  component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
  component._dirty = false;

  if (!skip) {
    rendered = component.render(props, state, context);

    if (component.getChildContext) {
      context = extend(extend({}, context), component.getChildContext());
    }

    if (isUpdate && component.getSnapshotBeforeUpdate) {
      snapshot = component.getSnapshotBeforeUpdate(previousProps, previousState);
    }

    var childComponent = rendered && rendered.nodeName,
        toUnmount,
        base;

    if (typeof childComponent === 'function') {
      var childProps = getNodeProps(rendered);
      inst = initialChildComponent;

      if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
        setComponentProps(inst, childProps, 1, context, false);
      } else {
        toUnmount = inst;
        component._component = inst = createComponent(childComponent, childProps, context);
        inst.nextBase = inst.nextBase || nextBase;
        inst._parentComponent = component;
        setComponentProps(inst, childProps, 0, context, false);
        renderComponent(inst, 1, mountAll, true);
      }

      base = inst.base;
    } else {
      cbase = initialBase;
      toUnmount = initialChildComponent;

      if (toUnmount) {
        cbase = component._component = null;
      }

      if (initialBase || renderMode === 1) {
        if (cbase) cbase._component = null;
        base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
      }
    }

    if (initialBase && base !== initialBase && inst !== initialChildComponent) {
      var baseParent = initialBase.parentNode;

      if (baseParent && base !== baseParent) {
        baseParent.replaceChild(base, initialBase);

        if (!toUnmount) {
          initialBase._component = null;
          recollectNodeTree(initialBase, false);
        }
      }
    }

    if (toUnmount) {
      unmountComponent(toUnmount);
    }

    component.base = base;

    if (base && !isChild) {
      var componentRef = component,
          t = component;

      while (t = t._parentComponent) {
        (componentRef = t).base = base;
      }

      base._component = componentRef;
      base._componentConstructor = componentRef.constructor;
    }
  }

  if (!isUpdate || mountAll) {
    mounts.unshift(component);
  } else if (!skip) {
    if (component.componentDidUpdate) {
      component.componentDidUpdate(previousProps, previousState, snapshot);
    }

    if (options.afterUpdate) options.afterUpdate(component);
  }

  while (component._renderCallbacks.length) {
    component._renderCallbacks.pop().call(component);
  }

  if (!diffLevel && !isChild) flushMounts();
}

function buildComponentFromVNode(dom, vnode, context, mountAll) {
  var c = dom && dom._component,
      originalComponent = c,
      oldDom = dom,
      isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
      isOwner = isDirectOwner,
      props = getNodeProps(vnode);

  while (c && !isOwner && (c = c._parentComponent)) {
    isOwner = c.constructor === vnode.nodeName;
  }

  if (c && isOwner && (!mountAll || c._component)) {
    setComponentProps(c, props, 3, context, mountAll);
    dom = c.base;
  } else {
    if (originalComponent && !isDirectOwner) {
      unmountComponent(originalComponent);
      dom = oldDom = null;
    }

    c = createComponent(vnode.nodeName, props, context);

    if (dom && !c.nextBase) {
      c.nextBase = dom;
      oldDom = null;
    }

    setComponentProps(c, props, 1, context, mountAll);
    dom = c.base;

    if (oldDom && dom !== oldDom) {
      oldDom._component = null;
      recollectNodeTree(oldDom, false);
    }
  }

  return dom;
}

function unmountComponent(component) {
  if (options.beforeUnmount) options.beforeUnmount(component);
  var base = component.base;
  component._disable = true;
  if (component.componentWillUnmount) component.componentWillUnmount();
  component.base = null;
  var inner = component._component;

  if (inner) {
    unmountComponent(inner);
  } else if (base) {
    if (base['__preactattr_'] && base['__preactattr_'].ref) base['__preactattr_'].ref(null);
    component.nextBase = base;
    removeNode(base);
    recyclerComponents.push(component);
    removeChildren(base);
  }

  if (component.__ref) component.__ref(null);
}

function Component(props, context) {
  this._dirty = true;
  this.context = context;
  this.props = props;
  this.state = this.state || {};
  this._renderCallbacks = [];
}

extend(Component.prototype, {
  setState: function setState(state, callback) {
    if (!this.prevState) this.prevState = this.state;
    this.state = extend(extend({}, this.state), typeof state === 'function' ? state(this.state, this.props) : state);
    if (callback) this._renderCallbacks.push(callback);
    enqueueRender(this);
  },
  forceUpdate: function forceUpdate(callback) {
    if (callback) this._renderCallbacks.push(callback);
    renderComponent(this, 2);
  },
  render: function render() {}
});

function render(vnode, parent, merge) {
  return diff(merge, vnode, {}, false, parent, false);
}

var preact = {
  h: h,
  createElement: h,
  cloneElement: cloneElement,
  Component: Component,
  render: render,
  rerender: rerender,
  options: options
};
var _default = preact;
exports.default = _default;
},{}],"MvwA":[function(require,module,exports) {
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
},{}],"lCo2":[function(require,module,exports) {
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
},{}],"XFUu":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* eslint-disable */
// murmurhash2 via https://github.com/garycourt/murmurhash-js/blob/master/murmurhash2_gc.js
function murmurhash2_32_gc(str) {
  var l = str.length,
      h = l ^ l,
      i = 0,
      k;

  while (l >= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    k ^= k >>> 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k;
    l -= 4;
    ++i;
  }

  switch (l) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  }

  h ^= h >>> 13;
  h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  h ^= h >>> 15;
  return (h >>> 0).toString(36);
}

var _default = murmurhash2_32_gc;
exports.default = _default;
},{}],"r3ll":[function(require,module,exports) {
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
          c[b] = Z(d, c[b], e, m).trim();
        }

        break;

      default:
        var v = b = 0;

        for (c = []; b < a; ++b) {
          for (var n = 0; n < m; ++n) {
            c[v++] = Z(d[n] + ' ', h[b], e, m).trim();
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
        switch (d.constructor) {
          case Array:
            for (var c = 0, e = d.length; c < e; ++c) {
              T(d[c]);
            }

            break;

          case Function:
            S[A++] = d;
            break;

          case Boolean:
            Y = !!d | 0;
        }

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
},{}],"UYYs":[function(require,module,exports) {
var define;
(function (factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? (module['exports'] = factory()) :
		typeof define === 'function' && define['amd'] ? define(factory()) :
			(window['stylisRuleSheet'] = factory())
}(function () {

	'use strict'

	return function (insertRule) {
		var delimiter = '/*|*/'
		var needle = delimiter+'}'

		function toSheet (block) {
			if (block)
				try {
					insertRule(block + '}')
				} catch (e) {}
		}

		return function ruleSheet (context, content, selectors, parents, line, column, length, ns, depth, at) {
			switch (context) {
				// property
				case 1:
					// @import
					if (depth === 0 && content.charCodeAt(0) === 64)
						return insertRule(content+';'), ''
					break
				// selector
				case 2:
					if (ns === 0)
						return content + delimiter
					break
				// at-rule
				case 3:
					switch (ns) {
						// @font-face, @page
						case 102:
						case 112:
							return insertRule(selectors[0]+content), ''
						default:
							return content + (at === 0 ? delimiter : '')
					}
				case -2:
					content.split(needle).forEach(toSheet)
			}
		}
	}
}))

},{}],"QdUY":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _memoize = _interopRequireDefault(require("@emotion/memoize"));

var _unitless = _interopRequireDefault(require("@emotion/unitless"));

var _hash = _interopRequireDefault(require("@emotion/hash"));

var _stylis = _interopRequireDefault(require("@emotion/stylis"));

var _stylisRuleSheet = _interopRequireDefault(require("stylis-rule-sheet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hyphenateRegex = /[A-Z]|^ms/g;
var processStyleName = (0, _memoize.default)(function (styleName) {
  return styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  if (value == null || typeof value === 'boolean') {
    return '';
  }

  if (_unitless.default[key] !== 1 && key.charCodeAt(1) !== 45 && // custom properties
  !isNaN(value) && value !== 0) {
    return value + 'px';
  }

  return value;
};

if ("production" !== 'production') {
  var contentValuePattern = /(attr|calc|counters?|url)\(/;
  var contentValues = ['normal', 'none', 'counter', 'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        console.error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    return oldProcessStyleValue(key, value);
  };
}

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

      case 'function':
        if ("production" !== 'production') {
          console.error('Passing functions to cx is deprecated and will be removed in the next major version of Emotion.\n' + 'Please call the function before passing it to cx.');
        }

        toAdd = classnames([arg()]);
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

var isBrowser = typeof document !== 'undefined';
/*

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance
- 'polyfills' on server side

// usage

import StyleSheet from 'glamor/lib/sheet'
let styleSheet = new StyleSheet()

styleSheet.inject()
- 'injects' the stylesheet into the page (or into memory if on server)

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


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function makeStyleTag(opts) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', opts.key || '');

  if (opts.nonce !== undefined) {
    tag.setAttribute('nonce', opts.nonce);
  }

  tag.appendChild(document.createTextNode('')) // $FlowFixMe
  ;
  (opts.container !== undefined ? opts.container : document.head).appendChild(tag);
  return tag;
}

var StyleSheet =
/*#__PURE__*/
function () {
  function StyleSheet(options) {
    this.isSpeedy = "production" === 'production'; // the big drawback here is that the css won't be editable in devtools

    this.tags = [];
    this.ctr = 0;
    this.opts = options;
  }

  var _proto = StyleSheet.prototype;

  _proto.inject = function inject() {
    if (this.injected) {
      throw new Error('already injected!');
    }

    this.tags[0] = makeStyleTag(this.opts);
    this.injected = true;
  };

  _proto.speedy = function speedy(bool) {
    if (this.ctr !== 0) {
      // cannot change speedy mode after inserting any rule to sheet. Either call speedy(${bool}) earlier in your app, or call flush() before speedy(${bool})
      throw new Error("cannot change speedy now");
    }

    this.isSpeedy = !!bool;
  };

  _proto.insert = function insert(rule, sourceMap) {
    // this is the ultrafast version, works across browsers
    if (this.isSpeedy) {
      var tag = this.tags[this.tags.length - 1];
      var sheet = sheetForTag(tag);

      try {
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {
        if ("production" !== 'production') {
          console.warn('illegal rule', rule); // eslint-disable-line no-console
        }
      }
    } else {
      var _tag = makeStyleTag(this.opts);

      this.tags.push(_tag);

      _tag.appendChild(document.createTextNode(rule + (sourceMap || '')));
    }

    this.ctr++;

    if (this.ctr % 65000 === 0) {
      this.tags.push(makeStyleTag(this.opts));
    }
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0; // todo - look for remnants in document.styleSheets

    this.injected = false;
  };

  return StyleSheet;
}();

function createEmotion(context, options) {
  if (context.__SECRET_EMOTION__ !== undefined) {
    return context.__SECRET_EMOTION__;
  }

  if (options === undefined) options = {};
  var key = options.key || 'css';

  if ("production" !== 'production') {
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var current;

  function insertRule(rule) {
    current += rule;

    if (isBrowser) {
      sheet.insert(rule, currentSourceMap);
    }
  }

  var insertionPlugin = (0, _stylisRuleSheet.default)(insertRule);
  var stylisOptions;

  if (options.prefix !== undefined) {
    stylisOptions = {
      prefix: options.prefix
    };
  }

  var caches = {
    registered: {},
    inserted: {},
    nonce: options.nonce,
    key: key
  };
  var sheet = new StyleSheet(options);

  if (isBrowser) {
    // 🚀
    sheet.inject();
  }

  var stylis = new _stylis.default(stylisOptions);
  stylis.use(options.stylisPlugins)(insertionPlugin);
  var currentSourceMap = '';

  function handleInterpolation(interpolation, couldBeSelectorInterpolation) {
    if (interpolation == null) {
      return '';
    }

    switch (typeof interpolation) {
      case 'boolean':
        return '';

      case 'function':
        if (interpolation.__emotion_styles !== undefined) {
          var selector = interpolation.toString();

          if (selector === 'NO_COMPONENT_SELECTOR' && "production" !== 'production') {
            throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
          }

          return selector;
        }

        if (this === undefined && "production" !== 'production') {
          console.error('Interpolating functions in css calls is deprecated and will be removed in the next major version of Emotion.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        return handleInterpolation.call(this, this === undefined ? interpolation() : // $FlowFixMe
        interpolation(this.mergedProps, this.context), couldBeSelectorInterpolation);

      case 'object':
        return createStringFromObject.call(this, interpolation);

      default:
        var cached = caches.registered[interpolation];
        return couldBeSelectorInterpolation === false && cached !== undefined ? cached : interpolation;
    }
  }

  var objectToStringCache = new WeakMap();

  function createStringFromObject(obj) {
    if (objectToStringCache.has(obj)) {
      // $FlowFixMe
      return objectToStringCache.get(obj);
    }

    var string = '';

    if (Array.isArray(obj)) {
      obj.forEach(function (interpolation) {
        string += handleInterpolation.call(this, interpolation, false);
      }, this);
    } else {
      Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] !== 'object') {
          if (caches.registered[obj[key]] !== undefined) {
            string += key + "{" + caches.registered[obj[key]] + "}";
          } else {
            string += processStyleName(key) + ":" + processStyleValue(key, obj[key]) + ";";
          }
        } else {
          if (key === 'NO_COMPONENT_SELECTOR' && "production" !== 'production') {
            throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
          }

          if (Array.isArray(obj[key]) && typeof obj[key][0] === 'string' && caches.registered[obj[key][0]] === undefined) {
            obj[key].forEach(function (value) {
              string += processStyleName(key) + ":" + processStyleValue(key, value) + ";";
            });
          } else {
            string += key + "{" + handleInterpolation.call(this, obj[key], false) + "}";
          }
        }
      }, this);
    }

    objectToStringCache.set(obj, string);
    return string;
  }

  var name;
  var stylesWithLabel;
  var labelPattern = /label:\s*([^\s;\n{]+)\s*;/g;

  var createClassName = function createClassName(styles, identifierName) {
    return (0, _hash.default)(styles + identifierName) + identifierName;
  };

  if ("production" !== 'production') {
    var oldCreateClassName = createClassName;
    var sourceMappingUrlPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;

    createClassName = function createClassName(styles, identifierName) {
      return oldCreateClassName(styles.replace(sourceMappingUrlPattern, function (sourceMap) {
        currentSourceMap = sourceMap;
        return '';
      }), identifierName);
    };
  }

  var createStyles = function createStyles(strings) {
    var stringMode = true;
    var styles = '';
    var identifierName = '';

    if (strings == null || strings.raw === undefined) {
      stringMode = false;
      styles += handleInterpolation.call(this, strings, false);
    } else {
      styles += strings[0];
    }

    for (var _len = arguments.length, interpolations = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      interpolations[_key - 1] = arguments[_key];
    }

    interpolations.forEach(function (interpolation, i) {
      styles += handleInterpolation.call(this, interpolation, styles.charCodeAt(styles.length - 1) === 46 // .
      );

      if (stringMode === true && strings[i + 1] !== undefined) {
        styles += strings[i + 1];
      }
    }, this);
    stylesWithLabel = styles;
    styles = styles.replace(labelPattern, function (match, p1) {
      identifierName += "-" + p1;
      return '';
    });
    name = createClassName(styles, identifierName);
    return styles;
  };

  if ("production" !== 'production') {
    var oldStylis = stylis;

    stylis = function stylis(selector, styles) {
      oldStylis(selector, styles);
      currentSourceMap = '';
    };
  }

  function insert(scope, styles) {
    if (caches.inserted[name] === undefined) {
      current = '';
      stylis(scope, styles);
      caches.inserted[name] = current;
    }
  }

  var css = function css() {
    var styles = createStyles.apply(this, arguments);
    var selector = key + "-" + name;

    if (caches.registered[selector] === undefined) {
      caches.registered[selector] = stylesWithLabel;
    }

    insert("." + selector, styles);
    return selector;
  };

  var keyframes = function keyframes() {
    var styles = createStyles.apply(this, arguments);
    var animation = "animation-" + name;
    insert('', "@keyframes " + animation + "{" + styles + "}");
    return animation;
  };

  var injectGlobal = function injectGlobal() {
    var styles = createStyles.apply(this, arguments);
    insert('', styles);
  };

  function getRegisteredStyles(registeredStyles, classNames) {
    var rawClassName = '';
    classNames.split(' ').forEach(function (className) {
      if (caches.registered[className] !== undefined) {
        registeredStyles.push(className);
      } else {
        rawClassName += className + " ";
      }
    });
    return rawClassName;
  }

  function merge(className, sourceMap) {
    var registeredStyles = [];
    var rawClassName = getRegisteredStyles(registeredStyles, className);

    if (registeredStyles.length < 2) {
      return className;
    }

    return rawClassName + css(registeredStyles, sourceMap);
  }

  function cx() {
    for (var _len2 = arguments.length, classNames = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      classNames[_key2] = arguments[_key2];
    }

    return merge(classnames(classNames));
  }

  function hydrateSingleId(id) {
    caches.inserted[id] = true;
  }

  function hydrate(ids) {
    ids.forEach(hydrateSingleId);
  }

  function flush() {
    if (isBrowser) {
      sheet.flush();
      sheet.inject();
    }

    caches.inserted = {};
    caches.registered = {};
  }

  if (isBrowser) {
    var chunks = document.querySelectorAll("[data-emotion-" + key + "]");
    Array.prototype.forEach.call(chunks, function (node) {
      // $FlowFixMe
      sheet.tags[0].parentNode.insertBefore(node, sheet.tags[0]); // $FlowFixMe

      node.getAttribute("data-emotion-" + key).split(' ').forEach(hydrateSingleId);
    });
  }

  var emotion = {
    flush: flush,
    hydrate: hydrate,
    cx: cx,
    merge: merge,
    getRegisteredStyles: getRegisteredStyles,
    injectGlobal: injectGlobal,
    keyframes: keyframes,
    css: css,
    sheet: sheet,
    caches: caches
  };
  context.__SECRET_EMOTION__ = emotion;
  return emotion;
}

var _default = createEmotion;
exports.default = _default;
},{"@emotion/memoize":"MvwA","@emotion/unitless":"lCo2","@emotion/hash":"XFUu","@emotion/stylis":"r3ll","stylis-rule-sheet":"UYYs"}],"mibh":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.caches = exports.sheet = exports.css = exports.keyframes = exports.injectGlobal = exports.getRegisteredStyles = exports.merge = exports.cx = exports.hydrate = exports.flush = void 0;

var _createEmotion2 = _interopRequireDefault(require("create-emotion"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var context = typeof global !== 'undefined' ? global : {};

var _createEmotion = (0, _createEmotion2.default)(context),
    flush = _createEmotion.flush,
    hydrate = _createEmotion.hydrate,
    cx = _createEmotion.cx,
    merge = _createEmotion.merge,
    getRegisteredStyles = _createEmotion.getRegisteredStyles,
    injectGlobal = _createEmotion.injectGlobal,
    keyframes = _createEmotion.keyframes,
    css = _createEmotion.css,
    sheet = _createEmotion.sheet,
    caches = _createEmotion.caches;

exports.caches = caches;
exports.sheet = sheet;
exports.css = css;
exports.keyframes = keyframes;
exports.injectGlobal = injectGlobal;
exports.getRegisteredStyles = getRegisteredStyles;
exports.merge = merge;
exports.cx = cx;
exports.hydrate = hydrate;
exports.flush = flush;
},{"create-emotion":"QdUY"}],"B913":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

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

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

exports.__esModule = true;

var preact_1 = __importStar(require("preact"));

var emotion_1 = require("emotion");

var h = preact_1["default"].h;
var className = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-image: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOC4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMTQ0LjggMTQ0LjgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE0NC44IDE0NC44IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxjaXJjbGUgZmlsbD0iI0ZGRkZGRiIgY3g9IjcyLjQiIGN5PSI3Mi40IiByPSI3Mi40Ii8+DQoJPHBhdGggZmlsbD0iI0VEMjIyNCIgZD0iTTI5LjUsMTExLjhjMTAuNiwxMS42LDI1LjksMTguOCw0Mi45LDE4LjhjOC43LDAsMTYuOS0xLjksMjQuMy01LjNMNTYuMyw4NUwyOS41LDExMS44eiIvPg0KCTxwYXRoIGZpbGw9IiNFRDIyMjQiIGQ9Ik01Ni4xLDYwLjZMMjUuNSw5MS4xTDIxLjQsODdsMzIuMi0zMi4yaDBsMzcuNi0zNy42Yy01LjktMi0xMi4yLTMuMS0xOC44LTMuMWMtMzIuMiwwLTU4LjMsMjYuMS01OC4zLDU4LjMNCgkJYzAsMTMuMSw0LjMsMjUuMiwxMS43LDM1bDMwLjUtMzAuNWwyLjEsMmw0My43LDQzLjdjMC45LTAuNSwxLjctMSwyLjUtMS42TDU2LjMsNzIuN0wyNywxMDJsLTQuMS00LjFsMzMuNC0zMy40bDIuMSwybDUxLDUwLjkNCgkJYzAuOC0wLjYsMS41LTEuMywyLjItMS45bC01NS01NUw1Ni4xLDYwLjZ6Ii8+DQoJPHBhdGggZmlsbD0iI0VEMUMyNCIgZD0iTTExNS43LDExMS40YzkuMy0xMC4zLDE1LTI0LDE1LTM5YzAtMjMuNC0xMy44LTQzLjUtMzMuNi01Mi44TDYwLjQsNTYuMkwxMTUuNywxMTEuNHogTTc0LjUsNjYuOGwtNC4xLTQuMQ0KCQlsMjguOS0yOC45bDQuMSw0LjFMNzQuNSw2Ni44eiBNMTAxLjksMjcuMUw2OC42LDYwLjRsLTQuMS00LjFMOTcuOCwyM0wxMDEuOSwyNy4xeiIvPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGZpbGw9IiNFRDIyMjQiIGQ9Ik03Mi40LDE0NC44QzMyLjUsMTQ0LjgsMCwxMTIuMywwLDcyLjRDMCwzMi41LDMyLjUsMCw3Mi40LDBzNzIuNCwzMi41LDcyLjQsNzIuNA0KCQkJCUMxNDQuOCwxMTIuMywxMTIuMywxNDQuOCw3Mi40LDE0NC44eiBNNzIuNCw3LjNDMzYuNSw3LjMsNy4zLDM2LjUsNy4zLDcyLjRzMjkuMiw2NS4xLDY1LjEsNjUuMXM2NS4xLTI5LjIsNjUuMS02NS4xDQoJCQkJUzEwOC4zLDcuMyw3Mi40LDcuM3oiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K\");\n  background-repeat: no-repeat;\n  background-origin: content-box;\n"], ["\n  background-image: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOC4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMTQ0LjggMTQ0LjgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE0NC44IDE0NC44IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxjaXJjbGUgZmlsbD0iI0ZGRkZGRiIgY3g9IjcyLjQiIGN5PSI3Mi40IiByPSI3Mi40Ii8+DQoJPHBhdGggZmlsbD0iI0VEMjIyNCIgZD0iTTI5LjUsMTExLjhjMTAuNiwxMS42LDI1LjksMTguOCw0Mi45LDE4LjhjOC43LDAsMTYuOS0xLjksMjQuMy01LjNMNTYuMyw4NUwyOS41LDExMS44eiIvPg0KCTxwYXRoIGZpbGw9IiNFRDIyMjQiIGQ9Ik01Ni4xLDYwLjZMMjUuNSw5MS4xTDIxLjQsODdsMzIuMi0zMi4yaDBsMzcuNi0zNy42Yy01LjktMi0xMi4yLTMuMS0xOC44LTMuMWMtMzIuMiwwLTU4LjMsMjYuMS01OC4zLDU4LjMNCgkJYzAsMTMuMSw0LjMsMjUuMiwxMS43LDM1bDMwLjUtMzAuNWwyLjEsMmw0My43LDQzLjdjMC45LTAuNSwxLjctMSwyLjUtMS42TDU2LjMsNzIuN0wyNywxMDJsLTQuMS00LjFsMzMuNC0zMy40bDIuMSwybDUxLDUwLjkNCgkJYzAuOC0wLjYsMS41LTEuMywyLjItMS45bC01NS01NUw1Ni4xLDYwLjZ6Ii8+DQoJPHBhdGggZmlsbD0iI0VEMUMyNCIgZD0iTTExNS43LDExMS40YzkuMy0xMC4zLDE1LTI0LDE1LTM5YzAtMjMuNC0xMy44LTQzLjUtMzMuNi01Mi44TDYwLjQsNTYuMkwxMTUuNywxMTEuNHogTTc0LjUsNjYuOGwtNC4xLTQuMQ0KCQlsMjguOS0yOC45bDQuMSw0LjFMNzQuNSw2Ni44eiBNMTAxLjksMjcuMUw2OC42LDYwLjRsLTQuMS00LjFMOTcuOCwyM0wxMDEuOSwyNy4xeiIvPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGZpbGw9IiNFRDIyMjQiIGQ9Ik03Mi40LDE0NC44QzMyLjUsMTQ0LjgsMCwxMTIuMywwLDcyLjRDMCwzMi41LDMyLjUsMCw3Mi40LDBzNzIuNCwzMi41LDcyLjQsNzIuNA0KCQkJCUMxNDQuOCwxMTIuMywxMTIuMywxNDQuOCw3Mi40LDE0NC44eiBNNzIuNCw3LjNDMzYuNSw3LjMsNy4zLDM2LjUsNy4zLDcyLjRzMjkuMiw2NS4xLDY1LjEsNjUuMXM2NS4xLTI5LjIsNjUuMS02NS4xDQoJCQkJUzEwOC4zLDcuMyw3Mi40LDcuM3oiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K\");\n  background-repeat: no-repeat;\n  background-origin: content-box;\n"])));

var TraktIcon =
/** @class */
function (_super) {
  __extends(TraktIcon, _super);

  function TraktIcon() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  TraktIcon.prototype.render = function () {
    return h("div", {
      className: className + " " + this.props.className
    });
  };

  return TraktIcon;
}(preact_1.Component);

exports["default"] = TraktIcon;
var templateObject_1;
},{"preact":"OmAK","emotion":"mibh"}],"Asjh":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],"wVGV":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

function emptyFunction() {}

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./lib/ReactPropTypesSecret":"Asjh"}],"5D9O":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
if ("production" !== 'production') {
  var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 0xeac7;

  var isValidElement = function (object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }; // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod


  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}
},{"./factoryWithThrowingShims":"wVGV"}],"gPI/":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _memoize = _interopRequireDefault(require("@emotion/memoize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|default|defer|dir|disabled|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|itemProp|itemScope|itemType|itemID|itemRef|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class)|(on[A-Z].*)|((data|aria|x)-.*))$/i;
var index = (0, _memoize.default)(reactPropsRegex.test.bind(reactPropsRegex));
var _default = index;
exports.default = _default;
},{"@emotion/memoize":"MvwA"}],"3Rtg":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _isPropValid = _interopRequireDefault(require("@emotion/is-prop-valid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var channel = '__EMOTION_THEMING__'; // https://github.com/styled-components/styled-components/blob/e05b3fe247e9d956bcde786cec376e32afb85bca/src/utils/create-broadcast.js

var _contextTypes;

var contextTypes = (_contextTypes = {}, _contextTypes[channel] = _propTypes.default.object, _contextTypes);

function setTheme(theme) {
  this.setState({
    theme: theme
  });
}

var testPickPropsOnStringTag = _isPropValid.default;

var testPickPropsOnComponent = function testPickPropsOnComponent(key) {
  return key !== 'theme' && key !== 'innerRef';
};

var testAlwaysTrue = function testAlwaysTrue() {
  return true;
};

var pickAssign = function pickAssign(testFn, target) {
  var i = 2;
  var length = arguments.length;

  for (; i < length; i++) {
    var source = arguments[i];

    var _key = void 0;

    for (_key in source) {
      if (testFn(_key)) {
        target[_key] = source[_key];
      }
    }
  }

  return target;
};

var warnedAboutExtractStatic = false;

function createEmotionStyled(emotion, view) {
  var _createStyled = function createStyled(tag, options) {
    if ("production" !== 'production') {
      if (tag === undefined) {
        throw new Error('You are trying to create a styled element with an undefined component.\nYou may have forgotten to import it.');
      }
    }

    var staticClassName;
    var identifierName;
    var stableClassName;
    var shouldForwardProp;

    if (options !== undefined) {
      staticClassName = options.e;
      identifierName = options.label;
      stableClassName = options.target;
      shouldForwardProp = tag.__emotion_forwardProp && options.shouldForwardProp ? function (propName) {
        return tag.__emotion_forwardProp(propName) && // $FlowFixMe
        options.shouldForwardProp(propName);
      } : options.shouldForwardProp;
    }

    var isReal = tag.__emotion_real === tag;
    var baseTag = staticClassName === undefined ? isReal && tag.__emotion_base || tag : tag;

    if (typeof shouldForwardProp !== 'function') {
      shouldForwardProp = typeof baseTag === 'string' && baseTag.charAt(0) === baseTag.charAt(0).toLowerCase() ? testPickPropsOnStringTag : testPickPropsOnComponent;
    }

    return function () {
      var args = arguments;
      var styles = isReal && tag.__emotion_styles !== undefined ? tag.__emotion_styles.slice(0) : [];

      if (identifierName !== undefined) {
        styles.push("label:" + identifierName + ";");
      }

      if (staticClassName === undefined) {
        if (args[0] == null || args[0].raw === undefined) {
          styles.push.apply(styles, args);
        } else {
          styles.push(args[0][0]);
          var len = args.length;
          var i = 1;

          for (; i < len; i++) {
            styles.push(args[i], args[0][i]);
          }
        }
      } else if ("production" !== 'production' && !warnedAboutExtractStatic) {
        console.warn('extractStatic is deprecated and will be removed in emotion@10. We recommend disabling extractStatic or using other libraries like linaria or css-literal-loader');
        warnedAboutExtractStatic = true;
      }

      var Styled =
      /*#__PURE__*/
      function (_view$Component) {
        _inheritsLoose(Styled, _view$Component);

        function Styled() {
          return _view$Component.apply(this, arguments) || this;
        }

        var _proto = Styled.prototype;

        _proto.componentWillMount = function componentWillMount() {
          if (this.context[channel] !== undefined) {
            this.unsubscribe = this.context[channel].subscribe(setTheme.bind(this));
          }
        };

        _proto.componentWillUnmount = function componentWillUnmount() {
          if (this.unsubscribe !== undefined) {
            this.context[channel].unsubscribe(this.unsubscribe);
          }
        };

        _proto.render = function render() {
          var props = this.props,
              state = this.state;
          this.mergedProps = pickAssign(testAlwaysTrue, {}, props, {
            theme: state !== null && state.theme || props.theme || {}
          });
          var className = '';
          var classInterpolations = [];

          if (props.className) {
            if (staticClassName === undefined) {
              className += emotion.getRegisteredStyles(classInterpolations, props.className);
            } else {
              className += props.className + " ";
            }
          }

          if (staticClassName === undefined) {
            className += emotion.css.apply(this, styles.concat(classInterpolations));
          } else {
            className += staticClassName;
          }

          if (stableClassName !== undefined) {
            className += " " + stableClassName;
          }

          return view.createElement(baseTag, // $FlowFixMe
          pickAssign(shouldForwardProp, {}, props, {
            className: className,
            ref: props.innerRef
          }));
        };

        return Styled;
      }(view.Component);

      Styled.displayName = identifierName !== undefined ? identifierName : "Styled(" + (typeof baseTag === 'string' ? baseTag : baseTag.displayName || baseTag.name || 'Component') + ")";

      if (tag.defaultProps !== undefined) {
        // $FlowFixMe
        Styled.defaultProps = tag.defaultProps;
      }

      Styled.contextTypes = contextTypes;
      Styled.__emotion_styles = styles;
      Styled.__emotion_base = baseTag;
      Styled.__emotion_real = Styled;
      Styled.__emotion_forwardProp = shouldForwardProp;
      Object.defineProperty(Styled, 'toString', {
        value: function value() {
          if ("production" !== 'production' && stableClassName === undefined) {
            return 'NO_COMPONENT_SELECTOR';
          } // $FlowFixMe


          return "." + stableClassName;
        }
      });

      Styled.withComponent = function (nextTag, nextOptions) {
        return _createStyled(nextTag, nextOptions !== undefined ? // $FlowFixMe
        pickAssign(testAlwaysTrue, {}, options, nextOptions) : options).apply(void 0, styles);
      };

      return Styled;
    };
  };

  if ("production" !== 'production' && typeof Proxy !== 'undefined') {
    _createStyled = new Proxy(_createStyled, {
      get: function get(target, property) {
        switch (property) {
          // react-hot-loader tries to access this stuff
          case '__proto__':
          case 'name':
          case 'prototype':
          case 'displayName':
            {
              return target[property];
            }

          default:
            {
              throw new Error("You're trying to use the styled shorthand without babel-plugin-emotion." + ("\nPlease install and setup babel-plugin-emotion or use the function call syntax(`styled('" + property + "')` instead of `styled." + property + "`)"));
            }
        }
      }
    });
  }

  return _createStyled;
}

var _default = createEmotionStyled;
exports.default = _default;
},{"prop-types":"5D9O","@emotion/is-prop-valid":"gPI/"}],"DOVm":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

var _preact = _interopRequireDefault(require("preact"));

var emotion = _interopRequireWildcard(require("emotion"));

Object.keys(emotion).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return emotion[key];
    }
  });
});

var _createEmotionStyled = _interopRequireDefault(require("create-emotion-styled"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var index = (0, _createEmotionStyled.default)(emotion, _preact.default);
var _default = index;
exports.default = _default;
},{"preact":"OmAK","emotion":"mibh","create-emotion-styled":"3Rtg"}],"VnyP":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

exports.__esModule = true;

var TraktIcon_1 = __importDefault(require("./TraktIcon"));

var preact_1 = __importStar(require("preact"));

var emotion_1 = require("emotion");

var preact_emotion_1 = __importDefault(require("preact-emotion"));

var h = preact_1["default"].h;
var className = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: black;\n  border: 1px solid #222;\n  border-radius: 5px;\n  padding: 2px 7px;\n  color: white;\n  font-size: 11px;\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n\n  &:hover {\n    background-color: #444;\n  }\n"], ["\n  background-color: black;\n  border: 1px solid #222;\n  border-radius: 5px;\n  padding: 2px 7px;\n  color: white;\n  font-size: 11px;\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n\n  &:hover {\n    background-color: #444;\n  }\n"])));
var Icon = preact_emotion_1["default"](TraktIcon_1["default"])(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  height: 14px;\n  width: 14px;\n  margin-right: 5px;\n"], ["\n  height: 14px;\n  width: 14px;\n  margin-right: 5px;\n"])));

var ConnectButton =
/** @class */
function (_super) {
  __extends(ConnectButton, _super);

  function ConnectButton(props) {
    var _this = _super.call(this, props) || this;

    _this.state = {
      isConnected: _this.props.api.isAuthenticated()
    };
    _this._handleAuthenticationChanged = _this._handleAuthenticationChanged.bind(_this);
    _this._handleClick = _this._handleClick.bind(_this);
    return _this;
  }

  ConnectButton.prototype.componentWillMount = function () {
    this.props.api.onAuthenticationChanged.sub(this._handleAuthenticationChanged);
  };

  ConnectButton.prototype.componentWillUnmount = function () {
    this.props.api.onAuthenticationChanged.unsub(this._handleAuthenticationChanged);
  };

  ConnectButton.prototype._handleAuthenticationChanged = function () {
    this.setState({
      isConnected: this.props.api.isAuthenticated()
    });
  };

  ConnectButton.prototype._handleClick = function () {
    var api = this.props.api;

    if (api.isAuthenticated()) {
      api.disconnect();
    } else {
      api.authenticate();
    }
  };

  ConnectButton.prototype.render = function () {
    return h("div", {
      className: className,
      onClick: this._handleClick
    }, h(Icon, null), h("div", {
      class: "text"
    }, this.state.isConnected ? "Disconnect from Trakt" : "Connect with Trakt"));
  };

  return ConnectButton;
}(preact_1.Component);

exports["default"] = ConnectButton;
var templateObject_1, templateObject_2;
},{"./TraktIcon":"B913","preact":"OmAK","emotion":"mibh","preact-emotion":"DOVm"}],"+b4v":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

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

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

exports.__esModule = true;

var preact_1 = __importStar(require("preact"));

var emotion_1 = require("emotion");

var h = preact_1["default"].h;
var className = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n& .info h2 {\n  font-size: 17px;\n  padding-bottom: 4px;\n}\n"], ["\n& .info h2 {\n  font-size: 17px;\n  padding-bottom: 4px;\n}\n"])));

var ScrobbleInfo =
/** @class */
function (_super) {
  __extends(ScrobbleInfo, _super);

  function ScrobbleInfo(props) {
    return _super.call(this, props) || this;
  }

  ScrobbleInfo.prototype.render = function () {
    var data = this.props.scrobbleData;
    var info; // Still looking up

    if (!data) {
      info = h("div", {
        class: "lookup"
      }, "Loading\u2026"); // Lookup succeeded
    } else {
      if (data.movie && data.movie.ids) {
        var movieUrl = "https://trakt.tv/movies/" + data.movie.ids.slug;
        info = h("div", {
          class: "info"
        }, h("h2", null, h("a", {
          href: movieUrl,
          target: "_blank"
        }, data.movie.title, " (", data.movie.year, ")")));
      } else if (data.show && data.show.ids && data.episode && data.episode.ids) {
        var showUrl = "https://trakt.tv/shows/" + data.show.ids.slug;
        var episodeUrl = showUrl + "/seasons/" + data.episode.season + "/episodes/" + data.episode.number;
        var episodeTitle = data.episode.title ? ": " + data.episode.title : null;
        info = h("div", {
          class: "info"
        }, h("h2", null, h("a", {
          href: showUrl,
          target: "_blank"
        }, data.show.title, " (", data.show.year, ")")), h("p", null, h("a", {
          href: episodeUrl,
          target: "_blank"
        }, "Season ", data.episode.season, " Episode ", data.episode.number, episodeTitle)));
      } else {
        info = h("div", {
          class: "error"
        }, h("h2", null, "Failed to scrobble:"), h("p", null, "Missing data"));
      }
    }

    return h("div", {
      className: className
    }, info);
  };

  return ScrobbleInfo;
}(preact_1.Component);

exports["default"] = ScrobbleInfo;
var templateObject_1;
},{"preact":"OmAK","emotion":"mibh"}],"YunZ":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

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

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

exports.__esModule = true;

var preact_1 = __importStar(require("preact"));

var emotion_1 = require("emotion");

var h = preact_1["default"].h;
var className = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  font-size: 12px;\n  font-weight: bold;\n  color: #eee;\n  background-color: #333;\n  border: none;\n  border-radius: 3px;\n  margin: 5px;\n  cursor: pointer;\n  padding: 5px 10px 5px 10px;\n  flex-grow: 1;\n  transition: all 0.2s ease;\n\n  &:hover {\n    background-color: #555;\n  }\n"], ["\n  font-size: 12px;\n  font-weight: bold;\n  color: #eee;\n  background-color: #333;\n  border: none;\n  border-radius: 3px;\n  margin: 5px;\n  cursor: pointer;\n  padding: 5px 10px 5px 10px;\n  flex-grow: 1;\n  transition: all 0.2s ease;\n\n  &:hover {\n    background-color: #555;\n  }\n"])));

var Button =
/** @class */
function (_super) {
  __extends(Button, _super);

  function Button() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Button.prototype.render = function () {
    return h("button", {
      className: className + " " + this.props.className + " " + (this.props.disabled ? 'disabled' : ''),
      onClick: this.props.onClick
    }, this.props.text);
  };

  return Button;
}(preact_1.Component);

exports["default"] = Button;
var templateObject_1;
},{"preact":"OmAK","emotion":"mibh"}],"CZem":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

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

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
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
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

exports.__esModule = true;

var TraktScrobble_1 = __importDefault(require("../TraktScrobble"));

var Button_1 = __importDefault(require("./Button"));

var preact_1 = __importStar(require("preact"));

var emotion_1 = require("emotion");

var h = preact_1["default"].h;
var className = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  & div {\n    display: flex;\n    justify-content: space-between;\n    border-bottom: 1px solid #666;\n    height: 24px;\n    align-items: flex-end;\n  }\n\n  & button {\n    flex-grow: 0;\n    font-size: 9px;\n    padding: 2px 10px;\n    margin-right: 0;\n    font-weight: normal;\n    opacity: 0;\n    visibility: hidden;\n    transition: all 0.2s ease;\n  }\n\n  & button:hover {\n    background-color: #eb3b14;\n  }\n\n  & div:hover button {\n    opacity: 1;\n    visibility: visible;\n  }\n"], ["\n  & div {\n    display: flex;\n    justify-content: space-between;\n    border-bottom: 1px solid #666;\n    height: 24px;\n    align-items: flex-end;\n  }\n\n  & button {\n    flex-grow: 0;\n    font-size: 9px;\n    padding: 2px 10px;\n    margin-right: 0;\n    font-weight: normal;\n    opacity: 0;\n    visibility: hidden;\n    transition: all 0.2s ease;\n  }\n\n  & button:hover {\n    background-color: #eb3b14;\n  }\n\n  & div:hover button {\n    opacity: 1;\n    visibility: visible;\n  }\n"])));
var ActionMap = {
  scrobble: "Scrobbled",
  checkin: "Checked in",
  watch: "Watched"
};

var ScrobbleHistory =
/** @class */
function (_super) {
  __extends(ScrobbleHistory, _super);

  function ScrobbleHistory(props) {
    var _this = _super.call(this, props) || this;

    _this._formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
    _this.state = {
      historyItems: null
    };
    _this._handleHistoryChanged = _this._handleHistoryChanged.bind(_this);
    return _this;
  }

  ScrobbleHistory.prototype.componentWillMount = function () {
    var data = this.props.scrobbleData;
    this._traktId = TraktScrobble_1["default"].traktIdFromData(data);

    if (this._traktId !== 0) {
      var type = TraktScrobble_1["default"].typeFromData(data);
      this.props.history.sub(this._traktId, this._handleHistoryChanged);
      this.props.history.load(type === "movie" ? "movies" : "episodes", this._traktId);
    }
  };

  ScrobbleHistory.prototype.componentWillUnmount = function () {
    this.props.history.unsub(this._traktId, this._handleHistoryChanged);
  };

  ScrobbleHistory.prototype._handleHistoryChanged = function (items) {
    this.setState({
      historyItems: items
    });
  };

  ScrobbleHistory.prototype._handleRemove = function (e, item) {
    return __awaiter(this, void 0, void 0, function () {
      var el;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            el = e.target;
            el.classList.add("disabled");
            el.innerText = "Removing...";
            return [4
            /*yield*/
            , this.props.history.remove(item.id)];

          case 1:
            _a.sent();

            el.classList.remove("disabled");
            el.innerText = "Remove";
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  ScrobbleHistory.prototype.render = function () {
    var _this = this;

    if (this.state.historyItems && this.state.historyItems.length > 0) {
      var rows = [];

      var _loop_1 = function (item) {
        rows.push(h("div", null, h("span", null, ActionMap[item.action], " at ", this_1._formatter.format(new Date(item.watched_at))), h(Button_1.default, {
          text: "Remove",
          onClick: function (e) {
            return _this._handleRemove(e, item);
          }
        })));
      };

      var this_1 = this;

      for (var _i = 0, _a = this.state.historyItems; _i < _a.length; _i++) {
        var item = _a[_i];

        _loop_1(item);
      }

      return h("div", {
        className: className
      }, h("h2", null, "Watch History"), rows);
    } else {
      return null;
    }
  };

  return ScrobbleHistory;
}(preact_1.Component);

exports["default"] = ScrobbleHistory;
var templateObject_1;
},{"../TraktScrobble":"SXC6","./Button":"YunZ","preact":"OmAK","emotion":"mibh"}],"q6Da":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

exports.__esModule = true;

var TraktScrobble_1 = require("../TraktScrobble");

var Button_1 = __importDefault(require("./Button"));

var preact_1 = __importStar(require("preact"));

var emotion_1 = require("emotion");

var preact_emotion_1 = __importDefault(require("preact-emotion"));

var h = preact_1["default"].h;
var className = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  margin: 5px -5px;\n  justify-content: space-between;\n\n  & > div, & > button {\n    width: 33%;\n  }\n\n  & .state {\n    font-size: 12px;\n    font-weight: bold;\n    text-align: center;\n    color: #fff;\n    background-color: #ed1c24;\n    border: none;\n    border-radius: 3px;\n    margin: 5px;\n    padding: 5px 10px 5px 10px;\n    width: 20%;\n  }\n"], ["\n  display: flex;\n  margin: 5px -5px;\n  justify-content: space-between;\n\n  & > div, & > button {\n    width: 33%;\n  }\n\n  & .state {\n    font-size: 12px;\n    font-weight: bold;\n    text-align: center;\n    color: #fff;\n    background-color: #ed1c24;\n    border: none;\n    border-radius: 3px;\n    margin: 5px;\n    padding: 5px 10px 5px 10px;\n    width: 20%;\n  }\n"])));
var ScrobbleNowButton = preact_emotion_1["default"](Button_1["default"])(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: #8e44ad;\n  border: 1px solid #8e44ad;\n  background: none;\n\n  &:hover {\n    background-color: #8e44ad;\n    color: #fff;\n  }\n"], ["\n  color: #8e44ad;\n  border: 1px solid #8e44ad;\n  background: none;\n\n  &:hover {\n    background-color: #8e44ad;\n    color: #fff;\n  }\n"])));
var EnableScrobbleButton = preact_emotion_1["default"](Button_1["default"])(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: #16a085;\n  border: 1px solid #16a085;\n  background: none;\n\n  &:hover {\n    background-color: #16a085;\n    color: #fff;\n  }\n"], ["\n  color: #16a085;\n  border: 1px solid #16a085;\n  background: none;\n\n  &:hover {\n    background-color: #16a085;\n    color: #fff;\n  }\n"])));
var EnabledStates = [TraktScrobble_1.TraktScrobbleState.Found, TraktScrobble_1.TraktScrobbleState.Started, TraktScrobble_1.TraktScrobbleState.Paused];

var ScrobbleControl =
/** @class */
function (_super) {
  __extends(ScrobbleControl, _super);

  function ScrobbleControl(props) {
    var _this = _super.call(this, props) || this;

    _this.state = {
      scrobbleState: _this.props.scrobble.state,
      scrobblingEnabled: _this.props.roller.enabled
    };
    _this._onScrobbleStateChanged = _this._onScrobbleStateChanged.bind(_this);
    _this._onEnabledChanged = _this._onEnabledChanged.bind(_this);
    _this._handleScrobbleNowClick = _this._handleScrobbleNowClick.bind(_this);
    _this._handleEnableScrobbleClick = _this._handleEnableScrobbleClick.bind(_this);
    return _this;
  }

  ScrobbleControl.prototype.componentWillMount = function () {
    this.props.scrobble.onStateChanged.sub(this._onScrobbleStateChanged);
    this.props.roller.onEnabledChanged.sub(this._onEnabledChanged);
  };

  ScrobbleControl.prototype.componentWillUnmount = function () {
    this.props.scrobble.onStateChanged.unsub(this._onScrobbleStateChanged);
    this.props.roller.onEnabledChanged.unsub(this._onEnabledChanged);
  };

  ScrobbleControl.prototype._onScrobbleStateChanged = function (state) {
    this.setState({
      scrobbleState: state
    });
  };

  ScrobbleControl.prototype._onEnabledChanged = function (enabled) {
    this.setState({
      scrobblingEnabled: enabled
    });
  };

  ScrobbleControl.prototype._handleScrobbleNowClick = function () {
    this.props.scrobble.scrobbleNow();
  };

  ScrobbleControl.prototype._handleEnableScrobbleClick = function () {
    this.props.roller.enabled = !this.props.roller.enabled;
  };

  ScrobbleControl.prototype.render = function () {
    var state = this.props.scrobble.enabled ? "Disabled" : TraktScrobble_1.TraktScrobbleState[this.props.scrobble.state];
    var title = this.props.scrobble.error || "";
    var disabled = !EnabledStates.includes(this.state.scrobbleState);
    var label = this.props.roller.enabled ? "Enable Scrobbling" : "Disable Scrobbling";
    return h("div", {
      className: className
    }, h("div", {
      class: "state",
      title: title
    }, state), h(ScrobbleNowButton, {
      text: "Scrobble Now",
      onClick: this._handleScrobbleNowClick,
      disabled: disabled
    }), h(EnableScrobbleButton, {
      text: label,
      onClick: this._handleEnableScrobbleClick
    }));
  };

  return ScrobbleControl;
}(preact_1.Component);

exports["default"] = ScrobbleControl;
var templateObject_1, templateObject_2, templateObject_3;
},{"../TraktScrobble":"SXC6","./Button":"YunZ","preact":"OmAK","emotion":"mibh","preact-emotion":"DOVm"}],"a5I5":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

exports.__esModule = true;

var TraktScrobble_1 = __importDefault(require("../TraktScrobble"));

var ScrobbleInfo_1 = __importDefault(require("./ScrobbleInfo"));

var ScrobbleHistory_1 = __importDefault(require("./ScrobbleHistory"));

var ScrobbleControl_1 = __importDefault(require("./ScrobbleControl"));

var preact_1 = __importStar(require("preact"));

var emotion_1 = require("emotion");

var h = preact_1["default"].h;
var className = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: #eee;\n\n  & > div {\n    padding: 15px;\n  }\n\n  & a, & p a {\n    color: #eee;\n    transition: color 0.2s ease;\n  }\n\n  & h2 {\n    font-size: 13px;\n    margin: 0;\n  }\n\n  & h2 a:hover, & p a:hover {\n    color: #ed1c24;\n    text-decoration: none;\n  }\n\n  button.disabled {\n    pointer-events: none;\n    opacity: 0.5;\n  }\n"], ["\n  color: #eee;\n\n  & > div {\n    padding: 15px;\n  }\n\n  & a, & p a {\n    color: #eee;\n    transition: color 0.2s ease;\n  }\n\n  & h2 {\n    font-size: 13px;\n    margin: 0;\n  }\n\n  & h2 a:hover, & p a:hover {\n    color: #ed1c24;\n    text-decoration: none;\n  }\n\n  button.disabled {\n    pointer-events: none;\n    opacity: 0.5;\n  }\n"])));

var Popup =
/** @class */
function (_super) {
  __extends(Popup, _super);

  function Popup(props) {
    var _this = _super.call(this, props) || this;

    _this._onScrobbleStatusChanged = _this._onScrobbleStatusChanged.bind(_this);
    return _this;
  }

  Popup.prototype.componentWillMount = function () {
    this.setState({
      scrobbleData: this.props.scrobble.data
    });
    this.props.scrobble.onStateChanged.sub(this._onScrobbleStatusChanged);
  };

  Popup.prototype.componentWillUnmount = function () {
    this.props.scrobble.onStateChanged.unsub(this._onScrobbleStatusChanged);
  };

  Popup.prototype._onScrobbleStatusChanged = function (state) {
    this.setState({
      scrobbleData: this.props.scrobble.data
    });
  };

  Popup.prototype.render = function () {
    var scrobble = this.props.scrobble;
    return h("div", {
      className: className
    }, h(ScrobbleInfo_1.default, {
      scrobbleData: this.state.scrobbleData
    }), h(ScrobbleHistory_1.default, {
      scrobbleData: this.state.scrobbleData,
      history: this.props.history,
      key: TraktScrobble_1["default"].traktIdFromData(this.state.scrobbleData)
    }), h(ScrobbleControl_1.default, {
      scrobble: this.props.scrobble,
      roller: this.props.roller
    }));
  };

  return Popup;
}(preact_1.Component);

exports["default"] = Popup;
var templateObject_1;
},{"../TraktScrobble":"SXC6","./ScrobbleInfo":"+b4v","./ScrobbleHistory":"CZem","./ScrobbleControl":"q6Da","preact":"OmAK","emotion":"mibh"}],"BUYa":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

exports.__esModule = true;

var TraktScrobble_1 = require("../TraktScrobble");

var TraktIcon_1 = __importDefault(require("./TraktIcon"));

var Popup_1 = __importDefault(require("./Popup"));

var preact_1 = __importStar(require("preact"));

var emotion_1 = require("emotion");

var preact_emotion_1 = __importDefault(require("preact-emotion"));

var h = preact_1["default"].h;
var popupClassName = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: #161616;\n  border: 1px solid #fff;\n  position: absolute;\n  width: 450px;\n  z-index: 100;\n  left: -209px;\n  border-radius: 4px;\n  transition: all 0.2s ease-in;\n  transition-delay: 0.2s;\n  visibility: hidden;\n  opacity: 0;\n  bottom: 55px;\n\n  &:after, &:before {\n    top: 100%;\n    left: 50%;\n    border: solid transparent;\n    content: \" \";\n    height: 0;\n    width: 0;\n    position: absolute;\n    pointer-events: none;\n  }\n  &:after {\n    border-color: rgba(0, 0, 0, 0);\n    border-top-color: #000000;\n    border-width: 15px;\n    margin-left: -15px;\n  }\n  &:before {\n    border-color: rgba(255, 255, 255, 0);\n    border-top-color: #fff;\n    border-width: 17px;\n    margin-left: -17px;\n  }\n  & .hover-blocker {\n    position: absolute;\n    bottom: -75px;\n    left: 33%;\n    width: 33%;\n    height: 75px;\n  }\n"], ["\n  background: #161616;\n  border: 1px solid #fff;\n  position: absolute;\n  width: 450px;\n  z-index: 100;\n  left: -209px;\n  border-radius: 4px;\n  transition: all 0.2s ease-in;\n  transition-delay: 0.2s;\n  visibility: hidden;\n  opacity: 0;\n  bottom: 55px;\n\n  &:after, &:before {\n    top: 100%;\n    left: 50%;\n    border: solid transparent;\n    content: \" \";\n    height: 0;\n    width: 0;\n    position: absolute;\n    pointer-events: none;\n  }\n  &:after {\n    border-color: rgba(0, 0, 0, 0);\n    border-top-color: #000000;\n    border-width: 15px;\n    margin-left: -15px;\n  }\n  &:before {\n    border-color: rgba(255, 255, 255, 0);\n    border-top-color: #fff;\n    border-width: 17px;\n    margin-left: -17px;\n  }\n  & .hover-blocker {\n    position: absolute;\n    bottom: -75px;\n    left: 33%;\n    width: 33%;\n    height: 75px;\n  }\n"])));
var className = emotion_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: relative;\n\n  &:hover .", " {\n    visibility: visible;\n    opacity: 1;\n    bottom: 44px;\n  }\n"], ["\n  position: relative;\n\n  &:hover .", " {\n    visibility: visible;\n    opacity: 1;\n    bottom: 44px;\n  }\n"])), popupClassName);
var buttonClassName = emotion_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 38px;\n  height: 24px;\n  background: none;\n  border: none;\n  cursor: pointer;\n  position: relative;\n  z-index: 101;\n\n  &.state-disabled {\n    filter: opacity(0.5);\n  }\n  &.state-scrobbled {\n    filter: hue-rotate(150deg) brightness(1.3);\n  }\n  &.state-error, &.state-notfound {\n    filter: grayscale(1) brightness(2);\n  }\n"], ["\n  width: 38px;\n  height: 24px;\n  background: none;\n  border: none;\n  cursor: pointer;\n  position: relative;\n  z-index: 101;\n\n  &.state-disabled {\n    filter: opacity(0.5);\n  }\n  &.state-scrobbled {\n    filter: hue-rotate(150deg) brightness(1.3);\n  }\n  &.state-error, &.state-notfound {\n    filter: grayscale(1) brightness(2);\n  }\n"])));
var Icon = preact_emotion_1["default"](TraktIcon_1["default"])(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  height: 100%;\n"], ["\n  height: 100%;\n"])));

var StatusButton =
/** @class */
function (_super) {
  __extends(StatusButton, _super);

  function StatusButton(props) {
    var _this = _super.call(this, props) || this;

    _this.state = {
      scrobbleState: _this.props.scrobble.state,
      enabled: _this.props.roller.enabled
    };
    _this._onScrobbleStatusChanged = _this._onScrobbleStatusChanged.bind(_this);
    _this._onEnabledChanged = _this._onEnabledChanged.bind(_this);
    _this._handleClick = _this._handleClick.bind(_this);
    return _this;
  }

  StatusButton.prototype.componentWillMount = function () {
    this.props.scrobble.onStateChanged.sub(this._onScrobbleStatusChanged);
    this.props.roller.onEnabledChanged.sub(this._onEnabledChanged);
  };

  StatusButton.prototype.componentWillUnmount = function () {
    this.props.scrobble.onStateChanged.unsub(this._onScrobbleStatusChanged);
    this.props.roller.onEnabledChanged.unsub(this._onEnabledChanged);
  };

  StatusButton.prototype._onScrobbleStatusChanged = function (state) {
    this.setState({
      scrobbleState: state
    });
  };

  StatusButton.prototype._onEnabledChanged = function (enabled) {
    this.setState({
      enabled: enabled
    });
  };

  StatusButton.prototype._handleClick = function () {
    window.open(this.props.scrobble.scrobbleUrl(), '_blank');
  };

  StatusButton.prototype.render = function () {
    var state = this.state.enabled ? "disabled" : TraktScrobble_1.TraktScrobbleState[this.state.scrobbleState].toLowerCase();
    var stateClass = "state-" + state;
    var title = this.props.scrobble.error || TraktScrobble_1.TraktScrobbleState[this.state.scrobbleState];
    return h("div", {
      className: className + " right"
    }, h("button", {
      className: buttonClassName + " " + stateClass,
      title: title,
      onClick: this._handleClick
    }, h(Icon, null)), h("div", {
      className: popupClassName
    }, h(Popup_1.default, {
      roller: this.props.roller,
      scrobble: this.props.scrobble,
      history: this.props.history
    }), h("div", {
      class: "hover-blocker"
    })));
  };

  return StatusButton;
}(preact_1.Component);

exports["default"] = StatusButton;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
},{"../TraktScrobble":"SXC6","./TraktIcon":"B913","./Popup":"a5I5","preact":"OmAK","emotion":"mibh","preact-emotion":"DOVm"}],"NFyx":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
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
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

exports.__esModule = true;

var TraktApi_1 = __importDefault(require("./TraktApi"));
/** Load a manage Trakt watched history */


var TraktHistory =
/** @class */
function () {
  function TraktHistory(api) {
    this._histories = {};
    this._api = api;
  }
  /** Load history for a movie or episode */


  TraktHistory.prototype.load = function (type, traktId, reload) {
    if (reload === void 0) {
      reload = false;
    }

    return __awaiter(this, void 0, Promise, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!reload && this._histories[traktId] && this._histories[traktId].items) {
              return [2
              /*return*/
              , this._histories[traktId].items];
            }

            return [4
            /*yield*/
            , this._api.history(type, traktId)];

          case 1:
            result = _a.sent();

            if (TraktApi_1["default"].isError(result)) {
              console.error("TraktRoller: Error loading scrobble history (" + result.error + ")");
              return [2
              /*return*/
              , []];
            }

            this._update(traktId, result);

            return [2
            /*return*/
            , result];
        }
      });
    });
  };
  /** Add a new item to the history */


  TraktHistory.prototype.add = function (traktId, item) {
    var history = this._getOrCreateHistory(traktId);

    if (!history.items) history.items = [];
    history.items.push(item);
    history.items.sort(function (a, b) {
      return new Date(b.watched_at).valueOf() - new Date(a.watched_at).valueOf();
    });

    this._update(traktId, history.items);
  };
  /** Remove a watched entry by its id */


  TraktHistory.prototype.remove = function (historyId) {
    return __awaiter(this, void 0, Promise, function () {
      var result, _i, _a, traktId, history, i;

      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4
            /*yield*/
            , this._api.historyRemove(historyId)];

          case 1:
            result = _b.sent();

            if (TraktApi_1["default"].isError(result)) {
              console.error("TraktRoller: Error removing scrobble (" + result.error + ")");
              return [2
              /*return*/
              ];
            } else if (result.not_found.ids.includes(historyId)) {
              console.warn("TraktRoller: Could not remove history id " + historyId + ", not found on server");
            }

            outer: for (_i = 0, _a = Object.keys(this._histories); _i < _a.length; _i++) {
              traktId = _a[_i];
              history = this._histories[traktId];
              if (!history.items) continue;

              for (i = 0; i < history.items.length; i++) {
                if (history.items[i].id === historyId) {
                  history.items.splice(i, 1);

                  this._update(history.traktId, history.items);

                  break outer;
                }
              }
            }

            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /** Get notified when the history changes */


  TraktHistory.prototype.sub = function (traktId, callback) {
    var history = this._getOrCreateHistory(traktId);

    history.subscribers.push(callback);
  };
  /** Remove a history subscriber */


  TraktHistory.prototype.unsub = function (traktId, callback) {
    var history = this._histories[traktId];
    if (!history) return;
    var index = history.subscribers.indexOf(callback);
    if (index >= 0) history.subscribers.splice(index, 1);
  };

  TraktHistory.prototype._getOrCreateHistory = function (traktId) {
    var history = this._histories[traktId];

    if (!history) {
      history = this._histories[traktId] = {
        traktId: traktId,
        items: null,
        subscribers: []
      };
    }

    return history;
  };

  TraktHistory.prototype._update = function (traktId, items) {
    var history = this._getOrCreateHistory(traktId);

    history.items = items;

    for (var _i = 0, _a = history.subscribers; _i < _a.length; _i++) {
      var sub = _a[_i];
      sub(items);
    }
  };

  return TraktHistory;
}();

exports["default"] = TraktHistory;
},{"./TraktApi":"bK1h"}],"n8p7":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
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
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
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

exports.__esModule = true;

var TraktApi_1 = __importStar(require("./TraktApi"));

var TraktScrobble_1 = __importStar(require("./TraktScrobble"));

var ConnectButton_1 = __importDefault(require("./ui/ConnectButton"));

var StatusButton_1 = __importDefault(require("./ui/StatusButton"));

var ste_simple_events_1 = require("ste-simple-events");

var preact_1 = __importStar(require("preact"));

var TraktHistory_1 = __importDefault(require("./TraktHistory"));

var h = preact_1["default"].h;
var EpisodeRegex = /Episode (\d+)/;
var SeasonRegex = /Season (\d+)/;
var MovieRegexes = [/Movie$/i, /Movie (Dub)$/i, /Movie (Sub)$/i, /Movie (Dubbed)$/i, /Movie (Subtitled)$/i, /^Movie - /i, /The Movie/i];
var ScrobblingEnabledKey = 'TraktRoller.enabled';

var TraktRoller =
/** @class */
function () {
  function TraktRoller(options) {
    this.onEnabledChanged = new ste_simple_events_1.SimpleEventDispatcher();
    console.log("TraktRoller");
    this._storage = options.storage || new TraktApi_1.LocalStorageAdapter();

    this._loadPrefs();

    this._api = new TraktApi_1["default"](options);

    this._api.onAuthenticationChanged.sub(this._onAuthenticationChange.bind(this));

    this._api.loadTokens();

    this._createFooterButton();

    this._waitForPlayer();
  }

  Object.defineProperty(TraktRoller.prototype, "enabled", {
    get: function () {
      return this._enabled;
    },
    set: function (value) {
      if (this._enabled === value) return;
      this._enabled = value;

      this._storage.setValue(ScrobblingEnabledKey, value ? "true" : "false");

      if (this._scrobble) this._scrobble.enabled = value;
      this.onEnabledChanged.dispatch(value);
    },
    enumerable: true,
    configurable: true
  });

  TraktRoller.prototype._loadPrefs = function () {
    return __awaiter(this, void 0, void 0, function () {
      var _a;

      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _a = this;
            return [4
            /*yield*/
            , this._storage.getValue(ScrobblingEnabledKey)];

          case 1:
            _a._enabled = _b.sent() === "true";
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  TraktRoller.prototype._waitForPlayer = function () {
    var _this = this;

    if (unsafeWindow.VILOS_PLAYERJS) {
      this._loadPlayer(unsafeWindow.VILOS_PLAYERJS);
    } else {
      // Use a setter to wait for the player to be set
      var value_1;
      Object.defineProperty(unsafeWindow, "VILOS_PLAYERJS", {
        get: function () {
          return value_1;
        },
        set: function (v) {
          value_1 = v;

          _this._loadPlayer(v);
        }
      });
    }
  };

  TraktRoller.prototype._loadPlayer = function (player) {
    var _this = this;

    player.on(playerjs.EVENTS.READY, function () {
      return _this._playerReady(player);
    });
  };

  TraktRoller.prototype._playerReady = function (player) {
    var _this = this;

    if (!this._api.isAuthenticated()) return;

    var data = this._getScrobbleData();

    if (!data) return;
    this._player = player;

    this._player.on(playerjs.EVENTS.TIMEUPDATE, function (info) {
      return _this._onTimeChanged(info);
    });

    this._player.on(playerjs.EVENTS.PLAY, function () {
      return _this._onPlaybackStateChange(TraktScrobble_1.PlaybackState.Playing);
    });

    this._player.on(playerjs.EVENTS.PAUSE, function () {
      return _this._onPlaybackStateChange(TraktScrobble_1.PlaybackState.Paused);
    });

    this._player.on(playerjs.EVENTS.ENDED, function () {
      return _this._onPlaybackStateChange(TraktScrobble_1.PlaybackState.Ended);
    });

    this._player.on(playerjs.EVENTS.ERROR, function () {
      return _this._onPlaybackStateChange(TraktScrobble_1.PlaybackState.Ended);
    });

    this._history = new TraktHistory_1["default"](this._api);
    this._scrobble = new TraktScrobble_1["default"](this._api, data);
    this._scrobble.enabled = this.enabled;

    this._scrobble.onStateChanged.sub(this._onScrobbleStatusChanged.bind(this));

    this._scrobble.onScrobbled.sub(this._onScrobbled.bind(this));

    this._createStatusButton();
  };

  TraktRoller.prototype._onTimeChanged = function (info) {
    this._currentTime = info.seconds;
    this._duration = info.duration;
    if (this._scrobble) this._scrobble.setPlaybackTime(info.seconds, info.duration);
  };

  TraktRoller.prototype._onPlaybackStateChange = function (state) {
    if (!this._scrobble) return;

    this._scrobble.setPlaybackState(state, this._getProgress());
  };

  TraktRoller.prototype._getProgress = function () {
    if (!this._duration) {
      console.warn("TraktRoller: Duration is not set (" + this._duration + ")");
      return 0;
    } else if (this._duration === undefined) {
      console.warn("TraktRoller: Current time is not set");
      return 0;
    }

    return this._currentTime / this._duration * 100;
  };

  TraktRoller.prototype._getScrobbleData = function () {
    var buildDate = new Date("2019-01-15T19:21:02.898Z");
    var data = {
      progress: this._getProgress(),
      app_version: "1.0.2",
      app_date: buildDate.getFullYear() + "-" + (buildDate.getMonth() + 1) + "-" + buildDate.getDate()
    };
    var titleElement = document.querySelector('#showmedia_about_episode_num');

    if (!titleElement || titleElement.textContent.length == 0) {
      console.error("TraktRoller: Could not find video title");
      return null;
    }

    var showTitle = titleElement.textContent.trim();
    var episodeTitle = undefined;
    var episodeTitleElement = document.querySelector('#showmedia_about_name');

    if (episodeTitleElement) {
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

    var seasonNumber = 1;
    var episodeNumber = 0;
    var episodeElement = document.querySelector('#showmedia_about_media h4:nth-child(2)');

    if (episodeElement && episodeElement.textContent.length > 0) {
      var seasonMatch = SeasonRegex.exec(episodeElement.textContent);

      if (seasonMatch) {
        seasonNumber = parseInt(seasonMatch[1]);
      }

      var episodeMatch = EpisodeRegex.exec(episodeElement.textContent);

      if (episodeMatch) {
        episodeNumber = parseInt(episodeMatch[1]);
      }
    }

    if (episodeTitle && MovieRegexes.some(function (r) {
      return r.test(episodeTitle);
    })) {
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
  };

  TraktRoller.prototype._onAuthenticationChange = function (isAuthenticated) {
    if (!isAuthenticated) {
      this._api.checkAuthenticationResult(window.location.href);
    }
  };

  TraktRoller.prototype._onScrobbleStatusChanged = function (state) {//
  };

  TraktRoller.prototype._onScrobbled = function (result) {
    var item = {
      id: result.id,
      watched_at: new Date().toISOString(),
      action: "scrobble",
      type: result.movie ? 'movie' : 'episode',
      movie: result.movie,
      show: result.show,
      episode: result.episode
    };
    var traktId = result.movie ? result.movie.ids.trakt : result.episode.ids.trakt;

    this._history.add(traktId, item);
  };

  TraktRoller.prototype._createFooterButton = function () {
    var footer = document.querySelector('#social_media');

    if (!footer) {
      console.error("TraktRoller: Could not find footer to add trakt connect button");
      return;
    }

    preact_1.render(h("div", {
      class: "footer-column"
    }, h(ConnectButton_1.default, {
      api: this._api
    })), footer);
  };

  TraktRoller.prototype._createStatusButton = function () {
    var container = document.querySelector('.showmedia-submenu');

    if (!container) {
      console.error("TraktRoller: Could not find share row to add trakt status button");
      return;
    }

    preact_1.render(h(StatusButton_1.default, {
      roller: this,
      scrobble: this._scrobble,
      history: this._history
    }), container);
  };

  return TraktRoller;
}();

exports["default"] = TraktRoller;
},{"./TraktApi":"bK1h","./TraktScrobble":"SXC6","./ui/ConnectButton":"VnyP","./ui/StatusButton":"BUYa","ste-simple-events":"/WWW","preact":"OmAK","./TraktHistory":"NFyx"}],"7QCb":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

exports.__esModule = true;

var TraktRoller_1 = __importDefault(require("./TraktRoller"));

var TraktApi_1 = require("./TraktApi");

new TraktRoller_1["default"]({
  client_id: "5ac1bf2ba188fc93f941eb0788ef5cb6e0e4bf96b882e914e6d0c17dacc8e7f2",
  client_secret: "3712241a1c467769e6c03336abb5fb9911f8665354d2aaffaa9f817e147a34ca",
  storage: new TraktApi_1.GreaseMonkeyStorageAdapter()
});
},{"./TraktRoller":"n8p7","./TraktApi":"bK1h"}]},{},["7QCb"], null)
//# sourceMappingURL=/TraktRoller.user.map