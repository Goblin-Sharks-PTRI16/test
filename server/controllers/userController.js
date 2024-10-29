const db = require("../models/goalAppModels");
const userController = {};

userController.getAllUsers = async (req, res, next) => {
  // console.log('redirect successful');
  try {
    const result = await db.query(`SELECT * FROM users;`);
    // console.log('result:', result.rows);
    res.locals.users = result.rows;
    return next();
  } catch (err) {
    const errorObj = {
      log: `userController.getAllUsers: ERRORS: ${err.message}`,
      message: {
        err: "userController.getAllUsers: ERROR: Failed to retrieve characters",
      },
    };
    return next(errorObj);
  }
};
userController.loginGoogle = async (req,res,next)=>{
  const {id:googleId, email:googleEmail, verified_email:verifiedEmail, name:name, given_name: givenName, family_name:familyName} = req.body.userInfo;
  try{
    const queryText = 'SELECT * FROM googleusers WHERE google_email = $1';
    const results = await db.query(queryText, [googleEmail]);

    
    if(results.rows.length===0){
      const insertText = "INSERT INTO googleusers (google_id, google_email, verified_email, name, given_name, family_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
      const insertResults = await db.query(insertText, [googleId, googleEmail, verifiedEmail, name, givenName, familyName]);
      res.locals.googleLogin = insertResults.rows[0];
    }
    else{
      const existingUser = results.rows[0];
      res.locals.googleLogin = existingUser;
      req.session.userId = existingUser;
    }
    return next();
  }
  catch(err){
    const errorObj = {
      log: `userController.googleLogin: ERRORS: ${err.message}`,
      message: {
        err: "userController.googleLogin: ERROR: Failed to login",
      },
    };
    return next(errorObj);
  }
  return next();
}
userController.login = async (req, res, next) => {
  const { id: userId, email: userEmail } = req.body.userInfo;
  // console.log('req.body', req.body.userInfo);
  // console.log('userController login was invoked');
  // console.log(`goodle id `, userId);
  const queryText = `SELECT * FROM users WHERE username = $1`;
  // console.log(queryText);
  try {
    const results = await db.query(queryText, [userId]);
    // console.log('results in login:',results)
    if (results.rows.length === 0) {
      const insertText =
        "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *";
      // const insertResults2 = await db.query()
      const insertResults = await db.query(insertText, [userId, userEmail]);
      res.locals.login = insertResults.rows[0];
      // console.log('insertResults', insertResults)
      // console.log(res.locals.login, "in login")
      // req.session.userId = insertResults.rows[0].id;
      //       console.log(`New user inserted and logged in:`, res.locals.login);
    } else {
      // User exists, handle login (you can return user data if needed)
      // User exists, handle login
      const existingUser = results.rows[0];
      //console.log('existing user',existingUser)
      // Store user info in res.locals for further use
      res.locals.login = existingUser;
      // console.log(res.locals.login, "in login")
      // Save the user's ID in the session
      req.session.userId = existingUser.username;
      //console.log('user session:', req.session);
      //console.log(`User logged in:`, res.locals.login);
      //console.log(`Session started for user ID: ${req.session.userId}`);
    }

    return next();
  } catch (err) {
    const errorObj = {
      log: `userController.login: ERRORS: ${err.message}`,
      message: {
        err: "userController.login: ERROR: Failed to login",
      },
    };
    return next(errorObj);
  }
};

userController.createUser = async (req, res, next) => {
  let existingUser = false;
  const { id: userId, email: userEmail } = req.body.userInfo;
   const queryText = `SELECT * FROM users WHERE username = $1`;
  try {
     const results = await db.query(queryText, [userId]);
     if (results.rows.length === 0) {
      const insertText =
        "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *";
      const insertResults = await db.query(insertText, [userId, userEmail]);
      console.log('Inserted REsults', insertResults.rows[0]);
      res.locals.login = insertResults.rows[0];
    } else {
       existingUser = true;
       console.log("Inserted Results",results.rows[0]);
       res.locals.login = results.rows[0]; 
       res.locals.existingUser = existingUser;
     }
      return next();
    
  } catch (err) {
    const errorObj = {
      log: `userController.createUser: ERRORS: ${err.message}`,
      message: {
        err: "userController.createUSer: ERROR: Failed to signup",
      },
    };
    return next(errorObj);
  }
};

module.exports = userController;
