drop table if exists Meme;
drop table if exists Content;


CREATE TABLE content 
(
    content_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(10) NOT NULL,
    source VARCHAR(255) NULL,
    key VARCHAR(64) NOT NULL,
    last_update_date TIMESTAMP with time zone default current_timestamp
);

CREATE TABLE meme (
    meme_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL,
    text TEXT NOT NULL,
    content_id uuid NOT NULL references content(content_id),
    last_update_date TIMESTAMP with time zone default current_timestamp
);


CREATE INDEX Meme_ContentId_Idx ON Meme(content_id);