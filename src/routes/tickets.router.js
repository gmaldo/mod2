import express from "express"
import TicketController from "../controllers/ticketsController.js"
import passportUtils from "../utils/passportUtils.js"
import authorization from "../authorization/authorization.js"

const router = express.Router()
const ticketController = new TicketController()

router.get("/", passportUtils.passportCall("jwt"), authorization("admin"),ticketController.getTickets)

router.get("/:tid", passportUtils.passportCall("jwt"), authorization("user"),ticketController.getTicket)

export default router