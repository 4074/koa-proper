import PropTypes from 'prop-types'
import { proper } from '../src/index'

test('Valid string value for string expected', () => {
    const result = proper({
        username: 'Hello'
    }, {
        username: PropTypes.string.isRequired
    }, 'test', (error) => {
    })

    expect(result).not.toBe(null)
    expect(result.username).toBe('Hello')
})

test('Invalid string value for number expected', () => {
    const result = proper({
        username: 'Hello'
    }, {
        username: PropTypes.number.isRequired
    }, 'test', (error) => {
        expect(error.message).toBe('Invalid props `username` of type `string` supplied to `test`, expected `number`.')
    })
    expect(result).toBe(null)
})

test('Invalid undefined value for require expected', () => {
    const result = proper({
    }, {
        username: PropTypes.number.isRequired
    }, 'test', (error) => {
        expect(error.message).toBe('The props `username` is marked as required in `test`, but its value is `undefined`.')
    })
    expect(result).toBe(null)
})