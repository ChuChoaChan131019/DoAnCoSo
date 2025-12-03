CREATE DATABASE  IF NOT EXISTS `caibang` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `caibang`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: caibang
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `candidate`
--

DROP TABLE IF EXISTS `candidate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate` (
  `ID_User` int NOT NULL,
  `ID_Candidate` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `FullName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Phonenumber` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Resume_URL` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID_Candidate`),
  KEY `ID_User` (`ID_User`),
  CONSTRAINT `candidate_ibfk_1` FOREIGN KEY (`ID_User`) REFERENCES `users` (`ID_User`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate`
--

LOCK TABLES `candidate` WRITE;
/*!40000 ALTER TABLE `candidate` DISABLE KEYS */;
INSERT INTO `candidate` VALUES (24,'C00024','anh khoa',NULL,NULL,NULL);
/*!40000 ALTER TABLE `candidate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `ID_Category` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name_Category` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID_Category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('000001','Công nghệ thông tin'),('000002','Kế toán'),('000003','Marketing'),('000004','Thiết kế đồ họa'),('000005','Nhân sự');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_cat_before_insert` BEFORE INSERT ON `category` FOR EACH ROW BEGIN
  DECLARE n INT;
  IF NEW.ID_Category IS NULL OR NEW.ID_Category = '' THEN
    SELECT COALESCE(MAX(CAST(ID_Category AS UNSIGNED)), 0) + 1 INTO n FROM Category;
    SET NEW.ID_Category = LPAD(n, 6, '0');
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `employer`
--

DROP TABLE IF EXISTS `employer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employer` (
  `ID_User` int NOT NULL,
  `ID_Employer` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Company_Name` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Company_Address` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Company_Email` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Company_Description` text COLLATE utf8mb4_unicode_ci,
  `Company_Website` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Company_Logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Company_Phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Founded_Date` date DEFAULT NULL,
  PRIMARY KEY (`ID_Employer`),
  UNIQUE KEY `uq_employer_user` (`ID_User`),
  UNIQUE KEY `Company_Email` (`Company_Email`),
  UNIQUE KEY `Company_Website` (`Company_Website`),
  CONSTRAINT `employer_ibfk_1` FOREIGN KEY (`ID_User`) REFERENCES `users` (`ID_User`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employer`
--

LOCK TABLES `employer` WRITE;
/*!40000 ALTER TABLE `employer` DISABLE KEYS */;
INSERT INTO `employer` VALUES (2,'E00002','LOTTE Mart Việt Nam','Hà Nội','lottemart@gmail.com','Tập đoàn LOTTE (Hangul: 롯데 그룹) là tập đoàn đa quốc gia có trụ sở tại Hàn Quốc và Nhật Bản. Tập đoàn LOTTE do ông Shin Kyuk-ho sáng lập vào tháng 6 năm 1948 tại Tokyo, Nhật Bản, tiền thân là Công ty LOTTE. Ông Shin Kyuk-ho sinh ngày 04 tháng 10 năm 1922 tại Hàn Quốc nhưng ông sống, học tập và làm việc tại Nhật Bản. Ông tốt nghiệp ngành Hoá học đại học Waseda. Tháng 4 năm 1967, ông Shin Kyuk-ho mở rộng kinh doanh về thị trường Hàn Quốc bằng việc thành lập Công ty Bánh kẹo LOTTE tại Seoul.\r\n\r\nTập đoàn LOTTE gồm hai nhánh: Tập đoàn LOTTE Nhật Bản và Tập đoàn LOTTE Hàn Quốc. Chủ tịch đương thời của tập đoàn LOTTE Hàn Quốc là ông Shin Dong Bin – con trai ông Shin Kyuk-ho. Hiện nay, tập đoàn LOTTE Hàn Quốc có mặt tại 22 quốc gia trên thế giới và là tập đoàn có tổng tài sản đứng thứ 5 tại Hàn Quốc.\r\n\r\nTên gọi LOTTE được nhà sáng lập Shin Kyuk-ho đặt ra, lấy cảm hứng từ nữ anh hùng Charlotte xinh đẹp, tài giỏi và được nhiều người yêu mến trong tiểu thuyết Nỗi đau của chàng Werther (1774) của nhà văn Đức Johann Wolfgang von Goethe. Với mong muốn tập đoàn LOTTE sẽ nhận được sự yêu mến, tín nhiệm của mọi người giống như nhân vật chính trong truyện, nàng Charlotte xinh đẹp, tài giỏi.','lottemart.com.vn.','/uploads/logo_2_1762139881988.png','02837751888','2001-06-03'),(3,'E00003','CÔNG TY CP TẬP ĐOÀN VÀNG BẠC ĐÁ QUÝ DOJI','Hà Nội','doji@gmail.com','Với tiền thân là Công ty Phát triển Công nghệ và Thương mại TTD được thành lập ngày 28/07/1994. Vào thời điểm những năm 90 của thế kỉ 20, Công ty TTD chính là doanh nghiệp tiên phong trong hoạt động chuyên sâu về khai thác đá quý, chế tác cắt mài và xuất khẩu đá quý ra thị trường quốc tế, vốn là một lĩnh vực vô cùng mới mẻ tại Việt Nam.\r\n\r\nNăm 2007, để kiện toàn bộ máy, Công ty TTD chính thức đổi tên thành Công ty Cổ phần Vàng bạc Đá quý & Đầu tư Thương mại DOJI. Năm 2009, để kiện toàn bộ máy cho giai đoạn chiến lược phát triển mới, DOJI đã tiến hành tái cấu trúc và chính thức trở thành Tập đoàn Vàng bạc Đá quý DOJI, hoạt động theo mô hình Công ty Mẹ – Con.','https://doji.vn/','/uploads/logo_3_1762140029077.png','02433662288','2001-07-26'),(4,'E00004','CÔNG TY CP SỮA VIỆT NAM','Thành phố Hồ Chí Minh','suavienam@gmail.com','Vinamilk là tên gọi tắt của Công ty Cổ phần Sữa Việt Nam  (Vietnam DairyProducts Joint Stock Company) một công ty sản xuất, kinh doanh sữa và các sản phẩmtừ sữa cũng như thiết bị máy móc liên quan tại Việt Nam, là công ty lớn thứ 15 tại ViệtNam vào năm 2007. Công ty là doanh nghiệp hàng đầu của ngành công nghiệp chếbiến sữa, hiện chiếm lĩnh 75% thị phần sữa tại Việt Nam. Ngoài việc phân phối mạnhtrong nước với mạng lưới 183 nhà phân phối và gần 94.000 điểm bán hàng phủ đều 64tỉnh thành,  sản phẩm Vinamilk  còn  được xuất khẩu  sang nhiều nước Mỹ, Pháp,Canada, Ba Lan, Đức, khu vực Trung Đông, Đông Nam Á... Sau hơn 30 năm ra mắtngười tiêu dùng, Vinamilk đã xây dựng được 8 nhà máy, 1 xí nghiệp và đang xây dựngthêm 3 nhà máy mới, với sự đa dạng về sản phẩm, Vinamilk hiện có trên 200 mặt hàngsữa tiệt trùng, thanh trùng và các sản phẩm được làm từ sữa.','www.vinamilk.com.vn/','/uploads/logo_4_1762140077273.png','02854155555','2001-08-18'),(5,'E00005','CÔNG TY CP FPT','Hà Nội','fpt@gmail.com','FPT là công ty tiên phong chuyển đổi số và dẫn đầu về tư vấn, cung cấp, triển khai các dịch vụ, giải pháp công nghệ - viễn thông. Chúng tôi đồng hành cùng các khách hàng tại 30 quốc gia và vùng lãnh thổ trên toàn cầu hiện thực hóa chiến lược, mục tiêu phát triển kinh doanh dựa trên công nghệ.\r\n\r\nVới kinh nghiệm triển khai dự án trên phạm vi toàn cầu trong suốt hơn ba thập kỷ qua, chúng tôi giúp khách hàng vượt qua những thách thức, rào cản và đạt được hiệu quả cao nhất trong hành trình chuyển đổi số. Dựa trên những công nghệ mới nhất trí tuệ nhân tạo, phân tích dữ liệu lớn, điện toán đám mây, tự động hóa, kết nối vạn vật…, chúng tôi đưa ra những giải pháp, dịch vụ công nghệ tiên tiến giúp khách hàng chủ động, linh hoạt thích ứng trong mọi bối cảnh.','https://fpt.com/vi','/uploads/logo_5_1762140139081.png','02473007300',NULL),(6,'E00006','CÔNG TY CP HÀNG KHÔNG VIETJET','Hà Nội','hangkhongvietjet@gmail.com','Tầm nhìn:\r\nTrở thành tập đoàn hàng không đa quốc gia, có mạng bay rộng khắp khu vực và thế giới, phát triển không chỉ dịch vụ hàng không mà còn cung cấp hàng tiêu dùng trên nền tảng thương mại điện tử, là thương hiệu được khách hàng yêu thích và tin dùng.\r\n\r\nSứ mệnh:\r\nKhai thác và phát triển mạng đường bay rộng khắp trong nước, khu vực và quốc tế\r\nMang đến sự đột phá trong dịch vụ hàng không\r\nLàm cho dịch vụ hàng không trở thành phương tiện di chuyển phổ biến ở Việt Nam và quốc tế\r\nMang lại niềm vui, sự hài lòng cho khách hàng bằng dịch vụ vượt trội, sang trọng và những nụ cười thân thiện.\r\nGiá trị cốt lõi: An toàn – Vui vẻ – Giá rẻ – Đúng giờ\r\nHiện nay Vietjet đang khai thác mạng đường bay phủ khắp các điểm đến tại Việt Nam và hơn 30 điểm đến trong khu vực tới Thái Lan, Singapore, Malaysia, Myanmar, Đài Loan, Hàn Quốc, Trung Quốc, Nhật Bản, Hồng Công, khai thác đội tàu bay hiện đại A320 và A321 với độ tuổi bình quân là 3.3 năm.\r\nVietjet là thành viên chính thức của Hiệp hội Vận tải Hàng không Quốc tế (IATA) với Chứng nhận An toàn khai thác IOSA. Văn hoá An toàn là một phần quan trọng trong văn hoá doanh nghiệp Vietjet, được quán triệt từ lãnh đạo đến mỗi nhân viên trên toàn hệ thống.','https://www.vietjetair.com/vi','/uploads/logo_6_1762140176819.png','19001866','2001-11-23'),(7,'E00007','CÔNG TY CP STAVIAN HÓA CHẤT','Hưng Yên','stavian@gmail.com','Giới thiệu\r\nRa đời từ năm 2009, Tập đoàn Stavian hoạt động trong lĩnh vực sản xuất công nghiệp, công nghệ và thương mại quốc tế với mạng lưới khách hàng, đối tác toàn cầu.\r\n\r\nTầm nhìn\r\nTrở thành Tập đoàn công nghiệp – công nghệ, thương mại đa quốc gia, quy mô lớn, mang đến những giá trị thịnh vượng bền vững toàn cầu. \r\n\r\nSứ mệnh\r\nĐáp ứng các nhu cầu của khách hàng – thị trường bằng những sản phẩm, dịch vụ tốt nhất. Tập đoàn kiên định phát triển bền vững, tạo ra hàng vạn công ăn việc làm và đảm bảo thu nhập cao cho CBNV, mang lại lợi ích cho các cổ đông và các nhà đầu tư, góp phần vào sự phát triển tại các quốc gia, khu vực mà Tập đoàn hoạt động, tích cực tham gia bảo vệ môi trường và có trách nhiệm cao với cộng đồng.','https://stavian.com/vi','/uploads/logo_7_1762140231570.jpg','0936078520','2001-09-07'),(8,'E00008','CÔNG TY CP TẬP ĐOÀN HOA SEN','Thành phố Hồ Chí Minh','hoasen@gmail.com','Tập đoàn Hoa Sen tên đầy đủ Công ty cổ phần tập đoàn Hoa Sen (tên tiếng anh: Hoa Sen Group) – chuyên chế biến sản xuất, kinh doanh sản phẩm tôn thép. Công ty được thành lập vào ngày 08/08/2001 với số vốn điều lệ ban đầu là 30 tỷ đồng. Sau khoảng thời gian dài xây dựng, phát triển, doanh nghiệp đã có những bước vươn lên vững chắc để trở thành doanh nghiệp kinh doanh trong lĩnh vực tôn – thép số 1 tại thị trường Việt Nam.\r\n\r\nHiện nay, công ty đã nâng số vốn điều lệ lên 4.446.252.130.000 đồng. Tiến hành IPO trên sàn chứng khoán với mã chứng khoán là HSG từ ngày 08/11/2008. Doanh nghiệp hiện đang chiếm 33,1% thị phần tôn và 20,3% thị phần ống thép theo thống kê của Hiệp hội Thép Việt Nam.\r\n\r\nSản phẩm của tập đoàn Hoa Sen thường xuyên đạt chất lượng thuộc tiêu chuẩn quốc tế. Cùng với giá cả phải chăng, dịch vụ khách hàng hợp lý đã giúp cho tập đoàn luôn nhận được sự tin tưởng tới từ người tiêu dùng. Tính đến thời điểm hiện tại, Hoa Sen Group đang có:\r\n\r\n11 nhà máy lớn\r\n300 chi nhánh phân phối, bán lẻ trên khắp cả nước\r\nSản phẩm được tin dùng tại trên 70 quốc gia, vùng lãnh thổ trên toàn cầu','https://hoasengroup.vn','/uploads/logo_8_1762140280782.jpg','18001515','2001-08-06'),(9,'E00009','NGÂN HÀNG TMCP TIÊN PHONG','Hà Nội','tienphong@gmail.com','TPBank là viết tắt của Ngân hàng Thương mại Cổ phần Tiên Phong, là một ngân hàng thương mại cổ phần tư nhân tại Việt Nam, được thành lập vào năm 2008. Tên giao dịch ban đầu là TienPhongBank và sau đó được rút gọn thành TPBank từ ngày 10/12/2013. Ngân hàng này hoạt động theo các quy định của Ngân hàng Nhà nước Việt Nam và được đánh giá cao về công nghệ, ngân hàng số và đổi mới.','https://tpb.vn','/uploads/logo_9_1762327791879.jpg','1900585885','2008-05-05'),(10,'E00010','CÔNG TY CP THẾ GIỚI SỐ',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,'E00011','CÔNG TY CP XÂY DỰNG CONTECCONS',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,'E00012','CÔNG TY CP PIV',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,'E00013','CÔNG TY CP THÉP NAM KIM',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,'E00014','CÔNG TY CP TẬP ĐOÀN PAN',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,'E00015','CÔNG TY CP TẬP ĐOÀN SAO MAI','An Giang','saomai@gmail.com','Tập đoàn Sao Mai (Sao Mai Group) là một tập đoàn đa ngành của Việt Nam, tập trung vào các lĩnh vực chính như bất động sản, thủy sản, du lịch, công nghiệp chế biến và năng lượng tái tạo. Trước đây, tập đoàn có tên gọi ban đầu là Tập đoàn Xây dựng Sao Mai, thành lập vào năm 1997. \r\nBất động sản: Sao Mai Group là một trong những nhà đầu tư và kinh doanh bất động sản hàng đầu tại khu vực Đồng bằng sông Cửu Long, với các dự án khu đô thị và dịch vụ.\r\nThủy sản: Tập đoàn đầu tư mạnh vào lĩnh vực thủy sản, bao gồm sản xuất thức ăn thủy sản và xuất khẩu thủy sản qua công ty thành viên IDI.\r\nDu lịch: Tập đoàn đã đầu tư vào du lịch từ sớm với các dự án khu resort và sở hữu các công ty du lịch như Công ty cổ phần Du lịch Đồng Tháp và Công ty cổ phần Du lịch An Giang.\r\nNăng lượng tái tạo: Sao Mai Group đang phát triển các dự án điện mặt trời với tổng công suất lớn tại các tỉnh miền Nam như Long An và An Giang.','https://saomaigroup.com/vn/gioi-thieu.html','/uploads/logo_15_1762328221489.png','','1997-02-05'),(16,'E00016','CÔNG TY CP NHỰA AN PHÁT XANH',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,'E00017','CÔNG TY CP QUỐC TẾ SƠN HÀ',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,'E00018','CÔNG TY CP GIAO DỊCH HÀNG HÓA TÂY NGUYÊN',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,'E00019','CÔNG TY CP VĨNH HOÀN','Đồng Tháp','vinhhoan@gmail.com','Tiền thân của công ty CP Vĩnh Hoàn là Công ty TNHH Vĩnh Hoàn thành lập ngày 19/12/1997. Năm 2007, công ty chuyển đổi thành công ty CP với tên gọi Công ty CP Vĩnh Hoàn. Công Ty CP Vĩnh Hoàn là một trong những công ty chế biến và xuất khẩu cá tra, basa hàng đầu của Việt Nam. Vĩnh Hoàn là công ty có quy mô thuộc vào những doanh nghiệp lớn trong ngành chế biến xuất khẩu của cả nước, tổng công suất hiện tại lên đến 250 tấn cá nguyên liệu/ngày. Công ty có lợi thế về nguồn cung cấp nguyên liệu do nằm tại tỉnh Đồng Tháp, một tỉnh thuộc khu vực Đồng Bằng Sông Cửu Long có môi trường và điều kiện được xem là thuận lợi nhất của ngành nuôi thả cá Tra, Basa nguyên liệu với 8 vùng nuôi cá tra, tổng diện tích 136,5 ha, cung cấp 34% nhu cầu nguyên liệu. Các sản phẩm của công ty đủ điều kiện xuất khẩu rất nhiều nước trên thế giới trong đó có Mỹ và các nước thuộc EU, thị trường khó tính nhất trong ngành xuất khẩu thực phẩm từ các thị trường ngoài nước và dần trở thành thương hiệu có uy tín cả trong và ngoài nước.','https://vnr500.com.vn/Thong-tin-doanh-nghiep/CONG-TY-CP-VINH-HOAN-Chart--124-2017.html','/uploads/logo_19_1762328497282.png','02773891166','1997-12-19'),(20,'E00020','NGÂN HÀNG TMCP KIÊN LONG',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,'E00021','CÔNG TY CP CƠ ĐIỆN LẠNH','Thành phố Hồ Chí Minh','codienlanh@gmail.com','Công ty Cổ phần Dịch vụ và Kỹ thuật Cơ Điện Lạnh R.E.E (“REE M&E”) là nhà cung cấp dịch vụ kỹ thuật, cung ứng thiết bị và thầu cơ điện công trình hàng đầu Việt Nam với hơn 45 năm kinh nghiệm trong các dự án thương mại, công nghiệp và cơ sở hạ tầng.\r\nNhà cung cấp dịch vụ & Giải pháp M&E\r\nCơ Điện Lạnh\r\nLà nhà thầu cơ điện hàng đầu tại Việt Nam, REE M&E đã thực hiện hơn 1.000 dự án trong tất cả các lĩnh vực từ thương mại, dân dụng, công nghiệp đến cơ sở hạ tầng. Chúng tôi cung cấp cho khách hàng các dịch vụ về tư vấn, thiết kế, mua sắm, lắp đặt, thử nghiệm cũng như bảo trì nhằm giúp khách hàng vận hành hệ thống với chi phí thấp, tiết kiệm năng lượng và giảm thiểu các tác động đến môi trường.\r\n\r\nÁp dụng tiêu chuẩn ISO 9001:2015 và là thành viên của Hội đồng Công trình Xanh Việt Nam (VGBC), và Hội đồng Công trình Xanh Hoa Kỳ (USGBC), REE M&E đảm bảo các công trình xây dựng đáp ứng yêu cầu cao nhất về kỹ thuật đồng thời giảm thiểu các tác động tiêu cực đến môi trường. Công ty cũng áp dụng mô hình Building Information Model (BIM) và REVIT 3D để tối ưu hóa quá trình thi công xây dựng. Bên cạnh đó, REE M&E còn cung cấp dịch vụ tư vấn cho khách hàng về thiết kế, xây dựng và vận hành các tòa nhà thông minh.','https://www.reecorp.com/','/uploads/logo_21_1762327475826.png','02838100337','1993-01-01'),(22,'E00022','Stabucks','Đà Lạt','stabucksvietnam@gmail.com','Công ty\r\nNói rằng Starbucks mua và rang cà phê nguyên hạt chất lượng cao là hoàn toàn đúng. Đó là điều cốt lõi của công việc chúng tôi làm – nhưng thật khó để kể toàn bộ câu chuyện.\r\nCác quán cà phê của chúng tôi đã trở thành địa điểm dành cho những người yêu thích cà phê ở mọi nơi. Tại sao họ chỉ muốn dùng cà phê Starbucks? Vì họ biết họ có thể tin tưởng vào dịch vụ chân thật, một không gian hấp dẫn và một cốc cà phê tuyệt vời được rang một cách chuyên nghiệp và được pha đậm đặc mọi lúc.\r\n\r\nMong đợi Hơn cả Cà phê\r\nChúng tôi là những nhà cung cấp nhiệt tình về cà phê và mọi thứ khác đi kèm với trải nghiệm bổ ích tại quán cà phê. Chúng tôi cũng cung cấp cơ hội lựa chọn các loại chè Tazo® hảo hạng, bánh ngọt ngon và các món chiêu đãi thú vị khác nhằm làm hài lòng mọi vị giác. Và nhạc bạn nghe trong cửa hàng được chọn là vì nghệ thuật và sự hấp dẫn của bản nhạc.\r\n\r\nMọi người đến Starbucks để trò chuyện, họp mặt hoặc làm việc. Chúng tôi là địa điểm tụ họp cho tình hàng xóm, một phần của công việc hàng ngày – và chúng tôi không thể hạnh phúc hơn về điều này. Truy cập để tìm hiểu về chúng tôi và bạn sẽ thấy: chúng tôi thú vị hơn nhiều những gì chúng tôi pha.','stabucks.com','/uploads/logo_22_1762329089705.png','0254752555','2005-08-08'),(23,'E00023','Highlands','Đà Lạt','Highlands@gmail.com','','https://www.highlandscoffee.com.vn/vn/he-thong-cua-hang/484/highlands-coffee-go-mall-da-lat.html','/uploads/logo_23_1762329392375.png','02637302426','1994-10-01');
/*!40000 ALTER TABLE `employer` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_emp_before_insert` BEFORE INSERT ON `employer` FOR EACH ROW BEGIN
    DECLARE n INT;
  IF NEW.ID_Employer IS NULL OR NEW.ID_Employer = '' THEN

    SELECT COALESCE(MAX(CAST(ID_Employer AS UNSIGNED)), 0) + 1
      INTO n
      FROM Employer;
    SET NEW.ID_Employer = LPAD(n, 6, '0');
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `job`
--

DROP TABLE IF EXISTS `job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job` (
  `ID_Job` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ID_Employer` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Name_Job` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Job_Description` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Job_Location` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Experience` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Salary` decimal(10,0) DEFAULT '0',
  `ID_Category` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Start_Date` datetime NOT NULL,
  `End_Date` datetime NOT NULL,
  `Job_Status` enum('opened','closed') COLLATE utf8mb4_unicode_ci DEFAULT 'opened',
  PRIMARY KEY (`ID_Job`),
  KEY `ID_Employer` (`ID_Employer`),
  KEY `ID_Category` (`ID_Category`),
  CONSTRAINT `job_ibfk_1` FOREIGN KEY (`ID_Employer`) REFERENCES `employer` (`ID_Employer`),
  CONSTRAINT `job_ibfk_2` FOREIGN KEY (`ID_Category`) REFERENCES `category` (`ID_Category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job`
--

LOCK TABLES `job` WRITE;
/*!40000 ALTER TABLE `job` DISABLE KEYS */;
INSERT INTO `job` VALUES ('000001','E00002','Quản Lý','Đi làm vì đam mê nhé','Lâm Đồng','0-1 year',2000000,'000005','2025-11-10 00:00:00','2025-12-12 00:00:00','opened'),('000002','E00023','Phục vụ','','Lâm Đồng','Không cần kinh nghiệm',1500000,'000005','2025-10-10 00:00:00','2025-12-11 00:00:00','opened'),('000003','E00004','Công Nhân','','TP.HCM','3+ years',10000000,'000005','2025-09-09 00:00:00','2025-12-12 00:00:00','opened'),('000004','E00005','Thực tập sinh','','TP.Hà Nội','Intern',7000000,'000001','2025-10-09 00:00:00','2025-12-11 00:00:00','opened'),('000005','E00006','Phi Công','Cần tuyển phi công trẻ dưới 25 tuổi, dày dặn kinh nghiệm, ưa nhìn','TP.Đà Nẵng','3+ years',100000000,'000005','2025-10-10 00:00:00','2025-12-12 00:00:00','opened'),('000006','E00015','Kế toán trưởng','Chịu được áp lực công việc, không sợ đi tò','TP.Hải Phòng','3+ years',20000000,'000002','2025-10-10 00:00:00','2026-01-01 00:00:00','opened'),('000007','E00022','Content creator','','Khánh Hòa','0-1 year',11000000,'000003','2025-09-08 00:00:00','2025-12-11 00:00:00','opened'),('000008','E00003','Nhân viên bán hàng','','Bắc Ninh','Không cần kinh nghiệm',30000000,'000005','2025-09-04 00:00:00','2025-12-12 00:00:00','opened');
/*!40000 ALTER TABLE `job` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_job_before_insert` BEFORE INSERT ON `job` FOR EACH ROW BEGIN
  DECLARE n INT;
  IF NEW.ID_Job IS NULL OR NEW.ID_Job = '' THEN
    SELECT COALESCE(MAX(CAST(ID_Job AS UNSIGNED)), 0) + 1 INTO n FROM Job;
    SET NEW.ID_Job = LPAD(n, 6, '0');
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `ID_User` int NOT NULL AUTO_INCREMENT,
  `UserName` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DateCreate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `RoleName` enum('employer','candidate') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID_User`),
  UNIQUE KEY `UserName` (`UserName`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'a','$2a$10$G8THTYOXSAnabpr8ZckzF.w17SD5/Nje0zTTIuX/DYuZXCzhKzhjW','a@gmail.com','2025-11-02 13:49:53','employer'),(2,'LOTTE Mart Việt Nam','$2a$10$mKaA4AX4YMaayXyCk9L2A./UZynkX0TNahGeA.4jWdlrkxuCH6LsW','lottemart@gmail.com','2025-11-02 13:55:15','employer'),(3,'CÔNG TY CP TẬP ĐOÀN VÀNG BẠC ĐÁ QUÝ DOJI','$2a$10$nRrEHGhk/pRxHGivFByvEeptpyNhGJrnlf5siN4mDovk25J/qdRcu','doji@gmail.com','2025-11-02 14:00:41','employer'),(4,'CÔNG TY CP SỮA VIỆT NAM','$2a$10$aTy4UFrdwcK2DjlK5mGSKuv0rEImoSRbdLmKXrTITBoF5cD2RR3hS','suavienam@gmail.com','2025-11-02 14:01:44','employer'),(5,'CÔNG TY CP FPT','$2a$10$WanExKeKvwMuO4ciNmYBruM0cpm/0x6.92hoJJgogSkeRT.lFBeha','fpt@gmail.com','2025-11-02 14:03:18','employer'),(6,'CÔNG TY CP HÀNG KHÔNG VIETJET','$2a$10$JsLIswIgHdoA2xgOyQsMFuYKj/.sNw6tnpUymiK9wlAJnAKzfH5B6','hangkhongvietjet@gmail.com','2025-11-02 14:04:39','employer'),(7,'CÔNG TY CP STAVIAN HÓA CHẤT','$2a$10$CWiZVJgqCLAXDjqVR/b.Wug1SCV/lm17k6jfNiDAo33KoLOI.OIBm','stavian@gmail.com','2025-11-02 14:06:12','employer'),(8,'CÔNG TY CP TẬP ĐOÀN HOA SEN','$2a$10$fymCh6fPx8/hsKmnzTMpt..HLvcNsUVN1rdsCdKG96FH9XrcLF1JC','hoasen@gmail.com','2025-11-02 14:07:48','employer'),(9,'NGÂN HÀNG TMCP TIÊN PHONG','$2a$10$Fmg0wBKoNeAtKP/YRbGjEeSCShfH0AGFgQw7dn8hoqSbHwo9jpgK2','tienphong@gmail.com','2025-11-02 14:08:44','employer'),(10,'CÔNG TY CP THẾ GIỚI SỐ','$2a$10$nyH8gi13joyVLACc4N18bOjUftLRLMskSnWKzOI4PTVsRYfozAvOu','thegoiso@gmail.com','2025-11-02 14:09:50','employer'),(11,'CÔNG TY CP XÂY DỰNG CONTECCONS','$2a$10$e0ntDIJvRM9Q1xhfxS6U9eU3hIjxaGfzlkcdvLP8X4B7hMHSb/812','conteccons@gmail.com','2025-11-02 14:11:05','employer'),(12,'CÔNG TY CP PIV','$2a$10$31un7RXYTXE6ubzIK3NKmOTiG1uU6a6yzjpnrX1ntrxHOaTm.QOwC','baohiempiv@gmail.com','2025-11-02 14:12:52','employer'),(13,'CÔNG TY CP THÉP NAM KIM','$2a$10$kOfKy2yJLbbO/Gn8OFZ9DuH.JaSppUGHIRLcgHJbw4TxtFN7Ej2re','thepnamkim@gmail.com','2025-11-02 14:13:47','employer'),(14,'CÔNG TY CP TẬP ĐOÀN PAN','$2a$10$Z5PFK92N1CkfZPqFOj11B.d9bbBf./dsvab49h3Cqo4.x0y466.lu','nongnghieppan@gmail.com','2025-11-02 14:15:33','employer'),(15,'CÔNG TY CP TẬP ĐOÀN SAO MAI','$2a$10$z7ZLgcVLDbkVFuoUSLySzu/mvKgHQzmRgbNcpfTaI9cmyUsBrntFC','saomai@gmail.com','2025-11-02 14:16:47','employer'),(16,'CÔNG TY CP NHỰA AN PHÁT XANH','$2a$10$8qIAnC2m75g9dPlVF4TBoezayzpahEVfRGztYqaczJVaArKB7ykC2','anphatxanh@gmail.com','2025-11-02 14:17:36','employer'),(17,'CÔNG TY CP QUỐC TẾ SƠN HÀ','$2a$10$8nh7NkOpx08g..d37xZqueGzzpDfxJFn1C6342N66ZvCMMjjzKaeO','sonha@gmail.com','2025-11-02 14:20:39','employer'),(18,'CÔNG TY CP GIAO DỊCH HÀNG HÓA TÂY NGUYÊN','$2a$10$nJP2NH7JZOf0IX9WF5p8COIFPm5dizGGkqTC7mGMetikmf4UJOvSO','hanghoataynguyen@gmail.com','2025-11-02 14:22:16','employer'),(19,'CÔNG TY CP VĨNH HOÀN','$2a$10$ecB9I9AL5QL9Kx31EdSJ2.ziEcSp1LrPNzcYdlfC0IRSe3M5vfyZu','vinhhoan@gmail.com','2025-11-02 14:23:38','employer'),(20,'NGÂN HÀNG TMCP KIÊN LONG','$2a$10$SG12ESaz0tsQnBoUVqeioOKL.QIuv4zfDiwJbSDsVb6QtGZ0hS7V6','kienlong@gmail.com','2025-11-02 14:24:24','employer'),(21,'CÔNG TY CP CƠ ĐIỆN LẠNH','$2a$10$bK42ANimxoGUEptpGc/lf.JvDxU0f8Pj9K.ZflVzKFdyH4GTggKRm','codienlanh@gmail.com','2025-11-02 14:25:34','employer'),(22,'Stabucks','$2a$10$GlHxHGOxvUVGkepRFIF1GOkgAnv3Buo17n5GvRpyAQYZJjLZAIMoG','stabucksvietnam@gmail.com','2025-11-05 14:47:42','employer'),(23,'Highlands','$2a$10$aM2VSVxU.0bfCjAU17880OWfcIrT4naWLG5TYF9gj.aNWDu7MTdge','Highlands@gmail.com','2025-11-05 14:53:36','employer'),(24,'anh khoa','$2a$10$uqSvP/lPdepJM0o8/u76fOCO1XOJj/avERnYE5Cj7kWzEyPZu51zK','anhkhoa080205@gmail.com','2025-11-06 08:46:37','candidate');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'caibang'
--

--
-- Dumping routines for database 'caibang'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-06  8:54:09
create table Application
(	
	ID_Job varchar(6),
    ID_Candidate varchar(6),
    Date_Applied datetime not null,
    Application_Status enum("pending", "rejected", "hired") default "pending",
    primary key(ID_Job, ID_Candidate),
    foreign key (ID_Job) references Job(ID_Job),
    foreign key (ID_Candidate) references Candidate(ID_Candidate)
);

select * from Notification;
SELECT * FROM Notification ORDER BY Created_At DESC;

CREATE TABLE IF NOT EXISTS `notification` (
  `ID_Notification` INT NOT NULL AUTO_INCREMENT,
  `ID_User` INT NOT NULL,
  `Notification_Type` ENUM('new_job', 'new_application','job_update') NOT NULL, -- ĐÃ SỬA
  `Notification_Title` VARCHAR(255) NOT NULL,                      -- ĐÃ SỬA
  `Notification_Content` TEXT NOT NULL,                            -- ĐÃ SỬA
  `Related_ID` VARCHAR(10) DEFAULT NULL,
  `Is_Read` BOOLEAN DEFAULT FALSE,
  `Created_At` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_Notification`),
  KEY `idx_user` (`ID_User`),
  KEY `idx_read` (`Is_Read`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`ID_User`) REFERENCES `users` (`ID_User`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
