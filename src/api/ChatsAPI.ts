import { Chat, User } from '@core/Store';
import { BaseAPI } from './BaseAPI';

export interface CreateChatData {
  title: string;
}

export interface DeleteChatData {
  chatId: number;
}

export interface ChatUsersData {
  users: number[];
  chatId: number;
}

export interface GetChatsParams {
  offset?: number;
  limit?: number;
  title?: string;
}

export interface TokenResponse {
  token: string;
}

class ChatsAPI extends BaseAPI {
  constructor() {
    super('/chats');
  }

  getChats(params?: GetChatsParams): Promise<Chat[]> {
    return this.http.get<Chat[]>('', { data: params as Record<string, unknown> });
  }

  createChat(data: CreateChatData): Promise<{ id: number }> {
    // @ts-expect-error: временно игнорируем ошибку типа API
    return this.http.post<{ id: number }>('', { data });
  }

  deleteChat(data: DeleteChatData): Promise<void> {
    // @ts-expect-error: временно игнорируем ошибку типа API
    return this.http.delete<void>('', { data });
  }

  getChatUsers(chatId: number): Promise<User[]> {
    return this.http.get<User[]>(`/${chatId}/users`);
  }

  addUsersToChat(data: ChatUsersData): Promise<void> {
    // @ts-expect-error: временно игнорируем ошибку типа API
    return this.http.put<void>('/users', { data });
  }

  deleteUsersFromChat(data: ChatUsersData): Promise<void> {
    // @ts-expect-error: временно игнорируем ошибку типа API
    return this.http.delete<void>('/users', { data });
  }

  getToken(chatId: number): Promise<TokenResponse> {
    return this.http.post<TokenResponse>(`/token/${chatId}`);
  }

  updateAvatar(data: FormData): Promise<Chat> {
    return this.http.put<Chat>('/avatar', { data });
  }

  getNewMessagesCount(chatId: number): Promise<{ unread_count: number }> {
    return this.http.get<{ unread_count: number }>(`/new/${chatId}`);
  }
}

export default new ChatsAPI();
