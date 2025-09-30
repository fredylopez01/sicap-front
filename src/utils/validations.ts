const isValidEmail = (email: string) => {
  // Expresión regular para una validación básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función de utilidad para validar la seguridad de la contraseña
const isStrongPassword = (password: string) => {
  // Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return passwordRegex.test(password);
};

export { isValidEmail, isStrongPassword };
