function insertAgenda() {
    console.log(arguments);
}
$(function(){

    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "http://www.google.com/calendar/feeds/developer-calendar@google.com/public/full?alt=json-in-script&callback=insertAgenda&orderby=starttime&max-results=15&singleevents=true&sortorder=ascending&futureevents=true";
    $("head").append(s);
    alert('Calendar');
});