import { ErrorPage } from './ErrorPage';

export class Error500Page extends ErrorPage {
  constructor() {
    super({ code: '500', message: 'Ошибка сервера' });
  }
}
