const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  // This is just a development proxy setup
  // The important part is the build-time step below
};

// Copy _redirects file during build
if (process.env.NODE_ENV === 'production') {
  const redirectsContent = '/* /index.html 200';
  const publicDir = path.join(__dirname, '..', 'build');
  
  // Ensure the directory exists first
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicDir, '_redirects'), redirectsContent);
  console.log('Created _redirects file for Netlify');
}
