import { chatListItems } from "@/components/sidebar/Sidebar";
import { getAllChatTitles } from "@/utils/mongodb/mongodb";

interface chatListItemsProps {
	setChatListItems: (messages: chatListItems[]) => void;
	name: string;
	app: any;
}

export async function fetchchatListItems(props: chatListItemsProps): Promise<void> {
	const { name, app, setChatListItems } = props;

	try {
		let results: chatListItems[] = [];

		// Check if cached results exist and are not empty
		const cachedResults = localStorage.getItem("chatListItems");
		const isCached = cachedResults && JSON.parse(cachedResults).length > 0;
		const isPathnameMatched =
			isCached && JSON.parse(cachedResults).some((result: chatListItems) => result.url_id === name);

		if (isPathnameMatched) {
			results = JSON.parse(cachedResults);
		} else {
			// Make API call and store results in local storage
			const chats = await getAllChatTitles(app);
			if (chats != null) results = chats;
			localStorage.setItem("chatListItems", JSON.stringify(results));
		}
		// Set chat list items state
		if (results) {
			setChatListItems(results);
		}
	} catch (error) {
		console.log(error);
	}
}
