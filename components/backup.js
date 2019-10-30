const { spawnSync } = require('child_process');
const path = require('path');

const dirCreate = require('../utils/dirCreate');
const clearDir = require('../utils/clearDir');

class Backup {
  constructor(db_path) {
    this.backup_path = path.normalize(process.env.DB_BACKUP_PATH).toLowerCase()
    this.db_path = path.normalize(db_path).toLowerCase()
    this.db_name = path.basename(db_path.toLowerCase(), '.fdb')
    this.backup_file_path = path.normalize(path.join(process.env.DB_BACKUP_PATH, `${this.db_name}.fbk`)).toLowerCase()
    this.log_dir_path = path.join(path.dirname(this.backup_file_path), 'logs')
    this.log_file_path = path.join(this.log_dir_path, `${this.db_name}.log`)
    this.type = `GBAK(${this.db_name})`
    this.return = {
      error: '',
      output: ''
    }
    //constructor functions execution
    this._checkDir()
  }
  
  _checkDir(){
    dirCreate([process.env.DB_BACKUP_PATH,this.log_dir_path])
  }
  _clearLogDir(){
    clearDir(this.log_dir_path)
  }


  run() {
    this._clearLogDir()
    const subprocess = spawnSync('gbak.exe', ['-t', '-v', '-user', process.env.DB_USERNAME, '-password', process.env.DB_PASSWORD, '-y', this.log_file_path, this.db_path, this.backup_file_path])

    if(subprocess.error){
      this.return.error = subprocess.error;
      return this.return
    }
    if (subprocess.stderr.length) {
      this.return.error = subprocess.stderr.toString()
    }
    this.return.output = subprocess.stdout.toString()

    return this.return
  }
}


module.exports = Backup