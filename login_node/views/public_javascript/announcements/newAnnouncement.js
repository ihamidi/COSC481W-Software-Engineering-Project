function createAnnouncement(){
  var newAnnouncementDiv = document.getElementById("newAnnouncement");

  var announcement = document.createElement("div");

  var title = document.getElementById("title").value;
  var content = document.getElementById("content").value;
  var contentTitle = document.createElement('h2');
  var paragraph = document.createElement('p');
  var date = document.createElement('small');
  var announcements = document.getElementById("currentAnnouncements");
  var announcementBox = document.getElementById("announcementBox");
  var currentdate = new Date();
  var minutes = currentdate.getMinutes();


  if (currentdate.getHours() >= 12) {
    var ampm = "PM";
  }
  else {
    var ampm = "AM";
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  var datetime = (currentdate.getMonth()+1) + "/"
                + currentdate.getDate()  + "/"
                + currentdate.getFullYear() + " - "
                + currentdate.getHours()%12 + ":"
                + minutes + " " + ampm;


  contentTitle.setAttribute("class", "bits-text");
  date.setAttribute("class", "bits-text");
  paragraph.setAttribute("class", "bits-text");
//  paragraph.setAttribute("style", "white-space: pre")

  contentTitle.textContent = title;
  date.textContent = datetime;
  paragraph.textContent = content;
  paragraph.innerHTML = paragraph.innerHTML.replace(/\n/g,'<br>\n');

  announcement.appendChild(contentTitle);
  announcement.appendChild(date);
  announcement.appendChild(paragraph);

  var announcementHiddenInput = document.getElementById('hiddenAnnouncementInput');
  announcementHiddenInput.value = announcement.innerHTML;
  while (announcements.firstChild) {
    announcements.removeChild(announcements.firstChild);
  }
  announcements.insertBefore(announcement, announcements.childNodes[0]);

  return true;
}
