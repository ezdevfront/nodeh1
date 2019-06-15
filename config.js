/*
* Cretate and export configuration variables
*
*/

// Container for all the enviroments
var enviroments = {};

// Staging (default) enviroment
enviroments.staging = {
    'port' : 3000,
    'envName' : 'staging'
};


// Production enviroments
enviroments.production = {
    'port' : 5000,
    'envName' : 'production'
};

//Determine which enviroment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current enviroment is one of the enviroments above, if not default to "staging"
var enviromentToExport = typeof(enviroments[currentEnvironment]) == 'object' ? enviroments[currentEnvironment] : enviroments.staging;

// Export the module
module.exports = enviromentToExport;
