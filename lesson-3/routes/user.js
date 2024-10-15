import { Router } from "express"
import {
  createUsers,
  deleteUsers,
  getAllUsers,
  getUserById,
  updateUsers,
} from "../controllers/user.js"

const userRouter = Router()

userRouter
  .route("/")
  .get(getAllUsers)
  .post(createUsers)
  .patch(updateUsers)
  .delete(deleteUsers)

userRouter.route("/:id").get(getUserById)
export default userRouter
