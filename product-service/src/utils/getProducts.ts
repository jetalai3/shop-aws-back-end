import products from "../mocks/products";

const getProducts = () => {
    return Promise.resolve(products);
};

export default getProducts;
