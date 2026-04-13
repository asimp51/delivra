/**
 * Initial Database Migration
 *
 * IMPORTANT: In production, set synchronize: false in app.module.ts
 * and use this migration instead:
 *
 *   npm run migration:run
 *
 * This creates all tables with proper indexes and constraints.
 * TypeORM auto-sync is convenient for development but dangerous in production
 * because it can drop columns/tables when entities change.
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000001 implements MigrationInterface {
  name = 'InitialSchema1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "postgis"`);

    // Users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "phone" VARCHAR(20) UNIQUE,
        "password_hash" VARCHAR(255) NOT NULL,
        "full_name" VARCHAR(255) NOT NULL,
        "avatar_url" TEXT,
        "role" VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'vendor_owner', 'rider', 'admin')),
        "is_verified" BOOLEAN DEFAULT false,
        "is_active" BOOLEAN DEFAULT true,
        "fcm_token" TEXT,
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Addresses
    await queryRunner.query(`
      CREATE TABLE "addresses" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "user_id" UUID REFERENCES "users"(id) ON DELETE CASCADE,
        "label" VARCHAR(50) DEFAULT 'Home',
        "address_line_1" VARCHAR(255) NOT NULL,
        "address_line_2" VARCHAR(255),
        "city" VARCHAR(100) NOT NULL,
        "latitude" DECIMAL(10,8) NOT NULL,
        "longitude" DECIMAL(11,8) NOT NULL,
        "is_default" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Categories (self-referencing tree)
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "parent_id" UUID REFERENCES "categories"(id) ON DELETE SET NULL,
        "name" VARCHAR(255) NOT NULL,
        "name_ar" VARCHAR(255),
        "slug" VARCHAR(255) UNIQUE NOT NULL,
        "description" TEXT,
        "icon_url" TEXT,
        "image_url" TEXT,
        "sort_order" INTEGER DEFAULT 0,
        "is_active" BOOLEAN DEFAULT true,
        "metadata" JSONB DEFAULT '{}',
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_categories_parent ON categories(parent_id)`);
    await queryRunner.query(`CREATE INDEX idx_categories_slug ON categories(slug)`);
    await queryRunner.query(`CREATE INDEX idx_categories_active ON categories(is_active, sort_order)`);

    // Category Attributes
    await queryRunner.query(`
      CREATE TABLE "category_attributes" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "category_id" UUID REFERENCES "categories"(id) ON DELETE CASCADE,
        "attribute_name" VARCHAR(100) NOT NULL,
        "attribute_type" VARCHAR(20) DEFAULT 'text' CHECK (attribute_type IN ('text','number','boolean','select','multi_select')),
        "options" JSONB DEFAULT '[]',
        "is_required" BOOLEAN DEFAULT false,
        "sort_order" INTEGER DEFAULT 0,
        "created_at" TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Vendors
    await queryRunner.query(`
      CREATE TABLE "vendors" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "owner_id" UUID REFERENCES "users"(id) ON DELETE CASCADE,
        "category_id" UUID REFERENCES "categories"(id),
        "name" VARCHAR(255) NOT NULL,
        "slug" VARCHAR(255) UNIQUE,
        "description" TEXT,
        "logo_url" TEXT,
        "cover_image_url" TEXT,
        "phone" VARCHAR(20),
        "email" VARCHAR(255),
        "address_line" VARCHAR(255),
        "latitude" DECIMAL(10,8),
        "longitude" DECIMAL(11,8),
        "avg_rating" DECIMAL(3,2) DEFAULT 0,
        "total_ratings" INTEGER DEFAULT 0,
        "min_order_amount" DECIMAL(10,2) DEFAULT 0,
        "delivery_fee" DECIMAL(10,2) DEFAULT 0,
        "avg_prep_time_min" INTEGER,
        "is_open" BOOLEAN DEFAULT false,
        "is_verified" BOOLEAN DEFAULT false,
        "is_active" BOOLEAN DEFAULT true,
        "commission_rate" DECIMAL(5,2) DEFAULT 15.00,
        "metadata" JSONB DEFAULT '{}',
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Vendor Schedules
    await queryRunner.query(`
      CREATE TABLE "vendor_schedules" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "vendor_id" UUID REFERENCES "vendors"(id) ON DELETE CASCADE,
        "day_of_week" SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
        "open_time" TIME NOT NULL,
        "close_time" TIME NOT NULL,
        "is_closed" BOOLEAN DEFAULT false
      )
    `);

    // Vendor Items
    await queryRunner.query(`
      CREATE TABLE "vendor_items" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "vendor_id" UUID REFERENCES "vendors"(id) ON DELETE CASCADE,
        "subcategory_id" UUID REFERENCES "categories"(id),
        "name" VARCHAR(255) NOT NULL,
        "name_ar" VARCHAR(255),
        "description" TEXT,
        "price" DECIMAL(10,2) NOT NULL,
        "discounted_price" DECIMAL(10,2),
        "image_url" TEXT,
        "is_available" BOOLEAN DEFAULT true,
        "sort_order" INTEGER DEFAULT 0,
        "attributes" JSONB DEFAULT '{}',
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_vendor_items_vendor ON vendor_items(vendor_id, is_available)`);

    // Item Option Groups & Options
    await queryRunner.query(`
      CREATE TABLE "item_option_groups" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "vendor_item_id" UUID REFERENCES "vendor_items"(id) ON DELETE CASCADE,
        "name" VARCHAR(100) NOT NULL,
        "min_selections" INTEGER DEFAULT 0,
        "max_selections" INTEGER DEFAULT 1,
        "sort_order" INTEGER DEFAULT 0
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "item_options" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "group_id" UUID REFERENCES "item_option_groups"(id) ON DELETE CASCADE,
        "name" VARCHAR(100) NOT NULL,
        "price_modifier" DECIMAL(10,2) DEFAULT 0,
        "is_available" BOOLEAN DEFAULT true,
        "sort_order" INTEGER DEFAULT 0
      )
    `);

    // Orders
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "order_number" VARCHAR(20) UNIQUE NOT NULL,
        "customer_id" UUID REFERENCES "users"(id),
        "vendor_id" UUID REFERENCES "vendors"(id),
        "rider_id" UUID REFERENCES "users"(id),
        "delivery_address_id" UUID REFERENCES "addresses"(id),
        "status" VARCHAR(20) DEFAULT 'pending',
        "subtotal" DECIMAL(10,2) NOT NULL,
        "delivery_fee" DECIMAL(10,2) DEFAULT 0,
        "discount_amount" DECIMAL(10,2) DEFAULT 0,
        "tax_amount" DECIMAL(10,2) DEFAULT 0,
        "total" DECIMAL(10,2) NOT NULL,
        "payment_method" VARCHAR(10) DEFAULT 'cash',
        "payment_status" VARCHAR(10) DEFAULT 'pending',
        "special_instructions" TEXT,
        "estimated_delivery" TIMESTAMPTZ,
        "actual_delivery" TIMESTAMPTZ,
        "cancelled_by" VARCHAR(50),
        "cancel_reason" TEXT,
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_orders_customer ON orders(customer_id, created_at DESC)`);
    await queryRunner.query(`CREATE INDEX idx_orders_vendor ON orders(vendor_id, status)`);
    await queryRunner.query(`CREATE INDEX idx_orders_status ON orders(status)`);

    // Order Items
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "order_id" UUID REFERENCES "orders"(id) ON DELETE CASCADE,
        "vendor_item_id" UUID REFERENCES "vendor_items"(id),
        "quantity" INTEGER NOT NULL,
        "unit_price" DECIMAL(10,2) NOT NULL,
        "total_price" DECIMAL(10,2) NOT NULL,
        "special_instructions" TEXT,
        "selected_options" JSONB DEFAULT '[]'
      )
    `);

    // Order Status History
    await queryRunner.query(`
      CREATE TABLE "order_status_history" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "order_id" UUID REFERENCES "orders"(id) ON DELETE CASCADE,
        "status" VARCHAR(50) NOT NULL,
        "changed_by" VARCHAR(255),
        "note" TEXT,
        "created_at" TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Reviews
    await queryRunner.query(`
      CREATE TABLE "reviews" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "order_id" UUID UNIQUE REFERENCES "orders"(id),
        "customer_id" UUID REFERENCES "users"(id),
        "vendor_id" UUID REFERENCES "vendors"(id),
        "rider_id" UUID,
        "vendor_rating" SMALLINT CHECK (vendor_rating BETWEEN 1 AND 5),
        "rider_rating" SMALLINT CHECK (rider_rating BETWEEN 1 AND 5),
        "comment" TEXT,
        "created_at" TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Riders
    await queryRunner.query(`
      CREATE TABLE "riders" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "user_id" UUID UNIQUE REFERENCES "users"(id),
        "vehicle_type" VARCHAR(20) DEFAULT 'motorcycle',
        "license_plate" VARCHAR(20),
        "is_online" BOOLEAN DEFAULT false,
        "is_on_delivery" BOOLEAN DEFAULT false,
        "active_delivery_count" INTEGER DEFAULT 0,
        "max_concurrent_orders" INTEGER DEFAULT 2,
        "current_latitude" DECIMAL(10,8),
        "current_longitude" DECIMAL(11,8),
        "avg_rating" DECIMAL(3,2) DEFAULT 0,
        "total_deliveries" INTEGER DEFAULT 0,
        "wallet_balance" DECIMAL(10,2) DEFAULT 0,
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_riders_available ON riders(is_online, is_on_delivery) WHERE is_online = true`);

    // Delivery Assignments
    await queryRunner.query(`
      CREATE TABLE "delivery_assignments" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "order_id" UUID REFERENCES "orders"(id),
        "rider_id" UUID REFERENCES "riders"(id),
        "status" VARCHAR(20) DEFAULT 'offered',
        "offered_at" TIMESTAMPTZ DEFAULT NOW(),
        "accepted_at" TIMESTAMPTZ,
        "completed_at" TIMESTAMPTZ
      )
    `);

    // Rider Location Log
    await queryRunner.query(`
      CREATE TABLE "rider_location_log" (
        "id" BIGSERIAL PRIMARY KEY,
        "rider_id" UUID REFERENCES "riders"(id),
        "order_id" UUID,
        "latitude" DECIMAL(10,8) NOT NULL,
        "longitude" DECIMAL(11,8) NOT NULL,
        "recorded_at" TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Payments
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "order_id" UUID REFERENCES "orders"(id),
        "amount" DECIMAL(10,2) NOT NULL,
        "method" VARCHAR(50) NOT NULL,
        "provider_ref" VARCHAR(255),
        "status" VARCHAR(20) DEFAULT 'pending',
        "created_at" TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Promotions
    await queryRunner.query(`
      CREATE TABLE "promotions" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "code" VARCHAR(50) UNIQUE NOT NULL,
        "type" VARCHAR(20) NOT NULL,
        "value" DECIMAL(10,2) NOT NULL,
        "min_order_amount" DECIMAL(10,2) DEFAULT 0,
        "max_discount" DECIMAL(10,2),
        "category_id" UUID,
        "vendor_id" UUID,
        "max_uses" INTEGER,
        "used_count" INTEGER DEFAULT 0,
        "starts_at" TIMESTAMPTZ NOT NULL,
        "expires_at" TIMESTAMPTZ NOT NULL,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Notifications
    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        "user_id" UUID REFERENCES "users"(id),
        "title" VARCHAR(255) NOT NULL,
        "body" TEXT NOT NULL,
        "type" VARCHAR(50) DEFAULT 'system',
        "data" JSONB DEFAULT '{}',
        "is_read" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    console.log('[Migration] Initial schema created successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'notifications', 'promotions', 'payments', 'rider_location_log',
      'delivery_assignments', 'riders', 'reviews', 'order_status_history',
      'order_items', 'orders', 'item_options', 'item_option_groups',
      'vendor_items', 'vendor_schedules', 'vendors', 'category_attributes',
      'categories', 'addresses', 'users',
    ];
    for (const table of tables) {
      await queryRunner.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
    }
  }
}
