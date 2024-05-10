$(document).ready(function () {
  $('body').append('<div id="ec-bubble"><pre id="ec-bubble-text"></pre></div>');

  $(document).on('click', function () {
    hideBubble();
  });

  $('#ec-bubble').on('click', function (event) {
    event.stopPropagation();
  });

  $(document).on('dblclick', function (e) {
    processSelection(e);
  });

  $(document).on('mouseup', function (e) {
    processSelection(e);
  });
});

function processSelection(e) {
  let text = getSelectedText();

  if ($.isNumeric(text) && [10, 13].includes(text.length)) {
    if (text.length == 13) {
      text = text / 1000;
    }
    var date = timestampToDate(text);
    var localString = getLocalString(date);
    var relativeTime = relativeTimeDifference(text);
    showBubble(e, localString, getUTCString(date), relativeTime);
    // showBubble(e, date.getTime().toString(), date.toUTCString(), relativeTime);
  }
}

function getSelectedText() {
  var text = "";

  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type !== 'Control') {
    text = document.selection.createRange().text;
  }

  return text;
}

function timestampToDate(ts) {
  ts = ts.length === 13 ? parseInt(ts) : ts * 1000;
  return new Date(ts);
}

function getLocalString(date) {

  tz = date.getTimezoneOffset()
  // console.log("date: " + date + " tz : " + tz + " GMT : " + date.getUTCDate());
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} GMT${tz < 0 ? '+' : '-'}${pad((Math.floor(Math.abs(tz) / 60)))}:${pad(Math.abs(tz % 60))}`
}

function getUTCString(date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} GMT`
}

function pad(v) {
  return v.toString().padStart(2, '0')
}
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


function showBubble(e, localDateStr, utcDateStr, relativeTime) {
  $('#ec-bubble').css('top', e.pageY + 20 + "px");
  $('#ec-bubble').css('left', e.pageX - 85 + "px");
  $('#ec-bubble-text').html(utcDateStr + '<br/>' + localDateStr + '<br/>' + relativeTime);
  $('#ec-bubble').css('visibility', 'visible');
}

function hideBubble() {
  $('#ec-bubble').css('visibility', 'hidden');
  $('#ec-bubble-text').html('');
}
