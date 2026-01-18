import UserAPI, { PasswordData, ProfileData } from '@/api/UserAPI';
import { Store, User } from '@core/Store';

interface ErrorResponse {
    reason?: string;
}

class UserController {
    private store: Store;

    constructor() {
        this.store = Store.getInstance();
    }

    async updateProfile(data: ProfileData): Promise<void> {
        this.store.setLoading(true);
        this.store.setError(null);

        try {
            const user = await UserAPI.updateProfile(data);
            this.store.setUser(user);
        } catch (error: unknown) {
            const errorMessage = (error as ErrorResponse)?.reason || 'Ошибка обновления профиля';
            this.store.setError(errorMessage);
            throw error;
        } finally {
            this.store.setLoading(false);
        }
    }

    async updateAvatar(file: File): Promise<void> {
        this.store.setLoading(true);
        this.store.setError(null);

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const user = await UserAPI.updateAvatar(formData);
            this.store.setUser(user);
        } catch (error: unknown) {
            const errorMessage = (error as ErrorResponse)?.reason || 'Ошибка загрузки аватара';
            this.store.setError(errorMessage);
            throw error;
        } finally {
            this.store.setLoading(false);
        }
    }

    async updatePassword(data: PasswordData): Promise<void> {
        this.store.setLoading(true);
        this.store.setError(null);

        try {
            await UserAPI.updatePassword(data);
        } catch (error: unknown) {
            const errorMessage = (error as ErrorResponse)?.reason || 'Ошибка смены пароля';
            this.store.setError(errorMessage);
            throw error;
        } finally {
            this.store.setLoading(false);
        }
    }

    async searchUsers(login: string): Promise<User[]> {
        try {
            const users = await UserAPI.searchUsers({ login });
            return users;
        } catch (error: unknown) {
            const errorMessage = (error as ErrorResponse)?.reason || 'Ошибка поиска пользователей';
            this.store.setError(errorMessage);
            return [];
        }
    }
}

export default new UserController();

