import ChatsAPI from '@/api/ChatsAPI';
import { WSTransport, WSTransportEvents, WSMessage } from '@core/WSTransport';
import { Store, Message } from '@core/Store';

class MessagesController {
    private sockets: Map<number, WSTransport> = new Map();

    private store: Store;

    constructor() {
        this.store = Store.getInstance();
    }

    async connect(chatId: number): Promise<void> {
        // Close existing connection for this chat
        if (this.sockets.has(chatId)) {
            this.sockets.get(chatId)!.close();
        }

        const state = this.store.getState();
        const userId = state.user?.id;

        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            const { token } = await ChatsAPI.getToken(chatId);
            const socket = new WSTransport(
                `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`,
            );

            this.sockets.set(chatId, socket);

            await socket.connect();

            this.subscribe(socket, chatId);
        } catch (error) {
            console.error('Failed to connect to chat:', error);
            throw error;
        }
    }

    private subscribe(socket: WSTransport, chatId: number): void {
        socket.on(WSTransportEvents.Message, (data: unknown) => {
            const message = data as WSMessage | WSMessage[];

            if (Array.isArray(message)) {
                // Old messages
                const messages = message.reverse().map((m) => this.transformMessage(m));
                this.store.setMessages(chatId, messages);
            } else if (message.type === 'message' || message.type === 'file') {
                // New message
                this.store.addMessage(chatId, this.transformMessage(message));
            }
        });

        socket.on(WSTransportEvents.Error, (error) => {
            console.error('WebSocket error:', error);
        });

        socket.on(WSTransportEvents.Close, () => {
            this.sockets.delete(chatId);
        });
    }

    private transformMessage(message: WSMessage): Message {
        return {
            id: message.id || 0,
            user_id: message.user_id || 0,
            chat_id: message.chat_id || 0,
            type: message.type || 'message',
            time: message.time || new Date().toISOString(),
            content: message.content || '',
            is_read: message.is_read || false,
            file: message.file,
        };
    }

    async sendMessage(chatId: number, content: string): Promise<void> {
        const socket = this.sockets.get(chatId);

        if (!socket) {
            throw new Error('Socket not connected for chat');
        }

        socket.send({
            type: 'message',
            content,
        });
    }

    async sendFile(chatId: number, resourceId: number): Promise<void> {
        const socket = this.sockets.get(chatId);

        if (!socket) {
            throw new Error('Socket not connected for chat');
        }

        socket.send({
            type: 'file',
            content: String(resourceId),
        });
    }

    async fetchOldMessages(chatId: number, offset: number = 0): Promise<void> {
        const socket = this.sockets.get(chatId);

        if (!socket) {
            throw new Error('Socket not connected for chat');
        }

        socket.send({
            type: 'get old',
            content: String(offset),
        });
    }

    disconnect(chatId: number): void {
        const socket = this.sockets.get(chatId);
        if (socket) {
            socket.close();
            this.sockets.delete(chatId);
        }
    }

    disconnectAll(): void {
        this.sockets.forEach((socket) => {
            socket.close();
        });
        this.sockets.clear();
    }
}

export default new MessagesController();

