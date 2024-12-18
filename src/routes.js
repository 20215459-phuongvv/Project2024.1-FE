import React from "react";
import { Icon } from "@chakra-ui/react";
import {
  MdHome,
  MdBook,
  MdPerson,
  MdBusiness,
  MdLibraryBooks,
  MdCardMembership,
  MdLock,
  MdAccountCircle,
  MdPersonAdd,
  MdSettings, // Icon for the Settings tab
} from "react-icons/md";

import MainDashboard from "views/admin/default";
import SignInCentered from "views/auth/signIn";
import SignUp from "views/auth/signUp";
import Book from "views/admin/books";
import Author from "views/admin/authors";
import Publisher from "views/admin/publishers";
import ReadingCard from "views/admin/readingCards";
import BorrowBook from "views/admin/borrowBooks";
import BorrowBookAuth from "views/auth/userBorrowBooks";
import Profile from "views/admin/profile";
import UserBorrowedBooks from "views/admin/userBorrowBooks";
import Settings from "views/admin/setting"; // New component for Settings

const routes = [
  {
    name: "Trang chủ",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    name: "Sách",
    layout: "/admin",
    path: "/books",
    icon: <Icon as={MdBook} width="20px" height="20px" color="inherit" />,
    component: Book,
  },
  {
    name: "Tác giả",
    layout: "/admin",
    path: "/authors",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: Author,
  },
  {
    name: "Nhà xuất bản",
    layout: "/admin",
    path: "/publishers",
    icon: <Icon as={MdBusiness} width="20px" height="20px" color="inherit" />,
    component: Publisher,
  },
  {
    name: "Mượn sách",
    layout: "/admin",
    path: "/borrow-books-admin",
    icon: (
      <Icon as={MdLibraryBooks} width="20px" height="20px" color="inherit" />
    ),
    component: BorrowBook,
  },
  {
    name: "Mượn sách",
    layout: "/auth",
    path: "/borrow-books",
    icon: (
      <Icon as={MdLibraryBooks} width="20px" height="20px" color="inherit" />
    ),
    component: BorrowBookAuth,
  },
  {
    name: "Thẻ mượn sách",
    layout: "/admin",
    path: "/reading-cards",
    icon: (
      <Icon as={MdCardMembership} width="20px" height="20px" color="inherit" />
    ),
    component: ReadingCard,
  },
  {
    name: "Đăng nhập",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  },
  {
    name: "Đăng ký",
    layout: "/auth",
    path: "/sign-up",
    icon: <Icon as={MdPersonAdd} width="20px" height="20px" color="inherit" />,
    component: SignUp,
  },
  {
    name: "Trang Cá Nhân",
    layout: "/admin",
    path: "/profile",
    icon: (
      <Icon as={MdAccountCircle} width="20px" height="20px" color="inherit" />
    ),
    component: Profile,
  },
  {
    name: "Quản lý mượn sách",
    layout: "/admin",
    path: "/user-borrowed-books",
    icon: (
      <Icon as={MdLibraryBooks} width="20px" height="20px" color="inherit" />
    ),
    component: UserBorrowedBooks,
  },
  // New route for Settings
  {
    name: "Cài đặt",
    layout: "/admin",
    path: "/settings",
    icon: <Icon as={MdSettings} width="20px" height="20px" color="inherit" />,
    component: Settings, // The new component for settings
  },
];

export default routes;
