module.exports = function(grunt) {

  'use strict';

   var concatFist = [
    '_src/app.js',
    '_src/controllers/*.js',
    '_src/services/*.js',
    '_src/directives/*.js'
    //'_src/filters/*.js'
  ];

  var concatDebug = concatFist.slice(0);

  concatFist.push('_src/fist.js');
  concatDebug.push('_src/debug.js');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jade: {
      fist: {
        options: {
          data: {
            title: 'Short URL Generator Dashboard',
            built: new Date().getTime() }
        },
        files: {
          'www/dashboard/index.html': 'views/dashboard.jade',
        }
      }
    },

    concat: {
      fist: {
        options: {},
        files: { '_src/build/app.js': concatFist }
      },
      debug: {
        options: {},
        files: { 'www/dashboard/js/app.min.js': concatDebug }
      }
    },

    uglify: {
      fist: {
        options: { mangle: false },
        files: {
          'www/dashboard/js/app.min.js': '_src/build/app.js'
        }
      }
    },

    less: {
      fist: {
        options: {
          compress: true,
          yuicompress: true,
          sourceMap: false
        },
        files: {
          "www/dashboard/css/app.css": "less/app.less"
        }
      },
      debug: {
        options: {
          compress: true,
          yuicompress: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: 'app.css.map',
          sourceMapFilename: 'www/dashboard/css/app.css.map'
        },
        files: {
          "www/dashboard/css/app.css": "less/app.less"
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('fist', ['jade:fist', 'concat:fist', 'uglify:fist', 'less:fist']);
  grunt.registerTask('debug', ['jade:fist', 'concat:debug', 'less:debug']);

};