import { GalleryData } from "../../types/index";
import { Component } from "../base/Component";

export class Gallery extends Component<GalleryData> {
  constructor() {
    const container = document.querySelector(".gallery") as HTMLElement;
    super(container);
  }

  set catalog(items: HTMLElement[]) {
    if (!Array.isArray(items)) {
      throw new Error("catalog должен быть массивом элементов");
    }
    this.container.replaceChildren(...items);
  }

}
