var fs = require("fs");

module.exports = async (db, params) => {
  console.log(params.file.replaceAll("/", "\\"));

  fs.readFile(params.file, (err, buffer) => {
    const { PDFExtract } = require("pdf.js-extract");
    const extract = new PDFExtract();
    extract
      .extractBuffer(buffer, {})
      .then(data => {
        console.log(data);
        // let nid = data.pages[0].content[84].str;
        // return nid;
      })
      .catch(err => {
        return err;
      });
  });
};
