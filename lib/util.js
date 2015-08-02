'use strict'

const ObjectId = require('mongodb').ObjectId

/**
 * exports
 */

module.exports = {
  handleError,
  str2objId,
  noop
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
