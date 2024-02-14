import {client} from "./index" ;
import {MessageEvent, WebSocket} from "ws" ;

export interface ChatProps {
    message: string;
    model?: string;
    web?: boolean;
}

export interface MessageSegment {
    message: string;
    keyword: string;
    quota: number;
    end: boolean;
}

export interface MessageResponse {
    message: string;
    keyword: string;
    quota: number;
}

function getPath(): string {
    const endpoint = client.defaults.baseURL ?? "" ;

    return endpoint
            .replace(/^http/, "ws")
            .replace(/^https/, "wss")
        + "/chat" ;
}

function getToken(): string {
    const token: string = client.defaults.headers.Authorization as string || "" ;
    if (token.length > 0) {
        return token.replace(/^Bearer\s/, "").trim() ;
    }
    return "anonymous" ;
}

export class Chat {
    protected connection?: WebSocket ;
    public id: number ;
    public state: boolean ;
    protected callback?: (data: any) => void ;

    public constructor(id: number = -1) {
        this.state = false ;
        this.id = id ;
        this.init() ;
    }

    public init(): void {
        this.connection = new WebSocket(getPath()) ;
        this.state = false ;
        this.connection.onopen = () => {
            this.state = true ;
            this.send({
                          token: getToken(),
                          id   : this.id,
                      }) ;
        } ;
        this.connection.onclose = () => {
            this.state = false ;
            setTimeout(() => {
                this.init() ;
            }, 3000) ;
        } ;
        this.connection.onmessage = (event: MessageEvent) => {
            if (typeof event.data === "string") {
                const message = JSON.parse(event.data) as MessageSegment ;
                this.callback && this.callback(message) ;
            } else {
                const errorMsg = `TypeError. Expect event.data to be string, but got ${typeof event.data}` ;
                console.error(errorMsg) ;
                throw new Error(errorMsg) ;
            }
        } ;
    }

    public send(data: Record<string, boolean | number | string>): boolean {
        if (!this.state || !this.connection) {
            return false ;
        }
        this.connection.send(JSON.stringify(data)) ;
        return true ;
    }

    public sendWithRetry(data: Record<string, boolean | number | string>): void {
        if (!this.send(data)) {
            setTimeout(() => {
                this.sendWithRetry(data) ;
            }, 500) ;
        }
    }

    public sendRequest(data: ChatProps): void {
        this.sendWithRetry({
                               message: data.message,
                               model  : data.model ?? "gpt-3.5-turbo",
                               web    : data.web ?? false,
                               type   : "chat",
                           }) ;
    }

    public askStream(data: ChatProps, callback: (data: MessageSegment) => void): void {
        this.callback = callback ;
        this.sendRequest(data) ;
    }

    public async ask(data: ChatProps): Promise<MessageResponse> {
        return new Promise((resolve) => {
            const response: MessageResponse = {message: "", keyword: "", quota: 0} ;
            this.askStream(data, (data: MessageSegment) => {
                response.message += data.message ;
                response.quota = data.quota ;
                if (data.keyword.length > 0) response.keyword = data.keyword ;

                if (data.end) resolve(response) ;
            }) ;
        }) ;
    }

    public close(): void {
        if (!this.connection) return ;
        this.connection.close() ;
    }
}
