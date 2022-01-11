module.exports = async (db, params) => {
  let img = await db.dafaterImages.findOrCreate({
      where: {
        imgPath: params.path,
        dafaterId: params.dafaterId
      }
    }),
    fixedImg = JSON.parse(JSON.stringify(img));
  return {
    img: fixedImg[0],
    isCreated: fixedImg[1]
  };
};
