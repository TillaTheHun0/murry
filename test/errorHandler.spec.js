
import '../src'

import { passthroughHandler } from '../src/errorHandler'
import { expect } from 'chai'

describe('errorHandler', () => {
  it('should call next()', () => {
    let nextCalled = false
    let next = () => {
      nextCalled = true
    }

    passthroughHandler()(...[null, null, next])
    expect(nextCalled).to.equal(true)
  })
})
