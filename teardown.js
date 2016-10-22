var config = require('./config'),
    rp = require('request-promise');

function handleError(err) {
  if (err.error &&
      err.error.errorResponse &&
      err.error.errorResponse.message) {
    console.log('Error: ' + err.error.errorResponse.message);
  } else {
    console.log(JSON.stringify(err, null, 2));
  }
}

function deleteCollection() {
  var options = {
    method: 'DELETE',
    uri: 'http://' + config.host + ':8002/manage/v2/databases/' + config.database.name + '/temporal/collections?collection=' + config.collectionSetup['collection-name'],
    json: true,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      console.log('Temporal collection deleted: ' + config.collectionSetup["collection-name"]);
      deleteValidAxis();
    })
    .catch(function (err) {
      console.log(JSON.stringify(err, null, 2));
    });
}

function deleteAxis(axisConfig, callback) {
  var options = {
    method: 'DELETE',
    uri: 'http://' + config.host + ':8002/manage/v2/databases/' + config.database.name + '/temporal/axes/' + axisConfig["axis-name"],
    json: true,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      console.log('Temporal axis deleted: ' + axisConfig["axis-name"]);
      if (callback) {
        callback.call(this);
      }
    })
    .catch(function (err) {
      console.log(JSON.stringify(err, null, 2));
    });
}

function deleteValidAxis() {
  createAxis(config.axisValidSetup, deleteSystemAxis);
}

function deleteSystemAxis() {
  createAxis(config.axisSystemSetup, deleteREST);
}

function deleteREST() {
  var options = {
    method: 'DELETE',
    uri: 'http://' + config.host + ':8002/v1/rest-apis/' + config.database.name + "-rest" +
         '?include=content&include=modules',
    json: true,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      console.log('REST instance deleted: ' + config.database.name + "-rest");
    })
    .catch(function (err) {
      handleError(err)
    });
}

function start() {
  deleteREST();
}

start();
