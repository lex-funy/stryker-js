'use strict';

var Stryker = require('stryker').default;

module.exports = function (grunt) {

  grunt.registerMultiTask('stryker', 'The extendable JavaScript mutation testing framework.', function () {
    var target = this.name + "." + this.target + ".";
    var filesProperty = target + 'files';
    var mutateProperty = target + 'mutate';
    var configFileProperty = target + 'configFile';
    
    var options = this.options();

    var configFile = grunt.config.get(configFileProperty);

    if (!configFile || configFile.length === 0) {
      grunt.config.requires(filesProperty);
      grunt.config.requires(mutateProperty);
    } else {
      options.configFile = configFile;
    }
    
    if (grunt.config.get(filesProperty)) {
      options.files = grunt.file.expand(grunt.util.toArray(grunt.config.get(filesProperty)));
    }

    if (grunt.config.get(mutateProperty)) {
      options.mutate = grunt.file.expand(grunt.util.toArray(grunt.config.get(mutateProperty)));
    }

    var done = this.async();
    var stryker = new Stryker(options);
    stryker.runMutationTest().then(function () {
      done();
    }, function () {
      grunt.fail.fatal("Stryker was unable to run the mutation test");
    });
  });

};
