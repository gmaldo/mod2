import express from "express"
import ProductController from "../controllers/productsController.js"
import authorization from "../authorization/authorization.js"
import passport from "passport"
import passportUtils from "../utils/passportUtils.js"
const router = express.Router()

const productController = new ProductController()

router.get("/", productController.getProducts)

router.get("/:id", productController.getProductById)


router.post("/",passportUtils.passportCall("jwt"),authorization("admin"),productController.createProduct)

router.put('/:id', passportUtils.passportCall("jwt"),authorization("admin"),productController.editProduct)

router.delete('/:id', passportUtils.passportCall("jwt"), authorization("admin"), productController.deleteProduct)

export default router