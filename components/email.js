const nodemailer = require('nodemailer');
const path = require('path');
const log = require('./log');
const cheerio = require('cheerio');
const fs = require('fs')

class Email {
  constructor() {
    this.transporter = nodemailer.createTransport({
      pool: true,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // use TLS
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
    }
    })
  }

  send(errors) {
    // Modifing email html
    let html = fs.readFileSync('./mail/index.html','utf-8');
    const errors_filtered = Object.values(errors).filter(value=>{
      return value.length
    })
    const $ = cheerio.load(html)
    if(errors_filtered.length){
      $('#success').remove()
      const table_body = $('table > tbody')
      Object.keys(errors).map(key=>{
        table_body.append(`
          <tr>
            <td>${key}</td>
            <td>${errors[key]}</td>
          </tr>
        `)
      })
    }else{
      $('table').remove()
      $('#error-header').remove()
    }
    html = $.root().html()

    // Send email
    return new Promise((resolve,reject) => {
      this.transporter.sendMail({
        from: process.env.EMAIL_FROM, // sender address
        to: process.env.EMAIL_LIST.trim().split(','), // list of receivers
        subject: process.env.EMAIL_SUBJECT, // Subject line
        html: html// plain text body
      }, error => {
        if (error) {
          reject(error)
        }else{
          resolve()
        }
        this.transporter.close()
      })
    })
  }

}

module.exports = new Email()




