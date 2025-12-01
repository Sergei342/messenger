import { Block, BlockProps } from '@core/Block';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ValidationRules, validateForm } from '@utils/validation';
import template from './login.hbs';

export class LoginPage extends Block<BlockProps> {
  constructor() {
    super({});
  }

  protected init(): void {
    const loginInput = new Input({
      name: 'login',
      label: 'Логин',
      placeholder: 'Введите логин',
      required: true,
      validationRule: ValidationRules.LOGIN,
    });

    const passwordInput = new Input({
      name: 'password',
      label: 'Пароль',
      type: 'password',
      placeholder: 'Введите пароль',
      required: true,
      validationRule: ValidationRules.PASSWORD,
    });

    const submitButton = new Button({
      text: 'Войти',
      type: 'submit',
      variant: 'primary',
    });

    this.children = {
      loginInput,
      passwordInput,
      submitButton,
    };
  }

  protected componentDidMount(): void {
    const form = this.element?.querySelector('form');
    if (form) {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    this.setupInputValidation();
  }

  private setupInputValidation(): void {
    const loginInput = this.children.loginInput as Input;
    const passwordInput = this.children.passwordInput as Input;

    const loginElement = loginInput.element?.querySelector('input');
    const passwordElement = passwordInput.element?.querySelector('input');

    if (loginElement) {
      this.addValidationListeners(loginElement, loginInput, 'login');
    }

    if (passwordElement) {
      this.addValidationListeners(passwordElement, passwordInput, 'password');
    }
  }

  private addValidationListeners(
      element: HTMLInputElement,
      input: Input,
      fieldName: string
  ): void {
    element.addEventListener('blur', () => {
      // Используем requestAnimationFrame для отложенного обновления
      // Это позволяет избежать конфликта с обработкой события blur
      requestAnimationFrame(() => {
        const value = element.value;
        const result = validateForm({ [fieldName]: value });

        if (result.errors[fieldName]) {
          input.setProps({ error: result.errors[fieldName] });
        }
      });
    });

    element.addEventListener('focus', () => {
      requestAnimationFrame(() => {
        input.setProps({ error: '' });
      });
    });
  }

  private handleSubmit(e: Event): void {
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
      console.error('Validation errors:', result.errors);

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
    console.log('✅ Login form data:', data);
    console.log('✅ Форма валидна, данные можно отправить на сервер');
    // TODO: Отправить на API
  }

  protected render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
