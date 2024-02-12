type Task = {
	id: string
	title: string;
	createdDate?: string;
	dueDate?: string;
	editedDate?: string;
	details?: string;
	priority: string;
	status?: string;
};

interface TaskColumn {
	title: string;
	status: string;
	tasks: Task[];
}

interface TaskBoard {
	title: string;
	id: string;
	taskColumns: TaskColumn[]
}