import { useState } from "react";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import {
  rectIntersection,
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core";
import { TaskColumn } from "../components/TaskColumn";
import { useTasks } from "../data";
import { Task } from "../components/Task";
import { TaskFooter } from "../components/TaskFooter";

export function TaskColumnContainer({
  isMobile,
  taskColumns,
  setTaskColumns,
  title,
  updateTask,
  boardId,
}: {
  isMobile: boolean;
  taskColumns: TaskColumn[];
  setTaskColumns: (args: TaskColumn[]) => void;
  updateTask: (args) => void;
  title?: string;
  boardId?: string;
}) {
  const [prevStatus, setPrevStatus] = useState("");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { getTaskById } = useTasks();

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });

  const sensors = useSensors(mouseSensor);

  return (
    <Box width="100%">
      <DndContext
        collisionDetection={rectIntersection}
        onDragStart={async (event) => {
          const taskId = event.active.id.toString();
          const currentTask = await getTaskById(taskId);

          setPrevStatus(currentTask.status ?? "0");
          setActiveTask(currentTask);

          const updatedTask = {
            ...currentTask,
            status: "",
          } as Task;
          if (!boardId) {
            updateTask(updatedTask);
            return;
          }
        }}
        onDragEnd={async ({ over }) => {
          if (activeTask && !over) {
            updateTask({ ...activeTask, status: prevStatus } as Task);
          }

          if (activeTask && over) {
            updateTask({ ...activeTask, status: over?.id } as Task);
          }
          setPrevStatus("");
          setActiveTask(null);
        }}
        onDragCancel={() => {
          if (activeTask) {
            updateTask({ ...activeTask, status: prevStatus });
          }
          setPrevStatus("");
          setActiveTask(null);
        }}
        sensors={sensors}
      >
        <Flex
          overflowX="scroll"
          direction={isMobile ? "column" : "row"}
          mt={isMobile ? 6 : undefined}
          pb={isMobile ? "150px" : undefined}
          justifyItems={isMobile ? "center" : "inherit"}
          css={{
            WebkitOverflowScrolling: "touch", // Enable smooth scrolling on iOS devices
            "&::-webkit-scrollbar": {
              width: "0em", // Adjust the width of the scrollbar
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "transparent", // Set the color of the scrollbar thumb
            },
          }}
        >
          {taskColumns
            ?.sort((a, b) => (a.status > b.status ? 1 : -1))
            .map((task) => (
              <Box mx={4} key={task.title}>
                <TaskColumn
                  isMobile={isMobile}
                  taskColumn={task}
                  boardId={boardId}
                />
              </Box>
            ))}
        </Flex>
        <DragOverlay>{activeTask && <Task task={activeTask} />}</DragOverlay>
      </DndContext>
      {isMobile && <TaskFooter />}
    </Box>
  );
}
