module.exports = async (db, params) => {
  let cons = await db.conscriptes.update(
    {
      conscriptionDate: params.cdate
    },
    {
      where: {
        militaryId: params.mid
      },
      raw: true,
      nest: true
    }
  );
  return cons;
};
