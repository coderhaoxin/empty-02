'use strict'

const ObjectId = require('mongodb').ObjectId
const Mongo = require('mongodb-next')
const assert = require('assert')

class Adaptor {
  constructor(opts) {
    assert(typeof opts === 'object', 'invalid options')
    assert(typeof opts.mongoURL === 'string', 'invalid mongodb url')

    const mongo = Mongo(opts.mongoURL)
    const connected = opts.connected || noop
    const onerror = opts.onerror || handleError

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
    return this.mongo.collection(entity).findOne(id).new().update(data)
  }

  remove(entity, id) {
    id = str2objId(id)
    return this.mongo.collection(entity).findOne(id).remove()
  }

  query(entity, opts) {
    return this.mongo.collection(entity).find(opts)
  }
}

function str2objId(str) {
  if (str instanceof ObjectId) {
    return str
  }

  return new ObjectId(str)
}

function handleError(error) {
  console.error(error)
}

function noop() {}

/**
 * exports
 */

module.exports = Adaptor
