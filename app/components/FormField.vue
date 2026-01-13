<script lang="ts" setup>
const props = defineProps({
  label: String,
  placeholder: String,
  type: String,
  modelValue: [String, Number, null],
  error: String,
})

const emit = defineEmits(['update:modelValue'])

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label
      :for="label"
      class="text-sm font-medium text-gray-300"
    >
      {{ label }}
    </label>

    <input
      :id="label"
      :type="type"
      :placeholder="placeholder"
      @input="onInput"
      class="rounded-md border px-3 py-2 text-sm text-gray-100
             bg-gray-900 placeholder-gray-500
             border-gray-700
             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
             transition"
      :class="error
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
        : ''"
    />

    <span
      v-if="error"
      :id="`${label}Error`"
      class="text-xs text-red-400 mt-1"
    >
      {{ error }}
    </span>
  </div>
</template>
