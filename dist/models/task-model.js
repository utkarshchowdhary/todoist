export var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["Active"] = 0] = "Active";
    TaskStatus[TaskStatus["Completed"] = 1] = "Completed";
})(TaskStatus || (TaskStatus = {}));
export class Task {
    constructor(id, title, description, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
    }
}
