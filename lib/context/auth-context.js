import { createContext, useContext, useCallback, useEffect, useState } from 'react';

// export const AuthContext = createContext({
// 	isSignedIn: false,
// 	userId: null,
// 	userName: null,
// 	token: null,
// 	signin: () => {},
// 	signout: () => {},
// });

const AuthContext = createContext();
let signoutTimer;
export default function AuthContextProvider({ children }) {
	const [token, setToken] = useState(false);
	const [tokenExpirationDate, setTokenExpirationDate] = useState();
	const [userId, setUserId] = useState(false);
	const [userName, setUserName] = useState(false);
	const [userRole, setUserRole] = useState(false);

	const signin = useCallback((userId, userName, userRole, token, expirationDate) => {
		setToken(token);
		setUserId(userId);
		setUserName(userName);
		setUserRole(userRole);
		const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
		setTokenExpirationDate(tokenExpirationDate);
		localStorage.setItem(
			'authData',
			JSON.stringify({
				userId: userId,
				userName: userName,
				userRole: userRole,
				token: token,
				expiration: tokenExpirationDate.toISOString(),
			})
		);
	}, []);

	const signout = useCallback(() => {
		setToken(null);
		setTokenExpirationDate(null);
		setUserId(null);
		setUserName(null);
		localStorage.removeItem('authData');
	}, []);

	useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
			signoutTimer = setTimeout(signout, remainingTime);
		} else {
			clearTimeout(signoutTimer);
		}
	}, [token, signout, tokenExpirationDate]);

	useEffect(() => {
		const authData = JSON.parse(localStorage.getItem('authData'));
		// console.log(authData);
		if (authData && authData.token && new Date(authData.expiration) > new Date()) {
			console.log('AUTO LOGIN');
			signin(authData.userId, authData.userName, authData.userRole, authData.token, new Date(authData.expiration));
		}
	}, [signin]);
	let sharedState = {
		isSignedIn: !!token,
		token,
		signin,
		signout,
		userId,
		userName,
		userRole,
	};

	return <AuthContext.Provider value={sharedState}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
	return useContext(AuthContext);
}
