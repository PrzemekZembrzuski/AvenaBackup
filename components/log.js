const fs = require('fs');
const path = require('path');


class Log{
    constructor(){
        this.date = new Date().toJSON().slice(0,10).split('-').reverse().join('-');
        this.dir_path = path.normalize(path.join(path.dirname(process.execPath),'logs'))
        this.path = path.normalize(path.join(this.dir_path,`${this.date}-${Date.now()}.log`))
        this._create()
        this.file = fs.createWriteStream(this.path,{flags:'a'})
    }
    _create(){
        try {
            fs.accessSync(this.dir_path)
        } catch (error) {
            fs.mkdirSync(this.dir_path)
        }
    }
    add(text){
        this.file.write(text.toString()+'\r\n')
        return this.file
    }
    error(text){
        this.file.write('----------------------ERRORS----------------------\r\n');
        this.file.write(text.toString()+'\r\n')
        this.file.write('---------------------ENDERRORS---------------------\r\n')
        return this.file
    }
    setHeader(text){
        this.file.write(`~~~~~~~~~~~~~~~~~~~~~~~~${text.toUpperCase()}~~~~~~~~~~~~~~~~~~~~~~~~\r\n`)
        return this.file
    }
    close(){
        this.file.end('--------------------END--------------------')
    }
}

module.exports = new Log()