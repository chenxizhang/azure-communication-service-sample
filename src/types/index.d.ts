interface ChatMessageItem {
    id: string;
    avatar?: string;
    userid: string;
    username: string;
    date: string;
    body: string;
}

interface CurrentUser {
    id: string;
    username: string;
    avatar: string;
}

interface ThreadInfo {
    threadId: string;
    displayName: string;
    threadClient: import("@azure/communication-chat").ChatThreadClient;
}
