create table if not exists tabs (
    id serial primary key,
    name varchar(255) not null,
    discord_id varchar(255) unique,
    microsoft_id varchar(255) unique,
    role varchar(20) not null default 'user'
        check (role in ('user', 'supervisor', 'admin')),
    tab_amount bigint not null default 0, -- stored in cents
    tab_currency varchar(3) not null default 'CAD',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- $50.00 cap
do $$
begin
    if not exists (
        select 1 from pg_constraint where conname = 'tabs_tab_range'
    ) then
        alter table tabs add constraint tabs_tab_range
            check (tab_amount >= 0 and tab_amount <= 5000);
    end if;
end $$;

create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists trg_tabs_updated_at on tabs;
create trigger trg_tabs_updated_at
    before update on tabs
    for each row
    execute function set_updated_at();
