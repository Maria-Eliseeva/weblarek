import "./scss/styles.scss";
import { Catalog } from "./components/Models/Сatalog";
import { Basket } from "./components/Models/Bascket";
import { Buyer } from "./components/Models/Buyer";
import { ProductService } from "./components/Models/ProductService";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { Gallery } from "./components/View/Gallery";
import { Header } from "./components/View/Header";
import { CardCatalog } from "./components/View/CardCatalog";
import {
  CardCatalogData,
  IProduct,
  CardPreviewData,
  IFormData,
  IvalidateResult,
  IOrderRequest,
  IBuyer,
} from "./types/index";
import { EventEmitter } from "./components/base/Events";
import { Modal } from "./components/View/Modal";
import { Basket as BasketView } from "./components/View/Basket";
import { CardPreview } from "./components/View/CardPreview";
import { CardBasket } from "./components/View/CardBasket";
import { FormOrder } from "./components/View/FormOrder";
import { Form } from "./components/View/Form";
import { FormContacts } from "./components/View/FormContacts";
import { Success } from "./components/View/Success";

const catalogModel = new Catalog();
const basketModel = new Basket();
const buyerModel = new Buyer();
const myApi = new Api(API_URL);
const productService = new ProductService(myApi);

let products = await productService.getProductList();
catalogModel.saveProducts(products);
console.log("Каталог товаров с сервера:", catalogModel.getProducts());

function toPreviewData(product: IProduct): CardPreviewData {
  let txt: "Недоступно" | "Купить" | "Удалить из корзины";
  if (basketModel.isProductIn(product.id)) {
    txt = "Удалить из корзины";
  } else {
    txt = product.price ? "Купить" : "Недоступно";
  }
  return {
    title: product.title,
    price: product.price || 0,
    image: product.image,
    category: product.category,
    text: product.description,
    buttonText: txt,
    id: product.id,
  };
}
function toCatalogData(product: IProduct): CardCatalogData {
  return {
    title: product.title,
    price: product.price || 0,
    image: product.image,
    category: product.category,
    id: product.id,
  };
}

const events = new EventEmitter();
const gallery = new Gallery();
const header = new Header(events);
products = catalogModel.getProducts();

const cardCatalogElements: HTMLElement[] = products.map((product) => {
  const cardCatalog = new CardCatalog(events);
  const elCatalog = cardCatalog.render(toCatalogData(product));
  return elCatalog;
});

gallery.catalog = cardCatalogElements;

const modal = new Modal(events);

let currentPreview: CardPreview | null;

events.on("card:select", (payload: { id: string }) => {
  const product = catalogModel.getProductId(payload.id);
  if (!product) {
    console.log("нет в каталоге: ", payload.id);
    return;
  }
  catalogModel.saveCurrentProduct(product);

  const preview = new CardPreview(events);
  modal.content = preview.render(toPreviewData(product));
  preview.toBasket = toPreviewData(product).buttonText;

  currentPreview = preview;
  modal.show();
});

events.on("modal:close", () => {
  modal.hide();
});

events.on("card:buy", (payload: { id: string }) => {
  const product = catalogModel.getProductId(payload.id);
  if (!product) return;

  if (!basketModel.isProductIn(product.id)) {
    basketModel.addProduct(product);
  } else {
    basketModel.removeProduct(product);
  }

  if (currentPreview) {
    currentPreview.toBasket = basketModel.isProductIn(product.id)
      ? "Удалить из корзины"
      : "Купить";
  }

  header.counter = basketModel.getTotalCount();
});

let basket: BasketView = new BasketView(events);
events.on("basket:select", () => {
  basket = new BasketView(events);
  modal.content = modal.content = createBasket();
  modal.show();
});

function createBasket(): HTMLElement {
  return basket.render({
    list: basketModel.getProducts().map((item, index) => {
      const cardBasket = new CardBasket(events);
      return cardBasket.render({
        title: item.title,
        index: index + 1,
        price: item.price || 0,
        id: item.id,
      });
    }),
    price: basketModel.getTotalPrice(),
  });
}

