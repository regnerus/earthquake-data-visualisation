/*
 *	    ____  ____  _____   ____________
 *	   / __ \/ __ \/  _/ | / /_  __/ __ \
 *	  / /_/ / /_/ // //  |/ / / / / /_/ /
 *	 / ____/ _, _// // /|  / / / / _, _/
 *	/_/   /_/ |_/___/_/ |_/ /_/ /_/ |_|
 *
 *	Copyright Printr B.V. All rights reserved.
 *	This code is closed source and should under
 *	no circumstances be copied or used in other
 *	applications that for Printr B.V.
 *
 */

module.exports = function(grunt) {
	window = {};

	var json = {
		pkg: grunt.file.readJSON('package.json'),

		/*
		 * Concatenate Javascript files
		 */
		concat: {
			options: {
				separator: ';\n'
			},
			files: {
				src: [	
					/*
					 *	Include D3.js
					 */
					'./bower_components/d3/d3.min.js',

					/*
					 *	Include JS files
					 */
					'./javascripts/**/*.js',
				],
				dest: './application.js'
			}
		},
		
		/*
		 * Initialise SASS
		 */

		sass: {
			importer: importOnce,
			importOnce: {
				index: false,
				css: true,
				bower: false
			},
	        options: {
	        	outputStyle: 'compressed',
	            sourceMap: true,
	            includePaths: ['./bower_components/', './bower_components/css-base/dist/'],
	        },
	        dist: {
	            files: {
	                './application.css': './sass/application.scss'
	            }
	        }
	    },

	    autoprefixer: {
		    files: {
				options: {
					browsers: ['last 2 versions'],
					map: {
						inline: false
				    }
				},
		    	src: './application.css' // globbing is also possible here
		    },
		},

		/*
		 * Watch for changes in directories
		 */
		watch: {
			javascripts: {
				files: ['./javascripts/**/*.js'],
				tasks: ['concat']
			},
			sass: {
				files: ['./sass/**/*.scss', './css-base/dist/**/*.scss'],
				tasks: ['sass', 'autoprefixer']
			}
		},

		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: [],
				commit: true,
				commitMessage: 'Release %VERSION%',
				commitFiles: ['package.json', 'bower.json'],
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: true,
				pushTo: 'origin',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
				globalReplace: false,
				prereleaseName: false,
				regExp: false
			}
		}
	}

	require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
	var importOnce = require('node-sass-import-once');

	grunt.initConfig();
	grunt.config.merge(json);

	/*
	 * Load NPM Plugins
	 */
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-autoprefixer');

	/*
	 * Register Tasks
	 */
  	grunt.registerTask('default', ['concat', 'sass', 'autoprefixer']);

};
