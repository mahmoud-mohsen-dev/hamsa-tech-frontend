'use client';

import { useMyContext } from '@/context/Store';
import { Drawer } from 'antd';

function AppDrawer() {
  const { openDrawer, drawerIsLoading, setOpenDrawer } =
    useMyContext();

  return (
    <Drawer
      closable
      destroyOnClose
      title={<p>Loading Drawer</p>}
      placement='right'
      open={openDrawer}
      loading={drawerIsLoading}
      onClose={() => setOpenDrawer(false)}
    >
      {/* <Button
          type='primary'
          style={{ marginBottom: 16 }}
          onClick={showLoading}
        >
          Reload
        </Button> */}
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  );
}

export default AppDrawer;
