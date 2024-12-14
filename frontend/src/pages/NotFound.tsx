import { useNavigate } from "react-router";
import { Button, Group, rem, Stack, Text, Title } from "@mantine/core";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Stack h="80vh" justify="center">
      <Title order={1} fw={800} fz={rem(150)} ta="center">
        404
      </Title>
      <Text fz={rem(15)} ta="center">
        it looks like you're lost
      </Text>
      <Group mx="auto">
        <Button onClick={() => navigate("/")}>Back to homepage</Button>
      </Group>
    </Stack>
  );
};
