const express = require('express');

// invoke express here and hence transform express into global objects. 
// Therefore, we can define and invoke every async app function in order of line.
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

// connection are up! *****************************************************************
const sequelize = require('./utils/database');

// Activate 'sequelize' models
// must run the models before 'sequelize.sync()' donw below. ********************
const User = require('./models/user');

// Execute routes
const adminRouters = require('./routes/admin');
const shopRouters = require('./routes/shop'); 
const { pageNotFound } = require('./controllers/pageNotFound');

// Execute front-ends
app.set('view engine', 'ejs');
// app.set('views', 'views');

// the path that html can access
app.use(express.static(path.join(__dirname, 'public')));

// boty parser to get json format
app.use(bodyParser.urlencoded({extended: false}));

// Must be spotted above routes because all the client requests *****
//      pass though this middleware
// Just temp because we do not have authentication so far. *****

// Eventually to gain req.user (logged in user) data/value 
//      whenever the client requests something even regardless of routes
app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        // user is an istance!!!!
        if(user) req.user = user;
        next();
    })
    .catch(e => { throw new Error('Unable to find the user.'); });
});

// excutes association!!!!
require('./models');

// routers
app.use('/admin', adminRouters);
app.use(shopRouters);

// Must be at the end of routes
//  when the client unables to find the routes 
//  because no route is specified.
app.use(pageNotFound);


// All the models up ************************************************************* 
//  and create their tables (if the tables do not exist) and relations; 

// { force: true } : DO NOT USE IT ALWAYS BTW. It will delete the current existing table
// Optional in development: when we need to overrite the data into database.
// Actually, it drops the existing tables, then create the table again, and insert into data again. 
/* 
    Executing (default): DROP TABLE IF EXISTS `products`;
    Executing (default): DROP TABLE IF EXISTS `users`;
    Executing (default): DROP TABLE IF EXISTS `users`;
    Executing (default): CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER NOT NULL auto_increment , `name` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
    Executing (default): SHOW INDEX FROM `users`
    Executing (default): DROP TABLE IF EXISTS `products`;
    Executing (default): CREATE TABLE IF NOT EXISTS `products` (`id` INTEGER NOT NULL auto_increment , `title` VARCHAR(255) NOT NULL, `price` DOUBLE PRECISION NOT NULL, `imageUrl` VARCHAR(255) NOT NULL, `description` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `userId` INTEGER, PRIMARY KEY (`id`), FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;
    Executing (default): SHOW INDEX FROM `products`

*/

// Until sequelize is done, 
//  the app does not listen to the client requiest. 
// sequelize.sync({ force: true })
sequelize.sync()

    // Eventually to gain req.user data we need to make and store dummy data in database
    //  whenever the server tries to connect to database
    //  and to make the tables are available (up!).
    // The table will create the first new user data automatically. 
    // By the way, squelelize.sync() is always invoked and run ahead of 
    //  app.use({ req.user = user}) up and above because it has app.listen()
    .then(() => {
                
        // finally after all models (tables) are created
        //      of course, and all the apps (express) correctly are up as well
        //  listen to requests form the client.
        return User.findByPk(1);

    })
    .then(user => {
        
        if(!user) return User.create({name: 'Max', email: 'test@test.com' });
        return user;

    }).then(user => {

        if(user) {

            /* 
            
                    { id: 1,
                    name: 'Max',
                    email: 'test@test.com',
                    updatedAt: 2019-02-23T03:54:59.524Z,
                    createdAt: 2019-02-23T03:54:59.524Z },
            
            */

            // console.log(user)

            // cart does not have a specific attributes except for id
            //  which is not necessary  for us to write paramters at createCart().
            
            // Insert userId into the cart table
            return user.createCart();

        }
    })
    .then(cart =>{

        if(cart) { 

            app.listen(3000, () => {
                console.log('Listening.');
            });

        }
    
    })
    .catch(e => {

        console.log(e);
        
    });