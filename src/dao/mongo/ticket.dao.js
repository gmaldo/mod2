import ticketModel from "../model/ticket.model.js";

export default class Ticket{
    constructor() {
        //console.log("Working tickets with DB in mongoDB")
    }
    createTicket = async (ticket) => {
        try {
            let result = await ticketModel.create(ticket)
            return result
        } catch (error) {
            console.log(error)
        }
    }

    get = async () => {
        try {
            let result = await ticketModel.find()
            return result
        } catch (error) {
            console.log(error)
        }
    }

    getById = async (id) => {
        try {
            let result = await ticketModel.findById(id)
            return result
        } catch (error) {
            console.log(error)
        }
    }
}