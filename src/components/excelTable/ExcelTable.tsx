import { useTheme } from "@nextui-org/react";
import styles from "../../pages/chat/Chat.module.css";

function ExcelTable({ data }: { data: string }) {
	const parsedData = JSON.parse(data);
	const { isDark } = useTheme();

	return (
		<ul
			className={styles.chatItem}
			style={{
				padding: "0 1rem",
				marginBottom: "20px",
			}}
		>
			<section style={{ position: "relative", overflowX: "scroll" }}>
				<div style={{ display: "flex", gap: "0.5rem" }}>
					<table style={{ backgroundColor: isDark ? "#3B3B3B" : "#f2f2f2", width: "auto" }} className="tableHtml">
						<thead>
							<tr>
								{parsedData[0].map((cell: string, index: number) => (
									<th key={index}>{cell}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{parsedData.slice(1).map((row: string[], rowIndex: number) => (
								<tr key={rowIndex}>
									{row.map((cell: string, cellIndex: number) => (
										<td key={cellIndex}>{cell}</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</ul>
	);
}

export default ExcelTable;
