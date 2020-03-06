const { Schema, model } = require('mongoose');

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false, versionKey: false };
const schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
}, opts);

schema.virtual('created').get(function () {
  if (this["_created"]) return this["_created"];
  return this["_created"] = this._id.getTimestamp();
});

module.exports = model('Data', schema);