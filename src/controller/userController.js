import UserService from "../services/userService.js";
import UserInputDTO from"../dao/dto/userDto.js";
import UserDtoFactory from "../dao/dto/userFactory.js";

class UserController {
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
      if (!isValidUserInput(clientInput)) {
        return res.status(400).json({ message: "Datos de cliente inválidos" });
    }
   
    const { first_name, last_name, email, age, password, role } = clientInput;

    const response = await this.userService.registerUser({
      first_name, last_name, email,age,   password,
      role
    });

    return res.status(response.status === "success" ? 200 : 400).json(response);
  } catch(error){
    console.error(error);
      return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
  }
  
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
        return res.status(401).send({
          status: "Error",
          message: "No se pudo actualizar la contraseña!",
        });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  }

  currentUser(req, res) {
    if (req.user) {
      return res.send({ status: "OK", payload: req.user });
    } else {
      return res.status(401).send({ status: "Error", message: "No authorized" });
    }
  }
}

export default UserController;