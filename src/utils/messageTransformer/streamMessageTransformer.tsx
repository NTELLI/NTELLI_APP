import { Text } from "@nextui-org/react";
import {
	HandleCodeBlock,
	HandleNonNumberedList,
	HandleNumberedList,
	HandleTableResponse,
} from "../../helpers/MessageHandlers";

interface StreamMessageTransformer {
	(message: string, styles: any, copied: boolean, setCopied: (copy: boolean) => void): JSX.Element;
}

export const streamMessageTransformer: StreamMessageTransformer = (message, styles, copied, setCopied) => {
	if (message.includes("\n")) {
		const blockRegex = /(```[\s\S]*?```)/g;
		const responseArray = message.split(blockRegex).slice(0);
		const listItems = responseArray.map((item: string, index: number) => {
			const isTableResponse = /^\|.+?\|.+?\|$/gm.test(item);
			const isCodeBlock = item.match(/^```([\s\S]*?)```$/);
			const isNumberedList = /^\s*\d+\.\s+\w+/m.test(item);
			const isNonNumberedList = item.includes("-") || item.includes("*");
			if (isCodeBlock) {
				return HandleCodeBlock(isCodeBlock, index);
			} else if (isTableResponse) {
				return HandleTableResponse(item, copied, setCopied);
			} else if (isNumberedList) {
				return HandleNumberedList(item);
			} else if (isNonNumberedList) {
				return HandleNonNumberedList(item);
			} else {
				return <li key={index}>{item}</li>;
			}
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
	}

	return (
		<Text className={styles.chatItem} style={{ marginBottom: "20px", marginTop: "20px" }}>
			{message}
		</Text>
	);
};

export default streamMessageTransformer;
