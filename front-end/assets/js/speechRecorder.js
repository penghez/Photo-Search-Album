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
      }, 1500);
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
  var file = new File([blob], ID + '.mp3', {
    type: 'audio/mpeg'
  });
  console.log(file);
  var audio = document.createElement('audio');
  audio.controls = true;
  document.getElementById('speech').innerHTML = '';
  document.getElementById('speech').appendChild(audio);
  var recordbutton = `<button class="but2" onclick="uploadRecord()" id="sbutton" value=${ID +
    '.mp3'}>Get the result of Transcribe</button>`;
  document.getElementById('speechButton').innerHTML += recordbutton;
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
      'https://wda02irlt3.execute-api.us-east-1.amazonaws.com/test1/photo-search/' +
        ID +
        '.mp3',
      file,
      config
    )
    .then(response => {
      console.log('Send the sound file to S3!');
      var soundPath = 'https://s3.amazonaws.com/photo-search/' + ID + '.mp3';
      transcribeSound(soundPath);
    })
    .catch(error => {
      console.log(error);
    });
}

function transcribeSound(soundPath) {
  alert('Please wait for a minute...');
  axios
    .get(
      'https://o42g54ee0k.execute-api.us-east-1.amazonaws.com/v1/transcribe',
      {
        params: {
          sound: soundPath
        }
      }
    )
    .then(response => {
      console.log(response);

      alert('You are asking about ' + result);
      search(result);
    })
    .catch(error => console.log(error));
}

function uploadRecord() {
  var sound = $('#sbutton').val();

  axios
    .get(
      'https://o42g54ee0k.execute-api.us-east-1.amazonaws.com/v1/transcribe',
      {
        params: {
          rst: 'https://s3.amazonaws.com/photo-search/' + sound
        }
      }
    )
    .then(response => {
      console.log(response);
      var result = response.data.transcript;
      alert('You are asking about ' + result);
      search(result);
    })
    .catch(error => console.log(error));
}
