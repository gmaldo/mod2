
// const authorization = role => {
//     return async (req, res, next) => {
//         if(!req.user) return res.status(401).send({status: "error", message:"Unauthorized"})
//         if(req.user.user.role !== role){
//             return res.status(403).send({
//                 status:"Error",
//                 message:`You don't have permission because you are ${req.user.user.role}`
//             })
//         }
//         next()
//     }
// }

const authorization = role => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ status: "error", message: "Unauthorized" });
        }

        const userRole = req.user.user.role; // Puede ser "user" o "admin"
        const roleHierarchy = { user: 1, admin: 2 };

        // vemo si el rol del usuario tiene acceso suficiente
        if (roleHierarchy[userRole] < roleHierarchy[role]) {
            return res.status(403).send({
                status: "error",
                message: `You don't have permission because you are ${userRole}`
            });
        }

        next();
    };
};

export default authorization