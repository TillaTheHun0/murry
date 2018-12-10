
const bodyExtractor = req => req.body
const paramExtractor = req => req.params
const queryExtractor = req => req.query
const passthroughExtractor = req => req

export {
  bodyExtractor,
  paramExtractor,
  queryExtractor,
  passthroughExtractor
}
