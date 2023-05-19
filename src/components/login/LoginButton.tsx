import React from "react";
import { useRouter } from "next/router";
import * as Realm from "realm-web";
import styles from "./LoginButton.module.css";

interface LoginProps {
	app: Realm.App;
	setUser: (user: Realm.User) => void;
}

const LoginButton: React.FC<LoginProps> = ({ app, setUser }) => {
	const router = useRouter();

	const loginAnonymous = async () => {
		const user: Realm.User = await app.logIn(Realm.Credentials.anonymous());
		setUser(user);

		if (user) {
			router.push("/chat");
		}
	};

	return (
		<button className={styles.loginButton} onClick={loginAnonymous}>
			Log In
		</button>
	);
};

export default LoginButton;
