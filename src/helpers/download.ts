require("downloadjs");
import * as htmlToImage from "html-to-image";
import { generateRandomFilename } from "./randomFileName";
import { utils, write } from "xlsx";
import { save } from "@tauri-apps/api/dialog";
import { writeBinaryFile, BaseDirectory } from "@tauri-apps/api/fs";

interface DownloadAsImageHandler {
	(event: React.MouseEvent<HTMLElement>, nesting?: number): void;
}
interface DownloadExcelHandler {
	(event: React.MouseEvent<HTMLButtonElement>): void;
}

export const downloadAsImage: DownloadAsImageHandler = (event, nesting) => {
	const target = event.currentTarget;
	let element;
	switch (nesting) {
		case 0:
			element = target as HTMLElement;
		case 1:
			element = target.previousElementSibling as HTMLElement;
			break;
		case 2:
			element = target.parentElement?.previousElementSibling as HTMLElement;
			break;
		case 3:
			element = target.parentElement?.previousElementSibling?.previousElementSibling as HTMLElement;
			break;
		default:
			element = target.parentElement?.previousElementSibling as HTMLElement;
	}

	if (element) {
		htmlToImage.toPng(element).then(function (dataUrl) {
			const randomFilename = generateRandomFilename();
			const byteString = atob(dataUrl.split(",")[1]); // convert base64-encoded dataUrl to binary data
			const byteArray = new Uint8Array(byteString.length);
			for (let i = 0; i < byteString.length; i++) {
				byteArray[i] = byteString.charCodeAt(i);
			}
			save({
				filters: [
					{
						name: "Image",
						extensions: ["png"],
					},
				],
				defaultPath: `${randomFilename}.png`,
			}).then(result => {
				if (result !== null) {
					writeBinaryFile({ path: result, contents: byteArray }, { dir: BaseDirectory.AppData });
				}
			});
		});
	}
};

export const downloadExcel: DownloadExcelHandler = async event => {
	const tableElement = event.currentTarget;
	const table = tableElement.parentElement?.previousElementSibling;
	if (table instanceof Element) {
		const worksheet = utils.table_to_sheet(table);
		const workbook = utils.book_new();
		utils.book_append_sheet(workbook, worksheet, "Sheet1");
		const result = await save({
			title: "Save to Spreadsheet",
			filters: [
				{
					name: "Excel",
					extensions: ["xlsx"],
				},
			],
			defaultPath: "table.xlsx",
		});
		if (!result) return;

		const bookType = "xlsx";
		const d = write(workbook, { type: "buffer", bookType });
		await writeBinaryFile(result, d);
	}
};
