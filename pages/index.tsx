import type { GetServerSideProps } from 'next';
import { ComponentPropsWithoutRef } from 'react';

import { getDestinationIfExists } from '../lib/db';

function IndexPage({ origin }: { origin?: string }) {
  return <div>hey. we're at {origin || 'apex'}</div>;
}

export const getServerSideProps: GetServerSideProps<
  ComponentPropsWithoutRef<typeof IndexPage>
> = async (ctx) => {
  // we can trust the host url on vercel
  const host = ctx.req.headers.host;

  // this is pretty naive, but who cares
  const origin = host.split('.')[0];

  // if we have a valid destination, redirect
  const destination = await getDestinationIfExists(origin);
  if (destination) return { redirect: { destination, permanent: true } };

  // otherwise, render homepage with pre-filled origin where applicable
  return { props: { origin } };
};

export default IndexPage;
