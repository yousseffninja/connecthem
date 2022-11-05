const nm = require('nodemailer/')


const mailer = nm.createTransport({
  port: 587,
  secure: false,
  host: "smtp.gmail.com",
  auth: {
    type: 'OAuth2',
    user: "emaial",
    pass: "password",
    clientSecret: "",
    clientId: ""
  }
})

module.exports.composeEmailForSignup = (to, name = 'Applicant') => {
  return {
    from,
    to,
    subject: "Application Recieved",
    text: `Hi ${name},\nYour application to signup is being processed. You will be notified once we get done.\n Regards,`
  }
}

module.exports.composeEmailForGrant = (to, name = 'Applicant') => {
  return {
    from,
    to,
    subject: "Application Recieved",
    text: `Hi ${name},\nYour application to get a fee grant is being processed. You will be notified once we get done.\n Regards,`
  }
}

module.exports.composeEmailForGrant = (to, name = 'Applicant') => {
  return {
    from,
    to,
    subject: "Application Recieved",
    text: `Hi ${name},\nYour application to get an internship is being processed. You will be notified once we get done.\n Regards,`
  }
}

module.exports.composeEmailForSuccessSignup = (to, name = 'Applicant') => {
  console.log('email success signup', to, name)
  return {
    from,
    to,
    subject: "Application Recieved",
    html: `<p>Hi ${name},\nYour application has been successfully accepted. You can now login through this <a href="https://fyp1.mabdullahq.repl.co/student/login">link</a>.</p><p>Regards,</p>`
  }
}


module.exports.composeEmailForSuccessGrant = (to, name = 'Applicant') => {
  return {
    from,
    to,
    subject: "Application Recieved",
    html: `<p>Hi ${name},\nYour application for a fee grant has been accepted. You will shortly recieve further instructions.</p><p>Regards,</p>`
  }
}


module.exports.composeEmailForSuccessInternship = (to, name = 'Applicant') => {
  return {
    from,
    to,
    subject: "Application Recieved",
    html: `<p>Hi ${name},\nYour application for a internship has been forwarded to various companies. Interested companies will contact you shortly. You can visit this <a href="https://fyp1.mabdullahq.repl.co/companies">link</a> to get further info about registered companies.</p><p>Regards,</p>`
  }
}

module.exports.send = (draft, callback = (err, info) => { console.log(err); console.log(info) }) => {
  console.log('senfin email')
  mailer.sendMail(draft, callback)
}
