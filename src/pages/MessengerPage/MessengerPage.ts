import { Block, BlockProps } from '@core/Block';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Router } from '@core/Router';
import {
  Store, Chat, Message, User,
} from '@core/Store';
import { BASE_URL } from '@/api/BaseAPI';
import ChatsAPI from '@/api/ChatsAPI';
import UserController from '@/controllers/UserController';
import MessagesController from '@/controllers/MessagesController';
import template from './messenger.hbs';

export class MessengerPage extends Block<BlockProps> {
  private store: Store;

  private chatsContainer: HTMLElement | null = null;

  private messagesContainer: HTMLElement | null = null;

  constructor() {
    super({});
    this.store = Store.getInstance();
  }

  protected init(): void {
    const messageInput = new Input({
      name: 'message',
      label: '',
      placeholder: 'Введите сообщение...',
      required: true,
    });

    const sendButton = new Button({
      text: 'Отправить',
      type: 'submit',
      variant: 'primary',
    });

    const createChatInput = new Input({
      name: 'chatTitle',
      label: '',
      placeholder: 'Название нового чата',
      required: true,
    });

    const createChatButton = new Button({
      text: 'Создать чат',
      type: 'button',
      variant: 'secondary',
    });

    const addUserInput = new Input({
      name: 'addUserLogin',
      label: '',
      placeholder: 'Логин пользователя',
      required: true,
    });

    const addUserButton = new Button({
      text: 'Добавить',
      type: 'button',
      variant: 'secondary',
    });

    const removeUserInput = new Input({
      name: 'removeUserLogin',
      label: '',
      placeholder: 'Логин пользователя',
      required: true,
    });

    const removeUserButton = new Button({
      text: 'Удалить',
      type: 'button',
      variant: 'danger',
    });

    const deleteChatButton = new Button({
      text: 'Удалить чат',
      type: 'button',
      variant: 'danger',
    });

    this.children = {
      messageInput,
      sendButton,
      createChatInput,
      createChatButton,
      addUserInput,
      addUserButton,
      removeUserInput,
      removeUserButton,
      deleteChatButton,
    };
  }

