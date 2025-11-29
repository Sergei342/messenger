import { LoginPage } from '@pages/LoginPage';
import '@/styles/main.scss';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');

  if (!root) {
    throw new Error('Root element not found');
  }

  // Определяем какую страницу загружать по пути
  const path = window.location.pathname;

  let page;

  if (path === '/' || path === '/index.html') {
    page = new LoginPage();
  } else if (path === '/sign-up.html') {
    // TODO: SignUpPage
    root.innerHTML = '<h1>Sign Up Page - Coming Soon</h1>';
    return;
  } else if (path === '/messenger.html') {
    // TODO: MessengerPage
    root.innerHTML = '<h1>Messenger Page - Coming Soon</h1>';
    return;
  } else if (path === '/settings.html') {
    // TODO: SettingsPage
    root.innerHTML = '<h1>Settings Page - Coming Soon</h1>';
    return;
  } else if (path === '/404.html') {
    root.innerHTML = '<h1>404 - Page Not Found</h1>';
    return;
  } else if (path === '/500.html') {
    root.innerHTML = '<h1>500 - Server Error</h1>';
    return;
  }

  if (page) {
    const content = page.getContent();

    if (content) {
      root.appendChild(content);
      page.dispatchComponentDidMount();
    }
  }
});
