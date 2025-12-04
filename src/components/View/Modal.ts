import { Component } from "../base/Component";
import { ModalData } from "../../types/index";
import { EventEmitter } from "../base/Events";

export class Modal extends Component<ModalData> {
  private contentElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(private events: EventEmitter) {
    const container = document.getElementById("modal-container") as HTMLElement;
    super(container);

    this.contentElement = this.container.querySelector(
      ".modal__content"
    ) as HTMLElement;
    this.closeButton = this.container.querySelector(
      ".modal__close"
    ) as HTMLButtonElement;
    this.addEvents();
  }
  private addEvents() {
    this.closeButton.addEventListener(
        "click",()=>
        this.events.trigger("modal:close")()
    );
  
    
    this.container.addEventListener("click", (e: MouseEvent) => {
        if (e.target === this.container) {
            this.events.trigger("modal:close")();
        }
    });
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
