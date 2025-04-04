const http = require('http');

// Function to check if the server is running
const checkServer = () => {
  console.log('Checking if server is accessible at http://localhost:5000...');
  
  const req = http.request({
    host: 'localhost',
    port: 5000,
    path: '/',
    method: 'GET',
    timeout: 5000, // 5 second timeout
  }, (res) => {
    console.log(`Server responded with status code: ${res.statusCode}`);
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response body:', data);
      console.log('Server is accessible! ✅');
      process.exit(0);
    });
  });
  
  req.on('error', (error) => {
    console.error('Error connecting to server:', error.message);
    console.log('');
    console.log('Possible reasons for connection failure:');
    console.log('1. The server is not running - start it with "npm run server"');
    console.log('2. The server is running on a different port - check your .env file');
    console.log('3. There might be a firewall blocking the connection');
    console.log('4. Another process might be using port 5000');
    console.log('');
    console.log('To check if port 5000 is in use:');
    console.log('- On Windows: Run "netstat -ano | findstr :5000"');
    console.log('- On Mac/Linux: Run "lsof -i :5000"');
    process.exit(1);
  });
  
  req.on('timeout', () => {
    console.error('Connection timed out');
    req.destroy();
    process.exit(1);
  });
  
  req.end();
};

// Run the check
checkServer();