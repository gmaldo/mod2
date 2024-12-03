import { productService } from "../repositories/index.js"
class ProductController {
    getProducts = async (req, res) => {
        const { limit = 10, page = 1, sort } = req.query;
        const query = req.body
        let prevLink = null
        if(sort === 'asc'){
            prevLink = '&sort=asc'
        }else if(sort === 'desc'){
            prevLink = '&sort=desc'
        }else{
            prevLink = ''
        }
        //console.log("limit " + limit + ", page " + page + ", sort " + sort + ", query " + JSON.stringify(query))
        const products = await productService.getProducts(limit, page, sort, query);
        res.status(200).json({  
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `localhost:8080/api/products?page=${products.prevPage}&limit=${limit}${prevLink}` : null,
            nextLink: products.hasNextPage ? `localhost:8080/api/products?page=${products.nextPage}&limit=${limit}${prevLink}` : null
        })
    }

    getProductById = async (req,res) => {
        const productId = req.params.id;
        productService.getProductById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
            res.status(200).json(product);
        })
        .catch(error => {
            res.status(500).json({ error: "Error al obtener el producto" });
        });
    }

    createProduct = async (req, res) => {
        const { title, description, code, category, status } = req.body;  
        let {price, stock} = req.body
        let errors = [];
    
        price = Number(price)
        stock = Number(stock)
        if (!title) {
            errors.push("El campo 'title' es obligatorio.");
        }
        if (!description) {
            errors.push("El campo 'description' es obligatorio.");
        }
        if (!code) {
            errors.push("El campo 'code' es obligatorio.");
        }
        if (price === undefined) {
            errors.push("El campo 'price' es obligatorio.");
        } else if (typeof price !== 'number') {
            errors.push("El campo 'price' debe ser un número.");
        }
        if (stock === undefined) {
            errors.push("El campo 'stock' es obligatorio.");
        } else if (typeof stock !== 'number') {
            errors.push("El campo 'stock' debe ser un número.");
        }
        if (!category) {
            errors.push("El campo 'category' es obligatorio.");
        }
    
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const productStatus = status !== undefined ? status : true;
    
        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category,
            status: productStatus,
            thumbnails: req.body.thumbnails || []
        }
        
        productService.saveProduct(newProduct)
        .then(product => {
            res.status(201).json(product)
        })
        .catch(error => {
            res.status(501).json({error:"error en el servidor al guardar nuevo producto"})
        })
    }

    editProduct = async (req,res) => {
        const productId = req.params.id;
        productService.getProductById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
            product.title = req.body.title || product.title;
            product.description = req.body.description || product.description;
            product.code = req.body.code || product.code;
            product.price = req.body.price || product.price;
            product.stock = req.body.stock || product.stock;
            product.category = req.body.category || product.category;
            product.status = req.body.status !== undefined ? req.body.status : product.status;
            product.thumbnails = req.body.thumbnails || product.thumbnails;

            productService.updateProduct(productId, product)
            .then(updatedProduct => {
                res.status(200).json(updatedProduct);
            })
            .catch(error => {
                res.status(500).json({ error: "Error al actualizar el producto" });
            });
        })
        .catch(error => {
            res.status(500).json({ error: "Error al obtener el producto" });
        });
    }

    deleteProduct = async (req, res) => {
        const productId = req.params.id;
        productService.getProductById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
            productService.deleteProduct(productId)
            .then(() => {
                res.status(200).json({ message: "Producto eliminado correctamente" });
            })
            .catch(error => {
                res.status(500).json({ error: "Error al eliminar el producto" });
            });
        })
        .catch(error => {
            res.status(500).json({ error: "Error al obtener el producto" });
        });
    }
}

export default ProductController