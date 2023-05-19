import { useRealm } from "@/context/RealmProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./Reset.module.css";
import ConfettiExplosion from "react-confetti-explosion";
import Logo from "@/components/logo/Logo";
import { Button, Input } from "@nextui-org/react";

export default function ConfirmationPage() {
	const router = useRouter();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { token, tokenId } = router.query;
	const { app } = useRealm();
	const [appToken, setAppToken] = useState("");
	const [appTokenId, setAppTokenId] = useState("");
	const [isExploding, setIsExploding] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const [isPasswordValid, setIsPasswordValid] = useState(false);
	const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
	const [target, setTarget] = useState<string | undefined>();
	const [passwordLength, setPasswordLength] = useState(0);
	const [confirmPasswordLength, setConfirmPasswordLength] = useState(0);

	const errorMessage =
		"The URL is not valid.\n Reasons:\n1) Link is older than 30 minutes. \n2) URL wasn't opened through the Email. \n3) Missing parameters in the URL.";

	useEffect(() => {
		if (token && tokenId) {
			setAppToken(token?.toString());
			setAppTokenId(tokenId?.toString());
		}
	}, [token, tokenId]);

	const handleResetPassword = async (event: any) => {
		event.preventDefault();
		if (password !== confirmPassword) {
			alert("Passwords do not match.");
			return;
		}
		try {
			await app.emailPasswordAuth.resetPassword({ password, token: appToken, tokenId: appTokenId });
			setIsExploding(true);
			setConfirm(true);
		} catch (err) {
			console.error("Error resetting password:", err);
			alert(errorMessage);
		}
	};

	const handleRedirect = () => {
		router.push("/");
	};

	const validatePassword = (password: string): boolean => {
		const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
		const state = regex.test(String(password).toLowerCase());
		if (target == "new") {
			setIsPasswordValid(state);
			setPasswordLength(password.length);
		}
		if (target == "confirm") {
			setIsConfirmPasswordValid(state);
			setConfirmPasswordLength(password.length);
		}
		return regex.test(password);
	};

	return (
		<div className={styles.container}>
			<Logo glow={false} width={330} height={60} />
			<div className={styles.content}>
				{!confirm && (
					<>
						<h1>Reset Password</h1>
						<form className={styles.resetForm} onSubmit={handleResetPassword}>
							<div className={styles.inputField}>
								<Input.Password
									shadow
									size="lg"
									labelPlaceholder="New Password"
									status={!isPasswordValid && passwordLength >= 6 ? "error" : "default"}
									helperColor={!isPasswordValid && passwordLength >= 6 ? "error" : "success"}
									helperText={
										!isPasswordValid && passwordLength >= 6 ? "Contain 6+ characters of letters and numbers" : ""
									}
									initialValue={password}
									value={password}
									data-btn-id="new"
									onChange={e => {
										setPassword(e.target.value);
										validatePassword(e.target.value);
									}}
									onFocus={e => setTarget(e.target.dataset.btnId)}
								/>
							</div>
							<div className={styles.inputField}>
								<Input.Password
									shadow
									size="lg"
									labelPlaceholder="Confirm Password"
									status={!isConfirmPasswordValid && confirmPasswordLength >= 6 ? "error" : "default"}
									helperColor={!isConfirmPasswordValid && confirmPasswordLength >= 6 ? "error" : "success"}
									helperText={
										!isConfirmPasswordValid && confirmPasswordLength >= 6
											? "Contain 6+ characters of letters and numbers"
											: ""
									}
									initialValue={confirmPassword}
									value={confirmPassword}
									data-btn-id="confirm"
									onChange={e => {
										setTarget(e.target.dataset.btnId);
										setConfirmPassword(e.target.value);
										validatePassword(e.target.value);
									}}
									onFocus={e => setTarget(e.target.dataset.btnId)}
								/>
							</div>
							<Button
								style={{ margin: "0 auto" }}
								type="submit"
								auto
								color="gradient"
								ghost
								shadow
								disabled={isConfirmPasswordValid && isPasswordValid ? false : true}
							>
								Reset Password
							</Button>
						</form>
					</>
				)}
				{confirm && (
					<>
						<h1>Your Password has been reset 🥳</h1>
						<p>Do not forget it this time buddy 👾</p>
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
