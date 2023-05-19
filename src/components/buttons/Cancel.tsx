import React from "react";
import { useTheme } from "@nextui-org/react";

type CancelButtonProps = {
	handleCancel: () => void;
};

const CancelButton = ({ handleCancel }: CancelButtonProps) => {
	const { isDark } = useTheme();

	const style = {
		marginBottom: "10px",
		padding: "0.25rem",
		outline: "none",
		borderRadius: "5px",
		border: "none",
		background: isDark ? "#3B3B3B" : "#f1f3f5",
		color: isDark ? "white" : "black",
	};

	return (
		<button style={style} onClick={handleCancel}>
			Cancel
		</button>
	);
};

export default CancelButton;
