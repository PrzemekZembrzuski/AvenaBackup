const { spawnSync } = require('child_process');
const path = require('path');



class Backup {
  constructor(db_path) {
    this.backup_path = path.normalize(process.env.DB_BACKUP_PATH).toLowerCase()
    this.db_path = path.normalize(db_path).toLowerCase()
    this.db_name = path.basename(db_path.toLowerCase(), '.fdb')
    this.backup_path = path.normalize(path.join(process.env.DB_BACKUP_PATH, `${this.db_name}.fbk`)).toLowerCase()
    this.log_path = path.normalize(path.join(path.dirname(this.backup_path), 'logs', `${this.db_name}.log`))
    this.return = {
      type: `GBAK(${this.db_name})`,
      error: '',
      output: ''
    }
  }

  run() {
    const gbak = spawnSync('gbak.exe', ['-t', '-v', '-user', process.env.DB_USERNAME, '-password', process.env.DB_PASSWORD, '-y', this.log_path, this.db_path, this.backup_path])

    if(gbak.error){
      this.return.error = gbak.error;
      return this.return
    }
    if (gbak.stderr.length) {
      this.return.error = gbak.stderr.toString()
    }
    this.return.output = gbak.stdout.toString()

    return this.return
  }
}


module.exports = Backup