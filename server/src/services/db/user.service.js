'use strict';
const { userModel } = require('../../models');
const { ObjectId } = require('mongodb');
const { pick, search, advancseSearch, dateSearch, statusSearch } = require('../../utils/pick');
const { LRUCache } = require('lru-cache');
const cacheConfig = require('../../config/caching').lruCache;

let instance;

// Initialize LRU cache for user data
const userCache = new LRUCache(cacheConfig.user || cacheConfig.default);

/*********************************************
 * METHODS FOR HANDLING USER MODEL QUERIES
 *********************************************/
class User {
    constructor() {
        //if user instance already exists then return
        if (instance) {
            return instance;
        }
        this.instance = this;
        this._model = userModel;
    }

    // Generate cache key based on method and parameters
    _generateCacheKey(method, params) {
        return `user_${method}_${JSON.stringify(params)}`;
    }

    create(data) {
        let model = new this._model(data);
        // Clear cache when new user is created
        userCache.clear();
        return model.save(data);
    }

    async getAll(data, user_id = null) {
        // Generate cache key
        const cacheKey = this._generateCacheKey('getAll', { data, user_id });
        
        // Check if data exists in cache
        const cachedData = userCache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        let params = {};

        if (user_id) {
            params.refer_id = ObjectId(user_id);
        }

        if (data.search) {
            params = {
                $and: [
                    { ...statusSearch(data, ['status']), ...dateSearch(data, 'created_at'), ...params },
                    search(data.search, ['username', 'email', 'name'])
                ]
            };
        }
        else {
            params = {
                ...advancseSearch(data, ['username', 'email', 'name']),
                ...dateSearch(data, 'created_at'),
                ...statusSearch(data, ['status']),
                ...params
            };
        }

        let filter = params;
        const options = pick(data, ['sort_by', 'limit', 'page']);
        options.sort_fields = ['email', 'name', 'created_at'];
        options.populate = '';
        const pipeline = [];

        pipeline.push({
            $project: {
                refer_id: 1,
                placement_id: 1,
                position: 1,
                trace_id: 1,
                level: 1,
                username: 1,
                email: 1,
                name: 1,
                address: 1,
                phone_number: 1,
                avatar: 1,
                email_verified: 1,
                reward: 1,
                wallet: 1,
                wallet_topup: 1,
                topup: 1,
                topup_at: 1,
                is_default: 1,
                extra: 1,
                status: 1,
                created_at: 1,
                country_code: 1,
                country: 1,
                state: 1,
                wallet_address: 1,
                city: 1,
                total_investment: 1,
            },
        });
        options.pipeline = pipeline;
        if (options.limit == -1) {
            options.populate = 'name,email,status';
        }

        const results = await userModel.paginate(filter, options);
        
        // Store results in cache
        userCache.set(cacheKey, results);
        
        return results;
    }

    getCount(refer_id, status = null) {
        const cacheKey = this._generateCacheKey('getCount', { refer_id, status });
        
        // Check cache
        const cachedCount = userCache.get(cacheKey);
        if (cachedCount !== undefined) {
            return Promise.resolve(cachedCount);
        }

        let q = {};
        if (refer_id) {
            q.refer_id = refer_id;
        }
        if (status !== null) {
            q.status = status;
        }
        
        return this._model.countDocuments(q).exec()
            .then(count => {
                userCache.set(cacheKey, count);
                return count;
            });
    }

    async getById(id, projection = {}) {
        const cacheKey = this._generateCacheKey('getById', { id, projection });
        
        const cachedItem = userCache.get(cacheKey);
        if (cachedItem) {
            return cachedItem;
        }
        
        const result = await this._model.findOne({ _id: id }, projection);
        if (result) {
            userCache.set(cacheKey, result);
        }
        return result;
    }

    async getOneByQuery(query, projection = {}) {
        const cacheKey = this._generateCacheKey('getOneByQuery', { query, projection });
        
        const cachedItem = userCache.get(cacheKey);
        if (cachedItem) {
            return cachedItem;
        }
        
        const result = await this._model.findOne(query, projection);
        if (result) {
            userCache.set(cacheKey, result);
        }
        return result;
    }

    async getByQuery(query, projection = {}) {
        const cacheKey = this._generateCacheKey('getByQuery', { query, projection });
        
        const cachedItems = userCache.get(cacheKey);
        if (cachedItems) {
            return cachedItems;
        }
        
        const results = await this._model.find(query, projection);
        userCache.set(cacheKey, results);
        return results;
    }

    async getByQueryToArray(query, projection = {}) {
        const cacheKey = this._generateCacheKey('getByQueryToArray', { query, projection });
        
        const cachedItems = userCache.get(cacheKey);
        if (cachedItems) {
            return cachedItems;
        }
        
        const results = await this._model.find(query, projection).lean();
        userCache.set(cacheKey, results);
        return results;
    }

    updateById(id, data, option = {}) {
        option = { ...{ new: true }, ...option };
        // Clear cache when user is updated
        userCache.clear();
        return this._model.findByIdAndUpdate(id, { $set: data }, option);
    }

    updateOneByQuery(query, data, option = {}) {
        option = { ...option, ...{ upsert: true, new: true } };
        // Clear cache when user is updated
        userCache.clear();
        return this._model.updateOne(query, data, option);
    }

    updateByQuery(query, data, option = {}) {
        option = { ...{ new: true }, ...option };
        // Clear cache when users are updated
        userCache.clear();
        return this._model.updateMany(query, { $set: data }, option);
    }

    deleteById(id) {
        // Clear cache when user is deleted
        userCache.clear();
        return this._model.findByIdAndRemove(id);
    }
}
module.exports = new User();
