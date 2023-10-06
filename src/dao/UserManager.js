import  userModel  from "./models/user.model.js";
import { createHash } from "../../utils.js";

class UserManager {
  async addUser(user) {
    try {
      const existingUser = await userModel.findOne({ email: user.email });
      if (existingUser) {
        return { status: "error", message: "User with this email already exists" };
      }

      // Valida la contraseña antes de guardarla
      if (!isValidPassword(user.password)) {
        return { status: "error", message: "Invalid password format" };
      }

      // Hash de la contraseña
      user.password = createHash(user.password);

      
      if (user.email === process.env.ADMIN_EMAIL) {
        user.role = ROLES.ADMIN;
      } else {
        user.role = ROLES.USER;
      }

      await userModel.create(user);
      console.log("User added!");

      return { status: "success", message: "User added successfully" };
    } catch (error) {
      console.error("Error adding user:", error.message);
      throw error;
    }
  }

  async login(userEmail) {
    try {
      const userLogged = await userModel.findOne({ email: userEmail }) || null;

      if (userLogged) {
        console.log("User logged!");
        return { status: "success", user: userLogged };
      } else {
        return { status: "error", message: "User not found" };
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      throw error;
    }
  }

  async restorePassword(userEmail, newPassword) {
    try {
      // Validar la nueva contraseña
      if (!isValidPassword(newPassword)) {
        return { status: "error", message: "Invalid password format" };
      }

      const result = await userModel.updateOne(
        { email: userEmail },
        { password: createHash(newPassword) }
      );

      if (result.nModified > 0) {
        console.log("Password Restored!");
        return { status: "success", message: "Password restored successfully" };
      }

      return { status: "error", message: "User not found or password not updated" };
    } catch (error) {
      console.error("Error restoring password:", error.message);
      throw error;
    }
  }
}

//  para los roles
const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

// Función para validar la contraseña 
function isValidPassword(password) {
    // Verifica la longitud mínima
    if (password.length < 6) {
      return false;
    } 
    // Verifica si incluye al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
      return false;
    } 
    // Verifica si incluye al menos una letra minúscula
    if (!/[a-z]/.test(password)) {
      return false;
    }  
    // Verifica si incluye al menos un número
    if (!/\d/.test(password)) {
      return false;
    }
    return true;
  }  

export default UserManager;
