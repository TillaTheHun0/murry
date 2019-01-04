
const jsonRes = (data) =>
  (req, res) =>
    res.json(data)

const statusRes = data =>
  (req, res) =>
    res.sendStatus(data)

const jsonStatusRes = (status, data) =>
  (req, res) =>
    res.status(status).json(data)

const htmlRes = (view, data) =>
  (req, res) =>
    res.render(view, data)

export {
  jsonRes,
  statusRes,
  jsonStatusRes,
  htmlRes
}
