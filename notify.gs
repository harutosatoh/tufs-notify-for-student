function main() {
  
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadSheet.getActiveSheet();                

  //get cell from spreadsheet
  var cellA1 = sheet.getRange("A1");
  var cellA2 = sheet.getRange("A2");

  //save time to distinguish with the previous one 
  var previousTime = cellA1.getValue();
  var volumes = cellA2.getValue();
  
  var url = "http://www.tufs.ac.jp/student/"
  var html = UrlFetchApp.fetch('http://www.tufs.ac.jp/student/').getContentText();
  
  //using parse library
  var parser = Parser.data(html);
  var data = Parser.data(html).from('<div id="tab_all">').to('</div>').build();
  var dl = Parser.data(data).from('<dl>').to('</dl>').build();
  var listLinks = Parser.data(dl).from('<dd class="topics_list_link">').to('</dd>').iterate().toString();
  
  //remove html tags
  var titles =  listLinks.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
  var currentTime = Parser.data(dl).from('datetime="').to('">').build();
  
  if(previousTime !== '"' + currentTime + '"'){

    Logger.log("changes has been detected");
    //save the current time into cell
    cellA1.setValue('"' + time + '"');   
    volumes++;
    cellA2.setValue(volumes);  

    sendMail(titles, url);
   
  } else {
    Logger.log("no change has been detected");
  }
  
}

function sendMail(titles, url) {
 //send mail
  var contents = titles + url; 
  const recipient = 'xxxx@xxxxx.com'; //an address to which you want to send this mail
  const subject = '要チェックや';
  const body = contents;
  
  const options = {name: '在学生へのお知らせが更新されました。'};
  
  GmailApp.sendEmail(recipient, subject, body, options);
 
}

//gmailのフォーマットはやってないのでお好みでどうぞ。
