import mongoose from "mongoose"
import { logger } from "../utils/index.js"

export const connectDB = async () => {
  try {
    mongoose.connect(process.env.DB_URI || "")
  } catch (error) {
    logger.warn(error)
  }
}
