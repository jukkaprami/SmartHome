const fs = require('fs');

const add2log = (entry, fileName) => {
    const isoTimeStamp = new Date().toISOString();
    const logRow = entry + '@' + isoTimeStamp + '\n'
    fs.appendFile(fileName, logRow, (err) => {
        if (err) {
            console.log(err);
        }
    })
}

add2log('This is an informational message', 'dataOperation.log')

module.exports = {
    add2log
}


