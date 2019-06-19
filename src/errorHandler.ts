
export type ErrorHandler = (err: Error) => (...args: any) => void

export const passthroughHandler: ErrorHandler = (err) =>
  (req: any, res: any, next: (err: Error) => any) =>
    next(err)
