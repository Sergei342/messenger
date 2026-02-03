import { Block, BlockProps } from '@core/Block';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ValidationRules, validateForm } from '@utils/validation';
import AuthController from '@/controllers/AuthController';
import { Router } from '@core/Router';
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
      fieldName: string,
  ): void {
    element.addEventListener('blur', () => {
      requestAnimationFrame(() => {
        const result = validateForm({ [fieldName]: element.value });
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

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value as string;
    });

    const result = validateForm(data);

    if (!result.isValid) {
      Object.entries(result.errors).forEach(([field, error]) => {
        const input = this.children[`${field}Input`] as Input;
        if (input) input.setProps({ error });
      });
      return;
    }

    try {
      // Сначала проверяем, авторизован ли пользователь
      const isAuthenticated = await AuthController.checkAuth();

      if (!isAuthenticated) {
        // Если нет, выполняем логин
        await AuthController.signIn({
          login: data.login,
          password: data.password,
        });
      }

      // После успешного логина или если уже авторизован — идём в Messenger
      Router.getInstance().go('/messenger');
    } catch (error: any) {
      // Игнорируем "User already in system" и продолжаем
      if (error?.reason === 'User already in system') {
        Router.getInstance().go('/messenger');
        return;
      }

      const passwordInput = this.children.passwordInput as Input;
      passwordInput.setProps({ error: 'Неверный логин или пароль' });
    }
  }

  protected render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
