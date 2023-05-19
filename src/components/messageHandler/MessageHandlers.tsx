require("downloadjs");
import CodeBlock from "@/components/codeBlock/CodeBlock";
import * as htmlToImage from "html-to-image";
import { generateRandomFilename } from "../../helpers/randomFileName";
import { utils, write } from "xlsx";
import FileBar from "@/components/fileBar/FileBar";
import { Tooltip, useTheme } from "@nextui-org/react";
import { ReactElement } from "react";
import { save } from "@tauri-apps/api/dialog";
import { writeBinaryFile, BaseDirectory } from "@tauri-apps/api/fs";
import { DownloadFile } from "@/components/icons/DownloadFile";

interface CopyToClipboard {
	setCopied: (value: boolean) => void;
	element: string;
}

interface TableResponseHandler {
	(item: string, copied: boolean, setCopied: (copy: boolean) => void): JSX.Element;
}

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

export function copyToClipboard({ setCopied, element }: CopyToClipboard) {
	navigator.clipboard.writeText(element);
	setCopied(true);
	setTimeout(() => {
		setCopied(false);
	}, 1000);
}

export const HandleTableResponse: TableResponseHandler = (item, copied, setCopied) => {
	const { isDark } = useTheme();

	const [paragraph, tableString, subParagraph] = item.split("\n\n");
	const rows = tableString.trim().split("\n");
	const headers = rows
		?.shift()
		?.trim()
		.slice(2, -1)
		.split("|")
		.map((h: string) => h.trim());

	const tableBody = rows
		.map((row: string) => {
			const cells = row
				.trim()
				.slice(1, -1)
				.split("|")
				.map((c: string) => c.trim())
				.filter((c: string) => !/^[-]+$/.test(c));
			return `<tr>${cells.map((cell: string) => `<td>${cell}</td>`).join("")}</tr>`;
		})
		.join("");

	const tableHtml = `<table><thead><tr>${headers
		?.map((header: string) => `<th>${header}</th>`)
		.join("")}</tr></thead><tbody>${tableBody}</tbody></table>`;

	const handleCopyTableClick = () => {
		copyToClipboard({ setCopied, element: tableHtml });
	};

	return (
		<section style={{ position: "relative" }}>
			<p style={{ marginBottom: "10px" }}>{paragraph}</p>
			<div style={{ display: "flex", gap: "0.5rem", marginBottom: "10px" }}>
				<table
					style={{ backgroundColor: isDark ? "#3B3B3B" : "#f2f2f2" }}
					className="tableHtml"
					dangerouslySetInnerHTML={{
						__html: tableHtml,
					}}
				/>

				<FileBar handleCopy={handleCopyTableClick} copied={copied} />
			</div>

			{subParagraph && (
				<p>
					<i>* {subParagraph}</i>
				</p>
			)}
		</section>
	);
};

export function HandleNumberedList(item: string) {
	const listItems = item
		.split("\n")
		.map((line: string) => (/^\s*\d+\.\s+\w+/.test(line) ? line : line.trim().replace(/^\d+\.\s+/, "")))
		.map((item: string, index: number) => <li key={index}>{item}</li>);
	return <>{listItems}</>;
}

export function HandleNonNumberedList(item: string) {
	const rows = item.split("\n");
	const listItems = rows.map((row: string, index: number) => {
		const text = row.trim().slice(0); // remove bullet point
		return <li key={index}>{text}</li>;
	});
	return <>{listItems}</>;
}

export const HandleCodeBlock = (isCodeBlock: any, index: number): ReactElement | undefined => {
	const handleDownloadAsImage = (event: React.MouseEvent<HTMLButtonElement>) => downloadAsImage(event, 1);

	let code;
	if (!isCodeBlock) return;
	code = isCodeBlock[1];

	return (
		<li key={index} style={{ position: "relative" }}>
			<CodeBlock code={code} />
			<button
				className="downloadAs"
				onClick={handleDownloadAsImage}
				style={{ position: "absolute", right: "10px", bottom: 0 }}
			>
				<Tooltip placement="top" content="Download image" color="default">
					<DownloadFile src="/download.svg" alt="download as image" width={25} height={25} />
				</Tooltip>
			</button>
		</li>
	);
};
