export class Component<T extends HTMLElement, U extends HTMLElement> {
  protected templateElement: HTMLTemplateElement;
  protected hostElement: T;
  protected element: U;

  constructor(templateId: string, hostElementId: string, className?: string) {
    this.templateElement = document.querySelector(
      `#${templateId}`
    ) as HTMLTemplateElement;

    this.hostElement = document.querySelector(`#${hostElementId}`) as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedNode.firstElementChild as U;

    if (className) this.element.classList.add(className);

    this.attach();
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}
