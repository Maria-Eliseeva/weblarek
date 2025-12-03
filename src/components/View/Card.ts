import { CardData } from "../../types";
import { Component } from "../base/Component";

export class Card extends Component<CardData>  {

  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(templateId: string) {
    const template = document.getElementById(templateId) as HTMLTemplateElement;
    if (!template) throw new Error(`Template ${templateId} не найден`);

    const root = template.content.firstElementChild as HTMLElement;
    const container = root.cloneNode(true) as HTMLElement;

    super(container);

    this.titleElement = this.container.querySelector(".card__title") as HTMLElement;
    this.priceElement = this.container.querySelector(".card__price") as HTMLElement;
  }

  set title(name: string) {
    this.titleElement.textContent = name;
  }

  set price(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

}
