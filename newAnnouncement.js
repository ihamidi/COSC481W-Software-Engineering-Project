function newAnnouncement() {
  var newAnnouncementDiv = document.getElementById("newAnnouncement");
  var newAnnouncementButton = document.getElementById("newAnnouncementButton");
  var box = document.getElementById("announcementBox");
  var contentTitle = document.createElement('input');
  var contentTextbox = document.createElement('input');
  var createButton = document.createElement('button');
  var chooseFileButton = document.createElement('input');

  contentTitle.setAttribute("type", "text");
  contentTitle.setAttribute("id", "title");
  contentTitle.setAttribute("value", "Title");
  contentTitle.setAttribute("class", "col-sm");
  var contentTitleDiv = document.createElement('div');
  contentTitleDiv.setAttribute("class", "row");
  contentTitleDiv.appendChild(contentTitle);

  contentTextbox.setAttribute("type", "text");
  contentTextbox.setAttribute("id", "content");
  contentTextbox.setAttribute("value", "Enter Announcement");
  contentTextbox.setAttribute("class", "col-sm");
  var contentTextboxDiv = document.createElement('div');
  contentTextboxDiv.setAttribute("class", "row");
  contentTextboxDiv.appendChild(contentTextbox);

  chooseFileButton.setAttribute("type", "file");
  chooseFileButton.setAttribute("id", "myFile");
  chooseFileButton.setAttribute("class", "col-sm");
  var chooseFileButtonDiv = document.createElement('div');
  chooseFileButtonDiv.setAttribute("class", "row");
  chooseFileButtonDiv.appendChild(chooseFileButton);

  createButton.setAttribute("onclick", "createAnnouncement()");
  createButton.innerHTML = "Post";
  createButton.setAttribute("class", "col-sm");
  var createButtonDiv = document.createElement('div');
  createButtonDiv.setAttribute("class", "row");
  createButtonDiv.appendChild(createButton);






  box.appendChild(contentTitleDiv);
  box.appendChild(contentTextboxDiv);
  box.appendChild(chooseFileButtonDiv)
  box.appendChild(createButtonDiv);
;

  while(newAnnouncementDiv.firstChild)
    newAnnouncementDiv.removeChild(newAnnouncementDiv.firstChild);


//  announcementBoxChildren.setAttribute("action","/action_page.php");



}

function createAnnouncement(){
  var newAnnouncementDiv = document.getElementById("newAnnouncement");

  var announcement = document.createElement("div");

  var title = document.getElementById("title").value;
  var content = document.getElementById("content").value;
  var contentTitle = document.createElement('h3');
  var paragraph = document.createElement('p');
  var announcements = document.getElementById("currentAnnouncements");
  var announcementBox = document.getElementById("announcementBox");

  contentTitle.textContent = title;
  paragraph.textContent = content;


  announcement.appendChild(contentTitle);
  announcement.appendChild(paragraph);

  announcements.insertBefore(announcement, announcements.childNodes[0]);

  while(announcementBox.firstChild) {
    announcementBox.removeChild(announcementBox.firstChild);
  }

  var newAnnouncementButton = document.createElement("button");
  newAnnouncementButton.setAttribute("id", "newAnnouncementButton");
  newAnnouncementButton.setAttribute("onclick", "newAnnouncement()");
  newAnnouncementButton.innerHTML = "Create Announcement"

  newAnnouncementDiv.appendChild(newAnnouncementButton);

}
