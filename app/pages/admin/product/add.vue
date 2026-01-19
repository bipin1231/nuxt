<script setup lang="ts">
    definePageMeta({
  layout: 'admin',
})
import { ref } from 'vue';
    const title=ref('')
    const price=ref(0)
    let image: File | null = null
    
    const handleImageChange=(e)=>{
        image=e.target.files[0]
    }
    
    const handleSubmit=async ()=>{
       
        const formData=new FormData();
        formData.append('title',title.value)
        formData.append('price',price.value.toString())
          if (image) {
    formData.append('image', image)
  }
        
        try{
  await $fetch('/api/product', {
    method: 'POST',
    body: formData
  })
    alert('Product added successfully!')
    title.value=''
    price.value=0
    image=null

        }catch(error){
            console.log(error);
            
        }
    
        
    }
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
    <div class="w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg p-6">
      
      <h1 class="text-2xl font-semibold text-white mb-6 text-center">
        Add Product
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-5">


        <div>
          <label class="block text-sm text-zinc-400 mb-1">
            Product Title
          </label>
          <input
            type="text"
            v-model="title"
            placeholder="Enter product title"
            class="w-full rounded-lg bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>


        <div>
          <label class="block text-sm text-zinc-400 mb-1">
            Product Price
          </label>
          <input
            type="number"
            v-model="price"
            placeholder="Enter price"
            class="w-full rounded-lg bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>


        <div>
          <label class="block text-sm text-zinc-400 mb-1">
            Product Image
          </label>
          <input
            type="file"
            @change="handleImageChange"
            class="block w-full text-sm text-zinc-400
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0
                   file:bg-zinc-800 file:text-white
                   hover:file:bg-zinc-700"
          />
        </div>

        <button
          type="submit"
          class="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 transition"
        >
          Add Product
        </button>

      </form>
    </div>
  </div>
</template>
