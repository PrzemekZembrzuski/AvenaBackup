const ora = require('ora');


class Spinner{
    constructor(){
        this.spinner = ora()
    }
    start(text){
        this.spinner.start(text)
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