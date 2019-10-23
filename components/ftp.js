const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

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
    }
    _connect(){
        return this.client.access(this.options)     
    }
    send(file_path){
        return new Promise(async (resolve,reject)=>{
            try {
                await this._connect()
                await this.client.cd(`/AvenaBackup/${process.env.NAME}/${this.dayWeek[new Date().getDay()]}`)
                await this.client.upload(fs.createReadStream(file_path),path.basename(file_path))
                this.client.close()
                resolve('File sended')
            } catch (error) {
                reject(error)
            }
        })
    }
}


module.exports = new FTP()