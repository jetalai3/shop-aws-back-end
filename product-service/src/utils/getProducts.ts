import products from "src/mocks/products"

const getProducts = () => {
    return Promise.resolve(products);
};

export default getProducts;
