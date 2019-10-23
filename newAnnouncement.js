function newAnnouncement() {
  var newAnnouncementDiv = document.getElementById("newAnnouncement");
  var newAnnouncementButton = document.getElementById("newAnnouncementButton");
  var box = document.getElementById("announcementBox");
  var contentTitle = document.createElement('input');
  var contentTextbox = document.createElement('input');
  var createButton = document.createElement('button');
  var chooseFileButton = document.createElement('input');

  // this long text is the HTML for the new announcement form.
  var announcementForm =
  "<div class=\"form-group\"><label for=\"title\">Title</label><input type=\"text\" class=\"form-control\" id=\"title\" placeholder=\"Enter Title\"></div><div class=\"form-group\"><label for=\"content\">Announcement</label><textarea class=\"form-control\" id=\"content\" placeholder=\"Enter Announcement\"></textarea></div><div class=\"form-group\"><label for=\"myFile\">Upload Photo</label><input type=\"file\" class=\"form-control-file\" id=\"myFile\"></div><input type=\"submit\" class=\"btn btn-primary\"></button>";
  newAnnouncementDiv.innerHTML = announcementForm;
;
}

function createAnnouncement(){
  var newAnnouncementDiv = document.getElementById("newAnnouncement");

  var announcement = document.createElement("div");

  var title = document.getElementById("title").value;
  var content = document.getElementById("content").value;
  var contentTitle = document.createElement('h3');
  var paragraph = document.createElement('p');
  var date = document.createElement('small');
  var announcements = document.getElementById("currentAnnouncements");
  var announcementBox = document.getElementById("announcementBox");
  var currentdate = new Date();

  var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours()%12 + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();



  contentTitle.textContent = title;
  date.textContent = datetime;
  paragraph.textContent = content;

  announcement.appendChild(contentTitle);
  announcement.appendChild(date);
  announcement.appendChild(paragraph);

  announcements.insertBefore(announcement, announcements.childNodes[0]);

  newAnnouncementDiv.innerHTML = "";
  var newAnnouncementButton = document.createElement("button");
  newAnnouncementButton.setAttribute("id", "newAnnouncementButton");
  newAnnouncementButton.setAttribute("onclick", "newAnnouncement()");
  newAnnouncementButton.innerHTML = "Create Announcement"

  newAnnouncementDiv.appendChild(newAnnouncementButton);
  return false;
}
