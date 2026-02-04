const { ipcRenderer } = require('electron')

window.closeWindow = function() {
  ipcRenderer.send('close-celebration')
}
