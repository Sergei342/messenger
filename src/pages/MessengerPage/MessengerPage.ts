import { Block, BlockProps } from '@core/Block';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ValidationRules, validateField } from '@utils/validation';
import template from './messenger.hbs';

export class MessengerPage extends Block<BlockProps> {
  constructor() {
    super({});
  }

  protected init(): void {
    const messageInput = new Input({
      name: 'message',
      label: '',
      type: 'text',
      placeholder: 'Введите сообщение...',
      required: true,
      validationRule: ValidationRules.MESSAGE,
    });

    const sendButton = new Button({
      text: 'Отправить',
      type: 'submit',
      variant: 'primary',
    });

    this.children = {
      messageInput,
      sendButton,
    };
  }

  protected componentDidMount(): void {
    const form = this.element?.querySelector('.message-form');
    if (form) {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    // Добавляем обработчики blur для поля сообщения
    const messageInput = this.children.messageInput as Input;
    const messageElement = messageInput.element?.querySelector('input');

    if (messageElement) {
      messageElement.addEventListener('blur', () => {
        const { value } = messageElement;
        const result = validateField(ValidationRules.MESSAGE, value);
        if (!result.isValid) {
          messageInput.setProps({ error: result.error });
        }
      });

      messageElement.addEventListener('focus', () => {
        messageInput.setProps({ error: '' });
      });
    }
  }

  private handleSubmit(e: Event): void {
    e.preventDefault();

    const messageInput = this.children.messageInput as Input;
    const message = messageInput.getValue();

    // Валидация при submit
    const result = validateField(ValidationRules.MESSAGE, message);

    if (!result.isValid) {
      // Сообщение НЕ ВАЛИДНО - показываем ошибку
      console.error('Message validation error:', result.error);
      messageInput.setProps({ error: result.error });

      // ВАЖНО: Прерываем выполнение, не отправляем сообщение
      return;
    }

    // Сообщение ВАЛИДНО - можно отправлять
    console.log('✅ Message sent:', message);
    console.log('✅ Сообщение валидно, можно отправить на сервер');
    messageInput.setValue(''); // Очищаем поле
    // TODO: Отправить на API
  }

  protected render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
