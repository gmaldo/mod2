import express from "express"
import passportUtils from "../utils/passportUtils.js"
import authorization from "../authorization/authorization.js"
import UserController from "../controllers//userController.js"
const router = express.Router()
const userController = new UserController()

router.get("/", passportUtils.passportCall("jwt"), authorization("admin"),userController.getAll)

router.delete("/:uid", passportUtils.passportCall("jwt"), authorization("admin"), userController.delete)

export default router