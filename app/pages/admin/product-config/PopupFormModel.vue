<script setup lang="ts">

import { Plus, X } from 'lucide-vue-next'

const props = defineProps({
    placeholder:String,
    showModal:Boolean,
    label:String,
    isEditMode:Boolean,
    error:String,
    modelValue:String


})
// const emit = defineEmits(['update:modelValue'])
const emit = defineEmits([
  'cancelModal',
  'handleSubmit',
  'update:modelValue'
])

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}


</script>

<template>
        <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      @click.self="$emit('cancelModal')"
    >
      <div class="bg-card rounded-lg p-6 w-full max-w-sm relative shadow-lg">
       
        <button
          @click="$emit('cancelModal')"
          class="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X class="h-4 w-4" />
        </button>

        <h3 class="text-sm font-medium text-foreground mb-4 ">
          {{ isEditMode ? `Edit ${label}` : `Add ${label}` }}
        </h3>

          <slot/>
        <label class="block text-xs font-medium text-muted-foreground mb-1" for="category">
          {{ label }} Name
        </label>
        <input
          id="category"
          type="text"
          :value="modelValue"
          @input="onInput"
          :placeholder="`Enter ${label?.toLowerCase()} name`"
          class="w-full rounded-lg border border-border/50 bg-background py-2 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground/20 mb-2"
        />



        
        <p v-if="error" class="text-xs text-destructive mb-2">{{ error }}</p>

        <div class="flex justify-end gap-2 mt-4">
          <button
            @click="$emit('cancelModal')"
            class="px-3 py-1.5 text-xs rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="$emit('handleSubmit')"
            class="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-lg bg-foreground text-background transition-opacity hover:opacity-90"
          >
            <Plus class="h-3.5 w-3.5" stroke-width="1.5" />
            {{ isEditMode ? 'Update' : 'Add' }}
          </button>
        </div>
            
      </div>

    </div>
</template>