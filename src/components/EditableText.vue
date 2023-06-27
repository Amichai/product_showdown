<script setup>
  import { nextTick, ref, watch } from 'vue'

  const isEditing = ref(false)
  const inputRef = ref(null)
  
  const textValue = ref(props.initialText)

  const props = defineProps({
    initialText: {
      type: String,
      default: 'Untitled Showdown'
    }
  })

  const emit = defineEmits([])

  const setEditing = (value) => {
    isEditing.value = value
    resizeInputToCurrentValue(textValue.value)

    if(value) {
      nextTick(() => {
        inputRef.value.focus()
      })
    }
  }
  
  const resizeInputToCurrentValue = (text) => {
    const element = inputRef.value
    resizeInputField(element.parentElement.children[0], text)
  }

  const getTextWidth = (context, text) => {
    const phantom = document.createElement('span')
    phantom.className = 'phantom'
    phantom.innerHTML = text

    phantom.style.position = 'absolute'
    phantom.style.display = 'inline'
    phantom.style.whiteSpace = 'pre'
    phantom.style.font = 'inherit'
    phantom.style.fontSize = 'inherit'
    phantom.style.color = 'transparent'

    context.appendChild(phantom)

    const $phantom = context.querySelector('.phantom')
    const size = $phantom?.clientWidth

    $phantom?.remove()

    return size
  }

  watch(textValue, (newValue) => {
    resizeInputToCurrentValue(newValue)
  })


  const resizeInputField = (element, text) => {
    const textSize = getTextWidth(element.parentElement, text || props.placeholder)
    textSize && element.style.setProperty('--js-size', `${textSize + 2}px`)
  }
</script>

<template>
  <div v-if="!isEditing" @click="() => setEditing(true)">
    {{ textValue }}
  </div>
  <div>
    <input v-show="isEditing" type="text" 
      class="input"
      ref="inputRef"
      v-on:keyup.enter="() => setEditing(false)"
      v-focus
      v-model="textValue"
      @blur="() => setEditing(false)"
    />
  </div>
</template>

<style scoped>
.input {
  min-width: 1em;
  width: var(--js-size);
  text-align: center;
}
</style>
