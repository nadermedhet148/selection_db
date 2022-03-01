-- SelectionDb.dbo.Config definition

-- Drop table

-- DROP TABLE SelectionDb.dbo.Config;

CREATE TABLE SelectionDb.dbo.Config (
	id int IDENTITY(1,1) NOT NULL,
	[type] nvarchar(130) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	json nvarchar COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__Config__3213E83FBAB4107C PRIMARY KEY (id)
);
