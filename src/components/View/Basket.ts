import { Component } from "../base/Component";
import { BasketData } from "../../types/index";
import { EventEmitter } from "../base/Events";

export class Basket extends Component<BasketData> {
  public listElement: HTMLElement;
  public makeOrderButton: HTMLButtonElement;
  private priceElement: HTMLElement;

  constructor(private events: EventEmitter) {
    const template = document.getElementById("basket") as HTMLTemplateElement;
    const root = template.content.firstElementChild as HTMLElement;
    const container = root.cloneNode(true) as HTMLElement;

    super(container);

    this.listElement = this.container.querySelector(
      ".basket__list"
    ) as HTMLElement;
    this.makeOrderButton = this.container.querySelector(
      ".basket__button"
    ) as HTMLButtonElement;
    this.priceElement = this.container.querySelector(
      ".basket__price"
    ) as HTMLElement;
    this.addEvents();
  }
  private addEvents() {
    this.makeOrderButton.addEventListener("click", () => {
      this.events.trigger("basket:makeOrder")();
    });
  }

  set list(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
    if (items.length === 0) {
      this.makeOrderButton.disabled=true;
    }
    else{
      this.makeOrderButton.disabled=false;
    }
  }

  set price(value: number) {
    if (value < 0) throw new Error("Цена не может быть отрицательной");
    this.priceElement.textContent = `${value} синапсов`;
  }
}
