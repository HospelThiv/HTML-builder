const fs = require("fs")
const path = require('path')
console.log(__dirname)
const readStr = fs.createReadStream(__dirname + '\\text.txt', "utf8");

readStr.on("data", function (chunk) {
    console.log(chunk);
});

// console.log(readStr)

// console.log(path.dirname(__dirname))

// console.log(__dirname)

// try {
// } catch (error) {
//     console.log(err)
// }

// funReadDir(__dirname)

// async function funReadDir(pathFolder) {
//     const files = await fs.promises.readdir(pathFolder);
//     console.log('files', files);
// }




// const path = require('path')
// const { Transform, pipeline } = require('stream');

// const rs = fs.createReadStream('text.txt')
// async function openFile() {
//     const data = await fs.promises.readdir(path);
//     const stats = await fs.promises.stat(data);
//     console.log(data);
//     console.log(stats);
// }

// try {
//     openFile();
// } catch (error) {
//     console.log(err)
// }

// const ts = new Transform({
//     transform(chunk, enc, cb) {
//         this.push(chunk);
//         cb();
//     }
// })

// rs.pipe(ts).on('error', err => console.log(err))

// console.log('ok!')