import { useQuery, useMutation } from "@tanstack/react-query";

const taskTemplate: TaskColumn[] = [
  {
    title: "Backlog",
    status: "0",
    tasks: [],
  },
  {
    title: "In Progress",
    status: "1",
    tasks: [],
  },
  {
    title: "Review",
    status: "2",
    tasks: [],
  },
  {
    title: "Done",
    status: "3",
    tasks: [],
  },
];

// Local Storage CRUD Query Functions
async function fetchTaskColumns(boardId?: string) {
  if (!localStorage) {
    console.error("error in retrieving local storage");
    return;
  }
  if (boardId) {
    const storedBoards = JSON.parse(
      localStorage.getItem("react-task-tracker-boards") ?? ""
    );

    const filtertedBoard = storedBoards.find(({ id }) => id === boardId);

    return filtertedBoard.taskColumns;
  }
  const storedTasks = localStorage?.getItem("task-tracker");
  const tasks = storedTasks ? JSON.parse(storedTasks) : taskTemplate;
  return tasks;
}

async function getTaskById(id: string) {
  const taskColumns: TaskColumn[] = await fetchTaskColumns();

  const foundTask = taskColumns
    .flatMap((taskColumn) => taskColumn.tasks)
    .find((task) => task.id === id);
  if (!foundTask) return {} as Task;
  return foundTask;
}

async function createTask(newTask: Task) {
  const taskColumns: TaskColumn[] = await fetchTaskColumns();

  const taskColumnToUpdate = taskColumns.find(
    (column) => column.status === newTask.status
  );
  if (!taskColumnToUpdate) return;

  const currentTaskColumns = taskColumns.filter(
    (col) => col.status !== newTask.status
  );

  const newColumn: TaskColumn = {
    title: taskColumnToUpdate.title,
    status: taskColumnToUpdate.status,
    tasks: [newTask, ...taskColumnToUpdate.tasks],
  };

  const updatedTasks = [...currentTaskColumns, newColumn];
  localStorage.setItem("task-tracker", JSON.stringify(updatedTasks));
  return updatedTasks;
}

async function updateTask(taskToUpdate: Task) {
  const taskColumns: TaskColumn[] = await fetchTaskColumns();
  const taskColumnToUpdate = taskColumns.find(
    (column) => column.status === taskToUpdate.status
  );

  if (!taskColumnToUpdate) {
    const newColumns = taskColumns.map((col) => ({
      ...col,
      tasks: col.tasks.filter((task) => task.id !== taskToUpdate.id),
    }));
    localStorage.setItem("task-tracker", JSON.stringify(newColumns));
    return newColumns;
  }

  const currentTaskColumns = taskColumns
    .filter((col) => col.status !== taskToUpdate.status)
    .map((column: TaskColumn) => ({
      ...column,
      tasks: column.tasks.filter((task) => task.id !== taskToUpdate.id),
    }));

  const currentColumnTasks = taskColumnToUpdate.tasks.filter(
    (task) => task.id !== taskToUpdate.id
  );
  const updatedColumn = {
    ...taskColumnToUpdate,
    tasks: [...currentColumnTasks, taskToUpdate],
  };

  const newColumns = [...currentTaskColumns, updatedColumn];
  localStorage.setItem("task-tracker", JSON.stringify(newColumns));
  return newColumns;
}

async function deleteTask(taskId: string) {
  const taskColumns: TaskColumn[] = await fetchTaskColumns();

  const columnToUpdate = taskColumns.find((col) =>
    col.tasks.map((t) => t.id).includes(taskId)
  );
  const oldTaskColumns = taskColumns.filter(
    (col) => col.status !== columnToUpdate?.status
  );

  const updatedColumn = {
    ...columnToUpdate,
    tasks: columnToUpdate?.tasks.filter((task) => task.id !== taskId),
  };

  const newTaskColumns = [...oldTaskColumns, updatedColumn];

  localStorage.setItem("task-tracker", JSON.stringify(newTaskColumns));
  return newTaskColumns;
}

