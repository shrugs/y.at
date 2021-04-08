import { Button } from '@chakra-ui/button';
import { useClipboard } from '@chakra-ui/hooks';
import { Box, Center, Link, Text, VStack } from '@chakra-ui/layout';
import { motion } from 'framer-motion';

import { useDrops } from '../lib/useDrops';
import { toEmojiArray } from '../lib/validation';

const MotionBox = motion(Box);

export function SuccessPage({ origin, destination }: { origin: string; destination: string }) {
  useDrops(typeof window !== 'undefined' ? document.body : null, {
    variants: toEmojiArray(origin),
  });

  const href = `https://${origin}.ý.at`;
  const { hasCopied, onCopy } = useClipboard(href);

  return (
    <VStack position="relative" spacing={8}>
      <Center py={16} pb={8} px={16} position="relative">
        <Text
          fontFamily="heading"
          fontSize={{ base: '7xl', lg: '8xl', xl: '10xl' }}
          textAlign="center"
          textTransform="uppercase"
          color="gray.500"
        >
          Great
          <br />
          Choice
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

      <Button onClick={onCopy}>{hasCopied ? `Copied!` : `Copy ${href}`}</Button>

      <Text textAlign="center" fontSize="sm" color="gray.500">
        or just visit{' '}
        <Link href={href} isExternal>
          {href}
        </Link>
      </Text>
    </VStack>
  );
}
