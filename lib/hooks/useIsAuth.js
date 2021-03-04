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
export const useIsAuth = () => {
	const { loading, error, data } = useQuery(MeQuery, { skip: IS_SERVER });
	console.log(data);
	const me = data?.me;
	const shouldRedirect = !(loading || error || me);
	const router = useRouter();
	useEffect(() => {
		if (shouldRedirect) {
			router.push('/signin');
		}
	}, [shouldRedirect]);
};
