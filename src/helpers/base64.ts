export function isBase64Encoded(str: string): boolean {
	const decoder = new TextDecoder("utf-8");

	try {
		const decoded = decoder.decode(base64ToArrayBuffer(str));
		const fileType = getFileType(str);
		return !!(decoded && fileType && isImageFileType(fileType));
	} catch (e) {
		return false;
	}
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
	const binaryString = Buffer.from(base64, "base64").toString("binary");
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes.buffer;
}

function getFileType(base64: string): string | undefined {
	const buffer = base64ToArrayBuffer(base64);
	const magicBytes = new Uint8Array(buffer, 0, 4);

	if (magicBytes[0] === 0x89 && magicBytes[1] === 0x50 && magicBytes[2] === 0x4e && magicBytes[3] === 0x47) {
		return "image/png";
	} else if (magicBytes[0] === 0xff && magicBytes[1] === 0xd8) {
		return "image/jpeg";
	} else if (magicBytes[0] === 0x47 && magicBytes[1] === 0x49 && magicBytes[2] === 0x46 && magicBytes[3] === 0x38) {
		return "image/gif";
	}

	// Return undefined for any other file types
	return undefined;
}

function isImageFileType(mimeType: string): boolean {
	return mimeType.startsWith("image/");
}
