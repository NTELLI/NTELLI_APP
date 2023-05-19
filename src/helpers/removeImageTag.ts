export function removeImageTag(message: string) {
	return message.startsWith("#image") ? message.replace("#image", "") : message;
}
