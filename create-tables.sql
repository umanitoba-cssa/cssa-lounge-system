-- the tabs :3
create table if not exists tab(
    name varchar(255) unique not null,
    tab integer not null,
);

-- test
insert into inventory(name, tab) values('CSSA', 40) on conflict (name) do nothing;
