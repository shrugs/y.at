import { GetServerSideProps } from 'next';

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
  // const id = host.split('.')[0];

  return { props: {} };
};

export default Home;
