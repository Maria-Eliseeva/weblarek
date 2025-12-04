import { Form } from "./Form";
import { EventEmitter } from "../base/Events";
import { IFormData } from "../../types/index";

export class FormContacts extends Form {
  public emailInput: HTMLInputElement;
  public phoneInput: HTMLInputElement;

  constructor(protected events: EventEmitter) {
    super(events, "contacts");

    this.emailInput = this.container.querySelector(
      "input[name='email']"
    ) as HTMLInputElement;

    this.phoneInput = this.container.querySelector(
      "input[name='phone']"
    ) as HTMLInputElement;

    this.addEvents();
  }

  private addEvents() {
    this.container.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.matches("input[name='email']")) {
        this.events.trigger("email:input", { email: target.value })();
        this.events.trigger("formContacts:change")();
      }
      if (target.matches("input[name='phone']")) {
        this.events.trigger("phone:input", { phone: target.value })();
        this.events.trigger("formContacts:change")();
      }
    });

    this.postButton.addEventListener(
      "click",
      this.events.trigger("nextform:submit")
    );
  }

  public update(data: Partial<IFormData>) {
    if (!data) return;
    if (data.email) this.emailInput.value = data.email;
    if (data.phone) this.phoneInput.value = data.phone;
    if (data.errors) this.errors = data.errors;
  }
}
