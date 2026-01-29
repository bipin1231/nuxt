<script setup lang="ts">
import { Trash2, X } from 'lucide-vue-next';

const props = defineProps<{
  showDeleteModal: boolean;
  label: string | null;
  itemToDelete: { id: number; title: string } | null;

}>();
</script>
<template>
        <div
      v-if="showDeleteModal"
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
            <div class="mb-4 flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
        <Trash2 class="h-5 w-5 text-destructive" stroke-width="1.5" />
      </div>
      <div>
        <h3 class="text-lg font-medium text-foreground">
          Delete {{ label }}
        </h3>
        <p class="text-sm text-muted-foreground">
          This action cannot be undone
        </p>
      </div>
    </div>
          <p class="text-sm text-muted-foreground">
        Are you sure you want to delete
        <span class="font-medium text-foreground">
          {{ itemToDelete?.title }}
        </span>?
      </p>

                <div class="flex justify-end gap-2 mt-4">
          <button
            @click="$emit('cancelModal')"
            class="px-3 py-1.5 text-xs rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="$emit('handleDelete')"
            class="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-lg bg-red-600 text-white transition-opacity hover:opacity-90"
          >
            <Trash2 class="h-3.5 w-3.5" stroke-width="1.5" />
           Delete
          </button>
        </div>
     </div>
  <!-- <div class="w-full max-w-md rounded-lg border border-border/30 bg-card p-6 shadow-lg">
    <div class="mb-4 flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
        <Trash2 class="h-5 w-5 text-destructive" stroke-width="1.5" />
      </div>
      <div>
        <h3 class="text-lg font-medium text-foreground">
          Delete {{ label }}
        </h3>
        <p class="text-sm text-muted-foreground">
          This action cannot be undone
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <p class="text-sm text-muted-foreground">
        Are you sure you want to delete
        <span class="font-medium text-foreground">
          {{ itemToDelete?.title }}
        </span>?
      </p>

      <div class="flex gap-2 pt-2">
        <button
          type="button"
         @click="$emit('cancelModal')"
          class="flex-1 rounded-lg border border-border/30 bg-secondary px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary/80"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="$emit('handleDelete')"
          class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-opacity hover:opacity-90"
        >
          Delete
        </button>
      </div>
    </div>
  </div> -->
</div>
</template>