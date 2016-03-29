module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Copy web assets from bower_components to src directory.
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap-sass/assets/javascripts/',
                        src: ['**/*.min.js'],
                        dest: 'src/js/'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/jquery/dist/js',
                        src: ['**/*.min.js'],
                        dest: 'src/js/'
                    },
                    {
                        expand: true,
                        filter: 'isFile',
                        flatten: true,
                        cwd: 'bower_components/smooth-scroll/dist/',
                        src: ['**/*.min.js'],
                        dest: 'src/js/'
                    },
                    {
                        expand: true,
                        filter: 'isFile',
                        flatten: true,
                        cwd: 'bower_components/font-awesome/css/',
                        src: ['**/*.min.css'],
                        dest: 'src/css/'
                    },
                    {
                        expand: true,
                        filter: 'isFile',
                        flatten: true,
                        cwd: 'bower_components/',
                        src: ['font-awesome/fonts/**'],
                        dest: 'src/fonts/'
                    },
                    {
                        expand: true,
                        filter: 'isFile',
                        flatten: true,
                        cwd: 'bower_components/',
                        src: ['bootstrap-sass/assets/fonts/**'],
                        dest: 'src/fonts/'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap-sass/assets/stylesheets/',
                        src: ['**/*.scss'],
                        dest: 'src/scss/'
                    }
                ]
            },
        },

        // Compile SASS files into minified CSS in src/css.
        sass: {
            options: {
                includePaths: ['bower_components/bootstrap-sass/assets/stylesheets']
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    'src/css/app.css': 'src/scss/app.scss'
                }
            }
        },

        // Watch these files and notify of changes.
        watch: {
            grunt: { files: ['Gruntfile.js'] },

            sass: {
                files: [
                    'src/scss/**/*.scss'
                ],
                tasks: ['sass']
            }
        }
    });

    // Load externally defined tasks. 
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Establish tasks we can run from the terminal.
    grunt.registerTask('build', ['sass', 'copy']);
    grunt.registerTask('default', ['build', 'watch']);
}