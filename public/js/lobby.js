(function() {

  function updateGameTime (startTime) {
    let runtime = new Date().getTime() - startTime,
        days = Math.floor(runtime / 1000 / 60 / 60 / 24, 10),
        hours = Math.floor(runtime / 1000 / 60 / 60 % 24),
        minutes = Math.floor(runtime / 1000 / 60 % 60),
        seconds = Math.floor(runtime / 1000 % 60)

    let d = days > 0 ? days + ' days ' : '',
        h = hours > 0 ? hours + 'h ' : ''

    document.querySelector('#runtime').innerHTML = `${d}${h}${minutes}min ${seconds}s`
  }

  function joinGame () {
    localStorage.setItem('character', JSON.stringify({
      characterType: document.querySelector('[name=type]:checked').value,
      name: document.querySelector('#name').value || 'herra huu'
    }))
    
    window.location = 'game.html'
  }

  fetch('/status')
    .then(res => res.json())
    .then(status => {
      document.querySelector('#rooms').html(status.rooms)
      document.querySelector('#players').html(status.players)
      setInterval(() => updateGameTime(status.startTime), 1000)
    })
    .catch(err => {
      document.querySelector('#rooms').innerHTML = 0
      document.querySelector('#players').innerHTML = 0
      document.querySelector('#runtime').innerHTML = 'Server is down at the moment'
    })
  
  document.querySelector('form').addEventListener('submit', joinGame)
  
  try {
    const c = JSON.parse(localStorage.getItem("character"))
    document.querySelector(`[value=${c.characterType}]`).checked = true
    document.querySelector('#name').value = c.name
  } catch (e) {
    console.info("no old credentials found");
  }

})()
