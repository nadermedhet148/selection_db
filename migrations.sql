ALTER TABLE NewAFRAAD.dbo.Followers ADD tripleNo varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Followers ADD Name varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Moving ADD TotalSpecified int NULL;
ALTER TABLE NewAFRAAD.dbo.Recommendations ADD tripleNo varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Recommendations ADD Name varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ADD ServiceType varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ADD GHA varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ADD DriverLevel varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ADD Treatment varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ALTER COLUMN ServiceType varchar(100) COLLATE Arabic_CI_AI NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ALTER COLUMN DriverLevel varchar(100) COLLATE Arabic_CI_AI NULL;
ALTER TABLE NewAFRAAD.dbo.Soldier ALTER COLUMN Treatment varchar(100) COLLATE Arabic_CI_AI NULL;
ALTER TABLE NewAFRAAD.dbo.Followers ALTER COLUMN tripleNo varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.Followers ALTER COLUMN Name varchar(100) COLLATE Arabic_CI_AI NULL;
ALTER TABLE NewAFRAAD.dbo.Recommendations ALTER COLUMN Name varchar(100) COLLATE Arabic_CI_AI NULL;
ALTER TABLE NewAFRAAD.dbo.Users_ ALTER COLUMN [section] text COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL;
INSERT INTO NewAFRAAD.dbo.Users_ (username,password,[Role],RealName,[Degree],[section],DateAdded,isVisible,CanUnfollow,CanAddFollowup) VALUES
	 (N'x',N'x',2,N'x',N'x',N'sections.0.connected_devices,sections.0.edit_users,sections.2.tmam_elwosol,sections.2.effects,sections.2.tmam_elthr7el,sections.2.tmam_eltasgel,sections.2.distributed_suggest,sections.2.soliders_brothers,sections.2.dalies,sections.2.recommandations,sections.2.malaheq_suggest',N'2022-01-30 08:38:59.371 +00:00',1,0,0);
