const config = {
  '/proxy/api/*': {
    target: 'https://indraedu.com:4201',
    secure: false,
    logLevel: 'debug',
    pathRewrite: { '^/api' : "https://indraedu.com:3001/api/" }
  }
};



