import Link from 'next/link';
import { useAuthContext } from '../lib/context/auth-context';
import Layout from '../components/layout/Layout';

const Index = () => {
	const auth = useAuthContext();
	return (
		<Layout>
			You're signed in as {auth.userName} goto{' '}
			<Link href='/about'>
				<a>static</a>
			</Link>{' '}
			page.
		</Layout>
	);
};

export default Index;
