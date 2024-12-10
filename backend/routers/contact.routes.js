const express = require('express');
const router = express.Router();

const contactUs=require("../routers/contact.routes");

router.post("/contact", contactUs);

module.exports = router;