/**
 * backend setup for user authentication and user management
 * using Express.js.
 */
const {
    postMessage,
    getMessage,
    clearChat1Side,
    deleteMessage,
} = require("../controllers/messagesController");

const router = require("express").Router();

router.post("/postmsg/", postMessage);
router.post("/getmsg/", getMessage);

router.post("/clearmsgs/", clearChat1Side);

router.delete("/deletemsg/", deleteMessage);


module.exports = router;