'use client';
import useHandleMessagePopup from '@/hooks/useHandleMessagePopup';

function MessageContextComponent() {
  const { contextHolder } = useHandleMessagePopup({
    scrollTop: false
  });

  return <>{contextHolder}</>;
}

export default MessageContextComponent;
