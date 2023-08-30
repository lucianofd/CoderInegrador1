import mongoose from "mongoose";

let collection = 'carts';
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Nombre de la colección de usuarios
        required: false
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: Number,
        }
    ]
});

cartSchema.pre("findOne", function() {
    this.populate("products.product");
});

export const cartModel = mongoose.model(collection, cartSchema);
