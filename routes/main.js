module.exports = function(app, shopData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });
    app.get('/search-result', function (req, res) {
        //searching in the database
        res.send("You searched for: " + req.query.keyword);
    });
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    });

    //login route
    app.get('/login',function(req,res){
        res.render("login.ejs", shopData);
    });
                                                                                                                                               
    //delete user route
     app.get('/deleteuser',function(req,res){
        res.render("deleteuser.ejs", shopData);                                                                                                

    });                                                                                                                                        

    //deleted
     app.post('/userdeleted', function(req, res) {
    let sqlquery = "DELETE FROM userdetails WHERE username = '" + req.body.username + "'";
        db.query(sqlquery, (err, result) => {
            if (err) {
                res,send('error', err)
                                                                                                                                               
            }
                                                                                                                                               
           result = 'User deleted: '  + req.body.username;
            res.send(result);                                                                                                                  
         });
                                                                                                                                               
    });                                                                                                                                           
                                                                                                                                               
    //loggedin 
     app.post('/loggedin', function(req, res) {
    const bcrypt = require('bcrypt');
     let sqlquery = "SELECT hashedPassword FROM userdetails WHERE username ='" + req.body.username + "'";
        db.query(sqlquery, (err, result) => {
            if (err) {
              res.redirect('./');
            }
     HashedPassword = result[0].hashedPassword;
     bcrypt.compare(req.body.password, HashedPassword, function(err, result){
            if(err) {
              res.send(err);                                                                                                                   
            }
             else if (result == true) {
             res.send("succesful login!");
            }
            else {
           res.send("Incorrect password, please try again!");
            }
         });                                                                                                                                   
                                                                            });
    });

    app.get('/listusers', function(req, res) {
     let sqlquery = "SELECT * FROM userdetails";  
     db.query(sqlquery, (err, result) => {
           if (err) {
              res.redirect('./');
           }
           let newData = Object.assign({}, shopData, {availableUserdetails:result});
           res.render("listusers.ejs", newData)
        });
     });

     app.post('/registered', function (req,res) {
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      const plainPassword = req.body.password;
                                                                                                                                               
      
      bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
         sqlquery = "INSERT INTO userdetails (firstname, lastname, email, username, hashedPassword) VALUES (?,?,?,?,?)";
         let newrecord = [req.body.first, req.body.last, req.body.email, req.body.username, hashedPassword];
         db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
         
                    return console.error(err, message);
         }
          else
  
             result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered! We will send an email to you at ' + req.body.email;                                                                                                                                            
             result += 'Your password is: '+ req.body.password +' your hashed password: '+ hashedPassword;
             res.send(result);                                                                                                                 
            });
         })
     });
      app.get('/addbook', function (req,res) {
        res.render('addbook.ejs', shopData);
    });

    app.get('/list', function(req, res) {
        let sqlquery = "SELECT * FROM books"; 
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            res.render("list.ejs", newData)
         });
    });
      app.get('/bargainbooks', function(req, res) {
        let sqlquery = "SELECT name, price FROM books WHERE price<20"; 
        
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            res.render("bargainbooks.ejs", newData)
         });
    });
                                                                                                                                                                                                                     
    app.post('/bookadded', function (req,res) {
          
          let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
          
          let newrecord = [req.body.name, req.body.price];
          db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
              return console.error(err.message);
            }
            else
            res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price);
            });
      });                                            


}
