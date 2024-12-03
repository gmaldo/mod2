import {cartService,productService, ticketService,userService} from "../repositories/index.js"

class CartController{
    
    createCart = async (req, res) => {
        cartService.createCart()
        .then(cart => {
            console.log(cart)
            res.status(200).send(cart)
        })
        .catch(err => res.status(500).send(err))
    }

    addToCart = async (req, res) => {
        let userCart = req.user.user.cart
        let cartId = req.params.cid
        let productId = req.params.pid
        if(userCart!=cartId){
            res.status(401).send({status:"error", messaje:"No tiene permisos para agregar productos a este carrito"})
            return
        }

        productService.getProductById(productId)
        .then(product => {
            if(product){
                cartService.addToCart(cartId, productId)
                .then(cart => {
                    //console.log(cart)
                    res.status(200).send(cart.products)
                })
                .catch(err => res.status(500).send(err))
            }else{
                res.status(404).send("Producto no encontrado")
            }
        })
        .catch(err => res.status(500).send(err))
    }

    getCart = async (req, res) => {
        let cartId = req.params.cid
        cartService.getCart(cartId)
        .then(cart => {
            res.status(200).send(cart.products)
        })
        .catch(err => res.status(500).send(err))
    }

    /*
     * Implementar, en el router de carts, la ruta /:cid/purchase, la cual permitirá finalizar el proceso de compra de dicho carrito.
     * La compra debe corroborar el stock del producto al momento de finalizarse
     *  -Si el producto tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces restarlo del stock del producto y continuar.
     *  -Si el producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces no agregar el producto al proceso de compra. 
     *  Al final, utilizar el servicio de Tickets para poder generar un ticket con los datos de la compra.
     *   En caso de existir una compra no completada, devolver el arreglo con los ids de los productos que no pudieron procesarse.
     *   Una vez finalizada la compra, el carrito asociado al usuario que compró deberá contener sólo los productos que no pudieron comprarse. Es decir, se filtran los que sí se compraron y se quedan aquellos que no tenían disponibilidad.
     */
    cartPurchase = async(req,res) => {
        try {
            const cid = req.params.cid
            const cart = await cartService.getCart(cid)
            const insufficientStock = []
            const buyProducts = []
            if(!cart) res.status(404).send({status:"error", message:"Cart not found"})
            

            for(const item of cart.products){
                //console.log(item)
                const product = await productService.getProductById(item.product._id)
                if(product.stock >= item.quantity){
                    product.stock -= item.quantity
                    //dismiuye stock
                    await productService.updateProduct(product._id, product)
                    //lo saca del carrito
                    await cartService.deleteProduct(cart._id, product._id)
                    buyProducts.push(item)
                }else{
                    //guardo los que no tenian stock y los dejo en el carrito
                    insufficientStock.push(item)
                }
            }
            //console.log("insuficientStock\n" + JSON.stringify(insufficientStock, null, 2))
            //console.log("buyProducts\n" + JSON.stringify(buyProducts, null, 2))

            const totalAmount = buyProducts.reduce((acc, item) => acc + item.quantity, 0)
            //console.log("totalAmount\n" + totalAmount)
            const totalPrice = buyProducts.reduce((acc, item) => acc + item.product.price * item.quantity, 0 ).toFixed(3)
            //console.log("totalPrice\n" + totalPrice)
            //res.send({status:"success", payload: buyProducts})

            if(buyProducts <= 0){
                res.send(
                    {
                        status:"Error", 
                        message:"Insufficient stock in the products", 
                        products: insufficientStock.map(prod => prod.product.title)
                    }
                )                
            }
            if (buyProducts.length > 0) {
                const ticket = await ticketService.createTicket({
                    code: Math.random().toString(36).substring(2, 15),
                    purchase_datetime: new Date(),
                    amount: totalPrice,
                    purchaser: req.user.user.email
                })
                console.log(ticket)
                res.send(ticket)

            }



        }catch(error){
            res.status(500).send({status:"error", message:"Error en el servidor al finalizar la compra"})
            console.log(error)
        }
    }
}

export default CartController