import { LoginPage } from '@pages/LoginPage';
import { SignUpPage } from '@pages/SignUpPage';
import { MessengerPage } from '@pages/MessengerPage';
import { SettingsPage } from '@pages/SettingPage';
import { ErrorPage } from '@pages/ErrorPage';
import '@/styles/main.scss';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');

  if (!root) {
    throw new Error('Root element not found');
  }

  const path = window.location.pathname;

  let page;

  if (path === '/' || path === '/index.html') {
    page = new LoginPage();
  } else if (path === '/sign-up.html') {
    page = new SignUpPage();
  } else if (path === '/messenger.html') {
    page = new MessengerPage();
  } else if (path === '/settings.html') {
    page = new SettingsPage();
  } else if (path === '/404.html') {
    page = new ErrorPage({
      code: '404',
      message: 'Страница не найдена',
    });
  } else if (path === '/500.html') {
    page = new ErrorPage({
      code: '500',
      message: 'Ошибка сервера',
    });
  }

  if (page) {
    const content = page.getContent();

    if (content) {
      root.appendChild(content);
      page.dispatchComponentDidMount();
    }
  }
});

