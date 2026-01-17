import type { ProductItem } from "../types/product";

const product:ProductItem[]=[]


export const addProduct=(data:ProductItem)=>{
    const productAdded= product.push(data);

    
}
export const getProduct=()=>{
    return product;
}

