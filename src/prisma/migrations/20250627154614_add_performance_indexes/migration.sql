-- CreateIndex
CREATE INDEX "Orders_clientId_idx" ON "Orders"("clientId");

-- CreateIndex
CREATE INDEX "Orders_companyId_idx" ON "Orders"("companyId");

-- CreateIndex
CREATE INDEX "Orders_status_idx" ON "Orders"("status");

-- CreateIndex
CREATE INDEX "Orders_createdAt_idx" ON "Orders"("createdAt");

-- CreateIndex
CREATE INDEX "Orders_updatedAt_idx" ON "Orders"("updatedAt");

-- CreateIndex (Compound)
CREATE INDEX "Orders_clientId_status_idx" ON "Orders"("clientId", "status");

-- CreateIndex (Compound)
CREATE INDEX "Orders_companyId_status_idx" ON "Orders"("companyId", "status");

-- CreateIndex (Compound)
CREATE INDEX "Orders_status_createdAt_idx" ON "Orders"("status", "createdAt"); 