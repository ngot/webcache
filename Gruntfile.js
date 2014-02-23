module.exports = function (grunt) {
  var env = process.env.CI ? 'continuous' : 'unit';

  grunt.initConfig({
    readme: 'README.md',
    pkg: grunt.file.readJSON('package.json'),
	  karma: {
		  options: {
			  configFile: 'karma.conf.js'
		  },
		  unit:{

		  },
		  //continuous integration mode: run tests once in PhantomJS browser.
		  continuous: {
			  singleRun: true,
			  browsers: ['PhantomJS']
		  }
	  },

    uglify: {
      build: {
        files: {
          'build/<%= pkg.name %>.min.js': ['src/<%= pkg.name %>.js']
        }
      }
    },
    copy: {
      build: {
        files: [
          { expand: true, flatten: true, src: ['src/**'], dest: 'build/', filter: 'isFile' }
        ]
      },
      demo: {
        options: {
          processContent: (function (content) {
            return grunt.template.process(content);
          })
        },
        files: [
          { src: ['demo/**'], dest: '.tmp/' }
        ]
      }
    },
    clean: {
      build: {
        src: ['build']
      }
    }
  });

	/**
	 * load all grunt tasks
	 */
	require('load-grunt-tasks')(grunt);

  grunt.registerTask('test-dev', ['karma:unit']);
  grunt.registerTask('test-ci', ['karma:continuous']);
  grunt.registerTask('build', ['clean:build', 'uglify', 'copy:build']);
  grunt.registerTask('default', ['test-dev']);
};
