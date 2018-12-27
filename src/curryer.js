
import { curry } from 'ramda'

const curryer = curry(
  (errorHandler, extractor, responder, controller) =>
    async (...args) => {
      try {
        // extract the payload from the req
        let payload = extractor(...args)

        if (!Array.isArray(payload)) {
          throw new Error('Payload from extractor must be an array of arguments to spread into the controller')
        }

        // call the controller method providing the payload
        let data = await controller(...payload)
        responder(...args)(data)
        return data
      } catch (err) {
        errorHandler(...args)(err)
      }
    }
)

module.exports = {
  curryer
}
