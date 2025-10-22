<template>
  <main class="px-4 rounded-2xl">
    <Navbar @search="handleSearch" />
    <Hero :widgets="filteredWidgets" />
  </main>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Navbar, Hero } from './components'

export default {
  components: {
    Navbar,
    Hero,
  },
  setup() {
    const widgets = ref<WidgetsConfig>()
    const searchFilter = ref<string>('')
    const handleSearch = (searchValue: string) => {
      searchFilter.value = searchValue
      console.log(searchValue)
    }
    const filteredWidgets = computed(() => {
      if (!widgets.value) return null // Return undefined here
      const filtered: WidgetsConfig = Object.fromEntries(
        Object.entries(widgets.value).filter(([key, value]) =>
          value.title.includes(searchFilter.value),
        ),
      )
      console.log(filtered)
      return filtered
    })
    onMounted(async () => {
      // Move onMounted inside setup
      const widgetData = await window.electronAPI.readWidgetsJson()
      // sort widgets by title
      widgets.value = widgetData
    })

    return {
      handleSearch,
      widgets,
      filteredWidgets,
    }
  },
}
</script>