const path = require('path')

require('dotenv').config(path.join(path.dirname(process.execPath),'.env'));

const log = require('./components/log');
const email = require('./components/email');
const archiver = require('./components/archiver');
const ftp = require('./components/ftp');
const Backup = require('./components/backup');

(async function () {
  // Make backup
  const backup_errors = []
  const iterations = process.env.DB_PATHS.split(',').length
  for (let index = 0; index < iterations; index++) {
    const backup = new Backup(process.env.DB_PATHS.split(',')[index])
    await backup.run()
    if(backup.getErrors.length){
      backup_errors.push(backup.getErrors)
    }
  }

  // Add to archive
  log.setHeader('archiver')
  archiver.make(process.env.DB_BACKUP_PATH, process.env.ARCHIVE_PATH)
  // Send to ftp
  log.setHeader('FTP')
  await ftp.send(archiver.getArchive_file)  
  
  // Send mail
  log.setHeader('Email')
  await email.send({
    backup:backup_errors,
    archive:archiver.getErrors,
    ftp:ftp.getErrors
  })
  log.close()

})()
