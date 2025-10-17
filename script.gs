const sheetName = 'Form Responses';
const scriptProp = PropertiesService.getScriptProperties();

function initialSetup() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName);
    const nextRow = sheet.getLastRow() + 1;
    const timestamp = new Date();
    const name = e.parameter.name;
    const email = e.parameter.email;
    const gender = e.parameter.gender;
    const phone = e.parameter.phone || 'Not provided';
    const imageUrl = e.parameter.image || 'No image uploaded';
    sheet.appendRow([timestamp, name, email, gender, phone, imageUrl]);

    // Email notification
    MailApp.sendEmail('YOUR_EMAIL_HERE', 'New Form Submission', 
      `Name: ${name}\nEmail: ${email}\nGender: ${gender}\nPhone: ${phone}\nImage URL: ${imageUrl}`);
    
    return ContentService.createTextOutput(JSON.stringify({ result: 'success', row: nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
