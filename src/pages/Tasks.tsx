import { useEffect, useState, RefObject } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { TaskColumnContainer } from "../components/TaskColumnContainer";
import { BoardHeader } from "../components";
import { useTasks } from "../data";

export function Tasks({
  isMobile,
  mainRef,
}: {
  isMobile: boolean;
  mainRef: RefObject<HTMLDivElement>;
}) {
  const { taskColumns: initialTaskColumns, updateTask } = useTasks();
  const [taskColumns, setTaskColumns] = useState<TaskColumn[]>([]);

  useEffect(() => {
    setTaskColumns(initialTaskColumns);
  }, [setTaskColumns, initialTaskColumns]);

  function handleSearch(e) {
    e.preventDefault();
    const searchValue = e.target.value;
    if (searchValue !== "") {
      setTaskColumns(
        taskColumns.map((column) => ({
          ...column,
          tasks: column.tasks.filter((task) =>
            task.title.toLowerCase().includes(searchValue.toLowerCase())
          ),
        }))
      );
    } else {
      setTaskColumns(initialTaskColumns);
    }
  }
  return (
    <Box w="100%" overflowX="scroll">
      <Flex
        direction={"column"}
        overflowX="auto"
        h="100svh"
        flexGrow={1}
        ref={mainRef}
      >
        {/* {!isMobile && <TaskHeader handleSearch={handleSearch} />} */}
        {!isMobile && (
          <BoardHeader
            title="React Task Tracker"
            setActiveBoard={() => null}
            handleSearch={handleSearch}
          />
        )}
        <TaskColumnContainer
          isMobile={isMobile}
          taskColumns={taskColumns}
          setTaskColumns={setTaskColumns}
          updateTask={updateTask}
        />
      </Flex>
    </Box>
  );
}
