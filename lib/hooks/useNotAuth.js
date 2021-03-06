import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { IS_SERVER } from '../utils/constants';
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
export const useNotAuth = () => {
	const { loading, error, data } = useQuery(MeQuery, { skip: IS_SERVER });
	const router = useRouter();
	useEffect(async () => {
		if (!loading && !error && data?.me) {
			await router.back();
		}
	}, [loading, error, data, router]);
};
