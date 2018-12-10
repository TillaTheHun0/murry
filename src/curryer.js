
const { curry } = require('ramda')

const curryer = curry((errorHandler, extractor, responder, controller) => {
  return async (req, res, next) => {
    try {
      // extract the payload from the req
      let payload = extractor(req)
      payload = Array.isArray(payload) ? payload : [payload]

      // call the controller method providing the payload
      let data = await controller(...payload)
      responder(req, res, next)(data)
      return data
    } catch (err) {
      errorHandler(err)
    }
  }
})

module.exports = {
  curryer
}
