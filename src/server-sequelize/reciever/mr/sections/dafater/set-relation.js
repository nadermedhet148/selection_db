module.exports = async (db, params) => {
  let rel = await db.dafaterRel.findOrCreate({
      where: {
        imageId: params.imageId,
        militaryId: params.militaryId
      }
    }),
    fixedRel = JSON.parse(JSON.stringify(rel));
  await db.dafaterRel.update(
    {
      note: params.notes,
      userId: params.userId,
      dateAdded: params.dateAdded
    },
    {
      where: {
        id: fixedRel[0].id
      }
    }
  );
  return {
    img: {
      ...fixedRel[0],
      notes: params.notes
    },
    isCreated: fixedRel[1]
  };
};
