const inquirer = require("inquirer");
const Realm = require("realm");
const index = require("./index");
const config = require("./config");
const main = require("./main");
const output = require("./output");
const projects = require("./projects");
const { ProjectSchema } = require("./schemas");

const REALM_APP_ID = config.realmAppId;
const appConfig = {
  id: REALM_APP_ID,
  timeout: 10000,
};

const app = new Realm.App(appConfig);

async function logIn() {
  const input = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Email:",
    },
    {
      type: "password",
      name: "password",
      message: "Password:",
      mask: "*",
    },
  ]);

  try {
     // TODO: create new emailPassword credentials and assign it to ``credentials``
    const credentials;

     // TODO: call the app.logIn() method and assign its value to ``user``
    const user; 

    if (user) {
      output.result("You have successfully logged in as " + app.currentUser.id);
      return main.mainMenu();
    } else {
      output.error("There was an error logging you in");
      return logIn();
    }
  } catch (err) {
    output.error(JSON.stringify(err, null, 2));
    return logIn();
  }
}

async function registerUser() {
  output.header("WELCOME, NEW USER");
  const input = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Email:",
    },
    {
      type: "password",
      name: "password",
      message: "Password:",
      mask: "*",
    },
  ]);

  try {
    const result = await app.emailPasswordAuth.registerUser(
      input.email,
      input.password
    );
    const credentials = Realm.Credentials.emailPassword(
      input.email,
      input.password
    );
    const user = await app.logIn(credentials);
    if (user) {
      output.result(
        "You have successfully created a new Realm user and are now logged in."
      );
      return main.mainMenu();
    } else {
      output.error("There was an error registering the new user account.");
      return registerUser();
    }
  } catch (err) {
    output.error(JSON.stringify(err, null, 2));
    return registerUser();
  }
}

async function logOut() {
  user = app.currentUser;
  await user.logOut();
  await index.closeRealm();
  return !user.isLoggedIn;
}

function getAuthedUser() {
  return app.currentUser;
}


exports.getAuthedUser = getAuthedUser;
exports.logIn = logIn;
exports.logOut = logOut;
exports.registerUser = registerUser;

