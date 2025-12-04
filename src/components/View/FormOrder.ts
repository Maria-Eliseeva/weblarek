import { Form } from "./Form";
import { EventEmitter } from "../base/Events";
import { IFormData } from "../../types/index";

export class FormOrder extends Form {
  public cardButton: HTMLButtonElement;
  public cashButton: HTMLButtonElement;
  public addressInput: HTMLInputElement;

  constructor(protected events: EventEmitter) {
    super(events, "order");
    this.cardButton = this.container.querySelector(
      "button[name='card']"
    ) as HTMLButtonElement;
    this.cashButton = this.container.querySelector(
      "button[name='cash']"
    ) as HTMLButtonElement;
    this.addressInput = this.container.querySelector(
      "input[name='address']"
    ) as HTMLInputElement;

    this.addEvents();
  }

  private addEvents() {
    this.container.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.matches("button[name='card']")) {
        this.events.trigger("cardPay:select")();
      }
      if (target.matches("button[name='cash']")) {
        this.events.trigger("cashPay:select")();
      }
    });

    this.container.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.matches("input[name='address']")) {
        this.events.trigger("address:input", { address: target.value })();
        this.events.trigger("formOrder:change")();
      }
    });

    this.postButton.addEventListener(
      "click",
      this.events.trigger("nextform:open")
    );
  }
  set payment(type: "card" | "cash") {
    if (type === "card") {
      this.cardButton.classList.add("button_alt-active");
      this.cashButton.classList.remove("button_alt-active");
    } else if (type === "cash") {
      this.cashButton.classList.add("button_alt-active");
      this.cardButton.classList.remove("button_alt-active");
    }
  }

  set address(address: string) {
    this.addressInput.value = address;
  }

  public update(data: Partial<IFormData>) {
    if (!data) return;
    if (data.payment) this.payment = data.payment;
    if (data.address) this.address = data.address;
    if (data.errors) this.errors = data.errors;
  }
}
