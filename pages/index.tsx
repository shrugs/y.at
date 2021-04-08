import { Alert } from '@chakra-ui/alert';
import { Button } from '@chakra-ui/button';
import { FormControl, FormHelperText, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Heading, VStack } from '@chakra-ui/layout';
import type { GetServerSideProps } from 'next';
import { toUnicode } from 'punycode/';
import { ComponentPropsWithoutRef, FormEventHandler, useCallback, useMemo, useState } from 'react';

import { Container } from '../components/Container';
import { SuccessPage } from '../components/SuccessPage';
import { getDestinationIfExists } from '../lib/db';
import { useOriginExists } from '../lib/useOriginExists';
import { isValidDestination, isValidOrigin } from '../lib/validation';

function IndexPage({ initialOrigin }: { initialOrigin?: string }) {
  const [origin, setOrigin] = useState<string>(initialOrigin ?? null);
  const [destination, setDestination] = useState<string>(null);

  const originIsValid = useMemo(() => isValidOrigin(origin), [origin]);
  const destinationIsValid = useMemo(() => isValidDestination(destination), [destination]);

  const { exists, loading: isCheckingExistence, error: existenceError } = useOriginExists(
    origin,
    !originIsValid,
  );

  const isValid = originIsValid && destinationIsValid && !isCheckingExistence && !exists;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error>(null);
  const [data, setData] = useState<{ origin: string; destination: string }>();

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();

      setData(null);
      setError(null);
      setSubmitting(true);
      try {
        const response = await fetch('/api/claim', {
          method: 'POST',
          body: JSON.stringify({ origin, destination }),
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setSubmitting(false);
      }
    },
    [destination, origin],
  );

  return (
    <Container display="flex" flexDirection="column" alignItems="stretch">
      <VStack align="stretch">
        {data ? (
          <SuccessPage {...data} />
        ) : (
          <>
            <Heading textTransform="uppercase" fontSize="8xl" lineHeight="tall">
              ý.at
            </Heading>
            <form onSubmit={onSubmit}>
              <VStack align="stretch" spacing={4}>
                <FormControl id="origin">
                  <FormLabel>Your Emoji Username</FormLabel>
                  <Input
                    type="text"
                    value={origin ?? ''}
                    onChange={(e) => setOrigin(e.target.value || null)}
                    placeholder="🖕🖖"
                    isInvalid={!isValidOrigin}
                  />
                  <FormHelperText
                    color={origin && !isCheckingExistence ? (exists ? 'red' : 'green') : 'gray.500'}
                  >
                    {origin
                      ? isValidOrigin
                        ? isCheckingExistence
                          ? `Checking...`
                          : existenceError
                          ? existenceError.message
                          : exists
                          ? `${origin} is already claimed`
                          : `${origin} is not yet claimed!`
                        : `Yup, any emojis you want, we don't care.`
                      : `Invalid origin`}
                  </FormHelperText>
                </FormControl>

                <FormControl id="destination">
                  <FormLabel>Where should {origin ? `${origin}.ý.at` : 'your ý.at'} go?</FormLabel>
                  <Input
                    type="url"
                    value={destination ?? ''}
                    onChange={(e) => setDestination(e.target.value || null)}
                    placeholder="https://example.com"
                    isInvalid={!isValidDestination}
                  />
                  <FormHelperText>Yup, anywhere on the web, we don't care.</FormHelperText>
                </FormControl>

                {error && <Alert status="error">{error.message}</Alert>}

                <Button
                  type="submit"
                  isDisabled={!isValid}
                  isLoading={submitting || isCheckingExistence}
                >
                  {originIsValid ? `Claim ${origin}!` : `Claim your ý.at`}
                </Button>
              </VStack>
            </form>
          </>
        )}
      </VStack>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<
  ComponentPropsWithoutRef<typeof IndexPage>
> = async (ctx) => {
  // we can trust the host url on vercel
  const host = ctx.req.headers.host;

  // this is pretty naive, but who cares
  const subdomain = host.includes('.') ? host.split('.')[0] : undefined;

  // decode to unicode
  const origin = subdomain ? toUnicode(subdomain) : undefined;

  // if we have a valid destination, redirect
  const destination = await getDestinationIfExists(origin);
  if (destination) return { redirect: { destination, permanent: true } };

  // otherwise, render homepage with pre-filled origin where applicable
  return { props: { initialOrigin: origin ?? null } };
};

export default IndexPage;
