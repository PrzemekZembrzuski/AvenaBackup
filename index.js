const path = require('path');

require('dotenv').config(path.join(path.dirname(process.execPath), '.env'));

const log = require('./components/log');
const email = require('./components/email');
const archiver = require('./components/archiver');
const ftp = require('./components/ftp');
const Backup = require('./components/backup');
const Spinner = require('./components/spinner');



(async function () {


    const errorsArray = [];

    const spinner = new Spinner('GBAK')

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




    spinner.succeed().change('Archive')
    // Add to archive
    try {
        log.setHeader('Archiver');
        const { files, destinantion } = await archiver.make(process.env.DB_BACKUP_PATH, process.env.ARCHIVE_PATH);
        log.add(`Added to archive ${files.join(',')}`)
            .add(`Archive path: ${destinantion}`);

        spinner.succeed().change('FTP')
        // Send to ftp
        try {
            log.setHeader('FTP');
            const result = await ftp.send(destinantion);
            log.add(result);

        } catch (error) {
            errorsArray.push({
                type: 'FTP',
                error
            });
            log.error(error);
            spinner.fail()
        }
    } catch (error) {
        errorsArray.push({
            type: 'Archive',
            error
        });
        log.error(error);
        spinner.fail()
    }



    spinner.change('Email')
    // Send mail
    try {
        log.setHeader('Email');
        await email.send(errorsArray);
        spinner.succeed()
    } catch (error) {
        spinner.fail()
    }
    log.close();
})()


