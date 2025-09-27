-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OPERATOR',
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "truck_cisterns" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plate" TEXT NOT NULL,
    "capacity_l" INTEGER NOT NULL,
    "calibration_doc" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "truck_tractors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plate" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "license_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "destinations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "route_code" TEXT NOT NULL,
    "default_tolerance_l" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "phone" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "payment_terms" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "supplier_id" INTEGER NOT NULL,
    "cmd_no" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "qty_ordered_l" INTEGER NOT NULL,
    "price_buy_per_l" INTEGER NOT NULL,
    "transit_cfa" INTEGER NOT NULL,
    "customs_cfa" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "ordered_at" DATETIME,
    CONSTRAINT "purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "purchase_receipts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "po_id" INTEGER NOT NULL,
    "qty_received_l" INTEGER NOT NULL,
    "received_at" DATETIME NOT NULL,
    "note" TEXT,
    CONSTRAINT "purchase_receipts_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "purchase_orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lots" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lot_code" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "started_at" DATETIME NOT NULL,
    "closed_at" DATETIME,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "lot_trips" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lot_id" INTEGER NOT NULL,
    "cistern_id" INTEGER NOT NULL,
    "tractor_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "destination_id" INTEGER NOT NULL,
    "capacity_l" INTEGER NOT NULL,
    "price_buy_per_l" INTEGER NOT NULL,
    "freight_per_l" INTEGER NOT NULL,
    "tolerance_l" INTEGER NOT NULL,
    "shortage_l" INTEGER NOT NULL DEFAULT 0,
    "price_sell_per_l" INTEGER NOT NULL,
    "transit_cfa" INTEGER NOT NULL,
    "customs_cfa" INTEGER NOT NULL,
    "misc_cfa" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    CONSTRAINT "lot_trips_lot_id_fkey" FOREIGN KEY ("lot_id") REFERENCES "lots" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "lot_trips_cistern_id_fkey" FOREIGN KEY ("cistern_id") REFERENCES "truck_cisterns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "lot_trips_tractor_id_fkey" FOREIGN KEY ("tractor_id") REFERENCES "truck_tractors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "lot_trips_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "lot_trips_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lot_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "invoice_no" TEXT NOT NULL,
    "total_cfa" INTEGER NOT NULL,
    "issued_at" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    CONSTRAINT "invoices_lot_id_fkey" FOREIGN KEY ("lot_id") REFERENCES "lots" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invoice_lines" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "invoice_id" INTEGER NOT NULL,
    "lot_trip_id" INTEGER,
    "qty_l" INTEGER NOT NULL,
    "unit_price_cfa" INTEGER NOT NULL,
    "line_total_cfa" INTEGER NOT NULL,
    CONSTRAINT "invoice_lines_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invoice_lines_lot_trip_id_fkey" FOREIGN KEY ("lot_trip_id") REFERENCES "lot_trips" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payments_in" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "reference" TEXT NOT NULL,
    "amount_cfa" INTEGER NOT NULL,
    "note" TEXT,
    CONSTRAINT "payments_in_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payments_out" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "supplier_id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "reference" TEXT NOT NULL,
    "amount_cfa" INTEGER NOT NULL,
    "note" TEXT,
    CONSTRAINT "payments_out_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pricing_rules" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product" TEXT NOT NULL,
    "destination_id" INTEGER NOT NULL,
    "valid_from" DATETIME NOT NULL,
    "price_sell_per_l" INTEGER NOT NULL,
    CONSTRAINT "pricing_rules_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transport_rules" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "destination_id" INTEGER NOT NULL,
    "valid_from" DATETIME NOT NULL,
    "freight_per_l" INTEGER NOT NULL,
    CONSTRAINT "transport_rules_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "backups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ran_at" DATETIME NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "checksum" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "ok" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "truck_cisterns_plate_key" ON "truck_cisterns"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "truck_tractors_plate_key" ON "truck_tractors"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "lots_lot_code_key" ON "lots"("lot_code");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_no_key" ON "invoices"("invoice_no");
