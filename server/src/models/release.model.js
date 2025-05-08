'use strict';
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { toJSON, paginate } = require('./plugins');

/**
 * Creating Release Schema Model for tracking investment releases
 */
const releaseSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    investment_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Investments'
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    previous_value: {
        type: Number,
        required: true
    },
    new_value: {
        type: Number,
        required: true
    },
    original_investment_amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    description: {
        type: String,
        default: 'Investment funds released to wallet'
    },
    extra: {
        type: Object,
        default: {}
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// add plugin that converts mongoose to json
releaseSchema.plugin(toJSON);
releaseSchema.plugin(paginate);

module.exports = mongoose.model('Releases', releaseSchema);
