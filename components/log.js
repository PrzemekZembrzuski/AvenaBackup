const fs = require('fs');
const path = require('path');


const dirCreate = require('../utils/dirCreate')

class Log{
    constructor(){
        this.date = new Date().toJSON().slice(0,10).split('-').reverse().join('-');
        this.dir_path = path.normalize(path.join(path.dirname(process.execPath),'logs'))
        // this.dir_path = path.normalize(path.join(__dirname,'logs'))
        this.path = path.normalize(path.join(this.dir_path,`${this.date}-${Date.now()}.log`))
        this._create()
        this.file = fs.createWriteStream(this.path,{flags:'a'})
    }
    _create(){
        dirCreate([this.dir_path])
    }
    add(text){
        this.file.write(text.toString()+'\r\n')
        return this
    }
    error(text){
        this.file.write('----------------------ERRORS----------------------\r\n');
        this.file.write(text.toString()+'\r\n')
        this.file.write('---------------------ENDERRORS---------------------\r\n')
        return this
    }
    setHeader(text){
        this.file.write(`~~~~~~~~~~~~~~~~~~~~~~~~${text.toUpperCase()}~~~~~~~~~~~~~~~~~~~~~~~~\r\n`)
        return this
    }
    close(){
        this.file.end('--------------------END--------------------')
    }
}

module.exports = new Log()