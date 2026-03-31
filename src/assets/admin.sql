USE SoftZorgDb;
GO

-- 1. Controleer of de Admin rol al bestaat, zo niet, maak hem aan
IF NOT EXISTS (SELECT 1 FROM AspNetRoles WHERE NormalizedName = 'ADMIN')
BEGIN
    INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
    VALUES (CAST(NEWID() AS NVARCHAR(450)), 'Admin', 'ADMIN', CAST(NEWID() AS NVARCHAR(MAX)));
END

-- 2. Zoek de ID's op
DECLARE @UserId NVARCHAR(450) = (SELECT Id FROM AspNetUsers WHERE NormalizedEmail = 'ADMIN@TEST.NL');
DECLARE @RoleId NVARCHAR(450) = (SELECT Id FROM AspNetRoles WHERE NormalizedName = 'ADMIN');

-- 3. Koppel de Admin rol aan jouw admin@test.nl account
IF @UserId IS NOT NULL AND @RoleId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM AspNetUserRoles WHERE UserId = @UserId AND RoleId = @RoleId)
    BEGIN
        INSERT INTO AspNetUserRoles (UserId, RoleId) VALUES (@UserId, @RoleId);
        PRINT 'BAM! admin@test.nl is nu succesvol gepromoveerd tot Admin.';
    END
    ELSE
    BEGIN
        PRINT 'Dit account was al een Admin.';
    END
END
ELSE
BEGIN
    PRINT 'Fout: Ik kon admin@test.nl niet vinden. Heb je stap 1 via de frontend wel uitgevoerd?';
END
GO