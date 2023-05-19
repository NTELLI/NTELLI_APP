import { Container, Text } from "@nextui-org/react";

export default function GradientText() {
	return (
		<Container css={{ d: "grid", textAlign: "center" }}>
			<Text
				h1
				size={60}
				css={{
					textGradient: "45deg, $blue400 20%, $pink600 50%",
				}}
				weight="bold"
			>
				The Ultimate{" "}
			</Text>
			<Text
				h1
				size={60}
				css={{
					textGradient: "45deg, $blue800 20%, $pink600 50%",
				}}
				weight="bold"
			>
				AI App for Effortless
			</Text>
			<Text
				h1
				size={60}
				css={{
					textGradient: "45deg, $pink400 -20%, $purple800 100%",
				}}
				weight="bold"
			>
				Content Generation{" "}
			</Text>
		</Container>
	);
}
