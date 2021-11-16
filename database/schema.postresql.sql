drop table if exists meme;
drop table if exists "user";
drop table if exists content;
drop table if exists scrap_error;

-- Table for users: external logins only
CREATE TABLE "user" 
(
    user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    provider VARCHAR(20) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,  
    photo_profile_url VARCHAR(255) NULL,
    token TEXT NULL,
    token_expiration_date TIMESTAMP with time zone NULL,
    last_login_date TIMESTAMP with time zone NULL,
    last_update_date TIMESTAMP with time zone default current_timestamp NOT NULL
);

-- Table for storing contents associated with meme
CREATE TABLE content 
(
    content_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(10) NOT NULL,
    source_url TEXT NULL,
    storage_key VARCHAR(64) NULL,
    last_update_date TIMESTAMP with time zone default current_timestamp NOT NULL
);

-- 
CREATE TABLE meme (
    meme_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL,
    source_url TEXT NULL,
    text TEXT NOT NULL,
    author VARCHAR(255) NULL,
    is_public BIT DEFAULT b'0' NOT NULL,
    publish_date TIMESTAMP NULL,
    content_id uuid NOT NULL references content(content_id),
    last_update_date TIMESTAMP with time zone default current_timestamp NOT NULL
);

-- Table for tracing the scrapper execution errors
CREATE TABLE scrap_error 
(
    error_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    target_url TEXT NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    error TEXT NOT NULL,
    last_update_date TIMESTAMP with time zone default current_timestamp NOT NULL
);

-- Table for tracing the content upload execution errors
CREATE TABLE content_upload_error 
(
    error_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    target_url TEXT NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    error TEXT NOT NULL,
    last_update_date TIMESTAMP with time zone default current_timestamp NOT NULL
);

CREATE INDEX Meme_ContentId_Idx ON Meme(content_id);