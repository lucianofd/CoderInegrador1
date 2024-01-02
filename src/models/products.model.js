import { Schema, model, Types} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

let collection = 'products'
const productSchema = new Schema({
    id :{type: Number,},
    title:{ type: String, required: true, },
    description:{ type: String, required: true, },
    code:{ type: String, required: true },
    price:{ type: Number, required: true},
    status:{ type: Boolean},
    stock:{ type: Number, required: true },
    category:{ type: String, required: true},
    thumbnails:{ type: Array, required: true},
    owner: { type: String,ref:'users', default:"admin" }
},
  {
    timestamps: true
  }
);

productSchema.plugin(mongoosePaginate);

const productModel = model(collection, productSchema);

export default productModel