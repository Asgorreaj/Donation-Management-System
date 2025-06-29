// src/components/modals/confirm-deletion.tsx
import { showErrorAlert } from '@/utils/sweetAlert';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useState } from 'react';

export const ConfirmDeleteModal = ({
  isVisible,
  onClose,
  onConfirm,
}: {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
    } catch (error) {
      console.error("Error during deletion:", error);
      await showErrorAlert("An error occurred during deletion");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isVisible} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-danger">Confirm Deletion</ModalHeader>
            <ModalBody>
              <p className="font-semibold">Are you sure?</p>
              <p className="text-sm text-default-500">You wont be able to revert this!</p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                color="danger" 
                onClick={handleConfirm}
                isLoading={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};