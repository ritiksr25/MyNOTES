const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.index = async (req, res) => {
    let notes = await Note.find({ user: req.user.id }).sort({ createdAt: 'desc' });
    res.render('notes/dashboard', { notes });
}

module.exports.view = async (req, res) => {
    let notes = await Note.findOne({ _id: req.params.id });
    res.render('notes/view', { notes });
}

module.exports.search = async (req, res) => {
    let notes = await Note.find({ user: req.user.id }).sort({ createdAt: 'desc' });
    res.render('notes/dashboard', { notes });
}

module.exports.add = (req, res) => {
    res.render('notes/add');
}

module.exports.addProcess = async (req, res) => {
    let { title, text } = req.body;
    if (!title || !text) {
        req.flash('error_msg', 'Invalid data');
        res.redirect('/notes/add-note');
    }
    let newNote = {
        title: req.body.title,
        text: req.body.text,
        user: req.user._id
    }
    await Note.create(newNote);
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/notes');
}

module.exports.update = async (req, res) => {
    let notes = await Note.findOne({ _id: req.params.id })
    if (notes.user.toString() != req.user._id) {
        req.flash('error_msg', 'Access Denied!');
        res.redirect('/notes');
    }
    else {
        res.render('notes/update', { notes });
    }
}

module.exports.updateProcess = async (req, res) => {
    let { title, text } = req.body;
    if (!title || !text) {
        req.flash('error_msg', 'Invalid data');
        res.redirect('back');
    }
    let notes = await Note.findOne({ _id: req.params.id });
    notes.title = title;
    notes.text = text;
    await notes.save();
    req.flash('success_msg', 'Note updated Successfully');
    res.redirect('/notes');
}

module.exports.delete = async (req, res) => {
    await Note.deleteOne({ _id: req.params.id });
    req.flash('success_msg', 'Note Deleted Successfully');
    res.redirect('/notes');
}

module.exports.share = async (req, res) => {
    let notes = await Note.findOne({ _id: req.params.id })
    const msg = {
        to: req.body.email,
        from: process.env.APP_EMAIL,
        subject: 'Note Shared via MyNOTES',
        html: `<strong>Hi there!, <br><br>${req.user.name} (${req.user.email}) Shared a Note with you through MyNOTES App.<br><br>
    Title: ${notes.title}<br>Description: ${notes.text}<br><br>Regards<br>Team MyNOTES</strong>`,
    };
    await sgMail.send(msg);
    req.flash('success_msg', 'Note Shared Successfully.');
    res.redirect('/notes');
}