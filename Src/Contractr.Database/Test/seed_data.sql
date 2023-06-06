/* Test data for Derek test */
INSERT INTO users(id, first_name, last_name, email, is_active) VALUES ('auth0|62f2ca7079a7e6d6b68c0332', 'Derek', 'Williams', 'derek18williams+ctrtest1@gmail.com', 1);
INSERT INTO organization(name, owner) VALUES('Derek Test Law Firm','auth0|62f2ca7079a7e6d6b68c0332');
INSERT INTO deals (unique_name, description, start_date, organization) VALUES ('Just Burgers Acquisition', 'Asset purchase agreement for Just Burgers', CURRENT_TIMESTAMP, (SELECT id from organization WHERE owner = 'auth0|62f2ca7079a7e6d6b68c0332') );
INSERT INTO deals (unique_name, description, start_date, organization) VALUES ('Awesome Music LLC', 'Merger of Awesome Mussic LLC. and Lesser Music LLC.', CURRENT_TIMESTAMP, (SELECT id from organization WHERE owner = 'auth0|62f2ca7079a7e6d6b68c0332') );
INSERT INTO deals (unique_name, description, start_date, organization) VALUES ('Mojang Merger', 'Microsoft Purchases Mojang', CURRENT_TIMESTAMP, (SELECT id from organization WHERE owner = 'auth0|62f2ca7079a7e6d6b68c0332') );

/* Test Data for James Bond Test */
INSERT INTO users(id, first_name, last_name, email, is_active) VALUES ('auth0|62f2ca859f42daab107106c7', 'James', 'Bond', 'derek18williams+ctrtest2@gmail.com', 1);
INSERT INTO organization(name, owner) VALUES('007 Law Firm', 'auth0|62f2ca859f42daab107106c7');
INSERT INTO deals (unique_name, description, start_date, organization) VALUES ('Project X', 'Secret Project X', CURRENT_TIMESTAMP, (SELECT id from organization WHERE owner = 'auth0|62f2ca859f42daab107106c7') );
INSERT INTO deals (unique_name, description, start_date, organization) VALUES ('Project Y', 'Secret Project Y', CURRENT_TIMESTAMP, (SELECT id from organization WHERE owner = 'auth0|62f2ca859f42daab107106c7') );
INSERT INTO deals (unique_name, description, start_date, organization) VALUES ('Project Z', 'Secret Project Z', CURRENT_TIMESTAMP, (SELECT id from organization WHERE owner = 'auth0|62f2ca859f42daab107106c7') );
