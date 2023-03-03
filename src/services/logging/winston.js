const winston = require('winston');

require('winston-daily-rotate-file');

const pjson = require('../../../package.json');

const transport = new (winston.transports.DailyRotateFile)({
  filename: `${__dirname}/../../../logs/application-%DATE%.log`,
  datePattern: 'DD-MM-YYYY',
  zippedArchive: true,
  maxSize: '40m',
  maxFiles: '30d',
});

// timezone function winston calls to get timezone(ASIA/KOLKATA)

const timezoned = () => {
  let date = new Date();
  date = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  ); // TimeZoneOffset is done to get local time (ASIA/KOLKATA)
  return date.toISOString().replace(/[TZ]/g, ' ');
};

// options for logger object -- recent file
const options = {
  file: {
    level: 'debug',
    filename: `${__dirname}/../../../logs/recent/application.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 1,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const transports = {
  console: new winston.transports.Console(options.console),
  file: new winston.transports.File(options.file),
};

// logger object with above defined options
const logg = winston.createLogger({
  transports: [
    transports.file,
    transports.console,
    transport,
  ],
  format:
        winston.format.combine(
          winston.format.simple(),
          winston.format.timestamp({
            format: timezoned,
          }),
          winston.format.printf((info) => `${info.timestamp} [${pjson.name}] ${info.level}: ${info.message}`),
        ),
  exitOnError: false,
});

// writing file
logg.stream = {
  write(message) {
    logg.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

// update logging level. Can be implemented using api call
const updateLevel = (req, res, next) => {
  try {
    const newLevel = req.body.level;
    transports.file.level = newLevel;
    res.sendStatus(200);
    logg.info(`logger level updated to ${newLevel}`);
  } catch (e) {
    logg.error('failed to update logger level');
    next(e);
  }
};

// rollbar.log('Hello World, rollbar logging error logs')
module.exports = {
  logg,
  updateLevel,
};
