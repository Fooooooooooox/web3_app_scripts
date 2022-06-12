import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import Web3 from "web3";

export const web3 = new Web3('wss://mainnet.infura.io/ws/v3/57e665ef67b44c4687ad529b8b89397c');

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  let markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
