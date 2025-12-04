export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export type TPayment = "card" | "cash";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
//get получили
export interface IProductListResponse {
  total: number;
  items: IProduct[];
}
//post получили
export interface IOrderResult {
  id: string;
  total: number;
}
//post отправляем
export interface IOrderRequest extends IBuyer {
  total: number;
  items: string[];
}

export interface IvalidateResult {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface HeaderData {
  counter: number;
}

export interface GalleryData {
  catalog: HTMLElement[];
}

export interface ModalData {
  content: HTMLElement;
}

export interface SuccessData {
  description: number;
}

export interface CardData {
  title: string;
  price: number;
}

export interface CardCatalogData extends CardData {
  category: string;
  image: string;
}

export interface CardPreviewData extends CardCatalogData {
  text: string;
  buttonText: "Недоступно" | "Купить" | "Удалить из корзины";
}

export interface CardBasketData extends CardData {
  index: number;
}

export interface BasketData {
  list: HTMLElement[];
  price: number;
}

export interface IFormData {
  errors?: string;
  payment?: TPayment;
  address?: string;
  email?: string;
  phone?:string;
}