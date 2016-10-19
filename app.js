import express      from 'express';
import path         from 'path';
import logger       from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser   from 'body-parser';

import indexRoute from './routes/index.route';
import TodoRoute  from './routes/todo.route';

let app = express();

//-  VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

//-  ROUTING
const API_VERSION = '1.0';
app.use('/', indexRoute);
app.use(`/api/${API_VERSION}/todo`, TodoRoute);

//-  catch 404 and forward to error handler
app.use((req, res, next)  => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//-  ERROR HANDLERS
//-  development error handler
//-  will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//-  production error handler
//-  no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

export default app;
