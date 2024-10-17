'use client';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import SearchInputField from './SearchInputField';

function ModalSearchInput({
  styleColor = undefined
}: {
  styleColor?: undefined | string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className='modal-search-input ml-5 hidden text-inherit 2xl:block'>
      <Button
        type='link'
        onClick={showModal}
        style={
          styleColor ?
            { padding: 0, color: styleColor }
          : { padding: 0 }
        }
        className='seach-btn'
      >
        <FaMagnifyingGlass />
      </Button>
      <Modal
        title='Search'
        // centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={() => <></>}
      >
        <SearchInputField />
      </Modal>
    </div>
  );
}

export default ModalSearchInput;
