USE WorksoftTaskTracker;
DELETE FROM Users WHERE Email='admin@worksoft.com';
INSERT INTO Users (FullName, Email, PasswordHash, RoleId, IsActive)
VALUES ('Admin Kullanıcı', 'admin@worksoft.com', '$2a$11$qtVC1j.F/AX9pY93kstI6OvgcDf4ZuuxVkfxC8CER09KjoIhO4tQW', 1, 1);