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

const checktime = {
    type: 'string',
    pattern: '^[0-9]{4}-[0-1][0-9]-[0-2][0-9](T|\s)[0-2][0-9]:[0-5][0-9]:[0-6][0-9]([.][0-9]*)?(Z|(([+]|-)?[0-2][0-9]:[0-5][0-9]))$'
}

const checkduration = {
    type: 'integer',
    minimum: 1,
    maximum: 1440
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
    checktime,
    checkduration,
    isValid,
};