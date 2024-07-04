import UserService from "../services/userService.js";
import UserInputDTO from"../dao/dto/userInputDto.js";
import UserDtoFactory from "../dao/dto/userFactory.js";
import CustomError from "../services/errors/CustomError.js";
import { generateUserErrorInfo } from "../services/errors/messages/user-creat-error.js";
import EErrors from "../services/errors/errors-enum.js";
import { createHash } from "../../utils.js"

class UserController{
  constructor() {
    this.userService = new UserService();
    this.userDTOFactory = new UserDtoFactory();
  }
  /*
  isValidUserInput(userInput) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    // Verifica que los campos requeridos
    if (!userInput.first_name || !userInput.last_name || !userInput.email || !userInput.password) {
      return false;
    }
    // Validación de formato de correo electrónico
    else if (!emailRegex.test(userInput.email)) {
      return false;
    }

    // Validación de longitud mínima de contraseña
    else if (userInput.password.length < 8) {
      return false;
    }
    else{ return true;}
  }
  */
  //REGISTER USER
  async register(req, res) {
    try {
      console.log("Request body en Controller:", req.body);

      const { first_name, last_name, email, age, password } = req.body;

      // Validación
      if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({
          status: "error",
          message: "Todos los campos son obligatorios"
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "error",
          message: "El formato del email es inválido"
        });
      }

      const response = await this.userService.registerUser({
        first_name, last_name, email, age, password
      });

      console.log("response en controller", response);

      if (response.status === "success") {
        req.flash('successMessage', '¡Registro exitoso! Bienvenido.');
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch(error) { 
      console.error("Error registering user:", error);
      return res.status(500).json({
        status: "error",
        message: "Error interno del servidor"
      });
    }  
   }
  
  
  
  //ACTUALIZAR PASSWORD
  async restorePassword(req, res) {
    const { user, pass } = req.query;
    try {
      const passwordRestored = await this.userService.restorePassword(
        user,
        createHash(pass)
      );
      if (passwordRestored) {
        return res.send({
          status: "OK",
          message: "La contraseña se ha actualizado correctamente!",
        });
      } else {
        const customError = new CustomError({
          name: "Password Restoration Error",
          message: "No se pudo actualizar la contraseña",
          code: EErrors.PASSWORD_RESTORATION_ERROR,
        });
        return next(customError);
      }
    } catch (error) {
      console.error(error);
      return next(error)
    }
  }
  
  // RECUPERAR PASSWORD
  async resetPassword(req, res, next) {
    try {
      const { email, newPassword, confirmPassword} = req.body;
      const resetToken = req.params.token;

      // Validar que las contraseñas coincidan
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Las contraseñas no coinciden" });
      }

      // Validar el token de restablecimiento de contraseña
      const user = await this.userService.getUser(email);
      if (!user || user.resetPasswordToken !== resetToken || user.resetPasswordExpires < Date.now()) {
        return res.status(400).json({ message: "Token de restablecimiento de contraseña inválido o expirado" });
      }

      // Restablecer la contraseña 
      const hashedPassword = createHash(newPassword);
      await this.userService.restorePassword(user, hashedPassword);
      

      return res.status(200).json({ message: "Contraseña restablecida con éxito" });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }

  //UPDATE ROLE
  async updateUserRole(req, res){
    try {
      const userId = req.params.uid;
      const newRole = req.body.role;  // nuevo rol en el cuerpo de la solicitud

      // Validar si el nuevo rol es válido (por ejemplo, 'user' o 'premium')
      if (!['user', 'premium'].includes(newRole)) {
          return res.status(400).json({
              status: "error",
              message: "Invalid role.",
          });
      }

      // Actualizar el rol del usuario
      const updatedUser = await userService.updateUserRole(userId, newRole);

      res.status(200).json({
          status: "success",
          data: updatedUser,
      });
  } catch (error) {
      // Manejar errores
      console.error(error);
      res.status(500).json({
          status: "error",
          message: "Internal server error.",
      });
  }
 }
  

  //REVISAR
  async currentUser(req, res) {
    if (req.session.user) {
      // Obtiene el usuario actual 
      const user = await this.userService.getCurrentUser(req.session.user.id);

      if (user) {
        
        const userDTO = this.userDTOFactory.createUserDTO(user);
        return res.status(200).json(userDTO);
      } else {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
    } else {
      return res.status(401).json({ message: "No autorizado" });
    }
  }

}


export default UserController; 