import { Button } from '@chakra-ui/button';
import { useClipboard } from '@chakra-ui/hooks';
import { Box, Center, Link, Text, VStack } from '@chakra-ui/layout';
import { motion } from 'framer-motion';
import { toASCII } from 'punycode/';
import { useMemo } from 'react';

import { useDrops } from '../lib/useDrops';
import { toEmojiArray } from '../lib/validation';

const MotionBox = motion(Box);

export function SuccessPage({ origin, destination }: { origin: string; destination: string }) {
  useDrops(typeof window !== 'undefined' ? document.body : null, {
    variants: toEmojiArray(origin),
  });

  const encodedOrigin = useMemo(() => toASCII(origin), [origin]);
  const encodedHref = `https://${encodedOrigin}.ý.at`;
  const hostname = `${origin}.ý.at`;
  const href = `https://${hostname}`;
  const { hasCopied, onCopy } = useClipboard(encodedHref);

  const tweetHref = useMemo(
    () =>
      `https://twitter.com/intent/tweet?${new URLSearchParams({
        text: `check out my ý.at here:\n`,
        url: encodedHref,
        hashtags: 'yat',
      })}`,
    [encodedHref],
  );

  return (
    <VStack position="relative" spacing={8}>
      <Center py={16} pb={8} px={16} position="relative">
        <Text
          fontFamily="heading"
          fontSize={{ base: '8xl', lg: '10xl' }}
          textAlign="center"
          textTransform="uppercase"
          color="gray.500"
        >
          Why
          <br />
          Not
        </Text>
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <MotionBox
            initial={{ scale: 0.5, rotate: 0 }}
            animate={{
              rotate: -15,
              scale: 1,
            }}
            transition={{ type: 'spring', stiffness: 100 }}
            bg="darkglass"
            borderRadius="2xl"
            p={4}
          >
            <Text fontSize="4xl">{origin}</Text>
          </MotionBox>
        </Box>
      </Center>

      <VStack align="stretch">
        <Text fontSize="md" textAlign="center">
          Great! Your ý.at is yours forever!
        </Text>
        <Text fontSize="xs" color="gray.400" textAlign="center">
          ...or at least until this website goes down.
        </Text>
      </VStack>

      <VStack align="stretch">
        <Button as="a" href={tweetHref} rel="noopener noreferrer" target="_blank" variant="outline">
          🐦 Tweet your ý.at
        </Button>

        <Button onClick={onCopy}>{hasCopied ? `Copied!` : `Copy ${hostname}`}</Button>

        <Text textAlign="center" fontSize="sm" color="gray.500">
          or just visit{' '}
          <Link href={encodedHref} isExternal>
            {href}
          </Link>
        </Text>
      </VStack>
    </VStack>
  );
}
