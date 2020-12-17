var admin = require("firebase-admin");
var serviceAccount = require("./keynode.json");


class admin_fb {
  constructor() {
    this.admin = admin;
    this.admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://max301esp.firebaseio.com"
    });
  }
}
module.exports = admin_fb;
