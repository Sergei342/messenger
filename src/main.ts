import { Router } from '@core/Router';
import { LoginPage } from '@pages/LoginPage';
import { SignUpPage } from '@pages/SignUpPage';
import { MessengerPage } from '@pages/MessengerPage';
import { SettingsPage } from '@pages/SettingPage';
import { Error404Page } from '@pages/Error404Page';
import { Error500Page } from '@pages/Error500Page';
import AuthController from '@/controllers/AuthController';
import '@/styles/main.scss';

// Routes enum for type safety
export enum Routes {
  Login = '/',
  SignUp = '/sign-up',
  Messenger = '/messenger',
  Settings = '/settings',
  Error404 = '/404',
  Error500 = '/500',
}

// Protected routes that require authentication
const protectedRoutes = [Routes.Messenger, Routes.Settings];

// Public routes that redirect to messenger if user is authenticated
const publicRoutes = [Routes.Login, Routes.SignUp];

async function initApp(): Promise<void> {
  const isAuthenticated = await AuthController.checkAuth();
  const currentPath = window.location.pathname as Routes;

  // Инициализация роутера через singleton
  const router = Router.getInstance('#app');

  // Регистрация маршрутов
  router
      .use(Routes.Login, LoginPage)
      .use(Routes.SignUp, SignUpPage)
      .use(Routes.Messenger, MessengerPage)
      .use(Routes.Settings, SettingsPage)
      .use(Routes.Error404, Error404Page)
      .use(Routes.Error500, Error500Page)
      .notFound(Error404Page);

  // Редиректы по аутентификации
  if (isAuthenticated && publicRoutes.includes(currentPath)) {
    router.go(Routes.Messenger);
    return;
  }

  if (!isAuthenticated && protectedRoutes.includes(currentPath)) {
    router.go(Routes.Login);
    return;
  }

  router.start();
}

// SPA-навигация для ссылок с data-link
function setupSpaLinks(): void {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a[data-link]') as HTMLAnchorElement | null;
    if (!link) return;

    event.preventDefault();
    const href = link.getAttribute('href');
    if (href) {
      Router.getInstance().go(href);
    }
  });
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupSpaLinks();
});
