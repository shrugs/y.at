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
    darkglass: 'rgba(0,0,0,0.85)',
  },
  styles: {
    global: {
      body: {
        fontFamily: 'body',
        color: 'yang',
        bg: 'yin',
        overflow: 'hidden',
        lineHeight: 'normal',
      },
      '.particle': {
        pointerEvents: 'none',
        position: 'absolute',
        willChange: 'transform',
      },
    },
  },
  components: {
    Input: {
      defaultProps: { size: 'lg' },
    },
    Link: {
      baseStyle: {
        textDecoration: 'underline',
      },
    },
  },
};

export const theme = extendTheme(override);
export const useTheme = () => defaultUseTheme<typeof theme>();
