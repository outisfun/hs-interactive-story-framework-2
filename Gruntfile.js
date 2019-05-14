module.exports = function(grunt) {

  var target = grunt.option('target') || 'preview'; // if no story is specified, run on the

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    shell: {
      options: {
        stderr: false
      },
      buildStory: {
        command: target => `node build-story ${target}`
      },
      initStory: {
        command: target => `node init-story ${target}`
      }
    },

    browserify: {
      options: {
        browserifyOptions: {
          paths: [ './', './src', './stories' ]
        }
      },
      stories: {
        files: [{
            cwd: './',
            src: './stories/' + target + '/build/*.js',
            expand: true,
            rename: function(dest, src) {
                var newPath = src.replace('build', 'dist');
                var customDest = this.cwd + newPath;
                return customDest;
            }
        }]
      },
    },

    handlebars: {
      compile: {
        options: {
          namespace: 'modules',
          processName: function(filePath) {
            var pieces = filePath.split('/');
            return pieces[pieces.length - 2];
          },
          wrapped: true,
          node: true
        },
        files: {
          'src/templates.js': ['./src/modules/**/*.hbs', './stories/**/**/template.hbs'],
        }
      }
    },

    sass: {
      options: {
        loadPath: ['./src/scss', './src/modules/']
      },
      stories: {
        cwd: './',
        src: './stories/' + target + '/build/styles.scss',
        expand: true,
        rename: function(dest, src) {
          var newPath = src.replace('build', 'dist');
          var customDest = this.cwd + newPath.replace('scss', 'css');
          return customDest;
        }
      }
    },

    autoprefixer: {
      stories: {
          './stories/**/dist/styles.css' : './stories/**/dist/styles.css'
      }
    },

    copy: {
      stories: {
        files: [
          {
            expand: true,
            src: ['./stories/**/build/*.html'],
            rename: function(dest, src) {
              var newPath = src.replace('build', 'dist');
              var customDest = this.cwd + newPath.replace('scss', 'css');
              return customDest;
            },
            filter: 'isFile'
          }
        ]
      },
    },

    eslint: {
      options: {
        configFile: '.eslintrc.json',
        fix: true
      },
      target: ['./build-files.js', '.src/frameworkdata.js', './src/modules/**/script.js']
    },

    watch: {
      sass: {
        files: ['./stories/**/build/*.scss', './src/scss/style.scss', './src/modules/**/style.scss'],
        tasks: ['sass:stories']
      },
      js: {
        files: ['./src/*.js', './stories/**/build/*.js' ],
        tasks: ['browserify:stories']
      },
      // rebuild template after changes in data
      data: {
        files: ['./stories/**/data.json'],
        tasks: ['shell:buildStory:' + target]
      },
      // recompile handlebars after a change in templates, then rebuild story files
      hbs: {
        files: ['./src/modules/**/template.hbs', './stories/**/**/template.hbs'],
        tasks: ['handlebars', 'shell:buildStory:' + target]
      }
    },

    serve: {
      'path': './stories/' + target + '/dist/index.html'
    }

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-assemble');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('lintall', ['eslint']);

  grunt.registerTask('build-dist', ['browserify:stories', 'sass:stories', 'autoprefixer:stories']);

  grunt.registerTask('init-story', ['shell:initStory:' + target]);
  grunt.registerTask('build-story', ['handlebars', 'shell:buildStory:' + target, 'build-dist', 'watch']);

  grunt.registerTask('default', ['watch']);
};
