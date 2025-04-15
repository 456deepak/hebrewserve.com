'use strict';
const logger = require('../../services/logger');
const log = new logger('AdminInveatmentController').getChildLogger();
const { investmentDbHandler } = require('../../services/db');
const responseHelper = require('../../utils/customResponse');
const config = require('../../config/config');

module.exports = {

    getAll: async (req, res) => {
        let reqObj = req.query;
        log.info('Recieved request for getAll:', reqObj);
        let responseData = {};
        try {
            reqObj.type = 0;
            let getList = await investmentDbHandler.getAll(reqObj);
            responseData.msg = 'Data fetched successfully!';
            responseData.data = getList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },
    getAllStacked: async (req, res) => {
        let reqObj = req.query;
        log.info('Recieved request for getAll:', reqObj);
        let responseData = {};
        try {
            reqObj.type = 1;
            let getList = await investmentDbHandler.getAll(reqObj);
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
            let getData = await investmentDbHandler.getById(id);
            responseData.msg = "Data fetched successfully!";
            responseData.data = getData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('failed to fetch data with error::', error);
            responseData.msg = 'Failed to fetch data';
            return responseHelper.error(res, responseData);
        }
    },

    getCount: async (req, res) => {
        let responseData = {};
        let reqObj = req.query;
        try {
            let getData = await investmentDbHandler.getCount(reqObj);
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
            let getData = await investmentDbHandler.getSum(reqObj);
            console.log(getData);
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