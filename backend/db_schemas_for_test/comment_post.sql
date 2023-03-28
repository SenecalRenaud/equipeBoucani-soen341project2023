-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 02, 2023 at 02:01 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

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
-- Table structure for table `comment_post`
--

CREATE TABLE `comment_post` (
  `id` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `editDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comment_post`
--

INSERT INTO `comment_post` (`id`, `title`, `body`, `date`, `editDate`) VALUES
(1, 'This is the title from first post method', 'and this the first body, but IT WAS EDITED BY A PUT REQUEST !', '2023-02-15 00:52:12', NULL),
(3, 'Wow ! This is the title from the SECOND POST request !', 'I am a body of the second post request to add a commentPublication, but I will be deleted in further request', '2023-02-16 00:41:15', NULL),
(9, 'Titre #2342343243242', 'ya pas de commentaire', '2023-02-22 00:50:11', NULL),
(12, 'Titre #asdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'no comments', '2023-02-22 00:51:48', NULL),
(37, 'edited', 'forcefully edited x3', '2023-03-01 02:26:23', NULL),
(54, 'ZUmbani', 'wombake', '2023-03-01 13:52:00', NULL),
(70, 'EEEE))3jajsa', 'BBBBBBBB', '2023-03-01 15:28:39', '2023-03-01 19:43:45'),
(76, 'Only this title was edited (again)!!!!!', 'SOME COMMENT CONTENT NO ONE CARES ABOUTE :(', '2023-03-01 19:41:23', '2023-03-01 19:42:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comment_post`
--
ALTER TABLE `comment_post`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comment_post`
--
ALTER TABLE `comment_post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
