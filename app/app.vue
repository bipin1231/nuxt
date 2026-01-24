<script setup>
const { user, fetchUser } = useAuth()
console.log(user.value);

await fetchUser()
console.log(user.value);
</script>

<template>
  <NuxtLayout/>
</template>

<style global>

.bg-background {
  /* background-color: #f9fafb;  */
}

.text-foreground {
  color: #111827; /* dark text */
}
.bg-foreground{
  background-color: rgb(63, 62, 62);
   color: white;
}

/* Card / table backgrounds */
.bg-card {
  background-color: #ffffff; 
  
}
.text-card-foreground {
  color: #111827; /* card text same as main text */
}

/* Secondary elements like filters/buttons */
.bg-secondary {
  background-color: #f4f6f8; 
}
.text-secondary-foreground {
  color: #374151; /* dark gray for secondary text */
}

/* Muted text (table headers, placeholders, etc.) */
.text-muted-foreground {
  color: #6b7280; /* muted gray */
}

/* Borders (tables, cards, etc.) */
.border-border {
  border-color: #d1d5db; /* gray-300 */
}

/* Destructive actions (delete button hover, etc.) */
.bg-destructive {
  background-color: #fee2e2; /* light red */
}
.text-destructive {
  color: #b91c1c; /* red-700 */
}

/* Accent */
.text-accent {
  color: #2563eb; /* blue-600 */
}
</style>

