<script lang="ts" setup>
defineProps({
  label: String,
})
</script>

<template>
  <button
    type="submit"
    @click="$emit('handleSubmit')"
    class="w-full rounded-md px-4 py-2 text-sm font-medium
           bg-indigo-600 text-white
           hover:bg-indigo-500
           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
           active:bg-indigo-700
           transition"
  >
    {{ label }}
  </button>
</template>
