'use strict'

var userAgent = require('default-user-agent')

var defaultOptions = {
    acceptedSchemes: ['http', 'https'],
    cacheExpiryTime: 3600000,
    cacheResponses: true,
    excludedKeywords: [],
    excludedSchemes: ['data', 'geo', 'javascript', 'mailto', 'sms', 'tel'],
    excludeExternalLinks: false,
    excludeInternalLinks: false,
    excludeLinksToSamePage: true,
    filterLevel: 1,
    honorRobotExclusions: true,
    maxSockets: Infinity,
    maxSocketsPerHost: 1,
    rateLimit: 0,
    requestMethod: 'head',
    retry405Head: true,
    tags: require('./tags'),
    userAgent: userAgent('PostmanRuntime', '7.26.8'),
    responseTimeout: 120000,
    detailedOutput: false,
}

module.exports = defaultOptions
