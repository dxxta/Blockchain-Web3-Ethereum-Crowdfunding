import {
  Button,
  Grid,
  useMatches,
  CloseButton,
  Stack,
  Flex,
  AppShell,
  FileButton,
  BackgroundImage,
  Center,
  Text,
  rgba,
  Checkbox,
  Group,
  Box,
  NumberInput,
  TextInput,
  Input,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, isNotEmpty } from "@mantine/form";
import { useContractContext } from "../context/Contract";
import { useEffect, useState } from "react";
import { textEditorImageProps, TextEditor } from "../components/TextEditor";
import { blobToDataUrl } from "../utils/converter";
import { useImageViewerContext } from "../context/ImageViewer";
import { notifications } from "@mantine/notifications";
import { useStorageContext } from "../context/Storage";
import { useDocumentTitle } from "@mantine/hooks";
import dayjs from "dayjs";

interface FormValues {
  title: string | null;
  description: string | null;
  content: string | null;
  goals: number | string | null;
  date: number | null;
  deadline: number | null;
  image: File | null;
}

export const CreateProject = () => {
  const { account, createProject } = useContractContext();
  const { setFile } = useStorageContext();
  const { openImage } = useImageViewerContext();

  const [textEditorImages, setTextEditorImages] = useState<
    textEditorImageProps[]
  >([]);
  const [isOverGoals, setIsOverGoals] = useState<boolean>(false);
  const [isZeroAllowed, setIsZeroAllowed] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageField, setImageField] = useState<string | null>(null);
  const [contentField, setContentField] = useState<string>(
    "<p>Start typings here...</p><ul><li><p>Describe your project in detail... Why is it important? Who will benefit from it?</p></li><li><p>Share your story and explain how the funds will be used to bring your vision to life.</p></li><li><p>Write a compelling description that inspires others to support your campaign.</p></li><li><p>Highlight the key features of your event/project and what makes it unique.</p></li><li><p>Tell your audience why this project matters and how they can make an impact</p></li></ul>"
  );

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      title: null,
      description: null,
      goals: null,
      content: null,
      date: null,
      deadline: null,
      image: null,
    },
    validate: {
      title: isNotEmpty("title is required"),
      description: isNotEmpty("description is required"),
      content: isNotEmpty("content is required"),
      deadline: isNotEmpty("date is required"),
      image: isNotEmpty("image is required"),
      goals: (value) =>
        !value || +value <= 0 ? "goals amount is required" : null,
    },
  });

  const handleFormError = (errors: typeof form.errors) => {
    if (errors.name) {
      notifications.show({ message: "Please fill name field", color: "red" });
    } else if (errors.email) {
      notifications.show({
        message: "Please provide a valid email",
        color: "red",
      });
    }
  };

  const handleFormSubmit = async (values: typeof form.values) => {
    const payload = {
      title: values.title!,
      description: values.description!,
      content: values.content,
      goals: values.goals!,
      deadline: new Date(values.deadline!).getTime(),
      image: await setFile(values.image!).then(async (response) => {
        return response?.path as string;
      }),
      is_over_goals: isOverGoals,
      is_zero_allowed: isZeroAllowed,
    };

    const textEditorImagesUploaded: textEditorImageProps[] = JSON.parse(
      JSON.stringify(textEditorImages)
    );

    if (textEditorImagesUploaded?.length > 0) {
      for (const textEditorImage of textEditorImagesUploaded) {
        // const indexOfEl = textEditorImagesUploaded.indexOf(textEditorImage);
        const newUrl = await setFile(
          (await fetch(textEditorImage.src).then((r) => r.blob())) as File
        ).then(async (response) => {
          return response?.path as string;
        });
        // textEditorImagesUploaded[indexOfEl].newSource = newUrl;
        console.log("before", JSON.parse(JSON.stringify(payload.content)));
        payload.content =
          payload.content?.replace(
            `${textEditorImage.src}">`,
            `${newUrl}"/>`
          ) ?? payload.content;
        console.log("after", JSON.parse(JSON.stringify(payload.content)));
      }
    }

    payload.content =
      (await setFile(payload.content!))?.hash ?? payload.content;

    await createProject(payload as any);
  };

  useDocumentTitle("Create Project - Fundconn");

  useEffect(() => {
    (async function () {
      if (imageFile) {
        form.setFieldValue("image", imageFile);
        blobToDataUrl(imageFile).then(async (response) => {
          setImageField(response as string);
        });
      }
    })();
  }, [imageFile]);

  useEffect(() => {
    form.setFieldValue("content", contentField);
  }, [contentField]);

  return (
    <>
      <form onSubmit={form.onSubmit(handleFormSubmit, handleFormError)}>
        <AppShell navbar={{ width: 500, breakpoint: "sm" }} padding="sm">
          <AppShell.Navbar
            p="sm"
            h={useMatches({
              base: "300px",
              md: "calc(100% - 50px)",
            })}
            style={useMatches({
              base: {
                width: "100%",
                position: "sticky",
                overflow: "hidden",
                top: "50px",
              },
              md: {
                overflow: "hidden",
              },
            })}
          >
            <AppShell.Section
              grow={useMatches({
                base: false,
                md: true,
              })}
            >
              <Input.Wrapper h="100%" error={form.getInputProps("image").error}>
                <BackgroundImage
                  src={useMatches({
                    base:
                      imageField ??
                      'https://placehold.co/600x400?text=your project"s image',
                    lg: imageField ?? "https://placehold.co/600x400?text=image",
                  })}
                  h={{
                    base: "100px",
                    md: "100%",
                  }}
                >
                  <Center p="md" h="100%" bg={rgba("black", 0.5)}>
                    <Flex
                      gap="sm"
                      direction={{
                        base: "column",
                        lg: "row",
                      }}
                    >
                      <FileButton
                        onChange={setImageFile}
                        accept="image/png,image/jpeg"
                      >
                        {(props) => <Button {...props}>Upload image</Button>}
                      </FileButton>
                      {imageField && (
                        <Button
                          hidden={true}
                          onClick={() => openImage(imageField)}
                        >
                          View
                        </Button>
                      )}
                    </Flex>
                  </Center>
                </BackgroundImage>
              </Input.Wrapper>
            </AppShell.Section>
            <AppShell.Section>
              <Stack mt="md">
                <TextInput
                  label="Title"
                  placeholder="Input Project Title"
                  rightSectionPointerEvents="all"
                  rightSection={
                    <CloseButton
                      aria-label="Clear input"
                      onClick={() => form.setFieldValue("title", null)}
                      style={{
                        display: form.getInputProps("title").value
                          ? undefined
                          : "none",
                      }}
                    />
                  }
                  key={form.key("title")}
                  {...form.getInputProps("title")}
                />

                <Button fullWidth disabled={!account} type="submit">
                  Save Project
                </Button>
              </Stack>
            </AppShell.Section>
          </AppShell.Navbar>
          <AppShell.Main py={0} my={0}>
            <Grid>
              <Grid.Col
                span={{
                  base: 12,
                  lg: 6,
                }}
              >
                {/* {Boolean(form.getInputProps("is_over_goals").value)} */}
                <Checkbox.Card
                  checked={isOverGoals}
                  onClick={() => {
                    setIsOverGoals((c) => !c);
                  }}
                >
                  <Group wrap="nowrap" align="flex-start" p="md">
                    <Checkbox.Indicator />
                    <Box>
                      <Text>Zero amount</Text>
                      <Text size="xs">
                        Allowing funders to send zero amount of funds
                      </Text>
                    </Box>
                  </Group>
                </Checkbox.Card>
              </Grid.Col>
              <Grid.Col
                span={{
                  base: 12,
                  lg: 6,
                }}
              >
                <Checkbox.Card
                  checked={isZeroAllowed}
                  onClick={() => {
                    setIsZeroAllowed((c) => !c);
                  }}
                >
                  <Group wrap="nowrap" align="flex-start" p="md">
                    <Checkbox.Indicator />
                    <Box>
                      <Text>Over funds amount</Text>
                      <Text size="xs">
                        Let funders to send funds over the goals amount
                      </Text>
                    </Box>
                  </Group>
                </Checkbox.Card>
              </Grid.Col>
            </Grid>
            <br />
            <NumberInput
              label="Funds Goals"
              description="You can put decimal here, ex: 0.15"
              placeholder="Ether"
              min={0}
              suffix=" ETH"
              key={form.key("goals")}
              {...form.getInputProps("goals")}
            />
            <br />
            <TextInput
              label="Description"
              placeholder="Input Project Description"
              rightSectionPointerEvents="all"
              key={form.key("description")}
              {...form.getInputProps("description")}
            />
            <br />
            <DateInput
              valueFormat="DD MMMM YYYY"
              label="Event Date"
              placeholder="Put the date of your event"
              minDate={dayjs(new Date(), { locale: "id" }).add(1).toDate()}
              key={form.key("deadline")}
              {...form.getInputProps("deadline")}
            />
            <br />
            <Input.Wrapper
              label="Content"
              error={form.getInputProps("content").error}
            >
              <TextEditor
                value={contentField}
                onChangeValue={setContentField}
                editor={null}
                onImagesChange={(value) => {
                  setTextEditorImages(value);
                }}
                children={undefined}
              />
            </Input.Wrapper>
          </AppShell.Main>
        </AppShell>
      </form>
    </>
  );
};
