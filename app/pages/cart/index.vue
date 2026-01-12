<script lang="ts" setup>
  import { useCartStore } from '@/stores/cartStore';
  import { computed, ref } from 'vue';
const cartStore=useCartStore()

const cart = computed(() => cartStore.cart)

    

 const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)
  console.log(totalPrice);
  
  
  
</script>
<template>
 <div class="min-h-screen bg-black text-white">
      <div class="max-w-5xl mx-auto px-8 py-20">
        
        <h1 class="text-2xl mb-12">Cart</h1>

 
        <div v-if="cart.length === 0" class="text-sm text-gray-500 py-20 text-center">
          No items in cart
        </div>


        <div v-else>
          <div class="space-y-6 mb-12">
            <div 
              v-for="item in cart" 
              :key="item.id"
              class="flex gap-6 border-b border-gray-900 pb-6"
            >
              <img 
                :src="item.thumbnail" 
                :alt="item.title"
                class="w-32 h-32 object-cover bg-transparent"
              />
              
              <div class="flex-1">
                <h3 class="text-sm mb-2">{{ item.title }}</h3>
                <p class="text-sm text-gray-500 mb-4">${{ item.price }}</p>
                
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2">
                    <button 
                       @click="cartStore.updateQuantity(item.id,'decrease')"
                      class="w-6 h-6 border border-gray-700 text-xs"
                    >
                      -
                    </button>
                    <span class="text-sm w-8 text-center">{{ item.quantity }}</span>
                    <button 
                   @click="cartStore.updateQuantity(item.id,'increase')"
                      class="w-6 h-6 border border-gray-700 text-xs"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
            @click="cartStore.removeItem(item.id)"
                    class="text-xs text-gray-500 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div class="text-sm">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>

     
          <div class="border-t border-gray-800 pt-8 max-w-sm ml-auto">
            <div class="space-y-3 text-sm mb-6">
              <div class="flex justify-between text-gray-500">
                <span>Subtotal</span>
                  <span>${{ totalPrice.toFixed(2) }}</span>
              
              </div>

              <div class="flex justify-between text-lg pt-3 border-t border-gray-900">
                <span>Total</span>
         
              </div>
            </div>
            
            <button class="w-full border border-white px-6 py-3 text-sm">
              Checkout
            </button>
          </div>
        </div>

      </div>
    </div>
</template>
