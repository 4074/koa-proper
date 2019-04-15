import ReactPropTypesSecret from 'prop-types/lib/ReactPropTypesSecret'

export default function middleware(handle) {
    return async function proper(ctx, next) {
        ctx.prop = (s, t, d, c, h) => {
            return propMaker(s, t, d, ctx.request.url, (error) => {
                ctx.makePropError = error
                if (handle && typeof handle === 'function') {
                    handle.bind(ctx, error)
                } else {
                    defaultHandle(error)
                }
            })
        }
        await next()
    }
}

export function propMaker(source, types = {}, defaults = {}, component, handle) {
    if (typeof defaults === 'string') {
        handle = component
        component = defaults
        defaults = {}
    }
    const props = {
        ...defaults,
        ...source
    }
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

function defaultHandle(error) {
    console && console.warn && console.warn(error.message)
}