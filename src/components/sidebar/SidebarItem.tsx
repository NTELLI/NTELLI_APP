import React from "react";
import { ObjectID } from "bson";
import { Tooltip, Grid } from "@nextui-org/react";
import Link from "next/link";
import TruncateText from "../truncate/Truncate";
import { DeleteIcon } from "../icons/DeleteIcon";
import useWindowWidth from "@/hooks/useWindowWidth";
import { useRouter } from "next/router";

interface ChatListItemProps {
	item: {
		title: string;
		url_id: string;
		_id: ObjectID;
	};
	deleteItem: (itemId: ObjectID, itemUrl: string, name: string) => void;
	closeSidebar: () => void;
	isDisabled: boolean;
}

const SidebarItem = ({ item, deleteItem, closeSidebar, isDisabled }: ChatListItemProps) => {
	const windowWidth = useWindowWidth();
	const mobileWidth = windowWidth <= 560;
	const { query } = useRouter();
	const { name } = query;
	return (
		<Grid
			justify="flex-start"
			alignItems="center"
			css={{ d: "flex", width: "100%" }}
			className={isDisabled ? "isDisabled" : ""}
		>
			<Grid css={{ d: "flex", width: "min-content", paddingRight: "10px", cursor: "pointer" }}>
				<Tooltip
					placement="right"
					content="Delete"
					color="error"
					onClick={() => deleteItem(item._id, item.url_id, name as string)}
				>
					<DeleteIcon size={20} fill="#FF0080" />
				</Tooltip>
			</Grid>
			<Grid css={{ d: "flex", cursor: "pointer", justifyContent: "center", width: "100%" }}>
				<Link href={`/chat/${item.url_id}`} onClick={closeSidebar} style={{ width: "100%" }}>
					<Tooltip placement="topStart" content={item.title} color="default" style={{ width: "100%" }}>
						<TruncateText text={item.title} maxLength={mobileWidth ? 40 : 25} />
					</Tooltip>
				</Link>
			</Grid>
		</Grid>
	);
};

export default SidebarItem;
