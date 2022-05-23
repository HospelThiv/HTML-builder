const fs = require("fs");
const path = require('path');

async function readDirFun() {

    const data = await fs.promises.readdir(path.join(__dirname, 'project-dist'))
    const dataFiles = await fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })

    if (data.indexOf('bundle.css') < 0) {
        fs.open(path.join(__dirname, 'project-dist', 'bundle.css'), 'w', (err) => {
            if (err) throw err;
            writeFileCss();
        });
    } else {
        fs.unlink(path.join(__dirname, 'project-dist', 'bundle.css'), err => {
            if (err) throw err;
        });
        fs.open(path.join(__dirname, 'project-dist', 'bundle.css'), 'w', (err) => {
            if (err) throw err;
            writeFileCss();
        });
    }

    function writeFileCss() {
        dataFiles.forEach(file => {
            if (file.isFile()) {
                if (file.name.length >= 5 && file.name.substring(file.name.length - 4, file.name.length) == '.css') {
                    const readStr = fs.createReadStream(path.join(__dirname, 'styles', file.name));
                    readStr.on("data", function (chunk) {
                        fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), chunk, (err) => {
                            if (err) throw err;
                        });
                    });
                }
            }
        });
    }
}

try {
    readDirFun();
} catch (error) {
    console.log(err);
}