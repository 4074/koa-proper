import Koa from 'koa'
import request from 'request-promise'
import ProperMiddleware from '../src/index'

const app = new Koa()
const port = 29492

app.use(ProperMiddleware())
app.use(ctx => {
    ctx.proper(ctx.request.query, {
        username: ctx.PropTypes.string.isRequired
    })
    ctx.body = 'Hello Koa'
})
app.listen(port, (ctx) => {
    console.log(`App running on ${port}`)
})

test('Get the body if valid', async () => {
    const result = await request.get(`http://localhost:${port}/?username=hello`)
    expect(result).toBe('Hello Koa')
})

test('Get the error if invalid', async () => {
    try {
        await request.get(`http://localhost:${port}/?age=18`)
    } catch (error) {
        expect(error.statusCode).toBe(400)
        expect(error.error).toBe('The props `username` is marked as required in `/?age=18`, but its value is `undefined`.')
    }
})