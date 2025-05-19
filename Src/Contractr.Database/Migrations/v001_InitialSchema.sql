CREATE TABLE users
(
    id VARCHAR(16) NOT NULL PRIMARY KEY,
    first_name VARCHAR(50) NULL,
    last_name VARCHAR(50) NULL,
    email VARCHAR(254) NOT NULL,
    is_active BIT NOT NULL,
);

CREATE TABLE organization
(
    id VARCHAR(16) NOT NULL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(MAX) NOT NULL,
    city VARCHAR(168) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR (30) NOT NULL,
    owner VARCHAR(16) NOT NULL,
    zip INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    parent_organization VARCHAR(16) NULL,
    CONSTRAINT fk_organizaion_owner_id FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE roles
(
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    role_name VARCHAR(100) NOT NULL,
);

CREATE TABLE assigned_roles
(
    user_id VARCHAR(16) NOT NULL,
    member_of VARCHAR(16) NULL,
    role_id UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT fk_assigned_roles_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_assigned_roles_member_of FOREIGN KEY (member_of) REFERENCES organization(id),
    CONSTRAINT fk_assigned_roles_role_id FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE deal_status (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name VARCHAR(200)

);

CREATE TABLE deals
(
    id VARCHAR(16) NOT NULL PRIMARY KEY,
    unique_name VARCHAR(MAX) NULL,
    description VARCHAR(MAX) NULL,
    start_date DATETIME NOT NULL,
    close_date DATETIME NULL,
    buyor VARCHAR(100) NULL,
    seller VARCHAR(100) NULL,
    organization VARCHAR(16) NOT NULL,
    deal_status_id INT NOT NULL REFERENCES deal_status(id),
    CONSTRAINT fk_deals_organization FOREIGN KEY (organization) REFERENCES organization(id) ON DELETE CASCADE
);

CREATE TABLE deal_roles
(
    deal_id VARCHAR(16) NOT NULL REFERENCES deals(id),
    user_id VARCHAR(16) NOT NULL REFERENCES users(id)
);

CREATE TABLE tasks (
    id VARCHAR(16) NOT NULL PRIMARY KEY,
    deal_id VARCHAR(16) NOT NULL REFERENCES deals(id),
    created_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(16) NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description VARCHAR(MAX) NULL,
    assigned_to VARCHAR(16) NULL REFERENCES users(id),
    due_date DATETIME NULL,
    is_restricted BIT NOT NULL DEFAULT 0,
    status INT NOT NULL DEFAULT 1
)

CREATE TABLE task_status (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name VARCHAR(200)
)

CREATE TABLE task_history (
    task_id VARCHAR(16) NOT NULL REFERENCES tasks(id),
    action VARCHAR(100) NOT NULL,
    action_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    action_by VARCHAR(16) NOT NULL REFERENCES users(id)
)

CREATE TABLE task_comments (
    task_id VARCHAR(16) REFERENCES tasks(id),
    author VARCHAR(16) REFERENCES users(id),
    body VARCHAR(MAX) NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
)

CREATE TABLE original_documents
(
    id VARCHAR(16) NOT NULL PRIMARY KEY,
    file_name VARCHAR(MAX) NOT NULL,
    blob_uri VARCHAR(MAX) NOT NULL,
    uploaded_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(100) NOT NULL,
    deal_id VARCHAR(16) NOT NULL,
    CONSTRAINT fk_documents_deal_id FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE

);

CREATE TABLE converted_documents
(
    id VARCHAR(16) NOT NULL PRIMARY KEY,
    parent_document VARCHAR(16) NOT NULL,
    deal_id VARCHAR(16) NOT NULL,
    blob_uri VARCHAR(MAX) NOT NULL,
    file_name VARCHAR(MAX) NOT NULL,
    CONSTRAINT fk_converted_documents_og_doc FOREIGN KEY (parent_document) REFERENCES original_documents(id)
);

CREATE TABLE signature_documents
(
    id VARCHAR(16) NOT NULL PRIMARY KEY,
    parent_document VARCHAR(16) NOT NULL,
    deal_id VARCHAR(16) NOT NULL,
    blob_uri VARCHAR(MAX) NOT NULL,
    file_name VARCHAR(MAX) NOT NULL,
    CONSTRAINT fk_signature_documents_conv_doc FOREIGN KEY (parent_document) REFERENCES converted_documents(id)

);

CREATE TABLE signed_documents
(
    id VARCHAR(16) NOT NULL PRIMARY KEY,
    parent_document VARCHAR(16) NOT NULL,
    deal_id VARCHAR(16) NOT NULL,
    blob_uri VARCHAR(MAX) NOT NULL,
    file_name VARCHAR(MAX) NOT NULL,
    signed_by VARCHAR(16) NOT NULL,
    CONSTRAINT fk_signature_documents_signed_doc FOREIGN KEY (parent_document) REFERENCES signature_documents(id),
    CONSTRAINT fk_signature_documents_digned_by FOREIGN KEY (signed_by) REFERENCES users(id)

);

CREATE TABLE completed_documents
(
    parent_document VARCHAR(16) NOT NULL,
    deal_id VARCHAR(16) NOT NULL,
    blob_uri VARCHAR(MAX) NOT NULL,
    CONSTRAINT fk_signature_documents_complete_doc FOREIGN KEY (parent_document) REFERENCES converted_documents(id)
);

CREATE TABLE status
(
    status_id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    status_name VARCHAR(200),
    status_level VARCHAR(10)
);

CREATE TABLE feedback_status
(
    document_id VARCHAR(16) REFERENCES original_documents(id),
    current_status INT NOT NULL REFERENCES status(status_id),
    updated_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification_history
(
    id VARCHAR(16) NOT NULL PRIMARY KEY,
    message_text VARCHAR(MAX) NOT NULL,
    date_sent DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    recipient VARCHAR(16) NOT NULL REFERENCES organization(id),
    is_read BIT NOT NULL,
    type VARCHAR(100) NULL
);
