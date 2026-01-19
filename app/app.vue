<script setup>
  const {user, fetchUser } = useAuth()
  console.log(user.value);
  
  await fetchUser()
    console.log(user.value);
</script>
<template>
  <NuxtLayout/>

</template>