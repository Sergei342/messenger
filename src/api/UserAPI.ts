import { User } from '@core/Store';
import { BaseAPI } from './BaseAPI';

export interface ProfileData {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  [key: string]: unknown;
}

export interface PasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface SearchUserData {
  login: string;
}

class UserAPI extends BaseAPI {
  constructor() {
    super('/user');
  }

  updateProfile(data: ProfileData): Promise<User> {
    return this.http.put<User>('/profile', { data });
  }

  updateAvatar(data: FormData): Promise<User> {
    return this.http.put<User>('/profile/avatar', { data });
  }

  updatePassword(data: PasswordData): Promise<void> {
    // @ts-expect-error: временно игнорируем ошибку типа API
    return this.http.put<void>('/password', { data });
  }

  searchUsers(data: SearchUserData): Promise<User[]> {
    // @ts-expect-error: временно игнорируем ошибку типа API
    return this.http.post<User[]>('/search', { data });
  }
}

export default new UserAPI();
