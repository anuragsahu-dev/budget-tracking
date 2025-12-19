"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentConfig = void 0;
const config_1 = require("./config");
exports.paymentConfig = {
    razorpay: {
        keyId: config_1.config.razorpay.keyId,
        keySecret: config_1.config.razorpay.keySecret,
        webhookSecret: config_1.config.razorpay.webhookSecret,
    },
};
