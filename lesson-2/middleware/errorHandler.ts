import { logEvents } from "./logger"

const errorHandler = (err: any, req: any, res: any, next: Function) => {
  logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'error.log')
  console.log(err.stack)

  const status = res.statusCode ? res.statusCode : 500

  res.status(status)

  res.json({ message: err.message })
}

export default errorHandler