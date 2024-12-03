import dotenv from 'dotenv'
import User from './mongo/user.dao.js'
import Product from './mongo/product.dao.js'
import Cart from './mongo/cart.dao.js'
import Ticket from './mongo/ticket.dao.js'
import mongoose from 'mongoose'


dotenv.config()

const persistence = process.env.PERSISTENCE

let UserDao
let ProductDao
let CartDao
let TicketDao

console.log("Persistence option: ", persistence);

const initializePersistence = async () => {
    switch (persistence) {
        case "MONGO":
            const enviroment = async () => {
                try{
                    await mongoose.connect(process.env.MONGO_URL)
                    console.log("Conectado a la base de datos")
                }catch(error){
                    console.log("Error al conectar a la base de datos")
                    console.log(error.message)
                }
            }
            
            enviroment()
            UserDao = new User()
            ProductDao = new Product()
            CartDao = new Cart()
            TicketDao = new Ticket()
            break;
        case "FILE":
        //TODO
            break;
    }
}

export {
    UserDao,
    initializePersistence,
    ProductDao,
    CartDao,
    TicketDao
}