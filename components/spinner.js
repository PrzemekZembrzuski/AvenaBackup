const ora = require('ora');


class Spinner{
    constructor(text){
        this.spinner = ora(text).start()
    }

    change(text){
        this.spinner.text = text
        this.spinner.start()
    }
    succeed(){
        this.spinner.succeed()
        return this
    }
    fail(){
        this.spinner.fail()
    }
    stop(){
        this.spinner.stop()
    }
}


module.exports =  Spinner