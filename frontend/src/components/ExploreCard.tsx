import { Image, Flex, Group, Text, Button, Card, Stack } from "@mantine/core";
import { IconArrowRight, IconTargetArrow } from "@tabler/icons-react";
import { projectType } from "../context/Contract";
import { useHover } from "@mantine/hooks";
import { getProjectSlug } from "../utils/converter";

export const ExploreCard = ({
  project,
  width,
}: {
  project: projectType;
  width?: string;
}) => {
  const { hovered, ref }: { ref: any; hovered: boolean } = useHover();
  return (
    <Card
      ref={ref}
      w={width ? width : "100%"}
      h="625px"
      shadow="sm"
      padding="xl"
      component="a"
      href={`projects/${getProjectSlug(project)}`}
      target="_blank"
      styles={{
        root: {
          boxShadow: hovered ? "6px 6px 2px 1px black" : "none",
          transition: "all 500ms ease-out",
        },
      }}
    >
      <Card.Section>
        <Image
          src={project?.image}
          h={350}
          alt={project?.title}
          fallbackSrc="https://placehold.co/600x400?text=..."
        />
      </Card.Section>

      {/* <Flex direction="column" justify="space-between"> */}
      <Stack justify="space-between" h="100%">
        <Flex direction="column" mt="md">
          <Text size="sm">
            {new Intl.DateTimeFormat("en-EN", {
              dateStyle: "medium",
            }).format(project.deadline)}
          </Text>
          <Text fw={500} size="lg">
            {project?.title}
          </Text>
        </Flex>

        <Stack justify="space-between" h="100%" style={{ marginTop: "auto" }}>
          <Group gap="sm">
            <IconTargetArrow />

            <Text size="sm">
              {project?.amount}/{project?.goals} ETH
            </Text>
          </Group>

          <Text c="dimmed" size="sm">
            {project?.description?.slice(0, 100)}
            {project?.description?.length > 100 && "..."}
          </Text>

          <Group>
            <Button rightSection={<IconArrowRight />}>Detail</Button>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
};
