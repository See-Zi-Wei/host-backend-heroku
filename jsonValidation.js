const check10digit = {
    type: 'integer',
    minimum: 1000000000,
    maximum: 9999999999,
}

const checkQueueId = {
    type: 'string',
    pattern: '^[a-zA-Z0-9_]*$',
    minLength: 10,
    maxLength: 10
}

const checkStatus = {
    type: 'string',
    pattern: '^(ACTIVATE|DEACTIVATE)$'
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