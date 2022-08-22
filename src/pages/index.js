import * as React from "react";
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif"
};

const syntaxHighlight = (json) => {
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
};
const IndexPage = (context) => {
  let contextJSON = JSON.stringify(context, undefined, 4);
  console.info("SSR Context", contextJSON);
  return (
    <main style={pageStyles}>
      <div
        dangerouslySetInnerHTML={{
          __html: syntaxHighlight(contextJSON)
        }}
      />
      <img alt="Happy dog" src={context.serverData.image.message} />
    </main>
  );
};

export default IndexPage;

export async function getServerData(pageContext) {
  try {
    const res = await fetch(`https://dog.ceo/api/breeds/image/random`);
    if (!res.ok) {
      throw new Error(`Response failed`);
    }
    return {
      props: {
        image: await res.json(),
        context: pageContext
      }
    };
  } catch (error) {
    return {
      status: 500,
      headers: {},
      props: {}
    };
  }
}

export const Head = () => <title>Home Page</title>;
