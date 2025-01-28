"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpResponse = httpResponse;
function httpResponse(data, statusCode) {
    return {
        body: JSON.stringify(data),
        statusCode,
    };
}
