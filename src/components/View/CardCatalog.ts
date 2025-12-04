import { Card } from "./Card";
import {CDN_URL} from '../../utils/constants'
import { CardCatalogData } from "../../types";
import { categoryMap } from "../../utils/constants";
import { EventEmitter } from "../base/Events";

export class CardCatalog extends Card {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected openButton: HTMLButtonElement;

  constructor(private events: EventEmitter) {
    super("card-catalog");

    this.categoryElement = this.container.querySelector(
      ".card__category"
    ) as HTMLElement;
    this.imageElement = this.container.querySelector(
      ".card__image"
    ) as HTMLImageElement;
    this.openButton = this.container as HTMLButtonElement;

    this.addEvents();
  }

  private addEvents() {
    this.openButton.addEventListener(
      "click",
      this.events.trigger("card:select", { element: this.container, elemOfClass: this })
    );
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

  render(data: Partial<CardCatalogData>): HTMLElement {
    super.render(data);
    if (data.category) this.category = data.category;
    if (data.image) this.image = data.image;
    return this.container;
  }
}
