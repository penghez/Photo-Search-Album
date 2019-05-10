$(function() {
  axios
    .get('https://o42g54ee0k.execute-api.us-east-1.amazonaws.com/v1', {
      params: {
        q: 'all'
      }
    })
    .then(response => {
      var respArr = JSON.parse(response.data.botresp.replace(/\'/g, '"'));
      console.log(respArr);

      if (respArr.length == 0) {
        alert('no result...');
      } else {
        $('.child').remove();
        for (var i = 0; i < respArr.length; i++) {
          addImage(respArr[i]);
        }
      }
    })
    .catch(error => {
      console.log(error);
    });
});

function onClick(element) {
  document.getElementById('img01').src = element.src;
  document.getElementById('modal01').style.display = 'block';
}

function upload() {
  var file = document.getElementById('upload_file').files[0];
  // console.log(file);
  var ID =
    new Date().getTime().toString() +
    Math.random()
      .toString(36)
      .substr(2, 9);
  let config = {
    headers: {
      'Content-Type': 'image/jpeg',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    }
  };
  axios
    .put(
      'https://wda02irlt3.execute-api.us-east-1.amazonaws.com/test1/photo-search/' +
        ID +
        '.jpg',
      file,
      config
    )
    .then(response => {
      console.log(response);
      addImage('https://s3.amazonaws.com/photo-search/' + ID + '.jpg');
    })
    .catch(error => {
      console.log(error);
    });

  // axios
  //   .put('https://o42g54ee0k.execute-api.us-east-1.amazonaws.com/v1', file, {
  //     headers: { 'Content-Type': 'image/jpeg' }
  //   })
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err));
}

function search(msg) {
  axios
    .get('https://o42g54ee0k.execute-api.us-east-1.amazonaws.com/v1', {
      params: {
        q: msg
      }
    })
    .then(response => {
      var respArr = JSON.parse(response.data.botresp.replace(/\'/g, '"'));
      console.log(respArr);

      if (respArr.length == 0) {
        alert('no result...');
      } else {
        $('.child').remove();
        for (var i = 0; i < respArr.length; i++) {
          addImage(respArr[i]);
        }
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function addImage(name) {
  var img = new Image();
  img.setAttribute('class', 'child');
  img.setAttribute('src', '' + name);
  img.setAttribute('onclick', 'onClick(this)');
  img.setAttribute('height', '80%');
  var chatArea = $('.chatBody');
  chatArea.append(img);
}

function sendMessage() {
  var msg = $('.msg').val();
  if (msg === '') {
    alert('please enter some thing!');
    return;
  }
  search(msg);
}

function enterPress(e) {
  var e = e || window.event;
  if (e.keyCode == 13) {
    sendMessage();
    $('.msg').val(null);
  }
}

function modalClick() {
  document.getElementById('modal01').style.display = 'none';
}
