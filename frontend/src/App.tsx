import {
  AppShell,
  Image,
  Title,
  Container,
  Flex,
  Group,
  ActionIcon,
  Text,
  Anchor,
  Button,
  Highlight,
  Divider,
  Drawer,
  useMantineColorScheme,
  Burger,
  NavLink,
  Skeleton,
  Stack,
  Loader,
} from "@mantine/core";
import {
  IconBoxModel2,
  IconCurrencyEthereum,
  IconHome2,
  IconMoon,
  IconPencilPlus,
  IconSun,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { useContractContext } from "./context/Contract";
import { nprogress } from "@mantine/nprogress";
import { Home } from "./pages/Home";
import { Detail } from "./pages/Detail";
import { NotFound } from "./pages/NotFound";
import { useDisclosure } from "@mantine/hooks";
import { CreateProject } from "./pages/CreateProject";
import { ReactNode, useEffect } from "react";
import { JsonRpcSigner } from "ethers";
import logo from "./assets/logo.png";
import { Projects } from "./pages/Projects";

const GuardAuthentication = ({
  loading,
  account,
  children,
}: {
  loading: boolean;
  account: JsonRpcSigner | null;
  children: ReactNode;
}) => {
  return (
    <>
      {loading ? (
        <Stack h="80vh" justify="center" align="center">
          <Loader color="primary" size="xl" type="dots" />
          <Text ta="center">We're preparing your page...</Text>
        </Stack>
      ) : account?.address ? (
        <>{children}</>
      ) : (
        <Navigate to="/" replace />
      )}
    </>
  );
};

const App = () => {
  const navigate = useNavigate();

  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const { connectMetamask, account, loading, contract } = useContractContext();

  const [openedMenu, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (loading) {
      nprogress.start();
    } else {
      nprogress.complete();
    }
  }, [loading]);

  useEffect(() => {
    contract?.on("NewFunder", (args) => {
      if (args != account?.address) {
        notifications.show({
          title: "Funds status",
          position: "top-center",
          color: "rgba(255, 255, 255, 0)",
          withCloseButton: false,
          message: `${args} give some funds`,
        });
      }
      console.log("new funder", args);
    });
  }, [contract]);
  return (
    <>
      <Drawer opened={openedMenu} onClose={close} title="Navigation">
        {[
          {
            icon: IconHome2,
            label: "Homepage",
            description: "Back to main page",
            href: "/",
          },
          {
            icon: IconBoxModel2,
            label: "Projects",
            href: "/projects",
          },
          {
            icon: IconPencilPlus,
            label: "Add Project",
            href: "/projects/create",
            hidden: !account?.address,
          },
          // { icon: IconActivity, label: 'Activity' },
        ]
          .filter((item) => !item.hidden)
          .map((item) => (
            <NavLink
              key={item.label}
              label={item.label}
              description={item.description}
              leftSection={<item.icon size="1rem" stroke={1.5} />}
              onClick={() => {
                navigate(item.href);
                close();
              }}
            />
          ))}
      </Drawer>

      <AppShell
        header={{
          height: "50",
        }}
        padding="md"
      >
        <AppShell.Header>
          <Container fluid h={"100%"} size="xl">
            <Group h={"100%"} justify="space-between" align="center">
              <Anchor onClick={() => navigate("/")}>
                <Flex gap="xs" align="center">
                  <Image src={logo} h={35} fit="contain" />
                  <Title
                    // hidden={useMatches({
                    //   base: true,
                    //   lg: false,
                    // })}
                    order={4}
                    c={colorScheme == "dark" ? "white" : "black"}
                  >
                    Fundconn.
                  </Title>
                </Flex>
              </Anchor>
              <Flex gap="xs">
                <Skeleton visible={loading}>
                  <Button
                    bg={account?.address ? "red" : "primary"}
                    onClick={connectMetamask}
                    rightSection={
                      <IconCurrencyEthereum
                        style={{ width: "70%", height: "70%" }}
                      />
                    }
                  >
                    {account?.address
                      ? `${account?.address?.slice(
                          0,
                          7
                        )}..${account?.address?.slice(40)}`
                      : "Connect"}
                  </Button>
                </Skeleton>
                <ActionIcon aria-label="Toggle Theme" size="lg">
                  {colorScheme == "dark" ? (
                    <IconSun
                      onClick={() => setColorScheme("light")}
                      style={{ width: "70%", height: "70%" }}
                      stroke={1.5}
                    />
                  ) : (
                    <IconMoon
                      onClick={() => setColorScheme("dark")}
                      style={{ width: "70%", height: "70%" }}
                      stroke={1.5}
                    />
                  )}
                </ActionIcon>

                <Burger
                  opened={openedMenu}
                  onClick={open}
                  aria-label="Toggle navigation"
                  color={colorScheme == "dark" ? "white" : "black"}
                />
              </Flex>
              {/* </Group> */}
            </Group>
          </Container>
        </AppShell.Header>
        <AppShell.Main px={0} mx={0}>
          <Container fluid mih="80vh" px={0}>
            <Routes>
              <Route index path="/" element={<Home />} />
              <Route path="/projects/:id" element={<Detail />} />
              <Route path="/projects" element={<Projects />} />
              <Route
                path="/projects/create"
                element={
                  <GuardAuthentication
                    account={account ?? null}
                    loading={loading}
                  >
                    <CreateProject />
                  </GuardAuthentication>
                  // account?.address ? (
                  //   <CreateProject />
                  // ) : (
                  //   <Navigate to="/" replace />
                  // )
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
          <Divider my="lg" />
          <Container ta="center">
            <Text my="xl" span>
              Created by
              <Anchor
                href="https://id.linkedin.com/in/dinta-syaifuddin"
                target="_blank"
              >
                <Highlight
                  color="primary"
                  highlight="Mochammad Dinta Alif Syaifuddin"
                >
                  Mochammad Dinta Alif Syaifuddin
                </Highlight>
              </Anchor>
            </Text>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default App;
