import { Header } from "./components/header.js";
import { TaskInput } from "./components/task-input.js";
import { TaskList } from "./components/task-list.js";

new Header();
new TaskInput();
new TaskList("active");
new TaskList("completed");
