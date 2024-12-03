import ContactDto from "../dto/contactDto.js"

class ContactRopository {
    constructor(dao) {
        this.dao = dao
    }
    
    getContact = async(email) => {
        const contact = await this.dao.getUserByEmail(email)
        return new ContactDto(contact)
    }
}

export default ContactRopository