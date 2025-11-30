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
    }

    private handleSubmit(e: Event): void {
        e.preventDefault();

        const messageInput = this.children.messageInput as Input;
        const message = messageInput.getValue();

        const result = validateField(ValidationRules.MESSAGE, message);

        if (!result.isValid) {
            messageInput.setProps({ error: result.error });
            return;
        }

        console.log('Message sent:', message);
        messageInput.setValue('');
    }

    protected render(): DocumentFragment {
        return this.compile(template, this.props);
    }
}