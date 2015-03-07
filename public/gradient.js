
var colors = new Array(
  [251,222,255],
  [255, 105, 211],
  [255, 105, 211],
  [251,222,255],
  [255, 143, 222],
  [251,222,255]);

var hue = 0;
var hue_step = 1;
/*      background: linear-gradient(#ff73d6, #fbdeff);*/

var step = 0;
//color table indices for: 
// current color left
// next color left
// current color right
// next color right
var colorIndices = [0,1,2,3];

//transition speed
var gradientSpeed = 0.002;

function updateGradient() {
  
  if ( $===undefined ) return;
  
  var c0_0 = colors[colorIndices[0]];
  var c0_1 = colors[colorIndices[1]];
  var c1_0 = colors[colorIndices[2]];
  var c1_1 = colors[colorIndices[3]];

  var istep = 1 - step;
  var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
  var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
  var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
  var color1 = "rgb("+r1+","+g1+","+b1+")";

  var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
  var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
  var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
  var color2 = "rgb("+r2+","+g2+","+b2+")";

 $('body').css({
  background: '-webkit-linear-gradient('+color2+', '+color1+')', /* For Safari 5.1 to 6.0 */
  background: '-o-linear-gradient('+color2+', '+color1+')', /* For Opera 11.1 to 12.0 */
  background: '-moz-linear-gradient('+color2+', '+color1+')', /* For Firefox 3.6 to 15 */
  background: 'linear-gradient('+color2+', '+color1+')'});/* Standard syntax */

  
  step += gradientSpeed;
  if ( step >= 1 ) {
    step %= 1;
    colorIndices[0] = colorIndices[1];
    colorIndices[2] = colorIndices[3];
    
    //pick two new target color indices
    //do not pick the same as the current one
    colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
    colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
    
  }
}


function updateColor() {

  hue+=hue_step;
  if (hue >= 15 || hue <= -5) {
    hue_step *= -1;
  }

 $('svg').css({
    '-webkit-filter': 'hue-rotate('+hue+'deg)'
  });
}

setInterval(updateColor, 500);
setInterval(updateGradient,12);