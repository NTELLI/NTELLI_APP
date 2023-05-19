require("downloadjs");
import CodeBlock from "@/components/codeBlock/CodeBlock";
import FileBar from "@/components/fileBar/FileBar";
import { Tooltip, useTheme } from "@nextui-org/react";
import { ReactElement } from "react";
import { DownloadFile } from "@/components/icons/DownloadFile";
import { downloadAsImage } from "./download";

interface CopyToClipboard {
	setCopied: (value: boolean) => void;
	element: string;
}

interface TableResponseHandler {
	(item: string, copied: boolean, setCopied: (copy: boolean) => void): JSX.Element;
}

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
