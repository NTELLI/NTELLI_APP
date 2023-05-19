import { Button } from "@nextui-org/react";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import React from "react";
import { UserIcon } from "../icons/UserIcon";

const Logout = () => {
	const handleLogout = () => {
		deleteCookie("user");
	};
	return (
		<Link href="/" style={{ width: "230px", padding: "20px", gridRow: "12/-1", justifySelf: "center" }}>
			<Button icon={<UserIcon fill="currentColor" />} color="error" flat onClick={handleLogout}>
				Log out
			</Button>
		</Link>
	);
};

export default Logout;
