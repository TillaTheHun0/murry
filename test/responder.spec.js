
import { expect } from 'chai'

import '../src'

import { jsonRes, jsonStatusRes, htmlRes, statusRes } from '../src/responder'
import { wrapper, MockRes } from './testUtils'

describe('responder', () => {
  it('should call json() on the provided object', () => {
    let mocked = new MockRes()

    let call = () =>
      jsonRes({ foo: 'bar' })(null, mocked)

    wrapper(call, () => {
      expect(mocked.jsonCalled).to.equal(true)
    })
  })

  it('should call json() and status() on the provided object', () => {
    let mocked = new MockRes()

    let call = () =>
      jsonStatusRes(200, { foo: 'bar' })(null, mocked)

    wrapper(call, () => {
      expect(mocked.jsonCalled).to.equal(true)
      expect(mocked.statusCalled).to.equal(true)
    })
  })

  it('should call render() on the provided object', () => {
    let mocked = new MockRes()

    let call = () =>
      htmlRes('sweet-view.html', { foo: 'bar' })(null, mocked)

    wrapper(call, () => {
      expect(mocked.renderCalled).to.equal(true)
    })
  })

  it('should call sendStatus() on the provided object', () => {
    let mocked = new MockRes()

    let call = () =>
      statusRes(200)(null, mocked)

    wrapper(call, () => {
      expect(mocked.sendStatusCalled).to.equal(true)
    })
  })
})
