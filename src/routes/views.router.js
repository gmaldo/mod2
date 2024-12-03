import express from "express"
import ViewsController from "../controllers/viewsController.js"
import authorization from "../authorization/authorization.js"
import passport from "passport"
import passportUtils from "../utils/passportUtils.js"
const router = express.Router()

const viewsController = new ViewsController()

router.get('/products', viewsController.getProducts)

router.get('/cart',passportUtils.passportCall("jwt"),authorization("user"), viewsController.getCart)

router.get('/products/:pid',passportUtils.passportCall("jwt"),authorization("user"),viewsController.getProductById)

router.get('/create', passportUtils.passportCall("jwt"),authorization("admin"),viewsController.createProduct)

export default router