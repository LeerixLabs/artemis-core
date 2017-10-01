# Actions

##NAVIGATE
Changes the location of an HTML document.
###Syntax
```sh
navigate to <URL_ADDRESS>
```
URL_ADDRESS can be a full http/https url, or a url suffix part relative to the website root.
###Examples
```sh
navigate to http://www.advantageonlineshopping.com
```
```sh
navigate to /#/shoppingCart
```

##WAIT
Delays the next command execution.

###Syntax
```sh
wait <NUMBER> [second|seconds]
```
A valid value is any number greater than 0.
###Examples
```sh
wait 1 second
```
```sh
wait 3 seconds
```

##FIND
Locates and marks an object on a web page. Used mainly for debugging.
###Syntax
```sh
find <OBJECT_DESCRIPTION>
```
See documentation for a valid object description.
###Examples
```sh
find the "Add to Cart" button
```

##CLICK
Clicks an object on a web page.
###Syntax
```sh
click <OBJECT_DESCRIPTION>
```
See documentation for a valid object description.
###Examples
```sh
click the "Add to Cart" button
```

##SET
Sets the value of an input object on a web page.
###Syntax
```sh
set <OBJECT_DESCRIPTION> to <VALUE>
```
See documentation for a valid object description.
###Examples
```sh
set password input to 123456 
```
