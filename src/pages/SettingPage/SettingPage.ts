import { Block, BlockProps } from '@core/Block';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ValidationRules, validateForm } from '@utils/validation';
import template from './settings.hbs';

export class SettingsPage extends Block<BlockProps> {
  constructor() {
    super({});
  }

  protected init(): void {
    const firstNameInput = new Input({
      name: 'first_name',
      label: 'Имя',
      value: 'Иван',
      required: true,
      validationRule: ValidationRules.FIRST_NAME,
    });

    const secondNameInput = new Input({
      name: 'second_name',
      label: 'Фамилия',
      value: 'Иванов',
      required: true,
      validationRule: ValidationRules.SECOND_NAME,
    });

    const displayNameInput = new Input({
      name: 'display_name',
      label: 'Отображаемое имя',
      value: 'Ваня',
    });

    const loginInput = new Input({
      name: 'login',
      label: 'Логин',
      value: 'ivan_ivanov',
      required: true,
      validationRule: ValidationRules.LOGIN,
    });

    const emailInput = new Input({
      name: 'email',
      label: 'Email',
      type: 'email',
      value: 'ivan@example.com',
      required: true,
      validationRule: ValidationRules.EMAIL,
    });

    const phoneInput = new Input({
      name: 'phone',
      label: 'Телефон',
      type: 'tel',
      value: '+79991234567',
      required: true,
      validationRule: ValidationRules.PHONE,
    });

    const oldPasswordInput = new Input({
      name: 'oldPassword',
      label: 'Старый пароль',
      type: 'password',
      required: true,
      validationRule: ValidationRules.PASSWORD,
    });

    const newPasswordInput = new Input({
      name: 'newPassword',
      label: 'Новый пароль',
      type: 'password',
      required: true,
      validationRule: ValidationRules.PASSWORD,
    });

    const saveProfileButton = new Button({
      text: 'Сохранить изменения',
      type: 'submit',
      variant: 'primary',
    });

    const savePasswordButton = new Button({
      text: 'Изменить пароль',
      type: 'submit',
      variant: 'primary',
    });

    this.children = {
      firstNameInput,
      secondNameInput,
      displayNameInput,
      loginInput,
      emailInput,
      phoneInput,
      oldPasswordInput,
      newPasswordInput,
      saveProfileButton,
      savePasswordButton,
    };
  }

  protected componentDidMount(): void {
    const profileForm = this.element?.querySelector('#profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', this.handleProfileSubmit.bind(this));
    }

    const passwordForm = this.element?.querySelector('#password-form');
    if (passwordForm) {
      passwordForm.addEventListener('submit', this.handlePasswordSubmit.bind(this));
    }

    this.addBlurHandlers();
  }

  private addBlurHandlers(): void {
    const profileFields = [
      { name: 'first_name', child: 'firstNameInput' },
      { name: 'second_name', child: 'secondNameInput' },
      { name: 'login', child: 'loginInput' },
      { name: 'email', child: 'emailInput' },
      { name: 'phone', child: 'phoneInput' },
    ];

    profileFields.forEach(({ name, child }) => {
      const input = this.children[child] as Input;
      const element = input.element?.querySelector('input');

      if (element) {
        element.addEventListener('blur', () => {
          requestAnimationFrame(() => {
            const { value } = element;
            const result = validateForm({ [name]: value });
            if (result.errors[name]) {
              input.setProps({ error: result.errors[name] });
            }
          });
        });

        element.addEventListener('focus', () => {
          requestAnimationFrame(() => {
            input.setProps({ error: '' });
          });
        });
      }
    });

    // Обработчики для полей пароля
    const passwordFields = [
      { name: 'oldPassword', child: 'oldPasswordInput' },
      { name: 'newPassword', child: 'newPasswordInput' },
    ];

    passwordFields.forEach(({ child }) => {
      const input = this.children[child] as Input;
      const element = input.element?.querySelector('input');

      if (element) {
        element.addEventListener('blur', () => {
          requestAnimationFrame(() => {
            const { value } = element;
            // Для паролей используем правило PASSWORD
            const result = validateForm({ password: value });
            if (result.errors.password) {
              input.setProps({ error: result.errors.password });
            }
          });
        });

        element.addEventListener('focus', () => {
          requestAnimationFrame(() => {
            input.setProps({ error: '' });
          });
        });
      }
    });
  }

  private handleProfileSubmit(e: Event): void {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value as string;
    });

    // Валидация при submit
    const result = validateForm(data);

    if (!result.isValid) {
      // Форма НЕ ВАЛИДНА - показываем ошибки
      console.error('Profile validation errors:', result.errors);

      Object.entries(result.errors).forEach(([field, error]) => {
        const input = this.children[`${field}Input`] as Input;
        if (input) {
          input.setProps({ error });
        }
      });

      // ВАЖНО: Прерываем выполнение, не отправляем форму
      return;
    }

    // Форма ВАЛИДНА - можно отправлять
    console.log('✅ Profile updated:', data);
    console.log('✅ Профиль валиден, данные можно отправить на сервер');
    // TODO: Отправить на API
  }

  private handlePasswordSubmit(e: Event): void {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value as string;
    });

    // Валидация паролей (проверяем как password)
    const validationData = {
      password: data.oldPassword,
      newPassword: data.newPassword,
    };

    const result = validateForm(validationData);

    if (!result.isValid) {
      // Форма НЕ ВАЛИДНА - показываем ошибки
      console.error('Password validation errors:', result.errors);

      if (result.errors.password) {
        const oldPasswordInput = this.children.oldPasswordInput as Input;
        oldPasswordInput.setProps({ error: result.errors.password });
      }

      if (result.errors.newPassword) {
        const newPasswordInput = this.children.newPasswordInput as Input;
        newPasswordInput.setProps({ error: result.errors.newPassword });
      }

      // ВАЖНО: Прерываем выполнение, не отправляем форму
      return;
    }

    // Форма ВАЛИДНА - можно отправлять
    console.log('✅ Password changed');
    console.log('✅ Пароли валидны, можно отправить на сервер');
    // TODO: Отправить на API
  }

  protected render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
