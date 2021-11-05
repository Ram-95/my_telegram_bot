var token = '<YOUR TELEGRAM TOKEN>';
var telegramURL =  'https://api.telegram.org/bot' + token;
var webAppURL = '<YOUR WEBAPP URL>';
var sheetID = '<YOUR SHEET ID>';

function getMe() {
  var url = telegramURL + '/getMe';
  var resp = UrlFetchApp.fetch(url);
  Logger.log(resp.getContentText());
}

function getUpdates() {
  var url = telegramURL + '/getUpdates';
  var resp = UrlFetchApp.fetch(url);
  Logger.log(resp.getContentText());
}

function setWebhook() {
  var url = telegramURL + '/setWebhook?url=' + webAppURL;
  var resp = UrlFetchApp.fetch(url);
  Logger.log(resp.getContentText());
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Hey there! " + JSON.stringify(e));
}

function sendText(id, text) {
  var sendTextURL = telegramURL + '/sendMessage?chat_id=' + id + '&text=' + text;
  var resp = UrlFetchApp.fetch(sendTextURL);
}


function getAllSheetNames() {
  var res = new Array();
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i=0; i< sheets.length; i++) {
    res.push('@' + sheets[i].getName());
  }
  return res;
}

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  // Sending email to ourselves
  //GmailApp.sendEmail(Session.getEffectiveUser().getEmail(), "Telegram Bot" , JSON.stringify(e, null, 4));
  var text = contents.message.text;
  var id = contents.message.from.id;
  var name = contents.message.from.first_name;
  var spreadSheet = SpreadsheetApp.openById(sheetID);
  
  
  // Creating new sheets inside the spreadsheet
  if(/^@/.test(text)) {
    var sheetName = text.slice(1).split(' ')[0];
    var newText = text.split(' ').slice(1).join(' ');
    var id = contents.message.from.id;
    var sheet = spreadSheet.getSheetByName(sheetName) ? spreadSheet.getSheetByName(sheetName) : spreadSheet.insertSheet(sheetName);
    sheet.appendRow([new Date(), id, name, newText]);
    sendText(id, '✅ Added successfully to: @' + sheetName + ' sheet.');
  }
  else {
    spreadSheet.appendRow([new Date(), id, name, text]);
    var allSheets = getAllSheetNames();
    sendText(id, 'Thanks for your message, ' + name + '! 👦');
    sendText(id, '📃 Your sheets are: ' + allSheets.join(', '));
  }
}

function updateSheet() {
  SpreadsheetApp.openById(sheetID).appendRow([10,20,30]);
}
