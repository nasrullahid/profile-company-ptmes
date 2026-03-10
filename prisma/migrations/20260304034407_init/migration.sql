-- CreateTable
CREATE TABLE "site_contents" (
    "id" SERIAL NOT NULL,
    "section" TEXT NOT NULL,
    "content_key" TEXT NOT NULL,
    "content_value" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "site_contents_section_content_key_key" ON "site_contents"("section", "content_key");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
