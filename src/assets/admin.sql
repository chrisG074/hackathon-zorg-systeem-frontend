USE SoftZorgDb;
GO

-- 1. Zorg dat de rollen bestaan (voorkomt de InvalidOperationException)
-- Rol: Verpleegkundige
IF NOT EXISTS (SELECT 1 FROM AspNetRoles WHERE NormalizedName = 'VERPLEEGKUNDIGE')
BEGIN
    INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
    VALUES (CAST(NEWID() AS NVARCHAR(450)), 'Verpleegkundige', 'VERPLEEGKUNDIGE', CAST(NEWID() AS NVARCHAR(MAX)));
    PRINT 'Rol "Verpleegkundige" aangemaakt.';
END

-- Rol: Admin
IF NOT EXISTS (SELECT 1 FROM AspNetRoles WHERE NormalizedName = 'ADMIN')
BEGIN
    INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
    VALUES (CAST(NEWID() AS NVARCHAR(450)), 'Admin', 'ADMIN', CAST(NEWID() AS NVARCHAR(MAX)));
    PRINT 'Rol "Admin" aangemaakt.';
END

-- 2. Zoek de ID's op voor de admin-promotie
DECLARE @UserId NVARCHAR(450) = (SELECT Id FROM AspNetUsers WHERE NormalizedEmail = 'ADMIN@TEST.NL');
DECLARE @RoleId NVARCHAR(450) = (SELECT Id FROM AspNetRoles WHERE NormalizedName = 'ADMIN');

-- 3. Koppel de Admin rol aan het admin@test.nl account
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
    PRINT 'Let op: admin@test.nl is niet gevonden in AspNetUsers. Registreer eerst dit account via de app.';
END
GO