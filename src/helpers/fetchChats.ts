import { Chat } from "@/hooks/useChat";
import { getChat } from "@/utils/mongodb/mongodb";

interface ChatProps {
	CHAT_KEY: string;
	setChat: (messages: Chat[]) => void;
	name: string;
	app: any;
}

export async function fetchChats(props: ChatProps): Promise<void> {
	const { CHAT_KEY, setChat, name, app } = props;
	const cachedChat = localStorage.getItem(CHAT_KEY);

	try {
		if (cachedChat) setChat(JSON.parse(cachedChat));

		if (!cachedChat) {
			const results = await getChat(app, name);
			const messages = results?.[0]?.messages || [];
			setChat(messages);
			localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
		}
	} catch (error) {
		console.error(error);
	}
}
