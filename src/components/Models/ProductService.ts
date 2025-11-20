import { IApi, IProduct, IOrderRequest, IOrderResult, IProductListResponse } from '../../types/index';

export class ProductService {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProductList(): Promise<IProduct[]> {
        const response: IProductListResponse = await this.api.get<IProductListResponse>('/product/');
        return response.items;
    }

    async createOrder(order: IOrderRequest): Promise<IOrderResult> {
        const response: IOrderResult = await this.api.post<IOrderResult>('/order/', order);
        return response;
    }
}