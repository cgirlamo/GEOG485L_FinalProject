let csvToJson = require('convert-csv-to-json');


let fileInputName = 'Irish Whiskey Sales by Volume.csv'; 
let fileOutputName = 'WhiskeySales.json';

csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);