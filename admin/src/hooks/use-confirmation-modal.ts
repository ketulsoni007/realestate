import { useState } from 'react';

interface ConfirmationOptions {
  title: string;
  description: string;
  showCancelButton?: boolean;
  confirmButtonText: string;
}

interface UseConfirmationReturn {
  showConfirmation: (options: ConfirmationOptions) => Promise<boolean>;
  isOpen: boolean;
  title: string;
  description: string;
  confirmButtonText: string;
  showCancelButton: boolean;
  handleConfirm: () => void;
  handleCancel: () => void;
}

const useConfirmation = (): UseConfirmationReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showCancelButton, setShowCancelButton] = useState(true);
  const [confirmButtonText, setConfirmButtonText] = useState('');
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>();

  const showConfirmation = ({
    title,
    description,
    showCancelButton = true,
    confirmButtonText
  }: ConfirmationOptions): Promise<boolean> => {
    setTitle(title);
    setDescription(description);
    setShowCancelButton(showCancelButton);
    setConfirmButtonText(confirmButtonText);
    setIsOpen(true);

    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolvePromise) resolvePromise(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolvePromise) resolvePromise(false);
  };

  return {
    showConfirmation,
    isOpen,
    title,
    description,
    confirmButtonText,
    showCancelButton,
    handleConfirm,
    handleCancel
  };
};

export default useConfirmation;
