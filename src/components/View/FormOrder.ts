import { Form } from "./Form";

export class FormOrder extends Form {
  public cardButton: HTMLButtonElement;
  public cashButton: HTMLButtonElement;
  public addressInput: HTMLInputElement;

  constructor(templateId: string) {
    super(templateId);
    this.cardButton = this.container.querySelector(
      "button[name='card']"
    ) as HTMLButtonElement;
    this.cashButton = this.container.querySelector(
      "button[name='cash']"
    ) as HTMLButtonElement;
    this.addressInput = this.container.querySelector(
      "input[name='address']"
    ) as HTMLInputElement;
  }
  set payment(type: "card" | "cash") {
    if (type === "card") {
      this.cardButton.classList.add("button_alt-active");
      this.cashButton.classList.remove("button_alt-active");
    } else if (type === "cash") {
      this.cardButton.classList.remove("button_alt-active");
      this.cashButton.classList.add("button_alt-active");
    }
  }
}
