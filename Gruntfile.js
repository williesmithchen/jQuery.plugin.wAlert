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
    // Load Copy Files
    'grunt-contrib-copy',
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
          banner: '/*\n<%= pkg.licenseDescription %>\n<%= pkg.name %>.min.css by [<%= pkg.name %>] \nVersion<%= pkg.version %> \nBuild@<%= grunt.template.today("yyyy-mm-dd TT hh:MM:ss") %> */',
          report: 'gzip'
        },
        files: [{
          expand: true,
          /*dev 目錄*/
          cwd: 'src/public/css/',
          /*所有css檔 但排除min.css*/
          src: ['*.css', '!*.min.css'],
          /*判斷檔名規則使用最後一個dot*/
          extDot: 'last',
          /*output 目錄*/
          dest: 'src/public/css/',
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
            'src/private/js/<%= pkg.name %>.js', 'src/private/js/!*.min.js'
          ],
          extDot: 'last'
        }
      }
    },
    /*JavaScript Minify*/
    uglify: {
      options: {
        banner: '/*\n<%= pkg.licenseDescription %>\n<%= pkg.name %>.min.js by [<%= pkg.name %>] \nVersion<%= pkg.version %> \nBuild@<%= grunt.template.today("yyyy-mm-dd TT hh:MM:ss") %> */\n',
        //sourceMap: true
      },
      build: {
        files: [{
          expand: true,
          cwd: 'src/private/js/',
          src: ['*.js', '!*.min.js'],
          extDot: 'last',
          dest: 'src/public/js/',
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
        src: ['src/private/js/<%= pkg.name %>.js'],
        dest: 'src/public/js/<%= pkg.name %>.<%= pkg.version %>.min.js',
      },
      css: {
        src: ['src/private/css/<%= pkg.name %>.css'],
        dest: 'src/public/css/<%= pkg.name %>.<%= pkg.version %>.min.css',
      }
    },*/
    /*Task:express Server Restart*/
    express: {
      options: {
        script: '<%= pkg.main %>'
      },
      dev:{
        options:{
          script: '<%= pkg.main %>'
        }
      }
    },
    /*Watch*/
    min: {
      options: {
        dateFormat: function(time) {
          grunt.log.writeln('The watch finished in ' + time + 'ms at' + grunt.template.today("yyyy-mm-dd TT hh:MM:ss"));
          grunt.log.writeln('Waiting for more changes...');
        },
        spawn: false
      },
      cssmin: {
        files: ['src/public/css/*.css', 'src/public/css/!*.min.css'],
        tasks: ['cssmin']
      },
      jsmin: {
        files: ['src/public/js/*.js', 'src/public/css/!*.min.js'],
        tasks: ['uglify']
      }
    },
    /*Copy*/
    copy: {
      main: {
        files:[
          {expand: true, cwd: 'src/public/css/', src: ['*.min.css'], dest: 'dist/css/'},
          {expand: true, cwd: 'src/public/js/', src: ['jQuery.plugin.wAlert.min.js'], dest: 'dist/js/'}
        ]
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
        files: ['src/private/scss/*.scss'],
        tasks: ['compass', 'cssmin']
      },
      js: {
        files: ['src/private/js/*.js', 'src/private/css/!*.min.js'],
        tasks: ['jshint', 'uglify']
      },
      express: {
        files: ['*.*','**/*.*'],
        tasks: ['express', 'copy']
      },
      GruntfileJS: {
        files: ['Gruntfile.js'],
        tasks: ['jshint']
      }
    }
  });

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
