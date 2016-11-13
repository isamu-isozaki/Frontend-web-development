#To successfully complete this project
1. Install node.js
2. Install gulp using npm
3. Install gulp to your working directory using npm
4. For images
 1.Optimize all the images using gulp-imgmin.
 2.For pizzeria.jpg
  * make another one for the icon for index.html with smaller dimensions named pizzeria-small.jpg
  * make another pizzeria.jpg named pizzeria-medium.jpg with bigger dimensions than pizzeria-small.jpg yet smaller than pizzeria.jpg for pizza.html
 3. Change 2048.png to 2048.jpg since it offers smaller data size and the loss of quality isn't noticeable
5. For css
 1. Minimize all css files using gulp-minify-css.
 2. Put the link tag for the google fonts at the end of the body tag
 3. Put media = "print" in all link tags searching for print.css
6. For Javascript
 1. Put async in all script tags(except that of pizza.html)
 2. Problems for changePizzaSizes
    * It was declaring a variable that is costly to performance every iteration in its for function.
    * DetermineDx was doing a lot of unnecessary calculations
 
 3. Solutions for changePizzaSizes
    * Declare the variable outside of the loop
    * Simplify DetermineDx so it will only return a percent value according to the user input.
 4. Problems for updatePositions
    * It was fetching and calculating document.body.scrollTop/1250 and (i % 5) every iteration.
    * It was using left instead of transform
    * Not using requestAnimationFrame
    * It was moving more pizzas than necessary
 5. Solutions for updatePosition
    * Do the fetching and the calculations outside of the loop.
    * Use transform instead of left(there was a strange offset going on but can fix that by subtracting the offset)
    * Use requestAnimationFrame.
    * Calculate the amount of Pizzas that will fit in the screen and only put those on the screen.
 6. Minify using gulp-uglify.
7. Inline everything using gulp-inline
8. Install rimraf(npm install rimraf -g)
9. got rid of node_modules using rimraf(rimraf node_modules)
10. Finish

#The gulp tasks

1. gulp clear deletes everything everything except that ones in the production folder
2. gulp optiSend is supposed to remove unnecessary css(doesn't check for styles needed by java script) and remove comments(just doesn't work) and sends it to a new directory temp-src(so since it is not working it isn't doing anything).
3. gulp miniSend first minifies js, css and images and then sends the inlined and minified html to the src directory(I didn't inline the images)
4. gulp giveUpSend works from the fact optiSend is not working. It basically does exactly what miniSend does except it does it directly from the production directory(So if you want to do it like I did it then first do gulp clear and then do gulp giveUpSend)
5. gulp cleanUp removes temp-src.(unneccesary if you are using giveUpSend)
6. gulp optimize is supposed to do all the tasks listed above(doesn't work in sequence)

#How to run this

1. Download the source
2. Open up index.html

#To get set up from the production phase

1. When you are satisfied with your work
2. Go to your working directory(in this case P4) and enter npm install
3, Then either run
 1.gulp clear, gulp giveUpRun, or
 2.gulp clear, gulp optiSend, gulp miniSend, gulp cleanUp
4, This will generate a minified version of your project in the src file

#Concerns

1. I am using transform but I needed an offset of half a page.
2. gulp-uncss doesn't detect css required from the javascript
3, gulp-strip-comments doesn't strip any comments
4. optimize doesn't do the tasks one after another which I tried to establish using promises


#Things I used

1. gulp

#References

1. http://www.html5rocks.com/en/tutorials/speed/animations/ for the request animation frames
2. the MSDN pages to learn about the functions of javascript and css
3. csstriggers.com to check which operation is the best
4. Udacity's course on promises
5. https://css-tricks.com/gulp-for-beginners/ for getting started using gulp


