const fs = require("fs");
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process')
const rl = readline.createInterface({ input, output });
const writeStr = fs.createWriteStream(path.join(__dirname, 'text.txt'));

rl.question('Hello, please write the text.\n', (input) => {
    inputText(input);
});

rl.on('line', (input) => {
    inputText(input);
});

rl.on('SIGINT', () => {
    exitReadLine()
});

function exitReadLine() {
    console.log('Thanks, see you soon.');
    rl.close();
}

function inputText(input) {
    if (input.indexOf('exit') >= 0) {
        writeStr.write(input.replace(/exit/i, ''));
        console.log('Thanks, see you soon.');
        rl.close();
    } else {
        writeStr.write(input + '\n');
    }
}

try {
} catch (error) {
    console.log(err)
}