const fs = require("fs");
const path = require("path");

module.exports = async (req, res, next) => {
  const geojson = req.body.geojson;
  if (!geojson) {
    res.json({
      status: false,
      statusText: "Ожидаемое поле geojson пустое"
    })
  }

  const filePath = `/../../public/${"data"}.json`;

  const isWrite = await writeFile(filePath, JSON.stringify(geojson));

  if (!isWrite.status){
    return res.json(isWrite);
  }

  return res.sendFile(path.join(__dirname + '/../../src/html/index.html'));
};

const writeFile = (filePath, fileData) => new Promise((fulfill, reject) => {
  const normalizeFilePath = path.join(__dirname, filePath);
  fs.writeFile(normalizeFilePath, fileData, err => {
    if (err) {
      reject(err);
    }
    fulfill({
      status: true,
      statusText: "Файл успешно записан",
      data: filePath
    });
  });
});