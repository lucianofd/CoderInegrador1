import { Schema, model, Types} from "mongoose";

let collection = 'users'
const userSchema = new Schema({
    first_name:{type: String, require: true},
    last_name:{type: String, require: true},
    email:{type: String, require: true},
    age:{type: Number, require: false},
    password:{type: String, require: true},
    role: {
        type:String,
        default:"user",
        enum:["user", "admin"]
    }
});


const userModel = model(collection, userSchema);

export default userModel;