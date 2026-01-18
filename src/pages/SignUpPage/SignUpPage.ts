import { Block, BlockProps } from '@core/Block';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Router } from '@core/Router';
import { ValidationRules, validateForm } from '@utils/validation';
// eslint-disable-next-line import/extensions
import AuthController from '@/controllers/AuthController';
import template from './signup.hbs';

export class SignUpPage extends Block<BlockProps> {
  constructor() {
    super({});
  }

  protected init(): void {
    const firstNameInput = new Input({
      name: 'first_name',
      label: 'Имя',
      placeholder: 'Введите имя',
      required: true,
      validationRule: ValidationRules.FIRST_NAME,
    });

    const secondNameInput = new Input({
      name: 'second_name',
      label: 'Фамилия',
      placeholder: 'Введите фамилию',
      required: true,
      validationRule: ValidationRules.SECOND_NAME,
    });

    const loginInput = new Input({
      name: 'login',
      label: 'Логин',
      placeholder: 'Придумайте логин',
      required: true,
      validationRule: ValidationRules.LOGIN,
    });

    const emailInput = new Input({
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Введите email',
      required: true,
      validationRule: ValidationRules.EMAIL,
    });

    const passwordInput = new Input({
      name: 'password',
      label: 'Пароль',
      type: 'password',
      placeholder: 'Придумайте пароль',
      required: true,
      validationRule: ValidationRules.PASSWORD,
    });

    const phoneInput = new Input({
      name: 'phone',
      label: 'Телефон',
      type: 'tel',
      placeholder: '+7 (999) 123-45-67',
      required: true,
      validationRule: ValidationRules.PHONE,
    });

    const submitButton = new Button({
      text: 'Зарегистрироваться',
      type: 'submit',
      variant: 'primary',
    });

    this.children = {
      firstNameInput,
      secondNameInput,
      loginInput,
      emailInput,
      passwordInput,
      phoneInput,
      submitButton,
    };
  }

  protected componentDidMount(): void {
    const form = this.element?.querySelector('form');
    if (form) {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    // Добавляем обработчик для ссылки на вход
    const loginLink = this.element?.querySelector('a[href*="index"], a[href="/"]');
    if (loginLink) {
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        const router = Router.getInstance();
        router?.go('/');
      });
    }

    this.addBlurHandlers();
  }

  private addBlurHandlers(): void {
    const fields = [
      { name: 'first_name', child: 'firstNameInput' },
      { name: 'second_name', child: 'secondNameInput' },
      { name: 'login', child: 'loginInput' },
      { name: 'email', child: 'emailInput' },
      { name: 'password', child: 'passwordInput' },
      { name: 'phone', child: 'phoneInput' },
    ];

    fields.forEach(({ name, child }) => {
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
  }

  private async handleSubmit(e: Event): Promise<void> {
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
      console.error('Sign up validation errors:', result.errors);

      Object.entries(result.errors).forEach(([field, error]) => {
        let inputName = `${field}Input`;
        if (field === 'first_name') {
          inputName = 'firstNameInput';
        } else if (field === 'second_name') {
          inputName = 'secondNameInput';
        }
        const input = this.children[inputName] as Input;
        if (input) {
          input.setProps({ error });
        }
      });

      return;
    }

    // Отправляем на API
    try {
      await AuthController.signUp({
        first_name: data.first_name,
        second_name: data.second_name,
        login: data.login,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
    } catch (error) {
      // Показываем ошибку от сервера
      const loginInput = this.children.loginInput as Input;
      const errorMessage = (error as { reason?: string })?.reason || 'Ошибка регистрации';
      loginInput.setProps({ error: errorMessage });
    }
  }

  protected render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
