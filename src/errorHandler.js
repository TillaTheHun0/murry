
const passthroughHandler = err => (req, res, next) => next(err)

export {
  passthroughHandler
}
