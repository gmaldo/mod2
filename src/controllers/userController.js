import { userService }  from "../repositories/index.js";

class UserController {
    async getAll(req, res) {
        try {
            const users = await userService.getUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const user = await userService.getById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const user = await userService.updateUser(req.params.id, req.body);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const user = await userService.delete(req.params.uid);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default UserController