import { Catalog } from './components/Models/Сatalog';
import { Basket } from './components/Models/Bascket';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';

const catalogModel = new Catalog();
const basketModel = new Basket();
const buyerModel = new Buyer();

// Проверка Catalog
catalogModel.saveProducts(apiProducts.items);
console.log('Каталог товаров:', catalogModel.getProducts());
catalogModel.saveCurrentProduct(catalogModel.getProducts()[0])
console.log('Текущий товар:', catalogModel.getCurrentProduct());
console.log('Товар с id b06cde61-912f-4663-9751-09956c0eed67:', catalogModel.getProductId('b06cde61-912f-4663-9751-09956c0eed67'));

// Проверка Basket
const product1 = catalogModel.getProducts()[0]; 
const product2 = catalogModel.getProducts()[1]; 
const product3 = catalogModel.getProducts()[2]; 
basketModel.addProduct(product1);
basketModel.addProduct(product2);
basketModel.addProduct(product3);
console.log('После добавления товаров в корзину:', basketModel.getProducts());
console.log('Количество товаров в корзине:', basketModel.getTotalCount());
console.log('Стоимость корзины:', basketModel.getTotalPrice());
console.log('Проверка наличия товара с id 854cef69-976d-4c2a-a18c-2aa45046c390:', basketModel.isProductIn('854cef69-976d-4c2a-a18c-2aa45046c390'));
basketModel.removeProduct(product2);
console.log('После удаления 2-го товара:', basketModel.getProducts());


// Проверка Buyer
buyerModel.savePayment('online');
buyerModel.saveEmail('test@example.com');
buyerModel.savePhone('+79991234567');
console.log('Данные покупателя после заполнения:', buyerModel.getBuyerData());
console.log('Валидация без адреса:', buyerModel.validate());
buyerModel.saveAddress('ул. Примерная, 123');
console.log('Валидация со всеми полями:', buyerModel.validate());

// Пример очистки данных
basketModel.clean();
buyerModel.clean();
catalogModel.saveCurrentProduct(undefined);

console.log('После очистки корзины:', basketModel.getProducts());
console.log('После очистки данных покупателя:', buyerModel.getBuyerData());
console.log('Текущий товар после очистки:', catalogModel.getCurrentProduct());