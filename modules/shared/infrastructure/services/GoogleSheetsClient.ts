import { env } from "@/config/env";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

/**
 * Thin wrapper around the Google Sheets v4 API.
 *
 * This is the only place that knows how to talk to Google. Use it from an
 * adapter (e.g. `GoogleSheetTransactionRepository`), never from a use case.
 */
class GoogleSheetsClient {
  private auth: GoogleAuth;
  private sheets: any;

  constructor() {
    this.auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      credentials: {
        client_id: env.googleClientId,
        client_email: env.googleClientEmail,
        private_key: env.googlePrivateKey,
      },
    });
    this.sheets = google.sheets({ version: "v4", auth: this.auth });
  }

  async getSheetsRange(sheetId: string, range: string) {
    return this.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
      valueRenderOption: "FORMATTED_VALUE",
    });
  }

  async updateSheetsRange<T>(sheetId: string, range: string, values: T[]) {
    return this.sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      valueInputOption: "USER_ENTERED",
      range: range,
      requestBody: {
        values: values,
      },
    });
  }

  async create(sheetId: string, range: string, values: any[]) {
    return this.sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });
  }

  /** Empties a range. Used to rewrite a whole block after removing a row. */
  async clearSheetsRange(sheetId: string, range: string) {
    return this.sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: range,
    });
  }
}

export default GoogleSheetsClient;
