import { Block, BlockProps } from '@core/Block';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ValidationRules, validateForm } from '@utils/validation';
import template from './login.hbs?raw';

interface LoginPageProps extends BlockProps {
  [key: string]: unknown;
}

export class LoginPage extends Block<LoginPageProps> {
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
  }

  private handleSubmit(e: Event): void {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value as string;
    });

    const result = validateForm(data);

    if (result.isValid) {
      console.log('Login form data:', data);
      // TODO: Send to API
    } else {
      console.log('Validation errors:', result.errors);
      Object.entries(result.errors).forEach(([field, error]) => {
        const input = this.children[`${field}Input`] as Input;
        if (input) {
          input.setProps({ error });
        }
      });
    }
  }

  protected render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
