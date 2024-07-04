import  userModel  from "../models/user.model.js";
import { createHash } from "../../utils.js";

class UserManager {


  async findOne(email) {
    try {
      const user = await userModel.findOne({ email });
      console.log("Resultado de búsqueda de usuario:", user);
      return user;
    } catch (error) {
      console.error("Error fetching user by email:", error.message);
      throw error;
    }
  }
  async addUser(user) {
    try {
      const newUser = await userModel.create(user);
      console.log("Usuario añadido:", newUser);
      return { status: "success", user: newUser };
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

  async restorePassword(userEmail, newPassword, resetToken) {
    try {
      // Validar la nueva contraseña 
      if (!isValidPassword(newPassword)) {
        return { status: "error", message: "Invalid password format" };
      }
  
      if (resetToken) {
        // Si hay un token, restablecimiento de contraseña// limpia token
        const result = await userModel.updateOne(
          { email: userEmail, resetPasswordToken: resetToken, resetPasswordExpires: { $gt: Date.now() } },
          { password: createHash(newPassword), resetPasswordToken: undefined, resetPasswordExpires: undefined }
        );
  
        if (result.nModified > 0) {
          console.log("Password Restored!");
          return { status: "success", message: "Password restored successfully" };
        }
  
        return { status: "error", message: "Invalid token or user not found" };
      } else {
        // Si no hay token,  contraseña normal
        const result = await userModel.updateOne(
          { email: userEmail },
          { password: createHash(newPassword) }
        );
  
        if (result.nModified > 0) {
          console.log("Password Updated!");
          return { status: "success", message: "Password updated successfully" };
        }
  
        return { status: "error", message: "User not found or password not updated" };
      }
    } catch (error) {
      console.error("Error restoring/updating password:", error);
  
      //errores personalizados CustomError
      if (error instanceof CustomError) {
        return { status: "error", message: error.message, code: error.code };
      }
  
      // información adicional al mensaje de error
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
  
      // tipos de errores
      if (errorMessage.includes("Invalid password format")) {
        return { status: "error", message: "Invalid password format" };
      } else if (errorMessage.includes("duplicate key")) {
        return { status: "error", message: "Duplicate key violation, email already exists" };
      } else {
        return { status: "error", message: "Internal server error" };
      }
    }
  }
  
  
}
//  para los roles
 const ROLES = {
  ADMIN: "admin",
  USER: "user",
  PREMIUM: "premium"
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
