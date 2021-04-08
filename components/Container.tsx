import { Box, BoxProps } from '@chakra-ui/react';

export function Container(delegated: BoxProps) {
  return (
    <Box
      mx="auto"
      width="full"
      maxWidth="2xl"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      p={2}
    >
      <Box as="main" p={4} color="yin" bg="yang" borderRadius="xl" {...delegated} />
    </Box>
  );
}
