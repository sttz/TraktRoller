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
// @version       1.2.0
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
})({"../node_modules/ste-core/dist/dispatching/DispatcherBase.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DispatcherBase = void 0;

const __1 = require("..");
/**
 * Base class for implementation of the dispatcher. It facilitates the subscribe
 * and unsubscribe methods based on generic handlers. The TEventType specifies
 * the type of event that should be exposed. Use the asEvent to expose the
 * dispatcher as event.
 */


class DispatcherBase {
  constructor() {
    this._wrap = new __1.DispatcherWrapper(this);
    this._subscriptions = new Array();
  }
  /**
   * Returns the number of subscriptions.
   *
   * @readonly
   *
   * @memberOf DispatcherBase
   */


  get count() {
    return this._subscriptions.length;
  }
  /**
   * Subscribe to the event dispatcher.
   * @param fn The event handler that is called when the event is dispatched.
   * @returns A function that unsubscribes the event handler from the event.
   */


  subscribe(fn) {
    if (fn) {
      this._subscriptions.push(this.createSubscription(fn, false));
    }

    return () => {
      this.unsubscribe(fn);
    };
  }
  /**
   * Subscribe to the event dispatcher.
   * @param fn The event handler that is called when the event is dispatched.
   * @returns A function that unsubscribes the event handler from the event.
   */


  sub(fn) {
    return this.subscribe(fn);
  }
  /**
   * Subscribe once to the event with the specified name.
   * @param fn The event handler that is called when the event is dispatched.
   * @returns A function that unsubscribes the event handler from the event.
   */


  one(fn) {
    if (fn) {
      this._subscriptions.push(this.createSubscription(fn, true));
    }

    return () => {
      this.unsubscribe(fn);
    };
  }
  /**
   * Checks it the event has a subscription for the specified handler.
   * @param fn The event handler.
   */


  has(fn) {
    if (!fn) return false;
    return this._subscriptions.some(sub => sub.handler == fn);
  }
  /**
   * Unsubscribes the handler from the dispatcher.
   * @param fn The event handler.
   */


  unsubscribe(fn) {
    if (!fn) return;

    for (let i = 0; i < this._subscriptions.length; i++) {
      if (this._subscriptions[i].handler == fn) {
        this._subscriptions.splice(i, 1);

        break;
      }
    }
  }
  /**
   * Unsubscribes the handler from the dispatcher.
   * @param fn The event handler.
   */


  unsub(fn) {
    this.unsubscribe(fn);
  }
  /**
   * Generic dispatch will dispatch the handlers with the given arguments.
   *
   * @protected
   * @param {boolean} executeAsync `True` if the even should be executed async.
   * @param {*} scrop The scope of the event. The scope becomes the `this` for handler.
   * @param {IArguments} args The arguments for the event.
   * @returns {(IPropagationStatus | null)} The propagation status, or if an `executeAsync` is used `null`.
   *
   * @memberOf DispatcherBase
   */


  _dispatch(executeAsync, scope, args) {
    //execute on a copy because of bug #9
    for (let sub of [...this._subscriptions]) {
      let ev = new __1.EventManagement(() => this.unsub(sub.handler));
      let nargs = Array.prototype.slice.call(args);
      nargs.push(ev);
      let s = sub;
      s.execute(executeAsync, scope, nargs); //cleanup subs that are no longer needed

      this.cleanup(sub);

      if (!executeAsync && ev.propagationStopped) {
        return {
          propagationStopped: true
        };
      }
    }

    if (executeAsync) {
      return null;
    }

    return {
      propagationStopped: false
    };
  }

  createSubscription(handler, isOnce) {
    return new __1.Subscription(handler, isOnce);
  }
  /**
   * Cleans up subs that ran and should run only once.
   */


  cleanup(sub) {
    if (sub.isOnce && sub.isExecuted) {
      let i = this._subscriptions.indexOf(sub);

      if (i > -1) {
        this._subscriptions.splice(i, 1);
      }
    }
  }
  /**
   * Creates an event from the dispatcher. Will return the dispatcher
   * in a wrapper. This will prevent exposure of any dispatcher methods.
   */


  asEvent() {
    return this._wrap;
  }
  /**
   * Clears all the subscriptions.
   */


  clear() {
    this._subscriptions.splice(0, this._subscriptions.length);
  }

}

exports.DispatcherBase = DispatcherBase;
},{"..":"../node_modules/ste-core/dist/index.js"}],"../node_modules/ste-core/dist/dispatching/DispatchError.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DispatchError = void 0;
/**
 * Indicates an error with dispatching.
 *
 * @export
 * @class DispatchError
 * @extends {Error}
 */

class DispatchError extends Error {
  constructor(message) {
    super(message);
  }

}

exports.DispatchError = DispatchError;
},{}],"../node_modules/ste-core/dist/dispatching/DispatcherWrapper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DispatcherWrapper = void 0;
/**
 * Hides the implementation of the event dispatcher. Will expose methods that
 * are relevent to the event.
 */

class DispatcherWrapper {
  /**
   * Creates a new EventDispatcherWrapper instance.
   * @param dispatcher The dispatcher.
   */
  constructor(dispatcher) {
    this._subscribe = fn => dispatcher.subscribe(fn);

    this._unsubscribe = fn => dispatcher.unsubscribe(fn);

    this._one = fn => dispatcher.one(fn);

    this._has = fn => dispatcher.has(fn);

    this._clear = () => dispatcher.clear();

    this._count = () => dispatcher.count;
  }
  /**
   * Returns the number of subscriptions.
   *
   * @readonly
   * @type {number}
   * @memberOf DispatcherWrapper
   */


  get count() {
    return this._count();
  }
  /**
   * Subscribe to the event dispatcher.
   * @param fn The event handler that is called when the event is dispatched.
   * @returns A function that unsubscribes the event handler from the event.
   */


  subscribe(fn) {
    return this._subscribe(fn);
  }
  /**
   * Subscribe to the event dispatcher.
   * @param fn The event handler that is called when the event is dispatched.
   * @returns A function that unsubscribes the event handler from the event.
   */


  sub(fn) {
    return this.subscribe(fn);
  }
  /**
   * Unsubscribe from the event dispatcher.
   * @param fn The event handler that is called when the event is dispatched.
   */


  unsubscribe(fn) {
    this._unsubscribe(fn);
  }
  /**
   * Unsubscribe from the event dispatcher.
   * @param fn The event handler that is called when the event is dispatched.
   */


  unsub(fn) {
    this.unsubscribe(fn);
  }
  /**
   * Subscribe once to the event with the specified name.
   * @param fn The event handler that is called when the event is dispatched.
   */


  one(fn) {
    return this._one(fn);
  }
  /**
   * Checks it the event has a subscription for the specified handler.
   * @param fn The event handler.
   */


  has(fn) {
    return this._has(fn);
  }
  /**
   * Clears all the subscriptions.
   */


  clear() {
    this._clear();
  }

}

exports.DispatcherWrapper = DispatcherWrapper;
},{}],"../node_modules/ste-core/dist/dispatching/EventListBase.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventListBase = void 0;
/**
 * Base class for event lists classes. Implements the get and remove.
 */

class EventListBase {
  constructor() {
    this._events = {};
  }
  /**
   * Gets the dispatcher associated with the name.
   * @param name The name of the event.
   */


  get(name) {
    let event = this._events[name];

    if (event) {
      return event;
    }

    event = this.createDispatcher();
    this._events[name] = event;
    return event;
  }
  /**
   * Removes the dispatcher associated with the name.
   * @param name The name of the event.
   */


  remove(name) {
    delete this._events[name];
  }

}

exports.EventListBase = EventListBase;
},{}],"../node_modules/ste-core/dist/management/EventManagement.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventManagement = void 0;
/**
 * Allows the user to interact with the event.
 *
 * @class EventManagement
 * @implements {IEventManagement}
 */

class EventManagement {
  constructor(unsub) {
    this.unsub = unsub;
    this.propagationStopped = false;
  }

  stopPropagation() {
    this.propagationStopped = true;
  }

}

exports.EventManagement = EventManagement;
},{}],"../node_modules/ste-core/dist/handling/HandlingBase.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HandlingBase = void 0;
/**
 * Base class that implements event handling. With a an
 * event list this base class will expose events that can be
 * subscribed to. This will give your class generic events.
 *
 * @export
 * @abstract
 * @class HandlingBase
 * @template TEventHandler
 * @template TDispatcher
 * @template TList
 */

class HandlingBase {
  constructor(events) {
    this.events = events;
  }
  /**
   * Subscribes once to the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  one(name, fn) {
    this.events.get(name).one(fn);
  }
  /**
   * Checks it the event has a subscription for the specified handler.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  has(name, fn) {
    return this.events.get(name).has(fn);
  }
  /**
   * Subscribes to the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  subscribe(name, fn) {
    this.events.get(name).subscribe(fn);
  }
  /**
   * Subscribes to the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  sub(name, fn) {
    this.subscribe(name, fn);
  }
  /**
   * Unsubscribes from the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  unsubscribe(name, fn) {
    this.events.get(name).unsubscribe(fn);
  }
  /**
   * Unsubscribes from the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */


  unsub(name, fn) {
    this.unsubscribe(name, fn);
  }

}

exports.HandlingBase = HandlingBase;
},{}],"../node_modules/ste-core/dist/dispatching/PromiseDispatcherBase.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PromiseDispatcherBase = void 0;

const __1 = require("..");

class PromiseDispatcherBase extends __1.DispatcherBase {
  constructor() {
    super();
  }

  _dispatch(executeAsync, scope, args) {
    throw new __1.DispatchError("_dispatch not supported. Use _dispatchAsPromise.");
  }

  createSubscription(handler, isOnce) {
    return new __1.PromiseSubscription(handler, isOnce);
  }
  /**
   * Generic dispatch will dispatch the handlers with the given arguments.
   *
   * @protected
   * @param {boolean} executeAsync `True` if the even should be executed async.
   * @param {*} scrop The scope of the event. The scope becomes the `this` for handler.
   * @param {IArguments} args The arguments for the event.
   * @returns {(IPropagationStatus | null)} The propagation status, or if an `executeAsync` is used `null`.
   *
   * @memberOf DispatcherBase
   */


  async _dispatchAsPromise(executeAsync, scope, args) {
    //execute on a copy because of bug #9
    for (let sub of [...this._subscriptions]) {
      let ev = new __1.EventManagement(() => this.unsub(sub.handler));
      let nargs = Array.prototype.slice.call(args);
      nargs.push(ev);
      let ps = sub;
      await ps.execute(executeAsync, scope, nargs); //cleanup subs that are no longer needed

      this.cleanup(sub);

      if (!executeAsync && ev.propagationStopped) {
        return {
          propagationStopped: true
        };
      }
    }

    if (executeAsync) {
      return null;
    }

    return {
      propagationStopped: false
    };
  }

}

exports.PromiseDispatcherBase = PromiseDispatcherBase;
},{"..":"../node_modules/ste-core/dist/index.js"}],"../node_modules/ste-core/dist/events/PromiseSubscription.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PromiseSubscription = void 0;

class PromiseSubscription {
  /**
   * Creates an instance of Subscription.
   *
   * @param {TEventHandler} handler The handler for the subscription.
   * @param {boolean} isOnce Indicates if the handler should only be executed once.
   */
  constructor(handler, isOnce) {
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


  async execute(executeAsync, scope, args) {
    if (!this.isOnce || !this.isExecuted) {
      this.isExecuted = true; //TODO: do we need to cast to any -- seems yuck

      var fn = this.handler;

      if (executeAsync) {
        setTimeout(() => {
          fn.apply(scope, args);
        }, 1);
        return;
      }

      let result = fn.apply(scope, args);
      await result;
    }
  }

}

exports.PromiseSubscription = PromiseSubscription;
},{}],"../node_modules/ste-core/dist/events/Subscription.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subscription = void 0;
/**
 * Stores a handler. Manages execution meta data.
 * @class Subscription
 * @template TEventHandler
 */

class Subscription {
  /**
   * Creates an instance of Subscription.
   *
   * @param {TEventHandler} handler The handler for the subscription.
   * @param {boolean} isOnce Indicates if the handler should only be executed once.
   */
  constructor(handler, isOnce) {
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


  execute(executeAsync, scope, args) {
    if (!this.isOnce || !this.isExecuted) {
      this.isExecuted = true;
      var fn = this.handler;

      if (executeAsync) {
        setTimeout(() => {
          fn.apply(scope, args);
        }, 1);
      } else {
        fn.apply(scope, args);
      }
    }
  }

}

exports.Subscription = Subscription;
},{}],"../node_modules/ste-core/dist/index.js":[function(require,module,exports) {
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
exports.HandlingBase = exports.PromiseDispatcherBase = exports.PromiseSubscription = exports.DispatchError = exports.EventManagement = exports.EventListBase = exports.DispatcherWrapper = exports.DispatcherBase = exports.Subscription = void 0;

const DispatcherBase_1 = require("./dispatching/DispatcherBase");

Object.defineProperty(exports, "DispatcherBase", {
  enumerable: true,
  get: function () {
    return DispatcherBase_1.DispatcherBase;
  }
});

const DispatchError_1 = require("./dispatching/DispatchError");

Object.defineProperty(exports, "DispatchError", {
  enumerable: true,
  get: function () {
    return DispatchError_1.DispatchError;
  }
});

const DispatcherWrapper_1 = require("./dispatching/DispatcherWrapper");

Object.defineProperty(exports, "DispatcherWrapper", {
  enumerable: true,
  get: function () {
    return DispatcherWrapper_1.DispatcherWrapper;
  }
});

const EventListBase_1 = require("./dispatching/EventListBase");

Object.defineProperty(exports, "EventListBase", {
  enumerable: true,
  get: function () {
    return EventListBase_1.EventListBase;
  }
});

const EventManagement_1 = require("./management/EventManagement");

Object.defineProperty(exports, "EventManagement", {
  enumerable: true,
  get: function () {
    return EventManagement_1.EventManagement;
  }
});

const HandlingBase_1 = require("./handling/HandlingBase");

Object.defineProperty(exports, "HandlingBase", {
  enumerable: true,
  get: function () {
    return HandlingBase_1.HandlingBase;
  }
});

const PromiseDispatcherBase_1 = require("./dispatching/PromiseDispatcherBase");

Object.defineProperty(exports, "PromiseDispatcherBase", {
  enumerable: true,
  get: function () {
    return PromiseDispatcherBase_1.PromiseDispatcherBase;
  }
});

const PromiseSubscription_1 = require("./events/PromiseSubscription");

Object.defineProperty(exports, "PromiseSubscription", {
  enumerable: true,
  get: function () {
    return PromiseSubscription_1.PromiseSubscription;
  }
});

const Subscription_1 = require("./events/Subscription");

Object.defineProperty(exports, "Subscription", {
  enumerable: true,
  get: function () {
    return Subscription_1.Subscription;
  }
});
},{"./dispatching/DispatcherBase":"../node_modules/ste-core/dist/dispatching/DispatcherBase.js","./dispatching/DispatchError":"../node_modules/ste-core/dist/dispatching/DispatchError.js","./dispatching/DispatcherWrapper":"../node_modules/ste-core/dist/dispatching/DispatcherWrapper.js","./dispatching/EventListBase":"../node_modules/ste-core/dist/dispatching/EventListBase.js","./management/EventManagement":"../node_modules/ste-core/dist/management/EventManagement.js","./handling/HandlingBase":"../node_modules/ste-core/dist/handling/HandlingBase.js","./dispatching/PromiseDispatcherBase":"../node_modules/ste-core/dist/dispatching/PromiseDispatcherBase.js","./events/PromiseSubscription":"../node_modules/ste-core/dist/events/PromiseSubscription.js","./events/Subscription":"../node_modules/ste-core/dist/events/Subscription.js"}],"../node_modules/ste-simple-events/dist/SimpleEventDispatcher.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleEventDispatcher = void 0;

