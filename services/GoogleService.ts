import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';
import path from 'path';

class GoogleService {
  private auth: GoogleAuth;
  private sheets: any;

  constructor() {
    const keyPath = path.join(process.cwd(), "finance-logs-google.json");
    this.auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      keyFilename: keyPath
    });
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async getSheetsRange(sheetId:string, range:string) {
    return this.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
      valueRenderOption: "FORMATTED_VALUE"
    });
  }



  async updateSheetsRange<T>(sheetId:string, range:string, values:T[]) {
    return this.sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: range,
      requestBody: {
        values: values
      }
    });
  }
}

export default GoogleService;