import { CloseIcon } from "@chakra-ui/icons/Close"
import { HamburgerIcon } from "@chakra-ui/icons/Hamburger"
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

interface Props {
  children: React.ReactNode
}

const Links = ['Історія', 'Про проєкт']

const NavLink = (props: Props) => {
  const { children } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded="md"
      _hover={{
        cursor: "pointer",
        textDecoration: "none",
        bg: { base: "gray.200", _dark: "gray.700" },
      }}>
      {children}
    </Box>
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
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems="center">
            <NavLink key="Sign out">Вийти</NavLink>
          </Flex>
        </Flex>

        {open ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as="nav">
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}
