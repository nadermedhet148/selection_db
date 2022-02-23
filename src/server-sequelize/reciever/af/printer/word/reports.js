module.exports = async (db, params) => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  let PizZip = require("pizzip"),
    Docxtemplater = require("docxtemplater"),
    docxConverter = require("docx-pdf"),
    fs = require("fs"),
    path = require("path");
  if (params.query) {
    let content = fs.readFileSync(
        path.resolve(
          __dirname,
          `${isDevelopment ? "../" : "../../"}printer/inputs/${
            params.query
          }.docx`
        ),
        "binary"
      ),
      zip = new PizZip(content),
      doc;
    try {
      doc = new Docxtemplater(zip);
    } catch (error) {
      console.log(error);
      return error;
    }
    doc.setData(params.data);
    try {
      doc.render();
    } catch (error) {
      console.log(error);
      return error;
    }
    let buffer = doc.getZip().generate({
      type: "nodebuffer"
    });
    fs.writeFileSync(
      path.resolve(
        __dirname,
        `${isDevelopment ? "../" : "../../"}printer/outputs/${
          params.filename
        }.docx`
      ),
      buffer
    );

    let executablePath = `${__dirname}\\${
      isDevelopment ? "..\\" : "..\\..\\"
    }printer\\outputs\\${params.filename}.docx`;
    if (params.isPDF) {
      let executablePathPDF = executablePath.replace(".docx", ".pdf");
      docxConverter(executablePath, executablePathPDF, function(err, result) {
        console.log("Error: " + err);
        console.log("Result: " + result);
      });
      return {
        file: `${__dirname}${
          isDevelopment ? "/../" : "/../../"
        }printer/outputs/${params.filename}.docx`,
        folder: executablePathPDF.replace(`${params.filename}.pdf`, "")
      };
    } else {
      return {
        file: executablePath,
        folder: executablePath.replace(`${params.filename}.docx`, "")
      };
    }
  }
  return;
};
