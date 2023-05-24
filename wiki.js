function wikiAPI() {
    var parentDiv = document.getElementById('wiki');
    removeResults(parentDiv);
    var searchTerm = document.getElementById('searchTerm').value;
    var connect = new XMLHttpRequest();
    var url = "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=20&gsrsearch=" + searchTerm;
  
    connect.open('GET', url);
  
    connect.onload = function () {
      var wikiObject = JSON.parse(this.response);
      console.log(wikiObject);
      console.log(wikiObject.query.pages);
      var pages = wikiObject.query.pages;
      for (i in pages) {

        var pageURL = "https://en.wikipedia.org/?curid="
        var newAnchor = document.createElement("a");
        newAnchor.href = pageURL+pages[i].pageid; //setAttribute('href', pageURL+pages[i].pageid);
        newAnchor.className = 'd-block'; //setAttribute('class', 'd-block');
        newAnchor.innerText = pages[i].title;
        console.log(newAnchor);
        document.getElementById("wiki").appendChild(newAnchor);
      };
  
    }
    connect.send();
  
  }
