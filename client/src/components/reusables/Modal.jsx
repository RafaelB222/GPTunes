import { useState } from 'react';
import { BlueButton, OrangeButton } from './NewButtons';

const Modal = ({ title, onCancel, onConfirm, showPasswordInput }) => {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    onConfirm(password);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-4 rounded shadow'>
        <h2 className='text-xl font-bold mb-4'>{title}</h2>
        {showPasswordInput && (
          <input
            type='password'
            className='border rounded p-2 mb-4 w-full'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <div className='flex justify-end space-x-2'>
          <BlueButton buttonText='Confirm' action={handleConfirm} />
          <OrangeButton buttonText='Cancel' action={onCancel} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
