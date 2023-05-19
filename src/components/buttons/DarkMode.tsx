import { useTheme as useNextTheme } from "next-themes";
import { Switch, useTheme } from "@nextui-org/react";

const DarkMode = () => {
	const { setTheme } = useNextTheme();
	const { isDark, type } = useTheme();

	return (
		<div
			style={{
				gridRow: "11/12",
				display: "flex",
				alignSelf: "center",
				gap: "1rem",
				justifyContent: "center",
				textTransform: "capitalize",
			}}
		>
			<p>{type} mode: </p>
			<Switch checked={isDark} onChange={e => setTheme(e.target.checked ? "dark" : "light")} />
		</div>
	);
};

export default DarkMode;
