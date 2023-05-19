import { RealmProvider } from "@/context/RealmProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { useSSR } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { RecoilRoot } from "recoil";

const lightTheme = createTheme({
	type: "light",
	theme: {
		colors: {
			primaryBg: "#fff",
			primaryColor: "#000",
		},
	},
});

const darkTheme = createTheme({
	type: "dark",
	theme: {
		colors: {
			primaryBg: "#031927",
			primaryColor: "#fff",
		},
	},
});

export default function App({ Component, pageProps }: AppProps) {
	const { isBrowser } = useSSR();

	return (
		<RealmProvider>
			<RecoilRoot>
				{isBrowser && (
					<NextThemesProvider
						defaultTheme="system"
						attribute="class"
						value={{
							light: lightTheme.className,
							dark: darkTheme.className,
						}}
					>
						<NextUIProvider>
							<Component {...pageProps} />
						</NextUIProvider>
					</NextThemesProvider>
				)}
			</RecoilRoot>
		</RealmProvider>
	);
}
