let args = (process.argv.slice(2));

const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const checkFileExists = function(file) {
  if (fs.existsSync(file)) {
    return true;
  }
};

const checkPathExists = function(wholePath) {
  const slashIndex = wholePath.lastIndexOf('/');
  const sliceNum = slashIndex - wholePath.length;
  const path = wholePath.slice(0, sliceNum + 1);
  console.log('Error: Save file path does not exist');
  if (fs.existsSync(path)) {
    return true;
  }
};

//if the path exists proceed
if (checkPathExists(args[1])) {

  //if the file does not exist, proceed to write the file if no errors present
  if (!checkFileExists(args[1])) {

    request(args[0], (error, response, body) => {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);

      if (error === null) {
        fs.writeFile(args[1], body, 'utf8', () => {
          console.log(`Downloaded and saved ${response.headers['content-length']} bytes to ${args[1]}`);
        });
      }
    });
  } else {
    // if the file exists prompt to overwrite
    rl.question("This file already exists. Would you like to overwrite it? Y/N", (answer) => {
      if (answer === "Y") {
        request(args[0], (error, response, body) => {
          console.log('error:', error);
          console.log('statusCode:', response && response.statusCode);

          if (error === null) {
            fs.writeFile(args[1], body, 'utf8', () => {
              console.log(`Downloaded and saved ${response.headers['content-length']} bytes to ${args[1]}`);
            });
          }
        });
        rl.close();
      } else if (answer === "N") {
        console.log('File not saved');
        rl.close();
      } else {
        console.log('Invalid response');
        rl.close();
      }
    });
  }
}
