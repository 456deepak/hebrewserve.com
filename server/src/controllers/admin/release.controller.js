'use strict';
const logger = require('../../services/logger');
const log = new logger('AdminReleaseController').getChildLogger();
const { releaseDbHandler } = require('../../services/db');
const responseHelper = require('../../utils/customResponse');

module.exports = {
    // Get all releases with pagination
    getAll: async (req, res) => {
        let reqObj = req.query;
        log.info('Received request for getAll releases:', reqObj);
        let responseData = {};
        try {
            let getList = await releaseDbHandler.getAllPaginate(reqObj);
            responseData.msg = 'Data fetched successfully!';
            responseData.data = getList;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('Failed to fetch release data with error:', error);
            responseData.msg = 'Failed to fetch release data';
            return responseHelper.error(res, responseData);
        }
    },

    // Get a single release by ID
    getOne: async (req, res) => {
        let responseData = {};
        let id = req.params.id;
        try {
            let getData = await releaseDbHandler.getById(id);
            responseData.msg = "Release data fetched successfully!";
            responseData.data = getData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('Failed to fetch release data with error:', error);
            responseData.msg = 'Failed to fetch release data';
            return responseHelper.error(res, responseData);
        }
    },

    // Get release summary
    getSum: async (req, res) => {
        let responseData = {};
        let reqObj = req.query;
        try {
            let getData = await releaseDbHandler.getSum(reqObj);
            responseData.msg = "Release summary fetched successfully!";
            responseData.data = getData;
            return responseHelper.success(res, responseData);
        } catch (error) {
            log.error('Failed to fetch release summary with error:', error);
            responseData.msg = 'Failed to fetch release summary';
            return responseHelper.error(res, responseData);
        }
    }
};
