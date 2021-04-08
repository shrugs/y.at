import type { GetServerSideProps } from 'next';

import { getDestinationIfExists } from '../lib/db';

function Home() {
  return <div>hey</div>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const host = ctx.req.headers.host;

  // this is pretty naive, but does it really matter?
  if (!host.includes('.')) {
    return { notFound: true };
  }

  // this, too, but again, who cares?
  const origin = host.split('.')[0];

  // if we have a valid destination, redirect
  const destination = await getDestinationIfExists(origin);
  if (destination) return { redirect: { destination, permanent: true } };

  // otherwise, render homepage
  return { props: {} };
};

export default Home;
