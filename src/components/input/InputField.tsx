import React, { useEffect, useRef, useState } from "react";
import * as Realm from "realm-web";
import styles from "./InputField.module.css";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useRealm } from "@/context/RealmProvider";
import { addMessagesToChat, getUserData, createChat, getChat } from "@/utils/mongodb/mongodb";
import Loader from "../loader/Loader";
import { useRouter } from "next/router";
import { useTheme } from "@nextui-org/react";
import { generateImage, generateTranscription, getConversationTitle } from "@/utils/openai/openai";
import { EventType, handleKeyDown } from "@/helpers/handlekeyDown";
import { Dispatch, SetStateAction } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { read, utils } from "xlsx";
import {
	audioFileState,
	excelFileState,
	finalTextState,
	generatedImageState,
	inputMessageState,
	isDisabledState,
	isDoneState,
	loadingState,
	streamedTextState,
	transcriptionTextState,
	updateState,
} from "@/state_management/atoms";
import useResetLoadingOnRouteChange from "@/hooks/usePathnameState";
import { isBase64Encoded } from "@/helpers/base64";
import { streamFromOpenAI, streamObj } from "@/utils/openai/streamFromOpenAI";
import CancelButton from "../buttons/Cancel";
interface InputFieldProps {
	setUrlPathname: Dispatch<SetStateAction<any>>;
	chat: ChatMessage[];
	urlPathname: any;
}

interface ChatMessage {
	role: string;
	message: string;
}

