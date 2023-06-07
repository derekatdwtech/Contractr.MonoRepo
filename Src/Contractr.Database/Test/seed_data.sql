/* Test data for Derek test */
INSERT INTO users
    (id, first_name, last_name, email, is_active)
VALUES
    ('auth0|62f2ca7079a7e6d6b68c0332', 'Derek', 'Williams', 'derek18williams+ctrtest1@gmail.com', 1);

INSERT INTO organization
    (id, name, owner, address, city, state, country, zip, phone)
VALUES('DRNuHTpvSlhXE0Bm', 'Derek Test Law Firm', 'auth0|62f2ca7079a7e6d6b68c0332', '123 Law Way', 'Lexington', 'Kentucky', 'United States', 12345, 1234567890);

INSERT INTO deals
    (id, unique_name, description, start_date, organization, deal_status_id)
VALUES
    ('epXwpH8yeX-EfDXK', 'Just Burgers Acquisition', 'Asset purchase agreement for Just Burgers', CURRENT_TIMESTAMP, (SELECT id
        from organization
        WHERE owner = 'auth0|62f2ca7079a7e6d6b68c0332'), 1 );
INSERT INTO deals
    (id, unique_name, description, start_date, organization, deal_status_id)
VALUES
    ('zzj2BRMw20-K71CL', 'Awesome Music LLC', 'Merger of Awesome Mussic LLC. and Lesser Music LLC.', CURRENT_TIMESTAMP, (SELECT id
        from organization
        WHERE owner = 'auth0|62f2ca7079a7e6d6b68c0332'), 1 );
INSERT INTO deals
    (id, unique_name, description, start_date, organization, deal_status_id)
VALUES
    ('AHp5pL345KI6YmXj', 'Mojang Merger', 'Microsoft Purchases Mojang', CURRENT_TIMESTAMP, (SELECT id
        from organization
        WHERE owner = 'auth0|62f2ca7079a7e6d6b68c0332'), 1 );

/* Test Data for James Bond Test */
INSERT INTO users
    (id, first_name, last_name, email, is_active)
VALUES
    ('auth0|62f2ca859f42daab107106c7', 'James', 'Bond', 'derek18williams+ctrtest2@gmail.com', 1);

INSERT INTO organization
    (id, name, owner, address, city, state, country, zip, phone)
VALUES('KwW21L-FlgsVgmze', '007 Law Firm', 'auth0|62f2ca859f42daab107106c7', '007 Skyfall Ln', 'New York', 'New York', 'United States', 12349, 1567891123);

INSERT INTO deals
    (id, unique_name, description, start_date, organization, deal_status_id)
VALUES
    ('TmH9KFXRBtJkiN8g', 'Project X', 'Secret Project X', CURRENT_TIMESTAMP, (SELECT id
        from organization
        WHERE owner = 'auth0|62f2ca859f42daab107106c7'), 1 );
INSERT INTO deals
    (id, unique_name, description, start_date, organization, deal_status_id)
VALUES
    ('QaUpyYYIzQJaTBiB', 'Project Y', 'Secret Project Y', CURRENT_TIMESTAMP, (SELECT id
        from organization
        WHERE owner = 'auth0|62f2ca859f42daab107106c7'), 1 );
INSERT INTO deals
    (id, unique_name, description, start_date, organization, deal_status_id)
VALUES
    ('N3WhxVzLxBleE4sl', 'Project Z', 'Secret Project Z', CURRENT_TIMESTAMP, (SELECT id
        from organization
        WHERE owner = 'auth0|62f2ca859f42daab107106c7'), 1 );
