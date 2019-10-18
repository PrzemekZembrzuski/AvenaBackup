const archiver = require('archiver');
const fs = require('fs');
const path = require('path');



class Archiver {
    constructor() {
        this.archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        this.date = new Date().toJSON().slice(0, 10).split('-').reverse().join('-')
        this.archive_file = undefined
    }

    _exist(backup_dir) {
        const dir_content_array = fs.readdirSync(backup_dir).map(dir_content => {
            return path.join(backup_dir, dir_content)
        })
        if (!dir_content_array.length) {
            this.return.error = 'NO BACKUP FILES'
            return false
        }
        return dir_content_array
    }
    make(backup_dir, destinatio_path) {
        const typeObj = {type:'Archive'}
        const dir_content_array =this._exist(backup_dir) 
        if (dir_content_array) {
            return new Promise((resolve,reject) => {
                destinatio_path = path.join(path.normalize(destinatio_path).toLowerCase(), `${this.date}.zip`) 
                const output = fs.createWriteStream(destinatio_path);
                // good practice to catch warnings (ie stat failures and other non-blocking errors)
                this.archive.on('warning', function (error) {
                    reject(error)
                });

                // good practice to catch this error explicitly
                this.archive.on('error', function (error) {
                    reject(error)
                });

                output.on('close', () => resolve({files:dir_content_array,destination:destinatio_path}))

                this.archive.pipe(output);
                dir_content_array.map(content_path => {
                    content_path = content_path.toLowerCase()
                    if (fs.lstatSync(content_path).isDirectory()) {
                        this.archive.directory(content_path, path.basename(content_path))
                    } else {
                        this.archive.file(content_path, { name: path.basename(content_path) })
                    }
                })
                this.archive.finalize()
            })
        }
    }
}

module.exports = new Archiver()