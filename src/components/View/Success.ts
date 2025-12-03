import { Component } from "../base/Component";
import { SuccessData } from "../../types/index";

export class Success extends Component<SuccessData> {
  private descriptionElement: HTMLElement;
  public closeButton: HTMLButtonElement;

  constructor() {
    const template = document.getElementById("success") as HTMLTemplateElement;
    if (!template) throw new Error("Template success не найден");

    const container = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    super(container);

    this.descriptionElement = this.container.querySelector(
      ".order-success__description"
    ) as HTMLElement;

    this.closeButton = this.container.querySelector(
      ".order-success__close"
    ) as HTMLButtonElement;
  }

  set description(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
