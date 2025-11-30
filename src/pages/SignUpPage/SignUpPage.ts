import { Block, BlockProps } from '@core/Block';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ValidationRules, validateForm } from '@utils/validation';
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
  }

  private handleSubmit(e: Event): void {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value as string;
    });

    const result = validateForm(data);

    if (!result.isValid) {
      console.log('Validation errors:', result.errors);
      Object.entries(result.errors).forEach(([field, error]) => {
        const input = this.children[`${field}Input`] as Input;
        if (input) {
          input.setProps({ error });
        }
      });
      return;
    }

    console.log('Sign up form data:', data);
  }

  protected render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
