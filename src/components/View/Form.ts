import { IFormData } from "../../types/index";
import { Component } from "../base/Component";

export class Form extends Component<IFormData> {
  public postButton: HTMLButtonElement;
  public errorsElement: HTMLElement;

  constructor(templateId: string) {
    const template = document.getElementById(templateId) as HTMLTemplateElement;
    const root = template.content.firstElementChild as HTMLElement;
    super(root.cloneNode(true) as HTMLFormElement);

    this.postButton = this.container.querySelector(
      "button[type='submit']"
    ) as HTMLButtonElement;
    this.errorsElement = this.container.querySelector(
      ".form__errors"
    ) as HTMLElement;
  }

  set errors(data: string) {
    this.errorsElement.textContent = data;
  }
}
