const fs = require("fs");
const path = require('path');

async function readDirFun() {

    const data = await fs.promises.readdir(path.join(__dirname))
    // const assetsFolder = await fs.promises.readdir(path.join(__dirname, 'assets'), { withFileTypes: true })
    const assetsFolderF = await fs.promises.readdir(path.join(__dirname, 'assets', 'fonts'), { withFileTypes: true })
    const assetsFolderI = await fs.promises.readdir(path.join(__dirname, 'assets', 'img'), { withFileTypes: true })
    const assetsFolderS = await fs.promises.readdir(path.join(__dirname, 'assets', 'svg'), { withFileTypes: true })
    const styleFolder = await fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })

    if (data.indexOf('project-dist') < 0) {
        await fs.promises.mkdir(path.join(__dirname, 'project-dist'), (err) => {
            if (err) { return console.error(err) }
        })
        await fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets'), (err) => {
            if (err) { return console.error(err) }
        })
        await fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets', 'fonts'), (err) => {
            if (err) { return console.error(err) }
        })
        await fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets', 'img'), (err) => {
            if (err) { return console.error(err) }
        })
        await fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets', 'svg'), (err) => {
            if (err) { return console.error(err) }
        })
        // assetsFolder.forEach(file => {
        //     if (file.isFile() == false) {
        //         fs.mkdir(path.join(__dirname, 'project-dist', 'assets', file.name), (err) => {
        //             if (err) { return console.error(err) }
        //         })
        //     }
        // });
    }

    const assetsDistF = await fs.promises.readdir(path.join(__dirname, 'project-dist', 'assets', 'fonts'), { withFileTypes: true })
    const assetsDistI = await fs.promises.readdir(path.join(__dirname, 'project-dist', 'assets', 'img'), { withFileTypes: true })
    const assetsDistS = await fs.promises.readdir(path.join(__dirname, 'project-dist', 'assets', 'svg'), { withFileTypes: true })

    await delFiles(assetsDistF, 'fonts')
    await delFiles(assetsDistI, 'img')
    await delFiles(assetsDistS, 'svg')

    async function delFiles(clearFolder, folder) {
        if (clearFolder.length) {
            clearFolder.forEach(file => {
                if (file.isFile()) {
                    fs.unlink(path.join(__dirname, 'project-dist', 'assets', folder, file.name), err => {
                        if (err) throw err; // не удалось удалить файл
                    });
                }
            });
        }
    }



    function newFiles(dataFolder, folder) {
        dataFolder.forEach(file => {
            fs.copyFile(path.join(__dirname, 'assets', folder, file.name), path.join(__dirname, 'project-dist', 'assets', folder, file.name), err => {
                if (err) throw err; // не удалось скопировать файл
            });
        });
    }

    newFiles(assetsFolderF, 'fonts')
    newFiles(assetsFolderI, 'img')
    newFiles(assetsFolderS, 'svg')

    fs.open(path.join(__dirname, 'project-dist', 'index.html'), 'w', (err) => {
        if (err) throw err;
        const readStr = fs.createReadStream(path.join(__dirname, 'template.html'), "utf8");
        readStr.on("data", function (chunk) {
            fs.appendFile(path.join(__dirname, 'project-dist', 'index.html'), chunk, (err) => {
                if (err) throw err;
            });
        });

    });

    fs.open(path.join(__dirname, 'project-dist', 'style.css'), 'w', (err) => {
        if (err) throw err;
        writeFileCss();
    });

    await htmlBuild();

    async function htmlBuild() {
        try {
            let str = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
            const component1 = await fs.promises.readFile(path.join(__dirname, 'components', 'header.html'), 'utf-8');
            str = str.replace(`{{header}}`, component1);
            const component2 = await fs.promises.readFile(path.join(__dirname, 'components', 'articles.html'), 'utf-8');
            str = str.replace(`{{articles}}`, component2);
            const component3 = await fs.promises.readFile(path.join(__dirname, 'components', 'footer.html'), 'utf-8');
            str = str.replace(`{{footer}}`, component3);

            const writeStr = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
            writeStr.write(str);

        } catch (error) {
            console.log(error.message)
        }

    }

    function writeFileCss() {
        styleFolder.forEach(file => {
            if (file.isFile()) {
                if (file.name.length >= 5 && file.name.substring(file.name.length - 4, file.name.length) == '.css') {
                    const readStr = fs.createReadStream(path.join(__dirname, 'styles', file.name));
                    readStr.on("data", function (chunk) {
                        fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), chunk, (err) => {
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
    console.log(error);
}