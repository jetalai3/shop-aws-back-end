export class ProductCreateError extends Error {
    constructor() {
        super("Error while creating a product.");
    }
};