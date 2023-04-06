-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 31, 2023 at 04:40 PM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `flask_test_mysql_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `job_post`
--

DROP TABLE IF EXISTS `job_post`;
CREATE TABLE IF NOT EXISTS `job_post` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jobtype` text NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `location` text,
  `salary` int DEFAULT NULL,
  `tags` text,
  `description` text,
  `date` datetime DEFAULT NULL,
  `editDate` datetime DEFAULT NULL,
  `employerUid` varchar(28) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `job_post`
--

INSERT INTO `job_post` (`id`, `jobtype`, `title`, `location`, `salary`, `tags`, `description`, `date`, `editDate`, `employerUid`) VALUES
(1, 'Full-Time', 'Minion', 'Gru\'s House', 10, 'Finance,Design', 'steal the moon', '2023-03-22 17:43:28', NULL, 'RJA0ysCVJCfd9mlFrV31zyMXftF3'),
(2, 'Part-Time', 'Back-End dev', 'Quebec City', 2950, 'Healthcare,IT', 'jjj', '2023-03-22 17:45:36', NULL, 'OtZw937K1URQa7GMbNLG5gZLosD2'),
(7, 'Full-Time', 'Software Dev', 'Montreal', 4600, 'Healthcare,Marketing', 'testing 123', '2023-03-29 19:19:15', NULL, 'GJPsv1EsOHfeqCuwxHZlyWJ7Nam1');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
