export const generateUserErrorInfo = (user) => {
    return `Uno o más campos estan incompletos o no son válidos.
        Campos requeridos:
            * fist_name: type String, recibido: ${user.first_name}
            * last_name: type String, recibido: ${user.last_name}
            * email: type String, recibido: ${user.email}
            * age: type Number, recibido: ${user.age}
            * password: type String, recibido: ${user.password}
    `;
};