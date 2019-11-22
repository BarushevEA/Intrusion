const {app, BrowserWindow} = require('electron');

// Храните глобальную ссылку на объект окна, если вы этого не сделаете, окно будет
// автоматически закрываться, когда объект JavaScript собирает мусор.
let win;

function createWindow() {
    // Создаём окно браузера.
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

    // and load the index.html of the app.
    win.loadFile('index.html');

    // Отображаем средства разработчика.
    // win.webContents.openDevTools()

    // Будет вызвано, когда окно будет закрыто.
    win.on('closed', () => {
        // Разбирает объект окна, обычно вы можете хранить окна
        // в массиве, если ваше приложение поддерживает несколько окон в это время,
        // тогда вы должны удалить соответствующий элемент.
        win = null
    });

    win.webContents.once('did-finish-load', function () {
        setTimeout(() => {
            win.show();
        }, 1000);
    });
}

// Этот метод будет вызываться, когда Electron закончит
// инициализацию и готов к созданию окон браузера.
// Некоторые API могут использоваться только после возникновения этого события.
app.on('ready', createWindow);

// Выходим, когда все окна будут закрыты.
app.on('window-all-closed', () => {
    // Для приложений и строки меню в macOS является обычным делом оставаться
    // активными до тех пор, пока пользователь не выйдет окончательно используя Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // На MacOS обычно пересоздают окно в приложении,
    // после того, как на иконку в доке нажали и других открытых окон нету.
    if (win === null) {
        createWindow()
    }
});

// В этом файле вы можете включить код другого основного процесса
// вашего приложения. Можно также поместить их в отдельные файлы и применить к ним require.
