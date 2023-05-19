import { Dispatch, SetStateAction } from "react";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

interface StreamProps {
	apiKey: string;
	inputMessage: string;
	chatHistory: string;
	setStreamedText: Dispatch<SetStateAction<string>>;
	setFinalText: Dispatch<SetStateAction<string>>;
	setIsDone: Dispatch<SetStateAction<boolean>>;
}

const retry = async <T>(fn: () => Promise<T>, retriesLeft = 5, interval = 2000): Promise<T> => {
	try {
		return await fn();
	} catch (error: any) {
		if (error.response.status === 429 && retriesLeft) {
			await new Promise(resolve => setTimeout(resolve, interval));
			return retry(fn, retriesLeft - 1, interval);
		}
		throw error;
	}
};

export const streamObj: { stream?: ReadableStream<Uint8Array> } = {};

export const streamFromOpenAI = async (props: StreamProps): Promise<any> => {
	const { apiKey, inputMessage, chatHistory, setStreamedText, setFinalText, setIsDone } = props;
	setStreamedText("");
	setIsDone(false);
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();
	let counter = 0;
	let fullText = "";

	const payload = {
		model: "gpt-3.5-turbo",
		messages: [
			{ role: "system", content: `This is your knowledge of the current chat so far: ${chatHistory}` },
			{ role: "user", content: inputMessage },
		],
		stream: true,
	};

	const streamFn = async () => {
		const res = await fetch("https://api.openai.com/v1/chat/completions", {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${apiKey ?? ""}`,
			},
			method: "POST",
			body: JSON.stringify(payload),
		});

		let controller: ReadableStreamDefaultController;
		let reader: any;
		let parser: any;

		const stream = new ReadableStream({
			start(_controller) {
				controller = _controller;
				function onParse(event: ParsedEvent | ReconnectInterval) {
					if (event.type === "event") {
						const data = event.data;
						if (data === "[DONE]") {
							controller.close();
							return;
						}
						try {
							const json = JSON.parse(data);
							const text = json.choices[0].delta.content;
							if (text === undefined) {
								return;
							}
							setStreamedText((prev: any) => prev + text);
							fullText += text;
							if (counter < 2 && (text?.match(/\n/) || []).length) {
								return;
							}
							const queue = encoder.encode(text);
							controller.enqueue(queue);
							counter++;
						} catch (e) {
							controller.error(e);
						}
					}
				}

				parser = createParser(onParse);

				if (!res.body) {
					throw new Error("Response body is null");
				}
				reader = res.body.getReader();

				async function read() {
					const { value, done } = await reader.read();
					if (done) {
						setIsDone(true);
						setFinalText(fullText);
					} else {
						const chunkValue = decoder.decode(value);
						parser.feed(chunkValue);
						await read();
					}
				}

				read().catch(e => controller.error(e));
			},
			cancel() {
				reader.cancel();
				parser = null;
				setIsDone(true);
				setFinalText(fullText);
			},
		});

		streamObj.stream = stream;

		return streamObj.stream;
	};

	return retry(streamFn);
};
