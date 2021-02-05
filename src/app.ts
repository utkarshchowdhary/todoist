import { Header } from "./components/header";
import { TaskInput } from "./components/task-input";
import { TaskList } from "./components/task-list";

new Header();
new TaskInput();
new TaskList("active");
new TaskList("completed");
