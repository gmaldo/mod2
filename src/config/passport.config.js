import passport from "passport";
import local from 'passport-local'
import {createHash, isValidPassword} from '../utils/cryptUtils.js'
import jwt from 'passport-jwt'
import dotenv from 'dotenv'
import GitHubStrategy from 'passport-github2'
import { userService ,cartService} from "../repositories/index.js"
//import User from "../dao/classes/user.dao.js"
//aca hacer una local strategy
//una github strategy 

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt
const usersService = userService

dotenv.config()

const initializePassport = () => {
    //local strategy para registro

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            //const user = await userModel.findOne({ email: username })
            const user = await usersService.getUser(username)
            if (user) {
                return done(null, false)
            }
            const cart = await cartService.createCart()
            const newUser = {
                first_name,
                last_name,
                email,
                cart: cart._id,
                age,
                password: createHash(password)
            }
            //const result = await userModel.create(newUser)
            const result = await usersService.createUser(newUser)
            return done(null, result)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
        try {
            //const user = await userModel.findOne({ email: username })
            const user = await usersService.getUser(username)
            console.log(user)
            if (!user) {
                return done(null, false)
            }
            if (!isValidPassword(user, password)) {
                return done(null, false)
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        try {
            // const user = await userModel.findById(id)
            const user = usersService.getUserById(id)
            done(null, user)
        } catch (error) {
            done(error, null)
        }
    })
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'myprivatekey'
        }
        , async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            }
            catch (error) {
                return done(error);
            }
        }
    ))

    passport.use('github', new GitHubStrategy({
        clientID: process.env.GUIHUB_CLIENTID,//'XXX.9f6c2e4f3e4f3e4f3e4f3e4f3e4f3e4f3e4f3e4',
        clientSecret: process.env.GITHUB_CLIENTSECRET,//'c9f6c2e4f3e4f3e4f3e4f3e4f3e4f3e4f3e4f3e4',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'//'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            //console.log(profile)
            //const user = await userModel.findOne({ email: profile._json.email })
            const user = await usersService.getUser(profile._json.email)
            if (user) {
                return done(null, user)
            }
            const cart = await cartService.createCart()

            const newUser = {
                first_name: profile._json.name.split(' ')[0],
                last_name: profile._json.name.split(' ')[1],
                email: profile._json.email,
                age: 18,
                password: ' ',
                cart: cart._id,
            }
            //const result = await userModel.create(newUser)
            const result = await usersService.createUser(newUser)
            return done(null, result)
        } catch (error) {
            return done(error)
        }
    }))


}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt']
    }
    //console.log(token)
    return token;
}
export default initializePassport