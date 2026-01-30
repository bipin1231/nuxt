<script setup lang="ts">
import ProductAttributesLayout from './ProductConfigLayout.vue'
import { Plus, Pencil, Trash2, ChevronDown } from 'lucide-vue-next'
import { products } from '~/lib/store-data';
import PopupFormModel from './PopupFormModel.vue';
import { log } from 'node:console';
import { category } from '~~/server/db/schema/category';
import DeleteConfirmationModal from '~/components/DeleteConfirmationModal.vue';
import { toast } from 'vue-sonner';
definePageMeta({
  layout: 'admin',
})
const router = useRouter()
const route = useRoute()
const isOpen = ref(false)

const showDeleteModal = ref(false)
const itemToDelete = ref<any>(null) 


const selectedCategory=ref('Please select a Category')

const selectCategory = (value: string) => {
  selectedCategory.value = value
  isOpen.value = false
 
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}
 const searchQuery = ref((route.query.search as string) || '')

watch(searchQuery, (value) => {
  router.replace({ query: { ...route.query, search: value || undefined } })
}) 
  
const { data: sizes ,refresh} = await useFetch('/api/admin/sizes',{
    query:{
      search:searchQuery
    }
  })

const hasSizes = computed(() => sizes.value && sizes.value.length > 0)

const {data:categories} = await useFetch('/api/admin/category')
const showModal = ref<boolean>(false)
const isEditMode =ref<boolean>(false)
const editingSizeId=ref<number | null>(null)
const editingSizeName=ref<string>('')
  console.log(editingSizeName.value);
  

const openAddModal = () => {
 isEditMode.value = false


  showModal.value = true
}
const openEditModal = (size: { id: number; name: string ,categoryName: string}) => {
  isEditMode.value = true
  editingSizeId.value = size.id
  editingSizeName.value = size.name
  selectedCategory.value = size.categoryName
  showModal.value = true
}

const handleSubmit = async() => {
  // Logic to handle form submission
  console.log("submit",editingSizeId.value, editingSizeName.value);
  console.log(selectedCategory.value);

  try {
 
    if(isEditMode.value){
        const res=await $fetch(`/api/admin/sizes/${editingSizeId.value}`,{
        method:'PUT',
        body:{
          categoryName:selectedCategory.value,
          title:editingSizeName.value
        }
      });
      toast.success("updated successfully");
    }else{
    const response = await $fetch('/api/admin/sizes', {
      method: 'POST',
      body: {
        categoryName: selectedCategory.value,
        title: editingSizeName.value,
      },
    });
     toast.success("added successfully");
  }
    showModal.value=false;
    editingSizeName.value='';
    editingSizeId.value=null;
    refresh();
  } catch (error) {
    toast.error( error?.statusMessage);
  }
  
  

}
// Open delete modal
const handleItemDelete = (item: any) => {
  console.log(item);
  
  itemToDelete.value = item
  showDeleteModal.value = true
}
const confirmDeleteItem = async () => {
  console.log(itemToDelete.value);
  
  try {
    await $fetch(`/api/admin/sizes/${itemToDelete.value.id}`, {
      method: 'DELETE',
    })

    showDeleteModal.value = false
    itemToDelete.value = null
    toast.success("Item deleted successfully")
    refresh()
  } catch (error) {
    toast.error(error?.statusMessage)
  }
}
</script>

<template>
   <ProductAttributesLayout
  v-model="searchQuery"
  label="Size"
  >

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 mt-4 gap-4">
        <h2 class="text-sm font-medium text-foreground">Manage Size</h2>
        <button
          @click="openAddModal"
          class="flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-1.5 text-xs text-background transition-opacity hover:opacity-90"
        >
          <Plus class="h-3.5 w-3.5" stroke-width="1.5" />
          Add Size
        </button>
      </div>
      <div class="mt-6 rounded-lg border border-border/30 bg-card">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border/30">
              <th class="px-5 py-3 text-left text-xs font-normal text-muted-foreground">
                Size
              </th>

              <th class="px-5 py-3 text-right text-xs font-normal text-muted-foreground">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

<tbody v-if="sizes?.length" class="divide-y divide-border/30">
  <tr
    v-for="s in sizes"
    :key="s.id"
    class="group transition-colors hover:bg-muted/20"
  >

    <td class="px-5 py-4">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-foreground capitalize">
          {{ s.title }}
        </span>

        <span
          class="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
        >
          {{ s.categoryName }}
        </span>
      </div>
    </td>


    <td class="px-5 py-4 text-right">
      <div
        class="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <button
          @click="openEditModal({ id: s.id, name: s.title, categoryName: s.categoryName })"
          class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <Pencil class="h-3.5 w-3.5" stroke-width="1.5" />
        </button>

        <button
        @click="handleItemDelete(s)"
          class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 class="h-3.5 w-3.5" stroke-width="1.5" />
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
          label="Size"
          
          v-model="editingSizeName"

        >
            <div class="mb-2">
                <label class="text-xs text-muted-foreground">Category</label>
                <div class="relative">
                  <button
                    type="button"
                    @click="toggleDropdown"
                    class="w-full text-muted-foreground rounded-lg border border-border/50 bg-background px-4 py-2.5 text-left text-sm flex items-center justify-between"
                  >
                    <span>{{ selectedCategory }}</span>
                    <ChevronDown
                      class="h-4 w-4 text-muted-foreground transition-transform"
                      :class="{ 'rotate-180': isOpen }"
                    />
                  </button>

                  <div
                    v-if="isOpen"
                    class="absolute z-50 mt-2 w-full rounded-lg border border-border/50 bg-white shadow-lg"
                  >
                    <button
                      v-for="category in categories"
                      :key="category.id"
                      type="button"
                      @click="selectCategory(category.title)"
                      class="w-full px-4 py-2.5 text-left text-sm hover:bg-muted/50 flex items-center justify-between"
                    >
                      <span>{{ category.title }}</span>
                      <Check v-if="selectedCategory === category.title" class="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div
                  v-if="isOpen"
                  @click="isOpen = false"
                  class="fixed inset-0 z-40"
                ></div>
              </div>
      </PopupFormModel>
        <DeleteConfirmationModal
          :showDeleteModal="showDeleteModal"
           label="Size"
          :itemToDelete="itemToDelete"
          @handleDelete="confirmDeleteItem"
          @cancelModal="showDeleteModal = false"
          />


        <div v-if="!hasSizes" class="py-12 text-center">
          <p class="text-sm text-muted-foreground">No products found.</p>
        </div>
      </div>
  </ProductAttributesLayout>
</template>
