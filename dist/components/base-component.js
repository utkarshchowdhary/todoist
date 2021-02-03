export class Component {
    constructor(templateId, hostElementId, className, id) {
        this.templateElement = document.querySelector(`#${templateId}`);
        this.hostElement = document.querySelector(`#${hostElementId}`);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (className) {
            this.element.classList.add(className);
        }
        if (id) {
            this.element.id = id;
        }
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}
