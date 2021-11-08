import { useEffect, useState } from "react";

export default function Page({ name, data }) {
  const [time, setTime] = useState("0");
  const [canAccessPage, setCanAccessPage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function access() {
      const canAccessPage = await getCanAccess({ name });
      setCanAccessPage(canAccessPage as boolean);
      setLoading(false);
    }

    setTime(new Date().toISOString());
    access();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(data);
  return canAccessPage ? (
    <div>
      <div>name: {name}</div>
      <h1>{data?.title}</h1>
      <p>{data?.content}</p>
      <p>{time}</p>
    </div>
  ) : (
    <div>you can't access this page</div>
  );
}

export async function getStaticPaths() {
  const pages = await getPages();

  const paths = pages.map((post) => ({
    params: { page: post.name },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const data = await getPageData({ page: params.page });

  return {
    props: {
      ...data,
    },
  };
}

async function getPages() {
  return [
    {
      name: "page1",
    },
    {
      name: "page2",
    },
    {
      name: "page3",
    },
  ];
}

async function getPageData({ page }) {
  const pages = [
    {
      name: "page1",
      data: {
        title: "Page 1",
        content: "This is page 1",
      },
    },
    {
      name: "page2",
      data: {
        title: "Page 2",
        content: "This is page 2",
      },
    },
    {
      name: "page3",
      data: {
        title: "Page 3",
        content: "This is page 3",
      },
    },
  ];

  const data = pages.find((p) => p.name === page);
  return data;
}

export async function getCanAccess({ name }) {
  const pageAccess = [
    {
      name: "page1",
      access: false,
    },
    {
      name: "page2",
      access: true,
    },
    {
      name: "page3",
      access: true,
    },
  ];

  const canAccessPage = pageAccess.find((p) => p.name === name);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(canAccessPage.access || false);
    }, 1000);
  });
}
