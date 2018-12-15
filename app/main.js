const { app, BrowserWindow } = require('electron')

let mainWin

function createMainWindow() {
	mainWin = new BrowserWindow({ 
		width: 800, 
		height: 600,
		webPreferences: {
			//nodeIntegration: false
		}
	 })

	mainWin.loadFile(__dirname + '/index.html')
	mainWin.setTitle('Phase Calc')

	mainWin.openDevTools();

	mainWin.on('closed', () => {
		mainWin = null
	})
}

app.on('ready', createMainWindow)
