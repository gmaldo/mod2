import productModel from "../model/product.model.js"

export default class Product{
//    let result = await productModel.paginate({},{page,limit:5,lean:true})

    get = async (limit,page,sort,query) => {
        let prevLink
        let sortFlag
        if(sort === 'asc'){
            prevLink = '&sort=asc'
            sortFlag = 1
        }else if(sort === 'desc'){
            sortFlag = -1
            prevLink = '&sort=desc'
        }else{
            prevLink = ''
            sortFlag = undefined
        }
        const options = {
            page: page,
            limit: limit,
            lean: true,
            sort: sortFlag ? {price: sortFlag} : undefined
        };
        
        try {
            //let result = await productModel.paginate({},{page,limit:limit,lean:true})
            let result = await productModel.paginate(query, options)
            return result
        }catch (error) {
            console.log(error)
            return null
        }
    }

    getProductById = async (id) => {
        try {
            let product = await productModel.findById(id).lean()
            return product
        }catch (error) {
            console.log(error)
            return null
        }
    }

    saveProduct = async (product) => {
        try{
            let result = await productModel.create(product)
            return result
        }catch (error){
            console.log(error)
        }
    }

    updateProduct = async (id, product) => {
        try {
            if(product.stock <= 0) {
                product.status = false
            }
            let result = await productModel.findByIdAndUpdate(id, product)
            return result
        }catch (error){
            console.log(error)
        }
    }

    deleteProduct = async (id) => {
        try {
            let result = await productModel.findByIdAndDelete(id)
            return result
        }catch (error){
            console.log(error)
        }
    }

}