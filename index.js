const path = require('path');

require('dotenv').config(path.join(path.dirname(process.execPath), '.env'));

const log = require('./components/log');
const email = require('./components/email');
const archiver = require('./components/archiver');
const ftp = require('./components/ftp');
const Backup = require('./components/backup');




(async function () {


    const errorsArray = [];

    // Make backup
    const DBPaths = process.env.DB_PATHS.split(',');
    const iterations = DBPaths.length;
    for (let index = 0; index < iterations; index++) {
        const backup = new Backup(DBPaths[index]);
        const { error, type, output } = backup.run();
        errorsArray.push({
            type,
            error
        });
        log.setHeader(type)
            .add(output)
            .error(error);
    }





    // Add to archive
    try {
        log.setHeader('Archiver');
        const { files, destinantion } = await archiver.make(process.env.DB_BACKUP_PATH, process.env.ARCHIVE_PATH);
        log.add(`Added to archive ${files.join(',')}`)
            .add(`Archive path: ${destinantion}`);

        // Send to ftp
        try {
            log.setHeader('FTP');
            const result = await ftp.send(destinantion);
            log.add(result);

        } catch (error) {
            errorsArray.push({
                type:'FTP',
                error
            });
            log.error(error);
        }
    } catch (error) {
        errorsArray.push({
            type:'Archive',
            error
        });
        log.error(error);
    }



    // Send mail
    try {
        log.setHeader('Email');
        await email.send(errorsArray);
    } catch (error) {
        log.error(error);
    }


    log.close();
})()


