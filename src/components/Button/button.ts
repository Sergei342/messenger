import { Block } from '@core/Block';
import template from './button.hbs';

interface ButtonProps {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: (e: MouseEvent) => void;
  [key: string]: unknown;
}

export class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    const type: 'button' | 'submit' | 'reset' = props.type || 'button';
    const variant: 'primary' | 'secondary' | 'danger' = props.variant || 'primary';

    super({
      ...props,
      type,
      variant,
    });
  }

  protected render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
