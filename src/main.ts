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
import { CardCatalogData, IProduct, CardPreviewData, IFormData, IvalidateResult } from "./types/index";
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
  };
}
function toCatalogData(product: IProduct): CardCatalogData {
  return {
    title: product.title,
    price: product.price || 0,
    image: product.image,
    category: product.category,
  };
}

const events = new EventEmitter();
const gallery = new Gallery();
const header = new Header(events);
products = catalogModel.getProducts();

//catalog-product
const elementCatalogToProduct = new Map<HTMLElement, IProduct>();

const cardCatalogElements: HTMLElement[] = products.map((product) => {
  const cardCatalog = new CardCatalog(events);
  const elCatalog = cardCatalog.render(toCatalogData(product));
  elementCatalogToProduct.set(elCatalog, product);
  return elCatalog;
});

gallery.catalog = cardCatalogElements;

const modal = new Modal(events);
//product-preview
const productToPreview = new Map<IProduct, CardPreview>();
//basket-product
const basketToProduct = new Map<CardBasket, IProduct>();

events.on(
  "card:select",
  (payload: { element: HTMLElement; elemOfClass: CardPreview }) => {
    const product = elementCatalogToProduct.get(payload.element);
    if (!product) {
      console.log("нет в каталоге");
      return;
    }
    catalogModel.saveCurrentProduct(product);
    let preview = productToPreview.get(product);
    if (!preview) {
      preview = new CardPreview(events);
      productToPreview.set(product, preview);
    }
    modal.content = preview.render(toPreviewData(product));
    preview.toBasket = toPreviewData(product).buttonText;
    modal.show();
  }
);
events.on("modal:close", () => {
  modal.hide();
});
events.on("card:buy", (payload: { element: HTMLElement; elemOfClass: CardPreview }) => {
  const productEntry = Array.from(productToPreview.entries()).find(
    ([product, preview]) => preview === payload.elemOfClass
  );
  if (!productEntry) {
    console.log("Не нашли продукт для превью", payload.elemOfClass);
    return;
  }
  const [product] = productEntry;

  if (!basketModel.isProductIn(product.id)) {
    basketModel.addProduct(product);
    payload.elemOfClass.toBasket = "Удалить из корзины";
  } else {
    basketModel.removeProduct(product);
    payload.elemOfClass.toBasket = "Купить";
  }

  payload.elemOfClass.render(toPreviewData(product));

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
      let cardBasket = new CardBasket(events);
      basketToProduct.set(cardBasket, item);
      return cardBasket.render({
        title: item.title,
        index: index+1,
        price: item.price || 0,
      });
    }),
    price: basketModel.getTotalPrice(),
  });
}

events.on("card:delete",
  (payload: { element: HTMLElement; elemOfClass: CardBasket }) => {
    const product = basketToProduct.get(payload.elemOfClass);
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

let formOrder:FormOrder; 

events.on("basket:makeOrder", () => {
  if (basketModel.getTotalCount() === 0) return;
  formOrder = new FormOrder(events);
  const data = buyerModel.getBuyerData() as IFormData;
  formOrder.update(data);     
  modal.content = formOrder.render(data);
  modal.show();
});

events.on("formOrder:change", () => {
  if (!formOrder) return;

  const errors = buyerModel.validate();

  if (!errors.payment && !errors.address) {
    formOrder.postButton.disabled = false;
    formOrder.postButton.classList.add('button_active'); 
  } else {
    formOrder.postButton.disabled = true;
    formOrder.postButton.classList.remove('button_active');
  }
});

const updateButtonState = (
  fields: (keyof IFormData)[],
  form: Form | null
) => {
  if (!form) return;

  const errors = buyerModel.validate();

  const isValid = fields.every((field) => !(errors[field as keyof IvalidateResult]));

  form.postButton.disabled = !isValid;

  if (isValid) {
    form.postButton.classList.add('button_active');
    form.errors='';
  } else {
    form.postButton.classList.remove('button_active');
    form.errors=Object.values(buyerModel.validate()).join(', ');
    
  }
};

events.on("formOrder:change", () => {
  updateButtonState(['address', 'payment'], formOrder);
});

events.on("cardPay:select", () => {
  buyerModel.savePayment("card");
  console.log("Сохранили оплата:", buyerModel)
  formOrder.payment = "card";
  events.trigger("formOrder:change")();
});

events.on("cashPay:select", () => {
  buyerModel.savePayment("cash");
  console.log("Сохранили оплата:", buyerModel)
  formOrder.payment = "cash";
  events.trigger("formOrder:change")();
});

events.on("address:input", (payload: { address: string }) => {
  buyerModel.saveAddress(payload.address);
  console.log("Сохранили адрес:", buyerModel)
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
  console.log("Сохранили почту:", buyerModel)
});

events.on("phone:input", (payload: { phone: string }) => {
  buyerModel.savePhone(payload.phone);
  console.log("Сохранили номер:", buyerModel)
  events.trigger("formContacts:change")();
});


events.on("formContacts:change", () => {
  updateButtonState(['email', 'phone'], formContacts);
});

events.on("nextform:submit", () => {
  const data = buyerModel.getBuyerData();
  if (!data) return;

  const success = new Success();
  modal.content = success.render({description: basketModel.getTotalPrice()}); 
  modal.show();
  success.closeButton.addEventListener("click", () => {
    modal.hide();
  });
  basketModel.clean();
  console.log("Заказ завершён:", data);
});
