import { Button } from '../ui/button';
import { Modal } from '../ui/modal';

export type DeleteDialogProps = {
  openDeleteDialog: boolean;
  setIsOpenDeleteDialog: (open: boolean) => void;
  onDelete: () => void;
};

export const DeleteDialog = ({
  openDeleteDialog,
  setIsOpenDeleteDialog,
  onDelete
}: DeleteDialogProps) => {
  return (
    <div className="flex gap-3 mb-4">
      <Modal
        key="delete"
        isOpen={openDeleteDialog}
        onClose={() => setIsOpenDeleteDialog(false)}
        className="justify-center bg-transparent border-none"
      >
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <p className="text-black">Are you sure you want to delete?</p>
          <div className="flex items-center justify-between mt-4 space-x-4">
            <Button
              className="flex-1 bg-red-500 disabled:bg-gray-500"
              onClick={onDelete}
            >
              Yes
            </Button>
            <Button
              className="flex-1"
              onClick={() => setIsOpenDeleteDialog(false)}
            >
              No
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
