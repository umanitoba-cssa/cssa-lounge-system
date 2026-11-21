-- Debug import: replaces the catalog, device config, and user tabs in the
-- dev database with the CSVs in this folder. Run with `npm run import:test-data`.
--
-- Runs inside the postgres container, where this folder is mounted at
-- /test-data (see docker-compose.yml). HEADER MATCH makes COPY fail if a CSV
-- header doesn't match the table's columns, so schema drift is caught here.
-- Orders and untracked tables are left alone.
BEGIN;

TRUNCATE
    "tessellate-catalog-item-locations",
    "tessellate-catalog-item-categories",
    "tessellate-catalog-item-variations",
    "tessellate-catalog-categories",
    "tessellate-catalog-items",
    "tessellate-devices-config";

COPY "tessellate-catalog-categories" FROM '/test-data/tessellate_catalog_categories.csv' WITH (FORMAT csv, HEADER MATCH);
COPY "tessellate-catalog-items" FROM '/test-data/tessellate_catalog_items.csv' WITH (FORMAT csv, HEADER MATCH);
COPY "tessellate-catalog-item-variations" FROM '/test-data/tessellate_catalog_item_variations.csv' WITH (FORMAT csv, HEADER MATCH);
COPY "tessellate-catalog-item-categories" FROM '/test-data/tessellate_catalog_item_categories.csv' WITH (FORMAT csv, HEADER MATCH);
COPY "tessellate-catalog-item-locations" FROM '/test-data/tessellate_catalog_item_locations.csv' WITH (FORMAT csv, HEADER MATCH);
COPY "tessellate-devices-config" FROM '/test-data/tessellate_devices_config.csv' WITH (FORMAT csv, HEADER MATCH);

-- Plugin tabs (mounted by TAB-31 as "tab-sys-tabs")
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tab-sys-tabs') THEN
        TRUNCATE "tab-sys-tabs";
        EXECUTE 'COPY "tab-sys-tabs" FROM ''/test-data/tab_sys_tabs.csv'' WITH (FORMAT csv, HEADER MATCH)';
        IF EXISTS (SELECT FROM pg_class WHERE relkind = 'S' AND relname = 'tab-sys-tabs_id_seq') THEN
            PERFORM setval('"tab-sys-tabs_id_seq"', COALESCE((SELECT MAX(id) FROM "tab-sys-tabs"), 1));
        END IF;
    END IF;
END $$;

COMMIT;
