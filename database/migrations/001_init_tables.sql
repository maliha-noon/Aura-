DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `personal_access_tokens`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `attendances`;
DROP TABLE IF EXISTS `sessions`;

-- Users Table
CREATE TABLE `users` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `phone` VARCHAR(20),
    `email_verified_at` TIMESTAMP,
    `password` VARCHAR(255) NOT NULL,
    `provider` VARCHAR(255),
    `provider_id` VARCHAR(255),
    `role` VARCHAR(255) DEFAULT 'user',
    `avatar` VARCHAR(255),
    `last_login_at` TIMESTAMP,
    `is_active` INTEGER DEFAULT 1,
    `remember_token` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP
);

-- Events Table
CREATE TABLE `events` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `date` TIMESTAMP NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255),
    `price` DECIMAL(8, 2) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE `bookings` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `user_id` INTEGER NOT NULL,
    `event_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(255) DEFAULT 'confirmed',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
);

-- Legacy Tables (Optional, keeping for compatibility if needed)
CREATE TABLE `sessions` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `duration` INTEGER NOT NULL,
    `active` BOOLEAN DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

