<script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
  })

  const emit = defineEmits([])

  const add = () => {
    console.log("AAdd")
  }
</script>

<template>
<div class="product-column">
  <img src="src/assets/AddButton.png" alt="product image" class="product-image" @click="add">
</div>
</template>

<style scoped>
.product-image {
  border: 3px solid white;
  width: 90%;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.product-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding-bottom: 1rem;
}

.button {
  background-color: rgb(74, 99, 102);
  border-radius: 0.4rem;
}

.button:hover {
  background-color: rgba(74, 99, 102, 0.7);
}
</style>
