import { Card } from "./Card";
import { CardPreviewData } from "../../types";
import { categoryMap } from "../../utils/constants";

export class CardPreview extends Card {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;
  private textElement: HTMLElement;
  public toBasketButton: HTMLButtonElement;

  constructor(data: CardPreviewData) {
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
    this.setImage(this.imageElement, src);
  }

  set text(value: string) {
    this.textElement.textContent = value;
  }

  render(data: Partial<CardPreviewData>): HTMLElement {
    super.render(data);
    if (data.category) this.category = data.category;
    if (data.image) this.image = data.image;
    if (data.text) this.text = data.text;
    return this.container;
  }
}
