
import { curry } from 'ramda'

const curryer = curry(
  (errorHandler, extractor, responder, controller) =>
    async (req, res, next) => {
      try {
        // extract the payload from the req
        let payload = extractor(req)

        if (!Array.isArray(payload)) {
          throw new Error('Payload from extractor must be an array of arguments to spread into the controller')
        }

        // call the controller method providing the payload
        let data = await controller(...payload)
        responder(req, res, next)(data)
        return data
      } catch (err) {
        errorHandler(req, res, next)(err)
      }
    }
)

module.exports = {
  curryer
}
