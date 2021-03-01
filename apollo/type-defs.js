import { gql } from '@apollo/client';

export const typeDefs = gql`
	type User {
		id: ID!
		name: String!
		email: String!
		role: String!
		token: String
	}

	input SignUpInput {
		name: String!
		password: String!
		# confirmPassword: String!
		email: String!
	}
	input SignInInput {
		email: String!
		password: String!
	}

	type Query {
		me: User
	}
	type Mutation {
		signUp(input: SignUpInput): User!
		signIn(input: SignInInput): User!
	}
`;
