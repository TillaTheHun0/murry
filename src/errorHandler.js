
const passthroughHandler = (req, res, next) =>
  err => next(err)

export {
  passthroughHandler
}
