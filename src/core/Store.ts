import { EventBus } from './EventBus';

export interface User {
    id: number;
    first_name: string;
    second_name: string;
    display_name: string | null;
    login: string;
    email: string;
    phone: string;
    avatar: string | null;
}

export interface Message {
    id: number;
    user_id: number;
    chat_id: number;
    type: string;
    time: string;
    content: string;
    is_read: boolean;
    file?: {
        id: number;
        user_id: number;
        path: string;
        filename: string;
        content_type: string;
        content_size: number;
        upload_date: string;
    };
}

export interface Chat {
    id: number;
    title: string;
    avatar: string | null;
    unread_count: number;
    created_by: number;
    last_message: {
        user: User;
        time: string;
        content: string;
    } | null;
}

export interface StoreState {
    user: User | null;
    chats: Chat[];
    currentChat: number | null;
    messages: Record<number, Message[]>;
    isLoading: boolean;
    error: string | null;
}

export enum StoreEvents {
    Updated = 'updated',
}

class Store extends EventBus {
    private static __instance: Store | null = null;

    private state: StoreState = {
        user: null,
        chats: [],
        currentChat: null,
        messages: {},
        isLoading: false,
        error: null,
    };

    constructor() {
        super();

        if (Store.__instance) {
            return Store.__instance;
        }

        Store.__instance = this;
    }

    public getState(): StoreState {
        return this.state;
    }

    public set(path: string, value: unknown): void {
        const keys = path.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current: any = this.state;

        for (let i = 0; i < keys.length - 1; i += 1) {
            if (!(keys[i] in current)) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
        this.emit(StoreEvents.Updated);
    }

    public setUser(user: User | null): void {
        this.state.user = user;
        this.emit(StoreEvents.Updated);
    }

    public setChats(chats: Chat[]): void {
        this.state.chats = chats;
        this.emit(StoreEvents.Updated);
    }

    public setCurrentChat(chatId: number | null): void {
        this.state.currentChat = chatId;
        this.emit(StoreEvents.Updated);
    }

    public setMessages(chatId: number, messages: Message[]): void {
        this.state.messages[chatId] = messages;
        this.emit(StoreEvents.Updated);
    }

    public addMessage(chatId: number, message: Message): void {
        if (!this.state.messages[chatId]) {
            this.state.messages[chatId] = [];
        }
        this.state.messages[chatId].push(message);
        this.emit(StoreEvents.Updated);
    }

    public setLoading(isLoading: boolean): void {
        this.state.isLoading = isLoading;
        this.emit(StoreEvents.Updated);
    }

    public setError(error: string | null): void {
        this.state.error = error;
        this.emit(StoreEvents.Updated);
    }

    public static getInstance(): Store {
        if (!Store.__instance) {
            Store.__instance = new Store();
        }
        return Store.__instance;
    }
}

export { Store };

