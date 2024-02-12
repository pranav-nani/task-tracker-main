import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useBoards } from "../data";
import { BoardHeader } from "../components/BoardHeader";
import { BoardOptions } from "../components/BoardOptions";
import { TaskColumnContainer } from "../components/TaskColumnContainer";

export function Board({
  id,
  isMobile,
  setActiveBoard,
}: {
  id: string;
  isMobile: boolean;
  setActiveBoard: (args: string) => void;
}) {
  const [board, setBoard] = useState<TaskBoard>();
  const { getBoardById, updateBoard } = useBoards();

  useEffect(() => {
    (async () => {
      try {
        const res = await getBoardById(id);
        setBoard(res);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [id]);

  if (!board) return null;
  return (
    <Box maxW="100%">
      <Flex direction="column" width="100%" h="10svh">
        {!isMobile && (
          <BoardHeader
            id={id}
            title={board.title}
            handleSearch={() => null}
            button={<BoardOptions boardId={id} />}
            setActiveBoard={setActiveBoard}
          />
        )}
        <TaskColumnContainer
          isMobile={isMobile}
          taskColumns={board.taskColumns}
          setTaskColumns={() => null}
          updateTask={updateBoard}
          boardId={id}
        />
      </Flex>
    </Box>
  );
}