export function useTasks(callback?: () => void, boardId?: string) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["task-tracker"],
    queryFn: () => fetchTaskColumns(boardId),
    initialData: taskTemplate,
  });

  function successHandler() {
    if (callback) {
      callback();
    }
    refetch();
  }

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: successHandler,
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: successHandler,
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: successHandler,
  });

  return {
    taskColumns: data as TaskColumn[],
    error,
    isLoading,
    getTaskById: (id: string) => getTaskById(id),
    createTask: (newTask: Task) => createTaskMutation.mutate(newTask),
    updateTask: (taskToMutate: Task) => updateTaskMutation.mutate(taskToMutate),
    deleteTask: (taskId: string) => deleteTaskMutation.mutate(taskId),
  };
}

// Boards
async function fetchBoards() {
  const storedBoards = localStorage?.getItem("react-task-tracker-boards");
  const boards = storedBoards ? JSON.parse(storedBoards) : [];
  return boards;
}

async function getBoardById(boardId: string) {
  const boards: TaskBoard[] = await fetchBoards();
  return boards.find(({ id }) => id === boardId) ?? ({} as TaskBoard);
}

async function createBoard(newBoard: TaskBoard) {
  const currentBoards: TaskBoard[] = await fetchBoards();

  const newBoards = [...currentBoards, newBoard];
  localStorage.setItem("react-task-tracker-boards", JSON.stringify(newBoards));
  return newBoards;
}

async function updateBoard({
  boardId,
  task,
  boards,
}: {
  boardId?: string;
  task: Task;
  boards: TaskBoard[];
}) {
  if (!boardId) return;
  const board = await getBoardById(boardId);
  const boardColumns = board.taskColumns;
  const columnToUpdate = boardColumns.find((col) => col.status === task.status);
  if (!columnToUpdate) {
    console.log("we hit here :(");
    return null;
  }
  const currentColumns = boardColumns.filter(
    (col) => col.status !== task.status
  );
  const updatedColumn: TaskColumn = {
    title: columnToUpdate.title,
    status: columnToUpdate.status,
    tasks: [...columnToUpdate.tasks, task],
  };

  const updatedColumns = [...currentColumns];
  const updatedBoard: TaskBoard = {
    ...board,
    taskColumns: [...updatedColumns, updatedColumn],
  };

  const filteredBoards = boards.filter(({ id }) => id !== boardId);
  const newBoards = [...filteredBoards, updatedBoard];
  console.log("newBoards", newBoards);
  localStorage.setItem("react-task-tracker-boards", JSON.stringify(newBoards));
  return updatedBoard;
}

async function deleteBoard(boardId: string) {
  const boards: TaskBoard[] = await fetchBoards();
  localStorage.setItem(
    "react-task-tracker-boards",
    JSON.stringify(boards.filter(({ id }) => id !== boardId))
  );
  return boards.filter(({ id }) => id !== boardId);
}

export function useBoards(callback?: () => void) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["react-task-tracker-boards"],
    queryFn: () => fetchBoards(),
    initialData: [],
  });

  function successHandler() {
    if (callback) {
      callback();
    }

    refetch();
  }

  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: successHandler,
  });

  const deleteBoardMutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: successHandler,
  });

  const updateBoardMutation = useMutation({
    mutationFn: updateBoard,
    onSuccess: successHandler,
  });

  return {
    boards: data as TaskBoard[],
    error,
    isLoading,
    getBoardById: (id: string) => getBoardById(id),
    deleteBoard: (id: string) => deleteBoardMutation.mutate(id),
    createBoard: (newBoard: TaskBoard) => createBoardMutation.mutate(newBoard),
    updateBoard: ({ boardId, task }: { boardId?: string; task: Task }) =>
      updateBoardMutation.mutate({ boardId, task, boards: data }),
  };
}
