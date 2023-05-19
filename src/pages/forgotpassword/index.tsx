import { useState } from "react";
import { useRealm } from "@/context/RealmProvider";
import styles from "./ForgotPassword.module.css";
import Logo from "@/components/logo/Logo";
import { Button, Input } from "@nextui-org/react";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [isEmailValid, setIsEmailValid] = useState(false);
	const [emailIsSent, setEmailIsSent] = useState(false);
	const { app } = useRealm();

	const handleResetPassword = async (event: any) => {
		event.preventDefault();
		try {
			await app.emailPasswordAuth.sendResetPasswordEmail({ email });
			setEmailIsSent(true);
		} catch (err) {
			alert(`Error sending password reset email: ${err}`);
		}
	};

	const validateEmail = (email: string): boolean => {
		const regex =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		const state = regex.test(String(email).toLowerCase());
		setIsEmailValid(state);
		return state;
	};

	return (
		<div className={styles.container}>
			<Logo width={330} height={60} />

			<div className={styles.content}>
				{!emailIsSent && (
					<>
						<h1>Forgot Password</h1>
						<form onSubmit={handleResetPassword}>
							<div className={styles.inputField}>
								<Input
									shadow
									size="lg"
									labelPlaceholder="Your Email"
									type="email"
									initialValue={email}
									value={email}
									onChange={e => {
										setEmail(e.target.value);
										validateEmail(e.target.value);
									}}
								/>
							</div>

							<Button
								style={{ margin: "0 auto" }}
								auto
								color="gradient"
								ghost
								shadow
								type="submit"
								disabled={isEmailValid ? false : true}
							>
								Send reset link
							</Button>
						</form>
					</>
				)}

				{emailIsSent && <h1>Email has been sent 📨</h1>}
			</div>
		</div>
	);
}
