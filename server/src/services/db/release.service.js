'use strict';
const { releaseModel } = require('../../models');
const { ObjectId } = require('mongodb');
const { pick, search, advancseSearch, dateSearch, statusSearch } = require('../../utils/pick');
let instance;
/*********************************************
 * METHODS FOR HANDLING RELEASE MODEL QUERIES
 *********************************************/
class Release {
	constructor() {
		//if release instance already exists then return
		if (instance) {
			return instance;
		}
		this.instance = this;
		this._model = releaseModel;
	}
	create(data) {
		let model = new this._model(data);
		return model.save(data);
	}
	getById(id) {
		return this._model.findById(id);
	}
	getAll(params = {}, user_id = null) {
		if (user_id) {
			params.user_id = user_id;
		}
		let filter = params;
		return this._model.find(filter).sort({ created_at: -1 });
	}
	getAllPaginate(params = {}, data = {}, user_id = null) {
		if (user_id) {
			params.user_id = user_id;
		}
		let filter = params;
		const options = pick(data, ['sort_by', 'limit', 'page']);
		options.sort_fields = ['amount', 'previous_value', 'new_value', 'status', 'created_at'];
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

			pipeline.push({
				$project: {
					user_id: 1,
					investment_id: 1,
					username: {
						$ifNull: ["$user.username", ""]
					},
					user: {
						$ifNull: ["$user.name", ""]
					},
					amount: 1,
					previous_value: 1,
					new_value: 1,
					original_investment_amount: 1,
					status: 1,
					description: 1,
					extra: 1,
					created_at: 1
				},
			});
			options.pipeline = pipeline;
		}

		const results = releaseModel.paginate(filter, options);
		return results;
	}
	getByQuery(query, projection = {}) {
		return this._model.find(query, projection);
	}
	updateById(id, data, option = {}) {
		option = { ...{ new: true }, ...option }
		return this._model.findByIdAndUpdate(id, { $set: data }, option);
	}
	updateByQuery(query, data, option = {}) {
		option = { ...{ new: true }, ...option }
		return this._model.updateMany(query, { $set: data }, option);
	}
	updateOneByQuery(query, data, option = {}) {
		option = { ...{ new: true }, ...option }
		return this._model.updateOne(query, { $set: data }, option);
	}
	deleteById(id) {
		return this._model.findByIdAndRemove(id);
	}
	getSum(params = {}, user_id = null) {
		if (user_id) {
			params.user_id = user_id;
		}
		return this._model.aggregate([
			{ $match: params },
			{
				$group: {
					_id: null,
					total: { $sum: "$amount" }
				}
			}
		]);
	}
	getCount(params = {}, user_id = null) {
		if (user_id) {
			params.user_id = user_id;
		}
		return this._model.countDocuments(params);
	}
}
module.exports = new Release();
