import { allowedOrigins } from "./allowedOrigins.js"
export const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin)
      return callback(null, true)
    return callback(new Error("Not allowed by CORS"))
  },
  credentials: true,
  optionsSuccessStatus: 200,
}
