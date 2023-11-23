// A MODULE TO SAVE AND READ SETTINGS FROM A JSON FILE
// ===================================================

// LIBRARIES AND MODULES
// ---------------------

// File system module
const fs = require('fs')

// A class for creating, reading and writing to a json based setting file
class AppSettings {
    constructor(fileName) {
        this.fileName = fileName;
    }

    // Method to create and write settings file
    writeSettings(settingsDictionary) {

        // Convert dictionary to JSON and write it
        const jsonSettings = JSON.stringify(settingsDictionary);
        fs.writeFile(this.fileName, jsonSettings, (error) =>{
            if (error) {
                console.log('Unable to write settings', error)
            }
            else {
                console.log('Settings have been written to a file')
            }
        } );
    }

    /* Method to read syncronously from settings file
    This can be done syncronously because we don't do anything until we have
    Correct settings for the service. Keep in mind that it takes a while to write
    to the setting file also. Dont try to read settings just alfter calling write method
    */
    readSettings() {
        
        try {
            const data = fs.readFileSync(this.fileName)
            const settings = JSON.parse(data)
            return settings
        } catch (error) {
           console.error(error)
            
        }
        

    }
}

module.exports = AppSettings