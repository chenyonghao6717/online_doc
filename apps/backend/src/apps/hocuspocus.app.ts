import { Server } from "@hocuspocus/server";
import { prisma } from "@/lib/db";
import { auth, type Session } from "@/lib/auth";
import * as Y from "yjs";

const port = Number.parseInt(`${process.env.WEB_SOCKET_PORT}`);

interface Context {
  session: Session;
}

export const wsServer = new Server({
  name: "hocuspocus",
  port,
  timeout: 30000,
  debounce: 5000,
  maxDebounce: 30000,
  quiet: true,
  extensions: [
    {
      // documentName is a fixed field that cannot be renamed. FE passes documentId in this field.
      async onAuthenticate({ token }) {
        const session = await auth.api.getSession({
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (!session) {
          throw new Error("Unauthorized");
        }

        return {
          session,
        };
      },
      async onLoadDocument({ documentName, context }) {
        const document = await prisma.document.findUnique({
          where: { id: documentName },
        });

        if (!document) {
          throw new Error("Not Found");
        }

        const { session } = context as Context;
        if (
          document.ownerId !== session.user.id &&
          document.organizationId !== session.session.activeOrganizationId
        ) {
          throw new Error("Not Found");
        }

        const yDoc = new Y.Doc();
        if (document.content) {
          Y.applyUpdate(yDoc, document.content);
        }
        return yDoc;
      },
      async onStoreDocument({ document, documentName }) {
        const stateVector = Y.encodeStateAsUpdate(document);
        await prisma.document.update({
          where: {
            id: documentName,
          },
          data: {
            content: Buffer.from(stateVector),
          },
        });
        document.broadcastStateless(JSON.stringify({
          event: "DOCUMENT_SAVED"
        }));
      },
    },
  ],
});
