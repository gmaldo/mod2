import express from "express"
import passport from "passport"
import passportUtils from "../utils/passportUtils.js"
import authorization from "../authorization/authorization.js"
import SessionController from "../controllers/session.controller.js"

const router = express.Router()

const sessionController = new SessionController()
//mover a views
router.get("/signup", sessionController.renderSignUp)

router.post("/signup", passport.authenticate('signup', {session: false, failureRedirect: '/api/sessions/failsignup' }), sessionController.signup)
//mover a views:
router.get("/login", sessionController.renderLogin)

router.post("/login",passport.authenticate('login', {session: false, failureRedirect: '/api/sessions/faillogin' }), sessionController.login)

router.get('/faillogin', sessionController.failLogin)

router.get("/current", passportUtils.passportCall("jwt"),authorization("user"), sessionController.current)

router.get("/github", passport.authenticate("github", {session: false,scope:["user:email"]}), sessionController.github)

router.get("/githubcallback",passport.authenticate("github", {session: false,failureRedirect:"/login"}), sessionController.githubcallback)

router.post("/logout", passport.authenticate("jwt",{session:false}), sessionController.logout)


export default router