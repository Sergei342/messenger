import AuthAPI, { SignInData, SignUpData } from '@/api/AuthAPI';
import { Router } from '@core/Router';
import { Store } from '@core/Store';

interface ErrorResponse {
    reason?: string;
}

class AuthController {
    private router: Router | null = null;

    private store: Store;

    constructor() {
        this.store = Store.getInstance();
    }

    private getRouter(): Router {
        if (!this.router) {
            this.router = Router.getInstance();
        }
        return this.router!;
    }

    async signUp(data: SignUpData): Promise<void> {
        this.store.setLoading(true);
        this.store.setError(null);

        try {
            await AuthAPI.signUp(data);
            await this.fetchUser();
            this.getRouter().go('/messenger');
        } catch (error: unknown) {
            const errorMessage = (error as ErrorResponse)?.reason || 'Ошибка регистрации';
            this.store.setError(errorMessage);
            throw error;
        } finally {
            this.store.setLoading(false);
        }
    }

    async signIn(data: SignInData): Promise<void> {
        this.store.setLoading(true);
        this.store.setError(null);

        try {
            await AuthAPI.signIn(data);
            await this.fetchUser();
            this.getRouter().go('/messenger');
        } catch (error: unknown) {
            const errorMessage = (error as ErrorResponse)?.reason || 'Ошибка авторизации';
            this.store.setError(errorMessage);
            throw error;
        } finally {
            this.store.setLoading(false);
        }
    }

    async fetchUser(): Promise<void> {
        try {
            const user = await AuthAPI.getUser();
            this.store.setUser(user);
        } catch {
            this.store.setUser(null);
        }
    }

    async logout(): Promise<void> {
        try {
            await AuthAPI.logout();
            this.store.setUser(null);
            this.store.setChats([]);
            this.store.setCurrentChat(null);
            this.getRouter().go('/');
        } catch (error: unknown) {
            const errorMessage = (error as ErrorResponse)?.reason || 'Ошибка выхода';
            this.store.setError(errorMessage);
        }
    }

    async checkAuth(): Promise<boolean> {
        try {
            const user = await AuthAPI.getUser();
            this.store.setUser(user);
            return true;
        } catch {
            this.store.setUser(null);
            return false;
        }
    }
}

export default new AuthController();

