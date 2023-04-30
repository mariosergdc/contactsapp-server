const router = require('express').Router();
const Contact = require('../models/contactModel');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { imgFile, firstName, lastName, phone, email, street, city, state } =
      req.body;
    const userId = req.user;
    const newContact = new Contact({
      imgFile,
      userId,
      firstName,
      lastName,
      phone,
      email,
      street,
      city,
      state,
    });

    const savedContact = await newContact.save();
    res.status(200).json(savedContact);
  } catch (err) {
    res.status(500).send();
  }
});

router.get('/', auth, async (req, res) => {
  const userId = req.user;
  try {
    const contacts = await Contact.find({ userId });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).send();
  }
});

router.post('/getcontactbyid', auth, async (req, res) => {
  const { contactid } = req.body;
  try {
    const contact = await Contact.findOne({ _id: contactid });
    res.status(200).json(contact);
  } catch (err) {
    res.status(500).send();
  }
});

router.post('/edit', auth, async (req, res) => {
  const _id = req.body._id;

  Contact.findOneAndUpdate(
    { _id },
    {
      imgFile: req.body.imgFile,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
    },
    (err, docs) => {
      if (!err) {
        res.status(200).send(docs);
      } else {
        res.status(500).send(err);
      }
    }
  );
});

router.post('/delete', auth, async (req, res) => {
  const { contactid } = req.body;

  try {
    const result = await Contact.findOneAndDelete({
      _id: contactid,
    });
    res.json(result);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
