$(document).ready(function () {
    var epochCounter;
    var unixTime;
    var currentEpoch = document.getElementById('current-epoch');
    var clockStopped = document.getElementById('clock-stopped');

    $('#human-time-input').datetimepicker({
        inline: true,
        hourGrid: 0,
        dropdown: true,
        changeMonth: true,
        changeYear: true,
        showSecond: true
    });

    currentEpoch.innerHTML = Math.round(new Date().getTime() / 1000);
    startInterval();

    function startInterval() {
        console.log('start');
        epochCounter = setInterval(function () {
            unixTime = Math.round(new Date().getTime() / 1000);
            document.getElementById('current-epoch').innerHTML = unixTime;
        }, 1000);
    }

    function stopInterval() {
        clearInterval(epochCounter);
    }

    var toHuman = document.getElementById('convert-to-human');
    var toTimestamp = document.getElementById('convert-to-timestamp');

    currentEpoch.onmouseover = function () {
        clockStopped.innerHTML = '[stopped]';
        currentEpoch.style.backgroundColor = '#D6D6F8';
        stopInterval();
    }

    currentEpoch.onmouseout = function () {
        clockStopped.innerHTML = '';
        currentEpoch.style.backgroundColor = 'rgb(234, 234, 250)';
        startInterval();
    }

    toHuman.onmouseover = function () {
        toHuman.style.cursor = 'pointer';
    }

    toHuman.onmouseout = function () {
        toHuman.style.cursor = 'default';
    }

    toTimestamp.onmouseover = function () {
        toTimestamp.style.cursor = 'pointer';
    }

    toTimestamp.onmouseout = function () {
        toTimestamp.style.cursor = 'default';
    }

    toHuman.onclick = function () {
        var textInput = document.getElementById('unix-time-input').value;
        if (textInput.length == 13) {
            textInput = textInput / 1000;
        };
        var localTime = new Date(textInput * 1000);
        document.getElementById('human-output-gmt').innerHTML = localTime.toUTCString();
        document.getElementById('human-output-local').innerHTML = localTime;
        document.getElementById('relative-time').innerHTML = relativeTimeDifference(textInput);
        document.getElementById('human-date-output-section').style.display = '';
    }

    toTimestamp.onclick = function () {
        var textInput = document.getElementById('human-time-input').value;
        var unixTime = Date.parse(textInput) / 1000;
        //console.log(textInput);
        console.log(unixTime);
        document.getElementById('unix-time-output').innerHTML = unixTime;
        document.getElementById('unix-date-output-section').style.display = '';
    }
});


function relativeTimeDifference(previous) {
    const currentEpochTime = Math.floor(new Date().getTime() / 1000);
    const msPerMinute = 60;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = currentEpochTime - previous;
    const isFuture = elapsed < 0;

    const absoluteElapsed = Math.abs(elapsed);

    if (absoluteElapsed < msPerMinute) {
        return isFuture
            ? Math.round(absoluteElapsed / 1000) + ' seconds from now'
            : Math.round(absoluteElapsed / 1000) + ' seconds ago';
    } else if (absoluteElapsed < msPerHour) {
        return isFuture
            ? Math.round(absoluteElapsed / msPerMinute) + ' minutes from now'
            : Math.round(absoluteElapsed / msPerMinute) + ' minutes ago';
    } else if (absoluteElapsed < msPerDay) {
        return isFuture
            ? Math.round(absoluteElapsed / msPerHour) + ' hours from now'
            : Math.round(absoluteElapsed / msPerHour) + ' hours ago';
    } else if (absoluteElapsed < msPerMonth) {
        return isFuture
            ? 'approximately ' + Math.round(absoluteElapsed / msPerDay) + ' days from now'
            : 'approximately ' + Math.round(absoluteElapsed / msPerDay) + ' days ago';
    } else if (absoluteElapsed < msPerYear) {
        return isFuture
            ? 'approximately ' + Math.round(absoluteElapsed / msPerMonth) + ' months from now'
            : 'approximately ' + Math.round(absoluteElapsed / msPerMonth) + ' months ago';
    } else {
        return isFuture
            ? 'approximately ' + Math.round(absoluteElapsed / msPerYear) + ' years from now'
            : 'approximately ' + Math.round(absoluteElapsed / msPerYear) + ' years ago';
    }
}