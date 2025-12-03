import { Form } from "./Form";

export class FormContacts extends Form {
  public emailInput: HTMLInputElement;
  public phoneInput: HTMLInputElement;

  constructor(templateId: string) {
    super(templateId);
    this.emailInput = this.container.querySelector("input[name='email']") as HTMLInputElement;
    this.phoneInput = this.container.querySelector("input[name='phone']") as HTMLInputElement;
  }
}
