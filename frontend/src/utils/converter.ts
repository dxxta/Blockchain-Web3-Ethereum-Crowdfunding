import { projectType } from "../context/Contract";

export const getProjectSlug = (project: projectType) => {
  return `${project.id}-${project.title
    ?.split(" ")
    ?.map((titleItem) => titleItem?.trim()?.toLowerCase())
    ?.join("-")}`;
};

export const blobToDataUrl = (blob: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
