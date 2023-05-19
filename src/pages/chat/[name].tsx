import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import { useRealm } from "@/context/RealmProvider";
import { Grid, Text } from "@nextui-org/react";
import { processItem } from "@/helpers/processItem";
import { fetchChats } from "@/helpers/fetchChats";
import useChat, { Chat } from "@/hooks/useChat";
import Head from "next/head";
import styles from "./Chat.module.css";
import InputField from "@/components/input/InputField";
import Sidebar from "@/components/sidebar/Sidebar";
import useWindowWidth from "@/hooks/useWindowWidth";
import Header from "@/components/header/Header";
import useScreenHeight from "@/hooks/useScreenHeight";
import streamMessageTransformer from "@/utils/messageTransformer/streamMessageTransformer";
import StreamedText from "./components/StreamedText";
import GeneratedImage from "./components/GeneratedImage";
import UserTextBlock from "./components/UserTextBlock";
import FormattedText from "./components/FormattedText";
import useResetLoadingOnRouteChange from "@/hooks/usePathnameState";
import {
	copiedState,
	generatedImageState,
	inputMessageState,
	isDoneState,
	isSidebarVisibleState,
	loadingState,
	streamedTextState,
	transcriptionTextState,
	urlPathnameState,
} from "@/state_management/atoms";
import ExcelTable from "@/components/excelTable/ExcelTable";

export type Item = {
	id: string;
	message: string;
	role: string;
};

export default function Page() {
	const windowWidth = useWindowWidth();
	const screenHeight = useScreenHeight();
	const lastChatItemRef = useRef<HTMLDivElement>(null);

	const { app } = useRealm();
	const { query } = useRouter();
	const { name } = query;
	const { chat, setChat } = useChat();
	const [urlPathname, setUrlPathname] = useRecoilState(urlPathnameState);
	const CHAT_KEY = `chat_data_${urlPathname ? urlPathname : name}`;
	const [isSidebarVisible, setIsSidebarVisible] = useRecoilState(isSidebarVisibleState);
	const [loading, setLoading] = useRecoilState(loadingState);
	const [isDone, setIsDone] = useRecoilState(isDoneState);
	const [copied, setCopied] = useRecoilState(copiedState);
	const [streamedText, setStreamedText] = useRecoilState(streamedTextState);
	const [transcriptionText, setTranscriptionText] = useRecoilState(transcriptionTextState);
	const [generatedImage, setGeneratedImage] = useRecoilState(generatedImageState);
	const inputMessage = useRecoilValue(inputMessageState);
	const isLoading = useResetLoadingOnRouteChange({ setLoading, loading });

	const userChat = {
		...chat[chat.length - 1],
		message: inputMessage,
		role: "user",
	};
	const assistantChat = {
		...chat[chat.length - 1],
		message: streamedText || generatedImage || transcriptionText,
		role: "assistant",
	};

	const chatProps = {
		CHAT_KEY: CHAT_KEY,
		setChat: setChat,
		name: name as string,
		app: app,
	};

	useEffect(() => {
		fetchChats(chatProps);
		if (chat.length == 0) {
			fetchChats(chatProps);
		}
	}, [name, isDone]);

	useEffect(() => {
		if (isDone) {
			const updatedChat = [...chat, userChat, assistantChat];
			setChat(updatedChat);
			localStorage.setItem(CHAT_KEY, JSON.stringify(updatedChat)); // Update the chat data in local storage
			setStreamedText("");
			setIsDone(false);
			setGeneratedImage("");
			setTranscriptionText("");
		}
	}, [isDone]);

	useEffect(() => {
		lastChatItemRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chat, streamedText]);

	useEffect(() => {
		if (windowWidth < 1100) {
			setIsSidebarVisible(false);
		} else {
			setIsSidebarVisible(true);
		}
	}, [windowWidth]);

	return (
		<>
			<Head>
				<title>NTELLI</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Grid
				className={styles.chatapp}
				css={{
					background: "$primaryBg",
					height: screenHeight,
				}}
			>
				<Header />
				<Sidebar />
				<div
					className={styles.mainContent}
					style={{
						marginLeft:
							isSidebarVisible && windowWidth > 1300 ? "0px" : isSidebarVisible && windowWidth > 1100 ? "270px" : 0,
					}}
				>
					<div className={styles.chatScreen}>
						{/* Display chat messages */}

						{chat?.map((chatItem: Chat | Item, i: number) => {
							const { item, isImage } = processItem(chatItem);

							if (!item) {
								return (
									<Text className={styles.chatItem} key={i}>
										{chatItem.message}
									</Text>
								);
							}

							if (item.role === "user") {
								if (item.message.startsWith('[["')) return <ExcelTable data={item.message} />;
								return <UserTextBlock item={item} i={i} key={i} />;
							}

							if (item.message.includes("\n")) {
								return <FormattedText item={item} copied={copied} setCopied={setCopied} key={i} />;
							}
							if (isImage) {
								return <GeneratedImage item={item} key={i} />;
							}

							return (
								<Text
									key={i}
									className={styles.chatItem}
									css={{
										padding: "0 1rem",
									}}
								>
									{chatItem.message}
								</Text>
							);
						})}

						{isLoading && streamedText && (
							<StreamedText inputMessage={inputMessage}>
								{streamMessageTransformer(streamedText, styles, copied, setCopied)}
							</StreamedText>
						)}

						<span ref={lastChatItemRef}></span>
					</div>

					<InputField chat={chat} urlPathname={urlPathname} setUrlPathname={setUrlPathname} />
				</div>
			</Grid>
		</>
	);
}
