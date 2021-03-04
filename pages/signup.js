import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';
import { getError } from '../lib/form';
import Field from '../components/field';
import { useAuthContext } from '../lib/context/auth-context';
import Layout from '../components/layout/Layout';
import { MeQuery } from '../lib/utils/graphql';
import { useNotAuth } from '../lib/hooks/useNotAuth';
const SignUpMutation = gql`
	mutation SignUpMutation($name: String!, $email: String!, $password: String!) {
		signUp(input: { name: $name, email: $email, password: $password }) {
			id
			name
			email
			token
		}
	}
`;
export default function signup() {
	useNotAuth();
	const { signin } = useAuthContext();
	const [signUp] = useMutation(SignUpMutation);
	const [error, setError] = useState({});
	const router = useRouter();
	async function handleSubmit(event) {
		event.preventDefault();
		const nameElement = event.currentTarget.elements.name;
		const emailElement = event.currentTarget.elements.email;
		const passwordElement = event.currentTarget.elements.password;

		try {
			const {
				data: { signUp: resData },
			} = await signUp({
				variables: {
					name: nameElement.value,
					email: emailElement.value,
					password: passwordElement.value,
				},
				update: (cache, { data }) => {
					console.log(data);
					cache.writeQuery({
						query: MeQuery,
						data: {
							me: data?.signUp,
						},
					});
				},
			});
			if (resData) {
				signin(resData.id, resData.name, resData.role, resData.token);
				await router.push('/');
			}
		} catch (error) {
			setError(getError(error));
		}
	}
	return (
		<Layout>
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit}>
				{error.general && <p>{error.general}</p>}
				<Field name='name' type='text' autoComplete='name' required label='Name' error={error.name} />
				<Field name='email' type='email' autoComplete='email' required label='Email' error={error.email} />
				<Field name='password' type='password' autoComplete='password' required label='Password' error={error.password} />
				<button type='submit'>Sign up</button> or{' '}
				<Link href='/signin'>
					<a>Sign in</a>
				</Link>
			</form>
		</Layout>
	);
}
