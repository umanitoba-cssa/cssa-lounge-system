-- the tabs :3
create table if not exists tabs(
    name varchar(255) unique not null,
    tab integer not null,
);

-- test
insert into tabs(name, tab) values('CSSA', 40) on conflict (name) do nothing;
