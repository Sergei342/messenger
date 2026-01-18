import { BaseAPI } from './BaseAPI';
import { User } from '@core/Store';

export interface SignUpData {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
}

export interface SignInData {
    login: string;
    password: string;
}

export interface SignUpResponse {
    id: number;
}

class AuthAPI extends BaseAPI {
    constructor() {
        super('/auth');
    }

    signUp(data: SignUpData): Promise<SignUpResponse> {
        // @ts-ignore
        return this.http.post<SignUpResponse>('/signup', { data });
    }

    signIn(data: SignInData): Promise<void> {
        // @ts-ignore
        return this.http.post<void>('/signin', { data });
    }

    getUser(): Promise<User> {
        return this.http.get<User>('/user');
    }

    logout(): Promise<void> {
        return this.http.post<void>('/logout');
    }
}

export default new AuthAPI();
