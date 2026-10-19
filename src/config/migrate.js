const sequelize = require('./db');

module.exports = async () => {
  await sequelize.query(`
    ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "role" VARCHAR(20) NOT NULL DEFAULT 'patient'
  `);
  await sequelize.query('ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT \'patient\'');
  await sequelize.query(`
    ALTER TABLE "patients"
    ADD COLUMN IF NOT EXISTS "userId" INTEGER
  `);
  await sequelize.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS "patients_userId_unique"
    ON "patients" ("userId") WHERE "userId" IS NOT NULL
  `);
  await sequelize.query(`
    DO $$ BEGIN
      ALTER TABLE "patients"
      ADD CONSTRAINT "patients_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);
  await sequelize.query(`
    DO $$ BEGIN
      ALTER TABLE "users"
      ADD CONSTRAINT "users_role_check"
      CHECK ("role" IN ('patient', 'doctor', 'other'));
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);
};