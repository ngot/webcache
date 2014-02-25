module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

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

	grunt.registerTask('default', ['clean:build', 'uglify', 'copy:build']);
};
