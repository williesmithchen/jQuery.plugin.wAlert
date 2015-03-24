"use strict";
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    /*Setting*/
    pkg: grunt.file.readJSON('package.json'),
    /*Css*/
    compass: {
      build: {
        options: {
          config: 'config.rb'
        }
      }
    },
    /*CSS Minify*/
    cssmin: {
      build: {
        options: {
          banner: '/*\n<%= pkg.licenseDescription %>\n<%= pkg.name %>.min.css <%= pkg.name %> Ver<%= pkg.version %> Build@<%= grunt.template.today("yyyy-mm-dd TT hh:MM:ss") %> */',
          report: 'gzip'
        },
        files: [{
          expand: true,
          /*dev 目錄*/
          cwd: 'public/css/',
          /*所有css檔 但排除min.css*/
          src: ['*.css', '!*.min.css'],
          /*判斷檔名規則使用最後一個dot*/
          extDot: 'last',
          /*output 目錄*/
          dest: 'public/css/',
          /*輸出副檔名*/
          ext: '.min.css'
        }]
      }
    },
    /*JavasSript*/
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      build: {
        files: {
          src: ['Gruntfile.js',
            /*所有js檔 但排除min.js*/
            'private/js/<%= pkg.name %>.js', 'private/js/!*.min.js'
          ],
          extDot: 'last'
        }
      }
    },
    /*JavaScript Minify*/
    uglify: {
      options: {
        banner: '/*\n<%= pkg.licenseDescription %>\n<%= pkg.name %>.min.js <%= pkg.name %> Ver<%= pkg.version %> Build@<%= grunt.template.today("yyyy-mm-dd TT hh:MM:ss") %> */\n',
        //sourceMap: true
      },
      build: {
        files: [{
          expand: true,
          cwd: 'private/js/',
          src: ['*.js', '!*.min.js'],
          extDot: 'last',
          dest: 'public/js/',
          ext: '.min.js'
        }]
      }
    },
    /*Combine Files*/
    /*concat: {
      options: {
        // When Merge Diff File Will Add char(';').
        separator: ';',
      },
      js: {
        src: ['private/js/<%= pkg.name %>.js'],
        dest: 'public/js/<%= pkg.name %>.<%= pkg.version %>.min.js',
      },
      css: {
        src: ['private/css/<%= pkg.name %>.css'],
        dest: 'public/css/<%= pkg.name %>.<%= pkg.version %>.min.css',
      }
    },*/
    /*Watch*/
    min:{
      options: {
        dateFormat: function(time) {
          grunt.log.writeln('The watch finished in ' + time + 'ms at' + grunt.template.today("yyyy-mm-dd TT hh:MM:ss"));
          grunt.log.writeln('Waiting for more changes...');
        },
        spawn: false
      },
      cssmin: {
        files: ['public/css/*.css', 'public/css/!*.min.css'],
        tasks: ['cssmin']
      },
      jsmin: {
        files: ['public/js/*.js', 'public/css/!*.min.js'],
        tasks: ['uglify']
      }
    },
    watch: {
      options: {
        dateFormat: function(time) {
          grunt.log.writeln('The watch finished in ' + time + 'ms at' + grunt.template.today("yyyy-mm-dd TT hh:MM:ss"));
          grunt.log.writeln('Waiting for more changes...');
        },
        spawn: false
      },
      scss: {
        files: ['private/scss/*.scss'],
        tasks: ['compass', 'cssmin']
      },
      js: {
        files: ['private/js/*.js', 'private/css/!*.min.js'],
        tasks: ['jshint', 'uglify']
      },
      GruntfileJS: {
        files: ['Gruntfile.js'],
        tasks: ['jshint']
      }
    }
  });

  // Load Task Watch
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Load Task CSS
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // Load Task JS
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Load Task Combine File
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  //grunt test
  grunt.registerTask('csstest', ['compass']);
  grunt.registerTask('jstest', ['jshint']);
  grunt.registerTask('test', ['compass','jshint']);
  //grunt listen
  grunt.registerTask('listen', ['watch']);
  //grunt min
  grunt.registerTask('min', ['min']);
  //grunt
  grunt.registerTask('default', [
    'compass',
    'cssmin',
    'jshint',
    'uglify'
  ]);
};
