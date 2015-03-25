"use strict";
module.exports = function(grunt) {

  // [Load Task Ver.2]
  // Foreach Load Task
  [
    // Load Task Watch
    'grunt-contrib-watch',
    // Load Task CSS
    'grunt-contrib-compass',
    'grunt-contrib-cssmin',
    // Load Task JS
    'grunt-contrib-jshint',
    'grunt-contrib-uglify',
    // Load Task Combine File
    'grunt-contrib-concat',
    // Server Restart
    'grunt-express-server'
  ].forEach(function(task){
    grunt.loadNpmTasks(task);
  });

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
    /*Task:express Server Restart*/
    express:{
      options:{
        script: '<%= pkg.main %>'
      },
      dev:{
        options:{
          script: '<%= pkg.main %>'
        }
      }
    },
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
        /*forever:永遠運作(def:true)*/
        /*預設狀況下watch會阻止grunt.fatal和grunt.warn跳離執行中的程序，若你有特殊需求必須跳離，請設為false*/
        forever: true,
        /*livereload*/
        livereload: true,
        /*任務完成時輸出訊息*/
        dateFormat: function(time) {
          grunt.log.writeln('The watch finished in ' + time + 'ms at' + grunt.template.today("yyyy-mm-dd TT hh:MM:ss"));
          grunt.log.writeln('Waiting for more changes...');
        },
        /*atBegin:啟動時自動觸發(def:false)*/
        /*啟動時先觸發一次對應的各子任務(task)*/
        atBegin: false,
        /*reload觸發間隔*/
        /*interval: 100,*/
        /*task產生的檔案是否納入監測並套用相對應的task任務*/
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
      express: {
        files: ['*.*','**/*.*'],
        tasks: ['express']
      },
      GruntfileJS: {
        files: ['Gruntfile.js'],
        tasks: ['jshint']
      }
    }
  });

  // [Load Task Ver.1]
  // Load Task Watch
  //grunt.loadNpmTasks('grunt-contrib-watch');
  // Load Task CSS
  //grunt.loadNpmTasks('grunt-contrib-compass');
  //grunt.loadNpmTasks('grunt-contrib-cssmin');
  // Load Task JS
  //grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  // Load Task Combine File
  //grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  //grunt test
  grunt.registerTask('csstest', ['compass']);
  grunt.registerTask('jstest', ['jshint']);
  grunt.registerTask('test', ['compass','jshint']);
  //grunt listen
  grunt.registerTask('listen', ['express','watch']);
  //grunt
  grunt.registerTask('default', [
    'compass',
    'cssmin',
    'jshint',
    'uglify'
  ]);
};
