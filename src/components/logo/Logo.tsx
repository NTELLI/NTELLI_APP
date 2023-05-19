import { Grid } from "@nextui-org/react";
import Image from "next/image";
import React from "react";

interface LogoProps {
	glow?: boolean;
	width?: number;
	height?: number;
}

const Logo = ({ glow, width, height }: LogoProps) => {
	return (
		<Grid
			css={{
				alignContent: "center",
				justifyContent: "center",
				display: "grid",
			}}
		>
			<Image src={glow ? "/ntelli-glow.svg" : "/ntelli.svg"} alt="Logo" width={width || 300} height={height || 30} />
		</Grid>
	);
};

export default Logo;
