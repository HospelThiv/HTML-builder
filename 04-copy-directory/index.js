const fs = require("fs");
const path = require('path');

async function readDirFun() {

    const data = await fs.promises.readdir(path.join(__dirname))
    const dataFiles = await fs.promises.readdir(path.join(__dirname, 'files'))

    if (data.indexOf('files-copy') < 0) {
        fs.mkdir(path.join(__dirname, 'files-copy'), (err) => {
            if (err) { return console.error(err) }
            // console.log('ok')
        })
    }

    const dataCopyFolder = await fs.promises.readdir(path.join(__dirname, 'files-copy'))

    if (dataCopyFolder.length) {
        dataCopyFolder.forEach(file => {
            fs.unlink(path.join(__dirname, 'files-copy', file), err => {
                if (err) throw err; // не удалось удалить файл
            });
        });
    }

    dataFiles.forEach(file => {
        fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), err => {
            if (err) throw err; // не удалось скопировать файл
        });
    });

}

try {
    readDirFun();
} catch (error) {
    console.log(err);
}