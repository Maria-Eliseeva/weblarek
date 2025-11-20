import {IBuyer, TPayment} from '../../types/index';

export class Buyer {
    private payment: TPayment | null = null;
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    constructor() {}

    savePayment(payment: TPayment): void {
        this.payment = payment;
    }

    saveEmail(email: string): void {
        this.email = email;
    }

    savePhone(phone: string): void {
        this.phone = phone;
    }

    saveAddress(address: string): void {
        this.address = address;
    }

    getBuyerData(): IBuyer | null {
        if (this.payment && this.email && this.phone && this.address) {
            return {
                payment: this.payment,
                email: this.email,
                phone: this.phone,
                address: this.address
            } as IBuyer;
        }
        return null;
    }

    clean(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    validate(): { payment?: string; email?: string; phone?: string; address?: string } {
        const errors: { payment?: string; email?: string; phone?: string; address?: string } = {};

        if (!this.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.email.trim()) {
            errors.email = 'Укажите email';
        }

        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        if (!this.address.trim()) {
            errors.address = 'Укажите адрес';
        }

        return errors;
    }
}