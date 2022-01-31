"select Coalesce ( SUM(El_Moratab),0) morarb , Coalesce ( SUM(Siasa) ,0) ss from SMGeneralTable where UNIT_NAME like '%" + unittttt + "%' and Feaa_Code like  '%كاتب%' "
"select Coalesce ( SUM(El_Moratab),0) morarb , Coalesce ( SUM(Siasa) ,0) ss from SMGeneralTable where UNIT_NAME = '" + unittttt + "' and Feaa_Code = 'صف' "
"select Coalesce ( SUM(El_Moratab),0) morarb , Coalesce ( SUM(Siasa) ,0) ss from SMGeneralTable where UNIT_NAME = '" + unittttt + "' and Feaa_Code = 'سائق عجل' "
"select Coalesce ( SUM(El_Moratab),0) morarb , Coalesce ( SUM(Siasa) ,0) ss from SMGeneralTable where UNIT_NAME = '" + unittttt + "' and Feaa_Code = 'مهنى' "
"select  Coalesce ( SUM(El_Moratab),0) morarb , Coalesce ( SUM(Siasa) ,0) ss from SMGeneralTable where UNIT_NAME = '" + unittttt + "' and Feaa_Code = 'حرفى' "
//******ادارات*******
"select  Coalesce ( count(ID),0) mm  from SMSoldier join Unit on Unit.UnitID = SMSoldier.UnitID where Unit = '" + unittttt + "' and RecuEndDate > getdate() and SoldierStatus = 'بالخدمة' and SoldierCategory  like '%كاتب%' "
"select  Coalesce ( count(ID),0) mm  from SMSoldier join Unit on Unit.UnitID = SMSoldier.UnitID where Unit = '" + unittttt + "' and RecuEndDate > getdate() and SoldierStatus = 'بالخدمة' and SoldierCategory  = 'صف' "
"select  Coalesce ( count(ID),0) mm  from SMSoldier join Unit on Unit.UnitID = SMSoldier.UnitID where Unit = '" + unittttt + "' and RecuEndDate > getdate() and SoldierStatus = 'بالخدمة' and SoldierCategory   = 'سائق عجل' "
"select  Coalesce ( count(ID),0) mm  from SMSoldier join Unit on Unit.UnitID = SMSoldier.UnitID where Unit = '" + unittttt + "' and RecuEndDate > getdate() and SoldierStatus = 'بالخدمة' and SoldierCategory   = 'مهنى' "
"select  Coalesce ( count(ID),0) mm  from SMSoldier join Unit on Unit.UnitID = SMSoldier.UnitID where Unit = '" + unittttt + "' and RecuEndDate > getdate() and SoldierStatus = 'بالخدمة' and SoldierCategory   = 'حرفى' "
//********حدود**********
"select  Coalesce ( count(ID),0) mm  from Soldier join Unit on Unit.UnitID = Soldier.UnitID where Unit = '" + unittttt + "' and RecuEndDate > getdate() and SoldierStatus = 'بالخدمة'  and SoldierCategory   = 'صف' "
////******** سياسة الامداد********
"select  Coalesce (Sum(convert( int ,  ImdadTotal)) , 0) mm   from SMDriversSuggestion join Unit on Unit.UnitID = SMDriversSuggestion.UnitID where Unit = '" + unittttt + "' "
//*************راتب عالى*******
"select  Coalesce ( count(ID),0) mm  from Rateb join Unit on Unit.UnitID = Rateb.UnitID where Unit = '" + unittttt + "' and RatebCategory   like '%كاتب%' "
"select  Coalesce ( count(ID),0) mm  from Rateb join Unit on Unit.UnitID = Rateb.UnitID where Unit = '" + unittttt + "' and RatebCategory  = 'صف' "
"select  Coalesce ( count(ID),0) mm  from Rateb join Unit on Unit.UnitID = Rateb.UnitID where Unit = '" + unittttt + "' and RatebCategory   = 'سائق عجل' "
"select  Coalesce ( count(ID),0) mm  from Rateb join Unit on Unit.UnitID = Rateb.UnitID where Unit = '" + unittttt + "' and RatebCategory   = 'مهنى' "
"select  Coalesce ( count(ID),0) mm  from Rateb join Unit on Unit.UnitID = Rateb.UnitID where Unit = '" + unittttt + "' and RatebCategory   = 'حرفى' "

https://codepen.io/mandaputra8/pen/XWWBQpL?editors=1010