import { useState } from "react";
import { useRealm } from "@/context/RealmProvider";
import { Button, Grid, Input, Loading, Spacer, Text, useInput } from "@nextui-org/react";
import Link from "next/link";
import Logo from "../logo/Logo";

interface RegisterProps {
	setSignedUp: (arg0: boolean) => void;
}

const Register = ({ setSignedUp }: RegisterProps) => {
	const { app } = useRealm();
	const { value, reset, bindings } = useInput("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isEmailValid, setIsEmailValid] = useState(false);
	const [isPasswordValid, setIsPasswordValid] = useState(false);
	const [emailLength, setEmailLength] = useState(0);
	const [passwordLength, setPasswordLength] = useState(0);
	const [loading, setLoading] = useState(false);

	const handleSignup = async () => {
		setLoading(true);
		try {
			await app.emailPasswordAuth.registerUser({ email, password });
			setSignedUp(true);
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	const validateEmail = (email: string): boolean => {
		const regex =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		const state = regex.test(String(email).toLowerCase());
		setIsEmailValid(state);
		setEmailLength(email.length);
		return state;
	};

	const validatePassword = (password: string): boolean => {
		const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
		const state = regex.test(String(password).toLowerCase());
		setIsPasswordValid(state);
		setPasswordLength(password.length);
		return regex.test(password);
	};

	return (
		<Grid.Container gap={2} justify="center" direction="column" alignContent="center" alignItems="center">
			<Logo />
			<Text
				h1
				size={60}
				css={{
					textGradient: "45deg, $blue600 -20%, $pink600 50%",
					paddingLeft: "0.25rem",
					paddingRight: "0.25rem",
				}}
				weight="bold"
			>
				Sign up
			</Text>
			<Spacer y={1} />
			<Grid
				css={{
					h: 308,
					backgroundColor: "$primaryBg",
					padding: "2rem",
					borderRadius: "20px",
					display: "grid",
					placeItems: "center",
					boxShadow: "0px 10px 15px 10px rgb(0 114 245 / 10%)",
				}}
			>
				<Grid css={{ h: 74 }}>
					<Input
						required={true}
						{...bindings}
						clearable
						shadow={false}
						onClearClick={reset}
						status={!isEmailValid && emailLength > 5 ? "error" : "default"}
						helperColor={!isEmailValid && emailLength > 5 ? "error" : "success"}
						helperText={!isEmailValid && emailLength > 5 ? "Enter a valid email" : ""}
						size="lg"
						width="220px"
						labelPlaceholder="Email"
						initialValue={email}
						value={email}
						onChange={event => {
							setEmail(event.target.value);
							validateEmail(event.target.value);
						}}
					/>
				</Grid>
				<Spacer y={1} />
				<Grid css={{ h: 74 }}>
					<Input.Password
						size="lg"
						width="220px"
						labelPlaceholder="Password"
						status={!isPasswordValid && passwordLength >= 6 ? "error" : "default"}
						helperColor={!isPasswordValid && passwordLength >= 6 ? "error" : "success"}
						helperText={!isPasswordValid && passwordLength >= 6 ? "Contain 6+ characters of letters and numbers" : ""}
						initialValue={password}
						value={password}
						onChange={event => {
							setPassword(event.target.value);
							validatePassword(event.target.value);
						}}
					/>
				</Grid>
				<Spacer y={0.5} />

				<Grid>
					{!loading && (
						<Button
							onPress={handleSignup}
							color="gradient"
							auto
							rounded
							shadow
							disabled={isEmailValid && isPasswordValid ? false : true}
						>
							Sign up
						</Button>
					)}
					{loading && <Loading />}
				</Grid>
			</Grid>
			<Spacer y={1} />
			<Link style={{ color: "#0072f5" }} href="/">
				I already have an account
			</Link>
		</Grid.Container>
	);
};

export default Register;
