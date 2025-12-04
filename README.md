# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

Для хранения информации о товаре реализован интерфейс:

```typescript
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

Чтобы сделать заказ собранную информацию о покупаетеле храним в интерфейсе

```typescript
interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
```

Задаёт тип запроса на сервер:

```typescript
type ApiPostMethods = "POST" | "PUT" | "DELETE";
```

Ограничивает способ оплаты:

```typescript
type TPayment = "card" | "cash";
```

Определяет методы для выполнения запросов к серверу:

```typescript
export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}
```

Описывает ответ сервера на GET-запрос списка товаров

```typescript
export interface IProductListResponse {
  total: number;
  items: IProduct[];
}
```

Описывает данные для отправки заказа на сервер:

```typescript
export interface IOrderResult {
  id: string;
  total: number;
}
```

Описывает ответ сервера на создание заказа:

```typescript
export interface IOrderRequest extends IBuyer {
  total: number;
  items: string[];
}
```

Объект с описанием ошибок при валидации в классе `Buyer`

```typescript
export interface IvalidateResult {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}
```

Объект для создания экземпляра `Header`, хранит счётсчик с количеством товаров в корзине

```typescript
export interface HeaderData {
  counter: number;
}
```

Объект для создания экземпляра `Gallery`, хранит массив карточек для отображения в каталоге

```typescript
export interface GalleryData {
  catalog: HTMLElement[];
}
```

Объект для создания экземпляра `Modal`, хранит элемент с контентом, который будет помещён в обёртку

```typescript
export interface ModalData {
  content: HTMLElement;
}
```

Объект для создания экземпляра `Success`, хранит текст о сумме списанных средств

```typescript
export interface SuccessData {
  description: number;
}
```

Объект для создания экземпляра `Card`, объект хранит название и цену товара

```typescript
export interface CardData {
  title: string;
  price: number;
}
```

Объект для создания экземпляра `CardCatalog`, объект хранит категорию и путь до изображения товара

```typescript
export interface CardCatalogData extends CardData {
  category: string;
  image: string;
}
```

Объект для создания экземпляра `CardPreview`, объект хранит информацию о товаре и текст для кнопки

```typescript
export interface CardPreviewData extends CardCatalogData {
  text: string;
  buttonText: "Недоступно" | "Купить" | "Удалить из корзины";
}
```

Объект для создания экземпляра `CardBasket`, объект хранит индекс товара в корзине

```typescript
export interface CardBasketData extends CardData {
  index: number;
}
```

Объект для создания экземпляра `Basket`, объект хранит массив товаров в корзине и их общую стоимость

```typescript
export interface BasketData {
  list: HTMLElement[];
  price: number;
}
```

Объект для создания экземпляра `Form`

```typescript
export interface IFormData {
  errors?: string;
  payment?: TPayment;
  address?: string;
  email?: string;
  phone?:string;
}
```

### Модели данных

Для учёта данных в приложении созданы три класса:

#### Класс Сatalog

Каталог товаров на главной странице. Отвечает за хранение товаров, которые можно купить в приложении;

Конструктор класса не принимает параметров.

Поля класса:  
`products: IProduct[]` - массив всех товаров;
`currentProduct: IProduct|undefined` - товар, выбранный для подробного отображения;

Методы класса:  
`saveProducts(data: IProduct[]): void` - сохранение массива товаров полученного в параметрах метода;
`saveCurrentProduct(data: IProduct|null): void` - сохранение товара для подробного отображения;
`getProducts(): IProduct[]` - получение массива товаров из модели;
`getCurrentProduct(): IProduct|undefined` - получение товара для подробного отображения.
`getProductId(id: string): IProduct|null` - получение одного товара по его id;

#### Класс Basket

Товары, которые пользователь выбрал для покупки;

Конструктор класса не принимает параметров.

Поля класса:  
`products: IProduct[]` - массив товаров, выбранных покупателем для покупки.

Методы класса:
`getProducts(): IProduct[]` - получение массива товаров, которые находятся в корзине;
`addProduct(product: IProduct): void` - добавление товара, который был получен в параметре, в массив корзины;
`removeProduct(product: IProduct): void` - удаление товара, полученного в параметре из массива корзины;
`clean(): void` - очистка корзины;
`getTotalPrice(): Number` - получение стоимости всех товаров в корзине;
`getTotalCount(): Number` - получение количества товаров в корзине;
`IsProductIn(id: string): Boolean` - проверка наличия товара в корзине по его id, полученного в параметр метода.

#### Класс Buyer

Отвечает за данные покупателя, которые тот должен указать при оформлении заказа.

Конструктор класса не принимает параметров.

Поля класса:  
`payment: TPayment | null = null;` - вид оплаты;
`email: string;` - адрес;
`phone: string;` - телефон;
`address: string;` - почта.

Методы класса:
`savePayment(payment: TPayment): void` - сохранение способа оплаты;  
`saveEmail(email: string): void` - сохранение email;  
`savePhone(phone: string): void` - сохранение телефона;  
`saveAddress(address: string): void` - сохранение адреса;
`getBuyerData(): BuyerData | null` - получение всех данных покупателя;
`clean(): void` - очистка всех данных покупателя;  
`validate(): { payment?: string; email?: string; phone?: string; address?: string }` - проверка корректности всех данных. Возвращает объект с ошибками валидации. Если поле отсутствует в объекте - ошибок нет. Если поле присутствует - значение содержит текст ошибки.

### Слой коммуникации

#### Класс ProductService

Отвечает за получение данных с сервера и отправку данных на сервер. При работе будем использовать функциональность класса API.

Конструктор:  
`constructor(api: IApi)` - В конструктор передается экземляр класса IApi

Поля:
`api: IApi` - Класс будет использовать композицию с IApi

Методы класса:  
`getProductList(): Promise<IProduct[]>` - выполняет GET-запрос на эндпоинт `/product/`. Использует метод `get` класса `IApi`, получает объект типа `IProductListResponse`, возвращает массив товаров из свойства `items`.

`createOrder(order: IOrderRequest): Promise<IOrderResult>` - выполняет POST-запрос на эндпоинт `/order/`. Использует метод post класса IApi, передает данные о заказе. Возвращает объект с результатом оформления заказа.

### Слой представления (View)

#### Класс Header

Отвечает за шапку сайта

Конструктор:  
`constructor(private events: EventEmitter)` - В конструктор передается EventEmitter для обработки событий

Поля:
- `private basketButton: HTMLButtonElement` - кнопка корзины в шапке сайта
- `private counterElement: HTMLElement` - элемент с счётчиком товаров в корзине

Методы класса:
- `private addEvents()` - добавляет обработчик события на кнопку корзины
- `set counter(value: number)` - меняет отображение счётчика товаров в корзине. Выбрасывает ошибку при отрицательном значении

#### Класс Gallery

Отвечает за список товаров в каталоге

Конструктор не принимает аргументов

Методы класса:  
`set catalog(items: HTMLElement[])` - задаёт переданный массив карточек

#### Класс Modal

Отвечает за обёртку в модальном окне

Конструктор:  
`constructor(private events: EventEmitter)` - В конструктор передается EventEmitter для обработки событий

Поля:
- `private contentElement: HTMLElement` - элемент, в котором будет отображаться контент модального окна
- `private closeButton: HTMLButtonElement` - кнопка закрытия модального окна

Методы класса:
- `private addEvents()` - добавляет обработчик события на кнопку закрытия модального окна
- `set content(data: HTMLElement)` - задаёт переданный элемент в модальное окно
- `show()` - добавляет класс modal_active и открывает модальное окно
- `hide()` - удаляет класс modal_active и закрывает модальное окно

#### Класс Success

Отвечает за окно подтверждения

Конструктор не принимает аргументов

Поля:
`descriptionElement: HTMLElement` - элемент, в котором будет отображаться сумма списанных средств
`closeButton: HTMLButtonElement` - кнопка закрытия модального окна

Методы класса:  
`set description(value: number)` - задаёт текст-описание с суммой

#### Класс Card

Родительский класс для карточек

Конструктор:
`constructor(templateId: string)` - В конструктор передается templateId, который будет клонирован

Поля:
- `titleElement: HTMLElement` - элемент, в котором будет отображаться название товара
- `priceElement: HTMLElement` - элемент, в котором будет отображаться цена товара
- `element: HTMLElement` - сама карточка

Методы класса:
- `set title(name: string)` - задаёт название товара
- `set price(value: number)` - задаёт цену товара. Если значение равно 0 или null, отображается "Бесценно"



#### Класс CardCatalog

Наследуется от `Card`. Карточка в каталоге

Конструктор: 
`constructor(private events: EventEmitter)` - В конструктор передается EventEmitter для обработки событий

Поля:
- `protected categoryElement: HTMLElement` - элемент, в котором будет отображаться категория товара
- `protected imageElement: HTMLImageElement` - элемент, в котором будет отображаться фото товара
- `protected openButton: HTMLButtonElement` - кнопка открытия модального окна с товаром

Методы класса:
- `private addEvents()` - добавляет обработчик события на кнопку открытия карточки товара
- `set category(name: string)` - задаёт категорию товара 
- `set image(src: string)` - задаёт фото товара
- `render(data: Partial<CardCatalogData>): HTMLElement` - перегрузка, чтобы поменять родительский <CardData>


#### Класс CardPreview

Наследуется от `Card`. Карточка в модальном окне

Конструктор:
`constructor(data: CardPreviewData)` - В конструктор передается экземляр класса CardPreviewData

Поля класса:
- `categoryElement: HTMLElement` — элемент, в котором отображается категория товара
- `imageElement: HTMLImageElement` — элемент, в котором отображается фото товара
- `textElement: HTMLElement` — элемент, в котором отображается описание товара
- `toBasketButton: HTMLButtonElement` — кнопка добавления товара в корзину

Методы класса:
- `set category(name: string)` — задаёт категорию товара
- `set image(src: string)` — задаёт изображение товара
- `set text(value: string)` — задаёт описание товара

#### Класс CardBasket

Наследуется от `Card`. Карточка в корзине

Конструктор: 
`constructor(private events: EventEmitter)` - В конструктор передается экземляр класса EventEmitter для обработки событий

Поля:
- `private indexElement: HTMLElement` - элемент, в котором будет отображаться порядковый номер товара в корзине
- `private deleteButton: HTMLButtonElement` - кнопка удаления товара из корзины

Методы класса: 
- `set index(value: number)` - задаёт индекс товара в корзине
- `render(data: Partial<CardBasketData>): HTMLElement` - перегрузка, чтобы поменять родительский <CardData>

#### Класс Basket

Отвечает за корзину товаров в интерфейсе.

Конструктор:
`constructor(events: EventEmitter)` — принимает экземпляр EventEmitter для генерации событий.

Поля:
- listElement: HTMLElement — контейнер для списка товаров в DOM
- makeOrderButton: HTMLButtonElement — кнопка оформления заказа
- priceElement: HTMLElement — элемент для отображения общей стоимости

Методы и сеттеры:
- private addEvents(): void — добавляет обработчик клика по кнопке оформления. Генерирует событие "basket:makeOrder" только если корзина не пуста.
- set list(items: HTMLElement[]): void — заменяет содержимое корзины переданным массивом DOM-элементов
- set price(value: number): void — задаёт общую стоимость товаров и отображает её в `priceElement` с постфиксом "синапсов"

#### Класс Form

Родительский класс для форм

Конструктор:
`constructor(protected events: EventEmitter, templateId: string)` - В конструктор передается EventEmitter для обработки событий и templateId, который будет клонирован

Поля:
- `public postButton: HTMLButtonElement` - кнопка отправки формы
- `public errorsElement: HTMLElement` - элемент, где выводятся ошибки валидации формы

Методы класса:  
- `set errors(data: string)` - задаёт ошибки в форме

#### Класс FormOrder

Наследник `Form`. Форма оформления заказа

Конструктор:  
`constructor(protected events: EventEmitter)` - В конструктор передается EventEmitter для обработки событий

Поля:
- `public cardButton: HTMLButtonElement` - кнопка выбора оплаты картой
- `public cashButton: HTMLButtonElement` - кнопка выбора оплаты наличными
- `public addressInput: HTMLInputElement` - ввод адреса доставки

Методы:
- `private addEvents()` - добавляет обработчики событий на кнопки оплаты, поле адреса и кнопку отправки
- `set payment(type: "card" | "cash")` - выбор одного из способов оплаты, активирует соответствующую кнопку
- `set address(address: string)` - задает адрес доставки
- `public update(data: Partial<IFormData>)` - обновляет значения полей формы и ошибки

#### Класс FormContacts

Наследник `Form`. Форма контактных данных

Конструктор: 
`constructor(protected events: EventEmitter)` - В конструктор передается EventEmitter для обработки событий

Поля:
- `public emailInput: HTMLInputElement` - ввод адреса электронной почты заказчика
- `public phoneInput: HTMLInputElement` - ввод номера телефона заказчика

Методы класса:
- `private addEvents()` - добавляет обработчики событий на поля ввода и кнопку отправки
- `public update(data: Partial<IFormData>)` - обновляет значения полей формы и ошибки