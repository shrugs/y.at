import { useTheme as defaultUseTheme, extendTheme, ThemeOverride } from '@chakra-ui/react';
import defaultTheme from '@chakra-ui/theme';

const override: ThemeOverride = {
  fonts: {
    body: `'Open Sans', ${defaultTheme.fonts.body}`,
    heading: `'Raleway', ${defaultTheme.fonts.heading}`,
  },
  colors: {
    yin: '#000000',
    yang: '#FFFFFF',
  },
  styles: {
    global: {
      body: {
        fontFamily: 'body',
        color: 'yin',
        bg: 'yang',
        overflowX: 'hidden',
        lineHeight: 'normal',
      },
    },
  },
  components: {},
};

export const theme = extendTheme(override);
export const useTheme = () => defaultUseTheme<typeof theme>();
