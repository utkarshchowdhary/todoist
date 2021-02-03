export enum TaskStatus {
  Active,
  Completed,
}

export class Task {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public status: TaskStatus
  ) {}
}
