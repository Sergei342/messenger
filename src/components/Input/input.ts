import { Block } from '@core/Block';
import { validateField, ValidationRules } from '@utils/validation';
import template from './input.hbs?raw';

interface InputProps {
  type?: string;
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  validationRule?: ValidationRules;
  error?: string;
  onBlur?: (e: FocusEvent) => void;
  onFocus?: (e: FocusEvent) => void;
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
    this.props.onBlur = this.handleBlur.bind(this);
    this.props.onFocus = this.handleFocus.bind(this);
  }

  private handleBlur(e: FocusEvent): void {
    const input = e.target as HTMLInputElement;
    const { validationRule } = this.props;

    if (validationRule) {
      const result = validateField(validationRule, input.value);
      this.setProps({ error: result.error });
    }
  }

  private handleFocus(): void {
    this.setProps({ error: '' });
  }

  public getValue(): string {
    const input = this.element?.querySelector('input');
    return input?.value || '';
  }

  public setValue(value: string): void {
    const input = this.element?.querySelector('input');
    if (input) {
      input.value = value;
    }
  }

  protected render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
