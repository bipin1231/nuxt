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
        }catch(error){
            console.log(error);
            
        }
    
        
    }
</script>

<template>
    <h1>Add Product</h1>
    <form action="" @submit.prevent="handleSubmit">
<input type="text" placeholder="Product title" v-model="title">
<input type="number" placeholder="Product Price" v-model="price">

          <input type="file" @change="handleImageChange" placeholder="Product image" name="" id="">
          <input type="submit" name="" id="">
    </form>
</template>