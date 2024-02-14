export interface Message {
    role: string;
    message: string;
}

export interface Conversation {
    id: string;
    name: string;
    message?: Message[];
}

export interface Package {
    cert: boolean;
    teenager: boolean;
}

export interface Subscription {
    status: boolean;
    is_subscribed: boolean;
    expired: number;
}
