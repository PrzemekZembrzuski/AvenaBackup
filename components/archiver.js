const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const log = require('./log');



class Archiver {
    constructor() {
        this.archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        this.date = new Date().toJSON().slice(0, 10).split('-').reverse().join('-')
        this.archive_file = undefined
        this.errors = []
    }
    make(backup_dir, destinatio_path) {
        const dir_content_array = fs.readdirSync(backup_dir).map(dir_content => {
            return path.join(backup_dir, dir_content)
        })

        if (!dir_content_array.length) {
            this.setErrors = 'NO BACKUP FILES';
            log.add('NO BACKUP FILES', true)
        } else {
            destinatio_path = path.join(path.normalize(destinatio_path).toLowerCase(), `${this.date}.zip`)
            const output = fs.createWriteStream(destinatio_path);
            // good practice to catch warnings (ie stat failures and other non-blocking errors)
            this.archive.on('warning', function (err) {
                this.setErrors = err
            });

            // good practice to catch this error explicitly
            this.archive.on('error', function (err) {
                this.setErrors = err
            });
            this.archive.pipe(output);
            dir_content_array.map(content_path => {
                content_path = content_path.toLowerCase()
                if (fs.lstatSync(content_path).isDirectory()) {
                    this.archive.directory(content_path, path.basename(content_path))
                } else {
                    this.archive.file(content_path, { name: path.basename(content_path) })
                }
                log.add(`Added to archive "${content_path}"`)
                if(this.errors.length){
                    log.add(this.getErrors,true)
                }
            })
            this.archive.finalize()
            this.setArchive_file = destinatio_path
            
        }
    }
    set setArchive_file(destinatio_path){
        this.archive_file = destinatio_path
    }

    get getArchive_file(){
        return this.archive_file
    }
    get getErrors(){
        return this.errors
    }
    set setErrors(error){
        this.errors.push(error)
    }
}

module.exports = new Archiver()