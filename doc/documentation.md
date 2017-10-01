# Actions

## NAVIGATE
Changes the location of an HTML document.
### Syntax
```sh
navigate to <URL_ADDRESS>
```
URL_ADDRESS can be a full http/https url, or a url suffix part relative to the website root.
### Examples
```sh
navigate to http://www.advantageonlineshopping.com
navigate to /#/shoppingCart
```

## WAIT
Delays the next command execution.

### Syntax
```sh
wait <NUMBER> [second|seconds]
```
A valid value is any number greater than 0.
### Examples
```sh
wait 1 second
wait 3 seconds
```

## FIND
Locates and marks an object on a web page. Used mainly for debugging.
### Syntax
```sh
find <OBJECT_DESCRIPTION>
```
See documentation for a valid object description.
### Examples
```sh
find the "Add to Cart" button
```

## CLICK
Clicks an object on a web page.
### Syntax
```sh
click <OBJECT_DESCRIPTION>
```
See documentation for a valid object description.
### Examples
```sh
click the "Add to Cart" button
```

## SET VALUE
Sets the value of an input object on a web page.
### Syntax
```sh
set <OBJECT_DESCRIPTION> to <VALUE>
```
See documentation for a valid object description.
### Examples
```sh
set password input to 123456 
```

# Object Description

## OBJECT TYPE
### Syntax
```sh
[the] [element|button|link|input|password|checkbox|radio|label|image|panel|toolbar|tab|dropdown|item]
```
### Examples
```sh
click the link 
click link 
click the button 
click button 
```

## FREE TEXT
### Syntax
```sh
[the] freetext <OBJECT_TYPE>
[the] free-text <OBJECT_TYPE>
[the] "free text" <OBJECT_TYPE>
[the] 'free text' <OBJECT_TYPE>
```
### Examples
```sh
click home link 
click the home link 
click the "Add to Cart" button
click the 'Add to Cart' button
click the add-to-cart button
click add-to-cart button
```

## ORDINAL
### Syntax
```sh
[the] [1st|2nd|3rd|nth] <OBJECT_TYPE>
```
### Examples
```sh
click the 1st link
click the 4th button
```

## SIZE
### Syntax
```sh
[the] [small|medium|large] <OBJECT_TYPE>
```
### Examples
```sh
click the small refresh button
click the medium logo image
set the large email input to johndoe@acme.com
```

## COLOR
### Syntax
```sh
[the] [maroon|red|brown|orange|yellow|olive|lime|green|teal|aqua|turquoise|blue|navy|fuchsia|pink|purple|black|white|gray|grey|silver] <OBJECT_TYPE>
```
### Examples
```sh
click the blue login button
click the red delete image
```

## LOCATION
### Syntax
```sh
[the] <OBJECT_TYPE> [at the top|at the bottom|on the left|on the right|in the middle]
```
### Examples
```sh
click the home link at the top
click the save button at the bottom
click the cancel button at the bottom on the right
```

## HTML TAG
### Syntax
```sh
[the] <OBJECT_TYPE> [with|and] tag <HTML_TAG>
```
### Examples
```sh
click the element with tag li 
```

## HTML ATTRIBUTE NAME
### Syntax
```sh
[the] <OBJECT_TYPE> [with|and] attribute name <HTML_ATTR_NAME>
```
### Examples
```sh
click the item with attribute name selected 
```

## HTML ATTRIBUTE VALUE
### Syntax
```sh
[the] <OBJECT_TYPE> [with|and] attribute value <HTML_ATTR_VALUE>
[the] <OBJECT_TYPE> [with|and] attribute value "<HTML_ATTR_VALUE>"
[the] <OBJECT_TYPE> [with|and] attribute value '<HTML_ATTR_VALUE>'
```
### Examples
```sh
click the button with attribute value onCancel()
click the button with attribute value "onCancel()"
click the button with attribute value 'onCancel()' 
```

## HTML ATTRIBUTE NAME AND VALUE
### Syntax
```sh
[the] <OBJECT_TYPE> [with|and] attribute <HTML_ATTR_NAME>=<HTML_ATTR_VALUE>
[the] <OBJECT_TYPE> [with|and] attribute <HTML_ATTR_NAME>="<HTML_ATTR_VALUE>"
[the] <OBJECT_TYPE> [with|and] attribute <HTML_ATTR_NAME>='<HTML_ATTR_VALUE>'
```
### Examples
```sh
click the element with attribute id=1234
click the element with attribute id="12 34"
click the element with attribute id='12 34' 
```

## CSS CLASS
### Syntax
```sh
[the] <OBJECT_TYPE> [with|and] class <CSS_CLASS>
```
### Examples
```sh
click the element with class my-legend 
click the element with class my-legend and attribute active 
```

## CSS STYLE NAME AND VALUE
### Syntax
```sh
[the] <OBJECT_TYPE> [with|and] style <CSS_STYLE_NAME>:<CSS_STYLE_VALUE>
[the] <OBJECT_TYPE> [with|and] style <CSS_STYLE_NAME>:"<CSS_STYLE_VALUE>"
[the] <OBJECT_TYPE> [with|and] style <CSS_STYLE_NAME>:'<CSS_STYLE_VALUE>'
```
### Examples
```sh
click the element with style height:400px 
click the element with style flex:"0 0 auto" 
click the element with style flex:'1 1 auto' 
```

## RELATIVE POSITION TO ANOTHER OBJECT
### Syntax
```sh
[the] <OBJECT_TYPE> [to the] [left of|right of] <ANOTHER_OBJECT_DESCRIPTION>
[the] <OBJECT_TYPE> [above|below|near|inside] <ANOTHER_OBJECT_DESCRIPTION>
```
### Examples
```sh
click the link left of the refresh button 
click the button below the home link 
```
