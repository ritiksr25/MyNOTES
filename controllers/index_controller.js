const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.index = (req, res) => {
    res.render('users/welcome');
}

module.exports.contact = (req, res) => {
    res.render('users/contact');
}

module.exports.contactProcess = async (req, res) => {
    const msg = {
        to: process.env.PERSONAL_EMAIL,
        from: process.env.APP_EMAIL,
        subject: 'Contact Form',
        html: `<strong>MyNOTES got a new contact form.<br><br>
        Name: ${req.body.name}<br>
        Email: ${req.body.email}<br>
        Subject: ${req.body.subject}<br>
        Message: ${req.body.message}
        <br><br>Regards<br>Team MyNOTES</strong>`,
    };
    let send = await sgMail.send(msg);
    req.flash('success_msg', 'Your message has been successfully submitted');
    res.redirect('/');
}