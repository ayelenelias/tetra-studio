-- Ejecutar dentro de la base MySQL creada previamente desde hPanel.
-- No incluye CREATE DATABASE porque el hosting compartido administra esa tarea.

CREATE TABLE IF NOT EXISTS `tetra_data` (
    `id` INT NOT NULL DEFAULT 1,
    `data` LONGTEXT NOT NULL,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
