import { CorsOptions } from "cors"
import { allowedOrigins } from "./allowedOrigins"

export const corsOptions: CorsOptions = {
  origin: (origin: any, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin)
      return callback(null, true)

    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  optionsSuccessStatus: 200
}