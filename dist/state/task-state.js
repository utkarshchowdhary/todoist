import { Task, TaskStatus } from "../models/task-model.js";
class State {
    constructor() {
        this.listeners = [];
    }
    addlistener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class TaskState extends State {
    constructor() {
        super();
        this.tasks = [];
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new TaskState();
        }
        return this.instance;
    }
    addTask(title, description) {
        const task = new Task(Date.now().toString(), title, description, TaskStatus.Active);
        this.tasks.push(task);
        this.runListeners();
    }
    moveTask(taskId, taskStatusToMove) {
        const task = this.tasks.find((task) => task.id === taskId);
        if (task && task.status !== taskStatusToMove) {
            task.status = taskStatusToMove;
            this.runListeners();
        }
    }
    runListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.tasks.slice());
        }
    }
}
export const taskState = TaskState.getInstance();
