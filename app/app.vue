<script setup>
  const {user, fetchUser } = useAuth()
  console.log(user.value);
  
  await fetchUser()
</script>
<template>
  <NuxtLayout/>

</template>