export default class UserRepository{

    constructor(dao){
        this.dao = dao
    }

    createUser = async(newUser) => {
        try {
            return await this.dao.saveUser(newUser)
        } catch (error) {
            console.log(error);
        }
    }

    getUser = async(data) => {
        try {
            return await this.dao.getUserByEmail(data)
        } catch (error) {
            console.log(error);
        }
    }

    getUserById = async (id) => {
        try {
            return await this.dao.getUserById(id)
        } catch (error) {
            console.log(error);
        }
    }

    getUsers = async() => {
        try {
            return await this.dao.get()
        } catch (error) {
            console.log(error);
        }
    }

    updateUser = async(uid, updatedUser) => {
        try {
            return await this.dao.updateUser(uid, updatedUser)
        } catch (error) {
            console.log(error);
        }
    }

    makeAdmin = async (uid) => {
        try{
            return await this.dao.makeAdmin(uid)
        }catch(error){
            console.log(error)
        }
    }

    delete = async(uid) => {
        try {
            return await this.dao.delete(uid)
        } catch (error) {
            console.log(error);
        }
    }
}
