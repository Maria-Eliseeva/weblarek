import { Card } from "./Card";
import { CDN_URL } from "../../utils/constants";
import { categoryMap } from "../../utils/constants";
import { EventEmitter } from "../base/Events";
import { CardPreviewData } from "../../types";

export class CardPreview extends Card {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;
  private textElement: HTMLElement;
  public toBasketButton: HTMLButtonElement;

  constructor(private events: EventEmitter) {
    super("card-preview");

    this.categoryElement = this.container.querySelector(
      ".card__category"
    ) as HTMLElement;
    this.imageElement = this.container.querySelector(
      ".card__image"
    ) as HTMLImageElement;
    this.textElement = this.container.querySelector(
      ".card__text"
    ) as HTMLElement;
    this.toBasketButton = this.container.querySelector(
      ".card__button"
    ) as HTMLButtonElement;
    this.addEvents();
  }
  private addEvents() {
    this.toBasketButton.addEventListener("click", () => {
      this.events.trigger("card:buy", { id: this._id })();
    });
  }
  set category(name: string) {
    this.categoryElement.textContent = name;

    Array.from(this.categoryElement.classList).forEach((cls) => {
      if (cls.includes("card__category_")) {
        this.categoryElement.classList.remove(cls);
      }
    });
    const modifier: string = categoryMap[name as keyof typeof categoryMap];
    if (modifier) {
      this.categoryElement.classList.add(modifier);
    }
  }

  set image(src: string) {
    this.setImage(this.imageElement, CDN_URL + src);
  }

  set text(value: string) {
    this.textElement.textContent = value;
  }

  set toBasket(data: "Недоступно" | "Купить" | "Удалить из корзины") {
    this.toBasketButton.textContent = data;
    if (data === "Недоступно") {
      this.toBasketButton.disabled = true;
    } else {
      this.toBasketButton.disabled = false;
    }
  }
  render(data: Partial<CardPreviewData>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
