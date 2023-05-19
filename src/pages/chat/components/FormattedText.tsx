import {
	HandleCodeBlock,
	HandleNonNumberedList,
	HandleNumberedList,
	HandleTableResponse,
} from "@/helpers/MessageHandlers";
import React from "react";
import styles from "../Chat.module.css";
import { Item } from "../[name]";

interface FormattedTextProps {
	item: Item;
	copied: boolean;
	setCopied: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormattedText = ({ item, copied, setCopied }: FormattedTextProps) => {
	const blockRegex = /(```[\s\S]*?```)/g;
	const responseArray = (item.message as string).split(blockRegex).slice(0);
	const listItems = responseArray.map((item: string, index: number) => {
		const isTableResponse = /^\|.+?\|.+?\|$/gm.test(item);
		const isCodeBlock = item.match(/^```([\s\S]*?)```$/);
		const isNumberedList = /^\s*\d+\.\s+\w+/m.test(item);
		const isNonNumberedList = item.includes("-") || item.includes("*");

		if (isCodeBlock) return HandleCodeBlock(isCodeBlock, index);
		if (isTableResponse) return HandleTableResponse(item, copied, setCopied);
		if (isNumberedList) return HandleNumberedList(item);
		if (isNonNumberedList) return HandleNonNumberedList(item);

		return <li key={index}>{item}</li>;
	});

	return (
		<ul
			className={styles.chatItem}
			style={{
				padding: "0 1rem",
			}}
		>
			{listItems}
		</ul>
	);
};

export default FormattedText;
