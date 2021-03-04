import { useApolloClient } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuthContext } from '../../lib/context/auth-context';

export default function Header() {
	const { isSignedIn, userName, signout } = useAuthContext();
	const client = useApolloClient();
	const router = useRouter();
	const signOutHandler = async () => {
		signout();
		await client.resetStore();
		await router.push('/signin');
	};
	return (
		<div>
			{isSignedIn && (
				<div>
					<h3>{userName} </h3> <button onClick={signOutHandler}> Sign Out</button>
				</div>
			)}
			{!isSignedIn && (
				<Link href='/signin'>
					<a>Sign In</a>
				</Link>
			)}
		</div>
	);
}
