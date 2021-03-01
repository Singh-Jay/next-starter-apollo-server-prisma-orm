import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { gql, useMutation, useApolloClient } from '@apollo/client';
import { getErrorMessage } from '../lib/form';
import Field from '../components/field';
import { useAuthContext } from '../lib/context/auth-context';
import Layout from '../components/layout/Layout';
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
	const client = useApolloClient();
	const { signin } = useAuthContext();
	const [signUp] = useMutation(SignUpMutation);
	const [errorMsg, setErrorMsg] = useState();
	const router = useRouter();
	async function handleSubmit(event) {
		event.preventDefault();
		const nameElement = event.currentTarget.elements.name;
		const emailElement = event.currentTarget.elements.email;
		const passwordElement = event.currentTarget.elements.password;

		try {
			await client.resetStore();
			const {
				data: { signUp: resData },
			} = await signUp({
				variables: {
					name: nameElement.value,
					email: emailElement.value,
					password: passwordElement.value,
				},
			});
			if (resData) {
				signin(resData.id, resData.name, resData.role, resData.token);
				await router.push('/');
			}
		} catch (error) {
			setErrorMsg(getErrorMessage(error));
		}
	}
	return (
		<Layout>
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit}>
				{errorMsg && <p>{errorMsg}</p>}
				<Field name='name' type='text' autoComplete='name' required label='Name' />
				<Field name='email' type='email' autoComplete='email' required label='Email' />
				<Field name='password' type='password' autoComplete='password' required label='Password' />
				<button type='submit'>Sign up</button> or{' '}
				<Link href='/signin'>
					<a>Sign in</a>
				</Link>
			</form>
		</Layout>
	);
}
