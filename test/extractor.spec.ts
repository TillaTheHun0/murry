
import { expect } from 'chai'

import '../src'

import { bodyExtractor, paramExtractor, queryExtractor, passthroughExtractor } from '../src/extractor'
import { wrapper } from './testUtils'

const caller = func =>
  arg =>
    func(arg)

describe('extractor', () => {
  it('should return the body from the first argument', () => {
    const key = 'body'
    const arg = {
      body: {
        foo: 'bar'
      }
    }

    let call = () =>
      caller(bodyExtractor)(arg)

    wrapper(call, ([res]) => {
      expect(res).to.equal(key ? arg[key] : arg)
    })
  })

  it('should return the params from the first argument', () => {
    const key = 'params'
    const arg = {
      params: {
        foo: 'bar'
      }
    }

    let call = () =>
      caller(paramExtractor)(arg)

    wrapper(call, ([res]) => {
      expect(res).to.equal(key ? arg[key] : arg)
    })
  })

  it('should return the query from the first argument', () => {
    const key = 'query'
    const arg = {
      query: {
        foo: 'bar'
      }
    }

    let call = () =>
      caller(queryExtractor)(arg)

    wrapper(call, ([res]) => {
      expect(res).to.equal(key ? arg[key] : arg)
    })
  })

  it('should simply return the first argument', () => {
    const key = null
    const arg = {
      body: {
        foo: 'bar'
      }
    }

    let call = () =>
      caller(passthroughExtractor)(arg)

    wrapper(call, ([res]) => {
      expect(res).to.equal(key ? arg[key] : arg)
    })
  })
})
