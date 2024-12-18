import mongoose  from "mongoose";
/*
    Id (autogenerado por mongo)
    code: String debe autogenerarse y ser único
    purchase_datetime: Deberá guardar la fecha y hora exacta en la cual se formalizó la compra (básicamente es un created_at)
    amount: Number, total de la compra.
    purchaser: String, contendrá el correo del usuario asociado al carrito.
*/

const ticketCollection = "tickets"

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
})
const ticketModel = mongoose.model(ticketCollection, ticketSchema)
export default ticketModel