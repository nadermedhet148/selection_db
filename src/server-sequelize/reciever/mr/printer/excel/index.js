module.exports = async (db, params) => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  let XLSX = require("xlsx"),
    path = require("path"),
    executablePath = `${__dirname}\\${
      isDevelopment ? "..\\" : "..\\..\\"
    }printer\\outputs\\${params.filename}.xlsx`,
    wb = XLSX.utils.book_new(),
    ws = XLSX.utils.json_to_sheet(params.data, {
      header: params.excelHeaders
    });
  XLSX.utils.book_append_sheet(wb, ws, "sheet1");
  XLSX.writeFile(
    wb,
    path.resolve(
      __dirname,
      `${isDevelopment ? "../" : "../../"}printer/outputs/${
        params.filename
      }.xlsx`
    )
  );
  return {
    file: executablePath,
    folder: executablePath.replace(`${params.filename}.xlsx`, "")
  };
};
