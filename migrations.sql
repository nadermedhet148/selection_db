ALTER TABLE NewAFRAAD.dbo.Followers ADD tripleNo varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Followers ADD Name varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Moving ADD TotalSpecified int NULL;
ALTER TABLE NewAFRAAD.dbo.Recommendations ADD tripleNo varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Recommendations ADD Name varchar(100) NULL;
ALTER TABLE NewAFRAAD.dbo.Followers ALTER COLUMN tripleNo varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL;
ALTER TABLE NewAFRAAD.dbo.Followers ALTER COLUMN Name varchar(100) COLLATE Arabic_CI_AI NULL;
ALTER TABLE NewAFRAAD.dbo.Recommendations ALTER COLUMN Name varchar(100) COLLATE Arabic_CI_AI NULL;
