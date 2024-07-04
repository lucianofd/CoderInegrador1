export const generateUserErrorInfo = (user) => {
    const missingFields = [];

    if (!user.first_name) missingFields.push('Nombre');
    if (!user.last_name) missingFields.push('Apellido');
    if (!user.email) missingFields.push('Email');
    if (!user.age) missingFields.push('Edad');
    if (!user.password) missingFields.push('Contraseña');
  
    return `Error en los campos: ${missingFields.join(', ')}.`;
  };
