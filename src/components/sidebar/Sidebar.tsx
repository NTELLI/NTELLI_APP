import { useRealm } from "@/context/RealmProvider";
import { deleteChat } from "@/utils/mongodb/mongodb";
import { Button, Grid, Container, useTheme } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import DarkMode from "../buttons/DarkMode";
import Logout from "../buttons/Logout";
import styles from "./Sidebar.module.css";
import { ObjectID } from "bson";
import { useRouter } from "next/router";
import useWindowWidth from "@/hooks/useWindowWidth";
import SidebarItem from "./SidebarItem";
import * as Realm from "realm-web";
import { fetchchatListItems } from "@/helpers/fetchChatListItem";
import { useRecoilState, useRecoilValue } from "recoil";
import { isDisabledState, isSidebarVisibleState, updateState } from "@/state_management/atoms";
export interface chatListItems {
	title: string;
	url_id: string;
	_id: ObjectID;
}

function Sidebar() {
	const {
		BSON: { ObjectId },
	} = Realm;
	const [isSidebarVisible, setIsSidebarVisible] = useRecoilState(isSidebarVisibleState);
	const isDisabled = useRecoilValue(isDisabledState);
	const update = useRecoilValue(updateState);
	const { query } = useRouter();
	const { name } = query;
	const { app } = useRealm();
	const { isDark } = useTheme();
	const router = useRouter();
	const windowWidth = useWindowWidth();
	const [chatListItems, setChatListItems] = useState<chatListItems[]>([]);
	const desktopWidth = windowWidth >= 1100;
	const urlPath = new ObjectId();
	const chatListItemsProps = {
		setChatListItems: setChatListItems,
		name: name as string,
		app: app,
	};

	useEffect(() => {
		setTimeout(() => {
			fetchchatListItems(chatListItemsProps);
		}, 500);
	}, [update]);

	const deleteItem = useCallback(
		async (itemId: ObjectID, itemUrl: string, name: string) => {
			await deleteChat(app, new ObjectId(itemId));
			const items = localStorage.getItem("chatListItems");
			const itemsArray = items ? JSON.parse(items) : [];

			const filteredItems = itemsArray?.filter(
				(item: { _id: ObjectID; url_id: ObjectID }) => item._id.toString() !== itemId.toString()
			);

			const deletedItem = itemsArray?.find(
				(item: { _id: ObjectID; url_id: ObjectID }) => item._id.toString() == itemId.toString()
			);

			if (itemUrl.toString() == name) {
				router.push(`/chat/${urlPath}`);
			}

			localStorage.setItem("chatListItems", JSON.stringify(filteredItems));
			setChatListItems(filteredItems);
		},
		[app]
	);

	const closeSidebar = useCallback(() => {
		if (!desktopWidth) setIsSidebarVisible(false);
	}, [desktopWidth, setIsSidebarVisible]);

	const handleNewChat = () => {
		router.push(`/chat/${urlPath}`);
		closeSidebar();
	};

	return (
		<Container
			className={styles.container}
			css={{
				background: "$primaryBg",
				boxShadow: isDark ? "0px 10px 15px 10px rgb(255 255 255 / 10%)" : "0px 10px 15px 10px rgb(0 0 0 / 10%)",
				left: isSidebarVisible ? 0 : "-100%",
				opacity: isDisabled ? 0.5 : 1,
			}}
		>
			<Button
				onPress={handleNewChat}
				shadow
				color="gradient"
				ghost
				css={{ margin: "0 auto", marginTop: "10px", marginBottom: "20px" }}
				disabled={isDisabled ? true : false}
			>
				+ New Chat
			</Button>
			<Grid.Container
				gap={0.5}
				css={{
					w: "100%",
				}}
				className={styles.innerGrid}
			>
				<Grid css={{ w: "100%" }} alignContent="center">
					{chatListItems
						.map((item, i) => (
							<SidebarItem
								key={i}
								item={item}
								deleteItem={deleteItem}
								closeSidebar={closeSidebar}
								isDisabled={isDisabled}
							/>
						))
						.reverse()}
				</Grid>
			</Grid.Container>
			<DarkMode />
			<Logout />
		</Container>
	);
}

export default Sidebar;