events.on("card:delete", (payload: { id: string }) => {
  console.log("пытаемся удалить id: ", payload.id);
  const product = basketModel
    .getProducts()
    .find((item) => item.id === payload.id);
  if (!product) {
    console.log("нет в каталоге");
    return;
  }
  basketModel.removeProduct(product);
  console.log("удалили", product);
  console.log("теперь корзина", basketModel.getProducts());
  header.counter = basketModel.getTotalCount();
  modal.content = createBasket();
  modal.show();
});

let formOrder: FormOrder;

events.on("basket:makeOrder", () => {
  if (basketModel.getTotalCount() === 0) return;
  buyerModel.clean();
  formOrder = new FormOrder(events);
  const data = buyerModel.getBuyerData() as IFormData;
  formOrder.update(data);
  modal.content = formOrder.render(data);
  modal.show();
});

events.on("formOrder:change", () => {
  if (!formOrder) return;

  const errors = buyerModel.validate();
  formOrder.valid = !errors.payment && !errors.address;
});

const updateButtonState = (fields: (keyof IFormData)[], form: Form | null) => {
  if (!form) return;

  const errors = buyerModel.validate();

  const isValid = fields.every(
    (field) => !errors[field as keyof IvalidateResult]
  );

  form.valid = isValid;

  if (isValid) {
    form.errors = "";
  } else {
    const formErrors = [];

    for (const field of fields) {
      const error = errors[field as keyof IvalidateResult];
      formErrors.push(error);
    }
    form.errors = formErrors.join(" ");
  }
};

events.on("formOrder:change", () => {
  updateButtonState(["address", "payment"], formOrder);
});

events.on("cardPay:select", () => {
  buyerModel.savePayment("card");
  console.log("Сохранили оплата:", buyerModel);
  formOrder.payment = "card";
  events.trigger("formOrder:change")();
});

events.on("cashPay:select", () => {
  buyerModel.savePayment("cash");
  console.log("Сохранили оплата:", buyerModel);
  formOrder.payment = "cash";
  events.trigger("formOrder:change")();
});

events.on("address:input", (payload: { address: string }) => {
  buyerModel.saveAddress(payload.address);
  console.log("Сохранили адрес:", buyerModel);
  events.trigger("formOrder:change")();
});

let formContacts: FormContacts;

events.on("nextform:open", () => {
  formContacts = new FormContacts(events);
  const data = buyerModel.getBuyerData() as IFormData;
  formContacts.update(data);
  modal.content = formContacts.render(data);
  modal.show();
});

events.on("email:input", (payload: { email: string }) => {
  buyerModel.saveEmail(payload.email);
  events.trigger("formContacts:change")();
  console.log("Сохранили почту:", buyerModel);
});

events.on("phone:input", (payload: { phone: string }) => {
  buyerModel.savePhone(payload.phone);
  console.log("Сохранили номер:", buyerModel);
  events.trigger("formContacts:change")();
});

events.on("formContacts:change", () => {
  updateButtonState(["email", "phone"], formContacts);
});

events.on("nextform:submit", async () => {
  const data = buyerModel.getBuyerData();
  if (!data) return;

  try {
    const order: IOrderRequest = {
      ...(buyerModel.getBuyerData() as IBuyer),
      total: basketModel.getTotalPrice(),
      items: basketModel.getProducts().map((item) => item.id),
    };
    console.log("Пытаемся отправить на сервер: ", order);
    const result = await productService.createOrder(order);
    if (result.total === order.total) {
      const success = new Success();
      modal.content = success.render({
        description: result.total,
      });
      modal.show();
      basketModel.clean();
      buyerModel.clean();
      header.counter = basketModel.getTotalCount();
      console.log("Заказ завершён:", result);
      success.closeButton.addEventListener("click", () => {
        modal.hide();
      });
    } else {
      console.log("Ошибка при создании заказа:", result.id);
    }
  } catch (e) {
    console.log("Ошибка при отправке заказа на сервер");
  }
});
