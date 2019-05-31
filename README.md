# koa-proper

A body validation for koa, based on prop-types.

## Installation
```
npm i --save koa-proper
```

## Usage
```javascript
import Koa from 'koa'
import PropTypes from 'prop-types'
import proper from 'proper'

const app = new Koa()
app.use(proper())

app.use(async ctx => {
    // input props: {string: any}
    const props = ctx.request.query
    // types for validation: {string: PropType}
    const types = {
        username: PropTypes.string.isRequired
    }

    // the validator will store in ctx.proper
    // if the props valid, return it back
    const params = ctx.proper(props, types)

    // if invalid, will throw a http error automatically
    // you can disable it by set `auto` to false
    // and, you can set custom error thrower

    // ctx.throw(400, error) <---- the default error thrower

    // do anthing when you want if valid
    ctx.body = params
})

```

## Options

| Name | Type | Default | Description |
|---|---|---|---|
| **auto** | `Boolean` | true | when `true`, will throw http error automatically |
| **throw** | `Function` | (ctx, error) =>  { ctx.throw(400, error.message) } | error thrower |
| **log** | `Function` | (ctx, error) => { console.warn(error.message) } | error logger |

You can set global options, and one time options
```javascript
const app = new Koa()

// set global options
app.use(proper({
    auto: true
}))

app.use(async ctx => {
    const props = ctx.request.query
    const types = {
        username: PropTypes.string.isRequired
    }

    // set options to override global options
    // when set auto `false`, will return null if invalid
    const params = ctx.proper(props, types, { auto: false })

    if (params) {
        // do anthing when you want if valid
        ctx.body = params
    } else {
        // handling error
        ctx.body = 'The query is invalid'
    }
})
```

## Licences

[MIT](https://github.com/4074/koa-proper/blob/master/LICENSE)