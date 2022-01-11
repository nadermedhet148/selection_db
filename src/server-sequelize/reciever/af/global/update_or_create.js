/**
 * If it exists update it
 * if it's not then create it
 *
 * by measuring the number of effected rows
 * @TODO finishing the function I don't need it right now
 */
module.exports = async (db, params) => {
  let records = await db[params.table].update(params.update, {
    where: params.where,
    raw: true,
    nest: true
  });
  console.log(records);
};
