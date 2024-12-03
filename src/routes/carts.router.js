import express from "express"
import passportUtils from "../utils/passportUtils.js"
import authorization from "../authorization/authorization.js"
import CartController from "../controllers/cartsController.js"

const router = express.Router()

const cartController = new CartController()

router.post('/', cartController.createCart)

router.get('/:cid', cartController.getCart)

router.post('/:cid/empty', passportUtils.passportCall("jwt"), authorization("user"),cartController.emptyCart)

router.post('/:cid/product/:pid',passportUtils.passportCall("jwt"), authorization("user"), cartController.addToCart)

router.post("/:cid/purchase",passportUtils.passportCall("jwt"), authorization("user"), cartController.cartPurchase)

export default router
