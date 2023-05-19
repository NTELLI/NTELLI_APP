import { useState } from "react";

export interface Chat {
	message: string;
	role: string;
	id: string;
}
function useChat() {
	const [chat, setChat] = useState<Chat[]>([]);

	return {
		chat,
		setChat,
	};
}

export default useChat;
