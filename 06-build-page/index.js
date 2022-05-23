const fs = require("fs");
const path = require('path');
console.log('run')

async function readDirFun() {

    const data = await fs.promises.readdir(path.join(__dirname))
    const assetsFolder = await fs.promises.readdir(path.join(__dirname, 'assets'), { withFileTypes: true })
    const assetsFolderF = await fs.promises.readdir(path.join(__dirname, 'assets', 'fonts'), { withFileTypes: true })
    const assetsFolderI = await fs.promises.readdir(path.join(__dirname, 'assets', 'img'), { withFileTypes: true })
    const assetsFolderS = await fs.promises.readdir(path.join(__dirname, 'assets', 'svg'), { withFileTypes: true })
    const componentFolder = await fs.promises.readdir(path.join(__dirname, 'components'), { withFileTypes: true })
    const styleFolder = await fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })

    if (data.indexOf('project-dist') < 0) {
        fs.mkdir(path.join(__dirname, 'project-dist'), (err) => {
            if (err) { return console.error(err) }
        })
        fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), (err) => {
            if (err) { return console.error(err) }
        })
        assetsFolder.forEach(file => {
            if (file.isFile() == false) {
                fs.mkdir(path.join(__dirname, 'project-dist', 'assets', file.name), (err) => {
                    if (err) { return console.error(err) }
                })
            }
        });
    }

    // await delObjects(path.join(__dirname, 'project-dist'));

    const assetsDistF = await fs.promises.readdir(path.join(__dirname, 'project-dist', 'assets', 'fonts'), { withFileTypes: true })
    const assetsDistI = await fs.promises.readdir(path.join(__dirname, 'project-dist', 'assets', 'img'), { withFileTypes: true })
    const assetsDistS = await fs.promises.readdir(path.join(__dirname, 'project-dist', 'assets', 'svg'), { withFileTypes: true })

    function delFiles(clearFolder, folder) {
        clearFolder.forEach(file => {
            if (file.isFile()) {
                fs.unlink(path.join(__dirname, 'project-dist', 'assets', folder, file.name), err => {
                    if (err) throw err; // не удалось удалить файл
                });
            }
        });
    }

    delFiles(assetsDistF, 'fonts')
    delFiles(assetsDistI, 'img')
    delFiles(assetsDistS, 'svg')

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
            if (chunk.indexOf('{{header}}')) {
                // console.log(chunk)
                chunk.replace(/{{header}}/i, '')
                console.log(chunk)
                const readStr1 = fs.createReadStream(path.join(__dirname, 'components', 'header.html'));
                readStr1.on("data", function (chunk) {
                    // writeStr.write(input + '\n');
                    fs.appendFile(path.join(__dirname, 'project-dist', 'index.html'), chunk, (err) => {
                        if (err) throw err;
                    });
                });
            }
            // if (chunk.indexOf('{{articles}}')) {
            //     // console.log(chunk)
            //     chunk.replace(/{{articles}}/i, '')
            //     const readStr2 = fs.createReadStream(path.join(__dirname, 'components', 'articles.html'));
            //     fs.appendFile(path.join(__dirname, 'project-dist', 'index.html'), chunk, (err) => {
            //         if (err) throw err;
            //     });
            // }
            // if (chunk.indexOf('{{footer}}')) {
            //     // console.log(chunk)
            //     chunk.replace(/{{footer}}/i, '')
            //     const readSt3 = fs.createReadStream(path.join(__dirname, 'components', 'footer.html'));
            //     fs.appendFile(path.join(__dirname, 'project-dist', 'index.html'), chunk, (err) => {
            //         if (err) throw err;
            //     });
            // }
            fs.appendFile(path.join(__dirname, 'project-dist', 'index.html'), chunk, (err) => {
                if (err) throw err;
            });
        });
    });

    fs.open(path.join(__dirname, 'project-dist', 'style.css'), 'w', (err) => {
        if (err) throw err;
        writeFileCss();
    });


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

    function writeFileHtml() {
        componentFolder.forEach(file => {
            if (file.isFile()) {
                if (file.name.length >= 6 && file.name.substring(file.name.length - 5, file.name.length) == '.html') {
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



    // listObjects(path.join(__dirname, 'assets', 'fonts'));
    // listObjects(path.join(__dirname, 'assets', 'img'));
    // listObjects(path.join(__dirname, 'assets', 'svg'));

    // async function listObjects(pathFolder) {
    //     const dataFile = await fs.promises.readdir(pathFolder, { withFileTypes: true })
    //     if (dataFile.length) {
    //         dataFile.forEach(file => {
    //             if (file.isFile()) {
    //                 fs.unlink(path.join(pathFolder, file.name), err => {
    //                     if (err) throw err; // не удалось удалить файл
    //                 });
    //             } else {
    //                 fs.rmdir(pathFolder, err => {
    //                     if (err) throw err; // не удалось удалить папку
    //                     console.log('Папка успешно удалена');
    //                 });
    //             }
    //         });
    //     }
    // }

    // data.forEach(file => {
    //     if (file.isFile()) {
    //         const stats = fs.stat(path.join(__dirname, 'secret-folder', file.name), (error, stats) => {
    //             console.log(file.name, stats);
    //         });
    //     }
    // });


    // listObjects(path.join(__dirname, 'project-dist'));

    // if (data.indexOf('bundle.css') < 0) {
    //     fs.open(path.join(__dirname, 'project-dist', 'bundle.css'), 'w', (err) => {
    //         if (err) throw err;
    //         writeFileCss();
    //     });
    // } else {
    //     fs.unlink(path.join(__dirname, 'project-dist', 'bundle.css'), err => {
    //         if (err) throw err;
    //     });
    //     fs.open(path.join(__dirname, 'project-dist', 'bundle.css'), 'w', (err) => {
    //         if (err) throw err;
    //         writeFileCss();
    //     });
    // }

    // function writeFileCss() {
    //     dataFiles.forEach(file => {
    //         if (file.isFile()) {
    //             if (file.name.length >= 5 && file.name.substring(file.name.length - 4, file.name.length) == '.css') {
    //                 const readStr = fs.createReadStream(path.join(__dirname, 'styles', file.name));
    //                 readStr.on("data", function (chunk) {
    //                     fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), chunk, (err) => {
    //                         if (err) throw err;
    //                     });
    //                 });
    //             }
    //         }
    //     });
    // }
}

// async function readDirFun1() {

//     const data = await fs.promises.readdir(path.join(__dirname))
//     const dataFiles = await fs.promises.readdir(path.join(__dirname, 'files'))

//     if (data.indexOf('files-copy') < 0) {
//         fs.mkdir(path.join(__dirname, 'files-copy'), (err) => {
//             if (err) { return console.error(err) }
//         })
//     }

//     const dataCopyFolder = await fs.promises.readdir(path.join(__dirname, 'files-copy'))

//     if (dataCopyFolder.length) {
//         dataCopyFolder.forEach(file => {
//             fs.unlink(path.join(__dirname, 'files-copy', file), err => {
//                 if (err) throw err; // не удалось удалить файл
//             });
//         });
//     }

//     dataFiles.forEach(file => {
//         fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), err => {
//             if (err) throw err; // не удалось скопировать файл
//         });
//     });

// }


// async function delObjects(pathFolder) {
//     const dataFile = await fs.promises.readdir(pathFolder, { withFileTypes: true })
//     dataFile.forEach(file => {
//         if (file.isFile()) {
//             console.log(file)
//             fs.unlink(path.join(pathFolder, file.name), err => {
//                 if (err) throw err; // не удалось удалить файл
//             });
//         } else {
//             delObjects(path.join(pathFolder, file.name));
//         }
//     });
// }


// async function delObjects(pathFolder) {
//     const dataFile = await fs.promises.readdir(pathFolder, { withFileTypes: true })
//     if (dataFile.length) {
//         dataFile.forEach(file => {
//             if (file.isFile()) {
//                 fs.unlink(path.join(pathFolder, file.name), err => {
//                     if (err) throw err; // не удалось удалить файл
//                 });
//             } else {
//                 delObjects(path.join(pathFolder, file.name));
//             }
//         });
//     } else {
//         fs.rmdir(pathFolder, err => {
//             if (err) throw err; // не удалось удалить папку
//             console.log('Папка успешно удалена');
//         });
//     }
// }

try {
    readDirFun();
} catch (error) {
    console.log(error);
}