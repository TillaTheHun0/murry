
import { expect } from 'chai'

import {
  postCurryer,
  putCurryer,
  getCurryer,
  deleteCurryer
} from '../src'

import { MockRes, MockReq } from './testUtils'

const controller = async args => args

describe('defaultMurryers', () => {
  it('should call postCurryer which extracts body and return json', async () => {
    const data = { foo: 'bar' }
    const mockedRes = new MockRes()

    const res = await postCurryer(controller)(new MockReq(data, data), mockedRes)
    expect(res).to.be.equal(data)
    expect(mockedRes.jsonCalled).to.be.equal(true)
  })

  it('should call putCurryer which extracts body and return json', async () => {
    const data = { foo: 'bar' }
    const mockedRes = new MockRes()

    const res = await putCurryer(controller)(new MockReq(data, data), mockedRes)
    expect(res).to.be.equal(data)
    expect(mockedRes.jsonCalled).to.be.equal(true)
  })

  it('should call getCurryer which extracts query and return json', async () => {
    const data = { foo: 'bar' }
    const mockedRes = new MockRes()

    const res = await getCurryer(controller)(new MockReq(null, null, data), mockedRes)

    expect(res).to.be.equal(data)
    expect(mockedRes.jsonCalled).to.be.equal(true)
  })

  it('should call deleteCurryer which return status', async () => {
    const data = { foo: 'bar' }
    const mockedRes = new MockRes()

    const res = await deleteCurryer(controller)(new MockReq(data, data), mockedRes)

    expect(res).to.be.equal(res)
    expect(mockedRes.sendStatusCalled).to.be.equal(true)
  })
})
