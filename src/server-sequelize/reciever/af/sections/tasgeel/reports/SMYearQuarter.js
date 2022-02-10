const { QueryTypes } = require("sequelize");
const getUnits = require("./getUnits");
const types = require("./types").default;

const lodash = require("lodash");

module.exports = async (db, params) => {
  function runQuery(query) {
    return db.sequelize.query(query, {
      type: QueryTypes.SELECT
    });
  }
  // get units
  const units = await getUnits(db, params);
  const serviceTypes = types.serviceTypes;
  const categories = types.SoldierCategoryMap.filter(
    ele => params.SoldierCategories.indexOf(ele.text) > -1
  ).map(ele => ele.text);

  const result = await Promise.all(
    units.map(async ele => {
      ele = {
        ...ele,
        siasa: { total: 0 },
        mortab: { total: 0 },
        avaible: { total: 0 },
        mosrah: 0,
        avaibleAfterTasreh: { total: 0 },
        neededAfterTasreh: { total: 0 }
      };

      for (const type of serviceTypes) {
        const salaries = await runQuery(`
        select  Coalesce(Sum(Siasa),0) siasa , Coalesce(Sum(El_Moratab),0) mortab
        from SMGeneral 
        where  Khedma_Type like N'%${type.text}%' and
        UNIT_NAME like N'%${ele.Unit}%' and
        Weapon like N'%${params.weapon}%'
        and (${categories
          .map(text => `Feaa_Code  like  N'%${text}%'`)
          .join(" or ")})
         ${params.job ? `and Job = N'${params.job}' ` : ""} 

        `);
        ele.siasa[type.mappedValue] = salaries[0].siasa;
        ele.siasa.total += salaries[0].siasa;
        ele.mortab[type.mappedValue] = salaries[0].mortab;
        ele.mortab.total += salaries[0].mortab;
      }

      const solidersCount = await runQuery(`select COUNT(ID) count from Soldier
       join Unit on Unit.UnitID = Soldier.UnitID 
       join Duty on Duty.DutyID = Soldier.DutyID
       inner join Weapon on Weapon.WeaponID = Soldier.WeaponID  where
       UNIT.Unit like N'%${ele.Unit}%' and
       Weapon.Weapon like N'%${params.weapon}%'  
       and RecuEndDate > getdate() 
       and SoldierStatus = N'بالخدمة'
       and (${categories
         .map(text => `SoldierCategory  like  N'%${text}%'`)
         .join(" or ")})
       ${params.job ? `and Duty.Duty = N'${params.job}' ` : ""} 
       
       `);

      const ratabCount = await runQuery(`
            SELECT Coalesce (Count(ID),0) count  FROM Rateb
            inner join Unit on Unit.UnitID =Rateb.UnitID
            join Duty on Duty.DutyID = Rateb.DutyID
            inner join Weapon on Weapon.WeaponID = Rateb.WeaponID
            Where RatebState = N'بالخدمة'
            and Unit.Unit like  N'%${ele.Unit}%'
            and Weapon.Weapon like N'%${params.weapon}%'
            and (${categories
              .map(text => `RatebCategory  like  N'%${text}%'`)
              .join(" or ")})
            ${params.job ? `and Duty.Duty = N'${params.job}' ` : ""} 
             
          

          `);

      ele.avaible = {
        soliders: solidersCount[0].count,
        ratab: ratabCount[0].count,
        total: solidersCount[0].count + ratabCount[0].count
      };

      const mosrah = await runQuery(`
          select COUNT(ID) count from Soldier 
          join Unit on Unit.UnitID = Soldier.UnitID 
          join Duty on Duty.DutyID = Soldier.DutyID
          inner join Weapon on Weapon.WeaponID = Soldier.WeaponID  where
          UNIT.Unit like N'%${ele.Unit}%' and
          Weapon.Weapon like N'%${params.weapon}%'  
          and SoldierStatus = N'بالخدمة'
          and RecuEndDate = '${params.RecuEndDate}'
          and (${categories
            .map(text => `SoldierCategory  like  N'%${text}%'`)
            .join(" or ")}) 
          ${params.job ? `and Duty.Duty = N'${params.job}' ` : ""} 
          

        `);

      ele.mosrah = mosrah[0].count;

      ele.avaibleAfterTasreh = {
        ratab: ratabCount[0].count,
        soliders: solidersCount[0].count - ele.mosrah,
        total: solidersCount[0].count - ele.mosrah + ratabCount[0].count
      };

      ele.neededAfterTasreh = {
        ratab: ele.siasa.ratab - ele.avaible.ratab,
        soliders:
          ele.siasa.soliders +
          ele.siasa.ratebOversolider -
          ele.avaibleAfterTasreh.soliders
      };

      ele.neededAfterTasreh.total =
        ele.neededAfterTasreh.ratab + ele.neededAfterTasreh.soliders;
      return ele;
    })
  );

  return lodash.flatten(result);
};
