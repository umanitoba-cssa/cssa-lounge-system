-- Debug import: replaces the catalog and device config in the dev database
-- with the CSVs in this folder. Run with `pnpm import:test-data`.
--
-- Runs inside the postgres container, where this folder is mounted at
-- /test-data (see docker-compose.yml). HEADER MATCH makes COPY fail if a CSV
-- header doesn't match the table's columns, so schema drift is caught here.
-- Orders and the plugin's own tables are left alone.
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

COMMIT;
