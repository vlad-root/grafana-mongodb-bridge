module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.loadNpmTasks('grunt-execute');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.initConfig({

		clean: ["dist"],

		copy: {
			src_to_dist: {
				cwd: 'src',
				expand: true,
				src: ['**/*', '!**/*.js', '!**/*.scss'],
				dest: 'dist'
			}
		},

		watch: {
			rebuild_all: {
				files: ['src/**/*'],
				tasks: ['default'],
				options: {spawn: false}
			}
		},

		babel: {
			options: {
				sourceMap: true,
				presets:  ['es2015']
			},
			dist: {
				options: {
					plugins: ['transform-es2015-modules-systemjs', 'transform-es2015-for-of']
				},
				files: [{
					cwd: 'src',
					expand: true,
					src: ['**/*.js'],
					dest: 'dist',
					ext:'.js'
				}]
			}
		},
	});

	grunt.registerTask('default', [
		'clean', 
		'copy:src_to_dist', 
		'babel', 
	]);
};
