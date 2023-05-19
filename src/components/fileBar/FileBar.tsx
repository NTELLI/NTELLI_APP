import { downloadAsImage, downloadExcel } from "@/helpers/download";
import { Tooltip } from "@nextui-org/react";
import React from "react";
import { DownloadFile } from "../icons/DownloadFile";

const FileBar = ({ handleCopy, copied }: any) => {
	return (
		<aside>
			<button className="downloadAs" onClick={downloadAsImage}>
				<Tooltip placement="topStart" content="Download image" color="default">
					<DownloadFile src="/png.svg" alt="download as image" />
				</Tooltip>
			</button>

			<button className="downloadAs" onClick={downloadExcel}>
				<Tooltip placement="topStart" content="Download Excel" color="default">
					<DownloadFile src="/excel.svg" alt="download as excel file" />
				</Tooltip>
			</button>
			<button className="downloadAs" onClick={handleCopy}>
				<Tooltip placement="topStart" content="Copy HTML" color="default">
					{copied ? (
						<DownloadFile src="/copycheck.svg" alt="copied content" />
					) : (
						<DownloadFile src="/copy.svg" alt="copy content" />
					)}
				</Tooltip>
			</button>
		</aside>
	);
};

export default FileBar;
