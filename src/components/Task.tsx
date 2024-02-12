import { Box, Flex, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import dayjs from "dayjs";
import { TaskForm } from "./TaskForm";

export function Task({ task, boardId }: { task: Task; boardId?: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const isOverdue = dayjs().isAfter(dayjs(task.dueDate).add(1, "day"));

  const displayDate = dayjs(
    task.createdDate && !task.editedDate ? task.createdDate : task.editedDate
  ).format("MM/DD/YYYY h:mm A");
  return (
    <Box position="relative">
      <Box
        bgColor="cyan.600"
        borderRadius={12}
        py={5}
        px={4}
        my={4}
        boxShadow="lg"
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        transform={
          transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 10)`
            : undefined
        }
        onClick={onOpen}
      >
        <Flex width="100%" alignItems="center">
          <PriorityBox priority={task.priority} />
          <Text
            fontSize="lg"
            fontWeight="bold"
            mx={3}
            noOfLines={1}
            maxW="150px"
          >
            {task.title}
          </Text>

          <Spacer />
        </Flex>

        <Box mt={1}>
          {task.dueDate && (
            <Text
              mr={2}
              color="white"
              bgColor={isOverdue ? "red.500" : "transparent"}
              fontWeight="bold"
              display="inline-block"
              p={isOverdue ? 3 : "inherit"}
              borderRadius={isOverdue ? 12 : "inherit"}
              noOfLines={1}
            >
              {isOverdue ? "Overdue!" : `Due: ${task.dueDate}`}
            </Text>
          )}
          <Text color="white" mt={2} noOfLines={1}>
            {task.createdDate && !task.editedDate
              ? `Created at: ${displayDate}`
              : `Edited at ${displayDate}`}
          </Text>
          <Text mt={2}>{task.details?.substring(0, 120)}</Text>
        </Box>
      </Box>
      <TaskForm
        isOpen={isOpen}
        onClose={onClose}
        task={task}
        boardId={boardId}
      />
    </Box>
  );
}

function PriorityBox({ priority }: { priority: string }) {
  return (
    <Box
      minW="20px"
      maxW="20px"
      w="20px"
      minH="20px"
      maxH="20px"
      h="20px"
      bgColor={`${priorityColor(parseInt(priority))}.400`}
      borderRadius={4}
      pl="3px"
      pt="3px"
    >
      <Box bgColor="white" h="13px" w="13px" borderRadius={18}></Box>
    </Box>
  );
}

function priorityColor(p: number) {
  if (p === 0) return "green";
  if (p === 1) return "yellow";
  if (p === 2) return "red";
  return "gray";
}
