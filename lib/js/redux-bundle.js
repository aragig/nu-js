(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ReduxBundle = {}));
})(this, (function (exports) { 'use strict';

  // src/utils/formatProdErrorMessage.ts
  function formatProdErrorMessage(code) {
    return `Minified Redux error #${code}; visit https://redux.js.org/Errors?code=${code} for the full message or use the non-minified dev environment for full errors. `;
  }

  // src/utils/symbol-observable.ts
  var $$observable = /* @__PURE__ */ (() => typeof Symbol === "function" && Symbol.observable || "@@observable")();
  var symbol_observable_default = $$observable;

  // src/utils/actionTypes.ts
  var randomString = () => Math.random().toString(36).substring(7).split("").join(".");
  var ActionTypes = {
    INIT: `@@redux/INIT${/* @__PURE__ */ randomString()}`,
    REPLACE: `@@redux/REPLACE${/* @__PURE__ */ randomString()}`,
    PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString()}`
  };
  var actionTypes_default = ActionTypes;

  // src/utils/isPlainObject.ts
  function isPlainObject(obj) {
    if (typeof obj !== "object" || obj === null)
      return false;
    let proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto || Object.getPrototypeOf(obj) === null;
  }

  // src/createStore.ts
  function createStore(reducer, preloadedState, enhancer) {
    if (typeof reducer !== "function") {
      throw new Error(formatProdErrorMessage(2) );
    }
    if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
      throw new Error(formatProdErrorMessage(0) );
    }
    if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
      enhancer = preloadedState;
      preloadedState = void 0;
    }
    if (typeof enhancer !== "undefined") {
      if (typeof enhancer !== "function") {
        throw new Error(formatProdErrorMessage(1) );
      }
      return enhancer(createStore)(reducer, preloadedState);
    }
    let currentReducer = reducer;
    let currentState = preloadedState;
    let currentListeners = /* @__PURE__ */ new Map();
    let nextListeners = currentListeners;
    let listenerIdCounter = 0;
    let isDispatching = false;
    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = /* @__PURE__ */ new Map();
        currentListeners.forEach((listener, key) => {
          nextListeners.set(key, listener);
        });
      }
    }
    function getState() {
      if (isDispatching) {
        throw new Error(formatProdErrorMessage(3) );
      }
      return currentState;
    }
    function subscribe(listener) {
      if (typeof listener !== "function") {
        throw new Error(formatProdErrorMessage(4) );
      }
      if (isDispatching) {
        throw new Error(formatProdErrorMessage(5) );
      }
      let isSubscribed = true;
      ensureCanMutateNextListeners();
      const listenerId = listenerIdCounter++;
      nextListeners.set(listenerId, listener);
      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }
        if (isDispatching) {
          throw new Error(formatProdErrorMessage(6) );
        }
        isSubscribed = false;
        ensureCanMutateNextListeners();
        nextListeners.delete(listenerId);
        currentListeners = null;
      };
    }
    function dispatch(action) {
      if (!isPlainObject(action)) {
        throw new Error(formatProdErrorMessage(7) );
      }
      if (typeof action.type === "undefined") {
        throw new Error(formatProdErrorMessage(8) );
      }
      if (typeof action.type !== "string") {
        throw new Error(formatProdErrorMessage(17) );
      }
      if (isDispatching) {
        throw new Error(formatProdErrorMessage(9) );
      }
      try {
        isDispatching = true;
        currentState = currentReducer(currentState, action);
      } finally {
        isDispatching = false;
      }
      const listeners = currentListeners = nextListeners;
      listeners.forEach((listener) => {
        listener();
      });
      return action;
    }
    function replaceReducer(nextReducer) {
      if (typeof nextReducer !== "function") {
        throw new Error(formatProdErrorMessage(10) );
      }
      currentReducer = nextReducer;
      dispatch({
        type: actionTypes_default.REPLACE
      });
    }
    function observable() {
      const outerSubscribe = subscribe;
      return {
        /**
         * The minimal observable subscription method.
         * @param observer Any object that can be used as an observer.
         * The observer object should have a `next` method.
         * @returns An object with an `unsubscribe` method that can
         * be used to unsubscribe the observable from the store, and prevent further
         * emission of values from the observable.
         */
        subscribe(observer) {
          if (typeof observer !== "object" || observer === null) {
            throw new Error(formatProdErrorMessage(11) );
          }
          function observeState() {
            const observerAsObserver = observer;
            if (observerAsObserver.next) {
              observerAsObserver.next(getState());
            }
          }
          observeState();
          const unsubscribe = outerSubscribe(observeState);
          return {
            unsubscribe
          };
        },
        [symbol_observable_default]() {
          return this;
        }
      };
    }
    dispatch({
      type: actionTypes_default.INIT
    });
    const store = {
      dispatch,
      subscribe,
      getState,
      replaceReducer,
      [symbol_observable_default]: observable
    };
    return store;
  }
  function legacy_createStore(reducer, preloadedState, enhancer) {
    return createStore(reducer, preloadedState, enhancer);
  }
  function assertReducerShape(reducers) {
    Object.keys(reducers).forEach((key) => {
      const reducer = reducers[key];
      const initialState = reducer(void 0, {
        type: actionTypes_default.INIT
      });
      if (typeof initialState === "undefined") {
        throw new Error(formatProdErrorMessage(12) );
      }
      if (typeof reducer(void 0, {
        type: actionTypes_default.PROBE_UNKNOWN_ACTION()
      }) === "undefined") {
        throw new Error(formatProdErrorMessage(13) );
      }
    });
  }
  function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers);
    const finalReducers = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      if (typeof reducers[key] === "function") {
        finalReducers[key] = reducers[key];
      }
    }
    const finalReducerKeys = Object.keys(finalReducers);
    let shapeAssertionError;
    try {
      assertReducerShape(finalReducers);
    } catch (e) {
      shapeAssertionError = e;
    }
    return function combination(state = {}, action) {
      if (shapeAssertionError) {
        throw shapeAssertionError;
      }
      let hasChanged = false;
      const nextState = {};
      for (let i = 0; i < finalReducerKeys.length; i++) {
        const key = finalReducerKeys[i];
        const reducer = finalReducers[key];
        const previousStateForKey = state[key];
        const nextStateForKey = reducer(previousStateForKey, action);
        if (typeof nextStateForKey === "undefined") {
          action && action.type;
          throw new Error(formatProdErrorMessage(14) );
        }
        nextState[key] = nextStateForKey;
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      }
      hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
      return hasChanged ? nextState : state;
    };
  }

  // src/bindActionCreators.ts
  function bindActionCreator(actionCreator, dispatch) {
    return function(...args) {
      return dispatch(actionCreator.apply(this, args));
    };
  }
  function bindActionCreators(actionCreators, dispatch) {
    if (typeof actionCreators === "function") {
      return bindActionCreator(actionCreators, dispatch);
    }
    if (typeof actionCreators !== "object" || actionCreators === null) {
      throw new Error(formatProdErrorMessage(16) );
    }
    const boundActionCreators = {};
    for (const key in actionCreators) {
      const actionCreator = actionCreators[key];
      if (typeof actionCreator === "function") {
        boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
      }
    }
    return boundActionCreators;
  }

  // src/compose.ts
  function compose(...funcs) {
    if (funcs.length === 0) {
      return (arg) => arg;
    }
    if (funcs.length === 1) {
      return funcs[0];
    }
    return funcs.reduce((a, b) => (...args) => a(b(...args)));
  }

  // src/applyMiddleware.ts
  function applyMiddleware(...middlewares) {
    return (createStore2) => (reducer, preloadedState) => {
      const store = createStore2(reducer, preloadedState);
      let dispatch = () => {
        throw new Error(formatProdErrorMessage(15) );
      };
      const middlewareAPI = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args)
      };
      const chain = middlewares.map((middleware) => middleware(middlewareAPI));
      dispatch = compose(...chain)(store.dispatch);
      return {
        ...store,
        dispatch
      };
    };
  }

  // src/utils/isAction.ts
  function isAction(action) {
    return isPlainObject(action) && "type" in action && typeof action.type === "string";
  }

  var redux = /*#__PURE__*/Object.freeze({
    __proto__: null,
    __DO_NOT_USE__ActionTypes: actionTypes_default,
    applyMiddleware: applyMiddleware,
    bindActionCreators: bindActionCreators,
    combineReducers: combineReducers,
    compose: compose,
    createStore: createStore,
    isAction: isAction,
    isPlainObject: isPlainObject,
    legacy_createStore: legacy_createStore
  });

  // src/index.ts
  function createThunkMiddleware(extraArgument) {
    const middleware = ({ dispatch, getState }) => (next) => (action) => {
      if (typeof action === "function") {
        return action(dispatch, getState, extraArgument);
      }
      return next(action);
    };
    return middleware;
  }
  var thunk = createThunkMiddleware();
  var withExtraArgument = createThunkMiddleware;

  var reduxThunk = /*#__PURE__*/Object.freeze({
    __proto__: null,
    thunk: thunk,
    withExtraArgument: withExtraArgument
  });

  exports.Redux = redux;
  exports.ReduxThunk = reduxThunk;

}));
