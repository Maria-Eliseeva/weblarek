import { Card } from "./Card";
import { CardCatalogData } from "../../types";
import { categoryMap } from "../../utils/constants";

export class CardCatalog extends Card {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected openButton: HTMLButtonElement;

  constructor(data: CardCatalogData) {
    super("card-catalog");

    this.categoryElement = this.container.querySelector(
      ".card__category"
    ) as HTMLElement;
    this.imageElement = this.container.querySelector(
      ".card__image"
    ) as HTMLImageElement;
    this.openButton = this.container as HTMLButtonElement;
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
    this.imageElement.src = src;
  }

  render(data: Partial<CardCatalogData>): HTMLElement {
    super.render(data);
    if (data.category) this.category = data.category;
    if (data.image) this.image = data.image;
    return this.container;
  }
}
