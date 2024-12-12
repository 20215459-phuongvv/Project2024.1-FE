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
  MdAccountCircle, // Icon for the Personal Page
  MdPersonAdd, // Icon for the Register page
} from "react-icons/md";

import MainDashboard from "views/admin/default";
import SignInCentered from "views/auth/signIn";
import SignUp from "views/auth/signUp"; // New component for Sign Up (Register)
import Book from "views/admin/books"; // New component for Books
import Author from "views/admin/authors"; // New component for Authors
import Publisher from "views/admin/publishers"; // New component for Publishers
import ReadingCard from "views/admin/readingCards"; // New component for Borrow Books
import BorrowBook from "views/admin/borrowBooks"; // New component for Borrow Card
import Profile from "views/admin/profile"; // New component for Personal Page

// Import the new component for user borrowed books management
import UserBorrowedBooks from "views/admin/userBorrowBooks"; // New component for User Borrowed Books

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
    path: "/borrow-books",
    icon: (
      <Icon as={MdLibraryBooks} width="20px" height="20px" color="inherit" />
    ),
    component: BorrowBook,
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
  // New route for Register (SignUp)
  {
    name: "Đăng ký",
    layout: "/auth",
    path: "/sign-up",
    icon: <Icon as={MdPersonAdd} width="20px" height="20px" color="inherit" />,
    component: SignUp,
  },
  // New route for personal page
  {
    name: "Trang Cá Nhân",
    layout: "/admin",
    path: "/profile",
    icon: (
      <Icon as={MdAccountCircle} width="20px" height="20px" color="inherit" />
    ),
    component: Profile,
  },
  // New route for managing borrowed books for the user
  {
    name: "Quản lý mượn sách",
    layout: "/admin", // Assuming your user-related routes are prefixed with '/user'
    path: "/user-borrowed-books",
    icon: (
      <Icon as={MdLibraryBooks} width="20px" height="20px" color="inherit" />
    ),
    component: UserBorrowedBooks, // The new component for managing borrowed books
  },
];

export default routes;
