import { Badge, Button, CloseButton, Dialog, Flex, Portal } from "@chakra-ui/react"
import { ReactNode } from "react";
import { MdOutlineZoomOutMap } from "react-icons/md";

interface FullScreenDialogProps {
  title: string;
  badgeInfo: string;
  children: ReactNode;
}

const FullScreenDialog = ({ title, badgeInfo, children }: FullScreenDialogProps) => {
  return (
    <Dialog.Root size="full" motionPreset="slide-in-bottom">
      <Dialog.Trigger asChild display="flex" justifySelf="flex-end">
        <Button variant="ghost">
          <MdOutlineZoomOutMap />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title display="flex" justifyContent="space-between" fontSize="3xl">
                <Flex alignItems="flex-end" gap={4}>
                  {title}
                  <Badge colorPalette="purple" size="lg">{badgeInfo}</Badge>
                </Flex>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="xl" variant="surface" colorPalette="purple" />
                </Dialog.CloseTrigger>
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {children}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
};

export default FullScreenDialog;