const ste_core_1 = require("ste-core");
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a simple event
 *
 * @export
 * @class SimpleEventDispatcher
 * @extends {DispatcherBase<ISimpleEventHandler<TArgs>>}
 * @implements {ISimpleEvent<TArgs>}
 * @template TArgs
 */


class SimpleEventDispatcher extends ste_core_1.DispatcherBase {
  /**
   * Creates an instance of SimpleEventDispatcher.
   *
   * @memberOf SimpleEventDispatcher
   */
  constructor() {
    super();
  }
  /**
   * Dispatches the event.
   *
   * @param {TArgs} args The arguments object.
   * @returns {IPropagationStatus} The status of the event.
   *
   * @memberOf SimpleEventDispatcher
   */


  dispatch(args) {
    const result = this._dispatch(false, this, arguments);

    if (result == null) {
      throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
    }

    return result;
  }
  /**
   * Dispatches the event without waiting for the result.
   *
   * @param {TArgs} args The arguments object.
   *
   * @memberOf SimpleEventDispatcher
   */


  dispatchAsync(args) {
    this._dispatch(true, this, arguments);
  }
  /**
   * Creates an event from the dispatcher. Will return the dispatcher
   * in a wrapper. This will prevent exposure of any dispatcher methods.
   *
   * @returns {ISimpleEvent<TArgs>} The event.
   *
   * @memberOf SimpleEventDispatcher
   */


  asEvent() {
    return super.asEvent();
  }

}

exports.SimpleEventDispatcher = SimpleEventDispatcher;
},{"ste-core":"../node_modules/ste-core/dist/index.js"}],"../node_modules/ste-simple-events/dist/SimpleEventList.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleEventList = void 0;

const ste_core_1 = require("ste-core");

const SimpleEventDispatcher_1 = require("./SimpleEventDispatcher");
/**
 * Storage class for multiple simple events that are accessible by name.
 * Events dispatchers are automatically created.
 */


class SimpleEventList extends ste_core_1.EventListBase {
  /**
   * Creates a new SimpleEventList instance.
   */
  constructor() {
    super();
  }
  /**
   * Creates a new dispatcher instance.
   */


  createDispatcher() {
    return new SimpleEventDispatcher_1.SimpleEventDispatcher();
  }

}

exports.SimpleEventList = SimpleEventList;
},{"ste-core":"../node_modules/ste-core/dist/index.js","./SimpleEventDispatcher":"../node_modules/ste-simple-events/dist/SimpleEventDispatcher.js"}],"../node_modules/ste-simple-events/dist/SimpleEventHandlingBase.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleEventHandlingBase = void 0;

const ste_core_1 = require("ste-core");

const SimpleEventList_1 = require("./SimpleEventList");
/**
 * Extends objects with signal event handling capabilities.
 */


class SimpleEventHandlingBase extends ste_core_1.HandlingBase {
  constructor() {
    super(new SimpleEventList_1.SimpleEventList());
  }

}

exports.SimpleEventHandlingBase = SimpleEventHandlingBase;
},{"ste-core":"../node_modules/ste-core/dist/index.js","./SimpleEventList":"../node_modules/ste-simple-events/dist/SimpleEventList.js"}],"../node_modules/ste-simple-events/dist/NonUniformSimpleEventList.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NonUniformSimpleEventList = void 0;

const SimpleEventDispatcher_1 = require("./SimpleEventDispatcher");
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */


class NonUniformSimpleEventList {
  constructor() {
    this._events = {};
  }
  /**
   * Gets the dispatcher associated with the name.
   * @param name The name of the event.
   */


  get(name) {
    if (this._events[name]) {
      // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
      return this._events[name];
    }

    const event = this.createDispatcher();
    this._events[name] = event;
    return event;
  }
  /**
   * Removes the dispatcher associated with the name.
   * @param name The name of the event.
   */


  remove(name) {
    delete this._events[name];
  }
  /**
   * Creates a new dispatcher instance.
   */


  createDispatcher() {
    return new SimpleEventDispatcher_1.SimpleEventDispatcher();
  }

}

exports.NonUniformSimpleEventList = NonUniformSimpleEventList;
},{"./SimpleEventDispatcher":"../node_modules/ste-simple-events/dist/SimpleEventDispatcher.js"}],"../node_modules/ste-simple-events/dist/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NonUniformSimpleEventList = exports.SimpleEventList = exports.SimpleEventHandlingBase = exports.SimpleEventDispatcher = void 0;

const SimpleEventDispatcher_1 = require("./SimpleEventDispatcher");

Object.defineProperty(exports, "SimpleEventDispatcher", {
  enumerable: true,
  get: function () {
    return SimpleEventDispatcher_1.SimpleEventDispatcher;
  }
});

const SimpleEventHandlingBase_1 = require("./SimpleEventHandlingBase");

Object.defineProperty(exports, "SimpleEventHandlingBase", {
  enumerable: true,
  get: function () {
    return SimpleEventHandlingBase_1.SimpleEventHandlingBase;
  }
});

const NonUniformSimpleEventList_1 = require("./NonUniformSimpleEventList");

Object.defineProperty(exports, "NonUniformSimpleEventList", {
  enumerable: true,
  get: function () {
    return NonUniformSimpleEventList_1.NonUniformSimpleEventList;
  }
});

const SimpleEventList_1 = require("./SimpleEventList");

Object.defineProperty(exports, "SimpleEventList", {
  enumerable: true,
  get: function () {
    return SimpleEventList_1.SimpleEventList;
  }
});
},{"./SimpleEventDispatcher":"../node_modules/ste-simple-events/dist/SimpleEventDispatcher.js","./SimpleEventHandlingBase":"../node_modules/ste-simple-events/dist/SimpleEventHandlingBase.js","./NonUniformSimpleEventList":"../node_modules/ste-simple-events/dist/NonUniformSimpleEventList.js","./SimpleEventList":"../node_modules/ste-simple-events/dist/SimpleEventList.js"}],"TraktApi.ts":[function(require,module,exports) {
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
exports.GreaseMonkeyStorageAdapter = exports.LocalStorageAdapter = exports.TraktApiError = void 0;

const ste_simple_events_1 = require("ste-simple-events");

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
    this.onAuthenticationChanged = new ste_simple_events_1.SimpleEventDispatcher();
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
},{"ste-simple-events":"../node_modules/ste-simple-events/dist/index.js"}],"TraktScrobble.ts":[function(require,module,exports) {
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
exports.TraktScrobbleState = exports.PlaybackState = void 0;

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
exports.render = O;
exports.hydrate = S;
exports.h = exports.createElement = v;
exports.Fragment = p;
exports.createRef = y;
exports.Component = d;
exports.cloneElement = q;
exports.createContext = B;
exports.toChildArray = b;
exports.__u = L;
exports.options = exports.isValidElement = void 0;
var n,
    l,
    u,
    i,
    t,
    o,
    r,
    f = {},
    e = [],
    c = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
exports.isValidElement = l;
exports.options = n;

function s(n, l) {
  for (var u in l) n[u] = l[u];

  return n;
}

function a(n) {
  var l = n.parentNode;
  l && l.removeChild(n);
}

function v(n, l, u) {
  var i,
      t,
      o,
      r = arguments,
      f = {};

  for (o in l) "key" == o ? i = l[o] : "ref" == o ? t = l[o] : f[o] = l[o];

  if (arguments.length > 3) for (u = [u], o = 3; o < arguments.length; o++) u.push(r[o]);
  if (null != u && (f.children = u), "function" == typeof n && null != n.defaultProps) for (o in n.defaultProps) void 0 === f[o] && (f[o] = n.defaultProps[o]);
  return h(n, f, i, t, null);
}

function h(l, u, i, t, o) {
  var r = {
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
    __h: null,
    constructor: void 0,
    __v: null == o ? ++n.__v : o
  };
  return null != n.vnode && n.vnode(r), r;
}

function y() {
  return {
    current: null
  };
}

function p(n) {
  return n.children;
}

function d(n, l) {
  this.props = n, this.context = l;
}

function _(n, l) {
  if (null == l) return n.__ ? _(n.__, n.__.__k.indexOf(n) + 1) : null;

  for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;

  return "function" == typeof n.type ? _(n) : null;
}

function w(n) {
  var l, u;

  if (null != (n = n.__) && null != n.__c) {
    for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) {
      n.__e = n.__c.base = u.__e;
      break;
    }

    return w(n);
  }
}

function k(l) {
  (!l.__d && (l.__d = !0) && u.push(l) && !g.__r++ || t !== n.debounceRendering) && ((t = n.debounceRendering) || i)(g);
}

function g() {
  for (var n; g.__r = u.length;) n = u.sort(function (n, l) {
    return n.__v.__b - l.__v.__b;
  }), u = [], n.some(function (n) {
    var l, u, i, t, o, r, f;
    n.__d && (r = (o = (l = n).__v).__e, (f = l.__P) && (u = [], (i = s({}, o)).__v = o.__v + 1, t = $(f, o, i, l.__n, void 0 !== f.ownerSVGElement, null != o.__h ? [r] : null, u, null == r ? _(o) : r, o.__h), j(u, o), t != r && w(o)));
  });
}

function m(n, l, u, i, t, o, r, c, s, v) {
  var y,
      d,
      w,
      k,
      g,
      m,
      b,
      A = i && i.__k || e,
      P = A.length;

  for (s == f && (s = null != r ? r[0] : P ? _(i, 0) : null), u.__k = [], y = 0; y < l.length; y++) if (null != (k = u.__k[y] = null == (k = l[y]) || "boolean" == typeof k ? null : "string" == typeof k || "number" == typeof k ? h(null, k, null, null, k) : Array.isArray(k) ? h(p, {
    children: k
  }, null, null, null) : null != k.__e || null != k.__c ? h(k.type, k.props, k.key, null, k.__v) : k)) {
    if (k.__ = u, k.__b = u.__b + 1, null === (w = A[y]) || w && k.key == w.key && k.type === w.type) A[y] = void 0;else for (d = 0; d < P; d++) {
      if ((w = A[d]) && k.key == w.key && k.type === w.type) {
        A[d] = void 0;
        break;
      }

      w = null;
    }
    g = $(n, k, w = w || f, t, o, r, c, s, v), (d = k.ref) && w.ref != d && (b || (b = []), w.ref && b.push(w.ref, null, k), b.push(d, k.__c || g, k)), null != g ? (null == m && (m = g), s = x(n, k, w, A, r, g, s), v || "option" != u.type ? "function" == typeof u.type && (u.__d = s) : n.value = "") : s && w.__e == s && s.parentNode != n && (s = _(w));
  }

  if (u.__e = m, null != r && "function" != typeof u.type) for (y = r.length; y--;) null != r[y] && a(r[y]);

  for (y = P; y--;) null != A[y] && L(A[y], A[y]);

  if (b) for (y = 0; y < b.length; y++) I(b[y], b[++y], b[++y]);
}

function b(n, l) {
  return l = l || [], null == n || "boolean" == typeof n || (Array.isArray(n) ? n.some(function (n) {
    b(n, l);
  }) : l.push(n)), l;
}

function x(n, l, u, i, t, o, r) {
  var f, e, c;
  if (void 0 !== l.__d) f = l.__d, l.__d = void 0;else if (t == u || o != r || null == o.parentNode) n: if (null == r || r.parentNode !== n) n.appendChild(o), f = null;else {
    for (e = r, c = 0; (e = e.nextSibling) && c < i.length; c += 2) if (e == o) break n;

    n.insertBefore(o, r), f = r;
  }
  return void 0 !== f ? f : o.nextSibling;
}

function A(n, l, u, i, t) {
  var o;

  for (o in u) "children" === o || "key" === o || o in l || C(n, o, null, u[o], i);

  for (o in l) t && "function" != typeof l[o] || "children" === o || "key" === o || "value" === o || "checked" === o || u[o] === l[o] || C(n, o, l[o], u[o], i);
}

function P(n, l, u) {
  "-" === l[0] ? n.setProperty(l, u) : n[l] = null == u ? "" : "number" != typeof u || c.test(l) ? u : u + "px";
}

function C(n, l, u, i, t) {
  var o, r, f;
  if (t && "className" == l && (l = "class"), "style" === l) {
    if ("string" == typeof u) n.style.cssText = u;else {
      if ("string" == typeof i && (n.style.cssText = i = ""), i) for (l in i) u && l in u || P(n.style, l, "");
      if (u) for (l in u) i && u[l] === i[l] || P(n.style, l, u[l]);
    }
  } else "o" === l[0] && "n" === l[1] ? (o = l !== (l = l.replace(/Capture$/, "")), (r = l.toLowerCase()) in n && (l = r), l = l.slice(2), n.l || (n.l = {}), n.l[l + o] = u, f = o ? N : z, u ? i || n.addEventListener(l, f, o) : n.removeEventListener(l, f, o)) : "list" !== l && "tagName" !== l && "form" !== l && "type" !== l && "size" !== l && "download" !== l && "href" !== l && !t && l in n ? n[l] = null == u ? "" : u : "function" != typeof u && "dangerouslySetInnerHTML" !== l && (l !== (l = l.replace(/xlink:?/, "")) ? null == u || !1 === u ? n.removeAttributeNS("http://www.w3.org/1999/xlink", l.toLowerCase()) : n.setAttributeNS("http://www.w3.org/1999/xlink", l.toLowerCase(), u) : null == u || !1 === u && !/^ar/.test(l) ? n.removeAttribute(l) : n.setAttribute(l, u));
}

function z(l) {
  this.l[l.type + !1](n.event ? n.event(l) : l);
}

function N(l) {
  this.l[l.type + !0](n.event ? n.event(l) : l);
}

function T(n, l, u) {
  var i, t;

  for (i = 0; i < n.__k.length; i++) (t = n.__k[i]) && (t.__ = n, t.__e && ("function" == typeof t.type && t.__k.length > 1 && T(t, l, u), l = x(u, t, t, n.__k, null, t.__e, l), "function" == typeof n.type && (n.__d = l)));
}

function $(l, u, i, t, o, r, f, e, c) {
  var a,
      v,
      h,
      y,
      _,
      w,
      k,
      g,
      b,
      x,
      A,
      P = u.type;

  if (void 0 !== u.constructor) return null;
  null != i.__h && (c = i.__h, e = u.__e = i.__e, u.__h = null, r = [e]), (a = n.__b) && a(u);

  try {
    n: if ("function" == typeof P) {
      if (g = u.props, b = (a = P.contextType) && t[a.__c], x = a ? b ? b.props.value : a.__ : t, i.__c ? k = (v = u.__c = i.__c).__ = v.__E : ("prototype" in P && P.prototype.render ? u.__c = v = new P(g, x) : (u.__c = v = new d(g, x), v.constructor = P, v.render = M), b && b.sub(v), v.props = g, v.state || (v.state = {}), v.context = x, v.__n = t, h = v.__d = !0, v.__h = []), null == v.__s && (v.__s = v.state), null != P.getDerivedStateFromProps && (v.__s == v.state && (v.__s = s({}, v.__s)), s(v.__s, P.getDerivedStateFromProps(g, v.__s))), y = v.props, _ = v.state, h) null == P.getDerivedStateFromProps && null != v.componentWillMount && v.componentWillMount(), null != v.componentDidMount && v.__h.push(v.componentDidMount);else {
        if (null == P.getDerivedStateFromProps && g !== y && null != v.componentWillReceiveProps && v.componentWillReceiveProps(g, x), !v.__e && null != v.shouldComponentUpdate && !1 === v.shouldComponentUpdate(g, v.__s, x) || u.__v === i.__v) {
          v.props = g, v.state = v.__s, u.__v !== i.__v && (v.__d = !1), v.__v = u, u.__e = i.__e, u.__k = i.__k, v.__h.length && f.push(v), T(u, e, l);
          break n;
        }

        null != v.componentWillUpdate && v.componentWillUpdate(g, v.__s, x), null != v.componentDidUpdate && v.__h.push(function () {
          v.componentDidUpdate(y, _, w);
        });
      }
      v.context = x, v.props = g, v.state = v.__s, (a = n.__r) && a(u), v.__d = !1, v.__v = u, v.__P = l, a = v.render(v.props, v.state, v.context), v.state = v.__s, null != v.getChildContext && (t = s(s({}, t), v.getChildContext())), h || null == v.getSnapshotBeforeUpdate || (w = v.getSnapshotBeforeUpdate(y, _)), A = null != a && a.type == p && null == a.key ? a.props.children : a, m(l, Array.isArray(A) ? A : [A], u, i, t, o, r, f, e, c), v.base = u.__e, u.__h = null, v.__h.length && f.push(v), k && (v.__E = v.__ = null), v.__e = !1;
    } else null == r && u.__v === i.__v ? (u.__k = i.__k, u.__e = i.__e) : u.__e = H(i.__e, u, i, t, o, r, f, c);

    (a = n.diffed) && a(u);
  } catch (l) {
    u.__v = null, (c || null != r) && (u.__e = e, u.__h = !!c, r[r.indexOf(e)] = null), n.__e(l, u, i);
  }

  return u.__e;
}

function j(l, u) {
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

function H(n, l, u, i, t, o, r, c) {
  var s,
      a,
      v,
      h,
      y,
      p = u.props,
      d = l.props;
  if (t = "svg" === l.type || t, null != o) for (s = 0; s < o.length; s++) if (null != (a = o[s]) && ((null === l.type ? 3 === a.nodeType : a.localName === l.type) || n == a)) {
    n = a, o[s] = null;
    break;
  }

  if (null == n) {
    if (null === l.type) return document.createTextNode(d);
    n = t ? document.createElementNS("http://www.w3.org/2000/svg", l.type) : document.createElement(l.type, d.is && {
      is: d.is
    }), o = null, c = !1;
  }

  if (null === l.type) p === d || c && n.data === d || (n.data = d);else {
    if (null != o && (o = e.slice.call(n.childNodes)), v = (p = u.props || f).dangerouslySetInnerHTML, h = d.dangerouslySetInnerHTML, !c) {
      if (null != o) for (p = {}, y = 0; y < n.attributes.length; y++) p[n.attributes[y].name] = n.attributes[y].value;
      (h || v) && (h && (v && h.__html == v.__html || h.__html === n.innerHTML) || (n.innerHTML = h && h.__html || ""));
    }

    A(n, d, p, t, c), h ? l.__k = [] : (s = l.props.children, m(n, Array.isArray(s) ? s : [s], l, u, i, "foreignObject" !== l.type && t, o, r, f, c)), c || ("value" in d && void 0 !== (s = d.value) && (s !== n.value || "progress" === l.type && !s) && C(n, "value", s, p.value, !1), "checked" in d && void 0 !== (s = d.checked) && s !== n.checked && C(n, "checked", s, p.checked, !1));
  }
  return n;
}

function I(l, u, i) {
  try {
    "function" == typeof l ? l(u) : l.current = u;
  } catch (l) {
    n.__e(l, i);
  }
}

function L(l, u, i) {
  var t, o, r;

  if (n.unmount && n.unmount(l), (t = l.ref) && (t.current && t.current !== l.__e || I(t, null, u)), i || "function" == typeof l.type || (i = null != (o = l.__e)), l.__e = l.__d = void 0, null != (t = l.__c)) {
    if (t.componentWillUnmount) try {
      t.componentWillUnmount();
    } catch (l) {
      n.__e(l, u);
    }
    t.base = t.__P = null;
  }

  if (t = l.__k) for (r = 0; r < t.length; r++) t[r] && L(t[r], u, i);
  null != o && a(o);
}

function M(n, l, u) {
  return this.constructor(n, u);
}

function O(l, u, i) {
  var t, r, c;
  n.__ && n.__(l, u), r = (t = i === o) ? null : i && i.__k || u.__k, l = v(p, null, [l]), c = [], $(u, (t ? u : i || u).__k = l, r || f, f, void 0 !== u.ownerSVGElement, i && !t ? [i] : r ? null : u.childNodes.length ? e.slice.call(u.childNodes) : null, c, i || f, t), j(c, l);
}

function S(n, l) {
  O(n, l, o);
}

function q(n, l, u) {
  var i,
      t,
      o,
      r = arguments,
      f = s({}, n.props);

  for (o in l) "key" == o ? i = l[o] : "ref" == o ? t = l[o] : f[o] = l[o];

  if (arguments.length > 3) for (u = [u], o = 3; o < arguments.length; o++) u.push(r[o]);
  return null != u && (f.children = u), h(n.type, f, i || n.key, t || n.ref, null);
}

function B(n, l) {
  var u = {
    __c: l = "__cC" + r++,
    __: n,
    Consumer: function (n, l) {
      return n.children(l);
    },
    Provider: function (n, u, i) {
      return this.getChildContext || (u = [], (i = {})[l] = this, this.getChildContext = function () {
        return i;
      }, this.shouldComponentUpdate = function (n) {
        this.props.value !== n.value && u.some(k);
      }, this.sub = function (n) {
        u.push(n);
        var l = n.componentWillUnmount;

        n.componentWillUnmount = function () {
          u.splice(u.indexOf(n), 1), l && l.call(n);
        };
      }), n.children;
    }
  };
  return u.Provider.__ = u.Consumer.contextType = u;
}

exports.options = n = {
  __e: function (n, l) {
    for (var u, i, t, o = l.__h; l = l.__;) if ((u = l.__c) && !u.__) try {
      if ((i = u.constructor) && null != i.getDerivedStateFromError && (u.setState(i.getDerivedStateFromError(n)), t = u.__d), null != u.componentDidCatch && (u.componentDidCatch(n), t = u.__d), t) return l.__h = o, u.__E = u;
    } catch (l) {
      n = l;
    }

    throw n;
  },
  __v: 0
}, exports.isValidElement = l = function (n) {
  return null != n && void 0 === n.constructor;
}, d.prototype.setState = function (n, l) {
  var u;
  u = null != this.__s && this.__s !== this.state ? this.__s : this.__s = s({}, this.state), "function" == typeof n && (n = n(s({}, u), this.props)), n && s(u, n), null != n && this.__v && (l && this.__h.push(l), k(this));
}, d.prototype.forceUpdate = function (n) {
  this.__v && (this.__e = !0, n && this.__h.push(n), k(this));
}, d.prototype.render = p, u = [], i = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, g.__r = 0, o = f, r = 0;
},{}],"../node_modules/preact/hooks/dist/hooks.module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useState = l;
exports.useReducer = p;
exports.useEffect = y;
exports.useLayoutEffect = h;
exports.useRef = s;
exports.useImperativeHandle = _;
exports.useMemo = d;
exports.useCallback = A;
exports.useContext = F;
exports.useDebugValue = T;
exports.useErrorBoundary = q;

