// ThawRisk early-access sign-up handler
// Paste into Google Apps Script (Extensions → Apps Script), then:
//   Deploy → New deployment → Web app
//     Execute as: Me
//     Who has access: Anyone
//   Copy the Web App URL into roi-tool.html (SIGNUP_ENDPOINT constant)

const NOTIFY_EMAIL = 'erik@beaded.cloud';
const SHEET_NAME   = 'Sign-ups';

function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const email = (data.email || '').trim();
    const phone = (data.phone || '').trim();

    if (!email) {
      return jsonResponse({ ok: false, error: 'email required' });
    }

    appendRow(email, phone);
    sendNotification(email, phone);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function appendRow(email, phone) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Email', 'Phone']);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
  }

  sheet.appendRow([new Date(), email, phone]);
}

function sendNotification(email, phone) {
  const subject = 'ThawRisk sign-up: ' + email;
  const body    = [
    'New ThawRisk early-access request',
    '',
    'Email: ' + email,
    'Phone: ' + (phone || '(not provided)'),
    'Time:  ' + new Date().toLocaleString(),
  ].join('\n');

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
