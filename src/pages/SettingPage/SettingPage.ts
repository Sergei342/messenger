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
            value: '+7 (999) 123-45-67',
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
    }

    private handleProfileSubmit(e: Event): void {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const data: Record<string, string> = {};

        formData.forEach((value, key) => {
            data[key] = value as string;
        });

        const result = validateForm(data);

        if (!result.isValid) {
            console.log('Profile validation errors:', result.errors);
            Object.entries(result.errors).forEach(([field, error]) => {
                const input = this.children[`${field}Input`] as Input;
                if (input) {
                    input.setProps({ error });
                }
            });
            return;
        }

        console.log('Profile updated:', data);
    }

    private handlePasswordSubmit(e: Event): void {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const data: Record<string, string> = {};

        formData.forEach((value, key) => {
            data[key] = value as string;
        });

        const result = validateForm(data);

        if (!result.isValid) {
            console.log('Password validation errors:', result.errors);
            Object.entries(result.errors).forEach(([field, error]) => {
                const input = this.children[`${field}Input`] as Input;
                if (input) {
                    input.setProps({ error });
                }
            });
            return;
        }

        console.log('Password changed:', data);
    }

    protected render(): DocumentFragment {
        return this.compile(template, this.props);
    }
}
