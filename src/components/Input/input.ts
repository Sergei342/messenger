import { Block } from '@core/Block';
import { validateField, ValidationRules } from '@utils/validation';
import template from './input.hbs';

interface InputProps {
  type?: string;
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  validationRule?: ValidationRules;
  error?: string;
  [key: string]: unknown;
}

export class Input extends Block<InputProps> {
  constructor(props: InputProps) {
    super({
      ...props,
      type: props.type || 'text',
      value: props.value || '',
      error: props.error || '',
    });
  }

  protected init(): void {
    const inputEl = this.element?.querySelector('input');
    inputEl?.addEventListener('blur', this.handleBlur.bind(this));
    inputEl?.addEventListener('focus', this.handleFocus.bind(this));
  }

  private handleBlur(e: FocusEvent): void {
    const input = e.target as HTMLInputElement;
    const { validationRule } = this.props;

    if (validationRule) {
      const result = validateField(validationRule, input.value);
      const errorEl = this.element?.querySelector('.error');
      if (errorEl) errorEl.textContent = result.error || '';
    }
  }

  private handleFocus(): void {
    const errorEl = this.element?.querySelector('.error');
    if (errorEl) errorEl.textContent = '';
  }

  public getValue(): string {
    const input = this.element?.querySelector('input');
    return input?.value || '';
  }

  public setValue(value: string): void {
    const input = this.element?.querySelector('input');
    if (input) input.value = value;
  }

  protected render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
