const express = require('express');
const morgan = require('morgan');
const swaggerTools = require('swagger-tools');
const yaml = require('js-yaml');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

app.use(bodyParser.json({ extended: true }));

//settings 
app.set('port', process.env.PORT || 3001);
app.set('json spaces', 2);

app.disable('etag');

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpecs))

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

//routes
app.use(require('./routes/login'));
app.use(require('./routes/register'));
app.use(require('./routes/error/login'));
app.use(require('./routes/error/register'));
app.use(require('./routes/admin/dashboard'));
app.use(require('./routes/buyer/dashboard'));
app.use(require('./routes/seller/dashboard'));
app.use(require('./routes/nouser/dashboard'));

//starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});