function InputField(props: InputFieldProps) {
	const { chat, setUrlPathname, urlPathname } = props;
	const {
		BSON: { ObjectId },
	} = Realm;
	const { app } = useRealm();
	const { query } = useRouter();
	const { name } = query;
	const { type } = useTheme();
	const router = useRouter();
	const [height, setHeight] = useState(60);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [finalText, setFinalText] = useRecoilState(finalTextState);
	const [isDisabled, setIsDisabled] = useRecoilState(isDisabledState);
	const [loading, setLoading] = useRecoilState(loadingState);
	const [isDone, setIsDone] = useRecoilState(isDoneState);
	const [audioFile, setAudioFile] = useRecoilState(audioFileState);
	const [excelFile, setExcelFile] = useRecoilState(excelFileState);
	const setStreamedText = useSetRecoilState(streamedTextState);
	const setTranscriptionText = useSetRecoilState(transcriptionTextState);
	const setGeneratedImage = useSetRecoilState(generatedImageState);
	const [inputMessage, setInputMessage] = useRecoilState(inputMessageState);
	const [update, setUpdate] = useRecoilState(updateState);
	const isLoading = useResetLoadingOnRouteChange({ setLoading, loading });

	// ... code ...

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		const currentTarget = e.currentTarget as HTMLTextAreaElement;
		if (currentTarget) {
			currentTarget.style.transition = "box-shadow 0.3s ease-in-out";
			currentTarget.style.boxShadow = "inset 0 0 10px rgba(0, 128, 0, 0.5)";
			setInputMessage("Drop it like it's hot 🔥");
		}
	};

	const handleDragLeave = (e: React.DragEvent) => {
		const currentTarget = e.currentTarget as HTMLTextAreaElement;
		if (currentTarget) {
			currentTarget.style.boxShadow = "none";
			setInputMessage("");
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		const currentTarget = e.currentTarget as HTMLTextAreaElement;
		if (currentTarget) {
			currentTarget.style.boxShadow = "none";
		}

		function handleSetAudioFile(currVal: any) {
			// Do some validation or processing on the File object here, if needed
			return currVal ? currVal : null;
		}

		function handleSetExcelFile(file: File) {
			const reader = new FileReader();
			reader.onload = event => {
				const contents = event?.target?.result;
				if (contents) {
					const uint8Array = contents instanceof ArrayBuffer ? contents : new TextEncoder().encode(contents).buffer;
					const workbook = read(uint8Array, { type: "array" });
					const firstSheetName = workbook.SheetNames[0];
					const worksheet = workbook.Sheets[firstSheetName];
					const data = utils.sheet_to_json(worksheet, { header: 1 });
					const parsedData = JSON.stringify(data);
					setExcelFile(parsedData);

					// Convert the JavaScript object into a string using JSON.stringify()
					return parsedData;
				}
				return null; // or throw an error, depending on your use case
			};
			reader.readAsArrayBuffer(file);
		}

		const files = e.dataTransfer.files;
		if (files.length > 0) {
			const file = files[0];
			if (
				file.type === "audio/mp3" ||
				file.type === "audio/mp4" ||
				file.type === "audio/mpeg" ||
				file.type === "audio/wav" ||
				file.type === "audio/mpga" ||
				file.type === "audio/m4a" ||
				file.type === "audio/webm"
			) {
				setAudioFile(handleSetAudioFile(file));
				setInputMessage("Audio file uploaded 🎉");
				setIsDisabled(true);
			} else if (
				file.type === "application/vnd.ms-excel" ||
				file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			) {
				handleSetExcelFile(file);
				setInputMessage("Excel file uploaded 🎉");
				setIsDisabled(true);
			} else {
				setInputMessage("Unsupported file type 😞");
			}
		}
	};

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.focus();
		}
	}, [name, loading]);

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInputMessage(event.target.value);
		if (event.target.value.trim() === "") {
			setHeight(60);
		} else {
			setHeight(event.target.scrollHeight);
		}
	};

	const reset = () => {
		setInputMessage("");
		setHeight(60);
		setLoading(false);
		setIsDisabled(false);
		setUrlPathname(undefined);
	};

	useEffect(() => {
		const urlID = urlPathname;

		if (!isDone) {
			return;
		}

		if (!finalText || !urlID) {
			reset();
			return;
		}

		const completion = finalText;

		if (chat.length <= 0) {
			let prompt = inputMessage;
			if (inputMessage.startsWith("#image")) {
				prompt = inputMessage.replace("#image", "");
			}
			const title = getConversationTitle(prompt);
			createChat(app, prompt, completion, title, urlID);
			setUpdate(update + 1);
			router.push(`/chat/${urlID}`);
		} else {
			addMessagesToChat(app, inputMessage, completion, urlID);
		}
		reset();
	}, [finalText, isDone]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setIsDisabled(true);
		const { openai_apiKey, openai_orgID } = await getUserData(app);
		const urlID = name ? new ObjectId(`${name}`) : new ObjectId();
		setUrlPathname(urlID);
		let chatHistory;
		if (chat.length > 0) chatHistory = name ? await getChat(app, urlID) : null;
		const prevChatMessages = chatHistory ? chatHistory[0]?.messages : "";
		let prevMessagesString;

		if (name && chat.length > 0) {
			prevMessagesString = prevChatMessages
				?.filter((msg: ChatMessage) => msg.role === "assistant")
				?.map((msg: ChatMessage) => msg.message)
				?.filter(Boolean)
				?.filter((msg: string) => !isBase64Encoded(msg))
				?.join(" ");
		}

		try {
			if (inputMessage.startsWith("#image")) {
				const filteredInputMessage = inputMessage.replace("#image", "");
				const image = await generateImage(openai_apiKey, filteredInputMessage, openai_orgID);
				const imageSrc = image?.response?.data?.data[0].b64_json;
				if (imageSrc) {
					setGeneratedImage(imageSrc);
					setFinalText(imageSrc);
					setIsDone(true);
				}
			} else if (inputMessage == "Audio file uploaded 🎉") {
				const handleTranscription = () => {
					setInputMessage("Transcribing...");
					generateTranscription(audioFile, openai_apiKey, {
						setFinalText,
						setIsDone,
						reset,
						setInputMessage,
						setTranscriptionText,
					});
				};
				handleTranscription();
			} else if (inputMessage == "Excel file uploaded 🎉") {
				setInputMessage(excelFile);
				streamFromOpenAI({
					apiKey: openai_apiKey,
					inputMessage: excelFile,
					chatHistory: prevMessagesString,
					setStreamedText,
					setFinalText,
					setIsDone,
				});
			} else {
				streamFromOpenAI({
					apiKey: openai_apiKey,
					inputMessage,
					chatHistory: prevMessagesString,
					setStreamedText,
					setFinalText,
					setIsDone,
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleKeyDownEvent = (event: EventType) => handleKeyDown(event, { handleSubmit });
	const cancel = () => {
		if (streamObj && streamObj.stream) {
			streamObj.stream.cancel();
		}
	};
	return (
		<>
			{loading && <CancelButton handleCancel={cancel} />}
			<form
				className={styles.formContainer}
				onSubmit={handleSubmit}
				onKeyDown={handleKeyDownEvent}
				style={{ position: name ? "unset" : "absolute", transform: name ? "unset" : "translate(-50%, 0)" }}
			>
				<div className={styles.textContainer}>
					<textarea
						className={styles.textarea}
						value={inputMessage}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onChange={handleInputChange}
						style={{ height: `${height}px`, minHeight: "60px", paddingRight: "2.4rem" }}
						placeholder="Type your message here..."
						disabled={isDisabled}
						ref={textareaRef}
						autoFocus
					/>
					<button
						type="submit"
						disabled={inputMessage == "Audio file uploaded 🎉" || "Excel file uploaded 🎉" ? false : isDisabled}
						style={{ color: type === "light" ? "black" : "white" }}
					>
						{loading && <Loader />}
						{!loading && <PaperAirplaneIcon />}
					</button>
				</div>
			</form>
		</>
	);
}

export default InputField;
