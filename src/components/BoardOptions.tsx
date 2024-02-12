import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaPlusMinus } from "react-icons/fa6";

export function BoardOptions({ boardId }: { boardId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Menu>
        <MenuButton
          color="white"
          as={Button}
          colorScheme="purple"
          rightIcon={<FaPlusMinus />}
        >
          Board Options
        </MenuButton>
        <MenuList>
          <MenuItem>Edit Board</MenuItem>
          <MenuItem onClick={onOpen}>Delete Board</MenuItem>
        </MenuList>
      </Menu>
      <DeleteModal id={boardId} isOpen={isOpen} onClose={onClose} />
    </>
  );
}

function DeleteModal({ id, isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Are You Sure?</ModalHeader>
          <ModalBody>
            <Text>This Cannot Be Undone</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => console.log("boardId", id)}
            >
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
