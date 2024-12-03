export default class ProductRepository {
    constructor (dao) {
        this.dao = dao
    }

    getProducts = async (page,limit,sort,query) => {
        try{
            let result = await this.dao.get(page,limit,sort,query)
            return result
        }catch (error){
            console.log(error)
        }
    }

    getProductById = async (id) =>{
        try {
            return await this.dao.getProductById(id)
        }catch(error){
            console.log(error)
        }
    }

    saveProduct = async (product) => {
        try {
            return await this.dao.saveProduct(product)
        }catch(error){
            console.log(error)
        }
    }

    updateProduct = async (id, product) => {
        try {
            return await this.dao.updateProduct(id, product)
        }catch(error){
            console.log(error)
        }
    }

    deleteProduct = async (id) => {
        try {
            return await this.dao.deleteProduct(id)
        }catch(error){
            console.log(error)
        }
    }
}