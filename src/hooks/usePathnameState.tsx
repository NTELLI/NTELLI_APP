import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect } from "react";

interface resetProps {
	setLoading: Dispatch<SetStateAction<boolean>>;
	loading: boolean;
}

const useResetLoadingOnRouteChange = (props: resetProps) => {
	const { setLoading, loading } = props;
	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = () => {
			// Check if the current pathname is different from the previous one
			if (router.pathname !== router.asPath) {
				setLoading(false); // Reset the loading state
			}
		};

		router.events.on("routeChangeComplete", handleRouteChange);

		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.pathname, router.asPath]);

	return loading;
};

export default useResetLoadingOnRouteChange;
