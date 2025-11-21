import { IProduct } from "../../types/index";

export class Catalog {
  protected products: IProduct[] = [];
  protected currentProduct: IProduct | undefined;

  constructor() {}

  saveProducts(data: IProduct[]): void {
    this.products = data;
  }
  saveCurrentProduct(data: IProduct | undefined): void {
    this.currentProduct = data;
  }
  getProducts(): IProduct[] {
    return this.products;
  }
  getCurrentProduct(): IProduct | undefined {
    return this.currentProduct;
  }
  getProductId(id: string): IProduct | null {
    return this.products.find((product) => product.id === id) || null;
  }
}
