const fs = require('fs');
const path = require('path');


module.exports = (directory) => {

    const dirContent = fs.readdirSync(directory)
    for (const file of dirContent) {
        fs.unlinkSync(path.join(directory, file));
    }
}
