import Link from 'next/link';

import Layout from '../components/layout/Layout';
import { useIsAuth } from '../lib/hooks/useIsAuth';

export default function About() {
	useIsAuth();
	return (
		<Layout>
			This is a static page goto{' '}
			<Link href='/'>
				<a>dynamic</a>
			</Link>{' '}
			page.
		</Layout>
	);
}
