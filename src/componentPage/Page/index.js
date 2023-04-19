import React from "react";
import { useRouter } from "next/router";

const Page = ({ pageComponent: Page, requireAuth }) => {
  const router = useRouter();
  React.useEffect(() => {
    // check if jwt is present
    const token = localStorage.getItem("token");
    if (!token && requireAuth) {
      router.push("/");
    }
  }, []);
  return <Page />;
};

export default Page;
