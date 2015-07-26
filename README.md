ReDollar
========

A gesture recognizer in javascript .

---------------

This is a refactoring version of dollar.js (
<http://depts.washington.edu/aimgroup/proj/dollar/dollar.js> ), so named "Re"+"dollar".


Of course , ReDollar is more simple and more powerful.


---------------
#### Simple Example

```js
var dollarOne = new RD.DollarOne();

//  name: string, it's gesture's name
//  gesturePoints : 2D array, it's gesture's key-points
//      [ { 'x': x1, 'y': y1 }, { 'x': x2, 'y': y2 }, { 'x': x3, 'y': y3 }, ... { 'x': xN, 'y': yN } ]
dollarOne.addGesture(name, gesturePoints);


//  userPoints : 2D array, like "gesturePoints".
//       It's key-point of user's stroke-gesture
//  matched is mathed gesture or null (no matched)
var matched = dollarOne.recognize(userPoints);

```