var _preact = require("preact");

var t,
    u,
    r,
    o = 0,
    i = [],
    c = _preact.options.__b,
    f = _preact.options.__r,
    e = _preact.options.diffed,
    a = _preact.options.__c,
    v = _preact.options.unmount;

function m(t, r) {
  _preact.options.__h && _preact.options.__h(u, t, o || r), o = 0;
  var i = u.__H || (u.__H = {
    __: [],
    __h: []
  });
  return t >= i.__.length && i.__.push({}), i.__[t];
}

function l(n) {
  return o = 1, p(w, n);
}

function p(n, r, o) {
  var i = m(t++, 2);
  return i.t = n, i.__c || (i.__ = [o ? o(r) : w(void 0, r), function (n) {
    var t = i.t(i.__[0], n);
    i.__[0] !== t && (i.__ = [t, i.__[1]], i.__c.setState({}));
  }], i.__c = u), i.__;
}

function y(r, o) {
  var i = m(t++, 3);
  !_preact.options.__s && k(i.__H, o) && (i.__ = r, i.__H = o, u.__H.__h.push(i));
}

function h(r, o) {
  var i = m(t++, 4);
  !_preact.options.__s && k(i.__H, o) && (i.__ = r, i.__H = o, u.__h.push(i));
}

function s(n) {
  return o = 5, d(function () {
    return {
      current: n
    };
  }, []);
}

function _(n, t, u) {
  o = 6, h(function () {
    "function" == typeof n ? n(t()) : n && (n.current = t());
  }, null == u ? u : u.concat(n));
}

function d(n, u) {
  var r = m(t++, 7);
  return k(r.__H, u) && (r.__ = n(), r.__H = u, r.__h = n), r.__;
}

function A(n, t) {
  return o = 8, d(function () {
    return n;
  }, t);
}

function F(n) {
  var r = u.context[n.__c],
      o = m(t++, 9);
  return o.__c = n, r ? (null == o.__ && (o.__ = !0, r.sub(u)), r.props.value) : n.__;
}

function T(t, u) {
  _preact.options.useDebugValue && _preact.options.useDebugValue(u ? u(t) : t);
}

function q(n) {
  var r = m(t++, 10),
      o = l();
  return r.__ = n, u.componentDidCatch || (u.componentDidCatch = function (n) {
    r.__ && r.__(n), o[1](n);
  }), [o[0], function () {
    o[1](void 0);
  }];
}

function x() {
  i.forEach(function (t) {
    if (t.__P) try {
      t.__H.__h.forEach(g), t.__H.__h.forEach(j), t.__H.__h = [];
    } catch (u) {
      t.__H.__h = [], _preact.options.__e(u, t.__v);
    }
  }), i = [];
}

_preact.options.__b = function (n) {
  u = null, c && c(n);
}, _preact.options.__r = function (n) {
  f && f(n), t = 0;
  var r = (u = n.__c).__H;
  r && (r.__h.forEach(g), r.__h.forEach(j), r.__h = []);
}, _preact.options.diffed = function (t) {
  e && e(t);
  var o = t.__c;
  o && o.__H && o.__H.__h.length && (1 !== i.push(o) && r === _preact.options.requestAnimationFrame || ((r = _preact.options.requestAnimationFrame) || function (n) {
    var t,
        u = function () {
      clearTimeout(r), b && cancelAnimationFrame(t), setTimeout(n);
    },
        r = setTimeout(u, 100);

    b && (t = requestAnimationFrame(u));
  })(x)), u = void 0;
}, _preact.options.__c = function (t, u) {
  u.some(function (t) {
    try {
      t.__h.forEach(g), t.__h = t.__h.filter(function (n) {
        return !n.__ || j(n);
      });
    } catch (r) {
      u.some(function (n) {
        n.__h && (n.__h = []);
      }), u = [], _preact.options.__e(r, t.__v);
    }
  }), a && a(t, u);
}, _preact.options.unmount = function (t) {
  v && v(t);
  var u = t.__c;
  if (u && u.__H) try {
    u.__H.__.forEach(g);
  } catch (t) {
    _preact.options.__e(t, u.__v);
  }
};
var b = "function" == typeof requestAnimationFrame;

function g(n) {
  var t = u;
  "function" == typeof n.__c && n.__c(), u = t;
}

function j(n) {
  var t = u;
  n.__c = n.__(), u = t;
}

function k(n, t) {
  return !n || n.length !== t.length || t.some(function (t, u) {
    return t !== n[u];
  });
}

function w(n, t) {
  return "function" == typeof t ? t(n) : t;
}
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
  StrictMode: true,
  Suspense: true,
  SuspenseList: true,
  lazy: true,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: true,
  createElement: true,
  createContext: true,
  createRef: true,
  Fragment: true,
  Component: true
};
exports.render = H;
exports.hydrate = Z;
exports.unmountComponentAtNode = on;
exports.createPortal = P;
exports.createFactory = en;
exports.cloneElement = un;
exports.isValidElement = rn;
exports.findDOMNode = cn;
exports.PureComponent = w;
exports.memo = C;
exports.forwardRef = k;
exports.Suspense = F;
exports.SuspenseList = I;
exports.lazy = D;
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
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = exports.StrictMode = exports.unstable_batchedUpdates = exports.Children = exports.version = exports.default = void 0;

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

function S(n, t) {
  for (var e in t) n[e] = t[e];

  return n;
}

function g(n, t) {
  for (var e in n) if ("__source" !== e && !(e in t)) return !0;

  for (var r in t) if ("__source" !== r && n[r] !== t[r]) return !0;

  return !1;
}

function w(n) {
  this.props = n;
}

function C(n, t) {
  function e(n) {
    var e = this.props.ref,
        r = e == n.ref;
    return !r && e && (e.call ? e(null) : e.current = null), t ? !t(this.props, n) || !r : g(this.props, n);
  }

  function r(t) {
    return this.shouldComponentUpdate = e, (0, _preact.createElement)(n, t);
  }

  return r.displayName = "Memo(" + (n.displayName || n.name) + ")", r.prototype.isReactComponent = !0, r.__f = !0, r;
}

(w.prototype = new _preact.Component()).isPureReactComponent = !0, w.prototype.shouldComponentUpdate = function (n, t) {
  return g(this.props, n) || g(this.state, t);
};
var R = _preact.options.__b;

_preact.options.__b = function (n) {
  n.type && n.type.__f && n.ref && (n.props.ref = n.ref, n.ref = null), R && R(n);
};

var x = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;

function k(n) {
  function t(t, e) {
    var r = S({}, t);
    return delete r.ref, n(r, (e = t.ref || e) && ("object" != typeof e || "current" in e) ? e : null);
  }

  return t.$$typeof = x, t.render = t, t.prototype.isReactComponent = t.__f = !0, t.displayName = "ForwardRef(" + (n.displayName || n.name) + ")", t;
}

var A = function (n, t) {
  return null == n ? null : (0, _preact.toChildArray)((0, _preact.toChildArray)(n).map(t));
},
    N = {
  map: A,
  forEach: A,
  count: function (n) {
    return n ? (0, _preact.toChildArray)(n).length : 0;
  },
  only: function (n) {
    var t = (0, _preact.toChildArray)(n);
    if (1 !== t.length) throw "Children.only";
    return t[0];
  },
  toArray: _preact.toChildArray
},
    O = _preact.options.__e;

exports.Children = N;

function L(n) {
  return n && (n.__c && n.__c.__H && (n.__c.__H.__.forEach(function (n) {
    "function" == typeof n.__c && n.__c();
  }), n.__c.__H = null), (n = S({}, n)).__c = null, n.__k = n.__k && n.__k.map(L)), n;
}

