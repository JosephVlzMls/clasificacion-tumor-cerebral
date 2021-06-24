import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';
import router from './index.router';

var app: Application = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/', router);

app.set('port', process.env.port || 3000);
app.listen(app.get('port'), () => {
	if(fs.existsSync('./public') == false) fs.mkdirSync('./public');
    console.log('server on port', app.get('port'));
});
