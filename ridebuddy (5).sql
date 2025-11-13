-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 13, 2025 at 09:23 AM
-- Server version: 10.6.22-MariaDB-0ubuntu0.22.04.1
-- PHP Version: 8.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ridebuddy`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` tinyint(4) DEFAULT 1,
  `wallet` decimal(10,2) DEFAULT 0.00,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `status`, `wallet`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@example.com', 'admin@123', 1, 32987.30, '2025-06-20 16:34:33', '2025-11-11 14:54:29');

-- --------------------------------------------------------

--
-- Table structure for table `admin_settings`
--

CREATE TABLE `admin_settings` (
  `id` int(11) NOT NULL,
  `site_name` varchar(255) NOT NULL,
  `site_logo` varchar(255) DEFAULT NULL,
  `favicon` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_settings`
--

INSERT INTO `admin_settings` (`id`, `site_name`, `site_logo`, `favicon`, `created_at`, `updated_at`) VALUES
(1, 'Ridesbuddy', '/uploads/logo/1759918788335.png', 'dfgh', '2025-10-08 04:06:53', '2025-10-08 10:20:07');

-- --------------------------------------------------------

--
-- Table structure for table `CarBrand`
--

CREATE TABLE `CarBrand` (
  `brand_id` int(11) NOT NULL,
  `brand_name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `CarBrand`
--

INSERT INTO `CarBrand` (`brand_id`, `brand_name`, `image`) VALUES
(1, 'Maruti Suzuki', 'uploads/car/carBrand/suzuki name .png'),
(2, 'Hyundai', 'uploads/car/carBrand/hyundai name .jpeg'),
(3, 'Mahindra', 'uploads/car/carBrand/mahindra.png'),
(4, 'Tata', 'uploads/car/carBrand/tata name.png'),
(5, 'Toyota', 'uploads/car/carBrand/toyota image.png'),
(6, 'Audi', 'uploads/car/carBrand/Audiname.webp'),
(7, 'BMW', 'uploads/car/carBrand/Bmw.png'),
(8, 'Mercedes', 'uploads/car/carBrand/mercedsename.png'),
(9, 'Volvo', 'uploads/car/carBrand/volvo.jpeg'),
(10, 'KIA', 'uploads/car/carBrand/KIA.png'),
(11, 'Honda', 'uploads/car/carBrand/honda.png'),
(12, 'Renault', 'uploads/car/carBrand/Renaultname.jpeg'),
(13, 'Volkswagen', 'uploads/car/carBrand/Volkswagen name.jpeg'),
(14, 'Skoda', 'uploads/car/carBrand/Skodaname.png'),
(15, 'MG', 'uploads/car/carBrand/mg.jpeg'),
(16, 'Jeep', 'uploads/car/carBrand/Jeep.jpeg'),
(17, 'Nissan', 'uploads/car/carBrand/Nissan.jpeg'),
(18, 'Citroen', 'uploads/car/carBrand/Citroen.jpeg'),
(19, 'BYD', 'uploads/car/carBrand/byd.jpeg'),
(20, 'Tesla', 'uploads/car/carBrand/Tesla_logo.png'),
(21, 'Vinfast', 'uploads/car/carBrand/vinfast name.jpeg'),
(22, 'KIA', NULL),
(23, 'KIA', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `CarModel`
--

CREATE TABLE `CarModel` (
  `model_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `model_name` varchar(200) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `sub_category` varchar(200) DEFAULT NULL,
  `fuel_type` varchar(200) DEFAULT NULL,
  `transmission` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `CarModel`
--

INSERT INTO `CarModel` (`model_id`, `brand_id`, `model_name`, `category`, `sub_category`, `fuel_type`, `transmission`, `notes`, `image`) VALUES
(1, 1, 'Dzire', 'Sedan', 'Compact Sedan', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/suzuki/dzire.jpg'),
(2, 1, 'XL6', 'MUV', 'Mid-Size MUV', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/suzuki/xl6.jpg'),
(3, 1, 'Fronx', 'SUV', 'Compact SUV', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/suzuki/fronx.jpg'),
(4, 1, 'Baleno', 'Hatchback', 'Premium Hatchback', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/suzuki/baleno.jpg'),
(5, 1, 'Brezza', 'SUV', 'Compact SUV', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/suzuki/brezza.jpg'),
(6, 1, 'Celerio', 'Hatchback', 'Mid-Size Hatchback', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/suzuki/celerio.jpg'),
(7, 1, 'Ciaz', 'Sedan', 'Mid-Size Sedan', 'Petrol', 'Manual, Automatic', NULL, 'uploads/car/carModel/suzuki/ciaz.jpg'),
(8, 1, 'Eeco', 'Van', 'Van', 'Petrol, CNG', 'Manual', NULL, 'uploads/car/carModel/suzuki/eeco.jpg'),
(9, 1, 'Ertiga', 'MUV', 'Mid-Size MUV', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/suzuki/ertiga.jpg'),
(10, 1, 'Ignis', 'SUV', 'Micro SUV', 'Petrol', 'Manual, Automatic', NULL, 'uploads/car/carModel/suzuki/ignis.jpg'),
(11, 1, 'Grand Vitara', 'SUV', 'Hybrid SUV', 'Petrol, CNG, Hybrid', 'Manual, Automatic', NULL, 'uploads/car/carModel/suzuki/grand_vitara.jpg'),
(12, 1, 'Invicto', 'MUV', 'MUV', 'Hybrid', 'Automatic', NULL, 'uploads/car/carModel/suzuki/invicto.jpg'),
(13, 1, 'Jimny', 'SUV', 'Compact 4x4 SUV', 'Petrol', 'Manual, Automatic', 'Also known as New Gypsy', 'uploads/car/carModel/suzuki/jimny.jpg'),
(14, 1, 'S-Presso', 'Hatchback', 'Entry Level Hatchback', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/suzuki/s_presso.jpg'),
(15, 1, 'Swift', 'Hatchback', 'Mid-Size Hatchback', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/suzuki/swift.jpg'),
(16, 1, 'Wagon-R', 'Hatchback', 'Mid-Size Hatchback', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/suzuki/wagon_r.jpg'),
(17, 1, 'Grand Vitara XL7', 'SUV', '7 Seater Mid-Size SUV', 'Petrol', 'Manual, Automatic', 'Upcoming', 'uploads/car/carModel/suzuki/grand_vitara.jpg'),
(18, 1, 'Alto', 'Hatchback', 'Entry Level Hatchback', 'Petrol, CNG', 'Manual', NULL, 'uploads/car/carModel/suzuki/alto.jpg'),
(19, 1, 'Alto K10', 'Hatchback', 'Entry Level Hatchback', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/suzuki/alto_K10.jpg'),
(20, 2, 'Creta Electric', 'SUV', 'Mid-Size SUV (Electric)', 'Electric', 'Automatic', NULL, NULL),
(21, 2, 'Alcazar', 'SUV', 'Mid-Size SUV / Full-Size 7 Seater (listed twice)', 'Petrol, Diesel', 'Manual, Automatic', NULL, NULL),
(22, 2, 'New i20', 'Hatchback', 'Premium Hatchback', 'Petrol', 'Manual, Automatic', NULL, NULL),
(23, 2, 'Creta N Line', 'SUV', 'Mid-Size SUV (Performance N Line)', 'Petrol', 'Manual, Automatic', NULL, NULL),
(24, 2, 'Grand i10 Nios', 'Hatchback', 'Mid-size Hatchback', 'Petrol, CNG', 'Manual, Automatic', NULL, NULL),
(25, 2, 'i20 N Line', 'Hatchback', 'Premium Hatchback (N Line)', 'Petrol', 'Manual, Automatic', NULL, NULL),
(26, 2, 'Ioniq 5', 'SUV', 'Hybrid/EV SUV', 'Electric / Hybrid', 'Automatic', NULL, NULL),
(27, 2, 'Kona Electric', 'SUV', 'Mid-Size SUV (Electric)', 'Electric', 'Automatic', NULL, NULL),
(28, 2, 'Creta', 'SUV', 'Mid-Size SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, NULL),
(29, 2, 'Verna', 'Sedan', 'Mid-Size Sedan', 'Petrol, Diesel', 'Manual, Automatic', NULL, NULL),
(30, 2, 'Tucson', 'SUV', 'Mid-Size SUV', 'Petrol, Diesel', 'Automatic', NULL, NULL),
(31, 2, 'Venue', 'SUV', 'Compact SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, NULL),
(32, 2, 'Venue N Line', 'SUV', 'Compact SUV (N Line)', 'Petrol', 'Manual, Automatic', NULL, NULL),
(33, 2, 'Aura', 'Sedan', 'Compact Sedan', 'Petrol, CNG', 'Manual, Automatic', NULL, NULL),
(34, 2, 'Exter', 'SUV', 'Compact SUV', 'Petrol, CNG', 'Manual, Automatic', NULL, NULL),
(35, 3, 'Xev 9e', 'SUV', 'Luxury SUV (Electric)', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Mahindra/mahindra xev 9e.jpg'),
(36, 3, 'BE 6', 'SUV', 'Luxury SUV (Electric)', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Mahindra/Mahindra be-6e.png'),
(37, 3, 'Bolero Neo Plus', 'SUV', 'Compact SUV', 'Diesel', 'Manual', NULL, 'uploads/car/carModel/Mahindra/bolero-neo-plus.png'),
(38, 3, 'Thar Roxx', 'SUV', '4x4 SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/Mahindra/mahindra thar roxx.jpg'),
(39, 3, 'Bolero', 'SUV', 'Mid-Size SUV', 'Diesel', 'Manual', NULL, 'uploads/car/carModel/Mahindra/mahindra bolero.jpg'),
(40, 3, 'Bolero Neo', 'SUV', 'Mid-Size SUV', 'Diesel', 'Manual', NULL, 'uploads/car/carModel/Mahindra/mahindra bolero neo.jpg'),
(41, 3, 'Marazzo', 'MUV', 'Mid-Size MUV', 'Diesel', 'Manual', NULL, 'uploads/car/carModel/Mahindra/mahindra marazzo.jpg'),
(42, 3, 'Scorpio Classic', 'SUV', 'Mid-Size SUV', 'Diesel', 'Manual', NULL, 'uploads/car/carModel/Mahindra/mahindra scorpio classic.jpg'),
(43, 3, 'Scorpio N', 'SUV', 'Mid-Size SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/Mahindra/mahindra scorpio n.jpg'),
(44, 3, 'Thar', 'SUV', 'Compact 4x4 SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/Mahindra/thar.jpg'),
(45, 3, 'XUV 300', 'SUV', 'Compact SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/Mahindra/mahindra xuv 300.jpg'),
(46, 3, 'XUV700', 'SUV', 'Full-Size SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/Mahindra/mahindra xuv 700.jpg'),
(47, 3, 'XUV400', 'SUV', 'Full-Size SUV (Electric)', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Mahindra/mahindra xuv 400.jpg'),
(48, 3, 'X3O', 'SUV', 'Compact SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/Mahindra/mahindra xuv 3xo.jpg'),
(49, 4, 'Harrier EV', 'SUV', 'Mid-Size SUV (Electric)', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Tata/tata_harrier_ev.png'),
(50, 4, 'Curvv', 'SUV', 'SUV Coupe', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/Tata/Tata_Curvv.ev.jpg'),
(51, 4, 'Curvv EV', 'SUV', 'SUV Coupe (Electric)', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Tata/curv_kev.jpg'),
(52, 4, 'Altroz', 'Hatchback', 'Premium Hatchback', 'Petrol, Diesel, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/Tata/Tata_Altroz_Key.jpg'),
(53, 4, 'Harrier', 'SUV', 'Mid-Size SUV', 'Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/Tata/Tata_Harrier.jpg'),
(54, 4, 'Nexon', 'SUV', 'Compact SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/Tata/Tata_Nexon.jpg'),
(55, 4, 'Nexon EV', 'SUV', 'Compact SUV (Electric)', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Tata/Tata_Nexon_EV.jpg'),
(56, 4, 'Punch', 'SUV', 'Micro SUV', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/Tata/Tata_Punch.jpg'),
(57, 4, 'Punch EV', 'SUV', 'Micro SUV (Electric)', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Tata/Tata_Punch.eV.jpg'),
(58, 4, 'Safari', 'SUV', 'Full-Size 7 Seater SUV', 'Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/Tata/Tata_Safari.jpg'),
(59, 4, 'Tiago', 'Hatchback', 'Mid-Size Hatchback', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/Tata/Tata_Tiago.jpg'),
(60, 4, 'Tiago EV', 'Hatchback', 'Mid-Size Hatchback (Electric)', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Tata/Tata_Tiago_EV.jpg'),
(61, 4, 'Tigor', 'Sedan', 'Compact Sedan', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/Tata/Tata_Tigor.jpg'),
(62, 4, 'Tigor EV', 'Sedan', 'Compact Sedan (Electric)', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Tata/Tata_Tigor_EV.jpg'),
(63, 5, 'Camry', 'Sedan', 'Premium Sedan (Hybrid)', 'Hybrid', 'Automatic', NULL, 'uploads/car/carModel/Toyota/toyota_camry.webp'),
(64, 5, 'Fortuner', 'SUV', 'Full-Size SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/Toyota/toyota fortuner.png'),
(65, 5, 'Glanza', 'Hatchback', 'Premium Hatchback', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/Toyota/toyotaglanza.jpg'),
(66, 5, 'Hilux', 'Pickup', 'Pickup Truck', 'Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/Toyota/toyota hilux.png'),
(67, 5, 'Innova Crysta', 'MPV', 'Premium MPV', 'Petrol, Diesel', 'Manual', NULL, 'uploads/car/carModel/Toyota/toyota inova crysta.jpg'),
(68, 5, 'Innova Hycross', 'MPV', 'Premium MPV', 'Petrol, Hybrid', 'Automatic', NULL, 'uploads/car/carModel/Toyota/toyota innova hycross.jpg'),
(69, 5, 'Rumion', 'MUV', 'Mid-Size MUV', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/Toyota/toyota_rumion.webp'),
(70, 5, 'Urban Cruiser Hyryder', 'SUV', 'Compact SUV (Hybrid options)', 'Petrol, Hybrid, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/Toyota/toyota urban cruiser.jpg'),
(71, 5, 'Vellfire', 'MPV', 'Luxury MPV', 'Hybrid', 'Automatic', NULL, 'uploads/car/carModel/Toyota/vellfire.jpg'),
(72, 5, 'Urban Cruiser Taisor', 'SUV', 'Compact SUV', 'Petrol, CNG', 'Manual, Automatic', NULL, 'uploads/car/carModel/Toyota/Toyota Urban Cruiser Taisor.jpg'),
(73, 6, 'RS Q8', 'SUV', 'Luxury Compact SUV', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Audi/Audi RS Q8.jpg'),
(74, 6, 'Q7', 'SUV', 'Luxury Compact SUV', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Audi/Audi Q7.jpg'),
(75, 6, 'Q8 E-Tron', 'SUV', 'Luxury Electric SUV', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Audi/Audi Q8 E-Tron.jpg'),
(76, 6, 'Q8', 'SUV', 'Luxury Compact SUV', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Audi/Audi RS Q8.jpg'),
(77, 6, 'e-tron Technology', 'SUV', 'Luxury Electric SUV', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Audi/e-tron Technology.jpg'),
(78, 6, 'AQ3', 'SUV', 'Luxury Compact SUV', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Audi/Audi AQ3.jpg'),
(79, 6, 'Q8 Sportback E-Tron', 'SUV', 'Luxury Electric SUV', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Audi/Audi Q8 Sportback E-Tron.jpg'),
(80, 6, 'RS e-tron GT', 'Sedan', 'Luxury Electric Sedan', 'Electric', 'Automatic', NULL, NULL),
(81, 6, 'A4', 'Sedan', 'Luxury Sedan', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Audi/Audi A4.jpg'),
(82, 6, 'A6', 'Sedan', 'Luxury Sedan', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Audi/Audi A6.jpg'),
(83, 6, 'A8L', 'Sedan', 'Luxury Sedan', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Audi/Audi A8L.jpg'),
(84, 6, 'RS7 Sportback', 'Coupe', 'Luxury Coupe', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Audi/Audi RS7 Sportback.jpg'),
(85, 6, 'S5', 'Coupe', 'Luxury Coupe', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Audi/Audi S5.jpg'),
(86, 7, 'iX1 LWB', 'SUV', 'Luxury Electric SUV (Long Wheelbase)', 'Electric', 'Automatic', NULL, NULL),
(87, 7, '5 Series', 'Sedan', 'Luxury Sedan', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/BMW/BMW Series 5.jpg'),
(88, 7, 'i5', 'Sedan', 'Luxury Electric Sedan', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/BMW/BMW i5.png'),
(89, 7, 'iX1', 'SUV', 'Luxury Electric SUV', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/BMW/BMW iX1.jpg'),
(90, 7, 'i7', 'Sedan', 'Luxury Electric Sedan', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/BMW/BMW i7.jpeg'),
(91, 7, 'XM', 'SUV', 'Luxury Hybrid SUV', 'Hybrid', 'Automatic', NULL, 'uploads/car/carModel/BMW/BMW XM.jpg'),
(92, 7, 'i4', 'Sedan', 'Luxury Electric Sedan', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/BMW/BMW i4.jpg'),
(93, 7, '2 Series Gran Coupe', 'Coupe', 'Luxury Coupe', 'Petrol, Diesel', 'Automatic', NULL, NULL),
(94, 7, '3 Series Gran Limousine', 'Coupe', 'Luxury Coupe', 'Petrol, Diesel', 'Automatic', NULL, 'uploads/car/carModel/BMW/BMW 3 Series Gran Limousine.jpeg'),
(95, 7, 'X3', 'SUV', 'Luxury SUV', 'Petrol, Diesel', 'Automatic', NULL, 'uploads/car/carModel/BMW/BMW X3.jpg'),
(96, 7, 'M340i', 'Sedan', 'Luxury Sedan', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/BMW/BMW M340i.jpg'),
(97, 7, '6 Series Gran Turismo', 'Coupe', 'Luxury Coupe', 'Petrol, Diesel', 'Automatic', NULL, NULL),
(98, 7, '7 Series', 'Sedan', 'Luxury Sedan', 'Petrol, Diesel', 'Automatic', NULL, NULL),
(99, 7, 'X1', 'SUV', 'Luxury Compact SUV', 'Petrol, Diesel', 'Automatic', NULL, 'uploads/car/carModel/BMW/BMW X1.jpg'),
(100, 7, 'X5', 'SUV', 'Luxury SUV', 'Petrol, Diesel', 'Automatic', NULL, 'uploads/car/carModel/BMW/BMW X5.jpg'),
(101, 7, 'X7', 'SUV', 'Luxury SUV', 'Petrol, Diesel', 'Automatic', NULL, 'uploads/car/carModel/BMW/BMW X7.jpg'),
(102, 7, 'iX', 'SUV', 'Luxury Electric SUV', 'Electric', 'Automatic', NULL, NULL),
(103, 8, 'EQA', 'Sedan', 'Luxury Electric Sedan', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Mercedes/Eqa.jpg'),
(104, 8, 'EQE', 'SUV', 'Luxury Electric SUV', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Mercedes/eqe.jpg'),
(105, 8, 'EQS', 'Coupe', 'Luxury Electric Coupe', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Mercedes/Eqs.jpg'),
(106, 8, 'GLB', 'SUV', 'Luxury Compact SUV', 'Petrol, Diesel', 'Automatic', NULL, 'uploads/car/carModel/Mercedes/Glb.jpg'),
(107, 8, 'C-Class', 'Sedan', 'Luxury Sedan', 'Petrol, Diesel', 'Automatic', NULL, NULL),
(108, 8, 'EQB', 'SUV', 'Luxury Electric SUV', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Mercedes/Eqb.jpg'),
(109, 8, 'S-Class', 'Sedan', 'Luxury Sedan', 'Diesel', 'Automatic', NULL, NULL),
(110, 8, 'C Cabriolet', 'Convertible', 'Luxury Convertible', 'Petrol', 'Automatic', NULL, NULL),
(111, 8, 'E-Class', 'Sedan', 'Luxury Sedan', 'Petrol, Diesel', 'Automatic', NULL, 'uploads/car/carModel/Mercedes/E-Class.jpg'),
(112, 8, 'EQC', 'SUV', 'Luxury Electric SUV', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/Mercedes/EQC.png'),
(113, 8, 'GLA', 'Coupe', 'Luxury Coupe', 'Petrol, Diesel', 'Automatic', NULL, 'uploads/car/carModel/Mercedes/GLA.jpg'),
(114, 8, 'GLS', 'SUV', 'Luxury Compact SUV', 'Petrol, Diesel', 'Automatic', NULL, 'uploads/car/carModel/Mercedes/GLS.jpg'),
(115, 8, 'GLE', 'SUV', 'Luxury Compact SUV', 'Petrol, Diesel', 'Automatic', NULL, 'uploads/car/carModel/Mercedes/GLE.jpg'),
(116, 8, 'GLC', 'SUV', 'Luxury Compact SUV', 'Petrol, Diesel', 'Automatic', NULL, 'uploads/car/carModel/Mercedes/GLC.jpg'),
(117, 8, 'G-Class', 'SUV', 'Luxury SUV', 'Petrol, Diesel', 'Automatic', NULL, 'uploads/car/carModel/Mercedes/G-class.jpeg'),
(118, 8, 'CLS', 'Coupe', 'Luxury Coupe', 'Diesel', 'Automatic', NULL, 'uploads/car/carModel/Mercedes/Cls.webp'),
(119, 9, 'EX 40', 'SUV', 'Luxury Compact SUV (Electric)', 'Electric', 'Automatic', NULL, NULL),
(120, 9, 'C40 Recharge', 'SUV', 'Luxury Electric SUV', 'Electric', 'Automatic', NULL, NULL),
(121, 9, 'XC40 Recharge', 'SUV', 'Luxury Electric SUV', 'Electric', 'Automatic', NULL, NULL),
(122, 9, 'S90', 'Sedan', 'Luxury Sedan', 'Petrol, Diesel', 'Automatic', NULL, NULL),
(123, 9, 'XC60', 'SUV', 'Luxury Compact SUV', 'Petrol', 'Automatic', NULL, NULL),
(124, 9, 'XC90', 'SUV', 'Luxury Compact SUV', 'Petrol', 'Automatic', NULL, NULL),
(125, 9, 'XC40', 'SUV', 'Luxury Compact SUV', 'Petrol', 'Automatic', NULL, NULL),
(126, 10, 'Carens Clavis EV', 'MPV', 'Mid-Size MPV (Electric)', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/KIA/Kia_Carens_Clavia.webp'),
(127, 10, 'Carens Clavis', 'MPV', 'Mid-Size SUV/MPV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/KIA/Kia_Carens_Clavis_Pewter.webp'),
(128, 10, 'Syros', 'SUV', 'Mid-Size SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/KIA/kia_syro.jpg'),
(129, 10, 'EV 9', 'SUV', 'Compact Electric SUV', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/KIA/kia_EV9.jpg'),
(130, 10, 'Carnival', 'MPV', 'Luxury MPV', 'Diesel', 'Automatic', NULL, 'uploads/car/carModel/KIA/kia_carnival.jpg'),
(131, 10, 'Seltos', 'SUV', 'Mid-Size SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/KIA/kia_seltos.jpg'),
(132, 10, 'Sonet', 'SUV', 'Compact SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/KIA/kia_sonet.jpg'),
(133, 10, 'Carens', 'MUV', 'Mid-Size MUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/KIA/kia_carens.jpg'),
(134, 10, 'EV6', 'SUV', 'Compact Electric SUV', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/KIA/kia_EV6.jpg'),
(135, 11, 'Amaze', 'Sedan', 'Compact Sedan', 'Petrol', 'Manual, Automatic', NULL, NULL),
(136, 11, 'City', 'Sedan', 'Mid-Size Sedan', 'Petrol', 'Manual, Automatic', NULL, NULL),
(137, 11, 'City e:HEV', 'Sedan', 'Mid-Size Full Hybrid Sedan', 'Hybrid', 'Automatic', NULL, NULL),
(138, 11, 'Elevate', 'SUV', 'SUV', 'Petrol', 'Manual, Automatic', NULL, NULL),
(139, 12, 'Triber', 'MUV', 'Compact MUV', 'Petrol', 'Manual, Automatic', NULL, 'uploads/car/carModel/Renault/triber-exterior-right-front-three-quarter-25.avif'),
(140, 12, 'Kwid', 'Hatchback', 'Entry Level Hatchback', 'Petrol', 'Manual, Automatic', NULL, 'uploads/car/carModel/Renault/kwidkwidrightfrontthreequarter.webp'),
(141, 12, 'Kiger', 'SUV', 'Compact SUV', 'Petrol', 'Manual, Automatic', NULL, 'uploads/car/carModel/Renault/kigerkigerrightfrontthreequarter.webp'),
(142, 12, 'K-ZE', 'SUV', 'Compact SUV', 'Petrol', 'Manual, Automatic', 'Upcoming', 'uploads/car/carModel/Renault/k-ze.webp'),
(143, 13, 'Golf GTI', 'Hatchback', 'Premium Hatchback', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Volkswagen/gt.png'),
(144, 13, 'Tiguan', 'SUV', 'Full-Size SUV', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Volkswagen/tiguan-full.avif'),
(145, 13, 'Taigun', 'SUV', 'Mid-Size SUV', 'Petrol', 'Manual, Automatic', NULL, 'uploads/car/carModel/Volkswagen/tiguan-mid.jpg'),
(146, 13, 'Virtus', 'Sedan', 'Mid-Size Sedan', 'Petrol', 'Manual, Automatic', NULL, 'uploads/car/carModel/Volkswagen/virtus.jpg'),
(147, 13, 'Tiguan AllSpaces', 'SUV', 'Full-Size SUV', 'Petrol', 'Automatic', 'Upcoming', 'uploads/car/carModel/Volkswagen/tiguan-all space.jpg'),
(148, 14, 'Kodiaq', 'SUV', 'Full-Size 7 Seater SUV', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Skoda/skoda kodiaq.jpg'),
(149, 14, 'Kylaq', 'SUV', 'Compact SUV', 'Petrol', 'Manual, Automatic', NULL, 'uploads/car/carModel/Skoda/skoda kylaq.jpg'),
(150, 14, 'Kushaq', 'SUV', 'Compact SUV', 'Petrol', 'Manual, Automatic', NULL, 'uploads/car/carModel/Skoda/skoda kushaq.jpg'),
(151, 14, 'Octavia', 'Sedan', 'Premium Sedan', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Skoda/skoda octavia.png'),
(152, 14, 'Superb', 'Sedan', 'Premium Sedan', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Skoda/skoda superb.jpg'),
(153, 14, 'Slavia', 'Sedan', 'Mid-Size Sedan', 'Petrol', 'Manual, Automatic', NULL, 'uploads/car/carModel/Skoda/skoda slavia.jpg'),
(154, 15, 'Cyberster', 'Sedan', 'Mid-Range Sedan (Electric)', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/MG/MGCyberster.jpg'),
(155, 15, 'M9', 'MPV', 'Premium MPV (Electric)', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/MG/MG_M9.jpeg'),
(156, 15, 'Majestor', 'SUV', 'Full-Size SUV', 'Diesel', 'Automatic', NULL, 'uploads/car/carModel/MG/MG_Majestor_2025.jpg'),
(157, 15, 'Windsor EV', 'SUV', 'Full-Size CUV (Electric)', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/MG/MGWindsorEV.jpg'),
(158, 15, 'Gloster', 'SUV', 'Full-Size SUV', 'Diesel', 'Automatic', NULL, 'uploads/car/carModel/MG/MGGloster.jpg'),
(159, 15, 'Hector', 'SUV', 'Mid-Size SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/MG/MGHector.jpg'),
(160, 15, 'Hector Plus', 'SUV', 'Mid-Size SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/MG/MGHectorPlus.jpg'),
(161, 15, 'ZS-EV', 'SUV', 'Mid-Size SUV (Electric)', 'Electric', 'Automatic', NULL, 'uploads/car/carModel/MG/MG_ZS.jpg'),
(162, 15, 'Astor', 'SUV', 'Mid-Size SUV', 'Petrol', 'Manual, Automatic', NULL, 'uploads/car/carModel/MG/MGAstor.jpg'),
(163, 16, 'Compass', 'SUV', 'Mid-Size SUV', 'Petrol, Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/Jeep/JeepCompass.jpg'),
(164, 16, 'Wrangler', 'SUV', 'Mid-Size SUV', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Jeep/JeepWrangler.jpg'),
(165, 16, 'Meridian', 'SUV', 'Full-Size 7-Seater SUV', 'Diesel', 'Manual, Automatic', NULL, 'uploads/car/carModel/Jeep/JeepMeridian.jpg'),
(166, 16, 'Grand Cherokee', 'SUV', 'Mid-Size SUV', 'Petrol', 'Automatic', NULL, 'uploads/car/carModel/Jeep/JeepGrandCherokee.jpg'),
(167, 17, 'X-Trail', 'SUV', 'Compact SUV', 'Petrol, Hybrid', 'Automatic', NULL, NULL),
(168, 17, 'Magnite', 'SUV', 'Compact SUV', 'Petrol', 'Manual, Automatic', NULL, NULL),
(169, 18, 'Basalt', 'SUV', 'SUV Coupe', 'Petrol', 'Manual, Automatic', NULL, NULL),
(170, 18, 'C3 Aircross', 'SUV', 'Full-Size SUV', 'Petrol', 'Manual, Automatic', NULL, NULL),
(171, 18, 'C3', 'Hatchback', 'Hatchback', 'Petrol', 'Manual', NULL, NULL),
(172, 18, 'e-C3', 'Hatchback', 'Hatchback (Electric)', 'Electric', 'Automatic', NULL, NULL),
(173, 18, 'C5 Aircross', 'SUV', 'Full-Size SUV', 'Diesel', 'Automatic', NULL, NULL),
(174, 19, 'SEALION 7', 'SUV', 'Mid range electric SUV', 'Electric', 'Automatic', NULL, NULL),
(175, 19, 'eMAX 7', 'SUV', 'Crossover SUV', 'Electric', 'Automatic', NULL, NULL),
(176, 19, 'BYD ATTO 3', 'SUV', 'Mid range electric SUV', 'Electric', 'Automatic', NULL, NULL),
(177, 19, 'BYD SEAL', 'Sedan', 'Luxury electric Sedan', 'Electric', 'Automatic', NULL, NULL),
(178, 20, 'Model Y', 'Sedan', 'Luxury electric Sedan (SUV-like)', 'Electric', 'Automatic', NULL, NULL),
(179, 21, 'VF 6', 'SUV', 'Compact Electric SUV', 'Electric', 'Automatic', NULL, NULL),
(180, 21, 'VF 7', 'SUV', 'Premium Electric SUV', 'Electric', 'Automatic', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `commission_settings`
--

CREATE TABLE `commission_settings` (
  `id` int(11) NOT NULL,
  `percentage` decimal(5,2) NOT NULL DEFAULT 10.00,
  `qr_image` varchar(255) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `commission_settings`
--

INSERT INTO `commission_settings` (`id`, `percentage`, `qr_image`, `updated_at`) VALUES
(1, 10.00, 'uploads/qr_1752644818018.png', '2025-07-21 12:39:38');

-- --------------------------------------------------------

--
-- Table structure for table `due_payments`
--

CREATE TABLE `due_payments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_mode` tinyint(4) NOT NULL COMMENT '0=QR, 1=Online',
  `transaction_id` varchar(100) DEFAULT NULL,
  `screenshot` varchar(255) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 0 COMMENT '0=pending, 1=approved, 2=rejected',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `due_payments`
--

INSERT INTO `due_payments` (`id`, `user_id`, `amount`, `payment_mode`, `transaction_id`, `screenshot`, `status`, `created_at`) VALUES
(1, 5, 110.20, 1, 'ORD1759987698042590', NULL, 1, '2025-10-09 10:58:18'),
(2, 1, 1459.60, 1, 'ORD1760098128441892', NULL, 1, '2025-10-10 17:38:48'),
(3, 1, 1000.00, 1, 'ORD1761627430298811', NULL, 1, '2025-10-28 10:27:10');

-- --------------------------------------------------------

--
-- Table structure for table `fare_rules`
--

CREATE TABLE `fare_rules` (
  `id` int(11) NOT NULL,
  `min_km` float NOT NULL,
  `max_km` float NOT NULL,
  `rate_per_km` float NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `fare_rules`
--

INSERT INTO `fare_rules` (`id`, `min_km`, `max_km`, `rate_per_km`, `created_at`) VALUES
(1, 1, 10, 8, '2025-07-14 16:54:50'),
(2, 11, 50, 5, '2025-07-14 16:54:50'),
(3, 51, 100, 4, '2025-07-14 16:54:50'),
(12, 101, 100000, 3, '2025-07-14 16:54:50');

-- --------------------------------------------------------

--
-- Table structure for table `help_support_pages`
--

CREATE TABLE `help_support_pages` (
  `id` int(11) NOT NULL,
  `slugname` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `help_support_pages`
--

INSERT INTO `help_support_pages` (`id`, `slugname`, `content`, `status`, `created_at`) VALUES
(1, 'Contact', '<p>We’re here to help you! At Rides Buddy, your feedback and questions are important to us. If you have any queries, suggestions, or issues while using our app, feel free to reach out.</p>\n\n<p><strong>Email Support:</strong> \n    <a href=\"mailto:support@ridesbuddy.com\">support@ridesbuddy.com</a>\n</p>\n\n<p><strong>Phone Support:</strong> \n    <a href=\"tel:+917705015444\">+91-7705015444</a> </br>\n    (Available Mon–Sat, 10:00 AM – 7:00 PM IST)\n</p>\n\n<p><strong>Office Address:</strong><br>\n    Rides Buddy Technologies Pvt. Ltd.<br>\n    123, Tech Park, Sector 21,<br>\n    Bangalore, India – 560001\n</p>\n\n<p><strong>Website:</strong> \n    <a href=\"https://www.ridesbuddy.com\" target=\"_blank\">www.ridesbuddy.com</a>\n</p>\n\n<p><strong>Connect with Us:</strong><br>\n    Facebook: <a href=\"https://facebook.com/ridesbuddy\" target=\"_blank\">facebook.com/ridesbuddy</a><br>\n    Twitter/X: <a href=\"https://twitter.com/ridesbuddy\" target=\"_blank\">twitter.com/ridesbuddy</a><br>\n    Instagram: <a href=\"https://instagram.com/ridesbuddy\" target=\"_blank\">instagram.com/ridesbuddy</a>\n</p>\n', 'active', '2025-06-26 08:42:06'),
(2, 'Privacy & policy', '<h3>Privacy Policy</h3><p>We respect your privacy and ensure the protection of your data.</p>', 'active', '2025-06-26 08:42:06'),
(3, 'Terms & Conditions', '<h3>Terms of Service</h3><p>By using this app, you agree to our terms and conditions.</p>', 'active', '2025-06-26 08:42:06'),
(4, 'FAQs', '<ul><li><strong>How to book a ride?</strong><br>Tap the \"Book Now\" button on the home screen.</li><li><strong>How to cancel?</strong><br>Go to your ride history and tap \"Cancel\".</li></ul>', 'active', '2025-06-26 08:42:06');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `ride_id` int(11) DEFAULT NULL,
  `reviewer_id` int(11) DEFAULT NULL,
  `reviewee_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `ride_id`, `reviewer_id`, `reviewee_id`, `rating`, `comment`, `created_at`) VALUES
(1, 1, 2, 1, 4, NULL, '2025-10-08 19:11:21'),
(2, 6, 4, 5, 0, NULL, '2025-10-09 04:19:58'),
(3, 7, 5, 7, 5, NULL, '2025-10-09 05:26:40'),
(4, 17, 1, 9, 5, NULL, '2025-10-09 10:52:11'),
(5, 17, 4, 9, 4, NULL, '2025-10-09 10:52:13'),
(6, 18, 1, 10, 5, NULL, '2025-10-09 12:35:10'),
(7, 22, 3, 1, 4, NULL, '2025-10-09 16:29:30'),
(8, 45, 10, 1, 5, NULL, '2025-10-10 04:21:54');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `reporter_id` int(11) NOT NULL,
  `reported_user_id` int(11) NOT NULL,
  `reason` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rides`
--

CREATE TABLE `rides` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `start_address` text DEFAULT NULL,
  `start_lat` decimal(10,7) DEFAULT NULL,
  `start_lng` decimal(10,7) DEFAULT NULL,
  `start_city` varchar(100) DEFAULT NULL,
  `end_address` text DEFAULT NULL,
  `end_lat` decimal(10,7) DEFAULT NULL,
  `end_lng` decimal(10,7) DEFAULT NULL,
  `end_city` varchar(100) DEFAULT NULL,
  `ride_date` date DEFAULT NULL,
  `ride_start_time` time DEFAULT NULL,
  `ride_end_time` time DEFAULT NULL,
  `ride_end_date` date DEFAULT NULL,
  `ride_start_datetime` datetime DEFAULT NULL,
  `total_seats` int(11) DEFAULT NULL,
  `available_seats` int(11) DEFAULT NULL,
  `full_price` decimal(10,2) DEFAULT NULL,
  `vehicle_id` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT '1' COMMENT '1= active,2= complete,3=cancle,4=cancle by user, 5 = start ride by driver',
  `comment` text DEFAULT NULL,
  `toll_status` int(11) DEFAULT NULL,
  `booking_mode` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `ride_status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rides`
--

INSERT INTO `rides` (`id`, `user_id`, `start_address`, `start_lat`, `start_lng`, `start_city`, `end_address`, `end_lat`, `end_lng`, `end_city`, `ride_date`, `ride_start_time`, `ride_end_time`, `ride_end_date`, `ride_start_datetime`, `total_seats`, `available_seats`, `full_price`, `vehicle_id`, `status`, `comment`, `toll_status`, `booking_mode`, `created_at`, `updated_at`, `ride_status`) VALUES
(1, 1, '647B/B-104, Lucknow, Uttar Pradesh, 226021', 26.9228493, 80.9606425, 'lucknow', 'Gola, Gola, Uttar Pradesh, 262802', 28.0751563, 80.4632449, 'gola', '2025-10-09', '00:40:00', '04:06:00', '2025-10-09', '2025-10-09 00:40:00', 6, 5, 412.10, '6', '2', '', 1, 1, '2025-10-08 19:04:06', '2025-10-09 00:41:00', 0),
(2, 1, '85, Lucknow, Uttar Pradesh, 226021', 26.8974098, 80.9527383, 'lucknow', 'Mahatma Gandhi Road, Agra, Uttar Pradesh, 282001', 27.1766702, 78.0080745, 'kahrai', '2025-10-09', '01:13:00', '08:33:00', '2025-10-09', '2025-10-09 01:13:00', 5, 5, 880.90, '5', '2', '', 1, 1, '2025-10-08 19:38:52', '2025-10-09 01:16:19', 0),
(3, 1, '534/29, Lucknow, Uttar Pradesh, 226021', 26.8975886, 80.9527383, 'lucknow', '17, Kanpur, Uttar Pradesh, 208014', 26.4499230, 80.3318737, 'kanpur', '2025-10-09', '01:34:00', '03:33:00', '2025-10-09', '2025-10-09 01:34:00', 6, 5, 317.40, '5', '2', '', 1, 1, '2025-10-08 19:57:45', '2025-10-09 01:30:39', 0),
(4, 1, 'Deep Plaza, Lucknow, Uttar Pradesh, 226021', 26.8969944, 80.9549870, 'lko', 'Gola, Gola, Uttar Pradesh, 262802', 28.0751563, 80.4632449, 'gola', '2025-10-09', '01:37:00', '05:07:00', '2025-10-09', '2025-10-09 01:37:00', 6, 6, 419.60, '8', '2', '', 1, 1, '2025-10-08 20:03:49', '2025-10-09 01:34:10', 0),
(5, 1, 'WWVR+96P, Lucknow, Uttar Pradesh, 226031', 26.9435446, 80.9405195, 'lucknow', 'Gola, Gola, Uttar Pradesh, 262802', 28.0751563, 80.4632449, 'gola', '2025-10-09', '09:26:00', '12:48:00', '2025-10-09', '2025-10-09 09:26:00', 5, 4, 403.50, '5', '2', 'vvvv\n', 1, 1, '2025-10-09 03:50:02', '2025-10-09 12:52:49', 0),
(6, 5, '301, Lucknow, Uttar Pradesh, 226031', 26.9445181, 80.9391010, 'lucknow', 'Gola, Gola, Uttar Pradesh, 262802', 28.0751563, 80.4632449, 'gola', '2025-10-09', '09:47:00', '13:09:00', '2025-10-09', '2025-10-09 09:47:00', 6, 2, 403.00, '9', '2', '', 1, 1, '2025-10-09 04:12:03', '2025-10-09 09:50:42', 0),
(7, 7, 'VXFW+GJW, Lucknow, Uttar Pradesh, 226016', 26.8734973, 80.9958612, 'lucknow', '472, Ayodhya, Uttar Pradesh, 224123', 26.7956080, 82.2018950, 'ayodhya', '2025-10-10', '10:25:00', '13:25:00', '2025-10-10', '2025-10-10 10:25:00', 6, 4, 360.30, '10', '2', '', 1, 1, '2025-10-09 04:49:20', '2025-10-09 17:56:46', 0),
(8, 1, 'WWVQ+HW2, Malookpur, Uttar Pradesh, 226031', 26.9442087, 80.9402825, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680156, 80.6789519, 'sitapur', '2025-10-09', '12:45:00', '14:36:00', '2025-10-09', '2025-10-09 12:45:00', 6, 6, 296.40, '8', '3', '', 1, 1, '2025-10-09 07:22:43', '2025-10-09 12:52:43', 0),
(9, 1, 'WWVR+96P, Lucknow, Uttar Pradesh, 226031', 26.9435434, 80.9405205, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-09', '14:10:00', '16:01:00', '2025-10-09', '2025-10-09 14:10:00', 6, 6, 296.70, '6', '3', '', 1, 1, '2025-10-09 08:40:10', '2025-10-09 14:10:10', 0),
(10, 1, 'WWVR+96P, Lucknow, Uttar Pradesh, 226031', 26.9435584, 80.9405316, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-09', '14:30:00', '16:21:00', '2025-10-09', '2025-10-09 14:30:00', 1, 0, 296.70, '6', '2', '', 1, 1, '2025-10-09 08:42:13', '2025-10-09 14:44:44', 0),
(11, 9, 'WWVR+96P, Lucknow, Uttar Pradesh, 226031', 26.9435554, 80.9405276, 'lucknow', 'Gola, Gola, Uttar Pradesh, 262802', 28.0751563, 80.4632449, 'gola', '2025-10-09', '15:25:00', '18:47:00', '2025-10-09', '2025-10-09 15:25:00', 6, 6, 403.50, '12', '2', '', 1, 1, '2025-10-09 09:49:11', '2025-10-09 15:25:13', 0),
(12, 1, 'WWVR+96P, Lucknow, Uttar Pradesh, 226031', 26.9435709, 80.9405393, 'lucknow', 'Pocket G-27, Delhi, Delhi, 110085', 28.2997110, 77.9840117, 'delhi', '2025-10-09', '15:29:00', '23:42:00', '2025-10-09', '2025-10-09 15:29:00', 6, 6, 985.10, '8', '2', '', 1, 1, '2025-10-09 09:50:08', '2025-10-09 15:25:37', 0),
(13, 8, 'WWVR+96P, Lucknow, Uttar Pradesh, 226031', 26.9435856, 80.9405886, 'lucknow', '35FP+H98, Azamgarh, Uttar Pradesh, 276001', 26.0739138, 83.1859496, 'patkhauli', '2025-10-09', '15:25:00', '21:31:00', '2025-10-09', '2025-10-09 15:25:00', 6, 6, 731.20, '13', '2', '', 1, 1, '2025-10-09 09:52:19', '2025-10-09 15:25:55', 0),
(14, 4, 'WWVR+96P, Lucknow, Uttar Pradesh, 226031', 26.9435811, 80.9405598, 'lucknow', '11, Jaipur, Rajasthan, 302006', 26.9124335, 75.7872708, 'jaipur', '2025-10-09', '15:30:00', '04:17:00', '2025-10-10', '2025-10-09 15:30:00', 6, 6, 1534.30, '14', '3', '', 1, 1, '2025-10-09 09:54:21', '2025-10-09 15:24:21', 0),
(15, 9, 'WWVR+96P, Lucknow, Uttar Pradesh, 226031', 26.9435503, 80.9405226, 'lucknow', 'Gola, Gola, Uttar Pradesh, 262802', 28.0751563, 80.4632449, 'gola', '2025-10-09', '15:38:00', '19:00:00', '2025-10-09', '2025-10-09 15:38:00', 6, 4, 403.50, '12', '2', '', 1, 1, '2025-10-09 10:02:53', '2025-10-09 16:09:04', 0),
(16, 1, '301, Lucknow, Uttar Pradesh, 226031', 26.9443767, 80.9390701, 'lucknow', '316, anjur, Tamil Nadu, 621004', 11.1271224, 78.6568942, 'kottathur', '2025-10-09', '16:00:00', '12:25:00', '2025-10-11', '2025-10-09 16:00:00', 6, 6, 5330.80, '6', '2', '', 1, 1, '2025-10-09 10:27:20', '2025-10-09 16:14:57', 0),
(17, 9, '301, Lucknow, Uttar Pradesh, 226031', 26.9443098, 80.9391161, 'lucknow', 'Gola, Gola, Uttar Pradesh, 262802', 28.0751563, 80.4632449, 'gola', '2025-10-09', '16:21:00', '19:43:00', '2025-10-09', '2025-10-09 16:21:00', 6, 4, 403.10, '12', '2', '', 1, 1, '2025-10-09 10:42:12', '2025-10-09 16:21:37', 0),
(18, 10, 'WWVR+96P, Lucknow, Uttar Pradesh, 226031', 26.9436014, 80.9405977, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-09', '17:22:00', '19:13:00', '2025-10-09', '2025-10-09 17:22:00', 6, 5, 296.70, '15', '2', '', 1, 1, '2025-10-09 11:47:24', '2025-10-09 17:20:01', 0),
(19, 5, 'WWVR+96P, Lucknow, Uttar Pradesh, 226031', 26.9436131, 80.9405712, 'lucknow', 'H9G4+8WH, Noida, Uttar Pradesh, 201307', 28.5759152, 77.3573448, 'noida', '2025-10-09', '17:55:00', '03:50:00', '2025-10-10', '2025-10-09 17:55:00', 4, 4, 1190.90, '9', '3', '', 1, 1, '2025-10-09 12:20:06', '2025-10-09 17:50:06', 0),
(20, 7, 'H39, Lucknow, Uttar Pradesh, 226018', 26.8572004, 80.9354458, 'lucknow', 'Q555+GXH, Ballia, Uttar Pradesh, 277001', 25.7587734, 84.1602426, 'ballia', '2025-10-09', '18:05:00', '02:41:00', '2025-10-10', '2025-10-09 18:05:00', 4, 4, 1032.70, '10', '3', '', 1, 1, '2025-10-09 12:26:21', '2025-10-09 17:56:21', 0),
(21, 1, 'WWVR+96P, Lucknow, Uttar Pradesh, 226031', 26.9435264, 80.9404870, 'lucknow', 'Gola, Gola, Uttar Pradesh, 262802', 28.0751563, 80.4632449, 'gola', '2025-10-09', '18:07:00', '21:29:00', '2025-10-09', '2025-10-09 18:07:00', 6, 1, 403.50, '8', '2', '', 1, 1, '2025-10-09 12:26:40', '2025-10-09 18:07:17', 0),
(22, 1, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980137, 80.9534052, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-09', '21:56:00', '23:55:00', '2025-10-09', '2025-10-09 21:56:00', 1, 0, 317.50, '8', '2', '', 1, 1, '2025-10-09 16:20:55', '2025-10-09 22:00:54', 0),
(23, 1, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980161, 80.9534015, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-09', '22:14:00', '00:13:00', '2025-10-10', '2025-10-09 22:14:00', 1, 0, 317.50, '8', '2', '', 1, 1, '2025-10-09 16:30:44', '2025-10-09 22:03:35', 0),
(24, 1, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980200, 80.9534012, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-09', '22:19:00', '00:18:00', '2025-10-10', '2025-10-09 22:19:00', 1, 0, 317.50, '8', '2', '', 1, 1, '2025-10-09 16:34:24', '2025-10-09 23:13:38', 0),
(25, 1, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980161, 80.9534015, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-09', '22:21:00', '00:20:00', '2025-10-10', '2025-10-09 22:21:00', 6, 5, 317.50, '11', '2', '', 1, 1, '2025-10-09 16:44:15', '2025-10-09 23:13:26', 0),
(26, 1, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980158, 80.9534012, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-09', '22:28:00', '00:27:00', '2025-10-10', '2025-10-09 22:28:00', 1, 0, 317.50, '8', '2', '', 1, 1, '2025-10-09 16:49:59', '2025-10-09 22:32:39', 0),
(27, 1, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980149, 80.9534005, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-09', '22:35:00', '00:34:00', '2025-10-10', '2025-10-09 22:35:00', 1, 0, 317.50, '8', '2', '', 1, 1, '2025-10-09 16:59:57', '2025-10-09 22:32:31', 0),
(28, 1, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980158, 80.9534008, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-09', '22:35:00', '00:34:00', '2025-10-10', '2025-10-09 22:35:00', 1, 1, 317.50, '11', '3', '', 1, 1, '2025-10-09 17:02:18', '2025-10-09 22:32:18', 0),
(29, 1, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980200, 80.9534012, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-09', '23:18:00', '01:17:00', '2025-10-10', '2025-10-09 23:18:00', 1, 0, 317.50, '8', '2', '', 1, 1, '2025-10-09 17:43:10', '2025-10-09 23:21:30', 0),
(30, 1, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980164, 80.9534015, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-09', '23:24:00', '01:23:00', '2025-10-10', '2025-10-09 23:24:00', 6, 5, 317.50, '8', '2', '', 1, 1, '2025-10-09 17:50:30', '2025-10-09 23:26:22', 0),
(31, 1, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980158, 80.9534018, 'lucknow', 'Narolgam, Ahmedabad, Gujarat, 380006', 23.0225051, 72.5713622, 'ahmedabad', '2025-10-09', '23:29:00', '23:13:00', '2025-10-10', '2025-10-09 23:29:00', 6, 5, 2847.70, '8', '2', '', 1, 1, '2025-10-09 17:54:36', '2025-10-10 09:15:23', 0),
(32, 1, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8979979, 80.9534099, 'lucknow', 'Q45X+QJ3, Ballia, Uttar Pradesh, 277001', 25.7597427, 84.1491885, 'ballia', '2025-10-09', '23:55:00', '08:30:00', '2025-10-10', '2025-10-09 23:55:00', 1, 1, 1029.30, '6', '2', '', 1, 1, '2025-10-09 18:25:50', '2025-10-09 23:56:12', 0),
(33, 13, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980164, 80.9534002, 'lucknow', 'Gola, Gola, Uttar Pradesh, 262802', 28.0751563, 80.4632449, 'gola', '2025-10-10', '00:23:00', '03:53:00', '2025-10-10', '2025-10-10 00:23:00', 1, 1, 0.00, '16', '3', '', 1, 1, '2025-10-09 18:47:09', '2025-10-10 00:17:09', 0),
(34, 13, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980149, 80.9533998, 'lucknow', 'Gola, Gola, Uttar Pradesh, 262802', 28.0751563, 80.4632449, 'gola', '2025-10-10', '00:25:00', '03:55:00', '2025-10-10', '2025-10-10 00:25:00', 1, 0, 419.10, '16', '2', '', 1, 1, '2025-10-09 18:51:55', '2025-10-10 09:20:35', 0),
(35, 13, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980161, 80.9534012, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-10', '00:45:00', '02:44:00', '2025-10-10', '2025-10-10 00:45:00', 1, 0, 317.50, '16', '2', '', 1, 1, '2025-10-09 19:07:01', '2025-10-10 01:05:22', 0),
(36, 13, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980158, 80.9534008, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-10', '00:46:00', '02:45:00', '2025-10-10', '2025-10-10 00:46:00', 6, 4, 317.50, '16', '2', '', 1, 1, '2025-10-09 19:12:39', '2025-10-10 09:23:24', 0),
(37, 13, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980155, 80.9534018, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-10', '00:57:00', '02:56:00', '2025-10-10', '2025-10-10 00:57:00', 6, 4, 317.50, '16', '2', '', 1, 1, '2025-10-09 19:24:35', '2025-10-10 01:08:02', 0),
(38, 13, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980161, 80.9534012, 'lucknow', 'Mahatma Gandhi Road, Agra, Uttar Pradesh, 282001', 27.1766702, 78.0080745, 'kahrai', '2025-10-10', '01:15:00', '08:36:00', '2025-10-10', '2025-10-10 01:15:00', 6, 4, 881.00, '16', '2', '', 1, 1, '2025-10-09 19:39:09', '2025-10-10 01:15:49', 0),
(39, 13, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980158, 80.9534018, 'lucknow', '987, Delhi, Delhi, 110085', 28.7040592, 77.1024903, 'new delhi', '2025-10-10', '01:20:00', '12:04:00', '2025-10-10', '2025-10-10 01:20:00', 6, 6, 1287.50, '16', '3', '', 1, 1, '2025-10-09 19:47:09', '2025-10-10 01:17:09', 0),
(40, 13, 'D-92, Lucknow, Uttar Pradesh, 226021', 26.8972014, 80.9523927, 'lucknow', '987, Delhi, Delhi, 110085', 28.7040592, 77.1024903, 'new delhi', '2025-10-10', '01:25:00', '12:09:00', '2025-10-10', '2025-10-10 01:25:00', 6, 6, 1287.40, '16', '2', '', 1, 1, '2025-10-09 19:50:36', '2025-10-10 01:21:24', 0),
(41, 13, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980158, 80.9534025, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-10', '13:30:00', '15:29:00', '2025-10-10', '2025-10-10 13:30:00', 6, 4, 317.50, '16', '2', '', 1, 1, '2025-10-09 19:52:14', '2025-10-10 09:20:20', 0),
(42, 13, 'E-4m11, Lucknow, Uttar Pradesh, 226021', 26.8980164, 80.9534025, 'lucknow', 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 27.5680155, 80.6789519, 'sitapur', '2025-10-10', '13:35:00', '15:34:00', '2025-10-10', '2025-10-10 13:35:00', 6, 5, 317.50, '16', '2', '', 1, 1, '2025-10-09 19:58:12', '2025-10-10 09:20:07', 0),
(43, 1, 'WWVQ+HW2, Malookpur, Uttar Pradesh, 226031', 26.9442087, 80.9402825, 'lucknow', '406/289, Bandoli, Goa, 403706', 15.2993267, 74.1239961, 'bandoli', '2025-10-10', '09:35:00', '22:29:00', '2025-10-11', '2025-10-10 09:35:00', 6, 5, 4428.20, '8', '2', '', 1, 1, '2025-10-10 03:56:05', '2025-10-10 09:29:34', 0),
(44, 1, 'WWVR+96P, Lucknow, Uttar Pradesh, 226031', 26.9435207, 80.9404706, 'lucknow', 'Mahatma Gandhi Road, Agra, Uttar Pradesh, 282001', 27.1766702, 78.0080745, 'kahrai', '2025-10-10', '09:35:00', '16:53:00', '2025-10-10', '2025-10-10 09:35:00', 6, 5, 875.50, '8', '2', '', 1, 1, '2025-10-10 04:00:38', '2025-10-10 09:52:26', 0),
(45, 1, '301, Lucknow, Uttar Pradesh, 226031', 26.9446334, 80.9390996, 'lucknow', 'Mahatma Gandhi Road, Agra, Uttar Pradesh, 282001', 27.1766702, 78.0080745, 'kahrai', '2025-10-10', '09:55:00', '17:13:00', '2025-10-10', '2025-10-10 09:55:00', 6, 4, 875.10, '6', '2', '', 1, 1, '2025-10-10 04:17:04', '2025-10-10 09:51:41', 0),
(46, 1, 'AKTU New Campus, Sector 11, Jankipuram Vistar, Lucknow, Uttar Pradesh, India', 26.9442087, 80.9402825, 'lucknow', 'Taj Mahal, Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh, India', 27.1751448, 78.0421422, 'agra', '2025-10-10', '10:55:00', '18:08:00', '2025-10-10', '2025-10-10 10:55:00', 6, 6, 865.30, '11', '2', '', 1, 1, '2025-10-10 05:24:25', '2025-10-10 10:55:50', 0),
(47, 17, 'Charbagh, Lucknow, Uttar Pradesh, India', 26.8322934, 80.9214336, 'lucknow', 'New Delhi, Delhi, India', 28.6139298, 77.2088282, 'new delhi', '2025-10-30', '20:00:00', '06:24:00', '2025-10-31', '2025-10-30 20:00:00', 6, 6, 1248.30, '22', '1', 'gzv', 1, 1, '2025-10-29 14:05:28', '2025-10-29 19:35:28', 0);

-- --------------------------------------------------------

--
-- Table structure for table `ride_bookings`
--

CREATE TABLE `ride_bookings` (
  `id` int(11) NOT NULL,
  `ride_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `seats_booked` int(11) NOT NULL DEFAULT 1,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 = Pending (awaiting driver approval), 1 = Confirmed (accepted by driver),2 =Cancelled by user,3 = Cancelled by driver or ride cancelled,4 = Completed (ride successfully completed),5 = Picked up (passenger picked up by driver),6 = No-show (passenger didn’t show up at pickup point),7= complete with rating',
  `pay_status` int(15) NOT NULL DEFAULT 0,
  `pay_mode` int(15) DEFAULT NULL,
  `from_stop_id` int(11) DEFAULT NULL,
  `to_stop_id` int(11) DEFAULT NULL,
  `fare` decimal(10,2) DEFAULT NULL,
  `distance_km` decimal(10,2) DEFAULT NULL,
  `pickup_time` datetime DEFAULT NULL,
  `drop_time` datetime DEFAULT NULL,
  `otp` int(10) DEFAULT NULL,
  `otp_verify` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `ride_bookings`
--

INSERT INTO `ride_bookings` (`id`, `ride_id`, `user_id`, `seats_booked`, `status`, `pay_status`, `pay_mode`, `from_stop_id`, `to_stop_id`, `fare`, `distance_km`, `pickup_time`, `drop_time`, `otp`, `otp_verify`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 1, 6, 0, NULL, 1, 2, 284.50, 77.51, NULL, NULL, 4868, 1, '2025-10-09 00:36:37', '2025-10-09 00:40:07'),
(2, 1, 2, 1, 7, 1, NULL, 1, 4, 310.50, 111.85, NULL, NULL, 7451, 1, '2025-10-09 00:37:28', '2025-10-09 00:41:21'),
(3, 3, 2, 1, 4, 1, NULL, 5, NULL, 237.30, 66.86, NULL, NULL, 2898, 1, '2025-10-09 01:29:14', '2025-10-09 01:30:31'),
(4, 5, 4, 1, 4, 1, NULL, NULL, NULL, 403.50, 134.58, NULL, NULL, 8152, 1, '2025-10-09 09:20:32', '2025-10-09 09:21:28'),
(5, 6, 1, 2, 4, 1, NULL, NULL, NULL, 806.00, 135.27, NULL, NULL, 6766, 1, '2025-10-09 09:42:44', '2025-10-09 09:49:35'),
(6, 6, 4, 1, 7, 1, NULL, NULL, 11, 296.10, 74.88, NULL, NULL, 4444, 1, '2025-10-09 09:43:15', '2025-10-09 09:49:58'),
(7, 6, 6, 1, 4, 1, NULL, NULL, 14, 325.10, 109.21, NULL, NULL, 3615, 1, '2025-10-09 09:43:53', '2025-10-09 09:50:35'),
(8, 7, 5, 1, 7, 1, NULL, NULL, NULL, 360.30, 119.86, NULL, NULL, 7964, 1, '2025-10-09 10:21:55', '2025-10-09 10:56:40'),
(9, 8, 3, 2, 3, 0, NULL, NULL, NULL, 100.00, 15.50, NULL, NULL, 2287, 0, '2025-10-09 12:55:00', '2025-10-09 12:56:52'),
(10, 8, 3, 2, 3, 0, 1, NULL, NULL, 100.00, 15.50, NULL, NULL, 6251, 0, '2025-10-09 12:58:54', '2025-10-09 13:00:39'),
(11, 8, 3, 2, 6, 0, 1, NULL, NULL, 100.00, 15.50, NULL, NULL, 7685, 0, '2025-10-09 13:00:56', '2025-10-09 14:01:17'),
(12, 10, 2, 1, 4, 1, 2, NULL, NULL, 296.70, 74.19, NULL, NULL, 2765, 1, '2025-10-09 14:19:01', '2025-10-09 14:44:35'),
(13, 15, 1, 1, 3, 0, 1, NULL, 19, 296.70, 74.19, NULL, NULL, 4489, 0, '2025-10-09 15:33:18', '2025-10-09 15:35:06'),
(14, 15, 8, 1, 4, 1, 2, NULL, 20, 378.10, 94.53, NULL, NULL, 4113, 1, '2025-10-09 15:34:35', '2025-10-09 15:42:17'),
(15, 15, 1, 1, 3, 0, 1, NULL, NULL, 403.50, 134.58, NULL, NULL, 4657, 0, '2025-10-09 15:35:41', '2025-10-09 15:37:26'),
(16, 15, 4, 1, 4, 1, 2, NULL, 22, 325.60, 108.54, NULL, NULL, 8387, 1, '2025-10-09 15:36:49', '2025-10-09 15:42:20'),
(17, 15, 1, 1, 6, 0, 2, NULL, 19, 296.70, 74.19, NULL, NULL, 1320, 0, '2025-10-09 15:37:48', '2025-10-09 15:40:57'),
(18, 16, 9, 1, 6, 0, 1, NULL, NULL, 5330.80, 1777.47, NULL, NULL, 2274, 0, '2025-10-09 16:01:50', '2025-10-09 16:13:45'),
(19, 17, 1, 1, 7, 1, 1, NULL, NULL, 403.10, 135.27, NULL, NULL, 7597, 1, '2025-10-09 16:16:32', '2025-10-09 16:22:11'),
(20, 17, 4, 1, 7, 1, 2, NULL, NULL, 403.10, 135.27, NULL, NULL, 1975, 1, '2025-10-09 16:19:28', '2025-10-09 16:22:13'),
(21, 18, 1, 1, 7, 1, 1, NULL, NULL, 296.70, 74.19, NULL, NULL, 9615, 1, '2025-10-09 17:19:18', '2025-10-09 18:05:10'),
(22, 21, 5, 3, 4, 1, 1, NULL, NULL, 1210.50, 134.58, NULL, NULL, 8698, 1, '2025-10-09 17:57:14', '2025-10-09 18:05:01'),
(23, 21, 11, 2, 4, 1, 2, NULL, 25, 593.40, 74.19, NULL, NULL, 4830, 1, '2025-10-09 17:58:08', '2025-10-09 18:06:46'),
(24, 22, 3, 1, 7, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 1473, 1, '2025-10-09 21:53:21', '2025-10-09 21:59:30'),
(25, 23, 3, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 6524, 1, '2025-10-09 22:01:21', '2025-10-09 22:03:13'),
(26, 24, 3, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 6711, 1, '2025-10-09 22:04:50', '2025-10-09 22:13:14'),
(27, 25, 3, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 7521, 1, '2025-10-09 22:14:20', '2025-10-09 22:18:45'),
(28, 26, 3, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 6045, 1, '2025-10-09 22:20:19', '2025-10-09 22:28:54'),
(29, 27, 3, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 6944, 1, '2025-10-09 22:30:25', '2025-10-09 22:31:34'),
(30, 28, 3, 1, 6, 0, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 7408, 1, '2025-10-09 22:33:19', '2025-10-09 23:11:46'),
(31, 29, 3, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 3819, 1, '2025-10-09 23:13:48', '2025-10-09 23:19:14'),
(32, 30, 3, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 7365, 1, '2025-10-09 23:20:49', '2025-10-09 23:23:36'),
(33, 31, 3, 1, 4, 1, 1, NULL, NULL, 2847.70, 949.83, NULL, NULL, 7491, 1, '2025-10-09 23:25:13', '2025-10-09 23:27:15'),
(34, 34, 3, 1, 4, 1, 1, NULL, NULL, 419.10, 137.90, NULL, NULL, 4275, 1, '2025-10-10 00:22:06', '2025-10-10 00:34:31'),
(35, 34, 1, 1, 3, 0, 1, NULL, NULL, 419.10, 137.90, NULL, NULL, 6756, 0, '2025-10-10 00:22:07', '2025-10-10 00:22:17'),
(36, 35, 3, 1, 3, 0, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 3247, 0, '2025-10-10 00:37:19', '2025-10-10 00:37:39'),
(37, 35, 1, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 2653, 1, '2025-10-10 00:37:29', '2025-10-10 00:41:57'),
(38, 36, 1, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 4169, 1, '2025-10-10 00:43:09', '2025-10-10 00:47:15'),
(39, 36, 3, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 9817, 1, '2025-10-10 00:43:17', '2025-10-10 09:21:51'),
(40, 37, 1, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 6505, 1, '2025-10-10 00:55:15', '2025-10-10 01:02:00'),
(41, 37, 3, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 5282, 1, '2025-10-10 00:55:39', '2025-10-10 01:07:48'),
(42, 38, 3, 1, 4, 1, 1, NULL, NULL, 881.00, 293.05, NULL, NULL, 5267, 1, '2025-10-10 01:09:55', '2025-10-10 01:15:20'),
(43, 38, 1, 1, 4, 1, 1, NULL, NULL, 881.00, 293.05, NULL, NULL, 8376, 1, '2025-10-10 01:09:56', '2025-10-10 01:15:36'),
(44, 41, 3, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 8805, 1, '2025-10-10 01:22:35', '2025-10-10 01:26:30'),
(45, 41, 1, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 7769, 1, '2025-10-10 01:22:48', '2025-10-10 01:26:47'),
(46, 42, 1, 1, 4, 1, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 6987, 1, '2025-10-10 01:28:21', '2025-10-10 09:19:53'),
(47, 42, 3, 1, 6, 0, 1, NULL, NULL, 317.50, 77.51, NULL, NULL, 7046, 1, '2025-10-10 01:28:28', '2025-10-10 09:19:25'),
(48, 43, 13, 1, 4, 1, 1, NULL, NULL, 4428.20, 1476.03, NULL, NULL, 2403, 1, '2025-10-10 09:26:48', '2025-10-10 09:29:10'),
(49, 44, 13, 1, 4, 1, 1, NULL, NULL, 875.50, 291.69, NULL, NULL, 6514, 1, '2025-10-10 09:33:14', '2025-10-10 09:43:36'),
(50, 45, 13, 1, 4, 1, 1, NULL, NULL, 875.10, 291.58, NULL, NULL, 9319, 1, '2025-10-10 09:47:38', '2025-10-10 09:51:21'),
(51, 45, 10, 1, 7, 1, 1, NULL, NULL, 875.10, 291.58, NULL, NULL, 9144, 1, '2025-10-10 09:49:16', '2025-10-10 09:51:54');

-- --------------------------------------------------------

--
-- Table structure for table `ride_payments`
--

CREATE TABLE `ride_payments` (
  `id` int(11) NOT NULL,
  `ride_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `driver_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_mode` tinyint(4) NOT NULL,
  `admin_commission` decimal(10,2) DEFAULT NULL,
  `driver_earning` decimal(10,2) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `payment_status` tinyint(4) DEFAULT 1,
  `status` tinyint(4) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `ride_payments`
--

INSERT INTO `ride_payments` (`id`, `ride_id`, `user_id`, `driver_id`, `amount`, `payment_mode`, `admin_commission`, `driver_earning`, `transaction_id`, `payment_status`, `status`, `created_at`) VALUES
(1, 1, 2, 1, 310.00, 0, 31.00, 279.00, 'CASH1759950654702', 1, 1, '2025-10-09 00:40:54'),
(2, 3, 2, 1, 237.00, 0, 23.70, 213.30, 'CASH1759953631596', 1, 1, '2025-10-09 01:30:31'),
(3, 5, 4, 1, 403.00, 0, 40.30, 362.70, 'CASH1759981888772', 1, 1, '2025-10-09 09:21:28'),
(4, 6, 1, 5, 806.00, 0, 80.60, 725.40, 'CASH1759983575396', 1, 1, '2025-10-09 09:49:35'),
(5, 6, 4, 5, 296.00, 0, 29.60, 266.40, 'CASH1759983588583', 1, 1, '2025-10-09 09:49:48'),
(6, 6, 6, 5, 325.00, 1, 32.50, 292.50, 'ORD1759983618653813', 1, 1, '2025-10-09 09:50:18'),
(7, 7, 5, 7, 360.00, 0, 36.00, 324.00, 'CASH1759987230546', 1, 1, '2025-10-09 10:50:30'),
(8, 10, 2, 1, 296.00, 1, 29.60, 266.40, 'ORD1760001238677900', 1, 1, '2025-10-09 14:43:58'),
(9, 15, 8, 9, 378.00, 1, 37.80, 340.20, 'ORD1760004705851475', 1, 1, '2025-10-09 15:41:46'),
(10, 15, 4, 9, 325.00, 1, 32.50, 292.50, 'ORD1760004727095971', 1, 1, '2025-10-09 15:42:07'),
(11, 17, 4, 9, 403.00, 1, 40.30, 362.70, 'ORD1760007057579330', 1, 1, '2025-10-09 16:20:57'),
(12, 17, 1, 9, 403.00, 0, 40.30, 362.70, 'CASH1760007064133', 1, 1, '2025-10-09 16:21:04'),
(13, 17, 1, 9, 403.00, 0, 40.30, 362.70, 'CASH1760007065522', 1, 1, '2025-10-09 16:21:05'),
(14, 18, 1, 10, 296.00, 0, 29.60, 266.40, 'CASH1760010597832', 1, 1, '2025-10-09 17:19:57'),
(15, 21, 11, 1, 593.40, 1, 0.00, 0.00, 'ORD176001317122118', 0, 1, '2025-10-09 18:02:51'),
(16, 21, 11, 1, 593.00, 1, 59.30, 533.70, 'ORD1760013293742837', 1, 1, '2025-10-09 18:04:53'),
(17, 21, 5, 1, 1210.00, 0, 121.00, 1089.00, 'CASH1760013301117', 1, 1, '2025-10-09 18:05:01'),
(18, 22, 3, 1, 317.00, 0, 31.70, 285.30, 'CASH1760027187629', 1, 1, '2025-10-09 21:56:27'),
(19, 23, 3, 1, 317.00, 0, 31.70, 285.30, 'CASH1760027593274', 1, 1, '2025-10-09 22:03:13'),
(20, 24, 3, 1, 317.00, 0, 31.70, 285.30, 'CASH1760028194464', 1, 1, '2025-10-09 22:13:14'),
(21, 25, 3, 1, 317.00, 0, 31.70, 285.30, 'CASH1760028525710', 1, 1, '2025-10-09 22:18:45'),
(22, 26, 3, 1, 317.00, 0, 31.70, 285.30, 'CASH1760029134979', 1, 1, '2025-10-09 22:28:54'),
(23, 27, 3, 1, 317.00, 0, 31.70, 285.30, 'CASH1760029294306', 1, 1, '2025-10-09 22:31:34'),
(24, 29, 3, 1, 317.00, 0, 31.70, 285.30, 'CASH1760032154721', 1, 1, '2025-10-09 23:19:14'),
(25, 30, 3, 1, 317.00, 0, 31.70, 285.30, 'CASH1760032416700', 1, 1, '2025-10-09 23:23:36'),
(26, 31, 3, 1, 2847.00, 0, 284.70, 2562.30, 'CASH1760032635849', 1, 1, '2025-10-09 23:27:15'),
(27, 34, 3, 13, 419.00, 0, 41.90, 377.10, 'CASH1760036671773', 1, 1, '2025-10-10 00:34:31'),
(28, 35, 1, 13, 317.00, 0, 31.70, 285.30, 'CASH1760037117744', 1, 1, '2025-10-10 00:41:57'),
(29, 36, 1, 13, 317.00, 0, 31.70, 285.30, 'CASH1760037435921', 1, 1, '2025-10-10 00:47:15'),
(30, 37, 1, 13, 317.00, 0, 31.70, 285.30, 'CASH1760038320321', 1, 1, '2025-10-10 01:02:00'),
(31, 37, 3, 13, 317.00, 0, 31.70, 285.30, 'CASH1760038668654', 1, 1, '2025-10-10 01:07:48'),
(32, 38, 3, 13, 881.00, 0, 88.10, 792.90, 'CASH1760039120952', 1, 1, '2025-10-10 01:15:20'),
(33, 38, 1, 13, 881.00, 0, 88.10, 792.90, 'CASH1760039136401', 1, 1, '2025-10-10 01:15:36'),
(34, 41, 3, 13, 317.00, 0, 31.70, 285.30, 'CASH1760039790788', 1, 1, '2025-10-10 01:26:30'),
(35, 41, 1, 13, 317.00, 0, 31.70, 285.30, 'CASH1760039807543', 1, 1, '2025-10-10 01:26:47'),
(36, 42, 1, 13, 317.00, 0, 31.70, 285.30, 'CASH1760068193162', 1, 1, '2025-10-10 09:19:53'),
(37, 36, 3, 13, 317.00, 0, 31.70, 285.30, 'CASH1760068311007', 1, 1, '2025-10-10 09:21:51'),
(38, 43, 13, 1, 4428.00, 0, 442.80, 3985.20, 'CASH1760068750458', 1, 1, '2025-10-10 09:29:10'),
(39, 44, 13, 1, 875.00, 0, 87.50, 787.50, 'CASH1760069616855', 1, 1, '2025-10-10 09:43:36'),
(40, 45, 13, 1, 875.00, 0, 87.50, 787.50, 'CASH1760070081989', 1, 1, '2025-10-10 09:51:21'),
(41, 45, 10, 1, 875.00, 0, 87.50, 787.50, 'CASH1760070093776', 1, 1, '2025-10-10 09:51:33');

-- --------------------------------------------------------

--
-- Table structure for table `ride_stops`
--

CREATE TABLE `ride_stops` (
  `id` int(11) NOT NULL,
  `ride_id` int(11) DEFAULT NULL,
  `departureestimated_date` date DEFAULT NULL,
  `arrivalestimated_date` date DEFAULT NULL,
  `stop_order` int(11) DEFAULT NULL,
  `full_address` text DEFAULT NULL,
  `city_name` varchar(100) DEFAULT NULL,
  `lat` decimal(10,7) DEFAULT NULL,
  `lng` decimal(10,7) DEFAULT NULL,
  `price_from_start` decimal(10,2) DEFAULT NULL,
  `estimated_arrival` time DEFAULT NULL,
  `estimated_departure` time DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ride_stops`
--

INSERT INTO `ride_stops` (`id`, `ride_id`, `departureestimated_date`, `arrivalestimated_date`, `stop_order`, `full_address`, `city_name`, `lat`, `lng`, `price_from_start`, `estimated_arrival`, `estimated_departure`, `created_at`) VALUES
(1, 1, '2025-10-08', '2025-10-08', 1, 'L6M164, Lucknow, Uttar Pradesh, 226021', 'lucknow', NULL, NULL, 23.70, '04:40:00', '04:45:00', '2025-10-08 19:04:06'),
(2, 1, '2025-10-09', '2025-10-09', 2, 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 'sitapur', NULL, NULL, 308.20, '02:36:00', '02:41:00', '2025-10-08 19:04:06'),
(3, 1, '2025-10-10', '2025-10-10', 3, 'WQWH+FFW, Lakhimpur, Uttar Pradesh, 262701', 'lakhimpur', NULL, NULL, 346.00, '08:21:00', '08:26:00', '2025-10-08 19:04:07'),
(4, 1, '2025-10-11', '2025-10-11', 4, 'RGXH+3XW, Kasta, Uttar Pradesh, 261501', 'kasta', NULL, NULL, 334.20, '07:36:00', '07:41:00', '2025-10-08 19:04:07'),
(5, 3, '2025-10-08', '2025-10-08', 1, 'Chaudhary Charan Singh International Airport, Lucknow, Uttar Pradesh, 226009', 'lucknow', NULL, NULL, 80.10, '01:58:00', '02:03:00', '2025-10-08 19:57:45'),
(6, 4, '2025-10-08', '2025-10-08', 1, 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 'sitapur', NULL, NULL, 275.30, '03:20:00', '03:25:00', '2025-10-08 20:03:49'),
(7, 4, '2025-10-08', '2025-10-08', 2, 'QPCG+FQ5, Hargaon, Uttar Pradesh, 261121', 'hargaon', NULL, NULL, 399.50, '04:14:00', '04:19:00', '2025-10-08 20:03:50'),
(8, 5, '2025-10-09', '2025-10-09', 1, 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 'sitapur', NULL, NULL, 296.70, '11:17:00', '11:22:00', '2025-10-09 03:50:02'),
(9, 5, '2025-10-09', '2025-10-09', 2, 'QPCG+FQ5, Hargaon, Uttar Pradesh, 261121', 'hargaon', NULL, NULL, 378.10, '13:02:00', '13:07:00', '2025-10-09 03:50:03'),
(10, 5, '2025-10-10', '2025-10-10', 3, 'WQWH+FFW, Lakhimpur, Uttar Pradesh, 262701', 'lakhimpur', NULL, NULL, 338.30, '12:27:00', '12:32:00', '2025-10-09 03:50:03'),
(11, 6, '2025-10-09', '2025-10-09', 1, 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 'sitapur', NULL, NULL, 296.10, '11:38:00', '11:43:00', '2025-10-09 04:12:03'),
(12, 6, '2025-10-09', '2025-10-09', 2, 'QPCG+FQ5, Hargaon, Uttar Pradesh, 261121', 'hargaon', NULL, NULL, 377.50, '12:18:00', '12:23:00', '2025-10-09 04:12:03'),
(13, 6, '2025-10-09', '2025-10-09', 3, 'WQWH+FFW, Lakhimpur, Uttar Pradesh, 262701', 'lakhimpur', NULL, NULL, 337.90, '12:53:00', '12:58:00', '2025-10-09 04:12:04'),
(14, 6, '2025-10-09', '2025-10-09', 4, 'RGXH+3XW, Kasta, Uttar Pradesh, 261501', 'kasta', NULL, NULL, 325.10, '13:38:00', '13:43:00', '2025-10-09 04:12:04'),
(15, 7, '2025-10-10', '2025-10-10', 1, 'W5MH+JM4, Barabanki, Uttar Pradesh, 225001', 'barabanki', NULL, NULL, 97.00, '10:54:00', '10:59:00', '2025-10-09 04:49:21'),
(16, 7, '2025-10-10', '2025-10-10', 2, 'Q59F+5QH, Faizabad, Uttar Pradesh, 224135', 'faizabad', NULL, NULL, 353.00, '13:30:00', '13:35:00', '2025-10-09 04:49:21'),
(17, 8, '2025-10-09', '2025-10-09', 1, 'RGXH+3XW, Kasta, Uttar Pradesh, 261501', 'kasta', NULL, NULL, 325.30, '15:28:00', '15:33:00', '2025-10-09 07:22:43'),
(18, 11, '2025-10-09', '2025-10-09', 1, 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 'sitapur', NULL, NULL, 296.70, '17:16:00', '17:21:00', '2025-10-09 09:49:11'),
(19, 15, '2025-10-09', '2025-10-09', 1, 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 'sitapur', NULL, NULL, 296.70, '17:29:00', '17:34:00', '2025-10-09 10:02:53'),
(20, 15, '2025-10-09', '2025-10-09', 2, 'QPCG+FQ5, Hargaon, Uttar Pradesh, 261121', 'hargaon', NULL, NULL, 378.10, '19:03:00', '19:08:00', '2025-10-09 10:02:53'),
(21, 15, '2025-10-09', '2025-10-09', 3, 'WQWH+FFW, Lakhimpur, Uttar Pradesh, 262701', 'lakhimpur', NULL, NULL, 338.30, '19:38:00', '19:43:00', '2025-10-09 10:02:54'),
(22, 15, '2025-10-10', '2025-10-10', 4, 'RGXH+3XW, Kasta, Uttar Pradesh, 261501', 'kasta', NULL, NULL, 325.60, '18:26:00', '18:31:00', '2025-10-09 10:02:54'),
(23, 20, '2025-10-08', '2025-10-08', 1, '353G+6XP, Azamgarh, Uttar Pradesh, 276001', 'patkhauli', NULL, NULL, 722.10, '00:06:00', '00:11:00', '2025-10-09 12:26:21'),
(24, 20, '2025-10-08', '2025-10-08', 2, 'WHP9+G7C, Mau, Uttar Pradesh, 275101', 'mau', NULL, NULL, 845.40, '01:13:00', '01:18:00', '2025-10-09 12:26:21'),
(25, 21, '2025-10-09', '2025-10-09', 1, 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 'sitapur', NULL, NULL, 296.70, '19:58:00', '20:03:00', '2025-10-09 12:26:40'),
(26, 21, '2025-10-09', '2025-10-09', 2, 'QPCG+FQ5, Hargaon, Uttar Pradesh, 261121', 'hargaon', NULL, NULL, 378.10, '21:32:00', '21:37:00', '2025-10-09 12:26:40'),
(27, 21, '2025-10-10', '2025-10-10', 3, 'RGXH+3XW, Kasta, Uttar Pradesh, 261501', 'kasta', NULL, NULL, 325.60, '20:55:00', '21:00:00', '2025-10-09 12:26:40'),
(28, 32, '2025-10-09', '2025-10-09', 1, '35FP+H98, Azamgarh, Uttar Pradesh, 276001', 'patkhauli', NULL, NULL, 721.80, '05:56:00', '06:01:00', '2025-10-09 18:25:50'),
(29, 32, '2025-10-09', '2025-10-09', 2, 'WHW6+GC6, Mau, Uttar Pradesh, 275101', 'mau', NULL, NULL, 842.10, '07:01:00', '07:06:00', '2025-10-09 18:25:50'),
(30, 33, '2025-10-09', '2025-10-09', 1, 'HM9H+6H4, Sitapur, Uttar Pradesh, 261001', 'sitapur', NULL, NULL, 0.00, '02:22:00', '02:27:00', '2025-10-09 18:47:10'),
(31, 46, '2025-10-10', '2025-10-10', 1, 'Etawah, Uttar Pradesh, India', 'etawah', NULL, NULL, 572.30, '15:41:00', '15:46:00', '2025-10-10 05:24:25'),
(32, 46, '2025-10-10', '2025-10-10', 2, 'Firozabad, Uttar Pradesh, India', 'firozabad', NULL, NULL, 760.20, '17:39:00', '17:44:00', '2025-10-10 05:24:25'),
(33, 47, '2025-10-30', '2025-10-30', 1, 'Ghaziabad, Uttar Pradesh, India', 'ghaziabad', NULL, NULL, 1194.30, '05:57:00', '06:02:00', '2025-10-29 14:05:28');

-- --------------------------------------------------------

--
-- Table structure for table `setting`
--

CREATE TABLE `setting` (
  `id` int(11) NOT NULL,
  `upload_document_status` int(11) DEFAULT NULL COMMENT '0=mandatri , 1 not mandatri',
  `updated` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `setting`
--

INSERT INTO `setting` (`id`, `upload_document_status`, `updated`) VALUES
(1, 1, '2025-11-11 05:10:19');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `ride_id` int(11) DEFAULT NULL,
  `type` tinyint(4) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `purpose` varchar(255) NOT NULL,
  `role` enum('user','driver','admin') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `driver_id`, `ride_id`, `type`, `amount`, `purpose`, `role`, `created_at`) VALUES
(1, 2, 1, 1, 2, 310.00, 'Ride booking cash payment', 'user', '2025-10-08 19:10:54'),
(2, 1, 1, 1, 1, 31.00, 'Commission deducted from driver (cash)', 'admin', '2025-10-08 19:10:54'),
(3, 1, NULL, 1, 1, 279.00, 'Driver earning via cash', 'driver', '2025-10-08 19:10:54'),
(4, 2, 1, 3, 2, 237.00, 'Ride booking cash payment', 'user', '2025-10-08 20:00:31'),
(5, 1, 1, 3, 1, 23.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-08 20:00:31'),
(6, 1, NULL, 3, 1, 213.30, 'Driver earning via cash', 'driver', '2025-10-08 20:00:31'),
(7, 4, 1, 5, 2, 403.00, 'Ride booking cash payment', 'user', '2025-10-09 03:51:28'),
(8, 1, 1, 5, 1, 40.30, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 03:51:28'),
(9, 1, NULL, 5, 1, 362.70, 'Driver earning via cash', 'driver', '2025-10-09 03:51:28'),
(10, 1, 5, 6, 2, 806.00, 'Ride booking cash payment', 'user', '2025-10-09 04:19:35'),
(11, 1, 5, 6, 1, 80.60, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 04:19:35'),
(12, 5, NULL, 6, 1, 725.40, 'Driver earning via cash', 'driver', '2025-10-09 04:19:35'),
(13, 4, 5, 6, 2, 296.00, 'Ride booking cash payment', 'user', '2025-10-09 04:19:48'),
(14, 1, 5, 6, 1, 29.60, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 04:19:48'),
(15, 5, NULL, 6, 1, 266.40, 'Driver earning via cash', 'driver', '2025-10-09 04:19:48'),
(16, 6, 5, 6, 2, 325.00, 'Ride booking online payment', 'user', '2025-10-09 04:20:35'),
(17, 1, 5, 6, 1, 32.50, 'Commission received from driver (online)', 'admin', '2025-10-09 04:20:35'),
(18, 5, NULL, 6, 1, 292.50, 'Driver earning from online payment', 'driver', '2025-10-09 04:20:35'),
(19, 5, 7, 7, 2, 360.00, 'Ride booking cash payment', 'user', '2025-10-09 05:20:30'),
(20, 1, 7, 7, 1, 36.00, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 05:20:30'),
(21, 7, NULL, 7, 1, 324.00, 'Driver earning via cash', 'driver', '2025-10-09 05:20:30'),
(22, 2, 1, 10, 2, 296.00, 'Ride booking online payment', 'user', '2025-10-09 09:14:35'),
(23, 1, 1, 10, 1, 29.60, 'Commission received from driver (online)', 'admin', '2025-10-09 09:14:35'),
(24, 1, NULL, 10, 1, 266.40, 'Driver earning from online payment', 'driver', '2025-10-09 09:14:35'),
(25, 8, 9, 15, 2, 378.00, 'Ride booking online payment', 'user', '2025-10-09 10:12:17'),
(26, 1, 9, 15, 1, 37.80, 'Commission received from driver (online)', 'admin', '2025-10-09 10:12:17'),
(27, 9, NULL, 15, 1, 340.20, 'Driver earning from online payment', 'driver', '2025-10-09 10:12:17'),
(28, 4, 9, 15, 2, 325.00, 'Ride booking online payment', 'user', '2025-10-09 10:12:20'),
(29, 1, 9, 15, 1, 32.50, 'Commission received from driver (online)', 'admin', '2025-10-09 10:12:20'),
(30, 9, NULL, 15, 1, 292.50, 'Driver earning from online payment', 'driver', '2025-10-09 10:12:20'),
(31, 1, 9, 17, 2, 403.00, 'Ride booking cash payment', 'user', '2025-10-09 10:51:04'),
(32, 1, 9, 17, 1, 40.30, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 10:51:04'),
(33, 9, NULL, 17, 1, 362.70, 'Driver earning via cash', 'driver', '2025-10-09 10:51:04'),
(34, 1, 9, 17, 2, 403.00, 'Ride booking cash payment', 'user', '2025-10-09 10:51:05'),
(35, 1, 9, 17, 1, 40.30, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 10:51:05'),
(36, 9, NULL, 17, 1, 362.70, 'Driver earning via cash', 'driver', '2025-10-09 10:51:05'),
(37, 4, 9, 17, 2, 403.00, 'Ride booking online payment', 'user', '2025-10-09 10:51:25'),
(38, 1, 9, 17, 1, 40.30, 'Commission received from driver (online)', 'admin', '2025-10-09 10:51:25'),
(39, 9, NULL, 17, 1, 362.70, 'Driver earning from online payment', 'driver', '2025-10-09 10:51:25'),
(40, 1, 10, 18, 2, 296.00, 'Ride booking cash payment', 'user', '2025-10-09 11:49:57'),
(41, 1, 10, 18, 1, 29.60, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 11:49:57'),
(42, 10, NULL, 18, 1, 266.40, 'Driver earning via cash', 'driver', '2025-10-09 11:49:57'),
(43, 5, 1, 21, 2, 1210.00, 'Ride booking cash payment', 'user', '2025-10-09 12:35:01'),
(44, 1, 1, 21, 1, 121.00, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 12:35:01'),
(45, 1, NULL, 21, 1, 1089.00, 'Driver earning via cash', 'driver', '2025-10-09 12:35:01'),
(46, 11, 1, 21, 2, 593.00, 'Ride booking online payment', 'user', '2025-10-09 12:36:46'),
(47, 1, 1, 21, 1, 59.30, 'Commission received from driver (online)', 'admin', '2025-10-09 12:36:46'),
(48, 1, NULL, 21, 1, 533.70, 'Driver earning from online payment', 'driver', '2025-10-09 12:36:46'),
(49, 3, 1, 22, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-09 16:26:27'),
(50, 1, 1, 22, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 16:26:27'),
(51, 1, NULL, 22, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-09 16:26:27'),
(52, 3, 1, 23, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-09 16:33:13'),
(53, 1, 1, 23, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 16:33:13'),
(54, 1, NULL, 23, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-09 16:33:13'),
(55, 3, 1, 24, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-09 16:43:14'),
(56, 1, 1, 24, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 16:43:14'),
(57, 1, NULL, 24, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-09 16:43:14'),
(58, 3, 1, 25, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-09 16:48:45'),
(59, 1, 1, 25, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 16:48:45'),
(60, 1, NULL, 25, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-09 16:48:45'),
(61, 3, 1, 26, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-09 16:58:54'),
(62, 1, 1, 26, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 16:58:54'),
(63, 1, NULL, 26, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-09 16:58:54'),
(64, 3, 1, 27, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-09 17:01:34'),
(65, 1, 1, 27, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 17:01:34'),
(66, 1, NULL, 27, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-09 17:01:34'),
(67, 3, 1, 29, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-09 17:49:14'),
(68, 1, 1, 29, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 17:49:14'),
(69, 1, NULL, 29, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-09 17:49:14'),
(70, 3, 1, 30, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-09 17:53:36'),
(71, 1, 1, 30, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 17:53:36'),
(72, 1, NULL, 30, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-09 17:53:36'),
(73, 3, 1, 31, 2, 2847.00, 'Ride booking cash payment', 'user', '2025-10-09 17:57:15'),
(74, 1, 1, 31, 1, 284.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 17:57:15'),
(75, 1, NULL, 31, 1, 2562.30, 'Driver earning via cash', 'driver', '2025-10-09 17:57:15'),
(76, 3, 13, 34, 2, 419.00, 'Ride booking cash payment', 'user', '2025-10-09 19:04:31'),
(77, 1, 13, 34, 1, 41.90, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 19:04:31'),
(78, 13, NULL, 34, 1, 377.10, 'Driver earning via cash', 'driver', '2025-10-09 19:04:31'),
(79, 1, 13, 35, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-09 19:11:57'),
(80, 1, 13, 35, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 19:11:57'),
(81, 13, NULL, 35, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-09 19:11:57'),
(82, 1, 13, 36, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-09 19:17:15'),
(83, 1, 13, 36, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 19:17:15'),
(84, 13, NULL, 36, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-09 19:17:15'),
(85, 1, 13, 37, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-09 19:32:00'),
(86, 1, 13, 37, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 19:32:00'),
(87, 13, NULL, 37, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-09 19:32:00'),
(88, 3, 13, 37, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-09 19:37:48'),
(89, 1, 13, 37, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 19:37:48'),
(90, 13, NULL, 37, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-09 19:37:48'),
(91, 3, 13, 38, 2, 881.00, 'Ride booking cash payment', 'user', '2025-10-09 19:45:20'),
(92, 1, 13, 38, 1, 88.10, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 19:45:20'),
(93, 13, NULL, 38, 1, 792.90, 'Driver earning via cash', 'driver', '2025-10-09 19:45:20'),
(94, 1, 13, 38, 2, 881.00, 'Ride booking cash payment', 'user', '2025-10-09 19:45:36'),
(95, 1, 13, 38, 1, 88.10, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 19:45:36'),
(96, 13, NULL, 38, 1, 792.90, 'Driver earning via cash', 'driver', '2025-10-09 19:45:36'),
(97, 3, 13, 41, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-09 19:56:30'),
(98, 1, 13, 41, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 19:56:30'),
(99, 13, NULL, 41, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-09 19:56:30'),
(100, 1, 13, 41, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-09 19:56:47'),
(101, 1, 13, 41, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-09 19:56:47'),
(102, 13, NULL, 41, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-09 19:56:47'),
(103, 1, 13, 42, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-10 03:49:53'),
(104, 1, 13, 42, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-10 03:49:53'),
(105, 13, NULL, 42, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-10 03:49:53'),
(106, 3, 13, 36, 2, 317.00, 'Ride booking cash payment', 'user', '2025-10-10 03:51:51'),
(107, 1, 13, 36, 1, 31.70, 'Commission deducted from driver (cash)', 'admin', '2025-10-10 03:51:51'),
(108, 13, NULL, 36, 1, 285.30, 'Driver earning via cash', 'driver', '2025-10-10 03:51:51'),
(109, 13, 1, 43, 2, 4428.00, 'Ride booking cash payment', 'user', '2025-10-10 03:59:10'),
(110, 1, 1, 43, 1, 442.80, 'Commission deducted from driver (cash)', 'admin', '2025-10-10 03:59:10'),
(111, 1, NULL, 43, 1, 3985.20, 'Driver earning via cash', 'driver', '2025-10-10 03:59:10'),
(112, 13, 1, 44, 2, 875.00, 'Ride booking cash payment', 'user', '2025-10-10 04:13:36'),
(113, 1, 1, 44, 1, 87.50, 'Commission deducted from driver (cash)', 'admin', '2025-10-10 04:13:36'),
(114, 1, NULL, 44, 1, 787.50, 'Driver earning via cash', 'driver', '2025-10-10 04:13:36'),
(115, 13, 1, 45, 2, 875.00, 'Ride booking cash payment', 'user', '2025-10-10 04:21:21'),
(116, 1, 1, 45, 1, 87.50, 'Commission deducted from driver (cash)', 'admin', '2025-10-10 04:21:21'),
(117, 1, NULL, 45, 1, 787.50, 'Driver earning via cash', 'driver', '2025-10-10 04:21:21'),
(118, 10, 1, 45, 2, 875.00, 'Ride booking cash payment', 'user', '2025-10-10 04:21:33'),
(119, 1, 1, 45, 1, 87.50, 'Commission deducted from driver (cash)', 'admin', '2025-10-10 04:21:33'),
(120, 1, NULL, 45, 1, 787.50, 'Driver earning via cash', 'driver', '2025-10-10 04:21:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile_image` text DEFAULT NULL,
  `gender` varchar(25) DEFAULT NULL,
  `wallet` decimal(10,2) DEFAULT 0.00,
  `dob` date DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `admin_dues` decimal(10,2) DEFAULT 0.00,
  `fcm_token` varchar(255) DEFAULT NULL,
  `document_status` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `profile_image`, `gender`, `wallet`, `dob`, `status`, `admin_dues`, `fcm_token`, `document_status`, `created_at`, `updated_at`) VALUES
(1, 'tanisha', 'tanishaudent@gmail.com', '9555602291', NULL, '/uploads/profile_1760076633682.png', 'Other', 0.10, '2000-01-27', 1, 0.00, 'droqWvRrRWiyKjEQhZQzB6:APA91bHbQvO3yJgXbwM1Z23Xm32SfkQvllNavpLnlhChoRICKCUMZKgO97QLHV4Ur9VqSD6TC1RXKlFniY1N6_QYADt_dGZAVbRf7lM1epB8-WQG3g6vCDg', 2, '2025-10-08 23:41:44', '2025-11-06 15:25:59'),
(2, 'rohit kumar', 'rohitkumarp802@gmail.com', '6306206322', NULL, '/uploads/profile_1759949765385.png', 'Male', 0.00, '2000-01-01', 1, 0.00, 'f8--uy-3Qi6Xe98BfnBMqO:APA91bF3XpcV1q7ICCSexVfkZAEZWiLVTWKf7xiK1t_1hdngIiNBXecRRMxrdMQobf8Z82fhUkhwlQoVg7EF4p5U9f1ElBme2VGtcSdRtgieWhWqbDX95Wc', 2, '2025-10-08 23:42:22', '2025-11-11 15:15:50'),
(3, 'meena', 'm@gmail.com', '9335808408', NULL, '/uploads/profile_1759949535044.png', 'Female', 0.00, '2000-01-20', 1, 0.00, 'frvxq9CyRJa4fZkpbQ9FA0:APA91bFzstHG56bV1E5dQC1cU7V6tRrUX1tq4FDYfMSH4LuXF4-G-OyexbYlQATmBstRYbZ1jISJ_XtBnCKgcB6aNJ2FUR9t46VPz9LkGFGpFZzhddHTupw', 0, '2025-10-09 00:21:31', '2025-10-10 17:40:06'),
(4, 'abhishek', 'abhi@gmail.com', '6307335502', NULL, 'uploads/download (3).png', 'Male', 0.00, '2000-01-13', 1, 0.00, 'flrFNxWIRtyx7CooZ7yU49:APA91bEgVuUVjYbOj9ya1GQqPecdj1015sEd--4TuPuH0sfaaDQ_ZyJFgl6GW7hv4MLyBg6CJJZaXokUqR7FrG3fUKgiwJD7z7GcDxCPTloCL-i4Y_RnKzo', 0, '2025-10-09 09:17:49', '2025-10-09 17:22:42'),
(5, 'harshsir', 'tanishaudnt@gmail.com', '9793168164', NULL, 'uploads/download (3).png', 'Female', 292.50, '2000-01-20', 1, 0.00, 'f9fGdtfYTPKXjjIv-Pvy_C:APA91bFRygspxYnFe5Q0reeiZp4yC7HcEjM3oKv7-QM7hzxP-S-7JhXfQ4zRl9d3Q_sD9HiDe9diLg2XCfR7Dt1ApN02IiAn3Qt_6GhwJaq96sY6O02iyk8', 0, '2025-10-09 09:34:13', '2025-10-09 17:46:31'),
(6, 'Sahil sir', 'sahil@gmail.com', '8299098496', NULL, 'uploads/download (3).png', 'Male', 0.00, '2000-01-01', 1, 0.00, 'dPWqTIZdS4OtJDkJ7Iw6xa:APA91bF8vmtalxPkHcbtkayYXT21cShj163cV9jQ6cu_Kt16tZuDEy7iBVkAx94HHreODZERy0YfVkkJRtZ_J778PoyXe5E_L3l9zcyP5p25HPUX654nDl0', 0, '2025-10-09 09:35:11', '2025-10-09 09:35:11'),
(7, 'Ashutosh', 'as@gmail.com', '6390404429', NULL, 'uploads/download (3).png', 'Male', 0.00, '2003-01-08', 1, 36.00, 'dHsgA5VTR1CPaXlPNQLMOj:APA91bECS6Kl6OfVrzlA7UdcNawZ3fhpgQIqRMixQXQPft6ErRqnSfUOrjKksF03SSZDFZPNA4Tq-HxePsGTs1sDo-ebz1dal1Gq2hVt_kY8pN_mx4inKyA', 2, '2025-10-09 09:54:12', '2025-11-11 15:15:28'),
(8, 'akhilesh ', 'akhil@gmail.com', '7800302707', NULL, 'uploads/download (3).png', 'Male', 0.00, '2000-01-27', 1, 0.00, 'ezA3HFocTSa49BfLt0b7cF:APA91bEDo9exxxg-S49E03X6DYZXQ5cngrin_4QR7H4qv6SEdN26DkE_DsML5tOhLsHUSnIRHRIJjOJu-Zh6APIScqkdRDNV26Ndj_Gp4iissTpJSNLXcNA', 1, '2025-10-09 15:10:55', '2025-11-11 15:15:11'),
(9, 'sanjana', 'sanju@gmail.com', '8303503703', NULL, 'uploads/download (3).png', 'Male', 995.40, '2000-01-27', 1, 80.60, 'f8--uy-3Qi6Xe98BfnBMqO:APA91bF3XpcV1q7ICCSexVfkZAEZWiLVTWKf7xiK1t_1hdngIiNBXecRRMxrdMQobf8Z82fhUkhwlQoVg7EF4p5U9f1ElBme2VGtcSdRtgieWhWqbDX95Wc', 2, '2025-10-09 15:11:13', '2025-11-11 15:15:18'),
(10, 'nikita', 'nikita@gmail.com', '8887652143', NULL, 'uploads/download (3).png', 'Female', 0.00, '2000-01-26', 1, 29.60, 'droqWvRrRWiyKjEQhZQzB6:APA91bHbQvO3yJgXbwM1Z23Xm32SfkQvllNavpLnlhChoRICKCUMZKgO97QLHV4Ur9VqSD6TC1RXKlFniY1N6_QYADt_dGZAVbRf7lM1epB8-WQG3g6vCDg', 0, '2025-10-09 17:15:35', '2025-10-09 17:19:57'),
(11, 'aman', 'aman@gmail.com', '7458946942', NULL, 'uploads/download (3).png', 'Female', 0.00, '2000-01-20', 1, 0.00, 'dpn2J23bTG-QEP52bhdYTU:APA91bGSpQzLlO0R8u6KwIPOfwNarEnhamPeJsouc8KXnQqyLxUGgVDGZKbjMbqpKbw76AzLb-1GJbjm9-TH0RFbDe-mfQgTTx2EVcXT59PWpiUh22gq68k', 2, '2025-10-09 17:43:42', '2025-11-11 15:17:52'),
(12, 'shubham', 'shubham@gmail.com', '7271023722', NULL, 'uploads/download (3).png', 'Male', 0.00, '2000-01-01', 1, 0.00, 'dRJunll_S9yTo9Tay7BkGE:APA91bHfXxk1osJWAXVvRRzZP8W78WnQ_bA4USDEE_XSnJ_IPaCmLWkWuczqSoeyIwCf4WAt2Q0RTAHFCh44XVfcV0HGaDfGshLWQxHs_GTbzRAKVx4LSOA', 0, '2025-10-09 17:49:22', '2025-10-28 10:19:02'),
(13, 'jj', 'gg@gmail.com', '9879879879', NULL, 'uploads/download (3).png', 'Female', 0.00, '2000-01-26', 1, 471.70, 'cq7R2ebnQFKxUyjTbDDQhu:APA91bFPrM0iV0_2YqGWnPyp71KvkqD89iNlrNdHC7EnQ-nr11YidqGuc-KZL0KdpIaYXhCVJKfJYSO68KgOfEaP5O5AozrpdjCsgu2VKbfKgN4UMMEZ3Cg', 0, '2025-10-10 00:11:48', '2025-10-10 09:21:51'),
(14, 'Aryab', 'shubhsri124@gmail.com', '7705017444', NULL, 'uploads/download (3).png', 'Male', 0.00, '2000-01-08', 1, 0.00, 'cnJabbSWQbWmC5NwRZ66ca:APA91bGTIi99vE_1WEOmSl0Pnf3ioR2xxIcCDFZy-TAgJ6jaWZjgz55US1o7u2NvpcfMqqRTLQ90lbABasXpmsuQxbaoVazZExQ-KxUQn0HhrqTBPIe6ncE', 0, '2025-10-25 15:41:15', '2025-10-25 15:41:15'),
(15, 'Arvind Kumar ', 'akmalik5@rediffmail.com', '7673903635', NULL, 'uploads/download (3).png', 'Male', 0.00, '1977-01-02', 1, 0.00, 'eyydM92xSO-hbSLO8opt3v:APA91bGyjSOcbGi6ZlloZZ-HRMO647pwThmZcHaEsreiLWMCCCjRYB7dUvVSvfL0a2y5fA8j_qDhCL_4VfHC2hntArGVNfS3Kp2bGPkssVRCNikLYoISsMs', 0, '2025-10-27 11:28:42', '2025-10-27 11:28:42'),
(16, 'Ramesh Katiyar ', 'banajj@gmail.com', '8920500822', NULL, 'uploads/download (3).png', 'Male', 0.00, '2000-01-26', 1, 0.00, 'dDUz8zkvRMuiGqP6lBoZzI:APA91bGc-BrWhajEdDMhQYaN89rsFEsWUqpv1amytYd0szNvYLHNr9-u7JggZimeOJR6TVIQXf2KpxgiLIZ5fTSHvRwa2tQoaI3xFmMJ6G5Y-w_SKrCFxHw', 0, '2025-10-29 17:46:06', '2025-10-29 17:46:06'),
(17, 'BL', 'bl@gmail.com', '8840432535', NULL, 'uploads/download (3).png', 'Male', 0.00, '1950-01-01', 1, 0.00, 'f1NJWFegS6mvysSoSxofUj:APA91bGbj6QQTG58KtHQ9n9Y_klvFbRT85p6jpv6AHAtJK7SmLJIknsbKHwoyWtKPgWm9YgIEJrb5XCpuEJE-LqlatnAnXEYx7qH3fmj2xs2TYhzGTDSCpY', 0, '2025-10-29 19:29:13', '2025-10-29 19:29:13'),
(18, 'Mukeem Ahmad ', 'mukimansari009@gmail.com', '6392677430', NULL, 'uploads/download (3).png', 'Male', 0.00, '2005-09-07', 1, 0.00, 'fz-aitUrSoWKQNNCvvUijT:APA91bE5djAEeg2X5Mx1P0_dArmDkB5b7pu1RXmwiUWXzO4eKlv3DOM6LK2QQpuH8mY09uE4mCdhsZ_Dmasc1jXUGApatIS4TsfP2jKL3qNKgnO5rMRdj-8', 0, '2025-10-29 21:43:50', '2025-10-29 21:43:50'),
(19, 'shajpreet singh ', 'shajkhaira@gmail.com', '9034337458', NULL, 'uploads/download (3).png', 'Male', 0.00, '2006-05-15', 1, 0.00, 'dsqNX2IOQ92k2Yf4_wq1iM:APA91bECVG58XBvsbFT-tw60PbhcfYvpdCl4KLvNsJE8c_gQ4AdJZQlefrZyEvLVmBJ-u1ZNknqqHhM9w_14ACOYb-_YQyM77vGGsYSUGTVcRNLWqTGO1y0', 0, '2025-11-04 19:29:59', '2025-11-11 15:18:05');

-- --------------------------------------------------------

--
-- Table structure for table `user_bank_accounts`
--

CREATE TABLE `user_bank_accounts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `account_holder_name` varchar(100) NOT NULL,
  `bank_name` varchar(100) NOT NULL,
  `account_number` varchar(30) NOT NULL,
  `ifsc_code` varchar(20) NOT NULL,
  `branch_name` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `user_bank_accounts`
--

INSERT INTO `user_bank_accounts` (`id`, `user_id`, `account_holder_name`, `bank_name`, `account_number`, `ifsc_code`, `branch_name`, `created_at`) VALUES
(1, 2, 'ROHIT KUMAR', 'SBI', '95949949494994949', 'SBIN0000010', 'LUCKNOW', '2025-10-08 23:43:54'),
(2, 1, 'UDUFFUIIUUUIUIJIUUUJUUFCUJJJJJJJJJCCJCUIIGIVI-.......', 'FUFUGJJJBHHJKLXXYU', '86867242554676868', 'HJJK0001344', 'JCJCCXXFDSRYUIOVGG', '2025-10-08 23:59:30'),
(3, 10, 'BHH', 'GGGGG', '66669999999999999', 'HJGN0001234', 'HHHHH', '2025-10-09 17:16:41');

-- --------------------------------------------------------

--
-- Table structure for table `user_documents`
--

CREATE TABLE `user_documents` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `passport_photo` varchar(255) DEFAULT NULL,
  `aadhar_photo` varchar(255) DEFAULT NULL,
  `aadhar_back_photo` varchar(255) DEFAULT NULL,
  `pan_photo` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `user_documents`
--

INSERT INTO `user_documents` (`id`, `user_id`, `passport_photo`, `aadhar_photo`, `aadhar_back_photo`, `pan_photo`, `created_at`) VALUES
(1, 1, '/uploads/passport_1760076786171.png', '/uploads/aadhar_front_1760076786171.png', '/uploads/aadhar_back_1760076786171.png', '/uploads/pan_1760076786172.png', '2025-10-10 11:43:06');

-- --------------------------------------------------------

--
-- Table structure for table `user_notifications`
--

CREATE TABLE `user_notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_saved_routes`
--

CREATE TABLE `user_saved_routes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `from_full_address` text DEFAULT NULL,
  `from_latitude` double DEFAULT NULL,
  `from_longitude` double DEFAULT NULL,
  `from_city` varchar(100) DEFAULT NULL,
  `from_state` varchar(100) DEFAULT NULL,
  `to_full_address` text DEFAULT NULL,
  `to_latitude` double DEFAULT NULL,
  `to_longitude` double DEFAULT NULL,
  `to_city` varchar(100) DEFAULT NULL,
  `to_state` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `brand_name` varchar(100) DEFAULT NULL,
  `model_name` varchar(100) DEFAULT NULL,
  `vehicle_number` varchar(50) DEFAULT NULL,
  `vehicle_color` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `user_id`, `brand_name`, `model_name`, `vehicle_number`, `vehicle_color`, `created_at`) VALUES
(2, 2, 'Toyota', 'Innova Crysta', 'UP21WN44BA', 'Blue', '2025-10-08 18:18:54'),
(7, 3, 'Tesla', 'Model Y', 'GH33GG1234', 'Purple', '2025-10-08 18:56:48'),
(9, 5, 'Maruti Suzuki', 'XL6', 'GH13FH1234', 'Blue', '2025-10-09 04:11:54'),
(10, 7, 'BMW', '5 Series', 'UP60AF6951', 'Gray', '2025-10-09 04:48:33'),
(12, 9, 'Hyundai', 'Alcazar', 'HJ12GH2234', 'Gray', '2025-10-09 09:49:05'),
(13, 8, 'Mercedes', 'C-Class', 'GH34GH1245', 'Maroon', '2025-10-09 09:52:10'),
(14, 4, 'Toyota', 'Innova Crysta', 'GH23HJ1235', 'Maroon', '2025-10-09 09:54:15'),
(15, 10, 'Jeep', 'Compass', 'HH12GH1234', 'Blue', '2025-10-09 11:45:57'),
(16, 13, 'Hyundai', 'Alcazar', 'HJ34GH1234', 'Gray', '2025-10-09 18:44:33'),
(20, 1, 'BMW', 'i5', 'HJ12GH1233', 'Blue', '2025-10-10 09:26:05'),
(21, 1, 'Mercedes', 'GLC', 'GH12GH1234', 'Gray', '2025-10-10 10:28:11'),
(22, 17, 'Vinfast', 'VF 6', 'UP32BH7878', 'White', '2025-10-29 14:02:05'),
(23, 14, 'Maruti Suzuki', 'Dzire', 'UP32MB2773', 'Blue', '2025-11-09 16:15:59');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_colors`
--

CREATE TABLE `vehicle_colors` (
  `id` int(11) NOT NULL,
  `color_name` varchar(50) NOT NULL,
  `color_code` varchar(10) NOT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `vehicle_colors`
--

INSERT INTO `vehicle_colors` (`id`, `color_name`, `color_code`, `status`, `created_at`) VALUES
(1, 'Olive', '#61D530', 1, '2025-07-22 03:56:41'),
(2, 'Brown', '#844343', 1, '2025-07-22 03:56:41'),
(3, 'Orange', '#D5B130', 1, '2025-07-22 03:56:41'),
(5, 'Purple', '#A030D5', 1, '2025-07-22 03:56:41'),
(6, 'Cyan', '#30B9D5', 1, '2025-07-22 03:56:41'),
(7, 'Blue', '#3035D5', 1, '2025-07-22 03:56:41'),
(8, 'Teal', '#3085D5', 1, '2025-07-22 03:56:41'),
(9, 'Red', '#ED0C0C', 1, '2025-07-22 03:56:41'),
(10, 'Lime', '#32D530', 1, '2025-07-22 03:56:41'),
(11, 'Maroon', '#710909', 1, '2025-07-22 03:56:41'),
(12, 'Gray', '#7D7D7D', 1, '2025-07-22 03:56:41'),
(15, 'Silver', '#A9BCB9', 1, '2025-07-23 09:17:13'),
(16, 'Black', '#120C0C', 1, '2025-07-23 09:17:37'),
(17, 'Magenta', '#B930D5', 1, '2025-07-23 09:18:33'),
(23, 'White', '#FFFFFF', 1, '2025-07-23 09:18:33');

-- --------------------------------------------------------

--
-- Table structure for table `withdraw_commission`
--

CREATE TABLE `withdraw_commission` (
  `id` int(11) NOT NULL,
  `percentage` varchar(20) DEFAULT NULL,
  `min_amount` double(10,2) DEFAULT NULL,
  `max_amount` double(10,2) DEFAULT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `withdraw_commission`
--

INSERT INTO `withdraw_commission` (`id`, `percentage`, `min_amount`, `max_amount`, `updated`) VALUES
(1, '2', 100.00, 5000.00, '2025-09-18 09:13:33');

-- --------------------------------------------------------

--
-- Table structure for table `withdraw_requests`
--

CREATE TABLE `withdraw_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` tinyint(4) DEFAULT 0,
  `requested_at` datetime DEFAULT current_timestamp(),
  `processed_at` datetime DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `withdraw_requests`
--

INSERT INTO `withdraw_requests` (`id`, `user_id`, `account_id`, `amount`, `status`, `requested_at`, `processed_at`, `remarks`) VALUES
(1, 1, 2, 100.00, 0, '2025-10-10 17:50:15', NULL, NULL),
(2, 1, 2, 500.00, 2, '2025-10-28 10:23:33', '2025-10-29 17:01:04', 'Cashfree payout API error. Refunded to wallet.'),
(3, 1, 2, 700.00, 0, '2025-11-06 15:25:59', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `admin_settings`
--
ALTER TABLE `admin_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `CarBrand`
--
ALTER TABLE `CarBrand`
  ADD PRIMARY KEY (`brand_id`);

--
-- Indexes for table `CarModel`
--
ALTER TABLE `CarModel`
  ADD PRIMARY KEY (`model_id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- Indexes for table `commission_settings`
--
ALTER TABLE `commission_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `due_payments`
--
ALTER TABLE `due_payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fare_rules`
--
ALTER TABLE `fare_rules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `help_support_pages`
--
ALTER TABLE `help_support_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slugname` (`slugname`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ride_id` (`ride_id`),
  ADD KEY `reviewer_id` (`reviewer_id`),
  ADD KEY `reviewee_id` (`reviewee_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rides`
--
ALTER TABLE `rides`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `ride_bookings`
--
ALTER TABLE `ride_bookings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ride_payments`
--
ALTER TABLE `ride_payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ride_stops`
--
ALTER TABLE `ride_stops`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ride_id` (`ride_id`);

--
-- Indexes for table `setting`
--
ALTER TABLE `setting`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `user_bank_accounts`
--
ALTER TABLE `user_bank_accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_documents`
--
ALTER TABLE `user_documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_notifications`
--
ALTER TABLE `user_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_saved_routes`
--
ALTER TABLE `user_saved_routes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicle_colors`
--
ALTER TABLE `vehicle_colors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `withdraw_commission`
--
ALTER TABLE `withdraw_commission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `withdraw_requests`
--
ALTER TABLE `withdraw_requests`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin_settings`
--
ALTER TABLE `admin_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `CarBrand`
--
ALTER TABLE `CarBrand`
  MODIFY `brand_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `CarModel`
--
ALTER TABLE `CarModel`
  MODIFY `model_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- AUTO_INCREMENT for table `commission_settings`
--
ALTER TABLE `commission_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `due_payments`
--
ALTER TABLE `due_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `fare_rules`
--
ALTER TABLE `fare_rules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `help_support_pages`
--
ALTER TABLE `help_support_pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rides`
--
ALTER TABLE `rides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `ride_bookings`
--
ALTER TABLE `ride_bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `ride_payments`
--
ALTER TABLE `ride_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `ride_stops`
--
ALTER TABLE `ride_stops`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `setting`
--
ALTER TABLE `setting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `user_bank_accounts`
--
ALTER TABLE `user_bank_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_documents`
--
ALTER TABLE `user_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_notifications`
--
ALTER TABLE `user_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_saved_routes`
--
ALTER TABLE `user_saved_routes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `vehicle_colors`
--
ALTER TABLE `vehicle_colors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `withdraw_commission`
--
ALTER TABLE `withdraw_commission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `withdraw_requests`
--
ALTER TABLE `withdraw_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `CarModel`
--
ALTER TABLE `CarModel`
  ADD CONSTRAINT `CarModel_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `CarBrand` (`brand_id`);

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`id`),
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `ratings_ibfk_3` FOREIGN KEY (`reviewee_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `rides`
--
ALTER TABLE `rides`
  ADD CONSTRAINT `rides_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `ride_stops`
--
ALTER TABLE `ride_stops`
  ADD CONSTRAINT `ride_stops_ibfk_1` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`id`);

--
-- Constraints for table `user_notifications`
--
ALTER TABLE `user_notifications`
  ADD CONSTRAINT `user_notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
