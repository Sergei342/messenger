import { Router } from '@core/Router';
import { LoginPage } from '@pages/LoginPage';
import { SignUpPage } from '@pages/SignUpPage';
import { MessengerPage } from '@pages/MessengerPage';
import { SettingsPage } from '@pages/SettingPage';
import { Error404Page } from '@pages/Error404Page';
import { Error500Page } from '@pages/Error500Page';
// eslint-disable-next-line import/extensions
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

// Public routes that should redirect to messenger if user is authenticated
const publicRoutes = [Routes.Login, Routes.SignUp];

async function initApp(): Promise<void> {
  // Check authentication status
  const isAuthenticated = await AuthController.checkAuth();
  const currentPath = window.location.pathname as Routes;

  // Initialize router через singleton
  const router = Router.getInstance('#app'); // <--- используем getInstance

  // Register routes
  router
      .use(Routes.Login, LoginPage)
      .use(Routes.SignUp, SignUpPage)
      .use(Routes.Messenger, MessengerPage)
      .use(Routes.Settings, SettingsPage)
      .use(Routes.Error404, Error404Page)
      .use(Routes.Error500, Error500Page)
      .notFound(Error404Page);

  // Handle authentication redirects
  if (isAuthenticated && publicRoutes.includes(currentPath)) {
    router.go(Routes.Messenger);
  } else if (!isAuthenticated && protectedRoutes.includes(currentPath)) {
    router.go(Routes.Login);
  } else {
    router.start();
  }
}


// Start the app
document.addEventListener('DOMContentLoaded', initApp);