function U(n) {
  return n && (n.__v = null, n.__k = n.__k && n.__k.map(U)), n;
}

function F() {
  this.__u = 0, this.t = null, this.__b = null;
}

function M(n) {
  var t = n.__.__c;
  return t && t.__e && t.__e(n);
}

function D(n) {
  var t, e, r;

  function u(u) {
    if (t || (t = n()).then(function (n) {
      e = n.default || n;
    }, function (n) {
      r = n;
    }), r) throw r;
    if (!e) throw t;
    return (0, _preact.createElement)(e, u);
  }

  return u.displayName = "Lazy", u.__f = !0, u;
}

function I() {
  this.u = null, this.o = null;
}

_preact.options.__e = function (n, t, e) {
  if (n.then) for (var r, u = t; u = u.__;) if ((r = u.__c) && r.__c) return null == t.__e && (t.__e = e.__e, t.__k = e.__k), r.__c(n, t);
  O(n, t, e);
}, (F.prototype = new _preact.Component()).__c = function (n, t) {
  var e = t.__c,
      r = this;
  null == r.t && (r.t = []), r.t.push(e);

  var u = M(r.__v),
      o = !1,
      i = function () {
    o || (o = !0, e.componentWillUnmount = e.__c, u ? u(c) : c());
  };

  e.__c = e.componentWillUnmount, e.componentWillUnmount = function () {
    i(), e.__c && e.__c();
  };

  var c = function () {
    var n;
    if (! --r.__u) for (r.__v.__k[0] = U(r.state.__e), r.setState({
      __e: r.__b = null
    }); n = r.t.pop();) n.forceUpdate();
  };

  !0 === t.__h || r.__u++ || r.setState({
    __e: r.__b = r.__v.__k[0]
  }), n.then(i, i);
}, F.prototype.componentWillUnmount = function () {
  this.t = [];
}, F.prototype.render = function (n, t) {
  this.__b && (this.__v.__k && (this.__v.__k[0] = L(this.__b)), this.__b = null);
  var e = t.__e && (0, _preact.createElement)(_preact.Fragment, null, n.fallback);
  return e && (e.__h = null), [(0, _preact.createElement)(_preact.Fragment, null, t.__e ? null : n.children), e];
};

var T = function (n, t, e) {
  if (++e[1] === e[0] && n.o.delete(t), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.o.size)) for (e = n.u; e;) {
    for (; e.length > 3;) e.pop()();

    if (e[1] < e[0]) break;
    n.u = e = e[2];
  }
};

function W(n) {
  return this.getChildContext = function () {
    return n.context;
  }, n.children;
}

function j(n) {
  var t = this,
      e = n.i,
      r = (0, _preact.createElement)(W, {
    context: t.context
  }, n.__v);
  t.componentWillUnmount = function () {
    var n = t.l.parentNode;
    n && n.removeChild(t.l), (0, _preact.__u)(t.s);
  }, t.i && t.i !== e && (t.componentWillUnmount(), t.h = !1), n.__v ? t.h ? (e.__k = t.__k, (0, _preact.render)(r, e), t.__k = e.__k) : (t.l = document.createTextNode(""), t.__k = e.__k, (0, _preact.hydrate)("", e), e.appendChild(t.l), t.h = !0, t.i = e, (0, _preact.render)(r, e, t.l), e.__k = t.__k, t.__k = t.l.__k) : t.h && t.componentWillUnmount(), t.s = r;
}

function P(n, t) {
  return (0, _preact.createElement)(j, {
    __v: n,
    i: t
  });
}

(I.prototype = new _preact.Component()).__e = function (n) {
  var t = this,
      e = M(t.__v),
      r = t.o.get(n);
  return r[0]++, function (u) {
    var o = function () {
      t.props.revealOrder ? (r.push(u), T(t, n, r)) : u();
    };

    e ? e(o) : o();
  };
}, I.prototype.render = function (n) {
  this.u = null, this.o = new Map();
  var t = (0, _preact.toChildArray)(n.children);
  n.revealOrder && "b" === n.revealOrder[0] && t.reverse();

  for (var e = t.length; e--;) this.o.set(t[e], this.u = [1, 0, this.u]);

  return n.children;
}, I.prototype.componentDidUpdate = I.prototype.componentDidMount = function () {
  var n = this;
  this.o.forEach(function (t, e) {
    T(n, e, t);
  });
};
var z = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103,
    V = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,
    B = "undefined" != typeof Symbol ? /fil|che|rad/i : /fil|che|ra/i;

function H(n, t, e) {
  return null == t.__k && (t.textContent = ""), (0, _preact.render)(n, t), "function" == typeof e && e(), n ? n.__c : null;
}

function Z(n, t, e) {
  return (0, _preact.hydrate)(n, t), "function" == typeof e && e(), n ? n.__c : null;
}

_preact.Component.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function (n) {
  Object.defineProperty(_preact.Component.prototype, n, {
    configurable: !0,
    get: function () {
      return this["UNSAFE_" + n];
    },
    set: function (t) {
      Object.defineProperty(this, n, {
        configurable: !0,
        writable: !0,
        value: t
      });
    }
  });
});
var Y = _preact.options.event;

function $() {}

function q() {
  return this.cancelBubble;
}

function G() {
  return this.defaultPrevented;
}

_preact.options.event = function (n) {
  return Y && (n = Y(n)), n.persist = $, n.isPropagationStopped = q, n.isDefaultPrevented = G, n.nativeEvent = n;
};

var J,
    K = {
  configurable: !0,
  get: function () {
    return this.class;
  }
},
    Q = _preact.options.vnode;

_preact.options.vnode = function (n) {
  var t = n.type,
      e = n.props,
      r = e;

  if ("string" == typeof t) {
    for (var u in r = {}, e) {
      var o = e[u];
      "defaultValue" === u && "value" in e && null == e.value ? u = "value" : "download" === u && !0 === o ? o = "" : /ondoubleclick/i.test(u) ? u = "ondblclick" : /^onchange(textarea|input)/i.test(u + t) && !B.test(e.type) ? u = "oninput" : /^on(Ani|Tra|Tou|BeforeInp)/.test(u) ? u = u.toLowerCase() : V.test(u) ? u = u.replace(/[A-Z0-9]/, "-$&").toLowerCase() : null === o && (o = void 0), r[u] = o;
    }

    "select" == t && r.multiple && Array.isArray(r.value) && (r.value = (0, _preact.toChildArray)(e.children).forEach(function (n) {
      n.props.selected = -1 != r.value.indexOf(n.props.value);
    })), n.props = r;
  }

  t && e.class != e.className && (K.enumerable = "className" in e, null != e.className && (r.class = e.className), Object.defineProperty(r, "className", K)), n.$$typeof = z, Q && Q(n);
};

var X = _preact.options.__r;

_preact.options.__r = function (n) {
  X && X(n), J = n.__c;
};

var nn = {
  ReactCurrentDispatcher: {
    current: {
      readContext: function (n) {
        return J.__n[n.__c].props.value;
      }
    }
  }
},
    tn = "16.8.0";
exports.version = tn;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = nn;

function en(n) {
  return _preact.createElement.bind(null, n);
}

function rn(n) {
  return !!n && n.$$typeof === z;
}

function un(n) {
  return rn(n) ? _preact.cloneElement.apply(null, arguments) : n;
}

function on(n) {
  return !!n.__k && ((0, _preact.render)(null, n), !0);
}

function cn(n) {
  return n && (n.base || 1 === n.nodeType && n) || null;
}

var ln = function (n, t) {
  return n(t);
},
    fn = _preact.Fragment;

exports.StrictMode = fn;
exports.unstable_batchedUpdates = ln;
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
  Children: N,
  render: H,
  hydrate: Z,
  unmountComponentAtNode: on,
  createPortal: P,
  createElement: _preact.createElement,
  createContext: _preact.createContext,
  createFactory: en,
  cloneElement: un,
  createRef: _preact.createRef,
  Fragment: _preact.Fragment,
  isValidElement: rn,
  findDOMNode: cn,
  Component: _preact.Component,
  PureComponent: w,
  memo: C,
  forwardRef: k,
  unstable_batchedUpdates: ln,
  StrictMode: _preact.Fragment,
  Suspense: F,
  SuspenseList: I,
  lazy: D,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: nn
};
exports.default = _default;
},{"preact/hooks":"../node_modules/preact/hooks/dist/hooks.module.js","preact":"../node_modules/preact/dist/preact.module.js"}],"deiQ":[function(require,module,exports) {
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
  tag.setAttribute('data-s', '');
  return tag;
}

var StyleSheet = /*#__PURE__*/function () {
  function StyleSheet(options) {
    var _this = this;

    this._insertTag = function (tag) {
      var before;

      if (_this.tags.length === 0) {
        before = _this.prepend ? _this.container.firstChild : _this.before;
      } else {
        before = _this.tags[_this.tags.length - 1].nextSibling;
      }

      _this.container.insertBefore(tag, before);

      _this.tags.push(tag);
    };

    this.isSpeedy = options.speedy === undefined ? "production" === 'production' : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.prepend = options.prepend;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.hydrate = function hydrate(nodes) {
    nodes.forEach(this._insertTag);
  };

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      this._insertTag(createStyleElement(this));
    }

    var tag = this.tags[this.tags.length - 1];

    if ("production" !== 'production') {
      var isImportRule = rule.charCodeAt(0) === 64 && rule.charCodeAt(1) === 105;

      if (isImportRule && this._alreadyInsertedOrderInsensitiveRule) {
        // this would only cause problem in speedy mode
        // but we don't want enabling speedy to affect the observable behavior
        // so we report this error at all times
        console.error("You're attempting to insert the following rule:\n" + rule + '\n\n`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted. Please ensure that `@import` rules are before all other rules.');
      }

      this._alreadyInsertedOrderInsensitiveRule = this._alreadyInsertedOrderInsensitiveRule || !isImportRule;
    }

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {
        if ("production" !== 'production' && !/:(-moz-placeholder|-ms-input-placeholder|-moz-read-write|-moz-read-only){/.test(rule)) {
          console.error("There was a problem inserting the following rule: \"" + rule + "\"", e);
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

    if ("production" !== 'production') {
      this._alreadyInsertedOrderInsensitiveRule = false;
    }
  };

  return StyleSheet;
}();

exports.StyleSheet = StyleSheet;
},{}],"../node_modules/stylis/dist/stylis.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alloc = R;
exports.append = O;
exports.caret = N;
exports.char = J;
exports.charat = z;
exports.combine = S;
exports.comment = ce;
exports.commenter = Z;
exports.compile = ee;
exports.copy = I;
exports.dealloc = T;
exports.declaration = ne;
exports.delimit = U;
exports.delimiter = Y;
exports.hash = m;
exports.identifier = _;
exports.indexof = j;
exports.match = x;
exports.middleware = ie;
exports.namespace = le;
exports.next = K;
exports.node = H;
exports.parse = re;
exports.peek = L;
exports.prefix = te;
exports.prefixer = oe;
exports.replace = y;
exports.ruleset = ae;
exports.rulesheet = fe;
exports.serialize = se;
exports.sizeof = M;
exports.slice = P;
exports.stringify = ue;
exports.strlen = A;
exports.substr = C;
exports.token = Q;
exports.tokenize = V;
exports.tokenizer = X;
exports.trim = g;
exports.whitespace = W;
exports.position = exports.line = exports.length = exports.from = exports.column = exports.characters = exports.character = exports.abs = exports.WEBKIT = exports.VIEWPORT = exports.SUPPORTS = exports.RULESET = exports.PAGE = exports.NAMESPACE = exports.MS = exports.MOZ = exports.MEDIA = exports.KEYFRAMES = exports.IMPORT = exports.FONT_FEATURE_VALUES = exports.FONT_FACE = exports.DOCUMENT = exports.DECLARATION = exports.COUNTER_STYLE = exports.COMMENT = exports.CHARSET = void 0;
var e = "-ms-";
exports.MS = e;
var r = "-moz-";
exports.MOZ = r;
var a = "-webkit-";
exports.WEBKIT = a;
var c = "comm";
exports.COMMENT = c;
var n = "rule";
exports.RULESET = n;
var t = "decl";
exports.DECLARATION = t;
var s = "@page";
exports.PAGE = s;
var u = "@media";
exports.MEDIA = u;
var i = "@import";
exports.IMPORT = i;
var f = "@charset";
exports.CHARSET = f;
var o = "@viewport";
exports.VIEWPORT = o;
var l = "@supports";
exports.SUPPORTS = l;
var v = "@document";
exports.DOCUMENT = v;
var h = "@namespace";
exports.NAMESPACE = h;
var p = "@keyframes";
exports.KEYFRAMES = p;
var w = "@font-face";
exports.FONT_FACE = w;
var b = "@counter-style";
exports.COUNTER_STYLE = b;
var $ = "@font-feature-values";
exports.FONT_FEATURE_VALUES = $;
var k = Math.abs;
exports.abs = k;
var d = String.fromCharCode;
exports.from = d;

function m(e, r) {
  return (((r << 2 ^ z(e, 0)) << 2 ^ z(e, 1)) << 2 ^ z(e, 2)) << 2 ^ z(e, 3);
}

function g(e) {
  return e.trim();
}

function x(e, r) {
  return (e = r.exec(e)) ? e[0] : e;
}

function y(e, r, a) {
  return e.replace(r, a);
}

function j(e, r) {
  return e.indexOf(r);
}

function z(e, r) {
  return e.charCodeAt(r) | 0;
}

function C(e, r, a) {
  return e.slice(r, a);
}

function A(e) {
  return e.length;
}

function M(e) {
  return e.length;
}

function O(e, r) {
  return r.push(e), e;
}

function S(e, r) {
  return e.map(r).join("");
}

var q = 1;
exports.line = q;
var B = 1;
exports.column = B;
var D = 0;
exports.length = D;
var E = 0;
exports.position = E;
var F = 0;
exports.character = F;
var G = "";
exports.characters = G;

function H(e, r, a, c, n, t, s) {
  return {
    value: e,
    root: r,
    parent: a,
    type: c,
    props: n,
    children: t,
    line: q,
    column: B,
    length: s,
    return: ""
  };
}

function I(e, r, a) {
  return H(e, r.root, r.parent, a, r.props, r.children, 0);
}

function J() {
  return F;
}

function K() {
  var _E, _B, _q;

  exports.character = F = E < D ? z(G, (_E = +E, exports.position = E = _E + 1, _E)) : 0;
  if ((_B = +B, exports.column = B = _B + 1, _B), F === 10) exports.column = B = 1, (_q = +q, exports.line = q = _q + 1, _q);
  return F;
}

function L() {
  return z(G, E);
}

function N() {
  return E;
}

function P(e, r) {
  return C(G, e, r);
}

function Q(e) {
  switch (e) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;

    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;

    case 58:
      return 3;

    case 34:
    case 39:
    case 40:
    case 91:
      return 2;

    case 41:
    case 93:
      return 1;
  }

  return 0;
}

function R(e) {
  return exports.line = q = exports.column = B = 1, exports.length = D = A(exports.characters = G = e), exports.position = E = 0, [];
}

function T(e) {
  return exports.characters = G = "", e;
}

