import { AuthProvider } from "@/Auth/context/AuthContext";
import "./globals.css";
import LayoutWrapper from "./sharedComponents/LayoutWrapper";

export const metadata = {
  title: "My App",
  description: "App description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}