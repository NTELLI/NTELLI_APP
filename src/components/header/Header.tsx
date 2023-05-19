import { Grid } from "@nextui-org/react";
import React from "react";
import SideBarArrow from "../icons/SideBarArrow";
import Logo from "../logo/Logo";
import ModalApiKey from "../modal/ModalApiKey";
import styles from "./Header.module.css";
const Header = () => {
	return (
		<Grid
			className={styles.header}
			css={{
				backgroundColor: "$primaryBg",
			}}
		>
			<SideBarArrow />
			<div>
				<Logo glow={false} width={130} />
			</div>
			<ModalApiKey />
		</Grid>
	);
};

export default Header;
