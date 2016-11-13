# Map project

### Steps required to run the application

  - Download my project
  - Unzip it
  - Make sure you allow the location detection of your location
  - Open the index.html in the dist file with a server of your choice 
  - The easiest way is to install python 3 and cd to the dist file and type
 
        $python http.server 8000
  - After which you can open up the server at localhost:8000
  - Use filter box to filter list items and map markers you can also use autocomplete.
  - Select a list item or map marker to open an info window describing the marker.
  - If you are on a mobile device you will have a button next to the search box named toggle. This can toggle your list view on and off.

### How to use the build tools
 - Do 
 
        npm install 
        
    in the console in the root directory assuming you have installed node.js

 - There are two tasks, minify and watch to transport all the files minified and production ready to the dist folder from the src folder, type
 
        gulp minify

    in the root directory
 - if you want to make it so that gulp does this task automatically every time you change a file in the src directory, type
 
        gulp watch