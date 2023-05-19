import Head from "next/head";
import styles from "@/styles/Home.module.css";
import EmailLogin from "@/components/login/EmailLogin";
import { Grid } from "@nextui-org/react";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useEffect } from "react";
import useScreenHeight from "@/hooks/useScreenHeight";
import * as Realm from "realm-web";

export default function Home() {
	const router = useRouter();
	const user = getCookie("user");
	const screenHeight = useScreenHeight();
	const {
		BSON: { ObjectId },
	} = Realm;
	const newObjectId = new ObjectId();

	useEffect(() => {
		if (!user) {
			router.push("/");
		}
		if (user) {
			router.push(`/chat/${newObjectId}`);
		}
	}, [user]);

	return (
		<>
			<Head>
				<title>NTELLI</title>
				<meta name="description" content="NTELLI A.I. CHAT APP" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{!user && (
				<Grid className={styles.login} css={{ background: "$primaryBg", height: screenHeight }}>
					<EmailLogin />
				</Grid>
			)}
		</>
	);
}
