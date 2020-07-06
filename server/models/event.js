const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'User',
        index: true,
        required: 'Event user cannot be blank',
    },
	title: {
        type: String,
        trim: true,
        required: 'Event title cannot be blank',
    },
	start: {
        type: Date, 
        required: true
    },
	end: {
        type: Date, 
        required: false
    }
}, { 
    timestamps: true
});

/**
 * Statics
 */
EventSchema.statics = {
    list({ criteria = {}, page = 0, limit = 30 }) {
        return this.find(criteria)
            .populate('user')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * page)
            .exec();
    },
};
module.exports = mongoose.model('Event', EventSchema);