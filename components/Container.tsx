import { Box, BoxProps } from '@chakra-ui/react';

export function Container(delegated: BoxProps) {
  return (
    <Box
      mx="auto"
      width="full"
      maxWidth="2xl"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      p={2}
    >
      <Box as="main" color="yin" bg="yang" borderRadius="xl" overflowX="hidden" overflowY="auto">
        <Box p={4} {...delegated} />
      </Box>
    </Box>
  );
}
