import { Block } from '@core/Block';
import template from './button.hbs';

interface ButtonProps {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  onClick?: (e: MouseEvent) => void;
  [key: string]: unknown;
}

export class Button extends Block<ButtonProps> {
  constructor(props: { text: string; type: string; variant: string }) {
    super({
      ...props,
      type: props.type || 'button',
      variant: props.variant || 'primary',
    });
  }

  protected render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
