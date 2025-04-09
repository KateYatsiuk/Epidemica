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

interface NavLinkProps {
  children: React.ReactNode;
  href: string;
}

const Links = [
  { label: "Симуляція", href: "/" },
  { label: "Історія", href: "/history" },
  { label: "Про проєкт", href: "/about" },
];

const NavLink = (props: NavLinkProps) => {
  const { children, href } = props;

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
    >
      {children}
    </ChakraLink>
  )
}

export default function NavBar() {
  const { open, onOpen, onClose } = useDisclosure()

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
              {Links.map((link) => (
                <NavLink key={link.label} href={link.href}>{link.label}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems="center">
            <NavLink key="Sign out" href="/login">Вийти</NavLink>
          </Flex>
        </Flex>

        {open ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as="nav">
              {Links.map((link) => (
                <NavLink key={link.label} href={link.href}>{link.label}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};