function U(e) {
  return g(P(E - 1, Y(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}

function V(e) {
  return T(X(R(e)));
}

function W(e) {
  while (exports.character = F = L()) if (F < 33) K();else break;

  return Q(e) > 2 || Q(F) > 3 ? "" : " ";
}

function X(e) {
  while (K()) switch (Q(F)) {
    case 0:
      O(_(E - 1), e);
      break;

    case 2:
      O(U(F), e);
      break;

    default:
      O(d(F), e);
  }

  return e;
}

function Y(e) {
  while (K()) switch (F) {
    case e:
      return E;

    case 34:
    case 39:
      return Y(e === 34 || e === 39 ? e : F);

    case 40:
      if (e === 41) Y(e);
      break;

    case 92:
      K();
      break;
  }

  return E;
}

function Z(e, r) {
  while (K()) if (e + F === 47 + 10) break;else if (e + F === 42 + 42 && L() === 47) break;

  return "/*" + P(r, E - 1) + "*" + d(e === 47 ? e : K());
}

function _(e) {
  while (!Q(L())) K();

  return P(e, E);
}

function ee(e) {
  return T(re("", null, null, null, [""], e = R(e), 0, [0], e));
}

function re(e, r, a, c, n, t, s, u, i) {
  var f = 0;
  var o = 0;
  var l = s;
  var v = 0;
  var h = 0;
  var p = 0;
  var w = 1;
  var b = 1;
  var $ = 1;
  var k = 0;
  var m = "";
  var g = n;
  var x = t;
  var j = c;
  var z = m;

  while (b) switch (p = k, k = K()) {
    case 34:
    case 39:
    case 91:
    case 40:
      z += U(k);
      break;

    case 9:
    case 10:
    case 13:
    case 32:
      z += W(p);
      break;

    case 47:
      switch (L()) {
        case 42:
        case 47:
          O(ce(Z(K(), N()), r, a), i);
          break;

        default:
          z += "/";
      }

      break;

    case 123 * w:
      u[f++] = A(z) * $;

    case 125 * w:
    case 59:
    case 0:
      switch (k) {
        case 0:
        case 125:
          b = 0;

        case 59 + o:
          if (h > 0) O(h > 32 ? ne(z + ";", c, a, l - 1) : ne(y(z, " ", "") + ";", c, a, l - 2), i);
          break;

        case 59:
          z += ";";

        default:
          O(j = ae(z, r, a, f, o, n, u, m, g = [], x = [], l), t);
          if (k === 123) if (o === 0) re(z, r, j, j, g, t, l, u, x);else switch (v) {
            case 100:
            case 109:
            case 115:
              re(e, j, j, c && O(ae(e, j, j, 0, 0, n, u, m, n, g = [], l), x), n, x, l, u, c ? g : x);
              break;

            default:
              re(z, j, j, j, [""], x, l, u, x);
          }
      }

      f = o = h = 0, w = $ = 1, m = z = "", l = s;
      break;

    case 58:
      l = 1 + A(z), h = p;

    default:
      switch (z += d(k), k * w) {
        case 38:
          $ = o > 0 ? 1 : (z += "\f", -1);
          break;

        case 44:
          u[f++] = (A(z) - 1) * $, $ = 1;
          break;

        case 64:
          if (L() === 45) z += U(K());
          v = L(), o = A(m = z += _(N())), k++;
          break;

        case 45:
          if (p === 45 && A(z) == 2) w = 0;
      }

  }

  return t;
}

function ae(e, r, a, c, t, s, u, i, f, o, l) {
  var v = t - 1;
  var h = t === 0 ? s : [""];
  var p = M(h);

  for (var w = 0, b = 0, $ = 0; w < c; ++w) for (var d = 0, m = C(e, v + 1, v = k(b = u[w])), x = e; d < p; ++d) if (x = g(b > 0 ? h[d] + " " + m : y(m, /&\f/g, h[d]))) f[$++] = x;

  return H(e, r, a, t === 0 ? n : i, f, o, l);
}

function ce(e, r, a) {
  return H(e, r, a, c, d(J()), C(e, 2, -2), 0);
}

function ne(e, r, a, c) {
  return H(e, r, a, t, C(e, 0, c), C(e, c + 1, -1), c);
}

function te(c, n) {
  switch (m(c, n)) {
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return a + c + c;

    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return a + c + r + c + e + c + c;

    case 6828:
    case 4268:
      return a + c + e + c + c;

    case 6165:
      return a + c + e + "flex-" + c + c;

    case 5187:
      return a + c + y(c, /(\w+).+(:[^]+)/, a + "box-$1$2" + e + "flex-$1$2") + c;

    case 5443:
      return a + c + e + "flex-item-" + y(c, /flex-|-self/, "") + c;

    case 4675:
      return a + c + e + "flex-line-pack" + y(c, /align-content|flex-|-self/, "") + c;

    case 5548:
      return a + c + e + y(c, "shrink", "negative") + c;

    case 5292:
      return a + c + e + y(c, "basis", "preferred-size") + c;

    case 6060:
      return a + "box-" + y(c, "-grow", "") + a + c + e + y(c, "grow", "positive") + c;

    case 4554:
      return a + y(c, /([^-])(transform)/g, "$1" + a + "$2") + c;

    case 6187:
      return y(y(y(c, /(zoom-|grab)/, a + "$1"), /(image-set)/, a + "$1"), c, "") + c;

    case 5495:
    case 3959:
      return y(c, /(image-set\([^]*)/, a + "$1" + "$`$1");

    case 4968:
      return y(y(c, /(.+:)(flex-)?(.*)/, a + "box-pack:$3" + e + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + a + c + c;

    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return y(c, /(.+)-inline(.+)/, a + "$1$2") + c;

    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (A(c) - 1 - n > 6) switch (z(c, n + 1)) {
        case 102:
          n = z(c, n + 3);

        case 109:
          return y(c, /(.+:)(.+)-([^]+)/, "$1" + a + "$2-$3" + "$1" + r + (n == 108 ? "$3" : "$2-$3")) + c;

        case 115:
          return ~j(c, "stretch") ? te(y(c, "stretch", "fill-available"), n) + c : c;
      }
      break;

    case 4949:
      if (z(c, n + 1) !== 115) break;

    case 6444:
      switch (z(c, A(c) - 3 - (~j(c, "!important") && 10))) {
        case 107:
        case 111:
          return y(c, c, a + c) + c;

        case 101:
          return y(c, /(.+:)([^;!]+)(;|!.+)?/, "$1" + a + (z(c, 14) === 45 ? "inline-" : "") + "box$3" + "$1" + a + "$2$3" + "$1" + e + "$2box$3") + c;
      }

      break;

    case 5936:
      switch (z(c, n + 11)) {
        case 114:
          return a + c + e + y(c, /[svh]\w+-[tblr]{2}/, "tb") + c;

        case 108:
          return a + c + e + y(c, /[svh]\w+-[tblr]{2}/, "tb-rl") + c;

        case 45:
          return a + c + e + y(c, /[svh]\w+-[tblr]{2}/, "lr") + c;
      }

      return a + c + e + c + c;
  }

  return c;
}

function se(e, r) {
  var a = "";
  var c = M(e);

  for (var n = 0; n < c; n++) a += r(e[n], n, e, r) || "";

  return a;
}

function ue(e, r, a, s) {
  switch (e.type) {
    case i:
    case t:
      return e.return = e.return || e.value;

    case c:
      return "";

    case n:
      e.value = e.props.join(",");
  }

  return A(a = se(e.children, s)) ? e.return = e.value + "{" + a + "}" : "";
}

function ie(e) {
  var r = M(e);
  return function (a, c, n, t) {
    var s = "";

    for (var u = 0; u < r; u++) s += e[u](a, c, n, t) || "";

    return s;
  };
}

function fe(e) {
  return function (r) {
    if (!r.root) if (r = r.return) e(r);
  };
}

function oe(c, s, u, i) {
  if (!c.return) switch (c.type) {
    case t:
      c.return = te(c.value, c.length);
      break;

    case p:
      return se([I(y(c.value, "@", "@" + a), c, "")], i);

    case n:
      if (c.length) return S(c.props, function (n) {
        switch (x(n, /(::plac\w+|:read-\w+)/)) {
          case ":read-only":
          case ":read-write":
            return se([I(y(n, /:(read-\w+)/, ":" + r + "$1"), c, "")], i);

          case "::placeholder":
            return se([I(y(n, /:(plac\w+)/, ":" + a + "input-$1"), c, ""), I(y(n, /:(plac\w+)/, ":" + r + "$1"), c, ""), I(y(n, /:(plac\w+)/, e + "input-$1"), c, "")], i);
        }

        return "";
      });
  }
}

function le(e) {
  switch (e.type) {
    case n:
      e.props = e.props.map(function (r) {
        return S(V(r), function (r, a, c) {
          switch (z(r, 0)) {
            case 12:
              return C(r, 1, A(r));

            case 0:
            case 40:
            case 43:
            case 62:
            case 126:
              return r;

            case 58:
              if (c[a + 1] === "global") c[a + 1] = "", c[a + 2] = "\f" + C(c[a + 2], a = 1, -1);

            case 32:
              return a === 1 ? "" : r;

            default:
              switch (a) {
                case 0:
                  e = r;
                  return M(c) > 1 ? "" : r;

                case a = M(c) - 1:
                case 2:
                  return a === 2 ? r + e + e : r + e;

                default:
                  return r;
              }

          }
        });
      });
  }
}
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
},{}],"../node_modules/@emotion/memoize/dist/emotion-memoize.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function memoize(fn) {
  var cache = Object.create(null);
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var _default = memoize;
exports.default = _default;
},{}],"hQoc":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sheet = require("@emotion/sheet");

var _stylis = require("stylis");

require("@emotion/weak-memoize");

require("@emotion/memoize");

var last = function last(arr) {
  return arr.length ? arr[arr.length - 1] : null;
};

var toRules = function toRules(parsed, points) {
  // pretend we've started with a comma
  var index = -1;
  var character = 44;

  do {
    switch ((0, _stylis.token)(character)) {
      case 0:
        // &\f
        if (character === 38 && (0, _stylis.peek)() === 12) {
          // this is not 100% correct, we don't account for literal sequences here - like for example quoted strings
          // stylis inserts \f after & to know when & where it should replace this sequence with the context selector
          // and when it should just concatenate the outer and inner selectors
          // it's very unlikely for this sequence to actually appear in a different context, so we just leverage this fact here
          points[index] = 1;
        }

        parsed[index] += (0, _stylis.identifier)(_stylis.position - 1);
        break;

      case 2:
        parsed[index] += (0, _stylis.delimit)(character);
        break;

      case 4:
        // comma
        if (character === 44) {
          // colon
          parsed[++index] = (0, _stylis.peek)() === 58 ? '&\f' : '';
          points[index] = parsed[index].length;
          break;
        }

      // fallthrough

      default:
        parsed[index] += (0, _stylis.from)(character);
    }
  } while (character = (0, _stylis.next)());

  return parsed;
};

var getRules = function getRules(value, points) {
  return (0, _stylis.dealloc)(toRules((0, _stylis.alloc)(value), points));
}; // WeakSet would be more appropriate, but only WeakMap is supported in IE11


var fixedElements = /* #__PURE__ */new WeakMap();

var compat = function compat(element) {
  if (element.type !== 'rule' || !element.parent || // .length indicates if this rule contains pseudo or not
  !element.length) {
    return;
  }

  var value = element.value,
      parent = element.parent;
  var isImplicitRule = element.column === parent.column && element.line === parent.line;

  while (parent.type !== 'rule') {
    parent = parent.parent;
    if (!parent) return;
  } // short-circuit for the simplest case


  if (element.props.length === 1 && value.charCodeAt(0) !== 58
  /* colon */
  && !fixedElements.get(parent)) {
    return;
  } // if this is an implicitly inserted rule (the one eagerly inserted at the each new nested level)
  // then the props has already been manipulated beforehand as they that array is shared between it and its "rule parent"


  if (isImplicitRule) {
    return;
  }

  fixedElements.set(element, true);
  var points = [];
  var rules = getRules(value, points);
  var parentRules = parent.props;

  for (var i = 0, k = 0; i < rules.length; i++) {
    for (var j = 0; j < parentRules.length; j++, k++) {
      element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
    }
  }
};

var removeLabel = function removeLabel(element) {
  if (element.type === 'decl') {
    var value = element.value;

    if ( // charcode for l
    value.charCodeAt(0) === 108 && // charcode for b
    value.charCodeAt(2) === 98) {
      // this ignores label
      element["return"] = '';
      element.value = '';
    }
  }
};

var ignoreFlag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';

var isIgnoringComment = function isIgnoringComment(element) {
  return !!element && element.type === 'comm' && element.children.indexOf(ignoreFlag) > -1;
};

var createUnsafeSelectorsAlarm = function createUnsafeSelectorsAlarm(cache) {
  return function (element, index, children) {
    if (element.type !== 'rule') return;
    var unsafePseudoClasses = element.value.match(/(:first|:nth|:nth-last)-child/g);

    if (unsafePseudoClasses && cache.compat !== true) {
      var prevElement = index > 0 ? children[index - 1] : null;

      if (prevElement && isIgnoringComment(last(prevElement.children))) {
        return;
      }

      unsafePseudoClasses.forEach(function (unsafePseudoClass) {
        console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
      });
    }
  };
};

var isImportRule = function isImportRule(element) {
  return element.type.charCodeAt(1) === 105 && element.type.charCodeAt(0) === 64;
};

var isPrependedWithRegularRules = function isPrependedWithRegularRules(index, children) {
  for (var i = index - 1; i >= 0; i--) {
    if (!isImportRule(children[i])) {
      return true;
    }
  }

  return false;
}; // use this to remove incorrect elements from further processing
// so they don't get handed to the `sheet` (or anything else)
// as that could potentially lead to additional logs which in turn could be overhelming to the user


var nullifyElement = function nullifyElement(element) {
  element.type = '';
  element.value = '';
  element["return"] = '';
  element.children = '';
  element.props = '';
};

var incorrectImportAlarm = function incorrectImportAlarm(element, index, children) {
  if (!isImportRule(element)) {
    return;
  }

  if (element.parent) {
    console.error("`@import` rules can't be nested inside other rules. Please move it to the top level and put it before regular rules. Keep in mind that they can only be used within global styles.");
    nullifyElement(element);
  } else if (isPrependedWithRegularRules(index, children)) {
    console.error("`@import` rules can't be after other rules. Please put your `@import` rules before your other rules.");
    nullifyElement(element);
  }
};

var defaultStylisPlugins = [_stylis.prefixer];

var createCache = function createCache(options) {
  var key = options.key;

  if ("production" !== 'production' && !key) {
    throw new Error("You have to configure `key` for your cache. Please make sure it's unique (and not equal to 'css') as it's used for linking styles to your cache.\n" + "If multiple caches share the same key they might \"fight\" for each other's style elements.");
  }

  if (key === 'css') {
    var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])"); // get SSRed styles out of the way of React's hydration
    // document.head is a safe place to move them to

    Array.prototype.forEach.call(ssrStyles, function (node) {
      document.head.appendChild(node);
      node.setAttribute('data-s', '');
    });
  }

  var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;

  if ("production" !== 'production') {
    // $FlowFixMe
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var inserted = {}; // $FlowFixMe

  var container;
  var nodesToHydrate = [];
  {
    container = options.container || document.head;
    Array.prototype.forEach.call(document.querySelectorAll("style[data-emotion]"), function (node) {
      var attrib = node.getAttribute("data-emotion").split(' ');

      if (attrib[0] !== key) {
        return;
      } // $FlowFixMe


      for (var i = 1; i < attrib.length; i++) {
        inserted[attrib[i]] = true;
      }

      nodesToHydrate.push(node);
    });
  }

  var _insert;

  var omnipresentPlugins = [compat, removeLabel];

  if ("production" !== 'production') {
    omnipresentPlugins.push(createUnsafeSelectorsAlarm({
      get compat() {
        return cache.compat;
      }

    }), incorrectImportAlarm);
  }

  {
    var currentSheet;
    var finalizingPlugins = [_stylis.stringify, "production" !== 'production' ? function (element) {
      if (!element.root) {
        if (element["return"]) {
          currentSheet.insert(element["return"]);
        } else if (element.value && element.type !== _stylis.COMMENT) {
          // insert empty rule in non-production environments
          // so @emotion/jest can grab `key` from the (JS)DOM for caches without any rules inserted yet
          currentSheet.insert(element.value + "{}");
        }
      }
    } : (0, _stylis.rulesheet)(function (rule) {
      currentSheet.insert(rule);
    })];
    var serializer = (0, _stylis.middleware)(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));

    var stylis = function stylis(styles) {
      return (0, _stylis.serialize)((0, _stylis.compile)(styles), serializer);
    };

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      currentSheet = sheet;

      if ("production" !== 'production' && serialized.map !== undefined) {
        currentSheet = {
          insert: function insert(rule) {
            sheet.insert(rule + serialized.map);
          }
        };
      }

      stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);

      if (shouldCache) {
        cache.inserted[serialized.name] = true;
      }
    };
  }
  var cache = {
    key: key,
    sheet: new _sheet.StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy,
      prepend: options.prepend
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  cache.sheet.hydrate(nodesToHydrate);
  return cache;
};

