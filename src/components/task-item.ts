import { Component } from "./base-component";
import { Draggable } from "../models/drag-drop";
import { Task } from "../models/task-model";

export class TaskItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private task: Task;

  constructor(hostId: string, task: Task) {
    super("single-task", hostId);
    this.task = task;

    this.configure();
    this.renderContent();
  }

  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.task.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  private configure() {
    this.element.addEventListener(
      "dragstart",
      this.dragStartHandler.bind(this)
    );
  }

  private renderContent() {
    this.element.querySelector("h2")!.textContent = this.task.title;
    this.element.querySelector("p")!.textContent = this.task.description;
  }
}
