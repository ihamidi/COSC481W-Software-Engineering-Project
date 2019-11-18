function createAnnouncement(){
  var newAnnouncementDiv = document.getElementById("newAnnouncement");

  var announcement = document.createElement("div");

  var title = document.getElementById("title").value;
  var content = document.getElementById("content").value;
  var contentTitle = document.createElement('h3');
  var paragraph = document.createElement('pre');
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

  var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " - "
                + currentdate.getHours()%12 + ":"
                + minutes + " " + ampm;



  contentTitle.textContent = title;
  date.textContent = datetime;
  paragraph.textContent = content;

  announcement.appendChild(contentTitle);
  announcement.appendChild(date);
  announcement.appendChild(paragraph);

  var announcementHiddenInput = document.getElementById('hiddenAnnouncementInput');
  announcementHiddenInput.value = announcement.innerHTML;

  announcements.insertBefore(announcement, announcements.childNodes[0]);

  return true;
}
