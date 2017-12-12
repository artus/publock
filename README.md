# Publock
## A quick and dirty blockchain implementation that uses keys to authenticate owners of specific pseudonyms.

This is a project created to play around with a blockchain that stores messages tied to specific pseudonyms by using keypairs.

```javascript
import NodeRSA = require('node-rsa');

let p1 = new Publock();
let p2 = new Publock();
let p3 = new Publock();

p2.joinPublockNetworkFrom(p1);
p3.joinPublockNetworkFrom(p1);

let firstKey = new NodeRSA({b: 512});
let secondKey = new NodeRSA({b: 512});

// This message will be added and because this is the first time "MyPseudonym" is used, the pseudonym will be tied to the supplied key
let firstMessage = p1.addNewMessage("MyPseudonym", "This is a message.", "", firstKey);

// This message will not be added because the "MyPseudonym" is used but an incorrect key is supplied
let secondMessage = p1.addNewMessage("MyPseudonym", "This is also a message.", "", secondKey);

// This message will be added because the supplied key is correct
let thirdMessage = p2.addNewMessage("MyPseudonym", "This is a third message.", "", firstKey);
```

For now the blockchain resides solely in the current session, there is no possibility to connect to other remote `publocks`. This is because, sadly, webrtc was giving me troubles.

## Build the sources

You can easily compile the sources by using the supplied `build_test.sh` script, which will compile the TypeScript files using `tsc`, create a `bundle.js` with `browserify` and runs tests.

```
./build_test.sh
```

## Creating publock instances in the browser

First, make sure you include the `bundle.js` in your html code.
```html
<!DOCTYPE html>
<html>
    <head>
        <title>Publock in browser</title>
    </head>
    
    <body>
        <!-- Your content here -->
        
        <script src="bundle.js"></script>
        <script>
            
            var p1 = new publock_module.Publock();
            var p2 = new publock_module.Publock();
            var p3 = new publock_module.Publock();
            
            p2.joinPublockNetworkFrom(p1);
            p3.joinPublockNetworkFrom(p2);
            
        </script>
    <body>
</html>
```