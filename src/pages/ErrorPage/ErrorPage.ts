import { Block, BlockProps } from '@core/Block';
import template from './errorPage.hbs';

interface ErrorPageProps extends BlockProps {
  code: string;
  message: string;
}

export class ErrorPage extends Block<ErrorPageProps> {


  protected render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
