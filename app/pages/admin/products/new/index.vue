<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#imports'
import  AdminHeader  from '~/components/admin/AdminHeader.vue'
import { categories } from '~/lib/store-data'
import { ArrowLeft, Upload, X } from 'lucide-vue-next'
definePageMeta({
  layout: 'admin',
})
// Router for navigation
const router = useRouter()

// Image preview state
const imagePreview = ref<string | null>(null)

// Form state (optional, can expand for v-model)
const productName = ref('')
const description = ref('')
const price = ref<number | null>(null)
const compareAtPrice = ref<number | null>(null)
const status = ref('Draft')
const category = ref(categories[0]?.id || '')
const tags = ref<string[]>([])

// Handlers
const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    imagePreview.value = URL.createObjectURL(file)
  }
}

const removeImage = () => {
  imagePreview.value = null
}

const goBack = () => {
  router.push('/admin/products')
}

const createProduct = () => {
  // Add your create product logic here
  console.log({
    productName: productName.value,
    description: description.value,
    price: price.value,
    compareAtPrice: compareAtPrice.value,
    status: status.value,
    category: category.value,
    tags: tags.value,
    image: imagePreview.value
  })
}
</script>

<template>
  <div class="min-h-screen bg-background">
  
    <AdminHeader
      title="Add product"
      description="Create a new product for your store"
    />

    <div class="p-6">
   
      <button @click="goBack" class="inline-flex items-center gap-2 text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="h-3 w-3" stroke-width="1.5" />
        Back to products
      </button>

      <form @submit.prevent="createProduct" class="mt-8 grid gap-8 lg:grid-cols-3">
      
        <div class="lg:col-span-2 space-y-6">
         
          <div class="rounded-lg border border-border/30 bg-card p-6">
            <h2 class="text-sm font-medium text-foreground">Basic information</h2>
            <div class="mt-6 space-y-4">
              <div>
                <label class="text-xs text-muted-foreground">Product name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  v-model="productName"
                  class="mt-1.5 w-full rounded-lg border border-border/50 bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10"
                />
              </div>

              <div>
                <label class="text-xs text-muted-foreground">Description</label>
                <textarea
                  rows="4"
                  placeholder="Describe your product..."
                  v-model="description"
                  class="mt-1.5 w-full rounded-lg border border-border/50 bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10"
                />
              </div>
            </div>
          </div>

          
          <div class="rounded-lg border border-border/30 bg-card p-6">
            <h2 class="text-sm font-medium text-foreground">Image</h2>
            <div class="mt-6">
              <div v-if="imagePreview" class="relative aspect-video overflow-hidden rounded-lg bg-secondary">
                <img
                  :src="imagePreview || '/placeholder.svg'"
                  alt="Preview"
                  class="h-full w-full object-cover"
                />
                <button
                  type="button"
                  @click="removeImage"
                  class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground/80 text-background transition-colors hover:bg-foreground"
                >
                  <X class="h-4 w-4" stroke-width="1.5" />
                </button>
              </div>
              <label v-else class="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/50 p-12 transition-colors hover:border-foreground/20">
                <Upload class="h-8 w-8 text-muted-foreground/50" stroke-width="1" />
                <p class="mt-3 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p class="mt-1 text-xs text-muted-foreground/60">PNG, JPG up to 10MB</p>
                <input type="file" accept="image/*" class="hidden" @change="handleImageChange" />
              </label>
            </div>
          </div>

         
          <div class="rounded-lg border border-border/30 bg-card p-6">
            <h2 class="text-sm font-medium text-foreground">Pricing</h2>
            <div class="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label class="text-xs text-muted-foreground">Price</label>
                <div class="relative mt-1.5">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    v-model.number="price"
                    class="w-full rounded-lg border border-border/50 bg-background py-2.5 pl-8 pr-4 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10"
                  />
                </div>
              </div>

              <div>
                <label class="text-xs text-muted-foreground">Compare at price</label>
                <div class="relative mt-1.5">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    v-model.number="compareAtPrice"
                    class="w-full rounded-lg border border-border/50 bg-background py-2.5 pl-8 pr-4 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      
        <div class="space-y-6">
        
          <div class="rounded-lg border border-border/30 bg-card p-6">
            <h2 class="text-sm font-medium text-foreground">Status</h2>
            <div class="mt-4">
              <select v-model="status" class="w-full rounded-lg border border-border/50 bg-background px-4 py-2.5 text-sm focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10">
                <option>Draft</option>
                <option>Active</option>
              </select>
            </div>
          </div>

         
          <div class="rounded-lg border border-border/30 bg-card p-6">
            <h2 class="text-sm font-medium text-foreground">Category</h2>
            <div class="mt-4">
              <select v-model="category" class="w-full rounded-lg border border-border/50 bg-background px-4 py-2.5 text-sm capitalize focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10">
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
          </div>

       
          <div class="rounded-lg border border-border/30 bg-card p-6">
            <h2 class="text-sm font-medium text-foreground">Tags</h2>
            <div class="mt-4 flex flex-wrap gap-2">
              <label class="flex cursor-pointer items-center gap-2">
                <input type="checkbox" value="Featured" v-model="tags" class="rounded border-border" />
                <span class="text-sm text-muted-foreground">Featured</span>
              </label>
              <label class="flex cursor-pointer items-center gap-2">
                <input type="checkbox" value="New arrival" v-model="tags" class="rounded border-border" />
                <span class="text-sm text-muted-foreground">New arrival</span>
              </label>
            </div>
          </div>

        
          <div class="flex flex-col gap-3">
            <button type="submit" class="w-full rounded-lg bg-foreground px-4 py-2.5 text-sm tracking-wide text-background transition-opacity hover:opacity-90">
              Create product
            </button>
            <button type="button" @click="goBack" class="w-full rounded-lg border border-border/50 px-4 py-2.5 text-center text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
