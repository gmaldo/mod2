import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import handlebars from 'express-handlebars'
import passport from 'passport'
import dotenv from 'dotenv'
import __dirname from "./utils.js"
//import userRouter from './routes/user.router.js'
import sessionRouter from './routes/session.router.js'
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import userRouter from './routes/user.router.js'
import ticketsRouter from './routes/tickets.router.js'
import initializePassport from './config/passport.config.js'
import cookieParser from 'cookie-parser'

const app = express()
const port = 8080
dotenv.config()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const enviroment = async () => {
//     try{
//         await mongoose.connect(process.env.MONGO_URL)
//         console.log("Conectado a la base de datos")
//     }catch(error){
//         console.log("Error al conectar a la base de datos")
//         console.log(error.message)
//     }
// }

// enviroment()

// app.use(session({
//     store: MongoStore.create({
//         mongoUrl:process.env.MONGO_URL,
//         ttl: 60
//     }),
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: false
// }))


app.use(cookieParser())
initializePassport()
app.use(passport.initialize())
//app.use(passport.session())

app.use('/api/sessions/',sessionRouter)
app.use('/',viewsRouter)
app.use('/api/products',productsRouter)
app.use('/api/carts', cartRouter)
app.use('/api/users',userRouter)
app.use('/api/tickets',ticketsRouter)



app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
