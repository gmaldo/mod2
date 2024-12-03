import jwtUtils from "../utils/jwtUtils.js"
import { userService ,contactService } from "../repositories/index.js"

class SessionController {

    usersService = userService//new User()

    login = async (req, res) => {
        if (!req.user) return res.status(401).send({ status: "error", error: "Usuario no encontrado" })
        
        const access_token = jwtUtils.generateToken(req.user)
        res.cookie('jwt', access_token, { maxAge: 60 * 60 * 1000, httpOnly: true })
        console.log('Cookie establecida:', access_token);
        res.render("success.handlebars")
    }

    failLogin = async (req, res) => {
        res.render("login.handlebars", { error: true })
        //res.status(401).send({ status: "error", error: "Error al iniciar sesión" })
    }

    signup = async (req, res) => {
//        res.status(201).send({ status: "success", message: "Usuario creado con exito" })
        res.redirect('/api/sessions/login')

    }

    logout = async (req, res) => {
        res.clearCookie('jwt')
        res.redirect('/api/sessions/login')
    }

    github = async (req, res) => {
        res.send({ status: "success", message: "usuario registrado" })
    }

    githubcallback = async (req, res) => {
        const access_token = jwtUtils.generateToken(req.user)
        res.cookie('jwt', access_token, { maxAge: 60 * 60 * 1000, httpOnly: true })
        console.log('Cookie establecida:', access_token);
        res.render("success.handlebars")
    }

    current = async (req, res) => {
        const {email} = req.user.user
        const contact = await contactService.getContact(email)
        if(contact){
            res.render("current",contact)
        }else{
            res.send({ status: "error", payload: "No se encontro el usuario" })
        }
    }

    renderSignUp = async (req, res) => {
        res.render("signup.handlebars")
    }

    renderLogin = async (req, res) => {
        res.render("login.handlebars")
    }
}

export default SessionController