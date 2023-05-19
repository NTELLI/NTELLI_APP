import { deleteCookie, getCookie, setCookie } from "cookies-next";
import React, { useEffect } from "react";
import * as Realm from "realm-web";

type RealmProviderProps = {
	children: React.ReactNode;
};

type RealmContextType = {
	app: Realm.App;
	user: Realm.User | null;
	setUser: (user: Realm.User) => void;
};

export const RealmContext = React.createContext<RealmContextType>({
	app: new Realm.App({ id: process.env.NEXT_PUBLIC_MONGODB_APP_ID as string }),
	user: null,
	setUser: () => {},
});

export const RealmProvider = ({ children }: RealmProviderProps) => {
	const [user, setUser] = React.useState<Realm.User | null>(null);
	const app = React.useMemo(() => new Realm.App({ id: process.env.NEXT_PUBLIC_MONGODB_APP_ID as string }), []);
	// retrieve user from cookies on mount
	useEffect(() => {
		const cookieUser = getCookie("user");

		if (cookieUser) {
			const user = JSON.parse(cookieUser as string);
			setUser(user);
		}
	}, []);

	// save user to cookies when it changes
	useEffect(() => {
		if (user) {
			setCookie("user", JSON.stringify(user), { path: "/" });
		} else {
			deleteCookie("user");
		}
	}, [user]);
	return <RealmContext.Provider value={{ app, user, setUser }}>{children}</RealmContext.Provider>;
};

export const useRealm = () => {
	const { app, user, setUser } = React.useContext(RealmContext);
	return { app, user, setUser };
};
