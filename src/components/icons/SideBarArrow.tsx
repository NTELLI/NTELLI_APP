import React from "react";
import { ArrowRightCircleIcon, ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { isSidebarVisibleState } from "@/state_management/atoms";

const SideBarArrow = () => {
	const [isSidebarVisible, setIsSidebarVisible] = useRecoilState(isSidebarVisibleState);
	const { pathname } = useRouter();
	const toggleSidebar = () => {
		setIsSidebarVisible(!isSidebarVisible);
	};

	return (
		<div
			onClick={toggleSidebar}
			style={{
				width: "25px",
				height: "25px",
				opacity: pathname == "/chat" ? 0 : 1,
			}}
		>
			{isSidebarVisible && <ArrowLeftCircleIcon />}
			{!isSidebarVisible && <ArrowRightCircleIcon />}
		</div>
	);
};

export default SideBarArrow;
