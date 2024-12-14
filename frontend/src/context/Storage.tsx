import { createContext, useContext, ReactNode } from "react";
import { create } from "kubo-rpc-client";
import { CID } from "multiformats/cid";

interface State {
  setFile: (value: File | string) => Promise<{
    cid: CID;
    hash: string;
    path: string;
  } | null>;
  getFile: (key: string) => Promise<File | null>;
}

const initialState: State = {
  setFile: () => Promise.resolve(null),
  getFile: () => Promise.resolve(null),
};

const StorageContext = createContext<State>(initialState);

export const useStorageContext = () => useContext(StorageContext);
export const StorageContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const prefix = "$START$";
  const client = create("/ip4/0.0.0.0/tcp/5001");
  const setFile = async (value: File | string) => {
    try {
      if (!value) return null;

      if (typeof value == "string") {
        value = prefix + value;
      }

      const result = await client.add(value);
      return {
        cid: result.cid,
        hash: result.cid.toString(),
        path: `${import.meta.env.VITE_IPFS}/${result.cid.toString()}`,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getFile = async (cid: string) => {
    try {
      if (!cid) return null;
      const chunks = [];
      for await (const data of client.get(cid)) {
        chunks.push(data);
      }
      return new File(chunks, "content");
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // useEffect(() => {
  //   (async function () {
  //     const content =
  //       "<p>Start typings here...</p><ul><li><p>Describe your project in detail... Why is it important? Who will benefit from it?</p></li><li><p>Share your story and explain how the funds will be used to bring your vision to life.</p></li><li><p>Write a compelling description that inspires others to support your campaign.</p></li><li><p>Highlight the key features of your event/project and what makes it unique.</p></li><li><p>Tell your audience why this project matters and how they can make an impact</p></li></ul>";
  //     const result = await client.add(
  //       new File([new Blob([content], { type: "text/plain" })], "content.txt", {
  //         type: "text/plain",
  //       })
  //     );

  //     console.log(`http://127.0.0.1:8080/ipfs/${result.cid.toString()}`);

  //     const chunks = [];
  //     for await (const data of client.get(result.cid.toString())) {
  //       chunks.push(data);
  //     }
  //     console.log(client.get);
  //     const file = new File(chunks, "content", { type: "text/plain" });
  //     console.log((await file.text()).toString());
  //   })();
  // }, []);

  return (
    <StorageContext.Provider
      value={{
        setFile,
        getFile,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};
