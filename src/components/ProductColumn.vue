<script setup>
  import { ref } from 'vue'
  import EditableText from '../components/EditableText.vue'
  
  const props = defineProps({
    productColumn: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits([])
</script>

<template>
<div class="product-column">
  <img :src="props.productColumn.features.img" alt="product image" class="product-image">
  <div>
    <EditableText :initialText="props.productColumn.name" />
  </div>
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
}
</style>
