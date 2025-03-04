/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 * @nolint
 * @preventMunge
 * @generated SignedSource<<0aa534c810fde3c5289b4c849e474d9e>>
 */

'use strict';

if (__DEV__) {
  (function() {
"use strict";

var React = require("react");
require("react-native/Libraries/ReactPrivate/ReactNativePrivateInitializeCore");
var ReactNativePrivateInterface = require("react-native/Libraries/ReactPrivate/ReactNativePrivateInterface");
var dynamicFlags = require("ReactNativeInternalFeatureFlags");
var Scheduler = require("scheduler");

var ReactSharedInternals =
  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

// by calls to these methods by a Babel plugin.
//
// In PROD (or in packages without access to React internals),
// they are left as they are instead.

function warn(format) {
  {
    {
      for (
        var _len = arguments.length,
          args = new Array(_len > 1 ? _len - 1 : 0),
          _key = 1;
        _key < _len;
        _key++
      ) {
        args[_key - 1] = arguments[_key];
      }

      printWarning("warn", format, args);
    }
  }
}
function error(format) {
  {
    {
      for (
        var _len2 = arguments.length,
          args = new Array(_len2 > 1 ? _len2 - 1 : 0),
          _key2 = 1;
        _key2 < _len2;
        _key2++
      ) {
        args[_key2 - 1] = arguments[_key2];
      }

      printWarning("error", format, args);
    }
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();

    if (stack !== "") {
      format += "%s";
      args = args.concat([stack]);
    }

    var argsWithFormat = args.map(function(item) {
      return "" + item;
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift("Warning: " + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);
  }
}

function invokeGuardedCallbackProd(name, func, context, a, b, c, d, e, f) {
  var funcArgs = Array.prototype.slice.call(arguments, 3);

  try {
    func.apply(context, funcArgs);
  } catch (error) {
    this.onError(error);
  }
}

var invokeGuardedCallbackImpl = invokeGuardedCallbackProd;

{
  // In DEV mode, we swap out invokeGuardedCallback for a special version
  // that plays more nicely with the browser's DevTools. The idea is to preserve
  // "Pause on exceptions" behavior. Because React wraps all user-provided
  // functions in invokeGuardedCallback, and the production version of
  // invokeGuardedCallback uses a try-catch, all user exceptions are treated
  // like caught exceptions, and the DevTools won't pause unless the developer
  // takes the extra step of enabling pause on caught exceptions. This is
  // unintuitive, though, because even though React has caught the error, from
  // the developer's perspective, the error is uncaught.
  //
  // To preserve the expected "Pause on exceptions" behavior, we don't use a
  // try-catch in DEV. Instead, we synchronously dispatch a fake event to a fake
  // DOM node, and call the user-provided callback from inside an event handler
  // for that fake event. If the callback throws, the error is "captured" using
  // a global event handler. But because the error happens in a different
  // event loop context, it does not interrupt the normal program flow.
  // Effectively, this gives us try-catch behavior without actually using
  // try-catch. Neat!
  // Check that the browser supports the APIs we need to implement our special
  // DEV version of invokeGuardedCallback
  if (
    typeof window !== "undefined" &&
    typeof window.dispatchEvent === "function" &&
    typeof document !== "undefined" &&
    typeof document.createEvent === "function"
  ) {
    var fakeNode = document.createElement("react");

    invokeGuardedCallbackImpl = function invokeGuardedCallbackDev(
      name,
      func,
      context,
      a,
      b,
      c,
      d,
      e,
      f
    ) {
      // If document doesn't exist we know for sure we will crash in this method
      // when we call document.createEvent(). However this can cause confusing
      // errors: https://github.com/facebook/create-react-app/issues/3482
      // So we preemptively throw with a better message instead.
      if (!(typeof document !== "undefined")) {
        throw Error(
          "The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous."
        );
      }

      var evt = document.createEvent("Event");
      var didCall = false; // Keeps track of whether the user-provided callback threw an error. We
      // set this to true at the beginning, then set it to false right after
      // calling the function. If the function errors, `didError` will never be
      // set to false. This strategy works even if the browser is flaky and
      // fails to call our global error handler, because it doesn't rely on
      // the error event at all.

      var didError = true; // Keeps track of the value of window.event so that we can reset it
      // during the callback to let user code access window.event in the
      // browsers that support it.

      var windowEvent = window.event; // Keeps track of the descriptor of window.event to restore it after event
      // dispatching: https://github.com/facebook/react/issues/13688

      var windowEventDescriptor = Object.getOwnPropertyDescriptor(
        window,
        "event"
      );

      function restoreAfterDispatch() {
        // We immediately remove the callback from event listeners so that
        // nested `invokeGuardedCallback` calls do not clash. Otherwise, a
        // nested call would trigger the fake event handlers of any call higher
        // in the stack.
        fakeNode.removeEventListener(evtType, callCallback, false); // We check for window.hasOwnProperty('event') to prevent the
        // window.event assignment in both IE <= 10 as they throw an error
        // "Member not found" in strict mode, and in Firefox which does not
        // support window.event.

        if (
          typeof window.event !== "undefined" &&
          window.hasOwnProperty("event")
        ) {
          window.event = windowEvent;
        }
      } // Create an event handler for our fake event. We will synchronously
      // dispatch our fake event using `dispatchEvent`. Inside the handler, we
      // call the user-provided callback.

      var funcArgs = Array.prototype.slice.call(arguments, 3);

      function callCallback() {
        didCall = true;
        restoreAfterDispatch();
        func.apply(context, funcArgs);
        didError = false;
      } // Create a global error event handler. We use this to capture the value
      // that was thrown. It's possible that this error handler will fire more
      // than once; for example, if non-React code also calls `dispatchEvent`
      // and a handler for that event throws. We should be resilient to most of
      // those cases. Even if our error event handler fires more than once, the
      // last error event is always used. If the callback actually does error,
      // we know that the last error event is the correct one, because it's not
      // possible for anything else to have happened in between our callback
      // erroring and the code that follows the `dispatchEvent` call below. If
      // the callback doesn't error, but the error event was fired, we know to
      // ignore it because `didError` will be false, as described above.

      var error; // Use this to track whether the error event is ever called.

      var didSetError = false;
      var isCrossOriginError = false;

      function handleWindowError(event) {
        error = event.error;
        didSetError = true;

        if (error === null && event.colno === 0 && event.lineno === 0) {
          isCrossOriginError = true;
        }

        if (event.defaultPrevented) {
          // Some other error handler has prevented default.
          // Browsers silence the error report if this happens.
          // We'll remember this to later decide whether to log it or not.
          if (error != null && typeof error === "object") {
            try {
              error._suppressLogging = true;
            } catch (inner) {
              // Ignore.
            }
          }
        }
      } // Create a fake event type.

      var evtType = "react-" + (name ? name : "invokeguardedcallback"); // Attach our event handlers

      window.addEventListener("error", handleWindowError);
      fakeNode.addEventListener(evtType, callCallback, false); // Synchronously dispatch our fake event. If the user-provided function
      // errors, it will trigger our global error handler.

      evt.initEvent(evtType, false, false);
      fakeNode.dispatchEvent(evt);

      if (windowEventDescriptor) {
        Object.defineProperty(window, "event", windowEventDescriptor);
      }

      if (didCall && didError) {
        if (!didSetError) {
          // The callback errored, but the error event never fired.
          error = new Error(
            "An error was thrown inside one of your components, but React " +
              "doesn't know what it was. This is likely due to browser " +
              'flakiness. React does its best to preserve the "Pause on ' +
              'exceptions" behavior of the DevTools, which requires some ' +
              "DEV-mode only tricks. It's possible that these don't work in " +
              "your browser. Try triggering the error in production mode, " +
              "or switching to a modern browser. If you suspect that this is " +
              "actually an issue with React, please file an issue."
          );
        } else if (isCrossOriginError) {
          error = new Error(
            "A cross-origin error was thrown. React doesn't have access to " +
              "the actual error object in development. " +
              "See https://reactjs.org/link/crossorigin-error for more information."
          );
        }

        this.onError(error);
      } // Remove our event listeners

      window.removeEventListener("error", handleWindowError);

      if (!didCall) {
        // Something went really wrong, and our event was not dispatched.
        // https://github.com/facebook/react/issues/16734
        // https://github.com/facebook/react/issues/16585
        // Fall back to the production implementation.
        restoreAfterDispatch();
        return invokeGuardedCallbackProd.apply(this, arguments);
      }
    };
  }
}

var invokeGuardedCallbackImpl$1 = invokeGuardedCallbackImpl;

var hasError = false;
var caughtError = null; // Used by event system to capture/rethrow the first error.

var hasRethrowError = false;
var rethrowError = null;
var reporter = {
  onError: function(error) {
    hasError = true;
    caughtError = error;
  }
};
/**
 * Call a function while guarding against errors that happens within it.
 * Returns an error if it throws, otherwise null.
 *
 * In production, this is implemented using a try-catch. The reason we don't
 * use a try-catch directly is so that we can swap out a different
 * implementation in DEV mode.
 *
 * @param {String} name of the guard to use for logging or debugging
 * @param {Function} func The function to invoke
 * @param {*} context The context to use when calling the function
 * @param {...*} args Arguments for function
 */

function invokeGuardedCallback(name, func, context, a, b, c, d, e, f) {
  hasError = false;
  caughtError = null;
  invokeGuardedCallbackImpl$1.apply(reporter, arguments);
}
/**
 * Same as invokeGuardedCallback, but instead of returning an error, it stores
 * it in a global so it can be rethrown by `rethrowCaughtError` later.
 * TODO: See if caughtError and rethrowError can be unified.
 *
 * @param {String} name of the guard to use for logging or debugging
 * @param {Function} func The function to invoke
 * @param {*} context The context to use when calling the function
 * @param {...*} args Arguments for function
 */

function invokeGuardedCallbackAndCatchFirstError(
  name,
  func,
  context,
  a,
  b,
  c,
  d,
  e,
  f
) {
  invokeGuardedCallback.apply(this, arguments);

  if (hasError) {
    var error = clearCaughtError();

    if (!hasRethrowError) {
      hasRethrowError = true;
      rethrowError = error;
    }
  }
}
/**
 * During execution of guarded functions we will capture the first error which
 * we will rethrow to be handled by the top level error handler.
 */

function rethrowCaughtError() {
  if (hasRethrowError) {
    var error = rethrowError;
    hasRethrowError = false;
    rethrowError = null;
    throw error;
  }
}
function hasCaughtError() {
  return hasError;
}
function clearCaughtError() {
  if (hasError) {
    var error = caughtError;
    hasError = false;
    caughtError = null;
    return error;
  } else {
    {
      throw Error(
        "clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue."
      );
    }
  }
}

var isArrayImpl = Array.isArray; // eslint-disable-next-line no-redeclare

function isArray(a) {
  return isArrayImpl(a);
}

var getFiberCurrentPropsFromNode = null;
var getInstanceFromNode = null;
var getNodeFromInstance = null;
function setComponentTree(
  getFiberCurrentPropsFromNodeImpl,
  getInstanceFromNodeImpl,
  getNodeFromInstanceImpl
) {
  getFiberCurrentPropsFromNode = getFiberCurrentPropsFromNodeImpl;
  getInstanceFromNode = getInstanceFromNodeImpl;
  getNodeFromInstance = getNodeFromInstanceImpl;

  {
    if (!getNodeFromInstance || !getInstanceFromNode) {
      error(
        "EventPluginUtils.setComponentTree(...): Injected " +
          "module is missing getNodeFromInstance or getInstanceFromNode."
      );
    }
  }
}
var validateEventDispatches;

{
  validateEventDispatches = function(event) {
    var dispatchListeners = event._dispatchListeners;
    var dispatchInstances = event._dispatchInstances;
    var listenersIsArr = isArray(dispatchListeners);
    var listenersLen = listenersIsArr
      ? dispatchListeners.length
      : dispatchListeners
      ? 1
      : 0;
    var instancesIsArr = isArray(dispatchInstances);
    var instancesLen = instancesIsArr
      ? dispatchInstances.length
      : dispatchInstances
      ? 1
      : 0;

    if (instancesIsArr !== listenersIsArr || instancesLen !== listenersLen) {
      error("EventPluginUtils: Invalid `event`.");
    }
  };
}
/**
 * Dispatch the event to the listener.
 * @param {SyntheticEvent} event SyntheticEvent to handle
 * @param {function} listener Application-level callback
 * @param {*} inst Internal component instance
 */

function executeDispatch(event, listener, inst) {
  var type = event.type || "unknown-event";
  event.currentTarget = getNodeFromInstance(inst);
  invokeGuardedCallbackAndCatchFirstError(type, listener, undefined, event);
  event.currentTarget = null;
}
/**
 * Standard/simple iteration through an event's collected dispatches.
 */

function executeDispatchesInOrder(event) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchInstances = event._dispatchInstances;

  {
    validateEventDispatches(event);
  }

  if (isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      } // Listeners and Instances are two parallel arrays that are always in sync.

      executeDispatch(event, dispatchListeners[i], dispatchInstances[i]);
    }
  } else if (dispatchListeners) {
    executeDispatch(event, dispatchListeners, dispatchInstances);
  }

  event._dispatchListeners = null;
  event._dispatchInstances = null;
}
/**
 * Standard/simple iteration through an event's collected dispatches, but stops
 * at the first dispatch execution returning true, and returns that id.
 *
 * @return {?string} id of the first dispatch execution who's listener returns
 * true, or null if no listener returned true.
 */

function executeDispatchesInOrderStopAtTrueImpl(event) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchInstances = event._dispatchInstances;

  {
    validateEventDispatches(event);
  }

  if (isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      } // Listeners and Instances are two parallel arrays that are always in sync.

      if (dispatchListeners[i](event, dispatchInstances[i])) {
        return dispatchInstances[i];
      }
    }
  } else if (dispatchListeners) {
    if (dispatchListeners(event, dispatchInstances)) {
      return dispatchInstances;
    }
  }

  return null;
}
/**
 * @see executeDispatchesInOrderStopAtTrueImpl
 */

function executeDispatchesInOrderStopAtTrue(event) {
  var ret = executeDispatchesInOrderStopAtTrueImpl(event);
  event._dispatchInstances = null;
  event._dispatchListeners = null;
  return ret;
}
/**
 * Execution of a "direct" dispatch - there must be at most one dispatch
 * accumulated on the event or it is considered an error. It doesn't really make
 * sense for an event with multiple dispatches (bubbled) to keep track of the
 * return values at each dispatch execution, but it does tend to make sense when
 * dealing with "direct" dispatches.
 *
 * @return {*} The return value of executing the single dispatch.
 */

function executeDirectDispatch(event) {
  {
    validateEventDispatches(event);
  }

  var dispatchListener = event._dispatchListeners;
  var dispatchInstance = event._dispatchInstances;

  if (!!isArray(dispatchListener)) {
    throw Error("executeDirectDispatch(...): Invalid `event`.");
  }

  event.currentTarget = dispatchListener
    ? getNodeFromInstance(dispatchInstance)
    : null;
  var res = dispatchListener ? dispatchListener(event) : null;
  event.currentTarget = null;
  event._dispatchListeners = null;
  event._dispatchInstances = null;
  return res;
}
/**
 * @param {SyntheticEvent} event
 * @return {boolean} True iff number of dispatches accumulated is greater than 0.
 */

function hasDispatches(event) {
  return !!event._dispatchListeners;
}

var EVENT_POOL_SIZE = 10;
/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */

var EventInterface = {
  type: null,
  target: null,
  // currentTarget is set when dispatching; no use in copying it here
  currentTarget: function() {
    return null;
  },
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  timeStamp: function(event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: null,
  isTrusted: null
};

function functionThatReturnsTrue() {
  return true;
}

function functionThatReturnsFalse() {
  return false;
}
/**
 * Synthetic events are dispatched by event plugins, typically in response to a
 * top-level event delegation handler.
 *
 * These systems should generally use pooling to reduce the frequency of garbage
 * collection. The system should check `isPersistent` to determine whether the
 * event should be released into the pool after being dispatched. Users that
 * need a persisted event should invoke `persist`.
 *
 * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
 * normalizing browser quirks. Subclasses do not necessarily have to implement a
 * DOM interface; custom application-specific events can also subclass this.
 *
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {*} targetInst Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @param {DOMEventTarget} nativeEventTarget Target node.
 */

function SyntheticEvent(
  dispatchConfig,
  targetInst,
  nativeEvent,
  nativeEventTarget
) {
  {
    // these have a getter/setter for warnings
    delete this.nativeEvent;
    delete this.preventDefault;
    delete this.stopPropagation;
    delete this.isDefaultPrevented;
    delete this.isPropagationStopped;
  }

  this.dispatchConfig = dispatchConfig;
  this._targetInst = targetInst;
  this.nativeEvent = nativeEvent;
  this._dispatchListeners = null;
  this._dispatchInstances = null;
  var Interface = this.constructor.Interface;

  for (var propName in Interface) {
    if (!Interface.hasOwnProperty(propName)) {
      continue;
    }

    {
      delete this[propName]; // this has a getter/setter for warnings
    }

    var normalize = Interface[propName];

    if (normalize) {
      this[propName] = normalize(nativeEvent);
    } else {
      if (propName === "target") {
        this.target = nativeEventTarget;
      } else {
        this[propName] = nativeEvent[propName];
      }
    }
  }

  var defaultPrevented =
    nativeEvent.defaultPrevented != null
      ? nativeEvent.defaultPrevented
      : nativeEvent.returnValue === false;

  if (defaultPrevented) {
    this.isDefaultPrevented = functionThatReturnsTrue;
  } else {
    this.isDefaultPrevented = functionThatReturnsFalse;
  }

  this.isPropagationStopped = functionThatReturnsFalse;
  return this;
}

Object.assign(SyntheticEvent.prototype, {
  preventDefault: function() {
    this.defaultPrevented = true;
    var event = this.nativeEvent;

    if (!event) {
      return;
    }

    if (event.preventDefault) {
      event.preventDefault();
    } else if (typeof event.returnValue !== "unknown") {
      event.returnValue = false;
    }

    this.isDefaultPrevented = functionThatReturnsTrue;
  },
  stopPropagation: function() {
    var event = this.nativeEvent;

    if (!event) {
      return;
    }

    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (typeof event.cancelBubble !== "unknown") {
      // The ChangeEventPlugin registers a "propertychange" event for
      // IE. This event does not support bubbling or cancelling, and
      // any references to cancelBubble throw "Member not found".  A
      // typeof check of "unknown" circumvents this issue (and is also
      // IE specific).
      event.cancelBubble = true;
    }

    this.isPropagationStopped = functionThatReturnsTrue;
  },

  /**
   * We release all dispatched `SyntheticEvent`s after each event loop, adding
   * them back into the pool. This allows a way to hold onto a reference that
   * won't be added back into the pool.
   */
  persist: function() {
    this.isPersistent = functionThatReturnsTrue;
  },

  /**
   * Checks if this event should be released back into the pool.
   *
   * @return {boolean} True if this should not be released, false otherwise.
   */
  isPersistent: functionThatReturnsFalse,

  /**
   * `PooledClass` looks for `destructor` on each instance it releases.
   */
  destructor: function() {
    var Interface = this.constructor.Interface;

    for (var propName in Interface) {
      {
        Object.defineProperty(
          this,
          propName,
          getPooledWarningPropertyDefinition(propName, Interface[propName])
        );
      }
    }

    this.dispatchConfig = null;
    this._targetInst = null;
    this.nativeEvent = null;
    this.isDefaultPrevented = functionThatReturnsFalse;
    this.isPropagationStopped = functionThatReturnsFalse;
    this._dispatchListeners = null;
    this._dispatchInstances = null;

    {
      Object.defineProperty(
        this,
        "nativeEvent",
        getPooledWarningPropertyDefinition("nativeEvent", null)
      );
      Object.defineProperty(
        this,
        "isDefaultPrevented",
        getPooledWarningPropertyDefinition(
          "isDefaultPrevented",
          functionThatReturnsFalse
        )
      );
      Object.defineProperty(
        this,
        "isPropagationStopped",
        getPooledWarningPropertyDefinition(
          "isPropagationStopped",
          functionThatReturnsFalse
        )
      );
      Object.defineProperty(
        this,
        "preventDefault",
        getPooledWarningPropertyDefinition("preventDefault", function() {})
      );
      Object.defineProperty(
        this,
        "stopPropagation",
        getPooledWarningPropertyDefinition("stopPropagation", function() {})
      );
    }
  }
});
SyntheticEvent.Interface = EventInterface;
/**
 * Helper to reduce boilerplate when creating subclasses.
 */

SyntheticEvent.extend = function(Interface) {
  var Super = this;

  var E = function() {};

  E.prototype = Super.prototype;
  var prototype = new E();

  function Class() {
    return Super.apply(this, arguments);
  }

  Object.assign(prototype, Class.prototype);
  Class.prototype = prototype;
  Class.prototype.constructor = Class;
  Class.Interface = Object.assign({}, Super.Interface, Interface);
  Class.extend = Super.extend;
  addEventPoolingTo(Class);
  return Class;
};

addEventPoolingTo(SyntheticEvent);
/**
 * Helper to nullify syntheticEvent instance properties when destructing
 *
 * @param {String} propName
 * @param {?object} getVal
 * @return {object} defineProperty object
 */

function getPooledWarningPropertyDefinition(propName, getVal) {
  function set(val) {
    var action = isFunction ? "setting the method" : "setting the property";
    warn(action, "This is effectively a no-op");
    return val;
  }

  function get() {
    var action = isFunction ? "accessing the method" : "accessing the property";
    var result = isFunction
      ? "This is a no-op function"
      : "This is set to null";
    warn(action, result);
    return getVal;
  }

  function warn(action, result) {
    {
      error(
        "This synthetic event is reused for performance reasons. If you're seeing this, " +
          "you're %s `%s` on a released/nullified synthetic event. %s. " +
          "If you must keep the original synthetic event around, use event.persist(). " +
          "See https://reactjs.org/link/event-pooling for more information.",
        action,
        propName,
        result
      );
    }
  }

  var isFunction = typeof getVal === "function";
  return {
    configurable: true,
    set: set,
    get: get
  };
}

function createOrGetPooledEvent(
  dispatchConfig,
  targetInst,
  nativeEvent,
  nativeInst
) {
  var EventConstructor = this;

  if (EventConstructor.eventPool.length) {
    var instance = EventConstructor.eventPool.pop();
    EventConstructor.call(
      instance,
      dispatchConfig,
      targetInst,
      nativeEvent,
      nativeInst
    );
    return instance;
  }

  return new EventConstructor(
    dispatchConfig,
    targetInst,
    nativeEvent,
    nativeInst
  );
}

function releasePooledEvent(event) {
  var EventConstructor = this;

  if (!(event instanceof EventConstructor)) {
    throw Error(
      "Trying to release an event instance into a pool of a different type."
    );
  }

  event.destructor();

  if (EventConstructor.eventPool.length < EVENT_POOL_SIZE) {
    EventConstructor.eventPool.push(event);
  }
}

function addEventPoolingTo(EventConstructor) {
  EventConstructor.getPooled = createOrGetPooledEvent;
  EventConstructor.eventPool = [];
  EventConstructor.release = releasePooledEvent;
}

/**
 * `touchHistory` isn't actually on the native event, but putting it in the
 * interface will ensure that it is cleaned up when pooled/destroyed. The
 * `ResponderEventPlugin` will populate it appropriately.
 */

var ResponderSyntheticEvent = SyntheticEvent.extend({
  touchHistory: function(nativeEvent) {
    return null; // Actually doesn't even look at the native event.
  }
});

var TOP_TOUCH_START = "topTouchStart";
var TOP_TOUCH_MOVE = "topTouchMove";
var TOP_TOUCH_END = "topTouchEnd";
var TOP_TOUCH_CANCEL = "topTouchCancel";
var TOP_SCROLL = "topScroll";
var TOP_SELECTION_CHANGE = "topSelectionChange";
function isStartish(topLevelType) {
  return topLevelType === TOP_TOUCH_START;
}
function isMoveish(topLevelType) {
  return topLevelType === TOP_TOUCH_MOVE;
}
function isEndish(topLevelType) {
  return topLevelType === TOP_TOUCH_END || topLevelType === TOP_TOUCH_CANCEL;
}
var startDependencies = [TOP_TOUCH_START];
var moveDependencies = [TOP_TOUCH_MOVE];
var endDependencies = [TOP_TOUCH_CANCEL, TOP_TOUCH_END];

/**
 * Tracks the position and time of each active touch by `touch.identifier`. We
 * should typically only see IDs in the range of 1-20 because IDs get recycled
 * when touches end and start again.
 */

var MAX_TOUCH_BANK = 20;
var touchBank = [];
var touchHistory = {
  touchBank: touchBank,
  numberActiveTouches: 0,
  // If there is only one active touch, we remember its location. This prevents
  // us having to loop through all of the touches all the time in the most
  // common case.
  indexOfSingleActiveTouch: -1,
  mostRecentTimeStamp: 0
};

function timestampForTouch(touch) {
  // The legacy internal implementation provides "timeStamp", which has been
  // renamed to "timestamp". Let both work for now while we iron it out
  // TODO (evv): rename timeStamp to timestamp in internal code
  return touch.timeStamp || touch.timestamp;
}
/**
 * TODO: Instead of making gestures recompute filtered velocity, we could
 * include a built in velocity computation that can be reused globally.
 */

function createTouchRecord(touch) {
  return {
    touchActive: true,
    startPageX: touch.pageX,
    startPageY: touch.pageY,
    startTimeStamp: timestampForTouch(touch),
    currentPageX: touch.pageX,
    currentPageY: touch.pageY,
    currentTimeStamp: timestampForTouch(touch),
    previousPageX: touch.pageX,
    previousPageY: touch.pageY,
    previousTimeStamp: timestampForTouch(touch)
  };
}

function resetTouchRecord(touchRecord, touch) {
  touchRecord.touchActive = true;
  touchRecord.startPageX = touch.pageX;
  touchRecord.startPageY = touch.pageY;
  touchRecord.startTimeStamp = timestampForTouch(touch);
  touchRecord.currentPageX = touch.pageX;
  touchRecord.currentPageY = touch.pageY;
  touchRecord.currentTimeStamp = timestampForTouch(touch);
  touchRecord.previousPageX = touch.pageX;
  touchRecord.previousPageY = touch.pageY;
  touchRecord.previousTimeStamp = timestampForTouch(touch);
}

function getTouchIdentifier(_ref) {
  var identifier = _ref.identifier;

  if (!(identifier != null)) {
    throw Error("Touch object is missing identifier.");
  }

  {
    if (identifier > MAX_TOUCH_BANK) {
      error(
        "Touch identifier %s is greater than maximum supported %s which causes " +
          "performance issues backfilling array locations for all of the indices.",
        identifier,
        MAX_TOUCH_BANK
      );
    }
  }

  return identifier;
}

function recordTouchStart(touch) {
  var identifier = getTouchIdentifier(touch);
  var touchRecord = touchBank[identifier];

  if (touchRecord) {
    resetTouchRecord(touchRecord, touch);
  } else {
    touchBank[identifier] = createTouchRecord(touch);
  }

  touchHistory.mostRecentTimeStamp = timestampForTouch(touch);
}

function recordTouchMove(touch) {
  var touchRecord = touchBank[getTouchIdentifier(touch)];

  if (touchRecord) {
    touchRecord.touchActive = true;
    touchRecord.previousPageX = touchRecord.currentPageX;
    touchRecord.previousPageY = touchRecord.currentPageY;
    touchRecord.previousTimeStamp = touchRecord.currentTimeStamp;
    touchRecord.currentPageX = touch.pageX;
    touchRecord.currentPageY = touch.pageY;
    touchRecord.currentTimeStamp = timestampForTouch(touch);
    touchHistory.mostRecentTimeStamp = timestampForTouch(touch);
  } else {
    {
      warn(
        "Cannot record touch move without a touch start.\n" +
          "Touch Move: %s\n" +
          "Touch Bank: %s",
        printTouch(touch),
        printTouchBank()
      );
    }
  }
}

function recordTouchEnd(touch) {
  var touchRecord = touchBank[getTouchIdentifier(touch)];

  if (touchRecord) {
    touchRecord.touchActive = false;
    touchRecord.previousPageX = touchRecord.currentPageX;
    touchRecord.previousPageY = touchRecord.currentPageY;
    touchRecord.previousTimeStamp = touchRecord.currentTimeStamp;
    touchRecord.currentPageX = touch.pageX;
    touchRecord.currentPageY = touch.pageY;
    touchRecord.currentTimeStamp = timestampForTouch(touch);
    touchHistory.mostRecentTimeStamp = timestampForTouch(touch);
  } else {
    {
      warn(
        "Cannot record touch end without a touch start.\n" +
          "Touch End: %s\n" +
          "Touch Bank: %s",
        printTouch(touch),
        printTouchBank()
      );
    }
  }
}

function printTouch(touch) {
  return JSON.stringify({
    identifier: touch.identifier,
    pageX: touch.pageX,
    pageY: touch.pageY,
    timestamp: timestampForTouch(touch)
  });
}

function printTouchBank() {
  var printed = JSON.stringify(touchBank.slice(0, MAX_TOUCH_BANK));

  if (touchBank.length > MAX_TOUCH_BANK) {
    printed += " (original size: " + touchBank.length + ")";
  }

  return printed;
}

var instrumentationCallback;
var ResponderTouchHistoryStore = {
  /**
   * Registers a listener which can be used to instrument every touch event.
   */
  instrument: function(callback) {
    instrumentationCallback = callback;
  },
  recordTouchTrack: function(topLevelType, nativeEvent) {
    if (instrumentationCallback != null) {
      instrumentationCallback(topLevelType, nativeEvent);
    }

    if (isMoveish(topLevelType)) {
      nativeEvent.changedTouches.forEach(recordTouchMove);
    } else if (isStartish(topLevelType)) {
      nativeEvent.changedTouches.forEach(recordTouchStart);
      touchHistory.numberActiveTouches = nativeEvent.touches.length;

      if (touchHistory.numberActiveTouches === 1) {
        touchHistory.indexOfSingleActiveTouch =
          nativeEvent.touches[0].identifier;
      }
    } else if (isEndish(topLevelType)) {
      nativeEvent.changedTouches.forEach(recordTouchEnd);
      touchHistory.numberActiveTouches = nativeEvent.touches.length;

      if (touchHistory.numberActiveTouches === 1) {
        for (var i = 0; i < touchBank.length; i++) {
          var touchTrackToCheck = touchBank[i];

          if (touchTrackToCheck != null && touchTrackToCheck.touchActive) {
            touchHistory.indexOfSingleActiveTouch = i;
            break;
          }
        }

        {
          var activeRecord = touchBank[touchHistory.indexOfSingleActiveTouch];

          if (activeRecord == null || !activeRecord.touchActive) {
            error("Cannot find single active touch.");
          }
        }
      }
    }
  },
  touchHistory: touchHistory
};

/**
 * Accumulates items that must not be null or undefined.
 *
 * This is used to conserve memory by avoiding array allocations.
 *
 * @return {*|array<*>} An accumulation of items.
 */

function accumulate(current, next) {
  if (!(next != null)) {
    throw Error(
      "accumulate(...): Accumulated items must not be null or undefined."
    );
  }

  if (current == null) {
    return next;
  } // Both are not empty. Warning: Never call x.concat(y) when you are not
  // certain that x is an Array (x could be a string with concat method).

  if (isArray(current)) {
    return current.concat(next);
  }

  if (isArray(next)) {
    return [current].concat(next);
  }

  return [current, next];
}

/**
 * Accumulates items that must not be null or undefined into the first one. This
 * is used to conserve memory by avoiding array allocations, and thus sacrifices
 * API cleanness. Since `current` can be null before being passed in and not
 * null after this function, make sure to assign it back to `current`:
 *
 * `a = accumulateInto(a, b);`
 *
 * This API should be sparingly used. Try `accumulate` for something cleaner.
 *
 * @return {*|array<*>} An accumulation of items.
 */

function accumulateInto(current, next) {
  if (!(next != null)) {
    throw Error(
      "accumulateInto(...): Accumulated items must not be null or undefined."
    );
  }

  if (current == null) {
    return next;
  } // Both are not empty. Warning: Never call x.concat(y) when you are not
  // certain that x is an Array (x could be a string with concat method).

  if (isArray(current)) {
    if (isArray(next)) {
      current.push.apply(current, next);
      return current;
    }

    current.push(next);
    return current;
  }

  if (isArray(next)) {
    // A bit too dangerous to mutate `next`.
    return [current].concat(next);
  }

  return [current, next];
}

/**
 * @param {array} arr an "accumulation" of items which is either an Array or
 * a single item. Useful when paired with the `accumulate` module. This is a
 * simple utility that allows us to reason about a collection of items, but
 * handling the case when there is exactly one item (and we do not need to
 * allocate an array).
 * @param {function} cb Callback invoked with each element or a collection.
 * @param {?} [scope] Scope used as `this` in a callback.
 */
function forEachAccumulated(arr, cb, scope) {
  if (Array.isArray(arr)) {
    arr.forEach(cb, scope);
  } else if (arr) {
    cb.call(scope, arr);
  }
}

var FunctionComponent = 0;
var ClassComponent = 1;
var IndeterminateComponent = 2; // Before we know whether it is function or class

var HostRoot = 3; // Root of a host tree. Could be nested inside another node.

var HostPortal = 4; // A subtree. Could be an entry point to a different renderer.

var HostComponent = 5;
var HostText = 6;
var Fragment = 7;
var Mode = 8;
var ContextConsumer = 9;
var ContextProvider = 10;
var ForwardRef = 11;
var Profiler = 12;
var SuspenseComponent = 13;
var MemoComponent = 14;
var SimpleMemoComponent = 15;
var LazyComponent = 16;
var IncompleteClassComponent = 17;
var DehydratedFragment = 18;
var SuspenseListComponent = 19;
var ScopeComponent = 21;
var OffscreenComponent = 22;
var LegacyHiddenComponent = 23;
var CacheComponent = 24;

/**
 * Instance of element that should respond to touch/move types of interactions,
 * as indicated explicitly by relevant callbacks.
 */

var responderInst = null;
/**
 * Count of current touches. A textInput should become responder iff the
 * selection changes while there is a touch on the screen.
 */

var trackedTouchCount = 0;

var changeResponder = function(nextResponderInst, blockHostResponder) {
  var oldResponderInst = responderInst;
  responderInst = nextResponderInst;

  if (ResponderEventPlugin.GlobalResponderHandler !== null) {
    ResponderEventPlugin.GlobalResponderHandler.onChange(
      oldResponderInst,
      nextResponderInst,
      blockHostResponder
    );
  }
};

var eventTypes = {
  /**
   * On a `touchStart`/`mouseDown`, is it desired that this element become the
   * responder?
   */
  startShouldSetResponder: {
    phasedRegistrationNames: {
      bubbled: "onStartShouldSetResponder",
      captured: "onStartShouldSetResponderCapture"
    },
    dependencies: startDependencies
  },

  /**
   * On a `scroll`, is it desired that this element become the responder? This
   * is usually not needed, but should be used to retroactively infer that a
   * `touchStart` had occurred during momentum scroll. During a momentum scroll,
   * a touch start will be immediately followed by a scroll event if the view is
   * currently scrolling.
   *
   * TODO: This shouldn't bubble.
   */
  scrollShouldSetResponder: {
    phasedRegistrationNames: {
      bubbled: "onScrollShouldSetResponder",
      captured: "onScrollShouldSetResponderCapture"
    },
    dependencies: [TOP_SCROLL]
  },

  /**
   * On text selection change, should this element become the responder? This
   * is needed for text inputs or other views with native selection, so the
   * JS view can claim the responder.
   *
   * TODO: This shouldn't bubble.
   */
  selectionChangeShouldSetResponder: {
    phasedRegistrationNames: {
      bubbled: "onSelectionChangeShouldSetResponder",
      captured: "onSelectionChangeShouldSetResponderCapture"
    },
    dependencies: [TOP_SELECTION_CHANGE]
  },

  /**
   * On a `touchMove`/`mouseMove`, is it desired that this element become the
   * responder?
   */
  moveShouldSetResponder: {
    phasedRegistrationNames: {
      bubbled: "onMoveShouldSetResponder",
      captured: "onMoveShouldSetResponderCapture"
    },
    dependencies: moveDependencies
  },

  /**
   * Direct responder events dispatched directly to responder. Do not bubble.
   */
  responderStart: {
    registrationName: "onResponderStart",
    dependencies: startDependencies
  },
  responderMove: {
    registrationName: "onResponderMove",
    dependencies: moveDependencies
  },
  responderEnd: {
    registrationName: "onResponderEnd",
    dependencies: endDependencies
  },
  responderRelease: {
    registrationName: "onResponderRelease",
    dependencies: endDependencies
  },
  responderTerminationRequest: {
    registrationName: "onResponderTerminationRequest",
    dependencies: []
  },
  responderGrant: {
    registrationName: "onResponderGrant",
    dependencies: []
  },
  responderReject: {
    registrationName: "onResponderReject",
    dependencies: []
  },
  responderTerminate: {
    registrationName: "onResponderTerminate",
    dependencies: []
  }
}; // Start of inline: the below functions were inlined from
// EventPropagator.js, as they deviated from ReactDOM's newer
// implementations.

function getParent(inst) {
  do {
    inst = inst.return; // TODO: If this is a HostRoot we might want to bail out.
    // That is depending on if we want nested subtrees (layers) to bubble
    // events to their parent. We could also go through parentNode on the
    // host node but that wouldn't work for React Native and doesn't let us
    // do the portal feature.
  } while (inst && inst.tag !== HostComponent);

  if (inst) {
    return inst;
  }

  return null;
}
/**
 * Return the lowest common ancestor of A and B, or null if they are in
 * different trees.
 */

function getLowestCommonAncestor(instA, instB) {
  var depthA = 0;

  for (var tempA = instA; tempA; tempA = getParent(tempA)) {
    depthA++;
  }

  var depthB = 0;

  for (var tempB = instB; tempB; tempB = getParent(tempB)) {
    depthB++;
  } // If A is deeper, crawl up.

  while (depthA - depthB > 0) {
    instA = getParent(instA);
    depthA--;
  } // If B is deeper, crawl up.

  while (depthB - depthA > 0) {
    instB = getParent(instB);
    depthB--;
  } // Walk in lockstep until we find a match.

  var depth = depthA;

  while (depth--) {
    if (instA === instB || instA === instB.alternate) {
      return instA;
    }

    instA = getParent(instA);
    instB = getParent(instB);
  }

  return null;
}
/**
 * Return if A is an ancestor of B.
 */

function isAncestor(instA, instB) {
  while (instB) {
    if (instA === instB || instA === instB.alternate) {
      return true;
    }

    instB = getParent(instB);
  }

  return false;
}
/**
 * Simulates the traversal of a two-phase, capture/bubble event dispatch.
 */

function traverseTwoPhase(inst, fn, arg) {
  var path = [];

  while (inst) {
    path.push(inst);
    inst = getParent(inst);
  }

  var i;

  for (i = path.length; i-- > 0; ) {
    fn(path[i], "captured", arg);
  }

  for (i = 0; i < path.length; i++) {
    fn(path[i], "bubbled", arg);
  }
}

function getListener(inst, registrationName) {
  var stateNode = inst.stateNode;

  if (stateNode === null) {
    // Work in progress (ex: onload events in incremental mode).
    return null;
  }

  var props = getFiberCurrentPropsFromNode(stateNode);

  if (props === null) {
    // Work in progress.
    return null;
  }

  var listener = props[registrationName];

  if (!(!listener || typeof listener === "function")) {
    throw Error(
      "Expected `" +
        registrationName +
        "` listener to be a function, instead got a value of `" +
        typeof listener +
        "` type."
    );
  }

  return listener;
}

function listenerAtPhase(inst, event, propagationPhase) {
  var registrationName =
    event.dispatchConfig.phasedRegistrationNames[propagationPhase];
  return getListener(inst, registrationName);
}

function accumulateDirectionalDispatches(inst, phase, event) {
  {
    if (!inst) {
      error("Dispatching inst must not be null");
    }
  }

  var listener = listenerAtPhase(inst, event, phase);

  if (listener) {
    event._dispatchListeners = accumulateInto(
      event._dispatchListeners,
      listener
    );
    event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
  }
}
/**
 * Accumulates without regard to direction, does not look for phased
 * registration names. Same as `accumulateDirectDispatchesSingle` but without
 * requiring that the `dispatchMarker` be the same as the dispatched ID.
 */

function accumulateDispatches(inst, ignoredDirection, event) {
  if (inst && event && event.dispatchConfig.registrationName) {
    var registrationName = event.dispatchConfig.registrationName;
    var listener = getListener(inst, registrationName);

    if (listener) {
      event._dispatchListeners = accumulateInto(
        event._dispatchListeners,
        listener
      );
      event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
    }
  }
}
/**
 * Accumulates dispatches on an `SyntheticEvent`, but only for the
 * `dispatchMarker`.
 * @param {SyntheticEvent} event
 */

function accumulateDirectDispatchesSingle(event) {
  if (event && event.dispatchConfig.registrationName) {
    accumulateDispatches(event._targetInst, null, event);
  }
}

function accumulateDirectDispatches(events) {
  forEachAccumulated(events, accumulateDirectDispatchesSingle);
}

function accumulateTwoPhaseDispatchesSingleSkipTarget(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    var targetInst = event._targetInst;
    var parentInst = targetInst ? getParent(targetInst) : null;
    traverseTwoPhase(parentInst, accumulateDirectionalDispatches, event);
  }
}

function accumulateTwoPhaseDispatchesSkipTarget(events) {
  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingleSkipTarget);
}

function accumulateTwoPhaseDispatchesSingle(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
  }
}

function accumulateTwoPhaseDispatches(events) {
  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle);
} // End of inline

/**
 *
 * Responder System:
 * ----------------
 *
 * - A global, solitary "interaction lock" on a view.
 * - If a node becomes the responder, it should convey visual feedback
 *   immediately to indicate so, either by highlighting or moving accordingly.
 * - To be the responder means, that touches are exclusively important to that
 *   responder view, and no other view.
 * - While touches are still occurring, the responder lock can be transferred to
 *   a new view, but only to increasingly "higher" views (meaning ancestors of
 *   the current responder).
 *
 * Responder being granted:
 * ------------------------
 *
 * - Touch starts, moves, and scrolls can cause an ID to become the responder.
 * - We capture/bubble `startShouldSetResponder`/`moveShouldSetResponder` to
 *   the "appropriate place".
 * - If nothing is currently the responder, the "appropriate place" is the
 *   initiating event's `targetID`.
 * - If something *is* already the responder, the "appropriate place" is the
 *   first common ancestor of the event target and the current `responderInst`.
 * - Some negotiation happens: See the timing diagram below.
 * - Scrolled views automatically become responder. The reasoning is that a
 *   platform scroll view that isn't built on top of the responder system has
 *   began scrolling, and the active responder must now be notified that the
 *   interaction is no longer locked to it - the system has taken over.
 *
 * - Responder being released:
 *   As soon as no more touches that *started* inside of descendants of the
 *   *current* responderInst, an `onResponderRelease` event is dispatched to the
 *   current responder, and the responder lock is released.
 *
 * TODO:
 * - on "end", a callback hook for `onResponderEndShouldRemainResponder` that
 *   determines if the responder lock should remain.
 * - If a view shouldn't "remain" the responder, any active touches should by
 *   default be considered "dead" and do not influence future negotiations or
 *   bubble paths. It should be as if those touches do not exist.
 * -- For multitouch: Usually a translate-z will choose to "remain" responder
 *  after one out of many touches ended. For translate-y, usually the view
 *  doesn't wish to "remain" responder after one of many touches end.
 * - Consider building this on top of a `stopPropagation` model similar to
 *   `W3C` events.
 * - Ensure that `onResponderTerminate` is called on touch cancels, whether or
 *   not `onResponderTerminationRequest` returns `true` or `false`.
 *
 */

/*                                             Negotiation Performed
                                             +-----------------------+
                                            /                         \
Process low level events to    +     Current Responder      +   wantsResponderID
determine who to perform negot-|   (if any exists at all)   |
iation/transition              | Otherwise just pass through|
-------------------------------+----------------------------+------------------+
Bubble to find first ID        |                            |
to return true:wantsResponderID|                            |
                               |                            |
     +-------------+           |                            |
     | onTouchStart|           |                            |
     +------+------+     none  |                            |
            |            return|                            |
+-----------v-------------+true| +------------------------+ |
|onStartShouldSetResponder|----->|onResponderStart (cur)  |<-----------+
+-----------+-------------+    | +------------------------+ |          |
            |                  |                            | +--------+-------+
            | returned true for|       false:REJECT +-------->|onResponderReject
            | wantsResponderID |                    |       | +----------------+
            | (now attempt     | +------------------+-----+ |
            |  handoff)        | |   onResponder          | |
            +------------------->|      TerminationRequest| |
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |         true:GRANT +-------->|onResponderGrant|
                               |                            | +--------+-------+
                               | +------------------------+ |          |
                               | |   onResponderTerminate |<-----------+
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |                    +-------->|onResponderStart|
                               |                            | +----------------+
Bubble to find first ID        |                            |
to return true:wantsResponderID|                            |
                               |                            |
     +-------------+           |                            |
     | onTouchMove |           |                            |
     +------+------+     none  |                            |
            |            return|                            |
+-----------v-------------+true| +------------------------+ |
|onMoveShouldSetResponder |----->|onResponderMove (cur)   |<-----------+
+-----------+-------------+    | +------------------------+ |          |
            |                  |                            | +--------+-------+
            | returned true for|       false:REJECT +-------->|onResponderRejec|
            | wantsResponderID |                    |       | +----------------+
            | (now attempt     | +------------------+-----+ |
            |  handoff)        | |   onResponder          | |
            +------------------->|      TerminationRequest| |
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |         true:GRANT +-------->|onResponderGrant|
                               |                            | +--------+-------+
                               | +------------------------+ |          |
                               | |   onResponderTerminate |<-----------+
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |                    +-------->|onResponderMove |
                               |                            | +----------------+
                               |                            |
                               |                            |
      Some active touch started|                            |
      inside current responder | +------------------------+ |
      +------------------------->|      onResponderEnd    | |
      |                        | +------------------------+ |
  +---+---------+              |                            |
  | onTouchEnd  |              |                            |
  +---+---------+              |                            |
      |                        | +------------------------+ |
      +------------------------->|     onResponderEnd     | |
      No active touches started| +-----------+------------+ |
      inside current responder |             |              |
                               |             v              |
                               | +------------------------+ |
                               | |    onResponderRelease  | |
                               | +------------------------+ |
                               |                            |
                               +                            + */

/**
 * A note about event ordering in the `EventPluginRegistry`.
 *
 * Suppose plugins are injected in the following order:
 *
 * `[R, S, C]`
 *
 * To help illustrate the example, assume `S` is `SimpleEventPlugin` (for
 * `onClick` etc) and `R` is `ResponderEventPlugin`.
 *
 * "Deferred-Dispatched Events":
 *
 * - The current event plugin system will traverse the list of injected plugins,
 *   in order, and extract events by collecting the plugin's return value of
 *   `extractEvents()`.
 * - These events that are returned from `extractEvents` are "deferred
 *   dispatched events".
 * - When returned from `extractEvents`, deferred-dispatched events contain an
 *   "accumulation" of deferred dispatches.
 * - These deferred dispatches are accumulated/collected before they are
 *   returned, but processed at a later time by the `EventPluginRegistry` (hence the
 *   name deferred).
 *
 * In the process of returning their deferred-dispatched events, event plugins
 * themselves can dispatch events on-demand without returning them from
 * `extractEvents`. Plugins might want to do this, so that they can use event
 * dispatching as a tool that helps them decide which events should be extracted
 * in the first place.
 *
 * "On-Demand-Dispatched Events":
 *
 * - On-demand-dispatched events are not returned from `extractEvents`.
 * - On-demand-dispatched events are dispatched during the process of returning
 *   the deferred-dispatched events.
 * - They should not have side effects.
 * - They should be avoided, and/or eventually be replaced with another
 *   abstraction that allows event plugins to perform multiple "rounds" of event
 *   extraction.
 *
 * Therefore, the sequence of event dispatches becomes:
 *
 * - `R`s on-demand events (if any)   (dispatched by `R` on-demand)
 * - `S`s on-demand events (if any)   (dispatched by `S` on-demand)
 * - `C`s on-demand events (if any)   (dispatched by `C` on-demand)
 * - `R`s extracted events (if any)   (dispatched by `EventPluginRegistry`)
 * - `S`s extracted events (if any)   (dispatched by `EventPluginRegistry`)
 * - `C`s extracted events (if any)   (dispatched by `EventPluginRegistry`)
 *
 * In the case of `ResponderEventPlugin`: If the `startShouldSetResponder`
 * on-demand dispatch returns `true` (and some other details are satisfied) the
 * `onResponderGrant` deferred dispatched event is returned from
 * `extractEvents`. The sequence of dispatch executions in this case
 * will appear as follows:
 *
 * - `startShouldSetResponder` (`ResponderEventPlugin` dispatches on-demand)
 * - `touchStartCapture`       (`EventPluginRegistry` dispatches as usual)
 * - `touchStart`              (`EventPluginRegistry` dispatches as usual)
 * - `responderGrant/Reject`   (`EventPluginRegistry` dispatches as usual)
 */

function setResponderAndExtractTransfer(
  topLevelType,
  targetInst,
  nativeEvent,
  nativeEventTarget
) {
  var shouldSetEventType = isStartish(topLevelType)
    ? eventTypes.startShouldSetResponder
    : isMoveish(topLevelType)
    ? eventTypes.moveShouldSetResponder
    : topLevelType === TOP_SELECTION_CHANGE
    ? eventTypes.selectionChangeShouldSetResponder
    : eventTypes.scrollShouldSetResponder; // TODO: stop one short of the current responder.

  var bubbleShouldSetFrom = !responderInst
    ? targetInst
    : getLowestCommonAncestor(responderInst, targetInst); // When capturing/bubbling the "shouldSet" event, we want to skip the target
  // (deepest ID) if it happens to be the current responder. The reasoning:
  // It's strange to get an `onMoveShouldSetResponder` when you're *already*
  // the responder.

  var skipOverBubbleShouldSetFrom = bubbleShouldSetFrom === responderInst;
  var shouldSetEvent = ResponderSyntheticEvent.getPooled(
    shouldSetEventType,
    bubbleShouldSetFrom,
    nativeEvent,
    nativeEventTarget
  );
  shouldSetEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;

  if (skipOverBubbleShouldSetFrom) {
    accumulateTwoPhaseDispatchesSkipTarget(shouldSetEvent);
  } else {
    accumulateTwoPhaseDispatches(shouldSetEvent);
  }

  var wantsResponderInst = executeDispatchesInOrderStopAtTrue(shouldSetEvent);

  if (!shouldSetEvent.isPersistent()) {
    shouldSetEvent.constructor.release(shouldSetEvent);
  }

  if (!wantsResponderInst || wantsResponderInst === responderInst) {
    return null;
  }

  var extracted;
  var grantEvent = ResponderSyntheticEvent.getPooled(
    eventTypes.responderGrant,
    wantsResponderInst,
    nativeEvent,
    nativeEventTarget
  );
  grantEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;
  accumulateDirectDispatches(grantEvent);
  var blockHostResponder = executeDirectDispatch(grantEvent) === true;

  if (responderInst) {
    var terminationRequestEvent = ResponderSyntheticEvent.getPooled(
      eventTypes.responderTerminationRequest,
      responderInst,
      nativeEvent,
      nativeEventTarget
    );
    terminationRequestEvent.touchHistory =
      ResponderTouchHistoryStore.touchHistory;
    accumulateDirectDispatches(terminationRequestEvent);
    var shouldSwitch =
      !hasDispatches(terminationRequestEvent) ||
      executeDirectDispatch(terminationRequestEvent);

    if (!terminationRequestEvent.isPersistent()) {
      terminationRequestEvent.constructor.release(terminationRequestEvent);
    }

    if (shouldSwitch) {
      var terminateEvent = ResponderSyntheticEvent.getPooled(
        eventTypes.responderTerminate,
        responderInst,
        nativeEvent,
        nativeEventTarget
      );
      terminateEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;
      accumulateDirectDispatches(terminateEvent);
      extracted = accumulate(extracted, [grantEvent, terminateEvent]);
      changeResponder(wantsResponderInst, blockHostResponder);
    } else {
      var rejectEvent = ResponderSyntheticEvent.getPooled(
        eventTypes.responderReject,
        wantsResponderInst,
        nativeEvent,
        nativeEventTarget
      );
      rejectEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;
      accumulateDirectDispatches(rejectEvent);
      extracted = accumulate(extracted, rejectEvent);
    }
  } else {
    extracted = accumulate(extracted, grantEvent);
    changeResponder(wantsResponderInst, blockHostResponder);
  }

  return extracted;
}
/**
 * A transfer is a negotiation between a currently set responder and the next
 * element to claim responder status. Any start event could trigger a transfer
 * of responderInst. Any move event could trigger a transfer.
 *
 * @param {string} topLevelType Record from `BrowserEventConstants`.
 * @return {boolean} True if a transfer of responder could possibly occur.
 */

function canTriggerTransfer(topLevelType, topLevelInst, nativeEvent) {
  return (
    topLevelInst && // responderIgnoreScroll: We are trying to migrate away from specifically
    // tracking native scroll events here and responderIgnoreScroll indicates we
    // will send topTouchCancel to handle canceling touch events instead
    ((topLevelType === TOP_SCROLL && !nativeEvent.responderIgnoreScroll) ||
      (trackedTouchCount > 0 && topLevelType === TOP_SELECTION_CHANGE) ||
      isStartish(topLevelType) ||
      isMoveish(topLevelType))
  );
}
/**
 * Returns whether or not this touch end event makes it such that there are no
 * longer any touches that started inside of the current `responderInst`.
 *
 * @param {NativeEvent} nativeEvent Native touch end event.
 * @return {boolean} Whether or not this touch end event ends the responder.
 */

function noResponderTouches(nativeEvent) {
  var touches = nativeEvent.touches;

  if (!touches || touches.length === 0) {
    return true;
  }

  for (var i = 0; i < touches.length; i++) {
    var activeTouch = touches[i];
    var target = activeTouch.target;

    if (target !== null && target !== undefined && target !== 0) {
      // Is the original touch location inside of the current responder?
      var targetInst = getInstanceFromNode(target);

      if (isAncestor(responderInst, targetInst)) {
        return false;
      }
    }
  }

  return true;
}

var ResponderEventPlugin = {
  /* For unit testing only */
  _getResponder: function() {
    return responderInst;
  },
  eventTypes: eventTypes,

  /**
   * We must be resilient to `targetInst` being `null` on `touchMove` or
   * `touchEnd`. On certain platforms, this means that a native scroll has
   * assumed control and the original touch targets are destroyed.
   */
  extractEvents: function(
    topLevelType,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags
  ) {
    if (isStartish(topLevelType)) {
      trackedTouchCount += 1;
    } else if (isEndish(topLevelType)) {
      if (trackedTouchCount >= 0) {
        trackedTouchCount -= 1;
      } else {
        {
          warn(
            "Ended a touch event which was not counted in `trackedTouchCount`."
          );
        }

        return null;
      }
    }

    ResponderTouchHistoryStore.recordTouchTrack(topLevelType, nativeEvent);
    var extracted = canTriggerTransfer(topLevelType, targetInst, nativeEvent)
      ? setResponderAndExtractTransfer(
          topLevelType,
          targetInst,
          nativeEvent,
          nativeEventTarget
        )
      : null; // Responder may or may not have transferred on a new touch start/move.
    // Regardless, whoever is the responder after any potential transfer, we
    // direct all touch start/move/ends to them in the form of
    // `onResponderMove/Start/End`. These will be called for *every* additional
    // finger that move/start/end, dispatched directly to whoever is the
    // current responder at that moment, until the responder is "released".
    //
    // These multiple individual change touch events are are always bookended
    // by `onResponderGrant`, and one of
    // (`onResponderRelease/onResponderTerminate`).

    var isResponderTouchStart = responderInst && isStartish(topLevelType);
    var isResponderTouchMove = responderInst && isMoveish(topLevelType);
    var isResponderTouchEnd = responderInst && isEndish(topLevelType);
    var incrementalTouch = isResponderTouchStart
      ? eventTypes.responderStart
      : isResponderTouchMove
      ? eventTypes.responderMove
      : isResponderTouchEnd
      ? eventTypes.responderEnd
      : null;

    if (incrementalTouch) {
      var gesture = ResponderSyntheticEvent.getPooled(
        incrementalTouch,
        responderInst,
        nativeEvent,
        nativeEventTarget
      );
      gesture.touchHistory = ResponderTouchHistoryStore.touchHistory;
      accumulateDirectDispatches(gesture);
      extracted = accumulate(extracted, gesture);
    }

    var isResponderTerminate =
      responderInst && topLevelType === TOP_TOUCH_CANCEL;
    var isResponderRelease =
      responderInst &&
      !isResponderTerminate &&
      isEndish(topLevelType) &&
      noResponderTouches(nativeEvent);
    var finalTouch = isResponderTerminate
      ? eventTypes.responderTerminate
      : isResponderRelease
      ? eventTypes.responderRelease
      : null;

    if (finalTouch) {
      var finalEvent = ResponderSyntheticEvent.getPooled(
        finalTouch,
        responderInst,
        nativeEvent,
        nativeEventTarget
      );
      finalEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;
      accumulateDirectDispatches(finalEvent);
      extracted = accumulate(extracted, finalEvent);
      changeResponder(null);
    }

    return extracted;
  },
  GlobalResponderHandler: null,
  injection: {
    /**
     * @param {{onChange: (ReactID, ReactID) => void} GlobalResponderHandler
     * Object that handles any change in responder. Use this to inject
     * integration with an existing touch handling system etc.
     */
    injectGlobalResponderHandler: function(GlobalResponderHandler) {
      ResponderEventPlugin.GlobalResponderHandler = GlobalResponderHandler;
    }
  }
};

/**
 * Injectable ordering of event plugins.
 */
var eventPluginOrder = null;
/**
 * Injectable mapping from names to event plugin modules.
 */

var namesToPlugins = {};
/**
 * Recomputes the plugin list using the injected plugins and plugin ordering.
 *
 * @private
 */

function recomputePluginOrdering() {
  if (!eventPluginOrder) {
    // Wait until an `eventPluginOrder` is injected.
    return;
  }

  for (var pluginName in namesToPlugins) {
    var pluginModule = namesToPlugins[pluginName];
    var pluginIndex = eventPluginOrder.indexOf(pluginName);

    if (!(pluginIndex > -1)) {
      throw Error(
        "EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin ordering, `" +
          pluginName +
          "`."
      );
    }

    if (plugins[pluginIndex]) {
      continue;
    }

    if (!pluginModule.extractEvents) {
      throw Error(
        "EventPluginRegistry: Event plugins must implement an `extractEvents` method, but `" +
          pluginName +
          "` does not."
      );
    }

    plugins[pluginIndex] = pluginModule;
    var publishedEvents = pluginModule.eventTypes;

    for (var eventName in publishedEvents) {
      if (
        !publishEventForPlugin(
          publishedEvents[eventName],
          pluginModule,
          eventName
        )
      ) {
        throw Error(
          "EventPluginRegistry: Failed to publish event `" +
            eventName +
            "` for plugin `" +
            pluginName +
            "`."
        );
      }
    }
  }
}
/**
 * Publishes an event so that it can be dispatched by the supplied plugin.
 *
 * @param {object} dispatchConfig Dispatch configuration for the event.
 * @param {object} PluginModule Plugin publishing the event.
 * @return {boolean} True if the event was successfully published.
 * @private
 */

function publishEventForPlugin(dispatchConfig, pluginModule, eventName) {
  if (!!eventNameDispatchConfigs.hasOwnProperty(eventName)) {
    throw Error(
      "EventPluginRegistry: More than one plugin attempted to publish the same event name, `" +
        eventName +
        "`."
    );
  }

  eventNameDispatchConfigs[eventName] = dispatchConfig;
  var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;

  if (phasedRegistrationNames) {
    for (var phaseName in phasedRegistrationNames) {
      if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
        var phasedRegistrationName = phasedRegistrationNames[phaseName];
        publishRegistrationName(
          phasedRegistrationName,
          pluginModule,
          eventName
        );
      }
    }

    return true;
  } else if (dispatchConfig.registrationName) {
    publishRegistrationName(
      dispatchConfig.registrationName,
      pluginModule,
      eventName
    );
    return true;
  }

  return false;
}
/**
 * Publishes a registration name that is used to identify dispatched events.
 *
 * @param {string} registrationName Registration name to add.
 * @param {object} PluginModule Plugin publishing the event.
 * @private
 */

function publishRegistrationName(registrationName, pluginModule, eventName) {
  if (!!registrationNameModules[registrationName]) {
    throw Error(
      "EventPluginRegistry: More than one plugin attempted to publish the same registration name, `" +
        registrationName +
        "`."
    );
  }

  registrationNameModules[registrationName] = pluginModule;
  registrationNameDependencies[registrationName] =
    pluginModule.eventTypes[eventName].dependencies;

  {
    var lowerCasedName = registrationName.toLowerCase();
  }
}
/**
 * Registers plugins so that they can extract and dispatch events.
 */

/**
 * Ordered list of injected plugins.
 */

var plugins = [];
/**
 * Mapping from event name to dispatch config
 */

var eventNameDispatchConfigs = {};
/**
 * Mapping from registration name to plugin module
 */

var registrationNameModules = {};
/**
 * Mapping from registration name to event name
 */

var registrationNameDependencies = {};

/**
 * Injects an ordering of plugins (by plugin name). This allows the ordering
 * to be decoupled from injection of the actual plugins so that ordering is
 * always deterministic regardless of packaging, on-the-fly injection, etc.
 *
 * @param {array} InjectedEventPluginOrder
 * @internal
 */

function injectEventPluginOrder(injectedEventPluginOrder) {
  if (!!eventPluginOrder) {
    throw Error(
      "EventPluginRegistry: Cannot inject event plugin ordering more than once. You are likely trying to load more than one copy of React."
    );
  } // Clone the ordering so it cannot be dynamically mutated.

  eventPluginOrder = Array.prototype.slice.call(injectedEventPluginOrder);
  recomputePluginOrdering();
}
/**
 * Injects plugins to be used by plugin event system. The plugin names must be
 * in the ordering injected by `injectEventPluginOrder`.
 *
 * Plugins can be injected as part of page initialization or on-the-fly.
 *
 * @param {object} injectedNamesToPlugins Map from names to plugin modules.
 * @internal
 */

function injectEventPluginsByName(injectedNamesToPlugins) {
  var isOrderingDirty = false;

  for (var pluginName in injectedNamesToPlugins) {
    if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
      continue;
    }

    var pluginModule = injectedNamesToPlugins[pluginName];

    if (
      !namesToPlugins.hasOwnProperty(pluginName) ||
      namesToPlugins[pluginName] !== pluginModule
    ) {
      if (!!namesToPlugins[pluginName]) {
        throw Error(
          "EventPluginRegistry: Cannot inject two different event plugins using the same name, `" +
            pluginName +
            "`."
        );
      }

      namesToPlugins[pluginName] = pluginModule;
      isOrderingDirty = true;
    }
  }

  if (isOrderingDirty) {
    recomputePluginOrdering();
  }
}

function getListener$1(inst, registrationName) {
  var stateNode = inst.stateNode;

  if (stateNode === null) {
    // Work in progress (ex: onload events in incremental mode).
    return null;
  }

  var props = getFiberCurrentPropsFromNode(stateNode);

  if (props === null) {
    // Work in progress.
    return null;
  }

  var listener = props[registrationName];

  if (!(!listener || typeof listener === "function")) {
    throw Error(
      "Expected `" +
        registrationName +
        "` listener to be a function, instead got a value of `" +
        typeof listener +
        "` type."
    );
  }

  return listener;
}

var customBubblingEventTypes =
    ReactNativePrivateInterface.ReactNativeViewConfigRegistry
      .customBubblingEventTypes,
  customDirectEventTypes =
    ReactNativePrivateInterface.ReactNativeViewConfigRegistry
      .customDirectEventTypes; // Start of inline: the below functions were inlined from
// EventPropagator.js, as they deviated from ReactDOM's newer
// implementations.

function listenerAtPhase$1(inst, event, propagationPhase) {
  var registrationName =
    event.dispatchConfig.phasedRegistrationNames[propagationPhase];
  return getListener$1(inst, registrationName);
}

function accumulateDirectionalDispatches$1(inst, phase, event) {
  {
    if (!inst) {
      error("Dispatching inst must not be null");
    }
  }

  var listener = listenerAtPhase$1(inst, event, phase);

  if (listener) {
    event._dispatchListeners = accumulateInto(
      event._dispatchListeners,
      listener
    );
    event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
  }
}

function getParent$1(inst) {
  do {
    inst = inst.return; // TODO: If this is a HostRoot we might want to bail out.
    // That is depending on if we want nested subtrees (layers) to bubble
    // events to their parent. We could also go through parentNode on the
    // host node but that wouldn't work for React Native and doesn't let us
    // do the portal feature.
  } while (inst && inst.tag !== HostComponent);

  if (inst) {
    return inst;
  }

  return null;
}
/**
 * Simulates the traversal of a two-phase, capture/bubble event dispatch.
 */

function traverseTwoPhase$1(inst, fn, arg) {
  var path = [];

  while (inst) {
    path.push(inst);
    inst = getParent$1(inst);
  }

  var i;

  for (i = path.length; i-- > 0; ) {
    fn(path[i], "captured", arg);
  }

  for (i = 0; i < path.length; i++) {
    fn(path[i], "bubbled", arg);
  }
}

function accumulateTwoPhaseDispatchesSingle$1(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    traverseTwoPhase$1(
      event._targetInst,
      accumulateDirectionalDispatches$1,
      event
    );
  }
}

function accumulateTwoPhaseDispatches$1(events) {
  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle$1);
}
/**
 * Accumulates without regard to direction, does not look for phased
 * registration names. Same as `accumulateDirectDispatchesSingle` but without
 * requiring that the `dispatchMarker` be the same as the dispatched ID.
 */

function accumulateDispatches$1(inst, ignoredDirection, event) {
  if (inst && event && event.dispatchConfig.registrationName) {
    var registrationName = event.dispatchConfig.registrationName;
    var listener = getListener$1(inst, registrationName);

    if (listener) {
      event._dispatchListeners = accumulateInto(
        event._dispatchListeners,
        listener
      );
      event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
    }
  }
}
/**
 * Accumulates dispatches on an `SyntheticEvent`, but only for the
 * `dispatchMarker`.
 * @param {SyntheticEvent} event
 */

function accumulateDirectDispatchesSingle$1(event) {
  if (event && event.dispatchConfig.registrationName) {
    accumulateDispatches$1(event._targetInst, null, event);
  }
}

function accumulateDirectDispatches$1(events) {
  forEachAccumulated(events, accumulateDirectDispatchesSingle$1);
} // End of inline

var ReactNativeBridgeEventPlugin = {
  eventTypes: {},
  extractEvents: function(
    topLevelType,
    targetInst,
    nativeEvent,
    nativeEventTarget
  ) {
    if (targetInst == null) {
      // Probably a node belonging to another renderer's tree.
      return null;
    }

    var bubbleDispatchConfig = customBubblingEventTypes[topLevelType];
    var directDispatchConfig = customDirectEventTypes[topLevelType];

    if (!(bubbleDispatchConfig || directDispatchConfig)) {
      throw Error(
        'Unsupported top level event type "' + topLevelType + '" dispatched'
      );
    }

    var event = SyntheticEvent.getPooled(
      bubbleDispatchConfig || directDispatchConfig,
      targetInst,
      nativeEvent,
      nativeEventTarget
    );

    if (bubbleDispatchConfig) {
      accumulateTwoPhaseDispatches$1(event);
    } else if (directDispatchConfig) {
      accumulateDirectDispatches$1(event);
    } else {
      return null;
    }

    return event;
  }
};

var ReactNativeEventPluginOrder = [
  "ResponderEventPlugin",
  "ReactNativeBridgeEventPlugin"
];

/**
 * Make sure essential globals are available and are patched correctly. Please don't remove this
 * line. Bundles created by react-packager `require` it before executing any application code. This
 * ensures it exists in the dependency graph and can be `require`d.
 * TODO: require this in packager, not in React #10932517
 */
/**
 * Inject module for resolving DOM hierarchy and plugin ordering.
 */

injectEventPluginOrder(ReactNativeEventPluginOrder);
/**
 * Some important event plugins included by default (without having to require
 * them).
 */

injectEventPluginsByName({
  ResponderEventPlugin: ResponderEventPlugin,
  ReactNativeBridgeEventPlugin: ReactNativeBridgeEventPlugin
});

var instanceCache = new Map();
var instanceProps = new Map();
function precacheFiberNode(hostInst, tag) {
  instanceCache.set(tag, hostInst);
}
function uncacheFiberNode(tag) {
  instanceCache.delete(tag);
  instanceProps.delete(tag);
}

function getInstanceFromTag(tag) {
  return instanceCache.get(tag) || null;
}

function getTagFromInstance(inst) {
  var nativeInstance = inst.stateNode;
  var tag = nativeInstance._nativeTag;

  if (tag === undefined) {
    nativeInstance = nativeInstance.canonical;
    tag = nativeInstance._nativeTag;
  }

  if (!tag) {
    throw Error("All native instances should have a tag.");
  }

  return nativeInstance;
}
function getFiberCurrentPropsFromNode$1(stateNode) {
  return instanceProps.get(stateNode._nativeTag) || null;
}
function updateFiberProps(tag, props) {
  instanceProps.set(tag, props);
}

// Used as a way to call batchedUpdates when we don't have a reference to
// the renderer. Such as when we're dispatching events or if third party
// libraries need to call batchedUpdates. Eventually, this API will go away when
// everything is batched by default. We'll then have a similar API to opt-out of
// scheduled work and instead do synchronous work.
// Defaults
var batchedUpdatesImpl = function(fn, bookkeeping) {
  return fn(bookkeeping);
};

var isInsideEventHandler = false;
function batchedUpdates(fn, bookkeeping) {
  if (isInsideEventHandler) {
    // If we are currently inside another batch, we need to wait until it
    // fully completes before restoring state.
    return fn(bookkeeping);
  }

  isInsideEventHandler = true;

  try {
    return batchedUpdatesImpl(fn, bookkeeping);
  } finally {
    isInsideEventHandler = false;
  }
}
function setBatchingImplementation(_batchedUpdatesImpl, _discreteUpdatesImpl) {
  batchedUpdatesImpl = _batchedUpdatesImpl;
}

/**
 * Internal queue of events that have accumulated their dispatches and are
 * waiting to have their dispatches executed.
 */

var eventQueue = null;
/**
 * Dispatches an event and releases it back into the pool, unless persistent.
 *
 * @param {?object} event Synthetic event to be dispatched.
 * @private
 */

var executeDispatchesAndRelease = function(event) {
  if (event) {
    executeDispatchesInOrder(event);

    if (!event.isPersistent()) {
      event.constructor.release(event);
    }
  }
};

var executeDispatchesAndReleaseTopLevel = function(e) {
  return executeDispatchesAndRelease(e);
};

function runEventsInBatch(events) {
  if (events !== null) {
    eventQueue = accumulateInto(eventQueue, events);
  } // Set `eventQueue` to null before processing it so that we can tell if more
  // events get enqueued while processing.

  var processingEventQueue = eventQueue;
  eventQueue = null;

  if (!processingEventQueue) {
    return;
  }

  forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseTopLevel);

  if (!!eventQueue) {
    throw Error(
      "processEventQueue(): Additional events were enqueued while processing an event queue. Support for this has not yet been implemented."
    );
  } // This would be a good time to rethrow if any of the event handlers threw.

  rethrowCaughtError();
}

/**
 * Version of `ReactBrowserEventEmitter` that works on the receiving side of a
 * serialized worker boundary.
 */
// Shared default empty native event - conserve memory.

var EMPTY_NATIVE_EVENT = {};
/**
 * Selects a subsequence of `Touch`es, without destroying `touches`.
 *
 * @param {Array<Touch>} touches Deserialized touch objects.
 * @param {Array<number>} indices Indices by which to pull subsequence.
 * @return {Array<Touch>} Subsequence of touch objects.
 */

var touchSubsequence = function(touches, indices) {
  var ret = [];

  for (var i = 0; i < indices.length; i++) {
    ret.push(touches[indices[i]]);
  }

  return ret;
};
/**
 * TODO: Pool all of this.
 *
 * Destroys `touches` by removing touch objects at indices `indices`. This is
 * to maintain compatibility with W3C touch "end" events, where the active
 * touches don't include the set that has just been "ended".
 *
 * @param {Array<Touch>} touches Deserialized touch objects.
 * @param {Array<number>} indices Indices to remove from `touches`.
 * @return {Array<Touch>} Subsequence of removed touch objects.
 */

var removeTouchesAtIndices = function(touches, indices) {
  var rippedOut = []; // use an unsafe downcast to alias to nullable elements,
  // so we can delete and then compact.

  var temp = touches;

  for (var i = 0; i < indices.length; i++) {
    var index = indices[i];
    rippedOut.push(touches[index]);
    temp[index] = null;
  }

  var fillAt = 0;

  for (var j = 0; j < temp.length; j++) {
    var cur = temp[j];

    if (cur !== null) {
      temp[fillAt++] = cur;
    }
  }

  temp.length = fillAt;
  return rippedOut;
};
/**
 * Internal version of `receiveEvent` in terms of normalized (non-tag)
 * `rootNodeID`.
 *
 * @see receiveEvent.
 *
 * @param {rootNodeID} rootNodeID React root node ID that event occurred on.
 * @param {TopLevelType} topLevelType Top level type of event.
 * @param {?object} nativeEventParam Object passed from native.
 */

function _receiveRootNodeIDEvent(rootNodeID, topLevelType, nativeEventParam) {
  var nativeEvent = nativeEventParam || EMPTY_NATIVE_EVENT;
  var inst = getInstanceFromTag(rootNodeID);
  var target = null;

  if (inst != null) {
    target = inst.stateNode;
  }

  batchedUpdates(function() {
    runExtractedPluginEventsInBatch(topLevelType, inst, nativeEvent, target);
  }); // React Native doesn't use ReactControlledComponent but if it did, here's
  // where it would do it.
}
/**
 * Allows registered plugins an opportunity to extract events from top-level
 * native browser events.
 *
 * @return {*} An accumulation of synthetic events.
 * @internal
 */

function extractPluginEvents(
  topLevelType,
  targetInst,
  nativeEvent,
  nativeEventTarget
) {
  var events = null;
  var legacyPlugins = plugins;

  for (var i = 0; i < legacyPlugins.length; i++) {
    // Not every plugin in the ordering may be loaded at runtime.
    var possiblePlugin = legacyPlugins[i];

    if (possiblePlugin) {
      var extractedEvents = possiblePlugin.extractEvents(
        topLevelType,
        targetInst,
        nativeEvent,
        nativeEventTarget
      );

      if (extractedEvents) {
        events = accumulateInto(events, extractedEvents);
      }
    }
  }

  return events;
}

function runExtractedPluginEventsInBatch(
  topLevelType,
  targetInst,
  nativeEvent,
  nativeEventTarget
) {
  var events = extractPluginEvents(
    topLevelType,
    targetInst,
    nativeEvent,
    nativeEventTarget
  );
  runEventsInBatch(events);
}
/**
 * Publicly exposed method on module for native objc to invoke when a top
 * level event is extracted.
 * @param {rootNodeID} rootNodeID React root node ID that event occurred on.
 * @param {TopLevelType} topLevelType Top level type of event.
 * @param {object} nativeEventParam Object passed from native.
 */

function receiveEvent(rootNodeID, topLevelType, nativeEventParam) {
  _receiveRootNodeIDEvent(rootNodeID, topLevelType, nativeEventParam);
}
/**
 * Simple multi-wrapper around `receiveEvent` that is intended to receive an
 * efficient representation of `Touch` objects, and other information that
 * can be used to construct W3C compliant `Event` and `Touch` lists.
 *
 * This may create dispatch behavior that differs than web touch handling. We
 * loop through each of the changed touches and receive it as a single event.
 * So two `touchStart`/`touchMove`s that occur simultaneously are received as
 * two separate touch event dispatches - when they arguably should be one.
 *
 * This implementation reuses the `Touch` objects themselves as the `Event`s
 * since we dispatch an event for each touch (though that might not be spec
 * compliant). The main purpose of reusing them is to save allocations.
 *
 * TODO: Dispatch multiple changed touches in one event. The bubble path
 * could be the first common ancestor of all the `changedTouches`.
 *
 * One difference between this behavior and W3C spec: cancelled touches will
 * not appear in `.touches`, or in any future `.touches`, though they may
 * still be "actively touching the surface".
 *
 * Web desktop polyfills only need to construct a fake touch event with
 * identifier 0, also abandoning traditional click handlers.
 */

function receiveTouches(eventTopLevelType, touches, changedIndices) {
  var changedTouches =
    eventTopLevelType === "topTouchEnd" ||
    eventTopLevelType === "topTouchCancel"
      ? removeTouchesAtIndices(touches, changedIndices)
      : touchSubsequence(touches, changedIndices);

  for (var jj = 0; jj < changedTouches.length; jj++) {
    var touch = changedTouches[jj]; // Touch objects can fulfill the role of `DOM` `Event` objects if we set
    // the `changedTouches`/`touches`. This saves allocations.

    touch.changedTouches = changedTouches;
    touch.touches = touches;
    var nativeEvent = touch;
    var rootNodeID = null;
    var target = nativeEvent.target;

    if (target !== null && target !== undefined) {
      if (target < 1) {
        {
          error("A view is reporting that a touch occurred on tag zero.");
        }
      } else {
        rootNodeID = target;
      }
    } // $FlowFixMe Shouldn't we *not* call it if rootNodeID is null?

    _receiveRootNodeIDEvent(rootNodeID, eventTopLevelType, nativeEvent);
  }
}

// Module provided by RN:
var ReactNativeGlobalResponderHandler = {
  onChange: function(from, to, blockNativeResponder) {
    if (to !== null) {
      var tag = to.stateNode._nativeTag;
      ReactNativePrivateInterface.UIManager.setJSResponder(
        tag,
        blockNativeResponder
      );
    } else {
      ReactNativePrivateInterface.UIManager.clearJSResponder();
    }
  }
};

/**
 * Register the event emitter with the native bridge
 */

ReactNativePrivateInterface.RCTEventEmitter.register({
  receiveEvent: receiveEvent,
  receiveTouches: receiveTouches
});
setComponentTree(
  getFiberCurrentPropsFromNode$1,
  getInstanceFromTag,
  getTagFromInstance
);
ResponderEventPlugin.injection.injectGlobalResponderHandler(
  ReactNativeGlobalResponderHandler
);

/**
 * `ReactInstanceMap` maintains a mapping from a public facing stateful
 * instance (key) and the internal representation (value). This allows public
 * methods to accept the user facing instance as an argument and map them back
 * to internal methods.
 *
 * Note that this module is currently shared and assumed to be stateless.
 * If this becomes an actual Map, that will break.
 */
function get(key) {
  return key._reactInternals;
}
function set(key, value) {
  key._reactInternals = value;
}

// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var REACT_ELEMENT_TYPE = 0xeac7;
var REACT_PORTAL_TYPE = 0xeaca;
var REACT_FRAGMENT_TYPE = 0xeacb;
var REACT_STRICT_MODE_TYPE = 0xeacc;
var REACT_PROFILER_TYPE = 0xead2;
var REACT_PROVIDER_TYPE = 0xeacd;
var REACT_CONTEXT_TYPE = 0xeace;
var REACT_FORWARD_REF_TYPE = 0xead0;
var REACT_SUSPENSE_TYPE = 0xead1;
var REACT_SUSPENSE_LIST_TYPE = 0xead8;
var REACT_MEMO_TYPE = 0xead3;
var REACT_LAZY_TYPE = 0xead4;
var REACT_SCOPE_TYPE = 0xead7;
var REACT_OPAQUE_ID_TYPE = 0xeae0;
var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
var REACT_OFFSCREEN_TYPE = 0xeae2;
var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;
var REACT_CACHE_TYPE = 0xeae4;

if (typeof Symbol === "function" && Symbol.for) {
  var symbolFor = Symbol.for;
  REACT_ELEMENT_TYPE = symbolFor("react.element");
  REACT_PORTAL_TYPE = symbolFor("react.portal");
  REACT_FRAGMENT_TYPE = symbolFor("react.fragment");
  REACT_STRICT_MODE_TYPE = symbolFor("react.strict_mode");
  REACT_PROFILER_TYPE = symbolFor("react.profiler");
  REACT_PROVIDER_TYPE = symbolFor("react.provider");
  REACT_CONTEXT_TYPE = symbolFor("react.context");
  REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref");
  REACT_SUSPENSE_TYPE = symbolFor("react.suspense");
  REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list");
  REACT_MEMO_TYPE = symbolFor("react.memo");
  REACT_LAZY_TYPE = symbolFor("react.lazy");
  REACT_SCOPE_TYPE = symbolFor("react.scope");
  REACT_OPAQUE_ID_TYPE = symbolFor("react.opaque.id");
  REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode");
  REACT_OFFSCREEN_TYPE = symbolFor("react.offscreen");
  REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
  REACT_CACHE_TYPE = symbolFor("react.cache");
}

var MAYBE_ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = "@@iterator";
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== "object") {
    return null;
  }

  var maybeIterator =
    (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
    maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === "function") {
    return maybeIterator;
  }

  return null;
}

function getWrappedName(outerType, innerType, wrapperName) {
  var displayName = outerType.displayName;

  if (displayName) {
    return displayName;
  }

  var functionName = innerType.displayName || innerType.name || "";
  return functionName !== ""
    ? wrapperName + "(" + functionName + ")"
    : wrapperName;
} // Keep in sync with react-reconciler/getComponentNameFromFiber

function getContextName(type) {
  return type.displayName || "Context";
} // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.

function getComponentNameFromType(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }

  {
    if (typeof type.tag === "number") {
      error(
        "Received an unexpected object in getComponentNameFromType(). " +
          "This is likely a bug in React. Please file an issue."
      );
    }
  }

  if (typeof type === "function") {
    return type.displayName || type.name || null;
  }

  if (typeof type === "string") {
    return type;
  }

  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return "Fragment";

    case REACT_PORTAL_TYPE:
      return "Portal";

    case REACT_PROFILER_TYPE:
      return "Profiler";

    case REACT_STRICT_MODE_TYPE:
      return "StrictMode";

    case REACT_SUSPENSE_TYPE:
      return "Suspense";

    case REACT_SUSPENSE_LIST_TYPE:
      return "SuspenseList";

    case REACT_CACHE_TYPE:
      return "Cache";
  }

  if (typeof type === "object") {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        var context = type;
        return getContextName(context) + ".Consumer";

      case REACT_PROVIDER_TYPE:
        var provider = type;
        return getContextName(provider._context) + ".Provider";

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, "ForwardRef");

      case REACT_MEMO_TYPE:
        var outerName = type.displayName || null;

        if (outerName !== null) {
          return outerName;
        }

        return getComponentNameFromType(type.type) || "Memo";

      case REACT_LAZY_TYPE: {
        var lazyComponent = type;
        var payload = lazyComponent._payload;
        var init = lazyComponent._init;

        try {
          return getComponentNameFromType(init(payload));
        } catch (x) {
          return null;
        }
      }
    }
  }

  return null;
}

function getWrappedName$1(outerType, innerType, wrapperName) {
  var functionName = innerType.displayName || innerType.name || "";
  return (
    outerType.displayName ||
    (functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName)
  );
} // Keep in sync with shared/getComponentNameFromType

function getContextName$1(type) {
  return type.displayName || "Context";
}

function getComponentNameFromFiber(fiber) {
  var tag = fiber.tag,
    type = fiber.type;

  switch (tag) {
    case CacheComponent:
      return "Cache";

    case ContextConsumer:
      var context = type;
      return getContextName$1(context) + ".Consumer";

    case ContextProvider:
      var provider = type;
      return getContextName$1(provider._context) + ".Provider";

    case DehydratedFragment:
      return "DehydratedFragment";

    case ForwardRef:
      return getWrappedName$1(type, type.render, "ForwardRef");

    case Fragment:
      return "Fragment";

    case HostComponent:
      // Host component type is the display name (e.g. "div", "View")
      return type;

    case HostPortal:
      return "Portal";

    case HostRoot:
      return "Root";

    case HostText:
      return "Text";

    case LazyComponent:
      // Name comes from the type in this case; we don't have a tag.
      return getComponentNameFromType(type);

    case LegacyHiddenComponent:
      return "LegacyHidden";

    case Mode:
      if (type === REACT_STRICT_MODE_TYPE) {
        // Don't be less specific than shared/getComponentNameFromType
        return "StrictMode";
      }

      return "Mode";

    case OffscreenComponent:
      return "Offscreen";

    case Profiler:
      return "Profiler";

    case ScopeComponent:
      return "Scope";

    case SuspenseComponent:
      return "Suspense";

    case SuspenseListComponent:
      return "SuspenseList";
    // The display name for this tags come from the user-provided type:

    case ClassComponent:
    case FunctionComponent:
    case IncompleteClassComponent:
    case IndeterminateComponent:
    case MemoComponent:
    case SimpleMemoComponent:
      if (typeof type === "function") {
        return type.displayName || type.name || null;
      }

      if (typeof type === "string") {
        return type;
      }

      break;
  }

  return null;
}

// Re-export dynamic flags from the internal module. Intentionally using *
// the exports object every time a flag is read.

var enablePersistentOffscreenHostContainer =
  dynamicFlags.enablePersistentOffscreenHostContainer; // The rest of the flags are static for better dead code elimination.
var enableProfilerTimer = true;
var enableProfilerCommitHooks = true;
var enableLazyElements = false;
var warnAboutStringRefs = false;
var enableNewReconciler = false;
var enableLazyContextPropagation = false;

// Don't change these two values. They're used by React Dev Tools.
var NoFlags =
  /*                      */
  0;
var PerformedWork =
  /*                */
  1; // You can change the rest (and add more).

var Placement =
  /*                    */
  2;
var Update =
  /*                       */
  4;
var PlacementAndUpdate =
  /*           */
  Placement | Update;
var ChildDeletion =
  /*                */
  16;
var ContentReset =
  /*                 */
  32;
var Callback =
  /*                     */
  64;
var DidCapture =
  /*                   */
  128;
var Ref =
  /*                          */
  256;
var Snapshot =
  /*                     */
  512;
var Passive =
  /*                      */
  1024;
var Hydrating =
  /*                    */
  2048;
var HydratingAndUpdate =
  /*           */
  Hydrating | Update;
var Visibility =
  /*                   */
  4096;
var LifecycleEffectMask = Passive | Update | Callback | Ref | Snapshot; // Union of all commit flags (flags with the lifetime of a particular commit)

var HostEffectMask =
  /*               */
  8191; // These are not really side effects, but we still reuse this field.

var Incomplete =
  /*                   */
  8192;
var ShouldCapture =
  /*                */
  16384;
var ForceUpdateForLegacySuspense =
  /* */
  32768;
// e.g. a fiber uses a passive effect (even if there are no updates on this particular render).
// This enables us to defer more work in the unmount case,
// since we can defer traversing the tree during layout to look for Passive effects,
// and instead rely on the static flag as a signal that there may be cleanup work.

var RefStatic =
  /*                    */
  262144;
var LayoutStatic =
  /*                 */
  524288;
var PassiveStatic =
  /*                */
  1048576; // These flags allow us to traverse to fibers that have effects on mount
// without traversing the entire tree after every commit for
// double invoking

var MountLayoutDev =
  /*               */
  2097152;
var MountPassiveDev =
  /*              */
  4194304; // Groups of flags that are used in the commit phase to skip over trees that
// don't contain effects, by checking subtreeFlags.

var BeforeMutationMask = // TODO: Remove Update flag from before mutation phase by re-landing Visibility
  // flag logic (see #20043)
  Update | Snapshot | 0;
var MutationMask =
  Placement |
  Update |
  ChildDeletion |
  ContentReset |
  Ref |
  Hydrating |
  Visibility;
var LayoutMask = Update | Callback | Ref | Visibility; // TODO: Split into PassiveMountMask and PassiveUnmountMask

var PassiveMask = Passive | ChildDeletion; // Union of tags that don't get reset on clones.
// This allows certain concepts to persist without recalculating them,
// e.g. whether a subtree contains passive effects or portals.

var StaticMask = LayoutStatic | PassiveStatic | RefStatic;

var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
function getNearestMountedFiber(fiber) {
  var node = fiber;
  var nearestMounted = fiber;

  if (!fiber.alternate) {
    // If there is no alternate, this might be a new tree that isn't inserted
    // yet. If it is, then it will have a pending insertion effect on it.
    var nextNode = node;

    do {
      node = nextNode;

      if ((node.flags & (Placement | Hydrating)) !== NoFlags) {
        // This is an insertion or in-progress hydration. The nearest possible
        // mounted fiber is the parent but we need to continue to figure out
        // if that one is still mounted.
        nearestMounted = node.return;
      }

      nextNode = node.return;
    } while (nextNode);
  } else {
    while (node.return) {
      node = node.return;
    }
  }

  if (node.tag === HostRoot) {
    // TODO: Check if this was a nested HostRoot when used with
    // renderContainerIntoSubtree.
    return nearestMounted;
  } // If we didn't hit the root, that means that we're in an disconnected tree
  // that has been unmounted.

  return null;
}
function isFiberMounted(fiber) {
  return getNearestMountedFiber(fiber) === fiber;
}
function isMounted(component) {
  {
    var owner = ReactCurrentOwner.current;

    if (owner !== null && owner.tag === ClassComponent) {
      var ownerFiber = owner;
      var instance = ownerFiber.stateNode;

      if (!instance._warnedAboutRefsInRender) {
        error(
          "%s is accessing isMounted inside its render() function. " +
            "render() should be a pure function of props and state. It should " +
            "never access something that requires stale data from the previous " +
            "render, such as refs. Move this logic to componentDidMount and " +
            "componentDidUpdate instead.",
          getComponentNameFromFiber(ownerFiber) || "A component"
        );
      }

      instance._warnedAboutRefsInRender = true;
    }
  }

  var fiber = get(component);

  if (!fiber) {
    return false;
  }

  return getNearestMountedFiber(fiber) === fiber;
}

function assertIsMounted(fiber) {
  if (!(getNearestMountedFiber(fiber) === fiber)) {
    throw Error("Unable to find node on an unmounted component.");
  }
}

function findCurrentFiberUsingSlowPath(fiber) {
  var alternate = fiber.alternate;

  if (!alternate) {
    // If there is no alternate, then we only need to check if it is mounted.
    var nearestMounted = getNearestMountedFiber(fiber);

    if (!(nearestMounted !== null)) {
      throw Error("Unable to find node on an unmounted component.");
    }

    if (nearestMounted !== fiber) {
      return null;
    }

    return fiber;
  } // If we have two possible branches, we'll walk backwards up to the root
  // to see what path the root points to. On the way we may hit one of the
  // special cases and we'll deal with them.

  var a = fiber;
  var b = alternate;

  while (true) {
    var parentA = a.return;

    if (parentA === null) {
      // We're at the root.
      break;
    }

    var parentB = parentA.alternate;

    if (parentB === null) {
      // There is no alternate. This is an unusual case. Currently, it only
      // happens when a Suspense component is hidden. An extra fragment fiber
      // is inserted in between the Suspense fiber and its children. Skip
      // over this extra fragment fiber and proceed to the next parent.
      var nextParent = parentA.return;

      if (nextParent !== null) {
        a = b = nextParent;
        continue;
      } // If there's no parent, we're at the root.

      break;
    } // If both copies of the parent fiber point to the same child, we can
    // assume that the child is current. This happens when we bailout on low
    // priority: the bailed out fiber's child reuses the current child.

    if (parentA.child === parentB.child) {
      var child = parentA.child;

      while (child) {
        if (child === a) {
          // We've determined that A is the current branch.
          assertIsMounted(parentA);
          return fiber;
        }

        if (child === b) {
          // We've determined that B is the current branch.
          assertIsMounted(parentA);
          return alternate;
        }

        child = child.sibling;
      } // We should never have an alternate for any mounting node. So the only
      // way this could possibly happen is if this was unmounted, if at all.

      {
        throw Error("Unable to find node on an unmounted component.");
      }
    }

    if (a.return !== b.return) {
      // The return pointer of A and the return pointer of B point to different
      // fibers. We assume that return pointers never criss-cross, so A must
      // belong to the child set of A.return, and B must belong to the child
      // set of B.return.
      a = parentA;
      b = parentB;
    } else {
      // The return pointers point to the same fiber. We'll have to use the
      // default, slow path: scan the child sets of each parent alternate to see
      // which child belongs to which set.
      //
      // Search parent A's child set
      var didFindChild = false;
      var _child = parentA.child;

      while (_child) {
        if (_child === a) {
          didFindChild = true;
          a = parentA;
          b = parentB;
          break;
        }

        if (_child === b) {
          didFindChild = true;
          b = parentA;
          a = parentB;
          break;
        }

        _child = _child.sibling;
      }

      if (!didFindChild) {
        // Search parent B's child set
        _child = parentB.child;

        while (_child) {
          if (_child === a) {
            didFindChild = true;
            a = parentB;
            b = parentA;
            break;
          }

          if (_child === b) {
            didFindChild = true;
            b = parentB;
            a = parentA;
            break;
          }

          _child = _child.sibling;
        }

        if (!didFindChild) {
          throw Error(
            "Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue."
          );
        }
      }
    }

    if (!(a.alternate === b)) {
      throw Error(
        "Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue."
      );
    }
  } // If the root is not a host container, we're in a disconnected tree. I.e.
  // unmounted.

  if (!(a.tag === HostRoot)) {
    throw Error("Unable to find node on an unmounted component.");
  }

  if (a.stateNode.current === a) {
    // We've determined that A is the current branch.
    return fiber;
  } // Otherwise B has to be current branch.

  return alternate;
}
function findCurrentHostFiber(parent) {
  var currentParent = findCurrentFiberUsingSlowPath(parent);
  return currentParent !== null
    ? findCurrentHostFiberImpl(currentParent)
    : null;
}

function findCurrentHostFiberImpl(node) {
  // Next we'll drill down this component to find the first HostComponent/Text.
  if (node.tag === HostComponent || node.tag === HostText) {
    return node;
  }

  var child = node.child;

  while (child !== null) {
    var match = findCurrentHostFiberImpl(child);

    if (match !== null) {
      return match;
    }

    child = child.sibling;
  }

  return null;
}

// Modules provided by RN:
var emptyObject = {};
/**
 * Create a payload that contains all the updates between two sets of props.
 *
 * These helpers are all encapsulated into a single module, because they use
 * mutation as a performance optimization which leads to subtle shared
 * dependencies between the code paths. To avoid this mutable state leaking
 * across modules, I've kept them isolated to this module.
 */

// Tracks removed keys
var removedKeys = null;
var removedKeyCount = 0;
var deepDifferOptions = {
  unsafelyIgnoreFunctions: true
};

function defaultDiffer(prevProp, nextProp) {
  if (typeof nextProp !== "object" || nextProp === null) {
    // Scalars have already been checked for equality
    return true;
  } else {
    // For objects and arrays, the default diffing algorithm is a deep compare
    return ReactNativePrivateInterface.deepDiffer(
      prevProp,
      nextProp,
      deepDifferOptions
    );
  }
}

function restoreDeletedValuesInNestedArray(
  updatePayload,
  node,
  validAttributes
) {
  if (isArray(node)) {
    var i = node.length;

    while (i-- && removedKeyCount > 0) {
      restoreDeletedValuesInNestedArray(
        updatePayload,
        node[i],
        validAttributes
      );
    }
  } else if (node && removedKeyCount > 0) {
    var obj = node;

    for (var propKey in removedKeys) {
      if (!removedKeys[propKey]) {
        continue;
      }

      var nextProp = obj[propKey];

      if (nextProp === undefined) {
        continue;
      }

      var attributeConfig = validAttributes[propKey];

      if (!attributeConfig) {
        continue; // not a valid native prop
      }

      if (typeof nextProp === "function") {
        nextProp = true;
      }

      if (typeof nextProp === "undefined") {
        nextProp = null;
      }

      if (typeof attributeConfig !== "object") {
        // case: !Object is the default case
        updatePayload[propKey] = nextProp;
      } else if (
        typeof attributeConfig.diff === "function" ||
        typeof attributeConfig.process === "function"
      ) {
        // case: CustomAttributeConfiguration
        var nextValue =
          typeof attributeConfig.process === "function"
            ? attributeConfig.process(nextProp)
            : nextProp;
        updatePayload[propKey] = nextValue;
      }

      removedKeys[propKey] = false;
      removedKeyCount--;
    }
  }
}

function diffNestedArrayProperty(
  updatePayload,
  prevArray,
  nextArray,
  validAttributes
) {
  var minLength =
    prevArray.length < nextArray.length ? prevArray.length : nextArray.length;
  var i;

  for (i = 0; i < minLength; i++) {
    // Diff any items in the array in the forward direction. Repeated keys
    // will be overwritten by later values.
    updatePayload = diffNestedProperty(
      updatePayload,
      prevArray[i],
      nextArray[i],
      validAttributes
    );
  }

  for (; i < prevArray.length; i++) {
    // Clear out all remaining properties.
    updatePayload = clearNestedProperty(
      updatePayload,
      prevArray[i],
      validAttributes
    );
  }

  for (; i < nextArray.length; i++) {
    // Add all remaining properties.
    updatePayload = addNestedProperty(
      updatePayload,
      nextArray[i],
      validAttributes
    );
  }

  return updatePayload;
}

function diffNestedProperty(
  updatePayload,
  prevProp,
  nextProp,
  validAttributes
) {
  if (!updatePayload && prevProp === nextProp) {
    // If no properties have been added, then we can bail out quickly on object
    // equality.
    return updatePayload;
  }

  if (!prevProp || !nextProp) {
    if (nextProp) {
      return addNestedProperty(updatePayload, nextProp, validAttributes);
    }

    if (prevProp) {
      return clearNestedProperty(updatePayload, prevProp, validAttributes);
    }

    return updatePayload;
  }

  if (!isArray(prevProp) && !isArray(nextProp)) {
    // Both are leaves, we can diff the leaves.
    return diffProperties(updatePayload, prevProp, nextProp, validAttributes);
  }

  if (isArray(prevProp) && isArray(nextProp)) {
    // Both are arrays, we can diff the arrays.
    return diffNestedArrayProperty(
      updatePayload,
      prevProp,
      nextProp,
      validAttributes
    );
  }

  if (isArray(prevProp)) {
    return diffProperties(
      updatePayload, // $FlowFixMe - We know that this is always an object when the input is.
      ReactNativePrivateInterface.flattenStyle(prevProp), // $FlowFixMe - We know that this isn't an array because of above flow.
      nextProp,
      validAttributes
    );
  }

  return diffProperties(
    updatePayload,
    prevProp, // $FlowFixMe - We know that this is always an object when the input is.
    ReactNativePrivateInterface.flattenStyle(nextProp),
    validAttributes
  );
}
/**
 * addNestedProperty takes a single set of props and valid attribute
 * attribute configurations. It processes each prop and adds it to the
 * updatePayload.
 */

function addNestedProperty(updatePayload, nextProp, validAttributes) {
  if (!nextProp) {
    return updatePayload;
  }

  if (!isArray(nextProp)) {
    // Add each property of the leaf.
    return addProperties(updatePayload, nextProp, validAttributes);
  }

  for (var i = 0; i < nextProp.length; i++) {
    // Add all the properties of the array.
    updatePayload = addNestedProperty(
      updatePayload,
      nextProp[i],
      validAttributes
    );
  }

  return updatePayload;
}
/**
 * clearNestedProperty takes a single set of props and valid attributes. It
 * adds a null sentinel to the updatePayload, for each prop key.
 */

function clearNestedProperty(updatePayload, prevProp, validAttributes) {
  if (!prevProp) {
    return updatePayload;
  }

  if (!isArray(prevProp)) {
    // Add each property of the leaf.
    return clearProperties(updatePayload, prevProp, validAttributes);
  }

  for (var i = 0; i < prevProp.length; i++) {
    // Add all the properties of the array.
    updatePayload = clearNestedProperty(
      updatePayload,
      prevProp[i],
      validAttributes
    );
  }

  return updatePayload;
}
/**
 * diffProperties takes two sets of props and a set of valid attributes
 * and write to updatePayload the values that changed or were deleted.
 * If no updatePayload is provided, a new one is created and returned if
 * anything changed.
 */

function diffProperties(updatePayload, prevProps, nextProps, validAttributes) {
  var attributeConfig;
  var nextProp;
  var prevProp;

  for (var propKey in nextProps) {
    attributeConfig = validAttributes[propKey];

    if (!attributeConfig) {
      continue; // not a valid native prop
    }

    prevProp = prevProps[propKey];
    nextProp = nextProps[propKey]; // functions are converted to booleans as markers that the associated
    // events should be sent from native.

    if (typeof nextProp === "function") {
      nextProp = true; // If nextProp is not a function, then don't bother changing prevProp
      // since nextProp will win and go into the updatePayload regardless.

      if (typeof prevProp === "function") {
        prevProp = true;
      }
    } // An explicit value of undefined is treated as a null because it overrides
    // any other preceding value.

    if (typeof nextProp === "undefined") {
      nextProp = null;

      if (typeof prevProp === "undefined") {
        prevProp = null;
      }
    }

    if (removedKeys) {
      removedKeys[propKey] = false;
    }

    if (updatePayload && updatePayload[propKey] !== undefined) {
      // Something else already triggered an update to this key because another
      // value diffed. Since we're now later in the nested arrays our value is
      // more important so we need to calculate it and override the existing
      // value. It doesn't matter if nothing changed, we'll set it anyway.
      // Pattern match on: attributeConfig
      if (typeof attributeConfig !== "object") {
        // case: !Object is the default case
        updatePayload[propKey] = nextProp;
      } else if (
        typeof attributeConfig.diff === "function" ||
        typeof attributeConfig.process === "function"
      ) {
        // case: CustomAttributeConfiguration
        var nextValue =
          typeof attributeConfig.process === "function"
            ? attributeConfig.process(nextProp)
            : nextProp;
        updatePayload[propKey] = nextValue;
      }

      continue;
    }

    if (prevProp === nextProp) {
      continue; // nothing changed
    } // Pattern match on: attributeConfig

    if (typeof attributeConfig !== "object") {
      // case: !Object is the default case
      if (defaultDiffer(prevProp, nextProp)) {
        // a normal leaf has changed
        (updatePayload || (updatePayload = {}))[propKey] = nextProp;
      }
    } else if (
      typeof attributeConfig.diff === "function" ||
      typeof attributeConfig.process === "function"
    ) {
      // case: CustomAttributeConfiguration
      var shouldUpdate =
        prevProp === undefined ||
        (typeof attributeConfig.diff === "function"
          ? attributeConfig.diff(prevProp, nextProp)
          : defaultDiffer(prevProp, nextProp));

      if (shouldUpdate) {
        var _nextValue =
          typeof attributeConfig.process === "function"
            ? attributeConfig.process(nextProp)
            : nextProp;

        (updatePayload || (updatePayload = {}))[propKey] = _nextValue;
      }
    } else {
      // default: fallthrough case when nested properties are defined
      removedKeys = null;
      removedKeyCount = 0; // We think that attributeConfig is not CustomAttributeConfiguration at
      // this point so we assume it must be AttributeConfiguration.

      updatePayload = diffNestedProperty(
        updatePayload,
        prevProp,
        nextProp,
        attributeConfig
      );

      if (removedKeyCount > 0 && updatePayload) {
        restoreDeletedValuesInNestedArray(
          updatePayload,
          nextProp,
          attributeConfig
        );
        removedKeys = null;
      }
    }
  } // Also iterate through all the previous props to catch any that have been
  // removed and make sure native gets the signal so it can reset them to the
  // default.

  for (var _propKey in prevProps) {
    if (nextProps[_propKey] !== undefined) {
      continue; // we've already covered this key in the previous pass
    }

    attributeConfig = validAttributes[_propKey];

    if (!attributeConfig) {
      continue; // not a valid native prop
    }

    if (updatePayload && updatePayload[_propKey] !== undefined) {
      // This was already updated to a diff result earlier.
      continue;
    }

    prevProp = prevProps[_propKey];

    if (prevProp === undefined) {
      continue; // was already empty anyway
    } // Pattern match on: attributeConfig

    if (
      typeof attributeConfig !== "object" ||
      typeof attributeConfig.diff === "function" ||
      typeof attributeConfig.process === "function"
    ) {
      // case: CustomAttributeConfiguration | !Object
      // Flag the leaf property for removal by sending a sentinel.
      (updatePayload || (updatePayload = {}))[_propKey] = null;

      if (!removedKeys) {
        removedKeys = {};
      }

      if (!removedKeys[_propKey]) {
        removedKeys[_propKey] = true;
        removedKeyCount++;
      }
    } else {
      // default:
      // This is a nested attribute configuration where all the properties
      // were removed so we need to go through and clear out all of them.
      updatePayload = clearNestedProperty(
        updatePayload,
        prevProp,
        attributeConfig
      );
    }
  }

  return updatePayload;
}
/**
 * addProperties adds all the valid props to the payload after being processed.
 */

function addProperties(updatePayload, props, validAttributes) {
  // TODO: Fast path
  return diffProperties(updatePayload, emptyObject, props, validAttributes);
}
/**
 * clearProperties clears all the previous props by adding a null sentinel
 * to the payload for each valid key.
 */

function clearProperties(updatePayload, prevProps, validAttributes) {
  // TODO: Fast path
  return diffProperties(updatePayload, prevProps, emptyObject, validAttributes);
}

function create(props, validAttributes) {
  return addProperties(
    null, // updatePayload
    props,
    validAttributes
  );
}
function diff(prevProps, nextProps, validAttributes) {
  return diffProperties(
    null, // updatePayload
    prevProps,
    nextProps,
    validAttributes
  );
}

/**
 * In the future, we should cleanup callbacks by cancelling them instead of
 * using this.
 */
function mountSafeCallback_NOT_REALLY_SAFE(context, callback) {
  return function() {
    if (!callback) {
      return undefined;
    } // This protects against createClass() components.
    // We don't know if there is code depending on it.
    // We intentionally don't use isMounted() because even accessing
    // isMounted property on a React ES6 class will trigger a warning.

    if (typeof context.__isMounted === "boolean") {
      if (!context.__isMounted) {
        return undefined;
      }
    } // FIXME: there used to be other branches that protected
    // against unmounted host components. But RN host components don't
    // define isMounted() anymore, so those checks didn't do anything.
    // They caused false positive warning noise so we removed them:
    // https://github.com/facebook/react-native/issues/18868#issuecomment-413579095
    // However, this means that the callback is NOT guaranteed to be safe
    // for host components. The solution we should implement is to make
    // UIManager.measure() and similar calls truly cancelable. Then we
    // can change our own code calling them to cancel when something unmounts.

    return callback.apply(context, arguments);
  };
}
function warnForStyleProps(props, validAttributes) {
  {
    for (var key in validAttributes.style) {
      if (!(validAttributes[key] || props[key] === undefined)) {
        error(
          "You are setting the style `{ %s" +
            ": ... }` as a prop. You " +
            "should nest it in a style object. " +
            "E.g. `{ style: { %s" +
            ": ... } }`",
          key,
          key
        );
      }
    }
  }
}

var ReactNativeFiberHostComponent = /*#__PURE__*/ (function() {
  function ReactNativeFiberHostComponent(
    tag,
    viewConfig,
    internalInstanceHandleDEV
  ) {
    this._nativeTag = tag;
    this._children = [];
    this.viewConfig = viewConfig;

    {
      this._internalFiberInstanceHandleDEV = internalInstanceHandleDEV;
    }
  }

  var _proto = ReactNativeFiberHostComponent.prototype;

  _proto.blur = function blur() {
    ReactNativePrivateInterface.TextInputState.blurTextInput(this);
  };

  _proto.focus = function focus() {
    ReactNativePrivateInterface.TextInputState.focusTextInput(this);
  };

  _proto.measure = function measure(callback) {
    ReactNativePrivateInterface.UIManager.measure(
      this._nativeTag,
      mountSafeCallback_NOT_REALLY_SAFE(this, callback)
    );
  };

  _proto.measureInWindow = function measureInWindow(callback) {
    ReactNativePrivateInterface.UIManager.measureInWindow(
      this._nativeTag,
      mountSafeCallback_NOT_REALLY_SAFE(this, callback)
    );
  };

  _proto.measureLayout = function measureLayout(
    relativeToNativeNode,
    onSuccess,
    onFail
  ) /* currently unused */
  {
    var relativeNode;

    if (typeof relativeToNativeNode === "number") {
      // Already a node handle
      relativeNode = relativeToNativeNode;
    } else {
      var nativeNode = relativeToNativeNode;

      if (nativeNode._nativeTag) {
        relativeNode = nativeNode._nativeTag;
      }
    }

    if (relativeNode == null) {
      {
        error(
          "Warning: ref.measureLayout must be called with a node handle or a ref to a native component."
        );
      }

      return;
    }

    ReactNativePrivateInterface.UIManager.measureLayout(
      this._nativeTag,
      relativeNode,
      mountSafeCallback_NOT_REALLY_SAFE(this, onFail),
      mountSafeCallback_NOT_REALLY_SAFE(this, onSuccess)
    );
  };

  _proto.setNativeProps = function setNativeProps(nativeProps) {
    {
      warnForStyleProps(nativeProps, this.viewConfig.validAttributes);
    }

    var updatePayload = create(nativeProps, this.viewConfig.validAttributes); // Avoid the overhead of bridge calls if there's no update.
    // This is an expensive no-op for Android, and causes an unnecessary
    // view invalidation for certain components (eg RCTTextInput) on iOS.

    if (updatePayload != null) {
      ReactNativePrivateInterface.UIManager.updateView(
        this._nativeTag,
        this.viewConfig.uiViewClassName,
        updatePayload
      );
    }
  };

  return ReactNativeFiberHostComponent;
})(); // eslint-disable-next-line no-unused-expressions

// This module only exists as an ESM wrapper around the external CommonJS
var scheduleCallback = Scheduler.unstable_scheduleCallback;
var cancelCallback = Scheduler.unstable_cancelCallback;
var shouldYield = Scheduler.unstable_shouldYield;
var requestPaint = Scheduler.unstable_requestPaint;
var now = Scheduler.unstable_now;
var ImmediatePriority = Scheduler.unstable_ImmediatePriority;
var UserBlockingPriority = Scheduler.unstable_UserBlockingPriority;
var NormalPriority = Scheduler.unstable_NormalPriority;
var IdlePriority = Scheduler.unstable_IdlePriority;

var rendererID = null;
var injectedHook = null;
var hasLoggedError = false;
var isDevToolsPresent = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined";
function injectInternals(internals) {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined") {
    // No DevTools
    return false;
  }

  var hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;

  if (hook.isDisabled) {
    // This isn't a real property on the hook, but it can be set to opt out
    // of DevTools integration and associated warnings and logs.
    // https://github.com/facebook/react/issues/3877
    return true;
  }

  if (!hook.supportsFiber) {
    {
      error(
        "The installed version of React DevTools is too old and will not work " +
          "with the current version of React. Please update React DevTools. " +
          "https://reactjs.org/link/react-devtools"
      );
    } // DevTools exists, even though it doesn't support Fiber.

    return true;
  }

  try {
    rendererID = hook.inject(internals); // We have successfully injected, so now it is safe to set up hooks.

    injectedHook = hook;
  } catch (err) {
    // Catch all errors because it is unsafe to throw during initialization.
    {
      error("React instrumentation encountered an error: %s.", err);
    }
  }

  if (hook.checkDCE) {
    // This is the real DevTools.
    return true;
  } else {
    // This is likely a hook installed by Fast Refresh runtime.
    return false;
  }
}
function onScheduleRoot(root, children) {
  {
    if (
      injectedHook &&
      typeof injectedHook.onScheduleFiberRoot === "function"
    ) {
      try {
        injectedHook.onScheduleFiberRoot(rendererID, root, children);
      } catch (err) {
        if (!hasLoggedError) {
          hasLoggedError = true;

          error("React instrumentation encountered an error: %s", err);
        }
      }
    }
  }
}
function onCommitRoot(root, eventPriority) {
  if (injectedHook && typeof injectedHook.onCommitFiberRoot === "function") {
    try {
      var didError = (root.current.flags & DidCapture) === DidCapture;

      if (enableProfilerTimer) {
        var schedulerPriority;

        switch (eventPriority) {
          case DiscreteEventPriority:
            schedulerPriority = ImmediatePriority;
            break;

          case ContinuousEventPriority:
            schedulerPriority = UserBlockingPriority;
            break;

          case DefaultEventPriority:
            schedulerPriority = NormalPriority;
            break;

          case IdleEventPriority:
            schedulerPriority = IdlePriority;
            break;

          default:
            schedulerPriority = NormalPriority;
            break;
        }

        injectedHook.onCommitFiberRoot(
          rendererID,
          root,
          schedulerPriority,
          didError
        );
      } else {
        injectedHook.onCommitFiberRoot(rendererID, root, undefined, didError);
      }
    } catch (err) {
      {
        if (!hasLoggedError) {
          hasLoggedError = true;

          error("React instrumentation encountered an error: %s", err);
        }
      }
    }
  }
}
function onPostCommitRoot(root) {
  if (
    injectedHook &&
    typeof injectedHook.onPostCommitFiberRoot === "function"
  ) {
    try {
      injectedHook.onPostCommitFiberRoot(rendererID, root);
    } catch (err) {
      {
        if (!hasLoggedError) {
          hasLoggedError = true;

          error("React instrumentation encountered an error: %s", err);
        }
      }
    }
  }
}
function onCommitUnmount(fiber) {
  if (injectedHook && typeof injectedHook.onCommitFiberUnmount === "function") {
    try {
      injectedHook.onCommitFiberUnmount(rendererID, fiber);
    } catch (err) {
      {
        if (!hasLoggedError) {
          hasLoggedError = true;

          error("React instrumentation encountered an error: %s", err);
        }
      }
    }
  }
}

var NoMode =
  /*                         */
  0; // TODO: Remove ConcurrentMode by reading from the root tag instead

var ConcurrentMode =
  /*                 */
  1;
var ProfileMode =
  /*                    */
  2;
var DebugTracingMode =
  /*               */
  4;
var StrictLegacyMode =
  /*               */
  8;
var StrictEffectsMode =
  /*              */
  16;
var ConcurrentUpdatesByDefaultMode =
  /* */
  32;

// If those values are changed that package should be rebuilt and redeployed.

var TotalLanes = 31;
var NoLanes =
  /*                        */
  0;
var NoLane =
  /*                          */
  0;
var SyncLane =
  /*                        */
  1;
var InputContinuousHydrationLane =
  /*    */
  2;
var InputContinuousLane =
  /*            */
  4;
var DefaultHydrationLane =
  /*            */
  8;
var DefaultLane =
  /*                    */
  16;
var TransitionHydrationLane =
  /*                */
  32;
var TransitionLanes =
  /*                       */
  4194240;
var TransitionLane1 =
  /*                        */
  64;
var TransitionLane2 =
  /*                        */
  128;
var TransitionLane3 =
  /*                        */
  256;
var TransitionLane4 =
  /*                        */
  512;
var TransitionLane5 =
  /*                        */
  1024;
var TransitionLane6 =
  /*                        */
  2048;
var TransitionLane7 =
  /*                        */
  4096;
var TransitionLane8 =
  /*                        */
  8192;
var TransitionLane9 =
  /*                        */
  16384;
var TransitionLane10 =
  /*                       */
  32768;
var TransitionLane11 =
  /*                       */
  65536;
var TransitionLane12 =
  /*                       */
  131072;
var TransitionLane13 =
  /*                       */
  262144;
var TransitionLane14 =
  /*                       */
  524288;
var TransitionLane15 =
  /*                       */
  1048576;
var TransitionLane16 =
  /*                       */
  2097152;
var RetryLanes =
  /*                            */
  130023424;
var RetryLane1 =
  /*                             */
  4194304;
var RetryLane2 =
  /*                             */
  8388608;
var RetryLane3 =
  /*                             */
  16777216;
var RetryLane4 =
  /*                             */
  33554432;
var RetryLane5 =
  /*                             */
  67108864;
var SomeRetryLane = RetryLane1;
var SelectiveHydrationLane =
  /*          */
  134217728;
var NonIdleLanes =
  /*                                 */
  268435455;
var IdleHydrationLane =
  /*               */
  268435456;
var IdleLane =
  /*                       */
  536870912;
var OffscreenLane =
  /*                   */
  1073741824; // This function is used for the experimental scheduling profiler (react-devtools-scheduling-profiler)
var NoTimestamp = -1;
var nextTransitionLane = TransitionLane1;
var nextRetryLane = RetryLane1;

function getHighestPriorityLanes(lanes) {
  switch (getHighestPriorityLane(lanes)) {
    case SyncLane:
      return SyncLane;

    case InputContinuousHydrationLane:
      return InputContinuousHydrationLane;

    case InputContinuousLane:
      return InputContinuousLane;

    case DefaultHydrationLane:
      return DefaultHydrationLane;

    case DefaultLane:
      return DefaultLane;

    case TransitionHydrationLane:
      return TransitionHydrationLane;

    case TransitionLane1:
    case TransitionLane2:
    case TransitionLane3:
    case TransitionLane4:
    case TransitionLane5:
    case TransitionLane6:
    case TransitionLane7:
    case TransitionLane8:
    case TransitionLane9:
    case TransitionLane10:
    case TransitionLane11:
    case TransitionLane12:
    case TransitionLane13:
    case TransitionLane14:
    case TransitionLane15:
    case TransitionLane16:
      return lanes & TransitionLanes;

    case RetryLane1:
    case RetryLane2:
    case RetryLane3:
    case RetryLane4:
    case RetryLane5:
      return lanes & RetryLanes;

    case SelectiveHydrationLane:
      return SelectiveHydrationLane;

    case IdleHydrationLane:
      return IdleHydrationLane;

    case IdleLane:
      return IdleLane;

    case OffscreenLane:
      return OffscreenLane;

    default:
      {
        error("Should have found matching lanes. This is a bug in React.");
      } // This shouldn't be reachable, but as a fallback, return the entire bitmask.

      return lanes;
  }
}

function getNextLanes(root, wipLanes) {
  // Early bailout if there's no pending work left.
  var pendingLanes = root.pendingLanes;

  if (pendingLanes === NoLanes) {
    return NoLanes;
  }

  var nextLanes = NoLanes;
  var suspendedLanes = root.suspendedLanes;
  var pingedLanes = root.pingedLanes; // Do not work on any idle work until all the non-idle work has finished,
  // even if the work is suspended.

  var nonIdlePendingLanes = pendingLanes & NonIdleLanes;

  if (nonIdlePendingLanes !== NoLanes) {
    var nonIdleUnblockedLanes = nonIdlePendingLanes & ~suspendedLanes;

    if (nonIdleUnblockedLanes !== NoLanes) {
      nextLanes = getHighestPriorityLanes(nonIdleUnblockedLanes);
    } else {
      var nonIdlePingedLanes = nonIdlePendingLanes & pingedLanes;

      if (nonIdlePingedLanes !== NoLanes) {
        nextLanes = getHighestPriorityLanes(nonIdlePingedLanes);
      }
    }
  } else {
    // The only remaining work is Idle.
    var unblockedLanes = pendingLanes & ~suspendedLanes;

    if (unblockedLanes !== NoLanes) {
      nextLanes = getHighestPriorityLanes(unblockedLanes);
    } else {
      if (pingedLanes !== NoLanes) {
        nextLanes = getHighestPriorityLanes(pingedLanes);
      }
    }
  }

  if (nextLanes === NoLanes) {
    // This should only be reachable if we're suspended
    // TODO: Consider warning in this path if a fallback timer is not scheduled.
    return NoLanes;
  } // If we're already in the middle of a render, switching lanes will interrupt
  // it and we'll lose our progress. We should only do this if the new lanes are
  // higher priority.

  if (
    wipLanes !== NoLanes &&
    wipLanes !== nextLanes && // If we already suspended with a delay, then interrupting is fine. Don't
    // bother waiting until the root is complete.
    (wipLanes & suspendedLanes) === NoLanes
  ) {
    var nextLane = getHighestPriorityLane(nextLanes);
    var wipLane = getHighestPriorityLane(wipLanes);

    if (
      // Tests whether the next lane is equal or lower priority than the wip
      // one. This works because the bits decrease in priority as you go left.
      nextLane >= wipLane || // Default priority updates should not interrupt transition updates. The
      // only difference between default updates and transition updates is that
      // default updates do not support refresh transitions.
      (nextLane === DefaultLane && (wipLane & TransitionLanes) !== NoLanes)
    ) {
      // Keep working on the existing in-progress tree. Do not interrupt.
      return wipLanes;
    }
  }

  if ((root.current.mode & ConcurrentUpdatesByDefaultMode) !== NoMode);
  else if ((nextLanes & InputContinuousLane) !== NoLanes) {
    // When updates are sync by default, we entangle continuous priority updates
    // and default updates, so they render in the same batch. The only reason
    // they use separate lanes is because continuous updates should interrupt
    // transitions, but default updates should not.
    nextLanes |= pendingLanes & DefaultLane;
  } // Check for entangled lanes and add them to the batch.
  //
  // A lane is said to be entangled with another when it's not allowed to render
  // in a batch that does not also include the other lane. Typically we do this
  // when multiple updates have the same source, and we only want to respond to
  // the most recent event from that source.
  //
  // Note that we apply entanglements *after* checking for partial work above.
  // This means that if a lane is entangled during an interleaved event while
  // it's already rendering, we won't interrupt it. This is intentional, since
  // entanglement is usually "best effort": we'll try our best to render the
  // lanes in the same batch, but it's not worth throwing out partially
  // completed work in order to do it.
  // TODO: Reconsider this. The counter-argument is that the partial work
  // represents an intermediate state, which we don't want to show to the user.
  // And by spending extra time finishing it, we're increasing the amount of
  // time it takes to show the final state, which is what they are actually
  // waiting for.
  //
  // For those exceptions where entanglement is semantically important, like
  // useMutableSource, we should ensure that there is no partial work at the
  // time we apply the entanglement.

  var entangledLanes = root.entangledLanes;

  if (entangledLanes !== NoLanes) {
    var entanglements = root.entanglements;
    var lanes = nextLanes & entangledLanes;

    while (lanes > 0) {
      var index = pickArbitraryLaneIndex(lanes);
      var lane = 1 << index;
      nextLanes |= entanglements[index];
      lanes &= ~lane;
    }
  }

  return nextLanes;
}
function getMostRecentEventTime(root, lanes) {
  var eventTimes = root.eventTimes;
  var mostRecentEventTime = NoTimestamp;

  while (lanes > 0) {
    var index = pickArbitraryLaneIndex(lanes);
    var lane = 1 << index;
    var eventTime = eventTimes[index];

    if (eventTime > mostRecentEventTime) {
      mostRecentEventTime = eventTime;
    }

    lanes &= ~lane;
  }

  return mostRecentEventTime;
}

function computeExpirationTime(lane, currentTime) {
  switch (lane) {
    case SyncLane:
    case InputContinuousHydrationLane:
    case InputContinuousLane:
      // User interactions should expire slightly more quickly.
      //
      // NOTE: This is set to the corresponding constant as in Scheduler.js.
      // When we made it larger, a product metric in www regressed, suggesting
      // there's a user interaction that's being starved by a series of
      // synchronous updates. If that theory is correct, the proper solution is
      // to fix the starvation. However, this scenario supports the idea that
      // expiration times are an important safeguard when starvation
      // does happen.
      return currentTime + 250;

    case DefaultHydrationLane:
    case DefaultLane:
    case TransitionHydrationLane:
    case TransitionLane1:
    case TransitionLane2:
    case TransitionLane3:
    case TransitionLane4:
    case TransitionLane5:
    case TransitionLane6:
    case TransitionLane7:
    case TransitionLane8:
    case TransitionLane9:
    case TransitionLane10:
    case TransitionLane11:
    case TransitionLane12:
    case TransitionLane13:
    case TransitionLane14:
    case TransitionLane15:
    case TransitionLane16:
      return currentTime + 5000;

    case RetryLane1:
    case RetryLane2:
    case RetryLane3:
    case RetryLane4:
    case RetryLane5:
      // TODO: Retries should be allowed to expire if they are CPU bound for
      // too long, but when I made this change it caused a spike in browser
      // crashes. There must be some other underlying bug; not super urgent but
      // ideally should figure out why and fix it. Unfortunately we don't have
      // a repro for the crashes, only detected via production metrics.
      return NoTimestamp;

    case SelectiveHydrationLane:
    case IdleHydrationLane:
    case IdleLane:
    case OffscreenLane:
      // Anything idle priority or lower should never expire.
      return NoTimestamp;

    default:
      {
        error("Should have found matching lanes. This is a bug in React.");
      }

      return NoTimestamp;
  }
}

function markStarvedLanesAsExpired(root, currentTime) {
  // TODO: This gets called every time we yield. We can optimize by storing
  // the earliest expiration time on the root. Then use that to quickly bail out
  // of this function.
  var pendingLanes = root.pendingLanes;
  var suspendedLanes = root.suspendedLanes;
  var pingedLanes = root.pingedLanes;
  var expirationTimes = root.expirationTimes; // Iterate through the pending lanes and check if we've reached their
  // expiration time. If so, we'll assume the update is being starved and mark
  // it as expired to force it to finish.

  var lanes = pendingLanes;

  while (lanes > 0) {
    var index = pickArbitraryLaneIndex(lanes);
    var lane = 1 << index;
    var expirationTime = expirationTimes[index];

    if (expirationTime === NoTimestamp) {
      // Found a pending lane with no expiration time. If it's not suspended, or
      // if it's pinged, assume it's CPU-bound. Compute a new expiration time
      // using the current time.
      if (
        (lane & suspendedLanes) === NoLanes ||
        (lane & pingedLanes) !== NoLanes
      ) {
        // Assumes timestamps are monotonically increasing.
        expirationTimes[index] = computeExpirationTime(lane, currentTime);
      }
    } else if (expirationTime <= currentTime) {
      // This lane expired
      root.expiredLanes |= lane;
    }

    lanes &= ~lane;
  }
} // This returns the highest priority pending lanes regardless of whether they
function getLanesToRetrySynchronouslyOnError(root) {
  var everythingButOffscreen = root.pendingLanes & ~OffscreenLane;

  if (everythingButOffscreen !== NoLanes) {
    return everythingButOffscreen;
  }

  if (everythingButOffscreen & OffscreenLane) {
    return OffscreenLane;
  }

  return NoLanes;
}
function includesNonIdleWork(lanes) {
  return (lanes & NonIdleLanes) !== NoLanes;
}
function includesOnlyRetries(lanes) {
  return (lanes & RetryLanes) === lanes;
}
function includesOnlyTransitions(lanes) {
  return (lanes & TransitionLanes) === lanes;
}
function shouldTimeSlice(root, lanes) {
  if ((lanes & root.expiredLanes) !== NoLanes) {
    // At least one of these lanes expired. To prevent additional starvation,
    // finish rendering without yielding execution.
    return false;
  }

  if ((root.current.mode & ConcurrentUpdatesByDefaultMode) !== NoMode) {
    // Concurrent updates by default always use time slicing.
    return true;
  }

  var SyncDefaultLanes =
    InputContinuousHydrationLane |
    InputContinuousLane |
    DefaultHydrationLane |
    DefaultLane;
  return (lanes & SyncDefaultLanes) === NoLanes;
}
function isTransitionLane(lane) {
  return (lane & TransitionLanes) !== 0;
}
function claimNextTransitionLane() {
  // Cycle through the lanes, assigning each new transition to the next lane.
  // In most cases, this means every transition gets its own lane, until we
  // run out of lanes and cycle back to the beginning.
  var lane = nextTransitionLane;
  nextTransitionLane <<= 1;

  if ((nextTransitionLane & TransitionLanes) === 0) {
    nextTransitionLane = TransitionLane1;
  }

  return lane;
}
function claimNextRetryLane() {
  var lane = nextRetryLane;
  nextRetryLane <<= 1;

  if ((nextRetryLane & RetryLanes) === 0) {
    nextRetryLane = RetryLane1;
  }

  return lane;
}
function getHighestPriorityLane(lanes) {
  return lanes & -lanes;
}
function pickArbitraryLane(lanes) {
  // This wrapper function gets inlined. Only exists so to communicate that it
  // doesn't matter which bit is selected; you can pick any bit without
  // affecting the algorithms where its used. Here I'm using
  // getHighestPriorityLane because it requires the fewest operations.
  return getHighestPriorityLane(lanes);
}

function pickArbitraryLaneIndex(lanes) {
  return 31 - clz32(lanes);
}

function laneToIndex(lane) {
  return pickArbitraryLaneIndex(lane);
}

function includesSomeLane(a, b) {
  return (a & b) !== NoLanes;
}
function isSubsetOfLanes(set, subset) {
  return (set & subset) === subset;
}
function mergeLanes(a, b) {
  return a | b;
}
function removeLanes(set, subset) {
  return set & ~subset;
}
function intersectLanes(a, b) {
  return a & b;
} // Seems redundant, but it changes the type from a single lane (used for
// updates) to a group of lanes (used for flushing work).

function laneToLanes(lane) {
  return lane;
}
function createLaneMap(initial) {
  // Intentionally pushing one by one.
  // https://v8.dev/blog/elements-kinds#avoid-creating-holes
  var laneMap = [];

  for (var i = 0; i < TotalLanes; i++) {
    laneMap.push(initial);
  }

  return laneMap;
}
function markRootUpdated(root, updateLane, eventTime) {
  root.pendingLanes |= updateLane; // If there are any suspended transitions, it's possible this new update
  // could unblock them. Clear the suspended lanes so that we can try rendering
  // them again.
  //
  // TODO: We really only need to unsuspend only lanes that are in the
  // `subtreeLanes` of the updated fiber, or the update lanes of the return
  // path. This would exclude suspended updates in an unrelated sibling tree,
  // since there's no way for this update to unblock it.
  //
  // We don't do this if the incoming update is idle, because we never process
  // idle updates until after all the regular updates have finished; there's no
  // way it could unblock a transition.

  if (updateLane !== IdleLane) {
    root.suspendedLanes = NoLanes;
    root.pingedLanes = NoLanes;
  }

  var eventTimes = root.eventTimes;
  var index = laneToIndex(updateLane); // We can always overwrite an existing timestamp because we prefer the most
  // recent event, and we assume time is monotonically increasing.

  eventTimes[index] = eventTime;
}
function markRootSuspended(root, suspendedLanes) {
  root.suspendedLanes |= suspendedLanes;
  root.pingedLanes &= ~suspendedLanes; // The suspended lanes are no longer CPU-bound. Clear their expiration times.

  var expirationTimes = root.expirationTimes;
  var lanes = suspendedLanes;

  while (lanes > 0) {
    var index = pickArbitraryLaneIndex(lanes);
    var lane = 1 << index;
    expirationTimes[index] = NoTimestamp;
    lanes &= ~lane;
  }
}
function markRootPinged(root, pingedLanes, eventTime) {
  root.pingedLanes |= root.suspendedLanes & pingedLanes;
}
function markRootMutableRead(root, updateLane) {
  root.mutableReadLanes |= updateLane & root.pendingLanes;
}
function markRootFinished(root, remainingLanes) {
  var noLongerPendingLanes = root.pendingLanes & ~remainingLanes;
  root.pendingLanes = remainingLanes; // Let's try everything again

  root.suspendedLanes = 0;
  root.pingedLanes = 0;
  root.expiredLanes &= remainingLanes;
  root.mutableReadLanes &= remainingLanes;
  root.entangledLanes &= remainingLanes;

  var entanglements = root.entanglements;
  var eventTimes = root.eventTimes;
  var expirationTimes = root.expirationTimes; // Clear the lanes that no longer have pending work

  var lanes = noLongerPendingLanes;

  while (lanes > 0) {
    var index = pickArbitraryLaneIndex(lanes);
    var lane = 1 << index;
    entanglements[index] = NoLanes;
    eventTimes[index] = NoTimestamp;
    expirationTimes[index] = NoTimestamp;
    lanes &= ~lane;
  }
}
function markRootEntangled(root, entangledLanes) {
  // In addition to entangling each of the given lanes with each other, we also
  // have to consider _transitive_ entanglements. For each lane that is already
  // entangled with *any* of the given lanes, that lane is now transitively
  // entangled with *all* the given lanes.
  //
  // Translated: If C is entangled with A, then entangling A with B also
  // entangles C with B.
  //
  // If this is hard to grasp, it might help to intentionally break this
  // function and look at the tests that fail in ReactTransition-test.js. Try
  // commenting out one of the conditions below.
  var rootEntangledLanes = (root.entangledLanes |= entangledLanes);
  var entanglements = root.entanglements;
  var lanes = rootEntangledLanes;

  while (lanes) {
    var index = pickArbitraryLaneIndex(lanes);
    var lane = 1 << index;

    if (
      // Is this one of the newly entangled lanes?
      (lane & entangledLanes) | // Is this lane transitively entangled with the newly entangled lanes?
      (entanglements[index] & entangledLanes)
    ) {
      entanglements[index] |= entangledLanes;
    }

    lanes &= ~lane;
  }
}
function addFiberToLanesMap(root, fiber, lanes) {
  if (!isDevToolsPresent) {
    return;
  }

  var pendingUpdatersLaneMap = root.pendingUpdatersLaneMap;

  while (lanes > 0) {
    var index = laneToIndex(lanes);
    var lane = 1 << index;
    var updaters = pendingUpdatersLaneMap[index];
    updaters.add(fiber);
    lanes &= ~lane;
  }
}
function movePendingFibersToMemoized(root, lanes) {
  if (!isDevToolsPresent) {
    return;
  }

  var pendingUpdatersLaneMap = root.pendingUpdatersLaneMap;
  var memoizedUpdaters = root.memoizedUpdaters;

  while (lanes > 0) {
    var index = laneToIndex(lanes);
    var lane = 1 << index;
    var updaters = pendingUpdatersLaneMap[index];

    if (updaters.size > 0) {
      updaters.forEach(function(fiber) {
        var alternate = fiber.alternate;

        if (alternate === null || !memoizedUpdaters.has(alternate)) {
          memoizedUpdaters.add(fiber);
        }
      });
      updaters.clear();
    }

    lanes &= ~lane;
  }
}
var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback; // Count leading zeros. Only used on lanes, so assume input is an integer.
// Based on:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

var log = Math.log;
var LN2 = Math.LN2;

function clz32Fallback(lanes) {
  if (lanes === 0) {
    return 32;
  }

  return (31 - ((log(lanes) / LN2) | 0)) | 0;
}

var DiscreteEventPriority = SyncLane;
var ContinuousEventPriority = InputContinuousLane;
var DefaultEventPriority = DefaultLane;
var IdleEventPriority = IdleLane;
var currentUpdatePriority = NoLane;
function getCurrentUpdatePriority() {
  return currentUpdatePriority;
}
function setCurrentUpdatePriority(newPriority) {
  currentUpdatePriority = newPriority;
}
function higherEventPriority(a, b) {
  return a !== 0 && a < b ? a : b;
}
function lowerEventPriority(a, b) {
  return a === 0 || a > b ? a : b;
}
function isHigherEventPriority(a, b) {
  return a !== 0 && a < b;
}
function lanesToEventPriority(lanes) {
  var lane = getHighestPriorityLane(lanes);

  if (!isHigherEventPriority(DiscreteEventPriority, lane)) {
    return DiscreteEventPriority;
  }

  if (!isHigherEventPriority(ContinuousEventPriority, lane)) {
    return ContinuousEventPriority;
  }

  if (includesNonIdleWork(lane)) {
    return DefaultEventPriority;
  }

  return IdleEventPriority;
}

// can re-export everything from this module.

function shim() {
  {
    throw Error(
      "The current renderer does not support persistence. This error is likely caused by a bug in React. Please file an issue."
    );
  }
} // Persistence (when unsupported)

var supportsPersistence = false;
var getOffscreenContainerProps = shim;

// can re-export everything from this module.

function shim$1() {
  {
    throw Error(
      "The current renderer does not support hydration. This error is likely caused by a bug in React. Please file an issue."
    );
  }
} // Hydration (when unsupported)
var isSuspenseInstancePending = shim$1;
var isSuspenseInstanceFallback = shim$1;
var hydrateTextInstance = shim$1;
var errorHydratingContainer = shim$1;

var getViewConfigForType =
  ReactNativePrivateInterface.ReactNativeViewConfigRegistry.get;
var UPDATE_SIGNAL = {};

{
  Object.freeze(UPDATE_SIGNAL);
} // Counter for uniquely identifying views.
// % 10 === 1 means it is a rootTag.
// % 2 === 0 means it is a Fabric tag.

var nextReactTag = 3;

function allocateTag() {
  var tag = nextReactTag;

  if (tag % 10 === 1) {
    tag += 2;
  }

  nextReactTag = tag + 2;
  return tag;
}

function recursivelyUncacheFiberNode(node) {
  if (typeof node === "number") {
    // Leaf node (eg text)
    uncacheFiberNode(node);
  } else {
    uncacheFiberNode(node._nativeTag);

    node._children.forEach(recursivelyUncacheFiberNode);
  }
}
function appendInitialChild(parentInstance, child) {
  parentInstance._children.push(child);
}
function createInstance(
  type,
  props,
  rootContainerInstance,
  hostContext,
  internalInstanceHandle
) {
  var tag = allocateTag();
  var viewConfig = getViewConfigForType(type);

  {
    for (var key in viewConfig.validAttributes) {
      if (props.hasOwnProperty(key)) {
        ReactNativePrivateInterface.deepFreezeAndThrowOnMutationInDev(
          props[key]
        );
      }
    }
  }

  var updatePayload = create(props, viewConfig.validAttributes);
  ReactNativePrivateInterface.UIManager.createView(
    tag, // reactTag
    viewConfig.uiViewClassName, // viewName
    rootContainerInstance, // rootTag
    updatePayload // props
  );
  var component = new ReactNativeFiberHostComponent(
    tag,
    viewConfig,
    internalInstanceHandle
  );
  precacheFiberNode(internalInstanceHandle, tag);
  updateFiberProps(tag, props); // Not sure how to avoid this cast. Flow is okay if the component is defined
  // in the same file but if it's external it can't see the types.

  return component;
}
function createTextInstance(
  text,
  rootContainerInstance,
  hostContext,
  internalInstanceHandle
) {
  if (!hostContext.isInAParentText) {
    throw Error("Text strings must be rendered within a <Text> component.");
  }

  var tag = allocateTag();
  ReactNativePrivateInterface.UIManager.createView(
    tag, // reactTag
    "RCTRawText", // viewName
    rootContainerInstance, // rootTag
    {
      text: text
    } // props
  );
  precacheFiberNode(internalInstanceHandle, tag);
  return tag;
}
function finalizeInitialChildren(
  parentInstance,
  type,
  props,
  rootContainerInstance,
  hostContext
) {
  // Don't send a no-op message over the bridge.
  if (parentInstance._children.length === 0) {
    return false;
  } // Map from child objects to native tags.
  // Either way we need to pass a copy of the Array to prevent it from being frozen.

  var nativeTags = parentInstance._children.map(function(child) {
    return typeof child === "number"
      ? child // Leaf node (eg text)
      : child._nativeTag;
  });

  ReactNativePrivateInterface.UIManager.setChildren(
    parentInstance._nativeTag, // containerTag
    nativeTags // reactTags
  );
  return false;
}
function getRootHostContext(rootContainerInstance) {
  return {
    isInAParentText: false
  };
}
function getChildHostContext(parentHostContext, type, rootContainerInstance) {
  var prevIsInAParentText = parentHostContext.isInAParentText;
  var isInAParentText =
    type === "AndroidTextInput" || // Android
    type === "RCTMultilineTextInputView" || // iOS
    type === "RCTSinglelineTextInputView" || // iOS
    type === "RCTText" ||
    type === "RCTVirtualText";

  if (prevIsInAParentText !== isInAParentText) {
    return {
      isInAParentText: isInAParentText
    };
  } else {
    return parentHostContext;
  }
}
function getPublicInstance(instance) {
  return instance;
}
function prepareForCommit(containerInfo) {
  // Noop
  return null;
}
function prepareUpdate(
  instance,
  type,
  oldProps,
  newProps,
  rootContainerInstance,
  hostContext
) {
  return UPDATE_SIGNAL;
}
function resetAfterCommit(containerInfo) {
  // Noop
}
var scheduleTimeout = setTimeout;
var cancelTimeout = clearTimeout;
var noTimeout = -1;
function shouldSetTextContent(type, props) {
  // TODO (bvaughn) Revisit this decision.
  // Always returning false simplifies the createInstance() implementation,
  // But creates an additional child Fiber for raw text children.
  // No additional native views are created though.
  // It's not clear to me which is better so I'm deferring for now.
  // More context @ github.com/facebook/react/pull/8560#discussion_r92111303
  return false;
}
function getCurrentEventPriority() {
  return DefaultEventPriority;
} // -------------------
function appendChild(parentInstance, child) {
  var childTag = typeof child === "number" ? child : child._nativeTag;
  var children = parentInstance._children;
  var index = children.indexOf(child);

  if (index >= 0) {
    children.splice(index, 1);
    children.push(child);
    ReactNativePrivateInterface.UIManager.manageChildren(
      parentInstance._nativeTag, // containerTag
      [index], // moveFromIndices
      [children.length - 1], // moveToIndices
      [], // addChildReactTags
      [], // addAtIndices
      [] // removeAtIndices
    );
  } else {
    children.push(child);
    ReactNativePrivateInterface.UIManager.manageChildren(
      parentInstance._nativeTag, // containerTag
      [], // moveFromIndices
      [], // moveToIndices
      [childTag], // addChildReactTags
      [children.length - 1], // addAtIndices
      [] // removeAtIndices
    );
  }
}
function appendChildToContainer(parentInstance, child) {
  var childTag = typeof child === "number" ? child : child._nativeTag;
  ReactNativePrivateInterface.UIManager.setChildren(
    parentInstance, // containerTag
    [childTag] // reactTags
  );
}
function commitTextUpdate(textInstance, oldText, newText) {
  ReactNativePrivateInterface.UIManager.updateView(
    textInstance, // reactTag
    "RCTRawText", // viewName
    {
      text: newText
    } // props
  );
}
function commitUpdate(
  instance,
  updatePayloadTODO,
  type,
  oldProps,
  newProps,
  internalInstanceHandle
) {
  var viewConfig = instance.viewConfig;
  updateFiberProps(instance._nativeTag, newProps);
  var updatePayload = diff(oldProps, newProps, viewConfig.validAttributes); // Avoid the overhead of bridge calls if there's no update.
  // This is an expensive no-op for Android, and causes an unnecessary
  // view invalidation for certain components (eg RCTTextInput) on iOS.

  if (updatePayload != null) {
    ReactNativePrivateInterface.UIManager.updateView(
      instance._nativeTag, // reactTag
      viewConfig.uiViewClassName, // viewName
      updatePayload // props
    );
  }
}
function insertBefore(parentInstance, child, beforeChild) {
  var children = parentInstance._children;
  var index = children.indexOf(child); // Move existing child or add new child?

  if (index >= 0) {
    children.splice(index, 1);
    var beforeChildIndex = children.indexOf(beforeChild);
    children.splice(beforeChildIndex, 0, child);
    ReactNativePrivateInterface.UIManager.manageChildren(
      parentInstance._nativeTag, // containerID
      [index], // moveFromIndices
      [beforeChildIndex], // moveToIndices
      [], // addChildReactTags
      [], // addAtIndices
      [] // removeAtIndices
    );
  } else {
    var _beforeChildIndex = children.indexOf(beforeChild);

    children.splice(_beforeChildIndex, 0, child);
    var childTag = typeof child === "number" ? child : child._nativeTag;
    ReactNativePrivateInterface.UIManager.manageChildren(
      parentInstance._nativeTag, // containerID
      [], // moveFromIndices
      [], // moveToIndices
      [childTag], // addChildReactTags
      [_beforeChildIndex], // addAtIndices
      [] // removeAtIndices
    );
  }
}
function insertInContainerBefore(parentInstance, child, beforeChild) {
  // TODO (bvaughn): Remove this check when...
  // We create a wrapper object for the container in ReactNative render()
  // Or we refactor to remove wrapper objects entirely.
  // For more info on pros/cons see PR #8560 description.
  if (!(typeof parentInstance !== "number")) {
    throw Error("Container does not support insertBefore operation");
  }
}
function removeChild(parentInstance, child) {
  recursivelyUncacheFiberNode(child);
  var children = parentInstance._children;
  var index = children.indexOf(child);
  children.splice(index, 1);
  ReactNativePrivateInterface.UIManager.manageChildren(
    parentInstance._nativeTag, // containerID
    [], // moveFromIndices
    [], // moveToIndices
    [], // addChildReactTags
    [], // addAtIndices
    [index] // removeAtIndices
  );
}
function removeChildFromContainer(parentInstance, child) {
  recursivelyUncacheFiberNode(child);
  ReactNativePrivateInterface.UIManager.manageChildren(
    parentInstance, // containerID
    [], // moveFromIndices
    [], // moveToIndices
    [], // addChildReactTags
    [], // addAtIndices
    [0] // removeAtIndices
  );
}
function resetTextContent(instance) {
  // Noop
}
function hideInstance(instance) {
  var viewConfig = instance.viewConfig;
  var updatePayload = create(
    {
      style: {
        display: "none"
      }
    },
    viewConfig.validAttributes
  );
  ReactNativePrivateInterface.UIManager.updateView(
    instance._nativeTag,
    viewConfig.uiViewClassName,
    updatePayload
  );
}
function hideTextInstance(textInstance) {
  throw new Error("Not yet implemented.");
}
function unhideInstance(instance, props) {
  var viewConfig = instance.viewConfig;
  var updatePayload = diff(
    Object.assign({}, props, {
      style: [
        props.style,
        {
          display: "none"
        }
      ]
    }),
    props,
    viewConfig.validAttributes
  );
  ReactNativePrivateInterface.UIManager.updateView(
    instance._nativeTag,
    viewConfig.uiViewClassName,
    updatePayload
  );
}
function clearContainer(container) {
  // TODO Implement this for React Native
  // UIManager does not expose a "remove all" type method.
}
function unhideTextInstance(textInstance, text) {
  throw new Error("Not yet implemented.");
}
function makeClientIdInDEV(warnOnAccessInDEV) {
  throw new Error("Not yet implemented");
}
function preparePortalMount(portalInstance) {
  // noop
}

// Helpers to patch console.logs to avoid logging during side-effect free
// replaying on render function. This currently only patches the object
// lazily which won't cover if the log function was extracted eagerly.
// We could also eagerly patch the method.
var disabledDepth = 0;
var prevLog;
var prevInfo;
var prevWarn;
var prevError;
var prevGroup;
var prevGroupCollapsed;
var prevGroupEnd;

function disabledLog() {}

disabledLog.__reactDisabledLog = true;
function disableLogs() {
  {
    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      prevLog = console.log;
      prevInfo = console.info;
      prevWarn = console.warn;
      prevError = console.error;
      prevGroup = console.group;
      prevGroupCollapsed = console.groupCollapsed;
      prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

      var props = {
        configurable: true,
        enumerable: true,
        value: disabledLog,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        info: props,
        log: props,
        warn: props,
        error: props,
        group: props,
        groupCollapsed: props,
        groupEnd: props
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    disabledDepth++;
  }
}
function reenableLogs() {
  {
    disabledDepth--;

    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      var props = {
        configurable: true,
        enumerable: true,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        log: Object.assign({}, props, {
          value: prevLog
        }),
        info: Object.assign({}, props, {
          value: prevInfo
        }),
        warn: Object.assign({}, props, {
          value: prevWarn
        }),
        error: Object.assign({}, props, {
          value: prevError
        }),
        group: Object.assign({}, props, {
          value: prevGroup
        }),
        groupCollapsed: Object.assign({}, props, {
          value: prevGroupCollapsed
        }),
        groupEnd: Object.assign({}, props, {
          value: prevGroupEnd
        })
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    if (disabledDepth < 0) {
      error(
        "disabledDepth fell below zero. " +
          "This is a bug in React. Please file an issue."
      );
    }
  }
}

var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
function describeBuiltInComponentFrame(name, source, ownerFn) {
  {
    var ownerName = null;

    if (ownerFn) {
      ownerName = ownerFn.displayName || ownerFn.name || null;
    }

    return describeComponentFrame(name, source, ownerName);
  }
}
var componentFrameCache;

{
  var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
  componentFrameCache = new PossiblyWeakMap();
}
var BEFORE_SLASH_RE = /^(.*)[\\\/]/;

function describeComponentFrame(name, source, ownerName) {
  var sourceInfo = "";

  if (source) {
    var path = source.fileName;
    var fileName = path.replace(BEFORE_SLASH_RE, ""); // In DEV, include code for a common special case:
    // prefer "folder/index.js" instead of just "index.js".

    if (/^index\./.test(fileName)) {
      var match = path.match(BEFORE_SLASH_RE);

      if (match) {
        var pathBeforeSlash = match[1];

        if (pathBeforeSlash) {
          var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, "");
          fileName = folderName + "/" + fileName;
        }
      }
    }

    sourceInfo = " (at " + fileName + ":" + source.lineNumber + ")";
  } else if (ownerName) {
    sourceInfo = " (created by " + ownerName + ")";
  }

  return "\n    in " + (name || "Unknown") + sourceInfo;
}

function describeClassComponentFrame(ctor, source, ownerFn) {
  {
    return describeFunctionComponentFrame(ctor, source, ownerFn);
  }
}
function describeFunctionComponentFrame(fn, source, ownerFn) {
  {
    if (!fn) {
      return "";
    }

    var name = fn.displayName || fn.name || null;
    var ownerName = null;

    if (ownerFn) {
      ownerName = ownerFn.displayName || ownerFn.name || null;
    }

    return describeComponentFrame(name, source, ownerName);
  }
}

function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
  if (type == null) {
    return "";
  }

  if (typeof type === "function") {
    {
      return describeFunctionComponentFrame(type, source, ownerFn);
    }
  }

  if (typeof type === "string") {
    return describeBuiltInComponentFrame(type, source, ownerFn);
  }

  switch (type) {
    case REACT_SUSPENSE_TYPE:
      return describeBuiltInComponentFrame("Suspense", source, ownerFn);

    case REACT_SUSPENSE_LIST_TYPE:
      return describeBuiltInComponentFrame("SuspenseList", source, ownerFn);
  }

  if (typeof type === "object") {
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        return describeFunctionComponentFrame(type.render, source, ownerFn);

      case REACT_MEMO_TYPE:
        // Memo may contain any component type so we recursively resolve it.
        return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

      case REACT_LAZY_TYPE: {
        var lazyComponent = type;
        var payload = lazyComponent._payload;
        var init = lazyComponent._init;

        try {
          // Lazy may contain any component type so we recursively resolve it.
          return describeUnknownElementTypeFrameInDEV(
            init(payload),
            source,
            ownerFn
          );
        } catch (x) {}
      }
    }
  }

  return "";
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

var loggedTypeFailures = {};
var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentlyValidatingElement(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(
        element.type,
        element._source,
        owner ? owner.type : null
      );
      ReactDebugCurrentFrame.setExtraStackFrame(stack);
    } else {
      ReactDebugCurrentFrame.setExtraStackFrame(null);
    }
  }
}

function checkPropTypes(typeSpecs, values, location, componentName, element) {
  {
    // $FlowFixMe This is okay but Flow doesn't know it.
    var has = Function.call.bind(hasOwnProperty);

    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.

        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== "function") {
            var err = Error(
              (componentName || "React class") +
                ": " +
                location +
                " type `" +
                typeSpecName +
                "` is invalid; " +
                "it must be a function, usually from the `prop-types` package, but received `" +
                typeof typeSpecs[typeSpecName] +
                "`." +
                "This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
            );
            err.name = "Invariant Violation";
            throw err;
          }

          error$1 = typeSpecs[typeSpecName](
            values,
            typeSpecName,
            componentName,
            location,
            null,
            "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"
          );
        } catch (ex) {
          error$1 = ex;
        }

        if (error$1 && !(error$1 instanceof Error)) {
          setCurrentlyValidatingElement(element);

          error(
            "%s: type specification of %s" +
              " `%s` is invalid; the type checker " +
              "function must return `null` or an `Error` but returned a %s. " +
              "You may have forgotten to pass an argument to the type checker " +
              "creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and " +
              "shape all require an argument).",
            componentName || "React class",
            location,
            typeSpecName,
            typeof error$1
          );

          setCurrentlyValidatingElement(null);
        }

        if (
          error$1 instanceof Error &&
          !(error$1.message in loggedTypeFailures)
        ) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error$1.message] = true;
          setCurrentlyValidatingElement(element);

          error("Failed %s type: %s", location, error$1.message);

          setCurrentlyValidatingElement(null);
        }
      }
    }
  }
}

var valueStack = [];
var fiberStack;

{
  fiberStack = [];
}

var index = -1;

function createCursor(defaultValue) {
  return {
    current: defaultValue
  };
}

function pop(cursor, fiber) {
  if (index < 0) {
    {
      error("Unexpected pop.");
    }

    return;
  }

  {
    if (fiber !== fiberStack[index]) {
      error("Unexpected Fiber popped.");
    }
  }

  cursor.current = valueStack[index];
  valueStack[index] = null;

  {
    fiberStack[index] = null;
  }

  index--;
}

function push(cursor, value, fiber) {
  index++;
  valueStack[index] = cursor.current;

  {
    fiberStack[index] = fiber;
  }

  cursor.current = value;
}

var warnedAboutMissingGetChildContext;

{
  warnedAboutMissingGetChildContext = {};
}

var emptyContextObject = {};

{
  Object.freeze(emptyContextObject);
} // A cursor to the current merged context object on the stack.

var contextStackCursor = createCursor(emptyContextObject); // A cursor to a boolean indicating whether the context has changed.

var didPerformWorkStackCursor = createCursor(false); // Keep track of the previous context object that was on the stack.
// We use this to get access to the parent context after we have already
// pushed the next context provider, and now need to merge their contexts.

var previousContext = emptyContextObject;

function getUnmaskedContext(
  workInProgress,
  Component,
  didPushOwnContextIfProvider
) {
  {
    if (didPushOwnContextIfProvider && isContextProvider(Component)) {
      // If the fiber is a context provider itself, when we read its context
      // we may have already pushed its own child context on the stack. A context
      // provider should not "see" its own child context. Therefore we read the
      // previous (parent) context instead for a context provider.
      return previousContext;
    }

    return contextStackCursor.current;
  }
}

function cacheContext(workInProgress, unmaskedContext, maskedContext) {
  {
    var instance = workInProgress.stateNode;
    instance.__reactInternalMemoizedUnmaskedChildContext = unmaskedContext;
    instance.__reactInternalMemoizedMaskedChildContext = maskedContext;
  }
}

function getMaskedContext(workInProgress, unmaskedContext) {
  {
    var type = workInProgress.type;
    var contextTypes = type.contextTypes;

    if (!contextTypes) {
      return emptyContextObject;
    } // Avoid recreating masked context unless unmasked context has changed.
    // Failing to do this will result in unnecessary calls to componentWillReceiveProps.
    // This may trigger infinite loops if componentWillReceiveProps calls setState.

    var instance = workInProgress.stateNode;

    if (
      instance &&
      instance.__reactInternalMemoizedUnmaskedChildContext === unmaskedContext
    ) {
      return instance.__reactInternalMemoizedMaskedChildContext;
    }

    var context = {};

    for (var key in contextTypes) {
      context[key] = unmaskedContext[key];
    }

    {
      var name = getComponentNameFromFiber(workInProgress) || "Unknown";
      checkPropTypes(contextTypes, context, "context", name);
    } // Cache unmasked context so we can avoid recreating masked context unless necessary.
    // Context is created before the class component is instantiated so check for instance.

    if (instance) {
      cacheContext(workInProgress, unmaskedContext, context);
    }

    return context;
  }
}

function hasContextChanged() {
  {
    return didPerformWorkStackCursor.current;
  }
}

function isContextProvider(type) {
  {
    var childContextTypes = type.childContextTypes;
    return childContextTypes !== null && childContextTypes !== undefined;
  }
}

function popContext(fiber) {
  {
    pop(didPerformWorkStackCursor, fiber);
    pop(contextStackCursor, fiber);
  }
}

function popTopLevelContextObject(fiber) {
  {
    pop(didPerformWorkStackCursor, fiber);
    pop(contextStackCursor, fiber);
  }
}

function pushTopLevelContextObject(fiber, context, didChange) {
  {
    if (!(contextStackCursor.current === emptyContextObject)) {
      throw Error(
        "Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue."
      );
    }

    push(contextStackCursor, context, fiber);
    push(didPerformWorkStackCursor, didChange, fiber);
  }
}

function processChildContext(fiber, type, parentContext) {
  {
    var instance = fiber.stateNode;
    var childContextTypes = type.childContextTypes; // TODO (bvaughn) Replace this behavior with an invariant() in the future.
    // It has only been added in Fiber to match the (unintentional) behavior in Stack.

    if (typeof instance.getChildContext !== "function") {
      {
        var componentName = getComponentNameFromFiber(fiber) || "Unknown";

        if (!warnedAboutMissingGetChildContext[componentName]) {
          warnedAboutMissingGetChildContext[componentName] = true;

          error(
            "%s.childContextTypes is specified but there is no getChildContext() method " +
              "on the instance. You can either define getChildContext() on %s or remove " +
              "childContextTypes from it.",
            componentName,
            componentName
          );
        }
      }

      return parentContext;
    }

    var childContext = instance.getChildContext();

    for (var contextKey in childContext) {
      if (!(contextKey in childContextTypes)) {
        throw Error(
          (getComponentNameFromFiber(fiber) || "Unknown") +
            '.getChildContext(): key "' +
            contextKey +
            '" is not defined in childContextTypes.'
        );
      }
    }

    {
      var name = getComponentNameFromFiber(fiber) || "Unknown";
      checkPropTypes(childContextTypes, childContext, "child context", name);
    }

    return Object.assign({}, parentContext, childContext);
  }
}

function pushContextProvider(workInProgress) {
  {
    var instance = workInProgress.stateNode; // We push the context as early as possible to ensure stack integrity.
    // If the instance does not exist yet, we will push null at first,
    // and replace it on the stack later when invalidating the context.

    var memoizedMergedChildContext =
      (instance && instance.__reactInternalMemoizedMergedChildContext) ||
      emptyContextObject; // Remember the parent context so we can merge with it later.
    // Inherit the parent's did-perform-work value to avoid inadvertently blocking updates.

    previousContext = contextStackCursor.current;
    push(contextStackCursor, memoizedMergedChildContext, workInProgress);
    push(
      didPerformWorkStackCursor,
      didPerformWorkStackCursor.current,
      workInProgress
    );
    return true;
  }
}

function invalidateContextProvider(workInProgress, type, didChange) {
  {
    var instance = workInProgress.stateNode;

    if (!instance) {
      throw Error(
        "Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue."
      );
    }

    if (didChange) {
      // Merge parent and own context.
      // Skip this if we're not updating due to sCU.
      // This avoids unnecessarily recomputing memoized values.
      var mergedContext = processChildContext(
        workInProgress,
        type,
        previousContext
      );
      instance.__reactInternalMemoizedMergedChildContext = mergedContext; // Replace the old (or empty) context with the new one.
      // It is important to unwind the context in the reverse order.

      pop(didPerformWorkStackCursor, workInProgress);
      pop(contextStackCursor, workInProgress); // Now push the new context and mark that it has changed.

      push(contextStackCursor, mergedContext, workInProgress);
      push(didPerformWorkStackCursor, didChange, workInProgress);
    } else {
      pop(didPerformWorkStackCursor, workInProgress);
      push(didPerformWorkStackCursor, didChange, workInProgress);
    }
  }
}

function findCurrentUnmaskedContext(fiber) {
  {
    // Currently this is only used with renderSubtreeIntoContainer; not sure if it
    // makes sense elsewhere
    if (!(isFiberMounted(fiber) && fiber.tag === ClassComponent)) {
      throw Error(
        "Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue."
      );
    }

    var node = fiber;

    do {
      switch (node.tag) {
        case HostRoot:
          return node.stateNode.context;

        case ClassComponent: {
          var Component = node.type;

          if (isContextProvider(Component)) {
            return node.stateNode.__reactInternalMemoizedMergedChildContext;
          }

          break;
        }
      }

      node = node.return;
    } while (node !== null);

    {
      throw Error(
        "Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue."
      );
    }
  }
}

var LegacyRoot = 0;
var ConcurrentRoot = 1;

var syncQueue = null;
var includesLegacySyncCallbacks = false;
var isFlushingSyncQueue = false;
function scheduleSyncCallback(callback) {
  // Push this callback into an internal queue. We'll flush these either in
  // the next tick, or earlier if something calls `flushSyncCallbackQueue`.
  if (syncQueue === null) {
    syncQueue = [callback];
  } else {
    // Push onto existing queue. Don't need to schedule a callback because
    // we already scheduled one when we created the queue.
    syncQueue.push(callback);
  }
}
function scheduleLegacySyncCallback(callback) {
  includesLegacySyncCallbacks = true;
  scheduleSyncCallback(callback);
}
function flushSyncCallbacksOnlyInLegacyMode() {
  // Only flushes the queue if there's a legacy sync callback scheduled.
  // TODO: There's only a single type of callback: performSyncOnWorkOnRoot. So
  // it might make more sense for the queue to be a list of roots instead of a
  // list of generic callbacks. Then we can have two: one for legacy roots, one
  // for concurrent roots. And this method would only flush the legacy ones.
  if (includesLegacySyncCallbacks) {
    flushSyncCallbacks();
  }
}
function flushSyncCallbacks() {
  if (!isFlushingSyncQueue && syncQueue !== null) {
    // Prevent re-entrance.
    isFlushingSyncQueue = true;
    var i = 0;
    var previousUpdatePriority = getCurrentUpdatePriority();

    try {
      var isSync = true;
      var queue = syncQueue; // TODO: Is this necessary anymore? The only user code that runs in this
      // queue is in the render or commit phases.

      setCurrentUpdatePriority(DiscreteEventPriority);

      for (; i < queue.length; i++) {
        var callback = queue[i];

        do {
          callback = callback(isSync);
        } while (callback !== null);
      }

      syncQueue = null;
      includesLegacySyncCallbacks = false;
    } catch (error) {
      // If something throws, leave the remaining callbacks on the queue.
      if (syncQueue !== null) {
        syncQueue = syncQueue.slice(i + 1);
      } // Resume flushing in the next tick

      scheduleCallback(ImmediatePriority, flushSyncCallbacks);
      throw error;
    } finally {
      setCurrentUpdatePriority(previousUpdatePriority);
      isFlushingSyncQueue = false;
    }
  }

  return null;
}

var ReactVersion = "18.0.0-95d762e40-20210908";

var ReactCurrentBatchConfig = ReactSharedInternals.ReactCurrentBatchConfig;
var NoTransition = 0;
function requestCurrentTransition() {
  return ReactCurrentBatchConfig.transition;
}

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}

var objectIs = typeof Object.is === "function" ? Object.is : is;

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */

function shallowEqual(objA, objB) {
  if (objectIs(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  } // Test for A's keys different from B.

  for (var i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !objectIs(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

function describeFiber(fiber) {
  var owner = fiber._debugOwner ? fiber._debugOwner.type : null;
  var source = fiber._debugSource;

  switch (fiber.tag) {
    case HostComponent:
      return describeBuiltInComponentFrame(fiber.type, source, owner);

    case LazyComponent:
      return describeBuiltInComponentFrame("Lazy", source, owner);

    case SuspenseComponent:
      return describeBuiltInComponentFrame("Suspense", source, owner);

    case SuspenseListComponent:
      return describeBuiltInComponentFrame("SuspenseList", source, owner);

    case FunctionComponent:
    case IndeterminateComponent:
    case SimpleMemoComponent:
      return describeFunctionComponentFrame(fiber.type, source, owner);

    case ForwardRef:
      return describeFunctionComponentFrame(fiber.type.render, source, owner);

    case ClassComponent:
      return describeClassComponentFrame(fiber.type, source, owner);

    default:
      return "";
  }
}

function getStackByFiberInDevAndProd(workInProgress) {
  try {
    var info = "";
    var node = workInProgress;

    do {
      info += describeFiber(node);
      node = node.return;
    } while (node);

    return info;
  } catch (x) {
    return "\nError generating stack: " + x.message + "\n" + x.stack;
  }
}

var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
var current = null;
var isRendering = false;
function getCurrentFiberOwnerNameInDevOrNull() {
  {
    if (current === null) {
      return null;
    }

    var owner = current._debugOwner;

    if (owner !== null && typeof owner !== "undefined") {
      return getComponentNameFromFiber(owner);
    }
  }

  return null;
}

function getCurrentFiberStackInDev() {
  {
    if (current === null) {
      return "";
    } // Safe because if current fiber exists, we are reconciling,
    // and it is guaranteed to be the work-in-progress version.

    return getStackByFiberInDevAndProd(current);
  }
}

function resetCurrentFiber() {
  {
    ReactDebugCurrentFrame$1.getCurrentStack = null;
    current = null;
    isRendering = false;
  }
}
function setCurrentFiber(fiber) {
  {
    ReactDebugCurrentFrame$1.getCurrentStack = getCurrentFiberStackInDev;
    current = fiber;
    isRendering = false;
  }
}
function setIsRendering(rendering) {
  {
    isRendering = rendering;
  }
}
function getIsRendering() {
  {
    return isRendering;
  }
}

var ReactStrictModeWarnings = {
  recordUnsafeLifecycleWarnings: function(fiber, instance) {},
  flushPendingUnsafeLifecycleWarnings: function() {},
  recordLegacyContextWarning: function(fiber, instance) {},
  flushLegacyContextWarning: function() {},
  discardPendingWarnings: function() {}
};

{
  var findStrictRoot = function(fiber) {
    var maybeStrictRoot = null;
    var node = fiber;

    while (node !== null) {
      if (node.mode & StrictLegacyMode) {
        maybeStrictRoot = node;
      }

      node = node.return;
    }

    return maybeStrictRoot;
  };

  var setToSortedString = function(set) {
    var array = [];
    set.forEach(function(value) {
      array.push(value);
    });
    return array.sort().join(", ");
  };

  var pendingComponentWillMountWarnings = [];
  var pendingUNSAFE_ComponentWillMountWarnings = [];
  var pendingComponentWillReceivePropsWarnings = [];
  var pendingUNSAFE_ComponentWillReceivePropsWarnings = [];
  var pendingComponentWillUpdateWarnings = [];
  var pendingUNSAFE_ComponentWillUpdateWarnings = []; // Tracks components we have already warned about.

  var didWarnAboutUnsafeLifecycles = new Set();

  ReactStrictModeWarnings.recordUnsafeLifecycleWarnings = function(
    fiber,
    instance
  ) {
    // Dedupe strategy: Warn once per component.
    if (didWarnAboutUnsafeLifecycles.has(fiber.type)) {
      return;
    }

    if (
      typeof instance.componentWillMount === "function" && // Don't warn about react-lifecycles-compat polyfilled components.
      instance.componentWillMount.__suppressDeprecationWarning !== true
    ) {
      pendingComponentWillMountWarnings.push(fiber);
    }

    if (
      fiber.mode & StrictLegacyMode &&
      typeof instance.UNSAFE_componentWillMount === "function"
    ) {
      pendingUNSAFE_ComponentWillMountWarnings.push(fiber);
    }

    if (
      typeof instance.componentWillReceiveProps === "function" &&
      instance.componentWillReceiveProps.__suppressDeprecationWarning !== true
    ) {
      pendingComponentWillReceivePropsWarnings.push(fiber);
    }

    if (
      fiber.mode & StrictLegacyMode &&
      typeof instance.UNSAFE_componentWillReceiveProps === "function"
    ) {
      pendingUNSAFE_ComponentWillReceivePropsWarnings.push(fiber);
    }

    if (
      typeof instance.componentWillUpdate === "function" &&
      instance.componentWillUpdate.__suppressDeprecationWarning !== true
    ) {
      pendingComponentWillUpdateWarnings.push(fiber);
    }

    if (
      fiber.mode & StrictLegacyMode &&
      typeof instance.UNSAFE_componentWillUpdate === "function"
    ) {
      pendingUNSAFE_ComponentWillUpdateWarnings.push(fiber);
    }
  };

  ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings = function() {
    // We do an initial pass to gather component names
    var componentWillMountUniqueNames = new Set();

    if (pendingComponentWillMountWarnings.length > 0) {
      pendingComponentWillMountWarnings.forEach(function(fiber) {
        componentWillMountUniqueNames.add(
          getComponentNameFromFiber(fiber) || "Component"
        );
        didWarnAboutUnsafeLifecycles.add(fiber.type);
      });
      pendingComponentWillMountWarnings = [];
    }

    var UNSAFE_componentWillMountUniqueNames = new Set();

    if (pendingUNSAFE_ComponentWillMountWarnings.length > 0) {
      pendingUNSAFE_ComponentWillMountWarnings.forEach(function(fiber) {
        UNSAFE_componentWillMountUniqueNames.add(
          getComponentNameFromFiber(fiber) || "Component"
        );
        didWarnAboutUnsafeLifecycles.add(fiber.type);
      });
      pendingUNSAFE_ComponentWillMountWarnings = [];
    }

    var componentWillReceivePropsUniqueNames = new Set();

    if (pendingComponentWillReceivePropsWarnings.length > 0) {
      pendingComponentWillReceivePropsWarnings.forEach(function(fiber) {
        componentWillReceivePropsUniqueNames.add(
          getComponentNameFromFiber(fiber) || "Component"
        );
        didWarnAboutUnsafeLifecycles.add(fiber.type);
      });
      pendingComponentWillReceivePropsWarnings = [];
    }

    var UNSAFE_componentWillReceivePropsUniqueNames = new Set();

    if (pendingUNSAFE_ComponentWillReceivePropsWarnings.length > 0) {
      pendingUNSAFE_ComponentWillReceivePropsWarnings.forEach(function(fiber) {
        UNSAFE_componentWillReceivePropsUniqueNames.add(
          getComponentNameFromFiber(fiber) || "Component"
        );
        didWarnAboutUnsafeLifecycles.add(fiber.type);
      });
      pendingUNSAFE_ComponentWillReceivePropsWarnings = [];
    }

    var componentWillUpdateUniqueNames = new Set();

    if (pendingComponentWillUpdateWarnings.length > 0) {
      pendingComponentWillUpdateWarnings.forEach(function(fiber) {
        componentWillUpdateUniqueNames.add(
          getComponentNameFromFiber(fiber) || "Component"
        );
        didWarnAboutUnsafeLifecycles.add(fiber.type);
      });
      pendingComponentWillUpdateWarnings = [];
    }

    var UNSAFE_componentWillUpdateUniqueNames = new Set();

    if (pendingUNSAFE_ComponentWillUpdateWarnings.length > 0) {
      pendingUNSAFE_ComponentWillUpdateWarnings.forEach(function(fiber) {
        UNSAFE_componentWillUpdateUniqueNames.add(
          getComponentNameFromFiber(fiber) || "Component"
        );
        didWarnAboutUnsafeLifecycles.add(fiber.type);
      });
      pendingUNSAFE_ComponentWillUpdateWarnings = [];
    } // Finally, we flush all the warnings
    // UNSAFE_ ones before the deprecated ones, since they'll be 'louder'

    if (UNSAFE_componentWillMountUniqueNames.size > 0) {
      var sortedNames = setToSortedString(UNSAFE_componentWillMountUniqueNames);

      error(
        "Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. " +
          "See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n" +
          "* Move code with side effects to componentDidMount, and set initial state in the constructor.\n" +
          "\nPlease update the following components: %s",
        sortedNames
      );
    }

    if (UNSAFE_componentWillReceivePropsUniqueNames.size > 0) {
      var _sortedNames = setToSortedString(
        UNSAFE_componentWillReceivePropsUniqueNames
      );

      error(
        "Using UNSAFE_componentWillReceiveProps in strict mode is not recommended " +
          "and may indicate bugs in your code. " +
          "See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n" +
          "* Move data fetching code or side effects to componentDidUpdate.\n" +
          "* If you're updating state whenever props change, " +
          "refactor your code to use memoization techniques or move it to " +
          "static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state\n" +
          "\nPlease update the following components: %s",
        _sortedNames
      );
    }

    if (UNSAFE_componentWillUpdateUniqueNames.size > 0) {
      var _sortedNames2 = setToSortedString(
        UNSAFE_componentWillUpdateUniqueNames
      );

      error(
        "Using UNSAFE_componentWillUpdate in strict mode is not recommended " +
          "and may indicate bugs in your code. " +
          "See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n" +
          "* Move data fetching code or side effects to componentDidUpdate.\n" +
          "\nPlease update the following components: %s",
        _sortedNames2
      );
    }

    if (componentWillMountUniqueNames.size > 0) {
      var _sortedNames3 = setToSortedString(componentWillMountUniqueNames);

      warn(
        "componentWillMount has been renamed, and is not recommended for use. " +
          "See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n" +
          "* Move code with side effects to componentDidMount, and set initial state in the constructor.\n" +
          "* Rename componentWillMount to UNSAFE_componentWillMount to suppress " +
          "this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. " +
          "To rename all deprecated lifecycles to their new names, you can run " +
          "`npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n" +
          "\nPlease update the following components: %s",
        _sortedNames3
      );
    }

    if (componentWillReceivePropsUniqueNames.size > 0) {
      var _sortedNames4 = setToSortedString(
        componentWillReceivePropsUniqueNames
      );

      warn(
        "componentWillReceiveProps has been renamed, and is not recommended for use. " +
          "See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n" +
          "* Move data fetching code or side effects to componentDidUpdate.\n" +
          "* If you're updating state whenever props change, refactor your " +
          "code to use memoization techniques or move it to " +
          "static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state\n" +
          "* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress " +
          "this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. " +
          "To rename all deprecated lifecycles to their new names, you can run " +
          "`npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n" +
          "\nPlease update the following components: %s",
        _sortedNames4
      );
    }

    if (componentWillUpdateUniqueNames.size > 0) {
      var _sortedNames5 = setToSortedString(componentWillUpdateUniqueNames);

      warn(
        "componentWillUpdate has been renamed, and is not recommended for use. " +
          "See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n" +
          "* Move data fetching code or side effects to componentDidUpdate.\n" +
          "* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress " +
          "this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. " +
          "To rename all deprecated lifecycles to their new names, you can run " +
          "`npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n" +
          "\nPlease update the following components: %s",
        _sortedNames5
      );
    }
  };

  var pendingLegacyContextWarning = new Map(); // Tracks components we have already warned about.

  var didWarnAboutLegacyContext = new Set();

  ReactStrictModeWarnings.recordLegacyContextWarning = function(
    fiber,
    instance
  ) {
    var strictRoot = findStrictRoot(fiber);

    if (strictRoot === null) {
      error(
        "Expected to find a StrictMode component in a strict mode tree. " +
          "This error is likely caused by a bug in React. Please file an issue."
      );

      return;
    } // Dedup strategy: Warn once per component.

    if (didWarnAboutLegacyContext.has(fiber.type)) {
      return;
    }

    var warningsForRoot = pendingLegacyContextWarning.get(strictRoot);

    if (
      fiber.type.contextTypes != null ||
      fiber.type.childContextTypes != null ||
      (instance !== null && typeof instance.getChildContext === "function")
    ) {
      if (warningsForRoot === undefined) {
        warningsForRoot = [];
        pendingLegacyContextWarning.set(strictRoot, warningsForRoot);
      }

      warningsForRoot.push(fiber);
    }
  };

  ReactStrictModeWarnings.flushLegacyContextWarning = function() {
    pendingLegacyContextWarning.forEach(function(fiberArray, strictRoot) {
      if (fiberArray.length === 0) {
        return;
      }

      var firstFiber = fiberArray[0];
      var uniqueNames = new Set();
      fiberArray.forEach(function(fiber) {
        uniqueNames.add(getComponentNameFromFiber(fiber) || "Component");
        didWarnAboutLegacyContext.add(fiber.type);
      });
      var sortedNames = setToSortedString(uniqueNames);

      try {
        setCurrentFiber(firstFiber);

        error(
          "Legacy context API has been detected within a strict-mode tree." +
            "\n\nThe old API will be supported in all 16.x releases, but applications " +
            "using it should migrate to the new version." +
            "\n\nPlease update the following components: %s" +
            "\n\nLearn more about this warning here: https://reactjs.org/link/legacy-context",
          sortedNames
        );
      } finally {
        resetCurrentFiber();
      }
    });
  };

  ReactStrictModeWarnings.discardPendingWarnings = function() {
    pendingComponentWillMountWarnings = [];
    pendingUNSAFE_ComponentWillMountWarnings = [];
    pendingComponentWillReceivePropsWarnings = [];
    pendingUNSAFE_ComponentWillReceivePropsWarnings = [];
    pendingComponentWillUpdateWarnings = [];
    pendingUNSAFE_ComponentWillUpdateWarnings = [];
    pendingLegacyContextWarning = new Map();
  };
}

function resolveDefaultProps(Component, baseProps) {
  if (Component && Component.defaultProps) {
    // Resolve default props. Taken from ReactElement
    var props = Object.assign({}, baseProps);
    var defaultProps = Component.defaultProps;

    for (var propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }

    return props;
  }

  return baseProps;
}

var valueCursor = createCursor(null);
var rendererSigil;

{
  // Use this to detect multiple renderers using the same context
  rendererSigil = {};
}

var currentlyRenderingFiber = null;
var lastContextDependency = null;
var lastFullyObservedContext = null;
var isDisallowedContextReadInDEV = false;
function resetContextDependencies() {
  // This is called right before React yields execution, to ensure `readContext`
  // cannot be called outside the render phase.
  currentlyRenderingFiber = null;
  lastContextDependency = null;
  lastFullyObservedContext = null;

  {
    isDisallowedContextReadInDEV = false;
  }
}
function enterDisallowedContextReadInDEV() {
  {
    isDisallowedContextReadInDEV = true;
  }
}
function exitDisallowedContextReadInDEV() {
  {
    isDisallowedContextReadInDEV = false;
  }
}
function pushProvider(providerFiber, context, nextValue) {
  {
    push(valueCursor, context._currentValue, providerFiber);
    context._currentValue = nextValue;

    {
      if (
        context._currentRenderer !== undefined &&
        context._currentRenderer !== null &&
        context._currentRenderer !== rendererSigil
      ) {
        error(
          "Detected multiple renderers concurrently rendering the " +
            "same context provider. This is currently unsupported."
        );
      }

      context._currentRenderer = rendererSigil;
    }
  }
}
function popProvider(context, providerFiber) {
  var currentValue = valueCursor.current;
  pop(valueCursor, providerFiber);

  {
    context._currentValue = currentValue;
  }
}
function scheduleWorkOnParentPath(parent, renderLanes) {
  // Update the child lanes of all the ancestors, including the alternates.
  var node = parent;

  while (node !== null) {
    var alternate = node.alternate;

    if (!isSubsetOfLanes(node.childLanes, renderLanes)) {
      node.childLanes = mergeLanes(node.childLanes, renderLanes);

      if (alternate !== null) {
        alternate.childLanes = mergeLanes(alternate.childLanes, renderLanes);
      }
    } else if (
      alternate !== null &&
      !isSubsetOfLanes(alternate.childLanes, renderLanes)
    ) {
      alternate.childLanes = mergeLanes(alternate.childLanes, renderLanes);
    } else {
      // Neither alternate was updated, which means the rest of the
      // ancestor path already has sufficient priority.
      break;
    }

    node = node.return;
  }
}
function propagateContextChange(workInProgress, context, renderLanes) {
  {
    propagateContextChange_eager(workInProgress, context, renderLanes);
  }
}

function propagateContextChange_eager(workInProgress, context, renderLanes) {
  var fiber = workInProgress.child;

  if (fiber !== null) {
    // Set the return pointer of the child to the work-in-progress fiber.
    fiber.return = workInProgress;
  }

  while (fiber !== null) {
    var nextFiber = void 0; // Visit this fiber.

    var list = fiber.dependencies;

    if (list !== null) {
      nextFiber = fiber.child;
      var dependency = list.firstContext;

      while (dependency !== null) {
        // Check if the context matches.
        if (dependency.context === context) {
          // Match! Schedule an update on this fiber.
          if (fiber.tag === ClassComponent) {
            // Schedule a force update on the work-in-progress.
            var lane = pickArbitraryLane(renderLanes);
            var update = createUpdate(NoTimestamp, lane);
            update.tag = ForceUpdate; // TODO: Because we don't have a work-in-progress, this will add the
            // update to the current fiber, too, which means it will persist even if
            // this render is thrown away. Since it's a race condition, not sure it's
            // worth fixing.
            // Inlined `enqueueUpdate` to remove interleaved update check

            var updateQueue = fiber.updateQueue;

            if (updateQueue === null);
            else {
              var sharedQueue = updateQueue.shared;
              var pending = sharedQueue.pending;

              if (pending === null) {
                // This is the first update. Create a circular list.
                update.next = update;
              } else {
                update.next = pending.next;
                pending.next = update;
              }

              sharedQueue.pending = update;
            }
          }

          fiber.lanes = mergeLanes(fiber.lanes, renderLanes);
          var alternate = fiber.alternate;

          if (alternate !== null) {
            alternate.lanes = mergeLanes(alternate.lanes, renderLanes);
          }

          scheduleWorkOnParentPath(fiber.return, renderLanes); // Mark the updated lanes on the list, too.

          list.lanes = mergeLanes(list.lanes, renderLanes); // Since we already found a match, we can stop traversing the
          // dependency list.

          break;
        }

        dependency = dependency.next;
      }
    } else if (fiber.tag === ContextProvider) {
      // Don't scan deeper if this is a matching provider
      nextFiber = fiber.type === workInProgress.type ? null : fiber.child;
    } else {
      // Traverse down.
      nextFiber = fiber.child;
    }

    if (nextFiber !== null) {
      // Set the return pointer of the child to the work-in-progress fiber.
      nextFiber.return = fiber;
    } else {
      // No child. Traverse to next sibling.
      nextFiber = fiber;

      while (nextFiber !== null) {
        if (nextFiber === workInProgress) {
          // We're back to the root of this subtree. Exit.
          nextFiber = null;
          break;
        }

        var sibling = nextFiber.sibling;

        if (sibling !== null) {
          // Set the return pointer of the sibling to the work-in-progress fiber.
          sibling.return = nextFiber.return;
          nextFiber = sibling;
          break;
        } // No more siblings. Traverse up.

        nextFiber = nextFiber.return;
      }
    }

    fiber = nextFiber;
  }
}
function prepareToReadContext(workInProgress, renderLanes) {
  currentlyRenderingFiber = workInProgress;
  lastContextDependency = null;
  lastFullyObservedContext = null;
  var dependencies = workInProgress.dependencies;

  if (dependencies !== null) {
    {
      var firstContext = dependencies.firstContext;

      if (firstContext !== null) {
        if (includesSomeLane(dependencies.lanes, renderLanes)) {
          // Context list has a pending update. Mark that this fiber performed work.
          markWorkInProgressReceivedUpdate();
        } // Reset the work-in-progress list

        dependencies.firstContext = null;
      }
    }
  }
}
function readContext(context) {
  {
    // This warning would fire if you read context inside a Hook like useMemo.
    // Unlike the class check below, it's not enforced in production for perf.
    if (isDisallowedContextReadInDEV) {
      error(
        "Context can only be read while React is rendering. " +
          "In classes, you can read it in the render method or getDerivedStateFromProps. " +
          "In function components, you can read it directly in the function body, but not " +
          "inside Hooks like useReducer() or useMemo()."
      );
    }
  }

  var value = context._currentValue;

  if (lastFullyObservedContext === context);
  else {
    var contextItem = {
      context: context,
      memoizedValue: value,
      next: null
    };

    if (lastContextDependency === null) {
      if (!(currentlyRenderingFiber !== null)) {
        throw Error(
          "Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."
        );
      } // This is the first dependency for this component. Create a new list.

      lastContextDependency = contextItem;
      currentlyRenderingFiber.dependencies = {
        lanes: NoLanes,
        firstContext: contextItem
      };
    } else {
      // Append a new context item.
      lastContextDependency = lastContextDependency.next = contextItem;
    }
  }

  return value;
}

// An array of all update queues that received updates during the current
// render. When this render exits, either because it finishes or because it is
// interrupted, the interleaved updates will be transferred onto the main part
// of the queue.
var interleavedQueues = null;
function pushInterleavedQueue(queue) {
  if (interleavedQueues === null) {
    interleavedQueues = [queue];
  } else {
    interleavedQueues.push(queue);
  }
}
function enqueueInterleavedUpdates() {
  // Transfer the interleaved updates onto the main queue. Each queue has a
  // `pending` field and an `interleaved` field. When they are not null, they
  // point to the last node in a circular linked list. We need to append the
  // interleaved list to the end of the pending list by joining them into a
  // single, circular list.
  if (interleavedQueues !== null) {
    for (var i = 0; i < interleavedQueues.length; i++) {
      var queue = interleavedQueues[i];
      var lastInterleavedUpdate = queue.interleaved;

      if (lastInterleavedUpdate !== null) {
        queue.interleaved = null;
        var firstInterleavedUpdate = lastInterleavedUpdate.next;
        var lastPendingUpdate = queue.pending;

        if (lastPendingUpdate !== null) {
          var firstPendingUpdate = lastPendingUpdate.next;
          lastPendingUpdate.next = firstInterleavedUpdate;
          lastInterleavedUpdate.next = firstPendingUpdate;
        }

        queue.pending = lastInterleavedUpdate;
      }
    }

    interleavedQueues = null;
  }
}

var UpdateState = 0;
var ReplaceState = 1;
var ForceUpdate = 2;
var CaptureUpdate = 3; // Global state that is reset at the beginning of calling `processUpdateQueue`.
// It should only be read right after calling `processUpdateQueue`, via
// `checkHasForceUpdateAfterProcessing`.

var hasForceUpdate = false;
var didWarnUpdateInsideUpdate;
var currentlyProcessingQueue;

{
  didWarnUpdateInsideUpdate = false;
  currentlyProcessingQueue = null;
}

function initializeUpdateQueue(fiber) {
  var queue = {
    baseState: fiber.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
      interleaved: null,
      lanes: NoLanes
    },
    effects: null
  };
  fiber.updateQueue = queue;
}
function cloneUpdateQueue(current, workInProgress) {
  // Clone the update queue from current. Unless it's already a clone.
  var queue = workInProgress.updateQueue;
  var currentQueue = current.updateQueue;

  if (queue === currentQueue) {
    var clone = {
      baseState: currentQueue.baseState,
      firstBaseUpdate: currentQueue.firstBaseUpdate,
      lastBaseUpdate: currentQueue.lastBaseUpdate,
      shared: currentQueue.shared,
      effects: currentQueue.effects
    };
    workInProgress.updateQueue = clone;
  }
}
function createUpdate(eventTime, lane) {
  var update = {
    eventTime: eventTime,
    lane: lane,
    tag: UpdateState,
    payload: null,
    callback: null,
    next: null
  };
  return update;
}
function enqueueUpdate(fiber, update, lane) {
  var updateQueue = fiber.updateQueue;

  if (updateQueue === null) {
    // Only occurs if the fiber has been unmounted.
    return;
  }

  var sharedQueue = updateQueue.shared;

  if (isInterleavedUpdate(fiber)) {
    var interleaved = sharedQueue.interleaved;

    if (interleaved === null) {
      // This is the first update. Create a circular list.
      update.next = update; // At the end of the current render, this queue's interleaved updates will
      // be transferred to the pending queue.

      pushInterleavedQueue(sharedQueue);
    } else {
      update.next = interleaved.next;
      interleaved.next = update;
    }

    sharedQueue.interleaved = update;
  } else {
    var pending = sharedQueue.pending;

    if (pending === null) {
      // This is the first update. Create a circular list.
      update.next = update;
    } else {
      update.next = pending.next;
      pending.next = update;
    }

    sharedQueue.pending = update;
  }

  {
    if (
      currentlyProcessingQueue === sharedQueue &&
      !didWarnUpdateInsideUpdate
    ) {
      error(
        "An update (setState, replaceState, or forceUpdate) was scheduled " +
          "from inside an update function. Update functions should be pure, " +
          "with zero side-effects. Consider using componentDidUpdate or a " +
          "callback."
      );

      didWarnUpdateInsideUpdate = true;
    }
  }
}
function entangleTransitions(root, fiber, lane) {
  var updateQueue = fiber.updateQueue;

  if (updateQueue === null) {
    // Only occurs if the fiber has been unmounted.
    return;
  }

  var sharedQueue = updateQueue.shared;

  if (isTransitionLane(lane)) {
    var queueLanes = sharedQueue.lanes; // If any entangled lanes are no longer pending on the root, then they must
    // have finished. We can remove them from the shared queue, which represents
    // a superset of the actually pending lanes. In some cases we may entangle
    // more than we need to, but that's OK. In fact it's worse if we *don't*
    // entangle when we should.

    queueLanes = intersectLanes(queueLanes, root.pendingLanes); // Entangle the new transition lane with the other transition lanes.

    var newQueueLanes = mergeLanes(queueLanes, lane);
    sharedQueue.lanes = newQueueLanes; // Even if queue.lanes already include lane, we don't know for certain if
    // the lane finished since the last time we entangled it. So we need to
    // entangle it again, just to be sure.

    markRootEntangled(root, newQueueLanes);
  }
}
function enqueueCapturedUpdate(workInProgress, capturedUpdate) {
  // Captured updates are updates that are thrown by a child during the render
  // phase. They should be discarded if the render is aborted. Therefore,
  // we should only put them on the work-in-progress queue, not the current one.
  var queue = workInProgress.updateQueue; // Check if the work-in-progress queue is a clone.

  var current = workInProgress.alternate;

  if (current !== null) {
    var currentQueue = current.updateQueue;

    if (queue === currentQueue) {
      // The work-in-progress queue is the same as current. This happens when
      // we bail out on a parent fiber that then captures an error thrown by
      // a child. Since we want to append the update only to the work-in
      // -progress queue, we need to clone the updates. We usually clone during
      // processUpdateQueue, but that didn't happen in this case because we
      // skipped over the parent when we bailed out.
      var newFirst = null;
      var newLast = null;
      var firstBaseUpdate = queue.firstBaseUpdate;

      if (firstBaseUpdate !== null) {
        // Loop through the updates and clone them.
        var update = firstBaseUpdate;

        do {
          var clone = {
            eventTime: update.eventTime,
            lane: update.lane,
            tag: update.tag,
            payload: update.payload,
            callback: update.callback,
            next: null
          };

          if (newLast === null) {
            newFirst = newLast = clone;
          } else {
            newLast.next = clone;
            newLast = clone;
          }

          update = update.next;
        } while (update !== null); // Append the captured update the end of the cloned list.

        if (newLast === null) {
          newFirst = newLast = capturedUpdate;
        } else {
          newLast.next = capturedUpdate;
          newLast = capturedUpdate;
        }
      } else {
        // There are no base updates.
        newFirst = newLast = capturedUpdate;
      }

      queue = {
        baseState: currentQueue.baseState,
        firstBaseUpdate: newFirst,
        lastBaseUpdate: newLast,
        shared: currentQueue.shared,
        effects: currentQueue.effects
      };
      workInProgress.updateQueue = queue;
      return;
    }
  } // Append the update to the end of the list.

  var lastBaseUpdate = queue.lastBaseUpdate;

  if (lastBaseUpdate === null) {
    queue.firstBaseUpdate = capturedUpdate;
  } else {
    lastBaseUpdate.next = capturedUpdate;
  }

  queue.lastBaseUpdate = capturedUpdate;
}

function getStateFromUpdate(
  workInProgress,
  queue,
  update,
  prevState,
  nextProps,
  instance
) {
  switch (update.tag) {
    case ReplaceState: {
      var payload = update.payload;

      if (typeof payload === "function") {
        // Updater function
        {
          enterDisallowedContextReadInDEV();
        }

        var nextState = payload.call(instance, prevState, nextProps);

        {
          if (workInProgress.mode & StrictLegacyMode) {
            setIsStrictModeForDevtools(true);

            try {
              payload.call(instance, prevState, nextProps);
            } finally {
              setIsStrictModeForDevtools(false);
            }
          }

          exitDisallowedContextReadInDEV();
        }

        return nextState;
      } // State object

      return payload;
    }

    case CaptureUpdate: {
      workInProgress.flags =
        (workInProgress.flags & ~ShouldCapture) | DidCapture;
    }
    // Intentional fallthrough

    case UpdateState: {
      var _payload = update.payload;
      var partialState;

      if (typeof _payload === "function") {
        // Updater function
        {
          enterDisallowedContextReadInDEV();
        }

        partialState = _payload.call(instance, prevState, nextProps);

        {
          if (workInProgress.mode & StrictLegacyMode) {
            setIsStrictModeForDevtools(true);

            try {
              _payload.call(instance, prevState, nextProps);
            } finally {
              setIsStrictModeForDevtools(false);
            }
          }

          exitDisallowedContextReadInDEV();
        }
      } else {
        // Partial state object
        partialState = _payload;
      }

      if (partialState === null || partialState === undefined) {
        // Null and undefined are treated as no-ops.
        return prevState;
      } // Merge the partial state and the previous state.

      return Object.assign({}, prevState, partialState);
    }

    case ForceUpdate: {
      hasForceUpdate = true;
      return prevState;
    }
  }

  return prevState;
}

function processUpdateQueue(workInProgress, props, instance, renderLanes) {
  // This is always non-null on a ClassComponent or HostRoot
  var queue = workInProgress.updateQueue;
  hasForceUpdate = false;

  {
    currentlyProcessingQueue = queue.shared;
  }

  var firstBaseUpdate = queue.firstBaseUpdate;
  var lastBaseUpdate = queue.lastBaseUpdate; // Check if there are pending updates. If so, transfer them to the base queue.

  var pendingQueue = queue.shared.pending;

  if (pendingQueue !== null) {
    queue.shared.pending = null; // The pending queue is circular. Disconnect the pointer between first
    // and last so that it's non-circular.

    var lastPendingUpdate = pendingQueue;
    var firstPendingUpdate = lastPendingUpdate.next;
    lastPendingUpdate.next = null; // Append pending updates to base queue

    if (lastBaseUpdate === null) {
      firstBaseUpdate = firstPendingUpdate;
    } else {
      lastBaseUpdate.next = firstPendingUpdate;
    }

    lastBaseUpdate = lastPendingUpdate; // If there's a current queue, and it's different from the base queue, then
    // we need to transfer the updates to that queue, too. Because the base
    // queue is a singly-linked list with no cycles, we can append to both
    // lists and take advantage of structural sharing.
    // TODO: Pass `current` as argument

    var current = workInProgress.alternate;

    if (current !== null) {
      // This is always non-null on a ClassComponent or HostRoot
      var currentQueue = current.updateQueue;
      var currentLastBaseUpdate = currentQueue.lastBaseUpdate;

      if (currentLastBaseUpdate !== lastBaseUpdate) {
        if (currentLastBaseUpdate === null) {
          currentQueue.firstBaseUpdate = firstPendingUpdate;
        } else {
          currentLastBaseUpdate.next = firstPendingUpdate;
        }

        currentQueue.lastBaseUpdate = lastPendingUpdate;
      }
    }
  } // These values may change as we process the queue.

  if (firstBaseUpdate !== null) {
    // Iterate through the list of updates to compute the result.
    var newState = queue.baseState; // TODO: Don't need to accumulate this. Instead, we can remove renderLanes
    // from the original lanes.

    var newLanes = NoLanes;
    var newBaseState = null;
    var newFirstBaseUpdate = null;
    var newLastBaseUpdate = null;
    var update = firstBaseUpdate;

    do {
      var updateLane = update.lane;
      var updateEventTime = update.eventTime;

      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        // Priority is insufficient. Skip this update. If this is the first
        // skipped update, the previous update/state is the new base
        // update/state.
        var clone = {
          eventTime: updateEventTime,
          lane: updateLane,
          tag: update.tag,
          payload: update.payload,
          callback: update.callback,
          next: null
        };

        if (newLastBaseUpdate === null) {
          newFirstBaseUpdate = newLastBaseUpdate = clone;
          newBaseState = newState;
        } else {
          newLastBaseUpdate = newLastBaseUpdate.next = clone;
        } // Update the remaining priority in the queue.

        newLanes = mergeLanes(newLanes, updateLane);
      } else {
        // This update does have sufficient priority.
        if (newLastBaseUpdate !== null) {
          var _clone = {
            eventTime: updateEventTime,
            // This update is going to be committed so we never want uncommit
            // it. Using NoLane works because 0 is a subset of all bitmasks, so
            // this will never be skipped by the check above.
            lane: NoLane,
            tag: update.tag,
            payload: update.payload,
            callback: update.callback,
            next: null
          };
          newLastBaseUpdate = newLastBaseUpdate.next = _clone;
        } // Process this update.

        newState = getStateFromUpdate(
          workInProgress,
          queue,
          update,
          newState,
          props,
          instance
        );
        var callback = update.callback;

        if (
          callback !== null && // If the update was already committed, we should not queue its
          // callback again.
          update.lane !== NoLane
        ) {
          workInProgress.flags |= Callback;
          var effects = queue.effects;

          if (effects === null) {
            queue.effects = [update];
          } else {
            effects.push(update);
          }
        }
      }

      update = update.next;

      if (update === null) {
        pendingQueue = queue.shared.pending;

        if (pendingQueue === null) {
          break;
        } else {
          // An update was scheduled from inside a reducer. Add the new
          // pending updates to the end of the list and keep processing.
          var _lastPendingUpdate = pendingQueue; // Intentionally unsound. Pending updates form a circular list, but we
          // unravel them when transferring them to the base queue.

          var _firstPendingUpdate = _lastPendingUpdate.next;
          _lastPendingUpdate.next = null;
          update = _firstPendingUpdate;
          queue.lastBaseUpdate = _lastPendingUpdate;
          queue.shared.pending = null;
        }
      }
    } while (true);

    if (newLastBaseUpdate === null) {
      newBaseState = newState;
    }

    queue.baseState = newBaseState;
    queue.firstBaseUpdate = newFirstBaseUpdate;
    queue.lastBaseUpdate = newLastBaseUpdate; // Interleaved updates are stored on a separate queue. We aren't going to
    // process them during this render, but we do need to track which lanes
    // are remaining.

    var lastInterleaved = queue.shared.interleaved;

    if (lastInterleaved !== null) {
      var interleaved = lastInterleaved;

      do {
        newLanes = mergeLanes(newLanes, interleaved.lane);
        interleaved = interleaved.next;
      } while (interleaved !== lastInterleaved);
    } else if (firstBaseUpdate === null) {
      // `queue.lanes` is used for entangling transitions. We can set it back to
      // zero once the queue is empty.
      queue.shared.lanes = NoLanes;
    } // Set the remaining expiration time to be whatever is remaining in the queue.
    // This should be fine because the only two other things that contribute to
    // expiration time are props and context. We're already in the middle of the
    // begin phase by the time we start processing the queue, so we've already
    // dealt with the props. Context in components that specify
    // shouldComponentUpdate is tricky; but we'll have to account for
    // that regardless.

    markSkippedUpdateLanes(newLanes);
    workInProgress.lanes = newLanes;
    workInProgress.memoizedState = newState;
  }

  {
    currentlyProcessingQueue = null;
  }
}

function callCallback(callback, context) {
  if (!(typeof callback === "function")) {
    throw Error(
      "Invalid argument passed as callback. Expected a function. Instead received: " +
        callback
    );
  }

  callback.call(context);
}

function resetHasForceUpdateBeforeProcessing() {
  hasForceUpdate = false;
}
function checkHasForceUpdateAfterProcessing() {
  return hasForceUpdate;
}
function commitUpdateQueue(finishedWork, finishedQueue, instance) {
  // Commit the effects
  var effects = finishedQueue.effects;
  finishedQueue.effects = null;

  if (effects !== null) {
    for (var i = 0; i < effects.length; i++) {
      var effect = effects[i];
      var callback = effect.callback;

      if (callback !== null) {
        effect.callback = null;
        callCallback(callback, instance);
      }
    }
  }
}

var fakeInternalInstance = {}; // React.Component uses a shared frozen object by default.
// We'll use it to determine whether we need to initialize legacy refs.

var emptyRefsObject = new React.Component().refs;
var didWarnAboutStateAssignmentForComponent;
var didWarnAboutUninitializedState;
var didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate;
var didWarnAboutLegacyLifecyclesAndDerivedState;
var didWarnAboutUndefinedDerivedState;
var warnOnUndefinedDerivedState;
var warnOnInvalidCallback;
var didWarnAboutDirectlyAssigningPropsToState;
var didWarnAboutContextTypeAndContextTypes;
var didWarnAboutInvalidateContextType;

{
  didWarnAboutStateAssignmentForComponent = new Set();
  didWarnAboutUninitializedState = new Set();
  didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = new Set();
  didWarnAboutLegacyLifecyclesAndDerivedState = new Set();
  didWarnAboutDirectlyAssigningPropsToState = new Set();
  didWarnAboutUndefinedDerivedState = new Set();
  didWarnAboutContextTypeAndContextTypes = new Set();
  didWarnAboutInvalidateContextType = new Set();
  var didWarnOnInvalidCallback = new Set();

  warnOnInvalidCallback = function(callback, callerName) {
    if (callback === null || typeof callback === "function") {
      return;
    }

    var key = callerName + "_" + callback;

    if (!didWarnOnInvalidCallback.has(key)) {
      didWarnOnInvalidCallback.add(key);

      error(
        "%s(...): Expected the last optional `callback` argument to be a " +
          "function. Instead received: %s.",
        callerName,
        callback
      );
    }
  };

  warnOnUndefinedDerivedState = function(type, partialState) {
    if (partialState === undefined) {
      var componentName = getComponentNameFromType(type) || "Component";

      if (!didWarnAboutUndefinedDerivedState.has(componentName)) {
        didWarnAboutUndefinedDerivedState.add(componentName);

        error(
          "%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. " +
            "You have returned undefined.",
          componentName
        );
      }
    }
  }; // This is so gross but it's at least non-critical and can be removed if
  // it causes problems. This is meant to give a nicer error message for
  // ReactDOM15.unstable_renderSubtreeIntoContainer(reactDOM16Component,
  // ...)) which otherwise throws a "_processChildContext is not a function"
  // exception.

  Object.defineProperty(fakeInternalInstance, "_processChildContext", {
    enumerable: false,
    value: function() {
      {
        throw Error(
          "_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal)."
        );
      }
    }
  });
  Object.freeze(fakeInternalInstance);
}

function applyDerivedStateFromProps(
  workInProgress,
  ctor,
  getDerivedStateFromProps,
  nextProps
) {
  var prevState = workInProgress.memoizedState;
  var partialState = getDerivedStateFromProps(nextProps, prevState);

  {
    if (workInProgress.mode & StrictLegacyMode) {
      setIsStrictModeForDevtools(true);

      try {
        // Invoke the function an extra time to help detect side-effects.
        partialState = getDerivedStateFromProps(nextProps, prevState);
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }

    warnOnUndefinedDerivedState(ctor, partialState);
  } // Merge the partial state and the previous state.

  var memoizedState =
    partialState === null || partialState === undefined
      ? prevState
      : Object.assign({}, prevState, partialState);
  workInProgress.memoizedState = memoizedState; // Once the update queue is empty, persist the derived state onto the
  // base state.

  if (workInProgress.lanes === NoLanes) {
    // Queue is always non-null for classes
    var updateQueue = workInProgress.updateQueue;
    updateQueue.baseState = memoizedState;
  }
}

var classComponentUpdater = {
  isMounted: isMounted,
  enqueueSetState: function(inst, payload, callback) {
    var fiber = get(inst);
    var eventTime = requestEventTime();
    var lane = requestUpdateLane(fiber);
    var update = createUpdate(eventTime, lane);
    update.payload = payload;

    if (callback !== undefined && callback !== null) {
      {
        warnOnInvalidCallback(callback, "setState");
      }

      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    var root = scheduleUpdateOnFiber(fiber, lane, eventTime);

    if (root !== null) {
      entangleTransitions(root, fiber, lane);
    }
  },
  enqueueReplaceState: function(inst, payload, callback) {
    var fiber = get(inst);
    var eventTime = requestEventTime();
    var lane = requestUpdateLane(fiber);
    var update = createUpdate(eventTime, lane);
    update.tag = ReplaceState;
    update.payload = payload;

    if (callback !== undefined && callback !== null) {
      {
        warnOnInvalidCallback(callback, "replaceState");
      }

      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    var root = scheduleUpdateOnFiber(fiber, lane, eventTime);

    if (root !== null) {
      entangleTransitions(root, fiber, lane);
    }
  },
  enqueueForceUpdate: function(inst, callback) {
    var fiber = get(inst);
    var eventTime = requestEventTime();
    var lane = requestUpdateLane(fiber);
    var update = createUpdate(eventTime, lane);
    update.tag = ForceUpdate;

    if (callback !== undefined && callback !== null) {
      {
        warnOnInvalidCallback(callback, "forceUpdate");
      }

      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    var root = scheduleUpdateOnFiber(fiber, lane, eventTime);

    if (root !== null) {
      entangleTransitions(root, fiber, lane);
    }
  }
};

function checkShouldComponentUpdate(
  workInProgress,
  ctor,
  oldProps,
  newProps,
  oldState,
  newState,
  nextContext
) {
  var instance = workInProgress.stateNode;

  if (typeof instance.shouldComponentUpdate === "function") {
    var shouldUpdate = instance.shouldComponentUpdate(
      newProps,
      newState,
      nextContext
    );

    {
      if (workInProgress.mode & StrictLegacyMode) {
        setIsStrictModeForDevtools(true);

        try {
          // Invoke the function an extra time to help detect side-effects.
          shouldUpdate = instance.shouldComponentUpdate(
            newProps,
            newState,
            nextContext
          );
        } finally {
          setIsStrictModeForDevtools(false);
        }
      }

      if (shouldUpdate === undefined) {
        error(
          "%s.shouldComponentUpdate(): Returned undefined instead of a " +
            "boolean value. Make sure to return true or false.",
          getComponentNameFromType(ctor) || "Component"
        );
      }
    }

    return shouldUpdate;
  }

  if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    return (
      !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    );
  }

  return true;
}

function checkClassInstance(workInProgress, ctor, newProps) {
  var instance = workInProgress.stateNode;

  {
    var name = getComponentNameFromType(ctor) || "Component";
    var renderPresent = instance.render;

    if (!renderPresent) {
      if (ctor.prototype && typeof ctor.prototype.render === "function") {
        error(
          "%s(...): No `render` method found on the returned component " +
            "instance: did you accidentally return an object from the constructor?",
          name
        );
      } else {
        error(
          "%s(...): No `render` method found on the returned component " +
            "instance: you may have forgotten to define `render`.",
          name
        );
      }
    }

    if (
      instance.getInitialState &&
      !instance.getInitialState.isReactClassApproved &&
      !instance.state
    ) {
      error(
        "getInitialState was defined on %s, a plain JavaScript class. " +
          "This is only supported for classes created using React.createClass. " +
          "Did you mean to define a state property instead?",
        name
      );
    }

    if (
      instance.getDefaultProps &&
      !instance.getDefaultProps.isReactClassApproved
    ) {
      error(
        "getDefaultProps was defined on %s, a plain JavaScript class. " +
          "This is only supported for classes created using React.createClass. " +
          "Use a static property to define defaultProps instead.",
        name
      );
    }

    if (instance.propTypes) {
      error(
        "propTypes was defined as an instance property on %s. Use a static " +
          "property to define propTypes instead.",
        name
      );
    }

    if (instance.contextType) {
      error(
        "contextType was defined as an instance property on %s. Use a static " +
          "property to define contextType instead.",
        name
      );
    }

    {
      if (instance.contextTypes) {
        error(
          "contextTypes was defined as an instance property on %s. Use a static " +
            "property to define contextTypes instead.",
          name
        );
      }

      if (
        ctor.contextType &&
        ctor.contextTypes &&
        !didWarnAboutContextTypeAndContextTypes.has(ctor)
      ) {
        didWarnAboutContextTypeAndContextTypes.add(ctor);

        error(
          "%s declares both contextTypes and contextType static properties. " +
            "The legacy contextTypes property will be ignored.",
          name
        );
      }
    }

    if (typeof instance.componentShouldUpdate === "function") {
      error(
        "%s has a method called " +
          "componentShouldUpdate(). Did you mean shouldComponentUpdate()? " +
          "The name is phrased as a question because the function is " +
          "expected to return a value.",
        name
      );
    }

    if (
      ctor.prototype &&
      ctor.prototype.isPureReactComponent &&
      typeof instance.shouldComponentUpdate !== "undefined"
    ) {
      error(
        "%s has a method called shouldComponentUpdate(). " +
          "shouldComponentUpdate should not be used when extending React.PureComponent. " +
          "Please extend React.Component if shouldComponentUpdate is used.",
        getComponentNameFromType(ctor) || "A pure component"
      );
    }

    if (typeof instance.componentDidUnmount === "function") {
      error(
        "%s has a method called " +
          "componentDidUnmount(). But there is no such lifecycle method. " +
          "Did you mean componentWillUnmount()?",
        name
      );
    }

    if (typeof instance.componentDidReceiveProps === "function") {
      error(
        "%s has a method called " +
          "componentDidReceiveProps(). But there is no such lifecycle method. " +
          "If you meant to update the state in response to changing props, " +
          "use componentWillReceiveProps(). If you meant to fetch data or " +
          "run side-effects or mutations after React has updated the UI, use componentDidUpdate().",
        name
      );
    }

    if (typeof instance.componentWillRecieveProps === "function") {
      error(
        "%s has a method called " +
          "componentWillRecieveProps(). Did you mean componentWillReceiveProps()?",
        name
      );
    }

    if (typeof instance.UNSAFE_componentWillRecieveProps === "function") {
      error(
        "%s has a method called " +
          "UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?",
        name
      );
    }

    var hasMutatedProps = instance.props !== newProps;

    if (instance.props !== undefined && hasMutatedProps) {
      error(
        "%s(...): When calling super() in `%s`, make sure to pass " +
          "up the same props that your component's constructor was passed.",
        name,
        name
      );
    }

    if (instance.defaultProps) {
      error(
        "Setting defaultProps as an instance property on %s is not supported and will be ignored." +
          " Instead, define defaultProps as a static property on %s.",
        name,
        name
      );
    }

    if (
      typeof instance.getSnapshotBeforeUpdate === "function" &&
      typeof instance.componentDidUpdate !== "function" &&
      !didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(ctor)
    ) {
      didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(ctor);

      error(
        "%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). " +
          "This component defines getSnapshotBeforeUpdate() only.",
        getComponentNameFromType(ctor)
      );
    }

    if (typeof instance.getDerivedStateFromProps === "function") {
      error(
        "%s: getDerivedStateFromProps() is defined as an instance method " +
          "and will be ignored. Instead, declare it as a static method.",
        name
      );
    }

    if (typeof instance.getDerivedStateFromError === "function") {
      error(
        "%s: getDerivedStateFromError() is defined as an instance method " +
          "and will be ignored. Instead, declare it as a static method.",
        name
      );
    }

    if (typeof ctor.getSnapshotBeforeUpdate === "function") {
      error(
        "%s: getSnapshotBeforeUpdate() is defined as a static method " +
          "and will be ignored. Instead, declare it as an instance method.",
        name
      );
    }

    var _state = instance.state;

    if (_state && (typeof _state !== "object" || isArray(_state))) {
      error("%s.state: must be set to an object or null", name);
    }

    if (
      typeof instance.getChildContext === "function" &&
      typeof ctor.childContextTypes !== "object"
    ) {
      error(
        "%s.getChildContext(): childContextTypes must be defined in order to " +
          "use getChildContext().",
        name
      );
    }
  }
}

function adoptClassInstance(workInProgress, instance) {
  instance.updater = classComponentUpdater;
  workInProgress.stateNode = instance; // The instance needs access to the fiber so that it can schedule updates

  set(instance, workInProgress);

  {
    instance._reactInternalInstance = fakeInternalInstance;
  }
}

function constructClassInstance(workInProgress, ctor, props) {
  var isLegacyContextConsumer = false;
  var unmaskedContext = emptyContextObject;
  var context = emptyContextObject;
  var contextType = ctor.contextType;

  {
    if ("contextType" in ctor) {
      var isValid = // Allow null for conditional declaration
        contextType === null ||
        (contextType !== undefined &&
          contextType.$$typeof === REACT_CONTEXT_TYPE &&
          contextType._context === undefined); // Not a <Context.Consumer>

      if (!isValid && !didWarnAboutInvalidateContextType.has(ctor)) {
        didWarnAboutInvalidateContextType.add(ctor);
        var addendum = "";

        if (contextType === undefined) {
          addendum =
            " However, it is set to undefined. " +
            "This can be caused by a typo or by mixing up named and default imports. " +
            "This can also happen due to a circular dependency, so " +
            "try moving the createContext() call to a separate file.";
        } else if (typeof contextType !== "object") {
          addendum = " However, it is set to a " + typeof contextType + ".";
        } else if (contextType.$$typeof === REACT_PROVIDER_TYPE) {
          addendum = " Did you accidentally pass the Context.Provider instead?";
        } else if (contextType._context !== undefined) {
          // <Context.Consumer>
          addendum = " Did you accidentally pass the Context.Consumer instead?";
        } else {
          addendum =
            " However, it is set to an object with keys {" +
            Object.keys(contextType).join(", ") +
            "}.";
        }

        error(
          "%s defines an invalid contextType. " +
            "contextType should point to the Context object returned by React.createContext().%s",
          getComponentNameFromType(ctor) || "Component",
          addendum
        );
      }
    }
  }

  if (typeof contextType === "object" && contextType !== null) {
    context = readContext(contextType);
  } else {
    unmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
    var contextTypes = ctor.contextTypes;
    isLegacyContextConsumer =
      contextTypes !== null && contextTypes !== undefined;
    context = isLegacyContextConsumer
      ? getMaskedContext(workInProgress, unmaskedContext)
      : emptyContextObject;
  }

  var instance = new ctor(props, context); // Instantiate twice to help detect side-effects.

  {
    if (workInProgress.mode & StrictLegacyMode) {
      setIsStrictModeForDevtools(true);

      try {
        instance = new ctor(props, context); // eslint-disable-line no-new
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }
  }

  var state = (workInProgress.memoizedState =
    instance.state !== null && instance.state !== undefined
      ? instance.state
      : null);
  adoptClassInstance(workInProgress, instance);

  {
    if (typeof ctor.getDerivedStateFromProps === "function" && state === null) {
      var componentName = getComponentNameFromType(ctor) || "Component";

      if (!didWarnAboutUninitializedState.has(componentName)) {
        didWarnAboutUninitializedState.add(componentName);

        error(
          "`%s` uses `getDerivedStateFromProps` but its initial state is " +
            "%s. This is not recommended. Instead, define the initial state by " +
            "assigning an object to `this.state` in the constructor of `%s`. " +
            "This ensures that `getDerivedStateFromProps` arguments have a consistent shape.",
          componentName,
          instance.state === null ? "null" : "undefined",
          componentName
        );
      }
    } // If new component APIs are defined, "unsafe" lifecycles won't be called.
    // Warn about these lifecycles if they are present.
    // Don't warn about react-lifecycles-compat polyfilled methods though.

    if (
      typeof ctor.getDerivedStateFromProps === "function" ||
      typeof instance.getSnapshotBeforeUpdate === "function"
    ) {
      var foundWillMountName = null;
      var foundWillReceivePropsName = null;
      var foundWillUpdateName = null;

      if (
        typeof instance.componentWillMount === "function" &&
        instance.componentWillMount.__suppressDeprecationWarning !== true
      ) {
        foundWillMountName = "componentWillMount";
      } else if (typeof instance.UNSAFE_componentWillMount === "function") {
        foundWillMountName = "UNSAFE_componentWillMount";
      }

      if (
        typeof instance.componentWillReceiveProps === "function" &&
        instance.componentWillReceiveProps.__suppressDeprecationWarning !== true
      ) {
        foundWillReceivePropsName = "componentWillReceiveProps";
      } else if (
        typeof instance.UNSAFE_componentWillReceiveProps === "function"
      ) {
        foundWillReceivePropsName = "UNSAFE_componentWillReceiveProps";
      }

      if (
        typeof instance.componentWillUpdate === "function" &&
        instance.componentWillUpdate.__suppressDeprecationWarning !== true
      ) {
        foundWillUpdateName = "componentWillUpdate";
      } else if (typeof instance.UNSAFE_componentWillUpdate === "function") {
        foundWillUpdateName = "UNSAFE_componentWillUpdate";
      }

      if (
        foundWillMountName !== null ||
        foundWillReceivePropsName !== null ||
        foundWillUpdateName !== null
      ) {
        var _componentName = getComponentNameFromType(ctor) || "Component";

        var newApiName =
          typeof ctor.getDerivedStateFromProps === "function"
            ? "getDerivedStateFromProps()"
            : "getSnapshotBeforeUpdate()";

        if (!didWarnAboutLegacyLifecyclesAndDerivedState.has(_componentName)) {
          didWarnAboutLegacyLifecyclesAndDerivedState.add(_componentName);

          error(
            "Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n" +
              "%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\n" +
              "The above lifecycles should be removed. Learn more about this warning here:\n" +
              "https://reactjs.org/link/unsafe-component-lifecycles",
            _componentName,
            newApiName,
            foundWillMountName !== null ? "\n  " + foundWillMountName : "",
            foundWillReceivePropsName !== null
              ? "\n  " + foundWillReceivePropsName
              : "",
            foundWillUpdateName !== null ? "\n  " + foundWillUpdateName : ""
          );
        }
      }
    }
  } // Cache unmasked context so we can avoid recreating masked context unless necessary.
  // ReactFiberContext usually updates this cache but can't for newly-created instances.

  if (isLegacyContextConsumer) {
    cacheContext(workInProgress, unmaskedContext, context);
  }

  return instance;
}

function callComponentWillMount(workInProgress, instance) {
  var oldState = instance.state;

  if (typeof instance.componentWillMount === "function") {
    instance.componentWillMount();
  }

  if (typeof instance.UNSAFE_componentWillMount === "function") {
    instance.UNSAFE_componentWillMount();
  }

  if (oldState !== instance.state) {
    {
      error(
        "%s.componentWillMount(): Assigning directly to this.state is " +
          "deprecated (except inside a component's " +
          "constructor). Use setState instead.",
        getComponentNameFromFiber(workInProgress) || "Component"
      );
    }

    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
}

function callComponentWillReceiveProps(
  workInProgress,
  instance,
  newProps,
  nextContext
) {
  var oldState = instance.state;

  if (typeof instance.componentWillReceiveProps === "function") {
    instance.componentWillReceiveProps(newProps, nextContext);
  }

  if (typeof instance.UNSAFE_componentWillReceiveProps === "function") {
    instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
  }

  if (instance.state !== oldState) {
    {
      var componentName =
        getComponentNameFromFiber(workInProgress) || "Component";

      if (!didWarnAboutStateAssignmentForComponent.has(componentName)) {
        didWarnAboutStateAssignmentForComponent.add(componentName);

        error(
          "%s.componentWillReceiveProps(): Assigning directly to " +
            "this.state is deprecated (except inside a component's " +
            "constructor). Use setState instead.",
          componentName
        );
      }
    }

    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
} // Invokes the mount life-cycles on a previously never rendered instance.

function mountClassInstance(workInProgress, ctor, newProps, renderLanes) {
  {
    checkClassInstance(workInProgress, ctor, newProps);
  }

  var instance = workInProgress.stateNode;
  instance.props = newProps;
  instance.state = workInProgress.memoizedState;
  instance.refs = emptyRefsObject;
  initializeUpdateQueue(workInProgress);
  var contextType = ctor.contextType;

  if (typeof contextType === "object" && contextType !== null) {
    instance.context = readContext(contextType);
  } else {
    var unmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
    instance.context = getMaskedContext(workInProgress, unmaskedContext);
  }

  {
    if (instance.state === newProps) {
      var componentName = getComponentNameFromType(ctor) || "Component";

      if (!didWarnAboutDirectlyAssigningPropsToState.has(componentName)) {
        didWarnAboutDirectlyAssigningPropsToState.add(componentName);

        error(
          "%s: It is not recommended to assign props directly to state " +
            "because updates to props won't be reflected in state. " +
            "In most cases, it is better to use props directly.",
          componentName
        );
      }
    }

    if (workInProgress.mode & StrictLegacyMode) {
      ReactStrictModeWarnings.recordLegacyContextWarning(
        workInProgress,
        instance
      );
    }

    {
      ReactStrictModeWarnings.recordUnsafeLifecycleWarnings(
        workInProgress,
        instance
      );
    }
  }

  instance.state = workInProgress.memoizedState;
  var getDerivedStateFromProps = ctor.getDerivedStateFromProps;

  if (typeof getDerivedStateFromProps === "function") {
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      newProps
    );
    instance.state = workInProgress.memoizedState;
  } // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.

  if (
    typeof ctor.getDerivedStateFromProps !== "function" &&
    typeof instance.getSnapshotBeforeUpdate !== "function" &&
    (typeof instance.UNSAFE_componentWillMount === "function" ||
      typeof instance.componentWillMount === "function")
  ) {
    callComponentWillMount(workInProgress, instance); // If we had additional state updates during this life-cycle, let's
    // process them now.

    processUpdateQueue(workInProgress, newProps, instance, renderLanes);
    instance.state = workInProgress.memoizedState;
  }

  if (typeof instance.componentDidMount === "function") {
    var fiberFlags = Update;

    if ((workInProgress.mode & StrictEffectsMode) !== NoMode) {
      fiberFlags |= MountLayoutDev;
    }

    workInProgress.flags |= fiberFlags;
  }
}

function resumeMountClassInstance(workInProgress, ctor, newProps, renderLanes) {
  var instance = workInProgress.stateNode;
  var oldProps = workInProgress.memoizedProps;
  instance.props = oldProps;
  var oldContext = instance.context;
  var contextType = ctor.contextType;
  var nextContext = emptyContextObject;

  if (typeof contextType === "object" && contextType !== null) {
    nextContext = readContext(contextType);
  } else {
    var nextLegacyUnmaskedContext = getUnmaskedContext(
      workInProgress,
      ctor,
      true
    );
    nextContext = getMaskedContext(workInProgress, nextLegacyUnmaskedContext);
  }

  var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  var hasNewLifecycles =
    typeof getDerivedStateFromProps === "function" ||
    typeof instance.getSnapshotBeforeUpdate === "function"; // Note: During these life-cycles, instance.props/instance.state are what
  // ever the previously attempted to render - not the "current". However,
  // during componentDidUpdate we pass the "current" props.
  // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.

  if (
    !hasNewLifecycles &&
    (typeof instance.UNSAFE_componentWillReceiveProps === "function" ||
      typeof instance.componentWillReceiveProps === "function")
  ) {
    if (oldProps !== newProps || oldContext !== nextContext) {
      callComponentWillReceiveProps(
        workInProgress,
        instance,
        newProps,
        nextContext
      );
    }
  }

  resetHasForceUpdateBeforeProcessing();
  var oldState = workInProgress.memoizedState;
  var newState = (instance.state = oldState);
  processUpdateQueue(workInProgress, newProps, instance, renderLanes);
  newState = workInProgress.memoizedState;

  if (
    oldProps === newProps &&
    oldState === newState &&
    !hasContextChanged() &&
    !checkHasForceUpdateAfterProcessing()
  ) {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidMount === "function") {
      var fiberFlags = Update;

      if ((workInProgress.mode & StrictEffectsMode) !== NoMode) {
        fiberFlags |= MountLayoutDev;
      }

      workInProgress.flags |= fiberFlags;
    }

    return false;
  }

  if (typeof getDerivedStateFromProps === "function") {
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      newProps
    );
    newState = workInProgress.memoizedState;
  }

  var shouldUpdate =
    checkHasForceUpdateAfterProcessing() ||
    checkShouldComponentUpdate(
      workInProgress,
      ctor,
      oldProps,
      newProps,
      oldState,
      newState,
      nextContext
    );

  if (shouldUpdate) {
    // In order to support react-lifecycles-compat polyfilled components,
    // Unsafe lifecycles should not be invoked for components using the new APIs.
    if (
      !hasNewLifecycles &&
      (typeof instance.UNSAFE_componentWillMount === "function" ||
        typeof instance.componentWillMount === "function")
    ) {
      if (typeof instance.componentWillMount === "function") {
        instance.componentWillMount();
      }

      if (typeof instance.UNSAFE_componentWillMount === "function") {
        instance.UNSAFE_componentWillMount();
      }
    }

    if (typeof instance.componentDidMount === "function") {
      var _fiberFlags = Update;

      if ((workInProgress.mode & StrictEffectsMode) !== NoMode) {
        _fiberFlags |= MountLayoutDev;
      }

      workInProgress.flags |= _fiberFlags;
    }
  } else {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidMount === "function") {
      var _fiberFlags2 = Update;

      if ((workInProgress.mode & StrictEffectsMode) !== NoMode) {
        _fiberFlags2 |= MountLayoutDev;
      }

      workInProgress.flags |= _fiberFlags2;
    } // If shouldComponentUpdate returned false, we should still update the
    // memoized state to indicate that this work can be reused.

    workInProgress.memoizedProps = newProps;
    workInProgress.memoizedState = newState;
  } // Update the existing instance's state, props, and context pointers even
  // if shouldComponentUpdate returns false.

  instance.props = newProps;
  instance.state = newState;
  instance.context = nextContext;
  return shouldUpdate;
} // Invokes the update life-cycles and returns false if it shouldn't rerender.

function updateClassInstance(
  current,
  workInProgress,
  ctor,
  newProps,
  renderLanes
) {
  var instance = workInProgress.stateNode;
  cloneUpdateQueue(current, workInProgress);
  var unresolvedOldProps = workInProgress.memoizedProps;
  var oldProps =
    workInProgress.type === workInProgress.elementType
      ? unresolvedOldProps
      : resolveDefaultProps(workInProgress.type, unresolvedOldProps);
  instance.props = oldProps;
  var unresolvedNewProps = workInProgress.pendingProps;
  var oldContext = instance.context;
  var contextType = ctor.contextType;
  var nextContext = emptyContextObject;

  if (typeof contextType === "object" && contextType !== null) {
    nextContext = readContext(contextType);
  } else {
    var nextUnmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
    nextContext = getMaskedContext(workInProgress, nextUnmaskedContext);
  }

  var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  var hasNewLifecycles =
    typeof getDerivedStateFromProps === "function" ||
    typeof instance.getSnapshotBeforeUpdate === "function"; // Note: During these life-cycles, instance.props/instance.state are what
  // ever the previously attempted to render - not the "current". However,
  // during componentDidUpdate we pass the "current" props.
  // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.

  if (
    !hasNewLifecycles &&
    (typeof instance.UNSAFE_componentWillReceiveProps === "function" ||
      typeof instance.componentWillReceiveProps === "function")
  ) {
    if (
      unresolvedOldProps !== unresolvedNewProps ||
      oldContext !== nextContext
    ) {
      callComponentWillReceiveProps(
        workInProgress,
        instance,
        newProps,
        nextContext
      );
    }
  }

  resetHasForceUpdateBeforeProcessing();
  var oldState = workInProgress.memoizedState;
  var newState = (instance.state = oldState);
  processUpdateQueue(workInProgress, newProps, instance, renderLanes);
  newState = workInProgress.memoizedState;

  if (
    unresolvedOldProps === unresolvedNewProps &&
    oldState === newState &&
    !hasContextChanged() &&
    !checkHasForceUpdateAfterProcessing() &&
    !enableLazyContextPropagation
  ) {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidUpdate === "function") {
      if (
        unresolvedOldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.flags |= Update;
      }
    }

    if (typeof instance.getSnapshotBeforeUpdate === "function") {
      if (
        unresolvedOldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.flags |= Snapshot;
      }
    }

    return false;
  }

  if (typeof getDerivedStateFromProps === "function") {
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      newProps
    );
    newState = workInProgress.memoizedState;
  }

  var shouldUpdate =
    checkHasForceUpdateAfterProcessing() ||
    checkShouldComponentUpdate(
      workInProgress,
      ctor,
      oldProps,
      newProps,
      oldState,
      newState,
      nextContext
    ) || // TODO: In some cases, we'll end up checking if context has changed twice,
    // both before and after `shouldComponentUpdate` has been called. Not ideal,
    // but I'm loath to refactor this function. This only happens for memoized
    // components so it's not that common.
    enableLazyContextPropagation;

  if (shouldUpdate) {
    // In order to support react-lifecycles-compat polyfilled components,
    // Unsafe lifecycles should not be invoked for components using the new APIs.
    if (
      !hasNewLifecycles &&
      (typeof instance.UNSAFE_componentWillUpdate === "function" ||
        typeof instance.componentWillUpdate === "function")
    ) {
      if (typeof instance.componentWillUpdate === "function") {
        instance.componentWillUpdate(newProps, newState, nextContext);
      }

      if (typeof instance.UNSAFE_componentWillUpdate === "function") {
        instance.UNSAFE_componentWillUpdate(newProps, newState, nextContext);
      }
    }

    if (typeof instance.componentDidUpdate === "function") {
      workInProgress.flags |= Update;
    }

    if (typeof instance.getSnapshotBeforeUpdate === "function") {
      workInProgress.flags |= Snapshot;
    }
  } else {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidUpdate === "function") {
      if (
        unresolvedOldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.flags |= Update;
      }
    }

    if (typeof instance.getSnapshotBeforeUpdate === "function") {
      if (
        unresolvedOldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.flags |= Snapshot;
      }
    } // If shouldComponentUpdate returned false, we should still update the
    // memoized props/state to indicate that this work can be reused.

    workInProgress.memoizedProps = newProps;
    workInProgress.memoizedState = newState;
  } // Update the existing instance's state, props, and context pointers even
  // if shouldComponentUpdate returns false.

  instance.props = newProps;
  instance.state = newState;
  instance.context = nextContext;
  return shouldUpdate;
}

var didWarnAboutMaps;
var didWarnAboutGenerators;
var didWarnAboutStringRefs;
var ownerHasKeyUseWarning;
var ownerHasFunctionTypeWarning;

var warnForMissingKey = function(child, returnFiber) {};

{
  didWarnAboutMaps = false;
  didWarnAboutGenerators = false;
  didWarnAboutStringRefs = {};
  /**
   * Warn if there's no key explicitly set on dynamic arrays of children or
   * object keys are not valid. This allows us to keep track of children between
   * updates.
   */

  ownerHasKeyUseWarning = {};
  ownerHasFunctionTypeWarning = {};

  warnForMissingKey = function(child, returnFiber) {
    if (child === null || typeof child !== "object") {
      return;
    }

    if (!child._store || child._store.validated || child.key != null) {
      return;
    }

    if (!(typeof child._store === "object")) {
      throw Error(
        "React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue."
      );
    }

    child._store.validated = true;
    var componentName = getComponentNameFromFiber(returnFiber) || "Component";

    if (ownerHasKeyUseWarning[componentName]) {
      return;
    }

    ownerHasKeyUseWarning[componentName] = true;

    error(
      "Each child in a list should have a unique " +
        '"key" prop. See https://reactjs.org/link/warning-keys for ' +
        "more information."
    );
  };
}

function coerceRef(returnFiber, current, element) {
  var mixedRef = element.ref;

  if (
    mixedRef !== null &&
    typeof mixedRef !== "function" &&
    typeof mixedRef !== "object"
  ) {
    {
      // TODO: Clean this up once we turn on the string ref warning for
      // everyone, because the strict mode case will no longer be relevant
      if (
        (returnFiber.mode & StrictLegacyMode || warnAboutStringRefs) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(
          element._owner &&
          element._self &&
          element._owner.stateNode !== element._self
        )
      ) {
        var componentName =
          getComponentNameFromFiber(returnFiber) || "Component";

        if (!didWarnAboutStringRefs[componentName]) {
          {
            error(
              'A string ref, "%s", has been found within a strict mode tree. ' +
                "String refs are a source of potential bugs and should be avoided. " +
                "We recommend using useRef() or createRef() instead. " +
                "Learn more about using refs safely here: " +
                "https://reactjs.org/link/strict-mode-string-ref",
              mixedRef
            );
          }

          didWarnAboutStringRefs[componentName] = true;
        }
      }
    }

    if (element._owner) {
      var owner = element._owner;
      var inst;

      if (owner) {
        var ownerFiber = owner;

        if (!(ownerFiber.tag === ClassComponent)) {
          throw Error(
            "Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref"
          );
        }

        inst = ownerFiber.stateNode;
      }

      if (!inst) {
        throw Error(
          "Missing owner for string ref " +
            mixedRef +
            ". This error is likely caused by a bug in React. Please file an issue."
        );
      }

      var stringRef = "" + mixedRef; // Check if previous string ref matches new string ref

      if (
        current !== null &&
        current.ref !== null &&
        typeof current.ref === "function" &&
        current.ref._stringRef === stringRef
      ) {
        return current.ref;
      }

      var ref = function(value) {
        var refs = inst.refs;

        if (refs === emptyRefsObject) {
          // This is a lazy pooled frozen object, so we need to initialize.
          refs = inst.refs = {};
        }

        if (value === null) {
          delete refs[stringRef];
        } else {
          refs[stringRef] = value;
        }
      };

      ref._stringRef = stringRef;
      return ref;
    } else {
      if (!(typeof mixedRef === "string")) {
        throw Error(
          "Expected ref to be a function, a string, an object returned by React.createRef(), or null."
        );
      }

      if (!element._owner) {
        throw Error(
          "Element ref was specified as a string (" +
            mixedRef +
            ") but no owner was set. This could happen for one of the following reasons:\n1. You may be adding a ref to a function component\n2. You may be adding a ref to a component that was not created inside a component's render method\n3. You have multiple copies of React loaded\nSee https://reactjs.org/link/refs-must-have-owner for more information."
        );
      }
    }
  }

  return mixedRef;
}

function throwOnInvalidObjectType(returnFiber, newChild) {
  var childString = Object.prototype.toString.call(newChild);

  {
    throw Error(
      "Objects are not valid as a React child (found: " +
        (childString === "[object Object]"
          ? "object with keys {" + Object.keys(newChild).join(", ") + "}"
          : childString) +
        "). If you meant to render a collection of children, use an array instead."
    );
  }
}

function warnOnFunctionType(returnFiber) {
  {
    var componentName = getComponentNameFromFiber(returnFiber) || "Component";

    if (ownerHasFunctionTypeWarning[componentName]) {
      return;
    }

    ownerHasFunctionTypeWarning[componentName] = true;

    error(
      "Functions are not valid as a React child. This may happen if " +
        "you return a Component instead of <Component /> from render. " +
        "Or maybe you meant to call this function rather than return it."
    );
  }
}
// to be able to optimize each path individually by branching early. This needs
// a compiler or we can do it manually. Helpers that don't need this branching
// live outside of this function.

function ChildReconciler(shouldTrackSideEffects) {
  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) {
      // Noop.
      return;
    }

    var deletions = returnFiber.deletions;

    if (deletions === null) {
      returnFiber.deletions = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      deletions.push(childToDelete);
    }
  }

  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTrackSideEffects) {
      // Noop.
      return null;
    } // TODO: For the shouldClone case, this could be micro-optimized a bit by
    // assuming that after the first child we've already added everything.

    var childToDelete = currentFirstChild;

    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }

    return null;
  }

  function mapRemainingChildren(returnFiber, currentFirstChild) {
    // Add the remaining children to a temporary map so that we can find them by
    // keys quickly. Implicit (null) keys get added to this set with their index
    // instead.
    var existingChildren = new Map();
    var existingChild = currentFirstChild;

    while (existingChild !== null) {
      if (existingChild.key !== null) {
        existingChildren.set(existingChild.key, existingChild);
      } else {
        existingChildren.set(existingChild.index, existingChild);
      }

      existingChild = existingChild.sibling;
    }

    return existingChildren;
  }

  function useFiber(fiber, pendingProps) {
    // We currently set sibling to null and index to 0 here because it is easy
    // to forget to do before returning it. E.g. for the single child case.
    var clone = createWorkInProgress(fiber, pendingProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }

  function placeChild(newFiber, lastPlacedIndex, newIndex) {
    newFiber.index = newIndex;

    if (!shouldTrackSideEffects) {
      // Noop.
      return lastPlacedIndex;
    }

    var current = newFiber.alternate;

    if (current !== null) {
      var oldIndex = current.index;

      if (oldIndex < lastPlacedIndex) {
        // This is a move.
        newFiber.flags |= Placement;
        return lastPlacedIndex;
      } else {
        // This item can stay in place.
        return oldIndex;
      }
    } else {
      // This is an insertion.
      newFiber.flags |= Placement;
      return lastPlacedIndex;
    }
  }

  function placeSingleChild(newFiber) {
    // This is simpler for the single child case. We only need to do a
    // placement for inserting new children.
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.flags |= Placement;
    }

    return newFiber;
  }

  function updateTextNode(returnFiber, current, textContent, lanes) {
    if (current === null || current.tag !== HostText) {
      // Insert
      var created = createFiberFromText(textContent, returnFiber.mode, lanes);
      created.return = returnFiber;
      return created;
    } else {
      // Update
      var existing = useFiber(current, textContent);
      existing.return = returnFiber;
      return existing;
    }
  }

  function updateElement(returnFiber, current, element, lanes) {
    var elementType = element.type;

    if (elementType === REACT_FRAGMENT_TYPE) {
      return updateFragment(
        returnFiber,
        current,
        element.props.children,
        lanes,
        element.key
      );
    }

    if (current !== null) {
      if (
        current.elementType === elementType || // Keep this check inline so it only runs on the false path:
        isCompatibleFamilyForHotReloading(current, element) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        enableLazyElements
      ) {
        // Move based on index
        var existing = useFiber(current, element.props);
        existing.ref = coerceRef(returnFiber, current, element);
        existing.return = returnFiber;

        {
          existing._debugSource = element._source;
          existing._debugOwner = element._owner;
        }

        return existing;
      }
    } // Insert

    var created = createFiberFromElement(element, returnFiber.mode, lanes);
    created.ref = coerceRef(returnFiber, current, element);
    created.return = returnFiber;
    return created;
  }

  function updatePortal(returnFiber, current, portal, lanes) {
    if (
      current === null ||
      current.tag !== HostPortal ||
      current.stateNode.containerInfo !== portal.containerInfo ||
      current.stateNode.implementation !== portal.implementation
    ) {
      // Insert
      var created = createFiberFromPortal(portal, returnFiber.mode, lanes);
      created.return = returnFiber;
      return created;
    } else {
      // Update
      var existing = useFiber(current, portal.children || []);
      existing.return = returnFiber;
      return existing;
    }
  }

  function updateFragment(returnFiber, current, fragment, lanes, key) {
    if (current === null || current.tag !== Fragment) {
      // Insert
      var created = createFiberFromFragment(
        fragment,
        returnFiber.mode,
        lanes,
        key
      );
      created.return = returnFiber;
      return created;
    } else {
      // Update
      var existing = useFiber(current, fragment);
      existing.return = returnFiber;
      return existing;
    }
  }

  function createChild(returnFiber, newChild, lanes) {
    if (typeof newChild === "string" || typeof newChild === "number") {
      // Text nodes don't have keys. If the previous node is implicitly keyed
      // we can continue to replace it without aborting even if it is not a text
      // node.
      var created = createFiberFromText("" + newChild, returnFiber.mode, lanes);
      created.return = returnFiber;
      return created;
    }

    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          var _created = createFiberFromElement(
            newChild,
            returnFiber.mode,
            lanes
          );

          _created.ref = coerceRef(returnFiber, null, newChild);
          _created.return = returnFiber;
          return _created;
        }

        case REACT_PORTAL_TYPE: {
          var _created2 = createFiberFromPortal(
            newChild,
            returnFiber.mode,
            lanes
          );

          _created2.return = returnFiber;
          return _created2;
        }
      }

      if (isArray(newChild) || getIteratorFn(newChild)) {
        var _created3 = createFiberFromFragment(
          newChild,
          returnFiber.mode,
          lanes,
          null
        );

        _created3.return = returnFiber;
        return _created3;
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    {
      if (typeof newChild === "function") {
        warnOnFunctionType(returnFiber);
      }
    }

    return null;
  }

  function updateSlot(returnFiber, oldFiber, newChild, lanes) {
    // Update the fiber if the keys match, otherwise return null.
    var key = oldFiber !== null ? oldFiber.key : null;

    if (typeof newChild === "string" || typeof newChild === "number") {
      // Text nodes don't have keys. If the previous node is implicitly keyed
      // we can continue to replace it without aborting even if it is not a text
      // node.
      if (key !== null) {
        return null;
      }

      return updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
    }

    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          if (newChild.key === key) {
            return updateElement(returnFiber, oldFiber, newChild, lanes);
          } else {
            return null;
          }
        }

        case REACT_PORTAL_TYPE: {
          if (newChild.key === key) {
            return updatePortal(returnFiber, oldFiber, newChild, lanes);
          } else {
            return null;
          }
        }
      }

      if (isArray(newChild) || getIteratorFn(newChild)) {
        if (key !== null) {
          return null;
        }

        return updateFragment(returnFiber, oldFiber, newChild, lanes, null);
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    {
      if (typeof newChild === "function") {
        warnOnFunctionType(returnFiber);
      }
    }

    return null;
  }

  function updateFromMap(
    existingChildren,
    returnFiber,
    newIdx,
    newChild,
    lanes
  ) {
    if (typeof newChild === "string" || typeof newChild === "number") {
      // Text nodes don't have keys, so we neither have to check the old nor
      // new node for the key. If both are text nodes, they match.
      var matchedFiber = existingChildren.get(newIdx) || null;
      return updateTextNode(returnFiber, matchedFiber, "" + newChild, lanes);
    }

    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          var _matchedFiber =
            existingChildren.get(
              newChild.key === null ? newIdx : newChild.key
            ) || null;

          return updateElement(returnFiber, _matchedFiber, newChild, lanes);
        }

        case REACT_PORTAL_TYPE: {
          var _matchedFiber2 =
            existingChildren.get(
              newChild.key === null ? newIdx : newChild.key
            ) || null;

          return updatePortal(returnFiber, _matchedFiber2, newChild, lanes);
        }
      }

      if (isArray(newChild) || getIteratorFn(newChild)) {
        var _matchedFiber3 = existingChildren.get(newIdx) || null;

        return updateFragment(
          returnFiber,
          _matchedFiber3,
          newChild,
          lanes,
          null
        );
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    {
      if (typeof newChild === "function") {
        warnOnFunctionType(returnFiber);
      }
    }

    return null;
  }
  /**
   * Warns if there is a duplicate or missing key
   */

  function warnOnInvalidKey(child, knownKeys, returnFiber) {
    {
      if (typeof child !== "object" || child === null) {
        return knownKeys;
      }

      switch (child.$$typeof) {
        case REACT_ELEMENT_TYPE:
        case REACT_PORTAL_TYPE:
          warnForMissingKey(child, returnFiber);
          var key = child.key;

          if (typeof key !== "string") {
            break;
          }

          if (knownKeys === null) {
            knownKeys = new Set();
            knownKeys.add(key);
            break;
          }

          if (!knownKeys.has(key)) {
            knownKeys.add(key);
            break;
          }

          error(
            "Encountered two children with the same key, `%s`. " +
              "Keys should be unique so that components maintain their identity " +
              "across updates. Non-unique keys may cause children to be " +
              "duplicated and/or omitted — the behavior is unsupported and " +
              "could change in a future version.",
            key
          );

          break;
      }
    }

    return knownKeys;
  }

  function reconcileChildrenArray(
    returnFiber,
    currentFirstChild,
    newChildren,
    lanes
  ) {
    // This algorithm can't optimize by searching from both ends since we
    // don't have backpointers on fibers. I'm trying to see how far we can get
    // with that model. If it ends up not being worth the tradeoffs, we can
    // add it later.
    // Even with a two ended optimization, we'd want to optimize for the case
    // where there are few changes and brute force the comparison instead of
    // going for the Map. It'd like to explore hitting that path first in
    // forward-only mode and only go for the Map once we notice that we need
    // lots of look ahead. This doesn't handle reversal as well as two ended
    // search but that's unusual. Besides, for the two ended optimization to
    // work on Iterables, we'd need to copy the whole set.
    // In this first iteration, we'll just live with hitting the bad case
    // (adding everything to a Map) in for every insert/move.
    // If you change this code, also update reconcileChildrenIterator() which
    // uses the same algorithm.
    {
      // First, validate keys.
      var knownKeys = null;

      for (var i = 0; i < newChildren.length; i++) {
        var child = newChildren[i];
        knownKeys = warnOnInvalidKey(child, knownKeys, returnFiber);
      }
    }

    var resultingFirstChild = null;
    var previousNewFiber = null;
    var oldFiber = currentFirstChild;
    var lastPlacedIndex = 0;
    var newIdx = 0;
    var nextOldFiber = null;

    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }

      var newFiber = updateSlot(
        returnFiber,
        oldFiber,
        newChildren[newIdx],
        lanes
      );

      if (newFiber === null) {
        // TODO: This breaks on empty slots like null children. That's
        // unfortunate because it triggers the slow path all the time. We need
        // a better way to communicate whether this was a miss or null,
        // boolean, undefined, etc.
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }

        break;
      }

      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          // We matched the slot, but we didn't reuse the existing fiber, so we
          // need to delete the existing child.
          deleteChild(returnFiber, oldFiber);
        }
      }

      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultingFirstChild = newFiber;
      } else {
        // TODO: Defer siblings if we're not at the right index for this slot.
        // I.e. if we had null values before, then we want to defer this
        // for each null value. However, we also don't want to call updateSlot
        // with the previous one.
        previousNewFiber.sibling = newFiber;
      }

      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (newIdx === newChildren.length) {
      // We've reached the end of the new children. We can delete the rest.
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; newIdx < newChildren.length; newIdx++) {
        var _newFiber = createChild(returnFiber, newChildren[newIdx], lanes);

        if (_newFiber === null) {
          continue;
        }

        lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = _newFiber;
        } else {
          previousNewFiber.sibling = _newFiber;
        }

        previousNewFiber = _newFiber;
      }

      return resultingFirstChild;
    } // Add all children to a key map for quick lookups.

    var existingChildren = mapRemainingChildren(returnFiber, oldFiber); // Keep scanning and use the map to restore deleted items as moves.

    for (; newIdx < newChildren.length; newIdx++) {
      var _newFiber2 = updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        newChildren[newIdx],
        lanes
      );

      if (_newFiber2 !== null) {
        if (shouldTrackSideEffects) {
          if (_newFiber2.alternate !== null) {
            // The new fiber is a work in progress, but if there exists a
            // current, that means that we reused the fiber. We need to delete
            // it from the child list so that we don't add it to the deletion
            // list.
            existingChildren.delete(
              _newFiber2.key === null ? newIdx : _newFiber2.key
            );
          }
        }

        lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          resultingFirstChild = _newFiber2;
        } else {
          previousNewFiber.sibling = _newFiber2;
        }

        previousNewFiber = _newFiber2;
      }
    }

    if (shouldTrackSideEffects) {
      // Any existing children that weren't consumed above were deleted. We need
      // to add them to the deletion list.
      existingChildren.forEach(function(child) {
        return deleteChild(returnFiber, child);
      });
    }

    return resultingFirstChild;
  }

  function reconcileChildrenIterator(
    returnFiber,
    currentFirstChild,
    newChildrenIterable,
    lanes
  ) {
    // This is the same implementation as reconcileChildrenArray(),
    // but using the iterator instead.
    var iteratorFn = getIteratorFn(newChildrenIterable);

    if (!(typeof iteratorFn === "function")) {
      throw Error(
        "An object is not an iterable. This error is likely caused by a bug in React. Please file an issue."
      );
    }

    {
      // We don't support rendering Generators because it's a mutation.
      // See https://github.com/facebook/react/issues/12995
      if (
        typeof Symbol === "function" && // $FlowFixMe Flow doesn't know about toStringTag
        newChildrenIterable[Symbol.toStringTag] === "Generator"
      ) {
        if (!didWarnAboutGenerators) {
          error(
            "Using Generators as children is unsupported and will likely yield " +
              "unexpected results because enumerating a generator mutates it. " +
              "You may convert it to an array with `Array.from()` or the " +
              "`[...spread]` operator before rendering. Keep in mind " +
              "you might need to polyfill these features for older browsers."
          );
        }

        didWarnAboutGenerators = true;
      } // Warn about using Maps as children

      if (newChildrenIterable.entries === iteratorFn) {
        if (!didWarnAboutMaps) {
          error(
            "Using Maps as children is not supported. " +
              "Use an array of keyed ReactElements instead."
          );
        }

        didWarnAboutMaps = true;
      } // First, validate keys.
      // We'll get a different iterator later for the main pass.

      var _newChildren = iteratorFn.call(newChildrenIterable);

      if (_newChildren) {
        var knownKeys = null;

        var _step = _newChildren.next();

        for (; !_step.done; _step = _newChildren.next()) {
          var child = _step.value;
          knownKeys = warnOnInvalidKey(child, knownKeys, returnFiber);
        }
      }
    }

    var newChildren = iteratorFn.call(newChildrenIterable);

    if (!(newChildren != null)) {
      throw Error("An iterable object provided no iterator.");
    }

    var resultingFirstChild = null;
    var previousNewFiber = null;
    var oldFiber = currentFirstChild;
    var lastPlacedIndex = 0;
    var newIdx = 0;
    var nextOldFiber = null;
    var step = newChildren.next();

    for (
      ;
      oldFiber !== null && !step.done;
      newIdx++, step = newChildren.next()
    ) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }

      var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);

      if (newFiber === null) {
        // TODO: This breaks on empty slots like null children. That's
        // unfortunate because it triggers the slow path all the time. We need
        // a better way to communicate whether this was a miss or null,
        // boolean, undefined, etc.
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }

        break;
      }

      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          // We matched the slot, but we didn't reuse the existing fiber, so we
          // need to delete the existing child.
          deleteChild(returnFiber, oldFiber);
        }
      }

      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultingFirstChild = newFiber;
      } else {
        // TODO: Defer siblings if we're not at the right index for this slot.
        // I.e. if we had null values before, then we want to defer this
        // for each null value. However, we also don't want to call updateSlot
        // with the previous one.
        previousNewFiber.sibling = newFiber;
      }

      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (step.done) {
      // We've reached the end of the new children. We can delete the rest.
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; !step.done; newIdx++, step = newChildren.next()) {
        var _newFiber3 = createChild(returnFiber, step.value, lanes);

        if (_newFiber3 === null) {
          continue;
        }

        lastPlacedIndex = placeChild(_newFiber3, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = _newFiber3;
        } else {
          previousNewFiber.sibling = _newFiber3;
        }

        previousNewFiber = _newFiber3;
      }

      return resultingFirstChild;
    } // Add all children to a key map for quick lookups.

    var existingChildren = mapRemainingChildren(returnFiber, oldFiber); // Keep scanning and use the map to restore deleted items as moves.

    for (; !step.done; newIdx++, step = newChildren.next()) {
      var _newFiber4 = updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        step.value,
        lanes
      );

      if (_newFiber4 !== null) {
        if (shouldTrackSideEffects) {
          if (_newFiber4.alternate !== null) {
            // The new fiber is a work in progress, but if there exists a
            // current, that means that we reused the fiber. We need to delete
            // it from the child list so that we don't add it to the deletion
            // list.
            existingChildren.delete(
              _newFiber4.key === null ? newIdx : _newFiber4.key
            );
          }
        }

        lastPlacedIndex = placeChild(_newFiber4, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          resultingFirstChild = _newFiber4;
        } else {
          previousNewFiber.sibling = _newFiber4;
        }

        previousNewFiber = _newFiber4;
      }
    }

    if (shouldTrackSideEffects) {
      // Any existing children that weren't consumed above were deleted. We need
      // to add them to the deletion list.
      existingChildren.forEach(function(child) {
        return deleteChild(returnFiber, child);
      });
    }

    return resultingFirstChild;
  }

  function reconcileSingleTextNode(
    returnFiber,
    currentFirstChild,
    textContent,
    lanes
  ) {
    // There's no need to check for keys on text nodes since we don't have a
    // way to define them.
    if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
      // We already have an existing node so let's just update it and delete
      // the rest.
      deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
      var existing = useFiber(currentFirstChild, textContent);
      existing.return = returnFiber;
      return existing;
    } // The existing first child is not a text node so we need to create one
    // and delete the existing ones.

    deleteRemainingChildren(returnFiber, currentFirstChild);
    var created = createFiberFromText(textContent, returnFiber.mode, lanes);
    created.return = returnFiber;
    return created;
  }

  function reconcileSingleElement(
    returnFiber,
    currentFirstChild,
    element,
    lanes
  ) {
    var key = element.key;
    var child = currentFirstChild;

    while (child !== null) {
      // TODO: If key === null and child.key === null, then this only applies to
      // the first item in the list.
      if (child.key === key) {
        var elementType = element.type;

        if (elementType === REACT_FRAGMENT_TYPE) {
          if (child.tag === Fragment) {
            deleteRemainingChildren(returnFiber, child.sibling);
            var existing = useFiber(child, element.props.children);
            existing.return = returnFiber;

            {
              existing._debugSource = element._source;
              existing._debugOwner = element._owner;
            }

            return existing;
          }
        } else {
          if (
            child.elementType === elementType || // Keep this check inline so it only runs on the false path:
            isCompatibleFamilyForHotReloading(child, element) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            enableLazyElements
          ) {
            deleteRemainingChildren(returnFiber, child.sibling);

            var _existing = useFiber(child, element.props);

            _existing.ref = coerceRef(returnFiber, child, element);
            _existing.return = returnFiber;

            {
              _existing._debugSource = element._source;
              _existing._debugOwner = element._owner;
            }

            return _existing;
          }
        } // Didn't match.

        deleteRemainingChildren(returnFiber, child);
        break;
      } else {
        deleteChild(returnFiber, child);
      }

      child = child.sibling;
    }

    if (element.type === REACT_FRAGMENT_TYPE) {
      var created = createFiberFromFragment(
        element.props.children,
        returnFiber.mode,
        lanes,
        element.key
      );
      created.return = returnFiber;
      return created;
    } else {
      var _created4 = createFiberFromElement(element, returnFiber.mode, lanes);

      _created4.ref = coerceRef(returnFiber, currentFirstChild, element);
      _created4.return = returnFiber;
      return _created4;
    }
  }

  function reconcileSinglePortal(
    returnFiber,
    currentFirstChild,
    portal,
    lanes
  ) {
    var key = portal.key;
    var child = currentFirstChild;

    while (child !== null) {
      // TODO: If key === null and child.key === null, then this only applies to
      // the first item in the list.
      if (child.key === key) {
        if (
          child.tag === HostPortal &&
          child.stateNode.containerInfo === portal.containerInfo &&
          child.stateNode.implementation === portal.implementation
        ) {
          deleteRemainingChildren(returnFiber, child.sibling);
          var existing = useFiber(child, portal.children || []);
          existing.return = returnFiber;
          return existing;
        } else {
          deleteRemainingChildren(returnFiber, child);
          break;
        }
      } else {
        deleteChild(returnFiber, child);
      }

      child = child.sibling;
    }

    var created = createFiberFromPortal(portal, returnFiber.mode, lanes);
    created.return = returnFiber;
    return created;
  } // This API will tag the children with the side-effect of the reconciliation
  // itself. They will be added to the side-effect list as we pass through the
  // children and the parent.

  function reconcileChildFibers(
    returnFiber,
    currentFirstChild,
    newChild,
    lanes
  ) {
    // This function is not recursive.
    // If the top level item is an array, we treat it as a set of children,
    // not as a fragment. Nested arrays on the other hand will be treated as
    // fragment nodes. Recursion happens at the normal flow.
    // Handle top level unkeyed fragments as if they were arrays.
    // This leads to an ambiguity between <>{[...]}</> and <>...</>.
    // We treat the ambiguous cases above the same.
    var isUnkeyedTopLevelFragment =
      typeof newChild === "object" &&
      newChild !== null &&
      newChild.type === REACT_FRAGMENT_TYPE &&
      newChild.key === null;

    if (isUnkeyedTopLevelFragment) {
      newChild = newChild.props.children;
    } // Handle object types

    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes
            )
          );

        case REACT_PORTAL_TYPE:
          return placeSingleChild(
            reconcileSinglePortal(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes
            )
          );
      }

      if (isArray(newChild)) {
        return reconcileChildrenArray(
          returnFiber,
          currentFirstChild,
          newChild,
          lanes
        );
      }

      if (getIteratorFn(newChild)) {
        return reconcileChildrenIterator(
          returnFiber,
          currentFirstChild,
          newChild,
          lanes
        );
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    if (typeof newChild === "string" || typeof newChild === "number") {
      return placeSingleChild(
        reconcileSingleTextNode(
          returnFiber,
          currentFirstChild,
          "" + newChild,
          lanes
        )
      );
    }

    {
      if (typeof newChild === "function") {
        warnOnFunctionType(returnFiber);
      }
    } // Remaining cases are all treated as empty.

    return deleteRemainingChildren(returnFiber, currentFirstChild);
  }

  return reconcileChildFibers;
}

var reconcileChildFibers = ChildReconciler(true);
var mountChildFibers = ChildReconciler(false);
function cloneChildFibers(current, workInProgress) {
  if (!(current === null || workInProgress.child === current.child)) {
    throw Error("Resuming work not yet implemented.");
  }

  if (workInProgress.child === null) {
    return;
  }

  var currentChild = workInProgress.child;
  var newChild = createWorkInProgress(currentChild, currentChild.pendingProps);
  workInProgress.child = newChild;
  newChild.return = workInProgress;

  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling;
    newChild = newChild.sibling = createWorkInProgress(
      currentChild,
      currentChild.pendingProps
    );
    newChild.return = workInProgress;
  }

  newChild.sibling = null;
} // Reset a workInProgress child set to prepare it for a second pass.

function resetChildFibers(workInProgress, lanes) {
  var child = workInProgress.child;

  while (child !== null) {
    resetWorkInProgress(child, lanes);
    child = child.sibling;
  }
}

var NO_CONTEXT = {};
var contextStackCursor$1 = createCursor(NO_CONTEXT);
var contextFiberStackCursor = createCursor(NO_CONTEXT);
var rootInstanceStackCursor = createCursor(NO_CONTEXT);

function requiredContext(c) {
  if (!(c !== NO_CONTEXT)) {
    throw Error(
      "Expected host context to exist. This error is likely caused by a bug in React. Please file an issue."
    );
  }

  return c;
}

function getRootHostContainer() {
  var rootInstance = requiredContext(rootInstanceStackCursor.current);
  return rootInstance;
}

function pushHostContainer(fiber, nextRootInstance) {
  // Push current root instance onto the stack;
  // This allows us to reset root when portals are popped.
  push(rootInstanceStackCursor, nextRootInstance, fiber); // Track the context and the Fiber that provided it.
  // This enables us to pop only Fibers that provide unique contexts.

  push(contextFiberStackCursor, fiber, fiber); // Finally, we need to push the host context to the stack.
  // However, we can't just call getRootHostContext() and push it because
  // we'd have a different number of entries on the stack depending on
  // whether getRootHostContext() throws somewhere in renderer code or not.
  // So we push an empty value first. This lets us safely unwind on errors.

  push(contextStackCursor$1, NO_CONTEXT, fiber);
  var nextRootContext = getRootHostContext(); // Now that we know this function doesn't throw, replace it.

  pop(contextStackCursor$1, fiber);
  push(contextStackCursor$1, nextRootContext, fiber);
}

function popHostContainer(fiber) {
  pop(contextStackCursor$1, fiber);
  pop(contextFiberStackCursor, fiber);
  pop(rootInstanceStackCursor, fiber);
}

function getHostContext() {
  var context = requiredContext(contextStackCursor$1.current);
  return context;
}

function pushHostContext(fiber) {
  var rootInstance = requiredContext(rootInstanceStackCursor.current);
  var context = requiredContext(contextStackCursor$1.current);
  var nextContext = getChildHostContext(context, fiber.type); // Don't push this Fiber's context unless it's unique.

  if (context === nextContext) {
    return;
  } // Track the context and the Fiber that provided it.
  // This enables us to pop only Fibers that provide unique contexts.

  push(contextFiberStackCursor, fiber, fiber);
  push(contextStackCursor$1, nextContext, fiber);
}

function popHostContext(fiber) {
  // Do not pop unless this Fiber provided the current context.
  // pushHostContext() only pushes Fibers that provide unique contexts.
  if (contextFiberStackCursor.current !== fiber) {
    return;
  }

  pop(contextStackCursor$1, fiber);
  pop(contextFiberStackCursor, fiber);
}

var DefaultSuspenseContext = 0; // The Suspense Context is split into two parts. The lower bits is
// inherited deeply down the subtree. The upper bits only affect
// this immediate suspense boundary and gets reset each new
// boundary or suspense list.

var SubtreeSuspenseContextMask = 1; // Subtree Flags:
// InvisibleParentSuspenseContext indicates that one of our parent Suspense
// boundaries is not currently showing visible main content.
// Either because it is already showing a fallback or is not mounted at all.
// We can use this to determine if it is desirable to trigger a fallback at
// the parent. If not, then we might need to trigger undesirable boundaries
// and/or suspend the commit to avoid hiding the parent content.

var InvisibleParentSuspenseContext = 1; // Shallow Flags:
// ForceSuspenseFallback can be used by SuspenseList to force newly added
// items into their fallback state during one of the render passes.

var ForceSuspenseFallback = 2;
var suspenseStackCursor = createCursor(DefaultSuspenseContext);
function hasSuspenseContext(parentContext, flag) {
  return (parentContext & flag) !== 0;
}
function setDefaultShallowSuspenseContext(parentContext) {
  return parentContext & SubtreeSuspenseContextMask;
}
function setShallowSuspenseContext(parentContext, shallowContext) {
  return (parentContext & SubtreeSuspenseContextMask) | shallowContext;
}
function addSubtreeSuspenseContext(parentContext, subtreeContext) {
  return parentContext | subtreeContext;
}
function pushSuspenseContext(fiber, newContext) {
  push(suspenseStackCursor, newContext, fiber);
}
function popSuspenseContext(fiber) {
  pop(suspenseStackCursor, fiber);
}

function shouldCaptureSuspense(workInProgress, hasInvisibleParent) {
  // If it was the primary children that just suspended, capture and render the
  // fallback. Otherwise, don't capture and bubble to the next boundary.
  var nextState = workInProgress.memoizedState;

  if (nextState !== null) {
    if (nextState.dehydrated !== null) {
      // A dehydrated boundary always captures.
      return true;
    }

    return false;
  }

  var props = workInProgress.memoizedProps; // Regular boundaries always capture.

  if (props.unstable_avoidThisFallback !== true) {
    return true;
  } // If it's a boundary we should avoid, then we prefer to bubble up to the
  // parent boundary if it is currently invisible.

  if (hasInvisibleParent) {
    return false;
  } // If the parent is not able to handle it, we must handle it.

  return true;
}
function findFirstSuspended(row) {
  var node = row;

  while (node !== null) {
    if (node.tag === SuspenseComponent) {
      var state = node.memoizedState;

      if (state !== null) {
        var dehydrated = state.dehydrated;

        if (
          dehydrated === null ||
          isSuspenseInstancePending() ||
          isSuspenseInstanceFallback()
        ) {
          return node;
        }
      }
    } else if (
      node.tag === SuspenseListComponent && // revealOrder undefined can't be trusted because it don't
      // keep track of whether it suspended or not.
      node.memoizedProps.revealOrder !== undefined
    ) {
      var didSuspend = (node.flags & DidCapture) !== NoFlags;

      if (didSuspend) {
        return node;
      }
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === row) {
      return null;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === row) {
        return null;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }

  return null;
}

var NoFlags$1 =
  /*  */
  0; // Represents whether effect should fire.

var HasEffect =
  /* */
  1; // Represents the phase in which the effect (not the clean-up) fires.

var Layout =
  /*    */
  2;
var Passive$1 =
  /*   */
  4;

var isHydrating = false;

function enterHydrationState(fiber) {
  {
    return false;
  }
}

function prepareToHydrateHostInstance(
  fiber,
  rootContainerInstance,
  hostContext
) {
  {
    {
      throw Error(
        "Expected prepareToHydrateHostInstance() to never be called. This error is likely caused by a bug in React. Please file an issue."
      );
    }
  }
}

function prepareToHydrateHostTextInstance(fiber) {
  {
    {
      throw Error(
        "Expected prepareToHydrateHostTextInstance() to never be called. This error is likely caused by a bug in React. Please file an issue."
      );
    }
  }
  var shouldUpdate = hydrateTextInstance();
}

function popHydrationState(fiber) {
  {
    return false;
  }
}

function getIsHydrating() {
  return isHydrating;
}

// and should be reset before starting a new render.
// This tracks which mutable sources need to be reset after a render.

var workInProgressSources = [];
var rendererSigil$1;

{
  // Used to detect multiple renderers using the same mutable source.
  rendererSigil$1 = {};
}

function markSourceAsDirty(mutableSource) {
  workInProgressSources.push(mutableSource);
}
function resetWorkInProgressVersions() {
  for (var i = 0; i < workInProgressSources.length; i++) {
    var mutableSource = workInProgressSources[i];

    {
      mutableSource._workInProgressVersionPrimary = null;
    }
  }

  workInProgressSources.length = 0;
}
function getWorkInProgressVersion(mutableSource) {
  {
    return mutableSource._workInProgressVersionPrimary;
  }
}
function setWorkInProgressVersion(mutableSource, version) {
  {
    mutableSource._workInProgressVersionPrimary = version;
  }

  workInProgressSources.push(mutableSource);
}
function warnAboutMultipleRenderersDEV(mutableSource) {
  {
    {
      if (mutableSource._currentPrimaryRenderer == null) {
        mutableSource._currentPrimaryRenderer = rendererSigil$1;
      } else if (mutableSource._currentPrimaryRenderer !== rendererSigil$1) {
        error(
          "Detected multiple renderers concurrently rendering the " +
            "same mutable source. This is currently unsupported."
        );
      }
    }
  }
} // Eager reads the version of a mutable source and stores it on the root.

function getSuspendedCachePool() {
  {
    return null;
  } // We check the cache on the stack first, since that's the one any new Caches
}

var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher,
  ReactCurrentBatchConfig$1 = ReactSharedInternals.ReactCurrentBatchConfig;
var didWarnAboutMismatchedHooksForComponent;
var didWarnAboutUseOpaqueIdentifier;
var didWarnUncachedGetSnapshot;

{
  didWarnAboutUseOpaqueIdentifier = {};
  didWarnAboutMismatchedHooksForComponent = new Set();
}

// These are set right before calling the component.
var renderLanes = NoLanes; // The work-in-progress fiber. I've named it differently to distinguish it from
// the work-in-progress hook.

var currentlyRenderingFiber$1 = null; // Hooks are stored as a linked list on the fiber's memoizedState field. The
// current hook list is the list that belongs to the current fiber. The
// work-in-progress hook list is a new list that will be added to the
// work-in-progress fiber.

var currentHook = null;
var workInProgressHook = null; // Whether an update was scheduled at any point during the render phase. This
// does not get reset if we do another render pass; only when we're completely
// finished evaluating this component. This is an optimization so we know
// whether we need to clear render phase updates after a throw.

var didScheduleRenderPhaseUpdate = false; // Where an update was scheduled only during the current render pass. This
// gets reset after each attempt.
// TODO: Maybe there's some way to consolidate this with
// `didScheduleRenderPhaseUpdate`. Or with `numberOfReRenders`.

var didScheduleRenderPhaseUpdateDuringThisPass = false;
var RE_RENDER_LIMIT = 25; // In DEV, this is the name of the currently executing primitive hook

var currentHookNameInDev = null; // In DEV, this list ensures that hooks are called in the same order between renders.
// The list stores the order of hooks used during the initial render (mount).
// Subsequent renders (updates) reference this list.

var hookTypesDev = null;
var hookTypesUpdateIndexDev = -1; // In DEV, this tracks whether currently rendering component needs to ignore
// the dependencies for Hooks that need them (e.g. useEffect or useMemo).
// When true, such Hooks will always be "remounted". Only used during hot reload.

var ignorePreviousDependencies = false;

function mountHookTypesDev() {
  {
    var hookName = currentHookNameInDev;

    if (hookTypesDev === null) {
      hookTypesDev = [hookName];
    } else {
      hookTypesDev.push(hookName);
    }
  }
}

function updateHookTypesDev() {
  {
    var hookName = currentHookNameInDev;

    if (hookTypesDev !== null) {
      hookTypesUpdateIndexDev++;

      if (hookTypesDev[hookTypesUpdateIndexDev] !== hookName) {
        warnOnHookMismatchInDev(hookName);
      }
    }
  }
}

function checkDepsAreArrayDev(deps) {
  {
    if (deps !== undefined && deps !== null && !isArray(deps)) {
      // Verify deps, but only on mount to avoid extra checks.
      // It's unlikely their type would change as usually you define them inline.
      error(
        "%s received a final argument that is not an array (instead, received `%s`). When " +
          "specified, the final argument must be an array.",
        currentHookNameInDev,
        typeof deps
      );
    }
  }
}

function warnOnHookMismatchInDev(currentHookName) {
  {
    var componentName = getComponentNameFromFiber(currentlyRenderingFiber$1);

    if (!didWarnAboutMismatchedHooksForComponent.has(componentName)) {
      didWarnAboutMismatchedHooksForComponent.add(componentName);

      if (hookTypesDev !== null) {
        var table = "";
        var secondColumnStart = 30;

        for (var i = 0; i <= hookTypesUpdateIndexDev; i++) {
          var oldHookName = hookTypesDev[i];
          var newHookName =
            i === hookTypesUpdateIndexDev ? currentHookName : oldHookName;
          var row = i + 1 + ". " + oldHookName; // Extra space so second column lines up
          // lol @ IE not supporting String#repeat

          while (row.length < secondColumnStart) {
            row += " ";
          }

          row += newHookName + "\n";
          table += row;
        }

        error(
          "React has detected a change in the order of Hooks called by %s. " +
            "This will lead to bugs and errors if not fixed. " +
            "For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks\n\n" +
            "   Previous render            Next render\n" +
            "   ------------------------------------------------------\n" +
            "%s" +
            "   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n",
          componentName,
          table
        );
      }
    }
  }
}

function throwInvalidHookError() {
  {
    throw Error(
      "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem."
    );
  }
}

function areHookInputsEqual(nextDeps, prevDeps) {
  {
    if (ignorePreviousDependencies) {
      // Only true when this component is being hot reloaded.
      return false;
    }
  }

  if (prevDeps === null) {
    {
      error(
        "%s received a final argument during this render, but not during " +
          "the previous render. Even though the final argument is optional, " +
          "its type cannot change between renders.",
        currentHookNameInDev
      );
    }

    return false;
  }

  {
    // Don't bother comparing lengths in prod because these arrays should be
    // passed inline.
    if (nextDeps.length !== prevDeps.length) {
      error(
        "The final argument passed to %s changed size between renders. The " +
          "order and size of this array must remain constant.\n\n" +
          "Previous: %s\n" +
          "Incoming: %s",
        currentHookNameInDev,
        "[" + prevDeps.join(", ") + "]",
        "[" + nextDeps.join(", ") + "]"
      );
    }
  }

  for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (objectIs(nextDeps[i], prevDeps[i])) {
      continue;
    }

    return false;
  }

  return true;
}

function renderWithHooks(
  current,
  workInProgress,
  Component,
  props,
  secondArg,
  nextRenderLanes
) {
  renderLanes = nextRenderLanes;
  currentlyRenderingFiber$1 = workInProgress;

  {
    hookTypesDev = current !== null ? current._debugHookTypes : null;
    hookTypesUpdateIndexDev = -1; // Used for hot reloading:

    ignorePreviousDependencies =
      current !== null && current.type !== workInProgress.type;
  }

  workInProgress.memoizedState = null;
  workInProgress.updateQueue = null;
  workInProgress.lanes = NoLanes; // The following should have already been reset
  // currentHook = null;
  // workInProgressHook = null;
  // didScheduleRenderPhaseUpdate = false;
  // TODO Warn if no hooks are used at all during mount, then some are used during update.
  // Currently we will identify the update render as a mount because memoizedState === null.
  // This is tricky because it's valid for certain types of components (e.g. React.lazy)
  // Using memoizedState to differentiate between mount/update only works if at least one stateful hook is used.
  // Non-stateful hooks (e.g. context) don't get added to memoizedState,
  // so memoizedState would be null during updates and mounts.

  {
    if (current !== null && current.memoizedState !== null) {
      ReactCurrentDispatcher$1.current = HooksDispatcherOnUpdateInDEV;
    } else if (hookTypesDev !== null) {
      // This dispatcher handles an edge case where a component is updating,
      // but no stateful hooks have been used.
      // We want to match the production code behavior (which will use HooksDispatcherOnMount),
      // but with the extra DEV validation to ensure hooks ordering hasn't changed.
      // This dispatcher does that.
      ReactCurrentDispatcher$1.current = HooksDispatcherOnMountWithHookTypesInDEV;
    } else {
      ReactCurrentDispatcher$1.current = HooksDispatcherOnMountInDEV;
    }
  }

  var children = Component(props, secondArg); // Check if there was a render phase update

  if (didScheduleRenderPhaseUpdateDuringThisPass) {
    // Keep rendering in a loop for as long as render phase updates continue to
    // be scheduled. Use a counter to prevent infinite loops.
    var numberOfReRenders = 0;

    do {
      didScheduleRenderPhaseUpdateDuringThisPass = false;

      if (!(numberOfReRenders < RE_RENDER_LIMIT)) {
        throw Error(
          "Too many re-renders. React limits the number of renders to prevent an infinite loop."
        );
      }

      numberOfReRenders += 1;

      {
        // Even when hot reloading, allow dependencies to stabilize
        // after first render to prevent infinite render phase updates.
        ignorePreviousDependencies = false;
      } // Start over from the beginning of the list

      currentHook = null;
      workInProgressHook = null;
      workInProgress.updateQueue = null;

      {
        // Also validate hook order for cascading updates.
        hookTypesUpdateIndexDev = -1;
      }

      ReactCurrentDispatcher$1.current = HooksDispatcherOnRerenderInDEV;
      children = Component(props, secondArg);
    } while (didScheduleRenderPhaseUpdateDuringThisPass);
  } // We can assume the previous dispatcher is always this one, since we set it
  // at the beginning of the render phase and there's no re-entrance.

  ReactCurrentDispatcher$1.current = ContextOnlyDispatcher;

  {
    workInProgress._debugHookTypes = hookTypesDev;
  } // This check uses currentHook so that it works the same in DEV and prod bundles.
  // hookTypesDev could catch more cases (e.g. context) but only in DEV bundles.

  var didRenderTooFewHooks = currentHook !== null && currentHook.next !== null;
  renderLanes = NoLanes;
  currentlyRenderingFiber$1 = null;
  currentHook = null;
  workInProgressHook = null;

  {
    currentHookNameInDev = null;
    hookTypesDev = null;
    hookTypesUpdateIndexDev = -1; // Confirm that a static flag was not added or removed since the last
    // render. If this fires, it suggests that we incorrectly reset the static
    // flags in some other part of the codebase. This has happened before, for
    // example, in the SuspenseList implementation.

    if (
      current !== null &&
      (current.flags & StaticMask) !== (workInProgress.flags & StaticMask) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (current.mode & ConcurrentMode) !== NoMode
    ) {
      error(
        "Internal React error: Expected static flag was missing. Please " +
          "notify the React team."
      );
    }
  }

  didScheduleRenderPhaseUpdate = false;

  if (!!didRenderTooFewHooks) {
    throw Error(
      "Rendered fewer hooks than expected. This may be caused by an accidental early return statement."
    );
  }

  return children;
}
function bailoutHooks(current, workInProgress, lanes) {
  workInProgress.updateQueue = current.updateQueue; // TODO: Don't need to reset the flags here, because they're reset in the
  // complete phase (bubbleProperties).

  if ((workInProgress.mode & StrictEffectsMode) !== NoMode) {
    workInProgress.flags &= ~(
      MountPassiveDev |
      MountLayoutDev |
      Passive |
      Update
    );
  } else {
    workInProgress.flags &= ~(Passive | Update);
  }

  current.lanes = removeLanes(current.lanes, lanes);
}
function resetHooksAfterThrow() {
  // We can assume the previous dispatcher is always this one, since we set it
  // at the beginning of the render phase and there's no re-entrance.
  ReactCurrentDispatcher$1.current = ContextOnlyDispatcher;

  if (didScheduleRenderPhaseUpdate) {
    // There were render phase updates. These are only valid for this render
    // phase, which we are now aborting. Remove the updates from the queues so
    // they do not persist to the next render. Do not remove updates from hooks
    // that weren't processed.
    //
    // Only reset the updates from the queue if it has a clone. If it does
    // not have a clone, that means it wasn't processed, and the updates were
    // scheduled before we entered the render phase.
    var hook = currentlyRenderingFiber$1.memoizedState;

    while (hook !== null) {
      var queue = hook.queue;

      if (queue !== null) {
        queue.pending = null;
      }

      hook = hook.next;
    }

    didScheduleRenderPhaseUpdate = false;
  }

  renderLanes = NoLanes;
  currentlyRenderingFiber$1 = null;
  currentHook = null;
  workInProgressHook = null;

  {
    hookTypesDev = null;
    hookTypesUpdateIndexDev = -1;
    currentHookNameInDev = null;
    isUpdatingOpaqueValueInRenderPhase = false;
  }

  didScheduleRenderPhaseUpdateDuringThisPass = false;
}

function mountWorkInProgressHook() {
  var hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };

  if (workInProgressHook === null) {
    // This is the first hook in the list
    currentlyRenderingFiber$1.memoizedState = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }

  return workInProgressHook;
}

function updateWorkInProgressHook() {
  // This function is used both for updates and for re-renders triggered by a
  // render phase update. It assumes there is either a current hook we can
  // clone, or a work-in-progress hook from a previous render pass that we can
  // use as a base. When we reach the end of the base list, we must switch to
  // the dispatcher used for mounts.
  var nextCurrentHook;

  if (currentHook === null) {
    var current = currentlyRenderingFiber$1.alternate;

    if (current !== null) {
      nextCurrentHook = current.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    nextCurrentHook = currentHook.next;
  }

  var nextWorkInProgressHook;

  if (workInProgressHook === null) {
    nextWorkInProgressHook = currentlyRenderingFiber$1.memoizedState;
  } else {
    nextWorkInProgressHook = workInProgressHook.next;
  }

  if (nextWorkInProgressHook !== null) {
    // There's already a work-in-progress. Reuse it.
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;
    currentHook = nextCurrentHook;
  } else {
    // Clone from the current hook.
    if (!(nextCurrentHook !== null)) {
      throw Error("Rendered more hooks than during the previous render.");
    }

    currentHook = nextCurrentHook;
    var newHook = {
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,
      next: null
    };

    if (workInProgressHook === null) {
      // This is the first hook in the list.
      currentlyRenderingFiber$1.memoizedState = workInProgressHook = newHook;
    } else {
      // Append to the end of the list.
      workInProgressHook = workInProgressHook.next = newHook;
    }
  }

  return workInProgressHook;
}

function createFunctionComponentUpdateQueue() {
  return {
    lastEffect: null
  };
}

function basicStateReducer(state, action) {
  // $FlowFixMe: Flow doesn't like mixed types
  return typeof action === "function" ? action(state) : action;
}

function mountReducer(reducer, initialArg, init) {
  var hook = mountWorkInProgressHook();
  var initialState;

  if (init !== undefined) {
    initialState = init(initialArg);
  } else {
    initialState = initialArg;
  }

  hook.memoizedState = hook.baseState = initialState;
  var queue = {
    pending: null,
    interleaved: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: initialState
  };
  hook.queue = queue;
  var dispatch = (queue.dispatch = dispatchAction.bind(
    null,
    currentlyRenderingFiber$1,
    queue
  ));
  return [hook.memoizedState, dispatch];
}

function updateReducer(reducer, initialArg, init) {
  var hook = updateWorkInProgressHook();
  var queue = hook.queue;

  if (!(queue !== null)) {
    throw Error(
      "Should have a queue. This is likely a bug in React. Please file an issue."
    );
  }

  queue.lastRenderedReducer = reducer;
  var current = currentHook; // The last rebase update that is NOT part of the base state.

  var baseQueue = current.baseQueue; // The last pending update that hasn't been processed yet.

  var pendingQueue = queue.pending;

  if (pendingQueue !== null) {
    // We have new updates that haven't been processed yet.
    // We'll add them to the base queue.
    if (baseQueue !== null) {
      // Merge the pending queue and the base queue.
      var baseFirst = baseQueue.next;
      var pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }

    {
      if (current.baseQueue !== baseQueue) {
        // Internal invariant that should never happen, but feasibly could in
        // the future if we implement resuming, or some form of that.
        error(
          "Internal error: Expected work-in-progress queue to be a clone. " +
            "This is a bug in React."
        );
      }
    }

    current.baseQueue = baseQueue = pendingQueue;
    queue.pending = null;
  }

  if (baseQueue !== null) {
    // We have a queue to process.
    var first = baseQueue.next;
    var newState = current.baseState;
    var newBaseState = null;
    var newBaseQueueFirst = null;
    var newBaseQueueLast = null;
    var update = first;

    do {
      var updateLane = update.lane;

      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        // Priority is insufficient. Skip this update. If this is the first
        // skipped update, the previous update/state is the new base
        // update/state.
        var clone = {
          lane: updateLane,
          action: update.action,
          eagerReducer: update.eagerReducer,
          eagerState: update.eagerState,
          next: null
        };

        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        } // Update the remaining priority in the queue.
        // TODO: Don't need to accumulate this. Instead, we can remove
        // renderLanes from the original lanes.

        currentlyRenderingFiber$1.lanes = mergeLanes(
          currentlyRenderingFiber$1.lanes,
          updateLane
        );
        markSkippedUpdateLanes(updateLane);
      } else {
        // This update does have sufficient priority.
        if (newBaseQueueLast !== null) {
          var _clone = {
            // This update is going to be committed so we never want uncommit
            // it. Using NoLane works because 0 is a subset of all bitmasks, so
            // this will never be skipped by the check above.
            lane: NoLane,
            action: update.action,
            eagerReducer: update.eagerReducer,
            eagerState: update.eagerState,
            next: null
          };
          newBaseQueueLast = newBaseQueueLast.next = _clone;
        } // Process this update.

        if (update.eagerReducer === reducer) {
          // If this update was processed eagerly, and its reducer matches the
          // current reducer, we can use the eagerly computed state.
          newState = update.eagerState;
        } else {
          var action = update.action;
          newState = reducer(newState, action);
        }
      }

      update = update.next;
    } while (update !== null && update !== first);

    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = newBaseQueueFirst;
    } // Mark that the fiber performed work, but only if the new state is
    // different from the current state.

    if (!objectIs(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }

    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;
    queue.lastRenderedState = newState;
  } // Interleaved updates are stored on a separate queue. We aren't going to
  // process them during this render, but we do need to track which lanes
  // are remaining.

  var lastInterleaved = queue.interleaved;

  if (lastInterleaved !== null) {
    var interleaved = lastInterleaved;

    do {
      var interleavedLane = interleaved.lane;
      currentlyRenderingFiber$1.lanes = mergeLanes(
        currentlyRenderingFiber$1.lanes,
        interleavedLane
      );
      markSkippedUpdateLanes(interleavedLane);
      interleaved = interleaved.next;
    } while (interleaved !== lastInterleaved);
  } else if (baseQueue === null) {
    // `queue.lanes` is used for entangling transitions. We can set it back to
    // zero once the queue is empty.
    queue.lanes = NoLanes;
  }

  var dispatch = queue.dispatch;
  return [hook.memoizedState, dispatch];
}

function rerenderReducer(reducer, initialArg, init) {
  var hook = updateWorkInProgressHook();
  var queue = hook.queue;

  if (!(queue !== null)) {
    throw Error(
      "Should have a queue. This is likely a bug in React. Please file an issue."
    );
  }

  queue.lastRenderedReducer = reducer; // This is a re-render. Apply the new render phase updates to the previous
  // work-in-progress hook.

  var dispatch = queue.dispatch;
  var lastRenderPhaseUpdate = queue.pending;
  var newState = hook.memoizedState;

  if (lastRenderPhaseUpdate !== null) {
    // The queue doesn't persist past this render pass.
    queue.pending = null;
    var firstRenderPhaseUpdate = lastRenderPhaseUpdate.next;
    var update = firstRenderPhaseUpdate;

    do {
      // Process this render phase update. We don't have to check the
      // priority because it will always be the same as the current
      // render's.
      var action = update.action;
      newState = reducer(newState, action);
      update = update.next;
    } while (update !== firstRenderPhaseUpdate); // Mark that the fiber performed work, but only if the new state is
    // different from the current state.

    if (!objectIs(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }

    hook.memoizedState = newState; // Don't persist the state accumulated from the render phase updates to
    // the base state unless the queue is empty.
    // TODO: Not sure if this is the desired semantics, but it's what we
    // do for gDSFP. I can't remember why.

    if (hook.baseQueue === null) {
      hook.baseState = newState;
    }

    queue.lastRenderedState = newState;
  }

  return [newState, dispatch];
}

function readFromUnsubscribedMutableSource(root, source, getSnapshot) {
  {
    warnAboutMultipleRenderersDEV(source);
  }

  var getVersion = source._getVersion;
  var version = getVersion(source._source); // Is it safe for this component to read from this source during the current render?

  var isSafeToReadFromSource = false; // Check the version first.
  // If this render has already been started with a specific version,
  // we can use it alone to determine if we can safely read from the source.

  var currentRenderVersion = getWorkInProgressVersion(source);

  if (currentRenderVersion !== null) {
    // It's safe to read if the store hasn't been mutated since the last time
    // we read something.
    isSafeToReadFromSource = currentRenderVersion === version;
  } else {
    // If there's no version, then this is the first time we've read from the
    // source during the current render pass, so we need to do a bit more work.
    // What we need to determine is if there are any hooks that already
    // subscribed to the source, and if so, whether there are any pending
    // mutations that haven't been synchronized yet.
    //
    // If there are no pending mutations, then `root.mutableReadLanes` will be
    // empty, and we know we can safely read.
    //
    // If there *are* pending mutations, we may still be able to safely read
    // if the currently rendering lanes are inclusive of the pending mutation
    // lanes, since that guarantees that the value we're about to read from
    // the source is consistent with the values that we read during the most
    // recent mutation.
    isSafeToReadFromSource = isSubsetOfLanes(
      renderLanes,
      root.mutableReadLanes
    );

    if (isSafeToReadFromSource) {
      // If it's safe to read from this source during the current render,
      // store the version in case other components read from it.
      // A changed version number will let those components know to throw and restart the render.
      setWorkInProgressVersion(source, version);
    }
  }

  if (isSafeToReadFromSource) {
    var snapshot = getSnapshot(source._source);

    {
      if (typeof snapshot === "function") {
        error(
          "Mutable source should not return a function as the snapshot value. " +
            "Functions may close over mutable values and cause tearing."
        );
      }
    }

    return snapshot;
  } else {
    // This handles the special case of a mutable source being shared between renderers.
    // In that case, if the source is mutated between the first and second renderer,
    // The second renderer don't know that it needs to reset the WIP version during unwind,
    // (because the hook only marks sources as dirty if it's written to their WIP version).
    // That would cause this tear check to throw again and eventually be visible to the user.
    // We can avoid this infinite loop by explicitly marking the source as dirty.
    //
    // This can lead to tearing in the first renderer when it resumes,
    // but there's nothing we can do about that (short of throwing here and refusing to continue the render).
    markSourceAsDirty(source); // Intentioally throw an error to force React to retry synchronously. During
    // the synchronous retry, it will block interleaved mutations, so we should
    // get a consistent read. Therefore, the following error should never be
    // visible to the user.
    //
    // If it were to become visible to the user, it suggests one of two things:
    // a bug in React, or (more likely), a mutation during the render phase that
    // caused the second re-render attempt to be different from the first.
    //
    // We know it's the second case if the logs are currently disabled. So in
    // dev, we can present a more accurate error message.

    {
      // eslint-disable-next-line react-internal/no-production-logging
      if (getIsStrictModeForDevtools()) {
        // If getIsStrictModeForDevtools is true, this is the dev-only double render
        // This is only reachable if there was a mutation during render. Show a helpful
        // error message.
        //
        // Something interesting to note: because we only double render in
        // development, this error will never happen during production. This is
        // actually true of all errors that occur during a double render,
        // because if the first render had thrown, we would have exited the
        // begin phase without double rendering. We should consider suppressing
        // any error from a double render (with a warning) to more closely match
        // the production behavior.
        var componentName = getComponentNameFromFiber(
          currentlyRenderingFiber$1
        );

        {
          throw Error(
            "A mutable source was mutated while the " +
              componentName +
              " component was rendering. This is not supported. Move any mutations into event handlers or effects."
          );
        }
      }
    } // We expect this error not to be thrown during the synchronous retry,
    // because we blocked interleaved mutations.

    {
      throw Error(
        "Cannot read from mutable source during the current render without tearing. This may be a bug in React. Please file an issue."
      );
    }
  }
}

function useMutableSource(hook, source, getSnapshot, subscribe) {
  var root = getWorkInProgressRoot();

  if (!(root !== null)) {
    throw Error(
      "Expected a work-in-progress root. This is a bug in React. Please file an issue."
    );
  }

  var getVersion = source._getVersion;
  var version = getVersion(source._source);
  var dispatcher = ReactCurrentDispatcher$1.current; // eslint-disable-next-line prefer-const

  var _dispatcher$useState = dispatcher.useState(function() {
      return readFromUnsubscribedMutableSource(root, source, getSnapshot);
    }),
    currentSnapshot = _dispatcher$useState[0],
    setSnapshot = _dispatcher$useState[1];

  var snapshot = currentSnapshot; // Grab a handle to the state hook as well.
  // We use it to clear the pending update queue if we have a new source.

  var stateHook = workInProgressHook;
  var memoizedState = hook.memoizedState;
  var refs = memoizedState.refs;
  var prevGetSnapshot = refs.getSnapshot;
  var prevSource = memoizedState.source;
  var prevSubscribe = memoizedState.subscribe;
  var fiber = currentlyRenderingFiber$1;
  hook.memoizedState = {
    refs: refs,
    source: source,
    subscribe: subscribe
  }; // Sync the values needed by our subscription handler after each commit.

  dispatcher.useEffect(
    function() {
      refs.getSnapshot = getSnapshot; // Normally the dispatch function for a state hook never changes,
      // but this hook recreates the queue in certain cases  to avoid updates from stale sources.
      // handleChange() below needs to reference the dispatch function without re-subscribing,
      // so we use a ref to ensure that it always has the latest version.

      refs.setSnapshot = setSnapshot; // Check for a possible change between when we last rendered now.

      var maybeNewVersion = getVersion(source._source);

      if (!objectIs(version, maybeNewVersion)) {
        var maybeNewSnapshot = getSnapshot(source._source);

        {
          if (typeof maybeNewSnapshot === "function") {
            error(
              "Mutable source should not return a function as the snapshot value. " +
                "Functions may close over mutable values and cause tearing."
            );
          }
        }

        if (!objectIs(snapshot, maybeNewSnapshot)) {
          setSnapshot(maybeNewSnapshot);
          var lane = requestUpdateLane(fiber);
          markRootMutableRead(root, lane);
        } // If the source mutated between render and now,
        // there may be state updates already scheduled from the old source.
        // Entangle the updates so that they render in the same batch.

        markRootEntangled(root, root.mutableReadLanes);
      }
    },
    [getSnapshot, source, subscribe]
  ); // If we got a new source or subscribe function, re-subscribe in a passive effect.

  dispatcher.useEffect(
    function() {
      var handleChange = function() {
        var latestGetSnapshot = refs.getSnapshot;
        var latestSetSnapshot = refs.setSnapshot;

        try {
          latestSetSnapshot(latestGetSnapshot(source._source)); // Record a pending mutable source update with the same expiration time.

          var lane = requestUpdateLane(fiber);
          markRootMutableRead(root, lane);
        } catch (error) {
          // A selector might throw after a source mutation.
          // e.g. it might try to read from a part of the store that no longer exists.
          // In this case we should still schedule an update with React.
          // Worst case the selector will throw again and then an error boundary will handle it.
          latestSetSnapshot(function() {
            throw error;
          });
        }
      };

      var unsubscribe = subscribe(source._source, handleChange);

      {
        if (typeof unsubscribe !== "function") {
          error(
            "Mutable source subscribe function must return an unsubscribe function."
          );
        }
      }

      return unsubscribe;
    },
    [source, subscribe]
  ); // If any of the inputs to useMutableSource change, reading is potentially unsafe.
  //
  // If either the source or the subscription have changed we can't can't trust the update queue.
  // Maybe the source changed in a way that the old subscription ignored but the new one depends on.
  //
  // If the getSnapshot function changed, we also shouldn't rely on the update queue.
  // It's possible that the underlying source was mutated between the when the last "change" event fired,
  // and when the current render (with the new getSnapshot function) is processed.
  //
  // In both cases, we need to throw away pending updates (since they are no longer relevant)
  // and treat reading from the source as we do in the mount case.

  if (
    !objectIs(prevGetSnapshot, getSnapshot) ||
    !objectIs(prevSource, source) ||
    !objectIs(prevSubscribe, subscribe)
  ) {
    // Create a new queue and setState method,
    // So if there are interleaved updates, they get pushed to the older queue.
    // When this becomes current, the previous queue and dispatch method will be discarded,
    // including any interleaving updates that occur.
    var newQueue = {
      pending: null,
      interleaved: null,
      lanes: NoLanes,
      dispatch: null,
      lastRenderedReducer: basicStateReducer,
      lastRenderedState: snapshot
    };
    newQueue.dispatch = setSnapshot = dispatchAction.bind(
      null,
      currentlyRenderingFiber$1,
      newQueue
    );
    stateHook.queue = newQueue;
    stateHook.baseQueue = null;
    snapshot = readFromUnsubscribedMutableSource(root, source, getSnapshot);
    stateHook.memoizedState = stateHook.baseState = snapshot;
  }

  return snapshot;
}

function mountMutableSource(source, getSnapshot, subscribe) {
  var hook = mountWorkInProgressHook();
  hook.memoizedState = {
    refs: {
      getSnapshot: getSnapshot,
      setSnapshot: null
    },
    source: source,
    subscribe: subscribe
  };
  return useMutableSource(hook, source, getSnapshot, subscribe);
}

function updateMutableSource(source, getSnapshot, subscribe) {
  var hook = updateWorkInProgressHook();
  return useMutableSource(hook, source, getSnapshot, subscribe);
}

function mountSyncExternalStore(subscribe, getSnapshot) {
  var hook = mountWorkInProgressHook(); // Read the current snapshot from the store on every render. This breaks the
  // normal rules of React, and only works because store updates are
  // always synchronous.

  var nextSnapshot = getSnapshot();

  {
    if (!didWarnUncachedGetSnapshot) {
      if (nextSnapshot !== getSnapshot()) {
        error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        );

        didWarnUncachedGetSnapshot = true;
      }
    }
  }

  hook.memoizedState = nextSnapshot;
  var inst = {
    value: nextSnapshot,
    getSnapshot: getSnapshot
  };
  hook.queue = inst;
  return useSyncExternalStore(hook, inst, subscribe, getSnapshot, nextSnapshot);
}

function updateSyncExternalStore(subscribe, getSnapshot) {
  var hook = updateWorkInProgressHook(); // Read the current snapshot from the store on every render. This breaks the
  // normal rules of React, and only works because store updates are
  // always synchronous.

  var nextSnapshot = getSnapshot();

  {
    if (!didWarnUncachedGetSnapshot) {
      if (nextSnapshot !== getSnapshot()) {
        error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        );

        didWarnUncachedGetSnapshot = true;
      }
    }
  }

  var prevSnapshot = hook.memoizedState;

  if (!objectIs(prevSnapshot, nextSnapshot)) {
    hook.memoizedState = nextSnapshot;
    markWorkInProgressReceivedUpdate();
  }

  var inst = hook.queue;
  return useSyncExternalStore(hook, inst, subscribe, getSnapshot, nextSnapshot);
}

function useSyncExternalStore(
  hook,
  inst,
  subscribe,
  getSnapshot,
  nextSnapshot
) {
  var fiber = currentlyRenderingFiber$1;
  var dispatcher = ReactCurrentDispatcher$1.current; // Track the latest getSnapshot function with a ref. This needs to be updated
  // in the layout phase so we can access it during the tearing check that
  // happens on subscribe.
  // TODO: Circumvent SSR warning

  dispatcher.useLayoutEffect(
    function() {
      inst.value = nextSnapshot;
      inst.getSnapshot = getSnapshot; // Whenever getSnapshot or subscribe changes, we need to check in the
      // commit phase if there was an interleaved mutation. In concurrent mode
      // this can happen all the time, but even in synchronous mode, an earlier
      // effect may have mutated the store.
      // TODO: Move the tearing checks to an earlier, pre-commit phase so that the
      // layout effects always observe a consistent tree.

      if (checkIfSnapshotChanged(inst)) {
        // Force a re-render.
        forceStoreRerender(fiber);
      }
    },
    [subscribe, nextSnapshot, getSnapshot]
  );
  dispatcher.useEffect(
    function() {
      var handleStoreChange = function() {
        // TODO: Because there is no cross-renderer API for batching updates, it's
        // up to the consumer of this library to wrap their subscription event
        // with unstable_batchedUpdates. Should we try to detect when this isn't
        // the case and print a warning in development?
        // The store changed. Check if the snapshot changed since the last time we
        // read from the store.
        if (checkIfSnapshotChanged(inst)) {
          // Force a re-render.
          forceStoreRerender(fiber);
        }
      }; // Check for changes right before subscribing. Subsequent changes will be
      // detected in the subscription handler.

      handleStoreChange(); // Subscribe to the store and return a clean-up function.

      return subscribe(handleStoreChange);
    },
    [subscribe]
  );
  return nextSnapshot;
}

function checkIfSnapshotChanged(inst) {
  var latestGetSnapshot = inst.getSnapshot;
  var prevValue = inst.value;

  try {
    var nextValue = latestGetSnapshot();
    return !objectIs(prevValue, nextValue);
  } catch (error) {
    return true;
  }
}

function forceStoreRerender(fiber) {
  scheduleUpdateOnFiber(fiber, SyncLane, NoTimestamp);
}

function mountState(initialState) {
  var hook = mountWorkInProgressHook();

  if (typeof initialState === "function") {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }

  hook.memoizedState = hook.baseState = initialState;
  var queue = {
    pending: null,
    interleaved: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState
  };
  hook.queue = queue;
  var dispatch = (queue.dispatch = dispatchAction.bind(
    null,
    currentlyRenderingFiber$1,
    queue
  ));
  return [hook.memoizedState, dispatch];
}

function updateState(initialState) {
  return updateReducer(basicStateReducer);
}

function rerenderState(initialState) {
  return rerenderReducer(basicStateReducer);
}

function pushEffect(tag, create, destroy, deps) {
  var effect = {
    tag: tag,
    create: create,
    destroy: destroy,
    deps: deps,
    // Circular
    next: null
  };
  var componentUpdateQueue = currentlyRenderingFiber$1.updateQueue;

  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber$1.updateQueue = componentUpdateQueue;
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    var lastEffect = componentUpdateQueue.lastEffect;

    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      var firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }

  return effect;
}

function mountRef(initialValue) {
  var hook = mountWorkInProgressHook();

  {
    var _ref2 = {
      current: initialValue
    };
    hook.memoizedState = _ref2;
    return _ref2;
  }
}

function updateRef(initialValue) {
  var hook = updateWorkInProgressHook();
  return hook.memoizedState;
}

function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
  var hook = mountWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  currentlyRenderingFiber$1.flags |= fiberFlags;
  hook.memoizedState = pushEffect(
    HasEffect | hookFlags,
    create,
    undefined,
    nextDeps
  );
}

function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
  var hook = updateWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var destroy = undefined;

  if (currentHook !== null) {
    var prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;

    if (nextDeps !== null) {
      var prevDeps = prevEffect.deps;

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        hook.memoizedState = pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }
    }
  }

  currentlyRenderingFiber$1.flags |= fiberFlags;
  hook.memoizedState = pushEffect(
    HasEffect | hookFlags,
    create,
    destroy,
    nextDeps
  );
}

function mountEffect(create, deps) {
  {
    // $FlowExpectedError - jest isn't a global, and isn't recognized outside of tests
    if ("undefined" !== typeof jest) {
      warnIfNotCurrentlyActingEffectsInDEV(currentlyRenderingFiber$1);
    }
  }

  if ((currentlyRenderingFiber$1.mode & StrictEffectsMode) !== NoMode) {
    return mountEffectImpl(
      MountPassiveDev | Passive | PassiveStatic,
      Passive$1,
      create,
      deps
    );
  } else {
    return mountEffectImpl(Passive | PassiveStatic, Passive$1, create, deps);
  }
}

function updateEffect(create, deps) {
  {
    // $FlowExpectedError - jest isn't a global, and isn't recognized outside of tests
    if ("undefined" !== typeof jest) {
      warnIfNotCurrentlyActingEffectsInDEV(currentlyRenderingFiber$1);
    }
  }

  return updateEffectImpl(Passive, Passive$1, create, deps);
}

function mountLayoutEffect(create, deps) {
  var fiberFlags = Update;

  if ((currentlyRenderingFiber$1.mode & StrictEffectsMode) !== NoMode) {
    fiberFlags |= MountLayoutDev;
  }

  return mountEffectImpl(fiberFlags, Layout, create, deps);
}

function updateLayoutEffect(create, deps) {
  return updateEffectImpl(Update, Layout, create, deps);
}

function imperativeHandleEffect(create, ref) {
  if (typeof ref === "function") {
    var refCallback = ref;

    var _inst = create();

    refCallback(_inst);
    return function() {
      refCallback(null);
    };
  } else if (ref !== null && ref !== undefined) {
    var refObject = ref;

    {
      if (!refObject.hasOwnProperty("current")) {
        error(
          "Expected useImperativeHandle() first argument to either be a " +
            "ref callback or React.createRef() object. Instead received: %s.",
          "an object with keys {" + Object.keys(refObject).join(", ") + "}"
        );
      }
    }

    var _inst2 = create();

    refObject.current = _inst2;
    return function() {
      refObject.current = null;
    };
  }
}

function mountImperativeHandle(ref, create, deps) {
  {
    if (typeof create !== "function") {
      error(
        "Expected useImperativeHandle() second argument to be a function " +
          "that creates a handle. Instead received: %s.",
        create !== null ? typeof create : "null"
      );
    }
  } // TODO: If deps are provided, should we skip comparing the ref itself?

  var effectDeps =
    deps !== null && deps !== undefined ? deps.concat([ref]) : null;
  var fiberFlags = Update;

  if ((currentlyRenderingFiber$1.mode & StrictEffectsMode) !== NoMode) {
    fiberFlags |= MountLayoutDev;
  }

  return mountEffectImpl(
    fiberFlags,
    Layout,
    imperativeHandleEffect.bind(null, create, ref),
    effectDeps
  );
}

function updateImperativeHandle(ref, create, deps) {
  {
    if (typeof create !== "function") {
      error(
        "Expected useImperativeHandle() second argument to be a function " +
          "that creates a handle. Instead received: %s.",
        create !== null ? typeof create : "null"
      );
    }
  } // TODO: If deps are provided, should we skip comparing the ref itself?

  var effectDeps =
    deps !== null && deps !== undefined ? deps.concat([ref]) : null;
  return updateEffectImpl(
    Update,
    Layout,
    imperativeHandleEffect.bind(null, create, ref),
    effectDeps
  );
}

function mountDebugValue(value, formatterFn) {
  // This hook is normally a no-op.
  // The react-debug-hooks package injects its own implementation
  // so that e.g. DevTools can display custom hook values.
}

var updateDebugValue = mountDebugValue;

function mountCallback(callback, deps) {
  var hook = mountWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

function updateCallback(callback, deps) {
  var hook = updateWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var prevState = hook.memoizedState;

  if (prevState !== null) {
    if (nextDeps !== null) {
      var prevDeps = prevState[1];

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }

  hook.memoizedState = [callback, nextDeps];
  return callback;
}

function mountMemo(nextCreate, deps) {
  var hook = mountWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function updateMemo(nextCreate, deps) {
  var hook = updateWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var prevState = hook.memoizedState;

  if (prevState !== null) {
    // Assume these are defined. If they're not, areHookInputsEqual will warn.
    if (nextDeps !== null) {
      var prevDeps = prevState[1];

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }

  var nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function mountDeferredValue(value) {
  var _mountState = mountState(value),
    prevValue = _mountState[0],
    setValue = _mountState[1];

  mountEffect(
    function() {
      var prevTransition = ReactCurrentBatchConfig$1.transition;
      ReactCurrentBatchConfig$1.transition = 1;

      try {
        setValue(value);
      } finally {
        ReactCurrentBatchConfig$1.transition = prevTransition;
      }
    },
    [value]
  );
  return prevValue;
}

function updateDeferredValue(value) {
  var _updateState = updateState(),
    prevValue = _updateState[0],
    setValue = _updateState[1];

  updateEffect(
    function() {
      var prevTransition = ReactCurrentBatchConfig$1.transition;
      ReactCurrentBatchConfig$1.transition = 1;

      try {
        setValue(value);
      } finally {
        ReactCurrentBatchConfig$1.transition = prevTransition;
      }
    },
    [value]
  );
  return prevValue;
}

function rerenderDeferredValue(value) {
  var _rerenderState = rerenderState(),
    prevValue = _rerenderState[0],
    setValue = _rerenderState[1];

  updateEffect(
    function() {
      var prevTransition = ReactCurrentBatchConfig$1.transition;
      ReactCurrentBatchConfig$1.transition = 1;

      try {
        setValue(value);
      } finally {
        ReactCurrentBatchConfig$1.transition = prevTransition;
      }
    },
    [value]
  );
  return prevValue;
}

function startTransition(setPending, callback) {
  var previousPriority = getCurrentUpdatePriority();
  setCurrentUpdatePriority(
    higherEventPriority(previousPriority, ContinuousEventPriority)
  );
  setPending(true);
  var prevTransition = ReactCurrentBatchConfig$1.transition;
  ReactCurrentBatchConfig$1.transition = 1;

  try {
    setPending(false);
    callback();
  } finally {
    setCurrentUpdatePriority(previousPriority);
    ReactCurrentBatchConfig$1.transition = prevTransition;
  }
}

function mountTransition() {
  var _mountState2 = mountState(false),
    isPending = _mountState2[0],
    setPending = _mountState2[1]; // The `start` method never changes.

  var start = startTransition.bind(null, setPending);
  var hook = mountWorkInProgressHook();
  hook.memoizedState = start;
  return [isPending, start];
}

function updateTransition() {
  var _updateState2 = updateState(),
    isPending = _updateState2[0];

  var hook = updateWorkInProgressHook();
  var start = hook.memoizedState;
  return [isPending, start];
}

function rerenderTransition() {
  var _rerenderState2 = rerenderState(),
    isPending = _rerenderState2[0];

  var hook = updateWorkInProgressHook();
  var start = hook.memoizedState;
  return [isPending, start];
}

var isUpdatingOpaqueValueInRenderPhase = false;
function getIsUpdatingOpaqueValueInRenderPhaseInDEV() {
  {
    return isUpdatingOpaqueValueInRenderPhase;
  }
}

function warnOnOpaqueIdentifierAccessInDEV(fiber) {
  {
    // TODO: Should warn in effects and callbacks, too
    var name = getComponentNameFromFiber(fiber) || "Unknown";

    if (getIsRendering() && !didWarnAboutUseOpaqueIdentifier[name]) {
      error(
        "The object passed back from useOpaqueIdentifier is meant to be " +
          "passed through to attributes only. Do not read the " +
          "value directly."
      );

      didWarnAboutUseOpaqueIdentifier[name] = true;
    }
  }
}

function mountOpaqueIdentifier() {
  var makeId = makeClientIdInDEV.bind(
    null,
    warnOnOpaqueIdentifierAccessInDEV.bind(null, currentlyRenderingFiber$1)
  );

  {
    var _id = makeId();

    mountState(_id);
    return _id;
  }
}

function updateOpaqueIdentifier() {
  var id = updateState()[0];
  return id;
}

function rerenderOpaqueIdentifier() {
  var id = rerenderState()[0];
  return id;
}

function dispatchAction(fiber, queue, action) {
  {
    if (typeof arguments[3] === "function") {
      error(
        "State updates from the useState() and useReducer() Hooks don't support the " +
          "second callback argument. To execute a side effect after " +
          "rendering, declare it in the component body with useEffect()."
      );
    }
  }

  var eventTime = requestEventTime();
  var lane = requestUpdateLane(fiber);
  var update = {
    lane: lane,
    action: action,
    eagerReducer: null,
    eagerState: null,
    next: null
  };
  var alternate = fiber.alternate;

  if (
    fiber === currentlyRenderingFiber$1 ||
    (alternate !== null && alternate === currentlyRenderingFiber$1)
  ) {
    // This is a render phase update. Stash it in a lazily-created map of
    // queue -> linked list of updates. After this render pass, we'll restart
    // and apply the stashed updates on top of the work-in-progress hook.
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
    var pending = queue.pending;

    if (pending === null) {
      // This is the first update. Create a circular list.
      update.next = update;
    } else {
      update.next = pending.next;
      pending.next = update;
    }

    queue.pending = update;
  } else {
    if (isInterleavedUpdate(fiber)) {
      var interleaved = queue.interleaved;

      if (interleaved === null) {
        // This is the first update. Create a circular list.
        update.next = update; // At the end of the current render, this queue's interleaved updates will
        // be transferred to the pending queue.

        pushInterleavedQueue(queue);
      } else {
        update.next = interleaved.next;
        interleaved.next = update;
      }

      queue.interleaved = update;
    } else {
      var _pending = queue.pending;

      if (_pending === null) {
        // This is the first update. Create a circular list.
        update.next = update;
      } else {
        update.next = _pending.next;
        _pending.next = update;
      }

      queue.pending = update;
    }

    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
      // The queue is currently empty, which means we can eagerly compute the
      // next state before entering the render phase. If the new state is the
      // same as the current state, we may be able to bail out entirely.
      var lastRenderedReducer = queue.lastRenderedReducer;

      if (lastRenderedReducer !== null) {
        var prevDispatcher;

        {
          prevDispatcher = ReactCurrentDispatcher$1.current;
          ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
        }

        try {
          var currentState = queue.lastRenderedState;
          var eagerState = lastRenderedReducer(currentState, action); // Stash the eagerly computed state, and the reducer used to compute
          // it, on the update object. If the reducer hasn't changed by the
          // time we enter the render phase, then the eager state can be used
          // without calling the reducer again.

          update.eagerReducer = lastRenderedReducer;
          update.eagerState = eagerState;

          if (objectIs(eagerState, currentState)) {
            // Fast path. We can bail out without scheduling React to re-render.
            // It's still possible that we'll need to rebase this update later,
            // if the component re-renders for a different reason and by that
            // time the reducer has changed.
            return;
          }
        } catch (error) {
          // Suppress the error. It will throw again in the render phase.
        } finally {
          {
            ReactCurrentDispatcher$1.current = prevDispatcher;
          }
        }
      }
    }

    {
      // $FlowExpectedError - jest isn't a global, and isn't recognized outside of tests
      if ("undefined" !== typeof jest) {
        warnIfNotCurrentlyActingUpdatesInDev(fiber);
      }
    }

    var root = scheduleUpdateOnFiber(fiber, lane, eventTime);

    if (isTransitionLane(lane) && root !== null) {
      var queueLanes = queue.lanes; // If any entangled lanes are no longer pending on the root, then they
      // must have finished. We can remove them from the shared queue, which
      // represents a superset of the actually pending lanes. In some cases we
      // may entangle more than we need to, but that's OK. In fact it's worse if
      // we *don't* entangle when we should.

      queueLanes = intersectLanes(queueLanes, root.pendingLanes); // Entangle the new transition lane with the other transition lanes.

      var newQueueLanes = mergeLanes(queueLanes, lane);
      queue.lanes = newQueueLanes; // Even if queue.lanes already include lane, we don't know for certain if
      // the lane finished since the last time we entangled it. So we need to
      // entangle it again, just to be sure.

      markRootEntangled(root, newQueueLanes);
    }
  }
}

var ContextOnlyDispatcher = {
  readContext: readContext,
  useCallback: throwInvalidHookError,
  useContext: throwInvalidHookError,
  useEffect: throwInvalidHookError,
  useImperativeHandle: throwInvalidHookError,
  useLayoutEffect: throwInvalidHookError,
  useMemo: throwInvalidHookError,
  useReducer: throwInvalidHookError,
  useRef: throwInvalidHookError,
  useState: throwInvalidHookError,
  useDebugValue: throwInvalidHookError,
  useDeferredValue: throwInvalidHookError,
  useTransition: throwInvalidHookError,
  useMutableSource: throwInvalidHookError,
  useSyncExternalStore: throwInvalidHookError,
  useOpaqueIdentifier: throwInvalidHookError,
  unstable_isNewReconciler: enableNewReconciler
};

var HooksDispatcherOnMountInDEV = null;
var HooksDispatcherOnMountWithHookTypesInDEV = null;
var HooksDispatcherOnUpdateInDEV = null;
var HooksDispatcherOnRerenderInDEV = null;
var InvalidNestedHooksDispatcherOnMountInDEV = null;
var InvalidNestedHooksDispatcherOnUpdateInDEV = null;
var InvalidNestedHooksDispatcherOnRerenderInDEV = null;

{
  var warnInvalidContextAccess = function() {
    error(
      "Context can only be read while React is rendering. " +
        "In classes, you can read it in the render method or getDerivedStateFromProps. " +
        "In function components, you can read it directly in the function body, but not " +
        "inside Hooks like useReducer() or useMemo()."
    );
  };

  var warnInvalidHookAccess = function() {
    error(
      "Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. " +
        "You can only call Hooks at the top level of your React function. " +
        "For more information, see " +
        "https://reactjs.org/link/rules-of-hooks"
    );
  };

  HooksDispatcherOnMountInDEV = {
    readContext: function(context) {
      return readContext(context);
    },
    useCallback: function(callback, deps) {
      currentHookNameInDev = "useCallback";
      mountHookTypesDev();
      checkDepsAreArrayDev(deps);
      return mountCallback(callback, deps);
    },
    useContext: function(context) {
      currentHookNameInDev = "useContext";
      mountHookTypesDev();
      return readContext(context);
    },
    useEffect: function(create, deps) {
      currentHookNameInDev = "useEffect";
      mountHookTypesDev();
      checkDepsAreArrayDev(deps);
      return mountEffect(create, deps);
    },
    useImperativeHandle: function(ref, create, deps) {
      currentHookNameInDev = "useImperativeHandle";
      mountHookTypesDev();
      checkDepsAreArrayDev(deps);
      return mountImperativeHandle(ref, create, deps);
    },
    useLayoutEffect: function(create, deps) {
      currentHookNameInDev = "useLayoutEffect";
      mountHookTypesDev();
      checkDepsAreArrayDev(deps);
      return mountLayoutEffect(create, deps);
    },
    useMemo: function(create, deps) {
      currentHookNameInDev = "useMemo";
      mountHookTypesDev();
      checkDepsAreArrayDev(deps);
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountMemo(create, deps);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useReducer: function(reducer, initialArg, init) {
      currentHookNameInDev = "useReducer";
      mountHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountReducer(reducer, initialArg, init);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useRef: function(initialValue) {
      currentHookNameInDev = "useRef";
      mountHookTypesDev();
      return mountRef(initialValue);
    },
    useState: function(initialState) {
      currentHookNameInDev = "useState";
      mountHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountState(initialState);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useDebugValue: function(value, formatterFn) {
      currentHookNameInDev = "useDebugValue";
      mountHookTypesDev();
      return mountDebugValue();
    },
    useDeferredValue: function(value) {
      currentHookNameInDev = "useDeferredValue";
      mountHookTypesDev();
      return mountDeferredValue(value);
    },
    useTransition: function() {
      currentHookNameInDev = "useTransition";
      mountHookTypesDev();
      return mountTransition();
    },
    useMutableSource: function(source, getSnapshot, subscribe) {
      currentHookNameInDev = "useMutableSource";
      mountHookTypesDev();
      return mountMutableSource(source, getSnapshot, subscribe);
    },
    useSyncExternalStore: function(subscribe, getSnapshot) {
      currentHookNameInDev = "useSyncExternalStore";
      mountHookTypesDev();
      return mountSyncExternalStore(subscribe, getSnapshot);
    },
    useOpaqueIdentifier: function() {
      currentHookNameInDev = "useOpaqueIdentifier";
      mountHookTypesDev();
      return mountOpaqueIdentifier();
    },
    unstable_isNewReconciler: enableNewReconciler
  };

  HooksDispatcherOnMountWithHookTypesInDEV = {
    readContext: function(context) {
      return readContext(context);
    },
    useCallback: function(callback, deps) {
      currentHookNameInDev = "useCallback";
      updateHookTypesDev();
      return mountCallback(callback, deps);
    },
    useContext: function(context) {
      currentHookNameInDev = "useContext";
      updateHookTypesDev();
      return readContext(context);
    },
    useEffect: function(create, deps) {
      currentHookNameInDev = "useEffect";
      updateHookTypesDev();
      return mountEffect(create, deps);
    },
    useImperativeHandle: function(ref, create, deps) {
      currentHookNameInDev = "useImperativeHandle";
      updateHookTypesDev();
      return mountImperativeHandle(ref, create, deps);
    },
    useLayoutEffect: function(create, deps) {
      currentHookNameInDev = "useLayoutEffect";
      updateHookTypesDev();
      return mountLayoutEffect(create, deps);
    },
    useMemo: function(create, deps) {
      currentHookNameInDev = "useMemo";
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountMemo(create, deps);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useReducer: function(reducer, initialArg, init) {
      currentHookNameInDev = "useReducer";
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountReducer(reducer, initialArg, init);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useRef: function(initialValue) {
      currentHookNameInDev = "useRef";
      updateHookTypesDev();
      return mountRef(initialValue);
    },
    useState: function(initialState) {
      currentHookNameInDev = "useState";
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountState(initialState);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useDebugValue: function(value, formatterFn) {
      currentHookNameInDev = "useDebugValue";
      updateHookTypesDev();
      return mountDebugValue();
    },
    useDeferredValue: function(value) {
      currentHookNameInDev = "useDeferredValue";
      updateHookTypesDev();
      return mountDeferredValue(value);
    },
    useTransition: function() {
      currentHookNameInDev = "useTransition";
      updateHookTypesDev();
      return mountTransition();
    },
    useMutableSource: function(source, getSnapshot, subscribe) {
      currentHookNameInDev = "useMutableSource";
      updateHookTypesDev();
      return mountMutableSource(source, getSnapshot, subscribe);
    },
    useSyncExternalStore: function(subscribe, getSnapshot) {
      currentHookNameInDev = "useSyncExternalStore";
      updateHookTypesDev();
      return mountSyncExternalStore(subscribe, getSnapshot);
    },
    useOpaqueIdentifier: function() {
      currentHookNameInDev = "useOpaqueIdentifier";
      updateHookTypesDev();
      return mountOpaqueIdentifier();
    },
    unstable_isNewReconciler: enableNewReconciler
  };

  HooksDispatcherOnUpdateInDEV = {
    readContext: function(context) {
      return readContext(context);
    },
    useCallback: function(callback, deps) {
      currentHookNameInDev = "useCallback";
      updateHookTypesDev();
      return updateCallback(callback, deps);
    },
    useContext: function(context) {
      currentHookNameInDev = "useContext";
      updateHookTypesDev();
      return readContext(context);
    },
    useEffect: function(create, deps) {
      currentHookNameInDev = "useEffect";
      updateHookTypesDev();
      return updateEffect(create, deps);
    },
    useImperativeHandle: function(ref, create, deps) {
      currentHookNameInDev = "useImperativeHandle";
      updateHookTypesDev();
      return updateImperativeHandle(ref, create, deps);
    },
    useLayoutEffect: function(create, deps) {
      currentHookNameInDev = "useLayoutEffect";
      updateHookTypesDev();
      return updateLayoutEffect(create, deps);
    },
    useMemo: function(create, deps) {
      currentHookNameInDev = "useMemo";
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return updateMemo(create, deps);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useReducer: function(reducer, initialArg, init) {
      currentHookNameInDev = "useReducer";
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return updateReducer(reducer, initialArg, init);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useRef: function(initialValue) {
      currentHookNameInDev = "useRef";
      updateHookTypesDev();
      return updateRef();
    },
    useState: function(initialState) {
      currentHookNameInDev = "useState";
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return updateState(initialState);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useDebugValue: function(value, formatterFn) {
      currentHookNameInDev = "useDebugValue";
      updateHookTypesDev();
      return updateDebugValue();
    },
    useDeferredValue: function(value) {
      currentHookNameInDev = "useDeferredValue";
      updateHookTypesDev();
      return updateDeferredValue(value);
    },
    useTransition: function() {
      currentHookNameInDev = "useTransition";
      updateHookTypesDev();
      return updateTransition();
    },
    useMutableSource: function(source, getSnapshot, subscribe) {
      currentHookNameInDev = "useMutableSource";
      updateHookTypesDev();
      return updateMutableSource(source, getSnapshot, subscribe);
    },
    useSyncExternalStore: function(subscribe, getSnapshot) {
      currentHookNameInDev = "useSyncExternalStore";
      updateHookTypesDev();
      return updateSyncExternalStore(subscribe, getSnapshot);
    },
    useOpaqueIdentifier: function() {
      currentHookNameInDev = "useOpaqueIdentifier";
      updateHookTypesDev();
      return updateOpaqueIdentifier();
    },
    unstable_isNewReconciler: enableNewReconciler
  };

  HooksDispatcherOnRerenderInDEV = {
    readContext: function(context) {
      return readContext(context);
    },
    useCallback: function(callback, deps) {
      currentHookNameInDev = "useCallback";
      updateHookTypesDev();
      return updateCallback(callback, deps);
    },
    useContext: function(context) {
      currentHookNameInDev = "useContext";
      updateHookTypesDev();
      return readContext(context);
    },
    useEffect: function(create, deps) {
      currentHookNameInDev = "useEffect";
      updateHookTypesDev();
      return updateEffect(create, deps);
    },
    useImperativeHandle: function(ref, create, deps) {
      currentHookNameInDev = "useImperativeHandle";
      updateHookTypesDev();
      return updateImperativeHandle(ref, create, deps);
    },
    useLayoutEffect: function(create, deps) {
      currentHookNameInDev = "useLayoutEffect";
      updateHookTypesDev();
      return updateLayoutEffect(create, deps);
    },
    useMemo: function(create, deps) {
      currentHookNameInDev = "useMemo";
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnRerenderInDEV;

      try {
        return updateMemo(create, deps);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useReducer: function(reducer, initialArg, init) {
      currentHookNameInDev = "useReducer";
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnRerenderInDEV;

      try {
        return rerenderReducer(reducer, initialArg, init);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useRef: function(initialValue) {
      currentHookNameInDev = "useRef";
      updateHookTypesDev();
      return updateRef();
    },
    useState: function(initialState) {
      currentHookNameInDev = "useState";
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnRerenderInDEV;

      try {
        return rerenderState(initialState);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useDebugValue: function(value, formatterFn) {
      currentHookNameInDev = "useDebugValue";
      updateHookTypesDev();
      return updateDebugValue();
    },
    useDeferredValue: function(value) {
      currentHookNameInDev = "useDeferredValue";
      updateHookTypesDev();
      return rerenderDeferredValue(value);
    },
    useTransition: function() {
      currentHookNameInDev = "useTransition";
      updateHookTypesDev();
      return rerenderTransition();
    },
    useMutableSource: function(source, getSnapshot, subscribe) {
      currentHookNameInDev = "useMutableSource";
      updateHookTypesDev();
      return updateMutableSource(source, getSnapshot, subscribe);
    },
    useSyncExternalStore: function(subscribe, getSnapshot) {
      currentHookNameInDev = "useSyncExternalStore";
      updateHookTypesDev();
      return updateSyncExternalStore(subscribe, getSnapshot);
    },
    useOpaqueIdentifier: function() {
      currentHookNameInDev = "useOpaqueIdentifier";
      updateHookTypesDev();
      return rerenderOpaqueIdentifier();
    },
    unstable_isNewReconciler: enableNewReconciler
  };

  InvalidNestedHooksDispatcherOnMountInDEV = {
    readContext: function(context) {
      warnInvalidContextAccess();
      return readContext(context);
    },
    useCallback: function(callback, deps) {
      currentHookNameInDev = "useCallback";
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountCallback(callback, deps);
    },
    useContext: function(context) {
      currentHookNameInDev = "useContext";
      warnInvalidHookAccess();
      mountHookTypesDev();
      return readContext(context);
    },
    useEffect: function(create, deps) {
      currentHookNameInDev = "useEffect";
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountEffect(create, deps);
    },
    useImperativeHandle: function(ref, create, deps) {
      currentHookNameInDev = "useImperativeHandle";
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountImperativeHandle(ref, create, deps);
    },
    useLayoutEffect: function(create, deps) {
      currentHookNameInDev = "useLayoutEffect";
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountLayoutEffect(create, deps);
    },
    useMemo: function(create, deps) {
      currentHookNameInDev = "useMemo";
      warnInvalidHookAccess();
      mountHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountMemo(create, deps);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useReducer: function(reducer, initialArg, init) {
      currentHookNameInDev = "useReducer";
      warnInvalidHookAccess();
      mountHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountReducer(reducer, initialArg, init);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useRef: function(initialValue) {
      currentHookNameInDev = "useRef";
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountRef(initialValue);
    },
    useState: function(initialState) {
      currentHookNameInDev = "useState";
      warnInvalidHookAccess();
      mountHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountState(initialState);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useDebugValue: function(value, formatterFn) {
      currentHookNameInDev = "useDebugValue";
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountDebugValue();
    },
    useDeferredValue: function(value) {
      currentHookNameInDev = "useDeferredValue";
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountDeferredValue(value);
    },
    useTransition: function() {
      currentHookNameInDev = "useTransition";
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountTransition();
    },
    useMutableSource: function(source, getSnapshot, subscribe) {
      currentHookNameInDev = "useMutableSource";
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountMutableSource(source, getSnapshot, subscribe);
    },
    useSyncExternalStore: function(subscribe, getSnapshot) {
      currentHookNameInDev = "useSyncExternalStore";
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountSyncExternalStore(subscribe, getSnapshot);
    },
    useOpaqueIdentifier: function() {
      currentHookNameInDev = "useOpaqueIdentifier";
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountOpaqueIdentifier();
    },
    unstable_isNewReconciler: enableNewReconciler
  };

  InvalidNestedHooksDispatcherOnUpdateInDEV = {
    readContext: function(context) {
      warnInvalidContextAccess();
      return readContext(context);
    },
    useCallback: function(callback, deps) {
      currentHookNameInDev = "useCallback";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateCallback(callback, deps);
    },
    useContext: function(context) {
      currentHookNameInDev = "useContext";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return readContext(context);
    },
    useEffect: function(create, deps) {
      currentHookNameInDev = "useEffect";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateEffect(create, deps);
    },
    useImperativeHandle: function(ref, create, deps) {
      currentHookNameInDev = "useImperativeHandle";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateImperativeHandle(ref, create, deps);
    },
    useLayoutEffect: function(create, deps) {
      currentHookNameInDev = "useLayoutEffect";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateLayoutEffect(create, deps);
    },
    useMemo: function(create, deps) {
      currentHookNameInDev = "useMemo";
      warnInvalidHookAccess();
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return updateMemo(create, deps);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useReducer: function(reducer, initialArg, init) {
      currentHookNameInDev = "useReducer";
      warnInvalidHookAccess();
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return updateReducer(reducer, initialArg, init);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useRef: function(initialValue) {
      currentHookNameInDev = "useRef";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateRef();
    },
    useState: function(initialState) {
      currentHookNameInDev = "useState";
      warnInvalidHookAccess();
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return updateState(initialState);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useDebugValue: function(value, formatterFn) {
      currentHookNameInDev = "useDebugValue";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateDebugValue();
    },
    useDeferredValue: function(value) {
      currentHookNameInDev = "useDeferredValue";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateDeferredValue(value);
    },
    useTransition: function() {
      currentHookNameInDev = "useTransition";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateTransition();
    },
    useMutableSource: function(source, getSnapshot, subscribe) {
      currentHookNameInDev = "useMutableSource";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateMutableSource(source, getSnapshot, subscribe);
    },
    useSyncExternalStore: function(subscribe, getSnapshot) {
      currentHookNameInDev = "useSyncExternalStore";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateSyncExternalStore(subscribe, getSnapshot);
    },
    useOpaqueIdentifier: function() {
      currentHookNameInDev = "useOpaqueIdentifier";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateOpaqueIdentifier();
    },
    unstable_isNewReconciler: enableNewReconciler
  };

  InvalidNestedHooksDispatcherOnRerenderInDEV = {
    readContext: function(context) {
      warnInvalidContextAccess();
      return readContext(context);
    },
    useCallback: function(callback, deps) {
      currentHookNameInDev = "useCallback";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateCallback(callback, deps);
    },
    useContext: function(context) {
      currentHookNameInDev = "useContext";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return readContext(context);
    },
    useEffect: function(create, deps) {
      currentHookNameInDev = "useEffect";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateEffect(create, deps);
    },
    useImperativeHandle: function(ref, create, deps) {
      currentHookNameInDev = "useImperativeHandle";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateImperativeHandle(ref, create, deps);
    },
    useLayoutEffect: function(create, deps) {
      currentHookNameInDev = "useLayoutEffect";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateLayoutEffect(create, deps);
    },
    useMemo: function(create, deps) {
      currentHookNameInDev = "useMemo";
      warnInvalidHookAccess();
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return updateMemo(create, deps);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useReducer: function(reducer, initialArg, init) {
      currentHookNameInDev = "useReducer";
      warnInvalidHookAccess();
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return rerenderReducer(reducer, initialArg, init);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useRef: function(initialValue) {
      currentHookNameInDev = "useRef";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateRef();
    },
    useState: function(initialState) {
      currentHookNameInDev = "useState";
      warnInvalidHookAccess();
      updateHookTypesDev();
      var prevDispatcher = ReactCurrentDispatcher$1.current;
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return rerenderState(initialState);
      } finally {
        ReactCurrentDispatcher$1.current = prevDispatcher;
      }
    },
    useDebugValue: function(value, formatterFn) {
      currentHookNameInDev = "useDebugValue";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateDebugValue();
    },
    useDeferredValue: function(value) {
      currentHookNameInDev = "useDeferredValue";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return rerenderDeferredValue(value);
    },
    useTransition: function() {
      currentHookNameInDev = "useTransition";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return rerenderTransition();
    },
    useMutableSource: function(source, getSnapshot, subscribe) {
      currentHookNameInDev = "useMutableSource";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateMutableSource(source, getSnapshot, subscribe);
    },
    useSyncExternalStore: function(subscribe, getSnapshot) {
      currentHookNameInDev = "useSyncExternalStore";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateSyncExternalStore(subscribe, getSnapshot);
    },
    useOpaqueIdentifier: function() {
      currentHookNameInDev = "useOpaqueIdentifier";
      warnInvalidHookAccess();
      updateHookTypesDev();
      return rerenderOpaqueIdentifier();
    },
    unstable_isNewReconciler: enableNewReconciler
  };
}

var now$1 = Scheduler.unstable_now;
var commitTime = 0;
var layoutEffectStartTime = -1;
var profilerStartTime = -1;
var passiveEffectStartTime = -1;
/**
 * Tracks whether the current update was a nested/cascading update (scheduled from a layout effect).
 *
 * The overall sequence is:
 *   1. render
 *   2. commit (and call `onRender`, `onCommit`)
 *   3. check for nested updates
 *   4. flush passive effects (and call `onPostCommit`)
 *
 * Nested updates are identified in step 3 above,
 * but step 4 still applies to the work that was just committed.
 * We use two flags to track nested updates then:
 * one tracks whether the upcoming update is a nested update,
 * and the other tracks whether the current update was a nested update.
 * The first value gets synced to the second at the start of the render phase.
 */

var currentUpdateIsNested = false;
var nestedUpdateScheduled = false;

function isCurrentUpdateNested() {
  return currentUpdateIsNested;
}

function markNestedUpdateScheduled() {
  {
    nestedUpdateScheduled = true;
  }
}

function resetNestedUpdateFlag() {
  {
    currentUpdateIsNested = false;
    nestedUpdateScheduled = false;
  }
}

function syncNestedUpdateFlag() {
  {
    currentUpdateIsNested = nestedUpdateScheduled;
    nestedUpdateScheduled = false;
  }
}

function getCommitTime() {
  return commitTime;
}

function recordCommitTime() {
  commitTime = now$1();
}

function startProfilerTimer(fiber) {
  profilerStartTime = now$1();

  if (fiber.actualStartTime < 0) {
    fiber.actualStartTime = now$1();
  }
}

function stopProfilerTimerIfRunning(fiber) {
  profilerStartTime = -1;
}

function stopProfilerTimerIfRunningAndRecordDelta(fiber, overrideBaseTime) {
  if (profilerStartTime >= 0) {
    var elapsedTime = now$1() - profilerStartTime;
    fiber.actualDuration += elapsedTime;

    if (overrideBaseTime) {
      fiber.selfBaseDuration = elapsedTime;
    }

    profilerStartTime = -1;
  }
}

function recordLayoutEffectDuration(fiber) {
  if (layoutEffectStartTime >= 0) {
    var elapsedTime = now$1() - layoutEffectStartTime;
    layoutEffectStartTime = -1; // Store duration on the next nearest Profiler ancestor
    // Or the root (for the DevTools Profiler to read)

    var parentFiber = fiber.return;

    while (parentFiber !== null) {
      switch (parentFiber.tag) {
        case HostRoot:
          var root = parentFiber.stateNode;
          root.effectDuration += elapsedTime;
          return;

        case Profiler:
          var parentStateNode = parentFiber.stateNode;
          parentStateNode.effectDuration += elapsedTime;
          return;
      }

      parentFiber = parentFiber.return;
    }
  }
}

function recordPassiveEffectDuration(fiber) {
  if (passiveEffectStartTime >= 0) {
    var elapsedTime = now$1() - passiveEffectStartTime;
    passiveEffectStartTime = -1; // Store duration on the next nearest Profiler ancestor
    // Or the root (for the DevTools Profiler to read)

    var parentFiber = fiber.return;

    while (parentFiber !== null) {
      switch (parentFiber.tag) {
        case HostRoot:
          var root = parentFiber.stateNode;

          if (root !== null) {
            root.passiveEffectDuration += elapsedTime;
          }

          return;

        case Profiler:
          var parentStateNode = parentFiber.stateNode;

          if (parentStateNode !== null) {
            // Detached fibers have their state node cleared out.
            // In this case, the return pointer is also cleared out,
            // so we won't be able to report the time spent in this Profiler's subtree.
            parentStateNode.passiveEffectDuration += elapsedTime;
          }

          return;
      }

      parentFiber = parentFiber.return;
    }
  }
}

function startLayoutEffectTimer() {
  layoutEffectStartTime = now$1();
}

function startPassiveEffectTimer() {
  passiveEffectStartTime = now$1();
}

function transferActualDuration(fiber) {
  // Transfer time spent rendering these children so we don't lose it
  // after we rerender. This is used as a helper in special cases
  // where we should count the work of multiple passes.
  var child = fiber.child;

  while (child) {
    fiber.actualDuration += child.actualDuration;
    child = child.sibling;
  }
}

function createCapturedValue(value, source) {
  // If the value is an error, call this function immediately after it is thrown
  // so the stack is accurate.
  return {
    value: value,
    source: source,
    stack: getStackByFiberInDevAndProd(source)
  };
}

if (
  !(
    typeof ReactNativePrivateInterface.ReactFiberErrorDialog.showErrorDialog ===
    "function"
  )
) {
  throw Error(
    "Expected ReactFiberErrorDialog.showErrorDialog to be a function."
  );
}

function showErrorDialog(boundary, errorInfo) {
  var capturedError = {
    componentStack: errorInfo.stack !== null ? errorInfo.stack : "",
    error: errorInfo.value,
    errorBoundary:
      boundary !== null && boundary.tag === ClassComponent
        ? boundary.stateNode
        : null
  };
  return ReactNativePrivateInterface.ReactFiberErrorDialog.showErrorDialog(
    capturedError
  );
}

function logCapturedError(boundary, errorInfo) {
  try {
    var logError = showErrorDialog(boundary, errorInfo); // Allow injected showErrorDialog() to prevent default console.error logging.
    // This enables renderers like ReactNative to better manage redbox behavior.

    if (logError === false) {
      return;
    }

    var error = errorInfo.value;

    if (true) {
      var source = errorInfo.source;
      var stack = errorInfo.stack;
      var componentStack = stack !== null ? stack : ""; // Browsers support silencing uncaught errors by calling
      // `preventDefault()` in window `error` handler.
      // We record this information as an expando on the error.

      if (error != null && error._suppressLogging) {
        if (boundary.tag === ClassComponent) {
          // The error is recoverable and was silenced.
          // Ignore it and don't print the stack addendum.
          // This is handy for testing error boundaries without noise.
          return;
        } // The error is fatal. Since the silencing might have
        // been accidental, we'll surface it anyway.
        // However, the browser would have silenced the original error
        // so we'll print it first, and then print the stack addendum.

        console["error"](error); // Don't transform to our wrapper
        // For a more detailed description of this block, see:
        // https://github.com/facebook/react/pull/13384
      }

      var componentName = source ? getComponentNameFromFiber(source) : null;
      var componentNameMessage = componentName
        ? "The above error occurred in the <" + componentName + "> component:"
        : "The above error occurred in one of your React components:";
      var errorBoundaryMessage;

      if (boundary.tag === HostRoot) {
        errorBoundaryMessage =
          "Consider adding an error boundary to your tree to customize error handling behavior.\n" +
          "Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.";
      } else {
        var errorBoundaryName =
          getComponentNameFromFiber(boundary) || "Anonymous";
        errorBoundaryMessage =
          "React will try to recreate this component tree from scratch " +
          ("using the error boundary you provided, " + errorBoundaryName + ".");
      }

      var combinedMessage =
        componentNameMessage +
        "\n" +
        componentStack +
        "\n\n" +
        ("" + errorBoundaryMessage); // In development, we provide our own message with just the component stack.
      // We don't include the original error message and JS stack because the browser
      // has already printed it. Even if the application swallows the error, it is still
      // displayed by the browser thanks to the DEV-only fake event trick in ReactErrorUtils.

      console["error"](combinedMessage); // Don't transform to our wrapper
    } else {
      // In production, we print the error directly.
      // This will include the message, the JS stack, and anything the browser wants to show.
      // We pass the error object instead of custom message so that the browser displays the error natively.
      console["error"](error); // Don't transform to our wrapper
    }
  } catch (e) {
    // This method must not throw, or React internal state will get messed up.
    // If console.error is overridden, or logCapturedError() shows a dialog that throws,
    // we want to report this error outside of the normal stack as a last resort.
    // https://github.com/facebook/react/issues/13188
    setTimeout(function() {
      throw e;
    });
  }
}

var PossiblyWeakMap$1 = typeof WeakMap === "function" ? WeakMap : Map;

function createRootErrorUpdate(fiber, errorInfo, lane) {
  var update = createUpdate(NoTimestamp, lane); // Unmount the root by rendering null.

  update.tag = CaptureUpdate; // Caution: React DevTools currently depends on this property
  // being called "element".

  update.payload = {
    element: null
  };
  var error = errorInfo.value;

  update.callback = function() {
    onUncaughtError(error);
    logCapturedError(fiber, errorInfo);
  };

  return update;
}

function createClassErrorUpdate(fiber, errorInfo, lane) {
  var update = createUpdate(NoTimestamp, lane);
  update.tag = CaptureUpdate;
  var getDerivedStateFromError = fiber.type.getDerivedStateFromError;

  if (typeof getDerivedStateFromError === "function") {
    var error$1 = errorInfo.value;

    update.payload = function() {
      return getDerivedStateFromError(error$1);
    };

    update.callback = function() {
      {
        markFailedErrorBoundaryForHotReloading(fiber);
      }

      logCapturedError(fiber, errorInfo);
    };
  }

  var inst = fiber.stateNode;

  if (inst !== null && typeof inst.componentDidCatch === "function") {
    update.callback = function callback() {
      {
        markFailedErrorBoundaryForHotReloading(fiber);
      }

      logCapturedError(fiber, errorInfo);

      if (typeof getDerivedStateFromError !== "function") {
        // To preserve the preexisting retry behavior of error boundaries,
        // we keep track of which ones already failed during this batch.
        // This gets reset before we yield back to the browser.
        // TODO: Warn in strict mode if getDerivedStateFromError is
        // not defined.
        markLegacyErrorBoundaryAsFailed(this);
      }

      var error$1 = errorInfo.value;
      var stack = errorInfo.stack;
      this.componentDidCatch(error$1, {
        componentStack: stack !== null ? stack : ""
      });

      {
        if (typeof getDerivedStateFromError !== "function") {
          // If componentDidCatch is the only error boundary method defined,
          // then it needs to call setState to recover from errors.
          // If no state update is scheduled then the boundary will swallow the error.
          if (!includesSomeLane(fiber.lanes, SyncLane)) {
            error(
              "%s: Error boundaries should implement getDerivedStateFromError(). " +
                "In that method, return a state update to display an error message or fallback UI.",
              getComponentNameFromFiber(fiber) || "Unknown"
            );
          }
        }
      }
    };
  }

  return update;
}

function attachPingListener(root, wakeable, lanes) {
  // Attach a listener to the promise to "ping" the root and retry. But only if
  // one does not already exist for the lanes we're currently rendering (which
  // acts like a "thread ID" here).
  var pingCache = root.pingCache;
  var threadIDs;

  if (pingCache === null) {
    pingCache = root.pingCache = new PossiblyWeakMap$1();
    threadIDs = new Set();
    pingCache.set(wakeable, threadIDs);
  } else {
    threadIDs = pingCache.get(wakeable);

    if (threadIDs === undefined) {
      threadIDs = new Set();
      pingCache.set(wakeable, threadIDs);
    }
  }

  if (!threadIDs.has(lanes)) {
    // Memoize using the thread ID to prevent redundant listeners.
    threadIDs.add(lanes);
    var ping = pingSuspendedRoot.bind(null, root, wakeable, lanes);

    {
      if (isDevToolsPresent) {
        // If we have pending work still, restore the original updaters
        restorePendingUpdaters(root, lanes);
      }
    }

    wakeable.then(ping, ping);
  }
}

function throwException(
  root,
  returnFiber,
  sourceFiber,
  value,
  rootRenderLanes
) {
  // The source fiber did not complete.
  sourceFiber.flags |= Incomplete;

  {
    if (isDevToolsPresent) {
      // If we have pending work still, restore the original updaters
      restorePendingUpdaters(root, rootRenderLanes);
    }
  }

  if (
    value !== null &&
    typeof value === "object" &&
    typeof value.then === "function"
  ) {
    var wakeable = value;
    // A legacy mode Suspense quirk, only relevant to hook components.

    var tag = sourceFiber.tag;

    if (
      (sourceFiber.mode & ConcurrentMode) === NoMode &&
      (tag === FunctionComponent ||
        tag === ForwardRef ||
        tag === SimpleMemoComponent)
    ) {
      var currentSource = sourceFiber.alternate;

      if (currentSource) {
        sourceFiber.updateQueue = currentSource.updateQueue;
        sourceFiber.memoizedState = currentSource.memoizedState;
        sourceFiber.lanes = currentSource.lanes;
      } else {
        sourceFiber.updateQueue = null;
        sourceFiber.memoizedState = null;
      }
    }

    var hasInvisibleParentBoundary = hasSuspenseContext(
      suspenseStackCursor.current,
      InvisibleParentSuspenseContext
    ); // Schedule the nearest Suspense to re-render the timed out view.

    var _workInProgress = returnFiber;

    do {
      if (
        _workInProgress.tag === SuspenseComponent &&
        shouldCaptureSuspense(_workInProgress, hasInvisibleParentBoundary)
      ) {
        // Found the nearest boundary.
        // Stash the promise on the boundary fiber. If the boundary times out, we'll
        // attach another listener to flip the boundary back to its normal state.
        var wakeables = _workInProgress.updateQueue;

        if (wakeables === null) {
          var updateQueue = new Set();
          updateQueue.add(wakeable);
          _workInProgress.updateQueue = updateQueue;
        } else {
          wakeables.add(wakeable);
        } // If the boundary is in legacy mode, we should *not*
        // suspend the commit. Pretend as if the suspended component rendered
        // null and keep rendering. In the commit phase, we'll schedule a
        // subsequent synchronous update to re-render the Suspense.
        //
        // Note: It doesn't matter whether the component that suspended was
        // inside a concurrent mode tree. If the Suspense is outside of it, we
        // should *not* suspend the commit.
        //
        // If the suspense boundary suspended itself suspended, we don't have to
        // do this trick because nothing was partially started. We can just
        // directly do a second pass over the fallback in this render and
        // pretend we meant to render that directly.

        if (
          (_workInProgress.mode & ConcurrentMode) === NoMode &&
          _workInProgress !== returnFiber
        ) {
          _workInProgress.flags |= DidCapture;
          sourceFiber.flags |= ForceUpdateForLegacySuspense; // We're going to commit this fiber even though it didn't complete.
          // But we shouldn't call any lifecycle methods or callbacks. Remove
          // all lifecycle effect tags.

          sourceFiber.flags &= ~(LifecycleEffectMask | Incomplete);

          if (sourceFiber.tag === ClassComponent) {
            var _currentSourceFiber = sourceFiber.alternate;

            if (_currentSourceFiber === null) {
              // This is a new mount. Change the tag so it's not mistaken for a
              // completed class component. For example, we should not call
              // componentWillUnmount if it is deleted.
              sourceFiber.tag = IncompleteClassComponent;
            } else {
              // When we try rendering again, we should not reuse the current fiber,
              // since it's known to be in an inconsistent state. Use a force update to
              // prevent a bail out.
              var update = createUpdate(NoTimestamp, SyncLane);
              update.tag = ForceUpdate;
              enqueueUpdate(sourceFiber, update);
            }
          } // The source fiber did not complete. Mark it with Sync priority to
          // indicate that it still has pending work.

          sourceFiber.lanes = mergeLanes(sourceFiber.lanes, SyncLane); // Exit without suspending.

          return;
        } // Confirmed that the boundary is in a concurrent mode tree. Continue
        // with the normal suspend path.
        //
        // After this we'll use a set of heuristics to determine whether this
        // render pass will run to completion or restart or "suspend" the commit.
        // The actual logic for this is spread out in different places.
        //
        // This first principle is that if we're going to suspend when we complete
        // a root, then we should also restart if we get an update or ping that
        // might unsuspend it, and vice versa. The only reason to suspend is
        // because you think you might want to restart before committing. However,
        // it doesn't make sense to restart only while in the period we're suspended.
        //
        // Restarting too aggressively is also not good because it starves out any
        // intermediate loading state. So we use heuristics to determine when.
        // Suspense Heuristics
        //
        // If nothing threw a Promise or all the same fallbacks are already showing,
        // then don't suspend/restart.
        //
        // If this is an initial render of a new tree of Suspense boundaries and
        // those trigger a fallback, then don't suspend/restart. We want to ensure
        // that we can show the initial loading state as quickly as possible.
        //
        // If we hit a "Delayed" case, such as when we'd switch from content back into
        // a fallback, then we should always suspend/restart. Transitions apply
        // to this case. If none is defined, JND is used instead.
        //
        // If we're already showing a fallback and it gets "retried", allowing us to show
        // another level, but there's still an inner boundary that would show a fallback,
        // then we suspend/restart for 500ms since the last time we showed a fallback
        // anywhere in the tree. This effectively throttles progressive loading into a
        // consistent train of commits. This also gives us an opportunity to restart to
        // get to the completed state slightly earlier.
        //
        // If there's ambiguity due to batching it's resolved in preference of:
        // 1) "delayed", 2) "initial render", 3) "retry".
        //
        // We want to ensure that a "busy" state doesn't get force committed. We want to
        // ensure that new initial loading states can commit as soon as possible.

        attachPingListener(root, wakeable, rootRenderLanes);
        _workInProgress.flags |= ShouldCapture; // TODO: I think we can remove this, since we now use `DidCapture` in
        // the begin phase to prevent an early bailout.

        _workInProgress.lanes = rootRenderLanes;
        return;
      } // This boundary already captured during this render. Continue to the next
      // boundary.

      _workInProgress = _workInProgress.return;
    } while (_workInProgress !== null); // No boundary was found. Fallthrough to error mode.
    // TODO: Use invariant so the message is stripped in prod?

    value = new Error(
      (getComponentNameFromFiber(sourceFiber) || "A React component") +
        " suspended while rendering, but no fallback UI was specified.\n" +
        "\n" +
        "Add a <Suspense fallback=...> component higher in the tree to " +
        "provide a loading indicator or placeholder to display."
    );
  } // We didn't find a boundary that could handle this type of exception. Start
  // over and traverse parent path again, this time treating the exception
  // as an error.

  renderDidError();
  value = createCapturedValue(value, sourceFiber);
  var workInProgress = returnFiber;

  do {
    switch (workInProgress.tag) {
      case HostRoot: {
        var _errorInfo = value;
        workInProgress.flags |= ShouldCapture;
        var lane = pickArbitraryLane(rootRenderLanes);
        workInProgress.lanes = mergeLanes(workInProgress.lanes, lane);

        var _update = createRootErrorUpdate(workInProgress, _errorInfo, lane);

        enqueueCapturedUpdate(workInProgress, _update);
        return;
      }

      case ClassComponent:
        // Capture and retry
        var errorInfo = value;
        var ctor = workInProgress.type;
        var instance = workInProgress.stateNode;

        if (
          (workInProgress.flags & DidCapture) === NoFlags &&
          (typeof ctor.getDerivedStateFromError === "function" ||
            (instance !== null &&
              typeof instance.componentDidCatch === "function" &&
              !isAlreadyFailedLegacyErrorBoundary(instance)))
        ) {
          workInProgress.flags |= ShouldCapture;

          var _lane = pickArbitraryLane(rootRenderLanes);

          workInProgress.lanes = mergeLanes(workInProgress.lanes, _lane); // Schedule the error boundary to re-render using updated state

          var _update2 = createClassErrorUpdate(
            workInProgress,
            errorInfo,
            _lane
          );

          enqueueCapturedUpdate(workInProgress, _update2);
          return;
        }

        break;
    }

    workInProgress = workInProgress.return;
  } while (workInProgress !== null);
}

function markUpdate(workInProgress) {
  // Tag the fiber with an update effect. This turns a Placement into
  // a PlacementAndUpdate.
  workInProgress.flags |= Update;
}

function markRef(workInProgress) {
  workInProgress.flags |= Ref;
}

var appendAllChildren;
var updateHostContainer;
var updateHostComponent;
var updateHostText;

{
  // Mutation mode
  appendAllChildren = function(
    parent,
    workInProgress,
    needsVisibilityToggle,
    isHidden
  ) {
    // We only have the top Fiber that was created but we need recurse down its
    // children to find all the terminal nodes.
    var node = workInProgress.child;

    while (node !== null) {
      if (node.tag === HostComponent || node.tag === HostText) {
        appendInitialChild(parent, node.stateNode);
      } else if (node.tag === HostPortal);
      else if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }

      if (node === workInProgress) {
        return;
      }

      while (node.sibling === null) {
        if (node.return === null || node.return === workInProgress) {
          return;
        }

        node = node.return;
      }

      node.sibling.return = node.return;
      node = node.sibling;
    }
  };

  updateHostContainer = function(current, workInProgress) {
    // Noop
  };

  updateHostComponent = function(
    current,
    workInProgress,
    type,
    newProps,
    rootContainerInstance
  ) {
    // If we have an alternate, that means this is an update and we need to
    // schedule a side-effect to do the updates.
    var oldProps = current.memoizedProps;

    if (oldProps === newProps) {
      // In mutation mode, this is sufficient for a bailout because
      // we won't touch this node even if children changed.
      return;
    } // If we get updated because one of our children updated, we don't
    // have newProps so we'll have to reuse them.
    // TODO: Split the update API as separate for the props vs. children.
    // Even better would be if children weren't special cased at all tho.

    var instance = workInProgress.stateNode;
    var currentHostContext = getHostContext(); // TODO: Experiencing an error where oldProps is null. Suggests a host
    // component is hitting the resume path. Figure out why. Possibly
    // related to `hidden`.

    var updatePayload = prepareUpdate(); // TODO: Type this specific to this type of component.

    workInProgress.updateQueue = updatePayload; // If the update payload indicates that there is a change or if there
    // is a new ref we mark this as an update. All the work is done in commitWork.

    if (updatePayload) {
      markUpdate(workInProgress);
    }
  };

  updateHostText = function(current, workInProgress, oldText, newText) {
    // If the text differs, mark it as an update. All the work in done in commitWork.
    if (oldText !== newText) {
      markUpdate(workInProgress);
    }
  };
}

function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
  switch (renderState.tailMode) {
    case "hidden": {
      // Any insertions at the end of the tail list after this point
      // should be invisible. If there are already mounted boundaries
      // anything before them are not considered for collapsing.
      // Therefore we need to go through the whole tail to find if
      // there are any.
      var tailNode = renderState.tail;
      var lastTailNode = null;

      while (tailNode !== null) {
        if (tailNode.alternate !== null) {
          lastTailNode = tailNode;
        }

        tailNode = tailNode.sibling;
      } // Next we're simply going to delete all insertions after the
      // last rendered item.

      if (lastTailNode === null) {
        // All remaining items in the tail are insertions.
        renderState.tail = null;
      } else {
        // Detach the insertion after the last node that was already
        // inserted.
        lastTailNode.sibling = null;
      }

      break;
    }

    case "collapsed": {
      // Any insertions at the end of the tail list after this point
      // should be invisible. If there are already mounted boundaries
      // anything before them are not considered for collapsing.
      // Therefore we need to go through the whole tail to find if
      // there are any.
      var _tailNode = renderState.tail;
      var _lastTailNode = null;

      while (_tailNode !== null) {
        if (_tailNode.alternate !== null) {
          _lastTailNode = _tailNode;
        }

        _tailNode = _tailNode.sibling;
      } // Next we're simply going to delete all insertions after the
      // last rendered item.

      if (_lastTailNode === null) {
        // All remaining items in the tail are insertions.
        if (!hasRenderedATailFallback && renderState.tail !== null) {
          // We suspended during the head. We want to show at least one
          // row at the tail. So we'll keep on and cut off the rest.
          renderState.tail.sibling = null;
        } else {
          renderState.tail = null;
        }
      } else {
        // Detach the insertion after the last node that was already
        // inserted.
        _lastTailNode.sibling = null;
      }

      break;
    }
  }
}

function bubbleProperties(completedWork) {
  var didBailout =
    completedWork.alternate !== null &&
    completedWork.alternate.child === completedWork.child;
  var newChildLanes = NoLanes;
  var subtreeFlags = NoFlags;

  if (!didBailout) {
    // Bubble up the earliest expiration time.
    if ((completedWork.mode & ProfileMode) !== NoMode) {
      // In profiling mode, resetChildExpirationTime is also used to reset
      // profiler durations.
      var actualDuration = completedWork.actualDuration;
      var treeBaseDuration = completedWork.selfBaseDuration;
      var child = completedWork.child;

      while (child !== null) {
        newChildLanes = mergeLanes(
          newChildLanes,
          mergeLanes(child.lanes, child.childLanes)
        );
        subtreeFlags |= child.subtreeFlags;
        subtreeFlags |= child.flags; // When a fiber is cloned, its actualDuration is reset to 0. This value will
        // only be updated if work is done on the fiber (i.e. it doesn't bailout).
        // When work is done, it should bubble to the parent's actualDuration. If
        // the fiber has not been cloned though, (meaning no work was done), then
        // this value will reflect the amount of time spent working on a previous
        // render. In that case it should not bubble. We determine whether it was
        // cloned by comparing the child pointer.

        actualDuration += child.actualDuration;
        treeBaseDuration += child.treeBaseDuration;
        child = child.sibling;
      }

      completedWork.actualDuration = actualDuration;
      completedWork.treeBaseDuration = treeBaseDuration;
    } else {
      var _child = completedWork.child;

      while (_child !== null) {
        newChildLanes = mergeLanes(
          newChildLanes,
          mergeLanes(_child.lanes, _child.childLanes)
        );
        subtreeFlags |= _child.subtreeFlags;
        subtreeFlags |= _child.flags; // Update the return pointer so the tree is consistent. This is a code
        // smell because it assumes the commit phase is never concurrent with
        // the render phase. Will address during refactor to alternate model.

        _child.return = completedWork;
        _child = _child.sibling;
      }
    }

    completedWork.subtreeFlags |= subtreeFlags;
  } else {
    // Bubble up the earliest expiration time.
    if ((completedWork.mode & ProfileMode) !== NoMode) {
      // In profiling mode, resetChildExpirationTime is also used to reset
      // profiler durations.
      var _treeBaseDuration = completedWork.selfBaseDuration;
      var _child2 = completedWork.child;

      while (_child2 !== null) {
        newChildLanes = mergeLanes(
          newChildLanes,
          mergeLanes(_child2.lanes, _child2.childLanes)
        ); // "Static" flags share the lifetime of the fiber/hook they belong to,
        // so we should bubble those up even during a bailout. All the other
        // flags have a lifetime only of a single render + commit, so we should
        // ignore them.

        subtreeFlags |= _child2.subtreeFlags & StaticMask;
        subtreeFlags |= _child2.flags & StaticMask;
        _treeBaseDuration += _child2.treeBaseDuration;
        _child2 = _child2.sibling;
      }

      completedWork.treeBaseDuration = _treeBaseDuration;
    } else {
      var _child3 = completedWork.child;

      while (_child3 !== null) {
        newChildLanes = mergeLanes(
          newChildLanes,
          mergeLanes(_child3.lanes, _child3.childLanes)
        ); // "Static" flags share the lifetime of the fiber/hook they belong to,
        // so we should bubble those up even during a bailout. All the other
        // flags have a lifetime only of a single render + commit, so we should
        // ignore them.

        subtreeFlags |= _child3.subtreeFlags & StaticMask;
        subtreeFlags |= _child3.flags & StaticMask; // Update the return pointer so the tree is consistent. This is a code
        // smell because it assumes the commit phase is never concurrent with
        // the render phase. Will address during refactor to alternate model.

        _child3.return = completedWork;
        _child3 = _child3.sibling;
      }
    }

    completedWork.subtreeFlags |= subtreeFlags;
  }

  completedWork.childLanes = newChildLanes;
  return didBailout;
}

function completeSuspendedOffscreenHostContainer(current, workInProgress) {
  // This is a fork of the complete phase for HostComponent. We use it when
  // a suspense tree is in its fallback state, because in that case the primary
  // tree that includes the offscreen boundary is skipped over without a
  // regular complete phase.
  //
  // We can optimize this path further by inlining the update logic for
  // offscreen instances specifically, i.e. skipping the `prepareUpdate` call.
  var rootContainerInstance = getRootHostContainer();
  var type = workInProgress.type;
  var newProps = workInProgress.memoizedProps;

  if (current !== null) {
    updateHostComponent(
      current,
      workInProgress,
      type,
      newProps,
      rootContainerInstance
    );
  } else {
    var currentHostContext = getHostContext();
    var instance = createInstance(
      type,
      newProps,
      rootContainerInstance,
      currentHostContext,
      workInProgress
    );
    appendAllChildren(instance, workInProgress, false, false);
    workInProgress.stateNode = instance; // Certain renderers require commit-time effects for initial mount.
    // (eg DOM renderer supports auto-focus for certain elements).
    // Make sure such renderers get scheduled for later work.

    if (finalizeInitialChildren(instance)) {
      markUpdate(workInProgress);
    }

    if (workInProgress.ref !== null) {
      // If there is a ref on a host node we need to schedule a callback
      markRef(workInProgress);
    }
  }

  bubbleProperties(workInProgress);
}

function completeWork(current, workInProgress, renderLanes) {
  var newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      bubbleProperties(workInProgress);
      return null;

    case ClassComponent: {
      var Component = workInProgress.type;

      if (isContextProvider(Component)) {
        popContext(workInProgress);
      }

      bubbleProperties(workInProgress);
      return null;
    }

    case HostRoot: {
      var fiberRoot = workInProgress.stateNode;

      popHostContainer(workInProgress);
      popTopLevelContextObject(workInProgress);
      resetWorkInProgressVersions();

      if (fiberRoot.pendingContext) {
        fiberRoot.context = fiberRoot.pendingContext;
        fiberRoot.pendingContext = null;
      }

      if (current === null || current.child === null) {
        // If we hydrated, pop so that we can delete any remaining children
        // that weren't hydrated.
        var wasHydrated = popHydrationState();

        if (wasHydrated) {
          // If we hydrated, then we'll need to schedule an update for
          // the commit side-effects on the root.
          markUpdate(workInProgress);
        } else if (!fiberRoot.hydrate) {
          // Schedule an effect to clear this container at the start of the next commit.
          // This handles the case of React rendering into a container with previous children.
          // It's also safe to do for updates too, because current.child would only be null
          // if the previous render was null (so the the container would already be empty).
          workInProgress.flags |= Snapshot;
        }
      }

      updateHostContainer(current, workInProgress);
      bubbleProperties(workInProgress);
      return null;
    }

    case HostComponent: {
      popHostContext(workInProgress);
      var rootContainerInstance = getRootHostContainer();
      var type = workInProgress.type;

      if (current !== null && workInProgress.stateNode != null) {
        updateHostComponent(
          current,
          workInProgress,
          type,
          newProps,
          rootContainerInstance
        );

        if (current.ref !== workInProgress.ref) {
          markRef(workInProgress);
        }
      } else {
        if (!newProps) {
          if (!(workInProgress.stateNode !== null)) {
            throw Error(
              "We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue."
            );
          } // This can happen when we abort work.

          bubbleProperties(workInProgress);
          return null;
        }

        var currentHostContext = getHostContext(); // TODO: Move createInstance to beginWork and keep it on a context
        // "stack" as the parent. Then append children as we go in beginWork
        // or completeWork depending on whether we want to add them top->down or
        // bottom->up. Top->down is faster in IE11.

        var _wasHydrated = popHydrationState();

        if (_wasHydrated) {
          // TODO: Move this and createInstance step into the beginPhase
          // to consolidate.
          if (prepareToHydrateHostInstance()) {
            // If changes to the hydrated node need to be applied at the
            // commit-phase we mark this as such.
            markUpdate(workInProgress);
          }
        } else {
          var instance = createInstance(
            type,
            newProps,
            rootContainerInstance,
            currentHostContext,
            workInProgress
          );
          appendAllChildren(instance, workInProgress, false, false);
          workInProgress.stateNode = instance; // Certain renderers require commit-time effects for initial mount.
          // (eg DOM renderer supports auto-focus for certain elements).
          // Make sure such renderers get scheduled for later work.

          if (finalizeInitialChildren(instance)) {
            markUpdate(workInProgress);
          }
        }

        if (workInProgress.ref !== null) {
          // If there is a ref on a host node we need to schedule a callback
          markRef(workInProgress);
        }
      }

      bubbleProperties(workInProgress);
      return null;
    }

    case HostText: {
      var newText = newProps;

      if (current && workInProgress.stateNode != null) {
        var oldText = current.memoizedProps; // If we have an alternate, that means this is an update and we need
        // to schedule a side-effect to do the updates.

        updateHostText(current, workInProgress, oldText, newText);
      } else {
        if (typeof newText !== "string") {
          if (!(workInProgress.stateNode !== null)) {
            throw Error(
              "We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue."
            );
          } // This can happen when we abort work.
        }

        var _rootContainerInstance = getRootHostContainer();

        var _currentHostContext = getHostContext();

        var _wasHydrated2 = popHydrationState();

        if (_wasHydrated2) {
          if (prepareToHydrateHostTextInstance()) {
            markUpdate(workInProgress);
          }
        } else {
          workInProgress.stateNode = createTextInstance(
            newText,
            _rootContainerInstance,
            _currentHostContext,
            workInProgress
          );
        }
      }

      bubbleProperties(workInProgress);
      return null;
    }

    case SuspenseComponent: {
      popSuspenseContext(workInProgress);
      var nextState = workInProgress.memoizedState;

      if ((workInProgress.flags & DidCapture) !== NoFlags) {
        // Something suspended. Re-render with the fallback children.
        workInProgress.lanes = renderLanes; // Do not reset the effect list.

        if ((workInProgress.mode & ProfileMode) !== NoMode) {
          transferActualDuration(workInProgress);
        } // Don't bubble properties in this case.

        return workInProgress;
      }

      var nextDidTimeout = nextState !== null;
      var prevDidTimeout = false;

      if (current === null);
      else {
        var prevState = current.memoizedState;
        prevDidTimeout = prevState !== null;
      } // If the suspended state of the boundary changes, we need to schedule
      // an effect to toggle the subtree's visibility. When we switch from
      // fallback -> primary, the inner Offscreen fiber schedules this effect
      // as part of its normal complete phase. But when we switch from
      // primary -> fallback, the inner Offscreen fiber does not have a complete
      // phase. So we need to schedule its effect here.
      //
      // We also use this flag to connect/disconnect the effects, but the same
      // logic applies: when re-connecting, the Offscreen fiber's complete
      // phase will handle scheduling the effect. It's only when the fallback
      // is active that we have to do anything special.

      if (nextDidTimeout && !prevDidTimeout) {
        var offscreenFiber = workInProgress.child;
        offscreenFiber.flags |= Visibility; // TODO: This will still suspend a synchronous tree if anything
        // in the concurrent tree already suspended during this render.
        // This is a known bug.

        if ((workInProgress.mode & ConcurrentMode) !== NoMode) {
          // TODO: Move this back to throwException because this is too late
          // if this is a large tree which is common for initial loads. We
          // don't know if we should restart a render or not until we get
          // this marker, and this is too late.
          // If this render already had a ping or lower pri updates,
          // and this is the first time we know we're going to suspend we
          // should be able to immediately restart from within throwException.
          var hasInvisibleChildContext =
            current === null &&
            workInProgress.memoizedProps.unstable_avoidThisFallback !== true;

          if (
            hasInvisibleChildContext ||
            hasSuspenseContext(
              suspenseStackCursor.current,
              InvisibleParentSuspenseContext
            )
          ) {
            // If this was in an invisible tree or a new render, then showing
            // this boundary is ok.
            renderDidSuspend();
          } else {
            // Otherwise, we're going to have to hide content so we should
            // suspend for longer if possible.
            renderDidSuspendDelayIfPossible();
          }
        }
      }

      var wakeables = workInProgress.updateQueue;

      if (wakeables !== null) {
        // Schedule an effect to attach a retry listener to the promise.
        // TODO: Move to passive phase
        workInProgress.flags |= Update;
      }

      bubbleProperties(workInProgress);

      {
        if ((workInProgress.mode & ProfileMode) !== NoMode) {
          if (nextDidTimeout) {
            // Don't count time spent in a timed out Suspense subtree as part of the base duration.
            var _primaryChildFragment2 = workInProgress.child;

            if (_primaryChildFragment2 !== null) {
              // $FlowFixMe Flow doesn't support type casting in combination with the -= operator
              workInProgress.treeBaseDuration -=
                _primaryChildFragment2.treeBaseDuration;
            }
          }
        }
      }

      return null;
    }

    case HostPortal:
      popHostContainer(workInProgress);
      updateHostContainer(current, workInProgress);

      if (current === null) {
        preparePortalMount(workInProgress.stateNode.containerInfo);
      }

      bubbleProperties(workInProgress);
      return null;

    case ContextProvider:
      // Pop provider fiber
      var context = workInProgress.type._context;
      popProvider(context, workInProgress);
      bubbleProperties(workInProgress);
      return null;

    case IncompleteClassComponent: {
      // Same as class component case. I put it down here so that the tags are
      // sequential to ensure this switch is compiled to a jump table.
      var _Component = workInProgress.type;

      if (isContextProvider(_Component)) {
        popContext(workInProgress);
      }

      bubbleProperties(workInProgress);
      return null;
    }

    case SuspenseListComponent: {
      popSuspenseContext(workInProgress);
      var renderState = workInProgress.memoizedState;

      if (renderState === null) {
        // We're running in the default, "independent" mode.
        // We don't do anything in this mode.
        bubbleProperties(workInProgress);
        return null;
      }

      var didSuspendAlready = (workInProgress.flags & DidCapture) !== NoFlags;
      var renderedTail = renderState.rendering;

      if (renderedTail === null) {
        // We just rendered the head.
        if (!didSuspendAlready) {
          // This is the first pass. We need to figure out if anything is still
          // suspended in the rendered set.
          // If new content unsuspended, but there's still some content that
          // didn't. Then we need to do a second pass that forces everything
          // to keep showing their fallbacks.
          // We might be suspended if something in this render pass suspended, or
          // something in the previous committed pass suspended. Otherwise,
          // there's no chance so we can skip the expensive call to
          // findFirstSuspended.
          var cannotBeSuspended =
            renderHasNotSuspendedYet() &&
            (current === null || (current.flags & DidCapture) === NoFlags);

          if (!cannotBeSuspended) {
            var row = workInProgress.child;

            while (row !== null) {
              var suspended = findFirstSuspended(row);

              if (suspended !== null) {
                didSuspendAlready = true;
                workInProgress.flags |= DidCapture;
                cutOffTailIfNeeded(renderState, false); // If this is a newly suspended tree, it might not get committed as
                // part of the second pass. In that case nothing will subscribe to
                // its thenables. Instead, we'll transfer its thenables to the
                // SuspenseList so that it can retry if they resolve.
                // There might be multiple of these in the list but since we're
                // going to wait for all of them anyway, it doesn't really matter
                // which ones gets to ping. In theory we could get clever and keep
                // track of how many dependencies remain but it gets tricky because
                // in the meantime, we can add/remove/change items and dependencies.
                // We might bail out of the loop before finding any but that
                // doesn't matter since that means that the other boundaries that
                // we did find already has their listeners attached.

                var newThenables = suspended.updateQueue;

                if (newThenables !== null) {
                  workInProgress.updateQueue = newThenables;
                  workInProgress.flags |= Update;
                } // Rerender the whole list, but this time, we'll force fallbacks
                // to stay in place.
                // Reset the effect flags before doing the second pass since that's now invalid.
                // Reset the child fibers to their original state.

                workInProgress.subtreeFlags = NoFlags;
                resetChildFibers(workInProgress, renderLanes); // Set up the Suspense Context to force suspense and immediately
                // rerender the children.

                pushSuspenseContext(
                  workInProgress,
                  setShallowSuspenseContext(
                    suspenseStackCursor.current,
                    ForceSuspenseFallback
                  )
                ); // Don't bubble properties in this case.

                return workInProgress.child;
              }

              row = row.sibling;
            }
          }

          if (renderState.tail !== null && now() > getRenderTargetTime()) {
            // We have already passed our CPU deadline but we still have rows
            // left in the tail. We'll just give up further attempts to render
            // the main content and only render fallbacks.
            workInProgress.flags |= DidCapture;
            didSuspendAlready = true;
            cutOffTailIfNeeded(renderState, false); // Since nothing actually suspended, there will nothing to ping this
            // to get it started back up to attempt the next item. While in terms
            // of priority this work has the same priority as this current render,
            // it's not part of the same transition once the transition has
            // committed. If it's sync, we still want to yield so that it can be
            // painted. Conceptually, this is really the same as pinging.
            // We can use any RetryLane even if it's the one currently rendering
            // since we're leaving it behind on this node.

            workInProgress.lanes = SomeRetryLane;
          }
        } else {
          cutOffTailIfNeeded(renderState, false);
        } // Next we're going to render the tail.
      } else {
        // Append the rendered row to the child list.
        if (!didSuspendAlready) {
          var _suspended = findFirstSuspended(renderedTail);

          if (_suspended !== null) {
            workInProgress.flags |= DidCapture;
            didSuspendAlready = true; // Ensure we transfer the update queue to the parent so that it doesn't
            // get lost if this row ends up dropped during a second pass.

            var _newThenables = _suspended.updateQueue;

            if (_newThenables !== null) {
              workInProgress.updateQueue = _newThenables;
              workInProgress.flags |= Update;
            }

            cutOffTailIfNeeded(renderState, true); // This might have been modified.

            if (
              renderState.tail === null &&
              renderState.tailMode === "hidden" &&
              !renderedTail.alternate &&
              !getIsHydrating() // We don't cut it if we're hydrating.
            ) {
              // We're done.
              bubbleProperties(workInProgress);
              return null;
            }
          } else if (
            // The time it took to render last row is greater than the remaining
            // time we have to render. So rendering one more row would likely
            // exceed it.
            now() * 2 - renderState.renderingStartTime >
              getRenderTargetTime() &&
            renderLanes !== OffscreenLane
          ) {
            // We have now passed our CPU deadline and we'll just give up further
            // attempts to render the main content and only render fallbacks.
            // The assumption is that this is usually faster.
            workInProgress.flags |= DidCapture;
            didSuspendAlready = true;
            cutOffTailIfNeeded(renderState, false); // Since nothing actually suspended, there will nothing to ping this
            // to get it started back up to attempt the next item. While in terms
            // of priority this work has the same priority as this current render,
            // it's not part of the same transition once the transition has
            // committed. If it's sync, we still want to yield so that it can be
            // painted. Conceptually, this is really the same as pinging.
            // We can use any RetryLane even if it's the one currently rendering
            // since we're leaving it behind on this node.

            workInProgress.lanes = SomeRetryLane;
          }
        }

        if (renderState.isBackwards) {
          // The effect list of the backwards tail will have been added
          // to the end. This breaks the guarantee that life-cycles fire in
          // sibling order but that isn't a strong guarantee promised by React.
          // Especially since these might also just pop in during future commits.
          // Append to the beginning of the list.
          renderedTail.sibling = workInProgress.child;
          workInProgress.child = renderedTail;
        } else {
          var previousSibling = renderState.last;

          if (previousSibling !== null) {
            previousSibling.sibling = renderedTail;
          } else {
            workInProgress.child = renderedTail;
          }

          renderState.last = renderedTail;
        }
      }

      if (renderState.tail !== null) {
        // We still have tail rows to render.
        // Pop a row.
        var next = renderState.tail;
        renderState.rendering = next;
        renderState.tail = next.sibling;
        renderState.renderingStartTime = now();
        next.sibling = null; // Restore the context.
        // TODO: We can probably just avoid popping it instead and only
        // setting it the first time we go from not suspended to suspended.

        var suspenseContext = suspenseStackCursor.current;

        if (didSuspendAlready) {
          suspenseContext = setShallowSuspenseContext(
            suspenseContext,
            ForceSuspenseFallback
          );
        } else {
          suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
        }

        pushSuspenseContext(workInProgress, suspenseContext); // Do a pass over the next row.
        // Don't bubble properties in this case.

        return next;
      }

      bubbleProperties(workInProgress);
      return null;
    }

    case ScopeComponent: {
      break;
    }

    case OffscreenComponent:
    case LegacyHiddenComponent: {
      popRenderLanes(workInProgress);
      var _nextState = workInProgress.memoizedState;
      var nextIsHidden = _nextState !== null;

      if (current !== null) {
        var _prevState = current.memoizedState;
        var prevIsHidden = _prevState !== null;

        if (
          prevIsHidden !== nextIsHidden &&
          newProps.mode !== "unstable-defer-without-hiding" && // LegacyHidden doesn't do any hiding — it only pre-renders.
          workInProgress.tag !== LegacyHiddenComponent
        ) {
          workInProgress.flags |= Visibility;
        }
      }

      if (!nextIsHidden || (workInProgress.mode & ConcurrentMode) === NoMode) {
        bubbleProperties(workInProgress);
      } else {
        // Don't bubble properties for hidden children unless we're rendering
        // at offscreen priority.
        if (includesSomeLane(subtreeRenderLanes, OffscreenLane)) {
          bubbleProperties(workInProgress);

          {
            // Check if there was an insertion or update in the hidden subtree.
            // If so, we need to hide those nodes in the commit phase, so
            // schedule a visibility effect.
            if (
              workInProgress.tag !== LegacyHiddenComponent &&
              workInProgress.subtreeFlags & (Placement | Update) &&
              newProps.mode !== "unstable-defer-without-hiding"
            ) {
              workInProgress.flags |= Visibility;
            }
          }
        }
      }

      return null;
    }
  }

  {
    throw Error(
      "Unknown unit of work tag (" +
        workInProgress.tag +
        "). This error is likely caused by a bug in React. Please file an issue."
    );
  }
}

var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
var didReceiveUpdate = false;
var didWarnAboutBadClass;
var didWarnAboutModulePatternComponent;
var didWarnAboutContextTypeOnFunctionComponent;
var didWarnAboutGetDerivedStateOnFunctionComponent;
var didWarnAboutFunctionRefs;
var didWarnAboutReassigningProps;
var didWarnAboutRevealOrder;
var didWarnAboutTailOptions;

{
  didWarnAboutBadClass = {};
  didWarnAboutModulePatternComponent = {};
  didWarnAboutContextTypeOnFunctionComponent = {};
  didWarnAboutGetDerivedStateOnFunctionComponent = {};
  didWarnAboutFunctionRefs = {};
  didWarnAboutReassigningProps = false;
  didWarnAboutRevealOrder = {};
  didWarnAboutTailOptions = {};
}

function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    );
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.
    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes
    );
  }
}

function forceUnmountCurrentAndReconcile(
  current,
  workInProgress,
  nextChildren,
  renderLanes
) {
  // This function is fork of reconcileChildren. It's used in cases where we
  // want to reconcile without matching against the existing set. This has the
  // effect of all current children being unmounted; even if the type and key
  // are the same, the old child is unmounted and a new child is created.
  //
  // To do this, we're going to go through the reconcile algorithm twice. In
  // the first pass, we schedule a deletion for all the current children by
  // passing null.
  workInProgress.child = reconcileChildFibers(
    workInProgress,
    current.child,
    null,
    renderLanes
  ); // In the second pass, we mount the new children. The trick here is that we
  // pass null in place of where we usually pass the current child set. This has
  // the effect of remounting all children regardless of whether their
  // identities match.

  workInProgress.child = reconcileChildFibers(
    workInProgress,
    null,
    nextChildren,
    renderLanes
  );
}

function updateForwardRef(
  current,
  workInProgress,
  Component,
  nextProps,
  renderLanes
) {
  // TODO: current can be non-null here even if the component
  // hasn't yet mounted. This happens after the first render suspends.
  // We'll need to figure out if this is fine or can cause issues.
  {
    if (workInProgress.type !== workInProgress.elementType) {
      // Lazy component props can't be validated in createElement
      // because they're only guaranteed to be resolved here.
      var innerPropTypes = Component.propTypes;

      if (innerPropTypes) {
        checkPropTypes(
          innerPropTypes,
          nextProps, // Resolved props
          "prop",
          getComponentNameFromType(Component)
        );
      }
    }
  }

  var render = Component.render;
  var ref = workInProgress.ref; // The rest is a fork of updateFunctionComponent

  var nextChildren;
  prepareToReadContext(workInProgress, renderLanes);

  {
    ReactCurrentOwner$1.current = workInProgress;
    setIsRendering(true);
    nextChildren = renderWithHooks(
      current,
      workInProgress,
      render,
      nextProps,
      ref,
      renderLanes
    );

    if (workInProgress.mode & StrictLegacyMode) {
      setIsStrictModeForDevtools(true);

      try {
        nextChildren = renderWithHooks(
          current,
          workInProgress,
          render,
          nextProps,
          ref,
          renderLanes
        );
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }

    setIsRendering(false);
  }

  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress, renderLanes);
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  } // React DevTools reads this flag.

  workInProgress.flags |= PerformedWork;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateMemoComponent(
  current,
  workInProgress,
  Component,
  nextProps,
  renderLanes
) {
  if (current === null) {
    var type = Component.type;

    if (
      isSimpleFunctionComponent(type) &&
      Component.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
      Component.defaultProps === undefined
    ) {
      var resolvedType = type;

      {
        resolvedType = resolveFunctionForHotReloading(type);
      } // If this is a plain function component without default props,
      // and with only the default shallow comparison, we upgrade it
      // to a SimpleMemoComponent to allow fast path updates.

      workInProgress.tag = SimpleMemoComponent;
      workInProgress.type = resolvedType;

      {
        validateFunctionComponentInDev(workInProgress, type);
      }

      return updateSimpleMemoComponent(
        current,
        workInProgress,
        resolvedType,
        nextProps,
        renderLanes
      );
    }

    {
      var innerPropTypes = type.propTypes;

      if (innerPropTypes) {
        // Inner memo component props aren't currently validated in createElement.
        // We could move it there, but we'd still need this for lazy code path.
        checkPropTypes(
          innerPropTypes,
          nextProps, // Resolved props
          "prop",
          getComponentNameFromType(type)
        );
      }
    }

    var child = createFiberFromTypeAndProps(
      Component.type,
      null,
      nextProps,
      workInProgress,
      workInProgress.mode,
      renderLanes
    );
    child.ref = workInProgress.ref;
    child.return = workInProgress;
    workInProgress.child = child;
    return child;
  }

  {
    var _type = Component.type;
    var _innerPropTypes = _type.propTypes;

    if (_innerPropTypes) {
      // Inner memo component props aren't currently validated in createElement.
      // We could move it there, but we'd still need this for lazy code path.
      checkPropTypes(
        _innerPropTypes,
        nextProps, // Resolved props
        "prop",
        getComponentNameFromType(_type)
      );
    }
  }

  var currentChild = current.child; // This is always exactly one child

  var hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(
    current,
    renderLanes
  );

  if (!hasScheduledUpdateOrContext) {
    // This will be the props with resolved defaultProps,
    // unlike current.memoizedProps which will be the unresolved ones.
    var prevProps = currentChild.memoizedProps; // Default to shallow comparison

    var compare = Component.compare;
    compare = compare !== null ? compare : shallowEqual;

    if (compare(prevProps, nextProps) && current.ref === workInProgress.ref) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    }
  } // React DevTools reads this flag.

  workInProgress.flags |= PerformedWork;
  var newChild = createWorkInProgress(currentChild, nextProps);
  newChild.ref = workInProgress.ref;
  newChild.return = workInProgress;
  workInProgress.child = newChild;
  return newChild;
}

function updateSimpleMemoComponent(
  current,
  workInProgress,
  Component,
  nextProps,
  renderLanes
) {
  // TODO: current can be non-null here even if the component
  // hasn't yet mounted. This happens when the inner render suspends.
  // We'll need to figure out if this is fine or can cause issues.
  {
    if (workInProgress.type !== workInProgress.elementType) {
      // Lazy component props can't be validated in createElement
      // because they're only guaranteed to be resolved here.
      var outerMemoType = workInProgress.elementType;

      if (outerMemoType.$$typeof === REACT_LAZY_TYPE) {
        // We warn when you define propTypes on lazy()
        // so let's just skip over it to find memo() outer wrapper.
        // Inner props for memo are validated later.
        var lazyComponent = outerMemoType;
        var payload = lazyComponent._payload;
        var init = lazyComponent._init;

        try {
          outerMemoType = init(payload);
        } catch (x) {
          outerMemoType = null;
        } // Inner propTypes will be validated in the function component path.

        var outerPropTypes = outerMemoType && outerMemoType.propTypes;

        if (outerPropTypes) {
          checkPropTypes(
            outerPropTypes,
            nextProps, // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            getComponentNameFromType(outerMemoType)
          );
        }
      }
    }
  }

  if (current !== null) {
    var prevProps = current.memoizedProps;

    if (
      shallowEqual(prevProps, nextProps) &&
      current.ref === workInProgress.ref && // Prevent bailout if the implementation changed due to hot reload.
      workInProgress.type === current.type
    ) {
      didReceiveUpdate = false;

      if (!checkScheduledUpdateOrContext(current, renderLanes)) {
        // The pending lanes were cleared at the beginning of beginWork. We're
        // about to bail out, but there might be other lanes that weren't
        // included in the current render. Usually, the priority level of the
        // remaining updates is accumulated during the evaluation of the
        // component (i.e. when processing the update queue). But since since
        // we're bailing out early *without* evaluating the component, we need
        // to account for it here, too. Reset to the value of the current fiber.
        // NOTE: This only applies to SimpleMemoComponent, not MemoComponent,
        // because a MemoComponent fiber does not have hooks or an update queue;
        // rather, it wraps around an inner component, which may or may not
        // contains hooks.
        // TODO: Move the reset at in beginWork out of the common path so that
        // this is no longer necessary.
        workInProgress.lanes = current.lanes;
        return bailoutOnAlreadyFinishedWork(
          current,
          workInProgress,
          renderLanes
        );
      } else if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
        // This is a special case that only exists for legacy mode.
        // See https://github.com/facebook/react/pull/19216.
        didReceiveUpdate = true;
      }
    }
  }

  return updateFunctionComponent(
    current,
    workInProgress,
    Component,
    nextProps,
    renderLanes
  );
}

function updateOffscreenComponent(current, workInProgress, renderLanes) {
  var nextProps = workInProgress.pendingProps;
  var nextChildren = nextProps.children;
  var prevState = current !== null ? current.memoizedState : null; // If this is not null, this is a cache pool that was carried over from the
  // previous render. We will push this to the cache pool context so that we can
  // resume in-flight requests.

  var spawnedCachePool = null;

  if (
    nextProps.mode === "hidden" ||
    nextProps.mode === "unstable-defer-without-hiding"
  ) {
    // Rendering a hidden tree.
    if ((workInProgress.mode & ConcurrentMode) === NoMode) {
      // In legacy sync mode, don't defer the subtree. Render it now.
      var nextState = {
        baseLanes: NoLanes,
        cachePool: null
      };
      workInProgress.memoizedState = nextState;
      pushRenderLanes(workInProgress, renderLanes);
    } else if (!includesSomeLane(renderLanes, OffscreenLane)) {
      // We're hidden, and we're not rendering at Offscreen. We will bail out
      // and resume this tree later.
      var nextBaseLanes;

      if (prevState !== null) {
        var prevBaseLanes = prevState.baseLanes;
        nextBaseLanes = mergeLanes(prevBaseLanes, renderLanes);
      } else {
        nextBaseLanes = renderLanes;
      } // Schedule this fiber to re-render at offscreen priority. Then bailout.

      workInProgress.lanes = workInProgress.childLanes = laneToLanes(
        OffscreenLane
      );
      var _nextState = {
        baseLanes: nextBaseLanes,
        cachePool: spawnedCachePool
      };
      workInProgress.memoizedState = _nextState;
      workInProgress.updateQueue = null; // We're about to bail out, but we need to push this to the stack anyway
      // to avoid a push/pop misalignment.

      pushRenderLanes(workInProgress, nextBaseLanes);

      return null;
    } else {
      var _nextState2 = {
        baseLanes: NoLanes,
        cachePool: null
      };
      workInProgress.memoizedState = _nextState2; // Push the lanes that were skipped when we bailed out.

      var subtreeRenderLanes =
        prevState !== null ? prevState.baseLanes : renderLanes;
      pushRenderLanes(workInProgress, subtreeRenderLanes);
    }
  } else {
    // Rendering a visible tree.
    var _subtreeRenderLanes;

    if (prevState !== null) {
      // We're going from hidden -> visible.
      _subtreeRenderLanes = mergeLanes(prevState.baseLanes, renderLanes);

      workInProgress.memoizedState = null;
    } else {
      // We weren't previously hidden, and we still aren't, so there's nothing
      // special to do. Need to push to the stack regardless, though, to avoid
      // a push/pop misalignment.
      _subtreeRenderLanes = renderLanes;
    }

    pushRenderLanes(workInProgress, _subtreeRenderLanes);
  }

  if (enablePersistentOffscreenHostContainer && supportsPersistence) {
    // In persistent mode, the offscreen children are wrapped in a host node.
    // TODO: Optimize this to use the OffscreenComponent fiber instead of
    // an extra HostComponent fiber. Need to make sure this doesn't break Fabric
    // or some other infra that expects a HostComponent.
    var isHidden =
      nextProps.mode === "hidden" &&
      workInProgress.tag !== LegacyHiddenComponent;
    var offscreenContainer = reconcileOffscreenHostContainer(
      current,
      workInProgress
    );
    return offscreenContainer;
  } else {
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
    return workInProgress.child;
  }
}

function reconcileOffscreenHostContainer(
  currentOffscreen,
  offscreen,
  isHidden,
  children,
  renderLanes
) {
  var containerProps = getOffscreenContainerProps();
  var hostContainer;

  if (currentOffscreen === null) {
    hostContainer = createOffscreenHostContainerFiber(
      containerProps,
      offscreen.mode
    );
  } else {
    var currentHostContainer = currentOffscreen.child;

    if (currentHostContainer === null) {
      hostContainer = createOffscreenHostContainerFiber(
        containerProps,
        offscreen.mode
      );
      hostContainer.flags |= Placement;
    } else {
      hostContainer = createWorkInProgress(
        currentHostContainer,
        containerProps
      );
    }
  }

  hostContainer.return = offscreen;
  offscreen.child = hostContainer;
  return hostContainer;
} // Note: These happen to have identical begin phases, for now. We shouldn't hold
// ourselves to this constraint, though. If the behavior diverges, we should
// fork the function.

var updateLegacyHiddenComponent = updateOffscreenComponent;

function updateFragment(current, workInProgress, renderLanes) {
  var nextChildren = workInProgress.pendingProps;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateMode(current, workInProgress, renderLanes) {
  var nextChildren = workInProgress.pendingProps.children;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateProfiler(current, workInProgress, renderLanes) {
  {
    workInProgress.flags |= Update;

    {
      // Reset effect durations for the next eventual effect phase.
      // These are reset during render to allow the DevTools commit hook a chance to read them,
      var stateNode = workInProgress.stateNode;
      stateNode.effectDuration = 0;
      stateNode.passiveEffectDuration = 0;
    }
  }

  var nextProps = workInProgress.pendingProps;
  var nextChildren = nextProps.children;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function markRef$1(current, workInProgress) {
  var ref = workInProgress.ref;

  if (
    (current === null && ref !== null) ||
    (current !== null && current.ref !== ref)
  ) {
    // Schedule a Ref effect
    workInProgress.flags |= Ref;
  }
}

function updateFunctionComponent(
  current,
  workInProgress,
  Component,
  nextProps,
  renderLanes
) {
  {
    if (workInProgress.type !== workInProgress.elementType) {
      // Lazy component props can't be validated in createElement
      // because they're only guaranteed to be resolved here.
      var innerPropTypes = Component.propTypes;

      if (innerPropTypes) {
        checkPropTypes(
          innerPropTypes,
          nextProps, // Resolved props
          "prop",
          getComponentNameFromType(Component)
        );
      }
    }
  }

  var context;

  {
    var unmaskedContext = getUnmaskedContext(workInProgress, Component, true);
    context = getMaskedContext(workInProgress, unmaskedContext);
  }

  var nextChildren;
  prepareToReadContext(workInProgress, renderLanes);

  {
    ReactCurrentOwner$1.current = workInProgress;
    setIsRendering(true);
    nextChildren = renderWithHooks(
      current,
      workInProgress,
      Component,
      nextProps,
      context,
      renderLanes
    );

    if (workInProgress.mode & StrictLegacyMode) {
      setIsStrictModeForDevtools(true);

      try {
        nextChildren = renderWithHooks(
          current,
          workInProgress,
          Component,
          nextProps,
          context,
          renderLanes
        );
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }

    setIsRendering(false);
  }

  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress, renderLanes);
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  } // React DevTools reads this flag.

  workInProgress.flags |= PerformedWork;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateClassComponent(
  current,
  workInProgress,
  Component,
  nextProps,
  renderLanes
) {
  {
    // This is used by DevTools to force a boundary to error.
    switch (shouldError(workInProgress)) {
      case false: {
        var _instance = workInProgress.stateNode;
        var ctor = workInProgress.type; // TODO This way of resetting the error boundary state is a hack.
        // Is there a better way to do this?

        var tempInstance = new ctor(
          workInProgress.memoizedProps,
          _instance.context
        );
        var state = tempInstance.state;

        _instance.updater.enqueueSetState(_instance, state, null);

        break;
      }

      case true: {
        workInProgress.flags |= DidCapture;
        workInProgress.flags |= ShouldCapture;
        var error$1 = new Error("Simulated error coming from DevTools");
        var lane = pickArbitraryLane(renderLanes);
        workInProgress.lanes = mergeLanes(workInProgress.lanes, lane); // Schedule the error boundary to re-render using updated state

        var update = createClassErrorUpdate(
          workInProgress,
          createCapturedValue(error$1, workInProgress),
          lane
        );
        enqueueCapturedUpdate(workInProgress, update);
        break;
      }
    }

    if (workInProgress.type !== workInProgress.elementType) {
      // Lazy component props can't be validated in createElement
      // because they're only guaranteed to be resolved here.
      var innerPropTypes = Component.propTypes;

      if (innerPropTypes) {
        checkPropTypes(
          innerPropTypes,
          nextProps, // Resolved props
          "prop",
          getComponentNameFromType(Component)
        );
      }
    }
  } // Push context providers early to prevent context stack mismatches.
  // During mounting we don't know the child context yet as the instance doesn't exist.
  // We will invalidate the child context in finishClassComponent() right after rendering.

  var hasContext;

  if (isContextProvider(Component)) {
    hasContext = true;
    pushContextProvider(workInProgress);
  } else {
    hasContext = false;
  }

  prepareToReadContext(workInProgress, renderLanes);
  var instance = workInProgress.stateNode;
  var shouldUpdate;

  if (instance === null) {
    if (current !== null) {
      // A class component without an instance only mounts if it suspended
      // inside a non-concurrent tree, in an inconsistent state. We want to
      // treat it like a new mount, even though an empty version of it already
      // committed. Disconnect the alternate pointers.
      current.alternate = null;
      workInProgress.alternate = null; // Since this is conceptually a new fiber, schedule a Placement effect

      workInProgress.flags |= Placement;
    } // In the initial pass we might need to construct the instance.

    constructClassInstance(workInProgress, Component, nextProps);
    mountClassInstance(workInProgress, Component, nextProps, renderLanes);
    shouldUpdate = true;
  } else if (current === null) {
    // In a resume, we'll already have an instance we can reuse.
    shouldUpdate = resumeMountClassInstance(
      workInProgress,
      Component,
      nextProps,
      renderLanes
    );
  } else {
    shouldUpdate = updateClassInstance(
      current,
      workInProgress,
      Component,
      nextProps,
      renderLanes
    );
  }

  var nextUnitOfWork = finishClassComponent(
    current,
    workInProgress,
    Component,
    shouldUpdate,
    hasContext,
    renderLanes
  );

  {
    var inst = workInProgress.stateNode;

    if (shouldUpdate && inst.props !== nextProps) {
      if (!didWarnAboutReassigningProps) {
        error(
          "It looks like %s is reassigning its own `this.props` while rendering. " +
            "This is not supported and can lead to confusing bugs.",
          getComponentNameFromFiber(workInProgress) || "a component"
        );
      }

      didWarnAboutReassigningProps = true;
    }
  }

  return nextUnitOfWork;
}

function finishClassComponent(
  current,
  workInProgress,
  Component,
  shouldUpdate,
  hasContext,
  renderLanes
) {
  // Refs should update even if shouldComponentUpdate returns false
  markRef$1(current, workInProgress);
  var didCaptureError = (workInProgress.flags & DidCapture) !== NoFlags;

  if (!shouldUpdate && !didCaptureError) {
    // Context providers should defer to sCU for rendering
    if (hasContext) {
      invalidateContextProvider(workInProgress, Component, false);
    }

    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  var instance = workInProgress.stateNode; // Rerender

  ReactCurrentOwner$1.current = workInProgress;
  var nextChildren;

  if (
    didCaptureError &&
    typeof Component.getDerivedStateFromError !== "function"
  ) {
    // If we captured an error, but getDerivedStateFromError is not defined,
    // unmount all the children. componentDidCatch will schedule an update to
    // re-render a fallback. This is temporary until we migrate everyone to
    // the new API.
    // TODO: Warn in a future release.
    nextChildren = null;

    {
      stopProfilerTimerIfRunning();
    }
  } else {
    {
      setIsRendering(true);
      nextChildren = instance.render();

      if (workInProgress.mode & StrictLegacyMode) {
        setIsStrictModeForDevtools(true);

        try {
          instance.render();
        } finally {
          setIsStrictModeForDevtools(false);
        }
      }

      setIsRendering(false);
    }
  } // React DevTools reads this flag.

  workInProgress.flags |= PerformedWork;

  if (current !== null && didCaptureError) {
    // If we're recovering from an error, reconcile without reusing any of
    // the existing children. Conceptually, the normal children and the children
    // that are shown on error are two different sets, so we shouldn't reuse
    // normal children even if their identities match.
    forceUnmountCurrentAndReconcile(
      current,
      workInProgress,
      nextChildren,
      renderLanes
    );
  } else {
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  } // Memoize state using the values we just used to render.
  // TODO: Restructure so we never read values from the instance.

  workInProgress.memoizedState = instance.state; // The context might have changed so we need to recalculate it.

  if (hasContext) {
    invalidateContextProvider(workInProgress, Component, true);
  }

  return workInProgress.child;
}

function pushHostRootContext(workInProgress) {
  var root = workInProgress.stateNode;

  if (root.pendingContext) {
    pushTopLevelContextObject(
      workInProgress,
      root.pendingContext,
      root.pendingContext !== root.context
    );
  } else if (root.context) {
    // Should always be set
    pushTopLevelContextObject(workInProgress, root.context, false);
  }

  pushHostContainer(workInProgress, root.containerInfo);
}

function updateHostRoot(current, workInProgress, renderLanes) {
  pushHostRootContext(workInProgress);
  var updateQueue = workInProgress.updateQueue;

  if (!(current !== null && updateQueue !== null)) {
    throw Error(
      "If the root does not have an updateQueue, we should have already bailed out. This error is likely caused by a bug in React. Please file an issue."
    );
  }

  var nextProps = workInProgress.pendingProps;
  var prevState = workInProgress.memoizedState;
  var prevChildren = prevState.element;
  cloneUpdateQueue(current, workInProgress);
  processUpdateQueue(workInProgress, nextProps, null, renderLanes);
  var nextState = workInProgress.memoizedState;
  var root = workInProgress.stateNode;
  // being called "element".

  var nextChildren = nextState.element;

  if (nextChildren === prevChildren) {
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  if (root.hydrate && enterHydrationState()) {
    var child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    );
    workInProgress.child = child;
    var node = child;

    while (node) {
      // Mark each child as hydrating. This is a fast path to know whether this
      // tree is part of a hydrating tree. This is used to determine if a child
      // node has fully mounted yet, and for scheduling event replaying.
      // Conceptually this is similar to Placement in that a new subtree is
      // inserted into the React tree here. It just happens to not need DOM
      // mutations because it already exists.
      node.flags = (node.flags & ~Placement) | Hydrating;
      node = node.sibling;
    }
  } else {
    // Otherwise reset hydration state in case we aborted and resumed another
    // root.
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  }

  return workInProgress.child;
}

function updateHostComponent$1(current, workInProgress, renderLanes) {
  pushHostContext(workInProgress);

  var type = workInProgress.type;
  var nextProps = workInProgress.pendingProps;
  var prevProps = current !== null ? current.memoizedProps : null;
  var nextChildren = nextProps.children;

  if (prevProps !== null && shouldSetTextContent()) {
    // If we're switching from a direct text child to a normal child, or to
    // empty, we need to schedule the text content to be reset.
    workInProgress.flags |= ContentReset;
  }

  markRef$1(current, workInProgress);
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateHostText$1(current, workInProgress) {
  // immediately after.

  return null;
}

function mountLazyComponent(
  _current,
  workInProgress,
  elementType,
  renderLanes
) {
  if (_current !== null) {
    // A lazy component only mounts if it suspended inside a non-
    // concurrent tree, in an inconsistent state. We want to treat it like
    // a new mount, even though an empty version of it already committed.
    // Disconnect the alternate pointers.
    _current.alternate = null;
    workInProgress.alternate = null; // Since this is conceptually a new fiber, schedule a Placement effect

    workInProgress.flags |= Placement;
  }

  var props = workInProgress.pendingProps;
  var lazyComponent = elementType;
  var payload = lazyComponent._payload;
  var init = lazyComponent._init;
  var Component = init(payload); // Store the unwrapped component in the type.

  workInProgress.type = Component;
  var resolvedTag = (workInProgress.tag = resolveLazyComponentTag(Component));
  var resolvedProps = resolveDefaultProps(Component, props);
  var child;

  switch (resolvedTag) {
    case FunctionComponent: {
      {
        validateFunctionComponentInDev(workInProgress, Component);
        workInProgress.type = Component = resolveFunctionForHotReloading(
          Component
        );
      }

      child = updateFunctionComponent(
        null,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes
      );
      return child;
    }

    case ClassComponent: {
      {
        workInProgress.type = Component = resolveClassForHotReloading(
          Component
        );
      }

      child = updateClassComponent(
        null,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes
      );
      return child;
    }

    case ForwardRef: {
      {
        workInProgress.type = Component = resolveForwardRefForHotReloading(
          Component
        );
      }

      child = updateForwardRef(
        null,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes
      );
      return child;
    }

    case MemoComponent: {
      {
        if (workInProgress.type !== workInProgress.elementType) {
          var outerPropTypes = Component.propTypes;

          if (outerPropTypes) {
            checkPropTypes(
              outerPropTypes,
              resolvedProps, // Resolved for outer only
              "prop",
              getComponentNameFromType(Component)
            );
          }
        }
      }

      child = updateMemoComponent(
        null,
        workInProgress,
        Component,
        resolveDefaultProps(Component.type, resolvedProps), // The inner type can have defaults too
        renderLanes
      );
      return child;
    }
  }

  var hint = "";

  {
    if (
      Component !== null &&
      typeof Component === "object" &&
      Component.$$typeof === REACT_LAZY_TYPE
    ) {
      hint = " Did you wrap a component in React.lazy() more than once?";
    }
  } // This message intentionally doesn't mention ForwardRef or MemoComponent
  // because the fact that it's a separate type of work is an
  // implementation detail.

  {
    throw Error(
      "Element type is invalid. Received a promise that resolves to: " +
        Component +
        ". Lazy element type must resolve to a class or function." +
        hint
    );
  }
}

function mountIncompleteClassComponent(
  _current,
  workInProgress,
  Component,
  nextProps,
  renderLanes
) {
  if (_current !== null) {
    // An incomplete component only mounts if it suspended inside a non-
    // concurrent tree, in an inconsistent state. We want to treat it like
    // a new mount, even though an empty version of it already committed.
    // Disconnect the alternate pointers.
    _current.alternate = null;
    workInProgress.alternate = null; // Since this is conceptually a new fiber, schedule a Placement effect

    workInProgress.flags |= Placement;
  } // Promote the fiber to a class and try rendering again.

  workInProgress.tag = ClassComponent; // The rest of this function is a fork of `updateClassComponent`
  // Push context providers early to prevent context stack mismatches.
  // During mounting we don't know the child context yet as the instance doesn't exist.
  // We will invalidate the child context in finishClassComponent() right after rendering.

  var hasContext;

  if (isContextProvider(Component)) {
    hasContext = true;
    pushContextProvider(workInProgress);
  } else {
    hasContext = false;
  }

  prepareToReadContext(workInProgress, renderLanes);
  constructClassInstance(workInProgress, Component, nextProps);
  mountClassInstance(workInProgress, Component, nextProps, renderLanes);
  return finishClassComponent(
    null,
    workInProgress,
    Component,
    true,
    hasContext,
    renderLanes
  );
}

function mountIndeterminateComponent(
  _current,
  workInProgress,
  Component,
  renderLanes
) {
  if (_current !== null) {
    // An indeterminate component only mounts if it suspended inside a non-
    // concurrent tree, in an inconsistent state. We want to treat it like
    // a new mount, even though an empty version of it already committed.
    // Disconnect the alternate pointers.
    _current.alternate = null;
    workInProgress.alternate = null; // Since this is conceptually a new fiber, schedule a Placement effect

    workInProgress.flags |= Placement;
  }

  var props = workInProgress.pendingProps;
  var context;

  {
    var unmaskedContext = getUnmaskedContext(workInProgress, Component, false);
    context = getMaskedContext(workInProgress, unmaskedContext);
  }

  prepareToReadContext(workInProgress, renderLanes);
  var value;

  {
    if (
      Component.prototype &&
      typeof Component.prototype.render === "function"
    ) {
      var componentName = getComponentNameFromType(Component) || "Unknown";

      if (!didWarnAboutBadClass[componentName]) {
        error(
          "The <%s /> component appears to have a render method, but doesn't extend React.Component. " +
            "This is likely to cause errors. Change %s to extend React.Component instead.",
          componentName,
          componentName
        );

        didWarnAboutBadClass[componentName] = true;
      }
    }

    if (workInProgress.mode & StrictLegacyMode) {
      ReactStrictModeWarnings.recordLegacyContextWarning(workInProgress, null);
    }

    setIsRendering(true);
    ReactCurrentOwner$1.current = workInProgress;
    value = renderWithHooks(
      null,
      workInProgress,
      Component,
      props,
      context,
      renderLanes
    );
    setIsRendering(false);
  }

  workInProgress.flags |= PerformedWork;

  {
    // Support for module components is deprecated and is removed behind a flag.
    // Whether or not it would crash later, we want to show a good message in DEV first.
    if (
      typeof value === "object" &&
      value !== null &&
      typeof value.render === "function" &&
      value.$$typeof === undefined
    ) {
      var _componentName = getComponentNameFromType(Component) || "Unknown";

      if (!didWarnAboutModulePatternComponent[_componentName]) {
        error(
          "The <%s /> component appears to be a function component that returns a class instance. " +
            "Change %s to a class that extends React.Component instead. " +
            "If you can't use a class try assigning the prototype on the function as a workaround. " +
            "`%s.prototype = React.Component.prototype`. Don't use an arrow function since it " +
            "cannot be called with `new` by React.",
          _componentName,
          _componentName,
          _componentName
        );

        didWarnAboutModulePatternComponent[_componentName] = true;
      }
    }
  }

  if (
    // Run these checks in production only if the flag is off.
    // Eventually we'll delete this branch altogether.
    typeof value === "object" &&
    value !== null &&
    typeof value.render === "function" &&
    value.$$typeof === undefined
  ) {
    {
      var _componentName2 = getComponentNameFromType(Component) || "Unknown";

      if (!didWarnAboutModulePatternComponent[_componentName2]) {
        error(
          "The <%s /> component appears to be a function component that returns a class instance. " +
            "Change %s to a class that extends React.Component instead. " +
            "If you can't use a class try assigning the prototype on the function as a workaround. " +
            "`%s.prototype = React.Component.prototype`. Don't use an arrow function since it " +
            "cannot be called with `new` by React.",
          _componentName2,
          _componentName2,
          _componentName2
        );

        didWarnAboutModulePatternComponent[_componentName2] = true;
      }
    } // Proceed under the assumption that this is a class instance

    workInProgress.tag = ClassComponent; // Throw out any hooks that were used.

    workInProgress.memoizedState = null;
    workInProgress.updateQueue = null; // Push context providers early to prevent context stack mismatches.
    // During mounting we don't know the child context yet as the instance doesn't exist.
    // We will invalidate the child context in finishClassComponent() right after rendering.

    var hasContext = false;

    if (isContextProvider(Component)) {
      hasContext = true;
      pushContextProvider(workInProgress);
    } else {
      hasContext = false;
    }

    workInProgress.memoizedState =
      value.state !== null && value.state !== undefined ? value.state : null;
    initializeUpdateQueue(workInProgress);
    adoptClassInstance(workInProgress, value);
    mountClassInstance(workInProgress, Component, props, renderLanes);
    return finishClassComponent(
      null,
      workInProgress,
      Component,
      true,
      hasContext,
      renderLanes
    );
  } else {
    // Proceed under the assumption that this is a function component
    workInProgress.tag = FunctionComponent;

    {
      if (workInProgress.mode & StrictLegacyMode) {
        setIsStrictModeForDevtools(true);

        try {
          value = renderWithHooks(
            null,
            workInProgress,
            Component,
            props,
            context,
            renderLanes
          );
        } finally {
          setIsStrictModeForDevtools(false);
        }
      }
    }

    reconcileChildren(null, workInProgress, value, renderLanes);

    {
      validateFunctionComponentInDev(workInProgress, Component);
    }

    return workInProgress.child;
  }
}

function validateFunctionComponentInDev(workInProgress, Component) {
  {
    if (Component) {
      if (Component.childContextTypes) {
        error(
          "%s(...): childContextTypes cannot be defined on a function component.",
          Component.displayName || Component.name || "Component"
        );
      }
    }

    if (workInProgress.ref !== null) {
      var info = "";
      var ownerName = getCurrentFiberOwnerNameInDevOrNull();

      if (ownerName) {
        info += "\n\nCheck the render method of `" + ownerName + "`.";
      }

      var warningKey = ownerName || "";
      var debugSource = workInProgress._debugSource;

      if (debugSource) {
        warningKey = debugSource.fileName + ":" + debugSource.lineNumber;
      }

      if (!didWarnAboutFunctionRefs[warningKey]) {
        didWarnAboutFunctionRefs[warningKey] = true;

        error(
          "Function components cannot be given refs. " +
            "Attempts to access this ref will fail. " +
            "Did you mean to use React.forwardRef()?%s",
          info
        );
      }
    }

    if (typeof Component.getDerivedStateFromProps === "function") {
      var _componentName3 = getComponentNameFromType(Component) || "Unknown";

      if (!didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3]) {
        error(
          "%s: Function components do not support getDerivedStateFromProps.",
          _componentName3
        );

        didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3] = true;
      }
    }

    if (
      typeof Component.contextType === "object" &&
      Component.contextType !== null
    ) {
      var _componentName4 = getComponentNameFromType(Component) || "Unknown";

      if (!didWarnAboutContextTypeOnFunctionComponent[_componentName4]) {
        error(
          "%s: Function components do not support contextType.",
          _componentName4
        );

        didWarnAboutContextTypeOnFunctionComponent[_componentName4] = true;
      }
    }
  }
}

var SUSPENDED_MARKER = {
  dehydrated: null,
  retryLane: NoLane
};

function mountSuspenseOffscreenState(renderLanes) {
  return {
    baseLanes: renderLanes,
    cachePool: getSuspendedCachePool()
  };
}

function updateSuspenseOffscreenState(prevOffscreenState, renderLanes) {
  var cachePool = null;

  return {
    baseLanes: mergeLanes(prevOffscreenState.baseLanes, renderLanes),
    cachePool: cachePool
  };
} // TODO: Probably should inline this back

function shouldRemainOnFallback(
  suspenseContext,
  current,
  workInProgress,
  renderLanes
) {
  // If we're already showing a fallback, there are cases where we need to
  // remain on that fallback regardless of whether the content has resolved.
  // For example, SuspenseList coordinates when nested content appears.
  if (current !== null) {
    var suspenseState = current.memoizedState;

    if (suspenseState === null) {
      // Currently showing content. Don't hide it, even if ForceSuspenseFallback
      // is true. More precise name might be "ForceRemainSuspenseFallback".
      // Note: This is a factoring smell. Can't remain on a fallback if there's
      // no fallback to remain on.
      return false;
    }
  } // Not currently showing content. Consult the Suspense context.

  return hasSuspenseContext(suspenseContext, ForceSuspenseFallback);
}

function getRemainingWorkInPrimaryTree(current, renderLanes) {
  // TODO: Should not remove render lanes that were pinged during this render
  return removeLanes(current.childLanes, renderLanes);
}

function updateSuspenseComponent(current, workInProgress, renderLanes) {
  var nextProps = workInProgress.pendingProps; // This is used by DevTools to force a boundary to suspend.

  {
    if (shouldSuspend(workInProgress)) {
      workInProgress.flags |= DidCapture;
    }
  }

  var suspenseContext = suspenseStackCursor.current;
  var showFallback = false;
  var didSuspend = (workInProgress.flags & DidCapture) !== NoFlags;

  if (didSuspend || shouldRemainOnFallback(suspenseContext, current)) {
    // Something in this boundary's subtree already suspended. Switch to
    // rendering the fallback children.
    showFallback = true;
    workInProgress.flags &= ~DidCapture;
  } else {
    // Attempting the main content
    if (current === null || current.memoizedState !== null) {
      // This is a new mount or this boundary is already showing a fallback state.
      // Mark this subtree context as having at least one invisible parent that could
      // handle the fallback state.
      // Avoided boundaries are not considered since they cannot handle preferred fallback states.
      if (nextProps.unstable_avoidThisFallback !== true) {
        suspenseContext = addSubtreeSuspenseContext(
          suspenseContext,
          InvisibleParentSuspenseContext
        );
      }
    }
  }

  suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
  pushSuspenseContext(workInProgress, suspenseContext); // OK, the next part is confusing. We're about to reconcile the Suspense
  // boundary's children. This involves some custom reconciliation logic. Two
  // main reasons this is so complicated.
  //
  // First, Legacy Mode has different semantics for backwards compatibility. The
  // primary tree will commit in an inconsistent state, so when we do the
  // second pass to render the fallback, we do some exceedingly, uh, clever
  // hacks to make that not totally break. Like transferring effects and
  // deletions from hidden tree. In Concurrent Mode, it's much simpler,
  // because we bailout on the primary tree completely and leave it in its old
  // state, no effects. Same as what we do for Offscreen (except that
  // Offscreen doesn't have the first render pass).
  //
  // Second is hydration. During hydration, the Suspense fiber has a slightly
  // different layout, where the child points to a dehydrated fragment, which
  // contains the DOM rendered by the server.
  //
  // Third, even if you set all that aside, Suspense is like error boundaries in
  // that we first we try to render one tree, and if that fails, we render again
  // and switch to a different tree. Like a try/catch block. So we have to track
  // which branch we're currently rendering. Ideally we would model this using
  // a stack.

  if (current === null) {
    var nextPrimaryChildren = nextProps.children;
    var nextFallbackChildren = nextProps.fallback;

    if (showFallback) {
      var fallbackFragment = mountSuspenseFallbackChildren(
        workInProgress,
        nextPrimaryChildren,
        nextFallbackChildren,
        renderLanes
      );
      var primaryChildFragment = workInProgress.child;
      primaryChildFragment.memoizedState = mountSuspenseOffscreenState(
        renderLanes
      );
      workInProgress.memoizedState = SUSPENDED_MARKER;
      return fallbackFragment;
    } else if (typeof nextProps.unstable_expectedLoadTime === "number") {
      // This is a CPU-bound tree. Skip this tree and show a placeholder to
      // unblock the surrounding content. Then immediately retry after the
      // initial commit.
      var _fallbackFragment = mountSuspenseFallbackChildren(
        workInProgress,
        nextPrimaryChildren,
        nextFallbackChildren,
        renderLanes
      );

      var _primaryChildFragment = workInProgress.child;
      _primaryChildFragment.memoizedState = mountSuspenseOffscreenState(
        renderLanes
      );
      workInProgress.memoizedState = SUSPENDED_MARKER; // Since nothing actually suspended, there will nothing to ping this to
      // get it started back up to attempt the next item. While in terms of
      // priority this work has the same priority as this current render, it's
      // not part of the same transition once the transition has committed. If
      // it's sync, we still want to yield so that it can be painted.
      // Conceptually, this is really the same as pinging. We can use any
      // RetryLane even if it's the one currently rendering since we're leaving
      // it behind on this node.

      workInProgress.lanes = SomeRetryLane;
      return _fallbackFragment;
    } else {
      return mountSuspensePrimaryChildren(workInProgress, nextPrimaryChildren);
    }
  } else {
    // This is an update.
    // If the current fiber has a SuspenseState, that means it's already showing
    // a fallback.
    var prevState = current.memoizedState;

    if (prevState !== null) {
      if (showFallback) {
        var _nextFallbackChildren2 = nextProps.fallback;
        var _nextPrimaryChildren2 = nextProps.children;

        var _fallbackChildFragment = updateSuspenseFallbackChildren(
          current,
          workInProgress,
          _nextPrimaryChildren2,
          _nextFallbackChildren2,
          renderLanes
        );

        var _primaryChildFragment3 = workInProgress.child;
        var prevOffscreenState = current.child.memoizedState;
        _primaryChildFragment3.memoizedState =
          prevOffscreenState === null
            ? mountSuspenseOffscreenState(renderLanes)
            : updateSuspenseOffscreenState(prevOffscreenState, renderLanes);
        _primaryChildFragment3.childLanes = getRemainingWorkInPrimaryTree(
          current,
          renderLanes
        );
        workInProgress.memoizedState = SUSPENDED_MARKER;
        return _fallbackChildFragment;
      } else {
        var _nextPrimaryChildren3 = nextProps.children;

        var _primaryChildFragment4 = updateSuspensePrimaryChildren(
          current,
          workInProgress,
          _nextPrimaryChildren3,
          renderLanes
        );

        workInProgress.memoizedState = null;
        return _primaryChildFragment4;
      }
    } else {
      // The current tree is not already showing a fallback.
      if (showFallback) {
        // Timed out.
        var _nextFallbackChildren3 = nextProps.fallback;
        var _nextPrimaryChildren4 = nextProps.children;

        var _fallbackChildFragment2 = updateSuspenseFallbackChildren(
          current,
          workInProgress,
          _nextPrimaryChildren4,
          _nextFallbackChildren3,
          renderLanes
        );

        var _primaryChildFragment5 = workInProgress.child;
        var _prevOffscreenState = current.child.memoizedState;
        _primaryChildFragment5.memoizedState =
          _prevOffscreenState === null
            ? mountSuspenseOffscreenState(renderLanes)
            : updateSuspenseOffscreenState(_prevOffscreenState, renderLanes);
        _primaryChildFragment5.childLanes = getRemainingWorkInPrimaryTree(
          current,
          renderLanes
        ); // Skip the primary children, and continue working on the
        // fallback children.

        workInProgress.memoizedState = SUSPENDED_MARKER;
        return _fallbackChildFragment2;
      } else {
        // Still haven't timed out. Continue rendering the children, like we
        // normally do.
        var _nextPrimaryChildren5 = nextProps.children;

        var _primaryChildFragment6 = updateSuspensePrimaryChildren(
          current,
          workInProgress,
          _nextPrimaryChildren5,
          renderLanes
        );

        workInProgress.memoizedState = null;
        return _primaryChildFragment6;
      }
    }
  }
}

function mountSuspensePrimaryChildren(
  workInProgress,
  primaryChildren,
  renderLanes
) {
  var mode = workInProgress.mode;
  var primaryChildProps = {
    mode: "visible",
    children: primaryChildren
  };
  var primaryChildFragment = mountWorkInProgressOffscreenFiber(
    primaryChildProps,
    mode
  );
  primaryChildFragment.return = workInProgress;
  workInProgress.child = primaryChildFragment;
  return primaryChildFragment;
}

function mountSuspenseFallbackChildren(
  workInProgress,
  primaryChildren,
  fallbackChildren,
  renderLanes
) {
  var mode = workInProgress.mode;
  var progressedPrimaryFragment = workInProgress.child;
  var primaryChildProps = {
    mode: "hidden",
    children: primaryChildren
  };
  var primaryChildFragment;
  var fallbackChildFragment;

  if (
    (mode & ConcurrentMode) === NoMode &&
    progressedPrimaryFragment !== null
  ) {
    // In legacy mode, we commit the primary tree as if it successfully
    // completed, even though it's in an inconsistent state.
    primaryChildFragment = progressedPrimaryFragment;
    primaryChildFragment.childLanes = NoLanes;
    primaryChildFragment.pendingProps = primaryChildProps;

    if (workInProgress.mode & ProfileMode) {
      // Reset the durations from the first pass so they aren't included in the
      // final amounts. This seems counterintuitive, since we're intentionally
      // not measuring part of the render phase, but this makes it match what we
      // do in Concurrent Mode.
      primaryChildFragment.actualDuration = 0;
      primaryChildFragment.actualStartTime = -1;
      primaryChildFragment.selfBaseDuration = 0;
      primaryChildFragment.treeBaseDuration = 0;
    }

    fallbackChildFragment = createFiberFromFragment(
      fallbackChildren,
      mode,
      renderLanes,
      null
    );
  } else {
    primaryChildFragment = mountWorkInProgressOffscreenFiber(
      primaryChildProps,
      mode
    );
    fallbackChildFragment = createFiberFromFragment(
      fallbackChildren,
      mode,
      renderLanes,
      null
    );
  }

  primaryChildFragment.return = workInProgress;
  fallbackChildFragment.return = workInProgress;
  primaryChildFragment.sibling = fallbackChildFragment;
  workInProgress.child = primaryChildFragment;
  return fallbackChildFragment;
}

function mountWorkInProgressOffscreenFiber(offscreenProps, mode, renderLanes) {
  // The props argument to `createFiberFromOffscreen` is `any` typed, so we use
  // this wrapper function to constrain it.
  return createFiberFromOffscreen(offscreenProps, mode, NoLanes, null);
}

function updateWorkInProgressOffscreenFiber(current, offscreenProps) {
  // The props argument to `createWorkInProgress` is `any` typed, so we use this
  // wrapper function to constrain it.
  return createWorkInProgress(current, offscreenProps);
}

function updateSuspensePrimaryChildren(
  current,
  workInProgress,
  primaryChildren,
  renderLanes
) {
  var currentPrimaryChildFragment = current.child;
  var currentFallbackChildFragment = currentPrimaryChildFragment.sibling;
  var primaryChildFragment = updateWorkInProgressOffscreenFiber(
    currentPrimaryChildFragment,
    {
      mode: "visible",
      children: primaryChildren
    }
  );

  if ((workInProgress.mode & ConcurrentMode) === NoMode) {
    primaryChildFragment.lanes = renderLanes;
  }

  primaryChildFragment.return = workInProgress;
  primaryChildFragment.sibling = null;

  if (currentFallbackChildFragment !== null) {
    // Delete the fallback child fragment
    var deletions = workInProgress.deletions;

    if (deletions === null) {
      workInProgress.deletions = [currentFallbackChildFragment];
      workInProgress.flags |= ChildDeletion;
    } else {
      deletions.push(currentFallbackChildFragment);
    }
  }

  workInProgress.child = primaryChildFragment;
  return primaryChildFragment;
}

function updateSuspenseFallbackChildren(
  current,
  workInProgress,
  primaryChildren,
  fallbackChildren,
  renderLanes
) {
  var mode = workInProgress.mode;
  var currentPrimaryChildFragment = current.child;
  var currentFallbackChildFragment = currentPrimaryChildFragment.sibling;
  var primaryChildProps = {
    mode: "hidden",
    children: primaryChildren
  };
  var primaryChildFragment;

  if (
    // In legacy mode, we commit the primary tree as if it successfully
    // completed, even though it's in an inconsistent state.
    (mode & ConcurrentMode) === NoMode && // Make sure we're on the second pass, i.e. the primary child fragment was
    // already cloned. In legacy mode, the only case where this isn't true is
    // when DevTools forces us to display a fallback; we skip the first render
    // pass entirely and go straight to rendering the fallback. (In Concurrent
    // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
    // only codepath.)
    workInProgress.child !== currentPrimaryChildFragment
  ) {
    var progressedPrimaryFragment = workInProgress.child;
    primaryChildFragment = progressedPrimaryFragment;
    primaryChildFragment.childLanes = NoLanes;
    primaryChildFragment.pendingProps = primaryChildProps;

    if (workInProgress.mode & ProfileMode) {
      // Reset the durations from the first pass so they aren't included in the
      // final amounts. This seems counterintuitive, since we're intentionally
      // not measuring part of the render phase, but this makes it match what we
      // do in Concurrent Mode.
      primaryChildFragment.actualDuration = 0;
      primaryChildFragment.actualStartTime = -1;
      primaryChildFragment.selfBaseDuration =
        currentPrimaryChildFragment.selfBaseDuration;
      primaryChildFragment.treeBaseDuration =
        currentPrimaryChildFragment.treeBaseDuration;
    }

    if (enablePersistentOffscreenHostContainer && supportsPersistence) {
      // In persistent mode, the offscreen children are wrapped in a host node.
      // We need to complete it now, because we're going to skip over its normal
      // complete phase and go straight to rendering the fallback.
      var currentOffscreenContainer = currentPrimaryChildFragment.child;
      var offscreenContainer = primaryChildFragment.child;
      var containerProps = getOffscreenContainerProps();
      offscreenContainer.pendingProps = containerProps;
      offscreenContainer.memoizedProps = containerProps;
      completeSuspendedOffscreenHostContainer(
        currentOffscreenContainer,
        offscreenContainer
      );
    } // The fallback fiber was added as a deletion during the first pass.
    // However, since we're going to remain on the fallback, we no longer want
    // to delete it.

    workInProgress.deletions = null;
  } else {
    primaryChildFragment = updateWorkInProgressOffscreenFiber(
      currentPrimaryChildFragment,
      primaryChildProps
    );

    if (enablePersistentOffscreenHostContainer && supportsPersistence) {
      // In persistent mode, the offscreen children are wrapped in a host node.
      // We need to complete it now, because we're going to skip over its normal
      // complete phase and go straight to rendering the fallback.
      var _currentOffscreenContainer = currentPrimaryChildFragment.child;

      if (_currentOffscreenContainer !== null) {
        var _offscreenContainer = reconcileOffscreenHostContainer(
          currentPrimaryChildFragment,
          primaryChildFragment
        );

        _offscreenContainer.memoizedProps = _offscreenContainer.pendingProps;
        completeSuspendedOffscreenHostContainer(
          _currentOffscreenContainer,
          _offscreenContainer
        );
      }
    } // Since we're reusing a current tree, we need to reuse the flags, too.
    // (We don't do this in legacy mode, because in legacy mode we don't re-use
    // the current tree; see previous branch.)

    primaryChildFragment.subtreeFlags =
      currentPrimaryChildFragment.subtreeFlags & StaticMask;
  }

  var fallbackChildFragment;

  if (currentFallbackChildFragment !== null) {
    fallbackChildFragment = createWorkInProgress(
      currentFallbackChildFragment,
      fallbackChildren
    );
  } else {
    fallbackChildFragment = createFiberFromFragment(
      fallbackChildren,
      mode,
      renderLanes,
      null
    ); // Needs a placement effect because the parent (the Suspense boundary) already
    // mounted but this is a new fiber.

    fallbackChildFragment.flags |= Placement;
  }

  fallbackChildFragment.return = workInProgress;
  primaryChildFragment.return = workInProgress;
  primaryChildFragment.sibling = fallbackChildFragment;
  workInProgress.child = primaryChildFragment;
  return fallbackChildFragment;
}

function scheduleWorkOnFiber(fiber, renderLanes) {
  fiber.lanes = mergeLanes(fiber.lanes, renderLanes);
  var alternate = fiber.alternate;

  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, renderLanes);
  }

  scheduleWorkOnParentPath(fiber.return, renderLanes);
}

function propagateSuspenseContextChange(
  workInProgress,
  firstChild,
  renderLanes
) {
  // Mark any Suspense boundaries with fallbacks as having work to do.
  // If they were previously forced into fallbacks, they may now be able
  // to unblock.
  var node = firstChild;

  while (node !== null) {
    if (node.tag === SuspenseComponent) {
      var state = node.memoizedState;

      if (state !== null) {
        scheduleWorkOnFiber(node, renderLanes);
      }
    } else if (node.tag === SuspenseListComponent) {
      // If the tail is hidden there might not be an Suspense boundaries
      // to schedule work on. In this case we have to schedule it on the
      // list itself.
      // We don't have to traverse to the children of the list since
      // the list will propagate the change when it rerenders.
      scheduleWorkOnFiber(node, renderLanes);
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === workInProgress) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function findLastContentRow(firstChild) {
  // This is going to find the last row among these children that is already
  // showing content on the screen, as opposed to being in fallback state or
  // new. If a row has multiple Suspense boundaries, any of them being in the
  // fallback state, counts as the whole row being in a fallback state.
  // Note that the "rows" will be workInProgress, but any nested children
  // will still be current since we haven't rendered them yet. The mounted
  // order may not be the same as the new order. We use the new order.
  var row = firstChild;
  var lastContentRow = null;

  while (row !== null) {
    var currentRow = row.alternate; // New rows can't be content rows.

    if (currentRow !== null && findFirstSuspended(currentRow) === null) {
      lastContentRow = row;
    }

    row = row.sibling;
  }

  return lastContentRow;
}

function validateRevealOrder(revealOrder) {
  {
    if (
      revealOrder !== undefined &&
      revealOrder !== "forwards" &&
      revealOrder !== "backwards" &&
      revealOrder !== "together" &&
      !didWarnAboutRevealOrder[revealOrder]
    ) {
      didWarnAboutRevealOrder[revealOrder] = true;

      if (typeof revealOrder === "string") {
        switch (revealOrder.toLowerCase()) {
          case "together":
          case "forwards":
          case "backwards": {
            error(
              '"%s" is not a valid value for revealOrder on <SuspenseList />. ' +
                'Use lowercase "%s" instead.',
              revealOrder,
              revealOrder.toLowerCase()
            );

            break;
          }

          case "forward":
          case "backward": {
            error(
              '"%s" is not a valid value for revealOrder on <SuspenseList />. ' +
                'React uses the -s suffix in the spelling. Use "%ss" instead.',
              revealOrder,
              revealOrder.toLowerCase()
            );

            break;
          }

          default:
            error(
              '"%s" is not a supported revealOrder on <SuspenseList />. ' +
                'Did you mean "together", "forwards" or "backwards"?',
              revealOrder
            );

            break;
        }
      } else {
        error(
          "%s is not a supported value for revealOrder on <SuspenseList />. " +
            'Did you mean "together", "forwards" or "backwards"?',
          revealOrder
        );
      }
    }
  }
}

function validateTailOptions(tailMode, revealOrder) {
  {
    if (tailMode !== undefined && !didWarnAboutTailOptions[tailMode]) {
      if (tailMode !== "collapsed" && tailMode !== "hidden") {
        didWarnAboutTailOptions[tailMode] = true;

        error(
          '"%s" is not a supported value for tail on <SuspenseList />. ' +
            'Did you mean "collapsed" or "hidden"?',
          tailMode
        );
      } else if (revealOrder !== "forwards" && revealOrder !== "backwards") {
        didWarnAboutTailOptions[tailMode] = true;

        error(
          '<SuspenseList tail="%s" /> is only valid if revealOrder is ' +
            '"forwards" or "backwards". ' +
            'Did you mean to specify revealOrder="forwards"?',
          tailMode
        );
      }
    }
  }
}

function validateSuspenseListNestedChild(childSlot, index) {
  {
    var isAnArray = isArray(childSlot);
    var isIterable =
      !isAnArray && typeof getIteratorFn(childSlot) === "function";

    if (isAnArray || isIterable) {
      var type = isAnArray ? "array" : "iterable";

      error(
        "A nested %s was passed to row #%s in <SuspenseList />. Wrap it in " +
          "an additional SuspenseList to configure its revealOrder: " +
          "<SuspenseList revealOrder=...> ... " +
          "<SuspenseList revealOrder=...>{%s}</SuspenseList> ... " +
          "</SuspenseList>",
        type,
        index,
        type
      );

      return false;
    }
  }

  return true;
}

function validateSuspenseListChildren(children, revealOrder) {
  {
    if (
      (revealOrder === "forwards" || revealOrder === "backwards") &&
      children !== undefined &&
      children !== null &&
      children !== false
    ) {
      if (isArray(children)) {
        for (var i = 0; i < children.length; i++) {
          if (!validateSuspenseListNestedChild(children[i], i)) {
            return;
          }
        }
      } else {
        var iteratorFn = getIteratorFn(children);

        if (typeof iteratorFn === "function") {
          var childrenIterator = iteratorFn.call(children);

          if (childrenIterator) {
            var step = childrenIterator.next();
            var _i = 0;

            for (; !step.done; step = childrenIterator.next()) {
              if (!validateSuspenseListNestedChild(step.value, _i)) {
                return;
              }

              _i++;
            }
          }
        } else {
          error(
            'A single row was passed to a <SuspenseList revealOrder="%s" />. ' +
              "This is not useful since it needs multiple rows. " +
              "Did you mean to pass multiple children or an array?",
            revealOrder
          );
        }
      }
    }
  }
}

function initSuspenseListRenderState(
  workInProgress,
  isBackwards,
  tail,
  lastContentRow,
  tailMode
) {
  var renderState = workInProgress.memoizedState;

  if (renderState === null) {
    workInProgress.memoizedState = {
      isBackwards: isBackwards,
      rendering: null,
      renderingStartTime: 0,
      last: lastContentRow,
      tail: tail,
      tailMode: tailMode
    };
  } else {
    // We can reuse the existing object from previous renders.
    renderState.isBackwards = isBackwards;
    renderState.rendering = null;
    renderState.renderingStartTime = 0;
    renderState.last = lastContentRow;
    renderState.tail = tail;
    renderState.tailMode = tailMode;
  }
} // This can end up rendering this component multiple passes.
// The first pass splits the children fibers into two sets. A head and tail.
// We first render the head. If anything is in fallback state, we do another
// pass through beginWork to rerender all children (including the tail) with
// the force suspend context. If the first render didn't have anything in
// in fallback state. Then we render each row in the tail one-by-one.
// That happens in the completeWork phase without going back to beginWork.

function updateSuspenseListComponent(current, workInProgress, renderLanes) {
  var nextProps = workInProgress.pendingProps;
  var revealOrder = nextProps.revealOrder;
  var tailMode = nextProps.tail;
  var newChildren = nextProps.children;
  validateRevealOrder(revealOrder);
  validateTailOptions(tailMode, revealOrder);
  validateSuspenseListChildren(newChildren, revealOrder);
  reconcileChildren(current, workInProgress, newChildren, renderLanes);
  var suspenseContext = suspenseStackCursor.current;
  var shouldForceFallback = hasSuspenseContext(
    suspenseContext,
    ForceSuspenseFallback
  );

  if (shouldForceFallback) {
    suspenseContext = setShallowSuspenseContext(
      suspenseContext,
      ForceSuspenseFallback
    );
    workInProgress.flags |= DidCapture;
  } else {
    var didSuspendBefore =
      current !== null && (current.flags & DidCapture) !== NoFlags;

    if (didSuspendBefore) {
      // If we previously forced a fallback, we need to schedule work
      // on any nested boundaries to let them know to try to render
      // again. This is the same as context updating.
      propagateSuspenseContextChange(
        workInProgress,
        workInProgress.child,
        renderLanes
      );
    }

    suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
  }

  pushSuspenseContext(workInProgress, suspenseContext);

  if ((workInProgress.mode & ConcurrentMode) === NoMode) {
    // In legacy mode, SuspenseList doesn't work so we just
    // use make it a noop by treating it as the default revealOrder.
    workInProgress.memoizedState = null;
  } else {
    switch (revealOrder) {
      case "forwards": {
        var lastContentRow = findLastContentRow(workInProgress.child);
        var tail;

        if (lastContentRow === null) {
          // The whole list is part of the tail.
          // TODO: We could fast path by just rendering the tail now.
          tail = workInProgress.child;
          workInProgress.child = null;
        } else {
          // Disconnect the tail rows after the content row.
          // We're going to render them separately later.
          tail = lastContentRow.sibling;
          lastContentRow.sibling = null;
        }

        initSuspenseListRenderState(
          workInProgress,
          false, // isBackwards
          tail,
          lastContentRow,
          tailMode
        );
        break;
      }

      case "backwards": {
        // We're going to find the first row that has existing content.
        // At the same time we're going to reverse the list of everything
        // we pass in the meantime. That's going to be our tail in reverse
        // order.
        var _tail = null;
        var row = workInProgress.child;
        workInProgress.child = null;

        while (row !== null) {
          var currentRow = row.alternate; // New rows can't be content rows.

          if (currentRow !== null && findFirstSuspended(currentRow) === null) {
            // This is the beginning of the main content.
            workInProgress.child = row;
            break;
          }

          var nextRow = row.sibling;
          row.sibling = _tail;
          _tail = row;
          row = nextRow;
        } // TODO: If workInProgress.child is null, we can continue on the tail immediately.

        initSuspenseListRenderState(
          workInProgress,
          true, // isBackwards
          _tail,
          null, // last
          tailMode
        );
        break;
      }

      case "together": {
        initSuspenseListRenderState(
          workInProgress,
          false, // isBackwards
          null, // tail
          null, // last
          undefined
        );
        break;
      }

      default: {
        // The default reveal order is the same as not having
        // a boundary.
        workInProgress.memoizedState = null;
      }
    }
  }

  return workInProgress.child;
}

function updatePortalComponent(current, workInProgress, renderLanes) {
  pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
  var nextChildren = workInProgress.pendingProps;

  if (current === null) {
    // Portals are special because we don't append the children during mount
    // but at commit. Therefore we need to track insertions which the normal
    // flow doesn't do during mount. This doesn't happen at the root because
    // the root always starts with a "current" with a null child.
    // TODO: Consider unifying this with how the root works.
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    );
  } else {
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  }

  return workInProgress.child;
}

var hasWarnedAboutUsingNoValuePropOnContextProvider = false;

function updateContextProvider(current, workInProgress, renderLanes) {
  var providerType = workInProgress.type;
  var context = providerType._context;
  var newProps = workInProgress.pendingProps;
  var oldProps = workInProgress.memoizedProps;
  var newValue = newProps.value;

  {
    if (!("value" in newProps)) {
      if (!hasWarnedAboutUsingNoValuePropOnContextProvider) {
        hasWarnedAboutUsingNoValuePropOnContextProvider = true;

        error(
          "The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"
        );
      }
    }

    var providerPropTypes = workInProgress.type.propTypes;

    if (providerPropTypes) {
      checkPropTypes(providerPropTypes, newProps, "prop", "Context.Provider");
    }
  }

  pushProvider(workInProgress, context, newValue);

  {
    if (oldProps !== null) {
      var oldValue = oldProps.value;

      if (objectIs(oldValue, newValue)) {
        // No change. Bailout early if children are the same.
        if (oldProps.children === newProps.children && !hasContextChanged()) {
          return bailoutOnAlreadyFinishedWork(
            current,
            workInProgress,
            renderLanes
          );
        }
      } else {
        // The context value changed. Search for matching consumers and schedule
        // them to update.
        propagateContextChange(workInProgress, context, renderLanes);
      }
    }
  }

  var newChildren = newProps.children;
  reconcileChildren(current, workInProgress, newChildren, renderLanes);
  return workInProgress.child;
}

var hasWarnedAboutUsingContextAsConsumer = false;

function updateContextConsumer(current, workInProgress, renderLanes) {
  var context = workInProgress.type; // The logic below for Context differs depending on PROD or DEV mode. In
  // DEV mode, we create a separate object for Context.Consumer that acts
  // like a proxy to Context. This proxy object adds unnecessary code in PROD
  // so we use the old behaviour (Context.Consumer references Context) to
  // reduce size and overhead. The separate object references context via
  // a property called "_context", which also gives us the ability to check
  // in DEV mode if this property exists or not and warn if it does not.

  {
    if (context._context === undefined) {
      // This may be because it's a Context (rather than a Consumer).
      // Or it may be because it's older React where they're the same thing.
      // We only want to warn if we're sure it's a new React.
      if (context !== context.Consumer) {
        if (!hasWarnedAboutUsingContextAsConsumer) {
          hasWarnedAboutUsingContextAsConsumer = true;

          error(
            "Rendering <Context> directly is not supported and will be removed in " +
              "a future major release. Did you mean to render <Context.Consumer> instead?"
          );
        }
      }
    } else {
      context = context._context;
    }
  }

  var newProps = workInProgress.pendingProps;
  var render = newProps.children;

  {
    if (typeof render !== "function") {
      error(
        "A context consumer was rendered with multiple children, or a child " +
          "that isn't a function. A context consumer expects a single child " +
          "that is a function. If you did pass a function, make sure there " +
          "is no trailing or leading whitespace around it."
      );
    }
  }

  prepareToReadContext(workInProgress, renderLanes);
  var newValue = readContext(context);

  var newChildren;

  {
    ReactCurrentOwner$1.current = workInProgress;
    setIsRendering(true);
    newChildren = render(newValue);
    setIsRendering(false);
  }

  workInProgress.flags |= PerformedWork;
  reconcileChildren(current, workInProgress, newChildren, renderLanes);
  return workInProgress.child;
}

function markWorkInProgressReceivedUpdate() {
  didReceiveUpdate = true;
}

function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
  if (current !== null) {
    // Reuse previous dependencies
    workInProgress.dependencies = current.dependencies;
  }

  {
    // Don't update "base" render times for bailouts.
    stopProfilerTimerIfRunning();
  }

  markSkippedUpdateLanes(workInProgress.lanes); // Check if the children have any pending work.

  if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
    // The children don't have any work either. We can skip them.
    // TODO: Once we add back resuming, we should check if the children are
    // a work-in-progress set. If so, we need to transfer their effects.
    {
      return null;
    }
  } // This fiber doesn't have work, but its subtree does. Clone the child
  // fibers and continue.

  cloneChildFibers(current, workInProgress);
  return workInProgress.child;
}

function remountFiber(current, oldWorkInProgress, newWorkInProgress) {
  {
    var returnFiber = oldWorkInProgress.return;

    if (returnFiber === null) {
      throw new Error("Cannot swap the root fiber.");
    } // Disconnect from the old current.
    // It will get deleted.

    current.alternate = null;
    oldWorkInProgress.alternate = null; // Connect to the new tree.

    newWorkInProgress.index = oldWorkInProgress.index;
    newWorkInProgress.sibling = oldWorkInProgress.sibling;
    newWorkInProgress.return = oldWorkInProgress.return;
    newWorkInProgress.ref = oldWorkInProgress.ref; // Replace the child/sibling pointers above it.

    if (oldWorkInProgress === returnFiber.child) {
      returnFiber.child = newWorkInProgress;
    } else {
      var prevSibling = returnFiber.child;

      if (prevSibling === null) {
        throw new Error("Expected parent to have a child.");
      }

      while (prevSibling.sibling !== oldWorkInProgress) {
        prevSibling = prevSibling.sibling;

        if (prevSibling === null) {
          throw new Error("Expected to find the previous sibling.");
        }
      }

      prevSibling.sibling = newWorkInProgress;
    } // Delete the old fiber and place the new one.
    // Since the old fiber is disconnected, we have to schedule it manually.

    var deletions = returnFiber.deletions;

    if (deletions === null) {
      returnFiber.deletions = [current];
      returnFiber.flags |= ChildDeletion;
    } else {
      deletions.push(current);
    }

    newWorkInProgress.flags |= Placement; // Restart work from the new fiber.

    return newWorkInProgress;
  }
}

function checkScheduledUpdateOrContext(current, renderLanes) {
  // Before performing an early bailout, we must check if there are pending
  // updates or context.
  var updateLanes = current.lanes;

  if (includesSomeLane(updateLanes, renderLanes)) {
    return true;
  } // No pending update, but because context is propagated lazily, we need

  return false;
}

function attemptEarlyBailoutIfNoScheduledUpdate(
  current,
  workInProgress,
  renderLanes
) {
  // This fiber does not have any pending work. Bailout without entering
  // the begin phase. There's still some bookkeeping we that needs to be done
  // in this optimized path, mostly pushing stuff onto the stack.
  switch (workInProgress.tag) {
    case HostRoot:
      pushHostRootContext(workInProgress);
      break;

    case HostComponent:
      pushHostContext(workInProgress);
      break;

    case ClassComponent: {
      var Component = workInProgress.type;

      if (isContextProvider(Component)) {
        pushContextProvider(workInProgress);
      }

      break;
    }

    case HostPortal:
      pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
      break;

    case ContextProvider: {
      var newValue = workInProgress.memoizedProps.value;
      var context = workInProgress.type._context;
      pushProvider(workInProgress, context, newValue);
      break;
    }

    case Profiler:
      {
        // Profiler should only call onRender when one of its descendants actually rendered.
        var hasChildWork = includesSomeLane(
          renderLanes,
          workInProgress.childLanes
        );

        if (hasChildWork) {
          workInProgress.flags |= Update;
        }

        {
          // Reset effect durations for the next eventual effect phase.
          // These are reset during render to allow the DevTools commit hook a chance to read them,
          var stateNode = workInProgress.stateNode;
          stateNode.effectDuration = 0;
          stateNode.passiveEffectDuration = 0;
        }
      }

      break;

    case SuspenseComponent: {
      var state = workInProgress.memoizedState;

      if (state !== null) {
        // whether to retry the primary children, or to skip over it and
        // go straight to the fallback. Check the priority of the primary
        // child fragment.

        var primaryChildFragment = workInProgress.child;
        var primaryChildLanes = primaryChildFragment.childLanes;

        if (includesSomeLane(renderLanes, primaryChildLanes)) {
          // The primary children have pending work. Use the normal path
          // to attempt to render the primary children again.
          return updateSuspenseComponent(current, workInProgress, renderLanes);
        } else {
          // The primary child fragment does not have pending work marked
          // on it
          pushSuspenseContext(
            workInProgress,
            setDefaultShallowSuspenseContext(suspenseStackCursor.current)
          ); // The primary children do not have pending work with sufficient
          // priority. Bailout.

          var child = bailoutOnAlreadyFinishedWork(
            current,
            workInProgress,
            renderLanes
          );

          if (child !== null) {
            // The fallback children have pending work. Skip over the
            // primary children and work on the fallback.
            return child.sibling;
          } else {
            // Note: We can return `null` here because we already checked
            // whether there were nested context consumers, via the call to
            // `bailoutOnAlreadyFinishedWork` above.
            return null;
          }
        }
      } else {
        pushSuspenseContext(
          workInProgress,
          setDefaultShallowSuspenseContext(suspenseStackCursor.current)
        );
      }

      break;
    }

    case SuspenseListComponent: {
      var didSuspendBefore = (current.flags & DidCapture) !== NoFlags;

      var _hasChildWork = includesSomeLane(
        renderLanes,
        workInProgress.childLanes
      );

      if (didSuspendBefore) {
        if (_hasChildWork) {
          // If something was in fallback state last time, and we have all the
          // same children then we're still in progressive loading state.
          // Something might get unblocked by state updates or retries in the
          // tree which will affect the tail. So we need to use the normal
          // path to compute the correct tail.
          return updateSuspenseListComponent(
            current,
            workInProgress,
            renderLanes
          );
        } // If none of the children had any work, that means that none of
        // them got retried so they'll still be blocked in the same way
        // as before. We can fast bail out.

        workInProgress.flags |= DidCapture;
      } // If nothing suspended before and we're rendering the same children,
      // then the tail doesn't matter. Anything new that suspends will work
      // in the "together" mode, so we can continue from the state we had.

      var renderState = workInProgress.memoizedState;

      if (renderState !== null) {
        // Reset to the "together" mode in case we've started a different
        // update in the past but didn't complete it.
        renderState.rendering = null;
        renderState.tail = null;
        renderState.lastEffect = null;
      }

      pushSuspenseContext(workInProgress, suspenseStackCursor.current);

      if (_hasChildWork) {
        break;
      } else {
        // If none of the children had any work, that means that none of
        // them got retried so they'll still be blocked in the same way
        // as before. We can fast bail out.
        return null;
      }
    }

    case OffscreenComponent:
    case LegacyHiddenComponent: {
      // Need to check if the tree still needs to be deferred. This is
      // almost identical to the logic used in the normal update path,
      // so we'll just enter that. The only difference is we'll bail out
      // at the next level instead of this one, because the child props
      // have not changed. Which is fine.
      // TODO: Probably should refactor `beginWork` to split the bailout
      // path from the normal path. I'm tempted to do a labeled break here
      // but I won't :)
      workInProgress.lanes = NoLanes;
      return updateOffscreenComponent(current, workInProgress, renderLanes);
    }
  }

  return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
}

function beginWork(current, workInProgress, renderLanes) {
  {
    if (workInProgress._debugNeedsRemount && current !== null) {
      // This will restart the begin phase with a new fiber.
      return remountFiber(
        current,
        workInProgress,
        createFiberFromTypeAndProps(
          workInProgress.type,
          workInProgress.key,
          workInProgress.pendingProps,
          workInProgress._debugOwner || null,
          workInProgress.mode,
          workInProgress.lanes
        )
      );
    }
  }

  if (current !== null) {
    var oldProps = current.memoizedProps;
    var newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps ||
      hasContextChanged() || // Force a re-render if the implementation changed due to hot reload:
      workInProgress.type !== current.type
    ) {
      // If props or context changed, mark the fiber as having performed work.
      // This may be unset if the props are determined to be equal later (memo).
      didReceiveUpdate = true;
    } else {
      // Neither props nor legacy context changes. Check if there's a pending
      // update or context change.
      var hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(
        current,
        renderLanes
      );

      if (
        !hasScheduledUpdateOrContext && // If this is the second pass of an error or suspense boundary, there
        // may not be work scheduled on `current`, so we check for this flag.
        (workInProgress.flags & DidCapture) === NoFlags
      ) {
        // No pending updates or context. Bail out now.
        didReceiveUpdate = false;
        return attemptEarlyBailoutIfNoScheduledUpdate(
          current,
          workInProgress,
          renderLanes
        );
      }

      if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
        // This is a special case that only exists for legacy mode.
        // See https://github.com/facebook/react/pull/19216.
        didReceiveUpdate = true;
      } else {
        // An update was scheduled on this fiber, but there are no new props
        // nor legacy context. Set this to false. If an update queue or context
        // consumer produces a changed value, it will set this to true. Otherwise,
        // the component will assume the children have not changed and bail out.
        didReceiveUpdate = false;
      }
    }
  } else {
    didReceiveUpdate = false;
  } // Before entering the begin phase, clear pending update priority.
  // TODO: This assumes that we're about to evaluate the component and process
  // the update queue. However, there's an exception: SimpleMemoComponent
  // sometimes bails out later in the begin phase. This indicates that we should
  // move this assignment out of the common path and into each branch.

  workInProgress.lanes = NoLanes;

  switch (workInProgress.tag) {
    case IndeterminateComponent: {
      return mountIndeterminateComponent(
        current,
        workInProgress,
        workInProgress.type,
        renderLanes
      );
    }

    case LazyComponent: {
      var elementType = workInProgress.elementType;
      return mountLazyComponent(
        current,
        workInProgress,
        elementType,
        renderLanes
      );
    }

    case FunctionComponent: {
      var Component = workInProgress.type;
      var unresolvedProps = workInProgress.pendingProps;
      var resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes
      );
    }

    case ClassComponent: {
      var _Component = workInProgress.type;
      var _unresolvedProps = workInProgress.pendingProps;

      var _resolvedProps =
        workInProgress.elementType === _Component
          ? _unresolvedProps
          : resolveDefaultProps(_Component, _unresolvedProps);

      return updateClassComponent(
        current,
        workInProgress,
        _Component,
        _resolvedProps,
        renderLanes
      );
    }

    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes);

    case HostComponent:
      return updateHostComponent$1(current, workInProgress, renderLanes);

    case HostText:
      return updateHostText$1();

    case SuspenseComponent:
      return updateSuspenseComponent(current, workInProgress, renderLanes);

    case HostPortal:
      return updatePortalComponent(current, workInProgress, renderLanes);

    case ForwardRef: {
      var type = workInProgress.type;
      var _unresolvedProps2 = workInProgress.pendingProps;

      var _resolvedProps2 =
        workInProgress.elementType === type
          ? _unresolvedProps2
          : resolveDefaultProps(type, _unresolvedProps2);

      return updateForwardRef(
        current,
        workInProgress,
        type,
        _resolvedProps2,
        renderLanes
      );
    }

    case Fragment:
      return updateFragment(current, workInProgress, renderLanes);

    case Mode:
      return updateMode(current, workInProgress, renderLanes);

    case Profiler:
      return updateProfiler(current, workInProgress, renderLanes);

    case ContextProvider:
      return updateContextProvider(current, workInProgress, renderLanes);

    case ContextConsumer:
      return updateContextConsumer(current, workInProgress, renderLanes);

    case MemoComponent: {
      var _type2 = workInProgress.type;
      var _unresolvedProps3 = workInProgress.pendingProps; // Resolve outer props first, then resolve inner props.

      var _resolvedProps3 = resolveDefaultProps(_type2, _unresolvedProps3);

      {
        if (workInProgress.type !== workInProgress.elementType) {
          var outerPropTypes = _type2.propTypes;

          if (outerPropTypes) {
            checkPropTypes(
              outerPropTypes,
              _resolvedProps3, // Resolved for outer only
              "prop",
              getComponentNameFromType(_type2)
            );
          }
        }
      }

      _resolvedProps3 = resolveDefaultProps(_type2.type, _resolvedProps3);
      return updateMemoComponent(
        current,
        workInProgress,
        _type2,
        _resolvedProps3,
        renderLanes
      );
    }

    case SimpleMemoComponent: {
      return updateSimpleMemoComponent(
        current,
        workInProgress,
        workInProgress.type,
        workInProgress.pendingProps,
        renderLanes
      );
    }

    case IncompleteClassComponent: {
      var _Component2 = workInProgress.type;
      var _unresolvedProps4 = workInProgress.pendingProps;

      var _resolvedProps4 =
        workInProgress.elementType === _Component2
          ? _unresolvedProps4
          : resolveDefaultProps(_Component2, _unresolvedProps4);

      return mountIncompleteClassComponent(
        current,
        workInProgress,
        _Component2,
        _resolvedProps4,
        renderLanes
      );
    }

    case SuspenseListComponent: {
      return updateSuspenseListComponent(current, workInProgress, renderLanes);
    }

    case ScopeComponent: {
      break;
    }

    case OffscreenComponent: {
      return updateOffscreenComponent(current, workInProgress, renderLanes);
    }

    case LegacyHiddenComponent: {
      return updateLegacyHiddenComponent(current, workInProgress, renderLanes);
    }
  }

  {
    throw Error(
      "Unknown unit of work tag (" +
        workInProgress.tag +
        "). This error is likely caused by a bug in React. Please file an issue."
    );
  }
}

function unwindWork(workInProgress, renderLanes) {
  switch (workInProgress.tag) {
    case ClassComponent: {
      var Component = workInProgress.type;

      if (isContextProvider(Component)) {
        popContext(workInProgress);
      }

      var flags = workInProgress.flags;

      if (flags & ShouldCapture) {
        workInProgress.flags = (flags & ~ShouldCapture) | DidCapture;

        if ((workInProgress.mode & ProfileMode) !== NoMode) {
          transferActualDuration(workInProgress);
        }

        return workInProgress;
      }

      return null;
    }

    case HostRoot: {
      popHostContainer(workInProgress);
      popTopLevelContextObject(workInProgress);
      resetWorkInProgressVersions();
      var _flags = workInProgress.flags;

      if (!((_flags & DidCapture) === NoFlags)) {
        throw Error(
          "The root failed to unmount after an error. This is likely a bug in React. Please file an issue."
        );
      }

      workInProgress.flags = (_flags & ~ShouldCapture) | DidCapture;
      return workInProgress;
    }

    case HostComponent: {
      // TODO: popHydrationState
      popHostContext(workInProgress);
      return null;
    }

    case SuspenseComponent: {
      popSuspenseContext(workInProgress);

      var _flags2 = workInProgress.flags;

      if (_flags2 & ShouldCapture) {
        workInProgress.flags = (_flags2 & ~ShouldCapture) | DidCapture; // Captured a suspense effect. Re-render the boundary.

        if ((workInProgress.mode & ProfileMode) !== NoMode) {
          transferActualDuration(workInProgress);
        }

        return workInProgress;
      }

      return null;
    }

    case SuspenseListComponent: {
      popSuspenseContext(workInProgress); // SuspenseList doesn't actually catch anything. It should've been
      // caught by a nested boundary. If not, it should bubble through.

      return null;
    }

    case HostPortal:
      popHostContainer(workInProgress);
      return null;

    case ContextProvider:
      var context = workInProgress.type._context;
      popProvider(context, workInProgress);
      return null;

    case OffscreenComponent:
    case LegacyHiddenComponent:
      popRenderLanes(workInProgress);

      return null;

    case CacheComponent:
      return null;

    default:
      return null;
  }
}

function unwindInterruptedWork(interruptedWork, renderLanes) {
  switch (interruptedWork.tag) {
    case ClassComponent: {
      var childContextTypes = interruptedWork.type.childContextTypes;

      if (childContextTypes !== null && childContextTypes !== undefined) {
        popContext(interruptedWork);
      }

      break;
    }

    case HostRoot: {
      popHostContainer(interruptedWork);
      popTopLevelContextObject(interruptedWork);
      resetWorkInProgressVersions();
      break;
    }

    case HostComponent: {
      popHostContext(interruptedWork);
      break;
    }

    case HostPortal:
      popHostContainer(interruptedWork);
      break;

    case SuspenseComponent:
      popSuspenseContext(interruptedWork);
      break;

    case SuspenseListComponent:
      popSuspenseContext(interruptedWork);
      break;

    case ContextProvider:
      var context = interruptedWork.type._context;
      popProvider(context, interruptedWork);
      break;

    case OffscreenComponent:
    case LegacyHiddenComponent:
      popRenderLanes(interruptedWork);

      break;
  }
}

var didWarnAboutUndefinedSnapshotBeforeUpdate = null;

{
  didWarnAboutUndefinedSnapshotBeforeUpdate = new Set();
} // Used during the commit phase to track the state of the Offscreen component stack.
var PossiblyWeakSet = typeof WeakSet === "function" ? WeakSet : Set;
var nextEffect = null; // Used for Profiling builds to track updaters.

var inProgressLanes = null;
var inProgressRoot = null;

function reportUncaughtErrorInDEV(error) {
  // Wrapping each small part of the commit phase into a guarded
  // callback is a bit too slow (https://github.com/facebook/react/pull/21666).
  // But we rely on it to surface errors to DEV tools like overlays
  // (https://github.com/facebook/react/issues/21712).
  // As a compromise, rethrow only caught errors in a guard.
  {
    invokeGuardedCallback(null, function() {
      throw error;
    });
    clearCaughtError();
  }
}

var callComponentWillUnmountWithTimer = function(current, instance) {
  instance.props = current.memoizedProps;
  instance.state = current.memoizedState;

  if (current.mode & ProfileMode) {
    try {
      startLayoutEffectTimer();
      instance.componentWillUnmount();
    } finally {
      recordLayoutEffectDuration(current);
    }
  } else {
    instance.componentWillUnmount();
  }
}; // Capture errors so they don't interrupt mounting.

function safelyCallComponentWillUnmount(
  current,
  nearestMountedAncestor,
  instance
) {
  try {
    callComponentWillUnmountWithTimer(current, instance);
  } catch (error) {
    reportUncaughtErrorInDEV(error);
    captureCommitPhaseError(current, nearestMountedAncestor, error);
  }
} // Capture errors so they don't interrupt mounting.

function safelyDetachRef(current, nearestMountedAncestor) {
  var ref = current.ref;

  if (ref !== null) {
    if (typeof ref === "function") {
      try {
        if (
          enableProfilerTimer &&
          enableProfilerCommitHooks &&
          current.mode & ProfileMode
        ) {
          try {
            startLayoutEffectTimer();
            ref(null);
          } finally {
            recordLayoutEffectDuration(current);
          }
        } else {
          ref(null);
        }
      } catch (error) {
        reportUncaughtErrorInDEV(error);
        captureCommitPhaseError(current, nearestMountedAncestor, error);
      }
    } else {
      ref.current = null;
    }
  }
}

function safelyCallDestroy(current, nearestMountedAncestor, destroy) {
  try {
    destroy();
  } catch (error) {
    reportUncaughtErrorInDEV(error);
    captureCommitPhaseError(current, nearestMountedAncestor, error);
  }
}

var focusedInstanceHandle = null;
var shouldFireAfterActiveInstanceBlur = false;
function commitBeforeMutationEffects(root, firstChild) {
  focusedInstanceHandle = prepareForCommit(root.containerInfo);
  nextEffect = firstChild;
  commitBeforeMutationEffects_begin(); // We no longer need to track the active instance fiber

  var shouldFire = shouldFireAfterActiveInstanceBlur;
  shouldFireAfterActiveInstanceBlur = false;
  focusedInstanceHandle = null;
  return shouldFire;
}

function commitBeforeMutationEffects_begin() {
  while (nextEffect !== null) {
    var fiber = nextEffect; // This phase is only used for beforeActiveInstanceBlur.

    var child = fiber.child;

    if (
      (fiber.subtreeFlags & BeforeMutationMask) !== NoFlags &&
      child !== null
    ) {
      ensureCorrectReturnPointer(child, fiber);
      nextEffect = child;
    } else {
      commitBeforeMutationEffects_complete();
    }
  }
}

function commitBeforeMutationEffects_complete() {
  while (nextEffect !== null) {
    var fiber = nextEffect;
    setCurrentFiber(fiber);

    try {
      commitBeforeMutationEffectsOnFiber(fiber);
    } catch (error) {
      reportUncaughtErrorInDEV(error);
      captureCommitPhaseError(fiber, fiber.return, error);
    }

    resetCurrentFiber();
    var sibling = fiber.sibling;

    if (sibling !== null) {
      ensureCorrectReturnPointer(sibling, fiber.return);
      nextEffect = sibling;
      return;
    }

    nextEffect = fiber.return;
  }
}

function commitBeforeMutationEffectsOnFiber(finishedWork) {
  var current = finishedWork.alternate;
  var flags = finishedWork.flags;

  if ((flags & Snapshot) !== NoFlags) {
    setCurrentFiber(finishedWork);

    switch (finishedWork.tag) {
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent: {
        break;
      }

      case ClassComponent: {
        if (current !== null) {
          var prevProps = current.memoizedProps;
          var prevState = current.memoizedState;
          var instance = finishedWork.stateNode; // We could update instance props and state here,
          // but instead we rely on them being set during last render.
          // TODO: revisit this when we implement resuming.

          {
            if (
              finishedWork.type === finishedWork.elementType &&
              !didWarnAboutReassigningProps
            ) {
              if (instance.props !== finishedWork.memoizedProps) {
                error(
                  "Expected %s props to match memoized props before " +
                    "getSnapshotBeforeUpdate. " +
                    "This might either be because of a bug in React, or because " +
                    "a component reassigns its own `this.props`. " +
                    "Please file an issue.",
                  getComponentNameFromFiber(finishedWork) || "instance"
                );
              }

              if (instance.state !== finishedWork.memoizedState) {
                error(
                  "Expected %s state to match memoized state before " +
                    "getSnapshotBeforeUpdate. " +
                    "This might either be because of a bug in React, or because " +
                    "a component reassigns its own `this.state`. " +
                    "Please file an issue.",
                  getComponentNameFromFiber(finishedWork) || "instance"
                );
              }
            }
          }

          var snapshot = instance.getSnapshotBeforeUpdate(
            finishedWork.elementType === finishedWork.type
              ? prevProps
              : resolveDefaultProps(finishedWork.type, prevProps),
            prevState
          );

          {
            var didWarnSet = didWarnAboutUndefinedSnapshotBeforeUpdate;

            if (snapshot === undefined && !didWarnSet.has(finishedWork.type)) {
              didWarnSet.add(finishedWork.type);

              error(
                "%s.getSnapshotBeforeUpdate(): A snapshot value (or null) " +
                  "must be returned. You have returned undefined.",
                getComponentNameFromFiber(finishedWork)
              );
            }
          }

          instance.__reactInternalSnapshotBeforeUpdate = snapshot;
        }

        break;
      }

      case HostRoot: {
        {
          var root = finishedWork.stateNode;
          clearContainer(root.containerInfo);
        }

        break;
      }

      case HostComponent:
      case HostText:
      case HostPortal:
      case IncompleteClassComponent:
        // Nothing to do for these component types
        break;

      default: {
        {
          throw Error(
            "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue."
          );
        }
      }
    }

    resetCurrentFiber();
  }
}

function commitHookEffectListUnmount(
  flags,
  finishedWork,
  nearestMountedAncestor
) {
  var updateQueue = finishedWork.updateQueue;
  var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

  if (lastEffect !== null) {
    var firstEffect = lastEffect.next;
    var effect = firstEffect;

    do {
      if ((effect.tag & flags) === flags) {
        // Unmount
        var destroy = effect.destroy;
        effect.destroy = undefined;

        if (destroy !== undefined) {
          safelyCallDestroy(finishedWork, nearestMountedAncestor, destroy);
        }
      }

      effect = effect.next;
    } while (effect !== firstEffect);
  }
}

function commitHookEffectListMount(tag, finishedWork) {
  var updateQueue = finishedWork.updateQueue;
  var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

  if (lastEffect !== null) {
    var firstEffect = lastEffect.next;
    var effect = firstEffect;

    do {
      if ((effect.tag & tag) === tag) {
        // Mount
        var create = effect.create;
        effect.destroy = create();

        {
          var destroy = effect.destroy;

          if (destroy !== undefined && typeof destroy !== "function") {
            var addendum = void 0;

            if (destroy === null) {
              addendum =
                " You returned null. If your effect does not require clean " +
                "up, return undefined (or nothing).";
            } else if (typeof destroy.then === "function") {
              addendum =
                "\n\nIt looks like you wrote useEffect(async () => ...) or returned a Promise. " +
                "Instead, write the async function inside your effect " +
                "and call it immediately:\n\n" +
                "useEffect(() => {\n" +
                "  async function fetchData() {\n" +
                "    // You can await here\n" +
                "    const response = await MyAPI.getData(someId);\n" +
                "    // ...\n" +
                "  }\n" +
                "  fetchData();\n" +
                "}, [someId]); // Or [] if effect doesn't need props or state\n\n" +
                "Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching";
            } else {
              addendum = " You returned: " + destroy;
            }

            error(
              "An effect function must not return anything besides a function, " +
                "which is used for clean-up.%s",
              addendum
            );
          }
        }
      }

      effect = effect.next;
    } while (effect !== firstEffect);
  }
}

function commitPassiveEffectDurations(finishedRoot, finishedWork) {
  {
    // Only Profilers with work in their subtree will have an Update effect scheduled.
    if ((finishedWork.flags & Update) !== NoFlags) {
      switch (finishedWork.tag) {
        case Profiler: {
          var passiveEffectDuration =
            finishedWork.stateNode.passiveEffectDuration;
          var _finishedWork$memoize = finishedWork.memoizedProps,
            id = _finishedWork$memoize.id,
            onPostCommit = _finishedWork$memoize.onPostCommit; // This value will still reflect the previous commit phase.
          // It does not get reset until the start of the next commit phase.

          var commitTime = getCommitTime();
          var phase = finishedWork.alternate === null ? "mount" : "update";

          {
            if (isCurrentUpdateNested()) {
              phase = "nested-update";
            }
          }

          if (typeof onPostCommit === "function") {
            onPostCommit(id, phase, passiveEffectDuration, commitTime);
          } // Bubble times to the next nearest ancestor Profiler.
          // After we process that Profiler, we'll bubble further up.

          var parentFiber = finishedWork.return;

          outer: while (parentFiber !== null) {
            switch (parentFiber.tag) {
              case HostRoot:
                var root = parentFiber.stateNode;
                root.passiveEffectDuration += passiveEffectDuration;
                break outer;

              case Profiler:
                var parentStateNode = parentFiber.stateNode;
                parentStateNode.passiveEffectDuration += passiveEffectDuration;
                break outer;
            }

            parentFiber = parentFiber.return;
          }

          break;
        }
      }
    }
  }
}

function commitLayoutEffectOnFiber(
  finishedRoot,
  current,
  finishedWork,
  committedLanes
) {
  if ((finishedWork.flags & LayoutMask) !== NoFlags) {
    switch (finishedWork.tag) {
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent: {
        {
          // At this point layout effects have already been destroyed (during mutation phase).
          // This is done to prevent sibling component effects from interfering with each other,
          // e.g. a destroy function in one component should never override a ref set
          // by a create function in another component during the same commit.
          if (finishedWork.mode & ProfileMode) {
            try {
              startLayoutEffectTimer();
              commitHookEffectListMount(Layout | HasEffect, finishedWork);
            } finally {
              recordLayoutEffectDuration(finishedWork);
            }
          } else {
            commitHookEffectListMount(Layout | HasEffect, finishedWork);
          }
        }

        break;
      }

      case ClassComponent: {
        var instance = finishedWork.stateNode;

        if (finishedWork.flags & Update) {
          {
            if (current === null) {
              // We could update instance props and state here,
              // but instead we rely on them being set during last render.
              // TODO: revisit this when we implement resuming.
              {
                if (
                  finishedWork.type === finishedWork.elementType &&
                  !didWarnAboutReassigningProps
                ) {
                  if (instance.props !== finishedWork.memoizedProps) {
                    error(
                      "Expected %s props to match memoized props before " +
                        "componentDidMount. " +
                        "This might either be because of a bug in React, or because " +
                        "a component reassigns its own `this.props`. " +
                        "Please file an issue.",
                      getComponentNameFromFiber(finishedWork) || "instance"
                    );
                  }

                  if (instance.state !== finishedWork.memoizedState) {
                    error(
                      "Expected %s state to match memoized state before " +
                        "componentDidMount. " +
                        "This might either be because of a bug in React, or because " +
                        "a component reassigns its own `this.state`. " +
                        "Please file an issue.",
                      getComponentNameFromFiber(finishedWork) || "instance"
                    );
                  }
                }
              }

              if (finishedWork.mode & ProfileMode) {
                try {
                  startLayoutEffectTimer();
                  instance.componentDidMount();
                } finally {
                  recordLayoutEffectDuration(finishedWork);
                }
              } else {
                instance.componentDidMount();
              }
            } else {
              var prevProps =
                finishedWork.elementType === finishedWork.type
                  ? current.memoizedProps
                  : resolveDefaultProps(
                      finishedWork.type,
                      current.memoizedProps
                    );
              var prevState = current.memoizedState; // We could update instance props and state here,
              // but instead we rely on them being set during last render.
              // TODO: revisit this when we implement resuming.

              {
                if (
                  finishedWork.type === finishedWork.elementType &&
                  !didWarnAboutReassigningProps
                ) {
                  if (instance.props !== finishedWork.memoizedProps) {
                    error(
                      "Expected %s props to match memoized props before " +
                        "componentDidUpdate. " +
                        "This might either be because of a bug in React, or because " +
                        "a component reassigns its own `this.props`. " +
                        "Please file an issue.",
                      getComponentNameFromFiber(finishedWork) || "instance"
                    );
                  }

                  if (instance.state !== finishedWork.memoizedState) {
                    error(
                      "Expected %s state to match memoized state before " +
                        "componentDidUpdate. " +
                        "This might either be because of a bug in React, or because " +
                        "a component reassigns its own `this.state`. " +
                        "Please file an issue.",
                      getComponentNameFromFiber(finishedWork) || "instance"
                    );
                  }
                }
              }

              if (finishedWork.mode & ProfileMode) {
                try {
                  startLayoutEffectTimer();
                  instance.componentDidUpdate(
                    prevProps,
                    prevState,
                    instance.__reactInternalSnapshotBeforeUpdate
                  );
                } finally {
                  recordLayoutEffectDuration(finishedWork);
                }
              } else {
                instance.componentDidUpdate(
                  prevProps,
                  prevState,
                  instance.__reactInternalSnapshotBeforeUpdate
                );
              }
            }
          }
        } // TODO: I think this is now always non-null by the time it reaches the
        // commit phase. Consider removing the type check.

        var updateQueue = finishedWork.updateQueue;

        if (updateQueue !== null) {
          {
            if (
              finishedWork.type === finishedWork.elementType &&
              !didWarnAboutReassigningProps
            ) {
              if (instance.props !== finishedWork.memoizedProps) {
                error(
                  "Expected %s props to match memoized props before " +
                    "processing the update queue. " +
                    "This might either be because of a bug in React, or because " +
                    "a component reassigns its own `this.props`. " +
                    "Please file an issue.",
                  getComponentNameFromFiber(finishedWork) || "instance"
                );
              }

              if (instance.state !== finishedWork.memoizedState) {
                error(
                  "Expected %s state to match memoized state before " +
                    "processing the update queue. " +
                    "This might either be because of a bug in React, or because " +
                    "a component reassigns its own `this.state`. " +
                    "Please file an issue.",
                  getComponentNameFromFiber(finishedWork) || "instance"
                );
              }
            }
          } // We could update instance props and state here,
          // but instead we rely on them being set during last render.
          // TODO: revisit this when we implement resuming.

          commitUpdateQueue(finishedWork, updateQueue, instance);
        }

        break;
      }

      case HostRoot: {
        // TODO: I think this is now always non-null by the time it reaches the
        // commit phase. Consider removing the type check.
        var _updateQueue = finishedWork.updateQueue;

        if (_updateQueue !== null) {
          var _instance = null;

          if (finishedWork.child !== null) {
            switch (finishedWork.child.tag) {
              case HostComponent:
                _instance = getPublicInstance(finishedWork.child.stateNode);
                break;

              case ClassComponent:
                _instance = finishedWork.child.stateNode;
                break;
            }
          }

          commitUpdateQueue(finishedWork, _updateQueue, _instance);
        }

        break;
      }

      case HostComponent: {
        var _instance2 = finishedWork.stateNode; // Renderers may schedule work to be done after host components are mounted
        // (eg DOM renderer may schedule auto-focus for inputs and form controls).
        // These effects should only be committed when components are first mounted,
        // aka when there is no current/alternate.

        if (current === null && finishedWork.flags & Update) {
          var type = finishedWork.type;
          var props = finishedWork.memoizedProps;
        }

        break;
      }

      case HostText: {
        // We have no life-cycles associated with text.
        break;
      }

      case HostPortal: {
        // We have no life-cycles associated with portals.
        break;
      }

      case Profiler: {
        {
          var _finishedWork$memoize2 = finishedWork.memoizedProps,
            onCommit = _finishedWork$memoize2.onCommit,
            onRender = _finishedWork$memoize2.onRender;
          var effectDuration = finishedWork.stateNode.effectDuration;
          var commitTime = getCommitTime();
          var phase = current === null ? "mount" : "update";

          {
            if (isCurrentUpdateNested()) {
              phase = "nested-update";
            }
          }

          if (typeof onRender === "function") {
            onRender(
              finishedWork.memoizedProps.id,
              phase,
              finishedWork.actualDuration,
              finishedWork.treeBaseDuration,
              finishedWork.actualStartTime,
              commitTime
            );
          }

          {
            if (typeof onCommit === "function") {
              onCommit(
                finishedWork.memoizedProps.id,
                phase,
                effectDuration,
                commitTime
              );
            } // Schedule a passive effect for this Profiler to call onPostCommit hooks.
            // This effect should be scheduled even if there is no onPostCommit callback for this Profiler,
            // because the effect is also where times bubble to parent Profilers.

            enqueuePendingPassiveProfilerEffect(finishedWork); // Propagate layout effect durations to the next nearest Profiler ancestor.
            // Do not reset these values until the next render so DevTools has a chance to read them first.

            var parentFiber = finishedWork.return;

            outer: while (parentFiber !== null) {
              switch (parentFiber.tag) {
                case HostRoot:
                  var root = parentFiber.stateNode;
                  root.effectDuration += effectDuration;
                  break outer;

                case Profiler:
                  var parentStateNode = parentFiber.stateNode;
                  parentStateNode.effectDuration += effectDuration;
                  break outer;
              }

              parentFiber = parentFiber.return;
            }
          }
        }

        break;
      }

      case SuspenseComponent: {
        break;
      }

      case SuspenseListComponent:
      case IncompleteClassComponent:
      case ScopeComponent:
      case OffscreenComponent:
      case LegacyHiddenComponent:
        break;

      default: {
        throw Error(
          "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue."
        );
      }
    }
  }

  {
    {
      if (finishedWork.flags & Ref) {
        commitAttachRef(finishedWork);
      }
    }
  }
}

function hideOrUnhideAllChildren(finishedWork, isHidden) {
  // Only hide or unhide the top-most host nodes.
  var hostSubtreeRoot = null;

  {
    // We only have the top Fiber that was inserted but we need to recurse down its
    // children to find all the terminal nodes.
    var node = finishedWork;

    while (true) {
      if (node.tag === HostComponent) {
        if (hostSubtreeRoot === null) {
          hostSubtreeRoot = node;
          var instance = node.stateNode;

          if (isHidden) {
            hideInstance(instance);
          } else {
            unhideInstance(node.stateNode, node.memoizedProps);
          }
        }
      } else if (node.tag === HostText) {
        if (hostSubtreeRoot === null) {
          var _instance3 = node.stateNode;

          if (isHidden) {
            hideTextInstance();
          } else {
            unhideTextInstance(_instance3, node.memoizedProps);
          }
        }
      } else if (
        (node.tag === OffscreenComponent ||
          node.tag === LegacyHiddenComponent) &&
        node.memoizedState !== null &&
        node !== finishedWork
      );
      else if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }

      if (node === finishedWork) {
        return;
      }

      while (node.sibling === null) {
        if (node.return === null || node.return === finishedWork) {
          return;
        }

        if (hostSubtreeRoot === node) {
          hostSubtreeRoot = null;
        }

        node = node.return;
      }

      if (hostSubtreeRoot === node) {
        hostSubtreeRoot = null;
      }

      node.sibling.return = node.return;
      node = node.sibling;
    }
  }
}

function commitAttachRef(finishedWork) {
  var ref = finishedWork.ref;

  if (ref !== null) {
    var instance = finishedWork.stateNode;
    var instanceToUse;

    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;

      default:
        instanceToUse = instance;
    } // Moved outside to ensure DCE works with this flag

    if (typeof ref === "function") {
      if (finishedWork.mode & ProfileMode) {
        try {
          startLayoutEffectTimer();
          ref(instanceToUse);
        } finally {
          recordLayoutEffectDuration(finishedWork);
        }
      } else {
        ref(instanceToUse);
      }
    } else {
      {
        if (!ref.hasOwnProperty("current")) {
          error(
            "Unexpected ref object provided for %s. " +
              "Use either a ref-setter function or React.createRef().",
            getComponentNameFromFiber(finishedWork)
          );
        }
      }

      ref.current = instanceToUse;
    }
  }
}

function commitDetachRef(current) {
  var currentRef = current.ref;

  if (currentRef !== null) {
    if (typeof currentRef === "function") {
      if (current.mode & ProfileMode) {
        try {
          startLayoutEffectTimer();
          currentRef(null);
        } finally {
          recordLayoutEffectDuration(current);
        }
      } else {
        currentRef(null);
      }
    } else {
      currentRef.current = null;
    }
  }
} // User-originating errors (lifecycles and refs) should not interrupt
// deletion, so don't let them throw. Host-originating errors should
// interrupt deletion, so it's okay

function commitUnmount(finishedRoot, current, nearestMountedAncestor) {
  onCommitUnmount(current);

  switch (current.tag) {
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent: {
      var updateQueue = current.updateQueue;

      if (updateQueue !== null) {
        var lastEffect = updateQueue.lastEffect;

        if (lastEffect !== null) {
          var firstEffect = lastEffect.next;
          var effect = firstEffect;

          do {
            var _effect = effect,
              destroy = _effect.destroy,
              tag = _effect.tag;

            if (destroy !== undefined) {
              if ((tag & Layout) !== NoFlags$1) {
                if (current.mode & ProfileMode) {
                  startLayoutEffectTimer();
                  safelyCallDestroy(current, nearestMountedAncestor, destroy);
                  recordLayoutEffectDuration(current);
                } else {
                  safelyCallDestroy(current, nearestMountedAncestor, destroy);
                }
              }
            }

            effect = effect.next;
          } while (effect !== firstEffect);
        }
      }

      return;
    }

    case ClassComponent: {
      safelyDetachRef(current, nearestMountedAncestor);
      var instance = current.stateNode;

      if (typeof instance.componentWillUnmount === "function") {
        safelyCallComponentWillUnmount(
          current,
          nearestMountedAncestor,
          instance
        );
      }

      return;
    }

    case HostComponent: {
      safelyDetachRef(current, nearestMountedAncestor);
      return;
    }

    case HostPortal: {
      // TODO: this is recursive.
      // We are also not using this parent because
      // the portal will get pushed immediately.
      {
        unmountHostComponents(finishedRoot, current, nearestMountedAncestor);
      }

      return;
    }

    case DehydratedFragment: {
      return;
    }

    case ScopeComponent: {
      return;
    }
  }
}

function commitNestedUnmounts(finishedRoot, root, nearestMountedAncestor) {
  // While we're inside a removed host node we don't want to call
  // removeChild on the inner nodes because they're removed by the top
  // call anyway. We also want to call componentWillUnmount on all
  // composites before this host node is removed from the tree. Therefore
  // we do an inner loop while we're still inside the host node.
  var node = root;

  while (true) {
    commitUnmount(finishedRoot, node, nearestMountedAncestor); // Visit children because they may contain more composite or host nodes.
    // Skip portals because commitUnmount() currently visits them recursively.

    if (
      node.child !== null && // If we use mutation we drill down into portals using commitUnmount above.
      // If we don't use mutation we drill down into portals here instead.
      node.tag !== HostPortal
    ) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === root) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === root) {
        return;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function detachFiberMutation(fiber) {
  // Cut off the return pointer to disconnect it from the tree.
  // This enables us to detect and warn against state updates on an unmounted component.
  // It also prevents events from bubbling from within disconnected components.
  //
  // Ideally, we should also clear the child pointer of the parent alternate to let this
  // get GC:ed but we don't know which for sure which parent is the current
  // one so we'll settle for GC:ing the subtree of this child.
  // This child itself will be GC:ed when the parent updates the next time.
  //
  // Note that we can't clear child or sibling pointers yet.
  // They're needed for passive effects and for findDOMNode.
  // We defer those fields, and all other cleanup, to the passive phase (see detachFiberAfterEffects).
  //
  // Don't reset the alternate yet, either. We need that so we can detach the
  // alternate's fields in the passive phase. Clearing the return pointer is
  // sufficient for findDOMNode semantics.
  var alternate = fiber.alternate;

  if (alternate !== null) {
    alternate.return = null;
  }

  fiber.return = null;
}

function detachFiberAfterEffects(fiber) {
  var alternate = fiber.alternate;

  if (alternate !== null) {
    fiber.alternate = null;
    detachFiberAfterEffects(alternate);
  } // Note: Defensively using negation instead of < in case
  // `deletedTreeCleanUpLevel` is undefined.

  {
    // Clear cyclical Fiber fields. This level alone is designed to roughly
    // approximate the planned Fiber refactor. In that world, `setState` will be
    // bound to a special "instance" object instead of a Fiber. The Instance
    // object will not have any of these fields. It will only be connected to
    // the fiber tree via a single link at the root. So if this level alone is
    // sufficient to fix memory issues, that bodes well for our plans.
    fiber.child = null;
    fiber.deletions = null;
    fiber.sibling = null; // The `stateNode` is cyclical because on host nodes it points to the host
    // tree, which has its own pointers to children, parents, and siblings.
    // The other host nodes also point back to fibers, so we should detach that
    // one, too.

    if (fiber.tag === HostComponent) {
      var hostInstance = fiber.stateNode;
    }

    fiber.stateNode = null; // I'm intentionally not clearing the `return` field in this level. We
    // already disconnect the `return` pointer at the root of the deleted
    // subtree (in `detachFiberMutation`). Besides, `return` by itself is not
    // cyclical — it's only cyclical when combined with `child`, `sibling`, and
    // `alternate`. But we'll clear it in the next level anyway, just in case.

    {
      fiber._debugOwner = null;
    }

    {
      // Theoretically, nothing in here should be necessary, because we already
      // disconnected the fiber from the tree. So even if something leaks this
      // particular fiber, it won't leak anything else
      //
      // The purpose of this branch is to be super aggressive so we can measure
      // if there's any difference in memory impact. If there is, that could
      // indicate a React leak we don't know about.
      fiber.return = null;
      fiber.dependencies = null;
      fiber.memoizedProps = null;
      fiber.memoizedState = null;
      fiber.pendingProps = null;
      fiber.stateNode = null; // TODO: Move to `commitPassiveUnmountInsideDeletedTreeOnFiber` instead.

      fiber.updateQueue = null;
    }
  }
}

function getHostParentFiber(fiber) {
  var parent = fiber.return;

  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }

    parent = parent.return;
  }

  {
    throw Error(
      "Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue."
    );
  }
}

function isHostParent(fiber) {
  return (
    fiber.tag === HostComponent ||
    fiber.tag === HostRoot ||
    fiber.tag === HostPortal
  );
}

function getHostSibling(fiber) {
  // We're going to search forward into the tree until we find a sibling host
  // node. Unfortunately, if multiple insertions are done in a row we have to
  // search past them. This leads to exponential search for the next sibling.
  // TODO: Find a more efficient way to do this.
  var node = fiber;

  siblings: while (true) {
    // If we didn't find anything, let's try the next sibling.
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        // If we pop out of the root or hit the parent the fiber we are the
        // last sibling.
        return null;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;

    while (
      node.tag !== HostComponent &&
      node.tag !== HostText &&
      node.tag !== DehydratedFragment
    ) {
      // If it is not host node and, we might have a host node inside it.
      // Try to search down until we find one.
      if (node.flags & Placement) {
        // If we don't have a child, try the siblings instead.
        continue siblings;
      } // If we don't have a child, try the siblings instead.
      // We also skip portals because they are not part of this host tree.

      if (node.child === null || node.tag === HostPortal) {
        continue siblings;
      } else {
        node.child.return = node;
        node = node.child;
      }
    } // Check if this host node is stable or about to be placed.

    if (!(node.flags & Placement)) {
      // Found it!
      return node.stateNode;
    }
  }
}

function commitPlacement(finishedWork) {
  var parentFiber = getHostParentFiber(finishedWork); // Note: these two variables *must* always be updated together.

  var parent;
  var isContainer;
  var parentStateNode = parentFiber.stateNode;

  switch (parentFiber.tag) {
    case HostComponent:
      parent = parentStateNode;
      isContainer = false;
      break;

    case HostRoot:
      parent = parentStateNode.containerInfo;
      isContainer = true;
      break;

    case HostPortal:
      parent = parentStateNode.containerInfo;
      isContainer = true;
      break;
    // eslint-disable-next-line-no-fallthrough

    default: {
      throw Error(
        "Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue."
      );
    }
  }

  if (parentFiber.flags & ContentReset) {
    parentFiber.flags &= ~ContentReset;
  }

  var before = getHostSibling(finishedWork); // We only have the top Fiber that was inserted but we need to recurse down its
  // children to find all the terminal nodes.

  if (isContainer) {
    insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
  } else {
    insertOrAppendPlacementNode(finishedWork, before, parent);
  }
}

function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
  var tag = node.tag;
  var isHost = tag === HostComponent || tag === HostText;

  if (isHost) {
    var stateNode = node.stateNode;

    if (before) {
      insertInContainerBefore(parent);
    } else {
      appendChildToContainer(parent, stateNode);
    }
  } else if (tag === HostPortal);
  else {
    var child = node.child;

    if (child !== null) {
      insertOrAppendPlacementNodeIntoContainer(child, before, parent);
      var sibling = child.sibling;

      while (sibling !== null) {
        insertOrAppendPlacementNodeIntoContainer(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}

function insertOrAppendPlacementNode(node, before, parent) {
  var tag = node.tag;
  var isHost = tag === HostComponent || tag === HostText;

  if (isHost) {
    var stateNode = node.stateNode;

    if (before) {
      insertBefore(parent, stateNode, before);
    } else {
      appendChild(parent, stateNode);
    }
  } else if (tag === HostPortal);
  else {
    var child = node.child;

    if (child !== null) {
      insertOrAppendPlacementNode(child, before, parent);
      var sibling = child.sibling;

      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}

function unmountHostComponents(finishedRoot, current, nearestMountedAncestor) {
  // We only have the top Fiber that was deleted but we need to recurse down its
  // children to find all the terminal nodes.
  var node = current; // Each iteration, currentParent is populated with node's host parent if not
  // currentParentIsValid.

  var currentParentIsValid = false; // Note: these two variables *must* always be updated together.

  var currentParent;
  var currentParentIsContainer;

  while (true) {
    if (!currentParentIsValid) {
      var parent = node.return;

      findParent: while (true) {
        if (!(parent !== null)) {
          throw Error(
            "Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue."
          );
        }

        var parentStateNode = parent.stateNode;

        switch (parent.tag) {
          case HostComponent:
            currentParent = parentStateNode;
            currentParentIsContainer = false;
            break findParent;

          case HostRoot:
            currentParent = parentStateNode.containerInfo;
            currentParentIsContainer = true;
            break findParent;

          case HostPortal:
            currentParent = parentStateNode.containerInfo;
            currentParentIsContainer = true;
            break findParent;
        }

        parent = parent.return;
      }

      currentParentIsValid = true;
    }

    if (node.tag === HostComponent || node.tag === HostText) {
      commitNestedUnmounts(finishedRoot, node, nearestMountedAncestor); // After all the children have unmounted, it is now safe to remove the
      // node from the tree.

      if (currentParentIsContainer) {
        removeChildFromContainer(currentParent, node.stateNode);
      } else {
        removeChild(currentParent, node.stateNode);
      } // Don't visit children because we already visited them.
    } else if (node.tag === HostPortal) {
      if (node.child !== null) {
        // When we go into a portal, it becomes the parent to remove from.
        // We will reassign it back when we pop the portal on the way up.
        currentParent = node.stateNode.containerInfo;
        currentParentIsContainer = true; // Visit children because portals might contain host components.

        node.child.return = node;
        node = node.child;
        continue;
      }
    } else {
      commitUnmount(finishedRoot, node, nearestMountedAncestor); // Visit children because we may find more host components below.

      if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }
    }

    if (node === current) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === current) {
        return;
      }

      node = node.return;

      if (node.tag === HostPortal) {
        // When we go out of the portal, we need to restore the parent.
        // Since we don't keep a stack of them, we will search for it.
        currentParentIsValid = false;
      }
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function commitDeletion(finishedRoot, current, nearestMountedAncestor) {
  {
    // Recursively delete all host nodes from the parent.
    // Detach refs and call componentWillUnmount() on the whole subtree.
    unmountHostComponents(finishedRoot, current, nearestMountedAncestor);
  }

  detachFiberMutation(current);
}

function commitWork(current, finishedWork) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent: {
      // Layout effects are destroyed during the mutation phase so that all
      // destroy functions for all fibers are called before any create functions.
      // This prevents sibling component effects from interfering with each other,
      // e.g. a destroy function in one component should never override a ref set
      // by a create function in another component during the same commit.
      if (finishedWork.mode & ProfileMode) {
        try {
          startLayoutEffectTimer();
          commitHookEffectListUnmount(
            Layout | HasEffect,
            finishedWork,
            finishedWork.return
          );
        } finally {
          recordLayoutEffectDuration(finishedWork);
        }
      } else {
        commitHookEffectListUnmount(
          Layout | HasEffect,
          finishedWork,
          finishedWork.return
        );
      }

      return;
    }

    case ClassComponent: {
      return;
    }

    case HostComponent: {
      var instance = finishedWork.stateNode;

      if (instance != null) {
        // Commit the work prepared earlier.
        var newProps = finishedWork.memoizedProps; // For hydration we reuse the update path but we treat the oldProps
        // as the newProps. The updatePayload will contain the real change in
        // this case.

        var oldProps = current !== null ? current.memoizedProps : newProps;
        var type = finishedWork.type; // TODO: Type the updateQueue to be specific to host components.

        var updatePayload = finishedWork.updateQueue;
        finishedWork.updateQueue = null;

        if (updatePayload !== null) {
          commitUpdate(instance, updatePayload, type, oldProps, newProps);
        }
      }

      return;
    }

    case HostText: {
      if (!(finishedWork.stateNode !== null)) {
        throw Error(
          "This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue."
        );
      }

      var textInstance = finishedWork.stateNode;
      var newText = finishedWork.memoizedProps; // For hydration we reuse the update path but we treat the oldProps
      // as the newProps. The updatePayload will contain the real change in
      // this case.

      var oldText = current !== null ? current.memoizedProps : newText;
      commitTextUpdate(textInstance, oldText, newText);
      return;
    }

    case HostRoot: {
      return;
    }

    case Profiler: {
      return;
    }

    case SuspenseComponent: {
      commitSuspenseCallback(finishedWork);
      attachSuspenseRetryListeners(finishedWork);
      return;
    }

    case SuspenseListComponent: {
      attachSuspenseRetryListeners(finishedWork);
      return;
    }

    case IncompleteClassComponent: {
      return;
    }
  }

  {
    throw Error(
      "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue."
    );
  }
}

function commitSuspenseCallback(finishedWork) {
  // TODO: Move this to passive phase
  var newState = finishedWork.memoizedState;
}

function attachSuspenseRetryListeners(finishedWork) {
  // If this boundary just timed out, then it will have a set of wakeables.
  // For each wakeable, attach a listener so that when it resolves, React
  // attempts to re-render the boundary in the primary (pre-timeout) state.
  var wakeables = finishedWork.updateQueue;

  if (wakeables !== null) {
    finishedWork.updateQueue = null;
    var retryCache = finishedWork.stateNode;

    if (retryCache === null) {
      retryCache = finishedWork.stateNode = new PossiblyWeakSet();
    }

    wakeables.forEach(function(wakeable) {
      // Memoize using the boundary fiber to prevent redundant listeners.
      var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);

      if (!retryCache.has(wakeable)) {
        retryCache.add(wakeable);

        {
          if (isDevToolsPresent) {
            if (inProgressLanes !== null && inProgressRoot !== null) {
              // If we have pending work still, associate the original updaters with it.
              restorePendingUpdaters(inProgressRoot, inProgressLanes);
            } else {
              throw Error(
                "Expected finished root and lanes to be set. This is a bug in React."
              );
            }
          }
        }

        wakeable.then(retry, retry);
      }
    });
  }
} // This function detects when a Suspense boundary goes from visible to hidden.

function commitResetTextContent(current) {
  resetTextContent(current.stateNode);
}

function commitMutationEffects(root, firstChild, committedLanes) {
  inProgressLanes = committedLanes;
  inProgressRoot = root;
  nextEffect = firstChild;
  commitMutationEffects_begin(root);
  inProgressLanes = null;
  inProgressRoot = null;
}

function commitMutationEffects_begin(root) {
  while (nextEffect !== null) {
    var fiber = nextEffect; // TODO: Should wrap this in flags check, too, as optimization

    var deletions = fiber.deletions;

    if (deletions !== null) {
      for (var i = 0; i < deletions.length; i++) {
        var childToDelete = deletions[i];

        try {
          commitDeletion(root, childToDelete, fiber);
        } catch (error) {
          reportUncaughtErrorInDEV(error);
          captureCommitPhaseError(childToDelete, fiber, error);
        }
      }
    }

    var child = fiber.child;

    if ((fiber.subtreeFlags & MutationMask) !== NoFlags && child !== null) {
      ensureCorrectReturnPointer(child, fiber);
      nextEffect = child;
    } else {
      commitMutationEffects_complete(root);
    }
  }
}

function commitMutationEffects_complete(root) {
  while (nextEffect !== null) {
    var fiber = nextEffect;
    setCurrentFiber(fiber);

    try {
      commitMutationEffectsOnFiber(fiber, root);
    } catch (error) {
      reportUncaughtErrorInDEV(error);
      captureCommitPhaseError(fiber, fiber.return, error);
    }

    resetCurrentFiber();
    var sibling = fiber.sibling;

    if (sibling !== null) {
      ensureCorrectReturnPointer(sibling, fiber.return);
      nextEffect = sibling;
      return;
    }

    nextEffect = fiber.return;
  }
}

function commitMutationEffectsOnFiber(finishedWork, root) {
  // TODO: The factoring of this phase could probably be improved. Consider
  // switching on the type of work before checking the flags. That's what
  // we do in all the other phases. I think this one is only different
  // because of the shared reconciliation logic below.
  var flags = finishedWork.flags;

  if (flags & ContentReset) {
    commitResetTextContent(finishedWork);
  }

  if (flags & Ref) {
    var current = finishedWork.alternate;

    if (current !== null) {
      commitDetachRef(current);
    }
  }

  if (flags & Visibility) {
    switch (finishedWork.tag) {
      case SuspenseComponent: {
        var newState = finishedWork.memoizedState;
        var isHidden = newState !== null;

        if (isHidden) {
          var _current = finishedWork.alternate;
          var wasHidden = _current !== null && _current.memoizedState !== null;

          if (!wasHidden) {
            // TODO: Move to passive phase
            markCommitTimeOfFallback();
          }
        }

        break;
      }

      case OffscreenComponent: {
        var _newState = finishedWork.memoizedState;

        var _isHidden = _newState !== null;

        var _current2 = finishedWork.alternate;

        var _wasHidden = _current2 !== null && _current2.memoizedState !== null;

        var offscreenBoundary = finishedWork;

        {
          // TODO: This needs to run whenever there's an insertion or update
          // inside a hidden Offscreen tree.
          hideOrUnhideAllChildren(offscreenBoundary, _isHidden);
        }
      }
    }
  } // The following switch statement is only concerned about placement,
  // updates, and deletions. To avoid needing to add a case for every possible
  // bitmap value, we remove the secondary effects from the effect tag and
  // switch on that value.

  var primaryFlags = flags & (Placement | Update | Hydrating);

  switch (primaryFlags) {
    case Placement: {
      commitPlacement(finishedWork); // Clear the "placement" from effect tag so that we know that this is
      // inserted, before any life-cycles like componentDidMount gets called.
      // TODO: findDOMNode doesn't rely on this any more but isMounted does
      // and isMounted is deprecated anyway so we should be able to kill this.

      finishedWork.flags &= ~Placement;
      break;
    }

    case PlacementAndUpdate: {
      // Placement
      commitPlacement(finishedWork); // Clear the "placement" from effect tag so that we know that this is
      // inserted, before any life-cycles like componentDidMount gets called.

      finishedWork.flags &= ~Placement; // Update

      var _current3 = finishedWork.alternate;
      commitWork(_current3, finishedWork);
      break;
    }

    case Hydrating: {
      finishedWork.flags &= ~Hydrating;
      break;
    }

    case HydratingAndUpdate: {
      finishedWork.flags &= ~Hydrating; // Update

      var _current4 = finishedWork.alternate;
      commitWork(_current4, finishedWork);
      break;
    }

    case Update: {
      var _current5 = finishedWork.alternate;
      commitWork(_current5, finishedWork);
      break;
    }
  }
}

function commitLayoutEffects(finishedWork, root, committedLanes) {
  inProgressLanes = committedLanes;
  inProgressRoot = root;
  nextEffect = finishedWork;
  commitLayoutEffects_begin(finishedWork, root, committedLanes);
  inProgressLanes = null;
  inProgressRoot = null;
}

function commitLayoutEffects_begin(subtreeRoot, root, committedLanes) {
  // Suspense layout effects semantics don't change for legacy roots.
  var isModernRoot = (subtreeRoot.mode & ConcurrentMode) !== NoMode;

  while (nextEffect !== null) {
    var fiber = nextEffect;
    var firstChild = fiber.child;

    if ((fiber.subtreeFlags & LayoutMask) !== NoFlags && firstChild !== null) {
      ensureCorrectReturnPointer(firstChild, fiber);
      nextEffect = firstChild;
    } else {
      commitLayoutMountEffects_complete(subtreeRoot, root, committedLanes);
    }
  }
}

function commitLayoutMountEffects_complete(subtreeRoot, root, committedLanes) {
  while (nextEffect !== null) {
    var fiber = nextEffect;

    if ((fiber.flags & LayoutMask) !== NoFlags) {
      var current = fiber.alternate;
      setCurrentFiber(fiber);

      try {
        commitLayoutEffectOnFiber(root, current, fiber, committedLanes);
      } catch (error) {
        reportUncaughtErrorInDEV(error);
        captureCommitPhaseError(fiber, fiber.return, error);
      }

      resetCurrentFiber();
    }

    if (fiber === subtreeRoot) {
      nextEffect = null;
      return;
    }

    var sibling = fiber.sibling;

    if (sibling !== null) {
      ensureCorrectReturnPointer(sibling, fiber.return);
      nextEffect = sibling;
      return;
    }

    nextEffect = fiber.return;
  }
}

function commitPassiveMountEffects(root, finishedWork) {
  nextEffect = finishedWork;
  commitPassiveMountEffects_begin(finishedWork, root);
}

function commitPassiveMountEffects_begin(subtreeRoot, root) {
  while (nextEffect !== null) {
    var fiber = nextEffect;
    var firstChild = fiber.child;

    if ((fiber.subtreeFlags & PassiveMask) !== NoFlags && firstChild !== null) {
      ensureCorrectReturnPointer(firstChild, fiber);
      nextEffect = firstChild;
    } else {
      commitPassiveMountEffects_complete(subtreeRoot, root);
    }
  }
}

function commitPassiveMountEffects_complete(subtreeRoot, root) {
  while (nextEffect !== null) {
    var fiber = nextEffect;

    if ((fiber.flags & Passive) !== NoFlags) {
      setCurrentFiber(fiber);

      try {
        commitPassiveMountOnFiber(root, fiber);
      } catch (error) {
        reportUncaughtErrorInDEV(error);
        captureCommitPhaseError(fiber, fiber.return, error);
      }

      resetCurrentFiber();
    }

    if (fiber === subtreeRoot) {
      nextEffect = null;
      return;
    }

    var sibling = fiber.sibling;

    if (sibling !== null) {
      ensureCorrectReturnPointer(sibling, fiber.return);
      nextEffect = sibling;
      return;
    }

    nextEffect = fiber.return;
  }
}

function commitPassiveMountOnFiber(finishedRoot, finishedWork) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent: {
      if (finishedWork.mode & ProfileMode) {
        startPassiveEffectTimer();

        try {
          commitHookEffectListMount(Passive$1 | HasEffect, finishedWork);
        } finally {
          recordPassiveEffectDuration(finishedWork);
        }
      } else {
        commitHookEffectListMount(Passive$1 | HasEffect, finishedWork);
      }

      break;
    }
  }
}

function commitPassiveUnmountEffects(firstChild) {
  nextEffect = firstChild;
  commitPassiveUnmountEffects_begin();
}

function commitPassiveUnmountEffects_begin() {
  while (nextEffect !== null) {
    var fiber = nextEffect;
    var child = fiber.child;

    if ((nextEffect.flags & ChildDeletion) !== NoFlags) {
      var deletions = fiber.deletions;

      if (deletions !== null) {
        for (var i = 0; i < deletions.length; i++) {
          var fiberToDelete = deletions[i];
          nextEffect = fiberToDelete;
          commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
            fiberToDelete,
            fiber
          );
        }

        {
          // A fiber was deleted from this parent fiber, but it's still part of
          // the previous (alternate) parent fiber's list of children. Because
          // children are a linked list, an earlier sibling that's still alive
          // will be connected to the deleted fiber via its `alternate`:
          //
          //   live fiber
          //   --alternate--> previous live fiber
          //   --sibling--> deleted fiber
          //
          // We can't disconnect `alternate` on nodes that haven't been deleted
          // yet, but we can disconnect the `sibling` and `child` pointers.
          var previousFiber = fiber.alternate;

          if (previousFiber !== null) {
            var detachedChild = previousFiber.child;

            if (detachedChild !== null) {
              previousFiber.child = null;

              do {
                var detachedSibling = detachedChild.sibling;
                detachedChild.sibling = null;
                detachedChild = detachedSibling;
              } while (detachedChild !== null);
            }
          }
        }

        nextEffect = fiber;
      }
    }

    if ((fiber.subtreeFlags & PassiveMask) !== NoFlags && child !== null) {
      ensureCorrectReturnPointer(child, fiber);
      nextEffect = child;
    } else {
      commitPassiveUnmountEffects_complete();
    }
  }
}

function commitPassiveUnmountEffects_complete() {
  while (nextEffect !== null) {
    var fiber = nextEffect;

    if ((fiber.flags & Passive) !== NoFlags) {
      setCurrentFiber(fiber);
      commitPassiveUnmountOnFiber(fiber);
      resetCurrentFiber();
    }

    var sibling = fiber.sibling;

    if (sibling !== null) {
      ensureCorrectReturnPointer(sibling, fiber.return);
      nextEffect = sibling;
      return;
    }

    nextEffect = fiber.return;
  }
}

function commitPassiveUnmountOnFiber(finishedWork) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent: {
      if (finishedWork.mode & ProfileMode) {
        startPassiveEffectTimer();
        commitHookEffectListUnmount(
          Passive$1 | HasEffect,
          finishedWork,
          finishedWork.return
        );
        recordPassiveEffectDuration(finishedWork);
      } else {
        commitHookEffectListUnmount(
          Passive$1 | HasEffect,
          finishedWork,
          finishedWork.return
        );
      }

      break;
    }
  }
}

function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
  deletedSubtreeRoot,
  nearestMountedAncestor
) {
  while (nextEffect !== null) {
    var fiber = nextEffect; // Deletion effects fire in parent -> child order
    // TODO: Check if fiber has a PassiveStatic flag

    setCurrentFiber(fiber);
    commitPassiveUnmountInsideDeletedTreeOnFiber(fiber, nearestMountedAncestor);
    resetCurrentFiber();
    var child = fiber.child; // TODO: Only traverse subtree if it has a PassiveStatic flag. (But, if we
    // do this, still need to handle `deletedTreeCleanUpLevel` correctly.)

    if (child !== null) {
      ensureCorrectReturnPointer(child, fiber);
      nextEffect = child;
    } else {
      commitPassiveUnmountEffectsInsideOfDeletedTree_complete(
        deletedSubtreeRoot
      );
    }
  }
}

function commitPassiveUnmountEffectsInsideOfDeletedTree_complete(
  deletedSubtreeRoot
) {
  while (nextEffect !== null) {
    var fiber = nextEffect;
    var sibling = fiber.sibling;
    var returnFiber = fiber.return;

    {
      // Recursively traverse the entire deleted tree and clean up fiber fields.
      // This is more aggressive than ideal, and the long term goal is to only
      // have to detach the deleted tree at the root.
      detachFiberAfterEffects(fiber);

      if (fiber === deletedSubtreeRoot) {
        nextEffect = null;
        return;
      }
    }

    if (sibling !== null) {
      ensureCorrectReturnPointer(sibling, returnFiber);
      nextEffect = sibling;
      return;
    }

    nextEffect = returnFiber;
  }
}

function commitPassiveUnmountInsideDeletedTreeOnFiber(
  current,
  nearestMountedAncestor
) {
  switch (current.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent: {
      if (current.mode & ProfileMode) {
        startPassiveEffectTimer();
        commitHookEffectListUnmount(Passive$1, current, nearestMountedAncestor);
        recordPassiveEffectDuration(current);
      } else {
        commitHookEffectListUnmount(Passive$1, current, nearestMountedAncestor);
      }

      break;
    }
  }
}

var didWarnWrongReturnPointer = false;

function ensureCorrectReturnPointer(fiber, expectedReturnFiber) {
  {
    if (!didWarnWrongReturnPointer && fiber.return !== expectedReturnFiber) {
      didWarnWrongReturnPointer = true;

      error(
        "Internal React error: Return pointer is inconsistent " + "with parent."
      );
    }
  } // TODO: Remove this assignment once we're confident that it won't break
  // anything, by checking the warning logs for the above invariant

  fiber.return = expectedReturnFiber;
} // TODO: Reuse reappearLayoutEffects traversal here?

function invokeLayoutEffectMountInDEV(fiber) {
  {
    // We don't need to re-check StrictEffectsMode here.
    // This function is only called if that check has already passed.
    switch (fiber.tag) {
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent: {
        try {
          commitHookEffectListMount(Layout | HasEffect, fiber);
        } catch (error) {
          reportUncaughtErrorInDEV(error);
          captureCommitPhaseError(fiber, fiber.return, error);
        }

        break;
      }

      case ClassComponent: {
        var instance = fiber.stateNode;

        try {
          instance.componentDidMount();
        } catch (error) {
          reportUncaughtErrorInDEV(error);
          captureCommitPhaseError(fiber, fiber.return, error);
        }

        break;
      }
    }
  }
}

function invokePassiveEffectMountInDEV(fiber) {
  {
    // We don't need to re-check StrictEffectsMode here.
    // This function is only called if that check has already passed.
    switch (fiber.tag) {
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent: {
        try {
          commitHookEffectListMount(Passive$1 | HasEffect, fiber);
        } catch (error) {
          reportUncaughtErrorInDEV(error);
          captureCommitPhaseError(fiber, fiber.return, error);
        }

        break;
      }
    }
  }
}

function invokeLayoutEffectUnmountInDEV(fiber) {
  {
    // We don't need to re-check StrictEffectsMode here.
    // This function is only called if that check has already passed.
    switch (fiber.tag) {
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent: {
        try {
          commitHookEffectListUnmount(Layout | HasEffect, fiber, fiber.return);
        } catch (error) {
          reportUncaughtErrorInDEV(error);
          captureCommitPhaseError(fiber, fiber.return, error);
        }

        break;
      }

      case ClassComponent: {
        var instance = fiber.stateNode;

        if (typeof instance.componentWillUnmount === "function") {
          safelyCallComponentWillUnmount(fiber, fiber.return, instance);
        }

        break;
      }
    }
  }
}

function invokePassiveEffectUnmountInDEV(fiber) {
  {
    // We don't need to re-check StrictEffectsMode here.
    // This function is only called if that check has already passed.
    switch (fiber.tag) {
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent: {
        try {
          commitHookEffectListUnmount(
            Passive$1 | HasEffect,
            fiber,
            fiber.return
          );
        } catch (error) {
          reportUncaughtErrorInDEV(error);
          captureCommitPhaseError(fiber, fiber.return, error);
        }
      }
    }
  }
}

var COMPONENT_TYPE = 0;
var HAS_PSEUDO_CLASS_TYPE = 1;
var ROLE_TYPE = 2;
var TEST_NAME_TYPE = 3;
var TEXT_TYPE = 4;

if (typeof Symbol === "function" && Symbol.for) {
  var symbolFor$1 = Symbol.for;
  COMPONENT_TYPE = symbolFor$1("selector.component");
  HAS_PSEUDO_CLASS_TYPE = symbolFor$1("selector.has_pseudo_class");
  ROLE_TYPE = symbolFor$1("selector.role");
  TEST_NAME_TYPE = symbolFor$1("selector.test_id");
  TEXT_TYPE = symbolFor$1("selector.text");
}

var ceil = Math.ceil;
var ReactCurrentDispatcher$2 = ReactSharedInternals.ReactCurrentDispatcher,
  ReactCurrentOwner$2 = ReactSharedInternals.ReactCurrentOwner,
  ReactCurrentBatchConfig$2 = ReactSharedInternals.ReactCurrentBatchConfig,
  ReactCurrentActQueue = ReactSharedInternals.ReactCurrentActQueue;
var NoContext =
  /*             */
  0;
var BatchedContext =
  /*               */
  1;
var RenderContext =
  /*                */
  2;
var CommitContext =
  /*                */
  4;
var RetryAfterError =
  /*       */
  8;
var RootIncomplete = 0;
var RootFatalErrored = 1;
var RootErrored = 2;
var RootSuspended = 3;
var RootSuspendedWithDelay = 4;
var RootCompleted = 5; // Describes where we are in the React execution stack

var executionContext = NoContext; // The root we're working on

var workInProgressRoot = null; // The fiber we're working on

var workInProgress = null; // The lanes we're rendering

var workInProgressRootRenderLanes = NoLanes; // Stack that allows components to change the render lanes for its subtree
// This is a superset of the lanes we started working on at the root. The only
// case where it's different from `workInProgressRootRenderLanes` is when we
// enter a subtree that is hidden and needs to be unhidden: Suspense and
// Offscreen component.
//
// Most things in the work loop should deal with workInProgressRootRenderLanes.
// Most things in begin/complete phases should deal with subtreeRenderLanes.

var subtreeRenderLanes = NoLanes;
var subtreeRenderLanesCursor = createCursor(NoLanes); // Whether to root completed, errored, suspended, etc.

var workInProgressRootExitStatus = RootIncomplete; // A fatal error, if one is thrown

var workInProgressRootFatalError = null; // "Included" lanes refer to lanes that were worked on during this render. It's
// slightly different than `renderLanes` because `renderLanes` can change as you
// enter and exit an Offscreen tree. This value is the combination of all render
// lanes for the entire render phase.

var workInProgressRootIncludedLanes = NoLanes; // The work left over by components that were visited during this render. Only
// includes unprocessed updates, not work in bailed out children.

var workInProgressRootSkippedLanes = NoLanes; // Lanes that were updated (in an interleaved event) during this render.

var workInProgressRootUpdatedLanes = NoLanes; // Lanes that were pinged (in an interleaved event) during this render.

var workInProgressRootPingedLanes = NoLanes; // The most recent time we committed a fallback. This lets us ensure a train
// model where we don't commit new loading states in too quick succession.

var globalMostRecentFallbackTime = 0;
var FALLBACK_THROTTLE_MS = 500; // The absolute time for when we should start giving up on rendering
// more and prefer CPU suspense heuristics instead.

var workInProgressRootRenderTargetTime = Infinity; // How long a render is supposed to take before we start following CPU
// suspense heuristics and opt out of rendering more content.

var RENDER_TIMEOUT_MS = 500;

function resetRenderTimer() {
  workInProgressRootRenderTargetTime = now() + RENDER_TIMEOUT_MS;
}

function getRenderTargetTime() {
  return workInProgressRootRenderTargetTime;
}
var hasUncaughtError = false;
var firstUncaughtError = null;
var legacyErrorBoundariesThatAlreadyFailed = null; // Only used when enableProfilerNestedUpdateScheduledHook is true;
var rootDoesHavePassiveEffects = false;
var rootWithPendingPassiveEffects = null;
var pendingPassiveEffectsLanes = NoLanes;
var pendingPassiveProfilerEffects = []; // Use these to prevent an infinite loop of nested updates

var NESTED_UPDATE_LIMIT = 50;
var nestedUpdateCount = 0;
var rootWithNestedUpdates = null;
var NESTED_PASSIVE_UPDATE_LIMIT = 50;
var nestedPassiveUpdateCount = 0; // If two updates are scheduled within the same event, we should treat their
// event times as simultaneous, even if the actual clock time has advanced
// between the first and second call.

var currentEventTime = NoTimestamp;
var currentEventTransitionLane = NoLanes;
function getWorkInProgressRoot() {
  return workInProgressRoot;
}
function requestEventTime() {
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    // We're inside React, so it's fine to read the actual time.
    return now();
  } // We're not inside React, so we may be in the middle of a browser event.

  if (currentEventTime !== NoTimestamp) {
    // Use the same start time for all updates until we enter React again.
    return currentEventTime;
  } // This is the first update since React yielded. Compute a new start time.

  currentEventTime = now();
  return currentEventTime;
}
function requestUpdateLane(fiber) {
  // Special cases
  var mode = fiber.mode;

  if ((mode & ConcurrentMode) === NoMode) {
    return SyncLane;
  } else if (
    (executionContext & RenderContext) !== NoContext &&
    workInProgressRootRenderLanes !== NoLanes
  ) {
    // This is a render phase update. These are not officially supported. The
    // old behavior is to give this the same "thread" (lanes) as
    // whatever is currently rendering. So if you call `setState` on a component
    // that happens later in the same render, it will flush. Ideally, we want to
    // remove the special case and treat them as if they came from an
    // interleaved event. Regardless, this pattern is not officially supported.
    // This behavior is only a fallback. The flag only exists until we can roll
    // out the setState warning, since existing code might accidentally rely on
    // the current behavior.
    return pickArbitraryLane(workInProgressRootRenderLanes);
  }

  var isTransition = requestCurrentTransition() !== NoTransition;

  if (isTransition) {
    // The algorithm for assigning an update to a lane should be stable for all
    // updates at the same priority within the same event. To do this, the
    // inputs to the algorithm must be the same.
    //
    // The trick we use is to cache the first of each of these inputs within an
    // event. Then reset the cached values once we can be sure the event is
    // over. Our heuristic for that is whenever we enter a concurrent work loop.
    if (currentEventTransitionLane === NoLane) {
      // All transitions within the same event are assigned the same lane.
      currentEventTransitionLane = claimNextTransitionLane();
    }

    return currentEventTransitionLane;
  } // Updates originating inside certain React methods, like flushSync, have
  // their priority set by tracking it with a context variable.
  //
  // The opaque type returned by the host config is internally a lane, so we can
  // use that directly.
  // TODO: Move this type conversion to the event priority module.

  var updateLane = getCurrentUpdatePriority();

  if (updateLane !== NoLane) {
    return updateLane;
  } // This update originated outside React. Ask the host environment for an
  // appropriate priority, based on the type of event.
  //
  // The opaque type returned by the host config is internally a lane, so we can
  // use that directly.
  // TODO: Move this type conversion to the event priority module.

  var eventLane = getCurrentEventPriority();
  return eventLane;
}

function requestRetryLane(fiber) {
  // This is a fork of `requestUpdateLane` designed specifically for Suspense
  // "retries" — a special update that attempts to flip a Suspense boundary
  // from its placeholder state to its primary/resolved state.
  // Special cases
  var mode = fiber.mode;

  if ((mode & ConcurrentMode) === NoMode) {
    return SyncLane;
  }

  return claimNextRetryLane();
}

function scheduleUpdateOnFiber(fiber, lane, eventTime) {
  checkForNestedUpdates();
  warnAboutRenderPhaseUpdatesInDEV(fiber);
  var root = markUpdateLaneFromFiberToRoot(fiber, lane);

  if (root === null) {
    return null;
  }

  {
    if (isDevToolsPresent) {
      addFiberToLanesMap(root, fiber, lane);
    }
  } // Mark that the root has a pending update.

  markRootUpdated(root, lane, eventTime);

  if (root === workInProgressRoot) {
    // Received an update to a tree that's in the middle of rendering. Mark
    // that there was an interleaved update work on this root. Unless the
    // `deferRenderPhaseUpdateToNextBatch` flag is off and this is a render
    // phase update. In that case, we don't treat render phase updates as if
    // they were interleaved, for backwards compat reasons.
    if ((executionContext & RenderContext) === NoContext) {
      workInProgressRootUpdatedLanes = mergeLanes(
        workInProgressRootUpdatedLanes,
        lane
      );
    }

    if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
      // The root already suspended with a delay, which means this render
      // definitely won't finish. Since we have a new update, let's mark it as
      // suspended now, right before marking the incoming update. This has the
      // effect of interrupting the current render and switching to the update.
      // TODO: Make sure this doesn't override pings that happen while we've
      // already started rendering.
      markRootSuspended$1(root, workInProgressRootRenderLanes);
    }
  }

  ensureRootIsScheduled(root, eventTime);

  if (
    lane === SyncLane &&
    executionContext === NoContext &&
    (fiber.mode & ConcurrentMode) === NoMode && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
    !ReactCurrentActQueue.isBatchingLegacy
  ) {
    // Flush the synchronous work now, unless we're already working or inside
    // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
    // scheduleCallbackForFiber to preserve the ability to schedule a callback
    // without immediately flushing it. We only do this for user-initiated
    // updates, to preserve historical behavior of legacy mode.
    resetRenderTimer();
    flushSyncCallbacksOnlyInLegacyMode();
  }

  return root;
} // This is split into a separate function so we can mark a fiber with pending
// work without treating it as a typical update that originates from an event;
// e.g. retrying a Suspense boundary isn't an update, but it does schedule work
// on a fiber.

function markUpdateLaneFromFiberToRoot(sourceFiber, lane) {
  // Update the source fiber's lanes
  sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane);
  var alternate = sourceFiber.alternate;

  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, lane);
  }

  {
    if (
      alternate === null &&
      (sourceFiber.flags & (Placement | Hydrating)) !== NoFlags
    ) {
      warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber);
    }
  } // Walk the parent path to the root and update the child lanes.

  var node = sourceFiber;
  var parent = sourceFiber.return;

  while (parent !== null) {
    parent.childLanes = mergeLanes(parent.childLanes, lane);
    alternate = parent.alternate;

    if (alternate !== null) {
      alternate.childLanes = mergeLanes(alternate.childLanes, lane);
    } else {
      {
        if ((parent.flags & (Placement | Hydrating)) !== NoFlags) {
          warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber);
        }
      }
    }

    node = parent;
    parent = parent.return;
  }

  if (node.tag === HostRoot) {
    var root = node.stateNode;
    return root;
  } else {
    return null;
  }
}

function isInterleavedUpdate(fiber, lane) {
  return (
    // TODO: Optimize slightly by comparing to root that fiber belongs to.
    // Requires some refactoring. Not a big deal though since it's rare for
    // concurrent apps to have more than a single root.
    workInProgressRoot !== null &&
    (fiber.mode & ConcurrentMode) !== NoMode && // If this is a render phase update (i.e. UNSAFE_componentWillReceiveProps),
    // then don't treat this as an interleaved update. This pattern is
    // accompanied by a warning but we haven't fully deprecated it yet. We can
    // remove once the deferRenderPhaseUpdateToNextBatch flag is enabled.
    (executionContext & RenderContext) === NoContext
  );
} // Use this function to schedule a task for a root. There's only one task per
// root; if a task was already scheduled, we'll check to make sure the priority
// of the existing task is the same as the priority of the next level that the
// root has work on. This function is called on every update, and right before
// exiting a task.

function ensureRootIsScheduled(root, currentTime) {
  var existingCallbackNode = root.callbackNode; // Check if any lanes are being starved by other work. If so, mark them as
  // expired so we know to work on those next.

  markStarvedLanesAsExpired(root, currentTime); // Determine the next lanes to work on, and their priority.

  var nextLanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes
  );

  if (nextLanes === NoLanes) {
    // Special case: There's nothing to work on.
    if (existingCallbackNode !== null) {
      cancelCallback$1(existingCallbackNode);
    }

    root.callbackNode = null;
    root.callbackPriority = NoLane;
    return;
  } // We use the highest priority lane to represent the priority of the callback.

  var newCallbackPriority = getHighestPriorityLane(nextLanes); // Check if there's an existing task. We may be able to reuse it.

  var existingCallbackPriority = root.callbackPriority;

  if (
    existingCallbackPriority === newCallbackPriority && // Special case related to `act`. If the currently scheduled task is a
    // Scheduler task, rather than an `act` task, cancel it and re-scheduled
    // on the `act` queue.
    !(
      ReactCurrentActQueue.current !== null &&
      existingCallbackNode !== fakeActCallbackNode
    )
  ) {
    {
      // If we're going to re-use an existing task, it needs to exist.
      // Assume that discrete update microtasks are non-cancellable and null.
      // TODO: Temporary until we confirm this warning is not fired.
      if (
        existingCallbackNode == null &&
        existingCallbackPriority !== SyncLane
      ) {
        error(
          "Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue."
        );
      }
    } // The priority hasn't changed. We can reuse the existing task. Exit.

    return;
  }

  if (existingCallbackNode != null) {
    // Cancel the existing callback. We'll schedule a new one below.
    cancelCallback$1(existingCallbackNode);
  } // Schedule a new callback.

  var newCallbackNode;

  if (newCallbackPriority === SyncLane) {
    // Special case: Sync React callbacks are scheduled on a special
    // internal queue
    if (root.tag === LegacyRoot) {
      if (ReactCurrentActQueue.isBatchingLegacy !== null) {
        ReactCurrentActQueue.didScheduleLegacyUpdate = true;
      }

      scheduleLegacySyncCallback(performSyncWorkOnRoot.bind(null, root));
    } else {
      scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
    }

    {
      // Flush the queue in an Immediate task.
      scheduleCallback$1(ImmediatePriority, flushSyncCallbacks);
    }

    newCallbackNode = null;
  } else {
    var schedulerPriorityLevel;

    switch (lanesToEventPriority(nextLanes)) {
      case DiscreteEventPriority:
        schedulerPriorityLevel = ImmediatePriority;
        break;

      case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingPriority;
        break;

      case DefaultEventPriority:
        schedulerPriorityLevel = NormalPriority;
        break;

      case IdleEventPriority:
        schedulerPriorityLevel = IdlePriority;
        break;

      default:
        schedulerPriorityLevel = NormalPriority;
        break;
    }

    newCallbackNode = scheduleCallback$1(
      schedulerPriorityLevel,
      performConcurrentWorkOnRoot.bind(null, root)
    );
  }

  root.callbackPriority = newCallbackPriority;
  root.callbackNode = newCallbackNode;
} // This is the entry point for every concurrent task, i.e. anything that
// goes through Scheduler.

function performConcurrentWorkOnRoot(root, didTimeout) {
  {
    resetNestedUpdateFlag();
  } // Since we know we're in a React event, we can clear the current
  // event time. The next update will compute a new event time.

  currentEventTime = NoTimestamp;
  currentEventTransitionLane = NoLanes;

  if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
    throw Error("Should not already be working.");
  } // Flush any pending passive effects before deciding which lanes to work on,
  // in case they schedule additional work.

  var originalCallbackNode = root.callbackNode;
  var didFlushPassiveEffects = flushPassiveEffects();

  if (didFlushPassiveEffects) {
    // Something in the passive effect phase may have canceled the current task.
    // Check if the task node for this root was changed.
    if (root.callbackNode !== originalCallbackNode) {
      // The current task was canceled. Exit. We don't need to call
      // `ensureRootIsScheduled` because the check above implies either that
      // there's a new task, or that there's no remaining work on this root.
      return null;
    }
  } // Determine the next lanes to work on, using the fields stored
  // on the root.

  var lanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes
  );

  if (lanes === NoLanes) {
    // Defensive coding. This is never expected to happen.
    return null;
  } // We disable time-slicing in some cases: if the work has been CPU-bound
  // for too long ("expired" work, to prevent starvation), or we're in
  // sync-updates-by-default mode.
  // TODO: We only check `didTimeout` defensively, to account for a Scheduler
  // bug we're still investigating. Once the bug in Scheduler is fixed,
  // we can remove this, since we track expiration ourselves.

  var exitStatus =
    shouldTimeSlice(root, lanes) && !didTimeout
      ? renderRootConcurrent(root, lanes)
      : renderRootSync(root, lanes);

  if (exitStatus !== RootIncomplete) {
    if (exitStatus === RootErrored) {
      var prevExecutionContext = executionContext;
      executionContext |= RetryAfterError; // If an error occurred during hydration,
      // discard server response and fall back to client side render.

      if (root.hydrate) {
        root.hydrate = false;

        {
          errorHydratingContainer(root.containerInfo);
        }

        clearContainer(root.containerInfo);
      } // If something threw an error, try rendering one more time. We'll render
      // synchronously to block concurrent data mutations, and we'll includes
      // all pending updates are included. If it still fails after the second
      // attempt, we'll give up and commit the resulting tree.

      var errorRetryLanes = getLanesToRetrySynchronouslyOnError(root);

      if (errorRetryLanes !== NoLanes) {
        lanes = errorRetryLanes;
        exitStatus = renderRootSync(root, errorRetryLanes);
      }

      executionContext = prevExecutionContext;
    }

    if (exitStatus === RootFatalErrored) {
      var fatalError = workInProgressRootFatalError;
      prepareFreshStack(root, NoLanes);
      markRootSuspended$1(root, lanes);
      ensureRootIsScheduled(root, now());
      throw fatalError;
    } // We now have a consistent tree. The next step is either to commit it,
    // or, if something suspended, wait to commit it after a timeout.

    var finishedWork = root.current.alternate;
    root.finishedWork = finishedWork;
    root.finishedLanes = lanes;
    finishConcurrentRender(root, exitStatus, lanes);
  }

  ensureRootIsScheduled(root, now());

  if (root.callbackNode === originalCallbackNode) {
    // The task node scheduled for this root is the same one that's
    // currently executed. Need to return a continuation.
    return performConcurrentWorkOnRoot.bind(null, root);
  }

  return null;
}

function finishConcurrentRender(root, exitStatus, lanes) {
  switch (exitStatus) {
    case RootIncomplete:
    case RootFatalErrored: {
      {
        throw Error("Root did not complete. This is a bug in React.");
      }
    }
    // Flow knows about invariant, so it complains if I add a break
    // statement, but eslint doesn't know about invariant, so it complains
    // if I do. eslint-disable-next-line no-fallthrough

    case RootErrored: {
      // We should have already attempted to retry this tree. If we reached
      // this point, it errored again. Commit it.
      commitRoot(root);
      break;
    }

    case RootSuspended: {
      markRootSuspended$1(root, lanes); // We have an acceptable loading state. We need to figure out if we
      // should immediately commit it or wait a bit.

      if (
        includesOnlyRetries(lanes) && // do not delay if we're inside an act() scope
        !shouldForceFlushFallbacksInDEV()
      ) {
        // This render only included retries, no updates. Throttle committing
        // retries so that we don't show too many loading states too quickly.
        var msUntilTimeout =
          globalMostRecentFallbackTime + FALLBACK_THROTTLE_MS - now(); // Don't bother with a very short suspense time.

        if (msUntilTimeout > 10) {
          var nextLanes = getNextLanes(root, NoLanes);

          if (nextLanes !== NoLanes) {
            // There's additional work on this root.
            break;
          }

          var suspendedLanes = root.suspendedLanes;

          if (!isSubsetOfLanes(suspendedLanes, lanes)) {
            // We should prefer to render the fallback of at the last
            // suspended level. Ping the last suspended level to try
            // rendering it again.
            // FIXME: What if the suspended lanes are Idle? Should not restart.
            var eventTime = requestEventTime();
            markRootPinged(root, suspendedLanes);
            break;
          } // The render is suspended, it hasn't timed out, and there's no
          // lower priority work to do. Instead of committing the fallback
          // immediately, wait for more data to arrive.

          root.timeoutHandle = scheduleTimeout(
            commitRoot.bind(null, root),
            msUntilTimeout
          );
          break;
        }
      } // The work expired. Commit immediately.

      commitRoot(root);
      break;
    }

    case RootSuspendedWithDelay: {
      markRootSuspended$1(root, lanes);

      if (includesOnlyTransitions(lanes)) {
        // This is a transition, so we should exit without committing a
        // placeholder and without scheduling a timeout. Delay indefinitely
        // until we receive more data.
        break;
      }

      if (!shouldForceFlushFallbacksInDEV()) {
        // This is not a transition, but we did trigger an avoided state.
        // Schedule a placeholder to display after a short delay, using the Just
        // Noticeable Difference.
        // TODO: Is the JND optimization worth the added complexity? If this is
        // the only reason we track the event time, then probably not.
        // Consider removing.
        var mostRecentEventTime = getMostRecentEventTime(root, lanes);
        var eventTimeMs = mostRecentEventTime;
        var timeElapsedMs = now() - eventTimeMs;

        var _msUntilTimeout = jnd(timeElapsedMs) - timeElapsedMs; // Don't bother with a very short suspense time.

        if (_msUntilTimeout > 10) {
          // Instead of committing the fallback immediately, wait for more data
          // to arrive.
          root.timeoutHandle = scheduleTimeout(
            commitRoot.bind(null, root),
            _msUntilTimeout
          );
          break;
        }
      } // Commit the placeholder.

      commitRoot(root);
      break;
    }

    case RootCompleted: {
      // The work completed. Ready to commit.
      commitRoot(root);
      break;
    }

    default: {
      {
        throw Error("Unknown root exit status.");
      }
    }
  }
}

function markRootSuspended$1(root, suspendedLanes) {
  // When suspending, we should always exclude lanes that were pinged or (more
  // rarely, since we try to avoid it) updated during the render phase.
  // TODO: Lol maybe there's a better way to factor this besides this
  // obnoxiously named function :)
  suspendedLanes = removeLanes(suspendedLanes, workInProgressRootPingedLanes);
  suspendedLanes = removeLanes(suspendedLanes, workInProgressRootUpdatedLanes);
  markRootSuspended(root, suspendedLanes);
} // This is the entry point for synchronous tasks that don't go
// through Scheduler

function performSyncWorkOnRoot(root) {
  {
    syncNestedUpdateFlag();
  }

  if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
    throw Error("Should not already be working.");
  }

  flushPassiveEffects();
  var lanes = getNextLanes(root, NoLanes);

  if (!includesSomeLane(lanes, SyncLane)) {
    // There's no remaining sync work left.
    ensureRootIsScheduled(root, now());
    return null;
  }

  var exitStatus = renderRootSync(root, lanes);

  if (root.tag !== LegacyRoot && exitStatus === RootErrored) {
    var prevExecutionContext = executionContext;
    executionContext |= RetryAfterError; // If an error occurred during hydration,
    // discard server response and fall back to client side render.

    if (root.hydrate) {
      root.hydrate = false;

      {
        errorHydratingContainer(root.containerInfo);
      }

      clearContainer(root.containerInfo);
    } // If something threw an error, try rendering one more time. We'll render
    // synchronously to block concurrent data mutations, and we'll includes
    // all pending updates are included. If it still fails after the second
    // attempt, we'll give up and commit the resulting tree.

    var errorRetryLanes = getLanesToRetrySynchronouslyOnError(root);

    if (errorRetryLanes !== NoLanes) {
      lanes = errorRetryLanes;
      exitStatus = renderRootSync(root, lanes);
    }

    executionContext = prevExecutionContext;
  }

  if (exitStatus === RootFatalErrored) {
    var fatalError = workInProgressRootFatalError;
    prepareFreshStack(root, NoLanes);
    markRootSuspended$1(root, lanes);
    ensureRootIsScheduled(root, now());
    throw fatalError;
  } // We now have a consistent tree. Because this is a sync render, we
  // will commit it even if something suspended.

  var finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  root.finishedLanes = lanes;
  commitRoot(root); // Before exiting, make sure there's a callback scheduled for the next
  // pending level.

  ensureRootIsScheduled(root, now());
  return null;
}
function batchedUpdates$1(fn, a) {
  var prevExecutionContext = executionContext;
  executionContext |= BatchedContext;

  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext; // If there were legacy sync updates, flush them at the end of the outer
    // most batchedUpdates-like method.

    if (
      executionContext === NoContext && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !ReactCurrentActQueue.isBatchingLegacy
    ) {
      resetRenderTimer();
      flushSyncCallbacksOnlyInLegacyMode();
    }
  }
}
// Warning, this opts-out of checking the function body.

// eslint-disable-next-line no-redeclare
function flushSyncWithoutWarningIfAlreadyRendering(fn) {
  // In legacy mode, we flush pending passive effects at the beginning of the
  // next event, not at the end of the previous one.
  if (
    rootWithPendingPassiveEffects !== null &&
    rootWithPendingPassiveEffects.tag === LegacyRoot &&
    (executionContext & (RenderContext | CommitContext)) === NoContext
  ) {
    flushPassiveEffects();
  }

  var prevExecutionContext = executionContext;
  executionContext |= BatchedContext;
  var prevTransition = ReactCurrentBatchConfig$2.transition;
  var previousPriority = getCurrentUpdatePriority();

  try {
    ReactCurrentBatchConfig$2.transition = 0;
    setCurrentUpdatePriority(DiscreteEventPriority);

    if (fn) {
      return fn();
    } else {
      return undefined;
    }
  } finally {
    setCurrentUpdatePriority(previousPriority);
    ReactCurrentBatchConfig$2.transition = prevTransition;
    executionContext = prevExecutionContext; // Flush the immediate callbacks that were scheduled during this batch.
    // Note that this will happen even if batchedUpdates is higher up
    // the stack.

    if ((executionContext & (RenderContext | CommitContext)) === NoContext) {
      flushSyncCallbacks();
    }
  }
} // Overload the definition to the two valid signatures.
// Warning, this opts-out of checking the function body.

// eslint-disable-next-line no-redeclare
function flushSync(fn) {
  {
    if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
      error(
        "flushSync was called from inside a lifecycle method. React cannot " +
          "flush when React is already rendering. Consider moving this call to " +
          "a scheduler task or micro task."
      );
    }
  }

  return flushSyncWithoutWarningIfAlreadyRendering(fn);
}
function pushRenderLanes(fiber, lanes) {
  push(subtreeRenderLanesCursor, subtreeRenderLanes, fiber);
  subtreeRenderLanes = mergeLanes(subtreeRenderLanes, lanes);
  workInProgressRootIncludedLanes = mergeLanes(
    workInProgressRootIncludedLanes,
    lanes
  );
}
function popRenderLanes(fiber) {
  subtreeRenderLanes = subtreeRenderLanesCursor.current;
  pop(subtreeRenderLanesCursor, fiber);
}

function prepareFreshStack(root, lanes) {
  root.finishedWork = null;
  root.finishedLanes = NoLanes;
  var timeoutHandle = root.timeoutHandle;

  if (timeoutHandle !== noTimeout) {
    // The root previous suspended and scheduled a timeout to commit a fallback
    // state. Now that we have additional work, cancel the timeout.
    root.timeoutHandle = noTimeout; // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above

    cancelTimeout(timeoutHandle);
  }

  if (workInProgress !== null) {
    var interruptedWork = workInProgress.return;

    while (interruptedWork !== null) {
      unwindInterruptedWork(interruptedWork);
      interruptedWork = interruptedWork.return;
    }
  }

  workInProgressRoot = root;
  workInProgress = createWorkInProgress(root.current, null);
  workInProgressRootRenderLanes = subtreeRenderLanes = workInProgressRootIncludedLanes = lanes;
  workInProgressRootExitStatus = RootIncomplete;
  workInProgressRootFatalError = null;
  workInProgressRootSkippedLanes = NoLanes;
  workInProgressRootUpdatedLanes = NoLanes;
  workInProgressRootPingedLanes = NoLanes;
  enqueueInterleavedUpdates();

  {
    ReactStrictModeWarnings.discardPendingWarnings();
  }
}

function handleError(root, thrownValue) {
  do {
    var erroredWork = workInProgress;

    try {
      // Reset module-level state that was set during the render phase.
      resetContextDependencies();
      resetHooksAfterThrow();
      resetCurrentFiber(); // TODO: I found and added this missing line while investigating a
      // separate issue. Write a regression test using string refs.

      ReactCurrentOwner$2.current = null;

      if (erroredWork === null || erroredWork.return === null) {
        // Expected to be working on a non-root fiber. This is a fatal error
        // because there's no ancestor that can handle it; the root is
        // supposed to capture all errors that weren't caught by an error
        // boundary.
        workInProgressRootExitStatus = RootFatalErrored;
        workInProgressRootFatalError = thrownValue; // Set `workInProgress` to null. This represents advancing to the next
        // sibling, or the parent if there are no siblings. But since the root
        // has no siblings nor a parent, we set it to null. Usually this is
        // handled by `completeUnitOfWork` or `unwindWork`, but since we're
        // intentionally not calling those, we need set it here.
        // TODO: Consider calling `unwindWork` to pop the contexts.

        workInProgress = null;
        return;
      }

      if (enableProfilerTimer && erroredWork.mode & ProfileMode) {
        // Record the time spent rendering before an error was thrown. This
        // avoids inaccurate Profiler durations in the case of a
        // suspended render.
        stopProfilerTimerIfRunningAndRecordDelta(erroredWork, true);
      }

      throwException(
        root,
        erroredWork.return,
        erroredWork,
        thrownValue,
        workInProgressRootRenderLanes
      );
      completeUnitOfWork(erroredWork);
    } catch (yetAnotherThrownValue) {
      // Something in the return path also threw.
      thrownValue = yetAnotherThrownValue;

      if (workInProgress === erroredWork && erroredWork !== null) {
        // If this boundary has already errored, then we had trouble processing
        // the error. Bubble it to the next boundary.
        erroredWork = erroredWork.return;
        workInProgress = erroredWork;
      } else {
        erroredWork = workInProgress;
      }

      continue;
    } // Return to the normal work loop.

    return;
  } while (true);
}

function pushDispatcher() {
  var prevDispatcher = ReactCurrentDispatcher$2.current;
  ReactCurrentDispatcher$2.current = ContextOnlyDispatcher;

  if (prevDispatcher === null) {
    // The React isomorphic package does not include a default dispatcher.
    // Instead the first renderer will lazily attach one, in order to give
    // nicer error messages.
    return ContextOnlyDispatcher;
  } else {
    return prevDispatcher;
  }
}

function popDispatcher(prevDispatcher) {
  ReactCurrentDispatcher$2.current = prevDispatcher;
}

function markCommitTimeOfFallback() {
  globalMostRecentFallbackTime = now();
}
function markSkippedUpdateLanes(lane) {
  workInProgressRootSkippedLanes = mergeLanes(
    lane,
    workInProgressRootSkippedLanes
  );
}
function renderDidSuspend() {
  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootSuspended;
  }
}
function renderDidSuspendDelayIfPossible() {
  if (
    workInProgressRootExitStatus === RootIncomplete ||
    workInProgressRootExitStatus === RootSuspended
  ) {
    workInProgressRootExitStatus = RootSuspendedWithDelay;
  } // Check if there are updates that we skipped tree that might have unblocked
  // this render.

  if (
    workInProgressRoot !== null &&
    (includesNonIdleWork(workInProgressRootSkippedLanes) ||
      includesNonIdleWork(workInProgressRootUpdatedLanes))
  ) {
    // Mark the current render as suspended so that we switch to working on
    // the updates that were skipped. Usually we only suspend at the end of
    // the render phase.
    // TODO: We should probably always mark the root as suspended immediately
    // (inside this function), since by suspending at the end of the render
    // phase introduces a potential mistake where we suspend lanes that were
    // pinged or updated while we were rendering.
    markRootSuspended$1(workInProgressRoot, workInProgressRootRenderLanes);
  }
}
function renderDidError() {
  if (workInProgressRootExitStatus !== RootCompleted) {
    workInProgressRootExitStatus = RootErrored;
  }
} // Called during render to determine if anything has suspended.
// Returns false if we're not sure.

function renderHasNotSuspendedYet() {
  // If something errored or completed, we can't really be sure,
  // so those are false.
  return workInProgressRootExitStatus === RootIncomplete;
}

function renderRootSync(root, lanes) {
  var prevExecutionContext = executionContext;
  executionContext |= RenderContext;
  var prevDispatcher = pushDispatcher(); // If the root or lanes have changed, throw out the existing stack
  // and prepare a fresh one. Otherwise we'll continue where we left off.

  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    {
      if (isDevToolsPresent) {
        var memoizedUpdaters = root.memoizedUpdaters;

        if (memoizedUpdaters.size > 0) {
          restorePendingUpdaters(root, workInProgressRootRenderLanes);
          memoizedUpdaters.clear();
        } // At this point, move Fibers that scheduled the upcoming work from the Map to the Set.
        // If we bailout on this work, we'll move them back (like above).
        // It's important to move them now in case the work spawns more work at the same priority with different updaters.
        // That way we can keep the current update and future updates separate.

        movePendingFibersToMemoized(root, lanes);
      }
    }

    prepareFreshStack(root, lanes);
  }

  do {
    try {
      workLoopSync();
      break;
    } catch (thrownValue) {
      handleError(root, thrownValue);
    }
  } while (true);

  resetContextDependencies();
  executionContext = prevExecutionContext;
  popDispatcher(prevDispatcher);

  if (workInProgress !== null) {
    // This is a sync render, so we should have finished the whole tree.
    {
      throw Error(
        "Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue."
      );
    }
  }

  workInProgressRoot = null;
  workInProgressRootRenderLanes = NoLanes;
  return workInProgressRootExitStatus;
} // The work loop is an extremely hot path. Tell Closure not to inline it.

/** @noinline */

function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function renderRootConcurrent(root, lanes) {
  var prevExecutionContext = executionContext;
  executionContext |= RenderContext;
  var prevDispatcher = pushDispatcher(); // If the root or lanes have changed, throw out the existing stack
  // and prepare a fresh one. Otherwise we'll continue where we left off.

  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    {
      if (isDevToolsPresent) {
        var memoizedUpdaters = root.memoizedUpdaters;

        if (memoizedUpdaters.size > 0) {
          restorePendingUpdaters(root, workInProgressRootRenderLanes);
          memoizedUpdaters.clear();
        } // At this point, move Fibers that scheduled the upcoming work from the Map to the Set.
        // If we bailout on this work, we'll move them back (like above).
        // It's important to move them now in case the work spawns more work at the same priority with different updaters.
        // That way we can keep the current update and future updates separate.

        movePendingFibersToMemoized(root, lanes);
      }
    }

    resetRenderTimer();
    prepareFreshStack(root, lanes);
  }

  do {
    try {
      workLoopConcurrent();
      break;
    } catch (thrownValue) {
      handleError(root, thrownValue);
    }
  } while (true);

  resetContextDependencies();
  popDispatcher(prevDispatcher);
  executionContext = prevExecutionContext;

  if (workInProgress !== null) {
    return RootIncomplete;
  } else {
    workInProgressRoot = null;
    workInProgressRootRenderLanes = NoLanes; // Return the final exit status.

    return workInProgressRootExitStatus;
  }
}
/** @noinline */

function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  // The current, flushed, state of this fiber is the alternate. Ideally
  // nothing should rely on this, but relying on it here means that we don't
  // need an additional field on the work in progress.
  var current = unitOfWork.alternate;
  setCurrentFiber(unitOfWork);
  var next;

  if ((unitOfWork.mode & ProfileMode) !== NoMode) {
    startProfilerTimer(unitOfWork);
    next = beginWork$1(current, unitOfWork, subtreeRenderLanes);
    stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
  } else {
    next = beginWork$1(current, unitOfWork, subtreeRenderLanes);
  }

  resetCurrentFiber();
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }

  ReactCurrentOwner$2.current = null;
}

function completeUnitOfWork(unitOfWork) {
  // Attempt to complete the current unit of work, then move to the next
  // sibling. If there are no more siblings, return to the parent fiber.
  var completedWork = unitOfWork;

  do {
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    var current = completedWork.alternate;
    var returnFiber = completedWork.return; // Check if the work completed or if something threw.

    if ((completedWork.flags & Incomplete) === NoFlags) {
      setCurrentFiber(completedWork);
      var next = void 0;

      if ((completedWork.mode & ProfileMode) === NoMode) {
        next = completeWork(current, completedWork, subtreeRenderLanes);
      } else {
        startProfilerTimer(completedWork);
        next = completeWork(current, completedWork, subtreeRenderLanes); // Update render duration assuming we didn't error.

        stopProfilerTimerIfRunningAndRecordDelta(completedWork, false);
      }

      resetCurrentFiber();

      if (next !== null) {
        // Completing this fiber spawned new work. Work on that next.
        workInProgress = next;
        return;
      }
    } else {
      // This fiber did not complete because something threw. Pop values off
      // the stack without entering the complete phase. If this is a boundary,
      // capture values if possible.
      var _next = unwindWork(completedWork); // Because this fiber did not complete, don't reset its lanes.

      if (_next !== null) {
        // If completing this work spawned new work, do that next. We'll come
        // back here again.
        // Since we're restarting, remove anything that is not a host effect
        // from the effect tag.
        _next.flags &= HostEffectMask;
        workInProgress = _next;
        return;
      }

      if ((completedWork.mode & ProfileMode) !== NoMode) {
        // Record the render duration for the fiber that errored.
        stopProfilerTimerIfRunningAndRecordDelta(completedWork, false); // Include the time spent working on failed children before continuing.

        var actualDuration = completedWork.actualDuration;
        var child = completedWork.child;

        while (child !== null) {
          actualDuration += child.actualDuration;
          child = child.sibling;
        }

        completedWork.actualDuration = actualDuration;
      }

      if (returnFiber !== null) {
        // Mark the parent fiber as incomplete and clear its subtree flags.
        returnFiber.flags |= Incomplete;
        returnFiber.subtreeFlags = NoFlags;
        returnFiber.deletions = null;
      }
    }

    var siblingFiber = completedWork.sibling;

    if (siblingFiber !== null) {
      // If there is more work to do in this returnFiber, do that next.
      workInProgress = siblingFiber;
      return;
    } // Otherwise, return to the parent

    completedWork = returnFiber; // Update the next thing we're working on in case something throws.

    workInProgress = completedWork;
  } while (completedWork !== null); // We've reached the root.

  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootCompleted;
  }
}

function commitRoot(root) {
  // TODO: This no longer makes any sense. We already wrap the mutation and
  // layout phases. Should be able to remove.
  var previousUpdateLanePriority = getCurrentUpdatePriority();
  var prevTransition = ReactCurrentBatchConfig$2.transition;

  try {
    ReactCurrentBatchConfig$2.transition = 0;
    setCurrentUpdatePriority(DiscreteEventPriority);
    commitRootImpl(root, previousUpdateLanePriority);
  } finally {
    ReactCurrentBatchConfig$2.transition = prevTransition;
    setCurrentUpdatePriority(previousUpdateLanePriority);
  }

  return null;
}

function commitRootImpl(root, renderPriorityLevel) {
  do {
    // `flushPassiveEffects` will call `flushSyncUpdateQueue` at the end, which
    // means `flushPassiveEffects` will sometimes result in additional
    // passive effects. So we need to keep flushing in a loop until there are
    // no more pending effects.
    // TODO: Might be better if `flushPassiveEffects` did not automatically
    // flush synchronous work at the end, to avoid factoring hazards like this.
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);

  flushRenderPhaseStrictModeWarningsInDEV();

  if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
    throw Error("Should not already be working.");
  }

  var finishedWork = root.finishedWork;
  var lanes = root.finishedLanes;

  if (finishedWork === null) {
    return null;
  } else {
    {
      if (lanes === NoLanes) {
        error(
          "root.finishedLanes should not be empty during a commit. This is a " +
            "bug in React."
        );
      }
    }
  }

  root.finishedWork = null;
  root.finishedLanes = NoLanes;

  if (!(finishedWork !== root.current)) {
    throw Error(
      "Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue."
    );
  } // commitRoot never returns a continuation; it always finishes synchronously.
  // So we can clear these now to allow a new callback to be scheduled.

  root.callbackNode = null;
  root.callbackPriority = NoLane; // Update the first and last pending times on this root. The new first
  // pending time is whatever is left on the root fiber.

  var remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  markRootFinished(root, remainingLanes);

  if (root === workInProgressRoot) {
    // We can reset these now that they are finished.
    workInProgressRoot = null;
    workInProgress = null;
    workInProgressRootRenderLanes = NoLanes;
  } // If there are pending passive effects, schedule a callback to process them.
  // Do this as early as possible, so it is queued before anything else that
  // might get scheduled in the commit phase. (See #16714.)
  // TODO: Delete all other places that schedule the passive effect callback
  // They're redundant.

  if (
    (finishedWork.subtreeFlags & PassiveMask) !== NoFlags ||
    (finishedWork.flags & PassiveMask) !== NoFlags
  ) {
    if (!rootDoesHavePassiveEffects) {
      rootDoesHavePassiveEffects = true;
      scheduleCallback$1(NormalPriority, function() {
        flushPassiveEffects();
        return null;
      });
    }
  } // Check if there are any effects in the whole tree.
  // TODO: This is left over from the effect list implementation, where we had
  // to check for the existence of `firstEffect` to satisfy Flow. I think the
  // only other reason this optimization exists is because it affects profiling.
  // Reconsider whether this is necessary.

  var subtreeHasEffects =
    (finishedWork.subtreeFlags &
      (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !==
    NoFlags;
  var rootHasEffect =
    (finishedWork.flags &
      (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !==
    NoFlags;

  if (subtreeHasEffects || rootHasEffect) {
    var prevTransition = ReactCurrentBatchConfig$2.transition;
    ReactCurrentBatchConfig$2.transition = 0;
    var previousPriority = getCurrentUpdatePriority();
    setCurrentUpdatePriority(DiscreteEventPriority);
    var prevExecutionContext = executionContext;
    executionContext |= CommitContext; // Reset this to null before calling lifecycles

    ReactCurrentOwner$2.current = null; // The commit phase is broken into several sub-phases. We do a separate pass
    // of the effect list for each phase: all mutation effects come before all
    // layout effects, and so on.
    // The first phase a "before mutation" phase. We use this phase to read the
    // state of the host tree right before we mutate it. This is where
    // getSnapshotBeforeUpdate is called.

    var shouldFireAfterActiveInstanceBlur = commitBeforeMutationEffects(
      root,
      finishedWork
    );

    {
      // Mark the current commit time to be shared by all Profilers in this
      // batch. This enables them to be grouped later.
      recordCommitTime();
    }

    commitMutationEffects(root, finishedWork, lanes);

    resetAfterCommit(root.containerInfo); // The work-in-progress tree is now the current tree. This must come after
    // the mutation phase, so that the previous tree is still current during
    // componentWillUnmount, but before the layout phase, so that the finished
    // work is current during componentDidMount/Update.

    root.current = finishedWork; // The next phase is the layout phase, where we call effects that read

    commitLayoutEffects(finishedWork, root, lanes);
    // opportunity to paint.

    requestPaint();
    executionContext = prevExecutionContext; // Reset the priority to the previous non-sync value.

    setCurrentUpdatePriority(previousPriority);
    ReactCurrentBatchConfig$2.transition = prevTransition;
  } else {
    // No effects.
    root.current = finishedWork; // Measure these anyway so the flamegraph explicitly shows that there were
    // no effects.
    // TODO: Maybe there's a better way to report this.

    {
      recordCommitTime();
    }
  }

  var rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

  if (rootDoesHavePassiveEffects) {
    // This commit has passive effects. Stash a reference to them. But don't
    // schedule a callback until after flushing layout work.
    rootDoesHavePassiveEffects = false;
    rootWithPendingPassiveEffects = root;
    pendingPassiveEffectsLanes = lanes;
  } // Read this again, since an effect might have updated it

  remainingLanes = root.pendingLanes; // Check if there's remaining work on this root

  if (remainingLanes === NoLanes) {
    // If there's no remaining work, we can clear the set of already failed
    // error boundaries.
    legacyErrorBoundariesThatAlreadyFailed = null;
  }

  {
    if (!rootDidHavePassiveEffects) {
      commitDoubleInvokeEffectsInDEV(root.current, false);
    }
  }

  if (includesSomeLane(remainingLanes, SyncLane)) {
    {
      markNestedUpdateScheduled();
    } // Count the number of times the root synchronously re-renders without
    // finishing. If there are too many, it indicates an infinite update loop.

    if (root === rootWithNestedUpdates) {
      nestedUpdateCount++;
    } else {
      nestedUpdateCount = 0;
      rootWithNestedUpdates = root;
    }
  } else {
    nestedUpdateCount = 0;
  }

  onCommitRoot(finishedWork.stateNode, renderPriorityLevel);

  {
    if (isDevToolsPresent) {
      root.memoizedUpdaters.clear();
    }
  }
  // additional work on this root is scheduled.

  ensureRootIsScheduled(root, now());

  if (hasUncaughtError) {
    hasUncaughtError = false;
    var error$1 = firstUncaughtError;
    firstUncaughtError = null;
    throw error$1;
  } // If the passive effects are the result of a discrete render, flush them
  // synchronously at the end of the current task so that the result is
  // immediately observable. Otherwise, we assume that they are not
  // order-dependent and do not need to be observed by external systems, so we
  // can wait until after paint.
  // TODO: We can optimize this by not scheduling the callback earlier. Since we
  // currently schedule the callback in multiple places, will wait until those
  // are consolidated.

  if (
    includesSomeLane(pendingPassiveEffectsLanes, SyncLane) &&
    root.tag !== LegacyRoot
  ) {
    flushPassiveEffects();
  } // If layout work was scheduled, flush it now.

  flushSyncCallbacks();

  return null;
}

function flushPassiveEffects() {
  // Returns whether passive effects were flushed.
  // TODO: Combine this check with the one in flushPassiveEFfectsImpl. We should
  // probably just combine the two functions. I believe they were only separate
  // in the first place because we used to wrap it with
  // `Scheduler.runWithPriority`, which accepts a function. But now we track the
  // priority within React itself, so we can mutate the variable directly.
  if (rootWithPendingPassiveEffects !== null) {
    var renderPriority = lanesToEventPriority(pendingPassiveEffectsLanes);
    var priority = lowerEventPriority(DefaultEventPriority, renderPriority);
    var prevTransition = ReactCurrentBatchConfig$2.transition;
    var previousPriority = getCurrentUpdatePriority();

    try {
      ReactCurrentBatchConfig$2.transition = 0;
      setCurrentUpdatePriority(priority);
      return flushPassiveEffectsImpl();
    } finally {
      setCurrentUpdatePriority(previousPriority);
      ReactCurrentBatchConfig$2.transition = prevTransition;
    }
  }

  return false;
}
function enqueuePendingPassiveProfilerEffect(fiber) {
  {
    pendingPassiveProfilerEffects.push(fiber);

    if (!rootDoesHavePassiveEffects) {
      rootDoesHavePassiveEffects = true;
      scheduleCallback$1(NormalPriority, function() {
        flushPassiveEffects();
        return null;
      });
    }
  }
}

function flushPassiveEffectsImpl() {
  if (rootWithPendingPassiveEffects === null) {
    return false;
  }

  var root = rootWithPendingPassiveEffects;
  rootWithPendingPassiveEffects = null; // TODO: This is sometimes out of sync with rootWithPendingPassiveEffects.
  // Figure out why and fix it. It's not causing any known issues (probably
  // because it's only used for profiling), but it's a refactor hazard.

  pendingPassiveEffectsLanes = NoLanes;

  if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
    throw Error("Cannot flush passive effects while already rendering.");
  }

  var prevExecutionContext = executionContext;
  executionContext |= CommitContext;
  commitPassiveUnmountEffects(root.current);
  commitPassiveMountEffects(root, root.current); // TODO: Move to commitPassiveMountEffects

  {
    var profilerEffects = pendingPassiveProfilerEffects;
    pendingPassiveProfilerEffects = [];

    for (var i = 0; i < profilerEffects.length; i++) {
      var _fiber = profilerEffects[i];
      commitPassiveEffectDurations(root, _fiber);
    }
  }

  {
    commitDoubleInvokeEffectsInDEV(root.current, true);
  }

  executionContext = prevExecutionContext;
  flushSyncCallbacks(); // If additional passive effects were scheduled, increment a counter. If this
  // exceeds the limit, we'll fire a warning.

  nestedPassiveUpdateCount =
    rootWithPendingPassiveEffects === null ? 0 : nestedPassiveUpdateCount + 1; // TODO: Move to commitPassiveMountEffects

  onPostCommitRoot(root);

  {
    var stateNode = root.current.stateNode;
    stateNode.effectDuration = 0;
    stateNode.passiveEffectDuration = 0;
  }

  return true;
}

function isAlreadyFailedLegacyErrorBoundary(instance) {
  return (
    legacyErrorBoundariesThatAlreadyFailed !== null &&
    legacyErrorBoundariesThatAlreadyFailed.has(instance)
  );
}
function markLegacyErrorBoundaryAsFailed(instance) {
  if (legacyErrorBoundariesThatAlreadyFailed === null) {
    legacyErrorBoundariesThatAlreadyFailed = new Set([instance]);
  } else {
    legacyErrorBoundariesThatAlreadyFailed.add(instance);
  }
}

function prepareToThrowUncaughtError(error) {
  if (!hasUncaughtError) {
    hasUncaughtError = true;
    firstUncaughtError = error;
  }
}

var onUncaughtError = prepareToThrowUncaughtError;

function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
  var errorInfo = createCapturedValue(error, sourceFiber);
  var update = createRootErrorUpdate(rootFiber, errorInfo, SyncLane);
  enqueueUpdate(rootFiber, update);
  var eventTime = requestEventTime();
  var root = markUpdateLaneFromFiberToRoot(rootFiber, SyncLane);

  if (root !== null) {
    markRootUpdated(root, SyncLane, eventTime);
    ensureRootIsScheduled(root, eventTime);
  }
}

function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error$1) {
  if (sourceFiber.tag === HostRoot) {
    // Error was thrown at the root. There is no parent, so the root
    // itself should capture it.
    captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error$1);
    return;
  }

  var fiber = null;

  {
    fiber = sourceFiber.return;
  }

  while (fiber !== null) {
    if (fiber.tag === HostRoot) {
      captureCommitPhaseErrorOnRoot(fiber, sourceFiber, error$1);
      return;
    } else if (fiber.tag === ClassComponent) {
      var ctor = fiber.type;
      var instance = fiber.stateNode;

      if (
        typeof ctor.getDerivedStateFromError === "function" ||
        (typeof instance.componentDidCatch === "function" &&
          !isAlreadyFailedLegacyErrorBoundary(instance))
      ) {
        var errorInfo = createCapturedValue(error$1, sourceFiber);
        var update = createClassErrorUpdate(fiber, errorInfo, SyncLane);
        enqueueUpdate(fiber, update);
        var eventTime = requestEventTime();
        var root = markUpdateLaneFromFiberToRoot(fiber, SyncLane);

        if (root !== null) {
          markRootUpdated(root, SyncLane, eventTime);
          ensureRootIsScheduled(root, eventTime);
        }

        return;
      }
    }

    fiber = fiber.return;
  }

  {
    // TODO: Until we re-land skipUnmountedBoundaries (see #20147), this warning
    // will fire for errors that are thrown by destroy functions inside deleted
    // trees. What it should instead do is propagate the error to the parent of
    // the deleted tree. In the meantime, do not add this warning to the
    // allowlist; this is only for our internal use.
    error(
      "Internal React error: Attempted to capture a commit phase error " +
        "inside a detached tree. This indicates a bug in React. Likely " +
        "causes include deleting the same fiber more than once, committing an " +
        "already-finished tree, or an inconsistent return pointer.\n\n" +
        "Error message:\n\n%s",
      error$1
    );
  }
}
function pingSuspendedRoot(root, wakeable, pingedLanes) {
  var pingCache = root.pingCache;

  if (pingCache !== null) {
    // The wakeable resolved, so we no longer need to memoize, because it will
    // never be thrown again.
    pingCache.delete(wakeable);
  }

  var eventTime = requestEventTime();
  markRootPinged(root, pingedLanes);

  if (
    workInProgressRoot === root &&
    isSubsetOfLanes(workInProgressRootRenderLanes, pingedLanes)
  ) {
    // Received a ping at the same priority level at which we're currently
    // rendering. We might want to restart this render. This should mirror
    // the logic of whether or not a root suspends once it completes.
    // TODO: If we're rendering sync either due to Sync, Batched or expired,
    // we should probably never restart.
    // If we're suspended with delay, or if it's a retry, we'll always suspend
    // so we can always restart.
    if (
      workInProgressRootExitStatus === RootSuspendedWithDelay ||
      (workInProgressRootExitStatus === RootSuspended &&
        includesOnlyRetries(workInProgressRootRenderLanes) &&
        now() - globalMostRecentFallbackTime < FALLBACK_THROTTLE_MS)
    ) {
      // Restart from the root.
      prepareFreshStack(root, NoLanes);
    } else {
      // Even though we can't restart right now, we might get an
      // opportunity later. So we mark this render as having a ping.
      workInProgressRootPingedLanes = mergeLanes(
        workInProgressRootPingedLanes,
        pingedLanes
      );
    }
  }

  ensureRootIsScheduled(root, eventTime);
}

function retryTimedOutBoundary(boundaryFiber, retryLane) {
  // The boundary fiber (a Suspense component or SuspenseList component)
  // previously was rendered in its fallback state. One of the promises that
  // suspended it has resolved, which means at least part of the tree was
  // likely unblocked. Try rendering again, at a new lanes.
  if (retryLane === NoLane) {
    // TODO: Assign this to `suspenseState.retryLane`? to avoid
    // unnecessary entanglement?
    retryLane = requestRetryLane(boundaryFiber);
  } // TODO: Special case idle priority?

  var eventTime = requestEventTime();
  var root = markUpdateLaneFromFiberToRoot(boundaryFiber, retryLane);

  if (root !== null) {
    markRootUpdated(root, retryLane, eventTime);
    ensureRootIsScheduled(root, eventTime);
  }
}
function resolveRetryWakeable(boundaryFiber, wakeable) {
  var retryLane = NoLane; // Default

  var retryCache;

  {
    retryCache = boundaryFiber.stateNode;
  }

  if (retryCache !== null) {
    // The wakeable resolved, so we no longer need to memoize, because it will
    // never be thrown again.
    retryCache.delete(wakeable);
  }

  retryTimedOutBoundary(boundaryFiber, retryLane);
} // Computes the next Just Noticeable Difference (JND) boundary.
// The theory is that a person can't tell the difference between small differences in time.
// Therefore, if we wait a bit longer than necessary that won't translate to a noticeable
// difference in the experience. However, waiting for longer might mean that we can avoid
// showing an intermediate loading state. The longer we have already waited, the harder it
// is to tell small differences in time. Therefore, the longer we've already waited,
// the longer we can wait additionally. At some point we have to give up though.
// We pick a train model where the next boundary commits at a consistent schedule.
// These particular numbers are vague estimates. We expect to adjust them based on research.

function jnd(timeElapsed) {
  return timeElapsed < 120
    ? 120
    : timeElapsed < 480
    ? 480
    : timeElapsed < 1080
    ? 1080
    : timeElapsed < 1920
    ? 1920
    : timeElapsed < 3000
    ? 3000
    : timeElapsed < 4320
    ? 4320
    : ceil(timeElapsed / 1960) * 1960;
}

function checkForNestedUpdates() {
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    nestedUpdateCount = 0;
    rootWithNestedUpdates = null;

    {
      throw Error(
        "Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops."
      );
    }
  }

  {
    if (nestedPassiveUpdateCount > NESTED_PASSIVE_UPDATE_LIMIT) {
      nestedPassiveUpdateCount = 0;

      error(
        "Maximum update depth exceeded. This can happen when a component " +
          "calls setState inside useEffect, but useEffect either doesn't " +
          "have a dependency array, or one of the dependencies changes on " +
          "every render."
      );
    }
  }
}

function flushRenderPhaseStrictModeWarningsInDEV() {
  {
    ReactStrictModeWarnings.flushLegacyContextWarning();

    {
      ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings();
    }
  }
}

function commitDoubleInvokeEffectsInDEV(fiber, hasPassiveEffects) {
  {
    // TODO (StrictEffects) Should we set a marker on the root if it contains strict effects
    // so we don't traverse unnecessarily? similar to subtreeFlags but just at the root level.
    // Maybe not a big deal since this is DEV only behavior.
    setCurrentFiber(fiber);
    invokeEffectsInDev(fiber, MountLayoutDev, invokeLayoutEffectUnmountInDEV);

    if (hasPassiveEffects) {
      invokeEffectsInDev(
        fiber,
        MountPassiveDev,
        invokePassiveEffectUnmountInDEV
      );
    }

    invokeEffectsInDev(fiber, MountLayoutDev, invokeLayoutEffectMountInDEV);

    if (hasPassiveEffects) {
      invokeEffectsInDev(fiber, MountPassiveDev, invokePassiveEffectMountInDEV);
    }

    resetCurrentFiber();
  }
}

function invokeEffectsInDev(firstChild, fiberFlags, invokeEffectFn) {
  {
    // We don't need to re-check StrictEffectsMode here.
    // This function is only called if that check has already passed.
    var current = firstChild;
    var subtreeRoot = null;

    while (current !== null) {
      var primarySubtreeFlag = current.subtreeFlags & fiberFlags;

      if (
        current !== subtreeRoot &&
        current.child !== null &&
        primarySubtreeFlag !== NoFlags
      ) {
        current = current.child;
      } else {
        if ((current.flags & fiberFlags) !== NoFlags) {
          invokeEffectFn(current);
        }

        if (current.sibling !== null) {
          current = current.sibling;
        } else {
          current = subtreeRoot = current.return;
        }
      }
    }
  }
}

var didWarnStateUpdateForNotYetMountedComponent = null;

function warnAboutUpdateOnNotYetMountedFiberInDEV(fiber) {
  {
    if ((executionContext & RenderContext) !== NoContext) {
      // We let the other warning about render phase updates deal with this one.
      return;
    }

    if (!(fiber.mode & ConcurrentMode)) {
      return;
    }

    var tag = fiber.tag;

    if (
      tag !== IndeterminateComponent &&
      tag !== HostRoot &&
      tag !== ClassComponent &&
      tag !== FunctionComponent &&
      tag !== ForwardRef &&
      tag !== MemoComponent &&
      tag !== SimpleMemoComponent
    ) {
      // Only warn for user-defined components, not internal ones like Suspense.
      return;
    } // We show the whole stack but dedupe on the top component's name because
    // the problematic code almost always lies inside that component.

    var componentName = getComponentNameFromFiber(fiber) || "ReactComponent";

    if (didWarnStateUpdateForNotYetMountedComponent !== null) {
      if (didWarnStateUpdateForNotYetMountedComponent.has(componentName)) {
        return;
      }

      didWarnStateUpdateForNotYetMountedComponent.add(componentName);
    } else {
      didWarnStateUpdateForNotYetMountedComponent = new Set([componentName]);
    }

    var previousFiber = current;

    try {
      setCurrentFiber(fiber);

      error(
        "Can't perform a React state update on a component that hasn't mounted yet. " +
          "This indicates that you have a side-effect in your render function that " +
          "asynchronously later calls tries to update the component. Move this work to " +
          "useEffect instead."
      );
    } finally {
      if (previousFiber) {
        setCurrentFiber(fiber);
      } else {
        resetCurrentFiber();
      }
    }
  }
}

var beginWork$1;

{
  var dummyFiber = null;

  beginWork$1 = function(current, unitOfWork, lanes) {
    // If a component throws an error, we replay it again in a synchronously
    // dispatched event, so that the debugger will treat it as an uncaught
    // error See ReactErrorUtils for more information.
    // Before entering the begin phase, copy the work-in-progress onto a dummy
    // fiber. If beginWork throws, we'll use this to reset the state.
    var originalWorkInProgressCopy = assignFiberPropertiesInDEV(
      dummyFiber,
      unitOfWork
    );

    try {
      return beginWork(current, unitOfWork, lanes);
    } catch (originalError) {
      if (
        originalError !== null &&
        typeof originalError === "object" &&
        typeof originalError.then === "function"
      ) {
        // Don't replay promises. Treat everything else like an error.
        throw originalError;
      } // Keep this code in sync with handleError; any changes here must have
      // corresponding changes there.

      resetContextDependencies();
      resetHooksAfterThrow(); // Don't reset current debug fiber, since we're about to work on the
      // same fiber again.
      // Unwind the failed stack frame

      unwindInterruptedWork(unitOfWork); // Restore the original properties of the fiber.

      assignFiberPropertiesInDEV(unitOfWork, originalWorkInProgressCopy);

      if (unitOfWork.mode & ProfileMode) {
        // Reset the profiler timer.
        startProfilerTimer(unitOfWork);
      } // Run beginWork again.

      invokeGuardedCallback(null, beginWork, null, current, unitOfWork, lanes);

      if (hasCaughtError()) {
        var replayError = clearCaughtError();

        if (
          typeof replayError === "object" &&
          replayError !== null &&
          replayError._suppressLogging &&
          typeof originalError === "object" &&
          originalError !== null &&
          !originalError._suppressLogging
        ) {
          // If suppressed, let the flag carry over to the original error which is the one we'll rethrow.
          originalError._suppressLogging = true;
        }
      } // We always throw the original error in case the second render pass is not idempotent.
      // This can happen if a memoized function or CommonJS module doesn't throw after first invokation.

      throw originalError;
    }
  };
}

var didWarnAboutUpdateInRender = false;
var didWarnAboutUpdateInRenderForAnotherComponent;

{
  didWarnAboutUpdateInRenderForAnotherComponent = new Set();
}

function warnAboutRenderPhaseUpdatesInDEV(fiber) {
  {
    if (
      isRendering &&
      (executionContext & RenderContext) !== NoContext &&
      !getIsUpdatingOpaqueValueInRenderPhaseInDEV()
    ) {
      switch (fiber.tag) {
        case FunctionComponent:
        case ForwardRef:
        case SimpleMemoComponent: {
          var renderingComponentName =
            (workInProgress && getComponentNameFromFiber(workInProgress)) ||
            "Unknown"; // Dedupe by the rendering component because it's the one that needs to be fixed.

          var dedupeKey = renderingComponentName;

          if (!didWarnAboutUpdateInRenderForAnotherComponent.has(dedupeKey)) {
            didWarnAboutUpdateInRenderForAnotherComponent.add(dedupeKey);
            var setStateComponentName =
              getComponentNameFromFiber(fiber) || "Unknown";

            error(
              "Cannot update a component (`%s`) while rendering a " +
                "different component (`%s`). To locate the bad setState() call inside `%s`, " +
                "follow the stack trace as described in https://reactjs.org/link/setstate-in-render",
              setStateComponentName,
              renderingComponentName,
              renderingComponentName
            );
          }

          break;
        }

        case ClassComponent: {
          if (!didWarnAboutUpdateInRender) {
            error(
              "Cannot update during an existing state transition (such as " +
                "within `render`). Render methods should be a pure " +
                "function of props and state."
            );

            didWarnAboutUpdateInRender = true;
          }

          break;
        }
      }
    }
  }
}

function restorePendingUpdaters(root, lanes) {
  {
    if (isDevToolsPresent) {
      var memoizedUpdaters = root.memoizedUpdaters;
      memoizedUpdaters.forEach(function(schedulingFiber) {
        addFiberToLanesMap(root, schedulingFiber, lanes);
      }); // This function intentionally does not clear memoized updaters.
      // Those may still be relevant to the current commit
      // and a future one (e.g. Suspense).
    }
  }
}
var fakeActCallbackNode = {};

function scheduleCallback$1(priorityLevel, callback) {
  {
    // If we're currently inside an `act` scope, bypass Scheduler and push to
    // the `act` queue instead.
    var actQueue = ReactCurrentActQueue.current;

    if (actQueue !== null) {
      actQueue.push(callback);
      return fakeActCallbackNode;
    } else {
      return scheduleCallback(priorityLevel, callback);
    }
  }
}

function cancelCallback$1(callbackNode) {
  if (callbackNode === fakeActCallbackNode) {
    return;
  } // In production, always call Scheduler. This function will be stripped out.

  return cancelCallback(callbackNode);
}

function shouldForceFlushFallbacksInDEV() {
  // Never force flush in production. This function should get stripped out.
  return ReactCurrentActQueue.current !== null;
}

function warnIfNotCurrentlyActingEffectsInDEV(fiber) {
  {
    if (
      (fiber.mode & StrictLegacyMode) !== NoMode &&
      ReactCurrentActQueue.current === null && // Our internal tests use a custom implementation of `act` that works by
      // mocking the Scheduler package. Disable the `act` warning.
      // TODO: Maybe the warning should be disabled by default, and then turned
      // on at the testing frameworks layer? Instead of what we do now, which
      // is check if a `jest` global is defined.
      ReactCurrentActQueue.disableActWarning === false
    ) {
      error(
        "An update to %s ran an effect, but was not wrapped in act(...).\n\n" +
          "When testing, code that causes React state updates should be " +
          "wrapped into act(...):\n\n" +
          "act(() => {\n" +
          "  /* fire events that update state */\n" +
          "});\n" +
          "/* assert on the output */\n\n" +
          "This ensures that you're testing the behavior the user would see " +
          "in the browser." +
          " Learn more at https://reactjs.org/link/wrap-tests-with-act",
        getComponentNameFromFiber(fiber)
      );
    }
  }
}

function warnIfNotCurrentlyActingUpdatesInDEV(fiber) {
  {
    if (
      executionContext === NoContext &&
      ReactCurrentActQueue.current === null && // Our internal tests use a custom implementation of `act` that works by
      // mocking the Scheduler package. Disable the `act` warning.
      // TODO: Maybe the warning should be disabled by default, and then turned
      // on at the testing frameworks layer? Instead of what we do now, which
      // is check if a `jest` global is defined.
      ReactCurrentActQueue.disableActWarning === false
    ) {
      var previousFiber = current;

      try {
        setCurrentFiber(fiber);

        error(
          "An update to %s inside a test was not wrapped in act(...).\n\n" +
            "When testing, code that causes React state updates should be " +
            "wrapped into act(...):\n\n" +
            "act(() => {\n" +
            "  /* fire events that update state */\n" +
            "});\n" +
            "/* assert on the output */\n\n" +
            "This ensures that you're testing the behavior the user would see " +
            "in the browser." +
            " Learn more at https://reactjs.org/link/wrap-tests-with-act",
          getComponentNameFromFiber(fiber)
        );
      } finally {
        if (previousFiber) {
          setCurrentFiber(fiber);
        } else {
          resetCurrentFiber();
        }
      }
    }
  }
}

var warnIfNotCurrentlyActingUpdatesInDev = warnIfNotCurrentlyActingUpdatesInDEV;

var resolveFamily = null; // $FlowFixMe Flow gets confused by a WeakSet feature check below.

var failedBoundaries = null;
var setRefreshHandler = function(handler) {
  {
    resolveFamily = handler;
  }
};
function resolveFunctionForHotReloading(type) {
  {
    if (resolveFamily === null) {
      // Hot reloading is disabled.
      return type;
    }

    var family = resolveFamily(type);

    if (family === undefined) {
      return type;
    } // Use the latest known implementation.

    return family.current;
  }
}
function resolveClassForHotReloading(type) {
  // No implementation differences.
  return resolveFunctionForHotReloading(type);
}
function resolveForwardRefForHotReloading(type) {
  {
    if (resolveFamily === null) {
      // Hot reloading is disabled.
      return type;
    }

    var family = resolveFamily(type);

    if (family === undefined) {
      // Check if we're dealing with a real forwardRef. Don't want to crash early.
      if (
        type !== null &&
        type !== undefined &&
        typeof type.render === "function"
      ) {
        // ForwardRef is special because its resolved .type is an object,
        // but it's possible that we only have its inner render function in the map.
        // If that inner render function is different, we'll build a new forwardRef type.
        var currentRender = resolveFunctionForHotReloading(type.render);

        if (type.render !== currentRender) {
          var syntheticType = {
            $$typeof: REACT_FORWARD_REF_TYPE,
            render: currentRender
          };

          if (type.displayName !== undefined) {
            syntheticType.displayName = type.displayName;
          }

          return syntheticType;
        }
      }

      return type;
    } // Use the latest known implementation.

    return family.current;
  }
}
function isCompatibleFamilyForHotReloading(fiber, element) {
  {
    if (resolveFamily === null) {
      // Hot reloading is disabled.
      return false;
    }

    var prevType = fiber.elementType;
    var nextType = element.type; // If we got here, we know types aren't === equal.

    var needsCompareFamilies = false;
    var $$typeofNextType =
      typeof nextType === "object" && nextType !== null
        ? nextType.$$typeof
        : null;

    switch (fiber.tag) {
      case ClassComponent: {
        if (typeof nextType === "function") {
          needsCompareFamilies = true;
        }

        break;
      }

      case FunctionComponent: {
        if (typeof nextType === "function") {
          needsCompareFamilies = true;
        } else if ($$typeofNextType === REACT_LAZY_TYPE) {
          // We don't know the inner type yet.
          // We're going to assume that the lazy inner type is stable,
          // and so it is sufficient to avoid reconciling it away.
          // We're not going to unwrap or actually use the new lazy type.
          needsCompareFamilies = true;
        }

        break;
      }

      case ForwardRef: {
        if ($$typeofNextType === REACT_FORWARD_REF_TYPE) {
          needsCompareFamilies = true;
        } else if ($$typeofNextType === REACT_LAZY_TYPE) {
          needsCompareFamilies = true;
        }

        break;
      }

      case MemoComponent:
      case SimpleMemoComponent: {
        if ($$typeofNextType === REACT_MEMO_TYPE) {
          // TODO: if it was but can no longer be simple,
          // we shouldn't set this.
          needsCompareFamilies = true;
        } else if ($$typeofNextType === REACT_LAZY_TYPE) {
          needsCompareFamilies = true;
        }

        break;
      }

      default:
        return false;
    } // Check if both types have a family and it's the same one.

    if (needsCompareFamilies) {
      // Note: memo() and forwardRef() we'll compare outer rather than inner type.
      // This means both of them need to be registered to preserve state.
      // If we unwrapped and compared the inner types for wrappers instead,
      // then we would risk falsely saying two separate memo(Foo)
      // calls are equivalent because they wrap the same Foo function.
      var prevFamily = resolveFamily(prevType);

      if (prevFamily !== undefined && prevFamily === resolveFamily(nextType)) {
        return true;
      }
    }

    return false;
  }
}
function markFailedErrorBoundaryForHotReloading(fiber) {
  {
    if (resolveFamily === null) {
      // Hot reloading is disabled.
      return;
    }

    if (typeof WeakSet !== "function") {
      return;
    }

    if (failedBoundaries === null) {
      failedBoundaries = new WeakSet();
    }

    failedBoundaries.add(fiber);
  }
}
var scheduleRefresh = function(root, update) {
  {
    if (resolveFamily === null) {
      // Hot reloading is disabled.
      return;
    }

    var staleFamilies = update.staleFamilies,
      updatedFamilies = update.updatedFamilies;
    flushPassiveEffects();
    flushSync(function() {
      scheduleFibersWithFamiliesRecursively(
        root.current,
        updatedFamilies,
        staleFamilies
      );
    });
  }
};
var scheduleRoot = function(root, element) {
  {
    if (root.context !== emptyContextObject) {
      // Super edge case: root has a legacy _renderSubtree context
      // but we don't know the parentComponent so we can't pass it.
      // Just ignore. We'll delete this with _renderSubtree code path later.
      return;
    }

    flushPassiveEffects();
    flushSync(function() {
      updateContainer(element, root, null, null);
    });
  }
};

function scheduleFibersWithFamiliesRecursively(
  fiber,
  updatedFamilies,
  staleFamilies
) {
  {
    var alternate = fiber.alternate,
      child = fiber.child,
      sibling = fiber.sibling,
      tag = fiber.tag,
      type = fiber.type;
    var candidateType = null;

    switch (tag) {
      case FunctionComponent:
      case SimpleMemoComponent:
      case ClassComponent:
        candidateType = type;
        break;

      case ForwardRef:
        candidateType = type.render;
        break;
    }

    if (resolveFamily === null) {
      throw new Error("Expected resolveFamily to be set during hot reload.");
    }

    var needsRender = false;
    var needsRemount = false;

    if (candidateType !== null) {
      var family = resolveFamily(candidateType);

      if (family !== undefined) {
        if (staleFamilies.has(family)) {
          needsRemount = true;
        } else if (updatedFamilies.has(family)) {
          if (tag === ClassComponent) {
            needsRemount = true;
          } else {
            needsRender = true;
          }
        }
      }
    }

    if (failedBoundaries !== null) {
      if (
        failedBoundaries.has(fiber) ||
        (alternate !== null && failedBoundaries.has(alternate))
      ) {
        needsRemount = true;
      }
    }

    if (needsRemount) {
      fiber._debugNeedsRemount = true;
    }

    if (needsRemount || needsRender) {
      scheduleUpdateOnFiber(fiber, SyncLane, NoTimestamp);
    }

    if (child !== null && !needsRemount) {
      scheduleFibersWithFamiliesRecursively(
        child,
        updatedFamilies,
        staleFamilies
      );
    }

    if (sibling !== null) {
      scheduleFibersWithFamiliesRecursively(
        sibling,
        updatedFamilies,
        staleFamilies
      );
    }
  }
}

var findHostInstancesForRefresh = function(root, families) {
  {
    var hostInstances = new Set();
    var types = new Set(
      families.map(function(family) {
        return family.current;
      })
    );
    findHostInstancesForMatchingFibersRecursively(
      root.current,
      types,
      hostInstances
    );
    return hostInstances;
  }
};

function findHostInstancesForMatchingFibersRecursively(
  fiber,
  types,
  hostInstances
) {
  {
    var child = fiber.child,
      sibling = fiber.sibling,
      tag = fiber.tag,
      type = fiber.type;
    var candidateType = null;

    switch (tag) {
      case FunctionComponent:
      case SimpleMemoComponent:
      case ClassComponent:
        candidateType = type;
        break;

      case ForwardRef:
        candidateType = type.render;
        break;
    }

    var didMatch = false;

    if (candidateType !== null) {
      if (types.has(candidateType)) {
        didMatch = true;
      }
    }

    if (didMatch) {
      // We have a match. This only drills down to the closest host components.
      // There's no need to search deeper because for the purpose of giving
      // visual feedback, "flashing" outermost parent rectangles is sufficient.
      findHostInstancesForFiberShallowly(fiber, hostInstances);
    } else {
      // If there's no match, maybe there will be one further down in the child tree.
      if (child !== null) {
        findHostInstancesForMatchingFibersRecursively(
          child,
          types,
          hostInstances
        );
      }
    }

    if (sibling !== null) {
      findHostInstancesForMatchingFibersRecursively(
        sibling,
        types,
        hostInstances
      );
    }
  }
}

function findHostInstancesForFiberShallowly(fiber, hostInstances) {
  {
    var foundHostInstances = findChildHostInstancesForFiberShallowly(
      fiber,
      hostInstances
    );

    if (foundHostInstances) {
      return;
    } // If we didn't find any host children, fallback to closest host parent.

    var node = fiber;

    while (true) {
      switch (node.tag) {
        case HostComponent:
          hostInstances.add(node.stateNode);
          return;

        case HostPortal:
          hostInstances.add(node.stateNode.containerInfo);
          return;

        case HostRoot:
          hostInstances.add(node.stateNode.containerInfo);
          return;
      }

      if (node.return === null) {
        throw new Error("Expected to reach root first.");
      }

      node = node.return;
    }
  }
}

function findChildHostInstancesForFiberShallowly(fiber, hostInstances) {
  {
    var node = fiber;
    var foundHostInstances = false;

    while (true) {
      if (node.tag === HostComponent) {
        // We got a match.
        foundHostInstances = true;
        hostInstances.add(node.stateNode); // There may still be more, so keep searching.
      } else if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }

      if (node === fiber) {
        return foundHostInstances;
      }

      while (node.sibling === null) {
        if (node.return === null || node.return === fiber) {
          return foundHostInstances;
        }

        node = node.return;
      }

      node.sibling.return = node.return;
      node = node.sibling;
    }
  }

  return false;
}

var hasBadMapPolyfill;

{
  hasBadMapPolyfill = false;

  try {
    var nonExtensibleObject = Object.preventExtensions({});
    /* eslint-disable no-new */

    new Map([[nonExtensibleObject, null]]);
    new Set([nonExtensibleObject]);
    /* eslint-enable no-new */
  } catch (e) {
    // TODO: Consider warning about bad polyfills
    hasBadMapPolyfill = true;
  }
}

function FiberNode(tag, pendingProps, key, mode) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null; // Fiber

  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;
  this.mode = mode; // Effects

  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;
  this.lanes = NoLanes;
  this.childLanes = NoLanes;
  this.alternate = null;

  {
    // Note: The following is done to avoid a v8 performance cliff.
    //
    // Initializing the fields below to smis and later updating them with
    // double values will cause Fibers to end up having separate shapes.
    // This behavior/bug has something to do with Object.preventExtension().
    // Fortunately this only impacts DEV builds.
    // Unfortunately it makes React unusably slow for some applications.
    // To work around this, initialize the fields below with doubles.
    //
    // Learn more about this here:
    // https://github.com/facebook/react/issues/14365
    // https://bugs.chromium.org/p/v8/issues/detail?id=8538
    this.actualDuration = Number.NaN;
    this.actualStartTime = Number.NaN;
    this.selfBaseDuration = Number.NaN;
    this.treeBaseDuration = Number.NaN; // It's okay to replace the initial doubles with smis after initialization.
    // This won't trigger the performance cliff mentioned above,
    // and it simplifies other profiler code (including DevTools).

    this.actualDuration = 0;
    this.actualStartTime = -1;
    this.selfBaseDuration = 0;
    this.treeBaseDuration = 0;
  }

  {
    // This isn't directly used but is handy for debugging internals:
    this._debugSource = null;
    this._debugOwner = null;
    this._debugNeedsRemount = false;
    this._debugHookTypes = null;

    if (!hasBadMapPolyfill && typeof Object.preventExtensions === "function") {
      Object.preventExtensions(this);
    }
  }
} // This is a constructor function, rather than a POJO constructor, still
// please ensure we do the following:
// 1) Nobody should add any instance methods on this. Instance methods can be
//    more difficult to predict when they get optimized and they are almost
//    never inlined properly in static compilers.
// 2) Nobody should rely on `instanceof Fiber` for type testing. We should
//    always know when it is a fiber.
// 3) We might want to experiment with using numeric keys since they are easier
//    to optimize in a non-JIT environment.
// 4) We can easily go from a constructor to a createFiber object literal if that
//    is faster.
// 5) It should be easy to port this to a C struct and keep a C implementation
//    compatible.

var createFiber = function(tag, pendingProps, key, mode) {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  return new FiberNode(tag, pendingProps, key, mode);
};

function shouldConstruct(Component) {
  var prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

function isSimpleFunctionComponent(type) {
  return (
    typeof type === "function" &&
    !shouldConstruct(type) &&
    type.defaultProps === undefined
  );
}
function resolveLazyComponentTag(Component) {
  if (typeof Component === "function") {
    return shouldConstruct(Component) ? ClassComponent : FunctionComponent;
  } else if (Component !== undefined && Component !== null) {
    var $$typeof = Component.$$typeof;

    if ($$typeof === REACT_FORWARD_REF_TYPE) {
      return ForwardRef;
    }

    if ($$typeof === REACT_MEMO_TYPE) {
      return MemoComponent;
    }
  }

  return IndeterminateComponent;
} // This is used to create an alternate fiber to do work on.

function createWorkInProgress(current, pendingProps) {
  var workInProgress = current.alternate;

  if (workInProgress === null) {
    // We use a double buffering pooling technique because we know that we'll
    // only ever need at most two versions of a tree. We pool the "other" unused
    // node that we're free to reuse. This is lazily created to avoid allocating
    // extra objects for things that are never updated. It also allow us to
    // reclaim the extra memory if needed.
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode
    );
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;

    {
      // DEV-only fields
      workInProgress._debugSource = current._debugSource;
      workInProgress._debugOwner = current._debugOwner;
      workInProgress._debugHookTypes = current._debugHookTypes;
    }

    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps; // Needed because Blocks store data on type.

    workInProgress.type = current.type; // We already have an alternate.
    // Reset the effect tag.

    workInProgress.flags = NoFlags; // The effects are no longer valid.

    workInProgress.subtreeFlags = NoFlags;
    workInProgress.deletions = null;

    {
      // We intentionally reset, rather than copy, actualDuration & actualStartTime.
      // This prevents time from endlessly accumulating in new commits.
      // This has the downside of resetting values for different priority renders,
      // But works for yielding (the common case) and should support resuming.
      workInProgress.actualDuration = 0;
      workInProgress.actualStartTime = -1;
    }
  } // Reset all effects except static ones.
  // Static effects are not specific to a render.

  workInProgress.flags = current.flags & StaticMask;
  workInProgress.childLanes = current.childLanes;
  workInProgress.lanes = current.lanes;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue; // Clone the dependencies object. This is mutated during the render phase, so
  // it cannot be shared with the current fiber.

  var currentDependencies = current.dependencies;
  workInProgress.dependencies =
    currentDependencies === null
      ? null
      : {
          lanes: currentDependencies.lanes,
          firstContext: currentDependencies.firstContext
        }; // These will be overridden during the parent's reconciliation

  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;

  {
    workInProgress.selfBaseDuration = current.selfBaseDuration;
    workInProgress.treeBaseDuration = current.treeBaseDuration;
  }

  {
    workInProgress._debugNeedsRemount = current._debugNeedsRemount;

    switch (workInProgress.tag) {
      case IndeterminateComponent:
      case FunctionComponent:
      case SimpleMemoComponent:
        workInProgress.type = resolveFunctionForHotReloading(current.type);
        break;

      case ClassComponent:
        workInProgress.type = resolveClassForHotReloading(current.type);
        break;

      case ForwardRef:
        workInProgress.type = resolveForwardRefForHotReloading(current.type);
        break;
    }
  }

  return workInProgress;
} // Used to reuse a Fiber for a second pass.

function resetWorkInProgress(workInProgress, renderLanes) {
  // This resets the Fiber to what createFiber or createWorkInProgress would
  // have set the values to before during the first pass. Ideally this wouldn't
  // be necessary but unfortunately many code paths reads from the workInProgress
  // when they should be reading from current and writing to workInProgress.
  // We assume pendingProps, index, key, ref, return are still untouched to
  // avoid doing another reconciliation.
  // Reset the effect flags but keep any Placement tags, since that's something
  // that child fiber is setting, not the reconciliation.
  workInProgress.flags &= StaticMask | Placement; // The effects are no longer valid.

  var current = workInProgress.alternate;

  if (current === null) {
    // Reset to createFiber's initial values.
    workInProgress.childLanes = NoLanes;
    workInProgress.lanes = renderLanes;
    workInProgress.child = null;
    workInProgress.subtreeFlags = NoFlags;
    workInProgress.memoizedProps = null;
    workInProgress.memoizedState = null;
    workInProgress.updateQueue = null;
    workInProgress.dependencies = null;
    workInProgress.stateNode = null;

    {
      // Note: We don't reset the actualTime counts. It's useful to accumulate
      // actual time across multiple render passes.
      workInProgress.selfBaseDuration = 0;
      workInProgress.treeBaseDuration = 0;
    }
  } else {
    // Reset to the cloned values that createWorkInProgress would've.
    workInProgress.childLanes = current.childLanes;
    workInProgress.lanes = current.lanes;
    workInProgress.child = current.child;
    workInProgress.subtreeFlags = NoFlags;
    workInProgress.deletions = null;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue; // Needed because Blocks store data on type.

    workInProgress.type = current.type; // Clone the dependencies object. This is mutated during the render phase, so
    // it cannot be shared with the current fiber.

    var currentDependencies = current.dependencies;
    workInProgress.dependencies =
      currentDependencies === null
        ? null
        : {
            lanes: currentDependencies.lanes,
            firstContext: currentDependencies.firstContext
          };

    {
      // Note: We don't reset the actualTime counts. It's useful to accumulate
      // actual time across multiple render passes.
      workInProgress.selfBaseDuration = current.selfBaseDuration;
      workInProgress.treeBaseDuration = current.treeBaseDuration;
    }
  }

  return workInProgress;
}
function createHostRootFiber(
  tag,
  isStrictMode,
  concurrentUpdatesByDefaultOverride
) {
  var mode;

  if (tag === ConcurrentRoot) {
    mode = ConcurrentMode;

    if (isStrictMode === true) {
      mode |= StrictLegacyMode;

      {
        mode |= StrictEffectsMode;
      }
    }

    if (
      // We only use this flag for our repo tests to check both behaviors.
      // TODO: Flip this flag and rename it something like "forceConcurrentByDefaultForTesting"
      // Only for internal experiments.
      concurrentUpdatesByDefaultOverride
    ) {
      mode |= ConcurrentUpdatesByDefaultMode;
    }
  } else {
    mode = NoMode;
  }

  if (isDevToolsPresent) {
    // Always collect profile timings when DevTools are present.
    // This enables DevTools to start capturing timing at any point–
    // Without some nodes in the tree having empty base times.
    mode |= ProfileMode;
  }

  return createFiber(HostRoot, null, null, mode);
}
function createFiberFromTypeAndProps(
  type, // React$ElementType
  key,
  pendingProps,
  owner,
  mode,
  lanes
) {
  var fiberTag = IndeterminateComponent; // The resolved type is set if we know what the final type will be. I.e. it's not lazy.

  var resolvedType = type;

  if (typeof type === "function") {
    if (shouldConstruct(type)) {
      fiberTag = ClassComponent;

      {
        resolvedType = resolveClassForHotReloading(resolvedType);
      }
    } else {
      {
        resolvedType = resolveFunctionForHotReloading(resolvedType);
      }
    }
  } else if (typeof type === "string") {
    fiberTag = HostComponent;
  } else {
    getTag: switch (type) {
      case REACT_FRAGMENT_TYPE:
        return createFiberFromFragment(pendingProps.children, mode, lanes, key);

      case REACT_DEBUG_TRACING_MODE_TYPE:
        fiberTag = Mode;
        mode |= DebugTracingMode;
        break;

      case REACT_STRICT_MODE_TYPE:
        fiberTag = Mode;
        mode |= StrictLegacyMode;

        if ((mode & ConcurrentMode) !== NoMode) {
          // Strict effects should never run on legacy roots
          mode |= StrictEffectsMode;
        }

        break;

      case REACT_PROFILER_TYPE:
        return createFiberFromProfiler(pendingProps, mode, lanes, key);

      case REACT_SUSPENSE_TYPE:
        return createFiberFromSuspense(pendingProps, mode, lanes, key);

      case REACT_SUSPENSE_LIST_TYPE:
        return createFiberFromSuspenseList(pendingProps, mode, lanes, key);

      case REACT_OFFSCREEN_TYPE:
        return createFiberFromOffscreen(pendingProps, mode, lanes, key);

      case REACT_LEGACY_HIDDEN_TYPE:
        return createFiberFromLegacyHidden(pendingProps, mode, lanes, key);

      case REACT_SCOPE_TYPE:

      // eslint-disable-next-line no-fallthrough

      case REACT_CACHE_TYPE:

      // eslint-disable-next-line no-fallthrough

      default: {
        if (typeof type === "object" && type !== null) {
          switch (type.$$typeof) {
            case REACT_PROVIDER_TYPE:
              fiberTag = ContextProvider;
              break getTag;

            case REACT_CONTEXT_TYPE:
              // This is a consumer
              fiberTag = ContextConsumer;
              break getTag;

            case REACT_FORWARD_REF_TYPE:
              fiberTag = ForwardRef;

              {
                resolvedType = resolveForwardRefForHotReloading(resolvedType);
              }

              break getTag;

            case REACT_MEMO_TYPE:
              fiberTag = MemoComponent;
              break getTag;

            case REACT_LAZY_TYPE:
              fiberTag = LazyComponent;
              resolvedType = null;
              break getTag;
          }
        }

        var info = "";

        {
          if (
            type === undefined ||
            (typeof type === "object" &&
              type !== null &&
              Object.keys(type).length === 0)
          ) {
            info +=
              " You likely forgot to export your component from the file " +
              "it's defined in, or you might have mixed up default and " +
              "named imports.";
          }

          var ownerName = owner ? getComponentNameFromFiber(owner) : null;

          if (ownerName) {
            info += "\n\nCheck the render method of `" + ownerName + "`.";
          }
        }

        {
          throw Error(
            "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " +
              (type == null ? type : typeof type) +
              "." +
              info
          );
        }
      }
    }
  }

  var fiber = createFiber(fiberTag, pendingProps, key, mode);
  fiber.elementType = type;
  fiber.type = resolvedType;
  fiber.lanes = lanes;

  {
    fiber._debugOwner = owner;
  }

  return fiber;
}
function createOffscreenHostContainerFiber(props, fiberMode, lanes, key) {
  {
    // Only implemented in persistent mode
    {
      throw Error("Not implemented.");
    }
  }
}
function createFiberFromElement(element, mode, lanes) {
  var owner = null;

  {
    owner = element._owner;
  }

  var type = element.type;
  var key = element.key;
  var pendingProps = element.props;
  var fiber = createFiberFromTypeAndProps(
    type,
    key,
    pendingProps,
    owner,
    mode,
    lanes
  );

  {
    fiber._debugSource = element._source;
    fiber._debugOwner = element._owner;
  }

  return fiber;
}
function createFiberFromFragment(elements, mode, lanes, key) {
  var fiber = createFiber(Fragment, elements, key, mode);
  fiber.lanes = lanes;
  return fiber;
}

function createFiberFromProfiler(pendingProps, mode, lanes, key) {
  {
    if (typeof pendingProps.id !== "string") {
      error(
        'Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.',
        typeof pendingProps.id
      );
    }
  }

  var fiber = createFiber(Profiler, pendingProps, key, mode | ProfileMode);
  fiber.elementType = REACT_PROFILER_TYPE;
  fiber.lanes = lanes;

  {
    fiber.stateNode = {
      effectDuration: 0,
      passiveEffectDuration: 0
    };
  }

  return fiber;
}

function createFiberFromSuspense(pendingProps, mode, lanes, key) {
  var fiber = createFiber(SuspenseComponent, pendingProps, key, mode);
  fiber.elementType = REACT_SUSPENSE_TYPE;
  fiber.lanes = lanes;
  return fiber;
}
function createFiberFromSuspenseList(pendingProps, mode, lanes, key) {
  var fiber = createFiber(SuspenseListComponent, pendingProps, key, mode);
  fiber.elementType = REACT_SUSPENSE_LIST_TYPE;
  fiber.lanes = lanes;
  return fiber;
}
function createFiberFromOffscreen(pendingProps, mode, lanes, key) {
  var fiber = createFiber(OffscreenComponent, pendingProps, key, mode);
  fiber.elementType = REACT_OFFSCREEN_TYPE;
  fiber.lanes = lanes;
  return fiber;
}
function createFiberFromLegacyHidden(pendingProps, mode, lanes, key) {
  var fiber = createFiber(LegacyHiddenComponent, pendingProps, key, mode);
  fiber.elementType = REACT_LEGACY_HIDDEN_TYPE;
  fiber.lanes = lanes;
  return fiber;
}
function createFiberFromText(content, mode, lanes) {
  var fiber = createFiber(HostText, content, null, mode);
  fiber.lanes = lanes;
  return fiber;
}
function createFiberFromPortal(portal, mode, lanes) {
  var pendingProps = portal.children !== null ? portal.children : [];
  var fiber = createFiber(HostPortal, pendingProps, portal.key, mode);
  fiber.lanes = lanes;
  fiber.stateNode = {
    containerInfo: portal.containerInfo,
    pendingChildren: null,
    // Used by persistent updates
    implementation: portal.implementation
  };
  return fiber;
} // Used for stashing WIP properties to replay failed work in DEV.

function assignFiberPropertiesInDEV(target, source) {
  if (target === null) {
    // This Fiber's initial properties will always be overwritten.
    // We only use a Fiber to ensure the same hidden class so DEV isn't slow.
    target = createFiber(IndeterminateComponent, null, null, NoMode);
  } // This is intentionally written as a list of all properties.
  // We tried to use Object.assign() instead but this is called in
  // the hottest path, and Object.assign() was too slow:
  // https://github.com/facebook/react/issues/12502
  // This code is DEV-only so size is not a concern.

  target.tag = source.tag;
  target.key = source.key;
  target.elementType = source.elementType;
  target.type = source.type;
  target.stateNode = source.stateNode;
  target.return = source.return;
  target.child = source.child;
  target.sibling = source.sibling;
  target.index = source.index;
  target.ref = source.ref;
  target.pendingProps = source.pendingProps;
  target.memoizedProps = source.memoizedProps;
  target.updateQueue = source.updateQueue;
  target.memoizedState = source.memoizedState;
  target.dependencies = source.dependencies;
  target.mode = source.mode;
  target.flags = source.flags;
  target.subtreeFlags = source.subtreeFlags;
  target.deletions = source.deletions;
  target.lanes = source.lanes;
  target.childLanes = source.childLanes;
  target.alternate = source.alternate;

  {
    target.actualDuration = source.actualDuration;
    target.actualStartTime = source.actualStartTime;
    target.selfBaseDuration = source.selfBaseDuration;
    target.treeBaseDuration = source.treeBaseDuration;
  }

  target._debugSource = source._debugSource;
  target._debugOwner = source._debugOwner;
  target._debugNeedsRemount = source._debugNeedsRemount;
  target._debugHookTypes = source._debugHookTypes;
  return target;
}

function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.current = null;
  this.pingCache = null;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.hydrate = hydrate;
  this.callbackNode = null;
  this.callbackPriority = NoLane;
  this.eventTimes = createLaneMap(NoLanes);
  this.expirationTimes = createLaneMap(NoTimestamp);
  this.pendingLanes = NoLanes;
  this.suspendedLanes = NoLanes;
  this.pingedLanes = NoLanes;
  this.expiredLanes = NoLanes;
  this.mutableReadLanes = NoLanes;
  this.finishedLanes = NoLanes;
  this.entangledLanes = NoLanes;
  this.entanglements = createLaneMap(NoLanes);

  {
    this.effectDuration = 0;
    this.passiveEffectDuration = 0;
  }

  {
    this.memoizedUpdaters = new Set();
    var pendingUpdatersLaneMap = (this.pendingUpdatersLaneMap = []);

    for (var i = 0; i < TotalLanes; i++) {
      pendingUpdatersLaneMap.push(new Set());
    }
  }

  {
    switch (tag) {
      case ConcurrentRoot:
        this._debugRootType = "createRoot()";
        break;

      case LegacyRoot:
        this._debugRootType = "createLegacyRoot()";
        break;
    }
  }
}

function createFiberRoot(
  containerInfo,
  tag,
  hydrate,
  hydrationCallbacks,
  isStrictMode,
  concurrentUpdatesByDefaultOverride
) {
  var root = new FiberRootNode(containerInfo, tag, hydrate);
  // stateNode is any.

  var uninitializedFiber = createHostRootFiber(
    tag,
    isStrictMode,
    concurrentUpdatesByDefaultOverride
  );
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  {
    var _initialState = {
      element: null
    };
    uninitializedFiber.memoizedState = _initialState;
  }

  initializeUpdateQueue(uninitializedFiber);
  return root;
}

function createPortal(
  children,
  containerInfo, // TODO: figure out the API for cross-renderer implementation.
  implementation
) {
  var key =
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  return {
    // This tag allow us to uniquely identify this as a React Portal
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : "" + key,
    children: children,
    containerInfo: containerInfo,
    implementation: implementation
  };
}

var didWarnAboutNestedUpdates;
var didWarnAboutFindNodeInStrictMode;

{
  didWarnAboutNestedUpdates = false;
  didWarnAboutFindNodeInStrictMode = {};
}

function getContextForSubtree(parentComponent) {
  if (!parentComponent) {
    return emptyContextObject;
  }

  var fiber = get(parentComponent);
  var parentContext = findCurrentUnmaskedContext(fiber);

  if (fiber.tag === ClassComponent) {
    var Component = fiber.type;

    if (isContextProvider(Component)) {
      return processChildContext(fiber, Component, parentContext);
    }
  }

  return parentContext;
}

function findHostInstanceWithWarning(component, methodName) {
  {
    var fiber = get(component);

    if (fiber === undefined) {
      if (typeof component.render === "function") {
        {
          throw Error("Unable to find node on an unmounted component.");
        }
      } else {
        {
          throw Error(
            "Argument appears to not be a ReactComponent. Keys: " +
              Object.keys(component)
          );
        }
      }
    }

    var hostFiber = findCurrentHostFiber(fiber);

    if (hostFiber === null) {
      return null;
    }

    if (hostFiber.mode & StrictLegacyMode) {
      var componentName = getComponentNameFromFiber(fiber) || "Component";

      if (!didWarnAboutFindNodeInStrictMode[componentName]) {
        didWarnAboutFindNodeInStrictMode[componentName] = true;
        var previousFiber = current;

        try {
          setCurrentFiber(hostFiber);

          if (fiber.mode & StrictLegacyMode) {
            error(
              "%s is deprecated in StrictMode. " +
                "%s was passed an instance of %s which is inside StrictMode. " +
                "Instead, add a ref directly to the element you want to reference. " +
                "Learn more about using refs safely here: " +
                "https://reactjs.org/link/strict-mode-find-node",
              methodName,
              methodName,
              componentName
            );
          } else {
            error(
              "%s is deprecated in StrictMode. " +
                "%s was passed an instance of %s which renders StrictMode children. " +
                "Instead, add a ref directly to the element you want to reference. " +
                "Learn more about using refs safely here: " +
                "https://reactjs.org/link/strict-mode-find-node",
              methodName,
              methodName,
              componentName
            );
          }
        } finally {
          // Ideally this should reset to previous but this shouldn't be called in
          // render and there's another warning for that anyway.
          if (previousFiber) {
            setCurrentFiber(previousFiber);
          } else {
            resetCurrentFiber();
          }
        }
      }
    }

    return hostFiber.stateNode;
  }
}

function createContainer(
  containerInfo,
  tag,
  hydrate,
  hydrationCallbacks,
  isStrictMode,
  concurrentUpdatesByDefaultOverride
) {
  return createFiberRoot(
    containerInfo,
    tag,
    hydrate,
    hydrationCallbacks,
    isStrictMode,
    concurrentUpdatesByDefaultOverride
  );
}
function updateContainer(element, container, parentComponent, callback) {
  {
    onScheduleRoot(container, element);
  }

  var current$1 = container.current;
  var eventTime = requestEventTime();
  var lane = requestUpdateLane(current$1);

  var context = getContextForSubtree(parentComponent);

  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  {
    if (isRendering && current !== null && !didWarnAboutNestedUpdates) {
      didWarnAboutNestedUpdates = true;

      error(
        "Render methods should be a pure function of props and state; " +
          "triggering nested component updates from render is not allowed. " +
          "If necessary, trigger nested updates in componentDidUpdate.\n\n" +
          "Check the render method of %s.",
        getComponentNameFromFiber(current) || "Unknown"
      );
    }
  }

  var update = createUpdate(eventTime, lane); // Caution: React DevTools currently depends on this property
  // being called "element".

  update.payload = {
    element: element
  };
  callback = callback === undefined ? null : callback;

  if (callback !== null) {
    {
      if (typeof callback !== "function") {
        error(
          "render(...): Expected the last optional `callback` argument to be a " +
            "function. Instead received: %s.",
          callback
        );
      }
    }

    update.callback = callback;
  }

  enqueueUpdate(current$1, update);
  var root = scheduleUpdateOnFiber(current$1, lane, eventTime);

  if (root !== null) {
    entangleTransitions(root, current$1, lane);
  }

  return lane;
}
function getPublicRootInstance(container) {
  var containerFiber = container.current;

  if (!containerFiber.child) {
    return null;
  }

  switch (containerFiber.child.tag) {
    case HostComponent:
      return getPublicInstance(containerFiber.child.stateNode);

    default:
      return containerFiber.child.stateNode;
  }
}

var shouldErrorImpl = function(fiber) {
  return null;
};

function shouldError(fiber) {
  return shouldErrorImpl(fiber);
}

var shouldSuspendImpl = function(fiber) {
  return false;
};

function shouldSuspend(fiber) {
  return shouldSuspendImpl(fiber);
}
var isStrictMode = false;
var overrideHookState = null;
var overrideHookStateDeletePath = null;
var overrideHookStateRenamePath = null;
var overrideProps = null;
var overridePropsDeletePath = null;
var overridePropsRenamePath = null;
var scheduleUpdate = null;
var setErrorHandler = null;
var setSuspenseHandler = null;

{
  var copyWithDeleteImpl = function(obj, path, index) {
    var key = path[index];
    var updated = isArray(obj) ? obj.slice() : Object.assign({}, obj);

    if (index + 1 === path.length) {
      if (isArray(updated)) {
        updated.splice(key, 1);
      } else {
        delete updated[key];
      }

      return updated;
    } // $FlowFixMe number or string is fine here

    updated[key] = copyWithDeleteImpl(obj[key], path, index + 1);
    return updated;
  };

  var copyWithDelete = function(obj, path) {
    return copyWithDeleteImpl(obj, path, 0);
  };

  var copyWithRenameImpl = function(obj, oldPath, newPath, index) {
    var oldKey = oldPath[index];
    var updated = isArray(obj) ? obj.slice() : Object.assign({}, obj);

    if (index + 1 === oldPath.length) {
      var newKey = newPath[index]; // $FlowFixMe number or string is fine here

      updated[newKey] = updated[oldKey];

      if (isArray(updated)) {
        updated.splice(oldKey, 1);
      } else {
        delete updated[oldKey];
      }
    } else {
      // $FlowFixMe number or string is fine here
      updated[oldKey] = copyWithRenameImpl(
        // $FlowFixMe number or string is fine here
        obj[oldKey],
        oldPath,
        newPath,
        index + 1
      );
    }

    return updated;
  };

  var copyWithRename = function(obj, oldPath, newPath) {
    if (oldPath.length !== newPath.length) {
      warn("copyWithRename() expects paths of the same length");

      return;
    } else {
      for (var i = 0; i < newPath.length - 1; i++) {
        if (oldPath[i] !== newPath[i]) {
          warn(
            "copyWithRename() expects paths to be the same except for the deepest key"
          );

          return;
        }
      }
    }

    return copyWithRenameImpl(obj, oldPath, newPath, 0);
  };

  var copyWithSetImpl = function(obj, path, index, value) {
    if (index >= path.length) {
      return value;
    }

    var key = path[index];
    var updated = isArray(obj) ? obj.slice() : Object.assign({}, obj); // $FlowFixMe number or string is fine here

    updated[key] = copyWithSetImpl(obj[key], path, index + 1, value);
    return updated;
  };

  var copyWithSet = function(obj, path, value) {
    return copyWithSetImpl(obj, path, 0, value);
  };

  var findHook = function(fiber, id) {
    // For now, the "id" of stateful hooks is just the stateful hook index.
    // This may change in the future with e.g. nested hooks.
    var currentHook = fiber.memoizedState;

    while (currentHook !== null && id > 0) {
      currentHook = currentHook.next;
      id--;
    }

    return currentHook;
  }; // Support DevTools editable values for useState and useReducer.

  overrideHookState = function(fiber, id, path, value) {
    var hook = findHook(fiber, id);

    if (hook !== null) {
      var newState = copyWithSet(hook.memoizedState, path, value);
      hook.memoizedState = newState;
      hook.baseState = newState; // We aren't actually adding an update to the queue,
      // because there is no update we can add for useReducer hooks that won't trigger an error.
      // (There's no appropriate action type for DevTools overrides.)
      // As a result though, React will see the scheduled update as a noop and bailout.
      // Shallow cloning props works as a workaround for now to bypass the bailout check.

      fiber.memoizedProps = Object.assign({}, fiber.memoizedProps);
      scheduleUpdateOnFiber(fiber, SyncLane, NoTimestamp);
    }
  };

  overrideHookStateDeletePath = function(fiber, id, path) {
    var hook = findHook(fiber, id);

    if (hook !== null) {
      var newState = copyWithDelete(hook.memoizedState, path);
      hook.memoizedState = newState;
      hook.baseState = newState; // We aren't actually adding an update to the queue,
      // because there is no update we can add for useReducer hooks that won't trigger an error.
      // (There's no appropriate action type for DevTools overrides.)
      // As a result though, React will see the scheduled update as a noop and bailout.
      // Shallow cloning props works as a workaround for now to bypass the bailout check.

      fiber.memoizedProps = Object.assign({}, fiber.memoizedProps);
      scheduleUpdateOnFiber(fiber, SyncLane, NoTimestamp);
    }
  };

  overrideHookStateRenamePath = function(fiber, id, oldPath, newPath) {
    var hook = findHook(fiber, id);

    if (hook !== null) {
      var newState = copyWithRename(hook.memoizedState, oldPath, newPath);
      hook.memoizedState = newState;
      hook.baseState = newState; // We aren't actually adding an update to the queue,
      // because there is no update we can add for useReducer hooks that won't trigger an error.
      // (There's no appropriate action type for DevTools overrides.)
      // As a result though, React will see the scheduled update as a noop and bailout.
      // Shallow cloning props works as a workaround for now to bypass the bailout check.

      fiber.memoizedProps = Object.assign({}, fiber.memoizedProps);
      scheduleUpdateOnFiber(fiber, SyncLane, NoTimestamp);
    }
  }; // Support DevTools props for function components, forwardRef, memo, host components, etc.

  overrideProps = function(fiber, path, value) {
    fiber.pendingProps = copyWithSet(fiber.memoizedProps, path, value);

    if (fiber.alternate) {
      fiber.alternate.pendingProps = fiber.pendingProps;
    }

    scheduleUpdateOnFiber(fiber, SyncLane, NoTimestamp);
  };

  overridePropsDeletePath = function(fiber, path) {
    fiber.pendingProps = copyWithDelete(fiber.memoizedProps, path);

    if (fiber.alternate) {
      fiber.alternate.pendingProps = fiber.pendingProps;
    }

    scheduleUpdateOnFiber(fiber, SyncLane, NoTimestamp);
  };

  overridePropsRenamePath = function(fiber, oldPath, newPath) {
    fiber.pendingProps = copyWithRename(fiber.memoizedProps, oldPath, newPath);

    if (fiber.alternate) {
      fiber.alternate.pendingProps = fiber.pendingProps;
    }

    scheduleUpdateOnFiber(fiber, SyncLane, NoTimestamp);
  };

  scheduleUpdate = function(fiber) {
    scheduleUpdateOnFiber(fiber, SyncLane, NoTimestamp);
  };

  setErrorHandler = function(newShouldErrorImpl) {
    shouldErrorImpl = newShouldErrorImpl;
  };

  setSuspenseHandler = function(newShouldSuspendImpl) {
    shouldSuspendImpl = newShouldSuspendImpl;
  };
}

function findHostInstanceByFiber(fiber) {
  var hostFiber = findCurrentHostFiber(fiber);

  if (hostFiber === null) {
    return null;
  }

  return hostFiber.stateNode;
}

function emptyFindFiberByHostInstance(instance) {
  return null;
}

function getCurrentFiberForDevTools() {
  return current;
}

function getIsStrictModeForDevtools() {
  return isStrictMode;
}
function setIsStrictModeForDevtools(newIsStrictMode) {
  isStrictMode = newIsStrictMode;

  {
    if (newIsStrictMode) {
      disableLogs();
    } else {
      reenableLogs();
    }
  }
}
function injectIntoDevTools(devToolsConfig) {
  var findFiberByHostInstance = devToolsConfig.findFiberByHostInstance;
  var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
  return injectInternals({
    bundleType: devToolsConfig.bundleType,
    version: devToolsConfig.version,
    rendererPackageName: devToolsConfig.rendererPackageName,
    rendererConfig: devToolsConfig.rendererConfig,
    overrideHookState: overrideHookState,
    overrideHookStateDeletePath: overrideHookStateDeletePath,
    overrideHookStateRenamePath: overrideHookStateRenamePath,
    overrideProps: overrideProps,
    overridePropsDeletePath: overridePropsDeletePath,
    overridePropsRenamePath: overridePropsRenamePath,
    setErrorHandler: setErrorHandler,
    setSuspenseHandler: setSuspenseHandler,
    scheduleUpdate: scheduleUpdate,
    currentDispatcherRef: ReactCurrentDispatcher,
    findHostInstanceByFiber: findHostInstanceByFiber,
    findFiberByHostInstance:
      findFiberByHostInstance || emptyFindFiberByHostInstance,
    // React Refresh
    findHostInstancesForRefresh: findHostInstancesForRefresh,
    scheduleRefresh: scheduleRefresh,
    scheduleRoot: scheduleRoot,
    setRefreshHandler: setRefreshHandler,
    // Enables DevTools to append owner stacks to error messages in DEV mode.
    getCurrentFiber: getCurrentFiberForDevTools,
    getIsStrictMode: getIsStrictModeForDevtools,
    // Enables DevTools to detect reconciler version rather than renderer version
    // which may not match for third party renderers.
    reconcilerVersion: ReactVersion
  });
}

var emptyObject$1 = {};

{
  Object.freeze(emptyObject$1);
}

var createHierarchy;
var getHostNode;
var getHostProps;
var lastNonHostInstance;

var getOwnerHierarchy;
var traverseOwnerTreeUp;

{
  createHierarchy = function(fiberHierarchy) {
    return fiberHierarchy.map(function(fiber) {
      return {
        name: getComponentNameFromType(fiber.type),
        getInspectorData: function(findNodeHandle) {
          return {
            props: getHostProps(fiber),
            source: fiber._debugSource,
            measure: function(callback) {
              // If this is Fabric, we'll find a ShadowNode and use that to measure.
              var hostFiber = findCurrentHostFiber(fiber);
              var shadowNode =
                hostFiber != null &&
                hostFiber.stateNode !== null &&
                hostFiber.stateNode.node;

              if (shadowNode) {
                nativeFabricUIManager.measure(shadowNode, callback);
              } else {
                return ReactNativePrivateInterface.UIManager.measure(
                  getHostNode(fiber, findNodeHandle),
                  callback
                );
              }
            }
          };
        }
      };
    });
  };

  getHostNode = function(fiber, findNodeHandle) {
    var hostNode; // look for children first for the hostNode
    // as composite fibers do not have a hostNode

    while (fiber) {
      if (fiber.stateNode !== null && fiber.tag === HostComponent) {
        hostNode = findNodeHandle(fiber.stateNode);
      }

      if (hostNode) {
        return hostNode;
      }

      fiber = fiber.child;
    }

    return null;
  };

  getHostProps = function(fiber) {
    var host = findCurrentHostFiber(fiber);

    if (host) {
      return host.memoizedProps || emptyObject$1;
    }

    return emptyObject$1;
  };

  exports.getInspectorDataForInstance = function(closestInstance) {
    // Handle case where user clicks outside of ReactNative
    if (!closestInstance) {
      return {
        hierarchy: [],
        props: emptyObject$1,
        selectedIndex: null,
        source: null
      };
    }

    var fiber = findCurrentFiberUsingSlowPath(closestInstance);
    var fiberHierarchy = getOwnerHierarchy(fiber);
    var instance = lastNonHostInstance(fiberHierarchy);
    var hierarchy = createHierarchy(fiberHierarchy);
    var props = getHostProps(instance);
    var source = instance._debugSource;
    var selectedIndex = fiberHierarchy.indexOf(instance);
    return {
      hierarchy: hierarchy,
      props: props,
      selectedIndex: selectedIndex,
      source: source
    };
  };

  getOwnerHierarchy = function(instance) {
    var hierarchy = [];
    traverseOwnerTreeUp(hierarchy, instance);
    return hierarchy;
  };

  lastNonHostInstance = function(hierarchy) {
    for (var i = hierarchy.length - 1; i > 1; i--) {
      var instance = hierarchy[i];

      if (instance.tag !== HostComponent) {
        return instance;
      }
    }

    return hierarchy[0];
  };

  traverseOwnerTreeUp = function(hierarchy, instance) {
    if (instance) {
      hierarchy.unshift(instance);
      traverseOwnerTreeUp(hierarchy, instance._debugOwner);
    }
  };
}

var getInspectorDataForViewTag;
var getInspectorDataForViewAtPoint;

{
  getInspectorDataForViewTag = function(viewTag) {
    var closestInstance = getInstanceFromTag(viewTag); // Handle case where user clicks outside of ReactNative

    if (!closestInstance) {
      return {
        hierarchy: [],
        props: emptyObject$1,
        selectedIndex: null,
        source: null
      };
    }

    var fiber = findCurrentFiberUsingSlowPath(closestInstance);
    var fiberHierarchy = getOwnerHierarchy(fiber);
    var instance = lastNonHostInstance(fiberHierarchy);
    var hierarchy = createHierarchy(fiberHierarchy);
    var props = getHostProps(instance);
    var source = instance._debugSource;
    var selectedIndex = fiberHierarchy.indexOf(instance);
    return {
      hierarchy: hierarchy,
      props: props,
      selectedIndex: selectedIndex,
      source: source
    };
  };

  getInspectorDataForViewAtPoint = function(
    findNodeHandle,
    inspectedView,
    locationX,
    locationY,
    callback
  ) {
    var closestInstance = null;

    if (inspectedView._internalInstanceHandle != null) {
      // For Fabric we can look up the instance handle directly and measure it.
      nativeFabricUIManager.findNodeAtPoint(
        inspectedView._internalInstanceHandle.stateNode.node,
        locationX,
        locationY,
        function(internalInstanceHandle) {
          if (internalInstanceHandle == null) {
            callback(
              Object.assign(
                {
                  pointerY: locationY,
                  frame: {
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                  }
                },
                exports.getInspectorDataForInstance(closestInstance)
              )
            );
          }

          closestInstance =
            internalInstanceHandle.stateNode.canonical._internalInstanceHandle; // Note: this is deprecated and we want to remove it ASAP. Keeping it here for React DevTools compatibility for now.

          var nativeViewTag =
            internalInstanceHandle.stateNode.canonical._nativeTag;
          nativeFabricUIManager.measure(
            internalInstanceHandle.stateNode.node,
            function(x, y, width, height, pageX, pageY) {
              var inspectorData = exports.getInspectorDataForInstance(
                closestInstance
              );
              callback(
                Object.assign({}, inspectorData, {
                  pointerY: locationY,
                  frame: {
                    left: pageX,
                    top: pageY,
                    width: width,
                    height: height
                  },
                  touchedViewTag: nativeViewTag
                })
              );
            }
          );
        }
      );
    } else if (inspectedView._internalFiberInstanceHandleDEV != null) {
      // For Paper we fall back to the old strategy using the React tag.
      ReactNativePrivateInterface.UIManager.findSubviewIn(
        findNodeHandle(inspectedView),
        [locationX, locationY],
        function(nativeViewTag, left, top, width, height) {
          var inspectorData = exports.getInspectorDataForInstance(
            getInstanceFromTag(nativeViewTag)
          );
          callback(
            Object.assign({}, inspectorData, {
              pointerY: locationY,
              frame: {
                left: left,
                top: top,
                width: width,
                height: height
              },
              touchedViewTag: nativeViewTag
            })
          );
        }
      );
    } else {
      error(
        "getInspectorDataForViewAtPoint expects to receive a host component"
      );

      return;
    }
  };
}

var ReactCurrentOwner$3 = ReactSharedInternals.ReactCurrentOwner;

function findHostInstance_DEPRECATED(componentOrHandle) {
  {
    var owner = ReactCurrentOwner$3.current;

    if (owner !== null && owner.stateNode !== null) {
      if (!owner.stateNode._warnedAboutRefsInRender) {
        error(
          "%s is accessing findNodeHandle inside its render(). " +
            "render() should be a pure function of props and state. It should " +
            "never access something that requires stale data from the previous " +
            "render, such as refs. Move this logic to componentDidMount and " +
            "componentDidUpdate instead.",
          getComponentNameFromType(owner.type) || "A component"
        );
      }

      owner.stateNode._warnedAboutRefsInRender = true;
    }
  }

  if (componentOrHandle == null) {
    return null;
  }

  if (componentOrHandle._nativeTag) {
    return componentOrHandle;
  }

  if (componentOrHandle.canonical && componentOrHandle.canonical._nativeTag) {
    return componentOrHandle.canonical;
  }

  var hostInstance;

  {
    hostInstance = findHostInstanceWithWarning(
      componentOrHandle,
      "findHostInstance_DEPRECATED"
    );
  }

  if (hostInstance == null) {
    return hostInstance;
  }

  if (hostInstance.canonical) {
    // Fabric
    return hostInstance.canonical;
  } // $FlowFixMe[incompatible-return]

  return hostInstance;
}

function findNodeHandle(componentOrHandle) {
  {
    var owner = ReactCurrentOwner$3.current;

    if (owner !== null && owner.stateNode !== null) {
      if (!owner.stateNode._warnedAboutRefsInRender) {
        error(
          "%s is accessing findNodeHandle inside its render(). " +
            "render() should be a pure function of props and state. It should " +
            "never access something that requires stale data from the previous " +
            "render, such as refs. Move this logic to componentDidMount and " +
            "componentDidUpdate instead.",
          getComponentNameFromType(owner.type) || "A component"
        );
      }

      owner.stateNode._warnedAboutRefsInRender = true;
    }
  }

  if (componentOrHandle == null) {
    return null;
  }

  if (typeof componentOrHandle === "number") {
    // Already a node handle
    return componentOrHandle;
  }

  if (componentOrHandle._nativeTag) {
    return componentOrHandle._nativeTag;
  }

  if (componentOrHandle.canonical && componentOrHandle.canonical._nativeTag) {
    return componentOrHandle.canonical._nativeTag;
  }

  var hostInstance;

  {
    hostInstance = findHostInstanceWithWarning(
      componentOrHandle,
      "findNodeHandle"
    );
  }

  if (hostInstance == null) {
    return hostInstance;
  }

  if (hostInstance.canonical) {
    // Fabric
    return hostInstance.canonical._nativeTag;
  }

  return hostInstance._nativeTag;
}

function dispatchCommand(handle, command, args) {
  if (handle._nativeTag == null) {
    {
      error(
        "dispatchCommand was called with a ref that isn't a " +
          "native component. Use React.forwardRef to get access to the underlying native component"
      );
    }

    return;
  }

  if (handle._internalInstanceHandle != null) {
    var stateNode = handle._internalInstanceHandle.stateNode;

    if (stateNode != null) {
      nativeFabricUIManager.dispatchCommand(stateNode.node, command, args);
    }
  } else {
    ReactNativePrivateInterface.UIManager.dispatchViewManagerCommand(
      handle._nativeTag,
      command,
      args
    );
  }
}

function sendAccessibilityEvent(handle, eventType) {
  if (handle._nativeTag == null) {
    {
      error(
        "sendAccessibilityEvent was called with a ref that isn't a " +
          "native component. Use React.forwardRef to get access to the underlying native component"
      );
    }

    return;
  }

  if (handle._internalInstanceHandle != null) {
    var stateNode = handle._internalInstanceHandle.stateNode;

    if (stateNode != null) {
      nativeFabricUIManager.sendAccessibilityEvent(stateNode.node, eventType);
    }
  } else {
    ReactNativePrivateInterface.legacySendAccessibilityEvent(
      handle._nativeTag,
      eventType
    );
  }
}

function render(element, containerTag, callback) {
  var root = roots.get(containerTag);

  if (!root) {
    // TODO (bvaughn): If we decide to keep the wrapper component,
    // We could create a wrapper for containerTag as well to reduce special casing.
    root = createContainer(containerTag, LegacyRoot, false, null, false, null);
    roots.set(containerTag, root);
  }

  updateContainer(element, root, null, callback); // $FlowIssue Flow has hardcoded values for React DOM that don't work with RN

  return getPublicRootInstance(root);
}

function unmountComponentAtNode(containerTag) {
  var root = roots.get(containerTag);

  if (root) {
    // TODO: Is it safe to reset this now or should I wait since this unmount could be deferred?
    updateContainer(null, root, null, function() {
      roots.delete(containerTag);
    });
  }
}

function unmountComponentAtNodeAndRemoveContainer(containerTag) {
  unmountComponentAtNode(containerTag); // Call back into native to remove all of the subviews from this container

  ReactNativePrivateInterface.UIManager.removeRootView(containerTag);
}

function createPortal$1(children, containerTag) {
  var key =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return createPortal(children, containerTag, null, key);
}

setBatchingImplementation(batchedUpdates$1);

function computeComponentStackForErrorReporting(reactTag) {
  var fiber = getInstanceFromTag(reactTag);

  if (!fiber) {
    return "";
  }

  return getStackByFiberInDevAndProd(fiber);
}

var roots = new Map();
var Internals = {
  computeComponentStackForErrorReporting: computeComponentStackForErrorReporting
};
injectIntoDevTools({
  findFiberByHostInstance: getInstanceFromTag,
  bundleType: 1,
  version: ReactVersion,
  rendererPackageName: "react-native-renderer",
  rendererConfig: {
    getInspectorDataForViewTag: getInspectorDataForViewTag,
    getInspectorDataForViewAtPoint: getInspectorDataForViewAtPoint.bind(
      null,
      findNodeHandle
    )
  }
});

exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Internals;
exports.createPortal = createPortal$1;
exports.dispatchCommand = dispatchCommand;
exports.findHostInstance_DEPRECATED = findHostInstance_DEPRECATED;
exports.findNodeHandle = findNodeHandle;
exports.render = render;
exports.sendAccessibilityEvent = sendAccessibilityEvent;
exports.unmountComponentAtNode = unmountComponentAtNode;
exports.unmountComponentAtNodeAndRemoveContainer = unmountComponentAtNodeAndRemoveContainer;
exports.unstable_batchedUpdates = batchedUpdates;

  })();
}
