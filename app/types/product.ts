export type ProductItem = {
  id: number;
  thumbnail: string;
  title: string;
  description: string;
  price: number;
  category:string;
  brand:string;
  stock:string;
}

export type ProductResponse = {
  products: ProductItem[];
  total: number;
};

export type cartItem=ProductItem & {
quantity:number;
}