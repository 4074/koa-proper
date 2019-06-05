import __PropTypes from 'prop-types/prop-types'
import ReactPropTypesSecret from 'prop-types/lib/ReactPropTypesSecret'

const defaults = {
    auto: true,
    throw: (ctx, error) => {
        ctx.throw(400, error.message)
    },
    log: (ctx, error) => {
        console && console.warn && console.warn(error.message)
    }
}

export default function middleware(globalOptions) {
    return async function (ctx, next) {
        ctx.PropTypes = __PropTypes
        ctx.proper = (props, types, options = {}) => {
            options = {
                ...defaults,
                ...globalOptions,
                ...options
            }

            return proper(props, types, ctx.request.url, (error) => {
                ctx.makePropError = error

                if (options.log && typeof options.log === 'function') {
                    options.log(ctx, error)
                }

                if (error && options.auto && options.throw && typeof options.throw === 'function') {
                    options.throw(ctx, error)
                }
            })
        }
        await next()
    }
}

export function proper(props, types = {}, component, handle) {
    const result = {}
    const errors = []
    
    for (const key of Object.keys(types)) {
        const error = types[key](props, key, component, 'props', null, ReactPropTypesSecret)
        if (error) {
            errors.push(error)
        } else {
            result[key] = props[key]
        }
    }

    if (errors.length) {
        const message = errors.map(e => e.message).join('\n')
        handle = handle || defaultHandle
        if (handle && typeof handle === 'function') {
            handle(new Error(message))
        }
        return null
    }

    return result
}

export const PropTypes = __PropTypes 