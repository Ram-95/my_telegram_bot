var token = '<YOUR TELEGRAM TOKEN>';
var telegramURL =  'https://api.telegram.org/bot' + token;
var webAppURL = '<YOUR WEBAPP URL>';
var sheetID = '<YOUR SHEET ID>';
var QUOTE_URL = 'https://api.quotable.io/random';
var SO_URL = 'https://api.stackexchange.com/2.3/users/2773206?order=desc&sort=reputation&site=stackoverflow';

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


function fetchQuote() {
  var response = UrlFetchApp.fetch(QUOTE_URL);
  var data = JSON.parse(response.getContentText());
  var quote = data.content + ' - ' + data.author;
  Logger.log(quote);
  return quote
}

function getSOrating() {
  var response = UrlFetchApp.fetch(SO_URL);
  var totals = {'rep': 0, 'gold': 0, 'silver': 0, 'bronze': 0};
  var data =  JSON.parse(response.getContentText());
  totals.rep = data.items[0].reputation;
  totals.gold = data.items[0].badge_counts.gold;
  totals.silver = data.items[0].badge_counts.silver;
  totals.bronze = data.items[0].badge_counts.bronze;
  //var badges = '👑 Reputation: ' + rep + '\n\n🥇 Gold: ' + gold + '\n🥈 Silver: ' + silver + '\n🥉 Bronze: ' + bronze;
  Logger.log(totals);
  return totals;
}

function getAllSheetNames() {
  var res = new Array();
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i=0; i< sheets.length; i++) {
    res.push('@' + sheets[i].getName());
  }
  //Logger.log(res.join('\n'));
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
  
  if (/^\//.test(text)) {
    var command = text.slice(1).split(' ')[0];
    Logger.log(command);
    if(command=='quote') {
      var resp_quote = fetchQuote();
      sendText(id, '❔ ' + resp_quote);
    }
    else if(command=='so') {
      SO_resp = getSOrating();
      sendText(id, '👑 Reputation: ' + SO_resp.rep) 
      sendText(id, '🥇 Gold: ' + SO_resp.gold + ' 🥈 Silver: ' + SO_resp.silver + ' 🥉 Bronze: ' + SO_resp.bronze);
    }
    else {
      sendText(id, 'Unknown Command ❗');
    }
  }
  // Creating new sheets inside the spreadsheet
  else if(/^@/.test(text)) {
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
