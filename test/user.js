'use strict'

const Adaptor = require('../').User
const assert = require('assert')

describe('## koao-mongo - user', function() {
  describe('# basic', function() {
    let username = Date.now() + '-' + Math.random()
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

    it('not exist', function() {
      return adaptor
        .exist(['username'], {
          username: username
        })
        .then(function(result) {
          assert.equal(result, false)
        })
    })

    it('signup', function() {
      return adaptor
        .signup({
          username: username,
          password: '123456'
        })
        .then(function(result) {
          assert.equal(result.username, username)
          id = result._id
        })
    })

    it('update', function() {
      return adaptor
        .update(id, {
          desc: 'world'
        })
        .then(function(result) {
          assert.equal(result.desc, 'world')
        })
    })

    it('exist', function() {
      return adaptor
        .exist(['username'], {
          username: username
        })
        .then(function(result) {
          assert.equal(result, true)
        })
    })

    it('findUser', function() {
      return adaptor
        .findUser(['username'], {
          username: username
        })
        .then(function(result) {
          assert.equal(result.username, username)
        })
    })

    it('findById', function() {
      return adaptor
        .findById(id)
        .then(function(result) {
          assert.equal(result.username, username)
        })
    })
  })
})
