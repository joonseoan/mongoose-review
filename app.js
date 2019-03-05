const express = require('express');

// invoke express here and hence transform express into global objects. 
// Therefore, we can define and invoke every async app function in order of line.
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const { mongoKey } = require('./config/keys');

// Execute routes
const adminRouters = require('./routes/admin');
const shopRouters = require('./routes/shop'); 
const { pageNotFound } = require('./controllers/pageNotFound');

// mongoDB connect
// const { mongoConnect } = require('./utils/database');

const User = require('./models/user');

// Execute front-ends
app.set('view engine', 'ejs');
// app.set('views', 'views');

// the path that html can access
app.use(express.static(path.join(__dirname, 'public')));

// boty parser to get json format
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    User.findById('5c7ddbd4ae4d940e347f4662')
        .then(user => {
            req.user = user;
            console.log('User is successfully created.');
            next();
        })
        .catch(e => { throw new Error('Unable to find the user.'); });
});

// app.use((req, res, next) => {
    
//     User.fetchAll().then(users => {

//         if(users.length > 0) {
//             // In mongoDB, not mongoose, it must be intantiated.
//             // In mongoose, the find function always returs an instance.
                // Actually, it is overwring the existin user.
//             req.user = new User (users[0].username, users[0].email, users[0].cart, users[0]._id);

//             next();

//         } else {

//             const newUser = new User('joons', 'joon@joon.net');
//             newUser.save()
//                 .then(() => { 
//                     console.log('Joon is signed up!');
//                     return User.findById(newUser._id)
//                         .then(user => {
//                             req.user = new User (user.username, user.email);
//                         });
//                 })
//                 .then(() => {
//                     console.log('Joon successfully logged in!');
//                     next();
//                 })
//                 .catch(e => { throw new Error('Joon is not created.')});

//         }
//     });

// });

// routers
app.use('/admin', adminRouters);
app.use(shopRouters);

// Must be at the end of routes
//  when the client unables to find the routes 
//  because no route is specified.
app.use(pageNotFound);

// ---------------------------------------------------MongoDB Connectio  ---------------------------------------------------------
// mongoDB connect
// const { mongoConnect } = require('./utils/database');
// mongoConnect(() => {
//     console.log('Node is Up!!!');
//     app.listen(3000);
// });


// In mongoose, just use singe file connection. I will not use separate file conection as in mongo DB.
// mongoose.connec() must be same url as in mongo connect above
// 'must change test => shop!
mongoose.connect(`mongodb+srv://joon:${ mongoKey }@firstatlas-drwhc.mongodb.net/shop?retryWrites=true`, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB connected');

        User.find()
            .then(users => {
                if(users.length === 0) {
                    new User({
                        username: 'joon',
                        email: 'joon@gmail.com',
                        cart: {
                            items: []
                        }
                    }).save();
                }
            })
        app.listen(3000);
        console.log('Now Node is listening!!!');
    })
    .catch(e => { throw new Error('Unable to connect mongoDB.'); });
