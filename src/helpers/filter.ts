export const filterCompletionMessage = (completion: string) => {
	const blocksOfText = splitText(completion);
	const blocks: string[] = [];
	blocksOfText.forEach((item: string) => {
		const transformedText = removeAILanguageModel(item);
		blocks.push(transformedText);
	});
	return blocks;
};

function splitText(text: string): string[] {
	const blockRegex = /(```[\s\S]*?```)/g;
	const blocks = text.split(blockRegex).filter(block => block.trim() !== "");
	return blocks;
}

const removeAILanguageModel = (text: string): string => {
	return text.replace(/As an AI language model,/g, "");
};
