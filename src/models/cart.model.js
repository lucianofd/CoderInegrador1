import { Schema, model, Types} from "mongoose";
import mongoose from "mongoose";

let collection = 'carts';
const cartSchema = new Schema({
    user: {
        type: Types.ObjectId,
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

const cartModel = model(collection, cartSchema);

export default cartModel;
