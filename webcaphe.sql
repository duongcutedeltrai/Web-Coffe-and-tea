-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: coffee
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('11459cfb-69f8-4c1c-a3cd-86180f0c8def','48899d6de172d4a089e807a31add4e6293172c3384d85dc395e4a6483de4394c','2025-11-12 10:01:26.570','20251022115606_update_user',NULL,NULL,'2025-11-12 10:01:25.520',1),('186573f7-7de6-4553-929c-1658dc127bd2','d734d0789501a35f6d121ecfbf101112864751baac9cb46d296288ca2af3a2f4','2025-11-12 10:01:26.781','20251022134114_add_staff_id_default',NULL,NULL,'2025-11-12 10:01:26.684',1),('2388b27b-9dbf-4c2e-b4f5-bc7f8e0bd82f','e1f95e117813da614973f77f6fe7cc3113e5e6a85f67ea205be5dfe56f9f1366','2025-11-12 10:01:26.678','20251022125155_update_total',NULL,NULL,'2025-11-12 10:01:26.576',1),('26eb06b3-14c3-49c7-b5ff-ab84773ef28d','5e96539ef9ca953dd71b52307e57a29f087c1ba3df3fac9128117e6f75507f77','2025-11-12 10:01:23.136','20251009112456_init',NULL,NULL,'2025-11-12 10:01:23.050',1),('27b7e604-9c88-4cd5-99c8-86ea8bae92c8','19864b40d9d0f3f45db454256b75b012594bb989b3781f49f0165bd40b75c434','2025-11-12 10:01:25.423','20251016091039_update_order',NULL,NULL,'2025-11-12 10:01:24.028',1),('48d83133-674d-443b-8681-8aaa624a90ef','3bdfbd9d98c18a85f49f1bca8352a118e6c7a0fffcc5a63397f42806564ff948','2025-11-12 10:01:28.503','20251112072508_update_payment_method_enum',NULL,NULL,'2025-11-12 10:01:28.276',1),('4f15b533-999d-4583-a959-c4a8451ac8d1','6e494cf75d0fadcf9bb082035d0aa1b0c83d09696a7519ce0db9fde64cac56c1','2025-11-12 10:01:27.974','20251105155001_update_promotion',NULL,NULL,'2025-11-12 10:01:27.874',1),('515398eb-3d92-4fa3-a081-42b9149c117a','3ea95ab63e18b2cdc28b1ac8a8825ad9de98edfffe83c8e5a77e852b5424fe5a','2025-11-12 10:01:26.963','20251022151437_delete_staff_id',NULL,NULL,'2025-11-12 10:01:26.920',1),('5637e947-deb8-42d0-be7f-7f5936a28b84','e7af3f43033ce0c763d0feafedfc052270346a1dd7b1b3e7746ea9379b4dd22f','2025-11-12 10:01:22.049','20250918031056_fixcategories',NULL,NULL,'2025-11-12 10:01:21.982',1),('5f2a1c46-c488-4a08-9f05-dca122c47dd4','1d830bebcbf40d8bea90e22442beca34fb349c1910baed99a549f898c5f84722','2025-11-12 10:01:25.514','20251016161100_update_feed',NULL,NULL,'2025-11-12 10:01:25.429',1),('6074e46f-b72f-4e53-88fc-8cce10c436ec','2112118b54299d567562f3ec0982f2a41d3c96804dc6bbaa2e76d9fca1739521','2025-11-12 10:01:21.870','20250914104008_seed_data',NULL,NULL,'2025-11-12 10:01:19.659',1),('7ba72fef-32a2-4397-b966-12a1f13cba03','38c3c7ad1d0a8d6c3f1be64cd33219930d065be860b4b2eae0b0173ddb5cac4c','2025-11-12 10:01:22.846','20250918041928_fixduong',NULL,NULL,'2025-11-12 10:01:22.055',1),('7dde9e0a-a6a6-4970-b430-3a0ce8fed70c','d6bb0e538219d4d589a68461971807c73fb42f22f388ad088392295b6809bd91','2025-11-12 10:01:23.274','20251009152110_updatecart',NULL,NULL,'2025-11-12 10:01:23.184',1),('831ec381-748c-4a72-9000-d5f8e4022a40','befa1c2aad6c7be90f108b300e433d208832be461c018a34b5575bac1ec91874','2025-11-12 10:01:22.939','20250918074237_fixproduct',NULL,NULL,'2025-11-12 10:01:22.852',1),('85340a14-b88e-425e-a4bc-6b8224b6c622','c159f90f2039bb5dfba6c23bcb377e6a94cba36f934bf4500d8d3eaa2977d83d','2025-11-12 10:01:28.768','20251112095936_add_product_id_to_promotion_usage',NULL,NULL,'2025-11-12 10:01:28.509',1),('8d1d8143-0452-4671-8a0b-709aee101295','ed3a9c682f21bdf1746a285fdb72a0d0a79551af06e6b4029033f7b956b359bf','2025-11-12 10:01:23.044','20251007132338_add_reset_token',NULL,NULL,'2025-11-12 10:01:22.945',1),('9db356f7-cfa0-40e8-a6d8-48d978b252f3','f35c753a5c5ef7106fc88e17fff5df82fd4afb7af3bda37b1fdd7f95ccd4d9ab','2025-11-12 10:01:24.022','20251016071018_update_product',NULL,NULL,'2025-11-12 10:01:23.935',1),('a351cb4c-bdbf-4324-b8f2-f2eec69a2a67','5c360db64ab765ae672867ef54bd23b5dbd68c817331c640d4a395c5cd47c0d1','2025-11-12 10:01:28.271','20251111050920_init',NULL,NULL,'2025-11-12 10:01:27.980',1),('a9029802-cb56-448f-86b3-dd74d7457bdc','4de639a9e0cf1a6dea90edf0fd788868ed06ee8faf06c05f72ac236b891cf765','2025-11-12 10:01:23.929','20251015074345_update_schema',NULL,NULL,'2025-11-12 10:01:23.837',1),('b8547d55-7187-4f07-a111-ee58adf78f9e','5e9f424d2fe5d4d589b015143ee3a53c9f3a673ac26ea716f9727480e0e1f3b9','2025-11-12 10:01:21.976','20250914111034_fix',NULL,NULL,'2025-11-12 10:01:21.876',1),('b94ba6b0-027f-4c14-bf80-00a17112aabd','10be1c2657a5a97fc6ee3ff302441a4029634fa77e7997e4e66721e56d866826','2025-11-12 10:01:27.057','20251022151958_delete_staff_id_final',NULL,NULL,'2025-11-12 10:01:26.970',1),('dc5f05d5-255a-4e92-a455-c4edcf5c435f','37dd0d0450b1990c592fcf162d84f60632aedfe49923c0ed1ba4f7888e26115b','2025-11-12 10:01:26.915','20251022140717_delete_staff_id_default',NULL,NULL,'2025-11-12 10:01:26.787',1),('ddf83803-dc86-4e58-80db-b8d1e1eef30a','3723ade28595e544a97c18ed6d773e1ceafac80caaedc135d2d7dcbb47cc4e17','2025-11-12 10:01:27.868','20251104034823_add_favorite',NULL,NULL,'2025-11-12 10:01:27.063',1),('ea877a72-dea8-4b5e-ae08-cdf01f26976c','fc78045696a317ba89b3f260dbcf69f829766cb2e7c9bd58d4d8939357c517b0','2025-11-12 10:01:23.832','20251012045045_init_chat',NULL,NULL,'2025-11-12 10:01:23.280',1),('fd48f5ab-e49e-41bb-b580-944e75231a9a','dd31f2f1db5c05c4569cac20def7cf0837b4113d8116c42a34f049e216c4868a','2025-11-12 10:01:23.178','20251009142525_updatecart',NULL,NULL,'2025-11-12 10:01:23.142',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `blog_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('NEWS','PROMOTION','PRODUCT','EVENT','GUIDE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NEWS',
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `published_at` datetime(3) DEFAULT NULL,
  `author_id` int NOT NULL,
  `meta_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `view_count` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`blog_id`),
  UNIQUE KEY `blogs_slug_key` (`slug`),
  KEY `blogs_author_id_idx` (`author_id`),
  KEY `blogs_type_idx` (`type`),
  KEY `blogs_status_idx` (`status`),
  KEY `blogs_slug_idx` (`slug`),
  CONSTRAINT `blogs_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES ('5511054a-eeb6-4581-a96c-a378411f4554','Phê La Có Hỷ – Cả Làng Chill Vui','phe-la-co-hy-ca-lang-chill-vui','“Ôi, vui quá xá là vui!” ? Phê La mời cả Làng Chill đi cưới. Lấy cảm hứng từ nét đẹp cưới hỏi truyền thống, Phê La duyên dáng khoác chiếc áo đỏ son rực rỡ, rộn ràng báo tin vui: Phê La Có Hỷ.\r\nKhông chỉ ngày uyên ương sánh đôi, chữ Hỷ còn là lời chúc may mắn, niềm vui gửi đến Đồng Chill mỗi ngày.','<h3>Trân trọng kính mời toàn thể Đồng Chill 03 miền cùng nâng Cốc Phê La Có Hỷ, chúc mừng cho hạnh phúc của Tổ Trưởng và nhâm nhi các Thức Uống Đặc Sản, từ 05.10.2025 <img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tf/1/16/1f942.png\" alt=\"?\" width=\"16\" height=\"16\"></h3><p>&nbsp;</p><p><i><strong>“Ôi, vui quá xá là vui!”</strong></i> <img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"> Phê La mời cả Làng Chill đi cưới. Lấy cảm hứng từ nét đẹp cưới hỏi truyền thống, Phê La duyên dáng khoác chiếc áo đỏ son rực rỡ, rộn ràng báo tin vui: Phê La Có Hỷ.<br>Không chỉ ngày uyên ương sánh đôi, chữ Hỷ còn là lời chúc may mắn, niềm vui gửi đến Đồng Chill mỗi ngày.<br><br>Kính mời quan viên hai họ khắp chốn chill Phê La 03 miền, xúng xính áo quần, nâng ly và nhâm nhi tiệc trà thân mật cùng Tổ Trưởng từ 05.10.2025 nhé <img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"><br><br><strong>Phê La thông báo:</strong></p><p>Tin vui nối tiếp chuyện Hỷ, Tổ Trưởng mời Đồng Chill dự tiệc trà thân mật trên tất cả chốn chill Phê La. Hỷ sự chưa hết, Phê La còn tặng thêm quà - Miễn Phí Upsize từ size Phê lên size La khi mua 01 sản phẩm Trà Sữa</p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/te9/1/16/1f496.png\" alt=\"?\" width=\"16\" height=\"16\"> Sản phẩm áp dụng: Ô Long Sữa Phê La, Ô Long Nhài Sữa, Tấm, Khói B\'Lao, Phong Lan.</p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/te9/1/16/1f496.png\" alt=\"?\" width=\"16\" height=\"16\"> Chương trình áp dụng khi mua trực tiếp hoặc mang về tại cửa hàng Phê La 03 miền, từ ngày 30/10 - 31/10.</p><p>&nbsp;</p><p><i><strong>Lưu ý:</strong></i></p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"> Số lượng phần quà giới hạn, chương trình có thể kết thúc sớm hơn dự kiến.</p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"> Có áp dụng tích điểm dựa trên giá trị thanh toán hóa đơn thực tế.</p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"> Có áp dụng lũy tiến.</p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"> Không áp dụng đồng thời với các chương trình khuyến mãi khác và chương trình giảm giá hạng thành viên.</p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"> Chương trình không áp dụng trên các app giao hàng hay đặt hàng qua Fanpage Phê La, Zalo OA “Phê La Official”.</p><p>Có Hỷ khắp nơi - có La khắp chốn! Đồng Chill nhận được thiệp mời, comment xác nhận với Tổ Trưởng nha <img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"></p>','https://res.cloudinary.com/dimrl0w79/image/upload/v1762857136/uploaded_images_blog/rmcig64twxu3ifwllu39.jpg','EVENT','PUBLISHED','2025-11-15 00:15:06.812','2026-06-02 09:58:41.908',NULL,9,'Phê La Có Hỷ – Cả Làng Chill Vui','Phê La Có Hỷ – Cả Làng Chill Vui',25),('eba72316-9d5c-4e69-ba76-13d4fd125317','LY GẠO LÀNG CHILL ','ly-gao-lang-chill','Tháng 04 rộn ràng những dịp lễ đặc biệt, cũng là lúc Đồng Chill rủ hội bạn hay đồng nghiệp cùng “góp gạo\" mở tiệc lớn, cùng sẻ chia vị thanh mát, mềm mượt từ Lụa Gạo & Lụa Đào. Hân hoan niềm vui mùa vụ, Tổ Trưởng đặc biệt chill đãi khi đặt hàng qua Fanpage Phê La/ Zalo OA “Phê La Official”. Mời Đồng Chill gặt quà, lên đơn chill dịp lễ tháng 04 cùng Phê La nha ','<p><i><strong>“Từ nơi đồng xanh thơm hương lúa</strong></i></p><p><i><strong>Về nơi nhà cao xe giăng phố… “</strong></i></p><p><strong>Bắc Nam một nhà, chung 01 ký ức <img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tcf/1/16/1f1fb_1f1f3.png\" alt=\"??\" width=\"16\" height=\"16\"></strong></p><p>Góp nhặt tinh hoa đất trời, hạt gạo tuy nhỏ bé nhưng nuôi dưỡng bao thế hệ người Việt mình <img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tcf/1/16/1f1fb_1f1f3.png\" alt=\"??\" width=\"16\" height=\"16\">. Từ sự mộc mạc và thân thương ấy, Phê La họa nên Ly Gạo Làng Chill đầy chất thơ, mang theo cảm hứng từ nét vẽ tranh Đông Hồ truyền thống. Mỗi chi tiết trên ly là từng thước phim chậm rãi tua về hình ảnh Hạt Gạo Làng Chill, nơi em bé mục đồng thong dong giữa biển vàng lúa chín.</p><p><br><strong>Vui như có Sổ Gạo Phê La <img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"></strong></p><p>Mang theo ký ức một thời, “Hợp tác xã” Phê La tặng Sổ Gạo tới Đồng Chill 03 miền <img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tcf/1/16/1f1fb_1f1f3.png\" alt=\"??\" width=\"16\" height=\"16\">. Với thiết kế mộc mạc, Sổ Gạo kèm thêm 02 trang kẻ ô và đặc biệt “sít rịt” 02 trang tô màu để bạn thỏa sức sáng tạo.</p><p>Không cần tem phiếu, chỉ cần bạn ghé chill Phê La với hoá đơn từ 160K là có thể mang quà về nhà.</p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tf4/1/16/2728.png\" alt=\"✨\" width=\"16\" height=\"16\"> Áp dụng với đơn mua trực tiếp và mang về tại quầy thu ngân trên cửa hàng Phê La 03 miền, từ 14/04 - 17/04;</p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tf4/1/16/2728.png\" alt=\"✨\" width=\"16\" height=\"16\"> Áp dụng khi mua các sản phẩm: Đồ uống đóng ly, đóng lon &amp; đóng chai, Topping, Bánh ngọt và sản phẩm Merchandise;</p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tf4/1/16/2728.png\" alt=\"✨\" width=\"16\" height=\"16\"> Giá trị hoá đơn từ 160K sau khi áp dụng giảm giá hạng thành viên;</p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tf4/1/16/2728.png\" alt=\"✨\" width=\"16\" height=\"16\"> Số lượng quà tặng có hạn, chương trình có thể kết thúc sớm hơn dự kiến tùy từng cửa hàng.</p><p>&nbsp;</p><p><strong>Lưu ý:</strong></p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"?\" width=\"16\" height=\"16\"> Có áp dụng chương trình giảm giá hạng thành viên và chương trình tích điểm;</p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"?\" width=\"16\" height=\"16\"> Không áp dụng lũy tiến theo hóa đơn;</p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"?\" width=\"16\" height=\"16\"> Không áp dụng với đơn hàng trên app giao hàng;</p><p><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"?\" width=\"16\" height=\"16\"> Không áp dụng song song cùng các chương trình khuyến mãi khác.</p><p>Mời Đồng Chill 03 miền <img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tcf/1/16/1f1fb_1f1f3.png\" alt=\"??\" width=\"16\" height=\"16\"> nhanh qua Phê La nhận Sổ Gạo, lấy lương thực về nấu cơm.<br>Từ 01.04.2025, Mời Đồng Chill gặt quà, lên đơn chill dịp lễ tháng 04 cùng Phê La nha <img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t9d/1/16/1f33e.png\" alt=\"?\" width=\"16\" height=\"16\"></p>','https://res.cloudinary.com/dimrl0w79/image/upload/v1762865697/uploaded_images_blog/jnhzezswufhgymtu7vs9.jpg','EVENT','PUBLISHED','2025-11-15 00:15:06.812','2026-06-02 09:58:40.015',NULL,9,'LY GẠO LÀNG CHILL ','LY GẠO LÀNG CHILL ',27),('f5bddcc4-ebd4-4ef4-a1fb-b3cd74edb4e4','Phê La - Chuyển mùa có Len ❄️','phe-la-chuyen-mua-co-len','Nắng đã có mũ, mưa đã có ô, Chuyển mùa có Phê La Len! Hẹn Đồng Chill ngày 11.11.2025 này xúng xính trong 02 chiếc áo Phê La Len ấm áp, ghé chốn chill 03 miền nhâm nhi những Thức Uống Đặc Sản nha ?❄️','<p><a href=\"https://www.facebook.com/phelaxinchao/posts/pfbid02ZBqycZDSTCkDaTA1auDhRySz9VADF98BzkX7JSvPWZtEF4LMqew3ecS28rHadb2ul?__cft__[0]=AZUmcSipk8iewPzQ5ESXmiit-Z9Ad42RC_jmiNA7cB6bkwoQ4yhbL2OAmzxu7y8MhV6lqEWZITrDqfDEGQC7xPGzj4Ra7BmeGWC0JdYkZZP_cysqlpitw5EFDFVo44s25aOrLMkQ39AiLka3kusfgeF1Hf3UOHPZulGYcd7wacgFvxqVMqOwuy7Ic6GEeCjG93HVEtX1oQMVrCfG_vIO77UK&amp;__tn__=H-R\"><strong>Áo Len đã có, xin gió cứ về ?</strong></a>Nắng đã có mũ, mưa đã có ô, Chuyển mùa có Phê La Len! Hẹn Đồng Chill ngày 11.11.2025 này xúng xính trong 02 chiếc áo Phê La Len ấm áp, ghé chốn chill 03 miền nhâm nhi những Thức Uống Đặc Sản nha <img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t2e/1/16/2744.png\" alt=\"❄️\" width=\"16\" height=\"16\"></p><p><strong>DEN HEN LAI LEN <img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t2e/1/16/2744.png\" alt=\"❄\" width=\"16\" height=\"16\"></strong></p><p>Như lời hẹn chill mỗi khi chuyển mùa, Phê La háo hức mở tủ, mang chiếc áo len thân thuộc cùng Đồng Chill viết tiếp câu chuyện Phê La Len năm nay.</p><p>Những chiếc áo ấm với hoạ tiết vặn thừng dập nổi, nay Phê La phóng khoáng và sáng tạo hơn cùng những gam màu mới, tỉ mỉ đan nên “Phê La Len size Phê” nâu be dịu dàng, “Phê La Len size La” xanh trà Ô Long.</p><p>Chuyển mùa rồi, Đồng Chill 03 miền nhớ mặc ấm nha! Hẹn nhau 11.11.2025 này trong chiếc áo Phê La Len ấm áp, mình cùng nhâm nhi những Thức Uống Đặc Sản <img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"></p><p>&nbsp;</p><p>Hẹn Đồng Chill 11.11.2025 này trong chiếc áo Phê La Len ấm áp, mình cùng ngồi bên nhau, nhâm nhi những Thức Uống Đặc Sản nha <img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t1f/1/16/1f3b6.png\" alt=\"?\" width=\"16\" height=\"16\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t2e/1/16/2744.png\" alt=\"❄️\" width=\"16\" height=\"16\"></p>','/images/blogs/88a7664b-316f-4bed-9a83-c6683efc8006.jpg','EVENT','PUBLISHED','2025-11-15 00:15:06.812','2026-06-02 09:58:38.197',NULL,9,'','',15);
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `cart_user_id_key` (`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,11,714364,11),(2,1,514000,6);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_details`
--

DROP TABLE IF EXISTS `cart_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_details` (
  `cart_detail_id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` int NOT NULL,
  `product_size` enum('M','L','XL','DEFAULT') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`cart_detail_id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_details_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`),
  CONSTRAINT `cart_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_details`
--

LOCK TABLES `cart_details` WRITE;
/*!40000 ALTER TABLE `cart_details` DISABLE KEYS */;
INSERT INTO `cart_details` VALUES (21,1,2,2,138000,'DEFAULT'),(22,1,3,2,98182,'DEFAULT'),(23,1,65,1,40000,'M'),(24,1,63,1,42000,'M'),(25,1,64,5,32000,'M'),(26,2,48,2,65000,'L'),(27,2,47,1,69000,'L'),(28,2,49,1,69000,'XL'),(30,2,7,1,108000,'DEFAULT'),(31,2,2,1,138000,'DEFAULT');
/*!40000 ALTER TABLE `cart_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime(3) DEFAULT NULL,
  `images` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Cà Phê','Gồm cà phê đen, nâu, bạc xỉu, espresso, cappuccino, latte và các món pha máy phổ biến.','2025-11-12 10:01:50',NULL,'Cà phê.jpg'),(2,'Syphon','Cà phê pha thủ công bằng dụng cụ Syphon — hương vị trong trẻo, phù hợp người thích trải nghiệm pha tay.','2025-11-12 10:01:50',NULL,'Syphon.jpg'),(3,'French Press','Cà phê pha bằng bình ép kiểu Pháp — đậm đà, giữ trọn hương vị nguyên chất.','2025-11-12 10:01:50',NULL,'French Press.jpg'),(4,'Moka Pot','Cà phê pha bằng bình Moka Pot phong cách Ý — vị mạnh, đầy đặn.','2025-11-12 10:01:50',NULL,'Moka Pot.jpg'),(5,'Cold Brew','Cà phê ủ lạnh nhiều giờ — vị dịu nhẹ, ít đắng, tươi mát, phù hợp đồ uống mùa hè.','2025-11-12 10:01:50',NULL,'Cold Brew.jpg'),(6,'Ô Long & Matcha','Các loại trà ô long, trà nhài, matcha latte và biến tấu trà sữa thanh mát.','2025-11-12 10:01:50',NULL,'Ô Long & Matcha.jpg'),(7,'Topping','Lựa chọn thêm: trân châu, thạch, kem tươi, whipping cream, hạt trang trí.','2025-11-12 10:01:50',NULL,'Topping.jpg'),(8,'Plus - Lon/Chai tiện lợi','Đồ uống đóng sẵn trong lon/chai: cold brew, trà trái cây, nước giải khát tiện mang theo.','2025-11-12 10:01:50',NULL,'Plus - Lon Chai tiện lợi.jpg'),(9,'Cà phê hạt rang xay (Gói mang về)','Các loại cà phê hạt rang từ Ethiopia, Kenya, Colombia… đóng gói 150g–250g, phù hợp pha phin, máy hoặc pha tay tại nhà.','2025-11-12 10:01:50',NULL,'Cà phê hạt rang xay (Gói mang về).jpg'),(10,'Combo','Set combo nhiều ly cà phê/trà, phù hợp cho nhóm, họp mặt hoặc gia đình với giá ưu đãi hơn.','2025-11-12 10:01:50',NULL,'Combo.jpg'),(11,'Bánh ngọt','Bánh tươi phục vụ tại quán: cheesecake, tiramisu, cookie, brownie và các loại pastry.','2025-11-12 10:01:50',NULL,'Bánh ngọt.jpg'),(12,'Phụ kiện','Các sản phẩm mang thương hiệu, tiện dụng và thời trang: túi tote, ly giữ nhiệt, bình nước… giúp khách hàng đồng hành cùng thương hiệu mọi lúc','2025-11-12 10:01:50',NULL,'Phụ kiện.jpg');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite` (
  `favorite_id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`favorite_id`),
  UNIQUE KEY `favorite_userId_productId_key` (`userId`,`productId`),
  KEY `favorite_productId_fkey` (`productId`),
  CONSTRAINT `favorite_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite`
--

LOCK TABLES `favorite` WRITE;
/*!40000 ALTER TABLE `favorite` DISABLE KEYS */;
INSERT INTO `favorite` VALUES (1,11,63,'2025-11-14 23:55:20.832'),(2,1,65,'2026-06-02 09:51:08.382'),(3,1,64,'2026-06-02 09:51:09.420');
/*!40000 ALTER TABLE `favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rating` int NOT NULL,
  `comment` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,11,64,'2025-12-19 03:10:27',4,'Đồ uống ngon nhưng khá ít','\"[\\\"https://res.cloudinary.com/dimrl0w79/image/upload/v1766113824/feedbacks/pszwcvucwxaz1eudk1gs.jpg\\\",\\\"https://res.cloudinary.com/dimrl0w79/image/upload/v1766113825/feedbacks/hgw2qjfx2m7c1x1rtwhv.jpg\\\",\\\"https://res.cloudinary.com/dimrl0w79/image/upload/v1766113826/feedbacks/kieip3ouuhsj9bef6mc2.jpg\\\"]\"');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `inventory_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `change_type` enum('import','export','adjustment') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`inventory_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roomId` int NOT NULL,
  `senderId` int NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` json DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Message_roomId_fkey` (`roomId`),
  KEY `Message_senderId_fkey` (`senderId`),
  CONSTRAINT `Message_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `order_detail_id` int NOT NULL AUTO_INCREMENT,
  `order_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `size` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`order_detail_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (25,'DL_211059',63,2,42000.00,'M'),(26,'DL_211059',64,4,32000.00,'M'),(27,'DL_211059',65,1,67000.00,'XL'),(28,'DL_211059',60,1,55000.00,'M'),(29,'DL_221728',63,1,42000.00,'M'),(30,'DL_221728',62,1,35000.00,'M');
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status_history` (
  `order_status_history_id` int NOT NULL AUTO_INCREMENT,
  `order_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','ready','shipped','completed','canceled') COLLATE utf8mb4_unicode_ci NOT NULL,
  `changed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_status_history_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_history`
--

LOCK TABLES `order_status_history` WRITE;
/*!40000 ALTER TABLE `order_status_history` DISABLE KEYS */;
INSERT INTO `order_status_history` VALUES (7,'DL_211059','ready','2025-11-21 14:12:00'),(8,'DL_221728','ready','2025-11-21 15:17:55');
/*!40000 ALTER TABLE `order_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int DEFAULT NULL,
  `orderDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','ready','shipped','completed','canceled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `delivery_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_source` enum('STAFF','CUSTOMER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'STAFF',
  `order_type` enum('DINE_IN','TAKE_AWAY','DELIVERY') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DINE_IN',
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `final_amount` decimal(10,2) NOT NULL,
  `original_amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('DL_211059',11,'2025-11-21 14:12:00','completed','Đối diện 161 Núi Thành (Đối diện Trường THCS Tây Sơn), Đường Núi Thành, Hòa Cường, Đà Nẵng','thuan','0974518649','CUSTOMER','DELIVERY',87400.00,246600.00,334000.00),('DL_221728',11,'2025-11-21 15:17:55','completed','Đối diện 161 Núi Thành (Đối diện Trường THCS Tây Sơn), Đường Núi Thành, Hòa Cường, Đà Nẵng','thuan','0974518649','CUSTOMER','DELIVERY',10000.00,67000.00,77000.00);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `method` enum('cod','vnpay','momo','paypal') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','success','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `total_amount` int NOT NULL,
  `transaction_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (9,'DL_211059','vnpay','success',246600,'2025-11-21 14:12:00'),(10,'DL_221728','vnpay','success',67000,'2025-11-21 15:17:55');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `point_history`
--

DROP TABLE IF EXISTS `point_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `point_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `change` int NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `point_history_user_id_idx` (`user_id`),
  CONSTRAINT `point_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `point_history`
--

LOCK TABLES `point_history` WRITE;
/*!40000 ALTER TABLE `point_history` DISABLE KEYS */;
INSERT INTO `point_history` VALUES (1,1,20,NULL,'2025-11-12 10:01:50.229'),(2,11,339,'Tích điểm đơn hàng DL_173120','2025-11-12 10:31:58.725'),(3,11,114,'Tích điểm đơn hàng DL_175525','2025-11-12 10:55:59.756'),(4,11,182,'Tích điểm đơn hàng DL_232709','2025-11-14 16:28:52.422'),(5,11,108,'Tích điểm đơn hàng DL_233602','2025-11-14 16:36:51.305'),(6,11,246,'Tích điểm đơn hàng DL_211059','2025-11-21 14:12:00.220'),(7,11,77,'Tích điểm đơn hàng DL_221728','2025-11-21 15:17:54.722');
/*!40000 ALTER TABLE `point_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `price_product`
--

DROP TABLE IF EXISTS `price_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `price_product` (
  `price_product_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `size` enum('M','L','XL','DEFAULT') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`price_product_id`),
  UNIQUE KEY `product_size_unique` (`product_id`,`size`),
  KEY `product_id_idx` (`product_id`),
  CONSTRAINT `price_product_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `price_product`
--

LOCK TABLES `price_product` WRITE;
/*!40000 ALTER TABLE `price_product` DISABLE KEYS */;
INSERT INTO `price_product` VALUES (1,1,'DEFAULT',108000),(2,2,'DEFAULT',138000),(3,3,'DEFAULT',98182),(4,4,'DEFAULT',108000),(5,5,'DEFAULT',108000),(6,6,'DEFAULT',108000),(7,7,'DEFAULT',108000),(8,8,'DEFAULT',137000),(9,9,'DEFAULT',108000),(10,10,'DEFAULT',108000),(11,11,'DEFAULT',25000),(12,12,'DEFAULT',25000),(13,13,'DEFAULT',25000),(14,14,'DEFAULT',25000),(15,15,'DEFAULT',25000),(16,16,'DEFAULT',442000),(17,17,'DEFAULT',442000),(18,18,'DEFAULT',442000),(19,19,'DEFAULT',480000),(20,20,'DEFAULT',418000),(21,21,'DEFAULT',346000),(22,22,'DEFAULT',370000),(23,23,'DEFAULT',395000),(24,24,'DEFAULT',344000),(25,25,'DEFAULT',130000),(26,26,'DEFAULT',107000),(27,27,'DEFAULT',107000),(28,28,'DEFAULT',737000),(29,29,'DEFAULT',590000),(30,30,'DEFAULT',577000),(31,31,'DEFAULT',387000),(32,32,'M',40000),(33,32,'L',53000),(34,32,'XL',67000),(35,33,'M',45000),(36,33,'L',58000),(37,33,'XL',69000),(38,34,'M',53000),(39,34,'L',66000),(40,34,'XL',79000),(41,35,'M',56000),(42,35,'L',69000),(43,35,'XL',83000),(44,36,'M',53000),(45,36,'L',66000),(46,36,'XL',80000),(47,37,'M',56000),(48,37,'L',69000),(49,37,'XL',83000),(50,38,'M',43000),(51,38,'L',55000),(52,38,'XL',67000),(53,39,'M',48000),(54,39,'L',60000),(55,39,'XL',72000),(56,40,'DEFAULT',10000),(57,41,'DEFAULT',10000),(58,42,'DEFAULT',12000),(59,43,'DEFAULT',12000),(60,44,'DEFAULT',12000),(61,45,'DEFAULT',12000),(62,46,'DEFAULT',14000),(63,47,'M',57000),(64,47,'L',69000),(65,47,'XL',80000),(66,48,'M',53000),(67,48,'L',65000),(68,48,'XL',73000),(69,49,'M',50000),(70,49,'L',59000),(71,49,'XL',69000),(72,50,'M',45000),(73,50,'L',53000),(74,50,'XL',65000),(75,51,'M',45000),(76,51,'L',53000),(77,51,'XL',65000),(78,52,'M',53000),(79,52,'L',63000),(80,52,'XL',72000),(81,53,'M',53000),(82,53,'L',63000),(83,53,'XL',72000),(84,54,'M',50000),(85,54,'L',60000),(86,54,'XL',69000),(87,55,'M',60000),(88,55,'L',72000),(89,55,'XL',80000),(90,56,'M',60000),(91,56,'L',72000),(92,56,'XL',80000),(93,57,'M',60000),(94,57,'L',72000),(95,57,'XL',80000),(96,58,'M',57000),(97,58,'L',69000),(98,58,'XL',80000),(99,59,'M',47000),(100,59,'L',55000),(101,59,'XL',65000),(102,60,'M',55000),(103,60,'L',63000),(104,60,'XL',70000),(105,61,'M',52000),(106,61,'L',60000),(107,61,'XL',70000),(108,62,'M',35000),(109,62,'L',48000),(110,62,'XL',59000),(111,63,'M',42000),(112,63,'L',58000),(113,63,'XL',70000),(114,64,'M',32000),(115,64,'L',45000),(116,64,'XL',56000),(117,65,'M',40000),(118,65,'L',53000),(119,65,'XL',67000);
/*!40000 ALTER TABLE `price_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sold` int NOT NULL DEFAULT '0',
  `category_id` int DEFAULT NULL,
  `images` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '-1',
  `status` enum('DANG_BAN','HET','TAM_AN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DANG_BAN',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `average_rating` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`product_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'PLUS - KHÓI B’LAO','Hương vị cà phê đậm đà được cô đọng trong chai tiện lợi, mang theo dư vị khói đặc trưng của cao nguyên. Một lựa chọn hoàn hảo cho những ai bận rộn nhưng vẫn muốn tận hưởng hương vị cà phê trọn vẹn.',0,8,'PLUS - KHÓI B_LAO.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.266',0),(2,'PLUS - ĐỈNH PHÙ VÂN','(100% đường) Chai 250ml. Đỉnh Phù Vân là sự kết hợp tinh tế giữa Trà Ô Long Đỏ đậm đà và kem whipping nhẹ nhàng, tạo nên lớp sánh ngậy',1,8,'PLUS - ĐỈNH PHÙ VÂN.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.282',0),(3,'PLUS - COLD BREW ','Cà phê được ủ lạnh nhiều giờ để chiết xuất vị ngọt dịu và giảm bớt độ đắng gắt. Kết quả là một thức uống tươi mát, nhẹ nhàng nhưng vẫn giữ được chiều sâu hương vị.',1,8,'PLUS - COLD BREW.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.295',0),(4,'PLUS - Ô LONG SỮA PHÊ LA','Trà Ô Long đậm đà hòa quyện cùng vị sữa thơm ngậy, mang đến trải nghiệm uống mượt mà và tinh tế.',0,8,'PLUS - Ô LONG SỮA PHÊ LA.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.307',0),(5,'PLUS - Ô LONG NHÀI SỮA','Trà Ô Long đậm đà hòa quyện cùng vị sữa thơm ngậy, mang đến trải nghiệm uống mượt mà và tinh tế.',0,8,'PLUS - Ô LONG NHÀI SỮA.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.320',0),(6,'PLUS - TẤM','Trà Ô Long kết hợp hài hòa với gạo rang thơm bùi, mang đến dư vị ngọt nhẹ và thanh mát.',2,8,'PLUS - TẤM.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.334',0),(7,'PLUS - PHONG LAN','Trà Ô Long hòa quyện cùng vani tự nhiên, vị nhẹ nhàng, tinh tế và để lại dư vị lâu dài.',1,8,'PLUS - PHONG LAN.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.346',0),(8,'PLUS - ĐÀ LẠT ','Lấy cảm hứng từ khí hậu se lạnh, trong lành của Đà Lạt, loại cà phê đóng chai này mang lại cảm giác tươi mới, cân bằng và đầy lãng mạn.',0,8,'PLUS - ĐÀ LẠT.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.359',0),(9,'PLUS - LỤA ĐÀO','Trà Ô Long kết hợp cùng hương đào ngọt ngào, mang đến trải nghiệm mới lạ và tươi mát.',0,8,'PLUS - LỤA ĐÀO.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.373',0),(10,'PLUS - MATCHA COCO LATTE','Sự kết hợp hoàn hảo giữa matcha và nước cốt dừa, tạo nên hương vị đặc biệt và thơm ngon.',0,8,'PLUS - MATCHA COCO LATTE.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.386',0),(11,'BỌT BIỂN PHÊ LA – Ô LONG SỮA PHÊ LA','Một phiên bản tiện lợi của Ô Long Sữa Phê La, giúp bạn thưởng thức hương vị đặc trưng ngay tại nhà.',0,12,'BỌT BIỂN PHÊ LA – Ô LONG SỮA PHÊ LA.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.399',0),(12,'BỌT BIỂN PHÊ LA – PHÊ LATTE','Mang đến hương vị Phê Latte đặc trưng trong một phiên bản tiện lợi.',0,12,'BỌT BIỂN PHÊ LA – PHÊ LATTE.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.413',0),(13,'BỌT BIỂN PHÊ LA – PHÊ NÂU','Trải nghiệm hương vị Phê Nâu ngay tại nhà với sản phẩm tiện lợi này.',0,12,'BỌT BIỂN PHÊ LA – PHÊ NÂU.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.425',0),(14,'BỌT BIỂN PHÊ LA – TRÂN CHÂU GẠO RANG','Kết hợp hương vị đặc trưng của trân châu gạo rang trong một phiên bản tiện lợi.',0,12,'BỌT BIỂN PHÊ LA – TRÂN CHÂU GẠO RANG.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.437',0),(15,'BỌT BIỂN PHÊ LA – XE VAN','Mang đến hương vị đặc trưng của Phê La trong một phiên bản tiện lợi.',0,12,'BỌT BIỂN PHÊ LA – XE VAN.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.449',0),(16,'CÀ PHÊ PHIN GIẤY – PHÊ ĐẶC SẢN','Trải nghiệm hương vị cà phê đặc sản qua phương pháp phin giấy tiện lợi.',0,10,'CÀ PHÊ PHIN GIẤY – PHÊ ĐẶC SẢN.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.463',0),(17,'CÀ PHÊ PHIN GIẤY – PHÊ NGUYÊN BẢN','Trải nghiệm hương vị cà phê đặc sản qua phương pháp phin giấy tiện lợi.',0,10,'CÀ PHÊ PHIN GIẤY – PHÊ NGUYÊN BẢN.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.476',0),(18,'CÀ PHÊ PHIN GIẤY –  PHÊ TRUFFLE','Hương vị cà phê nguyên bản qua phương pháp phin giấy.',0,10,'CÀ PHÊ PHIN GIẤY –  PHÊ TRUFFLE.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.495',0),(19,'PHÊ PHIN NGUYÊN BẢN - TÚI 200GR','Một trong những dòng cà phê danh giá nhất thế giới, nổi bật với hương hoa nhài và trái cây nhiệt đới. Từng ngụm cà phê Geisha là một trải nghiệm tinh tế, khó tìm thấy ở nơi khác.',0,9,'PHÊ PHIN NGUYÊN BẢN - TÚI 200GR.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.516',0),(20,'PHÊ GEISHA - TÚI 150GR','Một trong những dòng cà phê danh giá nhất thế giới, nổi bật với hương hoa nhài và trái cây nhiệt đới. Từng ngụm cà phê Geisha là một trải nghiệm tinh tế, khó tìm thấy ở nơi khác.',0,9,'PHÊ GEISHA - TÚI 150GR.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.540',0),(21,'PHÊ ETHIOPIA - TÚI 150GR','Hạt cà phê từ vùng đất Ethiopia mang đặc trưng vị trái cây nhiệt đới, hậu vị ngọt tự nhiên và hương hoa thoang thoảng. Đây là lựa chọn lý tưởng cho những ai yêu thích pour-over.',0,9,'PHÊ ETHIOPIA - TÚI 150GR.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.565',0),(22,'Phê Kenya - Túi 150gr','Nổi bật với vị chua sáng, hương cam chanh và dâu tây rõ rệt, cà phê Kenya đem lại sự bùng nổ hương vị. Một lựa chọn táo bạo dành cho tín đồ cà phê cá tính.',0,9,'Phê Kenya - Túi 150gr.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.589',0),(23,'Phê Colombia - Túi 150gr','Hương vị cân bằng tuyệt vời, vừa có chút đắng vừa phảng phất vị ngọt caramel và chocolate. Đây là dòng cà phê thân thiện, dễ uống, phù hợp cho mọi đối tượng.',0,9,'Phê Colombia - Túi 150gr.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.614',0),(24,'Ô LONG MÙA XUÂN ĐẶC SẢN - TÚI 150GR','Được hái từ những đồi trà xanh mướt vào mùa xuân, loại trà này có vị thanh ngọt và hậu vị hoa cỏ quyến rũ. Thích hợp để nhâm nhi vào những buổi sáng nhẹ nhàng.',0,9,'Ô LONG MÙA XUÂN ĐẶC SẢN - TÚI 150GR.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.638',0),(25,'COMBO XÚNG XÍNH LỤA ĐÀO','Combo gồm các loại trà sữa tiện lợi, phù hợp cho những buổi chill tại nhà.',0,10,'COMBO XÚNG XÍNH LỤA ĐÀO.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.662',0),(26,'TÚI TOTE HAPPY CHILL DAY - ĐAI TRƠN','Gói gọn cả thế giới chỉ trong một “nốt nhạc”, Túi Tote Happy Chill Day Phiên bản đai trơn với chất liệu canvas dày dặn, kích thước 39x32x9cm, thiết kế ngăn trong tiện lợi, sẵn sàng đồng hành cùng bạn ở bất cứ nơi đâu.',0,12,'TÚI TOTE HAPPY CHILL DAY - ĐAI TRƠN.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.677',0),(27,'Túi Tote Happy Chill Day - Đai Khuông Nhạc','Gói gọn cả thế giới chỉ trong một “nốt nhạc”, Túi Tote Happy Chill Day Phiên bản đai trơn với chất liệu canvas dày dặn, kích thước 39x32x9cm, thiết kế ngăn trong tiện lợi, sẵn sàng đồng hành cùng bạn ở bất cứ nơi đâu.',0,12,'Túi Tote Happy Chill Day - Đai Khuông Nhạc.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.690',0),(28,'HỘP QUÀ ĐĨA NHẠC – HỘP 04 LOẠI (03 TRÀ HẠT, 01 CÀ PHÊ PHIN)','Hộp quà gồm 4 loại đồ uống đặc trưng, phù hợp làm quà tặng hoặc thưởng thức tại nhà.',0,10,'HỘP QUÀ ĐĨA NHẠC.jpg ',-1,'DANG_BAN','2025-11-12 10:01:50.703',0),(29,'HỘP QUÀ PHIN GIẤY – HỘP 02 LOẠI Ô LONG SỮA/ Ô LONG NHÀI','Gồm 2 loại phin giấy Ô Long Sữa và Ô Long Nhài, mang đến trải nghiệm pha chế thủ công tại nhà.',0,10,'HỘP QUÀ PHIN GIẤY – HỘP 02 LOẠI Ô LONG SỮA.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.716',0),(30,'HỘP QUÀ TRÀ SỮA TIỆN LỢI – HỘP 06 LY, 04 LOẠI','Gồm 6 ly trà sữa tiện lợi với 4 hương vị khác nhau, phù hợp cho những buổi tụ tập tại nhà.Hộp 06 ly, 04 loại:Ô Long Sữa Phê La x2, Ô Long Nhài Sữa x2,Ô Long Đào Sữa x1,Tấm x1.',0,10,'HỘP QUÀ TRÀ SỮA TIỆN LỢI.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.729',0),(31,'Ô LONG NHÀI SỮA PHIN GIẤY PHÊ LA','Trà Ô Long Nhài Sữa được đóng gói dạng phin giấy tiện lợi, mang đến trải nghiệm thưởng thức trà tại nhà một cách dễ dàng và nhanh chóng.',0,10,'Ô LONG NHÀI SỮA PHIN GIẤY PHÊ LA.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.742',0),(32,'PHÊ ESPRESSO (Hạt Colom, Ethi)','Tinh hoa của hạt Arabica từ những vùng trồng danh tiếng, mang đến một “shot” đậm đặc, vị chua thanh thoát hòa quyện cùng hậu vị ngọt tự nhiên. Đây là lựa chọn hoàn hảo cho những ai muốn thưởng thức sức mạnh nguyên bản của cà phê.',0,1,'Phê espresso(hạt colom, ethi).jpg',-1,'DANG_BAN','2025-11-12 10:01:50.754',0),(33,'PHÊ ESPRESSO (Hạt Ro, Ara)','Một ly espresso mạnh mẽ từ sự kết hợp của Robusta và Arabica, mang vị đắng rõ rệt và hương thơm sâu. Dành cho người yêu sự tỉnh táo và quyết đoán.',0,1,'phê espresso(hạt ro, ara).jpg',-1,'DANG_BAN','2025-11-12 10:01:50.767',0),(34,'PHÊ LATTE (Hạt Colom, Ethi)','Lớp espresso đậm đà được làm dịu bởi vị ngọt béo của sữa tươi, tạo nên một tổng thể cân bằng, mượt mà và dễ uống. Tách latte là sự lựa chọn lý tưởng cho những ai mới bắt đầu bước vào thế giới cà phê.',0,1,'Phê latte(hạt colom, ethi).jpg',-1,'DANG_BAN','2025-11-12 10:01:50.782',0),(35,'PHÊ LATTE (Hạt Ro, Ara)','Espresso từ Robusta và Arabica kết hợp cùng sữa tươi béo mịn, tạo nên hương vị cân bằng. Một lựa chọn thân thiện và dễ thưởng thức mỗi ngày.',0,1,'Phê latte(hạt ro, ara).jpg',-1,'DANG_BAN','2025-11-12 10:01:50.799',0),(36,'PHÊ CAPPU (Hạt Ro, Ara)','Lớp bọt sữa dày, mềm mịn ôm trọn hương espresso mạnh mẽ, tạo nên sự đối lập hoàn hảo giữa đắng và béo. Một chút cacao rắc trên bề mặt càng làm hương vị thêm hấp dẫn và đầy quyến rũ.',0,1,'Phe cappu.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.812',0),(37,'PHÊ CAPPU (Hạt Colom, Ethi)','Sự kết hợp giữa espresso Colombia/Ethiopia và lớp bọt sữa mịn. Hậu vị đắng ngọt cân bằng, thích hợp cho buổi sáng năng động.',0,1,'Phe cappu.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.825',0),(38,'PHÊ AME (Hạt Ro, Ara)','Sự kết hợp của espresso Robusta và Arabica pha loãng bằng nước nóng, mang lại một tách cà phê thanh thoát, dễ uống nhưng vẫn mạnh mẽ.',0,1,'phê ame(hạt colom, ethi).jpg',-1,'DANG_BAN','2025-11-12 10:01:50.838',0),(39,'PHÊ AME (Hạt Colom, Ethi)','Americano từ hạt Arabica Ethiopia và Colombia, giữ trọn sự tinh tế nhưng nhẹ nhàng hơn espresso. Lựa chọn hoàn hảo để nhâm nhi lâu.',0,1,'phê ame(hạt colom, ethi).jpg',-1,'DANG_BAN','2025-11-12 10:01:50.851',0),(40,'THẠCH TRÀ CHANH VÀNG','Miếng thạch dẻo mát, kết hợp cùng hương chanh vàng tươi sáng, mang lại cảm giác sảng khoái khi thêm vào ly trà. Sự kết hợp này làm thức uống trở nên hấp dẫn và lôi cuốn hơn.',0,7,'thach tra chanh vang.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.864',0),(41,'THẠCH XỈU VANI','Thạch mềm mịn với hương vani ngọt ngào, béo ngậy. Khi hòa cùng cà phê hoặc trà sữa, topping này tạo nên sự thú vị và phong phú trong từng ngụm.',0,7,'THẠCH XỈU VANI.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.877',0),(42,'THẠCH TRÀ ĐÀO HỒNG','Thạch Ô Long Đào Hồng mềm dai - không chất bảo quản - thủ công sáng tạo từ Trà Ô Long Đặc Sản & Đào Hồng Dầm. Phù hợp với tất cả sản phẩm Trà Trái Cây tại Phê La',0,7,'THẠCH TRÀ ĐÀO HỒNG.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.890',0),(43,'THẠCH Ô LONG MATCHA','Thạch Ô Long Matcha mềm mượt - không chất bảo quản - thủ công sáng tạo từ Trà Ô Long Matcha & Sữa Dừa Bến Tre. Phù hợp với mọi sản phẩm trà sữa và Ô Long Matcha tại Phê La.',0,7,'THẠCH Ô LONG MATCHA.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.903',0),(44,'THẠCH TRÀ VỎ','Thạch Trà Vỏ mềm dai - không chất bảo quản - thủ công sáng tạo từ Trà Vỏ Cà Phê & Ô Mai Dây gia truyền (Xí Muội). Phù hợp với mọi trà trái cây tại Phê La.',0,7,'THẠCH TRÀ VỎ.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.915',0),(45,'TRÂN CHÂU PHONG LAN','Trân Châu Phong Lan giòn dai - không chất bảo quản, xen lẫn hạt Vani đen tự nhiên & hương vị nhẹ nhàng. Phù hợp với mọi đồ uống tại Phê La.',0,7,'TRÂN CHÂU PHONG LAN.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.927',0),(46,'TRÂN CHÂU GẠO RANG','Trân châu mềm dẻo - vị trà Ô Long hoà quyện cùng gạo rang thơm bùi nhẹ nhàng. Phù hợp thưởng thức cùng trà sữa. Không chất bảo quản. Nguyên bản - thủ công.',0,7,'TRÂN CHÂU GẠO RANG.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.939',0),(47,'Ô LONG NHÀI SỮA','Vị trà Ô Long đặc sản kết hợp cùng hương nhài thanh tao, nhẹ nhàng lan tỏa. Lớp sữa béo ngậy mang đến trải nghiệm hài hòa, vừa tươi mát vừa êm dịu.',0,2,'Ô long nhài sữa size m.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.952',0),(48,'Ô LONG SỮA PHÊ LA','Vị trà đậm chất cao nguyên, kết hợp với sữa béo ngậy tạo thành một tổng thể hài hòa. Dù uống nóng hay lạnh, bạn đều cảm nhận rõ sự êm dịu lan tỏa.',0,2,'Ô long sữa.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.964',0),(49,'PHONG LAN (Ô LONG VANI SỮA)','Vị trà đậm chất cao nguyên, kết hợp với sữa béo ngậy tạo thành một tổng thể hài hòa. Dù uống nóng hay lạnh, bạn đều cảm nhận rõ sự êm dịu lan tỏa.',0,2,'Phong lan.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.977',0),(50,'TẤM','Trà Ô Long đậm đà kết hợp hài hoà với gạo rang thơm bùi.',0,4,'Tấm.jpg',-1,'DANG_BAN','2025-11-12 10:01:50.989',0),(51,'KHÓI B\'LAO','Sự hoà quyện của các tầng hương: Nốt hương đầu là khói đậm, hương giữa là khói nhẹ & đọng lại ở hậu vị là hương hoa ngọc lan.',0,4,'KHÓI B_LAO.jpg',-1,'DANG_BAN','2025-11-12 10:01:51.002',0),(52,'SỮA CHUA BÒNG BƯỞI','Vị chua dịu của sữa chua được cân bằng bởi topping bưởi giòn ngọt. Đây là sự kết hợp vừa thanh mát vừa bổ dưỡng, đem lại trải nghiệm mới lạ.',0,5,'sua chua bong buoi.jpg',-1,'DANG_BAN','2025-11-12 10:01:51.014',0),(53,'BÒNG BƯỞI - Ô LONG BƯỞI NHA ĐAM','Sự kết hợp độc đáo giữa vị bưởi tươi mát, nha đam giòn ngọt và trà Ô Long thanh khiết. Đây là thức uống cân bằng hoàn hảo giữa vị chua thanh và ngọt dịu, để lại ấn tượng khó quên.',0,5,'BÒNG BƯỞI - Ô LONG BƯỞI NHA ĐAM.jpg',-1,'DANG_BAN','2025-11-12 10:01:51.026',0),(54,'LANG BIANG','Lang Biang hương vị thuần khiết của trà Ô Long Đặc Sản cùng mứt hoa nhài thơm nhẹ.',0,5,'LANG BIANG.jpg',-1,'DANG_BAN','2025-11-12 10:01:51.041',0),(55,'SI MƠ - COLD BREW Ô LONG MƠ ĐÀO','Trà Ô Long Đặc Sản ủ lạnh, kết hợp cùng Mơ Má Đào và Đào Hồng dầm, thêm Thạch Trà Vỏ mềm dai mang đến hương vị thanh mát & nhẹ nhàng',0,5,'SI MƠ - COLD BREW Ô LONG MƠ ĐÀO (size La).jpg',-1,'DANG_BAN','2025-11-12 10:01:51.053',0),(56,'MATCHA PHAN XI PĂNG','Vị matcha đậm chất núi rừng, chát nhẹ nhưng thanh thoát, kết hợp cùng sữa béo mượt mà. Thức uống mang đến cảm giác vừa mạnh mẽ vừa dịu êm, như một chuyến phiêu lưu đầy năng lượng.',0,6,'MATCHA PHAN XI PĂNG.jpg',-1,'DANG_BAN','2025-11-12 10:01:51.065',0),(57,'MATCHA COCO LATTE','Hương matcha xanh mát kết hợp với sự ngọt ngào của sữa dừa, tạo nên thức uống lạ miệng nhưng vô cùng dễ nghiện. Sự hòa quyện độc đáo này vừa béo ngậy vừa thanh mát, thích hợp cho cả ngày dài.',0,6,'MATCHA COCO LATTE.jpg',-1,'DANG_BAN','2025-11-12 10:01:51.077',0),(58,'LỤA ĐÀO - Phiên bản Đồng Chill yêu thích','Hương trà Ô Long dịu nhẹ hòa quyện cùng vị đào ngọt ngào, mang lại cảm giác tươi trẻ, tràn đầy sức sống. Mỗi ngụm như một làn gió mát mùa hè, khiến bạn muốn thưởng thức mãi không dừng.',0,3,'LỤA ĐÀO - Phiên bản Đồng Chill yêu thích (size La).jpg',-1,'DANG_BAN','2025-11-12 10:01:51.089',0),(59,'Trà Vỏ Cà Phê','Trà Vỏ Cà Phê - thức uống độc đáo được làm từ vỏ quả cà phê, hương trà thơm nhẹ hòa quyện cùng vị chua dịu của chanh vàng.',0,3,'TRÀ VỎ CÀ PHÊ.jpg',-1,'DANG_BAN','2025-11-12 10:01:51.101',0),(60,'Ô LONG ĐÀO HỒNG','Hương trà Ô Long dịu nhẹ hòa quyện cùng vị đào ngọt ngào, mang lại cảm giác tươi trẻ, tràn đầy sức sống. Mỗi ngụm như một làn gió mát mùa hè, khiến bạn muốn thưởng thức mãi không dừng.',1,3,'Ô LONG ĐÀO HỒNG (Size La).jpg',-1,'DANG_BAN','2025-11-12 10:01:51.114',0),(61,'GẤM','Gấm - Vị trà Ô Long hòa quyện cùng trái vải căng mọng, mang đến dư vị ngọt mát và thanh khiết giải nhiệt tuyệt vời cho ngày hè.',0,3,'GẤM.jpg',-1,'DANG_BAN','2025-11-12 10:01:51.127',0),(62,'PHÊ NÂU','Ly cà phê sữa quen thuộc, hòa quyện vị đắng đậm đà cùng độ béo ngọt vừa phải. Đây là hương vị “quốc dân”, gần gũi và luôn mang lại cảm giác thân thuộc.',1,1,'Phê nâu.jpg',-1,'DANG_BAN','2025-11-12 10:01:51.139',0),(63,'ĐÀ LẠT','Cà phê Arabica Đà Lạt đậm đà hoà quyện cùng kem whipping thơm ngậy.',7,1,'Đà lạt.jpg',-1,'DANG_BAN','2025-11-12 10:01:51.151',0),(64,'PHÊ ĐEN','Vị đắng nguyên bản, nồng nàn nhưng không gắt, với hậu vị chua thanh và hương thơm tự nhiên từ hạt Arabica Lạc Dương và Robusta Lâm Hà. Thức uống dành cho những ai yêu sự mạnh mẽ và tinh khiết.',9,1,'Phê đen.jpg',-1,'DANG_BAN','2025-11-12 10:01:51.164',4),(65,'PHÊ XỈU VANI','Một biến tấu tinh tế của cà phê phin truyền thống, hòa quyện vị đắng nhẹ của hạt cà phê cùng vị béo ngậy của sữa đặc. Điểm nhấn vani thanh thoát giúp hương vị trở nên quyến rũ và dễ uống, để lại dư vị ngọt ngào khó quên.',5,1,'Phê xỉu vani.jpg',-1,'DANG_BAN','2025-11-12 10:01:51.177',0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion_products`
--

DROP TABLE IF EXISTS `promotion_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_products` (
  `promotion_product_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `promotion_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` int NOT NULL,
  `size` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`promotion_product_id`),
  KEY `product_id` (`product_id`),
  KEY `promotion_id` (`promotion_id`),
  CONSTRAINT `promotion_products_ibfk_1` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`promotion_id`),
  CONSTRAINT `promotion_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_products`
--

LOCK TABLES `promotion_products` WRITE;
/*!40000 ALTER TABLE `promotion_products` DISABLE KEYS */;
INSERT INTO `promotion_products` VALUES ('1a5004dd-6a3f-49e4-889a-522ab7039019','025d13a9-0c63-4708-8890-1f0472fb4363',14,'DEFAULT'),('333b343d-0114-4dc3-9634-b85c15e1c5bd','a654aa9e-804d-4159-8c4b-20d47d54606a',63,'all'),('5ed19795-878b-499a-9b9f-c3deeb5aa785','a654aa9e-804d-4159-8c4b-20d47d54606a',62,'M'),('637acb18-6896-4e3a-a749-282c3f531614','025d13a9-0c63-4708-8890-1f0472fb4363',8,'DEFAULT'),('69217ccd-017c-49e6-8804-cefd59ec44c3','025d13a9-0c63-4708-8890-1f0472fb4363',1,'DEFAULT'),('6d8c2bc5-79c4-4163-b4be-fef2ae5446e2','27abddfa-1863-46b3-9adf-3ed5c702978a',63,'all'),('6da93654-4542-42a8-93d8-e3504ddd9380','27abddfa-1863-46b3-9adf-3ed5c702978a',35,'M'),('716b9bfc-33d6-4093-84c8-556055194516','025d13a9-0c63-4708-8890-1f0472fb4363',3,'DEFAULT'),('83af9314-6fc9-4dae-b876-3e3c5b6dfcb3','27abddfa-1863-46b3-9adf-3ed5c702978a',64,'M'),('890853be-c898-4d3f-a432-8e0251cca90d','27abddfa-1863-46b3-9adf-3ed5c702978a',62,'all'),('966762ae-9961-4b23-bafe-2b278d546528','025d13a9-0c63-4708-8890-1f0472fb4363',11,'DEFAULT'),('9e09e187-ec7a-48cd-b22d-083045a0c2d2','025d13a9-0c63-4708-8890-1f0472fb4363',10,'DEFAULT'),('ab2533a1-1173-40fc-9d59-d9062e57c7c3','025d13a9-0c63-4708-8890-1f0472fb4363',4,'DEFAULT'),('b088ce54-60d7-4492-b7a1-89435b5bc2c1','025d13a9-0c63-4708-8890-1f0472fb4363',2,'DEFAULT'),('d7649212-2507-4abb-a326-296d0718fa1a','025d13a9-0c63-4708-8890-1f0472fb4363',12,'DEFAULT'),('daeabdc8-24fa-45f3-9b1b-8fd5f64b9f3f','a654aa9e-804d-4159-8c4b-20d47d54606a',33,'XL'),('edfddbc6-eb2a-4bb9-a7a3-4c5e9fd56737','025d13a9-0c63-4708-8890-1f0472fb4363',7,'DEFAULT'),('f40daaa5-0b3a-43a4-a848-352b539d0cb9','27abddfa-1863-46b3-9adf-3ed5c702978a',65,'M'),('fa408067-c067-4600-bc0a-4894e2800ba8','a654aa9e-804d-4159-8c4b-20d47d54606a',38,'all'),('fbc4c520-f143-4f9e-be41-80cde4e7be39','a654aa9e-804d-4159-8c4b-20d47d54606a',64,'M');
/*!40000 ALTER TABLE `promotion_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion_usage`
--

DROP TABLE IF EXISTS `promotion_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_usage` (
  `usage_id` int NOT NULL AUTO_INCREMENT,
  `promotion_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int DEFAULT NULL,
  `user_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `used_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `product_id` int DEFAULT NULL,
  PRIMARY KEY (`usage_id`),
  UNIQUE KEY `promotion_usage_promotion_id_user_id_product_id_key` (`promotion_id`,`user_id`,`product_id`),
  KEY `promotion_usage_promotion_id_idx` (`promotion_id`),
  KEY `promotion_usage_order_id_idx` (`order_id`),
  KEY `promotion_usage_user_id_idx` (`user_id`),
  KEY `promotion_usage_product_id_fkey` (`product_id`),
  CONSTRAINT `promotion_usage_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON UPDATE CASCADE,
  CONSTRAINT `promotion_usage_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `promotion_usage_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_usage`
--

LOCK TABLES `promotion_usage` WRITE;
/*!40000 ALTER TABLE `promotion_usage` DISABLE KEYS */;
INSERT INTO `promotion_usage` VALUES (7,'a654aa9e-804d-4159-8c4b-20d47d54606a','DL_211059',11,'0974518649','2025-11-21 14:12:00',63),(8,'a654aa9e-804d-4159-8c4b-20d47d54606a','DL_211059',11,'0974518649','2025-11-21 14:12:00',64),(9,'7bb25f31-817d-4a87-b677-5254141c089f','DL_211059',11,'0974518649','2025-11-21 14:12:00',NULL),(10,'a654aa9e-804d-4159-8c4b-20d47d54606a','DL_221728',11,'0974518649','2025-11-21 15:17:55',62);
/*!40000 ALTER TABLE `promotion_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `promotion_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_percent` decimal(5,2) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `applicable_membership` json DEFAULT NULL,
  `current_usage` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_for_new_user` tinyint(1) NOT NULL DEFAULT '0',
  `max_usage_count` int DEFAULT NULL,
  `min_order_amount` decimal(10,2) DEFAULT NULL,
  `discount_price` int DEFAULT '0',
  `type` enum('voucher','flashsale') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'voucher',
  PRIMARY KEY (`promotion_id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES ('025d13a9-0c63-4708-8890-1f0472fb4363','FLASH_1780394101424','Flash Sale - Giảm giá sốc trong thời gian ngắn!',NULL,'2026-06-02 08:55:00','2026-06-03 12:55:00','[\"bronze\", \"silver\", \"gold\", \"platinum\"]',0,1,0,100,NULL,10000,'flashsale'),('27abddfa-1863-46b3-9adf-3ed5c702978a',NULL,'Flash Sale - Giảm giá sốc trong thời gian ngắn!',NULL,'2025-11-17 10:15:00','2025-11-19 10:15:00','[\"bronze\", \"silver\", \"gold\", \"platinum\"]',0,1,0,100,NULL,15000,'flashsale'),('352dc3e7-1235-44d2-9b8d-1ad8421e06b8','WELOVEVDH','Flash Sale - Giảm giá sốc trong thời gian ngắn!',12.00,'2025-11-12 10:16:00','2025-11-19 10:16:00','[\"bronze\", \"silver\", \"gold\", \"platinum\"]',0,1,0,NULL,NULL,NULL,'voucher'),('7bb25f31-817d-4a87-b677-5254141c089f','THUANDEPTRAI','giam 10%',10.00,'2025-11-21 14:08:00','2025-11-23 14:08:00','[\"bronze\", \"silver\", \"gold\", \"platinum\"]',0,1,0,123,NULL,NULL,'voucher'),('a654aa9e-804d-4159-8c4b-20d47d54606a','FLASH_1763733816759','Flash Sale - Giảm giá sốc trong thời gian ngắn!',NULL,'2025-11-21 14:04:00','2025-11-22 14:03:00','[\"bronze\", \"silver\", \"gold\", \"platinum\"]',0,1,0,120,NULL,10000,'flashsale');
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN','ADMIN full quyen'),(2,'STAFF','Staff Dat mon'),(3,'CUSTOMER','Customer thong thuong');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isPrivate` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_detail`
--

DROP TABLE IF EXISTS `staff_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_detail` (
  `staff_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `position` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hire_date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `salary` int DEFAULT NULL,
  PRIMARY KEY (`staff_id`),
  UNIQUE KEY `staff_detail_user_id_key` (`user_id`),
  KEY `staff_detail_user_id_idx` (`user_id`),
  CONSTRAINT `staff_detail_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_detail`
--

LOCK TABLES `staff_detail` WRITE;
/*!40000 ALTER TABLE `staff_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_schedules`
--

DROP TABLE IF EXISTS `staff_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_schedules` (
  `staff_schedule_id` int NOT NULL AUTO_INCREMENT,
  `staff_id` int NOT NULL,
  `day_of_week` int NOT NULL,
  `shift_id` int DEFAULT NULL,
  `status` enum('WORK','OFF') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WORK',
  PRIMARY KEY (`staff_schedule_id`),
  UNIQUE KEY `staff_schedules_staff_id_day_of_week_key` (`staff_id`,`day_of_week`),
  KEY `staff_schedules_staff_id_idx` (`staff_id`),
  KEY `staff_schedules_shift_id_idx` (`shift_id`),
  CONSTRAINT `staff_schedules_shift_id_fkey` FOREIGN KEY (`shift_id`) REFERENCES `work_shifts` (`shift_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `staff_schedules_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `staff_detail` (`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_schedules`
--

LOCK TABLES `staff_schedules` WRITE;
/*!40000 ALTER TABLE `staff_schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userroom`
--

DROP TABLE IF EXISTS `userroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userroom` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `roomId` int NOT NULL,
  `joinedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserRoom_userId_roomId_key` (`userId`,`roomId`),
  KEY `UserRoom_roomId_fkey` (`roomId`),
  CONSTRAINT `UserRoom_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `UserRoom_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userroom`
--

LOCK TABLES `userroom` WRITE;
/*!40000 ALTER TABLE `userroom` DISABLE KEYS */;
/*!40000 ALTER TABLE `userroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `point` int DEFAULT '0',
  `role_id` int NOT NULL,
  `auth_provider` enum('system','google','facebook','apple') COLLATE utf8mb4_unicode_ci DEFAULT 'system',
  `birthday` datetime(3) DEFAULT NULL,
  `discount_rate` int DEFAULT '0',
  `gender` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `membership` enum('BRONZE','SILVER','GOLD','DIAMOND') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ACTIVE','LOCKED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `reset_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_token_expire` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  KEY `role_id` (`role_id`),
  FULLTEXT KEY `users_username_email_idx` (`username`,`email`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'duonghaitt311@gmail.com','phamanhduong','$2b$10$EVwGlQFJPpMJ8ArxsTC/gO5/r9aXaLW.ZRtveUFIvSFlXuJkzrlBy','111111',NULL,NULL,40,3,'system',NULL,0,'nam',NULL,'ACTIVE',NULL,NULL),(2,'staff1@gmail.com','duong','$2b$10$KwdiIV6KhOHQXAbg7.P6WOpyeuwBad.ho9bMANoUkcrA2bthBJO7G','111112',NULL,NULL,0,2,'system',NULL,0,'nam',NULL,'ACTIVE',NULL,NULL),(3,'staf2f@gmail.com','duong','$2b$10$wKIeC1NTF0WAoh.Ozy0rDeMKreZk5iuzEym4H4z1vmExO.oBEvfFG','111113',NULL,NULL,0,2,'system',NULL,0,'nam',NULL,'ACTIVE',NULL,NULL),(4,'staf24f@gmail.com','duong','$2b$10$kLbGTVBthRD8WZsasZK6SO0//WUge9bttVy/VmSazXU5A0HoXpTt2','111114',NULL,NULL,0,2,'system',NULL,0,'nam',NULL,'ACTIVE',NULL,NULL),(5,'staf32f@gmail.com','duong','$2b$10$R6V4eT/U0wUbuw2xUIsgsuHSpvc9xcK8eYIO.O5x829Ea2Ls4Atti','111115',NULL,NULL,0,2,'system',NULL,0,'nam',NULL,'ACTIVE',NULL,NULL),(6,'staf2323f@gmail.com','duong','$2b$10$H74tehRGOXBzpPLkWYrrp.2khOf0in9Srf8BAgvZ71EsAMclItMs6','111116',NULL,NULL,0,2,'system',NULL,0,'nam',NULL,'ACTIVE',NULL,NULL),(7,'sta2323ff@gmail.com','duong','$2b$10$ZgaTYU0eTYEuDSWjs4KAx.0d1IjQvYqCYXrYSXLVq5DQFt4cBw2jK','11117',NULL,NULL,0,2,'system',NULL,0,'nam',NULL,'ACTIVE',NULL,NULL),(8,'sta23232ff@gmail.com','duong','$2b$10$4qu.bM69365lKHNdu6fNaO8Dbg0KkpPnEd4fCO/qtDh.oeeOW6OSS','111118',NULL,NULL,0,2,'system',NULL,0,'nam',NULL,'ACTIVE',NULL,NULL),(9,'staf23232f@gmail.com','duong','$2b$10$c7fj7UWG74BiDKzfswiYCuMP45QxwYU2f1LeBI0Y/6QIfLXpiAp9K','111119',NULL,NULL,0,1,'system',NULL,0,'nam',NULL,'ACTIVE',NULL,NULL),(10,'staf32323232f@gmail.com','duong','$2b$10$DGvJK0Yob1aS/5GUZZX9Du3T2/UYTMZ8fnx1k.oYhRAH2HeIq70PK','111122',NULL,NULL,0,2,'system',NULL,0,'nam',NULL,'ACTIVE',NULL,NULL),(11,'thuanbuivan2004@gmail.com','thuan','$2b$10$Iz9lm8Nz771fhr.HyPyzGOjsgvLTjQ15fgFmPHw2SgfLTgRgLGHkS','0974518649','Đối diện 161 Núi Thành (Đối diện Trường THCS Tây Sơn), Đường Núi Thành, Hòa Cường, Đà Nẵng',NULL,1071,3,'system',NULL,0,NULL,NULL,'ACTIVE',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work_shifts`
--

DROP TABLE IF EXISTS `work_shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_shifts` (
  `shift_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`shift_id`),
  UNIQUE KEY `work_shifts_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work_shifts`
--

LOCK TABLES `work_shifts` WRITE;
/*!40000 ALTER TABLE `work_shifts` DISABLE KEYS */;
INSERT INTO `work_shifts` VALUES (2,'Chiều (14h-22h)'),(1,'Sáng (07h-15h)'),(3,'Tối (22h-06h)');
/*!40000 ALTER TABLE `work_shifts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-16 17:27:51
