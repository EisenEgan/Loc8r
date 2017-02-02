var mongoose = require('mongoose');

/*var dbURI = 'mongodb://localhost/Loc8r';

if (process.env.NODE_ENV === 'production') {
  console.log("mongolab dbURI used");
  dbURI = process.env.MONGODB_URI;
};*/
var dbURI = 'mongodb://heroku_sw0nzdqh:92ckrbvr8nj7icqnaee6k8cdl9@ds135669.mlab.com:35669/heroku_sw0nzdqh'
mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
})

mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error ' + err);
})

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
})

var gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  })
}

// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});
// For Heroku app termination
process.once('SIGUSR2', function() {
  gracefulShutdown('Heroku app shutdown', function() {
    process.exit(0);
  });
});

require('./locations');
