function doGet() {
  const email = Session.getActiveUser().getEmail();

  // Jika tak login (anonymous)
  if (!email) {
    return HtmlService.createHtmlOutputFromFile('login')
      .setTitle("Sila Log Masuk");
  }

  const domain = email.split('@')[1];
  const isGTR = domain === 'groundteamred.com';

  if (isGTR) {
    // Redirect ke GitHub Pages kalau authorized
    return HtmlService.createHtmlOutputFromFile('redirect');
  } else {
    return HtmlService.createHtmlOutputFromFile('unauthorized')
      .setTitle("Akses Ditolak");
  }
}