var _default = createCache;
exports.default = _default;
},{"@emotion/sheet":"deiQ","stylis":"../node_modules/stylis/dist/stylis.mjs","@emotion/weak-memoize":"../node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js","@emotion/memoize":"../node_modules/@emotion/memoize/dist/emotion-memoize.browser.esm.js"}],"../node_modules/@emotion/react/node_modules/@babel/runtime/helpers/esm/extends.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _extends;

function _extends() {
  exports.default = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}
},{}],"RsE0":[function(require,module,exports) {
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;exports.Lazy=t;exports.Memo=r;exports.Portal=d;
exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;exports.isAsyncMode=function(a){return A(a)||z(a)===l};exports.isConcurrentMode=A;exports.isContextConsumer=function(a){return z(a)===k};exports.isContextProvider=function(a){return z(a)===h};exports.isElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return z(a)===n};exports.isFragment=function(a){return z(a)===e};exports.isLazy=function(a){return z(a)===t};
exports.isMemo=function(a){return z(a)===r};exports.isPortal=function(a){return z(a)===d};exports.isProfiler=function(a){return z(a)===g};exports.isStrictMode=function(a){return z(a)===f};exports.isSuspense=function(a){return z(a)===p};
exports.isValidElementType=function(a){return"string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};exports.typeOf=z;

},{}],"H1RQ":[function(require,module,exports) {
'use strict';

if ("production" === 'production') {
  module.exports = require('./cjs/react-is.production.min.js');
} else {
  module.exports = require('./cjs/react-is.development.js');
}
},{"./cjs/react-is.production.min.js":"RsE0"}],"../node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js":[function(require,module,exports) {
'use strict';

var reactIs = require('react-is');

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};
var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};
var FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  '$$typeof': true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

function getStatics(component) {
  // React v16.11 and below
  if (reactIs.isMemo(component)) {
    return MEMO_STATICS;
  } // React v16.12 and above


  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
}

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;
function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components
    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);

      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }

    var keys = getOwnPropertyNames(sourceComponent);

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }

    var targetStatics = getStatics(targetComponent);
    var sourceStatics = getStatics(sourceComponent);

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];

      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

        try {
          // Avoid failures from read-only properties
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {}
      }
    }
  }

  return targetComponent;
}

module.exports = hoistNonReactStatics;

},{"react-is":"H1RQ"}],"../node_modules/@emotion/react/isolated-hoist-non-react-statics-do-not-use-this-in-your-code/dist/emotion-react-isolated-hoist-non-react-statics-do-not-use-this-in-your-code.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// this file isolates this package that is not tree-shakeable
// and if this module doesn't actually contain any logic of its own
// then Rollup just use 'hoist-non-react-statics' directly in other chunks
var hoistNonReactStatics = function (targetComponent, sourceComponent) {
  return (0, _hoistNonReactStatics.default)(targetComponent, sourceComponent);
};

var _default = hoistNonReactStatics;
exports.default = _default;
},{"hoist-non-react-statics":"../node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js"}],"../node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js":[function(require,module,exports) {
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
      registeredStyles.push(registered[className] + ";");
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
  isBrowser === false) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }

  if (cache.inserted[serialized.name] === undefined) {
    var current = serialized;

    do {
      var maybeStyles = cache.insert(serialized === current ? "." + className : '', current, cache.sheet, true);
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
},{}],"YZxA":[function(require,module,exports) {
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

var processStyleName = /* #__PURE__ */(0, _memoize.default)(function (styleName) {
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
        throw new Error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
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

function handleInterpolation(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return '';
  }

  if (interpolation.__emotion_styles !== undefined) {
    if ("production" !== 'production' && interpolation.toString() === 'NO_COMPONENT_SELECTOR') {
      throw new Error('Component selectors can only be used in conjunction with @emotion/babel-plugin.');
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
          return handleInterpolation(mergedProps, registered, result);
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
  return cached !== undefined ? cached : interpolation;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
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
          throw new Error('Component selectors can only be used in conjunction with @emotion/babel-plugin.');
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value);

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
  sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;
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
    styles += handleInterpolation(mergedProps, registered, strings);
  } else {
    if ("production" !== 'production' && strings[0] === undefined) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
    }

    styles += strings[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i]);

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
},{"@emotion/hash":"../node_modules/@emotion/hash/dist/hash.browser.esm.js","@emotion/unitless":"../node_modules/@emotion/unitless/dist/unitless.browser.esm.js","@emotion/memoize":"../node_modules/@emotion/memoize/dist/emotion-memoize.browser.esm.js"}],"VkRS":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.b = withTheme;
exports.w = exports.u = exports.h = exports.c = exports.a = exports.T = exports.E = exports.C = void 0;

var _react = require("react");

var _cache = _interopRequireDefault(require("@emotion/cache"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/extends"));

var _weakMemoize = _interopRequireDefault(require("@emotion/weak-memoize"));

var _emotionReactIsolatedHoistNonReactStaticsDoNotUseThisInYourCodeBrowserEsm = _interopRequireDefault(require("../isolated-hoist-non-react-statics-do-not-use-this-in-your-code/dist/emotion-react-isolated-hoist-non-react-statics-do-not-use-this-in-your-code.browser.esm.js"));

var _utils = require("@emotion/utils");

var _serialize = require("@emotion/serialize");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasOwnProperty = Object.prototype.hasOwnProperty;
exports.h = hasOwnProperty;
var EmotionCacheContext = /* #__PURE__ */(0, _react.createContext)( // we're doing this to avoid preconstruct's dead code elimination in this one case
// because this module is primarily intended for the browser and node
// but it's also required in react native and similar environments sometimes
// and we could have a special build just for that
// but this is much easier and the native packages
// might use a different theme context in the future anyway
typeof HTMLElement !== 'undefined' ? /* #__PURE__ */(0, _cache.default)({
  key: 'css'
}) : null);
var CacheProvider = EmotionCacheContext.Provider;
exports.C = CacheProvider;

var withEmotionCache = function withEmotionCache(func) {
  // $FlowFixMe
  return /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    // the cache will never be null in the browser
    var cache = (0, _react.useContext)(EmotionCacheContext);
    return func(props, cache, ref);
  });
};

exports.w = withEmotionCache;
var ThemeContext = /* #__PURE__ */(0, _react.createContext)({});
exports.T = ThemeContext;

var useTheme = function useTheme() {
  return (0, _react.useContext)(ThemeContext);
};

exports.u = useTheme;

var getTheme = function getTheme(outerTheme, theme) {
  if (typeof theme === 'function') {
    var mergedTheme = theme(outerTheme);

    if ("production" !== 'production' && (mergedTheme == null || typeof mergedTheme !== 'object' || Array.isArray(mergedTheme))) {
      throw new Error('[ThemeProvider] Please return an object from your theme function, i.e. theme={() => ({})}!');
    }

    return mergedTheme;
  }

  if ("production" !== 'production' && (theme == null || typeof theme !== 'object' || Array.isArray(theme))) {
    throw new Error('[ThemeProvider] Please make your theme prop a plain object');
  }

  return (0, _extends2.default)({}, outerTheme, {}, theme);
};

var createCacheWithTheme = /* #__PURE__ */(0, _weakMemoize.default)(function (outerTheme) {
  return (0, _weakMemoize.default)(function (theme) {
    return getTheme(outerTheme, theme);
  });
});

var ThemeProvider = function ThemeProvider(props) {
  var theme = (0, _react.useContext)(ThemeContext);

  if (props.theme !== theme) {
    theme = createCacheWithTheme(theme)(props.theme);
  }

  return /*#__PURE__*/(0, _react.createElement)(ThemeContext.Provider, {
    value: theme
  }, props.children);
};

exports.a = ThemeProvider;

function withTheme(Component) {
  var componentName = Component.displayName || Component.name || 'Component';

  var render = function render(props, ref) {
    var theme = (0, _react.useContext)(ThemeContext);
    return /*#__PURE__*/(0, _react.createElement)(Component, (0, _extends2.default)({
      theme: theme,
      ref: ref
    }, props));
  }; // $FlowFixMe


  var WithTheme = /*#__PURE__*/(0, _react.forwardRef)(render);
  WithTheme.displayName = "WithTheme(" + componentName + ")";
  return (0, _emotionReactIsolatedHoistNonReactStaticsDoNotUseThisInYourCodeBrowserEsm.default)(WithTheme, Component);
} // thus we only need to replace what is a valid character for JS, but not for CSS


var sanitizeIdentifier = function sanitizeIdentifier(identifier) {
  return identifier.replace(/\$/g, '-');
};

var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__';
var labelPropName = '__EMOTION_LABEL_PLEASE_DO_NOT_USE__';

var createEmotionProps = function createEmotionProps(type, props) {
  if ("production" !== 'production' && typeof props.css === 'string' && // check if there is a css declaration
  props.css.indexOf(':') !== -1) {
    throw new Error("Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/react' like this: css`" + props.css + "`");
  }

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
      var match = error.stack.match(/at (?:Object\.|Module\.|)(?:jsx|createEmotionProps).*\n\s+at (?:Object\.|)([A-Z][A-Za-z0-9$]+) /);

      if (!match) {
        // safari and firefox
        match = error.stack.match(/.*\n([A-Z][A-Za-z0-9$]+)@/);
      }

      if (match) {
        newProps[labelPropName] = sanitizeIdentifier(match[1]);
      }
    }
  }

  return newProps;
};

exports.c = createEmotionProps;
var Emotion = /* #__PURE__ */withEmotionCache(function (props, cache, ref) {
  var cssProp = props.css; // so that using `css` from `emotion` and passing the result to the css prop works
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

  var serialized = (0, _serialize.serializeStyles)(registeredStyles, undefined, typeof cssProp === 'function' || Array.isArray(cssProp) ? (0, _react.useContext)(ThemeContext) : undefined);

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
  var ele = /*#__PURE__*/(0, _react.createElement)(type, newProps);
  return ele;
});
exports.E = Emotion;

if ("production" !== 'production') {
  Emotion.displayName = 'EmotionCssPropInternal';
}
},{"react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/cache":"hQoc","@babel/runtime/helpers/esm/extends":"../node_modules/@emotion/react/node_modules/@babel/runtime/helpers/esm/extends.js","@emotion/weak-memoize":"../node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js","../isolated-hoist-non-react-statics-do-not-use-this-in-your-code/dist/emotion-react-isolated-hoist-non-react-statics-do-not-use-this-in-your-code.browser.esm.js":"../node_modules/@emotion/react/isolated-hoist-non-react-statics-do-not-use-this-in-your-code/dist/emotion-react-isolated-hoist-non-react-statics-do-not-use-this-in-your-code.browser.esm.js","@emotion/utils":"../node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js","@emotion/serialize":"YZxA"}],"../node_modules/@emotion/react/node_modules/@babel/runtime/helpers/extends.js":[function(require,module,exports) {
function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

module.exports = _extends;
},{}],"cUkA":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.css = css;
Object.defineProperty(exports, "CacheProvider", {
  enumerable: true,
  get: function () {
    return _emotionElement4fbd89c5BrowserEsm.C;
  }
});
Object.defineProperty(exports, "ThemeContext", {
  enumerable: true,
  get: function () {
    return _emotionElement4fbd89c5BrowserEsm.T;
  }
});
Object.defineProperty(exports, "ThemeProvider", {
  enumerable: true,
  get: function () {
    return _emotionElement4fbd89c5BrowserEsm.a;
  }
});
Object.defineProperty(exports, "useTheme", {
  enumerable: true,
  get: function () {
    return _emotionElement4fbd89c5BrowserEsm.u;
  }
});
Object.defineProperty(exports, "withEmotionCache", {
  enumerable: true,
  get: function () {
    return _emotionElement4fbd89c5BrowserEsm.w;
  }
});
Object.defineProperty(exports, "withTheme", {
  enumerable: true,
  get: function () {
    return _emotionElement4fbd89c5BrowserEsm.b;
  }
});
exports.keyframes = exports.jsx = exports.createElement = exports.Global = exports.ClassNames = void 0;

var _react = require("react");

require("@emotion/cache");

var _emotionElement4fbd89c5BrowserEsm = require("./emotion-element-4fbd89c5.browser.esm.js");

require("@babel/runtime/helpers/extends");

require("@emotion/weak-memoize");

require("hoist-non-react-statics");

require("../isolated-hoist-non-react-statics-do-not-use-this-in-your-code/dist/emotion-react-isolated-hoist-non-react-statics-do-not-use-this-in-your-code.browser.esm.js");

var _utils = require("@emotion/utils");

var _serialize = require("@emotion/serialize");

var _sheet = require("@emotion/sheet");

