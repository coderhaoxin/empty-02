'use strict'

const Mongo = require('mongodb-next')
const assert = require('assert')
const util = require('./util')

const str2objId = util.str2objId

class Adaptor {
  constructor(opts) {
    assert(typeof opts === 'object', 'invalid options')
    assert(typeof opts.mongoURL === 'string', 'invalid mongodb url')

    const mongo = Mongo(opts.mongoURL)
    const connected = opts.connected || util.noop
    const onerror = opts.onerror || util.handleError

    this.mongo = mongo

    mongo.connect.then(connected).catch(onerror)
  }

  /**
   * @param {String} entity
   * @param {String} id
   */
  findOne(entity, id) {
    id = str2objId(id)
    return this.mongo.collection(entity).findOne(id)
  }

  create(entity, data) {
    return this.mongo.collection(entity).insert(data)
  }

  update(entity, id, data) {
    id = str2objId(id)
    return this.mongo.collection(entity).findOne(id).new().update({
      $set: data
    })
  }

  remove(entity, id) {
    id = str2objId(id)
    return this.mongo.collection(entity).findOne(id).remove()
  }

  query(entity, opts) {
    return this.mongo.collection(entity).find(opts)
  }
}

/**
 * exports
 */

exports = module.exports = Adaptor
exports.User = require('./user')
