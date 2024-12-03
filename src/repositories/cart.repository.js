export default class CartRepository{

    constructor(dao){
        this.dao = dao
    }
    
    createCart = async () => {
        try{
            return await this.dao.createCart()
        }catch(error){
            console.log(error)
        }
    }

    addToCart = async (cid, pid) => {
        try{
            return await this.dao.addProductToCart(cid, pid)
        }catch(error){
            console.log(error)
        }
    }

    getCart = async (cid) => {
        try{
            return await this.dao.getCart(cid)
        }catch(error){
            console.log(error)
        }
    }

    deleteProduct = async(cid, pid) => {
        try {
            return await this.dao.deleteOne(cid, pid)
        } catch (error) {
            console.log(error);
        }
    }

    deleteAll = async (cid) => {
        try {
            return await this.dao.deleteAllProducts(cid)
        } catch (error) {
            console.log(error);
        }
    }
}
