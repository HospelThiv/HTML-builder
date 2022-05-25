const fs = require("fs");
const path = require('path');

async function readDirFun() {
    const data = await fs.promises.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true })
    data.forEach(file => {
        if (file.isFile()) {
            const stats = fs.stat(path.join(__dirname, 'secret-folder', file.name), (error, stats) => {
                console.log(file.name.replace('.', ' - '), `- ${(stats.size / 1024).toFixed(3)} Kb`);
            });
        }
    });
}

try {
    readDirFun();
} catch (error) {
    console.log(err)
}
