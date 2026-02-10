import { Block, BlockProps } from '@core/Block';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Router } from '@core/Router';
import { Store } from '@core/Store';
import { ValidationRules, validateForm } from '@utils/validation';
import { BASE_URL } from '@/api/BaseAPI';
import UserController from '@/controllers/UserController';
import AuthController from '@/controllers/AuthController';
import template from './settings.hbs';

export class SettingsPage extends Block<BlockProps> {
  private store: Store;

  constructor() {
    super({});
    this.store = Store.getInstance();
  }

  protected init(): void {
    const firstNameInput = new Input({
      name: 'first_name',
      label: 'Имя',
      value: '',
      required: true,
      validationRule: ValidationRules.FIRST_NAME,
    });

    const secondNameInput = new Input({
      name: 'second_name',
      label: 'Фамилия',
      value: '',
      required: true,
      validationRule: ValidationRules.SECOND_NAME,
    });

    const displayNameInput = new Input({
      name: 'display_name',
      label: 'Отображаемое имя',
      value: '',
    });

    const loginInput = new Input({
      name: 'login',
      label: 'Логин',
      value: '',
      required: true,
      validationRule: ValidationRules.LOGIN,
    });

    const emailInput = new Input({
      name: 'email',
      label: 'Email',
      type: 'email',
      value: '',
      required: true,
      validationRule: ValidationRules.EMAIL,
    });

    const phoneInput = new Input({
      name: 'phone',
      label: 'Телефон',
      type: 'tel',
      value: '',
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

    const logoutButton = new Button({
      text: 'Выйти',
      type: 'button',
      variant: 'danger',
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
      logoutButton,
    };
  }

  protected componentDidMount(): void {
    // Загружаем данные пользователя в форму
    this.loadUserData();

    // Подписка на обновления Store
    this.store.on('updated', this.loadUserData.bind(this));

    const profileForm = this.element?.querySelector('#profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', this.handleProfileSubmit.bind(this));
    }

    const passwordForm = this.element?.querySelector('#password-form');
    if (passwordForm) {
      passwordForm.addEventListener('submit', this.handlePasswordSubmit.bind(this));
    }

    // Обработчик загрузки аватара
    const avatarUpload = this.element?.querySelector('.avatar-upload button');
    if (avatarUpload) {
      avatarUpload.addEventListener('click', this.handleAvatarUpload.bind(this));
    }

    // Обработчик выхода
    const logoutBtn = this.element?.querySelector('.logout-section button');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', this.handleLogout.bind(this));
    }

    // Обработчик ссылки "Вернуться к чатам"
    const backLink = this.element?.querySelector('a[data-link]');
    if (backLink) {
      backLink.addEventListener('click', (e) => {
        e.preventDefault();
        const router = Router.getInstance();
        router?.go('/messenger');
      });
    }

    this.addBlurHandlers();
  }

  private loadUserData(): void {
    const state = this.store.getState();
    const { user } = state;

    if (user) {
      (this.children.firstNameInput as Input).setValue(user.first_name || '');
      (this.children.secondNameInput as Input).setValue(user.second_name || '');
      (this.children.displayNameInput as Input).setValue(user.display_name || '');
      (this.children.loginInput as Input).setValue(user.login || '');
      (this.children.emailInput as Input).setValue(user.email || '');
      (this.children.phoneInput as Input).setValue(user.phone || '');

      // Обновляем аватар
      const avatarEl = this.element?.querySelector('.avatar-large') as HTMLElement;
      if (avatarEl && user.avatar) {
        avatarEl.style.backgroundImage = `url(${BASE_URL}/resources${user.avatar})`;
        avatarEl.style.backgroundSize = 'cover';
      }
    }
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

  private async handleProfileSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value as string;
    });

    // Валидация при submit
    const result = validateForm(data);

    if (!result.isValid) {
      console.error('Profile validation errors:', result.errors);

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
      await UserController.updateProfile({
        first_name: data.first_name,
        second_name: data.second_name,
        display_name: data.display_name || '',
        login: data.login,
        email: data.email,
        phone: data.phone,
      });
      alert('Профиль успешно обновлён');
    } catch (error) {
      const errorMessage = (error as { reason?: string })?.reason || 'Ошибка обновления профиля';
      alert(errorMessage);
    }
  }

  private async handlePasswordSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value as string;
    });

    // Валидация паролей
    const validationData = {
      password: data.oldPassword,
      newPassword: data.newPassword,
    };

    const result = validateForm(validationData);

    if (!result.isValid) {
      console.error('Password validation errors:', result.errors);

      if (result.errors.password) {
        const oldPasswordInput = this.children.oldPasswordInput as Input;
        oldPasswordInput.setProps({ error: result.errors.password });
      }

      if (result.errors.newPassword) {
        const newPasswordInput = this.children.newPasswordInput as Input;
        newPasswordInput.setProps({ error: result.errors.newPassword });
      }

      return;
    }

    // Отправляем на API
    try {
      await UserController.updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      alert('Пароль успешно изменён');
      (this.children.oldPasswordInput as Input).setValue('');
      (this.children.newPasswordInput as Input).setValue('');
    } catch (error) {
      const errorMessage = (error as { reason?: string })?.reason || 'Ошибка смены пароля';
      (this.children.oldPasswordInput as Input).setProps({ error: errorMessage });
    }
  }

  private handleAvatarUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          await UserController.updateAvatar(file);
          alert('Аватар обновлён');
        } catch (error) {
          const errorMessage = (error as { reason?: string })?.reason || 'Ошибка загрузки аватара';
          alert(errorMessage);
        }
      }
    });

    input.click();
  }

  private async handleLogout(): Promise<void> {
    await AuthController.logout();
  }

  protected render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
