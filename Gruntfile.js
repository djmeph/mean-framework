module.exports = function(grunt) {

  'use strict';

   var concatFiles = [
    '_src/app.js',
    '_src/controllers/*.js',
    '_src/services/*.js',
    '_src/directives/*.js'
    //'_src/filters/*.js'
  ];

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    pug: {
      dist: {
        options: {
          data: {
            title: 'MEAN Framework',
            built: new Date().getTime() }
        },
        files: {
          'www/index.html': 'views/index.pug',
        }
      }
    },

    concat: {
      dist: {
        options: {},
        files: { '_src/build/app.js': concatFiles }
      },
      debug: {
        options: {},
        files: { 'www/app.min.js': concatFiles }
      }
    },

    uglify: {
      dist: {
        options: { mangle: false },
        files: {
          'www/app.min.js': '_src/build/app.js'
        }
      }
    },

    less: {
      dist: {
        options: {
          compress: true,
          yuicompress: true,
          sourceMap: false
        },
        files: {
          "www/app.css": "less/app.less"
        }
      },
      debug: {
        options: {
          compress: true,
          yuicompress: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: 'app.css.map',
          sourceMapFilename: 'www/app.css.map'
        },
        files: {
          "www/app.css": "less/app.less"
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('dist', ['pug:dist', 'concat:dist', 'uglify:dist', 'less:dist']);
  grunt.registerTask('debug', ['pug:dist', 'concat:debug', 'less:debug']);

};
