import { useState, useEffect } from "react";

const useWindowWidth = () => {
	const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

	useEffect(() => {
		const handleWindowResize = () => {
			setWindowWidth(typeof window !== "undefined" ? window.innerWidth : 0);
		};

		window.addEventListener("resize", handleWindowResize);

		return () => window.removeEventListener("resize", handleWindowResize);
	}, []);

	return windowWidth;
};

export default useWindowWidth;
