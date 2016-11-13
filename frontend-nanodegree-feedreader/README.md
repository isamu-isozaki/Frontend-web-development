 # Feed Reader
 ### How to run the application
  - Open index.html
  - Wait for a few moments while the tests are executing until it returns to the Udacity feeds and doesn't seem to change anymore
  - Click the menu Icon and you will see a list of criteria of feeds that you will have access to.
  - Click on the feed you desire and you will see feeds related to that topic come up
### What I modified
 - I modified the feedreader so that it has a loop that continues only when the loadFeed function is complete in which event, the contents of the first element of class entry in the element of class feed will be included in an array named feeds. In the end that array is used to evaluate the final two tests.
### Concerns
 - For the gulp-jasmine-phantom I followed the documentation and installed phantomjs than I did install the plugin yet when I execute the following task there was an error. How can I fix this?

       gulp.src('jasmine/spec/feedreader.js')
               .pipe(jasmine({
                   integration: true,
                   vendor: ['js/app.js', 'jasmine/lib/jasmine-2.1.2/*.js']
               }));

### To see the error for your self
 - Install node and gulp.
 - type

     npm install

 at the root directory.
 - type gulp in the terminal