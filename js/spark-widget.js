(function(SparkForm, $, undefined) {
  SparkForm.submit = function(event) {
      event.preventDefault();
      var form = $('form').serializeArray();
      var name = form[0].value;
      var pin = form[1].value;
      var state = form[2].value;
      $('body').append(
        '<div class="row">'
        + '<div class="large-12 columns">'
        + '<a href="#" data-spark="send" data-spark-name="'+ name +'" data-spark-pin="'+ pin + '"data-spark-state="'+ state +'" class="button secondary small">Turn LED' + (state == "HIGH" ? " ON" : " OFF") +'</a>'
        + '</div>'
        + '</div>'
      )
      SparkCore.refreshToggleButtons();

  }
}(window.SparkForm = window.SparkForm || {}, jQuery));

(function(SparkCore, $, undefined) {
  var sparkCore;
  var accessToken;
  var name;
  var pin;
  var state;

  SparkCore.refreshToggleButtons = function() {
    SparkCore.toggleButtons = $('*[data-spark="send"]');
    SparkCore.bindButtonClick();
  }

  SparkCore.authenticate = function() {
      //Spark Login function defined in spark-browser-bundle;
      sparkLogin(function(err, data) {
        sparkCore = data;
        accessToken = sparkCore.access_token.toString();
        toggleLED(accessToken, name, pin, state);
      });
  }

  SparkCore.bindButtonClick = function() {
    SparkCore.toggleButtons.click(function(event) {
        event.preventDefault();
        name = $(this).attr("data-spark-name");
        pin = $(this).attr("data-spark-pin");
        state = $(this).attr("data-spark-state");
        toggleLED(accessToken, name, pin, state);
    });
  }
  function toggleLED(accessToken, name, pin, state) {
    if (sparkCore == undefined) {
      SparkCore.authenticate();
    }
    else {
      $.ajax({
        type: "POST",
        url: "https://api.spark.io/v1/devices/"+ name +"/digitalwrite",
        data: {
          access_token: accessToken,
          args: pin+","+state
        },
        success: function() {
          $("#login-form").hide();
          $(".jquery-modal.blocker").remove();
          alert("Your pin " + pin + " has been set to " + state);
        }
      });
    }
  };
}(window.SparkCore = window.SparkCore || {}, jQuery));

