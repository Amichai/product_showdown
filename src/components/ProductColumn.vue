<script setup>
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import EditableText from '../components/EditableText.vue'
import ProductFeature from '../components/ProductFeature.vue'

const props = defineProps({
  features: {
    type: Object,
    required: true
  },
  rowOrder: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['orderChanged'])

const drag = ref(false)

const endDrag = () => {
  
}

const orderedFeatures = computed({
  get() {
    return props.rowOrder.map((id) => {
      return props.features.features.find((feature) => feature.key === id)
    })
  },
  set(newValue) {
    emit('orderChanged', newValue.map((feature) => feature.key))
  }
})

</script>

<template>
  <div class="product-column">
    <img :src="props.features.img" alt="product image" class="product-image" />

    <div>
      <EditableText :initialText="props.features.name" />
    </div>
  <br>
    <draggable
      v-model="orderedFeatures"
      group="features"
      @start="drag = true"
      @end="drag = false"
      item-key="id"
    >
      <template #item="{ element }">
        <div>
          <ProductFeature 
            :feature="element"
          />
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
