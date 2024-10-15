import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: Array,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
})
export default mongoose.model("User", userSchema)
