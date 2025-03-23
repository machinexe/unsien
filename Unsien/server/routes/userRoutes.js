/**
 * backend setup for user authentication and user management
 * using Express.js.
 */


const {
    requestHandling,
    getUserRequests,
    requestStatus,

} = require("../controllers/requestController");

const {
    userRoleStatue,
    getUsers,
    deleteUser,
} = require("../controllers/adminController");

const {
    register,
    login,
    getAllUsers,
    getUserContact,
    storePrekeyBundle,
    getPrekeyBundle,
    storeIdentityKeyPair,
    getIdentityKeyPair,
    storeSessionCipher,
    getSessionCipher,
}= require("../controllers/userController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get('/allUsersRoute/:id?', getAllUsers);


router.post('/store-prekey-bundles/:id?', storePrekeyBundle);
router.get('/get-prekey-bundles/:id?', getPrekeyBundle);
router.post('/store-identityKeyPair/:id?', storeIdentityKeyPair);
router.get('/get-identityKeyPair/:id?', getIdentityKeyPair);
router.post('/store-sessionCipher/:id?', storeSessionCipher);
router.get('/get-sessionCipher/:id?', getSessionCipher);

router.post("/contact", requestHandling);
router.get("/getUserRequests/:id?", getUserRequests);
router.put("/requestStatus/:id", requestStatus);
router.get("/getUserContact/:id", getUserContact);

router.get('/allUsers/:id?', getUsers);
router.put("/userRoleStatue/:id", userRoleStatue);
router.put("/deleteUser/:id", deleteUser);

module.exports = router;