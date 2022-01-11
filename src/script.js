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
let getToken = function(login, id = "") {
  let xhttp = new XMLHttpRequest(),
    token = "";
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("Got Token");
      let html = document.createElement("html");
      html.innerHTML = this.responseText;
      html.hidden = true;
      let token_inputs = html.getElementsByTagName("input");
      if (
        token_inputs["__RequestVerificationToken"] &&
        token_inputs["__RequestVerificationToken"].value
      ) {
        token = token_inputs["__RequestVerificationToken"].value;
        login(token, id);
      }
    }
  };
  xhttp.onerror = function(error) {
    console.log("Error");
    console.log(error);
  };
  xhttp.ontimeout = function(error) {
    console.log("Timeout");
    console.log(error);
  };
  xhttp.open("get", "http://1.33.1.150/segelat/Home/login/", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
};

getToken = function() {
  let xhttp = new XMLHttpRequest(),
    token = "";
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let html = document.createElement("html");
      html.innerHTML = that.responseText;
      console.log(that.responseText);
      html.hidden = true;
      let token_inputs = html.getElementsByTagName("input");
      console.log(token_inputs);
      if (
        token_inputs["__RequestVerificationToken"] &&
        token_inputs["__RequestVerificationToken"].value
      ) {
        token = token_inputs["__RequestVerificationToken"].value;
        console.log("Token:" + token);
      } else {
        console.log("Error, No Tokens.");
      }
    }
  };
  xhttp.onerror = function(error) {
    console.log("Error");
    console.log(error);
    that.showError("تعذر الإتصال بالشبكة العسكرية");
    that.pushError(that.result.items[index].unitText, "وحدة", [
      "تعذر تحميل معرف ارتباط الوحدة",
      error
    ]);
  };
  xhttp.ontimeout = function(error) {
    console.log("Timeout");
    console.log(error);
    that.showError(
      "تعذر الإتصال بالشبكة العسكرية, الرجاء التأكد من وجود ربط بالشبكة العسكرية."
    );
    that.pushError(that.result.items[index].unitText, "وحدة", [
      "تعذر تحميل معرف ارتباط الوحدة عشان الشبكة العسكرية فصلت",
      error
    ]);
  };
  xhttp.open("get", "http://1.33.1.150/segelat/Home/login/", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
};
