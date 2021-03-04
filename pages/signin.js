import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { getError } from '../lib/form';
import Field from '../components/field';
import { useAuthContext } from '../lib/context/auth-context';
import Layout from '../components/layout/Layout';
import { useNotAuth } from '../lib/hooks/useNotAuth';
import { MeQuery } from '../lib/utils/graphql';
const SignInMutation = gql`
	mutation SignInMutation($email: String!, $password: String!) {
		signIn(input: { email: $email, password: $password }) {
			id
			name
			role
			token
		}
	}
`;

function SignIn() {
	useNotAuth();
	const { signin } = useAuthContext();
	const [signIn] = useMutation(SignInMutation);
	const [error, setError] = useState({});
	const router = useRouter();

	async function handleSubmit(event) {
		event.preventDefault();

		const emailElement = event.currentTarget.elements.email;
		const passwordElement = event.currentTarget.elements.password;

		try {
			const {
				data: { signIn: resData },
			} = await signIn({
				variables: {
					email: emailElement.value,
					password: passwordElement.value,
				},
				update: (cache, { data }) => {
					cache.writeQuery({
						query: MeQuery,
						data: {
							me: data?.signIn,
						},
					});
				},
			});
			if (resData) {
				signin(resData.id, resData.name, resData.role, resData.token);
				if (typeof router.query.next === 'string') {
					await router.push(router.query.next);
				} else {
					await router.push('/');
				}
			}
		} catch (error) {
			console.log(error);
			setError(getError(error));
		}
	}

	return (
		<Layout>
			<h1>Sign In</h1>
			<form onSubmit={handleSubmit}>
				{error.general && <p>{error.general}</p>}
				<Field name='email' type='email' autoComplete='email' label='Email' required error={error.email} />
				<Field name='password' type='password' autoComplete='password' label='Password' required error={error.password} />
				<button type='submit'>Sign in</button> or{' '}
				<Link href='/signup'>
					<a>Sign up</a>
				</Link>
			</form>
		</Layout>
	);
}

export default SignIn;
