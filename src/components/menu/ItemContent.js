import { Icon, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { MdCheckCircle, MdNotificationsActive } from "react-icons/md";
import React from "react";

export function ItemContent(props) {
  const { info, isRead, createdAt } = props;
  const textColor = useColorModeValue("navy.700", "white");
  const bgGradient = isRead
    ? "linear-gradient(135deg, #C4C4C4 0%, #A9A9A9 100%)" // Gray gradient for read notifications
    : "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"; // Blue gradient for unread notifications

  // Format the createdAt timestamp
  const formattedDate = new Date(createdAt).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Flex flexDirection="row" alignItems="center">
      <Flex
        justify="center"
        align="center"
        borderRadius="16px"
        minH={{ base: "60px", md: "70px" }}
        h={{ base: "60px", md: "70px" }}
        minW={{ base: "60px", md: "70px" }}
        w={{ base: "60px", md: "70px" }}
        me="14px"
        bg={bgGradient}
      >
        <Icon
          as={isRead ? MdCheckCircle : MdNotificationsActive} // Updated icons
          color="white"
          w={8}
          h={8}
        />
      </Flex>
      <Flex flexDirection="column">
        <Text
          mb="5px"
          fontWeight="bold"
          color={textColor}
          fontSize={{ base: "md", md: "md" }}
        >
          {info}
        </Text>
        <Flex alignItems="center">
          <Text
            fontSize={{ base: "sm", md: "sm" }}
            lineHeight="100%"
            color={textColor}
          >
            {formattedDate}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
