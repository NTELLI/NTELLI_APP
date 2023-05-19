import { useRealm } from "@/context/RealmProvider";
import { updateTitle } from "@/utils/mongodb/mongodb";
import { Input } from "@nextui-org/react";
import React, { useMemo, useState } from "react";

const TruncateText = (props: { text: string | undefined; maxLength: number }) => {
	const { app } = useRealm();
	const { text, maxLength } = props;
	const [titleText, setTitleText] = useState("");

	let truncatedText = "";
	if (text) {
		truncatedText = text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
	}
	useMemo(() => setTitleText(truncatedText), [truncatedText]);

	const titleSetter = (event: React.ChangeEvent<any>) => {
		setTitleText(event.target.value);
	};

	const handleKeyDown = (event: any) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			if (text && titleText) {
				if (text != titleText) updateTitle(app, text, titleText);
			}
		}
	};

	const handleBlur = () => {
		if (text && titleText) {
			if (text != titleText) updateTitle(app, text, titleText);
		}
	};
	return (
		<Input
			clearable
			aria-label="chat title"
			labelPlaceholder=""
			initialValue={truncatedText}
			value={titleText}
			onChange={titleSetter}
			onKeyDown={handleKeyDown}
			onBlur={handleBlur}
			css={{
				display: "block",
				textOverflow: "ellipsis",
				overflow: "hidden",
				whiteSpace: "nowrap",
				width: "100%",
			}}
		/>
	);
};

export default TruncateText;
