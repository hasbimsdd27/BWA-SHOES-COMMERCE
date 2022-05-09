CREATE DATABASE midtrans_gateway_db DEFAULT CHARACTER SET = 'utf8mb4';

CREATE TABLE payment_request_data (
	id varchar(255) PRIMARY KEY,
	source_id varchar(255),
	webhook_url TEXT,
	is_receive_webhook BOOLEAN,
	client_webhook_status_code INT,
	client_webhook_status_response TEXT,
	midtrans_webhook_payload TEXT
);