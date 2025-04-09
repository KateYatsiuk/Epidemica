import {
  Button,
  CloseButton,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface ConfirmDeleteDialogProps {
  children: ReactNode;
  title?: string;
  message?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ConfirmDeleteDialog = ({
  children,
  title = "Ви впевнені, що хочете видалити запис?",
  message = "Цю дію неможливо скасувати. Дані буде остаточно видалено.",
  onConfirm,
  isLoading = false,
}: ConfirmDeleteDialogProps) => {
  return (
    <Dialog.Root role="alertdialog" placement="center">
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content fontSize="md">
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>{message}</Dialog.Body>
            <Dialog.Footer gap={2}>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Скасувати</Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette="red"
                onClick={onConfirm}
                loading={isLoading}
              >
                Видалити
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
