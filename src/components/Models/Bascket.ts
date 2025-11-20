import {IProduct} from '../../types/index';

export class Basket {
    private products: IProduct[];

    constructor() {
      this.products = [];
    }

    getProducts(): IProduct[] {
      return this.products;
    }

    addProduct(product: IProduct): void {
      this.products.push(product);
    }

    removeProduct(product: IProduct): void {
      this.products = this.products.filter(item => item.id !== product.id);
    }

    clean(): void {
      this.products = [];
    }

    getTotalPrice(): number {
      return this.products.reduce((total, product) => {
        return total + (product.price || 0);
      }, 0);
    }

    getTotalCount(): number {
      return this.products.length;
    }

    isProductIn(id: string): boolean {
      return this.products.some(product => product.id === id);
    }
}