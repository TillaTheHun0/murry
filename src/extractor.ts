
export type Extractor = <WebServerArgs extends any> (...args: WebServerArgs[]) => any[] | any

const bodyExtractor: Extractor = (req) => [req.body]
const paramExtractor: Extractor = (req) => [req.params]
const queryExtractor: Extractor = (req) => [req.query]
const passthroughExtractor: Extractor = (req) => [req]

export {
  bodyExtractor,
  paramExtractor,
  queryExtractor,
  passthroughExtractor
}
