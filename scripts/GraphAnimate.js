function drawGraph() {
  if (localStorage.getItem('tbRecords') === null) {
    alert('No records exist.');

    $(location).attr('href', '#pageMenu');
  } else {
    setupCanvas();

    var PRSarr = new Array();
    var TEMParr = new Array();
    var Datearr = new Array();
    getPRShistory(PRSarr, Datearr, TEMParr);

    var prsLower = new Array(2);
    var prsUpper = new Array(2);
    var tempLower = new Array(2);
    var tempUpper = new Array(2);
    getPRSbounds(prsLower, prsUpper, tempLower, tempUpper);

    drawLinesPRS(PRSarr, prsUpper, prsLower, Datearr);
    labelAxesPRS();
    drawLinesTEMP(TEMParr, tempUpper, tempLower, Datearr);
    labelAxesTEMP();
  }
}

function setupCanvas() {
  var c = document.getElementById('GraphCanvas');
  var ctx = c.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 500, 500);
}

function getPRShistory(PRSarr, Datearr, TEMParr) {
  var tbRecords = JSON.parse(localStorage.getItem('tbRecords'));

  tbRecords.sort(compareDates);

  for (var i = 0; i < tbRecords.length; i++) {
    var date = new Date(tbRecords[i].Date);

    /*These methods start at 0, must increment
     * by one to compensate
     */
    var m = date.getMonth() + 1;
    var d = date.getDate() + 1;

    //The x-axis label
    Datearr[i] = m + '/' + d;

    //The point to plot
    PRSarr[i] = parseFloat(tbRecords[i].Pressure);
    TEMParr[i] = parseFloat(tbRecords[i].Temperature);
  }
}

function getPRSbounds(prsLower, prsUpper, tempLower, tempUpper) {
  //Get MaxPressure
  var user = JSON.parse(localStorage.getItem('user'));
  var PRSLevel = user.MaxPressure;
  var TEMPLevel = user.MaxTemperature;

  /*These lines show upper and lower bounds
   * of acceptable Pressure levels
   *
   */

  prsUpper[0] = prsUpper[1] = 30;
  prsLower[0] = prsLower[1] = 10;
  tempUpper[0] = tempUpper[1] = 190;
  tempLower[0] = tempLower[1] = 25;
}

function drawLinesPRS(PRSarr, prsUpper, prsLower, Datearr) {
  var PRSline = new RGraph.Line('GraphCanvas', PRSarr, prsUpper, prsLower)
    .Set('labels', Datearr)
    .Set('colors', ['blue', 'red', 'green'])
    .Set('shadow', true)
    .Set('shadow.offsetx', 1)
    .Set('shadow.offsety', 1)
    .Set('linewidth', 1)
    .Set('numxticks', 6)
    .Set('scale.decimals', 2)
    .Set('xaxispos', 'bottom')
    .Set('gutter.left', 40)
    .Set('tickmarks', 'filledcircle')
    .Set('ticksize', 5)
    .Set('chart.labels.ingraph', [, , ['Pressure', 'blue', 'yellow', 1, 80], ,])
    .Set('chart.title', 'Pressure')
    .Draw();
}

function drawLinesTEMP(TEMParr, tempUpper, tempLower, Datearr) {
  var TEMPline = new RGraph.Line('GraphCanvasT', TEMParr, tempUpper, tempLower)
    .Set('labels', Datearr)
    .Set('colors', ['purple', 'red', 'green'])
    .Set('shadow', true)
    .Set('shadow.offsetx', 1)
    .Set('shadow.offsety', 1)
    .Set('linewidth', 1)
    .Set('numxticks', 6)
    .Set('scale.decimals', 1)
    .Set('xaxispos', 'bottom')
    .Set('gutter.left', 40)
    .Set('tickmarks', 'filledcircle')
    .Set('ticksize', 5)
    .Set('chart.labels.ingraph', [
      ,
      ,
      ['Temperature', 'blue', 'yellow', 1, 80],
      ,
    ])
    .Set('chart.title', 'Temperature')
    .Draw();
}

function labelAxesPRS() {
  var c = document.getElementById('GraphCanvas');
  var ctx = c.getContext('2d');
  ctx.font = '11px Georgia';
  ctx.fillStyle = 'green';
  ctx.fillText('Date(MM/DD)', 400, 470);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Pressure Value', -250, 10);
}

function labelAxesTEMP() {
  var c = document.getElementById('GraphCanvasT');
  var ctx = c.getContext('2d');
  ctx.font = '11px Georgia';
  ctx.fillStyle = 'green';
  ctx.fillText('Date(MM/DD)', 400, 470);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Temperature', -250, 10);
}
