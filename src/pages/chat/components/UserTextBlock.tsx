import { Text } from "@nextui-org/react";
import React from "react";
import styles from "../Chat.module.css";
import { Item } from "../[name]";

interface UserTextBlockProps {
	i: number;
	chatEndRef?: React.RefObject<HTMLDivElement>;
	item: Item;
}

const UserTextBlock = ({ i, chatEndRef, item }: UserTextBlockProps) => {
	return (
		<Text blockquote className={styles.chatItem} key={i} ref={chatEndRef}>
			{item.message}
		</Text>
	);
};

export default UserTextBlock;
