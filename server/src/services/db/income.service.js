'use strict';
const { incomeModel } = require('../../models');
const { ObjectId } = require('mongodb');
const { pick, search, advancseSearch, dateSearch, statusSearch } = require('../../utils/pick');
const { LRUCache } = require('lru-cache');
const cacheConfig = require('../../config/caching').lruCache;

let instance;

// Initialize LRU cache for income data
const incomeCache = new LRUCache(cacheConfig.income || cacheConfig.default);

/*********************************************
 * METHODS FOR HANDLING INCOME MODEL QUERIES
 *********************************************/
class Income {
	constructor() {
		//if income instance already exists then return
		if (instance) {
			return instance;
		}
		this.instance = this;
		this._model = incomeModel;
	}

	// Generate cache key based on query parameters
	_generateCacheKey(method, params) {
		return `income_${method}_${JSON.stringify(params)}`;
	}

	create(data) {
		let model = new this._model(data);
		// Clear cache when new data is created
		incomeCache.clear();
		return model.save(data);
	}
	async getAll(data, user_id = null) {
		// Generate cache key
		const cacheKey = this._generateCacheKey('getAll', { data, user_id });
		
		// Check if data exists in cache
		const cachedData = incomeCache.get(cacheKey);
		if (cachedData) {
			return cachedData;
		}

		let params = {};
		if (user_id) {
			params.user_id = ObjectId(user_id);
		}
		if (data.type !== undefined) {
			// Handle both numeric and string types
			if (!isNaN(parseInt(data.type))) {
				params.type = parseInt(data.type);
			} else {
				params.type = data.type;
			}
		}

		if (data.search) {
			params = {
				$and: [
					{ ...statusSearch(data, ['status']), ...params },
					search(data.search, [])
				]
			};
		}
		else {
			params = {
				...advancseSearch(data, ['amount', 'wamt', 'uamt', 'camt', 'iamount', 'level', 'pool', 'days']),
				...dateSearch(data, 'created_at'),
				...statusSearch(data, ['status']),
				...params
			};
		}

		let filter = params;
		const options = pick(data, ['sort_by', 'limit', 'page']);
		options.sort_fields = ['amount', 'wamt', 'uamt', 'camt', 'iamount', 'level', 'pool', 'days', 'created_at'];
		options.populate = '';
		if (!user_id) {
			const pipeline = [];
			pipeline.push(
				{
					$addFields: {
						user_id: {
							$convert: {
								input: "$user_id",
								to: "objectId",
								onError: 0,
								onNull: 0
							}
						}
					}
				},
				{
					$lookup: {
						from: "users",
						localField: "user_id",
						foreignField: "_id",
						as: "user"
					}
				},
				{ $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
			);

			pipeline.push(
				{
					$addFields: {
						user_id_from: {
							$convert: {
								input: "$user_id_from",
								to: "objectId",
								onError: 0,
								onNull: 0
							}
						}
					}
				},
				{
					$lookup: {
						from: "users",
						localField: "user_id_from",
						foreignField: "_id",
						as: "user_from"
					}
				},
				{ $unwind: { path: "$user_from", preserveNullAndEmptyArrays: true } }
			);

			pipeline.push({
				$project: {
					user_id: 1,
					user_id_from: 1,
					investment_id: 1,
					investment_plan_id: 1,
					username: {
						$ifNull: ["$user.username", ""]
					},
					user: {
						$ifNull: ["$user.name", ""]
					},
					username_from: {
						$ifNull: ["$user_from.username", ""]
					},
					user_from: {
						$ifNull: ["$user_from.name", ""]
					},
					amount: 1,
					wamt: 1,
					uamt: 1,
					camt: 1,
					iamount: 1,
					level: 1,
					pool: 1,
					days: 1,
					type: 1,
					extra: 1,
					created_at: 1
				},
			});
			options.pipeline = pipeline;
		}

		const results = await incomeModel.paginate(filter, options);
		
		// Store results in cache
		incomeCache.set(cacheKey, results);
		
		return results;
	}
	getCount(data, user_id = null) {
		const cacheKey = this._generateCacheKey('getCount', { data, user_id });
		
		// Check cache
		const cachedCount = incomeCache.get(cacheKey);
		if (cachedCount !== undefined) {
			return Promise.resolve(cachedCount);
		}

		let params = { };
		if (user_id) {
			params.user_id = user_id;
		}
		if (data.status !== undefined) {
			params.status = data.status ? true : false;
		}
		if (data.type !== undefined) {
			params.type = data.type ? data.type : 0;
		}
		
		return this._model.countDocuments(params).exec()
			.then(count => {
				incomeCache.set(cacheKey, count);
				return count;
			});
	}
	async getSum(data, user_id = null) {
		const cacheKey = this._generateCacheKey('getSum', { data, user_id });
		
		// Check cache
		const cachedSum = incomeCache.get(cacheKey);
		if (cachedSum) {
			return cachedSum;
		}

		let params = { type: data.type };
		if (user_id) {
			params.user_id = ObjectId(user_id);
		}
		if (data.status !== undefined) {
			params.status = data.status ? true : false;
		}
		if (data.type !== undefined) {
			params.type = data.type ? data.type : 0;
		}

		let pipeline = [];
		pipeline.push({ $match: params });
		pipeline.push({
			$project: {
				_id: 1,
				amount: 1
			}
		});
		pipeline.push({
			$group: {
				_id: null,
				amount: { $sum: "$amount" },
				count: { $sum: 1 }
			}
		});
		
		const result = await incomeModel.aggregate(pipeline).exec();
		incomeCache.set(cacheKey, result);
		return result;
	}
	// Methods that modify data should clear cache
	updateById(id, data, option = {}) {
		option = { ...{ new: true }, ...option };
		// Clear cache when data is updated
		incomeCache.clear();
		return this._model.findByIdAndUpdate(id, { $set: data }, option);
	}
	updateByQuery(query, data, option = {}) {
		option = { ...{ new: true }, ...option };
		// Clear cache when data is updated
		incomeCache.clear();
		return this._model.updateMany(query, { $set: data }, option);
	}
	deleteById(id) {
		// Clear cache when data is deleted
		incomeCache.clear();
		return this._model.findByIdAndRemove(id);
	}
	// Add cache for read-only methods
	async getById(id, projection = {}) {
		const cacheKey = this._generateCacheKey('getById', { id, projection });
		
		const cachedItem = incomeCache.get(cacheKey);
		if (cachedItem) {
			return cachedItem;
		}
		
		const result = await this._model.findOne({ _id: id }, projection);
		if (result) {
			incomeCache.set(cacheKey, result);
		}
		return result;
	}

	async getOneByQuery(query, projection = {}) {
		const cacheKey = this._generateCacheKey('getOneByQuery', { query, projection });
		
		const cachedItem = incomeCache.get(cacheKey);
		if (cachedItem) {
			return cachedItem;
		}
		
		const result = await this._model.findOne(query, projection);
		if (result) {
			incomeCache.set(cacheKey, result);
		}
		return result;
	}

	async getByQuery(query, projection = {}) {
		const cacheKey = this._generateCacheKey('getByQuery', { query, projection });
		
		const cachedItems = incomeCache.get(cacheKey);
		if (cachedItems) {
			return cachedItems;
		}
		
		const results = await this._model.find(query, projection);
		incomeCache.set(cacheKey, results);
		return results;
	}

	async getByQueryToArray(query, projection = {}) {
		const cacheKey = this._generateCacheKey('getByQueryToArray', { query, projection });
		
		const cachedItems = incomeCache.get(cacheKey);
		if (cachedItems) {
			return cachedItems;
		}
		
		const results = await this._model.find(query, projection).lean();
		incomeCache.set(cacheKey, results);
		return results;
	}
}
module.exports = new Income();
