import React, { useEffect, useRef, useState } from "react";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/vs2015.css";
import styles from "./CodeBlock.module.css";
import { DownloadFile } from "../icons/DownloadFile";
import { Tooltip } from "@nextui-org/react";
import { downloadAsImage } from "@/components/messageHandler/MessageHandlers";

function CodeBlock({ code }: any) {
	const codeRef = useRef<HTMLElement>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (codeRef.current) {
			hljs.highlightElement(codeRef.current);
		}
	}, [code]);

	hljs.configure({
		ignoreUnescapedHTML: true,
	});

	const highlightedCode = hljs.highlightAuto(code).value;

	const handleCopyClick = () => {
		if (codeRef.current) {
			navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => {
				setCopied(false);
			}, 1000);
		}
	};

	return (
		<div className={styles.codeBlock}>
			<button className={styles.copyButton} onClick={handleCopyClick}>
				<Tooltip placement="top" content="Copy Code" color="default">
					{copied ? (
						<DownloadFile width={25} height={25} src="/copycheck.svg" alt="copied content" />
					) : (
						<DownloadFile width={25} height={25} src="/copy.svg" alt="copy content" />
					)}
				</Tooltip>
			</button>
			<code ref={codeRef} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
		</div>
	);
}

export default CodeBlock;
