import { EventBus } from './EventBus';

export enum WSTransportEvents {
  Connected = 'connected',
  Error = 'error',
  Message = 'message',
  Close = 'close',
}

export interface WSMessage {
  type: string;
  content?: string;
  time?: string;
  user_id?: number;
  id?: number;
  chat_id?: number;
  is_read?: boolean;
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

class WSTransport extends EventBus {
  private socket: WebSocket | null = null;

  private pingInterval: ReturnType<typeof setInterval> | null = null;

  private url: string;

  constructor(url: string) {
    super();
    this.url = url;
  }

  public connect(): Promise<void> {
    this.socket = new WebSocket(this.url);

    this.subscribe();
    this.setupPing();

    return new Promise((resolve, reject) => {
      this.on(WSTransportEvents.Error, reject);
      this.on(WSTransportEvents.Connected, () => {
        this.off(WSTransportEvents.Error, reject);
        resolve();
      });
    });
  }

  public send(data: string | Record<string, unknown>): void {
    if (!this.socket) {
      throw new Error('Socket is not connected');
    }

    const message = typeof data === 'string' ? data : JSON.stringify(data);
    this.socket.send(message);
  }

  public close(): void {
    this.socket?.close();
    this.clearPing();
  }

  private subscribe(): void {
    this.socket!.addEventListener('open', () => {
      this.emit(WSTransportEvents.Connected);
    });

    this.socket!.addEventListener('close', () => {
      this.emit(WSTransportEvents.Close);
      this.clearPing();
    });

    this.socket!.addEventListener('error', (e) => {
      this.emit(WSTransportEvents.Error, e);
    });

    this.socket!.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'pong') {
          return;
        }

        this.emit(WSTransportEvents.Message, data);
      } catch {
        console.error('Failed to parse message:', event.data);
      }
    });
  }

  private setupPing(): void {
    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000);
  }

  private clearPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}

export { WSTransport };
