<script setup>
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import EditableText from '../components/EditableText.vue'
import ProductFeature from '../components/ProductFeature.vue'
import { v4 as uuidv4 } from 'uuid'

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

const emit = defineEmits(['orderChanged', 'featureChanged'])

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

const featureChanged = (keyValue) => {
  const featureIndex = props.features.features.findIndex((feature) => feature.key === keyValue.key)
  props.features.features[featureIndex].value = keyValue.value
  emit('featureChanged', props.features)
}
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
      class="feature-list"
      :group="uuidv4()"
      @start="drag = true"
      ghost-class="ghost"
      @end="drag = false"
      item-key="id"
    >
      <template #item="{ element }">
        <div>
          <ProductFeature 
            :feature="element"
            @featureChanged="featureChanged"
          />
        </div>
      </template>
    </draggable>
  </div>
</template>

<style scoped>
.feature-list {
  width: 100%;
}

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

.ghost {
  opacity: 0.5;
  background-color: gray;
}
</style>
