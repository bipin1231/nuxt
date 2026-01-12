import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ProductItem,cartItem } from '@/types/product'

export const useCartStore = defineStore('cart', () => {

    const cart=ref<cartItem[]>([])


  function addToCart(product:ProductItem) {
    const existingProduct=cart.value.find(i=>i.id==product.id)
    if(existingProduct){
        existingProduct.quantity++
    }else{
        cart.value.push({...product,quantity:1})
    }
  }
  function updateQuantity(id:number,update:string){
  const item = cart.value.find(i => i.id === id)
  if (!item) return

  if (update === "increase") {
    item.quantity++
    return
  }

  
  if (item.quantity === 1) {
    cart.value = cart.value.filter(i => i.id !== id)
  } else {
    item.quantity--
  }

}

  function removeItem(id:number){
const existingProduct=cart.value.filter((i)=>i.id!==id)
cart.value=existingProduct
  }
  return { cart, addToCart,updateQuantity,removeItem }
}, {
  persist: true
})