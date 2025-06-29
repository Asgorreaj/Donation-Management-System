import { MfiProvider } from "@/context/MfiContext";
import * as React from "react";

export default async function MfiLayout({
                                          children,
                                          params,
                                        }: {
  children: React.ReactNode;
  params: Promise<{ mfi: string }>;
}) {
  const { mfi } = await params;

  return (
    <MfiProvider mfi={mfi}>{children}</MfiProvider>
  );
}
