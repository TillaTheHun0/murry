
const jsonRes = (req, res) =>
  data => res.json(data)

const statusRes = (req, res) =>
  data => res.sendStatus(data)

const jsonStatusRes = (req, res) =>
  (status, data) => res.status(status).json(data)

const htmlRes = (req, res) =>
  (view, data) => res.render(view, data)

export {
  jsonRes,
  statusRes,
  jsonStatusRes,
  htmlRes
}
