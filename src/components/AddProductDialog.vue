
<script setup>
import { ref } from 'vue'
import { postShowdownUrl } from '../apiHelper'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'championAdded'])

const url = ref('')

const close = () => {
  emit('close')
}

const add = async () => {
  console.log('add')
  const result = await postShowdownUrl(url.value)
  console.log("----")

  const body = JSON.parse(result.body)

  emit('championAdded', {
    features: JSON.parse(body.features),
    imageUrl: body.imageUrl,
    url: url.value
  })
}

const clickDialog = (e) => {
  e.stopPropagation()
}
</script>

<template>
  <div class="dialog" @click="close" v-if="isOpen">
    <div class="dialog-content" @click="clickDialog" @keyup.enter="add" @keyup.esc="close">
      <div class="header">
        <h2>Add your champion</h2>
      </div>
      <div class="body">
        <div class="input-field">
          <p>Url:</p>
          <input class="input" type="text" v-model="url" />
        </div>
      </div>
      <div class="footer">
        <button class="button close-button" @click="close">Close</button>
        <button class="button add-button" type="submit" @click="add">Add</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.75);
  text-align: center;
  z-index: 9999;
}

.input-field {
  display: grid;
  grid-template-columns: 4rem 2fr;
}

.dialog-content {
  background-color: white;
  width: 30rem;
  height: 15rem;

  display: grid;
  grid-template-rows: 3rem 2fr 4rem;
  border-radius: 0.6rem;
  padding: 0.5rem;
}

.header {
  align-self: center;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem;
}

.footer {
  align-self: center;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.button {
  margin: 1rem;
  font-size: var(--fs--1);
}

.close-button {
  background-color: white;
  border: 1px solid black;
  color: black;
}

.input {
  font-size: var(--fs--1);
}
</style>

