-- the tabs :3
create table if not exists tabs(
    id serial primary key,
    name varchar(255) unique not null,
    tab double precision not null default 0
);

-- test
insert into tabs(name, tab) values('CSSA', 40) on conflict (name) do nothing;
