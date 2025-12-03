import { Component } from "../base/Component";
import { HeaderData } from "../../types/index";

export class Header extends Component<HeaderData> {
  private basketButton: HTMLButtonElement;
  private counterElement: HTMLElement;

  constructor() {
    const container = document.querySelector(".header") as HTMLElement;
    super(container);

    this.basketButton = this.container.querySelector(
      ".header__basket"
    ) as HTMLButtonElement;
    this.counterElement = this.container.querySelector(
      ".header__basket-counter"
    ) as HTMLElement;
  }
  set counter(value: number) {
    if (value < 0) {
      throw new Error("Количество товаров не может быть отрицательным");
    }
    this.counterElement.textContent = value.toString();
  }
}
