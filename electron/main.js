const {app, BrowserWindow} = require('electron');
let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1226,
        height: 670,
        resizable: false,
        show: false,
        backgroundColor: 'black',
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('index.html');
    win.on('closed', () => {
        win = null
    });

    win.webContents.once('did-finish-load', function () {
        setTimeout(() => {
            win.show();
        }, 1000);
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});
