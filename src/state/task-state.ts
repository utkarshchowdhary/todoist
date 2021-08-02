import { Task, TaskStatus } from "../models/task-model";

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addlistener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class TaskState extends State<Task> {
  private static instance: TaskState;
  private tasks: Task[] = [];

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new TaskState();
    }

    return this.instance;
  }

  addTask(title: string, description: string) {
    const task = new Task(
      Date.now().toString(),
      title,
      description,
      TaskStatus.Active
    );
    this.tasks.push(task);
    this.runListeners();
  }

  moveTask(taskId: string, taskStatusToMove: TaskStatus) {
    const task = this.tasks.find((task) => task.id === taskId);

    if (task && task.status !== taskStatusToMove) {
      task.status = taskStatusToMove;
      this.runListeners();
    }
  }

  private runListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.tasks.slice());
    }
  }
}

export const taskState = TaskState.getInstance();
