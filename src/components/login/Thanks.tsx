import { Grid, Spacer, Text } from "@nextui-org/react";
import Link from "next/link";
import Logo from "../logo/Logo";

const Thanks = () => {
	return (
		<Grid.Container gap={2} justify="center" direction="column" alignContent="center" alignItems="center">
			<Logo />
			<Text
				h1
				size={60}
				css={{
					textGradient: "45deg, $blue600 -20%, $pink600 50%",
					paddingLeft: "0.25rem",
					paddingRight: "0.25rem",
				}}
				weight="bold"
			>
				Thanks for signing up 🎉
			</Text>
			<Text>Please check your email and confirm your sign up.</Text>
			<Spacer y={1} />

			<Spacer y={1} />
			<Link style={{ color: "#0072f5" }} href="/">
				Go to log in page
			</Link>
		</Grid.Container>
	);
};

export default Thanks;
