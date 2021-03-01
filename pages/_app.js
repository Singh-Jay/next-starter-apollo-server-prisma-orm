import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import AuthContextProvider from '../lib/context/auth-context';

export default function App({ Component, pageProps }) {
	const apolloClient = useApollo(pageProps.initialApolloState);
	return (
		<AuthContextProvider>
			<ApolloProvider client={apolloClient}>
				<Component {...pageProps} />
			</ApolloProvider>
		</AuthContextProvider>
	);
}
