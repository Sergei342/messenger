import { ErrorPage } from './ErrorPage';

export class Error404Page extends ErrorPage {
  constructor() {
    super({ code: '404', message: 'Страница не найдена' });
  }
}
