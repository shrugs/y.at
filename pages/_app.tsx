import { ChakraProvider } from '@chakra-ui/react';

import { ExternalMeta } from '../components/meta/ExternalMeta';
import { ManifestMeta } from '../components/meta/ManifestMeta';
import { SeoMeta } from '../components/meta/SeoMeta';
import { theme } from '../lib/theme';

function App({ Component, pageProps }) {
  return (
    <>
      <ExternalMeta />
      <ManifestMeta />
      <SeoMeta />

      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default App;
