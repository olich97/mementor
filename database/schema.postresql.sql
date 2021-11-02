drop table if exists meme;
drop table if exists content;
drop table if exists scrap_error;

-- Table for storing contents associated with meme
CREATE TABLE content 
(
    content_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(10) NOT NULL,
    source_url TEXT NULL,
    storage_key VARCHAR(64) NOT NULL,
    last_update_date TIMESTAMP with time zone default current_timestamp NOT NULL
);

-- 
CREATE TABLE meme (
    meme_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL,
    source_url TEXT NULL,
    text TEXT NOT NULL,
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

CREATE INDEX Meme_ContentId_Idx ON Meme(content_id);