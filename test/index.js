'use strict'

const assert = require('assert')
const Adaptor = require('../')

describe('## koao-mongo', function() {
  describe('# basic', function() {
    let collection = 'testkoao'
    let adaptor
    let id

    it('init', function() {
      return new Promise(function(resolve, reject) {
        adaptor = new Adaptor({
          mongoURL: 'mongodb://localhost/test',
          connected: resolve,
          onerror: reject
        })
      })
    })

    it('create', function() {
      return adaptor
        .create(collection, {
          name: 'haoxin',
          desc: 'hello'
        })
        .then(function(result) {
          assert.equal(result.name, 'haoxin')
          id = result._id
        })
    })

    it('update', function() {
      return adaptor
        .update(collection, id, {
          desc: 'world'
        })
        .then(function(result) {
          assert.equal(result.desc, 'world')
        })
    })

    it('findOne', function() {
      return adaptor
        .findOne(collection, id)
        .then(function(result) {
          assert.equal(result.desc, 'world')
        })
    })

    it('query', function() {
      return adaptor
        .query(collection, {
          desc: 'world'
        })
        .then(function(result) {
          assert(result.length > 0)
        })
    })

    it('remove', function() {
      return adaptor
        .remove(collection, id)
        .then(function(result) {
          assert.equal(String(result._id), id)
        })
    })

    it('findOne', function() {
      return adaptor
        .findOne(collection, id)
        .then(function(result) {
          assert.equal(result, null)
        })
    })
  })
})
