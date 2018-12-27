
import '@babel/polyfill'

import { __ } from 'ramda'

import { curryer } from './curryer'

import * as errorHandlers from './errorHandler'
import * as responders from './responder'
import * as extractors from './extractor'

const { passthroughHandler } = errorHandlers
const { jsonRes, statusRes } = responders
const { paramExtractor, bodyExtractor, queryExtractor } = extractors

// default error handling
const defaultMurryer = curryer(passthroughHandler)

// default json response. Placeholding extractor and controller
const defaultJsonResCurryer = defaultMurryer(__, jsonRes)

// extracts params and body from request and json response
const postCurryer = defaultJsonResCurryer(req => {
  let params = paramExtractor(req)
  let body = bodyExtractor(req)
  return [...params, ...body]
})

// extracts params and body from request and json response
const putCurryer = defaultJsonResCurryer(req => {
  let params = paramExtractor(req)
  let body = bodyExtractor(req)
  return [...params, ...body]
})

// extracts params and query from request and json response
const getCurryer = defaultJsonResCurryer(req => {
  let query = queryExtractor(req)
  let params = paramExtractor(req)
  return [...query, ...params]
})

// extracts params from request and status res
const deleteCurryer = defaultMurryer(req => {
  let params = paramExtractor(req)
  return [...params]
}, statusRes)

export {
  curryer,
  errorHandlers,
  extractors,
  responders,
  defaultMurryer,
  postCurryer,
  putCurryer,
  getCurryer,
  deleteCurryer
}
