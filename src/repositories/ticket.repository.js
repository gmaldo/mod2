export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    getTickets = async () => {
        return await this.dao.get()
    }

    getTicket = async (id) => {
        return await this.dao.getById(id)
    }

    createTicket = async (ticket) => {
        return await this.dao.createTicket(ticket)
    }

}