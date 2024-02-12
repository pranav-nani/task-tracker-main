import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  FormLabel,
} from "@chakra-ui/react";
import { v4 as uuidV4 } from "uuid";
import { FaPlus, FaRegCircleXmark, FaSquareMinus } from "react-icons/fa6";
import { useBoards } from "../data";

export function BoardForm({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [boardTitle, setBoardTitle] = useState("");
  const [newColTitle, setNewColTitle] = useState("");
  const [colsToAdd, setColsToAdd] = useState<TaskColumn[]>([]);
  const { createBoard } = useBoards(onClose);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="gray.600">
        <ModalHeader textTransform="uppercase" color="white">
          Create Board
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <Text color="white" pb={5}>
            Create your own board with custom column titles for your tasks.
          </Text>
          <FormControl mb={5}>
            <FormLabel color="white">Title</FormLabel>
            <Input
              backgroundColor="white"
              placeholder="New Project"
              onChange={({ target }) => setBoardTitle(target.value)}
            />
          </FormControl>
          <FormControl mb={5}>
            <FormLabel color="white">Status Columns</FormLabel>
            <Flex alignItems="center">
              <Input
                backgroundColor="white"
                placeholder="To Do, In Progress, Done, etc..."
                value={newColTitle}
                onChange={({ target }) => setNewColTitle(target.value)}
              />
              <IconButton
                aria-label="Add Status Column"
                variant="unstyled"
                color="white"
                icon={
                  <Icon
                    as={FaRegCircleXmark}
                    fontSize="2xl"
                    transform="rotate(45deg)"
                  />
                }
                onClick={() => {
                  setColsToAdd(reduceColumnsStatus(colsToAdd, newColTitle));
                  setNewColTitle("");
                }}
              />
            </Flex>
          </FormControl>
          <Box py={2}>
            {colsToAdd.map(({ title, status }) => (
              <Flex key={`${title}-${status}`} width="100%" mt={4}>
                <Text
                  fontWeight="bold"
                  bgColor="orange.100"
                  py={3}
                  px={4}
                  width="100%"
                  borderRadius={8}
                >
                  {title}--{status}
                </Text>
                <IconButton
                  variant="unstyled"
                  aria-label="Remove Status Column"
                  fontSize="2xl"
                  color="red.400"
                  px={2}
                  onClick={() =>
                    setColsToAdd(
                      colsToAdd.filter((col) => col.status !== status)
                    )
                  }
                  icon={<FaSquareMinus />}
                />
              </Flex>
            ))}
          </Box>
          <ModalFooter>
            <Button
              rightIcon={<FaPlus />}
              backgroundColor="orange.400"
              textTransform="uppercase"
              color="white"
              onClick={() => {
                createBoard({
                  title: boardTitle,
                  id: uuidV4(),
                  taskColumns: colsToAdd,
                });
                setColsToAdd([]);
              }}
            >
              Create Board
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

// Gets the max status number in the array and sets the new column to that plus 1, then reduces the statuses back down to start at 0
// This is is to ensure that if a user adds a new column to the project, and then deletes it from the list we dont get:
//  A. a duplicate key that could break the UI
// B. a gross array of numbers like [0,1, 9, 39, 38]. Thank god for reduce
function reduceColumnsStatus(colsToAdd: TaskColumn[], newColTitle: string) {
  return [
    ...colsToAdd,
    {
      title: newColTitle,
      status: (
        Math.max(...[...colsToAdd.map(({ status }) => parseInt(status)), 0]) + 1
      ).toString(),
      tasks: [],
    },
  ].reduce((acc, cur, i) => {
    acc = [
      ...acc,
      {
        ...cur,
        status: i.toString(),
      },
    ];
    return acc;
  }, [] as TaskColumn[]);
}
