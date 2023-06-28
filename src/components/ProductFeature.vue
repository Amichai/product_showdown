<script setup>
  import { ref } from 'vue'
  import EditableText from '../components/EditableText.vue'
  
  const props = defineProps({
  feature: {
    type: Object,
    required: true
  }
})

  const emit = defineEmits([])
</script>

<template>
<div class="product-feature">
  <div>
  {{ props.feature.key }}
  </div>
  <div class="feature-value">
    <EditableText :initialText="props.feature.value" />
  </div>
</div>
</template>

<style scoped>
.product-feature {
  text-align: center;

}

.feature-value {
  font-size: 2.5rem;
}
</style>
