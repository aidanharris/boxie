'use strict';

const request = require('request');

module.exports = (grunt) => {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);
  let files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'bin/www'
      }
    },
    sass: {
      dist: {
        files: {
          'public/css/style.css': 'public/css/style.scss'
        }
      }
    },
    pug: {
        compile: {
            options: {
                data: {
                    debug: false
                }
            },
            files: {
                'public/components/dist/main/_main.html': ['public/components/src/main/_main.pug'],
                'public/components/dist/boxes/_boxes.html': ['public/components/src/boxes/_boxes.pug']
            }
        }
    },
    babel: {
        options: {
            sourceMap: true,
            presets: ['es2015']
        },
        dist: {
            files: {
                'public/components/dist/app.js': 'public/components/src/app.js',
                'public/components/dist/main/main.js': 'public/components/src/main/main.js',
                'public/components/dist/boxes/boxes.js': 'public/components/src/boxes/boxes.js'
            }
        }
    },
    copy: {
        main: {
            files: [
                {expand: true, flatten: true, src: ['node_modules/angular-ui-bootstrap/dist/*.js'], dest: 'public/js', filter: 'isFile'},
                {expand: true, flatten: true, src: ['node_modules/angular-ui-bootstrap/dist/*.css'], dest: 'public/css', filter: 'isFile'},
                {expand: true, flatten: true, src: ['node_modules/jquery/dist/jquery.min.js', 'node_modules/jquery/dist/jquery.min.map'], dest: 'public/js', filter: 'isFile'},
                {expand: true, flatten: true, src: ['node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'], dest: 'public/js', filter: 'isFile'},
                {expand: true, flatten: true, src: ['node_modules/bootstrap-sass/assets/fonts/bootstrap/*'], dest: 'public/fonts/bootstrap', filter: 'isFile'},
                {expand: true, flatten: true, src: ['node_modules/angular/angular.min.js','node_modules/angular/angular.min.js.map'], dest: 'public/js', filter: 'isFile'},
                {expand: true, flatten: true, src: ['node_modules/angular-animate/angular-animate.min.js', 'node_modules/angular-animate/angular-animate.min.js.map'], dest: 'public/js', filter: 'isFile'},
                {expand: true, flatten: true, src: ['node_modules/angular-aria/angular-aria.min.js', 'node_modules/angular-aria/angular-aria.min.js.map'], dest: 'public/js', filter: 'isFile'},
                {expand: true, flatten: true, src: ['node_modules/angular-cookies/angular-cookies.min.js', 'node_modules/angular-cookies/angular-cookies.min.js.map'], dest: 'public/js', filter: 'isFile'},
                {expand: true, flatten: true, src: ['node_modules/angular-messages/angular-messages.min.js', 'node_modules/angular-messages/angular-messages.min.js.map'], dest: 'public/js', filter: 'isFile'},
                {expand: true, flatten: true, src: ['node_modules/angular-r/angular-resource.min.js', 'node_modules/angular-resource/angular-resource.min.js.map'], dest: 'public/js', filter: 'isFile'},
                {expand: true, flatten: true, src: ['node_modules/angular-route/angular-route.min.js', 'node_modules/angular-route/angular-route.min.js.map'], dest: 'public/js', filter: 'isFile'},
                {expand: true, flatten: true, src: ['node_modules/angular-sanitize/angular-sanitize.min.js', 'node_modules/angular-sanitize/angular-sanitize.min.js.map'], dest: 'public/js', filter: 'isFile'},
                {expand: true, flatten: true, src: ['node_modules/angular-touch/angular-touch.min.js', 'node_modules/angular-touch/angular-touch.min.js.map'], dest: 'public/js', filter: 'isFile'},
            ]
        }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: (() => { return process.env.LIVE_RELOAD_PORT || 35729; })
      },
      server: {
        files: [
          'bin/www',
          'app.js',
          'routes/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      js: {
        files: ['public/js/*.js'],
        options: {
          livereload: (() => { return process.env.LIVE_RELOAD_PORT || 35729; })
        }
      },
      css: {
        files: [
          'public/css/*.scss'
        ],
        tasks: ['sass'],
        options: {
          livereload: (() => { return process.env.LIVE_RELOAD_PORT || 35729; })
        }
      },
      views: {
        files: ['views/*.pug','public/components/src/**/*.pug'],
        tasks: ['pug'],
        options: {
          livereload: (() => { return process.env.LIVE_RELOAD_PORT || 35729; })
        },
      }
    }
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    const done = this.async();
    setTimeout(() => {
      request.get('http://localhost:' + (() => { return process.env.LIVE_RELOAD_PORT || 35729; }) + '/changed?files=' + files.join(','),  function (err, res) {
          const reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', [
    'sass',
    'pug',
    'babel',
    'develop',
    'watch'
  ]);
};