var pkg = {
  name: "@emotion/react",
  version: "11.1.4",
  main: "dist/emotion-react.cjs.js",
  module: "dist/emotion-react.esm.js",
  browser: {
    "./dist/emotion-react.cjs.js": "./dist/emotion-react.browser.cjs.js",
    "./dist/emotion-react.esm.js": "./dist/emotion-react.browser.esm.js"
  },
  types: "types/index.d.ts",
  files: ["src", "dist", "jsx-runtime", "jsx-dev-runtime", "isolated-hoist-non-react-statics-do-not-use-this-in-your-code", "types/*.d.ts", "macro.js", "macro.d.ts", "macro.js.flow"],
  sideEffects: false,
  author: "mitchellhamilton <mitchell@mitchellhamilton.me>",
  license: "MIT",
  scripts: {
    "test:typescript": "dtslint types"
  },
  dependencies: {
    "@babel/runtime": "^7.7.2",
    "@emotion/cache": "^11.1.3",
    "@emotion/serialize": "^1.0.0",
    "@emotion/sheet": "^1.0.1",
    "@emotion/utils": "^1.0.0",
    "@emotion/weak-memoize": "^0.2.5",
    "hoist-non-react-statics": "^3.3.1"
  },
  peerDependencies: {
    "@babel/core": "^7.0.0",
    react: ">=16.8.0"
  },
  peerDependenciesMeta: {
    "@babel/core": {
      optional: true
    },
    "@types/react": {
      optional: true
    }
  },
  devDependencies: {
    "@babel/core": "^7.7.2",
    "@emotion/css": "11.1.3",
    "@emotion/css-prettifier": "1.0.0",
    "@emotion/server": "11.0.0",
    "@emotion/styled": "11.0.0",
    "@types/react": "^16.9.11",
    dtslint: "^0.3.0",
    "html-tag-names": "^1.1.2",
    react: "16.14.0",
    "svg-tag-names": "^1.1.1"
  },
  repository: "https://github.com/emotion-js/emotion/tree/master/packages/react",
  publishConfig: {
    access: "public"
  },
  "umd:main": "dist/emotion-react.umd.min.js",
  preconstruct: {
    entrypoints: ["./index.js", "./jsx-runtime.js", "./jsx-dev-runtime.js", "./isolated-hoist-non-react-statics-do-not-use-this-in-your-code.js"],
    umdName: "emotionReact"
  }
};

var jsx = function jsx(type, props) {
  var args = arguments;

  if (props == null || !_emotionElement4fbd89c5BrowserEsm.h.call(props, 'css')) {
    // $FlowFixMe
    return _react.createElement.apply(undefined, args);
  }

  var argsLength = args.length;
  var createElementArgArray = new Array(argsLength);
  createElementArgArray[0] = _emotionElement4fbd89c5BrowserEsm.E;
  createElementArgArray[1] = (0, _emotionElement4fbd89c5BrowserEsm.c)(type, props);

  for (var i = 2; i < argsLength; i++) {
    createElementArgArray[i] = args[i];
  } // $FlowFixMe


  return _react.createElement.apply(null, createElementArgArray);
};

exports.jsx = exports.createElement = jsx;
var warnedAboutCssPropForGlobal = false; // maintain place over rerenders.
// initial render from browser, insertBefore context.sheet.tags[0] or if a style hasn't been inserted there yet, appendChild
// initial client-side render from SSR, use place of hydrating tag

var Global = /* #__PURE__ */(0, _emotionElement4fbd89c5BrowserEsm.w)(function (props, cache) {
  if ("production" !== 'production' && !warnedAboutCssPropForGlobal && ( // check for className as well since the user is
  // probably using the custom createElement which
  // means it will be turned into a className prop
  // $FlowFixMe I don't really want to add it to the type since it shouldn't be used
  props.className || props.css)) {
    console.error("It looks like you're using the css prop on Global, did you mean to use the styles prop instead?");
    warnedAboutCssPropForGlobal = true;
  }

  var styles = props.styles;
  var serialized = (0, _serialize.serializeStyles)([styles], undefined, typeof styles === 'function' || Array.isArray(styles) ? (0, _react.useContext)(_emotionElement4fbd89c5BrowserEsm.T) : undefined); // but it is based on a constant that will never change at runtime
  // it's effectively like having two implementations and switching them out
  // so it's not actually breaking anything

  var sheetRef = (0, _react.useRef)();
  (0, _react.useLayoutEffect)(function () {
    var key = cache.key + "-global";
    var sheet = new _sheet.StyleSheet({
      key: key,
      nonce: cache.sheet.nonce,
      container: cache.sheet.container,
      speedy: cache.sheet.isSpeedy
    }); // $FlowFixMe

    var node = document.querySelector("style[data-emotion=\"" + key + " " + serialized.name + "\"]");

    if (cache.sheet.tags.length) {
      sheet.before = cache.sheet.tags[0];
    }

    if (node !== null) {
      sheet.hydrate([node]);
    }

    sheetRef.current = sheet;
    return function () {
      sheet.flush();
    };
  }, [cache]);
  (0, _react.useLayoutEffect)(function () {
    if (serialized.next !== undefined) {
      // insert keyframes
      (0, _utils.insertStyles)(cache, serialized.next, true);
    }

    var sheet = sheetRef.current;

    if (sheet.tags.length) {
      // if this doesn't exist then it will be null so the style element will be appended
      var element = sheet.tags[sheet.tags.length - 1].nextElementSibling;
      sheet.before = element;
      sheet.flush();
    }

    cache.insert("", serialized, sheet, false);
  }, [cache, serialized.name]);
  return null;
});
exports.Global = Global;

if ("production" !== 'production') {
  Global.displayName = 'EmotionGlobal';
}

function css() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _serialize.serializeStyles)(args);
}

var keyframes = function keyframes() {
  var insertable = css.apply(void 0, arguments);
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
            if ("production" !== 'production' && arg.styles !== undefined && arg.name !== undefined) {
              console.error('You have passed styles created with `css` from `@emotion/react` package to the `cx`.\n' + '`cx` is meant to compose class names (strings) so you should convert those styles to a class name by passing them to the `css` received from <ClassNames/> component.');
            }

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

var ClassNames = /* #__PURE__ */(0, _emotionElement4fbd89c5BrowserEsm.w)(function (props, cache) {
  var hasRendered = false;

  var css = function css() {
    if (hasRendered && "production" !== 'production') {
      throw new Error('css can only be used during render');
    }

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var serialized = (0, _serialize.serializeStyles)(args, cache.registered);
    {
      (0, _utils.insertStyles)(cache, serialized, false);
    }
    return cache.key + "-" + serialized.name;
  };

  var cx = function cx() {
    if (hasRendered && "production" !== 'production') {
      throw new Error('cx can only be used during render');
    }

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return merge(cache.registered, css, classnames(args));
  };

  var content = {
    css: css,
    cx: cx,
    theme: (0, _react.useContext)(_emotionElement4fbd89c5BrowserEsm.T)
  };
  var ele = props.children(content);
  hasRendered = true;
  return ele;
});
exports.ClassNames = ClassNames;

if ("production" !== 'production') {
  ClassNames.displayName = 'EmotionClassNames';
}

if ("production" !== 'production') {
  var isBrowser = "object" !== 'undefined'; // #1727 for some reason Jest evaluates modules twice if some consuming module gets mocked with jest.mock

  var isJest = typeof jest !== 'undefined';

  if (isBrowser && !isJest) {
    var globalContext = isBrowser ? window : global;
    var globalKey = "__EMOTION_REACT_" + pkg.version.split('.')[0] + "__";

    if (globalContext[globalKey]) {
      console.warn('You are loading @emotion/react when it is already loaded. Running ' + 'multiple instances may cause problems. This can happen if multiple ' + 'versions are used, or if multiple builds of the same version are ' + 'used.');
    }

    globalContext[globalKey] = true;
  }
}
},{"react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/cache":"hQoc","./emotion-element-4fbd89c5.browser.esm.js":"VkRS","@babel/runtime/helpers/extends":"../node_modules/@emotion/react/node_modules/@babel/runtime/helpers/extends.js","@emotion/weak-memoize":"../node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js","hoist-non-react-statics":"../node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js","../isolated-hoist-non-react-statics-do-not-use-this-in-your-code/dist/emotion-react-isolated-hoist-non-react-statics-do-not-use-this-in-your-code.browser.esm.js":"../node_modules/@emotion/react/isolated-hoist-non-react-statics-do-not-use-this-in-your-code/dist/emotion-react-isolated-hoist-non-react-statics-do-not-use-this-in-your-code.browser.esm.js","@emotion/utils":"../node_modules/@emotion/utils/dist/emotion-utils.browser.esm.js","@emotion/serialize":"YZxA","@emotion/sheet":"deiQ"}],"ui/TraktIcon.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const react_1 = require("react");

const react_2 = require("@emotion/react");

let className = react_2.css`
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOC4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMTQ0LjggMTQ0LjgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE0NC44IDE0NC44IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxjaXJjbGUgZmlsbD0iI0ZGRkZGRiIgY3g9IjcyLjQiIGN5PSI3Mi40IiByPSI3Mi40Ii8+DQoJPHBhdGggZmlsbD0iI0VEMjIyNCIgZD0iTTI5LjUsMTExLjhjMTAuNiwxMS42LDI1LjksMTguOCw0Mi45LDE4LjhjOC43LDAsMTYuOS0xLjksMjQuMy01LjNMNTYuMyw4NUwyOS41LDExMS44eiIvPg0KCTxwYXRoIGZpbGw9IiNFRDIyMjQiIGQ9Ik01Ni4xLDYwLjZMMjUuNSw5MS4xTDIxLjQsODdsMzIuMi0zMi4yaDBsMzcuNi0zNy42Yy01LjktMi0xMi4yLTMuMS0xOC44LTMuMWMtMzIuMiwwLTU4LjMsMjYuMS01OC4zLDU4LjMNCgkJYzAsMTMuMSw0LjMsMjUuMiwxMS43LDM1bDMwLjUtMzAuNWwyLjEsMmw0My43LDQzLjdjMC45LTAuNSwxLjctMSwyLjUtMS42TDU2LjMsNzIuN0wyNywxMDJsLTQuMS00LjFsMzMuNC0zMy40bDIuMSwybDUxLDUwLjkNCgkJYzAuOC0wLjYsMS41LTEuMywyLjItMS45bC01NS01NUw1Ni4xLDYwLjZ6Ii8+DQoJPHBhdGggZmlsbD0iI0VEMUMyNCIgZD0iTTExNS43LDExMS40YzkuMy0xMC4zLDE1LTI0LDE1LTM5YzAtMjMuNC0xMy44LTQzLjUtMzMuNi01Mi44TDYwLjQsNTYuMkwxMTUuNywxMTEuNHogTTc0LjUsNjYuOGwtNC4xLTQuMQ0KCQlsMjguOS0yOC45bDQuMSw0LjFMNzQuNSw2Ni44eiBNMTAxLjksMjcuMUw2OC42LDYwLjRsLTQuMS00LjFMOTcuOCwyM0wxMDEuOSwyNy4xeiIvPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGZpbGw9IiNFRDIyMjQiIGQ9Ik03Mi40LDE0NC44QzMyLjUsMTQ0LjgsMCwxMTIuMywwLDcyLjRDMCwzMi41LDMyLjUsMCw3Mi40LDBzNzIuNCwzMi41LDcyLjQsNzIuNA0KCQkJCUMxNDQuOCwxMTIuMywxMTIuMywxNDQuOCw3Mi40LDE0NC44eiBNNzIuNCw3LjNDMzYuNSw3LjMsNy4zLDM2LjUsNy4zLDcyLjRzMjkuMiw2NS4xLDY1LjEsNjUuMXM2NS4xLTI5LjIsNjUuMS02NS4xDQoJCQkJUzEwOC4zLDcuMyw3Mi40LDcuM3oiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K");
  background-repeat: no-repeat;
  background-origin: content-box;
`;

class TraktIcon extends react_1.Component {
  render() {
    return react_2.jsx("div", {
      css: [className, this.props.className]
    });
  }

}

exports.default = TraktIcon;
},{"react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/react":"cUkA"}],"ui/ConnectButton.tsx":[function(require,module,exports) {
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

const react_2 = require("@emotion/react");

let className = react_2.css`
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
const iconStyles = react_2.css`
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
    return react_2.jsx("div", {
      css: className,
      onClick: this._handleClick
    }, react_2.jsx(TraktIcon_1.default, {
      className: iconStyles
    }), react_2.jsx("div", {
      css: "text"
    }, this.state.isConnected ? "Disconnect from Trakt" : "Connect with Trakt"));
  }

}

exports.default = ConnectButton;
},{"./TraktIcon":"ui/TraktIcon.tsx","react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/react":"cUkA"}],"ui/ScrobbleInfo.tsx":[function(require,module,exports) {
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

const react_2 = require("@emotion/react");

const className = react_2.css`
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
      info = react_2.jsx("div", {
        className: "edit"
      }, react_2.jsx("div", null, "Enter the Trakt URL of the correct movie, show or episode:"), react_2.jsx("input", {
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
      }), react_2.jsx("button", {
        title: "Update",
        onClick: () => this._lookUpUrl()
      }, "Update")); // Still looking up
    } else if (this.state.scrobbleState == TraktRoller_1.TraktRollerState.Undefined || this.state.scrobbleState == TraktRoller_1.TraktRollerState.Lookup) {
      info = react_2.jsx("div", {
        className: "lookup"
      }, "Loading\u2026"); // Not found
    } else if (this.state.scrobbleState == TraktRoller_1.TraktRollerState.NotFound) {
      info = react_2.jsx("div", {
        className: "error"
      }, react_2.jsx("h2", null, "Failed to scrobble:"), react_2.jsx("p", null, "Could not find matching episode on Trakt")); // Error
    } else if (this.state.scrobbleState == TraktRoller_1.TraktRollerState.Error) {
      info = react_2.jsx("div", {
        className: "error"
      }, react_2.jsx("h2", null, "Failed to scrobble:"), react_2.jsx("p", null, this.state.error)); // Lookup succeeded
    } else if (data) {
      if (data.movie && data.movie.ids) {
        let movieUrl = `https://trakt.tv/movies/${data.movie.ids.slug}`;
        info = react_2.jsx("div", {
          className: "info"
        }, react_2.jsx("h2", null, react_2.jsx("a", {
          href: movieUrl,
          target: "_blank"
        }, data.movie.title, " (", data.movie.year, ")")));
      } else if (data.show && data.show.ids && data.episode && data.episode.ids) {
        let showUrl = `https://trakt.tv/shows/${data.show.ids.slug}`;
        let episodeUrl = `${showUrl}/seasons/${data.episode.season}/episodes/${data.episode.number}`;
        let episodeTitle = data.episode.title ? `: ${data.episode.title}` : null;
        info = react_2.jsx("div", {
          className: "info"
        }, react_2.jsx("h2", null, react_2.jsx("a", {
          href: showUrl,
          target: "_blank"
        }, data.show.title, " (", data.show.year, ")")), react_2.jsx("p", null, react_2.jsx("a", {
          href: episodeUrl,
          target: "_blank"
        }, "Season ", data.episode.season, " Episode ", data.episode.number, episodeTitle)));
      } else {
        info = react_2.jsx("div", {
          className: "error"
        }, react_2.jsx("h2", null, "Internal error:"), react_2.jsx("p", null, "Missing data"));
      }
    }

    return react_2.jsx("div", {
      css: className
    }, react_2.jsx("button", {
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
},{"../TraktRoller":"n8p7","react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/react":"cUkA"}],"ui/Button.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const react_1 = require("react");

const react_2 = require("@emotion/react");

const className = react_2.css`
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
    return react_2.jsx("button", {
      css: [className, this.props.className],
      className: this.props.disabled ? 'disabled' : '',
      onClick: this.props.onClick
    }, this.props.text);
  }

}

exports.default = Button;
},{"react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/react":"cUkA"}],"ui/ScrobbleHistory.tsx":[function(require,module,exports) {
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

const react_2 = require("@emotion/react");

const className = react_2.css`
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
        rows.push(react_2.jsx("div", null, react_2.jsx("span", null, ActionMap[item.action], " at ", this._formatter.format(new Date(item.watched_at))), react_2.jsx(Button_1.default, {
          text: "Remove",
          onClick: e => this._handleRemove(e, item)
        })));
      }

      return react_2.jsx("div", {
        css: className
      }, react_2.jsx("h2", null, "Watch History"), rows);
    } else {
      return null;
    }
  }

}

