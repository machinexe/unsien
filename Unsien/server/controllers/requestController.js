const Request = require("../model/requestModel");

module.exports.getUserRequests = async (req, res, next) => {
    try {
        const loggedInUserId = req.params.id;
        //  console.log('Logged-in user ID:', req.params.id);
        /**
         * Database Query: It uses Mongoose's User model
         * to perform a database query using the find method.
         * It searches for all users except the one specified
         * by the ID (req.params.id). The $ne operator means "not equal to".
         */
        const requests = await Request.find({ userToID: loggedInUserId, status: 'pending' }).select([
            "username",
            "title",
            "description",
        ]);

        return res.json(requests);
    } catch (ex) {
        next(ex);
    }
};

module.exports.requestHandling = async (req, res, next) => {
    try {
        // Extract form data from the request body
        const { username, userFromID, userToID, title, description } = req.body;

        // Check if there's an existing approved or pending request between the two users
        const existingRequest = await Request.findOne({
            $or: [
                { userFromID: userFromID, userToID: userToID, status: { $in: ['pending', 'approved'] } },
                { userFromID: userToID, userToID: userFromID, status: { $in: ['pending', 'approved'] } }
            ]
        });

        if (existingRequest) {
            if (existingRequest.status === 'pending') {
                return res.status(200).json({ error: 'Your previous request is pending' });
            } else if (existingRequest.status === 'approved') {
                return res.status(200).json({ error: 'You already have an existing chat with this user' });
            }
        }

        // Example: Create a new request document in the database
        const newRequest = await Request.create({
            username,
            userFromID,
            userToID,
            title,
            description,
        });

        // Optionally, you can perform additional operations or send a response
        return res.status(201).json({ message: 'Request submitted successfully', request: newRequest });

    } catch (ex) {
        next(ex);
    }
};

module.exports.requestStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log('PUT /requestStatus request body:', req.params, '-', status);

        // Find the request by its ID and update its status to "rejected"
        const updatedRequest = await Request.findOneAndUpdate(
            { _id: id },
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.json({ message: 'Request rejected', request: updatedRequest });

    } catch (ex) {
        next(ex);
    };
};