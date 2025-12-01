export enum ValidationRules {
  FIRST_NAME = 'first_name',
  SECOND_NAME = 'second_name',
  LOGIN = 'login',
  EMAIL = 'email',
  PASSWORD = 'password',
  PHONE = 'phone',
  MESSAGE = 'message',
}

const VALIDATION_PATTERNS: Record<ValidationRules, RegExp> = {
  // Латиница или кириллица, первая буква заглавная, без пробелов и цифр, только дефис
  [ValidationRules.FIRST_NAME]: /^[A-ZА-ЯЁ][a-zа-яё-]*$/,
  [ValidationRules.SECOND_NAME]: /^[A-ZА-ЯЁ][a-zа-яё-]*$/,

  // 3-20 символов, латиница, может содержать цифры но не состоять из них, дефис и подчёркивание
  [ValidationRules.LOGIN]: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,

  // Email с @ и точкой после @
  [ValidationRules.EMAIL]: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // 8-40 символов, минимум одна заглавная буква и одна цифра
  [ValidationRules.PASSWORD]: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,

  // 10-15 цифр, может начинаться с +
  [ValidationRules.PHONE]: /^\+?\d{10,15}$/,

  // Не пустое
  [ValidationRules.MESSAGE]: /^.+$/,
};

const VALIDATION_MESSAGES: Record<ValidationRules, string> = {
  [ValidationRules.FIRST_NAME]:
      'Имя должно начинаться с заглавной буквы, содержать только буквы и дефис',
  [ValidationRules.SECOND_NAME]:
      'Фамилия должна начинаться с заглавной буквы, содержать только буквы и дефис',
  [ValidationRules.LOGIN]:
      'Логин: 3-20 символов, латиница, может содержать цифры, дефис и подчёркивание',
  [ValidationRules.EMAIL]: 'Неверный формат email',
  [ValidationRules.PASSWORD]:
      'Пароль: 8-40 символов, минимум одна заглавная буква и цифра',
  [ValidationRules.PHONE]: 'Телефон: 10-15 цифр, может начинаться с +',
  [ValidationRules.MESSAGE]: 'Сообщение не может быть пустым',
};

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateField(
    rule: ValidationRules,
    value: string,
): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: 'Поле обязательно для заполнения',
    };
  }

  const pattern = VALIDATION_PATTERNS[rule];
  const isValid = pattern.test(value);

  return {
    isValid,
    error: isValid ? undefined : VALIDATION_MESSAGES[rule],
  };
}

export function validateForm(data: Record<string, string>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // Маппинг имён полей на правила валидации
  const fieldRules: Record<string, ValidationRules> = {
    first_name: ValidationRules.FIRST_NAME,
    second_name: ValidationRules.SECOND_NAME,
    login: ValidationRules.LOGIN,
    email: ValidationRules.EMAIL,
    password: ValidationRules.PASSWORD,
    phone: ValidationRules.PHONE,
    message: ValidationRules.MESSAGE,
    oldPassword: ValidationRules.PASSWORD,
    newPassword: ValidationRules.PASSWORD,
  };

  Object.entries(data).forEach(([field, value]) => {
    const rule = fieldRules[field];
    if (rule) {
      const result = validateField(rule, value);
      if (!result.isValid) {
        errors[field] = result.error || 'Ошибка валидации';
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}