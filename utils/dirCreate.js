const fs = require('fs')


module.exports = (dirs) => {
    dirs.map(dir => {
        try {
            fs.accessSync(dir)
        } catch (error) {
            fs.mkdirSync(dir)
        }
    })
}