import {userModel}  from "./models/user.model.js";
import { createHash }  from "../../utils.js";

class UserManager {
    async addUser(user) {
        try {
            
            const existingUser = await userModel.findOne({ email: user.email });
            if (existingUser) {
                throw new Error("User with this email already exists");
            }

            // Hash user's password 
            user.password = createHash(user.password);

            // 'admin' role 
            if (user.email === "adminCoder@coder.com") {
                user.role = "admin";
            }

            await userModel.create(user);
            console.log("User added!");

            return true;
        } catch (error) {
            console.error("Error adding user:", error.message);
            throw error; 
        }
    }

    async login(user) {
        try {
            const userLogged = await userModel.findOne({ email: user }) || null;

            if (userLogged) {
                console.log("User logged!");
                return userLogged;
            }

            return null; 
        } catch (error) {
            console.error("Error during login:", error.message);
            throw error;
        }
    }

    async restorePassword(user, pass) {
        try {
            const result = await userModel.updateOne({ email: user }, { password: pass });

            if (result.nModified > 0) {
                console.log("Password Restored!");
                return true;
            }

            return false; // false no user updated
        } catch (error) {
            console.error("Error restoring password:", error.message);
            throw error;
        }
    }
}

export default UserManager;
