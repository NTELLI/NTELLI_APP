import Image from "next/image";
import React from "react";
import styles from "../Chat.module.css";
import { Item } from "../[name]";

interface GeneratedImageProps {
	item: Item;
}

const GeneratedImage = ({ item }: GeneratedImageProps) => {
	return (
		<div
			className={styles.chatItem}
			style={{
				marginBottom: "20px",
				marginTop: "20px",
				display: "grid",
			}}
		>
			<Image
				style={{
					boxShadow: "0 12px 20px 6px rgb(104 112 118 / 0.08)",
					borderRadius: "20px",
					margin: "0 auto",
				}}
				loading="lazy"
				blurDataURL={`data:image/png;base64, ${item.message} `}
				src={`data:image/png;base64, ${item.message} `}
				width={256}
				height={256}
				alt="A.I. Generated image"
			/>
		</div>
	);
};

export default GeneratedImage;
