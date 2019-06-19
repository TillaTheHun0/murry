
import curry from 'ramda/src/curry'

import { ErrorHandler } from './errorHandler'
import { Extractor } from './extractor'
import { Responder } from './responder'

export type CurryerTransform = (...args: any[]) => Promise<any>

export const curryer = curry(
  (
    errorHandler: ErrorHandler,
    extractor: Extractor,
    responder: Responder,
    controller: (...args: any[]) => Promise<any>
  ): CurryerTransform =>
    async (...args: any[]): Promise<any> => {
      try {
        // extract the payload from the req
        let payload = extractor(...args)

        // always ensure payload is an array
        payload = Array.isArray(payload) ? payload : [payload]

        // call the controller method providing the payload
        const data = await controller(...payload)
        responder(data)(...args)
        return data
      } catch (err) {
        errorHandler(err)(...args)
      }
    }
)
