function startRecord() {
  var rec = Recorder();
  rec.open(
    function() {
      rec.start();

      setTimeout(function() {
        rec.stop(
          function(blob, duration) {
            rec.close();

            uploadToS3(blob);
          },
          function(msg) {
            console.log('Failed recording:' + msg);
          }
        );
      }, 1000);
    },
    function(msg, isUserNotAllow) {
      console.log(
        (isUserNotAllow ? 'UserNotAllow，' : '') + 'Cannot record:' + msg
      );
    }
  );
}

function uploadToS3(blob) {
  var ID =
    new Date().getTime().toString() +
    Math.random()
      .toString(36)
      .substr(2, 9);
  var file = new File([blob], ID + '.mp3');
  console.log(file);
  var audio = document.createElement('audio');
  audio.controls = true;
  document.getElementById('speech').innerHTML = '';
  document.getElementById('speech').appendChild(audio);
  audio.src = URL.createObjectURL(file);

  let config = {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    }
  };
  axios
    .put(
      'https://o42g54ee0k.execute-api.us-east-1.amazonaws.com/v1',
      file,
      config
    )
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
}
