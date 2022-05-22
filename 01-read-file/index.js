const fs = require("fs")
const path = require('path')

const readStr = fs.createReadStream(path.join(__dirname, 'text.txt'), "utf8");

readStr.on("data", function (chunk) {
    console.log(chunk);
});
