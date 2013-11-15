module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        uglify: {
            options: {
                banner: "/*! <%= pkg.name %> <%= grunt.template.today('dd-mm-yyyy') %> */\n"
            },
            dist: {
                files: {
                    "public/orchestrator.min.js": ["public/orchestrator.js"]
                }
            }
        },
        browserify: {
            dev: {
                options: {
                    debug: true
                },
                files: {
                    "public/orchestrator-dev.js": ["client/client.js"]
                }
            },
            dist: {
                options: {
                    debug: false
                },
                files: {
                    "public/orchestrator.js": ["client/client.js"]
                }
            }
        },
        watch: {
            css: {
                files: "public/styles.css",
                options: {
                    livereload: true
                }
            },
            browserify: {
                files: "client/**/*.js",
                tasks: ["browserify:dev"]
            },
        }
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-browserify");

    grunt.registerTask("default", ["browserify:dev", "watch"]);
    grunt.registerTask("build", ["browserify:dist", "uglify"]);
};
