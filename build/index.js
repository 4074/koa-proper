"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middleware;
exports.proper = proper;
exports.PropTypes = void 0;

var _propTypes = _interopRequireDefault(require("prop-types/prop-types"));

var _ReactPropTypesSecret = _interopRequireDefault(require("prop-types/lib/ReactPropTypesSecret"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaults = {
  auto: true,
  throw: (ctx, error) => {
    ctx.throw(400, error.message);
  },
  log: (ctx, error) => {
    console && console.warn && console.warn(error.message);
  }
};

function middleware(globalOptions) {
  return async function (ctx, next) {
    ctx.PropTypes = _propTypes.default;

    ctx.proper = (props, types, options = {}) => {
      options = { ...defaults,
        ...globalOptions,
        ...options
      };
      return proper(props, types, ctx.request.url, error => {
        ctx.makePropError = error;

        if (options.log && typeof options.log === 'function') {
          options.log(ctx, error);
        }

        if (error && options.auto && options.throw && typeof options.throw === 'function') {
          options.throw(ctx, error);
        }
      });
    };

    await next();
  };
}

function proper(props, types = {}, component, handle) {
  const result = {};
  const errors = [];

  for (const key of Object.keys(types)) {
    const error = types[key](props, key, component, 'props', null, _ReactPropTypesSecret.default);

    if (error) {
      errors.push(error);
    } else {
      result[key] = props[key];
    }
  }

  if (errors.length) {
    const message = errors.map(e => e.message).join('\n');
    handle = handle || defaultHandle;

    if (handle && typeof handle === 'function') {
      handle(new Error(message));
    }

    return null;
  }

  return result;
}

const PropTypes = _propTypes.default;
exports.PropTypes = PropTypes;