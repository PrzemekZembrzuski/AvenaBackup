const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
const log = require('./log');

class FTP{
    constructor(){
        this.options = {
            host: process.env.FTP_SERVER,
            user: process.env.FTP_USERNAME,
            password: process.env.FTP_PASSWORD,
            secure: true,
            secureOptions:{rejectUnauthorized:false}
        }
        this.client = new ftp.Client()
        this.dayWeek = ['niedziela','poniedziałek','wtorek','środa','czwartek','piątek','sobota']
        this.errors = []
        this.client.ftp.verbose = true
    }
    _connect(){
        return this.client.access(this.options)     
    }
    async send(file_path){
            try {
                await this._connect()
                await this.client.cd(`/AvenaBackup/${process.env.NAME}/${this.dayWeek[new Date().getDay()]}`)
                await this.client.upload(fs.createReadStream(file_path),path.basename(file_path))
                this.client.close()
                log.add('Sended to FTP with no errors')
            } catch (error) {
                log.add(error,true)
                this.setErrors = error
                console.log(error)
            }
    }
    get getErrors(){
        return this.errors
    }
    set setErrors(error){
        this.errors.push(error)
    }
}


module.exports = new FTP()