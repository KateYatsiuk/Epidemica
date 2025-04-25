import { CloseIcon } from "@chakra-ui/icons/Close"
import { HamburgerIcon } from "@chakra-ui/icons/Hamburger"
import { Link as ChakraLink } from "@chakra-ui/react"
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Icon
} from "@chakra-ui/react"
import { LogoPurpleIcon } from "./LogoPurpleIcon"
import { useApi } from "../../api/ApiProvider"

interface NavLinkProps {
  children: React.ReactNode;
  href: string;
  onClick?: () => Promise<void>;
}

const Links = [
  { label: "Симуляція", href: "/" },
  { label: "Історія", href: "/history" },
];

const NavLink = (props: NavLinkProps) => {
  const { children, href, onClick } = props;

  return (
    <ChakraLink
      href={href}
      px={2}
      py={1}
      rounded="md"
      _hover={{
        textDecoration: "none",
        bg: { base: "gray.200", _dark: "gray.700" },
      }}
      onClick={onClick}
    >
      {children}
    </ChakraLink>
  )
}

interface NavBarProps {
  user: { email: string; } | null;
  setUser: React.Dispatch<React.SetStateAction<{ email: string } | null>>;
};

export default function NavBar({user, setUser}: NavBarProps) {
  const { api } = useApi();
  const { open, onOpen, onClose } = useDisclosure();

  const logout = async () => {
    try {
      await api.get("/auth/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
        },
      });
    } catch {
      console.log("ERROR");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <>
      <Box bgColor={{ base: "gray.100", _dark: "gray.800" }} px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={open ? onClose : onOpen}
            colorPalette="purple"
          >
            {open ? <CloseIcon /> : <HamburgerIcon />}
          </IconButton>
          <HStack alignItems="center" gap={4}>
            <Box>
              <Icon width={35} height={35}><LogoPurpleIcon /></Icon>

            </Box>
            <HStack as={"nav"} display={{ base: "none", md: "flex" }}>
              {user &&
                Links.map((link) => (
                  <NavLink key={link.label} href={link.href}>{link.label}</NavLink>
                ))}
            </HStack>
          </HStack>
          <Flex alignItems="center">
            {user ? (
              <NavLink key="Sign out" href="/login" onClick={logout}>Вийти</NavLink>
            ) : (
              <>
                <NavLink key="Sign up" href="/register">Зареєструватись</NavLink>
                <NavLink key="Sign in" href="/login">Увійти</NavLink>
              </>
            )}
          </Flex>
        </Flex>

        {open ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as="nav">
              {user &&
                Links.map((link) => (
                  <NavLink key={link.label} href={link.href}>{link.label}</NavLink>
                ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};
