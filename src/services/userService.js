import { ENV_CONFIG } from "../../config/config.js";
import UserManager from "../dao/UserManager.js";

class UserService {
  constructor() {
    this.userManager = new UserManager();
  }

  async registerUser({ first_name, last_name, email, age, password, role }) {
    try {
      const role =
        email == ENV_CONFIG.ADMIN_EMAIL &&
        password === ENV_CONFIG.ADMIN_PASSWORD
          ? "admin"
          : "user";
      const user = await this.userManager.addUser({
        first_name,
        last_name,
        email,
        age,
        password,
        role,
      });
      
      if (user) {
        return { status: "success", user, redirect: "/login" };
      } else {
        return { status: "error", message: "User with this email already exists" };
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
