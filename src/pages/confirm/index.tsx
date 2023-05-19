import { useRealm } from "@/context/RealmProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./Confirm.module.css";
import ConfettiExplosion from "react-confetti-explosion";
import Logo from "@/components/logo/Logo";
import { Button } from "@nextui-org/react";

export default function ConfirmationPage() {
	const router = useRouter();
	const { app } = useRealm();
	const { token, tokenId } = router.query;
	const [appToken, setAppToken] = useState("");
	const [appTokenId, setAppTokenId] = useState("");
	const [isExploding, setIsExploding] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const errorMessage =
		"The URL is not valid.\n Reasons:\n1) Link is older than 30 minutes. \n2) URL wasn't opened through the Email. \n3) Missing parameters in the URL.";

	useEffect(() => {
		if (token && tokenId) {
			setAppToken(token?.toString());
			setAppTokenId(tokenId?.toString());
		}
	}, [token, tokenId]);

	async function handleConfirmation() {
		try {
			if (token && tokenId) {
				await app.emailPasswordAuth.confirmUser({ token: appToken, tokenId: appTokenId });
				setIsExploding(true);
				setConfirm(true);
			}
			if (!token && !tokenId) {
				alert(errorMessage);
			}
		} catch (err) {
			console.error("Error confirming user:", err);
			alert(errorMessage);
		}
	}

	const handleRedirect = () => {
		router.push("/");
	};

	return (
		<div className={styles.container}>
			<Logo glow={false} width={330} height={60} />
			<div className={styles.content}>
				{!confirm && (
					<>
						<h1>Confirm Your Email</h1>
						<p>Click the button below to confirm your email address:</p>
						<Button style={{ margin: "0 auto" }} auto color="gradient" ghost shadow onPress={handleConfirmation}>
							Confirm Email
						</Button>
					</>
				)}
				{confirm && (
					<>
						<h1>Your Email has been confirmed 🥳</h1>
						<p>Thank you for signing up!</p>
						<Button style={{ margin: "0 auto" }} auto color="gradient" ghost shadow onPress={handleRedirect}>
							go to web app
						</Button>
					</>
				)}

				{isExploding && (
					<div className={styles.confetti}>
						<ConfettiExplosion
							width={1000}
							duration={3000}
							particleCount={250}
							colors={["#65ccf4", "#085b7b", "#94c4b4", "#a4bc9c"]}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
