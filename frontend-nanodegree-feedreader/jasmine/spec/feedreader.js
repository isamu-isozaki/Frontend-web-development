/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the RSS
     * feeds definitions, the allFeeds variable in our application.
     */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        /* This test ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('has url in each of its feeds', function() {
            allFeeds.forEach(function(elem){
                expect(elem.url).toBeTruthy();
            });
        });

        /* This loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('has names in each of its feeds', function() {
            allFeeds.forEach(function(elem){
                expect(elem.name).toBeTruthy();
            });
        });
    });


    describe('The menu', function() {
        /* This is a test that ensures the menu is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        var body = $('body');
        it('has hidden menu elements by default', function() {
            expect(body).toHaveClass('menu-hidden');//This is from jquery-jasmine it is not builtin to jasmine
        });

        /* This is the test that ensures the menu changes
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */
        it('has functioning visibility toggle of the menu elements', function() {
            var menuIcon = $('.menu-icon-link')[0];
            menuIcon.click();
            expect(body).not.toHaveClass('menu-hidden');
            menuIcon.click();
            expect(body).toHaveClass('menu-hidden');
        });

    });

    var feeds = [];
    var x = 0;
    //This is a function that loo
    var loopArray = function(arr, cb) {//courtesy of http://stackoverflow.com/questions/14408718/wait-for-callback-before-continue-for-loop
        loadFeed(x, function(){//on callback from the loadFeed function continue loop
            // set x to next item
            feeds.push($('.feed .entry')[0].innerHTML);//since the first element will do to know the existance of an entry
            if(++x < arr.length) {
                loopArray(arr ,cb);
            } else {
                console.log(feeds);
                cb();
            }
        });
    };
    function thereAreDuplicates(arr) {
        var i,
            j,
            len = arr.length;
        for (i = 0; i < len; i++) {
            var TestElemHTML = arr[i];//contents of the container
            for (j = 0; j < len; j++) {
                if (TestElemHTML == arr[j]) {
                    if (i != j) { //if they are not at the same index
                        return true;
                    }
                }
            }
        }
        return false;
    }

    describe('Initial Entries', function() {
        /* This is a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         */

        beforeAll(function(done){//since it only needs to be done once
            if(feeds.length == allFeeds.length){//since it won't be necessary to call loopArray more than once
                done();
            } else {
                feeds = [];
                x = 0;
                loopArray(allFeeds, done);
            }
        });

        it('has at least one .entry element in the .feed container', function(done) {
            var entryExists = true;
            feeds.forEach(function(elem){
                if(elem.length === 0)//if this string is in the contents of the .feed container it means that at least for that category there is at least one element that has a class named entry in the .feed container
                    entryExists = false;
            });
            expect(entryExists).toBeTruthy();
            done();
        });
    });

    describe('New Feed Selection', function() {
        /* This is a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         */
        beforeAll(function(done){//since it only needs to be done once to complete the array feeds
            if(feeds.length == allFeeds.length){
                done();
            } else {
                feeds = [];
                x = 0;
                loopArray(allFeeds, done);
            }
        });
        it('changes when loaded', function(done) {
            expect(thereAreDuplicates(feeds)).toBeFalsy();
            init();
            done();
        });
    });

}());
