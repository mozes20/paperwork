const path = require('path');

const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const electron = require('electron');
const ipcMain = electron.ipcMain;
const mysql = require('mysql2');
const createReport = require( 'docx-templates');
const fs = require('fs');
const qrcode = require('yaqrcode');
const uuid = require('uuid');
const print = require( "pdf-to-printer");
const docxConverter = require('docx-pdf');
const {spawn} = require("child_process");
const {data} = require("autoprefixer");




function getDateString(){
    let date_ob = new Date();

// current date
// adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

// current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
    let year = date_ob.getFullYear();

// current hours
    let hours = date_ob.getHours();

// current minutes
    let minutes = date_ob.getMinutes();

// current seconds
    let seconds = date_ob.getSeconds();

// prints date in YYYY-MM-DD format
    return (year + "." + month + "." + date)

}

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '/../build/index.html')}`
    );
    // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' });
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('getSablon',async (event,arg)=>{
    const connection = await mysql.createConnection({
        host: 'mikrofelho.hu',
        user: 'admin_gephaz',
        database: 'admin_gephaz',
        password: 'gephaz12'
    });

// simple query
    console.log(arg[1])
    connection.query(
        'SELECT * FROM `tarolttermekek` WHERE `tgyszam`=?',[arg],
        function (err, results, fields) {
            console.log(results); // results contains rows returned by server
            event.reply('getSablonResult', results)
            connection.end()

        }
    );
})




ipcMain.on('try',async (event, arg) => {
    console.log(arg)
// create the connection to database
    const connection = mysql.createConnection({
        host: 'mikrofelho.hu',
        user: 'admin_gephaz',
        database: 'admin_gephaz',
        password: 'gephaz12'
    });

// simple query
     connection.connect()
     connection.query(
        'SELECT * FROM `tarolttermekek` WHERE `tgyszam`=?',[arg],
        function (err, results, fields) {
            console.log(results); // results contains rows returned by server
            event.reply('tryre', results)
            connection.end()
        }
    );



})

ipcMain.on('newItemCreator',async (event,arg)=>{
    const connection = mysql.createConnection({
        host: 'mikrofelho.hu',
        user: 'admin_gephaz',
        database: 'admin_gephaz',
        password: 'gephaz12'
    });
    console.log(arg)

// simple query
    connection.connect()
    console.log(arg)
    connection.query(
        'INSERT INTO tarolttermekek (tnev, ttipus, tgyszam,gynev,cpu,ram,hattertar,kijelzo,os) VALUES (?,?,?,?,?,?,?,?,?)',[arg.tnev,arg.ttipus,arg.tgyszam,arg.gynev,arg.cpu,arg.ram,arg.hattertar,arg.kijelzo,arg.os],
        function (err, results, fields) {
            console.log(results); // results contains rows returned by server
            event.reply('newItemCreatorResult', results)
            connection.end()

        }
    );

})
ipcMain.on('newPaperCreator',async (event,arg)=>{
    const connection = mysql.createConnection({
        host: 'mikrofelho.hu',
        user: 'admin_gephaz',
        database: 'admin_gephaz',
        password: 'gephaz12'
    });
    let id=uuid.v4();
    id += "GEP"
    console.log(id)
    let filterdData={papirkod:id,tid:arg.tgyszam,statusz:"1",garancia:arg.garancia,uzem:arg.beuzemelte}
    // simple query
    console.log(filterdData)
    connection.query(
        'INSERT INTO gpapir (papirkod,tid,statusz,garancia,uzem) VALUES (?,?,?,?,?)',[filterdData.papirkod,filterdData.tid,filterdData.statusz,filterdData.garancia,filterdData.uzem],
        async function (err, results, fields) {
            console.log(results); // results contains rows returned by server
            connection.end()

            let valaszthato1 = "Átadás időpontja:";
            let valaszthato2 = "Üzembe helyezés időpontja:";
            const template = fs.readFileSync('./assets/jotaljegya4.docx');
            if(arg.beuzemelte === true){
            arg.beuzemelte = valaszthato2
            }else {
                arg.beuzemelte = valaszthato1
            }
            arg.date = getDateString();
            arg.id = id;
            const buffer = await createReport.createReport({
                template,
                data: arg,
                additionalJsContext: {
                    qrCode: url => {
                        const dataUrl = qrcode(url, { size: 500 });
                        const data = dataUrl.slice('data:image/gif;base64,'.length);
                        return { width: 2, height: 2, data, extension: '.gif' };
                    },
                }
            });


            await fs.writeFileSync('./assets/report.docx', buffer)
            event.reply('newPaperCreatorResult', 200)
        }
    );
})

//INSERT INTO gpapir (papirkod,tid,statusz,garancia,uzem) VALUES (?,?,?,?,?)

async function getDataFromDatabase(event,arg){
    const connection = mysql.createConnection({
        host: 'mikrofelho.hu',
        user: 'admin_gephaz',
        database: 'admin_gephaz',
        password: 'gephaz12'
    });
    console.log(arg)
    connection.query(
        'SELECT * FROM gpapir JOIN tarolttermekek ON gpapir.tid = tarolttermekek.tgyszam WHERE papirkod = ? ',[arg],
        async function (err, results, fields) {
            console.log(results); // results contains rows returned by server
            event.reply('responsDataFromDatabase',results[0])
            connection.end();
            ipcMain.emit('responsDataFromDatabase2',results[0])

        })

}



ipcMain.on('getDataFromDatabase',getDataFromDatabase)
