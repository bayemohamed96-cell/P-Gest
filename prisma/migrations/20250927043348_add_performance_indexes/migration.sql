-- CreateIndex
CREATE INDEX "bank_accounts_bank_id_idx" ON "bank_accounts"("bank_id");

-- CreateIndex
CREATE INDEX "bank_accounts_active_idx" ON "bank_accounts"("active");

-- CreateIndex
CREATE INDEX "expenses_bank_account_id_idx" ON "expenses"("bank_account_id");

-- CreateIndex
CREATE INDEX "expenses_date_idx" ON "expenses"("date");

-- CreateIndex
CREATE INDEX "invoice_lines_invoice_id_idx" ON "invoice_lines"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_lines_lot_trip_id_idx" ON "invoice_lines"("lot_trip_id");

-- CreateIndex
CREATE INDEX "invoices_lot_id_idx" ON "invoices"("lot_id");

-- CreateIndex
CREATE INDEX "invoices_customer_id_idx" ON "invoices"("customer_id");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "loans_bank_account_id_idx" ON "loans"("bank_account_id");

-- CreateIndex
CREATE INDEX "loans_due_at_idx" ON "loans"("due_at");

-- CreateIndex
CREATE INDEX "lot_trips_lot_id_idx" ON "lot_trips"("lot_id");

-- CreateIndex
CREATE INDEX "lot_trips_driver_id_idx" ON "lot_trips"("driver_id");

-- CreateIndex
CREATE INDEX "lot_trips_destination_id_idx" ON "lot_trips"("destination_id");

-- CreateIndex
CREATE INDEX "lot_trips_cistern_id_idx" ON "lot_trips"("cistern_id");

-- CreateIndex
CREATE INDEX "lot_trips_tractor_id_idx" ON "lot_trips"("tractor_id");

-- CreateIndex
CREATE INDEX "lots_product_idx" ON "lots"("product");

-- CreateIndex
CREATE INDEX "lots_started_at_idx" ON "lots"("started_at");

-- CreateIndex
CREATE INDEX "payments_in_customer_id_idx" ON "payments_in"("customer_id");

-- CreateIndex
CREATE INDEX "payments_in_date_idx" ON "payments_in"("date");

-- CreateIndex
CREATE INDEX "payments_in_bank_account_id_idx" ON "payments_in"("bank_account_id");

-- CreateIndex
CREATE INDEX "payments_out_supplier_id_idx" ON "payments_out"("supplier_id");

-- CreateIndex
CREATE INDEX "payments_out_date_idx" ON "payments_out"("date");

-- CreateIndex
CREATE INDEX "payments_out_bank_account_id_idx" ON "payments_out"("bank_account_id");

-- CreateIndex
CREATE INDEX "pricing_rules_destination_id_product_valid_from_idx" ON "pricing_rules"("destination_id", "product", "valid_from");

-- CreateIndex
CREATE INDEX "purchase_orders_supplier_id_idx" ON "purchase_orders"("supplier_id");

-- CreateIndex
CREATE INDEX "purchase_orders_bank_account_id_idx" ON "purchase_orders"("bank_account_id");

-- CreateIndex
CREATE INDEX "purchase_orders_status_idx" ON "purchase_orders"("status");

-- CreateIndex
CREATE INDEX "purchase_receipts_po_id_idx" ON "purchase_receipts"("po_id");

-- CreateIndex
CREATE INDEX "transport_rules_destination_id_valid_from_idx" ON "transport_rules"("destination_id", "valid_from");
