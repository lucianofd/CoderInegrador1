import UserService from "../services/userService.js";
import UserInputDTO from"../dao/dto/userDto.js";
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

  isValidUserInput(userInput) {
    // Verifica que los campos requeridos
    if (!userInput.first_name || !userInput.last_name || !userInput.email || !userInput.password) {
      return false;
    }
    // Validación de formato de correo electrónico
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(userInput.email)) {
      return false;
    }

    // Validación de longitud mínima de contraseña
    if (userInput.password.length < 8) {
      return false;
    }
    return true;
  }

  async register(req, res) {
    try{

      const clientInput = new UserInputDTO(req.body);
      if (!this.isValidUserInput(clientInput)) {const customError = new CustomError({
        name: "User Creation Error",
        cause: generateUserErrorInfo({
          first_name,
          last_name,
          age,
          email,
          password,
          role,
        }),
        message: "Error tratando de crear el usuario",
        code: 400,
      });
      return next(customError);
        
    }
    
    const { first_name, last_name, email, age, password, role } = clientInput;

    const response = await this.userService.registerUser({
      first_name, last_name, email,age,   password,
      role
    });

    return res.status(response.status === "success" ? 200 : 400).json({
      status: response.status,
      data: response.user,
      redirect: response.redirect,
    });
    } catch (error) {
      return next(error);
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