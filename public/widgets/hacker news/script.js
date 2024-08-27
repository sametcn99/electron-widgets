function renderTime(time) {
  const date = new Date(time * 1000)
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }
  return date.toLocaleString('en-US', options)
}

document.getElementById('time').innerText = renderTime(1175714200)

async function fetchData() {
  const response = await fetch(
    'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
  )
  const data = await response.json()
  console.log(data)
  for (const id of data) {
    const storyResponse = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
    )
    const story = await storyResponse.json()
    const storyContainer = document.getElementById('story').cloneNode(true)
    storyContainer.id = 'story'
    storyContainer.style.display = 'flex'
    const time = storyContainer.querySelector('#time')
    const title = storyContainer.querySelector('#title')
    title.addEventListener('click', () => {
      window.electronAPI.openExternal(story.url)
    })
    const score = storyContainer.querySelector('#score')
    const by = storyContainer.querySelector('#by')
    time.innerText = renderTime(story.time)
    title.href = story.url
    title.innerText = story.title
    score.innerText = story.score
    by.innerText = story.by
    const container = document.getElementById('container')
    container.appendChild(storyContainer)
  }
}
fetchData()

setInterval(
  () => window.electronAPI.reloadWidget('hacker news'),
  1000 * 60 * 60 // reload every hour
)

window.onscroll = function () {
  scrollFunction()
}

function scrollFunction() {
  const scrollTopButton = document.getElementById('scrollTopButton')
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    scrollTopButton.style.display = 'block'
  } else {
    scrollTopButton.style.display = 'none'
  }
}

document
  .getElementById('scrollTopButton')
  .addEventListener('click', function () {
    document.body.scrollTop = 0 // For Safari
    document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
  })
