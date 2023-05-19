import React from "react";
import { Grid, Loading } from "@nextui-org/react";

interface LoaderProps {
	style?: React.CSSProperties;
}

const Loader: React.FC<LoaderProps> = ({ style }) => {
	return (
		<Grid
			justify="center"
			alignItems="center"
			css={{ width: "100%", height: "min-content", display: "flex", ...style }}
		>
			<Loading type="points" color="secondary" />
		</Grid>
	);
};

export default Loader;
