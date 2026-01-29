<script setup lang="ts">
import { Plus, X } from 'lucide-vue-next';
import { ref } from 'vue';
defineProps<{
label:string,
  productVar: any,
  openForm:boolean,
  sizes:any

  selectedSizes:any
}>()
const isSizesDropDownOpen=ref(false)
const emit = defineEmits(['closeForm','selectItem','handleSubmit'])
const closeForm=()=>{
  
  emit('closeForm')
}
const handleSizeSelect=(item)=>{

  emit('selectItem', item)
  isSizesDropDownOpen.value=false
}

const handleSubmit=()=>{

 emit('handleSubmit')
  
}

</script>

<template>
        <div
      v-if="openForm"
      @click.self="closeForm"
 class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div class="w-full max-w-md rounded-xl bg-card shadow-xl border border-border/40 p-6">
        <div class="flex justify-between mb-4">
          <h3 class="text-sm font-medium">{{ label }} Product Variants</h3>
          <button @click="closeForm">
            <X class="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div class="space-y-4">

        <DropdownField
          label="Sizes"
          :items="sizes"
          :defaultValue="productVar?.size"
          :isOpen="isSizesDropDownOpen"
          :selectedItem="selectedSizes"
         @toggleBrandDropdown="isSizesDropDownOpen=!isSizesDropDownOpen" 
         @selectItem="handleSizeSelect"
          />

        <label class="block text-xs font-medium text-muted-foreground mb-1" for="category">
          Selling Price
        </label>
        <input

          type="number"
          v-model="productVar.sellingPrice"
          class="w-full rounded-lg border border-border/50 bg-background py-2 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground/20 mb-2"
        />
                   <label class="block text-xs font-medium text-muted-foreground mb-1" for="category">
          Cost Price
        </label>
        <input

          type="number"
          v-model="productVar.costPrice"
          class="w-full rounded-lg border border-border/50 bg-background py-2 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground/20 mb-2"
        />
           <label class="block text-xs font-medium text-muted-foreground mb-1" for="category">
         Stock
        </label>
        <input

          type="number"
          v-model="productVar.stock"
          class="w-full rounded-lg border border-border/50 bg-background py-2 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground/20 mb-2"
        />




        <div class="flex justify-end gap-2 mt-4">
          <button
            @click="closeForm"
            class="px-3 py-1.5 text-xs rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            class="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-lg bg-foreground text-background transition-opacity hover:opacity-90"
          >
            <Plus class="h-3.5 w-3.5" stroke-width="1.5" />
            Save
          </button>
        </div>

        </div>
      </div>
    </div>
</template>