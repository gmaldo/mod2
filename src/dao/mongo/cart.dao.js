import cartModel from "../model/cart.model.js"
import productModel from "../model/product.model.js"

export default class Cart {

    async createCart() {
        let cart = await cartModel.create({})
        return cart
    }

    async getCart(id) {
        return await cartModel.findById({_id: id}).populate("products.product").lean()
    }

    async addProductToCart(cid, pid) {
        const cart = await cartModel.findById(cid)
        const product = await productModel.findById(pid)
        if(!product) return null
        if(!cart) return null
        let cartProduct = cart.products.find(prodid => prodid.product.equals(pid))
        //console.log(cartProduct)
        if (cartProduct) {
            cartProduct.quantity++
        } else {
            cart.products.push({ product: pid, quantity: 1 })
        }
        return await cart.save()
    }

    async deleteOne(cid, pid){
        try {
            //let prod = await productModel.findById(pid)
            //return await cartModel.updateOne({_id: cid}, {$pull:{products:{product: prod}}})
            let cart = await cartModel.findById({_id: cid})
            const index = cart.products.findIndex(product => product.product._id == pid)
            cart.products.splice(index, 1)
            return await cart.save()
        } catch (error) {
            console.log(error);
        }
    }

    async deleteAllProducts(cid) {
        let cart = await cartModel.findById({_id: cid})
        cart.products = []
        return await cart.save()
    }


    async deleteCart(cid) {
        let cart = await cartModel.findById({_id: cid})
        cart.products = []
        return await cart.save()
    }
}