const fs = require('fs');

const timestamp = new Date();
const isoTimeStamp = timestamp.toISOString();
let operation = 'Data Fetch operation';
let status = 'processed succesfully';
let entry = operation + ' ' + status + ' @ ' + isoTimeStamp + '\n';

console.log(entry);

fs.appendFile('dataOperations.log', entry, (err) => {
    if (err) {
        console.log(err)
    }
})



