import {
  Avatar,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { MdNotificationsNone } from "react-icons/md";
import { useHistory } from "react-router-dom";
import { message } from "antd";
import {
  getNotifications,
  markNotificationsAsRead,
} from "services/notificationService";
import { ThemeEditor } from "./ThemeEditor";
import { ItemContent } from "components/menu/ItemContent";

export default function HeaderLinks(props) {
  const { secondary } = props;

  // Chakra Color Mode
  const navbarIcon = useColorModeValue("gray.400", "white");
  const menuBg = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.700", "brand.400");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const user = JSON.parse(localStorage.getItem("user"));
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Không thể tải thông báo");
    }
    setLoading(false);
  };
  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    history.push("/auth/sign-in");
    message.success("Đăng xuất thành công");
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationsAsRead(notificationId);
      fetchNotifications();
      message.success("Đã đánh dấu là đã đọc");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      message.error("Không thể đánh dấu là đã đọc");
    }
  };

  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <Menu>
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdNotificationsNone}
            color={navbarIcon}
            w="18px"
            h="18px"
            me="10px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="20px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          minW={{ base: "unset", md: "400px", xl: "450px" }}
          maxW={{ base: "360px", md: "unset" }}
        >
          <Flex justify="space-between" w="100%" mb="20px">
            <Text fontSize="md" fontWeight="600" color={textColor}>
              Thông báo
            </Text>
            <Text
              fontSize="sm"
              fontWeight="500"
              color={textColorBrand}
              ms="auto"
              cursor="pointer"
            >
              Đánh dấu tất cả đã đọc
            </Text>
          </Flex>
          {loading ? (
            <Text color={textColor}>Đang tải...</Text>
          ) : (
            <Flex flexDirection="column">
              {notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  _hover={{ bg: "none" }}
                  _focus={{ bg: "none" }}
                  px="0"
                  borderRadius="8px"
                  mb="10px"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <ItemContent
                    info={notification.message}
                    isRead={notification.isRead}
                    createdAt={notification.createdAt}
                  />
                </MenuItem>
              ))}
            </Flex>
          )}
        </MenuList>
      </Menu>
      <ThemeEditor navbarIcon={navbarIcon} />
      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: "pointer" }}
            color="white"
            name={user?.username}
            src={user?.avatar}
            bg="#11047A"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px" flexDirection="column">
            <Text
              ps="20px"
              pt="16px"
              pb="2px"
              w="100%"
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Xin chào, {user?.username}
            </Text>
            <Text
              ps="20px"
              pb="10px"
              w="100%"
              fontSize="sm"
              fontWeight="500"
              borderBottom="1px solid"
              color={textColor}
            >
              👷&nbsp; Vai trò: {user?.role || "Không xác định"}
            </Text>
          </Flex>

          <Flex flexDirection="column" p="10px">
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              color="red.400"
              borderRadius="8px"
              px="14px"
              onClick={handleLogout}
            >
              <Text fontSize="sm">Đăng xuất</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}
