import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { Plus } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

export type TPopupModalProps = {
  onConfirm?: () => void;
  loading?: boolean;
  modalName?: string;
  showAddBtn?: boolean;
  title?: string;
  userPopup?: boolean;
  renderModal: (onClose: () => void) => React.ReactNode;
  extraBtns?: () => React.ReactNode;
  url?: string;
  isOpen: boolean;
  setIsOpen: (value: string) => void;
  isAllowedCreate?: boolean;
};

export const PopupModal = ({
  renderModal,
  modalName,
  showAddBtn = true,
  title,
  userPopup = false,
  extraBtns,
  isOpen,
  setIsOpen,
  isAllowedCreate = true
}: TPopupModalProps) => {
  const onClose = () => {
    setIsOpen('');
  };

  return (
    <div className="flex justify-end">
      <div className="flex gap-2">
        {showAddBtn && isAllowedCreate && (
          <Button
            className="flex justify-end ml-auto text-xs md:text-sm "
            onClick={() => setIsOpen(modalName ?? 'create')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        )}
        {extraBtns && extraBtns()}
      </div>
      <Modal
        userPopup={userPopup}
        isOpen={isOpen}
        onClose={onClose}
        className={'!bg-background !px-1 w-full lg:w-[85%]'}
      >
        <h5 className="text-2xl font-bold px-10">{title ?? 'Add Client'}</h5>
        <ScrollArea className="px-6">{renderModal(onClose)}</ScrollArea>
      </Modal>
    </div>
  );
};
