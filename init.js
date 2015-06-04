'use strict';

var async = require('async'),
    _ = require('lodash'),
    logger = require('./lib/logger').Logger('init', 1);

/**
 * Callback levels:
 *   - next: Top scope.
 *   - callback: Second scope.
 *   - cb: Third scope.
 *   ... After that, you're on your own.
 */

async.auto({
    environment:  require('./lib/environment'),
    database:     require('./lib/database'),
    certificate:  require('./lib/certificate'),
    httpd:        require('./lib/httpd'),
    middleware:   require('./lib/middleware'), 
    models:       require('./lib/models'),
    routes:       require('./lib/routes'),
    integrity_routes: require('./lib/integrity_routes'),
    demoprahic_routes: require('./lib/demographic_routes'),
    medclass_routes: require('./lib/medclass_routes'),
    report_routes:       require('./lib/report_routes'),
}, complete);

/**
 * The final completion function. Throws any errors that arise, or listens.
 * @param  {Error}  error Any errors passed to us via `next(err, null)`` from tasks.
 * @param  {Object} data  The complete async data object.
 */
function complete(error, data) {
    if (error) { logger.error(error); throw error; }
    // No errors
    require('https').createServer(data.certificate, data.httpd).listen(process.env.PORT, function () {
        logger.success('Server listening on port ' + process.env.PORT);
    });
}
