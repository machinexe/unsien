/**
 * This refers to the Mongoose model for the users collection in your MongoDB database.
 *  It allows you to interact with the users collection.
 */
const User = require("../model/userModel");
const Request = require("../model/requestModel");
const PreKey = require("../model/preKeyBundleModel");
const Key = require("../model/identityKeyPairModel");
const Session = require("../model/sessionCipherModel");

const brcypt = require("bcrypt")

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.json({ msg: "Username already used", status: false })
        }

        const emailCheck = await User.findOne({ email })
        if (emailCheck) {
            return res.json({ msg: "Email already used", status: false })
        }

        const hashedPassword = await brcypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
            role: 'null',
        });
        delete user.password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    };
};

module.exports.login = async (req, res, next) => {
    try {

        /**
         * req.body typically contains the data that
         * the user submits through a form on the frontend.
         */
        const {email, password } = req.body; // Fetch information from database

        /**
         * findOne:
         * This is a Mongoose method used to find a single document
         * in the database that matches the specified criteria.
         */
        const user = await User.findOne({ email })
        // Check if the user exist
        if (!user) {
            return res.json({ msg: "Incorrect email or password", status: false })
        };

        /**
         * bcrypt.compare(): This is a method provided by the bcrypt library,
         * which is commonly used for hashing passwords in Node.js applications.
         * It compares the password provided by the user (password) with the hashed password
         * retrieved from the database (user.password).
         * password: This is the password provided by the user during the login attempt.
         * user.password: This is the hashed password stored in the database for the user whose username matches the one provided during the login attempt. 
         * isPasswordValid: This variable stores the result of the comparison. If the password provided by the user matches the hashed password stored in the database, isPasswordValid will be true; otherwise, it will be false.
         */
        const isPasswordValid = await brcypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.json({ msg: "Incorrect email or password", status: false })
        };

        delete user.password; // deleting the user object

        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};


  /**
     * Database Query: It uses Mongoose's User model
     * to perform a database query using the find method.
     * It searches for all users except the one specified
     * by the ID (req.params.id). The $ne operator means "not equal to".
     */
module.exports.getAllUsers = async (req, res, next) => {
    try {
        const loggedInUser = await User.findById(req.params.id);

        // // Check if the logged-in user is an admin
        // if (loggedInUser.role === 'admin') {
        //     // Fetch all users with role: null
        //     const users = await User.find({ role: { $in: 'null' } }).select(['email', 'username', '_id']);
        //     return res.json(users);
        //  else {
            // Fetch all active users (except the logged-in user)
            const users = await User.find({ _id: { $ne: loggedInUser._id }, role: { $in: 'active' } }).select([
                'email',
                'username',
                '_id',
            ]);

            // 1. Find all approved requests sent by the logged-in user
            const sentRequests = await Request.find({
                $or: [
                    { userFromID: loggedInUser._id, status: 'approved' },
                    { userToID: loggedInUser._id, status: 'approved' },
                ],
            })
                .select(['userFromID', 'userToID']);

            const uniqueUsers = Array.from(new Set([
                ...sentRequests.map(request => request.userFromID),
                ...sentRequests.map(request => request.userToID),
            ])).filter(userId => userId !== loggedInUser._id);

            const openchatUsers = await User.find({
                _id: { $in: uniqueUsers, $ne: loggedInUser._id },
            })
                .select(['email', 'username', '_id']);
            
            return res.json({ users, openchatUsers });
        // }
    } catch (ex) {
        next(ex);
    }
};

module.exports.getUserContact = async (req, res, next) => {
    try {

        // ------ user accepted request ----- //
        // get the current user logged id
        const loggedInUserId = req.params.id;

        // ---- ----- TO: TAKES APPROVED REQUESTS (TAKE THEIR SENDER ID AND ADD THEM TO CHAT)------
        // Fetch approved requests and extract the userFromID values
        const requestToID = await Request.find({
            userToID: loggedInUserId,
            status: 'approved',
        }).select('userFromID');

        const requestFromID = await Request.find({
            userFromID: loggedInUserId,
            status: 'approved',
        }).select('userToID');   

        // Extract the userFromID values from the approved requests
        const userFromIDs = requestToID.map(request => request.userFromID);3
        const userToIDs = requestFromID.map(request => request.userToID);

        const userIDs = [...new Set([...userFromIDs, ...userToIDs])];;

        // Find the users with IDs matching the userIDs
        const usersInChat = await User.find({
            _id: { $in: userIDs },
        }).select(["email", "username", "_id"]);

        return res.json(usersInChat);

    } catch (ex) {
        next(ex);
    };
};


