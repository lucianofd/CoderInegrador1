import { ENV_CONFIG } from "../../config/config.js";
import UserManager from "../dao/UserManager.js";
import { createHash, isValidPassword } from "../../utils.js";

const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

class UserService {
  constructor() {
    this.userManager = new UserManager();
  }

  
  isValidUserInput(userInput) {
    // Validar los datos del usuario
    return (
      userInput.first_name &&
      userInput.last_name &&
      userInput.email &&
      userInput.age &&
      this.isValidPassword(userInput.password)
    );
  }

  isValidPassword(password) {
    // Validar la contraseña: al menos 6 caracteres, una mayúscula y un número
    const minLength = 6;
    const hasUppercase = /[A-Z]/;
    const hasNumber = /\d/;
    return password.length >= minLength && hasUppercase.test(password) && hasNumber.test(password);
  }

  async registerUser(userDetails) {
    try {
      userDetails.email = userDetails.email.toLowerCase();
      console.log("user recibido en service", userDetails);

      // Primero, verificamos si el usuario ya existe
      const existingUser = await this.userManager.findOne(userDetails.email);
      console.log("email en verificacion service", existingUser);

      if (existingUser) {
        console.log(`El usuario ${userDetails.email} ya se encuentra registrado!`);
        return { status: "error", message: "El usuario con este email ya existe" };
      }

      // Validar la contraseña
      if (!this.isValidPassword(userDetails.password)) {
        return { status: "error", message: "La contraseña no cumple con los requisitos mínimos" };
      }

      // Si el usuario no existe, procedemos con el registro
      console.log("Asignando role de usuario");
      userDetails.password = await createHash(userDetails.password);
      userDetails.rol= userDetails.email === process.env.ADMIN_EMAIL.toLocaleLowerCase() ? ROLES.ADMIN : ROLES.USER;

      const newUser = await this.userManager.addUser(userDetails);
      console.log("Nuevo usuario creado:", newUser);

      return { status: "success", user: newUser };
    } catch (error) {
      console.error("Error registering user:", error);
      return { status: "error", message: "Error interno del servidor" };
    }
  }

  async restorePassword(user, hashedPassword) {
    return await this.userManager.restorePassword(user, hashedPassword);
  }

  

  async getUser(email) {
    email = email.toLocaleLowerCase()
    return await this.userManager.findOne({ email });
  }

  async updateUserRole(userId, newRole) {
    return userModel.findByIdAndUpdate(userId, { role: newRole }, { new: true });
}

  
};


export default UserService;
