import { productService ,cartService} from "../repositories/index.js";

class viewsControllers {

    getProducts = async (req,res) => {
        let page = parseInt(req.query.page);
        if(!page) page=1;
        //Lean es crucial para mostrar en Handlebars, ya que evita la "hidratación" del documento de mongoose,
        //esto hace que a Handlebars llegue el documento como plain object y no como Document.
        
        //let result = await productModel.paginate({},{page,limit:5,lean:true})
        let result = await productService.getProducts(5,page)
        //console.log(result)
        result.prevLink = result.hasPrevPage?`http://localhost:8080/products?page=${result.prevPage}`:'';
        result.nextLink = result.hasNextPage?`http://localhost:8080/products?page=${result.nextPage}`:'';
        result.isValid= !(page<=0||page>result.totalPages)
        res.render('home',result)     
    }

    getProductById = async (req, res) => {
        let id = req.params.pid
        let result = await productService.getProductById(id)
        const cartId = req.user.user.cart
        res.render('productDetail', { product: result, cartId });

//        res.render('productDetail', result)
    }

    createProduct = async (req, res) => {
        let product = req.body
        res.render('createProduct',{title: "Create Product", style:"create.css"})
    }

    getCart = async (req, res) => {
        const cartId = req.user.user.cart
        let result = await cartService.getCart(cartId)
        let cartProducts = []
        let flag = false
        if(result.products.length>0){
            cartProducts = result.products
            flag = true
        }
        res.render('cart',{ flag, cartProducts , cartId})
    }
}
export default viewsControllers