const check10digit = {
    type: 'object',
    required: ['company_id'],
    properties: {
        company_id: {
            type: 'integer',
            minimum: 1000000000,
            maximum: 9999999999,
        }
    }
}

const checkQueueId = {
    type: 'string',
    required: ['queue_id'],
    properties: {
        queue_id: {
            type: 'string',
            pattern: '^([0-1]?[0-9]|2[0-3])[0-5][0-9]$',
            minLength: 10,
            maxLength: 10
        },
    }
}

const checkStatus = {
    type: 'string',
    required: ['status'],
    properties: {
        status: {
            type: 'string',
            pattern: '^(ACTIVATE|DEACTIVATE)$'
        },
    }
}

const jsonschema = require('jsonschema');

function isValid(instance, schema) {
    // console.log(jsonschema.validate(instance, schema))
    if ((jsonschema.validate(instance, schema).errors.length) == 0) {
        // console.log("Valid");
        return true;
    } else {
        // console.log("Not Valid");
        return false;
    }
}

module.exports = {
    check10digit,
    checkQueueId,
    checkStatus,
    isValid,
};