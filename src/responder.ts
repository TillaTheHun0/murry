
type SingleArgs<ControllerResponse> = [ControllerResponse]
type DoubleArgs<FirstArg, ControllerResponse> = [FirstArg, ControllerResponse]
type TripleArgs<FirstArg, SecondArg, ControllerResponse> = [FirstArg, SecondArg, ControllerResponse]
type QuadrupleArgs<FirstArg, SecondArg, ThirdArg, ControllerResponse> = [FirstArg, SecondArg, ThirdArg, ControllerResponse]

export type Responder = <WebServerArgs extends any>
  (...args: SingleArgs<any> | DoubleArgs<any, any> | TripleArgs<any, any, any> | QuadrupleArgs<any, any, any, any>) =>
    (...args: WebServerArgs[]) =>
      any

export const jsonRes: Responder = (...args: SingleArgs<any>) => {
  const [ data ] = args
  return (req, res) =>
    res.json(data)
}

export const statusRes: Responder = (...args: SingleArgs<number>) => {
  const [ data ] = args
  return (req, res) =>
    res.sendStatus(data)
}

export const jsonStatusRes: Responder = (...args: DoubleArgs<number, any>) => {
  const [ status, data ] = args
  return (req, res) =>
    res.status(status).json(data)
}

export const htmlRes: Responder = (...args: DoubleArgs<string, any>) => {
  let [view, data] = args
  return (req, res) =>
    res.render(view, data)
}
