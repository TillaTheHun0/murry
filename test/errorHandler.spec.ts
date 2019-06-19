
import { expect } from 'chai'

import '../src'

import { passthroughHandler } from '../src/errorHandler'

describe('errorHandler', () => {
  it('should call next()', () => {
    let nextCalled = false
    let next = () => {
      nextCalled = true
    }

    passthroughHandler(new Error(''))(...[null, null, next])
    expect(nextCalled).to.equal(true)
  })
})
