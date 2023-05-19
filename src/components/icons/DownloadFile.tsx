import Image from "next/image";
import React from "react";

interface DownloadIconProps {
	height?: number;
	width?: number;
	src: string;
	alt: string;
}

export const DownloadFile = ({ height, width, src, alt }: DownloadIconProps) => {
	return <Image style={{ objectFit: "cover" }} src={`${src}`} alt={alt} width={width || 40} height={height || 40} />;
};
