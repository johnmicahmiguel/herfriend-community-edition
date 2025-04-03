// Firebase message thread data
export interface MessageThread {
  threadId?: string;
  otherUserUid: string;
  otherUserName: string;
  otherUserPhoto: string;
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: any; // Firebase timestamp
  updatedAt: any; // Firebase timestamp
}

// Client-friendly version with parsed dates
export interface MessageThreadWithDates {
  threadId: string;
  otherUserUid: string;
  otherUserName: string;
  otherUserPhoto: string;
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: Date;
  updatedAt: Date;
}

// Individual message in a conversation
export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: any; // Firebase timestamp
  read: boolean;
}

// Client-friendly version with parsed date
export interface MessageWithDate extends Omit<Message, "timestamp"> {
  timestamp: Date;
}

// Props for the MessagePanel component
export interface MessagePanelProps {
  open: boolean;
  onClose: () => void;
}

// Props for the ThreadList component
export interface ThreadListProps {
  threads: MessageThreadWithDates[];
  selectedThreadId: string | null;
  onSelectThread: (thread: MessageThreadWithDates) => void;
  isLoading: boolean;
}

// Props for the MessageView component
export interface MessageViewProps {
  selectedThread: MessageThreadWithDates | null;
  currentUserId: string;
  currentUserName: string;
  currentUserPhoto: string;
  onSendMessage: (message: string) => Promise<void>;
  onBack: () => void;
}

// Props for the MessageInput component
export interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
}

// Props for the MessageSearch component
export interface MessageSearchProps {
  onSelectUser: (user: {
    uid: string;
    name: string;
    email: string;
    profilePic: string;
  }) => void;
}

// Props for UserItem in message search results
export interface UserItemProps {
  user: {
    uid: string;
    name: string;
    email: string;
    profilePic: string;
  };
  onSelect: (user: {
    uid: string;
    name: string;
    email: string;
    profilePic: string;
  }) => void;
}

// Chat message type
export type ChatMessage = {
  id: string;
  body: string;
  from: {
    uid: string;
    username: string;
    profilePic: string;
    bio: string;
    badge: string;
    birthday: string;
    border: string;
    coverPhoto: string;
    dateJoined: Date;
    gender: string;
    pinnedMessage: string;
    refId: string;
    role: string;
    status: string;
    title: string;
  };
  messageType: string;
  timestamp: Date;
};

// Update the ChatInput props interface
export type ChatInputProps = {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  disabled?: boolean;
  isLoading?: boolean; // Add this new prop
};
