export const emailValidation = {
  required: "E-mail обов'язковий",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Некоректний формат e-mail",
  },
};

export const passwordValidation = {
  required: "Пароль обов'язковий",
  minLength: {
    value: 8,
    message: "Пароль має містити від 8 до 13 символів",
  },
  maxLength: {
    value: 13,
    message: "Пароль має містити від 8 до 13 символів",
  },
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,13}$/,
    message: "Пароль має містити великі, малі літери та хоча б одну цифру",
  },
};
