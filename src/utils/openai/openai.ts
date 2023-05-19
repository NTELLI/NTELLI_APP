import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

export const getConversationTitle = (response: string) => {
	const sentences = response?.split(". ");
	let mainTopic;
	if (sentences) {
		mainTopic = sentences[0].split(" ").slice(0, 6).join(" ");
	}
	return mainTopic;
};

export const chatCompletion = async (key: string, message: string, orgID: string, prevChats?: any) => {
	const configuration = new Configuration({
		organization: orgID,
		apiKey: key,
	});
	const openai = new OpenAIApi(configuration);

	const completion = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: [
			{ role: "system", content: `This is your knowledge of the current chat so far: ${prevChats}` },
			{ role: "user", content: message },
		],
	});
	let title;
	if (completion.data.choices[0].message) {
		title = getConversationTitle(completion.data.choices[0].message.content.toString());
	}
	const response = completion.data.choices[0].message?.content;

	return { title, completion: response };
};

export const generateImage = async (key: string, message: string, orgID: string) => {
	const configuration = new Configuration({
		organization: orgID,
		apiKey: key,
	});
	const openai = new OpenAIApi(configuration);

	const response = await openai.createImage({
		prompt: message,
		n: 1,
		size: "256x256",
		response_format: "b64_json",
	});
	return { response };
};

interface GenerateTranscriptionProps {
	setInputMessage: Dispatch<SetStateAction<string>>;
	setFinalText: Dispatch<SetStateAction<string>>;
	setTranscriptionText: Dispatch<SetStateAction<string>>;
	setIsDone: Dispatch<SetStateAction<boolean>>;
	reset: () => void;
}

export const generateTranscription = (audioFile: any, openai_apiKey: string, props: GenerateTranscriptionProps) => {
	const { setInputMessage, setFinalText, setTranscriptionText, setIsDone, reset } = props;
	const formData = new FormData();
	formData.append("file", audioFile);
	formData.append("model", "whisper-1");

	axios
		.post("https://api.openai.com/v1/audio/transcriptions", formData, {
			headers: {
				"Authorization": `Bearer ${openai_apiKey}`,
				"Content-Type": "multipart/form-data",
			},
		})
		.then(response => {
			setInputMessage("Get Transcription");
			setFinalText(response.data.text);
			setTranscriptionText(response.data.text);
			setIsDone(true);
		})
		.catch(error => {
			console.error(error);
			if (error.response && error.response.status) {
				const statusCode = error.response.status;
				let errorMessage = "";
				switch (statusCode) {
					case 400:
						errorMessage = "Bad request. Please check your input and try again.";
						break;
					default:
						errorMessage = `An error occurred. Status code: ${statusCode}, try again`;
						break;
				}
				alert(errorMessage);
				reset();
			} else {
				alert("An error occurred. Please try again later.");
				reset();
			}
		});
};
