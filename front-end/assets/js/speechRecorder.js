function startRecord() {
  var rec = Recorder();
  rec.open(
    function() {
      rec.start();

      setTimeout(function() {
        rec.stop(
          function(blob, duration) {
            // console.log(
            //   URL.createObjectURL(blob),
            //   'Duration:' + duration + 'ms'
            // );
            console.log(blob);
            rec.close();

            uploadToS3(blob);
            // var audio = document.createElement('audio');
            // audio.controls = true;
            // document.body.appendChild(audio);
            // audio.src = URL.createObjectURL(blob);
            // audio.play();
          },
          function(msg) {
            console.log('Failed recording:' + msg);
          }
        );
      }, 3000);
    },
    function(msg, isUserNotAllow) {
      console.log(
        (isUserNotAllow ? 'UserNotAllow，' : '') + 'Cannot record:' + msg
      );
    }
  );
}

function uploadToS3(blob) {
  const formData = new FormData();
  formData.append('file', blob, 'speech.mp3');
  axios({
    method: 'post',
    url: 'https://qi0iw785k2.execute-api.us-east-2.amazonaws.com/v1/',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
}
