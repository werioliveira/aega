if (!window.JSON) {
    // Polyfill JSON functions
  window.JSON = {
    parse: function(sJSON) { return eval('(' + sJSON + ')'); },
    stringify: (function () {
      var toString = Object.prototype.toString;
      var isArray = Array.isArray || function (a) { return toString.call(a) === '[object Array]'; };
      var escMap = {'"': '\\"', '\\': '\\\\', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t'};
      var escFunc = function (m) { return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1); };
      var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
      return function stringify(value) {
        if (value == null) {
          return 'null';
        } else if (typeof value === 'number') {
          return isFinite(value) ? value.toString() : 'null';
        } else if (typeof value === 'boolean') {
          return value.toString();
        } else if (typeof value === 'object') {
          if (typeof value.toJSON === 'function') {
            return stringify(value.toJSON());
          } else if (isArray(value)) {
            var res = '[';
            for (var i = 0; i < value.length; i++)
              res += (i ? ', ' : '') + stringify(value[i]);
            return res + ']';
          } else if (toString.call(value) === '[object Object]') {
            var tmp = [];
            for (var k in value) {
              if (value.hasOwnProperty(k))
                tmp.push(stringify(k) + ': ' + stringify(value[k]));
            }
            return '{' + tmp.join(', ') + '}';
          }
        }
        return '"' + value.toString().replace(escRE, escFunc) + '"';
      };
    })()
  };
}

function getTimeFormat(seconds, isGMT) {
    var d = (typeof seconds != "undefined" && seconds != null) ? new Date(seconds*1000) : new Date();

    // Recreate date if under GMT
    if(isGMT) {
        d = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),  d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
    }

    var h = d.getHours();
    if(h < 10)
        h = "0"+h;

    var m = d.getMinutes();
    if(m < 10)
        m = "0"+m;

    hour = h+":"+m;
    timezone = isGMT ? "" : "";

    return hour+" "+timezone;
}

function getTimeFormat2(seconds, isGMT) {
    var d = (typeof seconds != "undefined" && seconds != null) ? new Date(seconds*1000) : new Date();

    // Recreate date if under GMT
    if(isGMT) {
        d = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),  d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
    }

    var h = d.getHours();
    if(h < 10)
        h = "0"+h;

    var m = d.getMinutes();
    if(m < 10)
        m = "0"+m;

    hour = h+":"+m;
    timezone = isGMT ? "" : "";

    return hour+" "+timezone;
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function changeCookie(name, value) {
    document.cookie = name+"="+value+";path=/;expires=Fri, 31 Dec 9999 23:59:59 GMT;";
}

function updateTime(toggle) {
    // Do not toggle or have any effect if there's no clock being displayed
    var time = $("#timezone_changer").attr("data-time");
    var time2 = $("#timezone_changer2").attr("data-time");
    if(!time)
        return;

    var isGMT = readCookie("patchGMT");
    var currentGMTDisplay = (isGMT == "false") ? false : true;

    if(toggle) {
        currentGMTDisplay = !currentGMTDisplay;
        changeCookie("patchGMT", currentGMTDisplay);
    }

    $("#event_time").html(getTimeFormat(time, currentGMTDisplay) + '-' + getTimeFormat2(time2, currentGMTDisplay));
}

function loadDay(day) {
    $.ajax({
        url: "event/event&day="+day,
        method: "GET"
    }).done(function(reply) {
        try {
            reply = JSON.parse(reply);
            var $tzChanger = $("#timezone_changer");
            var $tzChanger2 = $("#timezone_changer2");
            var $evName = $("#event_name");

            if(reply.length > 0) {
                $tzChanger.attr("data-time", reply[0].timestamp + 10800);
                $tzChanger2.attr("data-time", reply[0].timestamp2 + 10800);
                $evName.html(reply[0].name);

                updateTime(false);
            } else {
                $tzChanger.attr("data-time", "");
                $evName.html("Event Yok");
                $("#event_time").html("-");
            }
        } catch (e) {
            // Welp, something went wrong.
            // No events that day, whatever...
        }
    });
}
function updateSelectedDay(){
	var $selectedDay = $(".day_isselected");
    var $this = $(this);

	if ($this.hasClass("day_isselected") == false){
		$selectedDay.toggleClass("day_isselectable", true);
		$selectedDay.toggleClass("day_isselected", false);
		$("#calendar_day_displayed").html($(this).html());
		$this.toggleClass("day_isselected", true);

        loadDay($this.html());
	}
}

function addHover() {
    $(this).addClass("hover");
}
function removeHover() {
    var $this = $(this);
    $this.removeClass("active");
    $this.removeClass("hover");
}
function addActive(){
    var $this = $(this);
    $this.removeClass("hover");
    $this.addClass("active");
}
function removeActive(){
    var $this = $(this);
    if ($this.mouseover()){
        $this.removeClass("active");
        $this.addClass("hover");
    }
    else {$this.removeClass("active");}
}

$(function() {
    // Hacks for adding mouseover/active to IE6
    $("#youtube, #facebook, #timezone_changer").on("mouseover", addHover);
    $("#youtube, #facebook, #timezone_changer").on("mouseout", removeHover);
    $("#youtube, #facebook, #timezone_changer").on("mousedown", addActive);
    $("#youtube, #facebook, #timezone_changer").on("mouseup", removeActive);

        updateTime(true);
    $(".day_isselectable, .day_haseventscheduled").on("click", updateSelectedDay);

    updateTime(false);
    loadDay($(".day_isselected").html());
}); // On body load
