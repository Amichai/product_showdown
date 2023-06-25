<script setup>
import { ref, onMounted } from 'vue'
import LoadingDialog from '../components/LoadingDialog.vue'

const props = defineProps({
  guid: {
    type: String,
    required: true
  }
})

const title = ref('')
const summary = ref('')
const epigraph = ref('')
const epigraphPart1 = ref('')
const epigraphPart2 = ref('')
const bookNotFound = ref(false)
const isAIThinking = ref(false)

const emit = defineEmits([])

const loadBook = async () => {
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    }

    const response = await fetch(
      `https://i27f13a1be.execute-api.us-east-1.amazonaws.com/dev?id=${props.guid}`,
      requestOptions
    )
    const responseJson = await response.json()
    console.log(responseJson)

    const item = responseJson.Items[0]
    title.value = decodeURIComponent(item.title.S)
    epigraph.value = decodeURIComponent(item.epigraph.S)
    
    const timestampString = item.timestamp.S || item.timestamp.N

    const timestamp = parseFloat(timestampString) / 1000
    const currentTime = Date.now() / 1000

    const secondsSince = currentTime - timestamp
    const minutesSince = secondsSince / 60

    if(minutesSince > 2) {
      isAIThinking.value = false
    }

    console.log(minutesSince)
    
    if(!item.summary) {
      ///try again later
      ///still loading
      isAIThinking.value = true
      return
    }


    console.log(item)
    summary.value = decodeURIComponent(item.summary.S)

    const splitKeys = ['"–', '" -', '" -']
    splitKeys.forEach((splitKey) => {
      if (epigraph.value.includes(splitKey)) {
        const epigraphParts = epigraph.value.split(splitKey)
        epigraphPart1.value = epigraphParts[0] + '"'
        if (epigraphParts[1]) {
          epigraphPart2.value = '-' + epigraphParts[1]
        }
      }
    })

    isAIThinking.value = false
  } catch (e) {
    bookNotFound.value = true
  }
}

onMounted(async () => {
  await loadBook()
})

const interval = setInterval(async () => {
  console.log('refreshing')
  if(isAIThinking.value) {
    await loadBook()  
  } else {
    clearInterval(interval)
  }
}, 7000)
</script>

<template>
  <LoadingDialog :isOpen="isAIThinking">
    <div class="lds-hourglass"></div>
    <div>
      <i> AI thinking!</i>
      <br />
      (this could take a minute 😴)
    </div>
  </LoadingDialog>
  <main class="root">
    <div class="wrapper flow center" v-if="bookNotFound">
      <br>
      <p class="author">
        <i><a href="/">AI Book Planner</a></i>
      </p>
      <br><br>
      Page not found
    </div>
    <div class="wrapper flow" v-else>
      <h1>{{ title }}</h1>
      <p class="author">
        <i><a href="/">AI Book Planner</a></i>
      </p>
      <br />
      <div class="epigraph-wrapper">
        <span class="epigraph" v-if="!epigraphPart1 || !epigraphPart2">{{ epigraph }}</span>
        <div class="epigraph">
          <span class="epigraph-part-1" v-if="epigraphPart1 && epigraphPart2">{{
            epigraphPart1
          }}</span>
          <span class="epigraph-part-2" v-if="epigraphPart1 && epigraphPart2">{{
            epigraphPart2
          }}</span>
        </div>
      </div>
      {{ summary }}
      <br />
      <br />
    </div>
  </main>
</template>

<style scoped>
h1 {
  margin-top: 0;
  padding-top: 2rem;
  text-align: center;
}

.epigraph-part-1 {
  font-style: italic;
}

.epigraph-part-2 {
  text-align: right;
}

.epigraph-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.epigraph {
  max-width: 45ch;
  display: flex;
  flex-direction: column;
}

h1,
h2,
h3 {
  color: black;
  font-family: 'Times New Roman', Times, serif;
}

.root {
  background-color: hsl(0, 3%, 94%);
  white-space: pre-wrap;
  color: black;
  /* height: 100dvh; */
  height: 100%;
  min-height: 100vh;
  font-family: 'Times New Roman', Times, serif;
}

.wrapper {
  --clr-text: hsl(204, 20%, 15%);
  --clr-background: #ffffff;
  --clr-text-background: hsl(0, 7%, 89%);
  --clr-primary: #8fb4ff;
  --clr-secondary: hsl(222, 100%, 96%);
  --clr-accent: #ff8f94;
}

.author {
  text-align: center;
  font-size: 0.8rem;
  font-family: 'Times New Roman', Times, serif;
}

a {
  color: #3366cc;
}

.center {
  text-align: center;
}
</style>
