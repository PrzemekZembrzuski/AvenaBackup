const { spawn } = require('child_process');
const path = require('path');
const log = require('./log');



class Backup{
    constructor(db_path){
        this.errors = []
        this.output = ''
        this.process = undefined
        this.backup_path = path.normalize(process.env.DB_BACKUP_PATH).toLowerCase()
        this.db_path = path.normalize(db_path).toLowerCase()
        this.db_name = path.basename(db_path.toLowerCase(), '.fdb')
        this.backup_path = path.normalize(path.join(process.env.DB_BACKUP_PATH,`${this.db_name}.fbk`)).toLowerCase()
        this.log_path = path.normalize(path.join(path.dirname(this.backup_path), 'logs', `${this.db_name}.log`))
    }

    run(){
        return new Promise(resolve => {
            const processObj = spawn('gbak.exe',['-t','-user',process.env.DB_USERNAME,'-password',process.env.DB_PASSWORD,'-y',this.log_path,this.db_path,this.backup_path])
            processObj.stdout.on('data', (data) => {
              this.output += data.toString()
            });
        
            processObj.stderr.on('data', (data) => {
                this.setErrors = data.toString()
            });
        
            processObj.on('exit', (code) => {
              log.setHeader(`gbak (${this.db_name})`)
              if (code || this.errors.length) {
                log.add(this.getErrors, true)
              }
              log.add(this.output)
              resolve()
            });
          })
    }
    get getErrors(){
        return this.errors
    }
    set setErrors(error){
        this.errors.push(error)
    }

}

module.exports = Backup

