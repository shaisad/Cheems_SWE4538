const mongoose = require("mongoose");

const ResetTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    token: {
		type: String,
		required: true,
	},
    createdAt: {
		type: Date,
		default: Date.now,
		expires: 1 * 86400, // 30 days
	},
});

const ResetToken = mongoose.model("ResetToken", ResetTokenSchema);
module.exports = ResetToken