export enum ValidationRules {
  FIRST_NAME = 'first_name',
  SECOND_NAME = 'second_name',
  LOGIN = 'login',
  EMAIL = 'email',
  PASSWORD = 'password',
  PHONE = 'phone',
  MESSAGE = 'message',
}

const VALIDATION_PATTERNS = {
  // Латиница или кириллица, первая буква заглавная, без пробелов и цифр, только дефис
  [ValidationRules.FIRST_NAME]: /^[A-ZА-ЯЁ][a-zа-яё-]*$/,
  [ValidationRules.SECOND_NAME]: /^[A-ZА-ЯЁ][a-zа-яё-]*$/,

  // От 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, дефис и подчёркивание
  [ValidationRules.LOGIN]: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,

  // Латиница, цифры, спецсимволы, обязательно @ и точка после @
  [ValidationRules.EMAIL]: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // От 8 до 40 символов, хотя бы одна заглавная буква и цифра
  [ValidationRules.PASSWORD]: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,

  // От 10 до 15 символов, состоит из цифр, может начинаться с плюса
  [ValidationRules.PHONE]: /^\+?\d{10,15}$/,

  // Не пустое
  [ValidationRules.MESSAGE]: /^.+$/,
};

const VALIDATION_MESSAGES = {
  [ValidationRules.FIRST_NAME]: 'Имя должно начинаться с заглавной буквы и содержать только буквы и дефис',
  [ValidationRules.SECOND_NAME]: 'Фамилия должна начинаться с заглавной буквы и содержать только буквы и дефис',
  [ValidationRules.LOGIN]: 'Логин должен быть от 3 до 20 символов, содержать латиницу, может включать цифры, дефис и подчёркивание',
  [ValidationRules.EMAIL]: 'Неверный формат email',
  [ValidationRules.PASSWORD]: 'Пароль должен быть от 8 до 40 символов, содержать заглавную букву и цифру',
  [ValidationRules.PHONE]: 'Телефон должен содержать от 10 до 15 цифр, может начинаться с +',
  [ValidationRules.MESSAGE]: 'Сообщение не может быть пустым',
};

export function validateField(rule: ValidationRules, value: string): { isValid: boolean; error: string } {
  const pattern = VALIDATION_PATTERNS[rule];
  const isValid = pattern.test(value.trim());

  return {
    isValid,
    error: isValid ? '' : VALIDATION_MESSAGES[rule],
  };
}

export function validateForm(data: Record<string, string>): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  Object.entries(data).forEach(([field, value]) => {
    if (field in ValidationRules) {
      const result = validateField(field as ValidationRules, value);
      if (!result.isValid) {
        errors[field] = result.error;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}