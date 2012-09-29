$(function() {

  var startTime = null,
    runtimeInterval = null;
    
  $.getJSON("/status", function(response) {

      var data = response;
      $("#rooms").html(data.rooms);
      $("#players").html(data.players);
      startTime = data.startTime;
      runtimeInterval = setInterval(function() {
      
         var now = new Date().getTime(),
           runtime = now - startTime,
           days = Math.floor(runtime / 1000 / 60 / 60 / 24, 10),
           hours = Math.floor(runtime / 1000 / 60 / 60 % 24),
           minutes = Math.floor(runtime / 1000 / 60 % 60),
           seconds = Math.floor(runtime / 1000 % 60);

      $("#runtime").html(
        (days > 0 ? days + " days " : "") 
        + (hours > 0 ? hours + "h " : "" )
        + minutes + "min " + seconds + "s");
      }, 1000);
    
  
  }).error(function() {
      $("#rooms").html(0);
      $("#players").html(0);
      $("#runtime").html("Server is down at the moment");
  });
  
  $("#join").click(function() {
    
    localStorage.setItem("character", JSON.stringify({
      characterType: $("[name=type]:checked").val(),
      name: "herra huu",
    }));
    
    window.location = "game.html"
  });
  
  try {
    var c = JSON.parse(localStorage.getItem("character"));
    $("#type").val(c.characterType);
    $("#name").val(c.name);
  } catch (e) {
    console.info("no old credentials found");
  }

});
