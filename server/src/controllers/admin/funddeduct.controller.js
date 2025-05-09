'use strict';
const logger = require('../../services/logger');
const log = new logger('AdminFundDeductController').getChildLogger();
const { fundDeductDbHandler, userDbHandler } = require('../../services/db');
const responseHelper = require('../../utils/customResponse');
const config = require('../../config/config');
const { default: mongoose } = require('mongoose');

module.exports = {

    getAll: async (req, res) => {
        let reqObj = req.query;
        log.info('Recieved request for getAll:', reqObj);
        let responseData = {};
        try {
            let getList = await fundDeductDbHandler.getAll(reqObj);
            responseData.msg = 'Data fetched successfully!';
            responseData.data = getList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    getOne: async (req, res) => {
        let responseData = {};
        let id = req.params.id;
        try {
            let getData = await fundDeductDbHandler.getById(id);
            responseData.msg = "Data fetched successfully!";
            responseData.data = getData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    add: async (req, res) => {
        let responseData = {};
        let reqObj = req.body;
        let ObjectId = mongoose.Types.ObjectId
        try {

            const user = await userDbHandler.getOneByQuery({ _id: ObjectId(reqObj.user_id) })
            if (!user) {
                responseData.msg = "Invalid User !!!";
                return responseHelper.error(res, responseData);
            }

            let fee = reqObj.amount * 0;

            let data = {
                user_id: reqObj.user_id,
                amount: reqObj.amount,
                fee: fee,
                remark: reqObj.remark,
                type: reqObj.type,
            }

            if (reqObj.type == 'tasksIncome') {
                if (!user.extra || !user.extra.tasksIncome || user.extra.tasksIncome < reqObj.amount) {
                    responseData.msg = "Insufficient Fund in Tasks Income!";
                    return responseHelper.error(res, responseData);
                    }
                user.extra.tasksIncome = parseFloat(user.extra.tasksIncome) - parseFloat(reqObj.amount);
            }
            else if (reqObj.type == 'levelIncome') {
                if (!user.extra || !user.extra.levelIncome || user.extra.levelIncome < reqObj.amount) {
                    responseData.msg = "Insufficient Fund in Level Income!";
                    return responseHelper.error(res, responseData);
                }
                user.extra.levelIncome = parseFloat(user.extra.levelIncome) - parseFloat(reqObj.amount);
            }
            else if (reqObj.type == 'main_wallet') {
                if (user.wallet < reqObj.amount) {
                    responseData.msg = "Insufficient Fund in Main Wallet!";
                    return responseHelper.error(res, responseData);
                }
                user.wallet = parseFloat(user.wallet) - parseFloat(reqObj.amount);
            }
            else if (reqObj.type == 'topup_wallet') {
                if (user.wallet_topup < reqObj.amount) {
                    responseData.msg = "Insufficient Fund in Topup Wallet!";
                    return responseHelper.error(res, responseData);
                }
                user.wallet_topup = parseFloat(user.wallet_topup) - parseFloat(reqObj.amount);
            }
            else if (reqObj.type == 'token_wallet') {
                if (user.wallet_token < reqObj.amount) {
                    responseData.msg = "Insufficient Fund in Token Wallet!";
                    return responseHelper.error(res, responseData);
                }
                user.wallet_token = parseFloat(user.wallet_token) - parseFloat(reqObj.amount);
            }
            else {
                responseData.msg = "Invalid wallet type!";
                return responseHelper.error(res, responseData);
            }

            await user.save();
              
            await fundDeductDbHandler.create(data);
            responseData.msg = "Fund deducted successfully!";
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to update data with error::', error);
            responseData.msg = "Failed to deduct fund";
            return responseHelper.error(res, responseData);
        }
    },

    getCount: async (req, res) => {
        let responseData = {};
        let reqObj = req.query;
        try {
            let getData = await fundDeductDbHandler.getCount(reqObj);
            responseData.msg = "Data fetched successfully!";
            responseData.data = getData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    getSum: async (req, res) => {
        let responseData = {};
        let reqObj = req.query;
        try {
            let getData = await fundDeductDbHandler.getSum(reqObj);
            responseData.msg = "Data fetched successfully!";
            responseData.data = getData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
};