exports.default = ScrobbleHistory;
},{"../TraktScrobble":"TraktScrobble.ts","./Button":"ui/Button.tsx","react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/react":"cUkA"}],"ui/ScrobbleControl.tsx":[function(require,module,exports) {
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

const react_2 = require("@emotion/react");

const TraktScrobble_1 = require("../TraktScrobble");

const className = react_2.css`
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
const scrobbleNowStyles = react_2.css`
  color: #8e44ad;
  border: 1px solid #8e44ad;
  background: none;

  &:hover {
    background-color: #8e44ad;
    color: #fff;
  }
`;
const enableScrobbleStyles = react_2.css`
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
    return react_2.jsx("div", {
      css: className
    }, react_2.jsx("div", {
      className: "state",
      title: title
    }, state), react_2.jsx(Button_1.default, {
      className: scrobbleNowStyles,
      text: "Scrobble Now",
      onClick: this._handleScrobbleNowClick,
      disabled: disabled
    }), react_2.jsx(Button_1.default, {
      className: enableScrobbleStyles,
      text: label,
      onClick: this._handleEnableScrobbleClick
    }));
  }

}

exports.default = ScrobbleControl;
},{"./Button":"ui/Button.tsx","react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/react":"cUkA","../TraktScrobble":"TraktScrobble.ts"}],"ui/Popup.tsx":[function(require,module,exports) {
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

const react_2 = require("@emotion/react");

const className = react_2.css`
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
      history = react_2.jsx(ScrobbleHistory_1.default, {
        scrobbleData: this.state.scrobbleData,
        history: this.props.roller.history,
        key: TraktScrobble_1.default.traktIdFromData(this.state.scrobbleData)
      });
    }

    return react_2.jsx("div", {
      css: className
    }, react_2.jsx(ScrobbleInfo_1.default, {
      roller: this.props.roller
    }), history, react_2.jsx(ScrobbleControl_1.default, {
      roller: this.props.roller
    }));
  }

}

exports.default = Popup;
},{"../TraktScrobble":"TraktScrobble.ts","./ScrobbleInfo":"ui/ScrobbleInfo.tsx","./ScrobbleHistory":"ui/ScrobbleHistory.tsx","./ScrobbleControl":"ui/ScrobbleControl.tsx","react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/react":"cUkA"}],"ui/StatusButton.tsx":[function(require,module,exports) {
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

const react_2 = require("@emotion/react");

const popupClassName = react_2.css`
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
const className = react_2.css`
  position: relative;

  &:hover .popup {
    visibility: visible;
    opacity: 1;
    bottom: 44px;
  }
`;
const buttonClassName = react_2.css`
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
const iconStyles = react_2.css`
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
    return react_2.jsx("div", {
      css: className
    }, react_2.jsx("button", {
      css: buttonClassName,
      className: stateClass,
      title: title,
      onClick: this._handleClick
    }, react_2.jsx(TraktIcon_1.default, {
      className: iconStyles
    })), react_2.jsx("div", {
      css: popupClassName,
      className: "popup"
    }, react_2.jsx(Popup_1.default, {
      roller: this.props.roller
    }), react_2.jsx("div", {
      className: "hover-blocker"
    })));
  }

}

exports.default = StatusButton;
},{"./TraktIcon":"ui/TraktIcon.tsx","./Popup":"ui/Popup.tsx","react":"../node_modules/preact/compat/dist/compat.module.js","@emotion/react":"cUkA"}],"TraktHistory.ts":[function(require,module,exports) {
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

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

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
exports.CancellationError = exports.CancellationToken = exports.TraktLookupError = void 0;

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


      for (let i = 0; i < results.length && i < 7; i++) {
        const found = results[i];

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
      // Escape Solr special characters so they don't interfere with the search
      // See https://github.com/trakt/api-help/issues/76
      title = title.replace(/([+\-&|!(){}\[\]^"~*?:\/])/g, "\\$1");
      const searchResponse = yield this._client.search(type, title);

      if (TraktApi_1.default.isError(searchResponse)) {
        throw new TraktApi_1.TraktApiError(searchResponse);
      }

      return searchResponse.sort((a, b) => b.score - a.score);
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

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

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
exports.TraktRollerState = exports.RollerContext = void 0;

const TraktApi_1 = __importStar(require("./TraktApi"));

const TraktScrobble_1 = __importStar(require("./TraktScrobble"));

const ConnectButton_1 = __importDefault(require("./ui/ConnectButton"));

const StatusButton_1 = __importDefault(require("./ui/StatusButton"));

const TraktHistory_1 = __importDefault(require("./TraktHistory"));

const TraktLookup_1 = __importDefault(require("./TraktLookup"));

const react_1 = require("react");

const react_dom_1 = require("react-dom");

const react_2 = require("@emotion/react");

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
    this._data = null;
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

      let data = {};

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
          if (this._data && this._data.scrobble.episode) {
            data.episode = this._data.scrobble.episode;
          } else {
            this._error = "Missing episode information, provide the Trakt URL of an episode.";

            this._setState(TraktRollerState.Error);

            return;
          }
        }
      }

      yield this._lookup(this._createScrobbleData(data));
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
        console.log(`TraktRoller: No player found on page: ${e.message}`);
      }
    });
  }

  _playerReady() {
    if (!this._api.isAuthenticated()) return;
    if (!this._player) return;

    this._player.on(playerjs.EVENTS.TIMEUPDATE, info => this._onTimeChanged(info));

    this._player.on(playerjs.EVENTS.PLAY, () => this._onPlaybackStateChange(TraktScrobble_1.PlaybackState.Playing));

    this._player.on(playerjs.EVENTS.PAUSE, () => this._onPlaybackStateChange(TraktScrobble_1.PlaybackState.Paused));

    this._player.on(playerjs.EVENTS.ENDED, () => this._onPlaybackStateChange(TraktScrobble_1.PlaybackState.Ended));

    this._player.on(playerjs.EVENTS.ERROR, () => this._onPlaybackStateChange(TraktScrobble_1.PlaybackState.Ended));

    this._createStatusButton();

    this._data = this._website.loadData();

    if (!this._data) {
      this._error = "Could not extract scrobble data from page";

      this._setState(TraktRollerState.Error);

      return;
    }

    this._lookup(this._createScrobbleData(this._data.scrobble));
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

  _createScrobbleData(item) {
    let buildDate = new Date("2020-12-27T20:28:26.815Z");
    return Object.assign(item, {
      progress: this._getProgress(),
      app_version: "1.2.0",
      app_date: `${buildDate.getFullYear()}-${buildDate.getMonth() + 1}-${buildDate.getDate()}`
    });
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
      key: "trakt-roller",
      container: footer
    });
    react_dom_1.render(react_2.jsx(react_2.CacheProvider, {
      value: cache
    }, react_2.jsx(ConnectButton_1.default, {
      api: this._api
    })), footer);
  }

  _createStatusButton() {
    let container = this._website.getStatusButtonParent();

    if (!container) {
      console.error("TraktRoller: Could not find share row to add trakt status button");
      return;
    }

    const cache = cache_1.default({
      key: "trakt-roller",
      container: container
    });
    react_dom_1.render(react_2.jsx(react_2.CacheProvider, {
      value: cache
    }, react_2.jsx(exports.RollerContext.Provider, {
      value: this
    }, react_2.jsx(StatusButton_1.default, {
      roller: this
    }))), container);
  }

}

exports.default = TraktRoller;
},{"./TraktApi":"TraktApi.ts","./TraktScrobble":"TraktScrobble.ts","./ui/ConnectButton":"ui/ConnectButton.tsx","./ui/StatusButton":"ui/StatusButton.tsx","./TraktHistory":"TraktHistory.ts","./TraktLookup":"TraktLookup.ts","react":"../node_modules/preact/compat/dist/compat.module.js","react-dom":"../node_modules/preact/compat/dist/compat.module.js","@emotion/react":"cUkA","@emotion/cache":"hQoc","ste-simple-events":"../node_modules/ste-simple-events/dist/index.js","player.js":"../node_modules/player.js/dist/player-0.1.0.js"}],"websites/Crunchyroll.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

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

const playerjs = __importStar(require("player.js"));

const PlayerMetadataRegex = /vilos\.config\.media = (.*);$/m;
const EpisodeRegex = /Episode ([\d\.]+)/;
const SeasonRegex = /Season (\d+)/;
const MovieRegexes = [/Movie$/i, /Movie (Dub)$/i, /Movie (Sub)$/i, /Movie (Dubbed)$/i, /Movie (Subtitled)$/i, /^Movie - /i, /The Movie/i];
const DubSubSuffix = / \((?:\w+ )?(?:Dub|Dubbed|Sub|Subbed|Subtitled)\)/;

class Crunchyroll {
  loadPlayer() {
    return __awaiter(this, void 0, void 0, function* () {
      let player = document.getElementById('vilos-player');

      if (!player) {
        const container = document.getElementById('showmedia_video_player');

        if (!container) {
          throw new Error('Current page doesn\'t appear to be a video page ("#showmedia_video_player" container is missing)');
        } // The player iframe hasn't been created yet, wait for it to appear


        console.log("TraktRoller: Waiting for player iframe to be added to container...");
        yield new Promise(resolve => {
          const observer = new MutationObserver((mutationList, observer) => {
            player = document.getElementById('vilos-player');

            if (player) {
              observer.disconnect();
              resolve();
            }
          });
          observer.observe(container, {
            childList: true
          });
        });
      }

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

  loadPlayerMetadata() {
    const playerBox = document.querySelector('#showmedia_video_box, #showmedia_video_box_wide');

    if (!playerBox) {
      console.error("TraktRoller: Could not find #showmedia_video_box element");
      return null;
    }

    let match = null;
    const scripts = Array.from(playerBox.querySelectorAll('script')).filter(s => s.src == "" && s.type == "");

    for (let script of scripts) {
      match = PlayerMetadataRegex.exec(script.innerText);
      if (match) break;
    }

    if (!match) {
      console.error(`TraktRoller: Could not find player initialization inline script`);
      return null;
    }

    let metadata;

    try {
      metadata = JSON.parse(match[1]);
    } catch (e) {
      console.error(`TraktRoller: Error parsing player metadata: ${e}`);
      return null;
    }

    if (!metadata.metadata || !metadata.metadata.id || !metadata.metadata.series_id || !metadata.metadata.type || metadata.metadata.title === undefined || metadata.metadata.episode_number === undefined) {
      console.error(`TraktRoller: Incomplete player metadata:`, metadata);
      return null;
    }

    return metadata;
  }

  loadLinkedData() {
    const linkedData = Array.from(document.getElementsByTagName('script')).filter(s => s.type == "application/ld+json" && s.innerText.indexOf('seasonNumber') >= 0);

    if (linkedData.length != 1) {
      console.error(`TraktRoller: Could not find JSON-LD script (${linkedData.length})`);
      return null;
    }

    let metadata;

    try {
      metadata = JSON.parse(linkedData[0].innerText);
    } catch (e) {
      console.error(`TraktRoller: Error parsing JSON-LD metadata: ${e}`);
      return null;
    }

    if (!metadata.partOfSeason || !metadata.partOfSeason.name || !metadata.partOfSeason.seasonNumber || !metadata.partOfSeries || !metadata.partOfSeries.name) {
      console.error(`TraktRoller: Incomplete JSON-lD metadata:`, metadata);
      return null;
    }

    return metadata;
  }

  loadDataFromJson() {
    let playerMetadata = this.loadPlayerMetadata();
    let linkedMetadata = this.loadLinkedData();
    if (!playerMetadata || !linkedMetadata) return null;
    const data = {
      id: null,
      series_id: null,
      season_id: null,
      scrobble: {}
    };

    if (playerMetadata.metadata.type == "movie" || playerMetadata.metadata.episode_number == "" || playerMetadata.metadata.episode_number == "Movie" || MovieRegexes.some(r => r.test(playerMetadata.metadata.title))) {
      data.id = playerMetadata.metadata.id;
      data.scrobble.movie = {
        title: linkedMetadata.partOfSeason.name.replace(DubSubSuffix, '')
      };
    } else {
      data.id = playerMetadata.metadata.id;
      data.series_id = playerMetadata.metadata.id;
      data.scrobble.show = {
        title: linkedMetadata.partOfSeries.name
      };
      data.scrobble.episode = {
        season: parseFloat(linkedMetadata.partOfSeason.seasonNumber) || 1,
        number: parseFloat(playerMetadata.metadata.episode_number),
        title: playerMetadata.metadata.title.replace(DubSubSuffix, '')
      };
    }

    return data;
  }

  loadDataFromDom() {
    const data = {
      id: null,
      series_id: null,
      season_id: null,
      scrobble: {}
    };
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
      data.scrobble.movie = {
        title: showTitle
      };
    } else {
      data.scrobble.show = {
        title: showTitle
      };
      data.scrobble.episode = {
        season: seasonNumber,
        number: episodeNumber,
        title: episodeTitle
      };
    }

    return data;
  }

  loadData() {
    let jsonData = this.loadDataFromJson();
    let domData = this.loadDataFromDom();

    if (JSON.stringify(jsonData === null || jsonData === void 0 ? void 0 : jsonData.scrobble) != JSON.stringify(domData === null || domData === void 0 ? void 0 : domData.scrobble)) {
      console.warn(`TraktRoller: Dom and Json data do not match`, jsonData, domData);
    }

    return jsonData;
  }

}

exports.default = Crunchyroll;
},{"player.js":"../node_modules/player.js/dist/player-0.1.0.js"}],"websites/Funimation.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

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
    const footer = document.querySelector('.social-media');
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

  loadData() {
    const data = {
      id: null,
      series_id: null,
      season_id: null,
      scrobble: {}
    };
    let titleData = unsafeWindow['TITLE_DATA'];
    let kaneData = unsafeWindow['KANE_customdimensions'];

    if (!titleData || !kaneData) {
      console.error(`TraktRoller: Either TITLE_DATA or KANE_customdimensions not defined:`, titleData, kaneData);
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
      if (!titleData.title || !titleData.id) {
        console.error(`TraktRoller: Missing title or id in data`, titleData);
        return null;
      }

      data.id = titleData.id;
      data.scrobble.movie = {
        title: kaneData.showName,
        year: year
      };
    } else if (kaneData.videoType == 'Episode') {
      if (!kaneData.showName || !titleData.seasonNum || !titleData.episodeNum || !titleData.id || !titleData.seriesId) {
        console.error(`TraktRoller: Missing website data`, kaneData, titleData);
        return null;
      }

      data.id = titleData.id;
      data.series_id = titleData.seriesId;
      data.scrobble.show = {
        title: this._unescape(kaneData.showName),
        year: year
      };
      data.scrobble.episode = {
        season: titleData.seasonNum,
        number: titleData.episodeNum,
        title: this._unescape(titleData.title)
      };
    } else {
      console.error(`TraktRoller: Unknown KANE video type: ${kaneData.videoType}`);
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
  if (unsafeWindow.videojs) {
    Funimation_1.default.createPlayerAdapter(unsafeWindow.videojs);
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