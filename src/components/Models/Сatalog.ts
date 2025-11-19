interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export class Catalog {
    protected products: IProduct[];
    protected currentProduct: IProduct|undefined;

    constructor(products: IProduct[],currentProduct?: IProduct) {
      this.products=products;
      this.currentProduct = currentProduct;
    };

    saveProducts(data: IProduct[]): void{
      this.products=data;
    }
    saveCurrentProduct(data: IProduct|undefined): void{
      this.currentProduct=data;
    }
    getProducts(): IProduct[]{
      return this.products;
    }
    getCurrentProduct(): IProduct|undefined{
      return this.currentProduct;
    }
    getProductId(id: string): IProduct | null {
    return this.products.find(product => product.id === id) || null;
}
}
