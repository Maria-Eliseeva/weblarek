import { Component } from "../base/Component";
import { BasketData } from "../../types/index";

export class Basket extends Component<BasketData> {
  public listElement: HTMLElement;
  public makeOrderButton: HTMLButtonElement;
  private priceElement: HTMLElement;

  constructor() {
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
  }

  set list(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  set price(value: number) {
    if (value < 0) throw new Error("Цена не может быть отрицательной");
    this.priceElement.textContent = `${value} синапсов`;
  }
}
