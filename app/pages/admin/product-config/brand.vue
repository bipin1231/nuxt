<script setup lang="ts">
import ProductAttributesLayout from './ProductConfigLayout.vue'
import { Plus, Pencil, Trash2,MoreHorizontal } from 'lucide-vue-next'
import { products } from '~/lib/store-data';
import PopupFormModel from './PopupFormModel.vue';
import { log } from 'node:console';
import { ca } from 'zod/locales';
import DeleteConfirmationModal from '~/components/DeleteConfirmationModal.vue';
definePageMeta({
  layout: 'admin',
})
const router = useRouter()
const route = useRoute()



const showModal = ref<boolean>(false)
const isEditMode =ref<boolean>(false)
const editingBrandId=ref<number | null>(null)
const editingBrandName=ref<string>('')

const showDeleteModal = ref(false)
const itemToDelete = ref<any>(null)  
 
const searchQuery = ref((route.query.search as string) || '')

watch(searchQuery, (value) => {
  router.replace({ query: { ...route.query, search: value || undefined } })
})

const {data:brandData,refresh} = await useFetch('/api/admin/brand',{
  query: {
    search: searchQuery,

  }
});

  
const openAddModal = () => {
 isEditMode.value = false


  showModal.value = true
}
const openEditModal = (size: { id: number; name: string }) => {
  isEditMode.value = true
  editingBrandId.value = size.id
  editingBrandName.value = size.name
  showModal.value = true
}

// Open delete modal
const handleItemDelete = (item: any) => {
  console.log(item);
  
  itemToDelete.value = item
  showDeleteModal.value = true
}

// Confirm delete
const confirmDeleteItem = async () => {
  try {
    await $fetch(`/api/admin/brand/${itemToDelete.value.id}`, {
      method: 'DELETE',
    })

    showDeleteModal.value = false
    itemToDelete.value = null
    refresh()
  } catch (error) {
    console.error(error)
  }
}


const handleSubmit =async () => {
  
  console.log("submit",editingBrandId.value, editingBrandName.value);
  try{
    if(isEditMode.value){
        const res=await $fetch(`/api/admin/brand/${editingBrandId.value}`,{
        method:'PUT',
        body:{
          title:editingBrandName.value
        }
      });
    }else{
      const res=await $fetch('/api/admin/brand',{
        method:'POST',
        body:{
          title:editingBrandName.value
        }
      });
    }
    showModal.value=false;
    editingBrandName.value='';
    editingBrandId.value=null;
    refresh();

  }catch(err){
    console.log(err);
    
  }
  
  console.log("form is here");
  
}

</script>

<template>
  <ProductAttributesLayout
  v-model="searchQuery"
  label="Brand"
  >

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 mt-4 gap-4">
        <h2 class="text-sm font-medium text-foreground">Manage Brand</h2>
        <button
          @click="openAddModal"
          class="flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-1.5 text-xs text-background transition-opacity hover:opacity-90"
        >
          <Plus class="h-3.5 w-3.5" stroke-width="1.5" />
          Add Brand
        </button>
      </div>
      <div class="mt-6 rounded-lg border border-border/30 bg-card">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border/30">
              <th class="px-5 py-3 text-left text-xs font-normal text-muted-foreground">
                Brand
              </th>

              <th class="px-5 py-3 text-right text-xs font-normal text-muted-foreground">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-border/30">
            <tr v-for="brand in brandData" :key="brand.id" class="group">


              <td class="hidden px-5 py-4 sm:table-cell">
                <span class="text-sm capitalize text-muted-foreground">{{ brand.title }}</span>
              </td>




              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    @click="openEditModal({id:brand.id, name:brand.title})"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil class="h-3.5 w-3.5" stroke-width="1.5" />
                  </button>
                  <button
                    type="button"
                    @click="handleItemDelete(brand)"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 class="h-3.5 w-3.5" stroke-width="1.5" />
                  </button>
                  <button
                    type="button"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <MoreHorizontal class="h-3.5 w-3.5" stroke-width="1.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <PopupFormModel
          :showModal="showModal"
          :isEditMode="isEditMode"
          @handleSubmit="handleSubmit"
          @cancelModal="showModal = false"
          label="Brand"
          v-model="editingBrandName"
        />
        <DeleteConfirmationModal
          :showDeleteModal="showDeleteModal"
           label="Brand"
          :itemToDelete="itemToDelete"
          @handleDelete="confirmDeleteItem"
          @cancelModal="showDeleteModal = false"
          />

        <div v-if="brandData?.length===0"  class="py-12 text-center">
          <p class="text-sm text-muted-foreground">No brands found.</p>
        </div>
      </div>
  </ProductAttributesLayout>
</template>
