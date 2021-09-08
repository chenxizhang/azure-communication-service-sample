/// <reference types="react-scripts" />

import { ChatThreadClient } from "@azure/communication-chat";

declare interface ChatMessageItem {
    id: string;
    avatar?: string;
    userid: string;
    username: string;
    date: string;
    body: string;
}

declare interface CurrentUser {
    id: string;
    username: string;
    avatar: string;
}

declare interface ThreadInfo {
    threadId: string;
    displayName: string;
    threadClient: ChatThreadClient;
}
