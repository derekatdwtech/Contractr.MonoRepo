INSERT INTO status (status_name, status_level) VALUES ('Received', 'INFO');
INSERT INTO status (status_name, status_level) VALUES ('Parsing Document', 'INFO');
INSERT INTO status (status_name, status_level) VALUES ('Parsing Complete', 'INFO');
INSERT INTO status (status_name, status_level) VALUES ('Creating Signature Pages', 'INFO');
INSERT INTO status (status_name, status_level) VALUES ('Uploading Signature Pages', 'INFO');
INSERT INTO status (status_name, status_level) VALUES ('No Signature Pages Detected', 'WARN');
INSERT INTO status (status_name, status_level) VALUES ('Parsing Failed', 'ERROR');


/* Adding Task Status */
INSERT INTO task_status (name) VALUES ('Open');
INSERT INTO task_status (name) VALUES ('In Progress');
INSERT INTO task_status (name) VALUES ('Waiting for Client');
INSERT INTO task_status (name) VALUES ('Waiting for Approval');
INSERT INTO task_status (name) VALUES ('Closed');




