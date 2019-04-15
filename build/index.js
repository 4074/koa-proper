'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = middleware;
exports.propMaker = propMaker;

var _ReactPropTypesSecret = require('prop-types/lib/ReactPropTypesSecret');

var _ReactPropTypesSecret2 = _interopRequireDefault(_ReactPropTypesSecret);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function middleware(handle) {
    return (() => {
        var _ref = _asyncToGenerator(function* (ctx, next) {
            ctx.prop = function (s, t, d, c, h) {
                return propMaker(s, t, d, ctx.request.url, function (error) {
                    ctx.makePropError = error;
                    if (handle && typeof handle === 'function') {
                        handle.bind(ctx, error);
                    } else {
                        defaultHandle(error);
                    }
                });
            };
            yield next();
        });

        function proper(_x, _x2) {
            return _ref.apply(this, arguments);
        }

        return proper;
    })();
}

function propMaker(source, types = {}, defaults = {}, component, handle) {
    if (typeof defaults === 'string') {
        handle = component;
        component = defaults;
        defaults = {};
    }
    const props = _extends({}, defaults, source);
    const result = {};
    const errors = [];

    for (const key of Object.keys(types)) {
        const error = types[key](props, key, component, 'props', null, _ReactPropTypesSecret2.default);
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

function defaultHandle(error) {
    console && console.warn && console.warn(error.message);
}