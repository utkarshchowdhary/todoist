import { Component } from "./base-component";

export class Header extends Component<HTMLDivElement, HTMLElement> {
  constructor() {
    super("header", "app");
  }
}
