import React from 'react';
import { ConfigProvider } from 'antd';

const ConfigAntThemes = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#D62C26',
        borderRadius: 8
      },
      components: {
        // Button: {
        //   colorBgBase: '#17457c'
        // },
        Carousel: {
          arrowOffset: 24,
          arrowSize: 32
        },
        Menu: {
          // borderRadius: 0,
          itemBorderRadius: 0,
          itemMarginInline: 0,
          itemMarginBlock: 0
          // itemPaddingInline
        }
      }
    }}
  >
    {children}
  </ConfigProvider>
);

export default ConfigAntThemes;