  protected componentDidMount(): void {
    // Подписка на обновления Store
    this.store.on('updated', this.handleStoreUpdate.bind(this));

    this.chatsContainer = this.element?.querySelector('.chats') || null;
    this.messagesContainer = this.element?.querySelector('.messages') || null;

    this.fetchChats();

    // Обработчик отправки сообщения
    const messageForm = this.element?.querySelector('.message-form');
    if (messageForm) {
      messageForm.addEventListener('submit', this.handleSendMessage.bind(this));
    }

    // Обработчик создания чата
    const createChatBtn = this.element?.querySelector('.create-chat-section .btn-secondary');
    if (createChatBtn) {
      createChatBtn.addEventListener('click', this.handleCreateChat.bind(this));
    }

    // Обработчик добавления пользователя
    const addUserBtn = this.element?.querySelector('.add-user-section .btn-secondary');
    if (addUserBtn) {
      addUserBtn.addEventListener('click', this.handleAddUser.bind(this));
    }

    // Обработчик удаления пользователя
    const removeUserBtn = this.element?.querySelector('.remove-user-section .btn-danger');
    if (removeUserBtn) {
      removeUserBtn.addEventListener('click', this.handleRemoveUser.bind(this));
    }

    // Обработчик удаления чата
    const deleteChatBtn = this.element?.querySelector('.delete-chat-section .btn-danger');
    if (deleteChatBtn) {
      deleteChatBtn.addEventListener('click', this.handleDeleteChat.bind(this));
    }

    // Обработчик ссылки на настройки
    const settingsLink = this.element?.querySelector('a[data-link]');
    if (settingsLink) {
      settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        const router = Router.getInstance();
        router?.go('/settings');
      });
    }
  }

  private handleStoreUpdate(): void {
    this.renderChats();

    const state = this.store.getState();
    const chatId = state.currentChat;
    if (chatId) {
      const messages = state.messages[chatId] || [];
      this.renderMessages(messages);
    }
  }

  private async fetchChats(): Promise<void> {
    try {
      const chats = await ChatsAPI.getChats();
      this.store.setChats(chats);
    } catch (error) {
      console.error('Не удалось загрузить чаты', error);
    }
  }

  private renderChats(): void {
    const state = this.store.getState();
    const chats = state.chats || [];
    if (!this.chatsContainer) return;

    this.chatsContainer.innerHTML = '';

    if (chats.length === 0) {
      this.chatsContainer.innerHTML = '<div class="no-chats">Нет чатов</div>';
      return;
    }

    chats.forEach((chat: Chat) => {
      const chatItem = document.createElement('div');
      chatItem.className = 'chat-item';
      if (state.currentChat === chat.id) chatItem.classList.add('active');

      const avatarStyle = chat.avatar
        ? `background-image: url(${BASE_URL}/resources${chat.avatar}); background-size: cover;`
        : '';

      const lastMessageText = chat.last_message?.content || 'Нет сообщений';
      const lastMessageTime = chat.last_message?.time
        ? new Date(chat.last_message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';

      chatItem.innerHTML = `
        <div class="avatar" style="${avatarStyle}"></div>
        <div class="chat-info">
          <div class="chat-name">${chat.title}</div>
          <div class="chat-message">${lastMessageText}</div>
        </div>
        <div class="chat-meta">
          <div class="chat-time">${lastMessageTime}</div>
          ${chat.unread_count > 0 ? `<div class="unread-badge">${chat.unread_count}</div>` : ''}
        </div>
      `;

      chatItem.addEventListener('click', async () => {
        await this.selectChat(chat.id);
      });

      this.chatsContainer?.appendChild(chatItem);
    });
  }

  private async selectChat(chatId: number): Promise<void> {
    this.store.setCurrentChat(chatId);

    try {
      await MessagesController.connect(chatId);
    } catch (error) {
      console.error('Не удалось подключиться к чату', error);
    }
  }

  private renderMessages(messages: Message[]): void {
    if (!this.messagesContainer) return;

    this.messagesContainer.innerHTML = '';

    if (messages.length === 0) {
      this.messagesContainer.innerHTML = '<div class="no-messages">Нет сообщений</div>';
      return;
    }

    const userId = this.store.getState().user?.id;

    messages.forEach((msg) => {
      const msgEl = document.createElement('div');
      msgEl.className = `message ${msg.user_id === userId ? 'own' : ''}`;

      const time = new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      msgEl.innerHTML = `
        <div class="message-bubble">${msg.content}</div>
        <div class="message-time">${time}</div>
      `;
      this.messagesContainer?.appendChild(msgEl);
    });

    // Прокрутка вниз
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  private async handleSendMessage(e: Event): Promise<void> {
    e.preventDefault();
    const messageInput = this.children.messageInput as Input;
    const content = messageInput.getValue().trim();
    const chatId = this.store.getState().currentChat;

    if (!chatId) {
      alert('Выберите чат');
      return;
    }

    if (!content) return;

    try {
      await MessagesController.sendMessage(chatId, content);
      messageInput.setValue('');
    } catch (error) {
      console.error('Не удалось отправить сообщение', error);
    }
  }

  private async handleCreateChat(): Promise<void> {
    const input = this.children.createChatInput as Input;
    const title = input.getValue().trim();
    if (!title) {
      alert('Введите название чата');
      return;
    }

    try {
      const { id } = await ChatsAPI.createChat({ title });
      input.setValue('');
      await this.fetchChats();
      await this.selectChat(id);
    } catch (error) {
      console.error('Не удалось создать чат', error);
      alert('Ошибка создания чата');
    }
  }

  private async handleAddUser(): Promise<void> {
    const chatId = this.store.getState().currentChat;
    if (!chatId) {
      alert('Сначала выберите чат');
      return;
    }

    const input = this.children.addUserInput as Input;
    const login = input.getValue().trim();
    if (!login) {
      alert('Введите логин пользователя');
      return;
    }

    try {
      // Поиск пользователя по логину
      const users = await UserController.searchUsers(login);
      if (users.length === 0) {
        alert('Пользователь не найден');
        return;
      }

      const user = users.find((u: User) => u.login === login);
      if (!user) {
        alert('Пользователь с таким логином не найден');
        return;
      }

      await ChatsAPI.addUsersToChat({ chatId, users: [user.id] });
      input.setValue('');
      alert('Пользователь добавлен в чат');
    } catch (error) {
      console.error('Не удалось добавить пользователя', error);
      alert('Ошибка добавления пользователя');
    }
  }

  private async handleRemoveUser(): Promise<void> {
    const chatId = this.store.getState().currentChat;
    if (!chatId) {
      alert('Сначала выберите чат');
      return;
    }

    const input = this.children.removeUserInput as Input;
    const login = input.getValue().trim();
    if (!login) {
      alert('Введите логин пользователя');
      return;
    }

    try {
      // Поиск пользователя по логину
      const users = await UserController.searchUsers(login);
      if (users.length === 0) {
        alert('Пользователь не найден');
        return;
      }

      const user = users.find((u: User) => u.login === login);
      if (!user) {
        alert('Пользователь с таким логином не найден');
        return;
      }

      await ChatsAPI.deleteUsersFromChat({ chatId, users: [user.id] });
      input.setValue('');
      alert('Пользователь удалён из чата');
    } catch (error) {
      console.error('Не удалось удалить пользователя', error);
      alert('Ошибка удаления пользователя');
    }
  }

  private async handleDeleteChat(): Promise<void> {
    const chatId = this.store.getState().currentChat;
    if (!chatId) {
      alert('Сначала выберите чат');
      return;
    }

    if (!confirm('Вы уверены, что хотите удалить этот чат?')) {
      return;
    }

    try {
      await ChatsAPI.deleteChat({ chatId });
      this.store.setCurrentChat(null);
      await this.fetchChats();

      if (this.messagesContainer) {
        this.messagesContainer.innerHTML = '<div class="no-messages">Выберите чат</div>';
      }
    } catch (error) {
      console.error('Не удалось удалить чат', error);
      alert('Ошибка удаления чата');
    }
  }

  protected render(): DocumentFragment {
    return this.compile(template, this.props);
  }
}