module.exports.storePrekeyBundle = async (req, res, next) => {
    try {
        console.log("Storing...");
        const { userId, preKeyBundle } = req.body;
        console.log("User ID:", userId, " Bundle:", preKeyBundle);

        // Check if a storage bundle already exists for the given userId
        const existingPreKeyBundle = await PreKey.findOne({ userId });

        if (existingPreKeyBundle) {
            // Update the existing storage bundle
            // existingPreKeyBundle.preKeyBundle.preKey.publicKey = preKeyBundle.preKey.publicKey;
            // existingPreKeyBundle.preKeyBundle.signedPreKey.publicKey = preKeyBundle.signedPreKey.publicKey;
            // existingPreKeyBundle.preKeyBundle.signedPreKey.signature = preKeyBundle.signedPreKey.signature;
            // await existingPreKeyBundle.save();
            return res.json(existingPreKeyBundle);
        } else {
            // Create a new storage bundle
            const registerNewPreKeyBundle = await PreKey.create({
                userId,
                preKeyBundle,
            });

            return res.json(registerNewPreKeyBundle);
        }
    } catch (ex) {
        next(ex);
    }
};

module.exports.getPrekeyBundle = async (req, res, next) => {
    try {

        console.log("Fecthing...");

        const { userId } = req.query;

        // Example: Fetch the prekey bundle from the database based on the userId
        const preKeyBundle = await PreKey.findOne({ userId });

        if (!preKeyBundle) {
            console.error('Prekey bundle not found for userId:', userId);
            return res.status(404).json({ error: 'Prekey bundle not found' });
        }
        return res.json(preKeyBundle);
    } catch (ex) {
        console.error('Error fetching prekey bundle:', ex);
        next(ex);
    }
};


module.exports.storeIdentityKeyPair = async (req, res, next) => {
    try {
        console.log("Storing Identity Key Pair...");
        const { userId, identityKey, registrationId } = req.body;
        console.log("identityKey: ", identityKey, " registrationId: ", registrationId);

        // Check if a storage bundle already exists for the given userId
        const existingIdentityKeyPair = await Key.findOne({ userId });

        if (existingIdentityKeyPair) {
            // Update the existing storage bundle
            return res.json(existingIdentityKeyPair);
        } else {
            // Create a new storage bundle
            const registerNewIdentityKeyPair = await Key.create({
                userId,
                identityKey: {
                    pubKey: (identityKey.pubKey),
                    privKey:(identityKey.privKey)
                },
                registrationId,
            });

            return res.json(registerNewIdentityKeyPair);
        }
    } catch (ex) {
        next(ex);
    }
};

module.exports.getIdentityKeyPair = async (req, res, next) => {
    try {
        console.log("Fetching Identity Key Pair...");

        const { userId } = req.query;

        // Example: Fetch the prekey bundle from the database based on the userId
        const identityKeyPair = await Key.findOne({ userId });

        if (!identityKeyPair) {
            return res.json({ data: null });
        }

        return res.json({ data: identityKeyPair});
    } catch (ex) {
        console.error('Error fetching prekey bundle:', ex);
        return res.status(500).json({ data: null, error: ex.message });
    }
};


module.exports.storeSessionCipher = async (req, res, next) => {
    try {
        console.log("Storing Session Cipher...");
        const { identifier, cipher } = req.body;
        console.log("identifier: ", identifier, " cipher: ", cipher);

        // Check if a storage bundle already exists for the given userId
        const existingSessionCipher = await Session.findOne({ identifier });

        if (existingSessionCipher) {
            // Update the existing storage bundle
            return res.json(existingSessionCipher);
        } else {
            // Create a new storage bundle
            const registerNewSessionCipher = await Session.create({
                identifier,
                cipher,
            });

            return res.json(registerNewSessionCipher);
        }
    } catch (ex) {
        next(ex);
    }
};

module.exports.getSessionCipher = async (req, res, next) => {
    try {
        console.log("Fetching Session Cipher...");

        const { identifier } = req.query;

        // Example: Fetch the prekey bundle from the database based on the userId
        const sessionCipher = await Key.findOne({ identifier });

        if (!sessionCipher) {
            return res.json({ data: null });
        }

        return res.json({ data: sessionCipher });
    } catch (ex) {
        console.error('Error fetching prekey bundle:', ex);
        return res.status(500).json({ data: null, error: ex.message });
    }
};
