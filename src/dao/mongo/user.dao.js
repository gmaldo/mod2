import usersModel from "../model/user.model.js";

export default class User {
    get = async () => {
        try {
            let users = await usersModel.find()
            return users
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getUserByEmail = async (email) => {
        try {
            let user = await usersModel.findOne({ email: email })
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getUserById = async (id) => {
        try {
            let user = await usersModel.findOne({ _id: id })
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    saveUser = async (user) => {
        try {
            let result = await usersModel.create(user)
            return result
        } catch (error) {
            console.log(error)
        }
    }

    makeAdmin = async (id) => {
        try {
            let result = await usersModel.updateOne({ _id: id }, { $set: { role: 'admin' } })
            return result
        } catch (error) {
            console.log(error)
        }
    }

    delete = async (id) => {
        return await usersModel.deleteOne({_id: id})
    }

    updateUser = async (id, user) => {
        try {
            let result = await usersModel.updateOne({ _id: id }, { $set: user })
            return result
        } catch (error) {
            console.log(error)
        }
    }
}