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

const emit = defineEmits(['orderChanged', 'featureChanged', 'deleteColumn', 'featureAdded', 'featureDeleted'])

const drag = ref(false)

const heroStat = ref('')
const heroStatValue = ref('')
const isAddingStat = ref(false)

const endDrag = () => {
  
}

const showAddStatArea = () => {
  isAddingStat.value = true
}

const cancelAddStat = () => {
  heroStat.value = ''
  heroStatValue.value = ''
  isAddingStat.value = false
}

const addStat = () => {
  emit('featureAdded', { key: heroStat.value, value: heroStatValue.value })
  cancelAddStat()
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
  /// Potential bug – we need to do this find index on the feature id not the key
  const featureIndex = props.features.features.findIndex((feature) => feature.key === keyValue.key)
  props.features.features[featureIndex].value = keyValue.value
  emit('featureChanged', props.features)
}

const featureDeleted = (feature) => {
  emit('featureDeleted', feature)
}

const deleteColumn = () => {
  emit('deleteColumn')
}

console.log(props.features)
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
            @featureDeleted="featureDeleted"
          />
        </div>
      </template>
    </draggable>

    <div class="add-feature-area" v-if="isAddingStat">
      <input class="input" placeholder="stat" v-model="heroStat" />
      <input class="input" placeholder="value" v-model="heroStatValue" />
      <div class="button-footer">
        <button class="button" @click="cancelAddStat">Cancel</button>
        <button class="button" @click="addStat">Add</button>
      </div>
    </div>

    <a class="icon-button" @click="showAddStatArea">
      <span class="material-symbols-outlined">
        add_circle
      </span>
    </a>
    <a class="icon-button" @click="deleteColumn">
      <span class="material-symbols-outlined">
        delete
      </span>
    </a>
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
  padding-bottom: 1rem;
}

.ghost {
  opacity: 0.5;
  background-color: gray;
}

.icon-button {
  cursor: pointer;
}

.add-feature-area {
  padding: 1.5rem;
  /* font-size: 1.0rem; */
}

.input {
  font-size: 1.2rem;
  margin: 0.1rem 0;
}

.button {
  font-size: 1rem;
  margin: 0.2rem;
}

.button-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
