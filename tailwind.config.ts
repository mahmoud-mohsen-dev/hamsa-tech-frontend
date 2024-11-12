import type { Config } from 'tailwindcss';
const plugin = require('tailwindcss/plugin');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '868px',
      'xl': '1080px',
      '2xl': '1280px',
      '3xl': '1440px',
      '4xl': '1536px',
      '5xl': '1900px'
    },
    container: {
      center: true,
      padding: {
        'DEFAULT': '1rem',
        // 'sm': '1rem',
        'md': '2rem',
        'lg': '3rem',
        'xl': '3rem',
        '2xl': '3rem',
        '5xl': '8rem'
        // '3xl': '8rem',
        // '4xl': '8rem'
      }
    },
    extend: {
      backgroundImage: {
        'gradient-radial':
          'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mini-map-overlay':
          'linear-gradient(transparent,transparent 20%,rgba(0,0,0,0.1) 40%,rgba(0,0,0,0.4) 60%,rgba(0,0,0,0.6) 80%,rgba(0,0,0,0.6))'
      },
      colors: {
        //======= Shades Of Blue ========
        'blue-light': '#1d4ed8',
        'blue-light-dark': '#1e40af',
        'blue-normal': '#151CB9',
        'blue-accent': '#364d79',
        'blue-accent-dark': '#dfe2e1',
        'blue-dark': '#17457c',
        'blue-darker': '#1e3a8a',
        'blue-sky-ultralight': '#ECF4FF',
        'blue-sky-light': '#07a0c3',
        'blue-sky-normal': '#00A0E9',
        'blue-sky-accent': '#1677ff',
        'blue-sky-medium': '#2563eb',
        'blue-sky-dark': '#1773b0',
        //======= Shades Of Red ========
        'red-shade-50': '#D7C0BF',
        'red-shade-100': '#CDA6A4',
        'red-shade-150': '#C78A88',
        'red-shade-200': '#C76E6A',
        'red-shade-250': '#CC4E49',
        'red-shade-300': '#D62C26',
        'red-shade-350': '#D7150E',
        'red-shade-400': '#AF241F',
        'red-shade-500': '#912C29',
        'red-shade-600': '#79312E',
        'red-shade-700': '#663230',
        'red-shade-800': '#573230',
        'red-shade-900': '#4B302F',
        'red-normal': '#d9363e',
        'red-medium': '#d71820',
        'red-accent': '#E20A0A',
        'red-dark': '#DD1C1a',
        //======= Shades Of Yellow ========
        'yellow-lighter': '#fadb14',
        'yellow-light': '#F0C808',
        'yellow-normal': '#EFB918',
        'yellow-medium': '#fcaf17',
        //======= Shades Of Green ========
        'green-normal': '#96BE24',
        'green-medium': '#65b531',
        'green-dark': '#16a34a',
        //======= Shades Of White ========
        'white-light': '#f9f9f9',
        //======= Shades Of Black ========
        'black-light': '#333333',
        'black-medium': '#222',
        'black-dark': '#120F2D',
        'black-accent': '#191e2f',
        //======= Shades Of Gray ========
        'gray-ultralight': '#eaeaea',
        'gray-lighter': '#F5F5F5',
        'gray-light': '#dedede',
        'gray-medium': '#9b9b9b',
        'gray-normal': '#666666',
        'gray-dark': '#6B6A75',
        // 'gray': '##f0f3f2',

        //======= Other Colors ========
        'blue-gray-light': '#575a7b',
        'blue-gray-medium': '#2a334e'
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        openSans: ['var(--font-opensans)']
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)'
      },
      boxShadow: {
        medium: '0 5px 83px 0 rgba(27,26,26,0.12)',
        featured: '0 2px 10px rgba(0, 0, 0, 0.12)',
        featuredHovered: ' 0 2px 10px rgba(0, 0, 0, 0.2)'
      },
      filter: {
        invert: 'invert(1)'
      },
      mixBlendMode: {
        difference: 'difference'
      },
      gridTemplateColumns: {
        // footer: '2fr repeat(auto-fit,minmax(350px,1fr))'
        footer: '1.2fr .7fr 1.3fr 1fr',
        checkout: 'minmax(350px,1.2fr) 1fr'
      },

      // transitionProperty: {
      //   spacing: 'all'
      // }
      transitionProperty: {
        visible: 'visibility, opacity'
      }
    },
    plugins: [
      plugin(function ({ addUtilities }: { addUtilities: any }) {
        const newUtilities = {
          '.container-none': {
            'max-width': 'none',
            'margin-left': '0',
            'margin-right': '0',
            'padding-left': '0',
            'padding-right': '0'
          }
        };
        addUtilities(newUtilities, ['responsive']);
      }),
      plugin(function ({
        matchUtilities,
        theme
      }: {
        matchUtilities: any;
        theme: any;
      }) {
        matchUtilities(
          {
            'text-shadow': (value: string) => ({
              textShadow: value
            })
          },
          { values: theme('textShadow') }
        );
      })
    ]
  }
};

export default config;
