<script setup lang="ts">
import ProductAttributesLayout from './ProductConfigLayout.vue'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
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
const editingCategoryId=ref<number | null>(null)
const editingCategoryName=ref<string>('')

const showDeleteModal = ref(false)
const itemToDelete = ref<any>(null)  
  console.log(itemToDelete.value);
 const searchQuery = ref((route.query.search as string) || '')

watch(searchQuery, (value) => {
  router.replace({ query: { ...route.query, search: value || undefined } })
}) 
  

  const {data:categories,refresh} = await useFetch('/api/admin/category',{
    query:{
      search:searchQuery
    }
  });
  console.log(categories.value);
  
const openAddModal = () => {
 isEditMode.value = false


  showModal.value = true
}
const openEditModal = (size: { id: number; name: string }) => {
  isEditMode.value = true
  editingCategoryId.value = size.id
  editingCategoryName.value = size.name
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
  console.log(itemToDelete.value);
  
  try {
    await $fetch(`/api/admin/category/${itemToDelete.value.id}`, {
      method: 'DELETE',
    })

    showDeleteModal.value = false
    itemToDelete.value = null
    refresh()
  } catch (error) {
    console.error(error)
  }
}
const handleDelete=async(id:number)=>{
  try{
    if(id){
      const res=await $fetch(`/api/admin/category/${id}`,{
        method:'DELETE',
      });
      showModal.value=false;
      editingCategoryName.value='';
      editingCategoryId.value=null;
      refresh();
    }
  }catch(err){
    console.log(err);
  }
}

const handleSubmit =async () => {
  // Logic to handle form submission
  console.log("submit",editingCategoryId.value, editingCategoryName.value);
  try{
    if(isEditMode.value){
        const res=await $fetch(`/api/admin/category/${editingCategoryId.value}`,{
        method:'PUT',
        body:{
          title:editingCategoryName.value
        }
      });
    }else{
      const res=await $fetch('/api/admin/category',{
        method:'POST',
        body:{
          title:editingCategoryName.value
        }
      });
    }
    showModal.value=false;
    editingCategoryName.value='';
    editingCategoryId.value=null;
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
  label="Category"
  >

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 mt-4 gap-4">
        <h2 class="text-sm font-medium text-foreground">Manage Category</h2>
        <button
          @click="openAddModal"
          class="flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-1.5 text-xs text-background transition-opacity hover:opacity-90"
        >
          <Plus class="h-3.5 w-3.5" stroke-width="1.5" />
          Add Category
        </button>
      </div>
      <div class="mt-6 rounded-lg border border-border/30 bg-card">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border/30">
              <th class="px-5 py-3 text-left text-xs font-normal text-muted-foreground">
                Category
              </th>

              <th class="px-5 py-3 text-right text-xs font-normal text-muted-foreground">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-border/30">
            <tr v-for="cat in categories" :key="cat.id" class="group">


              <td class="hidden px-5 py-4 sm:table-cell">
                <span class="text-sm capitalize text-muted-foreground">{{ cat.title }}</span>
              </td>




              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    @click="openEditModal({id:cat.id, name:cat.title})"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil class="h-3.5 w-3.5" stroke-width="1.5" />
                  </button>
                  <button
                    type="button"
                    @click="handleItemDelete(cat)"
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
          label="Category"
          
          v-model="editingCategoryName"
        />
        <DeleteConfirmationModal
          :showDeleteModal="showDeleteModal"
           label="Category"
          :itemToDelete="itemToDelete"
          @handleDelete="confirmDeleteItem"
          @cancelModal="showDeleteModal = false"
          />

        <div v-if="categories?.length===0"  class="py-12 text-center">
          <p class="text-sm text-muted-foreground">No categories found.</p>
        </div>
      </div>
  </ProductAttributesLayout>
</template>
