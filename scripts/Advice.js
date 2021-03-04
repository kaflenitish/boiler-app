function advicePage() {
    if (localStorage.getItem('tbRecords') === null) {
        alert('No records exist.');

        $(location).attr('href', '#pageMenu');
    } else {
        var user = JSON.parse(localStorage.getItem('user'));
        var MAXPress = user.MaxPressure;
        var MAXTemperature = user.MAXTemperature;

        var tbRecords = JSON.parse(localStorage.getItem('tbRecords'));
        tbRecords.sort(compareDates);
        var i = tbRecords.length - 1;
        var Pressure = tbRecords[i].Pressure;
        var Temperature = tbRecords[i].Temperature;

        var c = document.getElementById('AdviceCanvas');
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(0, 0, 550, 550);
        ctx.font = '22px Arial';
        drawAdviceCanvas(ctx, MAXPress, Pressure);

        var d = document.getElementById('AdviceCanvasT');
        var ctx = d.getContext('2d');
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(0, 0, 550, 550);
        ctx.font = '22px Arial';
        drawAdviceCanvasT(ctx, MAXTemperature, Temperature);
    }
}

function drawAdviceCanvas(ctx, MAXPress, Pressure) {
    ctx.font = '22px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Your current Pressure is ' + Pressure + '.', 25, 320);

    ctx.fillText('Your target Pressure range is: 12 and 28 psi.', 25, 350);
    levelAwrite(ctx, Pressure);
    levelAMeter(ctx, Pressure);
}

function drawAdviceCanvasT(ctx, MAXTemperature, Temperature) {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(
        'Your current water Temperature is ' + Temperature + '.',
        25,
        320
    );

    ctx.fillText(
        'Your target water Temperature range is: 0 and 185 degrees.',
        20,
        350
    );
    levelAwriteT(ctx, Temperature);
    levelAMeterT(ctx, Temperature);
}

//For deciding what to write for given values of pressure and temperature
function levelAwrite(ctx, Pressure) {
    if (Pressure >= 12 && Pressure <= 27) {
        writeAdvice(ctx, 'green');
    } else if (Pressure > 28 && Pressure <= 29) {
        writeAdvice(ctx, 'yellow');
    } else {
        writeAdvice(ctx, 'red');
    }
}

function levelAwriteT(ctx, Temperature) {
    if (Temperature >= 0 && Temperature <= 185) {
        writeAdviceT(ctx, 'green');
    } else if (Temperature > 186 && Temperature <= 190) {
        writeAdviceT(ctx, 'yellow');
    } else {
        writeAdviceT(ctx, 'red');
    }
}

function writeAdvice(ctx, level) {
    var adviceLine1 = '';
    var adviceLine2 = '';

    if (level == 'red') {
        adviceLine1 = 'Please turn the boiler OFF and consult an';
        adviceLine2 = 'authorized repair facility immediately.';
    } else if (level == 'yellow') {
        adviceLine1 = 'Check temperature and recheck pressure';
        adviceLine2 = 'in 20-30 minutes.';
    } else if (level == 'green') {
        adviceLine1 = 'Recheck next week.';
    }
    ctx.fillText('Your Pressure-level is ' + level + '.', 25, 380);
    ctx.fillText(adviceLine1, 25, 410);
    ctx.fillText(adviceLine2, 25, 440);
}

function writeAdviceT(ctx, level) {
    var adviceLine1 = '';
    var adviceLine2 = '';

    if (level == 'red') {
        adviceLine1 = 'Please turn the boiler OFF and consult an';
        adviceLine2 = 'authorized repair facility immediately.';
    } else if (level == 'yellow') {
        adviceLine1 = 'Check temperature setting and recheck';
        adviceLine2 = 'in 20-30 minutes.';
    } else if (level == 'green') {
        adviceLine1 = 'Recheck next week.';
    }
    ctx.fillText('Your Temperature-level is ' + level + '.', 25, 380);
    ctx.fillText(adviceLine1, 25, 410);
    ctx.fillText(adviceLine2, 25, 440);
}

function levelAMeter(ctx, Pressure) {
    if (Pressure <= 30) {
        var cg = new RGraph.CornerGauge('AdviceCanvas', 0, 30, Pressure).Set(
            'chart.colors.ranges', [
                [30, 33, 'red'],
                [28, 29, 'yellow'],
                [12, 27, '#0f0']
            ]
        );
    } else {
        var cg = new RGraph.CornerGauge('AdviceCanvas', 0, Pressure, Pressure).Set(
            'chart.colors.ranges', [
                [30, 33, 'red'],
                [28, 29, 'yellow'],
                [12, 27, '#0f0'],
                [30, Pressure, 'red']
            ]
        );
    }
    drawMeter(cg);
}

function levelAMeterT(ctx, Temperature) {
    if (Temperature <= 190) {
        var cg = new RGraph.CornerGauge('AdviceCanvasT', 0, 250, Temperature).Set(
            'chart.colors.ranges', [
                [191, 250, 'red'],
                [180, 190, 'yellow'],
                [0, 179, '#0f0']
            ]
        );
    } else {
        var cg = new RGraph.CornerGauge(
            'AdviceCanvasT',
            0,
            Temperature,
            Temperature
        ).Set('chart.colors.ranges', [
            [191, 250, 'red'],
            [180, 190, 'yellow'],
            [0, 179, '#0f0'],
            [191, Temperature, 'red']
        ]);
    }
    drawMeterT(cg);
}

// Meter properties
function drawMeter(g) {
    g.Set('chart.value.text.units.post', ' psi')
        .Set('chart.value.text.boxed', false)
        .Set('chart.value.text.size', 14)
        .Set('chart.value.text.font', 'Verdana')
        .Set('chart.value.text.bold', true)
        .Set('chart.value.text.decimals', 2)
        .Set('chart.shadow.offsetx', 5)
        .Set('chart.shadow.offsety', 5)
        .Set('chart.scale.decimals', 2)
        .Set('chart.title', 'Pressure Range')
        .Set('chart.radius', 250)
        .Set('chart.centerx', 50)
        .Set('chart.centery', 250)
        .Draw();
}

function drawMeterT(g) {
    g.Set('chart.value.text.units.post', ' degrees')
        .Set('chart.value.text.boxed', false)
        .Set('chart.value.text.size', 14)
        .Set('chart.value.text.font', 'Verdana')
        .Set('chart.value.text.bold', true)
        .Set('chart.value.text.decimals', 0)
        .Set('chart.shadow.offsetx', 5)
        .Set('chart.shadow.offsety', 5)
        .Set('chart.scale.decimals', 1)
        .Set('chart.title', 'Temperature Range')
        .Set('chart.radius', 250)
        .Set('chart.centerx', 50)
        .Set('chart.centery', 250)
        .Draw();
}