import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import DefaultAuth from "layouts/auth/Default";
import { jwtDecode } from "jwt-decode"; // Sửa lỗi nhập sai jwtDecode
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { signIn } from "services/authService";
import { message } from "antd";

function SignIn() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const illustration =
    "https://i.pinimg.com/736x/99/0f/fe/990ffe4676a8ce133e12e112d707af5e.jpg";

  const handleClick = () => setShow(!show);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email) {
      message.warning("Vui lòng nhập email của bạn");
      return;
    }
    if (!password) {
      message.warning("Vui lòng nhập mật khẩu của bạn");
      return;
    }

    try {
      const response = await signIn(email, password);
      console.log(response);

      if (response.status) {
        const token = response.jwt; // Token JWT trả về
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          message.error("Token đã hết hạn. Vui lòng đăng nhập lại.");
          return;
        }

        localStorage.setItem("user", JSON.stringify(response));
        localStorage.setItem("tokenExpiry", decodedToken.exp);

        if (decodedToken.role.includes("customer")) {
          message.warning("Bạn không có quyền truy cập");
          return;
        }

        if (decodedToken.role.includes("staff")) {
          history.push(`/admin/personal-revenue`);
        } else {
          history.push(`/`);
        }

        message.success("Đăng nhập thành công!");
        setEmail("");
        setPassword("");
      } else {
        message.error(
          response.message || "Đăng nhập thất bại! Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");

  // Redirect to Sign Up page
  const handleRedirectToSignUp = () => {
    history.push("/auth/sign-up");
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Đăng Nhập
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Nhập email và mật khẩu của bạn để đăng nhập!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
        >
          <form onSubmit={handleSignIn}>
            <FormControl>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                type="email"
                placeholder="mail@simmmple.com"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Mật Khẩu<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder="Tối thiểu 8 ký tự"
                  mb="24px"
                  size="lg"
                  type={show ? "text" : "password"}
                  variant="auth"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              <Button
                type="submit"
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
              >
                Đăng Nhập
              </Button>
            </FormControl>
          </form>

          {/* Add Sign Up link below the login button */}
          <Text
            fontSize="sm"
            color={textColorSecondary}
            textAlign="center"
            mt="12px"
          >
            Bạn chưa có tài khoản?{" "}
            <Button
              variant="link"
              color={brandStars}
              onClick={handleRedirectToSignUp}
              p={0}
            >
              Đăng ký ngay
            </Button>
          </Text>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;