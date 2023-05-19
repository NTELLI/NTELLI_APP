import { Item } from "@/pages/chat/[name]";
import { isBase64Encoded } from "./base64";
import { removeImageTag } from "./removeImageTag";

export function processItem(item: Item) {
	let isImage = false;
	isArray(item);
	isImage = image(item, isImage);
	isImage = imageArray(item, isImage);

	return { item, isImage };
}

function imageArray(item: Item, isImage: boolean) {
	if ((item?.message[0] as string)?.startsWith("#image" || "image")) {
		isImage = isBase64Encoded(item?.message[0] as string);
		item.message = removeImageTag(item.message?.[0] as string);
	}
	return isImage;
}

function image(item: Item, isImage: boolean) {
	if (typeof item.message === "string") {
		isImage = isBase64Encoded(item.message);
		item.message = removeImageTag(item.message);
	}
	return isImage;
}

function isArray(item: Item) {
	if (Array.isArray(item.message)) {
		if (item.message.every(message => typeof message === "string")) {
			item.message = item.message.join("");
			item.message = removeImageTag(item.message);
		}
	}
}
