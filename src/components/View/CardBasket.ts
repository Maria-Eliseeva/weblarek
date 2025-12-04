import { Card } from "./Card";
import { CardBasketData } from "../../types";
import { EventEmitter } from "../base/Events";

export class CardBasket extends Card {
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;

  constructor(private events: EventEmitter) {
    super("card-basket");

    this.indexElement = this.container.querySelector(".basket__item-index") as HTMLElement;
    this.deleteButton = this.container.querySelector(".basket__item-delete") as HTMLButtonElement;

    this.addEvents()
  }

  private addEvents() {
    this.deleteButton.addEventListener(
      "click",
      this.events.trigger("card:delete", { element: this.container, elemOfClass: this })
    );
  }

  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }

  render(data: Partial<CardBasketData>): HTMLElement {
    super.render(data);
    this.indexElement.textContent = data.index?.toString() || '0';
    return this.container;
  }
}
