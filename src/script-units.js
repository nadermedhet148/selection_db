let loadDoc = function(id = "") {
  let xhttp = new XMLHttpRequest();
  xhttp.responseType = "blob";
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.response);
      let file = window.URL.createObjectURL(this.response);
      let a = document.createElement("a");
      a.href = file;
      a.download = this.response.name || id + "_1s";
      a.click();
    }
  };
  xhttp.open(
    "post",
    "http://1.33.1.150/segelat/OneSeenDocument/OneSeenData",
    true
  );
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("milNo=" + id);
};
let login = function(loadDoc, id) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.response);
      loadDoc(id);
    }
  };
  xhttp.open("post", "http://1.33.1.150/segelat/Home/Login", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(
    "UserName=10000053&Password=army53&__RequestVerificationToken=64vkrhqGkAgXsu-2dKTw_JcZ9yZN1mzgMt4U8T1PmlgRWehjcjXV-HbVXfjkN06-WLtkKYOFSQvKByilaN6JrDn3b5ooqZjiliqP7fcx9YQ1"
  );
};
// let myPost = "اعاتبكوا على ايه ";
// for (let i = 0; i < 9999; i++) {
//   myPost += "ولا ايه ";
// }
// Facebook.addPost(myPost);
