import { Component } from "./base-component.js";

export class Header extends Component<HTMLDivElement, HTMLElement> {
  constructor() {
    super("header", "app");
  }
}
