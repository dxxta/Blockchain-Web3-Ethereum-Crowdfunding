import { Modal, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface State {
  openImage: React.Dispatch<React.SetStateAction<string | null>>;
  closeImage: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialState: State = {
  openImage: () => null,
  closeImage: () => null,
};

const ImageViewerContext = createContext<State>(initialState);
export const useImageViewerContext = () => useContext(ImageViewerContext);
export const ImageViewerProvider = ({ children }: { children: ReactNode }) => {
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [closeImage, setCloseImage] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    setOpenImage(null);
  }, [closeImage]);

  useEffect(() => {
    if (openImage) {
      open();
    } else {
      close();
    }
  }, [openImage]);

  return (
    <ImageViewerContext.Provider
      value={{
        openImage: setOpenImage,
        closeImage: setCloseImage,
      }}
    >
      <Modal
        size="xl"
        centered
        opened={opened}
        onClose={() => {
          close();
          setOpenImage(null);
        }}
        title="Image"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Image src={openImage} fit="contain" />
      </Modal>
      {children}
    </ImageViewerContext.Provider>
  );
};
