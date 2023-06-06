-- CreateTable
CREATE TABLE "business_organization" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carbon_footprint" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "business_organization_id" UUID NOT NULL,
    "emission_source" VARCHAR(255) NOT NULL,
    "emission_value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carbon_footprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_feedback" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "business_organization_id" UUID NOT NULL,
    "feedback" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sustainability_goal" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "business_organization_id" UUID NOT NULL,
    "goal_name" VARCHAR(255) NOT NULL,
    "target_value" INTEGER NOT NULL,
    "current_value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sustainability_goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sustainability_initiative" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "business_organization_id" UUID NOT NULL,
    "initiative_name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sustainability_initiative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "roq_user_id" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waste_management" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "business_organization_id" UUID NOT NULL,
    "waste_type" VARCHAR(255) NOT NULL,
    "waste_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waste_management_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "business_organization" ADD CONSTRAINT "business_organization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carbon_footprint" ADD CONSTRAINT "carbon_footprint_business_organization_id_fkey" FOREIGN KEY ("business_organization_id") REFERENCES "business_organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_feedback" ADD CONSTRAINT "employee_feedback_business_organization_id_fkey" FOREIGN KEY ("business_organization_id") REFERENCES "business_organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_feedback" ADD CONSTRAINT "employee_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sustainability_goal" ADD CONSTRAINT "sustainability_goal_business_organization_id_fkey" FOREIGN KEY ("business_organization_id") REFERENCES "business_organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sustainability_initiative" ADD CONSTRAINT "sustainability_initiative_business_organization_id_fkey" FOREIGN KEY ("business_organization_id") REFERENCES "business_organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "waste_management" ADD CONSTRAINT "waste_management_business_organization_id_fkey" FOREIGN KEY ("business_organization_id") REFERENCES "business_organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

