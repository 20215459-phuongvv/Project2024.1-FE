import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Flex,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import DefaultAuth from "layouts/auth/Default";
import { signUp } from "services/authService";
import { message } from "antd";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

function SignUp() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const illustration =
    "https://i.pinimg.com/736x/d7/8c/24/d78c2428a2a720127cc3f63996a86597.jpg";

  const handleClick = () => setShowPassword(!showPassword);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !address || !phone) {
      message.warning("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const userData = { email, password, name, address, phone };

    try {
      setLoading(true); // Start loading

      const response = await signUp(userData);

      if (response) {
        message.success("Đăng ký thành công. Vui lòng xác thực tài khoản qua email!");
        history.push("/auth/sign-in"); // Redirect to SignIn page after successful registration
      } else {
        message.error(
          response.message || "Đăng ký thất bại. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");

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
        mt={{ base: "20px", md: "7vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Đăng Ký
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Nhập thông tin để tạo tài khoản!
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
          <form onSubmit={handleSignUp}>
            <FormControl>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Họ Tên<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                placeholder="Nguyễn Văn A"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

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
                placeholder="mail@domain.com"
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
                  type={showPassword ? "text" : "password"}
                  variant="auth"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={showPassword ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>

              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Địa chỉ<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                placeholder="Địa chỉ của bạn"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Số điện thoại<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                placeholder="Số điện thoại của bạn"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <Button
                type="submit"
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                isLoading={loading} // Show loading spinner
                loadingText="Đang đăng ký..." // Text displayed during loading
              >
                Đăng Ký
              </Button>
            </FormControl>
          </form>

          <Text
            fontSize="sm"
            color={textColorSecondary}
            textAlign="center"
            mt="12px"
          >
            Bạn đã có tài khoản?{" "}
            <Button
              variant="link"
              color={brandStars}
              onClick={() => history.push("/auth/sign-in")}
              p={0}
            >
              Đăng nhập
            </Button>
          </Text>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUp;
