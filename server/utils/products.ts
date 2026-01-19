import type { ProductItem } from "../types/product";

const product:ProductItem[]=[]


export const addProduct=(data:ProductItem)=>{
    const productAdded= product.push(data);
}

export const getProductByIndex = (index) => {
  return product[index];
}

export const updateProductByIndex = (index, data) => {
  product[index] = data;
}

export const getProduct=()=>{
    return product;
}

