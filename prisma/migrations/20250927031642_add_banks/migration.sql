-- CreateTable
CREATE TABLE "banks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "swift" TEXT,
    "country" TEXT
);

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bank_id" INTEGER NOT NULL,
    "account_no" TEXT NOT NULL,
    "name" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "bank_accounts_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "amount_cfa" INTEGER NOT NULL,
    "description" TEXT,
    "bank_account_id" INTEGER,
    CONSTRAINT "expenses_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "loans" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lender" TEXT NOT NULL,
    "amount_cfa" INTEGER NOT NULL,
    "taken_at" DATETIME NOT NULL,
    "due_at" DATETIME,
    "bank_account_id" INTEGER,
    CONSTRAINT "loans_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_payments_in" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "reference" TEXT NOT NULL,
    "amount_cfa" INTEGER NOT NULL,
    "note" TEXT,
    "bank_account_id" INTEGER,
    CONSTRAINT "payments_in_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payments_in_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_payments_in" ("amount_cfa", "customer_id", "date", "id", "note", "reference") SELECT "amount_cfa", "customer_id", "date", "id", "note", "reference" FROM "payments_in";
DROP TABLE "payments_in";
ALTER TABLE "new_payments_in" RENAME TO "payments_in";
CREATE TABLE "new_payments_out" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "supplier_id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "reference" TEXT NOT NULL,
    "amount_cfa" INTEGER NOT NULL,
    "note" TEXT,
    "bank_account_id" INTEGER,
    CONSTRAINT "payments_out_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payments_out_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_payments_out" ("amount_cfa", "date", "id", "note", "reference", "supplier_id") SELECT "amount_cfa", "date", "id", "note", "reference", "supplier_id" FROM "payments_out";
DROP TABLE "payments_out";
ALTER TABLE "new_payments_out" RENAME TO "payments_out";
CREATE TABLE "new_purchase_orders" (
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
    "bank_account_id" INTEGER,
    CONSTRAINT "purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "purchase_orders_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_purchase_orders" ("cmd_no", "customs_cfa", "id", "ordered_at", "price_buy_per_l", "product", "qty_ordered_l", "status", "supplier_id", "transit_cfa") SELECT "cmd_no", "customs_cfa", "id", "ordered_at", "price_buy_per_l", "product", "qty_ordered_l", "status", "supplier_id", "transit_cfa" FROM "purchase_orders";
DROP TABLE "purchase_orders";
ALTER TABLE "new_purchase_orders" RENAME TO "purchase_orders";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "banks_code_key" ON "banks"("code");

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_bank_id_account_no_key" ON "bank_accounts"("bank_id", "account_no");
