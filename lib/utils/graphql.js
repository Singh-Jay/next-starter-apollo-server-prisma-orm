import { gql } from '@apollo/client';

export const MeQuery = gql`
	query MeQuery {
		me {
			id
			name
			email
			role
		}
	}
`;
