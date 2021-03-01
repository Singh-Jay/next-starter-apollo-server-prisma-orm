import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
const MeQuery = gql`
	query MeQuery {
		me {
			id
			name
			email
			role
		}
	}
`;
export const useIsAuth = () => {
	const { loading, error, data } = useQuery(MeQuery);
	const router = useRouter();
	useEffect(async () => {
		if (!loading && !data?.me) {
			await router.replace('/signin?next=' + router.pathname);
		}
	}, [loading, data, router]);
};
