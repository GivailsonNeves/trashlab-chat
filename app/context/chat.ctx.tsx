import { Chat, Message, User } from "@/models";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import firestore from "@react-native-firebase/firestore";

type MessageByKeyType = { [key: string]: Message[] };

type ChatContextType = {
  messagesByKey: MessageByKeyType;
  chats: Chat[];
  sendMessage: (chatId: string, message: Message) => void;
  markAsFavorite: (
    chatId: string,
    messageId: string,
    newState: boolean
  ) => void;
};

export const ChatContext = createContext<ChatContextType>({
  messagesByKey: {},
  chats: [],
  sendMessage: () => {},
  markAsFavorite: () => {},
});

export function useChatContext() {
  const ctx = useContext(ChatContext);

  if (!ctx) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }

  return ctx;
}

type Props = PropsWithChildren<{
  userId: string;
}>;

export function ChatProvider({ children, userId }: Props) {
  const [messagesByKey, setMessagesByKey] = useState<MessageByKeyType>({});
  const [chats, setChats] = useState<Chat[]>([]);

  const sendMessage = (chatId: string, message: Message) => {};

  const markAsFavorite = (
    chatId: string,
    messageId: string,
    newState: boolean
  ) => {};

  useEffect(() => {
    const subscriber = firestore()
      .collection("chats")
      .where("participants", "array-contains", userId)
      .onSnapshot((querySnapshot) => {
        const _chats: Chat[] = [];

        querySnapshot.forEach((documentSnapshot) => {
          _chats.push({
            participants: documentSnapshot.data().participants,
            id: documentSnapshot.id,
            participantId: documentSnapshot
              .data()
              .participants.find((p: string) => p !== userId),
          });
        });

        setChats(_chats);
      });

    return () => subscriber();
  }, [userId]);

  useEffect(() => {
    async function loadData() {
      const _messages: MessageByKeyType = {};
      for (const chat of chats) {
        const messages = await firestore()
          .collection(`chats/${chat.id}/messages`)
          .orderBy("createdAt", "desc")
          .get();
        const _messagesByChat: Message[] = [];
        messages.forEach((message) => {
          _messagesByChat.push({
            id: message.id,
            ...message.data(),
            isSender: message.data().senderId === userId,
          } as Message);
        });
        _messages[chat.id] = _messagesByChat;
      }
      setMessagesByKey(_messages);
    }
    loadData().catch(console.error);
  }, [chats]);

  return (
    <ChatContext.Provider
      value={{ messagesByKey, chats, sendMessage, markAsFavorite }}
    >
      {children}
    </ChatContext.Provider>
  );
}