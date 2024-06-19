import { ENV_CONFIG } from "../../config/config.js";
import UserManager from "../dao/UserManager.js";

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
    // Validar la contraseña
    const minLength = 8;
    const hasNumber = /\d/;
    return password.length >= minLength && hasNumber.test(password);
  }

  async registerUser({ first_name, last_name, email, age, password}) {
    try {

      if (!this.isValidUserInput({first_name, last_name, email,age, password})){
        return { status: "error", message: "Invalid user input"};
      }
      
      const role =
        email == ENV_CONFIG.ADMIN_EMAIL &&
        password === ENV_CONFIG.ADMIN_PASSWORD
          ? "admin"
          : "user";

      const user = await this.userManager.addUser({
        first_name, last_name, email, age,  password,
        role,
      });
      
      if (user.status === "success") {
        return { status: "success", user:user.user};
      } else {
        return { status: "error", message: user.message };
      }
    } catch (error) {
      console.error("Error registering user:", error);
      return { status: "error", message: "Internal Server Error" };
    }
  }

  async restorePassword(user, hashedPassword) {
    return await this.userManager.restorePassword(user, hashedPassword);
  }

  

  async getUser(email) {
    return await this.userManager.findOne({ email });
  }

  async updateUserRole(userId, newRole) {
    return userModel.findByIdAndUpdate(userId, { role: newRole }, { new: true });
}
}

export default UserService;
