import { Component } from "./base-component";
import { TaskItem } from "./task-item";
import { DragTarget } from "../models/drag-drop";
import { Task, TaskStatus } from "../models/task-model";
import { taskState } from "../state/task-state";

export class TaskList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  private tasks: Task[] = [];

  constructor(private type: "active" | "completed") {
    super("task-list", "app", type);

    this.configure();
    this.renderContent();
  }

  dragOverHandler = (event: DragEvent) => {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
    }
  };

  dropHandler = (event: DragEvent) => {
    const taskId = event.dataTransfer!.getData("text/plain");

    taskState.moveTask(
      taskId,
      this.type === "active" ? TaskStatus.Active : TaskStatus.Completed
    );
  };

  private configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);

    taskState.addlistener((tasks: Task[]) => {
      const revelantTasks = tasks.filter((task) => {
        if (this.type === "active") {
          return task.status === TaskStatus.Active;
        } else {
          return task.status === TaskStatus.Completed;
        }
      });
      this.tasks = revelantTasks;
      this.renderTasks();
    });
  }

  private renderTasks() {
    document.querySelector(`#tasks-${this.type}`)!.innerHTML = "";

    for (const task of this.tasks) {
      new TaskItem(`tasks-${this.type}`, task);
    }
  }

  private renderContent() {
    this.element.querySelector("ul")!.id = `tasks-${this.type}`;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} TASKS`;
  }
}
