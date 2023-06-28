<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
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
    <img :src="props.productColumn.img" alt="product image" class="product-image" />

    <div>
      <EditableText :initialText="props.productColumn.name" />
    </div>

    <draggable
      v-model="props.productColumn.features"
      group="features"
      @start="drag = true"
      @end="drag = false"
      item-key="id"
    >
      <template #item="{ element }">
        <div>
          {{ element }}
        </div>
      </template>
    </draggable>
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
