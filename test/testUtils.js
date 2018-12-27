
export const wrapper = (caller, expecter) => {
  let res = caller()
  expecter(res)
}

export class MockRes {
  constructor () {
    this.sendStatusCalled = false
    this.jsonCalled = false
    this.renderCalled = false
    this.statusCalled = false
  }

  json () {
    this.jsonCalled = true
    return this
  }

  status () {
    this.statusCalled = true
    return this
  }

  sendStatus () {
    this.sendStatusCalled = true
    return this
  }

  render () {
    this.renderCalled = true
    return this
  }
}

export class MockReq {
  constructor (body, params, query) {
    this.body = body
    this.params = params
    this.query = query
  }
}
