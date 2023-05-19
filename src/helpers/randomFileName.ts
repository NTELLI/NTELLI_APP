export function generateRandomFilename() {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let filename = "";

	for (let i = 0; i < 10; i++) {
		filename += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return filename;
}
