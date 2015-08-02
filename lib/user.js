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
    this.entity = opts.entity || 'user'

    mongo.connect.then(connected).catch(onerror)
  }

  /**
   * @param {Array} uids
   * @param {Object} data
   */
  exist(uids, data) {
    return this
      .findUser(uids, data)
      .then(function(user) {
        return !!(user && user._id)
      })
  }

  signup(user) {
    return this.mongo.collection(this.entity).insert(user)
  }

  update(id, data) {
    id = str2objId(id)
    return this.mongo.collection(this.entity).findOne(id).new().update({
      $set: data
    })
  }

  findUser(uids, data) {
    let collection = this.mongo.collection(this.entity)

    uids = uids.filter(function(uid) {
      return data.hasOwnProperty(uid)
    })

    return Promise.race(uids.map(function(uid) {
      return collection.findOne(uid, data[uid])
    }))
  }

  findById(id) {
    id = str2objId(id)
    return this.mongo.collection(this.entity).findOne(id)
  }
}

/**
 * exports
 */

module.exports = Adaptor
