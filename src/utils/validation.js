// Validation utilities

export class Validator {
  static validate(data, rules) {
    const errors = {};

    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field] || '';

      if (rule.required && !value.trim()) {
        errors[field] = rule.message || 'Это поле обязательно';
        continue;
      }

      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = rule.message || `Минимум ${rule.minLength} символов`;
        continue;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = rule.message || `Максимум ${rule.maxLength} символов`;
        continue;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = rule.message || 'Неверный формат';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static email(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  }

  static phone(value) {
    const phonePattern = /^\+?[0-9]{10,15}$/;
    return phonePattern.test(value.replace(/[\s()-]/g, ''));
  }

  static login(value) {
    // От 3 до 20 символов, латиница, может содержать цифры, дефис и нижнее подчёркивание
    const loginPattern = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
    return loginPattern.test(value);
  }

  static password(value) {
    // Минимум 8 символов, хотя бы одна заглавная буква и одна цифра
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordPattern.test(value);
  }

  static name(value) {
    // Только буквы, дефис и пробел
    const namePattern = /^[A-Za-zА-Яа-яЁё\s-]+$/;
    return namePattern.test(value);
  }
}

