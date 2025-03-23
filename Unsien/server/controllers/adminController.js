const User = require("../model/userModel");

module.exports.getUsers = async (req, res, next) => {
    try {

        // Fetch the logged-in user's information
        const loggedInUser = await User.findById(req.params.id);

        // Check if the logged-in user is an admin
        if (loggedInUser.role === 'admin') {
            // Check the requested action
            if (req.query.action === 'fetchPendingUsers') {
                // Fetch all users with role: null
                const users = await User.find({ role: { $in: ['null'] } }).select(['email', 'username', '_id']);
                return res.json(users);
            } else if (req.query.action === 'fetchActiveUsers') {
                // Fetch all active users (except the logged-in user)
                const users = await User.find({ _id: { $ne: loggedInUser._id }, role: { $in: ['active'] } }).select([
                    'email',
                    'username',
                    '_id',
                ]);
                return res.json(users);
            } else {
                // Return an error response for unknown action
                return res.status(400).json({ error: 'Invalid action' });
            }
        } else {
            // Return an error response for non-admin users
            return res.status(403).json({ error: 'Forbidden' });
        }
        
    } catch (ex) {
        next(ex);
    }
}

module.exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Use the deleteOne() method to delete the user document
        const result = await User.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};


module.exports.userRoleStatue = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'approve' or 'reject'

        if (action === 'approve') {
            // Approve the user
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { role: 'active' },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ user: updatedUser });
        } else if (action === 'reject') {
            // Reject the user
            const deletedUser = await User.findByIdAndDelete(id);

            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Send an email to the rejected user
            // await sendEmail(deletedUser.email, 'User Rejected', 'Your request has been rejected.');

            res.json({ message: 'User deleted' });
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (ex) {
        next(ex);
    }
};