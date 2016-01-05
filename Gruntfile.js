module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        "phonegap-build": {
            debug: {
                options: {
                    archive: "app.zip",
                    "appId": "YOURAPPID",
                    "user": {
                        "token": "ACCESSTOKENFROM-PGB"
                    },
                    keys: {
                        ios: { "password": "test" },
                        android: { "key_pw": "test", "keystore_pw": "test" }
                    },
                    download: {
                        ios: 'debug/ios.ipa',
                        android: 'debug/android.apk'
                    }
                }
            },
            //Make this one use minified version
            release: {
                options: {
                    archive: "dist/app.zip",
                    "appId": "YOURAPPID",
                    "user": {
                        "token": "ACCESSTOKENFROM-PGB"
                    },
                    keys: {
                        ios: { "password": "test" },
                        android: { "key_pw": "test", "keystore_pw": "test" }
                    },
                    download: {
                        ios: 'dist/ios.ipa',
                        android: 'dist/android.apk'
                    }
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                    'www/dist/dist_js/app.min.js': ['www/dist/dist_js/app.js']
                }
            }
        },
        compress: {
            debug: {
                options: {
                    archive: 'app.zip'
                },
                files: [
                    {expand: true, src: ['**/*'], cwd: 'www/'}
                ]
            },
            release: {
                options: {
                    archive: 'dist/app.zip'
                },
                files: [
                    {expand: true, src: ['dist_js/app.min.js'], cwd: 'www/dist/'},
                    {expand: true, src: ['dist_js/app/templates.js'], cwd: 'www/dist/'},
                    {expand: true, src: ['dist_css/*'], cwd: 'www/dist/'},
                    {expand: true, src: ['lib/**'], cwd: 'www/'},
                    {expand: true, src: ['images/**'], cwd: 'www/'},
                    {expand: true, src: ['resources/**'], cwd: 'www/', dot: true},
                    {expand: true, src: ['config.xml'], cwd: 'www/'},
                    {expand: true, src: ['index.html'], cwd: 'www/dist/'}
                ]
            }
        }

    });

    // Load tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');


    // Default task.
    grunt.registerTask('default', 'compress');

    //Custom tasks
    grunt.registerTask('build-app-release', ['uglify', 'compress:release', 'phonegap-build:release']);
    grunt.registerTask('build-app-debug', ['compress:debug', 'phonegap-build:debug']);
};