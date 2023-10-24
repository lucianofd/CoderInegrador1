import UserDTO from './userDto.js';

class UserDtoFactory {
  createUserDTO(user) {
    return new UserDTO({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    });
  }
}

export default UserDtoFactory;