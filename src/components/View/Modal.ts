import { Component } from "../base/Component";
import { ModalData } from "../../types/index";

export class Modal extends Component<ModalData> {
  private contentElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor() {
    const container = document.getElementById("modal-container") as HTMLElement;
    super(container);

    this.contentElement = this.container.querySelector(
      ".modal__content"
    ) as HTMLElement;
    this.closeButton = this.container.querySelector(
      ".modal__close"
    ) as HTMLButtonElement;
  }

  set content(data: HTMLElement) {
    this.contentElement.replaceChildren(data);
  }

  show() {
    this.container.classList.add("modal_active");
  }

  hide() {
    this.container.classList.remove("modal_active");
  }
}
