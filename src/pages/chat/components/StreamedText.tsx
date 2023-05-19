import { Text } from "@nextui-org/react";
import React from "react";
import styles from "../Chat.module.css";

interface StreamedTextProps {
	inputMessage: string;
	children?: React.ReactNode;
}

const StreamedText = ({ inputMessage, children }: StreamedTextProps) => {
	return (
		<div>
			<Text
				blockquote
				className={styles.chatItem}
				style={{
					marginBottom: "20px",
					marginTop: "20px",
				}}
			>
				{inputMessage}
			</Text>
			<div>{children}</div>
		</div>
	);
};

export default StreamedText;
