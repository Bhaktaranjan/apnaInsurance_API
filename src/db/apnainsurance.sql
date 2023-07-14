-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 14, 2023 at 05:15 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `apnainsurance`
--

-- --------------------------------------------------------

--
-- Table structure for table `enquires`
--

CREATE TABLE `enquires` (
  `Id` int(11) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `DOB` datetime NOT NULL,
  `PermanentAddress1` varchar(500) NOT NULL,
  `PermanentAddress2` varchar(200) NOT NULL,
  `PermanentAddress3` varchar(200) NOT NULL,
  `ContactNumber` varchar(11) NOT NULL,
  `EmailId` varchar(200) NOT NULL,
  `Manufacturer` varchar(100) NOT NULL,
  `Vehicle` varchar(100) NOT NULL,
  `Model` varchar(100) NOT NULL,
  `DateOfRegistration` datetime NOT NULL,
  `YearOfManufacture` year(4) NOT NULL,
  `RtoRegistered` varchar(200) NOT NULL,
  `RegistrationNumber` varchar(100) NOT NULL,
  `EngineNumber` varchar(100) NOT NULL,
  `ChasisNumber` varchar(100) NOT NULL,
  `CubicCapacity` varchar(10) NOT NULL,
  `SeatingCapacity` int(10) NOT NULL,
  `FuelType` varchar(100) NOT NULL,
  `PolicyNumber` varchar(100) NOT NULL,
  `NomineeName` varchar(200) NOT NULL,
  `NomineeAge` varchar(11) NOT NULL,
  `NomineeRelationship` varchar(100) NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `fueltype`
--

CREATE TABLE `fueltype` (
  `Id` int(11) NOT NULL,
  `FuelType` varchar(200) NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `EntityState` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `manufacturer`
--

CREATE TABLE `manufacturer` (
  `Id` int(11) NOT NULL,
  `ManufacturerName` varchar(200) NOT NULL,
  `EntityState` tinyint(4) DEFAULT 1,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `model`
--

CREATE TABLE `model` (
  `Id` int(11) NOT NULL,
  `VehicleId` int(11) NOT NULL,
  `ManufaturerId` int(11) NOT NULL,
  `ModelName` varchar(200) NOT NULL,
  `EntityState` tinyint(4) DEFAULT 1,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `Id` int(11) NOT NULL,
  `Name` varchar(200) NOT NULL,
  `Email` varchar(200) NOT NULL,
  `UserName` varchar(100) NOT NULL,
  `Password` varchar(200) NOT NULL,
  `PhoneNo` varchar(15) NOT NULL,
  `Role` varchar(40) NOT NULL,
  `EntityState` tinyint(4) NOT NULL DEFAULT 1,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`Id`, `Name`, `Email`, `UserName`, `Password`, `PhoneNo`, `Role`, `EntityState`, `CreatedOn`) VALUES
(1, 'Admin', 'admin@gmail.com', 'admin', '$2a$08$.P2unq7jCm9eSQ0YwETjn.iaTUEwYDmp0Bnb3K3ec4KkHLF0G3qP2', '1111111111', 'admin', 1, '2023-06-30 06:10:01'),
(3, 'Akhil', 'akhil@gmail.com', 'akhil', '$2a$08$Zt//vC3/WFN68Ld1XXnweO39MW//TT0ChStyJUafL9MuodP1l5/7y', '9178626257', 'agent', 0, '2023-07-07 09:08:36'),
(4, 'Anisha', 'anisha@gmail.com', 'anisha', '$2a$08$nkO5OCiYXwKKtFMT13IATOk7NxYZJ9Z8Uzf/bNuWo4MLgtKVYv.Zy', '9178626257', 'agent', 1, '2023-07-07 10:35:58'),
(7, 'Anisha', 'anisha@gmail.com', 'anisha1', '$2a$08$OvZSrWQbFIK/2Im62G3OhuHMiXxsA57nS5phv4JqvKtZ9RxeP/1zG', '9178626257', 'agent', 0, '2023-07-10 10:23:00'),
(9, 'Anisha', 'anisha@gmail.com', 'akhil1', '$2a$08$6d9qOvHklOyp1AiYfocwm.gnNono..Wv3RI.h4bwq.pEFY3tAn67q', '9178626257', 'agent', 0, '2023-07-12 13:20:37');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle`
--

CREATE TABLE `vehicle` (
  `Id` int(11) NOT NULL,
  `ManufaturerId` int(11) NOT NULL,
  `VehicleName` varchar(200) NOT NULL,
  `EntityState` tinyint(4) NOT NULL DEFAULT 1,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `enquires`
--
ALTER TABLE `enquires`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `fueltype`
--
ALTER TABLE `fueltype`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `manufacturer`
--
ALTER TABLE `manufacturer`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `model`
--
ALTER TABLE `model`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `VehicleModelId` (`VehicleId`,`ManufaturerId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `UserName` (`UserName`);

--
-- Indexes for table `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ManufaturerId` (`ManufaturerId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `enquires`
--
ALTER TABLE `enquires`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fueltype`
--
ALTER TABLE `fueltype`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `manufacturer`
--
ALTER TABLE `manufacturer`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `model`
--
ALTER TABLE `model`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
