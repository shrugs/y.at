import { Alert } from '@chakra-ui/alert';
import { Button } from '@chakra-ui/button';
import { FormControl, FormHelperText, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Heading, Text, VStack } from '@chakra-ui/layout';
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
            <VStack align="stretch" my={4}>
              <Heading textTransform="uppercase" fontSize="8xl" lineHeight="none">
                ??.at
              </Heading>
              <Text color="gray.500" fontSize="lg">
                everyone gets an emoji! ????
              </Text>
            </VStack>
            <form onSubmit={onSubmit}>
              <VStack align="stretch" spacing={4}>
                <FormControl id="origin">
                  <FormLabel>Your Emoji Username</FormLabel>
                  <Input
                    type="text"
                    value={origin ?? ''}
                    onChange={(e) => setOrigin(e.target.value || null)}
                    placeholder="????????"
                    isInvalid={origin && !originIsValid}
                  />
                  <FormHelperText
                    color={
                      origin
                        ? originIsValid
                          ? isCheckingExistence
                            ? `gray.500`
                            : existenceError
                            ? existenceError.message
                            : exists
                            ? `red`
                            : `green`
                          : `red`
                        : `gray.500`
                    }
                  >
                    {origin
                      ? originIsValid
                        ? isCheckingExistence
                          ? `Checking...`
                          : existenceError
                          ? existenceError.message
                          : exists
                          ? `${origin} is already claimed`
                          : `${origin} is not yet claimed!`
                        : `This isn't a valid ??.at.`
                      : `Yup, any emojis you want, we don't care.`}
                  </FormHelperText>
                </FormControl>

                <FormControl id="destination">
                  <FormLabel>Where should {origin ? `${origin}.??.at` : 'your ??.at'} go?</FormLabel>
                  <Input
                    type="url"
                    value={destination ?? ''}
                    onChange={(e) => setDestination(e.target.value || null)}
                    placeholder="https://example.com"
                    isInvalid={destination && !destinationIsValid}
                  />
                  <FormHelperText
                    color={destination ? (destinationIsValid ? 'green' : 'red') : 'gray.500'}
                  >
                    {destination
                      ? destinationIsValid
                        ? 'Looks good to us!'
                        : `This isn't a valid url.`
                      : `Yup, anywhere on the web, we don't care.`}
                  </FormHelperText>
                </FormControl>

                {error && <Alert status="error">{error.message}</Alert>}

                <Button
                  type="submit"
                  isDisabled={!isValid}
                  isLoading={submitting || isCheckingExistence}
                >
                  {originIsValid ? `Claim ${origin}!` : `Claim your ??.at`}
                </Button>
              </VStack>
            </form>
          </>
        )}
      </VStack>
    </Container>
  );
}

const HOST = `??.at`;

export const getServerSideProps: GetServerSideProps<
  ComponentPropsWithoutRef<typeof IndexPage>
> = async (ctx) => {
  // we can trust the host url on vercel
  const host = toUnicode(ctx.req.headers.host);

  // bail early if we're definitely on the homepage
  // also stops anyone from overwriting our own origin lmao
  if (host === HOST) return { props: {} };

  // this is pretty naive, but who cares
  const origin = host.includes('.') ? host.split('.')[0] : undefined;

  // if we have a valid destination, redirect
  const destination = await getDestinationIfExists(origin);
  if (destination) return { redirect: { destination, permanent: true } };

  // otherwise, render homepage with pre-filled origin where applicable
  return { props: { initialOrigin: origin ?? null } };
};

export default IndexPage;
