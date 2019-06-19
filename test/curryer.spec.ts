
import { expect } from 'chai'

import '../src'

import { bodyExtractor } from '../src/extractor'
import { passthroughHandler } from '../src/errorHandler'
import { jsonRes } from '../src/responder'
import { curryer } from '../src/curryer'
import { MockReq, MockRes } from './testUtils'

describe('curryer', () => {
  it('should return curried function with one argument', () => {
    let errorHandled = curryer(passthroughHandler)
    expect(typeof errorHandled).to.be.eql('function')
    expect(errorHandled).does.not.equal(curryer)
  })

  it('should return curried function with two arguments', () => {
    let errorAndExtract = curryer(passthroughHandler, bodyExtractor)
    expect(typeof errorAndExtract).to.be.eql('function')
    expect(errorAndExtract).does.not.equal(curryer)
  })

  it('should return curried function with three arguments', () => {
    let errorAndExtractAndResponse = curryer(passthroughHandler, bodyExtractor, jsonRes)
    expect(typeof errorAndExtractAndResponse).to.be.eql('function')
    expect(errorAndExtractAndResponse).does.not.equal(curryer)
  })

  it('should execute all functions and return the controller data', async () => {
    const data = { foo: 'bar' }
    const mockedRes = new MockRes()
    const murryer = curryer(passthroughHandler, bodyExtractor, jsonRes, async () => data.foo)

    const res = await murryer(new MockReq(data), mockedRes)

    expect(res).to.be.equal(data.foo)
    expect(mockedRes.jsonCalled).to.be.equal(true)
  })

  it('should execute the errorHandler upon an error', async () => {
    let errorHandlerCalled = false
    const murryer = curryer(passthroughHandler, bodyExtractor, jsonRes, () => {
      throw new Error('Ahhhh. There be dragons in these parts')
    })

    const res = await murryer(new MockReq(), new MockRes(), () => {
      errorHandlerCalled = true
    })

    expect(res).to.be.equal(undefined)
    expect(errorHandlerCalled).to.be.equal(true)
  })

  it('should handle transforming a non-array extracted payload into an array', async () => {
    const data = { foo: 'bar' }
    const mockedRes = new MockRes()
    const murryer = curryer(passthroughHandler, () => "not an array", jsonRes, async () => data.foo)

    const res = await murryer(new MockReq(data), mockedRes)

    expect(res).to.be.equal(data.foo)
    expect(mockedRes.jsonCalled).to.be.equal(true)
  })
})
