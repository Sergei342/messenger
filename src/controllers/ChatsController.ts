import ChatsAPI from '@/api/ChatsAPI';
import { Store, User } from '@core/Store';
import MessagesController from './MessagesController';

interface ErrorResponse {
    reason?: string;
}

class ChatsController {
    private store: Store;

    constructor() {
        this.store = Store.getInstance();
    }

    async fetchChats(): Promise<void> {
        this.store.setLoading(true);
        this.store.setError(null);

        try {
            const chats = await ChatsAPI.getChats();
            this.store.setChats(chats);
        } catch (error: unknown) {
            const errorMessage = (error as ErrorResponse)?.reason || 'Ошибка загрузки чатов';
            this.store.setError(errorMessage);
        } finally {
            this.store.setLoading(false);
        }
    }

    async createChat(title: string): Promise<void> {
        this.store.setLoading(true);
        this.store.setError(null);

        try {
            await ChatsAPI.createChat({ title });
            await this.fetchChats();
        } catch (error: unknown) {
            const errorMessage = (error as ErrorResponse)?.reason || 'Ошибка создания чата';
            this.store.setError(errorMessage);
            throw error;
        } finally {
            this.store.setLoading(false);
        }
    }

    async deleteChat(chatId: number): Promise<void> {
        this.store.setLoading(true);
        this.store.setError(null);

        try {
            await ChatsAPI.deleteChat({ chatId });

            const state = this.store.getState();
            if (state.currentChat === chatId) {
                this.store.setCurrentChat(null);
            }

            await this.fetchChats();
        } catch (error: unknown) {
            const errorMessage = (error as ErrorResponse)?.reason || 'Ошибка удаления чата';
            this.store.setError(errorMessage);
            throw error;
        } finally {
            this.store.setLoading(false);
        }
    }

    async selectChat(chatId: number): Promise<void> {
        this.store.setCurrentChat(chatId);
        await MessagesController.connect(chatId);
        await MessagesController.fetchOldMessages(chatId);
    }

    async getChatUsers(chatId: number): Promise<User[]> {
        try {
            return await ChatsAPI.getChatUsers(chatId);
        } catch (error: unknown) {
            const errorMessage = (error as ErrorResponse)?.reason || 'Ошибка получения пользователей чата';
            this.store.setError(errorMessage);
            return [];
        }
    }

    async addUserToChat(chatId: number, userId: number): Promise<void> {
        this.store.setLoading(true);
        this.store.setError(null);

        try {
            await ChatsAPI.addUsersToChat({ chatId, users: [userId] });
        } catch (error: unknown) {
            const errorMessage = (error as ErrorResponse)?.reason || 'Ошибка добавления пользователя';
            this.store.setError(errorMessage);
            throw error;
        } finally {
            this.store.setLoading(false);
        }
    }

    async removeUserFromChat(chatId: number, userId: number): Promise<void> {
        this.store.setLoading(true);
        this.store.setError(null);

        try {
            await ChatsAPI.deleteUsersFromChat({ chatId, users: [userId] });
        } catch (error: unknown) {
            const errorMessage = (error as ErrorResponse)?.reason || 'Ошибка удаления пользователя';
            this.store.setError(errorMessage);
            throw error;
        } finally {
            this.store.setLoading(false);
        }
    }

    async updateChatAvatar(chatId: number, file: File): Promise<void> {
        this.store.setLoading(true);
        this.store.setError(null);

        try {
            const formData = new FormData();
            formData.append('chatId', String(chatId));
            formData.append('avatar', file);

            await ChatsAPI.updateAvatar(formData);
            await this.fetchChats();
        } catch (error: unknown) {
            const errorMessage = (error as ErrorResponse)?.reason || 'Ошибка обновления аватара чата';
            this.store.setError(errorMessage);
            throw error;
        } finally {
            this.store.setLoading(false);
        }
    }
}

export default new ChatsController();

